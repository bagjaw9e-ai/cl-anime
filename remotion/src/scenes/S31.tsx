import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, easeIn, easeOut} from '../anim';
import {Stage} from '../components/Stage';
import {Character, handWorld} from '../components/Character';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {Floor, Puff} from '../components/Props';
import {SceneProps} from './types';

// Karakter marah, asap dari kepala, tali kekang putus.
export const S31: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 50;
  const X = 330, Y = 1660, S = 1.2;
  const h1 = handWorld('reins', -1, X, Y, S);
  const h2 = handWorld('reins', 1, X, Y, S);
  const snapped = f >= beat;
  const k = f - beat;
  const run = easeIn(f, beat + 2, dur, 0, 700);
  const mx = 820 + run + (snapped ? 0 : Math.sin(f * 0.4) * 20);
  const my = 1380 - Math.abs(Math.sin(f * 0.35)) * 60;
  const tug = snapped ? 0 : Math.sin(f * 0.4) * 10;
  const reinTo = {x: mx - 90, y: my - 20};
  const rein = (h: {x: number; y: number}, i: number) => {
    if (!snapped) {
      const midx = (h.x + reinTo.x) / 2, midy = (h.y + reinTo.y) / 2 + 30 + tug;
      return <path key={i} d={`M ${h.x} ${h.y} Q ${midx} ${midy} ${reinTo.x} ${reinTo.y + i * 12}`} stroke={C.amber} strokeWidth={12} fill="none" strokeLinecap="round" />;
    }
    const rec = easeOut(f, beat, beat + 8);
    const midx = (h.x + reinTo.x) / 2, midy = (h.y + reinTo.y) / 2;
    return (
      <g key={i}>
        <path d={`M ${h.x} ${h.y} Q ${h.x + 60} ${h.y + 80 * rec} ${midx - 40 * rec} ${midy + 160 * rec}`} stroke={C.amber} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={`M ${reinTo.x} ${reinTo.y + i * 12} Q ${reinTo.x - 40} ${reinTo.y + 100 * rec} ${midx + 50 * rec} ${midy + 180 * rec}`} stroke={C.amber} strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.red1, glowY: 1000, glowOp: 0.45}} particles={{n: 14, color: C.red2, color2: C.cream, opacity: 0.3}}
      cam={{s: ease(f, 0, dur, 1, 1.06)}}>
      <Floor y={Y} glow={C.red2} />
      <MidbrainMascot x={mx} y={my} s={1} mood="buff" buff={1} />
      <Character x={X} y={Y} scale={S} pose={snapped ? [[0, 'reins'], [beat, 'shaking_head']] : 'reins'} expression="angry" id="s31" lookAt={{x: 1, y: 0}} />
      {[h1, h2].map(rein)}
      {snapped && k < 8 && <circle cx={(h1.x + reinTo.x) / 2} cy={(h1.y + reinTo.y) / 2} r={20 + k * 12} fill="none" stroke={C.gold} strokeWidth={8} opacity={1 - k / 8} />}
      {/* asap dari kepala */}
      {[0, 1, 2, 3].map((i) => {
        const u = ((f * 0.035 + i / 4) % 1);
        return <Puff key={i} x={X + (i % 2 ? 60 : -60) + Math.sin(u * 6) * 20} y={1000 - u * 380} s={0.6 + u * 0.8} color={i % 2 ? C.cream : C.rose} opacity={(1 - u) * 0.85} />;
      })}
    </Stage>
  );
};
