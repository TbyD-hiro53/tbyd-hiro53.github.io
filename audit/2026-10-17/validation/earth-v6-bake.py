from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
out=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/earth-v6-check');out.mkdir(exist_ok=True,parents=True)
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8030/preview/20261017/earth-origin-material.html?skipgc'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1100,'height':800});errors=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 page.goto(url,timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000);results=[]
 for i in [3,0,2,1,3]:
  page.evaluate('(i)=>__H53M.station(i)',i)
  if i!=1:page.wait_for_function('(i)=>__EOForest.report().current===i&&__EOForest.report().active',arg=i,timeout=120000)
  else:page.wait_for_function('!__EOForest.report().active',timeout=30000)
  page.screenshot(path=str(out/f'v6-station-{i}.png'),timeout=120000)
  row=page.evaluate('()=>({station:__H53M.stationIndex,forest:__EOForest.report(),render:{...__H53M.renderer.info.render}})');results.append(row);print(json.dumps(row),flush=True)
 page.evaluate('window._lastFrame=__H53M.renderer.info.render.frame;__EOForest.setEnabled(false)');page.wait_for_function('__H53M.renderer.info.render.frame>_lastFrame+1',timeout=30000);results.append(page.evaluate('()=>({liveRender:{...__H53M.renderer.info.render}})'))
 page.evaluate('__EOForest.setEnabled(true);__H53M.setEye(-.37,1.55,-7.2,1.15,.25)');page.wait_for_function('__EOForest.report().active',timeout=30000);page.screenshot(path=str(out/'v6-rotated.png'),timeout=120000)
 page.evaluate('__H53M.setEye(-.30,1.55,-7.2,1.57,0)');page.wait_for_function('!__EOForest.report().active',timeout=30000)
 page.evaluate('__H53M.station(0);setTimeout(()=>__H53M.station(2),10);setTimeout(()=>__H53M.station(3),30)');page.wait_for_function('__EOForest.report().active&&__EOForest.report().current===3',timeout=120000)
 assert not failed,failed;assert not errors,errors
 results.append({'unknownEyeFallback':True,'rotatedEyeBake':True,'rapidStationSwitch':True,'errors':errors,'failedResources':failed})
 # Loading failure is local to a view and must keep the original forest.
 failpage=b.new_page(viewport={'width':800,'height':700});failpage.route('**/*forest-hero-depth.png',lambda r:r.abort());failpage.goto(url,timeout=120000);failpage.wait_for_function('window.__EO_READY',timeout=120000);failpage.evaluate('__H53M.station(3)');failpage.wait_for_function('__EOForest.report().failed.includes("3")',timeout=120000)
 assert not failpage.evaluate('__EOForest.report().active');failpage.wait_for_function('__H53M.renderer.info.render.triangles>100000',timeout=30000)
 results.append({'missingTextureFallback':True});b.close();(out/'bake-results.json').write_text(json.dumps(results,indent=2))
