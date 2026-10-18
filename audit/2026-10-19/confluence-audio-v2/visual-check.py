from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import numpy as np,json,io
D=Path('/workspace/render-work/confluence-audio-v2');rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':1000,'height':700});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 pg.goto('http://127.0.0.1:8060/preview/20261017/confluence.html?skipgc&still#bank');pg.wait_for_function('window.__confluenceUIQA && __confluenceUIQA.engine.bake.active',timeout=180000)
 pg.evaluate('__confluenceUIQA.setLook(45,-22)');pg.wait_for_timeout(200)
 for t in [0,1,14400]:
  pg.evaluate('(t)=>__confluenceUIQA.drawAt(t)',t);pg.screenshot(path=str(D/f'water-{t}.png'));rows.append({'seconds':t,'report':pg.evaluate('__confluenceUIQA.engine.report()')})
 # Exercise the actual GPU current-height field, isolated from static reflections.
 # The same patch should arrive downstream, not upstream, after one second.
 pg.evaluate('''()=>{let e=__confluenceUIQA.engine,m=e.water.material;window.originalWater=m.fragmentShader;m.fragmentShader=m.fragmentShader.replace('gl_FragColor=vec4(c,1.);','gl_FragColor=vec4(vec3(.4+currentHeight(p,currentWeights(p))*7.),1.);');m.needsUpdate=true;}''')
 frames=[]
 for t in [0,1]:
  pg.evaluate('(t)=>__confluenceUIQA.drawAt(t)',t);frames.append(np.asarray(Image.open(io.BytesIO(pg.screenshot()))).astype(float)/255)
 points=pg.evaluate('''()=>{let c=__confluenceUIQA.engine.camera;function z(x){return 6+5*Math.exp(-Math.pow((x-48)/24,2));}return [16,16-.68,16+.68].map(x=>{let p=new THREE.Vector3(x,0,z(x)).project(c);return [(p.x+1)*innerWidth/2,(1-p.y)*innerHeight/2];});}''')
 from scipy.ndimage import map_coordinates
 def patch(frame,xy):
  yy,xx=np.mgrid[-5:6,-5:6];return map_coordinates(frame.mean(axis=2),[yy+xy[1],xx+xy[0]],order=1)
 initial=patch(frames[0],points[0]);loss=[float(np.mean((initial-patch(frames[1],q))**2)) for q in points]
 assert loss[1]<loss[0] and loss[1]<loss[2],(points,loss)
 rows.append({'gpuTransportPatch':{'positions':points,'mseStationaryDownstreamUpstream':loss,'downstreamBest':True}})
 assert not errors,errors
 b.close()
(D/'visual-results.json').write_text(json.dumps(rows,indent=2));print('VISUAL PASS',loss)
