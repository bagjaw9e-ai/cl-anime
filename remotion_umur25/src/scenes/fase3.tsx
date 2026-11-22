// SHOT 6-8: FASE 3 — rumah pasangan. Tone amber hangat -> biru pucat dingin (hubungan mendingin).
// Beat 50-53 WAJIB simbolik: bayangan, pintu, bahasa tubuh istri, benda pecah. Tanpa kontak fisik/kekerasan/adegan ranjang.
import React from 'react';
import {CoupleBedroom, LivingDining, DeskFire} from '../components/Places';
import {LitCharacter, LitFemale, Reflect, Halo} from '../components/Lit';
import {FemaleCharacter} from '../components/FemaleCharacter';
import {Spotlight} from '../components/Spot';
import * as C from '../illustrations/part3';
import {AngerSteam, JaggedBubble, Phone18} from '../illustrations/shared';
import {Appear, be, bf, camKeys, ease, kp, ramp, shake} from '../kit';
import {clamp, mix} from '../theme';
import {TOTAL_FRAMES} from '../timeline';
import {ShotDef} from './types';

const FL = 1250, MX = 360, WX = 760;
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));
const coldAt = (f: number) => kp(f, [[bf(37), 0], [bf(41), 0.2], [bf(41, 40), 0.45], [bf(44), 0.6], [bf(46), 0.8], [bf(48), 1]]);
const haloM = (f: number) => mix('#FFC870', '#BFD4FF', coldAt(f));

/* ---------- SHOT 6: ruang tamu/makan (beat 37-49) ---------- */
export const shotF3a: ShotDef = {
  id: 'f3a', from: bf(37), to: bf(50), enter: 'light', trLen: 14, trColor: '#FFE7B0', floorY: FL,
  cam: (f) => {
    const c = camKeys(f, [
      [bf(37), 560, 860, 1.12], [be(37), 560, 860, 1.06],
      [bf(38, 10), 560, 860, 1.0], [be(38), 560, 860, 1.0],     // pull-out: berjauhan
      [bf(39, 12), 560, 860, 1.12], [be(39), 580, 860, 1.14],   // push ke HP
      [bf(40, 6), 600, 860, 1.22], [be(40), 600, 860, 1.25],    // zoom ke layar
      [bf(41, 10), 560, 860, 1.0], [be(41), 560, 860, 1.0],     // pull-out
      [bf(42, 8), 520, 820, 1.2], [be(42), 520, 820, 1.24],     // push-in pelukan
      [bf(43, 6), 600, 840, 1.1], [be(43), 520, 840, 1.1],      // pan
      [bf(44, 6), 580, 840, 1.12], [be(44), 580, 840, 1.12],    // static + rack focus
      [bf(45, 20), 700, 800, 1.25], [be(45), 720, 790, 1.32],   // push lewat viewfinder
      [bf(46, 10), 720, 780, 1.3], [be(46), 720, 760, 1.38],    // push-in pelan ke hati
      [bf(47, 8), 540, 840, 1.06], [be(47), 580, 840, 1.06],    // pan
      [bf(48, 6), 420, 780, 1.25], [be(48), 420, 780, 1.25],    // push ke kepala pria
      [bf(49, 4), 560, 860, 1.05], [be(49), 560, 860, 1.05],
    ]);
    const [dx, dy] = shake(f, bf(49, 6), 14, 12);
    return {x: c.x + dx, y: c.y + dy, s: c.s};
  },
  bg: (f) => <LivingDining cold={coldAt(f)} photoTilt={-9 * ease(f, bf(38, 30), bf(38, 44))} lampOn={1 - 0.6 * coldAt(f)} />,
  bgBlur: (f) => 2.2 + 2.5 * ease(f, bf(44, 10), bf(44, 30)) * (1 - ease(f, be(44) - 10, be(44))),
  dim: (f) => 0.2 + 0.18 * coldAt(f),
  fg: (f) => {
    const cold = coldAt(f);
    const womanGray = ease(f, bf(44, 10), be(44) - 10) * (1 - ease(f, be(44) - 6, be(44)));
    const womanVis = seg(f, bf(38), bf(45, 30)) * (1 - 0.0);
    const mannequin = ease(f, bf(45, 30), bf(45, 60));
    return (
      <g>
        <Spotlight x={560} y={820} rx={560} ry={760} dark={0.45 + 0.2 * cold} />
        <Reflect floor={FL} op={0.12}>
          {/* pria */}
          <g opacity={seg(f, bf(38), be(49) + 20)}>
            <LitCharacter id="f3m" x={kp(f, [[bf(38), MX], [bf(42), MX], [bf(42, 6), 400], [bf(43), 400], [bf(43, 6), MX]])} y={FL} scale={1.1} haloColor={haloM(f)} phoneColor="#FF5FA2"
              pose={[[-100, 'standing_relaxed'], [bf(39), 'holding_phone'], [bf(40), 'swiping_phone'], [bf(41), 'holding_phone'], [bf(42), 'stiff_while_hugged'],
                [bf(43), 'yawning'], [bf(44), 'holding_phone'], [bf(47), 'comparing_phone'], [bf(48), 'arms_crossed'], [bf(49), 'stop_hand']]}
              expression={[[-100, 'neutral'], [bf(39), 'hooked'], [bf(41), 'cold'], [bf(43), 'bored'], [bf(44), 'cold'], [bf(47), 'irritated'], [bf(49), 'angry']]} />
          </g>
          {/* istri */}
          <g opacity={Math.max(womanVis, seg(f, bf(46), be(49) + 20))}>
            <g transform={`translate(${kp(f, [[bf(42), 0], [bf(42, 8), -120], [bf(43), -120], [bf(43, 8), 0], [bf(49, 6), 0], [bf(49, 16), 70]])},0)`}>
              <g opacity={1 - mannequin * (f < bf(46) ? 1 : 0)}>
                <LitFemale id="f3w" x={WX} y={FL} scale={1.05} haloColor={mix('#FFD9A0', '#BFD4FF', cold)} gray={womanGray} halo={1 - womanGray}
                  pose={[[-100, 'standing_still'], [bf(41), 'talking'], [bf(42), 'hugging_husband'], [bf(43), 'talking'], [bf(44), 'standing_still'], [bf(46), 'standing_still'],
                    [bf(49, 6), 'stepping_back']]}
                  expression={[[-100, 'hopeful'], [bf(39), 'disappointed'], [bf(41), 'hopeful'], [bf(41, 34), 'sad'], [bf(42), 'happy'], [bf(42, 24), 'disappointed'],
                    [bf(43), 'hopeful'], [bf(43, 30), 'sad'], [bf(44), 'withdrawn'], [bf(45), 'confused'], [bf(46), 'crying'], [bf(47), 'sad'], [bf(49), 'scared']]} />
              </g>
            </g>
          </g>
        </Reflect>
        {/* beat 38: benang merah putus */}
        <Appear f={f} a={bf(38, 4)} b={be(38)} kind="glow"><C.RedThread x1={MX + 50} y1={FL - 400} x2={WX - 50} y2={FL - 380} snap={ease(f, bf(38, 24), bf(38, 44))} t={f} /></Appear>
        {/* beat 39-40: layar nurut, kartu di-swipe */}
        <Appear f={f} a={bf(39, 6)} b={be(39)} x={560} y={760} s={0.4}><C.ObedientScreen press={((f - bf(39)) % 30) / 30} t={f} /></Appear>
        <Appear f={f} a={bf(40, 2)} b={be(40)} x={560} y={770} s={0.46}><C.SwipeCards t={f} /></Appear>
        {/* beat 41: es merayap di dada pria */}
        <g opacity={seg(f, bf(41), be(42))}><g transform={`translate(${MX},${FL - 370})`}><C.IceChest ice={ease(f, bf(41, 14), bf(41, 56))} /></g></g>
        {/* beat 43: bubble cerita istri jatuh */}
        <Appear f={f} a={bf(43, 6)} b={be(43)} kind="glow"><C.FallingBubbles t={f - bf(43)} x1={WX - 90} y1={FL - 600} dir={-1} floorY={FL - 20} /></Appear>
        {/* beat 45: viewfinder -> manekin datar (simbol objek, non-seksual) */}
        <Appear f={f} a={bf(45, 10)} b={be(45)} x={WX} y={FL - 330} kind="glow"><C.Viewfinder w={360} h={720} m={mannequin} /></Appear>
        {/* beat 46: hati di dada istri nyala lalu retak */}
        <Appear f={f} a={bf(46, 6)} b={be(46)} x={WX} y={FL - 360} s={0.9} kind="glow"><C.HeartCrack glow={1} crack={ease(f, bf(46, 30), bf(46, 56))} /></Appear>
        {/* beat 47: HP di tangan dibandingkan */}
        <Appear f={f} a={bf(47, 6)} b={be(47)} x={MX + 160} y={FL - 560} s={0.45}><Phone18 w={110} glow={1} /></Appear>
        {/* beat 48: asap dari kepala */}
        <Appear f={f} a={bf(48, 2)} b={be(48) + 20} kind="glow"><AngerSteam x={MX} y={FL - 760} t={f} color="#E8E8EE" /></Appear>
        {/* beat 49: bubble bergerigi #@!% menghantam ke arah istri */}
        <Appear f={f} a={bf(49, 4)} b={be(49) + 6} x={570} y={560} s={0.62}><JaggedBubble p={ramp(f, bf(49, 4), bf(49, 12))} tail={-1} /></Appear>
      </g>
    );
  },
};

/* ---------- SHOT 7: kamar pasangan (beat 50) — simbolik ---------- */
export const shotF3b: ShotDef = {
  id: 'f3b', from: bf(50), to: bf(51), enter: 'dark', trLen: 20, floorY: 1080,
  cam: (f) => camKeys(f, [[bf(50), 600, 820, 1.0], [be(50), 640, 780, 1.16]]),  // slow push-in dingin
  bg: (f) => <CoupleBedroom phoneGlow={0.85 + 0.15 * Math.sin(f * 0.3)} doorOpen={kp(f, [[bf(50), 0.55], [bf(50, 40), 0.3]])} />,
  bgBlur: () => 1.5,
  dim: () => 0.2,
  fg: (f) => {
    const grow = ease(f, bf(50, 10), be(50) - 10);
    return (
      <g>
        <Spotlight x={620} y={820} rx={520} ry={700} dark={0.6} />
        {/* bayangan pria membesar di dinding (bukan orang sungguhan) */}
        <Halo x={860} y={700} rx={340} ry={460} color="#FF3B3B" op={0.2} />
        <g transform={`translate(880,1110) scale(${1.7 + grow * 0.7},${1.9 + grow * 0.8})`} opacity={0.88}>
          <path d="M -40 0 L -46 -110 Q -50 -170 0 -176 Q 50 -170 46 -110 L 40 0 Z" fill="#05060A" />
          <circle cx={0} cy={-200} r={30} fill="#05060A" />
        </g>
        {/* istri duduk di ujung kasur memeluk lutut, membelakangi kamera */}
        <FemaleCharacter id="f3bw" x={560} y={1080} scale={1.0} pose="sitting_bed_edge_hugging_knees" expression="uncomfortable" rim rimColor="#BFD4FF" rimColor2="#7FA8FF" />
      </g>
    );
  },
};

/* ---------- SHOT 8: ruang tamu dingin, abusive -> tidak merasa salah -> ending (beat 51-55) ---------- */
export const shotF3c: ShotDef = {
  id: 'f3c', from: bf(51), to: TOTAL_FRAMES, enter: 'blend', trLen: 6, floorY: FL,
  cam: (f) => {
    const c = camKeys(f, [
      [bf(51), 600, 840, 1.15], [be(51), 600, 840, 1.08],
      [bf(52, 4), 540, 840, 1.1], [be(52), 540, 840, 1.1],
      [bf(53, 4), 600, 860, 1.06], [be(53), 600, 860, 1.06],
      [bf(54), 600, 860, 1.12], [be(54), 580, 860, 1.04],       // pull-out pelan
      [be(55), 560, 880, 1.0], [TOTAL_FRAMES, 560, 880, 1.0],    // pull-out lambat ke wide
    ]);
    const [dx, dy] = shake(f, bf(53, 6), 16, 14);
    return {x: c.x + dx, y: c.y + dy, s: c.s};
  },
  bg: (f) => <LivingDining cold={1} photoTilt={-9} photoFall={ease(f, bf(51, 30), bf(51, 44), 0, 1)} photoCrack={1} lampOn={0.25 * (1 - ease(f, bf(54), bf(54, 20)))} />,
  bgBlur: (f) => 2.5 + 3 * ease(f, bf(53, 6), bf(53, 14)) * (1 - ease(f, bf(53, 24), bf(53, 40))),
  dim: (f) => 0.45 + 0.15 * ease(f, bf(54), bf(54, 30)),
  fg: (f) => {
    const thorn = ease(f, bf(51, 6), bf(51, 30));
    return (
      <g>
        <Spotlight x={kp(f, [[bf(51), 560], [bf(54), 560], [bf(54, 10), 420]])} y={820} rx={560} ry={760} dark={0.6} />
        {/* bayangan pria di dinding (beat 51-53) */}
        <g opacity={seg(f, bf(51), bf(54, 4)) * 0.75} transform={`translate(560,1110) scale(2.3,2.6)`}>
          <path d="M -40 0 L -46 -110 Q -50 -170 0 -176 Q 50 -170 46 -110 L 40 0 Z" fill="#05060A" /><circle cx={0} cy={-200} r={30} fill="#05060A" />
        </g>
        {/* foto pernikahan pecah di lantai */}
        <Appear f={f} a={bf(51, 44)} b={bf(54, 4)} x={560} y={1150} kind="glow"><C.BrokenPlate p={1} /></Appear>
        <Reflect floor={FL} op={0.1}>
          <g opacity={seg(f, bf(51), bf(54, 4))}>
            <LitCharacter id="f3cm" x={MX} y={FL} scale={1.12} pose={[[-100, 'looming'], [bf(52), 'stop_hand'], [bf(53), 'looming']]}
              expression={[[-100, 'cold'], [bf(51, 30), 'angry']]} haloColor="#FF4A3A" />
            <LitFemale id="f3cw" x={WX} y={FL} scale={1.0} pose={[[-100, 'stepping_back'], [bf(53, 6), 'shielding_self']]}
              expression={[[-100, 'scared'], [bf(52), 'hurt'], [bf(53, 6), 'scared']]} haloColor="#9FC8FF" />
          </g>
          {/* beat 54-55: pria santai main HP diterangi layar, istri menangis di sudut gelap */}
          <g opacity={seg(f, bf(54, 4), TOTAL_FRAMES + 10)}>
            <rect x={130} y={1110} width={330} height={140} rx={30} fill="#3E4A62" />
            <LitCharacter id="f3cs" x={300} y={FL} scale={1.05} pose="sitting_relaxed_phone" expression={[[-100, 'oblivious'], [bf(55), 'cold']]} phoneColor="#FF5FA2" haloColor="#FF8FC0" />
            <FemaleCharacter id="f3cc" x={890} y={FL} scale={0.9} pose="crying_in_corner" expression="crying" rim rimColor="#9FC8FF" rimColor2="#5A78B0" />
          </g>
        </Reflect>
        {/* beat 51: es di dada jadi api berduri */}
        <g opacity={seg(f, bf(51), bf(54, 4))} transform={`translate(${MX},${FL - 380})`}>
          <g opacity={1 - thorn}><C.IceChest ice={1} /></g>
          <g opacity={thorn} transform="scale(0.55)"><DeskFire x={0} y={60} />
            {Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <path key={i} d={`M ${Math.cos(a) * 70} ${Math.sin(a) * 70} L ${Math.cos(a) * 120} ${Math.sin(a) * 120} L ${Math.cos(a + 0.2) * 74} ${Math.sin(a + 0.2) * 74} Z`} fill="#8E1B24" />; })}
          </g>
        </g>
        <Appear f={f} a={bf(52, 2)} b={be(52)} x={600} y={560} s={0.62}><JaggedBubble p={ramp(f, bf(52, 2), bf(52, 10))} tail={-1} text="#!%@" /></Appear>
        <Appear f={f} a={bf(53, 4)} b={bf(54, 4)} x={600} y={1210} kind="glow"><C.BrokenPlate p={ease(f, bf(53, 6), bf(53, 20))} /></Appear>
        {/* beat 55: hati pria jadi batu */}
        <Appear f={f} a={bf(55, 4)} x={300} y={FL - 330} s={0.8} kind="glow"><C.StoneHeart stone={ease(f, bf(55, 8), bf(55, 50))} /></Appear>
      </g>
    );
  },
};
