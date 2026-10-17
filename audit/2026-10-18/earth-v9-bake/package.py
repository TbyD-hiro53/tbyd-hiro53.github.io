import os
from pathlib import Path
import sys,ctypes,os
import numpy as np
from PIL import Image
import oidn
lib=ctypes.CDLL(str(Path(oidn.__file__).parent/'lib.linux.x64/libOpenImageDenoise.so.1.4.3'));lib.oidnSetDevice1i.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int]
dev=oidn.NewDevice();lib.oidnSetDevice1i(dev,b'numThreads',1);oidn.CommitDevice(dev)
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v9'));r=Path(os.environ.get('EO_REPO_DIR','/workspace/tbyd-hiro53.github.io'))
for i in map(int,sys.argv[1:]):
 im=Image.open(D/f'detail-{i}.png').convert('RGBA');rgba=np.asarray(im,dtype=np.float32)/255;x=np.ascontiguousarray(rgba[:,:,:3]);
 if i==4:x=np.ascontiguousarray(x*rgba[:,:,3:4]+np.array([.73,.80,.78],dtype=np.float32)*(1-rgba[:,:,3:4]))
 y=np.zeros_like(x);normal=np.ascontiguousarray(np.load(D/f'detail-{i}-normal.npy'));albedo=np.ascontiguousarray(np.load(D/f'detail-{i}-albedo.npy'))
 f=oidn.NewFilter(dev,'RT');h,w=x.shape[:2]
 for key,data in [('color',x),('normal',normal),('albedo',albedo),('output',y)]:oidn.SetSharedFilterImage(f,key,data,oidn.FORMAT_FLOAT3,w,h)
 lib.oidnSetFilter1b.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_bool];lib.oidnSetFilter1b(f,b'srgb',True);oidn.CommitFilter(f);oidn.ExecuteFilter(f);assert oidn.GetDeviceError(dev)==0
 # Guided edge preservation with only 2% raw signal; reduce visible sampling grain. No sharpening or enlargement.
 y=.98*y+.02*x
 if i==4:
  depth=np.load(D/'detail-4-depth.npy')[:,:,0];xx=((np.arange(w)+.5)/w-.5)*2*.726542528;yy=(.5-(np.arange(h)+.5)/h)*2*.968723371;depth=np.nan_to_num(depth,nan=512,posinf=512)*np.sqrt(1+xx[None,:]**2+yy[:,None]**2);haze=(1-np.exp(-(depth*.008)**2))[:,:,None];y=y*(1-haze)+np.array([.73,.80,.78])*haze;name='earth-origin-material-v9-20261018-forest-hero-color.jpg'
 else:name=f'earth-origin-material-v9-20261018-interior-{i}-detail.jpg'
 if i==4:
  val=np.uint16(np.clip(depth/512,0,1)*65535+.5);dp=np.zeros((h,w,3),dtype=np.uint8);dp[:,:,0]=val>>8;dp[:,:,1]=val&255;Image.fromarray(dp).save(r/'earth-origin-material-v9-20261018-forest-hero-depth.png')
 Image.fromarray(np.uint8(np.clip(y,0,1)*255+.5)).save(r/name,quality=97,subsampling=0)
 oidn.ReleaseFilter(f);print('PACKAGED',i,flush=True)
oidn.ReleaseDevice(dev)
