from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,sys
out=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/confluence-v7-validation');out.mkdir(parents=True,exist_ok=True);results=[]
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8011/preview/20261017/confluence.html?skipgc&still'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width,height in (json.loads(sys.argv[3]) if len(sys.argv)>3 else [(1100,800),(390,844),(844,390)]):
  page=b.new_page(viewport={'width':width,'height':height},reduced_motion='reduce');errors=[];missing=[]
  page.add_init_script("localStorage.setItem('skipgc','t');localStorage.setItem('h53lang','ja')")
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.on('response',lambda r:missing.append([r.status,r.url]) if r.status>=400 else None)
  page.goto(url,timeout=120000);page.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded',timeout=120000)
  page.wait_for_timeout(500)
  q='__confluenceUIQA'
  for view in range(3):
   page.locator('.spot').nth(view).click();page.wait_for_function('(v)=>__confluenceUIQA.state().current===v',arg=view)
   page.evaluate(q+'.drawAt(1.7)')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.screenshot(path=str(out/f'confluence-final-{width}-{view}.png'),timeout=120000)
  page.locator('.spot').nth(0).click();page.evaluate(q+'.drawAt(2)')
  # Locate a real water hit away from controls, then dispatch pointer input.
  hit=page.evaluate('''()=>{for(let y=innerHeight*.44;y<innerHeight*.69;y+=14)for(let x=innerWidth*.3;x<innerWidth*.85;x+=14){let h=__confluenceUIQA.engine.pick(x,y);if(h&&h.water&&h.distance<16)return {x,y,hit:h};}return null;}''')
  assert hit,(width,'no reachable near water')
  page.mouse.click(hit['x'],hit['y']);assert page.evaluate(q+'.engine.report().impulses')==1
  assert page.locator('#panel').is_hidden()
  page.evaluate(q+'.drawAt(3.6)');page.screenshot(path=str(out/f'confluence-final-{width}-wave.png'),timeout=120000)
  mem=page.evaluate(q+'.engine.report().memory');assert mem[0]>0 and mem[1]>0
  page.evaluate(q+'.drawAt(50)');assert page.evaluate(q+'.engine.report().memory')==mem
  # Drag must rotate the view without injecting another wave.
  old=page.evaluate(q+'.state()');page.mouse.move(hit['x'],hit['y']);page.mouse.down();page.mouse.move(hit['x']+45,hit['y']+15,steps=8);page.mouse.up()
  assert page.evaluate(q+'.engine.report().impulses')==1
  assert page.evaluate(q+'.state().yaw')!=old['yaw']
  page.locator('#reset').click()
  # List every record, open and close it through the same UI as touch picking.
  for idx in range(10):
   page.locator('#more').click();page.locator('#observe-list').click();expect(page.locator('#panel')).to_be_visible()
   assert page.locator('.record-choice').count()==10
   page.locator('.record-choice').nth(idx).click();assert page.locator('#record-text').inner_text().strip()
   page.locator('#px').click();page.wait_for_function('!__h53Liquid.blocked&&performance.now()>=__h53Liquid.blockedUntil&&document.getElementById("panel").hidden',timeout=30000)
  # Actual taps on the visible wall and disc return their corresponding records.
  for view,key in [(0,9),(1,2)]:
   page.locator('.spot').nth(view).click()
   if key==9: page.evaluate(q+'.setLook(-25,-5)')
   page.evaluate(q+'.drawAt(4)')
   point=page.evaluate('''(key)=>{for(let y=120;y<innerHeight*.66;y+=18)for(let x=25;x<innerWidth-25;x+=18){let h=__confluenceUIQA.engine.pick(x,y);if(h&&h.key===key)return {x,y};}return null;}''',key)
   assert point,(width,view,'missing object')
   page.mouse.click(point['x'],point['y']);expect(page.locator('#panel')).to_be_visible()
   page.locator('#px').click();page.wait_for_function('!__h53Liquid.blocked&&performance.now()>=__h53Liquid.blockedUntil&&document.getElementById("panel").hidden',timeout=30000)
  page.locator('.spot').nth(0).click()
  # Pause, lifecycle, and a bounded running interval.
  page.evaluate(q+'.setPlaying(false)');page.wait_for_timeout(200);a=page.evaluate(q+'.state().seconds');page.wait_for_timeout(300);assert page.evaluate(q+'.state().seconds')==a
  page.evaluate(q+'.setPlaying(true)');page.wait_for_timeout(1400);assert page.evaluate(q+'.state().seconds')>a
  page.evaluate("dispatchEvent(new Event('pagehide'))");a=page.evaluate(q+'.state().seconds');page.wait_for_timeout(350);assert page.evaluate(q+'.state().seconds')==a
  page.evaluate("dispatchEvent(new Event('pageshow'))");page.wait_for_timeout(400);page.evaluate(q+'.setPlaying(false)')
  # Finite geometry; each viewpoint stands on an actual walkway/floor.
  geometry=page.evaluate('''()=>{let e=__confluenceUIQA.engine,bad=0,geo=new Set();e.scene.traverse(o=>{if(o.geometry)geo.add(o.geometry)});for(let g of geo)for(let a of Object.values(g.attributes))for(let v of a.array)if(!Number.isFinite(v))bad++;let feet=e.eyes.map(p=>{let ray=new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(0,-1,0));let h=ray.intersectObjects(e.pickables,false);return h[0]?{role:h[0].object.userData.record,height:h[0].point.y}:null;});return {bad,geometries:geo.size,feet};}''')
  assert geometry['bad']==0 and all(x and x['role'] in [8,11] and abs(x['height']-.6)<.02 for x in geometry['feet']),geometry
  assert not errors and not missing,(errors,missing)
  result={'size':[width,height],'views':3,'recordPanels':10,'waterTap':hit,'waveMemory':mem,'dragDistinct':True,'lifecycle':True,'geometry':geometry,'report':page.evaluate(q+'.engine.report()'),'errors':errors,'missing':missing}
  results.append(result);print(json.dumps(result),flush=True)
  page.locator('#back').click();page.wait_for_url('**/preview/20261017/index.html*');expect(page.locator('h1')).to_have_text('改修プレビュー')
  page.close()
 b.close()
(out/'confluence-v7-validation.json').write_text(json.dumps(results,indent=2))
