import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR, P, rand} from '../theme';
import {useSid} from './Phone';
import {Character, CharacterProps} from './Character';
import {FemaleCharacter, FemaleProps} from './FemaleCharacter';

// Halo radial lembut (gradien, bukan blur filter → ringan dirender)
export const Halo: React.FC<{x?: number; y?: number; rx: number; ry?: number; color?: string; op?: number; core?: number}> = ({
  x = 0, y = 0, rx, ry, color = P.amber, op = 0.5, core = 0,
}) => {
  const id = useSid('halo');
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={op} />
          <stop offset={Math.max(0.05, core)} stopColor={color} stopOpacity={op * 0.85} />
          <stop offset="0.55" stopColor={color} stopOpacity={op * 0.28} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${id})`} />
    </g>
  );
};

// Partikel cahaya kecil naik dari sebuah titik/area (ala ref.mp4: 3-6 titik amber naik diagonal lalu pudar)
export const Rise: React.FC<{x?: number; y?: number; w?: number; h?: number; n?: number; color?: string; seed?: number; op?: number; t?: number; drift?: number; size?: number}> = ({
  x = 0, y = 0, w = 120, h = 260, n = 8, color = P.yellow, seed = 1, op = 1, t, drift = 30, size = 1,
}) => {
  const f = useCurrentFrame();
  const tt = t ?? f;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const per = 40 + rand(seed + i * 3.1) * 30;
        const ph = ((tt + rand(seed + i) * per) % per) / per;
        const px = x + (rand(seed + i * 5.3) - 0.5) * w + ph * drift * (rand(seed + i * 2.2) - 0.3) * 2;
        const py = y - ph * h;
        const r = (2 + rand(seed + i * 9.1) * 3) * size;
        const a = Math.sin(ph * Math.PI) * op;
        return (
          <g key={i} opacity={a}>
            <circle cx={px} cy={py} r={r * 2.6} fill={color} opacity={0.25} />
            <circle cx={px} cy={py} r={r} fill={i % 3 === 0 ? P.warm : color} />
          </g>
        );
      })}
    </g>
  );
};

// Pantulan di lantai: isi digambar normal + dicerminkan terhadap garis lantai (redup, memudar ke bawah).
export const Reflect: React.FC<{children: React.ReactNode; floor?: number; op?: number; depth?: number}> = ({
  children, floor = FLOOR, op = 0.2, depth = 320,
}) => {
  const id = useSid('rf');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1={floor} x2="0" y2={floor + depth} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-3000} y={floor} width={7000} height={depth + 10}>
          <rect x={-3000} y={floor} width={7000} height={depth} fill={`url(#${id}g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}m)`} opacity={op}>
        <use href={`#${id}c`} transform={`translate(0,${2 * floor}) scale(1,-1)`} />
      </g>
      <g id={`${id}c`}>{children}</g>
    </g>
  );
};

// Karakter "terang": backlight halo hangat di belakang + rim light putih-amber (filter di Character) + bayangan kontak.
export const LitCharacter: React.FC<CharacterProps & {halo?: number; haloColor?: string}> = ({halo = 1, haloColor = P.amber, ...props}) => {
  const x = props.x ?? 540, y = props.y ?? FLOOR, s = props.scale ?? 1;
  return (
    <g>
      <Halo x={x} y={y - 380 * s} rx={330 * s} ry={470 * s} color={haloColor} op={0.3 * halo} />
      <Halo x={x} y={y - 470 * s} rx={170 * s} ry={170 * s} color={P.warm} op={0.16 * halo} />
      <Character rim {...props} />
    </g>
  );
};

// Wanita "terang": backlight halo + rim light (filter di FemaleCharacter).
export const LitFemale: React.FC<FemaleProps & {halo?: number; haloColor?: string}> = ({halo = 1, haloColor = P.amber, ...props}) => {
  const x = props.x ?? 540, y = props.y ?? FLOOR, s = props.scale ?? 1;
  return (
    <g>
      <Halo x={x} y={y - 340 * s} rx={300 * s} ry={430 * s} color={haloColor} op={0.26 * halo} />
      <FemaleCharacter rim {...props} />
    </g>
  );
};
