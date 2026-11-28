// Ilustrasi BARU — MID-CTA (panggung) + FASE 3 (lorong + kamar anak) + ikon panel neon. Semua dinamis (t = frame); k = progres 0..1.
// Adegan kekerasan SELALU simbolik: bayangan, pintu, benda, bahasa tubuh. Tanpa kontak fisik.
import React from 'react';
import {rand} from '../../theme';
import {useSid} from '../../components/Phone';
import {NeonIconName} from '../../neonPanel';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };

/* ================= MID-CTA ================= */
/* ---------- kain berbentuk kepala (profil samping) yang sobek, dijahit benang emas bercahaya (k 0 = sobek, 1 = utuh & menyala) ---------- */
const HEAD_PROFILE = 'M -150 120 C -214 40 -222 -120 -120 -200 C -40 -262 92 -242 140 -150 C 160 -110 160 -72 150 -40 L 188 0 Q 192 14 170 18 L 168 34 Q 180 42 166 52 Q 176 66 160 78 Q 150 112 108 120 L 90 130 Q 70 160 70 232 L -110 232 Q -120 170 -150 120 Z';
export const StitchedHead: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const id = useSid('sh');
  const N = 9, done = k * N;
  const gap = 16 * (1 - sm(k));
  const A = [-150, -150], B = [118, -34];
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const tear = Array.from({length: N + 1}).map((_, i) => [A[0] + dx * (i / N) + nx * (i % 2 ? 13 : -13), A[1] + dy * (i / N) + ny * (i % 2 ? 13 : -13)] as [number, number]);
  const seam = 'M ' + tear.map(([x, y]) => `${x} ${y}`).join(' L ');
  const needle = tear[Math.min(N, Math.floor(done))];
  return (
    <g>
      <defs>
        <pattern id={`${id}p`} width={14} height={14} patternUnits="userSpaceOnUse"><path d="M 0 7 L 14 7 M 7 0 L 7 14" stroke="#B89A78" strokeWidth={1.2} opacity={0.5} /></pattern>
      </defs>
      <circle r={300} fill="#FFC46A" opacity={0.08 + 0.22 * sm(k)} />
      <path d={HEAD_PROFILE} fill="#D9C2A0" />
      <path d={HEAD_PROFILE} fill={`url(#${id}p)`} />
      <path d={HEAD_PROFILE} fill="none" stroke="#9A7E5A" strokeWidth={4} strokeDasharray="12 9" transform="scale(0.94) translate(-4,6)" />
      <path d="M -180 -40 Q -150 -180 -20 -226" stroke="#F0DEC0" strokeWidth={12} fill="none" opacity={0.5} strokeLinecap="round" />
      {/* tambalan kain kecil di belakang kepala */}
      <rect x={-150} y={20} width={60} height={50} rx={6} fill="#C9AE88" transform="rotate(-12 -120 45)" />
      {/* sobekan gelap */}
      <path d={seam} stroke="#1A120C" strokeWidth={gap * 1.7 + 2} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={1 - sm(k) * 0.9} />
      {/* jahitan benang emas melintang sobekan */}
      {tear.slice(0, -1).map(([x, y], i) => {
        const on = clamp(done - i);
        if (on <= 0) return null;
        return (
          <g key={i} opacity={on}>
            <path d={`M ${x - nx * 34} ${y - ny * 34} L ${x + nx * 34 + dx / L * 14} ${y + ny * 34 + dy / L * 14}`} stroke="#FFD166" strokeWidth={7} strokeLinecap="round" />
            <path d={`M ${x - nx * 34} ${y - ny * 34} L ${x + nx * 34 + dx / L * 14} ${y + ny * 34 + dy / L * 14}`} stroke="#FFF4C2" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={x} cy={y} r={20} fill="#FFD166" opacity={0.25 + 0.15 * Math.sin(t * 0.3 + i)} />
          </g>
        );
      })}
      {/* jarum + benang menjuntai */}
      {k < 0.995 && (
        <g transform={`translate(${needle[0] + 30 + Math.sin(t * 0.6) * 10},${needle[1] - 40}) rotate(${20 + Math.sin(t * 0.6) * 12})`}>
          <rect x={-3} y={-60} width={6} height={90} rx={3} fill="#E8ECF4" />
          <path d="M 0 30 L -3 26 L 3 26 Z" fill="#E8ECF4" />
          <ellipse cx={0} cy={-50} rx={2} ry={6} fill="#2A2A32" />
          <path d={`M 0 -50 Q 60 -90 ${80 + Math.sin(t * 0.2) * 20} -10`} stroke="#FFD166" strokeWidth={3} fill="none" />
        </g>
      )}
      {sm(k) > 0.9 && Array.from({length: 10}).map((_, i) => {
        const ph = (t * 0.02 + i / 10) % 1;
        return <circle key={i} cx={(rand(i) - 0.5) * 360} cy={200 - ph * 460} r={3 + rand(i * 2) * 3} fill="#FFE6A0" opacity={(1 - ph) * 0.9} />;
      })}
    </g>
  );
};

/* ---------- panel tombol lift "naik" menyala, cahaya tombol memancar lurus ke atas (ke arah bio) ---------- */
export const LiftPanel: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const press = k > 0.05 && k < 0.25 ? 6 : 0;
  const lit = sm((k - 0.1) / 0.2);
  return (
    <g>
      {/* sinar dari tombol naik ke atas */}
      <path d={`M -36 -80 L 36 -80 L ${60 + lit * 30} ${-700} L ${-60 - lit * 30} ${-700} Z`} fill="#FFC23F" opacity={0.22 * lit} />
      {Array.from({length: 8}).map((_, i) => {
        const ph = (t * 0.04 + i / 8) % 1;
        return <circle key={i} cx={(rand(i) - 0.5) * 70} cy={-90 - ph * 600} r={3 + rand(i) * 3} fill="#FFE6A0" opacity={(1 - ph) * lit} />;
      })}
      <rect x={-110} y={-200} width={220} height={400} rx={18} fill="#4A4F5E" />
      <rect x={-96} y={-186} width={192} height={372} rx={12} fill="#6E7486" />
      {Array.from({length: 12}).map((_, i) => <line key={i} x1={-96} y1={-180 + i * 31} x2={96} y2={-180 + i * 31} stroke="#7E8496" strokeWidth={2} opacity={0.6} />)}
      {/* layar lantai */}
      <rect x={-60} y={-170} width={120} height={56} rx={8} fill="#0E1018" />
      <text x={0} y={-130} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={32} fill="#FFC23F" opacity={0.6 + 0.4 * lit}>{lit > 0.5 ? 'UP' : '1'}</text>
      {/* tombol naik */}
      <g transform={`translate(0,${-40 + press})`}>
        <circle r={64} fill="#FFC23F" opacity={0.25 * lit} />
        <circle r={46} fill={lit > 0.3 ? '#FFC23F' : '#2A2E3A'} stroke="#C9CED8" strokeWidth={6} />
        <path d="M 0 -22 L 20 12 L -20 12 Z" fill={lit > 0.3 ? '#3A2A08' : '#8A90A0'} />
      </g>
      {/* tombol turun (redup) */}
      <g transform="translate(0,80)"><circle r={46} fill="#2A2E3A" stroke="#C9CED8" strokeWidth={6} /><path d="M 0 22 L 20 -12 L -20 -12 Z" fill="#5A6070" /></g>
    </g>
  );
};

/* ================= FASE 3 ================= */
/* ---------- bayangan suami di dinding berubah jadi bayangan monster bertanduk (hanya bayangan) ---------- */
export const MonsterShadow: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const id = useSid('ms');
  const m = sm(k);
  const breathe = Math.sin(t * 0.12) * 6 * m;
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={5} /></filter></defs>
      <g filter={`url(#${id}b)`} opacity={0.88}>
        {/* kepala + tanduk tumbuh */}
        <ellipse cx={0} cy={-260} rx={100 + m * 20} ry={110 + m * 10} fill="#070205" />
        {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 60} -330 Q ${sd * (90 + m * 60)} ${-380 - m * 110} ${sd * (40 + m * 110)} ${-420 - m * 150} Q ${sd * (110 + m * 40)} -360 ${sd * 90} -300 Z`} fill="#070205" opacity={m} />)}
        {/* badan membesar + bahu berduri */}
        <path d={`M ${-130 - m * 80} -160 Q 0 ${-200 - breathe} ${130 + m * 80} -160 L ${150 + m * 90} 240 L ${-150 - m * 90} 240 Z`} fill="#070205" />
        {[-1, 1].map((sd) => Array.from({length: 3}).map((_, i) => <path key={`${sd}${i}`} d={`M ${sd * (110 + m * 60 + i * 20)} ${-170 + i * 30} l ${sd * 40 * m} ${-30 * m} l ${-sd * 10} 40 Z`} fill="#070205" />))}
        {/* lengan cakar */}
        {[-1, 1].map((sd) => <path key={`a${sd}`} d={`M ${sd * (140 + m * 80)} -130 Q ${sd * (240 + m * 60)} 0 ${sd * (200 + m * 70)} 140 l ${sd * 30 * m} 30 l ${-sd * 20} -6 l ${sd * 10} 30 l ${-sd * 26} -26 Z`} fill="#070205" />)}
      </g>
      {/* mata merah samar (hanya saat sudah jadi monster) */}
      {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 36} cy={-262} rx={14} ry={6} fill="#FF2A3A" opacity={m * (0.5 + 0.3 * Math.sin(t * 0.2))} />)}
    </g>
  );
};

/* ---------- telepon kaleng: tali kusut & kendor antara dua titik (scene) ---------- */
export const TangledString: React.FC<{t: number; x0: number; y0: number; x1: number; y1: number; k?: number}> = ({t, x0, y0, x1, y1, k = 1}) => {
  const mx = (x0 + x1) / 2, my = Math.max(y0, y1) + 120 * k + Math.sin(t * 0.08) * 10;
  const knot = Array.from({length: 7}).map((_, i) => {
    const a = (i / 7) * Math.PI * 4 + t * 0.02;
    return `${mx + Math.cos(a) * (40 + i * 5) * k} ${my - 30 + Math.sin(a * 1.3) * 28 * k}`;
  }).join(' L ');
  return (
    <g>
      <path d={`M ${x0} ${y0} Q ${(x0 + mx) / 2} ${my} ${mx - 50 * k} ${my - 10} L ${knot} L ${mx + 50 * k} ${my - 10} Q ${(x1 + mx) / 2} ${my} ${x1} ${y1}`}
        stroke="#E8DCC6" strokeWidth={3.5} fill="none" strokeLinejoin="round" />
    </g>
  );
};
export const TinCan: React.FC<{s?: number; rot?: number}> = ({s = 1, rot = 0}) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <rect x={-22} y={-30} width={44} height={60} rx={6} fill="#B9BEC8" />
    <rect x={-22} y={-30} width={44} height={8} fill="#8A909C" /><rect x={-22} y={22} width={44} height={8} fill="#8A909C" />
    <rect x={-22} y={-14} width={44} height={22} fill="#3A6AB0" opacity={0.85} />
  </g>
);

/* ---------- bata-bata naik sendiri menjadi tembok tinggi (k 0..1 = tinggi) ---------- */
export const BrickWall: React.FC<{t: number; k?: number; w?: number; rows?: number}> = ({t, k = 1, w = 300, rows = 12}) => {
  const bw = 60, bh = 34, cols = Math.round(w / bw);
  return (
    <g>
      {Array.from({length: rows}).map((_, r) => Array.from({length: cols + (r % 2)}).map((__, c) => {
        const idx = r * cols + c, p = clamp(k * rows - r - c * 0.12);
        if (p <= 0) return null;
        const x = -w / 2 + c * bw - (r % 2) * bw / 2, y = -r * bh - bh;
        const rise = (1 - sm(p)) * 60;
        return (
          <g key={`${r}-${c}`} transform={`translate(0,${rise})`} opacity={sm(p * 2)}>
            <rect x={Math.max(-w / 2, x) + 2} y={y + 2} width={Math.min(bw, w / 2 - x, x + bw + w / 2) - 4} height={bh - 4} rx={3} fill={idx % 3 ? '#8A3A2E' : '#9A4636'} />
            <rect x={Math.max(-w / 2, x) + 2} y={y + 2} width={Math.min(bw, w / 2 - x, x + bw + w / 2) - 4} height={6} rx={3} fill="#C06A52" opacity={0.5} />
          </g>
        );
      }))}
      <rect x={-w / 2 - 10} y={-6} width={w + 20} height={12} fill="#3A1A16" opacity={0.6} />
      {k > 0.05 && k < 0.98 && Array.from({length: 4}).map((_, i) => { const ph = (t * 0.05 + i / 4) % 1; return <circle key={i} cx={(rand(i) - 0.5) * w} cy={-k * rows * bh - ph * 30} r={6 + ph * 10} fill="#C9A090" opacity={(1 - ph) * 0.4} />; })}
    </g>
  );
};

/* ---------- pintu dibanting (k 0 terbuka -> 1 tertutup keras) ---------- */
export const SlamDoor: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const c = sm(k), slam = k > 0.92 ? Math.max(0, 1 - (t % 20) / 20) : 0;
  return (
    <g>
      <rect x={-170} y={-420} width={340} height={840} fill="#0C0608" />
      <rect x={-150} y={-400} width={300} height={800} fill="#FF7A5A" opacity={0.12 * (1 - c)} />
      <g transform={`translate(-150,0) scale(${0.18 + c * 0.82},1) translate(150,0)`}>
        <rect x={-150} y={-400} width={300} height={800} fill="#6A3E30" />
        {[0, 1].map((i) => <rect key={i} x={-110} y={-360 + i * 380} width={220} height={340} rx={8} fill="none" stroke="#4E2A20" strokeWidth={10} />)}
        <circle cx={110} cy={20} r={14} fill="#D9B46A" />
      </g>
      <rect x={-186} y={-436} width={372} height={856} fill="none" stroke="#3A1A16" strokeWidth={32} />
      {k > 0.9 && [0, 1, 2, 3].map((i) => <path key={i} d={`M ${-200 - i * 10} ${-300 + i * 180} l -60 ${-20 + i * 14}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7 * (0.4 + slam)} />)}
      {k > 0.9 && Array.from({length: 6}).map((_, i) => { const ph = (t * 0.04 + i / 6) % 1; return <circle key={`d${i}`} cx={-150 + rand(i) * 300} cy={400 - ph * 60} r={6 + ph * 14} fill="#C9A090" opacity={(1 - ph) * 0.35} />; })}
    </g>
  );
};

/* ---------- ikon "mute" di depan mulut istri (pembungkaman) ---------- */
export const MuteBadge: React.FC<{t: number; k?: number; s?: number}> = ({t, k = 1, s = 1}) => (
  <g transform={`scale(${s * (0.4 + 0.6 * sm(k * 1.6))})`} opacity={sm(k * 3)}>
    <circle r={66} fill="#FF2A3A" opacity={0.2 + 0.1 * Math.sin(t * 0.3)} />
    <circle r={50} fill="#1A0A0E" stroke="#FFFFFF" strokeWidth={6} />
    <path d="M -26 -12 L -12 -12 L 6 -28 L 6 28 L -12 12 L -26 12 Z" fill="#FFFFFF" />
    <path d="M 16 -16 L 34 16 M 34 -16 L 16 16" stroke="#FF3344" strokeWidth={7} strokeLinecap="round" />
  </g>
);
/* ---------- asap merah merembes dari celah bawah pintu ---------- */
export const RedSmoke: React.FC<{t: number; w?: number; k?: number}> = ({t, w = 300, k = 1}) => {
  const id = useSid('rs');
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={10} /></filter></defs>
      <g filter={`url(#${id}b)`}>
        {Array.from({length: 9}).map((_, i) => {
          const ph = (t * 0.012 + i / 9) % 1;
          return <ellipse key={i} cx={-w / 2 + rand(i) * w + ph * 120} cy={-ph * 200} rx={40 + ph * 90} ry={20 + ph * 40} fill="#E0202E" opacity={(1 - ph) * 0.45 * k} />;
        })}
      </g>
    </g>
  );
};

/* ---------- awan badai (lepas dari kepala, melayang ke seluruh ruangan) ---------- */
export const StormCloud: React.FC<{t: number; s?: number; rain?: number}> = ({t, s = 1, rain = 1}) => {
  const fl = rand(Math.floor(t / 4)) > 0.82;
  return (
    <g transform={`scale(${s})`}>
      {fl && <circle r={200} fill="#E8F1FF" opacity={0.15} />}
      {[[-110, 10, 70], [-40, -30, 88], [50, -20, 84], [120, 14, 62], [0, 30, 76]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#3A3F52' : '#2C3044'} />)}
      <path d="M -170 50 Q 0 84 170 50" stroke="#20243A" strokeWidth={22} fill="none" strokeLinecap="round" />
      {fl && <path d="M 10 60 L -22 140 L 10 136 L -12 210 L 50 110 L 18 114 L 40 60 Z" fill="#FFE27A" />}
      {rain > 0 && Array.from({length: 14}).map((_, i) => {
        const ph = (t * 0.07 + i / 14) % 1;
        return <line key={i} x1={-130 + i * 20} y1={70 + ph * 260} x2={-138 + i * 20} y2={94 + ph * 260} stroke="#9FC4FF" strokeWidth={3.5} opacity={(1 - ph) * rain} />;
      })}
    </g>
  );
};

/* ---------- gelombang suara merah keras (bentakan, tanpa kata) ---------- */
export const RedShout: React.FC<{t: number; k?: number}> = ({t, k = 1}) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => {
      const ph = (t * 0.045 + i / 5) % 1, r = 40 + ph * 420;
      return <path key={i} d={`M ${r * 0.3} ${-r * 0.8} A ${r} ${r} 0 0 1 ${r * 0.3} ${r * 0.8}`} stroke="#FF2A3A" strokeWidth={18 - ph * 12} fill="none" opacity={(1 - ph) * 0.85 * k}
        strokeDasharray={i % 2 ? '28 12' : undefined} transform={`translate(${Math.sin(t * 1.3 + i) * 3},0)`} />;
    })}
    {/* duri kecil di ujung gelombang (pengganti kata kasar) */}
    {Array.from({length: 6}).map((_, i) => {
      const ph = (t * 0.045 + i / 6) % 1, a = -0.7 + (i / 5) * 1.4, r = 80 + ph * 380;
      return <path key={`s${i}`} d="M 0 -6 L 22 0 L 0 6 Z" fill="#FF6A70" transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r}) rotate(${(a * 180) / Math.PI})`} opacity={(1 - ph) * k} />;
    })}
  </g>
);
/* ---------- bingkai foto di dinding (bergoyang saat bentakan) ---------- */
export const WallFrames: React.FC<{t: number; shake?: number}> = ({t, shake = 0}) => (
  <g>
    {[[-180, -40, 120, 150, '#E8C9A0'], [0, -70, 140, 110, '#C9D8E8'], [180, -30, 110, 140, '#E8D0C9']].map(([x, y, w, h, c], i) => {
      const sw = shake * Math.sin(t * 1.1 + i * 2) * (10 + i * 4);
      return (
        <g key={i} transform={`translate(${x},${y as number - (h as number) / 2 - 30}) rotate(${sw})`}>
          <line x1={0} y1={0} x2={0} y2={30} stroke="#6A5040" strokeWidth={2} />
          <g transform={`translate(0,${30 + (h as number) / 2})`}>
            <rect x={-(w as number) / 2 - 10} y={-(h as number) / 2 - 10} width={(w as number) + 20} height={(h as number) + 20} rx={4} fill="#5A3A2A" />
            <rect x={-(w as number) / 2} y={-(h as number) / 2} width={w as number} height={h as number} fill={c as string} opacity={0.75} />
            {/* foto keluarga sederhana: 3 kepala bulat */}
            {[-1, 0, 1].map((j) => <circle key={j} cx={j * (w as number) * 0.25} cy={-6 + Math.abs(j) * 6} r={(w as number) * (j === 0 ? 0.1 : 0.12)} fill="#8A6A5A" opacity={0.6} />)}
          </g>
        </g>
      );
    })}
  </g>
);
/* ---------- mainan jatuh dari rak (bola, balok, mobil-mobilan) ---------- */
export const FallingToys: React.FC<{t: number; k?: number}> = ({t, k = 1}) => (
  <g>
    <rect x={-200} y={-140} width={400} height={18} rx={6} fill="#6E4A36" />
    {[[-140, '#3A6AB0', 'box'], [-40, '#E04A4A', 'ball'], [70, '#E8B040', 'car'], [150, '#5AB070', 'box']].map(([x, c, ty], i) => {
      const p = clamp(k * 1.6 - i * 0.2), fall = p * p;
      const y = -160 + fall * 300, rot = fall * (i % 2 ? 160 : -140);
      return (
        <g key={i} transform={`translate(${(x as number) + fall * (i - 1.5) * 30},${y}) rotate(${rot})`}>
          {ty === 'ball' ? <circle r={22} fill={c as string} /> : ty === 'car' ? <g><rect x={-30} y={-16} width={60} height={22} rx={6} fill={c as string} /><circle cx={-16} cy={8} r={8} fill="#2A2A32" /><circle cx={16} cy={8} r={8} fill="#2A2A32" /></g>
            : <rect x={-20} y={-20} width={40} height={40} rx={5} fill={c as string} />}
        </g>
      );
    })}
  </g>
);

/* ---------- robot kayu mainan anak patah di lantai ---------- */
export const BrokenRobot: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const b = sm(k);
  return (
    <g>
      <ellipse cx={0} cy={40} rx={220} ry={24} fill="#000" opacity={0.3} />
      {/* badan */}
      <g transform={`rotate(${b * 70} 0 30)`}><rect x={-50} y={-70} width={100} height={110} rx={10} fill="#C08A5A" /><rect x={-30} y={-50} width={60} height={40} rx={6} fill="#8A5A3A" />
        <circle cx={-14} cy={-30} r={6} fill="#FFC23F" opacity={0.3 + 0.2 * Math.sin(t * 0.4)} /></g>
      {/* kepala terlepas menggelinding */}
      <g transform={`translate(${-40 - b * 120},${-110 + b * 120}) rotate(${-b * 120})`}>
        <rect x={-36} y={-34} width={72} height={64} rx={10} fill="#D09A6A" /><circle cx={-14} cy={-6} r={7} fill="#2A1A14" /><circle cx={14} cy={-6} r={7} fill="#2A1A14" />
        <rect x={-4} y={-54} width={8} height={22} fill="#8A5A3A" /><circle cx={0} cy={-58} r={8} fill="#E04A4A" />
      </g>
      {/* lengan patah */}
      <g transform={`translate(${90 + b * 60},${-20 + b * 50}) rotate(${50 + b * 60})`}><rect x={-14} y={-50} width={28} height={90} rx={10} fill="#C08A5A" />
        <path d="M -14 -50 l 6 -12 l 8 10 l 8 -12 l 6 14" fill="#E8C9A0" /></g>
      {/* serpihan kayu */}
      {Array.from({length: 8}).map((_, i) => <path key={i} d="M 0 0 l 18 -4 l -16 8 Z" fill="#E8C9A0" transform={`translate(${(rand(i) - 0.5) * 300},${20 + rand(i * 2) * 20}) rotate(${rand(i * 3) * 360})`} opacity={b} />)}
    </g>
  );
};

/* ---------- bayangan tangan terangkat di dinding: muncul, MEMBEKU (beku kebiruan), lalu memudar ---------- */
export const HandShadow: React.FC<{t: number; k?: number}> = ({t, k = 0}) => {
  const id = useSid('hs');
  const appear = sm(k / 0.3), freeze = sm((k - 0.3) / 0.25), fade = sm((k - 0.6) / 0.4);
  return (
    <g opacity={appear * (1 - fade)}>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={6 - freeze * 3} /></filter></defs>
      <g filter={`url(#${id}b)`} transform={`translate(0,${-appear * 30})`}>
        <path d="M -40 260 L -60 40 Q -70 -40 -50 -60 L -44 -150 Q -40 -170 -26 -160 L -20 -80 L -10 -190 Q -2 -210 10 -192 L 10 -84 L 26 -170 Q 36 -186 46 -168 L 36 -70 L 60 -130 Q 74 -140 80 -122 L 56 0 Q 60 60 40 260 Z" fill="#070205" opacity={0.85} />
      </g>
      {/* lapisan beku */}
      {freeze > 0 && (
        <g opacity={freeze}>
          <path d="M -40 260 L -60 40 Q -70 -40 -50 -60 L -44 -150 Q -40 -170 -26 -160 L -20 -80 L -10 -190 Q -2 -210 10 -192 L 10 -84 L 26 -170 Q 36 -186 46 -168 L 36 -70 L 60 -130 Q 74 -140 80 -122 L 56 0 Q 60 60 40 260"
            stroke="#BFE6FF" strokeWidth={4} fill="none" opacity={0.85} strokeDasharray="14 6" />
          {Array.from({length: 7}).map((_, i) => (
            <g key={i} transform={`translate(${-40 + rand(i) * 100},${-160 + rand(i * 3) * 360}) rotate(${t * 0.4 + i * 30})`}>
              {[0, 60, 120].map((r) => <line key={r} x1={-9} x2={9} y1={0} y2={0} stroke="#E8F7FF" strokeWidth={2.5} transform={`rotate(${r})`} />)}
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

/* ---------- miniatur rumah: jendela berlampu hangat + hati di atap; lampu mati satu-satu, awan gelap mengepung ---------- */
// off 0..1 = proporsi jendela yang sudah padam (jendela kamar anak index 4 selalu menyala lampu tidur kecil); clouds 0..1
export const HeartHouse: React.FC<{t: number; off?: number; clouds?: number}> = ({t, off = 0, clouds = 0}) => {
  const id = useSid('hh');
  const win = [[-110, -40], [0, -40], [110, -40], [-110, 70], [110, 70]];
  const order = [2, 0, 1, 3]; // urutan padam; index 4 = kamar anak
  const lit = (i: number) => (i === 4 ? 1 : 1 - clamp(off * 4 - order.indexOf(i)));
  const warm = 1 - off;
  return (
    <g>
      <defs><filter id={`${id}b`}><feGaussianBlur stdDeviation={14} /></filter></defs>
      <circle cx={0} cy={0} r={380} fill="#FFC56A" opacity={0.16 * warm} />
      {/* atap + hati */}
      <path d="M -230 -110 L 0 -300 L 230 -110 Z" fill="#7A3A30" />
      <path d="M -250 -100 L 0 -312 L 250 -100" stroke="#5A2620" strokeWidth={20} fill="none" strokeLinejoin="round" />
      <g transform="translate(0,-190)">
        <circle r={60} fill="#FF6F91" opacity={0.25 * warm + 0.05} />
        <path d="M 0 -8 C -12 -30 -44 -24 -40 2 C -38 20 -14 34 0 46 C 14 34 38 20 40 2 C 44 -24 12 -30 0 -8 Z" fill={warm > 0.3 ? '#FF6F91' : '#5A2A34'} transform={`scale(${1 + 0.06 * Math.sin(t * 0.25) * warm})`} />
      </g>
      {/* dinding */}
      <rect x={-200} y={-110} width={400} height={300} fill="#E8D6BC" />
      <rect x={-200} y={-110} width={400} height={300} fill="#0A0610" opacity={off * 0.6} />
      <rect x={-34} y={90} width={68} height={100} rx={6} fill="#6A4030" />
      {win.map(([x, y], i) => {
        const L = lit(i), kid = i === 4;
        return (
          <g key={i}>
            <rect x={x - 34} y={y - 34} width={68} height={68} rx={4} fill={kid ? '#FFD98A' : '#FFD08A'} opacity={0.12 + 0.88 * L * (kid ? 0.7 + 0.15 * Math.sin(t * 0.15) : 1)} />
            <rect x={x - 34} y={y - 34} width={68} height={68} rx={4} fill="none" stroke="#5A3A2A" strokeWidth={8} />
            <line x1={x} y1={y - 34} x2={x} y2={y + 34} stroke="#5A3A2A" strokeWidth={5} /><line x1={x - 34} y1={y} x2={x + 34} y2={y} stroke="#5A3A2A" strokeWidth={5} />
            {L > 0.1 && <circle cx={x} cy={y} r={70} fill="#FFC56A" opacity={0.14 * L} />}
            {kid && <path d={`M ${x - 6} ${y - 14} a 12 12 0 1 0 8 22 a 9 9 0 1 1 -8 -22 Z`} fill="#FFF0B0" />}
          </g>
        );
      })}
      {/* awan gelap mengepung */}
      {clouds > 0 && (
        <g filter={`url(#${id}b)`} opacity={clouds}>
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 + t * 0.006, r = 560 - clouds * 120 + Math.sin(t * 0.03 + i) * 20;
            return <ellipse key={i} cx={Math.cos(a) * r} cy={-60 + Math.sin(a) * r * 0.72} rx={170} ry={100} fill={i % 2 ? '#0A060C' : '#16101C'} />;
          })}
        </g>
      )}
      {clouds > 0.6 && rand(Math.floor(t / 5)) > 0.9 && <path d="M 300 -360 L 270 -280 L 296 -282 L 262 -190" stroke="#E8F1FF" strokeWidth={5} fill="none" opacity={0.7} />}
    </g>
  );
};

/* ================= IKON PANEL NEON (±60 px, garis neon + denyut) ================= */
export const NeonIcon: React.FC<{name: NeonIconName; c: string; s?: number; t?: number}> = ({name, c, s = 54, t = 0}) => {
  const k = s / 54, pulse = 0.75 + 0.25 * Math.sin(t * 0.18);
  const st = {stroke: c, strokeWidth: 3.6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const core = {stroke: '#FFFFFF', strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, opacity: 0.85};
  const draw = (el: React.ReactNode) => (
    <g>
      <g style={{filter: `drop-shadow(0 0 ${4 * pulse}px ${c}) drop-shadow(0 0 ${9 * pulse}px ${c})`}}>{el}</g>
    </g>
  );
  let g: React.ReactNode = null;
  if (name === 'cracked_rings') {
    const d1 = 'M -6 -2 A 14 14 0 1 1 -6 -1.9', d2 = 'M 6 -2 A 14 14 0 1 0 6 -1.9';
    g = (
      <g>
        <circle cx={-8} cy={2} r={14} {...st} /><circle cx={8} cy={2} r={14} {...st} />
        <path d="M -8 -12 L -3 -6 L -9 -1 L -4 4" {...st} stroke="#FFFFFF" strokeWidth={2} />
        <path d="M 13 10 L 9 14 L 14 18" {...st} stroke="#FFFFFF" strokeWidth={2} />
        <path d="M -8 -12 l -2 -6 l 4 0 Z" fill={c} stroke="none" />
        <circle cx={-8} cy={2} r={14} {...core} /><circle cx={8} cy={2} r={14} {...core} />
        <path d={d1} opacity={0} /><path d={d2} opacity={0} />
      </g>
    );
  } else if (name === 'cracked_gear') {
    const teeth = Array.from({length: 8}).map((_, i) => `M ${Math.cos((i / 8) * Math.PI * 2) * 15} ${Math.sin((i / 8) * Math.PI * 2) * 15} L ${Math.cos((i / 8) * Math.PI * 2) * 22} ${Math.sin((i / 8) * Math.PI * 2) * 22}`).join(' ');
    g = (
      <g transform={`rotate(${t * 0.3})`}>
        <circle r={15} {...st} /><path d={teeth} {...st} strokeWidth={6} /><circle r={5} {...st} />
        <path d="M 4 -15 L 0 -6 L 6 0 L 2 10 L 8 15" {...st} stroke="#FFFFFF" strokeWidth={2.2} />
        <circle r={15} {...core} />
      </g>
    );
  } else if (name === 'glow_shield') {
    g = (
      <g>
        <path d="M 0 -22 L 18 -14 L 16 6 Q 12 18 0 24 Q -12 18 -16 6 L -18 -14 Z" fill={c} opacity={0.25 * pulse} />
        <path d="M 0 -22 L 18 -14 L 16 6 Q 12 18 0 24 Q -12 18 -16 6 L -18 -14 Z" {...st} />
        <path d="M -7 0 L -2 6 L 8 -6" {...st} stroke="#FFFFFF" strokeWidth={2.6} />
        <path d="M 0 -22 L 18 -14 L 16 6 Q 12 18 0 24 Q -12 18 -16 6 L -18 -14 Z" {...core} />
      </g>
    );
  } else {
    g = (
      <g>
        <path d="M -20 -2 L 0 -20 L 20 -2" {...st} /><path d="M -15 -6 L -15 20 L 15 20 L 15 -6" {...st} />
        <rect x={-5} y={8} width={10} height={12} {...st} strokeWidth={2.6} />
        <path d="M 4 -14 L -1 -6 L 5 -1 L -2 7" {...st} stroke="#FFFFFF" strokeWidth={2} />
        <path d="M -15 -6 L -15 20 L 15 20 L 15 -6" {...core} />
      </g>
    );
  }
  return <g transform={`scale(${k})`}>{draw(g)}</g>;
};
