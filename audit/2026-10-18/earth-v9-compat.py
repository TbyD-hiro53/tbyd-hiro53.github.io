from pathlib import Path
from playwright.sync_api import sync_playwright
import json
repo=Path('/workspace/tbyd-hiro53.github.io');out=Path('/workspace/previews/2026-10-18/earth-v9');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for capped in [False,True]:
  page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.add_init_script("const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t==='webgl2'?null:original.call(this,t,...a)};")
  if capped:page.add_init_script("const originalParameter=WebGLRenderingContext.prototype.getParameter;WebGLRenderingContext.prototype.getParameter=function(p){return p===3379?2048:originalParameter.call(this,p)};")
  for old,new in [('earth-origin-material-v7-20261017-app.js','earth-origin-material-v9-20261018-app.js'),('earth-origin-material-v8-20261017-interior.js','earth-origin-material-v9-20261018-interior.js'),('earth-origin-material-v8-20261017-forest.js','earth-origin-material-v9-20261018-forest.js')]:page.route('**/'+old,lambda route,request,n=new:route.fulfill(path=str(repo/n)))
  page.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);page.wait_for_function('window.__EO_READY',timeout=180000);page.evaluate('__H53M.station(3)');page.wait_for_function('__EOInterior.report().active&&__EOInterior.report().current===3&&__EOForest.report().active&&__EOForest.report().current===3',timeout=120000)
  assert page.evaluate('__H53M.renderer.capabilities.isWebGL2') is False
  assert page.evaluate('__EOInterior.report().detailWidth')==(2048 if capped else 4096)
  assert page.evaluate('__EOForest.report().heroSize')==([1536,2048] if capped else [3072,4096])
  page.screenshot(path=str(out/('webgl1-low.png' if capped else 'webgl1.png')),timeout=120000);assert not errors,errors
  rows.append({'webgl1':True,'maximumTexture2048':capped,'interior':page.evaluate('__EOInterior.report()'),'forest':page.evaluate('__EOForest.report()'),'errors':errors});page.close()
 b.close()
(out/'compat-results.json').write_text(json.dumps(rows,indent=2));print('COMPAT PASS',flush=True)
