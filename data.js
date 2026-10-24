/* ═══════════════════════════════════════════
   VaultStore — Conexión con Google Sheets API
═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   VaultStore — Conexión con Google Sheets
   via proxy Vercel (/api/sheets)
═══════════════════════════════════════════ */

const API_URL = '/api/sheets';

async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Error al cargar datos:', e);
    return null;
  }
}

// ── Lee CONFIG como objeto clave→valor ──
function parseConfig(configArray) {
  const cfg = {};
  configArray.forEach(row => {
    if (row.clave) cfg[row.clave] = row.valor;
  });
  return cfg;
}

// ── Genera una product-card ──
function renderCard(p, accentColor, accentColor2, glowColor, chipBg, chipBd, chipTx) {
  if (p.activo !== 'SI') return '';

  const badge = p.badge
    ? `<span class="pcard-badge ${p.badge.includes('Top') || p.badge.includes('Popular') || p.badge.includes('OFERTA') ? 'hot' : ''}">${p.badge}</span>`
    : '';

  const imgContent = p.imagen_url
    ? `<img src="${p.imagen_url}" alt="${p.nombre}" style="width:72px;height:72px;object-fit:contain;border-radius:12px;">`
    : `<div style="width:72px;height:72px;border-radius:14px;background:${accentColor};display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:white;">${p.nombre.charAt(0)}</div>`;

  const stockBadge = p.stock === 'agotado'
    ? `<span style="position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#ef4444;letter-spacing:.05em;">AGOTADO</span>`
    : '';

  const buyBtn = p.stock === 'agotado'
    ? `<span class="pcard-buy" style="opacity:.4;cursor:not-allowed;background:#374151;">Sin stock</span>`
    : `<a href="https://wa.me/${window._cfg?.whatsapp || '5491100000000'}?text=${encodeURIComponent(p.mensaje_wsp)}" target="_blank" class="pcard-buy">Comprar</a>`;

  return `
    <div class="pcard">
      <div class="pcard-img" style="background:linear-gradient(135deg,${accentColor}22,${accentColor2}33);position:relative;">
        ${imgContent}
        ${badge}
        ${stockBadge}
      </div>
      <div class="pcard-body">
        <h3>${p.nombre}</h3>
        <span class="pcard-type" style="background:${chipBg};border-color:${chipBd};color:${chipTx};">${p.tipo}</span>
        <p class="pcard-desc">${p.descripcion}</p>
        <div class="pcard-foot">
          <span class="pcard-price">${p.precio}${p.precio_anterior ? ` <span class="pcard-price-old">${p.precio_anterior}</span>` : ''}</span>
          ${buyBtn}
        </div>
      </div>
    </div>`;
}

// ── Genera sección con título ──
function renderSectionTitle(titulo, count) {
  return `
    <div class="section-title">
      <h2>${titulo}</h2>
      <span>${count} productos</span>
    </div>`;
}
