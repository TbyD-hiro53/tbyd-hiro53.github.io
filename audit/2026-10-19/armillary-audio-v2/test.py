from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path('/workspace/tbyd-hiro53.github.io');D=R/'audit/2026-10-19/armillary-audio-v2';base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';label=sys.argv[2] if len(sys.argv)>2 else 'results';rows=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['armillary','armillary-v2']:
  print(work,'START',flush=True);errors=[];requests=[];pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=.25);pg.set_default_timeout(60000)
  pg.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if r.url.startswith(base):
    deps.add(r.url[len(base)+1:].split('?')[0]);(D/'runtime-dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:requests.append(r.url))
  pg.goto(base+'/preview/20261017/'+work+'.html?skipgc&motion-seed=5301',wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene',polling=250,timeout=120000)
  assert not [x for x in requests if '.mp3' in x];assert pg.evaluate('__h53Audio.report().context') is None
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().loaded&&__h53Audio.report().playing',polling=250)
  first=pg.evaluate('__h53Audio.report()');assert first['loopSeconds']==[29,59,24,24,24,24,14]
  assert len([x for x in requests if '.mp3' in x])==7
  pg.evaluate("ArmillaryArtwork.setView('wide')")
  pg.wait_for_function('__h53Audio.report().sparksPlayed>0',polling=250,timeout=60000)
  active=pg.evaluate('__h53Audio.report()');assert active['lastSpark']['latency']<.26 and active['activeSparks']<=2
  rates=[active['targets']['rotation'+str(i)+'Rate']for i in range(4)];assert max(rates)-min(rates)>.001
  print(work,'audio + visible sparks + rotation PASS',flush=True)
  for t,name,rate in [(14.2,'metronome',1),(28.2,'wafer',1.13)]:
   pg.evaluate('(t)=>ArmillaryArtwork.setTime(t)',t);pg.wait_for_function('(name)=>__h53Audio.report().scene.effects.hologram.name===name',arg=name,polling=250);pg.evaluate('__h53Audio.sync()');assert pg.evaluate('__h53Audio.report().targets.hologramRate')==rate
  views={}
  for view in ['wide','mid','rings','core','rim']:
   pg.evaluate('(v)=>ArmillaryArtwork.setView(v)',view);pg.evaluate('__h53Audio.sync()');views[view]=pg.evaluate('__h53Audio.report().targets')
  assert views['core']['hologram']>views['wide']['hologram'] and views['rim']['grass']>views['core']['grass']
  pg.evaluate("ArmillaryArtwork.setView('rings');ArmillaryArtwork.setPlaying(false);__h53Audio.sync()")
  pg.wait_for_function('!__h53Audio.report().playing&&__h53Audio.report().activeSparks===0',polling=250);paused=pg.evaluate('ArmillaryArtwork.report().time');sp=pg.evaluate('__h53Audio.report().sparksPlayed')
  pg.locator('#composerToggle').tap();pg.wait_for_function("()=>{var s=__composerLiquid.host.report().ui.states.find(s=>s.id==='composerMenu');return s&&s.phase==='idle'&&s.rect[2]>200}",polling=250)
  pg.locator('.h53-audio-row input').fill('30');pg.locator('.h53-audio-row input').dispatch_event('input');pg.locator('.h53-audio-credits summary').click();pg.wait_for_timeout(300)
  pg.screenshot(path=str(D/(label+'-'+work+'.png')),timeout=60000)
  assert pg.evaluate('ArmillaryArtwork.report().time')==paused and pg.evaluate('__h53Audio.report().sparksPlayed')==sp
  pg.locator('#composerMenuClose').tap();pg.wait_for_function('composerMenu.hidden',polling=250)
  for w,h in [(320,568),(844,390)]:
   pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(250);a=pg.locator('#h53-audio-toggle').bounding_box();m=pg.locator('#composerToggle').bounding_box();assert a['width']==44 and a['height']==44 and a['x']>=0 and m['x']>=a['x']+44
  pg.evaluate('ArmillaryArtwork.setPlaying(true);__h53Audio.sync()');pg.wait_for_function('__h53Audio.report().playing',polling=250)
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.wait_for_function('!__h53Audio.report().playing&&__h53Audio.report().activeSparks===0',polling=250)
  pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.wait_for_function('__h53Audio.report().playing',polling=250)
  pg.evaluate('window.qaChannel=new BroadcastChannel("h53-audition-audio");qaChannel.postMessage({type:"claim",id:"other"})');pg.wait_for_function('!__h53Audio.report().enabled',polling=250)
  final=pg.evaluate('__h53Audio.report()');assert not errors and not final['error'],(errors,final['error']);rows.append({'work':work,'testDeviceScaleFactor':.25,'initial':first,'active':active,'viewMixes':views,'final':final,'errors':errors,'checks':['no autoplay/request','7 unique files, shared rotation buffer','actual visible arc sparks','four independently speed-driven rotation rates','hologram name transitions','five view gains','pause stops loops and one-shots','paused UI + volume + credits','320/390/844 control layout','pagehide/pageshow','cross-tab mute']});(D/(label+'.json')).write_text(json.dumps(rows,indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
