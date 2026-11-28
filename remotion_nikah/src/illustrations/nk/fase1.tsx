// Ilustrasi BARU — FASE 1 (apartemen malam). Semua dinamis (t = frame); parameter k = progres aksi 0..1 dari scene.
import React from 'react';
import {rand} from '../../theme';
import {useSid} from '../../components/Phone';
import {HandsetNk} from './shared';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };

/* ---------- kotak tisu kubus bermotif garis, selembar tisu bergoyang ---------- */
export const TissueCube: React.FC<{t: number; s?: number}> = ({t, s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -60 -40 L 60 -40 L 80 -60 L -40 -60 Z" fill="#D9DEE8" />
    <rect x={-60} y={-40} width={120} height={90} fill="#C2C9D6" />
    <path d="M 60 -40 L 80 -60 L 80 30 L 60 50 Z" fill="#A6AEBE" />
    {[0, 1, 2].map((i) => <line key={i} x1={-60} y1={-20 + i * 26} x2={60} y2={-20 + i * 26} stroke="#9AA4B8" strokeWidth={4} />)}
    <ellipse cx={10} cy={-50} rx={22} ry={6} fill="#4A5060" />
    <path d={`M 0 -52 Q ${-14 + Math.sin(t * 0.12) * 8} -96 ${8 + Math.sin(t * 0.12) * 12} -118 Q 26 -90 22 -52 Z`} fill="#FFFFFF" />
  </g>
);

/* ---------- jembatan kayu kecil penghubung suami-istri; papan jatuh satu-satu ke jurang gelap ---------- */
export const PlankBridge: React.FC<{t: number; k?: number; w?: number}> = ({t, k = 0, w = 640}) => {
  const N = 9, span = w - 160;
  return (
    <g>
      {/* jurang + tebing */}
      <ellipse cx={0} cy={200} rx={span / 2 + 40} ry={160} fill="#05030A" opacity={0.9} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M ${sd * (w / 2 + 40)} 0 L ${sd * (span / 2)} 0 L ${sd * (span / 2 - 30)} 120 L ${sd * (span / 2 + 10)} 260 L ${sd * (w / 2 + 40)} 300 Z`} fill="#2A1E30" />
      ))}
      {/* tali */}
      {[-10, -70].map((yy, j) => <path key={j} d={`M ${-span / 2} ${yy} Q 0 ${yy + 40 + k * 30} ${span / 2} ${yy}`} stroke="#B08A5A" strokeWidth={6} fill="none" />)}
      {[-1, 1].map((sd) => <rect key={sd} x={sd * span / 2 - 8} y={-90} width={16} height={100} rx={4} fill="#8A6A44" />)}
      {Array.from({length: N}).map((_, i) => {
        const x = -span / 2 + (i + 0.5) * (span / N);
        const order = [4, 3, 5, 2, 6, 1, 7, 0, 8].indexOf(i);
        const d = clamp((k - order / N * 0.9) / 0.18);
        const sag = Math.sin(((i + 0.5) / N) * Math.PI) * (36 + k * 26);
        const y = sag + d * d * 520;
        return (
          <g key={i} transform={`translate(${x + d * (i - 4) * 10},${y}) rotate(${d * (i % 2 ? 70 : -60) + Math.sin(t * 0.2 + i) * 1.5})`} opacity={1 - clamp((d - 0.6) / 0.4)}>
            <rect x={-span / N / 2 + 3} y={-8} width={span / N - 6} height={16} rx={3} fill={i % 2 ? '#B0814E' : '#9C7044'} />
            <line x1={-span / N / 2 + 8} y1={-2} x2={span / N / 2 - 8} y2={-2} stroke="#7A5634" strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/* ---------- HP memancarkan cahaya proyektor + hologram siluet pink blur ter-pixelate (kepala-bahu). nod = angguk boneka per ---------- */
export const HoloProjector: React.FC<{t: number; k?: number; nod?: number}> = ({t, k = 1, nod = 0}) => {
  const id = useSid('hp');
  const bob = nod * Math.sin(t * 0.55) * 14, tilt = nod * Math.sin(t * 0.55 + 0.6) * 10;
  const px = 14;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF6AC0" stopOpacity={0.55} /><stop offset="1" stopColor="#FF6AC0" stopOpacity={0} /></linearGradient>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={3.2} /></filter>
      </defs>
      {/* HP tergeletak (perspektif) */}
      <g transform="translate(0,170) scale(1,0.42)"><HandsetNk t={t} w={140} h={260} badge={0} color="#FF4FA8" /></g>
      {/* kerucut cahaya */}
      <path d={`M -40 160 L 40 160 L ${180 * k} ${-230} L ${-180 * k} ${-230} Z`} fill={`url(#${id}c)`} opacity={0.9 * k} />
      {Array.from({length: 6}).map((_, i) => {
        const ph = (t * 0.02 + i / 6) % 1;
        return <circle key={i} cx={(rand(i) - 0.5) * 200 * ph} cy={150 - ph * 380} r={3} fill="#FFD0EC" opacity={(1 - ph) * k} />;
      })}
      {/* per (spring) di bawah hologram saat mengangguk */}
      {nod > 0.05 && <path d={`M 0 140 ${Array.from({length: 7}).map((_, i) => `L ${i % 2 ? 16 : -16} ${130 - i * (12 + bob * 0.08)}`).join(' ')} L 0 ${44 + bob}`} stroke="#FFD0EC" strokeWidth={4} fill="none" opacity={nod} />}
      {/* hologram ter-pixelate */}
      <g transform={`translate(0,${-60 + bob}) rotate(${tilt} 0 80)`} opacity={k}>
        <g filter={`url(#${id}b)`}>
          {Array.from({length: 12}).map((_, j) => Array.from({length: 13}).map((__, i) => {
            const x = (i - 6) * px, y = -120 + j * px;
            const head = Math.hypot(x / 48, (y + 60) / 58) < 1;
            const sh = y > 0 && Math.abs(x) < 40 + (y) * 1.1;
            if (!head && !sh) return null;
            const a = 0.45 + 0.45 * rand(i * 5 + j * 11 + Math.floor(t / 4));
            return <rect key={`${i}-${j}`} x={x - px / 2 + 1} y={y - px / 2 + 1} width={px - 2} height={px - 2} fill={head ? '#FF9AD8' : '#FF6AC0'} opacity={a} />;
          }))}
        </g>
        {/* garis scan hologram */}
        {[0, 1, 2].map((i) => <rect key={i} x={-90} y={-130 + ((t * 2 + i * 60) % 190)} width={180} height={3} fill="#FFFFFF" opacity={0.3} />)}
        {/* sensor bar */}
        <rect x={-70} y={-96} width={140} height={20} fill="#050507" opacity={0.92} />
      </g>
    </g>
  );
};

/* ---------- roda putar berisi kartu-kartu siluet blur, berputar cepat lalu berhenti acak ---------- */
export const SpinWheel: React.FC<{t: number; ang: number}> = ({t, ang}) => {
  const id = useSid('sw');
  const N = 8, R = 230;
  const tick = Math.sin(((ang % (360 / N)) / (360 / N)) * Math.PI) * 18;
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={4} /></filter></defs>
      <rect x={-14} y={R - 20} width={28} height={200} fill="#3A2A44" />
      <path d={`M -120 ${R + 180} L 120 ${R + 180} L 80 ${R + 120} L -80 ${R + 120} Z`} fill="#3A2A44" />
      <circle r={R + 18} fill="#2A1830" stroke="#E8B0D8" strokeWidth={10} />
      {Array.from({length: 24}).map((_, i) => <circle key={i} cx={Math.cos((i / 24) * Math.PI * 2) * (R + 4)} cy={Math.sin((i / 24) * Math.PI * 2) * (R + 4)} r={6}
        fill="#FFE3A0" opacity={0.5 + 0.5 * Math.sin(t * 0.6 + i)} />)}
      <g transform={`rotate(${ang})`}>
        {Array.from({length: N}).map((_, i) => {
          const a = (i / N) * 360;
          return (
            <g key={i} transform={`rotate(${a})`}>
              <path d={`M 0 0 L ${R * Math.sin(Math.PI / N)} ${-R * Math.cos(Math.PI / N)} A ${R} ${R} 0 0 0 ${-R * Math.sin(Math.PI / N)} ${-R * Math.cos(Math.PI / N)} Z`}
                fill={i % 2 ? '#5A2050' : '#7A2A66'} stroke="#2A1830" strokeWidth={4} />
              <g transform={`translate(0,${-R * 0.62})`}>
                <rect x={-34} y={-46} width={68} height={92} rx={8} fill="#FFE6F4" />
                <g filter={`url(#${id}b)`}><circle cx={0} cy={-12} r={16} fill="#FF7AC0" /><path d="M -26 40 Q 0 0 26 40 Z" fill="#FF7AC0" /></g>
              </g>
            </g>
          );
        })}
      </g>
      <circle r={34} fill="#E8B0D8" /><circle r={16} fill="#2A1830" />
      {/* penunjuk berdetak */}
      <g transform={`translate(0,${-R - 30}) rotate(${-tick})`}><path d="M -20 -26 L 20 -26 L 0 30 Z" fill="#FFD166" stroke="#5A3A10" strokeWidth={4} /></g>
    </g>
  );
};

/* ---------- antena radar kecil (dipasang di atas kepala suami): sinyal melemah sampai hilang ---------- */
export const RadarDish: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const str = 1 - k;
  const sweep = Math.sin(t * 0.08) * 25 * (0.3 + str);
  return (
    <g>
      <rect x={-6} y={-60} width={12} height={60} fill="#8A90A0" />
      <g transform={`translate(0,-64) rotate(${sweep})`}>
        <path d="M -54 -10 Q 0 40 54 -10 Z" fill="#C9CED8" />
        <line x1={0} y1={6} x2={0} y2={-40} stroke="#8A90A0" strokeWidth={4} />
        <circle cx={0} cy={-42} r={6} fill={str > 0.15 ? '#5AF0A0' : '#5A6070'} opacity={0.5 + 0.5 * Math.sin(t * 0.5)} />
        {[0, 1, 2].map((i) => {
          const ph = (t * 0.04 + i / 3) % 1;
          return <path key={i} d={`M ${-30 - ph * 80} ${-60 - ph * 60} Q 0 ${-90 - ph * 100} ${30 + ph * 80} ${-60 - ph * 60}`} stroke="#5AF0A0" strokeWidth={5} fill="none"
            opacity={(1 - ph) * str} strokeDasharray={str < 0.5 ? '10 12' : undefined} />;
        })}
      </g>
      {/* indikator sinyal 4 bar */}
      <g transform="translate(80,-40)">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 16} y={-i * 12} width={11} height={14 + i * 12} rx={3} fill={str * 4 > i + 0.3 ? '#5AF0A0' : '#3A3F4E'} />)}
        {str < 0.12 && <path d="M -6 -50 L 62 10 M 62 -50 L -6 10" stroke="#FF4A5A" strokeWidth={6} strokeLinecap="round" />}
      </g>
    </g>
  );
};

/* ---------- gelombang suara dari istri (kanan) menabrak headphone suami (kiri) -> berubah jadi garis datar ---------- */
export const WaveToFlat: React.FC<{t: number; len?: number; k?: number}> = ({t, len = 460, k = 1}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80, x = len / 2 - u * len;
    const amp = 46 * sm((u - 0.0) / 0.15) * (1 - sm((u - 0.55) / 0.25)) * k;
    pts.push(`${x.toFixed(1)},${(Math.sin(u * 24 - t * 0.5) * amp).toFixed(1)}`);
  }
  return (
    <g>
      <polyline points={pts.join(' ')} stroke="#FFC6DA" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.join(' ')} stroke="#FF6FA8" strokeWidth={16} fill="none" opacity={0.18} />
      {/* titik tabrakan: percik kecil */}
      <g transform={`translate(${-len * 0.08},0)`} opacity={0.6 + 0.4 * Math.sin(t * 0.7)}>
        {[0, 60, 120, 180, 240, 300].map((r) => <line key={r} x1={10} y1={0} x2={22} y2={0} stroke="#FFFFFF" strokeWidth={3} transform={`rotate(${r + t * 2})`} />)}
      </g>
      <text x={-len / 2 + 20} y={-24} fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#9AA4B8" opacity={0.8}>— — —</text>
    </g>
  );
};

/* ---------- daftar tugas di pintu kulkas: kotak "ISTRI" dicentang otomatis seperti mesin ---------- */
export const FridgeChecklist: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const items = ['KERJA', 'MAIN HP', 'ISTRI', 'TIDUR'];
  return (
    <g>
      <rect x={-190} y={-250} width={380} height={500} rx={10} fill="#FFF8E6" transform="rotate(-2)" />
      <circle cx={0} cy={-246} r={20} fill="#E8203A" /><circle cx={-6} cy={-252} r={6} fill="#FF8A96" />
      <text x={0} y={-180} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#3A3F4E" transform="rotate(-2)">TO DO</text>
      {items.map((s, i) => {
        const y = -110 + i * 92, done = i !== 2 ? 1 : sm(k);
        return (
          <g key={s} transform="rotate(-2)">
            <rect x={-150} y={y - 26} width={52} height={52} rx={8} fill="none" stroke="#5A6170" strokeWidth={5} />
            <text x={-80} y={y + 14} fontFamily="Poppins" fontWeight={800} fontSize={38} fill={i === 2 ? '#C62F3E' : '#3A3F4E'}>{s}</text>
            {done > 0 && <path d={`M ${-142} ${y} l 16 18 l 30 -40`} stroke={i === 2 ? '#C62F3E' : '#5A6170'} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={`${done} 1`} />}
            {i === 2 && <rect x={-162} y={y - 38} width={330} height={76} rx={12} fill="none" stroke="#FF5FB0" strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(t * 0.3)} />}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- label harga / barcode menempel di BAYANGAN istri di dinding, lalu di-scan ---------- */
export const ShadowPriceTag: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const id = useSid('sp');
  const scan = (t % 40) / 40;
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={6} /></filter></defs>
      {/* bayangan istri berhijab di dinding */}
      <g filter={`url(#${id}b)`} opacity={0.75}>
        <ellipse cx={0} cy={-150} rx={92} ry={104} fill="#0A050C" />
        <path d="M -120 -80 Q -170 100 -150 330 L 150 330 Q 170 100 120 -80 Z" fill="#0A050C" />
      </g>
      {/* label harga bertali */}
      <g transform={`translate(70,${-20 + (1 - sm(k * 2)) * -60}) rotate(${-14 + Math.sin(t * 0.12) * 4})`} opacity={sm(k * 2)}>
        <line x1={-60} y1={-80} x2={0} y2={-46} stroke="#E8DCC6" strokeWidth={3} />
        <path d="M -60 -40 L 60 -40 L 90 0 L 60 40 L -60 40 Z" fill="#F4F0E6" />
        <circle cx={66} cy={0} r={8} fill="#2A1A20" />
        {Array.from({length: 18}).map((_, i) => <rect key={i} x={-48 + i * 5.6} y={-26} width={rand(i) > 0.5 ? 3.5 : 2} height={36} fill="#1A1218" />)}
        <text x={0} y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={13} fill="#1A1218">0 0 0 0 0</text>
        {/* garis scan lembut */}
        {k > 0.5 && <rect x={-56} y={-28 + scan * 44} width={112} height={4} fill="#FF4A5A" opacity={0.75} />}
      </g>
      {/* pemindai genggam */}
      {k > 0.4 && (
        <g transform={`translate(${260 - sm((k - 0.4) * 3) * 40},40) rotate(-28)`} opacity={sm((k - 0.4) * 3)}>
          <path d="M -40 -26 L 50 -26 L 50 20 L 10 20 L 0 90 L -26 90 L -20 20 L -40 20 Z" fill="#2E3240" />
          <rect x={-36} y={-22} width={20} height={36} fill="#FF4A5A" opacity={0.7 + 0.3 * Math.sin(t)} />
          <path d={`M -40 -4 L -170 ${-30 - scan * 30} L -170 ${10 - scan * 30} Z`} fill="#FF4A5A" opacity={0.12} />
        </g>
      )}
    </g>
  );
};

/* ---------- label harga terbakar & rontok jadi abu ---------- */
export const BurningTag: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const burn = sm(k);
  return (
    <g>
      <g opacity={1 - clamp((burn - 0.75) / 0.25)} transform={`translate(0,${burn * burn * 80}) rotate(${-14 + burn * 30})`}>
        <path d={`M -60 -40 L ${60 - burn * 120} -40 L ${90 - burn * 150} 0 L ${60 - burn * 120} 40 L -60 40 Z`} fill="#F4F0E6" />
        <path d={`M ${60 - burn * 120} -44 Q ${70 - burn * 120} -10 ${56 - burn * 120} 0 Q ${74 - burn * 120} 20 ${60 - burn * 120} 44`} stroke="#3A1A10" strokeWidth={8} fill="none" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${54 - burn * 120} ${-30 + i * 28} q ${10 + Math.sin(t * 0.8 + i) * 6} -20 0 -42 q 18 16 6 42 Z`} fill={i % 2 ? '#FFB040' : '#FF6A2A'} opacity={0.9 * (1 - burn * 0.6)} />
        ))}
      </g>
      {Array.from({length: 10}).map((_, i) => {
        const ph = (t * 0.03 + i / 10) % 1;
        return <rect key={i} x={-40 + rand(i) * 100 - burn * 40} y={20 + ph * 200} width={6} height={4} fill="#5A5058" opacity={(1 - ph) * burn} transform={`rotate(${ph * 300})`} />;
      })}
    </g>
  );
};

/* ---------- lampu tidur redup (kiri) & HP 18+ terang di nakas (kanan) ---------- */
export const DimLamp: React.FC<{t: number; on?: number}> = ({t, on = 0.35}) => (
  <g>
    <circle cx={0} cy={-40} r={150} fill="#FFD9A0" opacity={0.18 * on} />
    <path d="M -60 -90 L 60 -90 L 80 0 L -80 0 Z" fill="#E8D8B8" opacity={0.4 + 0.5 * on} />
    <rect x={-8} y={0} width={16} height={80} fill="#5A4A3A" /><rect x={-50} y={78} width={100} height={14} rx={6} fill="#5A4A3A" />
    <rect x={-120} y={92} width={240} height={140} rx={10} fill="#3A2A30" />
    <path d="M 60 40 l 20 0" stroke="#FFD9A0" strokeWidth={0} opacity={on * (0.5 + 0.5 * Math.sin(t * 0.1))} />
  </g>
);
export const PhoneOnStand: React.FC<{t: number; s?: number}> = ({t, s = 1}) => (
  <g transform={`scale(${s})`}>
    <circle cx={0} cy={-40} r={240} fill="#FF4FA8" opacity={0.2 + 0.05 * Math.sin(t * 0.4)} />
    <g transform="rotate(-6) translate(0,-40)"><HandsetNk t={t} w={120} h={220} color="#FF4FA8" /></g>
    <rect x={-120} y={92} width={240} height={140} rx={10} fill="#3A2A30" />
    <path d="M -30 92 L -10 60 L 10 60 L 30 92 Z" fill="#2A2A32" />
  </g>
);

/* ---------- ketel di kompor: mendidih, bersiul, tutup meletup ---------- */
export const KettleBoil: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const pop = k > 0.55 ? Math.sin(clamp((k - 0.55) / 0.45) * Math.PI) : 0;
  const shake = k * Math.sin(t * 2.2) * 3;
  return (
    <g>
      {/* kompor + api */}
      <rect x={-200} y={130} width={400} height={30} rx={8} fill="#3A3F4E" />
      {Array.from({length: 9}).map((_, i) => <path key={i} d={`M ${-80 + i * 20} 128 q ${-6} ${-18 - Math.sin(t * 0.9 + i) * 6} 0 ${-30 - k * 10} q 6 12 0 30 Z`} fill={i % 2 ? '#4FA8FF' : '#8AD0FF'} opacity={0.85} />)}
      <g transform={`translate(${shake},0)`}>
        <path d="M -150 120 Q -170 -40 -80 -70 L 80 -70 Q 170 -40 150 120 Z" fill="#C9CED8" />
        <path d="M -150 120 Q -170 -40 -80 -70 L -40 -70 Q -110 -30 -100 120 Z" fill="#FFFFFF" opacity={0.35} />
        <path d="M 140 30 Q 210 10 240 -60 L 262 -50 Q 238 30 150 70 Z" fill="#AEB4C0" />
        <path d="M -120 -60 Q -100 -170 0 -170 Q 100 -170 120 -60" stroke="#3A3F4E" strokeWidth={14} fill="none" />
        {/* tutup */}
        <g transform={`translate(0,${-70 - pop * 90}) rotate(${pop * -25})`}>
          <ellipse cx={0} cy={0} rx={70} ry={16} fill="#AEB4C0" /><circle cx={0} cy={-16} r={14} fill="#3A3F4E" />
        </g>
      </g>
      {/* uap & siulan */}
      {Array.from({length: 6}).map((_, i) => {
        const ph = (t * 0.05 + i / 6) % 1;
        return <circle key={i} cx={258 + ph * 110} cy={-64 - ph * 120} r={14 + ph * 36} fill="#FFFFFF" opacity={(1 - ph) * 0.5 * (0.3 + k)} />;
      })}
      {k > 0.25 && [0, 1, 2].map((i) => <path key={i} d={`M ${290 + i * 26} ${-110 - i * 20} q 20 -10 30 -34`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round"
        opacity={0.5 + 0.5 * Math.sin(t * 1.2 + i)} />)}
      {pop > 0.1 && Array.from({length: 8}).map((_, i) => <circle key={`p${i}`} cx={Math.cos(i) * 60 * pop} cy={-120 - pop * 80 + Math.sin(i * 2) * 30} r={18 * pop} fill="#FFFFFF" opacity={0.5 * pop} />)}
    </g>
  );
};

/* ---------- gelembung kata berbentuk kaktus: duri-durinya lepas melesat ke kanan (ke arah istri) ---------- */
export const CactusWords: React.FC<{t: number; k?: number; dist?: number}> = ({t, k = 1, dist = 420}) => (
  <g>
    <path d="M -80 60 Q -110 -40 -60 -80 Q 0 -120 60 -80 Q 110 -40 80 60 Q 40 90 0 80 L -40 110 L -30 74 Q -60 70 -80 60 Z" fill="#3E8A4A" />
    {[-40, 0, 40].map((x) => <path key={x} d={`M ${x} -84 Q ${x + 8} 0 ${x} 70`} stroke="#2E6A38" strokeWidth={5} fill="none" />)}
    {Array.from({length: 14}).map((_, i) => {
      const a = -1.2 + (i / 13) * 2.4, ph = ((t * 0.035 + i * 0.137) % 1);
      const fly = k > 0.1 ? ph : 0;
      const x0 = Math.cos(a) * 80, y0 = Math.sin(a) * 70;
      return (
        <g key={i} transform={`translate(${x0 + fly * dist},${y0 + fly * (rand(i) - 0.5) * 120}) rotate(${(a * 180) / Math.PI})`} opacity={fly > 0.85 ? (1 - fly) * 6 : 1}>
          <path d="M 0 -3 L 34 0 L 0 3 Z" fill="#F2EAD0" />
        </g>
      );
    })}
  </g>
);

/* ---------- pintu kamar tertutup: gagang diputar paksa dari luar, cahaya merah dari celah bawah ---------- */
export const ForcedDoor: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const jerk = Math.max(0, Math.sin(t * 0.7)) ** 3;
  const shake = jerk * 4 * k;
  return (
    <g>
      <rect x={-200} y={-460} width={400} height={920} fill="#2A1A1A" />
      <g transform={`translate(${shake},0)`}>
        <rect x={-180} y={-440} width={360} height={890} fill="#6A4636" />
        {[0, 1].map((i) => <rect key={i} x={-140} y={-400 + i * 440} width={280} height={380} rx={8} fill="none" stroke="#4E3226" strokeWidth={10} />)}
        <g transform={`translate(120,20)`}>
          <circle r={28} fill="#C9A86A" />
          <g transform={`rotate(${-jerk * 42 * k})`}><rect x={-6} y={-8} width={80} height={16} rx={8} fill="#E0C080" /></g>
          <rect x={-10} y={30} width={20} height={36} rx={8} fill="#8A6A40" />
        </g>
      </g>
      {/* cahaya merah dari celah bawah + bayangan kaki di luar */}
      <rect x={-180} y={448} width={360} height={14} fill="#FF2A3A" opacity={0.85} />
      <path d="M -180 462 L 180 462 L 330 640 L -330 640 Z" fill="#FF2A3A" opacity={0.18 * (0.8 + 0.2 * Math.sin(t * 0.3))} />
      {[-50, 40].map((x, i) => <rect key={i} x={x + Math.sin(t * 0.2 + i) * 10} y={449} width={56} height={10} rx={4} fill="#14080A" />)}
    </g>
  );
};

/* ---------- tanaman pot disiram cairan hijau beracun (botol tengkorak) -> layu menghitam ---------- */
export const PoisonPlant: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const w = sm(k);
  const leaf = (i: number) => {
    const a = -70 + i * 35, droop = w * (40 + i * 8);
    const c = w < 0.5 ? '#3E9A52' : '#1E1A1A';
    return (
      <g key={i} transform={`translate(0,-120) rotate(${a + (a > -10 ? droop : -droop) * 0.8})`}>
        <path d={`M 0 0 Q ${30 - w * 10} -60 0 ${-150 + w * 30} Q -30 -60 0 0`} fill={w < 0.5 ? '#4FB062' : '#2A2622'} opacity={1} />
        <path d={`M 0 -10 L 0 ${-140 + w * 30}`} stroke={c} strokeWidth={3} />
        {w > 0.3 && <path d={`M -8 -60 Q 0 -54 8 -60`} stroke="#0A0A0A" strokeWidth={6} opacity={w} />}
      </g>
    );
  };
  return (
    <g>
      <path d="M -90 0 L 90 0 L 70 130 L -70 130 Z" fill="#A0603A" />
      <rect x={-100} y={-14} width={200} height={24} rx={8} fill="#B8724A" />
      <rect x={-6} y={-120} width={12} height={120} fill={w < 0.5 ? '#3E8A4A' : '#2A2622'} />
      {[0, 1, 2, 3, 4].map(leaf)}
      {/* botol tengkorak menuang */}
      <g transform="translate(170,-260) rotate(-128)">
        <path d="M -34 -60 L 34 -60 L 40 50 Q 40 70 20 70 L -20 70 Q -40 70 -40 50 Z" fill="#2A4A2A" />
        <rect x={-14} y={-90} width={28} height={32} rx={4} fill="#1A2A1A" />
        <g transform="translate(0,8) rotate(128)"><circle r={18} fill="#E8F0E0" /><circle cx={-6} cy={-2} r={5} fill="#1A2A1A" /><circle cx={6} cy={-2} r={5} fill="#1A2A1A" /><rect x={-8} y={10} width={16} height={8} fill="#E8F0E0" /></g>
      </g>
      <path d={`M 110 -210 Q 60 -150 20 ${-20}`} stroke="#7CFF6A" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} strokeDasharray="30 12" strokeDashoffset={-t * 4} />
      {Array.from({length: 6}).map((_, i) => {
        const ph = (t * 0.04 + i / 6) % 1;
        return <circle key={i} cx={(rand(i) - 0.5) * 140} cy={-20 - ph * 140} r={8 + ph * 14} fill="#7CFF6A" opacity={(1 - ph) * 0.35} />;
      })}
    </g>
  );
};

/* ---------- kaca jendela retak menjalar (kerikil kata-kata) ---------- */
export const CrackWindow: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const hits = [[-60, -40], [70, 30], [-20, 110]];
  return (
    <g>
      <rect x={-230} y={-280} width={460} height={560} fill="#1A2440" />
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={-200 + rand(i) * 400} cy={-250 + rand(i * 3) * 300} r={2 + rand(i * 5) * 2} fill="#FFFFFF" opacity={0.4} />)}
      <path d="M -230 -280 L 230 -280 L 230 -230 L -230 120 Z" fill="#FFFFFF" opacity={0.05} />
      {hits.map(([x, y], h) => {
        const kk = clamp(k * 3 - h);
        if (kk <= 0) return null;
        return (
          <g key={h} transform={`translate(${x},${y})`}>
            {Array.from({length: 9}).map((_, i) => {
              const a = (i / 9) * Math.PI * 2 + h, L = (80 + rand(i + h * 9) * 140) * sm(kk);
              const mx = Math.cos(a + 0.2) * L * 0.5, my = Math.sin(a + 0.2) * L * 0.5;
              return <path key={i} d={`M 0 0 L ${mx} ${my} L ${Math.cos(a) * L} ${Math.sin(a) * L}`} stroke="#E8F2FF" strokeWidth={2.5} fill="none" opacity={0.9} />;
            })}
            {[22, 44].map((r) => <circle key={r} r={r * sm(kk)} fill="none" stroke="#E8F2FF" strokeWidth={2} opacity={0.7} strokeDasharray="8 10" />)}
            <circle r={6} fill="#FFFFFF" opacity={0.8} />
          </g>
        );
      })}
      <rect x={-246} y={-296} width={492} height={592} fill="none" stroke="#3A3040" strokeWidth={32} />
      <rect x={-8} y={-280} width={16} height={560} fill="#3A3040" />
    </g>
  );
};

/* ---------- jam dinding analog (berdetak) ---------- */
export const NightClock: React.FC<{t: number; s?: number}> = ({t, s = 1}) => {
  const sec = Math.floor(t / 30) * 6;
  return (
    <g transform={`scale(${s})`}>
      <circle r={90} fill="#E8E2D6" stroke="#5A4A3A" strokeWidth={12} />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={-3} y={-80} width={6} height={i % 3 ? 10 : 18} fill="#3A2A2A" transform={`rotate(${i * 30})`} />)}
      <rect x={-5} y={-50} width={10} height={56} rx={5} fill="#2A1A1A" transform="rotate(62)" />
      <rect x={-4} y={-72} width={8} height={78} rx={4} fill="#2A1A1A" transform={`rotate(${312 + t * 0.01})`} />
      <rect x={-1.5} y={-76} width={3} height={88} fill="#C62F3E" transform={`rotate(${sec})`} />
      <circle r={8} fill="#2A1A1A" />
    </g>
  );
};

/* ---------- pensil "EMPATI" berujung tumpul + rautan kosong berdebu (diraut tapi seret) ---------- */
export const DullPencil: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const push = sm(k) * 40, twist = k > 0.2 ? Math.sin(t * 0.5) * 6 : 0;
  return (
    <g>
      <g transform={`translate(${-60 + push},0) rotate(${twist * 0.3})`}>
        <rect x={-300} y={-34} width={360} height={68} fill="#F2C14E" />
        <rect x={-300} y={-34} width={360} height={22} fill="#FFD978" />
        <rect x={-300} y={12} width={360} height={22} fill="#D9A43A" />
        <rect x={-344} y={-34} width={48} height={68} rx={8} fill="#E88A9A" />
        <rect x={-300} y={-34} width={14} height={68} fill="#C9CED8" />
        <path d="M 60 -34 L 140 -10 Q 150 0 140 10 L 60 34 Z" fill="#E8C9A0" />
        <path d="M 120 -16 Q 150 0 120 16 Z" fill="#4A4048" />
        <text x={-120} y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={38} fill="#5A3A10">EMPATI</text>
      </g>
      {/* rautan berdebu + sarang laba-laba */}
      <g transform="translate(200,10)">
        <rect x={-60} y={-60} width={120} height={120} rx={14} fill="#7A8090" />
        <circle cx={-40} cy={0} r={34} fill="#2A2E38" />
        <rect x={-50} y={-50} width={100} height={8} rx={4} fill="#9AA0B0" />
        {Array.from({length: 14}).map((_, i) => <circle key={i} cx={-50 + rand(i) * 100} cy={-56 + rand(i * 3) * 110} r={2 + rand(i * 7) * 3} fill="#C9C4B8" opacity={0.6} />)}
        <path d="M 60 -60 L 20 -20 M 60 -60 L 60 -10 M 60 -60 L 10 -60 M 30 -60 Q 40 -40 60 -30 M 20 -45 Q 45 -45 52 -20" stroke="#D9D4CC" strokeWidth={1.6} fill="none" opacity={0.7} />
      </g>
      {/* debu terhembus (tanpa serutan) */}
      {k > 0.3 && Array.from({length: 6}).map((_, i) => {
        const ph = (t * 0.03 + i / 6) % 1;
        return <circle key={i} cx={150 + ph * 40} cy={-20 - ph * 60 + i * 6} r={4 + ph * 6} fill="#B9B4AA" opacity={(1 - ph) * 0.5} />;
      })}
    </g>
  );
};
