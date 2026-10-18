from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
D=Path('/workspace/tbyd-hiro53.github.io/audit/2026-10-19/audio-outdoor');base=(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8060').rstrip('/');label=sys.argv[2] if len(sys.argv)>2 else 'paused-ui-final';rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for work in ['armillary','armillary-v2']:
  errors=[];pg=b.new_page(viewport={'width':390,'height':844},has_touch=True);pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.goto(f'{base}/preview/20261017/{work}.html?skipgc&still',wait_until='domcontentloaded');pg.wait_for_function('window.__h53Audio && window.ArmillaryArtwork && ArmillaryArtwork.report().ready',polling=250,timeout=120000)
  initial=pg.evaluate('ArmillaryArtwork.report().time');pg.locator('#composerToggle').tap()
  pg.wait_for_function('''()=>{let s=__composerLiquid.host.report().ui.states.find(x=>x.id==='composerMenu');return s&&s.rect[2]>300&&s.strength>.99}''',polling=250)
  pg.locator('.h53-audio-row input').fill('30');pg.locator('.h53-audio-row input').dispatch_event('input');pg.locator('.h53-audio-credits summary').click();pg.wait_for_timeout(600)
  pg.screenshot(path=str(D/f'{label}-{work}.png'),timeout=60000)
  pg.locator('#composerMenuContent').evaluate('(e)=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event("scroll"));}')
  pg.wait_for_timeout(200)
  pg.locator('#composerMenuClose').tap();pg.wait_for_function('composerMenu.hidden',polling=250)
  # Resize paused artwork and reopen; the glass rect must follow the DOM rect.
  pg.set_viewport_size({'width':320,'height':568});pg.locator('#composerToggle').tap();pg.wait_for_function("()=>{let s=__composerLiquid.host.report().ui.states.find(x=>x.id==='composerMenu'),r=composerMenu.getBoundingClientRect();return s&&s.phase==='idle'&&Math.abs(s.rect[2]-r.width)<2&&Math.abs(s.rect[3]-r.height)<2}",polling=250,timeout=30000)
  rects=pg.evaluate('''()=>{let s=__composerLiquid.host.report().ui.states.find(x=>x.id==='composerMenu');let r=composerMenu.getBoundingClientRect();return {glass:s.rect,dom:[r.x,r.y,r.width,r.height]}}''')
  assert all(abs(a-b)<2 for a,b in zip(rects['glass'],rects['dom'])),rects
  pg.locator('#composerMenuContent').evaluate('(e)=>e.scrollTop=0')
  pg.locator('#composerMenuContent>button').first.click();pg.wait_for_timeout(300);assert pg.locator('.h53-audio-row').count()==0
  pg.locator('#composerMenuContent>button').last.click();pg.wait_for_timeout(300);assert pg.locator('.h53-audio-row').count()==1
  pg.locator('#composerMenuClose').tap();pg.wait_for_function('composerMenu.hidden',polling=250)
  pg.wait_for_function("()=>{let b=document.getElementById('composerToggle'),s=__composerLiquid.host.report().ui.states.find(x=>x.id==='composerToggle');return getComputedStyle(b).visibility==='visible'&&s&&s.contentOpacity>.99}",polling=250)
  pg.wait_for_timeout(800);frames=pg.evaluate('ArmillaryArtwork.report().frames');pg.wait_for_timeout(600);last=pg.evaluate('ArmillaryArtwork.report()')
  assert last['frames']-frames<=1,(frames,last['frames'])
  assert last['time']==initial and not pg.evaluate('ArmillaryUI.report().playing')
  assert not errors,errors
  rows.append({'work':work,'baseURL':base,'motionRemainsPaused':True,'sceneTimeUnchanged':initial,'settledFrameDelta':last['frames']-frames,'menuGlassMatchesDOM':rects,'aboutAndBackCredits':'passed','errors':errors});print(work,'PASS',flush=True);pg.close()
 b.close()
(D/(label+'.json')).write_text(json.dumps(rows,indent=2))
