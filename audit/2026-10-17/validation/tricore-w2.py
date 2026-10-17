from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('/workspace/previews/2026-10-17/tricore-w2/validation');out.mkdir(parents=True,exist_ok=True);rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h in [(1100,800),(390,844),(844,390)]:
  pg=b.new_page(viewport={'width':w,'height':h},has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  pg.goto('http://127.0.0.1:8030/preview/20261017/lacto-tricore.html?skipgc',timeout=120000);pg.wait_for_function('window.__lactoTricore',timeout=120000)
  for v in ['main','brain','sanc']:
   pg.locator('[data-view="'+v+'"]').click();pg.wait_for_function('(v)=>__lactoTricore.view()===v',arg=v,timeout=120000);pg.screenshot(path=str(out/f'{w}-{v}.png'),timeout=120000)
  point=pg.evaluate('()=>{for(let y=150;y<innerHeight-130;y+=12)for(let x=35;x<innerWidth-35;x+=12)if(document.elementFromPoint(x,y)?.id==="canvas"&&__lactoTricore.pick(x,y)==="pipe")return {x,y}}');assert point
  pg.touchscreen.tap(point['x'],point['y']);pg.wait_for_selector('#info[data-h53-reading-fit]');assert '加速区間' in pg.locator('#infoTitle').inner_text();assert pg.locator('#views').evaluate('(n)=>getComputedStyle(n).visibility')=='hidden';pg.locator('#closeInfo').click();pg.wait_for_function('document.querySelector("#info").hidden&&!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil')
  stats=pg.evaluate('()=>{const gl=document.querySelector("#canvas").getContext("webgl"),orig=gl.drawArrays;let count=0;gl.drawArrays=function(...a){count++;return orig.apply(this,a)};__lactoTricore.render();gl.drawArrays=orig;return {draws:count,error:gl.getError(),units:gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),motion:__lactoTricore.motion}}');assert stats['draws']==1 and stats['error']==0
  pg.locator('#menuToggle').click();pg.locator('#pause').click();assert not pg.evaluate('__lactoTricore.clock.running');assert not errors,errors
  rows.append({'viewport':[w,h],'threeViews':True,'pipeTap':True,'pause':True,'errors':errors,**stats});pg.close();print(w,'PASS',flush=True)
 b.close()
(out/'results.json').write_text(json.dumps(rows,indent=2))
