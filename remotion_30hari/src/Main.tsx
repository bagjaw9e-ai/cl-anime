import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SHOTS} from './shots';
import {ShotSeq, TR} from './shot';
import {CalloutView, PhaseLabel, Subtitle} from './components/UI';
import {Grain, Vignette} from './components/Bg';

// mode 'animatic': VO saja; 'final': mix final (VO + BGM + SFX) — dirakit di langkah audio.
export const Main: React.FC<{mode?: 'animatic' | 'final'}> = ({mode = 'animatic'}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map((s, i) => {
      const next = SHOTS[i + 1];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from + (next ? TR[next.enter] : 0)} name={s.id}>
          <ShotSeq s={s} next={next} />
        </Sequence>
      );
    })}
    <Vignette strength={0.5} />
    <Grain opacity={0.03} />
    {/* overlay UI global (tidak ikut kamera) */}
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <PhaseLabel />
      <CalloutView />
      <Subtitle />
    </svg>
    <Audio src={staticFile(mode === 'final' ? 'mix_final.wav' : 'voiceover.m4a')} />
  </AbsoluteFill>
);
