from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,time,sys
D=Path('/workspace/render-work/audio-interiors');A=Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/audio-interiors');base='http://127.0.0.1:8060';deps=set(json.loads((A/'dependencies.json').read_text())) if sys.argv[1:] else set();results=json.loads((A/'results.json').read_text()) if sys.argv[1:] else []
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in (sys.argv[1:] or ['earth-origin-material','preservation-hall','shoko']):
  pg=b.new_page(viewport={'width':390,'height':844});errors=[];audio_requests=[]
  def response(r):
   if urlparse(r.url).hostname=='127.0.0.1':
    deps.add(unquote(urlparse(r.url).path).lstrip('/'))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('pageerror',lambda e:(errors.append(str(e)),print('PAGEERROR',e,flush=True)));pg.on('request',lambda r:audio_requests.append(r.url) if '.mp3' in r.url else None)
  pg.goto(f'{base}/preview/20261017/{work}.html?skipgc',wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000)
  assert not audio_requests and pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded',timeout=45000)
  views=range(4) if work=='earth-origin-material' else range(5) if work=='preservation-hall' else ['exterior','intake','room','reading','lower','daylight','branch'];rows=[]
  for view in views:
   if work=='earth-origin-material':pg.evaluate('(v)=>__H53M.station(v)',view)
   elif work=='preservation-hall':pg.locator('#v'+str(view)).click()
   else:pg.locator('button[data-scene="'+view+'"]').click()
   pg.wait_for_function('(v)=>__h53Audio.report().scene?.ready && __h53Audio.report().scene.view===v',arg=view,timeout=120000);pg.wait_for_timeout(650)
   report=pg.evaluate('__h53Audio.report()');assert report['playing'] and not report['error'];rows.append(report)
   if work=='shoko':assert (report['targets']['river']>0)==(view=='lower') and (report['targets']['conveyor']>0)==(view=='lower')
  if work=='earth-origin-material':assert rows[2]['targets']['room']<rows[0]['targets']['room'] and rows[3]['targets']['wind']>rows[0]['targets']['wind']
  if work=='preservation-hall':assert rows[2]['targets']['wind']>max(rows[0]['targets']['wind'],rows[4]['targets']['wind'])
  responsive=[]
  for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
   pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(700)
   menu='#menuToggle' if work=='shoko' else '#h53-menu-toggle';btn=pg.locator('#h53-audio-toggle').bounding_box();men=pg.locator(menu).bounding_box();assert btn and men and btn['width']==44 and btn['height']==44 and btn['x']>=0 and btn['x']+44<=men['x']-6
   responsive.append({'viewport':[w,h],'speaker':btn,'menu':men})
  pg.set_viewport_size({'width':390,'height':844});pg.wait_for_timeout(1200)
  # Pause follows the art's actual pause action where one exists; static preservation has no pause.
  if work=='earth-origin-material':
   pg.locator('#h53-menu-toggle').click();pg.locator('#eo-pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(600)
   pg.locator('#h53-menu-toggle').click();pg.locator('#eo-pause').click();pg.wait_for_function('__h53Audio.report().playing')
  if work=='shoko':
   pg.locator('button[data-scene="lower"]').click();pg.wait_for_function('__h53Audio.report().scene.view==="lower" && __h53Audio.report().scene.ready',timeout=120000)
   pg.locator('#menuToggle').click();pg.locator('#pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(650)
   pg.locator('#menuToggle').click();pg.locator('#pause').click();pg.wait_for_function('__h53Audio.report().playing');pg.wait_for_timeout(650)
  # Menu/credits and real volume input remain accessible.
  pg.locator(menu).click();pg.locator('.h53-audio-credits summary').click();pg.locator('.h53-audio-row input').fill('31');assert pg.evaluate('__h53Audio.report().volume')==.31
  pg.wait_for_timeout(700);pg.screenshot(path=str(D/f'{work}-menu.png'));pg.keyboard.press('Escape');pg.wait_for_timeout(700)
  # Hide the entire top UI, then restore. Audio button must follow menu.
  pg.locator(menu).click();pg.locator('#hideUI' if work=='shoko' else '#h53-menu-hide').click();pg.wait_for_timeout(700);assert not pg.locator('#h53-audio-toggle').is_visible()
  pg.locator('#showUI' if work=='shoko' else '#h53-ui-restore').click();pg.wait_for_timeout(350);assert pg.locator('#h53-audio-toggle').is_visible()
  # BFCache suspension/resume, cross-tab arbitration (no extra WebGL page).
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.wait_for_function('!__h53Audio.report().playing')
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.wait_for_function('__h53Audio.report().playing',timeout=120000)
  pg.evaluate('(()=>{let c=new BroadcastChannel("h53-audition-audio");c.postMessage({type:"claim",id:"qa-other-tab"});setTimeout(()=>c.close(),50)})()');pg.wait_for_function('!__h53Audio.report().enabled')
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#h53-audio-toggle').click();pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing')
  assert not errors,errors
  row={'work':work,'views':rows,'responsive':responsive,'requestsBeforeGesture':0,'audioRequests':audio_requests,'errors':errors,'lifecycle':'pause where available, UIhide/restore, persistedpagehide/pageshow, crosstabclaim, mute/resume passed'};results.append(row);(A/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));(A/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
(A/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));(A/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2));print('ALL PASS',len(deps),flush=True)
