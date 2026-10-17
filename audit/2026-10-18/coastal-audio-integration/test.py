from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
D=Path('/workspace/previews/2026-10-18/coastal-audio-integrated');D.mkdir(parents=True,exist_ok=True);base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required'])
 for name in ['coastal-glass']:
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];requests=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda r:requests.append(r.url));pg.goto(base+'/'+name+'.html?skipgc',timeout=120000);pg.wait_for_function('window.__h53Audio&&'+('window.__changes' if name=='the-changes' else 'window.CoastalGlass&&CoastalGlass.getState().ready'),timeout=120000)
  assert pg.evaluate('__h53Audio.report().context') is None;assert not any('.mp3' in u for u in requests);assert pg.locator('#h53-audio-toggle .audio-slash').count()==1;assert pg.locator('#menu').is_hidden()
  for w,h in [(390,844),(320,568),(844,390)]:
   pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(200);a=pg.locator('#h53-audio-toggle').bounding_box();m=pg.locator('#menuToggle').bounding_box();assert a['width']==44 and a['height']==44,(a,m);assert 0<=a['x'] and a['x']+44<=w and 0<=a['y'] and a['y']+44<=h;assert abs(a['y']-m['y'])<1 and 0<=m['x']-(a['x']+44)<=10,(a,m);rows.append({'work':name,'size':[w,h],'speaker':a,'menu':m});pg.screenshot(path=str(D/f'{name}-{w}-muted.png'),timeout=120000)
  pg.set_viewport_size({'width':390,'height':844});pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing',timeout=60000);assert pg.locator('#menu').is_hidden();assert pg.locator('#h53-audio-toggle .audio-slash').count()==0;assert pg.locator('#h53-audio-toggle').get_attribute('aria-pressed')=='true';report=pg.evaluate('__h53Audio.report()');assert report['revision']==('v2' if name=='the-changes' else 'v3');assert report['wind']==(name=='coastal-glass');pg.screenshot(path=str(D/(name+'-on.png')),timeout=120000)
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().playing');assert pg.locator('#h53-audio-toggle .audio-slash').count()==1
  pg.locator('#menuToggle').tap();pg.locator('#hideUI').tap();pg.wait_for_function('document.getElementById("menuToggle").hidden||document.getElementById("controls").hidden');assert not pg.locator('#h53-audio-toggle').is_visible();pg.locator('#showUI').tap();pg.wait_for_selector('#h53-audio-toggle',state='visible')
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing');pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");pg.wait_for_function('!__h53Audio.report().playing');pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");pg.wait_for_function('__h53Audio.report().playing');pg.evaluate("var c=new BroadcastChannel('h53-audition-audio');c.postMessage({type:'claim',id:'other'});c.close()");pg.wait_for_function('!__h53Audio.report().enabled');assert pg.locator('#h53-audio-toggle .audio-slash').count()==1;assert not errors,errors
  rows.append({'work':name,'oneTapWithoutMenu':True,'hideRestoreUI':True,'otherTabClaim':True,'report':report,'errors':errors});pg.close();print(name,'PASS',flush=True)
 b.close()
(D/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2))
