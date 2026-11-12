import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={60} fps={30} width={SHEET_W} height={SHEET_H} />
  </>
);
