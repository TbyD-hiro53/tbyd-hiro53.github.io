from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
D=Path('/workspace/previews/2026-10-18/coastal-audio-integrated');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);err=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.on('console',lambda m:err.append(m.text) if m.type=='error' else None)
 pg.goto(base+'/coastal-glass.html?skipgc',timeout=120000);pg.wait_for_function('window.CoastalGlass&&CoastalGlass.getState().ready&&window.__h53Audio',timeout=120000);pg.locator('#h53-audio-toggle').tap();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#timeToggle').tap();pg.locator('[data-time=night]').tap();pg.wait_for_function('CoastalGlass.getState().time==="night"',timeout=120000);pg.locator('#menuToggle').tap();pg.locator('#pause').tap();pg.wait_for_function('!__h53Audio.report().playing');pg.locator('#menuToggle').tap() if pg.locator('#menu').is_hidden() else None
 before=pg.evaluate('CoastalGlass.getState().seconds');pg.wait_for_timeout(500);assert pg.evaluate('CoastalGlass.getState().seconds')==before
 axes=[]
 for t in [0,6,24]:
  axes.append(pg.evaluate('(t)=>{let w=CoastalGlass.world;w.update(t,false);w.render();return w.u.uBeaconAxis.value.toArray()}',t))
 assert sum(abs(x-y) for x,y in zip(axes[0],axes[1]))>.5;assert max(abs(x-y) for x,y in zip(axes[0],axes[2]))<1e-6
 pg.locator('#pause').tap();pg.wait_for_function('__h53Audio.report().playing');pg.locator('#menuToggle').tap() if pg.locator('#menu').is_visible() else None;pg.screenshot(path=str(D/'integrated-night.png'));assert not err,err
 rows.append({'rotationPeriod24s':True,'quarterTurnChangesAxis':True,'nightSound':pg.evaluate('__h53Audio.report()'),'pauseStopsClockAndSound':True,'errors':err});b.close()
(D/('night-independent.json' if len(sys.argv)>1 else 'night.json')).write_text(json.dumps(rows,indent=2));print('NIGHT PASS',flush=True)
