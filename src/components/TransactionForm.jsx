import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { categorizeTransaction } from '../utils/categorizer';
import { generateId } from '../utils/helpers';

export default function TransactionForm({ isOpen, onClose, transaction }) {
  const { categories, rules, addTransaction, updateTransaction } = useFinance();
  
  const [formData, setFormData] = useState({
    typ: 'ausgabe',
    datum: new Date().toISOString().split('T')[0],
    betrag: '',
    empfaenger: '',
    verwendungszweck: '',
    kategorie: '',
    notiz: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        datum: transaction.datum.split('T')[0]
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'empfaenger' || name === 'verwendungszweck') {
      const suggestedCategory = categorizeTransaction({ ...formData, [name]: value }, rules);
      if (suggestedCategory) {
        setFormData(prev => ({ ...prev, kategorie: suggestedCategory }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.datum) newErrors.datum = 'Datum ist erforderlich';
    if (!formData.betrag || isNaN(formData.betrag) || Number(formData.betrag) <= 0) newErrors.betrag = 'Gültiger Betrag erforderlich';
    if (!formData.empfaenger.trim()) newErrors.empfaenger = 'Empfänger ist erforderlich';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionData = {
      ...formData,
      betrag: Number(formData.betrag),
      id: transaction ? transaction.id : generateId()
    };

    if (transaction) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">
            {transaction ? 'Transaktion bearbeiten' : 'Transaktion hinzufügen'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              type="button"
              onClick={() => setFormData({...formData, typ: 'einnahme'})}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${formData.typ === 'einnahme' ? 'bg-green-500 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Einnahme
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, typ: 'ausgabe'})}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${formData.typ === 'ausgabe' ? 'bg-red-500 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Ausgabe
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum *</label>
              <input type="date" name="datum" value={formData.datum} onChange={handleChange} className="input-field w-full" />
              {errors.datum && <p className="text-red-500 text-xs mt-1">{errors.datum}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Betrag (€) *</label>
              <input type="number" step="0.01" name="betrag" value={formData.betrag} onChange={handleChange} placeholder="0.00" className="input-field w-full" />
              {errors.betrag && <p className="text-red-500 text-xs mt-1">{errors.betrag}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Empfänger / Absender *</label>
            <input type="text" name="empfaenger" value={formData.empfaenger} onChange={handleChange} className="input-field w-full" />
            {errors.empfaenger && <p className="text-red-500 text-xs mt-1">{errors.empfaenger}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategorie</label>
            <select name="kategorie" value={formData.kategorie} onChange={handleChange} className="select-field w-full">
              <option value="">Keine Kategorie</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verwendungszweck</label>
            <input type="text" name="verwendungszweck" value={formData.verwendungszweck} onChange={handleChange} className="input-field w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notiz</label>
            <textarea name="notiz" value={formData.notiz} onChange={handleChange} className="input-field w-full h-20 resize-none"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              Abbrechen
            </button>
            <button type="submit" className="btn-primary">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
