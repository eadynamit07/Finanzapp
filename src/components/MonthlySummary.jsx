import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { filterByMonth, calculateMonthlyStats, formatCurrency, formatDate, getMonthName } from '../utils/helpers';

const MonthlySummary = () => {
  const { transactions, selectedMonth } = useFinance();

  const { stats, recentTransactions } = useMemo(() => {
    const currentMonthTransactions = filterByMonth(transactions, selectedMonth.year, selectedMonth.month);
    const stats = calculateMonthlyStats(currentMonthTransactions);
    
    const recent = [...currentMonthTransactions]
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
      .slice(0, 5);
      
    return { stats, recentTransactions: recent };
  }, [transactions, selectedMonth]);

  const netto = stats.einnahmen - stats.ausgaben;
  const isPositive = netto >= 0;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Monatszusammenfassung {getMonthName(selectedMonth.month)}
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 text-lg">Einnahmen</span>
          <span className="text-green-600 dark:text-green-400 text-xl font-medium">{formatCurrency(stats.einnahmen)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 text-lg">Ausgaben</span>
          <span className="text-red-600 dark:text-red-400 text-xl font-medium">{formatCurrency(stats.ausgaben)}</span>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-4 flex justify-between items-center">
          <span className="text-gray-800 dark:text-gray-200 font-bold text-xl">Netto</span>
          <span className={`text-2xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}{formatCurrency(netto)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Letzte Transaktionen</h3>
        {recentTransactions.length > 0 ? (
          <ul className="space-y-3">
            {recentTransactions.map(tx => (
              <li key={tx.id} className="flex justify-between items-center text-sm">
                <div className="flex flex-col truncate pr-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{tx.empfaenger || tx.verwendungszweck || 'Unbekannt'}</span>
                  <span className="text-gray-500 text-xs">{formatDate(tx.datum)}</span>
                </div>
                <span className={`font-medium whitespace-nowrap ${tx.typ === 'einnahme' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.typ === 'einnahme' ? '+' : '-'}{formatCurrency(tx.betrag)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">Keine Transaktionen in diesem Monat.</p>
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;
