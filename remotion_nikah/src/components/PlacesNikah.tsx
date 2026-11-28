// TEMPAT BARU video "nikah dengan pecandu" — tempat nyata yang disederhanakan, dirender di layer latar (Main memberi blur DOF
// + dim), lantai mengkilap dengan pantulan lampu. Semua warna diambil dari `tone` -> tiap zoom tone bisa bergeser halus sementara
// TEMPAT-nya tetap sama. Koordinat dunia: lantai (kaki karakter) di FLOOR_Y = 1250; area pusat x 0..1080.
import React from 'react';
import {FLOOR_Y, Tone, mix, rand} from '../theme';
import {useSid} from './Phone';

export const TONES = {
  // HOOK
  akad: {top: '#241A12', mid: '#5A4128', floor: '#20160E', furn: '#6E5034', furnHi: '#E8C98A', glow: '#FFD9A0', accent: '#F2C14E'},
  akadZoom: {top: '#2E1A10', mid: '#7A4A22', floor: '#2A180C', furn: '#86592E', furnHi: '#FFD58A', glow: '#FFC46A', accent: '#FFD166'},
  darkRoom: {top: '#0C0408', mid: '#34101A', floor: '#0C0406', furn: '#240A10', furnHi: '#6E1A26', glow: '#FF3B4A', accent: '#FF5A66'},
  inviteDesk: {top: '#1E1C1A', mid: '#4A443C', floor: '#4A3424', furn: '#5E4430', furnHi: '#F4E6C8', glow: '#FFF1D6', accent: '#D9B46A'},
  inviteRed: {top: '#1E1012', mid: '#4A2A2A', floor: '#4A2A20', furn: '#5E3A2E', furnHi: '#F4D6C8', glow: '#FFD6C6', accent: '#E04050'},
  // ONE SHOT: krem hangat -> ungu -> merah gelap
  osCream: {top: '#2A231C', mid: '#6A5A48', floor: '#3A2A1C', furn: '#7A6248', furnHi: '#F2DEC0', glow: '#FFE6C0', accent: '#E8C090'},
  osPurple: {top: '#1C1424', mid: '#4A3460', floor: '#24182E', furn: '#4E3A5E', furnHi: '#C9A8E8', glow: '#D9A8FF', accent: '#B98AE8'},
  osRed: {top: '#1A080C', mid: '#4A1420', floor: '#1E0A0E', furn: '#4A1A22', furnHi: '#C95A66', glow: '#FF4A5A', accent: '#E8404E'},
  // FASE 1 apartemen: dasar ungu-pink gelap
  f1Base: {top: '#150C1A', mid: '#3A1E40', floor: '#1A0E1E', furn: '#3E2446', furnHi: '#B67AB8', glow: '#FF7AC8', accent: '#FF5FB0'},
  f1Pink: {top: '#1C0A1A', mid: '#4E1A44', floor: '#220C20', furn: '#4E2048', furnHi: '#E07AC0', glow: '#FF4FB4', accent: '#FF7AD0'},
  f1Violet: {top: '#100C20', mid: '#2E2050', floor: '#140E24', furn: '#33285A', furnHi: '#9C8AE0', glow: '#B08AFF', accent: '#C9A0FF'},
  f1Cold: {top: '#0C1020', mid: '#223050', floor: '#0E1424', furn: '#2A3454', furnHi: '#8AA6D8', glow: '#9FC4FF', accent: '#B8D4FF'},
  f1Warm: {top: '#1A0E14', mid: '#4A2430', floor: '#1E0E12', furn: '#4A2A30', furnHi: '#E8A070', glow: '#FFB060', accent: '#FF9A50'},
  f1Red: {top: '#14060C', mid: '#3E0E1E', floor: '#16060A', furn: '#3A1020', furnHi: '#B04050', glow: '#FF3348', accent: '#FF4A5A'},
  f1Toxic: {top: '#0E120C', mid: '#24361E', floor: '#10140C', furn: '#283A22', furnHi: '#8AC070', glow: '#7CFF6A', accent: '#9AFF7A'},
  // FASE 2 garasi: dasar biru-cyan dingin
  f2Base: {top: '#060E16', mid: '#123044', floor: '#08121A', furn: '#163246', furnHi: '#6AB0D0', glow: '#4FD8FF', accent: '#29E3FF'},
  f2Teal: {top: '#04141A', mid: '#0E3E48', floor: '#061418', furn: '#124248', furnHi: '#5AD0D0', glow: '#3FF0E8', accent: '#40FFE0'},
  f2Deep: {top: '#060A18', mid: '#14204A', floor: '#080C1C', furn: '#18245A', furnHi: '#6A80E0', glow: '#6A8CFF', accent: '#8AA8FF'},
  f2Pink: {top: '#120A1A', mid: '#3A1C48', floor: '#120A1A', furn: '#3A2050', furnHi: '#D07AC8', glow: '#FF6AD0', accent: '#FF8AE0'},
  f2Warm: {top: '#14100C', mid: '#3E3020', floor: '#12100C', furn: '#3A3024', furnHi: '#E8C890', glow: '#FFD08A', accent: '#FFC46A'},
  f2Red: {top: '#14060A', mid: '#401418', floor: '#14070A', furn: '#3E161C', furnHi: '#D05A50', glow: '#FF4A36', accent: '#FF6A3A'},
  // MID-CTA panggung: navy ala ref_1 -> amber -> merah gelap
  ctaNavy: {top: '#0D1216', mid: '#1F2330', floor: '#0A0D12', furn: '#2A2F3A', furnHi: '#8A90A0', glow: '#FFB23F', accent: '#FFC23F'},
  ctaAmber: {top: '#16100A', mid: '#3A2A16', floor: '#120D08', furn: '#3A2E1E', furnHi: '#E8C078', glow: '#FFC46A', accent: '#FFD166'},
  ctaRed: {top: '#10060A', mid: '#2E0E14', floor: '#0C0507', furn: '#2E1218', furnHi: '#A0303A', glow: '#FF2A3A', accent: '#FF3B4A'},
  // FASE 3 lorong + kamar anak: merah-maroon makin gelap
  f3Maroon: {top: '#14070A', mid: '#3E1418', floor: '#16080A', furn: '#3A161A', furnHi: '#B0605A', glow: '#FF7A5A', accent: '#FF5A4A'},
  f3Red: {top: '#160508', mid: '#4A0E16', floor: '#140508', furn: '#44101A', furnHi: '#D04048', glow: '#FF3040', accent: '#FF3344'},
  f3Dark: {top: '#090305', mid: '#22080C', floor: '#080305', furn: '#220A0E', furnHi: '#702A30', glow: '#C0202E', accent: '#E0303E'},
  f3Night: {top: '#08070C', mid: '#1C1420', floor: '#08060A', furn: '#1E1620', furnHi: '#6A5060', glow: '#FFC56A', accent: '#FFB040'},
} satisfies Record<string, Tone>;
export type ToneName = keyof typeof TONES;

/* ---------------- helper ---------------- */
// dinding: gradasi vertikal + kolam cahaya lembut di belakang subjek (gx, gy)
export const Wall: React.FC<{tone: Tone; x0?: number; x1?: number; y0?: number; gx?: number; gy?: number; gr?: number; gop?: number}> = ({
  tone, x0 = -900, x1 = 1980, y0 = -700, gx = 540, gy = 760, gr = 760, gop = 0.32,
}) => {
  const id = useSid('wl');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1={y0} x2="0" y2={FLOOR_Y} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={tone.top} /><stop offset="1" stopColor={tone.mid} />
        </linearGradient>
        <radialGradient id={`${id}r`} cx={gx} cy={gy} r={gr} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={tone.glow} stopOpacity={gop} /><stop offset="0.5" stopColor={tone.glow} stopOpacity={gop * 0.35} /><stop offset="1" stopColor={tone.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x0} y={y0} width={x1 - x0} height={FLOOR_Y - y0} fill={`url(#${id}l)`} />
      <rect x={x0} y={y0} width={x1 - x0} height={FLOOR_Y - y0} fill={`url(#${id}r)`} />
    </g>
  );
};
type Light = {x: number; c: string; w?: number; op?: number};
// lantai mengkilap: gradasi + tekstur (kayu/keramik/beton basah/panggung) + pantulan vertikal sumber cahaya
export const GlossFloor: React.FC<{tone: Tone; x0?: number; x1?: number; kind?: 'wood' | 'ceramic' | 'concrete' | 'stage'; lights?: Light[]; t?: number}> = ({
  tone, x0 = -900, x1 = 1980, kind = 'wood', lights = [], t = 0,
}) => {
  const id = useSid('fl');
  const y = FLOOR_Y, H = 1300;
  const line = mix(tone.floor, tone.furnHi, 0.18);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1={y} x2="0" y2={y + H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(tone.floor, tone.mid, 0.35)} /><stop offset="0.5" stopColor={tone.floor} /><stop offset="1" stopColor={mix(tone.floor, '#000000', 0.5)} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1={y} x2="0" y2={y + 700} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={1} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={x0} y={y} width={x1 - x0} height={700}><rect x={x0} y={y} width={x1 - x0} height={700} fill={`url(#${id}s)`} /></mask>
      </defs>
      <rect x={x0} y={y} width={x1 - x0} height={H} fill={`url(#${id}g)`} />
      {kind === 'wood' && Array.from({length: 14}).map((_, i) => {
        const yy = y + Math.pow(i / 14, 1.6) * 900 + 8;
        return <line key={i} x1={x0} y1={yy} x2={x1} y2={yy} stroke={line} strokeWidth={2 + i * 0.25} opacity={0.5} />;
      })}
      {kind === 'wood' && Array.from({length: 30}).map((_, i) => {
        const row = i % 7, yy = y + Math.pow(row / 14, 1.6) * 900 + 8, xx = x0 + ((i * 263) % (x1 - x0));
        return <line key={`v${i}`} x1={xx} y1={yy} x2={xx} y2={yy + 20 + row * 10} stroke={line} strokeWidth={2} opacity={0.4} />;
      })}
      {kind === 'ceramic' && Array.from({length: 9}).map((_, i) => {
        const yy = y + Math.pow(i / 9, 1.5) * 1000 + 6;
        return <line key={i} x1={x0} y1={yy} x2={x1} y2={yy} stroke={line} strokeWidth={2.5} opacity={0.55} />;
      })}
      {kind === 'ceramic' && Array.from({length: 26}).map((_, i) => {
        const xx = -1500 + i * 180;
        return <line key={`c${i}`} x1={540 + (xx - 540) * 0.35} y1={y} x2={540 + (xx - 540) * 2.2} y2={y + 1100} stroke={line} strokeWidth={2.5} opacity={0.45} />;
      })}
      {kind === 'concrete' && Array.from({length: 7}).map((_, i) => (
        <ellipse key={i} cx={x0 + 200 + ((i * 557) % (x1 - x0 - 400))} cy={y + 90 + (i % 3) * 110} rx={180 + (i % 3) * 70} ry={18 + (i % 3) * 8}
          fill={tone.glow} opacity={0.06 + 0.03 * Math.sin(t * 0.05 + i)} />
      ))}
      {kind === 'stage' && Array.from({length: 18}).map((_, i) => {
        const xx = -1300 + i * 220;
        return <line key={i} x1={540 + (xx - 540) * 0.45} y1={y} x2={540 + (xx - 540) * 2} y2={y + 1100} stroke={line} strokeWidth={2} opacity={0.35} />;
      })}
      {/* garis horizon tipis + kilau */}
      <rect x={x0} y={y - 1} width={x1 - x0} height={3} fill={tone.furnHi} opacity={0.12} />
      {/* pantulan vertikal lampu di lantai mengkilap */}
      <g mask={`url(#${id}m)`}>
        {lights.map((L, i) => (
          <g key={i}>
            <rect x={L.x - (L.w ?? 120) / 2} y={y} width={L.w ?? 120} height={700} fill={L.c} opacity={(L.op ?? 0.35) * (0.9 + 0.1 * Math.sin(t * 0.07 + i))} />
            <rect x={L.x - (L.w ?? 120) / 6} y={y} width={(L.w ?? 120) / 3} height={700} fill="#FFFFFF" opacity={(L.op ?? 0.35) * 0.35} />
          </g>
        ))}
      </g>
    </g>
  );
};
const Box: React.FC<{x: number; y: number; w: number; h: number; c: string; hi?: string; rx?: number; op?: number}> = ({x, y, w, h, c, hi, rx = 6, op = 1}) => (
  <g opacity={op}>
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={c} />
    {hi && <rect x={x} y={y} width={w} height={Math.min(10, h * 0.12)} rx={rx} fill={hi} opacity={0.35} />}
  </g>
);
// kardus pindahan (lakban + tulisan spidol coretan)
const Carton: React.FC<{x: number; y: number; w: number; h: number; tone: Tone; seed?: number}> = ({x, y, w, h, tone, seed = 1}) => {
  const c = mix('#9A7650', tone.furn, 0.45), d = mix('#6E5034', tone.furn, 0.45), tape = mix('#D9C49A', tone.furnHi, 0.4);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} />
      <rect x={x} y={y} width={w} height={h * 0.18} fill={d} opacity={0.6} />
      <rect x={x + w / 2 - 10} y={y} width={20} height={h * 0.45} fill={tape} opacity={0.85} />
      <path d={`M ${x + w * 0.15} ${y + h * 0.62} q ${w * 0.1} ${-10 - rand(seed) * 8} ${w * 0.22} 0 t ${w * 0.22} 0`} stroke={d} strokeWidth={4} fill="none" />
    </g>
  );
};

/* ================= HOOK 1: MEJA AKAD (tirai krem-emas, rangkaian melati, karpet) ================= */
export const PlaceAkad: React.FC<{tone: Tone; t: number}> = ({tone, t}) => (
  <g>
    <Wall tone={tone} gx={540} gy={700} gr={900} gop={0.4} />
    {/* tirai berlipat */}
    {Array.from({length: 22}).map((_, i) => {
      const x = -700 + i * 120;
      return <path key={i} d={`M ${x} -600 Q ${x + 60} ${400} ${x + 10} ${FLOOR_Y}`} stroke={mix(tone.furn, tone.furnHi, 0.35 + (i % 2) * 0.2)} strokeWidth={70} fill="none" opacity={0.55} />;
    })}
    {/* lengkung dekorasi + lampu gantung kecil */}
    <path d="M -200 120 Q 540 -40 1280 120" stroke={tone.accent} strokeWidth={14} fill="none" opacity={0.5} />
    {Array.from({length: 11}).map((_, i) => <circle key={i} cx={-160 + i * 145} cy={110 - Math.sin((i / 10) * Math.PI) * 150 + 30} r={14} fill={tone.glow} opacity={0.55 + 0.25 * Math.sin(t * 0.1 + i)} />)}
    {/* rangkaian melati di standar kiri-kanan */}
    {[-60, 1140].map((x, k) => (
      <g key={k}>
        <rect x={x - 12} y={720} width={24} height={530} fill={tone.furn} />
        {Array.from({length: 16}).map((_, i) => <circle key={i} cx={x + Math.cos(i * 1.7) * 90 * rand(i + k)} cy={640 + Math.sin(i * 2.3) * 80} r={26 + rand(i * 3) * 18} fill="#F4F0E6" opacity={0.75} />)}
        {Array.from({length: 6}).map((_, i) => <circle key={`g${i}`} cx={x + (rand(i * 7 + k) - 0.5) * 160} cy={640 + (rand(i * 5) - 0.5) * 140} r={18} fill="#6E9E5A" opacity={0.6} />)}
      </g>
    ))}
    <GlossFloor tone={tone} kind="wood" t={t} lights={[{x: 540, c: tone.glow, w: 520, op: 0.22}, {x: -60, c: '#FFFFFF', w: 160, op: 0.2}, {x: 1140, c: '#FFFFFF', w: 160, op: 0.2}]} />
    {/* karpet akad */}
    <path d={`M 40 ${FLOOR_Y + 10} L 1040 ${FLOOR_Y + 10} L 1300 ${FLOOR_Y + 420} L -220 ${FLOOR_Y + 420} Z`} fill={mix('#8E2A34', tone.furn, 0.4)} opacity={0.75} />
    <path d={`M 80 ${FLOOR_Y + 30} L 1000 ${FLOOR_Y + 30} L 1220 ${FLOOR_Y + 380} L -140 ${FLOOR_Y + 380} Z`} fill="none" stroke={tone.accent} strokeWidth={8} opacity={0.5} />
  </g>
);

/* ================= HOOK 2: KAMAR GELAP (jendela kerai bergaris merah, ranjang, colokan) ================= */
export const PlaceDarkRoom: React.FC<{tone: Tone; t: number}> = ({tone, t}) => (
  <g>
    <Wall tone={tone} gx={620} gy={820} gr={640} gop={0.4} />
    <rect x={640} y={240} width={420} height={520} fill={mix(tone.mid, tone.glow, 0.25)} />
    {Array.from({length: 13}).map((_, i) => <rect key={i} x={640} y={250 + i * 40} width={420} height={18} fill={tone.top} opacity={0.85} />)}
    <rect x={630} y={230} width={440} height={540} fill="none" stroke={tone.furn} strokeWidth={18} />
    {/* garis cahaya kerai di dinding */}
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M 640 ${260 + i * 72} L -200 ${460 + i * 110}`} stroke={tone.glow} strokeWidth={24} opacity={0.06} />)}
    {/* ranjang gelap */}
    <rect x={-300} y={980} width={760} height={270} rx={30} fill={tone.furn} />
    <rect x={-300} y={950} width={760} height={60} rx={26} fill={mix(tone.furn, tone.furnHi, 0.35)} />
    <rect x={-330} y={780} width={70} height={470} rx={16} fill={mix(tone.furn, '#000000', 0.3)} />
    {/* stopkontak */}
    <rect x={900} y={1000} width={70} height={100} rx={12} fill={mix(tone.furn, tone.furnHi, 0.45)} />
    {[1030, 1066].map((yy) => <g key={yy}><circle cx={922} cy={yy} r={6} fill={tone.top} /><circle cx={948} cy={yy} r={6} fill={tone.top} /></g>)}
    <GlossFloor tone={tone} kind="wood" t={t} lights={[{x: 850, c: tone.glow, w: 420, op: 0.25}]} />
  </g>
);

/* ================= HOOK 3: MEJA UNDANGAN (permukaan meja kayu besar, lampu meja, amplop) ================= */
export const PlaceInviteDesk: React.FC<{tone: Tone; t: number}> = ({tone, t}) => (
  <g>
    <Wall tone={tone} gx={300} gy={500} gr={800} gop={0.45} />
    {/* rak buku samar di dinding */}
    {[0, 1, 2].map((r) => <g key={r}><rect x={600} y={140 + r * 200} width={560} height={16} fill={tone.furn} />
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={620 + i * 58} y={60 + r * 200 + (i % 3) * 8} width={44} height={80 - (i % 3) * 8} fill={mix(tone.furn, tone.accent, (i % 4) * 0.12)} opacity={0.8} />)}</g>)}
    {/* lampu meja di kiri */}
    <g transform="translate(-40,700)">
      <circle cx={140} cy={120} r={380} fill={tone.glow} opacity={0.16} />
      <path d="M 0 520 L 60 120 L 120 100" stroke={tone.furn} strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M 70 80 L 230 40 L 260 160 L 110 190 Z" fill={tone.furn} />
      <ellipse cx={186} cy={176} rx={78} ry={22} fill={tone.glow} opacity={0.9} />
    </g>
    {/* meja kayu (permukaan miring perspektif) */}
    <path d={`M -900 ${FLOOR_Y - 330} L 1980 ${FLOOR_Y - 330} L 1980 2400 L -900 2400 Z`} fill={tone.floor} />
    {Array.from({length: 9}).map((_, i) => <path key={i} d={`M -900 ${FLOOR_Y - 300 + i * 110 + Math.pow(i, 1.4) * 14} Q 540 ${FLOOR_Y - 316 + i * 112} 1980 ${FLOOR_Y - 296 + i * 110}`} stroke={mix(tone.floor, tone.furnHi, 0.15)} strokeWidth={4} fill="none" opacity={0.5} />)}
    <ellipse cx={220} cy={FLOOR_Y - 160} rx={620} ry={260} fill={tone.glow} opacity={0.14 + 0.02 * Math.sin(t * 0.05)} />
    {/* amplop & pita samar */}
    <g transform={`translate(-180,${FLOOR_Y + 120}) rotate(-12)`}><rect x={-110} y={-70} width={220} height={140} rx={6} fill={mix('#F2E6CE', tone.furnHi, 0.3)} opacity={0.8} /><path d="M -110 -70 L 0 10 L 110 -70" stroke={tone.accent} strokeWidth={4} fill="none" /></g>
    <g transform={`translate(1240,${FLOOR_Y + 60}) rotate(16)`}><rect x={-110} y={-70} width={220} height={140} rx={6} fill={mix('#F2E6CE', tone.furnHi, 0.3)} opacity={0.7} /></g>
  </g>
);

/* ================= ONE SHOT: KAMAR PENGANTIN BARU penuh kardus pindahan, lantai kayu mengkilap ================= */
export const PlaceNewlywed: React.FC<{tone: Tone; t: number}> = ({tone, t}) => (
  <g>
    <Wall tone={tone} gx={540} gy={720} gr={820} gop={0.38} />
    {/* jendela bertirai malam */}
    <rect x={330} y={180} width={420} height={460} fill={mix(tone.top, '#0A1030', 0.4)} />
    {Array.from({length: 18}).map((_, i) => <circle key={i} cx={350 + rand(i) * 380} cy={200 + rand(i * 3) * 300} r={2 + rand(i * 7) * 2} fill="#FFFFFF" opacity={0.3 + 0.3 * Math.sin(t * 0.08 + i)} />)}
    <rect x={318} y={168} width={444} height={484} fill="none" stroke={tone.furn} strokeWidth={20} />
    <path d="M 290 150 Q 340 420 300 700 L 220 700 Q 250 420 210 150 Z" fill={mix(tone.furn, tone.furnHi, 0.3)} />
    <path d="M 790 150 Q 740 420 780 700 L 860 700 Q 830 420 870 150 Z" fill={mix(tone.furn, tone.furnHi, 0.3)} />
    {/* ranjang pengantin: headboard + seprai + kelopak bunga */}
    <rect x={200} y={760} width={680} height={200} rx={40} fill={tone.furn} />
    <rect x={160} y={940} width={760} height={240} rx={28} fill={mix(tone.furn, tone.furnHi, 0.55)} />
    <rect x={160} y={1150} width={760} height={100} rx={12} fill={tone.furn} />
    {Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={260 + rand(i * 2) * 560} cy={980 + rand(i * 5) * 140} rx={12} ry={7} fill={mix('#E04A6A', tone.accent, 0.3)} opacity={0.75} transform={`rotate(${rand(i) * 180} ${260 + rand(i * 2) * 560} ${980 + rand(i * 5) * 140})`} />)}
    {/* tumpukan kardus kiri-kanan */}
    <Carton x={-420} y={1000} w={260} h={250} tone={tone} seed={1} /><Carton x={-380} y={790} w={220} h={210} tone={tone} seed={2} />
    <Carton x={-150} y={1080} w={200} h={170} tone={tone} seed={3} /><Carton x={-560} y={1060} w={150} h={190} tone={tone} seed={4} />
    <Carton x={960} y={980} w={280} h={270} tone={tone} seed={5} /><Carton x={1010} y={780} w={210} h={200} tone={tone} seed={6} />
    <Carton x={1250} y={1060} w={200} h={190} tone={tone} seed={7} /><Carton x={900} y={1120} w={130} h={130} tone={tone} seed={8} />
    {/* lampu tidur kecil */}
    <g transform="translate(70,980)"><circle r={130} fill={tone.glow} opacity={0.18} /><path d="M -40 -40 L 40 -40 L 56 30 L -56 30 Z" fill={mix(tone.furnHi, '#FFFFFF', 0.3)} opacity={0.9} /><rect x={-6} y={30} width={12} height={240} fill={tone.furn} /></g>
    <GlossFloor tone={tone} kind="wood" t={t} lights={[{x: 70, c: tone.glow, w: 200, op: 0.3}, {x: 540, c: tone.glow, w: 420, op: 0.16}]} />
  </g>
);

/* ================= FASE 1: APARTEMEN MALAM — dapur (x -1500..-250) | ruang tengah (-250..1350) | kamar (1350..2750) ================= */
export const APT = {kitchen: -850, living: 540, bedroom: 2050, fridgeX: -1080, stoveX: -620, sofaX: 540, bedX: 2050, doorX: 2560, windowX: 1000, plantX: 60};
export const PlaceApartment: React.FC<{tone: Tone; t: number; doorRed?: number}> = ({tone, t, doorRed = 0}) => {
  const hi = (k: number) => mix(tone.furn, tone.furnHi, k);
  return (
    <g>
      <Wall tone={tone} x0={-1800} x1={3100} gx={540} gy={760} gr={900} gop={0.3} />
      <Wall tone={tone} x0={-1800} x1={-250} gx={-850} gy={700} gr={600} gop={0.18} />
      {/* sekat ruangan */}
      <rect x={-262} y={-700} width={24} height={1950} fill={hi(0.15)} opacity={0.6} />
      <rect x={1338} y={-700} width={24} height={1950} fill={hi(0.15)} opacity={0.6} />
      {/* ---- dapur ---- */}
      <rect x={-1500} y={300} width={1150} height={220} fill={tone.furn} />
      {Array.from({length: 5}).map((_, i) => <rect key={i} x={-1490 + i * 228} y={310} width={216} height={200} rx={6} fill={hi(0.12)} />)}
      <rect x={-1500} y={930} width={1150} height={320} fill={tone.furn} />
      <rect x={-1510} y={910} width={1170} height={28} rx={6} fill={hi(0.45)} />
      {Array.from({length: 4}).map((_, i) => <rect key={i} x={-1460 + i * 280} y={970} width={250} height={250} rx={8} fill={hi(0.1)} />)}
      <rect x={APT.fridgeX - 110} y={520} width={220} height={730} rx={18} fill={hi(0.35)} />
      <rect x={APT.fridgeX - 110} y={800} width={220} height={8} fill={tone.furn} />
      <rect x={APT.fridgeX + 84} y={600} width={12} height={150} rx={6} fill={hi(0.6)} />
      <rect x={APT.stoveX - 140} y={890} width={280} height={24} rx={6} fill={hi(0.55)} />
      <circle cx={APT.stoveX} cy={700} r={260} fill={tone.glow} opacity={0.08} />
      <rect x={-760} y={520} width={300} height={260} fill={mix(tone.top, '#0A1030', 0.4)} />
      <rect x={-770} y={510} width={320} height={280} fill="none" stroke={tone.furn} strokeWidth={14} />
      {/* ---- ruang tengah ---- */}
      <rect x={APT.windowX - 220} y={180} width={440} height={560} fill={mix(tone.top, '#0A0E2A', 0.5)} />
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={APT.windowX - 200 + i * 48} y={420 + (i % 4) * 40} width={36} height={320 - (i % 4) * 40} fill={hi(0.08)} />)}
      {Array.from({length: 22}).map((_, i) => <rect key={`w${i}`} x={APT.windowX - 190 + rand(i) * 400} y={440 + rand(i * 3) * 280} width={8} height={10} fill={tone.accent} opacity={0.3 + 0.4 * (Math.sin(t * 0.05 + i * 1.7) > 0 ? 1 : 0.3)} />)}
      <rect x={APT.windowX - 232} y={168} width={464} height={584} fill="none" stroke={tone.furn} strokeWidth={22} />
      <rect x={140} y={300} width={260} height={190} fill={hi(0.2)} /><rect x={154} y={314} width={232} height={162} fill={mix(tone.mid, tone.accent, 0.2)} opacity={0.7} />
      {/* sofa */}
      <rect x={APT.sofaX - 380} y={880} width={760} height={200} rx={40} fill={hi(0.2)} />
      <rect x={APT.sofaX - 360} y={1000} width={720} height={150} rx={24} fill={hi(0.32)} />
      <rect x={APT.sofaX - 430} y={900} width={110} height={300} rx={40} fill={hi(0.26)} />
      <rect x={APT.sofaX + 320} y={900} width={110} height={300} rx={40} fill={hi(0.26)} />
      <rect x={APT.sofaX - 380} y={1150} width={760} height={100} rx={12} fill={tone.furn} />
      {/* meja kopi rendah */}
      <rect x={APT.sofaX - 180} y={1190} width={360} height={24} rx={8} fill={hi(0.4)} />
      {/* ---- kamar tidur ---- */}
      <rect x={APT.bedX - 400} y={760} width={800} height={240} rx={40} fill={tone.furn} />
      <rect x={APT.bedX - 440} y={980} width={880} height={170} rx={26} fill={hi(0.45)} />
      <rect x={APT.bedX - 440} y={1130} width={880} height={120} rx={12} fill={tone.furn} />
      <rect x={APT.bedX - 620} y={1020} width={150} height={230} rx={12} fill={hi(0.18)} />
      <rect x={APT.doorX - 140} y={480} width={280} height={770} fill={hi(0.28)} />
      <rect x={APT.doorX - 156} y={466} width={312} height={784} fill="none" stroke={tone.furn} strokeWidth={22} />
      <rect x={APT.doorX - 140} y={1236} width={280} height={14} fill={mix(tone.furn, '#FF2A3A', doorRed)} opacity={0.4 + doorRed * 0.6} />
      <GlossFloor tone={tone} kind="ceramic" x0={-1800} x1={3100} t={t}
        lights={[{x: APT.windowX, c: tone.glow, w: 380, op: 0.22}, {x: APT.stoveX, c: tone.glow, w: 240, op: 0.16}, {x: APT.bedX - 540, c: tone.glow, w: 160, op: 0.2},
          {x: APT.doorX, c: '#FF2A3A', w: 260, op: 0.5 * doorRed}]} />
    </g>
  );
};

/* ================= FASE 2: GARASI MALAM — beton basah, mobil samar, rak perkakas, mesin cuci, pintu ke rumah ================= */
export const GAR = {car: -380, door: 1880, rack: 900, washer: 1380, cabinet: 360, shelf: -980};
export const PlaceGarage: React.FC<{tone: Tone; t: number; doorOpen?: number; houseLight?: number}> = ({tone, t, doorOpen = 1, houseLight = 0.6}) => {
  const hi = (k: number) => mix(tone.furn, tone.furnHi, k);
  return (
    <g>
      <Wall tone={tone} x0={-1700} x1={2700} gx={540} gy={760} gr={900} gop={0.3} />
      {/* pintu garasi gulung (tengah belakang) */}
      <rect x={-60} y={160 + (1 - doorOpen) * 0} width={760} height={(1090) * Math.max(0.12, 1 - doorOpen * 0.55)} fill={hi(0.22)} />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-60} y={170 + i * 44} width={760} height={6} fill={tone.top} opacity={(170 + i * 44) < 160 + 1090 * Math.max(0.12, 1 - doorOpen * 0.55) ? 0.6 : 0} />)}
      <rect x={-80} y={140} width={800} height={30} fill={tone.furn} />
      {/* lampu neon tabung di plafon */}
      {[-700, 340, 1400].map((x, i) => <g key={i}><rect x={x - 120} y={40} width={240} height={14} rx={7} fill={tone.furnHi} opacity={0.85 + 0.15 * Math.sin(t * 0.3 + i * 2)} /><ellipse cx={x} cy={60} rx={260} ry={60} fill={tone.glow} opacity={0.12} /></g>)}
      {/* mobil samar (samping) */}
      <g transform={`translate(${GAR.car},0)`}>
        <path d="M -620 1180 L -600 1000 Q -560 920 -440 900 L -300 800 Q -180 740 40 740 Q 240 740 320 820 L 440 900 Q 560 920 600 1000 L 620 1180 Z" fill={tone.furn} />
        <path d="M -270 820 Q -170 770 20 770 L 30 890 L -380 890 Z" fill={hi(0.3)} opacity={0.7} />
        <path d="M 70 770 Q 220 770 290 830 L 360 890 L 70 890 Z" fill={hi(0.3)} opacity={0.7} />
        {[-380, 380].map((x) => <g key={x}><circle cx={x} cy={1170} r={96} fill={mix(tone.furn, '#000000', 0.5)} /><circle cx={x} cy={1170} r={44} fill={hi(0.25)} /></g>)}
        <ellipse cx={600} cy={1010} rx={30} ry={18} fill={tone.accent} opacity={0.5} />
      </g>
      {/* rak barang kiri (stoples, kaleng cat) */}
      {[0, 1, 2].map((r) => <g key={r}><rect x={GAR.shelf - 300} y={360 + r * 210} width={420} height={16} fill={hi(0.25)} />
        {Array.from({length: 5}).map((_, i) => <rect key={i} x={GAR.shelf - 290 + i * 82} y={280 + r * 210 + (i % 2) * 14} width={60} height={80 - (i % 2) * 14} rx={8} fill={hi(0.15 + (i % 3) * 0.08)} />)}</g>)}
      {/* papan perkakas (pegboard) kanan */}
      <rect x={GAR.rack - 200} y={260} width={400} height={420} fill={hi(0.12)} />
      {Array.from({length: 48}).map((_, i) => <circle key={i} cx={GAR.rack - 180 + (i % 8) * 52} cy={280 + Math.floor(i / 8) * 66} r={4} fill={tone.top} opacity={0.6} />)}
      <path d={`M ${GAR.rack - 140} 320 l 0 160 M ${GAR.rack - 160} 320 l 40 0`} stroke={hi(0.5)} strokeWidth={12} strokeLinecap="round" />
      <path d={`M ${GAR.rack - 40} 330 l 20 150 l 20 -150 Z`} fill={hi(0.45)} />
      <circle cx={GAR.rack + 90} cy={400} r={50} fill="none" stroke={hi(0.5)} strokeWidth={12} />
      <rect x={GAR.rack + 30} y={520} width={140} height={40} rx={8} fill={hi(0.4)} />
      {/* lemari arsip besi */}
      <rect x={GAR.cabinet - 120} y={760} width={240} height={490} rx={8} fill={hi(0.3)} />
      {[0, 1, 2].map((i) => <g key={i}><rect x={GAR.cabinet - 104} y={780 + i * 158} width={208} height={140} rx={6} fill={hi(0.22)} /><rect x={GAR.cabinet - 30} y={830 + i * 158} width={60} height={12} rx={6} fill={hi(0.6)} /></g>)}
      {/* mesin cuci */}
      <rect x={GAR.washer - 150} y={900} width={300} height={350} rx={18} fill={hi(0.45)} />
      <circle cx={GAR.washer} cy={1080} r={100} fill={hi(0.15)} stroke={hi(0.6)} strokeWidth={12} />
      <rect x={GAR.washer - 130} y={915} width={260} height={40} rx={8} fill={hi(0.3)} />
      {/* pintu ke dalam rumah (cahaya hangat) */}
      <g>
        <rect x={GAR.door - 150} y={460} width={300} height={790} fill={mix('#3A2A18', '#FFD08A', houseLight * doorOpen)} />
        <ellipse cx={GAR.door} cy={900} rx={340} ry={520} fill="#FFC46A" opacity={0.18 * houseLight * doorOpen} />
        <rect x={GAR.door - 166} y={446} width={332} height={804} fill="none" stroke={tone.furn} strokeWidth={24} />
        <path d={`M ${GAR.door + 150} 460 L ${GAR.door + 150 + 80 * doorOpen} 490 L ${GAR.door + 150 + 80 * doorOpen} 1230 L ${GAR.door + 150} 1250 Z`} fill={hi(0.3)} />
      </g>
      <GlossFloor tone={tone} kind="concrete" x0={-1700} x1={2700} t={t}
        lights={[{x: -700, c: tone.glow, w: 260, op: 0.3}, {x: 340, c: tone.glow, w: 260, op: 0.3}, {x: 1400, c: tone.glow, w: 260, op: 0.3},
          {x: GAR.door, c: '#FFC46A', w: 300, op: 0.4 * houseLight * doorOpen}]} />
    </g>
  );
};

/* ================= MID-CTA: PANGGUNG GELAP ala ref_1 — lampu sorot gantung (padam satu-satu), lantai reflektif, pintu merah ================= */
export const PlaceStage: React.FC<{tone: Tone; t: number; lights?: number; door?: number}> = ({tone, t, lights = 1, door = 0}) => {
  const N = 6;
  return (
    <g>
      <Wall tone={tone} gx={540} gy={800} gr={760} gop={0.35 * (0.4 + 0.6 * lights)} />
      {/* tirai samping */}
      {[-1, 1].map((sd) => Array.from({length: 5}).map((_, i) => (
        <path key={`${sd}${i}`} d={`M ${540 + sd * (620 + i * 70)} -600 Q ${540 + sd * (600 + i * 70)} 400 ${540 + sd * (640 + i * 70)} ${FLOOR_Y}`} stroke={mix(tone.furn, tone.furnHi, 0.12 + (i % 2) * 0.1)} strokeWidth={66} fill="none" />
      )))}
      {/* rel lampu + lampu sorot gantung */}
      <rect x={-300} y={-40} width={1680} height={18} fill={tone.furn} />
      {Array.from({length: N}).map((_, i) => {
        const x = -60 + i * 240, on = Math.max(0, Math.min(1, lights * N - (N - 1 - i)));
        return (
          <g key={i}>
            <path d={`M ${x - 26} -20 L ${x + 26} -20 L ${x + 40} 60 L ${x - 40} 60 Z`} fill={mix(tone.furn, tone.furnHi, 0.3)} />
            <path d={`M ${x - 40} 60 L ${x + 40} 60 L ${x + 220} ${FLOOR_Y} L ${x - 220} ${FLOOR_Y} Z`} fill={tone.glow} opacity={0.07 * on} />
            <ellipse cx={x} cy={62} rx={36} ry={10} fill={tone.glow} opacity={0.2 + 0.8 * on} />
            <ellipse cx={x} cy={FLOOR_Y + 30} rx={200} ry={30} fill={tone.glow} opacity={0.12 * on} />
          </g>
        );
      })}
      {/* pintu rumah gelap di ujung panggung, sinar merah dari celah */}
      {door > 0 && (
        <g opacity={door}>
          <rect x={430} y={760} width={220} height={490} fill="#0C0608" />
          <rect x={416} y={746} width={248} height={504} fill="none" stroke="#3A1418" strokeWidth={16} />
          <path d="M 430 1250 L 650 1250 L 900 1600 L 180 1600 Z" fill="#FF2A3A" opacity={0.18} />
          <rect x={430} y={1240} width={220} height={10} fill="#FF2A3A" opacity={0.9} />
          <rect x={640} y={760} width={10} height={490} fill="#FF2A3A" opacity={0.6 + 0.2 * Math.sin(t * 0.3)} />
          <circle cx={620} cy={1010} r={9} fill="#5A3A30" />
        </g>
      )}
      <GlossFloor tone={tone} kind="stage" t={t} lights={[{x: 540, c: tone.glow, w: 420, op: 0.3 * lights}, ...(door > 0 ? [{x: 540, c: '#FF2A3A', w: 240, op: 0.5 * door}] : [])]} />
    </g>
  );
};

/* ================= FASE 3: LORONG RUMAH KELUARGA (x -1300..1350) + KAMAR ANAK (1350..2750), lantai kayu mengkilap ================= */
export const HALL = {frames: [140, 520, 900], doorL: -700, doorK: 1200, kidBed: 2100, lamp: 1720, shelf: 2480};
export const PlaceHallKid: React.FC<{tone: Tone; t: number; nightLamp?: number}> = ({tone, t, nightLamp = 1}) => {
  const hi = (k: number) => mix(tone.furn, tone.furnHi, k);
  return (
    <g>
      <Wall tone={tone} x0={-1700} x1={3100} gx={540} gy={760} gr={900} gop={0.28} />
      <Wall tone={tone} x0={1350} x1={3100} gx={HALL.lamp} gy={900} gr={700} gop={0.22 * nightLamp} />
      {/* lis dinding + wainscot */}
      <rect x={-1700} y={860} width={3050} height={390} fill={hi(0.08)} opacity={0.7} />
      <rect x={-1700} y={850} width={3050} height={14} fill={hi(0.35)} />
      {/* lampu dinding lorong */}
      {[-300, 700].map((x, i) => <g key={i}><path d={`M ${x - 30} 420 L ${x + 30} 420 L ${x + 22} 470 L ${x - 22} 470 Z`} fill={tone.glow} opacity={0.7} /><ellipse cx={x} cy={480} rx={200} ry={260} fill={tone.glow} opacity={0.1} /></g>)}
      {/* pintu kamar kiri & pintu kamar anak */}
      {[HALL.doorL, HALL.doorK].map((x, i) => (
        <g key={i}><rect x={x - 150} y={460} width={300} height={790} fill={hi(0.25)} /><rect x={x - 166} y={444} width={332} height={806} fill="none" stroke={tone.furn} strokeWidth={22} />
          <circle cx={x + 110} cy={880} r={12} fill={hi(0.7)} />
          {[0, 1].map((k) => <rect key={k} x={x - 110} y={510 + k * 360} width={220} height={300} rx={8} fill="none" stroke={tone.furn} strokeWidth={8} opacity={0.6} />)}</g>
      ))}
      {/* karpet lorong panjang */}
      <path d={`M -900 ${FLOOR_Y + 40} L 1200 ${FLOOR_Y + 40} L 1300 ${FLOOR_Y + 300} L -1000 ${FLOOR_Y + 300} Z`} fill={mix('#5A2028', tone.furn, 0.4)} opacity={0.0} />
      {/* ---- kamar anak ---- */}
      <rect x={1362} y={-700} width={1740} height={1950} fill={mix(tone.top, '#101830', 0.2)} opacity={0.35} />
      {Array.from({length: 26}).map((_, i) => <path key={i} transform={`translate(${1420 + rand(i) * 1600},${120 + rand(i * 3) * 600}) scale(${0.5 + rand(i * 5) * 0.6})`}
        d="M 0 -10 L 3 -3 L 10 -3 L 4 2 L 6 10 L 0 5 L -6 10 L -4 2 L -10 -3 L -3 -3 Z" fill={tone.accent} opacity={0.15 + 0.1 * Math.sin(t * 0.06 + i)} />)}
      <rect x={HALL.kidBed - 330} y={950} width={660} height={190} rx={30} fill={hi(0.4)} />
      <rect x={HALL.kidBed - 360} y={1110} width={720} height={140} rx={14} fill={hi(0.2)} />
      <rect x={HALL.kidBed - 380} y={820} width={60} height={430} rx={14} fill={hi(0.3)} />
      <ellipse cx={HALL.kidBed - 220} cy={960} rx={90} ry={36} fill={hi(0.6)} />
      {/* rak mainan */}
      <rect x={HALL.shelf - 160} y={520} width={320} height={16} fill={hi(0.35)} /><rect x={HALL.shelf - 160} y={720} width={320} height={16} fill={hi(0.35)} />
      <rect x={HALL.shelf - 140} y={460} width={60} height={60} rx={6} fill={mix('#3A6AB0', tone.furn, 0.5)} />
      <circle cx={HALL.shelf + 40} cy={490} r={30} fill={mix('#E04A4A', tone.furn, 0.5)} />
      <rect x={HALL.shelf - 120} y={660} width={90} height={60} rx={8} fill={mix('#E8B040', tone.furn, 0.5)} />
      {/* lampu tidur anak (bulan-bintang) */}
      <g transform={`translate(${HALL.lamp},1040)`}>
        <circle r={300} fill="#FFC56A" opacity={0.16 * nightLamp} />
        <circle r={120} fill="#FFD98A" opacity={0.22 * nightLamp} />
        <rect x={-60} y={60} width={120} height={150} rx={10} fill={hi(0.3)} />
        <path d="M 10 -60 A 54 54 0 1 0 10 50 A 40 40 0 1 1 10 -60 Z" fill={mix('#6A5A40', '#FFE6A0', nightLamp)} />
      </g>
      <GlossFloor tone={tone} kind="wood" x0={-1700} x1={3100} t={t}
        lights={[{x: -300, c: tone.glow, w: 200, op: 0.22}, {x: 700, c: tone.glow, w: 200, op: 0.22}, {x: HALL.lamp, c: '#FFC56A', w: 260, op: 0.4 * nightLamp}]} />
    </g>
  );
};
