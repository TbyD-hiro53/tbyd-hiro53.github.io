/* Shared reading/registry UI adaptation. Text, cards, anchors and storage stay original. */
(function(root){'use strict';
function start(){var body=document.body,content=document.querySelector('.wrap'),toc=document.getElementById('toc'),trigger=document.getElementById('tocBtn'),close=document.getElementById('tocX');if(!content||!toc||!root.H53LiquidHost)return;
var portal=!body.dataset.slug,scheduled=0,dirty=true,closing=false,previousFocus=null,rendering=false,lastError=null,source=new H53LiveDOMSource(content,invalidate),show=null;
body.classList.add('reader-liquid');toc.hidden=true;toc.setAttribute('role','dialog');function labelControls(){var en=portal&&document.documentElement.dataset.lang==='en';toc.setAttribute('aria-label',en?'Contents':'目次');close.setAttribute('aria-label',en?'Close contents':'目次を閉じる');}labelControls();
function surface(node,kind,anchor,parent){if(!node)return;node.dataset.h53Liquid=kind;if(anchor)node.dataset.h53LiquidAnchor=anchor;if(parent)node.dataset.h53LiquidParent=parent;}
surface(document.getElementById('h53idx'),'control');surface(document.getElementById('bar'),'control');if(portal)surface(trigger,'control');surface(toc,'panel','#tocBtn');toc.dataset.h53LiquidSuppression='0.72';surface(close,'control',null,'#toc');surface(document.getElementById('mark'),'panel','#bar');for(var language of document.querySelectorAll('.lang'))surface(language,'control');
if(!portal){show=document.createElement('button');show.id='readerShow';show.textContent='UIを表示';show.type='button';show.hidden=true;surface(show,'control');body.append(show);show.onclick=function(e){e.stopPropagation();body.classList.remove('hide');sync();};}
var host=new H53LiquidHost({root:body,source:source.canvas,requestFrame:requestFrame,backdropColor:[5/255,3/255,8/255]});
function requestFrame(){if(!scheduled)scheduled=requestAnimationFrame(frame);}
function invalidate(){dirty=true;requestFrame();}
function frame(t){scheduled=0;rendering=true;try{sync();if(dirty){source.rasterize();dirty=false;}host.afterRender(t);}catch(e){lastError=String(e);host.fallback(e);}rendering=false;if(host.ui.busy())requestFrame();}
function sync(){if(!portal){var hidden=body.classList.contains('hide');for(var id of ['bar','h53idx']){var n=document.getElementById(id);if(n&&n.hidden!==hidden)n.hidden=hidden;}if(show.hidden!==!hidden)show.hidden=!hidden;var mark=document.getElementById('mark');if(mark){var hideMark=!mark.classList.contains('on');if(mark.hidden!==hideMark)mark.hidden=hideMark;}}}
var oldOpen=trigger.onclick,oldClose=close.onclick;
trigger.onclick=function(e){if(closing||!toc.hidden)return;previousFocus=document.activeElement;if(oldOpen)oldOpen.call(trigger,e);toc.hidden=false;host.ui.open(toc,trigger);host.lock(toc);trigger.setAttribute('aria-expanded','true');close.focus({preventScroll:true});invalidate();};
function closeToc(done){if(closing||toc.hidden)return;closing=true;trigger.setAttribute('aria-expanded','false');host.ui.close(toc,function(){if(oldClose)oldClose.call(close,new Event('click'));else{toc.classList.remove('on');body.style.overflow='';}host.unlock();closing=false;if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});if(done)done();invalidate();});}
close.onclick=function(e){e.stopPropagation();closeToc();};
for(var link of toc.querySelectorAll('a'))(function(a){var old=a.onclick;a.onclick=function(e){if(portal)return;var href=a.getAttribute('href');e.preventDefault();e.stopPropagation();closeToc(function(){if(old)old.call(a,e);if(href&&href[0]==='#')location.hash=href;});};})(link);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!toc.hidden){e.preventDefault();e.stopImmediatePropagation();closeToc();}},true);
toc.addEventListener('click',function(e){e.stopPropagation();});show&&show.addEventListener('pointerdown',function(e){e.stopPropagation();});
for(var id of ['szDn','szUp','markGo','markNo','upBtn']){var button=document.getElementById(id);if(button){var original=button.onclick;(function(n,fn){n.onclick=function(e){if(fn)fn.call(n,e);sync();invalidate();};})(button,original);}}
for(var language of document.querySelectorAll('.lang'))language.addEventListener('click',function(){invalidate();});
addEventListener('scroll',invalidate,{passive:true});addEventListener('resize',invalidate,{passive:true});addEventListener('orientationchange',invalidate);document.addEventListener('visibilitychange',invalidate);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(invalidate);content.addEventListener('load',invalidate,true);
var observer=new MutationObserver(function(changes){var rescan=false,update=false;for(var m of changes){if(m.target===body){if(m.attributeName==='class'){sync();update=true;}continue;}if(m.target===document.documentElement){labelControls();update=true;continue;}if(content.contains(m.target)&&!(m.target.closest&&m.target.closest('.lang'))){rescan=rescan||m.type==='childList';update=true;}if(m.target.id==='mark')update=true;}if(rescan)source.scan();if(update){dirty=true;if(!rendering)requestFrame();}});
observer.observe(content,{subtree:true,childList:true,characterData:true});observer.observe(body,{attributes:true,attributeFilter:['class']});observer.observe(document.documentElement,{attributes:true,attributeFilter:['style','data-lang']});var mark=document.getElementById('mark');if(mark)observer.observe(mark,{attributes:true,attributeFilter:['class']});
root.__readerLiquid={host:host,source:source,invalidate:invalidate,report:function(){return {portal:portal,scheduled:!!scheduled,dirty:dirty,error:lastError,source:source.report(),host:host.report()};}};sync();invalidate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})(window);
