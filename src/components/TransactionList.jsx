import React, { useState, useMemo } from 'react';
import { Search, Trash2, Edit2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatDateShort } from '../utils/helpers';
import TransactionForm from './TransactionForm';

export default function TransactionList() {
  const { transactions, categories, deleteTransaction, selectedMonth } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, einnahme, ausgabe
  const [sortConfig, setSortConfig] = useState({ key: 'datum', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        t => t.empfaenger.toLowerCase().includes(lowerSearch) || 
             (t.verwendungszweck && t.verwendungszweck.toLowerCase().includes(lowerSearch))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(t => t.kategorie === categoryFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(t => t.typ === typeFilter);
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'datum') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Prioritize selected month
    const selectedMonthStr = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}`;
    result.sort((a, b) => {
      const aInMonth = a.datum.startsWith(selectedMonthStr);
      const bInMonth = b.datum.startsWith(selectedMonthStr);
      if (aInMonth && !bInMonth) return -1;
      if (!aInMonth && bInMonth) return 1;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, categoryFilter, typeFilter, sortConfig, selectedMonth]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm('Transaktion wirklich löschen?')) {
      deleteTransaction(id);
    }
  };

  const openEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Transaktionen</h1>
        <span className="text-gray-500 dark:text-gray-400">{filteredAndSortedTransactions.length} Transaktionen</span>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field w-full md:w-48"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 border border-gray-300 rounded-l-md ${typeFilter === 'all' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`}
            >
              Alle
            </button>
            <button
              onClick={() => setTypeFilter('einnahme')}
              className={`px-4 py-2 border-t border-b border-gray-300 ${typeFilter === 'einnahme' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`}
            >
              Einnahmen
            </button>
            <button
              onClick={() => setTypeFilter('ausgabe')}
              className={`px-4 py-2 border border-gray-300 rounded-r-md ${typeFilter === 'ausgabe' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`}
            >
              Ausgaben
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('datum')}>Datum {sortConfig.key === 'datum' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th className="p-4">Empfänger</th>
              <th className="p-4 hidden md:table-cell">Kategorie</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('betrag')}>Betrag {sortConfig.key === 'betrag' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th className="p-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.map(t => {
              const cat = categories.find(c => c.id === t.kategorie);
              const isEinnahme = t.typ === 'einnahme';
              return (
                <React.Fragment key={t.id}>
                  <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-4 text-gray-600 dark:text-gray-300">{formatDateShort(new Date(t.datum))}</td>
                    <td className="p-4">
                      <div className="flex items-center cursor-pointer" onClick={() => setExpandedRow(expandedRow === t.id ? null : t.id)}>
                        {expandedRow === t.id ? <ChevronDown size={16} className="mr-2 text-gray-400" /> : <ChevronRight size={16} className="mr-2 text-gray-400" />}
                        <span className="font-medium dark:text-white">{t.empfaenger}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {cat ? (
                        <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                          {cat.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Unkategorisiert</span>
                      )}
                    </td>
                    <td className={`p-4 font-bold ${isEinnahme ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isEinnahme ? '+' : '-'}{formatCurrency(t.betrag)}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full mr-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === t.id && (
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <td colSpan="5" className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Verwendungszweck:</strong> {t.verwendungszweck || '-'}
                        {t.notiz && <><br /><strong>Notiz:</strong> {t.notiz}</>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {filteredAndSortedTransactions.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Keine Transaktionen gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-10"
      >
        <Plus size={24} />
      </button>

      {isFormOpen && (
        <TransactionForm
          isOpen={isFormOpen}
          onClose={closeForm}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
}
