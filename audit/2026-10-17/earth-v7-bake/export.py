import os
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v7'));D.mkdir(parents=True,exist_ok=True);repo=Path(os.environ.get('EO_REPO_DIR',str(Path(__file__).resolve().parents[3])))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':400,'height':300});page.goto(os.environ.get('EO_SOURCE_URL','http://127.0.0.1:8030/preview/20261017/earth-origin-material.html?skipgc'),timeout=120000);page.wait_for_function('window.__EO_READY',timeout=120000);page.add_script_tag(content=(repo/'earth-origin-material-v7-20261017-partition.js').read_text());data=page.evaluate((Path(__file__).parent/'export.js').read_text());(D/'interior.json').write_text(json.dumps(data));print(json.dumps({'meshes':len(data['meshes']),'materials':len(data['mats']),'lights':data['lights'],'partition':data['partition']},indent=2),flush=True);b.close()
