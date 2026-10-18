from pathlib import Path
import zipfile,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/earth-audio-v3';Z=Path('/workspace/previews/2026-10-19/interiors-audio-v3/h53-interiors-audio-v3-20261019.zip');E=Path('/workspace/verification/interiors-audio-v3')
Z.parent.mkdir(parents=True,exist_ok=True)
names=set(json.loads((A/'archive-dependencies.json').read_text()))
assert all((R/n).is_file() for n in names)
for directory in [A,R/'audit/2026-10-19/interior-wind-research',R/'audit/2026-10-19/audio-interiors']:
 for p in directory.rglob('*'):
  if p.suffix in ['.py','.json','.md'] and p.name!='archive-info.json':names.add(p.relative_to(R).as_posix())
names.add('audit/2026-10-19/audio-batch/sources.json');manifest={}
with zipfile.ZipFile(Z,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for n in sorted(names):
  data=(R/n).read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 for ident in ['478643','523389','479322','197705','538210']:
  raw=Path('/workspace/previews/2026-10-19/interiors-human-free-candidates' if ident in ['478643','523389'] else '/workspace/previews/2026-10-18/audio-survey')/(ident+'-hq-preview.mp3');n='source-previews/'+raw.name;data=raw.read_bytes();z.writestr(n,data);manifest[n]=hashlib.sha256(data).hexdigest()
 guide='Earth Origin Material / Preservation Hall / SHOKO 音プレビューv3。展開先で python -m http.server 8080 を起動し /preview/20261017/earth-origin-material.html?skipgc、preservation-hall.html?skipgc、shoko.html?skipgc を開きます。メニュー隣のスピーカーで再生。全ギャラリーではなく3作品と依存物・出典・公開HQ MP3の保存。別作品や出典リンクへの移動には公開サイト/ネットワークが必要です。元WAV/Blender原本ではありません。\n'
 n='README-ja.txt';z.writestr(n,guide);manifest[n]=hashlib.sha256(guide.encode()).hexdigest();z.writestr('MANIFEST.json',json.dumps(manifest,indent=2));assert z.testzip() is None;z.extractall(E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
info=dict(archive=str(Z),bytes=Z.stat().st_size,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),files=len(manifest)+1,extraction=str(E),crc='passed',extractedHashes='all match',scope='Three interior artwork previews, runtime dependencies, source metadata and five HQ MP3 recordings')
(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps(info))
