import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../css/Booking.css';

const Booking = () => {
  const { equipmentId } = useParams();
  const { customer, isLoggedIn } = useContext(AuthContext);
  const [equipment, setEquipment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [rentDays, setRentDays] = useState(1);
  const [mode, setMode] = useState('buy'); // 'buy' or 'rent'
  const [alreadyOrdered, setAlreadyOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  // payment details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchEquipment();
    fetchAddresses();
    checkPrevOrders();

    // Set mode from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam === 'rent' && equipment && equipment.is_rentable) {
      setMode('rent');
    } else {
      setMode('buy');
    }
  }, [isLoggedIn, equipmentId]);

  const fetchEquipment = async () => {
    try {
      const resp = await axios.get(`http://localhost:8080/equipment/${equipmentId}`);
      setEquipment(resp.data);
      if (resp.data && !resp.data.is_rentable) {
        setMode('buy');
      }
    } catch (err) {
      console.error('Failed to load equipment', err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const resp = await axios.get(`http://localhost:8080/addresses/${customer.id}`);
      setAddresses(resp.data);
    } catch (err) {
      console.error('Failed to load addresses', err);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      await axios.post('http://localhost:8080/address', {
        customerId: customer.id,
        address: newAddress
      });
      setNewAddress('');
      fetchAddresses();
    } catch (err) {
      console.error('Failed to add address', err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/address/${id}`);
      if (selectedAddressId === id) setSelectedAddressId(null);
      fetchAddresses();
    } catch (err) {
      console.error('Failed to delete address', err);
    }
  };

  const checkPrevOrders = async () => {
    try {
      const resp = await axios.get(`http://localhost:8080/orders/${customer.id}`);
      const orders = resp.data;
      for (let ord of orders) {
        if (ord.items) {
          // some order responses may include items property
          if (ord.items.some(i => i.equipment_id === parseInt(equipmentId))) {
            setAlreadyOrdered(true);
            break;
          }
        } else {
          // fetch order details to inspect items
          const det = await axios.get(`http://localhost:8080/order/${ord.id}`);
          if (det.data.items.some(i => i.equipment_id === parseInt(equipmentId))) {
            setAlreadyOrdered(true);
            break;
          }
        }
      }
    } catch (err) {
      console.error('Error checking previous orders', err);
    }
  };

  const handleSubmit = async () => {
    if (alreadyOrdered) {
      alert('You have already placed an order/rental for this item');
      return;
    }

    if (!selectedAddressId && !newAddress.trim()) {
      alert('Please select or enter a shipping address');
      return;
    }

    let shippingAddress = '';
    if (selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      shippingAddress = addr ? addr.address : '';
    }
    if (!shippingAddress && newAddress.trim()) {
      shippingAddress = newAddress;
      // create new address to store in db
      try {
        await axios.post('http://localhost:8080/address', {
          customerId: customer.id,
          address: newAddress
        });
        fetchAddresses();
      } catch (err) { console.error('Could not save new address', err); }
    }


    // Check if price is available
    if (equipment.price == null || equipment.price <= 0) {
      alert('This item is not available for purchase at this time.');
      return;
    }

    // Check if rental price is available
    if (mode === 'rent' && (equipment.rent_price == null || equipment.rent_price <= 0)) {
      alert('This item is not available for rent at this time.');
      return;
    }

    const orderData = {
      customerId: customer.id,
      totalAmount:
        mode === 'buy'
          ? equipment.price
          : equipment.rent_price * rentDays,
      shippingAddress,
      items: [
        {
          equipment_id: equipment.id,
          quantity: 1,
          price: mode === 'buy' ? equipment.price : equipment.rent_price,
          isRental: mode === 'rent',
          rentDays: mode === 'rent' ? rentDays : null
        }
      ]
    };

    try {
      // simple validation for card fields
      if (!cardNumber.trim() || !cardHolder.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        alert('Please enter valid payment details');
        setLoading(false);
        return;
      }

      // create payment (store card info too)
      const payResp = await axios.post('http://localhost:8080/payment/create', {
        customerId: customer.id,
        amount: orderData.totalAmount,
        method: 'CARD',
        cardNumber,
        cardHolder,
        expiry: cardExpiry,
        cvv: cardCvv
      });
      if (!payResp.data || !payResp.data.paymentId) {
        throw new Error('paymentId missing from create response: ' + JSON.stringify(payResp.data));
      }
      await axios.post(`http://localhost:8080/payment/${payResp.data.paymentId}/confirm`);

      // Add paymentId to orderData
      orderData.paymentId = payResp.data.paymentId;

      const resp = await axios.post('http://localhost:8080/order', orderData);
      alert('Booking successful! Redirecting to order details.');
      navigate(`/order/${resp.data.orderId}`, { state: { download: true } });
    } catch (err) {
      console.error('Booking failed', err);
      let msg = 'Failed to complete booking';
      if (err.response && err.response.data) {
        msg += ': ' + (err.response.data.error || JSON.stringify(err.response.data));
      } else if (err.message) {
        msg += ': ' + err.message;
      }
      alert(msg);
    }
  };

  if (!isLoggedIn) {
    return <div className="booking-container"><p>Please login to proceed</p></div>;
  }

  if (!equipment) {
    return <div className="booking-container"><p>Loading...</p></div>;
  }

  return (
    <div className="booking-container">
      <h2>{equipment.name}</h2>
      <p>{equipment.description}</p>

      <div style={{ marginTop: '12px' }}>
        {mode === 'buy' ? (
          <span className="price">Price: ₹{equipment.price}</span>
        ) : (
          <>
            <span className="rent-price">Rent per day: ₹{equipment.rent_price}</span>
            <div style={{ marginTop: '8px' }}>
              <label>
                Days:
                <input
                  type="number"
                  min="1"
                  value={rentDays}
                  onChange={e => setRentDays(parseInt(e.target.value))}
                  style={{ width: '60px', marginLeft: '4px' }}
                />
              </label>
            </div>
          </>
        )}
      </div>

      {equipment.is_rentable && (
        <div style={{ marginTop: '14px' }}>
          <label>
            <input
              type="radio"
              name="mode"
              value="buy"
              checked={mode === 'buy'}
              onChange={() => setMode('buy')}
            />
            Buy
          </label>{' '}
          <label>
            <input
              type="radio"
              name="mode"
              value="rent"
              checked={mode === 'rent'}
              onChange={() => setMode('rent')}
            />
            Rent
          </label>
        </div>
      )}



      <div className="address-section" style={{ marginTop: '16px' }}>
        <h4>Shipping Address</h4>
        {addresses.length === 0 ? (
          <p>No saved addresses yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {addresses.map((addr) => (
              <li key={addr.id} style={{ marginBottom: '6px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  {addr.address}
                </label>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  style={{ marginLeft: '12px' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            placeholder="Add new address"
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
            style={{ width: '60%', marginRight: '8px' }}
          />
          <button onClick={handleAddAddress}>Add</button>
        </div>
      </div>

      <div className="payment-section" style={{ marginTop: '16px' }}>
        <h4>Payment Details</h4>
        <div className="form-group">
          <label>Card Holder Name:</label>
          <input
            type="text"
            value={cardHolder}
            onChange={e => setCardHolder(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            required
            maxLength={19}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label>Expiry (MM/YY):</label>
            <input
              type="text"
              value={cardExpiry}
              onChange={e => setCardExpiry(e.target.value)}
              required
              placeholder="MM/YY"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>CVV:</label>
            <input
              type="password"
              value={cardCvv}
              onChange={e => setCardCvv(e.target.value)}
              required
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={alreadyOrdered || loading} style={{ marginTop: '16px' }}>
        {loading ? 'Processing...' : (mode === 'buy' ? 'Place Order' : 'Rent Now')}
      </button>
    </div>
  );
};

export default Booking;
