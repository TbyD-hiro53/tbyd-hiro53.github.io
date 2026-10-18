from pathlib import Path
import numpy as np,subprocess,json,hashlib
from scipy.signal import butter,sosfilt,resample_poly
R=Path('/workspace/tbyd-hiro53.github.io');D=R/'audit/2026-10-19/armillary-audio-v2';SRC=Path('/workspace/previews/2026-10-18/audio-survey/336556-hq-preview.mp3');sr=44100
raw=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(SRC),'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2).copy();report=[]
def filt(x,lo,hi):return sosfilt(butter(2,[lo,hi],btype='bandpass',fs=sr,output='sos'),x,axis=0)
def pitch(x,rate):
 t=np.arange(int(len(x)/rate))*rate;return np.stack([np.interp(t,np.arange(len(x)),x[:,c])for c in range(2)],axis=1)
def write(name,x,loop,edit):
 x*=10**(-24/20)/max(np.sqrt(np.mean(x*x)),1e-9);x=.30*np.tanh(x/.30)
 if loop:
  n=sr;a=np.linspace(0,np.pi/2,n)[:,None];x=np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)])
  cut=2*sr+int(np.argmin(abs(np.diff(x,axis=0)).max(axis=1)[2*sr:-2*sr]))+1;x=np.roll(x,-cut,axis=0)
 else:
  ramp=min(int(.008*sr),len(x)//4);x[:ramp]*=np.linspace(0,1,ramp)[:,None];x[-ramp:]*=np.linspace(1,0,ramp)[:,None]
 count=len(x);guard=int(.1*sr);x=np.concatenate([x[-guard:] if loop else np.zeros((guard,2)),x,x[:guard] if loop else np.zeros((guard,2))]);f=R/f'armillary-audio-v2-20261019-{name}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=x.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2)[guard:guard+count]
 item=dict(file=f.name,source='S05 / 336556',sourceSHA256=hashlib.sha256(SRC.read_bytes()).hexdigest(),edit=edit,loop=loop,duration=count/sr,guardSeconds=.1,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()))
 if loop:
  item['seamStep']=float(abs(y[0]-y[-1]).max());item['ordinaryStep99']=float(np.percentile(abs(np.diff(y,axis=0)).max(axis=1),99));assert item['seamStep']<item['ordinaryStep99']
 report.append(item)
# Actual recorded servo tone, slowed/reversed and layered. No synthesized oscillator.
a=filt(raw[int(.38*sr):int(1.65*sr)],180,7400)
x=np.zeros((15*sr,2))
for rate,gain,reverse,offset in [(.34,1,False,0),(.43,.42,True,.73),(.68,.16,False,1.47)]:
 grain=pitch(a[::-1] if reverse else a,rate);fade=int(.18*sr);grain[:fade]*=np.linspace(0,1,fade)[:,None];grain[-fade:]*=np.linspace(1,0,fade)[:,None];stride=len(grain)-fade
 for st in range(-len(grain)+int(offset*sr),len(x),stride):
  lo=max(0,st);hi=min(len(x),st+len(grain));x[lo:hi]+=gain*grain[lo-st:hi-st]
x=filt(x,80,3200);delayed=np.zeros_like(x);delay=int(.41*sr);delayed[delay:]=x[:-delay,::-1]*.22;x+=delayed
write('hologram',x,True,'S05 0.38–1.65s; recorded servo 0.34x forward +0.43x reverse +0.68x forward, band80–3200Hz, quiet crossed410ms recorded-sample delay, 15s bed then1s cyclic overlap ->14s; RMS-24 and soft peak. Artistic hologram sound, not a field recording of an electrical device.')
for i,(start,end,rate) in enumerate([(.215,.40,1.12),(1.86,2.08,1.36),(5.70,5.95,1.6)]):
 x=pitch(filt(raw[int(start*sr):int(end*sr)],800,7800),rate);x*=np.exp(-np.arange(len(x))/(.065*sr))[:,None]
 write('spark'+str(i+1),x,False,f'S05 {start}–{end}s mechanical contact transient; playback{rate}x; band800–7800Hz, 65ms decay and8ms edge fades. Processed spark Foley, not an electrical field recording.')
(D/'audio-build.json').write_text(json.dumps(report,indent=2));print(report)
