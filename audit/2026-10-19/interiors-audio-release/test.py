from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json,sys
A=Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/interiors-audio-release');base='http://127.0.0.1:8084';results=json.loads((A/'independent-results.json').read_text()) if len(sys.argv)>1 else []
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in (sys.argv[1:] or ['earth-origin-material','preservation-hall','shoko']):
  pg=b.new_page(viewport={'width':390,'height':844});errors=[];audio=[];deps=set()
  pg.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if r.url.startswith(base+'/'):
    deps.add(urlparse(r.url).path)
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:audio.append(r.url) if '.mp3' in r.url else None)
  pg.goto(base+'/'+work+'.html?skipgc'+('#lower' if work=='shoko' else ''),wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000)
  assert pg.locator('base').count()==0
  assert pg.locator('meta[name="robots"][content*="noindex"]').count()==0
  assert pg.locator('link[rel="canonical"]').get_attribute('href')=='https://tbyd-hiro53.github.io/'+work+'.html'
  assert pg.locator('a[href="index.html"], a[href="./index.html"]').count()>0
  assert not audio and pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=120000)
  initial=pg.evaluate('__h53Audio.report()');assert initial['revision']==('shoko-audio-v3' if work=='shoko' else 'interiors-audio-v3')
  if work=='earth-origin-material':pg.evaluate('__H53M.station(3)');target=3
  elif work=='preservation-hall':pg.locator('#v2').click();target=2
  else:
   assert initial['scene']['view']=='lower' and initial['targets']['river']==.08
   pg.locator('button[data-scene="intake"]').click();target='intake'
  pg.wait_for_function('(v)=>__h53Audio.report().scene.ready && __h53Audio.report().scene.view===v',arg=target,timeout=120000)
  pg.wait_for_function('__h53Audio.report().playing',timeout=30000);report=pg.evaluate('__h53Audio.report()');assert report['playing']
  if work=='shoko':assert urlparse(pg.url).path=='/shoko.html' and urlparse(pg.url).query=='skipgc' and report['targets']['river']==0
  menu='#menuToggle' if work=='shoko' else '#h53-menu-toggle';button=pg.locator('#h53-audio-toggle').bounding_box();mb=pg.locator(menu).bounding_box();assert button['width']==44 and button['height']==44 and button['x']+44<mb['x']
  pg.locator(menu).click();credits=pg.locator('.h53-audio-credits').text_content();assert 'peqdavid5' in credits and 'Anya_Media' in credits
  (pg.keyboard.press('Escape') if work=='shoko' else pg.locator(menu).click());pg.wait_for_timeout(850);pg.locator('#h53-audio-toggle').click();pg.wait_for_function('!__h53Audio.report().playing')
  assert not errors and len(audio)==(5 if work=='shoko' else 2),(errors,audio)
  results.append({'work':work,'status':'PASS','initial':initial,'changedView':report,'url':pg.url,'audioRequests':audio,'requestsBeforeGesture':0,'dependencies':sorted(deps),'errors':errors,'checks':['root path and canonical','no preview base/noindex','return to root index','gesture-only audio fetch','approved v3 recordings','representative view switch','SHOKO lower water only','44px menu-neighbor speaker','source credits','mute']})
  (A/'independent-results.json').write_text(json.dumps(results,indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
print('ALL PASS',flush=True)
