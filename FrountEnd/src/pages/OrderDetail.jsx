import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../css/OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { customer, isLoggedIn } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (isLoggedIn && customer) {
      fetchOrder();
    }
  }, [orderId, isLoggedIn, customer]);

  // Trigger print if we came from another page (e.g., My Orders) with print flag
  useEffect(() => {
    if (!loading && order && location.state?.print) {
      handlePrint();
    }
  }, [order, loading, location.state?.print]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/order/${orderId}`);

      const items = data.items || [];
      const paymentId = data.payment_id ?? data.paymentId;

      let payment = null;
      if (paymentId) {
        try {
          const paymentRes = await axios.get(`http://localhost:8080/payment/${paymentId}`);
          payment = paymentRes.data;
        } catch (err) {
          console.warn('Failed to load payment info for order:', paymentId, err);
        }
      }

      setOrder({
        ...data,
        paymentId,
        payment
      });
      setItems(items);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };



  const handleProcessPayment = async () => {
    if (!order) return;

    const paymentId = order.paymentId || order.payment?.id;
    if (!paymentId) {
      alert('No payment information found for this order.');
      return;
    }

    setProcessingPayment(true);
    try {
      await axios.post(`http://localhost:8080/payment/${paymentId}/confirm`);
      await axios.put(`http://localhost:8080/orders/${order.id}/status`, { status: 'Completed' });

      const paymentRes = await axios.get(`http://localhost:8080/payment/${paymentId}`);
      setOrder(prev => ({
        ...prev,
        status: 'Completed',
        payment: paymentRes.data
      }));
    } catch (err) {
      console.error('Payment processing failed:', err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!isLoggedIn) {
    return <div className="order-detail-container"><p>Please login to view orders</p></div>;
  }

  if (loading) {
    return <div className="order-detail-container"><p>Loading order...</p></div>;
  }

  if (!order) {
    return <div className="order-detail-container"><p>Order not found</p></div>;
  }

  const orderStatus = (order.status || 'Pending').toString();
  const normalizedStatus = orderStatus.toLowerCase();
  const paymentStatus = order.payment?.status?.toLowerCase();
  const showPaymentOptions = !['completed', 'paid', 'success'].includes(normalizedStatus) && !['completed', 'paid', 'success'].includes(paymentStatus);

  return (
    <>
      <div className="order-detail-container">
        {/* Hide this section when printing */}
        <div className="no-print">
          <h2>Order Details</h2>
          <div className="order-info">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span className={`status-${orderStatus.toLowerCase()}`}>{orderStatus}</span></p>
          <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
          
          {showPaymentOptions && (
            <div className="payment-options-container">
              <h3>Select Payment Method (Demo)</h3>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>
                This is a simulated payment flow. Selecting any option will proceed to mark the order paid.
              </p>
              <div className="payment-methods">
                {['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map(method => (
                  <label key={method} className="payment-method-label">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method}
                      checked={selectedPaymentMethod === method}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    {method}
                  </label>
                ))}
              </div>
              <button 
                className="pay-now-button" 
                onClick={handleProcessPayment}
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing Payment...' : `Mark as Paid (Simulated)`}
              </button>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="print-button" onClick={handlePrint}>
              🖨️ Print / Save as PDF
            </button>
          </div>
          </div>
        </div>

        {/* The Printable Receipt Section (Watermark is handled via CSS ::before) */}
        <div className="receipt-paper" id="printable-receipt">
          <div className="receipt-header">
            <h2>AGRI EQUIPMENT RENTALS</h2>
            <p>Official Order Receipt</p>
          </div>

          <div className="receipt-meta">
            <div>
              <strong>Order ID:</strong> #{order.id}
            </div>
            <div>
              <strong>Date:</strong> {new Date(order.order_date).toLocaleString()}
            </div>
            <div>
              <strong>Shipping To:</strong> {order.shipping_address}
            </div>
          </div>

          <table className="receipt-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">₹{item.price}</td>
                  <td className="text-right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {order.payment && (
            <div className="receipt-payment-info">
              <p><strong>Payment Method:</strong> {order.payment.method}</p>
              <p><strong>Transaction ID:</strong> {order.payment.id}</p>
              <p><strong>Status:</strong> {order.payment.status}</p>
            </div>
          )}

          <div className="receipt-total">
            <h3>Total Paid: ₹{order.total_amount}</h3>
          </div>

          <div className="receipt-footer">
            <p>Thank you for choosing our services!</p>
            <p>For support, please contact support@agrirentals.com</p>
          </div>
        </div>
      </div>
    </>
  );
};



export default OrderDetail;