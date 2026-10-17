import os
import bpy,sys,numpy as np
from pathlib import Path
D=Path(os.environ.get('EO_DETAIL_DIR','/tmp/earth-v8'));i=int(sys.argv[-1])
for name in ['normal','albedo']:
 p=D/f'detail-{i}-{name}-0001.exr';im=bpy.data.images.load(str(p));w,h=im.size;buf=np.empty(w*h*4,dtype=np.float32);im.pixels.foreach_get(buf);np.save(D/f'detail-{i}-{name}.npy',buf.reshape(h,w,4)[::-1,:,:3]);bpy.data.images.remove(im)
