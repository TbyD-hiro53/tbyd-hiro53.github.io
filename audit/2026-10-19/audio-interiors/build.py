from pathlib import Path
import subprocess,json,numpy as np,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/previews/2026-10-18/audio-survey');A=R/'audit/2026-10-19/audio-interiors';report=[]
items=[('wind','517995',50,30,'highpass=f=45,volume=42dB',-28),('room','451614',285,30,'volume=-6dB,highpass=f=45,lowpass=f=3500,acompressor=threshold=0.12:ratio=2:attack=5:release=180:makeup=1,volume=2.8dB',-34),('conveyor','538210',1,18,'highpass=f=70,lowpass=f=1800',-31)]
for name,id,start,dur,filters,db in items:
 src=D/(id+'-hq-preview.mp3');x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(src),'-t',str(dur),'-af',filters,'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)]);x*=10**(db/20)/np.sqrt(np.mean(x*x));x=.40*np.tanh(x/.40)
 cut=n+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[n:-n]))+1;x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'interiors-audio-v1-20261019-{name}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2)[pad:-pad];seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99
 report.append(dict(name=name,source=id,sourceFile=str(src),sourceSHA256=hashlib.sha256(src.read_bytes()).hexdigest(),excerpt=[start,start+dur],approvedFilters=filters,targetRMSDBFS=db,overlapSeconds=1,codecGuardSeconds=.1,peakControl='.40*tanh(x/.40)',file=f.name,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),loopSeconds=len(y)/44100,rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),seamStep=seam,ordinaryStep99=p99))
(A/'audio-build.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
sources=json.loads((R/'audit/2026-10-18/audio-survey-v2/sources.json').read_text());(A/'sources.json').write_text(json.dumps([s for s in sources if s['key'] in ['S04','S06','S07','S08','S09']],ensure_ascii=False,indent=2))
