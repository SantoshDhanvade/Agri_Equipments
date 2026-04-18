import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (customerData) => {
    setCustomer(customerData);
    setIsLoggedIn(true);
    localStorage.setItem('customer', JSON.stringify(customerData));
  };

  const logout = () => {
    setCustomer(null);
    setIsLoggedIn(false);
    localStorage.removeItem('customer');
  };

  return (
    <AuthContext.Provider value={{ customer, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
