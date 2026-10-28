import React from 'react';

/**
 * Directional motion blur, done properly: each moving element gets its own SVG
 * Gaussian blur whose X and Y deviations follow its velocity, so things smear
 * along the direction they travel and snap sharp when they stop.
 */
export const BLUR_IDS = ['mb-card-0', 'mb-card-1', 'mb-card-2', 'mb-name-1', 'mb-name-2', 'mb-marquee'] as const;

export const MotionBlurDefs: React.FC = () => (
  <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      {BLUR_IDS.map((id) => (
        <filter key={id} id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur id={`${id}-dev`} in="SourceGraphic" stdDeviation="0 0" />
        </filter>
      ))}
    </defs>
  </svg>
);

/** Apply a blur of sx/sy pixels (local axes). Below a threshold the filter is removed so text stays crisp. */
export function setBlur(el: HTMLElement | null, id: string, sx: number, sy: number) {
  if (!el) return;
  const on = sx + sy > 0.25;
  if (on) {
    document.getElementById(`${id}-dev`)?.setAttribute('stdDeviation', `${sx.toFixed(2)} ${sy.toFixed(2)}`);
    if (el.dataset.blur !== '1') {
      el.style.filter = `url(#${id})`;
      el.dataset.blur = '1';
    }
  } else if (el.dataset.blur === '1') {
    el.style.filter = '';
    el.dataset.blur = '0';
  }
}
