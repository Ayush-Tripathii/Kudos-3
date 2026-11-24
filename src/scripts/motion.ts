/* Lazy motion layer — loaded on idle, never blocks first paint. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initMotion(reduced: boolean) {
  gsap.registerPlugin(ScrollTrigger);

  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    (window as any).__lenis = lenis;
  }

  // in-page anchors: smooth (or instant) scroll, then hand focus to the target
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.hash.length < 2) return;
    const target = document.querySelector<HTMLElement>(a.hash);
    if (!target) return;
    e.preventDefault();
    const focus = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    if (lenis) lenis.scrollTo(target, { offset: a.hash === '#top' ? -200 : -64, duration: 1.2, onComplete: focus });
    else { target.scrollIntoView(); focus(); }
    history.replaceState(null, '', a.hash);
  });

  // 9 · story timeline — brass rule scrubs down, plates fill with clay as they pass
  const chapters = document.querySelector<HTMLElement>('[data-chapters]');
  const rule = document.querySelector<HTMLElement>('[data-chapters-rule]');
  if (chapters && rule && !reduced) {
    gsap.fromTo(rule, { '--s': 0 }, {
      '--s': 1, ease: 'none',
      scrollTrigger: { trigger: chapters, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 },
    });
  }
  document.querySelectorAll<HTMLElement>('[data-chap]').forEach((chap) => {
    ScrollTrigger.create({
      trigger: chap, start: 'top 65%',
      onEnter: () => chap.classList.add('is-filled'),
      onLeaveBack: () => chap.classList.remove('is-filled'),
    });
  });

  // lightbox / drawer can pause smooth scroll
  addEventListener('kudos:lock', () => lenis?.stop());
  addEventListener('kudos:unlock', () => lenis?.start());

  ScrollTrigger.refresh();
}
