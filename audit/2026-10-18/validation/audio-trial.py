from playwright.sync_api import sync_playwright
from pathlib import Path
import json
D=Path('/workspace/previews/2026-10-18/audio-trial');D.mkdir(parents=True,exist_ok=True);out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required'])
 for name in ['the-changes','coastal-glass']:
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);err=[];req=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.on('request',lambda r:req.append(r.url));pg.goto('http://127.0.0.1:8040/preview/20261017/'+name+'.html?skipgc',timeout=120000);pg.wait_for_function('window.__h53Audio&&'+('window.__changes' if name=='the-changes' else 'window.CoastalGlass&&CoastalGlass.getState().ready'),timeout=120000)
  assert pg.evaluate('__h53Audio.report().context') is None;assert not any('.mp3' in x for x in req)
  pg.locator('#menuToggle').click();pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing',timeout=60000);first=pg.evaluate('__h53Audio.report()');pg.screenshot(path=str(D/(name+'-menu.png')))
  pg.locator('#h53-audio-toggle').click();pg.wait_for_function('!__h53Audio.report().playing');pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().playing')

  if name=='the-changes':pg.locator('#menuToggle').click()
  pg.locator('#pause').click();pg.wait_for_function('!__h53Audio.report().playing');pg.locator('#pause').click();pg.wait_for_function('__h53Audio.report().playing')
  pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");pg.wait_for_function("__h53Audio.report().context==='suspended'&&!__h53Audio.report().playing");pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");pg.wait_for_function('__h53Audio.report().playing');pg.evaluate("var c=new BroadcastChannel('h53-audition-audio');c.postMessage({type:'claim',id:'test-other-tab'});c.close()");pg.wait_for_function('!__h53Audio.report().enabled&&!__h53Audio.report().playing');assert not err,err
  out.append({'work':name,'initialMuteNoFetch':True,'first':first,'pauseResume':True,'pageLifecycleSynthetic':True,'otherTabClaim':True,'errors':err});pg.close();print(name,'PASS',flush=True)
 b.close()
(D/'results.json').write_text(json.dumps(out,indent=2))
