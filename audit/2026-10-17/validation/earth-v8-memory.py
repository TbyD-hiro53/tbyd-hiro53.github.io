from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':390,'height':844});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY&&__EOInterior.report().active',timeout=180000)
 counts=[]
 for cycle in range(3):
  for i in [3,0]:
   pg.evaluate('(i)=>__H53M.station(i)',i);pg.wait_for_function('(i)=>__EOInterior.report().active&&__EOInterior.report().current===i',arg=i,timeout=120000)
   if i==3:pg.wait_for_function('__EOForest.report().current===3&&__EOForest.report().active',timeout=120000)
  pg.wait_for_timeout(200);counts.append(pg.evaluate('__H53M.renderer.info.memory.textures'))
 assert counts[1:]==[counts[0],counts[0]],counts
 # Hold a requested detail map, then return before it arrives.
 pg.route('**/*interior-3-detail.jpg',lambda route:(time.sleep(1),route.continue_()))
 pg.evaluate('()=>{__H53M.station(3);setTimeout(()=>__H53M.station(0),250);}')
 pg.wait_for_timeout(1500);pg.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===0',timeout=120000);assert not errors,errors
 report={'textureCountsAfterReturn':counts,'noTextureGrowth':True,'staleViewIgnored':True,'current':pg.evaluate('__EOInterior.report()'),'errors':errors};Path('/tmp/earth-v8/memory-results.json').write_text(json.dumps(report,indent=2));print(report,flush=True);b.close()
