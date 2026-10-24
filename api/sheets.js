// Proxy serverless — Vercel llama a Google Sheets por detrás
// El navegador llama a /api/sheets sin problemas de CORS

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweWM1TbYu7iQuxwQqbjNhOd-nqs2qbj1w9NKNme00Sfaz6XE3mdrpAzJCLuakWD_DR/exec';

export default async function handler(req, res) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con Google Sheets', detail: err.message });
  }
}
