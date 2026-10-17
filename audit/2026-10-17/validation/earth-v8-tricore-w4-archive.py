from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('/workspace/previews/2026-10-17/earth-v8');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['earth-origin-material','lacto-tricore']:
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[]
  pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  pg.on('console',lambda m:errors.append(m.text) if 'INVALID_' in m.text or 'VALIDATE_STATUS' in m.text else None)
  pg.goto('http://127.0.0.1:8043/preview/20261017/'+work+'.html?skipgc&view=sanc',timeout=120000)
  if work=='earth-origin-material':
   pg.wait_for_function('window.__EO_READY',timeout=180000)
   for station in range(4):
    pg.evaluate('(i)=>__H53M.station(i)',station);pg.wait_for_function('(i)=>__EOInterior.report().active&&__EOInterior.report().current===i',arg=station,timeout=120000)
    assert pg.evaluate('__EOInterior.report().detailActive');assert pg.evaluate('__EOInterior.report().width')==4096
    if station==3:pg.wait_for_function('__EOForest.report().active&&__EOForest.report().current===3',timeout=120000)
   pg.evaluate('__H53M.station(1)');pg.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===1',timeout=120000)
   pg.locator('#eo-guide').tap();pg.wait_for_function('!__H53M.focusing',timeout=30000);assert pg.evaluate('__H53M.pickAt(innerWidth/2,innerHeight/2)')=='terminal'
   pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000);pg.touchscreen.tap(195,422)
   pg.wait_for_function('EO.parts.face.M.disp_terminal.emissiveIntensity>1',timeout=15000);pg.wait_for_selector('#rec',state='visible');pg.locator('#record-close').tap()
   rows.append({'work':work,'fourViews':True,'forest':True,'terminalTap':True})
  else:
   pg.wait_for_function('window.__lactoTricore&&__lactoTricore.view()==="sanc"',timeout=120000)
   for v in ['brain','main','sanc']:
    pg.locator('[data-view="'+v+'"]').tap();pg.wait_for_function('(v)=>__lactoTricore.view()===v',arg=v,timeout=120000)
   point=pg.evaluate('()=>{for(let y=150;y<innerHeight-130;y+=12)for(let x=35;x<innerWidth-35;x+=12)if(document.elementFromPoint(x,y)?.id==="canvas"&&__lactoTricore.pick(x,y)==="pipe")return {x,y}}');assert point
   pg.touchscreen.tap(point['x'],point['y']);pg.wait_for_selector('#info[data-h53-reading-fit]');assert '加速区間' in pg.locator('#infoTitle').inner_text();pg.locator('#closeInfo').tap()
   assert pg.evaluate('__lactoTricore.revision')=='w4'
   pg.evaluate('document.querySelector("#pause").click()');pg.wait_for_timeout(100);before=pg.evaluate('__lactoTricore.fluid().steps');pg.wait_for_timeout(400);assert pg.evaluate('__lactoTricore.fluid().steps')==before;assert pg.evaluate('__lactoTricore.fluid().finite')
   rows.append({'pause':True,'work':work,'directSanc':True,'threeViews':True,'pipeTap':True})
  assert not errors,errors;rows[-1]['errors']=errors;pg.screenshot(path=str(out/(work+'-archive.png')),timeout=120000);pg.close();print(work,'PASS',flush=True)
 b.close()
(out/'archive-test-results.json').write_text(json.dumps(rows,indent=2))
