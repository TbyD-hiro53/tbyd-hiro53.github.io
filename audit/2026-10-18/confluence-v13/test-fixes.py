from playwright.sync_api import sync_playwright
from pathlib import Path
import json
D=Path('/workspace/render-work/confluence-v13');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':448,'height':1000},has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 pg.goto('http://127.0.0.1:8060/preview/20261017/confluence.html?skipgc&still',timeout=120000);pg.wait_for_function('__confluenceUIQA.engine.bake.active',timeout=120000)
 for i in range(3):
  pg.evaluate('(i)=>__confluenceUIQA.setView(i)',i);pg.wait_for_function('(i)=>__confluenceUIQA.state().current===i&&__confluenceUIQA.engine.bake.active',arg=i,timeout=120000);pg.evaluate('__confluenceUIQA.setLook(180.25,-7)');pg.wait_for_timeout(400);pg.screenshot(path=str(D/f'seam-fixed-{i}.png'));before=pg.evaluate('__confluenceUIQA.state()');pg.evaluate('__confluenceUIQA.openRecord(9)');pg.wait_for_timeout(500);pg.locator('#px').tap();pg.locator('#view').dispatch_event('dblclick');pg.evaluate('document.getElementById("reset").click()');pg.wait_for_timeout(800);after=pg.evaluate('__confluenceUIQA.state()');assert before==after,(before,after);pg.locator('#reset').tap();pg.wait_for_timeout(100);assert pg.evaluate('__confluenceUIQA.state().yaw')!=before['yaw'];rows.append({'view':i,'closePreservesLook':True,'closeDoubleTapPreservesLook':True,'laterExplicitResetWorks':True})
 assert not errors,errors;b.close()
(D/'fix-results.json').write_text(json.dumps(rows,indent=2));print('PASS',flush=True)
