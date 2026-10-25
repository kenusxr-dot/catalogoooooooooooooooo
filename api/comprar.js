// Proxy de compra — oculta el número de WhatsApp del HTML
export default async function handler(req, res) {
  const WSP = process.env.WSP_NUMBER || '51922055086';
  const msg = req.query.msg || '';
  const url = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  res.redirect(302, url);
}
