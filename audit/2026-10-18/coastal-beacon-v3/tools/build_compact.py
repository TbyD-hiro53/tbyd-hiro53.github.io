"""CPU-only compact derivative pack; no source changes or rerenders."""
from pathlib import Path
import gzip, hashlib, json, time
import numpy as np
R=Path(__file__).resolve().parents[1]/'repository'
E=R.parent/'compact';E.mkdir(exist_ok=True)
OLD='coastal-glass-beacon-v1-';NEW='coastal-glass-beacon-v2-'
start=time.monotonic();files=[]
def pack(name,a):
    a=np.asarray(a,np.uint8);h,w,c=a.shape
    delta=np.empty_like(a);delta[:,0]=a[:,0];delta[:,1:]=a[:,1:]-a[:,:-1]
    planar=delta.transpose(2,0,1).tobytes()
    z=gzip.compress(planar,9,mtime=0);(R/name).write_bytes(z)
    decoded=np.frombuffer(gzip.decompress(z),np.uint8).reshape(c,h,w).transpose(1,2,0)
    restored=np.cumsum(decoded,axis=1,dtype=np.uint32).astype(np.uint8)
    assert np.array_equal(a,restored)
    files.append(dict(file=name,bytes=len(z),decodedBytes=a.nbytes,sha256=hashlib.sha256(z).hexdigest(),rawSHA256=hashlib.sha256(a.tobytes()).hexdigest(),shape=[w,h,c]))
def logpack(name,source,w,h):
    a=np.frombuffer(gzip.decompress((R/source).read_bytes()),'<f2').reshape(h,w,4).astype(np.float32)
    assert np.isfinite(a).all() and a.min()>=0 and a[:,:,:3].max()<((2**18)-1)*1e-5
    q=np.empty((h,w,4),np.uint8)
    q[:,:,:3]=np.rint(np.log2(1+a[:,:,:3]/1e-5)/18*255).astype(np.uint8)
    q[:,:,3]=np.rint(a[:,:,3]*255).astype(np.uint8)
    pack(name,q)
    restored=(np.exp2(q[:,:,:3].astype(np.float32)/255*18)-1)*1e-5
    files[-1]['sourceHalfFloatBytes']=(R/source).stat().st_size
    files[-1]['linearRGBMAE']=float(np.abs(restored-a[:,:,:3]).mean())
    files[-1]['alphaMaxError']=float(np.abs(q[:,:,3]/255-a[:,:,3]).max())
bake=json.loads((R/(OLD+'bakes.json')).read_text())
for view,v in bake['views'].items():
    e=v['times']['night'];w,h=e['width'],e['height']
    name=NEW+view+'-night-log8.bin.gz';logpack(name,e['linear'],w,h);e['linear']=name
    s=np.frombuffer(gzip.decompress((R/e['surface']).read_bytes()),np.uint8).reshape(h,w,4)
    # One sample per 2x2 block: these maps affect only static diffuse response.
    # Preserve the full-resolution alpha/depth silhouette and shadow atlas.
    reduced=s[1::2,1::2].copy();sh,sw=reduced.shape[:2]
    name=NEW+view+'-surface-delta.bin.gz';pack(name,reduced)
    e.update(surface=name,surfaceWidth=sw,surfaceHeight=sh)
ref=bake['environments']['night'];name=NEW+'reflection-night-log8.bin.gz'
logpack(name,ref['reflection'],512,256);ref['reflection']=name
(R/(NEW+'bakes.json')).write_text(json.dumps(bake,indent=2)+'\n')
cfg=json.loads((R/(OLD+'night-config.json')).read_text());shadow=cfg['beacon']['shadow']
depth=np.frombuffer(gzip.decompress((R/shadow['file']).read_bytes()),np.uint8).reshape(shadow['height'],shadow['width'],4)
name=NEW+'depth-delta.bin.gz';pack(name,depth);shadow['file']=name
shadow.update(bytes=files[-1]['bytes'],sha256=files[-1]['sha256'])
shadow['format']='After transport reconstruction: raw RGBA8, RGB24 round(radial metres / 220 * 16777215), alpha255; bottom-to-top rows, nearest filtering, no mipmaps or colour conversion.'
shadow['transport']='gzip planar byte channels with horizontal modulo-256 predictor; reconstruct identical RGBA8 before use'
cfg['scope']='Compact rotating-beacon review: same full-resolution lighting/shadow layout, log8 radiance and half-size static diffuse receiver maps.'
(R/(NEW+'night-config.json')).write_text(json.dumps(cfg,indent=2)+'\n')
codec='''
function decodePlanes(b,w,h){
 if(b.byteLength!==w*h*4)throw Error('Invalid compact lighting data');
 const src=new Uint8Array(b),out=new Uint8Array(src.length),n=w*h;
 for(let c=0;c<4;c++)for(let y=0;y<h;y++){let p=0;const row=y*w;for(let x=0;x<w;x++){p=(p+src[c*n+row+x])&255;out[(row+x)*4+c]=p;}}
 return out;
}
const radianceLUT=new Uint16Array(256),alphaLUT=new Uint16Array(256);
for(let i=0;i<256;i++){radianceLUT[i]=T.DataUtils.toHalfFloat((Math.pow(2,i/255*18)-1)*.00001);alphaLUT[i]=T.DataUtils.toHalfFloat(i/255);}
'''
s=(R/(OLD+'renderer.js')).read_text().replace(OLD,NEW)
s=s.replace('async function halfTexture',codec+'\nasync function halfTexture',1)
s=s.replace("const b=await request(url,'gzip');if(b.byteLength!==w*h*8)","let b=await request(url,'gzip');if(url.endsWith('-log8.bin.gz')){const q=decodePlanes(b,w,h),half=new Uint16Array(q.length);for(let i=0;i<q.length;i+=4){half[i]=radianceLUT[q[i]];half[i+1]=radianceLUT[q[i+1]];half[i+2]=radianceLUT[q[i+2]];half[i+3]=alphaLUT[q[i+3]];}b=half.buffer;}if(b.byteLength!==w*h*8)")
s=s.replace("const b=await request(url,'gzip');if(b.byteLength!==w*h*4)","let b=await request(url,'gzip');if(url.endsWith('-delta.bin.gz'))b=decodePlanes(b,w,h).buffer;if(b.byteLength!==w*h*4)")
s=s.replace('this.cachedRaw(entry.surface,entry.width,entry.height)','this.cachedRaw(entry.surface,entry.surfaceWidth,entry.surfaceHeight)')
(R/(NEW+'renderer.js')).write_text(s)
for suffix in ['app.js','night.js','picking.js','preview.html']:
    s=(R/(OLD+suffix)).read_text().replace(OLD,NEW)
    if suffix=='preview.html':s=s.replace('</head><body>','<script defer src="h53-reading-layout-v3-20261018.js"></script></head><body>')
    (R/(NEW+suffix)).write_text(s)
old=sum((R/f['file'].replace(NEW,OLD).replace('-log8','').replace('-delta','')).stat().st_size for f in files)
report=dict(status='candidate',seconds=time.monotonic()-start,originalAssetBytes=old,compactAssetBytes=sum(f['bytes'] for f in files),files=files,shadowRawIdentical=True,renderingPerformed=False)
(E/'packing.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='files'}));print([(f['file'],f['bytes']) for f in files])
