/* ═══════════════════════════════════════════
   USXR Store — Conexión con Supabase
   via proxy Vercel (/api/sheets)
═══════════════════════════════════════════ */

const API_URL = '/api/sheets';
const CACHE_KEY = 'vs_data';
const CACHE_TTL = 30 * 1000; // 30 segundos

async function cargarDatos() {
  // 1. Intentar desde localStorage primero (instantáneo)
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        // Datos frescos — usar y actualizar en segundo plano
        fetchYGuardar(); // actualiza silenciosamente
        return data;
      }
    }
  } catch(e) {}

  // 2. Si no hay caché, esperar la respuesta
  return await fetchYGuardar();
}

async function fetchYGuardar() {
  try {
    const res  = await fetch(API_URL);
    const data = await res.json();
    // Guardar en localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
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
    ? `<img src="${p.imagen_url}" alt="${p.nombre}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">`
    : `<div style="width:72px;height:72px;border-radius:14px;background:${accentColor};display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:white;">${p.nombre.charAt(0)}</div>`;

  const stockBadge = p.stock === 'agotado'
    ? `<span style="position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#ef4444;letter-spacing:.05em;">AGOTADO</span>`
    : '';

  const buyBtn = p.stock === 'agotado'
    ? `<span class="pcard-buy" style="opacity:.4;cursor:not-allowed;background:#374151;">Sin stock</span>`
    : `<a href="/api/comprar?msg=${encodeURIComponent((p.mensaje_wsp || '').replace(/\\n/g, '\n'))}" target="_blank" rel="noopener" onclick="window.open(this.href,'_blank');return false;" class="pcard-buy">Comprar</a>`;

  return `
    <div class="pcard${p.stock === 'agotado' ? ' agotado' : ''}">
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

// ── Genera N skeleton cards ──
function renderSkeletons(n) {
  return Array.from({ length: n }, () => `
    <div class="skel-card">
      <div class="skel-img skeleton"></div>
      <div class="skel-body">
        <div class="skel-title skeleton"></div>
        <div class="skel-type skeleton"></div>
        <div class="skel-desc skeleton"></div>
        <div class="skel-desc2 skeleton"></div>
        <div class="skel-foot">
          <div class="skel-price skeleton"></div>
          <div class="skel-btn skeleton"></div>
        </div>
      </div>
    </div>`).join('');
}
