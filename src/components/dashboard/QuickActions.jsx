import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CreditCard, FileSpreadsheet, Calculator } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Create Bill', icon: PlusCircle, path: '/income/bills/create', color: 'var(--primary-600)' },
    { title: 'Add Expense', icon: CreditCard, path: '/expenditure/create', color: 'var(--accent-blue)' },
    { title: 'View Reports', icon: FileSpreadsheet, path: '/reports/summary', color: 'var(--accent-purple)' },
    { title: 'Financial Calculator', icon: Calculator, path: '/calculator', color: 'var(--accent-amber)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {actions.map((act, index) => {
        const Icon = act.icon;
        return (
          <button
            key={index}
            className="card"
            onClick={() => navigate(act.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: `${act.color}15`,
              color: act.color
            }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{act.title}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Action</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
