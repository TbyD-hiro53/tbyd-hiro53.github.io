from pathlib import Path
from PIL import Image
import numpy as np,json
from playwright.sync_api import sync_playwright
out=Path('/workspace/previews/2026-10-17/carriage-w3');metrics={}
for label in ['before','final']:
 metrics[label]={}
 for t in [5,32,100,280]:
  a=np.array(Image.open(out/f'{label}-{t}.png').convert('RGB'),float)[530:650,600:1100]
  b=np.array(Image.open(out/f'{label}-{t+1}.png').convert('RGB'),float)[530:650,600:1100]
  metrics[label][t]={'meanLuminance':float((a@[.2126,.7152,.0722]).mean()),'meanMotionDifference':float(np.abs(a-b).mean())}
assert metrics['final'][5]['meanMotionDifference']>metrics['before'][5]['meanMotionDifference']*2
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.goto('http://127.0.0.1:8030/preview/20261017/the-changes.html?skipgc',timeout=120000);page.wait_for_function('window.__changes',timeout=120000)
 page.locator('#pause').click();t=page.evaluate('__changes.clock.t');page.wait_for_timeout(300);assert page.evaluate('__changes.clock.t')==t
 page.locator('#pause').click();page.wait_for_timeout(350);assert page.evaluate('__changes.clock.t')>t
 page.locator('#pause').click();page.evaluate('__changes.clock.t=100;__changes.render()');page.screenshot(path=str(out/'phone-night.png'),timeout=120000)
 for t in [0,32,100,280]:
  assert page.evaluate('(t)=>__changes.passed(t)',t)==sum(t>15.6+k*31.2+4.85 for k in range(8))
 assert not errors,errors;metrics['errors']=errors;metrics['pauseResume']=True;b.close()
(out/'results.json').write_text(json.dumps(metrics,indent=2));print(metrics,flush=True)
