// Site-wide behaviour: theme switch, nav state, local clock, rotators, screenshot cycling, tilt and GSAP motion.
// Everything degrades to a static, fully visible page without JS or with reduced motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

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
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(frame);
    setInterval(() => {
      if (paused || !visible) return;
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

  /* ---------- GSAP ---------- */
  gsap.registerPlugin(ScrollTrigger, SplitText);
  root.classList.add('js-motion');
  const ease = 'expo.out';

  const name = document.querySelector('[data-split-chars]');
  if (name) {
    SplitText.create(name, {
      type: 'words,chars', mask: 'chars', charsClass: 'char', autoSplit: true,
      onSplit: (self) => gsap.from(self.chars, { yPercent: 110, duration: 0.8, ease, stagger: 0.022 }),
    });
  }
  if (document.querySelector('.portrait')) gsap.from('.portrait', { y: 60, opacity: 0, duration: 1.4, ease, delay: 0.25 });

  // Headings visible at load paint immediately (they are usually the LCP element); the rest rise in on scroll.
  document.querySelectorAll('[data-split]').forEach((h) => {
    if (h.getBoundingClientRect().top < innerHeight) return;
    SplitText.create(h, {
      type: 'words', mask: 'words', wordsClass: 'word', autoSplit: true,
      onSplit: (self) => gsap.from(self.words, {
        yPercent: 105, duration: 0.9, ease, stagger: 0.06,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  gsap.set('[data-reveal]', { y: 28 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.08, overwrite: true }),
  });

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      onUpdate: () => (el.textContent = Math.round(o.v) + suffix),
    });
  });

  document.querySelectorAll('.bench').forEach((b) => {
    gsap.from(b.querySelectorAll('.bar i'), { scaleX: 0, duration: 1.2, ease, stagger: 0.15, scrollTrigger: { trigger: b, start: 'top 85%', once: true } });
  });

  document.querySelectorAll('.terminal pre').forEach((pre) => {
    gsap.from(pre.querySelectorAll('.tl'), { opacity: 0, duration: 0.01, stagger: 0.32, scrollTrigger: { trigger: pre, start: 'top 80%', once: true } });
  });

  document.querySelectorAll('.product-visual').forEach((v) => {
    gsap.fromTo(v, { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  if (document.querySelector('.hero-glow')) {
    gsap.to('.hero-glow', { opacity: 0.35, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
}
