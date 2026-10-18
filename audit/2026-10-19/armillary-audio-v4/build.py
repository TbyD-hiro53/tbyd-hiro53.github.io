from pathlib import Path
import subprocess,numpy as np,json,hashlib
from scipy.ndimage import uniform_filter1d
R=Path(__file__).resolve().parents[3];A=Path(__file__).parent;src=Path('/workspace/previews/2026-10-19/armillary-audio-v3-sources/94128-hq-preview.mp3');sr=44100
assert hashlib.sha256(src.read_bytes()).hexdigest()=='15f5dd478dee7a9f3c6cebfde290cf9e4b1ba0016557f42ba5aff1150b57e935'
raw=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-af','highpass=f=900,lowpass=f=10000','-f','f32le','-ar',str(sr),'-ac','1','pipe:1']),np.float32).copy();rows=[]
for i,(start,duration) in enumerate([(0,.14),(.035,.15),(.07,.147)],1):
 x=raw[round(start*sr):round(start*sr)+round(duration*sr)].copy();env=np.sqrt(uniform_filter1d(x*x,size=88,mode='nearest'));gate=np.minimum(1,env/(env.max()*.30))**2;x*=gate
 x*=10**(-24/20)/np.sqrt(np.mean(x*x));x=.40*np.tanh(x/.40)
 x[:44]*=np.linspace(0,1,44);x[-441:]*=np.linspace(1,0,441)
 pad=4410;guard=np.concatenate([np.zeros(pad),x,np.zeros(pad)]);f=R/f'armillary-audio-v4-20261019-spark{i}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k',str(f)],input=guard.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar',str(sr),'-ac','1','pipe:1']),np.float32)[pad:pad+len(x)]
 assert abs(y).max()<.5
 rows.append(dict(file=f.name,source='BMacZero / ContinuousSpark.wav / 94128 / CC0',sourceInterval=[start,start+duration],duration=duration,filters='900Hz HP, 10000Hz LP; stereo unchanged (source mono); transient expander 2ms RMS threshold30% peak-envelope, squared gain; -24dBFS target and tanh peak shaping; 1ms attack and10ms end fades; no reverberation, delay, pitch shift or generated noise',codecGuardSeconds=.1,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),sourceSHA256=hashlib.sha256(src.read_bytes()).hexdigest()))
(A/'audio-build.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
