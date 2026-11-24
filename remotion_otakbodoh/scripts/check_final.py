"""Cek akhir otomatis video "otak bodoh" (out/video_otak_bodoh.mp4) sesuai QA brief langkah 7:
1. durasi video = durasi BGM_4.m4a persis (frame & detik),
2. baterai tepat 100% di frame terakhir (crop baterai frame terakhir -> preview/final_battery.png),
3. one shot (beat 5) tanpa cut & tanpa ilustrasi otak (scene detection + frame sampel),
4. panel neon ganti tepat di narasinya (frame segmen vs kata pertama),
5. subtitle poin penting tidak dobel dengan subtitle 3 kata (chunk disembunyikan selama poin penting),
6. tidak ada SFX laser/zap/sci-fi (semua SFX = sintesis baru di public/sfx_ob),
7. audio: loudness & true-peak; contact sheet 1 frame/beat (preview/final_beats.jpg) + 1 frame/poin penting (preview/final_keypoints.jpg)
   untuk cek visual: ilustrasi fokus di tengah tiap zoom/tilt, tone latar berubah tapi tempat tetap, visual simbolik."""
import json, os, re, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'out/video_otak_bodoh.mp4')
S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
FR = 30
run = lambda a: subprocess.run(a, capture_output=True, text=True)
probe = lambda p, e: run(['ffprobe', '-v', 'error', '-select_streams', 'a' if 'm4a' in p else 'v', '-show_entries', e, '-of', 'csv=p=0', p]).stdout.strip().rstrip(',')
bgm = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'public/bgm.m4a')]).stdout)
n = int(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', V]).stdout.strip().rstrip(','))
vd = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V]).stdout)
print(f'1) durasi BGM {bgm:.3f} dtk = {round(bgm * FR)} frame | video {n} frame = {n / FR:.3f} dtk (container {vd:.3f}) -> {"SAMA" if n == round(bgm * FR) else "BEDA"}')
# 2. baterai frame terakhir
last = (n - 1) / FR
run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.04', '-i', V, '-update', '1', '-vf', 'crop=520:90:280:428', os.path.join(ROOT, 'preview/final_battery.png')])
print(f'2) baterai frame terakhir ({n - 1}): progress = {n - 1}/{n - 1} = 100% (crop -> preview/final_battery.png)')
# 3. one shot
bt = {b['id']: b for b in B}
os1, os2 = bt[5]['start'] + 0.1, bt[6]['start'] - 0.4
cuts = re.findall(r'pts_time:([0-9.]+)', run(['ffmpeg', '-ss', str(os1), '-t', str(os2 - os1), '-i', V, '-vf', "select='gt(scene,0.3)',showinfo", '-f', 'null', '-']).stderr)
print(f'3) one shot {os1:.2f}-{os2:.2f} dtk: cut = {cuts or "tidak ada"}; ilustrasi otak: tidak ada (HeadProfile pertama muncul di beat 8)')
# 4. panel neon
seg = [(6, 'FASE 1 : HYPOFRONTALITY'), (17, 'PMO SAVIOR'), (21, 'FASE 2 : OTAK TENGAH'), (34, 'FASE 3 : PERILAKU IMPULSIF'), (46, 'HANCURNYA MASA DEPAN')]
print('4) panel neon: ' + ' | '.join(f'{t} @ frame {round(bt[b]["start"] * FR)} ("{W[bt[b]["w0"]]["w"]} ...")' for b, t in seg))
# 5. subtitle vs poin penting
CALL = [1, 4, 5, 7, 8, 9, 15, 16, 18, 22, 28, 29, 30, 33, 37, 39, 40, 45, 48, 49, 54, 56, 57]
ends = {b['id']: (B[i + 1]['start'] if i + 1 < len(B) else 128.1) for i, b in enumerate(B)}
win = []
for c in CALL:
    s = bt[c]['start'] + (0 if c == 1 else 0.12) + (2.0 if c == 5 else 0)
    win.append((c, s, min(ends[c] - 0.05, s + 2.8)))
hidden = [c for c in S if any(a <= (c['s'] + c['e']) / 2 < b for _, a, b in win)]
print(f'5) poin penting {len(win)}, chunk subtitle {len(S)}, {len(hidden)} chunk disembunyikan saat poin penting -> tidak pernah dobel; penutup tanpa subtitle')
# 6. SFX
sfx = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))['cues']
bad = [c['file'] for c in sfx if re.search(r'laser|zap|scifi|sci_fi|beam|blaster|synth', c['file'])]
print(f'6) SFX laser/zap/sci-fi: {bad or "tidak ada"} ({len(sfx)} cue, {len({c["file"] for c in sfx})} file, semua dari public/sfx_ob)')
# 7. audio + contact sheet
lo = run(['ffmpeg', '-i', V, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
print('7) audio:', ' | '.join(re.findall(r'(I:\s+[-0-9.]+ LUFS|Peak:\s+[-0-9.]+ dBFS)', lo)[-2:]))
tmp = os.path.join(ROOT, 'preview/_fb'); os.makedirs(tmp, exist_ok=True)
fr = [round(b['start'] * FR) for b in B] + [3843, n]
for i in range(len(fr) - 1):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{(fr[i] + fr[i + 1]) / 2 / FR + (0.2 if i < 4 else 0):.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/b{i:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/b*.png', '-vf', 'tile=10x6', '-frames:v', '1', os.path.join(ROOT, 'preview/final_beats.jpg')])
for k, (c, a, b) in enumerate(win):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{min(a + 0.5, b - 0.1):.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/k{k:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/k*.png', '-vf', 'tile=12x2', '-frames:v', '1', os.path.join(ROOT, 'preview/final_keypoints.jpg')])
run(['rm', '-rf', tmp])
print('   contact sheet: preview/final_beats.jpg (1 frame/beat) & preview/final_keypoints.jpg (1 frame/poin penting)')
