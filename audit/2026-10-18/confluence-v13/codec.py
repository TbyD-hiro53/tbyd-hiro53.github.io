import gzip,numpy as np,hashlib
MAGIC=b'H53D'
def decode(packed):
 raw=gzip.decompress(packed)
 if raw[:4]==MAGIC:
  raw=np.cumsum(np.frombuffer(raw[4:],np.uint8).reshape(-1,4),axis=0,dtype=np.uint32).astype(np.uint8).tobytes()
 return raw
def encode(raw,base=None):
 a=np.frombuffer(raw,np.uint8).reshape(-1,4);d=np.empty_like(a);d[0]=a[0];d[1:]=a[1:]-a[:-1]
 plain=gzip.compress(raw,compresslevel=6,mtime=0);delta=gzip.compress(MAGIC+d.tobytes(),compresslevel=6,mtime=0)
 packed,codec=(delta,'rgba-sub') if len(delta)<len(plain) else (plain,'raw');standalone=len(packed)
 if base is not None:
  assert len(base)==len(raw)
  xor=np.bitwise_xor(np.frombuffer(raw,np.uint8),np.frombuffer(base,np.uint8)).tobytes();patch=gzip.compress(b'H53X'+xor,compresslevel=6,mtime=0)
  if len(patch)<len(packed):packed,codec=patch,'v12-xor'
  diff=(np.frombuffer(raw,np.uint8)-np.frombuffer(base,np.uint8)).reshape(-1,4);sub=diff.copy();sub[1:]=diff[1:]-diff[:-1]
  additive=gzip.compress(b'H53B'+sub.tobytes(),compresslevel=6,mtime=0)
  if len(additive)<len(packed):packed,codec=additive,'v12-add-sub'
 restored=gzip.decompress(packed)
 if codec=='v12-xor':restored=np.bitwise_xor(np.frombuffer(restored[4:],np.uint8),np.frombuffer(base,np.uint8)).tobytes()
 elif codec=='v12-add-sub':
  diff=np.cumsum(np.frombuffer(restored[4:],np.uint8).reshape(-1,4),axis=0,dtype=np.uint32).astype(np.uint8).ravel();restored=(diff+np.frombuffer(base,np.uint8)).tobytes()
 else:restored=decode(packed)
 assert restored==raw
 return packed,{'codec':codec,'bytes':len(packed),'rawGzipBytes':len(plain),'standaloneBytes':standalone,'decodedSHA256':hashlib.sha256(raw).hexdigest()}
