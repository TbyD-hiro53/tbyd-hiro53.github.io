from pathlib import Path
import numpy as np,sys,gzip,ctypes,json
import oidn
from codec import encode,decode
D=Path('/workspace/render-work/confluence-v13');R=Path('/workspace/tbyd-hiro53.github.io');prefix=sys.argv[1];kind=prefix.split('-')[1]
lib=ctypes.CDLL(str(Path(oidn.__file__).parent/'lib.linux.x64/libOpenImageDenoise.so.1.4.3'));lib.oidnSetDevice1i.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_int];lib.oidnSetFilter1b.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_bool]
dev=oidn.NewDevice();lib.oidnSetDevice1i(dev,b'numThreads',2);oidn.CommitDevice(dev)
x=np.load(D/(prefix+'-image.npy'));normal=np.load(D/(prefix+'-normal.npy'));albedo=np.load(D/(prefix+'-albedo.npy'));h,w=x.shape[:2]
def denoise(x):
 y=np.zeros_like(x);f=oidn.NewFilter(dev,'RT')
 for key,data in [('color',x),('normal',normal),('albedo',albedo),('output',y)]:oidn.SetSharedFilterImage(f,key,data,oidn.FORMAT_FLOAT3,w,h)
 lib.oidnSetFilter1b(f,b'hdr',True);lib.oidnSetFilter1b(f,b'srgb',False);oidn.CommitFilter(f);oidn.ExecuteFilter(f);assert oidn.GetDeviceError(dev)==0;oidn.ReleaseFilter(f);return y
rgb=.99*denoise(x)+.01*x;del x
sun=denoise(np.load(D/(prefix+'-sun.npy')));del normal,albedo
# Cycles perspective Z is axial; equirectangular Z is radial.
depth=np.load(D/(prefix+'-depth.npy'))[:,:,0].copy()
if kind=='detail':
 xx=((np.arange(w)+.5)/w-.5)*2*np.tan(np.deg2rad(41));yy=(.5-(np.arange(h)+.5)/h)*2*np.tan(np.deg2rad(41));depth*=np.sqrt(1+xx[None,:]**2+yy[:,None]**2)
finite=np.isfinite(depth)&(depth<2000);fog=(1-np.exp(-np.minimum(depth,2048)**2*.0035**2))*finite;rgb*=1-fog[:,:,None];rgb+=fog[:,:,None]*np.array([185,204,205])/255;sun*=1-fog[:,:,None]
fraction=np.clip((sun@np.array([.2126,.7152,.0722]))/np.maximum(.001,rgb@np.array([.2126,.7152,.0722])),0,1);fraction*=finite
mult=np.maximum(1,np.ceil(np.max(rgb,axis=2)/16*255));mult=np.minimum(mult,255);col=np.empty((h,w,4),np.uint8);col[:,:,:3]=np.uint8(np.clip(rgb/(mult[:,:,None]/255*16),0,1)*255+.5);col[:,:,3]=mult
value=np.uint16(np.clip(np.log2(1+np.minimum(depth,2048))/np.log2(2049),0,1)*65535+.5);dp=np.full((h,w,4),255,np.uint8);dp[:,:,0]=value>>8;dp[:,:,1]=value&255;dp[:,:,2]=np.uint8(fraction*255+.5)
for label,data in [('color',col),('depth',dp)]:
 path=R/('confluence-v13-20261018-'+prefix+'-'+label+'.bin.gz')
 base=decode((R/('confluence-v12-20261018-'+prefix+'-'+label+'.bin.gz')).read_bytes());packed,info=encode(data.tobytes(),base);path.write_bytes(packed);(D/(prefix+'-'+label+'-codec.json')).write_text(json.dumps(info))
 print('PACKAGED',path.name,path.stat().st_size,flush=True)
# Keep visual pilot and blend; free ephemeral linear/guide passes after packaging.
for suffix in ['image','normal','albedo','depth','sun']:
 for file in [D/(prefix+'-'+suffix+'.npy'),D/(prefix+'-'+suffix+'-0001.exr')]:file.unlink()
(D/(prefix+'-packaged.json')).write_text(json.dumps({'w':w,'h':h,'depthFinite':float(finite.mean()),'directMean':float(fraction.mean()),'maxRGB':float(rgb.max())}))
oidn.ReleaseDevice(dev)
