/**
 * Validation utilities for forms
 */

export const validateBillForm = (formData) => {
  const errors = {};
  if (!formData.customerName || !formData.customerName.trim()) {
    errors.customerName = 'Customer name is required';
  }
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Bill must contain at least one item';
  } else {
    formData.items.forEach((item, index) => {
      if (!item.productName || !item.productName.trim()) {
        errors[`item_${index}_name`] = 'Product name is required';
      }
      if (Number(item.quantity) <= 0) {
        errors[`item_${index}_qty`] = 'Qty must be > 0';
      }
      if (Number(item.unitPrice) < 0) {
        errors[`item_${index}_price`] = 'Price cannot be negative';
      }
    });
  }
  return errors;
};

export const validateExpenseForm = (formData) => {
  const errors = {};
  if (!formData.category || !formData.category.trim()) {
    errors.category = 'Expense category is required';
  }
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required';
  }
  if (!formData.amount || Number(formData.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero';
  }
  if (!formData.expenseDate) {
    errors.expenseDate = 'Expense date is required';
  }
  return errors;
};

export const validateSettingsForm = (settings) => {
  const errors = {};
  if (settings.overheadRate < 0 || settings.overheadRate > 100) {
    errors.overheadRate = 'Overhead percentage must be between 0% and 100%';
  }
  if (settings.cardRate < 0 || settings.cardRate > 100) {
    errors.cardRate = 'Card charge percentage must be between 0% and 100%';
  }
  return errors;
};
