/* Direct artwork controls and collision-free flow layout. No rendering or clock ownership. */
(function(){'use strict';
var slug=location.pathname.split('/').pop().replace('.html',''),body=document.body;
function boot(){
 body=document.body;body.classList.add('h53-direct-layout');body.dataset.h53Work=slug;
 var done=false,observer=new MutationObserver(install);
 function by(id){return document.getElementById(id);}
 function move(id,target){var e=by(id);if(e&&target){target.append(e);e.dataset.h53Liquid='control';}return e;}
 function followVisibility(dock,anchor){var update=function(){dock.hidden=anchor.hidden;};update();new MutationObserver(update).observe(anchor,{attributes:true,attributeFilter:['hidden']});}
 function measure(dock){
  var last=-1;function size(){var height=Math.ceil(dock.getBoundingClientRect().height);if(last!==height){last=height;body.style.setProperty('--h53-primary-height',height+'px');}}
  new ResizeObserver(size).observe(dock);size();
 }
 function install(){
  if(done)return;
  var dock=by('composerPrimary')||by('legacyThreePrimary'),anchor=null;
  if(slug==='chrome-liturgy'&&window.ChromeLiturgyLiquid){dock=by('controls');move('reset',dock);move('photo',dock);}
  else if(slug==='empyrean-sigil'&&window.__svgLiquid){
   dock=document.createElement('div');dock.id='svgPrimary';dock.className='h53-primary-controls';dock.setAttribute('role','group');dock.setAttribute('aria-label','作品の操作');by('svgLiquidControls').append(dock);move('bgbtn',dock);anchor=by('menuToggle');followVisibility(dock,anchor);
  }
  else if(slug==='vacant-seat'&&window.__h53Liquid){dock=by('views');move('origin',dock);}
  else if(slug==='confluence'&&body.classList.contains('h53-liquid-host')){dock=by('ui');if(dock)move('reset',dock);}
  else if(['preservation-hall','earth-origin-material','the-changes'].indexOf(slug)>=0&&window.__h53Liquid){dock=by('stbar')||by('navigation')||by('views');}
  else if(slug==='binary-dusk'&&body.classList.contains('h53-liquid-host'))dock=by('controls');
  else if(body.classList.contains('code-rain-liquid')||(slug==='sigil-fusion'&&window.__svgLiquid)){done=true;observer.disconnect();return;}
  if(!dock)return;
  done=true;observer.disconnect();dock.classList.add('h53-primary-controls');measure(dock);
  // Direct controls do not bubble into legacy document/window gesture handlers.
  for(var type of ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','wheel','click'])dock.addEventListener(type,function(e){e.stopPropagation();},{passive:true});
  window.__h53DirectControls={dock:dock,ready:true,report:function(){return {slug:slug,buttons:Array.from(dock.querySelectorAll('button,input')).filter(function(e){return !e.hidden;}).map(function(e){var r=e.getBoundingClientRect();return {id:e.id||e.dataset.legacyId||e.textContent.trim(),x:r.x,y:r.y,width:r.width,height:r.height};})};}};
 }
 observer.observe(body,{childList:true,subtree:true});install();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
