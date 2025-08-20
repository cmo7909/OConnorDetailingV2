import React, { useEffect, useState } from 'react';
import './ContactForm.css';

const ContactForm = ({ initialDate, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    make: '',
    model: '',
    year: '',
    inquiry: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill the selected date from the calendar
  useEffect(() => {
    if (initialDate) {
      setFormData((fd) => ({ ...fd, dates: initialDate }));
    }
  }, [initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // Send the email (server also marks the date as pending in Redis)
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!emailRes.ok) {
        const data = await emailRes.json().catch(() => ({}));
        if (emailRes.status === 409) {
          throw new Error('That date is no longer available (already pending or booked).');
        }
        throw new Error(data.message || 'There was an issue sending your message.');
      }

      setSuccess(true);

      // Let parent update optimistic yellow + close the modal if desired
      if (typeof onSuccess === 'function') onSuccess(formData.dates);
      onClose?.();
      setFormData((fd) => ({ ...fd, name: '', email: '', phone: '', make: '', model: '', year: '', inquiry: '' }));
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <div className="modal">
        <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        <h2 id="contact-modal-title">Request a Detail for {formData.dates}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="dates"
            placeholder="Preferred Date"
            value={formData.dates}
            readOnly
          />

          <input
            type="text"
            name="make"
            placeholder="Vehicle Make"
            required
            autoCapitalize="words"
            value={formData.make}
            onChange={handleChange}
          />

          <input
            type="text"
            name="model"
            placeholder="Vehicle Model"
            required
            autoCapitalize="words"
            value={formData.model}
            onChange={handleChange}
          />

          <input
            type="text"
            name="year"
            placeholder="Vehicle Year"
            required
            inputMode="numeric"
            pattern="^(19|20)\d{2}$"
            title="Enter a 4-digit year"
            value={formData.year}
            onChange={handleChange}
          />

          <textarea
            name="inquiry"
            placeholder="Additional Notes or Questions"
            rows="4"
            value={formData.inquiry}
            onChange={handleChange}
            style={{ resize: 'none', overflowY: 'auto', maxHeight: '150px' }}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Inquiry'}
          </button>

          {success && <p className="success">Your message has been sent successfully!</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
