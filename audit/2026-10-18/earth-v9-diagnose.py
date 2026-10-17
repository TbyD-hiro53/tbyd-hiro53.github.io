from playwright.sync_api import sync_playwright
from pathlib import Path
import json
D=Path('/tmp/earth-v9');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for wh in [(1440,1000),(390,844)]:
  pg=b.new_page(viewport={'width':wh[0],'height':wh[1]},device_scale_factor=2)
  pg.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY&&__EOInterior.report().active',timeout=120000)
  for i in [0,3]:
   pg.evaluate('(i)=>__H53M.station(i)',i);pg.wait_for_function('(i)=>__EOInterior.report().active&&__EOInterior.report().current===i',arg=i,timeout=120000)
   if i==3:pg.wait_for_function('__EOForest.report().active',timeout=120000)
   pg.screenshot(path=str(D/f'v8-{wh[0]}-{i}.png'),timeout=120000)
   rows.append(pg.evaluate('()=>({station:__H53M.stationIndex,canvas:[cv.width,cv.height],viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,renderScale:__H53M.renderer.getPixelRatio(),interior:__EOInterior.report(),camera:{fov:__H53M.camera.fov}})'))
  pg.close()
 b.close()
(D/'diagnosis.json').write_text(json.dumps(rows,indent=2));print(rows,flush=True)
