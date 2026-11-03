const { cmd, getDoc, setDoc, sha256, crypto } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const { email, code, password, portal } = req.body || {};
    const e = String(email || '').trim().toLowerCase();
    if (!/^\d{6}$/.test(String(code || ''))) return res.status(400).json({ error: 'Enter the 6-digit code from your email.' });
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const raw = await cmd(['GET', 'eikon:reset:' + e]);
    if (!raw) return res.status(400).json({ error: 'That code has expired or was never requested. Ask for a new one.' });
    const rec = JSON.parse(raw);
    if (rec.tries >= 5) {
      await cmd(['DEL', 'eikon:reset:' + e]);
      return res.status(429).json({ error: 'Too many wrong attempts. Ask for a new code.' });
    }

    const given = Buffer.from(sha256(String(code) + ':' + e + ':' + (process.env.RESET_SECRET || '')));
    const wanted = Buffer.from(rec.h);
    if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
      rec.tries += 1;
      await cmd(['SET', 'eikon:reset:' + e, JSON.stringify(rec), 'KEEPTTL']);
      return res.status(400).json({ error: 'That code is not correct.' });
    }

    const dir = (await getDoc('directory')) || { users: [] };
    const user = dir.users.find((u) => (u.email || '').toLowerCase() === e && (portal === 'staff' ? u.role !== 'student' : u.role === 'student'));
    if (!user) return res.status(400).json({ error: 'Account not found.' });
    user.pwHash = sha256(password);
    await setDoc('directory', dir);
    await cmd(['DEL', 'eikon:reset:' + e]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not reset the password right now. Try again later.' });
  }
};
