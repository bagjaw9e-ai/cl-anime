import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet, SHEET_H, SHEET_W} from './CharacterSheet';
import {IllustrationSheet, ILL_H, ILL_W} from './IllustrationSheet';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={120} fps={30} width={SHEET_W} height={SHEET_H} />
    <Composition id="IllustrationSheet" component={IllustrationSheet} durationInFrames={120} fps={30} width={ILL_W} height={ILL_H} />
  </>
);
