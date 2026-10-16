from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,sys
from PIL import Image,ImageChops,ImageStat
out=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/h53-earth-panorama');out.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':800});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.__EO_FIXED_TIME=3')
 page.goto(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/preview/20261017/earth-origin-material.html?skipgc',timeout=120000)
 page.wait_for_function('window.__EO_READY',timeout=120000)
 page.add_script_tag(path=str(Path(__file__).with_suffix('.js')))
 result=[]
 for station in [3,1,2,0]:
  page.evaluate('(i)=>{Pilot.mode(false);__H53M.station(i);}',station);page.wait_for_timeout(200)
  page.evaluate("dispatchEvent(new Event('pagehide'))")
  page.evaluate('Pilot.bench(1)')
  page.screenshot(path=str(out/f'realtime-{station}.png'),timeout=120000)
  a=page.evaluate('Pilot.bench(6)')
  page.evaluate('Pilot.capture(1024)')
  for i in range(6):
   data=page.evaluate('(i)=>Pilot.image(i)',i)
   (out/f's{station}-{i}.png').write_bytes(base64.b64decode(data))
  page.evaluate('Pilot.mode(true)');page.evaluate('Pilot.bench(1)')
  page.screenshot(path=str(out/f'panorama-{station}.png'),timeout=120000)
  b1=page.evaluate('Pilot.bench(6)')
  im1=Image.open(out/f'realtime-{station}.png').convert('RGB');im2=Image.open(out/f'panorama-{station}.png').convert('RGB')
  diff=ImageStat.Stat(ImageChops.difference(im1,im2)).mean
  x={'station':station,'realtime':a,'panorama':b1,'meanAbsRGB':diff}
  result.append(x);print(json.dumps(x),flush=True)
  page.evaluate("dispatchEvent(new Event('pageshow'))")
 (out/'report.json').write_text(json.dumps({'views':result,'errors':errors},indent=2))
 b.close()
