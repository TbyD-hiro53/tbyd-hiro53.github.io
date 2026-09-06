(function(root){'use strict';
const T=root.THREE,C=root.BinaryDuskCore,S=root.BinaryDuskShaders;
const V=a=>new T.Vector3().fromArray(a);
function quaternion(q){return new T.Quaternion(q[1],q[2],q[3],q[0]);}
async function buffer(url){
 if('DecompressionStream' in root){const r=await fetch(url.replace(/(\?|$)/,'.gz$1'));if(!r.ok)throw Error('データを読み込めません: '+url);return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();}
 const r=await fetch(url);if(!r.ok)throw Error('データを読み込めません: '+url);return r.arrayBuffer();
}
const sharedBuffers=new Map();
function sharedBuffer(url){if(!sharedBuffers.has(url))sharedBuffers.set(url,buffer(url));return sharedBuffers.get(url);}
function texture(url){return new Promise((resolve,reject)=>new T.TextureLoader().load(url,t=>{t.generateMipmaps=false;t.minFilter=T.LinearFilter;t.magFilter=T.LinearFilter;t.encoding=T.LinearEncoding;resolve(t);},undefined,()=>reject(Error('画像を読み込めません: '+url))));}
class World{
 async load(canvas,progress,viewName=(innerHeight>innerWidth?'portrait':'landscape')){
  this.viewName=viewName;
  this.canvas=canvas;this.loadStarted=performance.now();this.drawSamples=[];this.frameSamples=[];this.longFrames=[];this.errors=[];this.quality='auto';this.scale=1;this.low=false;
  this.renderer=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});this.renderer.outputEncoding=T.sRGBEncoding;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.autoClear=true;this.renderer.info.autoReset=false;this.renderer.setClearColor(0x080b13,1);
  if(!this.renderer.capabilities.isWebGL2&&!this.renderer.extensions.has('EXT_frag_depth'))throw Error('このブラウザでは奥行き描画を利用できません。SafariまたはChromeを更新してお試しください。');
  this.scene=new T.Scene();this.shadowScene=new T.Scene();this.camera=new T.PerspectiveCamera(55,16/9,.3,20000);this.camera.up.set(0,0,1);
  const data=await fetch('binary-dusk-w3-20260906-scene.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('シーンを読み込めません');return r.json();});const view=data.views[viewName];Object.assign(data,view);this.data=data;this.camera.fov=data.camera.verticalFov;this.camera.aspect=data.camera.aspect;this.camera.updateProjectionMatrix();this.camera.position.fromArray(data.camera.position);this.camera.quaternion.copy(quaternion(data.camera.quaternion));this.camera.updateMatrixWorld(true);const asset=n=>'binary-dusk-w3-20260906-'+(n==='geometry.bin'?'':viewName==='portrait'?'portrait-':'')+n;
  let completed=0;const step=()=>progress(++completed/18);
  const jobs=[sharedBuffer(asset('geometry.bin')),buffer(asset('surface.bin')),buffer(asset('surface-depth-id.bin')),texture(asset('surface-normal-roughness.png')),texture(asset('surface-albedo.png'))];
  for(const sec of data.texture_times)jobs.push(texture(asset('ambient-'+String(sec).padStart(3,'0')+'.webp')));
  for(const sec of data.texture_times)jobs.push(texture(asset('sky-'+String(sec).padStart(3,'0')+'.webp')));
  jobs.push(texture(asset('surface-roughness.png')));
  const values=await Promise.all(jobs.map(p=>p.then(v=>{step();return v;})));const [geometry,surface,depth,norm,albedo]=values;
  this.depthBytes=new Uint8Array(depth);this.depthTexture=new T.DataTexture(this.depthBytes,data.surface.width,data.surface.height,T.RGBAFormat,T.UnsignedByteType);this.depthTexture.minFilter=T.NearestFilter;this.depthTexture.magFilter=T.NearestFilter;this.depthTexture.generateMipmaps=false;this.depthTexture.needsUpdate=true;
  this.ambient=values.slice(5,11);this.sky=values.slice(11,17);
  this.shadowTarget=new T.WebGLRenderTarget(1024,1024,{minFilter:T.NearestFilter,magFilter:T.NearestFilter,format:T.RGBAFormat,type:T.UnsignedByteType});this.shadowCamera=new T.OrthographicCamera(-420,420,420,-420,1,2300);this.shadowCamera.up.set(0,0,1);
  this.uniforms={uTime:{value:0},uDusk:{value:.77285},uFade:{value:0},uAltL:{value:40},uAltS:{value:360},uWind:{value:1},uMix:{value:0},uResolution:{value:new T.Vector2(1280,720)},uRayScale:{value:new T.Vector2(Math.tan(data.camera.verticalFov*Math.PI/360)*data.camera.aspect,Math.tan(data.camera.verticalFov*Math.PI/360))},uUvScale:{value:new T.Vector2(1,1)},uCameraPosition:{value:this.camera.position},uCameraWorld:{value:this.camera.matrixWorld},uViewProjection:{value:new T.Matrix4().multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse)},uShadowMatrix:{value:new T.Matrix4()},uDepth:{value:this.depthTexture},uShadow:{value:this.shadowTarget.texture},uAmbientA:{value:this.ambient[0]},uAmbientB:{value:this.ambient[1]},uSkyA:{value:this.sky[0]},uSkyB:{value:this.sky[1]},uNormal:{value:norm},uAlbedo:{value:albedo},uSunDirection:{value:V(data.sun_lights[0].direction)},uSunColor:{value:V(data.sun_lights[0].color)},uSmallDirection:{value:V(data.sun_lights[1].direction)},uSmallColor:{value:V(data.sun_lights[1].color)},uSunPower:{value:1.8},uSmallPower:{value:.24},uShadowEnabled:{value:1},uDiscs:{value:data.carriers.map(d=>new T.Vector4(...d.position,d.radius))}};
  this.materials=[];this.meshes={};this.shadowMeshes={};this.pickMeshes=[];this.pickScene=new T.Scene();this.pickClones=[];
  this.uniforms.uRoughness={value:values[17]};
  const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(new Float32Array(surface,0,data.surface.vertices*3),3));sg.setIndex(new T.BufferAttribute(new Uint32Array(surface,data.surface.vertices*12,data.surface.indices),1));sg.computeBoundingSphere();
  const staticMat=new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:S.simpleVertex,fragmentShader:S.surfaceFragment,side:T.DoubleSide,extensions:{fragDepth:true},toneMapped:false});this.viewTextures=[norm,albedo,values[17],this.depthTexture,...this.ambient,...this.sky];this.staticSurface=new T.Mesh(sg,staticMat);this.staticSurface.frustumCulled=false;this.staticSurface.renderOrder=0;this.scene.add(this.staticSurface);
  const pickSurface=new T.Mesh(sg,new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:S.simpleVertex,fragmentShader:S.common+`void main(){vec2 uv=viewUV(gl_FragCoord.xy/uResolution);vec4 dp=texture2D(uDepth,uv);if(dp.a<.001)discard;vec3 p=uCameraPosition+rayAt(uv)*rayDepth(dp);vec4 q=uViewProjection*vec4(p,1.);gl_FragDepthEXT=q.z/q.w*.5+.5;float id=floor(dp.a*255.+.5);if(id==5.)id=1.;else if(id==1.)id=0.;gl_FragColor=vec4(id/255.,0.,0.,1.);}`,side:T.DoubleSide,extensions:{fragDepth:true},toneMapped:false}));pickSurface.frustumCulled=false;this.pickScene.add(pickSurface);
  const sunPick=new T.Mesh(new T.PlaneBufferGeometry(2,2),new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:S.skyVertex,fragmentShader:S.common+`varying vec2 vUv;void main(){vec2 m=sunMasks(viewUV(vUv));gl_FragColor=vec4((max(m.x,m.y)>.001?11.:0.)/255.,0.,0.,1.);}`,depthWrite:false,depthTest:false,toneMapped:false}));sunPick.frustumCulled=false;sunPick.renderOrder=-10;this.pickScene.add(sunPick);
  const skyMat=new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:S.skyVertex,fragmentShader:S.skyFragment,depthWrite:false,depthTest:false,toneMapped:false});this.skyMesh=new T.Mesh(new T.PlaneBufferGeometry(2,2),skyMat);this.skyMesh.frustumCulled=false;this.skyMesh.renderOrder=-10;this.scene.add(this.skyMesh);
  for(const m of data.meshes){
   const g=new T.BufferGeometry();for(const [key,a] of Object.entries(m.attributes))g.setAttribute(key,new T.BufferAttribute(new Float32Array(geometry,a.offset,a.length),a.size));g.setIndex(new T.BufferAttribute(new Uint32Array(geometry,m.index.offset,m.index.length),1));g.computeBoundingSphere();
   const own={...this.uniforms,uLeaf:{value:m.role==='leaves'?1:0},uTwig:{value:m.role==='twigs'?1:0},uEmissive:{value:m.role==='rim'?1:0}};
   const mat=new T.ShaderMaterial({uniforms:own,vertexShader:S.dynamicVertex,fragmentShader:S.dynamicFragment,side:T.DoubleSide,toneMapped:false});mat.defaultAttributeValues={color:[1,1,1],uv:[0,0],anchor:[0,0,0],windGroup:[0,0,0,0]};
   const mesh=new T.Mesh(g,mat);mesh.name=m.name;mesh.userData.role=m.role;mesh.frustumCulled=false;this.meshes[m.name]=mesh;this.materials.push(mat);
   const sm=new T.ShaderMaterial({uniforms:own,vertexShader:S.dynamicVertex,fragmentShader:'#include <packing>\nvoid main(){gl_FragColor=packDepthToRGBA(gl_FragCoord.z);}',side:T.DoubleSide,toneMapped:false});sm.defaultAttributeValues=mat.defaultAttributeValues;
   const shadow=new T.Mesh(g,sm);shadow.frustumCulled=false;this.shadowMeshes[m.name]=shadow;this.shadowScene.add(shadow);
   if(m.role!=='tree-proxy'){this.scene.add(mesh);if(['train','carrier','rim'].includes(m.role))this.pickMeshes.push(mesh);}
   if(m.role!=='tree-proxy'){
    const id=m.role==='train'?5:(m.role==='carrier'||m.role==='rim'?5+Number(m.name.split('-')[1]):201);
    const pickMat=new T.ShaderMaterial({uniforms:{...own,uPickId:{value:id}},vertexShader:S.dynamicVertex,fragmentShader:'uniform float uPickId;void main(){gl_FragColor=vec4(uPickId/255.,0.,0.,1.);}',side:T.DoubleSide,toneMapped:false});pickMat.defaultAttributeValues=mat.defaultAttributeValues;
    const pick=new T.Mesh(g,pickMat);pick.frustumCulled=false;pick.matrixAutoUpdate=false;this.pickScene.add(pick);this.pickClones.push({pick,mesh});
   }
   // Only the coarse solid proxy is used for off-screen trunk occlusion.
   if(m.role==='rim')shadow.visible=false;
  }
  this.carriers=data.carriers.map(d=>{const parts=[this.meshes[d.mesh],this.meshes[d.rim]],sh=[this.shadowMeshes[d.mesh],this.shadowMeshes[d.rim]];for(const m of parts.concat(sh)){m.position.fromArray(d.position);m.quaternion.copy(quaternion(d.quaternion));m.scale.fromArray(d.scale);m.userData.asset=d.id;}return {data:d,parts,sh};});
  this.cars=data.cars.map(d=>{const m=this.meshes[d.id],sh=this.shadowMeshes[d.id];m.scale.fromArray(d.scale);sh.scale.fromArray(d.scale);m.userData.asset='train';return {data:d,mesh:m,shadow:sh};});this.route=C.makeRoute(data.train_route);
  for(const t of this.viewTextures)this.renderer.initTexture(t);
  this.raycaster=new T.Raycaster();this.pickTarget=new T.WebGLRenderTarget(1280,720,{minFilter:T.NearestFilter,magFilter:T.NearestFilter,format:T.RGBAFormat,type:T.UnsignedByteType});this.lastShadow=-Infinity;this.update(0,false);this.readyMs=performance.now()-this.loadStarted;progress(1);
  this.gpuTimer=null;const gl=this.renderer.getContext();if(this.renderer.capabilities.isWebGL2){const ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');if(ext)this.gpuTimer={gl,ext,queue:[],samples:[]};}
  return this;
 }
 update(seconds,reduced,motionSeconds=seconds){
  this.seconds=seconds;this.motionSeconds=motionSeconds;this.state=C.duskState(seconds);const state=this.state,u=this.uniforms,k=C.keys(seconds,this.data.texture_times);u.uTime.value=motionSeconds;u.uDusk.value=state.dusk;u.uFade.value=state.fade;u.uAltL.value=state.large;u.uAltS.value=state.small;u.uWind.value=reduced?0:1;u.uMix.value=k.mix;
  u.uAmbientA.value=this.ambient[k.a];u.uAmbientB.value=this.ambient[k.b];u.uSkyA.value=this.sky[k.a];u.uSkyB.value=this.sky[k.b];
  const ratio=state.dusk/C.duskState(0).dusk;u.uSunPower.value=1.8*C.clamp((state.large+200)/240,0,1)*ratio;u.uSmallPower.value=.24*C.clamp((state.small+106)/127.2,0,1)*ratio;
  u.uSunDirection.value.fromArray(this.data.sun_lights[0].direction);u.uSunDirection.value.z+=Math.min(seconds,93)*.0003;u.uSunDirection.value.normalize();u.uSmallDirection.value.fromArray(this.data.sun_lights[1].direction);u.uSmallDirection.value.z+=Math.min(seconds,180)*.00032;u.uSmallDirection.value.normalize();
  for(const c of this.carriers){const angle=motionSeconds*Math.PI*2/2.4*c.data.direction;for(const m of c.parts.concat(c.sh))m.rotation.z=angle;}
  for(const c of this.cars){if(motionSeconds===0){for(const m of [c.mesh,c.shadow]){m.position.fromArray(c.data.position);m.quaternion.copy(quaternion(c.data.quaternion));}}else{const at=this.route.car(c.data.arc,motionSeconds);for(const m of [c.mesh,c.shadow]){m.position.fromArray(at.position);m.rotation.set(0,0,at.yaw);}}}
  this.scene.updateMatrixWorld(true);this.shadowScene.updateMatrixWorld(true);
 }
 resize(w,h,dpr){
  this.cssWidth=w;this.cssHeight=h;const aspect=w/h,ref=this.data.camera;
  const crop=this.viewName==='portrait'?Math.min(1,ref.aspect/aspect):1;this.uniforms.uUvScale.value.set(this.viewName==='portrait'?Math.min(1,aspect/ref.aspect):1,crop);
  this.camera.aspect=aspect;this.camera.fov=2*Math.atan(Math.tan(ref.verticalFov*Math.PI/360)*crop)*180/Math.PI;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);this.uniforms.uViewProjection.value.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);
  const cap=this.quality==='low'?960:this.quality==='high'?1920:1440;const pixels=this.quality==='low'?520000:this.quality==='high'?2073600:1250000;
  let factor=Math.min(Math.min(dpr,1.5),cap/Math.max(w,h),Math.sqrt(pixels/(w*h)))*this.scale;const width=Math.max(160,Math.round(w*factor/2)*2),height=Math.max(160,Math.round(h*factor/2)*2);
  this.renderer.setPixelRatio(1);this.renderer.setSize(width,height,false);this.uniforms.uResolution.value.set(width,height);this.lastShadow=-Infinity;
  if(this.pickTarget)this.pickTarget.setSize(width,height);
 }
 render(){
  const begin=performance.now();const r=this.renderer;r.info.reset();const timer=this.gpuTimer;let query=null;
  if(timer&&timer.queue.length<5){query=timer.gl.createQuery();timer.gl.beginQuery(timer.ext.TIME_ELAPSED_EXT,query);}
  const power=this.uniforms.uSunPower.value+this.uniforms.uSmallPower.value;
  this.uniforms.uShadowEnabled.value=this.quality==='low'||power<.002?0:1;
  if(this.uniforms.uShadowEnabled.value){
   const mix=this.uniforms.uSmallPower.value/Math.max(power,.001),dir=this.uniforms.uSunDirection.value.clone().lerp(this.uniforms.uSmallDirection.value,mix).normalize(),focus=new T.Vector3(0,240,48);this.shadowCamera.position.copy(focus).addScaledVector(dir,-1000);this.shadowCamera.lookAt(focus);this.shadowCamera.updateMatrixWorld(true);
   this.uniforms.uShadowMatrix.value.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(this.shadowCamera.projectionMatrix).multiply(this.shadowCamera.matrixWorldInverse);
   r.setRenderTarget(this.shadowTarget);r.setClearColor(0xffffff,1);r.render(this.shadowScene,this.shadowCamera);r.setRenderTarget(null);r.setClearColor(0x080b13,1);
  }
  r.render(this.scene,this.camera);
  if(query){timer.gl.endQuery(timer.ext.TIME_ELAPSED_EXT);timer.queue.push(query);}
  if(timer){while(timer.queue.length&&timer.gl.getQueryParameter(timer.queue[0],timer.gl.QUERY_RESULT_AVAILABLE)){const q=timer.queue.shift();if(!timer.gl.getParameter(timer.ext.GPU_DISJOINT_EXT))timer.samples.push(timer.gl.getQueryParameter(q,timer.gl.QUERY_RESULT)/1e6);timer.gl.deleteQuery(q);if(timer.samples.length>18000)timer.samples.shift();}}
  const ms=performance.now()-begin;this.drawSamples.push(ms);if(this.drawSamples.length>18000)this.drawSamples.shift();this.lastInfo={calls:r.info.render.calls,triangles:r.info.render.triangles,geometries:r.info.memory.geometries,textures:r.info.memory.textures};return ms;
 }
 depthAt(uv){const {width:w,height:h}=this.data.surface;const sy=this.uniforms.uUvScale.value.y;const x=Math.max(0,Math.min(w-1,Math.floor(((uv.x-.5)*this.uniforms.uUvScale.value.x+.5)*w))),y=Math.max(0,Math.min(h-1,Math.floor(((uv.y-.5)*sy+.5)*h))),i=(y*w+x)*4,b=this.depthBytes;return {id:b[i+3],distance:Math.pow(2,(b[i]*65536+b[i+1]*256+b[i+2])/16777215*Math.log2(20001))-1};}
 disposeView(){const geometries=new Set(),materials=new Set();for(const scene of [this.scene,this.pickScene,this.shadowScene])scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.viewTextures.forEach(t=>t.dispose());this.shadowTarget.dispose();this.pickTarget.dispose();if(this.gpuTimer)for(const q of this.gpuTimer.queue)this.gpuTimer.gl.deleteQuery(q);this.renderer.dispose();}

 visiblePoint(p,tolerance=.5){const q=p.clone().project(this.camera);if(Math.abs(q.x)>1||Math.abs(q.y)>1||q.z>1)return false;const hit=this.depthAt(new T.Vector2(q.x*.5+.5,q.y*.5+.5));const local=p.clone().applyMatrix4(this.camera.matrixWorldInverse);return !hit.id||hit.distance+tolerance>=-local.z;}
 pick(nx,ny){
  for(const {pick,mesh} of this.pickClones){pick.matrix.copy(mesh.matrixWorld);pick.matrixWorld.copy(mesh.matrixWorld);}
  const r=this.renderer,target=this.pickTarget;r.setRenderTarget(target);r.setClearColor(0x000000,1);r.render(this.pickScene,this.camera);r.setRenderTarget(null);r.setClearColor(0x080b13,1);
  const pixel=new Uint8Array(4),read=(x,y)=>{r.readRenderTargetPixels(target,Math.max(0,Math.min(target.width-1,Math.floor((x*.5+.5)*target.width))),Math.max(0,Math.min(target.height-1,Math.floor((y*.5+.5)*target.height))),1,1,pixel);return pixel[0];};
  const names={1:'tree',2:'station',3:'district',4:'sea',5:'train',6:'carrier-1',7:'carrier-2',8:'carrier-3',9:'carrier-4',10:'carrier-5',11:'suns'},direct=read(nx,ny);if(names[direct])return names[direct];if(direct===201)return null;
  this.raycaster.setFromCamera(new T.Vector2(nx,ny),this.camera);const hit=this.depthAt(new T.Vector2(nx*.5+.5,ny*.5+.5));
  const candidates=this.carriers.map(c=>({id:c.data.id,p:V(c.data.position),radius:c.data.radius}));candidates.push(...this.cars.map(c=>({id:'train',p:c.mesh.position.clone().add(new T.Vector3(0,0,1.5)),radius:3})));
  const corners=this.data.station.bounds.map(V),p=corners.reduce((s,v)=>s.add(v),new T.Vector3()).multiplyScalar(1/corners.length);candidates.push({id:'station',p,radius:5});
  let best=null,min=25;for(const c of candidates){if(!this.visiblePoint(c.p,c.radius*.2))continue;const q=c.p.clone().project(this.camera),dist=Math.hypot((nx-q.x)*this.cssWidth*.5,(ny-q.y)*this.cssHeight*.5);if(dist<min&&names[read(q.x,q.y)]===c.id){min=dist;best=c.id;}}
  if(best)return best;if(hit.id===5)return 'tree';if(hit.id===2)return 'station';if(hit.id===3)return 'district';if(hit.id===4)return 'sea';return null;
 }
 report(){return {version:'web-v3',view:this.viewName,uvScale:this.uniforms.uUvScale.value.toArray(),userAgent:navigator.userAgent,webgl2:this.renderer.capabilities.isWebGL2,sunsetSeconds:this.seconds,motionSeconds:this.motionSeconds,readyMs:this.readyMs,readyFromNavigationMs:this.readyFromNavigationMs,cssSize:[this.cssWidth,this.cssHeight],renderSize:this.uniforms.uResolution.value.toArray(),quality:this.quality,drawCpuMs:C.stats(this.drawSamples),gpuMs:this.gpuTimer?C.stats(this.gpuTimer.samples):null,frameMs:C.stats(this.frameSamples),longFrames:this.longFrames.slice(-50),renderer:this.lastInfo,meshTriangles:this.data.meshes.map(m=>({name:m.name,triangles:m.triangles})),resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,duration:r.duration})),camera:this.data.camera,footingHeight:this.data.footing_height};}
}
root.BinaryDuskWorld=World;
})(globalThis);
