from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
out=Path(sys.argv[2] if len(sys.argv)>2 else '/workspace/previews/2026-10-17/caloris-c17');out.mkdir(parents=True,exist_ok=True)
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/preview/20261017/lacto-caloris.html?skipgc'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':900,'height':700},has_touch=True);errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(url,timeout=120000);page.wait_for_function('window.__CALORIS&&__CALORIS.ready&&document.querySelector("#app canvas").tabIndex===0',timeout=120000)
 found={}
 for view in ['brain','turntable','radiator','pedestal']:
  page.evaluate('(v)=>__CALORIS.setView(v)',view);page.wait_for_timeout(150)
  hits=page.evaluate('''()=>{let found={};for(let y=160;y<560;y+=45)for(let x=200;x<700;x+=45){let k=__CALORIS.pick(x,y);if(k&&!found[k])found[k]={x,y};}return found}''')
  found[view]=hits
  target=hits.get('brain') if view=='brain' else hits.get('radiator') if view=='radiator' else next(iter(hits.values()),None)
  assert target,(view,hits)
  page.touchscreen.tap(target['x'],target['y']);page.wait_for_selector('#composerMenu[data-h53-reading-fit]',timeout=15000)
  assert page.locator('#composerMenu').is_visible();assert page.locator('#composerMenu').get_attribute('data-observation')
  assert page.locator('#composerPrimary button').evaluate_all('(ns)=>ns.every(n=>getComputedStyle(n).visibility==="hidden")')
  page.locator('#composerMenuClose').click();page.wait_for_timeout(450)
  assert page.locator('#app canvas').evaluate('(n)=>document.activeElement===n')
  # A drag across the same target must remain navigation.
  page.mouse.move(target['x'],target['y']);page.mouse.down();page.mouse.move(target['x']+60,target['y']+15,steps=5);page.mouse.up();page.wait_for_timeout(100)
  assert not page.locator('#composerMenu').is_visible()
  print(view,list(hits),flush=True)
 page.locator('#app canvas').focus();page.keyboard.press('Enter');page.wait_for_timeout(300)
 assert page.locator('[data-observation]').count()>=8
 for key in ['brain','culture','radiator','compute','service','band','base','chamber']:
  page.locator(f'button[data-observation="{key}"]').click();assert page.locator('#composerMenu').get_attribute('data-observation')==key
  page.locator('#composerMenuContent button').last.click()
 page.locator('#composerMenuClose').click();page.wait_for_timeout(400)
 page.evaluate("document.body.dataset.h53Lang='en';__composerLiquid.observe('brain')");assert 'Cultured brain' in page.locator('#composerMenuTitle').inner_text()
 state=page.evaluate('__CALORIS.state');assert state['deploySeconds']==6 and state['statusOnOffRatio']==30
 assert not errors,errors
 (out/'results.json').write_text(json.dumps({'raycastTargets':found,'actualTapEachView':True,'dragDoesNotOpen':True,'keyboardList':True,'eightEntries':True,'english':True,'state':state,'errors':errors},indent=2));b.close()
