import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Equipment.css'; 

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderedIds, setOrderedIds] = useState(new Set());

  useEffect(() => {
    fetchCategories();
    fetchEquipment();
    if (localStorage.getItem('customer')) {
      fetchUserOrders();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8080/equipment';
      if (selectedCategory) {
        url = `http://localhost:8080/equipment/category/${selectedCategory}`;
      }
      const response = await axios.get(url);
      setEquipment(response.data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const custStr = localStorage.getItem('customer');
      if (!custStr) return;
      
      const cust = JSON.parse(custStr);
      const resp = await axios.get(`http://localhost:8080/orders/${cust.id}`);
      
      const ids = new Set();
      const todayString = new Date().toDateString();

      for (let ord of resp.data) {
        // Compare the order's date with today's date
        // Adjust "ord.order_date" if your backend uses a different date field like "createdAt"
        const orderDateString = new Date(ord.order_date || ord.createdAt || new Date()).toDateString();
        
        if (orderDateString === todayString) {
          const det = await axios.get(`http://localhost:8080/order/${ord.id}`);
          det.data.items.forEach(i => {
            // Track the items that were ordered TODAY
            ids.add(i.equipment_id);
          });
        }
      }
      setOrderedIds(ids);
    } catch (err) {
      console.error('Failed to fetch user orders', err);
    }
  };

  const navigate = useNavigate();

  const handleBookClick = (equipmentId) => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer) {
      alert('Please login first to continue.');
      navigate('/login');
      return;
    }
    // send the user to booking page where they can choose address and rental/buy options
    navigate(`/booking/${equipmentId}`);
  };

  const addToCart = async (equipmentId) => {
    const customerStr = localStorage.getItem('customer');
    if (!customerStr) {
      alert('Please login first to add items to your cart.');
      navigate('/login');
      return;
    }
    const customer = JSON.parse(customerStr);

    try {
      await axios.post('http://localhost:8080/cart', {
        customerId: customer.id,
        equipmentId: equipmentId,
        quantity: 1
      });
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="equipment-container">
      <h2>Agricultural Equipment</h2>
      
      <div className="categories-filter">
        <button
          className={!selectedCategory ? 'active' : ''}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={selectedCategory === cat.id ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading equipment...</p>
      ) : (
        <div className="equipment-grid">
          {equipment.map(item => {
            // Only disable if the item is rentable AND it was ordered today
            const isRentedToday = item.is_rentable && orderedIds.has(item.id);

            return (
              <div key={item.id} className="equipment-card">
                <img src={item.image || 'placeholder.png'} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                   <p className="price" style={{ fontWeight: 'bold' }}>Buy: ₹{item.price}</p>
                   {item.is_rentable === 1 || item.is_rentable === true ? (
                     <p className="rent-price" style={{ color: '#4CAF50' }}>Rent: ₹{item.rent_price} / day</p>
                   ) : null}
                   <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '4px' }}>
                     * Note: A 2% GST gateway charge applies at checkout
                   </p>
                </div>

                <p className="category">{item.category_name}</p>
                <div className="equipment-actions">
                  <button onClick={() => addToCart(item.id)} className="add-to-cart-btn" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBookClick(item.id)}
                    className="book-btn"
                    style={{ 
                      padding: '8px 16px', 
                      background: isRentedToday ? '#6c757d' : '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: isRentedToday ? 'not-allowed' : 'pointer' 
                    }}
                    disabled={isRentedToday}
                  >
                    {isRentedToday
                      ? 'Already rented today'
                      : item.is_rentable
                      ? 'Book / Rent'
                      : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Equipment;