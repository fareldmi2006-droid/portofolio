import React, { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { MetalSheen, DURATION, FPS, type SheenProps, type Ripple } from './remotion/MetalSheen';

const FRAMES_PER_PX = 0.55; // how far the animation travels per pixel scrolled
const IDLE_FPS = 5; // slow breathing when the page is still
const MAX_RIPPLES = 4;
const RIPPLE_LIFE = 2.2;

function viewport() {
  const w = Math.max(2, Math.round(window.innerWidth / 2) * 2);
  const h = Math.max(2, Math.round(window.innerHeight / 2) * 2);
  return { w, h };
}

/**
 * Fixed, full-screen Remotion Player.
 * Scroll scrubs the frame; the pointer bends the contours and lights them up; clicks send ripples.
 */
export const Background: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const player = useRef<PlayerRef>(null);
  const glint = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(viewport);
  const [inputs, setInputs] = useState<SheenProps>({ px: -9999, py: -9999, pa: 0, ripples: [] });

  useEffect(() => {
    const onResize = () => setSize(viewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let idle = 0;
    let current = window.scrollY * FRAMES_PER_PX;
    let energy = 0;
    let shown = -1;

    // pointer, smoothed so the lens glides
    const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 };
    const pos = { ...target };
    let presence = 0;
    let wantPresence = 0;
    let touchTimer = 0;
    const ripples: { x: number; y: number; born: number }[] = [];
    let lastSent = '';

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (e.pointerType === 'mouse') wantPresence = 1;
    };
    const onDown = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (e.pointerType !== 'mouse') {
        pos.x = e.clientX;
        pos.y = e.clientY;
        wantPresence = 1;
        window.clearTimeout(touchTimer);
        touchTimer = window.setTimeout(() => (wantPresence = 0), 1400);
      }
      if (!reduce) {
        ripples.push({ x: e.clientX, y: e.clientY, born: performance.now() });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
      }
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) wantPresence = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('mouseout', onLeave);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const y = window.scrollY;
      const velocity = Math.abs(y - lastY) / Math.max(1, dt);
      lastY = y;

      if (!reduce) idle += (dt / 1000) * IDLE_FPS;
      const goal = y * FRAMES_PER_PX + idle;
      current = reduce ? goal : current + (goal - current) * 0.1;
      const frame = ((Math.round(current) % DURATION) + DURATION) % DURATION;
      if (frame !== shown) {
        player.current?.seekTo(frame);
        shown = frame;
      }

      energy = Math.max(energy * 0.93, Math.min(1, velocity / 2.2));
      if (glint.current) glint.current.style.opacity = (energy * 0.55).toFixed(3);

      const ease = reduce ? 1 : 0.14;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      presence += (wantPresence - presence) * 0.08;

      while (ripples.length && (now - ripples[0].born) / 1000 > RIPPLE_LIFE) ripples.shift();
      const live: Ripple[] = ripples.map((r) => ({ x: r.x, y: r.y, age: (now - r.born) / 1000 }));

      const key = `${pos.x.toFixed(1)}|${pos.y.toFixed(1)}|${presence.toFixed(3)}|${live.length}|${live[0]?.age.toFixed(2) ?? ''}`;
      if (key !== lastSent) {
        lastSent = key;
        setInputs({ px: pos.x, py: pos.y, pa: presence < 0.005 ? 0 : presence, ripples: live });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mouseout', onLeave);
      window.clearTimeout(touchTimer);
    };
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <Player
        ref={player}
        component={MetalSheen}
        inputProps={{ ...inputs, theme }}
        durationInFrames={DURATION}
        fps={FPS}
        compositionWidth={size.w}
        compositionHeight={size.h}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
        style={{ width: '100%', height: '100%' }}
      />
      <div className="bg-glint" ref={glint} />
    </div>
  );
};
