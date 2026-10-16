from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re,sys
root=Path(__file__).resolve().parents[3];out=Path('/workspace/previews/2026-10-17/ui-layout');out.mkdir(parents=True,exist_ok=True)
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8026/'
rows=json.loads((root/'audit/2026-10-17/ui-reading-survey.json').read_text());results=[]
# Capture actual DOM/CSS after each page builds its UI. Rendering is throttled only for this layout survey.
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 context=b.new_context(viewport={'width':1100,'height':800},reduced_motion='reduce')
 for row in rows:
  if not row['preview'] or (len(sys.argv)>2 and row['page'] not in sys.argv[2:]):continue
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  page.add_init_script('''{const raf=requestAnimationFrame;window.requestAnimationFrame=cb=>raf(t=>setTimeout(()=>cb(performance.now()),180));}''')
  try:
   page.goto(base+'preview/20261017/'+row['page']+'?skipgc',timeout=120000,wait_until='domcontentloaded')
   selector='#composerMenu' if row['family']=='composer' else '[role="dialog"],[aria-modal="true"],#rec,#panel,#info,#legacyMenu'
   page.wait_for_selector(selector,state='attached',timeout=60000)
   # Snapshot full DOM and same CSS. Script-free layout fixture tests geometry, not scene behavior.
   html=page.content();page.close()
   from bs4 import BeautifulSoup
   soup=BeautifulSoup(html,'html.parser')
   for s in soup.select('script,canvas,video,iframe'):s.decompose()
   for n in soup.select('[data-h53-reading-fit],[data-h53-reading-hidden]'):
    n.attrs.pop('data-h53-reading-fit',None);n.attrs.pop('data-h53-reading-hidden',None)
   for n in soup.select('link[rel="stylesheet"]'):
    href=n.get('href','')
    if not href.startswith(('http','data:')):n['href']=base+href.lstrip('/')
   for n in soup.select('base'):n.decompose()
   fixture=context.new_page();fixture.set_content(str(soup),wait_until='load');fixture.add_script_tag(url=base+'h53-reading-layout-v1-20261017.js')
   panels=fixture.locator(selector).evaluate_all('(ns)=>ns.map(n=>n.id).filter(Boolean)')
   checks=[]
   for ident in panels[:3]:
    for w,h,scale in [(320,568,1),(390,844,1),(768,1024,1),(844,390,1),(568,320,2),(1920,1080,2)]:
     fixture.set_viewport_size({'width':w,'height':h})
     fixture.evaluate('''({id,scale})=>{document.querySelectorAll('[aria-modal="true"]').forEach(n=>{n.hidden=true;n.removeAttribute('aria-modal')});let n=document.getElementById(id);n.inert=false;n.hidden=false;n.style.display='flex';n.style.flexDirection='column';n.style.opacity='1';n.setAttribute('aria-modal','true');let body=n.querySelector('.h53-liquid-scroll,#record-text,#infoBody')||n;let old=n.querySelector('[data-stress]');if(old)old.remove();let p=document.createElement('p');p.dataset.stress='';p.style.fontSize=14*scale+'px';p.textContent=('観測記録。水と岸と根のあいだを読み、景色に戻ります。').repeat(18);body.append(p);}''',{'id':ident,'scale':scale})
     fixture.wait_for_timeout(80)
     metrics=fixture.locator('#'+ident).evaluate('''n=>{let r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight,scroll:n.scrollHeight>n.clientHeight||Array.from(n.querySelectorAll('*')).some(e=>e.scrollHeight>e.clientHeight+2&&/auto|scroll/.test(getComputedStyle(e).overflowY)),hiddenButtons:Array.from(document.querySelectorAll('button')).filter(b=>!n.contains(b)&&!b.closest('[hidden]')).every(b=>getComputedStyle(b).visibility==='hidden')}}''')
     assert metrics['x']>=-1 and metrics['y']>=-1 and metrics['right']<=w+1 and metrics['bottom']<=h+1,(ident,w,h,metrics)
     assert metrics['hiddenButtons'],(ident,'outside buttons visible',metrics,fixture.locator('button').evaluate_all('(ns)=>ns.filter(n=>!n.closest("[data-h53-reading-fit]")&&getComputedStyle(n).visibility!=="hidden").map(n=>n.outerHTML.slice(0,350))'))
     checks.append({'panel':ident,'viewport':[w,h],'textScale':scale,'bounds':True,'outsideControlsHidden':True,'scrollable':metrics['scroll']})
    fixture.evaluate('(id)=>{let n=document.getElementById(id);n.hidden=true;n.removeAttribute("aria-modal")}',ident);fixture.wait_for_timeout(50)
    assert fixture.locator('[data-h53-reading-hidden]').count()==0
   result={'page':row['page'],'checks':checks,'startupErrors':errors,'scope':'actual DOM/CSS snapshot; geometry-only fixtures, not scene operation'};fixture.close()
  except Exception as e:
   result={'page':row['page'],'failure':str(e),'startupErrors':errors}
   if not page.is_closed():page.close()
  results.append(result);print(row['page'], 'PASS '+str(len(result.get('checks',[]))) if 'failure' not in result else result['failure'][:180],flush=True)
  (out/('recheck.json' if len(sys.argv)>2 else 'results.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2))
 b.close()
assert all('failure' not in r and not r['startupErrors'] for r in results)
