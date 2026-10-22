// Site-wide behaviour: theme switch, nav state, local clock, rotators, screenshot cycling, tilt and cursor.
// Scroll motion lives in motion.ts and loads on idle. Everything degrades to a static, fully visible page.

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme ---------- */
const KEY = 'lj-theme';
const themeButtons = document.querySelectorAll<HTMLButtonElement>('[data-theme-set]');
function applyTheme(mode: string) {
  if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
  else delete root.dataset.theme;
  themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === mode)));
  try {
    if (mode === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {}
}
let saved = 'system';
try { saved = localStorage.getItem(KEY) || 'system'; } catch {}
applyTheme(saved);
themeButtons.forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet ?? 'system')));

/* ---------- Nav ---------- */
const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Local time ---------- */
document.querySelectorAll<HTMLElement>('[data-clock]').forEach((el) => {
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: el.dataset.clock });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30_000);
});

/* ---------- Splash: once per session, any click or key skips it ---------- */
const splash = document.querySelector<HTMLElement>('[data-splash]');
if (splash) {
  try { sessionStorage.setItem('lj-splash', '1'); } catch {}
  const skip = () => {
    splash.classList.add('skip');
    setTimeout(() => splash.remove(), 300);
    removeEventListener('keydown', skip);
  };
  splash.addEventListener('click', skip);
  addEventListener('keydown', skip);
  setTimeout(() => { splash.remove(); removeEventListener('keydown', skip); }, 2600);
}

/* ---------- Showcase: pinned stage, scroll-scrubbed circle reveal from each app icon ---------- */
// Same model as pawan.app: every slide owns one viewport of scroll. It holds for the first 10%, then over the
// next 40% the next slide's circle grows out of its icon (0 → 150%). Every value is a pure function of the
// scroll position, eased toward it each frame so wheel steps glide instead of jumping.
const show = document.querySelector<HTMLElement>('[data-show]');
const pinnable = matchMedia('(min-width: 1000px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
if (show) {
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const slides = [...show.querySelectorAll<HTMLElement>('.slide')].map((el) => ({
    el,
    copy: el.querySelector<HTMLElement>('.slide-copy'),
    icon: el.querySelector<HTMLElement>('.slide-icon'),
    texts: [...el.querySelectorAll<HTMLElement>('.s-in')],
    visual: el.querySelector<HTMLElement>('.slide-visual'),
    ox: 0, oy: 0,
  }));
  const dots = [...show.querySelectorAll<HTMLElement>('.show-dot')];
  const dotIcons = dots.map((d) => d.querySelector<HTMLElement>('.app-icon'));
  const count = show.querySelector('[data-show-n]');
  const bar = show.querySelector<HTMLElement>('.show-progress');
  const n = slides.length;
  const HOLD = 0.1, SPAN = 0.4;
  let pinned = false;
  let cur = -1;   // eased scroll offset inside the stage, in px
  let raf = 0;
  let active = -1;

  // Each slide grows from its own icon; offsets (not rects) so the icon's scale does not skew the centre.
  const origins = () => slides.forEach((s) => {
    if (!s.icon) return;
    let x = s.icon.offsetWidth / 2, y = s.icon.offsetHeight / 2;
    for (let el: HTMLElement | null = s.icon; el && el !== s.el; el = el.offsetParent as HTMLElement | null) {
      x += el.offsetLeft; y += el.offsetTop;
    }
    s.ox = x; s.oy = y;
  });
  const target = () => Math.min(n * innerHeight, Math.max(0, scrollY - show.offsetTop));
  // Progress of slide k's entrance (slide 0 is always fully in).
  const enter = (k: number, y: number) => (k === 0 ? 1 : k >= n ? 0 : clamp01((y / innerHeight - k - HOLD) / SPAN));

  // Always write explicit values ('none', never ''): clearing would fall back to the CSS resting state
  // (icon at .55, text 80px down) that hidden slides start from.
  const render = (y: number) => {
    const vh = innerHeight;
    slides.forEach((s, k) => {
      const t = enter(k, y);              // this slide coming in
      const out = enter(k + 1, y);        // the next slide covering it
      const u = clamp01((t - 0.4) / 0.6); // text and visual follow in the last 60% of the circle
      const covered = enter(k + 1, y) === 1 || (k > 0 && t === 0);
      s.el.style.visibility = covered ? 'hidden' : 'visible';
      if (covered) return;
      // The new icon (and its circle) is born on the centre of the current icon, which is lifting 80px * t with
      // its copy, then glides to its own place as the circle grows. Copy blocks differ in height, so the two
      // icons rarely share a position.
      const prev = slides[k - 1];
      const dx = prev ? (prev.ox - s.ox) * (1 - t) : 0;
      const dy = prev ? (prev.oy - 80 * t - s.oy) * (1 - t) : 0;
      if (k > 0) s.el.style.clipPath = `circle(${(t * 150).toFixed(3)}% at ${(s.ox + dx).toFixed(2)}px ${(s.oy + dy).toFixed(2)}px)`;
      if (s.icon) s.icon.style.transform = t < 1 ? `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${(0.55 + 0.45 * t).toFixed(4)})` : 'none';
      s.texts.forEach((el) => {
        el.style.opacity = u.toFixed(4);
        el.style.transform = u < 1 ? `translateY(${(80 * (1 - u)).toFixed(2)}px)` : 'none';
      });
      if (s.copy) {
        s.copy.style.opacity = (1 - 0.8 * out).toFixed(4);
        s.copy.style.transform = out > 0 ? `translateY(${(-80 * out).toFixed(2)}px)` : 'none';
      }
      if (s.visual) {
        // Slow drift while the slide holds, then up and back (scale .9) as the next circle covers it.
        const holdStart = k === 0 ? 0 : (k + HOLD + SPAN) * vh;
        const holdEnd = (k + 1 + HOLD) * vh;
        const drift = -36 * clamp01((y - holdStart) / (holdEnd - holdStart));
        const ty = 160 * (1 - t) + drift - 54 * out;
        s.visual.style.opacity = (k === 0 ? 1 : u).toFixed(4);
        s.visual.style.transform = `perspective(1400px) translateY(${ty.toFixed(2)}px) rotateX(${(16 * (1 - t)).toFixed(3)}deg) scale(${(1 - 0.1 * out).toFixed(4)})`;
      }
    });
    // Rail: each icon's weight is how much of the screen its slide currently owns.
    dotIcons.forEach((ic, k) => {
      const w = enter(k, y) - enter(k + 1, y);
      if (ic) { ic.style.opacity = (0.5 + 0.5 * w).toFixed(3); ic.style.transform = `scale(${(0.7 + 0.32 * w).toFixed(4)})`; }
    });
    let a = 0;
    for (let k = 1; k < n; k++) if (enter(k, y) >= 0.5) a = k;
    if (a !== active) {
      active = a;
      dots.forEach((d, j) => d.classList.toggle('on', j === a));
      if (count) count.textContent = String(a + 1).padStart(2, '0');
    }
    bar?.style.setProperty('--p', (y / (n * vh)).toFixed(4));
  };
  // Like pawan.app, the nav slides away while the stage is on screen.
  const navAway = () => {
    const y = scrollY - show.offsetTop;
    root.classList.toggle('in-show', pinned && y > -2 && y < n * innerHeight - 2);
  };

  const tick = () => {
    const goal = target();
    cur = cur < 0 ? goal : cur + (goal - cur) * 0.14;
    if (Math.abs(goal - cur) < 0.5) cur = goal;
    render(cur);
    raf = cur === goal ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { navAway(); if (pinned && !raf) raf = requestAnimationFrame(tick); };

  // Drop only the properties render() writes; the markup carries --app, --i and --size inline.
  const clear = () => {
    for (const s of slides) {
      s.el.style.clipPath = s.el.style.visibility = '';
      for (const el of [s.copy, s.icon, s.visual, ...s.texts]) if (el) el.style.opacity = el.style.transform = '';
    }
    for (const ic of dotIcons) if (ic) ic.style.opacity = ic.style.transform = '';
  };
  const mode = () => {
    pinned = pinnable.matches;
    show.classList.toggle('pinned', pinned);
    if (!pinned) { cancelAnimationFrame(raf); raf = 0; clear(); navAway(); return; }
    origins();
    cur = -1;
    kick();
  };
  // Where slide k is fully in: the end of its circle.
  const slideTop = (k: number) => show.offsetTop + (k === 0 ? 0 : (k + HOLD + SPAN) * innerHeight) + 2;
  // Rail dots and the hero dock link to #p-slug; in pinned mode that means a scroll position, not an element.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#p-"]').forEach((a) => a.addEventListener('click', (e) => {
    const k = slides.findIndex((s) => `#${s.el.id}` === a.getAttribute('href'));
    if (!pinned || k < 0) return;
    e.preventDefault();
    scrollTo({ top: slideTop(k), behavior: 'smooth' });
  }));
  mode();
  const hashSlide = slides.findIndex((s) => `#${s.el.id}` === location.hash);
  if (pinned && hashSlide > 0) requestAnimationFrame(() => scrollTo({ top: slideTop(hashSlide) }));
  pinnable.addEventListener('change', mode);
  addEventListener('resize', () => { if (pinned) { origins(); cur = -1; kick(); } }, { passive: true });
  addEventListener('scroll', kick, { passive: true });
}

if (!reduced) {
  /* ---------- Rotator ("Currently") ---------- */
  document.querySelectorAll<HTMLElement>('[data-rotator]').forEach((box) => {
    const items = [...box.querySelectorAll('li')];
    const ticks = [...box.querySelectorAll('.ticks i')];
    if (items.length < 2) return;
    let cur = 0;
    setInterval(() => {
      const prev = items[cur];
      cur = (cur + 1) % items.length;
      prev.classList.remove('on');
      prev.classList.add('out');
      setTimeout(() => prev.classList.remove('out'), 450);
      items[cur].classList.add('on');
      ticks.forEach((t, i) => t.classList.toggle('on', i === cur));
    }, 2800);
  });

  /* ---------- Screenshot cycling: pauses on hover and off-screen ---------- */
  document.querySelectorAll<HTMLElement>('[data-cycle]').forEach((frame) => {
    const imgs = [...frame.querySelectorAll('img')];
    if (imgs.length < 2) return;
    let i = 0;
    let paused = false;
    let visible = false;
    frame.addEventListener('mouseenter', () => (paused = true));
    frame.addEventListener('mouseleave', () => (paused = false));
    // The other screens stay display:none (so their lazy images don't download) until the page has
    // loaded and the frame is on screen; then they're unhidden and start cycling.
    const ready = () => { if (visible && document.readyState === 'complete') frame.classList.add('cycling'); };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; ready(); }).observe(frame);
    addEventListener('load', ready);
    setInterval(() => {
      if (paused || !visible || !frame.classList.contains('cycling')) return;
      imgs[i].classList.remove('on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('on');
    }, 2600);
  });

  /* ---------- Pointer tilt ---------- */
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }

  /* ---------- Custom cursor: fine pointers only ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const label = document.querySelector<HTMLElement>('.cursor-label');
    const tag = document.querySelector<HTMLElement>('.cursor-tag');
    if (ring && dot && label && tag) {
      root.classList.add('has-cursor');
      let x = -100, y = -100, rx = -100, ry = -100;
      const LINK = 'a, button, summary, label, [role="button"], .fchip';
      const TEXT = 'input, textarea, select, [contenteditable="true"]';
      const setState = (target: Element | null) => {
        const labelled = target?.closest<HTMLElement>('[data-cursor]');
        const text = target?.closest(TEXT);
        const link = target?.closest(LINK);
        root.classList.toggle('c-text', !!text);
        root.classList.toggle('c-label', !!labelled && !text);
        root.classList.toggle('c-link', !labelled && !!link && !text);
        if (labelled) label.textContent = labelled.dataset.cursor ?? '';
      };
      let down = false;
      const moveTo = (cx: number, cy: number) => {
        x = cx; y = cy;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };
      addEventListener('pointermove', (e) => {
        moveTo(e.clientX, e.clientY);
        setState(e.target as Element);
        root.classList.remove('c-hide');
      }, { passive: true });
      // A long press can turn into a native drag (links, images), which stops pointermove; follow drag events instead.
      addEventListener('dragover', (e) => moveTo(e.clientX, e.clientY), { passive: true });
      const release = () => { down = false; root.classList.remove('c-down'); };
      addEventListener('pointerdown', () => { down = true; root.classList.add('c-down'); });
      addEventListener('pointerup', release);
      addEventListener('pointercancel', release);
      addEventListener('dragend', release);
      document.addEventListener('pointerleave', () => root.classList.add('c-hide'));
      document.addEventListener('pointerenter', () => root.classList.remove('c-hide'));
      const loop = () => {
        // Eased while hovering; locked to the pointer while pressed (selecting text, dragging) so ring and dot stay concentric.
        const k = down ? 1 : 0.2;
        rx += (x - rx) * k; ry += (y - ry) * k;
        ring.style.transform = tag.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();

      // Buttons lean toward the pointer.
      document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
        b.addEventListener('pointermove', (e) => {
          const r = b.getBoundingClientRect();
          b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 8}px ${((e.clientY - r.top) / r.height - 0.5) * 6}px`;
        });
        b.addEventListener('pointerleave', () => (b.style.translate = ''));
      });
    }
  }

  /* ---------- Footer wordmark: light follows the pointer ---------- */
  document.querySelectorAll<HTMLElement>('[data-wordmark]').forEach((w) => {
    w.addEventListener('pointermove', (e) => {
      const r = w.getBoundingClientRect();
      w.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      w.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  /* ---------- Scroll motion, loaded on idle ---------- */
  // Reveal targets are hidden from now until motion runs; the failsafe shows them if it never does.
  root.classList.add('js-motion');
  const failsafe = setTimeout(() => root.classList.remove('js-motion'), 4000);
  const loadMotion = () =>
    import('./motion')
      .then((m) => { m.startMotion(); clearTimeout(failsafe); })
      .catch(() => root.classList.remove('js-motion'));
  if ('requestIdleCallback' in window) requestIdleCallback(loadMotion, { timeout: 1200 });
  else setTimeout(loadMotion, 200);
}
