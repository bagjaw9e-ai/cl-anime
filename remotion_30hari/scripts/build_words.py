"""Whisper word-level -> kata terkoreksi (ejaan naskah) + chunk subtitle <=3 kata + jadwal callout.
Output: data/words.json, data/subs.json (dipakai src/timeline.ts & src/subtitles.ts)."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/whisper_words.json')))
words = [{'w': w.strip(), 's': s, 'e': e} for s, e, w in W]

# gabung token yang terpecah
def merge(i, text):
    words[i]['w'] = text; words[i]['e'] = words[i + 1]['e']; del words[i + 1]
i = 0
while i < len(words) - 1:
    a, b = words[i]['w'], words[i + 1]['w']
    if a == 'ke' and b.startswith('-7'): merge(i, 'ketujuh,'); continue
    if a == '145' and b.startswith('%'): merge(i, '145%'); continue
    if b.startswith('-') and a and not a.endswith(('.', ',', '?')): merge(i, a + b); continue
    i += 1
FIX = {'Fasa': 'Fase', 'kejala': 'gejala', 'ditoks': 'didetoks', 'tendali.': 'kendali.', 'ling': 'link', 'pencadu': 'pecandu',
       'Onani.': 'onani.', 'University-SCIENCE': 'University-SCIENCE', 'Bosen,': 'Bosen,', 'polanya.': 'polanya:'}
for w in words:
    w['w'] = FIX.get(w['w'], w['w'])
json.dump(words, open(os.path.join(ROOT, 'data/words.json'), 'w'), ensure_ascii=False, indent=0)

# chunk subtitle: segmentasi optimal per frasa (dipisah tanda baca), maks 3 kata.
# Biaya: chunk 1 kata mahal, potong sebelum kata sambung / di jeda napas murah, akhiri chunk dgn kata sambung mahal.
STARTERS = {'kalau', 'tapi', 'karena', 'dan', 'atau', 'terus', 'jadi', 'buat', 'agar', 'seperti', 'selama', 'yang',
            'yaitu', 'bukan', 'cuma', 'sampai', 'akibat', 'sebagai', 'setiap', 'itu'}
ENDBAD = STARTERS | {'ke', 'di', 'dari', 'sama', 'lewat', 'secara', 'pada', 'lo', 'bagian', 'otak'}
clean = lambda t: re.sub(r'[^\w%-]', '', t).lower()
phrases, cur = [], []
for k, w in enumerate(words):
    cur.append(k)
    if re.search(r'[.,?:!]$', w['w']) or k == len(words) - 1:
        phrases.append(cur); cur = []
out = []
for ph in phrases:
    n = len(ph); best = [0.0] + [1e9] * n; prev = [0] * (n + 1)
    for j in range(1, n + 1):
        for L in (1, 2, 3):
            i0 = j - L
            if i0 < 0: continue
            c = {1: 3.0, 2: 0.6, 3: 0.0}[L]
            if j < n:  # batas di dalam frasa
                nxt = words[ph[j]]; last = words[ph[j - 1]]
                gap = nxt['s'] - last['e']
                if clean(nxt['w']) in STARTERS: c -= 0.9
                if gap > 0.18: c -= 1.0
                if clean(last['w']) in ENDBAD: c += 2.0
                if re.match(r'^\d+$', clean(last['w'])): c += 4.0  # angka jangan dipisah dari "hari"
            if best[i0] + c < best[j]: best[j] = best[i0] + c; prev[j] = i0
    seg, j = [], n
    while j > 0: seg.append(ph[prev[j]:j]); j = prev[j]
    out.extend(seg[::-1])
# override manual (data/subs_manual.txt): chunk dipisah '|', dicocokkan berurutan dengan kata Whisper terkoreksi
man = os.path.join(ROOT, 'data/subs_manual.txt')
if os.path.exists(man):
    parts = [p.split() for p in open(man).read().replace('\n', ' ').split('|') if p.strip()]
    out, k = [], 0
    norm = lambda t: re.sub(r'[^\w%-]', '', t).lower()
    for p in parts:
        idx = list(range(k, k + len(p)))
        got = [norm(words[i]['w']) for i in idx]
        assert got == [norm(x) for x in p], (p, [words[i]['w'] for i in idx])
        out.append(idx); k += len(p)
    assert k == len(words), (k, len(words))
subs = [{'words': c, 's': words[c[0]]['s'], 'e': words[c[-1]]['e']} for c in out]
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(words), 'kata,', len(subs), 'chunk subtitle; maks kata/chunk =', max(len(c['words']) for c in subs))
print(' | '.join(' '.join(words[i]['w'] for i in c['words']) for c in subs[:40]))
