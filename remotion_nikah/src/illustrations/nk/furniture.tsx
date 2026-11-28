// FURNITUR DEPAN (tajam, di layer karakter) — dipakai saat karakter duduk/rebahan/tidur di atasnya supaya tidak "melayang"
// di atas latar yang di-blur. Warna mengikuti tone tempat. Koordinat: (0,0) = tengah bawah di lantai.
import React from 'react';
import {Tone, mix} from '../../theme';

export const SofaFg: React.FC<{tone: Tone; w?: number}> = ({tone, w = 820}) => {
  const c = mix(tone.furn, tone.furnHi, 0.22), d = mix(tone.furn, tone.furnHi, 0.12), h = mix(tone.furn, tone.furnHi, 0.36);
  return (
    <g>
      <rect x={-w / 2 + 40} y={-370} width={w - 80} height={220} rx={40} fill={d} />
      <rect x={-w / 2 + 50} y={-250} width={w - 100} height={150} rx={26} fill={c} />
      <rect x={-w / 2 + 60} y={-250} width={w - 120} height={14} rx={7} fill={h} opacity={0.6} />
      {[-1, 1].map((sd) => <rect key={sd} x={sd < 0 ? -w / 2 : w / 2 - 120} y={-330} width={120} height={300} rx={44} fill={h} />)}
      <rect x={-w / 2 + 20} y={-110} width={w - 40} height={90} rx={14} fill={tone.furn} />
      {[-1, 1].map((sd) => <rect key={`l${sd}`} x={sd * (w / 2 - 60) - 10} y={-24} width={20} height={24} fill={mix(tone.furn, '#000000', 0.4)} />)}
    </g>
  );
};
export const BedFg: React.FC<{tone: Tone; w?: number; head?: 'left' | 'right'; h?: number}> = ({tone, w = 900, head = 'left', h = 1}) => {
  const c = mix(tone.furn, tone.furnHi, 0.5), d = tone.furn;
  const hx = head === 'left' ? -w / 2 - 30 : w / 2 - 30;
  return (
    <g transform={`scale(1,${h})`}>
      <rect x={hx} y={-520} width={60} height={520} rx={18} fill={mix(d, tone.furnHi, 0.2)} />
      <rect x={-w / 2} y={-170} width={w} height={130} rx={16} fill={d} />
      <rect x={-w / 2 + 10} y={-210} width={w - 20} height={60} rx={24} fill={c} />
      <ellipse cx={head === 'left' ? -w / 2 + 120 : w / 2 - 120} cy={-226} rx={90} ry={32} fill={mix(c, '#FFFFFF', 0.35)} />
      {[-1, 1].map((sd) => <rect key={sd} x={sd * (w / 2 - 30) - 12} y={-40} width={24} height={40} fill={mix(d, '#000000', 0.4)} />)}
    </g>
  );
};
