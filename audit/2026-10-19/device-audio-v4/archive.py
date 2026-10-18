from pathlib import Path
import zipfile,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/device-audio-v4';D=Path('/workspace/previews/2026-10-19/device-audio-v4');E=Path('/workspace/verification/device-audio-v4');Z=D/'h53-cortex-tricore-audio-v4-20261019.zip'
D.mkdir(parents=True,exist_ok=True)
names=set(json.loads((R/'audit/2026-10-19/device-audio-v2/dependencies.json').read_text()))
names-=set(['device-audio-v2-20261019.js','device-audio-v2-20261019-metal.mp3']);names.add('device-audio-v4-20261019.js');names.discard('device-audio-v2-20261019-rumble.mp3');names.add('device-audio-v4-20261019-rumble.mp3')
for p in A.rglob('*'):
 if p.is_file() and p.suffix in ['.py','.json','.md'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
for n in ['audio-build.json','build-audio.py']:names.add('audit/2026-10-19/device-audio-v2/'+n)
manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for n in sorted(names):
  data=(R/n).read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 raw=Path('/workspace/previews/2026-10-18/audio-survey/538210-hq-preview.mp3');n='source-previews/'+raw.name;data=raw.read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 guide='Cortex / Tricore 音プレビュー v4。2作品の依存物一式。\n展開先で python -m http.server 8081 を起動し、/preview/20261017/lacto-cortex.html?skipgc または /preview/20261017/lacto-tricore.html?skipgc を開きます。初期消音、メニュー隣のスピーカーで試聴。全ギャラリーの保存ではありません。外部出典やギャラリーへの移動にはネットワークまたは全サイト一式が必要です。\n'
 n='README-ja.txt';z.writestr(n,guide);manifest[n]=hashlib.sha256(guide.encode()).hexdigest();z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
info=dict(archive=str(Z),bytes=Z.stat().st_size,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),files=len(manifest)+1,extraction=str(E),crc='passed',extractedHashes='all match',scope='Cortex/Tricore dependencies and S07 HQ recording; not whole gallery')
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info))
