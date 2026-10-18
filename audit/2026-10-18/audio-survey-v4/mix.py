from pathlib import Path
import subprocess,numpy as np,json
from scipy.ndimage import uniform_filter1d
D=Path('/workspace/render-work/audio-sand-v4');O=Path('/workspace/previews/2026-10-18/audio-sand-v4');P=Path('/workspace/tbyd-hiro53.github.io/preview/20261017');S=Path('/workspace/previews/2026-10-18/audio-survey');sr=44100;N=30*sr

def decode(path,start,seconds,filters):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(path),'-t',str(seconds),'-af',filters,'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
def level(x,db):return x*float(10**(db/20)/np.sqrt(np.mean(x*x)+1e-16))
def repeat(x,seconds=1):
 k=int(seconds*sr);q=np.linspace(0,np.pi/2,k)[:,None];out=x.copy()
 while len(out)<N:out=np.concatenate([out[:-k],out[-k:]*np.cos(q)+x[:k]*np.sin(q),x[k:]],axis=0)
 return out[:N]
# The collected source is explicitly a designed synthetic sand sweep. Its continuous middle forms the bed.
sweep=decode(O/'446950-hq-preview.mp3',5.5,6,'highpass=f=500,lowpass=f=7600');envelope=np.sqrt(uniform_filter1d(np.mean(sweep*sweep,axis=1),size=int(.35*sr))+1e-14);gain=np.clip(np.median(envelope)/envelope,.75,1.35);sweep*=gain[:,None];bed=level(repeat(sweep),-25)
# A subdued real flowing-sand layer adds texture without the rejected contact-mic strikes.
flow=level(decode(O/'825860-hq-preview.mp3',30,30,'highpass=f=1100,lowpass=f=7200'),-38)
wind=level(repeat(decode(S/'376534-hq-preview.mp3',1,18,'highpass=f=45,lowpass=f=600'),1.5),-42)
x=bed+flow+wind;gain=min(1,10**(-3/20)/np.max(np.abs(x)));x*=gain
x[:int(.5*sr)]*=np.linspace(0,1,int(.5*sr))[:,None];x[-sr:]*=np.linspace(1,0,sr)[:,None]
out=P/'audio-survey-v4-S03-sandwash.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(out)],input=x.astype('float32').tobytes(),check=True)
manifest={'file':out.name,'sources':[{'id':'446950','kind':'author-designed synthetic sand sweep','start':5.5,'duration':6,'filter':'highpass 500 Hz, lowpass 7600 Hz','rmsDB':-25,'loopCrossfadeSeconds':1,'envelope':'350 ms RMS, gain limited to 0.75–1.35'},{'id':'825860','kind':'flowing sand field recording per uploader description','start':30,'duration':30,'filter':'highpass 1100 Hz, lowpass 7200 Hz','rmsDB':-38},{'id':'376534','kind':'field-recorded wind','start':1,'duration':18,'filter':'highpass 45 Hz, lowpass 600 Hz','rmsDB':-42,'loopCrossfadeSeconds':1.5}],'rejectedSourceRemoved':'244967','finalGain':float(gain),'fadeInSeconds':.5,'fadeOutSeconds':1,'duration':30}
(D/'mix.json').write_text(json.dumps(manifest,indent=2));print('MIX READY',float(20*np.log10(np.sqrt(np.mean(x*x)))),flush=True)
