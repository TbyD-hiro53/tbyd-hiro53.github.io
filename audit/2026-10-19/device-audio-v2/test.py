from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json,sys
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060'
OUT=Path(sys.argv[2]) if len(sys.argv)>2 else Path('/workspace/render-work/audio-devices/qa');OUT.mkdir(parents=True,exist_ok=True)
results=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug in (sys.argv[3].split(',') if len(sys.argv)>3 else ['lacto-tricore','lacto-cortex']):
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,ignore_https_errors=True);pg.set_default_timeout(120000);err=[];audio=[]
  def response(r):
   if r.url.startswith(BASE):
    deps.add(urlparse(r.url).path.lstrip('/'))
    if r.status>=400:err.append(str(r.status)+' '+r.url)
    if '.mp3' in r.url:audio.append(r.url)
  pg.on('response',response);pg.on('pageerror',lambda e:err.append(str(e)))
  pg.goto(BASE+'/preview/20261017/'+slug+'.html?skipgc&deviceAudioQA',wait_until='domcontentloaded')
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene',timeout=240000)
  assert pg.evaluate('__h53Audio.report().context') is None and not audio
  cortex=slug=='lacto-cortex';menu='#composerToggle' if cortex else '#menuToggle';panel='#composerMenu' if cortex else '#menu'
  pause='[data-legacy-id="dp"]' if cortex else '#pause'
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded')
  assert pg.evaluate('__h53Audio.report().loopSeconds')==([24] if slug=='lacto-cortex' else [24,18])
  first=pg.evaluate('__h53Audio.report()')
  if not cortex:pg.locator(menu).tap()
  pg.locator(pause).tap();pg.wait_for_function('!__h53Audio.report().playing')
  if not cortex:pg.locator(menu).tap()
  sizes=[]
  for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
   pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(350)
   sizes.append(pg.evaluate('''() => { let a=document.querySelector('#h53-audio-toggle').getBoundingClientRect(),m=document.querySelector('#h53-audio-controls').lastElementChild.getBoundingClientRect();return {size:[innerWidth,innerHeight],audio:[a.x,a.y,a.width,a.height],menu:[m.x,m.y,m.width,m.height],overlap:a.right>m.left}; }'''))
   assert sizes[-1]['audio'][2:]==[44,44] and not sizes[-1]['overlap'] and sizes[-1]['audio'][0]>=0
   pg.locator(menu).tap();pg.wait_for_timeout(300)
   pg.locator('.h53-audio-credits summary').click();pg.wait_for_timeout(100)
   assert pg.locator('.h53-audio-row input').count()==1
   links=pg.locator('.h53-audio-credits a').evaluate_all('(a)=>a.map(e=>e.href)')
   assert any('538210' in u for u in links) and not any('700254' in u or '554314' in u for u in links),links
   pg.screenshot(path=str(OUT/(slug+'-'+str(w)+'.png')))
   pg.keyboard.press('Escape');pg.wait_for_timeout(350)
  pg.set_viewport_size({'width':390,'height':844});pg.wait_for_timeout(800)
  if not cortex:pg.locator(menu).tap()
  print('before resume',slug,pg.evaluate('__h53Audio.report()'),flush=True)
  pg.locator(pause).tap();pg.wait_for_timeout(500);print('after resume',slug,pg.evaluate('__h53Audio.report()'),flush=True);pg.wait_for_function('__h53Audio.report().playing')
  if not cortex:pg.locator(menu).tap()
  views=[]
  if slug=='lacto-tricore':
   for v in ['brain','sanc','main']:
    pg.locator('[data-view="'+v+'"]').tap();pg.wait_for_function('(v)=>__h53Audio.report().scene.view===v',arg=v);pg.wait_for_timeout(250);views.append(pg.evaluate('__h53Audio.report()'))
  if cortex:
   for key in ['sw','reset','spin','tour','era']:
    pg.locator('[data-legacy-id="'+key+'"]').tap();pg.wait_for_timeout(400);views.append(pg.evaluate('__h53Audio.report()'))
  if slug=='core-37':
   pg.locator('#year').tap();pg.wait_for_timeout(350);assert pg.evaluate('__core37.clock.yearAt!==null')
   # Read actual narrative state at an existing narrative interval; no added story sound.
   pg.evaluate('__core37.clock.t=__core37.clock.yearAt+20');pg.wait_for_timeout(500);views.append(pg.evaluate('__h53Audio.report()'))
  if slug=='lacto-tricore':assert views[1]['targets']['metal']>views[0]['targets']['metal'] and views[0]['targets']['rumble']<views[2]['targets']['rumble']
  if slug=='core-37':assert views[-1]['scene']['narrating'] and views[-1]['targets']['drive']<first['targets']['drive']
  pg.locator(menu).tap();pg.locator('.h53-audio-row input').fill('25');assert pg.evaluate('__h53Audio.report().volume')==.25
  pg.keyboard.press('Escape');pg.wait_for_timeout(300)
  # bfcache lifecycle: preserved page returns with selected audio; clocks remain artwork-owned.
  pg.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");pg.wait_for_timeout(250);assert not pg.evaluate('__h53Audio.report().playing')
  pg.evaluate("dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");pg.wait_for_function('__h53Audio.report().playing')
  pg.evaluate("window.__deviceQAChannel=new BroadcastChannel('h53-audition-audio');__deviceQAChannel.postMessage({type:'claim',id:'device-qa-other'})")
  pg.wait_for_function('!__h53Audio.report().enabled');pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing')
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().playing')
  assert all('device-audio-v2-' in u for u in audio),audio
  assert len(audio)==(1 if cortex else 2),audio
  assert not err,err
  results.append({'slug':slug,'initialAudio':first,'sizes':sizes,'views':views,'errors':err,'requests':len(audio),'lifecycle':'pause/resume, mute, bfcache, cross-tab passed'})
  (OUT/'results.json').write_text(json.dumps(results,indent=2));(OUT/'dependencies.json').write_text(json.dumps(sorted(deps),indent=2));print('PASS',slug,flush=True);pg.close()
 b.close()
