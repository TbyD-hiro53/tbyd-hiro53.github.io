from pathlib import Path
import json,zipfile,hashlib,shutil
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/xerophyte-audio-v1')
A=R/'audit/2026-10-18/xerophyte-audio-v1';O=Path('/workspace/previews/2026-10-18/xerophyte-audio-v1');O.mkdir(parents=True,exist_ok=True)
for name in ['build_audio.py','test.py','archive.py','browser-validation.json']:
    shutil.copy2(D/name,A/name)
results=json.loads((D/'browser-validation.json').read_text())
dependencies=next(r['requestedLocalDependencies'] for r in results if 'requestedLocalDependencies' in r)
dependencies+=['favicon.ico','xerophyte-v1-og-20260926.jpg']
previous=Path('/workspace/previews/2026-10-18/audio-sand-v4/h53-audio-review-v4-20261018.zip')
target=O/'h53-xerophyte-audio-v1-20261018.zip'
with zipfile.ZipFile(previous) as old,zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name in old.namelist():
        if name in ['README-ja.txt','MANIFEST.json','preview/20261017/index.html']:continue
        path=R/name
        z.writestr(name,path.read_bytes() if path.is_file() else old.read(name))
    for name in dependencies:z.write(R/name,name)
    for f in sorted(A.iterdir()):
        if f.is_file():z.write(f,str(f.relative_to(R)))
    entry='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Xerophyte 音付き保存版</title><p><a href="/preview/20261017/xerophyte.html?skipgc">Xerophyte — 風と砂嵐</a></p><p><a href="/preview/20261017/audio-survey-v4.html">採用音源と試聴資料</a></p>'
    z.writestr('index.html',entry);z.writestr('preview/20261017/index.html',entry)
    z.writestr('README-ja.txt','Xerophyte 風と砂嵐 音付きプレビュー。2026-10-18。\n展開先で python -m http.server 8070 を実行し、http://localhost:8070/preview/20261017/xerophyte.html?skipgc を開いてください。スピーカーを押し、SANDSTORMで三分の砂嵐を開始します。\n共有JS/CSS、描画素材、音声、音源の公開HQ MP3と編集記録、試聴資料を同梱。トップページはこの保存版への案内です。他作品の本体と公開サイト全体は含みません。file://での直接動作は保証しません。出典・ライセンスは作品メニューとauditに記載。原音WAV/FLACは未取得。\n')
    names=z.namelist();assert len(names)==len(set(names))
    z.writestr('MANIFEST.json',json.dumps({n:hashlib.sha256(z.read(n)).hexdigest() for n in names},indent=2))
    assert z.testzip() is None
    extraction=Path('/workspace/verification/xerophyte-audio-v1');z.extractall(extraction)
    for name in names:assert hashlib.sha256((extraction/name).read_bytes()).hexdigest()==hashlib.sha256(z.read(name)).hexdigest()
info={'archive':str(target),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'files':len(names)+1,'crc':'passed','extractedHashes':'all matched','extraction':str(extraction)}
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
