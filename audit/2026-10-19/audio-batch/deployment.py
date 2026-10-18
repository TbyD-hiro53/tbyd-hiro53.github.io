from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request,json,time,subprocess,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/audio-batch');sha=subprocess.check_output(['git','rev-parse','--short','HEAD'],cwd=R,text=True).strip();base='https://tbyd-hiro53.github.io/'
changed=subprocess.check_output(['git','show','--format=','--name-only','HEAD'],cwd=R,text=True).splitlines()
files=[n for n in changed if Path(n).suffix in ['.html','.js','.mp3','.css'] and not n.startswith('audit/')]
files+= [n+'.html' for n in ['lacto-cortex','lacto-tricore','core-37','armillary','armillary-v2','binary-dusk','earth-origin-material','preservation-hall','shoko','sanctum']]
entry='preview/20261017/audio-preview-v1.html';assert entry in files
for attempt in range(18):
 query='?skipgc&revision=audio-batch-'+sha+'&check='+str(int(time.time()));url=base+entry+query
 try:
  data=urllib.request.urlopen(url,timeout=20).read();matched=data==(R/entry).read_bytes();print('attempt',attempt+1,'hub matches',matched,flush=True)
  if matched:
   def verify(n):
    raw=urllib.request.urlopen(base+n+query,timeout=30).read();return {'path':n,'url':base+n+query,'matches':raw==(R/n).read_bytes(),'sha256':hashlib.sha256(raw).hexdigest()}
   with ThreadPoolExecutor(max_workers=5) as pool:rows=list(pool.map(verify,sorted(set(files))))
   assert all(x['matches'] for x in rows),[r['path'] for r in rows if not r['matches']]
   (D/'published.json').write_text(json.dumps(rows,indent=2));(D/'public-url.txt').write_text(url);print('all',len(rows),'deployed file hashes match',flush=True);break
 except Exception as e:print(type(e).__name__,str(e),flush=True)
 time.sleep(15)
else:raise SystemExit('Deployment did not match within polling window')
