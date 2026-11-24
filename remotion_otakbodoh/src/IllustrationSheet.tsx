import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from './Stage';
import * as U from './illustrations/u25';
import * as O from './illustrations/ob';
import {MidbrainMascot} from './components/MidbrainMascot';
import * as A from './illustrations/part1';
import * as C from './illustrations/part3';
import * as S from './illustrations/shared';
import * as PR from './illustrations/promo';
import {Silhouette} from './components/Silhouette';

export const ILL_W = 2400;
export const ILL_H = 5600;
// [label beat, gambar, skala DI VIDEO, perkiraan lebar asli (px pada skala 1), warm]
type It = [string, (t: number) => React.ReactNode, number, number, number];
const ITEMS: It[] = [
  ['1 kertas ujian, cap nilai 0', () => <O.ExamPaper stamp={1} />, 1.1, 420, 0],
  ['1 tanda tanya di atas kepala', (t) => <U.BigQuestion p={1} t={t} />, 0.8, 300, 0],
  ['2/28/41 HP 18+ glow pink + sensor', () => <S.Phone18 w={150} />, 1.8, 230, 0],
  ['3 gagang pintu, kunci diputar, gantungan', (t) => <O.DoorKnobLock turn={1} t={t} />, 1.1, 420, 0.5],
  ['3/54 kotak tisu (simbolik)', () => <A.TissueBox pull={0.6} />, 1.0, 300, 0.5],
  ['5/20/34 pintu bernomor 1-2-3', () => <g transform="translate(0,190)"><g transform="translate(-200,0) scale(0.8)"><O.GlowDoor n={1} color="#FFD23F" on={1} /></g><O.GlowDoor n={2} color="#FF8A2B" on={1} open={0.4} /><g transform="translate(200,0) scale(0.8)"><O.GlowDoor n={3} color="#FF3B3B" on={1} /></g></g>, 1.0, 560, 0],
  ['7 kabel merah HP -> dahi', (t) => <O.RedCable x1={-180} y1={100} x2={160} y2={-120} k={1} t={t} />, 1.0, 400, 0],
  ['8 kepala samping, PFC meredup', (t) => <O.HeadProfile pfc={0.35} flick={1} t={t} />, 1.0, 440, 0],
  ['9 gear emas berputar di dahi', (t) => <O.HeadProfile pfc={1} gears={1} t={t} />, 1.0, 440, 0],
  ['10 benang kusut -> jaringan node', (t) => <O.TangleToNet k={0.8} t={t} />, 1.0, 420, 0],
  ['11 papan catur, kuda melangkah', () => <O.ChessBoard move={0.6} />, 1.0, 500, 0],
  ['12 papan tulis atom/grafik/panah', (t) => <O.Chalkboard k={1} t={t} />, 1.0, 600, 0],
  ['13 peta + jalan ke bendera', (t) => <O.MapPath unroll={1} path={1} t={t} />, 1.0, 560, 0],
  ['14 pedal rem bercahaya', () => <O.BrakeGlow press={0.4} />, 1.0, 300, 0],
  ['14 HP mendekat (ditahan tangan)', () => <S.Phone18 w={120} />, 1.3, 180, 0],
  ['15 panah loop siklus', (t) => <O.LoopArrows t={t} r={180} />, 1.0, 420, 0],
  ['16 mesin melambat berasap', (t) => <O.HeadProfile pfc={0.5} gears={1} speed={0.2} smoke={1} t={t} />, 1.0, 440, 0],
  ['16 speedometer turun ke merah', () => <O.Speedometer v={0.15} />, 1.0, 340, 0],
  ['17 ikon link + panah ke atas', (t) => <g><PR.LinkIcon t={t} on={1} /><g transform="translate(150,40)"><PR.ArrowUp t={t} on={1} h={160} /></g></g>, 1.0, 400, 1],
  ['18 buku panduan + jaringan neuron', (t) => <O.GuideBook open={1} net={1} t={t} />, 1.0, 480, 1],
  ['19 retakan kepala amber menyatu', (t) => <O.HeadProfile pfc={1} crack={1} heal={0.7} tint="#FFB23F" t={t} />, 1.0, 440, 1],
  ['22 maskot otak tengah (polos)', () => <MidbrainMascot mood="derp" />, 1.3, 220, 0],
  ['23 kadal & monyet, inti merah', (t) => <g><g transform="translate(-90,60) scale(0.8)"><O.AnimalSil kind="lizard" t={t} /></g><g transform="translate(130,0) scale(0.8)"><O.AnimalSil kind="monkey" t={t} /></g></g>, 1.0, 460, 0],
  ['24 api unggun + batu', (t) => <g transform="translate(0,60)"><g transform="translate(-140,40)"><O.Rock /></g><O.Campfire t={t} /></g>, 1.0, 420, 0],
  ['25 paha ayam bercahaya', (t) => <O.Drumstick t={t} />, 1.1, 300, 0],
  ['26 sarang telur + keluarga kelinci', (t) => <O.NestFamily t={t} />, 1.0, 600, 0],
  ['27 bingkai nyata vs layar flat + ?', (t) => <O.TwoFrames p={1} t={t} />, 1.0, 580, 0],
  ['29 HP ternyata kardus tipis', () => <O.CardboardPhone turn={0.75}><S.Phone18 w={180} /></O.CardboardPhone>, 1.0, 200, 0],
  ['29 maskot meluk HP (mata hati)', () => <MidbrainMascot mood="love" armsHug={1} />, 1.3, 220, 0],
  ['30 jurnal Human Brain Mapping 2017', () => <C.JournalGlow on={1} mag={1} title="HUMAN BRAIN MAPPING" year="2017" />, 1.0, 420, 0],
  ['31 matahari-bulan bergantian', () => <O.SunMoon cyc={0.15} />, 1.0, 600, 0],
  ['32 maskot membesar berotot', () => <MidbrainMascot mood="buff" buff={1} />, 2.4, 220, 0],
  ['33 setir direbut maskot dari PFC', (t) => <O.SteeringGrab grab={0.6} t={t} />, 1.0, 560, 0],
  ['35 maskot bermahkota di singgasana', (t) => <g transform="translate(0,200)"><O.Throne /><g transform="translate(0,-230)"><MidbrainMascot mood="derp" s={0.9} /></g><g transform="translate(0,-340)"><O.Crown t={t} /></g></g>, 0.9, 420, 0],
  ['36 PFC emas menyusut', (t) => <O.PfcBlob shrink={0.6} t={t} />, 1.0, 340, 0],
  ['37 panel kendali dada mati', (t) => <O.ControlPanel off={0.5} t={t} />, 1.0, 400, 0],
  ['37 pedal rem patah', () => <O.BrakeGlow broken={1} />, 1.0, 300, 0],
  ['38 arus air merah', (t) => <U.RedCurrent t={t} />, 1.0, 600, 0],
  ['39 ikon rewind + HP ditarik tali', () => <g><O.RewindIcon p={1} /><g transform="translate(160,0)"><S.Phone18 w={90} /></g></g>, 1.0, 330, 0],
  ['40 korek api menyala + asap', (t) => <O.MatchFlame lit={1} t={t} />, 1.0, 200, 0],
  ['41 bubble pink + sensor', (t) => <U.PinkCloud t={t} sensor badge />, 1.0, 420, 0],
  ['41 timbangan pertimbangan patah', () => <O.ScaleBreak snap={0.6} />, 1.0, 500, 0],
  ['43 pisau tumpul + siput', (t) => <O.DullKnifeSnail t={t} />, 1.0, 560, 0],
  ['44 kertas catatan berhamburan', (t) => <U.FlyingNotes t={t % 60} />, 1.0, 560, 0],
  ['45 tangga kertas ambruk + peta sobek', (t) => <O.PaperStairs fall={0.4} tear={0.6} t={t} />, 1.0, 560, 0],
  ['47 buku teori medis ditutup', () => <O.MedBook close={0.3} />, 1.0, 500, 0],
  ['48 grafik performa turun tajam', () => <O.ChartDrop k={1} />, 1.0, 440, 0],
  ['49 rekan ngajak diskusi (siluet)', (t) => <Silhouette y={240} scale={0.6} type="man" pose="talk" t={t} rim="#BFD4FF" />, 1.0, 300, 0],
  ['50 close-up mata kosong', (t) => <U.EyeCloseup t={t} />, 1.0, 840, 0],
  ['51 tumpukan berkas + kalender dicoret', (t) => <g><g transform="translate(-120,200) scale(0.8)"><O.FileStack h={0.8} t={t} /></g><g transform="translate(160,-30) scale(0.7)"><O.CalendarCrossed cross={0.6} /></g></g>, 1.0, 520, 0],
  ['52 lensa kamera rack focus', (t) => <U.CameraLens t={t} />, 1.0, 480, 0],
  ['53 gear berkarat di kepala', (t) => <O.HeadProfile pfc={0.4} gears={1} speed={0.08} rust={1} t={t} tint="#8A90A0" />, 1.0, 440, 0],
  ['54 rambu JALAN PINTAS', (t) => <g transform="translate(0,80)"><O.ShortcutSign p={1} t={t} /></g>, 1.0, 400, 0],
  ['55 jam pasir mengalir', (t) => <O.Hourglass k={0.4} t={t} />, 1.0, 300, 0],
  ['56 lilin & tanaman POTENSI layu', (t) => <g transform="translate(0,80)"><O.PotentialCandle die={0.5} t={t} /></g>, 1.0, 420, 0],
];

export const IllustrationSheet: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={ILL_W} height={ILL_H}>
        {ITEMS.map(([label, el, sv, wpx, warm], i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const w = 380, h = 480, fl = 440;
          const fit = Math.min(0.62, 340 / (wpx * sv)) * sv; // skala di sheet (proporsional ke ukuran di video)
          return (
            <Stage key={i} x={20 + col * 396} y={20 + row * 556} w={w} h={h} floor={fl} warm={warm} label={`${label} · ±${Math.round(wpx * sv)} px`}>
              <g transform={`translate(${w / 2},${h / 2 - 10}) scale(${fit})`}>{el(t)}</g>
            </Stage>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
