import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SHOTS} from './scenes';
import {ShotDef} from './scenes/types';
import {CY, Cam, camT, ramp, sm} from './kit';
import {Dim} from './components/Places30';
import {CalloutView, Subtitle} from './components/UI';
import {BatteryProgress, NeonPanelView} from './components/NeonPanel';
import {Grain} from './components/Bg';
import {TOTAL_FRAMES, VO_FRAMES, beatF} from './timeline';


// gaya transisi untuk shot yang sedang MASUK (k 0..1) dan yang KELUAR (k 0..1)
const enterStyle = (s: ShotDef, f: number): React.CSSProperties => {
  if (!s.trLen || f >= s.from + s.trLen / 2) return {};
  const k = sm(ramp(f, s.from - s.trLen / 2, s.from + s.trLen / 2));
  switch (s.enter) {
    case 'whip': return {transform: `translateX(${(1 - k) * 1080}px)`, filter: `blur(${(1 - k) * 18}px)`};
    case 'dissolve': return {opacity: k, filter: `blur(${(1 - k) * 14}px)`};
    case 'blend': return {opacity: k};
    case 'dark': { const k2 = ramp(f, s.from, s.from + s.trLen / 2); return {opacity: sm(k2)}; }
    case 'light': return {opacity: k};
    default: return {};
  }
};
const exitStyle = (next: ShotDef | undefined, f: number): React.CSSProperties => {
  if (!next || !next.trLen || f < next.from - next.trLen / 2) return {};
  const k = sm(ramp(f, next.from - next.trLen / 2, next.from + next.trLen / 2));
  switch (next.enter) {
    case 'whip': return {transform: `translateX(${-k * 1080}px)`, filter: `blur(${k * 18}px)`};
    case 'dissolve': return {filter: `blur(${k * 14}px)`};
    case 'dark': { const k2 = ramp(f, next.from - next.trLen / 2, next.from); return {opacity: 1 - sm(k2)}; }
    default: return {};
  }
};

// jepit kamera longgar: latar digambar melebar (-400..1480, -300..2220) -> fokus ilustrasi tetap bisa tepat di tengah frame
const clampCam = (c: Cam): Cam => {
  const s = Math.max(1, c.s);
  const x = Math.min(1080 - 540 / s + 380, Math.max(540 / s - 380, c.x));
  const y = Math.min(1920 - (1920 - CY) / s + 280, Math.max(CY / s - 280, c.y));
  return {...c, s, x, y};
};

const ShotView: React.FC<{s: ShotDef; next?: ShotDef}> = ({s, next}) => {
  const f = useCurrentFrame();
  const a = s.from - (s.trLen || 0) / 2, b = s.to + (next?.trLen || 0) / 2;
  if (f < a || f >= b) return null;
  const camAt = (fr: number) => { const r = s.cam(fr); return s.free?.(fr) ? r : clampCam(r); };
  const cam: Cam = camAt(f);
  const T = camT(cam, CY);
  // motion blur tipis saat gerakan kamera cepat (kecepatan layar px/frame)
  const p0 = camAt(f - 1);
  const v = Math.hypot((cam.x - p0.x) * cam.s, (cam.y - p0.y) * cam.s) + Math.abs(cam.s - p0.s) * 700 + Math.abs((cam.r ?? 0) - (p0.r ?? 0)) * 30;
  const mb = v > 14 ? Math.min(7, (v - 14) * 0.18) : 0;
  const st0 = {...exitStyle(next, f), ...enterStyle(s, f)};
  const st = mb > 0.3 ? {...st0, filter: [st0.filter, `blur(${mb.toFixed(1)}px)`].filter(Boolean).join(' ')} : st0;
  const blur = s.bgBlur ? s.bgBlur(f) : 2;
  return (
    <AbsoluteFill style={st}>
      <AbsoluteFill style={{filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
        <svg width={1080} height={1920}><g transform={T}>{s.bg(f)}</g>{s.dim && <Dim dim={s.dim(f)} />}</svg>
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}><g transform={T}>{s.fg(f)}</g>{s.overlay?.(f)}</svg>
    </AbsoluteFill>
  );
};

// overlay transisi layar penuh (light sweep / kilat match cut)
const TransFlash: React.FC = () => {
  const f = useCurrentFrame();
  let op = 0, col = '#FFF4E0';
  for (const s of SHOTS) {
    if (s.enter !== 'light' && s.enter !== 'blend') continue;
    const L = s.enter === 'blend' ? 8 : s.trLen;
    const k = 1 - Math.abs(f - s.from) / (L / 2 + 2);
    if (k > op) { op = k; col = s.trColor ?? col; }
  }
  return op > 0 ? <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${col} 0%, ${col}CC 50%, ${col}55 100%)`, opacity: sm(Math.min(1, op))}} /> : null;
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => <ShotView key={s.id} s={s} next={SHOTS[i + 1]} />)}
      <TransFlash />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 82% 64% at 50% 45%, rgba(0,0,0,0) 52%, rgba(2,3,6,0.72) 100%)'}} />
      <Grain opacity={0.04} />
      <NeonPanelView />
      <BatteryProgress />
      <CalloutView />
      <Subtitle />
    </AbsoluteFill>
  );
};

export const Main: React.FC<{audio?: 'vo' | 'mix'}> = ({audio = 'vo'}) => (
  <AbsoluteFill>
    <Scene />
    <Audio src={staticFile(audio === 'mix' ? 'mix_final.wav' : 'voiceover.m4a')} />
  </AbsoluteFill>
);

// animatic 540x960: dunia 1080x1920 diskalakan 0,5 (VO saja, tanpa SFX/BGM)
export const Animatic: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{width: 1080, height: 1920, transform: 'scale(0.5)', transformOrigin: '0 0', position: 'absolute'}}><Scene /></div>
    <Audio src={staticFile('voiceover.m4a')} />
  </AbsoluteFill>
);
