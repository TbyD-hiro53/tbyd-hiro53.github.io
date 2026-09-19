/* Direct-render/custom-post UI adapter. Derived from the approved Coastal material
 * and the composer family shell. Original packed work IIFEs own their scenes. */
(function(root){'use strict';
var active=null;
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text)e.textContent=text;return e;}
function boot(){
 var slug=location.pathname.split('/').pop().replace('.html',''),spec={cyberwafer:{title:'Cyberwafer v25',buttons:['eraB0','eraB1']},object:{title:'Object',buttons:['bg','reset']},cellwafer:{title:'Cellwafer v1',buttons:['cvBtn']},'empyrean-sigil-3d':{title:'Empyrean Sigil 3D',buttons:['bgbtn']}}[slug];
 if(!spec)return;var canvas=document.querySelector('canvas:not(.h53-liquid-overlay)');if(!canvas)return;
 var body=document.body,oldNodes=document.querySelectorAll('.ui,#uiTop,#uiBot,#h53idx,#bgbtn');
 for(var n of oldNodes){n.setAttribute('aria-hidden','true');n.inert=true;}
 var shell=el('div',{class:'legacy-three-shell'}),top=el('div',{class:'legacy-three-top'}),back=el('a',{id:'legacyThreeBack',href:'index.html'+(location.search.indexOf('skipgc')>=0?'?skipgc':''),'data-h53-liquid':'control','aria-label':'作品一覧へ戻る'},'戻る'),toggle=el('button',{id:'legacyThreeToggle',type:'button','data-h53-liquid':'control','aria-expanded':'false','aria-controls':'legacyThreeMenu'},'メニュー');
 top.append(back,toggle);var title=el('div',{class:'legacy-three-title'});title.append(el('strong',{},spec.title),el('small',{},'h!ro53 · deus ex machina'));
 var panel=el('aside',{id:'legacyThreeMenu',class:'h53-liquid-menu','data-h53-liquid':'panel','data-h53-liquid-anchor':'#legacyThreeToggle',role:'dialog','aria-labelledby':'legacyThreeHeading',hidden:''}),header=el('header',{}),heading=el('h2',{id:'legacyThreeHeading'},'メニュー'),close=el('button',{id:'legacyThreeClose',type:'button','data-h53-liquid':'control','data-h53-liquid-parent':'#legacyThreeMenu','aria-label':'閉じる'},'×'),content=el('div',{id:'legacyThreeContent',class:'h53-liquid-scroll'}),show=el('button',{id:'legacyThreeShow',type:'button','data-h53-liquid':'control',hidden:''},'UIを表示');
 header.append(heading,close);panel.append(header,content);shell.append(top,title,panel,show);body.append(shell);body.classList.add('legacy-three-liquid');
 var primary=el('div',{id:'legacyThreePrimary',class:'h53-primary-controls',role:'group','aria-label':'作品の操作'});shell.append(primary);
 var host=new H53LiquidHost({root:body,source:canvas,backdropColor:[0,0,0]}),mirrors=[],closing=false,hidden=false,view='menu',lastState=null;
 function closePanel(done){if(closing||panel.hidden)return;closing=true;toggle.setAttribute('aria-expanded','false');host.ui.close(panel,function(){host.unlock();closing=false;toggle.focus({preventScroll:true});if(done)done();});}
 function row(label,fn,id){var b=el('button',{type:'button'},label);if(id)b.dataset.legacyId=id;b.addEventListener('click',function(e){e.stopPropagation();fn(b);});content.appendChild(b);return b;}
 function sync(){for(var m of mirrors){var label=m.source.textContent.trim().replace(/\s+/g,' ');if(m.button.textContent!==label)m.button.textContent=label;m.button.disabled=m.source.disabled;var pressed=m.source.hasAttribute('aria-pressed')?m.source.getAttribute('aria-pressed'):String(m.source.classList.contains('on'));if(m.button.getAttribute('aria-pressed')!==pressed)m.button.setAttribute('aria-pressed',pressed);}}
 function message(label,text){view='information';heading.textContent=label;content.replaceChildren();content.appendChild(el('p',{},text));row('メニューへ戻る',menu);}
 function primaryControls(){
  for(var id of spec.buttons){var original=document.getElementById(id);if(!original)continue;(function(control){var b=row(control.textContent,function(){var locked=host.blocked,until=host.blockedUntil;try{host.blocked=null;host.blockedUntil=0;control.dispatchEvent(new MouseEvent('click',{bubbles:false,cancelable:true}));}finally{host.blocked=locked;host.blockedUntil=until;}sync();},control.id);b.dataset.h53Liquid='control';primary.append(b);mirrors.push({source:control,button:b});})(original);}
 }
 primaryControls();sync();
 function menu(){view='menu';heading.textContent='メニュー';content.replaceChildren();
  row('作品について',function(){var d=document.querySelector('meta[name="description"]');message(spec.title,d?d.content:'h!ro53 / deus ex machina');});
  var full=row('全画面',function(b){host.fullscreen(b,function(){message('全画面表示','このブラウザまたは埋め込み枠では、ブラウザ全画面を利用できない。作品を単独で開いてもOSやブラウザの操作欄が残る場合がある。');var a=el('a',{href:location.pathname+(location.search.includes('skipgc')?'?skipgc':''),target:'_blank',rel:'noopener'},'作品単独ページを開く');content.appendChild(a);});});var fullscreenActive=!!(document.fullscreenElement||document.webkitFullscreenElement);full.textContent=fullscreenActive?'全画面を解除':'全画面';full.setAttribute('aria-pressed',String(fullscreenActive));
  row('UIを隠す',function(){closePanel(function(){hidden=true;primary.hidden=true;top.hidden=true;title.hidden=true;show.hidden=false;body.classList.add('legacy-three-ui-hidden');show.focus({preventScroll:true});});});sync();
 }
 toggle.addEventListener('click',function(){if(!panel.hidden||closing)return;menu();host.ui.open(panel,toggle);host.lock(panel);toggle.setAttribute('aria-expanded','true');close.focus({preventScroll:true});});
 close.addEventListener('click',function(e){e.stopPropagation();closePanel();});show.addEventListener('click',function(){hidden=false;primary.hidden=false;top.hidden=false;title.hidden=false;show.hidden=true;body.classList.remove('legacy-three-ui-hidden');toggle.focus({preventScroll:true});});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){e.preventDefault();closePanel();}});
 for(var kind of ['pointerdown','pointerup','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','wheel'])shell.addEventListener(kind,function(e){e.stopPropagation();},{passive:true});
 active={host:host,canvas:canvas,report:function(){return {slug:slug,view:view,hidden:hidden,state:lastState,buttons:mirrors.map(function(x){return {id:x.source.id,label:x.button.textContent,pressed:x.button.getAttribute('aria-pressed')};}),host:host.report()};},afterRender:function(renderer,state){lastState=state;if(!hidden)sync();host.afterRender(performance.now());}};
 root.__legacyThreeLiquid=active;
}
root.H53LegacyThreeLiquid={afterRender:function(renderer,state){if(active)active.afterRender(renderer,state);}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})(window);
