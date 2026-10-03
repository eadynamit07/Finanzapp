const KEYS = {
  transactions: 'finanztracker_transactions',
  categories: 'finanztracker_categories',
  rules: 'finanztracker_rules',
  theme: 'finanztracker_theme'
};

export const loadData = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading data from localStorage', error);
    return null;
  }
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage', error);
  }
};

export const exportAllData = () => {
  const data = {
    transactions: loadData(KEYS.transactions) || [],
    categories: loadData(KEYS.categories) || [],
    rules: loadData(KEYS.rules) || []
  };
  return JSON.stringify(data, null, 2);
};

export const importAllData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.transactions) saveData(KEYS.transactions, data.transactions);
    if (data.categories) saveData(KEYS.categories, data.categories);
    if (data.rules) saveData(KEYS.rules, data.rules);
    return true;
  } catch (error) {
    console.error('Error importing data', error);
    return false;
  }
};
