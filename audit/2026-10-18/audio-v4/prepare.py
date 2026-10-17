from pathlib import Path
import subprocess,numpy as np,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/tmp/h53-audio-v4');sr=44100
sources={'water':Path('/tmp/h53-audio-candidates/waves-852826-preview.mp3'),'wind':D/'wind-165580-preview.mp3'}
def read(p,filters,channels=1,start=0,duration=None):
 cmd=['ffmpeg','-v','error','-ss',str(start),'-i',str(p)]
 if duration:cmd+=['-t',str(duration)]
 cmd+=['-af',filters,'-f','f32le','-ar',str(sr),'-ac',str(channels),'-'];x=np.frombuffer(subprocess.check_output(cmd),np.float32).copy();return x.reshape(-1,channels) if channels>1 else x

def cyclic(a,seconds):
 n=int(seconds*sr);t=np.linspace(0,1,n,dtype=np.float32)
 if a.ndim>1:t=t[:,None]
 return np.concatenate((a[n:-n],a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2)))
def rms(a):return np.sqrt(np.mean(a*a))
def db(x):return float(20*np.log10(max(float(x),1e-10)))
w=cyclic(read(sources['water'],'highpass=f=45'),1.5);w*=10**(-32/20)/rms(w)
# Outdoor coastal recording, 10:15–11:45; preserve recorded gusts and modest stereo width.
g=read(sources['wind'],'highpass=f=110,lowpass=f=5500',2,615,90);mid=g.mean(axis=1);side=(g[:,0]-g[:,1])*.5*.65;g=np.stack((mid+side,mid-side),axis=1);g=cyclic(g,3);g*=10**(-35/20)/rms(g)
angle=(1-.55)*np.pi/4;pan=np.array([np.cos(angle),np.sin(angle)],np.float32);length=sr*83;idx=np.arange(length);water=w[idx%len(w),None]*pan;wind=g[idx%len(g)];a=cyclic(water+wind,3);a*=min(1,10**(-8/20)/abs(a).max());raw=D/'coastal-v4.f32';raw.write_bytes(a.tobytes());out=R/'h53-audio-trial-v4-20261018-coastal.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',str(raw),'-c:a','libmp3lame','-b:a','192k',str(out)],check=True)
dec=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out),'-f','f32le','-ar',str(sr),'-ac','2','-']),np.float32).reshape(-1,2)
row={'file':out.name,'sources':{'water':{'url':'https://freesound.org/people/kkenny101/sounds/852826/','license':'CC0'},'wind':{'url':'https://freesound.org/people/Kyster/sounds/165580/','license':'CC BY 4.0','licenseURL':'https://creativecommons.org/licenses/by/4.0/','excerptSeconds':[615,705],'acquisition':'public HQ preview, not original WAV'}},'sourceSha256':{k:hashlib.sha256(p.read_bytes()).hexdigest() for k,p in sources.items()},'waterPan':-.55,'waterLeftOverRightDB':db(pan[0]/pan[1]),'windStereoWidth':.65,'windOverWaterStereoRMSdB':db(rms(wind)/rms(water)),'seconds':len(a)/sr,'mixRMSdB':db(rms(a)),'decodedPeakDB':db(abs(dec).max()),'seamDelta':float(abs(a[0]-a[-1]).max()),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()};(D/'assets.json').write_text(json.dumps(row,indent=2));print(json.dumps(row,indent=2))
