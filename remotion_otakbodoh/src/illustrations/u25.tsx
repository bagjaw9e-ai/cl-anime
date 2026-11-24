// Ilustrasi baru video umur25 — UKURAN MEDIUM: utama ±400-650 px lebar pada skala 1, ikon pendukung ≥ ±200 px.
// (0,0) = pusat objek. Semua simbolik & aman TikTok/IG.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, mix, rand} from '../theme';
import {useSid} from '../components/Phone';
import {Halo, Rise} from '../components/Lit';
import {CEREBRUM} from '../components/Brain';
import {Silhouette} from '../components/Silhouette';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {AngerSteam, PINK, Phone18, backOut, ramp, smooth} from './shared';

const flame = (t: number, s = 1, k = 0) => {
  const fl = 1 + Math.sin(t * 0.9 + k) * 0.12;
  return (
    <g transform={`scale(${s})`}>
      <Halo y={-14} rx={46} color="#FFC870" op={0.7} />
      <path d={`M 0 0 C -12 ${-16 * fl} -2 ${-32 * fl} 2 ${-40 * fl} C 10 ${-26 * fl} 12 -10 0 0 Z`} fill="#FF9A3C" />
      <path d={`M 1 -2 C -4 ${-10 * fl} 1 ${-18 * fl} 3 ${-22 * fl} C 7 -12 6 -5 1 -2 Z`} fill="#FFE8A0" />
    </g>
  );
};

/* ---------------- HOOK ---------------- */
// kue ulang tahun 2 tingkat + lilin angka "25". lit 0..1 api; blown 0..1 api padam + asap
export const BirthdayCake: React.FC<{t: number; lit?: number; blown?: number}> = ({t, lit = 1, blown = 0}) => (
  <g>
    <Halo y={-120} rx={340} ry={260} color="#FFC870" op={0.4 * lit * (1 - blown)} />
    <ellipse cx={0} cy={10} rx={260} ry={30} fill="#D9D2C4" />
    <rect x={-210} y={-150} width={420} height={160} rx={18} fill="#F6D9E4" />
    <path d="M -210 -120 Q -180 -90 -150 -120 Q -120 -90 -90 -120 Q -60 -90 -30 -120 Q 0 -90 30 -120 Q 60 -90 90 -120 Q 120 -90 150 -120 Q 180 -90 210 -120 L 210 -150 L -210 -150 Z" fill="#FFFFFF" />
    <rect x={-150} y={-260} width={300} height={120} rx={16} fill="#FF8FB0" />
    <path d="M -150 -236 Q -125 -210 -100 -236 Q -75 -210 -50 -236 Q -25 -210 0 -236 Q 25 -210 50 -236 Q 75 -210 100 -236 Q 125 -210 150 -236 L 150 -260 L -150 -260 Z" fill="#FFFFFF" />
    {Array.from({length: 9}).map((_, i) => <circle key={i} cx={-180 + i * 45} cy={-60} r={7} fill={['#F2C94C', '#7FD8F0', '#FF5F8A'][i % 3]} />)}
    {/* lilin angka 2 & 5 */}
    {['2', '5'].map((d, i) => (
      <g key={d} transform={`translate(${i ? 48 : -48},-262)`}>
        <text y={0} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={120} fill="#F2C94C" stroke="#C9962E" strokeWidth={4}>{d}</text>
        <rect x={-3} y={-110} width={6} height={18} fill="#3A2A20" />
        {lit * (1 - blown) > 0.05 && <g transform="translate(0,-110)" opacity={lit * (1 - blown)}>{flame(t, 1, i)}</g>}
        {blown > 0.05 && [0, 1].map((k) => {
          const ph = (blown * 1.2 + k * 0.3) % 1;
          return <path key={k} d={`M 0 -112 q ${8 + k * 6} ${-20 - ph * 40} -4 ${-50 - ph * 70} q -10 -20 6 -46`} stroke="#C8C8D0" strokeWidth={5} fill="none" opacity={(1 - ph) * 0.7} strokeLinecap="round" />;
        })}
      </g>
    ))}
  </g>
);

// confetti meledak dari titik (k = frame sejak meledak)
export const Confetti: React.FC<{k: number; n?: number; spread?: number}> = ({k, n = 46, spread = 520}) => {
  if (k < 0 || k > 70) return null;
  const cols = ['#FF5F8A', '#F2C94C', '#7FD8F0', '#8FD36A', '#FFFFFF', '#C85AE8'];
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const a = rand(i * 3.1) * Math.PI * 2, v = (0.4 + rand(i * 7.3)) * spread;
        const p = 1 - Math.exp(-k / 10);
        const x = Math.cos(a) * v * p, y = Math.sin(a) * v * p * 0.8 - 60 * p + 0.06 * k * k;
        return <rect key={i} x={x} y={y} width={14} height={8} rx={2} fill={cols[i % cols.length]} transform={`rotate(${k * 18 + i * 40} ${x + 7} ${y + 4})`} opacity={clamp((70 - k) / 20)} />;
      })}
    </g>
  );
};

/* ---------------- ONE SHOT ---------------- */
// awan pink blur (hayalan) — siluet kabur ter-pixelate di dalamnya, sensor bar opsional
export const PinkCloud: React.FC<{s?: number; t: number; sensor?: boolean; badge?: boolean}> = ({s = 1, t, sensor = false, badge = false}) => {
  const id = useSid('pc');
  const bob = Math.sin(t * 0.08) * 6;
  return (
    <g transform={`translate(0,${bob}) scale(${s})`}>
      <defs><filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={10} /></filter></defs>
      <Halo rx={260} ry={190} color={PINK} op={0.35} />
      <g fill="#FFB3D0">
        {[[-110, 10, 90], [-30, -50, 110], [80, -20, 100], [120, 40, 80], [0, 50, 110], [-120, 70, 70]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>
      <g filter={`url(#${id}b)`} opacity={0.85}>
        <circle cx={-10} cy={-20} r={46} fill={PINK} /><ellipse cx={-10} cy={60} rx={70} ry={50} fill={PINK} />
      </g>
      {sensor && <rect x={-200} y={-12} width={400} height={44} fill="#0A0A10" />}
      {badge && (
        <g transform="translate(170,-110)"><circle r={42} fill="#E0262E" stroke="#FFFFFF" strokeWidth={6} />
          <text y={13} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF">18+</text></g>
      )}
      {[[-200, 120, 30], [-240, 190, 18]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#FFB3D0" />)}
    </g>
  );
};

// 3 bayangan "versi lain" dirinya di dinding: marah, melamun, tatapan kosong. show = [a,b,c] 0..1, dark 0..1
export const ShadowSelves: React.FC<{show: number[]; dark?: number; t: number}> = ({show, dark = 0, t}) => {
  const fill = mix('#4A1A22', '#0A0204', dark);
  return (
    <g>
      {[-200, 0, 200].map((x, i) => (
        <g key={i} opacity={clamp(show[i] ?? 0)} transform={`translate(${x},0)`}>
          <Silhouette x={0} y={0} scale={0.62} type="man" pose={i === 2 ? 'look' : 'stand'} fill={fill} rim="#FF3B3B" rimOp={0.5} seed={i + 4} t={t} />
          {i === 0 && <AngerSteam x={0} y={-430} s={0.9} t={t} color="#7A3A3A" />}
          {i === 1 && <g transform="translate(40,-470)"><PinkCloud s={0.35} t={t} /></g>}
          {i === 2 && <g transform="translate(0,-400)"><text textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#7A3A44">…</text></g>}
        </g>
      ))}
    </g>
  );
};

/* ---------------- EFEK 1 ---------------- */
// gelas di meja retak (crack 0..1)
export const GlassCrack: React.FC<{crack: number}> = ({crack}) => (
  <g>
    <Halo y={-120} rx={180} color="#FFC870" op={0.3} />
    <path d="M -90 -280 L 90 -280 L 70 0 L -70 0 Z" fill="#DDEBF8" opacity={0.2} />
    <path d="M -84 -170 L 84 -170 L 70 0 L -70 0 Z" fill="#F2A65A" opacity={0.55} />
    <path d="M -90 -280 L 90 -280 L 70 0 L -70 0 Z" fill="none" stroke="#F2F6FA" strokeWidth={6} />
    <rect x={-60} y={-260} width={10} height={220} rx={5} fill="#FFFFFF" opacity={0.3} />
    {crack > 0 && (
      <g stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinejoin="round">
        <path d="M 30 -280 L 10 -220 L 40 -180 L 0 -120 L 26 -60" pathLength={1} strokeDasharray={`${crack} 1`} />
        <path d="M 10 -220 L -40 -200 M 40 -180 L 76 -150 M 0 -120 L -50 -100" opacity={ramp(crack, 0.5, 1)} />
      </g>
    )}
  </g>
);

// HP baterai 0% + sinyal hilang, layar mati (off 0..1)
export const PhoneDead: React.FC<{off: number; t: number}> = ({off, t}) => {
  const w = 230, h = 440;
  const bl = off < 0.6 ? (Math.floor(t / 6) % 2 ? 1 : 0.3) : 0;
  return (
    <g>
      <Halo rx={260} ry={300} color="#FF3B3B" op={0.3 * (1 - off)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={36} fill="#15101A" />
      <rect x={-w / 2 + 16} y={-h / 2 + 20} width={w - 32} height={h - 40} rx={24} fill={mix('#3A0E1E', '#050507', off)} />
      <g opacity={1 - smooth(ramp(off, 0.6, 1))}>
        <rect x={-60} y={-40} width={110} height={56} rx={10} fill="none" stroke="#FFFFFF" strokeWidth={8} />
        <rect x={50} y={-24} width={12} height={24} rx={4} fill="#FFFFFF" />
        <rect x={-50} y={-30} width={10} height={36} rx={3} fill="#E0262E" opacity={bl} />
        <text y={70} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#E0262E">0%</text>
        <g transform="translate(-60,-150)">{[0, 1, 2, 3].map((k) => <rect key={k} x={k * 22} y={-k * 14} width={14} height={20 + k * 14} rx={3} fill="#5A5A66" />)}
          <path d="M -6 -60 L 90 20 M 90 -60 L -6 20" stroke="#E0262E" strokeWidth={8} strokeLinecap="round" /></g>
      </g>
    </g>
  );
};

// grafik mood jatuh bebas (drop 0..1)
export const MoodDrop: React.FC<{drop: number}> = ({drop}) => {
  const k = smooth(drop);
  return (
    <g>
      <rect x={-260} y={-260} width={520} height={420} rx={20} fill="#1A1420" opacity={0.85} />
      <text x={-230} y={-210} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F2EEE6">MOOD</text>
      <line x1={-220} y1={120} x2={220} y2={120} stroke="#5A5060" strokeWidth={4} />
      <path d={`M -220 -100 L -120 -110 L -40 -90 L 20 ${lerp(-100, 110, k)} L 200 ${lerp(-120, 130, k)}`} stroke={mix('#8FD36A', '#E0262E', k)} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <g transform={`translate(200,${lerp(-120, 130, k)})`}><path d="M -26 -20 L 0 20 L 26 -20 Z" fill="#E0262E" opacity={k} /></g>
    </g>
  );
};

// monster amigdala (bentuk almond merah) — mood: 'angry' bawa tagihan | 'eat' disuapi HP pakai sendok | 'calm' warna normal + perban
export const AmygdalaMonster: React.FC<{mood: 'angry' | 'eat' | 'calm'; t: number; bill?: number; spoon?: number; bandage?: number; calm?: number}> = ({
  mood, t, bill = 0, spoon = 0, bandage = 0, calm = 0,
}) => {
  const body = mix('#D8262E', '#F2B8A0', calm);
  const bob = Math.sin(t * 0.25) * 6 * (mood === 'angry' ? 1.6 : 1);
  const chew = mood === 'eat' ? Math.abs(Math.sin(t * 0.5)) : 0;
  return (
    <g transform={`translate(0,${bob})`}>
      <Halo rx={240} ry={220} color={mix('#FF3B3B', '#FFC870', calm)} op={0.35} />
      <path d="M 0 -170 C 120 -170 150 -40 120 60 C 90 150 -90 150 -120 60 C -150 -40 -120 -170 0 -170 Z" fill={body} />
      <path d="M -60 -140 C -30 -160 20 -160 50 -140" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.25} strokeLinecap="round" />
      {/* mata & alis */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 44},-50)`}>
          <ellipse rx={26} ry={calm > 0.5 ? 6 : 24} fill="#FFFFFF" /><circle cx={sd * -4} cy={2} r={calm > 0.5 ? 4 : 11} fill="#1A0A0A" />
          {calm < 0.5 && <rect x={-30} y={-46} width={60} height={12} rx={6} fill="#5A0A10" transform={`rotate(${sd * (mood === 'angry' ? 22 : 8)})`} />}
        </g>
      ))}
      {/* mulut */}
      {mood === 'angry' && <path d="M -46 40 Q 0 10 46 40 L 40 56 Q 0 34 -40 56 Z" fill="#3A0608" />}
      {mood === 'eat' && <ellipse cx={0} cy={44} rx={30} ry={10 + chew * 18} fill="#3A0608" />}
      {mood === 'calm' && <path d="M -36 40 Q 0 66 36 40" stroke="#5A1A14" strokeWidth={8} fill="none" strokeLinecap="round" />}
      {/* tangan */}
      <path d={`M -116 20 Q -170 ${mood === 'angry' ? -40 : 30} -190 ${mood === 'angry' ? -90 : 20}`} stroke={body} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M 116 20 Q 170 ${mood === 'angry' ? -40 : 30} 190 ${mood === 'angry' ? -90 : 20}`} stroke={body} strokeWidth={26} fill="none" strokeLinecap="round" />
      {mood === 'angry' && bill > 0 && (
        <g transform={`translate(200,-150) rotate(${10 + Math.sin(t * 0.6) * 6}) scale(${backOut(bill)})`}>
          <rect x={-70} y={-90} width={140} height={180} rx={6} fill="#FBF7EE" />
          <text y={-50} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#C0262E">TAGIHAN</text>
          {[0, 1, 2].map((k) => <rect key={k} x={-50} y={-20 + k * 30} width={100 - k * 20} height={10} rx={5} fill="#8A8F9A" opacity={0.6} />)}
          <text y={78} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#C0262E">PMO!</text>
        </g>
      )}
      {mood === 'eat' && spoon > 0 && (
        <g transform={`translate(${lerp(320, 70, smooth(spoon))},${lerp(-40, 30, smooth(spoon))}) rotate(-20)`}>
          <rect x={0} y={-8} width={220} height={16} rx={8} fill="#C9CED8" /><ellipse cx={-10} cy={0} rx={44} ry={30} fill="#DDE2EA" />
          <g transform="translate(-14,-20) rotate(20) scale(0.36)"><Phone18 w={110} glow={1} /></g>
        </g>
      )}
      {bandage > 0 && bandage < 1 && (
        <g transform={`translate(${30 + bandage * 140},${-120 - bandage * 160}) rotate(${-30 + bandage * 110})`} opacity={1 - smooth(ramp(bandage, 0.6, 1))}>
          <rect x={-70} y={-22} width={140} height={44} rx={20} fill="#E3C49B" /><rect x={-22} y={-18} width={44} height={36} rx={8} fill="#CDA77A" />
        </g>
      )}
      {mood === 'calm' && <Rise y={-60} w={260} h={240} n={8} seed={17} op={calm} t={t} />}
    </g>
  );
};

// kepala meledak ala bom kartun: asap + debu (tanpa korban). k = frame sejak ledakan
export const CartoonBlast: React.FC<{k: number}> = ({k}) => {
  if (k < 0 || k > 60) return null;
  const p = 1 - Math.exp(-k / 6), fade = clamp((60 - k) / 25);
  return (
    <g opacity={fade}>
      {k < 5 && <Halo rx={420} color="#FFF4E0" op={0.9} />}
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2, r = 80 + p * 180;
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.8 - p * 40} r={70 + rand(i) * 40} fill={i % 3 ? '#8A8490' : '#5A5460'} opacity={0.9} />;
      })}
      <circle r={120 + p * 60} fill="#B8B2BC" />
      {Array.from({length: 10}).map((_, i) => {
        const a = rand(i * 5) * Math.PI * 2, r = p * 380;
        return <rect key={'d' + i} x={Math.cos(a) * r} y={Math.sin(a) * r} width={16} height={10} fill="#3A3440" transform={`rotate(${k * 20 + i * 30} ${Math.cos(a) * r} ${Math.sin(a) * r})`} />;
      })}
      {[[-60, -30], [40, -50], [10, 30]].map(([x, y], i) => <text key={i} x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#2A2430" opacity={0.6}>✸</text>)}
    </g>
  );
};

// air tumpah dari gelas yang terguling di meja (p 0..1)
export const WaterSpill: React.FC<{p: number}> = ({p}) => {
  const k = smooth(p);
  return (
    <g>
      <g transform={`translate(-80,0) rotate(${k * -90} 0 0)`}>
        <path d="M -50 -170 L 50 -170 L 40 0 L -40 0 Z" fill="#DDEBF8" opacity={0.25} />
        <path d="M -50 -170 L 50 -170 L 40 0 L -40 0 Z" fill="none" stroke="#F2F6FA" strokeWidth={5} />
      </g>
      <ellipse cx={60 + k * 60} cy={6} rx={30 + k * 200} ry={8 + k * 18} fill="#7FC8FF" opacity={0.7} />
      {k > 0.2 && Array.from({length: 6}).map((_, i) => <circle key={i} cx={40 + i * 50 * k} cy={-10 - rand(i) * 30 * (1 - k)} r={6} fill="#9FD8FF" opacity={1 - k * 0.6} />)}
    </g>
  );
};

// folder kategori jadi abu-abu (gray 0..1) + otak pakai perisai (shield 0..1)
export const FoldersShield: React.FC<{gray: number; shield: number}> = ({gray, shield}) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const g = clamp(gray * 4 - i * 0.6);
      return (
        <g key={i} transform={`translate(${-210 + (i % 2) * 150},${-150 + Math.floor(i / 2) * 150})`}>
          <path d="M -60 -40 L -20 -40 L -8 -54 L 60 -54 L 60 50 L -60 50 Z" fill={mix(['#FF5F8A', '#C85AE8', '#FF8A2B', '#F2C94C'][i], '#5A5E68', g)} />
          <rect x={-40} y={-10} width={80} height={10} rx={5} fill="#FFFFFF" opacity={0.5 * (1 - g)} />
          {g > 0.9 && <text y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#2A2E36">BIASA</text>}
        </g>
      );
    })}
    <g transform="translate(200,0)">
      <g transform="scale(0.6)"><path d={CEREBRUM} fill="#F2B8C6" /></g>
      <g transform={`translate(-10,10) scale(${backOut(shield)})`} opacity={clamp(shield * 2)}>
        <path d="M 0 -150 L 120 -110 Q 120 40 0 140 Q -120 40 -120 -110 Z" fill="#7A8090" stroke="#C9CED8" strokeWidth={8} />
        <path d="M 0 -110 L 80 -82 Q 80 20 0 96" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.3} />
      </g>
    </g>
  </g>
);

// stempel "NORMAL" dicap di atas ikon tangan mengepal (simbolik) — p 0..1
export const StampNormal: React.FC<{p: number}> = ({p}) => {
  const k = clamp(p * 2);
  return (
    <g>
      <g fill="#C9A88A">
        <rect x={-110} y={-80} width={220} height={150} rx={50} />
        {[-75, -25, 25, 75].map((x) => <rect key={x} x={x - 26} y={-120} width={52} height={70} rx={24} />)}
        <rect x={-150} y={-30} width={70} height={90} rx={30} transform="rotate(-20 -115 15)" />
      </g>
      <rect x={-110} y={70} width={220} height={90} rx={20} fill="#8A6A50" />
      <g transform={`translate(0,${-30 + (1 - k) * -260}) rotate(-12) scale(${1 + (1 - k) * 0.8})`} opacity={k}>
        <rect x={-210} y={-60} width={420} height={120} rx={14} fill="none" stroke="#E0262E" strokeWidth={14} />
        <text y={28} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={86} fill="#E0262E" letterSpacing={6}>NORMAL</text>
      </g>
    </g>
  );
};

// noda merah menyebar ala virus (k 0..1)
export const RedInfection: React.FC<{k: number; seed?: number}> = ({k, seed = 3}) => (
  <g>
    {Array.from({length: 30}).map((_, i) => {
      const a = rand(seed + i * 2.3) * Math.PI * 2, d = rand(seed + i * 5.1) * 560 * k;
      const r = (18 + rand(i * 7) * 46) * clamp(k * 3 - rand(i) * 1.5);
      return r > 0 ? <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.7} r={r} fill={i % 3 ? '#B0141E' : '#E0262E'} opacity={0.55} /> : null;
    })}
  </g>
);

/* ---------------- EFEK 2 ---------------- */
export const BigQuestion: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g transform={`scale(${backOut(p)}) rotate(${Math.sin(t * 0.15) * 5})`} opacity={clamp(p * 3)}>
    <Halo rx={240} color="#F5FF3B" op={0.3} />
    <text y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={380} fill="#F5FF3B" stroke="#15101A" strokeWidth={10}>?</text>
  </g>
);

// maskot otak tengah merah mengangkat barbel (buff 0..1 badan membesar)
export const MidbrainLift: React.FC<{buff: number; t: number}> = ({buff, t}) => {
  const lift = Math.max(0, Math.sin(t * 0.18)) * 60;
  return (
    <g>
      <Halo rx={260} ry={240} color="#FF3B3B" op={0.3} />
      <g transform={`scale(${1 + buff * 0.35})`}><MidbrainMascot s={1.4} mood="buff" buff={buff} squash={lift / 400} /></g>
      <g transform={`translate(0,${-200 - lift - buff * 60})`}>
        <rect x={-230} y={-10} width={460} height={20} rx={10} fill="#5A5258" />
        {[-230, -190, 190, 230].map((x, i) => <rect key={i} x={x - 18} y={i % 3 === 0 ? -60 : -46} width={36} height={i % 3 === 0 ? 120 : 92} rx={10} fill="#2A2228" />)}
      </g>
    </g>
  );
};

// gua batu dengan gambar dinding kuno + maskot di dalam
export const CaveScene: React.FC<{t: number}> = ({t}) => (
  <g>
    <path d="M -320 160 L -320 -60 Q -300 -300 0 -320 Q 300 -300 320 -60 L 320 160 Z" fill="#5A4A40" />
    <path d="M -240 160 L -240 -40 Q -220 -230 0 -240 Q 220 -230 240 -40 L 240 160 Z" fill="#2A2018" />
    {/* lukisan dinding */}
    <g stroke="#C9783A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85}>
      <path d="M -170 -120 l 0 50 m 0 -50 l -16 26 m 16 -26 l 16 26 m -16 24 l -14 28 m 14 -28 l 14 28" />
      <circle cx={-170} cy={-134} r={12} />
      <path d="M -60 -150 q 40 -30 90 0 l 0 30 q -45 14 -90 0 Z M -50 -120 l -6 34 m 76 -34 l 6 34" />
      <path d="M 120 -110 q 30 -40 60 0" /><circle cx={150} cy={-150} r={14} />
    </g>
    <g transform="translate(0,90)"><MidbrainMascot s={1.1} mood="derp" look={Math.sin(t * 0.05)} /></g>
  </g>
);

// paha ayam + sarang dengan telur
export const FoodNest: React.FC = () => (
  <g>
    <g transform="translate(-160,0) rotate(-20)">
      <Halo rx={130} color="#FFC870" op={0.3} />
      <path d="M -40 -110 C 60 -150 110 -40 50 30 C 10 70 -70 40 -80 -20 C -86 -60 -70 -96 -40 -110 Z" fill="#C8782E" />
      <path d="M -30 -90 C 20 -110 60 -60 40 -20" stroke="#E8A050" strokeWidth={12} fill="none" opacity={0.6} />
      <rect x={30} y={30} width={26} height={90} rx={12} fill="#F2E8D8" transform="rotate(-30 43 75)" />
      <circle cx={88} cy={110} r={20} fill="#F2E8D8" /><circle cx={70} cy={124} r={18} fill="#F2E8D8" />
    </g>
    <g transform="translate(170,40)">
      <Halo rx={140} color="#FFE7B0" op={0.25} />
      <ellipse cx={0} cy={30} rx={150} ry={50} fill="#7A5A3A" />
      {Array.from({length: 14}).map((_, i) => <path key={i} d={`M ${-140 + i * 20} ${30 + rand(i) * 20} q 20 -30 40 0`} stroke="#A07A4E" strokeWidth={6} fill="none" />)}
      {[-50, 0, 50].map((x, i) => <ellipse key={i} cx={x} cy={0 - (i === 1 ? 10 : 0)} rx={30} ry={40} fill="#F8F2E6" />)}
    </g>
  </g>
);

// jungkat-jungkit: otak tengah merah (kiri) turun berat, PFC emas (kanan) terangkat & meredup. tilt 0..1
export const Seesaw: React.FC<{tilt: number; t: number}> = ({tilt, t}) => {
  const a = 16 * smooth(tilt);
  const L = {x: -260 * Math.cos((a * Math.PI) / 180), y: 260 * Math.sin((a * Math.PI) / 180)};
  return (
    <g>
      <path d="M -60 120 L 60 120 L 0 20 Z" fill="#6A5A4A" />
      <g transform={`translate(0,20) rotate(${a})`}>
        <rect x={-300} y={-14} width={600} height={28} rx={10} fill="#8A6A4E" />
      </g>
      <g transform={`translate(${L.x},${20 + L.y - 110})`}><MidbrainMascot s={1.0} mood="buff" buff={0.8} /></g>
      <g transform={`translate(${-L.x},${20 - L.y - 100})`}>
        <Halo rx={120} color="#FFD166" op={0.6 * (1 - tilt * 0.8)} />
        <g transform="scale(0.36)"><path d={CEREBRUM} fill={mix('#FFD166', '#7A6A50', tilt * 0.7)} /></g>
        <text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#3A2A10">PFC</text>
      </g>
    </g>
  );
};

// PFC emas dengan pedal rem + timbangan kecil (logika & pertimbangan)
export const PfcBrake: React.FC<{t: number; on?: number}> = ({t, on = 1}) => (
  <g>
    <Halo rx={300} ry={220} color="#FFD166" op={0.4 * on} />
    <g transform="scale(0.85)"><path d={CEREBRUM} fill="#F2B8C6" /><path d="M -205 18 C -220 -62 -162 -146 -60 -156 L -80 100 C -120 100 -200 60 -205 18 Z" fill="#FFD166" /></g>
    <text x={-120} y={0} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#5A3A10">PFC</text>
    <g transform="translate(-300,140) rotate(-12)">
      <rect x={-50} y={-16} width={100} height={36} rx={8} fill="#3A3E48" /><rect x={-6} y={-90} width={12} height={80} fill="#7A808C" />
      <text y={60} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">REM</text>
    </g>
    <g transform={`translate(260,120) rotate(${Math.sin(t * 0.1) * 6})`}>
      <rect x={-6} y={-90} width={12} height={90} fill="#B8963E" />
      <line x1={-80} y1={-90} x2={80} y2={-90} stroke="#D9B46A" strokeWidth={8} />
      {[-80, 80].map((x) => <path key={x} d={`M ${x - 34} -50 Q ${x} -26 ${x + 34} -50 Z`} fill="#D9B46A" />)}
    </g>
  </g>
);

// kaca berembun di depan wajah (layar), fog 0..1 — dipasang di koordinat layar
export const FoggyGlass: React.FC<{fog: number; t: number}> = ({fog, t}) => {
  const id = useSid('fg');
  return (
    <g opacity={fog}>
      <defs><filter id={`${id}`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={2} seed={4} /><feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0 0.95  0 0 0 0.9 0" /></filter></defs>
      <rect x={0} y={0} width={1080} height={1920} filter={`url(#${id})`} opacity={0.32} />
      <rect x={0} y={0} width={1080} height={1920} fill="#DDE6F0" opacity={0.18} />
      {Array.from({length: 8}).map((_, i) => {
        const x = 100 + rand(i) * 880, ph = ((t * 0.01 + rand(i * 3)) % 1);
        return <path key={i} d={`M ${x} 300 L ${x + 4} ${300 + ph * 900}`} stroke="#FFFFFF" strokeWidth={6} opacity={0.35} strokeLinecap="round" />;
      })}
    </g>
  );
};

// arus air merah (mengalir ke kanan) — t frame
export const RedCurrent: React.FC<{t: number; w?: number}> = ({t, w = 1100}) => (
  <g>
    {[0, 1, 2, 3].map((k) => {
      const pts = Array.from({length: 24}).map((_, i) => { const x = -w / 2 + (i / 23) * w; return `${x},${Math.sin(i * 0.8 - t * 0.25 + k) * 14 + k * 30}`; }).join(' L ');
      return <path key={k} d={`M ${pts} L ${w / 2} 160 L ${-w / 2} 160 Z`} fill={['#E0262E', '#C0141E', '#A00C16', '#7A0810'][k]} opacity={0.75} />;
    })}
    {Array.from({length: 8}).map((_, i) => { const x = ((t * 9 + i * 140) % w) - w / 2; return <path key={i} d={`M ${x} ${20 + (i % 3) * 30} q 30 -14 60 0`} stroke="#FFB3B8" strokeWidth={5} fill="none" opacity={0.6} />; })}
  </g>
);

// garis batas merah di lantai + rambu peringatan (p 0..1)
export const BoundarySign: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g>
    <line x1={0} y1={0} x2={0} y2={0} />
    <rect x={-8} y={-40} width={16} height={Math.max(0, 60 * p)} fill="#E0262E" />
    <path d={`M -300 0 L ${-300 + 600 * smooth(p)} 0`} stroke="#E0262E" strokeWidth={12} strokeDasharray="34 22" />
    <g transform={`translate(0,-340) scale(${backOut(ramp(p, 0.3, 0.8))})`}>
      <rect x={-8} y={0} width={16} height={300} fill="#5A5A66" />
      <Halo y={-80} rx={170} color="#FF3B3B" op={0.35 + 0.15 * Math.sin(t * 0.3)} />
      <path d="M 0 -200 L 140 40 L -140 40 Z" fill="#F2C94C" stroke="#15101A" strokeWidth={10} strokeLinejoin="round" />
      <text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={140} fill="#15101A">!</text>
    </g>
  </g>
);

// rambu peringatan berubah jadi dokumen (k 0..1)
export const SignToDoc: React.FC<{k: number}> = ({k}) => (
  <g>
    <g opacity={1 - smooth(k)} transform={`scale(${1 - k * 0.3})`}>
      <path d="M 0 -200 L 160 70 L -160 70 Z" fill="#F2C94C" stroke="#15101A" strokeWidth={10} strokeLinejoin="round" />
      <text y={40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={150} fill="#15101A">!</text>
    </g>
    <g opacity={smooth(k)} transform={`scale(${0.7 + 0.3 * smooth(k)})`}>
      <Halo rx={240} ry={300} color="#FFF4E0" op={0.4} />
      <rect x={-170} y={-230} width={340} height={440} rx={8} fill="#FBF7EE" />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={-130} y={-180 + i * 46} width={260 - (i % 3) * 50} height={14} rx={7} fill="#8A8F9A" opacity={0.6} />)}
    </g>
  </g>
);

/* ---------------- EFEK 3 ---------------- */
// gear di kepala macet & berasap (jam 0..1)
export const JammedGears: React.FC<{t: number; jam: number}> = ({t, jam}) => {
  const sp = (1 - jam) * 2 + jam * Math.sin(t * 2) * 0.4;
  const gear = (R: number, n: number, rot: number, col: string) => (
    <g transform={`rotate(${rot})`}>
      {Array.from({length: n}).map((_, i) => <rect key={i} x={-R * 0.16} y={-R - 18} width={R * 0.32} height={36} rx={6} fill={col} transform={`rotate(${(i / n) * 360})`} />)}
      <circle r={R} fill={col} /><circle r={R * 0.35} fill="#2A2E36" />
    </g>
  );
  return (
    <g>
      <g transform="translate(-90,30)">{gear(110, 10, t * sp, '#8A94A4')}</g>
      <g transform="translate(110,-60)">{gear(80, 8, -t * sp * 1.37 + 12, '#A0AABA')}</g>
      <g transform="translate(130,120)">{gear(60, 7, -t * sp * 1.8, '#7A8494')}</g>
      {jam > 0.3 && <AngerSteam x={20} y={-150} s={1.1} t={t} color="#9AA2AE" />}
      {jam > 0.5 && <path d="M 20 -20 L 60 -60" stroke="#FF8A2B" strokeWidth={6} opacity={Math.abs(Math.sin(t * 0.7))} />}
    </g>
  );
};

// otak lepek + baterai merah + keringat
export const TiredBrain: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={300} ry={220} color="#BFD4FF" op={0.25} />
    <g transform={`scale(0.95,${0.85 + Math.sin(t * 0.1) * 0.02})`}><path d={CEREBRUM} fill="#C8A6B4" /><path d={CEREBRUM} fill="none" stroke="#8A6A7A" strokeWidth={6} /></g>
    {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 60 - 26} -10 Q ${sd * 60} 4 ${sd * 60 + 26} -10`} stroke="#4A3A44" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    <path d="M -30 50 Q 0 40 30 50" stroke="#4A3A44" strokeWidth={8} fill="none" strokeLinecap="round" />
    {[0, 1].map((i) => { const ph = ((t * 0.03 + i * 0.5) % 1); return <path key={i} d={`M ${160 + i * 30} ${-120 + ph * 120} q 10 16 0 24 q -10 -8 0 -24 Z`} fill="#9FD8FF" opacity={1 - ph} />; })}
    <g transform="translate(0,-230)">
      <rect x={-90} y={-36} width={180} height={72} rx={14} fill="none" stroke="#FFFFFF" strokeWidth={8} />
      <rect x={90} y={-14} width={14} height={28} rx={4} fill="#FFFFFF" />
      <rect x={-78} y={-24} width={34} height={48} rx={6} fill="#E0262E" opacity={Math.floor(t / 8) % 2 ? 1 : 0.4} />
    </g>
  </g>
);

// lensa kamera yang nggak bisa fokus: gambar di dalamnya blur-tajam-blur
export const CameraLens: React.FC<{t: number}> = ({t}) => {
  const id = useSid('cl');
  const b = Math.abs(Math.sin(t * 0.09)) * 10;
  return (
    <g>
      <defs>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={b} /></filter>
        <clipPath id={`${id}c`}><circle r={170} /></clipPath>
      </defs>
      <circle r={240} fill="#1A1E26" /><circle r={210} fill="#2A2E36" stroke="#5A606C" strokeWidth={10} />
      {Array.from({length: 24}).map((_, i) => <rect key={i} x={-4} y={-238} width={8} height={22} fill="#4A505C" transform={`rotate(${i * 15 + t * 2})`} />)}
      <g clipPath={`url(#${id}c)`}>
        <rect x={-170} y={-170} width={340} height={340} fill="#BFD4E8" />
        <g filter={`url(#${id}b)`}>
          <circle cx={-40} cy={-20} r={44} fill="#6A7A8A" /><rect x={-90} y={30} width={100} height={140} rx={30} fill="#6A7A8A" />
          <rect x={40} y={-60} width={90} height={60} rx={10} fill="#B07A4E" />
        </g>
      </g>
      <circle r={170} fill="none" stroke="#7FD8F0" strokeWidth={4} opacity={0.6} />
      <path d="M -110 -100 Q -80 -130 -40 -140" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
    </g>
  );
};

// kertas catatan berhamburan kena angin (t frame lokal)
export const FlyingNotes: React.FC<{t: number}> = ({t}) => (
  <g>
    {Array.from({length: 9}).map((_, i) => {
      const ph = clamp(t / 50 - i * 0.05);
      const x = -200 + i * 40 + ph * (300 + rand(i) * 300), y = 60 - ph * (200 + rand(i * 3) * 220) + Math.sin(ph * 8 + i) * 30;
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${ph * (200 + i * 40)})`}>
          <rect x={-60} y={-44} width={120} height={88} rx={4} fill={i % 3 ? '#FBF7EE' : '#F2E8A0'} />
          {[0, 1, 2].map((k) => <rect key={k} x={-44} y={-24 + k * 20} width={88 - k * 16} height={7} rx={3} fill="#8A8F9A" opacity={0.6} />)}
        </g>
      );
    })}
  </g>
);

// bubble bicara kosong "..."
export const EmptyBubble: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g transform={`scale(${backOut(p)})`} opacity={clamp(p * 3)}>
    <ellipse rx={200} ry={130} fill="#FFFFFF" /><path d="M -60 110 L -110 190 L -10 124 Z" fill="#FFFFFF" />
    {[-60, 0, 60].map((x, i) => <circle key={i} cx={x} cy={0} r={20} fill="#5A606C" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 0.25 - i))} />)}
  </g>
);

// awan hitam + beban di pundak (k 0..1 turun)
export const BurdenCloud: React.FC<{k: number; t: number}> = ({k, t}) => (
  <g>
    <g transform={`translate(0,${-260 + Math.sin(t * 0.1) * 6})`}>
      {[[-90, 0, 80], [0, -30, 100], [90, 0, 80], [0, 30, 90]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#2A2834" />)}
      {[0, 1, 2].map((i) => { const ph = ((t * 0.05 + i / 3) % 1); return <line key={i} x1={-60 + i * 60} y1={80 + ph * 80} x2={-66 + i * 60} y2={100 + ph * 80} stroke="#5A6A8A" strokeWidth={5} opacity={1 - ph} />; })}
    </g>
    <g transform={`translate(0,${lerp(-180, 0, smooth(k))})`}>
      <path d="M -150 0 C -170 -90 -100 -150 0 -150 C 100 -150 170 -90 150 0 C 120 50 -120 50 -150 0 Z" fill="#4A4450" />
      <text y={-50} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={42} fill="#8A8494">BEBAN</text>
    </g>
  </g>
);

// pilar "PD" terkikis jadi pasir (erode 0..1)
export const PillarPD: React.FC<{erode: number; t: number}> = ({erode, t}) => {
  const h = lerp(420, 120, smooth(erode));
  return (
    <g>
      <Halo y={-200} rx={220} ry={280} color="#FFE7B0" op={0.3} />
      <path d={`M -170 0 Q 0 ${-40 - erode * 80} 170 0 Z`} fill="#C9A86A" />
      <rect x={-100} y={-h} width={200} height={h} fill="#D9C8A4" />
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-100 + rand(i) * 200} ${-h} l ${(rand(i * 3) - 0.5) * 30} ${20 + rand(i) * 30}`} stroke="#B89A6A" strokeWidth={4} />)}
      <rect x={-120} y={-h - 30} width={240} height={34} rx={6} fill="#C9B88E" />
      <text y={-h + 90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={88} fill="#6A5A3A" opacity={1 - erode * 0.6}>PD</text>
      {erode > 0.05 && Array.from({length: 22}).map((_, i) => {
        const ph = ((t * 0.03 + rand(i)) % 1);
        return <circle key={i} cx={-100 + rand(i * 5) * 200} cy={-h + ph * h} r={4} fill="#C9A86A" opacity={(1 - ph) * erode} />;
      })}
    </g>
  );
};

// close-up mata dengan pupil kosong (nggak fokus)
export const EyeCloseup: React.FC<{t: number}> = ({t}) => {
  const dx = Math.sin(t * 0.03) * 10;
  return (
    <g>
      <path d="M -420 0 Q 0 -260 420 0 Q 0 220 -420 0 Z" fill="#F1C9A5" />
      <path d="M -360 0 Q 0 -200 360 0 Q 0 170 -360 0 Z" fill="#FFFFFF" />
      <circle cx={dx} cy={10} r={120} fill="#5A4030" opacity={0.85} />
      <circle cx={dx} cy={10} r={58} fill="#3A2A24" opacity={0.7} />
      <circle cx={dx + 40} cy={-30} r={14} fill="#FFFFFF" opacity={0.25} />
      <path d="M -380 -10 Q 0 -250 380 -10" stroke="#241418" strokeWidth={16} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ---------------- PENUTUP ---------------- */
// 3 ikon otak retak (dari slot) — glow merah lalu pecah jadi serpihan (k 0..1), off 0..1 lampu mati
export const ClosingBrains: React.FC<{k: number; off: number}> = ({k, off}) => (
  <g opacity={1 - off}>
    {[-200, 0, 200].map((x, i) => {
      const br = smooth(ramp(k, 0.45 + i * 0.05, 0.85));
      return (
        <g key={i} transform={`translate(${x},0)`}>
          <Halo rx={140} color="#FF3B3B" op={0.6 * (1 - br)} />
          {br < 0.05 ? (
            <g>
              <g transform="scale(0.42)"><path d={CEREBRUM} fill="#3A1A22" stroke="#FF3B3B" strokeWidth={10} /></g>
              <path d="M -10 -70 L 6 -30 L -14 0 L 8 30 L -4 60" stroke="#FF6A6A" strokeWidth={8} fill="none" />
            </g>
          ) : (
            Array.from({length: 10}).map((_, j) => {
              const a = rand(j + i * 11) * Math.PI * 2, d = br * (80 + rand(j * 3) * 160);
              return <path key={j} d="M 0 0 L 30 -6 L 18 22 Z" fill={j % 2 ? '#3A1A22' : '#FF3B3B'} transform={`translate(${Math.cos(a) * d},${Math.sin(a) * d + br * br * 120}) rotate(${br * 300 + j * 40})`} opacity={1 - br * 0.7} />;
            })
          )}
        </g>
      );
    })}
  </g>
);

