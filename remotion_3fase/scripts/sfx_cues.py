"""Jadwal SFX video 3 fase di FRAME KEJADIAN animasinya (frame absolut 30 fps, sinkron dengan src/scenes/*.tsx).
kelas: imp = SFX penting ⭐ (maks 20% VO), ill = ilustrasi/gerak karakter (15%), trans = transisi/kamera (10%).
Output: data/sfx_cues.json, preview/sfx_map.txt (draf), preview/sfx_missing.txt."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
bf = lambda i, o=0: round(B[i - 1]['start'] * 30) + o
C = [  # (frame, file, kelas, durasi maks dtk / None, catatan)
 # HOOK
 (bf(1, 4), 'camera_shutter', 'imp', None, 'B1 ⭐ blitz foto pertama'), (bf(1, 22), 'camera_shutter', 'imp', None, 'B1 ⭐ blitz foto kedua'),
 (bf(2, 2), 'cam_whoosh', 'trans', None, 'B2 snap zoom ke HP di saku'), (bf(2, 22), 'crack_soft', 'imp', None, 'B2 ⭐ foto nikah retak'),
 (bf(2, 24), 'bass_hit', 'imp', 1.6, 'B2 ⭐ dentuman bass rendah, lampu resepsi meredup'),
 # ONE SHOT
 (bf(3, 14), 'tissue_pull', 'ill', None, 'B3 tisu ditarik dari kotak'), (bf(3, 26), 'ting_short', 'ill', None, 'B3 piala ironis "ting"'),
 (bf(4, 14), 'crack_soft', 'imp', None, 'B4 ⭐ retakan 1'), (bf(4, 28), 'crack_soft', 'imp', None, 'B4 ⭐ retakan 2'), (bf(4, 42), 'crack_soft', 'imp', None, 'B4 ⭐ retakan 3'),
 (bf(5, 0), 'whistle', 'ill', 1.4, 'B5 siulan cuek'), (bf(5, 10), 'crack_creep', 'ill', None, 'B5 retakan merayap melebar'),
 (bf(6, -8), 'light_sweep_air', 'trans', None, 'tembus retakan 1 -> light sweep ke Fase 1'),
 # FASE 1
 (bf(6, 6), 'stamp_thud', 'ill', None, 'B6 label chip FASE 1 masuk (stempel)'),
 (bf(7, 16), 'steering_grip', 'imp', None, 'B7 setir REWARD diputar paksa'), (bf(7, 48), 'lock_click', 'ill', None, 'B7 kunci (dibajak)'),
 (bf(8, 0), 'clock_tick', 'ill', 1.6, 'B8 jam tik-tok'), (bf(8, 2), 'crickets', 'trans', 2.0, 'B8 jangkrik malam'),
 (bf(9, 4), 'water_bubbles', 'ill', 1.8, 'B9 banjir partikel pink (gelembung)'),
 (bf(10, 20), 'rusty_clank', 'imp', None, 'B10 reseptor berkarat berdentang tumpul'),
 (bf(11, 8), 'blanket_rustle', 'ill', 1.4, 'B11 kamar luntur (kain digosok lembut)'),
 (bf(12, 0), 'yawn', 'ill', 1.0, 'B12 menguap'), (bf(12, 6), 'paper_rustle', 'ill', None, 'B12 berkas jatuh'),
 (bf(13, 2), 'cloth_drop', 'ill', None, 'B13 kain sajadah'), (bf(13, 4), 'wind_soft', 'trans', 1.2, 'B13 angin pelan (hampa)'),
 (bf(14, 0), 'footsteps_short', 'ill', None, 'B14 langkah istri masuk'), (bf(14, 18), 'cup_tray', 'ill', None, 'B14 cangkir di nampan'),
 (bf(15, 18), 'scale_clank', 'imp', None, 'B15 timbangan berdentang miring ke HP'),
 (bf(16, 4), 'water_pour', 'ill', 2.0, 'B16 air dituang ke gelas bocor'),
 (bf(17, 8), 'footsteps_walk', 'ill', 2.0, 'B17 langkah di tangga'), (bf(17, 40), 'gauge_rise', 'ill', None, 'B17 jarum gauge naik ke merah'),
 # MID-CTA
 (bf(18, 6), 'chime_soft', 'imp', None, 'B18 ting lembut, otak amber menyala'), (bf(18, 10), 'warm_swell', 'ill', None, 'B18 swell hangat'),
 (bf(19, 44), 'click_sharp', 'imp', 0.35, 'B19 colokan saraf tersambung (klik)'), (bf(19, 46), 'neon_hum', 'ill', 1.4, 'B19 dengung lembut sirkuit menyala'),
 (bf(20, 22), 'click_sharp', 'imp', 0.35, 'B20 klik ikon link'),
 (bf(21, 2), 'light_switch', 'imp', None, 'B21 ⭐ saklar: lampu amber mati'), (bf(21, 10), 'siren_soft', 'imp', 3.0, 'B21 ⭐ sirene pelan (bukan laser)'),
 # FASE 2
 (bf(22, -5), 'whoosh_fast', 'trans', None, 'whip slide ke kantor'), (bf(22, 6), 'stamp_thud', 'ill', None, 'B22 label chip FASE 2'),
 (bf(23, 12), 'wood_gnaw', 'imp', 2.0, 'B23 PFC digerogoti rayap (kayu digerogoti)'),
 (bf(24, 20), 'knob_click', 'ill', None, 'B24 tombol mati 1'), (bf(24, 40), 'knob_click', 'ill', None, 'B24 tombol mati 2'), (bf(24, 60), 'knob_click', 'ill', None, 'B24 tombol mati 3'),
 (bf(25, 14), 'brake_snap', 'imp', None, 'B25 ⭐ pedal rem patah (snap logam)'),
 (bf(26, 20), 'rope_snap', 'imp', None, 'B26 tali tekad putus'),
 (bf(27, 4), 'match_strike', 'imp', None, 'B27 korek api dinyalakan'),
 (bf(28, 16), 'desk_slam', 'imp', None, 'B28 ⭐ meja digebrak'),
 (bf(29, 6), 'dice_roll', 'ill', None, 'B29 dadu bergulir di atas berkas'),
 (bf(30, 2), 'compass_spin', 'ill', None, 'B30 kompas berputar liar'),
 (bf(31, 8), 'stamp_thud', 'imp', None, 'B31 ⭐ stempel "bukan masalah"'), (bf(31, 20), 'fire_crackle', 'imp', 3.0, 'B31 ⭐ api berkobar pelan di meja'),
 # RISET
 (bf(32, 4), 'camera_shutter', 'imp', None, 'B32 ⭐ shutter: jurnal JAMA'), (bf(32, 10), 'paper_unfold', 'ill', None, 'B32 kertas jurnal'),
 (bf(33, 8), 'clock_tick', 'ill', 1.6, 'B33 jam bertumpuk (tik-tok)'), (bf(33, 50), 'chalk_fast', 'ill', None, 'B33 grafik batang (kapur)'),
 (bf(34, 10), 'deflate', 'imp', None, 'B34 ⭐ striatum mengecil (balon mengempis pelan)'),
 (bf(35, 12), 'chalk_down', 'ill', None, 'B35 panah eskalasi di papan (kapur)'),
 (bf(36, 2), 'treadmill_run', 'ill', 1.9, 'B36 treadmill + langkah lari'),
 # FASE 3
 (bf(37, -6), 'light_sweep_air', 'trans', None, 'light sweep ke ruang tamu'), (bf(37, 6), 'stamp_thud', 'ill', None, 'B37 label chip FASE 3'),
 (bf(38, 24), 'thread_snap', 'imp', None, 'B38 benang merah putus'),
 (bf(39, 8), 'remote_click', 'ill', None, 'B39 klik remote / tombol OK'), (bf(39, 38), 'remote_click', 'ill', None, 'B39 klik OK lagi'),
 (bf(40, 2), 'swipe_fast', 'ill', 1.6, 'B40 swipe cepat berulang'),
 (bf(41, 14), 'ice_freeze', 'imp', None, 'B41 ⭐ es membeku di dada'),
 (bf(42, 6), 'blanket_rustle', 'ill', 1.0, 'B42 gesekan kain saat dipeluk'),
 (bf(43, 2), 'yawn', 'ill', 1.0, 'B43 menguap'), (bf(43, 30), 'pop_soft', 'ill', None, 'B43 bubble cerita jatuh'),
 (bf(44, 4), 'clock_tick', 'ill', 2.4, 'B44 tik-tok jam dinding (rutinitas)'),
 (bf(45, 14), 'camera_shutter', 'imp', None, 'B45 shutter viewfinder -> manekin'),
 (bf(46, 30), 'crack_soft', 'imp', None, 'B46 hati istri retak lembut'),
 (bf(47, 8), 'phone_notification_soft', 'ill', None, 'B47 notifikasi HP'),
 (bf(48, 2), 'heavy_breath', 'ill', 1.0, 'B48 dengusan napas kesal'),
 (bf(49, 4), 'desk_slam', 'imp', None, 'B49 ⭐ meja digebrak'), (bf(49, 6), 'muffled_shout', 'imp', 1.0, 'B49 ⭐ bentakan teredam (tanpa kata)'),
 (bf(50, -10), 'door_creak', 'imp', None, 'B50 pintu berderit (kamar pasangan)'), (bf(50, 14), 'heartbeat', 'ill', 4.5, 'B50 detak jantung pelan'),
 (bf(51, 30), 'frame_fall', 'imp', None, 'B51 ⭐ bingkai foto jatuh'), (bf(51, 42), 'glass_shatter', 'imp', None, 'B51 ⭐ kaca foto pecah'),
 (bf(52, 2), 'muffled_shout', 'imp', 0.9, 'B52 bentakan teredam'),
 (bf(53, 6), 'plate_break', 'imp', None, 'B53 piring pecah'),
 (bf(54, 15), 'phone_notification_soft', 'imp', None, 'B54 ⭐ hening 5 frame lalu notifikasi HP'),
 (bf(55, 8), 'stone_grind', 'imp', 1.6, 'B55 hati mengeras jadi batu'), (bf(55, 30), 'heavy_breath', 'ill', 1.4, 'B55 napas berat'),
]
MISSING_DESC = {
 'tissue_pull': 'tisu ditarik dari kotak (kertas tipis sret)', 'crack_creep': 'retakan merayap pelan (kerikil/kaca halus berderak)',
 'rusty_clank': 'logam berkarat berdentang tumpul', 'cup_tray': 'cangkir keramik diletakkan di nampan', 'scale_clank': 'timbangan kuningan berdentang/miring',
 'water_pour': 'air dituang ke gelas', 'siren_soft': 'sirene pelan jauh (bukan laser)', 'wood_gnaw': 'kayu digerogoti (rayap/krek-krek halus)',
 'match_strike': 'korek api digesek & menyala', 'desk_slam': 'telapak tangan menggebrak meja kayu', 'dice_roll': 'dadu bergulir di atas kertas/meja',
 'compass_spin': 'jarum kompas berputar (tik-tik logam halus)', 'fire_crackle': 'api berkobar pelan (kertas terbakar)', 'thread_snap': 'benang putus (tik tipis)',
 'remote_click': 'klik tombol remote plastik', 'swipe_fast': 'jempol swipe layar cepat berulang', 'muffled_shout': 'bentakan teredam di balik dinding (tanpa kata)',
 'door_creak': 'pintu kayu berderit pelan', 'frame_fall': 'bingkai foto jatuh dari dinding (kayu + dentum)', 'glass_shatter': 'kaca bingkai pecah di lantai',
 'plate_break': 'piring keramik pecah', 'stone_grind': 'batu mengeras/bergesek (gerinda batu pelan)',
}
FALLBACK = {'tissue_pull': 'paper_rustle', 'crack_creep': 'crack_soft', 'rusty_clank': 'dumbbell_set_down', 'cup_tray': 'glass_clink', 'scale_clank': 'chess_tap',
 'water_pour': 'water_flow', 'siren_soft': '-', 'wood_gnaw': 'pencil_write', 'match_strike': '-', 'desk_slam': 'thud', 'dice_roll': 'chess_tap',
 'compass_spin': 'clock_fast', 'fire_crackle': '-', 'thread_snap': 'ribbon_snap', 'remote_click': 'knob_click', 'swipe_fast': 'screen_scroll',
 'muffled_shout': '-', 'door_creak': 'door_open', 'frame_fall': 'thud', 'glass_shatter': 'imp_glass_crack (desain sinematik, kurang natural)',
 'plate_break': '-', 'stone_grind': 'stone_rumble'}
have = set(x[:-4] for x in os.listdir(os.path.join(ROOT, 'public/sfx')))
cues = [{'frame': f, 'file': n, 'cls': c, 'dur': d, 'note': nt} for f, n, c, d, nt in sorted(C)]
json.dump({'fps': 30, 'cues': cues}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), indent=1, ensure_ascii=False)
with open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w') as o:
    o.write('# SFX map (draf) | frame | detik | file | kelas | status | catatan\n')
    for c in cues:
        o.write(f"{c['frame']:5d} | {c['frame']/30:7.2f}s | {c['file'] + '.wav':26s} | {c['cls']:5s} | {'OK' if c['file'] in have else 'MISSING':7s} | {c['note']}\n")
miss = sorted({c['file'] for c in cues if c['file'] not in have})
with open(os.path.join(ROOT, 'preview/sfx_missing.txt'), 'w') as o:
    o.write('# SFX yang belum ada filenya di public/sfx (perlu file foley dari lo, atau gua sintesis kalau lo izinkan)\n# file | bunyi | frame | fallback file lama\n')
    for n in miss:
        fr = ', '.join(str(c['frame']) for c in cues if c['file'] == n)
        o.write(f"{n + '.wav':20s} | {MISSING_DESC[n]} | frame {fr} | {FALLBACK[n]}\n")
print(len(cues), 'cue,', len(miss), 'file belum ada'); print(open(os.path.join(ROOT, 'preview/sfx_missing.txt')).read())
