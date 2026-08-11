/**
 * Production-quality mock dataset with ~30 bills, ~40 expenses, setting histories & notifications.
 * Dates set around August 2026.
 */

export const mockUsers = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-08-10 09:15',
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-002',
    name: 'Sarah Jenkins',
    email: 'manager@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2026-08-09 16:40',
    createdAt: '2026-02-15'
  },
  {
    id: 'USR-003',
    name: 'Ruwan Perera',
    email: 'accountant@example.com',
    role: 'Accountant',
    status: 'Active',
    lastLogin: '2026-08-10 08:30',
    createdAt: '2026-03-10'
  },
  {
    id: 'USR-004',
    name: 'Kasun Silva',
    email: 'staff@example.com',
    role: 'Staff',
    status: 'Active',
    lastLogin: '2026-08-08 14:10',
    createdAt: '2026-04-01'
  }
];

export const mockSettings = {
  overheadRate: 25.0,
  cardRate: 2.0,
  effectiveFrom: '2026-08-01',
  businessName: 'Lanka Business Solutions Pvt Ltd',
  businessEmail: 'info@lankabusiness.lk',
  businessPhone: '+94 11 234 5678',
  businessAddress: '123 Galle Road, Colombo 03, Sri Lanka',
  currency: 'LKR',
  timezone: 'Asia/Colombo',
  dateFormat: 'YYYY-MM-DD'
};

export const mockSettingsHistory = [
  {
    id: 'HIST-101',
    setting: 'Overhead Percentage',
    oldValue: '20.00%',
    newValue: '25.00%',
    effectiveFrom: '2026-08-01',
    effectiveTo: 'Current',
    changedBy: 'Admin User'
  },
  {
    id: 'HIST-100',
    setting: 'Card Charge Rate (Commercial Bank)',
    oldValue: '1.80%',
    newValue: '2.00%',
    effectiveFrom: '2026-07-01',
    effectiveTo: 'Current',
    changedBy: 'Admin User'
  },
  {
    id: 'HIST-099',
    setting: 'Overhead Percentage',
    oldValue: '18.00%',
    newValue: '20.00%',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-07-31',
    changedBy: 'Admin User'
  }
];

export const mockExpenseCategories = [
  { id: 'CAT-1', name: 'Water', parent: 'Utilities', description: 'Municipal water & beverage supplies', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-2', name: 'Electricity', parent: 'Utilities', description: 'Grid power & generator fuel', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-3', name: 'Rent', parent: 'Facility', description: 'Commercial store lease payments', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-4', name: 'Driver', parent: 'Payroll', description: 'Driver salaries & trip allowances', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-5', name: 'Staff', parent: 'Payroll', description: 'Monthly staff salaries & incentives', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-6', name: 'Labourers', parent: 'Payroll', description: 'Daily wage loading/unloading staff', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-7', name: 'Security', parent: 'Facility', description: 'On-site security services', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-8', name: 'Administration', parent: 'Operations', description: 'Office supplies, licenses & software', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-9', name: 'PickMe / delivery charges', parent: 'Logistics', description: 'Courier & courier platform fees', status: 'Active', createdAt: '2026-01-01' },
  { id: 'CAT-10', name: 'Other expenses', parent: 'General', description: 'Miscellaneous operational costs', status: 'Active', createdAt: '2026-01-01' }
];

export const mockNotifications = [
  { id: 'NOTIF-1', title: 'Overhead percentage updated', message: 'Overhead configuration was changed to 25%.', time: '10 mins ago', read: false },
  { id: 'NOTIF-2', title: 'High Electricity expense recorded', message: 'Electricity expenses increased by 15% this week.', time: '2 hours ago', read: false },
  { id: 'NOTIF-3', title: 'New bill created', message: 'Bill INV-1030 for LKR 45,000 completed.', time: '4 hours ago', read: true }
];

// Generate 30 realistic bills around August 2026
export const mockBills = Array.from({ length: 30 }, (_, index) => {
  const billNum = 1001 + index;
  const day = (index % 10) + 1;
  const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
  
  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'PickMe', 'Split'];
  const method = paymentMethods[index % paymentMethods.length];
  
  let subtotal = (index + 1) * 12500 + 5000;
  let discount = index % 3 === 0 ? 1000 : 0;
  let total = subtotal - discount;

  let payments = [];
  if (method === 'Split') {
    payments = [
      { method: 'Cash', amount: total * 0.4 },
      { method: 'Card', amount: total * 0.6 }
    ];
  } else {
    payments = [{ method, amount: total }];
  }

  return {
    id: `INV-${billNum}`,
    billNumber: `INV-${billNum}`,
    date: dateStr,
    customerName: index % 2 === 0 ? `Lanka Traders Co #${index + 1}` : `Apex Retailers #${index + 1}`,
    subtotal,
    discount,
    tax: 0,
    total,
    paymentStatus: index === 29 ? 'Pending' : 'Paid',
    paymentMethod: method,
    payments,
    cardRate: 2.0,
    status: index === 29 ? 'Draft' : 'Completed',
    items: [
      { id: 'ITM-1', productName: 'Commercial Product Package A', quantity: 2, unitPrice: subtotal * 0.4, total: subtotal * 0.8 },
      { id: 'ITM-2', productName: 'Support Service & Logistics', quantity: 1, unitPrice: subtotal * 0.2, total: subtotal * 0.2 }
    ]
  };
});

// Generate 40 realistic expenses across categories
export const mockExpenses = Array.from({ length: 40 }, (_, index) => {
  const expNum = 301 + index;
  const day = (index % 10) + 1;
  const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;

  const categories = [
    'Water', 'Electricity', 'Rent', 'Driver', 'Staff', 
    'Labourers', 'Security', 'Administration', 'PickMe / delivery charges', 'Other expenses'
  ];
  const category = categories[index % categories.length];

  const amounts = {
    'Water': 4500,
    'Electricity': 35000,
    'Rent': 120000,
    'Driver': 15000,
    'Staff': 85000,
    'Labourers': 12000,
    'Security': 22000,
    'Administration': 18000,
    'PickMe / delivery charges': 8500,
    'Other expenses': 6000
  };

  return {
    id: `EXP-${expNum}`,
    expenseId: `EXP-${expNum}`,
    expenseDate: dateStr,
    category,
    description: `${category} payment for operational shift #${(index % 5) + 1}`,
    amount: amounts[category] + (index * 250),
    paymentMethod: index % 2 === 0 ? 'Bank Transfer' : 'Cash',
    referenceNumber: `REF-2026-${800 + index}`,
    createdBy: index % 3 === 0 ? 'Sarah Jenkins' : 'Admin User',
    status: 'Completed'
  };
});
