// Proxy Supabase — reemplaza Google Sheets
const SUPABASE_URL = 'https://zlkrcrgenppavmqhnxuh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4kXgQK2SUxKmBoQZGoKlhQ_KXTW8HNa';

export default async function handler(req, res) {
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

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con Supabase', detail: err.message });
  }
}
