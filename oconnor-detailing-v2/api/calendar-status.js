// api/calendar-status.js
const redis = require('./_redis');

module.exports = async (req, res) => {
  try {
    let month =
      (req.query && req.query.month) ||
      (() => {
        try {
          const url = new URL(req.url, 'http://local');
          return url.searchParams.get('month');
        } catch {
          return '';
        }
      })() ||
      '';

    month = String(month).slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'month=YYYY-MM required' });
    }

    const [pendingRaw, bookedRaw, busyRaw] = await Promise.all([
      redis.smembers(`pending:${month}`),
      redis.smembers(`booked:${month}`),
      redis.smembers(`busy:${month}`),
    ]);

    const pendingArr = Array.isArray(pendingRaw) ? pendingRaw : [];
    const bookedArr  = Array.isArray(bookedRaw)  ? bookedRaw  : [];
    const busyArr    = Array.isArray(busyRaw)    ? busyRaw    : [];

    // remove booked/busy from pending
    const denySet = new Set([...bookedArr, ...busyArr]);
    const pending = pendingArr.filter(d => !denySet.has(d)).sort();
    const booked  = [...bookedArr].sort();
    const busy    = [...busyArr].sort();

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      month,
      pending,
      booked,
      busy,
      counts: { pending: pending.length, booked: booked.length, busy: busy.length },
    });
  } catch (err) {
    console.error('calendar-status error:', err);
    return res.status(500).json({ message: 'server error' });
  }
};




