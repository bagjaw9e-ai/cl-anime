"""55 beat storyboard -> data/beats.json (start = timestamp kata pertama beat) + chunk subtitle 3 kata (data/subs.json).
Chunk: dipotong di tanda baca / jeda > 0,18 dtk, maks 3 kata, hindari chunk 1 kata & akhir chunk di kata sambung."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
BEATS = [  # (id, bagian, teks awal beat)
 (1,'HOOK','Jangan pernah menikah'),(2,'HOOK','dengan pria yang kecanduan PMO,'),
 (3,'ONESHOT','karena pria pengocok handal ini'),(4,'ONESHOT','mengalami tiga fase kerusakan otak'),(5,'ONESHOT','yang dia sendiri pun belum sadari.'),
 (6,'F1','Fase pertama,'),(7,'F1','PMO ngebajak sistem reward'),(8,'F1','Tiap malam'),(9,'F1','dopaminnya dibanjiri fantasi'),
 (10,'F1','sampai reseptornya tumpul'),(11,'F1','Akibatnya, hal-hal nyata'),(12,'F1','Kerja males,'),(13,'F1','ibadah hampa,'),
 (14,'F1','bahkan perempuan nyata'),(15,'F1','kalah menarik dibanding'),(16,'F1','Otaknya udah gak kenal'),(17,'F1','karena PMO ngajarin dia'),
 (18,'MID','Walaupun otak manusia'),(19,'MID','Sirkuit yang rusak'),(20,'MID','dan lo bisa dapetin'),(21,'MID','Tapi kalau pria sudah'),
 (22,'F2','Di fase kedua,'),(23,'F2','PMO mulai menggerogoti'),(24,'F2','pusat kendali yang'),(25,'F2','Rem di otaknya'),
 (26,'F2','tekadnya makin lemah,'),(27,'F2','dikit-dikit gampang tersulut,'),(28,'F2','ditegur sedikit langsung'),(29,'F2','Keputusan hidupnya asal-asalan,'),
 (30,'F2','gak punya arah,'),(31,'F2','dan yang paling bahaya,'),
 (32,'RISET','Penelitian di jurnal'),(33,'RISET','nemuin bahwa makin'),(34,'RISET','maka makin kecil'),(35,'RISET','Peneliti menduga ini'),(36,'RISET','buat ngerasain kepuasan'),
 (37,'F3','Di fase ketiga,'),(38,'F3','PMO udah ngerusak cara'),(39,'F3','Karena otaknya terbiasa'),(40,'F3','dan bisa diganti'),(41,'F3','dia mulai mati rasa'),
 (42,'F3','Pelukan terasa biasa,'),(43,'F3','obrolan terasa ngebosenin,'),(44,'F3','dan kehadiran istrinya'),(45,'F3','Dari mati rasa,'),
 (46,'F3','bukan lagi sebagai'),(47,'F3','Waktu istrinya gak'),(48,'F3','dia gampang kesel,'),(49,'F3','ngomongnya mulai kasar,'),
 (50,'F3','dan di ranjang'),(51,'F3','Lama-lama yang dulu'),(52,'F3','kasar di omongan'),(53,'F3','dan bisa juga kasar'),
 (54,'F3','Yang paling ngeri,'),(55,'F3','karena PMO udah bikin'),
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
STARTERS = {'kalau','tapi','karena','dan','atau','jadi','buat','yang','bahkan','sampai','maka','bahwa','walaupun','dibanding','tanpa','tiap','cuma','sebagai','bukan','dari','ke','sama','di'}
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
