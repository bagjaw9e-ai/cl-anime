import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {Main, TOTAL} from './Main';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={60} fps={30} width={SHEET_W} height={SHEET_H} />
  </>
);
