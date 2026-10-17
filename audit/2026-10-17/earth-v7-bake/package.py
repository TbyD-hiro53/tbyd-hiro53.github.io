import os
from pathlib import Path
from PIL import Image
import numpy as np,sys
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v7'));D.mkdir(parents=True,exist_ok=True);repo=Path(os.environ.get('EO_REPO_DIR',str(Path(__file__).resolve().parents[3])))
for station in map(int,sys.argv[1:]):
 rgb=np.asarray(Image.open(D/f'interior-{station}-denoised.png').convert('RGB'),dtype=np.float32);depth=np.load(D/f'interior-{station}-depth.npy');valid=np.isfinite(depth)&(depth<63.99)&(depth>0)
 # Extend edge color underneath empty sky; depth alone supplies coverage.
 known=valid.copy()
 for i in range(8):
  sums=np.zeros_like(rgb);count=np.zeros(known.shape,dtype=np.float32)
  for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
   k=np.roll(known,(dy,dx),(0,1));c=np.roll(rgb,(dy,dx),(0,1));sums+=c*k[:,:,None];count+=k
  fill=(~known)&(count>0);rgb[fill]=sums[fill]/count[fill,None];known|=fill
 color=Image.fromarray(np.uint8(np.clip(rgb,0,255)+.5));d=np.where(valid,depth,64)
 for width in [4096,2048]:
  im=color if width==4096 else color.resize((width,width//2),Image.Resampling.LANCZOS)
  dd=d if width==4096 else np.asarray(Image.fromarray(d).resize((width,width//2),Image.Resampling.NEAREST))
  q=np.minimum(65534,np.rint(np.clip(dd,0,64)*65535/64)).astype(np.uint16);q[dd>=63.99]=65535
  packed=np.zeros((*q.shape,3),dtype=np.uint8);packed[:,:,0]=q>>8;packed[:,:,1]=q&255
  prefix=repo/f'earth-origin-material-v7-20261017-interior-{station}-{width}';im.save(str(prefix)+'-color.jpg',quality=95,subsampling=0);Image.fromarray(packed).save(D/f'interior-{station}-{width}-depth-packed.png');print(station,width,flush=True)
