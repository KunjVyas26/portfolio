/* ============================================================
   KUNJ VYAS — PORTFOLIO · script.js
   Behaviours:
   1. Nav: scroll-aware (hide/show + scrolled state)
   2. Mobile menu toggle
   3. Smooth scroll for nav links
   4. Scroll reveal (IntersectionObserver)
   5. Hero metric count-up
   6. Card click → project section or external link
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. NAV SCROLL BEHAVIOUR ──────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;

    if (y > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (y > lastScrollY && y > 100) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load
  updateNav();


  /* ── 2. MOBILE MENU ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close on link click
  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
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


  /* ── 3. SMOOTH SCROLL ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // nav height + buffer
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ── 5. COUNT-UP ANIMATION ────────────────────────────────── */
  const countEls = document.querySelectorAll('.proof-num[data-count]');
  let countedUp = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const prefix   = el.getAttribute('data-prefix') || '';
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 700; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function tryCountUp() {
    if (countedUp) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    // Start count-up when proof bar is approaching view
    if (rect.bottom < window.innerHeight + 200) {
      countedUp = true;
      // Stagger each number
      countEls.forEach(function (el, i) {
        setTimeout(function () { animateCount(el); }, i * 80);
      });
    }
  }

  window.addEventListener('scroll', tryCountUp, { passive: true });
  // Run once immediately in case hero is already in view
  setTimeout(tryCountUp, 800);


  /* ── 6. CARD CLICK ────────────────────────────────────────── */
  document.querySelectorAll('.card[data-href]').forEach(function (card) {
    card.addEventListener('click', function () {
      const href = card.getAttribute('data-href');
      if (!href) return;

      if (href.startsWith('#')) {
        // Internal — smooth scroll to section if it exists
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      } else {
        window.open(href, '_blank', 'noopener');
      }
    });

    // Keyboard accessibility
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });


  /* ── 7. ACTIVE NAV LINK (SCROLL SPY) ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 80) current = section.getAttribute('id');
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.style.opacity = (current === href) ? '1' : '';
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

})();
