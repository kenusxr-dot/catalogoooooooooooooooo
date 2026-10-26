/* ═══════════════════════════════════════════
   USXR Store — Lógica de catálogo
═══════════════════════════════════════════ */

// ── Navbar: efecto al hacer scroll ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 30
      ? 'rgba(6,8,15,0.97)'
      : 'rgba(6,8,15,0.88)';
  });
}

// ── FAQ accordion ──
document.addEventListener('click', e => {
  const btn = e.target.closest('.faq-q');
  if (!btn) return;
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
});

// ── Limpiar .html de la URL sin recargar ──
(function cleanUrl() {
  const map = {
    '/streaming.html':  '/streaming',
    '/gaming.html':     '/recargas',
    '/multi.html':      '/multiservicios',
    '/index.html':      '/'
  };
  const clean = map[window.location.pathname];
  if (clean) window.history.replaceState(null, '', clean);
})();
