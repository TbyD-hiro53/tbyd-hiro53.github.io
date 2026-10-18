from pathlib import Path
import json,subprocess,numpy as np
from scipy import signal
from faster_whisper.vad import get_speech_timestamps,VadOptions
D=Path(__file__).parent;p=D/'523389-hq-preview.mp3'
a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar','16000','pipe:1']),dtype=np.float32)
vad_gain=min(10**(-24/20)/float(np.sqrt((a*a).mean())),.95/float(np.max(np.abs(a))))
print("VAD screening gain",vad_gain,flush=True)
spans=get_speech_timestamps(a*vad_gain,VadOptions(threshold=.45,min_speech_duration_ms=250,min_silence_duration_ms=250,speech_pad_ms=300),sampling_rate=16000)
spans=[{'start':x['start']/16000,'end':x['end']/16000} for x in spans]
low=signal.sosfilt(signal.butter(4,160,fs=16000,btype='lowpass',output='sos'),a)
mid=signal.sosfilt(signal.butter(4,[250,3500],fs=16000,btype='bandpass',output='sos'),a)
rows=[]
for t in range(5,110,5):
 x=a[t*16000:(t+30)*16000];lo=low[t*16000:(t+30)*16000];mi=mid[t*16000:(t+30)*16000]
 chunks=mi[:len(mi)//1600*1600].reshape(-1,1600);rms=np.sqrt((chunks**2).mean(axis=1)+1e-20)
 rows.append({'start':t,'end':t+30,'speechCandidates':[v for v in spans if v['end']>t and v['start']<t+30],'rmsDBFS':float(20*np.log10(np.sqrt((x*x).mean()))),'lowEnergyRatio':float(np.mean(lo*lo)/np.mean(x*x)),'shortRms95to50':float(np.percentile(rms,95)/np.percentile(rms,50)),'largestEnergyStep':float(np.max(np.abs(np.diff(rms))))})
(D/'523389-analysis.json').write_text(json.dumps({'speechCandidates':spans,'windows':rows,'limitation':'VAD and spectral metrics are screening aids; they do not prove absence of voices, footsteps, birds or equipment handling.'},indent=2))
print('Speech',spans);print(json.dumps(sorted(rows,key=lambda x:(len(x['speechCandidates']),x['shortRms95to50']))[:6],indent=2))
