import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { defaultCategories, defaultRules } from '../data/defaultCategories';
import { loadData, saveData } from '../utils/storage';
import { categorizeTransactions } from '../utils/categorizer';
import { generateId } from '../utils/helpers';

const FinanceContext = createContext();

const initialState = {
  transactions: loadData('finanztracker_transactions') || [],
  categories: loadData('finanztracker_categories') || defaultCategories,
  rules: loadData('finanztracker_rules') || defaultRules,
  apiKeys: loadData('finanztracker_apikeys') || { secretId: '', secretKey: '', requisitionId: '', accountId: '' },
  selectedMonth: { 
    year: new Date().getFullYear(), 
    month: new Date().getMonth() 
  }
};

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx => tx.id === action.payload.id ? action.payload : tx)
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload)
      };
    case 'IMPORT_TRANSACTIONS': {
      const existingKeySet = new Set(state.transactions.map(tx => `${tx.datum}_${tx.betrag}_${tx.empfaenger}`));
      const newTransactions = action.payload.filter(tx => !existingKeySet.has(`${tx.datum}_${tx.betrag}_${tx.empfaenger}`));
      return { ...state, transactions: [...state.transactions, ...newTransactions] };
    }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat => cat.id === action.payload.id ? action.payload : cat)
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        transactions: state.transactions.map(tx => tx.kategorie === action.payload ? { ...tx, kategorie: 'sonstiges' } : tx)
      };
    case 'ADD_RULE':
      return { ...state, rules: [...state.rules, action.payload] };
    case 'UPDATE_RULE':
      return {
        ...state,
        rules: state.rules.map(rule => rule.id === action.payload.id ? action.payload : rule)
      };
    case 'DELETE_RULE':
      return { ...state, rules: state.rules.filter(rule => rule.id !== action.payload) };
    case 'SET_SELECTED_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SET_API_KEYS':
      return { ...state, apiKeys: { ...state.apiKeys, ...action.payload } };
    case 'RECATEGORIZE_ALL':
      return { ...state, transactions: categorizeTransactions(state.transactions, state.rules) };
    default:
      return state;
  }
};

const generateDemoTransactions = () => {
  const now = new Date();
  const txs = [];
  const demoData = [
    { empfaenger: 'REWE Supermarkt', betrag: 45.20, typ: 'ausgabe', kategorie: 'lebensmittel' },
    { empfaenger: 'ALDI SÜD', betrag: 32.10, typ: 'ausgabe', kategorie: 'lebensmittel' },
    { empfaenger: 'Miete Wohnung', betrag: 850.00, typ: 'ausgabe', kategorie: 'miete' },
    { empfaenger: 'Gehalt Firma GmbH', betrag: 2850.00, typ: 'einnahme', kategorie: 'gehalt' },
    { empfaenger: 'Netflix', betrag: 12.99, typ: 'ausgabe', kategorie: 'freizeit' },
    { empfaenger: 'Spotify', betrag: 9.99, typ: 'ausgabe', kategorie: 'freizeit' },
    { empfaenger: 'Stadtwerke München', betrag: 65.00, typ: 'ausgabe', kategorie: 'strom' },
    { empfaenger: 'Telekom', betrag: 39.95, typ: 'ausgabe', kategorie: 'internet' }
  ];

  for (let i = 0; i < 3; i++) {
    const month = now.getMonth() - i;
    demoData.forEach(item => {
      const d = new Date(now.getFullYear(), month, Math.floor(Math.random() * 28) + 1);
      txs.push({
        id: generateId(),
        datum: d.toISOString(),
        betrag: item.betrag,
        empfaenger: item.empfaenger,
        verwendungszweck: 'Demo Transaktion',
        kategorie: item.kategorie,
        typ: item.typ,
        notiz: ''
      });
    });
  }
  return txs;
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    if (state.transactions.length === 0) {
      const demoTxs = generateDemoTransactions();
      dispatch({ type: 'IMPORT_TRANSACTIONS', payload: demoTxs });
    }
  }, []);

  useEffect(() => {
    saveData('finanztracker_transactions', state.transactions);
    saveData('finanztracker_categories', state.categories);
    saveData('finanztracker_rules', state.rules);
    saveData('finanztracker_apikeys', state.apiKeys);
  }, [state.transactions, state.categories, state.rules, state.apiKeys]);

  const addTransaction = (tx) => dispatch({ type: 'ADD_TRANSACTION', payload: tx });
  const updateTransaction = (tx) => dispatch({ type: 'UPDATE_TRANSACTION', payload: tx });
  const deleteTransaction = (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  const importTransactions = (txs) => dispatch({ type: 'IMPORT_TRANSACTIONS', payload: txs });
  const addCategory = (cat) => dispatch({ type: 'ADD_CATEGORY', payload: cat });
  const updateCategory = (cat) => dispatch({ type: 'UPDATE_CATEGORY', payload: cat });
  const deleteCategory = (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id });
  const addRule = (rule) => dispatch({ type: 'ADD_RULE', payload: rule });
  const deleteRule = (id) => dispatch({ type: 'DELETE_RULE', payload: id });
  const setSelectedMonth = (monthData) => dispatch({ type: 'SET_SELECTED_MONTH', payload: monthData });
  const recategorizeAll = () => dispatch({ type: 'RECATEGORIZE_ALL' });

  return (
    <FinanceContext.Provider value={{
      ...state,
      dispatch,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      importTransactions,
      addCategory,
      updateCategory,
      deleteCategory,
      addRule,
      deleteRule,
      setSelectedMonth,
      recategorizeAll
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
