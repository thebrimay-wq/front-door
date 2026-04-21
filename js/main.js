/* ═══════════════════════════════════════════
   FRONT DOOR — SHARED JS
   Minimal, purposeful interactions only.
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── HEADER SCROLL STATE ── */
  const header = document.querySelector('.site-header');
  if (header) {
    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ── SERVICES DROPDOWN ── */
  const navItem   = document.querySelector('.nav-item');
  const trigger   = navItem ? navItem.querySelector(':scope > a') : null;
  const dropdown  = navItem ? navItem.querySelector('.nav-dropdown') : null;

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle  = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  function closeMobileNav() {
    if (primaryNav) primaryNav.classList.remove('open');
    if (navToggle)  navToggle.setAttribute('aria-expanded', 'false');
    if (navItem)    navItem.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Collapse dropdown when closing the drawer
      if (!isOpen && navItem) navItem.classList.remove('open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        primaryNav.classList.contains('open') &&
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });

    // Close nav when a regular nav link is clicked.
    // Exclude the Services trigger (handled below) so tapping it
    // doesn't collapse the drawer before the dropdown can open.
    primaryNav.querySelectorAll('a').forEach(function (link) {
      const isServicesTrigger = trigger && link === trigger;
      if (isServicesTrigger) return;
      link.addEventListener('click', function () {
        closeMobileNav();
      });
    });
  }

  /* Mobile tap: toggle Services dropdown.
     stopPropagation prevents the outside-click handler from immediately
     closing the nav on the same tap that opened the dropdown. */
  if (trigger && navItem) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        navItem.classList.toggle('open');
      }
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a').forEach(function (link) {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── CONTACT FORM (prevent default, show confirmation) ── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn  = contactForm.querySelector('.form-submit');
      const orig = btn ? btn.textContent : '';

      if (btn) {
        btn.textContent = 'Message sent — we\'ll be in touch.';
        btn.disabled    = true;
        btn.style.opacity = '0.7';
      }

      setTimeout(function () {
        if (btn) {
          btn.textContent   = orig;
          btn.disabled      = false;
          btn.style.opacity = '';
        }
        contactForm.reset();
      }, 5000);
    });
  }

})();
