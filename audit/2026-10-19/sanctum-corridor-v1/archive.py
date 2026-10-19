from pathlib import Path
import json,zipfile,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/sanctum-corridor-v1';E=Path('/workspace/verification/sanctum-corridor-v1');Z=Path('/workspace/previews/2026-10-19/sanctum-corridor-v1/h53-sanctum-corridor-v1-20261019.zip');Z.parent.mkdir(parents=True,exist_ok=True)
names=set(json.loads((R/'audit/2026-10-19/audio-sanctum/dependencies.json').read_text()))-{'sanctum-audio-v1-20261019.js','interiors-audio-v1-20261019-room.mp3'}
names|={'sanctum-corridor-v1-20261019.js','sanctum-corridor-v1-20261019-cave.mp3'}
for p in A.iterdir():
 if p.suffix in ['.md','.py','.json','.txt'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 def put(n,b):z.writestr(n,b);manifest[n]=hashlib.sha256(b).hexdigest()
 for n in sorted(names):put(n,(R/n).read_bytes())
 for p in Path('/workspace/render-work/sanctum-corridor-v1/source').rglob('*'):
  if p.is_file():put('source-handoff/'+p.relative_to('/workspace/render-work/sanctum-corridor-v1/source').as_posix(),p.read_bytes())
 original=Path('/tmp/codex-remote-attachments/01a13755-4440-73ed-8f26-9a0a423ae09c/FA3B12FE-6778-4C39-A983-755F3C298E94/1-sanctum-freesound-approved-20261019.zip');put('source-handoff-original.zip',original.read_bytes())
 put('README-ja.txt','Sanctum回廊音プレビュー一式。展開先で python -m http.server 8088 を起動し /preview/20261017/sanctum.html?skipgc を開いてください。メニュー隣のスピーカーで再生。初期消音。音源はFreesound HQ試聴MP3由来で、原本WAVではありません。出典・CC0利用条件・採用記録をsource-handoffとauditに保存。全ギャラリーの保存ではなく、一覧・他作品・外部出典へのリンクは範囲外です。'.encode())
 z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
(A/'archive-info.json').write_text(json.dumps({'archive':str(Z),'bytes':Z.stat().st_size,'sha256':hashlib.sha256(Z.read_bytes()).hexdigest(),'files':len(manifest)+1,'extraction':str(E),'allHashesVerified':True},indent=2));print('saved',len(manifest),'files')
