from pathlib import Path
import numpy as np,subprocess,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');P=R/'preview/20261017';A=R/'audit/2026-10-18/audio-survey-v4';rows=[]
for name in ['audio-survey-v3-S03-mix.mp3','audio-survey-v4-S03-sandwash.mp3']:
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(P/name),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2);core=x[44100:-44100];m=np.mean(core*core,axis=1);n=882;r=np.sqrt(np.mean(m[:len(m)//n*n].reshape(-1,n),axis=1)+1e-15);rows.append({'file':name,'seconds':len(x)/44100,'peakDB':float(20*np.log10(np.max(np.abs(x)))),'meanDB':float(20*np.log10(np.sqrt(np.mean(x*x)))),'interior20msEnvelopeSpread95_10DB':float(20*np.log10(np.percentile(r,95)/np.percentile(r,10))),'sha256':hashlib.sha256((P/name).read_bytes()).hexdigest()})
assert rows[1]['peakDB']<-.5 and rows[1]['interior20msEnvelopeSpread95_10DB']<rows[0]['interior20msEnvelopeSpread95_10DB'],rows
fb=json.loads((A/'feedback.json').read_text())
for k in ['S04','S06']:assert hashlib.sha256((P/fb[k]['file']).read_bytes()).hexdigest()==fb[k]['approvedFileSHA256']
(A/'signal-validation.json').write_text(json.dumps(rows,indent=2));print(rows,flush=True)
