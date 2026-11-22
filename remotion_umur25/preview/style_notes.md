# Style notes — video "umur25" mengikuti /style3

Sumber yang dipelajari:
- Skill `/style3` (`.claude/skills/style3/SKILL.md`) + kode kit `remotion_3fase/` (di-copy ke project ini).
- Video hasil /style3 `reference/style3_video_3fase.mp4` (126,7 dtk): 254 frame 2 fps di `reference/frames/`,
  contact sheet `preview/style3_contact.jpg`.
- Scene detection `gt(scene,0.25)` hanya menangkap 2 kilatan blitz (0,13 & 0,73 dtk) → semua pergantian tempat di /style3 memakai
  transisi halus (tidak ada hard cut). Strip 15 fps di 7 titik transisi tempat: `reference/cuts/tr_*.jpg`, `preview/style3_transitions.jpg`.
- `reference/style3_style_notes.md` (kombinasi ref_1 + ref_2 yang menjadi dasar /style3).

## Gaya visual /style3 (dipakai apa adanya)
- **Dunia flat 2D vector ala ref_2 + cahaya gelap sinematik ala ref_1.** Ruangan nyata (dinding gradasi, lantai berpapan,
  furnitur, jendela) tanpa outline, shading gradasi + bayangan oval.
- Ruangan **diredupkan** (overlay gelap 20–60%) + **blur tipis depth-of-field** (1,5–3 px) + **spotlight** radial lembut ke subjek,
  vignette kuat, grain halus. Subjek yang dibahas paling terang.
- **Karakter selalu "lit"**: rim light 2 sisi (putih hangat kiri-atas, amber/warna mood kanan) + backlight siluet + halo di
  belakang + pantulan halus di lantai. Warna halo mengikuti mood tempat.
- Objek ilustrasi menyala (warna terang, halo radial), elemen pendukung abu-abu/redup, partikel cahaya kecil naik.
- Tone bergeser halus di dalam satu tempat (mis. hangat → dingin lewat prop `cold`).

## Palet per tempat (video ini)
| bagian | tempat | dinding | aksen/cahaya utama |
|---|---|---|---|
| HOOK + ONE SHOT | kamar pria malam ultah | hangat `#5A3A50`→ redup → maroon `#3A0E18` | lilin `#FFC870`, HP merah `#FF3B3B` |
| EFEK 1 | ruang makan/tamu keluarga malam | oranye hangat `#B07A52` → panas kemerahan `#8A2E22` | lampu gantung `#FFC870`, merah marah |
| MID-CTA | panggung gelap minimalis | navy `#0E1320`→`#1B2233` | amber `#FFB23F`, putih hangat `#FFF4E0` |
| EFEK 2 | trotoar + halte bus sore-malam | ungu-magenta `#4A2A5E`→`#2A1838` | lampu jalan `#FFD27A`, pink blur `#FF5FA2` |
| EFEK 3 | kafe / ruang meeting | abu-biru pucat `#6E7E8E`→`#4A5868` | lampu gantung pucat `#DDE8F4`, aksen kopi `#B07A4E` |
| PENUTUP | gelap | `#05060A` | merah retak `#FF3B3B` |
Karakter jaket navy `#1F2747` → di tempat kebiruan/ungu WAJIB rim + halo hangat.

## Cara elemen masuk/keluar (dari /style3)
- `pop`: overshoot 0 → 1,1 → 1 (±9 frame) untuk properti/ikon (ala ref_2).
- `glow`: fade + skala halus ±16 frame untuk objek yang "menyala" (ala ref_1), lalu partikel naik.
- `rise`: naik dari bawah untuk siluet/papan.
- Keluar: skala 1 → 0,9 + fade 6 frame saat ilustrasi berikutnya masuk; maks 3 elemen bareng.
- Garis putus-putus penunjuk dari objek ke karakter (ref_2). Karakter selalu hidup (napas, weight shift, kedip, lirikan, gestur).

## Transisi (dari /style3)
| jenis | dipakai saat | ciri |
|---|---|---|
| `light` light sweep | keluar dari retakan / masuk tempat terang | layar dibanjiri cahaya berwarna lalu scene baru muncul, ±14 f |
| `dark` fade lewat gelap | masuk panggung gelap / suasana muram | scene lama gelap dulu, baru scene baru nyala pelan, ±20 f |
| `whip` whip slide + motion blur | ganti tempat cepat | scene lama terdorong kiri, baru masuk dari kanan, blur 18 px, 8–10 f |
| `blend` match cut + kilat | bentuk sama nyambung | dissolve singkat + kilat, ±6 f |
| di dalam tempat | ganti fokus | camera move halus (push/pan/tilt) + rack focus (blur latar berubah), tanpa cut |
- HOOK /style3: frame 0 langsung bergerak, blitz/flash, snap zoom ke objek lalu balik.
- ONE SHOT /style3: zoom eksponensial ease-in-out tanpa cut sampai tembus retakan → light sweep berwarna ke tempat berikutnya.

## Penyesuaian dari brief video ini (bukan gaya, tapi aturan layout/konten)
- Background **lebih sepi** dari /style3: furnitur secukupnya, detail rendah, tetap redup + blur tipis.
- Ilustrasi **ukuran medium**: utama ±400–650 px, ikon pendukung ≥ ±200 px.
- **Subtitle poin penting** selalu menempel ke ilustrasi relevannya, di tengah/di atas objek (bukan zona lantai seperti /style3),
  110–150 px, animasi masuk kuat & variatif (slam+shake, scale punch 0→1,25→1, mask wipe, stamp/cap, ink splash, kertas sobek),
  keluar cepat 6–8 frame. Subtitle 3 kata disembunyikan selama tampil.
- Label chip [EFEK 1/2/3] + 3 slot ikon otak yang **retak** satu-satu (open loop).
- One shot beat 3–5 dengan **background berubah pelan** (dekorasi ultah layu, warna hangat → maroon, dinding jadi "layar bayangan").
- Durasi = VO + **1 dtk** scene penutup (tanpa narasi & tanpa subtitle).
- Audio: SFX animasi 20% VO, SFX transisi/kamera 10% VO, BGM 1%.
