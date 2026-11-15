import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {IllProps, Glow, Spark, ramp, smooth} from './common';

const NODES = [[-150, -60], [-90, -110], [-10, -90], [70, -110], [140, -40], [90, 30], [10, 10], [-80, 30]];
// #45 otak dengan saraf-saraf nyambung lagi (garis emas/teal), retakan menyatu
export const RewiredBrain: React.FC<IllProps> = ({t}) => {
  const heal = smooth(ramp(t, 10, 60));
  return (
    <g transform="scale(0.78)">
      <defs><Glow id="rwg" sd={20} /></defs>
      <ellipse rx={230} ry={170} fill={C.gold} opacity={0.2 + heal * 0.2} filter="url(#rwg)" />
      <Brain pfc={0.4 + heal * 0.6} mid={0.25} crack={1} heal={heal} />
      {NODES.slice(0, -1).map((n, i) => {
        const m = NODES[i + 1], on = smooth(ramp(t, 8 + i * 7, 16 + i * 7));
        return (
          <g key={i}>
            <line x1={n[0]} y1={n[1]} x2={n[0] + (m[0] - n[0]) * on} y2={n[1] + (m[1] - n[1]) * on} stroke={i % 2 ? C.gold : C.mint} strokeWidth={7} strokeLinecap="round" />
            {on >= 1 && t < 26 + i * 7 && <Spark x={m[0]} y={m[1]} s={0.6} c={C.cream} />}
          </g>
        );
      })}
      {NODES.map((n, i) => <circle key={i} cx={n[0]} cy={n[1]} r={10} fill={ramp(t, 8 + (i - 1) * 7, 16 + (i - 1) * 7) >= 1 || i === 0 ? C.gold : '#7A6E72'} />)}
    </g>
  );
};
