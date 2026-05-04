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
    const closeBtn = document.getElementById('menuClose');
    const overlay = menu?.querySelector('.mobile-menu__overlay');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button (X)
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on link click
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
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

  // ===== Default Post Cover Illustrations =====
  // 5 unique hand-drawn style default covers
  const COVERS = [
    // 1. Mountain/landscape
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv1"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><path d="M0 160 L80 70 L160 130 L240 50 L320 110 L320 180 L0 180Z" fill="${COLORS.sage}" opacity="0.5" filter="url(#cv1)"/><circle cx="240" cy="60" r="14" fill="${COLORS.clay}" opacity="0.6" filter="url(#cv1)"/><circle cx="80" cy="40" r="8" fill="${COLORS.stone}" opacity="0.6" filter="url(#cv1)"/></svg>`,
    // 2. Book/reading
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv2"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><rect x="80" y="40" width="160" height="110" rx="2" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv2)"/><path d="M80 60 L240 60" stroke="${COLORS.charcoal}" stroke-width="1.5" filter="url(#cv2)"/><path d="M100 90 L200 90" stroke="${COLORS.stone}" stroke-width="1.2" filter="url(#cv2)"/><path d="M100 105 L180 105" stroke="${COLORS.stone}" stroke-width="1.2" filter="url(#cv2)"/><circle cx="260" cy="40" r="20" fill="${COLORS.clay}" opacity="0.6" filter="url(#cv2)"/></svg>`,
    // 3. Coffee/pen
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv3"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><rect x="90" y="50" width="70" height="80" rx="4" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv3)"/><ellipse cx="125" cy="110" rx="25" ry="8" fill="${COLORS.bark}" opacity="0.3" filter="url(#cv3)"/><rect x="155" y="80" width="8" height="55" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv3)"/><circle cx="70" cy="60" r="16" fill="${COLORS.stone}" opacity="0.5" filter="url(#cv3)"/><path d="M190 40 L230 140" stroke="${COLORS.charcoal}" stroke-width="1.5" stroke-linecap="round" filter="url(#cv3)"/></svg>`,
    // 4. Plant/nature
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv4"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><ellipse cx="160" cy="140" rx="40" ry="12" fill="${COLORS.bark}" opacity="0.4" filter="url(#cv4)"/><path d="M160 140 L160 60" stroke="${COLORS.charcoal}" stroke-width="2.5" filter="url(#cv4)"/><path d="M160 110 Q130 95 115 80" fill="none" stroke="${COLORS.sage}" stroke-width="3" stroke-linecap="round" filter="url(#cv4)"/><path d="M160 95 Q190 80 205 65" fill="none" stroke="${COLORS.sage}" stroke-width="3" stroke-linecap="round" filter="url(#cv4)"/><circle cx="160" cy="55" r="10" fill="${COLORS.clay}" opacity="0.6" filter="url(#cv4)"/><circle cx="210" cy="50" r="7" fill="${COLORS.stone}" opacity="0.4" filter="url(#cv4)"/></svg>`,
    // 5. Stars/night thought
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv5"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><path d="M0 130 Q80 110 160 120 Q240 130 320 115 L320 180 L0 180Z" fill="${COLORS.stone}" opacity="0.3" filter="url(#cv5)"/><circle cx="80" cy="60" r="6" fill="${COLORS.clay}" opacity="0.7" filter="url(#cv5)"/><circle cx="130" cy="45" r="4" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv5)"/><circle cx="200" cy="55" r="5" fill="${COLORS.clay}" opacity="0.6" filter="url(#cv5)"/><circle cx="240" cy="38" r="3" fill="${COLORS.clay}" opacity="0.4" filter="url(#cv5)"/><path d="M80 60 L130 45 L200 55 L240 38" stroke="${COLORS.charcoal}" stroke-width="0.8" stroke-dasharray="3 3" filter="url(#cv5)"/><circle cx="50" cy="80" r="12" fill="${COLORS.sage}" opacity="0.5" filter="url(#cv5)"/></svg>`,
  ];

  // Pick a deterministic cover based on string hash
  function getCoverForPost(title, index) {
    if (!title) return COVERS[index % COVERS.length];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = ((hash << 5) - hash) + title.charCodeAt(i);
      hash |= 0;
    }
    return COVERS[Math.abs(hash) % COVERS.length];
  }

  window.__claudeCovers = COVERS;
  window.__getCoverForPost = getCoverForPost;

  // ===== Sync mobile theme toggle with main toggle =====
  function initMobileThemeToggle() {
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (!mobileToggle || !themeToggle) return;

    mobileToggle.addEventListener('click', function() {
      themeToggle.click();
    });
  }

  // ===== Update mobile menu theme icons on toggle =====
  function syncMobileThemeIcons(theme) {
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (!mobileToggle) return;

    const sunIcon = mobileToggle.querySelector('.sun-icon');
    const moonIcon = mobileToggle.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'none' : '';
      moonIcon.style.display = theme === 'dark' ? '' : 'none';
    }
  }

  // Override setTheme to sync mobile icons
  const origSetTheme = setTheme;
  setTheme = function(theme) {
    origSetTheme(theme);
    syncMobileThemeIcons(theme);
  };

  // ===== Fill default cover placeholders =====
  function initDefaultCovers() {
    const placeholders = document.querySelectorAll('.post-card__cover-placeholder');
    placeholders.forEach(function(el) {
      const title = el.getAttribute('data-title') || '';
      const index = parseInt(el.getAttribute('data-index') || '0', 10);
      const svg = getCoverForPost(title, index);
      el.innerHTML = svg;
    });
  }

  // ===== Hitokoto Quote =====
  function initHitokoto() {
    const textEl = document.getElementById('hitokoto-text');
    const fromEl = document.getElementById('hitokoto-from');
    if (!textEl) return;

    fetch('https://v1.hitokoto.cn?c=d&c=f&c=i&c=k')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        textEl.textContent = data.hitokoto || '获取失败';
        if (data.from) {
          fromEl.textContent = '—— ' + data.from;
        }
      })
      .catch(function() {
        textEl.textContent = '生活不是缺少美，而是缺少发现美的眼睛。';
        fromEl.textContent = '—— 罗丹';
      });
  }

  // ===== Init All =====
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initHeroParallax();
    initNavScroll();
    initScrollIndicator();
    initMobileMenu();
    initMobileThemeToggle();
    initDefaultCovers();
    initHitokoto();
    initCardImageParallax();
  });

})();
