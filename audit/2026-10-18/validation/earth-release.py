from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8040/';D=Path('/workspace/previews/2026-10-18/earth-tricore-release');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h,dpr in [(1286,700,1),(390,844,2),(844,390,1)]:
  pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr,has_touch=True,reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None);pg.goto(base+'earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY',timeout=180000);pg.evaluate('__H53M.open("points")');pg.wait_for_selector('#record-close',state='visible');pg.wait_for_timeout(700)
  m=pg.evaluate('''()=>{var b=document.getElementById('record-close'),r=b.getBoundingClientRect(),p=document.getElementById('rec').getBoundingClientRect(),c=getComputedStyle(b);return {button:[r.width,r.height],font:c.fontSize,border:c.borderWidth,optical:b.classList.contains('h53-liquid-surface'),credit:getComputedStyle(document.getElementById('cr')).visibility,panel:[p.x,p.y,p.right,p.bottom]}}''');assert m['button']==[44,44],m;assert m['border']=='0px' and not m['optical'],m;assert m['credit']=='hidden',m;assert m['panel'][0]>=0 and m['panel'][1]>=0 and m['panel'][2]<=w and m['panel'][3]<=h,m
  pg.screenshot(path=str(D/f'earth-{w}.png'),timeout=120000);pg.locator('#record-close').tap();pg.wait_for_function("getComputedStyle(document.getElementById('cr')).visibility==='visible'");assert not errors,errors;rows.append({'size':[w,h,dpr],'earth':m,'closeRestoresCredit':True,'errors':errors});pg.close()
 b.close()
(D/('independent-earth.json' if len(sys.argv)>1 else 'earth-results.json')).write_text(json.dumps(rows,indent=2));print(json.dumps(rows),flush=True)
