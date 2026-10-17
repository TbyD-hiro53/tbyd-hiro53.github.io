from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('/workspace/previews/2026-10-17/earth-v7');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':390,'height':844});pg.add_init_script('const gc=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t==="webgl2"?null:gc.call(this,t,...a)}');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if 'INVALID_' in m.text else None)
 pg.goto('http://127.0.0.1:8030/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY',timeout=180000);pg.evaluate('__H53M.station(1)');pg.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===1',timeout=120000)
 pg.evaluate('EO.parts.face.showTerminal(true)');pg.screenshot(path=str(out/'webgl1-terminal.png'),timeout=120000);assert not pg.evaluate('__H53M.renderer.capabilities.isWebGL2');assert not errors,errors;rows.append({'webgl1':True,'interior':pg.evaluate('__EOInterior.report()'),'errors':errors});pg.close();b.close()
(out/'compat.json').write_text(json.dumps(rows,indent=2));print(rows,flush=True)
