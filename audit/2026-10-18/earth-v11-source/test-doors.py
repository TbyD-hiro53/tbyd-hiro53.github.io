from pathlib import Path
from playwright.sync_api import sync_playwright
import json,math,sys
D=Path('/workspace/previews/2026-10-18/earth-v11');D.mkdir(parents=True,exist_ok=True);base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8040/preview/20261017/earth-origin-material.html';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h,dpr,low in [(1280,900,1,False),(390,844,2,False),(844,390,1,False),(390,844,1,True)]:
  pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=dpr,has_touch=True);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  if low:
   pg.add_init_script("const oc=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t==='webgl2'?null:oc.call(this,t,...a)};const op=WebGLRenderingContext.prototype.getParameter;WebGLRenderingContext.prototype.getParameter=function(p){return p===3379?2048:op.call(this,p)};")
  pg.goto(base+'?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY',timeout=180000)
  for i,key,yaw in [(0,'0-rear',math.pi),(3,'3-rear',math.atan2(.37,-4.8)),(3,'3-side',math.pi/2)]:
   pg.evaluate('(i)=>__H53M.station(i)',i);eye=[0,1.55,-11.2] if i==0 else [-.37,1.55,-7.2];pg.evaluate('(v)=>__H53M.setEye(...v)',eye+[yaw,-.09]);pg.wait_for_function('(i)=>__EOForest.report().current===i&&__EOForest.report().active',arg=i,timeout=180000);pg.wait_for_function('(i)=>__EOInterior.report().current===i&&__EOInterior.report().active',arg=i,timeout=120000);pg.wait_for_timeout(250)
   report=pg.evaluate('__EOForest.report()');assert report['revision']=='v11';assert report['failed']==[]
   if i==0:assert report['heroSize']==([1536,2048] if low else [3072,4096])
   else:assert report['rearSize']==([1536,1536] if low else [2048,2048]);assert report['heroSize']==([1536,2048] if low else [3072,4096])
   pg.screenshot(path=str(D/f'{w}-{int(low)}-{key}.png'),timeout=120000);rows.append({'viewport':[w,h,dpr],'low':low,'view':key,'forest':report})
  # Real drag remains usable, including crossing the detail-map boundary.
  pg.mouse.move(w*.55,h*.5);pg.mouse.down();pg.mouse.move(w*.2,h*.55,steps=12);pg.mouse.up();pg.wait_for_timeout(300)
  pg.evaluate('__H53M.open("forest")');pg.wait_for_selector('#rec',state='visible');assert pg.locator('#record-close').bounding_box()['width']==44;pg.locator('#record-close').tap();pg.wait_for_function('!__h53Liquid.blocked&&performance.now()>__h53Liquid.blockedUntil',timeout=30000)
  counts=[]
  for k in range(3):
   for i in [0,3]:
    pg.evaluate('(i)=>__H53M.station(i)',i);pg.wait_for_function('(i)=>__EOForest.report().current===i&&__EOForest.report().active',arg=i,timeout=180000)
   pg.wait_for_timeout(200);counts.append(pg.evaluate('__H53M.renderer.info.memory.textures'))
  assert counts[1:]==counts[:1]*2,counts
  pg.evaluate('__H53M.station(1)');pg.wait_for_function('__EOForest.report().current===-1',timeout=30000)
  assert pg.evaluate('__EOForest.report().gpuImageBytes')==0;assert not errors,errors
  rows.append({'viewport':[w,h,dpr],'low':low,'textureCounts':counts,'releasedOnView2':True,'errors':errors});pg.close();print(w,'low' if low else 'full','PASS',flush=True)
 b.close()
(D/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2))
