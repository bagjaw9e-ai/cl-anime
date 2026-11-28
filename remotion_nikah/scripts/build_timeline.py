"""57 beat storyboard -> data/beats.json (start = timestamp kata pertama beat) + chunk subtitle 3 kata (data/subs.json).
Chunk: dipotong di tanda baca / jeda > 0,18 dtk, maks 3 kata, hindari chunk 1 kata & akhir chunk di kata sambung."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
BEATS = [  # (id, bagian, teks awal beat) — storyboard video "nikah dengan pecandu" (57 beat)
 (1,'HOOK','Menikah dengan pria'),(2,'HOOK','kecanduan PMO'),(3,'HOOK','merupakan suatu kesalahan.'),
 (4,'ONESHOT','Nahan fantasi liar'),(5,'ONESHOT','gimana ceritanya masa'),
 (6,'F1','Pada fase pertama,'),(7,'F1','kecanduan bokep dan'),(8,'F1','menghancurkan kemampuannya'),(9,'F1','Lantaran pikirannya'),
 (10,'F1','yang selalu patuh'),(11,'F1','dan gampang diganti'),(12,'F1','kepekaan emosionalnya'),(13,'F1','Sentuhan hangat'),
 (14,'F1','obrolan terdengar'),(15,'F1','dan keberadaan pasangannya'),(16,'F1','Rasa hambar itu'),(17,'F1','bukan manusia utuh'),
 (18,'F1','Saat kenyataan'),(19,'F1','emosinya cepat'),(20,'F1','ucapannya berubah'),(21,'F1','bahkan ia nekat'),
 (22,'F1','Sikap yang awalnya'),(23,'F1','akhirnya berubah'),(24,'F1','menyakiti lewat'),(25,'F1','Hal paling mengerikan,'),
 (26,'F1','karena kemampuan empatinya'),
 (27,'F2','Berlanjut di fase'),(28,'F2','dampaknya menggerogoti'),(29,'F2','yang mengatur fokus'),(30,'F2','Produksi dopaminnya'),
 (31,'F2','hingga sel penerimanya'),(32,'F2','Bahkan pesona wanita'),(33,'F2','kalah memikat'),(34,'F2','Parahnya lagi,'),
 (35,'F2','Riset dalam jurnal'),(36,'F2','mengungkap fakta'),(37,'F2','berkaitan dengan'),(38,'F2','Para ilmuwan menduga'),
 (39,'F2','penyusutan inilah'),(40,'F2','demi mengejar'),
 (41,'CTA','Walaupun ada konsep'),(42,'CTA','yang bisa lo'),(43,'CTA','untuk pulihkan'),(44,'CTA','tapi lo harus'),
 (45,'F3','Adiksi PMO ini'),(46,'F3','sekaligus membuatnya'),(47,'F3','Suami selalu'),(48,'F3','Ia justru'),(49,'F3','cepat menghindar,'),
 (50,'F3','atau membungkam'),(51,'F3','Kekacauan emosi'),(52,'F3','kerap dilampiaskan'),(53,'F3','membuat anak dan'),
 (54,'F3','malah menjadi sasaran'),(55,'F3','hingga perlakuan kasar'),(56,'F3','Rumah yang semestinya'),(57,'F3','berubah mencekam'),
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
# override manual: frasa (urutan kata persis) -> ukuran chunk baru
OVR = {'masa depan rumah tangga mau dia perjuangkan?': [2, 2, 3],
       'menghancurkan kemampuannya membangun ikatan batin dengan pasangan.': [2, 3, 2],
       'kepekaan emosionalnya terhadap istri perlahan menghilang.': [2, 2, 2],
       'sekaligus membuatnya sangat susah diajak berkomunikasi.': [2, 2, 2],
       'Suami selalu membangun tembok tinggi setiap kali diajak bicara.': [2, 3, 2, 2]}
for ph, sizes in OVR.items():
    q = ph.split(); n = len(q)
    k0 = next(i for i in range(len(W)) if [w['w'] for w in W[i:i + n]] == q)
    idx = [j for j, c in enumerate(subs) if c['words'][0] >= k0 and c['words'][-1] < k0 + n]
    assert sum(len(subs[j]['words']) for j in idx) == n, ph
    new, p = [], k0
    for L in sizes: ws_ = list(range(p, p + L)); new.append({'words': ws_, 's': W[ws_[0]]['s'], 'e': W[ws_[-1]]['e']}); p += L
    subs[idx[0]:idx[-1] + 1] = new
json.dump(subs, open(os.path.join(ROOT, 'data/subs.json'), 'w'), ensure_ascii=False, indent=0)
print(len(out), 'beat,', len(subs), 'chunk; durasi VO', W[-1]['e'])
for b in out: print(f"{b['id']:2d} {b['sec']:7s} {b['start']:7.2f}  {b['text'][:70]}")
print(' | '.join(' '.join(W[i]['w'] for i in c['words']) for c in subs))
