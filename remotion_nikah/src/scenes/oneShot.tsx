// ONE SHOT (beat 4-5): kamar pengantin baru penuh kardus. SATU shot tanpa cut, zoom in pelan konstan 1x -> 3x (eksponensial),
// tone krem hangat -> ungu -> merah gelap. TANPA ilustrasi otak. Rumah kartu runtuh -> jadi transisi ke Fase 1.
import React from 'react';
import {Easing} from 'remotion';
import {ShotDef} from './types';
import {Vis, pr} from './kit2';
import {bf, wordF} from './beats';
import {FLOOR_Y, mixTone} from '../theme';
import {Halo, LitCharacter, LitFemale} from '../components/Lit';
import {PlaceNewlywed, TONES} from '../components/PlacesNikah';
import {FantasySwirl} from '../illustrations/nk/hook';
import {CardHouse} from '../illustrations/nk/shared';

const A = bf(4), B = bf(6);
const EIO = Easing.inOut(Easing.sin);
const U = (f: number) => Math.max(0, Math.min(1, (f - A) / (B - A)));
// rumah kartu: di tangan istri -> pindah ke tangan kanan suami (sambil lirik HP) -> goyah -> runtuh
const HOUSE_W = {x: 330, y: 1012, s: 0.48}, HOUSE_M = {x: 563, y: 992, s: 0.59};
const tGive = wordF(5, 'masa'), tGot = tGive + 17;
export const housePos = (f: number) => {
  const k = pr(f, tGive, tGot);
  return {x: HOUSE_W.x + (HOUSE_M.x - HOUSE_W.x) * k, y: HOUSE_W.y + (HOUSE_M.y - HOUSE_W.y) * k - Math.sin(k * Math.PI) * 30, s: HOUSE_W.s + (HOUSE_M.s - HOUSE_W.s) * k};
};
export const shotOneShot: ShotDef = {
  id: 'oneShot', from: A, to: B, enter: 'dissolve', trLen: 8,
  cam: (f) => {
    const u = U(f), e = EIO(u);
    return {x: 560 + (512 - 560) * e, y: 860 + (948 - 860) * e, s: Math.exp(Math.log(3) * u)};
  },
  tone: (f) => { const u = U(f); return u < 0.5 ? mixTone(TONES.osCream, TONES.osPurple, u / 0.5) : mixTone(TONES.osPurple, TONES.osRed, (u - 0.5) / 0.5); },
  blur: (f) => 6 + U(f) * 4, dim: (f) => 0.28 + U(f) * 0.18,
  bg: (f, tone) => <PlaceNewlywed tone={tone} t={f} />,
  fg: (f, tone) => {
    const hp = housePos(f), wob = 0.25 + pr(f, tGot, tGot + 20) * 0.9, col = pr(f, wordF(5, 'perjuangkan?') - 6, B + 14);
    return (
      <g>
        <Halo x={560} y={900} rx={560} ry={480} color={tone.glow} op={0.18} />
        <LitFemale id="osw" x={330} y={FLOOR_Y} scale={0.95} noProps haloColor={tone.glow}
          pose={[[0, 'hands_folded_front'], [bf(5), 'offering_model_house']]} expression={[[0, 'hopeful'], [tGot + 12, 'confused']]} />
        <LitCharacter id="osm" x={680} y={FLOOR_Y} scale={0.95} propK={-1} haloColor={tone.glow} phoneColor="#FF4FA8"
          pose={[[0, 'standing_in_fantasy_swirl'], [bf(5), 'holding_house_of_cards']]} expression={[[0, 'overwhelmed'], [bf(5), 'distant']]} />
        <Vis f={f} a={A} b={bf(5, 14)} fin={10} fout={14}><g transform="translate(680,560)"><FantasySwirl t={f} k={pr(f, A, A + 14)} /></g></Vis>
        <Vis f={f} a={bf(5) - 2} b={B + 40} fin={8} fout={2}>
          <g transform={`translate(${hp.x},${hp.y})`}><CardHouse t={f} s={hp.s} wob={wob} collapse={col} glow={0.7} /></g>
        </Vis>
      </g>
    );
  },
};
