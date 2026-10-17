from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('/workspace/previews/2026-10-17/narration');out.mkdir(parents=True,exist_ok=True);results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug,qa in [('core-37','__core37'),('the-changes','__changes'),('xerophyte','__xero')]:
  page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:8030/preview/20261017/{slug}.html?skipgc',timeout=120000);page.wait_for_function('window.'+qa,timeout=120000)
  # Trigger real narrative state; then freeze the artwork clock, not its UI.
  if slug=='core-37':page.locator('#year').click();page.evaluate('__core37.clock.t=__core37.clock.yearAt+6.5')
  elif slug=='xerophyte':page.locator('#storm').click();page.evaluate('__xero.clock.t=__xero.clock.stormAt+4')
  else:page.evaluate('__changes.clock.t=4')
  page.wait_for_timeout(800)
  # Xerophyte's first line appears at a different event time; find it through the DOM while clock advances.
  if slug=='xerophyte':page.evaluate('__xero.clock.t=__xero.clock.stormAt+8');page.wait_for_timeout(800)
  page.evaluate(qa+'.clock.running=false')
  for w,h in [(390,844),(844,390),(320,568)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(150)
   # Tap a real object using its ID-map pick result.
   page.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil')
   point=page.evaluate('''(qa)=>{for(let y=120;y<innerHeight-140;y+=35)for(let x=60;x<innerWidth-40;x+=35)if(document.elementFromPoint(x,y)?.id==="canvas"&&window[qa].pick(x,y))return {x,y};}''',qa);assert point
   page.mouse.click(point['x'],point['y']);page.wait_for_selector('#info[data-h53-reading-fit]')
   assert page.locator('#log').evaluate('(n)=>getComputedStyle(n).visibility')=='hidden'
   assert page.locator('#phase').evaluate('(n)=>getComputedStyle(n).visibility')=='hidden'
   assert page.locator('#infoTitle').is_visible()
   page.screenshot(path=str(out/f'{slug}-{w}.png'),timeout=120000)
   page.locator('#closeInfo').click();page.wait_for_function('document.querySelector("#info").hidden');page.wait_for_function('getComputedStyle(document.querySelector("#log")).visibility==="visible"')
   results.append({'page':slug,'viewport':[w,h],'actualObjectTap':True,'narrationHiddenWithDialog':True,'restored':True})
  assert not errors,errors;page.close();print(slug,'PASS',flush=True)
 b.close()
(out/'results.json').write_text(json.dumps(results,indent=2))
