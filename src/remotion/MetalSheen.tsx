import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * MetalSheen — the interactive background of the portfolio.
 *
 * Dark wine-black metal engraved with topographic contour lines (a nod to GIS mapping).
 * - Scroll scrubs the frame: a rose-gold band of light sweeps across and catches the engraving.
 * - The pointer acts like a lens: contours bulge away from it and light up under it.
 * - Clicks and taps send ripples through the lines.
 *
 * Every frame-based motion is periodic over DURATION, so the site can wrap the frame freely.
 */
export const DURATION = 900;
export const FPS = 30;
const SWEEPS = 5;
const TAU = Math.PI * 2;

export type Ripple = { x: number; y: number; age: number }; // x, y in px; age in seconds
export type SheenProps = {
  px: number; // pointer x in px
  py: number; // pointer y in px
  pa: number; // pointer presence 0..1
  theme?: 'dark' | 'light';
  ripples: Ripple[];
};

export const defaultSheenProps: SheenProps = { px: 1300, py: 360, pa: 1, ripples: [{ x: 1300, y: 360, age: 0.6 }] };

const PALETTES = {
  dark: {
    black: '#171416',
    wine: '#3A0F1C',
    burgundy: '#551C25',
    line: '#C9A27E',
    lit: '#F2EDE8',
    lineOpacity: 0.11,
    grain: 'rgba(242,237,232,0.022)',
    vignette: 'rgba(12,9,11,0.72)',
    glowOpacity: 0.16,
    blend: 'screen' as const,
  },
  light: {
    black: '#F1EBE3',
    wine: '#E8D5CD',
    burgundy: '#DCC3BA',
    line: '#7A2C3D',
    lit: '#3A0F1C',
    lineOpacity: 0.13,
    grain: 'rgba(58,15,28,0.025)',
    vignette: 'rgba(241,235,227,0.7)',
    glowOpacity: 0.12,
    blend: 'multiply' as const,
  },
};


type Ring = { cx: number; cy: number; r: number; seed: number; stretch: number };

const LENS_R = 190;
const LENS_PUSH = 34;
const RIPPLE_SPEED = 620; // px per second
const RIPPLE_LIFE = 2.2; // seconds

function ringPath(ring: Ring, t: number, p: SheenProps) {
  const { cx, cy, r, seed, stretch } = ring;
  const points = 120;
  let d = '';
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * TAU;
    const k =
      1 +
      0.1 * Math.sin(3 * a + seed + t) +
      0.06 * Math.sin(5 * a - seed * 1.7 + 2 * t) +
      0.035 * Math.sin(8 * a + seed * 0.6 - t);
    let x = cx + Math.cos(a) * r * k * stretch;
    let y = cy + Math.sin(a) * r * k;

    // lens: push lines away from the pointer
    if (p.pa > 0.01) {
      const dx = x - p.px;
      const dy = y - p.py;
      const dist = Math.hypot(dx, dy) || 1;
      const f = Math.exp(-((dist / LENS_R) ** 2)) * LENS_PUSH * p.pa;
      x += (dx / dist) * f;
      y += (dy / dist) * f;
    }

    // ripples: a travelling wave from each click
    for (const rp of p.ripples) {
      const dx = x - rp.x;
      const dy = y - rp.y;
      const dist = Math.hypot(dx, dy) || 1;
      const front = rp.age * RIPPLE_SPEED;
      const off = dist - front;
      const env = Math.exp(-((off / 70) ** 2)) * Math.max(0, 1 - rp.age / RIPPLE_LIFE);
      const f = Math.sin(off / 18) * 16 * env;
      x += (dx / dist) * f;
      y += (dy / dist) * f;
    }
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + 'Z';
}

export const MetalSheen: React.FC<SheenProps> = (props) => {
  const frame = useCurrentFrame();
  const { width: w, height: h } = useVideoConfig();
  const t = (frame / DURATION) * TAU;
  const p = { ...defaultSheenProps, ...props };
  const C = PALETTES[p.theme ?? 'dark'];

  const rings = useMemo<Ring[]>(() => {
    const big = Math.max(w, h);
    const out: Ring[] = [];
    for (let i = 0; i < 18; i++) out.push({ cx: w * 0.74, cy: h * 0.34, r: 28 + i * big * 0.042, seed: 0.4 + i * 0.21, stretch: 1.28 });
    for (let i = 0; i < 11; i++) out.push({ cx: w * 0.12, cy: h * 0.92, r: 22 + i * big * 0.036, seed: 2.2 + i * 0.17, stretch: 1.15 });
    return out;
  }, [w, h]);

  const paths = rings.map((r) => ringPath(r, t, p));

  const s = ((frame * SWEEPS) / DURATION) % 1;
  const band = -0.35 + s * 1.7;
  const stop = (o: number) => Math.min(1, Math.max(0, band + o));

  const g1x = 18 + 8 * Math.sin(t);
  const g1y = 12 + 6 * Math.cos(t);
  const g2x = 82 + 7 * Math.cos(t + 1.3);
  const g2y = 78 + 8 * Math.sin(t + 1.3);


  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        backgroundImage: `radial-gradient(60% 55% at ${g1x}% ${g1y}%, ${C.wine} 0%, transparent 70%),
          radial-gradient(55% 50% at ${g2x}% ${g2y}%, ${C.burgundy}cc 0%, transparent 72%)`,
      }}
    >
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(112deg, ${C.grain} 0 1px, transparent 1px 3px)` }} />

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="band" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={w} y2={h}>
            <stop offset={stop(-0.16)} stopColor="#fff" stopOpacity={0} />
            <stop offset={stop(-0.03)} stopColor="#fff" stopOpacity={0.85} />
            <stop offset={stop(0)} stopColor="#fff" stopOpacity={1} />
            <stop offset={stop(0.03)} stopColor="#fff" stopOpacity={0.85} />
            <stop offset={stop(0.16)} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="glow" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={w} y2={h}>
            <stop offset={stop(-0.22)} stopColor={C.line} stopOpacity={0} />
            <stop offset={stop(0)} stopColor={C.line} stopOpacity={C.glowOpacity} />
            <stop offset={stop(0.22)} stopColor={C.line} stopOpacity={0} />
          </linearGradient>
          <radialGradient id="spot" gradientUnits="userSpaceOnUse" cx={p.px} cy={p.py} r={260}>
            <stop offset="0" stopColor="#fff" stopOpacity={0.95 * p.pa} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="spotGlow" gradientUnits="userSpaceOnUse" cx={p.px} cy={p.py} r={340}>
            <stop offset="0" stopColor={C.line} stopOpacity={0.14 * p.pa} />
            <stop offset="1" stopColor={C.line} stopOpacity={0} />
          </radialGradient>
          <mask id="lightMask">
            <rect width={w} height={h} fill="url(#band)" />
            <rect width={w} height={h} fill="url(#spot)" />
          </mask>
        </defs>

        <g fill="none" stroke={C.line} strokeOpacity={C.lineOpacity} strokeWidth={1}>
          {paths.map((d, i) => <path key={i} d={d} />)}
        </g>

        <rect width={w} height={h} fill="url(#glow)" style={{ mixBlendMode: C.blend }} />
        <rect width={w} height={h} fill="url(#spotGlow)" style={{ mixBlendMode: C.blend }} />

        <g fill="none" mask="url(#lightMask)" strokeWidth={1.3}>
          {paths.map((d, i) => <path key={i} d={d} stroke={i % 3 === 0 ? C.lit : C.line} strokeOpacity={0.75} />)}
        </g>

        {/* ripple rings */}
        {p.ripples.map((rp, i) => {
          const life = Math.max(0, 1 - rp.age / RIPPLE_LIFE);
          return (
            <circle key={i} cx={rp.x} cy={rp.y} r={rp.age * RIPPLE_SPEED} fill="none" stroke={C.line} strokeOpacity={0.45 * life} strokeWidth={1 + 2 * life} />
          );
        })}

      </svg>

      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, transparent 35%, ${C.vignette} 100%)` }} />
    </AbsoluteFill>
  );
};
