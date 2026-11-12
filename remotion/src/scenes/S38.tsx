import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {ChainLink, Floor, Sparkle} from '../components/Props';
import {SceneProps} from './types';

// Rantai yang melilit karakter putus, karakter happy, partikel emas (chain break).
const LINES = [
  {a: [250, 1020], b: [830, 1380]},
  {a: [830, 1020], b: [250, 1380]},
  {a: [220, 1240], b: [860, 1240]},
];

export const S38: React.FC<SceneProps> = ({hit, dur}) => {
  const f = useCurrentFrame();
  const broke = f >= hit;
  const k = Math.max(0, f - hit);
  const warm = ease(f, hit, hit + 20);
  return (
    <Stage bg={{top: '#7A3B4A', bottom: '#2E5E5A', glow: C.gold, glowY: 1000, glowOp: 0.3 + warm * 0.35}} particles={{n: 34, color: C.gold, color2: C.mint, opacity: 0.55}}
      cam={{s: ease(f, hit, dur, 1.12, 1), y: 1100}} flash={broke ? Math.max(0, 0.5 - k / 10) : 0} flashColor="#FFE9A8">
      <Floor y={1640} color="#24434A" glow={C.teal} />
      <Character x={540} y={1640} scale={1.25} pose={[[0, 'standing_relaxed'], [hit, 'arms_up']]}
        expression={[[0, 'sad'], [hit, 'happy']]} id="s38" />
      {LINES.map((ln, li) => {
        const n = 13;
        return Array.from({length: n}).map((_, i) => {
          const t = i / (n - 1);
          const x = ln.a[0] + (ln.b[0] - ln.a[0]) * t;
          const y = ln.a[1] + (ln.b[1] - ln.a[1]) * t;
          const ang = (Math.atan2(ln.b[1] - ln.a[1], ln.b[0] - ln.a[0]) * 180) / Math.PI;
          const vx = (x - 540) * 0.08 + (rand(li * 20 + i) - 0.5) * 30;
          const vy = (y - 1200) * 0.05 - 14 - rand(li * 7 + i) * 10;
          const px = x + vx * k;
          const py = y + vy * k + 0.9 * k * k;
          const rot = ang + (i % 2 ? 90 : 0) + k * (rand(i + li) - 0.5) * 40;
          const op = broke ? Math.max(0, 1 - k / 26) : 1;
          // mata rantai selang-seling: menghadap depan (cincin) & dari samping (batang)
          return i % 2 ? (
            <g key={`${li}-${i}`} transform={`translate(${px},${py}) rotate(${rot - 90})`} opacity={op}>
              <rect x={-44} y={-9} width={88} height={18} rx={9} fill="#8C7E8A" />
              <rect x={-38} y={-6} width={50} height={5} rx={2.5} fill="#FFFFFF" opacity={0.3} />
            </g>
          ) : (
            <ChainLink key={`${li}-${i}`} x={px} y={py} r={rot} w={84} h={46} sw={13} color="#A39AA6" opacity={op} />
          );
        });
      })}
      {broke && Array.from({length: 22}).map((_, i) => {
        const a = rand(i * 3) * Math.PI * 2;
        const sp = 8 + rand(i) * 16;
        return <Sparkle key={i} x={540 + Math.cos(a) * sp * k} y={1150 + Math.sin(a) * sp * k + 0.3 * k * k} s={0.5 + rand(i + 9) * 0.6}
          color={i % 3 ? C.gold : C.mint} opacity={Math.max(0, 1 - k / 40)} />;
      })}
    </Stage>
  );
};
