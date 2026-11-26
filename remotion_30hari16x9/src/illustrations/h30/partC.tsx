// Ilustrasi BARU video 30 hari 16:9 — bagian C: HARI 21-30, BUTUH 66 HARI, NEUROPLASTICITY + ikon panel neon. Semua DINAMIS
// (kecuali NeonIcon yang memang statis di panel).
import React from 'react';
import {clamp, mix, rand} from '../../theme';
import {Halo} from '../../components/Lit';
import {BRAIN_PATH, BrainShape, TX, sm} from './partA';

const GOLD = '#FFD26A', AMB = '#FFB23F', GRN = '#3FF08A';

/* 32. Sinar matahari terbit memantul di genangan (sinar berputar pelan) */
export const SunRays: React.FC<{t: number; up: number}> = ({t, up}) => (
  <g opacity={sm(up)}>
    <Halo rx={360} ry={260} color={GOLD} op={0.55} />
    <g transform={`rotate(${t * 0.2})`}>{Array.from({length: 14}).map((_, i) => <path key={i} d="M 0 0 L 420 -24 L 420 24 Z" fill={GOLD} opacity={0.08} transform={`rotate(${i * 25.7})`} />)}</g>
    <circle r={80} fill="#FFE8A8" />
  </g>
);

/* 33. Pintu didorong dari balik oleh bayangan merah, lalu gerendel dikunci (lock 0..1) */
export const ShadowDoor: React.FC<{t: number; lock: number}> = ({t, lock}) => {
  const push = (1 - sm(lock)) * (6 + Math.sin(t * 0.9) * 6);
  return (
    <g>
      <Halo rx={240} ry={360} color="#FF3B4A" op={0.25 * (1 - lock)} />
      <rect x={-150} y={-320} width={300} height={640} fill="#3A2A22" />
      <g transform={`rotate(${push * 0.4},-140,0)`}>
        <rect x={-140} y={-310} width={280} height={620} fill="#7A5A3A" />
        {[[-110, -270, 220, 240], [-110, 20, 220, 250]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={8} fill="none" stroke="#5A3E26" strokeWidth={10} />)}
        <g transform={`translate(${60 + sm(lock) * 70},0)`}><rect x={-40} y={-12} width={110} height={24} rx={8} fill="#E3C66A" /></g>
        <rect x={80} y={-28} width={50} height={56} rx={6} fill="#B8963A" />
      </g>
      {/* bayangan merah di celah pintu */}
      <path d={`M 140 -300 Q ${190 + push * 3} 0 140 300 L 200 300 L 200 -300 Z`} fill="#FF2A3A" opacity={0.35 * (1 - lock)} />
      {Array.from({length: 5}).map((_, i) => <path key={i} d={`M 150 ${-200 + i * 100} q ${20 + push * 2} 10 40 0`} stroke="#FF6A6A" strokeWidth={6} fill="none" opacity={(1 - lock) * 0.7} />)}
    </g>
  );
};

/* 34. Rambu persimpangan dua arah + otak kecil berkaki memilih jalan yang terang (choose 0..1) */
export const BrainCrossroad: React.FC<{t: number; choose: number}> = ({t, choose}) => {
  const c = sm(choose), step = Math.sin(t * 0.5);
  return (
    <g>
      <path d="M 0 260 L -40 40 L -560 -60 L -560 0 L -60 90 L -60 260 Z" fill="#3A3A44" opacity={0.7} />
      <path d="M 0 260 L 40 40 L 560 -60 L 560 0 L 60 90 L 60 260 Z" fill={mix('#4A4A40', GOLD, 0.5)} opacity={0.9} />
      <Halo x={420} y={-40} rx={260} ry={120} color={GOLD} op={0.5} />
      <g transform="translate(0,-120)">
        <rect x={-8} y={0} width={16} height={260} fill="#8A90A0" />
        <g transform={`rotate(${Math.sin(t * 0.3) * 2})`}><path d="M 10 -10 L 190 -10 L 220 20 L 190 50 L 10 50 Z" fill={GOLD} /><path d="M -10 60 L -190 60 L -220 90 L -190 120 L -10 120 Z" fill="#5A5A66" /></g>
      </g>
      <g transform={`translate(${c * 260},${120 - c * 120 + Math.abs(step) * -8}) scale(0.32)`}>
        <BrainShape fill="#FFC8D8" line="#8A4A5A" t={t} glow={c > 0.3 ? GOLD : undefined} />
        {[-1, 1].map((s) => <path key={s} d={`M ${s * 50} 110 L ${s * 50 + (s === 1 ? step : -step) * 30} 220`} stroke="#8A4A5A" strokeWidth={22} strokeLinecap="round" />)}
      </g>
    </g>
  );
};

/* 35. Jam saku terbuka, kegiatan mini terbang keluar (kanvas, sepeda, panci, gitar) */
export const PocketWatchActivities: React.FC<{t: number; open: number}> = ({t, open}) => {
  const o = sm(open);
  const icons = [
    (k: number) => <g key={k}><rect x={-26} y={-34} width={52} height={60} fill="#F4EEE2" stroke="#8A5A2E" strokeWidth={5} /><circle cx={-6} cy={-8} r={9} fill="#FF6A6A" /><circle cx={10} cy={6} r={9} fill="#3F8AFF" /></g>,
    (k: number) => <g key={k}><circle cx={-24} cy={10} r={18} fill="none" stroke="#3FF08A" strokeWidth={5} /><circle cx={24} cy={10} r={18} fill="none" stroke="#3FF08A" strokeWidth={5} /><path d="M -24 10 L 0 -16 L 24 10 M 0 -16 L -6 -26" stroke="#3FF08A" strokeWidth={5} fill="none" /></g>,
    (k: number) => <g key={k}><rect x={-30} y={-10} width={60} height={30} rx={8} fill="#C9CED8" /><rect x={30} y={-4} width={30} height={8} rx={4} fill="#8A90A0" />{[0, 1].map((i) => <path key={i} d={`M ${-10 + i * 20} -16 q 6 -10 0 -20`} stroke="#FFFFFF" strokeWidth={3} fill="none" />)}</g>,
    (k: number) => <g key={k} transform="rotate(-30)"><ellipse cy={16} rx={22} ry={26} fill="#E8A050" /><rect x={-5} y={-50} width={10} height={50} fill="#8A5A2E" /><circle cy={14} r={7} fill="#3A2A1A" /></g>,
  ];
  return (
    <g>
      <Halo rx={300} color={GOLD} op={0.4 * o} />
      <circle r={120} fill="#E8C060" /><circle r={100} fill="#FFF8E8" />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={-3} y={-92} width={6} height={12} fill="#8A6A30" transform={`rotate(${i * 30})`} />)}
      <g transform={`rotate(${t * 2})`}><rect x={-3} y={-74} width={6} height={74} fill="#3A2A1A" /></g>
      <rect x={-14} y={-150} width={28} height={30} rx={8} fill="#E8C060" />
      <g transform={`rotate(${-o * 110},0,-120)`}><circle r={120} fill="#D8B050" opacity={0.95} /></g>
      {icons.map((ic, i) => {
        const ph = ((t * 0.012 + i / 4) % 1);
        const a = -Math.PI / 2 + (i - 1.5) * 0.6;
        return <g key={i} transform={`translate(${Math.cos(a) * (60 + ph * 300)},${Math.sin(a) * (60 + ph * 260)}) scale(${0.6 + ph * 0.8})`} opacity={o * Math.sin(ph * Math.PI)}>{ic(i)}</g>;
      })}
    </g>
  );
};

/* 36. Target panah + anak panah terbang lurus jauh dan menancap tepat di tengah (fly 0..1) */
export const ArrowTarget: React.FC<{t: number; fly: number; dist?: number}> = ({t, fly, dist = 900}) => {
  const f = sm(fly), x = -dist / 2 + f * dist;
  const wob = f >= 1 ? Math.sin(t * 1.6) * 4 * Math.max(0, 1 - ((t % 40) / 40)) : 0;
  return (
    <g>
      <g transform={`translate(${dist / 2 + 40},0)`}>
        <Halo rx={180} color={GRN} op={0.35} />
        {[140, 110, 80, 50, 22].map((r, i) => <circle key={r} r={r} fill={i % 2 ? '#F4EEE2' : '#E84A4A'} />)}
        <rect x={-10} y={140} width={20} height={120} fill="#8A5A2E" />
      </g>
      {f < 1 && <line x1={-dist / 2} y1={0} x2={x - 40} y2={0} stroke="#FFFFFF" strokeWidth={2} opacity={0.3} strokeDasharray="10 14" />}
      <g transform={`translate(${Math.min(x, dist / 2 + 40) - 30},0) rotate(${wob})`}>
        <line x1={-120} y1={0} x2={0} y2={0} stroke="#C9A06A" strokeWidth={7} /><path d="M 0 0 l -24 -11 l 0 22 Z" fill="#C9CED8" transform="translate(24,0)" />
        <path d="M -120 0 l -18 -14 M -120 0 l -18 14 M -104 0 l -18 -14 M -104 0 l -18 14" stroke={GRN} strokeWidth={5} />
      </g>
    </g>
  );
};

/* 37. Layangan terbang berkibar; tangan merah yang dulu memegang benang memudar (fade 0..1) */
export const KiteFree: React.FC<{t: number; fade: number}> = ({t, fade}) => (
  <g>
    <g transform={`translate(${Math.sin(t * 0.05) * 30},${Math.sin(t * 0.08) * 20}) rotate(${Math.sin(t * 0.09) * 10})`}>
      <Halo rx={180} color={GOLD} op={0.35} />
      <path d="M 0 -120 L 90 0 L 0 140 L -90 0 Z" fill="#FF8A3A" /><path d="M 0 -120 L 0 140 M -90 0 L 90 0" stroke="#FFE0A0" strokeWidth={5} />
      <path d={`M 0 140 Q ${Math.sin(t * 0.3) * 30} 200 0 260 Q ${-Math.sin(t * 0.3) * 30} 320 0 380`} stroke="#FFE0A0" strokeWidth={4} fill="none" />
      {[0, 1, 2].map((i) => <path key={i} d={`M -12 ${190 + i * 60} l 24 -10 l 0 20 Z`} fill={['#3FF08A', '#3F8AFF', '#FF5FA2'][i]} />)}
    </g>
    <g opacity={1 - sm(fade)} transform={`translate(-260,300)`}>
      <path d="M 0 0 C -20 -40 20 -60 40 -40 L 70 -70 L 90 -50 L 60 -20 C 80 0 60 40 20 40 Z" fill="#FF3B4A" opacity={0.7} />
      <line x1={60} y1={-40} x2={260} y2={-300} stroke="#FF3B4A" strokeWidth={3} opacity={0.7} />
    </g>
  </g>
);

/* 38. Maskot otak tengah BARU: makhluk bulat merah-koral bertelinga kecil, tidur nyenyak di keranjang (napas naik-turun, Zzz) */
export const SleepyMidbrain: React.FC<{t: number}> = ({t}) => {
  const br = Math.sin(t * 0.1);
  return (
    <g>
      <Halo rx={260} ry={180} color="#FF8A7A" op={0.3} />
      <g transform={`translate(0,${-40}) scale(${1 + br * 0.03},${1 - br * 0.03})`}>
        <ellipse cx={0} cy={0} rx={130} ry={96} fill="#F0605A" />
        {[-1, 1].map((s) => <ellipse key={s} cx={s * 80} cy={-80} rx={26} ry={20} fill="#F0605A" />)}
        <path d="M -60 -20 Q -40 -8 -20 -20 M 20 -20 Q 40 -8 60 -20" stroke="#5A1A1A" strokeWidth={7} fill="none" strokeLinecap="round" />
        <ellipse cx={0} cy={24} rx={12} ry={6 + br * 2} fill="#8A2A2A" />
        {[-1, 1].map((s) => <ellipse key={s} cx={s * 76} cy={10} rx={18} ry={10} fill="#FF9A90" opacity={0.7} />)}
      </g>
      <path d="M -200 0 Q -200 120 0 130 Q 200 120 200 0 Z" fill="#B8864A" />
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-190 + i * 60} 10 L ${-160 + i * 60} 120`} stroke="#8A5E2E" strokeWidth={6} />)}
      <rect x={-210} y={-12} width={420} height={24} rx={12} fill="#D8A060" />
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.015 + i / 3) % 1);
        return <g key={i} transform={`translate(${120 + ph * 80},${-150 - ph * 120}) scale(${0.6 + ph * 0.6})`} opacity={Math.sin(ph * Math.PI)}>{TX(0, 0, 'z', 50, '#FFF4E0')}</g>;
      })}
    </g>
  );
};

/* 39. PFC emas berbentuk mercusuar kecil, sinarnya memutar menerangi taman */
export const PfcLighthouse: React.FC<{t: number; on: number}> = ({t, on}) => {
  const a = t * 2.4;
  return (
    <g>
      <g opacity={on} transform={`translate(0,-200)`}>
        <g transform={`rotate(${a})`}><path d="M 0 0 L 900 -90 L 900 90 Z" fill={GOLD} opacity={0.22} /><path d="M 0 0 L -900 -60 L -900 60 Z" fill={GOLD} opacity={0.1} /></g>
        <Halo rx={140} color={GOLD} op={0.8} />
      </g>
      <path d="M -70 260 L -40 -150 L 40 -150 L 70 260 Z" fill="#F4EEE2" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-64 + i * 9} ${180 - i * 120} L ${64 - i * 9} ${180 - i * 120} L ${60 - i * 9} ${130 - i * 120} L ${-60 + i * 9} ${130 - i * 120} Z`} fill="#E84A4A" />)}
      <rect x={-56} y={-230} width={112} height={80} rx={10} fill={mix('#5A5040', GOLD, on)} />
      <g transform="translate(0,-205) scale(0.22)"><BrainShape fill={mix('#8A7A5A', GOLD, on)} line="#8A5A1A" t={t} /></g>
      <path d="M -70 -230 L 0 -290 L 70 -230 Z" fill="#3A3A44" />
    </g>
  );
};

/* 40. Bibit tanaman tumbuh, akar makin dalam, angka di pot naik 30 -> 66 */
export const SproutRoots: React.FC<{t: number; grow: number}> = ({t, grow}) => {
  const g = sm(grow), n = Math.round(30 + g * 36);
  return (
    <g>
      <Halo y={-60} rx={260} color={GRN} op={0.35} />
      <rect x={-260} y={40} width={520} height={240} fill="#3A2A1E" opacity={0.85} />
      {Array.from({length: 7}).map((_, i) => {
        const len = 40 + g * (120 + i * 18), a = -0.9 + i * 0.3;
        return <path key={i} d={`M 0 60 Q ${Math.sin(a) * len * 0.5} ${60 + len * 0.4} ${Math.sin(a) * len} ${60 + Math.cos(a) * len}`} stroke="#D8C8A0" strokeWidth={5 - i * 0.3} fill="none" opacity={0.8} />;
      })}
      <path d="M -110 -40 L 110 -40 L 90 60 L -90 60 Z" fill="#C8643A" />
      {TX(0, 30, String(n), 54, '#FFF4E0')}
      <g transform={`translate(0,-40) scale(${0.4 + g * 0.6})`}>
        <path d={`M 0 0 Q ${Math.sin(t * 0.06) * 10} -120 0 -220`} stroke="#5AC85A" strokeWidth={12} fill="none" />
        {[[-1, -120], [1, -170], [-1, -210]].map(([s, y], i) => (
          <ellipse key={i} cx={s * 50} cy={y} rx={56} ry={22} fill="#6AE06A" transform={`rotate(${s * -30 + Math.sin(t * 0.08 + i) * 6},${s * 50},${y})`} />
        ))}
      </g>
    </g>
  );
};

/* 41. Checkpoint kecil "30" di lintasan (kerucut + papan kecil) — lintasan berlanjut panjang */
export const Checkpoint30: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={140} color={GOLD} op={0.35} />
    <path d="M -40 60 L 0 -60 L 40 60 Z" fill="#FF8A3A" /><rect x={-34} y={0} width={68} height={12} fill="#FFFFFF" />
    <g transform={`translate(90,-40) rotate(${Math.sin(t * 0.2) * 3})`}><rect x={-4} y={0} width={8} height={100} fill="#C9CED8" /><rect x={-46} y={-50} width={92} height={54} rx={8} fill="#F4EEE2" />{TX(0, -8, '30', 40, '#3A3A44')}</g>
    {Array.from({length: 6}).map((_, i) => <path key={i} d={`M ${200 + i * 120} 40 l 60 0`} stroke="#FFFFFF" strokeWidth={6} opacity={0.5 - i * 0.07} strokeDasharray="20 16" strokeDashoffset={-t * 4} />)}
  </g>
);

/* 43. Awan mimpi blur di atas kepala menguap jadi ikon centang hijau (k 0..1) */
export const DreamToCheck: React.FC<{t: number; k: number}> = ({t, k}) => {
  const e = sm(k);
  return (
    <g>
      <g opacity={1 - e} transform={`scale(${1 + e * 0.3})`}>
        {[[-60, 0, 60], [0, -30, 70], [60, 0, 60], [0, 20, 70]].map(([x, y, r], i) => <circle key={i} cx={x + Math.sin(t * 0.05 + i) * 4} cy={y} r={r} fill="#C8D8FF" opacity={0.55} />)}
        {Array.from({length: 6}).map((_, i) => <circle key={i} cx={(rand(i) - 0.5) * 140} cy={(rand(i * 2) - 0.5) * 80 - e * 80} r={6} fill="#FFFFFF" opacity={0.6} />)}
      </g>
      <g opacity={e} transform={`scale(${0.6 + e * 0.4 + Math.sin(t * 0.2) * 0.02})`}>
        <Halo rx={120} color={GRN} op={0.6} /><circle r={70} fill={GRN} /><path d="M -32 0 L -8 24 L 34 -22" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

/* 44. Bendungan kecil: pintu air terbuka sendiri saat air penuh, air mengalir lembut, daun bergoyang */
export const MiniDam: React.FC<{t: number; open: number}> = ({t, open}) => {
  const o = sm(open), lvl = 1 - o * 0.4;
  return (
    <g>
      <Halo rx={360} ry={220} color="#8FD8FF" op={0.3} />
      <rect x={-320} y={-60 - lvl * 80} width={260} height={180 + lvl * 80} fill="#3A8AC8" opacity={0.7} />
      {Array.from({length: 4}).map((_, i) => <path key={i} d={`M -320 ${-50 - lvl * 80 + i * 6} q 40 ${Math.sin(t * 0.2 + i) * 6} 80 0 t 80 0 t 80 0`} stroke="#BFE8FF" strokeWidth={3} fill="none" opacity={0.6} />)}
      <rect x={-60} y={-160} width={90} height={280} fill="#8A8A90" />
      <rect x={-50} y={-60 - o * 110} width={70} height={130} fill="#5A5A66" /><rect x={-40} y={-200 - o * 110} width={10} height={140} fill="#C9CED8" />
      {o > 0.1 && Array.from({length: 8}).map((_, i) => {
        const ph = ((t * 0.05 + i / 8) % 1);
        return <path key={i} d={`M 30 ${60 - i * 4} q ${80 * ph} ${40 * ph} ${160 * ph + 80} ${60}`} stroke="#8FD8FF" strokeWidth={10 - i} fill="none" opacity={o * 0.6} />;
      })}
      <rect x={30} y={100} width={300} height={40} fill="#3A8AC8" opacity={0.5 * o} />
      {[[-260, -200], [200, -60], [280, 40]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={40} ry={16} fill="#5AC85A" transform={`rotate(${-20 + Math.sin(t * 0.1 + i) * 12},${x},${y})`} />
      ))}
    </g>
  );
};

/* 45. Engkol mesin besi diputar paksa lalu dicoret silang & berhenti (cross 0..1) */
export const ForcedCrank: React.FC<{t: number; cross: number}> = ({t, cross}) => {
  const c = sm(cross), spin = (1 - c) * t * 9;
  return (
    <g>
      <Halo rx={260} color="#B8C0D0" op={0.25} />
      <rect x={-200} y={-120} width={280} height={240} rx={18} fill="#4A4E5A" />
      {[-140, -80, -20, 40].map((x) => <rect key={x} x={x} y={-100} width={20} height={200} fill="#3A3E48" />)}
      <g transform={`translate(80,0) rotate(${spin})`}>
        <circle r={36} fill="#8A8E9A" /><rect x={-10} y={-130} width={20} height={130} fill="#9AA0AC" /><rect x={-60} y={-150} width={80} height={28} rx={10} fill="#C84A3A" />
      </g>
      {[0, 1, 2].map((i) => <path key={i} d={`M 150 ${-60 + i * 50} q 12 6 0 14`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={(1 - c) * (Math.floor(t / 3 + i) % 2)} />)}
      {c > 0 && <g><path d={`M -230 -170 L ${-230 + 460 * c} ${-170 + 340 * c}`} stroke="#FF3B4A" strokeWidth={22} strokeLinecap="round" />
        {c > 0.5 && <path d={`M 230 -170 L ${230 - 460 * (c - 0.5) * 2} ${-170 + 340 * (c - 0.5) * 2}`} stroke="#FF3B4A" strokeWidth={22} strokeLinecap="round" />}</g>}
    </g>
  );
};

/* 46. Neuron tumbuh bercabang seperti pohon cahaya amber (grow 0..1) */
export const NeuronTree: React.FC<{t: number; grow: number}> = ({t, grow}) => {
  const g = sm(grow);
  const br: Array<[number, number, number, number, number]> = [];
  const make = (x: number, y: number, a: number, len: number, d: number) => {
    if (d > 4) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    br.push([x, y, x2, y2, d]);
    make(x2, y2, a - 0.45 - rand(d * 7 + x) * 0.2, len * 0.72, d + 1);
    make(x2, y2, a + 0.45 + rand(d * 3 + y) * 0.2, len * 0.72, d + 1);
  };
  make(0, 240, -Math.PI / 2, 170, 0);
  return (
    <g>
      <Halo y={0} rx={420} ry={320} color={AMB} op={0.4} />
      {br.map(([x1, y1, x2, y2, d], i) => {
        const p = clamp(g * 5 - d);
        return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={mix(AMB, '#FFF4E0', d / 5)} strokeWidth={14 - d * 2.5} strokeLinecap="round" opacity={0.9} />;
      })}
      {br.filter((b) => b[4] === 4).map(([, , x2, y2], i) => g > 0.95 && <g key={i}><circle cx={x2} cy={y2} r={8 + Math.sin(t * 0.2 + i) * 3} fill="#FFF4E0" /><Halo x={x2} y={y2} rx={24} color={AMB} op={0.7} /></g>)}
      <circle cy={240} r={40} fill={AMB} /><Halo y={240} rx={80} color={AMB} op={0.7} />
    </g>
  );
};

/* 47. Jejak kaki di lantai gelap: hanya jalur yang benar menyala satu-satu (k 0..1), jalur salah redup */
export const GlowFootsteps: React.FC<{t: number; k: number; len?: number}> = ({t, k, len = 1000}) => {
  const N = 9;
  const foot = (x: number, y: number, on: number, flip: number, key: string) => (
    <g key={key} transform={`translate(${x},${y}) scale(1,0.45) rotate(${90 + flip * 6})`}>
      {on > 0 && <Halo rx={50} color={AMB} op={0.7 * on} />}
      <ellipse rx={18} ry={30} fill={on > 0 ? '#FFE0A0' : '#3A3228'} opacity={on > 0 ? 1 : 0.6} />
      {[-10, 0, 10].map((dx) => <circle key={dx} cx={dx} cy={-36} r={5} fill={on > 0 ? '#FFE0A0' : '#3A3228'} />)}
    </g>
  );
  return (
    <g>
      {Array.from({length: N}).map((_, i) => foot(-len / 2 + i * len / N, i % 2 ? 26 : -26, clamp(k * N - i) * (0.85 + 0.15 * Math.sin(t * 0.3 + i)), i % 2 ? 1 : -1, 'a' + i))}
      {Array.from({length: 5}).map((_, i) => foot(-len / 2 + 120 + i * 140, 140 + i * 30, 0, 1, 'b' + i))}
    </g>
  );
};

/* 48. Otak berbentuk kota kecil: lampu-lampu jalan menyala lagi satu per satu (on 0..1) */
export const BrainCity: React.FC<{t: number; on: number}> = ({t, on}) => {
  const bld: Array<[number, number, number]> = [[-140, 60, 90], [-100, 40, 140], [-60, 50, 110], [-20, 36, 170], [20, 48, 130], [60, 40, 160], [100, 50, 100], [130, 40, 70]];
  return (
    <g>
      <Halo rx={360} ry={260} color={AMB} op={0.25 + 0.3 * on} />
      <clipPath id="bcity"><path d={BRAIN_PATH} transform="scale(1.4)" /></clipPath>
      <path d={BRAIN_PATH} transform="scale(1.4)" fill="#2A2018" stroke={mix('#5A4A3A', AMB, on)} strokeWidth={6} />
      <g clipPath="url(#bcity)">
        {bld.map(([x, w, h], i) => (
          <g key={i}><rect x={x * 1.4 - w / 2} y={150 - h} width={w} height={h} fill="#3A2E22" />
            {Array.from({length: Math.floor(h / 30)}).map((_, k) => <rect key={k} x={x * 1.4 - w / 2 + 8} y={160 - h + k * 30} width={w - 16} height={12}
              fill={clamp(on * 9 - i - k * 0.3) > 0.5 ? '#FFD48A' : '#2A2018'} opacity={0.8 + 0.2 * Math.sin(t * 0.3 + i + k)} />)}</g>
        ))}
        {Array.from({length: 8}).map((_, i) => {
          const lit = clamp(on * 8 - i);
          return <g key={i} transform={`translate(${-190 + i * 54},150)`}><rect x={-2} y={-40} width={4} height={40} fill="#8A7A6A" />{lit > 0 && <Halo y={-42} rx={30} color={AMB} op={0.8 * lit} />}<circle cy={-42} r={6} fill={lit > 0 ? '#FFF0C8' : '#4A3E30'} /></g>;
        })}
      </g>
    </g>
  );
};

/* 49. Ikon link baru: dua cincin cahaya bertaut (berdenyut) + chevron panah naik */
export const LinkRings: React.FC<{t: number}> = ({t}) => {
  const p = 1 + 0.06 * Math.sin(t * 0.25);
  return (
    <g>
      <Halo rx={240} color={AMB} op={0.5} />
      <g transform={`scale(${p}) rotate(-30)`}>
        <rect x={-150} y={-46} width={180} height={92} rx={46} fill="none" stroke="#FFE0A0" strokeWidth={20} />
        <rect x={-30} y={-46} width={180} height={92} rx={46} fill="none" stroke={AMB} strokeWidth={20} />
      </g>
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.03 + i / 3) % 1);
        return <path key={i} d={`M 210 ${60 - ph * 200} l 40 -40 l 40 40`} stroke="#FFE0A0" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={Math.sin(ph * Math.PI)} />;
      })}
    </g>
  );
};

/* 51. Penutup: kilau kristal "charge penuh" (opsional di atas baterai) */
export const ChargeSparkle: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g opacity={Math.sin(clamp(k) * Math.PI)}>
    {Array.from({length: 8}).map((_, i) => <path key={i} d="M 0 -40 L 6 -6 L 40 0 L 6 6 L 0 40 L -6 6 L -40 0 L -6 -6 Z" fill="#FFFFFF" transform={`rotate(${i * 45 + t}) scale(${0.3 + (i % 2) * 0.2}) translate(${60 + i * 6},0)`} />)}
  </g>
);

/* IKON PANEL NEON (STATIS, ±56 px, garis neon) */
export const NeonIcon: React.FC<{name: string; c: string; s?: number}> = ({name, c, s = 56}) => {
  const k = s / 56;
  const st = {stroke: c, strokeWidth: 3.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <g transform={`scale(${k})`} style={{filter: `drop-shadow(0 0 3px ${c}) drop-shadow(0 0 8px ${c})`}}>
      {name === 'phone_lock' && <g><rect x={-14} y={-24} width={28} height={48} rx={6} {...st} /><rect x={-6} y={-2} width={24} height={18} rx={3} {...st} transform="translate(6,6)" /><path d="M 6 4 v -6 a 6 6 0 0 1 12 0 v 6" {...st} /></g>}
      {name === 'molecule' && <g><polygon points="-14,-8 0,-16 14,-8 14,8 0,16 -14,8" {...st} /><circle cx={0} cy={-16} r={3} fill={c} /><circle cx={14} cy={8} r={3} fill={c} /><line x1={14} y1={-8} x2={24} y2={-16} {...st} /><circle cx={24} cy={-17} r={3.5} fill={c} /></g>}
      {name === 'flat_circle' && <g><circle r={22} {...st} /><line x1={-16} y1={0} x2={16} y2={0} {...st} /></g>}
      {name === 'shield_check' && <g><path d="M 0 -24 L 20 -16 L 18 6 Q 14 20 0 26 Q -14 20 -18 6 L -20 -16 Z" {...st} /><path d="M -9 0 L -2 8 L 10 -8" {...st} /></g>}
      {name === 'sprout' && <g><path d="M 0 24 L 0 -4" {...st} /><path d="M 0 -4 Q -18 -6 -20 -22 Q -2 -22 0 -4 Z" {...st} /><path d="M 0 2 Q 18 0 20 -14 Q 2 -16 0 2 Z" {...st} /><line x1={-14} y1={24} x2={14} y2={24} {...st} /></g>}
      {name === 'neuron' && <g><circle r={8} {...st} /><path d="M 0 -8 L -6 -24 M 7 -4 L 22 -14 M 7 4 L 20 16 M -7 4 L -22 12 M 0 8 L 4 24 M -7 -4 L -20 -14" {...st} /></g>}
    </g>
  );
};
