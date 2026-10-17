from pathlib import Path
import re,json,html,urllib.request,hashlib,subprocess,concurrent.futures
D=Path('/tmp/h53-audio-survey');out=Path('/workspace/previews/2026-10-18/audio-survey');out.mkdir(parents=True,exist_ok=True)
selected={'700254':'配管内の流水','554314':'タンクへの給水とエンジン','376534':'強風・嵐の比較候補','517995':'山の草を抜ける風','336556':'レンズの実録サーボ','451614':'広い室内の換気・空気感','538210':'搬送機のフォーリー比較候補'}
allrows=sum([json.loads(p.read_text()) for p in D.glob('*candidates.json')],[])
def acquire(n):
 row=next(x for x in allrows if '/'+n+'/' in x['url'] and x.get('hq'));s=(D/(n+'.html')).read_text();title=html.unescape(re.search('<title>(.*?)</title>',s,re.S).group(1)).replace('Freesound - ','');clean=html.unescape(re.sub('<[^>]+>',' ',re.sub(r'<script[\s\S]*?</script>','',s)));clean=re.sub(r'\s+',' ',clean);a=clean.find('Log in Join')+11;b=clean.find('Comments',a)
 url=row['hq'][0];file=out/(n+'-hq-preview.mp3');
 if not file.exists():
  try:file.write_bytes(urllib.request.urlopen(url,timeout=60).read())
  except Exception as e:return {'id':n,'url':row['url'],'error':str(e),'hqURL':url}
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(file)]));stream=probe['streams'][0]
 return {'id':n,'purpose':selected[n],'title':title,'url':row['url'],'licenseURL':row['licenses'][0],'descriptionAndOriginalSpecs':clean[a:b],'hqURL':url,'acquired':'public HQ MP3 preview; original WAV/FLAC not acquired','file':file.name,'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'duration':float(probe['format']['duration']),'sampleRate':int(stream['sample_rate']),'channels':stream['channels'],'subjectiveListening':'not yet approved'}
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=2).map(acquire,selected));(out/'sources.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print('acquired',len(rows),flush=True)
