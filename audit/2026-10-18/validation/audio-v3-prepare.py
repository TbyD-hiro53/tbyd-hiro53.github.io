from pathlib import Path
import subprocess,numpy as np,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/tmp/h53-audio-v3');sr=44100
sources={'water':Path('/tmp/h53-audio-candidates/waves-852826-preview.mp3'),'wind':D/'wind-84914-preview.mp3'}
def read(p,filters):
 b=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-af',filters,'-f','f32le','-ar',str(sr),'-ac','1','-']);return np.frombuffer(b,np.float32).copy()
def cyclic(a,seconds):
 n=int(seconds*sr);t=np.linspace(0,1,n,dtype=np.float32);return np.concatenate((a[n:-n],a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2)))
def rms(a):return np.sqrt(np.mean(a*a))
def db(x):return float(20*np.log10(max(float(x),1e-10)))
# Preserve recorded gust envelopes; remove the source's artificial stereo pan by averaging to mono.
w=cyclic(read(sources['water'],'highpass=f=45'),1.5);g=cyclic(read(sources['wind'],'highpass=f=80,lowpass=f=7000'),3)
w*=10**(-32/20)/rms(w);g*=10**(-30/20)/rms(g)
# Equal-power left placement, retaining the right channel for mono compatibility.
angle=(1-.55)*np.pi/4;pan=np.array([np.cos(angle),np.sin(angle)],np.float32)
length=sr*83;idx=np.arange(length);water=w[idx%len(w),None]*pan;wind=g[idx%len(g),None]*np.array([2**-.5,2**-.5],np.float32)
a=water+wind;n=sr*3;t=np.linspace(0,1,n,dtype=np.float32)[:,None];a=np.concatenate((a[n:-n],a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2)))
# Shared attenuation retains placement and natural dynamics; no hard clipping.
scale=min(1,10**(-8/20)/abs(a).max());a*=scale
raw=D/'coastal-v3.f32';raw.write_bytes(a.tobytes());out=R/'h53-audio-trial-v3-20261018-coastal.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',str(raw),'-c:a','libmp3lame','-b:a','192k',str(out)],check=True)
dec=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out),'-f','f32le','-ar',str(sr),'-ac','2','-']),np.float32).reshape(-1,2)
row={'file':out.name,'sources':{'water':'https://freesound.org/people/kkenny101/sounds/852826/','wind':'https://freesound.org/people/swiftoid/sounds/84914/'},'sourceSha256':{k:hashlib.sha256(p.read_bytes()).hexdigest() for k,p in sources.items()},'license':'CC0 verified on both individual pages','windOriginalArtificialPanRemoved':True,'waterPan':-.55,'waterLeftOverRightDB':db(pan[0]/pan[1]),'windOverWaterMonoRMSdB':db(rms(g)/rms(w)),'seconds':len(a)/sr,'mixRMSdB':db(rms(a)),'decodedPeakDB':db(abs(dec).max()),'decodedLeftOverRightDB':db(rms(dec[:,0])/rms(dec[:,1])),'seamDelta':float(abs(a[0]-a[-1]).max()),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()};(D/'assets.json').write_text(json.dumps(row,indent=2));print(json.dumps(row,indent=2))
