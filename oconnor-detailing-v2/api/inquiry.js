// api/inquiry.js
const redis = require('./_redis');

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST' });

  try {
    const { date } = req.body || {};
    if (!date || typeof date !== 'string' || !ISO_DAY.test(date)) {
      return res.status(400).json({ message: 'date (YYYY-MM-DD) is required' });
    }

    // Normalize to avoid accidental timezone shifts
    const d = new Date(date + 'T00:00:00Z');
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    const normalized = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const month = normalized.slice(0, 7);            // YYYY-MM

    // Add to a per-month set; SADD returns 1 if added, 0 if it already existed
    const added = await redis.sadd(`pending:${month}`, normalized);

    return res.status(200).json({
      ok: true,
      date: normalized,
      month,
      newlyAdded: added === 1
    });
  } catch (err) {
    console.error('inquiry error:', err);
    // If request body wasn’t parsed, let the caller know clearly:
    return res.status(500).json({ message: 'server error' });
  }
};
