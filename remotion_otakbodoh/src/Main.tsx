import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SHOTS} from './scenes';
import {ShotDef} from './scenes/types';
import {Cam, camT, ramp, sm} from './kit';
import {Dim} from './components/Places';
import {CalloutView, Subtitle} from './components/UI';
import {Grain} from './components/Bg';
import {TOTAL_FRAMES, VO_FRAMES, beatF} from './timeline';

const CY = 860; // titik tengah kamera di layar (zona tengah 420-1250)

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

// jepit kamera: tidak keluar batas ruangan 1080x1920 & lantai (kaki) tetap di zona tengah (<= y 1260 layar)
const clampCam = (c: Cam, floorY?: number): Cam => {
  const s = Math.max(1, c.s);
  let x = Math.min(1080 - 540 / s, Math.max(540 / s, c.x));
  let y = Math.min(1920 - (1920 - CY) / s, Math.max(CY / s, c.y));
  if (floorY !== undefined) y = Math.max(y, floorY - 400 / s);
  return {...c, s, x, y};
};

const ShotView: React.FC<{s: ShotDef; next?: ShotDef}> = ({s, next}) => {
  const f = useCurrentFrame();
  const a = s.from - (s.trLen || 0) / 2, b = s.to + (next?.trLen || 0) / 2;
  if (f < a || f >= b) return null;
  const raw: Cam = s.cam(f);
  const cam: Cam = s.free?.(f) ? raw : clampCam(raw, s.floorY);
  const T = camT(cam, CY);
  const st = {...exitStyle(next, f), ...enterStyle(s, f)};
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
