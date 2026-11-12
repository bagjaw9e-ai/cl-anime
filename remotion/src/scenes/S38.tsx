import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {ChainLink, Sparkle} from '../components/Props';
import {NeonLogo} from '../components/NeonLogo';
import {CTA_BG, CTA_CHAR} from './S37';
import {SceneProps} from './types';

// Rantai yang melilit karakter putus; logo pulse lebih terang sekali + partikel emas/merah keluar dari logo.
const LINES = [
  {a: [270, 1080], b: [810, 1420]},
  {a: [810, 1080], b: [270, 1420]},
  {a: [240, 1290], b: [840, 1290]},
];
const LOGO = {x: 540, y: 470};

export const S38: React.FC<SceneProps> = ({hit}) => {
  const f = useCurrentFrame();
  const broke = f >= hit;
  const k = Math.max(0, f - hit);
  const boost = broke ? Math.max(0, 0.9 * Math.exp(-k / 7)) : 0;
  const warm = ease(f, hit, hit + 20);
  return (
    <Stage bg={{top: CTA_BG.top, bottom: CTA_BG.bottom, glow: C.red2, glowY: 520, glowR: 800, glowOp: 0.36 + boost * 0.3 + warm * 0.05}}
      particles={{n: 22, color: C.red2, color2: C.gold, opacity: 0.35}}
      flash={broke ? Math.max(0, 0.35 - k / 12) : 0} flashColor="#FFD6C8"
      over={<NeonLogo cy={LOGO.y} level={1} boost={boost} />}>
      <rect x={-200} y={CTA_CHAR.y} width={1480} height={400} fill="#1A1416" />
      <ellipse cx={540} cy={CTA_CHAR.y + 10} rx={460} ry={34} fill={C.red2} opacity={0.38 + boost * 0.3} />
      <Character x={CTA_CHAR.x} y={CTA_CHAR.y} scale={CTA_CHAR.s} pose={[[0, 'standing_relaxed'], [hit, 'arms_up']]}
        expression={[[0, 'determined'], [hit, 'happy']]} rim id="s38" />
      {LINES.map((ln, li) => {
        const n = 13;
        return Array.from({length: n}).map((_, i) => {
          const t = i / (n - 1);
          const x = ln.a[0] + (ln.b[0] - ln.a[0]) * t;
          const y = ln.a[1] + (ln.b[1] - ln.a[1]) * t;
          const ang = (Math.atan2(ln.b[1] - ln.a[1], ln.b[0] - ln.a[0]) * 180) / Math.PI;
          const vx = (x - 540) * 0.08 + (rand(li * 20 + i) - 0.5) * 30;
          const vy = (y - 1250) * 0.05 - 14 - rand(li * 7 + i) * 10;
          const px = x + vx * k;
          const py = y + vy * k + 0.9 * k * k;
          const rot = ang + k * (rand(i + li) - 0.5) * 40;
          const op = broke ? Math.max(0, 1 - k / 26) : 1;
          // mata rantai selang-seling: menghadap depan (cincin) & dari samping (batang)
          return i % 2 ? (
            <g key={`${li}-${i}`} transform={`translate(${px},${py}) rotate(${rot})`} opacity={op}>
              <rect x={-44} y={-9} width={88} height={18} rx={9} fill="#8C7E8A" />
              <rect x={-38} y={-6} width={50} height={5} rx={2.5} fill="#FFFFFF" opacity={0.3} />
            </g>
          ) : (
            <ChainLink key={`${li}-${i}`} x={px} y={py} r={rot} w={84} h={46} sw={13} color="#A39AA6" opacity={op} />
          );
        });
      })}
      {/* partikel emas/merah keluar dari logo saat rantai putus */}
      {broke && Array.from({length: 30}).map((_, i) => {
        const a = rand(i * 3.3) * Math.PI * 2;
        const sp = 9 + rand(i) * 18;
        const x = LOGO.x + Math.cos(a) * (60 + sp * k) * 1.4;
        const y = LOGO.y + Math.sin(a) * (40 + sp * k) * 0.9 + 0.25 * k * k;
        const op = Math.max(0, 1 - k / 45);
        return i % 3 === 0 ? (
          <Sparkle key={i} x={x} y={y} s={0.45 + rand(i + 9) * 0.5} color={C.gold} opacity={op} />
        ) : (
          <circle key={i} cx={x} cy={y} r={4 + rand(i + 2) * 6} fill={i % 2 ? C.red2 : C.gold} opacity={op} />
        );
      })}
    </Stage>
  );
};
