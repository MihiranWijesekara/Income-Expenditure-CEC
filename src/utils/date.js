/**
 * Date helper utilities for reporting and filtering
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const isWithinDateRange = (itemDateStr, filterPeriod, customStart, customEnd) => {
  if (!itemDateStr) return false;
  const itemDate = new Date(itemDateStr);
  const now = new Date('2026-08-10T23:59:59'); // Anchor to Aug 2026 dataset context

  if (filterPeriod === 'Today') {
    return itemDate.toISOString().split('T')[0] === '2026-08-10';
  }

  if (filterPeriod === 'This Week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return itemDate >= weekAgo && itemDate <= now;
  }

  if (filterPeriod === 'This Month') {
    return itemDate.getMonth() === 7 && itemDate.getFullYear() === 2026; // August 2026
  }

  if (filterPeriod === 'Custom Range' && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    return itemDate >= start && itemDate <= end;
  }

  return true; // All Time
};
