import React from 'react';
import {C, mix} from '../theme';
import {Flag, Sun} from '../components/Props';

// Jalan berkelok ke cakrawala + bendera + matahari. fog 0..1 kabut, sun 0..1 tinggi matahari.
export const ROAD = 'M 250 1920 C 330 1600 760 1500 700 1300 C 650 1150 420 1110 500 990 C 530 950 560 940 580 930 ' +
  'L 600 930 C 590 945 570 955 560 990 C 500 1110 760 1150 800 1300 C 860 1520 640 1640 830 1920 Z';
export const Landscape: React.FC<{sun?: number; fog?: number; dim?: number}> = ({sun = 1, fog = 0, dim = 0}) => (
  <g>
    <Sun x={540} y={1000 - sun * 260} glow={1 - dim} color={mix(C.gold, '#8D7F88', dim)} />
    <path d="M -100 980 C 150 860 300 900 480 960 C 650 880 850 860 1180 960 L 1180 1920 L -100 1920 Z" fill={C.plum} />
    <path d="M -100 1100 C 200 1000 400 1060 540 1020 C 700 990 900 1050 1180 1000 L 1180 1920 L -100 1920 Z" fill="#4A2340" />
    <path d={ROAD} fill={mix(C.amber, '#7A6A70', dim)} />
    <path d="M 540 1900 C 600 1640 760 1520 750 1300 C 700 1140 480 1110 540 990 C 560 960 580 945 590 935"
      stroke={C.cream} strokeWidth={8} strokeDasharray="28 30" fill="none" opacity={0.7} />
    <Flag x={600} y={935} s={0.45} />
    {fog > 0 && (
      <g opacity={fog}>
        <rect x={-100} y={700} width={1280} height={1300} fill="#9B8A94" opacity={0.55} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={100 + i * 190} cy={980 + (i % 2) * 120} rx={260} ry={110} fill="#B5A6AE" opacity={0.7} />
        ))}
      </g>
    )}
  </g>
);
