// Background video umur25 — tempat nyata ala /style3 tapi SEPI: furnitur secukupnya, detail rendah.
// Diredupkan + blur tipis oleh scene. Horizon WALL_Y=1110, kaki karakter STAND_Y=1250.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mix, rand} from '../theme';
import {Room, WALL_Y} from './Places';
import {Halo} from './Lit';

const W = 1080;

/* ================= 1. KAMAR PRIA, MALAM ULANG TAHUN (HOOK + ONE SHOT) ================= */
// lights 0..1 lampu tumbler/kamar; decay 0..1 dekorasi layu satu-satu; maroon 0..1 warna ruangan -> maroon gelap;
// shadowWall 0..1 dinding belakang jadi "layar bayangan" (panel gelap kemerahan tempat bayangan muncul)
export const BirthdayRoom: React.FC<{lights?: number; decay?: number; maroon?: number; shadowWall?: number}> = ({lights = 1, decay = 0, maroon = 0, shadowWall = 0}) => {
  const f = useCurrentFrame();
  const c = (warm: string, mar: string) => mix(mix(warm, '#2A2030', 0.45 * (1 - lights)), mar, maroon);
  const wilt = (i: number) => Math.max(0, Math.min(1, decay * 4 - i * 0.6)); // layu satu per satu
  return (
    <g>
      <Room wall={[c('#6A4A62', '#3A0E18'), c('#4A3048', '#22070C')]} floor={[c('#4A3040', '#2A0A10'), c('#24141E', '#120406')]} />
      {/* jendela malam */}
      <g transform="translate(110,360)">
        <rect x={-12} y={-12} width={264} height={324} rx={8} fill={c('#7A5A72', '#4A1A22')} />
        <rect width={240} height={300} fill={c('#141A3A', '#12060A')} />
        <circle cx={170} cy={80} r={34} fill="#F4F0D8" opacity={0.85 - 0.5 * maroon} />
        <rect x={114} width={12} height={300} fill={c('#7A5A72', '#4A1A22')} />
      </g>
      {/* dinding belakang -> layar bayangan */}
      <rect x={420} y={300} width={560} height={640} rx={16} fill="#1A0408" opacity={0.75 * shadowWall} />
      <rect x={420} y={300} width={560} height={640} rx={16} fill="none" stroke="#FF3B3B" strokeWidth={4} opacity={0.35 * shadowWall} />
      {/* banner HAPPY BIRTHDAY */}
      <g opacity={1 - wilt(2) * 0.85} transform={`translate(0,${wilt(2) * 60}) rotate(${wilt(2) * 6} 700 330)`}>
        <path d="M 440 300 Q 700 380 960 300" stroke="#C9B07A" strokeWidth={3} fill="none" />
        {Array.from({length: 9}).map((_, i) => {
          const x = 460 + i * 58, y = 300 + Math.sin((i / 8) * Math.PI) * 40;
          return <path key={i} d={`M ${x} ${y} L ${x + 44} ${y + 2} L ${x + 22} ${y + 56} Z`} fill={mix(['#FF8FB0', '#F2C94C', '#7FD8F0'][i % 3], '#5A4A50', wilt(2))} />;
        })}
      </g>
      {/* balon (layu satu-satu: mengempis & turun) */}
      {[[380, 520, '#FF5F8A'], [470, 470, '#F2C94C'], [930, 500, '#7FB7FF']].map(([x, y, col], i) => {
        const k = wilt(i === 2 ? 1 : i * 1.5);
        return (
          <g key={i} transform={`translate(${x},${(y as number) + k * 420}) scale(${1 - k * 0.45},${1 - k * 0.6})`} opacity={1 - k * 0.5}>
            <line x1={0} y1={60} x2={(rand(i) - 0.5) * 30} y2={260 - k * 200} stroke="#D9D2C4" strokeWidth={2} />
            <ellipse rx={52} ry={64} fill={mix(col as string, '#4A3A40', k)} />
            <ellipse cx={-16} cy={-22} rx={12} ry={18} fill="#FFFFFF" opacity={0.35 * (1 - k)} />
          </g>
        );
      })}
      {/* lampu tumbler (fairy lights) */}
      {Array.from({length: 14}).map((_, i) => {
        const x = 20 + i * 78, y = 250 + Math.sin(i * 0.7) * 18;
        const on = lights * (1 - wilt(3)) * (0.7 + 0.3 * Math.sin(f * 0.1 + i * 1.7));
        return <g key={i}><circle cx={x} cy={y} r={18} fill="#FFD27A" opacity={0.25 * on} /><circle cx={x} cy={y} r={6} fill={mix('#5A4A40', '#FFE7B0', on)} /></g>;
      })}
      {/* kasur rendah (kanan) — sederhana */}
      <g transform="translate(700,1010)">
        <rect x={0} y={0} width={340} height={100} rx={18} fill={c('#3A2C4E', '#2A0A12')} />
        <path d="M 10 0 C 100 -30 200 10 340 -6 L 340 40 L 10 40 Z" fill={c('#6A5A8A', '#4A1420')} />
        <ellipse cx={80} cy={-16} rx={60} ry={24} fill={c('#D9D2E8', '#6A3A44')} />
      </g>
    </g>
  );
};

/* ================= 2. RUMAH KELUARGA — ruang makan malam (EFEK 1) ================= */
// heat 0..1: oranye hangat -> panas kemerahan; photoTilt derajat; lampOn 0..1
export const FamilyDining: React.FC<{heat?: number; photoTilt?: number; lampOn?: number; chairTip?: number}> = ({heat = 0, photoTilt = 0, lampOn = 1, chairTip = 0}) => {
  const c = (a: string, b: string) => mix(a, b, heat);
  return (
    <g>
      <Room wall={[c('#B07A52', '#8A2E22'), c('#8A5A3C', '#5A1A14')]} floor={[c('#6A4430', '#4A1A12'), c('#3A2418', '#22080A')]} />
      <rect y={820} width={W} height={290} fill={c('#9A6444', '#6E2418')} opacity={0.55} />
      {/* foto keluarga di dinding */}
      <g transform={`translate(260,470) rotate(${photoTilt})`}>
        <line x1={-50} y1={-120} x2={0} y2={-160} stroke="#3A2A20" strokeWidth={3} /><line x1={50} y1={-120} x2={0} y2={-160} stroke="#3A2A20" strokeWidth={3} />
        <rect x={-110} y={-120} width={220} height={160} rx={6} fill="#C9A06A" />
        <rect x={-96} y={-106} width={192} height={132} fill={c('#F2E3C8', '#D9B8A0')} />
        {[-56, -14, 26, 62].map((x, i) => <g key={i}><circle cx={x} cy={-50 + (i === 3 ? 14 : 0)} r={i === 3 ? 14 : 18} fill="#8A6A5A" /><rect x={x - 18} y={-30 + (i === 3 ? 14 : 0)} width={36} height={50} rx={10} fill="#6A4A3A" /></g>)}
      </g>
      {/* lampu gantung di atas meja */}
      <g transform="translate(600,0)">
        <line x1={0} y1={0} x2={0} y2={430} stroke="#3A2A20" strokeWidth={4} />
        <path d="M -90 430 L 90 430 L 60 370 L -60 370 Z" fill={c('#E8C49A', '#C86A4A')} />
        <Halo y={470} rx={360} ry={300} color={c('#FFC870', '#FF6A3A')} op={0.5 * lampOn} />
      </g>
      {/* meja makan + 2 kursi belakang */}
      <g transform="translate(300,1110)">
        {[60, 420].map((x, i) => (
          <g key={x} transform={i === 1 && chairTip > 0 ? `rotate(${chairTip * 70} ${x + 40} 0)` : undefined}>
            <rect x={x} y={-300} width={16} height={300} fill={c('#5A3A28', '#3A1810')} /><rect x={x} y={-130} width={96} height={14} fill={c('#5A3A28', '#3A1810')} />
          </g>
        ))}
        <rect x={-20} y={-160} width={620} height={22} rx={6} fill={c('#8A5A3C', '#6A2A1A')} />
        <rect x={10} y={-138} width={18} height={138} fill={c('#6A4430', '#4A1A10')} /><rect x={552} y={-138} width={18} height={138} fill={c('#6A4430', '#4A1A10')} />
      </g>
      {/* lemari kecil (kiri) */}
      <rect x={40} y={860} width={150} height={250} rx={8} fill={c('#7A5038', '#5A2014')} />
      <rect x={52} y={880} width={126} height={90} rx={4} fill={c('#8A6044', '#6A2818')} />
    </g>
  );
};

/* ================= 3. JALAN KOTA / TROTOAR + HALTE BUS, sore -> malam (EFEK 2) ================= */
// dusk 0..1: sore ungu-magenta -> malam ungu gelap
export const CityStreet: React.FC<{dusk?: number; carX?: number}> = ({dusk = 0.3, carX = -400}) => {
  const f = useCurrentFrame();
  const c = (a: string, b: string) => mix(a, b, dusk);
  return (
    <g>
      {/* langit */}
      <defs>
        <linearGradient id="skyU" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c('#5A3A7A', '#1E1434')} /><stop offset="0.7" stopColor={c('#C85A8A', '#5A2A5E')} /><stop offset="1" stopColor={c('#FF9A7A', '#8A3A6A')} />
        </linearGradient>
      </defs>
      <rect width={W} height={WALL_Y} fill="url(#skyU)" />
      {/* siluet gedung */}
      {[[0, 520, 180], [170, 600, 150], [310, 440, 200], [500, 560, 160], [650, 480, 190], [830, 580, 250]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={WALL_Y - y} fill={c('#3A2450', '#160E24')} />
          {Array.from({length: 6}).map((_, k) => <rect key={k} x={x + 20 + (k % 3) * 50} y={y + 30 + Math.floor(k / 3) * 60} width={22} height={28} fill="#FFD27A" opacity={rand(i * 9 + k) > 0.45 ? 0.25 + 0.5 * dusk : 0.05} />)}
        </g>
      ))}
      {/* trotoar + jalan */}
      <rect y={WALL_Y} width={W} height={160} fill={c('#5A4A6A', '#2E2440')} />
      <rect y={WALL_Y} width={W} height={10} fill={c('#7A6A8A', '#3E3452')} />
      <rect y={WALL_Y + 160} width={W} height={1920 - WALL_Y - 160} fill={c('#2E2438', '#140E1C')} />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x={i * 220} y={WALL_Y + 330} width={120} height={14} fill="#E8E0CC" opacity={0.35} />)}
      {/* lampu jalan */}
      <g transform={`translate(150,${WALL_Y})`}>
        <rect x={-6} y={-560} width={12} height={560} fill="#2A2234" />
        <path d="M 0 -560 Q 40 -600 90 -580" stroke="#2A2234" strokeWidth={10} fill="none" />
        <ellipse cx={92} cy={-570} rx={30} ry={12} fill="#FFE7B0" opacity={0.4 + 0.6 * dusk} />
        <Halo x={92} y={-480} rx={200} ry={300} color="#FFD27A" op={0.35 * dusk + 0.1} />
      </g>
      {/* halte bus */}
      <g transform={`translate(560,${WALL_Y + 40})`}>
        <rect x={0} y={-420} width={420} height={24} rx={6} fill={c('#4A3A5E', '#2A2038')} />
        <rect x={10} y={-396} width={12} height={396} fill="#3A2E48" /><rect x={398} y={-396} width={12} height={396} fill="#3A2E48" />
        <rect x={30} y={-380} width={360} height={240} fill="#BFD4FF" opacity={0.12} />
        <rect x={60} y={-150} width={300} height={22} rx={6} fill="#5A4A6E" />
        <rect x={80} y={-128} width={14} height={128} fill="#3A2E48" /><rect x={326} y={-128} width={14} height={128} fill="#3A2E48" />
        <g transform="translate(360,-470)"><rect x={-8} y={0} width={16} height={60} fill="#3A2E48" /><circle cy={-10} r={34} fill="#3E7AD0" /><text y={0} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFFFFF">BUS</text></g>
      </g>
      {/* mobil lewat (siluet) */}
      <g transform={`translate(${carX},${WALL_Y + 260})`}>
        <path d="M 0 0 L 40 -60 L 200 -60 L 250 0 L 300 0 L 300 50 L -20 50 L -20 0 Z" fill="#14101C" />
        <circle cx={40} cy={50} r={24} fill="#0A080E" /><circle cx={240} cy={50} r={24} fill="#0A080E" />
        <ellipse cx={300} cy={20} rx={20} ry={10} fill="#FFE7B0" opacity={0.8} />
      </g>
    </g>
  );
};

/* ================= 4. KAFE / RUANG MEETING (EFEK 3) — abu-biru dingin pucat ================= */
export const Cafe: React.FC<{dim?: number}> = () => (
  <g>
    <Room wall={['#7E8E9E', '#5E6E7E']} floor={['#5A6470', '#323A44']} boardColor="#46505C" />
    {/* jendela besar */}
    <g transform="translate(560,300)">
      <rect x={-12} y={-12} width={464} height={484} rx={8} fill="#9AAABA" />
      <rect width={440} height={460} fill="#B8C8D8" />
      {[[30, 260, 90, 200], [140, 200, 80, 260], [240, 280, 110, 180], [360, 230, 80, 230]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#8A9AAA" />)}
      <rect x={214} width={12} height={460} fill="#9AAABA" /><rect y={224} width={440} height={12} fill="#9AAABA" />
    </g>
    {/* lampu gantung pucat */}
    {[260, 820].map((x) => (
      <g key={x} transform={`translate(${x},0)`}>
        <line x1={0} y1={0} x2={0} y2={300} stroke="#3A4450" strokeWidth={3} />
        <path d="M -50 300 L 50 300 L 30 250 L -30 250 Z" fill="#DDE8F4" />
        <Halo y={330} rx={220} ry={180} color="#DDE8F4" op={0.35} />
      </g>
    ))}
    {/* rak + tanaman */}
    <rect x={60} y={560} width={260} height={14} fill="#4A5462" />
    {[0, 1, 2].map((k) => <rect key={k} x={80 + k * 70} y={490} width={44} height={70} rx={8} fill={['#B07A4E', '#DDE8F4', '#6E8A7A'][k]} opacity={0.8} />)}
    <g transform="translate(1000,1110)"><path d="M -34 0 L -26 -80 L 26 -80 L 34 0 Z" fill="#8A6A4E" />{[-30, 0, 30].map((a, i) => <ellipse key={i} cx={a} cy={-120 - (i % 2) * 20} rx={26} ry={44} fill="#5E7A62" />)}</g>
  </g>
);
