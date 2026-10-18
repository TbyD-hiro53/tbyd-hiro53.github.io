from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);g=b.new_page(viewport={'width':390,'height':844});errors=[];requests=[]
 g.on('pageerror',lambda e:errors.append(str(e)));g.on('request',lambda r:requests.append(r.url) if '.mp3' in r.url else None);g.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
 g.goto('http://127.0.0.1:8087/preview/20261017/armillary-discharge-study-v1.html',wait_until='networkidle');assert not requests
 checks=[]
 for i in range(2):
  a=g.locator('audio').nth(i);a.click();a.evaluate('(a)=>a.play()');g.wait_for_function('(i)=>{let a=document.querySelectorAll("audio")[i];return !a.paused&&a.currentTime>.2}',arg=i)
  checks.append(a.evaluate('(a)=>({duration:a.duration,volume:a.volume})'));assert g.evaluate('[...document.querySelectorAll("audio")].filter(a=>!a.paused).length')==1
 g.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');assert g.evaluate('[...document.querySelectorAll("audio")].every(a=>a.paused)')
 for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
  g.set_viewport_size({'width':w,'height':h});assert g.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors and len(requests)==2,(errors,requests)
 Path('audit/2026-10-19/armillary-discharge-study-v1/results.json').write_text(json.dumps({'clips':checks,'requestsBeforePlay':0,'exclusivePlayback':True,'pagehidePauses':True,'responsiveWidths':[320,390,844,1100],'errors':errors,'environment':'Chromium / independent ZIP extraction, not physical iPhone/Safari'},indent=2));b.close();print('candidate playback PASS')
