import os
from PIL import Image
from pathlib import Path
import numpy as np,sys
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v6'));repo=Path(os.environ.get('EO_REPO_DIR','.')).resolve()
for station in sys.argv[1:]:
 hero=station=='hero';p=D/('hero-denoised.png' if hero else f'forest-{station}-denoised.png');color=np.asarray(Image.open(p).convert('RGB'),dtype=np.float32)/255
 d=np.load(D/('hero-depth.npy' if hero else f'depth-{station}.npy'));d=np.nan_to_num(d,nan=512,posinf=512,neginf=512)
 # Perspective Cycles Z is axial, unlike panorama distance. Convert to radial.
 if hero:
  h,w=d.shape;xx=((np.arange(w)+.5)/w-.5)*2*1.110612515;yy=(.5-(np.arange(h)+.5)/h)*2*1.480816687
  d=d*np.sqrt(1+xx[None,:]**2+yy[:,None]**2)
 # Compose haze before filtering, so packed nearest-depth edges cannot pixelate the color.
 haze=(1-np.exp(-(d*.008)**2))[:,:,None];color=color*(1-haze)+np.array([.73,.80,.78])*haze
 im=Image.fromarray(np.uint8(np.clip(color,0,1)*255+.5))
 if station=='3':
  im=im.resize((1024,512),Image.Resampling.LANCZOS);d=np.asarray(Image.fromarray(d).resize((1024,512),Image.Resampling.NEAREST))
 prefix=repo/f'earth-origin-material-v6-20261017-forest-{station}'
 im.save(str(prefix)+'-color.jpg',quality=94,subsampling=0)
 q=np.rint(np.clip(d,0,512)*65535/512).astype(np.uint16);rgb=np.zeros((*q.shape,3),dtype=np.uint8);rgb[:,:,0]=q>>8;rgb[:,:,1]=q&255
 Image.fromarray(rgb).save(str(prefix)+'-depth.png');print(station,im.size,float(np.median(d)),float(np.min(d)),flush=True)
