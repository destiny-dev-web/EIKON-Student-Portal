const { cmd, getDoc, sha256, crypto } = require('./_lib');

const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sendMail(to, name, code) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Eikon Academy <onboarding@resend.dev>',
      to: [to],
      subject: 'Your Eikon Academy password reset code',
      text: `Hello ${name || ''},\n\nYour password reset code is ${code}. It expires in 10 minutes.\n\nIf you did not ask for this, ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e4e4ec;border-radius:12px;overflow:hidden">
        <div style="background:#1F2260;color:#fff;padding:18px 24px;font-size:18px;letter-spacing:2px;font-weight:bold">EIKON<span style="color:#E08A2E">.</span></div>
        <div style="padding:24px;color:#232336"><p>Hello ${esc(name)},</p><p>Your password reset code is:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#1F2260;margin:16px 0">${code}</p>
        <p style="color:#6B6B7B;font-size:13px">It expires in 10 minutes. If you did not ask for this, ignore this email.</p></div></div>`,
    }),
  });
  if (!r.ok) throw new Error('Mail provider error ' + r.status + ' ' + (await r.text()));
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const { email, portal } = req.body || {};
    const e = String(email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return res.status(400).json({ error: 'Enter a valid email address.' });

    // One request per minute per email, whether or not the account exists.
    const locked = await cmd(['GET', 'eikon:resetlock:' + e]);
    if (locked) return res.status(429).json({ error: 'A code was just requested. Wait a minute and try again.' });
    await cmd(['SET', 'eikon:resetlock:' + e, '1', 'EX', '60']);

    const dir = (await getDoc('directory')) || { users: [] };
    const user = dir.users.find((u) => (u.email || '').toLowerCase() === e && (portal === 'staff' ? u.role !== 'student' : u.role === 'student'));
    if (user) {
      const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
      const h = sha256(code + ':' + e + ':' + (process.env.RESET_SECRET || ''));
      await cmd(['SET', 'eikon:reset:' + e, JSON.stringify({ h, tries: 0 }), 'EX', '600']);
      await sendMail(e, user.name, code);
    }
    // Same answer either way, so nobody can use this to find out who is registered.
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not send the code right now. Try again later.' });
  }
};
