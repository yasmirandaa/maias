/* ══════════════════════════════════════════════════════
   CIVILIZAÇÃO MAIA — main.js
   Parallax · Scroll Reveal · Calendar SVG · Nav
   ══════════════════════════════════════════════════════ */

'use strict';

/* ── Utility ────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════════════════
   1. SVG CALENDAR — render radials & ticks
   ════════════════════════════════════════════════════ */
function buildCalendar(svgId, radialId, ticksId, segId, cx, cy, r1, r2, r3, r4) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const radialEl  = document.getElementById(radialId);
  const ticksEl   = document.getElementById(ticksId);
  const segEl     = document.getElementById(segId);

  const TAU = Math.PI * 2;
  const toRad = (deg) => (deg * Math.PI) / 180;

  /* ── 20 radial spokes ─ */
  if (radialEl) {
    for (let i = 0; i < 20; i++) {
      const angle = toRad(i * 18);
      const x1 = cx + r1 * Math.cos(angle);
      const y1 = cy + r1 * Math.sin(angle);
      const x2 = cx + r4 * Math.cos(angle);
      const y2 = cy + r4 * Math.sin(angle);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.setAttribute('stroke', '#c9a227');
      line.setAttribute('stroke-width', '0.8');
      line.setAttribute('opacity', '0.25');
      radialEl.appendChild(line);
    }
  }

  /* ── 260 outer tick marks ─ */
  if (ticksEl) {
    const count = 52;
    for (let i = 0; i < count; i++) {
      const angle = toRad(i * (360 / count));
      const outer = r2;
      const inner = r2 - (i % 4 === 0 ? 14 : 7);

      const x1 = cx + outer * Math.cos(angle);
      const y1 = cy + outer * Math.sin(angle);
      const x2 = cx + inner * Math.cos(angle);
      const y2 = cy + inner * Math.sin(angle);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.setAttribute('stroke', i % 4 === 0 ? '#c9a227' : '#4a7c59');
      line.setAttribute('stroke-width', i % 4 === 0 ? '1.5' : '0.8');
      line.setAttribute('opacity', i % 4 === 0 ? '0.6' : '0.3');
      ticksEl.appendChild(line);
    }
  }

  /* ── 20 glyph squares in mid ring ─ */
  if (segEl) {
    for (let i = 0; i < 20; i++) {
      const angle = toRad(i * 18 - 9);
      const rMid = r3;
      const cx2 = cx + rMid * Math.cos(angle);
      const cy2 = cy + rMid * Math.sin(angle);
      const size = 10;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `rotate(${i * 18 + 90}, ${cx2.toFixed(2)}, ${cy2.toFixed(2)})`);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', (cx2 - size / 2).toFixed(2));
      rect.setAttribute('y', (cy2 - size / 2).toFixed(2));
      rect.setAttribute('width', size);
      rect.setAttribute('height', size);
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', '#c9a227');
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('opacity', '0.35');

      const cross = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      cross.setAttribute('x1', (cx2 - size / 2 + 2).toFixed(2));
      cross.setAttribute('y1', cy2.toFixed(2));
      cross.setAttribute('x2', (cx2 + size / 2 - 2).toFixed(2));
      cross.setAttribute('y2', cy2.toFixed(2));
      cross.setAttribute('stroke', '#c9a227');
      cross.setAttribute('stroke-width', '0.8');
      cross.setAttribute('opacity', '0.3');

      g.appendChild(rect);
      g.appendChild(cross);
      segEl.appendChild(g);
    }
  }
}

/* Build both calendars */
document.addEventListener('DOMContentLoaded', () => {
  // Mini hero calendar
  buildCalendar(null, null, 'ticks', null, 200, 200, 180, 190, 165, 55);

  // Featured calendar (bigger)
  buildCalendar(null, 'featuredRadials', 'featuredTicks', 'featuredSegments', 250, 250, 230, 240, 205, 65);
});

/* ════════════════════════════════════════════════════
   2. PARALLAX — hero background on scroll/mouse
   ════════════════════════════════════════════════════ */
(function initParallax() {
  const parallax = document.getElementById('heroParallax');
  const calendar = $('.hero__calendar');
  if (!parallax) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const speed   = 0.35;
        parallax.style.transform = `translateY(${scrollY * speed}px)`;
        if (calendar) {
          calendar.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.18}px))`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Subtle mouse parallax on hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const dx = (clientX / innerWidth  - 0.5) * 20;
      const dy = (clientY / innerHeight - 0.5) * 12;
      parallax.style.transform = `translate(${dx}px, ${dy + window.scrollY * 0.35}px)`;
    });
  }
})();

/* ════════════════════════════════════════════════════
   3. SCROLL REVEAL — IntersectionObserver
   ════════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls    = $$('.reveal');
  const childEls     = $$('.reveal-child');

  const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

  /* Sections */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        sectionObs.unobserve(entry.target);
      }
    });
  }, observerOpts);

  revealEls.forEach((el) => sectionObs.observe(el));

  /* Children — staggered via CSS delay */
  const childObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        childObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  childEls.forEach((el) => childObs.observe(el));
})();

/* ════════════════════════════════════════════════════
   4. TIMELINE — extra stagger on items
   ════════════════════════════════════════════════════ */
(function initTimeline() {
  const items = $$('.timeline__item');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => {
    item.classList.add('reveal-child');
    obs.observe(item);
  });
})();

/* ════════════════════════════════════════════════════
   5. SMOOTH HERO CTA → SCROLL
   ════════════════════════════════════════════════════ */
(function initHeroScroll() {
  const cta = $('.hero__cta');
  if (!cta) return;

  cta.addEventListener('click', (e) => {
    const target = $(cta.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ════════════════════════════════════════════════════
   6. ACTIVE SECTION NAV (footer links)
   ════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.footer__nav a');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--gold)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => obs.observe(s));
})();

/* ════════════════════════════════════════════════════
   7. MAP — hover highlights
   ════════════════════════════════════════════════════ */
(function initMap() {
  const regions = $$('.map-region');
  regions.forEach((region) => {
    region.addEventListener('mouseenter', () => {
      region.style.opacity = '1';
    });
    region.addEventListener('mouseleave', () => {
      region.style.opacity = '';
    });
  });
})();

/* ════════════════════════════════════════════════════
   8. FACT CARDS — hover glow effect
   ════════════════════════════════════════════════════ */
(function initFactCards() {
  const cards = $$('.fact-card, .art-card, .symbol-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();

/* ════════════════════════════════════════════════════
   9. LEGACY TAGS — staggered entrance
   ════════════════════════════════════════════════════ */
(function initLegacyTags() {
  const tags = $$('.legacy-tag');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tags.forEach((tag, i) => {
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 60);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Set initial state
  tags.forEach((tag) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(12px)';
    tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const legacySection = $('#legado');
  if (legacySection) obs.observe(legacySection);
})();

/* ════════════════════════════════════════════════════
   10. CALENDAR — secondary rotation direction (featured)
   ════════════════════════════════════════════════════ */
(function initCalendarInteraction() {
  const featured = $('.featured-calendar-svg');
  if (!featured) return;

  // Slow down on hover
  featured.addEventListener('mouseenter', () => {
    featured.style.animationDuration = '200s';
  });
  featured.addEventListener('mouseleave', () => {
    featured.style.animationDuration = '90s';
  });
})();

/* ════════════════════════════════════════════════════
   11. PAGE LOAD — hero entrance
   ════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// Ensure no FOUC
document.documentElement.style.setProperty('--ready', '1');
