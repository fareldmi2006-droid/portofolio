import React, { useEffect, useRef } from 'react';
import { setBlur } from './motionBlur';

/**
 * A ribbon of big serif words that drifts on its own and races with your scroll:
 * scroll speed sets its speed, scroll direction sets its direction,
 * and the faster it goes the more it smears and leans.
 */
export const Marquee: React.FC<{ items: string[] }> = ({ items }) => {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let offset = 0;
    let speed = 0; // px per second, signed
    let dir = 1;
    const BASE = 38;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      const want = reduce ? 0 : dir * (BASE + Math.min(2600, (Math.abs(dy) / Math.max(dt, 0.001)) * 0.9));
      speed += (want - speed) * Math.min(1, dt * 6);
      offset -= speed * dt;

      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          if (offset <= -half) offset += half;
          if (offset > 0) offset -= half;
        }
        const lean = Math.max(-12, Math.min(12, -speed / 140));
        el.style.transform = `translate3d(${offset.toFixed(1)}px,0,0) skewX(${lean.toFixed(2)}deg)`;
        setBlur(el, 'mb-marquee', Math.min(12, Math.max(0, Math.abs(speed) - 140) / 120), 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const run = (key: string) => (
    <span className="mq-run" key={key} aria-hidden={key === 'b' ? true : undefined}>
      {items.map((it) => (
        <React.Fragment key={it}>
          <span className="mq-word">{it}</span>
          <span className="mq-sep" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2 L22 12 L12 22 L2 12 Z" /><circle cx="12" cy="12" r="3" /></svg>
          </span>
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <div className="marquee">
      <div className="mq-track" ref={track}>
        {run('a')}
        {run('a2')}
        {run('b')}
        {run('b2')}
      </div>
    </div>
  );
};

/**
 * Name intro: the two halves of the name fly in from opposite sides,
 * smeared along their path, and lock into place.
 */
export function useNameIntro() {
  const first = useRef<HTMLSpanElement>(null);
  const last = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lines: [React.RefObject<HTMLSpanElement>, number, string, number][] = [
      [first, -1, 'mb-name-1', 0],
      [last, 1, 'mb-name-2', 140],
    ];
    const DUR = 1100;
    const distance = Math.min(900, window.innerWidth * 0.75);
    const ease = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)); // expo out
    const start = performance.now();
    let raf = 0;
    const prev = [distance, distance];

    const tick = (now: number) => {
      let done = true;
      lines.forEach(([ref, side, id, delay], i) => {
        const el = ref.current;
        if (!el) return;
        const t = Math.max(0, Math.min(1, (now - start - delay) / DUR));
        if (t < 1) done = false;
        const x = side * distance * (1 - ease(t));
        const v = Math.abs(x - prev[i]);
        prev[i] = x;
        el.style.transform = t >= 1 ? '' : `translate3d(${x.toFixed(1)}px,0,0)`;
        el.style.opacity = String(Math.min(1, 0.2 + t * 2.2));
        setBlur(el, id, t >= 1 ? 0 : Math.min(40, v * 0.9), 0);
      });
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { first, last };
}
