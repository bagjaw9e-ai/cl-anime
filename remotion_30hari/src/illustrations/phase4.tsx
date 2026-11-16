import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {PhoneBody} from '../components/Phone';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {WallCalendar} from '../components/Calendar';
import {FONT, IP, Padlock, Pill, Spark, backOut, ramp, smooth} from './common';

// #32 kalender minggu 3-4
export const Calendar34: React.FC<IP> = ({t}) => <WallCalendar circled={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]} circleP={ramp(t, 2, 26)} circleColor="#FFB547" header="MINGGU 3–4" />;

// #33 asap merah berbentuk tangan menarik ke arah HP
export const SmokeHand: React.FC<IP> = ({t}) => {
  const reach = 0.6 + 0.4 * Math.sin(t * 0.15);
  return (
    <g>
      <defs><filter id="smk"><feGaussianBlur stdDeviation={8} /></filter></defs>
      <g transform="translate(150,40) rotate(10)"><PhoneBody w={110} h={200} glow={0.8} /></g>
      <g filter="url(#smk)" opacity={0.75}>
        <path d={`M -220 120 C -160 60 -120 ${20 - reach * 20} ${-40 + reach * 60} ${-10}`} stroke="#E0263A" strokeWidth={46} fill="none" strokeLinecap="round" />
        {[-30, -10, 10, 30].map((dy, i) => (
          <path key={i} d={`M ${-40 + reach * 60} -10 q 30 ${dy * 0.6} ${50 + reach * 20} ${dy}`} stroke="#FF4D5A" strokeWidth={18} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

// #34 otak memilih: dua pintu (gelap vs terang), otak angkat barbel kecil
export const BrainDoors: React.FC<IP> = ({t}) => {
  const open = smooth(ramp(t, 14, 30));
  return (
    <g>
      <g transform="translate(-130,0)">
        <rect x={-80} y={-140} width={160} height={280} rx={14} fill="#3A2030" />
        <rect x={-66} y={-126} width={132} height={252} rx={10} fill="#5A2030" />
        <circle cx={44} cy={10} r={8} fill="#8E1B2C" />
      </g>
      <g transform="translate(130,0)">
        <rect x={-80} y={-140} width={160} height={280} rx={14} fill="#F5E6DA" />
        <rect x={-66} y={-126} width={132} height={252} rx={10} fill="#FFF3C4" />
        <rect x={-66} y={-126} width={132 * (1 - open * 0.7)} height={252} rx={10} fill="#FFB547" />
        {open > 0.3 && [0, 1, 2].map((i) => <path key={i} d={`M 0 0 L ${-30 + i * 30} -200`} stroke="#FFF3C4" strokeWidth={10} opacity={0.4 * open} />)}
      </g>
      <g transform={`translate(${-10 + open * 80},${150 - Math.abs(Math.sin(t * 0.3)) * 10})`}>
        <Brain s={0.28} pfc={0.4 + open * 0.6} mid={0.3} />
        <g transform={`translate(0,${-60 + Math.sin(t * 0.3) * 8})`}>
          <rect x={-44} y={-4} width={88} height={8} rx={4} fill="#3A3238" />
          <rect x={-52} y={-14} width={12} height={28} rx={4} fill="#2A2228" /><rect x={40} y={-14} width={12} height={28} rx={4} fill="#2A2228" />
        </g>
      </g>
    </g>
  );
};

// #35 jam dengan bonus waktu
export const ClockBonus: React.FC<IP> = ({t}) => (
  <g>
    <circle r={110} fill="#F5E6DA" /><circle r={96} fill="#FFFFFF" />
    <path d={`M 0 0 L 0 -96 A 96 96 0 ${t > 20 ? 1 : 0} 1 ${Math.sin(Math.min(1, t / 30) * Math.PI * 1.4) * 96} ${-Math.cos(Math.min(1, t / 30) * Math.PI * 1.4) * 96} Z`} fill="#8FD36A" opacity={0.7} />
    <rect x={-4} y={-80} width={8} height={84} rx={4} fill="#2A1838" transform={`rotate(${t * 6})`} />
    <circle r={10} fill="#2A1838" />
    <g transform={`translate(110,-90) scale(${backOut(ramp(t, 6, 16))})`}><Pill text="+ WAKTU" bg="#3CC27A" size={28} /></g>
  </g>
);

// #35 ikon kegiatan baru (gitar, buku, barbel)
export const ActivityIcon: React.FC<IP & {k: 'guitar' | 'book' | 'dumbbell'}> = ({k}) => (
  <g>
    <circle r={78} fill="#FFF3C4" />
    {k === 'guitar' && <g transform="rotate(-30) scale(0.55)"><rect x={-10} y={-180} width={20} height={150} rx={6} fill="#6E4A2E" /><path d="M 0 -40 C -60 -40 -66 10 -42 34 C -72 66 -50 120 0 120 C 50 120 72 66 42 34 C 66 10 60 -40 0 -40 Z" fill={C.amber} /><circle cx={0} cy={40} r={18} fill="#3A2416" /></g>}
    {k === 'book' && <g><path d="M 0 -40 C -26 -50 -50 -48 -60 -40 L -60 40 C -50 32 -26 32 0 42 Z" fill={C.teal} /><path d="M 0 -40 C 26 -50 50 -48 60 -40 L 60 40 C 50 32 26 32 0 42 Z" fill="#3F8C85" /></g>}
    {k === 'dumbbell' && <g><rect x={-46} y={-6} width={92} height={12} rx={6} fill="#5A5258" />{[-46, 46].map((x) => <rect key={x} x={x - 12} y={-26} width={24} height={52} rx={8} fill="#2A2228" />)}</g>}
  </g>
);

// #36 progress bar fokus memanjang
export const FocusBar: React.FC<IP> = ({t}) => {
  const p = smooth(ramp(t, 4, 50));
  return (
    <g>
      <Pill x={-170} y={-60} text="FOKUS" bg="#FFB547" fg="#2A1838" size={26} />
      <rect x={-230} y={-26} width={460} height={52} rx={26} fill="#3A2A30" opacity={0.85} />
      <rect x={-222} y={-18} width={444 * (0.15 + 0.85 * p)} height={36} rx={18} fill="#FFD166" />
      <Spark x={-222 + 444 * (0.15 + 0.85 * p)} y={0} s={0.7} c="#FFFFFF" />
    </g>
  );
};

// #37 tali boneka dari palang di atas ke tangan/badan, digunting satu-satu (cut = jumlah tali putus)
export const PuppetStrings: React.FC<IP & {cut?: number; targets?: Array<[number, number]>}> = ({t, cut = 0, targets = [[-120, 300], [0, 200], [120, 300]]}) => (
  <g>
    <g transform={`rotate(${Math.sin(t * 0.08) * 4})`}>
      <rect x={-170} y={-14} width={340} height={28} rx={14} fill="#8E1B2C" />
      <rect x={-14} y={-90} width={28} height={130} rx={14} fill="#8E1B2C" />
    </g>
    {targets.map(([x, y], i) => {
      const k = Math.max(0, Math.min(1, cut - i));
      return (
        <g key={i}>
          <line x1={(i - 1) * 150} y1={10} x2={(i - 1) * 150 + (x - (i - 1) * 150) * (1 - k * 0.5)} y2={10 + (y - 10) * (1 - k * 0.55)} stroke="#F5E6DA" strokeWidth={4} />
          {k > 0 && <line x1={x} y1={y} x2={x + 10 * k} y2={y - (y - 10) * 0.45 * (1 - k * 0.6) + k * 80} stroke="#F5E6DA" strokeWidth={4} opacity={1 - k} />}
        </g>
      );
    })}
  </g>
);

// #38 maskot otak tengah jadi tenang/jinak
export const MascotCalm: React.FC<IP> = ({t}) => (
  <g>
    <MidbrainMascot s={0.9} mood="happy" />
    {[0, 1].map((i) => {
      const ph = (t * 0.03 + i * 0.5) % 1;
      return <path key={i} d="M 0 8 C -12 -2 -10 -12 -4 -12 C -1 -12 0 -10 0 -8 C 0 -10 1 -12 4 -12 C 10 -12 12 -2 0 8 Z" fill="#FF8AA6" opacity={1 - ph} transform={`translate(${70 + i * 20},${-90 - ph * 70}) scale(2)`} />;
    })}
  </g>
);

// #39 TEASER DIBUKA: gembok lepas, PFC menyala emas terang
export const BrainUnlock: React.FC<IP> = ({t}) => {
  const open = smooth(ramp(t, 4, 18));
  return (
    <g>
      <defs><filter id="bub"><feGaussianBlur stdDeviation={30} /></filter></defs>
      <circle r={200} fill="#FFD166" opacity={0.25 + 0.35 * open} filter="url(#bub)" />
      {open > 0.4 && Array.from({length: 10}).map((_, i) => (
        <path key={i} d="M 0 0 L -12 -260 L 12 -260 Z" fill="#FFF3C4" opacity={0.18 * open} transform={`rotate(${i * 36 + t})`} />
      ))}
      <Brain s={0.66} pfc={0.4 + 0.6 * open} mid={0.2} />
      <g transform={`translate(${open * 120},${-40 + open * 220}) rotate(${open * 50})`} opacity={1 - open}><Padlock open={open} s={1.1} /></g>
      {open > 0.6 && [[-180, -100], [170, -120], [150, 110]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.8} c="#FFFFFF" />)}
    </g>
  );
};
export {FONT};
