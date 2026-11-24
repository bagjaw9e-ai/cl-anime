// Ilustrasi video "otak bodoh" — gaya ref_1: bentuk simpel, MENYALA (halo + inti terang) di atas latar gelap.
// Koordinat lokal: (0,0) = pusat ilustrasi (titik fokus kamera). Ukuran nominal 300-560 px pada skala 1.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {clamp, mix, rand} from '../theme';
import {Halo} from '../components/Lit';
import {useSid} from '../components/Phone';

const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const AMB = '#FFB23F', GOLD = '#FFD166', WARM = '#FFF4E0', RED = '#FF3B3B', PINK = '#FF5FA2', GRAY = '#7A808C';
const T = (x: number, y: number, s: string, size = 30, fill = '#15121C', w = 800, anchor: 'middle' | 'start' = 'middle') => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={w} fontSize={size} fill={fill}>{s}</text>
);

/* ---------- HOOK ---------- */
// kertas ujian, garis jawaban, cap nilai "0" merah (stamp 0..1: cap jatuh + bekas)
export const ExamPaper: React.FC<{stamp: number}> = ({stamp}) => {
  const k = sm(stamp / 0.4), land = stamp > 0.4;
  return (
    <g>
      <Halo rx={330} ry={380} color={WARM} op={0.35} />
      <g transform="rotate(-4)">
        <rect x={-190} y={-250} width={380} height={500} rx={12} fill="#F4EEE2" />
        <rect x={-190} y={-250} width={380} height={70} rx={12} fill="#E4DCCB" />
        {Array.from({length: 8}).map((_, i) => (
          <g key={i}>
            <circle cx={-150} cy={-130 + i * 46} r={9} fill="none" stroke="#9AA0AC" strokeWidth={3} />
            <rect x={-126} y={-136 + i * 46} width={160 + rand(i) * 100} height={10} rx={5} fill="#B8B2A6" />
            <path d={`M 120 ${-140 + i * 46} l 14 14 M 134 ${-140 + i * 46} l -14 14`} stroke={RED} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          </g>
        ))}
      </g>
      {stamp > 0 && (
        <g transform={`translate(90,-150) rotate(-14) scale(${land ? 1 + (1 - sm((stamp - 0.4) / 0.3)) * 0.1 : 2.4 - 1.4 * k})`} opacity={clamp(stamp * 4)}>
          <circle r={96} fill="none" stroke={RED} strokeWidth={12} />
          <circle r={78} fill="none" stroke={RED} strokeWidth={4} />
          {T(0, 46, '0', 140, RED)}
        </g>
      )}
    </g>
  );
};

// gagang pintu + anak kunci diputar (turn 0..1) + gantungan "JANGAN GANGGU"
export const DoorKnobLock: React.FC<{turn: number; t: number}> = ({turn, t}) => (
  <g>
    <Halo rx={320} ry={320} color="#FFC070" op={0.3} />
    {/* pelat gagang */}
    <rect x={-60} y={-200} width={120} height={400} rx={30} fill="#B8935A" />
    <rect x={-48} y={-188} width={96} height={376} rx={24} fill="#D8B272" />
    {/* tuas gagang */}
    <g transform={`rotate(${-turn * 20},0,-90)`}>
      <rect x={-20} y={-112} width={230} height={44} rx={22} fill="#E8C888" />
      <circle cx={0} cy={-90} r={40} fill="#E8C888" stroke="#B8935A" strokeWidth={6} />
    </g>
    {/* lubang kunci + anak kunci berputar */}
    <circle cx={0} cy={60} r={16} fill="#3A2A1A" />
    <g transform={`translate(0,60) rotate(${turn * 90})`}>
      <rect x={-6} y={-6} width={12} height={110} rx={4} fill="#E3E7EE" />
      <circle cx={0} cy={130} r={34} fill="none" stroke="#E3E7EE" strokeWidth={14} />
    </g>
    {turn > 0.9 && <Halo x={0} y={60} rx={80} color="#FFFFFF" op={0.6 * (1 - (turn - 0.9) * 10 + 0.5)} />}
    {/* gantungan pintu */}
    <g transform={`translate(-150,-60) rotate(${Math.sin(t * 0.12) * 3},90,-120)`}>
      <path d="M 60 -150 Q 90 -190 120 -150" stroke="#F2EEE6" strokeWidth={8} fill="none" />
      <rect x={10} y={-150} width={160} height={260} rx={16} fill="#C62F3E" />
      <circle cx={90} cy={-110} r={24} fill="#15121C" />
      {T(90, -20, 'JANGAN', 30, '#FFFFFF')}
      {T(90, 18, 'GANGGU', 30, '#FFFFFF')}
      <rect x={40} y={50} width={100} height={8} rx={4} fill="#FFFFFF" opacity={0.6} />
    </g>
  </g>
);

/* ---------- ONE SHOT ---------- */
// pintu bercahaya bernomor (on 0..1 nyala, open 0..1 daun pintu terbuka -> cahaya tumpah)
export const GlowDoor: React.FC<{n: number; color: string; on: number; open?: number; w?: number}> = ({n, color, on, open = 0, w = 200}) => {
  const h = w * 1.9;
  return (
    <g>
      <Halo y={-h / 2} rx={w * 1.4} ry={h * 0.9} color={color} op={0.5 * on} />
      <rect x={-w / 2 - 14} y={-h - 14} width={w + 28} height={h + 14} rx={8} fill={mix('#1A1C24', color, 0.25 * on)} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={mix('#0C0D12', color, 0.85 * on)} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={WARM} opacity={0.45 * on * (0.6 + 0.4 * open)} />
      {/* daun pintu membuka ke dalam */}
      <path d={`M ${-w / 2} ${-h} L ${-w / 2 + w * (1 - open * 0.8)} ${-h + open * 30} L ${-w / 2 + w * (1 - open * 0.8)} ${-open * 30} L ${-w / 2} 0 Z`}
        fill={mix('#1A1C24', color, 0.3 * on)} opacity={1 - open * 0.15} />
      <circle cx={-w / 2 + w * (1 - open * 0.8) - 22} cy={-h * 0.48} r={9} fill={mix(GRAY, WARM, on)} />
      <g transform={`translate(${-w / 2 + w * (1 - open * 0.8) / 2},${-h * 0.72})`}>
        <circle r={w * 0.2} fill={on > 0.3 ? WARM : '#3A3E4A'} opacity={0.9} />
        {T(0, w * 0.09, String(n), w * 0.26, on > 0.3 ? mix('#15121C', color, 0.2) : '#8A90A0')}
      </g>
    </g>
  );
};

/* ---------- FASE 1 ---------- */
// kepala tampak samping (menghadap kanan): siluet terang + otak di dalam. pfc = nyala bagian depan (0 mati .. 1 emas),
// gears = gear emas berputar di dahi, speed = kecepatan gear, smoke = asap, crack = retakan amber, heal = retakan menyatu
export const HeadProfile: React.FC<{pfc?: number; gears?: number; speed?: number; smoke?: number; crack?: number; heal?: number; t: number;
  tint?: string; rust?: number; flick?: number}> = ({pfc = 1, gears = 0, speed = 1, smoke = 0, crack = 0, heal = 0, t, tint = '#8FA8D8', rust = 0, flick = 0}) => {
  const id = useSid('hp');
  const head = 'M -150 120 C -210 40 -200 -150 -60 -210 C 60 -250 190 -180 200 -60 C 206 -20 236 10 230 30 C 222 46 204 44 200 56 C 206 84 196 110 170 116 C 150 120 140 140 120 150 L 60 170 L 40 250 L -110 250 C -100 200 -110 160 -150 120 Z';
  const brain = 'M -140 -20 C -150 -110 -80 -180 10 -180 C 100 -180 170 -120 170 -40 C 172 20 120 50 60 46 C 10 60 -60 60 -110 40 C -140 30 -142 0 -140 -20 Z';
  const fl = flick > 0 ? (rand(Math.floor(t / 2)) > 0.6 ? 0.35 : 1) : 1;
  const P = pfc * fl;
  const rot = t * 3 * speed;
  return (
    <g>
      <defs><clipPath id={`${id}b`}><path d={brain} /></clipPath><clipPath id={`${id}f`}><rect x={60} y={-200} width={140} height={270} /></clipPath></defs>
      <Halo x={10} y={-40} rx={330} ry={330} color={tint} op={0.3} />
      <path d={head} fill={mix('#1A1E2A', tint, 0.25)} stroke={mix(tint, '#FFFFFF', 0.4)} strokeWidth={6} />
      <path d={brain} fill={mix('#2A2F3E', '#C9A0B8', 0.4)} />
      <g clipPath={`url(#${id}b)`} stroke="#7A5A70" strokeWidth={6} fill="none" opacity={0.6}>
        <path d="M -120 -60 Q -80 -100 -40 -60 T 40 -70 T 120 -60" /><path d="M -110 0 Q -60 -30 -20 0 T 60 -10 T 150 -20" /><path d="M -60 -150 Q -30 -110 0 -140 T 70 -130" />
      </g>
      {/* PFC (otak bagian depan) */}
      <g clipPath={`url(#${id}b)`}>
        <g clipPath={`url(#${id}f)`}>
          <rect x={60} y={-200} width={140} height={270} fill={mix('#3A3440', gears > 0 ? '#FFE9B8' : GOLD, P)} />
          {gears > 0 && (
            <g opacity={gears}>
              <GearShape x={112} y={-96} R={44} n={9} rot={rot} c={mix('#5A4A30', '#D88A10', P)} rust={rust} />
              <GearShape x={156} y={-26} R={30} n={7} rot={-rot * 1.5 + 12} c={mix('#5A4A30', '#B86A08', P)} rust={rust} />
              <GearShape x={96} y={8} R={26} n={6} rot={-rot * 1.9} c={mix('#5A4A30', '#D88A10', P)} rust={rust} />
            </g>
          )}
        </g>
      </g>
      <Halo x={130} y={-70} rx={150} ry={150} color={GOLD} op={0.55 * P} />
      {/* retakan amber yang menyatu (heal) */}
      {crack > 0 && (
        <g opacity={crack}>
          {['M -20 -180 L 0 -120 L -30 -70 L 0 -10', 'M 120 -150 L 90 -100 L 110 -50', 'M -120 -40 L -70 -30 L -60 20'].map((d, i) => (
            <path key={i} d={d} stroke={mix('#15121C', AMB, heal)} strokeWidth={10 * (1 - heal * 0.7)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {heal > 0 && <Halo x={0} y={-80} rx={260} color={AMB} op={0.45 * heal} />}
        </g>
      )}
      {/* asap dari dahi */}
      {smoke > 0 && [0, 1, 2, 3].map((i) => {
        const ph = ((t * 0.02 + i * 0.25) % 1);
        return <circle key={i} cx={150 + ph * 60 + Math.sin(ph * 6 + i) * 14} cy={-190 - ph * 200} r={26 + ph * 40} fill="#8A8A90" opacity={smoke * (1 - ph) * 0.55} />;
      })}
    </g>
  );
};
export const GearShape: React.FC<{x: number; y: number; R: number; n: number; rot: number; c: string; rust?: number}> = ({x, y, R, n, rot, c, rust = 0}) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? R : R * 1.22;
    const a2 = a + Math.PI / (n * 2);
    pts.push(`${Math.cos(a) * r},${Math.sin(a) * r}`, `${Math.cos(a2) * r},${Math.sin(a2) * r}`);
  }
  const col = mix(c, '#8A4A2A', rust * 0.7);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <polygon points={pts.join(' ')} fill={col} />
      <circle r={R * 0.4} fill="#2A2228" />
      {rust > 0 && [0, 1, 2, 3].map((i) => <circle key={i} cx={Math.cos(i * 1.7) * R * 0.75} cy={Math.sin(i * 1.7) * R * 0.75} r={R * 0.16} fill="#6A3A1E" opacity={rust} />)}
    </g>
  );
};

// kabel merah dari HP ke dahi (k 0..1 tumbuh), (x1,y1)->(x2,y2) dunia
export const RedCable: React.FC<{x1: number; y1: number; x2: number; y2: number; k: number; t: number}> = ({x1, y1, x2, y2, k, t}) => {
  const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 120;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return (
    <g>
      <path d={d} stroke="#FF3B3B" strokeWidth={22} fill="none" opacity={0.25} pathLength={1} strokeDasharray={`${k} 1`} />
      <path d={d} stroke="#FF4D5A" strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      {k > 0.98 && [0, 1, 2].map((i) => {
        const ph = ((t * 0.03 + i / 3) % 1);
        const x = (1 - ph) * (1 - ph) * x1 + 2 * (1 - ph) * ph * mx + ph * ph * x2, y = (1 - ph) * (1 - ph) * y1 + 2 * (1 - ph) * ph * my + ph * ph * y2;
        return <circle key={i} cx={x} cy={y} r={10} fill="#FFC0C8" />;
      })}
      {k > 0.98 && <g transform={`translate(${x2},${y2})`}><rect x={-18} y={-12} width={36} height={24} rx={6} fill="#C62F3E" /></g>}
    </g>
  );
};

// benang kusut -> jaringan node rapi (k 0..1)
export const TangleToNet: React.FC<{k: number; t: number}> = ({k, t}) => {
  const N = 9, nodes = Array.from({length: N}).map((_, i) => ({x: ((i % 3) - 1) * 150, y: (Math.floor(i / 3) - 1) * 130}));
  const e = sm(k);
  const msg = Array.from({length: 14}).map((_, i) => `${Math.cos(i * 2.3) * 170 * (0.4 + rand(i) * 0.6)},${Math.sin(i * 3.1) * 150 * (0.4 + rand(i + 5) * 0.6)}`).join(' ');
  return (
    <g>
      <Halo rx={300} color={GOLD} op={0.25 + 0.2 * e} />
      <polyline points={msg} fill="none" stroke="#C9B8A0" strokeWidth={6} strokeLinejoin="round" opacity={1 - e} transform={`rotate(${t * 0.5})`} />
      <g opacity={e}>
        {nodes.map((a, i) => nodes.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 200).map((b, j) => (
          <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth={5} opacity={0.8} />
        )))}
        {nodes.map((a, i) => <g key={i}><circle cx={a.x} cy={a.y} r={24} fill={GOLD} /><circle cx={a.x} cy={a.y} r={11} fill={WARM} /></g>)}
      </g>
    </g>
  );
};

// papan catur menyala, bidak kuda bergerak (move 0..1)
export const ChessBoard: React.FC<{move: number}> = ({move}) => {
  const m = sm(move);
  return (
    <g>
      <Halo rx={330} ry={250} color={GOLD} op={0.35} />
      <g transform="scale(1,0.55)">
        <rect x={-250} y={-250} width={500} height={500} rx={10} fill="#2A2228" />
        {Array.from({length: 36}).map((_, i) => <rect key={i} x={-240 + (i % 6) * 80} y={-240 + Math.floor(i / 6) * 80} width={80} height={80}
          fill={(i + Math.floor(i / 6)) % 2 ? '#3A3440' : mix('#F4E9D8', GOLD, 0.25)} opacity={0.9} />)}
      </g>
      <Piece x={-120} y={-20} c="#B8BEC9" kind="pawn" />
      <Piece x={120} y={40} c="#B8BEC9" kind="pawn" />
      <Piece x={-40 + m * 120} y={60 - m * 100 - Math.sin(m * Math.PI) * 80} c={GOLD} kind="knight" glow />
    </g>
  );
};
const Piece: React.FC<{x: number; y: number; c: string; kind: 'pawn' | 'knight'; glow?: boolean}> = ({x, y, c, kind, glow}) => (
  <g transform={`translate(${x},${y})`}>
    {glow && <Halo y={-60} rx={90} color={GOLD} op={0.6} />}
    <ellipse cx={0} cy={0} rx={40} ry={14} fill={mix(c, '#000', 0.3)} />
    <path d="M -34 -4 L 34 -4 L 26 -24 L -26 -24 Z" fill={c} />
    {kind === 'pawn' ? <g><path d="M -16 -24 L 16 -24 L 10 -70 L -10 -70 Z" fill={c} /><circle cx={0} cy={-84} r={22} fill={c} /></g>
      : <path d="M -24 -24 L 24 -24 L 20 -70 C 30 -100 10 -130 -14 -128 L -36 -100 L -24 -88 L -8 -96 L -22 -60 Z" fill={c} />}
  </g>
);

// papan tulis: atom, grafik, panah digambar progresif (k 0..1)
export const Chalkboard: React.FC<{k: number; t: number}> = ({k, t}) => {
  const p = (a: number, b: number) => clamp((k - a) / (b - a));
  return (
    <g>
      <Halo rx={360} ry={260} color="#BFE6E0" op={0.3} />
      <rect x={-300} y={-200} width={600} height={400} rx={14} fill="#6A4A2E" />
      <rect x={-282} y={-182} width={564} height={364} fill="#1E3A30" />
      <g stroke="#F2F6F0" strokeWidth={6} fill="none" strokeLinecap="round">
        {/* atom */}
        <g transform="translate(-150,-40)" opacity={p(0, 0.3) > 0 ? 1 : 0}>
          {[0, 60, 120].map((a) => <ellipse key={a} rx={90} ry={32} transform={`rotate(${a + t * 0.6})`} pathLength={1} strokeDasharray={`${p(0, 0.3)} 1`} />)}
          <circle r={10} fill="#FFD166" stroke="none" opacity={p(0, 0.3)} />
        </g>
        {/* grafik */}
        <path d="M 20 100 L 20 -110 M 20 100 L 240 100" pathLength={1} strokeDasharray={`${p(0.3, 0.5)} 1`} />
        <path d="M 40 70 L 100 20 L 150 40 L 220 -80" stroke="#FFD166" pathLength={1} strokeDasharray={`${p(0.5, 0.75)} 1`} />
        {/* panah */}
        <path d="M -230 130 Q -120 170 -20 120 M -40 104 L -20 120 L -44 138" pathLength={1} strokeDasharray={`${p(0.75, 1)} 1`} />
      </g>
    </g>
  );
};

// peta dibentangkan (unroll 0..1) dengan jalan putus-putus menuju bendera bercahaya (path 0..1)
export const MapPath: React.FC<{unroll: number; path: number; t: number}> = ({unroll, path, t}) => {
  const u = sm(unroll);
  const id = useSid('mp');
  return (
    <g>
      <Halo rx={340} ry={260} color={GOLD} op={0.3} />
      <defs><clipPath id={`${id}c`}><rect x={-280} y={-190} width={560 * u} height={380} /></clipPath></defs>
      <g clipPath={`url(#${id}c)`}>
        <path d="M -280 -190 L -90 -170 L 90 -190 L 280 -170 L 280 190 L 90 170 L -90 190 L -280 170 Z" fill="#E8D8B0" />
        <path d="M -90 -170 L -90 190 M 90 -190 L 90 170" stroke="#C8B890" strokeWidth={3} />
        <path d="M -230 120 C -160 40 -100 140 -20 60 S 120 -60 190 -110" stroke="#C62F3E" strokeWidth={8} fill="none" strokeDasharray="18 14" pathLength={1}
          style={{strokeDasharray: undefined}} opacity={0.25} />
        <path d="M -230 120 C -160 40 -100 140 -20 60 S 120 -60 190 -110" stroke="#C62F3E" strokeWidth={8} fill="none" pathLength={100} strokeDasharray={`${path * 100} 100`} />
        <circle cx={-230} cy={120} r={12} fill="#2A2228" />
      </g>
      <rect x={-300 + 560 * u} y={-200} width={36} height={400} rx={18} fill="#C8B890" opacity={u < 0.99 ? 1 : 0} />
      {path > 0.9 && (
        <g transform="translate(190,-110)">
          <Halo y={-60} rx={120} color={GOLD} op={0.7} />
          <rect x={-3} y={-110} width={6} height={110} fill="#F2EEE6" />
          <path d={`M 3 -110 Q 50 ${-100 + Math.sin(t * 0.3) * 6} 80 -90 Q 50 -80 3 -70 Z`} fill={GOLD} />
        </g>
      )}
    </g>
  );
};

// pedal rem bercahaya (press 0..1, broken 0..1 patah)
export const BrakeGlow: React.FC<{press?: number; broken?: number; c?: string}> = ({press = 0, broken = 0, c = GOLD}) => (
  <g>
    <Halo rx={200} color={mix(c, '#8A90A0', broken)} op={0.45 * (1 - broken * 0.7)} />
    <rect x={-14} y={-200} width={28} height={130} rx={10} fill="#5A6170" transform={`rotate(${broken * 40},0,-70)`} />
    <g transform={`translate(${broken * 30},${press * 30 + broken * 80}) rotate(${broken * 30})`}>
      <rect x={-110} y={-80} width={220} height={140} rx={24} fill={mix('#3A3E4A', c, 1 - broken * 0.7)} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-90} y={-60 + i * 30} width={180} height={12} rx={6} fill="#2A2228" opacity={0.5} />)}
    </g>
    {broken > 0.2 && <path d="M -20 -80 L 0 -60 L -14 -40 L 8 -20" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={broken} />}
  </g>
);

// panah loop melingkar berputar
export const LoopArrows: React.FC<{t: number; r?: number; c?: string}> = ({t, r = 300, c = RED}) => (
  <g transform={`rotate(${t * 4})`}>
    {[0, 120, 240].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d={`M ${r} 0 A ${r} ${r} 0 0 1 ${r * Math.cos(1.6)} ${r * Math.sin(1.6)}`} stroke={c} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={`M ${r * Math.cos(1.6) + 30} ${r * Math.sin(1.6) - 4} l -40 4 l 18 -36`} stroke={c} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      </g>
    ))}
  </g>
);

// speedometer: jarum v 0..1 (1 = hijau tinggi, 0 = merah bawah)
export const Speedometer: React.FC<{v: number}> = ({v}) => {
  const a = -120 + v * 240;
  return (
    <g>
      <Halo rx={220} color={mix(RED, GOLD, v)} op={0.35} />
      <circle r={170} fill="#1A1C24" stroke="#C9CED8" strokeWidth={10} />
      {[[RED, -120, -40], [GOLD, -40, 40], ['#4FD18B', 40, 120]].map(([c, s, e], i) => {
        const r = 135, sa = ((s as number) - 90) * Math.PI / 180, ea = ((e as number) - 90) * Math.PI / 180;
        return <path key={i} d={`M ${Math.cos(sa) * r} ${Math.sin(sa) * r} A ${r} ${r} 0 0 1 ${Math.cos(ea) * r} ${Math.sin(ea) * r}`} stroke={c as string} strokeWidth={22} fill="none" />;
      })}
      <g transform={`rotate(${a})`}><path d="M -8 0 L 0 -130 L 8 0 Z" fill="#FFFFFF" /></g>
      <circle r={18} fill="#C9CED8" />
    </g>
  );
};

/* ---------- PMO SAVIOR ---------- */
// buku panduan menyala amber, terbuka (open 0..1) + jaringan neuron menyambung di atasnya (net 0..1)
export const GuideBook: React.FC<{open: number; net: number; t: number}> = ({open, net, t}) => {
  const o = sm(open);
  const nodes = [[-150, -170], [-60, -230], [40, -190], [140, -240], [190, -150], [-110, -110], [80, -120]];
  return (
    <g>
      <Halo y={-60} rx={360} ry={320} color={AMB} op={0.5 * (0.4 + 0.6 * o)} />
      <path d={`M 0 -30 C -60 -60 -170 -60 -230 -30 L -230 ${110} C -170 80 -60 80 0 110 Z`} fill={mix('#8A5A2A', '#FFE2A8', o)} transform={`scale(${0.3 + 0.7 * o},1)`} />
      <path d={`M 0 -30 C 60 -60 170 -60 230 -30 L 230 110 C 170 80 60 80 0 110 Z`} fill={mix('#6A4220', '#FFD68A', o)} transform={`scale(${0.3 + 0.7 * o},1)`} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-200 * o} ${-4 + i * 26} Q ${-110 * o} ${-20 + i * 26} ${-30 * o} ${-4 + i * 26}`} stroke="#B8863A" strokeWidth={5} fill="none" opacity={o * 0.6} />)}
      <g opacity={net}>
        {nodes.map(([x, y], i) => nodes.slice(i + 1, i + 3).map(([x2, y2], j) => (
          <line key={`${i}${j}`} x1={x} y1={y} x2={x + (x2 - x) * clamp(net * 1.4 - i * 0.08)} y2={y + (y2 - y) * clamp(net * 1.4 - i * 0.08)} stroke={GOLD} strokeWidth={5} />
        )))}
        {nodes.map(([x, y], i) => <g key={i}><circle cx={x} cy={y + Math.sin(t * 0.1 + i) * 4} r={16} fill={GOLD} /><circle cx={x} cy={y + Math.sin(t * 0.1 + i) * 4} r={7} fill={WARM} /></g>)}
      </g>
    </g>
  );
};

/* ---------- FASE 2 ---------- */
// siluet hewan (kadal / monyet) abu-abu dengan inti merah di kepala
export const AnimalSil: React.FC<{kind: 'lizard' | 'monkey'; t: number}> = ({kind, t}) => (
  <g>
    {kind === 'lizard' ? (
      <g transform={`rotate(${Math.sin(t * 0.1) * 2})`}>
        <path d="M -180 20 C -120 -10 -60 -20 0 -14 C 50 -30 100 -40 140 -20 C 160 -10 150 8 130 10 C 90 14 60 20 20 24 C -40 40 -110 40 -180 20 Z" fill="#5A6170" />
        <path d="M -40 20 L -60 60 M 30 20 L 50 58 M -40 -14 L -70 -50 M 40 -24 L 60 -60" stroke="#5A6170" strokeWidth={14} strokeLinecap="round" />
        <circle cx={100} cy={-18} r={16} fill={RED} /><Halo x={100} y={-18} rx={50} color={RED} op={0.7} />
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={20} rx={70} ry={90} fill="#5A6170" />
        <circle cx={0} cy={-100} r={58} fill="#5A6170" />
        <ellipse cx={0} cy={-90} rx={36} ry={30} fill="#7A808C" />
        {[-1, 1].map((s) => <circle key={s} cx={s * 60} cy={-110} r={20} fill="#5A6170" />)}
        <path d={`M 60 60 C 140 60 150 ${-20 + Math.sin(t * 0.12) * 10} 120 -40`} stroke="#5A6170" strokeWidth={16} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={-120} r={14} fill={RED} /><Halo x={0} y={-120} rx={50} color={RED} op={0.7} />
      </g>
    )}
  </g>
);

// api unggun kecil di atas kayu + batu
export const Campfire: React.FC<{t: number; s?: number}> = ({t}) => (
  <g>
    <Halo y={-60} rx={260} color="#FF9A3A" op={0.5 + 0.1 * Math.sin(t * 0.5)} />
    {[-30, 30].map((a, i) => <rect key={i} x={-90} y={-14} width={180} height={28} rx={14} fill="#6A4A2E" transform={`rotate(${a})`} />)}
    {[[-1, 0], [1, 0.4], [0, 0.8]].map(([dx, ph], i) => {
      const h = 110 + Math.sin(t * 0.6 + (ph as number) * 6) * 18;
      return <path key={i} d={`M ${(dx as number) * 34 - 30} -10 Q ${(dx as number) * 34} ${-h * 1.1} ${(dx as number) * 34 + 30} -10 Z`} fill={i === 2 ? '#FFE08A' : '#FF8A2B'} opacity={0.95} />;
    })}
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.03 + i / 3) % 1;
      return <circle key={i} cx={Math.sin(ph * 8 + i) * 30} cy={-120 - ph * 160} r={4} fill="#FFD08A" opacity={1 - ph} />;
    })}
  </g>
);
export const Rock: React.FC = () => <path d="M -120 0 C -130 -60 -60 -100 10 -90 C 90 -84 130 -40 120 0 Z" fill="#4A505E" />;

// paha ayam bercahaya
export const Drumstick: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${-20 + Math.sin(t * 0.1) * 3})`}>
    <Halo rx={200} color={AMB} op={0.5} />
    <path d="M -60 -80 C -150 -60 -150 60 -60 80 C 0 90 40 40 50 10 L 120 -10 L 120 10 Z" fill="#D9803A" />
    <path d="M -60 -80 C -150 -60 -150 60 -60 80 C -100 40 -100 -40 -60 -80 Z" fill="#F0A050" opacity={0.6} />
    <rect x={50} y={-10} width={90} height={22} rx={11} fill="#F4EEE2" />
    {[-1, 1].map((s) => <circle key={s} cx={146} cy={s * 14} r={18} fill="#F4EEE2" />)}
  </g>
);
// sarang + telur + keluarga kelinci
export const NestFamily: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={320} ry={200} color={WARM} op={0.3} />
    <g transform="translate(-150,0)">
      {[0, 1, 2].map((i) => <ellipse key={i} cx={-30 + i * 30} cy={-30} rx={26} ry={34} fill="#F4EEE2" />)}
      <path d="M -130 -20 Q 0 60 130 -20 Q 120 40 0 50 Q -120 40 -130 -20 Z" fill="#8A6A3A" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-120 + i * 55} ${-10 + (i % 2) * 10} q 30 -16 60 6`} stroke="#6A4A2A" strokeWidth={6} fill="none" />)}
      <g transform={`translate(0,${-90 + Math.sin(t * 0.4) * 4})`}>
        <circle r={22} fill="#F0D8A8" /><path d="M 18 -4 L 34 0 L 18 6 Z" fill="#FFB23F" /><circle cx={6} cy={-6} r={4} fill="#15121C" />
      </g>
    </g>
    {[[110, 1], [210, 0.7], [270, 0.6]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x},${Math.abs(Math.sin(t * 0.15 + i)) * -10}) scale(${s})`}>
        <ellipse cx={0} cy={-40} rx={46} ry={40} fill="#D8D4CC" />
        <circle cx={34} cy={-80} r={30} fill="#D8D4CC" />
        {[-1, 1].map((e) => <ellipse key={e} cx={30 + e * 10} cy={-130} rx={9} ry={30} fill="#D8D4CC" />)}
        <circle cx={44} cy={-84} r={4} fill="#15121C" />
        <circle cx={-44} cy={-40} r={12} fill="#FFFFFF" />
      </g>
    ))}
  </g>
);

// dua bingkai: kiri pemandangan nyata, kanan layar flat pink + tanda tanya
export const TwoFrames: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g>
    <g transform="translate(-160,0)">
      <Halo rx={170} color="#BFE6E0" op={0.3} />
      <rect x={-130} y={-110} width={260} height={220} rx={10} fill="#C9A86A" />
      <rect x={-112} y={-92} width={224} height={184} fill="#6FB8D8" />
      <path d="M -112 92 L -112 30 L -40 -20 L 20 30 L 60 0 L 112 40 L 112 92 Z" fill="#3A8A5A" />
      <circle cx={60} cy={-50} r={20} fill="#FFE08A" />
    </g>
    <g transform="translate(160,0)">
      <Halo rx={170} color={PINK} op={0.4} />
      <rect x={-130} y={-110} width={260} height={220} rx={16} fill="#15101A" />
      <rect x={-114} y={-94} width={228} height={188} rx={8} fill="#5A1A3A" />
      <ellipse cx={0} cy={0} rx={60} ry={80} fill={PINK} opacity={0.5} />
      <rect x={-90} y={-12} width={180} height={26} fill="#15121C" />
    </g>
    <g transform={`translate(0,${-170 - Math.sin(t * 0.2) * 8}) scale(${sm(p)})`}>
      {T(0, 30, '?', 120, '#F5FF3B')}
    </g>
  </g>
);

// HP "18+" yang ternyata lembaran kardus tipis: turn 0..1 (0 = tampak depan, 1 = tampak samping tipis + kardus)
export const CardboardPhone: React.FC<{turn: number; w?: number; children?: React.ReactNode}> = ({turn, w = 180, children}) => {
  const h = w * 1.9, sx = Math.max(0.06, 1 - sm(turn) * 0.94);
  return (
    <g>
      <g transform={`scale(${sx},1)`}>{children}</g>
      {turn > 0.3 && (
        <g opacity={sm((turn - 0.3) / 0.4)}>
          <rect x={-w * sx / 2 - 10} y={-h / 2} width={14} height={h} fill="#B8864A" />
          {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${-w * sx / 2 - 10} ${-h / 2 + i * h / 12} l 14 ${h / 24} l -14 ${h / 24}`} stroke="#8A5A2A" strokeWidth={2} fill="none" />)}
          <rect x={-w * sx / 2 - 30} y={h / 2 - 10} width={60} height={14} rx={4} fill="#8A5A2A" />
        </g>
      )}
    </g>
  );
};

// matahari & bulan bergantian cepat di langit (cyc 0..n)
export const SunMoon: React.FC<{cyc: number}> = ({cyc}) => {
  const a = cyc * Math.PI * 2;
  return (
    <g>
      <g transform={`translate(${Math.cos(a) * 300},${Math.sin(a) * -120 - 60})`}><Halo rx={110} color={GOLD} op={0.5} /><circle r={46} fill="#FFD166" /></g>
      <g transform={`translate(${Math.cos(a + Math.PI) * 300},${Math.sin(a + Math.PI) * -120 - 60})`}><Halo rx={100} color="#BFD4FF" op={0.4} /><circle r={40} fill="#E8EEF8" /><circle cx={16} cy={-10} r={34} fill="#0E1320" opacity={0.85} /></g>
    </g>
  );
};

// setir kemudi direbut: PFC kecil emas (kiri) vs tangan maskot merah (kanan). grab 0..1
export const SteeringGrab: React.FC<{grab: number; t: number}> = ({grab, t}) => {
  const g = sm(grab);
  return (
    <g>
      <Halo rx={300} color={mix(GOLD, RED, g)} op={0.35} />
      <g transform={`translate(${g * 90},0) rotate(${g * 40 + Math.sin(t * 0.5) * (g > 0.2 && g < 0.9 ? 6 : 0)})`}>
        <circle r={150} fill="none" stroke="#C9CED8" strokeWidth={34} />
        <circle r={150} fill="none" stroke="#F2F4F8" strokeWidth={8} />
        <circle r={40} fill="#9AA0AC" />
        {[90, 210, 330].map((a) => <rect key={a} x={-10} y={0} width={20} height={120} rx={8} fill="#9AA0AC" transform={`rotate(${a})`} />)}
      </g>
      {/* PFC kecil emas: terlepas & terdorong ke kiri */}
      <g transform={`translate(${-190 - g * 120},${-40 + g * 50}) rotate(${-g * 30}) scale(${1 - g * 0.3})`}>
        <Halo rx={90} color={GOLD} op={0.6 * (1 - g * 0.6)} />
        <path d="M -50 10 C -60 -40 -20 -70 10 -60 C 50 -66 70 -30 56 6 C 60 36 20 50 0 40 C -30 50 -54 36 -50 10 Z" fill={mix(GOLD, '#8A7A5A', g * 0.6)} />
        <path d="M -40 -6 Q -20 -24 0 -6 T 40 -10" stroke="#B8863A" strokeWidth={5} fill="none" />
        <path d={`M 40 ${10 - g * 20} L ${130 - g * 60} ${-10 + g * 20}`} stroke={mix(GOLD, '#8A7A5A', g)} strokeWidth={14} strokeLinecap="round" />
      </g>
      {/* tangan maskot merah meraih dari kanan */}
      <g transform={`translate(${340 - g * 160},${30})`}>
        <path d="M 200 30 C 120 40 60 20 0 0" stroke="#FF4D5A" strokeWidth={46} fill="none" strokeLinecap="round" />
        <circle cx={-6} cy={-2} r={34} fill="#FF4D5A" />
      </g>
    </g>
  );
};

/* ---------- FASE 3 ---------- */
export const Crown: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={110} color={GOLD} op={0.55 + 0.1 * Math.sin(t * 0.3)} />
    <path d="M -80 30 L -90 -50 L -40 -10 L 0 -70 L 40 -10 L 90 -50 L 80 30 Z" fill={GOLD} stroke="#B8863A" strokeWidth={5} />
    {[-50, 0, 50].map((x) => <circle key={x} cx={x} cy={14} r={9} fill={RED} />)}
  </g>
);
export const Throne: React.FC = () => (
  <g>
    <Halo y={-180} rx={300} ry={320} color={RED} op={0.3} />
    <path d="M -170 0 L -170 -420 Q -170 -470 -120 -470 L 120 -470 Q 170 -470 170 -420 L 170 0 Z" fill="#5A1A24" stroke={GOLD} strokeWidth={10} />
    <rect x={-200} y={-180} width={400} height={60} rx={14} fill="#7A2230" stroke={GOLD} strokeWidth={8} />
    <rect x={-210} y={-200} width={40} height={200} rx={12} fill="#5A1A24" stroke={GOLD} strokeWidth={6} />
    <rect x={170} y={-200} width={40} height={200} rx={12} fill="#5A1A24" stroke={GOLD} strokeWidth={6} />
    <circle cx={0} cy={-470} r={26} fill={GOLD} />
  </g>
);
// PFC emas yang menyusut & meredup (shrink 0..1)
export const PfcBlob: React.FC<{shrink: number; t: number}> = ({shrink, t}) => {
  const s = 1 - sm(shrink) * 0.6;
  return (
    <g transform={`scale(${s})`}>
      <Halo rx={220} color={GOLD} op={0.55 * (1 - shrink * 0.8)} />
      <path d="M -150 30 C -170 -100 -60 -170 30 -150 C 140 -170 200 -70 166 20 C 176 100 70 140 0 116 C -90 140 -160 100 -150 30 Z" fill={mix(GOLD, '#5A5450', shrink * 0.7)} />
      {['M -110 -20 Q -60 -70 -10 -20 T 100 -30', 'M -100 50 Q -40 10 20 50 T 130 40', 'M -30 -120 Q 0 -80 40 -110'].map((d, i) => (
        <path key={i} d={d} stroke={mix('#B8863A', '#3A3634', shrink)} strokeWidth={10} fill="none" strokeLinecap="round" />
      ))}
      {shrink > 0.4 && [0, 1].map((i) => <circle key={i} cx={-60 + i * 130} cy={-160 - ((t * 0.6 + i * 20) % 40)} r={6} fill="#8A8A90" opacity={0.5} />)}
    </g>
  );
};
// panel kendali di dada: 6 lampu mati satu-satu (off 0..1)
export const ControlPanel: React.FC<{off: number; t: number}> = ({off, t}) => (
  <g>
    <Halo rx={260} ry={180} color={mix('#4FD18B', RED, off)} op={0.35 * (1 - off * 0.5)} />
    <rect x={-200} y={-120} width={400} height={240} rx={22} fill="#1A1C24" stroke="#5A6170" strokeWidth={8} />
    {Array.from({length: 6}).map((_, i) => {
      const on = off * 6 < 6 - i;
      const blink = !on && off * 6 < 6 - i + 0.4 ? (Math.floor(t / 2) % 2 ? 0.7 : 0.2) : 0;
      return (
        <g key={i} transform={`translate(${-130 + (i % 3) * 130},${-40 + Math.floor(i / 3) * 90})`}>
          {on && <Halo rx={46} color="#4FD18B" op={0.6} />}
          <circle r={26} fill={on ? '#6FF0A8' : mix('#2A2228', RED, blink)} stroke="#3A3E4A" strokeWidth={6} />
        </g>
      );
    })}
  </g>
);
// ikon rewind kaset ◀◀
export const RewindIcon: React.FC<{p: number}> = ({p}) => (
  <g opacity={p}>
    <circle r={70} fill="#15121C" opacity={0.85} stroke="#F2EEE6" strokeWidth={5} />
    <path d="M 6 -30 L -34 0 L 6 30 Z M 44 -30 L 4 0 L 44 30 Z" fill="#F2EEE6" />
  </g>
);
// korek api menyala + asap
export const MatchFlame: React.FC<{lit: number; t: number}> = ({lit, t}) => (
  <g>
    {lit > 0 && <Halo y={-80} rx={170} color="#FF8A2B" op={0.6 * lit} />}
    <rect x={-8} y={-40} width={16} height={200} rx={4} fill="#E8C888" transform="rotate(10)" />
    <ellipse cx={-6} cy={-50} rx={16} ry={22} fill="#C62F3E" transform="rotate(10)" />
    {lit > 0 && (
      <g transform={`translate(-12,-70) scale(${lit})`}>
        <path d={`M -26 0 Q ${Math.sin(t * 0.7) * 8} -140 26 0 Q 0 30 -26 0 Z`} fill="#FF8A2B" />
        <path d={`M -12 0 Q ${Math.sin(t * 0.9) * 5} -80 12 0 Q 0 16 -12 0 Z`} fill="#FFE08A" />
      </g>
    )}
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.025 + i / 3) % 1;
      return <circle key={i} cx={-10 + Math.sin(ph * 7 + i) * 24} cy={-200 - ph * 160} r={22 + ph * 30} fill="#6A6A70" opacity={lit * (1 - ph) * 0.45} />;
    })}
  </g>
);
// timbangan pertimbangan yang patah (snap 0..1)
export const ScaleBreak: React.FC<{snap: number}> = ({snap}) => {
  const s = sm(snap);
  return (
    <g>
      <Halo rx={240} color={WARM} op={0.3 * (1 - s * 0.6)} />
      <rect x={-12} y={-180} width={24} height={240} fill="#C9CED8" />
      <rect x={-80} y={60} width={160} height={24} rx={8} fill="#C9CED8" />
      <g transform={`translate(0,-180) rotate(${-s * 30})`}>
        <rect x={-220} y={-8} width={220 - s * 10} height={16} fill="#C9CED8" />
        <line x1={-200} y1={0} x2={-200} y2={100} stroke="#8A90A0" strokeWidth={4} /><path d="M -260 100 L -140 100 Q -200 150 -260 100 Z" fill="#C9CED8" />
      </g>
      <g transform={`translate(${10 + s * 40},${-180 + s * 220}) rotate(${s * 70})`}>
        <rect x={0} y={-8} width={210} height={16} fill="#C9CED8" />
        <line x1={190} y1={0} x2={190} y2={100} stroke="#8A90A0" strokeWidth={4} /><path d="M 130 100 L 250 100 Q 190 150 130 100 Z" fill="#C9CED8" />
      </g>
      {snap > 0.1 && <path d="M -6 -196 L 10 -180 L -4 -166" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={1 - s * 0.5} />}
    </g>
  );
};
// pisau tumpul (bergerigi kusam) + siput merayap
export const DullKnifeSnail: React.FC<{t: number}> = ({t}) => (
  <g>
    <g transform="translate(-60,-60) rotate(-20)">
      <Halo rx={200} ry={90} color="#C9CED8" op={0.3} />
      <path d="M -180 -30 L 140 -30 L 140 30 L -150 30 Q -190 0 -180 -30 Z" fill="#9AA0AC" />
      <path d="M -150 30 L -120 22 L -90 32 L -60 20 L -30 32 L 0 22 L 40 30 L 90 20 L 140 30" stroke="#6A707C" strokeWidth={6} fill="none" />
      <rect x={140} y={-36} width={140} height={72} rx={16} fill="#4A3A2A" />
    </g>
    <g transform={`translate(${-120 + (t * 0.4) % 260},130)`}>
      <path d="M -70 0 Q -80 -20 -40 -20 L 50 -20 Q 70 -20 70 0 Z" fill="#C8B890" />
      <circle cx={0} cy={-56} r={46} fill="#B8864A" /><path d="M 0 -56 m -20 0 a 20 20 0 1 1 40 0 a 12 12 0 1 1 -24 0" stroke="#6A4A2A" strokeWidth={6} fill="none" />
      <path d="M 50 -20 L 66 -56 M 60 -20 L 82 -50" stroke="#C8B890" strokeWidth={5} /><circle cx={66} cy={-58} r={6} fill="#C8B890" /><circle cx={82} cy={-52} r={6} fill="#C8B890" />
    </g>
  </g>
);
// tangga dari kertas rencana ambruk satu-satu (fall 0..1) + peta masa depan sobek (tear 0..1)
export const PaperStairs: React.FC<{fall: number; tear: number; t: number}> = ({fall, tear}) => (
  <g>
    <Halo rx={320} color={WARM} op={0.25} />
    {Array.from({length: 6}).map((_, i) => {
      const k = clamp(fall * 6 - (5 - i)), e = k * k;
      return (
        <g key={i} transform={`translate(${-180 + i * 64 + e * (i % 2 ? 60 : -60)},${120 - i * 56 + e * (240 + i * 50)}) rotate(${e * (i % 2 ? 50 : -60)})`}>
          <rect x={-60} y={-18} width={120} height={36} rx={4} fill="#F2EEE6" />
          <path d="M -46 -6 L 30 -6 M -46 6 L 10 6" stroke="#9AA0AC" strokeWidth={4} />
        </g>
      );
    })}
    <g transform="translate(150,-170)">
      <g transform={`translate(${-tear * 30},${tear * 20}) rotate(${-tear * 10})`}>
        <path d="M -100 -70 L 0 -70 L -14 -30 L 6 0 L -10 40 L 0 70 L -100 70 Z" fill="#E8D8B0" />
        <path d="M -80 40 C -60 10 -40 30 -16 0" stroke="#C62F3E" strokeWidth={6} strokeDasharray="10 8" fill="none" />
      </g>
      <g transform={`translate(${tear * 40},${tear * 30}) rotate(${tear * 14})`}>
        <path d="M 0 -70 L 100 -70 L 100 70 L 0 70 L -10 40 L 6 0 L -14 -30 Z" fill="#DCCBA0" />
        <path d="M 10 -10 C 30 -30 50 -40 70 -50" stroke="#C62F3E" strokeWidth={6} strokeDasharray="10 8" fill="none" />
      </g>
    </g>
  </g>
);

/* ---------- HANCURNYA MASA DEPAN ---------- */
// buku teori medis ditutup keras (close 0..1)
export const MedBook: React.FC<{close: number}> = ({close}) => {
  const c = sm(close);
  return (
    <g>
      <Halo rx={260} ry={160} color="#BFD4FF" op={0.3} />
      <path d="M 0 0 L -230 -20 L -230 60 L 0 80 Z" fill="#F4EEE2" />
      <path d="M -230 -20 L -230 60" stroke="#C9C1B4" strokeWidth={4} />
      <g transform={`scale(${1 - c * 2},1)`}>
        <path d="M 0 0 L 230 -20 L 230 60 L 0 80 Z" fill={c > 0.5 ? '#2E6E8E' : '#F4EEE2'} />
        {c < 0.5 && [0, 1, 2, 3].map((i) => <path key={i} d={`M 20 ${10 + i * 14} L 200 ${-6 + i * 14}`} stroke="#9AA0AC" strokeWidth={4} />)}
        {c < 0.5 && <g transform="translate(110,6) scale(0.8)"><path d="M -14 -20 L 14 -20 L 14 -6 L 28 -6 L 28 20 L 14 20 L 14 34 L -14 34 L -14 20 L -28 20 L -28 -6 L -14 -6 Z" fill="#C62F3E" opacity={0.85} /></g>}
      </g>
      {close > 0.95 && <g opacity={clamp((1.1 - close) * 8)}>{[-1, 1].map((s) => <path key={s} d={`M ${s * 250} 20 l ${s * 40} -20 M ${s * 250} 40 l ${s * 50} 0`} stroke="#FFFFFF" strokeWidth={5} />)}</g>}
    </g>
  );
};
// grafik performa di layar presentasi turun tajam (k 0..1)
export const ChartDrop: React.FC<{k: number}> = ({k}) => {
  const pts = [[-160, -60], [-90, -90], [-20, -70], [30, -100], [80, 20], [150, 110]];
  const n = 1 + k * (pts.length - 1);
  const shown = pts.slice(0, Math.floor(n) + 1);
  const fr = n - Math.floor(n);
  const last = pts[Math.min(pts.length - 1, Math.floor(n))], nxt = pts[Math.min(pts.length - 1, Math.floor(n) + 1)];
  const tip = [last[0] + (nxt[0] - last[0]) * fr, last[1] + (nxt[1] - last[1]) * fr];
  return (
    <g>
      <Halo rx={300} ry={200} color="#BFD4FF" op={0.3} />
      <rect x={-220} y={-160} width={440} height={300} rx={12} fill="#E8EEF4" />
      <path d="M -180 -130 L -180 110 L 190 110" stroke="#9AA0AC" strokeWidth={5} fill="none" />
      {[-80, -10].map((y) => <line key={y} x1={-180} y1={y} x2={190} y2={y} stroke="#C9CED8" strokeWidth={2} />)}
      <polyline points={[...shown.slice(0, -1), tip].map((p) => p.join(',')).join(' ')} stroke={k > 0.55 ? RED : '#2E8E6E'} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {k > 0.6 && <path d={`M ${tip[0] - 26} ${tip[1] - 16} L ${tip[0] + 6} ${tip[1] + 6} L ${tip[0] - 30} ${tip[1] + 18}`} stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};
// tumpukan berkas makin tinggi (h 0..1) + coretan pulpen di kalender diatur di scene
export const FileStack: React.FC<{h: number; t: number}> = ({h, t}) => {
  const n = Math.round(4 + h * 10);
  return (
    <g>
      <Halo y={-n * 14} rx={200} ry={260} color={WARM} op={0.25} />
      {Array.from({length: n}).map((_, i) => (
        <g key={i} transform={`translate(${Math.sin(i * 1.7) * 10 + (i === n - 1 ? Math.sin(t * 0.2) * 3 : 0)},${-i * 28}) rotate(${Math.sin(i * 2.3) * 3})`}>
          <rect x={-120} y={-24} width={240} height={26} rx={3} fill={i % 3 === 0 ? '#E8D8B0' : i % 3 === 1 ? '#F4EEE2' : '#D8C8A0'} />
          <rect x={-110} y={-20} width={60} height={6} fill="#C62F3E" opacity={i % 4 === 0 ? 0.7 : 0} />
        </g>
      ))}
    </g>
  );
};
// kalender bulanan dengan tanggal dicoret-coret (cross 0..1)
export const CalendarCrossed: React.FC<{cross: number}> = ({cross}) => (
  <g>
    <Halo rx={200} color={WARM} op={0.25} />
    <rect x={-150} y={-150} width={300} height={310} rx={18} fill="#F5E6DA" />
    <path d="M -150 -130 Q -150 -150 -130 -150 L 130 -150 Q 150 -150 150 -130 L 150 -90 L -150 -90 Z" fill="#C62F3E" />
    {Array.from({length: 20}).map((_, i) => {
      const x = -120 + (i % 5) * 60, y = -60 + Math.floor(i / 5) * 54;
      const c = clamp(cross * 20 - i);
      return (
        <g key={i}>
          <rect x={x - 20} y={y - 18} width={40} height={36} rx={6} fill="#E4D6C8" />
          {c > 0 && <path d={`M ${x - 18} ${y - 14} L ${x - 18 + 36 * c} ${y - 14 + 30 * c} M ${x + 18} ${y - 14} L ${x + 18 - 36 * c} ${y - 14 + 30 * c}`} stroke="#C62F3E" strokeWidth={5} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);
// rambu "JALAN PINTAS" menunjuk ke kanan (swing 0..1 berdecit)
export const ShortcutSign: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g transform={`rotate(${Math.sin(t * 0.4) * 3 * (1 - p)})`}>
    <rect x={-10} y={-40} width={20} height={340} fill="#8A90A0" />
    <g transform={`translate(0,-80) scale(${sm(p)},1)`}>
      <Halo x={60} rx={240} ry={110} color={GOLD} op={0.4} />
      <path d="M -150 -56 L 190 -56 L 250 0 L 190 56 L -150 56 Z" fill="#FFD166" stroke="#15121C" strokeWidth={8} />
      {T(30, -6, 'JALAN', 40, '#15121C')}
      {T(30, 38, 'PINTAS', 40, '#15121C')}
    </g>
  </g>
);
// jam pasir: pasir mengalir terus (k 0..1 = isi bawah)
export const Hourglass: React.FC<{k: number; t: number}> = ({k, t}) => (
  <g>
    <Halo rx={220} ry={280} color={GOLD} op={0.35} />
    <rect x={-150} y={-230} width={300} height={24} rx={8} fill="#8A6A3A" /><rect x={-150} y={206} width={300} height={24} rx={8} fill="#8A6A3A" />
    <path d="M -120 -206 L 120 -206 Q 120 -60 14 0 Q 120 60 120 206 L -120 206 Q -120 60 -14 0 Q -120 -60 -120 -206 Z" fill="#BFE6F0" opacity={0.25} stroke="#E8F4F8" strokeWidth={5} />
    <path d={`M ${-110 + k * 90} ${-206 + 60 + k * 120} Q 0 ${-206 + 80 + k * 120} ${110 - k * 90} ${-206 + 60 + k * 120} Q 60 -40 6 -6 L -6 -6 Q -60 -40 ${-110 + k * 90} ${-206 + 60 + k * 120} Z`} fill={GOLD} opacity={k < 0.98 ? 1 : 0} />
    <rect x={-3} y={-6} width={6} height={200} fill={GOLD} opacity={0.8 + 0.2 * Math.sin(t)} />
    <path d={`M -110 206 Q 0 ${206 - 40 - k * 120} 110 206 Z`} fill={GOLD} />
  </g>
);
// lilin & tanaman "POTENSI" padam dan layu (die 0..1)
export const PotentialCandle: React.FC<{die: number; t: number}> = ({die, t}) => {
  const d = sm(die);
  return (
    <g>
      <Halo y={-180} rx={260} color={GOLD} op={0.55 * (1 - d)} />
      {/* lilin */}
      <g transform="translate(-110,0)">
        <rect x={-40} y={-220} width={80} height={220} rx={10} fill="#F4EEE2" />
        <path d="M -40 -200 Q -30 -170 -36 -150" stroke="#E4D6C8" strokeWidth={8} fill="none" />
        <rect x={-3} y={-246} width={6} height={28} fill="#2A2228" />
        {d < 1 && <g transform={`translate(0,-250) scale(${1 - d},${(1 - d) * (1 + 0.1 * Math.sin(t * 0.7))})`}>
          <path d="M -18 0 Q 0 -90 18 0 Q 0 16 -18 0 Z" fill="#FFB23F" /><path d="M -8 0 Q 0 -44 8 0 Q 0 8 -8 0 Z" fill="#FFF4E0" />
        </g>}
        {d > 0.3 && [0, 1, 2].map((i) => {
          const ph = (t * 0.02 + i / 3) % 1;
          return <circle key={i} cx={Math.sin(ph * 6 + i) * 16} cy={-260 - ph * 140} r={10 + ph * 22} fill="#8A8A90" opacity={(d - 0.3) * (1 - ph) * 0.6} />;
        })}
      </g>
      {/* tanaman dalam pot */}
      <g transform="translate(120,0)">
        <path d="M -60 -90 L 60 -90 L 46 0 L -46 0 Z" fill="#B85C3A" />
        <path d={`M 0 -90 Q ${d * 30} -180 ${d * 90} ${-240 + d * 120}`} stroke={mix('#4FD18B', '#6A5A3A', d)} strokeWidth={10} fill="none" />
        {[[-1, -160], [1, -200]].map(([s, y], i) => (
          <ellipse key={i} cx={s * 40 + d * 40} cy={y + d * 70} rx={40} ry={18} fill={mix('#6FE0A0', '#7A6A3A', d)} transform={`rotate(${s * 30 + d * 60 * s},${s * 40 + d * 40},${y + d * 70})`} />
        ))}
      </g>
      {/* label POTENSI */}
      <g transform="translate(0,60)">
        <rect x={-130} y={-30} width={260} height={60} rx={12} fill={mix('#FFD166', '#5A5450', d)} />
        {T(0, 14, 'POTENSI', 40, '#15121C')}
      </g>
    </g>
  );
};
// gear berkarat dalam kepala: HeadProfile dengan rust (dipakai di scene)
