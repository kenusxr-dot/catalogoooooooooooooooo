// Proxy grupo WhatsApp
export default async function handler(req, res) {
  const GRUPO = process.env.WSP_GRUPO || 'https://chat.whatsapp.com/J8JnifOMv5BLtHbVKzGTmH';
  res.setHeader('X-Frame-Options', 'DENY');
  return res.redirect(302, GRUPO);
}
