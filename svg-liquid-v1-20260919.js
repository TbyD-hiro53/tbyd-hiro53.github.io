/* Native SVG remains the artwork. Only the optical UI receives a sampled live SVG raster.
 * Native JS/CSS motion and geometry are never changed by this adapter. */
(function(root){'use strict';
const STYLE_PROPERTIES=['fill','fill-opacity','fill-rule','stroke','stroke-opacity','stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','opacity','color','stop-color','stop-opacity','filter','clip-path','mask','font-family','font-size','font-weight','font-style','letter-spacing','text-anchor','dominant-baseline','visibility','display','transform','transform-origin','transform-box','paint-order','vector-effect'];
function localURL(value){return value.replace(/url\(["']?[^\)"']*#([^\)"']+)["']?\)/g,'url(#$1)');}
function SVGLiquid(options){
  this.options=options;this.svg=options.svg;this.artworkLoop=options.artworkLoop!==false;this.uiRAF=0;this.capturePending=false;this.captureCount=0;this.captureErrors=[];this.captureMs=[];this.captureLatencyMs=[];this.lastCapture=-Infinity;this.captureInterval=1000/15;this.forceCapture=true;this.shown=true;
  this.source=document.createElement('canvas');this.source.className='svg-liquid-source';this.source.setAttribute('aria-hidden','true');document.body.appendChild(this.source);this.ctx=this.source.getContext('2d');
  const holder=document.createElement('div');holder.id='svgLiquidControls';holder.innerHTML='<a id="back" href="index.html" aria-label="registry">← index</a><button id="menuToggle" type="button" aria-label="補助メニューを開く" aria-expanded="false" aria-controls="menu">•••</button><button id="showUI" type="button" aria-label="操作を表示" hidden>UI</button><div id="menu" class="h53-liquid-menu" role="dialog" aria-label="補助メニュー" hidden><button id="svgAbout" type="button">作品説明</button><button id="svgFullscreen" type="button" aria-pressed="false">全画面</button><button id="svgHide" type="button">UIを隠す</button><button id="svgCloseMenu" type="button">閉じる</button></div><section id="info" role="dialog" aria-labelledby="infoTitle" hidden><h1 id="infoTitle"></h1><div id="infoBody" class="h53-liquid-scroll"></div><button id="closeInfo" type="button" aria-label="説明を閉じる">×</button></section>';
  document.body.appendChild(holder);document.body.classList.add('svg-liquid');this.elements={};for(const element of holder.querySelectorAll('[id]'))this.elements[element.id]=element;
  const e=this.elements,self=this;if(location.search.indexOf('skipgc')>=0)e.back.search='?skipgc';
  const backgroundControl=document.getElementById('bgbtn');if(backgroundControl){e.menu.insertBefore(backgroundControl,e.svgFullscreen);backgroundControl.addEventListener('click',()=>{this.forceCapture=true;this.requestFrame();});}
  this.host=new H53LiquidHost({root:document.body,source:this.source,requestFrame:()=>this.requestFrame(),night:()=>!document.body.classList.contains('svg-liquid-light'),
    surfaces:[{selector:'#back,#menuToggle,#showUI',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
  e.menuToggle.onclick=()=>this.menu(e.menu.hidden);e.svgCloseMenu.onclick=()=>this.menu(false);
  e.svgAbout.onclick=()=>{const title=document.querySelector('meta[property="og:title"]');this.info(title?title.content.split(' — ')[0]:document.title,document.querySelector('meta[name="description"]').content);};
  e.closeInfo.onclick=()=>this.closeInfo();e.svgHide.onclick=()=>this.show(false);e.showUI.onclick=()=>this.show(true);
  e.svgFullscreen.onclick=()=>this.host.fullscreen(e.svgFullscreen,()=>this.info('全画面表示','この環境ではブラウザの全画面表示を開始できない。作品単独ページで表示領域いっぱいに鑑賞できるが、OSやブラウザの操作欄は消せない場合がある。',true));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!e.info.hidden){event.preventDefault();this.closeInfo();}else if(!e.menu.hidden){event.preventDefault();this.menu(false);}else if(!this.shown){event.preventDefault();this.show(true);}}});
  this.onResize=()=>{this.forceCapture=true;this.requestFrame();};window.addEventListener('resize',this.onResize);window.addEventListener('orientationchange',this.onResize);document.addEventListener('fullscreenchange',this.onResize);if(window.visualViewport)visualViewport.addEventListener('resize',this.onResize);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){this.forceCapture=true;this.requestFrame();}});
  if(this.artworkLoop)this.capture(performance.now());this.requestFrame();
}
SVGLiquid.prototype.background=function(){const bg=document.querySelector('.bg');return getComputedStyle(bg||document.body).backgroundColor;};
SVGLiquid.prototype.snapshot=function(){
  const clone=this.svg.cloneNode(true),originalNodes=[this.svg].concat(Array.from(this.svg.querySelectorAll('*'))),clonedNodes=[clone].concat(Array.from(clone.querySelectorAll('*')));
  for(let i=0;i<originalNodes.length;i++){
    const style=getComputedStyle(originalNodes[i]),target=clonedNodes[i];
    for(const property of STYLE_PROPERTIES){const value=style.getPropertyValue(property);if(value)target.style.setProperty(property,localURL(value));}
    // Freeze the actual sampled CSS transform. The original SVG still animates natively.
    target.style.setProperty('animation','none','important');target.style.setProperty('transition','none','important');
  }
  const bounds=this.svg.getBoundingClientRect();clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',String(bounds.width));clone.setAttribute('height',String(bounds.height));clone.style.width=bounds.width+'px';clone.style.height=bounds.height+'px';clone.style.transform='none';clone.style.position='static';clone.style.margin='0';
  return {xml:new XMLSerializer().serializeToString(clone),bounds:bounds,background:this.background(),sampleAt:performance.now()};
};
SVGLiquid.prototype.capture=function(now){
  if(this.capturePending||document.hidden)return;if(!this.forceCapture&&now-this.lastCapture<this.captureInterval)return;
  this.capturePending=true;this.forceCapture=false;this.lastCapture=now;const start=performance.now();
  let snap;try{snap=this.snapshot();}catch(error){this.capturePending=false;this.captureErrors.push(String(error));return;}
  const width=innerWidth,height=innerHeight,scale=Math.min(devicePixelRatio||1,1280/Math.max(width,height),Math.sqrt(900000/(width*height)));
  const url=URL.createObjectURL(new Blob([snap.xml],{type:'image/svg+xml'})),image=new Image(),self=this;
  image.onload=function(){
    const elapsed=performance.now()-start;URL.revokeObjectURL(url);
    if(width!==innerWidth||height!==innerHeight){self.capturePending=false;self.forceCapture=true;self.requestFrame();return;}
    const w=Math.max(1,Math.round(width*scale)),h=Math.max(1,Math.round(height*scale));if(self.source.width!==w||self.source.height!==h){self.source.width=w;self.source.height=h;}
    self.ctx.setTransform(scale,0,0,scale,0,0);self.ctx.fillStyle=snap.background;self.ctx.fillRect(0,0,width,height);self.ctx.drawImage(image,snap.bounds.left,snap.bounds.top,snap.bounds.width,snap.bounds.height);
    self.captureCount++;self.capturePending=false;self.captureMs.push(performance.now()-start-elapsed);self.captureLatencyMs.push(elapsed);if(self.captureMs.length>300)self.captureMs.shift();if(self.captureLatencyMs.length>300)self.captureLatencyMs.shift();
    const rgb=snap.background.match(/[\d.]+/g)||[0,0,0],light=(Number(rgb[0])*.2126+Number(rgb[1])*.7152+Number(rgb[2])*.0722)>145;document.body.classList.toggle('svg-liquid-light',light);
    self.host.afterRender(performance.now());self.requestFrame();
  };
  image.onerror=function(){URL.revokeObjectURL(url);self.capturePending=false;self.captureErrors.push('Current SVG snapshot could not be decoded');self.host.fallback('SVG optical source unavailable');};
  this.lastSnapshotBytes=snap.xml.length;this.lastCloneMs=performance.now()-start;image.src=url;
};
SVGLiquid.prototype.requestFrame=function(){if(this.artworkLoop||this.uiRAF||document.hidden)return;this.uiRAF=requestAnimationFrame(t=>{this.uiRAF=0;this.afterArtworkFrame(t);if(this.host.ui.busy())this.requestFrame();});};
SVGLiquid.prototype.afterArtworkFrame=function(now){if(!this.host||document.hidden)return;const state=this.host.ui.read(now);if(!state.simplified&&state.surfaces.length)this.capture(now);if(this.captureCount)this.host.afterRender(now);};
SVGLiquid.prototype.menu=function(open){const e=this.elements,h=this.host;if(!e.info.hidden)return;e.menuToggle.setAttribute('aria-expanded',String(open));e.menuToggle.setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');if(open){h.ui.open(e.menu,e.menuToggle);h.lock(e.menu);e.svgAbout.focus();}else h.ui.close(e.menu,()=>{h.unlock();e.menuToggle.focus();});this.requestFrame();};
SVGLiquid.prototype.info=function(title,text,direct){const e=this.elements,h=this.host;h.ui.hide(e.menu);e.menuToggle.setAttribute('aria-expanded','false');e.menuToggle.setAttribute('aria-label','補助メニューを開く');e.infoTitle.textContent=title;e.infoBody.replaceChildren();const p=document.createElement('p');p.textContent=text;e.infoBody.appendChild(p);if(direct){const a=document.createElement('a');a.href=location.href;a.target='_blank';a.rel='noopener';a.textContent='作品単独ページを開く';a.className='svgDirect';e.infoBody.appendChild(a);}h.ui.open(e.info,e.menuToggle);h.lock(e.info);e.closeInfo.focus();this.requestFrame();};
SVGLiquid.prototype.closeInfo=function(){this.host.ui.close(this.elements.info,()=>{this.host.unlock();this.elements.menuToggle.focus();});this.requestFrame();};
SVGLiquid.prototype.show=function(shown){this.shown=shown;const e=this.elements,h=this.host;h.ui.hide(e.menu);h.ui.hide(e.info);h.unlock();e.menuToggle.setAttribute('aria-expanded','false');e.back.hidden=e.menuToggle.hidden=!shown;e.showUI.hidden=shown;(shown?e.menuToggle:e.showUI).focus();this.requestFrame();};
SVGLiquid.prototype.report=function(){const sorted=this.captureLatencyMs.slice().sort((a,b)=>a-b);return {source:'sampled-current-native-svg',artworkRemainsNativeSVG:true,maxCaptureFPS:15,captures:this.captureCount,capturePending:this.capturePending,lastCloneMs:this.lastCloneMs,snapshotBytes:this.lastSnapshotBytes,latencyMedianMs:sorted[Math.floor(sorted.length*.5)]||0,latencyP95Ms:sorted[Math.floor(sorted.length*.95)]||0,captureErrors:this.captureErrors.slice(),host:this.host.report()};};
root.SVGLiquid=SVGLiquid;
})(window);
