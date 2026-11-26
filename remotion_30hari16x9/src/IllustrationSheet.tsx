// Sheet semua ilustrasi BARU video 30 hari 16:9 (semuanya dinamis; yang tercantum = gerakannya). Ikon panel = satu-satunya yang statis.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from './Stage';
import * as A from './illustrations/h30/partA';
import * as B from './illustrations/h30/partB';
import * as C from './illustrations/h30/partC';

export const ILL_W = 2400;
export const ILL_H = 3720;
type It = [string, string, (t: number) => React.ReactNode, number];  // [beat + nama, gerakan, gambar, skala sheet]
const ITEMS: It[] = [
  ['1 monitor MRI otak 3D', 'otak berputar + sinyal berkedip', (t) => <A.BrainMonitor t={t} />, 0.45],
  ['2 laci dikunci + HP 18+ baru', 'laci menutup, kunci berputar', (t) => <A.DrawerLock t={t} close={0.7} lock={0.6} />, 0.5],
  ['2 otak kecil kaget', 'gemetar + sinyal kedip cepat', (t) => <A.ShockedBrain t={t} shock={1} s={0.55} />, 1],
  ['3 jam flip 01→30', 'kartu angka berputar', (t) => <A.FlipClock t={t} p={(t % 90) / 90} />, 0.55],
  ['3 otak berubah warna', 'merah keabuan → emas, berdenyut', (t) => <A.ColorBrain t={t} p={(t % 90) / 90} s={0.7} />, 1],
  ['4 turus 3 garis menyala', 'garis dicoret & berpendar', (t) => <A.TallyMarks t={t} k={(t % 60) / 20} />, 0.7],
  ['5 angin dalam ruangan', 'garis angin + kertas terbang', (t) => <A.WindGust t={t} w={600} />, 0.45],
  ['6 siluet badan + indikator BBM', 'jarum naik lalu bergetar di FULL', (t) => <A.BodyFuelGauge t={t} up={1} />, 0.45],
  ['7 otak berisi domino', 'domino jatuh berurutan (loop)', (t) => <A.DominoBrain t={t} />, 0.7],
  ['8 bola tenis memantul', 'bola mantul tembok-tangan', (t) => <A.TennisBounce t={t} dist={280} />, 0.75],
  ['10 HP meluncur ke tangan', 'HP bergetar & meluncur', (t) => <A.PhoneSlide t={t} slide={(t % 60) / 60} dist={300} />, 0.75],
  ['11 HP terbuka kayak kotak harta', 'tutup terangkat, cahaya pink keluar', (t) => <A.TreasurePhone t={t} open={1} />, 0.55],
  ['12 lampu meja padam', 'lampu meredup', (t) => <A.DeskLamp t={t} on={0.6 + 0.4 * Math.sin(t * 0.1)} />, 0.8],
  ['12 kotak tisu kena cahaya terakhir', 'tisu bergoyang, cahaya meredup', (t) => <A.TissueLastLight t={t} light={0.8} />, 0.8],
  ['13 sinyal turun ke 0 bar', 'bar turun, tanda X berkedip', (t) => <A.SignalDrop t={t} drop={(t % 60) / 50} />, 1],
  ['13 jam dinding berputar mundur', 'jarum berputar terbalik', (t) => <A.ReverseClock t={t} />, 0.8],
  ['15 papan skor DAY 7', 'LED berjalan & kedip', (t) => <B.Scoreboard t={t} on={1} />, 0.5],
  ['16 jurnal halaman membalik', 'halaman membalik + pembatas menyala', (t) => <B.FlippingJournal t={t} />, 0.55],
  ['17 molekul testosteron 3D', 'berputar + atom berkedip', (t) => <B.TestoMolecule t={t} />, 0.5],
  ['18-19 alat uji kekuatan 145%', 'bandul melesat, bel berdenting', (t) => <B.HighStriker t={t} level={145} hit={1} />, 0.38],
  ['20 barbel balon melayang', 'melayang naik bergoyang', (t) => <B.FloatingBarbell t={t} up={0.2} />, 0.42],
  ['21 termostat dinding', 'diputar ke tengah', (t) => <B.Thermostat t={t} turn={(t % 90) / 90} />, 0.75],
  ['24 kembang api basah', 'sumbu mendesis lalu padam berasap', (t) => <B.WetFirework t={t} k={(t % 120) / 120} />, 0.7],
  ['25 papan split-flap', 'huruf berputar → "— — —"', (t) => <B.SplitFlap t={t} stop={(t % 90) / 70} />, 0.42],
  ['26 light trail kereta', 'kereta lewat, garis cahaya datar', (t) => <B.TrainTrail t={t} p={(t % 90) / 90} w={900} />, 0.32],
  ['27 otak + amigdala menyala', 'amigdala berdenyut', (t) => <B.AmygdalaBrain t={t} />, 0.75],
  ['28 mixer + slider DOPAMIN', 'equalizer memantul, slider turun', (t) => <B.DopaMixer t={t} down={(t % 90) / 90} />, 0.45],
  ['29 cipratan genangan', 'riak & cipratan', (t) => <B.SplashRipples t={t} />, 1.2],
  ['30 HP mesin slot', 'gulungan berputar, koin pink', (t) => <B.SlotPhone t={t} spin={1} />, 0.48],
  ['31 otak diinfus', 'tetesan infus, otak berayun', (t) => <B.IVBrain t={t} />, 0.48],
  ['31 HP dibuang ke tong', 'HP jatuh berputar', (t) => <B.BinDrop t={t} fall={(t % 60) / 50} />, 0.55],
  ['32 sinar matahari terbit', 'sinar berputar pelan', (t) => <C.SunRays t={t} up={1} />, 0.4],
  ['33 pintu didorong bayangan merah', 'pintu bergetar → gerendel dikunci', (t) => <C.ShadowDoor t={t} lock={(t % 90) / 90} />, 0.42],
  ['34 rambu persimpangan + otak berkaki', 'otak melangkah ke jalan terang', (t) => <C.BrainCrossroad t={t} choose={(t % 90) / 90} />, 0.32],
  ['35 jam saku + kegiatan mini', 'tutup terbuka, ikon terbang', (t) => <C.PocketWatchActivities t={t} open={1} />, 0.45],
  ['36 panah → target', 'panah terbang & menancap', (t) => <C.ArrowTarget t={t} fly={(t % 60) / 45} dist={520} />, 0.48],
  ['37 layangan bebas', 'berkibar, tangan merah memudar', (t) => <C.KiteFree t={t} fade={0.5} />, 0.42],
  ['38 maskot otak tengah tidur (baru)', 'napas naik-turun + Zzz', (t) => <C.SleepyMidbrain t={t} />, 0.62],
  ['39 mercusuar PFC', 'sinar memutar', (t) => <C.PfcLighthouse t={t} on={1} />, 0.42],
  ['40 bibit + akar, 30→66', 'tumbuh, akar memanjang, angka naik', (t) => <C.SproutRoots t={t} grow={(t % 90) / 90} />, 0.5],
  ['41 checkpoint 30', 'papan bergoyang, garis lintasan jalan', (t) => <C.Checkpoint30 t={t} />, 0.48],
  ['43 awan mimpi → centang', 'awan menguap jadi centang', (t) => <C.DreamToCheck t={t} k={(t % 90) / 70} />, 0.8],
  ['44 bendungan pintu air', 'pintu air naik, air mengalir', (t) => <C.MiniDam t={t} open={0.8} />, 0.45],
  ['45 engkol dipaksa → dicoret', 'engkol berputar lalu dicoret', (t) => <C.ForcedCrank t={t} cross={(t % 90) / 90} />, 0.55],
  ['46 neuron pohon cahaya', 'cabang tumbuh, ujung berdenyut', (t) => <C.NeuronTree t={t} grow={(t % 90) / 80} />, 0.48],
  ['47 jejak kaki bercahaya', 'jalur benar menyala satu-satu', (t) => <C.GlowFootsteps t={t} k={(t % 90) / 90} len={600} />, 0.5],
  ['48 otak-kota', 'lampu kota menyala satu-satu', (t) => <C.BrainCity t={t} on={(t % 90) / 90} />, 0.5],
  ['49 link cincin + panah naik', 'cincin berdenyut, chevron naik', (t) => <C.LinkRings t={t} />, 0.6],
];
const ICONS: Array<[string, string]> = [['phone_lock', '#FF2F6E'], ['molecule', '#22E4FF'], ['flat_circle', '#8FB8FF'], ['shield_check', '#33F07A'], ['sprout', '#FFC21F'], ['neuron', '#FF9A1F']];

export const IllustrationSheet: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={ILL_W} height={ILL_H}>
        <text x={30} y={46} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#F2EEE6">48 ilustrasi BARU (semua dinamis — gerakan di bawah tiap kotak) + 6 ikon panel neon (statis)</text>
        {ITEMS.map(([label, move, el, sc], i) => {
          const col = i % 6, row = Math.floor(i / 6), w = 380, h = 330;
          return (
            <g key={i}>
              <Stage x={20 + col * 396} y={70 + row * 420} w={w} h={h} floor={h - 30} label={label}>
                <g transform={`translate(${w / 2},${h / 2}) scale(${sc})`}>{el(t)}</g>
              </Stage>
              <text x={20 + col * 396 + w / 2} y={70 + row * 420 + h + 66} textAnchor="middle" fontFamily="Poppins" fontWeight={600} fontSize={18} fill="#8FA0B8">↻ {move}</text>
            </g>
          );
        })}
        <text x={30} y={3480} fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#F2EEE6">Ikon statis panel neon (±56 px, di kiri tulisan)</text>
        {ICONS.map(([n, c], i) => (
          <g key={n} transform={`translate(${120 + i * 380},3590)`}>
            <rect x={-80} y={-60} width={160} height={120} rx={20} fill="#0C0E14" stroke={c} strokeOpacity={0.5} strokeWidth={2} />
            <C.NeonIcon name={n} c={c} s={56} />
            <text y={100} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={20} fill="#C9CED8">{n}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
