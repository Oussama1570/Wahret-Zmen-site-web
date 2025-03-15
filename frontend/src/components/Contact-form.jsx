import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      onSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError('Failed to send message. Try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-title">Get in Touch with Wahret Zmen Boutique</h3>
      <p className="contact-description">
        Have questions about our traditional clothing collection? Looking for a custom design or special order?  
        We'd love to hear from you! Fill out the form below, and our team will get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
