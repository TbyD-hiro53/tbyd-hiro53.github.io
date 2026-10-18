from pathlib import Path
import json, subprocess
import numpy as np
from scipy.ndimage import uniform_filter1d

ROOT=Path('/workspace/tbyd-hiro53.github.io')
SOURCES=Path('/workspace/previews/2026-10-18')
SR=44100
def decode(path,start,length,filters):
    data=subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(path),'-t',str(length),'-af',filters,'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'])
    return np.frombuffer(data,np.float32).reshape(-1,2).copy()
def level(x,db): return x*10**(db/20)/np.sqrt(np.mean(x*x))
def repeat(x,length,overlap):
    n=int(overlap*SR);a=np.linspace(0,np.pi/2,n)[:,None];y=x.copy()
    while len(y)<length:
        y=np.concatenate([y[:-n],y[-n:]*np.cos(a)+x[:n]*np.sin(a),x[n:]])
    return y[:length]
def circular(x,overlap):
    n=int(overlap*SR);a=np.linspace(0,np.pi/2,n)[:,None]
    return np.concatenate([x[n:-n],x[-n:]*np.cos(a)+x[:n]*np.sin(a)])
sweep=decode(SOURCES/'audio-sand-v4/446950-hq-preview.mp3',5.5,6,'highpass=f=500,lowpass=f=7600')
env=np.sqrt(uniform_filter1d(np.mean(sweep*sweep,axis=1),int(.35*SR))+1e-14)
sweep*=np.clip(np.median(env)/env,.75,1.35)[:,None]
flow=decode(SOURCES/'audio-sand-v4/825860-hq-preview.mp3',30,30,'highpass=f=1100,lowpass=f=7200')
sand=circular(level(repeat(sweep,len(flow),1),-25)+level(flow,-38),1)
wind=circular(decode(SOURCES/'audio-survey/376534-hq-preview.mp3',1,18,'highpass=f=45,lowpass=f=600'),1.5)
wind=level(wind,-28)
report={}
for name,x in [('sand',sand),('wind',wind)]:
    file=ROOT/f'xerophyte-audio-v1-20261018-{name}.mp3'
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(file)],input=x.astype('float32').tobytes(),check=True)
    decoded=decode(file,0,60,'anull');window=int(.1*SR)
    report[name]={'file':file.name,'bytes':file.stat().st_size,'duration':len(decoded)/SR,'rmsDBFS':float(20*np.log10(np.sqrt(np.mean(decoded**2)))),'peak':float(np.max(np.abs(decoded))),'peakDBFS':float(20*np.log10(np.max(np.abs(decoded)))),'seamStep':float(np.max(np.abs(decoded[0]-decoded[-1]))),'seamRmsRatio':float(np.sqrt(np.mean(np.concatenate([decoded[-window:],decoded[:window]])**2))/np.sqrt(np.mean(decoded**2)))}
report['worstCasePeakBoundAtFullVolume']=report['sand']['peak']*1.59+report['wind']['peak']*1.08
report['sources']=[{'id':446950,'author':'Lonofi / Mathias Rossignol','license':'CC BY 4.0','type':'synthetic designed sand sweep','excerpt':'5.5–11.5 s; HP500/LP7600 Hz; 350 ms envelope gain 0.75–1.35; repeated 1 s equal-power overlap; −25 dBFS RMS before circularization'},{'id':825860,'author':'Vrymaa','license':'CC0','type':'flowing sand recording according to uploader','excerpt':'30–60 s; HP1100/LP7200 Hz; −38 dBFS RMS before circularization'},{'id':376534,'author':'keirofinch','license':'CC0','type':'wind recording','excerpt':'1–19 s; HP45/LP600 Hz; circular 1.5 s equal-power overlap; −28 dBFS RMS'}]
report['note']='Accepted S03 v4 sand timbre preserved. Sand combined then circularized with 1 s overlap; no end fades. Wind separated and lifted for runtime storm envelope. Rejected contact-mic 244967 is absent. Source files are public HQ MP3 previews, not original WAVs.'
(ROOT/'audit/2026-10-18/xerophyte-audio-v1/audio-build.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
