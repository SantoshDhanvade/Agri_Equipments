import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { AdminAuthProvider } from './AdminAuthContext';

// Customer Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Equipment from './pages/Equipment';
import Cart from './pages/Cart';
import Booking from './pages/Booking';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Support from './pages/Support';
import About from './pages/About';

// Admin Pages
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import EquipmentForm from './Admin/EquipmentForm';
import AdminCustomerDetail from './Admin/AdminCustomerDetail';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-equipment" element={<EquipmentForm />} />
            <Route path="/admin/edit-equipment/:id" element={<EquipmentForm />} />
            <Route path="/admin/customer/:id" element={<AdminCustomerDetail />} />

            {/* Customer Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Equipment />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/booking/:equipmentId" element={<Booking />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order/:orderId" element={<OrderDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
