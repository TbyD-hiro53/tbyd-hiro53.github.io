import urllib.request,re,html,json,concurrent.futures
from pathlib import Path
urls=['https://freesound.org/people/kyles/sounds/453327/','https://freesound.org/people/BMacZero/sounds/94128/','https://freesound.org/people/kyles/sounds/454351/','https://freesound.org/people/InspectorJ/sounds/412313/','https://freesound.org/people/Ferdinger/sounds/146231/','https://freesound.org/people/oldestmillennial/sounds/538216/']
def f(u):
 try:
  s=urllib.request.urlopen(u,timeout=25).read().decode(); clean=html.unescape(re.sub('<[^>]+>',' ',re.sub(r'<script[\s\S]*?</script>','',s)));clean=re.sub(r'\s+',' ',clean)
  title=html.unescape(re.search('<title>(.*?)</title>',s,re.S).group(1));a=clean.find('Log in Join')+11;b=clean.find('Comments',a)
  row={'url':u,'title':title,'description':clean[a:b],'licenses':list(dict.fromkeys(re.findall(r'https?://creativecommons.org/[^\s\"<>]+',s))),'mp3':list(dict.fromkeys(re.findall(r'https?://[^\s\"<>]+-hq\.mp3',s)))};print(json.dumps(row,ensure_ascii=False),flush=True);return row
 except Exception as e:print(u,e,flush=True);return {'url':u,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=2)as ex:rows=list(ex.map(f,urls))
Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/armillary-audio-v3/candidates.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False))
