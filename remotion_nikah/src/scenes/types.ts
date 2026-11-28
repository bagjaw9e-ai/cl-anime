import React from 'react';
import {Cam} from '../kit';
import {Tone} from '../theme';

// Transisi masuk shot (dipakai saat GANTI TEMPAT/FASE):
// cut = hard cut (hook), whip = slide horizontal + motion blur, dark = fade lewat gelap (ref_1), dissolve = blur dissolve,
// zoomThrough = zoom tembus objek (pintu) -> tempat baru, dust = rumah kartu jadi debu -> reveal (pull-out)
export type Trans = 'cut' | 'whip' | 'dark' | 'dissolve' | 'zoomThrough' | 'dust';
export type ShotDef = {
  id: string;
  from: number; to: number;
  enter: Trans; trLen: number;
  cam: (f: number) => Cam;
  tone: (f: number) => Tone;                               // tone latar: berubah halus tiap zoom, tempat tetap
  bg: (f: number, tone: Tone) => React.ReactNode;          // tempat (diblur DOF + diredupkan)
  blur?: (f: number) => number;
  dim?: (f: number) => number;
  fg: (f: number, tone: Tone) => React.ReactNode;          // karakter + ilustrasi (koordinat dunia, ikut kamera, dipantulkan lantai)
  front?: (f: number, tone: Tone) => React.ReactNode;      // elemen dunia paling depan (tidak dipantulkan)
  overlay?: (f: number) => React.ReactNode;                // koordinat layar
};
