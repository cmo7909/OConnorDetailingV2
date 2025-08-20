// AvailabilityCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './AvailabilityCalendar.css';

const toLocalYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const AvailabilityCalendar = ({ onDateSelect, pendingDates = [] }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const [serverPending, setServerPending] = useState([]);
  const [serverBooked,  setServerBooked]  = useState([]); // approved
  const [serverBusy,    setServerBusy]    = useState([]); // blocked
  const [loading, setLoading] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthStr = useMemo(() => `${year}-${String(month + 1).padStart(2, '0')}`, [year, month]);

  // Precompute today's midnight to compare "past" dates in current month
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/calendar-status?month=${monthStr}`);
        if (!res.ok) throw new Error(`calendar-status ${res.status}`);
        const data = await res.json();

        if (!ignore) {
          setServerPending(data?.pending || []);
          setServerBooked(data?.booked  || []);
          setServerBusy(data?.busy      || []);
        }
      } catch (e) {
        console.error('calendar-status fetch failed', e);
        if (!ignore) {
          setServerPending([]);
          setServerBooked([]);
          setServerBusy([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [monthStr]);

  // Build the grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const dates = [];
  for (let i = 0; i < firstDayIndex; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(new Date(year, month, d));

  // Limit to this month and next month
  const handleMonthChange = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    if (newDate >= minDate && newDate <= maxDate) setViewDate(newDate);
  };

  // Merge optimistic pending from parent with server's pending
  const allPending = useMemo(() => {
    const set = new Set(serverPending);
    (pendingDates || []).forEach((d) => set.add(d));
    return Array.from(set);
  }, [serverPending, pendingDates]);

  return (
    <div className="calendar-container">
      <div className="calendar-header-bar">
        <button onClick={() => handleMonthChange(-1)} disabled={month === today.getMonth()}>&lt;</button>
        <h2>{viewDate.toLocaleString('default', { month: 'long' })} {year}</h2>
        <button onClick={() => handleMonthChange(1)} disabled={month === today.getMonth() + 1}>&gt;</button>
      </div>

      {loading && <div className="calendar-loading" aria-live="polite">Loading dates…</div>}

      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="calendar-header">{d}</div>
        ))}

        {dates.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="calendar-cell empty" />;

          const dateString = toLocalYMD(date);

          const isPast =
            date < todayStart &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          const isPending = allPending.includes(dateString);
          const isBooked  = serverBooked.includes(dateString); // approved (dark gray)
          const isBusy    = serverBusy.includes(dateString);   // blocked (red)

          const state = isPast
            ? 'past'
            : isPending ? 'pending'
            : isBusy    ? 'unavailable'
            : isBooked  ? 'booked'
            : 'available';

          const clickable = state === 'available';

          return (
            <div
              key={dateString}
              className={`calendar-cell ${state}`}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
              onClick={() => clickable && onDateSelect?.(dateString)}
              aria-disabled={!clickable}
              aria-label={`${dateString} ${state}`}
              title={clickable ? 'Request this date' : undefined}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item"><span className="legend-color available" /> Available</div>
        <div className="legend-item"><span className="legend-color pending" /> Inquiry Pending</div>
        <div className="legend-item"><span className="legend-color booked" /> Booked (Approved)</div>
        <div className="legend-item"><span className="legend-color unavailable" /> Busy (Blocked)</div>
        <div className="legend-item"><span className="legend-color past" /> Past Date</div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

