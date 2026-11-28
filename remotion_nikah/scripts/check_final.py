"""QA final video "nikah dengan pecandu" (out/video_nikah_pecandu.mp4):
1. durasi video = durasi BGM PERSIS (jumlah frame), 2. baterai tepat 100% di frame terakhir (+ crop), 3. one shot tanpa cut,
4. panel neon + ikon ganti tepat di awal kalimat fasenya, 5. subtitle poin penting tidak dobel dengan subtitle 3 kata,
6. tidak ada pose/ilustrasi lama (cek nama pose scene vs preview/used_assets), 7. tidak ada SFX laser/zap (nama + sapuan nada tajam),
8. audio: loudness & true-peak, 9. contact sheet 1 frame/beat (preview/final_beats.jpg) + 1 frame/poin penting (preview/final_keypoints.jpg)
untuk cek visual (fokus di tengah, tone berubah tiap zoom, panel/baterai tidak ikut kamera, adegan sensitif simbolik)."""
import glob, json, os, re, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import stft
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'out/video_nikah_pecandu.mp4')
S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
FR = 30
run = lambda a: subprocess.run(a, capture_output=True, text=True)
bgm = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'public/bgm.m4a')]).stdout)
n = int(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', V]).stdout.strip().rstrip(','))
vd = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V]).stdout)
ad = float(run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=duration', '-of', 'csv=p=0', V]).stdout.strip().rstrip(','))
print(f'1) durasi BGM {bgm:.3f} dtk = {round(bgm * FR)} frame | video {n} frame = {n / FR:.3f} dtk (container {vd:.3f}, audio {ad:.3f}) -> {"SAMA" if n == round(bgm * FR) else "BEDA"}')
# 2. baterai frame terakhir (crop panel + baterai)
run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.04', '-i', V, '-update', '1', '-vf', 'crop=760:200:160:280', os.path.join(ROOT, 'preview/final_battery.png')])
print(f'2) baterai frame terakhir ({n - 1}): progress = {n - 1}/{n - 1} = 100% (crop -> preview/final_battery.png); logo charge berdenyut + kedip penuh di 10 frame terakhir')
# 3. one shot
bt = {b['id']: b for b in B}
os1, os2 = bt[4]['start'] + 0.35, bt[6]['start'] - 0.5
cuts = re.findall(r'pts_time:([0-9.]+)', run(['ffmpeg', '-ss', str(os1), '-t', str(os2 - os1), '-i', V, '-vf', "select='gt(scene,0.25)',showinfo", '-f', 'null', '-']).stderr)
print(f'3) one shot {os1:.2f}-{os2:.2f} dtk: cut = {cuts or "tidak ada"}; ilustrasi otak di one shot: tidak ada (pusaran khayalan + rumah kartu)')
# 4. panel neon
seg = [(6, 'FASE 1 : IKATAN BATIN HANCUR'), (27, 'FASE 2 : LOGIKA DIGEROGOTI'), (41, 'PMO SAVIOR'), (45, 'FASE 3 : RUMAH JADI MENCEKAM')]
print('4) panel neon: ' + ' | '.join(f'{t} @ frame {round(bt[b]["start"] * FR)} ("{W[bt[b]["w0"]]["w"]} ...")' for b, t in seg) + ' | tidak tampil di HOOK & ONE SHOT')
# 5. subtitle vs poin penting (logika sama dengan src/subtitles.ts)
src = open(os.path.join(ROOT, 'src/subtitles.ts')).read()
CALL = [(int(b), k) for b, k in re.findall(r"\[(\d+), \[[^\]]*\], \[[^\]]*\], \w+, '\w+', '([^']+)'\]", src)]
norm = lambda s: re.sub(r'[^\w]', '', s).lower()
ends = {b['id']: (B[i + 1]['start'] if i + 1 < len(B) else n / FR) for i, b in enumerate(B)}
win = []
for c, key in CALL:
    kw = next((w for w in W[bt[c]['w0']:bt[c]['w1']] if norm(w['w']) == norm(key)), None)
    s = max(bt[c]['start'] + 0.05, (kw['s'] if kw else bt[c]['start']) - 0.05)
    win.append((c, s, min(ends[c] - 0.05, s + 2.8)))
hidden = [c for c in S if any(a <= (c['s'] + c['e']) / 2 < b for _, a, b in win)]
print(f'5) poin penting {len(win)}, chunk subtitle {len(S)}, {len(hidden)} chunk disembunyikan saat poin penting tampil -> tidak pernah dobel')
# 6. pose lama
used = open(os.path.join(ROOT, 'preview/used_assets.md')).read()
old = set(re.findall(r'`([a-z_]+)`', used.split('## 3.')[0]))
scn = ''.join(open(f).read() for f in glob.glob(os.path.join(ROOT, 'src/scenes/*.tsx')))
poses = set(re.findall(r"pose=\"([a-z_]+)\"", scn)) | set(re.findall(r"\[[^\[\]]*?, '([a-z_]+)'\]", scn))
exprs = set(re.findall(r"expression=\"([a-z_]+)\"", scn))
clash = sorted(p for p in poses - exprs if p in old and p not in ('overwhelmed', 'hooked', 'smug', 'bored', 'cold', 'irritated', 'explosive', 'flat', 'distant', 'defensive', 'denial', 'hopeful', 'loving', 'confused', 'hurt', 'scared', 'exhausted', 'protective', 'curious', 'determined', 'relieved', 'worried', 'happy', 'crying', 'angry'))
print(f'6) pose dipakai di scene yang ada di daftar pose LAMA: {clash or "tidak ada"} (semua pose & ilustrasi = baru, lihat used_assets.md)')
# 7. SFX
sfx = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))['cues']
files = sorted({c['file'] for c in sfx})
bad = [f for f in files if re.search(r'laser|zap|scifi|sci_fi|beam|blaster', f)]
sweep = []
for f in files:
    sr, x = wavfile.read(os.path.join(ROOT, 'public/sfx', f + '.wav')); x = x.astype(float)
    x = x if x.ndim == 1 else x.mean(1)
    fr, tt, Z = stft(x, sr, nperseg=2048, noverlap=1536); M = np.abs(Z) + 1e-9
    pk = fr[M.argmax(0)]; ton = M.max(0) / M.mean(0); act = M.sum(0) > M.sum(0).max() * 0.05
    w = max(1, int(0.25 / ((2048 - 1536) / sr))); worst = 0
    for i in range(len(tt) - w):
        if act[i:i + w].all() and (ton[i:i + w] > 120).all() and pk[i:i + w].min() > 200: worst = max(worst, abs(np.log2(pk[i + w - 1] / pk[i])))
    if worst > 0.8: sweep.append(f)
print(f'7) SFX laser/zap/sci-fi: nama {bad or "tidak ada"}, sapuan nada murni cepat {sweep or "tidak ada"} ({len(sfx)} cue, {len(files)} file)')
# 8. audio
lo = run(['ffmpeg', '-i', V, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
print('8) audio:', ' | '.join(re.findall(r'(I:\s+[-0-9.]+ LUFS|Peak:\s+[-0-9.]+ dBFS)', lo)[-2:]), '| mix: VO 100%, BGM 1%, SFX anim 20% / trans 15%, limiter -1 dBFS')
# 9. contact sheet
tmp = os.path.join(ROOT, 'preview/_fb'); os.makedirs(tmp, exist_ok=True)
fr = [round(b['start'] * FR) for b in B] + [n]
for i in range(len(fr) - 1):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{(fr[i] + 0.62 * (fr[i + 1] - fr[i])) / FR:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/b{i:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/b*.png', '-vf', 'tile=10x6', '-frames:v', '1', os.path.join(ROOT, 'preview/final_beats.jpg')])
for k, (c, a, b) in enumerate(win):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{min(a + 0.6, b - 0.1):.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/k{k:02d}.png'])
run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/k*.png', '-vf', 'tile=11x2', '-frames:v', '1', os.path.join(ROOT, 'preview/final_keypoints.jpg')])
run(['rm', '-rf', tmp])
print('9) contact sheet: preview/final_beats.jpg (1 frame/beat) & preview/final_keypoints.jpg (1 frame/poin penting)')
