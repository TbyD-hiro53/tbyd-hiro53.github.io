"""Collect public preview candidates; never requests credentials or original downloads.
python collect-pending.py --out /path/to/audio-candidates
Needs Python 3; ffprobe is optional. Existing successful files are preserved.
"""
import argparse,hashlib,json,subprocess,shutil,urllib.request
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--out',required=True,type=Path);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
 sources=json.loads(Path(__file__).with_name('sources.json').read_text());results=[]
 for s in sources:
  if s['downloaded']:continue
  target=a.out/(s['id']+'-hq-preview.mp3');result={'id':s['id'],'url':s['url'],'license':s['license'],'licenseURL':s['licenseURL'],'acquired':'public HQ preview, not original WAV/FLAC'}
  try:
   if not target.exists():
    data=urllib.request.urlopen(s['hqURL'],timeout=45).read()
    if not (data[:3]==b'ID3' or (len(data)>1 and data[0]==255 and data[1]&224==224)):raise ValueError('Response is not an MP3; not saved')
    tmp=target.with_suffix('.part');tmp.write_bytes(data);tmp.replace(target)
   if shutil.which('ffprobe'):subprocess.run(['ffprobe','-v','error',str(target)],check=True)
   result.update(file=str(target),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),status='downloaded; listening approval pending')
  except Exception as e:result.update(status='not acquired',error=str(e))
  results.append(result);(a.out/'acquisition-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(s['id'],result['status'])
 return 1 if any(x['status']=='not acquired' for x in results) else 0
if __name__=='__main__':raise SystemExit(main())
