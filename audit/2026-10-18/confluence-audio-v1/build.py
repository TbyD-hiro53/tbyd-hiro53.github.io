from pathlib import Path
import json,subprocess,numpy as np
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/previews/2026-10-18/audio-survey');report=[]
for name,id,start,length,hp,lp,db in [('river','479322',1,18,80,7000,-25),('rill','197705',1,18,120,8500,-27)]:
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(D/(id+'-hq-preview.mp3')),'-t',str(length),'-af',f'highpass=f={hp},lowpass=f={lp}','-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)])
 x*=10**(db/20)/np.sqrt(np.mean(x*x))
 # Gentle soft-knee peak control for rare recording transients; no added sound.
 x=.32*np.tanh(x/.32)
 cut=88200+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[88200:-88200]))+1
 x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'confluence-audio-v1-20261018-{name}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2)
 y=y[4410:-4410]
 seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99;assert abs(y).max()<.5
 report.append({'name':name,'source':id,'excerpt':[start,length],'filters':[hp,lp],'overlapSeconds':1,'codecGuardSeconds':.1,'peakControl':'0.32*tanh(x/0.32)','file':f.name,'bytes':f.stat().st_size,'duration':len(y)/44100,'rmsDBFS':float(20*np.log10(np.sqrt(np.mean(y*y)))),'peak':float(abs(y).max()),'seamStep':seam,'ordinaryStep99':p99})
(R/'audit/2026-10-18/confluence-audio-v1/audio-build.json').write_text(json.dumps(report,indent=2));print(report)
