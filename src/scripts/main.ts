/* ==========================================================================
   Kudos — core interactions (no dependencies, ships on first paint)
   Heavier motion (GSAP + ScrollTrigger + Lenis) is lazy-loaded on idle.
   ========================================================================== */
import { initLightbox } from './lightbox';
import { initForm } from './form';

const root = document.documentElement;
const RM = root.classList.contains('rm');
const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

/* ---------- 2/3/4/7/14 · reveal system (rules draw, modules snap, apertures open) ---------- */
function scramble(el: HTMLElement) {
  const text = el.dataset.text || el.textContent || '';
  const vis = el.querySelector<HTMLElement>('[data-scr]');
  if (!vis || RM) return;
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const dur = 450;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const solved = Math.floor(p * text.length);
    let out = text.slice(0, solved);
    for (let i = solved; i < text.length; i++) {
      out += /\s|·|&|,/.test(text[i]) ? text[i] : glyphs[(Math.random() * glyphs.length) | 0];
    }
    vis.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function prepScramble() {
  $$<HTMLElement>('[data-scramble]').forEach((el) => {
    const text = (el.textContent || '').trim();
    el.dataset.text = text;
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;
    const vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    vis.dataset.scr = '';
    vis.textContent = text;
    el.append(sr, vis);
  });
}

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count || 0);
  if (RM || to === 0) { el.textContent = String(to); return; }
  const t0 = performance.now();
  const dur = 900;
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = '0';
  requestAnimationFrame(tick);
}

function initReveals() {
  const targets = $$<HTMLElement>('[data-reveal], [data-scramble], [data-count], [data-section]');
  if (!('IntersectionObserver' in window)) { targets.forEach((t) => t.classList.add('is-in')); return; }

  const io = new IntersectionObserver((entries) => {
    const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    let snapIdx = 0;
    for (const el of entering) {
      io.unobserve(el);
      if (el.dataset.reveal === 'snap') {
        // stagger 70ms along the grid, never more than 5 at once
        el.style.setProperty('--d', `${Math.min(snapIdx++, 4) * 70}ms`);
      }
      el.classList.add('is-in');
      if (el.hasAttribute('data-scramble')) scramble(el);
      if (el.hasAttribute('data-count')) countUp(el);
    }
  }, { rootMargin: '0px 0px -15% 0px', threshold: 0 }); // fires at 85% viewport

  targets.forEach((t) => io.observe(t));

  // the espresso band opens a little later, once it is properly on screen
  const band = $('.band');
  if (band) {
    io.unobserve(band);
    const bio = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { band.classList.add('is-in'); bio.disconnect(); }
    }, { rootMargin: '0px 0px -30% 0px' });
    bio.observe(band);
  }
}

/* ---------- 15 · header compress + progress bar ---------- */
function initScrollChrome() {
  const hdr = $('[data-hdr]');
  const bar = $('.progress__bar');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    hdr?.classList.toggle('is-compact', y > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar?.style.setProperty('--p', String(max > 0 ? y / max : 0));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- 5 · left-rail index ---------- */
function initRail() {
  const rail = $('[data-rail]');
  const marker = $('.rail__marker');
  const links = $$<HTMLAnchorElement>('[data-rail-link]');
  const navLinks = $$<HTMLAnchorElement>('.hdr__nav a');
  const setActive = (id: string, dark: boolean) => {
    links.forEach((l) => {
      const on = l.dataset.railLink === id;
      l.classList.toggle('is-active', on);
      if (on) { l.setAttribute('aria-current', 'true'); marker?.style.setProperty('--y', `${l.offsetTop}px`); }
      else l.removeAttribute('aria-current');
    });
    navLinks.forEach((l) => l.toggleAttribute('aria-current', l.hash === `#${id}`));
    rail?.classList.toggle('on-dark', dark);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement;
        setActive(el.id, el.hasAttribute('data-dark'));
      }
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  $$('[data-section]').forEach((s) => io.observe(s));
  setActive('top', false);
}

/* ---------- mobile drawer ---------- */
function initDrawer() {
  const btn = $<HTMLButtonElement>('[data-menu]');
  const drawer = $('#drawer');
  if (!btn || !drawer) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.visually-hidden')!.textContent = open ? 'Close menu' : 'Open menu';
    drawer.hidden = !open;
    root.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector<HTMLElement>('a')?.focus();
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { set(false); btn.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && set(false));
}

/* ---------- 8 · pillar accordion ---------- */
function initPillars() {
  const rows = $$('[data-pillar]');
  const figs = $$('[data-pillar-fig]');
  const cap = $('[data-pillar-cap]');
  const btns = rows.map((r) => r.querySelector<HTMLButtonElement>('.pillar__btn')!);
  const activate = (i: number) => {
    rows.forEach((r, j) => {
      r.classList.toggle('is-active', i === j);
      btns[j].setAttribute('aria-expanded', String(i === j));
    });
    figs.forEach((f, j) => {
      f.classList.toggle('is-active', i === j);
      if (i === j) f.removeAttribute('aria-hidden'); else f.setAttribute('aria-hidden', 'true');
    });
    if (cap) cap.textContent = btns[i].querySelector('.pillar__title')?.textContent || '';
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => activate(i));
    b.addEventListener('keydown', (e) => {
      const k = e.key;
      let n = -1;
      if (k === 'ArrowDown') n = (i + 1) % btns.length;
      else if (k === 'ArrowUp') n = (i - 1 + btns.length) % btns.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = btns.length - 1;
      if (n > -1) { e.preventDefault(); btns[n].focus(); }
    });
  });
}

/* ---------- 13 · tilt on mood cards (fine pointers only) ---------- */
function initTilt() {
  if (RM || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('[data-tilt]').forEach((card) => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);   // max ±4deg
        card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ---------- 6 · menu-board ticker (scroll-velocity modulated, flips on scroll-up) ---------- */
function initTicker() {
  const wrap = $('[data-ticker]');
  const track = $('[data-ticker-track]');
  if (!wrap || !track || RM) return;
  let x = 0, dir = 1, boost = 0, lastY = scrollY, last = performance.now(), visible = false, raf = 0;
  const base = 38; // px / s
  // measure once (and on resize) — never read layout inside the frame loop
  let half = track.scrollWidth / 2;
  new ResizeObserver(() => { half = track.scrollWidth / 2; }).observe(track);
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;
    if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
    boost += (Math.min(Math.abs(dy) * 22, 900) - boost) * 0.12;
    x -= (base + boost) * dir * dt;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    if (visible) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); lastY = scrollY; raf = requestAnimationFrame(loop); }
  }).observe(wrap);
}

/* ---------- 10 · contact sheet: drag + inertia on mouse, native swipe on touch ---------- */
function initSheet() {
  const sheet = $('[data-sheet]');
  if (!sheet) return;
  const step = () => Math.max(240, sheet.clientWidth * 0.7);
  const behavior: ScrollBehavior = RM ? 'auto' : 'smooth';
  $('[data-sheet-prev]')?.addEventListener('click', () => sheet.scrollBy({ left: -step(), behavior }));
  $('[data-sheet-next]')?.addEventListener('click', () => sheet.scrollBy({ left: step(), behavior }));

  let down = false, dragged = false, startX = 0, startLeft = 0, v = 0, lastX = 0, lastT = 0, inertia = 0;
  sheet.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cancelAnimationFrame(inertia);
    down = true; dragged = false;
    startX = lastX = e.clientX; startLeft = sheet.scrollLeft; lastT = performance.now(); v = 0;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > 5) { dragged = true; sheet.classList.add('is-dragging'); }
    if (!dragged) return;
    e.preventDefault();
    sheet.scrollLeft = startLeft - dx;
    const now = performance.now();
    v = (e.clientX - lastX) / Math.max(1, now - lastT);
    lastX = e.clientX; lastT = now;
  });
  const end = () => {
    if (!down) return;
    down = false;
    sheet.classList.remove('is-dragging');
    if (!dragged || RM) return;
    let vel = -v * 16; // px per frame
    const glide = () => {
      vel *= 0.94;
      sheet.scrollLeft += vel;
      if (Math.abs(vel) > 0.4) inertia = requestAnimationFrame(glide);
    };
    inertia = requestAnimationFrame(glide);
  };
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);
  // swallow the click that ends a drag
  sheet.addEventListener('click', (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
  sheet.addEventListener('dragstart', (e) => e.preventDefault());
}

/* ---------- open-now status (pine dot) ---------- */
function initStatus() {
  const el = $('[data-status]');
  const txt = $('[data-status-text]');
  if (!el || !txt) return;
  let hours: { days: string[]; opens: string; closes: string }[] = [];
  try { hours = JSON.parse(el.dataset.hours || '[]'); } catch { /* noop */ }
  if (!hours.length) return;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  const day = get('weekday');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const yesterday = days[(days.indexOf(day) + 6) % 7];
  const now = Number(get('hour')) * 60 + Number(get('minute'));
  const m = (s: string) => { const [h, mm] = s.split(':').map(Number); return h * 60 + mm; };
  const fmt = (s: string) => {
    const [h, mm] = s.split(':').map(Number);
    const hh = ((h + 11) % 12) + 1;
    return `${hh}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h < 12 || h === 24 ? 'am' : 'pm'}`;
  };
  const today = hours.find((h) => h.days.includes(day));
  const prev = hours.find((h) => h.days.includes(yesterday));
  // still open from yesterday's past-midnight service?
  if (prev && m(prev.closes) < m(prev.opens) && now < m(prev.closes)) {
    el.classList.add('is-open'); txt.textContent = `Open now · until ${fmt(prev.closes)}`; return;
  }
  if (today) {
    const o = m(today.opens), c = m(today.closes);
    const open = c > o ? now >= o && now < c : now >= o;
    if (open) { el.classList.add('is-open'); txt.textContent = `Open now · until ${fmt(today.closes)}`; return; }
    if (now < o) { txt.textContent = `Opens today at ${fmt(today.opens)}`; return; }
  }
  txt.textContent = 'Closed now · see you tomorrow';
}

/* ---------- boot ---------- */
// critical: reveals + header chrome run immediately
prepScramble();
initReveals();
initScrollChrome();
initDrawer();

// everything else waits for the main thread to settle
const idle = (cb: () => void) =>
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 300);
idle(() => {
  initStatus();
  initRail();
  initTicker();
  initPillars();
  initLightbox();
  initForm();
  initSheet();
  initTilt();
});

// lazy motion layer: Lenis + GSAP ScrollTrigger (story timeline).
// Smooth scroll only matters once someone scrolls, so it loads on first intent —
// keeping the main thread free while the page settles.
let motionLoaded = false;
const intents = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
const loadMotion = () => {
  if (motionLoaded) return;
  motionLoaded = true;
  intents.forEach((t) => removeEventListener(t, loadMotion));
  import('./motion').then((m) => m.initMotion(RM));
};
intents.forEach((t) => addEventListener(t, loadMotion, { passive: true, once: true }));
if (scrollY > 0) loadMotion(); // restored scroll position / deep link
