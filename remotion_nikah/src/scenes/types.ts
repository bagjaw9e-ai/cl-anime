import React from 'react';
import {Cam} from '../kit';

// Transisi masuk shot: cut, dissolve (blur dissolve), dark (fade lewat gelap ala ref_1), light (light sweep/bloom),
// whip (whip slide horizontal + motion blur ala ref_2), blend (match cut: dissolve singkat + kilat)
export type Trans = 'cut' | 'dissolve' | 'dark' | 'light' | 'whip' | 'blend';
export type ShotDef = {
  id: string;
  from: number; to: number;
  enter: Trans; trLen: number; trColor?: string;
  cam: (f: number) => Cam;
  bg: (f: number) => React.ReactNode;      // ruangan (diblur tipis = depth of field)
  bgBlur?: (f: number) => number;
  dim?: (f: number) => number;              // redupkan ruangan
  fg: (f: number) => React.ReactNode;      // karakter + ilustrasi (koordinat dunia, ikut kamera)
  overlay?: (f: number) => React.ReactNode; // koordinat layar (tidak ikut kamera), mis. kilatan blitz
  floorY?: number;   // kaki karakter: kamera dijepit supaya lantai ini tampil maks y≈1260 di layar (zona tengah)
  free?: (f: number) => boolean; // true = kamera bebas (one shot zoom)
};
