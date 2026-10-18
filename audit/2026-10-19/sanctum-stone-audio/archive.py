from pathlib import Path
import json,zipfile,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/sanctum-stone-audio';E=Path('/workspace/verification/sanctum-stone-audio');Z=Path('/workspace/previews/2026-10-19/sanctum-stone-audio/h53-sanctum-stone-study-v1-20261019.zip');Z.parent.mkdir(parents=True,exist_ok=True);names={'preview/20261017/sanctum-stone-audio-v1.html','interiors-audio-v3-20261019-wind.mp3'}|{p.name for p in R.glob('sanctum-stone-study-v1-20261019-*.mp3')}
for directory in [A,R/'audit/2026-10-19/interior-wind-research']:
 for p in directory.iterdir():
  if p.suffix in ['.py','.json','.md','.txt'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3)as z:
 def put(n,data):z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 for n in sorted(names):put(n,(R/n).read_bytes())
 for p in Path('/workspace/previews/2026-10-19/sanctum-stone-sources').iterdir():
  if p.suffix in ['.wav','.txt']:put('source-ir/'+p.name,p.read_bytes())
 p=Path('/workspace/previews/2026-10-19/interiors-human-free-candidates/523389-hq-preview.mp3');put('source-recording/'+p.name,p.read_bytes())
 guide='石の回廊の音・3案比較。展開先で python -m http.server 8085 を起動し /preview/20261017/sanctum-stone-audio-v1.html を開く。ギャラリー/作品へのリンクは本アーカイブ外です。原IRの著作権および全知的財産権はAleksey Vaneevに帰属します。原IRは未改変で、利用条件全文source-ir/LICENSE.txtを同梱しています。無料の制作保存用であり、原IRの販売ではありません。\n';put('README-ja.txt',guide.encode());z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip()is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h
(A/'archive-info.json').write_text(json.dumps(dict(archive=str(Z),bytes=Z.stat().st_size,files=len(manifest)+1,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),extraction=str(E)),indent=2));print('study archive complete',len(manifest))
