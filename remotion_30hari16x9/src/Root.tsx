import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {Animatic, Main} from './Main';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{audio: 'vo' as const}} />
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={30} width={960} height={540} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={120} fps={30} width={SHEET_W} height={SHEET_H} />
  </>
);
