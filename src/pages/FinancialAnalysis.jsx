import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { computeFinancialSummary } from '../utils/calculations';
import { isWithinDateRange } from '../utils/date';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const FinancialAnalysis = () => {
  const { view = 'daily' } = useParams();
  const navigate = useNavigate();
  const { bills, expenses, settings } = useApp();

  const [activeTab, setActiveTab] = useState(view);
  const [customStart, setCustomStart] = useState('2026-08-01');
  const [customEnd, setCustomEnd] = useState('2026-08-10');

  const periodMap = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    custom: 'Custom Range'
  };

  const period = periodMap[activeTab] || 'This Month';
  const filteredBills = bills.filter(b => isWithinDateRange(b.date, period, customStart, customEnd));
  const filteredExpenses = expenses.filter(e => isWithinDateRange(e.expenseDate, period, customStart, customEnd));

  const summary = computeFinancialSummary(filteredBills, filteredExpenses, settings);

  // Group data by week or day for visualization comparison
  const daysMap = {};
  filteredBills.forEach(b => {
    if (!daysMap[b.date]) daysMap[b.date] = { income: 0, expenditure: 0 };
    if (b.status === 'Completed' || b.paymentStatus === 'Paid') {
      daysMap[b.date].income += Number(b.total || 0);
    }
  });

  filteredExpenses.forEach(e => {
    if (!daysMap[e.expenseDate]) daysMap[e.expenseDate] = { income: 0, expenditure: 0 };
    daysMap[e.expenseDate].expenditure += Number(e.amount || 0);
  });

  const chartData = Object.keys(daysMap).sort().map(d => {
    const baseExp = daysMap[d].expenditure;
    const totalExp = baseExp + (baseExp * settings.overheadRate) / 100;
    const profit = daysMap[d].income - totalExp;
    return {
      date: d.slice(5),
      income: daysMap[d].income,
      expenditure: totalExp,
      profit
    };
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/analysis/${tab}`);
  };

  return (
    <PageContainer title="Financial Analysis" breadcrumb="Analysis">
      {/* Analysis Subnav Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {[
          { id: 'daily', title: 'Daily Analysis' },
          { id: 'weekly', title: 'Weekly Analysis' },
          { id: 'monthly', title: 'Monthly Analysis' },
          { id: 'custom', title: 'Custom Date Range' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-600)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--text-muted)'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {activeTab === 'custom' && (
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Start Date:</span>
          <input type="date" className="form-control" value={customStart} onChange={e => setCustomStart(e.target.value)} style={{ width: 'auto' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>End Date:</span>
          <input type="date" className="form-control" value={customEnd} onChange={e => setCustomEnd(e.target.value)} style={{ width: 'auto' }} />
        </div>
      )}

      {/* Financial Metrics Metrics Board */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Financial Summary ({period})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Income</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.grossIncome)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card Charges ({settings.cardRate}%)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.cardCharges)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Income</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-600)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.netIncome)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Base Expenses</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.baseExpenses)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overhead ({summary.overheadRate}%)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-rose)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.overheadAmount)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Expenditure</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-rose)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.totalExpenditure)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: summary.netProfit >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NET PROFIT</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: summary.netProfit >= 0 ? 'var(--primary-600)' : 'var(--accent-rose)', marginTop: '0.25rem' }}>
              {formatCurrency(summary.netProfit)}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROFIT MARGIN</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.25rem' }}>
              {summary.profitMargin}%
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Comparison */}
      <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Comparative Performance Bar Chart
        </h3>
        <div style={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `LKR ${v/1000}k`} />
              <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="income" name="Gross Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenditure" name="Total Expenditure" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
};
