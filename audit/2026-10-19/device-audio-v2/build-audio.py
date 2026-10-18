from pathlib import Path
import json, subprocess, hashlib, numpy as np
R=Path(__file__).resolve().parents[3]
D=Path('/workspace/previews/2026-10-18/audio-survey/538210-hq-preview.mp3')
assert hashlib.sha256(D.read_bytes()).hexdigest()=='96aa42d6114b300a95cd955a65f5e45da1889f8915f839035a14f3cc96cd6f1e'
report=[]
for name,speed,duration,hp,lp,db in [('rumble',.70,24,55,800,-23),('metal',.90,18,340,2600,-27)]:
 filters=f'atrim=start=1:end=19,asetpts=PTS-STARTPTS,aresample=44100,asetrate={int(44100*speed)},aresample=44100,highpass=f={hp},lowpass=f={lp},atrim=duration={duration+1}'
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(D),'-af',filters,'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
 assert len(x)==(duration+1)*44100
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None]
 x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)])
 x*=10**(db/20)/np.sqrt(np.mean(x*x));x=.38*np.tanh(x/.38)
 cut=88200+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[88200:-88200]))+1
 x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'device-audio-v2-20261019-{name}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2)[pad:pad+duration*44100]
 seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99 and abs(y).max()<.5
 report.append(dict(layer=name,source='S07 / 538210',sourceInterval=[1,19],speed=speed,filters=filters,overlapSeconds=1,codecGuardSeconds=.1,duration=duration,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),seamStep=seam,ordinaryStep99=p99))
Path(__file__).with_name('audio-build.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
