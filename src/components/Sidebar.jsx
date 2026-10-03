import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Calendar, Tags, Upload, Building2, Download, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { transactions, categories, rules } = useFinance();

  const handleExportData = () => {
    const data = {
      transactions,
      categories,
      rules,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `finanztracker_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/transaktionen', icon: <List size={20} />, label: 'Transaktionen' },
    { to: '/kalender', icon: <Calendar size={20} />, label: 'Kalender' },
    { to: '/kategorien', icon: <Tags size={20} />, label: 'Kategorien' },
    { to: '/import', icon: <Upload size={20} />, label: 'CSV Import' },
    { to: '/bankanbindung', icon: <Building2 size={20} />, label: 'Bankanbindung' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">💰 FinanzTracker</span>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (isOpen) onClose(); }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Daten exportieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
