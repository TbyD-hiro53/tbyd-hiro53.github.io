from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/previews/2026-10-18/confluence-v13');D.mkdir(parents=True,exist_ok=True);base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h,dpr in [(1100,800,1),(390,844,2)]:
  pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr,has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  pg.goto(base+'/preview/20261017/confluence.html?skipgc&still#gap',timeout=120000)
  counts=[]
  for i,key in enumerate(['gap','under','bank']):
   pg.wait_for_function('window.__confluenceUIQA',timeout=120000);pg.evaluate('(i)=>__confluenceUIQA.setView(i)',i);pg.wait_for_function('(i)=>__confluenceUIQA.engine.bake.active&&__confluenceUIQA.state().current===i',arg=i,timeout=240000);pg.wait_for_timeout(300)
   pg.screenshot(path=str(D/f'{w}-{key}.png'),timeout=120000);report=pg.evaluate('__confluenceUIQA.engine.report()');assert report['revision']=='v13' and not report['bake']['error'],report;assert report['triangles']<200000,report
   counts.append(pg.evaluate('__confluenceUIQA.engine.renderer.info.memory.textures'));rows.append({'viewport':[w,h,dpr],'view':key,'report':report})
   # Deterministic water clocks long beyond a loop seam; still camera remains usable.
   pg.evaluate('__confluenceUIQA.drawAt(14400)');pg.evaluate('__confluenceUIQA.setLook(45,-14)');pg.wait_for_timeout(200);pg.screenshot(path=str(D/f'{w}-{key}-water.png'),timeout=120000)
  pg.evaluate('__confluenceUIQA.openRecord(0)');pg.wait_for_selector('#panel',state='visible');bounds=pg.locator('#panel').bounding_box();assert bounds['y']>=0 and bounds['y']+bounds['height']<=h+1;pg.locator('#px').tap();pg.wait_for_timeout(750)
  # Actual water touch through live picking, unaffected by baked landscape.
  hit=pg.evaluate('''()=>{let e=__confluenceUIQA.engine;for(let y of [.5,.55,.6,.65,.7,.8])for(let x of [.25,.5,.75,.1,.9]){let h=e.pick(innerWidth*x,innerHeight*y);if(h&&h.water)return [innerWidth*x,innerHeight*y];}return null;}''')
  assert hit,'No water in water-facing frame';before=pg.evaluate('__confluenceUIQA.engine.eventCount');pg.touchscreen.tap(*hit);pg.wait_for_function('(n)=>__confluenceUIQA.engine.eventCount>n',arg=before,timeout=10000);pg.evaluate('__confluenceUIQA.closePanel(false)');pg.wait_for_timeout(750)
  for i in [0,1,2]:
   pg.evaluate('(i)=>__confluenceUIQA.setView(i)',i);pg.wait_for_function('(i)=>__confluenceUIQA.engine.bake.active&&__confluenceUIQA.state().current===i',arg=i,timeout=240000);pg.wait_for_timeout(200)
  last=pg.evaluate('__confluenceUIQA.engine.renderer.info.memory.textures');assert last<=max(counts)+1,(counts,last)
  assert not errors,errors;rows.append({'viewport':[w,h,dpr],'waterTap':True,'textureCounts':counts+[last],'errors':errors});pg.close();print(w,'PASS',flush=True)
 # Compatibility uses the established real-time scene without requesting unsupported bakes.
 pg=b.new_page(viewport={'width':844,'height':390});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.add_init_script('window.DecompressionStream=undefined');pg.goto(base+'/preview/20261017/confluence.html?skipgc&still#bank',timeout=120000);pg.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded',timeout=120000);assert not pg.evaluate('__confluenceUIQA.engine.bake.enabled');pg.screenshot(path=str(D/'fallback.png'),timeout=120000);assert not errors;rows.append({'noDecompressionStream':'live fallback','errors':errors});pg.close();b.close()
(D/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2));print('ALL PASS',flush=True)
