from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
 pg.goto('http://127.0.0.1:8042/preview/20261017/lacto-tricore.html?skipgc&view=sanc');pg.wait_for_function('window.__lactoTricore&&__lactoTricore.view()==="sanc"',timeout=120000)
 for v in ['brain','main','sanc']:
  pg.locator('[data-view="'+v+'"]').tap();pg.wait_for_function('(v)=>__lactoTricore.view()===v',arg=v,timeout=120000)
 point=pg.evaluate('()=>{for(let y=140;y<innerHeight-100;y+=12)for(let x=30;x<innerWidth-30;x+=12)if(document.elementFromPoint(x,y)?.id==="canvas"&&__lactoTricore.pick(x,y)==="pipe")return {x,y}}');assert point;pg.touchscreen.tap(point['x'],point['y']);pg.wait_for_selector('#info[data-h53-reading-fit]');assert '加速区間' in pg.locator('#infoTitle').inner_text();pg.locator('#closeInfo').tap();report=pg.evaluate('__lactoTricore.fluid()');assert report['finite'] and report['steps']>0;assert not errors,errors;Path('/workspace/previews/2026-10-17/tricore-w3/archive-results.json').write_text(json.dumps({'threeViews':True,'pipeTap':True,'fluid':report,'errors':errors},indent=2));b.close();print('PASS')
