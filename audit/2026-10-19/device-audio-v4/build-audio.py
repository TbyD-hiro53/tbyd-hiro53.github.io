from pathlib import Path
import subprocess,json,hashlib,numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.signal import sosfilt,tf2sos
R=Path(__file__).resolve().parents[3];A=Path(__file__).parent;sr=44100
source=Path('/workspace/previews/2026-10-18/audio-survey/538210-hq-preview.mp3');assert hashlib.sha256(source.read_bytes()).hexdigest()=='96aa42d6114b300a95cd955a65f5e45da1889f8915f839035a14f3cc96cd6f1e'
filt='atrim=start=1:end=19,asetpts=PTS-STARTPTS,aresample=44100,asetrate=30869,aresample=44100,highpass=f=55,lowpass=f=800,atrim=duration=25'
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(source),'-af',filt,'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2).copy();assert len(x)==25*sr
angle=np.linspace(0,np.pi/2,sr)[:,None];x=np.concatenate([x[sr:-sr],x[-sr:]*np.cos(angle)+x[:sr]*np.sin(angle)])
x*=10**(-23/20)/np.sqrt(np.mean(x*x));x=.38*np.tanh(x/.38)
def lowpass(y,hz):
 w=2*np.pi*hz/sr;c=np.cos(w);alpha=np.sin(w)/(2*.5);b=np.array([(1-c)/2,1-c,(1-c)/2])/(1+alpha);a=np.array([1+alpha,-2*c,1-alpha])/(1+alpha)
 return sosfilt(tf2sos(b,a),np.tile(y,(2,1)),axis=0)[len(y):]
def stats(y):
 out={}
 for hz in [480,650]:
  z=lowpass(y,hz);out[hz]={}
  for sec in [.25,.5,1]:
   n=int(sec*sr);zz=np.concatenate([z,z[:n]]);v=np.array([np.sqrt(np.mean(zz[i:i+n]**2)) for i in range(0,len(z),sr//10)]);db=20*np.log10(v);out[hz][sec]={'rangeDB':float(np.ptp(db)),'p95p5DB':float(np.percentile(db,95)-np.percentile(db,5))}
 return out
before=stats(x);target=np.sqrt(np.mean(x*x));gains=[]
# Offline stereo-linked leveling, measured after representative playback EQ.
# Circular smoothing and interpolation keep gain continuous across the loop seam.
for smoothing in [.08,.12]:
 z=lowpass(x,550);blocks=np.mean(z.reshape(-1,441,2)**2,axis=(1,2));env=np.sqrt(gaussian_filter1d(blocks,smoothing/.01,mode='wrap'));gain=np.exp(np.mean(np.log(env)))/np.maximum(env,1e-7);gains.append([float(gain.min()),float(gain.max())]);centers=(np.arange(len(gain))+.5)*441
 g=np.interp(np.arange(len(x)),np.r_[centers[-1]-len(x),centers,centers[0]+len(x)],np.r_[gain[-1],gain,gain[0]])
 x*=g[:,None]
x*=target/np.sqrt(np.mean(x*x));assert np.max(abs(x))<.55
# Choose a low-slope seam; include cyclic encoding guards.
cut=int(np.argmin(abs(np.roll(x,1,axis=0)-x).max(axis=1)));x=np.roll(x,-cut,axis=0);pad=4410;guard=np.concatenate([x[-pad:],x,x[:pad]])
p=R/'device-audio-v4-20261019-rumble.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(p)],input=guard.astype('float32').tobytes(),check=True)
y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2)[pad:pad+24*sr];after=stats(y)
for hz in [480,650]:assert after[hz][1]['rangeDB']<1.5 and after[hz][.25]['rangeDB']<4,after
seam=float(abs(y[0]-y[-1]).max());ordinary=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert seam<ordinary and np.max(abs(y))*1.52<.95
report=dict(source='S07 / oldestmillennial / 538210 / CC BY 3.0',sourceSHA256=hashlib.sha256(source.read_bytes()).hexdigest(),sourceInterval=[1,19],filters=filt,overlapSeconds=1,leveling='Stereo-linked circular RMS gain, 10ms blocks, Gaussian smoothing 80ms then 120ms; offline only',passGainRanges=gains,before=before,after=after,duration=24,codecGuardSeconds=.1,rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(np.max(abs(y))),seamStep=seam,ordinaryStep99=ordinary,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
(A/'audio-build.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
