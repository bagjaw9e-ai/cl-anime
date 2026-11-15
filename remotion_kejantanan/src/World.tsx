import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {C, mix, rand} from './theme';
import {BEATS, Part, beatF} from './timeline';
import {camAt, camSpeed, shakeAt} from './cameraTrack';
import {CHAR_SCALE, EXPR_KF, POSE_KF, charX, lookAt, rimOn, talking} from './characterTrack';
import {ILLS, SLOT, illState} from './illustrationTrack';
import {Character} from './components/Character';
import {Grain, Vignette} from './components/Bg';

/* ---------------- suasana per bagian (interpolasi warna ~1,2 dtk, tidak lompat) ---------------- */
type Mood = {top: string; bottom: string; glow: string; glowOp: number; floor: string; spot: string; spotOp: number};
export const MOODS: Record<Part, Mood> = {
  A: {top: '#2B0F17', bottom: '#1A0B10', glow: '#8E1B2C', glowOp: 0.25, floor: '#21100F', spot: '#E8735A', spotOp: 0.10},
  B: {top: '#4A2246', bottom: '#1C0F22', glow: '#8C74D0', glowOp: 0.28, floor: '#24142A', spot: '#B9A6F0', spotOp: 0.08},
  C: {top: '#9A1F4A', bottom: '#3D1420', glow: '#FF4D7A', glowOp: 0.5, floor: '#3A0F22', spot: '#FF4D5A', spotOp: 0.14},
  D: {top: '#4D3E44', bottom: '#241C20', glow: '#8A7A82', glowOp: 0.18, floor: '#2A2226', spot: '#B8AAB0', spotOp: 0.05},
  E: {top: '#C29AA6', bottom: '#8E6E7A', glow: '#F5E6DA', glowOp: 0.18, floor: '#9C7C87', spot: '#F5E6DA', spotOp: 0.0},
  F: {top: '#6A3A2E', bottom: '#1E4F4C', glow: '#FFD166', glowOp: 0.42, floor: '#24413F', spot: '#FFD166', spotOp: 0.32},
  END: {top: '#24100F', bottom: '#12070A', glow: '#C62F3E', glowOp: 0.22, floor: '#12070A', spot: '#FF4D5A', spotOp: 0.0},
};
const PART_ORDER: Part[] = ['A', 'B', 'C', 'D', 'E', 'F', 'END'];
export const partStart = (p: Part) => BEATS.find((b) => b.part === p)!.f0;
const TRANS_PRE = 12, TRANS_LEN = 36;

const mixMood = (a: Mood, b: Mood, t: number): Mood => ({
  top: mix(a.top, b.top, t), bottom: mix(a.bottom, b.bottom, t), glow: mix(a.glow, b.glow, t),
  glowOp: a.glowOp + (b.glowOp - a.glowOp) * t, floor: mix(a.floor, b.floor, t), spot: mix(a.spot, b.spot, t),
  spotOp: a.spotOp + (b.spotOp - a.spotOp) * t,
});
export const moodAt = (f: number): Mood => {
  let m = MOODS.A;
  for (let i = 1; i < PART_ORDER.length; i++) {
    const s = partStart(PART_ORDER[i]) - TRANS_PRE;
    if (f < s) break;
    const t = Math.min(1, (f - s) / TRANS_LEN);
    const e = t * t * (3 - 2 * t);
    m = mixMood(m, MOODS[PART_ORDER[i]], e);
  }
  // bagian C makin saturated (overload) mendekati beat 21
  if (f >= partStart('C') && f < partStart('D')) {
    const k = Math.min(1, (f - partStart('C')) / (beatF(21) + 20 - partStart('C')));
    m = {...m, glowOp: m.glowOp + 0.2 * k, top: mix(m.top, '#C2205A', 0.35 * k)};
  }
  // beat 39: cahaya meredup
  if (f >= beatF(39) && f < partStart('F')) {
    const k = Math.min(1, (f - beatF(39)) / 30);
    m = {...m, top: mix(m.top, '#5A4650', 0.6 * k), bottom: mix(m.bottom, '#3A2A30', 0.6 * k), glowOp: m.glowOp * (1 - 0.7 * k)};
  }
  return m;
};

/* ---------------- placeholder ilustrasi (animatic) ---------------- */
const Placeholder: React.FC<{il: (typeof ILLS)[number]; f: number}> = ({il, f}) => {
  const s = SLOT[il.slot];
  const st = illState(il, f);
  if (!st.visible) return null;
  const sc = (0.6 + 0.4 * st.inP) * (1 - st.outP * 0.5);
  const op = st.inP * (1 - st.outP);
  const col = ['#FFD166', '#8FD3C8', '#FF4D5A', '#F2A65A', '#B85C7A'][il.beat % 5];
  return (
    <g transform={`translate(${s.x},${s.y}) scale(${sc})`} opacity={op}>
      <rect x={-s.w / 2} y={-s.h / 2} width={s.w} height={s.h} rx={24} fill={col} fillOpacity={0.14} stroke={col} strokeWidth={6}
        strokeDasharray="22 14" />
      <text x={0} y={-6} textAnchor="middle" fontSize={44} fontWeight={700} fill={col} fontFamily="sans-serif">#{il.beat}</text>
      <text x={0} y={36} textAnchor="middle" fontSize={22} fill={C.cream} fontFamily="sans-serif">{il.label.slice(0, 34)}</text>
    </g>
  );
};

/* ---------------- dunia ---------------- */
export const World: React.FC<{mode: 'animatic' | 'final'; renderIll?: (f: number) => {back: React.ReactNode; front: React.ReactNode}}> = ({
  mode, renderIll,
}) => {
  const f = useCurrentFrame();
  const cam = camAt(f);
  const sh = shakeAt(f);
  const mood = moodAt(f);
  const speed = camSpeed(f);
  const blur = speed > 28 ? Math.min(7, (speed - 28) / 10) : 0;
  const endK = Math.max(0, Math.min(1, (f - beatF(46)) / 30));
  const cx = charX(f);
  const tf = `translate(${540 + sh.dx},${960 + sh.dy}) rotate(${cam.r + sh.dr}) scale(${cam.z}) translate(${-cam.x},${-cam.y})`;
  const ills = renderIll ? renderIll(f) : {
    back: ILLS.filter((i) => i.slot === 'behind' || i.slot === 'floor').map((i) => <Placeholder key={i.key} il={i} f={f} />),
    front: ILLS.filter((i) => i.slot !== 'behind' && i.slot !== 'floor').map((i) => <Placeholder key={i.key} il={i} f={f} />),
  };
  return (
    <AbsoluteFill style={{background: mood.bottom, overflow: 'hidden'}}>
      {/* langit/latar (screen space) */}
      <AbsoluteFill style={{background: `linear-gradient(${mood.top}, ${mood.bottom})`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 50% 38%, ${mood.glow}${Math.round(mood.glowOp * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`}} />
      <AbsoluteFill style={{filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <defs>
            <linearGradient id="wfloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mood.floor} />
              <stop offset="1" stopColor={mix(mood.floor, '#000000', 0.5)} />
            </linearGradient>
            <linearGradient id="wspot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mood.spot} stopOpacity={0} />
              <stop offset="1" stopColor={mood.spot} stopOpacity={mood.spotOp} />
            </linearGradient>
            <filter id="charBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={endK * 10} /></filter>
          </defs>
          <g transform={tf}>
            {/* lantai world */}
            <rect x={-5000} y={0} width={10000} height={4000} fill="url(#wfloor)" />
            <rect x={-5000} y={-2} width={10000} height={6} fill={mix(mood.floor, '#FFFFFF', 0.08)} />
            {/* spotlight dari atas */}
            <path d={`M ${cx - 160} -2200 L ${cx + 160} -2200 L ${cx + 520} 20 L ${cx - 520} 20 Z`} fill="url(#wspot)" />
            <ellipse cx={cx} cy={10} rx={430} ry={40} fill={mood.spot} opacity={mood.spotOp * 1.4} />
            {/* partikel debu melayang di world */}
            {Array.from({length: 40}).map((_, i) => {
              const x0 = (rand(i) - 0.5) * 3000, y0 = -rand(i * 3.7) * 2200;
              const y = ((y0 - f * (0.6 + rand(i * 5) * 1.2) - 2400) % 2400 + 2400) % 2400 - 2300;
              return <circle key={i} cx={x0 + Math.sin(f * 0.02 + i) * 30} cy={y} r={2 + rand(i * 9) * 4}
                fill={i % 3 ? mood.spot : C.cream} opacity={0.25 + 0.25 * Math.sin(f * 0.05 + i)} />;
            })}
            {ills.back}
            <g opacity={1 - endK * 0.65} filter={endK > 0 ? 'url(#charBlur)' : undefined}>
              <Character id="hero" x={cx} y={0} scale={CHAR_SCALE} pose={POSE_KF} expression={EXPR_KF} lookAt={lookAt(f)}
                talking={talking(f)} rim={rimOn(f)} blinkSeed={7} />
            </g>
            {ills.front}
          </g>
        </svg>
      </AbsoluteFill>
      <Vignette strength={0.55 + endK * 0.3} />
      {mode === 'final' && <Grain opacity={0.03} />}
      <Audio src={staticFile('voiceover.m4a')} />
    </AbsoluteFill>
  );
};
