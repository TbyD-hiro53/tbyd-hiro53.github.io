from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys,re
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060/preview/20261017/sanctum.html?skipgc'
out=Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/sanctum-corridor-v1');results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=.5);errors=[];requests=[]
 pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_default_timeout(60000)
 pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
 pg.on('request',lambda r:requests.append(r.url) if '.mp3' in r.url else None)
 pg.goto(url,wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && SanctumArtwork.report().ready',timeout=120000)
 assert not requests and pg.evaluate('__h53Audio.report().context') is None
 print('ready; no audio before gesture',flush=True)
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded',timeout=45000)
 assert pg.evaluate('__h53Audio.report().loopSeconds')==[28]
 assert pg.evaluate('__h53Audio.report().targets.room')==1
 assert pg.evaluate('__h53Audio.report().volume')==.55
 starts=pg.evaluate('__h53Audio.report().voiceStarts')
 pg.wait_for_timeout(29000)
 assert pg.evaluate('__h53Audio.report().voiceStarts')==starts
 assert len(requests)==1 and 'sanctum-corridor-v1-20261019-cave.mp3' in requests[0]
 print('one full 28s loop without voice restart passed',flush=True)
 pg.locator('[data-legacy-id="dp"]').tap();pg.wait_for_function('!__h53Audio.report().playing')
 pg.locator('[data-legacy-id="dp"]').tap();pg.wait_for_function('__h53Audio.report().playing')
 pg.locator('#composerToggle').tap();pg.wait_for_function('!document.getElementById("composerMenu").hidden')
 assert not pg.locator('#h53-audio-toggle').is_visible() # shared reading layout hides outside controls
 print('audio and pause/resume passed',flush=True)
 pg.locator('.h53-audio-row input').evaluate('(e)=>{e.value=30;e.dispatchEvent(new Event("input",{bubbles:true}))}');assert pg.evaluate('__h53Audio.report().volume')==.3
 pg.locator('#composerMenuClose').tap();pg.wait_for_timeout(350)
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().enabled',polling=250)
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing',polling=250)
 for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
  pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(500)
  geo=pg.evaluate('''() => {let a=document.getElementById('h53-audio-toggle').getBoundingClientRect(),m=document.getElementById('composerToggle').getBoundingClientRect();return {width:innerWidth,height:innerHeight,a:{x:a.x,y:a.y,w:a.width,h:a.height},m:{x:m.x,y:m.y,w:m.width,h:m.height}}}''')
  assert geo['a']['w']==44 and geo['a']['h']==44 and geo['a']['x']>=0 and geo['a']['x']+44<=geo['m']['x']
  pg.locator('#composerToggle').tap();pg.wait_for_timeout(350)
  assert pg.locator('.h53-audio-row').count()==1
  if w==390:pg.screenshot(path='/workspace/render-work/sanctum-corridor-v1/menu-390.png')
  pg.locator('#composerMenuClose').tap();pg.wait_for_timeout(350);results.append(geo);print('viewport '+str(w)+' passed',flush=True)
 pg.locator('#composerToggle').tap();pg.wait_for_timeout(350)
 pg.get_by_role('button',name=re.compile('UIを隠す|Hide UI')).tap();pg.wait_for_function('__composerLiquid.report().hidden',polling=250)
 assert not pg.locator('#h53-audio-toggle').is_visible() and pg.evaluate('__h53Audio.report().playing')
 pg.locator('#composerShow').tap();pg.wait_for_function('!__composerLiquid.report().hidden',polling=250)
 assert pg.locator('#h53-audio-toggle').is_visible()
 pg.evaluate("() => {let c=new BroadcastChannel('h53-audition-audio');c.postMessage({type:'claim',id:'qa-other-tab'});setTimeout(()=>c.close(),100)}")
 pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing',polling=250)
 print('UI hide/restore and other-tab claim passed',flush=True)
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing')
 pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))')
 pg.wait_for_function('__h53Audio.report().context==="suspended" && !__h53Audio.report().playing')
 pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))')
 pg.wait_for_function('__h53Audio.report().playing')
 pg.locator('#composerToggle').tap();pg.wait_for_timeout(350)
 pg.locator('.h53-audio-credits summary').click()
 assert 'deleted_user_2104797' in pg.locator('.h53-audio-credits').inner_text()
 assert 'HQ' in pg.locator('.h53-audio-credits').inner_text()
 assert not errors,errors
 results.append({'report':pg.evaluate('__h53Audio.report()'),'errors':errors,'audioRequests':requests})
 b.close()
(out/('independent-results.json' if ':8088/' in url else 'results.json')).write_text(json.dumps(results,indent=2));print(json.dumps(results[-1]))
