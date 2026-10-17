from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[];out=Path('/workspace/previews/2026-10-18/audio-survey')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--autoplay-policy=user-gesture-required']);pg=b.new_page();errors=[];mp3=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda r:mp3.append(r.url) if '.mp3' in r.url else None)
 pg.goto(base+'/preview/20261017/audio-survey.html');assert pg.locator('section.card').count()==25;assert pg.locator('audio').count()==3;assert not mp3
 for w,h in [(390,844),(320,568),(1100,800)]:
  pg.set_viewport_size({'width':w,'height':h});assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth');rows.append({'width':w,'noOverflow':True})
 pg.evaluate("document.querySelector('#S08').scrollIntoView()");pg.screenshot(path=str(out/'source-list.png'))
 # A real user click begins the first source; a second click begins another and stops the first.
 pg.evaluate("document.querySelector('#S08 audio').addEventListener('click',function(){this.play()},{once:true})");pg.locator('#S08 audio').click(position={'x':25,'y':25});pg.wait_for_function("!document.querySelector('#S08 audio').paused && document.querySelector('#S08 audio').currentTime>0",timeout=30000)
 pg.evaluate("document.querySelector('#S09 audio').addEventListener('click',function(){this.play()},{once:true})");pg.locator('#S09 audio').click(position={'x':25,'y':25});pg.wait_for_function("!document.querySelector('#S09 audio').paused && document.querySelector('#S08 audio').paused",timeout=30000)
 assert not errors,errors;rows.append({'cards':25,'noAudioRequestBeforeGesture':True,'playback':True,'singlePlayer':True,'errors':errors});b.close()
(out/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2));print('PASS',flush=True)
