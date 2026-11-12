import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, easeOut} from '../anim';
import {Stage} from '../components/Stage';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {Floor, Star} from '../components/Props';
import {SceneProps} from './types';

// Maskot jalan lalu kejedot tiang, bintang-bintang muter.
export const S20: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const BONK = 34;
  const walkX = ease(f, 0, BONK, 160, 600, (t) => t);
  const back = easeOut(f, BONK, BONK + 10, 0, -70);
  const x = f < BONK ? walkX : 600 + back;
  const sq = f >= BONK ? Math.max(0, 1 - (f - BONK) / 10) * Math.cos((f - BONK) * 0.8) : 0;
  const dizzy = f >= BONK;
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.coral, glowY: 1100, glowOp: 0.25}} particles={{n: 16, color: C.rose, color2: C.gold, opacity: 0.3}}
      cam={{x: 560, y: 1080, s: 1.05}}>
      <Floor y={1460} glow={C.coral} />
      {/* tiang lampu */}
      <rect x={720} y={420} width={48} height={1050} rx={20} fill={C.navyLight} />
      <rect x={700} y={1430} width={88} height={40} rx={12} fill={C.navy} />
      <path d="M 744 430 Q 744 360 840 360 L 880 360" stroke={C.navyLight} strokeWidth={30} fill="none" strokeLinecap="round" />
      <ellipse cx={890} cy={384} rx={50} ry={26} fill={C.gold} />
      <path d="M 860 400 L 790 640 L 990 640 L 920 400 Z" fill={C.gold} opacity={0.08} />
      <MidbrainMascot x={x} y={1350} s={1.25} walk={f < BONK ? 1 : 0} squash={-sq * 0.8} mood={dizzy ? 'dizzy' : 'derp'} />
      {dizzy && [0, 1, 2, 3].map((i) => {
        const a = (f - BONK) * 0.25 + (i / 4) * Math.PI * 2;
        return <Star key={i} x={x + Math.cos(a) * 140} y={1170 + Math.sin(a) * 40} s={0.9} color={i % 2 ? C.gold : C.cream} />;
      })}
      {f >= BONK && f < BONK + 8 && (
        <g transform="translate(700,1250)">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.6 + 2.2) * 120} y2={Math.sin(i * 0.6 + 2.2) * 120} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
          ))}
        </g>
      )}
    </Stage>
  );
};
