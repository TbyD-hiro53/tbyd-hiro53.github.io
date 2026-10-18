from pathlib import Path
import json,zipfile,hashlib,re
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/audio-sand-v4');O=Path('/workspace/previews/2026-10-18/audio-sand-v4');files=set()
for v in ['v2','v3','v4']:
 for f in (R/('audit/2026-10-18/audio-survey-'+v)).glob('*'):
  if f.is_file():files.add(f)
 page=R/('preview/20261017/audio-survey-'+v+'.html');files.add(page)
 for n in re.findall(r'<audio[^>]+src="([^"]+)"',page.read_text()):files.add(page.parent/n)
ss=[(s,Path('/workspace/previews/2026-10-18/audio-survey')) for s in json.loads((R/'audit/2026-10-18/audio-survey-v2/sources.json').read_text())]
ss += [(s,Path('/workspace/previews/2026-10-18/audio-revision')) for s in json.loads((R/'audit/2026-10-18/audio-survey-v3/acquired-retry.json').read_text()) if 'error' not in s]
ss += [(json.loads((D/n).read_text()),O) for n in ['source.json','sand-sweep-source.json']]
p=O/'h53-audio-review-v4-20261018.zip'
with zipfile.ZipFile(p,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for f in sorted(files):z.write(f,str(f.relative_to(R)))
 for s,root in ss:
  f=root/s['file'];assert hashlib.sha256(f.read_bytes()).hexdigest()==s['sha256'];z.write(f,'source-previews/'+f.name)
 z.writestr('preview/20261017/index.html','<!doctype html><meta charset="utf-8"><a href="audio-survey-v4.html">砂嵐の再試聴</a> · <a href="audio-survey-v2.html">全作品の音計画</a>')
 z.writestr('README-ja.txt','3番の砂嵐を連続音へ変更。4番・6番は作者合格のv3と同一。14件の公開HQ MP3、全試聴ページと再生依存物、出典・ライセンス・加工記録を同梱。原音WAV/FLACは未取得。\npython -m http.server 8069\nhttp://localhost:8069/preview/20261017/audio-survey-v4.html\n作品本体の音実装ではなく試聴資料です。\n')
 names=z.namelist();z.writestr('MANIFEST.json',json.dumps({n:hashlib.sha256(z.read(n)).hexdigest() for n in names},indent=2));assert z.testzip() is None;z.extractall('/workspace/verification/audio-survey-v4')
info={'archive':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'files':len(names)+1,'crc':True};(O/'archive-info.json').write_text(json.dumps(info,indent=2));print(info,flush=True)
