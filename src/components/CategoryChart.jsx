import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { filterByMonth, groupByCategory, formatCurrency } from '../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-medium text-gray-900 dark:text-white mb-1">{data.name}</p>
        <p className="text-gray-600 dark:text-gray-300">
          Betrag: <span className="font-bold">{formatCurrency(data.value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CategoryChart = () => {
  const { transactions, categories, selectedMonth } = useFinance();

  const { chartData, totalAusgaben } = useMemo(() => {
    const currentMonthTransactions = filterByMonth(transactions, selectedMonth.year, selectedMonth.month);
    // Only consider expenses for this chart
    const expenses = currentMonthTransactions.filter(tx => tx.typ === 'ausgabe');
    const grouped = groupByCategory(expenses);
    
    let total = 0;
    const data = Object.keys(grouped).map(catId => {
      const cat = categories.find(c => c.id === catId);
      const amount = grouped[catId].reduce((sum, tx) => sum + tx.betrag, 0);
      total += amount;
      return {
        id: catId,
        name: cat ? cat.name : 'Unkategorisiert',
        value: amount,
        color: cat ? cat.color : '#cbd5e1' // default gray
      };
    }).sort((a, b) => b.value - a.value); // sort by amount desc

    return { chartData: data, totalAusgaben: total };
  }, [transactions, categories, selectedMonth]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Ausgaben nach Kategorien</h2>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 italic">Keine Ausgaben in diesem Monat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Ausgaben nach Kategorien</h2>
      
      <div className="flex-1 relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-500 dark:text-gray-400">Gesamt</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAusgaben)}
          </span>
        </div>
      </div>
      
      {/* Custom Legend */}
      <div className="mt-4 max-h-32 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {chartData.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center truncate mr-2">
              <span 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-gray-700 dark:text-gray-300 truncate" title={item.name}>{item.name}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
