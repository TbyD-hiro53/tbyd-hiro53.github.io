from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys,time
D=Path('/workspace/render-work/audio-batch');base=sys.argv[1].rstrip('/');label=sys.argv[2];rows=[]
works=['lacto-cortex','lacto-tricore','core-37','armillary','armillary-v2','binary-dusk','earth-origin-material','preservation-hall','shoko','sanctum']
if len(sys.argv)>3:works=sys.argv[3].split(',')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug in works:
  errors=[];audioRequests=[];pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,ignore_https_errors=True)
  pg.set_default_timeout(90000)
  pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  pg.on('request',lambda r:audioRequests.append(r.url) if '.mp3' in r.url else None)
  url=base+'/preview/20261017/'+slug+'.html?skipgc&revision=audio-batch-v1&check='+str(int(time.time()))+('#lower' if slug=='shoko' else '')
  print('start',slug,flush=True);pg.goto(url,wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene',timeout=180000)
  assert not audioRequests,(slug,'audio requested before gesture',audioRequests)
  assert pg.evaluate('__h53Audio.report().context') is None
  button=pg.locator('#h53-audio-toggle');r=button.bounding_box();assert r and r['width']>=43 and r['height']>=43,(slug,r)
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),slug
  button.tap();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=90000)
  report=pg.evaluate('__h53Audio.report()');assert not report['error'] and not errors,(slug,errors,report)
  button.tap();pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing')
  extra=[]
  if slug=='armillary':
   pg.evaluate('ArmillaryArtwork.setPlaying(false)')
   for width,height in [(320,568),(390,844),(844,390),(1100,800)]:
    pg.set_viewport_size({'width':width,'height':height});pg.wait_for_timeout(250)
    rect=button.bounding_box();menuRect=pg.locator('#composerToggle').bounding_box()
    assert rect['width']==44 and rect['height']==44 and rect['x']>=0 and rect['x']+44<=width,(slug,rect)
    assert abs(rect['y']-menuRect['y'])<2 and menuRect['x']>=rect['x']+44,(slug,rect,menuRect)
    extra.append({'viewport':[width,height],'speaker':rect,'menu':menuRect})
   pg.set_viewport_size({'width':390,'height':844})
   pg.locator('#composerToggle').tap();pg.locator('.h53-audio-row input').fill('30');pg.locator('.h53-audio-row input').dispatch_event('input')
   assert abs(pg.evaluate('__h53Audio.report().volume')-.3)<.01
   pg.locator('.h53-audio-credits summary').click();pg.screenshot(path=str(D/(label+'-armillary-menu.png')),timeout=60000)
   pg.keyboard.press('Escape')
  if slug=='binary-dusk':
   pg.set_viewport_size({'width':844,'height':390});pg.locator('#menuToggle').click()
   assert pg.locator('#controls').evaluate('(e)=>getComputedStyle(e).visibility')=='hidden'
   pg.keyboard.press('Escape')
  rows.append({'slug':slug,'url':url,'report':report,'noAutoload':True,'speakerRect':r,'mute':'passed','responsiveExtra':extra,'errors':errors});pg.close()
  (D/(label+'.json')).write_text(json.dumps(rows,indent=2));print('passed',slug,flush=True)
 b.close()
