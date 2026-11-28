// Ilustrasi BARU — FASE 2 (garasi malam). Semua dinamis (t = frame); k = progres aksi 0..1.
import React from 'react';
import {rand} from '../../theme';
import {useSid} from '../../components/Phone';
import {HandsetNk} from './shared';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const Spark: React.FC<{x: number; y: number; s?: number; op?: number}> = ({x, y, s = 1, op = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    <circle r={14} fill="#FFF4C2" opacity={0.55} />
    {[0, 45, 90, 135].map((r) => <line key={r} x1={-18} x2={18} y1={0} y2={0} stroke="#FFFFFF" strokeWidth={3} transform={`rotate(${r})`} strokeLinecap="round" />)}
  </g>
);

/* ---------- kepala tampak samping: dahi berbentuk MENARA KONTROL bandara mini, lampu korslet satu-satu ---------- */
export const TowerHead: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const N = 6;
  return (
    <g>
      {/* kepala profil menghadap kanan */}
      <path d="M -170 160 Q -230 40 -190 -60 Q -150 -150 -40 -160 L 40 -150 L 70 -60 Q 110 -40 120 0 L 150 40 Q 156 54 136 58 L 130 80 Q 140 100 120 110 Q 128 140 90 150 Q 40 160 20 220 L -150 220 Z" fill="#F1C9A5" />
      <path d="M -190 -60 Q -150 -150 -40 -160 L -10 -150 Q -120 -100 -150 20 Q -170 70 -150 110 Q -210 60 -190 -60 Z" fill="#17141C" />
      <ellipse cx={-80} cy={20} rx={26} ry={36} fill="#D9A882" />
      <path d="M 60 0 Q 76 -6 92 0" stroke="#2A1620" strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={78} cy={8} r={7} fill="#2A1620" />
      {/* menara kontrol di dahi */}
      <g transform="translate(40,-128) scale(1.45)">
        <path d="M -26 0 L 26 0 L 20 -120 L -20 -120 Z" fill="#C9CED8" />
        {[0, 1, 2].map((i) => <rect key={i} x={-14} y={-30 - i * 30} width={28} height={6} fill="#8A90A0" />)}
        <path d="M -90 -120 L 90 -120 L 70 -190 L -70 -190 Z" fill="#2A3242" />
        <path d="M -100 -195 L 100 -195 L 90 -212 L -90 -212 Z" fill="#8A90A0" />
        <rect x={-6} y={-262} width={12} height={52} fill="#8A90A0" />
        <circle cx={0} cy={-266} r={10} fill="#FF4A4A" opacity={0.5 + 0.5 * Math.sin(t * 0.4)} />
        {Array.from({length: N}).map((_, i) => {
          const off = k * N > N - 1 - i; // padam dari kanan ke kiri
          const flick = !off && k * N > N - 2 - i ? (rand(Math.floor(t / 2) + i) > 0.5 ? 1 : 0.2) : 1;
          const x = -66 + i * 26.4;
          return (
            <g key={i}>
              <rect x={x} y={-180} width={20} height={50} rx={3} fill={off ? '#1A1F2A' : '#9FE8FF'} opacity={off ? 1 : flick} />
              {!off && <rect x={x - 6} y={-186} width={32} height={62} fill="#9FE8FF" opacity={0.18 * flick} />}
              {off && rand(Math.floor(t / 5) + i * 3) > 0.7 && <Spark x={x + 10} y={-150} s={0.7} />}
            </g>
          );
        })}
        {/* radar berputar */}
        <g transform="translate(60,-226)"><g transform={`scale(${Math.cos(t * 0.12)},1)`}><rect x={-26} y={-6} width={52} height={12} rx={6} fill="#C9CED8" /></g></g>
      </g>
      {k > 0.2 && <path d={`M 190 -420 q 30 20 10 40 q 30 10 14 40`} stroke="#FFE27A" strokeWidth={5} fill="none" opacity={rand(Math.floor(t / 3)) > 0.5 ? 1 : 0} />}
    </g>
  );
};

/* ---------- senter: sinar awalnya tajam -> melebar & meredup ---------- */
export const FlashlightBeam: React.FC<{t: number; k?: number; len?: number}> = ({t, k = 0, len = 520}) => {
  const id = useSid('fb');
  const spread = 30 + sm(k) * 230, br = 1 - sm(k) * 0.78;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF6D6" stopOpacity={0.85 * br} /><stop offset="1" stopColor="#FFF6D6" stopOpacity={0.05 * br} /></linearGradient></defs>
      <path d={`M -150 -26 L ${-150 + len} ${-spread} L ${-150 + len} ${spread} L -150 26 Z`} fill={`url(#${id})`} />
      <ellipse cx={-150 + len} cy={0} rx={18 + spread * 0.25} ry={spread} fill="#FFF6D6" opacity={0.5 * br * (0.9 + 0.1 * Math.sin(t * 0.5))} />
      {/* titik fokus (target) */}
      <g transform={`translate(${-150 + len},0)`} opacity={br}><circle r={22} fill="none" stroke="#FFFFFF" strokeWidth={4} /><circle r={6} fill="#FFFFFF" /></g>
      <g transform="translate(-230,0)">
        <rect x={-90} y={-26} width={150} height={52} rx={14} fill="#2E3444" />
        <path d="M 60 -26 L 96 -42 L 96 42 L 60 26 Z" fill="#3E4658" />
        <rect x={-30} y={-36} width={30} height={14} rx={5} fill="#FF8A3A" />
        <ellipse cx={96} cy={0} rx={10} ry={40} fill="#FFF6D6" opacity={0.6 * br + 0.2} />
      </g>
    </g>
  );
};

/* ---------- pabrik mini: ban berjalan kebanjiran kotak pink bercahaya sampai menumpuk & tumpah ---------- */
export const ConveyorFactory: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const n = 6 + Math.floor(k * 10);
  return (
    <g>
      {/* gedung pabrik */}
      <path d="M -320 40 L -320 -140 L -250 -190 L -250 -140 L -180 -190 L -180 -140 L -110 -190 L -110 40 Z" fill="#3A3F52" />
      <rect x={-300} y={-300} width={40} height={160} fill="#2E3242" />
      {[0, 1, 2].map((i) => { const ph = (t * 0.02 + i / 3) % 1; return <circle key={i} cx={-280 + ph * 30} cy={-310 - ph * 120} r={20 + ph * 30} fill="#FF9AD8" opacity={(1 - ph) * 0.3} />; })}
      {[0, 1].map((i) => <rect key={i} x={-290 + i * 90} y={-90} width={60} height={50} rx={4} fill="#FF7AC8" opacity={0.6 + 0.3 * Math.sin(t * 0.3 + i)} />)}
      {/* ban berjalan */}
      <rect x={-120} y={10} width={400} height={26} rx={13} fill="#2A2E3A" />
      {Array.from({length: 12}).map((_, i) => <circle key={i} cx={-100 + i * 34} cy={23} r={8} fill="#5A6070" transform={`rotate(${t * 8} ${-100 + i * 34} 23)`} />)}
      {[-100, 260].map((x) => <rect key={x} x={x - 6} y={36} width={12} height={80} fill="#3A3F52" />)}
      {/* kotak pink bercahaya berjalan */}
      {Array.from({length: n}).map((_, i) => {
        const ph = ((t * (0.012 + k * 0.01)) + i / n) % 1;
        const x = -110 + ph * 380;
        return <g key={i} transform={`translate(${x},${-14})`}><rect x={-20} y={-20} width={40} height={40} rx={5} fill="#FF7AC8" /><rect x={-20} y={-20} width={40} height={10} rx={4} fill="#FFC6EA" /><circle r={30} fill="#FF7AC8" opacity={0.2} /></g>;
      })}
      {/* tumpukan di ujung, makin tinggi & tumpah */}
      {Array.from({length: Math.floor(k * 14)}).map((_, i) => {
        const row = Math.floor(i / 4), col = i % 4;
        const x = 300 + col * 42 - row * 20 + (row > 2 ? Math.sin(t * 0.3 + i) * 3 : 0), y = 90 - row * 40;
        return <g key={`s${i}`} transform={`translate(${x},${y}) rotate(${(rand(i) - 0.5) * 24})`}><rect x={-20} y={-20} width={40} height={40} rx={5} fill="#FF7AC8" /><rect x={-20} y={-20} width={40} height={10} rx={4} fill="#FFC6EA" /></g>;
      })}
      {k > 0.6 && Array.from({length: 4}).map((_, i) => {
        const ph = (t * 0.03 + i / 4) % 1;
        return <g key={`f${i}`} transform={`translate(${420 + ph * 80},${-40 + ph * ph * 200}) rotate(${ph * 200})`} opacity={1 - ph}><rect x={-18} y={-18} width={36} height={36} rx={5} fill="#FF7AC8" /></g>;
      })}
    </g>
  );
};

/* ---------- sarung tangan baseball (penerima) kapalan & keras: bola-bola pink mental ---------- */
export const CallusMitt: React.FC<{t: number; k?: number}> = ({t, k = 1}) => (
  <g>
    <g transform="rotate(-12)">
      <path d="M -130 120 Q -170 -20 -120 -140 Q -100 -190 -60 -170 L -40 -80 L -20 -200 Q 10 -230 34 -200 L 40 -90 L 70 -190 Q 100 -210 116 -176 L 100 -60 L 150 -120 Q 180 -130 180 -96 L 120 60 Q 90 150 -30 160 Q -110 160 -130 120 Z" fill="#9A5A2E" />
      <path d="M -100 100 Q -40 20 60 60" stroke="#6E3A1A" strokeWidth={8} fill="none" />
      {[[-60, -60], [10, -110], [80, -40], [-30, 60]].map(([x, y], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx={34} ry={26} fill="#8A8278" opacity={0.85} /><path d={`M ${x - 20} ${y - 6} l 14 8 l 10 -10 l 12 12`} stroke="#4A443E" strokeWidth={3} fill="none" /></g>
      ))}
      {Array.from({length: 8}).map((_, i) => <line key={i} x1={-120 + i * 34} y1={130} x2={-110 + i * 34} y2={110} stroke="#E8C9A0" strokeWidth={4} />)}
    </g>
    {Array.from({length: 4}).map((_, i) => {
      const ph = (t * 0.025 + i / 4) % 1;
      const inb = ph < 0.4, u = inb ? ph / 0.4 : (ph - 0.4) / 0.6;
      const x = inb ? 420 - u * 380 : 40 + u * 360, y = inb ? -140 + i * 40 + u * 80 : -60 + i * 30 - Math.sin(u * Math.PI) * 220 + u * 200;
      return (
        <g key={i} opacity={k * (ph > 0.9 ? (1 - ph) * 10 : 1)}>
          <circle cx={x} cy={y} r={28} fill="#FF7AC8" opacity={0.25} />
          <circle cx={x} cy={y} r={18} fill="#FF9AD8" />
          <path d={`M ${x - 12} ${y - 6} Q ${x} ${y + 4} ${x + 12} ${y - 6}`} stroke="#FFFFFF" strokeWidth={2.5} fill="none" />
          {!inb && u < 0.12 && <g>{[0, 60, 120, 180, 240, 300].map((r) => <line key={r} x1={x + 26} y1={y} x2={x + 40} y2={y} stroke="#FFFFFF" strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}</g>}
        </g>
      );
    })}
  </g>
);

/* ---------- layar HP: fatamorgana pink berkilau (heat haze) yang menarik mata ---------- */
export const MiragePhone: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const id = useSid('mp');
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={8} /></filter></defs>
      <g filter={`url(#${id}b)`} opacity={0.7 * k}>
        {Array.from({length: 5}).map((_, i) => <ellipse key={i} cx={Math.sin(t * 0.08 + i) * 20} cy={-180 - i * 40} rx={120 - i * 14} ry={20} fill={i % 2 ? '#FF7AC8' : '#FFB3E0'} />)}
        <ellipse cx={0} cy={-300} rx={90} ry={60} fill="#FF9AD8" opacity={0.6} />
      </g>
      {Array.from({length: 6}).map((_, i) => (
        <path key={i} d={`M -110 ${-130 - i * 34} Q -55 ${-140 - i * 34 + Math.sin(t * 0.2 + i) * 10} 0 ${-130 - i * 34} T 110 ${-130 - i * 34}`} stroke="#FFE3F4" strokeWidth={3} fill="none" opacity={0.6 * k * (1 - i / 7)} />
      ))}
      {Array.from({length: 10}).map((_, i) => <path key={`s${i}`} transform={`translate(${(rand(i) - 0.5) * 240},${-140 - rand(i * 3) * 220}) scale(${0.4 + 0.4 * Math.abs(Math.sin(t * 0.2 + i))})`}
        d="M 0 -8 C 1 -2 2 -1 8 0 C 2 1 1 2 0 8 C -1 2 -2 1 -8 0 C -2 -1 -1 -2 0 -8 Z" fill="#FFFFFF" opacity={k} />)}
      <HandsetNk t={t} w={150} h={280} color="#FF4FA8" />
    </g>
  );
};

/* ---------- dasbor mobil: lampu peringatan merah menyala, ditutup stiker "AMAN" ---------- */
export const DashWarning: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const blink = Math.sin(t * 0.45) > 0 ? 1 : 0.35;
  const st = sm(k);
  return (
    <g>
      <path d="M -330 -150 Q 0 -210 330 -150 L 330 150 L -330 150 Z" fill="#1A1E28" />
      {[-170, 170].map((x, i) => (
        <g key={x} transform={`translate(${x},-20)`}>
          <circle r={110} fill="#0E1018" stroke="#3A4256" strokeWidth={8} />
          {Array.from({length: 9}).map((_, j) => <rect key={j} x={-2} y={-96} width={4} height={14} fill="#8AA6C8" transform={`rotate(${-120 + j * 30})`} />)}
          <rect x={-3} y={-80} width={6} height={86} rx={3} fill="#FF6A3A" transform={`rotate(${-60 + i * 40 + Math.sin(t * 0.05 + i) * 6})`} />
          <circle r={10} fill="#3A4256" />
        </g>
      ))}
      {/* lampu peringatan (ikon mesin) */}
      <g transform="translate(0,-40)">
        <circle r={70} fill="#FF2A2A" opacity={0.28 * blink * (1 - st * 0.85)} />
        <path d="M -36 -18 L -14 -18 L -8 -28 L 14 -28 L 20 -18 L 36 -18 L 36 22 L -36 22 Z M -46 -6 L -36 -6 M 36 0 L 48 -6 L 48 10 L 36 6" fill="#FF3B3B" stroke="#FF3B3B" strokeWidth={4} opacity={blink} />
        {/* stiker AMAN menutup */}
        <g transform={`translate(${(1 - st) * 200},${(1 - st) * 120}) rotate(${-8 + (1 - st) * 30})`} opacity={st > 0 ? 1 : 0}>
          <rect x={-74} y={-40} width={148} height={80} rx={14} fill="#5FD08A" stroke="#FFFFFF" strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#0E3A22">AMAN</text>
          {st > 0.95 && <path d="M 60 -40 L 74 -26 L 60 -26 Z" fill="#E8FFF0" />}
        </g>
      </g>
      <rect x={-300} y={110} width={600} height={30} rx={10} fill="#2A3040" />
    </g>
  );
};

/* ---------- laci lemari arsip ditarik: map bercahaya + cap "JAMA PSYCHIATRY 2014" ---------- */
export const FilingDrawer: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const out = sm(k / 0.35), lift = sm((k - 0.3) / 0.3), stamp = clamp((k - 0.62) / 0.12);
  return (
    <g>
      <rect x={-200} y={-80} width={400} height={360} rx={10} fill="#6A7488" />
      <rect x={-180} y={140} width={360} height={120} rx={6} fill="#5A6478" />
      <rect x={-40} y={190} width={80} height={14} rx={7} fill="#C9D2E0" />
      {/* laci tertarik (perspektif ke depan = membesar & turun) */}
      <g transform={`translate(0,${-10 + out * 60}) scale(${1 + out * 0.12})`}>
        <path d="M -190 -60 L 190 -60 L 190 70 L -190 70 Z" fill="#7A8498" />
        <rect x={-40} y={-10} width={80} height={14} rx={7} fill="#E0E6F0" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-170 + i * 12} y={-90 - i * 4} width={300} height={40} rx={4} fill={i % 2 ? '#E8DCC0' : '#D9CCAE'} opacity={out} />)}
      </g>
      {/* map bercahaya naik */}
      <g transform={`translate(0,${-120 - lift * 170})`} opacity={lift}>
        <circle r={200} fill="#9FE8FF" opacity={0.14} />
        <path d="M -150 -110 L -40 -110 L -20 -90 L 150 -90 L 150 110 L -150 110 Z" fill="#F2D58A" />
        <rect x={-130} y={-70} width={260} height={160} rx={4} fill="#FFF8E6" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-110} y={-50 + i * 22} width={150 - (i % 2) * 40} height={8} rx={4} fill="#C9C0A8" />)}
        {/* cap stempel */}
        {stamp > 0 && (
          <g transform={`translate(20,40) rotate(-10) scale(${1 + (1 - stamp) * 1.2})`} opacity={stamp}>
            <rect x={-130} y={-44} width={260} height={88} rx={10} fill="none" stroke="#C62F3E" strokeWidth={7} />
            <text x={0} y={-6} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#C62F3E">JAMA PSYCHIATRY</text>
            <text x={0} y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#C62F3E">2014</text>
          </g>
        )}
        {[0, 1, 2, 3].map((i) => { const ph = (t * 0.03 + i / 4) % 1; return <circle key={i} cx={-120 + i * 80} cy={-120 - ph * 100} r={4} fill="#DFF8FF" opacity={(1 - ph) * lift} />; })}
      </g>
    </g>
  );
};

/* ---------- rak 7 gelas ukur (S-S-R-K-J-S-M) terisi cairan pink makin tinggi ---------- */
export const WeekBeakers: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  return (
    <g>
      <rect x={-380} y={130} width={760} height={24} rx={6} fill="#8A6A44" />
      <rect x={-370} y={154} width={18} height={60} fill="#6E5034" /><rect x={352} y={154} width={18} height={60} fill="#6E5034" />
      {days.map((d, i) => {
        const x = -324 + i * 108, lvl = clamp(k * 7 - i) * (0.32 + i * 0.1);
        const h = 220, top = 130 - h, fy = 126 - lvl * (h - 20);
        return (
          <g key={i}>
            <path d={`M ${x - 40} ${top} L ${x + 40} ${top} L ${x + 40} 126 Q ${x + 40} 130 ${x + 36} 130 L ${x - 36} 130 Q ${x - 40} 130 ${x - 40} 126 Z`} fill="#BFE6FF" opacity={0.16} />
            <path d={`M ${x - 38} ${fy + Math.sin(t * 0.3 + i) * 3} Q ${x} ${fy - 6 + Math.sin(t * 0.3 + i + 1) * 3} ${x + 38} ${fy} L ${x + 38} 126 L ${x - 38} 126 Z`} fill="#FF6AC0" opacity={0.85} />
            {lvl > 0 && <rect x={x - 38} y={fy} width={76} height={126 - fy} fill="#FF6AC0" opacity={0.25} transform={`translate(0,0)`} />}
            <path d={`M ${x - 40} ${top} L ${x - 40} 126 M ${x + 40} ${top} L ${x + 40} 126`} stroke="#DFF4FF" strokeWidth={4} opacity={0.8} />
            {Array.from({length: 5}).map((_, j) => <line key={j} x1={x + 22} x2={x + 40} y1={top + 30 + j * 36} y2={top + 30 + j * 36} stroke="#DFF4FF" strokeWidth={2} opacity={0.6} />)}
            <text x={x} y={192} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#E8F4FF">{d}</text>
            {lvl > 0 && <circle cx={x} cy={fy - 10} r={30} fill="#FF6AC0" opacity={0.15} />}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- mesin cuci + sweater berlabel "STRIATUM" keluar lalu menyusut jadi mini ---------- */
export const ShrinkSweater: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const out = sm(k / 0.4), shrink = sm((k - 0.4) / 0.5);
  const sc = 1 - shrink * 0.68;
  return (
    <g>
      <g transform="translate(-170,0)">
        <rect x={-150} y={-180} width={300} height={360} rx={20} fill="#D9DEE8" />
        <rect x={-150} y={-180} width={300} height={60} rx={20} fill="#C2C9D6" />
        <circle cx={80} cy={-150} r={14} fill="#5A6070" /><rect x={-120} y={-160} width={110} height={22} rx={6} fill="#2A3040" />
        <circle cx={0} cy={30} r={110} fill="#8A94A6" />
        <circle cx={0} cy={30} r={86} fill="#2A3346" />
        <g transform={`rotate(${t * (k < 0.4 ? 9 : 2)} 0 30)`}>{[0, 120, 240].map((r) => <ellipse key={r} cx={0} cy={-20} rx={22} ry={30} fill="#5A6A88" transform={`rotate(${r} 0 30)`} />)}</g>
        <circle cx={0} cy={30} r={86} fill="#BFE6FF" opacity={0.15} />
        <path d="M -60 -20 Q -40 -50 -10 -54" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.5} />
      </g>
      {/* sweater */}
      <g transform={`translate(${-170 + out * 330},${30 - out * 40 + shrink * 70}) scale(${(0.3 + out * 0.7) * sc})`} opacity={out}>
        <path d="M -70 -110 L -150 -60 L -120 10 L -80 -20 L -80 120 L 80 120 L 80 -20 L 120 10 L 150 -60 L 70 -110 Q 0 -80 -70 -110 Z" fill="#4A7AC0" />
        {[0, 1, 2].map((i) => <path key={i} d={`M -80 ${40 + i * 24} L 80 ${40 + i * 24}`} stroke="#3A62A0" strokeWidth={6} />)}
        <path d="M -40 -100 Q 0 -70 40 -100" stroke="#3A62A0" strokeWidth={10} fill="none" />
        <rect x={-62} y={-50} width={124} height={44} rx={6} fill="#FFFFFF" />
        <text x={0} y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#C62F3E">STRIATUM</text>
        {shrink > 0.2 && [-1, 1].map((sd) => <path key={sd} d={`M ${sd * 140} ${-20} l ${-sd * 30} 0 M ${sd * 140} ${-20} l ${-sd * 14} -14 M ${sd * 140} ${-20} l ${-sd * 14} 14`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={shrink} />)}
      </g>
      {Array.from({length: 5}).map((_, i) => { const ph = (t * 0.03 + i / 5) % 1; return <circle key={i} cx={-170 + (rand(i) - 0.5) * 160} cy={-200 - ph * 120} r={10 + ph * 18} fill="#FFFFFF" opacity={(1 - ph) * 0.3} />; })}
    </g>
  );
};

/* ---------- siluet ilmuwan (jas lab) dengan papan jepit + tanda tanya kecil berputar ---------- */
export const ScientistSil: React.FC<{t: number}> = ({t}) => {
  const tap = Math.max(0, Math.sin(t * 0.5)) * 10;
  return (
    <g>
      <circle cx={0} cy={-300} r={74} fill="#9FB2CC" opacity={0.35} />
      <circle cx={0} cy={-300} r={70} fill="#5A6A84" />
      <path d="M -50 -330 Q 0 -380 50 -330" stroke="#DFF8FF" strokeWidth={6} fill="none" opacity={0.6} />
      <path d="M -110 -200 Q -130 60 -100 230 L 100 230 Q 130 60 110 -200 Q 0 -240 -110 -200 Z" fill="#DDE6F2" opacity={0.92} />
      <path d="M -30 -214 L 0 -150 L 30 -214" stroke="#9AA8BC" strokeWidth={6} fill="none" />
      <rect x={-16} y={230} width={34} height={70} fill="#2B3446" /><rect x={-60} y={230} width={34} height={70} fill="#2B3446" transform="translate(84,0)" />
      {/* papan jepit + pulpen */}
      <g transform="translate(60,-40) rotate(-12)">
        <rect x={-60} y={-80} width={120} height={160} rx={8} fill="#8A6A44" />
        <rect x={-50} y={-66} width={100} height={136} fill="#FFF8E6" />
        <rect x={-20} y={-90} width={40} height={20} rx={4} fill="#9AA0B0" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-40} y={-44 + i * 26} width={70 - (i % 2) * 20} height={6} rx={3} fill="#9AA0B4" />)}
      </g>
      <g transform={`translate(-40,${-10 - tap}) rotate(30)`}><rect x={-4} y={-60} width={8} height={70} rx={3} fill="#2A2A32" /></g>
      {/* tanda tanya berputar 3D */}
      <g transform={`translate(70,-430) scale(${Math.cos(t * 0.1)},1)`}>
        <circle r={46} fill="#9FE8FF" opacity={0.18} />
        <text x={0} y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={70} fill="#DFF8FF">?</text>
      </g>
    </g>
  );
};

/* ---------- deretan cabai level 1-5 (makin merah & berapi); cabai terakhir diambil ---------- */
export const ChiliLadder: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const grab = sm(k);
  return (
    <g>
      <rect x={-420} y={90} width={840} height={20} rx={8} fill="#6E5034" />
      {Array.from({length: 5}).map((_, i) => {
        const x = -340 + i * 170, s = 0.6 + i * 0.12;
        const col = ['#7FBF4A', '#E0C040', '#F08A30', '#E8402A', '#C8101E'][i];
        const last = i === 4;
        return (
          <g key={i} transform={`translate(${x},${last ? -grab * 150 : 0}) rotate(${last ? -grab * 20 : 0})`}>
            {i >= 3 && Array.from({length: 3 + i}).map((_, j) => (
              <path key={j} d={`M ${-14 + j * 9} ${-40 * s} q ${-8} ${-30 - Math.sin(t * 0.9 + j) * 10} 0 ${-50 - i * 8} q 10 24 0 50 Z`} fill={j % 2 ? '#FFB040' : '#FF6A2A'} opacity={0.85} transform={`scale(${s})`} />
            ))}
            <g transform={`scale(${s})`}>
              <path d="M -10 -60 Q 30 -40 26 20 Q 20 90 -10 110 Q -24 80 -22 20 Q -24 -40 -10 -60 Z" fill={col} />
              <path d="M -4 -44 Q 8 -10 4 40" stroke="#FFFFFF" strokeWidth={5} opacity={0.35} fill="none" strokeLinecap="round" />
              <path d="M -10 -60 Q -6 -80 6 -90" stroke="#3E8A4A" strokeWidth={8} fill="none" strokeLinecap="round" />
            </g>
            <text x={0} y={150} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFE6C0" opacity={last ? 1 - grab : 1}>{i + 1}</text>
          </g>
        );
      })}
    </g>
  );
};

/* ---------- kunang-kunang pink yang selalu lolos (berkerumun lalu menghindar) ---------- */
export const FireflySwarm: React.FC<{t: number; n?: number; spread?: number}> = ({t, n = 9, spread = 260}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const a = t * (0.03 + rand(i) * 0.03) + i * 2.1;
      const x = Math.cos(a) * spread * (0.4 + rand(i * 3) * 0.6) + Math.sin(t * 0.07 + i) * 30;
      const y = Math.sin(a * 1.3) * spread * 0.45 + Math.cos(t * 0.05 + i) * 20;
      const glow = 0.5 + 0.5 * Math.sin(t * 0.25 + i * 1.7);
      const flap = Math.sin(t * 1.6 + i) * 30;
      return (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle r={26} fill="#FF6AC0" opacity={0.22 * glow} />
          <ellipse cx={-6} cy={-6} rx={9} ry={5} fill="#FFE6F4" opacity={0.7} transform={`rotate(${-30 + flap})`} />
          <ellipse cx={6} cy={-6} rx={9} ry={5} fill="#FFE6F4" opacity={0.7} transform={`rotate(${30 - flap})`} />
          <ellipse cx={0} cy={2} rx={6} ry={8} fill="#FF9AD8" />
          <circle cx={0} cy={6} r={5} fill="#FFFFFF" opacity={glow} />
        </g>
      );
    })}
  </g>
);
