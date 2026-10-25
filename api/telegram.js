// Proxy Telegram — oculta el usuario del HTML
export default async function handler(req, res) {
  const TG = process.env.TG_USER || 'usxrdata';
  res.redirect(302, `https://t.me/${TG}`);
}
