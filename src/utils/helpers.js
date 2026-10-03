import { v4 as uuidv4 } from 'uuid';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(date);
};

export const getMonthName = (monthIndex) => {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return months[monthIndex];
};

export const getMonthYear = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}`;
};

export const generateId = () => {
  return uuidv4();
};

export const groupByCategory = (transactions) => {
  const grouped = {};
  transactions.forEach(tx => {
    const catId = tx.kategorie || 'sonstiges';
    if (!grouped[catId]) grouped[catId] = [];
    grouped[catId].push(tx);
  });
  return grouped;
};

export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, tx) => {
    const monthYear = getMonthYear(tx.datum);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(tx);
    return acc;
  }, {});
};

// Groups all transactions by their date string (YYYY-MM-DD)
// Can optionally filter to a specific month first
export const groupByDay = (transactions, year, month) => {
  let txs = transactions;
  if (year !== undefined && month !== undefined) {
    txs = filterByMonth(transactions, year, month);
  }
  return txs.reduce((acc, tx) => {
    const d = new Date(tx.datum);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(tx);
    return acc;
  }, {});
};

export const filterByMonth = (transactions, year, month) => {
  return transactions.filter(tx => {
    const d = new Date(tx.datum);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

export const parseGermanNumber = (str) => {
  if (typeof str !== 'string') return Number(str);
  const cleanStr = str.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleanStr);
};

// Accepts either (allTransactions, year, month) or (filteredTransactions) 
// When called with just transactions, calculates stats for all provided transactions
export const calculateMonthlyStats = (transactions, year, month) => {
  const txs = (year !== undefined && month !== undefined) 
    ? filterByMonth(transactions, year, month) 
    : transactions;
  
  let einnahmen = 0;
  let ausgaben = 0;
  const kategorien = {};

  txs.forEach(tx => {
    if (tx.typ === 'einnahme') {
      einnahmen += tx.betrag;
    } else {
      ausgaben += tx.betrag;
    }

    const cat = tx.kategorie || 'sonstiges';
    if (!kategorien[cat]) kategorien[cat] = 0;
    kategorien[cat] += tx.betrag;
  });

  return {
    einnahmen,
    ausgaben,
    netto: einnahmen - ausgaben,
    kategorien
  };
};
