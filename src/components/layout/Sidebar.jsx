import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  LineChart, 
  FileSpreadsheet, 
  Calculator, 
  Settings, 
  Users, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Staff', 'Accountant'] },
    { title: 'Daily Total Income', path: '/income/bills', icon: Receipt, roles: ['Admin', 'Manager', 'Staff'] },
    { title: 'Expenditures', path: '/expenditure', icon: CreditCard, roles: ['Admin', 'Manager', 'Accountant'] },
    { title: 'Financial Analysis', path: '/analysis/daily', icon: LineChart, roles: ['Admin', 'Manager', 'Accountant'] },
    { title: 'Reports', path: '/reports/summary', icon: FileSpreadsheet, roles: ['Admin', 'Manager', 'Accountant'] },
    { title: 'Profit Calculator', path: '/calculator', icon: Calculator, roles: ['Admin', 'Manager', 'Accountant'] },
    { title: 'Settings', path: '/settings/financial', icon: Settings, roles: ['Admin'] },
    { title: 'User Management', path: '/users', icon: Users, roles: ['Admin'] }
  ];

  const visibleNav = navItems.filter(item => hasPermission(item.roles));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-icon">
            <TrendingUp size={20} />
          </div>
          {!collapsed && <span>FinExecutive</span>}
        </div>
        <button 
          className="btn-icon" 
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--slate-400)' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-600)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}>
            {user?.name?.[0] || 'A'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.name || 'Admin User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                {user?.role || 'Administrator'}
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="btn-icon" title="Logout" style={{ color: 'var(--slate-400)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
