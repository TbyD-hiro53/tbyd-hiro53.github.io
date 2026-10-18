from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/earth-audio-v3';rows=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work,count in [('earth-origin-material',4),('preservation-hall',5),('shoko',7)]:
  pg=b.new_page(viewport={'width':390,'height':844});errors=[];requests=[]
  pg.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if r.url.startswith('http://127.0.0.1:8060/'):
    deps.add(urlparse(r.url).path.lstrip('/'))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:requests.append(r.url) if '.mp3' in r.url else None)
  pg.goto(f'http://127.0.0.1:8060/preview/20261017/{work}.html?skipgc',wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000)
  assert not requests and pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=45000)
  report=pg.evaluate('__h53Audio.report()');assert report['revision']==('shoko-audio-v3' if count==7 else 'interiors-audio-v3') and report['loopSeconds']==([29,29,17,17,17] if count==7 else [29,29])
  views=[]
  for v in (['exterior','intake','room','reading','lower','daylight','branch'] if count==7 else range(count)):
   if count==4:pg.evaluate('(v)=>__H53M.station(v)',v)
   elif count==5:pg.locator('#v'+str(v)).click()
   else:pg.locator('button[data-scene="'+v+'"]').click()
   pg.wait_for_function('(v)=>__h53Audio.report().scene.ready && __h53Audio.report().scene.view===v',arg=v,timeout=120000);pg.wait_for_timeout(300);r=pg.evaluate('__h53Audio.report()');views.append(r);assert r['playing']
   if count!=7:assert 0<r['targets']['wind']<=.18 and r['targets']['fan']>0
   else:
    assert (r['targets']['river']>0)==(v=='lower') and (r['targets']['conveyor']>0)==(v=='lower')
    assert r['targets']['wind']==({'exterior':.8,'intake':.28,'daylight':.55,'branch':.12}.get(v,0))
    if v=='lower':assert r['targets']['river']==.08 and r['targets']['rill']==.115 and r['targets']['conveyor']==.10
  menu='#menuToggle' if count==7 else '#h53-menu-toggle'
  if count==4:
   assert views[2]['targets']['fan']<views[0]['targets']['fan'];pg.locator(menu).click();pg.locator('#eo-pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(500);pg.locator(menu).click();pg.locator('#eo-pause').click();pg.wait_for_function('__h53Audio.report().playing');pg.wait_for_timeout(500)
  if count==7:
   pg.locator('button[data-scene="lower"]').click();pg.wait_for_function('__h53Audio.report().scene.view==="lower" && __h53Audio.report().scene.ready',timeout=120000);pg.locator(menu).click();pg.locator('#pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(600);pg.locator(menu).click();pg.locator('#pause').click();pg.wait_for_function('__h53Audio.report().playing');pg.wait_for_timeout(600);pg.locator('button[data-scene="branch"]').click();pg.wait_for_function('__h53Audio.report().scene.view==="branch" && __h53Audio.report().scene.ready',timeout=120000)
  button=pg.locator('#h53-audio-toggle').bounding_box();menubox=pg.locator(menu).bounding_box();assert button['width']==44 and button['height']==44 and button['x']+44<menubox['x']
  pg.locator(menu).click();pg.locator('.h53-audio-row input').fill('30');assert pg.evaluate('__h53Audio.report().volume')==.3
  credits=pg.locator('.h53-audio-credits').text_content();assert 'peqdavid5' in credits and 'Anya_Media' in credits and 'kyles' not in credits and 'waweee' not in credits
  pg.keyboard.press('Escape');pg.wait_for_timeout(650)
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.wait_for_function('!__h53Audio.report().playing');pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.wait_for_function('__h53Audio.report().playing',timeout=120000)
  pg.evaluate('(()=>{const c=new BroadcastChannel("h53-audition-audio");c.postMessage({type:"claim",id:"qa-other-work"});setTimeout(()=>c.close(),50)})()');pg.wait_for_function('!__h53Audio.report().enabled')
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#h53-audio-toggle').click();pg.wait_for_function('!__h53Audio.report().playing')
  assert len(requests)==(5 if count==7 else 2) and not errors,(requests,errors)
  assert not any('interiors-audio-v1-20261019-room' in u or 'interiors-audio-v1-20261019-wind' in u or 'interiors-audio-v2-' in u for u in requests)
  assert any('interiors-audio-v3-20261019-fan' in u for u in requests) and any('interiors-audio-v3-20261019-wind' in u for u in requests)
  rows.append({'work':work,'views':views,'requestsBeforeGesture':0,'audioRequests':requests,'speaker':button,'menu':menubox,'errors':errors,'checks':['new-recordings-only for indoor air/wind','gesture-only fetch','all viewpoints','pause/resume where present','volume','source credits','pagehide/pageshow','cross-tab claim','mute/re-enable','SHOKO lower mix unchanged']});(A/'results.json').write_text(json.dumps(rows,indent=2));(A/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
for f,h in json.loads((A/'unchanged-baseline.json').read_text()).items():assert hashlib.sha256((R/f).read_bytes()).hexdigest()==h,f
print('ALL PASS. Production and old audio versions unchanged.',flush=True)
