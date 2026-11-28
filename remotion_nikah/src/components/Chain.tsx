import React from 'react';

// Rantai logam (elemen pendukung: abu-abu, kilau tipis). Mata rantai bergantian: cincin (tampak depan) & batang (tampak samping).
const METAL = '#8C93A2';
const METAL_D = '#4A505C';
const SHINE = '#E4E8EF';

export const Link: React.FC<{x: number; y: number; ang: number; side: boolean; s?: number; tint?: string}> = ({x, y, ang, side, s = 1, tint}) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`}>
    {side ? (
      <>
        <rect x={-13} y={-3.5} width={26} height={7} rx={3.5} fill={METAL_D} />
        <rect x={-11} y={-2.2} width={20} height={2} rx={1} fill={SHINE} opacity={0.7} />
      </>
    ) : (
      <>
        <ellipse rx={13} ry={8.5} fill="none" stroke={METAL_D} strokeWidth={6.5} />
        <ellipse rx={13} ry={8.5} fill="none" stroke={tint ?? METAL} strokeWidth={4} />
        <path d="M -9 -6 Q 0 -10 9 -6" stroke={SHINE} strokeWidth={1.8} fill="none" opacity={0.85} />
      </>
    )}
  </g>
);

// rantai dari titik a ke b dengan lendutan (sag), mata rantai mengikuti kurva
export const ChainLine: React.FC<{x1: number; y1: number; x2: number; y2: number; sag?: number; s?: number; from?: number; to?: number; tint?: string}> = ({
  x1, y1, x2, y2, sag = 40, s = 1, from = 0, to = 1, tint,
}) => {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag;
  const at = (u: number) => ({
    x: (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2,
    y: (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2,
  });
  const len = Math.hypot(x2 - x1, y2 - y1) + Math.abs(sag) * 0.6;
  const n = Math.max(2, Math.round(len / (20 * s)));
  const out: React.ReactNode[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    if (u < from || u > to) continue;
    const p = at(u), q = at(Math.min(1, u + 0.01)), r = at(Math.max(0, u - 0.01));
    const ang = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI;
    out.push(<Link key={i} x={p.x} y={p.y} ang={ang} side={i % 2 === 1} s={s} tint={tint} />);
  }
  return <g>{out}</g>;
};

// lilitan rantai melingkari badan (koordinat torso Character: pelvis = 0, atas = -torsoH)
export const ChainBand: React.FC<{torsoH: number; n: number; t: number}> = ({torsoH, n, t}) => {
  const rows = [0.8, 0.52, 0.24];
  return (
    <g>
      {rows.map((r, i) => {
        if (n <= i) return null;
        const y0 = -torsoH * r;
        const strain = Math.sin(t * 22 + i * 2) * 1.2;
        const links: React.ReactNode[] = [];
        for (let k = 0; k <= 11; k++) {
          const u = k / 11;
          const x = -108 + u * 216;
          const y = y0 + 9 * (1 - (2 * u - 1) ** 2) + strain;
          const ang = Math.atan(-36 * (2 * u - 1) / 216) * 57.3 * 0.9;
          links.push(<Link key={k} x={x} y={y} ang={ang} side={k % 2 === 1} s={1.05} />);
        }
        return <g key={i}>{links}</g>;
      })}
    </g>
  );
};
