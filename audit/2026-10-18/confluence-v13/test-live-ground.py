from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/confluence-v13')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':390,'height':844});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 for k in ['engine','bake','viewer']:pg.route('**/confluence-v12-20261018-'+k+'.js',lambda route:route.fulfill(path=str(R/Path(route.request.url).name.replace('v12','v13')),content_type='application/javascript'))
 pg.goto('http://127.0.0.1:8060/preview/20261017/confluence.html?skipgc&still&render=live#bank',timeout=120000);pg.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded',timeout=120000)
 hits=pg.evaluate('''()=>{let e=__confluenceUIQA.engine,meshes=e.scene.children.filter(m=>m.isMesh&&m.material&&m.material.name==='shore mineral'),rows=[];
 for(let [x,z,rx,rz] of [[19,14,1.35,.7],[29,18.1,1.8,.8],[43,18.1,2,1],[66,16.1,2.2,1.1],[-21,-11,1.4,.9]])for(let [dx,dz] of [[0,0],[.5,0],[-.5,0],[0,.5],[0,-.5]]){let ray=new THREE.Raycaster(new THREE.Vector3(x+dx*rx,10,z+dz*rz),new THREE.Vector3(0,-1,0));let hit=ray.intersectObjects(meshes)[0];rows.push({x:x+dx*rx,z:z+dz*rz,height:hit?hit.point.y:null});}return rows;}''')
 assert all(h['height'] is not None and .35<h['height']<.55 for h in hits),hits
 pg.screenshot(path=str(D/'live-bank.png'),timeout=120000);assert not errors,errors;b.close()
(D/'live-ground-results.json').write_text(json.dumps({'samples':hits,'errors':errors},indent=2));print('PASS: 25 live terrain samples cover all five former openings',flush=True)
