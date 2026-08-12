import React, { createContext, useContext, useState } from 'react';
import { 
  mockBills, 
  mockExpenses, 
  mockSettings, 
  mockSettingsHistory, 
  mockExpenseCategories,
  mockNotifications 
} from '../data/mockData';
import { computeFinancialSummary } from '../utils/calculations';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [bills, setBills] = useState(mockBills);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [settings, setSettings] = useState(mockSettings);
  const [settingsHistory, setSettingsHistory] = useState(mockSettingsHistory);
  const [categories, setCategories] = useState(mockExpenseCategories);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Financial calculations derived from live state data
  const financialSummary = computeFinancialSummary(bills, expenses, settings);

  // Bill Actions
  const addBill = (newBill) => {
    const formatted = {
      ...newBill,
      id: `INC-${1000 + bills.length + 1}`,
      billNumber: `INC-${1000 + bills.length + 1}`,
      status: 'Completed',
      paymentStatus: 'Paid'
    };
    setBills(prev => [formatted, ...prev]);
    return formatted;
  };

  const updateBillStatus = (billId, status) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status, paymentStatus: status === 'Void' ? 'Void' : b.paymentStatus } : b));
  };

  // Expense Actions
  const addExpense = (newExpense) => {
    const formatted = {
      ...newExpense,
      id: `EXP-${300 + expenses.length + 1}`,
      expenseId: `EXP-${300 + expenses.length + 1}`,
      status: 'Completed'
    };
    setExpenses(prev => [formatted, ...prev]);
    return formatted;
  };

  // Settings Actions
  const updateSettings = (newSettings, changedBy = 'Admin User') => {
    const historyEntries = [];
    if (newSettings.overheadRate !== settings.overheadRate) {
      historyEntries.push({
        id: `HIST-${Date.now()}-1`,
        setting: 'Overhead Percentage',
        oldValue: `${settings.overheadRate}%`,
        newValue: `${newSettings.overheadRate}%`,
        effectiveFrom: newSettings.effectiveFrom || new Date().toISOString().split('T')[0],
        effectiveTo: 'Current',
        changedBy
      });
    }
    if (newSettings.cardRate !== settings.cardRate) {
      historyEntries.push({
        id: `HIST-${Date.now()}-2`,
        setting: 'Card Charge Percentage',
        oldValue: `${settings.cardRate}%`,
        newValue: `${newSettings.cardRate}%`,
        effectiveFrom: newSettings.effectiveFrom || new Date().toISOString().split('T')[0],
        effectiveTo: 'Current',
        changedBy
      });
    }

    setSettings(prev => ({ ...prev, ...newSettings }));
    if (historyEntries.length > 0) {
      setSettingsHistory(prev => [...historyEntries, ...prev]);
    }
  };

  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: `CAT-${categories.length + 1}`,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCategories(prev => [...prev, newCat]);
  };

  return (
    <AppContext.Provider value={{
      bills,
      expenses,
      settings,
      settingsHistory,
      categories,
      notifications,
      financialSummary,
      addBill,
      updateBillStatus,
      addExpense,
      updateSettings,
      addCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
