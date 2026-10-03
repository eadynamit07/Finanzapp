import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { getMonthName } from '../utils/helpers';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedMonth, setSelectedMonth } = useFinance();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                💰 FinanzTracker
              </h1>
            </div>

            {/* Center: Month selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[140px] text-center">
                {getMonthName(selectedMonth.month)} {selectedMonth.year}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Right: Theme toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
