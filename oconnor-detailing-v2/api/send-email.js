const nodemailer = require('nodemailer');
const redis = require('./_redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST' });

  try {
    const { name, email, phone, dates, make, model, year, inquiry } = req.body || {};
    if (!name || !email || !phone || !dates || !make || !model || !year) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ---- conflict check + mark pending BEFORE email send ----
    const month = dates.slice(0, 7);
    const [pending, booked] = await Promise.all([
      redis.smembers(`pending:${month}`),
      redis.smembers(`booked:${month}`)
    ]);

    if ((pending || []).includes(dates) || (booked || []).includes(dates)) {
      return res.status(409).json({ message: 'Date already pending or booked.' });
    }

    await redis.sadd(`pending:${month}`, dates);

    // ---- send email ----
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Detailing Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Detailing Inquiry from ${name}`,
      html: `
        <h2>New Car Detailing Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date(s):</strong> ${dates}</p>
        <p><strong>Vehicle:</strong> ${year} ${make} ${model}</p>
        ${inquiry ? `<p><strong>Additional Notes:</strong><br/>${inquiry}</p>` : ''}
      `,
    });

    return res.status(200).json({ ok: true, pendingDate: dates });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ message: 'Failed to send email' });
  }
};


