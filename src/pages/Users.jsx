import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { mockUsers } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { PlusCircle, ShieldCheck } from 'lucide-react';

export const Users = () => {
  const [usersList, setUsersList] = useState(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser = {
      id: `USR-00${usersList.length + 1}`,
      name,
      email,
      role,
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersList([...usersList, newUser]);
    showToast(`User ${name} created with role ${role}`, 'success');
    setName('');
    setEmail('');
    setShowModal(false);
  };

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { 
      header: 'Role', 
      accessor: 'role',
      sortable: true,
      render: (val) => (
        <span className={`badge ${val === 'Admin' ? 'badge-danger' : val === 'Manager' ? 'badge-warning' : 'badge-info'}`}>
          {val}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    },
    { header: 'Last Login', accessor: 'lastLogin' },
    { header: 'Created Date', accessor: 'createdAt' }
  ];

  return (
    <PageContainer title="User & Role Management" breadcrumb="Users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Authorized Staff & Roles</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Role-based access matrix for Admin, Manager, Accountant, and Staff</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={18} color="var(--primary-600)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Frontend Access Control Matrix</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8125rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Admin:</strong> Full System Access & Config
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Manager:</strong> Dashboard, Bills, Expenses, Reports
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Accountant:</strong> Expenses, Reports, Financial Analysis
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Staff:</strong> Customer Bills & View Dashboard
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={usersList}
        pageSize={10}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add User"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ruwan Perera"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">User Role</label>
            <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Accountant">Accountant</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create User</button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
