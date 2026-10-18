from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
O=Path('/workspace/previews/2026-10-18/audio-sand-v4');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--autoplay-policy=user-gesture-required']);pg=b.new_page();errors=[];requests=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None);pg.on('request',lambda r:requests.append(r.url) if '.mp3' in r.url else None);pg.goto(base+'/preview/20261017/audio-survey-v4.html');assert pg.locator('audio').count()==3 and not requests
 for w,h in [(320,568),(390,844),(1100,800)]:
  pg.set_viewport_size({'width':w,'height':h});assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth');rows.append({'width':w,'noOverflow':True})
 for key in ['S03','S04','S06']:
  a=pg.locator('#'+key+' audio');a.evaluate('(a)=>a.addEventListener("click",()=>a.play(),{once:true})');a.click(position={'x':25,'y':25});pg.wait_for_function('(k)=>{let a=document.querySelector(`#${k} audio`);return !a.paused&&a.currentTime>0}',arg=key,timeout=30000);assert pg.evaluate('[...document.querySelectorAll("audio")].filter(a=>!a.paused).length')==1;rows.append({'source':key,'playback':True,'singlePlayer':True})
 assert not errors,errors;rows.append({'noAudioBeforeGesture':True,'errors':errors});b.close()
(O/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2));print('PASS',flush=True)
