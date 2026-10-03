import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function CalendarDay({ day, isCurrentMonth, isToday, transactions, onClick }) {
  const einnahmen = transactions.filter(t => t.typ === 'einnahme').reduce((sum, t) => sum + t.betrag, 0);
  const ausgaben = transactions.filter(t => t.typ === 'ausgabe').reduce((sum, t) => sum + t.betrag, 0);

  const dots = Math.min(transactions.length, 3);

  return (
    <div 
      onClick={onClick}
      className={`min-h-[100px] border-b border-r dark:border-gray-800 p-2 cursor-pointer transition-colors relative
        ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900'}
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${isToday ? 'ring-2 ring-primary-500 ring-inset z-10' : ''}
      `}
    >
      <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
        {day}
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        {einnahmen > 0 && (
          <div className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
            +{formatCurrency(einnahmen)}
          </div>
        )}
        {ausgaben > 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 font-medium truncate">
            -{formatCurrency(ausgaben)}
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {Array.from({ length: dots }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
          ))}
        </div>
      )}
    </div>
  );
}
