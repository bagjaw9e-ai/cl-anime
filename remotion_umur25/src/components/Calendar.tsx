import React from 'react';
import {C} from '../theme';
import {FONT} from '../fonts';

/** Kalender dinding (gaya flat). circled: tanggal yang dilingkari; circleColor; stamp: teks stempel besar; page: angka halaman. */
export const WallCalendar: React.FC<{page?: string; circled?: number[]; circleP?: number; circleColor?: string; stamp?: string; stampP?: number;
  tear?: number; header?: string; w?: number}> = ({page, circled = [], circleP = 1, circleColor = C.red2, stamp, stampP = 0, tear = 0, header, w = 300}) => {
  const h = w * 1.05, s = w / 300;
  return (
    <g>
      <g transform={`scale(${s})`}>
        <rect x={-150} y={-150} width={300} height={315} rx={20} fill="#F5E6DA" />
        <path d="M -150 -130 Q -150 -150 -130 -150 L 130 -150 Q 150 -150 150 -130 L 150 -80 L -150 -80 Z" fill={C.red1} />
        {header && <text x={0} y={-103} textAnchor="middle" fontSize={30} fontWeight={800} fill="#FFFFFF" fontFamily={FONT}>{header}</text>}
        {[-80, 80].map((x) => <rect key={x} x={x - 8} y={-168} width={16} height={36} rx={8} fill="#6E5A62" />)}
        {page ? (
          <text x={0} y={70} textAnchor="middle" fontSize={130} fontWeight={800} fill="#2A1838" fontFamily={FONT}>{page}</text>
        ) : (
          Array.from({length: 28}).map((_, i) => {
            const x = -120 + (i % 7) * 40, y = -55 + Math.floor(i / 7) * 52, d = i + 1;
            const on = circled.includes(d);
            return (
              <g key={i}>
                <text x={x} y={y + 10} textAnchor="middle" fontSize={20} fontWeight={700} fill="#5A4A50" fontFamily={FONT}>{d}</text>
                {on && <circle cx={x} cy={y + 3} r={18} fill="none" stroke={circleColor} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - circleP} />}
              </g>
            );
          })
        )}
        {/* halaman yang disobek */}
        {tear > 0 && (
          <g transform={`translate(${tear * 160},${tear * 220}) rotate(${tear * 50})`} opacity={1 - tear}>
            <rect x={-150} y={-80} width={300} height={245} fill="#EFDCCD" />
          </g>
        )}
      </g>
      {stamp && stampP > 0 && (
        <g transform={`rotate(-14) scale(${(2.2 - 1.2 * Math.min(1, stampP)) * s})`} opacity={Math.min(1, stampP * 1.5)}>
          <rect x={-110} y={-70} width={220} height={140} rx={18} fill="none" stroke="#E0263A" strokeWidth={12} />
          <text x={0} y={36} textAnchor="middle" fontSize={100} fontWeight={800} fill="#E0263A" fontFamily={FONT}>{stamp}</text>
        </g>
      )}
    </g>
  );
};
