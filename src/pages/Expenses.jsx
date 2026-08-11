import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { DataTable } from '../components/common/DataTable';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { PlusCircle, Filter } from 'lucide-react';

export const Expenses = () => {
  const { expenses, categories } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');

  const filteredExpenses = expenses.filter(e => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (selectedPaymentMethod !== 'All' && e.paymentMethod !== selectedPaymentMethod) return false;
    return true;
  });

  const columns = [
    { header: 'Expense ID', accessor: 'expenseId', sortable: true },
    { header: 'Date', accessor: 'expenseDate', sortable: true },
    { 
      header: 'Category', 
      accessor: 'category',
      sortable: true,
      render: (val) => <span className="badge badge-info">{val}</span>
    },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>{formatCurrency(val)}</span>
    },
    { header: 'Payment Method', accessor: 'paymentMethod' },
    { header: 'Created By', accessor: 'createdBy' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    }
  ];

  return (
    <PageContainer title="Expenditure Management" breadcrumb="Expenditure / All Expenses">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Business Operational Expenditures</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Record and categorize water, rent, staff, delivery, and overhead costs</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/expenditure/create')}>
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category:</span>
          <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ width: 'auto' }}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Payment Method:</span>
          <select className="form-control" value={selectedPaymentMethod} onChange={e => setSelectedPaymentMethod(e.target.value)} style={{ width: 'auto' }}>
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredExpenses}
        pageSize={10}
      />
    </PageContainer>
  );
};
