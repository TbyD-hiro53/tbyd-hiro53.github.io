from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys,math
base=sys.argv[1].rstrip('/');out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True);rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for slug in ['lacto-tricore','lacto-cortex']:
  pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=.25,ignore_https_errors=False);pg.set_default_timeout(90000);errors=[];audio=[]
  pg.add_init_script("""window.__audioStarts=0;const proto=AudioBufferSourceNode.prototype;const original=proto.start;proto.start=function(...args){if(this.buffer && Math.abs(this.buffer.duration-24)<.01)window.__audioStarts++;return original.apply(this,args)};""")
  pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  pg.on('request',lambda r:audio.append(r.url) if '.mp3' in r.url else None)
  print('start',slug,flush=True);pg.goto(base+'/preview/20261017/'+slug+'.html?skipgc&revision=device-audio-v4',wait_until='domcontentloaded',timeout=120000)
  pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene',timeout=240000)
  assert not audio and pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing')
  first=pg.evaluate('__h53Audio.report()');assert first['layers']==['rumble'] and first['loopSeconds']==[24] and first['revision']=='device-audio-v4'
  views=[]
  # Run beyond a complete loop and emulate a render-clock discontinuity.
  if slug=='lacto-tricore':
   pg.evaluate('__lactoTricore.clock.t-=8')
  else:
   pg.evaluate('window.__originalDeviceScene=__h53DeviceScene; window.__h53DeviceScene=()=>{const s=__originalDeviceScene();return {...s,time:s.time-8}}')
  start_level=pg.evaluate('__h53Audio.report().targets.rumble')
  pg.wait_for_timeout(26000)
  assert pg.evaluate('__audioStarts')==1, 'Continuous loop was restarted by render-clock drift'
  assert pg.evaluate('__h53Audio.report().targets.rumble')==start_level, 'Temporal gain modulation'
  if slug=='lacto-cortex':pg.evaluate('window.__h53DeviceScene=__originalDeviceScene')
  if slug=='lacto-tricore':
   for name,old in [('brain',.34),('sanc',.76),('main',.56)]:
    pg.locator('[data-view="'+name+'"]').tap();pg.wait_for_function('(v)=>__h53Audio.report().scene.view===v',arg=name);pg.wait_for_timeout(300)
    s=pg.evaluate('__h53Audio.report()');expected=2*old;assert s['targets']['rumble']==expected,(s,expected);assert 'metal' not in s['targets'];views.append(s)
   assert pg.evaluate('__audioStarts')==1
   pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.wait_for_function('!__h53Audio.report().playing');pg.locator('#pause').tap();pg.wait_for_function('__h53Audio.report().playing');pg.keyboard.press('Escape')
  else:
   assert first['targets']['rumble']==.60
   pg.locator('[data-legacy-id="reset"]').tap();pg.wait_for_function('__h53Audio.report().scene.view==="c-brain"');pg.wait_for_timeout(300);s=pg.evaluate('__h53Audio.report()');assert s['targets']['rumble']==.44;views.append(s)
   pg.locator('[data-legacy-id="dp"]').tap();pg.wait_for_function('!__h53Audio.report().playing');pg.wait_for_timeout(300);pg.locator('[data-legacy-id="dp"]').tap();pg.wait_for_function('__h53Audio.report().playing')
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing')
  assert len(audio)==1 and 'device-audio-v4-20261019-rumble.mp3' in audio[0],audio
  assert not errors,errors
  rows.append(dict(work=slug,initial=first,views=views,audioRequests=audio,errors=errors,pauseResumeMute='passed',continuousAcrossLoopAndClockDrift=True,DPR=.25));(out/'results.json').write_text(json.dumps(rows,indent=2));print('PASS',slug,flush=True);pg.close()
 b.close()
