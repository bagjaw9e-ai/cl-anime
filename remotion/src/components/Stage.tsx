import React from 'react';
import {AbsoluteFill} from 'remotion';
import {H, W} from '../theme';
import {Backdrop, Particles} from './Bg';
import {Cam, camT} from '../anim';

type BP = React.ComponentProps<typeof Backdrop>;
type PP = React.ComponentProps<typeof Particles>;

// Panggung scene: latar + partikel + svg 1080x1920 dengan kamera.
export const Stage: React.FC<{
  bg?: BP; particles?: PP | false; cam?: Cam; children?: React.ReactNode; over?: React.ReactNode;
  under?: React.ReactNode; flash?: number; flashColor?: string;
}> = ({bg = {}, particles = {}, cam = {}, children, over, under, flash = 0, flashColor = '#FFF3D6'}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Backdrop {...bg} />
    {under}
    {particles !== false && <Particles {...particles} />}
    <svg width={W} height={H} style={{position: 'absolute'}} viewBox={`0 0 ${W} ${H}`}>
      <g transform={camT(cam)}>{children}</g>
    </svg>
    {over}
    {flash > 0 && <AbsoluteFill style={{background: flashColor, opacity: flash}} />}
  </AbsoluteFill>
);
