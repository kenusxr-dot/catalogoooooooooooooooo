// Proxy Supabase
const SUPABASE_URL = 'https://zlkrcrgenppavmqhnxuh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4kXgQK2SUxKmBoQZGoKlhQ_KXTW8HNa';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };

    const [config, landing, streaming, recargas, multi] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/config?select=*`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/landing?select=*&order=id`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/streaming?select=*&order=id`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/recargas?select=*&order=id`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/multi?select=*&order=id`, { headers }).then(r => r.json()),
    ]);

    return res.status(200).json({
      CONFIG: config,
      LANDING: landing,
      STREAMING: streaming,
      RECARGAS: recargas,
      MULTI: multi
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
