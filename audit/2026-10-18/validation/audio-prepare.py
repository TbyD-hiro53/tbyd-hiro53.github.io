from pathlib import Path
import subprocess,numpy as np,json,hashlib
S=Path('/tmp/h53-audio-candidates');R=Path('/workspace/tbyd-hiro53.github.io');out=[]
for name,source,ch,fade in [('carriage','train-341208-preview.mp3',2,2.),('coastal','waves-852826-preview.mp3',1,1.5)]:
 sr=44100;b=subprocess.check_output(['ffmpeg','-v','error','-i',str(S/source),'-f','f32le','-ar',str(sr),'-ac',str(ch),'-']);a=np.frombuffer(b,np.float32).reshape(-1,ch).copy();n=int(sr*fade)
 # A cyclic crossfade: tail -> head followed by the original head continuation.
 t=np.linspace(0,1,n,dtype=np.float32)[:,None];mix=a[-n:]*np.cos(t*np.pi/2)+a[:n]*np.sin(t*np.pi/2);a=np.concatenate((a[n:-n],mix));rms=np.sqrt(np.mean(a*a));gain=min(10**(-27/20)/max(rms,1e-8),10**(-12/20)/max(abs(a).max(),1e-8));a*=gain
 raw=Path('/tmp/h53-audio-trial')/(name+'.f32');raw.write_bytes(a.tobytes());dst=R/('h53-audio-trial-v1-20261018-'+name+'.mp3');subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac',str(ch),'-i',str(raw),'-c:a','libmp3lame','-b:a','160k',str(dst)],check=True)
 out.append({'file':dst.name,'source':source,'seconds':len(a)/sr,'channels':ch,'rmsDB':float(20*np.log10(np.sqrt(np.mean(a*a)))),'peakDB':float(20*np.log10(abs(a).max())),'seamDelta':float(abs(a[0]-a[-1]).max()),'bytes':dst.stat().st_size,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
Path('/tmp/h53-audio-trial/assets.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
