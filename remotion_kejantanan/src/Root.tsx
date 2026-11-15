import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {Animatic} from './Animatic';
import {Main} from './Main';
import {AudioCheck} from './AudioCheck';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AudioCheck" component={AudioCheck} durationInFrames={TOTAL_FRAMES} fps={30} width={540} height={960} />
    <Composition id="Animatic" component={Animatic} durationInFrames={TOTAL_FRAMES} fps={30} width={540} height={960} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={120} fps={30} width={SHEET_W} height={SHEET_H} />
  </>
);
