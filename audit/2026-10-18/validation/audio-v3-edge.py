from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for name in ['the-changes','coastal-glass']:
  pg=b.new_page(viewport={'width':844,'height':390},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.add_init_script("localStorage.setItem('h53lang','en')");pg.route('**/h53-audio-trial-*.mp3',lambda r:r.fulfill(status=503,body='temporarily unavailable'));pg.goto('http://127.0.0.1:8050/preview/20261017/'+name+'.html?skipgc&still',timeout=120000);pg.wait_for_function('window.__h53Audio&&'+('window.__changes' if name=='the-changes' else 'CoastalGlass.getState().ready'),timeout=120000);pg.locator('#menuToggle').click();pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().error!==null');assert not pg.evaluate('__h53Audio.report().enabled');assert pg.locator('#h53-audio-toggle').get_attribute('aria-label')=='Sound failed to load. Retry';assert not errors,errors;assert pg.evaluate("getComputedStyle(document.getElementById('masthead')).visibility==='hidden'")
  bounds=pg.locator('#menu').bounding_box();assert bounds['y']>=0 and bounds['y']+bounds['height']<=390+1,bounds
  pg.unroute('**/h53-audio-trial-*.mp3');pg.locator('#h53-audio-toggle').click();pg.wait_for_function('__h53Audio.report().loaded');assert not pg.evaluate('__h53Audio.report().playing');assert pg.evaluate('__h53Audio.report().error') is None # explicit still/reduced motion remains paused
  out.append({'work':name,'size':[844,390],'english':True,'failedAudioLeavesArtReady':True,'retry':True,'pausedLoadSilent':True,'menu':bounds,'errors':errors});pg.close();print(name,'PASS',flush=True)
 b.close()
Path('/workspace/previews/2026-10-18/audio-v3/edge-results.json').write_text(json.dumps(out,indent=2))
