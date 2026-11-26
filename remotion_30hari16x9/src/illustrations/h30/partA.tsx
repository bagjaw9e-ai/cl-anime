// Ilustrasi BARU video 30 hari 16:9 — bagian A: HOOK + HARI 1-3. Semua DINAMIS (selalu bergerak selama tampil) via `t` (frame).
// (0,0) = pusat ilustrasi (titik fokus kamera). Gaya ref_1: bentuk simpel menyala di atas latar gelap.
import React from 'react';
import {FONT} from '../../fonts';
import {clamp, mix, rand} from '../../theme';
import {Halo} from '../../components/Lit';
import {useSid} from '../../components/Phone';

export const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
export const TX = (x: number, y: number, s: string, size = 30, fill = '#15121C', anchor: 'middle' | 'start' = 'middle', w = 800) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={w} fontSize={size} fill={fill}>{s}</text>
);
const PINK = '#FF5FA2';

/* ---------- OTAK baru (desain video ini): siluet otak dua lobus bergelombang + sulkus spiral ---------- */
export const BRAIN_PATH = 'M -150 20 C -170 -60 -110 -130 -40 -120 C -10 -150 50 -150 80 -118 C 150 -120 185 -50 160 10 C 180 60 140 110 80 100 C 50 130 -20 130 -50 105 C -120 120 -170 80 -150 20 Z';
export const BrainShape: React.FC<{fill: string; line?: string; t: number; glow?: string; op?: number}> = ({fill, line = '#00000044', t, glow, op = 1}) => (
  <g opacity={op}>
    {glow && <Halo rx={260} ry={200} color={glow} op={0.45} />}
    <path d={BRAIN_PATH} fill={fill} />
    <g stroke={line} strokeWidth={7} fill="none" strokeLinecap="round">
      <path d="M 0 -125 C -6 -60 10 0 -4 110" />
      <path d={`M -120 -40 C -90 ${-70 + Math.sin(t * 0.05) * 3} -60 -20 -30 -50`} /><path d="M -130 40 C -90 10 -70 60 -40 30" />
      <path d="M 40 -80 C 70 -100 100 -60 130 -70" /><path d="M 40 10 C 80 -20 110 30 145 0" /><path d="M 30 70 C 60 50 90 90 110 70" />
    </g>
  </g>
);

/* 1. Monitor MRI: otak "3D" berputar (cincin-cincin elips berotasi) + sinyal neuron berkedip menjalar */
export const BrainMonitor: React.FC<{t: number}> = ({t}) => {
  const id = useSid('bm');
  const yaw = t * 0.05;
  return (
    <g>
      <Halo rx={420} ry={300} color="#7FE8F0" op={0.35} />
      <rect x={-330} y={-220} width={660} height={420} rx={24} fill="#0C1A22" stroke="#7FA8B8" strokeWidth={10} />
      <rect x={-20} y={200} width={40} height={60} fill="#3A4A56" /><rect x={-110} y={256} width={220} height={18} rx={8} fill="#3A4A56" />
      <clipPath id={id}><rect x={-310} y={-200} width={620} height={380} rx={14} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-310} y={-200} width={620} height={380} fill="#06141A" />
        {Array.from({length: 9}).map((_, i) => <line key={i} x1={-310} y1={-200 + i * 48} x2={310} y2={-200 + i * 48} stroke="#7FE8F0" strokeWidth={1} opacity={0.1} />)}
        <g transform="translate(0,-10)">
          {Array.from({length: 7}).map((_, i) => {
            const a = yaw + (i / 7) * Math.PI;
            return <ellipse key={i} rx={Math.abs(Math.cos(a)) * 150 + 6} ry={110} fill="none" stroke="#7FE8F0" strokeWidth={2.5} opacity={0.25 + 0.5 * Math.abs(Math.sin(a))} />;
          })}
          {Array.from({length: 5}).map((_, i) => <ellipse key={i} cy={-80 + i * 40} rx={150 * Math.sqrt(1 - ((-80 + i * 40) / 115) ** 2)} ry={14} fill="none" stroke="#7FE8F0" strokeWidth={2} opacity={0.35} />)}
          {/* sinyal neuron menjalar */}
          {Array.from({length: 10}).map((_, i) => {
            const ph = ((t * 0.04 + rand(i) ) % 1), a = rand(i * 3) * 6.28 + yaw;
            const x = Math.cos(a) * 130 * ph, y = Math.sin(a * 1.3) * 90 * ph;
            return <circle key={i} cx={x} cy={y} r={7} fill="#FFFFFF" opacity={Math.sin(ph * Math.PI) * (Math.floor(t / 3 + i) % 3 ? 1 : 0.3)} />;
          })}
        </g>
        <rect x={-290} y={140} width={180 + Math.sin(t * 0.2) * 40} height={10} rx={5} fill="#3FF0A0" opacity={0.7} />
        {TX(280, -170, 'MRI', 28, '#7FE8F0', 'middle')}
      </g>
    </g>
  );
};

/* 2a. HP 18+ desain BARU: bingkai neon pink bulat, layar blur gelembung pink + bar sensor miring, tag 18+ di pita sudut */
export const PhonePink: React.FC<{t: number; w?: number; open?: number}> = ({t, w = 150, open = 0}) => {
  const h = w * 1.95, id = useSid('pp');
  return (
    <g>
      <Halo rx={w * 1.6} ry={h * 0.8} color={PINK} op={0.4 + 0.1 * Math.sin(t * 0.3)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.2} fill="#1A0E1E" stroke={PINK} strokeWidth={w * 0.035} />
      <clipPath id={id}><rect x={-w / 2 + w * 0.08} y={-h / 2 + w * 0.12} width={w * 0.84} height={h - w * 0.24} rx={w * 0.12} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#3A0C2A" />
        {Array.from({length: 6}).map((_, i) => (
          <circle key={i} cx={Math.sin(t * 0.04 + i * 1.3) * w * 0.25} cy={Math.cos(t * 0.05 + i) * h * 0.25} r={w * (0.18 + 0.06 * (i % 3))} fill={PINK} opacity={0.35} />
        ))}
        <rect x={-w} y={-w * 0.12} width={w * 2} height={w * 0.24} fill="#0A0A12" transform={`rotate(-8)`} />
      </g>
      <g transform={`translate(${w * 0.38},${-h * 0.42}) rotate(12)`}>
        <rect x={-w * 0.26} y={-w * 0.12} width={w * 0.52} height={w * 0.24} rx={w * 0.06} fill="#FF2A4A" />
        {TX(0, w * 0.08, '18+', w * 0.2, '#FFFFFF')}
      </g>
    </g>
  );
};

/* 2b. Laci meja: HP masuk, laci menutup (close 0..1), gembok kunci diputar (lock 0..1) */
export const DrawerLock: React.FC<{t: number; close: number; lock: number}> = ({t, close, lock}) => {
  const c = sm(close);
  return (
    <g>
      <Halo rx={320} ry={200} color="#9A8AD8" op={0.3} />
      <rect x={-260} y={-150} width={520} height={300} rx={14} fill="#4A3A30" />
      <rect x={-240} y={-130} width={480} height={120} rx={8} fill="#2E241E" />
      {/* laci bergeser keluar->masuk */}
      <g transform={`translate(0,${(1 - c) * 70})`}>
        <rect x={-230} y={-120 + (1 - c) * 40} width={460} height={110} rx={8} fill="#6A5444" />
        {c < 0.85 && <g transform={`translate(0,${-150 + c * 80}) rotate(90) scale(0.5)`} opacity={1 - c}><PhonePink t={t} w={120} /></g>}
        <rect x={-50} y={-70 + (1 - c) * 40} width={100} height={14} rx={7} fill="#C9A06A" />
      </g>
      {/* lubang kunci + kunci berputar */}
      <g transform="translate(150,60)">
        <circle r={26} fill="#C9A06A" /><rect x={-4} y={-10} width={8} height={20} rx={3} fill="#2A1A10" />
        <g transform={`rotate(${lock * 90})`} opacity={clamp(lock * 4)}><rect x={-5} y={-50} width={10} height={44} rx={3} fill="#E8D08A" /><circle cy={-56} r={14} fill="none" stroke="#E8D08A" strokeWidth={7} /></g>
        {lock > 0.95 && <Halo rx={60} color="#FFE6A0" op={0.7} />}
      </g>
    </g>
  );
};
/* 2c. Otak kecil yang ikut kaget: gemetar + sinyal berkedip cepat */
export const ShockedBrain: React.FC<{t: number; shock: number; s?: number}> = ({t, shock, s = 0.5}) => (
  <g transform={`translate(${Math.sin(t * 2.3) * 6 * shock},${Math.cos(t * 2.9) * 4 * shock}) scale(${s})`}>
    <BrainShape fill="#C8A0B8" line="#6A3A5A" t={t} glow={shock > 0.3 ? '#FF4A8A' : undefined} />
    {Array.from({length: 8}).map((_, i) => (
      <path key={i} d={`M ${Math.cos(i * 0.8) * 180} ${Math.sin(i * 0.8) * 140} l ${Math.cos(i * 0.8) * 40} ${Math.sin(i * 0.8) * 30}`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round"
        opacity={shock * (Math.floor(t / 2 + i) % 2 ? 1 : 0.1)} />
    ))}
  </g>
);

/* 3. Jam flip (papan angka) berputar cepat 01 -> 30 + otak berubah warna merah keabuan -> emas */
export const FlipClock: React.FC<{t: number; p: number}> = ({t, p}) => {
  const n = Math.max(1, Math.min(30, Math.floor(1 + sm(p) * 29.99)));
  const flip = p < 1 ? (t % 3) / 3 : 0;
  const card = (txt: string, x: number) => (
    <g transform={`translate(${x},0)`}>
      <rect x={-90} y={-120} width={180} height={240} rx={18} fill="#1E1A16" />
      <rect x={-90} y={-2} width={180} height={4} fill="#000000" />
      {TX(0, 66, txt, 180, '#FFF4E0')}
      <rect x={-90} y={-120} width={180} height={120 * (1 - Math.abs(1 - flip * 2))} rx={18} fill="#2E2822" opacity={flip > 0 ? 0.85 : 0} />
    </g>
  );
  const s = String(n).padStart(2, '0');
  return (
    <g>
      <Halo rx={320} ry={230} color="#FFC27A" op={0.35} />
      <rect x={-230} y={-150} width={460} height={300} rx={26} fill="#3A2E22" />
      {card(s[0], -100)}{card(s[1], 100)}
      {TX(0, 205, 'HARI', 40, '#FFC27A')}
    </g>
  );
};
export const ColorBrain: React.FC<{t: number; p: number; s?: number}> = ({t, p, s = 0.9}) => {
  const c = mix('#7A5A60', '#FFC23A', sm(p));
  return <g transform={`scale(${s * (1 + Math.sin(t * 0.12) * 0.02)})`}><BrainShape fill={c} line={mix('#3A2A30', '#B8862A', p)} t={t} glow={p > 0.5 ? '#FFC23A' : undefined} /></g>;
};

/* 4. Turus 3 garis di tembok, tiap garis menyala saat dicoret (k 0..3) */
export const TallyMarks: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const p = clamp(k - i);
      return (
        <g key={i} transform={`translate(${-80 + i * 80},0) rotate(${-4 + i * 3})`}>
          {p > 0 && <Halo rx={60} ry={140} color="#FF6A8A" op={0.5 * p * (0.8 + 0.2 * Math.sin(t * 0.3 + i))} />}
          <rect x={-10} y={-120} width={20} height={240 * p} rx={10} fill="#FFF0F4" />
        </g>
      );
    })}
  </g>
);

/* 5. Angin kencang dalam ruangan: garis angin + kertas beterbangan */
export const WindGust: React.FC<{t: number; w?: number}> = ({t, w = 900}) => (
  <g>
    {Array.from({length: 18}).map((_, i) => {
      const y = (rand(i) - 0.5) * 420, ph = ((t * 0.035 + rand(i * 2)) % 1);
      return <path key={i} d={`M ${w / 2 - ph * w * 1.4} ${y} q -60 -10 -140 0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.35 * Math.sin(ph * Math.PI)} strokeLinecap="round" />;
    })}
    {Array.from({length: 7}).map((_, i) => {
      const ph = ((t * 0.02 + rand(i * 5)) % 1);
      return (
        <g key={i} transform={`translate(${w / 2 - ph * w * 1.3},${(rand(i * 9) - 0.5) * 360 + Math.sin(t * 0.2 + i) * 30}) rotate(${t * 6 + i * 50})`} opacity={Math.sin(ph * Math.PI)}>
          <rect x={-26} y={-34} width={52} height={68} rx={3} fill="#F4EEE2" /><rect x={-16} y={-20} width={32} height={4} fill="#B8B0A0" /><rect x={-16} y={-8} width={26} height={4} fill="#B8B0A0" />
        </g>
      );
    })}
  </g>
);

/* 6. Siluet badan transparan + indikator tangki BBM, jarum mantap di FULL (bergetar halus) */
export const BodyFuelGauge: React.FC<{t: number; up: number}> = ({t, up}) => {
  const a = -70 + sm(up) * 130 + Math.sin(t * 0.4) * 2;
  return (
    <g>
      <Halo rx={260} ry={340} color="#7FE8D8" op={0.3} />
      <path d="M 0 -300 C 60 -300 70 -230 50 -190 C 130 -170 150 -120 150 -40 L 150 120 L 90 120 L 90 300 L -90 300 L -90 120 L -150 120 L -150 -40 C -150 -120 -130 -170 -50 -190 C -70 -230 -60 -300 0 -300 Z"
        fill="#7FE8D8" opacity={0.16} stroke="#BFFFF4" strokeWidth={4} />
      <g transform="translate(0,-10)">
        <path d="M -110 40 A 120 120 0 0 1 110 40" stroke="#1C2A30" strokeWidth={30} fill="none" />
        <path d="M -110 40 A 120 120 0 0 1 110 40" stroke="#3FF0A0" strokeWidth={14} fill="none" strokeDasharray="4 18" />
        {TX(-120, 80, 'E', 30, '#FF6A6A')}{TX(120, 80, 'F', 30, '#3FF0A0')}{TX(0, 110, 'FULL', 30, '#BFFFF4')}
        <g transform={`translate(0,40) rotate(${a})`}><path d="M -6 0 L 0 -110 L 6 0 Z" fill="#FFFFFF" /></g>
        <circle cy={40} r={14} fill="#BFFFF4" />
      </g>
    </g>
  );
};

/* 7. Otak transparan berisi barisan domino yang jatuh sendiri berurutan (loop) */
export const DominoBrain: React.FC<{t: number}> = ({t}) => {
  const N = 9, ph = (t % 90) / 90;
  return (
    <g>
      <BrainShape fill="#E05AA8" line="#FFFFFF22" t={t} glow="#E05AA8" op={0.28} />
      <path d={BRAIN_PATH} fill="none" stroke="#FFB8DC" strokeWidth={5} />
      {Array.from({length: N}).map((_, i) => {
        const fall = sm((ph * 1.3 - i / N) * 6);
        return (
          <g key={i} transform={`translate(${-120 + i * 30},60) rotate(${fall * 62})`}>
            <rect x={-8} y={-70} width={16} height={70} rx={3} fill="#FFF0F6" />
            <circle cy={-50} r={3} fill="#E05AA8" /><circle cy={-24} r={3} fill="#E05AA8" />
          </g>
        );
      })}
    </g>
  );
};

/* 8. Bola tenis memantul antara tembok (kiri) dan tangan */
export const TennisBounce: React.FC<{t: number; dist?: number}> = ({t, dist = 380}) => {
  const ph = (t % 40) / 40, x = -dist / 2 + Math.abs(Math.sin(ph * Math.PI)) * dist, y = -Math.sin(ph * Math.PI * 2) * 30;
  return (
    <g>
      <rect x={-dist / 2 - 40} y={-200} width={30} height={400} fill="#4A3A5A" />
      {ph < 0.06 || ph > 0.94 ? <circle cx={-dist / 2 - 10} cy={0} r={30} fill="#FFFFFF" opacity={0.3} /> : null}
      <g transform={`translate(${x},${y}) rotate(${t * 12})`}>
        <circle r={26} fill="#D8F04A" /><path d="M -22 -12 Q 0 0 -22 12 M 22 -12 Q 0 0 22 12" stroke="#FFFFFF" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

/* 10. HP bergetar & meluncur di meja ke tangan (slide 0..1) */
export const PhoneSlide: React.FC<{t: number; slide: number; dist?: number}> = ({t, slide, dist = 420}) => {
  const s = sm(slide);
  return (
    <g>
      <rect x={-dist / 2 - 80} y={40} width={dist + 160} height={24} rx={8} fill="#6A4A5A" />
      {[0.2, 0.45, 0.7].map((k, i) => s > k && s < 0.98 && <line key={i} x1={dist / 2 - s * dist + 70 + i * 30} y1={20 - i * 6} x2={dist / 2 - s * dist + 120 + i * 30} y2={20 - i * 6} stroke="#FFFFFF" strokeWidth={3} opacity={0.4} />)}
      <g transform={`translate(${dist / 2 - s * dist + Math.sin(t * 2.6) * 3 * (1 - s)},12) rotate(${90 + Math.sin(t * 3) * 2})`}>
        <PhonePink t={t} w={56} />
      </g>
      {(1 - s) > 0.1 && [0, 1].map((i) => <path key={i} d={`M ${dist / 2 + 50 + i * 14} -10 q 6 10 0 20 q -6 10 0 20`} stroke={PINK} strokeWidth={3} fill="none" opacity={0.6 + 0.4 * Math.sin(t * 2 + i)} />)}
    </g>
  );
};

/* 11. HP terbuka seperti kotak harta: tutup terangkat, cahaya pink blur + sensor bar + badge 18+ keluar */
export const TreasurePhone: React.FC<{t: number; open: number}> = ({t, open}) => {
  const o = sm(open);
  return (
    <g>
      <Halo y={-80} rx={360} ry={300} color={PINK} op={0.55 * o} />
      {Array.from({length: 10}).map((_, i) => {
        const ph = ((t * 0.03 + i / 10) % 1);
        return <circle key={i} cx={(rand(i) - 0.5) * 220 * ph} cy={-40 - ph * 300} r={10 + ph * 26} fill={PINK} opacity={o * (1 - ph) * 0.6} />;
      })}
      <g opacity={o} transform={`translate(0,${-170 - o * 40})`}>
        <rect x={-150} y={-24} width={300} height={48} fill="#0A0A12" transform="rotate(-6)" />
        <g transform="translate(130,-60) rotate(10)"><rect x={-46} y={-22} width={92} height={44} rx={10} fill="#FF2A4A" />{TX(0, 14, '18+', 34, '#FFFFFF')}</g>
      </g>
      <rect x={-170} y={-60} width={340} height={150} rx={18} fill="#1A0E1E" stroke={PINK} strokeWidth={6} />
      <rect x={-150} y={-44} width={300} height={118} rx={10} fill={mix('#3A0C2A', PINK, 0.5 * o)} />
      <g transform={`translate(0,-60) rotate(${-o * 70},-170,0)`}>
        <rect x={-170} y={-36} width={340} height={36} rx={14} fill="#2A1428" stroke={PINK} strokeWidth={6} />
        <circle cx={0} cy={-18} r={8} fill="#E8D08A" />
      </g>
    </g>
  );
};

/* 12. Kotak tisu kena cahaya terakhir (lampu meja padam) — tisu bergoyang halus */
export const TissueLastLight: React.FC<{t: number; light: number}> = ({t, light}) => (
  <g>
    <Halo y={-40} rx={200} ry={160} color="#FFE6C8" op={0.5 * light} />
    <rect x={-110} y={-60} width={220} height={120} rx={12} fill={mix('#3A3A4A', '#8FA8C8', light)} />
    <rect x={-60} y={-66} width={120} height={14} rx={7} fill="#1A1A22" />
    <path d={`M -20 -64 C -30 ${-130 + Math.sin(t * 0.15) * 6} 30 ${-140 + Math.sin(t * 0.15) * 6} 20 -64 Z`} fill={mix('#9A9AA8', '#FFFFFF', light)} />
  </g>
);
/* 12b. Lampu meja padam (on 0..1) */
export const DeskLamp: React.FC<{t: number; on: number}> = ({t, on}) => (
  <g>
    {on > 0.05 && <Halo y={-60} rx={220} ry={180} color="#FFD48A" op={0.5 * on * (0.9 + 0.1 * Math.sin(t * 0.7))} />}
    <rect x={-60} y={90} width={120} height={16} rx={6} fill="#4A3A40" />
    <path d="M 0 90 L -30 0 L 20 -60" stroke="#4A3A40" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M -20 -100 L 70 -60 L 40 -10 L -50 -50 Z" fill={mix('#3A3036', '#FFD48A', on * 0.6)} />
  </g>
);

/* 13. Sinyal di atas kepala jatuh ke 0 bar + jam dinding berputar mundur + butir keringat */
export const SignalDrop: React.FC<{t: number; drop: number}> = ({t, drop}) => {
  const bars = Math.round(4 * (1 - sm(drop)));
  return (
    <g>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-60 + i * 34} y={-20 - i * 22} width={24} height={20 + i * 22} rx={4} fill={i < bars ? '#3FF0A0' : '#3A3448'}
        opacity={i < bars ? 1 : 0.8} />)}
      {bars === 0 && <g opacity={0.6 + 0.4 * Math.sin(t * 0.5)}><path d="M 70 -80 L 110 -40 M 110 -80 L 70 -40" stroke="#FF4A5A" strokeWidth={8} strokeLinecap="round" /></g>}
    </g>
  );
};
export const ReverseClock: React.FC<{t: number}> = ({t}) => (
  <g>
    <Halo rx={160} color="#A06AFF" op={0.3} />
    <circle r={110} fill="#F4F0FA" stroke="#4A3A6A" strokeWidth={12} />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-3} y={-96} width={6} height={i % 3 ? 10 : 18} fill="#4A3A6A" transform={`rotate(${i * 30})`} />)}
    <g transform={`rotate(${-t * 9})`}><rect x={-4} y={-80} width={8} height={84} rx={4} fill="#2A1A3A" /></g>
    <g transform={`rotate(${-t * 0.75})`}><rect x={-6} y={-54} width={12} height={58} rx={6} fill="#2A1A3A" /></g>
    <path d="M 120 -40 A 130 130 0 0 1 60 110" stroke="#FF6A8A" strokeWidth={6} fill="none" /><path d="M 58 112 l 22 -2 l -12 -18 Z" fill="#FF6A8A" />
    <circle r={10} fill="#FF6A8A" />
  </g>
);
export const SweatDrops: React.FC<{t: number}> = ({t}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((t * 0.03 + i / 3) % 1);
      return <path key={i} d={`M ${-60 + i * 60} ${ph * 120} q 10 18 0 26 q -10 -8 0 -26 Z`} fill="#8FE8F8" opacity={1 - ph} />;
    })}
  </g>
);
