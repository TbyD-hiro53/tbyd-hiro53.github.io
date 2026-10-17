from pathlib import Path
from playwright.sync_api import sync_playwright
import time,json
from PIL import Image
D=Path('/tmp/earth-v9');r=Path('/workspace/tbyd-hiro53.github.io')
while not (r/'earth-origin-material-v9-20261018-interior-0-detail.jpg').exists():time.sleep(10)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':1440,'height':1000},device_scale_factor=2);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 for old,new in [('earth-origin-material-v7-20261017-app.js','earth-origin-material-v9-20261018-app.js'),('earth-origin-material-v8-20261017-interior.js','earth-origin-material-v9-20261018-interior.js')]:pg.route('**/'+old,lambda route,request,n=new:route.fulfill(path=str(r/n)))
 pg.goto('http://127.0.0.1:8040/preview/20261017/earth-origin-material.html?skipgc',timeout=120000);pg.wait_for_function('window.__EO_READY&&__EOInterior.report().active',timeout=120000)
 assert pg.evaluate('__EOInterior.report().detailWidth')==4096;assert pg.evaluate('__H53M.renderer.getPixelRatio()')==2;pg.screenshot(path=str(D/'v9-1440-0.png'),timeout=120000);assert not errors,errors
 (D/'first-results.json').write_text(json.dumps({'interior':pg.evaluate('__EOInterior.report()'),'canvas':pg.evaluate('[cv.width,cv.height]'),'errors':errors},indent=2));b.close()
for v in ['v8','v9']:
 im=Image.open(D/f'{v}-1440-0.png');im.crop((1780,1100,2380,1700)).save(D/f'{v}-rail-crop.png');im.crop((700,540,1300,1140)).save(D/f'{v}-door-crop.png')
print('FIRST COMPARISON READY',flush=True)
