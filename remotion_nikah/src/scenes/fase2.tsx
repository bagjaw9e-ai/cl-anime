// FASE 2 (beat 27-40): garasi rumah malam (beton basah, mobil samar, rak, papan perkakas, lemari arsip, mesin cuci, pintu ke rumah).
// Masuk lewat fade gelap ala ref_1. Pindah fokus = zoom/tilt/pan kamera + tone dingin bergeser.
import React from 'react';
import {ShotDef} from './types';
import {Key, makeTrack} from './track';
import {Vis, pr} from './kit2';
import {bf, be, wordF} from './beats';
import {FLOOR_Y} from '../theme';
import {Halo, LitCharacter, LitFemale} from '../components/Lit';
import {GAR, PlaceGarage} from '../components/PlacesNikah';
import {CallusMitt, ChiliLadder, ConveyorFactory, DashWarning, FilingDrawer, FireflySwarm, FlashlightBeam, MiragePhone, ScientistSil, ShrinkSweater,
  TowerHead, WeekBeakers} from '../illustrations/nk/fase2';

const K = (b: number, off: number, x: number, y: number, s: number, tone?: Key[4]): Key => [bf(b, off), x, y, s, tone];
const KEYS: Key[] = [
  K(27, 0, 540, 860, 1.12, 'f2Deep'), K(27, 38, 560, 860, 0.92, 'f2Base'),
  K(28, 14, 540, 830, 1.05, 'f2Teal'), K(28, 56, 545, 820, 1.08), K(28, 76, 560, 600, 1.5, 'f2Deep'), K(28, 110, 562, 600, 1.58),
  K(29, 14, 560, 900, 1.15, 'f2Base'), K(29, 50, 900, 905, 1.3, 'f2Teal'),
  K(30, 16, -990, 950, 1.45, 'f2Pink'), K(30, 100, -985, 945, 1.6),
  K(31, 14, -640, 880, 1.5, 'f2Teal'), K(31, 72, -640, 880, 1.62),
  K(32, 16, 1880, 820, 1.15, 'f2Warm'), K(32, 50, 1880, 830, 1.22),
  K(33, 18, 1180, 800, 1.6, 'f2Pink'), K(33, 76, 1180, 790, 1.72),
  K(34, 16, -170, 1000, 1.65, 'f2Red'), K(34, 60, -170, 1000, 1.72), K(34, 82, -260, 930, 1.3, 'f2Base'), K(34, 122, -262, 930, 1.34),
  K(35, 16, 360, 900, 1.55, 'f2Teal'), K(35, 104, 360, 880, 1.66),
  K(36, 16, -1190, 650, 1.65, 'f2Pink'), K(36, 110, -770, 650, 1.65),
  K(37, 16, 1560, 1000, 1.45, 'f2Deep'), K(37, 86, 1580, 1000, 1.58),
  K(38, 14, 900, 1020, 1.3, 'f2Teal'), K(38, 38, 900, 780, 1.3),
  K(39, 16, 260, 760, 1.25, 'f2Base'), K(39, 70, 300, 740, 1.3), K(39, 98, 620, 680, 1.65, 'f2Red'), K(39, 122, 630, 680, 1.7),
  K(40, 12, 860, 820, 1.15, 'f2Pink'), K(40, 70, 1460, 800, 1.15),
];
const tr = makeTrack(KEYS, [[wordF(34, 'keras'), 8, 10]], 'f2Base');
const Wn = (a: number, b: number = a): [number, number] => [bf(a, -2), be(b, 10)];
const COLD = {haloColor: '#4FD8FF', rimColor2: '#9FE8FF'};

export const shotF2: ShotDef = {
  id: 'f2', from: bf(27), to: bf(41), enter: 'dark', trLen: 22, cam: tr.cam, tone: tr.tone, blur: () => 7, dim: () => 0.36,
  bg: (f, tone) => <PlaceGarage tone={tone} t={f} roll={pr(f, bf(27, 2), be(27))} doorOpen={1} houseLight={0.35 + 0.5 * pr(f, bf(32), bf(32, 20)) * (1 - pr(f, bf(33, 20), be(33)))} />,
  fg: (f) => {
    const L = (a: number, b: number) => ({f, a, b});
    const runX = 700 + pr(f, bf(40), be(40)) * 760;
    return (
      <g>
        {/* 28: kepala tampak samping, dahi = menara kontrol bandara, lampu korslet satu-satu */}
        <Vis {...L(...Wn(28))}><Halo x={540} y={700} rx={420} ry={460} color="#4FD8FF" op={0.16} /><g transform="translate(540,880)"><TowerHead t={f} k={pr(f, wordF(28, 'pusat'), be(28, -6))} /></g></Vis>
        {/* 29: senter dari tangan suami: sinar tajam -> melebar & redup */}
        <Vis {...L(...Wn(29))}>
          <LitCharacter id="f2m29" x={300} y={FLOOR_Y} scale={0.95} pose="pressing_elevator_button_up" noProps expression="distant" {...COLD} />
          <g transform="translate(755,912)"><FlashlightBeam t={f} k={pr(f, wordF(29, 'fokus'), be(29, -2))} /></g>
        </Vis>
        {/* 30-31: pabrik ban berjalan kebanjiran kotak pink; sarung tangan baseball kapalan, bola mental */}
        <Vis {...L(...Wn(30, 31))}>
          <LitCharacter id="f2m30" x={-300} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression={[[0, 'hooked'], [bf(31), 'bored']]} {...COLD} />
          <Vis f={f} a={bf(30, -2)} b={be(30, 8)}><g transform="translate(-1060,1000) scale(0.85)"><ConveyorFactory t={f} k={pr(f, bf(30, 10), be(30, -6))} /></g></Vis>
          <Vis f={f} a={bf(31)} b={be(31, 10)} fin={10}><g transform="translate(-650,870) scale(0.9)"><CallusMitt t={f} /></g></Vis>
        </Vis>
        {/* 32-33: istri di ambang pintu bercahaya hangat -> memudar; HP fatamorgana pink menarik mata suami */}
        <Vis {...L(bf(32, -2), be(33, 10))}>
          <g opacity={1 - 0.7 * pr(f, bf(33, 24), be(33, -4))}><LitFemale id="f2w32" x={GAR.door} y={FLOOR_Y} scale={0.92} pose="standing_in_doorway_light" expression={[[0, 'hopeful'], [bf(33, 20), 'hurt']]} haloColor="#FFC46A" /></g>
          <Vis f={f} a={bf(33, -2)} b={be(33, 10)}>
            <LitCharacter id="f2m33" x={1380} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="hooked" haloColor="#FF6AD0" rimColor2="#FFB3E0" />
            <g transform="translate(1150,930) scale(0.8)"><MiragePhone t={f} k={pr(f, bf(33, 4), bf(33, 24))} /></g>
          </Vis>
        </Vis>
        {/* 34: lampu peringatan dasbor merah, ditutup stiker "AMAN" (menyangkal) */}
        <Vis {...L(...Wn(34))}>
          <g transform="translate(-150,1040) scale(0.75)"><DashWarning t={f} k={pr(f, wordF(34, 'keras') - 6, wordF(34, 'keras') + 6)} /></g>
          <LitCharacter id="f2m34" x={-336} y={FLOOR_Y} scale={0.95} pose="sticking_sticker_on_warning_light" noProps={f > wordF(34, 'keras') + 2} expression={[[0, 'irritated'], [wordF(34, 'keras'), 'denial']]} {...COLD} />
        </Vis>
        {/* 35: laci arsip + map bercahaya cap JAMA PSYCHIATRY 2014 */}
        <Vis {...L(...Wn(35))}><g transform={`translate(${GAR.cabinet},1040) scale(0.8)`}><FilingDrawer t={f} k={pr(f, bf(35, 4), wordF(35, '2014') + 10)} /></g></Vis>
        {/* 36: rak 7 gelas ukur terisi cairan pink makin tinggi (pan horizontal) */}
        <Vis {...L(...Wn(36))}><Halo x={-980} y={640} rx={420} ry={240} color="#FF6AC0" op={0.16} /><g transform="translate(-980,640) scale(0.8)"><WeekBeakers t={f} k={pr(f, bf(36, 12), be(36, -6))} /></g></Vis>
        {/* 37: sweater STRIATUM keluar mesin cuci lalu menyusut */}
        <Vis {...L(...Wn(37))}><g transform={`translate(${GAR.washer + 170},1050)`}><ShrinkSweater t={f} k={pr(f, bf(37, 6), be(37, -6))} /></g></Vis>
        {/* 38: siluet ilmuwan + tanda tanya berputar */}
        <Vis {...L(...Wn(38))}><g transform={`translate(${GAR.rack},900) scale(0.8)`}><ScientistSil t={f} /></g></Vis>
        {/* 39: deretan cabai level 1-5, yang paling pedas diambil */}
        <Vis {...L(...Wn(39))}>
          <g transform="translate(440,700) scale(0.7)"><ChiliLadder t={f} k={pr(f, wordF(39, 'ekstrem') - 10, wordF(39, 'ekstrem') + 8)} /></g>
          <LitCharacter id="f2m39" x={-20} y={FLOOR_Y} scale={0.95} pose={[[0, 'peering_through_binoculars'], [wordF(39, 'rangsangan'), 'fists_up_shouting']]} expression={[[0, 'hooked'], [wordF(39, 'rangsangan'), 'irritated']]} {...COLD} />
        </Vis>
        {/* 40: mengejar kunang-kunang pink yang selalu lolos (kamera tracking) */}
        <Vis {...L(...Wn(40))} >
          <LitCharacter id="f2m40" x={runX} y={FLOOR_Y} scale={0.95} pose="chasing_fireflies" expression="hooked" haloColor="#FF6AD0" rimColor2="#FFB3E0" />
          <g transform={`translate(${runX + 300},640)`}><FireflySwarm t={f} spread={170} /></g>
        </Vis>
      </g>
    );
  },
};
