import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import '../css/Cart.css';

const Cart = () => {
  const { customer, isLoggedIn } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (isLoggedIn && customer) {
      fetchCart();
      fetchAddresses();
    }
  }, [isLoggedIn, customer]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/cart/${customer.id}`);
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cartId);
      return;
    }

    try {
      await axios.put(`http://localhost:8080/cart/${cartId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8080/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
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

  const checkout = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Check if all items have valid prices
    for (let item of cartItems) {
      if (item.price == null || item.price <= 0) {
        alert(`Item "${item.name}" is not available for purchase. Please remove it from cart.`);
        return;
      }
    }

    let shippingAddress = '';
    if (selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      shippingAddress = addr ? addr.address : '';
    }
    if (!shippingAddress) {
      if (newAddress.trim()) {
        shippingAddress = newAddress;
      } else {
        alert('Please select or enter a shipping address');
        return;
      }
    }

    try {
      // Create mock payment first
      const payResp = await axios.post('http://localhost:8080/payment/create', {
        customerId: customer.id,
        amount: total,
        method: 'CARD'
      });

      const paymentId = payResp.data.paymentId;
      if (!paymentId) {
        throw new Error('paymentId missing from create response: ' + JSON.stringify(payResp.data));
      }
      await axios.post(`http://localhost:8080/payment/${paymentId}/confirm`);

      const orderData = {
        customerId: customer.id,
        totalAmount: total,
        shippingAddress: shippingAddress,
        paymentId: paymentId,
        items: cartItems.map(item => ({
          equipment_id: item.equipment_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post('http://localhost:8080/order', orderData);
      const orderId = response.data.orderId;
      alert('Payment successful — order placed');
      window.location.href = `/order/${orderId}`;
    } catch (err) {
      console.error('Checkout failed:', err);
      let msg = 'Failed to place order';
      if (err.response && err.response.data) {
        msg += ': ' + (err.response.data.error || JSON.stringify(err.response.data));
      } else if (err.message) {
        msg += ': ' + err.message;
      }
      alert(msg);
    }
  };

  if (!isLoggedIn) {
    return <div className="cart-container"><p>Please login to view cart</p></div>;
  }

  if (loading) {
    return <div className="cart-container"><p>Loading cart...</p></div>;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Equipment</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Buy/Rent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => window.location.href = `/booking/${item.equipment_id}?mode=buy`} style={{ marginRight: '4px' }}>Buy Now</button>
                    {item.is_rentable ? <button onClick={() => window.location.href = `/booking/${item.equipment_id}?mode=rent`}>Rent</button> : null}
                  </td>
                  <td>
                    <button onClick={() => removeItem(item.id)} className="remove-btn">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>


            <div className="address-section" style={{ marginBottom: '16px' }}>
              <h4>Select Shipping Address</h4>
              {addresses.length === 0 ? (
                <p>No saved addresses</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {addresses.map(addr => (
                    <li key={addr.id} style={{ marginBottom: '4px' }}>
                      <label>
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />{' '}
                        {addr.address}
                      </label>{' '}
                      <button onClick={() => handleDeleteAddress(addr.id)} style={{ marginLeft: '8px' }}>Delete</button>
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

            <button onClick={checkout} className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
