import React from 'react';
import {C} from '../theme';
import {WallCalendar} from '../components/Calendar';
import {Check, CrossX, FONT, IP, Pill, ramp, smooth} from './common';

// #40 kalender halaman nambah sampai 66, kebiasaan baru ditempel selotip
export const Calendar66: React.FC<IP> = ({t}) => {
  const n = Math.min(66, 30 + Math.floor(t * 1.8));
  const tape = ramp(t, 22, 30);
  return (
    <g>
      <WallCalendar page={String(n)} tear={n < 66 ? (t * 1.8) % 1 : 0} header="HARI" />
      {tape > 0 && [[-130, -150, -30], [130, -150, 30]].map(([x, y, r], i) => (
        <rect key={i} x={-50} y={-18} width={100 * tape} height={36} fill="#F5E6B0" opacity={0.85} transform={`translate(${x},${y}) rotate(${r})`} />
      ))}
    </g>
  );
};

// #41 pita finish di hari 30, tapi jalan masih panjang
export const FinishRibbon: React.FC<IP> = ({t}) => {
  const brk = smooth(ramp(t, 10, 18));
  return (
    <g>
      {[-200, 200].map((x) => <rect key={x} x={x - 10} y={-160} width={20} height={200} rx={8} fill="#F5E6DA" />)}
      <path d={`M -200 -130 Q ${-100} ${-120 + brk * 80} ${-10 - brk * 40} ${-124 + brk * 120}`} stroke="#E0263A" strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d={`M 200 -130 Q ${100} ${-120 + brk * 80} ${10 + brk * 40} ${-124 + brk * 120}`} stroke="#E0263A" strokeWidth={16} fill="none" strokeLinecap="round" />
      <Pill x={-200} y={-190} text="HARI 30" bg="#3A2A30" size={24} />
      <g transform="translate(0,-260)">
        <path d="M 0 0 L 0 -110 L 70 -90 L 0 -70" fill="#8FD36A" stroke="#F5E6DA" strokeWidth={6} />
        <Pill x={0} y={30} text="66 HARI" bg="#3CC27A" size={22} />
      </g>
    </g>
  );
};

// #43 bubble mimpi pink blur + jam weker + centang hijau
export const DreamBubble: React.FC<IP> = ({t}) => (
  <g>
    <defs><filter id="drb"><feGaussianBlur stdDeviation={12} /></filter></defs>
    {[{x: -120, y: 150, r: 16}, {x: -90, y: 110, r: 24}].map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="#F5E6DA" />)}
    <path d="M -150 30 C -200 30 -200 -50 -140 -56 C -140 -120 -60 -130 -30 -96 C 0 -150 100 -140 110 -84 C 180 -96 210 -10 160 20 C 190 70 120 110 80 84 C 50 120 -40 120 -60 84 C -110 110 -170 80 -150 30 Z" fill="#F5E6DA" />
    <ellipse cx={0} cy={-10} rx={120} ry={60} fill="#FF8AB0" opacity={0.75} filter="url(#drb)" />
    <path d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" fill="#FFFFFF" opacity={0.8} transform="scale(1.6)" />
  </g>
);
export const AlarmClock: React.FC<IP> = ({t}) => {
  const ring = t < 30 ? Math.sin(t * 2.2) * 8 : 0;
  return (
    <g transform={`rotate(${ring})`}>
      {[-1, 1].map((s) => <circle key={s} cx={s * 60} cy={-80} r={30} fill="#E0263A" />)}
      <circle r={100} fill="#E0263A" /><circle r={82} fill="#FFFFFF" />
      <rect x={-4} y={-64} width={8} height={68} rx={4} fill="#2A1838" /><rect x={-4} y={-46} width={8} height={50} rx={4} fill="#2A1838" transform="rotate(120)" />
      <rect x={-56} y={86} width={20} height={30} rx={6} fill="#8E1B2C" transform="rotate(20 -46 100)" /><rect x={36} y={86} width={20} height={30} rx={6} fill="#8E1B2C" transform="rotate(-20 46 100)" />
    </g>
  );
};
export const NormalCheck: React.FC<IP> = ({t}) => (
  <g><Check p={ramp(t, 2, 12)} s={1.3} /><Pill x={0} y={100} text="NORMAL" bg="#3CC27A" size={28} /></g>
);

// #44 diagram biologi kartun: sel sperma lucu berenang + ikon daun "ORGANIK"
export const SpermDiagram: React.FC<IP> = ({t}) => (
  <g>
    <rect x={-240} y={-190} width={480} height={360} rx={28} fill="#F5FFFE" />
    <rect x={-240} y={-190} width={480} height={56} rx={28} fill="#4FB3A9" />
    <rect x={-240} y={-160} width={480} height={26} fill="#4FB3A9" />
    {[0, 1, 2].map((i) => {
      const x = -120 + ((t * (2.4 + i * 0.4) + i * 120) % 280), y = -70 + i * 80 + Math.sin(t * 0.2 + i) * 10;
      let tail = 'M 0 0 ';
      for (let k = 1; k <= 12; k++) tail += `L ${-k * 8} ${Math.sin(t * 0.6 + k * 0.8 + i) * 8} `;
      return (
        <g key={i} transform={`translate(${x},${y}) scale(1.5)`}>
          <path d={tail} stroke="#7E8CC8" strokeWidth={6} fill="none" strokeLinecap="round" />
          <ellipse cx={14} cy={0} rx={22} ry={16} fill="#B9C6F0" />
          <circle cx={20} cy={-4} r={4} fill="#2A2238" /><circle cx={10} cy={-4} r={4} fill="#2A2238" />
          <path d="M 8 6 Q 15 11 22 6" stroke="#2A2238" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      );
    })}
    <g transform="translate(150,110)">
      <path d="M -40 30 C -40 -30 20 -50 50 -50 C 50 -10 30 40 -40 30 Z" fill="#3CC27A" />
      <path d="M -40 30 L 30 -30" stroke="#2E8A56" strokeWidth={5} />
    </g>
    <Pill x={30} y={140} text="ORGANIK" bg="#3CC27A" size={24} />
  </g>
);

// #45 ikon pabrik/pompa dicoret X
export const FactoryX: React.FC<IP> = ({t}) => (
  <g>
    <path d="M -150 100 L -150 -20 L -90 -60 L -90 -20 L -30 -60 L -30 -20 L 30 -60 L 30 100 Z" fill="#8A7A82" />
    <rect x={50} y={-150} width={50} height={250} fill="#6E6068" />
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.03 + i / 3) % 1;
      return <circle key={i} cx={75 + ph * 30} cy={-170 - ph * 80} r={20 + ph * 20} fill="#C9C1C6" opacity={0.7 * (1 - ph)} />;
    })}
    {[-120, -60, 0].map((x) => <rect key={x} x={x} y={20} width={34} height={34} rx={4} fill="#FFD166" opacity={0.7} />)}
    <CrossX p={ramp(t, 6, 18)} s={1.3} />
  </g>
);
export {C, FONT};
