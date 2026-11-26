// Ilustrasi BARU video 30 hari 16:9 — bagian B: HARI KE-7 + HARI KE-14. Semua DINAMIS.
import React from 'react';
import {clamp, mix, rand} from '../../theme';
import {Halo} from '../../components/Lit';
import {useSid} from '../../components/Phone';
import {BRAIN_PATH, BrainShape, PhonePink, TX, sm} from './partA';

const CYN = '#3FF0F0';

/* 15. Papan skor digital gym "DAY 7" (LED berkedip, digit muncul) */
export const Scoreboard: React.FC<{t: number; on: number}> = ({t, on}) => (
  <g>
    <Halo rx={360} ry={180} color={CYN} op={0.35 * on} />
    <rect x={-280} y={-110} width={560} height={220} rx={16} fill="#0A1418" stroke="#2A4A54" strokeWidth={10} />
    {Array.from({length: 22}).map((_, i) => <circle key={i} cx={-260 + i * 24.8} cy={-92} r={4} fill={CYN} opacity={0.2 + 0.8 * (Math.floor(t / 4 + i) % 4 === 0 ? 1 : 0.2)} />)}
    <g opacity={on > 0.5 ? (Math.floor(t / 3) % 7 === 0 ? 0.6 : 1) : on}>{TX(0, 50, 'DAY 7', 130, '#CFFFFF')}</g>
  </g>
);

/* 16. Buku jurnal terbuka di bangku gym: halaman membalik sendiri, pembatas menyala */
export const FlippingJournal: React.FC<{t: number}> = ({t}) => {
  const ph = (t % 24) / 24;
  return (
    <g>
      <Halo rx={320} ry={200} color="#BFF8FF" op={0.3} />
      <path d="M 0 -20 L -260 -60 L -260 90 L 0 120 Z" fill="#F4F0E6" /><path d="M 0 -20 L 260 -60 L 260 90 L 0 120 Z" fill="#E8E2D4" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-230} ${-30 + i * 26} L -30 ${-2 + i * 26}`} stroke="#A8A090" strokeWidth={4} />)}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M 30 ${-2 + i * 26} L 230 ${-30 + i * 26}`} stroke="#A8A090" strokeWidth={4} />)}
      {/* halaman yang sedang dibalik */}
      <path d={`M 0 -20 L ${260 * Math.cos(ph * Math.PI)} ${-60 - Math.sin(ph * Math.PI) * 60} L ${260 * Math.cos(ph * Math.PI)} ${90 - Math.sin(ph * Math.PI) * 40} L 0 120 Z`} fill="#FFFCF4" opacity={0.95} />
      <g transform="translate(150,90)"><Halo rx={50} ry={60} color={CYN} op={0.7 + 0.2 * Math.sin(t * 0.3)} /><path d="M -12 0 L 12 0 L 12 70 L 0 56 L -12 70 Z" fill={CYN} /></g>
      {TX(-130, -80, 'J. ZHEJIANG UNIV.', 22, '#2A3A40')}
    </g>
  );
};

/* 17. Molekul testosteron: 4 cincin (3 heksagon + 1 pentagon) "3D" berputar & menyala */
export const TestoMolecule: React.FC<{t: number}> = ({t}) => {
  const yaw = t * 0.04, sx = Math.cos(yaw);
  const hex = (cx: number, cy: number, n = 6, r = 56) => Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2 + Math.PI / 6; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const rings = [hex(-140, 30), hex(-44, -26), hex(52, 30), hex(140, -16, 5, 50)];
  return (
    <g>
      <Halo rx={360} ry={240} color={CYN} op={0.4 + 0.1 * Math.sin(t * 0.2)} />
      <g transform={`scale(${0.75 + 0.25 * Math.abs(sx)},1) rotate(${Math.sin(t * 0.03) * 6})`}>
        {rings.map((pts, i) => <polygon key={i} points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#CFFFFF" strokeWidth={8} strokeLinejoin="round" />)}
        {rings.flat().map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={i % 5 === 0 ? '#FF8A6A' : CYN} opacity={0.6 + 0.4 * Math.sin(t * 0.25 + i)} />)}
        <line x1={190} y1={-30} x2={240} y2={-70} stroke="#CFFFFF" strokeWidth={6} /><circle cx={250} cy={-78} r={14} fill="#FF8A6A" />
        <line x1={-196} y1={70} x2={-246} y2={96} stroke="#CFFFFF" strokeWidth={6} /><circle cx={-256} cy={100} r={14} fill="#FF8A6A" />
      </g>
    </g>
  );
};

/* 18-19. Alat uji kekuatan karnaval: palu menghantam, bandul melesat ke 145% & bel berdenting, lalu turun ke 100% */
export const HighStriker: React.FC<{t: number; level: number; hit: number}> = ({t, level, hit}) => {
  const H = 560, y = 260 - level / 145 * H * 0.92;
  const ring = level > 140 ? Math.max(0, 1 - ((t % 30) / 30)) : 0;
  return (
    <g>
      <Halo y={-40} rx={220} ry={400} color="#FFD23F" op={0.3} />
      <rect x={-26} y={260 - H} width={52} height={H} rx={10} fill="#2A2E3A" />
      {[50, 100, 145].map((v) => (
        <g key={v}><rect x={-46} y={260 - v / 145 * H * 0.92} width={92} height={4} fill={v === 145 ? '#FF4A5A' : '#8A90A0'} />
          {TX(80, 270 - v / 145 * H * 0.92, `${v}%`, 30, v === 145 ? '#FF6A6A' : '#C9CED8', 'start')}</g>
      ))}
      <g transform={`translate(0,${260 - H - 40}) rotate(${Math.sin(t * 1.4) * 14 * ring})`}>
        <path d="M -50 30 Q -50 -40 0 -40 Q 50 -40 50 30 Z" fill="#FFD23F" /><circle cy={34} r={10} fill="#C9A020" />
        {ring > 0 && [0, 1].map((i) => <path key={i} d={`M ${60 + i * 16} -10 q 10 12 0 24`} stroke="#FFF4C0" strokeWidth={5} fill="none" opacity={ring} />)}
      </g>
      <g transform={`translate(0,${y})`}><Halo rx={60} color="#FFD23F" op={0.7} /><rect x={-30} y={-16} width={60} height={32} rx={10} fill="#FFE070" /></g>
      <rect x={-90} y={260} width={180} height={30} rx={8} fill="#4A3A2A" />
      <g transform={`translate(${-150},${200}) rotate(${-60 + sm(hit) * 70},40,60)`}>
        <rect x={34} y={-20} width={12} height={140} rx={5} fill="#8A5A2E" /><rect x={0} y={-40} width={80} height={40} rx={8} fill="#5A5A66" />
      </g>
    </g>
  );
};

/* 20b. Barbel balon yang lepas & melayang naik (setelah ketahuan) */
export const FloatingBarbell: React.FC<{t: number; up: number}> = ({t, up}) => (
  <g transform={`translate(${Math.sin(t * 0.06) * 30},${-sm(up) * 380}) rotate(${Math.sin(t * 0.05) * 8})`}>
    <rect x={-260} y={-7} width={520} height={14} rx={7} fill="#C9CED8" />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${sd * 250},0)`}><ellipse rx={62} ry={74} fill="#E84A6A" /><ellipse cx={-18} cy={-26} rx={16} ry={24} fill="#FFFFFF" opacity={0.45} />
        <path d={`M 0 74 q ${Math.sin(t * 0.2 + sd) * 14} 40 0 90`} stroke="#F2EEE6" strokeWidth={2} fill="none" /></g>
    ))}
  </g>
);

/* 21. Termostat dinding diputar pelan: angka bergeser ke tengah, cahaya ruangan seimbang */
export const Thermostat: React.FC<{t: number; turn: number}> = ({t, turn}) => {
  const v = 92 - sm(turn) * 42;
  return (
    <g>
      <Halo rx={220} color={mix('#FF6A4A', '#7FE8D8', sm(turn))} op={0.45} />
      <circle r={150} fill="#E8ECF4" /><circle r={120} fill="#1C2430" />
      <path d="M -100 60 A 116 116 0 1 1 100 60" stroke="#2E3A4A" strokeWidth={14} fill="none" />
      <path d="M -100 60 A 116 116 0 1 1 100 60" stroke={mix('#FF6A4A', '#7FE8D8', sm(turn))} strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${v / 100} 1`} />
      {TX(0, 20, `${Math.round(v)}`, 70, '#FFFFFF')}
      <g transform={`rotate(${-120 + v / 100 * 240 + Math.sin(t * 0.5) * 0.6})`}><circle cy={-116} r={12} fill="#FFFFFF" /></g>
      {TX(0, 70, 'SEIMBANG', 20, '#9AA8B8')}
    </g>
  );
};

/* 24. Kembang api basah: sumbu menyala sebentar lalu padam berasap (k 0..1) */
export const WetFirework: React.FC<{t: number; k: number}> = ({t, k}) => {
  const lit = k < 0.55 ? 1 : 0, burn = clamp(k / 0.55);
  return (
    <g>
      <rect x={-34} y={-150} width={68} height={210} rx={10} fill="#C84A5A" /><rect x={-34} y={-150} width={68} height={30} fill="#E8D8A0" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-30 + i * 22} ${-90} q 6 12 0 20`} stroke="#8FD8F8" strokeWidth={4} fill="none" opacity={0.7} />)}
      <path d={`M 0 -150 Q 20 ${-190} ${10} ${-220 + burn * 60}`} stroke="#6A5A4A" strokeWidth={5} fill="none" />
      {lit > 0 && <g transform={`translate(10,${-220 + burn * 60})`}><Halo rx={50} color="#FFC060" op={0.8} />
        {Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i + t) * 26} y2={Math.sin(i + t) * 26} stroke="#FFE08A" strokeWidth={3} />)}</g>}
      {k > 0.55 && [0, 1, 2].map((i) => {
        const ph = ((t * 0.02 + i / 3) % 1);
        return <circle key={i} cx={10 + Math.sin(ph * 6 + i) * 16} cy={-180 - ph * 120} r={10 + ph * 22} fill="#8A8A94" opacity={(1 - ph) * 0.5} />;
      })}
    </g>
  );
};

/* 25. Papan informasi split-flap: huruf berputar lalu berhenti di "— — —" */
export const SplitFlap: React.FC<{t: number; stop: number}> = ({t, stop}) => {
  const chars = 'ABCDEFGHJKLMNOPRSTUVWXYZ0123456789';
  return (
    <g>
      <Halo rx={360} ry={160} color="#B8C8D8" op={0.3} />
      <rect x={-330} y={-90} width={660} height={180} rx={14} fill="#121820" stroke="#3A4654" strokeWidth={8} />
      {Array.from({length: 7}).map((_, i) => {
        const done = stop * 7 > i + 0.5, c = done ? '—' : chars[Math.floor(rand(i * 7 + Math.floor(t / 2)) * chars.length)];
        return (
          <g key={i} transform={`translate(${-270 + i * 90},0)`}>
            <rect x={-38} y={-62} width={76} height={124} rx={8} fill="#1E2632" /><rect x={-38} y={-1} width={76} height={2} fill="#000000" />
            {TX(0, 34, c, 88, done ? '#FFD23F' : '#E8ECF4')}
          </g>
        );
      })}
    </g>
  );
};

/* 26. Kereta lewat cepat: lampunya meninggalkan garis cahaya lurus panjang (light trail) yang tetap datar */
export const TrainTrail: React.FC<{t: number; p: number; w?: number}> = ({t, p, w = 1800}) => {
  const x = -w / 2 - 600 + sm(p) * (w + 1200);
  return (
    <g>
      {[-30, 0, 30].map((dy, i) => (
        <g key={i}><rect x={-w / 2} y={dy - 3} width={Math.max(0, Math.min(w, x + w / 2))} height={6} fill={i === 1 ? '#FFFFFF' : '#8FD8FF'} opacity={0.85} />
          <rect x={-w / 2} y={dy - 12} width={Math.max(0, Math.min(w, x + w / 2))} height={24} fill="#8FD8FF" opacity={0.12} /></g>
      ))}
      <g transform={`translate(${x},0)`}>
        <rect x={-560} y={-110} width={540} height={170} rx={30} fill="#2A3442" />
        {Array.from({length: 5}).map((_, i) => <rect key={i} x={-520 + i * 100} y={-80} width={70} height={50} rx={6} fill="#FFF0C8" opacity={0.75} />)}
        <path d="M -20 -110 Q 60 -110 70 -20 L 70 60 L -20 60 Z" fill="#3A4656" />
        <circle cx={50} cy={20} r={16} fill="#FFFFFF" /><Halo x={50} y={20} rx={120} ry={60} color="#FFFFFF" op={0.6} />
      </g>
      {Array.from({length: 10}).map((_, i) => <line key={i} x1={x - 700 - i * 60} y1={-140 + i * 30} x2={x - 860 - i * 60} y2={-140 + i * 30} stroke="#FFFFFF" strokeWidth={2} opacity={0.2} />)}
    </g>
  );
};

/* 27. Otak transparan dengan amigdala (bentuk almond) menyala berdenyut */
export const AmygdalaBrain: React.FC<{t: number}> = ({t}) => (
  <g>
    <BrainShape fill="#8FB8E8" line="#FFFFFF33" t={t} op={0.3} />
    <path d={BRAIN_PATH} fill="none" stroke="#CFE4FF" strokeWidth={5} />
    <g transform={`translate(-10,40) rotate(-20) scale(${1 + 0.08 * Math.sin(t * 0.25)})`}>
      <Halo rx={80} ry={60} color="#FFB060" op={0.8} />
      <path d="M -36 0 C -36 -24 0 -30 30 -14 C 44 -6 44 8 30 16 C 0 32 -36 24 -36 0 Z" fill="#FFB060" />
    </g>
  </g>
);

/* 28. Mixer audio: bar equalizer memantul + slider "DOPAMIN" turun pelan ke garis tengah */
export const DopaMixer: React.FC<{t: number; down: number}> = ({t, down}) => {
  const sy = -150 + sm(down) * 150;
  return (
    <g>
      <Halo rx={380} ry={240} color="#FFD23F" op={0.25} />
      <rect x={-320} y={-210} width={640} height={420} rx={20} fill="#1A1E28" stroke="#3A4250" strokeWidth={8} />
      {Array.from({length: 10}).map((_, i) => {
        const h = 30 + Math.abs(Math.sin(t * 0.18 + i * 0.9)) * (120 - (i === 6 ? 80 * down : 0));
        return <rect key={i} x={-290 + i * 36} y={-40 - h} width={24} height={h} rx={4} fill={mix('#3FF0A0', '#FFD23F', i / 10)} opacity={0.85} />;
      })}
      <g transform="translate(160,40)">
        <rect x={-6} y={-170} width={12} height={300} rx={6} fill="#0A0C12" />
        <rect x={-30} y={-2} width={60} height={4} fill="#FFD23F" opacity={0.7} />
        <g transform={`translate(0,${sy})`}><rect x={-38} y={-18} width={76} height={36} rx={8} fill="#E8ECF4" /><rect x={-30} y={-2} width={60} height={4} fill="#FF4A5A" /></g>
        {TX(0, 170, 'DOPAMIN', 26, '#FFD23F')}
      </g>
    </g>
  );
};

/* 29. Cipratan kecil dari kaki yang mengetuk genangan */
export const SplashRipples: React.FC<{t: number}> = ({t}) => {
  const ph = (t % 9) / 9;
  return (
    <g>
      {[0, 1].map((i) => <ellipse key={i} rx={30 + ((t * 3 + i * 25) % 70)} ry={(30 + ((t * 3 + i * 25) % 70)) * 0.22} fill="none" stroke="#CFE4FF" strokeWidth={3} opacity={1 - ((t * 3 + i * 25) % 70) / 70} />)}
      {Array.from({length: 6}).map((_, i) => <circle key={i} cx={Math.cos(i) * 40 * ph} cy={-Math.sin(ph * Math.PI) * 40 - i * 2} r={4} fill="#CFE4FF" opacity={1 - ph} />)}
    </g>
  );
};

/* 30. HP jadi mesin slot kecil: gulungan berputar, koin pink bercahaya muntah keluar */
export const SlotPhone: React.FC<{t: number; spin: number}> = ({t, spin}) => {
  const id = useSid('sp');
  return (
    <g>
      <Halo rx={300} ry={300} color="#FF5FA2" op={0.4} />
      <rect x={-130} y={-230} width={260} height={420} rx={36} fill="#1A0E1E" stroke="#FF5FA2" strokeWidth={8} />
      <clipPath id={id}><rect x={-100} y={-150} width={200} height={110} rx={10} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-100} y={-150} width={200} height={110} fill="#FFF4F8" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${-66 + i * 66},${((t * (12 - i * 2) * spin) % 110) - 95})`}>
            {['♥', '18+', '★', '♥'].map((s, k) => <g key={k} transform={`translate(0,${k * 55})`}>{TX(0, 14, s, s === '18+' ? 26 : 40, '#FF2A6A')}</g>)}
          </g>
        ))}
      </g>
      <rect x={-80} y={-10} width={160} height={50} rx={10} fill="#3A0C2A" />
      <g transform={`translate(150,-110) rotate(${Math.sin(t * 0.3) * 10 * spin})`}><rect x={-6} y={0} width={12} height={90} fill="#C9CED8" /><circle r={18} fill="#FF2A4A" /></g>
      {Array.from({length: 9}).map((_, i) => {
        const ph = ((t * 0.04 + i / 9) % 1);
        return (
          <g key={i} transform={`translate(${(rand(i) - 0.5) * 120 + ph * (rand(i * 3) - 0.5) * 300},${190 + ph * 140 - Math.sin(ph * Math.PI) * 120})`} opacity={(1 - ph) * spin}>
            <Halo rx={22} color="#FF5FA2" op={0.8} /><ellipse rx={16} ry={16 * Math.abs(Math.cos(t * 0.3 + i))} fill="#FF8AC0" stroke="#FFFFFF" strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/* 31a. Otak digantung infus cairan bening yang menetes pelan */
export const IVBrain: React.FC<{t: number}> = ({t}) => {
  const ph = (t % 30) / 30;
  return (
    <g>
      <line x1={0} y1={-330} x2={0} y2={-280} stroke="#C9CED8" strokeWidth={6} />
      <path d="M -60 -280 L 60 -280 L 50 -150 Q 0 -120 -50 -150 Z" fill="#E8F4FF" opacity={0.5} stroke="#CFE4FF" strokeWidth={4} />
      <rect x={-46} y={-230} width={92} height={70 - ph * 3} fill="#BFE8FF" opacity={0.6} />
      <rect x={-8} y={-140} width={16} height={30} fill="#CFE4FF" />
      <path d="M 0 -110 C 0 -60 -10 -40 0 -20" stroke="#CFE4FF" strokeWidth={4} fill="none" />
      <path d={`M 0 ${-100 + ph * 70} q 7 12 0 18 q -7 -6 0 -18 Z`} fill="#BFE8FF" opacity={1 - ph * 0.3} />
      <g transform={`translate(0,90) scale(0.8) rotate(${Math.sin(t * 0.04) * 3})`}><BrainShape fill="#9AD8C0" line="#3A6A5A" t={t} glow="#7FE8C8" /></g>
    </g>
  );
};
/* 31b. Tong sampah peron + HP 18+ jatuh masuk (fall 0..1) */
export const BinDrop: React.FC<{t: number; fall: number}> = ({t, fall}) => {
  const f = sm(fall);
  return (
    <g>
      <path d="M -90 -120 L 90 -120 L 76 120 L -76 120 Z" fill="#3A4656" />
      {[-50, 0, 50].map((x) => <rect key={x} x={x - 4} y={-100} width={8} height={200} fill="#2A3442" />)}
      <rect x={-104} y={-138} width={208} height={24} rx={8} fill="#4A586A" />
      {f < 0.98 && <g transform={`translate(${-180 + f * 180},${-300 + f * f * 220}) rotate(${f * 260}) scale(0.4)`}><PhonePink t={t} w={120} /></g>}
      {f > 0.9 && <g opacity={clamp((1.15 - fall) * 4)}>{[0, 1, 2].map((i) => <line key={i} x1={-40 + i * 40} y1={-150} x2={-50 + i * 50} y2={-190} stroke="#FFFFFF" strokeWidth={4} />)}</g>}
    </g>
  );
};
