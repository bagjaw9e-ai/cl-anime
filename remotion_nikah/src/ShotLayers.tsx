// Renderer satu shot: LATAR (tempat, di-blur DOF + diredupkan) dan DEPAN (karakter + ilustrasi) dengan transform kamera yang sama,
// lalu overlay layar. Dipakai Main (video) & PlaceStills (cek tempat). Panel neon / baterai / subtitle TIDAK di sini (overlay global).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CY, Cam, camT} from './kit';
import {Dim} from './components/Bg';

export const ShotLayers: React.FC<{cam: Cam; bg: React.ReactNode; fg: React.ReactNode; blur?: number; dim?: number; dimColor?: string;
  overlay?: React.ReactNode; style?: React.CSSProperties}> = ({cam, bg, fg, blur = 6, dim = 0.35, dimColor, overlay, style}) => {
  const T = camT(cam, CY);
  return (
    <AbsoluteFill style={style}>
      <AbsoluteFill style={{filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
        <svg width={1080} height={1920}><g transform={T}>{bg}</g>{dim > 0 && <Dim dim={dim} color={dimColor} />}</svg>
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', overflow: 'hidden'}}><g transform={T}>{fg}</g>{overlay}</svg>
    </AbsoluteFill>
  );
};

// vignette sinematik + kolam cahaya fokus (spotlight lembut ala ref_1) di koordinat LAYAR
export const ScreenVignette: React.FC<{strength?: number}> = ({strength = 0.72}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 62% at 50% 47%, rgba(0,0,0,0) 50%, rgba(2,3,6,${strength}) 100%)`}} />
);
