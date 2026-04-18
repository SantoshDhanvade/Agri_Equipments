import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminDashboard.css';

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer();
    fetchCart();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/customer/${id}`);
      setCustomer(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/admin/customers/${id}/cart`);
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const updateQty = async (cartId) => {
    const newQty = parseInt(prompt('New quantity:'));
    if (!newQty || newQty < 1) return;
    try {
      await axios.put(`http://localhost:8080/admin/customers/${id}/cart/${cartId}`, { quantity: newQty });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (cartId) => {
    if (!window.confirm('Delete this cart item?')) return;
    try {
      await axios.delete(`http://localhost:8080/admin/customers/${id}/cart/${cartId}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Customer Detail</h1>
        <button onClick={() => navigate('/admin/dashboard')}>Back</button>
      </nav>

      <div className="admin-content">
        {customer && (
          <div>
            <h2>{customer.name} (ID: {customer.id})</h2>
            <p>{customer.email} • {customer.phone}</p>
          </div>
        )}

        <div className="admin-section">
          <h3>Cart Items</h3>
          {cart.length === 0 ? <p>No cart items</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(it => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>₹{it.price}</td>
                    <td>{it.quantity}</td>
                    <td>
                      <button onClick={() => updateQty(it.id)}>Edit</button>
                      <button onClick={() => deleteItem(it.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
