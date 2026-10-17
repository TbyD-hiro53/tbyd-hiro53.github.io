import os
from pathlib import Path
import sys,ctypes,os
import numpy as np
from PIL import Image
import oidn
lib=ctypes.CDLL(str(Path(oidn.__file__).parent/'lib.linux.x64/libOpenImageDenoise.so.1.4.3'));lib.oidnSetDevice1i.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int]
dev=oidn.NewDevice();lib.oidnSetDevice1i(dev,b'numThreads',1);oidn.CommitDevice(dev)
D=Path(os.environ.get('EO_DETAIL_DIR','/tmp/earth-v8'));r=Path(os.environ.get('EO_REPO_DIR',str(Path(__file__).resolve().parents[3])))
for i in map(int,sys.argv[1:]):
 im=Image.open(D/f'detail-{i}.png').convert('RGB');x=np.ascontiguousarray(np.asarray(im,dtype=np.float32)/255);y=np.zeros_like(x);normal=np.ascontiguousarray(np.load(D/f'detail-{i}-normal.npy'));albedo=np.ascontiguousarray(np.load(D/f'detail-{i}-albedo.npy'))
 f=oidn.NewFilter(dev,'RT');h,w=x.shape[:2]
 for key,data in [('color',x),('normal',normal),('albedo',albedo),('output',y)]:oidn.SetSharedFilterImage(f,key,data,oidn.FORMAT_FLOAT3,w,h)
 lib.oidnSetFilter1b.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_bool];lib.oidnSetFilter1b(f,b'srgb',True);oidn.CommitFilter(f);oidn.ExecuteFilter(f);assert oidn.GetDeviceError(dev)==0
 # Keep a little original signal to avoid a waxy denoised surface. No sharpening or enlargement.
 y=.92*y+.08*x
 if i==4:
  depth=np.load(os.environ.get('EO_FOREST_DEPTH','/tmp/earth-v6/hero-depth.npy'));xx=((np.arange(w)+.5)/w-.5)*2*1.110612515;yy=(.5-(np.arange(h)+.5)/h)*2*1.480816687;depth=np.nan_to_num(depth,nan=512,posinf=512)*np.sqrt(1+xx[None,:]**2+yy[:,None]**2);haze=(1-np.exp(-(depth*.008)**2))[:,:,None];y=y*(1-haze)+np.array([.73,.80,.78])*haze;name='earth-origin-material-v8-20261017-forest-hero-color.jpg'
 else:name=f'earth-origin-material-v8-20261017-interior-{i}-detail.jpg'
 Image.fromarray(np.uint8(np.clip(y,0,1)*255+.5)).save(r/name,quality=97,subsampling=0)
 oidn.ReleaseFilter(f);print('PACKAGED',i,flush=True)
oidn.ReleaseDevice(dev)
