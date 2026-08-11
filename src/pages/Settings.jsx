import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { DataTable } from '../components/common/DataTable';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Save, History } from 'lucide-react';

export const Settings = () => {
  const { settings, settingsHistory, updateSettings } = useApp();
  const { showToast } = useToast();

  const [overheadRate, setOverheadRate] = useState(settings.overheadRate);
  const [cardRate, setCardRate] = useState(settings.cardRate);
  const [effectiveFrom, setEffectiveFrom] = useState('2026-08-01');
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (overheadRate < 0 || overheadRate > 100 || cardRate < 0 || cardRate > 100) {
      showToast('Rates must be between 0% and 100%', 'error');
      return;
    }

    updateSettings({
      overheadRate: Number(overheadRate),
      cardRate: Number(cardRate),
      effectiveFrom,
      businessName,
      businessEmail,
      businessPhone
    }, 'Admin User');

    showToast('Financial settings and effective dates updated!', 'success');
  };

  const columns = [
    { header: 'Setting', accessor: 'setting', sortable: true },
    { header: 'Old Value', accessor: 'oldValue' },
    { 
      header: 'New Value', 
      accessor: 'newValue',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{val}</span>
    },
    { header: 'Effective From', accessor: 'effectiveFrom' },
    { header: 'Effective To', accessor: 'effectiveTo' },
    { header: 'Changed By', accessor: 'changedBy' }
  ];

  return (
    <PageContainer title="Financial & System Settings" breadcrumb="Settings">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>System Financial Configuration</h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Configure dynamic overhead rates, card charges & business metadata</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        {/* Overhead & Card Configuration */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Financial Formula Rates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Overhead Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={overheadRate}
                onChange={e => setOverheadRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Charge Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={cardRate}
                onChange={e => setCardRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                className="form-control"
                value={effectiveFrom}
                onChange={e => setEffectiveFrom(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Business Profile Metadata */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Business Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Business / Company Name</label>
              <input
                type="text"
                className="form-control"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Email</label>
              <input
                type="email"
                className="form-control"
                value={businessEmail}
                onChange={e => setBusinessEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={businessPhone}
                onChange={e => setBusinessPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <Save size={18} /> Save Settings
        </button>
      </form>

      {/* Audit History Log */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <History size={20} color="var(--primary-600)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Effective Settings Change Audit History</h3>
        </div>

        <DataTable
          columns={columns}
          data={settingsHistory}
          searchable={false}
          pageSize={5}
        />
      </div>
    </PageContainer>
  );
};
