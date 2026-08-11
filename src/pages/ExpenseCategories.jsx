import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PlusCircle, Tag } from 'lucide-react';

export const ExpenseCategories = () => {
  const { categories, addCategory } = useApp();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('Operations');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({ name, parent, description });
    showToast(`Category "${name}" added successfully.`, 'success');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  const columns = [
    { header: 'Category Name', accessor: 'name', sortable: true },
    { header: 'Parent Group', accessor: 'parent', sortable: true },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    },
    { header: 'Created Date', accessor: 'createdAt' }
  ];

  return (
    <PageContainer title="Expense Categories" breadcrumb="Expenditure / Categories">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Expense Category Configuration</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Audit-friendly categorization for business expense tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        pageSize={10}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Expense Category"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Marketing & Ads"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parent Group</label>
            <select className="form-control" value={parent} onChange={e => setParent(e.target.value)}>
              <option value="Utilities">Utilities</option>
              <option value="Facility">Facility</option>
              <option value="Payroll">Payroll</option>
              <option value="Operations">Operations</option>
              <option value="Logistics">Logistics</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of expenses under this category..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Category</button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
