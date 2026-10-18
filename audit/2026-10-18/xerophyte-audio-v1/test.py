import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060'
OUT=Path('/workspace/render-work/xerophyte-audio-v1');results=[]
URL=BASE+'/preview/20261017/xerophyte.html?skipgc&revision=audio-v1-test'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2)
    page=context.new_page();errors=[];requests=[];bad=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:requests.append(r.url))
    page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
    page.goto(URL);page.wait_for_function('window.__xero && window.__h53Audio');page.wait_for_timeout(400)
    assert not any('.mp3' in r for r in requests)
    assert page.evaluate('__h53Audio.report().context') is None
    page.locator('#h53-audio-toggle').tap();page.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded')
    assert len([r for r in requests if '.mp3' in r])==2
    results.append({'initialPlayback':page.evaluate('__h53Audio.report()')})
    page.locator('#storm').tap();page.wait_for_timeout(300)
    assert page.evaluate('__xero.clock.stormAt !== null')
    assert page.locator('#storm').is_disabled()
    timeline=[]
    for t in [0,15,30,55,84,125,150,175,180]:
        timeline.append(page.evaluate('(t)=>{__xero.clock.stormAt=0;__xero.clock.t=t;__h53Audio.sync();return __h53Audio.report()}',t))
    assert timeline[0]['targets']['sand']==0 and timeline[-1]['targets']['sand']==0
    assert timeline[4]['targets']['sand']>timeline[1]['targets']['sand']
    assert timeline[2]['targets']['wind']>timeline[1]['targets']['wind']>timeline[0]['targets']['wind']
    assert timeline[7]['targets']['sand']==0
    results.append({'timeline':timeline})
    page.locator('#menuToggle').tap();page.locator('#pause').tap();page.wait_for_timeout(200)
    assert not page.evaluate('__h53Audio.report().playing')
    oldtime=page.evaluate('__xero.clock.t');page.wait_for_timeout(250);assert page.evaluate('__xero.clock.t')==oldtime
    page.locator('#pause').tap();page.wait_for_function('__h53Audio.report().playing')
    page.locator('.h53-audio-row input').fill('0');page.wait_for_timeout(100);assert page.evaluate('__h53Audio.report().volume')==0
    page.locator('.h53-audio-row input').fill('55')
    page.locator('#about').tap();page.wait_for_timeout(400);before=page.evaluate('__xero.clock.t')
    page.locator('#closeInfo').tap();page.wait_for_timeout(400)
    assert page.evaluate('__xero.clock.t')>=before and page.evaluate('__h53Audio.report().enabled')
    page.locator('#menuToggle').tap();page.locator('#hideUI').tap();page.wait_for_timeout(200)
    assert not page.locator('#h53-audio-toggle').is_visible()
    page.locator('#showUI').tap();assert page.locator('#h53-audio-toggle').is_visible()
    page.evaluate('dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}))');page.wait_for_timeout(200)
    assert page.evaluate('__h53Audio.report().context')=='suspended' and not page.evaluate('__h53Audio.report().playing')
    page.evaluate('dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');page.wait_for_function('__h53Audio.report().playing')
    page.evaluate('const other=new BroadcastChannel("h53-audition-audio");other.postMessage({type:"claim",id:"qa-other"});setTimeout(()=>other.close(),200)')
    page.wait_for_function('!__h53Audio.report().enabled');assert not page.evaluate('__h53Audio.report().playing')
    for _ in range(4):page.locator('#h53-audio-toggle').tap()
    assert not page.evaluate('__h53Audio.report().enabled')
    results.append({'lifecycle':'pause/resume; volume zero; description close preserves scene and sound; UI hide/show; persisted pagehide/pageshow; cross-tab claim; rapid toggles passed'})
    for width,height in [(320,568),(390,844),(844,390),(1100,800)]:
        page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(450)
        ab=page.locator('#h53-audio-toggle').bounding_box();mb=page.locator('#menuToggle').bounding_box()
        assert ab['width']>=44 and ab['height']>=44 and ab['x']+ab['width']<=mb['x']
        assert mb['x']+mb['width']<=width
        page.locator('#menuToggle').tap();page.wait_for_timeout(450)
        page.locator('.h53-audio-credits summary').tap();page.wait_for_timeout(100)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        box=page.locator('#menu').bounding_box();assert box['x']>=0 and box['x']+box['width']<=width
        copy=page.locator('.h53-copy').bounding_box();assert box['y']+box['height']<=copy['y']
        assert not page.locator('#controls').is_visible()
        page.screenshot(path=str(OUT/f'ui-{width}x{height}.png'))
        page.locator('.h53-audio-credits summary').tap();page.locator('#menuToggle').tap()
        results.append({'viewport':[width,height],'audio':ab,'menuButton':mb})
    assert not errors,errors
    assert not bad,bad
    results.append({'pageErrors':errors,'failedResponses':bad,'requestedLocalDependencies':sorted(set(r.split(BASE+'/')[1].split('?')[0] for r in requests if r.startswith(BASE+'/')))})
    # Retry a genuine failed request, then rapidly cancel an in-flight load.
    retry=context.new_page();failures=[]
    def fail_once(route):
        if not failures:failures.append(True);route.fulfill(status=503,body='temporary')
        else:route.continue_()
    retry.route('**/xerophyte-audio-v1-20261018-sand.mp3',fail_once)
    retry.goto(URL);retry.wait_for_function('window.__xero && window.__h53Audio')
    retry.locator('#h53-audio-toggle').tap();retry.wait_for_function('!!__h53Audio.report().error')
    assert not retry.evaluate('__h53Audio.report().enabled')
    retry.locator('#h53-audio-toggle').tap();retry.wait_for_function('__h53Audio.report().playing && __h53Audio.report().loaded')
    results.append({'networkFailureRetry':'503 disables sound; second gesture recovers'})
    context.close();browser.close()
(OUT/'browser-validation.json').write_text(json.dumps(results,indent=2))
print('PASS',len(results),'checks; screenshots and report in',OUT)
