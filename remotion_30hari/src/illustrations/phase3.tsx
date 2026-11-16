import React from 'react';
import {C, mix} from '../theme';
import {Brain} from '../components/Brain';
import {PhoneBody} from '../components/Phone';
import {WallCalendar} from '../components/Calendar';
import {CrossX, FONT, IP, Pill, ramp, smooth} from './common';

// #22 kalender minggu 2 ditandai
export const Calendar14: React.FC<IP> = ({t}) => <WallCalendar circled={[8, 9, 10, 11, 12, 13, 14]} circleP={ramp(t, 2, 24)} circleColor="#7E8CC8" header="MINGGU 2" />;

// #23 baterai tinggal 1 bar (di atas kepala)
export const BatteryLow: React.FC<IP> = ({t}) => (
  <g>
    <rect x={-110} y={-56} width={200} height={112} rx={20} fill="none" stroke="#F5E6DA" strokeWidth={12} />
    <rect x={94} y={-24} width={22} height={48} rx={6} fill="#F5E6DA" />
    <rect x={-92} y={-38} width={36} height={76} rx={8} fill="#E0263A" opacity={Math.floor(t / 8) % 2 ? 1 : 0.4} />
  </g>
);

// #24 gauge libido, jarum turun ke bawah
export const LibidoGauge: React.FC<IP> = ({t}) => {
  const ang = 60 - 140 * smooth(ramp(t, 4, 30));
  return (
    <g>
      <path d="M -150 30 A 150 150 0 0 1 150 30" stroke="#4A4A66" strokeWidth={30} fill="none" />
      <path d="M -150 30 A 150 150 0 0 1 -80 -98" stroke="#7E8CC8" strokeWidth={30} fill="none" />
      <path d="M 80 -98 A 150 150 0 0 1 150 30" stroke="#E0263A" strokeWidth={30} fill="none" />
      <rect x={-6} y={-130} width={12} height={130} rx={6} fill="#F5E6DA" transform={`rotate(${ang})`} />
      <circle r={20} fill="#F5E6DA" />
      <Pill x={0} y={90} text="LIBIDO" bg="#4A4A66" size={26} />
    </g>
  );
};

// #25 emoji meter, jarum diam di muka datar
export const MoodMeter: React.FC<IP> = ({t}) => (
  <g>
    <rect x={-190} y={-90} width={380} height={180} rx={30} fill="#3A3446" />
    {[[-120, '#7E8CC8', 'sad'], [0, '#C9C1C6', 'flat'], [120, '#FFD166', 'happy']].map(([x, c, k]) => (
      <g key={k as string} transform={`translate(${x},-10)`} opacity={k === 'flat' ? 1 : 0.45}>
        <circle r={44} fill={c as string} />
        <circle cx={-14} cy={-8} r={5} fill="#2A2228" /><circle cx={14} cy={-8} r={5} fill="#2A2228" />
        <path d={k === 'sad' ? 'M -16 22 Q 0 8 16 22' : k === 'happy' ? 'M -16 12 Q 0 28 16 12' : 'M -16 16 L 16 16'} stroke="#2A2228" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <path d={`M 0 80 L ${Math.sin(t * 0.05) * 3} 50`} stroke="#F5E6DA" strokeWidth={8} strokeLinecap="round" />
  </g>
);

// #26 monitor EKG, garis jadi lurus (flatline)
export const EkgFlat: React.FC<IP> = ({t}) => {
  const flat = smooth(ramp(t, 10, 30));
  let d = '';
  for (let i = 0; i <= 60; i++) {
    const x = -170 + i * 5.7, ph = (i + t * 1.2) % 20;
    const y = (ph > 8 && ph < 9 ? -70 : ph >= 9 && ph < 10 ? 50 : 0) * (1 - flat);
    d += `${i ? 'L' : 'M'} ${x} ${y} `;
  }
  return (
    <g>
      <rect x={-200} y={-140} width={400} height={280} rx={24} fill="#5A5A70" />
      <rect x={-180} y={-120} width={360} height={240} rx={14} fill="#141A22" />
      <path d={d} stroke="#8FD3C8" strokeWidth={6} fill="none" strokeLinejoin="round" />
      <path d={d} stroke="#8FD3C8" strokeWidth={16} fill="none" opacity={0.2} />
      <rect x={-20} y={140} width={40} height={50} fill="#4A4A5A" />
    </g>
  );
};

// #27 diagram otak, amigdala (almond) nyala + label
export const AmygdalaBrain: React.FC<IP> = ({t}) => (
  <g>
    <g opacity={0.9}><Brain s={0.7} pfc={0.2} mid={0} showMid={false} /></g>
    <g transform="translate(10,40)">
      <ellipse rx={32} ry={20} fill="#FF7A8A" opacity={0.4 + 0.3 * Math.sin(t * 0.3)} />
      <path d="M 0 -16 C 24 -16 30 10 0 18 C -30 10 -24 -16 0 -16 Z" fill="#FF4D5A" />
    </g>
    <path d="M 30 50 L 130 130" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="8 8" />
    <Pill x={160} y={150} text="AMIGDALA" bg="#7E8CC8" size={26} />
  </g>
);

// #28 tangki "DOPAMIN", kenop diputar sampai level "NORMAL"
export const DopamineTank: React.FC<IP> = ({t}) => {
  const lv = 0.85 - 0.33 * smooth(ramp(t, 6, 50));
  const wob = Math.sin(t * 0.4) * 6;
  return (
    <g>
      <rect x={-110} y={-170} width={220} height={320} rx={30} fill="#3A3446" />
      <clipPath id="dtk"><rect x={-96} y={-156} width={192} height={292} rx={22} /></clipPath>
      <g clipPath="url(#dtk)">
        <path d={`M -100 ${-156 + 292 * (1 - lv)} Q -50 ${-156 + 292 * (1 - lv) - wob} 0 ${-156 + 292 * (1 - lv)} T 100 ${-156 + 292 * (1 - lv)} L 100 140 L -100 140 Z`} fill="#FF7AA6" />
      </g>
      <path d="M -110 -22 L 110 -22" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="10 8" />
      <Pill x={0} y={-22} text="NORMAL" bg="#3CC27A" size={22} />
      <Pill x={0} y={-200} text="DOPAMIN" bg="#FF4D7A" size={28} />
      <g transform={`translate(150,90) rotate(${t * 4})`}><circle r={30} fill="#C9C1C6" /><rect x={-5} y={-30} width={10} height={24} rx={5} fill="#3A3446" /></g>
    </g>
  );
};

// #29 jejak langkah bolak-balik di lantai
export const Footprints: React.FC<IP> = ({t}) => (
  <g>
    {Array.from({length: 8}).map((_, i) => {
      const x = -240 + i * 68, y = (i % 2) * 26, on = t > i * 4;
      return <g key={i} transform={`translate(${x},${y}) rotate(90)`} opacity={on ? 0.5 : 0}>
        <ellipse rx={16} ry={26} fill="#F5E6DA" /><circle cx={-8} cy={-34} r={6} fill="#F5E6DA" /><circle cx={6} cy={-36} r={6} fill="#F5E6DA" />
      </g>;
    })}
    {Array.from({length: 8}).map((_, i) => {
      const x = 240 - i * 68, y = 70 + (i % 2) * 26, on = t > 32 + i * 4;
      return <g key={'b' + i} transform={`translate(${x},${y}) rotate(-90)`} opacity={on ? 0.38 : 0}>
        <ellipse rx={16} ry={26} fill="#F5E6DA" /><circle cx={-8} cy={-34} r={6} fill="#F5E6DA" /><circle cx={6} cy={-36} r={6} fill="#F5E6DA" />
      </g>;
    })}
  </g>
);

// #30 HP mengeluarkan grafik dopamin yang naik tajam
export const PhoneSpike: React.FC<IP> = ({t}) => {
  const p = smooth(ramp(t, 4, 24));
  return (
    <g>
      <g transform="rotate(-6)"><PhoneBody w={150} h={280} glow={0.9} /></g>
      <path d={`M -40 -60 L 20 -90 L 60 -60 L ${60 + 120 * p} ${-60 - 220 * p}`} stroke="#FFD166" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${60 + 120 * p - 26} ${-60 - 220 * p + 8} L ${60 + 120 * p} ${-60 - 220 * p} L ${60 + 120 * p + 10} ${-60 - 220 * p + 30}`} stroke="#FFD166" strokeWidth={12} fill="none" strokeLinecap="round" opacity={p} />
      <Pill x={140} y={-320} text="DOPAMIN" bg="#FF4D7A" size={22} />
    </g>
  );
};

// #31 otak dicuci / disaring air bersih; HP 18+ & tisu dicoret
export const BrainWash: React.FC<IP> = ({t}) => (
  <g>
    <g>
      {Array.from({length: 16}).map((_, i) => {
        const x = -120 + (i % 8) * 34, ph = ((t * 0.05 + i * 0.13) % 1);
        return <path key={i} d="M 0 -10 C 6 0 6 8 0 10 C -6 8 -6 0 0 -10 Z" fill="#8FD3E8" opacity={0.9 * (1 - ph)} transform={`translate(${x},${-210 + ph * 120}) scale(1.3)`} />;
      })}
      <rect x={-150} y={-250} width={300} height={34} rx={14} fill="#C9D9E6" />
    </g>
    <Brain s={0.6} pfc={0.5} mid={0.3} />
    <ellipse cx={0} cy={140} rx={170} ry={26} fill="#8FD3E8" opacity={0.5} />
    <g transform="translate(-200,160) scale(0.45)">
      <PhoneBody w={150} h={260} glow={0.6} /><CrossX p={ramp(t, 20, 30)} />
    </g>
    <g transform="translate(200,170) scale(0.45)">
      <rect x={-80} y={-40} width={160} height={90} rx={12} fill="#7FB7E8" /><CrossX p={ramp(t, 26, 36)} />
    </g>
  </g>
);
export {C, FONT, mix};
