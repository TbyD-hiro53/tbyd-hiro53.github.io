/* CHROME LITURGY — native Blender geometry / Three.js r128. © h!ro53. */
(function(){'use strict';
var T=window.THREE,P='chrome-liturgy-v1-',el=function(id){return document.getElementById(id);};
var stage=el('stage'),renderer,scene,camera,objects={},clock=0,last=0,ready=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,auto=!paused,photo=false,high=false;
var yaw=.52,pitch=.21,dist=23,target=new T.Vector3(0,3.1,0),yawV=0,pitchV=0,lastInput=0,pump=1000,pointers={},gesture=null,moved=false;
var mobile=innerWidth<700,mirrorTarget,mirrorCam,mirrorMatrix=new T.Matrix4(),floor,envTexture,pmremTexture,chrome,mirrorAt=-10;
var SLOT_Y=[3,2.45,1.8,1,0,-1.05,-2.15],SLOT_S=[2.05,1.6,1.22,.88,.56,.3,.02],SPEED=[-.42,.60,-.50,.36];
function discPose(u){if(u<14.28){var i=Math.min(5,Math.floor(u/2.38)),f=(u-i*2.38)/2.38;return [SLOT_Y[i]+(SLOT_Y[i+1]-SLOT_Y[i])*f,SLOT_S[i]+(SLOT_S[i+1]-SLOT_S[i])*f];}if(u<14.32)return[-2.15,.02*(1-(u-14.28)/.04)];if(u<14.36)return[u<14.34?-2.15:3,0];return[3,2.05*(u-14.36)/.04];}
function heartWave(ph){var p=ph-Math.floor(ph);return Math.pow(Math.max(Math.sin(p*Math.PI*2),0),3)+.45*Math.pow(Math.max(Math.sin((p-.32)*Math.PI*2),0),5);}
function response(url,type){return fetch(url).then(function(r){if(!r.ok)throw Error('Missing asset: '+url);return type==='json'?r.json():r.arrayBuffer();});}
function tex(url,srgb){return new Promise(function(resolve,reject){new T.TextureLoader().load(url,function(t){t.encoding=srgb?T.sRGBEncoding:T.LinearEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());resolve(t);},undefined,reject);});}
function fail(e){console.error(e);el('loading').className='failed';el('loading').innerHTML='<p>立体の読み込みができませんでした。</p><a href="chrome-liturgy-v1-hero.jpg">Blenderで描いた写真を開く</a><p><a href="chrome-liturgy.html">もう一度読み込む</a></p>';el('photograph').hidden=false;}
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.physicallyCorrectLights=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;stage.appendChild(renderer.domElement);
 scene=new T.Scene();scene.background=new T.Color(0x101318);scene.fog=new T.Fog(0x101318,35,80);camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.1,150);
 mirrorTarget=new T.WebGLRenderTarget(mobile?384:640,mobile?384:640,{type:T.HalfFloatType,format:T.RGBAFormat});mirrorCam=new T.PerspectiveCamera();
 var key=new T.DirectionalLight(0xffeadd,2.8);key.position.set(-7,9,4);key.target.position.set(0,3,0);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.camera.near=.1;key.shadow.camera.far=35;key.shadow.bias=-.00012;key.shadow.normalBias=.025;scene.add(key,key.target);
 var rim=new T.DirectionalLight(0xc4ddff,2);rim.position.set(5,7,-3);scene.add(rim);scene.add(new T.HemisphereLight(0xb8cbdc,0x15191e,.15));
}catch(e){fail(e);return;}
function geometry(d,buffer){var g=new T.BufferGeometry(),n=d.vertices,offset=n*3*4;g.setAttribute('position',new T.BufferAttribute(new Float32Array(buffer,0,n*3),3));g.setAttribute('normal',new T.BufferAttribute(new Float32Array(buffer,offset,n*3),3));g.setAttribute('uv',new T.BufferAttribute(new Float32Array(buffer,offset*2,n*2),2));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,n*8*4,d.indices),1));g.computeBoundingSphere();return g;}
var maps=Promise.all([tex(P+'t-color.png',true),tex(P+'t-roughness.png'),tex(P+'t-normal.png'),tex(P+'disctop-roughness.png'),tex(P+'disctop-normal.png'),tex(P+'floor-light.png',true)]);
Promise.all([response(P+'scene.json','json'),maps,response(P+'studio.f16'),response(P+'t-studio.f16')]).then(function(data){
 var spec=data[0],m=data[1];envTexture=new T.DataTexture(new Uint16Array(data[2]),1024,512,T.RGBAFormat,T.HalfFloatType);envTexture.encoding=T.LinearEncoding;envTexture.mapping=T.EquirectangularReflectionMapping;envTexture.needsUpdate=true;var gen=new T.PMREMGenerator(renderer);gen.compileEquirectangularShader();pmremTexture=gen.fromEquirectangular(envTexture).texture;scene.environment=pmremTexture;gen.dispose();
 var tmat=new T.MeshPhysicalMaterial({map:m[0],metalness:.92,roughness:1,roughnessMap:m[1],normalMap:m[2],normalScale:new T.Vector2(1,1),clearcoat:.48,clearcoatRoughness:.16,envMapIntensity:2.8});
 var tp=new T.DataTexture(new Uint16Array(data[3]),1024,512,T.RGBAFormat,T.HalfFloatType);tp.encoding=T.LinearEncoding;tp.mapping=T.EquirectangularReflectionMapping;tp.needsUpdate=true;var tg=new T.PMREMGenerator(renderer);tmat.envMap=tg.fromEquirectangular(tp).texture;tg.dispose();tp.dispose();
 chrome=new T.MeshPhysicalMaterial({color:0xd0d9df,metalness:1,roughness:1,roughnessMap:m[3],normalMap:m[4],normalScale:new T.Vector2(1,1),clearcoat:.24,clearcoatRoughness:.13,envMapIntensity:.22});
 var cyan=new T.MeshPhysicalMaterial({color:new T.Color(.012,.62,.53),metalness:.12,roughness:.2,emissive:new T.Color(.012,.62,.53),emissiveIntensity:.55,clearcoat:.5,clearcoatRoughness:.12});
 var ivory=cyan.clone();ivory.color.setRGB(.82,.86,.8);ivory.emissive.copy(ivory.color);ivory.emissiveIntensity=.32;
 var floorMat=new T.MeshBasicMaterial({map:m[5]});
 floorMat.onBeforeCompile=function(shader){
  shader.uniforms.mirrorTex={value:mirrorTarget.texture};shader.uniforms.mirrorMatrix={value:mirrorMatrix};shader.uniforms.floorLight={value:m[5]};
  shader.vertexShader='uniform mat4 mirrorMatrix; varying vec4 vMirror; varying vec3 vFloorWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 floorWorld=modelMatrix*vec4(transformed,1.0); vMirror=mirrorMatrix*floorWorld;vFloorWorld=floorWorld.xyz;');
  shader.fragmentShader='uniform sampler2D mirrorTex;uniform sampler2D floorLight;varying vec4 vMirror;varying vec3 vFloorWorld;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',[
   'outgoingLight=mapTexelToLinear(texture2D(floorLight,vec2(vFloorWorld.x,-vFloorWorld.z)/16.0+.5)).rgb;',
   'vec2 muv=vMirror.xy/vMirror.w;vec3 reflected=vec3(0.0);',
   'for(int a=-1;a<=1;a++){for(int b=-1;b<=1;b++){reflected+=texture2D(mirrorTex,muv+vec2(float(a),float(b))*.0035).rgb/9.0;}}',
   'float fres=.04+.40*pow(1.0-abs(normalize(cameraPosition-vFloorWorld).y),5.0);',
   'if(vMirror.w>0.0 && muv.x>0.0 && muv.x<1.0 && muv.y>0.0 && muv.y<1.0)outgoingLight=mix(outgoingLight,reflected,fres);',
   'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'
  ].join('\n'));
 };
 var wallMat=new T.MeshStandardMaterial({color:new T.Color(.018,.023,.03),roughness:.76});var done=0;
 return Promise.all(spec.meshes.map(function(d){return response(d.file).then(function(buffer){
  if(buffer.byteLength!==d.bytes)throw Error('Geometry size mismatch: '+d.name);
  var mat=d.name==='T'?tmat:d.name==='DiscTop'?chrome:d.name==='GalleryFloor'?floorMat:d.name==='GalleryWall'?wallMat:d.name==='Ring3'?ivory:cyan;
  var o=new T.Mesh(geometry(d,buffer),mat);o.name=d.name;o.position.fromArray(d.position);o.scale.fromArray(d.scale);o.castShadow=d.name.indexOf('Gallery')!==0;o.receiveShadow=true;if(d.name==='GalleryWall')o.visible=false;scene.add(o);objects[d.name]=o;if(d.name==='GalleryFloor')floor=o;
  el('loadText').textContent='素材と光を読み込んでいます '+(++done)+' / '+spec.meshes.length;
 });}));
}).then(function(){
 for(var i=0;i<6;i++){var o=objects.DiscTop.clone();o.name='Disc'+i;scene.add(o);objects[o.name]=o;}
 ready=true;resize();updateModel(0);updateCamera();el('loading').hidden=true;requestAnimationFrame(frame);
}).catch(fail);
function updateModel(dt){pump+=dt;var scale=1+.05*heartWave(pump/.78)*Math.exp(-1.6*pump);objects.T.position.y=.18*Math.sin(2*Math.PI*clock/8);objects.DiscTop.scale.setScalar(2.05*scale);for(var k=0;k<4;k++)objects['Ring'+k].rotation.y=SPEED[k]*clock;for(var i=0;i<6;i++){var p=discPose(((clock-i*2.4)%14.4+14.4)%14.4),o=objects['Disc'+i];o.position.y=p[0];o.scale.setScalar(p[1]*scale);o.visible=p[1]>=.0001&&!(Math.abs(p[0]-3)<1e-7&&Math.abs(p[1]-2.05)<1e-7);}}
function updateCamera(){var cp=Math.cos(pitch);camera.position.set(target.x+dist*cp*Math.sin(yaw),target.y+dist*Math.sin(pitch),target.z+dist*cp*Math.cos(yaw));camera.lookAt(target);camera.updateMatrixWorld();}
function reflect(){
 floor.visible=false;mirrorCam.copy(camera);mirrorCam.position.y=2*(-2.7)-camera.position.y;mirrorCam.up.set(0,-1,0);mirrorCam.lookAt(target.x,-5.4-target.y,target.z);mirrorCam.updateMatrixWorld();
 mirrorMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);mirrorMatrix.multiply(mirrorCam.projectionMatrix).multiply(mirrorCam.matrixWorldInverse);
 var old=renderer.getRenderTarget(),tone=renderer.toneMapping;renderer.toneMapping=T.NoToneMapping;renderer.clippingPlanes=[new T.Plane(new T.Vector3(0,1,0),2.69)];renderer.setRenderTarget(mirrorTarget);renderer.render(scene,mirrorCam);renderer.setRenderTarget(old);renderer.clippingPlanes=[];floor.visible=true;renderer.toneMapping=tone;
}
function frame(ms){requestAnimationFrame(frame);if(!last)last=ms;var dt=Math.min(.1,(ms-last)/1000);if(mobile&&ms-last<31)return;last=ms;if(document.hidden||photo||!ready)return;
 if(!paused){clock+=dt;updateModel(dt);}if(Object.keys(pointers).length===0){yaw+=yawV;pitch=Math.max(-.14,Math.min(.9,pitch+pitchV));yawV*=.89;pitchV*=.89;if(auto&&!paused&&ms-lastInput>4000)yaw+=.06*dt;}
 updateCamera();if(ms-mirrorAt>(high?30:mobile?100:60)){reflect();mirrorAt=ms;}renderer.setRenderTarget(null);renderer.render(scene,camera);
}
function resize(){var w=innerWidth,h=innerHeight;mobile=w<700;renderer.setPixelRatio(Math.min(devicePixelRatio,high?2:mobile?1.2:1.5));renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(!gesture){var usable=Math.max(.45,(h-(mobile?230:180))/h);dist=Math.max(21,10.9/(2*Math.tan(T.MathUtils.degToRad(18))*usable),5.8/(2*Math.tan(T.MathUtils.degToRad(18))*camera.aspect));}mirrorAt=-1e9;}
function touched(){lastInput=performance.now();}
stage.addEventListener('pointerdown',function(e){if(!ready)return;stage.setPointerCapture(e.pointerId);pointers[e.pointerId]={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY};moved=false;touched();var p=Object.values(pointers);if(p.length===2)gesture={length:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),dist:dist};});
stage.addEventListener('pointermove',function(e){var p=pointers[e.pointerId];if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(Math.hypot(p.x-p.sx,p.y-p.sy)>5)moved=true;var points=Object.values(pointers);if(points.length===1){yaw-=dx*.006;pitch=Math.max(-.14,Math.min(.9,pitch+dy*.004));yawV=-dx*.0007;pitchV=dy*.0004;}else if(gesture){dist=Math.max(7,Math.min(38,gesture.dist*gesture.length/Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y))));}touched();});
function release(e){if(!pointers[e.pointerId])return;if(!moved&&Object.keys(pointers).length===1&&e.type==='pointerup')pump=0;delete pointers[e.pointerId];gesture=null;touched();}
stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
stage.addEventListener('wheel',function(e){e.preventDefault();dist=Math.max(7,Math.min(38,dist*Math.exp(e.deltaY*.001)));touched();},{passive:false});
stage.addEventListener('keydown',function(e){var handled=true;if(e.key==='ArrowLeft')yaw-=.08;else if(e.key==='ArrowRight')yaw+=.08;else if(e.key==='ArrowUp')pitch=Math.min(.9,pitch+.05);else if(e.key==='ArrowDown')pitch=Math.max(-.14,pitch-.05);else if(e.key==='+'||e.key==='=')dist=Math.max(7,dist-1);else if(e.key==='-')dist=Math.min(38,dist+1);else if(e.key===' ')el('pause').click();else handled=false;if(handled){e.preventDefault();touched();}});
function pauseLabel(){el('pause').textContent=paused?'再開':'停止';el('pause').setAttribute('aria-pressed',String(paused));}pauseLabel();
el('pause').onclick=function(){paused=!paused;pauseLabel();};
el('reset').onclick=function(){yaw=.52;pitch=.21;yawV=pitchV=0;gesture=null;target.set(0,3.1,0);resize();touched();};
el('photo').onclick=function(){photo=!photo;el('photograph').hidden=!photo;document.body.classList.toggle('photographic',photo);el('photo').textContent=photo?'立体へ':'写真';el('photo').setAttribute('aria-pressed',String(photo));};
el('quality').onclick=function(){high=!high;el('quality').textContent='画質：'+(high?'高精細':'標準');el('quality').setAttribute('aria-pressed',String(high));resize();};
el('rotate').onclick=function(){auto=!auto;el('rotate').textContent='自動回転：'+(auto?'入':'切');el('rotate').setAttribute('aria-pressed',String(auto));};el('rotate').textContent='自動回転：'+(auto?'入':'切');el('rotate').setAttribute('aria-pressed',String(auto));
function menu(open){el('menu').hidden=!open;el('menuButton').setAttribute('aria-expanded',String(open));if(open)el('closeMenu').focus();else el('menuButton').focus();}
el('menuButton').onclick=function(){menu(el('menu').hidden);};el('closeMenu').onclick=function(){menu(false);};document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false);});
el('fullscreen').onclick=function(){var d=document.documentElement;if(document.fullscreenElement){document.exitFullscreen();}else if(d.requestFullscreen){d.requestFullscreen().catch(function(){el('fullscreen').textContent='このブラウザでは利用できません';});}else{el('fullscreen').textContent='ホーム画面に追加で全画面表示';}};
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',function(){last=0;});renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();ready=false;fail(Error('WebGL context lost'));});resize();
}());
