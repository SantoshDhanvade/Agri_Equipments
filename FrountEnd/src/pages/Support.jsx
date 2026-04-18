import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../css/Support.css';

const Support = () => {
  const { customer, isLoggedIn } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus('Please enter your message');
      return;
    }
    try {
      await axios.post('http://localhost:8080/feedback', {
        user: customer ? customer.email : 'anonymous',
        role: customer ? 'customer' : 'guest',
        rating,
        feedback: message
      });
      setStatus('Feedback submitted. Thank you!');
      setMessage('');
      setRating(5);
    } catch (err) {
      console.error('Feedback error', err);
      setStatus('Submission failed');
    }
  };

  if (!isLoggedIn) {
    return <div className="support-container"><p>Please login to send feedback/support request</p></div>;
  }

  return (
    <div className="support-container">
      <h2>Contact Support</h2>
      <form onSubmit={handleSubmit} className="support-form">
        <div className="form-group">
          <label>Your Message:</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Rating (optional):</label>
          <select value={rating} onChange={e => setRating(parseInt(e.target.value))}>
            {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button type="submit">Send</button>
      </form>
      {status && <p className="status-msg">{status}</p>}
      <div className="contact-mail">
        <p>Or email us directly at <a href="mailto:support@agriequipments.com">support@agriequipments.com</a></p>
      </div>
    </div>
  );
};

export default Support;
