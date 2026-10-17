from pathlib import Path
from PIL import Image
import numpy as np,os
r=Path(os.environ.get('H53_REPO','/workspace/tbyd-hiro53.github.io'))
for view in ['main','brain','sanc']:
 a=np.asarray(Image.open(r/f'lacto-tricore-v1-w1-{view}-phase.png').convert('RGB'));h,w=a.shape[:2];out=np.zeros((h,w,4),dtype=np.uint8);out[:,:,:3]=a;out[:,:,3]=128
 for y in range(h):
  xs=np.flatnonzero(a[y,:,2]>8)
  if len(xs)>1:out[y,:,3]=np.uint8(np.clip((np.arange(w)-xs[0])/max(1,xs[-1]-xs[0]),0,1)*255+.5)
 Image.fromarray(out).save(r/f'lacto-tricore-v1-w2-{view}-phase.png')
 print(view,w,h,int(np.count_nonzero(a[:,:,2])),flush=True)
