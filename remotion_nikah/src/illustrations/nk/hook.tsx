// Ilustrasi BARU — HOOK (meja akad, kamar gelap, meja undangan) + ONE SHOT (pusaran khayalan). Semua dinamis (t = frame).
// (0,0) = titik fokus ilustrasi.
import React from 'react';
import {rand} from '../../theme';
import {useSid} from '../../components/Phone';
import {HandsetNk} from './shared';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };

/* ---------- meja akad rendah: taplak putih renda, sepasang buku nikah, vas melati kecil, mikrofon meja ---------- */
export const AkadTable: React.FC<{t: number; w?: number; depth?: number}> = ({t, w = 980, depth = 300}) => (
  <g>
    <rect x={-w / 2} y={-8} width={w} height={26} rx={8} fill="#7A4E30" />
    <rect x={-w / 2 + 20} y={16} width={w - 40} height={depth} fill="#5E3A22" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={-w / 2 + 40 + i * ((w - 80) / 7)} y={40} width={(w - 80) / 7 - 16} height={depth - 50} rx={6} fill="#6E4630" opacity={0.6} />)}
    <path d={`M ${-w / 2 - 10} -22 L ${w / 2 + 10} -22 L ${w / 2 + 10} 70 Q ${w / 4} 96 0 70 Q ${-w / 4} 96 ${-w / 2 - 10} 70 Z`} fill="#F7F2E8" />
    {Array.from({length: 18}).map((_, i) => <circle key={i} cx={-w / 2 + 20 + i * ((w - 40) / 17)} cy={74 + Math.sin(i * 1.3) * 8} r={7} fill="none" stroke="#E2D6BC" strokeWidth={3} />)}
    {/* buku nikah: cokelat & hijau, emblem emas */}
    {[[-150, '#7A3A2A', -6], [-40, '#2E6B4E', 5]].map(([x, c, r], i) => (
      <g key={i} transform={`translate(${x},-34) rotate(${r})`}>
        <rect x={-48} y={-14} width={96} height={22} rx={4} fill={c as string} />
        <rect x={-48} y={-18} width={96} height={8} rx={3} fill="#F4EEE0" />
        <circle cx={0} cy={-2} r={7} fill="#E8C76A" opacity={0.9} />
      </g>
    ))}
    {/* mikrofon meja */}
    <g transform="translate(170,-30)"><rect x={-20} y={-6} width={40} height={10} rx={4} fill="#2A2A30" /><path d="M 0 -6 Q 4 -50 -10 -80" stroke="#2A2A30" strokeWidth={5} fill="none" /><ellipse cx={-12} cy={-88} rx={10} ry={14} fill="#3A3A42" /></g>
    {/* vas melati */}
    <g transform="translate(330,-30)">
      <path d="M -16 0 L 16 0 L 22 -50 L -22 -50 Z" fill="#E8DCC6" />
      {Array.from({length: 9}).map((_, i) => <circle key={i} cx={Math.cos(i * 1.9) * 26} cy={-70 - Math.abs(Math.sin(i * 2.4)) * 34 + Math.sin(t * 0.05 + i) * 2} r={9} fill="#FFFFFF" />)}
    </g>
  </g>
);

/* ---------- cincin di jari terhubung kabel charger ke HP 18+ merah (kamar gelap) ---------- */
// k 0..1 = kabel terungkap dari cincin ke HP; ping = notifikasi
export const RingCharger: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const id = useSid('rc');
  const cable = 'M -150 -110 C -60 -40 -170 60 -40 110 C 80 150 60 40 170 70 C 230 86 250 150 250 190';
  const ping = (t % 45) / 45;
  return (
    <g>
      {/* tangan suami dari kiri, telungkup, cincin emas */}
      <path d="M -460 -190 Q -300 -170 -200 -130" stroke="#1F2747" strokeWidth={70} strokeLinecap="round" fill="none" />
      <ellipse cx={-170} cy={-120} rx={54} ry={40} fill="#F1C9A5" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-148 + i * 6} y={-150 + i * 18} width={70} height={18} rx={9} fill="#F1C9A5" transform={`rotate(${20 - i * 6} -150 -120)`} />)}
      <rect x={-112} y={-104} width={14} height={24} rx={5} fill="#F2C14E" transform="rotate(30 -105 -92)" />
      <circle cx={-150} cy={-110} r={22} fill="#FFD166" opacity={0.3 + 0.2 * Math.sin(t * 0.3)} />
      {/* kabel charger */}
      <path d={cable} stroke="#2A2A32" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      <path d={cable} stroke="#D9DDE6" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      <path d={cable} stroke="#FF3B4A" strokeWidth={3} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`0.04 0.08`} strokeDashoffset={-t * 0.01} opacity={0.8 * k} />
      {/* HP 18+ menyala merah */}
      <g transform="translate(250,250) rotate(8)" opacity={sm((k - 0.6) / 0.3)}>
        <circle r={230} fill={`url(#${id})`} />
        <defs><radialGradient id={id}><stop offset="0" stopColor="#FF2A3A" stopOpacity={0.45} /><stop offset="1" stopColor="#FF2A3A" stopOpacity={0} /></radialGradient></defs>
        <HandsetNk t={t} w={130} h={250} color="#FF2A3A" />
        <g transform={`translate(0,-170) scale(${0.6 + ping * 0.6})`} opacity={1 - ping}><circle r={30} fill="none" stroke="#FF5A66" strokeWidth={5} /></g>
      </g>
    </g>
  );
};

/* ---------- tinta merah tumpah & menyebar di kartu undangan pernikahan ---------- */
// k 0..1: 0 botol tegak, 0..0.25 jatuh, lalu tinta melebar menutup kartu
export const InviteInk: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const id = useSid('ii');
  const fall = sm(k / 0.22);
  const spread = sm((k - 0.18) / 0.82);
  const blob = (r: number) => {
    const pts = Array.from({length: 16}).map((_, i) => {
      const a = (i / 16) * Math.PI * 2, rr = r * (0.75 + rand(i * 3.7) * 0.45 + Math.sin(t * 0.08 + i) * 0.03);
      return [Math.cos(a) * rr * 1.25, Math.sin(a) * rr];
    });
    return 'M ' + pts.map((p, i) => {
      const n = pts[(i + 1) % pts.length];
      return `${p[0]} ${p[1]} Q ${(p[0] + n[0]) / 2 + (rand(i) - 0.5) * r * 0.3} ${(p[1] + n[1]) / 2 + (rand(i * 2) - 0.5) * r * 0.3}`;
    }).join(' ') + ' Z';
  };
  return (
    <g>
      <defs><clipPath id={`${id}c`}><rect x={-250} y={-170} width={500} height={340} rx={10} /></clipPath></defs>
      {/* kartu undangan */}
      <g transform="rotate(-4)">
        <rect x={-256} y={-176} width={512} height={352} rx={12} fill="#000" opacity={0.3} transform="translate(10,14)" />
        <rect x={-250} y={-170} width={500} height={340} rx={10} fill="#FBF6EA" />
        <rect x={-228} y={-148} width={456} height={296} rx={6} fill="none" stroke="#D9B46A" strokeWidth={4} />
        <rect x={-218} y={-138} width={436} height={276} rx={4} fill="none" stroke="#E8D3A0" strokeWidth={2} />
        {/* dua cincin emblem + ornamen */}
        <g transform="translate(0,-82)"><circle cx={-16} r={22} fill="none" stroke="#D9B46A" strokeWidth={6} /><circle cx={16} r={22} fill="none" stroke="#D9B46A" strokeWidth={6} /></g>
        <rect x={-150} y={-30} width={300} height={16} rx={8} fill="#C9B48A" opacity={0.8} />
        <text x={0} y={24} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill="#B8924A">&amp;</text>
        {[50, 80, 104].map((y, i) => <rect key={y} x={-120 + i * 20} y={y} width={240 - i * 40} height={9} rx={4.5} fill="#D9C8A6" />)}
        {/* tinta menyebar (dipotong di tepi kartu) + tetes keluar tepi */}
        <g clipPath={`url(#${id}c)`}>
          <g transform={`translate(${150 - spread * 110},${-110 + spread * 80})`}>
            <path d={blob(30 + spread * 230)} fill="#B3121F" opacity={0.92} />
            <path d={blob(18 + spread * 170)} fill="#D41F2E" opacity={0.85} />
            <ellipse cx={-30} cy={-20} rx={30 + spread * 40} ry={10 + spread * 14} fill="#FF6A70" opacity={0.25} />
          </g>
        </g>
        {spread > 0.5 && [0, 1, 2].map((i) => <path key={i} d={`M ${-220 + i * 150} 170 q 6 ${30 + i * 20 + spread * 30} 0 ${50 + i * 30 + spread * 40}`} stroke="#B3121F" strokeWidth={10} strokeLinecap="round" opacity={sm((spread - 0.5) * 3)} />)}
      </g>
      {/* botol tinta (jatuh menggelinding) */}
      <g transform={`translate(${210 + fall * 30},${-200 + fall * 36}) rotate(${fall * 100})`}>
        <path d="M -38 -50 L 38 -50 L 46 40 Q 46 60 26 60 L -26 60 Q -46 60 -46 40 Z" fill="#2A1A1E" opacity={0.85} />
        <path d="M -38 -50 L 38 -50 L 46 40 Q 46 60 26 60 L -26 60 Q -46 60 -46 40 Z" fill="#B3121F" opacity={0.55 - fall * 0.3} />
        <rect x={-20} y={-80} width={40} height={32} rx={6} fill="#1A1014" />
        <path d="M -30 -40 L -30 40" stroke="#FFFFFF" strokeWidth={6} opacity={0.3} strokeLinecap="round" />
      </g>
      {/* aliran tinta dari mulut botol */}
      {fall > 0.6 && <path d={`M ${210 + 30 + 60} ${-200 + 36 + 20} Q 220 -120 160 -110`} stroke="#B3121F" strokeWidth={14 * (1 - spread * 0.7)} fill="none" strokeLinecap="round" />}
    </g>
  );
};

/* ---------- ONE SHOT: pusaran awan pink blur (puting beliung kecil) + kertas rencana tersedot berhamburan ---------- */
export const FantasySwirl: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const id = useSid('fs');
  const rings = 12;
  return (
    <g>
      <defs><filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={10} /></filter></defs>
      <g filter={`url(#${id}b)`} opacity={0.85 * k}>
        {Array.from({length: rings}).map((_, i) => {
          const y = 60 - i * 34, r = 30 + Math.pow(i / rings, 1.4) * 230, ph = t * 0.12 + i * 0.6;
          return <ellipse key={i} cx={Math.sin(ph) * 18 * (i / rings)} cy={y} rx={r} ry={r * 0.22} fill="none" stroke={i % 2 ? '#FF8AD0' : '#FFB8E6'} strokeWidth={22 - i * 0.8} opacity={0.55} />;
        })}
        <ellipse cx={0} cy={-260} rx={250} ry={70} fill="#FF6AC0" opacity={0.35} />
      </g>
      {/* garis arus berputar (tajam) */}
      {Array.from({length: 7}).map((_, i) => {
        const ph = (t * 0.03 + i / 7) % 1, y = 60 - ph * 380, r = 40 + ph * 220, a = t * 0.2 + i * 2;
        return <path key={i} d={`M ${Math.cos(a) * r} ${y} A ${r} ${r * 0.22} 0 0 1 ${Math.cos(a + 1.2) * r} ${y + 10}`} stroke="#FFE3F4" strokeWidth={4} fill="none" opacity={Math.sin(ph * Math.PI) * 0.9 * k} />;
      })}
      {/* kertas rencana (daftar, denah rumah) tersedot berputar naik */}
      {Array.from({length: 9}).map((_, i) => {
        const ph = (t * 0.018 + i / 9) % 1, ang = t * 0.15 + i * 2.4, r = 60 + ph * 240;
        const x = Math.cos(ang) * r, y = 120 - ph * 420 + Math.sin(ang) * r * 0.2;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${ang * 60}) scale(${0.7 + ph * 0.4})`} opacity={Math.sin(ph * Math.PI) * k}>
            <rect x={-26} y={-34} width={52} height={68} rx={3} fill="#F7F2E8" />
            {i % 3 === 0 ? <path d="M -16 6 L 0 -10 L 16 6 L 16 24 L -16 24 Z" fill="none" stroke="#6A8AC0" strokeWidth={3} />
              : [0, 1, 2, 3].map((j) => <rect key={j} x={-18} y={-24 + j * 14} width={30 - (j % 2) * 10} height={5} rx={2.5} fill="#9AA0B4" />)}
          </g>
        );
      })}
    </g>
  );
};
