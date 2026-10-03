import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { parseCSV } from '../utils/csvParser';
import { bankFormats } from '../utils/bankFormats';
import { categorizeTransaction } from '../utils/categorizer';
import { formatCurrency, formatDateShort } from '../utils/helpers';

export default function CsvImport() {
  const { categories, rules, importTransactions } = useFinance();
  const [selectedBank, setSelectedBank] = useState('auto');
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Bitte nur CSV-Dateien hochladen.');
      return;
    }
    
    setError(null);
    setSuccess(false);

    try {
      const text = await file.text();
      const transactions = parseCSV(text, selectedBank);
      
      const categorized = transactions.map(t => ({
        ...t,
        kategorie: categorizeTransaction(t, rules) || ''
      }));

      setParsedData(categorized);
    } catch (err) {
      setError('Fehler beim Parsen der Datei. Bitte überprüfe das Format.');
      console.error(err);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [selectedBank, rules]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const confirmImport = () => {
    if (parsedData) {
      importTransactions(parsedData);
      setSuccess(true);
      setParsedData(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold dark:text-white">CSV Import</h1>

      {!parsedData && !success && (
        <>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">1. Bank auswählen</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedBank('auto')}
                className={`p-4 rounded-xl border-2 transition-all ${selectedBank === 'auto' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
              >
                <div className="font-medium dark:text-white">Automatisch erkennen</div>
              </button>
              {Object.keys(bankFormats).map(bankKey => (
                <button
                  key={bankKey}
                  onClick={() => setSelectedBank(bankKey)}
                  className={`p-4 rounded-xl border-2 transition-all capitalize ${selectedBank === bankKey ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
                >
                  <div className="font-medium dark:text-white">{bankKey}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">2. Datei hochladen</h2>
            <label 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Upload size={48} className={`mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">CSV-Datei hierher ziehen oder klicken zum Auswählen</p>
              <p className="text-sm text-gray-500 mt-2">Nur .csv Dateien werden unterstützt</p>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
            </label>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        </>
      )}

      {parsedData && (
        <div className="card p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">3. Vorschau</h2>
            <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 py-1 px-3 rounded-full text-sm font-medium">
              {parsedData.length} Transaktionen gefunden
            </span>
          </div>

          <div className="overflow-x-auto border dark:border-gray-700 rounded-lg max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="p-3">Datum</th>
                  <th className="p-3">Empfänger</th>
                  <th className="p-3">Betrag</th>
                  <th className="p-3">Erkannte Kategorie</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {parsedData.slice(0, 10).map((t, i) => {
                  const cat = categories.find(c => c.id === t.kategorie);
                  const isEinnahme = t.typ === 'einnahme';
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3 text-gray-600 dark:text-gray-400">{formatDateShort(new Date(t.datum))}</td>
                      <td className="p-3 font-medium dark:text-gray-200">{t.empfaenger}</td>
                      <td className={`p-3 font-semibold ${isEinnahme ? 'text-green-600' : 'text-red-600'}`}>
                        {isEinnahme ? '+' : '-'}{formatCurrency(t.betrag)}
                      </td>
                      <td className="p-3">
                        {cat ? (
                           <span className="inline-block px-2 py-1 rounded-md text-xs" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                           {cat.name}
                         </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Keine</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <div className="p-3 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 text-sm">
                + {parsedData.length - 10} weitere Transaktionen
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setParsedData(null)} className="btn-secondary flex-1">
              Abbrechen
            </button>
            <button onClick={confirmImport} className="btn-primary flex-1">
              {parsedData.length} Transaktionen importieren
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="card p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Import erfolgreich!</h2>
          <p className="text-gray-600 dark:text-gray-400">Die Transaktionen wurden erfolgreich zu deinem Konto hinzugefügt.</p>
          <button onClick={() => setSuccess(false)} className="btn-primary mt-4">
            Weiteren Import starten
          </button>
        </div>
      )}
    </div>
  );
}
