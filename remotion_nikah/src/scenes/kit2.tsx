// Helper scene: fade grup elemen (keluar-masuk saat fokus pindah), mirror karakter, posisi tangan.
import React from 'react';
import {ramp, sm} from '../kit';

// tampil di [a, b) dengan fade in/out (frame). Mengembalikan null di luar jendela.
export const Vis: React.FC<{f: number; a: number; b: number; fin?: number; fout?: number; children: React.ReactNode}> = ({f, a, b, fin = 8, fout = 8, children}) => {
  if (f < a || f >= b + 0) return null;
  const op = sm(ramp(f, a, a + fin)) * (1 - sm(ramp(f, b - fout, b)));
  return <g opacity={op}>{children}</g>;
};
// cermin horizontal di sekitar x (karakter menghadap sebaliknya)
export const Flip: React.FC<{x: number; children: React.ReactNode}> = ({x, children}) => <g transform={`translate(${x},0) scale(-1,1) translate(${-x},0)`}>{children}</g>;
// progres 0..1 antara frame a..b (smoothstep)
export const pr = (f: number, a: number, b: number) => sm(ramp(f, a, b));
