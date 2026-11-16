import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {PhoneBody} from '../components/Phone';
import {WallCalendar} from '../components/Calendar';
import {Check, FONT, IP, Pill, backOut, ramp, smooth} from './common';

// #4 kalender: tanggal 1-3 dilingkari merah (spidol)
export const Calendar13: React.FC<IP> = ({t}) => <WallCalendar circled={[1, 2, 3]} circleP={ramp(t, 4, 26)} header="HARI 1–3" />;

// #6 siluet badan + centang hijau "OK"
export const BodyOK: React.FC<IP> = ({t}) => (
  <g>
    <g fill="#8FD3C8" opacity={0.85}>
      <circle cx={0} cy={-120} r={46} />
      <path d="M -70 -60 Q 0 -80 70 -60 L 60 80 L 30 80 L 20 160 L -20 160 L -30 80 L -60 80 Z" />
    </g>
    <g transform="translate(80,-40)"><Check p={ramp(t, 6, 16)} s={0.9} /></g>
    <Pill x={80} y={40} text="OK" bg="#3CC27A" size={26} />
  </g>
);

// #7 otak dengan lintasan rel loop yang udah "aus" + kereta mainan muter
export const BrainTrack: React.FC<IP> = ({t}) => {
  const a = t * 0.12;
  return (
    <g>
      <Brain s={0.62} pfc={0.3} mid={0.9} />
      <ellipse cx={0} cy={0} rx={170} ry={70} fill="none" stroke="#6E4A3A" strokeWidth={22} />
      <ellipse cx={0} cy={0} rx={170} ry={70} fill="none" stroke="#C9A27A" strokeWidth={6} strokeDasharray="6 14" />
      {[0.3, 1.4, 2.6, 4.0, 5.2].map((q, i) => <path key={i} d={`M ${Math.cos(q) * 170 - 10} ${Math.sin(q) * 70} l 20 4`} stroke="#3A2A30" strokeWidth={3} opacity={0.6} />)}
      <g transform={`translate(${Math.cos(a) * 170},${Math.sin(a) * 70}) rotate(${(Math.atan2(Math.cos(a) * 70, -Math.sin(a) * 170) * 180) / Math.PI})`}>
        <rect x={-26} y={-16} width={52} height={32} rx={8} fill={C.red2} />
        <rect x={-14} y={-26} width={22} height={14} rx={4} fill="#3A2A30" />
        <circle cx={-14} cy={16} r={7} fill="#2A1820" /><circle cx={14} cy={16} r={7} fill="#2A1820" />
      </g>
    </g>
  );
};

// #8 jam dinding besar tik-tok (bosen)
export const ClockTick: React.FC<IP> = ({t}) => (
  <g transform={`rotate(${Math.sin(t * 0.2) * 2})`}>
    <circle r={120} fill="#6E5A62" /><circle r={104} fill="#F5E6DA" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-3} y={-98} width={6} height={i % 3 ? 10 : 18} rx={3} fill="#5A4A50" transform={`rotate(${i * 30})`} />)}
    <rect x={-4} y={-82} width={8} height={88} rx={4} fill={C.red1} transform={`rotate(${Math.floor(t / 15) * 6})`} />
    <rect x={-6} y={-56} width={12} height={62} rx={6} fill="#3A2E33" transform="rotate(110)" />
    <circle r={10} fill="#3A2E33" />
  </g>
);

// #11 layar HP: thumbnail blur + sensor bar + badge 18+
export const PhoneScreen18: React.FC<IP> = ({t}) => {
  const off = (t * 3) % 120;
  return (
    <g>
      <rect x={-150} y={-260} width={300} height={520} rx={40} fill="#1B1218" />
      <clipPath id="ps18"><rect x={-130} y={-236} width={260} height={472} rx={24} /></clipPath>
      <defs><filter id="ps18b"><feGaussianBlur stdDeviation={9} /></filter></defs>
      <g clipPath="url(#ps18)">
        <rect x={-130} y={-236} width={260} height={472} fill="#3A1020" />
        {Array.from({length: 8}).map((_, i) => {
          const y = -236 + i * 120 - off;
          return (
            <g key={i}>
              <rect x={-118} y={y + 8} width={236} height={104} rx={12} fill={i % 2 ? '#FF6F91' : '#FF4D7A'} opacity={0.95} filter="url(#ps18b)" />
              <rect x={-60} y={y + 52} width={120} height={14} rx={3} fill="#0A0508" opacity={0.9} />
              <circle cx={-40} cy={y + 34} r={22} fill="#FFD0DA" opacity={0.6} filter="url(#ps18b)" />
              <Pill x={80} y={y + 22} text="18+" bg="#E0263A" size={18} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

// #12 gantungan pintu, kotak tisu kecil, saklar lampu (simbolik) — saklar dimatikan
export const LightSwitch: React.FC<IP> = ({t}) => {
  const off = smooth(ramp(t, 12, 16));
  return (
    <g>
      <rect x={-50} y={-80} width={100} height={160} rx={16} fill="#F5E6DA" />
      <rect x={-22} y={-46} width={44} height={92} rx={10} fill="#D9C8BC" />
      <rect x={-18} y={-42 + off * 44} width={36} height={40} rx={8} fill="#FFFFFF" />
    </g>
  );
};
export const TissueSmall: React.FC<IP> = () => (
  <g>
    <path d="M -60 -10 L 60 -10 L 60 50 L -60 50 Z" fill="#7FB7E8" /><path d="M -60 -10 L -30 -34 L 90 -34 L 60 -10 Z" fill="#A8D2F5" />
    <path d="M 60 -10 L 90 -34 L 90 26 L 60 50 Z" fill="#5E97C8" />
    <path d="M 10 -26 C 0 -70 40 -70 34 -44 C 46 -62 60 -36 40 -26 Z" fill="#FFFFFF" />
  </g>
);

// #13 termometer naik + tetes keringat
export const Thermometer: React.FC<IP> = ({t}) => {
  const lv = 0.25 + 0.7 * smooth(ramp(t, 2, 40));
  return (
    <g>
      <rect x={-26} y={-170} width={52} height={250} rx={26} fill="#F5E6DA" />
      <circle cx={0} cy={110} r={48} fill="#F5E6DA" />
      <rect x={-12} y={-150 + 220 * (1 - lv)} width={24} height={220 * lv + 40} rx={12} fill="#E0263A" />
      <circle cx={0} cy={110} r={34} fill="#E0263A" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={26} y={-140 + i * 50} width={20} height={6} rx={3} fill="#C9B8AC" />)}
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.04 + i / 3) % 1);
        return <path key={i} d="M 0 -14 C 9 0 9 12 0 14 C -9 12 -9 0 0 -14 Z" fill="#8FD3C8" opacity={1 - ph}
          transform={`translate(${-90 + i * 40},${-120 + ph * 160}) scale(1.4)`} />;
      })}
    </g>
  );
};
export {Pill, FONT, backOut};
