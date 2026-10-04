#!/usr/bin/env python3
"""Deterministic local-site audit; no network or browser required.
Usage: python3 audit/2026-10-04/static/check_static.py
Literal asset candidates in JS/JSON are advisory; dynamic filenames are listed separately.
"""
import collections, concurrent.futures, html.parser, json, pathlib, re, subprocess, tempfile, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[3]
OUT=pathlib.Path(__file__).resolve().parent
ORIGIN="tbyd-hiro53.github.io"
ASSET=re.compile(r"^[^\s<>\\{}$]*\.(?:html|js|css|png|jpe?g|webp|svg|ico|gif|json|bin|gz|gzb|f16|f16z|u16z|glb|rgb8|zip|md)(?:[?#].*)?$",re.I)
LITERAL=re.compile(r"([\"'])([^\"'\n]{1,250})\1")
CSS_URL=re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)",re.I)
class HTML(html.parser.HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True); self.refs=[]; self.ids=[]; self.scripts=[]; self.script=None; self.styles=[]; self.instyle=False; self.title=""; self.intitle=False; self.lang=""; self.viewport=None; self.tags=collections.Counter(); self.image_alt_missing=[]; self.frames=[]; self.controls=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); self.tags[tag]+=1
  if tag=="html": self.lang=a.get("lang","")
  if tag=="title": self.intitle=True
  if "id" in a: self.ids.append(a["id"])
  if tag=="meta" and a.get("name","").lower()=="viewport": self.viewport=a.get("content")
  if tag=="meta" and (a.get("property") in ("og:image","og:url") or a.get("name")=="twitter:image") and a.get("content"):
   self.refs.append({"tag":tag,"attribute":a.get("property") or a.get("name"),"url":a["content"]})
  if tag=="script": self.script={"attrs":a,"content":""}
  if tag=="style": self.instyle=True
  if tag=="img" and "alt" not in a: self.image_alt_missing.append(a.get("src",""))
  if tag=="iframe": self.frames.append(a)
  if tag in ("button","input","select","textarea"): self.controls.append(a)
  for attr in ("src","href","poster","data-src"):
   if attr in a: self.refs.append({"tag":tag,"attribute":attr,"url":a[attr]})
  if "srcset" in a:
   for part in a["srcset"].split(","):
    if part.strip(): self.refs.append({"tag":tag,"attribute":"srcset","url":part.strip().split()[0]})
  if "style" in a: self.styles.append(a["style"])
 def handle_endtag(self,tag):
  if tag=="script" and self.script is not None: self.scripts.append(self.script); self.script=None
  if tag=="style": self.instyle=False
  if tag=="title": self.intitle=False
 def handle_data(self,data):
  if self.script is not None: self.script["content"]+=data
  if self.instyle: self.styles.append(data)
  if self.intitle: self.title+=data

def local(src,url):
 u=urllib.parse.urlsplit(url)
 if u.scheme in ("data","blob","mailto","tel","javascript"): return None
 if u.netloc and u.netloc!=ORIGIN: return None
 if u.scheme and u.scheme not in ("http","https"): return None
 path=urllib.parse.unquote(u.path)
 base=ROOT if path.startswith("/") or u.netloc else (ROOT/src).parent
 target=(base/path.lstrip("/")).resolve() if path else ROOT/src
 if target.is_dir(): target=target/"index.html"
 try: rel=str(target.relative_to(ROOT))
 except ValueError: return "__OUTSIDE_ROOT__",u.fragment
 return rel,urllib.parse.unquote(u.fragment)

pages={}
for f in sorted(ROOT.glob("*.html")):
 h=HTML(); h.feed(f.read_text()); pages[f.name]=h
issues=[]; candidates=[]; references=[]; externals=[]; dynamic=[]; reachable=set(); seen=set(); queue=[]
def addref(src,url,kind,authoritative=True):
 result=local(src,url)
 if result is None:
  if urllib.parse.urlsplit(url).scheme in ("http","https") or url.startswith("//"): externals.append({"source":src,"url":url,"kind":kind})
  return
 target,frag=result
 if not target: return
 record={"source":src,"url":url,"target":target,"fragment":frag,"kind":kind,"authoritative":authoritative}; references.append(record)
 exists=(ROOT/target).is_file()
 if not exists:
  if authoritative: issues.append({"priority":"P1","type":"missing-local-reference",**record})
  else: candidates.append(record)
  return
 reachable.add(target)
 if target not in seen: queue.append(target)
 if authoritative and frag and target in pages and frag not in pages[target].ids:
  issues.append({"priority":"P2","type":"missing-fragment",**record})
for src,h in pages.items():
 for r in h.refs: addref(src,r["url"],r["tag"]+"."+r["attribute"])
 for css in h.styles:
  for m in CSS_URL.finditer(css): addref(src,m[1],"inline-css.url")
 for k,v in collections.Counter(h.ids).items():
  if v>1: issues.append({"priority":"P2","type":"duplicate-id","source":src,"id":k,"count":v})
 if not h.lang: issues.append({"priority":"P2","type":"missing-document-lang","source":src})
 if not h.viewport: issues.append({"priority":"P2","type":"missing-viewport","source":src})
 for img in h.image_alt_missing: issues.append({"priority":"P2","type":"missing-image-alt","source":src,"url":img})
 for script in h.scripts:
  if not script["attrs"].get("src"):
   for match in LITERAL.finditer(script["content"]):
    url=match[2]
    if ASSET.fullmatch(url) or url.startswith(("http://","https://")): addref(src,url,"inline-js.literal",False)
while queue:
 src=queue.pop(0)
 if src in seen: continue
 seen.add(src); f=ROOT/src
 if f.suffix not in (".js",".css",".json"): continue
 content=f.read_text(errors="replace")
 # Bundled libraries contain documentation strings and generic examples, not site dependencies.
 vendor=("three" in f.name.lower() or f.name.endswith("-r128.js") or "FXAAShader" in f.name)
 if f.suffix==".css":
  for m in CSS_URL.finditer(content): addref(src,m[1],"css.url")
 elif not vendor:
  # Resolve explicit constant-prefix concatenations without evaluating scripts.
  prefixes={m[1]:m[3] for m in re.finditer(r"\b(P[A-Z0-9]*|PREFIX|prefix)\s*=\s*([\"'])([^\"'\n]+)\2",content)}
  for m in re.finditer(r"\b(P[A-Z0-9]*|PREFIX|prefix)\s*\+\s*([\"'])([^\"'\n]+)\2",content):
   if m[1] in prefixes and ASSET.fullmatch(m[3]):
    # A QA failure fixture and a metadata-overridden fallback are not mandatory assets.
    mandatory=m[3]!="missing-test.json" and not content[max(0,m.start()-3):m.start()].rstrip().endswith("||")
    addref(src,prefixes[m[1]]+m[3],"js.constant-prefix" if mandatory else "js.fallback-or-qa",mandatory)
  for match in LITERAL.finditer(content):
   url=match[2]
   if ASSET.fullmatch(url) or url.startswith(("http://","https://")): addref(src,url,f.suffix[1:]+".literal",False)
  for match in re.finditer(r"`([^`]{1,250}\.(?:png|jpg|webp|bin|gz|json|gzb|f16|u16z|f16z)[^`]*)`",content):
   if "${" in match[1]: dynamic.append({"source":src,"expression":match[1]})
syntax_jobs=[]
for f in sorted(ROOT.glob("*.js")): syntax_jobs.append((f.name,f.read_text(),False))
for src,h in pages.items():
 for i,s in enumerate(h.scripts):
  t=s["attrs"].get("type","").lower()
  if not s["attrs"].get("src") and t in ("","text/javascript","application/javascript","module") and s["content"].strip(): syntax_jobs.append((src+"#script-"+str(i+1),s["content"],t=="module"))
def syntax(job):
 name,code,module=job
 with tempfile.TemporaryDirectory(prefix="h53-static-") as d:
  temp=pathlib.Path(d)/("check.mjs" if module else "check.js"); temp.write_text(code)
  run=subprocess.run(["node","--check",str(temp)],capture_output=True,text=True)
 return {"source":name,"ok":run.returncode==0,"error":run.stderr.strip() if run.returncode else None}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: syntaxes=list(pool.map(syntax,syntax_jobs))
for s in syntaxes:
 if not s["ok"]: issues.append({"priority":"P1","type":"javascript-syntax-error",**s})
for c in candidates:
 # These are candidates, not evidence of broken fetches: app loaders add prefixes,
 # QA intentionally requests missing-test.json, and manifests retain source provenance.
 suffix=pathlib.Path(urllib.parse.urlsplit(c["url"]).path).name
 c["existing_suffix_matches"]=sorted(f.name for f in ROOT.iterdir() if f.is_file() and (f.name.endswith("-"+suffix) or f.name.endswith("-"+suffix+".gzb"))) if len(suffix)>5 else []
 c["classification"]="intentional-qa" if suffix.endswith("missing-test.json") else "metadata-fallback" if c["kind"]=="js.fallback-or-qa" else "production-provenance" if "/outputs/production/" in c["url"] else "prefix-or-dynamic-suffix" if c["existing_suffix_matches"] or suffix.startswith((".","-")) else "manual-review"
inventory=[]
for src,h in pages.items():
 deps=sorted({r["target"] for r in references if r["source"]==src and (ROOT/r["target"]).is_file()})
 inventory.append({"page":src,"title":h.title,"bytes":(ROOT/src).stat().st_size,"language":h.lang,"viewport":h.viewport,"category":"portal" if src=="index.html" else "archive" if "archived" in src else "review" if "-review" in src else "preview" if "-preview" in src or "prototype" in src else "error" if src=="404.html" else "work","canvas_count":h.tags["canvas"],"iframe_count":h.tags["iframe"],"button_count":h.tags["button"],"external_script_count":sum(bool(s["attrs"].get("src")) for s in h.scripts),"inline_script_count":sum(not s["attrs"].get("src") for s in h.scripts),"direct_dependencies":deps,"direct_dependency_bytes":sum((ROOT/d).stat().st_size for d in deps),"issues":[i for i in issues if i.get("source")==src]})
summary={"pages":len(pages),"references":len(references),"external_references":len(externals),"local_reachable_files":len(reachable),"javascript_checks":len(syntaxes),"javascript_failures":sum(not s["ok"] for s in syntaxes),"issues":len(issues),"issues_by_type":dict(collections.Counter(i["type"] for i in issues)),"literal_candidates":len(candidates),"candidate_classifications":dict(collections.Counter(c["classification"] for c in candidates)),"limitations":["No browser, touch, Safari, rendering, remote HEAD requests or ZIP/offline extraction test is performed by this script.","Literal JS/JSON references require review; interpolated or computed filenames are advisory and runtime checks are necessary.","HTML parser does not evaluate DOM inserted by script; references to generated fragment IDs can be false positives.","Direct dependency bytes are not total network transfer; inline data and lazy-loaded dependencies differ.","External quoted URLs include namespace identifiers and documentation; their presence does not prove a network request."]}
for name,data in (("page-inventory.json",inventory),("references.json",references),("external-dependencies.json",externals),("dynamic-asset-expressions.json",dynamic),("javascript-syntax.json",syntaxes),("issues.json",issues),("literal-candidates.json",candidates),("summary.json",summary)):
 (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
print(json.dumps(summary,ensure_ascii=False,indent=2))
raise SystemExit(1 if issues else 0)
