from pathlib import Path
import numpy as np,subprocess,json
D=Path('/workspace/previews/2026-10-19/interiors-human-free-candidates');p=D/'478643-hq-preview.mp3';sr=16000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2)
rows=[]
for start in range(10,145,5):
 y=x[start*sr:(start+30)*sr,0];windows=y.reshape(-1,4000);r=np.sqrt(np.mean(windows**2,axis=1));peaks=np.max(abs(windows),axis=1);rows.append({'start':start,'end':start+30,'rmsDBFS':float(20*np.log10(np.sqrt(np.mean(y*y)))),'rmsCV':float(r.std()/r.mean()),'rms95to5':float(np.percentile(r,95)/np.percentile(r,5)),'peak99':float(np.percentile(peaks,99)),'maxToRMS':float(abs(y).max()/np.sqrt(np.mean(y*y)))})
rows.sort(key=lambda r:r['rmsCV']);print(json.dumps(rows[:8],indent=2));(D/'478643-window-analysis.json').write_text(json.dumps(rows,indent=2));print('duration',len(x)/sr,'chRMS',[float(np.sqrt(np.mean(x[:,c]**2))) for c in [0,1]])
