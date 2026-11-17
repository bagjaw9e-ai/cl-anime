"""Whisper word-level (data/whisper_words.json) -> kata terkoreksi ke ejaan naskah + chunk subtitle <=3 kata.
Output: data/words.json, data/subs.json (dipakai src/timeline.ts & src/subtitles.ts).
Chunk mengikuti data/subs_manual.txt (dipotong di jeda alami narasi, '|' = batas chunk)."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/whisper_words.json')))
words = [{'w': w.strip(), 's': s, 'e': e} for s, e, w in W]
i = 0
while i < len(words) - 1:  # gabung token terpecah: "basa" "-basi." / "e" "-book"
    if words[i + 1]['w'].startswith('-'):
        words[i]['w'] += words[i + 1]['w']; words[i]['e'] = words[i + 1]['e']; del words[i + 1]; continue
    i += 1
# ejaan naskah
SCRIPT = ('Lepas dari adiksi PMO dan pulihkan otak yang mulai tersakiti. Pakai metode ilmiah lewat konsep neuroplasticity. '
          'Semua rahasianya udah gua bongkar habis tanpa basa-basi. Langsung cek e-book dan video Stop PMO by PMO Savior '
          'lewat link di bio sekarang ini.').split()
norm = lambda t: re.sub(r'[^\w%-]', '', t).lower()
assert [norm(w['w']) for w in words] == [norm(x) for x in SCRIPT], [w['w'] for w in words]
for w, x in zip(words, SCRIPT): w['w'] = x
json.dump(words, open(os.path.join(ROOT, 'data/words.json'), 'w'), ensure_ascii=False, indent=0)

parts = [p.split() for p in open(os.path.join(ROOT, 'data/subs_manual.txt')).read().replace('\n', ' ').split('|') if p.strip()]
out, k = [], 0
for p in parts:
    assert 1 <= len(p) <= 3, p
    idx = list(range(k, k + len(p)))
    assert [norm(words[i]['w']) for i in idx] == [norm(x) for x in p], (p, [words[i]['w'] for i in idx])
    out.append(idx); k += len(p)
assert k == len(words)
subs = [{'words': c, 's': words[c[0]]['s'], 'e': words[c[-1]]['e']} for c in out]
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(words), 'kata,', len(subs), 'chunk')
for c in subs: print(f"{c['s']:6.2f}-{c['e']:6.2f}  " + ' '.join(words[i]['w'] for i in c['words']))
