/* ===== Claude Theme JS ===== */

(function() {
  'use strict';

  // ===== Dark Mode Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const STORAGE_KEY = 'claude-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'none' : '';
      moonIcon.style.display = theme === 'dark' ? '' : 'none';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const current = html.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  setTheme(getPreferredTheme());

  // ===== Scroll-Triggered Reveal (Intersection Observer) =====
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(item => observer.observe(item));
  }

  // ===== Parallax Hero on Scroll =====
  function initHeroParallax() {
    const hero = document.getElementById('hero');
    const heroContent = hero?.querySelector('.hero__content');
    const heroIllus = hero?.querySelector('.hero__illustration');

    if (!hero) return;

    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(scrolled / heroHeight, 0.35);

      if (heroContent) {
        heroContent.style.transform = `translateY(${progress * 40}px)`;
        heroContent.style.opacity = 1 - progress * 1.8;
      }
      if (heroIllus) {
        heroIllus.style.transform = `translateY(${progress * 30}px)`;
        heroIllus.style.opacity = 1 - progress * 2;
      }
    }, { passive: true });
  }

  // ===== Navbar Hide/Show on Scroll =====
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
      } else {
        nav.classList.remove('nav--hidden');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ===== Scroll Down Button =====
  function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;

    indicator.addEventListener('click', function() {
      const featured = document.querySelector('.featured');
      if (featured) {
        featured.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===== Mobile Menu Toggle =====
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Touch device detection for parallax =====
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // ===== Image Hover Parallax on Cards (desktop only) =====
  function initCardImageParallax() {
    if (isTouchDevice()) return; // skip parallax on touch devices

    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const img = this.querySelector('.post-card__thumb img');
        if (img) {
          img.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;
        }
      });

      card.addEventListener('mouseleave', function() {
        const img = this.querySelector('.post-card__thumb img');
        if (img) {
          img.style.transform = '';
        }
      });
    });
  }

  // ===== SVG Hand-drawn Illustrations =====
  const COLORS = {
    clay: '#D97757',
    sage: '#8D9A7F',
    stone: '#B0B8A8',
    sand: '#E5E2DB',
    bark: '#6B5B4E',
    charcoal: '#2C2C2C',
  };

  function roughFilter(id) {
    return `
      <defs>
        <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>`;
  }

  const heroIllustration = `
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" class="illustration">
      ${roughFilter('hero-rough')}
      <circle cx="280" cy="110" r="65" fill="${COLORS.clay}" opacity="0.85" filter="url(#hero-rough)"/>
      <path d="M310 60 C330 58 355 75 358 100 C362 128 348 155 335 170 C320 186 298 195 280 200 C268 203 252 205 245 212 C238 219 236 230 230 238" fill="none" stroke="${COLORS.charcoal}" stroke-width="2.2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M210 58 C190 56 165 73 162 98 C158 126 172 153 185 168 C200 184 222 193 240 198 C252 201 268 203 275 210 C282 217 284 228 290 236" fill="none" stroke="${COLORS.charcoal}" stroke-width="2.2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M80 220 C90 215 105 210 120 212 C135 214 148 218 155 225 C162 232 164 245 158 255 C150 268 135 272 120 274 C105 276 88 270 75 262 C60 252 58 237 68 228 Z" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M88 222 C84 208 80 195 82 182" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M104 215 C102 198 100 182 103 168" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M120 212 C120 194 121 176 124 162" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M136 215 C138 198 142 180 148 168" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M148 225 C156 212 165 200 172 190" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M68 250 C55 262 42 278 35 295" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <rect x="48" y="80" width="22" height="22" fill="${COLORS.sage}" opacity="0.7" transform="rotate(-12 48 80)" filter="url(#hero-rough)"/>
      <polygon points="340,200 355,230 325,230" fill="none" stroke="${COLORS.stone}" stroke-width="2" filter="url(#hero-rough)"/>
      <path d="M20 300 Q100 292 180 298 Q260 304 340 296 Q380 292 410 298" fill="none" stroke="${COLORS.stone}" stroke-width="1.5" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M20 308 Q80 302 160 306 Q240 310 320 304 Q370 300 410 306" fill="none" stroke="${COLORS.stone}" stroke-width="1" stroke-linecap="round" opacity="0.5" filter="url(#hero-rough)"/>
    </svg>`;

  const aboutIllustration = `
    <svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" class="illustration">
      ${roughFilter('about-rough')}
      <ellipse cx="180" cy="248" rx="60" ry="20" fill="${COLORS.bark}" opacity="0.3" filter="url(#about-rough)"/>
      <path d="M180 248 L180 120" fill="none" stroke="${COLORS.charcoal}" stroke-width="3" stroke-linecap="round" filter="url(#about-rough)"/>
      <path d="M180 180 C180 180 135 158 112 130 C140 125 170 145 180 172" fill="${COLORS.sage}" opacity="0.8" filter="url(#about-rough)"/>
      <path d="M180 155 C180 155 225 128 248 100 C220 94 192 115 180 148" fill="${COLORS.sage}" opacity="0.8" filter="url(#about-rough)"/>
      <circle cx="180" cy="112" r="22" fill="${COLORS.clay}" opacity="0.8" filter="url(#about-rough)"/>
      <circle cx="180" cy="80" r="8" fill="${COLORS.clay}" opacity="0.5" filter="url(#about-rough)"/>
      <circle cx="260" cy="200" r="14" fill="${COLORS.stone}" opacity="0.5" filter="url(#about-rough)"/>
      <path d="M40 268 Q180 258 320 268" fill="none" stroke="${COLORS.stone}" stroke-width="1.5" stroke-linecap="round" filter="url(#about-rough)"/>
    </svg>`;

  // Render illustrations
  const heroEl = document.getElementById('hero-illustration');
  if (heroEl) heroEl.innerHTML = heroIllustration;

  const aboutEl = document.getElementById('about-illustration');
  if (aboutEl) aboutEl.innerHTML = aboutIllustration;

  // ===== Init All =====
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initHeroParallax();
    initNavScroll();
    initScrollIndicator();
    initMobileMenu();
    initCardImageParallax();
  });

})();
