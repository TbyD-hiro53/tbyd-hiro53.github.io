import os
from pathlib import Path
import sys,ctypes
import numpy as np
from PIL import Image
import oidn
lib=ctypes.CDLL(str(Path(oidn.__file__).parent/'lib.linux.x64/libOpenImageDenoise.so.1.4.3'))
lib.oidnSetDevice1i.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int]
dev=oidn.NewDevice();lib.oidnSetDevice1i(dev,b'numThreads',2);oidn.CommitDevice(dev)
for name in sys.argv[1:]:
 p=Path(name);s=np.asarray(Image.open(p).convert('RGB'),dtype=np.float32)/255
 x=np.ascontiguousarray(np.where(s<=.04045,s/12.92,((s+.055)/1.055)**2.4),dtype=np.float32);y=np.zeros_like(x)
 f=oidn.NewFilter(dev,'RT');h,w=x.shape[:2]
 oidn.SetSharedFilterImage(f,'color',x,oidn.FORMAT_FLOAT3,w,h);oidn.SetSharedFilterImage(f,'output',y,oidn.FORMAT_FLOAT3,w,h)
 oidn.CommitFilter(f);oidn.ExecuteFilter(f)
 assert oidn.GetDeviceError(dev)==0
 y=np.maximum(y,0);y=np.where(y<=.0031308,y*12.92,1.055*y**(1/2.4)-.055)
 Image.fromarray(np.uint8(np.clip(y,0,1)*255+.5)).save(p.with_stem(p.stem+'-denoised'))
 oidn.ReleaseFilter(f);print(p,flush=True)
oidn.ReleaseDevice(dev)
