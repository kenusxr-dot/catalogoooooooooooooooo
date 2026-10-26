// Proxy grupo WhatsApp
export default async function handler(req, res) {
  const GRUPO = 'https://chat.whatsapp.com/CrO1ARxcajq7d5xikAQT80?s=cl&p=a&mlu=4&ilr=4';
  res.setHeader('X-Frame-Options', 'DENY');
  return res.redirect(302, GRUPO);
}
