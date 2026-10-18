from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import sys
D=Path('/workspace/render-work/xerophyte-audio-release')
url=sys.argv[1];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':390,'height':844},has_touch=True,ignore_https_errors=True)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(url,wait_until='domcontentloaded');page.wait_for_function('window.__xero && window.__h53Audio',timeout=60000)
 assert page.evaluate('__h53Audio.report().context') is None
 page.locator('#h53-audio-toggle').tap();page.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',timeout=60000)
 page.locator('#storm').tap();page.wait_for_timeout(800)
 report=page.evaluate('__h53Audio.report()');assert report['scene']['stormTime']>=0 and report['playing'] and not errors
 page.screenshot(path=str(D/'release.png'));b.close()
(D/'browser-check.json').write_text(json.dumps({'url':url,'audio':report,'errors':errors},indent=2));print('PLAYBACK OK',url)
