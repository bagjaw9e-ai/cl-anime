// SHOT 2: EFEK 1 — gampang marah / abusive. Rumah keluarga, ruang makan malam; tone oranye hangat -> makin panas kemerahan.
// Kekerasan WAJIB simbolik: bayangan, benda pecah, siluet keluarga menjauh. Tanpa adegan memukul/menyentuh.
import React from 'react';
import {STAND_Y} from '../components/Places';
import {FamilyDining} from '../components/Places2';
import {LitCharacter, Reflect, Halo} from '../components/Lit';
import {Silhouette} from '../components/Silhouette';
import {Spotlight} from '../components/Spot';
import * as A from '../illustrations/part1';
import * as B from '../illustrations/part2';
import * as C from '../illustrations/part3';
import * as U from '../illustrations/u25';
import {JaggedBubble, Phone18} from '../illustrations/shared';
import {Appear, be, bf, camKeys, ease, kp, ramp, shake} from '../kit';
import {clamp, mix} from '../theme';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const FL = STAND_Y, MX = 360, TABLE_Y = 1090, IX = 750, IY = 720;
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));
const heatAt = (f: number) => kp(f, [[bf(6), 0], [bf(9), 0.3], [bf(16), 0.55], [bf(20), 0.8], [be(22), 1]]);

// posisi subtitle poin penting (layar) — di atas ilustrasinya
setKeyPos({7: [540, 420], 8: [620, 420], 16: [430, 420], 17: [620, 420], 22: [540, 420]});

const FrontTable: React.FC<{op: number; heat: number}> = ({op, heat}) => (
  <g opacity={op}>
    <rect x={120} y={TABLE_Y} width={840} height={24} rx={8} fill={mix('#8A5A3C', '#6A2A1A', heat)} />
    <rect x={140} y={TABLE_Y + 24} width={800} height={FL - TABLE_Y - 14} fill={mix('#5A3A28', '#3A1810', heat)} />
    <ellipse cx={540} cy={TABLE_Y - 4} rx={90} ry={14} fill="#F2F4F8" opacity={0.85} />
  </g>
);

export const shotE1: ShotDef = {
  id: 'e1', from: bf(6), to: bf(23), enter: 'light', trLen: 12, trColor: '#FF6A4A', floorY: FL,
  cam: (f) => {
    const c = camKeys(f, [
      [bf(6), 420, 820, 1.6], [bf(6, 20), 540, 860, 1.0],      // keluar dari retakan -> reveal ruang makan
      [bf(7, 12), 480, 840, 1.12], [be(7), 480, 840, 1.14],     // push-in ke sumbu
      [bf(8, 10), 600, 800, 1.06], [be(8), 600, 790, 1.08],     // tilt naik ke bayangan
      [bf(9, 6), 560, 860, 1.0], [be(9), 560, 860, 1.0],
      [bf(10, 10), 620, 840, 1.15], [be(10), 620, 840, 1.18],   // push ke layar
      [bf(11, 8), 620, 800, 1.12], [be(11), 620, 790, 1.12],    // tilt naik
      [bf(12, 6), 640, 840, 1.18], [be(12), 640, 840, 1.2],     // zoom ke HP
      [bf(13, 4), 600, 880, 1.1], [be(13), 600, 900, 1.08],     // tilt turun cepat
      [bf(14, 8), 640, 840, 1.15], [be(15), 640, 840, 1.16],    // push ke otak
      [bf(16, 4), 560, 860, 1.0], [be(16), 560, 860, 1.02],
      [bf(17, 6), 560, 900, 1.0], [be(17), 600, 780, 1.06],     // tilt naik ngikutin tangga
      [bf(18, 8), 600, 840, 1.1], [be(18), 600, 840, 1.12],
      [bf(19, 8), 620, 840, 1.16], [be(19), 620, 840, 1.2],     // push-in
      [bf(20, 6), 500, 860, 1.04], [be(20), 620, 860, 1.04],    // pan
      [bf(21, 6), 600, 860, 1.06], [be(21), 560, 860, 1.0],     // pull-out
      [bf(22, 4), 540, 860, 1.04], [be(22), 540, 860, 1.0],     // pull-out lebar
    ]);
    const [dx, dy] = shake(f, bf(9, 8), 12, 10);
    const [ex, ey] = shake(f, bf(16, 40), 18, 20);
    return {x: c.x + dx + ex, y: c.y + dy + ey, s: c.s};
  },
  bg: (f) => <FamilyDining heat={heatAt(f)} photoTilt={-10 * ease(f, bf(21, 10), bf(21, 30))} chairTip={ease(f, bf(20, 10), bf(20, 18))} lampOn={1 - 0.3 * heatAt(f)} />,
  bgBlur: () => 2.4,
  dim: (f) => 0.22 + 0.12 * heatAt(f),
  fg: (f) => {
    const heat = heatAt(f);
    const halo = mix('#FFC870', '#FF5A3A', heat);
    const tableOp = 1 - ease(f, bf(17), bf(17, 8)) + ease(f, bf(19), bf(19, 8)) - ease(f, bf(21), bf(21, 8));
    const shadowGrow = ease(f, bf(8, 6), be(8)) * (1 - ease(f, bf(9, 20), bf(9, 40)));
    return (
      <g>
        <Spotlight x={560} y={820} rx={560} ry={760} dark={0.45 + 0.15 * heat} />
        {/* beat 8: bayangan pria membesar di dinding */}
        <g opacity={shadowGrow * 0.85} transform={`translate(560,1110) scale(${1.6 + shadowGrow * 0.8},${1.8 + shadowGrow * 0.9})`}>
          <path d="M -40 0 L -46 -110 Q -50 -170 0 -176 Q 50 -170 46 -110 L 40 0 Z" fill="#1A0604" /><circle cx={0} cy={-200} r={30} fill="#1A0604" />
        </g>
        {/* siluet keluarga */}
        <g opacity={seg(f, bf(9, 6), bf(10, 4)) + seg(f, bf(16), bf(17, 2)) + seg(f, bf(21), be(22) + 10)}>
          <Silhouette x={kp(f, [[bf(9), 830], [bf(9, 20), 880], [bf(21), 820], [be(21), 1020]])} y={FL} scale={0.82} type="mother"
            pose={f > bf(21) ? 'walk_away' : 'step_back'} rim="#FFC870" seed={3} dir={f > bf(21) ? -1 : 1} />
          <Silhouette x={kp(f, [[bf(9), 960], [bf(9, 20), 1000], [bf(16), 900], [bf(21), 940], [be(21), 1100]])} y={FL} scale={0.62} type="child"
            pose={f > bf(16) && f < bf(17) ? 'spill' : f > bf(21) ? 'walk_away' : 'step_back'} rim="#FFC870" seed={6} dir={f > bf(21) ? -1 : 1} />
          {f > bf(21) && <Silhouette x={kp(f, [[bf(21), 720], [be(21), 940]])} y={FL} scale={0.8} type="woman_hijab" pose="walk_away" rim="#FFC870" seed={8} dir={-1} />}
        </g>
        {/* karakter utama */}
        <Reflect floor={FL} op={0.1}>
          <g opacity={1 - seg(f, bf(17), bf(19)) * 0.0}>
            <LitCharacter id="e1m" x={f >= bf(17) && f < bf(19) ? 250 : MX} y={FL} scale={1.1} haloColor={halo} phoneColor="#FF5FA2"
              pose={[[-100, 'sitting_dinner_table'], [bf(9), 'pointing_angry'], [bf(10), 'holding_phone'], [bf(12), 'sitting_dinner_table'], [bf(13), 'slumped'],
                [bf(14), 'sitting_dinner_table'], [bf(16, 36), 'slamming_table'], [bf(17), 'standing_tense'], [bf(18), 'arms_crossed'], [bf(19), 'sitting_dinner_table'],
                [bf(20), 'pointing_angry'], [bf(21), 'standing_tense'], [bf(22), 'standing_relaxed']]}
              expression={[[-100, 'neutral'], [bf(7), 'irritated'], [bf(8), 'angry'], [bf(10), 'hooked'], [bf(12), 'irritated'], [bf(13), 'tired'], [bf(14), 'irritated'],
                [bf(15), 'guilty'], [bf(16), 'irritated'], [bf(16, 36), 'explosive'], [bf(17), 'irritated'], [bf(18), 'bored'], [bf(19), 'cold'], [bf(20), 'angry'],
                [bf(21, 30), 'cold'], [bf(22), 'oblivious']]} />
          </g>
        </Reflect>
        <FrontTable op={clamp(tableOp)} heat={heat} />
        {/* ===== ilustrasi per kata kunci (medium, di samping karakter) ===== */}
        <Appear f={f} a={bf(7, 2)} b={be(7)} x={MX + 20} y={FL - 690} s={1.6} kind="glow"><B.MatchFuse burn={ease(f, bf(7, 6), be(7))} t={f} /></Appear>
        <Appear f={f} a={bf(8, 2)} b={be(8)} x={IX + 40} y={TABLE_Y} s={1.15}><U.GlassCrack crack={ease(f, bf(8, 6), bf(8, 20))} /></Appear>
        <Appear f={f} a={bf(9, 4)} b={be(9)} x={640} y={600} s={0.8}><JaggedBubble p={ramp(f, bf(9, 4), bf(9, 12))} tail={-1} /></Appear>
        <Appear f={f} a={bf(10, 2)} b={be(10)} x={IX} y={IY - 20} s={2.0}><Phone18 w={140} glow={1} /></Appear>
        <Appear f={f} a={bf(11, 2)} b={be(11)} x={IX} y={IY - 40} s={0.9} kind="glow">
          <g><g transform="scale(0.85)"><B.AmberBrain glow={0.25} t={f} /></g><A.PinkFlood x1={-260} y1={280} x2={0} y2={-20} t={f} on={1} /></g>
        </Appear>
        <Appear f={f} a={bf(12, 2)} b={be(12)} x={IX} y={IY} s={1.0}><U.PhoneDead off={ease(f, bf(12, 14), be(12) - 6)} t={f} /></Appear>
        <Appear f={f} a={bf(13, 2)} b={be(13)} x={IX - 20} y={IY} s={0.85}><U.MoodDrop drop={ease(f, bf(13, 4), bf(13, 22))} /></Appear>
        <Appear f={f} a={bf(14, 2)} b={be(14)} x={IX} y={IY - 40} s={0.95}><U.AmygdalaMonster mood="angry" t={f} bill={ease(f, bf(14, 14), bf(14, 26))} /></Appear>
        <Appear f={f} a={bf(15, 2)} b={be(15)} x={IX - 20} y={IY - 40} s={0.95}><U.AmygdalaMonster mood="eat" t={f} spoon={ease(f, bf(15, 6), bf(15, 30))} /></Appear>
        <Appear f={f} a={bf(16, 2)} b={bf(16, 40)} x={IX + 20} y={TABLE_Y} s={1.0}><U.WaterSpill p={ease(f, bf(16, 8), bf(16, 30))} /></Appear>
        <g transform={`translate(${MX},${FL - 620})`}><U.CartoonBlast k={f - bf(16, 38)} /></g>
        {/* beat 17: tangga eskalasi dengan HP 18+ di anak tangga, gauge ke merah */}
        <Appear f={f} a={bf(17, 2)} b={be(17)} x={470} y={FL - 20} s={0.95} kind="rise">
          <g>
            <A.EndlessStairs grow={ease(f, bf(17, 6), be(17) - 20)} needle={ease(f, bf(17, 30), be(17) - 10)} t={f} />
            {[1, 3, 5, 7, 9].map((i) => (
              <g key={i} transform={`translate(${-260 + i * 56 + 35},${-i * 52 - 60}) scale(0.32)`} opacity={clamp(ease(f, bf(17, 6), be(17) - 20) * 11 - i)}><Phone18 w={110} glow={1} /></g>
            ))}
          </g>
        </Appear>
        <Appear f={f} a={bf(18, 2)} b={be(18)} x={IX - 60} y={IY} s={0.85}><U.FoldersShield gray={ease(f, bf(18, 10), bf(18, 60))} shield={ease(f, bf(18, 50), bf(18, 66))} /></Appear>
        <Appear f={f} a={bf(19, 2)} b={be(19)} x={IX} y={IY} s={0.9}><U.StampNormal p={ease(f, bf(19, 22), bf(19, 30))} /></Appear>
        <Appear f={f} a={bf(20, 2)} b={be(20)} x={700} y={600} s={0.7}><JaggedBubble p={ramp(f, bf(20, 2), bf(20, 10))} tail={-1} /></Appear>
        <Appear f={f} a={bf(20, 20)} b={be(21)} x={720} y={FL - 10} s={1.6} kind="glow"><C.BrokenPlate p={ease(f, bf(20, 22), bf(20, 34))} /></Appear>
        {/* beat 22: noda merah menyebar dari kepala ke seluruh rumah */}
        <g transform={`translate(${MX},${FL - 620})`} opacity={ease(f, bf(22), bf(22, 10))}><U.RedInfection k={ease(f, bf(22, 4), be(22))} /></g>
        <Appear f={f} a={bf(22, 2)} b={be(22) + 10} kind="glow"><Halo x={MX} y={FL - 620} rx={300} color="#FF2D2D" op={0.35} /></Appear>
      </g>
    );
  },
};
