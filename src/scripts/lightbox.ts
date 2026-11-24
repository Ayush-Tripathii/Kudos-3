/* 10 · FLIP lightbox — native <dialog> (modal = focus trapped, Esc closes) */
const WIDTHS: Record<string, number[]> = { '3x2': [640, 1024, 1600, 2400], '4x5': [640, 1024, 1600] };
const RATIO: Record<string, [number, number]> = { '3x2': [3, 2], '4x5': [4, 5] };

export function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const pic = dlg.querySelector<HTMLPictureElement>('[data-lb-pic]')!;
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const code = dlg.querySelector<HTMLElement>('[data-lb-code]')!;
  const text = dlg.querySelector<HTMLElement>('[data-lb-text]')!;
  const meta: Record<string, { alt: string; cap: string }> = JSON.parse(document.getElementById('lb-data')?.textContent || '{}');
  const RM = document.documentElement.classList.contains('rm');

  let group: HTMLElement[] = [];
  let idx = 0;
  let opener: HTMLElement | null = null;

  const render = (btn: HTMLElement) => {
    const name = btn.dataset.lightboxOpen!;
    const crop = btn.dataset.lightboxCrop || '3x2';
    const ws = WIDTHS[crop];
    const fb = ws.filter((w) => w <= 1600);
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const set = (f: string, list: number[]) => list.map((w) => `${base}/img/${name}-${crop}-${w}.${f} ${w}w`).join(', ');
    pic.querySelectorAll('source').forEach((s) => s.remove());
    const sizes = crop === '4x5' ? '(min-width: 1024px) 60vh, 92vw' : '92vw';
    for (const [type, list, f] of [['image/avif', ws, 'avif'], ['image/webp', fb, 'webp']] as const) {
      const s = document.createElement('source');
      s.type = type; s.srcset = set(f, list as number[]); s.sizes = sizes;
      pic.insertBefore(s, img);
    }
    const [rw, rh] = RATIO[crop];
    img.width = 1600; img.height = Math.round((1600 * rh) / rw);
    img.sizes = sizes;
    img.srcset = set('jpg', fb);
    img.src = `${base}/img/${name}-${crop}-1024.jpg`;
    img.alt = meta[name]?.alt || '';
    const i = group.indexOf(btn);
    code.textContent = group.length > 1 ? `${String(i + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}` : 'Kudos';
    text.textContent = meta[name]?.cap || '';
  };

  const flipFrom = (from: DOMRect | null) => {
    if (RM || !from || !img.animate) return;
    const to = img.getBoundingClientRect();
    if (!to.width) return;
    const s = from.width / to.width;
    img.animate(
      [
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})`, opacity: 0.6 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
  };

  const open = (btn: HTMLElement) => {
    opener = btn;
    const scope = btn.closest('[data-sheet]') || btn.closest('.board');
    group = scope ? Array.from(scope.querySelectorAll<HTMLElement>('[data-lightbox-open]')) : [btn];
    idx = group.indexOf(btn);
    render(btn);
    const thumb = btn.querySelector('.media') || btn.closest('.dish')?.querySelector('.dish__photo');
    const from = thumb ? thumb.getBoundingClientRect() : null;
    dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    dispatchEvent(new Event('kudos:lock'));
    requestAnimationFrame(() => flipFrom(from && from.width ? from : null));
  };

  const go = (d: number) => {
    if (group.length < 2) return;
    idx = (idx + d + group.length) % group.length;
    render(group[idx]);
    if (!RM) img.animate([{ opacity: 0, transform: `translateX(${d * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.33,1,.68,1)' });
  };

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-lightbox-open]');
    if (btn) { e.preventDefault(); open(btn); }
  });
  dlg.querySelector('[data-lb-prev]')!.addEventListener('click', () => go(-1));
  dlg.querySelector('[data-lb-next]')!.addEventListener('click', () => go(1));
  dlg.querySelector('[data-lb-close]')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg || (e.target as HTMLElement).classList.contains('lightbox__frame')) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    dispatchEvent(new Event('kudos:unlock'));
    // return focus to the thumbnail that is now showing, so keyboard users keep their place
    const back = group[idx] || opener;
    back?.focus({ preventScroll: false });
  });
}
