import sys,os
if sys.argv[-1]=="0-side":sys.exit(0)
from pathlib import Path
import sys,ctypes,json,numpy as np
from PIL import Image
import oidn
D=Path(os.environ.get('H53_EARTH_OUTPUT','/tmp/earth-v11'));R=Path(os.environ.get('H53_SITE_ROOT','/workspace/tbyd-hiro53.github.io'));key=sys.argv[-1];meta=json.loads((D/(key+'.json')).read_text());w,h=meta['width'],meta['height']
lib=ctypes.CDLL(str(Path(oidn.__file__).parent/'lib.linux.x64/libOpenImageDenoise.so.1.4.3'));lib.oidnSetDevice1i.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int];lib.oidnSetFilter1b.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_bool]
dev=oidn.NewDevice();lib.oidnSetDevice1i(dev,b'numThreads',1);oidn.CommitDevice(dev)
rgba=np.asarray(Image.open(D/(key+'.png')).convert('RGBA'),dtype=np.float32)/255
fog=np.array([.73,.80,.78],dtype=np.float32);x=np.ascontiguousarray(rgba[:,:,:3]*rgba[:,:,3:4]+fog*(1-rgba[:,:,3:4]));y=np.zeros_like(x)
normal=np.ascontiguousarray(np.load(D/(key+'-normal.npy')));albedo=np.ascontiguousarray(np.load(D/(key+'-albedo.npy')))
f=oidn.NewFilter(dev,'RT')
for name,arr in [('color',x),('normal',normal),('albedo',albedo),('output',y)]:oidn.SetSharedFilterImage(f,name,arr,oidn.FORMAT_FLOAT3,w,h)
lib.oidnSetFilter1b(f,b'srgb',True);oidn.CommitFilter(f);oidn.ExecuteFilter(f);assert oidn.GetDeviceError(dev)==0
y=.98*y+.02*x;tan=np.tan(np.radians(meta['fov'])/2);xx=((np.arange(w)+.5)/w-.5)*2*tan;yy=(.5-(np.arange(h)+.5)/h)*2*tan*h/w
depth=np.nan_to_num(np.load(D/(key+'-depth.npy'))[:,:,0],nan=512,posinf=512)*np.sqrt(1+xx[None,:]**2+yy[:,None]**2);haze=(1-np.exp(-(depth*.008)**2))[:,:,None];y=y*(1-haze)+fog*haze
prefix=R/('earth-origin-material-v11-20261018-forest-'+key)
Image.fromarray(np.uint8(np.clip(y,0,1)*255+.5)).save(str(prefix)+'-color.jpg',quality=97,subsampling=0)
val=np.uint16(np.clip(depth/512,0,1)*65535+.5);dp=np.zeros((h,w,3),dtype=np.uint8);dp[:,:,0]=val>>8;dp[:,:,1]=val&255;Image.fromarray(dp).save(str(prefix)+'-depth.png')
oidn.ReleaseFilter(f);oidn.ReleaseDevice(dev)
# Compact fallback is a matching perspective, not the old panorama. Only fallback is resized.
for suffix in ['-color.jpg','-depth.png']:
 im=Image.open(str(prefix)+suffix);im.resize((min(1536,w),round(h*min(1536,w)/w)),Image.Resampling.NEAREST if 'depth' in suffix else Image.Resampling.LANCZOS).save(str(prefix)+'-small'+suffix,**({'quality':95,'subsampling':0} if suffix.endswith('.jpg') else {}))
print('PACKAGED',key,flush=True)
