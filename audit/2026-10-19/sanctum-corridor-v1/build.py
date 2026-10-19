from pathlib import Path
import json,hashlib,subprocess,wave,shutil,numpy as np
R=Path(__file__).resolve().parents[3];A=Path(__file__).parent;D=Path('/workspace/render-work/sanctum-corridor-v1');S=D/'source';src=S/'audio/164785_audition_070-100s_from_preview.wav'
assert hashlib.sha256(src.read_bytes()).hexdigest()=='2ee37efc96bc9840395a7f0d534d596b09475ea4a914c51c9f1b7fa1146afecc'
with wave.open(str(src)) as w:
 sr=w.getframerate();assert (w.getnchannels(),w.getsampwidth(),sr)==(1,2,48000);x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float64)/32768
assert len(x)==30*sr
# Crossfade the final two seconds into the first two seconds. The loop wraps
# from the end of the original head to its original following sample at t=2s.
c=2*sr;t=np.linspace(0,1,c);fade=.5-.5*np.cos(np.pi*t)
y=x[c:].copy();y[-c:]=x[-c:]*np.cos(fade*np.pi/2)+x[:c]*np.sin(fade*np.pi/2)
# Initial UI gain .55 makes the net gain -24 dB relative to the supplied excerpt.
gain_db=-24-20*np.log10(.55);y*=10**(gain_db/20)
pad=int(.1*sr);guard=np.concatenate((y[-pad:],y,y[:pad]));f=R/'sanctum-corridor-v1-20261019-cave.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','160k',str(f)],input=guard.astype('<f4').tobytes(),check=True)
checks=[]
for rate in [44100,48000]:
 z=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-ar',str(rate),'-ac','1','-f','f32le','pipe:1']),'<f4');z=z[round(.1*rate):round(28.1*rate)];assert len(z)==28*rate
 seam=abs(float(z[0]-z[-1]));p99=float(np.quantile(abs(np.diff(z)),.99));assert seam<p99 and abs(z).max()<.1
 checks.append({'sampleRate':rate,'seconds':len(z)/rate,'seamStep':seam,'sampleStepP99':p99,'peakDBFS':float(20*np.log10(abs(z).max())),'rmsDBFS':float(20*np.log10(np.sqrt(np.mean(z*z)))),'defaultGainDB':float(20*np.log10(.55))})
info={'source':'INT Cave Room tone.wav','author':'deleted_user_2104797','sourceURL':'https://freesound.org/people/deleted_user_2104797/sounds/164785/','license':'CC0 1.0 Universal','licenseURL':'https://creativecommons.org/publicdomain/zero/1.0/','provenance':'Freesound HQ preview MP3 decoded to excerpt WAV; not original WAV','excerptSeconds':[70,100],'inputSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'loopSeconds':28,'crossfadeSeconds':2,'crossfade':'smooth equal power, overlapping supplied tail/head; no reverb, EQ, denoising, pitch shifting, normalization, or generated sound','fileGainDB':float(gain_db),'defaultNetGainDB':-24,'file':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'codecGuardSeconds':.1,'decodedChecks':checks,'subjectiveAssistantAudition':False}
(A/'audio-build.json').write_text(json.dumps(info,ensure_ascii=False,indent=2)+'\n')
for a,b in [('CREDITS.txt','SOURCE-CREDITS.txt'),('metadata/author-selection.json','author-selection.json')]:shutil.copy2(S/a,A/b)
print(json.dumps(info,ensure_ascii=False,indent=2))
