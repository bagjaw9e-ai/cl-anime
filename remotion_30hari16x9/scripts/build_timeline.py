"""50 beat storyboard -> data/beats.json (start = timestamp kata pertama beat) + chunk subtitle 3 kata (data/subs.json).
Chunk: dipotong di tanda baca / jeda > 0,18 dtk, maks 3 kata, hindari chunk 1 kata & akhir chunk di kata sambung."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
BEATS = [  # (id, bagian, teks awal beat) — storyboard video 30 hari 16:9 (50 beat narasi + 51 penutup)
 (1,'HOOK','Apa yang terjadi'),(2,'HOOK','kalau lo nggak'),(3,'HOOK','selama 30 hari?'),
 (4,'H13','Tiga hari pertama'),(5,'H13','adalah fase yang'),(6,'H13','Bukan karena tubuh'),(7,'H13','tapi karena otak'),(8,'H13','Bosen,'),
 (9,'H13','sendirian,'),(10,'H13','pegang HP,'),(11,'H13','langsung balik buka'),(12,'H13','dan onani.'),(13,'H13','Fase ini, lo'),(14,'H13','atau sakau.'),
 (15,'H7','Sekitar hari ketujuh,'),(16,'H7','satu studi dari'),(17,'H7','kalau kadar testosteron'),(18,'H7','naik sampai sekitar'),
 (19,'H7','terus balik lagi'),(20,'H7','Jadi bukan jadi'),(21,'H7','cuma tanda tubuh'),
 (22,'H14','Masuk ke fase'),(23,'H14','Banyak yang ngerasa'),(24,'H14','libido drop,'),(25,'H14','mood datar.'),(26,'H14','Fase ini biasa'),
 (27,'H14','Otak bagian amigdala'),(28,'H14','sedang menyesuaikan kadar'),(29,'H14','Jadi wajar kalau'),(30,'H14','karena hormon kebahagiaan'),
 (31,'H14','Dan sekarang otak'),
 (32,'H21','Masuk ke minggu'),(33,'H21','Setiap kali lo'),(34,'H21','lo lagi melatih'),(35,'H21','Di fase ini banyak'),(36,'H21','Fokus mereka juga'),
 (37,'H21','Yang paling penting,'),(38,'H21','Lo bisa kontrol'),(39,'H21','dan otak bagian PFC'),
 (40,'H66','Tapi ingat, rata-rata'),(41,'H66','Jadi 30 hari'),(42,'H66','itu baru awal'),(43,'H66','Lo juga akan'),(44,'H66','Mimpi basah merupakan'),
 (45,'H66','bukan artifisial atau'),
 (46,'NEURO','Miliki juga konsep'),(47,'NEURO','agar lo tidak'),(48,'NEURO','dan bisa memulihkan'),(49,'NEURO','miliki lewat link'),(50,'NEURO','Dijamin efektif, buat'),
]
norm = lambda t: re.sub(r'[^\w]', '', t).lower()
NW = [norm(w['w']) for w in W]
k = 0; out = []
for bid, sec, txt in BEATS:
    q = [norm(x) for x in txt.split()]
    while NW[k:k + len(q)] != q: k += 1
    out.append({'id': bid, 'sec': sec, 'w0': k, 'start': 0.0 if bid == 1 else W[k]['s']}); k += len(q)
for i, b in enumerate(out):
    b['w1'] = out[i + 1]['w0'] if i + 1 < len(out) else len(W)
    b['text'] = ' '.join(w['w'] for w in W[b['w0']:b['w1']])
json.dump(out, open(os.path.join(ROOT, 'data/beats.json'), 'w'), ensure_ascii=False, indent=0)
# subtitle chunks (segmentasi optimal per frasa; batas beat juga jadi batas frasa)
STARTERS = {'tapi', 'padahal', 'makanya', 'ditambah', 'bahkan', 'walaupun', 'masalahnya', 'kalau','tapi','karena','dan','atau','jadi','buat','yang','bahkan','sampai','maka','bahwa','walaupun','dibanding','tanpa','tiap','cuma','sebagai','bukan','dari','ke','sama','di'}
ENDBAD = STARTERS | {'otak','fungsi','jalan','masa','human','brain','prefrontal','layar','dalam','pada','insting','sistem','pusat','lewat','per','makin','mulai','lagi','udah','punya','bisa','dia','lo','tahun','jurnal','paling'}
bstart = {b['w0'] for b in out}
phrases, cur = [], []
for i, w in enumerate(W):
    if i in bstart and cur: phrases.append(cur); cur = []
    cur.append(i)
    if re.search(r'[.,?!]$', w['w']) or i == len(W) - 1: phrases.append(cur); cur = []
subs = []
for ph in phrases:
    n = len(ph); best = [0.0] + [1e9] * n; prev = [0] * (n + 1)
    for j in range(1, n + 1):
        for L in (1, 2, 3):
            i0 = j - L
            if i0 < 0: continue
            c = {1: 3.0, 2: 0.5, 3: 0.0}[L]
            if j < n:
                nx, la = W[ph[j]], W[ph[j - 1]]
                if norm(nx['w']) in STARTERS: c -= 0.9
                if nx['s'] - la['e'] > 0.18: c -= 1.0
                if norm(la['w']) in ENDBAD: c += 2.0
            if best[i0] + c < best[j]: best[j] = best[i0] + c; prev[j] = i0
    seg, j = [], n
    while j > 0: seg.append(ph[prev[j]:j]); j = prev[j]
    subs += [{'words': s, 's': W[s[0]]['s'], 'e': W[s[-1]]['e']} for s in seg[::-1]]
# koreksi manual pasangan chunk berurutan: "a|b" -> jumlah kata chunk pertama yang baru
FIX = {}
txt = lambda c: ' '.join(W[i]['w'] for i in c['words'])
for i in range(len(subs) - 1):
    k = FIX.get(txt(subs[i]) + '|' + txt(subs[i + 1]))
    if k:
        ws_ = subs[i]['words'] + subs[i + 1]['words']
        subs[i] = {'words': ws_[:k], 's': W[ws_[0]]['s'], 'e': W[ws_[k - 1]]['e']}
        subs[i + 1] = {'words': ws_[k:], 's': W[ws_[k]]['s'], 'e': W[ws_[-1]]['e']}
# pengelompokan ulang manual: frasa (gabungan chunk berurutan) -> jumlah kata per chunk baru
REGROUP = {'dari Journal of Zhejiang University Science bilang,': [3, 3, 1],
           'rata-rata kebiasaan baru butuh sekitar 66 hari buat nempel.': [3, 2, 2, 2],
           'Jadi 30 hari itu bukan garis finish,': [3, 2, 2]}
for phrase, groups in REGROUP.items():
    for i in range(len(subs)):
        acc, j = [], i
        while j < len(subs) and len(' '.join(txt(x) for x in subs[i:j])) < len(phrase): j += 1
        if ' '.join(txt(x) for x in subs[i:j]) == phrase:
            ws_ = [w for x in subs[i:j] for w in x['words']]; new, k = [], 0
            for g in groups: new.append({'words': ws_[k:k + g], 's': W[ws_[k]]['s'], 'e': W[ws_[k + g - 1]]['e']}); k += g
            subs[i:j] = new; break
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(out), 'beat,', len(subs), 'chunk; durasi VO', W[-1]['e'])
for b in out: print(f"{b['id']:2d} {b['sec']:7s} {b['start']:7.2f}  {b['text'][:70]}")
print(' | '.join(' '.join(W[i]['w'] for i in c['words']) for c in subs[:45]))
