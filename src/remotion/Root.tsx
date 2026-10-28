import React from 'react';
import { Composition } from 'remotion';
import { MetalSheen, DURATION, FPS, defaultSheenProps } from './MetalSheen';

// Open the background in Remotion Studio: npm run studio
// px / py / pa / ripples are the live pointer inputs; edit them in the Studio props panel.
export const RemotionRoot: React.FC = () => (
  <Composition
    id="MetalSheen"
    component={MetalSheen}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={defaultSheenProps}
  />
);
