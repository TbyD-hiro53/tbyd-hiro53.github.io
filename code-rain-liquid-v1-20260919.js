/* Code Rain family adapter. Canvas2D artwork is the live source; no artwork drawing here. */
(function(root){'use strict';
function CodeRainLiquid(options){
  this.options=options;this.paused=false;this.needsDraw=false;this.shown=true;this.returnFocus=null;
  const holder=document.createElement('div');holder.id='crLiquidControls';
  holder.innerHTML='<a id="back" href="index.html" aria-label="registry">← index</a><button id="menuToggle" type="button" aria-label="補助メニューを開く" aria-expanded="false" aria-controls="menu">•••</button><button id="showUI" type="button" aria-label="操作を表示" hidden>UI</button><div id="menu" class="h53-liquid-menu" role="dialog" aria-label="補助メニュー" hidden><button id="crAbout" type="button">作品説明</button><button id="crPause" type="button" aria-pressed="false">一時停止</button><button id="crFullscreen" type="button" aria-pressed="false">全画面</button><button id="crHide" type="button">UIを隠す</button><button id="crCloseMenu" type="button">閉じる</button></div><section id="info" role="dialog" aria-labelledby="infoTitle" hidden><h1 id="infoTitle"></h1><div id="infoBody" class="h53-liquid-scroll"></div><button id="closeInfo" type="button" aria-label="説明を閉じる">×</button></section>';
  document.body.appendChild(holder);document.body.classList.add('code-rain-liquid');
  this.elements={};for(const el of holder.querySelectorAll('[id]'))this.elements[el.id]=el;
  const el=this.elements,self=this;
  // Verification links keep the existing opt-out when following the normal return path.
  if(location.search.indexOf('skipgc')>=0)el.back.search='?skipgc';
  this.host=new H53LiquidHost({root:document.body,source:options.canvas,requestFrame:options.requestFrame,backdropColor:[0,0,0],night:true,
    surfaces:[{selector:'#back,#menuToggle,#showUI',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
  el.menuToggle.onclick=function(){self.menu(el.menu.hidden);};
  el.crCloseMenu.onclick=function(){self.menu(false);};
  el.crAbout.onclick=function(){const title=document.querySelector('meta[property="og:title"]');self.info(title?title.content.split(' — ')[0]:document.title,document.querySelector('meta[name="description"]').content);};
  el.closeInfo.onclick=function(){self.closeInfo();};
  el.crPause.onclick=function(){self.paused=!self.paused;el.crPause.textContent=self.paused?'再開':'一時停止';el.crPause.setAttribute('aria-pressed',String(self.paused));options.onPauseChange(self.paused);options.requestFrame();};
  el.crFullscreen.onclick=function(){self.host.fullscreen(el.crFullscreen,function(){self.info('全画面表示','この環境ではブラウザの全画面表示を開始できない。作品単独ページで表示領域いっぱいに鑑賞できるが、OSやブラウザの操作欄は消せない場合がある。',true);});};
  el.crHide.onclick=function(){self.show(false);};el.showUI.onclick=function(){self.show(true);};
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      if(!el.info.hidden){e.preventDefault();self.closeInfo();}
      else if(!el.menu.hidden){e.preventDefault();self.menu(false);}
      else if(!self.shown){e.preventDefault();self.show(true);}
    }
  });
  document.addEventListener('visibilitychange',function(){options.onVisibilityChange();if(!document.hidden)options.requestFrame();});
  this.host.requestFrame();
}
CodeRainLiquid.prototype.menu=function(open){
  const e=this.elements,h=this.host;
  if(!e.info.hidden)return;
  e.menuToggle.setAttribute('aria-expanded',String(open));e.menuToggle.setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');
  if(open){h.ui.open(e.menu,e.menuToggle);h.lock(e.menu);e.crAbout.focus();}
  else h.ui.close(e.menu,()=>{h.unlock();e.menuToggle.focus();});
  this.options.requestFrame();
};
CodeRainLiquid.prototype.info=function(title,text,direct){
  const e=this.elements,h=this.host;this.returnFocus=e.menuToggle;
  h.ui.hide(e.menu);e.menuToggle.setAttribute('aria-expanded','false');e.menuToggle.setAttribute('aria-label','補助メニューを開く');
  e.infoTitle.textContent=title;e.infoBody.replaceChildren();const p=document.createElement('p');p.textContent=text;e.infoBody.appendChild(p);
  if(direct){const a=document.createElement('a');a.href=location.href;a.target='_blank';a.rel='noopener';a.textContent='作品単独ページを開く';a.className='crDirect';e.infoBody.appendChild(a);}
  h.ui.open(e.info,e.menuToggle);h.lock(e.info);e.closeInfo.focus();this.options.requestFrame();
};
CodeRainLiquid.prototype.closeInfo=function(){const self=this;this.host.ui.close(this.elements.info,function(){self.host.unlock();(self.returnFocus||self.elements.menuToggle).focus();});this.options.requestFrame();};
CodeRainLiquid.prototype.show=function(shown){
  this.shown=shown;const e=this.elements,h=this.host;h.ui.hide(e.menu);h.ui.hide(e.info);h.unlock();e.menuToggle.setAttribute('aria-expanded','false');
  for(const item of [e.back,e.menuToggle].concat(Array.from(document.querySelectorAll('.hud,#hint'))))item.hidden=!shown;
  e.showUI.hidden=shown;(shown?e.menuToggle:e.showUI).focus();this.options.requestFrame();
};
CodeRainLiquid.prototype.isUIEvent=function(event){return this.host.blocked||performance.now()<this.host.blockedUntil||!!(event.target&&event.target.closest&&event.target.closest('#crLiquidControls'));};
CodeRainLiquid.prototype.afterRender=function(now){this.host.afterRender(now);};
CodeRainLiquid.prototype.busy=function(){return this.host.ui.busy();};
CodeRainLiquid.prototype.report=function(){return {paused:this.paused,shown:this.shown,artwork:this.options.state(),host:this.host.report()};};
root.CodeRainLiquid=CodeRainLiquid;
})(window);
