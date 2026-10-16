"""Geography, reflection registration and actual new-object taps, also run after ZIP extraction."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json,sys
out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':800},reduced_motion='reduce');errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:missing.append([r.status,r.url]) if r.status>=400 else None)
 page.goto(sys.argv[1],timeout=120000);page.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded',timeout=120000)
 geography=page.evaluate('''()=>{let e=__confluenceUIQA.engine;e.scene.updateMatrixWorld(true);return [[0,20,10],[11,15,10],[12,4,10],[30,11,10],[0,1,.3],[0,-12,10]].map(([x,z,y])=>{let ray=new THREE.Raycaster(new THREE.Vector3(x,y,z),new THREE.Vector3(0,-1,0)),h=ray.intersectObjects(e.pickables,false)[0];return {x,z,role:h.object.userData.record,height:h.point.y,water:h.object===e.water};});}''')
 assert all(x['role']==8 for x in geography[:2]),geography
 assert all(x['water'] for x in geography[2:]),geography
 registration=[]
 for view in range(3):
  page.evaluate('(v)=>{__confluenceUIQA.setView(v);__confluenceUIQA.drawAt(2)}',view)
  # The reflected object and the water point on its viewing ray must share UV.
  error=page.evaluate('''()=>{let e=__confluenceUIQA.engine,c=e.camera,m=e.mirrorCamera,o=new THREE.Vector3(12,8,-35),ref=o.clone();ref.y=-ref.y;let ray=ref.clone().sub(c.position),t=-c.position.y/ray.y;let water=c.position.clone().addScaledVector(ray,t),a=o.project(m),b=water.project(m);return Math.hypot(a.x-b.x,a.y-b.y);}''')
  assert error<1e-6,error
  registration.append(error)
  page.screenshot(path=str(out/f'view-{view}.png'),timeout=120000)
 for key,yaw in [(3,-85),(4,-85),(7,0)]:
  page.evaluate('(yaw)=>{__confluenceUIQA.setView(1);__confluenceUIQA.setLook(yaw,-12);__confluenceUIQA.drawAt(2)}',yaw)
  hit=page.evaluate('''key=>{for(let y=100;y<innerHeight*.83;y+=(key===7?1:8))for(let x=30;x<innerWidth-30;x+=(key===7?24:8)){let h=__confluenceUIQA.engine.pick(x,y);if(h&&h.key===key)return {x,y};}return null;}''',key)
  assert hit,('new record not visible',key)
  page.mouse.click(hit['x'],hit['y']);expect(page.locator('#panel')).to_be_visible()
  assert page.locator('#record-text').inner_text().strip()
  page.locator('#px').click();page.wait_for_function('!__h53Liquid.blocked&&performance.now()>=__h53Liquid.blockedUntil&&document.getElementById("panel").hidden')
  page.screenshot(path=str(out/f'shore-record-{key}.png'),timeout=120000)
 for width,height in [(390,844),(844,390)]:
  page.set_viewport_size({'width':width,'height':height})
  for v in range(3):
   page.evaluate('(v)=>{__confluenceUIQA.setView(v);__confluenceUIQA.drawAt(6)}',v)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.screenshot(path=str(out/f'view-{width}-{v}.png'),timeout=120000)
 assert not errors and not missing,(errors,missing)
 result={'geography':geography,'reflectionProjectionErrors':registration,'newObjectTaps':[3,4,7],'sizes':3,'errors':errors,'missing':missing,'report':page.evaluate('__confluenceUIQA.engine.report()')}
 (out/'shore-validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));b.close()
