import React from 'react';
import { Building2, Key, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BankConnection() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">Bankanbindung</h1>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
          <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            Beta / In Entwicklung
          </div>
          <Building2 size={48} className="mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Open Banking Anbindung</h2>
          <p className="text-blue-100 max-w-xl">
            Verbinde deine echten Bankkonten über die GoCardless (ehemals Nordigen) API. 
            Transaktionen werden so vollautomatisch und sicher in dein Haushaltsbuch importiert.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 dark:text-white">So richtest du die Anbindung ein:</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium dark:text-white">Kostenlosen Account erstellen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Erstelle einen kostenlosen Entwickler-Account bei GoCardless Bank Account Data.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium dark:text-white">API-Schlüssel generieren</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generiere in den Entwickler-Einstellungen eine Secret ID und einen Secret Key.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium dark:text-white">Schlüssel hier eintragen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trage deine Zugangsdaten unten ein, um den Prozess zu starten.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="space-y-4 pt-6 border-t dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Secret ID</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  disabled 
                  placeholder="Gib deine Secret ID ein..." 
                  className="input-field w-full pl-10 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Secret Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  disabled 
                  placeholder="Gib deinen Secret Key ein..." 
                  className="input-field w-full pl-10 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2 mt-4">
              <LinkIcon size={20} />
              Bank verbinden
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold dark:text-white">CSV-Import als Alternative</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Alternativ kannst du deine Transaktionen auch manuell per CSV-Datei von deiner Bank importieren.
          </p>
        </div>
        <Link to="/import" className="btn-secondary whitespace-nowrap flex items-center gap-2">
          Zum CSV-Import <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
