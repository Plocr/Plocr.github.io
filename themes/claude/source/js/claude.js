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

  // Retry Giscus theme sync (iframe loads after initial setTheme)
  (function() {
    var retries = 0;
    var timer = setInterval(function() {
      var frame = document.querySelector('iframe.giscus-frame');
      if (frame || retries > 15) { clearInterval(timer); return; }
      retries++;
      var currentTheme = html.getAttribute('data-theme') || 'light';
      var giscusTheme = currentTheme === 'dark'
        ? 'https://www.plocr.online/css/giscus-dark.css'
        : 'https://www.plocr.online/css/giscus-light.css';
      var f = document.querySelector('iframe.giscus-frame');
      if (f) {
        f.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          'https://giscus.app'
        );
      }
    }, 300);
  })();

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

  // ===== Dropdown Click Toggle =====
  function initDropdownClick() {
    const triggers = document.querySelectorAll('.nav__dropdown-trigger');
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    if (!triggers.length) return;

    triggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        // Close other dropdowns
        dropdowns.forEach(function(d, j) {
          if (j !== i) d.classList.remove('open');
        });
        dropdowns[i].classList.toggle('open');
      });
    });

    // Close on click outside any dropdown
    document.addEventListener('click', function(e) {
      var clickedInside = false;
      dropdowns.forEach(function(d) {
        if (d.contains(e.target)) clickedInside = true;
      });
      if (!clickedInside) {
        dropdowns.forEach(function(d) { d.classList.remove('open'); });
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
    <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" class="illustration">
      ${roughFilter('hero-rough')}
      <!-- Large background circle -->
      <circle cx="320" cy="130" r="80" fill="${COLORS.clay}" opacity="0.75" filter="url(#hero-rough)"/>
      <circle cx="320" cy="130" r="60" fill="${COLORS.clay}" opacity="0.3" filter="url(#hero-rough)"/>
      <!-- Face profiles -->
      <path d="M350 70 C370 68 395 85 398 110 C402 138 388 165 375 180 C360 196 338 205 320 210 C308 213 292 215 285 222 C278 229 276 240 270 248" fill="none" stroke="${COLORS.charcoal}" stroke-width="2.2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M250 68 C230 66 205 83 202 108 C198 136 212 163 225 178 C240 194 262 203 280 208 C292 211 308 213 315 220 C322 227 324 238 330 246" fill="none" stroke="${COLORS.charcoal}" stroke-width="2.2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <!-- Reaching hand -->
      <path d="M100 240 C110 235 125 230 140 232 C155 234 168 238 175 245 C182 252 184 265 178 275 C170 288 155 292 140 294 C125 296 108 290 95 282 C80 272 78 257 88 248 Z" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M108 242 C104 228 100 215 102 202" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M124 235 C122 218 120 202 123 188" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M140 232 C140 214 141 196 144 182" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M156 235 C158 218 162 200 168 188" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M168 245 C176 232 185 220 192 210" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M88 270 C75 282 62 298 55 315" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <!-- Small plant on left -->
      <ellipse cx="55" cy="335" rx="20" ry="8" fill="${COLORS.bark}" opacity="0.3" filter="url(#hero-rough)"/>
      <path d="M55 335 L55 290" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M55 320 Q40 310 32 300" fill="none" stroke="${COLORS.sage}" stroke-width="2.5" stroke-linecap="round" filter="url(#hero-rough)"/>
      <circle cx="30" cy="295" r="8" fill="${COLORS.clay}" opacity="0.5" filter="url(#hero-rough)"/>
      <path d="M55 308 Q70 298 80 290" fill="none" stroke="${COLORS.sage}" stroke-width="2.5" stroke-linecap="round" filter="url(#hero-rough)"/>
      <circle cx="82" cy="285" r="6" fill="${COLORS.sage}" opacity="0.5" filter="url(#hero-rough)"/>
      <!-- Floating shapes -->
      <rect x="55" y="80" width="26" height="26" fill="${COLORS.sage}" opacity="0.6" transform="rotate(-15 55 80)" filter="url(#hero-rough)"/>
      <polygon points="390,220 408,255 372,255" fill="none" stroke="${COLORS.stone}" stroke-width="2" filter="url(#hero-rough)"/>
      <circle cx="410" cy="60" r="14" fill="${COLORS.sage}" opacity="0.4" filter="url(#hero-rough)"/>
      <circle cx="440" cy="100" r="8" fill="${COLORS.stone}" opacity="0.4" filter="url(#hero-rough)"/>
      <rect x="430" y="150" width="18" height="18" fill="${COLORS.sage}" opacity="0.3" transform="rotate(25 430 150)" filter="url(#hero-rough)"/>
      <!-- Books/notes floating right -->
      <rect x="370" y="260" width="32" height="24" rx="2" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" filter="url(#hero-rough)"/>
      <path d="M370 268 L402 268" stroke="${COLORS.stone}" stroke-width="1" filter="url(#hero-rough)"/>
      <rect x="380" y="240" width="28" height="20" rx="2" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" filter="url(#hero-rough)"/>
      <path d="M380 248 L408 248" stroke="${COLORS.stone}" stroke-width="1" filter="url(#hero-rough)"/>
      <!-- Wavy ground lines -->
      <path d="M20 340 Q100 332 180 338 Q260 344 340 336 Q380 332 420 338 Q450 340 480 336" fill="none" stroke="${COLORS.stone}" stroke-width="1.5" stroke-linecap="round" filter="url(#hero-rough)"/>
      <path d="M20 348 Q80 342 160 346 Q240 350 320 344 Q370 340 420 346 Q450 348 480 344" fill="none" stroke="${COLORS.stone}" stroke-width="1" stroke-linecap="round" opacity="0.5" filter="url(#hero-rough)"/>
      <!-- Sparkle dots -->
      <circle cx="60" cy="120" r="3" fill="${COLORS.clay}" opacity="0.6" filter="url(#hero-rough)"/>
      <circle cx="160" cy="55" r="4" fill="${COLORS.sage}" opacity="0.5" filter="url(#hero-rough)"/>
      <circle cx="220" cy="230" r="3" fill="${COLORS.clay}" opacity="0.4" filter="url(#hero-rough)"/>
      <circle cx="350" cy="280" r="4" fill="${COLORS.stone}" opacity="0.5" filter="url(#hero-rough)"/>
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
    // 6. Code/monitor
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv6"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><rect x="60" y="30" width="200" height="120" rx="3" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv6)"/><rect x="60" y="30" width="200" height="16" fill="${COLORS.clay}" opacity="0.4" filter="url(#cv6)"/><circle cx="70" cy="38" r="3" fill="${COLORS.charcoal}" filter="url(#cv6)"/><circle cx="82" cy="38" r="3" fill="${COLORS.charcoal}" filter="url(#cv6)"/><circle cx="94" cy="38" r="3" fill="${COLORS.charcoal}" filter="url(#cv6)"/><path d="M80 70 L110 90 L80 110" fill="none" stroke="${COLORS.sage}" stroke-width="2" stroke-linecap="round" filter="url(#cv6)"/><path d="M240 70 L210 90 L240 110" fill="none" stroke="${COLORS.sage}" stroke-width="2" stroke-linecap="round" filter="url(#cv6)"/><line x1="130" y1="95" x2="190" y2="65" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv6)"/></svg>`,
    // 7. Compass/explore
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv7"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><circle cx="160" cy="80" r="50" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv7)"/><circle cx="160" cy="80" r="42" fill="none" stroke="${COLORS.stone}" stroke-width="0.8" stroke-dasharray="4 4" filter="url(#cv7)"/><polygon points="160,40 170,75 200,80 170,85 160,120 150,85 120,80 150,75" fill="${COLORS.clay}" opacity="0.7" filter="url(#cv7)"/><circle cx="160" cy="80" r="6" fill="${COLORS.charcoal}" filter="url(#cv7)"/><path d="M260 140 Q280 120 290 100" fill="none" stroke="${COLORS.sage}" stroke-width="2" stroke-linecap="round" filter="url(#cv7)"/><circle cx="290" cy="95" r="5" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv7)"/></svg>`,
    // 8. Paint/palette
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv8"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><ellipse cx="150" cy="85" rx="70" ry="55" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv8)"/><circle cx="110" cy="65" r="18" fill="${COLORS.clay}" opacity="0.7" filter="url(#cv8)"/><circle cx="180" cy="55" r="14" fill="${COLORS.sage}" opacity="0.6" filter="url(#cv8)"/><circle cx="200" cy="95" r="16" fill="${COLORS.stone}" opacity="0.6" filter="url(#cv8)"/><circle cx="100" cy="105" r="12" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv8)"/><path d="M60 160 L90 130 L120 160" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" stroke-linecap="round" filter="url(#cv8)"/><path d="M120 160 L90 145 L60 160" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" stroke-linecap="round" filter="url(#cv8)"/></svg>`,
    // 9. Camera/photography
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv9"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><rect x="80" y="55" width="160" height="95" rx="6" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv9)"/><circle cx="160" cy="102" r="28" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.8" filter="url(#cv9)"/><circle cx="160" cy="102" r="16" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv9)"/><rect x="100" y="45" width="50" height="8" rx="2" fill="${COLORS.charcoal}" opacity="0.4" filter="url(#cv9)"/><circle cx="220" cy="70" r="8" fill="${COLORS.sage}" opacity="0.5" filter="url(#cv9)"/><path d="M30 140 Q80 130 130 138" fill="none" stroke="${COLORS.stone}" stroke-width="1.2" filter="url(#cv9)"/></svg>`,
    // 10. Music/headphones
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv10"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><circle cx="160" cy="75" r="40" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv10)"/><path d="M120 75 L120 110 A8 8 0 00128 118 L135 118 A8 8 0 00143 110 L143 75" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv10)"/><path d="M195 75 L195 110 A8 8 0 00203 118 L210 118 A8 8 0 00218 110 L218 75" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv10)"/><line x1="120" y1="130" x2="120" y2="140" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><line x1="128" y1="135" x2="128" y2="145" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><line x1="136" y1="130" x2="136" y2="140" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><line x1="195" y1="130" x2="195" y2="140" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><line x1="203" y1="135" x2="203" y2="145" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><line x1="211" y1="130" x2="211" y2="140" stroke="${COLORS.stone}" stroke-width="1.5" filter="url(#cv10)"/><circle cx="260" cy="45" r="12" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv10)"/></svg>`,
    // 11. Globe/world
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv11"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><circle cx="160" cy="90" r="50" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv11)"/><path d="M110 90 Q140 70 160 90 Q180 110 210 90" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" filter="url(#cv11)"/><path d="M110 90 Q140 110 160 90 Q180 70 210 90" fill="none" stroke="${COLORS.charcoal}" stroke-width="1.5" filter="url(#cv11)"/><line x1="160" y1="40" x2="160" y2="140" stroke="${COLORS.charcoal}" stroke-width="1.2" stroke-dasharray="3 3" filter="url(#cv11)"/><line x1="120" y1="55" x2="200" y2="55" stroke="${COLORS.stone}" stroke-width="1" stroke-dasharray="2 3" filter="url(#cv11)"/><line x1="115" y1="75" x2="205" y2="75" stroke="${COLORS.stone}" stroke-width="1" stroke-dasharray="2 3" filter="url(#cv11)"/><line x1="115" y1="105" x2="205" y2="105" stroke="${COLORS.stone}" stroke-width="1" stroke-dasharray="2 3" filter="url(#cv11)"/><line x1="120" y1="125" x2="200" y2="125" stroke="${COLORS.stone}" stroke-width="1" stroke-dasharray="2 3" filter="url(#cv11)"/><circle cx="240" cy="50" r="16" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv11)"/></svg>`,
    // 12. Lightbulb/idea
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><defs><filter id="cv12"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="320" height="180" fill="${COLORS.sand}"/><ellipse cx="160" cy="75" rx="32" ry="38" fill="none" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv12)"/><path d="M145 108 L175 108" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv12)"/><path d="M150 115 L170 115" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv12)"/><path d="M155 122 L165 122" stroke="${COLORS.charcoal}" stroke-width="2" filter="url(#cv12)"/><polygon points="155,125 165,125 162,140 158,140" fill="${COLORS.charcoal}" opacity="0.4" filter="url(#cv12)"/><circle cx="230" cy="40" r="20" fill="${COLORS.clay}" opacity="0.5" filter="url(#cv12)"/><path d="M100 145 Q130 138 160 142 Q190 146 220 140" fill="none" stroke="${COLORS.stone}" stroke-width="1.2" filter="url(#cv12)"/><circle cx="100" cy="50" r="6" fill="${COLORS.sage}" opacity="0.5" filter="url(#cv12)"/></svg>`,
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
    // Sync Giscus theme
    var giscusTheme = theme === 'dark'
      ? 'https://www.plocr.online/css/giscus-dark.css'
      : 'https://www.plocr.online/css/giscus-light.css';
    var giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  };

  // ===== Fill default cover placeholders =====
  function initDefaultCovers() {
    const placeholders = document.querySelectorAll('.post-card__cover-placeholder');
    placeholders.forEach(function(el) {
      const title = el.getAttribute('data-title') || '';
      const index = parseInt(el.getAttribute('data-index') || '0', 10);
      const svg = getCoverForPost(title, index);
      el.innerHTML = svg;
      // If it's hidden (image fallback mode), keep hidden until onerror triggers
      if (el.style.display === 'none') {
        // It will be shown by the onerror handler on the img
      }
    });
  }

  // Also handle onerror for first-image covers in article detail
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.post-article__body img').forEach(function(img) {
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    });
  });

  // ===== Back to Top =====
  function initBackTop() {
    var btn = document.getElementById('backTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Cursor Glow =====
  function initCursorGlow() {
    var glow = document.querySelector('.cursor-glow');
    if (!glow || isTouchDevice()) return;

    var mouseX = 0, mouseY = 0;
    var currentX = 0, currentY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    // Show/hide on window enter/leave
    document.addEventListener('mouseenter', function() { glow.style.opacity = '1'; });
    document.addEventListener('mouseleave', function() { glow.style.opacity = '0'; });
  }

  // ===== Archive Category Switching =====
  function initArchiveCategories() {
    var cards = document.querySelectorAll('.archive-card');
    var timeline = document.getElementById('archive-timeline-view');
    var title = document.getElementById('archive-view-title');
    var subtitle = document.getElementById('archive-view-subtitle');
    if (!cards.length || !timeline) return;

    function showTimeline() {
      cards.forEach(function(c) { c.classList.remove('active'); });
      var tb = document.querySelector('.archive-card[data-category="timeline"]');
      if (tb) tb.classList.add('active');
      document.querySelectorAll('.archive-category-view').forEach(function(v) { v.style.display = 'none'; });
      timeline.style.display = 'block';
      if (title) title.textContent = '时间轴';
      var total = document.querySelectorAll('.timeline-item').length;
      if (subtitle) subtitle.textContent = '共 ' + total + ' 篇文章';
      if (window.location.hash !== '#时间轴') {
        history.replaceState(null, '', '/archives/#时间轴');
      }

      // Mobile: scroll down to show content
      if (window.innerWidth < 768 && timeline) {
        setTimeout(function() {
          timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    function showCategory(cat) {
      cards.forEach(function(c) { c.classList.remove('active'); });
      document.querySelectorAll('.archive-category-view').forEach(function(v) { v.style.display = 'none'; });
      timeline.style.display = 'none';

      var target = document.querySelector('.archive-card[data-category="' + cat + '"]');
      if (target) target.classList.add('active');

      var view = document.getElementById('archive-cat-' + cat);
      if (view) {
        view.style.display = 'block';
        view.querySelectorAll('.archive-article-card').forEach(function(el, i) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(10px)';
          setTimeout(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 60);
        });
      }
      if (title) {
        var t = target ? target.querySelector('.archive-card__title').textContent : cat;
        title.textContent = t;
      }
      if (subtitle) {
        var c = target ? target.querySelector('.archive-card__count').textContent : '0 篇';
        subtitle.textContent = c;
      }

      // Mobile: scroll down to show content
      if (window.innerWidth < 768) {
        var contentEl = document.getElementById('archive-cat-' + cat);
        if (contentEl) {
          setTimeout(function() {
            contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }

    // Card click handlers
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var cat = card.getAttribute('data-category');
        if (cat === 'timeline') { showTimeline(); return; }
        showCategory(cat);
        history.replaceState(null, '', '/archives/#' + cat);
      });
    });

    // Check hash on load
    var hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash === '时间轴') { showTimeline(); return; }
    if (hash) {
      var found = document.querySelector('.archive-card[data-category="' + hash + '"]');
      if (found) { showCategory(hash); return; }
      document.querySelectorAll('.archive-card').forEach(function(c) {
        var t = c.querySelector('.archive-card__title');
        if (t && t.textContent.indexOf(hash) > -1) {
          var cat = c.getAttribute('data-category');
          if (cat && cat !== 'timeline') { showCategory(cat); }
        }
      });
    }

    // Default: 01 项目日志
    showCategory('项目日志');

    // Handle hash changes (e.g. from nav submenu clicks while already on archive page)
    window.addEventListener('hashchange', function() {
      var h = decodeURIComponent(window.location.hash.replace('#', ''));
      if (h === '时间轴') { showTimeline(); }
      else if (h) {
        var f = document.querySelector('.archive-card[data-category="' + h + '"]');
        if (f) showCategory(h);
      }
    });

  }

  // ===== Global nav submenu handler (outside initArchiveCategories for reliability) =====
  function initGlobalNavSubmenu() {
    document.addEventListener('click', function(e) {
      // Check if the click is on a nav submenu link
      var link = e.target.closest('.nav__dropdown-menu a');
      if (!link) return;

      var dd = document.querySelector('.nav__dropdown');
      if (dd) dd.classList.remove('open');

      // Close mobile menu if open
      var mm = document.getElementById('mobileMenu');
      if (mm && mm.classList.contains('open')) {
        mm.classList.remove('open');
        document.body.style.overflow = '';
      }

      // If not on archive page, let normal navigation happen
      if (!document.querySelector('.archive-page')) return;

      // On archive page: intercept and switch view
      e.preventDefault();
      var href = link.getAttribute('href') || '';
      var hash = href.split('#')[1] || '';
      var cat = hash ? decodeURIComponent(hash) : '';

      if (cat === '时间轴') {
        document.querySelectorAll('.archive-card').forEach(function(c) { c.classList.remove('active'); });
        var tb = document.querySelector('.archive-card[data-category="timeline"]');
        if (tb) tb.classList.add('active');
        document.querySelectorAll('.archive-category-view').forEach(function(v) { v.style.display = 'none'; });
        var tv = document.getElementById('archive-timeline-view');
        if (tv) tv.style.display = 'block';
        var titleEl = document.getElementById('archive-view-title');
        if (titleEl) titleEl.textContent = '时间轴';
        var subEl = document.getElementById('archive-view-subtitle');
        var total = document.querySelectorAll('.timeline-item').length;
        if (subEl) subEl.textContent = '共 ' + total + ' 篇文章';
        history.replaceState(null, '', '/archives/#时间轴');
        return;
      }
      if (!cat) { cat = '项目日志'; }
      // Show category
      document.querySelectorAll('.archive-card').forEach(function(c) { c.classList.remove('active'); });
      var target = document.querySelector('.archive-card[data-category="' + cat + '"]');
      if (target) target.classList.add('active');
      document.querySelectorAll('.archive-category-view').forEach(function(v) { v.style.display = 'none'; });
      var timeline = document.getElementById('archive-timeline-view');
      if (timeline) timeline.style.display = 'none';
      var view = document.getElementById('archive-cat-' + cat);
      if (view) view.style.display = 'block';
      var title = document.getElementById('archive-view-title');
      if (title && target) title.textContent = target.querySelector('.archive-card__title').textContent;
      var sub = document.getElementById('archive-view-subtitle');
      if (sub && target) sub.textContent = target.querySelector('.archive-card__count').textContent;
      history.replaceState(null, '', '/archives/#' + cat);

      // Sync nav submenu active state
      document.querySelectorAll('.nav__dropdown-menu a').forEach(function(a) {
        var h = a.getAttribute('href') || '';
        a.classList.remove('active');
        if (cat && h.indexOf(cat) > -1) a.classList.add('active');
      });
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
    initArchiveCategories();
    initGlobalNavSubmenu();
    initDropdownClick();
    initDefaultCovers();
    initBackTop();
    initCursorGlow();
    initHitokoto();
    initCardImageParallax();
  });

})();
