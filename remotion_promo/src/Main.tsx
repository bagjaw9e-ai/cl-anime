import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {P, mix} from './theme';
import {ramp, smooth} from './illustrations';
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene89, SceneProps} from './scenes';
import {CalloutView, Subtitle} from './components/UI';
import {Grain} from './components/Bg';
import {TOTAL_FRAMES, beatF} from './timeline';

// Daftar scene: [komponen, frame mulai, frame selesai, transisi masuk (frame), jenis]
type Sc = {C: React.FC<SceneProps>; f0: number; f1: number; tr: number; kind: 'dissolve' | 'flash'};
export const SCENES: Sc[] = [
  {C: Scene1, f0: 0, f1: beatF(2), tr: 0, kind: 'dissolve'},
  {C: Scene2, f0: beatF(2), f1: beatF(3), tr: 14, kind: 'dissolve'},
  {C: Scene3, f0: beatF(3), f1: beatF(4), tr: 12, kind: 'dissolve'},
  {C: Scene4, f0: beatF(4), f1: beatF(5), tr: 12, kind: 'dissolve'},
  {C: Scene5, f0: beatF(5), f1: beatF(6), tr: 12, kind: 'dissolve'},
  {C: Scene6, f0: beatF(6), f1: beatF(7), tr: 0, kind: 'flash'}, // match cut dari cahaya peti
  {C: Scene7, f0: beatF(7), f1: beatF(8), tr: 12, kind: 'dissolve'},
  {C: Scene89, f0: beatF(8), f1: TOTAL_FRAMES, tr: 14, kind: 'dissolve'},
];

// tone: navy → cokelat hangat (beat 2–7) → navy (beat 8 + aksen merah neon)
export const warmAt = (f: number) => smooth(ramp(f, beatF(2), beatF(2) + 20)) * (1 - smooth(ramp(f, beatF(8), beatF(8) + 22)));

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const w = warmAt(f);
  const top = mix(P.navyTop, P.brownTop, w), mid = mix(P.navyMid, P.brownMid, w), fl = mix(P.navyFloor, P.brownFloor, w);
  const red = smooth(ramp(f, beatF(8) + 10, beatF(8) + 30));
  return (
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <defs>
        <linearGradient id="bgL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="0.625" stopColor={fl} />
          <stop offset="1" stopColor="#040507" />
        </linearGradient>
        <radialGradient id="bgR" cx="540" cy="860" r="720" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix('#2C3242', '#3A2E22', w)} stopOpacity={0.7} />
          <stop offset="1" stopColor={mid} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="bgRed" cx="700" cy="560" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={P.red} stopOpacity={0.09} />
          <stop offset="1" stopColor={P.red} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#bgL)" />
      <rect width={1080} height={1920} fill="url(#bgR)" />
      <rect width={1080} height={1920} fill="url(#bgRed)" opacity={red} />
    </svg>
  );
};

const SceneLayer: React.FC<{sc: Sc; next?: Sc}> = ({sc, next}) => {
  const f = useCurrentFrame();
  const a = sc.f0 - sc.tr / 2;
  const b = sc.f1 + (next ? next.tr / 2 : 0);
  if (f < a || f >= b) return null;
  const inK = sc.tr > 0 ? smooth(ramp(f, a, sc.f0 + sc.tr / 2)) : 1;
  const outK = next && next.tr > 0 ? smooth(ramp(f, next.f0 - next.tr / 2, next.f0 + next.tr / 2)) : 0;
  const blur = (1 - inK) * 14 + outK * 14;
  return (
    <AbsoluteFill style={{opacity: inK, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <sc.C f={f} />
      </svg>
    </AbsoluteFill>
  );
};

const Overlays: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = 1 - smooth(ramp(f, 0, 12));
  const fl = beatF(6);
  const flash = f < fl ? smooth(ramp(f, fl - 7, fl)) : 1 - smooth(ramp(f, fl, fl + 12));
  return (
    <>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, rgba(255,244,224,${0.95 * flash}) 0%, rgba(255,178,63,${0.7 * flash}) 45%, rgba(255,178,63,${0.25 * flash}) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 62% at 50% 46%, rgba(0,0,0,0) 50%, rgba(2,3,6,0.72) 100%)'}} />
      <Grain opacity={0.045} />
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
    </>
  );
};

export const Main: React.FC<{audio?: 'vo' | 'mix'}> = ({audio = 'vo'}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Backdrop />
    {SCENES.map((sc, i) => <SceneLayer key={i} sc={sc} next={SCENES[i + 1]} />)}
    <Overlays />
    <CalloutView />
    <Subtitle />
    <Audio src={staticFile(audio === 'mix' ? 'mix_final.wav' : 'voiceover.m4a')} />
  </AbsoluteFill>
);
