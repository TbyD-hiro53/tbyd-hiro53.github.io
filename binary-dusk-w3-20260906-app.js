(function(){'use strict';
const $=id=>document.getElementById(id),C=BinaryDuskCore,clock=new C.Clock(),world=new BinaryDuskWorld();
let ready=false,raf=0,previous=null,shown=true,lastReadout=0,returnFocus=null,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const panels={
 suns:{title:'二つの日',text:'ピンクの白と、ターコイズの白。\n大きい日が先に沈む。小さい日が続く。\nその後も、列車と円盤の運動は続く。'},
 tree:{title:'分館の外皮',text:'縦の筋が、ねじれながら上へ続く。\n主幹から枝が分かれる。上端は見えない。'},
 station:{title:'ひとつの駅',text:'森を抜ける線路に、一つの駅。\nホームと薄い上屋。\n空の三両編成が、その前を通過する。'},
 train:{title:'空の三両編成',text:'乗客のいない三両編成。\n駅の前を過ぎ、奥の右手へ曲がる。\n線路は再び森へ入る。'},
 carrier:{title:'搬送円盤',text:'五基の搬送円盤。積載物はない。\n隣り合う円盤が、逆方向に回転する。'},
 district:{title:'沿線の建物',text:'根の周囲に並ぶ、低い建物。\n一定の間隔。その間を通る線路。'},
 sea:{title:'左奥の海',text:'森の向こうに水面が開く。\n二つの日を映し、日没の後は残照を受ける。'}
};
function error(e){$('error').hidden=false;$('error').textContent='景観を表示できませんでした。接続を確認して、もう一度お試しください。\n'+(e.message||String(e));$('loadText').textContent='読み込みを完了できませんでした';$('retry').hidden=false;$('loading').hidden=false;}
addEventListener('error',e=>error(e.error||e.message));addEventListener('unhandledrejection',e=>error(e.reason));$('retry').onclick=()=>location.reload();
function menu(open){$('menu').hidden=!open;$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');if(open){$('info').hidden=true;$('pause').focus();}}
function openInfo(title){returnFocus=document.activeElement;menu(false);$('infoTitle').textContent=title;$('infoBody').replaceChildren();$('info').hidden=false;$('closeInfo').focus();}
function paragraph(text){const p=document.createElement('p');p.textContent=text;$('infoBody').append(p);}
function selectAsset(id){const key=id.startsWith('carrier-')?'carrier':id,data=panels[key];if(!data)return;openInfo(data.title);paragraph(data.text);schedule();}
function closeInfo(){$('info').hidden=true;if(returnFocus&&returnFocus.isConnected)returnFocus.focus();else $('menuToggle').focus();schedule();}
$('closeInfo').onclick=closeInfo;$('menuToggle').onclick=()=>menu($('menu').hidden);
$('targets').onclick=()=>{openInfo('観測する対象');const list=document.createElement('ul');list.className='target-list';for(const [id,label] of [['suns','二つの日'],['tree','主幹・足場'],['station','駅'],['train','三両編成'],['carrier','搬送円盤'],['district','建物の並び'],['sea','海']]){const li=document.createElement('li'),b=document.createElement('button');b.textContent=label;b.onclick=()=>selectAsset(id);li.append(b);list.append(li);}$('infoBody').append(list);};
$('about').onclick=()=>{openInfo('Binary Dusk');paragraph('巨大樹の枝から、二つの日と地上を観測する。日が沈んだ後も、列車と円盤は運動を続ける。');paragraph('SUNSETで日没を開始。三分で小さい日が沈み、その後は夕闇が続く。');paragraph('h!ro53 / deus ex machina');};
$('settings').onclick=()=>{openInfo('画質・動き');const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=reduced;check.onchange=()=>{reduced=check.checked;schedule();};label.append(check,document.createTextNode(' 風と水面の細かな動きを減らす'));$('infoBody').append(label);const ql=document.createElement('label');ql.textContent='画質';const sel=document.createElement('select');for(const [value,text] of [['auto','自動'],['high','高'],['low','軽量']]){const op=document.createElement('option');op.value=value;op.textContent=text;sel.append(op);}sel.value=world.quality;sel.onchange=()=>{world.quality=sel.value;world.scale=1;resize();schedule();};ql.append(sel);$('infoBody').append(ql);};
function syncUI(){const t=clock.sunsetSeconds,state=C.duskState(t);$('sunset').disabled=!ready||clock.sunsetStarted;$('sunset').setAttribute('aria-pressed',String(clock.sunsetStarted));$('phase').textContent=!clock.running?'一時停止':!clock.sunsetStarted?'夕景':state.suns?'日没':t<225?'残照':'夕闇';$('pause').textContent=clock.running?'一時停止':'再開';}
$('sunset').onclick=()=>{clock.beginSunset(performance.now());syncUI();schedule();};
$('pause').onclick=()=>{clock.running?clock.pause(performance.now()):clock.play(performance.now());previous=null;syncUI();schedule();};
function showUI(on){shown=on;for(const id of ['masthead','controls'])$(id).hidden=!on;$('showUI').hidden=on;menu(false);if(!on)$('info').hidden=true;(on?$('menuToggle'):$('showUI')).focus();schedule();}
$('hideUI').onclick=()=>showUI(false);$('showUI').onclick=()=>showUI(true);
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('info').hidden)closeInfo();else if(!$('menu').hidden){menu(false);$('menuToggle').focus();}else showUI(!shown);}if(e.code==='Space'&&!['BUTTON','INPUT','SELECT','A'].includes(document.activeElement.tagName)&&ready){e.preventDefault();$('pause').click();}});
$('canvas').addEventListener('pointerup',e=>{if(!ready||!e.isPrimary)return;const r=$('canvas').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;const id=world.pick((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);if(id)selectAsset(id);});
let changingView=false;
function resize(){const h=innerHeight,w=innerWidth,portrait=h>w,width=portrait?w:Math.min(w,h*16/9),height=portrait?h:width*9/16;$('stage').style.width=width+'px';$('stage').style.height=height+'px';if(ready)world.resize(width,height,devicePixelRatio);}
async function ensureView(){if(!ready||changingView)return;const desired=innerHeight>innerWidth?'portrait':'landscape';if(world.viewName===desired)return;changingView=true;const wasRunning=clock.running,quality=world.quality;clock.pause(performance.now());cancelAnimationFrame(raf);raf=0;ready=false;previous=null;syncUI();$('menuToggle').disabled=true;$('pause').disabled=true;$('loading').hidden=false;$('loadText').textContent='画面の向きを調整しています';world.disposeView();try{await world.load($('canvas'),n=>{$('loadProgress').value=n*100;},desired);world.quality=quality;ready=true;resize();world.update(clock.sunsetSeconds,reduced,clock.motionSeconds);world.render();$('loading').hidden=true;$('menuToggle').disabled=false;$('pause').disabled=false;if(wasRunning)clock.play(performance.now());syncUI();}catch(e){error(e);}finally{changingView=false;ensureView();schedule();}}
addEventListener('resize',()=>{resize();ensureView();schedule();});if(window.visualViewport)visualViewport.addEventListener('resize',()=>{resize();schedule();});document.addEventListener('visibilitychange',()=>{clock.visibility(document.hidden,performance.now());previous=null;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();});
const measures={normal:[],panel:[],menu:[],hiddenUI:[]};let adaptAt=0;
function frame(now){raf=0;if(!ready||document.hidden)return;clock.advance(now);if(previous!==null&&clock.running){const dt=now-previous;world.frameSamples.push(dt);if(world.frameSamples.length>18000)world.frameSamples.shift();const group=!shown?'hiddenUI':!$('info').hidden?'panel':!$('menu').hidden?'menu':'normal';measures[group].push(dt);if(measures[group].length>18000)measures[group].shift();if(dt>50)world.longFrames.push({at:clock.sunsetSeconds,ms:dt,group});}previous=now;world.update(clock.sunsetSeconds,reduced,clock.motionSeconds);world.render();if(now-lastReadout>400){syncUI();lastReadout=now;}
if(world.quality==='auto'&&now-adaptAt>5000&&world.frameSamples.length>120){const last=C.stats(world.frameSamples.slice(-120));if(last.p95>38&&world.scale>.6){world.scale=Math.max(.6,world.scale*.85);resize();}adaptAt=now;}if(clock.running)schedule();}
function schedule(){if(!raf&&ready&&!document.hidden)raf=requestAnimationFrame(frame);}
resize();world.load($('canvas'),n=>{$('loadProgress').value=n*100;$('loadText').textContent='景観を準備しています · '+Math.round(n*100)+'%';}).then(()=>{ready=true;resize();world.update(0,reduced,0);world.render();world.readyFromNavigationMs=performance.now();world.readyMs=world.readyFromNavigationMs-world.loadStarted;document.body.classList.add('ready');$('loading').hidden=true;for(const id of ['pause','targets'])$(id).disabled=false;clock.play(performance.now());syncUI();schedule();}).catch(error);
})();
