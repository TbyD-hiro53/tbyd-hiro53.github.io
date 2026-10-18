from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse
import sys,json
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060'
OUT=Path(sys.argv[2]) if len(sys.argv)>2 else Path('/workspace/render-work/core-binary-release/local');OUT.mkdir(parents=True,exist_ok=True)
rows=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug in ['core-37','binary-dusk']:
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,ignore_https_errors=True);pg.set_default_timeout(60000);errors=[];aud=[]
  def response(r):
   if r.url.startswith(BASE):
    deps.add(urlparse(r.url).path.lstrip('/'))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
    if '.mp3' in r.url:aud.append(r.url)
  pg.on('response',response);pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.goto(BASE+'/'+slug+'.html?skipgc&release-audio-v1',wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene && __h53Audio.report().scene.running',timeout=120000)
  assert pg.locator('base').count()==0 and pg.locator('meta[name=robots]').count()==0
  assert pg.locator('link[rel=canonical]').get_attribute('href')=='https://tbyd-hiro53.github.io/'+slug+'.html'
  assert pg.evaluate('__h53Audio.report().context') is None and not aud
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded')
  before=pg.evaluate('__h53Audio.report()');assert before['loopSeconds']==([17,17] if slug=='core-37' else [29,59])
  if slug=='core-37':
   pg.locator('#year').tap();pg.evaluate('__core37.clock.t=__core37.clock.yearAt+20');pg.wait_for_timeout(600);r=pg.evaluate('__h53Audio.report()');assert r['scene']['narrating'] and r['targets']['drive']<before['targets']['drive']
  else:
   pg.locator('#sunset').tap();assert pg.locator('#sunset').get_attribute('aria-pressed')=='true';assert before['targets']['coastPan']<0
  pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.wait_for_function('!__h53Audio.report().playing')
  pg.locator('.h53-audio-row input').fill('30');assert pg.evaluate('__h53Audio.report().volume')==.3
  pg.locator('.h53-audio-credits summary').tap();assert pg.locator('.h53-audio-credits a[href*="creativecommons.org/licenses/by/"]').count()>0
  pg.screenshot(path=str(OUT/(slug+'-menu.png')))
  pg.locator('#pause').tap();pg.wait_for_function('__h53Audio.report().playing');pg.keyboard.press('Escape');pg.wait_for_timeout(250)
  if slug=='binary-dusk':
   pg.set_viewport_size({'width':844,'height':390});pg.wait_for_function('__h53Audio.report().scene.running && __h53Audio.report().scene.view==="landscape"',timeout=120000);pg.wait_for_function('__h53Audio.report().playing')
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing')
  assert not errors,errors
  rows.append({'slug':slug,'initialPlaying':before,'final':pg.evaluate('__h53Audio.report()'),'errors':errors,'checks':['production path, canonical, no preview base/noindex','gesture-only loading','approved loop lengths','pause/resume','volume/attribution','ONE YEAR narration duck' if slug=='core-37' else 'SUNSET + landscape assets + left distant sea','mute']})
  print('PASS',slug,flush=True);pg.close()
 b.close()
(OUT/'results.json').write_text(json.dumps(rows,indent=2));(OUT/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
