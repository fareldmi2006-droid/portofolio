import React, { useEffect, useRef, useState } from 'react';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Heading that resolves word by word as it scrolls in. Only headings that start
 * below the fold are armed, the reveal fires early (as soon as the top 10% shows)
 * and lasts under a second, so nothing is ever left sitting blurred.
 */
export const RevealText: React.FC<{ text: string; as?: 'h2' | 'span' }> = ({ text, as = 'h2' }) => {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const below = el.getBoundingClientRect().top > window.innerHeight * 0.9;
    if (!below) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(/(\s+)/);
  const Tag = as as 'h2';
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={`reveal${armed ? ' armed' : ''}${inView ? ' is-in' : ''}`} aria-label={text}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <span className="rw" aria-hidden="true" key={i} style={{ ['--i' as string]: i / 2 }}>
            {w}
          </span>
        ),
      )}
    </Tag>
  );
};

/** The last word of the role line rotates; the name (h1) never changes. */
export const WordCycle: React.FC<{ words: string[]; interval?: number }> = ({ words, interval = 2600 }) => {
  const [i, setI] = useState(0);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (reduced() || words.length < 2) return;
    const id = window.setInterval(() => {
      setI((n) => (n + 1) % words.length);
      setChanged(true);
    }, interval);
    return () => window.clearInterval(id);
  }, [words, interval]);
  useEffect(() => setI(0), [words]);
  return (
    <span className="cycle" aria-hidden="true">
      <span key={`${i}-${words[i]}`} className={`cycle-word${changed ? ' is-new' : ''}`}>{words[i]}</span>
    </span>
  );
};

/** Circular text that turns slowly and speeds up while the page scrolls. */
export const RotatingBadge: React.FC<{ text: string; core: string }> = ({ text, core }) => {
  const g = useRef<SVGGElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let angle = 0;
    let boost = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost = Math.max(boost * 0.92, Math.min(240, Math.abs(dy) / Math.max(dt, 0.001) * 0.25));
      angle = (angle + (14 + boost) * dt * (dy < 0 ? -1 : 1)) % 360;
      g.current?.setAttribute('transform', `rotate(${angle.toFixed(2)} 60 60)`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="badge" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle className="badge-disc" cx="60" cy="60" r="59" />
        <g ref={g}>
          <text>
            <textPath href="#badge-circle" textLength="285">{text}</textPath>
          </text>
        </g>
      </svg>
      <span className="badge-core">{core}</span>
    </div>
  );
};

/** Dots on the right edge showing which section you are in (wide screens only). */
export const SectionRail: React.FC<{ items: { id: string; label: string }[]; prefix: string }> = ({ items, prefix }) => {
  const [current, setCurrent] = useState(items[0]?.id);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let best = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= mid) best = it.id;
      }
      setCurrent(best);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);
  return (
    <ul className="rail" aria-label="Sections">
      {items.map((it) => (
        <li key={it.id}>
          <a href={`#${it.id}`} aria-current={current === it.id} aria-label={it.label} data-cursor={`${prefix} ${it.label}`}>
            <i />
            <span>{it.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};
