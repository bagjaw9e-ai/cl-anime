// SHOT 5: EFEK 3 — cara berpikir terganggu. Kafe / ruang meeting, tone abu-biru dingin pucat (beat 42-51).
// SHOT 6: PENUTUP tepat 30 frame tanpa narasi & tanpa subtitle.
import React from 'react';
import {STAND_Y} from '../components/Places';
import {Cafe} from '../components/Places2';
import {LitCharacter, Reflect} from '../components/Lit';
import {Silhouette} from '../components/Silhouette';
import {Spotlight} from '../components/Spot';
import * as U from '../illustrations/u25';
import {Phone18} from '../illustrations/shared';
import {Appear, be, bf, camKeys, ease, kp, ramp, sm} from '../kit';
import {clamp} from '../theme';
import {TOTAL_FRAMES, VO_FRAMES} from '../timeline';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const FL = STAND_Y, MX = 360, TABLE_Y = 1090, IX = 740, IY = 640;
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));
const HALO = '#BFD4FF';
setKeyPos({43: [600, 420], 49: [700, 420], 51: [540, 420]});

const FrontTable: React.FC = () => (
  <g>
    <rect x={120} y={TABLE_Y} width={840} height={24} rx={8} fill="#4A5462" />
    <rect x={140} y={TABLE_Y + 24} width={800} height={FL - TABLE_Y - 14} fill="#363E4A" />
    <path d="M 500 1040 L 506 1090 L 556 1090 L 562 1040 Z" fill="#FBF7EE" /><path d="M 562 1050 q 18 6 0 26" stroke="#FBF7EE" strokeWidth={6} fill="none" />
    <path d="M 760 1046 L 766 1090 L 812 1090 L 818 1046 Z" fill="#FBF7EE" />
  </g>
);

export const shotE3: ShotDef = {
  id: 'e3', from: bf(42), to: VO_FRAMES, enter: 'light', trLen: 12, trColor: '#DDE8F4', floorY: FL, free: (f) => f > bf(50) && f < bf(51, 20),
  cam: (f) => {
    if (f > bf(50) && f < bf(51, 20)) {    // beat 50: extreme push-in ke mata, lalu (beat 51) pull-out
      const z = ease(f, bf(50), bf(50, 40)) * (1 - ease(f, bf(51), bf(51, 20)));
      return {x: MX + 14, y: FL - 590, s: 1.1 + z * 4.5};
    }
    return camKeys(f, [
      [bf(42), 540, 860, 1.0], [be(42), 540, 860, 1.02],
      [bf(43, 6), 520, 840, 1.1], [be(43), 520, 840, 1.12],    // push ke kepala
      [bf(44, 8), 560, 820, 1.08], [be(44), 560, 810, 1.08],   // tilt
      [bf(45, 4), 560, 840, 1.1], [be(45), 560, 840, 1.1],     // rack focus
      [bf(46, 6), 480, 860, 1.04], [be(46), 640, 860, 1.04],   // pan
      [bf(47, 6), 600, 850, 1.08], [be(47), 600, 850, 1.1],    // push
      [bf(48, 6), 460, 880, 1.1], [be(48), 460, 900, 1.1],     // tilt turun
      [bf(49, 6), 600, 860, 1.1], [be(49), 600, 860, 1.14],    // push-in
      [bf(51, 20), 560, 860, 1.06], [be(51), 540, 860, 1.0],   // pull-out pelan ke wide
    ]);
  },
  bg: () => <Cafe />,
  bgBlur: (f) => 2.4 + 3 * Math.abs(Math.sin(((f - bf(45)) / 30) * Math.PI)) * seg(f, bf(45), be(45)),
  dim: (f) => 0.28 + 0.1 * ease(f, bf(48), bf(48, 20)),
  fg: (f) => (
    <g>
      <Spotlight x={540} y={820} rx={560} ry={760} dark={0.45} />
      {/* lawan bicara (siluet) di seberang meja */}
      <Silhouette x={860} y={FL} scale={0.86} type="man" pose={f > bf(47) && f < bf(48) ? 'talk' : 'sit'} rim={HALO} seed={7} />
      <Reflect floor={FL} op={0.1}>
        <LitCharacter id="e3m" x={MX} y={FL} scale={1.1} haloColor={HALO} phoneColor="#FF5FA2"
          pose={[[-100, 'sitting_meeting'], [bf(47), 'scratching_head'], [bf(48), 'slumped'], [bf(49), 'sitting_meeting'], [bf(51), 'looking_down']]}
          expression={[[-100, 'neutral'], [bf(43), 'lost'], [bf(44), 'tired'], [bf(45), 'unfocused'], [bf(47), 'lost'], [bf(48), 'ashamed'], [bf(50), 'empty_stare'],
            [bf(51), 'avoiding_eye_contact']]} />
      </Reflect>
      <FrontTable />
      {/* ===== ilustrasi ===== */}
      <Appear f={f} a={bf(43, 2)} b={be(43)} x={IX} y={IY} s={1.05}><U.JammedGears t={f} jam={ease(f, bf(43, 16), bf(43, 40))} /></Appear>
      <Appear f={f} a={bf(44, 2)} b={be(44)} x={IX} y={IY} s={0.9}><U.TiredBrain t={f} /></Appear>
      <Appear f={f} a={bf(45, 2)} b={be(45)} x={IX} y={IY} s={0.95}><U.CameraLens t={f} /></Appear>
      <Appear f={f} a={bf(46, 0)} b={be(46)} x={560} y={TABLE_Y - 20}><U.FlyingNotes t={f - bf(46)} /></Appear>
      <Appear f={f} a={bf(47, 4)} b={be(47)} x={IX - 80} y={IY - 40} s={0.95}><U.EmptyBubble p={ramp(f, bf(47, 4), bf(47, 14))} t={f} /></Appear>
      <Appear f={f} a={bf(48, 2)} b={be(48)} x={MX} y={FL - 640} s={0.9}><U.BurdenCloud k={ease(f, bf(48, 10), bf(48, 40))} t={f} /></Appear>
      <Appear f={f} a={bf(48, 10)} b={be(48)} x={MX + 70} y={FL - 330} s={0.32}><Phone18 w={110} glow={1} /></Appear>
      <Appear f={f} a={bf(49, 2)} b={be(49)} x={IX + 20} y={TABLE_Y + 40} s={1.15}><U.PillarPD erode={ease(f, bf(49, 20), be(49))} t={f} /></Appear>
    </g>
  ),
  // beat 50: close-up mata kosong (muncul saat kamera menembus ke mata)
  overlay: (f) => (
    <g opacity={sm(ramp(f, bf(50, 24), bf(50, 36))) * (1 - sm(ramp(f, bf(51), bf(51, 14))))}>
      <rect width={1080} height={1920} fill="#0E1218" opacity={0.85} />
      <g transform="translate(540,860)"><U.EyeCloseup t={f} /></g>
    </g>
  ),
};

export const shotClose: ShotDef = {
  id: 'close', from: VO_FRAMES, to: TOTAL_FRAMES, enter: 'cut', trLen: 0, free: () => true,
  cam: (f) => ({x: 540, y: 860, s: 1 + 0.12 * sm(ramp(f, VO_FRAMES, VO_FRAMES + 6))}),
  bg: () => <rect x={-500} y={-500} width={2080} height={2920} fill="#05060A" />,
  bgBlur: () => 0,
  fg: (f) => {
    const k = f - VO_FRAMES;
    const drop = sm(ramp(k, 0, 8));
    const off = sm(ramp(k, 24, 30));
    return (
      <g>
        {/* 3 ikon otak retak dari slot turun ke tengah, nyala merah terakhir lalu pecah, lampu mati */}
        <g transform={`translate(540,${kp(k, [[0, 250], [8, 820]])}) scale(${0.35 + 0.65 * drop})`}><U.ClosingBrains k={ramp(k, 6, 26)} off={off} /></g>
        <g opacity={1 - off}><Silhouette x={540} y={1250} scale={0.42} type="man" pose="look" rim="#FF6A6A" /></g>
      </g>
    );
  },
};
