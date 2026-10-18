from pathlib import Path
import subprocess,numpy as np,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io'); A=R/'audit/2026-10-19/audio-outdoor'; S=Path('/workspace/previews/2026-10-18/audio-survey')
report=[]
for name,id,start,length,fil in [('grass','517995',50,30,'highpass=f=45,volume=42dB'),('coast','165580',615,60,'highpass=f=110,lowpass=f=5500')]:
 raw=S/(id+'-hq-preview.mp3')
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(raw),'-t',str(length),'-af',fil,'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)])
 # Keep the reviewed grass excerpt's gain; normalize only the already-reviewed coastal ambience.
 if name=='coast': x*=10**(-28/20)/np.sqrt(np.mean(x*x))
 x=.32*np.tanh(x/.32)
 cut=88200+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[88200:-88200]))+1
 x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'outdoor-audio-v1-20261019-{name}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2)[4410:4410+(length-1)*44100]
 seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99
 report.append(dict(name=name,source=id,sourceFile=str(raw),sourceSHA256=hashlib.sha256(raw.read_bytes()).hexdigest(),excerpt=[start,start+length],filters=fil,overlapSeconds=1,guardSeconds=.1,peakControl='.32*tanh(x/.32)',file=f.name,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),bytes=f.stat().st_size,duration=length-1,rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),seamStep=seam,ordinaryStep99=p99))
(A/'audio-build.json').write_text(json.dumps(report,indent=2));print(report)
