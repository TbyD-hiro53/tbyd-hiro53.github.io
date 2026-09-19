/* Shared UI adapter for eight existing EffectComposer artworks. Original scenes,
 * clocks, color pipelines and handlers remain owned by their original IIFEs. */
(function(root){'use strict';
var current=null;
function el(tag,props,text){var n=document.createElement(tag);for(var k in props)n.setAttribute(k,props[k]);if(text)n.textContent=text;return n;}
function start(){
 var canvas=document.querySelector('#app canvas');if(!canvas||!root.H53LiquidHost)return;
 var body=document.body,slug=location.pathname.split('/').pop().replace('.html','');
 var title=(document.querySelector('meta[property="og:image:alt"]')||{}).content||document.title.split(' — ')[0];
 var description=(document.querySelector('meta[name="description"]')||{}).content||'';
 var prior=document.querySelectorAll('.ui,.hud,.stack,.zoomwrap,#h53idx');for(var n of prior){n.setAttribute('aria-hidden','true');n.inert=true;}
 var shell=el('div',{class:'composer-shell'}),top=el('div',{class:'composer-top'}),back=el('a',{id:'composerBack',href:'index.html'+(location.search.indexOf('skipgc')>=0?'?skipgc':''),'data-h53-liquid':'control','aria-label':'作品一覧へ戻る'},'戻る'),toggle=el('button',{id:'composerToggle',type:'button','data-h53-liquid':'control','aria-expanded':'false','aria-controls':'composerMenu'},'メニュー');
 top.append(back,toggle);var name=el('div',{class:'composer-title'});name.append(el('strong',{},title),el('small',{},'h!ro53 · deus ex machina'));
 var panel=el('section',{id:'composerMenu',class:'h53-liquid-menu','data-h53-liquid':'panel','data-h53-liquid-anchor':'#composerToggle',role:'dialog','aria-labelledby':'composerMenuTitle',hidden:''}),head=el('header',{}),heading=el('h2',{id:'composerMenuTitle'},'メニュー'),close=el('button',{id:'composerMenuClose',type:'button','data-h53-liquid':'control','data-h53-liquid-parent':'#composerMenu','aria-label':'閉じる'},'×'),content=el('div',{id:'composerMenuContent',class:'h53-liquid-scroll'}),show=el('button',{id:'composerShow',type:'button','data-h53-liquid':'control',hidden:''},'UIを表示');
 head.append(heading,close);panel.append(head,content);shell.append(top,name,panel,show);body.append(shell);body.classList.add('composer-liquid');
 var source=canvas,staging=null,cineTop=document.getElementById('cinetop'),cineBottom=document.getElementById('cinebot'),cineFade=document.getElementById('cinefade');
 var bg=(getComputedStyle(body).backgroundColor.match(/[\d.]+/g)||[0,0,0]).slice(0,3).map(function(x){return Number(x)/255;});
 var host=new H53LiquidHost({root:body,source:function(){return source;},backdropColor:bg,night:false});
 var hidden=false,closing=false,view='menu',mirrors=[],stat=null,zoomMirror=null,zoomSource=document.getElementById('zoom');
 var primary=el('div',{id:'composerPrimary',class:'h53-primary-controls',role:'group','aria-label':'作品の操作'});shell.append(primary);
 function closePanel(done){if(closing)return;closing=true;toggle.setAttribute('aria-expanded','false');host.ui.close(panel,function(){host.unlock();closing=false;toggle.focus({preventScroll:true});if(done)done();});}
 function action(text,fn,id){var button=el('button',{type:'button'},text);if(id)button.dataset.legacyId=id;button.addEventListener('click',function(e){e.stopPropagation();fn(button);});content.append(button);return button;}
 function sync(){
  for(var entry of mirrors){var original=entry.source,b=entry.button,txt=original.textContent.trim();if(b.textContent!==txt)b.textContent=txt;b.disabled=original.disabled;b.hidden=original.classList.contains('cinehide');var on=original.classList.contains('on');if(b.getAttribute('aria-pressed')!==String(on))b.setAttribute('aria-pressed',String(on));}
  if(stat){var ids=['viewname','eraname','ttl','rd','dev'],texts=[];for(var id of ids){var node=document.getElementById(id);if(node&&node.textContent.trim()&&(id!=='dev'||node.classList.contains('on')))texts.push(node.textContent.trim());}var text=texts.join('\n');if(stat.textContent!==text)stat.textContent=text;}
  if(zoomMirror&&zoomSource){if(document.activeElement!==zoomMirror)zoomMirror.value=zoomSource.value;zoomMirror.parentElement.hidden=!!zoomSource.closest('.cinehide');}
 }
 function primaryControls(){
  for(var id of ['sw','reset','spin','tour','era','dp','fr']){var original=document.getElementById(id);if(!original)continue;(function(control){var button=action(control.textContent,function(){if(typeof control.onclick==='function')control.onclick.call(control,new Event('click'));sync();},control.id);button.dataset.h53Liquid='control';primary.append(button);mirrors.push({source:control,button:button});})(original);}
  if(zoomSource){var label=el('label',{class:'composer-zoom'},'遠 ⟷ 近');zoomMirror=el('input',{type:'range',min:zoomSource.min,max:zoomSource.max,step:zoomSource.step||'1',value:zoomSource.value,'aria-label':'遠近'});zoomMirror.addEventListener('input',function(){zoomSource.value=this.value;zoomSource.dispatchEvent(new Event('input',{bubbles:true}));});label.append(zoomMirror);primary.append(label);}
  stat=el('div',{class:'composer-state','aria-live':'off'});sync();
 }
 primaryControls();
 function menu(){view='menu';heading.textContent='メニュー';content.replaceChildren();content.append(stat);
  action('作品について',about);var fullButton=action('全画面',function(button){host.fullscreen(button,function(){message('全画面表示','このブラウザでは作品コンテナを全画面化できない。通常表示で鑑賞できる。OS・ブラウザの操作欄は、この作品から非表示にできない。');});});fullButton.dataset.composerFullscreen='';syncFullscreen();
  action('UIを隠す',function(){closePanel(function(){hidden=true;primary.hidden=true;top.hidden=true;name.hidden=true;show.hidden=false;show.focus({preventScroll:true});});});
 }
 function syncFullscreen(){var button=content.querySelector('[data-composer-fullscreen]');if(button){var active=!!(document.fullscreenElement||document.webkitFullscreenElement);button.textContent=active?'全画面を解除':'全画面';button.setAttribute('aria-pressed',String(active));}}
 document.addEventListener('fullscreenchange',syncFullscreen);document.addEventListener('webkitfullscreenchange',syncFullscreen);
 function message(label,text){view='about';heading.textContent=label;content.replaceChildren();content.append(el('p',{},text));action('メニューへ戻る',menu);}
 function about(){var text=description,hint=document.querySelector('.hint'),obs=document.querySelector('.obs');if(hint&&hint.textContent.trim())text+='\n\n'+hint.textContent.trim();if(obs&&obs.textContent.trim())text+='\n\n'+obs.textContent.trim();message(title,text);}
 toggle.addEventListener('click',function(){if(!panel.hidden||closing)return;menu();host.ui.open(panel,toggle);host.lock(panel);toggle.setAttribute('aria-expanded','true');close.focus({preventScroll:true});});
 close.addEventListener('click',function(e){e.stopPropagation();closePanel();});show.addEventListener('click',function(){hidden=false;primary.hidden=false;top.hidden=false;name.hidden=false;show.hidden=true;toggle.focus({preventScroll:true});});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){e.preventDefault();closePanel();}});
 // Stop UI-originated legacy window gestures while allowing each DOM control's own handler.
 for(var kind of ['pointerdown','pointerup','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','wheel'])shell.addEventListener(kind,function(e){e.stopPropagation();},{passive:true});
 function prepareSource(){source=canvas;if(!cineTop)return;var cb=canvas.getBoundingClientRect(),fade=Number(getComputedStyle(cineFade).opacity)||0,rects=[cineTop,cineBottom].map(function(n){return n.getBoundingClientRect();}),active=fade>0||rects.some(function(r){return r.bottom>0&&r.top<innerHeight;});if(!active)return;
  if(!staging){staging=document.createElement('canvas');staging.getBoundingClientRect=function(){return canvas.getBoundingClientRect();};}
  if(staging.width!==canvas.width||staging.height!==canvas.height){staging.width=canvas.width;staging.height=canvas.height;}
  var ctx=staging.getContext('2d',{alpha:false}),sx=canvas.width/cb.width,sy=canvas.height/cb.height;ctx.globalAlpha=1;ctx.drawImage(canvas,0,0);ctx.fillStyle='#000';
  if(fade>0){ctx.globalAlpha=fade;ctx.fillRect(0,0,staging.width,staging.height);ctx.globalAlpha=1;}
  for(var r of rects)ctx.fillRect((r.left-cb.left)*sx,(r.top-cb.top)*sy,r.width*sx,r.height*sy);source=staging;
 }
 current={host:host,canvas:canvas,slug:slug,report:function(){return {slug:slug,view:view,hidden:hidden,legacy:mirrors.map(function(x){return {id:x.source.id,text:x.button.textContent,disabled:x.button.disabled,on:x.button.getAttribute('aria-pressed')};}),host:host.report()};},afterRender:function(){prepareSource();if(!hidden)sync();host.afterRender(performance.now());}};
 root.__composerLiquid=current;
}
root.H53ComposerLiquid={afterRender:function(){if(current)current.afterRender();}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})(window);
