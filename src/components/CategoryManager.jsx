import React, { useState } from 'react';
import { Trash2, Edit2, Plus, AlertTriangle, Save, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { generateId } from '../utils/helpers';

export default function CategoryManager() {
  const { categories, rules, transactions, addCategory, updateCategory, deleteCategory, addRule, deleteRule, recategorizeAll } = useFinance();
  
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatData, setEditCatData] = useState({});
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [newRule, setNewRule] = useState({ categoryId: '', field: 'empfaenger', operator: 'contains', value: '' });

  const startEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditCatData(cat);
  };

  const saveEditCat = () => {
    if (editCatData.name.trim()) {
      updateCategory(editCatData);
      setEditingCatId(null);
    }
  };

  const saveNewCat = () => {
    if (editCatData.name?.trim()) {
      addCategory({ ...editCatData, id: generateId(), icon: 'Tag' });
      setIsAddingCat(false);
      setEditCatData({});
    }
  };

  const handleDeleteCat = (id) => {
    if (window.confirm('Kategorie wirklich löschen? Transaktionen behalten ihre Kategorie-ID, sind aber nicht mehr zugeordnet.')) {
      deleteCategory(id);
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (newRule.categoryId && newRule.value.trim()) {
      addRule({ ...newRule, id: generateId() });
      setNewRule({ ...newRule, value: '' });
    }
  };

  const getTransactionCountForCategory = (catId) => {
    return transactions.filter(t => t.kategorie === catId).length;
  };

  const handleRecategorize = () => {
    if (window.confirm('Achtung: Dies wird ALLE Transaktionen basierend auf den aktuellen Regeln neu kategorisieren. Manuell gesetzte Kategorien könnten überschrieben werden. Fortfahren?')) {
      recategorizeAll();
      alert('Neu-Kategorisierung abgeschlossen.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white mb-6">Kategorien & Regeln</h1>
        
        <h2 className="text-xl font-semibold dark:text-white mb-4">Kategorien</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="card p-4 flex flex-col justify-between h-32">
              {editingCatId === cat.id ? (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={editCatData.name} 
                    onChange={e => setEditCatData({...editCatData, name: e.target.value})}
                    className="input-field w-full py-1 px-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={editCatData.color} 
                      onChange={e => setEditCatData({...editCatData, color: e.target.value})}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <div className="flex ml-auto gap-1">
                      <button onClick={saveEditCat} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={16} /></button>
                      <button onClick={() => setEditingCatId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X size={16} /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-semibold dark:text-white">{cat.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEditCat(cat)} className="text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteCat(cat.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                    {getTransactionCountForCategory(cat.id)} Transaktionen
                  </div>
                </>
              )}
            </div>
          ))}

          {isAddingCat ? (
            <div className="card p-4 border-2 border-primary-300 dark:border-primary-700 border-dashed bg-primary-50/50 dark:bg-primary-900/10">
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Name"
                  value={editCatData.name || ''} 
                  onChange={e => setEditCatData({...editCatData, name: e.target.value})}
                  className="input-field w-full py-1 px-2 text-sm"
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={editCatData.color || '#3B82F6'} 
                    onChange={e => setEditCatData({...editCatData, color: e.target.value})}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <div className="flex ml-auto gap-1">
                    <button onClick={saveNewCat} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={16} /></button>
                    <button onClick={() => {setIsAddingCat(false); setEditCatData({});}} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => { setIsAddingCat(true); setEditCatData({ color: '#3B82F6' }); }}
              className="card p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 flex flex-col items-center justify-center text-gray-500 hover:text-primary-500 transition-colors h-32 bg-transparent shadow-none"
            >
              <Plus size={24} className="mb-2" />
              <span>Neue Kategorie</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t dark:border-gray-800 pt-8">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Automatische Regeln</h2>
        
        <div className="card overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-sm">
              <tr>
                <th className="p-4">Kategorie</th>
                <th className="p-4">Regel</th>
                <th className="p-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {rules.map(rule => {
                const cat = categories.find(c => c.id === rule.categoryId);
                const opText = rule.operator === 'contains' ? 'enthält' : rule.operator === 'startsWith' ? 'beginnt mit' : 'ist genau';
                return (
                  <tr key={rule.id}>
                    <td className="p-4">
                      {cat && (
                        <span className="inline-block px-2 py-1 rounded-md text-sm" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                          {cat.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 dark:text-gray-300">
                      Wenn Empfänger <span className="font-semibold">{opText}</span> "{rule.value}"
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteRule(rule.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rules.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">Keine Regeln definiert.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleAddRule} className="card p-6 bg-gray-50/50 dark:bg-gray-800/30">
          <h3 className="font-semibold mb-4 dark:text-white">Neue Regel hinzufügen</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              value={newRule.categoryId} 
              onChange={e => setNewRule({...newRule, categoryId: e.target.value})}
              className="select-field flex-1"
              required
            >
              <option value="">Kategorie wählen...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            
            <select 
              value={newRule.operator} 
              onChange={e => setNewRule({...newRule, operator: e.target.value})}
              className="select-field md:w-48"
            >
              <option value="contains">enthält</option>
              <option value="startsWith">beginnt mit</option>
              <option value="exact">ist genau</option>
            </select>

            <input 
              type="text" 
              placeholder="Schlüsselwort" 
              value={newRule.value} 
              onChange={e => setNewRule({...newRule, value: e.target.value})}
              className="input-field flex-1"
              required
            />
            
            <button type="submit" className="btn-primary whitespace-nowrap">Hinzufügen</button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-4">
          <AlertTriangle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">Alle Transaktionen neu kategorisieren</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1 mb-3">
              Wende alle aktuellen Regeln auf deine bestehenden Transaktionen an. 
              <strong>Achtung:</strong> Manuell geänderte Kategorien können dabei überschrieben werden!
            </p>
            <button onClick={handleRecategorize} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition-colors">
              Jetzt neu kategorisieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
