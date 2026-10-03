import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { getMonthName, groupByDay } from '../utils/helpers';
import CalendarDay from './CalendarDay';
import DayDetailModal from './DayDetailModal';

export default function CalendarView() {
  const { transactions, selectedMonth, setSelectedMonth } = useFinance();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevMonth = () => {
    if (selectedMonth.month === 0) {
      setSelectedMonth({ year: selectedMonth.year - 1, month: 11 });
    } else {
      setSelectedMonth({ year: selectedMonth.year, month: selectedMonth.month - 1 });
    }
  };

  const nextMonth = () => {
    if (selectedMonth.month === 11) {
      setSelectedMonth({ year: selectedMonth.year + 1, month: 0 });
    } else {
      setSelectedMonth({ year: selectedMonth.year, month: selectedMonth.month + 1 });
    }
  };

  const calendarDays = useMemo(() => {
    const year = selectedMonth.year;
    const month = selectedMonth.month;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust to start on Monday (0=Mon...6=Sun)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;
    
    const days = [];
    const groupedTransactions = groupByDay(transactions);
    const today = new Date();
    today.setHours(0,0,0,0);

    // Prev month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: d.getTime() === today.getTime(),
        transactions: groupedTransactions[dateStr] || []
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: d.getTime() === today.getTime(),
        transactions: groupedTransactions[dateStr] || []
      });
    }

    // Next month days to fill grid (usually 42 days for a 6x7 grid)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: d.getTime() === today.getTime(),
        transactions: groupedTransactions[dateStr] || []
      });
    }

    return days;
  }, [selectedMonth, transactions]);

  const handleDayClick = (day) => {
    setSelectedDate(day.date);
    setIsModalOpen(true);
  };

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ChevronLeft size={24} className="dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold dark:text-white">
          {getMonthName(selectedMonth.month)} {selectedMonth.year}
        </h1>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ChevronRight size={24} className="dark:text-white" />
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          {weekdays.map(day => (
            <div key={day} className="py-3 text-center font-semibold text-gray-600 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((dayObj, index) => (
            <CalendarDay 
              key={index}
              day={dayObj.dayNumber}
              isCurrentMonth={dayObj.isCurrentMonth}
              isToday={dayObj.isToday}
              transactions={dayObj.transactions}
              onClick={() => handleDayClick(dayObj)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Einnahmen</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Ausgaben</div>
      </div>

      {isModalOpen && selectedDate && (
        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          transactions={groupByDay(transactions)[selectedDate.toISOString().split('T')[0]] || []}
        />
      )}
    </div>
  );
}
