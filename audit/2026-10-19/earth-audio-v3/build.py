from pathlib import Path
import subprocess,json,numpy as np,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/previews/2026-10-19/interiors-human-free-candidates');A=R/'audit/2026-10-19/earth-audio-v3';rows=[]
items=[('wind','523389',85,30,2,'highpass=f=160:p=2,lowpass=f=3600:p=2',-34),('fan','478643',135,30,1,'pan=mono|c0=c0,highpass=f=85:p=2,lowpass=f=1800:p=2',-34)]
for name,id,start,dur,channels,filters,db in items:
 src=D/(id+'-hq-preview.mp3');x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(src),'-t',str(dur),'-af',filters,'-f','f32le','-ar','44100','-ac',str(channels),'pipe:1']),np.float32).reshape(-1,channels).copy()
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)]);x*=10**(db/20)/np.sqrt(np.mean(x*x));x=.20*np.tanh(x/.20)
 cut=n+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[n:-n]))+1;x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'interiors-audio-v3-20261019-{name}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac',str(channels),'-i','pipe:0','-c:a','libmp3lame','-b:a','160k' if channels==2 else '128k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac',str(channels),'pipe:1']),np.float32).reshape(-1,channels)[pad:-pad];seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99
 rows.append(dict(name=name,source=id,sourceFile=str(src),sourceSHA256=hashlib.sha256(src.read_bytes()).hexdigest(),excerpt=[start,start+dur],channels=channels,filters=filters,targetRMSDBFS=db,overlapSeconds=1,codecGuardSeconds=.1,peakControl='.20*tanh(x/.20)',file=f.name,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),loopSeconds=len(y)/44100,rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),seamStep=seam,ordinaryStep99=p99))
(A/'audio-build.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
