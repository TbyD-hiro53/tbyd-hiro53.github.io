from pathlib import Path
import json,subprocess,numpy as np
from faster_whisper.vad import get_speech_timestamps,VadOptions
D=Path('/workspace/previews/2026-10-19/interiors-human-free-candidates');p=D/'478643-hq-preview.mp3'
a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-af','pan=mono|c0=c0','-f','f32le','-ac','1','-ar','16000','pipe:1']),dtype=np.float32)
gain=min(10**(-24/20)/float(np.sqrt((a*a).mean())),.95/float(np.max(np.abs(a))))
spans=get_speech_timestamps(a*gain,VadOptions(threshold=.45,min_speech_duration_ms=250,min_silence_duration_ms=250,speech_pad_ms=300),sampling_rate=16000)
out={'id':'478643','channel':'left on-axis fan only','screeningGain':gain,'speechCandidates':[{'start':x['start']/16000,'end':x['end']/16000} for x in spans],'limitation':'Speech-candidate screening only; not a guarantee of no voices, footsteps or handling noise.'}
(D/'478643-vad.json').write_text(json.dumps(out,indent=2));print(json.dumps(out))
