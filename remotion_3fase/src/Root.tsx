import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {IllustrationSheet, ILL_H, ILL_W} from './IllustrationSheet';
import {PlaceStills, PLACES} from './PlaceStills';
import {Animatic, Main} from './Main';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} defaultProps={{audio: 'vo' as const}} />
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={30} width={540} height={960} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={120} fps={30} width={SHEET_W} height={SHEET_H} />
    <Composition id="IllustrationSheet" component={IllustrationSheet} durationInFrames={120} fps={30} width={ILL_W} height={ILL_H} />
    <Composition id="PlaceStills" component={PlaceStills} durationInFrames={PLACES.length} fps={30} width={1080} height={1920} />
  </>
);
