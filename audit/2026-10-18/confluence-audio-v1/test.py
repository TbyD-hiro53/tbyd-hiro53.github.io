from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/render-work/confluence-audio-v1');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[];requests=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True);pg=ctx.new_page()
 pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None);pg.on('request',lambda r:requests.append(r.url))
 pg.goto(base+'/preview/20261017/confluence.html?skipgc&still&revision=audio-v1#gap',timeout=120000)
 pg.wait_for_function('window.__confluenceUIQA && window.__h53Audio',timeout=120000)
 pg.wait_for_function('__confluenceUIQA.engine.bake.active',timeout=240000)
 assert not any('.mp3' in r for r in requests) and pg.evaluate('__h53Audio.report().context') is None
 pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().loaded',timeout=30000)
 assert not pg.evaluate('__h53Audio.report().playing')
 assert pg.evaluate('__h53Audio.report().loopSeconds')==[17,17]
 pg.locator('#more').tap();pg.locator('#motion').tap();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#more').tap()
 print('initial/play passed',flush=True)
 for i,key in enumerate(['gap','under','bank']):
  pg.locator(f'[data-spot="{i}"]').tap()
  pg.wait_for_function('(i)=>__confluenceUIQA.engine.bake.active&&__confluenceUIQA.state().current===i',arg=i,timeout=240000)
  pg.wait_for_timeout(500);r=pg.evaluate('__h53Audio.report()');assert r['playing'] and r['scene']['view']==i
  yaw=r['scene']['yaw'];pan=r['targets']['rillPan'];pg.evaluate('(y)=>__confluenceUIQA.setLook(y,0)',yaw+180);pg.wait_for_timeout(250)
  reverse=pg.evaluate('__h53Audio.report().targets.rillPan');assert abs(pan+reverse)<.001
  pg.evaluate('(y)=>__confluenceUIQA.setLook(y,0)',yaw);pg.wait_for_timeout(250)
  rows.append({'view':key,'audio':r,'reversePan':reverse,'bake':pg.evaluate('__confluenceUIQA.engine.report().bake')})
  assert not rows[-1]['bake']['error'];print(key,'passed',flush=True)
 assert rows[2]['audio']['targets']['rill']>rows[0]['audio']['targets']['rill']>rows[1]['audio']['targets']['rill']
 # Scene interactions retain their behavior while audio continues.
 pg.evaluate('__confluenceUIQA.setLook(45,-14)');before=pg.evaluate('__confluenceUIQA.state()')
 pg.evaluate('__confluenceUIQA.openRecord(0)');pg.wait_for_timeout(400);pg.locator('#px').tap();pg.wait_for_timeout(750)
 after=pg.evaluate('__confluenceUIQA.state()');assert after['yaw']==before['yaw'] and after['pitch']==before['pitch'] and pg.evaluate('__h53Audio.report().playing')
 hit=pg.evaluate('''()=>{for(let y of [.5,.6,.7,.8])for(let x of [.25,.5,.75,.1,.9]){let h=__confluenceUIQA.engine.pick(innerWidth*x,innerHeight*y);if(h&&h.water)return [innerWidth*x,innerHeight*y];}return null;}''')
 assert hit;old=pg.evaluate('__confluenceUIQA.engine.eventCount');pg.touchscreen.tap(*hit);pg.wait_for_function('(n)=>__confluenceUIQA.engine.eventCount>n',arg=old)
 pg.locator('#more').tap();pg.locator('#motion').tap();pg.wait_for_timeout(250);assert not pg.evaluate('__h53Audio.report().playing')
 pg.locator('.h53-audio-row input').fill('0');assert pg.evaluate('__h53Audio.report().volume')==0;pg.locator('.h53-audio-row input').fill('55')
 pg.locator('#hide').tap();pg.wait_for_timeout(200);assert not pg.locator('#h53-audio-toggle').is_visible();pg.locator('#restore').tap();assert pg.locator('#h53-audio-toggle').is_visible()
 for w,h in [(320,568),(390,844),(844,390),(1100,800)]:
  pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(400)
  ab=pg.locator('#h53-audio-toggle').bounding_box();mb=pg.locator('#more').bounding_box();assert ab['width']>=44 and ab['height']>=44 and ab['x']+ab['width']<=mb['x'] and mb['x']+mb['width']<=w
  pg.locator('#more').tap();pg.locator('.h53-audio-credits summary').tap();pg.wait_for_timeout(400)
  menu=pg.locator('#menu').bounding_box();copy=pg.locator('.h53-copy').bounding_box();assert menu['y']+menu['height']<=copy['y']+1
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
  pg.screenshot(path=str(D/f'ui-{w}.png'));pg.locator('.h53-audio-credits summary').tap();pg.locator('#more').tap();rows.append({'viewport':[w,h],'audioButton':ab,'menu':menu})
 pg.locator('#more').tap();pg.locator('#motion').tap();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#more').tap()
 pg.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');pg.wait_for_timeout(150);assert not pg.evaluate('__h53Audio.report().playing')
 pg.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');pg.wait_for_function('__h53Audio.report().playing')
 pg.evaluate('let other=new BroadcastChannel("h53-audition-audio");other.postMessage({type:"claim",id:"qa"});setTimeout(()=>other.close(),100)');pg.wait_for_function('!__h53Audio.report().enabled')
 for _ in range(4):pg.locator('#h53-audio-toggle').tap()
 assert not pg.evaluate('__h53Audio.report().enabled')
 assert not errors,errors
 rows.append({'checks':'mute by default, no initial audio request, all views, opposite-facing pan, record dismissal, water tap, pause/resume, volume, hide/restore, persisted lifecycle, cross-tab claim, rapid toggles','errors':errors,'dependencies':sorted(set(r.split(base+'/')[1].split('?')[0].split('#')[0] for r in requests if r.startswith(base+'/')))})
 b.close()
(D/('independent-results.json' if len(sys.argv)>1 else 'results.json')).write_text(json.dumps(rows,indent=2));print('ALL PASS',flush=True)
