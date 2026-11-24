"""57 beat storyboard -> data/beats.json (start = timestamp kata pertama beat) + chunk subtitle 3 kata (data/subs.json).
Chunk: dipotong di tanda baca / jeda > 0,18 dtk, maks 3 kata, hindari chunk 1 kata & akhir chunk di kata sambung."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
BEATS = [  # (id, bagian, teks awal beat) — storyboard video "otak bodoh" (57 beat narasi + 58 penutup)
 (1,'HOOK','Otak jadi bodoh'),(2,'HOOK','akibat pornografi'),(3,'HOOK','dan onani'),(4,'HOOK','atau adiksi PMO,'),
 (5,'ONESHOT','dan terjadi tiga'),
 (6,'F1','Pada fase pertama,'),(7,'F1','kebiasaan PMO memicu'),(8,'F1','yaitu menurunnya fungsi'),(9,'F1','Padahal, bagian ini'),
 (10,'F1','yang bertugas untuk'),(11,'F1','menyusun strategi,'),(12,'F1','memahami teori rumit,'),(13,'F1','merencanakan masa depan,'),
 (14,'F1','hingga mengendalikan diri.'),(15,'F1','Semakin sering lo terjebak'),(16,'F1','performa mesin canggih'),
 (17,'PMO','Walaupun lewat link'),(18,'PMO','lo bisa dapetin'),(19,'PMO','untuk bantu pulihkan'),(20,'PMO','tapi lo harus'),
 (21,'F2','Di fase kedua,'),(22,'F2','manusia ini memiliki'),(23,'F2','mirip struktur otak'),(24,'F2','yang hanya mengurus'),
 (25,'F2','seperti makan'),(26,'F2','dan berkembang biak.'),(27,'F2','Karena tidak cukup'),(28,'F2','otak tengah mudah'),
 (29,'F2','dan menganggap rangsangan'),(30,'F2','Ini tertulis dalam'),(31,'F2','Akibatnya, semakin sering'),(32,'F2','otak tengah akan'),
 (33,'F2','dan mengambil alih'),
 (34,'F3','Di fase ketiga,'),(35,'F3','ketika insting purba'),(36,'F3','sedangkan pusat nalar'),(37,'F3','sistem pengendali diri'),
 (38,'F3','Akibatnya, pola tindakan'),(39,'F3','Lo berkali-kali melakukan'),(40,'F3','sekaligus bikin lo'),(41,'F3','serta dikuasai syahwat'),
 (42,'F3','Gak cukup sampai'),(43,'F3','ketajaman logika lo'),(44,'F3','perhatian lo cepat'),(45,'F3','bahkan lo bakal'),
 (46,'MD','Pada akhirnya, istilah'),(47,'MD','bukanlah sekedar teori'),(48,'MD','melainkan penurunan performa'),(49,'MD','Mendadak blank ketika'),
 (50,'MD','tatapan mata yang'),(51,'MD','hingga sering menunda'),(52,'MD','karena fokus lo'),(53,'MD','Lama-kelamaan, kondisi otak'),
 (54,'MD','membiasakan lo mencari'),(55,'MD','Membiarkan kebiasaan ini'),(56,'MD','sama aja dengan'),(57,'MD','dan masa depan'),
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
FIX = {'di otak bagian|depan.': 2, 'dalam jurnal Human|Brain Mapping': 2, 'perhatian lo cepat|buyar,': 2}
txt = lambda c: ' '.join(W[i]['w'] for i in c['words'])
for i in range(len(subs) - 1):
    k = FIX.get(txt(subs[i]) + '|' + txt(subs[i + 1]))
    if k:
        ws_ = subs[i]['words'] + subs[i + 1]['words']
        subs[i] = {'words': ws_[:k], 's': W[ws_[0]]['s'], 'e': W[ws_[k - 1]]['e']}
        subs[i + 1] = {'words': ws_[k:], 's': W[ws_[k]]['s'], 'e': W[ws_[-1]]['e']}
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(out), 'beat,', len(subs), 'chunk; durasi VO', W[-1]['e'])
for b in out: print(f"{b['id']:2d} {b['sec']:7s} {b['start']:7.2f}  {b['text'][:70]}")
print(' | '.join(' '.join(W[i]['w'] for i in c['words']) for c in subs[:45]))
