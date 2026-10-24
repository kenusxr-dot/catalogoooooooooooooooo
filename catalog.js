/* ═══════════════════════════════════════════
   VaultStore — Lógica de catálogo
═══════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Animar cards al cargar (entrada escalonada) ──
  const cards = document.querySelectorAll('.pcard');
  cards.forEach((card, i) => {
    card.style.animation = `cardIn .5s ${i * 0.06}s ease both`;
  });

  // ── Navbar: efecto al hacer scroll ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 30
        ? 'rgba(6,8,15,0.97)'
        : 'rgba(6,8,15,0.88)';
    });
  }

  // ── Intersection Observer para re-animar cards que entran en vista ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });

  cards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .45s ease, transform .45s ease`;
    observer.observe(el);
  });
})();
