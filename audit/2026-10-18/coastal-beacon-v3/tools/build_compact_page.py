"""Extend the compact night transport to the complete page; CPU only."""
from pathlib import Path
import gzip,hashlib,json,time
import numpy as np
from PIL import Image
R=Path(__file__).resolve().parents[1]/'repository';E=R.parent/'compact';start=time.monotonic()
OLD='coastal-glass-beacon-v2-';NEW='coastal-glass-beacon-v3-';files=[]
def record(name,b,raw):
    (R/name).write_bytes(b);files.append(dict(file=name,bytes=len(b),decodedBytes=len(raw),sha256=hashlib.sha256(b).hexdigest(),rawSHA256=hashlib.sha256(raw).hexdigest()))
def pack(name,a):
    h,w,c=a.shape;d=np.empty_like(a);d[:,0]=a[:,0];d[:,1:]=a[:,1:]-a[:,:-1]
    z=gzip.compress(d.transpose(2,0,1).tobytes(),9,mtime=0)
    restored=np.cumsum(np.frombuffer(gzip.decompress(z),np.uint8).reshape(c,h,w).transpose(1,2,0),axis=1,dtype=np.uint32).astype(np.uint8)
    assert np.array_equal(a,restored);record(name,z,a.tobytes())
bake=json.loads((R/(OLD+'bakes.json')).read_text())
for view,v in bake['views'].items():
    e=v['times']['mid-sunset'];w,h=e['width'],e['height']
    a=np.frombuffer(gzip.decompress((R/e['linear']).read_bytes()),'<f2').reshape(h,w,4).astype(np.float32)
    assert a.min()>=0 and a[:,:,:3].max()<(2**18-1)*1e-5
    q=np.empty((h,w,4),np.uint8);q[:,:,:3]=np.rint(np.log2(1+a[:,:,:3]/1e-5)/18*255).astype(np.uint8);q[:,:,3]=np.rint(a[:,:,3]*255).astype(np.uint8)
    name=NEW+view+'-sunset-log8.bin.gz';pack(name,q);e['linear']=name
    depth=np.asarray(Image.open(R/v['depth']).convert('RGBA'),np.uint8)
    name=NEW+view+'-scene-depth-delta.bin.gz';pack(name,depth)
    v.update(depth=name,depthWidth=depth.shape[1],depthHeight=depth.shape[0])
raw=(R/'coastal-glass-rt-v2-geometry.bin').read_bytes();record(NEW+'geometry.bin.gz',gzip.compress(raw,9,mtime=0),raw)
(R/(NEW+'bakes.json')).write_text(json.dumps(bake,indent=2)+'\n')
s=(R/(OLD+'renderer.js')).read_text()
s=s.replace("json('"+OLD+"bakes.json')","json('"+NEW+"bakes.json')")
s=s.replace("buffer(P+'geometry.bin')","request('"+NEW+"geometry.bin.gz','gzip')")
s=s.replace('this.cachedTexture(v.depth)',"v.depth.endsWith('-delta.bin.gz')?this.cachedRaw(v.depth,v.depthWidth,v.depthHeight):this.cachedTexture(v.depth)")
s=s.replace('depthTex.minFilter=T.NearestFilter;',"if(v.depth.endsWith('-delta.bin.gz')&&!depthTex.flipY){depthTex.flipY=true;depthTex.needsUpdate=true;}depthTex.minFilter=T.NearestFilter;")
old="if(!this.depthDataCache.has(v.depth)){const dc=document.createElement('canvas');dc.width=depthTex.image.width;dc.height=depthTex.image.height;const cx=dc.getContext('2d',{willReadFrequently:true});cx.drawImage(depthTex.image,0,0);this.depthDataCache.set(v.depth,{pixels:cx.getImageData(0,0,dc.width,dc.height).data,size:[dc.width,dc.height]});}"
new="if(!this.depthDataCache.has(v.depth)){const im=depthTex.image;if(im.data){this.depthDataCache.set(v.depth,{pixels:im.data,size:[im.width,im.height]});}else{const dc=document.createElement('canvas');dc.width=im.width;dc.height=im.height;const cx=dc.getContext('2d',{willReadFrequently:true});cx.drawImage(im,0,0);this.depthDataCache.set(v.depth,{pixels:cx.getImageData(0,0,dc.width,dc.height).data,size:[dc.width,dc.height]});}}"
assert old in s;s=s.replace(old,new);(R/(NEW+'renderer.js')).write_text(s)
s=(R/(OLD+'preview.html')).read_text().replace(OLD+'renderer.js',NEW+'renderer.js');(R/(NEW+'preview.html')).write_text(s)
s=(R/(OLD+'production-check.html')).read_text().replace(OLD+'renderer.js',NEW+'renderer.js');(R/(NEW+'production-check.html')).write_text(s)
report=dict(seconds=time.monotonic()-start,files=files,extraCompactBytes=sum(f['bytes'] for f in files),geometryAndSceneDepthLossless=True,renderingPerformed=False)
(E/'page-packing.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
