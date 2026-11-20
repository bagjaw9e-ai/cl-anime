import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix, rand} from '../theme';
import {useSid} from './Phone';

/* Background ruangan (1080x1920). Lantai/horizon ±y 1150; karakter berdiri di y≈1250 (zona tengah 420-1250).
 * Gaya mengikuti referensi: flat, tanpa outline, gradasi lembut, string lights + bokeh, vignette.
 * dim = 0..1 latar digelapkan (fokus pindah ke ilustrasi); blur = px depth of field. */

type Mood = 'night' | 'rain' | 'morning';
type P = {mood: Mood; dim?: number; lampOn?: number; doorClosed?: number; curtainOpen?: number; lightsOn?: number; clock?: boolean; hanger?: number};

const PAL = {
  night: {wall: '#2A1838', wall2: '#1C1028', floor: '#24142C', floor2: '#140A18', win: '#0E1430', accent: '#FF4D7A', lamp: '#FFB36B'},
  rain: {wall: '#4A4A66', wall2: '#363650', floor: '#3A3446', floor2: '#262232', win: '#7E8AA8', accent: '#8FA0C8', lamp: '#FFD9A0'},
  morning: {wall: '#F2D9B8', wall2: '#E8C49A', floor: '#C98E62', floor2: '#A86E48', win: '#BFE6F5', accent: '#FFB547', lamp: '#FFE8B0'},
};

export const StringLights: React.FC<{y?: number; color?: string; on?: number}> = ({y = 300, color = '#FFD27A', on = 1}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d={`M -20 ${y} Q 270 ${y + 70} 540 ${y + 10} Q 810 ${y - 50} 1100 ${y + 40}`} stroke="#1A1018" strokeWidth={3} fill="none" opacity={0.6} />
      {Array.from({length: 16}).map((_, i) => {
        const x = -10 + i * 72, tt = x / 1100;
        const yy = tt < 0.5 ? y + 70 * 4 * tt * (1 - tt) * 0.9 + 4 : y + 10 - 60 * Math.sin((tt - 0.5) * Math.PI) + 40 * (tt - 0.5) * 2;
        const tw = 0.7 + 0.3 * Math.sin(f * 0.08 + i * 1.7);
        return (
          <g key={i}>
            <circle cx={x} cy={yy + 10} r={22} fill={color} opacity={0.18 * on * tw} />
            <circle cx={x} cy={yy + 10} r={7} fill={color} opacity={(0.35 + 0.65 * on) * tw} />
          </g>
        );
      })}
    </g>
  );
};

export const Bokeh: React.FC<{n?: number; color?: string; seed?: number; ymin?: number; ymax?: number}> = ({n = 14, color = '#FFD27A', seed = 2, ymin = 150, ymax = 900}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const x = rand(seed + i) * 1080, y = ymin + rand(seed + i * 3.3) * (ymax - ymin) + Math.sin(f * 0.02 + i) * 8;
        return <circle key={i} cx={x} cy={y} r={14 + rand(seed + i * 7) * 34} fill={color} opacity={0.06 + 0.06 * Math.sin(f * 0.04 + i)} />;
      })}
    </g>
  );
};

const Rain: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({length: 26}).map((_, i) => {
        const px = x + rand(i) * w, ph = ((f * (14 + rand(i * 3) * 8) + rand(i * 5) * h) % h);
        return <line key={i} x1={px} y1={y + ph} x2={px - 6} y2={y + ph + 34} stroke="#DCE6F5" strokeWidth={3} opacity={0.45} strokeLinecap="round" />;
      })}
      {Array.from({length: 7}).map((_, i) => (
        <path key={'d' + i} d={`M ${x + 20 + rand(i * 9) * (w - 40)} ${y + 20 + rand(i * 4) * (h - 80)} q 4 18 0 ${30 + rand(i) * 30}`} stroke="#E8F0FA" strokeWidth={5}
          fill="none" opacity={0.35} strokeLinecap="round" />
      ))}
    </g>
  );
};

/** Kamar (malam / hujan / pagi): kasur, meja + lampu meja, jendela, poster, rak, pintu, jam dinding. */
export const Bedroom: React.FC<P> = ({mood, dim = 0, lampOn = 1, doorClosed = 0, curtainOpen = 1, lightsOn = 1, clock = true, hanger = 0}) => {
  const f = useCurrentFrame();
  const p = PAL[mood];
  const id = useSid('bed');
  const sun = mood === 'morning';
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.wall2} /><stop offset="1" stopColor={p.wall} /></linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.floor} /><stop offset="1" stopColor={p.floor2} /></linearGradient>
        <radialGradient id={`${id}lamp`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={p.lamp} stopOpacity={0.55} /><stop offset="1" stopColor={p.lamp} stopOpacity={0} /></radialGradient>
        <filter id={`${id}blur`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={28} /></filter>
        <linearGradient id={`${id}sun`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF3C4" stopOpacity={0.55} /><stop offset="1" stopColor="#FFF3C4" stopOpacity={0} /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#${id}w)`} />
      {/* lis dinding */}
      <rect y={1110} width={1080} height={16} fill={mix(p.wall, '#000000', 0.25)} />
      <rect y={1126} width={1080} height={800} fill={`url(#${id}f)`} />
      {/* karpet */}
      <ellipse cx={540} cy={1290} rx={420} ry={70} fill={mix(p.floor, p.accent, 0.25)} opacity={0.8} />
      {/* jendela */}
      <g transform="translate(90,430)">
        <rect x={-14} y={-14} width={318} height={388} rx={18} fill={mix(p.wall, '#FFFFFF', sun ? 0.5 : 0.08)} />
        <rect width={290} height={360} rx={10} fill={p.win} />
        {mood === 'night' && (
          <g>
            <circle cx={210} cy={80} r={34} fill="#F5E6DA" opacity={0.9} />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10 + i * 56} y={200 - (i % 3) * 40} width={46} height={170} fill="#1A1A3A" />)}
            {Array.from({length: 14}).map((_, i) => <rect key={'w' + i} x={20 + (i % 5) * 56} y={230 + Math.floor(i / 5) * 40} width={10} height={14} fill="#FFD27A" opacity={0.6} />)}
          </g>
        )}
        {mood === 'rain' && (
          <g>
            <rect width={290} height={360} fill="#8A96B4" />
            {[0, 1, 2].map((i) => <ellipse key={i} cx={60 + i * 100} cy={70 + (i % 2) * 30} rx={90} ry={40} fill="#A8B2CA" opacity={0.8} />)}
            <Rain x={0} y={0} w={290} h={360} />
          </g>
        )}
        {sun && (
          <g>
            <circle cx={200} cy={90} r={46} fill="#FFE27A" />
            <ellipse cx={90} cy={260} rx={140} ry={50} fill="#9FD68A" />
            {[0, 1, 2].map((i) => <ellipse key={i} cx={40 + i * 110} cy={70 + i * 20} rx={50} ry={18} fill="#FFFFFF" opacity={0.8} />)}
          </g>
        )}
        <rect x={140} width={10} height={360} fill={mix(p.wall, '#FFFFFF', sun ? 0.5 : 0.08)} />
        <rect y={175} width={290} height={10} fill={mix(p.wall, '#FFFFFF', sun ? 0.5 : 0.08)} />
        {/* tirai */}
        <path d={`M -30 -30 L ${-30 + 160 * (1 - curtainOpen) + 40} -30 Q ${-20 + 150 * (1 - curtainOpen)} 200 ${-30 + 160 * (1 - curtainOpen) + 30} 400 L -30 400 Z`} fill={sun ? '#E8735A' : mix(p.accent, '#000000', 0.5)} opacity={0.95} />
        <path d={`M 320 -30 L ${320 - 160 * (1 - curtainOpen) - 40} -30 Q ${310 - 150 * (1 - curtainOpen)} 200 ${320 - 160 * (1 - curtainOpen) - 30} 400 L 320 400 Z`} fill={sun ? '#E8735A' : mix(p.accent, '#000000', 0.5)} opacity={0.95} />
      </g>
      {sun && curtainOpen > 0.2 && <path d="M 100 450 L 400 450 L 760 1300 L 300 1300 Z" fill={`url(#${id}sun)`} opacity={curtainOpen * 0.9} filter={`url(#${id}blur)`} />}
      {/* poster & rak */}
      <g transform="translate(470,470)">
        <rect width={150} height={200} rx={10} fill={mix(p.accent, p.wall, 0.4)} />
        <circle cx={75} cy={80} r={44} fill={mix(p.wall2, '#000000', 0.3)} />
        <rect x={30} y={150} width={90} height={14} rx={7} fill={mix(p.wall, '#FFFFFF', 0.3)} />
      </g>
      <g transform="translate(660,620)">
        <rect width={180} height={14} rx={6} fill="#6E4A3A" />
        <rect x={14} y={-60} width={26} height={60} rx={4} fill="#4FB3A9" /><rect x={44} y={-70} width={22} height={70} rx={4} fill="#E8735A" />
        <rect x={70} y={-50} width={28} height={50} rx={4} fill="#FFD166" />
        <circle cx={140} cy={-26} r={26} fill="#5E8F5E" /><rect x={128} y={-6} width={24} height={20} rx={4} fill="#B85C7A" />
      </g>
      {/* jam dinding */}
      {clock && (
        <g transform="translate(750,430)">
          <circle r={46} fill={mix(p.wall, '#FFFFFF', 0.6)} /><circle r={38} fill="#FFFFFF" opacity={0.9} />
          <line x1={0} y1={0} x2={0} y2={-26} stroke="#2A1838" strokeWidth={5} strokeLinecap="round" transform={`rotate(${(f * 6) % 360})`} />
          <line x1={0} y1={0} x2={18} y2={0} stroke="#2A1838" strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      {/* pintu */}
      <g transform="translate(860,690)">
        <rect x={-8} y={-8} width={196} height={436} rx={8} fill={mix(p.wall, '#000000', 0.35)} />
        <rect width={180} height={420} rx={6} fill={mix('#7A4A32', p.wall, 0.3)} />
        <g transform={`translate(${180 * (1 - doorClosed) * 0.0},0) scale(${1 - 0.35 * (1 - doorClosed)},1)`}>
          <rect width={180} height={420} rx={6} fill={mix('#9C5A3C', p.wall, 0.25)} />
          <rect x={22} y={30} width={136} height={150} rx={8} fill="#000000" opacity={0.08} />
          <rect x={22} y={220} width={136} height={170} rx={8} fill="#000000" opacity={0.08} />
          <circle cx={150} cy={225} r={10} fill="#FFD166" />
          {hanger > 0 && (
            <g transform={`translate(150,232) rotate(${Math.sin(f * 0.15) * 6})`} opacity={hanger}>
              <circle r={10} fill="none" stroke="#F5E6DA" strokeWidth={4} />
              <rect x={-46} y={10} width={92} height={120} rx={12} fill="#FF4D5A" />
              <text x={0} y={52} textAnchor="middle" fontSize={20} fontWeight={800} fill="#FFFFFF" fontFamily="Poppins">JANGAN</text>
              <text x={0} y={80} textAnchor="middle" fontSize={20} fontWeight={800} fill="#FFFFFF" fontFamily="Poppins">GANGGU</text>
              <path d="M -16 100 L 16 100" stroke="#FFFFFF" strokeWidth={4} />
            </g>
          )}
        </g>
      </g>
      {/* meja + lampu meja */}
      <g transform="translate(40,960)">
        <rect width={300} height={22} rx={8} fill="#6E4A3A" />
        <rect x={20} y={22} width={20} height={150} fill="#5A3A2C" /><rect x={260} y={22} width={20} height={150} fill="#5A3A2C" />
        <g transform="translate(220,-10)">
          <circle cx={0} cy={-120} r={220} fill={`url(#${id}lamp)`} opacity={lampOn} />
          <rect x={-30} y={-6} width={60} height={12} rx={6} fill="#3A2A30" />
          <rect x={-4} y={-90} width={8} height={86} fill="#3A2A30" />
          <path d="M -46 -88 L 46 -88 L 28 -140 L -28 -140 Z" fill={mix('#3A2A30', p.lamp, 0.5 * lampOn)} />
        </g>
        <rect x={40} y={-40} width={80} height={40} rx={6} fill="#B85C7A" opacity={0.8} />
      </g>
      {/* kasur di kanan bawah */}
      <g transform="translate(560,1040)">
        <rect x={0} y={20} width={520} height={130} rx={24} fill={mix('#5E2A4A', p.wall, 0.3)} />
        <rect x={10} y={-10} width={500} height={70} rx={28} fill={mix('#F5E6DA', p.wall, 0.35)} />
        <rect x={360} y={-40} width={140} height={60} rx={26} fill={mix('#FFFFFF', p.wall, 0.3)} />
        <path d="M 10 30 Q 200 -10 360 40 L 360 100 L 10 100 Z" fill={mix(p.accent, p.wall, 0.45)} opacity={0.9} />
      </g>
      {lightsOn > 0 && <StringLights y={230} on={lightsOn} color={sun ? '#FFE8A0' : '#FFD27A'} />}
      <Bokeh color={sun ? '#FFF3C4' : mood === 'rain' ? '#DCE6F5' : '#FFB36B'} seed={mood.length} />
      {/* gelap / ambient */}
      <rect width={1080} height={1920} fill={mood === 'night' ? '#0A0412' : '#141024'} opacity={(mood === 'night' ? 0.25 : mood === 'rain' ? 0.12 : 0) + dim * 0.45 + (1 - lightsOn) * 0.25} />
    </g>
  );
};

/** Lab / klinik: papan tulis, mikroskop, rak tabung, lemari, lampu teal-putih. */
export const Lab: React.FC<{dim?: number}> = ({dim = 0}) => {
  const id = useSid('lab');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE9E6" /><stop offset="1" stopColor="#A9D6D1" /></linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FB7B1" /><stop offset="1" stopColor="#4E8C86" /></linearGradient>
        <radialGradient id={`${id}l`} cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="#FFFFFF" stopOpacity={0.6} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#${id}w)`} />
      {/* ubin dinding */}
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={0} y={880 + i * 26} width={1080} height={2} fill="#8FC2BC" opacity={0.6} />)}
      <rect y={1110} width={1080} height={16} fill="#5E9E97" />
      <rect y={1126} width={1080} height={800} fill={`url(#${id}f)`} />
      {/* lampu plafon */}
      {[270, 810].map((x) => (
        <g key={x}>
          <rect x={x - 110} y={130} width={220} height={22} rx={10} fill="#F5FFFE" />
          <path d={`M ${x - 110} 152 L ${x + 110} 152 L ${x + 260} 900 L ${x - 260} 900 Z`} fill={`url(#${id}l)`} opacity={0.6} />
        </g>
      ))}
      {/* papan tulis */}
      <g transform="translate(300,380)">
        <rect x={-14} y={-14} width={508} height={318} rx={14} fill="#E8EEF0" />
        <rect width={480} height={290} rx={8} fill="#2F4F4A" />
        <path d="M 40 230 Q 120 120 200 180 T 360 90" stroke="#E8F5F3" strokeWidth={5} fill="none" opacity={0.5} strokeDasharray="10 10" />
        <rect x={20} y={300} width={440} height={12} rx={6} fill="#B9C6C8" />
      </g>
      {/* lemari kaca + rak tabung */}
      <g transform="translate(40,700)">
        <rect width={220} height={420} rx={14} fill="#E8F2F1" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={14} y={30 + r * 130} width={192} height={10} rx={4} fill="#9FC9C4" />
            {[0, 1, 2, 3].map((k) => (
              <g key={k} transform={`translate(${36 + k * 44},${-50 + 30 + r * 130})`}>
                <rect x={-9} y={0} width={18} height={52} rx={9} fill="#FFFFFF" opacity={0.8} />
                <rect x={-9} y={20} width={18} height={32} rx={9} fill={['#4FB3A9', '#FF7A8A', '#FFD166', '#7E8CC8'][(k + r) % 4]} />
              </g>
            ))}
          </g>
        ))}
      </g>
      {/* meja lab + mikroskop */}
      <g transform="translate(700,940)">
        <rect width={360} height={24} rx={8} fill="#E8F2F1" />
        <rect x={20} y={24} width={320} height={160} rx={10} fill="#CFE2E0" />
        <g transform="translate(250,0)">
          <rect x={-50} y={-18} width={100} height={18} rx={6} fill="#3A5A56" />
          <path d="M -10 -18 Q -40 -80 -10 -120" stroke="#3A5A56" strokeWidth={16} fill="none" strokeLinecap="round" />
          <rect x={-16} y={-200} width={32} height={100} rx={10} fill="#4E7A74" transform="rotate(-24 0 -150)" />
          <rect x={-34} y={-66} width={68} height={12} rx={6} fill="#4E7A74" />
        </g>
        <g transform="translate(80,-50)">
          <path d="M -20 0 L 20 0 L 34 50 L -34 50 Z" fill="#FFFFFF" opacity={0.85} />
          <path d="M -28 30 L 28 30 L 34 50 L -34 50 Z" fill="#4FB3A9" />
        </g>
      </g>
      <Bokeh color="#FFFFFF" seed={9} n={10} />
      <rect width={1080} height={1920} fill="#0A2A28" opacity={0.08 + dim * 0.45} />
    </g>
  );
};

/** Jalan keluar ke cakrawala (fase 66 hari): pintu kamar terbuka -> jalan pagi panjang. */
export const RoadScene: React.FC<{dim?: number}> = ({dim = 0}) => (
  <g>
    <defs>
      <linearGradient id="roadsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FD3E8" /><stop offset="1" stopColor="#FFE2B0" /></linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#roadsky)" />
    <circle cx={760} cy={560} r={90} fill="#FFE27A" opacity={0.9} />
    <path d="M -50 900 Q 300 760 560 860 Q 800 780 1130 880 L 1130 1920 L -50 1920 Z" fill="#9FD68A" />
    <path d="M -50 1000 Q 300 900 540 960 Q 820 900 1130 980 L 1130 1920 L -50 1920 Z" fill="#7FC070" />
    <path d="M 380 1920 L 520 900 L 560 900 L 720 1920 Z" fill="#C9A27A" />
    <path d="M 540 1900 L 540 920" stroke="#FFF3D6" strokeWidth={8} strokeDasharray="40 40" />
    {[200, 880].map((x, i) => (
      <g key={x} transform={`translate(${x},${960 + i * 20})`}>
        <rect x={-10} y={-40} width={20} height={60} fill="#7A4A32" /><circle cx={0} cy={-70} r={56} fill="#5E9E5E" />
      </g>
    ))}
    <rect width={1080} height={1920} fill="#1A1028" opacity={dim * 0.45} />
  </g>
);

/** Panggung CTA: hangat emas + teal, spotlight ke karakter. */
export const CtaStage: React.FC<{dim?: number}> = ({dim = 0}) => {
  const id = useSid('cta');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3D2A2A" /><stop offset="0.6" stopColor="#1E3A3A" /><stop offset="1" stopColor="#0F2624" /></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD166" stopOpacity={0} /><stop offset="1" stopColor="#FFD166" stopOpacity={0.35} /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#${id}b)`} />
      <path d="M 420 0 L 660 0 L 920 1260 L 160 1260 Z" fill={`url(#${id}s)`} />
      <ellipse cx={540} cy={1250} rx={360} ry={50} fill="#FFD166" opacity={0.3} />
      <rect y={1240} width={1080} height={700} fill="#0F2624" opacity={0.7} />
      <StringLights y={210} color="#FFD27A" />
      <Bokeh color="#8FD3C8" seed={21} n={16} />
      <rect width={1080} height={1920} fill="#000000" opacity={dim * 0.4} />
    </g>
  );
};

/** Latar hook: kamar gelap + glow fokus (pakai Bedroom malam yang digelapkan). */
export const Vignette2: React.FC<{k?: number}> = ({k = 0.7}) => (
  <rect width={1080} height={1920} fill="url(#vg2)" opacity={k} />
);
