from pathlib import Path
import zipfile,hashlib,json,shutil
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/interiors-audio-release';O=Path('/workspace/previews/2026-10-19/interiors-audio-release');O.mkdir(parents=True,exist_ok=True)
src=Path('/workspace/previews/2026-10-19/interiors-audio-v3/h53-interiors-audio-v3-20261019.zip');dst=O/'h53-interiors-audio-release-20261019.zip';X=Path('/workspace/verification/interiors-audio-release')
works=['earth-origin-material','preservation-hall','shoko'];manifest={}
with zipfile.ZipFile(src) as old,zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 def add(n,b):z.writestr(n,b);manifest[n]=hashlib.sha256(b).hexdigest()
 for n in old.namelist():
  if not n.endswith('/') and n not in ['MANIFEST.json','README-ja.txt']:add(n,old.read(n))
 for f in [*[w+'.html' for w in works],'earth-origin-material-og.jpg','preservation-hall-v7-og-20260927.jpg','shoko-v1-og-20260927.jpg','favicon.ico']:
  if f not in manifest:add(f,(R/f).read_bytes())
 for p in sorted(A.glob('*')):
  if p.is_file() and p.name!='archive-info.json':add(str(p.relative_to(R)),p.read_bytes())
 add('index.html',('<!doctype html><meta charset="utf-8"><title>公開保存版・目次</title><h1>承認済み室内3作品</h1><p>保存ZIPの目次です。公開サイトのindexとは異なります。</p>'+''.join(f'<p><a href="{w}.html?skipgc">{w}</a></p>' for w in works)).encode())
 add('README-ja.txt','公開保存版 Earth / 保存棟 / SHOKO 音v3\nこのフォルダで python3 -m http.server 8084 を実行し、http://127.0.0.1:8084/ を開きます。\n3作品の公開HTML・描画/音依存・出典・元HQ音源を保持。indexは保存用目次です。\n'.encode())
 z.writestr('MANIFEST.json',json.dumps(manifest,ensure_ascii=False,indent=2))
with zipfile.ZipFile(dst) as z:
 assert z.testzip() is None
 for n,h in manifest.items():assert hashlib.sha256(z.read(n)).hexdigest()==h,n
 if X.exists():shutil.rmtree(X)
 z.extractall(X)
for n,h in manifest.items():assert hashlib.sha256((X/n).read_bytes()).hexdigest()==h,n
info={'archive':str(dst),'bytes':dst.stat().st_size,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest(),'manifestFiles':len(manifest),'extracted':str(X),'zipCRC':'PASS','allFileHashes':'PASS','sourceArchive':str(src)}
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
