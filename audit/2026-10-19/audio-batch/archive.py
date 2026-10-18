from pathlib import Path
import zipfile,hashlib,json,subprocess,time
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/audio-batch');A=R/'audit/2026-10-19/audio-batch';O=Path('/workspace/previews/2026-10-19/audio-batch');O.mkdir(parents=True,exist_ok=True)
P=O/'h53-ten-works-audio-preview-v1-20261019.zip';E=Path('/workspace/verification/audio-batch-v1')
# Snapshot all deployed website files: includes every lazy scene, portrait/landscape bake and fallback.
files=[p for p in R.rglob('*') if p.is_file() and '.git' not in p.relative_to(R).parts and p != A/'archive-info.json']
files.sort();raw=Path('/workspace/previews/2026-10-18/audio-survey');ids=['700254','554314','517995','451614','538210','479322','197705','165580']
with zipfile.ZipFile(P,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 manifest={}
 for p in files:
  n=p.relative_to(R).as_posix();data=p.read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 for ident in ids:
  p=raw/(ident+'-hq-preview.mp3');n='source-previews/'+p.name;data=p.read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 guide='h!ro53 — 10作品の音付きプレビュー\n展開先で python -m http.server 8075 を実行し、http://localhost:8075/preview/20261017/audio-preview-v1.html を開きます。各作品のメニュー横スピーカーで音を開始。\n全サイトの配信ファイルを保存し、縦横・全視点・遅延読み込み依存物を含めています。公開済み作品と音の試聴版は別URLです。原音は公開HQ MP3、元WAV/FLAC・制作Blender原本は含みません。file://直接起動は未検証。音源と加工記録は各メニューおよびaudit/2026-10-19/を参照。\n'
 z.writestr('AUDIO-PREVIEW-README-ja.txt',guide);manifest['AUDIO-PREVIEW-README-ja.txt']=hashlib.sha256(guide.encode()).hexdigest();z.writestr('AUDIO-PREVIEW-MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
info={'archive':str(P),'bytes':P.stat().st_size,'sha256':hashlib.sha256(P.read_bytes()).hexdigest(),'files':len(manifest)+1,'extraction':str(E),'crc':'passed','extractedHashes':'all matched','scope':'All site files and eight raw source HQ MP3 previews; no Git metadata or Blender edit sources'};(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info),flush=True)
