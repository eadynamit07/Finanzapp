import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { filterByMonth, calculateMonthlyStats, formatCurrency } from '../utils/helpers';
import CategoryChart from './CategoryChart';
import MonthlyComparison from './MonthlyComparison';
import MonthlySummary from './MonthlySummary';
import FixedCostsCheck from './FixedCostsCheck';

const Dashboard = () => {
  const { transactions, selectedMonth } = useFinance();

  const { 
    currentStats, 
    prevStats,
    kontostand 
  } = useMemo(() => {
    // Current month stats
    const currentMonthTransactions = filterByMonth(transactions, selectedMonth.year, selectedMonth.month);
    const current = calculateMonthlyStats(currentMonthTransactions);
    
    // Previous month stats
    const prevMonthDate = new Date(selectedMonth.year, selectedMonth.month - 1, 1);
    const prevMonthTransactions = filterByMonth(transactions, prevMonthDate.getFullYear(), prevMonthDate.getMonth());
    const prev = calculateMonthlyStats(prevMonthTransactions);
    
    // Total Kontostand (all time)
    const allTimeStats = calculateMonthlyStats(transactions);
    const balance = allTimeStats.einnahmen - allTimeStats.ausgaben;

    return { currentStats: current, prevStats: prev, kontostand: balance };
  }, [transactions, selectedMonth]);

  const currentErsparnis = currentStats.einnahmen - currentStats.ausgaben;
  const prevErsparnis = prevStats.einnahmen - prevStats.ausgaben;

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const renderPercentageChange = (current, previous, invertColors = false) => {
    const change = calculateChange(current, previous);
    if (change === 0) return <span className="text-gray-500 text-xs">Keine Änderung</span>;
    
    const isPositive = change > 0;
    // For expenses, an increase is "bad" (red), so we invert. For income/savings, increase is "good" (green)
    const isGood = invertColors ? !isPositive : isPositive;
    
    const colorClass = isGood ? 'text-green-500' : 'text-red-500';
    const sign = isPositive ? '+' : '';
    
    return (
      <span className={`${colorClass} text-xs font-medium`}>
        {sign}{change.toFixed(1)}% vs. Vormonat
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Kontostand (Gesamt)</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(kontostand)}</h3>
          </div>
        </div>

        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Einnahmen</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(currentStats.einnahmen)}</h3>
            {renderPercentageChange(currentStats.einnahmen, prevStats.einnahmen)}
          </div>
        </div>

        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ausgaben</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(currentStats.ausgaben)}</h3>
            {renderPercentageChange(currentStats.ausgaben, prevStats.ausgaben, true)}
          </div>
        </div>

        <div className="card p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <PiggyBank size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ersparnis</p>
            <h3 className={`text-2xl font-bold ${currentErsparnis >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(currentErsparnis)}
            </h3>
            {renderPercentageChange(currentErsparnis, prevErsparnis)}
          </div>
        </div>
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 md:p-6 h-96">
          <CategoryChart />
        </div>
        <div className="card p-4 md:p-6 h-96">
          <MonthlyComparison />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 md:p-6">
          <MonthlySummary />
        </div>
        <div className="card p-4 md:p-6">
          <FixedCostsCheck />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
