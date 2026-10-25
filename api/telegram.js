// Proxy seguro de Telegram
const TG = process.env.TG_USER;
const ALLOWED_ORIGINS = ['https://www.usxrdata.store', 'https://usxrdata.store', 'https://usxrstore-eight.vercel.app'];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const origin = req.headers.referer || req.headers.origin || '';
  const valid = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  if (!valid) return res.status(403).end();

  if (!TG) return res.status(500).end();

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');

  return res.redirect(302, `https://t.me/${TG}`);
}
