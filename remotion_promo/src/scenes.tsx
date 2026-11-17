// Scene per beat (storyboard). Frame absolut (30 fps). Semua konten scene ada di dalam kamera + pantulan lantai.
import React from 'react';
import {FLOOR, P, clamp, lerp} from './theme';
import {handWorld} from './components/Character';
import {LitCharacter, Reflect, Rise, Halo} from './components/Lit';
import {ChainLine} from './components/Chain';
import * as I from './illustrations';
import {ramp, smooth} from './illustrations';

const eio = (f: number, a: number, b: number) => smooth(ramp(f, a, b));
export type SceneProps = {f: number};

// kamera: titik (cx,cy) tetap di layar saat zoom s, lalu geser pan (px,py)
const Cam: React.FC<{cx: number; cy: number; s: number; px?: number; py?: number; children: React.ReactNode}> = ({cx, cy, s, px = 0, py = 0, children}) => (
  <g transform={`translate(${cx - px},${cy - py}) scale(${s}) translate(${-cx},${-cy})`}>{children}</g>
);

// lantai lokal scene (ikut kamera): permukaan gelap + garis horizon tipis
const Floor: React.FC<{warm: number}> = ({warm}) => (
  <g>
    <rect x={-2000} y={FLOOR} width={5000} height={2000} fill={warm > 0.5 ? P.brownFloor : P.navyFloor} opacity={0.55} />
    <rect x={-2000} y={FLOOR - 1} width={5000} height={2} fill="#FFFFFF" opacity={0.05} />
  </g>
);

/* ---------- BEAT 1: rantai putus satu-satu (0–43) ---------- */
const BREAKS = [10, 19, 28]; // lilitan bawah, tengah, atas
export const Scene1: React.FC<SceneProps> = ({f}) => {
  const cx = 470, s = 1.05;
  const n = 3 - BREAKS.filter((b) => f >= b).length;
  const rows = [0.24, 0.52, 0.8];
  const glow = eio(f, 0, 16);
  return (
    <Cam cx={540} cy={1000} s={lerp(1, 1.05, eio(f, 0, 60))}>
      <Floor warm={0} />
      <Reflect>
        <g transform={`translate(830,${FLOOR})`}><I.AddictPhone glow={(0.6 - 0.4 * eio(f, 32, 44)) * (0.3 + 0.7 * glow)} s={0.9} /></g>
        {f < BREAKS[2] && <ChainLine x1={cx + 100} y1={FLOOR - 300} x2={830 - 40} y2={FLOOR - 120} sag={70} />}
        <g opacity={glow}>
          <LitCharacter id="s1" x={cx} y={FLOOR} scale={s} expression="determined" blinkSeed={3} chains={n}
            pose={[[-100, 'struggling_chains'], [BREAKS[2] + 2, 'breaking_free']]} halo={glow} />
        </g>
        {BREAKS.map((b, i) => {
          const y = FLOOR - (220 + 178 * rows[i]) * s;
          return (
            <g key={i}>
              <I.FallingChain t={f} t0={b} x={cx - 80} y={y} floorY={FLOOR} len={100} ang={10} dir={-1} />
              <I.FallingChain t={f} t0={b + 1} x={cx + 80} y={y} floorY={FLOOR} len={90} ang={-15} />
            </g>
          );
        })}
        {f >= BREAKS[2] && <I.FallingChain t={f} t0={BREAKS[2]} x={720} y={FLOOR - 160} floorY={FLOOR} len={130} ang={40} />}
      </Reflect>
      {BREAKS.map((b, i) => <I.SnapFlash key={i} t={f} t0={b} x={cx + (i % 2 ? -60 : 70)} y={FLOOR - (220 + 178 * rows[i]) * s} />)}
      {f > BREAKS[2] && <Rise x={cx} y={FLOOR - 400} w={260} h={300} n={8} seed={5} op={eio(f, 34, 44)} />}
    </Cam>
  );
};

/* ---------- BEAT 2: otak retak + plester → pulih (43–117) ---------- */
export const Scene2: React.FC<SceneProps> = ({f}) => (
  <Cam cx={540} cy={820} s={lerp(1, 1.07, eio(f, 43, 120))}>
    <Floor warm={1} />
    <Reflect op={0.14}>
      <g transform={`translate(540,${790 + Math.sin(f * 0.07) * 6})`}>
        <I.BrainHeal t={f} s={1.15} crack={1} peel={eio(f, 58, 80)} heal={eio(f, 74, 108)} lit={lerp(0.55, 1, eio(f, 70, 105))} />
      </g>
    </Reflect>
  </Cam>
);

/* ---------- BEAT 3: metode ilmiah — lab menyala satu-satu (117–148) ---------- */
export const Scene3: React.FC<SceneProps> = ({f}) => {
  const tableY = 1010;
  return (
    <Cam cx={540} cy={900} s={1} px={lerp(-20, 30, eio(f, 105, 160))}>
      <Floor warm={1} />
      <Reflect>
        <LitCharacter id="s3" x={290} y={FLOOR} scale={0.95} pose="thinking" expression="thinking" blinkSeed={7} lookAt={{x: 0.5, y: -0.2}} />
        {/* meja (pendukung, abu-abu) */}
        <rect x={470} y={tableY} width={530} height={18} rx={6} fill={P.grayDark} />
        <rect x={500} y={tableY + 18} width={14} height={FLOOR - tableY - 18} fill="#2E333D" />
        <rect x={956} y={tableY + 18} width={14} height={FLOOR - tableY - 18} fill="#2E333D" />
        <g transform={`translate(545,${tableY}) scale(0.7)`}><I.Clipboard on={eio(f, 118, 126)} t={f - 118} /></g>
        <g transform={`translate(705,${tableY}) scale(0.7)`}><I.Microscope on={eio(f, 126, 134)} t={f} /></g>
        <g transform={`translate(885,${tableY}) scale(0.7)`}><I.TestTubes on={eio(f, 134, 142)} t={f} /></g>
      </Reflect>
    </Cam>
  );
};

/* ---------- BEAT 4: neuroplasticity — jaringan neuron menyala (148–202) ---------- */
export const Scene4: React.FC<SceneProps> = ({f}) => (
  <Cam cx={540} cy={1000} s={lerp(1.1, 1, eio(f, 140, 205))}>
    <Floor warm={1} />
    <Reflect>
      <g transform="translate(600,800)"><I.NeuronNet t={f} grow={eio(f, 150, 198)} s={0.85} /></g>
      <LitCharacter id="s4" x={190} y={FLOOR} scale={0.75} pose="standing_relaxed" expression="curious" blinkSeed={11} lookAt={{x: 0.5, y: -1}} />
    </Reflect>
  </Cam>
);

/* ---------- BEAT 5: rahasia dibongkar — peti terbuka (202–264) ---------- */
export const Scene5: React.FC<SceneProps> = ({f}) => {
  const unlock = eio(f, 232, 240), lockFall = clamp((f - 238) / 16), open = eio(f, 244, 262);
  const chest = {t: f, unlock, open, lockFall};
  return (
    <Cam cx={600} cy={1110} s={lerp(1, 1.14, eio(f, 228, 270))}>
      <Floor warm={1} />
      <Reflect>
        <g transform={`translate(600,${FLOOR}) scale(0.89)`}><I.TreasureChest {...chest} part="back" /></g>
        <LitCharacter id="s5" x={600} y={FLOOR} scale={1} expression={[[-100, 'curious'], [214, 'smirk']]} blinkSeed={13}
          pose={[[-100, 'standing_relaxed'], [212, 'opening_chest'], [246, 'lifting_lid']]} />
        <g transform={`translate(600,${FLOOR}) scale(0.89)`}><I.TreasureChest {...chest} part="front" /></g>
      </Reflect>
    </Cam>
  );
};

/* ---------- BEAT 6: tanpa basa-basi — pita kusut digunting (264–292) ---------- */
export const Scene6: React.FC<SceneProps> = ({f}) => {
  const hx = 360, sc = 1;
  const h = handWorld('holding_scissors', 1, hx, FLOOR, sc);
  const ry = h.y - 95, cutX = h.x + 60;
  return (
    <Cam cx={540} cy={900} s={lerp(1.05, 1, eio(f, 264, 292))}>
      <Floor warm={1} />
      <Reflect>
        <g transform={`translate(${cutX + 210},${ry})`}><I.TangledRibbon t={f} cut={eio(f, 274, 288)} len={420} /></g>
        <LitCharacter id="s6" x={hx} y={FLOOR} scale={sc} pose="holding_scissors" expression="confident" blinkSeed={17} />
        <I.SnippedKnot t={f} t0={274} x={cutX + 30} y={ry} floorY={FLOOR} />
      </Reflect>
      <I.SnapFlash t={f} t0={273} x={cutX} y={ry} />
    </Cam>
  );
};

/* ---------- BEAT 7: e-book + video Stop PMO (292–351), pan kiri → kanan ---------- */
export const Scene7: React.FC<SceneProps> = ({f}) => (
  <Cam cx={540} cy={900} s={1} px={lerp(-70, 70, eio(f, 285, 355))}>
    <Floor warm={1} />
    <Reflect op={0.15}>
      <LitCharacter id="s7" x={250} y={FLOOR} scale={0.95} pose={[[-100, 'standing_relaxed'], [300, 'pointing_side']]}
        expression={[[-100, 'smirk'], [304, 'happy']]} blinkSeed={19} />
      <g transform={`translate(565,${800 + Math.sin(f * 0.08) * 8}) rotate(${-3 + Math.sin(f * 0.05) * 1.5})`}>
        <g opacity={eio(f, 296, 306)}><I.EbookTablet t={f} on={eio(f, 304, 316)} s={0.82} /></g>
      </g>
      <g transform={`translate(880,${770 + Math.sin(f * 0.07 + 1) * 8}) rotate(${4 + Math.sin(f * 0.06) * 1.5})`}>
        <g opacity={eio(f, 312, 320)}><I.VideoCard t={f} on={eio(f, 318, 330)} press={clamp((f - 330) / 14)} s={0.6} /></g>
      </g>
    </Reflect>
  </Cam>
);

/* ---------- BEAT 8 + 9 + END: toko PMO SAVIOR (351–501), satu shot ---------- */
export const Scene89: React.FC<SceneProps> = ({f}) => {
  const walkEnd = 384;
  const charX = lerp(200, 470, clamp((f - 344) / (walkEnd - 344)));
  const neon = I.neonFlicker(f, 362);
  const linkOn = eio(f, 390, 400) * (1 - eio(f, 440, 452));
  // tracking ikut karakter → lalu tilt naik sedikit (beat 9) → push-in pelan (end card)
  const px = lerp(-90, 20, eio(f, 344, 392));
  const py = -40 * eio(f, 380, 410) + 40 * eio(f, 440, 470);
  const s = lerp(1, 1.06, eio(f, 440, 501));
  const pose: Array<[number, 'walking' | 'pointing_up' | 'arms_crossed']> = [[-100, 'walking'], [walkEnd, 'pointing_up'], [444, 'arms_crossed']];
  return (
    <Cam cx={600} cy={950} s={s} px={px} py={py}>
      <Floor warm={0} />
      <Reflect>
        <g transform={`translate(730,${FLOOR}) scale(1.05)`}><I.Storefront t={f} neon={neon} lights={eio(f, 345, 360)} /></g>
        <g transform={`translate(${lerp(215, 225, eio(f, 440, 470))},${900 + Math.sin(f * 0.08) * 8}) rotate(-4)`}>
          <g opacity={eio(f, 382, 396)}><I.EbookTablet t={f} on={1} s={lerp(0.45, 0.55, eio(f, 440, 470))} /></g>
        </g>
        <LitCharacter id="s8" x={charX} y={FLOOR} scale={0.78} pose={pose} walkSpeed={1.2}
          expression={[[-100, 'happy'], [384, 'confident']]} blinkSeed={23} haloColor={P.amber} />
      </Reflect>
      <g transform={`translate(215,640)`}>
        <I.LinkIcon t={f} on={linkOn} s={0.62} />
        <g transform="translate(0,-110)"><I.ArrowUp t={f} on={linkOn} h={190} /></g>
      </g>
      <Rise x={760} y={FLOOR - 300} w={600} h={600} n={16} seed={91} op={eio(f, 440, 460)} />
      <Halo x={760} y={FLOOR} rx={500} ry={50} color={P.warm} op={0.12 * eio(f, 345, 360)} />
    </Cam>
  );
};
