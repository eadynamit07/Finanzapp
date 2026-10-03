# FinanzTracker

Eine moderne, responsive Web-Anwendung zur persönlichen Finanzverfolgung. Komplett lokal, mit Dark-Mode, CSV-Import, automatischer Kategorisierung und Fixkosten-Check.

## Features
- **Dashboard:** Kontostand, Einnahmen/Ausgaben-Zusammenfassung und interaktive Charts (Ausgaben nach Kategorien, Monatsvergleich)
- **Transaktionsverwaltung:** Alle Transaktionen auf einen Blick mit Filter-, Such- und Sortierfunktionen
- **Finanzkalender:** Einnahmen und Ausgaben pro Tag direkt im Monatsüberblick sehen
- **Kategorien & Regeln:** Automatische Zuordnung durch frei definierbare Regeln (z.B. Empfänger "ALDI" -> "Lebensmittel")
- **CSV-Import:** Import von Kontoauszügen gängiger Banken (Sparkasse, ING, N26, DKB, VR-Bank etc.)
- **Fixkosten-Check:** Erkennt automatisiert regelmäßige, wiederkehrende Abbuchungen
- **Komplett lokal:** Alle Daten bleiben bei dir im Browser (`localStorage`). Ein manueller Export/Import ist als Backup jederzeit möglich.

## Technologie-Stack
- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Diagramme:** Recharts
- **CSV Parsing:** PapaParse

## Installation & Start

1. Öffne ein Terminal im Projektordner.
2. Installiere die nötigen Pakete:
   ```bash
   npm install
   ```
3. Starte den lokalen Entwicklungsserver:
   ```bash
   npm run dev
   ```
4. Öffne deinen Browser und gehe auf die dort angezeigte lokale Adresse (meist `http://localhost:5173/`).

Viel Spaß beim Tracken deiner Finanzen!
