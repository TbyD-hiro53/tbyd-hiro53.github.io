from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
D=Path('/workspace/previews/2026-10-17/earth-v8/validation');D.mkdir(parents=True,exist_ok=True);r=Path('/workspace/tbyd-hiro53.github.io');rows=[]
while not (r/'earth-origin-material-v8-20261017-interior-2-detail.jpg').exists():time.sleep(5)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h in [(1100,800),(390,844),(844,390)]:
  pg=b.new_page(viewport={'width':w,'height':h},has_touch=True,device_scale_factor=2 if w==390 else 1);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None);pg.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY',timeout=180000);pg.evaluate('__H53M.station(2)');pg.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===2&&__EOInterior.report().detailActive',timeout=120000);pg.screenshot(path=str(D/f'{w}-2.png'),timeout=120000)
  pg.locator('#eo-guide').tap();pg.wait_for_function('!__H53M.focusing',timeout=30000);assert pg.evaluate('__H53M.pickAt(innerWidth/2,innerHeight/2)')=='centreface';pg.evaluate('()=>{window._converged=0;window._oldConverge=EO.parts.star.converge;EO.parts.star.converge=function(t){_converged++;return _oldConverge(t)};}');pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000);pg.touchscreen.tap(w/2,h/2);pg.wait_for_function('_converged===1',timeout=15000);pg.wait_for_selector('#rec',state='visible');pg.locator('#record-close').tap();pg.wait_for_timeout(700);pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000);pg.touchscreen.tap(w/2,h/2);pg.evaluate('__H53M.station(0)');pg.wait_for_timeout(950);assert not pg.locator('#rec').is_visible();assert not errors,errors;rows.append({'viewport':[w,h],'view':2,'detail':True,'convergenceLive':True,'cancelOnMove':True,'errors':errors});pg.close();print(w,'STAR PASS',flush=True)
 b.close()
(D/'stars-results.json').write_text(json.dumps(rows,indent=2))
