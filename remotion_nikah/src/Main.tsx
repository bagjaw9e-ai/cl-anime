// Komposisi utama: shot per TEMPAT (kamera + tone per shot), transisi besar hanya saat ganti tempat/fase, overlay global
// (panel neon + baterai + subtitle + poin penting) TIDAK ikut kamera.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SHOTS} from './scenes';
import {ShotDef} from './scenes/types';
import {Cam, ramp, sm} from './kit';
import {FLOOR_Y, rand} from './theme';
import {ScreenVignette, ShotLayers} from './ShotLayers';
import {Reflect} from './components/Lit';
import {CalloutView, Subtitle} from './components/UI';
import {BatteryProgress, NeonPanelView} from './components/NeonPanel';
import {Grain} from './components/Bg';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
// gaya transisi shot yang MASUK
const enterStyle = (s: ShotDef, f: number): React.CSSProperties => {
  if (!s.trLen || f >= s.from + s.trLen / 2) return {};
  const k = sm(ramp(f, s.from - s.trLen / 2, s.from + s.trLen / 2));
  switch (s.enter) {
    case 'whip': return {transform: `translateX(${(1 - k) * 1080}px)`, filter: `blur(${(1 - k) * 22}px)`};
    case 'dissolve': return {opacity: k, filter: `blur(${(1 - k) * 14}px)`};
    case 'dark': return {opacity: sm(ramp(f, s.from, s.from + s.trLen / 2))};
    case 'zoomThrough': return {opacity: k, transform: `scale(${1.35 - 0.35 * k})`};
    case 'dust': return {opacity: sm(ramp(f, s.from - 4, s.from + s.trLen / 2)), transform: `scale(${1.06 - 0.06 * k})`};
    default: return {};
  }
};
// gaya transisi shot yang KELUAR (ditentukan transisi shot berikutnya)
const exitStyle = (next: ShotDef | undefined, f: number): React.CSSProperties => {
  if (!next || !next.trLen || f < next.from - next.trLen / 2) return {};
  const k = sm(ramp(f, next.from - next.trLen / 2, next.from + next.trLen / 2));
  switch (next.enter) {
    case 'whip': return {transform: `translateX(${-k * 1080}px)`, filter: `blur(${k * 22}px)`};
    case 'dissolve': return {filter: `blur(${k * 14}px)`};
    case 'dark': return {opacity: 1 - sm(ramp(f, next.from - next.trLen / 2, next.from))};
    case 'zoomThrough': return {transform: `scale(${1 + k * 2.2})`, opacity: 1 - sm(ramp(f, next.from - 2, next.from + next.trLen / 2)), filter: `blur(${k * 10}px)`};
    case 'dust': return {opacity: 1 - sm(ramp(f, next.from - next.trLen / 2, next.from + 4)), filter: `blur(${k * 8}px)`};
    default: return {};
  }
};

const ShotView: React.FC<{s: ShotDef; next?: ShotDef}> = ({s, next}) => {
  const f = useCurrentFrame();
  const a = s.from - (s.enter === 'cut' ? 0 : s.trLen / 2), b = s.to + (next && next.enter !== 'cut' ? next.trLen / 2 : 0);
  if (f < a || f >= b) return null;
  const cam: Cam = s.cam(f);
  const tone = s.tone(f);
  // motion blur tipis saat gerak kamera cepat (kecepatan layar px/frame)
  const p0 = s.cam(f - 1);
  const v = Math.hypot((cam.x - p0.x) * cam.s, (cam.y - p0.y) * cam.s) + Math.abs(Math.log(cam.s / p0.s)) * 900 + Math.abs((cam.r ?? 0) - (p0.r ?? 0)) * 30;
  const mb = v > 12 ? Math.min(9, (v - 12) * 0.16) : 0;
  const st0 = {...exitStyle(next, f), ...enterStyle(s, f)};
  const st = mb > 0.3 ? {...st0, filter: [st0.filter, `blur(${mb.toFixed(1)}px)`].filter(Boolean).join(' ')} : st0;
  return (
    <ShotLayers style={st} cam={cam} blur={s.blur ? s.blur(f) : 6} dim={s.dim ? s.dim(f) : 0.35}
      bg={s.bg(f, tone)} fg={<g><Reflect floor={FLOOR_Y} op={0.22} depth={460}>{s.fg(f, tone)}</Reflect>{s.front?.(f, tone)}</g>} overlay={s.overlay?.(f)} />
  );
};

// debu rumah kartu (transisi 'dust') + kilat putih singkat (hard cut hook) di koordinat layar
const TransFX: React.FC = () => {
  const f = useCurrentFrame();
  for (const s of SHOTS) {
    if (s.enter === 'dust' && Math.abs(f - s.from) < s.trLen) {
      const k = (f - (s.from - s.trLen)) / (s.trLen * 2);
      return (
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          {Array.from({length: 90}).map((_, i) => {
            const x = rand(i) * 1080, y0 = 700 + rand(i * 3) * 700, d = clamp(k);
            return <circle key={i} cx={x + (rand(i * 7) - 0.5) * 300 * d} cy={y0 - d * (200 + rand(i * 5) * 500)} r={2 + rand(i * 9) * 6} fill="#E8DCC6" opacity={Math.sin(d * Math.PI) * 0.8} />;
          })}
        </svg>
      );
    }
    if (s.enter === 'cut' && s.from > 0 && f >= s.from && f < s.from + 3) return <AbsoluteFill style={{background: '#FFF4E0', opacity: (3 - (f - s.from)) * 0.12}} />;
  }
  return null;
};

export const Scene: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map((s, i) => <ShotView key={s.id} s={s} next={SHOTS[i + 1]} />)}
    <TransFX />
    <ScreenVignette />
    <Grain opacity={0.04} />
    <NeonPanelView />
    <BatteryProgress />
    <CalloutView />
    <Subtitle />
  </AbsoluteFill>
);

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
