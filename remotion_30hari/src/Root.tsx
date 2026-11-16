import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {IllustrationSheet, ILL_H, ILL_W} from './IllustrationSheet';
import {PhaseStills} from './PhaseStills';
import {Animatic} from './Animatic';
import {AudioCheck} from './AudioCheck';
import {Main} from './Main';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} defaultProps={{mode: 'final' as const}} />
    <Composition id="AudioCheck" component={AudioCheck} durationInFrames={TOTAL_FRAMES} fps={30} width={540} height={960} />
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={30} width={540} height={960} />
    <Composition id="PhaseStills" component={PhaseStills} durationInFrames={420} fps={30} width={1080} height={1920} />
    <Composition id="IllustrationSheet" component={IllustrationSheet} durationInFrames={60} fps={30} width={ILL_W} height={ILL_H} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={120} fps={30} width={SHEET_W} height={SHEET_H} />
  </>
);
