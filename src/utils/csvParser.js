import Papa from 'papaparse';
import { generateId, parseGermanNumber } from './helpers';
import { bankFormats, detectBankFormat } from './bankFormats';

const parseDate = (dateStr, format) => {
  if (!dateStr) return new Date().toISOString();
  
  if (format === 'YYYY-MM-DD') {
    return new Date(dateStr).toISOString();
  }

  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = parts[2];
    
    if (year.length === 2) {
      year = `20${year}`;
    }
    
    return new Date(`${year}-${month}-${day}T12:00:00Z`).toISOString();
  }
  
  return new Date().toISOString();
};

const parseBetrag = (betragStr, decimalSeparator) => {
  if (typeof betragStr === 'number') return betragStr;
  if (!betragStr) return 0;
  
  let cleanStr = String(betragStr).trim();
  
  if (decimalSeparator === ',') {
    cleanStr = cleanStr.replace(/\./g, '').replace(/,/g, '.');
  } else {
    cleanStr = cleanStr.replace(/,/g, '');
  }
  
  return parseFloat(cleanStr);
};

export const parseCSV = (file, bankFormatKey) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.data.length === 0) {
            return resolve([]);
          }

          let formatKey = bankFormatKey;
          if (formatKey === 'auto') {
            const headers = Object.keys(results.data[0]);
            formatKey = detectBankFormat(headers);
          }

          const format = bankFormats[formatKey] || bankFormats.sparkasse;
          
          const transactions = results.data.map(row => {
            const rawBetrag = row[format.betragField];
            if (rawBetrag === undefined || rawBetrag === null || rawBetrag === '') return null;
            
            const parsedBetrag = parseBetrag(rawBetrag, format.decimalSeparator);
            const isEinnahme = parsedBetrag >= 0;
            
            return {
              id: generateId(),
              datum: parseDate(row[format.dateField], format.dateFormat),
              betrag: Math.abs(parsedBetrag),
              empfaenger: row[format.empfaengerField] || '',
              verwendungszweck: row[format.verwendungszweckField] || '',
              kategorie: 'sonstiges',
              typ: isEinnahme ? 'einnahme' : 'ausgabe',
              notiz: ''
            };
          }).filter(Boolean);

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
