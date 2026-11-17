import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Reflect} from './components/Lit';
import {ChainLine} from './components/Chain';
import * as I from './illustrations';
import {Stage} from './Stage';

export const ILL_W = 2400;
export const ILL_H = 2460;

type Item = [string, (t: number) => React.ReactNode, number, number]; // label, gambar (origin = dasar di lantai, tengah panel), skala, warm
const ITEMS: Item[] = [
  ['1 HP adiksi + rantai', (t) => <g><I.AddictPhone glow={0.6} /><ChainLine x1={-260} y1={-300} x2={-40} y2={-150} sag={40} /></g>, 1, 0],
  ['1 rantai putus + kilatan', (t) => <g><I.FallingChain t={18} t0={0} x={-90} y={-330} floorY={0} len={110} ang={30} /><I.FallingChain t={8} t0={0} x={90} y={-300} floorY={0} len={90} ang={-20} dir={-1} /><I.SnapFlash t={3} t0={0} x={0} y={-360} /></g>, 1, 0],
  ['2 otak retak + plester', (t) => <g transform="translate(0,-330)"><I.BrainHeal t={t} crack={1} heal={0} peel={0} lit={0.6} /></g>, 0.85, 1],
  ['2 retakan nyala amber', (t) => <g transform="translate(0,-330)"><I.BrainHeal t={t} crack={1} heal={0.4} peel={0.5} /></g>, 0.85, 1],
  ['2 otak pulih (menyatu)', (t) => <g transform="translate(0,-330)"><I.BrainHeal t={t} crack={1} heal={1} peel={1} /></g>, 0.85, 1],
  ['3 papan klip (off → on)', (t) => <g><g transform="translate(-95,0) scale(0.7)"><I.Clipboard on={0} t={t} /></g><g transform="translate(95,0) scale(0.7)"><I.Clipboard on={1} t={60} /></g></g>, 1, 1],
  ['3 tabung reaksi', (t) => <I.TestTubes on={1} t={t} />, 1, 1],
  ['3 mikroskop', (t) => <I.Microscope on={1} t={t} />, 1, 1],
  ['4 neuron (tumbuh)', (t) => <g transform="translate(0,-360)"><I.NeuronNet t={t} grow={0.45} s={0.5} /></g>, 1, 1],
  ['4 neuron (penuh)', (t) => <g transform="translate(0,-360)"><I.NeuronNet t={t} grow={1} s={0.5} /></g>, 1, 1],
  ['5 peti terkunci', (t) => <I.TreasureChest t={t} unlock={0} open={0} />, 0.85, 1],
  ['5 peti terbuka', (t) => <I.TreasureChest t={t} unlock={1} open={1} lockFall={1} />, 0.85, 1],
  ['6 pita kusut', (t) => <g transform="translate(0,-300)"><I.TangledRibbon t={t} cut={0} len={330} /></g>, 1, 1],
  ['6 pita lurus (digunting)', (t) => <g transform="translate(0,-300)"><I.TangledRibbon t={t} cut={1} len={330} /><I.SnippedKnot t={14} t0={0} x={20} y={-40} floorY={300} /></g>, 1, 1],
  ['7 e-book (tablet) + logo', (t) => <g transform="translate(0,-330)"><I.EbookTablet t={t} on={1} s={0.75} /></g>, 1, 1],
  ['7 video player + logo', (t) => <g transform="translate(0,-330)"><I.VideoCard t={t} on={1} press={0.5} s={0.75} /></g>, 1, 1],
  ['8 toko + papan neon', (t) => <I.Storefront t={t} neon={1} />, 0.62, 0],
  ['9 ikon link + panah ke atas', (t) => <g><g transform="translate(-60,-200)"><I.LinkIcon t={t} on={1} s={0.8} /></g><g transform="translate(120,-170)"><I.ArrowUp t={t} on={1} /></g></g>, 1, 0],
];

export const IllustrationSheet: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={ILL_W} height={ILL_H}>
        {ITEMS.map(([label, el, s, warm], i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const w = 380, h = 740, floor = 600;
          return (
            <Stage key={label} x={20 + col * 396} y={20 + row * 810} w={w} h={h} floor={floor} warm={warm} label={label}>
              <Reflect floor={floor} op={0.2} depth={140}>
                <g transform={`translate(${w / 2},${floor}) scale(${s})`}>{el(t)}</g>
              </Reflect>
            </Stage>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
