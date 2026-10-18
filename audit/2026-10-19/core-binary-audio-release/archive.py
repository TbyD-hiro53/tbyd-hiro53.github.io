from pathlib import Path
import json,hashlib,zipfile
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/core-binary-audio-release';D=Path('/workspace/previews/2026-10-19/core-binary-audio-release');D.mkdir(parents=True,exist_ok=True)
files=set()
for f in ['audio-devices/dependencies.json','audio-outdoor/runtime-dependencies.json','audio-outdoor/v1-static-dependencies.json']:
 files.update(x for x in json.loads((R/'audit/2026-10-19'/f).read_text()) if not x.endswith('.html'))
files.update(['core-37.html','binary-dusk.html','TECHNICAL_POLICY.md','core-37-v1-og-20260925.jpg'])
import re
for slug in ['core-37','binary-dusk']:
 for path in re.findall(r'https://tbyd-hiro53.github.io/([^\"<>]+\.(?:jpg|png|webp))',(R/(slug+'.html')).read_text()):files.add(path)
assert all((R/x).is_file() for x in files),[x for x in files if not (R/x).is_file()]
for folder in ['audio-devices','audio-outdoor','core-binary-audio-release']:
 files.update(str(p.relative_to(R)) for p in (R/'audit/2026-10-19'/folder).rglob('*') if p.is_file() and p.name not in ['archive-info.json','independent-results.json'])
blob={x:(R/x).read_bytes() for x in sorted(files)}
for id in ['554314','538210','517995','165580']:
 p=Path('/workspace/previews/2026-10-18/audio-survey')/(id+'-hq-preview.mp3');blob['sources/'+p.name]=p.read_bytes()
blob['README.md']=(A/'README.md').read_bytes();blob['index.html']=b'<!doctype html><html lang="en"><meta charset="utf-8"><title>Approved audio preservation</title><h1>Preserved artworks</h1><ul><li><a href="core-37.html?skipgc">Core No.37</a></li><li><a href="binary-dusk.html?skipgc">Binary Dusk</a></li></ul></html>'
manifest={k:{'bytes':len(v),'sha256':hashlib.sha256(v).hexdigest()} for k,v in blob.items()};blob['MANIFEST.json']=json.dumps(manifest,indent=2).encode()
z=D/'h53-core-binary-audio-release-20261019.zip'
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as f:
 for k,v in blob.items():f.writestr(k,v)
E=Path('/workspace/verification/core-binary-audio-release');E.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(z) as f:
 assert f.testzip() is None;f.extractall(E)
for k,v in manifest.items():assert hashlib.sha256((E/k).read_bytes()).hexdigest()==v['sha256']
info={'path':str(z),'bytes':z.stat().st_size,'sha256':hashlib.sha256(z.read_bytes()).hexdigest(),'entries':len(blob),'extract':str(E),'manifestVerified':True,'crcVerified':True}
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(info)
