// Thumbnail video "otak bodoh" (1080x1920, sama dengan video) -> out/thumbnail_otak_bodoh.jpg
// Revisi: latar gelap, pencahayaan fokus (spotlight) ke karakter CLOSE-UP, ekspresi melotot, kedua tangan memegang ujung teks.
// Teks "OTAK BODOH KARENA" / "PMO" (PMO di-highlight) di tengah area bawah, overlay PALING DEPAN (boleh menimpa karakter).
// Vignette di bagian atas & bawah. Teks bebas dari 260 px bawah & 80 px kiri/kanan (UI TikTok/Reels).
import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {FONT} from './fonts';
import {EmptyRoom, TONES, mixTone} from './components/Places4';
import {Halo, LitCharacter, Rise} from './components/Lit';
import {Spotlight} from './components/Spot';
import {Grain} from './components/Bg';
import {handWorld} from './components/Character';

// karakter close-up
const CX = 540, SC = 2.3, FEET_Y = 1815;
const hl = handWorld('holding_text_edges', -1, CX, FEET_Y, SC); // tangan kanan karakter (kiri layar)
const hr = handWorld('holding_text_edges', 1, CX, FEET_Y, SC);  // tangan kiri karakter (kanan layar)
const L1_Y = (hl.y + hr.y) / 2;                                 // garis tengah baris 1 = tinggi genggaman

// font judul: Anton (display kondensed tebal, @fontsource/anton, OFL) -> bisa jauh lebih besar dalam lebar yang sama
const DISPLAY = 'Anton, Impact, sans-serif';
if (typeof document !== 'undefined') {
  const h = delayRender('load Anton');
  new FontFace('Anton', `url(${staticFile('fonts/anton-latin-400-normal.woff2')}) format('woff2')`).load()
    .then((f) => { (document.fonts as unknown as {add: (x: FontFace) => void}).add(f); continueRender(h); }).catch(() => continueRender(h));
}
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number) => {
  if (typeof document === 'undefined') return txt.length * size * 0.45;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `400 ${size}px Anton`;
  return ctx!.measureText(txt).width;
};
const L1 = 'OTAK BODOH KARENA';

export const Thumbnail: React.FC = () => {
  // baris 1 mengisi jarak antar genggaman (ujung huruf ada di tangan), tetap di dalam 80 px kiri/kanan
  const span = 850; // lebar baris 1 tetap; tangan menggenggam tepat di ujung kotak highlight
  const fs1 = (span / measure(L1, 100)) * 100;
  const fs2 = Math.max(fs1 * 1.9, 280); // PMO tetap paling besar
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* latar gelap samar */}
      <AbsoluteFill style={{filter: 'blur(9px)'}}>
        <svg width={1080} height={1920}>
          <EmptyRoom T={mixTone(TONES.emptyPurple, TONES.cityRed, 0.5)} />
          <rect width={1080} height={1920} fill="#04030A" opacity={0.55} />
        </svg>
      </AbsoluteFill>
      {/* fokus cahaya ke karakter close-up */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Spotlight x={540} y={900} rx={560} ry={700} dark={0.92} />
        <Halo x={540} y={760} rx={520} ry={560} color="#FF4A6A" op={0.28} />
        <Halo x={540} y={720} rx={300} ry={300} color="#FFE6C8" op={0.22} />
        <Rise x={540} y={1100} w={760} h={700} n={16} color="#FF8A6A" t={17} />
        <LitCharacter id="th" x={CX} y={FEET_Y} scale={SC} pose="holding_text_edges" expression="bulging" haloColor="#FF5A7A" lookAt={{x: 0, y: 0.05}} blinkSeed={99} />
      </svg>
      {/* vignette atas & bawah */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 12%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 55% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
      <Grain opacity={0.05} />

      {/* TEKS — overlay paling depan */}
      <div style={{position: 'absolute', left: 0, right: 0, top: L1_Y - fs1 * 0.62, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12}}>
        {/* baris 1: teks KUNING di atas highlight MERAH (kebalikan warna PMO) */}
        <div style={{display: 'inline-block', position: 'relative', transform: 'rotate(2deg)'}}>
          <div style={{position: 'absolute', left: -22, right: -22, top: fs1 * 0.1, bottom: fs1 * 0.02, background: '#E8101E', borderRadius: 20,
            boxShadow: '0 0 40px #FF2A3AAA, 0 0 90px #FF2A3A55, 0 12px 0 #0A0A14'}} />
          <div style={{position: 'relative', fontSize: fs1, letterSpacing: 1, whiteSpace: 'nowrap', color: '#F5FF3B', WebkitTextStroke: '7px #0A0A14', paintOrder: 'stroke fill',
            textShadow: '0 7px 0 #0A0A14'}}>{L1}</div>
        </div>
        <br />
        {/* baris 2: PMO paling besar, merah di atas highlight kuning */}
        <div style={{marginTop: fs1 * 0.12, display: 'inline-block', position: 'relative', transform: 'rotate(-4deg)'}}>
          <div style={{position: 'absolute', left: -40, right: -40, top: fs2 * 0.12, bottom: fs2 * 0.06, background: '#F5FF3B', borderRadius: 24,
            boxShadow: '0 0 44px #F5FF3BAA, 0 0 100px #FFB40066, 0 14px 0 #0A0A14'}} />
          <div style={{position: 'relative', fontSize: fs2, color: '#E8101E', letterSpacing: 8, WebkitTextStroke: '8px #0A0A14', paintOrder: 'stroke fill',
            textShadow: '0 8px 0 #0A0A14'}}>PMO</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
