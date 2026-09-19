/* Opt-in host for the Coastal Glass derived material. No artwork clock ownership. */
(function(root){'use strict';
function H53LiquidHost(options){
  this.options=options||{};this.source=this.options.source;this.requestFrame=this.options.requestFrame||function(){};
  this.root=this.options.root||document.body;this.overlay=document.createElement('canvas');this.overlay.className='h53-liquid-overlay';
  this.overlay.setAttribute('aria-hidden','true');this.root.appendChild(this.overlay);this.failed=false;this.blocked=null;this.blockedUntil=0;
  this.samples=[];this.frames=0;this.ui=new H53LiquidUI({root:this.root,canvas:this.overlay,surfaces:this.options.surfaces||[],onInvalidate:this.requestFrame});
  this.opticsOptions={canvas:this.overlay,maxPixels:this.options.maxPixels||1250000,maxDpr:this.options.maxDpr||2,onContextLost:()=>this.fallback(),onContextRestored:()=>this.restore()};
  try{this.optics=new H53LiquidGlassOptics(this.opticsOptions);}catch(e){this.fallback(e);}
  this.onGuard=e=>{
    if(!this.blocked&&performance.now()>=this.blockedUntil)return;
    if(this.blocked&&this.blocked.contains(e.target))return;
    if(e.type==='keydown'&&e.key==='Escape')return;
    e.preventDefault();e.stopImmediatePropagation();
  };
  for(const kind of ['pointerdown','pointermove','pointerup','mousedown','mouseup','click','touchstart','touchmove','touchend','wheel'])document.addEventListener(kind,this.onGuard,{capture:true,passive:false});
  this.onKey=e=>{
    if(!this.blocked)return;
    if(e.key==='Tab'){
      const nodes=Array.from(this.blocked.querySelectorAll('button,a,input,select,[tabindex="0"]')).filter(n=>!n.disabled&&!n.closest('[hidden]')&&n.getClientRects().length);
      if(!nodes.length){e.preventDefault();return;}
      const index=nodes.indexOf(document.activeElement),next=e.shiftKey?(index<=0?nodes.length-1:index-1):(index+1)%nodes.length;
      e.preventDefault();nodes[next].focus();
    }else if(e.key!=='Escape'&&!this.blocked.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
  };
  document.addEventListener('keydown',this.onKey,true);
}
H53LiquidHost.prototype.fallback=function(error){this.failed=true;this.overlay.hidden=true;this.ui.setOpticsReady(false);this.error=error?String(error):'UI optical context unavailable';};
H53LiquidHost.prototype.restore=function(){try{if(this.optics)this.optics.dispose();this.optics=new H53LiquidGlassOptics(this.opticsOptions);this.failed=false;this.error=null;this.overlay.hidden=false;this.requestFrame();}catch(e){this.fallback(e);}};
H53LiquidHost.prototype.afterRender=function(now){
  const start=performance.now(),source=typeof this.source==='function'?this.source():this.source;
  if(!source||!source.width||!source.height)return;
  const state=this.ui.read(now||start);
  if(!this.failed&&this.optics){
    try{
      if(state.simplified){this.overlay.hidden=true;}
      else{
        this.overlay.hidden=false;if(!this.optics.capture(source))throw new Error('UI optical source capture unavailable');
        if(!this.ui.opticsReady)this.ui.setOpticsReady(true);
        const bounds=source.getBoundingClientRect(),viewport=this.overlay.getBoundingClientRect();
        this.optics.draw(state.surfaces,{cssWidth:viewport.width,cssHeight:viewport.height,sourceRect:[bounds.left-viewport.left,bounds.top-viewport.top,bounds.width,bounds.height],backdropColor:this.options.backdropColor||[.0353,.0431,.0627],night:typeof this.options.night==='function'?this.options.night():!!this.options.night});
      }
    }catch(e){this.fallback(e);}
  }
  this.frames++;this.samples.push(performance.now()-start);if(this.samples.length>600)this.samples.shift();
};
H53LiquidHost.prototype.lock=function(panel){this.blocked=panel;this.root.classList.add('h53-liquid-reading');panel.setAttribute('aria-modal','true');};
H53LiquidHost.prototype.unlock=function(){if(this.blocked)this.blocked.removeAttribute('aria-modal');this.blocked=null;this.blockedUntil=performance.now()+220;this.root.classList.remove('h53-liquid-reading');};
H53LiquidHost.prototype.report=function(){const sorted=this.samples.slice().sort((a,b)=>a-b);return {frames:this.frames,error:this.error||null,blocked:!!this.blocked,ui:this.ui.report(),optics:this.optics?this.optics.report():null,submitMedianMs:sorted[Math.floor(sorted.length*.5)]||0,submitP95Ms:sorted[Math.floor(sorted.length*.95)]||0};};
H53LiquidHost.prototype.fullscreen=function(button,onUnavailable){
  const target=document.documentElement,active=document.fullscreenElement||document.webkitFullscreenElement;
  this.fullscreenButton=button;
  const change=()=>{const enabled=!!(document.fullscreenElement||document.webkitFullscreenElement),current=this.fullscreenButton;if(current){current.textContent=enabled?'全画面を解除':'全画面';current.setAttribute('aria-pressed',String(enabled));}this.requestFrame();};
  if(!this.onFullscreen){this.onFullscreen=change;document.addEventListener('fullscreenchange',change);document.addEventListener('webkitfullscreenchange',change);}
  try{
    const call=active?(document.exitFullscreen||document.webkitExitFullscreen):(target.requestFullscreen||target.webkitRequestFullscreen);
    if(!call){if(onUnavailable)onUnavailable();return;}
    const result=call.call(active?document:target);
    if(result&&result.catch)result.catch(()=>{if(onUnavailable)onUnavailable();change();});
  }catch(e){if(onUnavailable)onUnavailable();change();}
};
root.H53LiquidHost=H53LiquidHost;
})(window);
