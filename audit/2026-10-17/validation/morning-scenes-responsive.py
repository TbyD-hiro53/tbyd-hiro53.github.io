from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
out=Path(sys.argv[2] if len(sys.argv)>2 else '/workspace/previews/2026-10-17/morning/final');out.mkdir(parents=True,exist_ok=True)
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/'
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['confluence','earth-origin-material','lacto-caloris']:
  page=b.new_page(viewport={'width':1100,'height':800},has_touch=True,reduced_motion='reduce');errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  page.goto(base+'preview/20261017/'+work+'.html?skipgc',timeout=120000)
  page.wait_for_function({'confluence':'window.__confluenceUIQA&&__confluenceUIQA.engine.loaded','earth-origin-material':'window.__EO_READY','lacto-caloris':'window.__CALORIS&&__CALORIS.ready&&window.__composerLiquid'}[work],timeout=120000)
  if work=='confluence':
   for i in range(3):
    page.evaluate('(i)=>__confluenceUIQA.setView(i)',i);page.wait_for_timeout(200);page.screenshot(path=str(out/f'{work}-{i}.png'),timeout=120000)
   for yaw in [45,120,210,-90]:
    page.evaluate('(y)=>__confluenceUIQA.setLook(y,-5)',yaw);page.wait_for_timeout(180);page.screenshot(path=str(out/f'{work}-bank-{yaw}.png'),timeout=120000)
   page.evaluate('__confluenceUIQA.setView(0);__confluenceUIQA.setLook(2,-28)');page.wait_for_timeout(100)
   for t in [600,14400]:
    page.evaluate('(t)=>__confluenceUIQA.drawAt(t)',t);page.screenshot(path=str(out/f'water-{t}.png'),timeout=120000)
   point=page.evaluate('''()=>{for(let y=200;y<600;y+=30)for(let x=200;x<900;x+=30){let h=__confluenceUIQA.engine.pick(x,y);if(h&&h.water)return {x,y};}return null}''');assert point
   page.touchscreen.tap(point['x'],point['y']);assert page.evaluate('__confluenceUIQA.engine.report().impulses')==1
   page.evaluate('__confluenceUIQA.openRecord(10)')
  elif work=='earth-origin-material':
   page.evaluate('__H53M.station(0)');page.wait_for_timeout(150);page.screenshot(path=str(out/'earth-corridor.png'),timeout=120000)
   page.evaluate('__H53M.station(1);__H53M.nextObservation()');page.keyboard.press('Enter');page.wait_for_timeout(900)
  else:
   page.evaluate("__CALORIS.setView('brain');__composerLiquid.observe('brain')")
  selector={'confluence':'#panel','earth-origin-material':'#rec','lacto-caloris':'#composerMenu'}[work]
  for w,h in [(320,568),(390,844),(844,390),(568,320)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_function('(s)=>{let r=document.querySelector(s).getBoundingClientRect();return r.right<=innerWidth+1&&r.bottom<=innerHeight+1}',arg=selector,timeout=15000)
   r=page.locator(selector).bounding_box();assert r and r['x']>=0 and r['y']>=0 and r['x']+r['width']<=w+1 and r['y']+r['height']<=h+1,(work,w,h,r)
   assert page.locator(selector).evaluate('''n=>Array.from(document.querySelectorAll('button')).filter(b=>!n.contains(b)&&!b.closest('[hidden]')).every(b=>getComputedStyle(b).visibility==='hidden')''')
   page.screenshot(path=str(out/f'{work}-reading-{w}.png'),timeout=120000)
  assert not errors,errors;assert not failed,failed
  result={'work':work,'errors':errors,'failedResources':failed,'readingViewports':[[320,568],[390,844],[844,390],[568,320]]};results.append(result);print(result,flush=True);page.close()
 b.close()
(out/'results.json').write_text(json.dumps(results,indent=2))
