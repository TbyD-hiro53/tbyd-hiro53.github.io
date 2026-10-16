/* Reading layout guard: opt-in, shared across release previews. No scene clock. */
(function(){'use strict';
var style=document.createElement('style');style.textContent=`
[data-h53-reading-hidden]:not(#h53-reading-priority):not(#h53-reading-chrome-priority),[data-h53-reading-hidden]:not(#h53-reading-priority):not(#h53-reading-chrome-priority) *{visibility:hidden!important;pointer-events:none!important}
[data-h53-reading-fit]:not(#h53-reading-priority):not(#h53-reading-panel-priority){position:fixed!important;left:var(--reading-left)!important;top:var(--reading-top)!important;right:auto!important;bottom:auto!important;transform:none!important;width:var(--reading-width)!important;max-width:var(--reading-width)!important;max-height:var(--reading-height)!important;min-height:0!important;box-sizing:border-box!important;overflow:auto!important;overscroll-behavior:contain;overflow-wrap:anywhere;z-index:100!important}
[data-h53-reading-fit]:not(#h53-reading-priority):not(#h53-reading-panel-priority)>.panel-head,[data-h53-reading-fit]:not(#h53-reading-priority):not(#h53-reading-panel-priority)>header{position:sticky!important;top:0;z-index:3;flex-shrink:0;background:rgba(25,35,42,.96);border-radius:12px;padding:6px}
[data-h53-reading-fit]:not(#h53-reading-priority):not(#h53-reading-panel-priority) button{flex-shrink:0;min-height:44px}
[data-h53-reading-fit]:not(#h53-reading-priority):not(#h53-reading-panel-priority) .h53-liquid-scroll{min-height:0;overflow:auto;overscroll-behavior:contain}
`;document.head.appendChild(style);
var panel=null,hidden=[],scheduled=false,returnFocus=null,lastFocus=document.activeElement,probe=document.createElement('div');
document.addEventListener('focusin',function(e){if(!e.target.closest('[aria-modal="true"]'))lastFocus=e.target;});
probe.style.cssText='position:fixed;pointer-events:none;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
var chrome='button,a,input,select,textarea,.h53-primary-controls,.composer-top,.composer-title,.legacy-three-top,.legacy-three-title,#hud,#hint,#back,#menuToggle,#editionPicker,#h53-menu-toggle,#h53-ui-restore,#origin,#eo-guide,.h53-copy';
function clear(restore){var old=panel,focus=returnFocus,active=document.activeElement;if(panel)panel.removeAttribute('data-h53-reading-fit');hidden.forEach(function(n){n.removeAttribute('data-h53-reading-hidden');});hidden=[];panel=null;returnFocus=null;if(restore&&focus&&focus.isConnected&&(active===document.body||old&&old.contains(active)))focus.focus({preventScroll:true});}
function fit(){scheduled=false;var candidates=Array.from(document.querySelectorAll('[aria-modal="true"]')).filter(function(n){return !n.hidden&&getComputedStyle(n).display!=='none'&&n.getClientRects().length;}),next=candidates[candidates.length-1];
 if(!next){clear(true);return;}if(panel!==next){clear(false);panel=next;returnFocus=lastFocus;}
 if(!probe.isConnected)document.body.appendChild(probe);
 panel.removeAttribute('data-h53-reading-fit');var r=panel.getBoundingClientRect(),v=window.visualViewport,s=getComputedStyle(probe),left=(v?v.offsetLeft:0)+12+parseFloat(s.paddingLeft),top=(v?v.offsetTop:0)+12+parseFloat(s.paddingTop),w=(v?v.width:innerWidth)-24-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight),h=(v?v.height:innerHeight)-24-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom);
 w=Math.max(1,w);h=Math.max(1,h);var width=Math.min(r.width||400,w),height=Math.min(r.height,h),x=Math.max(left,Math.min(r.left,left+w-width)),y=Math.max(top,Math.min(r.top,top+h-height));
 panel.style.setProperty('--reading-left',x+'px');panel.style.setProperty('--reading-top',y+'px');panel.style.setProperty('--reading-width',width+'px');panel.style.setProperty('--reading-height',(top+h-y)+'px');panel.setAttribute('data-h53-reading-fit','');
 document.querySelectorAll(chrome).forEach(function(n){if(n===panel||n.contains(panel)||panel.contains(n))return;if(!n.hasAttribute('data-h53-reading-hidden')){n.setAttribute('data-h53-reading-hidden','');hidden.push(n);}});
}
function schedule(){if(!scheduled){scheduled=true;Promise.resolve().then(fit);}}
function start(){new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-modal','hidden']});window.addEventListener('resize',schedule);if(window.visualViewport){visualViewport.addEventListener('resize',schedule);visualViewport.addEventListener('scroll',schedule);}if(document.fonts)document.fonts.ready.then(schedule);schedule();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
