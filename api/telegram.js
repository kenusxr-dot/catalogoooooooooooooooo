// Proxy Telegram
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('X-Frame-Options', 'DENY');
  return res.redirect(302, 'https://t.me/usxrdata');
}
