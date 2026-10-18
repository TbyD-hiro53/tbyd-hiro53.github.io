from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
R=Path('/workspace/tbyd-hiro53.github.io'); D=R/'audit/2026-10-19/audio-outdoor'; deps=set(); results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['armillary-v2','binary-dusk']:
  errors=[];requests=[];pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=1)
  pg.on('pageerror',lambda e:(errors.append(str(e)),print(work,'ERROR',str(e),flush=True)))
  def response(r):
   if '127.0.0.1:8060/' in r.url:
    deps.add(r.url.split('8060/')[1].split('?')[0]);(D/'runtime-dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:requests.append(r.url))
  original_wait=pg.wait_for_function
  pg.wait_for_function=lambda expression,**kwargs:original_wait(expression,polling=250,**kwargs)
  print(work,'START',flush=True)
  pg.goto(f'http://127.0.0.1:8060/preview/20261017/{work}.html?skipgc',wait_until='domcontentloaded',timeout=60000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene && __h53Audio.report().scene.running',timeout=120000)
  assert not [r for r in requests if r.endswith('.mp3')]
  assert pg.evaluate('__h53Audio.report().context') is None
  print(work,'READY',flush=True)
  pg.locator('#h53-audio-toggle').tap(timeout=60000);pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded',timeout=60000)
  assert pg.evaluate('__h53Audio.report().loopSeconds')==[29,59]
  print(work,'AUDIO',flush=True)
  if work!='binary-dusk':
   views=pg.evaluate('ArmillaryUI.report().viewButtons.map(x=>x.key)')
   for v in views:pg.evaluate('(v)=>ArmillaryArtwork.setView(v)',v);pg.wait_for_timeout(300)
   pg.evaluate('ArmillaryArtwork.setPlaying(false)')
  else:
   pg.evaluate('document.getElementById("pause").click()')
  pg.evaluate('__h53Audio.sync()');pg.wait_for_function('!__h53Audio.report().playing',timeout=20000)
  if work!='binary-dusk':pg.evaluate('ArmillaryArtwork.setPlaying(true)')
  else:pg.evaluate('document.getElementById("pause").click()')
  pg.evaluate('__h53Audio.sync()');pg.wait_for_function('__h53Audio.report().playing',timeout=20000)
  print(work,'play/pause PASS',flush=True)
  for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
   pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(1600)
   pg.wait_for_function('__h53Audio.report().scene.running',timeout=90000)
   box=pg.locator('#h53-audio-toggle').bounding_box(); menu=pg.locator('#menuToggle' if work=='binary-dusk' else '#composerToggle').bounding_box()
   print(work,w,box,flush=True)
   assert box and box['width']==44 and box['height']==44,(work,w,box)
   assert box['x']>=0 and box['x']+box['width']<=w and box['y']>=0 and box['y']+box['height']<=h,(work,w,box)
   assert abs(box['y']-menu['y'])<2 and menu['x']>=box['x']+44,(work,w,box,menu)
   
   if work!='binary-dusk':pg.evaluate('ArmillaryArtwork.setPlaying(false)')
   # Rect-only responsive check; representative screenshot below.
   if work!='binary-dusk':pg.evaluate('ArmillaryArtwork.setPlaying(true)')
  # Menu/volume controls and credits work; composer rebuilds its content on each open.
  pg.locator('#menuToggle' if work=='binary-dusk' else '#composerToggle').click();pg.wait_for_timeout(400)
  pg.locator('.h53-audio-row input').fill('30');pg.locator('.h53-audio-row input').dispatch_event('input');assert abs(pg.evaluate('__h53Audio.report().volume')-.3)<.01
  pg.locator('.h53-audio-credits summary').click();assert pg.locator('.h53-audio-credits').get_attribute('open') is not None
  
  if work!='binary-dusk':pg.evaluate('ArmillaryArtwork.setPlaying(false)')
  pg.screenshot(path=str(D/f'{work}-menu.png'),timeout=30000)
  if work!='binary-dusk':pg.evaluate('ArmillaryArtwork.setPlaying(true)')
  # Synthetic page lifecycle exercises persisted return without navigating/deallocating the visual scene.
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.evaluate('__h53Audio.sync()');pg.wait_for_function('!__h53Audio.report().playing',timeout=20000)
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.evaluate('__h53Audio.sync()');pg.wait_for_function('__h53Audio.report().playing',timeout=20000)
  # Cross-tab claim mutes current work.
  pg.evaluate('window.testChannel=new BroadcastChannel("h53-audition-audio");testChannel.postMessage({type:"claim",id:"qa-other"})')
  pg.wait_for_function('!__h53Audio.report().enabled');pg.evaluate('testChannel.close()')
  assert not errors,errors
  results.append({'work':work,'report':pg.evaluate('__h53Audio.report()'),'errors':errors,'checks':['no initial audio/context','gesture starts 29/59s loops','pause/resume','view changes','320/390/844/1100 controls','menu/volume/credits','pagehide/pageshow','cross-tab claim']})
  (D/'results.json').write_text(json.dumps(results,indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
(D/'results.json').write_text(json.dumps(results,indent=2));(D/'runtime-dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
