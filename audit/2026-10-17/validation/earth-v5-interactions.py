from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
out=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/h53-earth-v5-validation');out.mkdir(exist_ok=True,parents=True)
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/preview/20261017/earth-origin-material.html?skipgc'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 results=[]
 for wh in [(1100,800),(390,844),(844,390)]:
  page=b.new_page(viewport={'width':wh[0],'height':wh[1]},has_touch=True,is_mobile=wh[0]<900);errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  page.goto(url,timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000)
  for station in range(4):
   page.evaluate('(i)=>__H53M.station(i)',station);page.wait_for_timeout(150)
   page.screenshot(path=str(out/f'{wh[0]}-{station}.png'),timeout=120000)
  page.evaluate('__H53M.station(1)');page.locator('#eo-guide').tap();page.wait_for_function('!__H53M.focusing',timeout=30000)
  key=page.evaluate('()=>__H53M.pickAt(innerWidth/2,innerHeight/2)');assert key=='terminal',key
  page.touchscreen.tap(wh[0]/2,wh[1]/2);page.wait_for_timeout(900)
  assert page.locator('#rec').is_visible();assert 'THE TERMINAL' in page.locator('#rec').inner_text()
  page.locator('#record-close').tap();page.wait_for_timeout(600)
  page.evaluate('__H53M.station(2)');page.locator('#eo-guide').tap();page.wait_for_function('!__H53M.focusing',timeout=30000)
  key=page.evaluate('()=>__H53M.pickAt(innerWidth/2,innerHeight/2)');assert key=='centreface',key
  page.evaluate('''()=>{window._converged=0;const original=EO.parts.star.converge;EO.parts.star.converge=function(t){window._converged++;return original(t)}}''')
  page.touchscreen.tap(wh[0]/2,wh[1]/2);page.wait_for_timeout(900);assert page.evaluate('_converged')==1
  assert 'THE CENTRAL FACE' in page.locator('#rec').inner_text()
  page.locator('#record-close').tap();page.wait_for_timeout(600)
  # Pending tap must not open a stale record after moving to another station.
  page.touchscreen.tap(wh[0]/2,wh[1]/2);page.evaluate('__H53M.station(0)');page.wait_for_timeout(950)
  assert not page.locator('#rec').is_visible()
  page.locator('#h53-menu-toggle').tap();page.wait_for_timeout(300);page.locator('#eo-pause').tap();assert page.evaluate('__H53M.paused')
  assert not errors,errors;assert not failed,failed
  results.append({'viewport':wh,'errors':errors,'failedResources':failed,'terminalTap':True,'centralFaceConvergence':True,'cancelOnMove':True,'pause':True})
  page.close();print(json.dumps(results[-1]),flush=True)
 # Reduced motion and keyboard access.
 page=b.new_page(viewport={'width':1100,'height':800},reduced_motion='reduce');page.goto(url,timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000)
 assert page.evaluate('__H53M.paused')
 page.locator('#cv').focus();page.keyboard.press('2');assert page.evaluate('__H53M.stationIndex')==1
 page.locator('#eo-guide').click();page.keyboard.press('Enter');page.wait_for_timeout(900);assert 'THE TERMINAL' in page.locator('#rec').inner_text()
 results.append({'reducedMotion':True,'keyboard':True})
 (out/'results.json').write_text(json.dumps(results,indent=2));b.close()
