import React, { useState } from 'react';
import { Bell, Sun, Moon, Menu, User, Settings, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ title = "Dashboard", breadcrumb = "Overview", onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useApp();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon mobile-only" onClick={onMenuToggle} style={{ display: 'none' }}>
          <Menu size={20} />
        </button>
        <div className="page-title-area">
          <span className="page-breadcrumb">{breadcrumb}</span>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>

      <div className="header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface-hover)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
          <Calendar size={14} />
          <span>August 10, 2026</span>
        </div>

        {/* Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--accent-rose)',
                borderRadius: '50%'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="card" style={{
              position: 'absolute',
              right: 0,
              top: '120%',
              width: '320px',
              zIndex: 50,
              padding: '0.75rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 500 }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: n.read ? 'transparent' : 'var(--bg-surface-hover)', fontSize: '0.8125rem' }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{n.message}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-600)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>
              {user?.name?.[0] || 'A'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="card" style={{
              position: 'absolute',
              right: 0,
              top: '120%',
              width: '200px',
              zIndex: 50,
              padding: '0.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <button className="nav-item" style={{ width: '100%', color: 'var(--text-main)' }} onClick={() => navigate('/settings/financial')}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="nav-item" style={{ width: '100%', color: 'var(--accent-rose)' }} onClick={() => { logout(); navigate('/login'); }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
