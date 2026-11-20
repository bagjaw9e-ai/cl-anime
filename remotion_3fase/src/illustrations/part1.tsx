// Ilustrasi HOOK, ONE SHOT, FASE 1. (0,0) = pusat objek kecuali disebut lain. t = frame lokal/absolut untuk animasi.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, mix, rand} from '../theme';
import {useSid} from '../components/Phone';
import {Halo, Rise} from '../components/Lit';
import {CEREBRUM} from '../components/Brain';
import {PINK, Phone18, Twinkle, backOut, ramp, smooth} from './shared';

/* ---------- HOOK ---------- */
// kilatan blitz kamera: k = frame sejak blitz
export const CameraFlash: React.FC<{k: number}> = ({k}) => {
  if (k < 0 || k > 10) return null;
  const a = k < 2 ? 1 : 1 - (k - 2) / 8;
  return (
    <g opacity={a}>
      <rect width={1080} height={1920} fill="#FFFFFF" opacity={0.55} />
      <Halo x={860} y={700} rx={420} color="#FFFFFF" op={0.9} />
      {Array.from({length: 8}).map((_, i) => {
        const an = (i / 8) * Math.PI * 2;
        return <line key={i} x1={860 + Math.cos(an) * 40} y1={700 + Math.sin(an) * 40} x2={860 + Math.cos(an) * 160} y2={700 + Math.sin(an) * 160} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />;
      })}
    </g>
  );
};

// HP di saku jas: nyala merah + badge 18+ (dipasang di koordinat saku karakter)
export const PocketPhone: React.FC<{on: number}> = ({on}) => (
  <g>
    <Halo rx={90} ry={110} color="#FF3B3B" op={0.6 * on} />
    <g transform="rotate(-6)"><rect x={-24} y={-46} width={48} height={70} rx={8} fill="#15101A" /><rect x={-19} y={-41} width={38} height={60} rx={5} fill="#FF3B3B" opacity={0.3 + 0.7 * on} /></g>
    {on > 0.3 && (
      <g transform={`translate(30,-52) scale(${backOut(ramp(on, 0.3, 1))})`}>
        <circle r={26} fill="#E0262E" stroke="#FFFFFF" strokeWidth={4} />
        <text y={8} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#FFFFFF">18+</text>
      </g>
    )}
  </g>
);

/* ---------- ONE SHOT ---------- */
export const TissueBox: React.FC<{pull?: number; s?: number}> = ({pull = 0, s = 1}) => (
  <g transform={`scale(${s})`}>
    <Halo y={-40} rx={150} color="#FFF4E0" op={0.3} />
    <path d="M -90 0 L -80 -90 L 80 -90 L 90 0 Z" fill="#7FB7C9" />
    <path d="M -80 -90 L 80 -90 L 90 -70 L -90 -70 Z" fill="#9FD0E0" />
    <rect x={-40} y={-96} width={80} height={14} rx={7} fill="#3A5A66" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-50 + i * 50} cy={-40} r={12} fill="#FFFFFF" opacity={0.35} />)}
    <path d={`M -20 -92 C -40 ${-150 - pull * 60} 30 ${-150 - pull * 80} 20 ${-92 - pull * 10} Z`} fill="#FFFFFF" />
    {pull > 0.2 && <path d={`M 10 ${-130 - pull * 120} c -30 -30 30 -50 10 -80 c 30 10 30 60 -10 80 Z`} fill="#FFFFFF" opacity={clamp(1.5 - pull)} />}
  </g>
);

// piala emas ironis berhias ikon tisu
export const IronicTrophy: React.FC<{on?: number; s?: number}> = ({on = 1, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`scale(${s * backOut(on)})`}>
      <Halo y={-110} rx={170} color="#FFD166" op={0.5} />
      <rect x={-60} y={-20} width={120} height={22} rx={6} fill="#7A5A2A" />
      <rect x={-40} y={-50} width={80} height={32} rx={6} fill="#B8862E" />
      <rect x={-10} y={-90} width={20} height={44} fill="#D9A43E" />
      <path d="M -70 -200 L 70 -200 Q 66 -100 0 -86 Q -66 -100 -70 -200 Z" fill="#F2C24A" />
      <path d="M -70 -186 Q -120 -186 -110 -140 Q -100 -110 -60 -120" stroke="#F2C24A" strokeWidth={12} fill="none" />
      <path d="M 70 -186 Q 120 -186 110 -140 Q 100 -110 60 -120" stroke="#F2C24A" strokeWidth={12} fill="none" />
      <path d="M -50 -196 Q -40 -130 -10 -110" stroke="#FFF2B0" strokeWidth={8} fill="none" opacity={0.6} />
      {/* ikon tisu di badan piala */}
      <g transform="translate(0,-150) scale(0.42)"><path d="M -60 0 L -54 -60 L 54 -60 L 60 0 Z" fill="#FFFFFF" /><path d="M -14 -60 C -30 -110 26 -110 14 -60 Z" fill="#FFFFFF" /></g>
      <Twinkle x={56} y={-200} s={0.9 + 0.3 * Math.sin(f * 0.3)} c="#FFF6D0" />
    </g>
  );
};

// otak X-ray dengan 3 retakan bernomor; cracks = [p1,p2,p3] 0..1, widen 0..1 (retakan melebar)
const XCR = [
  {d: 'M -150 -60 L -120 -20 L -140 20 L -110 60', n: [-170, -70], c: '#FFD23F'},
  {d: 'M -20 -150 L -6 -100 L -30 -60 L -4 -20 L -24 20', n: [-40, -160], c: '#FF8A2B'},
  {d: 'M 110 -120 L 90 -70 L 130 -30 L 100 20 L 130 60', n: [120, -134], c: '#FF3B3B'},
];
export const XrayBrain: React.FC<{cracks: number[]; widen?: number; s?: number; glow?: number}> = ({cracks, widen = 0, s = 1, glow = 1}) => {
  const id = useSid('xb');
  return (
    <g transform={`scale(${s})`}>
      <defs><filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter></defs>
      <Halo rx={280} ry={220} color="#7FD8F0" op={0.25 * glow} />
      <path d={CEREBRUM} fill="#0E2A36" opacity={0.85} />
      <path d={CEREBRUM} fill="none" stroke="#9FE0F0" strokeWidth={5} opacity={0.9} />
      {['M -170 -40 C -150 -70 -120 -60 -110 -90', 'M -185 10 C -160 0 -150 -30 -125 -25', 'M 40 -150 C 50 -120 80 -125 75 -95', 'M 30 -60 C 55 -50 70 -20 100 -20', 'M -60 70 C -40 50 -10 60 0 40', 'M 120 -130 C 120 -100 150 -100 160 -70'].map((d, i) => (
        <path key={i} d={d} stroke="#5FB8D0" strokeWidth={4} fill="none" opacity={0.6} />
      ))}
      {XCR.map((c, i) => {
        const p = clamp(cracks[i] ?? 0);
        if (p <= 0) return null;
        return (
          <g key={i}>
            <path d={c.d} stroke={c.c} strokeWidth={14 + widen * 14} fill="none" filter={`url(#${id}b)`} opacity={0.8 * p} pathLength={1} strokeDasharray={`${p} 1`} />
            <path d={c.d} stroke="#FFFFFF" strokeWidth={4 + widen * 6} fill="none" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
            <g transform={`translate(${c.n[0]},${c.n[1]}) scale(${backOut(ramp(p, 0.2, 0.7))})`}>
              <circle r={24} fill={c.c} /><text y={9} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#15101A">{i + 1}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const QuestionMarks: React.FC<{on: number; t: number}> = ({on, t}) => (
  <g opacity={on}>
    {[[-130, -40, -12], [140, -80, 10], [100, 60, 6]].map(([x, y, r], i) => (
      <text key={i} x={x} y={y + Math.sin(t * 0.08 + i) * 10} transform={`rotate(${r} ${x} ${y})`} textAnchor="middle" fontFamily="Poppins" fontWeight={800}
        fontSize={70 - i * 10} fill="#FFFFFF" opacity={0.85}>?</text>
    ))}
  </g>
);

/* ---------- FASE 1 ---------- */
// otak + setir kemudi "REWARD" direbut tangan merah dari HP. grab 0..1
export const RewardHijack: React.FC<{grab: number; t: number}> = ({grab, t}) => {
  const rot = grab * 120 + Math.sin(t * 0.6) * 6 * grab;
  const hx = lerp(330, 150, smooth(clamp(grab * 1.4)));
  return (
    <g>
      <Halo rx={330} ry={260} color="#FFD166" op={0.25} />
      <g transform="scale(0.85)"><path d={CEREBRUM} fill="#F2B8C6" /><path d={CEREBRUM} fill="none" stroke="#C97A90" strokeWidth={5} /></g>
      <g transform={`translate(0,-20) rotate(${rot})`}>
        <circle r={110} fill="none" stroke="#3A3A48" strokeWidth={22} />
        <circle r={110} fill="none" stroke="#5A5A6A" strokeWidth={8} />
        {[90, 210, 330].map((a) => <rect key={a} x={-8} y={0} width={16} height={92} rx={6} fill="#3A3A48" transform={`rotate(${a})`} />)}
        <circle r={40} fill="#FFD166" /><text y={8} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#3A2A12">REWARD</text>
      </g>
      {/* HP + tangan merah menjulur */}
      <g transform="translate(400,140) rotate(12)"><Phone18 w={110} glow={0.9} /></g>
      <path d={`M 360 100 Q ${(360 + hx) / 2} ${-40} ${hx} -60`} stroke="#E0262E" strokeWidth={26} fill="none" strokeLinecap="round" opacity={clamp(grab * 3)} />
      {grab > 0.05 && (
        <g transform={`translate(${hx},-60) rotate(-30)`}>
          <ellipse rx={30} ry={24} fill="#E0262E" />
          {[-18, -6, 6, 18].map((dx) => <rect key={dx} x={dx - 5} y={-46} width={10} height={30} rx={5} fill="#E0262E" />)}
        </g>
      )}
    </g>
  );
};

// partikel pink membanjiri kepala dari layar HP: dari (x1,y1) ke (x2,y2)
export const PinkFlood: React.FC<{x1: number; y1: number; x2: number; y2: number; t: number; on: number}> = ({x1, y1, x2, y2, t, on}) => (
  <g opacity={on}>
    {Array.from({length: 26}).map((_, i) => {
      const ph = ((t * 0.035 + rand(i) ) % 1);
      const x = lerp(x1, x2, ph) + Math.sin(ph * 9 + i) * 40 * (1 - ph);
      const y = lerp(y1, y2, ph) - Math.sin(ph * Math.PI) * 120;
      return <circle key={i} cx={x} cy={y} r={5 + rand(i * 3) * 9} fill={i % 3 ? PINK : '#FFB3D0'} opacity={0.85 * Math.sin(ph * Math.PI) + 0.1} />;
    })}
  </g>
);

// reseptor (colokan) di otak: rust 0..1 berkarat lalu tertutup lapisan keras
export const Receptors: React.FC<{rust: number}> = ({rust}) => {
  const base = mix('#7FD8F0', '#8A5A3A', rust);
  return (
    <g>
      <Halo rx={330} ry={240} color={mix('#7FD8F0', '#8A5A3A', rust)} op={0.25} />
      <rect x={-300} y={20} width={600} height={60} rx={20} fill="#F2B8C6" />
      {[-200, -70, 60, 190].map((x, i) => (
        <g key={i} transform={`translate(${x},20)`}>
          <path d="M -50 0 L -50 -110 Q 0 -150 50 -110 L 50 0 Z" fill={base} />
          <rect x={-22} y={-90} width={14} height={40} rx={4} fill="#1A1A22" /><rect x={8} y={-90} width={14} height={40} rx={4} fill="#1A1A22" />
          {rust > 0.2 && Array.from({length: 6}).map((_, k) => <circle key={k} cx={(rand(i * 9 + k) - 0.5) * 80} cy={-20 - rand(i * 5 + k) * 90} r={6 + rand(k) * 8} fill="#6A3A1E" opacity={ramp(rust, 0.2, 0.7)} />)}
          {/* lapisan keras (kalus) menutup */}
          <path d={`M -58 0 L -58 ${-118 * ramp(rust, 0.55, 1)} Q 0 ${-160 * ramp(rust, 0.55, 1)} 58 ${-118 * ramp(rust, 0.55, 1)} L 58 0 Z`} fill="#6E6A74" opacity={0.92} />
        </g>
      ))}
    </g>
  );
};

// tumpukan berkas di samping laptop jatuh (fall 0..1)
export const FallingFiles: React.FC<{fall: number}> = ({fall}) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => {
      const d = clamp(fall * 1.6 - k * 0.15);
      return <rect key={k} x={-70 + d * (40 + k * 30)} y={-20 - k * 16 + d * d * (220 + k * 16)} width={140} height={16} fill={['#E8E0CC', '#D9CFB6', '#EFE8D6'][k % 3]}
        transform={`rotate(${d * (30 + k * 25) * (k % 2 ? -1 : 1)} ${-70 + d * 40 + 70} ${-20 - k * 16 + d * d * 220})`} />;
    })}
  </g>
);

// sajadah tergelar
export const PrayerMat: React.FC = () => (
  <g>
    <path d="M -230 0 L 230 0 L 200 -60 L -200 -60 Z" fill="#2E6E5A" />
    <path d="M -200 -60 L 200 -60 L 196 -52 L -196 -52 Z" fill="#C9A96A" />
    <path d="M -160 -8 L 160 -8 L 140 -48 L -140 -48 Z" fill="none" stroke="#C9A96A" strokeWidth={4} />
    <path d="M -40 -48 Q 0 -80 40 -48" stroke="#C9A96A" strokeWidth={4} fill="none" />
  </g>
);

// "ruang kosong" di dada (lubang bergaris putus-putus)
export const ChestHollow: React.FC<{on: number}> = ({on}) => (
  <g opacity={on}>
    <ellipse rx={46} ry={40} fill="#05060C" opacity={0.85} />
    <ellipse rx={50} ry={44} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="8 8" opacity={0.7} />
  </g>
);

// timbangan: kiri = wanita (cerah), kanan = HP siluet pink; tilt 0..1 (miring ke HP)
export const BalanceScale: React.FC<{tilt: number; t: number}> = ({tilt, t}) => {
  const a = -14 * tilt + Math.sin(t * 0.2) * 1.2;
  const L = {x: -190 * Math.cos((a * Math.PI) / 180), y: -190 * Math.sin((a * Math.PI) / 180)};
  const R = {x: 190 * Math.cos((a * Math.PI) / 180), y: 190 * Math.sin((a * Math.PI) / 180)};
  const pan = (x: number, y: number, child: React.ReactNode) => (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={0} x2={-70} y2={110} stroke="#C9B07A" strokeWidth={4} /><line x1={0} y1={0} x2={70} y2={110} stroke="#C9B07A" strokeWidth={4} />
      <path d="M -90 110 Q 0 160 90 110 Z" fill="#D9B46A" />
      <g transform="translate(0,96)">{child}</g>
    </g>
  );
  return (
    <g>
      <Halo y={-80} rx={340} ry={260} color="#FFD166" op={0.2} />
      <rect x={-12} y={-240} width={24} height={300} fill="#B8963E" /><path d="M -90 60 L 90 60 L 60 30 L -60 30 Z" fill="#8A6A2A" />
      <g transform="translate(0,-240)">
        <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke="#D9B46A" strokeWidth={14} strokeLinecap="round" />
        <circle r={18} fill="#F2C94C" />
        {pan(L.x, L.y, (
          <g><Halo y={-40} rx={70} color="#FFE7B0" op={0.6} /><ellipse cx={0} cy={-56} rx={30} ry={32} fill="#C98A9B" /><circle cx={0} cy={-54} r={20} fill="#F1C9A5" />
            <path d="M -32 0 Q -30 -34 0 -34 Q 30 -34 32 0 Z" fill="#C7A2C2" /></g>
        ))}
        {pan(R.x, R.y, <g transform="translate(0,-48) scale(0.55)"><Phone18 w={110} glow={1} /></g>)}
      </g>
    </g>
  );
};

// gelas terus diisi tapi bocor di bawah (t frame)
export const LeakyGlass: React.FC<{t: number}> = ({t}) => {
  const lv = 0.35 + 0.08 * Math.sin(t * 0.12);
  return (
    <g>
      <Halo y={-120} rx={180} color="#9FD3FF" op={0.3} />
      {/* teko menuang */}
      <g transform="translate(-120,-330) rotate(30)">
        <path d="M -50 -40 L 50 -40 L 40 50 L -40 50 Z" fill="#C9D2E0" /><path d="M 50 -30 L 100 -60 L 96 -50 L 50 -14 Z" fill="#C9D2E0" />
      </g>
      <path d={`M -40 -340 Q -10 -260 -4 -200`} stroke="#7FC8FF" strokeWidth={10} fill="none" opacity={0.85} />
      {/* gelas */}
      <path d="M -80 -220 L 80 -220 L 64 0 L -64 0 Z" fill="#DDEBF8" opacity={0.18} />
      <path d={`M ${-80 + 16 * (1 - lv)} ${-220 * lv} L ${80 - 16 * (1 - lv)} ${-220 * lv} L 64 0 L -64 0 Z`} fill="#4FA8E8" opacity={0.75} />
      <path d="M -80 -220 L 80 -220 L 64 0 L -64 0 Z" fill="none" stroke="#E6F2FF" strokeWidth={5} />
      {/* bocor */}
      {Array.from({length: 6}).map((_, i) => {
        const ph = ((t * 0.06 + i / 6) % 1);
        return <path key={i} d={`M ${-6 + (i % 2) * 12} ${8 + ph * 140} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#4FA8E8" opacity={1 - ph} />;
      })}
      <ellipse cx={0} cy={150} rx={90 + Math.sin(t * 0.1) * 6} ry={14} fill="#4FA8E8" opacity={0.35} />
    </g>
  );
};

// tangga yang anak tangganya terus bertambah + gauge di puncak; grow 0..1, needle 0..1
export const EndlessStairs: React.FC<{grow: number; needle: number; t: number}> = ({grow, needle, t}) => {
  const n = 5 + Math.floor(grow * 6);
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const pop = i >= 5 ? backOut(clamp(grow * 6 - (i - 5))) : 1;
        return <rect key={i} x={-260 + i * 56} y={-i * 52} width={70} height={52 + i * 52} fill={mix('#4A5068', '#7A5A9A', i / 11)} opacity={0.95}
          transform={`translate(0,52) scale(1,${pop}) translate(0,-52)`} />;
      })}
      <g transform={`translate(${-260 + (n - 1) * 56 + 60},${-(n - 1) * 52 - 120})`}>
        <Halo rx={130} color="#FF3B3B" op={0.35 * needle} />
        <path d="M -90 0 A 90 90 0 0 1 90 0" stroke="#3A3A48" strokeWidth={26} fill="none" />
        <path d="M -90 0 A 90 90 0 0 1 -45 -78" stroke="#4FB36A" strokeWidth={22} fill="none" />
        <path d="M -45 -78 A 90 90 0 0 1 45 -78" stroke="#F2C94C" strokeWidth={22} fill="none" />
        <path d="M 45 -78 A 90 90 0 0 1 90 0" stroke="#E0262E" strokeWidth={22} fill="none" />
        <g transform={`rotate(${-90 + needle * 170 + Math.sin(t * 1.3) * 4 * needle})`}><rect x={-4} y={-80} width={8} height={80} rx={4} fill="#FFFFFF" /></g>
        <circle r={12} fill="#FFFFFF" />
      </g>
    </g>
  );
};
