import os
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':400,'height':300});page.goto(os.environ.get('EO_SOURCE_URL','http://127.0.0.1:8030/preview/20261017/earth-origin-material.html?skipgc'),timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000)
 data=page.evaluate(Path(__file__).with_name('export.js').read_text());(Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v6'))/'forest.json').write_text(json.dumps(data));print(len(data['meshes']),flush=True);b.close()
