/**
 * Currency Formatting Utility for Sri Lankan Rupee (LKR)
 */
export const formatCurrency = (amount, currency = 'LKR') => {
  const numericAmount = Number(amount) || 0;
  
  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);

  return `${currency} ${formatted}`;
};
