// api/decision.js
const redis = require('./_redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST' });

  try {
    const adminKeyHeader = req.headers['x-admin-key'] || '';
    const adminKeyEnv = (process.env.ADMIN_KEY || process.env.REACT_APP_ADMIN_KEY || '').trim();

    if (!adminKeyEnv || adminKeyHeader !== adminKeyEnv) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { date, action } = req.body || {};
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) required' });
    }
    if (!action) {
      return res.status(400).json({ message: 'action required' });
    }

    const month = date.slice(0, 7);
    const kPending = `pending:${month}`;
    const kBooked  = `booked:${month}`;
    const kBusy    = `busy:${month}`;

    switch (action) {
      case 'approve': {
        // move from pending -> booked; remove from busy if present
        await Promise.all([
          redis.srem(kPending, date),
          redis.sadd(kBooked, date),
          redis.srem(kBusy, date),
        ]);
        break;
      }
      case 'deny': {
        // remove from pending only
        await redis.srem(kPending, date);
        break;
      }
      case 'block': {
        // add to busy; remove from pending and booked
        await Promise.all([
          redis.sadd(kBusy, date),
          redis.srem(kPending, date),
          redis.srem(kBooked, date),
        ]);
        break;
      }
      case 'unblock': {
        // remove from busy
        await redis.srem(kBusy, date);
        break;
      }
      case 'book': {
        // manual booking: add to booked; remove from pending & busy
        await Promise.all([
          redis.sadd(kBooked, date),
          redis.srem(kPending, date),
          redis.srem(kBusy, date),
        ]);
        break;
      }
      case 'unbook': {
        // remove from booked
        await redis.srem(kBooked, date);
        break;
      }
      default:
        return res.status(400).json({ message: `Unknown action: ${action}` });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('decision error:', err);
    return res.status(500).json({ message: 'server error' });
  }
};


