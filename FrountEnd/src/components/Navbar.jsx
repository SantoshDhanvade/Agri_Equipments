import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../css/Navbar.css';

const Navbar = () => {
  const { customer, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => navigate('/')}>AgriEquipments</h1>
        </div>
        <ul className="navbar-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/cart">Cart</a></li>
          {isLoggedIn && (
            <>
              <li><a href="/orders">My Orders</a></li>
              <li>
                <a href="/profile">
                  {customer && customer.image && <img src={customer.image} alt="avatar" className="avatar" />}
                  Profile
                </a>
              </li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
