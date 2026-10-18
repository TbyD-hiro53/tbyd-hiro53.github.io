from pathlib import Path
import zipfile,json,hashlib,shutil,subprocess
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/audio-batch';info=json.loads((A/'archive-info.json').read_text());Z=Path(info['archive']);E=Path(info['extraction']);S=Path('/workspace/render-work/audio-batch/archive-patch');S.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(Z) as z:manifest=json.loads(z.read('AUDIO-PREVIEW-MANIFEST.json'))
changed=[]
for p in R.rglob('*'):
 if not p.is_file() or '.git' in p.relative_to(R).parts or p==A/'archive-info.json':continue
 n=p.relative_to(R).as_posix();h=hashlib.sha256(p.read_bytes()).hexdigest()
 if manifest.get(n)!=h:
  q=S/n;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,q);manifest[n]=h;changed.append(n)
(S/'AUDIO-PREVIEW-MANIFEST.json').write_text(json.dumps(manifest,indent=2))
if changed:
 subprocess.run(['zip','-q',str(Z),*changed,'AUDIO-PREVIEW-MANIFEST.json'],cwd=S,check=True)
 with zipfile.ZipFile(Z) as z:
  assert len(z.namelist())==len(set(z.namelist()));assert z.testzip() is None
  for n in [*changed,'AUDIO-PREVIEW-MANIFEST.json']:z.extract(n,E)
for n,h in manifest.items():assert hashlib.sha256((E/n).read_bytes()).hexdigest()==h,n
info.update(bytes=Z.stat().st_size,sha256=hashlib.sha256(Z.read_bytes()).hexdigest(),files=len(manifest)+1);(A/'archive-info.json').write_text(json.dumps(info,indent=2));print(json.dumps({'updated':changed,'archive':info}),flush=True)
