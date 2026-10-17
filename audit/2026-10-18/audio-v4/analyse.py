from pathlib import Path
import numpy as np,subprocess,json
D=Path(__file__).parent;src=D/'wind-165580-preview.mp3';sr=16000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-ar',str(sr),'-ac','1','-f','f32le','-']),np.float32)
n=4096;P=np.abs(np.fft.rfft(x[:len(x)//n*n].reshape(-1,n)*np.hanning(n),axis=1))**2;f=np.fft.rfftfreq(n,1/sr);times=(np.arange(len(P))+.5)*n/sr
rows=[]
for start in range(15,int(len(x)/sr)-90,15):
 p=P[(times>=start)&(times<start+90)];low=p[:,(f>=90)&(f<1600)].sum(axis=1);hi=p[:,(f>=1800)&(f<7000)].sum(axis=1);rows.append({'start':start,'hiOverLow':float(hi.sum()/low.sum()),'peakHiOverLow':float(np.quantile(hi/(low+1e-10),.99)),'gustDynamicRatio':float(np.quantile(low,.9)/max(1e-10,np.quantile(low,.1)))})
rows.sort(key=lambda r:r['peakHiOverLow']);(D/'segments.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows[:10],indent=2))
