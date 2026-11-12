import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {NeonLogo} from '../components/NeonLogo';
import {Vignette} from '../components/Bg';
import {SceneProps} from './types';

// End card: logo bergeser ke tengah, scale-in pelan, latar gelap + vignette (hum neon fade out di audio).
export const S39: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const move = ease(f, 0, 18);
  const sc = 1 + ease(f, 10, dur, 0, 0.07, (x) => x);
  return (
    <Stage bg={{top: '#1E0A10', bottom: C.base0, glow: C.red1, glowY: 960, glowR: 700, glowOp: 0.18 * move}}
      particles={{n: 14, color: C.red2, color2: C.gold, opacity: 0.25, speed: 0.5}}
      over={<>
        <NeonLogo cy={470 + (960 - 470) * move} level={1} scale={sc} />
        <Vignette strength={0.85} />
      </>} />
  );
};
