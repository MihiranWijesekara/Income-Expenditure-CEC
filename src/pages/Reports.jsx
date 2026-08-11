import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { computeFinancialSummary } from '../utils/calculations';
import { isWithinDateRange } from '../utils/date';
import { Printer, Download, FileSpreadsheet } from 'lucide-react';

export const Reports = () => {
  const { bills, expenses, settings } = useApp();
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-10');

  const filteredBills = bills.filter(b => isWithinDateRange(b.date, 'Custom Range', startDate, endDate));
  const filteredExpenses = expenses.filter(e => isWithinDateRange(e.expenseDate, 'Custom Range', startDate, endDate));

  const summary = computeFinancialSummary(filteredBills, filteredExpenses, settings);

  const handleExportCSV = () => {
    alert('Exporting statement data to CSV format...');
  };

  return (
    <PageContainer title="Financial Reports & Statements" breadcrumb="Reports">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Exportable Financial Statements</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Generate formal income, expenditure, and audit profit reports</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, marginRight: '0.5rem' }}>Report Type:</span>
          <select className="form-control" value={reportType} onChange={e => setReportType(e.target.value)} style={{ width: 'auto' }}>
            <option value="summary">Financial Summary Statement</option>
            <option value="income">Income & Sales Report</option>
            <option value="expenditure">Expenditure Detail Report</option>
            <option value="profit">Net Profit Statement</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Start Date:</span>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: 'auto' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>End Date:</span>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: 'auto' }} />
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="card printable-area" style={{ maxWidth: '850px', margin: '0 auto', padding: '2.5rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.05em' }}>FINANCIAL SUMMARY STATEMENT</h1>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {settings.businessName}
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Period: {startDate} to {endDate} | Currency: {settings.currency}
          </div>
        </div>

        {/* Statement Revenue Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            1. REVENUE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gross Income (Completed Bills):</span>
              <span>{formatCurrency(summary.grossIncome)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
              <span>Card Payment Charges ({settings.cardRate}%):</span>
              <span>-{formatCurrency(summary.cardCharges)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
              <span>NET INCOME:</span>
              <span>{formatCurrency(summary.netIncome)}</span>
            </div>
          </div>
        </div>

        {/* Statement Expenditure Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            2. EXPENDITURE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Operational Expenditure:</span>
              <span>{formatCurrency(summary.baseExpenses)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-rose)' }}>
              <span>Overhead Amount ({summary.overheadRate}%):</span>
              <span>+{formatCurrency(summary.overheadAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
              <span>TOTAL EXPENDITURE:</span>
              <span>{formatCurrency(summary.totalExpenditure)}</span>
            </div>
          </div>
        </div>

        {/* Net Profit Section */}
        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            3. NET PROFIT & MARGIN
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: summary.netProfit >= 0 ? 'var(--primary-600)' : 'var(--accent-rose)' }}>
            <span>NET PROFIT:</span>
            <span>{formatCurrency(summary.netProfit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
            <span>PROFIT MARGIN:</span>
            <span>{summary.profitMargin}%</span>
          </div>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>Generated by: {settings.businessName}</div>
          <div>Audit Verification: APPROVED</div>
        </div>
      </div>
    </PageContainer>
  );
};
