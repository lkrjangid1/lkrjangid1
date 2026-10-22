// Scroll-driven motion (GSAP). Loaded on idle by site.ts so it never competes with first paint.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function startMotion() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const ease = 'expo.out';

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

  if (document.querySelector('.hero-glow')) {
    gsap.to('.hero-glow', { opacity: 0.35, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
}
