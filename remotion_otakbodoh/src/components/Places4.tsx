// Tempat video "otak bodoh": TEMPAT NYATA tapi SAMAR (digambar sederhana, nanti diblur kuat + diredupkan di ShotDef),
// lantai mengkilap dengan pantulan (Reflect terhadap horizon). SEMUA warna diturunkan dari `tone` -> cameraTrack bisa menggeser
// tone tiap zoom (navy -> ungu -> maroon dst.) sementara tempatnya tetap sama.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mix, rand} from '../theme';
import {Halo, Reflect} from './Lit';
import {useSid} from './Phone';

export const HZ = 1110;      // horizon dinding/lantai
export const FEET = 1250;    // kaki karakter
const W = 1080, H = 1920;

// tone: top = langit/dinding atas, mid = dinding dekat horizon, floor = lantai, glow = cahaya ambien/aksen
export type Tone = {top: string; mid: string; floor: string; glow: string};
export const mixTone = (a: Tone, b: Tone, k: number): Tone => ({
  top: mix(a.top, b.top, k), mid: mix(a.mid, b.mid, k), floor: mix(a.floor, b.floor, k), glow: mix(a.glow, b.glow, k),
});
// warna turunan: d = gelap (0 = mid, 1 = hitam), l = terang (campur ke glow)
const dk = (T: Tone, d: number) => mix(T.mid, '#020306', d);
const lt = (T: Tone, l: number) => mix(T.mid, T.glow, l);

export const TONES = {
  classroom: {top: '#16222A', mid: '#2A3E44', floor: '#141C20', glow: '#BFE6E0'},
  bedroom: {top: '#140E22', mid: '#2C1C3E', floor: '#120C1A', glow: '#FF8FC0'},
  door: {top: '#1A100C', mid: '#3A2418', floor: '#140C08', glow: '#FFC070'},
  chain: {top: '#0E0C0E', mid: '#241C20', floor: '#0A0809', glow: '#FF5A4A'},
  emptyNavy: {top: '#0B111C', mid: '#1B2436', floor: '#080C14', glow: '#8FA8D8'},
  emptyPurple: {top: '#130C1E', mid: '#2C1C44', floor: '#0E0816', glow: '#B88AFF'},
  libBlue: {top: '#0A1226', mid: '#172A4E', floor: '#0B1020', glow: '#7FB2FF'},
  libDeep: {top: '#070C1C', mid: '#101E3E', floor: '#070A16', glow: '#5A86E0'},
  libIndigo: {top: '#0E0C26', mid: '#231C52', floor: '#0B0920', glow: '#8C7CFF'},
  libPurple: {top: '#160C24', mid: '#33184A', floor: '#110A1C', glow: '#C77CFF'},
  stageNavy: {top: '#0E1320', mid: '#1B2233', floor: '#0A0E16', glow: '#8A9AC0'},
  stageAmber: {top: '#17120E', mid: '#2E2216', floor: '#120D09', glow: '#FFB23F'},
  stageWarm: {top: '#22180E', mid: '#4A341C', floor: '#1A120A', glow: '#FFCF7A'},
  stageCold: {top: '#0A1018', mid: '#16222E', floor: '#080C12', glow: '#7FB7C9'},
  forest: {top: '#07141A', mid: '#12302E', floor: '#061012', glow: '#7FD8C0'},
  forestTeal: {top: '#061220', mid: '#0F2A3A', floor: '#050E16', glow: '#6FC8E8'},
  forestMoss: {top: '#0C1A10', mid: '#1C3A22', floor: '#08120A', glow: '#A8E07F'},
  forestRed: {top: '#1A0A0C', mid: '#3A1418', floor: '#12070A', glow: '#FF5A4A'},
  cityPurple: {top: '#140A1E', mid: '#2E1640', floor: '#0E0816', glow: '#C85AE8'},
  cityMagenta: {top: '#1A0818', mid: '#3E123A', floor: '#120612', glow: '#FF4FA8'},
  cityRed: {top: '#1C080C', mid: '#44121C', floor: '#14060A', glow: '#FF3B4A'},
  officeGray: {top: '#10141A', mid: '#252C36', floor: '#0C1014', glow: '#A8B8CC'},
  officeCold: {top: '#0A121A', mid: '#1A2A38', floor: '#081018', glow: '#7FB7D8'},
  officeDim: {top: '#140E10', mid: '#2E1E22', floor: '#100A0C', glow: '#D07A7A'},
  duskRed: {top: '#1A0A12', mid: '#4A1A1E', floor: '#12080A', glow: '#FF6A3A'},
  duskDark: {top: '#0E0608', mid: '#2A0E12', floor: '#0A0406', glow: '#B83A2E'},
} satisfies Record<string, Tone>;

// gradasi dinding + lantai + halo tengah (ala ref_1: paling terang di belakang subjek)
const Backdrop: React.FC<{T: Tone; hz?: number; haloY?: number; haloOp?: number}> = ({T, hz = HZ, haloY = 820, haloOp = 0.55}) => {
  const id = useSid('bd');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.top} /><stop offset={hz / H} stopColor={T.mid} />
          <stop offset={hz / H + 0.001} stopColor={T.floor} /><stop offset="1" stopColor="#020304" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={`url(#${id}w)`} />
      <Halo x={540} y={haloY} rx={760} ry={640} color={lt(T, 0.35)} op={haloOp} />
    </g>
  );
};
// kilap lantai: garis horizon tipis + coretan cahaya vertikal (pantulan sumber cahaya)
const Gloss: React.FC<{T: Tone; hz?: number; xs?: number[]; c?: string}> = ({T, hz = HZ, xs = [], c}) => (
  <g>
    <rect x={-400} y={hz} width={W + 800} height={2} fill={T.glow} opacity={0.18} />
    {xs.map((x, i) => (
      <g key={i}>
        <Halo x={x} y={hz + 140} rx={44} ry={190} color={c ?? T.glow} op={0.3} />
        <rect x={x - 3} y={hz + 6} width={6} height={260} fill={c ?? T.glow} opacity={0.16} />
      </g>
    ))}
  </g>
);

/* ===== HOOK 1: RUANG KELAS ===== */
export const Classroom: React.FC<{T?: Tone}> = ({T = TONES.classroom}) => (
  <g>
    <Backdrop T={T} />
    <Reflect floor={HZ} op={0.28} depth={520}>
      {/* jendela kiri cahaya bulan */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${-40 + i * 190},360)`}>
          <rect width={160} height={420} rx={6} fill={dk(T, 0.5)} />
          <rect x={10} y={10} width={140} height={400} fill={lt(T, 0.5)} opacity={0.55} />
          <rect x={77} y={10} width={6} height={400} fill={dk(T, 0.5)} /><rect x={10} y={200} width={140} height={6} fill={dk(T, 0.5)} />
        </g>
      ))}
      {/* papan tulis */}
      <rect x={420} y={420} width={640} height={380} rx={10} fill={dk(T, 0.35)} />
      <rect x={440} y={440} width={600} height={340} fill={mix(dk(T, 0.6), '#1E3A2E', 0.5)} />
      <path d="M 480 520 L 640 520 M 480 580 L 700 580 M 760 520 Q 840 470 920 560" stroke={lt(T, 0.6)} strokeWidth={6} opacity={0.35} fill="none" />
      <rect x={420} y={800} width={640} height={16} fill={dk(T, 0.2)} />
      {/* jam dinding */}
      <circle cx={300} cy={280} r={50} fill={lt(T, 0.3)} opacity={0.6} /><path d="M 300 280 L 300 248 M 300 280 L 322 290" stroke={dk(T, 0.6)} strokeWidth={5} />
      {/* meja murid */}
      {[[60, 960], [340, 980], [640, 960], [900, 980]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d="M 0 0 L 200 0 L 220 30 L -20 30 Z" fill={lt(T, 0.12)} />
          <rect x={-10} y={30} width={14} height={120} fill={dk(T, 0.4)} /><rect x={196} y={30} width={14} height={120} fill={dk(T, 0.4)} />
        </g>
      ))}
    </Reflect>
    <Gloss T={T} xs={[40, 230]} />
  </g>
);

/* ===== HOOK 2: KAMAR MALAM ===== */
export const BedroomNight: React.FC<{T?: Tone}> = ({T = TONES.bedroom}) => (
  <g>
    <Backdrop T={T} />
    <Reflect floor={HZ} op={0.28} depth={520}>
      <g transform="translate(90,330)">
        <rect width={300} height={400} rx={8} fill={dk(T, 0.5)} />
        <rect x={14} y={14} width={272} height={372} fill={mix(T.top, '#0A0A20', 0.3)} />
        <circle cx={200} cy={110} r={46} fill="#F4E9D8" opacity={0.85} /><Halo x={200} y={110} rx={140} color="#F4E9D8" op={0.3} />
        <rect x={147} y={14} width={6} height={372} fill={dk(T, 0.5)} />
      </g>
      {/* poster + rak */}
      <rect x={480} y={420} width={150} height={200} rx={6} fill={lt(T, 0.2)} opacity={0.6} />
      <rect x={680} y={560} width={300} height={14} fill={dk(T, 0.3)} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={700 + i * 40} y={500 - (i % 2) * 20} width={30} height={60 + (i % 2) * 20} fill={lt(T, 0.15 + i * 0.05)} />)}
      {/* ranjang */}
      <rect x={560} y={760} width={30} height={300} rx={8} fill={dk(T, 0.4)} />
      <rect x={560} y={900} width={560} height={160} rx={20} fill={lt(T, 0.18)} />
      <rect x={600} y={860} width={180} height={70} rx={30} fill={lt(T, 0.32)} />
      <rect x={560} y={1040} width={560} height={70} fill={dk(T, 0.45)} />
      {/* lampu tidur */}
      <rect x={440} y={940} width={90} height={170} fill={dk(T, 0.35)} />
      <path d="M 450 860 L 520 860 L 506 820 L 464 820 Z" fill={lt(T, 0.7)} /><Halo x={485} y={850} rx={110} color={T.glow} op={0.35} />
    </Reflect>
    <Gloss T={T} xs={[290, 485]} />
  </g>
);

/* ===== HOOK 3: PINTU KAMAR (close, pintu besar di tengah) ===== */
export const DoorHall: React.FC<{T?: Tone; lockGlow?: number}> = ({T = TONES.door, lockGlow = 0}) => (
  <g>
    <Backdrop T={T} haloY={700} />
    <Reflect floor={HZ} op={0.3} depth={520}>
      {/* kusen + daun pintu */}
      <rect x={300} y={300} width={480} height={810} fill={dk(T, 0.55)} />
      <rect x={324} y={324} width={432} height={786} fill={lt(T, 0.16)} />
      {[[360, 370, 360, 300], [360, 720, 360, 330]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={dk(T, 0.3)} strokeWidth={10} />)}
      {/* cahaya tipis di bawah pintu (lampu kamar di dalam) */}
      <rect x={330} y={1100} width={420} height={10} fill={T.glow} opacity={0.5 + 0.3 * lockGlow} />
      {/* lukisan & saklar dinding */}
      <rect x={60} y={460} width={170} height={220} rx={6} fill={dk(T, 0.4)} /><rect x={74} y={474} width={142} height={192} fill={lt(T, 0.22)} />
      <rect x={850} y={700} width={60} height={90} rx={8} fill={lt(T, 0.3)} />
    </Reflect>
    <Gloss T={T} xs={[540]} />
  </g>
);

/* ===== HOOK 4: RUANG GELAP DENGAN RANTAI ===== */
export const ChainRoom: React.FC<{T?: Tone; t?: number}> = ({T = TONES.chain, t = 0}) => (
  <g>
    <Backdrop T={T} haloY={760} haloOp={0.45} />
    <Reflect floor={HZ} op={0.3} depth={520}>
      {/* dinding beton: panel */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-40 + i * 290} y={200} width={270} height={900} fill={lt(T, 0.05 + (i % 2) * 0.03)} />)}
      {/* rantai menggantung dari plafon */}
      {[140, 300, 800, 950].map((x, i) => (
        <g key={i} transform={`rotate(${Math.sin(t * 0.04 + i) * 2},${x},0)`}>
          {Array.from({length: 10 + (i % 2) * 4}).map((_, k) => (
            <ellipse key={k} cx={x} cy={40 + k * 46} rx={i % 2 ? 9 : 14} ry={24} fill="none" stroke={lt(T, 0.25 + (k % 2) * 0.1)} strokeWidth={7} transform={k % 2 ? `rotate(90,${x},${40 + k * 46})` : undefined} />
          ))}
        </g>
      ))}
      {/* lampu bohlam tunggal */}
      <line x1={540} y1={0} x2={540} y2={300} stroke={dk(T, 0.3)} strokeWidth={4} />
      <circle cx={540} cy={320} r={22} fill={mix(T.glow, '#FFFFFF', 0.4)} /><Halo x={540} y={320} rx={260} color={T.glow} op={0.4} />
    </Reflect>
    <Gloss T={T} xs={[540]} />
  </g>
);

/* ===== ONE SHOT: RUANGAN GELAP KOSONG, LANTAI MENGKILAP ===== */
export const EmptyRoom: React.FC<{T?: Tone}> = ({T = TONES.emptyNavy}) => (
  <g>
    <Backdrop T={T} haloY={780} haloOp={0.5} />
    <Reflect floor={HZ} op={0.25} depth={520}>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-60 + i * 240} y={260} width={4} height={850} fill={lt(T, 0.18)} opacity={0.5} />)}
      <rect x={-400} y={1060} width={W + 800} height={50} fill={dk(T, 0.25)} />
    </Reflect>
    <Gloss T={T} />
  </g>
);

/* ===== FASE 1: PERPUSTAKAAN / RUANG BELAJAR MALAM (lantai kayu mengkilap) ===== */
export const Library: React.FC<{T?: Tone}> = ({T = TONES.libBlue}) => {
  const shelf = (x0: number, w: number, seed: number) => (
    <g>
      <rect x={x0} y={240} width={w} height={870} fill={dk(T, 0.45)} />
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          <rect x={x0} y={400 + r * 160} width={w} height={14} fill={dk(T, 0.2)} />
          {Array.from({length: Math.floor(w / 34)}).map((_, k) => {
            const h = 90 + rand(seed + r * 9 + k) * 50;
            return <rect key={k} x={x0 + 10 + k * 33} y={400 + r * 160 - h} width={26} height={h} rx={3}
              fill={mix(lt(T, 0.1 + rand(seed + k * 3 + r) * 0.35), ['#7A3A3A', '#3A5A7A', '#7A6A3A', '#3A6A5A'][(k + r) % 4], 0.25)} />;
          })}
        </g>
      ))}
    </g>
  );
  return (
    <g>
      <Backdrop T={T} />
      <Reflect floor={HZ} op={0.3} depth={560}>
        {shelf(-80, 360, 3)}
        {shelf(800, 360, 11)}
        {/* jendela lengkung bulan di tengah belakang */}
        <path d="M 400 1000 L 400 520 Q 540 360 680 520 L 680 1000 Z" fill={dk(T, 0.5)} />
        <path d="M 420 990 L 420 530 Q 540 390 660 530 L 660 990 Z" fill={lt(T, 0.42)} opacity={0.5} />
        <rect x={536} y={420} width={8} height={570} fill={dk(T, 0.5)} /><rect x={420} y={700} width={240} height={8} fill={dk(T, 0.5)} />
        {/* meja baca + lampu hijau */}
        <rect x={330} y={1000} width={420} height={22} rx={6} fill={mix(lt(T, 0.12), '#6A4A2E', 0.35)} />
        <path d="M 400 990 L 450 990 L 440 950 L 410 950 Z" fill="#8FE0A8" opacity={0.85} /><Halo x={425} y={980} rx={120} color="#C8FFD8" op={0.3} />
      </Reflect>
      {/* papan lantai kayu */}
      {Array.from({length: 9}).map((_, i) => <line key={i} x1={540 + (i - 4) * 60} y1={HZ} x2={540 + (i - 4) * 340} y2={H} stroke={dk(T, 0.6)} strokeWidth={3} opacity={0.5} />)}
      <Gloss T={T} xs={[540, 425]} />
    </g>
  );
};

/* ===== PMO SAVIOR: PANGGUNG GELAP ala ref_1, lantai reflektif, aksen amber ===== */
export const Stage4: React.FC<{T?: Tone; spot?: number}> = ({T = TONES.stageAmber, spot = 1}) => {
  const id = useSid('sg');
  return (
    <g>
      <Backdrop T={T} haloY={760} haloOp={0.6} />
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T.glow} stopOpacity={0.32 * spot} /><stop offset="1" stopColor={T.glow} stopOpacity={0} /></linearGradient>
      </defs>
      <Reflect floor={HZ} op={0.3} depth={520}>
        {/* tirai samping */}
        {[-1, 1].map((sd) => (
          <path key={sd} d={sd < 0 ? 'M -100 0 L 140 0 Q 100 500 160 1110 L -100 1110 Z' : 'M 1180 0 L 940 0 Q 980 500 920 1110 L 1180 1110 Z'} fill={dk(T, 0.55)} />
        ))}
        {/* kerucut lampu sorot */}
        <path d="M 500 0 L 580 0 L 820 1110 L 260 1110 Z" fill={`url(#${id}c)`} />
      </Reflect>
      <Halo x={540} y={HZ + 40} rx={360} ry={70} color={T.glow} op={0.35 * spot} />
      <Gloss T={T} xs={[540]} />
    </g>
  );
};

/* ===== FASE 2: HUTAN MALAM BERKABUT + genangan air ===== */
export const ForestNight: React.FC<{T?: Tone; t?: number; sky?: number}> = ({T = TONES.forest, t = 0, sky = 0}) => (
  <g>
    <Backdrop T={T} haloY={700} />
    {/* bulan / matahari (sky 0 = bulan, 1 = matahari) */}
    <circle cx={760} cy={360} r={60} fill={mix('#EDF4F0', '#FFC070', sky)} opacity={0.9} /><Halo x={760} y={360} rx={220} color={mix('#BFE6E0', '#FFB23F', sky)} op={0.4} />
    <Reflect floor={HZ} op={0.3} depth={560}>
      {[[-20, 70, 0.6], [150, 46, 0.45], [300, 34, 0.3], [770, 40, 0.35], [900, 60, 0.55], [1040, 80, 0.65], [450, 26, 0.2], [640, 28, 0.22]].map(([x, w, d], i) => (
        <g key={i}>
          <rect x={x - w / 2} y={120} width={w} height={990} fill={dk(T, d)} />
          <path d={`M ${x} 140 L ${x + w * 2.4} ${360 + i * 20}`} stroke={dk(T, d)} strokeWidth={w * 0.25} />
          <ellipse cx={x} cy={200 + (i % 3) * 60} rx={w * 3.2} ry={w * 2.2} fill={dk(T, d + 0.05)} opacity={0.85} />
        </g>
      ))}
      {/* semak */}
      {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={i * 210 - 40} cy={1100} rx={140} ry={60} fill={dk(T, 0.35)} />)}
    </Reflect>
    {/* kabut berlapis bergerak pelan */}
    {[880, 1000, 1120].map((y, i) => (
      <ellipse key={i} cx={540 + Math.sin(t * 0.01 + i * 2) * 120} cy={y} rx={900} ry={70} fill={lt(T, 0.55)} opacity={0.12} />
    ))}
    {/* genangan air memantulkan cahaya */}
    {[[300, 1330, 220], [780, 1440, 260], [520, 1600, 300]].map(([x, y, w], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={w} ry={w * 0.16} fill={mix(T.floor, '#000000', 0.3)} />
        <ellipse cx={x} cy={y} rx={w * 0.9} ry={w * 0.13} fill={lt(T, 0.5)} opacity={0.18 + 0.05 * Math.sin(t * 0.08 + i)} />
        <ellipse cx={x + w * 0.2} cy={y - 4} rx={w * 0.25} ry={6} fill="#FFFFFF" opacity={0.2} />
      </g>
    ))}
    <Gloss T={T} xs={[760]} />
  </g>
);

/* ===== FASE 3: JALAN KOTA MALAM HABIS HUJAN (aspal basah memantulkan lampu & neon toko) ===== */
export const CityWet: React.FC<{T?: Tone; t?: number; lampFlick?: number}> = ({T = TONES.cityPurple, t = 0, lampFlick = 0}) => {
  const fl = lampFlick > 0 ? (Math.floor(t / 3) % 3 === 0 ? 0.15 : 1) : 1;
  const neon = ['#FF4FA8', '#3FE0FF', '#FFB23F', '#FF3B4A'];
  return (
    <g>
      <Backdrop T={T} haloY={720} />
      <Reflect floor={HZ} op={0.38} depth={620}>
        {/* gedung */}
        {[[-60, 260, 300], [220, 200, 420], [420, 240, 340], [640, 220, 460], [860, 280, 380]].map(([x, w, top], i) => (
          <g key={i}>
            <rect x={x} y={top} width={w} height={HZ - top} fill={dk(T, 0.35 + (i % 2) * 0.12)} />
            {Array.from({length: 18}).map((_, k) => {
              const on = rand(i * 31 + k) > 0.55;
              return <rect key={k} x={x + 24 + (k % 3) * (w / 3.4)} y={top + 30 + Math.floor(k / 3) * 70} width={w / 6} height={36} fill={on ? lt(T, 0.75) : dk(T, 0.5)} opacity={on ? 0.55 : 0.6} />;
            })}
          </g>
        ))}
        {/* toko + papan neon (bentuk saja) */}
        {[[60, 0], [330, 1], [620, 2], [860, 3]].map(([x, c], i) => (
          <g key={i}>
            <rect x={x} y={920} width={200} height={190} fill={dk(T, 0.6)} />
            <rect x={x + 20} y={960} width={160} height={150} fill={mix(neon[c], T.mid, 0.6)} opacity={0.5} />
            <rect x={x + 30} y={860} width={140} height={40} rx={20} fill="none" stroke={neon[c]} strokeWidth={7} opacity={0.9 * (i === 2 ? 0.7 + 0.3 * Math.sin(t * 0.3) : 1)} />
            <Halo x={x + 100} y={880} rx={140} ry={70} color={neon[c]} op={0.35} />
          </g>
        ))}
        {/* lampu jalan */}
        {[180, 900].map((x, i) => (
          <g key={i}>
            <rect x={x - 6} y={600} width={12} height={510} fill={dk(T, 0.2)} />
            <path d={`M ${x} 600 Q ${x} 570 ${x + (i ? -60 : 60)} 570`} stroke={dk(T, 0.2)} strokeWidth={10} fill="none" />
            <ellipse cx={x + (i ? -60 : 60)} cy={584} rx={34} ry={12} fill="#FFE8B0" opacity={i === 1 ? fl : 1} />
            <Halo x={x + (i ? -60 : 60)} y={620} rx={160} ry={200} color="#FFD28A" op={0.35 * (i === 1 ? fl : 1)} />
          </g>
        ))}
      </Reflect>
      {/* aspal basah: garis jalan + coretan pantulan warna */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={480 - i * 40} y={1200 + i * 170} width={120 + i * 80} height={16 + i * 6} fill="#E8E4D8" opacity={0.25} transform={`skewX(${-10 + i * 6})`} />)}
      <Gloss T={T} xs={[240, 840, 160, 430, 720]} c={T.glow} />
      {[[160, '#FF4FA8'], [430, '#3FE0FF'], [720, '#FFB23F']].map(([x, c], i) => (
        <rect key={i} x={(x as number) - 30} y={HZ + 20} width={60} height={500} fill={c as string} opacity={0.08 + 0.03 * Math.sin(t * 0.2 + i)} />
      ))}
    </g>
  );
};

/* ===== HANCURNYA MASA DEPAN (a): RUANG KANTOR / MEETING KOSONG ===== */
export const OfficeMeeting: React.FC<{T?: Tone; screen?: number}> = ({T = TONES.officeGray, screen = 1}) => (
  <g>
    <Backdrop T={T} haloY={760} />
    <Reflect floor={HZ} op={0.3} depth={560}>
      {/* dinding kaca: kota malam samar */}
      <rect x={-60} y={260} width={1200} height={850} fill={dk(T, 0.55)} />
      {[[-40, 520], [120, 420], [260, 560], [760, 460], [900, 380], [1020, 540]].map(([x, top], i) => (
        <g key={i}>
          <rect x={x} y={top} width={130} height={1110 - top} fill={dk(T, 0.35)} />
          {Array.from({length: 8}).map((_, k) => <rect key={k} x={x + 18 + (k % 2) * 54} y={top + 30 + Math.floor(k / 2) * 80} width={36} height={30} fill={lt(T, 0.6)} opacity={rand(i * 9 + k) > 0.5 ? 0.45 : 0.12} />)}
        </g>
      ))}
      {[200, 540, 880].map((x) => <rect key={x} x={x - 4} y={260} width={8} height={850} fill={dk(T, 0.3)} />)}
      {/* layar presentasi di tengah */}
      <rect x={340} y={400} width={400} height={260} rx={10} fill={dk(T, 0.7)} />
      <rect x={354} y={414} width={372} height={232} fill={lt(T, 0.5)} opacity={0.35 * screen} />
      <Halo x={540} y={530} rx={300} ry={200} color={T.glow} op={0.22 * screen} />
      {/* meja rapat panjang + kursi */}
      {[-1, 1].map((sd) => [0, 1, 2].map((k) => (
        <rect key={`${sd}${k}`} x={540 + sd * (190 + k * 120) - 40} y={900} width={80} height={130} rx={16} fill={dk(T, 0.35)} />
      )))}
      <path d="M 200 1010 L 880 1010 L 1000 1110 L 80 1110 Z" fill={lt(T, 0.15)} />
    </Reflect>
    <Gloss T={T} xs={[540]} />
  </g>
);

/* ===== HANCURNYA MASA DEPAN (b): JALAN PANJANG KE CAKRAWALA SENJA ===== */
export const HorizonRoad: React.FC<{T?: Tone; sun?: number}> = ({T = TONES.duskRed, sun = 1}) => {
  const id = useSid('hr');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.top} /><stop offset="0.45" stopColor={T.mid} /><stop offset={HZ / H} stopColor={mix(T.glow, T.mid, 0.4)} />
          <stop offset={HZ / H + 0.001} stopColor={T.floor} /><stop offset="1" stopColor="#020203" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={`url(#${id}s)`} />
      <circle cx={540} cy={HZ - 10} r={90} fill={mix(T.glow, '#FFE0B0', 0.4)} opacity={0.85 * sun} />
      <Halo x={540} y={HZ - 40} rx={700} ry={320} color={T.glow} op={0.45 * sun} />
      {/* bukit jauh */}
      <path d={`M -400 ${HZ} Q 0 ${HZ - 90} 300 ${HZ - 30} Q 600 ${HZ - 110} 900 ${HZ - 40} Q 1200 ${HZ - 80} 1480 ${HZ} Z`} fill={dk(T, 0.45)} />
      {/* jalan perspektif + marka */}
      <path d={`M 520 ${HZ} L 560 ${HZ} L 1180 ${H} L -100 ${H} Z`} fill={mix(T.floor, '#1A1A1E', 0.4)} />
      {Array.from({length: 7}).map((_, i) => {
        const k = i / 7, y = HZ + Math.pow(k, 2) * 800, w = 4 + k * 24, h = 10 + k * 70;
        return <rect key={i} x={540 - w / 2} y={y} width={w} height={h} fill="#E8E0D0" opacity={0.5} />;
      })}
      {/* tiang listrik */}
      {[0, 1, 2, 3].map((i) => {
        const k = (i + 1) / 5, x = 540 - 80 - k * k * 700, hh = 40 + k * k * 600;
        return <rect key={i} x={x} y={HZ + k * k * 400 - hh} width={4 + k * 10} height={hh} fill={dk(T, 0.6)} />;
      })}
      <Gloss T={T} xs={[540]} c={mix(T.glow, '#FFD0A0', 0.3)} />
    </g>
  );
};
