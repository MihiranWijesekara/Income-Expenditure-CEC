import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const KpiCard = ({ title, value, isCurrency = true, trend, subtitle, icon: Icon, color = "var(--primary-600)" }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{title}</span>
        {Icon && (
          <div style={{ 
            padding: '0.5rem', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: `${color}15`, 
            color 
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          {isCurrency ? formatCurrency(value) : value}
        </h2>
      </div>

      {(trend !== undefined || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          {trend !== undefined && (
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              fontWeight: 600,
              color: trend >= 0 ? '#16a34a' : '#e11d48'
            }}>
              {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)' }}>{subtitle || 'vs previous period'}</span>
        </div>
      )}
    </div>
  );
};
