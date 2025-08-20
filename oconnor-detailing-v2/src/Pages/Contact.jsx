// src/Pages/Contact.jsx
import React, { useState, useCallback } from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';
import ContactForm from './ContactForm';
import './Contact.css';

const ContactPage = () => {
  const [confirmDate, setConfirmDate] = useState(null);     // date user clicked (awaiting confirm)
  const [requestedDate, setRequestedDate] = useState(null); // date being used in the form modal
  const [pendingDates, setPendingDates] = useState([]);     // optimistic local list (merged in calendar)

  // Invoked by the calendar when a GREEN (available) cell is clicked.
  const handleDateSelect = useCallback((dateString) => {
    // Expecting YYYY-MM-DD from AvailabilityCalendar (no timezones)
    setConfirmDate(dateString);
  }, []);

  // Confirm dialog → Yes
  const handleConfirmYes = useCallback(() => {
    if (confirmDate) setRequestedDate(confirmDate);
    setConfirmDate(null);
  }, [confirmDate]);

  // Confirm dialog → No / close
  const handleConfirmNo = useCallback(() => {
    setConfirmDate(null);
  }, []);

  // Called by ContactForm AFTER /api/send-email returns 200
  // Server marks the date as pending in Redis; we add it optimistically too
  const handleInquirySuccess = useCallback((dateString) => {
    setPendingDates((prev) => (prev.includes(dateString) ? prev : [...prev, dateString]));
    setRequestedDate(null);
  }, []);

  return (
    <div className="contact-page">
      <h1>Book Your Detail</h1>
      <p>Click an available date to request it.</p>

      <AvailabilityCalendar
        onDateSelect={handleDateSelect}
        pendingDates={pendingDates} // component fetches server data and merges with this
      />

      {/* —— Confirm Dialog —— */}
      {confirmDate && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-dialog">
            <p>
              You want to request <strong>{confirmDate}</strong>, correct?
            </p>
            <div className="confirm-buttons">
              <button onClick={handleConfirmYes} autoFocus>Yes</button>
              <button onClick={handleConfirmNo}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* —— Contact Form Modal —— */}
      {requestedDate && (
        <ContactForm
          key={requestedDate}                 // force a fresh form when date changes
          initialDate={requestedDate}         // prefill the date field
          onClose={() => setRequestedDate(null)}
          onSuccess={handleInquirySuccess}    // receives the date string on success
        />
      )}
    </div>
  );
};

export default ContactPage;

