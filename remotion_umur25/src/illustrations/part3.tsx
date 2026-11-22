// Ilustrasi RISET (lab gelap) + FASE 3 (rumah pasangan). (0,0) = pusat objek.
// Adegan sensitif SELALU simbolik: bayangan, benda, ekspresi; tanpa kontak fisik/kekerasan/adegan ranjang.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, mix, rand} from '../theme';
import {useSid} from '../components/Phone';
import {Halo} from '../components/Lit';
import {CEREBRUM} from '../components/Brain';
import {PINK, BlurSilhouette, Phone18, backOut, ramp, smooth} from './shared';

/* ---------- RISET ---------- */
// lembar jurnal menyala + kaca pembesar menyapu: mag 0..1
export const JournalGlow: React.FC<{on: number; mag: number; title?: string; year?: string}> = ({on, mag, title = 'JAMA Psychiatry', year = '2014'}) => (
  <g>
    <Halo rx={330} ry={360} color="#FFF4E0" op={0.45 * on} />
    <g transform="rotate(-4)">
      <rect x={-210} y={-280} width={420} height={560} rx={8} fill={mix('#5A6170', '#FBF7EE', on)} />
      <rect x={-210} y={-280} width={420} height={90} fill={mix('#3A404C', '#C0262E', on)} />
      <text x={0} y={-238} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF">{title}</text>
      <text x={0} y={-204} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFFFFF" opacity={0.9}>{year}</text>
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={-170} y={-150 + i * 40} width={i === 3 ? 200 : 340 - (i % 3) * 40} height={12} rx={6} fill="#8A8F9A" opacity={0.55} />)}
      <rect x={-170} y={-150 + 3 * 40 - 6} width={300} height={24} fill="#FFD166" opacity={0.45 * on} />
    </g>
    <g transform={`translate(${lerp(-140, 120, smooth(mag))},${lerp(-60, 40, smooth(mag))})`}>
      <circle r={92} fill="#CFE8F0" opacity={0.18} /><circle r={92} fill="none" stroke="#3A3A48" strokeWidth={16} />
      <rect x={60} y={60} width={34} height={130} rx={14} fill="#3A3A48" transform="rotate(-45 60 60)" />
      <path d="M -50 -40 Q -30 -64 0 -66" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.6} />
    </g>
  </g>
);

// kalender mingguan + ikon jam bertumpuk (stack 0..1) + grafik batang naik (bars 0..1)
export const WeekHours: React.FC<{stack: number; bars: number}> = ({stack, bars}) => (
  <g>
    <Halo rx={380} ry={260} color="#7FB7C9" op={0.25} />
    <rect x={-360} y={-220} width={720} height={250} rx={14} fill="#E8EEF2" />
    <rect x={-360} y={-220} width={720} height={56} rx={14} fill="#3E6E8A" />
    {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
      <g key={i} transform={`translate(${-308 + i * 103},0)`}>
        <text y={-180} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">{d}</text>
        {Array.from({length: Math.floor(stack * (1 + (i % 4)) + 0.5)}).map((_, k) => (
          <g key={k} transform={`translate(0,${-30 - k * 36}) scale(${backOut(clamp(stack * 4 - k))})`}>
            <circle r={15} fill="#FFFFFF" stroke="#C0262E" strokeWidth={4} /><line x1={0} y1={0} x2={0} y2={-9} stroke="#3A3A48" strokeWidth={3} /><line x1={0} y1={0} x2={7} y2={3} stroke="#3A3A48" strokeWidth={3} />
          </g>
        ))}
      </g>
    ))}
    <g transform="translate(-300,260)">
      <line x1={0} y1={0} x2={620} y2={0} stroke="#CFE8F0" strokeWidth={4} />
      {[0.25, 0.4, 0.6, 0.8, 1].map((h, i) => <rect key={i} x={20 + i * 120} y={-170 * h * smooth(clamp(bars * 1.4 - i * 0.12))} width={80} height={170 * h * smooth(clamp(bars * 1.4 - i * 0.12))} rx={6} fill={mix('#7FD8F0', '#FF8A2B', i / 4)} />)}
    </g>
  </g>
);

// otak dengan striatum di-highlight yang mengecil + grafik garis turun: shrink 0..1
export const StriatumBrain: React.FC<{shrink: number; t: number}> = ({shrink, t}) => {
  const sc = lerp(1, 0.5, smooth(shrink));
  return (
    <g>
      <Halo rx={360} ry={280} color="#7FD8F0" op={0.22} />
      <path d={CEREBRUM} fill="#2A3A4E" /><path d={CEREBRUM} fill="none" stroke="#7FD8F0" strokeWidth={4} opacity={0.8} />
      {['M -170 -40 C -150 -70 -120 -60 -110 -90', 'M 40 -150 C 50 -120 80 -125 75 -95', 'M 30 -60 C 55 -50 70 -20 100 -20', 'M -60 70 C -40 50 -10 60 0 40'].map((d, i) => <path key={i} d={d} stroke="#4A7A9A" strokeWidth={4} fill="none" />)}
      <g transform={`translate(-10,-10) scale(${sc})`}>
        <Halo rx={110} color="#FF8A2B" op={0.6 + 0.2 * Math.sin(t * 0.3)} />
        <path d="M -60 -10 C -70 -60 10 -80 50 -50 C 80 -30 70 10 40 20 C 70 30 60 60 30 56 C 0 52 -50 40 -60 -10 Z" fill="#FF8A2B" />
        <path d="M -40 -20 C -30 -50 20 -56 40 -40" stroke="#FFD9A0" strokeWidth={6} fill="none" opacity={0.7} />
      </g>
      <g transform="translate(-180,250)">
        <rect x={0} y={-120} width={360} height={140} rx={10} fill="#0E1218" opacity={0.85} />
        <path d={`M 20 -100 ${[0.1, 0.25, 0.45, 0.6, 0.8, 1].map((u, i) => `L ${20 + u * 320} ${-100 + 90 * u * smooth(clamp(shrink * 1.3)) + (i % 2) * 6}`).join(' ')}`} stroke="#FF5A4A" strokeWidth={6} fill="none" strokeLinejoin="round" />
        <text x={20} y={10} fontFamily="Poppins" fontWeight={700} fontSize={20} fill="#9FB8C8">volume striatum</text>
      </g>
    </g>
  );
};

// peneliti (siluet abu-abu) + papan dengan panah eskalasi: arrows 0..1
export const ResearcherBoard: React.FC<{arrows: number; point: number}> = ({arrows, point}) => (
  <g>
    <g transform="translate(140,-480)">
      <Halo x={0} y={0} rx={300} ry={220} color="#7FB7C9" op={0.22} />
      <rect x={-260} y={-170} width={520} height={340} rx={10} fill="#1E3640" stroke="#3A5A66" strokeWidth={10} />
      {[0, 1, 2, 3].map((i) => {
        const k = smooth(clamp(arrows * 4 - i));
        const x = -200 + i * 120, y = 110 - i * 70;
        return (
          <g key={i} opacity={k}>
            <circle cx={x} cy={y} r={20} fill={mix('#7FD8F0', '#FF3B3B', i / 3)} />
            {i < 3 && <path d={`M ${x + 24} ${y - 10} L ${x + 96} ${y - 60}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeDasharray={`${k * 90} 200`} />}
            {i < 3 && k > 0.9 && <path d={`M ${x + 96} ${y - 60} l -22 2 m 22 -2 l -8 20`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />}
          </g>
        );
      })}
      <text x={-220} y={-120} fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#CFE8F0" opacity={0.8}>rangsangan ↑</text>
    </g>
    {/* peneliti siluet */}
    <g fill="#5A6170" transform="translate(-260,0)">
      <circle cx={0} cy={-560} r={56} />
      <path d="M -66 -492 L 66 -492 L 90 -60 L -90 -60 Z" fill="#6A7180" />
      <rect x={-60} y={-80} width={50} height={80} rx={18} /><rect x={10} y={-80} width={50} height={80} rx={18} />
      <g transform={`translate(60,-470) rotate(${-70 - point * 30})`}><rect x={-13} y={0} width={26} height={150} rx={13} /></g>
      <rect x={-30} y={-590} width={60} height={14} rx={6} fill="#3A404C" />
    </g>
  </g>
);

// treadmill + hati bercahaya digantung di tongkat (dipasang di depan karakter yang running_treadmill)
export const TreadmillHeart: React.FC<{t: number}> = ({t}) => (
  <g>
    <path d="M -260 0 L 260 0 L 240 -40 L -240 -40 Z" fill="#2A2E36" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={-230 + ((i * 50 - t * 9) % 500 + 500) % 500} y={-36} width={6} height={30} fill="#4A4E58" />)}
    <rect x={200} y={-360} width={20} height={330} fill="#3A3E48" /><rect x={150} y={-380} width={110} height={40} rx={10} fill="#3A3E48" />
    {/* tongkat + hati yang selalu di depan */}
    <g transform={`translate(0,${Math.sin(t * 0.25) * 8})`}>
      <path d="M 200 -380 Q 300 -460 420 -440" stroke="#8A6A4E" strokeWidth={8} fill="none" />
      <line x1={420} y1={-440} x2={420} y2={-380} stroke="#D9D2C4" strokeWidth={3} />
      <g transform={`translate(420,-356) rotate(${Math.sin(t * 0.3) * 10})`}>
        <Halo rx={70} color={PINK} op={0.6} />
        <path transform="scale(1.6)" d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" fill="#FF5F8A" />
      </g>
    </g>
  </g>
);

/* ---------- FASE 3 ---------- */
// benang merah antara dua titik, snap 0..1
export const RedThread: React.FC<{x1: number; y1: number; x2: number; y2: number; snap: number; t: number}> = ({x1, y1, x2, y2, snap, t}) => {
  const k = smooth(snap), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 30;
  if (snap <= 0) return <path d={`M ${x1} ${y1} Q ${mx} ${my + Math.sin(t * 0.1) * 6} ${x2} ${y2}`} stroke="#E0262E" strokeWidth={7} fill="none" />;
  return (
    <g>
      <path d={`M ${x1} ${y1} Q ${(x1 + mx) / 2} ${my + k * 140} ${mx - 20 - k * 40} ${my + k * 260}`} stroke="#E0262E" strokeWidth={7} fill="none" />
      <path d={`M ${x2} ${y2} Q ${(x2 + mx) / 2} ${my + k * 140} ${mx + 20 + k * 40} ${my + k * 260}`} stroke="#E0262E" strokeWidth={7} fill="none" />
      {snap < 0.25 && <Halo x={mx} y={my} rx={60} color="#FFFFFF" op={1 - snap * 4} />}
    </g>
  );
};

// layar HP: siluet blur + tombol "OK"/remote (selalu nurut). press 0..1
export const ObedientScreen: React.FC<{press: number; t: number}> = ({press, t}) => {
  const pk = Math.sin(clamp(press) * Math.PI);
  return (
    <g>
      <Phone18 w={260} glow={1} badge={1} seed={4} />
      <g transform={`translate(190,170) rotate(-10) scale(${1 - pk * 0.1})`}>
        <rect x={-50} y={-110} width={100} height={220} rx={30} fill="#2A2E36" />
        <circle cy={-60} r={30} fill="#4FB36A" /><text y={-50} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">OK</text>
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={-20 + (i % 2) * 40} cy={10 + Math.floor(i / 2) * 40} r={12} fill="#4A4E58" />)}
        <circle cy={-60} r={30 + pk * 24} fill="none" stroke="#4FB36A" strokeWidth={4} opacity={pk} />
      </g>
    </g>
  );
};

// kartu-kartu siluet blur di-swipe cepat (t frame)
export const SwipeCards: React.FC<{t: number}> = ({t}) => {
  const per = 9, k = (t % per) / per, idx = Math.floor(t / per);
  return (
    <g>
      <Halo rx={260} ry={340} color={PINK} op={0.4} />
      <rect x={-170} y={-300} width={340} height={600} rx={40} fill="#15101A" />
      {[2, 1].map((d) => <g key={d} transform={`translate(0,${d * 10}) scale(${1 - d * 0.04})`}><rect x={-140} y={-250} width={280} height={430} rx={22} fill="#2A0E1E" /><BlurSilhouette w={280} h={430} seed={idx + d + 3} /></g>)}
      <g transform={`translate(${-k * k * 520},${-k * 40}) rotate(${-k * 28})`} opacity={1 - k * 0.6}>
        <rect x={-140} y={-250} width={280} height={430} rx={22} fill="#2A0E1E" /><BlurSilhouette w={280} h={430} seed={idx + 1} />
        <rect x={-140} y={-46} width={280} height={40} fill="#050507" />
      </g>
      {/* jempol */}
      <g transform={`translate(${60 - k * 160},${210 + Math.sin(k * Math.PI) * -20})`}><ellipse rx={44} ry={60} fill="#F1C9A5" /><ellipse cx={0} cy={-36} rx={30} ry={22} fill="#E8B894" /></g>
    </g>
  );
};

// lapisan es merayap di dada (ice 0..1)
export const IceChest: React.FC<{ice: number}> = ({ice}) => {
  const k = smooth(ice);
  return (
    <g opacity={clamp(ice * 2)}>
      <Halo rx={140 * k + 20} color="#BFE6FF" op={0.55} />
      {Array.from({length: 9}).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + 0.2, r = (50 + rand(i) * 50) * k;
        return <path key={i} d={`M 0 0 L ${Math.cos(a) * r} ${Math.sin(a) * r} M ${Math.cos(a) * r * 0.6} ${Math.sin(a) * r * 0.6} l ${Math.cos(a + 0.6) * 20 * k} ${Math.sin(a + 0.6) * 20 * k}`}
          stroke="#E6F6FF" strokeWidth={6} strokeLinecap="round" />;
      })}
      <polygon points={Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2, r = (40 + (i % 2) * 18) * k; return `${Math.cos(a) * r},${Math.sin(a) * r}`; }).join(' ')} fill="#BFE6FF" opacity={0.7} />
    </g>
  );
};

// bubble cerita istri (ikon kecil) jatuh ke lantai sebelum sampai: fall 0..1 per bubble (dari x1 ke arah x2, jatuh)
export const FallingBubbles: React.FC<{t: number; x1: number; y1: number; dir: 1 | -1; floorY: number}> = ({t, x1, y1, dir, floorY}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((t * 0.018 + i / 3) % 1);
      const x = x1 + dir * ph * 260, y = ph < 0.45 ? y1 - Math.sin((ph / 0.45) * Math.PI * 0.5) * 30 : y1 - 30 + ((ph - 0.45) / 0.55) ** 2 * (floorY - y1 + 30);
      const icon = [
        <g key="c"><path d="M -16 -8 L 16 -8 L 12 18 L -12 18 Z" fill="#B07A4E" /><path d="M 16 -2 q 12 2 0 14" stroke="#B07A4E" strokeWidth={4} fill="none" /></g>,
        <g key="f">{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-9} rx={7} ry={10} fill="#FF8FB0" transform={`rotate(${r})`} />)}<circle r={6} fill="#F2C94C" /></g>,
        <g key="k"><rect x={-20} y={-12} width={40} height={28} rx={6} fill="#5A6170" /><circle cy={2} r={9} fill="#CFE8F0" /><rect x={-8} y={-18} width={16} height={8} rx={2} fill="#5A6170" /></g>,
      ][i];
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${ph > 0.45 ? (ph - 0.45) * 200 : 0})`} opacity={ph > 0.92 ? (1 - ph) / 0.08 : 1}>
          <ellipse rx={56} ry={42} fill="#FFFFFF" /><path d={`M ${-dir * 20} 30 L ${-dir * 40} 56 L ${-dir * 2} 36 Z`} fill="#FFFFFF" />
          {icon}
        </g>
      );
    })}
  </g>
);

// bingkai viewfinder (sudut-sudut) + ikon manekin datar tanpa wajah (simbol "objek", NON-seksual): m 0..1
export const Viewfinder: React.FC<{w: number; h: number; m: number}> = ({w, h, m}) => (
  <g>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
      <path key={i} d={`M ${sx * w / 2} ${sy * h / 2 - sy * 60} L ${sx * w / 2} ${sy * h / 2} L ${sx * w / 2 - sx * 60} ${sy * h / 2}`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" />
    ))}
    <circle cx={w / 2 - 50} cy={-h / 2 + 40} r={12} fill="#E0262E" />
    <text x={-w / 2 + 30} y={-h / 2 + 52} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFFFFF">REC</text>
    <g opacity={m} transform={`scale(${0.9 + 0.1 * m})`}>
      {/* manekin datar: kepala oval polos + badan papan, abu-abu */}
      <ellipse cx={0} cy={-150} rx={46} ry={56} fill="#B8BCC6" />
      <rect x={-60} y={-90} width={120} height={220} rx={30} fill="#A8ACB6" />
      <rect x={-8} y={130} width={16} height={60} fill="#8A8E98" /><rect x={-60} y={186} width={120} height={14} rx={6} fill="#8A8E98" />
      <rect x={-50} y={-10} width={100} height={30} rx={8} fill="#E8E8EE" />
      <text y={12} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#5A5E68">OBJEK</text>
    </g>
  </g>
);

// hati di dada nyala lalu retak: crack 0..1
export const HeartCrack: React.FC<{glow: number; crack: number; s?: number}> = ({glow, crack, s = 1}) => (
  <g transform={`scale(${s})`}>
    <Halo rx={90} color="#FF7A9A" op={0.6 * glow * (1 - crack * 0.6)} />
    <g transform={`translate(${-crack * 8},0) rotate(${-crack * 8})`}>
      <path transform="scale(2.4)" d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 L -4 -8 L 3 0 L -2 8 Z" fill={mix('#FF5F8A', '#8A6A74', crack * 0.5)} />
    </g>
    <g transform={`translate(${crack * 8},0) rotate(${crack * 8})`}>
      <path transform="scale(2.4)" d="M 0 14 L -2 8 L 3 0 L -4 -8 L 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" fill={mix('#FF5F8A', '#8A6A74', crack * 0.5)} />
    </g>
  </g>
);

// piring pecah di lantai: p 0..1
export const BrokenPlate: React.FC<{p: number}> = ({p}) => {
  const k = smooth(p);
  const shards = [[-1, -0.4], [1, -0.6], [-0.4, 0.8], [0.6, 0.7], [0, -1]];
  return (
    <g>
      {p < 0.1 && <ellipse rx={80} ry={22} fill="#F2F4F8" />}
      {shards.map(([dx, dy], i) => (
        <path key={i} transform={`translate(${dx * k * 120},${dy * k * 20}) rotate(${dx * k * 60 + i * 30})`} d="M 0 0 L 40 -6 L 26 22 Z" fill={i % 2 ? '#F2F4F8' : '#DCE2EC'} opacity={p > 0.05 ? 1 : 0} />
      ))}
      {p > 0.05 && p < 0.4 && <Halo rx={140} ry={60} color="#FFFFFF" op={0.6 * (1 - p / 0.4)} />}
    </g>
  );
};

// hati berubah jadi batu: stone 0..1
export const StoneHeart: React.FC<{stone: number}> = ({stone}) => (
  <g>
    <Halo rx={80} color={mix('#FF7A9A', '#5A5E68', stone)} op={0.5 * (1 - stone * 0.7)} />
    <path transform="scale(2.4)" d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" fill={mix('#FF5F8A', '#6E6A70', stone)} />
    {stone > 0.3 && [[-20, -20, 10], [16, -24, 8], [6, 4, 12], [-14, 10, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#4A464E" opacity={ramp(stone, 0.3, 1) * 0.7} />)}
    {stone > 0.3 && <path d="M -30 -30 L -6 -10 L -18 14" stroke="#3A363E" strokeWidth={3} fill="none" opacity={ramp(stone, 0.3, 1)} />}
  </g>
);

// hati bercahaya kecil (untuk beat koneksi)
export const SmallHeart: React.FC<{c?: string; s?: number}> = ({c = '#FF5F8A', s = 1}) => (
  <path transform={`scale(${s})`} d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" fill={c} />
);
