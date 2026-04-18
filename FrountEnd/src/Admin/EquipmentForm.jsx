import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/EquipmentForm.css';

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
    specifications: '',
    discountPercent: '',
    isRentable: false,
    rentPrice: ''
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchEquipment();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/equipment/${id}`);
      const equip = response.data;
      setFormData({
        categoryId: equip.category_id,
        name: equip.name,
        description: equip.description,
        price: equip.price,
        quantity: equip.quantity_available,
        specifications: equip.specifications || '',
        discountPercent: equip.discount_percent || 0,
        isRentable: equip.is_rentable === 1 || equip.is_rentable === true,
        rentPrice: equip.rent_price || ''
      });
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('specifications', formData.specifications);
    formDataToSend.append('discountPercent', formData.discountPercent || 0);
    formDataToSend.append('isRentable', formData.isRentable ? 'true' : 'false');
    if (formData.isRentable) formDataToSend.append('rentPrice', formData.rentPrice || 0);
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      if (id) {
        await axios.put(`http://localhost:8080/admin/equipment/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Equipment updated successfully');
      } else {
        await axios.post('http://localhost:8080/admin/equipment', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Equipment added successfully');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <div className="form-box">
        <h2>{id ? 'Edit Equipment' : 'Add New Equipment'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category:</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₹):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Specifications:</label>
            <textarea
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Discount (%):</label>
            <input
              type="number"
              name="discountPercent"
              value={formData.discountPercent}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Rentable:</label>
            <input
              type="checkbox"
              name="isRentable"
              checked={formData.isRentable}
              onChange={handleCheckbox}
            />
          </div>

          {formData.isRentable && (
            <div className="form-group">
              <label>Rent Price (per day):</label>
              <input
                type="number"
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          )}

          <div className="form-group">
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Equipment' : 'Add Equipment')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
