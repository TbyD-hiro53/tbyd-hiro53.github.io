import gzip,numpy as np,json
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path('/workspace/tbyd-hiro53.github.io');d=np.frombuffer(gzip.decompress((r/'confluence-v11-20261018-bank-pano-depth.bin.gz').read_bytes()),np.uint8).reshape(2048,4096,4);tests=[]
for v,u in [(1500,2000),(1700,2200),(1400,2400),(1350,3100),(1200,3000),(1450,3500),(1550,1500)]:
 phi=((u+.5)/4096-.5)*2*np.pi;lat=(.5-(v+.5)/2048)*np.pi;ray=[np.sin(phi)*np.cos(lat),np.sin(lat),-np.cos(phi)*np.cos(lat)];dist=2**((float(d[v,u,0])*256+d[v,u,1])/65535*np.log2(2049))-1;tests.append({'ray':ray,'bake':dist})
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':600,'height':400});pg.goto('http://127.0.0.1:8040/preview/20261017/confluence.html?skipgc&render=live&still#bank');pg.wait_for_function('window.__confluenceUIQA&&__confluenceUIQA.engine.loaded');out=pg.evaluate('''rows=>{var e=__confluenceUIQA.engine;return rows.map(x=>{var r=new THREE.Raycaster(new THREE.Vector3(11,2.25,15),new THREE.Vector3().fromArray(x.ray));var hits=r.intersectObjects(e.bake.staticMeshes.filter(m=>m!==e.sky));return {...x,distance:hits[0]?.distance,point:hits[0]?.point.toArray()}})}''',tests);print(json.dumps(out,indent=2));b.close()
