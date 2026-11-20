// SHOT 4: FASE 2 — kantor/ruang kerja teal-abu kusam + aksen oranye/merah "api" (beat 22-31).
import React from 'react';
import {Office, DeskFire} from '../components/Places';
import {LitCharacter, Reflect, Halo} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as B from '../illustrations/part2';
import {AngerSteam, DashPointer} from '../illustrations/shared';
import {Appear, be, bf, camKeys, ease, ramp, shake} from '../kit';
import {clamp} from '../theme';
import {ShotDef} from './types';

const FL = 1250, MX = 400, DESK_Y = 1080, IX = 790, IY = 760;
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));
const ORG = '#FF9A4A';

// meja depan (tajam, di depan karakter) + berkas
const FrontDesk: React.FC<{op: number}> = ({op}) => (
  <g opacity={op}>
    <rect x={180} y={DESK_Y} width={720} height={26} rx={8} fill="#7A644E" />
    <rect x={200} y={DESK_Y + 26} width={680} height={FL - DESK_Y - 16} fill="#5A4836" />
    {[0, 1].map((k) => <g key={k}><rect x={240 + k * 330} y={DESK_Y + 50} width={270} height={64} rx={6} fill="#6A5642" /><rect x={350 + k * 330} y={DESK_Y + 76} width={50} height={10} rx={5} fill="#3A2E24" /></g>)}
    {[0, 1, 2, 3].map((k) => <rect key={k} x={220 + (k % 2) * 6} y={DESK_Y - 16 - k * 16} width={150} height={16} fill={['#E8E0CC', '#D9CFB6', '#EFE8D6'][k % 3]} />)}
    <rect x={800} y={DESK_Y - 54} width={44} height={54} rx={8} fill="#B8C6C8" />
  </g>
);

export const shotF2: ShotDef = {
  id: 'f2', from: bf(22), to: bf(32), enter: 'whip', trLen: 10, floorY: FL,
  cam: (f) => {
    const c = camKeys(f, [
      [bf(22), 540, 860, 1.0], [be(22), 540, 860, 1.02],
      [bf(23, 14), 600, 860, 1.1], [be(23), 600, 860, 1.12],    // push ke otak
      [bf(24, 10), 600, 860, 1.12], [be(24), 610, 860, 1.14],   // push-in panel kendali
      [bf(25, 4), 640, 880, 1.15], [be(25), 640, 880, 1.15],    // zoom cepat ke rem
      [bf(26, 6), 560, 860, 1.08], [be(26), 600, 860, 1.08],    // pan
      [bf(27, 8), 480, 860, 1.12], [be(27), 480, 860, 1.12],    // tilt ke korek
      [bf(28, 6), 620, 860, 1.0], [be(28), 620, 860, 1.0],      // atasan masuk frame
      [bf(29, 8), 560, 880, 1.1], [be(29), 560, 880, 1.12],     // push ke dadu
      [bf(30, 6), 560, 860, 1.06], [be(30), 600, 860, 1.06],    // pan
      [bf(31, 4), 480, 880, 1.15], [be(31), 540, 860, 1.0],     // pull-out: santai, meja terbakar
    ]);
    const [dx, dy] = shake(f, bf(28, 16), 14, 18);
    const [ex, ey] = shake(f, bf(25, 14), 10, 10);
    return {x: c.x + dx + ex, y: c.y + dy + ey, s: c.s};
  },
  bg: (f) => <Office desk={f > bf(31)} />,
  bgBlur: () => 2.5,
  dim: () => 0.36,
  fg: (f) => {
    return (
      <g>
        <Spotlight x={580} y={820} rx={560} ry={740} dark={0.55} />
        {/* beat 22-30: berdiri di balik meja kerja */}
        <g opacity={seg(f, bf(22), bf(31, 4))}>
          <Reflect floor={FL} op={0.1}>
            <g transform={`translate(${f > bf(28, 14) && f < bf(28, 30) ? Math.sin(f * 3) * 3 : 0},0)`}>
              <LitCharacter id="f2m" x={MX} y={FL} scale={1.1} haloColor={ORG}
                pose={[[-100, 'standing_relaxed'], [bf(24), 'thinking'], [bf(25), 'standing_relaxed'], [bf(26), 'slouch'], [bf(27), 'nervous_stand'],
                  [bf(28, 14), 'slamming_desk'], [bf(29), 'rolling_dice'], [bf(30), 'shrug']]}
                expression={[[-100, 'worried'], [bf(24), 'thinking'], [bf(25), 'shocked'], [bf(26), 'lethargic'], [bf(27), 'irritated'], [bf(28, 10), 'angry'],
                  [bf(29), 'smirk'], [bf(30), 'confused']]} />
            </g>
          </Reflect>
          <FrontDesk op={1} />
        </g>
        {/* beat 31: santai pakai kacamata hitam, di belakangnya meja/berkas terbakar */}
        <g opacity={seg(f, bf(31, 4), be(31) + 20)}>
          <rect x={300} y={1100} width={240} height={150} rx={26} fill="#3A4448" />
          <Reflect floor={FL} op={0.1}><LitCharacter id="f2s" x={420} y={FL} scale={1.05} pose="sunglasses_relax" expression="smirk_denial" haloColor={ORG} /></Reflect>
          <Appear f={f} a={bf(31, 20)} kind="glow"><Halo x={520} y={860} rx={340} color="#FF6A2B" op={0.35} /></Appear>
        </g>
        {/* ilustrasi per kata kunci */}
        <Appear f={f} a={bf(23, 4)} b={be(23)} x={IX} y={IY} s={0.5}><B.TermiteBrain eat={ease(f, bf(23, 12), be(23) - 6)} t={f} /></Appear>
        <Appear f={f} a={bf(23, 10)} b={be(23)} kind="glow"><DashPointer x1={IX - 140} y1={IY} x2={MX + 40} y2={FL - 620} p={ramp(f, bf(23, 10), bf(23, 20))} /></Appear>
        <Appear f={f} a={bf(24, 4)} b={be(24)} x={IX} y={IY} s={0.5}><B.Cockpit off={ease(f, bf(24, 14), be(24) - 8)} /></Appear>
        <Appear f={f} a={bf(25, 2)} b={be(25)} x={IX} y={IY + 40} s={0.75}><B.BrakePedal snap={ease(f, bf(25, 12), bf(25, 20))} /></Appear>
        <Appear f={f} a={bf(26, 2)} b={be(26)} x={IX} y={IY} s={0.5}><B.WillRope p={ease(f, bf(26, 4), be(26) - 2)} /></Appear>
        <Appear f={f} a={bf(27, 2)} b={be(27)} x={MX + 20} y={FL - 760} s={0.9} kind="glow"><B.MatchFuse burn={ease(f, bf(27, 6), be(27))} t={f} /></Appear>
        <Appear f={f} a={bf(28, 2)} b={be(28)} x={900} y={FL} kind="rise"><B.BossSilhouette point={ease(f, bf(28, 4), bf(28, 14))} /></Appear>
        <Appear f={f} a={bf(28, 16)} b={be(28)} kind="glow"><AngerSteam x={MX} y={FL - 740} t={f} s={1.0} color="#D8DCE0" /></Appear>
        <Appear f={f} a={bf(29, 2)} b={be(29)} x={MX + 60} y={DESK_Y - 30} s={0.75}><B.DiceOnFiles roll={ease(f, bf(29, 6), be(29) - 6)} t={f} /></Appear>
        <Appear f={f} a={bf(30, 2)} b={be(30)} x={IX} y={IY - 40} s={0.55}><B.CompassSpin t={f} /></Appear>
        <Appear f={f} a={bf(30, 6)} b={be(30)} x={IX} y={IY + 170} s={0.8}><B.ForkRoad /></Appear>
        <Appear f={f} a={bf(31, 20)} kind="glow"><DeskFire x={480} y={970} s={0.9} /></Appear>
      </g>
    );
  },
};
