from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time,os
D=Path('/workspace/previews/2026-10-18/earth-v9');D.mkdir(parents=True,exist_ok=True);r=Path('/workspace/tbyd-hiro53.github.io');rows=[]
while not (r/'earth-origin-material-v9-20261018-forest-hero-depth.png').exists():time.sleep(10)
while 'ALL PACKAGED' not in Path('/tmp/earth-v9/package.log').read_text():time.sleep(3)
# Don't test a half-written image.
while not (r/'earth-origin-material-v9-20261018-forest-hero-color.jpg').exists():time.sleep(3)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h,dpr in [(1440,1000,2),(390,844,2),(844,390,1)]:
  pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr,has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda x:errors.append(str(x.status)+' '+x.url) if x.status>=400 else None);pg.on('console',lambda m:errors.append(m.text) if 'INVALID_' in m.text or 'VALIDATE_STATUS' in m.text else None)
  for old,new in [('earth-origin-material-v7-20261017-app.js','earth-origin-material-v9-20261018-app.js'),('earth-origin-material-v8-20261017-interior.js','earth-origin-material-v9-20261018-interior.js'),('earth-origin-material-v8-20261017-forest.js','earth-origin-material-v9-20261018-forest.js')]:pg.route('**/'+old,lambda route,request,n=new:route.fulfill(path=str(r/n)))
  pg.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY',timeout=180000)
  for i in [0,1,2,3]:
   pg.evaluate('(i)=>__H53M.station(i)',i);pg.wait_for_function('(i)=>__EOInterior.report().active&&__EOInterior.report().current===i',arg=i,timeout=120000);assert pg.evaluate('__EOInterior.report().detailWidth')==4096
   if i==3:pg.wait_for_function('__EOForest.report().active&&__EOForest.report().current===3',timeout=120000);assert pg.evaluate('__EOForest.report().heroSize')==[3072,4096]
   pg.screenshot(path=str(D/f'{w}-{i}.png'),timeout=120000);rows.append({'size':[w,h,dpr],'view':i,'interior':pg.evaluate('__EOInterior.report()'),'forest':pg.evaluate('__EOForest.report()'),'canvas':pg.evaluate('[cv.width,cv.height]')})
  pg.evaluate('__H53M.station(1)');pg.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===1',timeout=120000);pg.locator('#eo-guide').tap();pg.wait_for_function('!__H53M.focusing',timeout=30000);assert pg.evaluate('__H53M.pickAt(innerWidth/2,innerHeight/2)')=='terminal';pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000);pg.touchscreen.tap(w/2,h/2);pg.wait_for_function('EO.parts.face.M.disp_terminal.emissiveIntensity>1',timeout=15000);pg.wait_for_selector('#rec',state='visible');pg.locator('#record-close').tap();pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000)
  counts=[]
  for j in range(3):
   for i in [3,0]:
    pg.evaluate('(i)=>__H53M.station(i)',i);pg.wait_for_function('(i)=>__EOInterior.report().active&&__EOInterior.report().current===i',arg=i,timeout=120000)
   pg.wait_for_timeout(150);counts.append(pg.evaluate('__H53M.renderer.info.memory.textures'))
  assert counts[1:]==counts[:1]*2,counts;assert not errors,errors;rows.append({'size':[w,h,dpr],'terminalTap':True,'textureCounts':counts,'errors':errors});pg.close();print(w,'PASS',flush=True)
 b.close()
(D/'results.json').write_text(json.dumps(rows,indent=2))
