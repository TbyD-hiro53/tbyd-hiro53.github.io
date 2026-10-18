from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/previews/2026-10-18/audio-revision');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--autoplay-policy=user-gesture-required']);pg=b.new_page();errors=[];mp3=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None);pg.on('request',lambda r:mp3.append(r.url) if '.mp3' in r.url else None)
 pg.goto(base+'/preview/20261017/audio-survey-v3.html');assert pg.locator('audio').count()==12;assert not mp3
 for w,h in [(320,568),(390,844),(1100,800)]:
  pg.set_viewport_size({'width':w,'height':h});assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth');rows.append({'width':w,'noOverflow':True})
 pg.locator('details').evaluate_all('(nodes)=>nodes.forEach(n=>n.open=true)')
 for suffix in ['S03-mix','S03-grains','S04','S06-clean','S06-raw']:
  locator=pg.locator('audio[src="audio-survey-v3-'+suffix+'.mp3"]');locator.evaluate('(a)=>a.addEventListener("click",()=>a.play(),{once:true})');locator.click(position={'x':25,'y':25});pg.wait_for_function('(suffix)=>{let a=document.querySelector(`audio[src="audio-survey-v3-${suffix}.mp3"]`);return !a.paused&&a.currentTime>0}',arg=suffix,timeout=30000)
  assert pg.evaluate('[...document.querySelectorAll("audio")].filter(a=>!a.paused).length')==1;rows.append({'sample':suffix,'playback':True,'singlePlayer':True})
 pg.locator('#S03').scroll_into_view_if_needed();pg.screenshot(path=str(D/'review.png'));assert not errors,errors;rows.append({'noAudioBeforeGesture':True,'errors':errors});b.close()
(D/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2));print('ALL PASS',flush=True)
