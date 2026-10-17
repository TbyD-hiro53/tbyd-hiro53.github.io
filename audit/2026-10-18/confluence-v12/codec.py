import gzip,numpy as np,hashlib
MAGIC=b'H53D'
def encode(raw):
 a=np.frombuffer(raw,np.uint8).reshape(-1,4);d=np.empty_like(a);d[0]=a[0];d[1:]=a[1:]-a[:-1]
 plain=gzip.compress(raw,compresslevel=6,mtime=0);delta=gzip.compress(MAGIC+d.tobytes(),compresslevel=6,mtime=0)
 packed,codec=(delta,'rgba-sub') if len(delta)<len(plain) else (plain,'raw')
 decoded=gzip.decompress(packed)
 if decoded[:4]==MAGIC and len(decoded)==len(raw)+4:decoded=np.cumsum(np.frombuffer(decoded[4:],np.uint8).reshape(-1,4),axis=0,dtype=np.uint32).astype(np.uint8).tobytes()
 assert decoded==raw
 return packed,{'codec':codec,'bytes':len(packed),'rawGzipBytes':len(plain),'decodedSHA256':hashlib.sha256(raw).hexdigest()}
