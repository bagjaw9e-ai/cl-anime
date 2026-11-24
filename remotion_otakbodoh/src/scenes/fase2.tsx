// FASE 2 (beat 21-33): hutan malam berkabut + genangan air, tone dasar hijau tua kebiruan; maskot otak tengah jadi tokoh utama.
// FASE 3 (beat 34-45): jalan kota malam habis hujan (aspal basah), tone dasar ungu-merah.
import React from 'react';
import {CityWet, FEET, ForestNight, HZ} from '../components/Places4';
import {Halo, LitCharacter, Reflect, Rise} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import {MidbrainMascot} from '../components/MidbrainMascot';
import * as O from '../illustrations/ob';
import * as S from '../illustrations/shared';
import * as C from '../illustrations/part3';
import * as U from '../illustrations/u25';
import {Appear, be, bf, ease, kp, ramp} from '../kit';
import {K, guardCam, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const seg = (f: number, a: number, b: number, fd = 8) => Math.max(0, Math.min(1, (f - a) / fd + 1, (b - f) / fd + 1, 1));

/* ================= FASE 2 ================= */
setKeyPos({22: [540, 1255], 28: [540, 1255], 29: [540, 1255], 30: [540, 1215], 33: [540, 1215]});
const k2 = [
  K(21, 0, 540, 840, 1.55, 'forest'), K(21, 28, 540, 900, 1.0, 'forest'),             // keluar pintu 2 -> reveal hutan
  K(22, 0, 540, 900, 1.0), K(22, 18, 540, 1040, 1.28, 'forestTeal'),                    // maskot otak tengah
  K(22, 56, 540, 1040, 1.28), K(22, 72, 540, 1040, 1.38, 'forest'),
  K(23, 0, 540, 1040, 1.38), K(23, 14, 540, 1040, 1.08, 'forestMoss'),                 // kadal & monyet (tilt + lebar)
  K(24, 0, 540, 1040, 1.08), K(24, 14, 600, 1050, 1.3, 'forestTeal'),                  // duduk di batu + api unggun
  K(25, 0, 600, 1050, 1.3), K(25, 12, 640, 860, 1.3, 'forestTeal'),                    // tilt ke paha ayam
  K(26, 0, 640, 860, 1.3), K(26, 12, 540, 940, 1.36, 'forest'),                        // sarang + kelinci
  K(27, 0, 540, 940, 1.36), K(27, 14, 540, 880, 1.2, 'forestMoss'),                    // bingkai nyata vs layar
  K(28, 0, 540, 880, 1.2), K(28, 16, 600, 970, 1.28, 'forestTeal'),                     // tertipu layar
  K(28, 52, 600, 970, 1.28), K(28, 68, 640, 960, 1.4, 'forest'),
  K(29, 0, 600, 980, 1.3, undefined, -5), K(29, 18, 560, 1010, 1.36, 'forestMoss', -3), // orbit pelan: maskot meluk HP
  K(29, 84, 560, 1010, 1.44, 'forestTeal', 5),
  K(30, 0, 540, 900, 1.2, undefined, 0), K(30, 16, 540, 840, 1.15, 'forest'),        // jurnal
  K(30, 60, 540, 840, 1.15), K(30, 78, 560, 800, 1.3, 'forestTeal'),
  K(31, 0, 540, 760, 1.0), K(31, 16, 540, 860, 1.05, 'forestMoss'),                    // tilt: matahari-bulan + HP
  K(31, 56, 540, 860, 1.05), K(31, 72, 470, 820, 1.2, 'forestTeal'),
  K(32, 0, 540, 900, 1.15), K(32, 12, 540, 860, 1.0, 'forest'), K(32, 36, 540, 860, 1.25, 'forestRed'), // zoom out dikit lalu in
  K(33, 0, 540, 860, 1.25), K(33, 16, 540, 880, 1.32, 'forestRed'),                    // setir direbut
  K(33, 60, 540, 880, 1.32), K(33, 78, 540, 880, 1.42, 'forestRed'),
];
export const shotF2: ShotDef = {
  id: 'f2', from: bf(21), to: bf(34), enter: 'light', trLen: 16, trColor: '#FFB070',
  cam: (f) => guardCam(track(f, k2).cam, f >= bf(31) && f < be(31) ? [470, FEET - 580] : null),
  bg: (f) => <ForestNight T={track(f, k2).tone} t={f} sky={f > bf(31) && f < be(31) ? 0.5 + 0.5 * Math.sin((f - bf(31)) * 0.22) : 0} />,
  bgBlur: () => 8, dim: (f) => 0.24 + 0.3 * ease(f, bf(32, 10), bf(32, 30)) * (1 - ease(f, bf(33), bf(33, 12))),
  fg: (f) => {
    const mx = kp(f, [[bf(22), 260], [bf(22, 30), 540], [bf(24), 540], [bf(24, 10), 470], [bf(28), 470], [bf(28, 10), 420], [bf(29), 420], [bf(29, 8), 540]]);
    const sitting = f >= bf(24) && f < bf(27);
    const my = sitting ? FEET - 200 : FEET - 110;
    const mascotOn = seg(f, bf(22), bf(30, 6)) + seg(f, bf(32), bf(33, 8));
    const buff = ease(f, bf(32, 4), bf(32, 34));
    const lookM = f < bf(22, 60) ? 0 : Math.sin((f - bf(22, 60)) * 0.12);
    return (
      <g>
        <Spotlight x={560} y={920} rx={560} ry={760} dark={0.42} />
        <Reflect floor={FEET} op={0.32}>
          {/* 23: kadal & monyet */}
          <Appear f={f} a={bf(23, 2)} b={be(23)} x={230} y={FEET - 34} s={0.72} kind="rise"><O.AnimalSil kind="lizard" t={f} /></Appear>
          <Appear f={f} a={bf(23, 4)} b={be(23)} x={850} y={FEET - 92} s={0.78} kind="rise"><O.AnimalSil kind="monkey" t={f} /></Appear>
          {/* 24: batu + api unggun */}
          <g opacity={seg(f, bf(24), be(24))}><g transform={`translate(470,${FEET})`}><O.Rock /></g></g>
          <Appear f={f} a={bf(24, 4)} b={be(24)} x={720} y={FEET - 10} s={0.9} kind="glow"><O.Campfire t={f} /></Appear>
          {/* maskot otak tengah */}
          <g opacity={Math.min(1, mascotOn)}>
            <MidbrainMascot x={mx} y={my - buff * 60} s={1.3 + buff * 1.0} walk={f < bf(22, 30) ? 1 : 0}
              mood={f >= bf(32) ? 'buff' : f >= bf(29) ? 'love' : f >= bf(27) && f < bf(28) ? 'dizzy' : 'derp'} buff={buff}
              look={f >= bf(28) && f < bf(29) ? 1 : lookM} armsHug={f >= bf(29) && f < be(29) ? ease(f, bf(29, 2), bf(29, 14)) : 0} />
          </g>
          {/* 31: karakter dengan HP 18+ */}
          <g opacity={seg(f, bf(31), be(31))}>
            <LitCharacter id="f2m" x={470} y={FEET} scale={0.95} pose="holding_phone" expression={[[-100, 'tempted'], [bf(31, 40), 'hooked']]} haloColor="#7FD8C0" phoneColor="#FF5FA2" />
          </g>
        </Reflect>
        {/* 32: bayangan maskot raksasa menutupi hutan */}
        <g opacity={0.5 * buff * seg(f, bf(32), be(32))}><ellipse cx={540} cy={760} rx={700} ry={520} fill="#050207" /></g>
        {/* 25-26 */}
        <Appear f={f} a={bf(25, 1)} b={be(25)} x={640} y={860} s={0.95} kind="glow"><O.Drumstick t={f} /></Appear>
        <Appear f={f} a={bf(26, 1)} b={be(26)} x={540} y={940} s={0.85}><O.NestFamily t={f} /></Appear>
        {/* 27: dua bingkai + ? */}
        <Appear f={f} a={bf(27, 2)} b={be(27)} x={540} y={820} s={0.95}><O.TwoFrames p={ramp(f, bf(27, 30), bf(27, 40))} t={f} /></Appear>
        {/* 28: HP flat glow pink, maskot menatap */}
        <Appear f={f} a={bf(28, 2)} b={be(28)} x={700} y={880}><g transform={`rotate(${-6})`}><S.Phone18 w={150} badge={ramp(f, bf(28, 6), bf(28, 14)) * (f > bf(28, 50) ? 0.8 + 0.2 * Math.sin(f * 0.6) : 1)} /></g></Appear>
        {/* 29: dipeluk -> ternyata kardus tipis */}
        <g opacity={seg(f, bf(29), be(29))} transform={`translate(${kp(f, [[bf(29), 600], [bf(29, 14), 655]])},${FEET - 130}) rotate(12)`}>
          <O.CardboardPhone turn={ease(f, bf(29, 30), bf(29, 62))} w={100}><S.Phone18 w={100} /></O.CardboardPhone>
        </g>
        {/* 30: jurnal */}
        <Appear f={f} a={bf(30, 2)} b={be(30)} x={540} y={830} s={0.9} kind="glow">
          <C.JournalGlow on={ease(f, bf(30, 2), bf(30, 16))} mag={ease(f, bf(30, 30), bf(30, 80))} title="HUMAN BRAIN MAPPING" year="2017" />
        </Appear>
        {/* 31: matahari-bulan bergantian cepat */}
        <Appear f={f} a={bf(31, 2)} b={be(31)} x={540} y={620} s={0.9} kind="glow"><O.SunMoon cyc={(f - bf(31)) / 28} /></Appear>
        {/* 33: setir direbut */}
        <Appear f={f} a={bf(33, 2)} b={be(33)} x={540} y={860} s={0.95}><O.SteeringGrab grab={ease(f, bf(33, 20), bf(33, 50))} t={f} /></Appear>
        {f > bf(33, 20) && f < be(33) && <Rise x={540} y={900} w={300} h={300} n={6} color="#FF5A4A" t={f} />}
      </g>
    );
  },
};

/* ================= FASE 3 ================= */
const manX3 = (f: number) => kp(f, [[bf(34), 540], [bf(34, 26), 420], [bf(37), 540], [bf(38), 380], [bf(38, 100), 700], [bf(39), 600], [bf(40), 540]]);
setKeyPos({37: [540, 1250], 39: [540, 1215], 40: [540, 1215], 45: [540, 1215]});
const k3 = [
  K(34, 0, 540, 900, 2.4, 'cityPurple'), K(34, 28, 540, 900, 1.0, 'cityPurple'),       // pintu 3 terbuka -> reveal jalan (pull-out)
  K(35, 0, 540, 900, 1.0), K(35, 14, 640, 960, 1.18, 'cityMagenta'),                    // singgasana + mahkota
  K(36, 0, 640, 960, 1.18), K(36, 14, 540, 840, 1.3, 'cityPurple'),                     // PFC menyusut
  K(37, 0, 540, 840, 1.3), K(37, 14, 560, 930, 1.45, 'cityRed'),                        // panel kendali di dada
  K(37, 46, 560, 930, 1.45), K(37, 62, 620, 1000, 1.3, 'cityMagenta'),
  K(38, 0, 380, 920, 1.1, 'cityPurple'), K(38, 100, 700, 920, 1.16, 'cityMagenta'),      // tilt/pan mengikuti arus
  K(39, 0, 600, 880, 1.06), K(39, 14, 620, 860, 1.18, 'cityRed'),                       // tali boneka + rewind 3x
  K(39, 60, 620, 860, 1.18), K(39, 76, 620, 840, 1.28, 'cityMagenta'),
  K(40, 0, 560, 860, 1.12), K(40, 14, 540, 790, 1.3, 'cityRed'),                        // korek di atas kepala
  K(41, 0, 560, 780, 1.2), K(41, 16, 620, 880, 1.15, 'cityMagenta'),                    // bubble + timbangan (tilt)
  K(41, 50, 620, 880, 1.15), K(41, 66, 700, 980, 1.3, 'cityPurple'),
  K(42, 0, 560, 880, 1.0), K(42, 12, 540, 860, 1.08, 'cityPurple'),                     // lampu jalan berkedip
  K(43, 0, 540, 860, 1.08), K(43, 14, 720, 860, 1.25, 'cityMagenta'),                   // pisau tumpul + siput
  K(44, 0, 720, 860, 1.25), K(44, 12, 680, 780, 1.15, 'cityPurple'),                    // kertas berhamburan (tilt)
  K(45, 0, 580, 820, 1.12), K(45, 16, 680, 900, 1.25, 'cityRed'),                       // tangga rencana ambruk
  K(45, 66, 680, 900, 1.25), K(45, 84, 700, 870, 1.38, 'cityMagenta'),
];
export const shotF3: ShotDef = {
  id: 'f3', from: bf(34), to: bf(46), enter: 'light', trLen: 16, trColor: '#FF6A5A',
  cam: (f) => guardCam(track(f, k3).cam, f > bf(34, 20) && (f < bf(35, 4) || f > bf(37, -4)) ? [manX3(f), FEET - 580] : null),
  bg: (f) => <CityWet T={track(f, k3).tone} t={f} lampFlick={f > bf(42) && f < be(42) ? 1 : 0} />,
  bgBlur: () => 8, dim: () => 0.34,
  fg: (f) => {
    const manOn = 1 - seg(f, bf(35, 4), bf(37, -4));
    const manX = manX3(f);
    const rew = [30, 66, 100].some((o) => f >= bf(39, o) && f < bf(39, o + 8));
    return (
      <g>
        <Spotlight x={580} y={900} rx={560} ry={760} dark={0.42} />
        {/* 34: pintu 3 merah terbuka */}
        <Reflect floor={HZ} op={0.4} depth={420}>
          <g opacity={1 - ease(f, bf(34, 18), bf(34, 30))} transform={`translate(540,${HZ})`}><O.GlowDoor n={3} color="#FF3B3B" on={1} open={ease(f, bf(34, 0), bf(34, 14))} /></g>
        </Reflect>
        {/* 38: arus merah */}
        <g opacity={seg(f, bf(38), be(38))} transform={`translate(${kp(f, [[bf(38), 380], [be(38), 700]])},${FEET - 30})`}><U.RedCurrent t={f} /></g>
        <Reflect floor={FEET} op={0.32}>
          {/* 35: singgasana + maskot bermahkota */}
          <Appear f={f} a={bf(35, 2)} b={be(35)} x={640} y={FEET} s={0.8} kind="rise">
            <O.Throne /><g transform="translate(0,-230)"><MidbrainMascot mood="derp" s={0.95} /></g>
            <g transform={`translate(0,${-345 - 80 * (1 - ease(f, bf(35, 10), bf(35, 22)))})`}><O.Crown t={f} /></g>
          </Appear>
          <g opacity={manOn}>
            <LitCharacter id="f3m" x={manX} y={FEET} scale={0.95} haloColor="#FF5FA2"
              pose={[[-100, 'walking'], [bf(34, 26), 'standing_relaxed'], [bf(37), 'standing_relaxed'], [bf(38), 'being_dragged'], [bf(39), 'puppet_pulled'],
                [bf(39, 40), 'shaking_head'], [bf(39, 52), 'puppet_pulled'], [bf(39, 82), 'shaking_head'], [bf(39, 92), 'puppet_pulled'], [bf(40), 'fist_clenched'],
                [bf(41), 'standing_relaxed'], [bf(42), 'standing_relaxed'], [bf(44), 'scratching_head'], [bf(45), 'scratching_head'], [bf(45, 60), 'head_down']]}
              expression={[[-100, 'neutral'], [bf(37), 'dazed'], [bf(38), 'struggling'], [bf(39), 'ashamed'], [bf(40), 'irritated'], [bf(40, 30), 'angry'],
                [bf(41), 'tempted'], [bf(42), 'worried'], [bf(43), 'dazed'], [bf(44), 'confused'], [bf(45), 'confused'], [bf(45, 60), 'hopeless']]}
              lookAt={f >= bf(41) && f < bf(42) ? {x: 0.7, y: -0.6} : {x: 0, y: 0}} />
          </g>
        </Reflect>
        {/* 36: PFC emas menyusut */}
        <Appear f={f} a={bf(36, 2)} b={be(36)} x={540} y={840} s={0.9} kind="glow"><O.PfcBlob shrink={ease(f, bf(36, 6), be(36))} t={f} /></Appear>
        {/* 37: panel kendali di dada + pedal rem patah */}
        <Appear f={f} a={bf(37, 4)} b={be(37)} x={540} y={985} s={0.46}><O.ControlPanel off={ease(f, bf(37, 14), bf(37, 54))} t={f} /></Appear>
        <Appear f={f} a={bf(37, 40)} b={be(37)} x={740} y={1110} s={0.55} kind="rise"><O.BrakeGlow broken={ease(f, bf(37, 50), bf(37, 58))} /></Appear>
        {/* 39: HP ditarik tali + rewind 3x */}
        <Appear f={f} a={bf(39, 2)} b={be(39)} x={780} y={560} s={0.9}><g transform="rotate(8)"><S.Phone18 w={110} /></g></Appear>
        {rew && <g transform="translate(380,680)"><O.RewindIcon p={1} /></g>}
        {/* 40: korek api di atas kepala */}
        <Appear f={f} a={bf(40, 4)} b={be(40)} x={560} y={560} s={0.8}><O.MatchFlame lit={ease(f, bf(40, 10), bf(40, 16))} t={f} /></Appear>
        {/* 41: bubble pink + timbangan patah */}
        <Appear f={f} a={bf(41, 2)} b={be(41)} x={720} y={620} s={0.75}><U.PinkCloud t={f} sensor badge /></Appear>
        <Appear f={f} a={bf(41, 20)} b={be(41)} x={760} y={1060} s={0.55}><O.ScaleBreak snap={ease(f, bf(41, 52), bf(41, 64))} /></Appear>
        {/* 43-45 */}
        <Appear f={f} a={bf(43, 2)} b={be(43)} x={770} y={840} s={0.7}><O.DullKnifeSnail t={f - bf(43)} /></Appear>
        <Appear f={f} a={bf(44, 1)} b={be(44)} x={740} y={720} s={0.8}><U.FlyingNotes t={f - bf(44)} /></Appear>
        <Appear f={f} a={bf(45, 2)} b={be(45)} x={720} y={880} s={0.85}><O.PaperStairs fall={ease(f, bf(45, 30), bf(45, 80))} tear={ease(f, bf(45, 76), bf(45, 96))} t={f} /></Appear>
        {f > bf(36) && f < be(36) && <Halo x={540} y={840} rx={260} color="#FFD166" op={0.12} />}
      </g>
    );
  },
};
