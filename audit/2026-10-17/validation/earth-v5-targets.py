from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':800})
 page.goto(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000)
 results=[]
 for i,n in enumerate([3,3,2,3]):
  page.evaluate('(i)=>__H53M.station(i)',i)
  for j in range(n):
   page.evaluate('__H53M.nextObservation()');page.wait_for_function('!__H53M.focusing',timeout=30000)
   x=page.evaluate('()=>({station:__H53M.stationIndex,label:document.querySelector("#hud").innerText,key:__H53M.pickAt(innerWidth/2,innerHeight/2)})');assert x['key']==[['entryface','handrail','ceiling'],['terminal','chair','ceiling'],['centreface','points'],['rootroad','forest','disc']][i][j],x;results.append(x);print(json.dumps(x,ensure_ascii=False),flush=True)
 Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/h53-earth-targets.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));b.close()
