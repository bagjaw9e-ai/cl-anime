import sys, glob
from PIL import Image
files = sorted(glob.glob('preview/scenes/s*.png'))
sel = [f for f in files if not sys.argv[2:] or any(f.endswith(f's{int(i):02d}.png') for i in sys.argv[2:])]
cols = 6; w, h = 270, 480
rows = (len(sel) + cols - 1) // cols
im = Image.new('RGB', (cols * w, rows * h), (0, 0, 0))
for i, f in enumerate(sel):
    im.paste(Image.open(f).convert('RGB').resize((w, h)), ((i % cols) * w, (i // cols) * h))
im.save(sys.argv[1])
