from pathlib import Path
from playwright.sync_api import sync_playwright
import json,faulthandler
faulthandler.dump_traceback_later(30,repeat=True)
D=Path('/tmp/confluence-v11')
script=r'''()=>{
 const e=__confluenceUIQA.engine,geos={},mats={},meshes=[];
 function texture(t){if(!t?.image)return null;let c=document.createElement('canvas');c.width=t.image.width;c.height=t.image.height;c.getContext('2d').drawImage(t.image,0,0);return {png:c.toDataURL('image/png').split(',')[1],repeat:t.repeat.toArray()};}
 function material(m){if(mats[m.uuid])return m.uuid;mats[m.uuid]={name:m.name,color:m.color?.toArray()||[1,1,1],roughness:m.roughness??1,metalness:m.metalness||0,map:texture(m.map),alphaTest:m.alphaTest||0,bumpMap:texture(m.bumpMap),bumpScale:m.bumpScale||0};return m.uuid;}
 e.scene.updateMatrixWorld(true);
 for(const o of e.scene.children){if(!o.isMesh||o===e.water||o===e.sky)continue;const g=o.geometry;
 if(!geos[g.uuid])geos[g.uuid]={position:Array.from(g.attributes.position.array),normal:g.attributes.normal?Array.from(g.attributes.normal.array):null,uv:g.attributes.uv?Array.from(g.attributes.uv.array):null,index:g.index?Array.from(g.index.array):null,groups:g.groups};
 meshes.push({name:o.material.name||'inquiry display',role:o.userData.record,geo:g.uuid,materials:(Array.isArray(o.material)?o.material:[o.material]).map(material),matrix:o.matrixWorld.toArray()});}
 return {geos,mats,meshes,eyes:e.eyes,parts:e.parts};}'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':400,'height':300});print('NAVIGATE',flush=True);page.goto('http://127.0.0.1:8040/preview/20261017/confluence.html?skipgc&still',timeout=120000);print('LOADED',flush=True);page.wait_for_function('window.__confluenceUIQA?.engine.loaded',timeout=120000)
 print('EXTRACT',flush=True);size=page.evaluate('()=>{window.__exportText=JSON.stringify(('+script+')());return __exportText.length}');print('WRITE',size,flush=True)
 # Python Playwright's pipe concatenates bytes quadratically for giant messages.
 # Transfer bounded chunks instead of one response containing the entire geometry.
 with (D/'scene.json').open('w') as f:
  for start in range(0,size,524288):f.write(page.evaluate('(n)=>__exportText.slice(n,n+524288)',start))
 data=json.loads((D/'scene.json').read_text());print(json.dumps({'meshes':len(data['meshes']),'materials':len(data['mats']),'eyes':data['eyes'],'bytes':size}),flush=True);b.close()
