import sys
from PIL import Image
import render as R
R.init()
ims=[Image.fromarray(R.frame(float(t))).resize((540,960)) for t in sys.argv[2:]]
sheet=Image.new('RGB',(540*len(ims),960))
for i,im in enumerate(ims): sheet.paste(im,(i*540,0))
sheet.save(sys.argv[1])
