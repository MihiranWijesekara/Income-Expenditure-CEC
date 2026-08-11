import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/currency';

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899', '#64748b'];

export const ExpenseBreakdown = ({ expenses = [] }) => {
  // Aggregate expenses by category
  const categoryMap = {};
  let totalAmount = 0;

  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount || 0);
    totalAmount += Number(e.amount || 0);
  });

  const chartData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    percentage: totalAmount > 0 ? ((categoryMap[cat] / totalAmount) * 100).toFixed(1) : 0
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="card col-span-4" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Expenditure Breakdown</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By Expense Categories</p>
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(val, name, entry) => [formatCurrency(val), `${entry.payload.percentage}%`]}
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '0.75rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
