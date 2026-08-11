import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const PageContainer = ({ children, title = "Dashboard", breadcrumb = "Overview" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="main-wrapper">
        <Header 
          title={title} 
          breadcrumb={breadcrumb}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
        />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};
