import { getMonthYear } from './helpers';

export const categorizeTransaction = (transaction, rules) => {
  if (!transaction || !rules) return 'sonstiges';

  for (const rule of rules) {
    const fieldVal = transaction[rule.field];
    if (typeof fieldVal !== 'string') continue;
    
    const valueStr = String(fieldVal).toLowerCase();
    const ruleValueStr = String(rule.value).toLowerCase();

    if (rule.operator === 'contains' && valueStr.includes(ruleValueStr)) {
      return rule.categoryId;
    } else if (rule.operator === 'startsWith' && valueStr.startsWith(ruleValueStr)) {
      return rule.categoryId;
    } else if (rule.operator === 'exact' && valueStr === ruleValueStr) {
      return rule.categoryId;
    }
  }

  return 'sonstiges';
};

export const categorizeTransactions = (transactions, rules) => {
  return transactions.map(tx => ({
    ...tx,
    kategorie: categorizeTransaction(tx, rules)
  }));
};

export const detectFixedCosts = (transactions) => {
  const ausgaben = transactions.filter(tx => tx.typ === 'ausgabe' || tx.betrag < 0);
  const groupedByEmpfaenger = {};

  ausgaben.forEach(tx => {
    const empf = tx.empfaenger || 'Unbekannt';
    const month = getMonthYear(tx.datum);
    const amount = Math.abs(tx.betrag);
    
    if (!groupedByEmpfaenger[empf]) {
      groupedByEmpfaenger[empf] = { amounts: [], months: new Set(), category: tx.kategorie };
    }
    
    groupedByEmpfaenger[empf].amounts.push(amount);
    groupedByEmpfaenger[empf].months.add(month);
    if(tx.kategorie && tx.kategorie !== 'sonstiges') {
       groupedByEmpfaenger[empf].category = tx.kategorie;
    }
  });

  const fixedCosts = [];

  for (const [empfaenger, data] of Object.entries(groupedByEmpfaenger)) {
    if (data.months.size >= 3) {
      const avg = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
      
      const isConsistent = data.amounts.every(amount => {
        const variance = Math.abs(amount - avg) / avg;
        return variance <= 0.1;
      });

      if (isConsistent) {
        fixedCosts.push({
          empfaenger,
          durchschnittsBetrag: avg,
          anzahlMonate: data.months.size,
          letzterBetrag: data.amounts[data.amounts.length - 1],
          kategorie: data.category || 'sonstiges'
        });
      }
    }
  }

  return fixedCosts.sort((a, b) => b.durchschnittsBetrag - a.durchschnittsBetrag);
};
