/* CHROME LITURGY — native Blender geometry / Three.js r128. © h!ro53. */
(function(){'use strict';
var T=window.THREE,P='cyberwafer-r3-',el=function(id){return document.getElementById(id);};
var stage=el('stage'),renderer,scene,camera,objects={},clock=1.2,last=0,ready=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,auto=!paused,photo=false,high=false;
var yaw=.52,pitch=.21,dist=23,target=new T.Vector3(0,3.1,0),yawV=0,pitchV=0,lastInput=0,pump=1000,pulsePeak=1,pointers={},gesture=null,moved=false;
var query=new URLSearchParams(location.search),review=query.has('review'),initialFit=false,fitDistance=23,zoomRatio=1,cubeT,cubeD,cubeTick=0,cubeAt=-1e9,perf=[],intervals=[],mirrorUpdates=0,cubeUpdates=0,fxTarget,fxScene,fxCam,fxMaterial;
if(review){paused=true;auto=false;}
var edition='original',editionBanks={},editionChanges=0,glassPass,assetTextures,photoCache={},switchToken=0;
var mobile=innerWidth<700,mirrorTarget,mirrorCam,mirrorMatrix=new T.Matrix4(),floor,envTexture,pmremTexture,chrome,mirrorAt=-10;
var SLOT_Y=[3,2.45,1.8,1,0,-1.05,-2.15],SLOT_S=[2.05,1.6,1.22,.88,.56,.3,.02],SPEED=[-.42,.60,-.50,.36];
function discPose(u){if(u<14.28){var i=Math.min(5,Math.floor(u/2.38)),f=(u-i*2.38)/2.38;return [SLOT_Y[i]+(SLOT_Y[i+1]-SLOT_Y[i])*f,SLOT_S[i]+(SLOT_S[i+1]-SLOT_S[i])*f];}if(u<14.32)return[-2.15,.02*(1-(u-14.28)/.04)];if(u<14.36)return[u<14.34?-2.15:3,0];return[3,2.05*(u-14.36)/.04];}
function heartWave(ph){var p=ph-Math.floor(ph);return Math.pow(Math.max(Math.sin(p*Math.PI*2),0),3)+.45*Math.pow(Math.max(Math.sin((p-.32)*Math.PI*2),0),5);}
function response(url,type){return fetch(url).then(function(r){if(!r.ok)throw Error('Missing asset: '+url);return type==='json'?r.json():r.arrayBuffer();});}
function tex(url,srgb){return new Promise(function(resolve,reject){new T.TextureLoader().load(url,function(t){t.encoding=srgb?T.sRGBEncoding:T.LinearEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());resolve(t);},undefined,reject);});}
function fail(e){console.error(e);el('loading').className='failed';el('loading').innerHTML='<p>The model could not be loaded.</p><a href="cyberwafer-r3-original-hero.jpg">Open the Cycles photograph</a><p><a href="chrome-liturgy.html">Reload</a></p>';el('photograph').hidden=false;}
try{
 renderer=new T.WebGLRenderer({antialias:innerWidth>=700,alpha:false,powerPreference:'high-performance'});renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.physicallyCorrectLights=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;stage.appendChild(renderer.domElement);
 scene=new T.Scene();scene.background=new T.Color(0x17232a);camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.1,150);
 mirrorTarget=new T.WebGLRenderTarget(mobile?384:640,mobile?384:640,{type:T.HalfFloatType,format:T.RGBAFormat});mirrorCam=new T.PerspectiveCamera();
 fxTarget=new T.WebGLRenderTarget(1,1);fxTarget.texture.encoding=T.sRGBEncoding;fxScene=new T.Scene();fxCam=new T.OrthographicCamera(-1,1,1,-1,0,1);fxMaterial=new T.ShaderMaterial({uniforms:T.UniformsUtils.clone(T.FXAAShader.uniforms),vertexShader:T.FXAAShader.vertexShader,fragmentShader:T.FXAAShader.fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});fxMaterial.uniforms.tDiffuse.value=fxTarget.texture;fxScene.add(new T.Mesh(new T.PlaneGeometry(2,2),fxMaterial));
 var key=new T.DirectionalLight(0xffeadd,.95);key.position.set(-7,9,4);key.target.position.set(0,3,0);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.camera.near=.1;key.shadow.camera.far=35;key.shadow.bias=-.00012;key.shadow.normalBias=.002;scene.add(key,key.target);
 var rim=new T.DirectionalLight(0xc4ddff,.7);rim.position.set(5,7,-3);scene.add(rim);scene.add(new T.AmbientLight(0x9db6c4,.12));
 var back=new T.DirectionalLight(0xa8e5d9,.7);back.position.set(-3,2,-9);scene.add(back);
 cubeT=new T.CubeCamera(.12,130,new T.WebGLCubeRenderTarget(128,{type:T.HalfFloatType,format:T.RGBAFormat}));cubeT.position.set(0,6,0);
 cubeD=new T.CubeCamera(.12,130,new T.WebGLCubeRenderTarget(128,{type:T.HalfFloatType,format:T.RGBAFormat}));cubeD.position.set(0,3,0);
}catch(e){fail(e);return;}
function geometry(d,buffer){var g=new T.BufferGeometry(),n=d.vertices,offset=n*3*4;g.setAttribute('position',new T.BufferAttribute(new Float32Array(buffer,0,n*3),3));g.setAttribute('normal',new T.BufferAttribute(new Float32Array(buffer,offset,n*3),3));g.setAttribute('uv',new T.BufferAttribute(new Float32Array(buffer,offset*2,n*2),2));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,n*8*4,d.indices),1));(d.groups||[]).forEach(function(v){g.addGroup(v.start,v.count,v.materialIndex);});g.computeBoundingSphere();return g;}

function surface(mat,kind){
 mat.onBeforeCompile=function(sh){
  sh.uniforms.localReflection={value:kind==='t'?cubeT.renderTarget.texture:cubeD.renderTarget.texture};
  sh.vertexShader='varying vec3 vLocal; varying vec3 vRealWorld;\n'+sh.vertexShader;
  sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLocal=position;vRealWorld=(modelMatrix*vec4(position,1.0)).xyz;');
  sh.fragmentShader='varying vec3 vLocal;varying vec3 vRealWorld;uniform samplerCube localReflection;\nfloat h53noise(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}\n'+sh.fragmentShader;
  var finish=kind==='t'?[
   'float structure=.5+.5*sin(vLocal.y*165.0+sin(vLocal.x*19.0)*.75+sin(vLocal.y*37.0)*.32);',
   'float aa=1.0-smoothstep(.3,1.3,fwidth(vLocal.y*165.0));structure=mix(.5,structure,aa);',
   'diffuseColor.rgb=mix(vec3(.43,.026,.145),vec3(.60,.048,.21),structure*.46+.27);'
  ].join('\n'):'float radius=length(vLocal.xz);float aa=1.0-smoothstep(.3,1.5,fwidth(radius*6400.0));diffuseColor.rgb*=1.0+.035*sin(radius*6400.0)*aa;';
  sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+finish);
  var tail=[
   'vec3 wn=normalize(inverseTransformDirection(normal,viewMatrix));vec3 vv=normalize(cameraPosition-vRealWorld);',
   'vec3 rr=reflect(-vv,wn);vec3 local=textureCube(localReflection,rr).rgb;',
   'float grazing=pow(1.0-max(dot(wn,vv),0.0),2.0);'
  ];
  if(kind==='t')tail.push('vec2 cp=vLocal.xy*vec2(4.0,7.0);vec2 cell=floor(cp);float grain=1.0;float orient=0.0;for(int a=-1;a<=1;a++){for(int b=-1;b<=1;b++){vec2 c=cell+vec2(float(a),float(b));vec2 seed=vec2(h53noise(vec3(c,1.0)),h53noise(vec3(c,2.0)));float dd=length(c+seed-cp);if(dd<grain){grain=dd;orient=seed.x;}}}float optical=225.0+30.0*grain;vec3 film=.5+.5*cos(6.2831853*(2.0*1.42*optical*sqrt(1.0-pow(sqrt(1.0-pow(max(dot(wn,vv),0.0),2.0))/1.42,2.0)))/vec3(650.0,510.0,475.0));outgoingLight*=mix(vec3(1.0),.65+.65*film,.22+.14*grazing);outgoingLight*=.92+.08*cos(orient*6.28+atan(vv.x,vv.z));outgoingLight+=local*diffuseColor.rgb*.12;');
  else tail.push('outgoingLight+=local*(.12+.09*grazing);');
  tail.push('gl_FragColor = vec4( outgoingLight, diffuseColor.a );');
  sh.fragmentShader=sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',tail.join('\n'));
 };
 mat.customProgramCacheKey=function(){return 'r1-surface-'+kind;};
}

function originalSurface(mat,kind){
 mat.onBeforeCompile=function(sh){
  sh.uniforms.sourceColor={value:kind==='t'?assetTextures.gradient:assetTextures.wafer};sh.uniforms.sourceEmission={value:assetTextures.emission};
  sh.vertexShader='varying vec3 vOriginal;\n'+sh.vertexShader;sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOriginal=position;');
  sh.fragmentShader='varying vec3 vOriginal;uniform sampler2D sourceColor;uniform sampler2D sourceEmission;\n'+sh.fragmentShader;
  var uv=kind==='t'?'vec2(.5,clamp((vOriginal.y-3.5)/4.77,0.0,1.0))':'vec2(vOriginal.x*.5+.5,-vOriginal.z*.5+.5)';
  sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nvec2 sourceUV='+uv+';diffuseColor.rgb=pow(texture2D(sourceColor,sourceUV).rgb,vec3(2.2));');
  if(kind==='t')sh.fragmentShader=sh.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance=pow(texture2D(sourceEmission,sourceUV).rgb,vec3(2.2))*.20;');
  else sh.fragmentShader=sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );','float nv=clamp(dot(normal,geometry.viewDir),0.0,1.0);vec3 film=.94+.06*cos(vec3(1.0,1.3,1.65)*(1.0-nv)*2.2);outgoingLight*=film;gl_FragColor=vec4(outgoingLight,diffuseColor.a);');
 };mat.customProgramCacheKey=function(){return 'r2-original-'+kind;};
}
function setPhoto(e){var token=++switchToken,path=P+e+'-hero.jpg';var im=photoCache[e];if(!im){im=new Image();photoCache[e]=im;im.src=path;}function use(){if(token!==switchToken||e!==edition)return;el('photograph').src=path;el('photograph').alt=e+' / Cycles';}if(im.complete&&im.naturalWidth)use();else im.onload=use;}
function applyEdition(next){if(!editionBanks[next])next='original';var bank=editionBanks[next];Object.keys(objects).forEach(function(n){if(n==='T'||n.indexOf('Ring')===0||n.indexOf('Disc')===0){objects[n].material=bank[n.indexOf('Disc')===0?'DiscTop':n];objects[n].castShadow=next!=='glass';}});edition=next;editionChanges++;perf=[];intervals=[];['original','glass','metal'].forEach(function(e){el('edition-'+e).setAttribute('aria-pressed',String(e===edition));});mirrorAt=cubeAt=-1e9;setPhoto(edition);if(ready)diagnostics();}
['original','glass','metal'].forEach(function(e){el('edition-'+e).onclick=function(){if(ready)applyEdition(e);};});
/* Controls rest at low opacity while the work is being watched and return on any input. */
var idleTimer=0;function wake(){document.body.classList.remove('idle');clearTimeout(idleTimer);idleTimer=setTimeout(function(){document.body.classList.add('idle');},4000);}
['pointerdown','pointermove','keydown','wheel','touchstart'].forEach(function(t){window.addEventListener(t,wake,{passive:true});});wake();

function floorShader(mat){mat.onBeforeCompile=function(sh){
 sh.uniforms.mirrorTex={value:mirrorTarget.texture};sh.uniforms.mirrorMatrix={value:mirrorMatrix};
 sh.vertexShader='uniform mat4 mirrorMatrix;varying vec4 vMirror;varying vec3 vFloorWorld;\n'+sh.vertexShader;
 sh.vertexShader=sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 fw=modelMatrix*vec4(transformed,1.0);vMirror=mirrorMatrix*fw;vFloorWorld=fw.xyz;');
 sh.fragmentShader='uniform sampler2D mirrorTex;varying vec4 vMirror;varying vec3 vFloorWorld;\n'+sh.fragmentShader;
 sh.fragmentShader=sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',[
  'vec2 uv=vMirror.xy/vMirror.w;vec3 refl=vec3(0.0);float blur=.0018+.00012*length(cameraPosition-vFloorWorld);',
  'for(int a=-1;a<=1;a++){for(int b=-1;b<=1;b++){refl+=texture2D(mirrorTex,uv+vec2(float(a),float(b))*blur).rgb/9.0;}}',
  'float fr=.07+.43*pow(1.0-abs(normalize(cameraPosition-vFloorWorld).y),5.0);',
  'if(vMirror.w>0.0&&uv.x>0.0&&uv.x<1.0&&uv.y>0.0&&uv.y<1.0)outgoingLight=mix(outgoingLight,refl,fr*(1.0-smoothstep(16.0,22.0,length(vFloorWorld.xz))));',
  'gl_FragColor=vec4(outgoingLight,diffuseColor.a);'
 ].join('\n'));
};}
Promise.all([response(query.get('qa')==='missing'?P+'missing-test.json':P+'scene.json','json'),response(P+'space.f16'),tex(P+'gradHo.png',true),tex(P+'gradEm.png',true),tex(P+'waferD.png',true)]).then(function(data){
 var spec=data[0];assetTextures={gradient:data[2],emission:data[3],wafer:data[4]};envTexture=new T.DataTexture(new Uint16Array(data[1]),1024,512,T.RGBAFormat,T.HalfFloatType);envTexture.encoding=T.LinearEncoding;envTexture.mapping=T.EquirectangularReflectionMapping;envTexture.needsUpdate=true;
 var gen=new T.PMREMGenerator(renderer);pmremTexture=gen.fromEquirectangular(envTexture).texture;scene.environment=pmremTexture;gen.dispose();envTexture.minFilter=T.LinearFilter;envTexture.magFilter=T.LinearFilter;
 var materials={};Object.keys(spec.materials).forEach(function(name){var d=spec.materials[name],m=new T.MeshPhysicalMaterial({color:new T.Color().fromArray(d.color),metalness:d.metalness,roughness:d.roughness,clearcoat:d.clearcoat,clearcoatRoughness:d.clearcoatRoughness,emissive:new T.Color().fromArray(d.emissive),emissiveIntensity:d.emissiveIntensity,envMapIntensity:1});
  if(name.indexOf('R2 Metal / T')===0){surface(m,'t');m.envMapIntensity=1.75;}if(name.indexOf('R2 Metal / disc')===0){surface(m,'disc');m.envMapIntensity=1.35;}if(name.indexOf('space /')>=0){m.side=T.DoubleSide;m.envMapIntensity=.38;}materials[name]=m;
 });
 Object.keys(spec.editions).forEach(function(e){var bank={};Object.keys(spec.editions[e]).forEach(function(n){bank[n]=spec.editions[e][n].map(function(d){var m=new T.MeshPhysicalMaterial({color:new T.Color().fromArray(d.color),metalness:d.metalness,roughness:d.roughness,clearcoat:d.clearcoat,clearcoatRoughness:d.clearcoatRoughness,emissive:new T.Color().fromArray(d.emissive),emissiveIntensity:d.emissiveIntensity,envMapIntensity:n==='T'?1.75:1.35});
 if(e==='metal'&&n==='T')surface(m,'t');if(e==='metal'&&n==='DiscTop')surface(m,'disc');
 if(e==='original'&&(n==='T'||n==='DiscTop'))originalSurface(m,n==='T'?'t':'disc');
 if(e==='glass'){m.transmission=1;m.ior=1.46;m.thickness=n==='T'?1.05:n==='DiscTop'?.07:.095;m.transparent=false;m.opacity=1;}
 return m;});});editionBanks[e]=bank;});var done=0;
 return Promise.all(spec.meshes.map(function(d){return response(d.file).then(function(buffer){if(buffer.byteLength!==d.bytes)throw Error('Geometry size mismatch: '+d.name);
  var mm=d.materials.map(function(n){return materials[n];});if(d.name==='SpaceFloor'){mm=mm.map(function(m){var c=m.clone();floorShader(c);return c;});}var o=new T.Mesh(geometry(d,buffer),mm);o.name=d.name;o.position.fromArray(d.position);o.scale.fromArray(d.scale);o.castShadow=d.name.indexOf('Space')!==0;o.receiveShadow=true;scene.add(o);objects[d.name]=o;if(d.name==='SpaceFloor')floor=o;
  el('loadText').textContent='素材と光を読み込んでいます '+(++done)+' / '+spec.meshes.length;
 });}));
}).then(function(){
 for(var i=0;i<6;i++){var o=objects.DiscTop.clone();o.name='Disc'+i;scene.add(o);objects[o.name]=o;}
 glassPass=window.CyberwaferGlass(T,renderer,scene,camera,objects,envTexture);applyEdition(query.get('edition')||'original');ready=true;resize();if(review){yaw=Math.atan2(11,19);pitch=Math.atan2(4.9,Math.hypot(11,19));dist=Math.hypot(11,19,4.9);camera.fov=2*Math.atan(36/120)*180/Math.PI;camera.updateProjectionMatrix();}updateModel(0);updateCamera();updateCubes();updateCubes();el('loading').hidden=true;requestAnimationFrame(frame);
}).catch(fail);
function updateModel(dt){pump+=dt;var scale=1+.05*heartWave(pump/.78)*Math.exp(-1.6*pump);pulsePeak=Math.max(pulsePeak,scale);objects.T.position.y=.18*Math.sin(2*Math.PI*clock/8);objects.DiscTop.scale.setScalar(2.05*scale);for(var k=0;k<4;k++)objects['Ring'+k].rotation.y=SPEED[k]*clock;for(var i=0;i<6;i++){var p=discPose(((clock-i*2.4)%14.4+14.4)%14.4),o=objects['Disc'+i];o.position.y=p[0];o.scale.setScalar(p[1]*scale);o.visible=p[1]>=.0001&&!(Math.abs(p[0]-3)<1e-7&&Math.abs(p[1]-2.05)<1e-7);}}
function floorHeight(r,yaw){var rr=[0,22,26,30,34,38,41,42],zz=[-2.7,-2.7,-2.68,-2.3,-1.25,.5,2.8,4.6],h=-2.7;for(var j=0;j<rr.length-1;j++){if(r>=rr[j]&&r<=rr[j+1]){h=zz[j]+(zz[j+1]-zz[j])*(r-rr[j])/(rr[j+1]-rr[j]);break;}}var a=yaw-Math.PI/2;return h+Math.max(0,Math.min(1,(r-25)/15))*(1.2*Math.sin(a+.5)+.65*Math.sin(2*a));}
function updateCamera(){for(var safe=0;safe<3;safe++){var ground=floorHeight(dist*Math.cos(pitch),yaw);pitch=Math.max(pitch,Math.asin(Math.max(-1,Math.min(1,(ground+.65-target.y)/dist))));}var cp=Math.cos(pitch);camera.position.set(target.x+dist*cp*Math.sin(yaw),target.y+dist*Math.sin(pitch),target.z+dist*cp*Math.cos(yaw));camera.lookAt(target);camera.updateMatrixWorld();}
function reflect(){
 floor.visible=false;mirrorCam.copy(camera);mirrorCam.position.y=2*(-2.7)-camera.position.y;mirrorCam.up.set(0,-1,0);mirrorCam.lookAt(target.x,-5.4-target.y,target.z);mirrorCam.updateMatrixWorld();
 mirrorMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);mirrorMatrix.multiply(mirrorCam.projectionMatrix).multiply(mirrorCam.matrixWorldInverse);
 var old=renderer.getRenderTarget(),tone=renderer.toneMapping;renderer.toneMapping=T.NoToneMapping;renderer.clippingPlanes=[new T.Plane(new T.Vector3(0,1,0),2.69)];renderer.setRenderTarget(mirrorTarget);renderer.render(scene,mirrorCam);renderer.setRenderTarget(old);renderer.clippingPlanes=[];floor.visible=true;renderer.toneMapping=tone;
}

function updateCubes(){
 var useT=(cubeTick++%2===0),cam=useT?cubeT:cubeD,hidden=[];
 Object.keys(objects).forEach(function(n){if((useT&&n==='T')||(!useT&&n.indexOf('Disc')===0)){hidden.push([objects[n],objects[n].visible]);objects[n].visible=false;}});
 var tone=renderer.toneMapping;renderer.toneMapping=T.NoToneMapping;cam.update(renderer,scene);renderer.toneMapping=tone;
 hidden.forEach(function(p){p[0].visible=p[1];});cubeUpdates++;
}
function diagnostics(){
 var a=perf.slice().sort(function(a,b){return a-b;}),iv=intervals.slice().sort(function(a,b){return a-b;}),info=renderer.info,gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
 var d={edition:edition,editionChanges:editionChanges,pump:pump,glass:glassPass?glassPass.info():null,materialBankCount:Object.keys(editionBanks).length,viewport:[innerWidth,innerHeight],pixelRatio:renderer.getPixelRatio(),phase:clock,paused:paused,photo:photo,high:high,camera:camera.position.toArray(),distance:dist,pulsePeak:pulsePeak,frames:a.length,submitMsMedian:a.length?a[Math.floor(a.length*.5)]:0,submitMsP95:a.length?a[Math.floor(a.length*.95)]:0,frameIntervalMedian:iv.length?iv[Math.floor(iv.length*.5)]:0,frameIntervalP95:iv.length?iv[Math.floor(iv.length*.95)]:0,drawCalls:info.render.calls,triangles:info.render.triangles,geometries:info.memory.geometries,textures:info.memory.textures,mirrorUpdates:mirrorUpdates,cubeUpdates:cubeUpdates,renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),jsHeap:performance.memory?performance.memory.usedJSHeapSize:null};
 var e=el('diagnostics');if(e)e.textContent=JSON.stringify(d,null,2);stage.dataset.view=JSON.stringify(d);return d;
}

function frame(ms){var frameStart=performance.now();requestAnimationFrame(frame);if(!last)last=ms;var rawFrameMs=ms-last;var dt=Math.min(.1,rawFrameMs/1000);if(mobile&&ms-last<31)return;last=ms;if(document.hidden||photo||!ready)return;
 if(!paused){clock+=dt;updateModel(dt);}if(Object.keys(pointers).length===0){yaw+=yawV;pitch=Math.max(-.14,Math.min(.9,pitch+pitchV));yawV*=.89;pitchV*=.89;if(auto&&!paused&&ms-lastInput>4000)yaw+=.06*dt;}
 updateCamera();if(ms-mirrorAt>(high?30:mobile?100:60)){reflect();mirrorUpdates++;mirrorAt=ms;}if(ms-cubeAt>(high?180:mobile?550:300)){updateCubes();cubeAt=ms;}renderer.info.autoReset=false;renderer.info.reset();if(edition==='glass'){glassPass.render(fxTarget,high);}else{renderer.setRenderTarget(fxTarget);renderer.render(scene,camera);}renderer.setRenderTarget(null);renderer.render(fxScene,fxCam);renderer.info.autoReset=true;perf.push(performance.now()-frameStart);intervals.push(rawFrameMs);if(perf.length>300){perf.shift();intervals.shift();}if(perf.length%30===0)diagnostics();
}
function resize(){var w=innerWidth,h=innerHeight;mobile=w<700;renderer.setPixelRatio(Math.min(devicePixelRatio,high?1.5:mobile?1.2:1.5));renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
 var px=renderer.getPixelRatio();fxTarget.setSize(Math.round(w*px),Math.round(h*px));fxMaterial.uniforms.resolution.value.set(1/(w*px),1/(h*px));var head=document.querySelector('header').getBoundingClientRect(),title=el('title').getBoundingClientRect(),controls=el('editionPicker').getBoundingClientRect();var top=Math.max(head.bottom,title.bottom)+30,bottom=controls.top-24,usable=Math.max(.3,(bottom-top)/h);
 var next=Math.max(21,10.9/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*usable),5.8/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect));
 if(!initialFit){dist=next;initialFit=true;}else if(!review){dist=Math.max(7,Math.min(38,dist/fitDistance*next));}fitDistance=next;mirrorAt=-1e9;}
function touched(){lastInput=performance.now();}
stage.addEventListener('pointerdown',function(e){if(!ready)return;stage.setPointerCapture(e.pointerId);pointers[e.pointerId]={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY};moved=false;touched();var p=Object.values(pointers);if(p.length===2)gesture={length:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),dist:dist};});
stage.addEventListener('pointermove',function(e){var p=pointers[e.pointerId];if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(Math.hypot(p.x-p.sx,p.y-p.sy)>5)moved=true;var points=Object.values(pointers);if(points.length===1){yaw-=dx*.006;pitch=Math.max(-.14,Math.min(.9,pitch+dy*.004));yawV=-dx*.0007;pitchV=dy*.0004;}else if(gesture){dist=Math.max(7,Math.min(38,gesture.dist*gesture.length/Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y))));}touched();});
function release(e){if(!pointers[e.pointerId])return;if(!moved&&Object.keys(pointers).length===1&&e.type==='pointerup'){pump=0;pulsePeak=1;}delete pointers[e.pointerId];gesture=null;touched();}
stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
stage.addEventListener('wheel',function(e){e.preventDefault();dist=Math.max(7,Math.min(38,dist*Math.exp(e.deltaY*.001)));touched();},{passive:false});
stage.addEventListener('keydown',function(e){var handled=true;if(e.key==='ArrowLeft')yaw-=.08;else if(e.key==='ArrowRight')yaw+=.08;else if(e.key==='ArrowUp')pitch=Math.min(.9,pitch+.05);else if(e.key==='ArrowDown')pitch=Math.max(-.14,pitch-.05);else if(e.key==='+'||e.key==='=')dist=Math.max(7,dist-1);else if(e.key==='-')dist=Math.min(38,dist+1);else if(e.key===' ')el('pause').click();else handled=false;if(handled){e.preventDefault();touched();}});
function pauseLabel(){el('pause').textContent=paused?'Resume':'Pause';el('pause').setAttribute('aria-pressed',String(paused));}pauseLabel();
el('pause').onclick=function(){paused=!paused;pauseLabel();};
el('reset').onclick=function(){yaw=.52;pitch=.21;yawV=pitchV=0;gesture=null;target.set(0,3.1,0);initialFit=false;resize();touched();};
el('photo').onclick=function(){photo=!photo;if(photo)setPhoto(edition);el('photograph').hidden=!photo;document.body.classList.toggle('photographic',photo);el('photo').textContent=photo?'Model':'Photo';el('photo').setAttribute('aria-pressed',String(photo));};
el('quality').onclick=function(){high=!high;el('quality').textContent=high?'Quality · High':'Quality · Standard';el('quality').setAttribute('aria-pressed',String(high));resize();};
window.addEventListener('error',function(e){fail(e.error||e.message);});window.addEventListener('unhandledrejection',function(e){fail(e.reason);});window.addEventListener('resize',resize);document.addEventListener('visibilitychange',function(){last=0;});renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();ready=false;fail(Error('WebGL context lost'));});resize();
}());
