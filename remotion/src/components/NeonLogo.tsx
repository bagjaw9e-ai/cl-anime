import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {NEON_ON} from '../timeline';

// Ukuran file logo (sudah di-key: hitam -> transparan, margin transparan dipangkas). Teks ~75% lebar file.
export const LOGO_W = 498;
export const LOGO_H = 339;

// Level neon dari jadwal NEON_ON (frame relatif scene 37): nyala/mati kayak lampu neon baru dinyalain.
export const neonLevel = (f: number) => {
  for (let k = 0; k < NEON_ON.length; k++) {
    const [a, b] = NEON_ON[k];
    if (f >= a && f < b) {
      const last = k === NEON_ON.length - 1;
      return last ? Math.min(1, 0.75 + (f - a) * 0.08) : 0.85;
    }
  }
  return 0.06; // tabung mati: samar
};

/**
 * Logo PMO SAVIOR (satu-satunya pengecualian aturan tanpa teks).
 * width = lebar file di layar; teksnya ~0.75*width. level 0..1 nyala, boost = pulse ekstra.
 */
export const NeonLogo: React.FC<{cx?: number; cy?: number; width?: number; level?: number; boost?: number; scale?: number}> = ({
  cx = 540, cy = 480, width = 900, level = 1, boost = 0, scale = 1,
}) => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.16);
  const lv = level * (0.92 + 0.08 * pulse) + boost;
  const h = (width * LOGO_H) / LOGO_W;
  const glowA = Math.min(1, 0.35 * lv + 0.15 * pulse * level + boost * 0.4);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* halo merah yang menerangi latar */}
      <div style={{
        position: 'absolute', left: cx - width * 0.75, top: cy - h * 0.9, width: width * 1.5, height: h * 1.8,
        background: `radial-gradient(ellipse at center, rgba(255,45,55,${0.32 * lv}) 0%, rgba(255,45,55,${0.1 * lv}) 40%, rgba(255,45,55,0) 70%)`,
      }} />
      <Img src={staticFile('pmo_savior.png')} style={{
        position: 'absolute', left: cx - width / 2, top: cy - h / 2, width, height: h,
        transform: `scale(${scale})`, transformOrigin: 'center',
        // logo sudah di-key (alpha) -> blend normal supaya warna teks persis aslinya; brightness <= 1 kecuali saat pulse
        opacity: Math.min(1, 0.12 + level),
        filter: `brightness(${Math.min(1, 0.2 + level * 0.8) + boost * 0.35}) drop-shadow(0 0 ${14 + 16 * lv}px rgba(255,40,50,${glowA}))`,
      }} />
    </AbsoluteFill>
  );
};
