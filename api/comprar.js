// Proxy seguro de compra
const WSP = process.env.WSP_NUMBER || '51922055086';
const ALLOWED_ORIGINS = ['https://www.usxrdata.store', 'https://usxrdata.store', 'https://usxrstore-eight.vercel.app'];

export default async function handler(req, res) {
  // 1. Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Verificar origen
  const origin = req.headers.referer || req.headers.origin || '';
  const validOrigin = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  if (!validOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 3. Sanitizar mensaje — quitar caracteres peligrosos
  const raw = (req.query.msg || '').slice(0, 500); // máx 500 chars
  const msg = raw.replace(/<[^>]*>/g, '').replace(/[<>"'`;]/g, '');

  // 4. Número desde env (nunca en código)
  if (!WSP) return res.status(500).json({ error: 'Config error' });

  // 5. Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');

  const url = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  return res.redirect(302, url);
}
