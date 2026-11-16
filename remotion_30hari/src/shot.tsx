import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {OffsetContext} from './SceneContext';
import {Pointer} from './illustrations/common';
import {rand} from './theme';

/* ---------------- tipe data storyboard ---------------- */
export type Trans = 'cut' | 'whip' | 'blur' | 'light' | 'push';
export type CamKF = [number, number, {x?: number; y?: number; z?: number; r?: number}]; // [mulai, durasi, target]
export type NumKF = Array<[number, number]>; // [frame, nilai] (di-ease antar keyframe)
export type IllItem = {
  c: (t: number, f: number) => React.ReactNode; x: number; y: number; s?: number; i: number; o: number;
  e?: 'pop' | 'slide' | 'fade' | 'rise' | 'none'; back?: boolean; ptr?: boolean; key?: string;
};
export type CharDef = {
  x: NumKF; y?: NumKF; s?: NumKF; pose: Array<[number, PoseName]>; expr: Array<[number, Expression]>;
  look?: Array<[number, {x: number; y: number}]>; talk?: Array<[number, boolean]>; rim?: Array<[number, boolean]>; hide?: NumKF; rot?: NumKF;
};
export type Shot = {
  id: string; from: number; to: number; enter: Trans;
  bg: (f: number) => React.ReactNode; cam: CamKF[]; cam0?: {x: number; y: number; z: number; r?: number};
  char?: CharDef; ills: IllItem[]; dim?: NumKF; shake?: Array<[number, number, number]>; front?: (f: number) => React.ReactNode;
};

const IO = Easing.bezier(0.45, 0, 0.55, 1);
export const kf = (f: number, k: NumKF, def = 0) => {
  if (!k.length) return def;
  if (f <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [f0, v0] = k[i], [f1, v1] = k[i + 1];
    if (f >= f0 && f <= f1) return v0 + (v1 - v0) * IO(Math.min(1, (f - f0) / Math.max(1, f1 - f0)));
  }
  return k[k.length - 1][1];
};
const step = <T,>(f: number, k: Array<[number, T]> | undefined, def: T) => {
  let v = def;
  for (const [fr, val] of k ?? []) if (f >= fr) v = val;
  return v;
};
const easeLook = (f: number, k: Array<[number, {x: number; y: number}]> | undefined) => {
  if (!k || !k.length) return {x: 0, y: 0};
  let prev = k[0][1], cur = k[0][1], at = k[0][0];
  for (const [fr, v] of k) if (f >= fr) { prev = cur; cur = v; at = fr; }
  const tt = IO(Math.min(1, Math.max(0, (f - at) / 7)));
  return {x: prev.x + (cur.x - prev.x) * tt, y: prev.y + (cur.y - prev.y) * tt};
};
export const camAt = (s: Shot, f: number) => {
  let c = {x: 540, y: 960, z: 1, r: 0, ...s.cam0};
  for (const [st, d, to] of s.cam) {
    if (f < st) break;
    const t = IO(Math.min(1, (f - st) / Math.max(12, d)));
    const tgt = {...c, ...to};
    c = {x: c.x + (tgt.x - c.x) * t, y: c.y + (tgt.y - c.y) * t, z: c.z + (tgt.z - c.z) * t, r: c.r + (tgt.r - c.r) * t};
  }
  return c;
};

/* ---------------- ilustrasi: masuk (pop overshoot / slide / rise) & keluar (mengecil + pudar) ---------------- */
const backOut = (v: number) => { const c = 1.7, x = Math.min(1, Math.max(0, v)) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const IllView: React.FC<{it: IllItem; f: number; charHead?: {x: number; y: number}}> = ({it, f, charHead}) => {
  if (f < it.i || f >= it.o + 10) return null;
  const ip = Math.min(1, (f - it.i) / 11), op = Math.min(1, Math.max(0, (f - it.o) / 10));
  const e = it.e ?? 'pop';
  const sc = e === 'pop' ? 0.15 + 0.85 * backOut(ip) : 1;
  const dx = e === 'slide' ? (1 - IO(ip)) * (it.x < 540 ? -420 : 420) : 0;
  const dy = e === 'rise' ? (1 - IO(ip)) * 260 : 0;
  const alpha = (e === 'none' ? 1 : Math.min(1, ip * 1.8)) * (1 - op);
  return (
    <g opacity={alpha}>
      {it.ptr && charHead && <Pointer x1={it.x + (charHead.x > it.x ? 120 : -120) * (it.s ?? 1)} y1={it.y + 40} x2={charHead.x + (charHead.x > it.x ? -60 : 60)} y2={charHead.y + 120} p={ip} />}
      <g transform={`translate(${it.x + dx},${it.y + dy - op * 30}) scale(${(it.s ?? 1) * sc * (1 - op * 0.35)})`}>{it.c(f - it.i, f)}</g>
    </g>
  );
};

/* ---------------- renderer satu shot (frame relatif) ---------------- */
export const ShotView: React.FC<{s: Shot}> = ({s}) => {
  const f = useCurrentFrame();
  const c = camAt(s, f);
  let dx = 0, dy = 0, dr = 0;
  for (const [st, d, amp] of s.shake ?? []) {
    const k = f - st;
    if (k >= 0 && k < d) { const a = amp * (1 - k / d); dx += (rand(f * 1.3) - 0.5) * 2 * a; dy += (rand(f * 2.1 + 3) - 0.5) * 2 * a; dr += (rand(f * 0.7) - 0.5) * a * 0.1; }
  }
  const dim = kf(f, s.dim ?? [], 0);
  const ch = s.char;
  const cx = ch ? kf(f, ch.x, 540) : 540, cy = ch ? kf(f, ch.y ?? [], 1250) : 1250, cs = ch ? kf(f, ch.s ?? [], 1.1) : 1.1;
  const head = {x: cx, y: cy - 524 * cs};
  const tf = `translate(${540 + dx},${960 + dy}) rotate(${c.r + dr}) scale(${c.z}) translate(${-c.x},${-c.y})`;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs><filter id={`dof-${s.id}`}><feGaussianBlur stdDeviation={dim * 5} /></filter></defs>
        <g transform={tf}>
          <g filter={dim > 0.05 ? `url(#dof-${s.id})` : undefined}>
            {s.bg(f)}
            <rect x={-2000} y={-2000} width={5080} height={5920} fill="#05020A" opacity={dim * 0.5} />
          </g>
          {s.ills.filter((i) => i.back).map((it, k) => <IllView key={it.key ?? 'b' + k} it={it} f={f} charHead={head} />)}
          {ch && kf(f, ch.hide ?? [], 0) < 0.99 && (
            <g opacity={1 - kf(f, ch.hide ?? [], 0)} transform={`rotate(${kf(f, ch.rot ?? [], 0)} ${cx} ${cy})`}>
              <Character id={`c-${s.id}`} x={cx} y={cy} scale={cs} pose={ch.pose} expression={ch.expr} lookAt={easeLook(f, ch.look)}
                talking={step(f, ch.talk, false)} rim={step(f, ch.rim, false)} blinkSeed={s.from % 17} />
            </g>
          )}
          {s.ills.filter((i) => !i.back).map((it, k) => <IllView key={it.key ?? 'f' + k} it={it} f={f} charHead={head} />)}
          {s.front?.(f)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- transisi (gaya referensi) ---------------- */
export const TR: Record<Trans, number> = {cut: 0, whip: 9, blur: 12, light: 12, push: 10};
export const TransLayer: React.FC<{enter: Trans; exit?: Trans; len: number; children: React.ReactNode}> = ({enter, exit, len, children}) => {
  const f = useCurrentFrame();
  let tx = 0, sc = 1, op = 1, blur = 0, flash = 0, bright = 1;
  const ti = TR[enter];
  if (ti && f < ti) {
    const e = IO(f / ti);
    if (enter === 'whip') { tx = (1 - e) * 1080; blur = (1 - e) * 26; }
    if (enter === 'blur') { op = e; blur = (1 - e) * 22; }
    if (enter === 'light') { flash = 1 - e; }
    if (enter === 'push') { sc = 0.82 + 0.18 * e; op = e; }
  }
  const to = exit ? TR[exit] : 0;
  if (to && f >= len - to) {
    const x = IO((f - (len - to)) / to);
    if (exit === 'whip') { tx = -x * 1080; blur = x * 26; }
    if (exit === 'blur') { blur = x * 22; }
    if (exit === 'light') { bright = 1 + x * 1.5; flash = x * 0.9; }
    if (exit === 'push') { sc = 1 + x * 0.9; op = 1 - x; }
  }
  return (
    <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${sc})`, opacity: op, filter: `${blur > 0.4 ? `blur(${blur}px)` : ''} ${bright > 1 ? `brightness(${bright})` : ''}`.trim() || undefined}}>
      {children}
      {flash > 0 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #FFFBEA 0%, #FFE6A8 55%, #FFC870 100%)', opacity: flash}} />}
    </AbsoluteFill>
  );
};

export const ShotSeq: React.FC<{s: Shot; next?: Shot}> = ({s, next}) => (
  <OffsetContext.Provider value={s.from}>
    <TransLayer enter={s.enter} exit={next?.enter} len={s.to - s.from + (next ? TR[next.enter] : 0)}>
      <ShotView s={s} />
    </TransLayer>
  </OffsetContext.Provider>
);
