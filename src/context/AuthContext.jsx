import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : mockUsers[0]; // Default logged-in as Admin User
  });

  const login = (email, password) => {
    // Mock login verification
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      localStorage.setItem('auth_token', 'mock-jwt-token-12345');
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  const hasPermission = (requiredRoles = []) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
