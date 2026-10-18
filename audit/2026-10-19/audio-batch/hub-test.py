from playwright.sync_api import sync_playwright
from pathlib import Path
import json
D=Path('/workspace/render-work/audio-batch');results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page()
 for w,h in [(320,740),(390,844),(844,390),(1100,800)]:
  page.set_viewport_size({'width':w,'height':h});page.goto('http://127.0.0.1:8060/preview/20261017/audio-preview-v1.html',wait_until='load')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert page.locator('.work .open').count()==10
  links=page.locator('.work .open').evaluate_all('(aa)=>aa.map(a=>a.href)')
  assert len(set(links))==10
  results.append({'width':w,'height':h,'noOverflow':True,'works':10})
 page.screenshot(path=str(D/'hub.png'),full_page=True);b.close()
(D/'hub-results.json').write_text(json.dumps(results,indent=2));print(results)
