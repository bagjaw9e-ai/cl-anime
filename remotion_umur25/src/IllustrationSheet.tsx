import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from './Stage';
import * as U from './illustrations/u25';
import * as A from './illustrations/part1';
import * as B from './illustrations/part2';
import * as C from './illustrations/part3';
import * as S from './illustrations/shared';
import * as PR from './illustrations/promo';
import {Silhouette} from './components/Silhouette';

export const ILL_W = 2400;
export const ILL_H = 4500;
// [label beat, gambar, skala DI VIDEO, perkiraan lebar asli (px pada skala 1), warm]
type It = [string, (t: number) => React.ReactNode, number, number, number];
const ITEMS: It[] = [
  ['1 kue ultah lilin 25 + confetti', (t) => <g><g transform="translate(0,140)"><U.BirthdayCake t={t} /></g><U.Confetti k={14} /></g>, 1.1, 520, 0.6],
  ['1 teman pesta (siluet tepuk tangan)', (t) => <g transform="translate(0,260)"><Silhouette x={-110} scale={0.7} type="friend" pose="clap" t={t} rim="#FFC870" /><Silhouette x={110} scale={0.66} type="woman" pose="clap" seed={3} t={t} rim="#FFC870" /></g>, 1, 420, 0.6],
  ['2 lilin ditiup, asap', (t) => <g transform="translate(0,140)"><U.BirthdayCake t={t} blown={0.5} /></g>, 1.1, 520, 0.6],
  ['2/10 HP 18+ (siluet blur + sensor)', () => <S.Phone18 w={150} />, 2.2, 230, 0],
  ['3 otak X-ray, retak 1-2-3', () => <A.XrayBrain cracks={[1, 1, 1]} />, 1.2, 520, 0],
  ['4 3 bayangan "versi lain" di dinding', (t) => <g transform="translate(0,220)"><U.ShadowSelves show={[1, 1, 1]} t={t} /></g>, 1, 600, 0],
  ['7 sumbu pendek (korek)', (t) => <B.MatchFuse burn={0.4} t={t} />, 2.6, 220, 0.5],
  ['8 gelas retak', () => <g transform="translate(0,140)"><U.GlassCrack crack={1} /></g>, 1.5, 200, 0.5],
  ['9 bubble #@!%', () => <S.JaggedBubble />, 1.3, 400, 0.5],
  ['9 ibu & adik mundur (siluet)', (t) => <g transform="translate(0,260)"><Silhouette x={-110} scale={0.62} type="mother" pose="step_back" t={t} /><Silhouette x={110} scale={0.62} type="child" pose="step_back" seed={4} t={t} /></g>, 1, 420, 0.5],
  ['11 otak kebanjiran partikel pink', (t) => <g><g transform="scale(0.6)"><B.AmberBrain glow={0} t={t} /></g><A.PinkFlood x1={-200} y1={180} x2={0} y2={-40} t={t} on={1} /></g>, 1.1, 480, 0],
  ['12 HP mati, baterai 0%', (t) => <U.PhoneDead off={0.3} t={t} />, 1.1, 260, 0],
  ['13 grafik mood jatuh', () => <U.MoodDrop drop={0.8} />, 1.0, 520, 0],
  ['14 monster amigdala + tagihan', (t) => <U.AmygdalaMonster mood="angry" t={t} bill={1} />, 1.1, 480, 0],
  ['15 monster disuapi HP pakai sendok', (t) => <U.AmygdalaMonster mood="eat" t={t} spoon={1} />, 1.1, 480, 0],
  ['16 air tumpah', () => <g transform="translate(0,100)"><U.WaterSpill p={0.8} /></g>, 1.2, 420, 0.5],
  ['16 kepala meledak (bom kartun)', () => <U.CartoonBlast k={10} />, 1.0, 560, 0.5],
  ['17 tangga eskalasi + gauge merah', (t) => <g transform="translate(-20,180)"><A.EndlessStairs grow={1} needle={0.95} t={t} /></g>, 0.9, 600, 0],
  ['18 folder kategori abu + otak berperisai', () => <U.FoldersShield gray={1} shield={1} />, 1.0, 600, 0],
  ['19 stempel NORMAL di ikon kepalan', () => <U.StampNormal p={1} />, 1.0, 440, 0.6],
  ['20 piring pecah', () => <C.BrokenPlate p={0.8} />, 2.0, 260, 0.6],
  ['22 noda merah menyebar (virus)', () => <U.RedInfection k={0.55} />, 1.0, 640, 0.8],
  ['23 otak amber + neuron', (t) => <g><B.AmberBrain glow={1} t={t} s={0.95} /><PR.NeuronNet t={t} grow={1} s={0.55} /></g>, 1.0, 560, 0],
  ['24 e-book berlogo + link + panah', (t) => <g><g transform="translate(-70,40)"><PR.EbookTablet t={t} on={1} s={0.75} /></g><g transform="translate(190,-60)"><PR.LinkIcon t={t} on={1} s={0.55} /></g><g transform="translate(190,-150)"><PR.ArrowUp t={t} on={1} h={160} /></g></g>, 1.0, 520, 0],
  ['25 amigdala tenang, perban dilepas', (t) => <U.AmygdalaMonster mood="calm" t={t} calm={1} bandage={0.4} />, 1.1, 480, 0],
  ['28 awan hayalan pink blur', (t) => <U.PinkCloud t={t} />, 1.2, 460, 0],
  ['29 perempuan di halte (sopan)', (t) => <g transform="translate(0,260)"><Silhouette scale={0.72} type="woman_hijab" pose="stand" t={t} rim="#FFC870" /></g>, 1, 200, 0],
  ['30 thought bubble sensor + 18+', (t) => <U.PinkCloud t={t} sensor badge />, 1.2, 480, 0],
  ['31 tanda tanya besar', (t) => <U.BigQuestion p={1} t={t} />, 1.0, 300, 0],
  ['32 otak tengah angkat barbel', (t) => <g transform="translate(0,80)"><U.MidbrainLift buff={0.7} t={t} /></g>, 1.0, 480, 0],
  ['33 gua batu + gambar dinding', (t) => <g transform="translate(0,40)"><U.CaveScene t={t} /></g>, 1.0, 640, 0],
  ['34 paha ayam + sarang telur', () => <U.FoodNest />, 1.1, 520, 0],
  ['35 jungkat-jungkit otak tengah vs PFC', (t) => <g transform="translate(0,80)"><U.Seesaw tilt={1} t={t} /></g>, 0.95, 620, 0],
  ['36 PFC + rem + timbangan', (t) => <U.PfcBrake t={t} />, 0.9, 640, 0],
  ['38 arus air merah', (t) => <g transform="translate(0,60)"><U.RedCurrent t={t} w={640} /></g>, 1.0, 640, 0],
  ['39 garis batas merah + rambu', (t) => <g transform="translate(0,200)"><U.BoundarySign p={1} t={t} /></g>, 1.0, 600, 0],
  ['40 rambu jadi dokumen', () => <U.SignToDoc k={0.7} />, 1.1, 340, 0],
  ['41 jurnal PLOS ONE 2014', () => <C.JournalGlow on={1} mag={0.5} title="PLOS ONE" year="2014" />, 1.0, 440, 0],
  ['43 gear macet berasap', (t) => <U.JammedGears t={t} jam={1} />, 1.2, 420, 0],
  ['44 otak lelah + baterai merah', (t) => <U.TiredBrain t={t} />, 1.0, 520, 0],
  ['45 lensa nggak bisa fokus', (t) => <U.CameraLens t={t} />, 1.1, 480, 0],
  ['46 kertas catatan berhamburan', (t) => <U.FlyingNotes t={(t % 60)} />, 1.0, 560, 0],
  ['47 bubble kosong "..." + lawan bicara', (t) => <g><g transform="translate(40,-80)"><U.EmptyBubble p={1} t={t} /></g><Silhouette x={-140} y={330} scale={0.45} type="man" pose="talk" t={t} rim="#BFD4FF" /></g>, 1.0, 400, 0],
  ['48 awan hitam + beban di pundak', (t) => <g transform="translate(0,120)"><U.BurdenCloud k={0.6} t={t} /></g>, 1.0, 420, 0],
  ['49 pilar PD terkikis jadi pasir', (t) => <g transform="translate(0,200)"><U.PillarPD erode={0.5} t={t} /></g>, 1.0, 340, 0],
  ['50 close-up mata kosong', (t) => <U.EyeCloseup t={t} />, 1.0, 840, 0],
  ['52 penutup: 3 otak retak pecah', () => <U.ClosingBrains k={0.3} off={0} />, 1.0, 560, 0],
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
