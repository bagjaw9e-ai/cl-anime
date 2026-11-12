import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {CUTS, TOTAL_FRAMES, sceneWindow} from './timeline';
import {SCENES} from './scenes';
import {TransitionLayer, TT} from './Transition';
import {OffsetContext} from './SceneContext';
import {Grain, Vignette} from './components/Bg';
import {C} from './theme';

// voiceover + 2 detik end card
export const TOTAL = TOTAL_FRAMES;
export {sceneWindow};

// Transisi masuk per potongan (index = id-1). Variasi: whip pan, zoom-through, match cut, shape wipe.
export const TRANS: TT[] = [
  'cut', 'zoom', 'whipL', 'cut', 'circle', 'whipR', 'zoom', 'zoom', 'whipL', 'zoom',
  'circle', 'whipR', 'slideUp', 'whipL', 'diamond', 'zoom', 'circle', 'whipR', 'whipL', 'diamond',
  'whipR', 'cut', 'whipL', 'zoom', 'circle', 'whipR', 'whipL', 'diamond', 'cut', 'zoom',
  'whipR', 'whipL', 'circle', 'zoom', 'diamond', 'whipR', 'slideUp', 'cut', 'fade',
];

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
    {/* Semua SFX dirakit jadi satu bus oleh scripts/mix_sfx.py (level, fade, maks 2 bunyi barengan). */}
    <Audio src={staticFile('sfx/sfx_bus.wav')} />
  </AbsoluteFill>
);
