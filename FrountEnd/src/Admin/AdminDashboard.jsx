import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../AdminAuthContext';
import axios from 'axios';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdminLoggedIn, adminLogout } = useContext(AdminAuthContext);
  const [activeTab, setActiveTab] = useState('equipment');
  const [equipment, setEquipment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [salesSummary, setSalesSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSalesSummary();
    }
  }, [activeTab]);

  const fetchSalesSummary = async () => {
    try {
      const salesRes = await axios.get('http://localhost:8080/admin/sales-summary');
      setSalesSummary(salesRes.data);
    } catch (err) {
      console.error('Failed to fetch sales summary:', err);
    }
  };

  const fetchData = async () => {
    try {
      const [equipRes, custRes, feedRes, catRes] = await Promise.all([
        axios.get('http://localhost:8080/admin/equipment'),
        axios.get('http://localhost:8080/admin/customers'),
        axios.get('http://localhost:8080/admin/feedbacks'),
        axios.get('http://localhost:8080/admin/categories')
      ]);

      setEquipment(equipRes.data);
      setCustomers(custRes.data);
      setFeedbacks(feedRes.data);
      setCategories(catRes.data);

      await fetchSalesSummary();
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const deleteEquipment = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:8080/admin/equipment/${id}`);
        fetchData();
        alert('Equipment deleted');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const suspendCustomer = async (id) => {
    try {
      await axios.post(`http://localhost:8080/admin/customers/${id}/suspend`);
      fetchData();
      alert('Customer status updated');
    } catch (err) {
      console.error('Suspend failed:', err);
    }
  };


  const solveFeedback = async (id) => {
    try {
      await axios.post(`http://localhost:8080/admin/feedbacks/${id}/solve`);
      setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Resolved' } : fb));
      alert('Feedback marked resolved');
    } catch (err) {
      console.error('Solve failed:', err);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await axios.delete(`http://localhost:8080/admin/feedbacks/${id}`);
      fetchData();
      alert('Feedback deleted');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="admin-tabs">
        <button
          className={activeTab === 'equipment' ? 'active' : ''}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment
        </button>
        <button
          className={activeTab === 'customers' ? 'active' : ''}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button
          className={activeTab === 'feedbacks' ? 'active' : ''}
          onClick={() => setActiveTab('feedbacks')}
        >
          Feedbacks
        </button>
        <button
          className={activeTab === 'sales' ? 'active' : ''}
          onClick={() => setActiveTab('sales')}
        >
          Sales
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'equipment' && (
          <div className="admin-section">
            <h2>Equipment Management</h2>
            <button onClick={() => navigate('/admin/add-equipment')} className="add-btn">
              Add New Equipment
            </button>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Rentable</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category_name || item.category_id}</td>
                    <td>₹{item.price}</td>
                    <td>{item.discount_percent ? item.discount_percent + '%' : '—'}</td>
                    <td>{item.is_rentable ? (item.rent_price ? `₹${item.rent_price}` : 'Yes') : 'No'}</td>
                    <td>{item.quantity_available}</td>
                    <td>
                      <button onClick={() => navigate(`/admin/edit-equipment/${item.id}`)}>Edit</button>
                      <button onClick={() => deleteEquipment(item.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="admin-section">
            <h2>Customer Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(cust => (
                  <tr key={cust.id}>
                    <td>{cust.id}</td>
                    <td>{cust.name}</td>
                    <td>{cust.email}</td>
                    <td>{cust.phone}</td>
                    <td>{cust.suspended ? 'Suspended' : 'Active'}</td>
                    <td>
                      <button onClick={() => suspendCustomer(cust.id)}>Toggle Status</button>
                      <button onClick={() => navigate(`/admin/customer/${cust.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="admin-section">
            <h2>Review Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipment</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(rev => (
                  <tr key={rev.id}>
                    <td>{rev.id}</td>
                    <td>{rev.equipment_id}</td>
                    <td>{rev.rating}/5</td>
                    <td>{rev.feedback}</td>
                    <td>{rev.status}</td>
                    <td>
                      {rev.status !== 'Approved' && (
                        <button onClick={() => approveReview(rev.id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'feedbacks' && (
          <div className="admin-section">
            <h2>Feedback Management</h2>
            <div style={{ marginBottom: '8px' }}>
              <button onClick={() => setFilter('all')} className={filter==='all'?'active-filter':''}>All</button>{' '}
              <button onClick={() => setFilter('unsolved')} className={filter==='unsolved'?'active-filter':''}>Unsolved</button>{' '}
              <button onClick={() => setFilter('solved')} className={filter==='solved'?'active-filter':''}>Solved</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Feedback</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks
                  .filter(fb => {
                    const status = (fb.status || '').toString().toLowerCase();
                    const isSolved = status.includes('solv');
                    if (filter === 'all') return true;
                    if (filter === 'solved') return isSolved;
                    return !isSolved;
                  })
                  .map(fb => (
                    <tr key={fb.id}>
                      <td>{fb.id}</td>
                      <td>{fb.user || 'Unknown'}</td>
                      <td style={{ maxWidth: '400px', whiteSpace: 'pre-wrap' }}>{fb.feedback || 'No message'}</td>
                      <td>{fb.rating != null ? `${fb.rating}/5` : '—'}</td>
                      <td>{fb.status}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {!(fb.status || '').toString().toLowerCase().includes('solv') && (
                            <button onClick={() => solveFeedback(fb.id)}>Solve</button>
                          )}
                          <button onClick={() => deleteFeedback(fb.id)} className="delete-btn">Delete</button>
                          {fb.user && (
                            <a href={`mailto:${fb.user}`}><button>Reply</button></a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="admin-section">
            <h2>Sales Summary</h2>
            <div style={{ marginBottom: '12px' }}>
              <button onClick={() => window.print()} className="print-btn">Print</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Total (₹)</th>
                  <th>Profit (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Today</td>
                  <td>₹{salesSummary.daily ? salesSummary.daily.toFixed(2) : '0.00'}</td>
                  <td>₹{salesSummary.dailyProfit ? salesSummary.dailyProfit.toFixed(2) : '0.00'}</td>
                </tr>
                <tr>
                  <td>This Month</td>
                  <td>₹{salesSummary.monthly ? salesSummary.monthly.toFixed(2) : '0.00'}</td>
                  <td>₹{salesSummary.monthlyProfit ? salesSummary.monthlyProfit.toFixed(2) : '0.00'}</td>
                </tr>
                <tr>
                  <td>This Year</td>
                  <td>₹{salesSummary.yearly ? salesSummary.yearly.toFixed(2) : '0.00'}</td>
                  <td>₹{salesSummary.yearlyProfit ? salesSummary.yearlyProfit.toFixed(2) : '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
