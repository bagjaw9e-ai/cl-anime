// Background tempat (1080x1920), gaya ref_2 (ruangan flat 2D lengkap & detail) + cahaya ref_1 (gelap sinematik).
// Dinding/lantai: horizon y = WALL_Y; karakter berdiri di y = STAND_Y (zona tengah 420-1250).
// Semua tempat sengaja agak redup; sorotan (spotlight/rim/glow) ditambahkan oleh scene.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mix, rand} from '../theme';
import {useSid} from './Phone';
import {Halo} from './Lit';

export const WALL_Y = 1110;
export const STAND_Y = 1250;
const W = 1080, H = 1920;

// lantai kayu/karpet + dinding gradasi
const Room: React.FC<{wall: [string, string]; floor: [string, string]; boards?: boolean; boardColor?: string}> = ({wall, floor, boards = true, boardColor}) => {
  const id = useSid('rm');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wall[0]} /><stop offset="1" stopColor={wall[1]} /></linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={floor[0]} /><stop offset="1" stopColor={floor[1]} /></linearGradient>
      </defs>
      <rect width={W} height={WALL_Y} fill={`url(#${id}w)`} />
      <rect y={WALL_Y} width={W} height={H - WALL_Y} fill={`url(#${id}f)`} />
      <rect y={WALL_Y - 18} width={W} height={18} fill={mix(wall[1], '#000000', 0.35)} />
      {boards && Array.from({length: 9}).map((_, i) => (
        <line key={i} x1={540 + (i - 4) * 70} y1={WALL_Y} x2={540 + (i - 4) * 260} y2={H} stroke={boardColor ?? mix(floor[0], '#000000', 0.25)} strokeWidth={3} opacity={0.5} />
      ))}
      {boards && [1180, 1290, 1440, 1640].map((y) => <line key={y} x1={0} y1={y} x2={W} y2={y} stroke={boardColor ?? mix(floor[0], '#000000', 0.25)} strokeWidth={2} opacity={0.35} />)}
    </g>
  );
};

// redupkan ruangan + vignette (cahaya ref_1). dim 0..1
export const Dim: React.FC<{dim: number; color?: string}> = ({dim, color = '#05060C'}) => (
  <rect width={W} height={H} fill={color} opacity={dim} />
);

/* ================= 1. PELAMINAN / GEDUNG RESEPSI ================= */
// lights 0..1 (1 = lampu resepsi hangat menyala penuh, 0 = meredup dramatis)
export const WeddingHall: React.FC<{lights?: number}> = ({lights = 1}) => {
  const f = useCurrentFrame();
  const warm = (c: string) => mix('#2A2030', c, 0.35 + 0.65 * lights);
  return (
    <g>
      <Room wall={[warm('#8A5A48'), warm('#5A3530')]} floor={[warm('#7A2E34'), warm('#3A1418')]} boards={false} />
      {/* tirai swag kiri-kanan */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd < 0 ? 0 : W},0) scale(${sd},1)`}>
          <path d="M 0 0 L 230 0 C 200 300 150 700 170 1110 L 0 1110 Z" fill={warm('#C9A27A')} />
          <path d="M 40 0 C 60 400 40 800 60 1110 M 110 0 C 120 400 100 800 120 1110" stroke={warm('#A9825E')} strokeWidth={10} fill="none" opacity={0.6} />
          <path d="M 0 0 Q 260 220 540 120 L 540 0 Z" fill={warm('#E8CDA8')} opacity={0.9} />
        </g>
      ))}
      {/* backdrop pelaminan: lengkung + bunga */}
      <path d="M 250 1110 L 250 520 Q 540 300 830 520 L 830 1110 Z" fill={warm('#F2E3C8')} />
      <path d="M 290 1110 L 290 540 Q 540 360 790 540 L 790 1110 Z" fill={warm('#E6CFA6')} />
      {Array.from({length: 22}).map((_, i) => {
        const u = i / 21, a = Math.PI * (1 - u);
        const x = 540 + Math.cos(a) * 300, y = 560 - Math.sin(a) * 220 + (u < 0.08 || u > 0.92 ? 40 : 0);
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r={26} fill={i % 3 === 0 ? warm('#F7F1E8') : i % 3 === 1 ? warm('#E9A6B0') : warm('#F2C9C0')} />
            <circle r={9} fill={warm('#D9B46A')} />
            <ellipse cx={22} cy={14} rx={16} ry={8} fill={warm('#6E9E5A')} transform="rotate(30)" />
          </g>
        );
      })}
      {/* rangkaian bunga berdiri di samping pelaminan */}
      {[200, 880].map((x) => (
        <g key={x} transform={`translate(${x},1110)`}>
          <rect x={-8} y={-300} width={16} height={300} fill={warm('#B89A6A')} />
          {Array.from({length: 9}).map((_, i) => <circle key={i} cx={(rand(i + x) - 0.5) * 120} cy={-330 + (rand(i * 3 + x) - 0.5) * 90} r={30} fill={i % 2 ? warm('#F7F1E8') : warm('#E9A6B0')} />)}
        </g>
      ))}
      {/* lampu gantung kristal */}
      {[300, 540, 780].map((x, i) => (
        <g key={x} transform={`translate(${x},${i === 1 ? 200 : 150})`}>
          <line x1={0} y1={-200} x2={0} y2={0} stroke="#6A5A40" strokeWidth={3} />
          <Halo rx={170} color="#FFD27A" op={0.55 * lights * (0.92 + 0.08 * Math.sin(f * 0.1 + i))} />
          <path d="M -60 0 Q 0 40 60 0 L 40 50 Q 0 80 -40 50 Z" fill={mix('#6A5A40', '#FFE7B0', lights)} />
          {[-45, -15, 15, 45].map((dx) => <path key={dx} d={`M ${dx} 50 l -5 26 l 5 10 l 5 -10 Z`} fill={mix('#8A8A9A', '#FFF4E0', lights)} />)}
          {[-50, 0, 50].map((dx) => <circle key={dx} cx={dx} cy={-4} r={8} fill={mix('#5A5040', '#FFF6D8', lights)} />)}
        </g>
      ))}
      {/* panggung pelaminan + karpet */}
      <path d="M 180 1110 L 900 1110 L 980 1180 L 100 1180 Z" fill={warm('#E8D2AC')} />
      <path d="M 100 1180 L 980 1180 L 980 1200 L 100 1200 Z" fill={warm('#B89A6A')} />
      <path d="M 420 1200 L 660 1200 L 760 1920 L 320 1920 Z" fill={warm('#9A2F3A')} />
      {/* string lights */}
      {Array.from({length: 18}).map((_, i) => {
        const x = 20 + i * 60, y = 330 + Math.sin(i * 0.55) * 26;
        const tw = 0.7 + 0.3 * Math.sin(f * 0.08 + i * 1.7);
        return <g key={i}><circle cx={x} cy={y} r={18} fill="#FFD27A" opacity={0.2 * lights * tw} /><circle cx={x} cy={y} r={5} fill="#FFE7B0" opacity={(0.2 + 0.8 * lights) * tw} /></g>;
      })}
    </g>
  );
};

/* ================= 2. KAMAR TIDUR PRIA (MALAM) ================= */
// gray 0..1: benda berwarna di kamar luntur jadi abu-abu (beat 11); clock = tampilkan jam digital 02.00
export const BedroomNight: React.FC<{gray?: number; clockOn?: number}> = ({gray = 0, clockOn = 1}) => {
  const f = useCurrentFrame();
  const g = (c: string, k = 1) => mix(c, '#5E5E6A', gray * k);
  return (
    <g>
      <Room wall={['#262245', '#1A1733']} floor={['#2A2240', '#141022']} />
      {/* jendela + bulan + siluet kota */}
      <g transform="translate(130,330)">
        <rect x={-14} y={-14} width={348} height={398} rx={10} fill="#3A3456" />
        <rect width={320} height={370} fill="#0E1430" />
        <circle cx={230} cy={100} r={52} fill="#F4F0D8" />
        <circle cx={250} cy={88} r={50} fill="#0E1430" opacity={0.35} />
        <Halo x={230} y={100} rx={130} color="#CFE0FF" op={0.25} />
        {[[0, 270, 60, 100], [60, 240, 50, 130], [110, 280, 70, 90], [180, 220, 50, 150], [230, 260, 90, 110]].map(([x, y, w, h], i) => (
          <g key={i}><rect x={x} y={y} width={w} height={h} fill="#1A2244" />
            {Array.from({length: 4}).map((_, k) => <rect key={k} x={x + 10 + (k % 2) * 22} y={y + 14 + Math.floor(k / 2) * 30} width={10} height={12} fill="#FFD27A" opacity={rand(i * 7 + k) > 0.5 ? 0.7 : 0.1} />)}
          </g>
        ))}
        <rect x={152} y={0} width={14} height={370} fill="#3A3456" />
        <rect x={0} y={178} width={320} height={12} fill="#3A3456" />
        <path d="M -40 -30 Q 20 200 -20 420 L -60 420 L -60 -30 Z" fill={g('#5A3E78')} />
      </g>
      {/* poster */}
      <rect x={560} y={380} width={170} height={230} rx={8} fill={g('#3E8C8A', 1)} />
      <circle cx={645} cy={470} r={50} fill={g('#F2A65A')} />
      <rect x={590} y={545} width={110} height={14} rx={7} fill={g('#F5E6DA')} opacity={0.7} />
      {/* rak + buku */}
      <rect x={790} y={470} width={230} height={14} fill="#3A3456" />
      {['#E86A5A', '#F2C94C', '#4FB3A9', '#8E7CC3', '#E89AAE'].map((c, i) => <rect key={i} x={800 + i * 36} y={390 - (i % 2) * 14} width={28} height={80 + (i % 2) * 14} rx={4} fill={g(c)} />)}
      {/* meja + laptop (kiri) */}
      <g transform="translate(70,880)">
        <rect x={0} y={0} width={330} height={22} rx={6} fill={g('#6A4A36')} />
        <rect x={20} y={22} width={18} height={220} fill="#3A2A22" /><rect x={290} y={22} width={18} height={220} fill="#3A2A22" />
        <path d="M 90 0 L 110 -110 L 260 -110 L 250 0 Z" fill="#2A2A36" />
        <path d="M 102 -8 L 118 -100 L 250 -100 L 242 -8 Z" fill="#1A2440" />
        <rect x={70} y={-6} width={210} height={10} rx={4} fill="#3A3A48" />
        <rect x={10} y={-60} width={50} height={60} rx={8} fill={g('#E86A5A')} />
        {/* lampu meja mati */}
        <path d="M 300 -0 L 300 -150 L 260 -190" stroke="#4A4A5A" strokeWidth={8} fill="none" />
        <path d="M 230 -200 L 290 -210 L 280 -170 Z" fill="#4A4A5A" />
      </g>
      {/* kasur berantakan (kanan) */}
      <g transform="translate(560,1010)">
        <rect x={0} y={-160} width={30} height={260} rx={10} fill="#3A2C4E" />
        <rect x={0} y={0} width={500} height={110} rx={20} fill="#2E2440" />
        <path d="M 20 0 C 120 -40 200 20 300 -20 C 380 -50 460 -10 500 0 L 500 50 L 20 50 Z" fill={g('#5A4A8A')} />
        <path d="M 120 10 C 200 -20 260 30 360 0 C 420 -20 470 10 500 20" stroke={g('#7A6AAE')} strokeWidth={10} fill="none" />
        <ellipse cx={90} cy={-24} rx={70} ry={30} fill={g('#D9D2E8')} transform="rotate(-8 90 -24)" />
        <path d="M 260 40 C 300 90 380 60 420 110 L 330 110 Z" fill={g('#5A4A8A')} />
      </g>
      {/* nakas + jam digital 02.00 */}
      <g transform="translate(470,1010)">
        <rect x={-10} y={-80} width={90} height={160} rx={8} fill="#3A2C4E" />
        <rect x={-2} y={-120} width={78} height={40} rx={6} fill="#14101E" />
        <text x={37} y={-90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FF4D7A" opacity={clockOn * (0.85 + 0.15 * Math.sin(f * 0.2))}>02.00</text>
      </g>
      {/* jam dinding analog */}
      <g transform="translate(420,250)">
        <circle r={46} fill="#E8E2F0" opacity={0.85} /><circle r={40} fill="#2A2440" />
        <line x1={0} y1={0} x2={0} y2={-26} stroke="#E8E2F0" strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={0} x2={18} y2={10} stroke="#E8E2F0" strokeWidth={4} strokeLinecap="round" transform={`rotate(${(f * 6) % 360})`} />
      </g>
    </g>
  );
};

/* ================= 3. PANGGUNG GELAP MINIMALIS (mid-CTA, ala ref_1) ================= */
export const DarkStage: React.FC<{warm?: number}> = ({warm = 0}) => {
  const id = useSid('ds');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix('#0E1320', '#17120E', warm)} />
          <stop offset="0.6" stopColor={mix('#1B2233', '#2A2018', warm)} />
          <stop offset="0.601" stopColor={mix('#0A0E16', '#110D0A', warm)} />
          <stop offset="1" stopColor="#040507" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}l)`} />
      <Halo x={540} y={860} rx={720} color={mix('#2C3242', '#3A2E22', warm)} op={0.7} />
      <rect y={1151} width={W} height={2} fill="#FFFFFF" opacity={0.05} />
    </g>
  );
};

/* ================= 4. KANTOR / RUANG KERJA (teal-abu kusam) ================= */
export const Office: React.FC<{fire?: number; desk?: boolean}> = ({fire = 0, desk = true}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Room wall={['#4E6468', '#384C50']} floor={['#3E4A4C', '#232C2E']} boardColor="#2E3A3C" />
      {/* jendela kota mendung */}
      <g transform="translate(560,300)">
        <rect x={-12} y={-12} width={444} height={404} rx={8} fill="#2E3E42" />
        <rect width={420} height={380} fill="#8A9AA0" />
        {[[40, 60, 90], [180, 40, 120], [320, 70, 80]].map(([x, y, r], i) => <ellipse key={i} cx={x + Math.sin(f * 0.01 + i) * 10} cy={y} rx={r} ry={r * 0.4} fill="#A9B6BA" opacity={0.8} />)}
        {[[0, 200, 70, 180], [80, 160, 60, 220], [150, 230, 90, 150], [250, 140, 70, 240], [330, 210, 90, 170]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#5E6E74" />)}
        <rect x={204} y={0} width={12} height={380} fill="#2E3E42" />
      </g>
      {/* lemari arsip */}
      <g transform="translate(70,640)">
        <rect width={170} height={470} rx={6} fill="#5E7276" />
        {[0, 1, 2, 3].map((k) => <g key={k}><rect x={12} y={14 + k * 114} width={146} height={100} rx={4} fill="#6E8286" /><rect x={65} y={56 + k * 114} width={40} height={10} rx={5} fill="#3A4A4E" /></g>)}
        {[0, 1, 2].map((k) => <rect key={k} x={10 + k * 50} y={-60 + k * 6} width={44} height={60 - k * 6} fill={['#C9B98F', '#B8A87E', '#D9CBA4'][k]} />)}
      </g>
      {/* jam dinding */}
      <g transform="translate(380,330)"><circle r={50} fill="#D8DEDE" /><circle r={42} fill="#F2F4F4" />
        <line x1={0} y1={0} x2={0} y2={-28} stroke="#2E3A3C" strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={0} x2={22} y2={6} stroke="#C0392B" strokeWidth={3} strokeLinecap="round" transform={`rotate(${(f * 6) % 360})`} /></g>
      {/* tanaman layu */}
      <g transform="translate(990,1110)"><path d="M -30 0 L -24 -70 L 24 -70 L 30 0 Z" fill="#8A6A4E" />
        {[-30, -5, 20].map((a, i) => <path key={i} d={`M 0 -70 Q ${a} -130 ${a * 1.6} -110`} stroke="#8A8A5A" strokeWidth={6} fill="none" />)}</g>
      {/* meja kerja berantakan + monitor */}
      {desk && <g transform="translate(300,960)">
        <rect x={0} y={0} width={560} height={24} rx={6} fill="#6E5A46" />
        <rect x={30} y={24} width={20} height={150} fill="#4A3C30" /><rect x={510} y={24} width={20} height={150} fill="#4A3C30" />
        <rect x={190} y={-230} width={250} height={170} rx={10} fill="#22282A" />
        <rect x={202} y={-218} width={226} height={146} rx={4} fill="#3E6E78" opacity={0.85} />
        <rect x={300} y={-60} width={30} height={60} fill="#2A3032" />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={20 + (k % 2) * 6} y={-24 - k * 18} width={140} height={18} fill={['#E8E0CC', '#D9CFB6', '#EFE8D6'][k % 3]} transform={`rotate(${(rand(k) - 0.5) * 6} 90 ${-24 - k * 18})`} />)}
        <rect x={470} y={-60} width={40} height={60} rx={6} fill="#B8C6C8" />
        <path d="M 470 -50 q -20 10 0 30" stroke="#B8C6C8" strokeWidth={6} fill="none" />
        {fire > 0 && <DeskFire x={110} y={-110} s={fire} />}
      </g>}
    </g>
  );
};

export const DeskFire: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Halo rx={170} color="#FF7A2B" op={0.5} />
      {[0, 1, 2, 3, 4].map((i) => {
        const fl = Math.sin(f * 0.5 + i * 1.3) * 8, h = 90 + rand(i) * 70 + fl;
        return <path key={i} d={`M ${-60 + i * 30} 0 C ${-80 + i * 30} ${-h * 0.4} ${-50 + i * 30 + fl} ${-h * 0.7} ${-45 + i * 30} ${-h} C ${-30 + i * 30} ${-h * 0.6} ${-20 + i * 30} ${-h * 0.3} ${-30 + i * 30} 0 Z`}
          fill={i % 2 ? '#FF9A3C' : '#FF5A2B'} opacity={0.9} />;
      })}
      {[0, 1, 2].map((i) => <path key={'c' + i} d={`M ${-40 + i * 34} 0 C ${-46 + i * 34} -30 ${-30 + i * 34} -50 ${-30 + i * 34} -60 C ${-20 + i * 34} -40 ${-14 + i * 34} -20 ${-20 + i * 34} 0 Z`} fill="#FFE08A" />)}
    </g>
  );
};

/* ================= 5. LAB RISET GELAP (monitor & papan tulis menyala) ================= */
export const LabDark: React.FC<{boardOn?: number}> = ({boardOn = 1}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Room wall={['#141A24', '#0E131B']} floor={['#151B24', '#080B10']} boardColor="#1E2633" />
      {/* papan tulis menyala */}
      <g transform="translate(140,330)">
        <Halo x={400} y={220} rx={460} ry={300} color="#7FB7C9" op={0.22 * boardOn} />
        <rect x={-10} y={-10} width={820} height={470} rx={10} fill="#2A323E" />
        <rect width={800} height={450} fill={mix('#1A2630', '#24404A', boardOn)} />
        <path d="M 60 360 L 200 300 L 330 320 L 470 220 L 600 160 L 740 90" stroke="#9FE0F0" strokeWidth={5} fill="none" opacity={0.5 * boardOn} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={60} y={60 + k * 40} width={160 + (k % 2) * 60} height={10} rx={5} fill="#CFE8F0" opacity={0.3 * boardOn} />)}
      </g>
      {/* rak + toples */}
      <g transform="translate(60,860)">
        <rect width={260} height={12} fill="#2A323E" /><rect y={-120} width={260} height={12} fill="#2A323E" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={14 + k * 62} y={-100 + (k % 2) * 10} width={44} height={90 - (k % 2) * 10} rx={8} fill={['#3E8C8A', '#8E7CC3', '#3E6E8A', '#5A9A6A'][k]} opacity={0.55} />)}
      </g>
      {/* meja + 2 monitor menyala */}
      <g transform="translate(470,960)">
        <rect x={0} y={0} width={540} height={22} rx={6} fill="#2A323E" />
        <rect x={30} y={22} width={18} height={130} fill="#1A2028" /><rect x={490} y={22} width={18} height={130} fill="#1A2028" />
        {[60, 300].map((mx, i) => (
          <g key={mx}>
            <Halo x={mx + 90} y={-110} rx={170} ry={120} color={i ? '#FFB23F' : '#7FB7C9'} op={0.35} />
            <rect x={mx} y={-190} width={180} height={130} rx={8} fill="#0E1218" />
            <rect x={mx + 8} y={-182} width={164} height={114} rx={3} fill={i ? '#3A2A12' : '#12303A'} />
            <path d={`M ${mx + 16} ${-90} ${Array.from({length: 8}).map((_, k) => `L ${mx + 16 + k * 21} ${-110 - Math.sin(f * 0.15 + k + i) * 16}`).join(' ')}`} stroke={i ? '#FFB23F' : '#7FD8F0'} strokeWidth={3} fill="none" />
            <rect x={mx + 80} y={-60} width={20} height={60} fill="#1A2028" />
          </g>
        ))}
      </g>
    </g>
  );
};

/* ================= 6. RUMAH PASANGAN: ruang tamu / ruang makan ================= */
// cold 0..1: hangat amber -> biru pucat dingin. photoTilt (derajat), photoFall 0..1 (jatuh), photoCrack 0..1
export const LivingDining: React.FC<{cold?: number; photoTilt?: number; photoFall?: number; photoCrack?: number; lampOn?: number}> = ({
  cold = 0, photoTilt = 0, photoFall = 0, photoCrack = 0, lampOn = 1,
}) => {
  const f = useCurrentFrame();
  const c = (warmC: string, coldC: string) => mix(warmC, coldC, cold);
  return (
    <g>
      <Room wall={[c('#B07A52', '#6E7E96'), c('#8A5A3C', '#4E5C74')]} floor={[c('#7A4E34', '#4A5468'), c('#4A2E1E', '#262E3E')]} />
      {/* wainscot */}
      <rect y={800} width={W} height={310} fill={c('#9A6444', '#5A6880')} opacity={0.6} />
      <rect y={792} width={W} height={10} fill={c('#C9946A', '#8A98B0')} />
      {/* jendela */}
      <g transform="translate(90,330)">
        <rect x={-12} y={-12} width={284} height={364} rx={8} fill={c('#E8C49A', '#A9B8CC')} />
        <rect width={260} height={340} fill={c('#2A3A66', '#1E2A44')} />
        <circle cx={190} cy={80} r={34} fill={c('#FFF0C8', '#DDE8F8')} opacity={0.9} />
        <rect x={124} width={12} height={340} fill={c('#E8C49A', '#A9B8CC')} />
        <path d="M -40 -30 Q 30 200 -10 380 L -50 380 Z" fill={c('#C0503C', '#6A7A9A')} />
        <path d="M 300 -30 Q 230 200 270 380 L 310 380 Z" fill={c('#C0503C', '#6A7A9A')} />
      </g>
      {/* foto pernikahan di dinding */}
      {photoFall < 1 && (
        <g transform={`translate(560,${430 + photoFall * photoFall * 640}) rotate(${photoTilt + photoFall * 25})`} opacity={1}>
          <line x1={-60} y1={-150} x2={0} y2={-200} stroke="#3A2A20" strokeWidth={3} /><line x1={60} y1={-150} x2={0} y2={-200} stroke="#3A2A20" strokeWidth={3} />
          <WeddingPhoto crack={photoCrack} />
        </g>
      )}
      {/* jam dinding */}
      <g transform="translate(860,330)"><circle r={52} fill={c('#E8C49A', '#B0BCCC')} /><circle r={44} fill={c('#FFF6E8', '#E6ECF4')} />
        {Array.from({length: 12}).map((_, i) => <rect key={i} x={-2} y={-40} width={4} height={8} fill="#5A4A40" transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-28} stroke="#3A2A20" strokeWidth={5} strokeLinecap="round" transform="rotate(300)" />
        <line x1={0} y1={0} x2={0} y2={-36} stroke="#C0392B" strokeWidth={3} strokeLinecap="round" transform={`rotate(${(f * 6) % 360})`} /></g>
      {/* lampu berdiri */}
      <g transform="translate(990,1110)">
        <rect x={-4} y={-420} width={8} height={420} fill="#3A2A20" />
        <path d="M -50 -420 L 50 -420 L 34 -500 L -34 -500 Z" fill={c('#F2D9A8', '#C8D2E0')} />
        <Halo y={-440} rx={200} color={c('#FFC870', '#BFD4FF')} op={0.45 * lampOn} />
      </g>
      {/* sofa */}
      <g transform="translate(60,1110)">
        <rect x={0} y={-190} width={330} height={120} rx={30} fill={c('#D07A4A', '#6E7E9A')} />
        <rect x={-20} y={-110} width={370} height={100} rx={26} fill={c('#E08A56', '#7A8AA6')} />
        <rect x={-30} y={-150} width={60} height={140} rx={24} fill={c('#C06A3E', '#62728E')} />
        <rect x={320} y={-150} width={60} height={140} rx={24} fill={c('#C06A3E', '#62728E')} />
        <rect x={40} y={-170} width={90} height={70} rx={20} fill={c('#F2C94C', '#9AA8C0')} transform="rotate(-8 85 -135)" />
      </g>
      {/* meja makan + 2 kursi + vas */}
      <g transform="translate(560,1110)">
        <rect x={0} y={-150} width={400} height={20} rx={6} fill={c('#8A5A3C', '#4E5A70')} />
        <rect x={20} y={-130} width={16} height={130} fill={c('#6A4430', '#3A4458')} /><rect x={364} y={-130} width={16} height={130} fill={c('#6A4430', '#3A4458')} />
        {[0, 340].map((x) => <g key={x}><rect x={x - 20} y={-230} width={14} height={230} fill={c('#5A3A28', '#343E50')} /><rect x={x - 20} y={-110} width={90} height={14} fill={c('#5A3A28', '#343E50')} /></g>)}
        <path d="M 180 -150 L 186 -200 L 214 -200 L 220 -150 Z" fill={c('#4FB3A9', '#6A8AA0')} />
        {[0, 1, 2].map((k) => <circle key={k} cx={190 + k * 10} cy={-215 - (k % 2) * 12} r={11} fill={c(['#F2C94C', '#E86A5A', '#F7F1E8'][k], '#B8C4D4')} />)}
        <path d="M 290 -150 L 300 -185 L 330 -185 L 336 -150 Z" fill={c('#FFF4E0', '#D8E2EE')} />
      </g>
      {/* karpet */}
      <ellipse cx={300} cy={1300} rx={330} ry={60} fill={c('#A8463A', '#46506A')} opacity={0.7} />
    </g>
  );
};

/* ================= 7. KAMAR PASANGAN (malam, dingin) ================= */
export const CoupleBedroom: React.FC<{phoneGlow?: number; doorOpen?: number}> = ({phoneGlow = 1, doorOpen = 0.45}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Room wall={['#1E2638', '#141A28']} floor={['#1A2030', '#0A0E16']} />
      {/* pintu setengah tertutup (kiri) */}
      <g transform="translate(60,560)">
        <rect x={-10} y={-10} width={240} height={560} fill="#2A3246" />
        <rect width={220} height={550} fill="#0A0C12" />
        <Halo x={110} y={300} rx={60} ry={260} color="#FFD9A0" op={0.25 * doorOpen} />
        <rect x={220 * doorOpen} width={220 * (1 - doorOpen)} height={550} fill="#3A4258" />
        <circle cx={220 * doorOpen + 22} cy={290} r={8} fill="#A9B2C8" />
      </g>
      {/* jendela tirai tertutup */}
      <rect x={640} y={330} width={300} height={360} fill="#2E3650" />
      {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={640 + k * 50} y={330} width={30} height={360} fill="#262E44" />)}
      {/* kasur */}
      <g transform="translate(330,1010)">
        <rect x={0} y={-200} width={36} height={300} rx={10} fill="#2A3246" />
        <rect x={0} y={0} width={560} height={110} rx={20} fill="#262E44" />
        <path d="M 20 0 C 140 -24 300 10 560 -10 L 560 50 L 20 50 Z" fill="#3E4A6E" />
        <ellipse cx={110} cy={-24} rx={74} ry={28} fill="#C8D0E4" opacity={0.85} />
        <ellipse cx={250} cy={-24} rx={74} ry={28} fill="#C8D0E4" opacity={0.85} />
      </g>
      {/* nakas + HP glow merah */}
      <g transform="translate(940,1010)">
        <rect x={-50} y={-90} width={110} height={190} rx={8} fill="#2A3246" />
        <Halo x={5} y={-110} rx={150} color="#FF3B3B" op={0.45 * phoneGlow * (0.85 + 0.15 * Math.sin(f * 0.3))} />
        <rect x={-22} y={-104} width={54} height={14} rx={4} fill="#14161E" />
        <rect x={-18} y={-102} width={46} height={9} rx={3} fill="#FF3B3B" opacity={phoneGlow} />
      </g>
    </g>
  );
};

// foto pernikahan berbingkai (pasangan mini) — dipakai di dinding & di pelaminan; crack 0..1 retak
export const WeddingPhoto: React.FC<{crack?: number; s?: number}> = ({crack = 0, s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-120} y={-150} width={240} height={190} rx={6} fill="#C9A06A" />
    <rect x={-104} y={-134} width={208} height={158} fill="#F2E3C8" />
    <circle cx={-34} cy={-74} r={24} fill="#F1C9A5" /><path d="M -58 -84 Q -34 -112 -10 -84 Z" fill="#17141C" />
    <path d="M -64 24 L -60 -44 L -8 -44 L -4 24 Z" fill="#2B2F40" /><path d="M -40 -46 L -34 -20 L -28 -46 Z" fill="#FFFFFF" />
    <ellipse cx={34} cy={-74} rx={30} ry={32} fill="#FBF6EE" /><circle cx={34} cy={-72} r={20} fill="#F1C9A5" />
    <path d="M 2 24 Q 8 -44 34 -44 Q 60 -44 66 24 Z" fill="#F6EFE4" />
    {crack > 0 && (
      <g opacity={Math.min(1, crack * 2)}>
        <path d={`M -10 -150 L 10 -100 L -20 -60 L 14 -20 L -6 40`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeDasharray={260} strokeDashoffset={260 * (1 - crack)} />
        <path d={`M 10 -100 L 60 -110 M -20 -60 L -80 -40 M 14 -20 L 70 0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={crack > 0.5 ? 1 : 0} />
      </g>
    )}
    <rect x={-104} y={-134} width={208} height={40} fill="#FFFFFF" opacity={0.12} />
  </g>
);
