import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { formatCurrency } from '../utils/currency';
import { 
  calculateCardCharges, 
  calculateNetIncome, 
  calculateOverhead, 
  calculateTotalExpenditure, 
  calculateNetProfit, 
  calculateProfitMargin 
} from '../utils/calculations';
import { Calculator, RefreshCw } from 'lucide-react';

export const ProfitCalculator = () => {
  // Input fields state
  const [grossIncome, setGrossIncome] = useState(500000);
  const [cardAmount, setCardAmount] = useState(250000);
  const [cardRate, setCardRate] = useState(2.0);

  const [water, setWater] = useState(5000);
  const [electricity, setElectricity] = useState(35000);
  const [rent, setRent] = useState(120000);
  const [driver, setDriver] = useState(15000);
  const [staff, setStaff] = useState(85000);
  const [labour, setLabour] = useState(12000);
  const [security, setSecurity] = useState(22000);
  const [admin, setAdmin] = useState(18000);
  const [otherExp, setOtherExp] = useState(6000);

  const [overheadRate, setOverheadRate] = useState(25.0);

  // Live Pure Financial Computations
  const cardChargeAmount = (Number(cardAmount) * Number(cardRate)) / 100;
  const netIncome = calculateNetIncome(Number(grossIncome), cardChargeAmount);

  const baseExpenses = 
    Number(water) + 
    Number(electricity) + 
    Number(rent) + 
    Number(driver) + 
    Number(staff) + 
    Number(labour) + 
    Number(security) + 
    Number(admin) + 
    Number(otherExp);

  const overheadAmount = calculateOverhead(baseExpenses, Number(overheadRate));
  const totalExpenditure = calculateTotalExpenditure(baseExpenses, overheadAmount);
  const netProfit = calculateNetProfit(netIncome, totalExpenditure);
  const profitMargin = calculateProfitMargin(netProfit, Number(grossIncome));

  const handleReset = () => {
    setGrossIncome(500000);
    setCardAmount(250000);
    setCardRate(2.0);
    setWater(5000);
    setElectricity(35000);
    setRent(120000);
    setDriver(15000);
    setStaff(85000);
    setLabour(12000);
    setSecurity(22000);
    setAdmin(18000);
    setOtherExp(6000);
    setOverheadRate(25.0);
  };

  return (
    <PageContainer title="Dynamic Profit & Loss Calculator" breadcrumb="Financial Calculator">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interactive Profit Calculator</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Live financial simulation model using standard formula engine</p>
        </div>
        <button className="btn btn-secondary" onClick={handleReset}>
          <RefreshCw size={16} /> Reset Calculator Defaults
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }}>
        {/* Left Column: Input Variables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Revenue Inputs */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-600)' }}>1. Income Inputs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Gross Income (LKR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={grossIncome}
                  onChange={e => setGrossIncome(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Payment Portion (LKR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={cardAmount}
                  onChange={e => setCardAmount(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Card Charge Rate ({cardRate}%)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={cardRate}
                  onChange={e => setCardRate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Expense Inputs */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent-rose)' }}>2. Expense Category Inputs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Water</label>
                <input type="number" className="form-control" value={water} onChange={e => setWater(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Electricity</label>
                <input type="number" className="form-control" value={electricity} onChange={e => setElectricity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Rent</label>
                <input type="number" className="form-control" value={rent} onChange={e => setRent(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Driver Salaries</label>
                <input type="number" className="form-control" value={driver} onChange={e => setDriver(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Staff Salaries</label>
                <input type="number" className="form-control" value={staff} onChange={e => setStaff(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Labourers</label>
                <input type="number" className="form-control" value={labour} onChange={e => setLabour(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Security</label>
                <input type="number" className="form-control" value={security} onChange={e => setSecurity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Administration</label>
                <input type="number" className="form-control" value={admin} onChange={e => setAdmin(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Other Expenses</label>
                <input type="number" className="form-control" value={otherExp} onChange={e => setOtherExp(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Overhead Configuration */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent-purple)' }}>3. Overhead Percentage</h3>
            <div className="form-group">
              <label className="form-label">Overhead Rate ({overheadRate}%)</label>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={overheadRate}
                onChange={e => setOverheadRate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Computation Statement */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '80px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <Calculator size={20} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Live Statement Result</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gross Income:</span>
                <strong>{formatCurrency(grossIncome)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
                <span>Card Charges ({cardRate}%):</span>
                <span>-{formatCurrency(cardChargeAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--brand-600)' }}>
                <span>NET INCOME:</span>
                <span>{formatCurrency(netIncome)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span>Base Expenses:</span>
                <strong>{formatCurrency(baseExpenses)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-rose)' }}>
                <span>Overhead Amount ({overheadRate}%):</span>
                <span>+{formatCurrency(overheadAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-rose)' }}>
                <span>TOTAL EXPENDITURE:</span>
                <span>{formatCurrency(totalExpenditure)}</span>
              </div>

              {/* Profit Headline Box */}
              <div style={{
                marginTop: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: netProfit >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: `1px solid ${netProfit >= 0 ? '#22c55e' : '#f43f5e'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  CALCULATED NET PROFIT
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: netProfit >= 0 ? 'var(--primary-600)' : 'var(--accent-rose)', margin: '0.25rem 0' }}>
                  {formatCurrency(netProfit)}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Profit Margin: {profitMargin}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
