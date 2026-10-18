from pathlib import Path
import json,zipfile,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/sanctum-silent-v2';E=Path('/workspace/verification/sanctum-silent-v2');Z=Path('/workspace/previews/2026-10-19/sanctum-silent-v2/h53-sanctum-silent-v2-20261019.zip');Z.parent.mkdir(parents=True,exist_ok=True)
names=set(json.loads((R/'audit/2026-10-19/audio-sanctum/dependencies.json').read_text()))-{'sanctum-audio-v1-20261019.js','interiors-audio-v1-20261019-room.mp3'}
for p in A.iterdir():
 if p.suffix in ['.md','.py','.json'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3)as z:
 for n in sorted(names):
  data=(R/n).read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 guide='Sanctum装置を無音としたプレビュー。展開先で python -m http.server 8083 を起動、/preview/20261017/sanctum.html?skipgc を開く。ギャラリー全体は含まず、作品と依存物の保存です。\n';z.writestr('README-ja.txt',guide);manifest['README-ja.txt']=hashlib.sha256(guide.encode()).hexdigest();z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip()is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h
(A/'archive-info.json').write_text(json.dumps(dict(archive=str(Z),bytes=Z.stat().st_size,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),files=len(manifest)+1,extraction=str(E)),indent=2));print('archive complete',len(manifest))
