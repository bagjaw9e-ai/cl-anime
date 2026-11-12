import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Landscape} from './Landscape';
import {SceneProps} from './types';

// Jalan berkelok ke cakrawala dengan bendera + matahari terbit.
export const S13: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const sun = ease(f, 0, dur - 6, 0.15, 1);
  return (
    <Stage bg={{top: C.plum, bottom: C.coral, glow: C.gold, glowY: 950, glowOp: 0.3 + sun * 0.3}}
      particles={{n: 14, color: C.gold, color2: C.cream, opacity: 0.35}} cam={{x: 560, y: 1000, s: ease(f, 0, dur, 1, 1.15)}}>
      <Landscape sun={sun} />
    </Stage>
  );
};
