from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image
import numpy as np,json
out=Path('/workspace/previews/2026-10-17/tricore-w2/comparison');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for version,path in [('w1','lacto-tricore.html?skipgc'),('w2','preview/20261017/lacto-tricore.html?skipgc&view=sanc')]:
  pg=b.new_page(viewport={'width':900,'height':900});pg.goto('http://127.0.0.1:8030/'+path,timeout=120000);pg.wait_for_function('window.__lactoTricore',timeout=120000)
  if version=='w1':pg.evaluate('__lactoTricore.switchView("sanc")')
  pg.wait_for_function('__lactoTricore.view()==="sanc"',timeout=120000);pg.evaluate('__lactoTricore.clock.running=false')
  for t in [0,.195,.39,.585,.78,1.56]:
   pg.evaluate('(t)=>{__lactoTricore.clock.t=t;__lactoTricore.render()}',t);pg.screenshot(path=str(out/f'{version}-{t}.png'),timeout=120000)
  pg.close()
 b.close()
r=Path('/workspace/tbyd-hiro53.github.io');ph=np.asarray(Image.open(r/'lacto-tricore-v1-w1-sanc-phase.png'));ys,xs=np.where(ph[:,:,2]>250);choose=(ys>150)&(ys<260)&(xs>300)&(xs<355);ys=ys[choose];xs=xs[choose];px=((571+xs)/2).astype(int);py=((346+ys)/2).astype(int)
rows={}
for version in ['w1','w2']:
 imgs=[np.asarray(Image.open(out/f'{version}-{t}.png').convert('RGB'),dtype=float) for t in [0,.195,.39,.585,.78]];samples=np.array([a[py,px].mean(axis=1) for a in imgs]);a=imgs[0];c=np.asarray(Image.open(out/f'{version}-1.56.png').convert('RGB'),dtype=float);energy=np.abs(c[170:320,340:560]-a[170:320,340:560]);rows[version]={'milkMeanTemporalStd':float(samples.std(axis=0).mean()),'milkMeanDarkest':float(samples.min(axis=0).mean()),'energyEqualBeatMeanDelta':float(energy.mean()),'energyPixelsDeltaOver10':int((energy.max(axis=2)>10).sum())}
rows['samplePixels']=len(px);rows['energyCirculationChanged']=rows['w2']['energyEqualBeatMeanDelta']>rows['w1']['energyEqualBeatMeanDelta']+1;rows['milkMoreContinuous']=rows['w2']['milkMeanTemporalStd']<rows['w1']['milkMeanTemporalStd'];print(json.dumps(rows,indent=2),flush=True);(out/'results.json').write_text(json.dumps(rows,indent=2));assert rows['energyCirculationChanged'] and rows['milkMoreContinuous']
