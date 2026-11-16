import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {PhoneBody} from '../components/Phone';
import {WallCalendar} from '../components/Calendar';
import {CrossX, FONT, IP, Padlock, Pill, ramp, smooth} from './common';

// #1 kepala jadi X-ray transparan, otak berdenyut (dipasang di atas kepala karakter)
export const XrayHead: React.FC<IP> = ({t}) => {
  const scan = ((t * 6) % 260) - 130;
  const pulse = 1 + 0.05 * Math.sin(t * 0.5);
  return (
    <g>
      <ellipse rx={118} ry={138} fill="#8FD3C8" opacity={0.28} />
      <ellipse rx={118} ry={138} fill="none" stroke="#DFFBF7" strokeWidth={5} opacity={0.8} />
      <g transform={`translate(0,-14) scale(${0.36 * pulse})`}><Brain pfc={0.6} mid={0.7} /></g>
      <clipPath id="xr"><ellipse rx={118} ry={138} /></clipPath>
      <g clipPath="url(#xr)">
        <rect x={-130} y={scan} width={260} height={8} fill="#FFFFFF" opacity={0.7} />
        <rect x={-130} y={scan - 40} width={260} height={40} fill="#DFFBF7" opacity={0.18} />
      </g>
    </g>
  );
};

// #2 HP thumbnail blur + badge 18+ digembok
export const PhoneLocked: React.FC<IP> = ({t}) => (
  <g transform={`rotate(${-6 + Math.sin(t * 0.1) * 3})`}>
    <PhoneBody w={190} h={350} glow={0.9} />
    <rect x={-70} y={-120} width={140} height={60} rx={10} fill="#1A0B10" opacity={0.85} />
    <rect x={-70} y={40} width={140} height={26} rx={6} fill="#1A0B10" opacity={0.85} />
    <Pill x={56} y={-150} text="18+" bg="#E0263A" size={30} />
    <g transform={`translate(0,${20 - smooth(ramp(t, 0, 10)) * 0})`}><Padlock s={0.9} c="#FFB547" /></g>
  </g>
);

// #2 kotak tisu dicoret X merah
export const TissueBoxX: React.FC<IP> = ({t}) => (
  <g>
    <path d="M -110 -20 L 110 -20 L 110 90 L -110 90 Z" fill="#7FB7E8" />
    <path d="M -110 -20 L -60 -60 L 160 -60 L 110 -20 Z" fill="#A8D2F5" />
    <path d="M 110 -20 L 160 -60 L 160 50 L 110 90 Z" fill="#5E97C8" />
    <ellipse cx={30} cy={-44} rx={50} ry={10} fill="#3A5A7A" />
    <path d="M 10 -46 C 0 -110 60 -110 50 -70 C 70 -100 90 -60 60 -46 Z" fill="#FFFFFF" />
    <path d="M -80 30 Q -40 10 0 30 Q 40 50 80 30" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.5} />
    <g transform="translate(20,10)"><CrossX p={ramp(t, 4, 16)} s={1.1} /></g>
  </g>
);

// #3 kalender sobek cepat 1 -> 30, stempel merah "30"
export const CalendarFlip: React.FC<IP> = ({t}) => {
  const n = Math.min(30, 1 + Math.floor(t * 1.6));
  const tear = (t * 1.6) % 1;
  const stamp = ramp(t, 20, 26);
  return <WallCalendar page={String(n)} tear={n < 30 ? tear : 0} stamp={n >= 30 ? '30' : undefined} stampP={stamp} header="HARI" />;
};

// #3 teaser otak hari-30: emas bersinar tapi di-blur + gembok + tanda tanya (dibuka di beat 39)
export const BrainTeaser: React.FC<IP & {open?: number}> = ({t, open = 0}) => (
  <g>
    <defs><filter id="tzb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14 * (1 - open)} /></filter></defs>
    <circle r={150} fill={C.gold} opacity={0.35 + 0.1 * Math.sin(t * 0.2)} filter="url(#tzb)" />
    <g filter="url(#tzb)"><Brain s={0.6} pfc={1} mid={0.2} /></g>
    {open < 1 && (
      <g opacity={1 - open}>
        <g transform={`translate(0,${-open * 60})`}><Padlock open={open} s={1.1} /></g>
        <g transform="translate(110,-100)">
          <circle r={36} fill="#1A1220" />
          <text y={16} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.gold} fontFamily={FONT}>?</text>
        </g>
      </g>
    )}
  </g>
);
