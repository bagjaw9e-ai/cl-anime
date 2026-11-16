import React from 'react';
import {C} from '../theme';
import {WallCalendar} from '../components/Calendar';
import {FONT, IP, Pill, Spark, ramp, smooth} from './common';

// #15 kalender dilingkari hijau di tanggal 7
export const Calendar7: React.FC<IP> = ({t}) => <WallCalendar circled={[7]} circleP={ramp(t, 4, 20)} circleColor="#3CC27A" header="HARI 7" />;

// #16 lembar jurnal ilmiah "STUDY 2003" + kaca pembesar
export const JournalPaper: React.FC<IP> = ({t}) => {
  const mx = Math.sin(t * 0.08) * 60, my = Math.cos(t * 0.06) * 40;
  return (
    <g transform="rotate(-4)">
      <rect x={-150} y={-200} width={300} height={400} rx={12} fill="#FFFFFF" />
      <rect x={-150} y={-200} width={300} height={70} rx={12} fill="#2F4F4A" />
      <text x={-126} y={-153} fontSize={34} fontWeight={800} fill="#FFFFFF" fontFamily={FONT}>STUDY</text>
      <text x={126} y={-153} textAnchor="end" fontSize={28} fontWeight={700} fill="#8FD3C8" fontFamily={FONT}>2003</text>
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={-126} y={-110 + i * 30} width={i % 3 === 2 ? 160 : 250} height={10} rx={5} fill="#D6E2E0" />)}
      <rect x={-126} y={170} width={120} height={14} rx={7} fill="#4FB3A9" />
      <g transform={`translate(${40 + mx},${20 + my})`}>
        <circle r={62} fill="#DFFBF7" opacity={0.35} />
        <circle r={62} fill="none" stroke="#3A5A56" strokeWidth={12} />
        <rect x={40} y={40} width={22} height={90} rx={11} fill="#3A5A56" transform="rotate(-45 40 40)" />
      </g>
    </g>
  );
};

// #17 tabung reaksi berlabel "T" + molekul
export const TestTube: React.FC<IP> = ({t}) => (
  <g>
    <g transform={`rotate(${Math.sin(t * 0.1) * 4})`}>
      <path d="M -40 -170 L 40 -170 L 40 110 C 40 170 -40 170 -40 110 Z" fill="#FFFFFF" opacity={0.8} />
      <path d="M -40 0 L 40 0 L 40 110 C 40 170 -40 170 -40 110 Z" fill="#4FB3A9" />
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.04 + i / 3) % 1);
        return <circle key={i} cx={-14 + i * 14} cy={130 - ph * 120} r={6} fill="#DFFBF7" opacity={1 - ph} />;
      })}
      <rect x={-54} y={-190} width={108} height={26} rx={10} fill="#3A5A56" />
      <circle cx={0} cy={-90} r={36} fill="#2F4F4A" />
      <text x={0} y={-74} textAnchor="middle" fontSize={46} fontWeight={800} fill="#FFFFFF" fontFamily={FONT}>T</text>
    </g>
    <g transform={`translate(150,-60) rotate(${t * 2})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 40} cy={Math.sin((a * Math.PI) / 180) * 40} r={12} fill="#7E8CC8" />)}
      <circle r={40} fill="none" stroke="#7E8CC8" strokeWidth={6} />
    </g>
  </g>
);

// #18-19 grafik batang testosteron: garis normal 100%, batang naik ke 145% lalu turun lagi
export const BarChart145: React.FC<IP & {level?: number}> = ({level = 1}) => {
  const H = 300, base = 160;
  const hNow = (H * 0.62) * level; // 100% = 0.62*H
  return (
    <g>
      <rect x={-220} y={-230} width={440} height={430} rx={22} fill="#2F4F4A" />
      <rect x={-200} y={base} width={400} height={6} rx={3} fill="#E8F5F3" />
      {/* batang normal */}
      <rect x={-150} y={base - H * 0.62} width={100} height={H * 0.62} rx={12} fill="#8FD3C8" opacity={0.6} />
      <text x={-100} y={base + 36} textAnchor="middle" fontSize={22} fontWeight={700} fill="#DFFBF7" fontFamily={FONT}>NORMAL</text>
      {/* batang hari 7 */}
      <rect x={40} y={base - hNow} width={100} height={hNow} rx={12} fill={level > 1.2 ? '#FFD166' : '#4FB3A9'} />
      <text x={90} y={base + 36} textAnchor="middle" fontSize={22} fontWeight={700} fill="#DFFBF7" fontFamily={FONT}>HARI 7</text>
      <path d={`M -200 ${base - H * 0.62} L 200 ${base - H * 0.62}`} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="12 10" opacity={0.8} />
      <text x={-190} y={base - H * 0.62 - 12} fontSize={22} fontWeight={800} fill="#FFFFFF" fontFamily={FONT}>100%</text>
      <Pill x={90} y={base - hNow - 34} text={`${Math.round(level * 100)}%`} bg={level > 1.2 ? '#E0263A' : '#3A5A56'} size={30} />
    </g>
  );
};

// #21 kenop/dial di dada diputar pelan ke tengah + gear kecil
export const DialChest: React.FC<IP> = ({t}) => {
  const ang = 120 - 120 * smooth(ramp(t, 4, 40));
  return (
    <g>
      <path d="M -130 40 A 130 130 0 0 1 130 40" stroke="#3A5A56" strokeWidth={22} fill="none" />
      <path d="M -130 40 A 130 130 0 0 1 -60 -80" stroke="#7E8CC8" strokeWidth={22} fill="none" />
      <path d="M 60 -80 A 130 130 0 0 1 130 40" stroke="#E0263A" strokeWidth={22} fill="none" />
      <path d="M -60 -80 A 130 130 0 0 1 60 -80" stroke="#3CC27A" strokeWidth={22} fill="none" />
      <circle r={70} fill="#E8F2F1" /><circle r={56} fill="#C9D9D6" />
      <rect x={-6} y={-66} width={12} height={46} rx={6} fill="#2F4F4A" transform={`rotate(${ang})`} />
      {[[120, 90, 1], [170, 50, -1.4]].map(([x, y, sp], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${t * 3 * (sp as number)})`}>
          {Array.from({length: 8}).map((_, k) => <rect key={k} x={-6} y={-30} width={12} height={14} rx={3} fill="#8FA0A8" transform={`rotate(${k * 45})`} />)}
          <circle r={22} fill="#8FA0A8" /><circle r={8} fill="#2F4F4A" />
        </g>
      ))}
      <Spark x={-120} y={-90} s={0.6} c="#FFFFFF" o={0.7} />
    </g>
  );
};
