import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {pop} from '../anim';
import {Stage} from '../components/Stage';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {Heart, PhoneBody} from '../components/Phone';
import {SceneProps} from './types';

// Maskot natap HP flat; layar cuma glow pink blur + ikon hati.
export const S21: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const ph = pop(f, 0, 12);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: '#FF7A9C', glowX: 720, glowY: 900, glowOp: 0.35}} particles={{n: 18, color: '#FF9AB3', color2: C.cream, opacity: 0.35}}>
      <g transform={`translate(720,880) scale(${ph}) rotate(4)`}>
        <PhoneBody w={300} h={560} color="#FF6F91" heart={1} />
      </g>
      {[0, 1, 2, 3].map((i) => {
        const u = ((f * 0.025 + i * 0.25) % 1);
        return <Heart key={i} x={640 + Math.sin(u * 8 + i) * 50 - u * 200} y={760 - u * 300} s={0.8} fill={i % 2 ? '#FF9AB3' : C.cream} opacity={(1 - u) * 0.85} />;
      })}
      <MidbrainMascot x={330} y={1360} s={1.35} mood={f > 30 ? 'love' : 'derp'} look={1} />
    </Stage>
  );
};
