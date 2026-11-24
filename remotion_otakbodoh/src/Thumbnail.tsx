// Thumbnail video "otak bodoh" (1080x1920, sama dengan video) -> out/thumbnail_otak_bodoh.jpg
// Gaya video: ruang gelap samar + lantai mengkilap, 3 pintu fase bercahaya, karakter bengong memegang HP 18+ (simbolik),
// judul teks NEON + baterai otak lowbat. Teks penting di tengah (bebas dari 260 px bawah & 80 px kiri/kanan UI TikTok/Reels).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from './fonts';
import {Dim} from './components/Places';
import {EmptyRoom, FEET, HZ, TONES, mixTone} from './components/Places4';
import {Halo, LitCharacter, Reflect, Rise} from './components/Lit';
import {Spotlight} from './components/Spot';
import {Grain} from './components/Bg';
import * as O from './illustrations/ob';

const neon = (c: string, k = 1) => `0 0 4px #FFFFFF, 0 0 ${12 * k}px ${c}, 0 0 ${28 * k}px ${c}, 0 0 ${60 * k}px ${c}, 0 0 ${110 * k}px ${c}99`;
const T0 = mixTone(TONES.emptyPurple, TONES.cityRed, 0.45);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* latar samar: ruang kosong + 3 pintu fase */}
    <AbsoluteFill style={{filter: 'blur(5px)'}}>
      <svg width={1080} height={1920}>
        <g transform="translate(540,1000) scale(1.25) translate(-540,-1000)"><EmptyRoom T={T0} /></g>
        <Dim dim={0.25} />
      </svg>
    </AbsoluteFill>
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <g transform="translate(540,1050) scale(1.25) translate(-540,-1050)">
        <Spotlight x={540} y={1000} rx={560} ry={760} dark={0.5} />
        <Reflect floor={HZ} op={0.45} depth={420}>
          <g transform={`translate(190,${HZ}) scale(0.95)`}><O.GlowDoor n={1} color="#FFD23F" on={1} /></g>
          <g transform={`translate(890,${HZ}) scale(0.95)`}><O.GlowDoor n={3} color="#FF3B3B" on={1} /></g>
        </Reflect>
        <Reflect floor={HZ} op={0.4} depth={420}>
          <g transform={`translate(540,${HZ - 40}) scale(0.95)`} opacity={0.9}><O.GlowDoor n={2} color="#FF8A2B" on={1} /></g>
        </Reflect>
        <Rise x={540} y={1100} w={600} h={600} n={14} color="#FF8A6A" t={23} />
        <Reflect floor={FEET + 80} op={0.3}>
          <LitCharacter id="th" x={540} y={FEET + 80} scale={0.8} pose="holding_phone" expression="dazed" haloColor="#FF5FA2" phoneColor="#FF5FA2"
            lookAt={{x: 0.2, y: 0.4}} />
        </Reflect>
      </g>
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 60% at 50% 55%, rgba(0,0,0,0) 45%, rgba(2,3,6,0.85) 100%)'}} />
    <Grain opacity={0.05} />

    {/* JUDUL NEON */}
    <div style={{position: 'absolute', left: 80, right: 80, top: 190, textAlign: 'center', fontFamily: FONT, fontWeight: 800, lineHeight: 1}}>
      <div style={{fontSize: 118, color: '#FFFFFF', letterSpacing: 2, textShadow: neon('#FF2A3A', 0.8)}}>OTAK JADI</div>
      <div style={{fontSize: 236, color: '#F5FF3B', letterSpacing: 4, marginTop: 6, textShadow: neon('#FFB400', 1.1), transform: 'rotate(-3deg)'}}>BODOH</div>
    </div>
    {/* baterai otak lowbat */}
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <g transform="translate(290,620)">
        <rect x={0} y={0} width={400} height={84} rx={20} fill="rgba(6,7,12,0.75)" stroke="#E8ECF4" strokeWidth={6} />
        <rect x={404} y={24} width={18} height={36} rx={6} fill="#E8ECF4" />
        <rect x={10} y={10} width={38} height={64} rx={10} fill="#FF3B3B" style={{filter: 'drop-shadow(0 0 12px #FF3B3B)'}} />
        <text x={452} y={62} fontFamily={FONT} fontWeight={800} fontSize={60} fill="#FF4A55" style={{filter: 'drop-shadow(0 0 10px #FF3B3B)'}}>7%</text>
      </g>
      <Halo x={540} y={660} rx={360} ry={90} color="#FF3B3B" op={0.18} />
    </svg>
    {/* sub judul */}
    <div style={{position: 'absolute', left: 80, right: 80, top: 1440, textAlign: 'center', fontFamily: FONT, fontWeight: 800}}>
      <div style={{display: 'inline-block', padding: '18px 34px', borderRadius: 28, background: 'rgba(6,7,12,0.7)', border: '3px solid #FF3B3B88',
        boxShadow: '0 0 30px #FF3B3B55'}}>
        <span style={{fontSize: 64, color: '#FFFFFF', textShadow: neon('#2FD8FF', 0.5)}}>3 FASE </span>
        <span style={{fontSize: 64, color: '#FFFFFF', textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>KERUSAKAN OTAK</span>
        <div style={{fontSize: 58, marginTop: 6}}>
          <span style={{color: '#FFFFFF', textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>AKIBAT </span>
          <span style={{color: '#FF3B4A', textShadow: neon('#FF2A3A', 0.7)}}>PMO</span>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
