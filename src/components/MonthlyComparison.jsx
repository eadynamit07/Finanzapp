import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { filterByMonth, calculateMonthlyStats, formatCurrency } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm mb-1">
            <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
            <span className="text-gray-800 dark:text-gray-200">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlyComparison = () => {
  const { transactions, selectedMonth } = useFinance();

  const data = useMemo(() => {
    const result = [];
    const monthsNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    
    // Generate data for the last 6 months up to selectedMonth
    for (let i = 5; i >= 0; i--) {
      let d = new Date(selectedMonth.year, selectedMonth.month - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const monthTxs = filterByMonth(transactions, y, m);
      const stats = calculateMonthlyStats(monthTxs);
      
      result.push({
        name: `${monthsNames[m]} ${y.toString().slice(2)}`,
        Einnahmen: stats.einnahmen,
        Ausgaben: stats.ausgaben
      });
    }
    
    return result;
  }, [transactions, selectedMonth]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Monatsvergleich</h2>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `€${val}`}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Einnahmen" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Ausgaben" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparison;
