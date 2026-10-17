from playwright.sync_api import sync_playwright
from pathlib import Path
import numpy as np,json
from PIL import Image
D=Path('/workspace/previews/2026-10-17/tricore-w4');D.mkdir(parents=True,exist_ok=True);r=Path('/workspace/tbyd-hiro53.github.io');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for v in ['w3','w4']:
  pg=b.new_page(viewport={'width':700,'height':700});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  if v=='w3':
   pg.route('**/lacto-tricore-v1-w4-app.js',lambda route:route.fulfill(path=str(r/'lacto-tricore-v1-w3-app.js')));pg.route('**/lacto-tricore-v1-w4-fluid.js',lambda route:route.fulfill(path=str(r/'lacto-tricore-v1-w3-fluid.js')))
  pg.goto('http://127.0.0.1:8040/preview/20261017/lacto-tricore.html?skipgc&view=sanc');pg.wait_for_function('window.__lactoTricore',timeout=120000);pg.evaluate('()=>{__lactoTricore.clock.running=false;__lactoTricore.clock.t=-1;__lactoTricore.render();__lactoTricore.clock.t=0;__lactoTricore.render();}');pg.screenshot(path=str(D/f'{v}-0.png'))
  pg.evaluate('()=>{const gl=document.querySelector("#canvas").getContext("webgl"),draw=gl.drawArrays;gl.drawArrays=function(...a){if(a[0]===gl.POINTS)draw.apply(this,a);};for(let i=1;i<=94;i++){__lactoTricore.clock.t=i*1.56/94;__lactoTricore.render();}gl.drawArrays=draw;__lactoTricore.render();}');pg.screenshot(path=str(D/f'{v}-1.png'));assert not errors,errors;assert pg.evaluate('document.querySelector("#canvas").getContext("webgl").getError()')==0;pg.close();print(v,'PASS',flush=True)
 b.close()
m=np.asarray(Image.open(r/'lacto-tricore-v1-w2-sanc-phase.png'))[:,:,2];mask=Image.new('L',(1800,1800));mask.paste(Image.fromarray(m),(571,346));mask=np.asarray(mask.resize((700,700),Image.Resampling.NEAREST))>200
for v in ['w3','w4']:
 a=np.asarray(Image.open(D/f'{v}-0.png'))[:,:,:3].astype(float);b=np.asarray(Image.open(D/f'{v}-1.png'))[:,:,:3].astype(float);d=np.abs(a-b)[mask];rows.append({'version':v,'samplePixels':int(mask.sum()),'meanTemporalChange':float(d.mean()),'pixelsOver10':int((d.max(axis=1)>10).sum())})
assert rows[1]['meanTemporalChange']>rows[0]['meanTemporalChange']*1.15,rows
(D/'comparison-results.json').write_text(json.dumps(rows,indent=2));print(rows,flush=True)
