import React, { useEffect, useRef } from 'react';

/**
 * A small label that rides next to the mouse pointer, but only over things you can press,
 * saying what pressing will do. Elements opt in with a data-cursor attribute.
 * Hidden on touch screens and when the pointer is over plain content.
 */
export const CursorHint: React.FC = () => {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: -200, y: -200 };
    const pos = { ...target };
    let visible = false;
    let raf = 0;

    const read = (el: EventTarget | null) => {
      const host = el instanceof Element ? el.closest<HTMLElement>('[data-cursor]') : null;
      const label = host?.dataset.cursor ?? '';
      if (label && text.current && text.current.textContent !== label) text.current.textContent = label;
      if (!!label !== visible) {
        visible = !!label;
        box.current?.classList.toggle('show', visible);
        if (visible) {
          pos.x = target.x;
          pos.y = target.y;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      read(e.target);
      // feed the pointer position to the card under it, for its soft highlight
      const lit = e.target instanceof Element ? e.target.closest<HTMLElement>('.card, .folder') : null;
      if (lit) {
        const r = lit.getBoundingClientRect();
        lit.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        lit.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    };
    const onClick = (e: MouseEvent) => window.setTimeout(() => read(document.elementFromPoint(e.clientX, e.clientY)), 30);
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) read(null);
    };
    const onScroll = () => read(document.elementFromPoint(target.x, target.y));

    const tick = () => {
      const k = reduce ? 1 : 0.22;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (box.current) {
        const flip = target.x > window.innerWidth - 220;
        box.current.style.transform = `translate3d(${(pos.x + (flip ? -16 : 18)).toFixed(1)}px, ${(pos.y + 20).toFixed(1)}px, 0) translateX(${flip ? '-100%' : '0'})`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseout', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div className="cursor-hint" ref={box} aria-hidden="true">
      <i />
      <span ref={text} />
    </div>
  );
};
