/* Fixed-view viewer; same-site IIFE, no camera or geometry manipulation. */
(function () {
'use strict';
var config = window.SHOKO_CONFIG;
var el = {};
['app','stage','frame','poster','motion','hotspots','pause','loading','failure','failure-text','retry','motion-note','record-shield','description','description-name','description-text','description-close','scenes','scene-current'].forEach(function(id){el[id]=document.getElementById(id);});
if (!config || config.scenes.length !== 7) {
 el.loading.hidden=true; el.failure.hidden=false; el['failure-text'].textContent='場面の情報を読み込めませんでした。';el.retry.onclick=function(){location.reload();};return;
}
var scenes=config.scenes, scene=null, orientation='', generation=0, ready=false;
var mediaQuery=matchMedia('(orientation: portrait)'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
var playWanted=!reduced.matches, videoEpoch=0, videoDisposers=[], loadCancel=null;
var modalPhase='closed', modalEpoch=0, previousFocus=null, resumeAfterDescription=false, heldPointers=new Set();
var sceneButtons=[];
el.app.dataset.build=config.build;
function mode(){return mediaQuery.matches?'portrait':'landscape';}
function note(text){el['motion-note'].textContent=text||'';el['motion-note'].hidden=!text;}
function setPlayButton(paused){el.pause.textContent=paused?'▷':'Ⅱ';el.pause.setAttribute('aria-pressed',String(paused));el.pause.setAttribute('aria-label',paused?'動きを再生する':'動きを止める');}
function sizeFrame(){
 if(!scene)return;
 var a=scene.images[orientation],b=el.stage.getBoundingClientRect(),scale=Math.min(b.width/a.width,b.height/a.height);
 el.frame.style.width=(a.width*scale)+'px';el.frame.style.height=(a.height*scale)+'px';
}
function resetVideo(){
 ++videoEpoch;videoDisposers.forEach(function(fn){fn();});videoDisposers=[];
 el.motion.pause();el.motion.classList.remove('visible');el.motion.removeAttribute('src');el.motion.removeAttribute('poster');el.motion.load();
 setPlayButton(true);note('');
}
function bindVideo(type,fn){el.motion.addEventListener(type,fn);videoDisposers.push(function(){el.motion.removeEventListener(type,fn);});}
function playVideo(){
 if(!ready || !scene.video || modalPhase!=='closed' || document.hidden)return;
 var epoch=videoEpoch;
 if(!el.motion.getAttribute('src')){startVideo();return;}
 var result=el.motion.play();
 if(result && result.catch)result.catch(function(){if(epoch!==videoEpoch||!playWanted||modalPhase!=='closed')return;setPlayButton(true);note(el.motion.error?'動画を読み込めませんでした。静止画で鑑賞できます。▷で再試行します。':'静止画で表示中です。▷で動きを再生できます。');});
}
function startVideo(){
 if(!ready || !scene.video || el.motion.getAttribute('src'))return;
 var source=scene.video[orientation];if(!source)return;
 var epoch=++videoEpoch, request=generation, expectedURL=new URL(source,document.baseURI).href;
 function current(){return epoch===videoEpoch && request===generation && el.motion.currentSrc===expectedURL;}
 el.motion.muted=true;el.motion.defaultMuted=true;el.motion.playsInline=true;el.motion.loop=true;el.motion.preload='metadata';
 bindVideo('playing',function(){if(!current()||el.motion.readyState<2)return;if(!playWanted||modalPhase!=='closed'||document.hidden){el.motion.pause();return;}el.motion.classList.add('visible');setPlayButton(false);note('');});
 bindVideo('pause',function(){if(current())setPlayButton(true);});
 bindVideo('error',function(){if(!current())return;el.motion.classList.remove('visible');setPlayButton(true);note('動画を読み込めませんでした。静止画で鑑賞できます。▷で再試行します。');});
 el.motion.src=source;
 if(playWanted && !document.hidden)playVideo();
}
function renderHotspots(){
 el.hotspots.replaceChildren();
 scene.hotspots.forEach(function(h){
  var r=h.rect[orientation],b=document.createElement('button');
  if(h.anchor){var a=h.anchor[orientation];b.style.setProperty('--cue-x',((a[0]-r[0])/r[2]*100)+'%');b.style.setProperty('--cue-y',((a[1]-r[1])/r[3]*100)+'%');}
  b.className='hotspot';b.type='button';b.dataset.targetId=h.id;b.dataset.sceneId=scene.id;
  b.style.left=((r[0]+r[2]/2)*100)+'%';b.style.top=((r[1]+r[3]/2)*100)+'%';b.style.width=r[2]*100+'%';b.style.height=r[3]*100+'%';
  b.setAttribute('aria-label',h.title+'の文章を開く');
  var expectedScene=scene.id,expectedGeneration=generation;
  b.addEventListener('click',function(){if(ready&&scene.id===expectedScene&&generation===expectedGeneration)openDescription(h,b);});
  el.hotspots.appendChild(b);
 });
}
function lock(locked){
 el.hotspots.inert=locked;sceneButtons.forEach(function(b){b.disabled=locked;});el.pause.disabled=locked;el.retry.disabled=locked;
 el['record-shield'].hidden=!locked;document.body.classList.toggle('reading',locked);
}
function clearDescription(restore){
 ++modalEpoch;modalPhase='closed';el.description.classList.remove('on');el.description.hidden=true;
 delete el.description.dataset.sceneId;delete el.description.dataset.targetId;
 el['description-name'].textContent='';el['description-text'].textContent='';
 el.hotspots.querySelectorAll('.selected').forEach(function(b){b.classList.remove('selected');});heldPointers.clear();lock(false);
 if(restore && previousFocus && previousFocus.isConnected)previousFocus.focus({preventScroll:true});previousFocus=null;
}
function openDescription(h,button){
 if(modalPhase!=='closed'||!ready)return;
 previousFocus=button;modalPhase='open';var token=++modalEpoch;
 resumeAfterDescription=!el.motion.paused;el.motion.pause();button.classList.add('selected');
 el.description.dataset.sceneId=scene.id;el.description.dataset.targetId=h.id;
 el['description-name'].textContent=h.title;el['description-text'].textContent=h.body;
 el['description-text'].scrollTop=0;el.description.hidden=false;lock(true);
 requestAnimationFrame(function(){if(token===modalEpoch){el.description.classList.add('on');el['description-close'].focus({preventScroll:true});}});
}
function closeDescription(){
 if(modalPhase!=='open')return;
 modalPhase='closing';el.description.classList.remove('on');var token=++modalEpoch;
 var deadline=performance.now()+(reduced.matches?0:225);
 function finish(){
  if(token!==modalEpoch)return;
  if(performance.now()<deadline || heldPointers.size){requestAnimationFrame(finish);return;}
  var resume=resumeAfterDescription;clearDescription(true);if(resume&&playWanted)playVideo();
 }
 requestAnimationFrame(finish);
}
function imageRequest(src){
 var img=new Image(),timer,cancelled=false;
 var promise=new Promise(function(resolve,reject){
  timer=setTimeout(function(){cleanup();reject(new Error('image timeout'));},20000);
  function cleanup(){clearTimeout(timer);img.onload=null;img.onerror=null;}
  img.onload=function(){cleanup();var p=img.decode?img.decode():Promise.resolve();p.catch(function(){}).then(function(){if(!cancelled)resolve(img);});};
  img.onerror=function(){cleanup();if(!cancelled)reject(new Error('image load failed'));};
  img.decoding='async';img.src=src;
 });
 return {promise:promise,cancel:function(){cancelled=true;clearTimeout(timer);img.onload=null;img.onerror=null;img.src='';}};
}
function showScene(id,force){
 if(modalPhase!=='closed'&&!force)return;
 var next=scenes.find(function(s){return s.id===id;})||scenes[0],nextMode=mode();
 if(!force&&scene===next&&orientation===nextMode&&ready)return;
 var token=++generation;ready=false;
 if(loadCancel)loadCancel();clearDescription(false);resetVideo();
 scene=next;orientation=nextMode;el.app.dataset.scene=scene.id;el.app.dataset.orientation=orientation;el.app.dataset.ready='false';
 el.frame.classList.remove('ready');el.hotspots.replaceChildren();el.stage.setAttribute('aria-busy','true');el.loading.hidden=false;el.failure.hidden=true;
 el.poster.removeAttribute('src');el.poster.alt=scene.alt;el.poster.dataset.sceneId=scene.id;
 el.pause.hidden=!scene.video;el.pause.disabled=true;
 sceneButtons.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.scene===scene.id));});
 el['scene-current'].textContent=String(scenes.indexOf(scene)+1).padStart(2,'0')+' / 07　'+scene.name;
 sizeFrame();
 var request=imageRequest(scene.images[orientation].src);loadCancel=request.cancel;
 request.promise.then(function(img){
  if(token!==generation)return;
  el.poster.src=img.src;renderHotspots();el.frame.classList.add('ready');el.loading.hidden=true;el.failure.hidden=true;ready=true;el.app.dataset.ready='true';el.stage.setAttribute('aria-busy','false');
  el.pause.disabled=!scene.video;
  if(scene.video&&playWanted)startVideo();
 }).catch(function(){
  if(token!==generation)return;
  el.loading.hidden=true;el.failure.hidden=false;el.stage.setAttribute('aria-busy','false');el['failure-text'].textContent=scene.name+'の画像を読み込めませんでした。接続を確認して再試行してください。';
 });
 // This is a scene bookmark, never an additional viewpoint.
 if(location.hash!=='#'+scene.id)history.replaceState(null,'','#'+scene.id);
}
scenes.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='glass';b.textContent=s.name;b.dataset.scene=s.id;b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){showScene(s.id,false);});sceneButtons.push(b);el.scenes.appendChild(b);});
el.retry.addEventListener('click',function(){showScene(scene.id,true);});
el.pause.addEventListener('click',function(){
 if(modalPhase!=='closed'||!ready||!scene.video)return;
 if(!el.motion.paused){playWanted=false;el.motion.pause();setPlayButton(true);return;}
 playWanted=true;if(el.motion.error)resetVideo();playVideo();
});
el['description-close'].addEventListener('click',closeDescription);
['pointerdown','pointerup','pointercancel'].forEach(function(type){document.addEventListener(type,function(e){
 var wasHeld=heldPointers.has(e.pointerId);
 if(type==='pointerdown'&&modalPhase!=='closed')heldPointers.add(e.pointerId);
 if(type!=='pointerdown')heldPointers.delete(e.pointerId);
 if((modalPhase!=='closed'||wasHeld)&&!el.description.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
},{capture:true,passive:false});});
document.addEventListener('click',function(e){if(modalPhase!=='closed'&&!el.description.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('wheel',function(e){if(modalPhase!=='closed'&&!el.description.contains(e.target))e.preventDefault();},{passive:false});
document.addEventListener('keydown',function(e){
 if(modalPhase==='closed')return;
 if(e.key==='Escape'){e.preventDefault();closeDescription();}
 if(e.key==='Tab'){e.preventDefault();var body=el['description-text'],close=el['description-close'];(document.activeElement===close?body:close).focus({preventScroll:true});}
});
window.addEventListener('blur',function(){heldPointers.clear();});
window.addEventListener('resize',function(){if(mode()!==orientation)showScene(scene.id,true);else sizeFrame();});
window.addEventListener('hashchange',function(){showScene(location.hash.slice(1),true);});
document.addEventListener('visibilitychange',function(){if(document.hidden)el.motion.pause();else if(playWanted&&ready&&scene.video&&modalPhase==='closed')playVideo();});
window.addEventListener('pagehide',function(){el.motion.pause();});
window.addEventListener('pageshow',function(e){if(e.persisted&&ready&&scene.video&&playWanted)playVideo();});
showScene(location.hash.slice(1),true);
}());
