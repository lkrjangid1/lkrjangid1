// Showcase behaviour: theme, clock, screenshots, rotators and GSAP motion.
// Everything degrades to a static, fully visible page without GSAP or with reduced motion.
(() => {
  const SHOTS = 'https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/refs/heads/main/screen_shots/';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme (System / Light / Dark) ---------- */
  const KEY = 'lj-theme';
  const themeButtons = document.querySelectorAll('[data-theme-set]');
  function applyTheme(mode) {
    if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
    else delete root.dataset.theme;
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === mode)));
    try { mode === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, mode); } catch (e) {}
  }
  let saved = 'system';
  try { saved = localStorage.getItem(KEY) || 'system'; } catch (e) {}
  applyTheme(saved);
  themeButtons.forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet)));

  /* ---------- Screenshots ---------- */
  document.querySelectorAll('img[data-shot]').forEach((img) => { img.src = SHOTS + img.dataset.shot; });

  /* ---------- Local time ---------- */
  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  const tick = () => { if (clock) clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 30_000);

  /* ---------- Nav state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Reel rail ---------- */
  const railIcons = [...document.querySelectorAll('.rail .app-icon')];
  const railN = document.getElementById('rail-n');
  const railObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = Number(e.target.dataset.index) - 1;
      railIcons.forEach((ic, j) => ic.classList.toggle('on', j === i));
      if (railN) railN.textContent = String(i + 1).padStart(2, '0');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.product').forEach((p) => railObserver.observe(p));
  const rail = document.querySelector('.rail');
  const reel = document.querySelector('.reel');
  if (rail && reel) new IntersectionObserver(([e]) => rail.classList.toggle('show', e.isIntersecting), { rootMargin: '-40% 0px -40% 0px' }).observe(reel);

  if (reduced) return; // Everything below is optional motion.

  /* ---------- "Currently" rotator ---------- */
  const items = [...document.querySelectorAll('.currently-list li')];
  const ticks = [...document.querySelectorAll('.ticks i')];
  let cur = 0;
  setInterval(() => {
    const prev = items[cur];
    cur = (cur + 1) % items.length;
    prev.classList.remove('on'); prev.classList.add('out');
    setTimeout(() => prev.classList.remove('out'), 450);
    items[cur].classList.add('on');
    ticks.forEach((t, i) => t.classList.toggle('on', i === cur));
  }, 2800);

  /* ---------- Screenshot cycling (pauses on hover/focus and off-screen) ---------- */
  document.querySelectorAll('[data-cycle]').forEach((frame) => {
    const imgs = [...frame.querySelectorAll('img')];
    if (imgs.length < 2) return;
    let i = 0, paused = false, visible = false;
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

  /* ---------- Tile tilt ---------- */
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tile, .ccard').forEach((el) => {
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
  function startGsap() {
    const { gsap, ScrollTrigger, SplitText } = window;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger, ...(SplitText ? [SplitText] : []));
    root.classList.add('js-motion');
    const ease = 'expo.out';

    // Hero name: letters rise in from a mask.
    const name = document.querySelector('.name');
    if (SplitText && name) {
      SplitText.create(name, {
        type: 'words,chars', mask: 'chars', charsClass: 'char', autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, { yPercent: 110, duration: 1.1, ease, stagger: 0.035, delay: 0.1 }),
      });
    }
    gsap.from('.portrait', { y: 60, opacity: 0, duration: 1.4, ease, delay: 0.25 });

    // Section titles: words rise as they scroll in.
    if (SplitText) {
      document.querySelectorAll('h2[data-split]').forEach((h) => {
        SplitText.create(h, {
          type: 'words', mask: 'words', wordsClass: 'word',
          onSplit: (self) => gsap.from(self.words, {
            yPercent: 105, duration: 0.9, ease, stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 85%', once: true },
          }),
        });
      });
    }

    // Generic reveals, batched so siblings stagger.
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.08, overwrite: true }),
    });
    gsap.set('[data-reveal]', { y: 28 });

    // Count-ups.
    document.querySelectorAll('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count), suffix = el.dataset.suffix || '';
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 1.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => (el.textContent = Math.round(o.v) + suffix),
      });
    });

    // Benchmark bars grow.
    gsap.from('.bench .bar i', {
      scaleX: 0, duration: 1.2, ease, stagger: 0.15,
      scrollTrigger: { trigger: '.bench', start: 'top 85%', once: true },
    });

    // Terminal lines print one by one.
    const term = document.getElementById('term');
    if (term) {
      const lines = term.innerHTML.split('\n');
      term.innerHTML = lines.map((l) => `<span class="tl">${l}</span>`).join('\n');
      gsap.from(term.querySelectorAll('.tl'), {
        opacity: 0, duration: 0.01, stagger: 0.32,
        scrollTrigger: { trigger: term, start: 'top 80%', once: true },
      });
    }

    // Device mockups drift slightly against the scroll.
    document.querySelectorAll('.product-visual').forEach((v) => {
      gsap.fromTo(v, { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Glow breathes with scroll.
    gsap.to('.hero-glow', { opacity: 0.35, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Deferred scripts run in order, so GSAP is already loaded here; no need to wait for images.
  startGsap();
})();
