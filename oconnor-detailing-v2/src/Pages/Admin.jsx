// src/Pages/Admin.jsx
import React, { useEffect, useState } from 'react';

function daysInMonth(yyyyMm) {
  const y = Number(yyyyMm.slice(0, 4));
  const m = Number(yyyyMm.slice(5)); // 1-12
  return new Date(y, m, 0).getDate();
}

//Comment to try a push through main in case thats the issue

export default function Admin() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // "YYYY-MM"
  const [pending, setPending] = useState([]);
  const [booked, setBooked]   = useState([]);
  const [busy, setBusy]       = useState([]);

  const [blockDate, setBlockDate] = useState('');
  const [bookDate,  setBookDate]  = useState('');

  async function load() {
    try {
      const r = await fetch(`/api/calendar-status?month=${month}`);
      if (!r.ok) throw new Error(`calendar-status ${r.status}`);
      const j = await r.json();
      setPending(j.pending || []);
      setBooked(j.booked || []);
      setBusy(j.busy || []);
    } catch (err) {
      console.error('calendar-status failed:', err);
      setPending([]);
      setBooked([]);
      setBusy([]);
    }
  }
  useEffect(() => { load(); }, [month]);

  async function decide(date, action) {
    const adminKey = (process.env.REACT_APP_ADMIN_KEY || '').trim();
    try {
      const r = await fetch('/api/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ date, action }),
      });
      if (!r.ok) {
        const msg = await r.text();
        throw new Error(`decision ${r.status}: ${msg}`);
      }
    } catch (err) {
      console.error('decision failed:', err);
    } finally {
      load();
    }
  }

  async function handleBlock(e) {
    e.preventDefault();
    if (!blockDate) return;
    await decide(blockDate, 'block');
    setBlockDate('');
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!bookDate) return;
    await decide(bookDate, 'book'); // manual booking action
    setBookDate('');
  }

  const maxDay = String(daysInMonth(month)).padStart(2, '0');

  return (
    <div style={{ padding: 20, maxWidth: 760 }}>
      <h1>Admin – Calendar Controls</h1>

      <label style={{ display: 'block', marginBottom: 12 }}>
        View month:&nbsp;
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
      </label>

      {/* Book a date (approved) */}
      <section style={{ margin: '20px 0', padding: '12px', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Book a Date (approved)</h2>
        <form onSubmit={handleBook}>
          <input
            type="date"
            value={bookDate}
            onChange={e => setBookDate(e.target.value)}
            min={`${month}-01`}
            max={`${month}-${maxDay}`}
          />
          <button type="submit" style={{ marginLeft: 8 }}>Add as Booked</button>
        </form>
        <small>
          Immediately marks the date as <strong>booked</strong> (dark gray). If it was pending or busy, it will be cleared from those lists.
        </small>
      </section>

      {/* Block a date (busy) */}
      <section style={{ margin: '20px 0', padding: '12px', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Block a Date (busy)</h2>
        <form onSubmit={handleBlock}>
          <input
            type="date"
            value={blockDate}
            onChange={e => setBlockDate(e.target.value)}
            min={`${month}-01`}
            max={`${month}-${maxDay}`}
          />
          <button type="submit" style={{ marginLeft: 8 }}>Block</button>
        </form>
        <small>
          Marks the date as <strong>busy</strong> (red). If the date was pending or booked, it’s removed from those.
        </small>
      </section>

      {/* Pending list */}
      <section style={{ margin: '20px 0' }}>
        <h2>Pending requests ({pending.length})</h2>
        {pending.length === 0 && <p>No pending dates.</p>}
        <ul>
          {pending.map(d => (
            <li key={d} style={{ margin: '8px 0' }}>
              {d}
              <button onClick={() => decide(d, 'approve')} style={{ marginLeft: 8 }}>Approve</button>
              <button onClick={() => decide(d, 'deny')} style={{ marginLeft: 8 }}>Deny</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Booked list */}
      <section style={{ margin: '20px 0' }}>
        <h2>Booked (approved) ({booked.length})</h2>
        {booked.length === 0 && <p>No booked dates this month.</p>}
        <ul>
          {booked.map(d => (
            <li key={d} style={{ margin: '8px 0' }}>
              {d}
              <button onClick={() => decide(d, 'unbook')} style={{ marginLeft: 8 }}>Unbook</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Busy list */}
      <section style={{ margin: '20px 0' }}>
        <h2>Busy (blocked) ({busy.length})</h2>
        {busy.length === 0 && <p>No busy dates this month.</p>}
        <ul>
          {busy.map(d => (
            <li key={d} style={{ margin: '8px 0' }}>
              {d}
              <button onClick={() => decide(d, 'unblock')} style={{ marginLeft: 8 }}>Unblock</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


