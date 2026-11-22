// SHOT 4: EFEK 2 — kepala penuh hayalan. Jalan kota / trotoar + halte bus sore menjelang malam, tone ungu-magenta.
// Pelecehan WAJIB simbolik: perempuan (sopan) menjauh & memeluk tas, garis batas merah, rambu peringatan. Tanpa kontak/pendekatan fisik.
import React from 'react';
import {STAND_Y} from '../components/Places';
import {CityStreet} from '../components/Places2';
import {LitCharacter, Reflect} from '../components/Lit';
import {Silhouette} from '../components/Silhouette';
import {Spotlight} from '../components/Spot';
import * as C from '../illustrations/part3';
import * as U from '../illustrations/u25';
import {Appear, be, bf, camKeys, ease, kp, ramp} from '../kit';
import {clamp} from '../theme';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const FL = STAND_Y;
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));
const HALO = '#FF8FC0';
setKeyPos({28: [640, 470], 31: [700, 420], 35: [540, 420], 39: [600, 420], 41: [540, 420]});

export const shotE2: ShotDef = {
  id: 'e2', from: bf(27), to: bf(42), enter: 'whip', trLen: 10, floorY: FL,
  cam: (f) => camKeys(f, [
    [bf(27), 440, 860, 1.0], [be(27), 520, 860, 1.0],
    [bf(28, 6), 540, 800, 1.06], [be(28), 540, 790, 1.08],     // tilt naik ke awan
    [bf(29, 8), 640, 860, 1.04], [be(29), 660, 860, 1.04],     // pan ke halte
    [bf(30, 6), 600, 820, 1.12], [be(30), 600, 820, 1.14],     // push ke bubble
    [bf(31, 2), 620, 840, 1.2], [be(31), 620, 840, 1.2],       // punch-in
    [bf(32, 6), 540, 860, 1.0], [be(34), 540, 860, 1.04],      // ilustrasi full
    [bf(35, 6), 540, 840, 1.02], [be(36), 540, 840, 1.06],
    [bf(37, 6), 440, 860, 1.1], [be(37), 440, 860, 1.1],
    [bf(38, 6), 420, 880, 1.0], [be(38), 600, 880, 1.0],       // tracking
    [bf(39, 6), 600, 860, 1.06], [be(39), 600, 860, 1.0],      // pull-out pelan
    [bf(40, 6), 560, 840, 1.06], [be(41), 560, 840, 1.1],      // push ke jurnal
  ]),
  bg: (f) => <CityStreet dusk={kp(f, [[bf(27), 0.25], [be(41), 0.85]])} carX={kp(f, [[bf(27), -420], [bf(27, 40), 1200], [bf(29), -420], [bf(29, 36), 1200]])} />,
  bgBlur: (f) => 2.2 + 3 * ease(f, bf(37, 4), bf(37, 14)) * (1 - ease(f, be(37) - 8, be(37))),
  dim: (f) => 0.24 + 0.2 * ease(f, bf(32), bf(32, 8)) * (1 - ease(f, bf(37), bf(37, 8))),
  fg: (f) => {
    const fullIll = seg(f, bf(32), bf(37));     // beat 32-36: ilustrasi full, karakter disembunyikan
    const manX = kp(f, [[bf(27), 120], [bf(27, 30), 360], [bf(38), 360], [be(38), 640], [bf(39), 380]]);
    return (
      <g>
        <Spotlight x={560} y={820} rx={560} ry={760} dark={0.45} />
        {/* perempuan di halte (pakaian sopan) */}
        <g opacity={seg(f, bf(29), bf(32)) + seg(f, bf(39), be(39) + 10)}>
          <Silhouette x={kp(f, [[bf(29), 880], [bf(39), 880], [bf(39, 30), 960]])} y={FL - 40} scale={0.82} type="woman_hijab"
            pose={f > bf(39) ? 'hug_bag' : 'stand'} rim="#FFC870" seed={4} />
        </g>
        {/* karakter utama */}
        <Reflect floor={FL} op={0.12}>
          <g opacity={1 - fullIll}>
            <LitCharacter id="e2m" x={f >= bf(29) && f < bf(32) ? 560 : manX} y={f >= bf(29) && f < bf(32) ? FL - 40 : FL} scale={1.1} haloColor={HALO}
              pose={[[-100, 'walking_street'], [bf(27, 30), 'standing_relaxed'], [bf(29), 'sitting_bus_stop'], [bf(31), 'scratching_head'], [bf(32), 'standing_relaxed'],
                [bf(36), 'thinking'], [bf(37), 'standing_relaxed'], [bf(38), 'being_dragged'], [bf(39), 'looking_down']]}
              expression={[[-100, 'neutral'], [bf(28), 'daydreaming'], [bf(29), 'daydreaming'], [bf(30), 'ashamed'], [bf(31), 'lost'], [bf(36), 'thinking'], [bf(37), 'dazed'],
                [bf(38), 'dazed'], [bf(39), 'ashamed']]} />
          </g>
        </Reflect>
        {/* bangku halte di depan (saat duduk) */}
        <g opacity={seg(f, bf(29), bf(32))}><rect x={420} y={FL - 150} width={300} height={22} rx={6} fill="#5A4A6E" /></g>
        {/* ===== ilustrasi ===== */}
        <Appear f={f} a={bf(28, 2)} b={be(28)} x={640} y={470} s={0.95}><U.PinkCloud t={f} /></Appear>
        <Appear f={f} a={bf(30, 2)} b={be(30)} x={620} y={520} s={0.95}><U.PinkCloud t={f} sensor badge /></Appear>
        <Appear f={f} a={bf(31, 0)} b={be(31)} x={760} y={600} s={0.85}><U.BigQuestion p={ramp(f, bf(31), bf(31, 8))} t={f} /></Appear>
        <Appear f={f} a={bf(32, 2)} b={be(32)} x={540} y={820} s={1.15}><U.MidbrainLift buff={ease(f, bf(32, 10), be(32))} t={f} /></Appear>
        <Appear f={f} a={bf(33, 2)} b={be(33)} x={540} y={820} s={1.15}><U.CaveScene t={f} /></Appear>
        <Appear f={f} a={bf(34, 2)} b={be(34)} x={540} y={800} s={1.15}><U.FoodNest /></Appear>
        <Appear f={f} a={bf(35, 2)} b={be(35)} x={540} y={820} s={1.05}><U.Seesaw tilt={ease(f, bf(35, 20), bf(35, 60))} t={f} /></Appear>
        <Appear f={f} a={bf(36, 2)} b={be(36)} x={640} y={700} s={0.85}><U.PfcBrake t={f} /></Appear>
        {/* beat 37: kaca berembun di depan wajah (pandangan kabur) — koordinat layar diatur di overlay */}
        {/* beat 38: arus merah menyeret */}
        <g opacity={seg(f, bf(38), bf(39, 4))} transform={`translate(540,${FL - 40})`}><U.RedCurrent t={f} /></g>
        {/* beat 39: garis batas merah + rambu peringatan di antara mereka */}
        <Appear f={f} a={bf(39, 6)} b={be(39)} x={680} y={FL + 6} kind="rise"><U.BoundarySign p={ease(f, bf(39, 8), bf(39, 40))} t={f} /></Appear>
        <Appear f={f} a={bf(40, 2)} b={be(40)} x={640} y={720} s={1.05}><U.SignToDoc k={ease(f, bf(40, 10), bf(40, 34))} /></Appear>
        <Appear f={f} a={bf(41, 2)} b={be(41)} x={560} y={870} s={0.95} kind="glow"><C.JournalGlow on={ease(f, bf(41, 2), bf(41, 16))} mag={ease(f, bf(41, 16), be(41))} title="PLOS ONE" year="2014" /></Appear>
      </g>
    );
  },
  overlay: (f) => <U.FoggyGlass fog={ease(f, bf(37, 4), bf(37, 20)) * (1 - ease(f, be(37) - 8, be(37)))} t={f} />,
};
