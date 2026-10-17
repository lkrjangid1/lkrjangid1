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

/* ---------- Reel rail ---------- */
const rail = document.querySelector('.rail');
const reel = document.querySelector('.reel');
if (rail && reel) {
  const icons = [...rail.querySelectorAll('.rail-icon')];
  const n = rail.querySelector('[data-rail-n]');
  const total = icons.length;
  new IntersectionObserver(([e]) => rail.classList.toggle('show', e.isIntersecting), { rootMargin: '-40% 0px -40% 0px' }).observe(reel);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const i = Number((e.target as HTMLElement).dataset.index);
      icons.forEach((ic, j) => ic.classList.toggle('on', j === i));
      if (n) n.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  reel.querySelectorAll('.product').forEach((p) => io.observe(p));
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
      addEventListener('pointermove', (e) => {
        x = e.clientX; y = e.clientY;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        setState(e.target as Element);
        root.classList.remove('c-hide');
      }, { passive: true });
      addEventListener('pointerdown', () => root.classList.add('c-down'));
      addEventListener('pointerup', () => root.classList.remove('c-down'));
      document.addEventListener('pointerleave', () => root.classList.add('c-hide'));
      document.addEventListener('pointerenter', () => root.classList.remove('c-hide'));
      const loop = () => {
        rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
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
