/* DOM/GL surface bridge. Geometry is in CSS px relative to the artwork canvas.
 * No artwork/RAF loop, click semantics, aria-expanded, or CSS layout ownership.
 */
(function(root){
  'use strict';
  const IDS=['back','timeToggle','menuToggle','showUI','menu','timeMenu','info','closeInfo'];
  const PANELS=new Set(['menu','timeMenu','info']);
  const MEDIA=['(prefers-reduced-motion: reduce)','(prefers-reduced-transparency: reduce)','(forced-colors: active)','(prefers-contrast: more)'];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const now=()=>performance.now();
  const finite=(x,fallback)=>Number.isFinite(x)?x:fallback;
  const copy=(out,r)=>{out[0]=r[0];out[1]=r[1];out[2]=r[2];out[3]=r[3];};
  const rect=(el,out)=>{const r=el.getBoundingClientRect();out[0]=r.left;out[1]=r.top;out[2]=r.width;out[3]=r.height;return out;};
  function visible(el){
    if(!el||!el.isConnected||el.hidden||el.closest('[hidden]'))return false;
    const s=getComputedStyle(el);
    return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0;
  }
  function radius(el,r){
    const value=getComputedStyle(el).borderTopLeftRadius.split(' ')[0],n=parseFloat(value);
    return Math.max(0,Math.min(Number.isFinite(n)?(value.includes('%')?Math.min(r[2],r[3])*n/100:n):0,r[2]/2,r[3]/2));
  }
  class CoastalGlassUI{
    constructor(onInvalidate){
      this.invalidate=typeof onInvalidate==='function'?onInvalidate:()=>{};
      this.records=new Map();this.pointers=new Map();this.surfaces=[];
      this.result={surfaces:this.surfaces,simplified:false};
      this.canvasRect=[0,0,0,0];this.anchorBounds=[0,0,0,0];this.disposed=false;this.lastNow=now();
      this.media=MEDIA.map(q=>matchMedia(q));
      this.onMedia=()=>{this.result.simplified=this.media.some(q=>q.matches);if(this.result.simplified){for(const r of this.records.values()){if(r.phase==='opening'||r.phase==='closing')this.finish(r);this.resetPress(r);}this.pointers.clear();}this.invalidate();};
      for(const q of this.media){if(q.addEventListener)q.addEventListener('change',this.onMedia);else q.addListener(this.onMedia);}
      this.result.simplified=this.media.some(q=>q.matches);
      this.onDown=e=>this.pointerDown(e);this.onUp=e=>this.pointerUp(e);this.onResize=()=>this.invalidate();
      document.addEventListener('pointerdown',this.onDown,true);
      window.addEventListener('pointerup',this.onUp,true);window.addEventListener('pointercancel',this.onUp,true);
      window.addEventListener('resize',this.onResize);window.addEventListener('orientationchange',this.onResize);
      document.addEventListener('fullscreenchange',this.onResize);document.addEventListener('webkitfullscreenchange',this.onResize);
      if(window.visualViewport)window.visualViewport.addEventListener('resize',this.onResize);
      this.discover();
    }
    discover(){for(const id of IDS){const el=document.getElementById(id);if(el&&!this.records.has(el))this.record(el);}}
    record(el){
      let r=this.records.get(el);if(r)return r;
      r={el,panel:PANELS.has(el.id),phase:el.hidden?'hidden':'idle',timer:0,pressTimer:0,done:null,
        anchor:[0,0,44,44],anchorRadius:22,anchorEl:null,anchorUV:[.5,.5],anchorSize:[44,44],anchorBaseRadius:22,anchorBasis:[0,0,1,1],from:[0,0,0,0],target:[0,0,0,0],current:[0,0,0,0],
        radius:0,radiusFrom:0,start:0,duration:300,strength:1,strengthFrom:1,content:1,contentFrom:1,
        mix:PANELS.has(el.id)?1:0,mixFrom:0,opacityStyle:el.style.opacity,scaleStyle:el.style.scale,pressValue:0,pressFrom:0,pressTo:0,pressStart:0,pressDuration:100,
        surface:{rect:[0,0,0,0],radius:0,kind:PANELS.has(el.id)?'panel':'control',panelMix:PANELS.has(el.id)?1:0,press:[.5,.5,0],opacity:1,transition:1}};
      this.records.set(el,r);return r;
    }
    snapshotAnchor(r,anchor){
      r.anchorEl=null;
      if(anchor&&typeof anchor.getBoundingClientRect==='function'){
        rect(anchor,r.anchor);r.anchorRadius=radius(anchor,r.anchor);r.anchorEl=anchor;
      }else if(anchor&&Number.isFinite(anchor.x)&&Number.isFinite(anchor.y)){
        const w=finite(anchor.width,44),h=finite(anchor.height,44);
        r.anchor[0]=anchor.x-(Number.isFinite(anchor.width)?0:w/2);
        r.anchor[1]=anchor.y-(Number.isFinite(anchor.height)?0:h/2);
        r.anchor[2]=Math.max(1,w);r.anchor[3]=Math.max(1,h);r.anchorRadius=Math.min(r.anchor[2],r.anchor[3])/2;
      }else{
        const canvas=document.getElementById('canvas')||document.querySelector('canvas');
        const b=canvas?canvas.getBoundingClientRect():{left:0,top:0,width:innerWidth,height:innerHeight};
        r.anchor[0]=b.left+b.width/2-22;r.anchor[1]=b.top+b.height/2-22;r.anchor[2]=r.anchor[3]=44;r.anchorRadius=22;
      }
      // Snapshot survives hidden triggers. Normalized center allows rotation.
      if(r.anchor[2]<=0||r.anchor[3]<=0){r.anchor[2]=r.anchor[3]=44;r.anchorRadius=22;}
      this.canvasBounds(r.anchorBasis);
      r.anchorUV[0]=clamp((r.anchor[0]+r.anchor[2]/2-r.anchorBasis[0])/Math.max(1,r.anchorBasis[2]));
      r.anchorUV[1]=clamp((r.anchor[1]+r.anchor[3]/2-r.anchorBasis[1])/Math.max(1,r.anchorBasis[3]));
      r.anchorSize[0]=r.anchor[2];r.anchorSize[1]=r.anchor[3];r.anchorBaseRadius=r.anchorRadius;
    }
    canvasBounds(out){
      const canvas=document.getElementById('canvas')||document.querySelector('canvas');
      if(canvas)return rect(canvas,out);
      out[0]=out[1]=0;out[2]=innerWidth;out[3]=innerHeight;return out;
    }
    refreshAnchor(r){
      if(r.anchorEl&&visible(r.anchorEl)){rect(r.anchorEl,r.anchor);r.anchorRadius=radius(r.anchorEl,r.anchor);return;}
      const b=this.canvasBounds(this.anchorBounds);
      const w=Math.max(1,Math.min(r.anchorSize[0],Math.max(1,b[2]-8))),h=Math.max(1,Math.min(r.anchorSize[1],Math.max(1,b[3]-8)));
      const cx=b[0]+r.anchorUV[0]*b[2],cy=b[1]+r.anchorUV[1]*b[3];
      r.anchor[0]=Math.max(b[0],Math.min(b[0]+b[2]-w,cx-w/2));r.anchor[1]=Math.max(b[1],Math.min(b[1]+b[3]-h,cy-h/2));
      r.anchor[2]=w;r.anchor[3]=h;r.anchorRadius=Math.min(r.anchorBaseRadius,w/2,h/2);
    }
    cancel(r){clearTimeout(r.timer);r.timer=0;r.done=null;}
    open(el,anchor){
      if(this.disposed||!el)return;
      const r=this.record(el),t=now(),wasActive=(r.phase==='opening'||r.phase==='closing');
      if(wasActive)this.update(r,t);
      const wasVisible=visible(el)&&r.phase!=='hidden';
      this.cancel(r);
      // Preserve the old snapshot when reversing without a new anchor.
      if(anchor||!wasActive)this.snapshotAnchor(r,anchor);
      el.hidden=false;r.panel=true;r.surface.kind='panel';
      rect(el,r.target);
      if(wasVisible&&wasActive){copy(r.from,r.current);r.radiusFrom=r.radius;r.mixFrom=r.mix;r.contentFrom=r.content;}
      else if(wasVisible){copy(r.from,r.target);r.radiusFrom=radius(el,r.target);r.mixFrom=1;r.contentFrom=1;}
      else{copy(r.from,r.anchor);r.radiusFrom=r.anchorRadius;r.mixFrom=0;r.contentFrom=0;}
      r.strengthFrom=1;r.mix=r.mixFrom;
      r.phase='opening';r.start=t;copy(r.current,r.from);r.radius=r.radiusFrom;r.content=r.contentFrom;r.strength=r.strengthFrom;
      el.style.opacity=String(r.content);
      if(this.result.simplified)this.finish(r);
      else r.timer=setTimeout(()=>{if(r.phase==='opening')this.finish(r);},r.duration+25);
      this.invalidate();
    }
    close(el,onDone){
      if(this.disposed||!el){if(typeof onDone==='function')onDone();return;}
      const r=this.record(el),t=now();
      if(r.phase==='opening'||r.phase==='closing')this.update(r,t);
      else{rect(el,r.current);r.radius=radius(el,r.current);r.content=1;r.strength=1;}
      this.cancel(r);this.refreshAnchor(r);r.done=typeof onDone==='function'?onDone:null;
      if(!visible(el)){r.phase='closing';this.finish(r);return;}
      copy(r.from,r.current);r.radiusFrom=r.radius;r.strengthFrom=1;r.mixFrom=r.mix;r.contentFrom=r.content;
      r.phase='closing';r.start=t;
      if(this.result.simplified)this.finish(r);
      else r.timer=setTimeout(()=>{if(r.phase==='closing')this.finish(r);},r.duration+25);
      this.invalidate();
    }
    finish(r){
      clearTimeout(r.timer);r.timer=0;
      const closing=r.phase==='closing',done=closing?r.done:null;r.done=null;
      r.phase=closing?'hidden':'idle';r.el.hidden=closing;r.el.style.opacity=r.opacityStyle;
      r.content=closing?0:1;r.strength=closing?0:1;r.mix=closing?0:1;
      if(!closing){rect(r.el,r.current);r.radius=radius(r.el,r.current);}
      else this.resetPress(r);
      this.invalidate();if(done)done();
    }
    hide(el){
      if(!el)return;const r=this.record(el);this.cancel(r);r.phase='hidden';r.content=r.strength=r.mix=0;
      el.hidden=true;el.style.opacity=r.opacityStyle;this.resetPress(r);
      for(const [id,target] of this.pointers)if(target===r)this.pointers.delete(id);
      this.invalidate();
    }
    update(r,t){
      if(r.phase!=='opening'&&r.phase!=='closing')return;
      const opening=r.phase==='opening',p=clamp((t-r.start)/r.duration),e=smooth(p);
      if(opening)rect(r.el,r.target);else{this.refreshAnchor(r);copy(r.target,r.anchor);}
      for(let i=0;i<4;i++)r.current[i]=r.from[i]+(r.target[i]-r.from[i])*e;
      const targetRadius=opening?radius(r.el,r.target):r.anchorRadius;
      r.radius=r.radiusFrom+(targetRadius-r.radiusFrom)*e;
      r.strength=1;r.mix=r.mixFrom+((opening?1:0)-r.mixFrom)*e;
      const contentEase=opening?smooth((p-.4)/.6):smooth(p/.55);
      r.content=r.contentFrom+((opening?1:0)-r.contentFrom)*contentEase;
      r.el.style.opacity=String(r.content);
      if(p>=1)this.finish(r);
    }
    pressAt(r,t){
      const p=clamp((t-r.pressStart)/r.pressDuration);
      r.pressValue=r.pressFrom+(r.pressTo-r.pressFrom)*smooth(p);
      if(!r.panel)r.el.style.scale=r.pressValue>.0001?String(1-.025*r.pressValue):r.scaleStyle;
      r.surface.press[2]=this.result.simplified?0:r.pressValue;
    }
    setPress(r,value,t){
      this.pressAt(r,t);clearTimeout(r.pressTimer);r.pressFrom=r.pressValue;r.pressTo=value;r.pressStart=t;r.pressDuration=value?85:170;
      if(this.result.simplified){this.resetPress(r);return;}
      r.pressTimer=setTimeout(()=>{this.pressAt(r,r.pressStart+r.pressDuration);r.pressTimer=0;this.invalidate();},r.pressDuration+20);
      this.invalidate();
    }
    resetPress(r){clearTimeout(r.pressTimer);r.pressTimer=0;r.pressValue=r.pressFrom=r.pressTo=0;r.surface.press[2]=0;r.el.style.scale=r.scaleStyle;}
    pointerDown(e){
      if(this.disposed||this.result.simplified||e.button!==0)return;
      this.discover();let hit=null;
      for(const el of e.composedPath()){const r=this.records.get(el);if(r){hit=r;break;}}
      if(!hit||!visible(hit.el)||hit.el.disabled||hit.el.closest('[inert]')||hit.phase==='closing')return;
      const b=hit.el.getBoundingClientRect();if(!b.width||!b.height)return;
      hit.surface.press[0]=clamp((e.clientX-b.left)/b.width);hit.surface.press[1]=clamp((e.clientY-b.top)/b.height);
      this.pointers.set(e.pointerId,hit);this.setPress(hit,1,now());
    }
    pointerUp(e){
      const r=this.pointers.get(e.pointerId);if(!r)return;this.pointers.delete(e.pointerId);
      for(const target of this.pointers.values())if(target===r)return;
      this.setPress(r,0,now());
    }
    read(time){
      if(this.disposed)return this.result;
      const t=finite(time,now());this.lastNow=t;this.discover();
      this.canvasBounds(this.canvasRect);
      for(const r of this.records.values()){this.update(r,t);this.pressAt(r,t);}
      this.surfaces.length=0;
      // Controls first, then panels, then the stable panel's close control.
      for(let pass=0;pass<3;pass++)for(const r of this.records.values()){
        if((r.el.id==='closeInfo'?2:r.panel?1:0)!==pass||!visible(r.el))continue;
        if(r.el.id==='closeInfo'){const panel=this.records.get(document.getElementById('info'));if(!panel||panel.phase!=='idle'||!visible(panel.el))continue;}
        if(!r.panel){let covered=false;for(const panel of this.records.values())if(panel.panel&&panel.anchorEl===r.el&&(panel.phase==='opening'||panel.phase==='closing')){covered=true;break;}if(covered)continue;}
        if(r.phase!=='opening'&&r.phase!=='closing'){rect(r.el,r.current);r.radius=radius(r.el,r.current);r.strength=1;r.mix=r.panel?1:0;}
        if(r.current[2]<=0||r.current[3]<=0)continue;
        const s=r.surface;s.rect[0]=r.current[0]-this.canvasRect[0];s.rect[1]=r.current[1]-this.canvasRect[1];s.rect[2]=r.current[2];s.rect[3]=r.current[3];
        s.radius=r.radius;s.opacity=1;s.transition=1;s.panelMix=r.panel?r.mix:0;
        this.surfaces.push(s);
      }
      return this.result;
    }
    busy(){
      if(this.disposed)return false;
      for(const r of this.records.values())if(r.phase==='opening'||r.phase==='closing'||Math.abs(r.pressValue-r.pressTo)>.0001)return true;
      return false;
    }
    report(){
      return {simplified:this.result.simplified,busy:this.busy(),surfaceCount:this.surfaces.length,
        states:Array.from(this.records.values(),r=>({id:r.el.id,phase:r.phase,hidden:r.el.hidden,contentOpacity:r.content,strength:r.strength,panelMix:r.mix,press:r.pressValue,anchor:r.anchor.slice(),rect:r.surface.rect.slice()}))};
    }
    dispose(){
      if(this.disposed)return;this.disposed=true;
      document.removeEventListener('pointerdown',this.onDown,true);window.removeEventListener('pointerup',this.onUp,true);window.removeEventListener('pointercancel',this.onUp,true);
      window.removeEventListener('resize',this.onResize);window.removeEventListener('orientationchange',this.onResize);document.removeEventListener('fullscreenchange',this.onResize);document.removeEventListener('webkitfullscreenchange',this.onResize);
      if(window.visualViewport)window.visualViewport.removeEventListener('resize',this.onResize);
      for(const q of this.media){if(q.removeEventListener)q.removeEventListener('change',this.onMedia);else q.removeListener(this.onMedia);}
      for(const r of this.records.values()){this.cancel(r);this.resetPress(r);r.el.style.opacity=r.opacityStyle;}
      this.pointers.clear();this.surfaces.length=0;
    }
  }
  root.CoastalGlassUI=CoastalGlassUI;
})(globalThis);
