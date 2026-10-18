from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,sys
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-19/shoko-audio-v2';base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';deps=set();rows=[];errors=[];audio=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':390,'height':844},has_touch=True)
 pg.on('pageerror',lambda e:errors.append(str(e)))
 def response(r):
  if urlparse(r.url).hostname==urlparse(base).hostname:
   deps.add(unquote(urlparse(r.url).path).lstrip('/'))
   if r.status>=400:errors.append(str(r.status)+' '+r.url)
 pg.on('response',response);pg.on('request',lambda r:audio.append(r.url) if '.mp3' in r.url else None)
 pg.goto(base+'/preview/20261017/shoko.html?skipgc',wait_until='domcontentloaded',timeout=120000)
 pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000,polling=250)
 assert not audio and pg.evaluate('__h53Audio.report().context') is None
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=60000,polling=250)
 for view in ['exterior','intake','room','reading','lower','daylight','branch']:
  pg.locator('button[data-scene="'+view+'"]').tap()
  pg.wait_for_function('(v)=>__h53Audio.report().scene?.ready && __h53Audio.report().scene.view===v',arg=view,timeout=120000,polling=250)
  pg.wait_for_timeout(550);r=pg.evaluate('__h53Audio.report()');rows.append(r)
  assert r['playing'] and not r['error']
  assert (r['targets']['wind']>0)==(view in ['exterior','intake','daylight','branch'])
  assert (r['targets']['river']>0)==(view=='lower') and (r['targets']['conveyor']>0)==(view=='lower')
  if view=='lower':assert r['targets']['river']==.08 and r['targets']['rill']==.115
  print(view,'PASS',flush=True)
 pg.locator('button[data-scene="lower"]').tap();pg.wait_for_function('__h53Audio.report().scene.view==="lower" && __h53Audio.report().scene.ready',timeout=120000,polling=250)
 pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.wait_for_function('!__h53Audio.report().playing',polling=250);pg.wait_for_timeout(600)
 pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.wait_for_function('__h53Audio.report().playing',polling=250);pg.wait_for_timeout(600)
 pg.locator('#menuToggle').tap();pg.locator('.h53-audio-credits summary').tap()
 for name in ['waweee','kyles','Nox_Sound','peridactyloptrix','oldestmillennial']:
  assert name in pg.locator('.h53-audio-credits').inner_text()
 pg.locator('.h53-audio-row input').evaluate('(e)=>{e.value=32;e.dispatchEvent(new Event("input",{bubbles:true}))}')
 assert pg.evaluate('__h53Audio.report().volume')==.32
 pg.keyboard.press('Escape');pg.wait_for_timeout(800)
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().playing && !__h53Audio.report().enabled',polling=250)
 assert len(audio)==5 and not errors,(audio,errors)
 report={'views':rows,'audioRequests':audio,'errors':errors,'gestureOnly':True,'pauseResumeMuteVolumeCredits':'pass'}
 (A/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(A/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2));b.close();print('ALL PASS',flush=True)
