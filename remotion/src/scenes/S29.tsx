import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Stage} from '../components/Stage';
import {Character, handWorld, PoseName} from '../components/Character';
import {PhoneBody} from '../components/Phone';
import {Floor} from '../components/Props';
import {SceneProps} from './types';

// Karakter geleng kepala, sedih, tapi tangannya ketarik tali boneka dari HP.
export const S29: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const X = 540, Y = 1680, S = 1.2;
  const seq: Array<[number, PoseName]> = [[0, 'puppet'], [10, 'puppet2'], [20, 'puppet'], [30, 'puppet2'], [40, 'puppet']];
  const cur = seq.reduce((a, s) => (f >= s[0] ? s[1] : a), 'puppet' as PoseName);
  const hR = handWorld(cur, -1, X, Y, S);
  const hL = handWorld(cur, 1, X, Y, S);
  const sway = Math.sin(f * 0.3) * 30;
  const bar = {x: 540 + sway, y: 470};
  return (
    <Stage bg={{top: C.plum, bottom: C.base0, glow: C.red1, glowY: 520, glowOp: 0.45}} particles={{n: 14, color: C.rose, color2: C.cream, opacity: 0.3}}>
      <Floor y={Y} glow={C.red1} />
      <g transform={`translate(${bar.x},${bar.y - 120}) rotate(${sway * 0.2})`}>
        <PhoneBody w={130} h={240} glow={1} />
      </g>
      <g transform={`translate(${bar.x},${bar.y + 20}) rotate(${sway * 0.25})`}>
        <rect x={-230} y={-14} width={460} height={28} rx={14} fill={C.amber} />
        <rect x={-14} y={-90} width={28} height={130} rx={14} fill={C.amber} />
      </g>
      <Character x={X} y={Y} scale={S} pose={seq} expression="sad" id="s29" />
      {[[bar.x - 220, hR], [bar.x + 220, hL]].map(([sx, h], i) => {
        const hh = h as {x: number; y: number};
        return <line key={i} x1={sx as number} y1={bar.y + 20} x2={hh.x} y2={hh.y} stroke={C.cream} strokeWidth={4} opacity={0.85} />;
      })}
    </Stage>
  );
};
