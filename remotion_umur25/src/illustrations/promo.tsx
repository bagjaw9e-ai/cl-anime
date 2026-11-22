// Semua ilustrasi video promo. Gaya ref.mp4: objek utama MENYALA (amber/kuning/putih hangat + halo),
// elemen pendukung abu-abu redup. Merah neon hanya untuk HP adiksi (redup) & PMO SAVIOR/CTA.
// Konvensi: (0,0) = titik dasar objek di lantai (kecuali disebut lain), t = frame lokal.
import React from 'react';
import {staticFile} from 'remotion';
import {P, clamp, lerp, mix, rand} from '../theme';
import {PhoneBody, useSid} from '../components/Phone';
import {Halo, Rise} from '../components/Lit';
import {ChainLine, Link} from '../components/Chain';

export const ramp = (t: number, a: number, b: number) => clamp((t - a) / Math.max(1e-6, b - a));
export const smooth = (v: number) => v * v * (3 - 2 * v);
const easeOutBack = (v: number) => { const c = 1.7, x = clamp(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const LOGO_AR = 339 / 498;

/* ---------------- logo PMO SAVIOR (PNG sudah di-key: hitam -> transparan, bentuk/warna asli) ---------------- */
export const Logo: React.FC<{w: number; x?: number; y?: number; op?: number; glow?: number}> = ({w, x = 0, y = 0, op = 1, glow = 0}) => {
  const h = w * LOGO_AR;
  return (
    <g opacity={op}>
      {glow > 0 && <Halo x={x} y={y} rx={w * 0.62} ry={h * 0.62} color={P.red} op={0.28 * glow} />}
      <image href={staticFile('pmo_savior.png')} x={x - w / 2} y={y - h / 2} width={w} height={h} />
    </g>
  );
};

/* ================= BEAT 1: rantai + HP ================= */
// HP adiksi berdiri di lantai, layar merah redup (tanpa konten)
export const AddictPhone: React.FC<{glow?: number; s?: number}> = ({glow = 0.6, s = 1}) => (
  <g transform={`scale(${s})`}>
    <Halo y={-120} rx={170} ry={190} color={P.dimRed} op={0.35 * glow} />
    <g transform="translate(0,-118)"><PhoneBody w={124} h={232} glow={glow} color={P.dimRed} /></g>
  </g>
);

// potongan rantai putus yang jatuh ke lantai (gravitasi + putar + pantul kecil)
export const FallingChain: React.FC<{t: number; t0: number; x: number; y: number; len?: number; ang?: number; floorY: number; dir?: number}> = ({
  t, t0, x, y, len = 90, ang = 0, floorY, dir = 1,
}) => {
  const k = Math.max(0, t - t0);
  const g = 1.6;
  let yy = y + 0.5 * g * k * k;
  let rot = ang + dir * k * 9;
  const land = Math.sqrt((2 * (floorY - y - 8)) / g);
  if (k > land) {
    const kk = k - land;
    yy = floorY - 8 - Math.max(0, Math.sin(kk * 0.35) * 18 * Math.exp(-kk * 0.25));
    rot = ang + dir * land * 9 + dir * Math.min(kk, 6) * 3;
    rot = (Math.round(rot / 180) * 180) * clamp(kk / 8) + rot * (1 - clamp(kk / 8));
  }
  const xx = x + dir * k * 2.2;
  return (
    <g transform={`translate(${xx},${yy}) rotate(${rot})`}>
      <ChainLine x1={-len / 2} y1={0} x2={len / 2} y2={0} sag={6} />
    </g>
  );
};

// kilatan saat mata rantai putus
export const SnapFlash: React.FC<{t: number; t0: number; x: number; y: number}> = ({t, t0, x, y}) => {
  const k = t - t0;
  if (k < 0 || k > 12) return null;
  const a = 1 - k / 12;
  return (
    <g transform={`translate(${x},${y})`} opacity={a}>
      <Halo rx={70 + k * 6} color={P.warm} op={0.8} />
      {Array.from({length: 7}).map((_, i) => {
        const an = (i / 7) * Math.PI * 2 + 0.3;
        const r0 = 10 + k * 5, r1 = 26 + k * 9;
        return <line key={i} x1={Math.cos(an) * r0} y1={Math.sin(an) * r0} x2={Math.cos(an) * r1} y2={Math.sin(an) * r1} stroke={P.yellow} strokeWidth={4} strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ================= BEAT 2: otak retak + plester ================= */
const CEREBRUM =
  'M -205 18 C -220 -62 -162 -146 -60 -156 C 22 -170 124 -154 184 -92 C 230 -46 226 30 180 62 ' +
  'C 154 80 124 82 98 80 C 72 98 30 96 8 82 C -22 108 -92 104 -134 84 C -178 72 -200 50 -205 18 Z';
const CEREBELLUM = 'M 96 78 C 110 70 170 62 196 84 C 214 104 196 132 158 134 C 122 136 98 116 96 78 Z';
const STEM = 'M 60 84 C 70 120 74 150 66 190 L 100 190 C 104 150 104 118 110 86 Z';
const GYRI = [
  'M -170 -40 C -150 -70 -120 -60 -110 -90 C -100 -115 -70 -110 -60 -130',
  'M -185 10 C -160 0 -150 -30 -125 -25 C -100 -20 -100 -50 -80 -60',
  'M -150 60 C -130 40 -100 55 -90 30 C -80 5 -50 20 -40 -5',
  'M -30 -140 C -20 -110 10 -120 15 -90 C 20 -60 -10 -50 0 -20',
  'M 40 -150 C 50 -120 80 -125 75 -95 C 70 -70 100 -60 110 -40',
  'M 120 -130 C 120 -100 150 -100 160 -70 C 170 -45 150 -20 175 0',
  'M 30 -60 C 55 -50 70 -20 100 -20 C 130 -20 140 20 165 30',
  'M -60 70 C -40 50 -10 60 0 40 C 10 20 40 30 55 10',
  'M 60 60 C 80 45 100 55 120 40',
  'M -120 -110 C -100 -130 -80 -140 -50 -140',
  'M -100 30 C -80 10 -60 -20 -40 -40 C -20 -60 0 -70 20 -100',
];
const CRACKS = [
  'M -40 -158 L -28 -112 L -56 -72 L -34 -30 L -62 10 L -40 58 L -56 98',
  'M -34 -30 L 10 -42 L 42 -12 L 92 -22 L 128 -6',
  'M -62 10 L -112 0 L -152 32',
  'M 122 -128 L 100 -80 L 132 -40',
];
// crack: retakan tampak; heal: retakan berubah amber menyala lalu menutup; peel: plester terlepas (0..1); lit: kecerahan otak
export const BrainHeal: React.FC<{t: number; crack?: number; heal?: number; peel?: number; lit?: number; s?: number}> = ({
  t, crack = 1, heal = 0, peel = 0, lit = 1, s = 1,
}) => {
  const id = useSid('bh');
  const top = mix('#F6E7CF', '#FFF4E0', heal), bot = mix('#9C8466', '#F2A43C', heal);
  const gy = mix('#7E6A55', '#C9782A', heal);
  const glowCrack = smooth(ramp(heal, 0.05, 0.5));
  const close = smooth(ramp(heal, 0.5, 1));
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={7} /></filter>
        <clipPath id={`${id}c`}><path d={CEREBRUM} /></clipPath>
      </defs>
      <Halo y={-10} rx={360} ry={300} color={P.amber} op={(0.18 + 0.32 * heal) * lit} />
      <g opacity={0.55 + 0.45 * lit}>
        <path d={STEM} fill={mix('#6E5A48', '#C88A3E', heal)} />
        <path d={CEREBELLUM} fill={mix('#8A735C', '#E09A40', heal)} />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${110 + i * 4} ${88 + i * 14} C 140 ${80 + i * 14} 170 ${86 + i * 14} 196 ${96 + i * 13}`} stroke={gy} strokeWidth={4} fill="none" opacity={0.7} />)}
        <path d={CEREBRUM} fill={`url(#${id}f)`} />
        <g clipPath={`url(#${id}c)`}>
          {GYRI.map((d, i) => <path key={i} d={d} stroke={gy} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.55} />)}
          {/* kilau atas */}
          <ellipse cx={-30} cy={-120} rx={150} ry={40} fill="#FFFFFF" opacity={0.18 + 0.12 * heal} />
          {/* retakan: gelap → amber menyala → menutup */}
          <g opacity={crack * (1 - close)}>
            {CRACKS.map((d, i) => <path key={i} d={d} stroke="#2A1A10" strokeWidth={9 * (1 - close * 0.8)} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={1 - glowCrack} />)}
            {CRACKS.map((d, i) => <path key={'g' + i} d={d} stroke={P.yellow} strokeWidth={14} fill="none" strokeLinejoin="round" filter={`url(#${id}b)`} opacity={glowCrack} />)}
            {CRACKS.map((d, i) => <path key={'c' + i} d={d} stroke={P.warm} strokeWidth={5 * (1 - close * 0.7)} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={glowCrack} />)}
          </g>
        </g>
        <path d={CEREBRUM} fill="none" stroke={mix('#5A4A3A', '#FFD9A0', heal)} strokeWidth={4} opacity={0.6} />
      </g>
      {/* plester menutup retakan utama, lalu terkelupas & terbang */}
      {peel < 1 && (
        <g transform={`translate(${-40 + peel * 160},${-70 - peel * 220}) rotate(${-38 + peel * 120}) scale(${1 - peel * 0.3})`} opacity={1 - smooth(ramp(peel, 0.55, 1))}>
          <g transform={`rotate(${-smooth(ramp(peel, 0, 0.35)) * 25} -70 0)`}>
            <rect x={-78} y={-24} width={156} height={48} rx={22} fill="#E3C49B" />
            <rect x={-26} y={-20} width={52} height={40} rx={8} fill="#CDA77A" />
            {[-58, -46, 46, 58].map((x) => [-8, 8].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill="#B48D62" />))}
            <rect x={-78} y={-24} width={156} height={10} rx={5} fill="#FFFFFF" opacity={0.25} />
          </g>
        </g>
      )}
      {heal > 0.3 && <Rise y={-60} w={320} h={300} n={10} seed={21} op={smooth(ramp(heal, 0.3, 0.7))} t={t} />}
      {/* kilau kristal saat menyatu */}
      {[[-40, -110], [60, -30], [-90, 20], [110, -90]].map(([x, y], i) => {
        const k = ramp(heal, 0.55 + i * 0.08, 0.75 + i * 0.08);
        const a = Math.sin(k * Math.PI);
        return a > 0.01 ? (
          <path key={i} transform={`translate(${x},${y}) scale(${0.6 + a * 0.8})`} opacity={a}
            d="M 0 -16 C 2 -4 4 -2 16 0 C 4 2 2 4 0 16 C -2 4 -4 2 -16 0 C -4 -2 -2 -4 0 -16 Z" fill={P.warm} />
        ) : null;
      })}
    </g>
  );
};

/* ================= BEAT 3: lab (papan klip, tabung reaksi, mikroskop) ================= */
// on: 0 = abu-abu redup, 1 = menyala
export const Clipboard: React.FC<{on: number; t: number}> = ({on, t}) => {
  const paper = mix('#6A707E', P.warm, on);
  return (
    <g>
      <Halo y={-170} rx={190} ry={210} color={P.yellow} op={0.42 * on} />
      <g transform={`translate(0,-170) rotate(-6)`}>
        <rect x={-105} y={-140} width={210} height={280} rx={16} fill={mix('#3A3F4A', '#7A5A3A', on)} />
        <rect x={-88} y={-118} width={176} height={244} rx={6} fill={paper} />
        <rect x={-40} y={-156} width={80} height={36} rx={10} fill={mix('#5A6170', '#C9CED8', on)} />
        <rect x={-22} y={-150} width={44} height={10} rx={5} fill="#2A2E36" />
        {[0, 1, 2, 3].map((i) => {
          const k = smooth(ramp(t, 6 + i * 4, 12 + i * 4)) * on;
          return (
            <g key={i} transform={`translate(-66,${-74 + i * 48})`}>
              <rect x={0} y={-12} width={24} height={24} rx={5} fill="none" stroke={mix('#4A505C', '#B77A2A', on)} strokeWidth={4} />
              <path d="M 4 0 L 10 7 L 22 -8" stroke="#E08A1E" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={34} strokeDashoffset={34 * (1 - k)} />
              <rect x={38} y={-6} width={86 - (i % 2) * 22} height={10} rx={5} fill={mix('#4A505C', '#D9B98F', on)} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

export const TestTubes: React.FC<{on: number; t: number}> = ({on, t}) => {
  const liq = [P.amber, P.yellow, '#FFC870'];
  return (
    <g>
      <Halo y={-150} rx={200} ry={190} color={P.amber} op={0.45 * on} />
      {/* rak */}
      <rect x={-130} y={-120} width={260} height={18} rx={6} fill={mix('#3A3F4A', '#5C4632', on)} />
      <rect x={-130} y={-22} width={260} height={22} rx={6} fill={mix('#3A3F4A', '#5C4632', on)} />
      <rect x={-124} y={-120} width={12} height={120} fill={mix('#30343C', '#4A3828', on)} />
      <rect x={112} y={-120} width={12} height={120} fill={mix('#30343C', '#4A3828', on)} />
      {[-70, 0, 70].map((x, i) => {
        const lv = 0.55 + i * 0.12;
        const h = 190;
        return (
          <g key={i} transform={`translate(${x},${-h + 10})`}>
            <rect x={-22} y={0} width={44} height={h} rx={22} fill="#C9D2E0" opacity={0.18 + 0.1 * on} />
            <path d={`M -18 ${h * (1 - lv)} L 18 ${h * (1 - lv)} L 18 ${h - 22} A 18 18 0 0 1 -18 ${h - 22} Z`} fill={mix('#5A6170', liq[i], on)} />
            <rect x={-18} y={h * (1 - lv) - 3} width={36} height={6} rx={3} fill={mix('#6A7080', P.warm, on)} opacity={0.8} />
            {on > 0.3 && [0, 1, 2].map((b) => {
              const ph = ((t * 0.05 + b * 0.33 + i * 0.2) % 1);
              return <circle key={b} cx={Math.sin(ph * 9 + b) * 6} cy={h - 26 - ph * h * lv * 0.85} r={3 + b} fill={P.warm} opacity={on * (1 - ph) * 0.9} />;
            })}
            <rect x={-22} y={0} width={44} height={h} rx={22} fill="none" stroke={mix('#7A8090', '#FFE8C0', on)} strokeWidth={4} />
            <rect x={-12} y={14} width={6} height={h - 50} rx={3} fill="#FFFFFF" opacity={0.25 + 0.2 * on} />
          </g>
        );
      })}
      {on > 0.2 && <Rise x={0} y={-200} w={160} h={160} n={6} seed={33} op={on} t={t} size={0.8} />}
    </g>
  );
};

export const Microscope: React.FC<{on: number; t: number}> = ({on, t}) => {
  const body = mix('#4A505C', '#8A8F9C', on);
  const dark = mix('#30343C', '#565B66', on);
  return (
    <g>
      <Halo x={10} y={-120} rx={150} ry={130} color={P.yellow} op={0.55 * on} />
      {/* kaki */}
      <path d="M -110 0 L 110 0 L 90 -36 L -90 -36 Z" fill={dark} />
      {/* lengan */}
      <path d="M -40 -36 C -110 -90 -110 -200 -30 -250 L 0 -224 C -60 -190 -60 -110 -10 -70 Z" fill={body} />
      {/* meja preparat + lampu */}
      <rect x={-30} y={-112} width={150} height={16} rx={5} fill={dark} />
      <ellipse cx={45} cy={-96} rx={36} ry={8} fill={mix('#5A6170', P.warm, on)} />
      <path d="M 15 -96 L 75 -96 L 60 -150 L 30 -150 Z" fill={P.yellow} opacity={0.35 * on} />
      {/* tabung lensa */}
      <g transform="translate(45,-230) rotate(28)">
        <rect x={-22} y={-90} width={44} height={150} rx={10} fill={body} />
        <rect x={-28} y={-104} width={56} height={26} rx={8} fill={dark} />
        <rect x={-14} y={60} width={28} height={30} rx={6} fill={dark} />
        <rect x={-10} y={-84} width={8} height={130} rx={4} fill="#FFFFFF" opacity={0.18 + 0.15 * on} />
      </g>
      {/* knop */}
      <circle cx={-56} cy={-150} r={20} fill={dark} />
      <circle cx={-56} cy={-150} r={8} fill={mix('#6A7080', P.amber, on)} />
      {on > 0.2 && <Rise x={45} y={-130} w={60} h={120} n={5} seed={41} op={on} t={t} size={0.7} />}
    </g>
  );
};

/* ================= BEAT 4: jaringan neuron ================= */
const NODES: Array<[number, number, number]> = [
  [-300, 120, 1], [-170, -40, 1.2], [-290, -200, 0.9], [-40, 150, 1], [20, -150, 1.4], [-110, -300, 0.8],
  [170, 40, 1.1], [300, -170, 1], [290, 180, 0.9], [140, -320, 0.85], [-30, -10, 1.6],
];
const EDGES: Array<[number, number]> = [
  [10, 1], [10, 4], [10, 3], [10, 6], [1, 0], [1, 2], [4, 5], [4, 9], [4, 7], [6, 7], [6, 8], [3, 0], [3, 8], [2, 5], [9, 7],
];
// grow 0..1: urutan sambungan menyala dari pusat ke luar
export const NeuronNet: React.FC<{t: number; grow: number; s?: number}> = ({t, grow, s = 1}) => {
  const id = useSid('nn');
  const order = EDGES.map((_, i) => i / EDGES.length);
  const nodeOn = (n: number) => {
    if (n === 10) return smooth(ramp(grow, 0, 0.12));
    let best = 0;
    EDGES.forEach(([a, b], i) => { if (a === n || b === n) best = Math.max(best, smooth(ramp(grow, order[i] + 0.05, order[i] + 0.16))); });
    return best;
  };
  return (
    <g transform={`scale(${s})`}>
      <defs><filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter></defs>
      <Halo rx={460} ry={420} color={P.amber} op={0.22 * smooth(ramp(grow, 0, 0.6))} />
      {EDGES.map(([a, b], i) => {
        const A = NODES[a], B = NODES[b];
        const k = smooth(ramp(grow, order[i], order[i] + 0.12));
        const mx = (A[0] + B[0]) / 2 + (rand(i + 3) - 0.5) * 80, my = (A[1] + B[1]) / 2 + (rand(i + 7) - 0.5) * 80;
        const d = `M ${A[0]} ${A[1]} Q ${mx} ${my} ${B[0]} ${B[1]}`;
        const ph = ((t * 0.035 + rand(i) ) % 1);
        const pq = (u: number) => ({x: (1 - u) ** 2 * A[0] + 2 * (1 - u) * u * mx + u * u * B[0], y: (1 - u) ** 2 * A[1] + 2 * (1 - u) * u * my + u * u * B[1]});
        const pd = pq(ph);
        return (
          <g key={i}>
            <path d={d} stroke={P.gray} strokeWidth={3} fill="none" opacity={0.55} strokeDasharray="6 10" />
            <path d={d} stroke={P.amber} strokeWidth={10} fill="none" opacity={0.55 * k} filter={`url(#${id}b)`} pathLength={1} strokeDasharray={`${k} 1`} />
            <path d={d} stroke={P.warm} strokeWidth={3.5} fill="none" opacity={k} pathLength={1} strokeDasharray={`${k} 1`} strokeLinecap="round" />
            {k > 0.99 && <circle cx={pd.x} cy={pd.y} r={6} fill={P.warm} opacity={0.9} />}
          </g>
        );
      })}
      {NODES.map(([x, y, r], i) => {
        const on = nodeOn(i);
        const R = 20 * r;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {on > 0 && <Halo rx={R * 3.4} color={P.yellow} op={0.5 * on} />}
            {[0, 1, 2, 3].map((k) => {
              const an = rand(i * 9 + k) * Math.PI * 2;
              return <path key={k} d={`M 0 0 Q ${Math.cos(an + 0.4) * R * 1.4} ${Math.sin(an + 0.4) * R * 1.4} ${Math.cos(an) * R * 2} ${Math.sin(an) * R * 2}`} stroke={mix(P.gray, P.yellow, on)} strokeWidth={4} fill="none" strokeLinecap="round" />;
            })}
            <circle r={R} fill={mix('#3A404C', P.amber, on)} />
            <circle r={R * 0.55} fill={mix(P.gray, P.warm, on)} />
          </g>
        );
      })}
      <Rise y={0} w={700} h={520} n={14} seed={51} op={smooth(ramp(grow, 0.3, 0.8))} t={t} />
    </g>
  );
};

/* ================= BEAT 5: peti harta terkunci ================= */
// unlock 0..1: gembok membuka & jatuh; open 0..1: tutup terangkat, cahaya amber keluar
// part: 'back' = halo + sinar (taruh di BELAKANG karakter), 'front' = badan peti/tutup/gembok, 'all' = keduanya
export const TreasureChest: React.FC<{t: number; unlock: number; open: number; lockFall?: number; part?: 'all' | 'back' | 'front'}> = ({t, unlock, open, lockFall = 0, part = 'all'}) => {
  const id = useSid('tc');
  const W2 = 190, Hb = 190, Hl = 80;
  const wood = '#4A3426', woodL = '#6A4A34', band = '#5A6170', bandL = '#8A90A0';
  const lidSY = lerp(1, -0.55, smooth(open));
  const light = smooth(ramp(open, 0.1, 0.8));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}beam`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={P.warm} stopOpacity={0.9} />
          <stop offset="0.35" stopColor={P.yellow} stopOpacity={0.5} />
          <stop offset="1" stopColor={P.amber} stopOpacity={0} />
        </linearGradient>
      </defs>
      {part !== 'front' && <Halo y={-Hb} rx={420} ry={360} color={P.amber} op={0.55 * light} />}
      {/* sinar keluar dari celah tutup */}
      {part !== 'front' && light > 0 && (
        <g opacity={light}>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((a, i) => (
            <path key={i} d={`M ${-W2 * 0.85 + i * 20} ${-Hb} L ${W2 * 0.85 - (4 - i) * 20} ${-Hb} L ${a * 700 + 160} ${-Hb - 640} L ${a * 700 - 160} ${-Hb - 640} Z`}
              fill={`url(#${id}beam)`} opacity={0.2 + 0.08 * Math.sin(t * 0.15 + i * 1.7)} />
          ))}
        </g>
      )}
      {part !== 'back' && <g>
      {/* badan peti */}
      <rect x={-W2} y={-Hb} width={W2 * 2} height={Hb} rx={14} fill={wood} />
      {[0.33, 0.66].map((k) => <line key={k} x1={-W2 + 10} y1={-Hb * k} x2={W2 - 10} y2={-Hb * k} stroke="#3A281C" strokeWidth={4} />)}
      {[-W2 + 26, W2 - 26].map((x) => <rect key={x} x={x - 16} y={-Hb} width={32} height={Hb} fill={band} />)}
      {[-W2 + 26, W2 - 26].map((x) => <rect key={'h' + x} x={x - 12} y={-Hb} width={6} height={Hb} fill={bandL} opacity={0.6} />)}
      {/* isi menyala (terlihat saat tutup terbuka) */}
      {open > 0.02 && <rect x={-W2 + 12} y={-Hb - 14} width={W2 * 2 - 24} height={28} rx={10} fill={P.yellow} opacity={light} />}
      {open > 0.02 && <rect x={-W2 + 30} y={-Hb - 8} width={W2 * 2 - 60} height={14} rx={7} fill={P.warm} opacity={light} />}
      {/* tutup (engsel di belakang-atas). lidSY<0 = terbuka terlihat bagian dalam */}
      <g transform={`translate(0,${-Hb}) scale(1,${lidSY})`}>
        <path d={`M ${-W2} 0 L ${-W2} ${-Hl * 0.55} Q 0 ${-Hl * 1.35} ${W2} ${-Hl * 0.55} L ${W2} 0 Z`} fill={lidSY > 0 ? woodL : '#2A1C14'} />
        {lidSY > 0 && [-W2 + 26, W2 - 26].map((x) => <rect key={x} x={x - 16} y={-Hl * 0.95} width={32} height={Hl * 0.95} fill={band} />)}
        {lidSY < 0 && <path d={`M ${-W2 + 14} -6 L ${-W2 + 14} ${-Hl * 0.5} Q 0 ${-Hl * 1.2} ${W2 - 14} ${-Hl * 0.5} L ${W2 - 14} -6 Z`} fill={P.amber} opacity={0.5 * light} />}
      </g>
      {/* gembok */}
      {(() => {
        const k = lockFall;
        const ly = -Hb + 30 + k * k * (Hb - 10);
        const rot = k * 70;
        const op = 1;
        return (
          <g transform={`translate(${k * 70},${ly}) rotate(${rot})`} opacity={op}>
            <g transform={`translate(22,${-unlock * 20}) rotate(${unlock * 35}) translate(-22,0)`}>
              <path d="M -22 -12 L -22 -40 A 22 22 0 0 1 22 -40 L 22 -12" stroke={bandL} strokeWidth={10} fill="none" strokeLinecap="round" />
            </g>
            <rect x={-36} y={-16} width={72} height={60} rx={10} fill="#B58A3A" />
            <rect x={-36} y={-16} width={72} height={12} rx={6} fill="#E0B460" opacity={0.6} />
            <circle cy={10} r={8} fill="#3A2A14" />
            <rect x={-3} y={12} width={6} height={16} rx={2} fill="#3A2A14" />
          </g>
        );
      })()}
      {light > 0.2 && <Rise y={-Hb - 30} w={300} h={420} n={14} seed={61} op={light} t={t} />}
      </g>}
    </g>
  );
};

/* ================= BEAT 6: pita kusut digunting jadi lurus ================= */
// cut 0..1: 0 = kusut, setelah gunting (cut>0) pita meluruskan diri
export const TangledRibbon: React.FC<{t: number; cut: number; len?: number}> = ({t, cut, len = 620}) => {
  const id = useSid('rb');
  const k = smooth(cut);
  const N = 160;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const env = Math.sin(u * Math.PI) ** 0.6;
    const w = 2 * Math.PI * 6 * u;
    const tx = -len / 2 + len * u - 58 * Math.sin(w) * env + 18 * Math.sin(u * 37 + 1) * env;
    const ty = -50 * Math.cos(w) * env + 50 * env + 26 * Math.sin(u * 23) * env - 50 * env;
    const sx = -len / 2 + len * u, sy = Math.sin(u * 8 + t * 0.12) * 4 * k;
    pts.push(`${lerp(tx, sx, k).toFixed(1)},${lerp(ty, sy, k).toFixed(1)}`);
  }
  const d = 'M ' + pts.join(' L ');
  const bright = 0.35 + 0.65 * k;
  return (
    <g>
      <defs><filter id={`${id}b`} x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation={8} /></filter></defs>
      <Halo rx={len * 0.62} ry={170} color={P.amber} op={0.18 + 0.3 * k} />
      <path d={d} stroke={mix('#7A6A55', P.amber, bright)} strokeWidth={22} fill="none" opacity={0.6 * bright} filter={`url(#${id}b)`} strokeLinejoin="round" />
      <path d={d} stroke={mix('#8A7A64', P.yellow, bright)} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} stroke={P.warm} strokeWidth={3} fill="none" opacity={0.4 + 0.6 * k} strokeLinejoin="round" strokeLinecap="round" />
      {k > 0.6 && (() => {
        const sx = -len / 2 + len * ((t * 0.03) % 1);
        return <Halo x={sx} rx={50} ry={22} color={P.warm} op={0.9 * smooth(ramp(k, 0.6, 1))} />;
      })()}
    </g>
  );
};

// potongan simpul kecil yang jatuh setelah digunting
export const SnippedKnot: React.FC<{t: number; t0: number; x: number; y: number; floorY: number}> = ({t, t0, x, y, floorY}) => {
  const k = Math.max(0, t - t0);
  const yy = Math.min(floorY - 10, y + 0.5 * 1.4 * k * k);
  return (
    <g transform={`translate(${x + k * 1.5},${yy}) rotate(${Math.min(k, 20) * 14})`} opacity={1 - ramp(k, 30, 45)}>
      <path d="M -18 0 C -18 -24 18 -24 14 0 C 10 20 -14 18 -10 -2" stroke="#8A7A64" strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ================= BEAT 7: e-book (tablet) + kartu video player ================= */
export const EbookTablet: React.FC<{t: number; on: number; s?: number}> = ({t, on, s = 1}) => {
  const W2 = 150, H2 = 200;
  return (
    <g transform={`scale(${s})`}>
      <Halo rx={260} ry={300} color={P.amber} op={0.5 * on} />
      <rect x={-W2 - 12} y={-H2 - 12} width={(W2 + 12) * 2} height={(H2 + 12) * 2} rx={26} fill="#15181F" />
      <rect x={-W2 - 12} y={-H2 - 12} width={(W2 + 12) * 2} height={(H2 + 12) * 2} rx={26} fill="none" stroke={mix(P.gray, '#FFE2B0', on)} strokeWidth={4} />
      {/* sampul e-book */}
      <rect x={-W2} y={-H2} width={W2 * 2} height={H2 * 2} rx={10} fill="#0B0B0E" />
      <rect x={-W2} y={-H2} width={W2 * 2} height={H2 * 2} rx={10} fill={P.amber} opacity={0.1 * on} />
      <rect x={-W2 + 16} y={-H2 + 16} width={W2 * 2 - 32} height={H2 * 2 - 32} rx={6} fill="none" stroke={P.amber} strokeWidth={2.5} opacity={0.65 * on} />
      <text x={0} y={-H2 + 66} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} letterSpacing={6} fill={P.warm} opacity={0.35 + 0.65 * on}>E-BOOK</text>
      <Logo w={232} y={-6} op={0.4 + 0.6 * on} glow={on} />
      <rect x={-80} y={H2 - 92} width={160} height={10} rx={5} fill={P.warm} opacity={0.45 * on} />
      <rect x={-56} y={H2 - 70} width={112} height={10} rx={5} fill={P.warm} opacity={0.3 * on} />
      {/* kilau kaca */}
      <path d={`M ${-W2} ${-H2 + 60} L ${-W2 + 120} ${-H2} L ${-W2 + 180} ${-H2} L ${-W2} ${-H2 + 110} Z`} fill="#FFFFFF" opacity={0.06 + 0.04 * Math.sin(t * 0.08)} />
      <Rise y={-H2} w={260} h={240} n={7} seed={71} op={on} t={t} size={0.9} />
    </g>
  );
};

export const VideoCard: React.FC<{t: number; on: number; press?: number; s?: number}> = ({t, on, press = 0, s = 1}) => {
  const W2 = 200, H2 = 135;
  const pk = Math.sin(clamp(press) * Math.PI);
  const prog = 0.15 + 0.7 * smooth(ramp(press, 0.5, 1)) * clamp(t / 200 + 0.6);
  return (
    <g transform={`scale(${s})`}>
      <Halo rx={320} ry={240} color={P.warm} op={0.42 * on} />
      <rect x={-W2 - 10} y={-H2 - 10} width={(W2 + 10) * 2} height={(H2 + 10) * 2 + 46} rx={24} fill="#15181F" />
      <rect x={-W2 - 10} y={-H2 - 10} width={(W2 + 10) * 2} height={(H2 + 10) * 2 + 46} rx={24} fill="none" stroke={mix(P.gray, '#FFF0D8', on)} strokeWidth={4} />
      <rect x={-W2} y={-H2} width={W2 * 2} height={H2 * 2} rx={12} fill="#0B0B0E" />
      <Logo w={230} y={-14} op={0.35 + 0.65 * on} glow={on * 0.8} />
      <text x={-W2 + 18} y={H2 - 16} fontFamily="Poppins" fontWeight={800} fontSize={24} letterSpacing={2} fill={P.warm} opacity={0.3 + 0.6 * on}>VIDEO · STOP PMO</text>
      {/* tombol play */}
      <g transform={`translate(${W2 - 58},${-H2 + 58}) scale(${1 - 0.18 * pk})`}>
        <circle r={36} fill={mix(P.gray, P.warm, on)} opacity={0.95} />
        <circle r={36 + pk * 26} fill="none" stroke={P.yellow} strokeWidth={4} opacity={pk} />
        <path d="M -10 -16 L 18 0 L -10 16 Z" fill="#15181F" />
      </g>
      {/* bar progress */}
      <rect x={-W2} y={H2 + 20} width={W2 * 2} height={10} rx={5} fill="#3A404C" />
      <rect x={-W2} y={H2 + 20} width={W2 * 2 * prog} height={10} rx={5} fill={P.amber} opacity={0.4 + 0.6 * on} />
      <circle cx={-W2 + W2 * 2 * prog} cy={H2 + 25} r={11} fill={P.warm} opacity={0.5 + 0.5 * on} />
    </g>
  );
};

/* ================= BEAT 8-9 + END: toko/bangunan menyala dengan papan nama neon PMO SAVIOR ================= */
// neon 0..1 (pakai neonFlicker untuk efek saklar), lights: jendela/pintu menyala
export const neonFlicker = (t: number, t0: number) => {
  const k = t - t0;
  if (k < 0) return 0;
  if (k < 3) return 0.9; if (k < 6) return 0.1; if (k < 8) return 1; if (k < 11) return 0.25; if (k < 14) return 0.8;
  return 1;
};
export const Storefront: React.FC<{t: number; neon: number; lights?: number; door?: number}> = ({t, neon, lights = 1, door = 0}) => {
  const id = useSid('sf');
  const W2 = 230, Hb = 400;
  const body = '#5A6170', bodyD = '#474D5A';
  const buzz = neon > 0.95 ? 0.94 + 0.06 * Math.sin(t * 1.7) * Math.sin(t * 0.53) : neon;
  const win = mix('#3A404C', P.warm, lights);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={bodyD} />
          <stop offset="0.5" stopColor={body} />
          <stop offset="1" stopColor={bodyD} />
        </linearGradient>
      </defs>
      <Halo y={-Hb * 0.5} rx={420} ry={420} color={P.warm} op={0.3 * lights} />
      <Halo y={-Hb - 140} rx={380} ry={190} color={P.red} op={0.32 * buzz} />
      {/* badan bangunan */}
      <rect x={-W2} y={-Hb} width={W2 * 2} height={Hb} fill={`url(#${id}b)`} />
      <rect x={-W2} y={-Hb} width={W2 * 2} height={10} fill="#6E7584" />
      {/* jendela */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Halo x={sd * 150} y={-Hb + 170} rx={110} ry={150} color={P.warm} op={0.35 * lights} />
          <rect x={sd * 150 - 46} y={-Hb + 80} width={92} height={180} rx={8} fill={win} />
          {[0, 1, 2].map((k) => <rect key={k} x={sd * 150 - 30} y={-Hb + 110 + k * 46} width={60} height={5} rx={2.5} fill="#E8D9C0" opacity={0.6 * lights} />)}
        </g>
      ))}
      {/* pintu ganda */}
      <Halo y={-120} rx={150} ry={200} color={P.warm} op={0.5 * lights} />
      <rect x={-62} y={-250} width={124} height={250} rx={6} fill={win} />
      <rect x={-4} y={-250} width={8} height={250} fill="#B8B0A0" opacity={0.7} />
      <rect x={-62 - door * 50} y={-250} width={60} height={250} fill={win} opacity={door > 0 ? 1 : 0} />
      {/* kanopi bergaris */}
      <g transform={`translate(0,${-Hb})`}>
        <rect x={-W2 - 20} y={-30} width={(W2 + 20) * 2} height={30} fill="#2A2E36" />
        {Array.from({length: 13}).map((_, i) => {
          const x = -W2 - 20 + i * ((W2 + 20) * 2) / 13;
          const w = ((W2 + 20) * 2) / 13;
          return <path key={i} d={`M ${x} 0 L ${x + w} 0 L ${x + w} 34 Q ${x + w / 2} 50 ${x} 34 Z`} fill={i % 2 ? '#C9CDD6' : '#F2EEE6'} opacity={0.75 + 0.25 * lights} />;
        })}
      </g>
      {/* papan nama neon: logo PMO SAVIOR */}
      <g transform={`translate(0,${-Hb - 150})`}>
        <rect x={-190} y={-100} width={380} height={200} rx={20} fill="#0B0B0E" />
        <rect x={-190} y={-100} width={380} height={200} rx={20} fill="none" stroke={P.red} strokeWidth={5} opacity={0.25 + 0.75 * buzz} />
        <rect x={-190} y={-100} width={380} height={200} rx={20} fill="none" stroke={P.red} strokeWidth={16} opacity={0.18 * buzz} />
        <g opacity={0.12 + 0.88 * buzz}><Logo w={300} y={0} glow={buzz} /></g>
        {/* tiang papan */}
        <rect x={-120} y={100} width={10} height={30} fill="#2A2E36" />
        <rect x={110} y={100} width={10} height={30} fill="#2A2E36" />
      </g>
    </g>
  );
};

/* ================= BEAT 9: ikon link + panah naik ================= */
export const LinkIcon: React.FC<{t: number; on: number; s?: number}> = ({t, on, s = 1}) => {
  const id = useSid('lk');
  const ring = (rot: number, dx: number) => (
    <rect x={-70 + dx} y={-34} width={140} height={68} rx={34} fill="none" strokeWidth={20} transform={`rotate(${rot})`} />
  );
  return (
    <g transform={`scale(${s * (0.6 + 0.4 * easeOutBack(on))})`} opacity={clamp(on * 1.5)}>
      <defs><filter id={`${id}b`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={10} /></filter></defs>
      <Halo rx={190} color={P.red} op={0.35 * on} />
      <g transform="rotate(-45)">
        <g stroke={P.red} filter={`url(#${id}b)`} opacity={0.9}>{ring(0, -48)}{ring(0, 48)}</g>
        <g stroke={P.warm}>{ring(0, -48)}</g>
        <g stroke={P.warm}>{ring(0, 48)}</g>
        <rect x={-30} y={-10} width={60} height={20} rx={10} fill={P.warm} opacity={0.3 + 0.2 * Math.sin(t * 0.2)} />
      </g>
    </g>
  );
};

export const ArrowUp: React.FC<{t: number; on: number; h?: number}> = ({t, on, h = 260}) => (
  <g opacity={on}>
    {[0, 1, 2].map((i) => {
      const ph = ((t * 0.03 + i / 3) % 1);
      const y = -ph * h;
      return (
        <g key={i} transform={`translate(0,${y})`} opacity={Math.sin(ph * Math.PI)}>
          <path d="M -46 22 L 0 -22 L 46 22" stroke={P.red} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M -46 22 L 0 -22 L 46 22" stroke={P.warm} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    })}
  </g>
);

// rantai pendek melayang untuk ilustrasi sheet
export const ChainSample: React.FC = () => (
  <g>
    <ChainLine x1={-160} y1={0} x2={160} y2={0} sag={50} />
    <Link x={0} y={-60} ang={0} side={false} s={2.5} />
  </g>
);
