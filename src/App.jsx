import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CalendarView from './components/CalendarView';
import CategoryManager from './components/CategoryManager';
import CsvImport from './components/CsvImport';
import BankConnection from './components/BankConnection';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaktionen" element={<TransactionList />} />
        <Route path="/kalender" element={<CalendarView />} />
        <Route path="/kategorien" element={<CategoryManager />} />
        <Route path="/import" element={<CsvImport />} />
        <Route path="/bankanbindung" element={<BankConnection />} />
      </Routes>
    </Layout>
  );
}

export default App;
