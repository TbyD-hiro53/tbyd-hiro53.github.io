/* UI adapter only. The r3 scene owns its clock, camera, render loop and color pipeline. */
(function(root){'use strict';
var byId=function(id){return document.getElementById(id);},shown=true,menuOpen=false,infoClosing=false,artCanvas=null;
var photoCanvas=document.createElement('canvas'),photoKey='',photoDraws=0;
photoCanvas.className='chrome-liquid-photo-source';photoCanvas.setAttribute('aria-hidden','true');document.body.appendChild(photoCanvas);
var photoContext=photoCanvas.getContext('2d',{alpha:false});
var host=new H53LiquidHost({root:document.body,source:function(){return document.body.classList.contains('photographic')?photoCanvas:artCanvas;},backdropColor:[13/255,16/255,18/255],surfaces:[
 {selector:'#back,#menuToggle,#showUI',kind:'control'},
 {selector:'#editionPicker',kind:'control'},
 {selector:'#menu',kind:'panel',anchor:'#menuToggle'},
 {selector:'#info',kind:'panel',anchor:'#menuToggle'},
 {selector:'#closeInfo',kind:'control',parent:'#info'}
]});
function blocked(){return !!host.blocked||performance.now()<host.blockedUntil;}
function menu(on){
 if(blocked())return;menuOpen=on;byId('menuToggle').setAttribute('aria-expanded',String(on));byId('menuToggle').setAttribute('aria-label',on?'補助メニューを閉じる':'補助メニューを開く');
 if(on){host.ui.open(byId('menu'),byId('menuToggle'));byId('pause').focus({preventScroll:true});}
 else host.ui.close(byId('menu'));
}
function closeMenuImmediately(){menuOpen=false;host.ui.hide(byId('menu'));byId('menuToggle').setAttribute('aria-expanded','false');byId('menuToggle').setAttribute('aria-label','補助メニューを開く');}
function fullUnavailable(){
 closeMenuImmediately();byId('infoTitle').textContent='全画面表示';byId('infoBody').replaceChildren();
 var p=document.createElement('p');p.textContent='このブラウザ、または埋め込み枠では全画面表示を開始できない。作品は利用できる画面全体に表示している。OSやブラウザの操作欄が残る場合がある。';byId('infoBody').appendChild(p);
 var a=document.createElement('a');a.href=location.href;a.target='_blank';a.rel='noopener';a.textContent='作品単独ページを開く';byId('infoBody').appendChild(a);
 host.ui.open(byId('info'),byId('menuToggle'));host.lock(byId('info'));byId('closeInfo').focus({preventScroll:true});
}
function closeInfo(){
 if(infoClosing||byId('info').hidden)return;infoClosing=true;
 host.ui.close(byId('info'),function(){infoClosing=false;host.unlock();byId('menuToggle').focus({preventScroll:true});});
}
function setShown(on){
 if(blocked())return;shown=on;closeMenuImmediately();document.body.classList.toggle('chrome-ui-hidden',!on);byId('showUI').hidden=on;
 (on?byId('menuToggle'):byId('showUI')).focus({preventScroll:true});
}
byId('menuToggle').addEventListener('click',function(){menu(!menuOpen);});
byId('fullscreen').addEventListener('click',function(){if(!blocked())host.fullscreen(byId('fullscreen'),fullUnavailable);});
byId('hideUI').addEventListener('click',function(){setShown(false);});byId('showUI').addEventListener('click',function(){setShown(true);});
byId('closeInfo').addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();closeInfo();});
window.addEventListener('keydown',function(e){if(e.key!=='Escape')return;if(!byId('info').hidden){e.preventDefault();closeInfo();}else if(menuOpen){e.preventDefault();menu(false);byId('menuToggle').focus();}else if(!shown)setShown(true);});
function drawPhoto(){
 var image=byId('photograph'),width=Math.max(1,Math.round(innerWidth*Math.min(devicePixelRatio||1,1.5))),height=Math.max(1,Math.round(innerHeight*Math.min(devicePixelRatio||1,1.5))),key=image.currentSrc+'|'+image.naturalWidth+'|'+width+'x'+height;
 if(!image.complete||!image.naturalWidth)return false;
 if(photoKey!==key){photoKey=key;photoCanvas.width=width;photoCanvas.height=height;photoContext.fillStyle='#0d1012';photoContext.fillRect(0,0,width,height);var scale=Math.min(width/image.naturalWidth,height/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;photoContext.drawImage(image,(width-w)/2,(height-h)/2,w,h);photoDraws++;}
 return true;
}
root.ChromeLiturgyLiquid={
 afterRender:function(now,canvas){artCanvas=canvas;host.afterRender(now);},
 afterPhoto:function(now){if(drawPhoto())host.afterRender(now);},
 report:function(){var r=host.report();r.shown=shown;r.menuOpen=menuOpen;r.photoDraws=photoDraws;r.source=document.body.classList.contains('photographic')?'display-sRGB-current-photo':'display-sRGB-current-WebGL-frame';return r;},
 host:host
};
})(window);
