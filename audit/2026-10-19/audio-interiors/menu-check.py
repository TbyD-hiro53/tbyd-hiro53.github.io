from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/workspace/render-work/audio-interiors');out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page(viewport={'width':390,'height':844})
 for work in ['preservation-hall','shoko']:
  pg.goto(f'http://127.0.0.1:8060/preview/20261017/{work}.html?skipgc#intake',wait_until='domcontentloaded',timeout=120000);pg.wait_for_function('window.__h53Audio && __h53Audio.report().scene?.ready',timeout=120000)
  menu='#menu' if work=='shoko' else '#h53-menu-panel';pg.locator('#menuToggle' if work=='shoko' else '#h53-menu-toggle').click();pg.wait_for_timeout(500);pg.locator('.h53-audio-credits summary').click();pg.wait_for_timeout(900)
  panel=pg.locator(menu).bounding_box();copy=pg.locator('.h53-copy' if work=='shoko' else '#cr').bounding_box();assert panel['y']+panel['height']<=copy['y']-4,(panel,copy)
  pg.screenshot(path=str(D/f'{work}-menu-final.png'));out.append({'work':work,'menu':panel,'copyright':copy})
 b.close()
(R/'audit/2026-10-19/audio-interiors/menu-results.json').write_text(json.dumps(out,indent=2));print(out)
