// Proxy seguro de Supabase
const SUPABASE_URL = 'https://zlkrcrgenppavmqhnxuh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_4kXgQK2SUxKmBoQZGoKlhQ_KXTW8HNa';
const ALLOWED_ORIGINS = ['https://www.usxrdata.store', 'https://usxrdata.store', 'https://usxrstore-eight.vercel.app'];

export default async function handler(req, res) {
  // 1. Solo GET
  if (req.method !== 'GET') return res.status(405).end();

  // 2. Rate limit básico — header check
  const ua = req.headers['user-agent'] || '';
  if (!ua || ua.length < 5) return res.status(403).end(); // bloquear bots sin UA

  // 3. Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes(req.headers.origin)
    ? req.headers.origin : ALLOWED_ORIGINS[0]);

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

    const data = { CONFIG: config, LANDING: landing, STREAMING: streaming, RECARGAS: recargas, MULTI: multi };

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
