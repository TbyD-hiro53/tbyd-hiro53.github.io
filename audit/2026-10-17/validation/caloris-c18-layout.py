from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('/workspace/previews/2026-10-17/caloris-c18');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8030/preview/20261017/lacto-caloris.html?skipgc',timeout=120000);page.wait_for_function('window.__CALORIS?.ready&&window.__composerLiquid',timeout=120000)
 before=page.evaluate('__CALORIS.state');dp=page.locator('#composerPrimary [data-legacy-id="dp"]');dp.click();page.wait_for_timeout(200)
 after=page.evaluate('__CALORIS.state');assert before['target']!=after['target'] and before['view']==after['view'];assert dp.get_attribute('aria-pressed') is None
 assert '放熱板' in dp.inner_text()
 dp.click();page.wait_for_timeout(200)
 results=[]
 for w,h in [(1100,800),(390,844),(320,568),(844,390),(568,320)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(200)
  page.wait_for_function('getComputedStyle(document.querySelector("#composerPrimary")).visibility==="visible"');assert dp.is_visible();bounds=page.locator('#composerPrimary button').evaluate_all('(ns)=>ns.map(n=>{let r=n.getBoundingClientRect();return [r.x,r.y,r.right,r.bottom,r.height]})')
  assert all(x>=0 and y>=0 and right<=w and bottom<=h and height>=44 for x,y,right,bottom,height in bounds),bounds
  
  if w==390:page.screenshot(path=str(out/f'controls-{w}.png'),timeout=120000)
  page.evaluate('__composerLiquid.observe("brain")');page.wait_for_timeout(250)
  page.locator('#composerMenuContent p').evaluate('(n)=>n.textContent=n.textContent.repeat(12)')
  page.wait_for_timeout(100)
  metrics=page.locator('#composerMenu').evaluate('''n=>{let r=n.getBoundingClientRect(),body=n.querySelector('#composerMenuContent'),head=n.querySelector('header');body.scrollTop=99999;return {r:[r.x,r.y,r.right,r.bottom],bg:getComputedStyle(head).backgroundColor,scroll:body.scrollTop>0,head:head.getBoundingClientRect().top}}''')
  assert metrics['bg']=='rgba(0, 0, 0, 0)' and metrics['scroll'],metrics
  x,y,r,bot=metrics['r'];assert x>=0 and y>=0 and r<=w and bot<=h,metrics
  
  if w==390:page.screenshot(path=str(out/f'panel-{w}.png'),timeout=120000)
  page.locator('#composerMenuClose').click();page.wait_for_function('document.querySelector("#composerMenu").hidden&&!document.querySelector("#composerPrimary").hasAttribute("data-h53-reading-hidden")',timeout=15000);results.append({'size':[w,h],'metrics':metrics})
 page.evaluate("localStorage.setItem('h53lang','en')");page.reload(timeout=120000);page.wait_for_function('window.__CALORIS?.ready&&window.__composerLiquid',timeout=120000)
 page.wait_for_function('document.querySelector("#composerPrimary [data-legacy-id=dp]").textContent.toLowerCase().includes("radiator")',timeout=15000)
 assert 'radiator' in page.locator('#composerPrimary [data-legacy-id="dp"]').inner_text().lower()
 assert page.locator('#composerPrimary [data-legacy-id="dp"] svg').count()==1
 assert not errors,errors
 (out/'layout.json').write_text(json.dumps({'sizes':results,'transformDoesNotChangeView':True,'errors':errors},indent=2));b.close()
