/* 開いている面は、外側を押しても閉じる。
 *
 * 共有ホスト（h53-liquid-host）は面を開くあいだ錠を掛け、面の外で起きた入力を
 * document の捕捉段で preventDefault + stopImmediatePropagation で止める。
 * そのため document に付けた聞き手には届かない。錠より先に通るのは window の捕捉段だけ。
 *
 * 閉じる処理は各作品の釦に委ねる。こちらで hidden を書き換えないので、
 * 作品側が持つ開閉の状態（aria-expanded・焦点・再描画の要求）とずれない。
 * 作品スクリプトには触らない。 */
(function(){'use strict';
var PANEL='[data-h53-liquid="panel"],[aria-modal="true"],#menu,#info,#toc';
var CLOSE='#tocX,#closeInfo,[aria-label*="閉じる"],[aria-label*="Close"],[aria-label*="close"]';
var swallow=0;

function shown(p){
  if(!p||p.hidden)return false;
  var s=getComputedStyle(p);
  if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0)return false;
  var r=p.getBoundingClientRect();
  return r.width>1&&r.height>1;
}
/* 面の内側にある「閉じる」を探す */
function inner(p){
  var x=p.querySelector(CLOSE);
  if(x)return x;
  var b=p.querySelectorAll('button');
  for(var i=0;i<b.length;i++){
    var s=(b[i].textContent||'').trim();
    if(s==='閉じる'||s==='×'||s==='✕'||s.toLowerCase()==='close')return b[i];
  }
  return null;
}
/* その面を開いた釦（面の外にある） */
function toggle(p){
  return p.id?document.querySelector('[aria-controls="'+p.id+'"][aria-expanded="true"]'):null;
}
/* 錠は Escape だけ通す。閉じる釦が面の内側に無いときの最後の手 */
function esc(){
  var e;
  try{ e=new KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,which:27,bubbles:true,cancelable:true}); }
  catch(x){ return; }
  (document.activeElement||document.body).dispatchEvent(e);
  if(!e.defaultPrevented)document.dispatchEvent(e);
}
/* 開いている面を集める。
   ① 明示の面（PANEL）
   ② 開いている釦が aria-controls で指している面
   ②が要る。coastal-glass の時刻切替 #timeMenu は①のどれにも当たらない（実測）*/
function panels(){
  var out=[],i,p;
  var a=document.querySelectorAll(PANEL);
  for(i=0;i<a.length;i++)if(out.indexOf(a[i])<0)out.push(a[i]);
  var b=document.querySelectorAll('[aria-controls][aria-expanded="true"]');
  for(i=0;i<b.length;i++){
    p=document.getElementById(b[i].getAttribute('aria-controls'));
    if(p&&out.indexOf(p)<0)out.push(p);
  }
  return out;
}
function onDown(ev){
  if(ev.button!==undefined&&ev.button!==0)return;
  var t=ev.target,did=false,list=panels();
  for(var i=0;i<list.length;i++){
    var p=list[i];
    if(!shown(p)||p.contains(t))continue;
    /* 錠が掛かっている面では、外にある釦を押しても錠に止められる。
       内側の「閉じる」を押すか、Escape を送る */
    var locked=p.getAttribute('aria-modal')==='true';
    var b=locked?inner(p):(toggle(p)||inner(p));
    if(b&&(b===t||b.contains(t)))continue;     /* 釦そのものは自前で開閉する */
    if(b){ b.click(); did=true; }
    else if(locked){ esc(); did=true; }
    /* 錠も掛かっておらず閉じる術も無い面は、置いておく（常時出ている案内などを消さない）*/
  }
  /* 錠が掛かっていない面のときは、閉じた一押しを下の物へ渡さない */
  if(did){swallow=1;setTimeout(function(){swallow=0;},700);}
}
function onClick(ev){
  if(!swallow)return;
  swallow=0;ev.stopPropagation();ev.preventDefault();
}
window.addEventListener('pointerdown',onDown,true);
window.addEventListener('click',onClick,true);
})();
