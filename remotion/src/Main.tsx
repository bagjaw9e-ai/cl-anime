import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {CUTS, VO_DURATION} from './timeline';
import {SCENES} from './scenes';
import {TR, TransitionLayer, TT} from './Transition';
import {OffsetContext} from './SceneContext';
import {Grain, Vignette} from './components/Bg';
import {C, FPS} from './theme';

// Detik dari awal file SFX ke titik benturan (decit rem sebelum snap).
const SFX_LEAD: Record<string, number> = {brake_snap: 0.5};

export const TOTAL = Math.ceil(VO_DURATION * FPS);

// Transisi masuk per potongan (index = id-1). Variasi: whip pan, zoom-through, match cut, shape wipe.
export const TRANS: TT[] = [
  'cut', 'zoom', 'whipL', 'cut', 'circle', 'whipR', 'zoom', 'zoom', 'whipL', 'zoom',
  'circle', 'whipR', 'slideUp', 'whipL', 'diamond', 'zoom', 'circle', 'whipR', 'whipL', 'diamond',
  'whipR', 'cut', 'whipL', 'zoom', 'circle', 'whipR', 'whipL', 'diamond', 'cut', 'zoom',
  'whipR', 'whipL', 'circle', 'zoom', 'diamond', 'whipR', 'slideUp', 'cut',
];

export const STARTS = CUTS.map((c, i) => (i === 0 ? 0 : Math.round(c.start * FPS) - 3));

export const sceneWindow = (i: number) => {
  const from = STARTS[i];
  const last = i === CUTS.length - 1;
  const dur = (last ? TOTAL : STARTS[i + 1]) - from + (last ? 0 : TR);
  const b = (CUTS[i].beats ?? []).map((t) => Math.round(t * FPS) - from);
  const hit = CUTS[i].sfx ? Math.round(CUTS[i].sfx!.at * FPS) - from : -999;
  return {from, dur, b, hit};
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: C.base0}}>
    {CUTS.map((c, i) => {
      const {from, dur, b, hit} = sceneWindow(i);
      const Comp = SCENES[i];
      return (
        <Sequence key={c.id} from={from} durationInFrames={dur} name={`S${c.id}`}>
          <OffsetContext.Provider value={from}>
            <TransitionLayer enter={TRANS[i]} exit={TRANS[i + 1]} len={dur}>
              <Comp dur={dur} b={b} hit={hit} />
            </TransitionLayer>
          </OffsetContext.Provider>
        </Sequence>
      );
    })}
    <Vignette strength={0.6} />
    <Grain opacity={0.03} />
    <Audio src={staticFile('voiceover.m4a')} />
    {CUTS.filter((c) => c.sfx).map((c) => (
      <Sequence key={'sfx' + c.id} from={Math.round((c.sfx!.at - (SFX_LEAD[c.sfx!.name] ?? 0)) * FPS)} name={`sfx_${c.sfx!.name}`}>
        <Audio src={staticFile(`sfx/${c.sfx!.name}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
