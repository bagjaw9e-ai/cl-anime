// HOOK (0 - 4 dtk): QUICK CUT 3 tempat beda, frame 0 langsung bergerak, tiap cut ada snap zoom / whip, animasi masuk overshoot.
import React from 'react';
import {ShotDef} from './types';
import {makeTrack} from './track';
import {pr} from './kit2';
import {bf, be} from '../kit';
import {FLOOR_Y} from '../theme';
import {LitCharacter, LitFemale, Halo} from '../components/Lit';
import {PlaceAkad, PlaceDarkRoom, PlaceInviteDesk} from '../components/PlacesNikah';
import {AkadTable, InviteInk} from '../illustrations/nk/hook';

// 1. "Menikah dengan pria" — MEJA AKAD: jabat tangan wali -> pasang cincin; snap zoom ke cincin
const t1 = makeTrack([[0, 600, 950, 1.0, 'akad'], [11, 585, 965, 1.07], [24, 445, 1098, 2.35, 'akadZoom'], [28, 442, 1100, 2.45]]);
const shotAkad: ShotDef = {
  id: 'hookAkad', from: 0, to: bf(2), enter: 'cut', trLen: 0, cam: t1.cam, tone: t1.tone, blur: () => 6, dim: () => 0.28,
  bg: (f, tone) => <PlaceAkad tone={tone} t={f} />,
  fg: (f) => (
    <g>
      <Halo x={560} y={1000} rx={520} ry={420} color="#FFD9A0" op={0.22} />
      <LitFemale id="h1w" x={840} y={FLOOR_Y + 170} scale={0.95} outfit="kebaya" expression="hopeful" pose="hands_folded_front" haloColor="#FFD9A0" />
      <LitCharacter id="h1m" x={520} y={FLOOR_Y} scale={0.95} outfit="koko" expression={[[0, 'happy'], [14, 'smug']]} pose={[[0, 'shaking_hands_akad'], [13, 'slipping_ring']]} haloColor="#FFD9A0" />
      <g transform={`translate(560,${FLOOR_Y - 66})`}><AkadTable t={f} /></g>
    </g>
  ),
};

// 2. "kecanduan PMO" — KAMAR GELAP: cincin -> kabel charger -> HP 18+ merah (whip cepat)
const t2 = makeTrack([[bf(2), 660, 1030, 1.55, 'darkRoom'], [bf(2, 14), 575, 935, 1.12], [be(2), 590, 945, 1.2]]);
const shotDark: ShotDef = {
  id: 'hookDark', from: bf(2), to: bf(3), enter: 'whip', trLen: 8, cam: t2.cam, tone: t2.tone, blur: () => 7, dim: () => 0.35,
  bg: (f, tone) => <PlaceDarkRoom tone={tone} t={f} />,
  fg: () => (
    <g>
      <Halo x={740} y={1180} rx={300} ry={160} color="#FF2A3A" op={0.25} />
      <LitCharacter id="h2m" x={470} y={FLOOR_Y} scale={0.95} expression="smug" pose="flaunting_ring_hand" haloColor="#FF3B4A" rimColor2="#FF8A90" />
    </g>
  ),
};

// 3. "merupakan suatu kesalahan." — MEJA UNDANGAN: tinta merah tumpah menyebar (snap push + shake kecil)
const t3 = makeTrack([[bf(3), 540, 940, 1.0, 'inviteDesk'], [bf(3, 13), 560, 995, 1.45], [be(3), 572, 1005, 1.62, 'inviteRed']], [[bf(3, 12), 10, 18]]);
const shotInvite: ShotDef = {
  id: 'hookInvite', from: bf(3), to: bf(4), enter: 'cut', trLen: 0, cam: t3.cam, tone: t3.tone, blur: () => 6, dim: () => 0.22,
  bg: (f, tone) => <PlaceInviteDesk tone={tone} t={f} />,
  fg: (f) => (
    <g>
      <Halo x={540} y={980} rx={420} ry={300} color="#FFF1D6" op={0.2} />
      <g transform="translate(540,1000)"><InviteInk t={f} k={pr(f, bf(3, 2), be(3, -4))} /></g>
    </g>
  ),
};

export const HOOK_SHOTS = [shotAkad, shotDark, shotInvite];
