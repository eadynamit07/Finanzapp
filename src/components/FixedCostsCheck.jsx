import React, { useMemo } from 'react';
import { Shield } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { detectFixedCosts } from '../utils/categorizer';
import { formatCurrency } from '../utils/helpers';

const FixedCostsCheck = () => {
  const { transactions, categories } = useFinance();

  const fixedCosts = useMemo(() => {
    return detectFixedCosts(transactions);
  }, [transactions]);

  const totalFixedCosts = fixedCosts.reduce((sum, item) => sum + item.durchschnittsBetrag, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="text-indigo-500" size={24} />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fixkosten-Check</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        {fixedCosts.length > 0 ? (
          <div className="space-y-3 pr-2">
            {fixedCosts.map((cost, idx) => {
              const cat = categories.find(c => c.id === cost.kategorie);
              return (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{cost.empfaenger}</span>
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      {cat && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.name}
                        </span>
                      )}
                      <span className="text-gray-500">{cost.anzahlMonate} Monate erkannt</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(cost.durchschnittsBetrag)}/m
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-gray-500 dark:text-gray-400">
              Es wurden noch keine regelmäßigen Fixkosten erkannt. Importieren Sie mehr Transaktionen über mehrere Monate, um Fixkosten automatisch zu erkennen.
            </p>
          </div>
        )}
      </div>

      {fixedCosts.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Geschätzte Fixkosten pro Monat</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalFixedCosts)}</span>
        </div>
      )}
    </div>
  );
};

export default FixedCostsCheck;
