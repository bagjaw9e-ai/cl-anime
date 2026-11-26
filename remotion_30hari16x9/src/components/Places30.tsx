// Tempat video "30 hari" 16:9 — semua BARU. Tempat nyata tapi SAMAR: digambar sederhana (nanti diblur kuat + diredupkan di
// ShotDef), lantai mengkilap/basah dengan pantulan (Reflect terhadap horizon). Semua warna diturunkan dari `tone` supaya
// cameraTrack bisa menggeser tone tiap zoom (tempat tetap sama). Kanvas dunia 1920x1080 (digambar melebar -400..2320).
import React from 'react';
import {mix, rand} from '../theme';
import {Halo, Reflect} from './Lit';
import {useSid} from './Phone';

export const W = 1920, H = 1080;
export const HZ = 730;     // horizon dinding/lantai
export const FEET = 800;   // kaki karakter
export type Tone = {top: string; mid: string; floor: string; glow: string};
export const mixTone = (a: Tone, b: Tone, k: number): Tone => ({
  top: mix(a.top, b.top, k), mid: mix(a.mid, b.mid, k), floor: mix(a.floor, b.floor, k), glow: mix(a.glow, b.glow, k),
});
const dk = (T: Tone, d: number) => mix(T.mid, '#020306', d);
const lt = (T: Tone, l: number) => mix(T.mid, T.glow, l);

export const TONES = {
  mri: {top: '#081820', mid: '#123844', floor: '#06121A', glow: '#7FE8F0'},
  darkRoom: {top: '#0C0A16', mid: '#1E1830', floor: '#08060E', glow: '#9A8AD8'},
  kitchen: {top: '#14100A', mid: '#33281A', floor: '#0E0A06', glow: '#FFC27A'},
  aptPurple: {top: '#150A1E', mid: '#33163E', floor: '#0E0614', glow: '#E05AA8'},
  aptRed: {top: '#1C080E', mid: '#461420', floor: '#14060A', glow: '#FF4A5A'},
  aptViolet: {top: '#0E0820', mid: '#261446', floor: '#090616', glow: '#A06AFF'},
  gymBlue: {top: '#06101E', mid: '#0E2640', floor: '#050C16', glow: '#4FA8FF'},
  gymCyan: {top: '#041418', mid: '#0A3440', floor: '#04100E', glow: '#3FF0F0'},
  gymDeep: {top: '#060A1C', mid: '#141E46', floor: '#04081A', glow: '#6A8AFF'},
  stationGray: {top: '#10141A', mid: '#283440', floor: '#0C1014', glow: '#B8C8D8'},
  stationBlue: {top: '#0A121E', mid: '#1C3048', floor: '#080E16', glow: '#8FB8E8'},
  stationCold: {top: '#0C1216', mid: '#22303A', floor: '#090D10', glow: '#A0B4C0'},
  parkGreen: {top: '#16200E', mid: '#34482A', floor: '#0E140A', glow: '#B8E07A'},
  parkGold: {top: '#2A1C08', mid: '#5A4420', floor: '#181006', glow: '#FFD26A'},
  parkWarm: {top: '#22180A', mid: '#4A3A1C', floor: '#140E06', glow: '#FFE7A0'},
  trackMorning: {top: '#1A1A22', mid: '#3A3A4A', floor: '#121216', glow: '#FFD6A0'},
  trackBright: {top: '#22202A', mid: '#4A4458', floor: '#16141A', glow: '#FFE8C0'},
  dawnBlue: {top: '#0E1426', mid: '#26365A', floor: '#0A0E1A', glow: '#A8C8FF'},
  dawnSoft: {top: '#141A2E', mid: '#34466E', floor: '#0E1222', glow: '#C8D8FF'},
  stageAmber: {top: '#17110A', mid: '#30220E', floor: '#110C06', glow: '#FFB23F'},
  stageWarm: {top: '#22160A', mid: '#4A3214', floor: '#180F06', glow: '#FFCE7A'},
  stageDim: {top: '#0C0906', mid: '#1C140A', floor: '#080604', glow: '#C88A3A'},
} satisfies Record<string, Tone>;

export const Dim: React.FC<{dim: number; color?: string}> = ({dim, color = '#05060C'}) => (
  <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={color} opacity={dim} />
);
const Backdrop: React.FC<{T: Tone; haloX?: number; haloY?: number; op?: number}> = ({T, haloX = 960, haloY = 470, op = 0.55}) => {
  const id = useSid('bk');
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={T.top} /><stop offset={HZ / H} stopColor={T.mid} />
        <stop offset={HZ / H + 0.001} stopColor={T.floor} /><stop offset="1" stopColor="#020304" />
      </linearGradient></defs>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={`url(#${id})`} />
      <Halo x={haloX} y={haloY} rx={1000} ry={520} color={lt(T, 0.35)} op={op} />
    </g>
  );
};
const Gloss: React.FC<{T: Tone; xs?: number[]; c?: string}> = ({T, xs = [], c}) => (
  <g>
    <rect x={-400} y={HZ} width={W + 800} height={2} fill={T.glow} opacity={0.2} />
    {xs.map((x, i) => (
      <g key={i}><Halo x={x} y={HZ + 110} rx={50} ry={150} color={c ?? T.glow} op={0.3} /><rect x={x - 3} y={HZ + 4} width={6} height={220} fill={c ?? T.glow} opacity={0.14} /></g>
    ))}
  </g>
);

/* HOOK 1: RUANG MRI — mesin donat besar, meja geser, panel dinding */
export const MriRoom: React.FC<{T?: Tone}> = ({T = TONES.mri}) => (
  <g>
    <Backdrop T={T} haloX={1100} />
    <Reflect floor={HZ} op={0.3} depth={360}>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-200 + i * 400} y={80} width={380} height={650} fill={lt(T, 0.06 + (i % 2) * 0.04)} />)}
      <circle cx={1200} cy={440} r={300} fill={lt(T, 0.42)} />
      <circle cx={1200} cy={440} r={150} fill={dk(T, 0.55)} />
      <circle cx={1200} cy={440} r={150} fill="none" stroke={T.glow} strokeWidth={6} opacity={0.5} />
      <rect x={900} y={740 - 100} width={600} height={30} rx={12} fill={lt(T, 0.6)} />
      <rect x={1080} y={670} width={60} height={60} fill={dk(T, 0.3)} />
      <rect x={180} y={300} width={360} height={240} rx={16} fill={dk(T, 0.5)} />
    </Reflect>
    <Gloss T={T} xs={[1200, 360]} />
  </g>
);

/* HOOK 2: KAMAR GELAP — ranjang, meja berlaci, jendela malam */
export const DarkBedroom: React.FC<{T?: Tone}> = ({T = TONES.darkRoom}) => (
  <g>
    <Backdrop T={T} />
    <Reflect floor={HZ} op={0.3} depth={360}>
      <rect x={1240} y={160} width={340} height={360} rx={8} fill={dk(T, 0.5)} />
      <rect x={1256} y={176} width={308} height={328} fill={mix(T.top, '#0A0A24', 0.4)} />
      <circle cx={1480} cy={260} r={40} fill="#E8E4F4" opacity={0.75} /><Halo x={1480} y={260} rx={150} color="#C8C4F4" op={0.3} />
      <rect x={-100} y={520} width={700} height={210} rx={24} fill={lt(T, 0.15)} />
      <rect x={-100} y={460} width={160} height={270} rx={14} fill={dk(T, 0.35)} />
      <rect x={760} y={500} width={420} height={230} rx={10} fill={lt(T, 0.12)} />
    </Reflect>
    <Gloss T={T} xs={[1410]} />
  </g>
);

/* HOOK 3: DAPUR MALAM — kabinet atas, kulkas, lampu gantung, jendela */
export const NightKitchen: React.FC<{T?: Tone}> = ({T = TONES.kitchen}) => (
  <g>
    <Backdrop T={T} haloX={900} />
    <Reflect floor={HZ} op={0.3} depth={360}>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={200 + i * 300} y={140} width={280} height={180} rx={8} fill={lt(T, 0.12)} />)}
      <rect x={-80} y={200} width={260} height={530} rx={14} fill={lt(T, 0.22)} /><rect x={150} y={330} width={10} height={90} rx={4} fill={dk(T, 0.4)} />
      <rect x={200} y={520} width={1700} height={30} fill={lt(T, 0.3)} /><rect x={200} y={550} width={1700} height={180} fill={dk(T, 0.3)} />
      <line x1={960} y1={0} x2={960} y2={300} stroke={dk(T, 0.3)} strokeWidth={4} />
      <path d="M 900 300 L 1020 300 L 990 260 L 930 260 Z" fill={T.glow} opacity={0.8} /><Halo x={960} y={320} rx={260} color={T.glow} op={0.35} />
      <rect x={1500} y={300} width={260} height={200} rx={6} fill={mix(T.top, '#08101C', 0.5)} />
    </Reflect>
    <Gloss T={T} xs={[960]} />
  </g>
);

/* HARI 1-3: APARTEMEN STUDIO MALAM — jendela besar lampu kota, lantai keramik mengkilap */
export const StudioApartment: React.FC<{T?: Tone; t?: number; windowsOff?: number; curtain?: number}> = ({T = TONES.aptPurple, t = 0, windowsOff = 0, curtain = 0}) => (
  <g>
    <Backdrop T={T} haloX={1300} />
    <Reflect floor={HZ} op={0.32} depth={360}>
      {/* jendela besar + gedung kota */}
      <rect x={900} y={90} width={900} height={560} rx={6} fill={dk(T, 0.6)} />
      <rect x={920} y={110} width={860} height={520} fill={mix(T.top, '#060814', 0.3)} />
      {[[930, 220, 160], [1100, 300, 140], [1250, 180, 180], [1440, 260, 150], [1600, 200, 170]].map(([x, top, w], i) => (
        <g key={i}>
          <rect x={x} y={top} width={w} height={630 - top} fill={dk(T, 0.4)} />
          {Array.from({length: 12}).map((_, k) => {
            const idx = i * 12 + k, off = rand(idx * 3.7) < windowsOff;
            return <rect key={k} x={x + 16 + (k % 3) * (w / 3.3)} y={top + 24 + Math.floor(k / 3) * 70} width={w / 5} height={30}
              fill={off ? dk(T, 0.6) : mix('#FFD48A', T.glow, 0.4)} opacity={off ? 0.5 : 0.75} />;
          })}
        </g>
      ))}
      <rect x={1345} y={110} width={10} height={520} fill={dk(T, 0.6)} />
      {/* tirai (curtain 0 terbuka .. 1 tertutup) */}
      <rect x={900} y={80} width={60 + curtain * 840} height={580} fill={lt(T, 0.24)} opacity={0.95} />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={910 + i * (curtain * 105 + 6)} y={80} width={6} height={580} fill={dk(T, 0.2)} opacity={0.5} />)}
      {/* meja + lampu + kasur + tembok kiri */}
      <rect x={-200} y={60} width={600} height={670} fill={lt(T, 0.08)} />
      <rect x={420} y={520} width={380} height={24} rx={6} fill={lt(T, 0.25)} /><rect x={440} y={544} width={20} height={186} fill={dk(T, 0.3)} />
      <rect x={760} y={544} width={20} height={186} fill={dk(T, 0.3)} />
      <rect x={-200} y={600} width={540} height={130} rx={20} fill={lt(T, 0.18)} />
    </Reflect>
    {/* lantai keramik */}
    {Array.from({length: 14}).map((_, i) => <line key={i} x1={960 + (i - 7) * 90} y1={HZ} x2={960 + (i - 7) * 420} y2={H + 300} stroke={dk(T, 0.6)} strokeWidth={2} opacity={0.5} />)}
    {[790, 860, 960].map((y, i) => <line key={i} x1={-400} y1={y} x2={2320} y2={y} stroke={dk(T, 0.6)} strokeWidth={2} opacity={0.4} />)}
    <Gloss T={T} xs={[1180, 1500, 610]} />
  </g>
);

/* HARI KE-7: GYM MALAM SEPI — cermin besar, rak dumbel, lantai karet mengkilap, papan skor */
export const NightGym: React.FC<{T?: Tone}> = ({T = TONES.gymBlue}) => (
  <g>
    <Backdrop T={T} />
    <Reflect floor={HZ} op={0.35} depth={360}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}><rect x={-60 + i * 520} y={120} width={500} height={610} fill={lt(T, 0.3)} opacity={0.35} />
          <path d={`M ${-20 + i * 520} 140 L ${120 + i * 520} 140 L ${-20 + i * 520} 400 Z`} fill="#FFFFFF" opacity={0.05} /></g>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 260} y={80} width={8} height={650} fill={dk(T, 0.5)} />)}
      <rect x={1340} y={520} width={420} height={18} rx={6} fill={lt(T, 0.25)} />
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={1356 + i * 58} y={480} width={40} height={40} rx={10} fill={dk(T, 0.2)} />)}
      <rect x={1352} y={538} width={12} height={192} fill={dk(T, 0.3)} /><rect x={1736} y={538} width={12} height={192} fill={dk(T, 0.3)} />
      <rect x={200} y={600} width={520} height={30} rx={14} fill={lt(T, 0.2)} />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={260 + i * 300} cy={40} rx={110} ry={14} fill={T.glow} opacity={0.45} />)}
    </Reflect>
    {[0, 1, 2].map((i) => <rect key={i} x={-400} y={HZ + 80 + i * 110} width={W + 800} height={2} fill={dk(T, 0.6)} opacity={0.4} />)}
    <Gloss T={T} xs={[260, 860, 1460]} />
  </g>
);

/* HARI KE-14: PERON STASIUN SEPI WAKTU HUJAN — atap & tiang, rel, lampu, lantai basah, hujan */
export const RainStation: React.FC<{T?: Tone; t?: number}> = ({T = TONES.stationGray, t = 0}) => (
  <g>
    <Backdrop T={T} haloY={420} />
    <Reflect floor={HZ} op={0.4} depth={380}>
      <rect x={-400} y={40} width={W + 800} height={60} fill={dk(T, 0.5)} />
      {[100, 600, 1100, 1600].map((x) => <rect key={x} x={x} y={100} width={36} height={630} fill={dk(T, 0.35)} />)}
      {[350, 850, 1350, 1850].map((x) => (
        <g key={x}><rect x={x - 3} y={100} width={6} height={60} fill={dk(T, 0.4)} /><rect x={x - 50} y={160} width={100} height={14} rx={6} fill="#F4F0E0" opacity={0.85} />
          <Halo x={x} y={200} rx={180} ry={130} color="#E8E0C8" op={0.3} /></g>
      ))}
      {/* rel lurus ke kejauhan (sisi kanan peron) */}
      <rect x={-400} y={560} width={W + 800} height={170} fill={dk(T, 0.55)} />
      {[600, 660].map((y) => <rect key={y} x={-400} y={y} width={W + 800} height={8} fill={lt(T, 0.5)} opacity={0.7} />)}
      <rect x={-400} y={540} width={W + 800} height={20} fill={lt(T, 0.3)} />
      <rect x={180} y={380} width={300} height={110} rx={8} fill={dk(T, 0.6)} />
    </Reflect>
    {/* hujan */}
    {Array.from({length: 90}).map((_, i) => {
      const x = (rand(i * 1.7) * 2400 - 240 + t * 2) % 2400 - 240, y = ((rand(i * 3.1) * 1300 + t * 38) % 1300) - 200;
      return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 46} stroke={lt(T, 0.7)} strokeWidth={2} opacity={0.35} />;
    })}
    {/* genangan + riak */}
    {[[500, 880, 260], [1400, 960, 320]].map(([x, y, w], i) => (
      <g key={i}><ellipse cx={x} cy={y} rx={w} ry={w * 0.12} fill={lt(T, 0.4)} opacity={0.18} />
        <ellipse cx={x + Math.sin(t * 0.2 + i) * 30} cy={y} rx={40 + ((t * 2 + i * 30) % 60)} ry={(40 + ((t * 2 + i * 30) % 60)) * 0.15} fill="none" stroke={lt(T, 0.7)} strokeWidth={2} opacity={0.3} /></g>
    ))}
    <Gloss T={T} xs={[350, 850, 1350, 1850]} />
  </g>
);

/* HARI 21-30: TAMAN KOTA PAGI + GENANGAN — pepohonan, tiang lampu, bangku, matahari terbit */
export const MorningPark: React.FC<{T?: Tone; t?: number; sun?: number}> = ({T = TONES.parkGreen, t = 0, sun = 1}) => (
  <g>
    <Backdrop T={T} haloX={1300} haloY={500} op={0.6} />
    <circle cx={1300} cy={600 - sun * 120} r={90} fill="#FFE6A0" opacity={0.85 * sun} /><Halo x={1300} y={560 - sun * 100} rx={600} ry={360} color="#FFD06A" op={0.45 * sun} />
    <Reflect floor={HZ} op={0.4} depth={380}>
      {[[60, 110], [380, 80], [700, 120], [1640, 100], [1900, 130]].map(([x, r], i) => (
        <g key={i}><rect x={x - 14} y={380} width={28} height={350} fill={dk(T, 0.4)} />
          <circle cx={x + Math.sin(t * 0.03 + i) * 6} cy={330} r={r} fill={dk(T, 0.25 - i * 0.02)} /><circle cx={x - r * 0.5} cy={390} r={r * 0.7} fill={dk(T, 0.3)} /></g>
      ))}
      {[1000, 1520].map((x) => <g key={x}><rect x={x - 5} y={420} width={10} height={310} fill={dk(T, 0.4)} /><circle cx={x} cy={414} r={16} fill="#FFF0C8" opacity={0.6} /></g>)}
      <rect x={1100} y={640} width={260} height={18} rx={6} fill={dk(T, 0.2)} /><rect x={1110} y={658} width={10} height={72} fill={dk(T, 0.4)} /><rect x={1340} y={658} width={10} height={72} fill={dk(T, 0.4)} />
    </Reflect>
    {[[600, 860, 300], [1400, 940, 380]].map(([x, y, w], i) => (
      <g key={i}><ellipse cx={x} cy={y} rx={w} ry={w * 0.14} fill="#FFE6A0" opacity={0.16 + 0.04 * Math.sin(t * 0.08 + i)} />
        <ellipse cx={x + 40} cy={y - 2} rx={w * 0.3} ry={6} fill="#FFFFFF" opacity={0.25} /></g>
    ))}
    <Gloss T={T} xs={[1300]} c="#FFD06A" />
  </g>
);

/* BUTUH 66 HARI (a): LINTASAN LARI STADION PAGI — lajur basah mengkilap, tribun, menara lampu */
export const StadiumTrack: React.FC<{T?: Tone; scroll?: number}> = ({T = TONES.trackMorning, scroll = 0}) => (
  <g>
    <Backdrop T={T} haloY={380} op={0.6} />
    <Reflect floor={HZ} op={0.4} depth={380}>
      <path d={`M -400 330 L ${W + 400} 330 L ${W + 400} 600 L -400 600 Z`} fill={dk(T, 0.4)} />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x={-400} y={360 + i * 40} width={W + 800} height={6} fill={lt(T, 0.15)} opacity={0.6} />)}
      {[200, 1720].map((x) => <g key={x}><rect x={x - 8} y={60} width={16} height={540} fill={dk(T, 0.3)} /><rect x={x - 70} y={40} width={140} height={60} rx={6} fill="#FFF4D8" opacity={0.75} />
        <Halo x={x} y={80} rx={220} ry={140} color="#FFF0C8" op={0.35} /></g>)}
      <rect x={-400} y={600} width={W + 800} height={130} fill={mix(T.mid, '#8A3A2A', 0.4)} />
    </Reflect>
    {/* lajur lintasan (merah bata basah) dengan garis putih, bisa digeser (scroll) */}
    <rect x={-400} y={HZ} width={W + 800} height={H - HZ + 300} fill={mix(T.floor, '#5A2218', 0.45)} />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={-400} y={HZ + 30 + i * (40 + i * 14)} width={W + 800} height={4 + i} fill="#F2EEE6" opacity={0.5} />)}
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={((i * 300 - scroll) % 3000 + 3000) % 3000 - 500} y={HZ + 8} width={4} height={330} fill="#F2EEE6" opacity={0.15} />)}
    <Gloss T={T} xs={[200, 1720]} c="#FFF0C8" />
  </g>
);

/* BUTUH 66 HARI (b): KAMAR TIDUR WAKTU SUBUH — biru lembut, jendela subuh, ranjang */
export const DawnBedroom: React.FC<{T?: Tone}> = ({T = TONES.dawnBlue}) => (
  <g>
    <Backdrop T={T} haloX={1300} />
    <Reflect floor={HZ} op={0.28} depth={360}>
      <rect x={1100} y={140} width={480} height={420} rx={8} fill={dk(T, 0.5)} />
      <rect x={1116} y={156} width={448} height={388} fill={mix(T.glow, '#FFD8B8', 0.25)} opacity={0.6} />
      <rect x={1335} y={156} width={10} height={388} fill={dk(T, 0.5)} /><rect x={1116} y={345} width={448} height={10} fill={dk(T, 0.5)} />
      <Halo x={1340} y={350} rx={420} ry={300} color={T.glow} op={0.35} />
      <rect x={200} y={520} width={140} height={210} rx={10} fill={dk(T, 0.3)} />
      <rect x={-200} y={160} width={300} height={570} fill={lt(T, 0.1)} />
    </Reflect>
    <Gloss T={T} xs={[1340]} />
  </g>
);

/* NEUROPLASTICITY: PANGGUNG GELAP (ala ref_1) — lantai reflektif, sorot lampu, aksen amber */
export const AmberStage: React.FC<{T?: Tone; spot?: number}> = ({T = TONES.stageAmber, spot = 1}) => {
  const id = useSid('as');
  return (
    <g>
      <Backdrop T={T} haloY={440} op={0.6} />
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T.glow} stopOpacity={0.3 * spot} /><stop offset="1" stopColor={T.glow} stopOpacity={0} /></linearGradient></defs>
      <Reflect floor={HZ} op={0.32} depth={360}>
        <path d={`M 900 -40 L 1020 -40 L 1360 ${HZ} L 560 ${HZ} Z`} fill={`url(#${id})`} />
        {[-1, 1].map((sd) => <rect key={sd} x={sd < 0 ? -400 : 1720} y={-40} width={600} height={HZ + 40} fill={dk(T, 0.6)} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={360 + i * 240} cy={-10} r={14} fill={T.glow} opacity={0.4 * spot} />)}
      </Reflect>
      <Halo x={960} y={HZ + 30} rx={520} ry={70} color={T.glow} op={0.35 * spot} />
      <Gloss T={T} xs={[960]} />
    </g>
  );
};
