from playwright.sync_api import sync_playwright
import json
from pathlib import Path
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug in ['lacto-tricore','core-37']:
  pg=b.new_page(viewport={'width':320,'height':568},has_touch=True)
  pg.goto('http://127.0.0.1:8060/preview/20261017/'+slug+'.html?skipgc',wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene')
  pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.locator('.h53-audio-credits summary').tap();pg.wait_for_timeout(300)
  r=pg.evaluate('''()=>{let m=document.querySelector('#menu').getBoundingClientRect(),c=document.querySelector('.h53-copy').getBoundingClientRect();return {menuBottom:m.bottom,copyTop:c.top,masthead:getComputedStyle(document.querySelector('#masthead')).visibility,controls:getComputedStyle(document.querySelector('#controls')).visibility}}''')
  assert r['menuBottom']<=r['copyTop'] and r['masthead']=='hidden' and r['controls']=='hidden',r
  pg.screenshot(path='/workspace/render-work/audio-devices/qa/'+slug+'-menu-final.png');rows.append({'slug':slug,**r});pg.close()
 b.close()
Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/audio-devices/menu-check.json').write_text(json.dumps(rows,indent=2));print(rows)
