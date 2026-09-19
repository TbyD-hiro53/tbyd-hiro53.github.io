/* h!ro53 Liquid Glass DOM bridge, derived from approved Coastal Glass observation v3.
 * Opt-in only: no artwork clock, layout, focus, click semantics or animation loop ownership.
 * Host render loop calls read(performance.now()); onInvalidate schedules that same loop.
 */
(function(root){
  'use strict';
  var MEDIA=['(prefers-reduced-motion: reduce)','(prefers-reduced-transparency: reduce)','(forced-colors: active)','(prefers-contrast: more)'];
  var clamp=function(x){return Math.max(0,Math.min(1,x));};
  var smooth=function(x){x=clamp(x);return x*x*(3-2*x);};
  var now=function(){return performance.now();};
  var finite=function(x,fallback){return Number.isFinite(x)?x:fallback;};
  var copy=function(out,r){for(var i=0;i<4;i++)out[i]=r[i];};
  var rect=function(el,out){var r=el.getBoundingClientRect();out[0]=r.left;out[1]=r.top;out[2]=r.width;out[3]=r.height;return out;};
  function visible(el){
    if(!el||!el.isConnected||el.hidden||el.closest('[hidden]'))return false;
    var s=getComputedStyle(el);
    return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0;
  }
  function radius(el,r){
    var value=getComputedStyle(el).borderTopLeftRadius.split(' ')[0],n=parseFloat(value);
    return Math.max(0,Math.min(Number.isFinite(n)?(value.includes('%')?Math.min(r[2],r[3])*n/100:n):0,r[2]/2,r[3]/2));
  }
  function writeStyle(el,key,value){if(el.style[key]!==value)el.style[key]=value;}
  function H53LiquidUI(config){
    if(typeof config==='function')config={onInvalidate:config};
    this.config=config||{};this.scope=this.resolve(this.config.root)||document.body;
    this.canvas=this.resolve(this.config.canvas)||this.scope.querySelector('canvas');
    this.invalidate=typeof this.config.onInvalidate==='function'?this.config.onInvalidate:function(){};
    this.records=new Map();this.pointers=new Map();this.surfaces=[];this.clipCache=new Map();this.clipStyleCache=new Map();
    this.result={surfaces:this.surfaces,simplified:false};this.canvasRect=[0,0,0,0];this.anchorBounds=[0,0,0,0];
    this.disposed=false;this.lastNow=now();this.opticsReady=!!this.config.opticsReady;
    this.forcedSimplified=this.config.simplified===true;this.selector=this.config.selector||'[data-h53-liquid]';
    this.media=MEDIA.map(function(q){return matchMedia(q);});
    this.onMedia=this.updateMode.bind(this);
    for(var q of this.media){if(q.addEventListener)q.addEventListener('change',this.onMedia);else q.addListener(this.onMedia);}
    this.onDown=this.pointerDown.bind(this);this.onUp=this.pointerUp.bind(this);
    this.onResize=this.invalidate.bind(this);this.onBlur=this.releasePointers.bind(this);this.onScroll=this.scrollInvalidate.bind(this);
    document.addEventListener('pointerdown',this.onDown,true);document.addEventListener('scroll',this.onScroll,true);
    window.addEventListener('pointerup',this.onUp,true);window.addEventListener('pointercancel',this.onUp,true);
    window.addEventListener('blur',this.onBlur);window.addEventListener('resize',this.onResize);window.addEventListener('orientationchange',this.onResize);
    document.addEventListener('fullscreenchange',this.onResize);document.addEventListener('webkitfullscreenchange',this.onResize);
    if(window.visualViewport){window.visualViewport.addEventListener('resize',this.onResize);window.visualViewport.addEventListener('scroll',this.onResize);}
    var self=this;
    this.observer=new MutationObserver(function(changes){
      if(self.disposed)return;
      var invalidate=false;
      for(var mutation of changes){
        if(!self.relatedMutation(mutation))continue;
        if(mutation.type==='childList'){invalidate=true;continue;}
        var record=self.records.get(mutation.target);
        // Our opacity/scale writes during a finite animation need no extra loop.
        if(mutation.attributeName==='style'&&record&&(record.phase==='opening'||record.phase==='closing'||record.pressTimer))continue;
        invalidate=true;
      }
      if(invalidate){self.discover();self.reconcile();self.invalidate();}
    });
    this.scope.classList.add('h53-liquid-host');
    this.discover();this.updateMode();
    this.observer.observe(this.scope,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','style','data-h53-liquid','data-h53-liquid-anchor','data-h53-liquid-parent','data-h53-liquid-suppression']});
  }
  H53LiquidUI.prototype.resolve=function(value){
    if(value&&typeof value.getBoundingClientRect==='function')return value;
    if(typeof value==='string')return document.querySelector(value);
    return null;
  };
  H53LiquidUI.prototype.register=function(el,options){
    el=this.resolve(el);if(!el)return null;options=options||{};
    var r=this.records.get(el);
    if(r){if(options.anchor)r.anchorSource=options.anchor;if(options.parent)r.parentSource=options.parent;if(!el.classList.contains('h53-liquid-surface'))el.classList.add('h53-liquid-surface');var kindClass=r.panel?'h53-liquid-panel':'h53-liquid-control';if(!el.classList.contains(kindClass))el.classList.add(kindClass);return r;}
    var panel=(options.kind||el.dataset.h53Liquid)==='panel';
    r={el:el,id:options.id||el.id||'surface-'+this.records.size,panel:panel,phase:visible(el)?'idle':'hidden',timer:0,pressTimer:0,done:null,
      anchorSource:options.anchor||el.dataset.h53LiquidAnchor||null,parentSource:options.parent||el.dataset.h53LiquidParent||null,
      anchor:[0,0,44,44],anchorRadius:22,anchorEl:null,anchorUV:[.5,.5],anchorSize:[44,44],anchorBaseRadius:22,anchorBasis:[0,0,1,1],from:[0,0,0,0],target:[0,0,0,0],current:[0,0,0,0],
      radius:0,radiusFrom:0,start:0,duration:finite(options.duration,finite(this.config.duration,300)),strength:1,strengthFrom:1,content:1,contentFrom:1,
      mix:panel?1:0,mixFrom:0,opacityStyle:el.style.opacity,scaleStyle:el.style.scale,pressValue:0,pressFrom:0,pressTo:0,pressStart:0,pressDuration:100,
      hadSurface:el.classList.contains('h53-liquid-surface'),hadKind:el.classList.contains(panel?'h53-liquid-panel':'h53-liquid-control'),
      surface:{rect:[0,0,0,0],clipRect:[0,0,0,0],radius:0,kind:panel?'panel':'control',panelMix:panel?1:0,press:[.5,.5,0],opacity:1,transition:1}};
    this.records.set(el,r);el.classList.add('h53-liquid-surface',panel?'h53-liquid-panel':'h53-liquid-control');
    return r;
  };
  H53LiquidUI.prototype.discover=function(){
    if(this.disposed)return;
    for(var el of this.scope.querySelectorAll(this.selector))this.register(el);
    for(var entry of this.config.surfaces||[]){
      var options=typeof entry==='string'?{selector:entry}:entry;
      if(options.element)this.register(options.element,options);
      else if(options.selector)for(var node of this.scope.querySelectorAll(options.selector))this.register(node,options);
    }
    for(var item of this.records){if(!item[0].isConnected){this.cancel(item[1]);this.resetPress(item[1]);this.records.delete(item[0]);}}
  };
  H53LiquidUI.prototype.relatedMutation=function(mutation){
    var target=mutation.target;
    // Decorative artwork DOM and per-frame canvas styles are not UI invalidations.
    // A registered surface's content, or an ancestor hiding/moving it, is relevant.
    for(var r of this.records.values()){
      if(target===r.el||r.el.contains(target))return true;
      if(mutation.type!=='childList'&&target.contains&&target.contains(r.el))return true;
    }
    if(mutation.type==='attributes'){
      if(mutation.attributeName.indexOf('data-h53-liquid')===0)return true;
      return false;
    }
    var selectors=[this.selector];
    for(var entry of this.config.surfaces||[]){var selector=typeof entry==='string'?entry:entry.selector;if(selector)selectors.push(selector);}
    for(var node of Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes))){
      if(node.nodeType!==1)continue;
      for(var selector of selectors)if(node.matches(selector)||node.querySelector(selector))return true;
      for(var r of this.records.values())if(node===r.el||node.contains(r.el))return true;
    }
    return false;
  };
  H53LiquidUI.prototype.reconcile=function(){
    for(var r of this.records.values()){
      // Legacy direct hide always wins. Never resurrect a panel hidden by its owner.
      if(!visible(r.el)&&(r.phase!=='hidden')){
        this.cancel(r);r.phase='hidden';r.content=r.strength=r.mix=0;writeStyle(r.el,'opacity',r.opacityStyle);this.resetPress(r);
      }else if(visible(r.el)&&r.phase==='hidden'){
        // Direct legacy show is tracked but intentionally not invented as a morph.
        r.phase='idle';r.content=r.strength=1;r.mix=r.panel?1:0;
      }
    }
  };
  H53LiquidUI.prototype.updateMode=function(){
    this.result.simplified=this.forcedSimplified||this.media.some(function(q){return q.matches;});
    if(this.result.simplified){for(var r of this.records.values()){if(r.phase==='opening'||r.phase==='closing')this.finish(r);this.resetPress(r);}this.pointers.clear();}
    this.scope.classList.toggle('h53-liquid-ready',this.opticsReady&&!this.result.simplified);
    this.scope.classList.toggle('h53-liquid-simple',this.result.simplified||!this.opticsReady);
    this.invalidate();
  };
  H53LiquidUI.prototype.setOpticsReady=function(ready){this.opticsReady=!!ready;this.updateMode();};
  H53LiquidUI.prototype.setSimplified=function(value){this.forcedSimplified=!!value;this.updateMode();};
  H53LiquidUI.prototype.canvasBounds=function(out){
    if(this.canvas&&this.canvas.isConnected)return rect(this.canvas,out);
    out[0]=out[1]=0;out[2]=innerWidth;out[3]=innerHeight;return out;
  };
  H53LiquidUI.prototype.snapshotAnchor=function(r,anchor){
    r.anchorEl=null;anchor=this.resolve(anchor)||anchor;
    if(anchor&&typeof anchor.getBoundingClientRect==='function'){
      rect(anchor,r.anchor);r.anchorRadius=radius(anchor,r.anchor);r.anchorEl=anchor;
    }else if(anchor&&Number.isFinite(anchor.x)&&Number.isFinite(anchor.y)){
      var w=finite(anchor.width,44),h=finite(anchor.height,44);
      r.anchor[0]=anchor.x-(Number.isFinite(anchor.width)?0:w/2);r.anchor[1]=anchor.y-(Number.isFinite(anchor.height)?0:h/2);
      r.anchor[2]=Math.max(1,w);r.anchor[3]=Math.max(1,h);r.anchorRadius=Math.min(r.anchor[2],r.anchor[3])/2;
    }else{
      var b=this.canvasBounds(this.anchorBounds);r.anchor[0]=b[0]+b[2]/2-22;r.anchor[1]=b[1]+b[3]/2-22;r.anchor[2]=r.anchor[3]=44;r.anchorRadius=22;
    }
    if(r.anchor[2]<=0||r.anchor[3]<=0){r.anchor[2]=r.anchor[3]=44;r.anchorRadius=22;}
    this.canvasBounds(r.anchorBasis);
    r.anchorUV[0]=clamp((r.anchor[0]+r.anchor[2]/2-r.anchorBasis[0])/Math.max(1,r.anchorBasis[2]));
    r.anchorUV[1]=clamp((r.anchor[1]+r.anchor[3]/2-r.anchorBasis[1])/Math.max(1,r.anchorBasis[3]));
    r.anchorSize[0]=r.anchor[2];r.anchorSize[1]=r.anchor[3];r.anchorBaseRadius=r.anchorRadius;
  };
  H53LiquidUI.prototype.refreshAnchor=function(r){
    if(r.anchorEl&&visible(r.anchorEl)){rect(r.anchorEl,r.anchor);r.anchorRadius=radius(r.anchorEl,r.anchor);return;}
    var b=this.canvasBounds(this.anchorBounds),w=Math.max(1,Math.min(r.anchorSize[0],Math.max(1,b[2]-8))),h=Math.max(1,Math.min(r.anchorSize[1],Math.max(1,b[3]-8)));
    var cx=b[0]+r.anchorUV[0]*b[2],cy=b[1]+r.anchorUV[1]*b[3];
    r.anchor[0]=Math.max(b[0],Math.min(b[0]+b[2]-w,cx-w/2));r.anchor[1]=Math.max(b[1],Math.min(b[1]+b[3]-h,cy-h/2));
    r.anchor[2]=w;r.anchor[3]=h;r.anchorRadius=Math.min(r.anchorBaseRadius,w/2,h/2);
  };
  H53LiquidUI.prototype.cancel=function(r){clearTimeout(r.timer);r.timer=0;r.done=null;};
  H53LiquidUI.prototype.open=function(el,anchor){
    el=this.resolve(el);if(this.disposed||!el)return;
    var r=this.register(el,{kind:'panel'}),t=now(),active=r.phase==='opening'||r.phase==='closing';
    if(active)this.update(r,t);var wasVisible=visible(el)&&r.phase!=='hidden';this.cancel(r);
    if(anchor||!active)this.snapshotAnchor(r,anchor||r.anchorSource);
    el.hidden=false;r.panel=true;r.surface.kind='panel';rect(el,r.target);
    if(wasVisible&&active){copy(r.from,r.current);r.radiusFrom=r.radius;r.mixFrom=r.mix;r.contentFrom=r.content;}
    else if(wasVisible){copy(r.from,r.target);r.radiusFrom=radius(el,r.target);r.mixFrom=1;r.contentFrom=1;}
    else{copy(r.from,r.anchor);r.radiusFrom=r.anchorRadius;r.mixFrom=0;r.contentFrom=0;}
    r.strengthFrom=1;r.mix=r.mixFrom;r.phase='opening';r.start=t;copy(r.current,r.from);r.radius=r.radiusFrom;r.content=r.contentFrom;r.strength=1;
    writeStyle(el,'opacity',String(r.content));var self=this;
    if(this.result.simplified)this.finish(r);else r.timer=setTimeout(function(){if(r.phase==='opening')self.finish(r);},r.duration+25);
    this.invalidate();
  };
  H53LiquidUI.prototype.close=function(el,onDone){
    el=this.resolve(el);if(this.disposed||!el){if(typeof onDone==='function')onDone();return;}
    var r=this.register(el,{kind:'panel'}),t=now();
    if(r.phase==='opening'||r.phase==='closing')this.update(r,t);else{rect(el,r.current);r.radius=radius(el,r.current);r.content=1;r.strength=1;}
    this.cancel(r);this.refreshAnchor(r);r.done=typeof onDone==='function'?onDone:null;
    if(!visible(el)){r.phase='closing';this.finish(r);return;}
    copy(r.from,r.current);r.radiusFrom=r.radius;r.strengthFrom=1;r.mixFrom=r.mix;r.contentFrom=r.content;r.phase='closing';r.start=t;
    var self=this;if(this.result.simplified)this.finish(r);else r.timer=setTimeout(function(){if(r.phase==='closing')self.finish(r);},r.duration+25);
    this.invalidate();
  };
  H53LiquidUI.prototype.finish=function(r){
    clearTimeout(r.timer);r.timer=0;var closing=r.phase==='closing',done=closing?r.done:null;r.done=null;
    r.phase=closing?'hidden':'idle';r.el.hidden=closing;writeStyle(r.el,'opacity',r.opacityStyle);
    r.content=closing?0:1;r.strength=closing?0:1;r.mix=closing?0:1;
    if(!closing){rect(r.el,r.current);r.radius=radius(r.el,r.current);}else this.resetPress(r);
    this.invalidate();if(done)done();
  };
  H53LiquidUI.prototype.hide=function(el){
    el=this.resolve(el);if(!el)return;var r=this.register(el);this.cancel(r);r.phase='hidden';r.content=r.strength=r.mix=0;
    el.hidden=true;writeStyle(el,'opacity',r.opacityStyle);this.resetPress(r);
    for(var pair of this.pointers)if(pair[1]===r)this.pointers.delete(pair[0]);this.invalidate();
  };
  H53LiquidUI.prototype.update=function(r,t){
    if(r.phase!=='opening'&&r.phase!=='closing')return;
    // An external hide is authoritative even when a previous open timeout exists.
    if(r.el.hidden||r.el.closest('[hidden]')){this.cancel(r);r.phase='hidden';r.content=r.strength=r.mix=0;writeStyle(r.el,'opacity',r.opacityStyle);return;}
    var opening=r.phase==='opening',p=clamp((t-r.start)/Math.max(1,r.duration)),e=smooth(p);
    if(opening)rect(r.el,r.target);else{this.refreshAnchor(r);copy(r.target,r.anchor);}
    for(var i=0;i<4;i++)r.current[i]=r.from[i]+(r.target[i]-r.from[i])*e;
    var targetRadius=opening?radius(r.el,r.target):r.anchorRadius;r.radius=r.radiusFrom+(targetRadius-r.radiusFrom)*e;
    r.strength=1;r.mix=r.mixFrom+((opening?1:0)-r.mixFrom)*e;
    var contentEase=opening?smooth((p-.4)/.6):smooth(p/.55);r.content=r.contentFrom+((opening?1:0)-r.contentFrom)*contentEase;
    writeStyle(r.el,'opacity',String(r.content));if(p>=1)this.finish(r);
  };
  H53LiquidUI.prototype.pressAt=function(r,t){
    var p=clamp((t-r.pressStart)/r.pressDuration);r.pressValue=r.pressFrom+(r.pressTo-r.pressFrom)*smooth(p);
    if(!r.panel)writeStyle(r.el,'scale',r.pressValue>.0001?String(1-.025*r.pressValue):r.scaleStyle);
    r.surface.press[2]=this.result.simplified?0:r.pressValue;
  };
  H53LiquidUI.prototype.setPress=function(r,value,t){
    this.pressAt(r,t);clearTimeout(r.pressTimer);r.pressFrom=r.pressValue;r.pressTo=value;r.pressStart=t;r.pressDuration=value?85:170;
    if(this.result.simplified){this.resetPress(r);return;}
    var self=this;r.pressTimer=setTimeout(function(){self.pressAt(r,r.pressStart+r.pressDuration);r.pressTimer=0;self.invalidate();},r.pressDuration+20);this.invalidate();
  };
  H53LiquidUI.prototype.resetPress=function(r){clearTimeout(r.pressTimer);r.pressTimer=0;r.pressValue=r.pressFrom=r.pressTo=0;r.surface.press[2]=0;writeStyle(r.el,'scale',r.scaleStyle);};
  H53LiquidUI.prototype.pointerDown=function(e){
    if(this.disposed||this.result.simplified||e.button!==0)return;
    this.discover();var hit=null;
    for(var el of e.composedPath()){var r=this.records.get(el);if(r){hit=r;break;}}
    if(!hit||!visible(hit.el)||hit.el.disabled||hit.el.closest('[inert]')||hit.phase==='closing')return;
    var b=hit.el.getBoundingClientRect();if(!b.width||!b.height)return;
    hit.surface.press[0]=clamp((e.clientX-b.left)/b.width);hit.surface.press[1]=clamp((e.clientY-b.top)/b.height);
    this.pointers.set(e.pointerId,hit);this.setPress(hit,1,now());
  };
  H53LiquidUI.prototype.pointerUp=function(e){
    var r=this.pointers.get(e.pointerId);if(!r)return;this.pointers.delete(e.pointerId);
    for(var target of this.pointers.values())if(target===r)return;this.setPress(r,0,now());
  };
  H53LiquidUI.prototype.releasePointers=function(){
    for(var r of this.pointers.values())this.setPress(r,0,now());this.pointers.clear();
  };
  H53LiquidUI.prototype.scrollInvalidate=function(event){
    var target=event.target;
    if(target===document){this.invalidate();return;}
    for(var r of this.records.values())if(target===r.el||(target.contains&&target.contains(r.el))||r.el.contains(target)){this.invalidate();return;}
  };
  H53LiquidUI.prototype.clipStyle=function(el){var style=this.clipStyleCache.get(el);if(!style){style=getComputedStyle(el);this.clipStyleCache.set(el,style);}return style;};
  H53LiquidUI.prototype.viewportFixed=function(el){
    if(this.clipStyle(el).position!=='fixed')return false;
    for(var parent=el.parentElement;parent;parent=parent.parentElement){var style=this.clipStyle(parent);
      if(style.transform!=='none'||style.perspective!=='none'||style.filter!=='none'||/(paint|layout|strict|content)/.test(style.contain)||/(transform|perspective|filter)/.test(style.willChange))return false;
    }
    return true;
  };
  H53LiquidUI.prototype.ancestorClip=function(parent){
    var viewport=this.canvasRect;
    if(!parent)return [viewport[0],viewport[1],viewport[0]+viewport[2],viewport[1]+viewport[3]];
    var cached=this.clipCache.get(parent);if(cached)return cached;
    var bounds=this.viewportFixed(parent)?[viewport[0],viewport[1],viewport[0]+viewport[2],viewport[1]+viewport[3]]:this.ancestorClip(parent.parentElement).slice(),style=this.clipStyle(parent);
    var clipsX=/^(hidden|auto|scroll|clip)$/.test(style.overflowX),clipsY=/^(hidden|auto|scroll|clip)$/.test(style.overflowY);
    if(clipsX||clipsY){
      var box=parent.getBoundingClientRect(),sx=parent.offsetWidth?box.width/parent.offsetWidth:1,sy=parent.offsetHeight?box.height/parent.offsetHeight:1;
      var left=box.left+parent.clientLeft*sx,top=box.top+parent.clientTop*sy,right=left+parent.clientWidth*sx,bottom=top+parent.clientHeight*sy;
      if(clipsX){bounds[0]=Math.max(bounds[0],left);bounds[2]=Math.min(bounds[2],right);}
      if(clipsY){bounds[1]=Math.max(bounds[1],top);bounds[3]=Math.min(bounds[3],bottom);}
    }
    this.clipCache.set(parent,bounds);return bounds;
  };
  H53LiquidUI.prototype.read=function(time){
    if(this.disposed)return this.result;var t=finite(time,now());this.lastNow=t;this.discover();this.reconcile();this.canvasBounds(this.canvasRect);this.clipCache.clear();this.clipStyleCache.clear();
    for(var r of this.records.values()){this.update(r,t);this.pressAt(r,t);}this.surfaces.length=0;
    for(var pass=0;pass<3;pass++)for(var item of this.records.values()){
      if((item.parentSource?2:item.panel?1:0)!==pass||!visible(item.el))continue;
      if(item.parentSource){var parent=this.records.get(this.resolve(item.parentSource));if(!parent||parent.phase!=='idle'||!visible(parent.el))continue;}
      if(!item.panel){var covered=false;for(var panel of this.records.values())if(panel.panel&&panel.anchorEl===item.el&&(panel.phase==='opening'||panel.phase==='closing')){covered=true;break;}if(covered)continue;}
      if(item.phase!=='opening'&&item.phase!=='closing'){rect(item.el,item.current);item.radius=radius(item.el,item.current);item.strength=1;item.mix=item.panel?1:0;}
      if(item.current[2]<=0||item.current[3]<=0)continue;
      var s=item.surface;s.rect[0]=item.current[0]-this.canvasRect[0];s.rect[1]=item.current[1]-this.canvasRect[1];s.rect[2]=item.current[2];s.rect[3]=item.current[3];
      var clip=this.viewportFixed(item.el)?[this.canvasRect[0],this.canvasRect[1],this.canvasRect[0]+this.canvasRect[2],this.canvasRect[1]+this.canvasRect[3]]:this.ancestorClip(item.el.parentElement);s.clipRect[0]=clip[0]-this.canvasRect[0];s.clipRect[1]=clip[1]-this.canvasRect[1];s.clipRect[2]=Math.max(0,clip[2]-clip[0]);s.clipRect[3]=Math.max(0,clip[3]-clip[1]);
      if(!s.clipRect[2]||!s.clipRect[3])continue;
      s.suppression=Math.min(.8,clamp(finite(parseFloat(item.el.dataset.h53LiquidSuppression),0)));
      s.radius=item.radius;s.opacity=1;s.transition=1;s.panelMix=item.panel?item.mix:0;this.surfaces.push(s);
    }
    return this.result;
  };
  H53LiquidUI.prototype.busy=function(){
    if(this.disposed)return false;for(var r of this.records.values())if(r.phase==='opening'||r.phase==='closing'||Math.abs(r.pressValue-r.pressTo)>.0001)return true;return false;
  };
  H53LiquidUI.prototype.report=function(){
    return {simplified:this.result.simplified,opticsReady:this.opticsReady,busy:this.busy(),surfaceCount:this.surfaces.length,ownedRAF:false,
      states:Array.from(this.records.values(),function(r){return {id:r.id,phase:r.phase,hidden:r.el.hidden,contentOpacity:r.content,strength:r.strength,panelMix:r.mix,press:r.pressValue,anchor:r.anchor.slice(),rect:r.surface.rect.slice(),clipRect:r.surface.clipRect.slice()};})};
  };
  H53LiquidUI.prototype.dispose=function(){
    if(this.disposed)return;this.disposed=true;this.observer.disconnect();
    document.removeEventListener('pointerdown',this.onDown,true);document.removeEventListener('scroll',this.onScroll,true);window.removeEventListener('pointerup',this.onUp,true);window.removeEventListener('pointercancel',this.onUp,true);
    window.removeEventListener('blur',this.onBlur);window.removeEventListener('resize',this.onResize);window.removeEventListener('orientationchange',this.onResize);
    document.removeEventListener('fullscreenchange',this.onResize);document.removeEventListener('webkitfullscreenchange',this.onResize);
    if(window.visualViewport){window.visualViewport.removeEventListener('resize',this.onResize);window.visualViewport.removeEventListener('scroll',this.onResize);}
    for(var q of this.media){if(q.removeEventListener)q.removeEventListener('change',this.onMedia);else q.removeListener(this.onMedia);}
    for(var r of this.records.values()){this.cancel(r);this.resetPress(r);writeStyle(r.el,'opacity',r.opacityStyle);if(!r.hadSurface)r.el.classList.remove('h53-liquid-surface');if(!r.hadKind)r.el.classList.remove(r.panel?'h53-liquid-panel':'h53-liquid-control');}
    this.scope.classList.remove('h53-liquid-host','h53-liquid-ready','h53-liquid-simple');this.pointers.clear();this.surfaces.length=0;
  };
  root.H53LiquidUI=H53LiquidUI;
})(window);
