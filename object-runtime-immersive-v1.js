/* Object immersive prototype 01. WebXR/WebGL; r128; no ESM or external services. */
(function(){'use strict';
const $=id=>document.getElementById(id);
let renderer,art;
function error(message){$('error').textContent=message;$('error').hidden=false;}
try{
 renderer=new THREE.WebGLRenderer({antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
 renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.xr.enabled=true;renderer.xr.setFramebufferScaleFactor(0.75);
 $('app').appendChild(renderer.domElement);art=window.H53ObjectSceneV1(renderer);
}catch(e){error('3D表示を開始できませんでした。ページを再読み込みしてください。');$('status').textContent='3D表示を利用できません。';return;}
const scene=art.scene,world=art.world;
const camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,200);
const xrCamera=new THREE.PerspectiveCamera(40,1,.05,100);
const target=new THREE.Vector3(0,.4,0),DEF={theta:.5,phi:1.45,radius:17};
let theta=DEF.theta,phi=DEF.phi,radius=DEF.radius,bgIndex=0,time=0,paused=false,lastTimestamp=null;
let session=null,entry=null,placed=false,refType=null,spaceReset=false,contextLost=false;
const SCALE=0.0799102147877659,DISTANCE=17*SCALE;
const forward=new THREE.Vector3(),eye=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
const raycaster=new THREE.Raycaster(),rayMatrix=new THREE.Matrix4();
function updateInlineCamera(){
 const header=document.querySelector('header').getBoundingClientRect(),controls=document.querySelector('main section').getBoundingClientRect();
 const top=header.bottom+14,bottom=controls.top-14,available=Math.max(160,bottom-top);
 const framedRadius=radius*Math.max(1,innerHeight/available),sp=Math.sin(phi),cp=Math.cos(phi);
 camera.position.set(framedRadius*sp*Math.sin(theta),target.y+framedRadius*cp,framedRadius*sp*Math.cos(theta));camera.lookAt(target);
 camera.setViewOffset(innerWidth,innerHeight,0,innerHeight/2-(top+bottom)/2,innerWidth,innerHeight);
}
// Original 2D backdrop wrapped around a distant dome: a projection, not invented room geometry.
// Mirrored tiles keep edges continuous; vertical UVs preserve a 40-degree central band and extend dark poles.
const backdropGeometry=new THREE.SphereGeometry(40,96,48);
const uv=backdropGeometry.attributes.uv;
for(let i=0;i<uv.count;i++)uv.setY(i,.48+(uv.getY(i)-.5)*4.5);
const backdropTextures=art.backgrounds.map(bg=>{const t=bg.tex.clone();t.needsUpdate=true;t.wrapS=THREE.MirroredRepeatWrapping;t.repeat.x=4;return t;});
const backdrop=new THREE.Mesh(backdropGeometry,new THREE.MeshBasicMaterial({map:backdropTextures[0],side:THREE.BackSide,depthWrite:false,toneMapped:false}));
backdrop.name='Projected original backdrop';backdrop.visible=false;backdrop.renderOrder=-1000;backdrop.frustumCulled=false;scene.add(backdrop);
const menu=new THREE.Group();menu.name='Spatial controls';menu.visible=false;scene.add(menu);
const buttons=[];
function labelTexture(text){
 const c=document.createElement('canvas');c.width=512;c.height=160;const g=c.getContext('2d');
 g.fillStyle='#10243b';g.fillRect(0,0,512,160);g.strokeStyle='#91e2df';g.lineWidth=5;g.strokeRect(4,4,504,152);
 g.fillStyle='#f0fcff';g.font='600 52px system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,80);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
}
function button(text,x,action){
 const m=new THREE.Mesh(new THREE.PlaneGeometry(.25,.078),new THREE.MeshBasicMaterial({map:labelTexture(text),toneMapped:false}));
 m.position.x=x;m.userData.action=action;menu.add(m);buttons.push(m);return m;
}
const pauseButton=button('一時停止',-.28,()=>setPaused(!paused));
button('背景',0,()=>setBackground((bgIndex+1)%art.backgrounds.length));
button('終了',.28,()=>endSession());
function setPaused(value){paused=value;$('pause').textContent=paused?'再開':'一時停止';const old=pauseButton.material.map;pauseButton.material.map=labelTexture(paused?'再開':'一時停止');old.dispose();lastTimestamp=null;}
function setBackground(value){bgIndex=value;$('bg').textContent='背景: '+art.backgrounds[value].name;if(session){backdrop.material.map=backdropTextures[value];}else scene.background=art.backgrounds[value].tex;}
function status(text){$('status').textContent=text;}
function restoreInline(){
 placed=false;spaceReset=false;menu.visible=false;backdrop.visible=false;
 world.position.set(0,0,0);world.rotation.set(0,0,0);world.scale.setScalar(1);world.visible=true;
 art.shadowScale(1);art.orientEnvironment(null);scene.background=art.backgrounds[bgIndex].tex;
 document.body.classList.remove('presenting');lastTimestamp=null;refType=null;
 renderer.setSize(innerWidth,innerHeight);updateInlineCamera();
}
function place(pose){
 const p=pose.transform.position,q=pose.transform.orientation;
 eye.set(p.x,p.y,p.z);forward.set(0,0,-1).applyQuaternion(new THREE.Quaternion(q.x,q.y,q.z,q.w));forward.y=0;
 if(forward.lengthSq()<.0001)forward.set(0,0,-1);else forward.normalize();
 const yaw=Math.atan2(-forward.x,-forward.z);
 world.scale.setScalar(SCALE);world.rotation.set(0,yaw-.5,0);
 world.position.copy(eye).addScaledVector(forward,DISTANCE);world.position.y=eye.y-.1-.4*SCALE;
 world.visible=true;art.shadowScale(SCALE);art.orientEnvironment(yaw-.5);
 menu.position.copy(eye).addScaledVector(forward,1.15);menu.position.y-=.53;
 menu.quaternion.setFromAxisAngle(up,yaw);menu.visible=true;
 backdrop.rotation.y=yaw;backdrop.visible=true;scene.background=null;
 placed=true;
}
function onSelect(event){
 if(!session||!placed||spaceReset||session.visibilityState==='hidden')return;
 const ref=renderer.xr.getReferenceSpace();if(!event.frame||!ref||!event.inputSource.targetRaySpace)return;
 const pose=event.frame.getPose(event.inputSource.targetRaySpace,ref);if(!pose)return;
 rayMatrix.fromArray(pose.transform.matrix);raycaster.ray.origin.setFromMatrixPosition(rayMatrix);
 raycaster.ray.direction.set(0,0,-1).transformDirection(rayMatrix);
 scene.updateMatrixWorld(true);const hits=raycaster.intersectObjects(buttons,false);
 if(hits.length)hits[0].object.userData.action();
}
function cleanup(ticket){
 if(entry!==ticket&&session!==ticket.session)return;
 const ended=ticket.session;
 if(ended){ended.removeEventListener('select',onSelect);ended.removeEventListener('visibilitychange',ticket.visibility);ended.removeEventListener('end',ticket.end);}
 if(ticket.reference&&ticket.reset)ticket.reference.removeEventListener('reset',ticket.reset);
 session=null;restoreInline();
 // The old r128 manager has no abort method. Clear a setup that completed after an early end.
 renderer.xr.isPresenting=false;renderer.xr.setSession(null);renderer.setRenderTarget(null);
 renderer.setAnimationLoop(null);renderer.setAnimationLoop(tick);
 if(!ticket.binding){entry=null;$('enter').disabled=!supported;$('cancel').hidden=true;}
}
let supported=false;
async function beginSession(){
 if(entry||session||!supported)return;
 $('error').hidden=true;$('enter').disabled=true;$('cancel').disabled=false;$('cancel').hidden=false;status('空間の開始を待っています。');
 const ticket={cancelled:false,ended:false,binding:true,active:false,session:null};entry=ticket;
 try{
  const s=await navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor']});ticket.session=s;
  ticket.end=()=>{ticket.ended=true;queueMicrotask(()=>{if(!ticket.binding){cleanup(ticket);status('空間を終了しました。もう一度入れます。');}});};s.addEventListener('end',ticket.end);
  if(ticket.cancelled||ticket.ended){if(!ticket.ended)await s.end();return;}
  try{await s.requestReferenceSpace('local-floor');refType='local-floor';}catch(e){await s.requestReferenceSpace('local');refType='local';}
  if(ticket.cancelled||ticket.ended){if(!ticket.ended)await s.end();return;}
  renderer.xr.setReferenceSpaceType(refType);
  session=s;world.visible=false;scene.background=null;placed=false;lastTimestamp=null;
  ticket.visibility=()=>{lastTimestamp=null;};s.addEventListener('visibilitychange',ticket.visibility);s.addEventListener('select',onSelect);
  await renderer.xr.setSession(s);
  if(ticket.cancelled||ticket.ended){if(!ticket.ended)await s.end();return;}
  ticket.reference=renderer.xr.getReferenceSpace();
  // A reference reset changes coordinates. Pause the view and exit, rather than forcibly relocating the viewer.
  ticket.reset=()=>{spaceReset=true;world.visible=false;menu.visible=false;lastTimestamp=null;endSession();};
  ticket.reference.addEventListener('reset',ticket.reset);
  ticket.active=true;document.body.classList.add('presenting');$('cancel').hidden=true;status('空間表示中です。');
 }catch(e){
  if(ticket.session&&!ticket.ended){try{await ticket.session.end();}catch(ignore){}}
  error(ticket.cancelled?'':('空間を開始できませんでした。許可と対応ブラウザを確認し、もう一度試してください。'));
  if(ticket.cancelled)$('error').hidden=true;
  status(ticket.cancelled?'開始を取り消しました。':'ブラウザ画面で作品を見られます。');
 }finally{
  ticket.binding=false;
  if(!ticket.active||ticket.cancelled||ticket.ended||session!==ticket.session){cleanup(ticket);entry=null;$('enter').disabled=!supported;$('cancel').hidden=true;if(ticket.cancelled)status('開始を取り消しました。');}
 }
}
async function endSession(){
 if(!session)return;const s=session;
 try{await s.end();}catch(e){if(session===s)error('終了できませんでした。Vision Proのシステム操作で空間を終了してください。');}
}
$('enter').onclick=beginSession;
$('cancel').onclick=()=>{if(entry){entry.cancelled=true;$('cancel').disabled=true;status('開始を取り消しています。');}};
$('pause').onclick=()=>setPaused(!paused);$('bg').onclick=()=>setBackground((bgIndex+1)%art.backgrounds.length);
$('reset').onclick=()=>{if(!session){theta=DEF.theta;phi=DEF.phi;radius=DEF.radius;updateInlineCamera();}};
// Inline pointer controls also work for touch; never move the XR camera.
const pointers=new Map();let pinchDistance=0;
const dom=renderer.domElement;
dom.addEventListener('pointerdown',e=>{if(session)return;dom.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});pinchDistance=0;});
dom.addEventListener('pointermove',e=>{
 if(session||!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===1){theta-=(e.clientX-old.x)*.006;phi=THREE.MathUtils.clamp(phi-(e.clientY-old.y)*.006,.5,1.9);}
 else if(pointers.size===2){const pair=Array.from(pointers.values()),d=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y);if(pinchDistance)radius=THREE.MathUtils.clamp(radius-(d-pinchDistance)*.03,9,40);pinchDistance=d;}
});
function resetPointers(){pointers.clear();pinchDistance=0;}
['pointerup','pointercancel','lostpointercapture'].forEach(type=>dom.addEventListener(type,e=>{pointers.delete(e.pointerId);pinchDistance=0;}));
dom.addEventListener('wheel',e=>{if(!session)radius=THREE.MathUtils.clamp(radius+e.deltaY*.012,9,40);},{passive:true});
addEventListener('blur',()=>{resetPointers();lastTimestamp=null;});
document.addEventListener('visibilitychange',()=>{resetPointers();lastTimestamp=null;});
addEventListener('keydown',e=>{if(e.key==='Escape'&&session)endSession();});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if(!session)renderer.setSize(innerWidth,innerHeight);});
dom.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;renderer.setAnimationLoop(null);error('3D描画が中断されました。空間を終了してページを再読み込みしてください。');endSession();});
dom.addEventListener('webglcontextrestored',()=>{$('recover').hidden=false;status('描画を再開するにはページを再読み込みしてください。');});
$('recover').onclick=()=>location.reload();
function tick(timestamp,frame){
 if(contextLost)return;
 const xr=!!(frame&&session);
 const running=!paused&&(session?session.visibilityState!=='hidden':!document.hidden)&&!spaceReset;
 if(running&&lastTimestamp!==null){time+=Math.min(Math.max((timestamp-lastTimestamp)/1000,0),.05);}
 lastTimestamp=running?timestamp:null;art.pose(time);
 if(xr){
  const pose=frame.getViewerPose(renderer.xr.getReferenceSpace());
  if(pose){if(!placed)place(pose);const p=pose.transform.position;backdrop.position.set(p.x,p.y,p.z);}
  renderer.render(scene,xrCamera);
 }else if(!session){updateInlineCamera();renderer.render(scene,camera);}
}
updateInlineCamera();renderer.setAnimationLoop(tick);
(async()=>{
 try{supported=!!(isSecureContext&&navigator.xr&&await navigator.xr.isSessionSupported('immersive-vr'));}catch(e){supported=false;}
 $('enter').disabled=!supported;
 status(supported?'「空間に入る」で体験を開始します。':'このブラウザでは画面内で鑑賞できます。空間表示は対応するVision ProのSafariで開いてください。');
})();
})();
