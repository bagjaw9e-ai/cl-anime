import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {easeIn, ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {MidCore} from './common';
import {SceneProps} from './types';

// Kamera menyelam ke dalam otak, di tengahnya ada inti merah berdenyut.
export const S16: React.FC<SceneProps> = ({b}) => {
  const f = useCurrentFrame();
  const b1 = b[0] ?? 27, b2 = b[1] ?? 68;
  if (f < b1) {
    const z = easeIn(f, 0, b1, 1, 5);
    return (
      <Stage bg={{top: C.plum, bottom: C.base0, glow: C.rose, glowOp: 0.4}} particles={{n: 20, color: C.rose, color2: C.coral, opacity: 0.35}}
        cam={{x: 540 + 22 * 1.7 * ease(f, 0, b1), y: 960 + 34 * 1.7 * ease(f, 0, b1), s: z}}>
        <Brain x={540} y={960} s={1.7} pfc={0.5} mid={0.9} />
      </Stage>
    );
  }
  const k = f - b1;
  const flash = Math.max(0, 1 - k / 6);
  const coreIn = pop(f, b2 - 4, 10);
  return (
    <Stage bg={{top: C.plum, bottom: '#24101C', glow: C.red1, glowOp: 0.3 + coreIn * 0.3}} particles={{n: 30, color: C.rose, color2: C.red2, opacity: 0.4, speed: 2}}
      flash={flash * 0.5} flashColor={C.rose}>
      {/* lorong jaringan otak */}
      {Array.from({length: 7}).map((_, i) => {
        const u = ((k * 0.025 + i / 7) % 1);
        const sc = 0.15 + u * u * 3.2;
        return (
          <g key={i} transform={`translate(540,960) scale(${sc}) rotate(${i * 25 + k})`} opacity={Math.min(1, (1 - u) * 2.5) * (1 - coreIn * 0.5)}>
            <path d="M -300 0 C -300 -120 -200 -160 -100 -250 C 0 -320 120 -260 200 -200 C 300 -120 320 0 280 100 C 240 220 100 300 0 280 C -120 270 -260 180 -300 0 Z"
              fill="none" stroke={i % 2 ? C.rose : C.coral} strokeWidth={34} opacity={0.75} />
          </g>
        );
      })}
      <g opacity={coreIn}>
        {[0, 1, 2].map((i) => {
          const u = ((f - b2) * 0.03 + i / 3) % 1;
          return <circle key={i} cx={540} cy={960} r={150 + u * 400} fill="none" stroke={C.red2} strokeWidth={8} opacity={(1 - u) * 0.6} />;
        })}
        <MidCore s={1.6 * coreIn} />
      </g>
    </Stage>
  );
};
