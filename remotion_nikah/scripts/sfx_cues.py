"""Jadwal SFX video "otak bodoh" di FRAME KEJADIAN (frame absolut 30 fps, sinkron src/scenes/*.tsx & neonPanel.ts).
Semua file dari public/sfx_ob/ (disintesis baru oleh scripts/make_sfx_ob.py, tanpa SFX lama).
Kelas: anim = animasi/ilustrasi/gerakan karakter 20% VO; trans = transisi + camera movement + panel neon ganti 15% VO.
Output: data/sfx_cues.json."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
bf = lambda i, o=0: round(B[i - 1]['start'] * 30) + o
VO_F, TOT = round(128.1 * 30), round(129.497 * 30)
A, TR = 'anim', 'trans'
C = [  # (frame, file, kelas, durasi maks dtk / None, catatan)
 # ---------- HOOK (quick cut) ----------
 (0, 'tr_snap_zoom', TR, None, 'B1 snap zoom ke kertas ujian'), (0, 'paper_slide', A, None, 'B1 kertas ujian masuk'), (8, 'stamp_paper', A, None, 'B1 cap nilai 0 menghantam kertas'),
 (bf(2), 'tr_whip', TR, None, 'B2 hard cut + whip cepat ke HP'), (bf(2, 8), 'phone_ping', A, None, 'B2 notifikasi HP 18+'), (bf(2, 16), 'screen_tap', A, None, 'B2 tap layar'),
 (bf(3), 'tr_snap_zoom', TR, None, 'B3 snap zoom ke gagang pintu'), (bf(3, 3), 'key_lock', A, None, 'B3 kunci diputar, klik terkunci'),
 (bf(4), 'tr_push', TR, None, 'B4 push cepat + shake'), (bf(4, 2), 'chain_clank', A, None, 'B4 rantai berderak'),
 # ---------- ONE SHOT ----------
 (bf(5), 'tr_dark_fade', TR, 0.6, 'B5 fade singkat ke ruang kosong'), (bf(5, 4), 'room_hum', A, 3.0, 'B5 dengung ruangan pelan'),
 (bf(5, 14), 'light_switch', A, None, 'B5 saklar pintu 1 (kuning)'), (bf(5, 36), 'light_switch', A, None, 'B5 saklar pintu 2 (oranye)'),
 (bf(5, 58), 'light_switch', A, None, 'B5 saklar pintu 3 (merah)'), (bf(5, 40), 'tr_air_rise', TR, None, 'B5 slow zoom masuk pintu 1'),
 # ---------- FASE 1 ----------
 (bf(6, -8), 'tr_door_light', TR, None, 'tembus pintu 1 -> cahaya kuning -> perpustakaan'), (bf(6), 'neon_on', TR, None, 'B6 panel neon FASE 1 nyala (flicker 3x)'),
 (bf(7, 28), 'cable_plug', A, None, 'B7 kabel merah menancap di dahi'), (bf(7, 34), 'hum_down', A, None, 'B7 dengung energi turun'),
 (bf(7, 56), 'tr_push', TR, None, 'B7 zoom ke dahi'),
 (bf(8, 10), 'bulb_flicker', A, None, 'B8 PFC meredup kayak lampu mau mati'),
 (bf(9, 0), 'tr_air_rise', TR, 0.8, 'B9 tilt ke mesin'), (bf(9, 4), 'gears_soft', A, None, 'B9 gear emas berputar'),
 (bf(10, 4), 'pencil_scratch', A, None, 'B10 pensil menggores (benang -> jaringan)'),
 (bf(11, 10), 'chess_knock', A, None, 'B11 bidak kuda diletakkan'),
 (bf(12, 4), 'chalk_board', A, None, 'B12 kapur di papan tulis'),
 (bf(13, 2), 'map_unfold', A, None, 'B13 peta dibentangkan'),
 (bf(14, 18), 'brake_stomp', A, None, 'B14 pedal rem dihentak'),
 (bf(15, 4), 'wheel_squeak', A, None, 'B15 roda hamster berderit'),
 (bf(16, 0), 'tr_air_fall', TR, 0.9, 'B16 tilt turun'), (bf(16, 2), 'engine_slow', A, None, 'B16 mesin melambat + gear macet'),
 # ---------- PMO SAVIOR ----------
 (bf(17, -9), 'tr_dark_fade', TR, None, 'fade lewat gelap -> panggung'), (bf(17, -6), 'neon_off', TR, None, 'panel FASE 1 flicker mati'),
 (bf(17), 'neon_on', TR, None, 'B17 panel PMO SAVIOR nyala'), (bf(17, 10), 'link_click', A, None, 'B17 klik ikon link'),
 (bf(18, 2), 'book_open', A, None, 'B18 buku panduan dibuka + halaman'),
 (bf(19, 24), 'crystal_mend', A, None, 'B19 retakan menyatu lembut'),
 (bf(20, 0), 'switch_off', A, None, 'B20 lampu panggung redup'), (bf(20, 62), 'door_creak', A, None, 'B20 pintu 2 berderit terbuka'),
 (bf(20, 60), 'tr_air_rise', TR, None, 'B20 zoom ke pintu 2'),
 # ---------- FASE 2 ----------
 (bf(21, -8), 'tr_door_light', TR, None, 'tembus pintu 2 -> cahaya oranye -> hutan'), (bf(21, -6), 'neon_off', TR, None, 'panel PMO SAVIOR mati'),
 (bf(21), 'neon_on', TR, None, 'B21 panel FASE 2 nyala'), (bf(21, 4), 'night_owl', A, None, 'B21 burung malam'),
 (bf(22, 0), 'leaf_steps', A, None, 'B22 maskot melangkah di daun kering'),
 (bf(23, 2), 'lizard_monkey', A, None, 'B23 desis kadal + monyet'),
 (bf(24, 4), 'twig_fire', A, None, 'B24 ranting dipatahkan + api unggun'),
 (bf(25, 1), 'chew', A, None, 'B25 kunyah paha ayam'),
 (bf(26, 2), 'chicks', A, None, 'B26 kicau anak burung'),
 (bf(27, 20), 'scratch_hmm', A, None, 'B27 garuk kepala + hmm'),
 (bf(28, 8), 'screen_tap', A, None, 'B28 tap layar'), (bf(28, 52), 'screen_tap', A, None, 'B28 tap layar lagi'),
 (bf(29, 0), 'tr_air_rise', TR, 0.9, 'B29 orbit pelan'), (bf(29, 30), 'cardboard_boing', A, None, 'B29 ternyata kardus tipis'),
 (bf(30, 4), 'camera_shutter', A, None, 'B30 shutter + kertas jurnal'),
 (bf(31, 4), 'clock_fast', A, None, 'B31 jam tik-tok dipercepat'),
 (bf(32, 4), 'giant_step', A, None, 'B32 langkah raksasa maskot'), (bf(32, 12), 'tr_push', TR, None, 'B32 zoom out lalu in'),
 (bf(33, 18), 'wheel_grab', A, None, 'B33 setir direbut paksa'),
 # ---------- FASE 3 ----------
 (bf(34, -8), 'tr_door_light', TR, None, 'tembus pintu 3 -> cahaya merah -> jalan kota'), (bf(34, -6), 'neon_off', TR, None, 'panel FASE 2 mati'),
 (bf(34), 'neon_on', TR, None, 'B34 panel FASE 3 nyala'), (bf(34, 6), 'car_wet', A, None, 'B34 mobil lewat di jalan basah'),
 (bf(35, 16), 'crown_ding', A, None, 'B35 mahkota dipasang'),
 (bf(36, 6), 'balloon_deflate', A, None, 'B36 PFC menyusut (balon mengempis)'),
 (bf(37, 14), 'switches_snap', A, None, 'B37 lampu panel mati berurutan + pedal patah'),
 (bf(38, 0), 'red_torrent', A, None, 'B38 arus air deras'), (bf(38, 0), 'tr_air_rise', TR, 0.8, 'B38 pan mengikuti arus'),
 (bf(39, 14), 'rope_rewind', A, None, 'B39 tali ditarik + rewind 1'), (bf(39, 50), 'rope_rewind', A, None, 'B39 rewind 2'), (bf(39, 84), 'rope_rewind', A, None, 'B39 rewind 3'),
 (bf(40, 8), 'match_hiss', A, None, 'B40 korek api + desis'),
 (bf(41, 52), 'scale_fall', A, None, 'B41 timbangan patah jatuh'),
 (bf(42, 0), 'lamp_buzz', A, None, 'B42 lampu jalan berdengung/berkedip'),
 (bf(43, 4), 'dull_knife', A, None, 'B43 pisau tumpul digesek'),
 (bf(44, 0), 'papers_fly', A, None, 'B44 kertas beterbangan'),
 (bf(45, 30), 'paper_collapse', A, None, 'B45 kertas sobek + tumpukan ambruk'),
 # ---------- HANCURNYA MASA DEPAN ----------
 (bf(46, -9), 'tr_dark_fade', TR, None, 'fade lewat gelap -> kantor'), (bf(46, -6), 'neon_off', TR, None, 'panel FASE 3 mati'),
 (bf(46), 'neon_broken', TR, None, 'B46 panel HANCURNYA MASA DEPAN nyala (rusak)'),
 (bf(47, 28), 'book_slam', A, None, 'B47 buku teori ditutup keras'),
 (bf(48, 14), 'marker_down', A, None, 'B48 spidol menggaris turun'),
 (bf(49, 4), 'awkward_tick', A, None, 'B49 hening canggung + tik-tok'),
 (bf(50, 0), 'tr_push', TR, None, 'B50 extreme zoom ke mata'), (bf(50, 4), 'office_hum', A, 1.5, 'B50 dengung ruangan'),
 (bf(51, 4), 'files_pen', A, None, 'B51 berkas ditumpuk + pulpen nyoret'),
 (bf(52, 2), 'lens_turn', A, None, 'B52 ring lensa diputar'),
 (bf(53, 4), 'rusty_gear', A, None, 'B53 gear berkarat berderit'),
 (bf(54, -7), 'tr_dissolve', TR, None, 'dissolve -> jalan ke cakrawala'), (bf(54, 44), 'sign_steps', A, None, 'B54 rambu berdecit + langkah'),
 (bf(55, 2), 'sand_flow', A, None, 'B55 pasir mengalir'),
 (bf(56, 30), 'candle_out', A, None, 'B56 lilin POTENSI padam'),
 (bf(57, 0), 'treadmill_steps', A, None, 'B57 treadmill + langkah'), (bf(57, 0), 'tr_air_fall', TR, None, 'B57 pull-out ke wide'),
 # ---------- PENUTUP ----------
 (VO_F + 14, 'neon_off', TR, None, 'B58 panel neon flicker terakhir lalu mati'),
]
cues = [{'frame': f, 'file': fi, 'cls': c, 'dur': d, 'note': n} for f, fi, c, d, n in sorted(C, key=lambda x: x[0])]
for c in cues:
    assert os.path.exists(os.path.join(ROOT, 'public/sfx_ob', c['file'] + '.wav')), c['file']
json.dump({'cues': cues}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), ensure_ascii=False, indent=0)
print(len(cues), 'cue,', len({c['file'] for c in cues}), 'file SFX baru')
