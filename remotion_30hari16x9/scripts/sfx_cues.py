"""Jadwal SFX video "30 hari" 16:9 di FRAME KEJADIAN (frame absolut 30 fps, sinkron src/scenes/scenesA.tsx & scenesB.tsx, neonPanel.ts).
Semua file dari public/sfx30/ (disintesis baru oleh scripts/make_sfx_30.py; tidak memakai SFX lama).
Kelas: anim = animasi/ilustrasi/gerakan karakter 20% VO; trans = transisi + camera movement + panel neon ganti 15% VO.
Output: data/sfx_cues.json."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
bf = lambda i, o=0: round(B[i - 1]['start'] * 30) + o
TOT = round(106.022 * 30)
A, TR = 'anim', 'trans'
C = [  # (frame, file, kelas, durasi maks dtk / None, catatan)
 # ---------- HOOK ----------
 (0, 't30_snap', TR, None, 'B1 snap zoom ke monitor MRI'), (0, 'mri_knock', A, 1.35, 'B1 dengung MRI + ketukan magnet'),
 (bf(2), 't30_whip', TR, None, 'B2 hard cut + whip pan ke kamar'), (bf(2, 2), 'drawer_lock', A, None, 'B2 laci ditutup + kunci diputar'),
 (bf(3), 't30_snap', TR, None, 'B3 push cepat ke jam flip'), (bf(3, 2), 'flip_spin', A, None, 'B3 papan flip berputar, "tak" di 30'),
 # ---------- HARI 1-3 ----------
 (bf(4, -7), 't30_dark', TR, None, 'fade lewat gelap -> apartemen'), (bf(4), 't30_neon_swap', TR, None, 'B4 panel neon HARI 1-3 nyala'),
 (bf(4, 2), 'wall_scratch', A, None, 'B4 turus ke-1'), (bf(4, 9), 'wall_scratch', A, None, 'B4 turus ke-2'), (bf(4, 16), 'wall_scratch', A, None, 'B4 turus ke-3'),
 (bf(5, 0), 'wind_room', A, None, 'B5 angin menderu + kertas terbang'),
 (bf(6, 0), 't30_air', TR, 0.8, 'B6 zoom ke indikator'), (bf(6, 6), 'gauge_click', A, None, 'B6 jarum naik ke FULL + klik'),
 (bf(7, 4), 'dominoes', A, None, 'B7 domino jatuh berurutan'),
 (320, 'ball_bounce', A, None, 'B8 bola tenis memantul'),
 (bf(9, 0), 't30_air', TR, 0.8, 'B9 tilt ke jendela'), (bf(9, 2), 'far_switches', A, None, 'B9 lampu tetangga mati satu-satu'),
 (bf(10, 0), 'phone_buzz_slide', A, None, 'B10 HP getar & meluncur'),
 (bf(11, 4), 'box_hinge_hum', A, None, 'B11 HP terbuka kayak kotak harta'),
 (bf(12, 0), 'curtain_lamp', A, None, 'B12 tirai ditarik + lampu meja padam'),
 (bf(13, 2), 'tick_reverse_breath', A, None, 'B13 jam mundur + napas gelisah'),
 (bf(14, 0), 'pacing_heart', A, None, 'B14 mondar-mandir + detak jantung'),
 # ---------- HARI KE-7 ----------
 (bf(15, -6), 't30_whip', TR, None, 'whip pan -> gym'), (bf(15), 't30_neon_swap', TR, None, 'B15 panel HARI KE-7'),
 (bf(15, 6), 'scoreboard_flip', A, None, 'B15 papan skor DAY 7'),
 (bf(16, 4), 'pages_flip', A, None, 'B16 halaman jurnal dibalik'),
 (bf(17, 4), 'metal_ding', A, None, 'B17 molekul testosteron menyala'),
 (bf(18, 0), 't30_air', TR, 0.8, 'B18 tilt naik ikut bandul'), (bf(18, 6), 'striker_bell', A, None, 'B18 palu + bandul + bel 145%'),
 (bf(19, 4), 'puck_slide', A, None, 'B19 bandul turun ke 100%'),
 (bf(20, 0), 't30_air', TR, 0.9, 'B20 pull-out'), (bf(20, 30), 'balloon_laugh', A, None, 'B20 barbel balon melayang + tawa teredam'),
 (bf(21, 10), 'dial_clicks', A, None, 'B21 termostat diputar'),
 # ---------- HARI KE-14 ----------
 (bf(22, -8), 't30_dark', TR, None, 'fade lewat gelap -> peron'), (bf(22), 't30_neon_swap', TR, None, 'B22 panel HARI KE-14'),
 (bf(22, 4), 'rain_platform', A, None, 'B22 hujan di peron'),
 (bf(23, 4), 'umbrella_sigh', A, None, 'B23 payung ditutup + helaan napas'),
 (bf(24, 2), 'fizzle', A, None, 'B24 sumbu kembang api basah padam'),
 (bf(25, 4), 'splitflap', A, None, 'B25 papan split-flap berputar'),
 (bf(26, 0), 't30_air', TR, 0.9, 'B26 pan ikut kereta'), (bf(26, 4), 'train_pass', A, None, 'B26 kereta lewat'),
 (bf(27, 2), 'soft_hum', A, None, 'B27 amigdala menyala'),
 (bf(28, 20), 'fader_slide', A, None, 'B28 slider DOPAMIN turun'),
 (bf(29, 2), 'puddle_taps', A, None, 'B29 ketukan kaki di genangan'),
 (bf(30, 4), 'slot_coins', A, None, 'B30 mesin slot + koin'),
 (bf(31, 0), 'drip_bin', A, None, 'B31 tetesan infus + HP jatuh ke tong'),
 # ---------- HARI 21-30 ----------
 (bf(32, -7), 't30_light', TR, None, 'light reveal -> taman pagi'), (bf(32), 't30_neon_swap', TR, None, 'B32 panel HARI 21-30'),
 (bf(32, 4), 'dawn_birds', A, None, 'B32 burung pagi'),
 (bf(33, 2), 'door_bolt', A, None, 'B33 pintu didorong + gerendel dikunci'),
 (bf(34, 6), 'sign_steps2', A, None, 'B34 otak berkaki melangkah + rambu berderit'),
 (bf(35, 6), 'watch_flutter', A, None, 'B35 jam saku dibuka + kegiatan terbang'),
 (bf(36, 0), 'bow_arrow', A, None, 'B36 busur ditarik, panah menancap'), (bf(36, 12), 't30_air', TR, 0.8, 'B36 pan ikut panah'),
 (bf(37, 0), 't30_air', TR, 0.8, 'B37 tilt ke layangan'), (bf(37, 2), 'kite_flutter', A, None, 'B37 layangan berkibar'),
 (bf(38, 2), 'cute_snore', A, None, 'B38 maskot otak tengah mendengkur'),
 (bf(39, 4), 'lighthouse_on', A, None, 'B39 mercusuar PFC menyala'),
 # ---------- BUTUH 66 HARI ----------
 (bf(40, -6), 't30_whip', TR, None, 'whip pan -> stadion'), (bf(40), 't30_neon_swap', TR, None, 'B40 panel BUTUH 66 HARI'),
 (bf(40, 14), 'soil_sprout', A, None, 'B40 tanah bergeser + tunas tumbuh'),
 (bf(41, 0), 'run_whistle', A, None, 'B41 lari + peluit kecil'), (bf(41, 4), 't30_air', TR, 0.9, 'B41 pan panjang lintasan'),
 (bf(42, 0), 'baton_catch', A, None, 'B42 tongkat estafet ditangkap'),
 (bf(43, -7), 't30_dissolve', TR, None, 'blur dissolve -> kamar subuh'), (bf(43, 2), 'alarm_blanket', A, None, 'B43 alarm lembut + selimut'),
 (bf(44, 18), 'dam_water', A, None, 'B44 pintu air terbuka, air mengalir'),
 (bf(45, 2), 'crank_scribble', A, None, 'B45 engkol dipaksa lalu dicoret'),
 # ---------- NEUROPLASTICITY ----------
 (bf(46, -8), 't30_dark', TR, None, 'fade lewat gelap -> panggung'), (bf(46), 't30_neon_swap', TR, None, 'B46 panel NEUROPLASTICITY'),
 (bf(46, 4), 'branch_grow', A, None, 'B46 neuron tumbuh bercabang'),
 (bf(47, 0), 't30_air', TR, 0.8, 'B47 pan ikut jejak'), (bf(47, 4), 'step_ting', A, None, 'B47 jejak kaki menyala'),
 (bf(48, 10), 'city_switches', A, None, 'B48 lampu otak-kota menyala'),
 (bf(49, 4), 'link_click2', A, None, 'B49 klik link'),
 (bf(50, 0), 'warm_swell2', A, None, 'B50 spotlight + partikel amber'), (bf(50, 2), 't30_air', TR, 0.9, 'B50 pull-out pelan'),
 # ---------- PENUTUP ----------
 (TOT - 30, 't30_charge_full', TR, None, 'B51 baterai 100%, logo charge berkedip'),
]
cues = [{'frame': f, 'file': fi, 'cls': c, 'dur': d, 'note': n} for f, fi, c, d, n in sorted(C, key=lambda x: x[0])]
for c in cues:
    assert os.path.exists(os.path.join(ROOT, 'public/sfx30', c['file'] + '.wav')), c['file']
json.dump({'cues': cues}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), ensure_ascii=False, indent=0)
print(len(cues), 'cue,', len({c['file'] for c in cues}), 'file SFX baru')
