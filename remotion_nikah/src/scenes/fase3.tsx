// FASE 3 (beat 45-57): lorong rumah keluarga (x -1300..1350) + kamar anak (1350..2750), lantai kayu mengkilap, tone merah-maroon
// makin gelap. Masuk zoom tembus pintu merah panggung. Kekerasan SELALU simbolik (bayangan, pintu, benda, bahasa tubuh).
import React from 'react';
import {ShotDef} from './types';
import {Key, makeTrack} from './track';
import {Vis, pr} from './kit2';
import {bf, be, wordF} from './beats';
import {FLOOR_Y} from '../theme';
import {TOTAL_FRAMES} from '../timeline';
import {Halo, LitCharacter, LitChild, LitFemale} from '../components/Lit';
import {HALL, PlaceHallKid} from '../components/PlacesNikah';
import {BrickWall, BrokenRobot, FallingToys, HandShadow, HeartHouse, MonsterShadow, MuteBadge, RedShout, RedSmoke, SlamDoor, StormCloud, TangledString, TinCan,
  WallFrames} from '../illustrations/nk/fase3';

const K = (b: number, off: number, x: number, y: number, s: number, tone?: Key[4]): Key => [bf(b, off), x, y, s, tone];
const KEYS: Key[] = [
  K(45, 0, 560, 880, 1.25, 'f3Maroon'), K(45, 22, 540, 860, 1.12), K(45, 56, 545, 860, 1.14), K(45, 76, 260, 770, 1.38, 'f3Red'), K(45, 100, 262, 770, 1.42),
  K(45, 118, 960, 960, 1.5, 'f3Maroon'), K(45, 140, 962, 960, 1.55),
  K(46, 16, 760, 860, 1.3, 'f3Red'), K(46, 40, 760, 860, 1.32), K(46, 64, 330, 880, 1.3, 'f3Maroon'), K(46, 92, 335, 880, 1.34),
  K(47, 14, 540, 1110, 1.3, 'f3Red'), K(47, 40, 540, 1100, 1.3), K(47, 100, 540, 700, 1.3, 'f3Dark'),
  K(48, 14, 420, 900, 1.45, 'f3Red'), K(48, 50, 420, 900, 1.52),
  K(49, 12, -820, 860, 1.2, 'f3Dark'), K(49, 30, -810, 860, 1.24),
  K(50, 14, -470, 880, 1.42, 'f3Red'), K(50, 72, -470, 875, 1.52),
  K(51, 14, 330, 700, 1.7, 'f3Dark'), K(51, 50, 330, 700, 1.8),
  K(52, 16, 600, 760, 1.15, 'f3Red'), K(52, 68, 1100, 760, 0.82, 'f3Maroon'),
  K(53, 16, 1880, 640, 1.2, 'f3Red'), K(53, 70, 1880, 900, 1.25),
  K(54, 14, 2150, 900, 1.25, 'f3Dark'), K(54, 60, 2170, 900, 1.42, 'f3Red'), K(54, 80, 2170, 900, 1.45),
  K(55, 14, 2120, 920, 1.18, 'f3Dark'), K(55, 78, 2210, 950, 1.55),
  K(56, 14, 2050, 860, 1.6, 'f3Night'), K(56, 90, 2050, 860, 1.08),
  K(57, 10, 2050, 860, 1.06, 'f3Dark'), K(57, 70, 2050, 840, 0.84), [TOTAL_FRAMES, 2050, 836, 0.82],
];
const tr = makeTrack(KEYS, [[wordF(54, 'bentakan'), 14, 20], [wordF(54, 'makian'), 12, 16], [wordF(49, 'menghindar') + 6, 10, 18]], 'f3Maroon');
const Wn = (a: number, b: number = a): [number, number] => [bf(a, -2), be(b, 10)];
const RED = {haloColor: '#FF7A5A', rimColor2: '#FFB0A0'};
const WARM = {haloColor: '#FFC56A'};

export const shotF3: ShotDef = {
  id: 'f3', from: bf(45), to: TOTAL_FRAMES, enter: 'zoomThrough', trLen: 20, cam: tr.cam, tone: tr.tone, blur: () => 7,
  dim: (f) => 0.36 + 0.14 * pr(f, bf(57), TOTAL_FRAMES),
  bg: (f, tone) => <PlaceHallKid tone={tone} t={f} nightLamp={1 - 0.6 * pr(f, bf(57, 10), bf(57, 60))} />,
  fg: (f) => {
    const L = (a: number, b: number) => ({f, a, b});
    const cloud = pr(f, bf(52, 6), be(52, -4));
    return (
      <g>
        {/* 45: bayangan suami di dinding jadi monster bertanduk; anak memeluk boneka di ujung lorong */}
        <Vis {...L(...Wn(45))}>
          <g transform="translate(170,830) scale(0.92)"><MonsterShadow t={f} k={pr(f, wordF(45, 'menjelma'), wordF(45, 'abusive'))} /></g>
          <LitCharacter id="f3m45" x={330} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="cold" {...RED} />
          <LitChild id="f3k45" x={1000} y={FLOOR_Y - 20} scale={0.72} pose="hugging_teddy" expression="scared" {...WARM} />
        </Vis>
        {/* 46: telepon kaleng, tali kusut & kendor antara istri dan suami */}
        <Vis {...L(...Wn(46))}>
          <LitCharacter id="f3m46" x={250} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="distant" {...RED} />
          <LitFemale id="f3w46" x={820} y={FLOOR_Y} scale={0.95} pose="holding_tin_can_phone" noProps expression="confused" {...WARM} />
          <TangledString t={f} x0={754} y0={836} x1={312} y1={1000} k={0.6 + 0.4 * pr(f, bf(46, 20), be(46))} />
          <g transform="translate(774,826)"><TinCan rot={-70} s={0.9} /></g>
          <g transform={`translate(305,${1010 + Math.sin(f * 0.1) * 4})`}><TinCan rot={170 + Math.sin(f * 0.1) * 8} s={0.9} /></g>
        </Vis>
        {/* 47-48: bata naik jadi tembok tinggi; suami mengangkat perisai besar */}
        <Vis {...L(...Wn(47, 48))}>
          <LitFemale id="f3w47" x={840} y={FLOOR_Y} scale={0.95} pose="hands_folded_front" expression="hurt" {...WARM} />
          <Vis f={f} a={bf(47, -2)} b={be(48, 10)}><g transform={`translate(580,${FLOOR_Y})`}><BrickWall t={f} k={pr(f, wordF(47, 'membangun'), be(47, -8))} w={300} rows={20} /></g></Vis>
          <LitCharacter id="f3m47" x={330} y={FLOOR_Y} scale={0.95} pose={[[0, 'pockets_shoulders_up'], [bf(48), 'raising_huge_shield']]} expression="defensive" {...RED} />
        </Vis>
        {/* 49: cepat menghindar — masuk kamar & membanting pintu */}
        <Vis {...L(...Wn(49))}>
          <g transform={`translate(${HALL.doorL},${FLOOR_Y - 420})`}><SlamDoor t={f} k={pr(f, bf(49, 4), wordF(49, 'menghindar') + 6)} /></g>
          <g opacity={1 - pr(f, wordF(49, 'menghindar') + 4, wordF(49, 'menghindar') + 10)}>
            <LitCharacter id="f3m49" x={HALL.doorL - 250} y={FLOOR_Y} scale={0.95} pose="slamming_door_shut" expression="explosive" {...RED} />
          </g>
        </Vis>
        {/* 50: ikon mute di depan mulut istri + asap merah dari celah pintu */}
        <Vis {...L(...Wn(50))}>
          <g transform={`translate(${HALL.doorL},${FLOOR_Y - 420})`}><SlamDoor t={f} k={1} /></g>
          <g transform={`translate(${HALL.doorL},${FLOOR_Y})`}><RedSmoke t={f} w={300} k={pr(f, bf(50, 4), bf(50, 30))} /></g>
          <LitFemale id="f3w50" x={-330} y={FLOOR_Y} scale={0.95} pose="hands_folded_front" expression="hurt" {...WARM} />
          <g transform="translate(-330,850)"><MuteBadge t={f} k={pr(f, wordF(50, 'membungkam'), wordF(50, 'membungkam') + 16)} s={0.7} /></g>
        </Vis>
        {/* 51-52: kepala penuh kabel kusut memercik; awan badai lepas dari kepala, melayang ke seisi rumah */}
        <Vis {...L(...Wn(51, 52))}>
          <LitCharacter id="f3m51" x={330} y={FLOOR_Y} scale={0.95} pose={[[0, 'head_full_of_tangled_wires'], [bf(52), 'storm_cloud_head']]} noProps={f >= bf(52)}
            expression={[[0, 'overwhelmed'], [bf(52), 'irritated']]} {...RED} />
          <Vis f={f} a={bf(52)} b={be(52, 10)} fin={4}>
            <g transform={`translate(${330 + cloud * 1350},${380 - Math.sin(cloud * Math.PI) * 120 + cloud * 20})`}><StormCloud t={f} s={0.6 + cloud * 0.4} rain={cloud} /></g>
          </Vis>
        </Vis>
        {/* 53: payung pelindung di atas istri & anak sobek kena hujan awan petir */}
        <Vis {...L(...Wn(53))}>
          <g transform="translate(1880,300)"><StormCloud t={f} s={1} rain={1} /></g>
          <LitChild id="f3k53" x={1760} y={FLOOR_Y} scale={0.72} pose="hiding_behind_mother" expression="scared" {...WARM} />
          <LitFemale id="f3w53" x={1990} y={FLOOR_Y} scale={0.95} pose="holding_torn_umbrella_over_child" expression="protective" {...WARM} />
        </Vis>
        {/* 54: gelombang bentakan merah: bingkai foto goyang, mainan jatuh, anak menutup telinga (menangis tanpa suara) */}
        <Vis {...L(...Wn(54))}>
          <g transform="translate(2250,560) scale(0.8)"><WallFrames t={f} shake={pr(f, wordF(54, 'bentakan') - 4, wordF(54, 'bentakan') + 4)} /></g>
          <g transform="translate(2480,880) scale(0.9)"><FallingToys t={f} k={pr(f, wordF(54, 'makian') - 6, be(54))} /></g>
          <g transform="translate(1560,760)"><RedShout t={f} k={pr(f, bf(54, 6), wordF(54, 'bentakan'))} /></g>
          <LitChild id="f3k54" x={2060} y={FLOOR_Y} scale={0.75} pose="covering_ears" expression={[[0, 'scared'], [wordF(54, 'makian'), 'crying']]} {...WARM} />
        </Vis>
        {/* 55: robot kayu mainan patah, bayangan tangan terangkat membeku lalu memudar, anak mengintip dari balik pintu (SIMBOLIK) */}
        <Vis {...L(...Wn(55))}>
          <g transform="translate(2440,700)"><HandShadow t={f} k={pr(f, wordF(55, 'kasar') - 6, be(55, -4))} /></g>
          <g transform={`translate(2230,${FLOOR_Y - 40}) scale(0.9)`}><BrokenRobot t={f} k={pr(f, bf(55, 4), bf(55, 20))} /></g>
          <LitChild id="f3k55" x={1930} y={FLOOR_Y} scale={0.75} pose="peeking_from_door" expression="scared" {...WARM} />
          <rect x={1985} y={FLOOR_Y - 560} width={150} height={560} fill="#4A2A22" />
          <rect x={1975} y={FLOOR_Y - 570} width={14} height={570} fill="#2E1812" />
          <circle cx={2010} cy={FLOOR_Y - 280} r={9} fill="#C9A86A" />
        </Vis>
        {/* 56-57: miniatur rumah hangat + hati di atap -> lampu jendela padam satu-satu, awan gelap mengepung, kamar anak tetap nyala */}
        <Vis f={f} a={bf(56, -2)} b={TOTAL_FRAMES + 10} fin={16}>
          <Halo x={2050} y={860} rx={520} ry={460} color="#FFC56A" op={0.2 * (1 - pr(f, bf(57), bf(57, 60)))} />
          <g transform="translate(2050,880)"><HeartHouse t={f} off={pr(f, bf(57, 8), bf(57, 66))} clouds={pr(f, bf(57, 4), bf(57, 70))} /></g>
        </Vis>
      </g>
    );
  },
};
