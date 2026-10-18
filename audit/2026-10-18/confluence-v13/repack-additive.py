from pathlib import Path
import gzip,numpy as np,json
from codec import decode,encode
D=Path('/workspace/render-work/confluence-v13');R=Path('/workspace/tbyd-hiro53.github.io')
# Only completed bank maps: no render/pack job writes them after this point.
for p in R.glob('confluence-v13-20261018-bank-*.bin.gz'):
 name=p.name.removeprefix('confluence-v13-20261018-').removesuffix('.bin.gz');base=decode((R/p.name.replace('v13','v12')).read_bytes());raw=gzip.decompress(p.read_bytes())
 if raw[:4]==b'H53X':raw=np.bitwise_xor(np.frombuffer(raw[4:],np.uint8),np.frombuffer(base,np.uint8)).tobytes()
 else:raw=decode(p.read_bytes())
 data,info=encode(raw,base);p.write_bytes(data);(D/(name+'-codec.json')).write_text(json.dumps(info));print(name,info['codec'],info['bytes'],flush=True)
