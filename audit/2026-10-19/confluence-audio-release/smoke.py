from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/render-work/confluence-audio-release');errors=[];url=sys.argv[1];name=sys.argv[2]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,ignore_https_errors=True)
 pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
 pg.goto(url,wait_until='domcontentloaded',timeout=60000)
 pg.wait_for_function('window.__h53Audio && window.__confluenceUIQA && __confluenceUIQA.engine.bake.active',timeout=120000)
 assert pg.evaluate('__h53Audio.report().context') is None
 assert pg.locator('base').count()==0
 assert pg.locator('meta[name="robots"]').count()==0
 assert pg.locator('link[rel="canonical"]').get_attribute('href')=='https://tbyd-hiro53.github.io/confluence.html'
 assert pg.locator('a[href="index.html#place"]').count()==1
 pg.locator('#h53-audio-toggle').tap()
 pg.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded',timeout=60000)
 assert pg.evaluate('__confluenceUIQA.engine.report().revision')=='current-v1'
 r=pg.evaluate('__h53Audio.report()');assert r['loopSeconds']==[17,17,59] and not errors
 pg.screenshot(path=str(D/(name+'.png')))
 b.close()
(D/(name+'.json')).write_text(json.dumps({'url':url,'audio':r,'errors':errors,'productionMetadata':'passed'},indent=2));print(json.dumps({'passed':True,'url':url,'audio':r,'errors':errors}))
