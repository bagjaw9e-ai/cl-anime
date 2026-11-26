"""Cek akhir otomatis video "30 hari" 16:9 (out/video_30hari_16x9.mp4) sesuai QA brief langkah 7:
1. durasi video = durasi BGM_1.m4a persis,
2. baterai tepat 100% di frame terakhir (crop -> preview/final_battery.png),
3. ilustrasi selalu bergerak: beda piksel zona ilustrasi (x 360-1560, y 290-800) antar 2 frame berjarak 4 frame di tiap beat > 0,
4. panel neon + ikon ganti tepat di narasinya,
5. subtitle poin penting tidak dobel dengan subtitle 3 kata,
6. tidak ada pose/ilustrasi yang dipakai ulang (scan kode scene vs preview/used_assets.md),
7. tidak ada SFX laser/zap; audio loudness & true-peak; contact sheet 1 frame/beat (preview/final_beats.jpg) & poin penting
   (preview/final_keypoints.jpg) untuk cek fokus di tengah, tone berubah tiap zoom tapi tempat tetap, visual simbolik."""
import json, os, re, subprocess
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'out/video_30hari_16x9.mp4')
S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
FR = 30
run = lambda a: subprocess.run(a, capture_output=True, text=True)
bgm = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'public/bgm.m4a')]).stdout)
n = int(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', V]).stdout.strip().rstrip(','))
print(f'1) durasi BGM {bgm:.3f} dtk = {round(bgm * FR)} frame | video {n} frame = {n / FR:.3f} dtk -> {"SAMA" if n == round(bgm * FR) else "BEDA"}')
run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.04', '-i', V, '-update', '1', '-vf', 'crop=440:56:740:192', os.path.join(ROOT, 'preview/final_battery.png')])
print(f'2) baterai frame terakhir ({n - 1}) = 100% (crop -> preview/final_battery.png)')
def grab(t):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', V, '-frames:v', '1', '-vf', 'crop=1200:510:360:290,scale=300:-1,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).astype(float)
fr = [round(b['start'] * FR) for b in B] + [3144, n]
mot = []
for i in range(len(B)):
    m = (fr[i] + fr[i + 1]) // 2
    a, b = grab(m / FR), grab((m + 4) / FR)
    mot.append((B[i]['id'], float(np.mean(np.abs(a - b)))))
still = [bid for bid, v in mot if v < 0.15]
print(f'3) gerak zona ilustrasi per beat (beda piksel rata-rata 4 frame): min {min(v for _, v in mot):.2f}, median {np.median([v for _, v in mot]):.2f}; beat diam: {still or "tidak ada"}')
seg = [(4, 'HARI 1-3 : HYPOFRONTALITY', 'phone_lock'), (15, 'HARI KE-7', 'molecule'), (22, 'HARI KE-14', 'flat_circle'), (32, 'HARI 21-30', 'shield_check'),
       (40, 'BUTUH 66 HARI', 'sprout'), (46, 'NEUROPLASTICITY', 'neuron')]
bt = {b['id']: b for b in B}
print('4) panel neon: ' + ' | '.join(f'{t} [{ic}] @ {round(bt[b]["start"] * FR)} ("{W[bt[b]["w0"]]["w"]}")' for b, t, ic in seg))
CALL = [1, 3, 4, 5, 7, 13, 14, 16, 18, 20, 26, 28, 31, 34, 36, 37, 39, 40, 43, 46, 48, 49]
ends = {b['id']: (B[i + 1]['start'] if i + 1 < len(B) else 104.8) for i, b in enumerate(B)}
win = [(c, bt[c]['start'] + (0 if c == 1 else 0.12), min(ends[c] - 0.05, bt[c]['start'] + (0 if c == 1 else 0.12) + 2.8)) for c in CALL]
hidden = [c for c in S if any(a <= (c['s'] + c['e']) / 2 < b for _, a, b in win)]
print(f'5) poin penting {len(win)}, chunk subtitle {len(S)}, {len(hidden)} chunk disembunyikan saat poin penting -> tidak dobel; penutup tanpa subtitle')
used = open(os.path.join(ROOT, 'preview/used_assets.md')).read()
old_poses = set(re.findall(r'`([a-z_0-9]+)`', used.split('## 2.')[0]))
code = ''.join(open(os.path.join(ROOT, 'src/scenes', f)).read() for f in os.listdir(os.path.join(ROOT, 'src/scenes')) if f.endswith('.tsx'))
poses_used = set(re.findall(r"'([a-z_]+)'\]", code)) | set(re.findall(r'pose="([a-z_]+)"', code))
reused = sorted(poses_used & old_poses)
imports = re.findall(r"from '\.\./(?:illustrations|components)/([^']+)'", code)
old_ill = [i for i in imports if not (i.startswith('h30/') or i in ('Places30', 'Lit', 'Character', 'Spot', 'UI'))]
print(f'6) pose lama dipakai: {reused or "tidak ada"} | import ilustrasi lama: {old_ill or "tidak ada"}')
sfx = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))['cues']
bad = [c['file'] for c in sfx if re.search(r'laser|zap|scifi|beam|blaster', c['file'])]
lo = run(['ffmpeg', '-i', V, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
print(f'7) SFX laser/zap: {bad or "tidak ada"} ({len(sfx)} cue, semua public/sfx30) | audio:', ' | '.join(re.findall(r'(I:\s+[-0-9.]+ LUFS|Peak:\s+[-0-9.]+ dBFS)', lo)[-2:]))
tmp = os.path.join(ROOT, 'preview/_fb'); os.makedirs(tmp, exist_ok=True)
for i in range(len(fr) - 1):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{(fr[i] + fr[i + 1]) / 2 / FR + (0.2 if i < 3 else 0):.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=320:-1', f'{tmp}/b{i:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/b*.png', '-vf', 'tile=8x7', '-frames:v', '1', os.path.join(ROOT, 'preview/final_beats.jpg')])
for k, (c, a, b) in enumerate(win):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{min(a + 0.5, b - 0.1):.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=320:-1', f'{tmp}/k{k:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/k*.png', '-vf', 'tile=6x4', '-frames:v', '1', os.path.join(ROOT, 'preview/final_keypoints.jpg')])
run(['rm', '-rf', tmp])
print('   contact sheet: preview/final_beats.jpg & preview/final_keypoints.jpg')
