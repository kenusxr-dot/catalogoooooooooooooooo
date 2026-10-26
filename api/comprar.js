// Proxy de compra
const WSP = '51922055086';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const raw = (req.query.msg || '').slice(0, 500);
  const msg = raw.replace(/<[^>]*>/g, '');

  res.setHeader('X-Frame-Options', 'DENY');
  const url = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  return res.redirect(302, url);
}
