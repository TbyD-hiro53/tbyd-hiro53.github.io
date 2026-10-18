from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);g=b.new_page(viewport={'width':390,'height':844},device_scale_factor=.25);errors=[];audio=[]
 g.add_init_script('window.__audioContexts=0;const AC=window.AudioContext;window.AudioContext=class extends AC{constructor(...args){super(...args);window.__audioContexts++}}')
 g.on('pageerror',lambda e:errors.append(str(e)));g.on('request',lambda r:audio.append(r.url)if any(n in r.url for n in ['.mp3','.wav','sanctum-audio'])else None);g.on('response',lambda r:errors.append(str(r.status)+' '+r.url)if r.status>=400 else None)
 g.goto('http://127.0.0.1:8083/preview/20261017/sanctum.html?skipgc',wait_until='domcontentloaded',timeout=120000);g.wait_for_function('window.SanctumArtwork && SanctumArtwork.report().ready',timeout=120000)
 g.locator('[data-legacy-id="reset"]').click();g.locator('#composerToggle').click();g.wait_for_function('!composerMenu.hidden');g.locator('#composerMenuClose').click();g.wait_for_function('composerMenu.hidden')
 assert g.locator('#h53-audio-toggle').count()==0 and g.evaluate('__audioContexts')==0 and not audio and not errors
 result=dict(ready=True,noSpeaker=True,audioContexts=0,audioRequests=audio,errors=errors,cameraAndMenu='passed',testDPR=.25);Path('audit/2026-10-19/sanctum-silent-v2/results.json').write_text(json.dumps(result,indent=2));print('silent Sanctum PASS');b.close()
