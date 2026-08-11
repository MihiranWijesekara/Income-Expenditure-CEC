import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/currency';

export const FinancialChart = ({ data = [] }) => {
  return (
    <div className="card col-span-8" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Income vs Expenditure Trend</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily breakdown of income, base expenditure, and net profit</p>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(v) => `LKR ${v/1000}k`} />
            <Tooltip 
              formatter={(val) => formatCurrency(val)} 
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            />
            <Legend />
            <Area type="monotone" dataKey="income" name="Gross Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expenditure" name="Total Expenditure" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
            <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
