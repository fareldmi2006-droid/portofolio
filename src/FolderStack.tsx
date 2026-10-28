import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FolderOpen, X } from 'lucide-react';
import { setBlur } from './motionBlur';

export type FolderCard = { kicker: string; title: string; sub: string; backTitle: string; points: string[]; index: string };

type Props = {
  cards: FolderCard[];
  icons: React.ReactNode[];
  openLabel: string;
  closeLabel: string;
  hint: string;
  cursorOpen: string;
  cursorClose: string;
};

type Spring = { x: number; y: number; s: number; vx: number; vy: number; vs: number };
type Target = { x: number; y: number; s: number; z: number };
type Phase = 'stack' | 'out' | 'open';

// one calm spring for everything: slow-to-medium, settles without bounce
const K = 52;
const D = 14.4;
const POP = 38; // ~1 cm lift when a folder is pointed at
const SLIDE_MS = 520; // time to pull the folder out before it turns
const TURN_MS = 700; // wait for the turn back before sliding home

/**
 * Three profile folders filed in a neat stack in the middle of the section.
 * Point at one and it rises about a centimetre; click it and it slides out of
 * the stack, then turns to face the screen while the others blur behind it.
 */
export const FolderStack: React.FC<Props> = ({ cards, icons, openLabel, closeLabel, hint, cursorOpen, cursorClose }) => {
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const springs = useRef<Spring[]>(cards.map(() => ({ x: 0, y: 0, s: 1, vx: 0, vy: 0, vs: 0 })));
  const targets = useRef<Target[]>(cards.map(() => ({ x: 0, y: 0, s: 1, z: 1 })));
  const hover = useRef<number | null>(null);
  const phase = useRef<Phase>('stack');
  const active = useRef<number | null>(null);
  const spreadK = useRef(0.4); // stack starts snug, then fans out once seen
  const timers = useRef<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dims, setDims] = useState({ cw: 340, ch: 400, step: 70, stageH: 620, top: 56 });
  const dimsRef = useRef(dims);
  const width = useRef(800);

  const layout = useCallback(() => {
    const { cw, ch, step, top } = dimsRef.current;
    const narrow = width.current < 640;
    const openScale = narrow ? Math.min(1.04, (width.current - 8) / cw) : 1.1;
    const stackH = ch + step * (cards.length - 1);
    cards.forEach((_, i) => {
      const baseY = top + i * step * spreadK.current;
      let t: Target = { x: 0, y: baseY, s: 1, z: i + 1 };
      if (active.current === i) {
        if (phase.current === 'out') t = { x: 0, y: baseY - ch * 0.5, s: 1.02, z: 20 };
        else if (phase.current === 'open') t = { x: 0, y: top + (stackH - ch) / 2, s: openScale, z: 20 };
      } else if (active.current === null && hover.current === i) {
        t = { ...t, y: baseY - POP };
      }
      targets.current[i] = t;
      const el = els.current[i];
      if (el) el.style.zIndex = String(t.z);
    });
  }, [cards]);

  useEffect(() => {
    const measure = () => {
      const W = stage.current?.clientWidth ?? 800;
      width.current = W;
      const narrow = W < 640;
      const cw = Math.round(narrow ? Math.min(330, W - 24) : 360);
      const ch = Math.round(narrow ? cw * 1.2 : cw * 1.05);
      const step = narrow ? 80 : 92; // each folder shows its tab and title above the next
      const top = 70; // room for the ~1 cm pop and the pull-out
      const stackH = ch + step * (cards.length - 1);
      const next = { cw, ch, step, top, stageH: top + stackH + 36 };
      dimsRef.current = next;
      setDims(next);
      layout();
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [layout, cards.length]);

  // physics: every move eases in on the same calm spring, smeared slightly along its path
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      springs.current.forEach((sp, i) => {
        const t = targets.current[i];
        if (reduce) Object.assign(sp, { x: t.x, y: t.y, s: t.s, vx: 0, vy: 0, vs: 0 });
        else {
          sp.vx += (K * (t.x - sp.x) - D * sp.vx) * dt;
          sp.vy += (K * (t.y - sp.y) - D * sp.vy) * dt;
          sp.vs += (K * (t.s - sp.s) - D * sp.vs) * dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          sp.s += sp.vs * dt;
        }
        const el = els.current[i];
        if (!el) return;
        el.style.transform = `translate(${sp.x.toFixed(2)}px, ${sp.y.toFixed(2)}px) scale(${sp.s.toFixed(4)})`;
        setBlur(el, `mb-card-${i}`, Math.min(10, Math.abs(sp.vx) / 140), Math.min(10, Math.abs(sp.vy) / 140));
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // fan the stack out the first time it comes into view (it is already visible, just snug)
  useEffect(() => {
    if (!stage.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          spreadK.current = 1;
          layout();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(stage.current);
    return () => io.disconnect();
  }, [layout]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const close = useCallback(
    (then?: () => void) => {
      if (active.current === null) return then?.();
      clear();
      setFlipped(null);
      at(TURN_MS, () => {
        phase.current = 'stack';
        active.current = null;
        setSelected(null);
        layout();
        if (then) at(380, then);
      });
    },
    [layout],
  );

  const open = useCallback(
    (i: number) => {
      const go = () => {
        clear();
        spreadK.current = 1;
        hover.current = null;
        setHovered(null);
        active.current = i;
        setSelected(i);
        phase.current = 'out';
        layout();
        // bring the whole stack into view so the opened folder is read in full
        const r = stage.current?.getBoundingClientRect();
        if (r && (r.top < 60 || r.bottom > window.innerHeight)) stage.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        at(SLIDE_MS, () => {
          phase.current = 'open';
          layout();
          setFlipped(i);
        });
      };
      if (active.current !== null && active.current !== i) close(go);
      else go();
    },
    [close, layout],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clear();
    };
  }, [close]);

  const setHover = (i: number | null) => {
    if (active.current !== null) return;
    hover.current = i;
    setHovered(i);
    layout();
  };

  return (
    <div className="folders-wrap">
      <div
        className={`folders${selected !== null ? ' has-open' : ''}`}
        ref={stage}
        style={{ height: dims.stageH, ['--cw' as string]: `${dims.cw}px`, ['--ch' as string]: `${dims.ch}px`, ['--u' as string]: String(dims.cw / 360) }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {cards.map((c, i) => {
          const isOpen = selected === i;
          return (
            <button
              key={c.title}
              type="button"
              ref={(el) => (els.current[i] = el)}
              className={`folder folder-${i}${isOpen ? ' is-open' : ''}${flipped === i ? ' is-flipped' : ''}${selected !== null && !isOpen ? ' is-blur' : ''}${hovered === i ? ' is-hover' : ''}`}
              aria-expanded={isOpen}
              aria-label={`${c.title}. ${isOpen ? closeLabel : openLabel}`}
              data-cursor={isOpen ? cursorClose : cursorOpen}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => (isOpen ? close() : open(i))}
            >
              <span className="folder-flip">
                <span className="fface ffront">
                  <span className="ftab"><span>{c.kicker}</span></span>
                  <span className="fbody">
                    <span className="fhead">
                      <span className="ftitle">{c.title}</span>
                      <span className="findex">{c.index}</span>
                    </span>
                    <span className="fsub">{c.sub}</span>
                    <span className="femblem">{icons[i]}</span>
                    <span className="ffoot"><FolderOpen size={14} aria-hidden="true" />{openLabel}</span>
                    <span className="fglow" aria-hidden="true" />
                  </span>
                </span>
                <span className="fface fback">
                  <span className="ftab"><span>{c.kicker}</span></span>
                  <span className="fbody">
                    <span className="back-title">{c.backTitle}</span>
                    <span className="back-list">
                      {c.points.map((p) => <span className="back-item" key={p}>{p}</span>)}
                    </span>
                    <span className="ffoot"><X size={14} aria-hidden="true" />{closeLabel}</span>
                    <span className="fglow" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="folders-hint card">{hint}</p>
    </div>
  );
};
