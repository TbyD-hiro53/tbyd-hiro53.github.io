from pathlib import Path
import subprocess,numpy as np,json,hashlib
S=Path('/tmp/h53-audio-candidates');R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/tmp/h53-audio-v2');sr=44100

def loop(name,fade,target,highpass=False):
 args=['ffmpeg','-v','error','-i',str(S/name)]
 if highpass:args+=['-af','highpass=f=80']
 b=subprocess.check_output(args+['-f','f32le','-ar',str(sr),'-ac','2','-']);a=np.frombuffer(b,np.float32).reshape(-1,2).copy();n=int(sr*fade);t=np.linspace(0,1,n,dtype=np.float32)[:,None];mix=a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2);a=np.concatenate((a[n:-n],mix));a*=min(10**(target/20)/max(np.sqrt(np.mean(a*a)),1e-8),10**(-12/20)/max(abs(a).max(),1e-8));return a
waves=loop('waves-852826-preview.mp3',1.5,-27);wind=loop('wind-459977-preview.mp3',2,float(20*np.log10(np.sqrt(np.mean(waves*waves))))-4,True);length=sr*83;idx=np.arange(length);a=waves[idx%len(waves)]+wind[idx%len(wind)];n=sr*3;t=np.linspace(0,1,n,dtype=np.float32)[:,None];mix=a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2);a=np.concatenate((a[n:-n],mix));a*=min(1.,10**(-12/20)/max(abs(a).max(),1e-8));raw=D/'coastal-wind.f32';raw.write_bytes(a.tobytes());dst=R/'h53-audio-trial-v2-20261018-coastal.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',str(raw),'-c:a','libmp3lame','-b:a','192k',str(dst)],check=True)
row={'file':dst.name,'sourceWaves':'https://freesound.org/people/kkenny101/sounds/852826/','sourceWind':'https://freesound.org/people/florianreichelt/sounds/459977/','license':'CC0 both individual pages verified','seconds':len(a)/sr,'channels':2,'windRelativeRMSdB':float(20*np.log10(np.sqrt(np.mean(wind*wind))/np.sqrt(np.mean(waves*waves)))),'rmsDB':float(20*np.log10(np.sqrt(np.mean(a*a)))),'peakDB':float(20*np.log10(abs(a).max())),'seamDelta':float(abs(a[0]-a[-1]).max()),'bytes':dst.stat().st_size,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()};(D/'assets.json').write_text(json.dumps(row,indent=2));print(json.dumps(row),flush=True)
