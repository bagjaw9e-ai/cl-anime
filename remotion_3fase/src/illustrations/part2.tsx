// Ilustrasi MID-CTA (panggung gelap amber) + FASE 2 (kantor). (0,0) = pusat objek.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, mix, rand} from '../theme';
import {useSid} from '../components/Phone';
import {Halo, Rise} from '../components/Lit';
import {CEREBRUM, PFC_CLIP_X} from '../components/Brain';
import {backOut, ramp, smooth} from './shared';

/* ---------- MID-CTA ---------- */
// otak menyala amber (glow 0..1)
export const AmberBrain: React.FC<{glow: number; t: number; s?: number}> = ({glow, t, s = 1}) => {
  const id = useSid('ab');
  return (
    <g transform={`scale(${s})`}>
      <defs><linearGradient id={`${id}g`} x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#FFF4E0" /><stop offset="1" stopColor="#F2A43C" /></linearGradient></defs>
      <Halo rx={380} ry={320} color="#FFB23F" op={0.45 * glow} />
      <g opacity={0.35 + 0.65 * glow}>
        <path d={CEREBRUM} fill={`url(#${id}g)`} />
        {['M -170 -40 C -150 -70 -120 -60 -110 -90 C -100 -115 -70 -110 -60 -130', 'M -185 10 C -160 0 -150 -30 -125 -25 C -100 -20 -100 -50 -80 -60',
          'M -30 -140 C -20 -110 10 -120 15 -90 C 20 -60 -10 -50 0 -20', 'M 40 -150 C 50 -120 80 -125 75 -95 C 70 -70 100 -60 110 -40',
          'M 30 -60 C 55 -50 70 -20 100 -20 C 130 -20 140 20 165 30', 'M -60 70 C -40 50 -10 60 0 40 C 10 20 40 30 55 10'].map((d, i) => (
          <path key={i} d={d} stroke="#C9782A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.6} />
        ))}
      </g>
      <Rise y={-60} w={420} h={360} n={14} seed={31} op={glow} t={t} />
    </g>
  );
};

// kabel saraf putus disambung lagi lalu menyala: join 0..1
export const NerveReconnect: React.FC<{join: number; t: number}> = ({join, t}) => {
  const gap = lerp(140, 0, smooth(clamp(join * 1.3)));
  const lit = smooth(ramp(join, 0.75, 1));
  const end = (sd: number) => (
    <g transform={`translate(${sd * (gap / 2 + 0)},0)`}>
      <path d={`M ${sd * 360} 40 C ${sd * 260} -40 ${sd * 140} 40 ${sd * 20} 0`} stroke={mix('#5A6170', '#FFD166', lit)} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d={`M ${sd * 360} 40 C ${sd * 260} -40 ${sd * 140} 40 ${sd * 20} 0`} stroke="#FFF4E0" strokeWidth={5} fill="none" opacity={lit} />
      <g transform={`translate(${sd * 20},0)`}>{[-20, 0, 20].map((a) => <line key={a} x1={0} y1={0} x2={sd * 26 * Math.cos((a * Math.PI) / 180)} y2={26 * Math.sin((a * Math.PI) / 180)} stroke={mix('#8A90A0', '#FFF4E0', lit)} strokeWidth={4} strokeLinecap="round" />)}</g>
    </g>
  );
  return (
    <g>
      <Halo rx={420} ry={180} color="#FFB23F" op={0.15 + 0.4 * lit} />
      {end(-1)}{end(1)}
      {join > 0.7 && join < 0.85 && <Halo rx={80} color="#FFFFFF" op={0.9} />}
      {lit > 0 && Array.from({length: 4}).map((_, i) => {
        const ph = ((t * 0.03 + i / 4) % 1);
        return <circle key={i} cx={lerp(-360, 360, ph)} cy={Math.sin(ph * Math.PI * 3) * 26} r={8} fill="#FFF4E0" opacity={lit} />;
      })}
    </g>
  );
};

// lampu sirene merah berputar (bukan laser): on 0..1
export const SirenLight: React.FC<{on: number; t: number}> = ({on, t}) => {
  const rot = t * 9;
  return (
    <g>
      <g opacity={on}>
        <g transform={`rotate(${rot})`}>
          <path d="M 0 0 L -900 -260 L -900 260 Z" fill="#FF2D2D" opacity={0.18} />
          <path d="M 0 0 L 900 -260 L 900 260 Z" fill="#FF2D2D" opacity={0.18} />
        </g>
        <Halo rx={160} color="#FF2D2D" op={0.6 * (0.6 + 0.4 * Math.abs(Math.sin((rot * Math.PI) / 180)))} />
      </g>
      <rect x={-70} y={40} width={140} height={34} rx={8} fill="#2A2A32" />
      <path d="M -56 40 L -56 -20 Q 0 -80 56 -20 L 56 40 Z" fill={mix('#5A2024', '#FF3B3B', on)} />
      <path d="M -30 30 L -30 -10 Q 0 -44 30 -10" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.4 * on} />
    </g>
  );
};

/* ---------- FASE 2 ---------- */
// otak dengan PFC emas digerogoti rayap merah: eat 0..1
export const TermiteBrain: React.FC<{eat: number; t: number}> = ({eat, t}) => {
  const id = useSid('tb');
  const bites = Math.floor(eat * 7);
  return (
    <g>
      <defs><clipPath id={`${id}c`}><rect x={-260} y={-200} width={PFC_CLIP_X + 260} height={400} /></clipPath></defs>
      <Halo x={-120} rx={260} ry={220} color="#FFD166" op={0.35 * (1 - eat * 0.6)} />
      <path d={CEREBRUM} fill="#F2B8C6" />
      <g clipPath={`url(#${id}c)`}><path d={CEREBRUM} fill={mix('#FFD166', '#8A6A3A', eat * 0.7)} /></g>
      <path d={CEREBRUM} fill="none" stroke="#C97A90" strokeWidth={5} />
      <text x={-150} y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#5A3A12" opacity={0.75}>PFC</text>
      {/* gigitan */}
      {Array.from({length: bites}).map((_, i) => <circle key={i} cx={-200 + rand(i * 3) * 110} cy={-120 + rand(i * 5) * 200} r={16 + rand(i) * 12} fill="#05060C" opacity={0.85} />)}
      {/* rayap */}
      {Array.from({length: 7}).map((_, i) => {
        const a = t * 0.08 + i * 0.9;
        const x = -150 + Math.cos(a) * (40 + i * 9), y = Math.sin(a * 1.3) * (60 + i * 6);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(a * 57) % 360})`} opacity={clamp(eat * 3 - i * 0.2)}>
            <ellipse rx={13} ry={7} fill="#C0262E" /><circle cx={14} r={6} fill="#8E1B24" />
            {[-6, 0, 6].map((dx) => <line key={dx} x1={dx} y1={-6} x2={dx - 4} y2={-13} stroke="#8E1B24" strokeWidth={2} />)}
          </g>
        );
      })}
    </g>
  );
};

// panel kendali mini (kokpit) — lampu mati satu-satu: off 0..1
export const Cockpit: React.FC<{off: number}> = ({off}) => {
  const n = 10, dead = Math.floor(off * (n + 1));
  return (
    <g>
      <Halo rx={260} ry={150} color="#7FD8F0" op={0.3 * (1 - off)} />
      <path d="M -230 80 L -200 -80 L 200 -80 L 230 80 Z" fill="#2A3036" />
      <rect x={-180} y={-60} width={360} height={60} rx={8} fill="#141A1E" />
      {Array.from({length: n}).map((_, i) => {
        const on = i >= dead;
        const c = ['#4FB36A', '#F2C94C', '#7FD8F0'][i % 3];
        return <g key={i}><circle cx={-160 + i * 36} cy={-30} r={12} fill={on ? c : '#2A2E34'} />{on && <circle cx={-160 + i * 36} cy={-30} r={22} fill={c} opacity={0.25} />}</g>;
      })}
      {[-120, 0, 120].map((x, i) => <g key={x} transform={`translate(${x},40)`}><circle r={26} fill="#3A4046" /><rect x={-3} y={-22} width={6} height={20} fill={i >= dead / 3 ? '#FFFFFF' : '#5A5E66'} transform={`rotate(${-60 + i * 50})`} /></g>)}
    </g>
  );
};

// pedal rem patah: snap 0..1
export const BrakePedal: React.FC<{snap: number}> = ({snap}) => {
  const k = smooth(snap);
  return (
    <g>
      <Halo rx={200} color="#FF8A2B" op={0.25} />
      <rect x={-12} y={-220} width={24} height={150} fill="#7A808C" />
      <g transform={`translate(0,-70) rotate(${k * 70}) translate(0,${k * 120})`}>
        <rect x={-12} y={0} width={24} height={110} fill="#7A808C" />
        <rect x={-70} y={100} width={140} height={46} rx={10} fill="#3A3E48" />
        {[-40, -14, 12, 38].map((x) => <rect key={x} x={x} y={108} width={10} height={30} rx={4} fill="#22262E" />)}
      </g>
      {snap > 0.05 && snap < 0.5 && Array.from({length: 6}).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 20} y1={-70 + Math.sin(a) * 20} x2={Math.cos(a) * 60} y2={-70 + Math.sin(a) * 60} stroke="#FFD166" strokeWidth={5} strokeLinecap="round" />;
      })}
      <text x={0} y={140} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF" opacity={0.8}>REM</text>
    </g>
  );
};

// tali tekad menipis lalu putus: p 0..1 (putus di 0.7)
export const WillRope: React.FC<{p: number}> = ({p}) => {
  const th = lerp(26, 6, clamp(p / 0.7));
  const br = smooth(ramp(p, 0.7, 1));
  return (
    <g>
      <Halo rx={320} ry={120} color="#FFB23F" op={0.2} />
      <rect x={-340} y={-60} width={40} height={120} rx={8} fill="#5A4636" /><rect x={300} y={-60} width={40} height={120} rx={8} fill="#5A4636" />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M ${sd * 300} 0 Q ${sd * 150} ${br * 80} ${sd * (4 + br * 30)} ${br * 160}`} stroke="#D9B98A" strokeWidth={th} fill="none" strokeLinecap="round" />
      ))}
      {p < 0.7 && <circle r={th * 0.9} fill="#C9A97A" />}
      <text y={-80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF" opacity={0.75}>TEKAD</text>
    </g>
  );
};

// korek api menyala + sumbu pendek di atas kepala: burn 0..1
export const MatchFuse: React.FC<{burn: number; t: number}> = ({burn, t}) => {
  const fl = 1 + Math.sin(t * 0.8) * 0.12;
  const fx = lerp(-40, 30, burn);
  return (
    <g>
      <path d={`M -40 0 Q 0 -20 30 -10`} stroke="#3A3A3A" strokeWidth={8} fill="none" />
      <path d={`M ${fx} ${-6} Q 10 -18 30 -10`} stroke="#5A5048" strokeWidth={8} fill="none" opacity={0} />
      <g transform={`translate(${fx},${-8 - Math.sin(burn * 3) * 4})`}>
        <Halo rx={60} color="#FF9A3C" op={0.7} />
        <path d={`M 0 0 C -12 ${-18 * fl} 0 ${-34 * fl} 4 ${-40 * fl} C 12 ${-26 * fl} 14 -10 0 0 Z`} fill="#FF9A3C" />
        <path d={`M 2 -2 C -4 ${-12 * fl} 2 ${-20 * fl} 4 ${-24 * fl} C 8 -12 8 -6 2 -2 Z`} fill="#FFE08A" />
        {Array.from({length: 3}).map((_, i) => <circle key={i} cx={(rand(t + i) - 0.5) * 30} cy={-20 - rand(t * 2 + i) * 30} r={2.5} fill="#FFD166" />)}
      </g>
      {/* korek */}
      <g transform="translate(-130,40) rotate(-35)">
        <rect x={-6} y={-80} width={12} height={90} rx={4} fill="#E8D2A8" /><ellipse cy={-84} rx={10} ry={12} fill="#C0262E" />
        <Halo y={-100} rx={40} color="#FF9A3C" op={0.6} />
        <path d="M 0 -96 C -10 -112 0 -126 4 -132 C 10 -118 10 -104 0 -96 Z" fill="#FFB347" />
      </g>
    </g>
  );
};

// atasan (siluet abu-abu sederhana ala ref_1) menunjuk berkas
export const BossSilhouette: React.FC<{point: number}> = ({point}) => (
  <g fill="#5A6170">
    <circle cx={0} cy={-560} r={58} />
    <path d="M -70 -490 L 70 -490 L 80 -200 L -80 -200 Z" />
    <rect x={-70} y={-200} width={56} height={200} rx={20} /><rect x={14} y={-200} width={56} height={200} rx={20} />
    <path d={`M -60 -470 L -110 -330 L -96 -320 L -50 -440 Z`} />
    <g transform={`translate(64,-470) rotate(${-60 - point * 40})`}><rect x={-14} y={0} width={28} height={150} rx={14} /><rect x={-6} y={140} width={12} height={40} rx={6} /></g>
    <rect x={-120} y={-330} width={90} height={110} rx={4} fill="#C9C1B0" transform="rotate(-8 -75 -275)" />
  </g>
);

// dadu dilempar di atas berkas penting: roll 0..1
export const DiceOnFiles: React.FC<{roll: number; t: number}> = ({roll, t}) => (
  <g>
    <Halo rx={240} ry={110} color="#FFF4E0" op={0.25} />
    {[0, 1, 2].map((k) => <rect key={k} x={-150 + k * 12} y={-10 - k * 12} width={280} height={22} fill={['#E8E0CC', '#D9CFB6', '#EFE8D6'][k]} transform={`rotate(${-3 + k * 3})`} />)}
    <text x={-110} y={-30} fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#8A3A2A" opacity={0.7}>PENTING</text>
    {[0, 1].map((i) => {
      const k = smooth(roll), x = lerp(-260 + i * 40, 20 + i * 70, k), y = -60 - Math.abs(Math.sin(k * Math.PI * 2.5)) * 120 * (1 - k);
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${(1 - k) * 720 + i * 20})`}>
          <rect x={-26} y={-26} width={52} height={52} rx={10} fill="#F7F3EA" stroke="#C9C1B4" strokeWidth={3} />
          {[[-12, -12], [12, 12], [0, 0], [12, -12], [-12, 12]].slice(0, 3 + i * 2).map(([a, b], j) => <circle key={j} cx={a} cy={b} r={5} fill="#C0262E" />)}
        </g>
      );
    })}
  </g>
);

// kompas berputar liar + jalan bercabang di monitor
export const CompassSpin: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={170} color="#7FD8F0" op={0.25} />
    <circle r={120} fill="#C9A96A" /><circle r={104} fill="#F4EEDD" />
    {['U', 'T', 'S', 'B'].map((d, i) => <text key={d} x={Math.sin((i * Math.PI) / 2) * 80} y={-Math.cos((i * Math.PI) / 2) * 80 + 10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#5A4A30">{d}</text>)}
    <g transform={`rotate(${t * 23 + Math.sin(t * 0.37) * 90})`}>
      <path d="M 0 -80 L 14 0 L 0 10 L -14 0 Z" fill="#C0262E" /><path d="M 0 80 L 14 0 L 0 -10 L -14 0 Z" fill="#3A3A48" />
    </g>
    <circle r={10} fill="#5A4A30" />
  </g>
);
export const ForkRoad: React.FC = () => (
  <g>
    <path d="M -20 80 L 20 80 L 6 0 L -6 0 Z" fill="#F2F4F4" opacity={0.85} />
    <path d="M -6 0 L -70 -70 L -54 -76 L 0 -14 Z" fill="#F2F4F4" opacity={0.85} />
    <path d="M 6 0 L 70 -70 L 54 -76 L 0 -14 Z" fill="#F2F4F4" opacity={0.85} />
    <path d="M 0 -6 L 0 -80" stroke="#F2F4F4" strokeWidth={10} opacity={0.6} />
    <text x={-80} y={-84} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFD166">?</text><text x={66} y={-84} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFD166">?</text>
  </g>
);
