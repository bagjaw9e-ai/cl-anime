import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {FONT} from './fonts';
import {Character} from './components/Character';
import * as H from './illustrations/hook';
import * as P1 from './illustrations/phase1';
import * as P2 from './illustrations/phase2';
import * as P3 from './illustrations/phase3';
import * as P4 from './illustrations/phase4';
import * as P5 from './illustrations/phase5';
import * as CT from './illustrations/cta';

export const ILL_W = 2400, ILL_H = 3720;
type Item = [string, React.ReactNode, number];
const T = 40;
const ITEMS: Item[] = [
  ['#1 X-ray kepala', <H.XrayHead t={T} />, 1], ['#2 HP 18+ digembok', <H.PhoneLocked t={T} />, 0.8], ['#2 tisu dicoret', <H.TissueBoxX t={T} />, 1],
  ['#3 kalender 1→30 + stempel', <H.CalendarFlip t={T} />, 0.9], ['#3 teaser otak hari-30', <H.BrainTeaser t={T} />, 0.9],
  ['#4 kalender hari 1–3', <P1.Calendar13 t={T} />, 0.9], ['#5 karung beban (prop karakter)', <Character id="ws" x={0} y={330} scale={0.62} pose="carrying_weight" expression="sweaty_stressed" />, 1], ['#6 badan OK', <P1.BodyOK t={T} />, 1],
  ['#7 otak + rel loop aus', <P1.BrainTrack t={T} />, 0.9], ['#8 jam tik-tok', <P1.ClockTick t={T} />, 1], ['#11 layar HP 18+', <P1.PhoneScreen18 t={T} />, 0.6],
  ['#12 saklar lampu', <P1.LightSwitch t={T} />, 1.2], ['#12 kotak tisu', <P1.TissueSmall t={T} />, 1.4], ['#13 termometer + keringat', <P1.Thermometer t={T} />, 0.9],
  ['#15 kalender hari 7', <P2.Calendar7 t={T} />, 0.9], ['#16 jurnal STUDY 2003', <P2.JournalPaper t={T} />, 0.75], ['#17 tabung T + molekul', <P2.TestTube t={T} />, 0.85],
  ['#18 grafik 145%', <P2.BarChart145 t={T} level={1.45} />, 0.65], ['#19 balik ke 100%', <P2.BarChart145 t={T} level={1} />, 0.65], ['#21 dial + gear', <P2.DialChest t={T} />, 0.85],
  ['#22 kalender minggu 2', <P3.Calendar14 t={T} />, 0.9], ['#23 baterai 1 bar', <P3.BatteryLow t={T} />, 1], ['#24 gauge libido', <P3.LibidoGauge t={T} />, 0.9],
  ['#25 mood meter', <P3.MoodMeter t={T} />, 0.8], ['#26 EKG flatline', <P3.EkgFlat t={T} />, 0.75], ['#27 amigdala', <P3.AmygdalaBrain t={T} />, 0.75],
  ['#28 tangki DOPAMIN', <P3.DopamineTank t={T} />, 0.8], ['#29 jejak bolak-balik', <P3.Footprints t={80} />, 0.6], ['#30 HP grafik naik', <P3.PhoneSpike t={T} />, 0.8],
  ['#31 otak didetoks', <P3.BrainWash t={T} />, 0.75], ['#32 kalender minggu 3–4', <P4.Calendar34 t={T} />, 0.9], ['#33 asap tangan → HP', <P4.SmokeHand t={T} />, 0.75],
  ['#34 otak pilih pintu', <P4.BrainDoors t={T} />, 0.8], ['#35 jam + bonus waktu', <P4.ClockBonus t={T} />, 0.9], ['#35 kegiatan baru', <g><g transform="translate(-110,0) scale(0.8)"><P4.ActivityIcon t={T} k="guitar" /></g><g transform="scale(0.8)"><P4.ActivityIcon t={T} k="book" /></g><g transform="translate(110,0) scale(0.8)"><P4.ActivityIcon t={T} k="dumbbell" /></g></g>, 0.9],
  ['#36 bar fokus', <P4.FocusBar t={T} />, 0.65], ['#37 tali boneka digunting', <P4.PuppetStrings t={T} cut={1.5} />, 0.65], ['#38 maskot jinak', <P4.MascotCalm t={T} />, 1],
  ['#39 PFC terbuka (jawaban teaser)', <P4.BrainUnlock t={T} />, 0.8], ['#40 kalender 66 + selotip', <P5.Calendar66 t={T} />, 0.9], ['#41 pita finish', <P5.FinishRibbon t={T} />, 0.75],
  ['#43 mimpi pink blur', <P5.DreamBubble t={T} />, 0.8], ['#43 jam weker', <P5.AlarmClock t={T} />, 0.9], ['#43 centang NORMAL', <P5.NormalCheck t={T} />, 1],
  ['#44 diagram sperma + ORGANIK', <P5.SpermDiagram t={T} />, 0.65], ['#45 pabrik/pompa dicoret', <P5.FactoryX t={T} />, 0.8], ['#46 buku neuroplasticity', <CT.GuideBook t={T} />, 0.8],
  ['#47 labirin vs peta', <CT.MazeVsMap t={T} />, 0.7], ['#48 otak kintsugi', <CT.BrainKintsugi t={T} />, 0.75], ['#49 logo neon', <CT.LogoNeon t={T} w={520} />, 0.65],
];

export const IllustrationSheet: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(${C.base2}, ${C.base0})`}}>
    <svg width={ILL_W} height={ILL_H}>
      {ITEMS.map(([label, el, s], i) => {
        const cx = 200 + (i % 6) * 400, cy = 230 + Math.floor(i / 6) * 410;
        return (
          <g key={i}>
            <rect x={cx - 190} y={cy - 200} width={380} height={390} rx={26} fill="#3A2A3E" />
            <clipPath id={`ic${i}`}><rect x={cx - 190} y={cy - 200} width={380} height={390} rx={26} /></clipPath>
            <g clipPath={`url(#ic${i})`}><g transform={`translate(${cx},${cy - 10}) scale(${s * 0.8})`}>{el}</g></g>
            <text x={cx} y={cy + 178} textAnchor="middle" fontSize={22} fontWeight={700} fill="#F5E6DA" fontFamily={FONT}>{label}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
