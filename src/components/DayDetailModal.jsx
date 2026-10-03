import React, { useState } from 'react';
import { X, Trash2, Edit2, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/helpers';
import TransactionForm from './TransactionForm';

export default function DayDetailModal({ isOpen, onClose, date, transactions }) {
  const { categories, deleteTransaction } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen) return null;

  const weekdaysGerman = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const monthsGerman = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  const formattedDate = `${weekdaysGerman[date.getDay()]}, ${date.getDate()}. ${monthsGerman[date.getMonth()]} ${date.getFullYear()}`;

  const einnahmen = transactions.filter(t => t.typ === 'einnahme').reduce((sum, t) => sum + t.betrag, 0);
  const ausgaben = transactions.filter(t => t.typ === 'ausgabe').reduce((sum, t) => sum + t.betrag, 0);
  const netto = einnahmen - ausgaben;

  const handleDelete = (id) => {
    if (window.confirm('Transaktion wirklich löschen?')) {
      deleteTransaction(id);
    }
  };

  const openForm = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">{formattedDate}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-between rounded-lg m-6 border dark:border-gray-800">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Einnahmen</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(einnahmen)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ausgaben</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(ausgaben)}</p>
          </div>
          <div className="text-center border-l pl-6 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Netto</p>
            <p className={`text-lg font-bold ${netto >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netto)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          {transactions.length > 0 ? (
            transactions.map(t => {
              const cat = categories.find(c => c.id === t.kategorie);
              const isEinnahme = t.typ === 'einnahme';
              return (
                <div key={t.id} className="card p-4 flex items-center justify-between hover:border-primary-300 transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold dark:text-white">{t.empfaenger}</h4>
                      <span className={`font-bold ${isEinnahme ? 'text-green-600' : 'text-red-600'}`}>
                        {isEinnahme ? '+' : '-'}{formatCurrency(t.betrag)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.verwendungszweck}</p>
                    {cat && (
                      <span className="inline-block px-2 py-1 rounded-md text-xs" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                        {cat.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => openForm(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Keine Transaktionen an diesem Tag.
            </div>
          )}
        </div>

        <div className="p-6 border-t dark:border-gray-800">
          <button onClick={() => openForm()} className="w-full btn-primary flex justify-center items-center gap-2">
            <Plus size={20} />
            Neue Transaktion
          </button>
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          isOpen={isFormOpen}
          onClose={closeForm}
          transaction={editingTransaction || { datum: date.toISOString().split('T')[0] }}
        />
      )}
    </div>
  );
}
