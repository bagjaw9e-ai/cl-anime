"""55 beat storyboard -> data/beats.json (start = timestamp kata pertama beat) + chunk subtitle 3 kata (data/subs.json).
Chunk: dipotong di tanda baca / jeda > 0,18 dtk, maks 3 kata, hindari chunk 1 kata & akhir chunk di kata sambung."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
BEATS = [  # (id, bagian, teks awal beat) — storyboard video umur25
 (1,'HOOK','Umur 25 tahun'),(2,'HOOK','tapi masih kecanduan PMO,'),
 (3,'ONESHOT','setidaknya bakal muncul'),(4,'ONESHOT','yang ngerubah sifat'),(5,'ONESHOT','tanpa lo sadari.'),
 (6,'E1','Efek yang pertama,'),(7,'E1','lo jadi gampang marah,'),(8,'E1','dan lama-lama jadi abusive,'),(9,'E1','atau perilaku lo'),
 (10,'E1','Tiap lo nonton bokep,'),(11,'E1','otak lo kebanjiran dopamin.'),(12,'E1','Jadi pas gak dapet'),(13,'E1','mood lo langsung anjlok,'),
 (14,'E1','karena otak bagian amigdala'),(15,'E1','dan terbiasa dapet'),(16,'E1','Hal kecil aja'),(17,'E1','Masalahnya, hal ini'),
 (18,'E1','Karena dengan kategori'),(19,'E1','sampai otak mulai'),(20,'E1','Kasar dalam ucapan'),(21,'E1','baik itu ke keluarga'),
 (22,'E1','sudah menginfeksi tanpa'),
 (23,'MID','Walaupun ada konsep'),(24,'MID','lewat link di bio'),(25,'MID','yang terbukti efektif'),(26,'MID','Tapi lo harus tau'),
 (27,'E2','Efek nomor dua,'),(28,'E2','kepala lo jadi'),(29,'E2','Tiap liat cewek,'),(30,'E2','yang muncul malah'),(31,'E2','Kenapa?'),
 (32,'E2','Karena otak tengah'),(33,'E2','Padahal bagian ini'),(34,'E2','urusannya cuma makan'),(35,'E2','Makin kuat otak'),
 (36,'E2','otak logika yang'),(37,'E2','Tanpa rem, lo'),(38,'E2','dan gampang kebawa'),(39,'E2','Makanya gak jarang,'),
 (40,'E2','Ini bukan sekedar'),(41,'E2','tapi tertulis di'),
 (42,'E3','Efek yang terakhir,'),(43,'E3','cara berpikir lo'),(44,'E3','Otak yang terus'),(45,'E3','dan susah fokus.'),
 (46,'E3','Pikiran yang gampang'),(47,'E3','bikin lo sering'),(48,'E3','Ditambah rasa bersalah'),(49,'E3','kepercayaan diri lo'),
 (50,'E3','Makanya, pas ngobrol,'),(51,'E3','Bahkan buat natap'),
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
ENDBAD = STARTERS | {'lewat','per','makin','mulai','lagi','udah','punya','bisa','dia','lo','tahun','jurnal','paling'}
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
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(out), 'beat,', len(subs), 'chunk; durasi VO', W[-1]['e'])
for b in out: print(f"{b['id']:2d} {b['sec']:7s} {b['start']:7.2f}  {b['text'][:70]}")
print(' | '.join(' '.join(W[i]['w'] for i in c['words']) for c in subs[:45]))
