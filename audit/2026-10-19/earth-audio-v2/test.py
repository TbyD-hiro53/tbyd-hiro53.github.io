from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/earth-audio-v2';rows=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work,count in [('earth-origin-material',4),('preservation-hall',5)]:
  pg=b.new_page(viewport={'width':390,'height':844});errors=[];requests=[]
  pg.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if '127.0.0.1:8060' in r.url:
    deps.add(urlparse(r.url).path.lstrip('/'))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:requests.append(r.url) if '.mp3' in r.url else None)
  pg.goto(f'http://127.0.0.1:8060/preview/20261017/{work}.html?skipgc',wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000)
  assert not requests and pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=45000)
  report=pg.evaluate('__h53Audio.report()');assert report['revision']=='interiors-audio-v2' and report['loopSeconds']==[29,29]
  views=[]
  for v in range(count):
   if count==4:pg.evaluate('(v)=>__H53M.station(v)',v)
   else:pg.locator('#v'+str(v)).click()
   pg.wait_for_function('(v)=>__h53Audio.report().scene.ready && __h53Audio.report().scene.view===v',arg=v,timeout=120000);pg.wait_for_timeout(250);r=pg.evaluate('__h53Audio.report()');views.append(r);assert r['playing'] and 0<r['targets']['wind']<=.18 and r['targets']['fan']>0
  if count==4:
   assert views[2]['targets']['fan']<views[0]['targets']['fan'] and views[2]['targets']['wind']<views[0]['targets']['wind']
   pg.locator('#h53-menu-toggle').click();pg.locator('#eo-pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(500);pg.locator('#h53-menu-toggle').click();pg.locator('#eo-pause').click();pg.wait_for_function('__h53Audio.report().playing');pg.wait_for_timeout(500)
  else:assert views[2]['targets']['wind']>views[0]['targets']['wind']
  # unchanged control geometry + working volume/mute and lifecycle.
  button=pg.locator('#h53-audio-toggle').bounding_box();menu=pg.locator('#h53-menu-toggle').bounding_box();assert button['width']==44 and button['height']==44 and button['x']+44<menu['x']
  pg.locator('#h53-menu-toggle').click();pg.locator('.h53-audio-row input').fill('30');assert pg.evaluate('__h53Audio.report().volume')==.3;pg.keyboard.press('Escape');pg.wait_for_timeout(600)
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.wait_for_function('!__h53Audio.report().playing');pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.wait_for_function('__h53Audio.report().playing')
  pg.evaluate('(()=>{const c=new BroadcastChannel("h53-audition-audio");c.postMessage({type:"claim",id:"qa-other-work"});setTimeout(()=>c.close(),50)})()');pg.wait_for_function('!__h53Audio.report().enabled')
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#h53-audio-toggle').click();pg.wait_for_function('!__h53Audio.report().playing')
  assert len(requests)==2 and all('interiors-audio-v2-20261019-' in u for u in requests) and not errors,(requests,errors)
  rows.append({'work':work,'views':views,'requestsBeforeGesture':0,'audioRequests':requests,'speaker':button,'menu':menu,'errors':errors,'checks':['gesture-only fetch','all viewpoints','Earth pause/resume where present','volume','pagehide/pageshow','cross-tab claim','mute/re-enable']});(A/'results.json').write_text(json.dumps(rows,indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
(A/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
for f,h in json.loads((A/'unchanged-baseline.json').read_text()).items():assert hashlib.sha256((R/f).read_bytes()).hexdigest()==h,f
print('ALL PASS. Production and v1 unchanged; SHOKO preview is owned by a concurrent task.',flush=True)
