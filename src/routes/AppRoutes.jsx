import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

// Lazy-loaded pages for optimization
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Bills = lazy(() => import('../pages/Bills').then(m => ({ default: m.Bills })));
const CreateBill = lazy(() => import('../pages/CreateBill').then(m => ({ default: m.CreateBill })));
const Expenses = lazy(() => import('../pages/Expenses').then(m => ({ default: m.Expenses })));
const AddExpense = lazy(() => import('../pages/AddExpense').then(m => ({ default: m.AddExpense })));
const ExpenseCategories = lazy(() => import('../pages/ExpenseCategories').then(m => ({ default: m.ExpenseCategories })));
const FinancialAnalysis = lazy(() => import('../pages/FinancialAnalysis').then(m => ({ default: m.FinancialAnalysis })));
const ProfitCalculator = lazy(() => import('../pages/ProfitCalculator').then(m => ({ default: m.ProfitCalculator })));
const Reports = lazy(() => import('../pages/Reports').then(m => ({ default: m.Reports })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const Users = lazy(() => import('../pages/Users').then(m => ({ default: m.Users })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem' }}>
        <SkeletonLoader height="60px" count={3} />
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Income / Bills */}
        <Route path="/income/bills" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Staff']}>
            <Bills />
          </ProtectedRoute>
        } />
        <Route path="/income/bills/create" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Staff']}>
            <CreateBill />
          </ProtectedRoute>
        } />

        {/* Expenditure */}
        <Route path="/expenditure" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <Expenses />
          </ProtectedRoute>
        } />
        <Route path="/expenditure/create" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <AddExpense />
          </ProtectedRoute>
        } />
        <Route path="/expenditure/categories" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <ExpenseCategories />
          </ProtectedRoute>
        } />

        {/* Financial Analysis */}
        <Route path="/analysis" element={<Navigate to="/analysis/daily" replace />} />
        <Route path="/analysis/:view" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <FinancialAnalysis />
          </ProtectedRoute>
        } />

        {/* Profit Calculator */}
        <Route path="/calculator" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <ProfitCalculator />
          </ProtectedRoute>
        } />

        {/* Reports */}
        <Route path="/reports" element={<Navigate to="/reports/summary" replace />} />
        <Route path="/reports/:type" element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Accountant']}>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Settings */}
        <Route path="/settings" element={<Navigate to="/settings/financial" replace />} />
        <Route path="/settings/:section" element={
          <ProtectedRoute requiredRoles={['Admin']}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Users */}
        <Route path="/users" element={
          <ProtectedRoute requiredRoles={['Admin']}>
            <Users />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
