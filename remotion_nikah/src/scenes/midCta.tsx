// MID-CTA (beat 41-44): panggung gelap ala ref_1, lantai reflektif, aksen amber. Masuk fade gelap; keluar zoom tembus pintu merah.
import React from 'react';
import {ShotDef} from './types';
import {Key, makeTrack} from './track';
import {Vis, pr} from './kit2';
import {bf, be, wordF} from './beats';
import {FLOOR_Y} from '../theme';
import {Halo, LitCharacter, Rise} from '../components/Lit';
import {PlaceStage} from '../components/PlacesNikah';
import {LiftPanel, StitchedHead} from '../illustrations/nk/fase3';

const K = (b: number, off: number, x: number, y: number, s: number, tone?: Key[4]): Key => [bf(b, off), x, y, s, tone];
const KEYS: Key[] = [
  K(41, 0, 540, 880, 1.0, 'ctaNavy'), K(41, 30, 470, 830, 1.28, 'ctaAmber'), K(41, 50, 472, 830, 1.32),
  K(42, 14, 690, 900, 1.22, 'ctaNavy'), K(42, 34, 692, 900, 1.24), K(42, 58, 760, 560, 1.24, 'ctaAmber'), K(42, 74, 762, 550, 1.26),
  K(43, 16, 450, 820, 1.55, 'ctaAmber'), K(43, 52, 450, 815, 1.62),
  K(44, 16, 600, 920, 1.05, 'ctaNavy'), K(44, 50, 560, 960, 1.15), K(44, 82, 540, 1005, 2.1, 'ctaRed'),
];
const tr = makeTrack(KEYS, [], 'ctaNavy');
const doneK = (f: number) => pr(f, wordF(41, 'neuroplasticity'), wordF(43, 'otak') + 6);

export const shotCta: ShotDef = {
  id: 'cta', from: bf(41), to: bf(45), enter: 'dark', trLen: 20, cam: tr.cam, tone: tr.tone, blur: () => 6, dim: () => 0.3,
  bg: (f, tone) => <PlaceStage tone={tone} t={f} lights={1 - pr(f, bf(44, 6), bf(44, 52))} door={pr(f, bf(44, 40), bf(44, 66))} />,
  fg: (f) => (
    <g>
      {/* 41 + 43: kain kepala sobek dijahit benang emas -> utuh & menyala */}
      <Vis f={f} a={bf(41)} b={bf(44, 20)} fin={14} fout={16}>
        <Halo x={450} y={800} rx={380} ry={360} color="#FFC46A" op={0.18 + 0.2 * doneK(f)} />
        <g transform="translate(450,800) scale(0.88)"><StitchedHead t={f} k={doneK(f)} /></g>
        <Rise x={450} y={980} w={300} h={420} n={8 + Math.round(doneK(f) * 8)} color="#FFD166" t={f} />
      </Vis>
      {/* 42: tombol lift "naik" ditekan, cahayanya naik ke arah bio */}
      <Vis f={f} a={bf(42, -2)} b={be(42, 12)}><g transform="translate(790,950) scale(0.8)"><LiftPanel t={f} k={pr(f, wordF(42, 'link') - 6, wordF(42, 'PMO') + 4)} /></g></Vis>
      <Vis f={f} a={bf(41)} b={bf(42, 2)} fin={14} fout={10}>
        <LitCharacter id="ctam1" x={820} y={FLOOR_Y} scale={0.92} pose="pockets_shoulders_up" expression="curious" haloColor="#FFC46A" />
      </Vis>
      <Vis f={f} a={bf(42, -6)} b={be(42, 10)} fin={10} fout={10}>
        <LitCharacter id="ctam2" x={580} y={FLOOR_Y} scale={0.92} pose="pressing_elevator_button_up" expression="determined" haloColor="#FFC46A" />
      </Vis>
      <Vis f={f} a={bf(43, -4)} b={be(44, 30)} fin={10} fout={2}>
        <LitCharacter id="ctam3" x={830} y={FLOOR_Y} scale={0.92} pose="pockets_shoulders_up" expression={[[0, 'relieved'], [bf(44, 10), 'worried']]} haloColor="#FFC46A" />
      </Vis>
    </g>
  ),
};
