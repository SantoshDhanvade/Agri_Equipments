import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../css/Register.css';

const Profile = () => {
  const { customer, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    taluka: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        state: customer.state || '',
        district: customer.district || '',
        taluka: customer.taluka || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('state', formData.state);
      payload.append('district', formData.district);
      payload.append('taluka', formData.taluka);
      // image update not implemented yet

      if (imageFile) {
        payload.append('image', imageFile);
      }
      const resp = await axios.put(
        `http://localhost:8080/customer/${customer.id}`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // refresh local storage and context
      login(resp.data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return <p>Loading...</p>;
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Your Profile</h2>
        <p>Welcome to your account page. Below you can view and update your personal information.  AgriEquipments provides easy access to agricultural equipment and services.</p>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Profile Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem' }}>
                <img src={imagePreview} alt="preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="district">District:</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="taluka">Taluka:</label>
            <input
              type="text"
              id="taluka"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
