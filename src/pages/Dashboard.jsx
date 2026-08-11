import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { KpiCard } from '../components/dashboard/KpiCard';
import { FinancialChart } from '../components/dashboard/FinancialChart';
import { ExpenseBreakdown } from '../components/dashboard/ExpenseBreakdown';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DataTable } from '../components/common/DataTable';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { isWithinDateRange } from '../utils/date';
import { computeFinancialSummary } from '../utils/calculations';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Percent, 
  FileText, 
  ShieldAlert,
  Calendar
} from 'lucide-react';

export const Dashboard = () => {
  const { bills, expenses, settings } = useApp();
  const [filterPeriod, setFilterPeriod] = useState('This Month');
  const [customStart, setCustomStart] = useState('2026-08-01');
  const [customEnd, setCustomEnd] = useState('2026-08-10');

  // Filter bills & expenses based on selected date period
  const filteredBills = bills.filter(b => isWithinDateRange(b.date, filterPeriod, customStart, customEnd));
  const filteredExpenses = expenses.filter(e => isWithinDateRange(e.expenseDate, filterPeriod, customStart, customEnd));

  // Compute live summary for filtered scope
  const summary = computeFinancialSummary(filteredBills, filteredExpenses, settings);

  // Chart trend data generation (daily)
  const daysMap = {};
  filteredBills.forEach(b => {
    if (!daysMap[b.date]) daysMap[b.date] = { income: 0, expenditure: 0, profit: 0 };
    if (b.status === 'Completed' || b.paymentStatus === 'Paid') {
      daysMap[b.date].income += Number(b.total || 0);
    }
  });

  filteredExpenses.forEach(e => {
    if (!daysMap[e.expenseDate]) daysMap[e.expenseDate] = { income: 0, expenditure: 0, profit: 0 };
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

  // Consolidated Recent Transactions (combining top bills & expenses)
  const recentTransactions = [
    ...filteredBills.slice(0, 5).map(b => ({
      date: b.date,
      ref: b.billNumber,
      type: 'Income',
      category: 'Customer Bill',
      paymentMethod: b.paymentMethod,
      amount: b.total,
      status: b.status
    })),
    ...filteredExpenses.slice(0, 5).map(e => ({
      date: e.expenseDate,
      ref: e.expenseId,
      type: 'Expense',
      category: e.category,
      paymentMethod: e.paymentMethod,
      amount: e.amount,
      status: e.status
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const columns = [
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Reference', accessor: 'ref', sortable: true },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (val) => (
        <span className={`badge ${val === 'Income' ? 'badge-success' : 'badge-danger'}`}>
          {val}
        </span>
      )
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Payment Method', accessor: 'paymentMethod' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (val, row) => (
        <span style={{ fontWeight: 600, color: row.type === 'Income' ? 'var(--primary-600)' : 'var(--accent-rose)' }}>
          {formatCurrency(val)}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => <span className="badge badge-info">{val}</span>
    }
  ];

  return (
    <PageContainer title="Financial Dashboard" breadcrumb="Overview">
      {/* Top Controls & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Financial Overview</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Real-time business performance analytics & profit calculations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', padding: '0.375rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {['Today', 'This Week', 'This Month', 'Custom Range'].map(period => (
            <button
              key={period}
              className={`btn btn-sm ${filterPeriod === period ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterPeriod(period)}
              style={{ border: filterPeriod === period ? 'none' : 'transparent' }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {filterPeriod === 'Custom Range' && (
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select Range:</span>
          <input type="date" className="form-control" value={customStart} onChange={e => setCustomStart(e.target.value)} style={{ width: 'auto' }} />
          <span>to</span>
          <input type="date" className="form-control" value={customEnd} onChange={e => setCustomEnd(e.target.value)} style={{ width: 'auto' }} />
        </div>
      )}

      {/* KPI Section */}
      <div className="grid-kpi">
        <KpiCard title="Gross Income" value={summary.grossIncome} trend={12.5} icon={DollarSign} color="var(--primary-600)" />
        <KpiCard title="Card Charges" value={summary.cardCharges} subtitle={`Rate @ ${settings.cardRate}%`} icon={CreditCard} color="var(--accent-amber)" />
        <KpiCard title="Net Income" value={summary.netIncome} icon={TrendingUp} color="var(--brand-600)" />
        <KpiCard title="Total Expenditure" value={summary.totalExpenditure} subtitle={`Base + ${summary.overheadRate}% Overhead`} icon={CreditCard} color="var(--accent-rose)" />
        <KpiCard title="Net Profit" value={summary.netProfit} trend={8.2} icon={TrendingUp} color={summary.netProfit >= 0 ? "var(--primary-600)" : "var(--accent-rose)"} />
        <KpiCard title="Profit Margin" value={`${summary.profitMargin}%`} isCurrency={false} icon={Percent} color="var(--accent-purple)" />
        <KpiCard title="Total Completed Bills" value={summary.completedBillsCount} isCurrency={false} icon={FileText} color="var(--accent-blue)" />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Financial Visualizations */}
      <div className="grid-charts">
        <FinancialChart data={chartData} />
        <ExpenseBreakdown expenses={filteredExpenses} />
      </div>

      {/* Recent Transactions Table */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Business Transactions</h3>
        <DataTable
          columns={columns}
          data={recentTransactions}
          pageSize={5}
          searchable={false}
        />
      </div>
    </PageContainer>
  );
};
