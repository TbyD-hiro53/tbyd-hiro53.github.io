from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('/workspace/previews/2026-10-17/confluence-v10');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.goto('http://127.0.0.1:8030/preview/20261017/confluence.html?skipgc',timeout=120000);page.wait_for_function('window.__confluenceUIQA?.engine.loaded',timeout=120000);page.evaluate('__confluenceUIQA.setPlaying(false)')
 for spot in range(3):
  page.evaluate('(i)=>__confluenceUIQA.setView(i)',spot);page.wait_for_timeout(400);page.screenshot(path=str(out/f'spot-{spot}.png'),timeout=120000)
 for yaw in [120,180,-45]:
  page.evaluate('(y)=>__confluenceUIQA.setLook(y,-12)',yaw);page.wait_for_timeout(200);page.screenshot(path=str(out/f'bank-{yaw}.png'),timeout=120000)
 page.evaluate('__confluenceUIQA.openRecord(10)');page.wait_for_timeout(400);page.screenshot(path=str(out/'glass.png'),timeout=120000)
 assert page.locator('.panel-head').evaluate('(n)=>getComputedStyle(n).backgroundColor')=='rgba(0, 0, 0, 0)'
 for w,h in [(390,844),(844,390),(320,568)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(500);page.screenshot(path=str(out/f'panel-{w}.png'),timeout=120000)
 print(errors,flush=True);assert not errors
 (out/'result.json').write_text(json.dumps({'errors':errors,'headingBackground':'transparent'}));b.close()
