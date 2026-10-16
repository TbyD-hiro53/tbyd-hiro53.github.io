from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
from scipy.ndimage import gaussian_filter
import numpy as np,json,sys
root=Path(__file__).resolve().parents[3]
out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
def measure(path):
 a=np.asarray(Image.open(path).convert('L'),dtype=float)[180:285,360:800]
 return float(np.std(a-gaussian_filter(a,1.2)))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 results={};errors=[]
 for version in ['v7','v8']:
  page=b.new_page(viewport={'width':876,'height':636},reduced_motion='reduce')
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  if version=='v7':page.route('**/confluence-v8-20261017-engine.js',lambda route:route.fulfill(path=str(root/'confluence-v7-20261017-engine.js'),content_type='application/javascript'))
  page.goto(sys.argv[1],timeout=120000);page.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded',timeout=120000)
  page.evaluate('__confluenceUIQA.setLook(2,-28)');results[version]={}
  for t in ([600] if version=='v7' else [1,600,3600,14400]):
   page.evaluate('(t)=>__confluenceUIQA.drawAt(t)',t)
   f=out/f'{version}-{t}.png';page.screenshot(path=str(f),timeout=120000);results[version][str(t)]=measure(f)
  if version=='v8':
   page.evaluate('__confluenceUIQA.drawAt(3600)')
   hit=page.evaluate('''()=>{for(let y=170;y<280;y+=12)for(let x=320;x<800;x+=12){let h=__confluenceUIQA.engine.pick(x,y);if(h&&h.water)return {x,y};}return null;}''')
   assert hit;page.mouse.click(hit['x'],hit['y']);assert page.evaluate('__confluenceUIQA.engine.report().impulses')==1
   page.evaluate('__confluenceUIQA.drawAt(3601.5)');page.screenshot(path=str(out/'v8-touch.png'),timeout=120000)
   memory=page.evaluate('__confluenceUIQA.engine.report().memory');page.evaluate('__confluenceUIQA.drawAt(14400)');assert page.evaluate('__confluenceUIQA.engine.report().memory')==memory
  page.close()
 assert results['v7']['600']>10,results
 assert max(results['v8'].values())<4,results
 assert not errors,errors
 results.update({'errors':errors,'touchAfterOneHour':True,'memoryRetained':True})
 (out/'water-regression.json').write_text(json.dumps(results,indent=2));print(json.dumps(results));b.close()
