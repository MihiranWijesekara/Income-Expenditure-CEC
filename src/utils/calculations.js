/**
 * Pure financial calculation services following business rules.
 */

/**
 * Gross Income = SUM(all completed bills)
 */
export const calculateGrossIncome = (bills = []) => {
  return bills
    .filter(bill => bill.status === 'Completed' || bill.paymentStatus === 'Paid')
    .reduce((sum, bill) => sum + Number(bill.total || 0), 0);
};

/**
 * Card Payment Charges = SUM(Card Payment Amount * Card Charge % / 100)
 */
export const calculateCardCharges = (bills = [], cardRate = 2.0) => {
  return bills
    .filter(bill => bill.status === 'Completed' || bill.paymentStatus === 'Paid')
    .reduce((sum, bill) => {
      // Handle multi-payment methods if present
      if (Array.isArray(bill.payments)) {
        const cardAmount = bill.payments
          .filter(p => p.method === 'Card')
          .reduce((pSum, p) => pSum + Number(p.amount || 0), 0);
        const rate = bill.cardRate !== undefined ? bill.cardRate : cardRate;
        return sum + (cardAmount * rate) / 100;
      }
      if (bill.paymentMethod === 'Card') {
        const rate = bill.cardRate !== undefined ? bill.cardRate : cardRate;
        return sum + (Number(bill.total || 0) * rate) / 100;
      }
      return sum;
    }, 0);
};

/**
 * Net Income = Gross Income - Card Payment Charges
 */
export const calculateNetIncome = (grossIncome, cardCharges) => {
  return Math.max(0, grossIncome - cardCharges);
};

/**
 * Base Expenditure = SUM(all valid business expenses)
 */
export const calculateBaseExpenses = (expenses = []) => {
  return expenses
    .filter(expense => expense.status !== 'Cancelled' && expense.status !== 'Void')
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
};

/**
 * Overhead Amount = Base Expenditure * Overhead Percentage / 100
 */
export const calculateOverhead = (baseExpenses, overheadRate = 25.0) => {
  return (baseExpenses * Number(overheadRate)) / 100;
};

/**
 * Total Expenditure = Base Expenditure + Overhead Amount
 */
export const calculateTotalExpenditure = (baseExpenses, overheadAmount) => {
  return baseExpenses + overheadAmount;
};

/**
 * Net Profit = Net Income - Total Expenditure
 */
export const calculateNetProfit = (netIncome, totalExpenditure) => {
  return netIncome - totalExpenditure;
};

/**
 * Profit Margin = (Net Profit / Gross Income) * 100
 * Division by zero handled safely.
 */
export const calculateProfitMargin = (netProfit, grossIncome) => {
  if (!grossIncome || grossIncome === 0) return 0;
  const margin = (netProfit / grossIncome) * 100;
  return Number(margin.toFixed(2));
};

/**
 * Master Financial Summary Calculator
 */
export const computeFinancialSummary = (bills = [], expenses = [], settings = {}) => {
  const overheadRate = settings.overheadRate !== undefined ? settings.overheadRate : 25.0;
  const cardRate = settings.cardRate !== undefined ? settings.cardRate : 2.0;

  const grossIncome = calculateGrossIncome(bills);
  const cardCharges = calculateCardCharges(bills, cardRate);
  const netIncome = calculateNetIncome(grossIncome, cardCharges);

  const baseExpenses = calculateBaseExpenses(expenses);
  const overheadAmount = calculateOverhead(baseExpenses, overheadRate);
  const totalExpenditure = calculateTotalExpenditure(baseExpenses, overheadAmount);

  const netProfit = calculateNetProfit(netIncome, totalExpenditure);
  const profitMargin = calculateProfitMargin(netProfit, grossIncome);

  return {
    grossIncome,
    cardCharges,
    netIncome,
    baseExpenses,
    overheadRate,
    overheadAmount,
    totalExpenditure,
    netProfit,
    profitMargin,
    completedBillsCount: bills.filter(b => b.status === 'Completed' || b.paymentStatus === 'Paid').length
  };
};
