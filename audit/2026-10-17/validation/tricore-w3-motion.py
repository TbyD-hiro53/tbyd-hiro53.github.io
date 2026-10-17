from playwright.sync_api import sync_playwright
from pathlib import Path
import numpy as np,json
from PIL import Image
D=Path('/tmp/tricore-w3')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':900,'height':900});pg.goto('http://127.0.0.1:8040/preview/20261017/lacto-tricore.html?skipgc&view=sanc');pg.wait_for_function('window.__lactoTricore',timeout=120000);pg.evaluate('()=>{__lactoTricore.clock.running=false;__lactoTricore.clock.t=0;__lactoTricore.render();}');pg.screenshot(path=str(D/'motion-0.png'))
 pg.evaluate('()=>{const gl=document.querySelector("#canvas").getContext("webgl"),draw=gl.drawArrays;gl.drawArrays=function(...a){if(a[0]===gl.POINTS)draw.apply(this,a);};for(let i=1;i<=94;i++){__lactoTricore.clock.t=i*1.56/94;__lactoTricore.render();}gl.drawArrays=draw;__lactoTricore.render();}')
 pg.screenshot(path=str(D/'motion-1.png'));print(pg.evaluate('__lactoTricore.fluid()'),flush=True);b.close()
m=np.asarray(Image.open('/workspace/tbyd-hiro53.github.io/lacto-tricore-v1-w2-sanc-phase.png'))[:,:,2];mask=Image.new('L',(1800,1800));mask.paste(Image.fromarray(m),(571,346));mask=np.asarray(mask.resize((900,900),Image.Resampling.NEAREST))>200
a=np.asarray(Image.open(D/'motion-0.png'))[:,:,:3].astype(float);b=np.asarray(Image.open(D/'motion-1.png'))[:,:,:3].astype(float);d=np.abs(a-b)[mask];r={'samplePixels':int(mask.sum()),'meanChange':float(d.mean()),'pixelsOver10':int((d.max(axis=1)>10).sum())};(D/'motion-results.json').write_text(json.dumps(r,indent=2));print(r)
