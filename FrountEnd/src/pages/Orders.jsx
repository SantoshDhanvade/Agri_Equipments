import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import '../css/Orders.css';

const Orders = () => {
  const { customer, isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && customer) {
      fetchOrders();
    }
  }, [isLoggedIn, customer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/orders/${customer.id}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <div className="orders-container"><p>Please login to view orders</p></div>;
  }

  if (loading) {
    return <div className="orders-container"><p>Loading orders...</p></div>;
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>₹{order.total_amount}</td>
                <td><span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>
                  <div className="order-action-buttons">
                    <button onClick={() => navigate(`/order/${order.id}`)}>View Details</button>
                    <button onClick={() => navigate(`/order/${order.id}`, { state: { print: true } })}>Download Receipt</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
