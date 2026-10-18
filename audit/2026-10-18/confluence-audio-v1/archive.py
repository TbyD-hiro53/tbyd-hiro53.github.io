from pathlib import Path
import json,zipfile,hashlib,shutil
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/confluence-audio-v1');A=R/'audit/2026-10-18/confluence-audio-v1';O=Path('/workspace/previews/2026-10-18/confluence-audio-v1');O.mkdir(parents=True,exist_ok=True)
sources=json.loads((A/'sources.json').read_text())
for s in sources:s['note']='Previously auditioned water source, now used in Confluence audio preview.';s['status']='公開HQ MP3取得済み・Confluenceプレビューへ組み込み／原音WAV未取得'
(A/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2));shutil.copy2(D/'archive.py',A/'archive.py')
files=set(json.loads((D/'results.json').read_text())[-1]['dependencies']);files.add('confluence-v7-20261017-og.jpg')
for f in A.iterdir():
 if f.is_file():files.add(str(f.relative_to(R)))
p=O/'h53-confluence-audio-v1-20261018.zip';extraction=Path('/workspace/verification/confluence-audio-v1')
with zipfile.ZipFile(p,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name in sorted(files):z.write(R/name,name)
 for s in sources:
  f=Path('/workspace/previews/2026-10-18/audio-survey')/s['file'];assert hashlib.sha256(f.read_bytes()).hexdigest()==s['sha256'];z.write(f,'source-previews/'+f.name)
 z.writestr('preview/20261017/index.html','<!doctype html><meta charset="utf-8"><a href="confluence.html?skipgc&revision=audio-v1">The Confluence — 視点で変わる水音</a>')
 z.writestr('README-ja.txt','Confluence 音付きプレビュー。展開先で python -m http.server 8072 を起動し、http://localhost:8072/preview/20261017/confluence.html?skipgc を開きます。メニュー横のスピーカーで音を入れ、下の3視点とドラッグで音の距離・方向の変化を確認できます。\n全視点の描画依存物、共有JS/CSS、2音声と公開HQ原素材、出典・加工記録を同梱。作品一覧はこの保存版への案内に置換しています。他作品の本体や編集用Blender原本は含みません。既存のBlender原本はConfluence v13 production ZIPを参照。file://直接動作は未検証。\n')
 names=z.namelist();manifest={n:hashlib.sha256(z.read(n)).hexdigest() for n in names};z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(extraction)
 for n,h in manifest.items():assert hashlib.sha256((extraction/n).read_bytes()).hexdigest()==h
info={'archive':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'files':len(names)+1,'crc':'passed','extractedHashes':'all matched','extraction':str(extraction)};(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(info,flush=True)
