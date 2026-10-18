from pathlib import Path
import zipfile,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/armillary-audio-v4';Z=Path('/workspace/previews/2026-10-19/armillary-audio-v4/h53-armillary-audio-v4-20261019.zip');E=Path('/workspace/verification/armillary-audio-v4')
Z.parent.mkdir(parents=True,exist_ok=True)
names=set(json.loads((A/'runtime-dependencies.json').read_text()))
for directory in [A,R/'audit/2026-10-19/armillary-audio-v2',R/'audit/2026-10-19/device-audio-v2',R/'audit/2026-10-19/audio-outdoor']:
 for p in directory.iterdir():
  if p.suffix in ['.py','.json','.md'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for n in sorted(names):
  data=(R/n).read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 for ident in ['517995','165580','94128']:
  raw=Path('/workspace/previews/2026-10-19/armillary-audio-v3-sources' if ident=='94128' else '/workspace/previews/2026-10-18/audio-survey')/(ident+'-hq-preview.mp3');n='source-previews/'+raw.name;data=raw.read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 guide='Armillary v1/v2 音プレビュー v4 の依存一式。展開先で python -m http.server 8082 を起動し /preview/20261017/armillary.html?skipgc または /preview/20261017/armillary-v2.html?skipgc を開きます。初期消音。メニュー隣のスピーカーで試聴。全ギャラリーの保存ではありません。別作品・外部出典への移動は公開サイト/ネットワークが必要です。原音WAVやBlender原本ではなく公開HQ MP3とブラウザ用素材を保存しています。\n'
 n='README-ja.txt';z.writestr(n,guide);manifest[n]=hashlib.sha256(guide.encode()).hexdigest();z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
info=dict(archive=str(Z),bytes=Z.stat().st_size,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),files=len(manifest)+1,extraction=str(E),crc='passed',extractedHashes='all match',scope='Both Armillary previews, runtime dependencies and three recorded source HQ MP3s')
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info))
