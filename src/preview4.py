import sys, time
from PIL import Image
import render4 as R
R.init()
ts = [float(x) for x in sys.argv[2:]]
ims = []
for t in ts:
    a = time.time(); arr = R.frame(t); print(t, round(time.time() - a, 3), flush=True)
    ims.append(Image.fromarray(arr).resize((270, 480)))
cols = min(len(ims), 6); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 270, rows * 480))
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
sheet.save(sys.argv[1])
