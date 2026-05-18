/* ============================================================
   KUNJ VYAS — CASE STUDY SHARED JS
   case-study.js — used by finlit, banksphere, managesphere
   Behaviours:
   1. Nav hide/show on scroll
   2. Reading progress bar
   3. Mobile menu toggle
   4. Scroll reveal (IntersectionObserver)
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. NAV HIDE / SHOW ───────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    if (y > lastScrollY && y > 80) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });


  /* ── 2. READING PROGRESS BAR ──────────────────────────── */
  const bar = document.getElementById('progressBar');

  function updateProgress() {
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ── 3. MOBILE MENU ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    document.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }


  /* ── 4. SCROLL REVEAL ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
