const crypto = require('crypto');

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Documents the portals are allowed to read and write.
const DOCS = ['directory', 'academics', 'community', 'vault', 'support', 'newsletter', 'keys'];

async function cmd(args) {
  if (!REST_URL || !REST_TOKEN) throw new Error('Database is not configured. Add the Upstash Redis variables.');
  const r = await fetch(REST_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REST_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

async function getDoc(name) {
  const v = await cmd(['GET', 'eikon:' + name]);
  return v ? JSON.parse(v) : null;
}

async function setDoc(name, value) {
  await cmd(['SET', 'eikon:' + name, JSON.stringify(value)]);
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

module.exports = { cmd, getDoc, setDoc, sha256, crypto, DOCS };
