from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/armillary-audio-v3');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';label=sys.argv[2] if len(sys.argv)>2 else 'results';rows=[];deps=set()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['armillary','armillary-v2']:
  errors=[];requests=[];pg=b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=.25);pg.set_default_timeout(60000);pg.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if r.url.startswith(base):
    deps.add(r.url[len(base)+1:].split('?')[0]);(D/'runtime-dependencies.json').write_text(json.dumps(sorted(deps),indent=2))
    if r.status>=400:errors.append(str(r.status)+' '+r.url)
  pg.on('response',response);pg.on('request',lambda r:requests.append(r.url));print(work,'START',flush=True)
  pg.goto(base+'/preview/20261017/'+work+'.html?skipgc&motion-seed=5301',wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene',polling=250,timeout=120000)
  assert pg.evaluate('__h53Audio.report().context')is None and not any('.mp3' in x for x in requests)
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().loaded && __h53Audio.report().playing',polling=250)
  first=pg.evaluate('__h53Audio.report()');assert first['revision']=='armillary-audio-v3';assert first['loopSeconds']==[29,59,24,24,24,24,14]
  for i in [1,2,3]:assert any('armillary-audio-v3-20261019-spark'+str(i)+'.mp3' in x for x in requests)
  assert not any('armillary-audio-v2-20261019-spark' in x for x in requests)
  pg.evaluate("ArmillaryArtwork.setView('wide')");pg.wait_for_function('__h53Audio.report().sparksPlayed>0',polling=250,timeout=120000)
  active=pg.evaluate('__h53Audio.report()');assert active['lastSpark']['latency']<.26 and active['activeSparks']<=1
  assert active['scene']['time']>first['scene']['time'];print(work,'REAL ARC',active['lastSpark'],flush=True)
  pg.evaluate('ArmillaryArtwork.setPlaying(false);__h53Audio.sync()');pg.wait_for_function('!__h53Audio.report().playing && !__h53Audio.report().activeSparks',polling=250);played=pg.evaluate('__h53Audio.report().sparksPlayed');pg.wait_for_timeout(800);assert pg.evaluate('__h53Audio.report().sparksPlayed')==played
  pg.locator('#composerToggle').tap();pg.wait_for_function("()=>{var s=__composerLiquid.host.report().ui.states.find(x=>x.id==='composerMenu');return s&&s.phase==='idle'&&s.rect[2]>200}",polling=250)
  pg.locator('.h53-audio-credits summary').click();assert pg.locator('.h53-audio-credits').inner_text().find('Electric Sparks, Railway')>=0
  pg.locator('#composerMenuClose').tap();pg.wait_for_function('composerMenu.hidden',polling=250)
  pg.evaluate('ArmillaryArtwork.setPlaying(true);__h53Audio.sync()');pg.wait_for_function('__h53Audio.report().playing',polling=250)
  pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('!__h53Audio.report().enabled && !__h53Audio.report().playing && !__h53Audio.report().activeSparks',polling=250)
  assert not errors,errors;rows.append({'work':work,'testDeviceScaleFactor':.25,'initial':first,'actualSpark':active,'final':pg.evaluate('__h53Audio.report()'),'checks':['no initial audio','new real-arcing samples, no rejected servo spark asset','actual visible arc triggers after real scene clock advances','max1 crackling cluster','pause stops loops and burst','updated source credit + paused menu','resume + mute stops all voices'],'errors':errors});(D/(label+'.json')).write_text(json.dumps(rows,indent=2));print(work,'PASS',flush=True);pg.close()
 b.close()
