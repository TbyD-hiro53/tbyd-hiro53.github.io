from pathlib import Path
import subprocess,numpy as np,json
D=Path('/workspace/render-work/audio-revision');P=Path('/workspace/tbyd-hiro53.github.io/preview/20261017');S=Path('/workspace/previews/2026-10-18/audio-survey');N=Path('/workspace/previews/2026-10-18/audio-revision');sr=44100

def decode(path,start,duration,filters):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(path),'-t',str(duration),'-af',filters,'-f','f32le','-ar',str(sr),'-ac','2','pipe:1']),np.float32).reshape(-1,2).copy()
def target(a,db):return a*float(10**(db/20)/np.sqrt(np.mean(a*a)+1e-14))
wind=target(decode(S/'376534-hq-preview.mp3',1,18,'highpass=f=40,lowpass=f=1800'),-29)
fade=int(1.5*sr);weights=np.linspace(0,1,fade)[:,None];repeated=np.concatenate([wind[:-fade],wind[-fade:]*(1-weights)+wind[:fade]*weights,wind[fade:]],axis=0)[:30*sr]
sand=target(decode(N/'244967-hq-preview.mp3',40,30,'highpass=f=180,lowpass=f=9000'),-24)
x=repeated+sand;peak=float(np.max(np.abs(x)));gain=min(1,10**(-2/20)/peak);x*=gain
x[:int(.5*sr)]*=np.linspace(0,1,int(.5*sr))[:,None];x[-sr:]*=np.linspace(1,0,sr)[:,None]
out=P/'audio-survey-v3-S03-mix.mp3';subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(out)],input=x.astype('float32').tobytes(),check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','40','-i',str(N/'244967-hq-preview.mp3'),'-t','20','-af','volume=14dB,afade=t=in:d=0.3,afade=t=out:st=19:d=1','-c:a','libmp3lame','-b:a','160k',str(P/'audio-survey-v3-S03-grains.mp3')],check=True)
(D/'sand-mix.json').write_text(json.dumps({'file':out.name,'windSource':'376534','windStart':1,'windSeconds':18,'windCrossfadeSeconds':1.5,'windFilter':'highpass 40 Hz, lowpass 1800 Hz','windRmsTargetDB':-29,'sandSource':'244967','sandStart':40,'sandSeconds':30,'sandFilter':'highpass 180 Hz, lowpass 9000 Hz','sandRmsTargetDB':-24,'finalGain':gain,'fadeInSeconds':.5,'fadeOutSeconds':1,'uncompressedPeakDB':float(20*np.log10(np.max(np.abs(x))))},indent=2));print('SAND MIX READY',flush=True)
