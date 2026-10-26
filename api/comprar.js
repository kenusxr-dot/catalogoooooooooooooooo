// Proxy de compra — abre WhatsApp app directo en móvil
const WSP = '51922055086';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const raw = (req.query.msg || '').slice(0, 500);
  const msg = raw.replace(/<[^>]*>/g, '');
  const encoded = encodeURIComponent(msg);

  const ua = req.headers['user-agent'] || '';
  const isMobile = /android|iphone|ipad|ipod/i.test(ua);

  res.setHeader('X-Frame-Options', 'DENY');

  if (isMobile) {
    // En móvil: intenta abrir la app directamente
    return res.redirect(302, `https://api.whatsapp.com/send?phone=${WSP}&text=${encoded}`);
  } else {
    // En PC: abre WhatsApp Web
    return res.redirect(302, `https://web.whatsapp.com/send?phone=${WSP}&text=${encoded}`);
  }
}
