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

/* ---------- Showcase: pinned stage, circle reveal from each app icon ---------- */
const show = document.querySelector<HTMLElement>('[data-show]');
const pinnable = matchMedia('(min-width: 1000px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
if (show) {
  const slides = [...show.querySelectorAll<HTMLElement>('.slide')];
  const dots = [...show.querySelectorAll<HTMLElement>('.show-dot')];
  const count = show.querySelector('[data-show-n]');
  const bar = show.querySelector<HTMLElement>('.show-progress');
  const n = slides.length;
  let active = 0;
  let pinned = false;

  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    slides.forEach((s, j) => {
      s.classList.toggle('on', j <= i);
      s.classList.toggle('under', j < i);
    });
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
    if (count) count.textContent = String(i + 1).padStart(2, '0');
  };
  // Each slide grows out of its own icon; every slide shares the layout, so measure per slide.
  const origins = () => slides.forEach((s) => {
    const icon = s.querySelector<HTMLElement>('.slide-icon');
    if (!icon) return;
    // Offsets, not getBoundingClientRect: hidden slides hold their copy shifted down for the entrance.
    let x = icon.offsetWidth / 2, y = icon.offsetHeight / 2;
    for (let el: HTMLElement | null = icon; el && el !== s; el = el.offsetParent as HTMLElement | null) {
      x += el.offsetLeft; y += el.offsetTop;
    }
    s.style.setProperty('--ox', `${x}px`);
    s.style.setProperty('--oy', `${y}px`);
  });
  // Scroll space is n viewports; each slide owns an equal share of the (n - 1) that actually scroll.
  const segment = () => (show.offsetHeight - innerHeight) / n;
  const update = () => {
    if (!pinned) return;
    const y = scrollY - show.offsetTop;
    const p = Math.min(1, Math.max(0, y / (show.offsetHeight - innerHeight)));
    bar?.style.setProperty('--p', p.toFixed(4));
    setActive(Math.min(n - 1, Math.max(0, Math.floor(y / segment()))));
  };
  const mode = () => {
    pinned = pinnable.matches;
    show.classList.toggle('pinned', pinned);
    if (pinned) { origins(); update(); }
    else slides.forEach((s) => s.classList.add('on'));
  };
  // Rail dots and the hero dock link to #p-slug; in pinned mode that means a scroll position, not an element.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#p-"]').forEach((a) => a.addEventListener('click', (e) => {
    const i = slides.findIndex((s) => `#${s.id}` === a.getAttribute('href'));
    if (!pinned || i < 0) return;
    e.preventDefault();
    scrollTo({ top: show.offsetTop + i * segment() + 2, behavior: 'smooth' });
  }));
  // Deep links (#p-libgen) land on that slide instead of the stage top.
  const hashSlide = slides.findIndex((s) => `#${s.id}` === location.hash);
  mode();
  if (pinned && hashSlide > 0) requestAnimationFrame(() => scrollTo({ top: show.offsetTop + hashSlide * segment() + 2 }));
  pinnable.addEventListener('change', mode);
  addEventListener('resize', () => pinned && origins(), { passive: true });
  addEventListener('scroll', update, { passive: true });
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
