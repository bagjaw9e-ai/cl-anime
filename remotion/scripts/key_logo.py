"""Key out hitam pekat logo -> alpha. alpha = kanal terang maksimum, warna di-unpremultiply
(warna & bentuk teks tidak berubah saat ditumpuk di atas hitam). Margin transparan penuh dipangkas
(teks & glow tidak tersentuh)."""
import numpy as np
from PIL import Image
src = np.asarray(Image.open('public/pmo_savior_original.png').convert('RGB')).astype(np.float64) / 255
a = src.max(axis=2)
a = np.clip((a - 0.012) / (1 - 0.012), 0, 1)          # buang noise hitam
rgb = np.where(a[..., None] > 1e-4, np.clip(src / np.maximum(a[..., None], 1e-4), 0, 1), 0)
out = np.dstack([rgb, a])
ys, xs = np.where(a > 0.004)
pad = 24
y0, y1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad)
x0, x1 = max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
Image.fromarray((out[y0:y1, x0:x1] * 255).round().astype(np.uint8), 'RGBA').save('public/pmo_savior.png')
print('crop box', (x0, y0, x1, y1), 'size', (x1 - x0, y1 - y0))
# cek rekonstruksi di atas hitam == aslinya
rec = rgb * a[..., None]
print('max error vs original (0-255):', np.abs(rec - src).max() * 255)
