import React, { createContext, useState, useEffect } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAdminLoggedIn(true);
    }
  }, []);

  const adminLogin = (adminData) => {
    setAdmin(adminData);
    setIsAdminLoggedIn(true);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdmin(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
