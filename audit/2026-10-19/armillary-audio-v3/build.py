from pathlib import Path
import subprocess,numpy as np,json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');D=R/'audit/2026-10-19/armillary-audio-v3';src=Path('/workspace/previews/2026-10-19/armillary-audio-v3-sources/412313-hq-preview.mp3');sr=44100;rows=[]
for i,(start,end) in enumerate([(5.08,5.51),(5.54,6.04),(6.04,6.49)],1):
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(src),'-t',str(end-start),'-af','highpass=f=700,lowpass=f=10000','-f','f32le','-ar',str(sr),'-ac','1','pipe:1']),np.float32).copy()
 x*=10**(-23/20)/np.sqrt(np.mean(x*x));x=.38*np.tanh(x/.38)
 n=int(.004*sr);x[:n]*=np.linspace(0,1,n);x[-n:]*=np.linspace(1,0,n);duration=len(x)/sr
 # Preserve the recording's irregular internal transients, without generating bursts or noise.
 guard=int(.1*sr);padded=np.concatenate([np.zeros(guard),x,np.zeros(guard)]);f=R/f'armillary-audio-v3-20261019-spark{i}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k',str(f)],input=padded.astype('float32').tobytes(),check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar',str(sr),'-ac','1','pipe:1']),np.float32)[guard:guard+len(x)]
 assert abs(y).max()<.5 and np.isfinite(y).all()
 windows=np.array([np.sqrt(np.mean(y[j:j+220]**2))for j in range(0,len(y)-220,220)])
 rows.append(dict(file=f.name,source='InspectorJ / 412313',sourceInterval=[start,end],duration=duration,filters='highpass700Hz,lowpass10000Hz; mono fold; target-23dBFS;0.38*tanh(x/0.38);4ms edge fades;no pitch/reversal/generated noise',codecGuardSeconds=.1,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),rmsDBFS=float(20*np.log10(np.sqrt(np.mean(y*y)))),peak=float(abs(y).max()),rmsWindow5msRatio95to10=float(np.percentile(windows,95)/np.percentile(windows,10)),sourceSHA256=hashlib.sha256(src.read_bytes()).hexdigest()))
(D/'audio-build.json').write_text(json.dumps(rows,indent=2));print(rows)
