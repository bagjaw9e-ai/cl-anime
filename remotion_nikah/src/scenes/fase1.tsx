// FASE 1 (beat 6-26): apartemen pasangan malam — satu dunia lebar (dapur | ruang tengah | kamar). Pindah fokus = zoom/tilt/pan/whip
// kamera (tone latar bergeser tiap zoom, tempat tetap). Masuk dari debu rumah kartu (reveal pull-out).
import React from 'react';
import {ShotDef} from './types';
import {Key, makeTrack} from './track';
import {Flip, Vis, pr} from './kit2';
import {bf, be, wordF} from './beats';
import {FLOOR_Y} from '../theme';
import {Halo, LitCharacter, LitFemale} from '../components/Lit';
import {APT, PlaceApartment} from '../components/PlacesNikah';
import {BedFg, SofaFg} from '../illustrations/nk/furniture';
import {BurningTag, CactusWords, CrackWindow, DimLamp, DullPencil, ForcedDoor, FridgeChecklist, HoloProjector, KettleBoil, NightClock, PhoneOnStand,
  PlankBridge, PoisonPlant, RadarDish, ShadowPriceTag, SpinWheel, TissueCube, WaveToFlat} from '../illustrations/nk/fase1';

const K = (b: number, off: number, x: number, y: number, s: number, tone?: Key[4]): Key => [bf(b, off), x, y, s, tone];
const KEYS: Key[] = [
  K(6, -6, 540, 860, 1.6, 'f1Base'), K(6, 24, 540, 880, 0.95),
  K(7, 0, 540, 880, 0.95), K(7, 18, 400, 960, 1.65, 'f1Pink'), K(7, 36, 410, 955, 1.75),
  K(8, 18, 860, 840, 1.0, 'f1Violet'), K(8, 44, 860, 845, 1.03), K(8, 62, 860, 1120, 1.3, 'f1Cold'), K(8, 100, 860, 1140, 1.4),
  K(9, 16, 400, 960, 1.45, 'f1Pink'), K(9, 82, 400, 950, 1.56),
  K(10, 12, 400, 930, 1.72, 'f1Violet'), K(10, 30, 400, 930, 1.76),
  K(11, 14, 390, 900, 1.5, 'f1Pink'), K(11, 60, 390, 900, 1.58),
  K(12, 15, 800, 830, 1.25, 'f1Violet'), K(12, 34, 800, 830, 1.27), K(12, 58, 360, 790, 1.32, 'f1Cold'), K(12, 90, 360, 790, 1.4),
  K(13, 16, 565, 950, 1.55, 'f1Warm'), K(13, 59, 565, 950, 1.63),
  K(14, 12, 760, 830, 1.35, 'f1Violet'), K(14, 24, 760, 830, 1.36), K(14, 44, 480, 820, 1.42, 'f1Base'),
  K(15, 14, -1150, 880, 1.25, 'f1Cold'), K(15, 40, -1110, 880, 1.6), K(15, 100, -1105, 885, 1.7),
  K(16, 16, 230, 830, 1.1, 'f1Base'), K(16, 60, 230, 830, 1.13), K(16, 82, 130, 790, 1.6, 'f1Pink'), K(16, 118, 135, 790, 1.68),
  K(17, 16, 310, 860, 1.45, 'f1Warm'), K(17, 66, 310, 860, 1.62),
  K(18, 16, 2050, 880, 1.12, 'f1Violet'), K(18, 96, 2060, 880, 1.22),
  K(19, 12, -540, 800, 1.4, 'f1Red'), K(19, 44, -540, 800, 1.46),
  K(20, 14, -90, 800, 1.15, 'f1Pink'), K(20, 45, -90, 800, 1.2),
  K(21, 16, 2390, 860, 1.05, 'f1Red'), K(21, 130, 2470, 900, 1.52),
  K(22, 14, 1900, 1000, 1.35, 'f1Cold'), K(22, 48, 1900, 800, 1.35),
  K(23, 15, 150, 960, 1.45, 'f1Toxic'), K(23, 70, 150, 960, 1.56),
  K(24, 14, 880, 600, 1.15, 'f1Cold'), K(24, 36, 900, 560, 1.3), K(24, 60, 960, 520, 1.45),
  K(25, 16, 1850, 560, 1.3, 'f1Violet'), K(25, 40, 1850, 565, 1.32), K(25, 72, 2050, 960, 1.15, 'f1Base'), K(25, 111, 2060, 970, 1.2),
  K(26, 15, 2440, 960, 1.7, 'f1Warm'), K(26, 69, 2440, 955, 1.86),
];
const tr = makeTrack(KEYS, [[wordF(19, 'meledak'), 14, 24], [wordF(24, 'kata-kata'), 8, 10]], 'f1Base');
// jendela tampil set per beat (masuk sedikit sebelum kamera tiba, keluar sesudah kamera pergi)
const Wn = (a: number, b: number = a): [number, number] => [bf(a, -2), be(b, 10)];

export const shotF1: ShotDef = {
  id: 'f1', from: bf(6), to: bf(27), enter: 'dust', trLen: 24, cam: tr.cam, tone: tr.tone,
  blur: () => 7, dim: (f) => 0.34 + (f > bf(21) && f < be(21) ? 0.08 : 0),
  bg: (f, tone) => <PlaceApartment tone={tone} t={f} doorRed={pr(f, bf(21), bf(21, 30)) * (1 - pr(f, be(21), be(21, 20)))} />,
  fg: (f, tone) => {
    const L = (a: number, b: number, fin = 8, fout = 8) => ({f, a, b, fin, fout});
    return (
      <g>
        {/* 6-7: sofa, HP 18+ glow pink + kotak tisu */}
        <Vis {...L(...Wn(6, 7))} fin={14}>
          <Halo x={420} y={980} rx={420} ry={320} color="#FF7AC8" op={0.22} />
          <g transform={`translate(${APT.sofaX},${FLOOR_Y})`}><SofaFg tone={tone} /></g>
          <LitCharacter id="f1m7" x={620} y={FLOOR_Y - 40} scale={0.95} pose="lounging_on_armrest_phone" expression="hooked" phoneColor="#FF4FA8" haloColor="#FF7AC8" rimColor2="#FFB3E0" />
          <g transform="translate(212,880)"><TissueCube t={f} s={0.9} /></g>
        </Vis>
        {/* 8: jembatan papan antara suami & istri, papan jatuh satu-satu */}
        <Vis {...L(...Wn(8))}>
          <g transform={`translate(860,${FLOOR_Y + 6})`}><PlankBridge t={f} k={pr(f, wordF(8, 'ikatan'), be(8, -4))} /></g>
          <LitCharacter id="f1m8" x={540} y={FLOOR_Y} scale={0.85} pose="pockets_shoulders_up" expression="distant" haloColor="#B08AFF" rimColor2="#C9B0FF" />
          <LitFemale id="f1w8" x={1180} y={FLOOR_Y} scale={0.85} pose="waving_unnoticed" expression={[[0, 'hopeful'], [wordF(8, 'batin'), 'hurt']]} haloColor="#FFB3D0" />
        </Vis>
        {/* 9-11: HP proyektor -> hologram pixel pink -> angguk boneka per -> roda putar */}
        <Vis {...L(...Wn(9, 11))}>
          <LitCharacter id="f1m9" x={720} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression={[[0, 'hooked'], [bf(10), 'smug'], [bf(11), 'hooked']]} haloColor="#FF7AC8" rimColor2="#FFB3E0" />
          <Vis f={f} a={bf(9, -2)} b={bf(11, 10)}><g transform="translate(380,1070)"><HoloProjector t={f} k={pr(f, bf(9, 6), bf(9, 26))} nod={pr(f, bf(10), bf(10, 6))} /></g></Vis>
          <Vis f={f} a={bf(11)} b={be(11, 10)} fin={10}><g transform="translate(380,900) scale(0.75)"><SpinWheel t={f} ang={(() => { const k = pr(f, bf(11), be(11, -6)); return 2600 * (1 - Math.pow(1 - k, 3)); })()} /></g></Vis>
        </Vis>
        {/* 12: antena radar di kepala suami, sinyal melemah; istri melambai tak tertangkap */}
        <Vis {...L(...Wn(12))}>
          <LitCharacter id="f1m12" x={330} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="distant" haloColor="#9FC4FF" rimColor2="#B8D4FF" />
          <g transform="translate(330,640)"><RadarDish t={f} k={pr(f, bf(12, 20), be(12, -6))} /></g>
          <LitFemale id="f1w12" x={820} y={FLOOR_Y} scale={0.95} pose="waving_unnoticed" expression={[[0, 'hopeful'], [wordF(12, 'perlahan'), 'hurt']]} haloColor="#FFB3D0" />
        </Vis>
        {/* 13: tangan istri bercahaya hangat vs tangan suami bersarung karet tebal */}
        <Vis {...L(...Wn(13))}>
          <Flip x={380}><LitCharacter id="f1m13" x={380} y={FLOOR_Y} scale={0.95} pose="wearing_thick_gloves" expression="bored" haloColor="#FFB060" /></Flip>
          <LitFemale id="f1w13" x={720} y={FLOOR_Y} scale={0.95} pose="holding_husband_hand_warm" expression={[[0, 'loving'], [wordF(13, 'hambar'), 'hurt']]} haloColor="#FFB060" />
        </Vis>
        {/* 14: gelombang suara istri menabrak headphone suami -> garis datar */}
        <Vis {...L(...Wn(14))}>
          <LitCharacter id="f1m14" x={340} y={FLOOR_Y} scale={0.95} pose="earphones_ignoring" expression="bored" haloColor="#B08AFF" />
          <LitFemale id="f1w14" x={790} y={FLOOR_Y} scale={0.95} pose="talking_soundwave" expression="hopeful" haloColor="#FFB3D0" />
          <g transform="translate(575,800)"><WaveToFlat t={f} len={300} k={pr(f, bf(14, 4), bf(14, 16))} /></g>
        </Vis>
        {/* 15: daftar tugas di kulkas, kotak "ISTRI" dicentang tanpa menoleh */}
        <Vis {...L(...Wn(15))}>
          <g transform="translate(-1080,905) scale(0.55)"><FridgeChecklist t={f} k={pr(f, wordF(15, 'kewajiban'), wordF(15, 'kewajiban') + 14)} /></g>
          <LitCharacter id="f1m15" x={-1345} y={FLOOR_Y} scale={0.95} pose="ticking_checklist_blindly" expression="cold" haloColor="#9FC4FF" />
        </Vis>
        {/* 16-17: label harga di bayangan istri di dinding -> discan; istri menutup cahaya hati, label terbakar */}
        <Vis {...L(...Wn(16, 17))}>
          <g transform="translate(80,800) scale(0.9)"><ShadowPriceTag t={f} k={f < bf(17) ? pr(f, bf(16, 18), wordF(16, 'benda')) : 0} /></g>
          <Vis f={f} a={bf(17)} b={be(17, 10)} fin={2}><g transform="translate(143,782) scale(0.9)"><BurningTag t={f} k={pr(f, bf(17, 4), be(17, -4))} /></g></Vis>
          <LitFemale id="f1w16" x={330} y={FLOOR_Y} scale={0.95} pose={[[0, 'hands_folded_front'], [bf(17), 'shielding_heart_glow']]} expression={[[0, 'confused'], [bf(17), 'hurt']]} haloColor="#FFB3D0" />
          <LitCharacter id="f1m16" x={720} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="cold" haloColor="#B08AFF" />
        </Vis>
        {/* 18: kamar — lampu tidur redup vs HP 18+ terang, suami menoleh bolak-balik */}
        <Vis {...L(...Wn(18))}>
          <g transform={`translate(1600,${FLOOR_Y - 232})`}><DimLamp t={f} on={0.3 + 0.1 * Math.sin(f * 0.05)} /></g>
          <g transform={`translate(2480,${FLOOR_Y - 232})`}><PhoneOnStand t={f} /></g>
          <g transform={`translate(2050,${FLOOR_Y})`}><BedFg tone={tone} w={760} h={0.68} /></g>
          <LitCharacter id="f1m18" x={2050} y={FLOOR_Y} scale={0.95} pose="comparing_two_lights" expression="irritated" haloColor="#B08AFF" />
        </Vis>
        {/* 19-20: ketel mendidih meletup; kata-kata jadi duri kaktus ke istri */}
        <Vis {...L(...Wn(19, 20))}>
          <Vis f={f} a={bf(19, -2)} b={be(19, 16)}><g transform="translate(-620,752)"><KettleBoil t={f} k={pr(f, bf(19, 2), wordF(19, 'meledak') + 4)} /></g></Vis>
          <LitCharacter id="f1m19" x={-330} y={FLOOR_Y} scale={0.95} pose="fists_up_shouting" expression={[[0, 'explosive'], [bf(20), 'irritated']]} haloColor="#FF6A50" />
          <Vis f={f} a={bf(20)} b={be(20, 10)}>
            <g transform="translate(-200,780)"><CactusWords t={f} k={pr(f, wordF(20, 'ketus'), wordF(20, 'ketus') + 4)} dist={300} /></g>
            <LitFemale id="f1w20" x={160} y={FLOOR_Y} scale={0.95} pose="recoiling_hands_up" expression="hurt" haloColor="#FFB3D0" />
          </Vis>
        </Vis>
        {/* 21: pintu kamar, gagang diputar paksa dari luar, istri bersandar menahan (SIMBOLIK) */}
        <Vis {...L(...Wn(21))}>
          <g transform={`translate(${APT.doorX},${FLOOR_Y - 460})`}><ForcedDoor t={f} k={pr(f, bf(21, 10), bf(21, 30))} /></g>
          <LitFemale id="f1w21" x={APT.doorX - 280} y={FLOOR_Y} scale={0.95} pose="leaning_against_door" expression="scared" haloColor="#FF4A5A" rimColor2="#FF8A90" />
        </Vis>
        {/* 22: suami membelakangi, punggung berembun beku */}
        <Vis {...L(...Wn(22))}>
          <LitCharacter id="f1m22" x={1900} y={FLOOR_Y} scale={0.95} pose="back_turned_frosty" expression="cold" haloColor="#9FC4FF" rimColor2="#DDF2FF" />
        </Vis>
        {/* 23: tanaman pot disiram cairan racun -> layu menghitam */}
        <Vis {...L(...Wn(23))}>
          <g transform="translate(60,1120)"><PoisonPlant t={f} k={pr(f, wordF(23, 'perilaku'), be(23, -4))} /></g>
          <LitCharacter id="f1m23" x={444} y={FLOOR_Y} scale={0.95} pose="pouring_from_bottle" expression="cold" haloColor="#7CFF6A" rimColor2="#C9FFB8" />
        </Vis>
        {/* 24: kerikil kata-kata dilempar ke kaca jendela, retak menjalar */}
        <Vis {...L(...Wn(24))}>
          <g transform={`translate(${APT.windowX},460)`}><CrackWindow t={f} k={pr(f, bf(24, 10), be(24, -4))} /></g>
          <LitCharacter id="f1m24" x={700} y={FLOOR_Y} scale={0.95} pose="throwing_pebbles" expression="angry" haloColor="#9FC4FF" />
        </Vis>
        {/* 25: suami tidur pulas membelakangi, istri terjaga menatap langit-langit, jam dinding */}
        <Vis {...L(...Wn(25))}>
          <g transform="translate(1700,520) scale(0.85)"><NightClock t={f} /></g>
          <g transform={`translate(2050,${FLOOR_Y})`}><BedFg tone={tone} w={920} /></g>
          <LitFemale id="f1w25" x={2010} y={1010} scale={0.92} pose="lying_awake_in_bed" expression="exhausted" haloColor="#B08AFF" halo={0.5} />
          <LitCharacter id="f1m25" x={2120} y={1068} scale={0.92} pose="sleeping_soundly_back_turned" expression="flat" haloColor="#B08AFF" halo={0.5} />
        </Vis>
        {/* 26: pensil EMPATI tumpul di nakas, rautan kosong berdebu */}
        <Vis {...L(...Wn(26))} fout={2}>
          <rect x={2300} y={FLOOR_Y - 200} width={300} height={200} rx={10} fill={tone.furn} />
          <rect x={2290} y={FLOOR_Y - 214} width={320} height={20} rx={6} fill={tone.furnHi} opacity={0.5} />
          <g transform={`translate(2440,${FLOOR_Y - 262}) scale(0.62)`}><DullPencil t={f} k={pr(f, wordF(26, 'sudah'), be(26, -6))} /></g>
          <LitCharacter id="f1m26" x={2140} y={FLOOR_Y} scale={0.95} pose="pockets_shoulders_up" expression="flat" haloColor="#FFB060" />
        </Vis>
      </g>
    );
  },
};
