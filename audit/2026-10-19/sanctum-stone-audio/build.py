from pathlib import Path
import subprocess,numpy as np,json,hashlib
from scipy.signal import fftconvolve
R=Path(__file__).resolve().parents[3];D=Path('/workspace/previews/2026-10-19/sanctum-stone-sources');sr=44100
wind=R/'interiors-audio-v3-20261019-wind.mp3'
def decode(p):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
x=decode(wind)[4410:4410+20*sr];x[:int(.6*sr)]*=np.linspace(0,1,int(.6*sr))[:,None];x[-int(.5*sr):]*=np.linspace(1,0,int(.5*sr))[:,None];rows=[]
for key,name in [('a','st_nicolaes_church'),('b','derlon_sanctuary'),('c','five_columns_long')]:
 raw=D/(name+'.wav');ir=decode(raw);y=np.stack([fftconvolve(x[:,ch],ir[:,ch])for ch in range(2)],axis=1);y*=10**(-28/20)/np.sqrt(np.mean(y[5*sr:17*sr]**2));assert abs(y).max()<.8
 y[-int(.1*sr):]*=np.linspace(1,0,int(.1*sr))[:,None];f=R/f'sanctum-stone-study-v1-20261019-{key}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=y.astype('float32').tobytes(),check=True)
 energy=np.sum(ir.astype('float64')**2,axis=1);edc=np.cumsum(energy[::-1])[::-1];edc=10*np.log10(np.maximum(edc/edc[0],1e-15));sel=(edc<-5)&(edc>-25);slope=np.polyfit(np.arange(len(ir))[sel]/sr,edc[sel],1)[0];rt=-60/slope
 rows.append(dict(key=key,name=name,kind='Externally authored modeled IR, not a real-room field recording',source='Voxengo / Aleksey Vaneev via oramics/sampled',irFile=raw.name,irSHA256=hashlib.sha256(raw.read_bytes()).hexdigest(),irDuration=len(ir)/sr,estimatedRT60=rt,sourceLicense='Voxengo LICENSE.txt (royalty-free use including commercial; copyright retained; redistribution conditions)',windSource='Anya_Media / Freesound523389 / CC0; processed source detailed in interiors-audio-v3',windSHA256=hashlib.sha256(wind.read_bytes()).hexdigest(),processing='20s recorded tree wind convolved offline with full published IR; equal middle RMS -28dBFS; no generated oscillator, voice or footsteps; 0.6s fade-in and 0.5s excitation fade-out, full decay retained',file=f.name,bytes=f.stat().st_size,duration=len(y)/sr,peak=float(abs(y).max()),sha256=hashlib.sha256(f.read_bytes()).hexdigest()))
(R/'audit/2026-10-19/sanctum-stone-audio/build.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
