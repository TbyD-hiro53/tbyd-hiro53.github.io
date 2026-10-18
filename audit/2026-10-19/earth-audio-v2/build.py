from pathlib import Path
import subprocess,json,numpy as np,hashlib
from scipy.signal import butter,sosfilt
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/previews/2026-10-18/audio-survey');A=R/'audit/2026-10-19/earth-audio-v2';rows=[]
items=[('wind','517995',50,30,'highpass=f=320:p=2,highpass=f=320:p=2,lowpass=f=2600:p=2',-34),('fan','451614',285,30,'volume=-6dB,highpass=f=45,lowpass=f=3500,acompressor=threshold=0.12:ratio=2:attack=5:release=180:makeup=1,volume=2.8dB,highpass=f=85:p=2,lowpass=f=1500:p=2,equalizer=f=240:t=q:w=0.8:g=2',-33)]
def decode(f):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2)
def band_rms(y,hz):
 v=sosfilt(butter(4,hz,fs=44100,btype='lowpass',output='sos'),y,axis=0);return float(np.sqrt(np.mean(v*v)))
for name,id,start,dur,filters,db in items:
 src=D/(id+'-hq-preview.mp3');x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(src),'-t',str(dur),'-af',filters,'-f','f32le','-ar','44100','-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
 n=44100;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)]);x*=10**(db/20)/np.sqrt(np.mean(x*x));x=.20*np.tanh(x/.20)
 cut=n+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[n:-n]))+1;x=np.roll(x,-cut,axis=0);pad=4410;x=np.concatenate([x[-pad:],x,x[:pad]])
 f=R/f'interiors-audio-v2-20261019-{name}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=decode(f)[pad:-pad];seam=float(abs(y[0]-y[-1]).max());p99=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<p99
 row=dict(name=name,source=id,sourceFile=str(src),sourceSHA256=hashlib.sha256(src.read_bytes()).hexdigest(),excerpt=[start,start+dur],filters=filters,targetRMSDBFS=db,overlapSeconds=1,codecGuardSeconds=.1,peakControl='.20*tanh(x/.20)',file=f.name,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),loopSeconds=len(y)/44100,rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),seamStep=seam,ordinaryStep99=p99)
 if name=='wind':
  old=decode(R/'interiors-audio-v1-20261019-wind.mp3')[pad:-pad];row['oldBelow160HzRMS']=band_rms(old,160);row['newBelow160HzRMS']=band_rms(y,160);row['below160HzChangeDB']=float(20*np.log10(row['newBelow160HzRMS']/row['oldBelow160HzRMS']));assert row['below160HzChangeDB']<-20
 rows.append(row)
(A/'audio-build.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
