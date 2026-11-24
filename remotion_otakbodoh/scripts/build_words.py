"""Whisper word-level -> kata dengan EJAAN NASKAH (data/script.txt) + timestamp Whisper.
Penyelarasan difflib per token ternormalisasi; blok beda panjang dibagi rata waktunya.
Output data/words.json (+ laporan perbedaan). Token halusinasi berdurasi nol di awal dibuang."""
import json, os, re, difflib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/whisper_words.json')))
ws = [{'w': w.strip(), 's': s, 'e': e} for s, e, w in W]
while ws and ws[0]['e'] - ws[0]['s'] < 0.01: ws.pop(0)          # halusinasi prompt di awal
i = 0
while i < len(ws) - 1:                                           # "hal" "-hal." -> "hal-hal."
    if ws[i + 1]['w'].startswith('-'): ws[i]['w'] += ws[i + 1]['w']; ws[i]['e'] = ws[i + 1]['e']; del ws[i + 1]; continue
    i += 1
script = open(os.path.join(ROOT, 'data/script.txt')).read().split()
norm = lambda t: re.sub(r'[^\w]', '', t).lower()
A = [norm(w['w']) for w in ws]; B = [norm(x) for x in script]
out = []; diffs = []
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
    if op == 'equal':
        for k in range(a1 - a0): out.append({'w': script[b0 + k], 's': ws[a0 + k]['s'], 'e': ws[a0 + k]['e']})
        continue
    diffs.append((op, ' '.join(w['w'] for w in ws[a0:a1]), ' '.join(script[b0:b1])))
    if b1 == b0: continue  # kata ekstra Whisper dibuang
    if a1 > a0: s, e = ws[a0]['s'], ws[a1 - 1]['e']
    else: s = ws[a0 - 1]['e'] if a0 > 0 else 0; e = ws[a0]['s'] if a0 < len(ws) else s + 0.3
    n = b1 - b0; d = max(e - s, 0.05 * n)
    for k in range(n): out.append({'w': script[b0 + k], 's': round(s + d * k / n, 3), 'e': round(s + d * (k + 1) / n, 3)})
assert [o['w'] for o in out] == script
json.dump(out, open(os.path.join(ROOT, 'data/words.json'), 'w'), ensure_ascii=False, indent=0)
print(len(out), 'kata; perbedaan Whisper -> naskah:')
for d in diffs: print('  ', d)
