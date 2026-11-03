const { getDoc, setDoc, DOCS } = require('./_lib');

const MAX_BYTES = 900 * 1024;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const out = {};
      await Promise.all(DOCS.map(async (name) => {
        const v = await getDoc(name);
        if (v) out[name] = v;
      }));
      return res.status(200).json(out);
    }
    if (req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!DOCS.includes(key)) return res.status(400).json({ error: 'Unknown document.' });
      if (!value || typeof value !== 'object' || Array.isArray(value)) return res.status(400).json({ error: 'Invalid data.' });
      if (Buffer.byteLength(JSON.stringify(value)) > MAX_BYTES) return res.status(413).json({ error: 'Data is too large.' });
      await setDoc(key, value);
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
