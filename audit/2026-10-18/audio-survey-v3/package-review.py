from pathlib import Path
import zipfile,json,hashlib,re,shutil
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/audio-revision');P=Path('/workspace/previews/2026-10-18/audio-revision');A=R/'audit/2026-10-18/audio-survey-v3';files=set()
for version in ['v2','v3']:
 for f in (R/('audit/2026-10-18/audio-survey-'+version)).glob('*'):
  if f.is_file():files.add(f)
 page=R/('preview/20261017/audio-survey-'+version+'.html');files.add(page)
 for path in re.findall(r'<audio[^>]+src="([^"]+)"',page.read_text()):files.add(page.parent/path)
ss=json.loads((R/'audit/2026-10-18/audio-survey-v2/sources.json').read_text());new=[s for s in json.loads((D/'acquired-retry.json').read_text()) if 'error' not in s]
target=P/'h53-audio-review-v3-20261018.zip'
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for f in sorted(files):z.write(f,str(f.relative_to(R)))
 for s in ss+new:
  f=(P if s in new else Path('/workspace/previews/2026-10-18/audio-survey'))/s['file'];assert hashlib.sha256(f.read_bytes()).hexdigest()==s['sha256'];z.write(f,'source-previews/'+f.name)
 z.writestr('preview/20261017/index.html','<!doctype html><meta charset="utf-8"><a href="audio-survey-v3.html">修正音源の再試聴</a> · <a href="audio-survey-v2.html">全作品の音計画と元の候補</a>')
 z.writestr('README-ja.txt','音源再試聴 v3。3番は風＋砂粒、4番は区間変更と増幅、6番は区間変更と処理前後。従来10候補＋新規2候補の公開HQ MP3を同梱。原音WAV/FLACは未取得。作品本体への音実装ではありません。\npython -m http.server 8068\nhttp://localhost:8068/preview/20261017/audio-survey-v3.html\n音源ごとの出典・ライセンス・編集内容はページとauditに記載。\n')
 names=z.namelist();z.writestr('MANIFEST.json',json.dumps({n:hashlib.sha256(z.read(n)).hexdigest() for n in names},indent=2));assert z.testzip() is None;z.extractall('/workspace/verification/audio-survey-v3')
info={'archive':str(target),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size,'files':len(names)+1,'crc':True};(P/'archive-info.json').write_text(json.dumps(info,indent=2));print(info,flush=True)
