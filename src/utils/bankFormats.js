export const bankFormats = {
  sparkasse: {
    name: 'Sparkasse',
    encoding: 'iso-8859-1',
    delimiter: ';',
    dateField: 'Buchungstag',
    empfaengerField: 'Auftraggeber / Begünstigter',
    betragField: 'Betrag',
    verwendungszweckField: 'Verwendungszweck',
    dateFormat: 'DD.MM.YY',
    decimalSeparator: ',',
  },
  ing: {
    name: 'ING',
    encoding: 'utf-8',
    delimiter: ';',
    dateField: 'Buchung',
    empfaengerField: 'Auftraggeber/Empfänger',
    betragField: 'Betrag',
    verwendungszweckField: 'Verwendungszweck',
    dateFormat: 'DD.MM.YYYY',
    decimalSeparator: ',',
  },
  n26: {
    name: 'N26',
    encoding: 'utf-8',
    delimiter: ',',
    dateField: 'Date',
    empfaengerField: 'Payee',
    betragField: 'Amount (EUR)',
    verwendungszweckField: 'Payment reference',
    dateFormat: 'YYYY-MM-DD',
    decimalSeparator: '.',
  },
  dkb: {
    name: 'DKB',
    encoding: 'iso-8859-1',
    delimiter: ';',
    dateField: 'Buchungstag',
    empfaengerField: 'Auftraggeber / Begünstigter',
    betragField: 'Betrag (EUR)',
    verwendungszweckField: 'Verwendungszweck',
    dateFormat: 'DD.MM.YYYY',
    decimalSeparator: ',',
  },
  vrbank: {
    name: 'VR-Bank / Volksbank',
    encoding: 'iso-8859-1',
    delimiter: ';',
    dateField: 'Buchungstag',
    empfaengerField: 'Empfänger/Zahlungspflichtiger',
    betragField: 'Betrag',
    verwendungszweckField: 'Vorgang/Verwendungszweck',
    dateFormat: 'DD.MM.YYYY',
    decimalSeparator: ',',
  },
  commerzbank: {
    name: 'Commerzbank',
    encoding: 'utf-8',
    delimiter: ';',
    dateField: 'Buchungstag',
    empfaengerField: 'Auftraggeber / Begünstigter',
    betragField: 'Betrag',
    verwendungszweckField: 'Buchungstext',
    dateFormat: 'DD.MM.YYYY',
    decimalSeparator: ',',
  },
};

export function detectBankFormat(headers) {
  const headerStr = headers.map(h => h.trim().toLowerCase()).join('|');
  if (headerStr.includes('amount (eur)') && headerStr.includes('payee')) return 'n26';
  if (headerStr.includes('betrag (eur)') && headerStr.includes('buchungstag')) return 'dkb';
  if (headerStr.includes('empfänger/zahlungspflichtiger')) return 'vrbank';
  if (headerStr.includes('auftraggeber/empfänger') && !headerStr.includes('begünstigter')) return 'ing';
  if (headerStr.includes('buchungstext') && headerStr.includes('commerzbank')) return 'commerzbank';
  return 'sparkasse';
}
