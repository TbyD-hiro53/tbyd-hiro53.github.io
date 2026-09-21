(function () {
'use strict';
var params=new URLSearchParams(location.search),method='B';var GEO_PARTS=(window.__CALORIS_GEO_PARTS||["lacto-caloris-v2-c13-geometry-part0.bin", "lacto-caloris-v2-c13-geometry-part1.bin", "lacto-caloris-v2-c13-geometry-part2.bin", "lacto-caloris-v2-c13-geometry-part3.bin", "lacto-caloris-v2-c13-geometry-part4.bin"]);
var renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
document.getElementById('app').appendChild(renderer.domElement);
var scene=new THREE.Scene();scene.background=new THREE.Color(0x020306);
var camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.02,200);
var meshes=[],moving=[],data,materials={},textures={},ready=false,bubbles=null;
var reflectHDR=renderer.capabilities.isWebGL2&&renderer.extensions.has("EXT_color_buffer_float")||renderer.extensions.has("EXT_color_buffer_half_float");
var reflectTarget=new THREE.WebGLRenderTarget(512,320,{type:reflectHDR?THREE.HalfFloatType:THREE.UnsignedByteType}),reflectMatrix=new THREE.Matrix4(),reflectCamera=new THREE.PerspectiveCamera(),mirrorCalls=0,mirrorTriangles=0;

var depth24=renderer.capabilities.isWebGL2||renderer.extensions.has("WEBGL_depth_texture");if(depth24)reflectTarget.depthTexture=new THREE.DepthTexture(512,320,THREE.UnsignedIntType);
var aaEnabled=depth24,mainCalls=0,mainTriangles=0,reflectBlur={value:1},reflectTexel={value:new THREE.Vector2(1/512,1/320)};
var aaTarget=new THREE.WebGLRenderTarget(renderer.domElement.width,renderer.domElement.height,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});aaTarget.texture.encoding=THREE.sRGBEncoding;if(depth24)aaTarget.depthTexture=new THREE.DepthTexture(renderer.domElement.width,renderer.domElement.height,THREE.UnsignedIntType);
var aaScene=new THREE.Scene(),aaCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1),aaUniforms=THREE.UniformsUtils.clone(THREE.FXAAShader.uniforms);
aaUniforms.tDiffuse.value=aaTarget.texture;aaUniforms.resolution.value.set(1/renderer.domElement.width,1/renderer.domElement.height);
var aaMaterial=new THREE.ShaderMaterial({uniforms:aaUniforms,vertexShader:THREE.FXAAShader.vertexShader,fragmentShader:THREE.FXAAShader.fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});
aaScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),aaMaterial));
function drawMain(){
 renderer.setRenderTarget(aaEnabled?aaTarget:null);renderer.render(scene,camera);mainCalls=renderer.info.render.calls;mainTriangles=renderer.info.render.triangles;
 if(aaEnabled){renderer.setRenderTarget(null);renderer.render(aaScene,aaCamera);}
}
function setQuality(size,blur,aa){var aspect=innerWidth/innerHeight,w=Math.round(size*Math.min(1,Math.sqrt(aspect/1.6)));reflectTarget.setSize(w,Math.round(w/aspect));reflectTexel.value.set(1/reflectTarget.width,1/reflectTarget.height);reflectBlur.value=blur;aaEnabled=aa&&depth24;}

setQuality(512,1,true);
var T=30.430,dep=1,depTarget=1,last=performance.now(),frames=[],started=performance.now(),loadedAt=0;
// Four fixed subjects; the viewer orbits and zooms freely around the chosen one (no rail, no free-roam mode).
var VIEWS={brain:{t:[0,1.32,0],d:2.3,az:0.10,el:0.06,min:1.1,max:5,label:'brain',pty:0.12,pd:1.1},turntable:{t:[0,1.25,0],d:10.5,az:-0.42,el:0.17,min:4.5,max:18,label:'turntable',pty:0.5,pd:1.25},radiator:{t:[0,3.55,0],d:5.2,az:-0.42,el:0.14,min:2.2,max:12,label:'radiator',pty:0.35,pd:1.2},pedestal:{t:[0,0.25,-3.3],d:2.0,az:0.35,el:0.24,min:0.9,max:6,label:'pedestal',pty:0.08,pd:1.15}};
var view='turntable',orbit={az:0,el:0,d:1},orbitGoal=null,orbitFrom=null,orbitT=1,zoomInput=null;
function pos(a){return new THREE.Vector3(a[0],a[1],a[2]);}
function beat(t){var p=((t%.78)+.78)%.78/.78;return Math.exp(-p*6)+.45*Math.exp(-Math.pow((p-.30)/.10,2));}
function col(a){return new THREE.Color().setRGB(a[0],a[1],a[2]);}
function array(buf,r){return r.type==='u2'?new Uint16Array(buf,r.offset,r.count):r.type==='u4'?new Uint32Array(buf,r.offset,r.count):r.type==='i2'?new Int16Array(buf,r.offset,r.count):r.type==='i1'?new Int8Array(buf,r.offset,r.count):new Float32Array(buf,r.offset,r.count);}
function dequant(buf,r,bounds){var q=array(buf,r),out=new Float32Array(q.length);if(r.type==='i2'){var lo=bounds[0],hi=bounds[1];for(var i=0;i<q.length;i++){var k=i%3;out[i]=(q[i]+32768)/65535*(hi[k]-lo[k])+lo[k];}}else if(r.type==='i1'){for(var j=0;j<q.length;j++)out[j]=q[j]/127;}else out.set(q);return out;}
function environment(){
 var c=document.createElement('canvas');c.width=1024;c.height=512;var g=c.getContext('2d');g.fillStyle='#030407';g.fillRect(0,0,1024,512);
 var grad=g.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#14121a');grad.addColorStop(.38,'#232127');grad.addColorStop(.43,'#b9aebb');grad.addColorStop(.49,'#17131c');grad.addColorStop(1,'#010203');g.fillStyle=grad;g.fillRect(0,0,1024,512);
 for(var i=0;i<12;i++){g.fillStyle=i%3===0?'#afa3ad':'#4b444d';g.fillRect(i*85+16,170,16,70);}
 var tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;tex.mapping=THREE.EquirectangularReflectionMapping;
 var gen=new THREE.PMREMGenerator(renderer);var out=gen.fromEquirectangular(tex).texture;gen.dispose();tex.dispose();return out;
}
var env=environment();scene.environment=env;
scene.add(new THREE.AmbientLight(0xf2dbe9,.04));
[[[-3,6,4],0xf2dbe9,4],[[3,4,-3],0xf2dbe9,3],[[-2,2,-3],0x00ddc8,.12]].forEach(function(x){var l=new THREE.PointLight(x[1],x[2],12,2);l.position.set(x[0][0],x[0][1],x[0][2]);scene.add(l);});
var vatLight=new THREE.PointLight(0xf2dbe9,1.2,2,2);vatLight.position.set(0,1.35,0);scene.add(vatLight);

function medium(m,role){
 if(['glass','liquid','bubble','smoked_glass'].indexOf(role)>=0)return;
 var previous=m.onBeforeCompile,priorKey=m.customProgramCacheKey();
 m.onBeforeCompile=function(sh){previous.call(m,sh);
 sh.vertexShader='varying vec3 vMediumWorld;\n'+sh.vertexShader;
 sh.vertexShader=sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvMediumWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
 sh.fragmentShader=`varying vec3 vMediumWorld;
 bool clipMedium(float o,float d,float low,float high,inout float lo,inout float hi){
  if(abs(d)<0.000001)return o>=low&&o<=high;
  float a=(low-o)/d,b=(high-o)/d;lo=max(lo,min(a,b));hi=min(hi,max(a,b));return hi>lo;
 }
 vec3 throughMedium(vec3 rgb){
  vec3 ray=vMediumWorld-cameraPosition;float distance=length(ray);vec3 rd=ray/max(distance,0.000001);
  float lo=0.0,hi=distance;
  if(!clipMedium(cameraPosition.y,rd.y,0.9995,1.590,lo,hi))return rgb;
  if(!clipMedium(cameraPosition.z,rd.z,-0.4965,0.6123,lo,hi))return rgb;
  float a=dot(rd.xz,rd.xz),b=dot(cameraPosition.xz,rd.xz),c=dot(cameraPosition.xz,cameraPosition.xz)-0.6123*0.6123;
  if(a<0.000001){if(c>0.0)return rgb;}else{float disc=b*b-a*c;if(disc<=0.0)return rgb;float root=sqrt(disc);lo=max(lo,(-b-root)/a);hi=min(hi,(-b+root)/a);}
  float thickness=max(0.0,hi-lo);if(thickness<=0.0)return rgb;
  float height=clamp((cameraPosition.y+rd.y*(lo+hi)*0.5-0.9995)/0.5905,0.0,1.0);
  vec3 transmittance=exp(-vec3(2.7,3.0,2.85)*thickness);
  vec3 scatter=mix(vec3(0.040,0.024,0.033),vec3(0.54,0.40,0.49),exp(-3.6*height));
  return rgb*transmittance+scatter*(1.0-transmittance);
 }
 `+sh.fragmentShader;
 if(role==='background')sh.fragmentShader=sh.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor.rgb=max(gl_FragColor.rgb,vec3(2.0,3.0,6.0)/255.0);');
 sh.fragmentShader=sh.fragmentShader.replace('#include <tonemapping_fragment>','gl_FragColor.rgb=throughMedium(gl_FragColor.rgb);\n#include <tonemapping_fragment>');
 };
 m.customProgramCacheKey=function(){return 'c13-medium-1-'+priorKey;};
}

function material(name,role){
 var key=name+'|'+role;if(materials[key])return materials[key];var r=data.materials[name];
 var options={color:col(r.base),metalness:r.metallic,roughness:Math.max(.08,r.roughness),envMapIntensity:.65,side:THREE.FrontSide};
 if(r.strength>0){options.emissive=col(r.emission);options.emissiveIntensity=Math.min(r.strength*.12,1.6);}
 if(role==='wedge'||role==='chamber_shell'||role==='frame_building'){options.color=col([.065,.065,.065]);options.envMapIntensity=.04;options.metalness=0;options.roughness=.8;}
 if(role==='floor'||role==='turntable'){options.color=col([.0204,.0204,.0204]);options.metalness=.65;options.roughness=.12;options.envMapIntensity=.06;}
 if(role.indexOf('tri_')===0||role.indexOf('fin_edge_')===0||role.indexOf('cdu_ring_')===0){var ci=Number(role.slice(-1));options.emissive=new THREE.Color([0xff05a8,0xf2dbe9,0x00ddc8][ci]).convertSRGBToLinear();options.emissiveIntensity=.65;}
 if(role==='module_strip'||role==='node_turq'||role==='status_light'){options.emissive=new THREE.Color(0x00ddc8).convertSRGBToLinear();options.emissiveIntensity=.3;}
 if(role==='maintenance_lamp'){options.emissive=new THREE.Color(0xf2dbe9).convertSRGBToLinear();options.emissiveIntensity=.5;}
 if(role==='liquid'){options.color=new THREE.Color(0xf2dbe9).convertSRGBToLinear();options.transparent=true;options.opacity=.045;options.depthWrite=false;options.roughness=.28;options.metalness=0;options.emissive=col([0,0,0]);options.emissiveIntensity=0;}
 if(role==='glass'){options.color=col([.7,.74,.74]);options.transparent=true;options.opacity=.09;options.depthWrite=false;options.roughness=.05;options.metalness=.5;}
 if(role==='bubble'){options.transparent=true;options.opacity=.24;options.depthWrite=false;}
 if(role==='brain'){options.color=col([.060,.043,.051]);options.roughness=.6;options.emissive=col([.003,.002,.0025]);}
 if(role==='band'){options.color=col([.0035,.0042,.0065]);options.emissive=col([1,1,1]);options.emissiveIntensity=.65;options.emissiveMap=textures['band-v2-text.png'];}
 if(role==='smoked_glass'){options.color=col([.012,.012,.014]);options.transparent=true;options.opacity=.80;options.depthWrite=false;options.roughness=.05;options.metalness=.7;options.envMapIntensity=1.0;options.emissive=col([0,0,0]);options.emissiveIntensity=0;}
 if(name==='c4 status ff05a8'){options.emissiveIntensity=1.1;}if(name==='c4 turq line 00ddc8'){options.emissiveIntensity=.7;}if(name==='c4 pale label f2dbe9'){options.emissiveIntensity=.5;}
 if(role==='logo'){options.map=textures['tex10.png'];options.emissiveMap=textures['tex10.png'];options.emissive=col([.2,.05,.13]);}
 var m=new THREE.MeshStandardMaterial(options);
 if(role==='floor'||role==='turntable'){
  m.onBeforeCompile=function(shader){shader.uniforms.reflectionMap={value:reflectTarget.texture};shader.uniforms.reflectBlur=reflectBlur;shader.uniforms.reflectTexel=reflectTexel;shader.uniforms.reflectionMatrix={value:reflectMatrix};shader.vertexShader='uniform mat4 reflectionMatrix; varying vec4 vReflect;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvReflect = reflectionMatrix * modelMatrix * vec4(transformed,1.0);');shader.fragmentShader='uniform float reflectBlur; uniform vec2 reflectTexel; uniform sampler2D reflectionMap; varying vec4 vReflect;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <tonemapping_fragment>','vec2 ruv=vReflect.xy/vReflect.w*.5+.5; if(ruv.x>0.0&&ruv.x<1.0&&ruv.y>0.0&&ruv.y<1.0) {vec2 off=reflectTexel*reflectBlur;vec3 reflection=texture2D(reflectionMap,ruv).rgb*.5;reflection+=(texture2D(reflectionMap,ruv+vec2(off.x,0.0)).rgb+texture2D(reflectionMap,ruv-vec2(off.x,0.0)).rgb+texture2D(reflectionMap,ruv+vec2(0.0,off.y)).rgb+texture2D(reflectionMap,ruv-vec2(0.0,off.y)).rgb)*.125;gl_FragColor.rgb+=reflection*.10;}\n#include <tonemapping_fragment>');};m.customProgramCacheKey=function(){return 'c13-reflection';};
 }
 if(name==='c8 hidden'){m.visible=false;m.transparent=true;m.opacity=0;m.depthWrite=false;m.colorWrite=false;}
 medium(m,role);materials[key]=m;return m;
}
function build(buf,bake){
 var bgmat=new THREE.MeshStandardMaterial({color:0x000000,emissive:0x000000,roughness:1,metalness:0,envMapIntensity:0,side:THREE.BackSide,depthWrite:false});medium(bgmat,'background');var backdrop=new THREE.Mesh(new THREE.SphereGeometry(80,24,16),bgmat);backdrop.position.y=8;scene.add(backdrop);
 data.objects.forEach(function(r){
  if(r.hide_render||r.role==='ring_light')return;
  var g=new THREE.BufferGeometry(),p=dequant(buf,r.position,r.bounds),n=dequant(buf,r.normal,r.bounds);
  g.setAttribute('position',new THREE.BufferAttribute(p.slice(),3));g.setAttribute('normal',new THREE.BufferAttribute(n.slice(),3));if(r.uv)g.setAttribute('uv',new THREE.BufferAttribute(array(buf,r.uv),2));g.setIndex(new THREE.BufferAttribute(array(buf,r.index),1));
  r.groups.forEach(function(x){g.addGroup(x[0],x[1],x[2]);});
  var m=new THREE.Mesh(g,r.materials.map(function(nm){return material(nm,r.role);}));m.name=r.name;m.userData.role=r.role;
  if(['glass','liquid','bubble','smoked_glass'].indexOf(r.role)>=0)m.renderOrder=r.role==='smoked_glass'?6:r.role==='glass'?5:r.role==='liquid'?4:3;
  scene.add(m);meshes.push(m);
  if(r.role==='bubble')bubbles=prepareBubbles(m);
  if(r.stowedPosition){moving.push({mesh:m,full:p.slice(),stow:dequant(buf,r.stowedPosition,r.bounds),fn:n.slice(),sn:dequant(buf,r.stowedNormal,r.bounds),fin:r.fin});m.frustumCulled=false;}
 });
 setDeploy(1);ready=true;loadedAt=performance.now();document.getElementById('loading').remove();
 setView(VIEWS[params.get('view')]?params.get('view'):'turntable',true);
}
// Bubbles rise slowly through the culture liquid (y 1.00–1.59) and re-enter at the floor; each bubble moves as one body.
function prepareBubbles(m){
 var g=m.geometry,p=g.attributes.position.array,idx=g.index.array,n=p.length/3,parent=new Int32Array(n),i;
 for(i=0;i<n;i++)parent[i]=i;
 function find(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
 for(i=0;i<idx.length;i+=3){var a=find(idx[i]),b=find(idx[i+1]),c=find(idx[i+2]);parent[b]=a;parent[c]=a;}
 var id=new Int32Array(n),count=0,map={};
 for(i=0;i<n;i++){var r=find(i);if(map[r]===undefined)map[r]=count++;id[i]=map[r];}
 var cx=new Float32Array(count),cz=new Float32Array(count),cy=new Float32Array(count),cn=new Float32Array(count);
 for(i=0;i<n;i++){var k=id[i];cx[k]+=p[3*i];cy[k]+=p[3*i+1];cz[k]+=p[3*i+2];cn[k]++;}
 var phase=new Float32Array(count),speed=new Float32Array(count),wob=new Float32Array(count);
 for(i=0;i<count;i++){cx[i]/=cn[i];cy[i]/=cn[i];cz[i]/=cn[i];var h=Math.sin(i*12.9898+cx[i]*78.233)*43758.5453;h-=Math.floor(h);phase[i]=h*0.58;speed[i]=0.030+0.025*(Math.sin(i*3.7)*0.5+0.5);wob[i]=h*6.283;}
 return {mesh:m,base:p.slice(),id:id,count:count,cy:cy,phase:phase,speed:speed,wob:wob,y0:1.005,h:0.575};
}
function tickBubbles(t){
 if(!bubbles)return;var b=bubbles,p=b.mesh.geometry.attributes.position.array,dy=new Float32Array(b.count),dx=new Float32Array(b.count),i;
 for(i=0;i<b.count;i++){var rel=b.cy[i]-b.y0,y=(((rel+b.speed[i]*t+b.phase[i])%b.h)+b.h)%b.h;dy[i]=y-rel;dx[i]=0.006*Math.sin(t*1.3+b.wob[i]);}
 for(i=0;i<p.length;i+=3){var k=b.id[i/3];p[i]=b.base[i]+dx[k];p[i+1]=b.base[i+1]+dy[k];}
 b.mesh.geometry.attributes.position.needsUpdate=true;
}
function setDeploy(d){
 dep=d;moving.forEach(function(o){var a=o.mesh.geometry.attributes.position.array,n=o.mesh.geometry.attributes.normal.array,k=o.fin;
  var af=k>=0?k*3.2*Math.PI*2/30+.35:0,as=k>=0?k*Math.PI*2/30:0,at=as+(af-as)*d;
  var cf=Math.cos(af),sf=Math.sin(af),cs=Math.cos(as),ss=Math.sin(as),ct=Math.cos(at),st=Math.sin(at);
  for(var j=0;j<a.length;j+=3){
   // Undo each endpoint's Y rotation, interpolate local shape, reapply continuous helix rotation.
   var fx=cf*o.full[j]+sf*o.full[j+2],fz=-sf*o.full[j]+cf*o.full[j+2];
   var sx=cs*o.stow[j]+ss*o.stow[j+2],sz=-ss*o.stow[j]+cs*o.stow[j+2];
   var x=sx+(fx-sx)*d,z=sz+(fz-sz)*d;a[j]=ct*x-st*z;a[j+1]=o.stow[j+1]+(o.full[j+1]-o.stow[j+1])*d;a[j+2]=st*x+ct*z;
   fx=cf*o.fn[j]+sf*o.fn[j+2];fz=-sf*o.fn[j]+cf*o.fn[j+2];sx=cs*o.sn[j]+ss*o.sn[j+2];sz=-ss*o.sn[j]+cs*o.sn[j+2];x=sx+(fx-sx)*d;z=sz+(fz-sz)*d;
   n[j]=ct*x-st*z;n[j+1]=o.sn[j+1]+(o.fn[j+1]-o.sn[j+1])*d;n[j+2]=st*x+ct*z;var len=Math.hypot(n[j],n[j+1],n[j+2])||1;n[j]/=len;n[j+1]/=len;n[j+2]/=len;
  }o.mesh.geometry.attributes.position.needsUpdate=true;o.mesh.geometry.attributes.normal.needsUpdate=true;
 });
}
function reflection(){
 reflectCamera.copy(camera);reflectCamera.position.y=.109-camera.position.y;var view=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);view.y=.109-view.y;reflectCamera.up.copy(new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion));reflectCamera.up.y*=-1;reflectCamera.lookAt(view);reflectCamera.updateMatrixWorld(true);reflectMatrix.multiplyMatrices(reflectCamera.projectionMatrix,reflectCamera.matrixWorldInverse);
 var hidden=[];meshes.forEach(function(m){if(m.userData.role==='floor'||m.userData.role==='turntable'){hidden.push(m);m.visible=false;}});var savedTone=renderer.toneMapping;renderer.toneMapping=THREE.NoToneMapping;renderer.setRenderTarget(reflectTarget);renderer.render(scene,reflectCamera);mirrorCalls=renderer.info.render.calls;mirrorTriangles=renderer.info.render.triangles;renderer.setRenderTarget(null);renderer.toneMapping=savedTone;hidden.forEach(function(m){m.visible=true;});
}
// Conservative free-camera envelopes, not full triangle collision detection.
function safeCameraPoint(p){
 var radius=Math.hypot(p.x,p.z),finRadius=.70+.82*dep;
 if(p.y<.12||p.y>26.5||radius>19.5)return false;
 if(p.y<3.15&&radius<.69)return false;
 if(p.y>2.64&&p.y<3.12+1.46*dep&&radius<finRadius)return false;
 return true;
}
function moveFreeCamera(next){
 var from=camera.position.clone(),distance=from.distanceTo(next),steps=Math.max(1,Math.ceil(distance/.04)),safe=from.clone();
 for(var k=1;k<=steps;k++){var p=from.clone().lerp(next,k/steps);if(!safeCameraPoint(p))break;safe.copy(p);}
 camera.position.copy(safe);camera.lookAt(target);
}


var target=new THREE.Vector3();
function applyOrbit(){var v=VIEWS[view],portrait=innerWidth<innerHeight;target.set(v.t[0],v.t[1]+(portrait?v.pty:0),v.t[2]);var el=Math.max(-1.2,Math.min(1.45,orbit.el)),d=Math.max(v.min,Math.min(v.max,orbit.d))*(portrait?v.pd:1);
 var p=new THREE.Vector3(Math.sin(orbit.az)*Math.cos(el)*d,Math.sin(el)*d,Math.cos(orbit.az)*Math.cos(el)*d).add(target);
 if(!safeCameraPoint(p)){var dir=p.clone().sub(target).normalize(),dd=d;for(var k=0;k<80;k++){dd*=1.03;var q=target.clone().add(dir.clone().multiplyScalar(dd));if(safeCameraPoint(q)){p=q;orbit.d=dd;break;}if(dd>v.max)break;}}
 camera.position.copy(p);camera.lookAt(target);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<innerHeight?52:42;camera.updateProjectionMatrix();
 if(zoomInput&&document.activeElement!==zoomInput){var z=Math.round(100*(1-(Math.log(orbit.d)-Math.log(v.min))/(Math.log(v.max)-Math.log(v.min))));if(String(z)!==zoomInput.value)zoomInput.value=z;}
}
function setView(name,instant){var v=VIEWS[name];if(!v)return;view=name;
 var goal={az:v.az,el:v.el,d:v.d};
 if(instant){orbit=goal;orbitT=1;}else{orbitFrom={az:orbit.az,el:orbit.el,d:orbit.d};orbitGoal=goal;orbitT=0;var da=goal.az-orbitFrom.az;orbitFrom.az+=Math.round(da/(2*Math.PI))*2*Math.PI;}
 ['sw','reset','spin','tour'].forEach(function(id,i){var b=document.getElementById(id);b.className=['brain','turntable','radiator','pedestal'][i]===name?'btn on':'btn';});
 document.getElementById('title').textContent='LACTO CALORIS · '+v.label.toUpperCase();applyOrbit();
}
function tickOrbit(dt){if(orbitT<1){orbitT=Math.min(1,orbitT+dt/1.1);var e=orbitT*orbitT*(3-2*orbitT);orbit={az:orbitFrom.az+(orbitGoal.az-orbitFrom.az)*e,el:orbitFrom.el+(orbitGoal.el-orbitFrom.el)*e,d:Math.exp(Math.log(orbitFrom.d)+(Math.log(orbitGoal.d)-Math.log(orbitFrom.d))*e)};applyOrbit();}}
[['sw','brain'],['reset','turntable'],['spin','radiator'],['tour','pedestal']].forEach(function(x){document.getElementById(x[0]).onclick=function(){if(ready)setView(x[1]);};});
document.getElementById('dp').onclick=function(){depTarget=depTarget>.5?0:1;this.textContent=depTarget?'stow':'deploy';this.className=depTarget?'btn on':'btn';};
zoomInput=document.getElementById('zoom');
if(zoomInput)zoomInput.addEventListener('input',function(){var v=VIEWS[view],z=Number(this.value)/100;orbit.d=Math.exp(Math.log(v.min)+(1-z)*(Math.log(v.max)-Math.log(v.min)));orbitT=1;applyOrbit();});
// Pointer orbit (drag), wheel zoom, two-finger pinch zoom.
var pointers={},pinch0=0,dist0=0;
renderer.domElement.addEventListener('pointerdown',function(e){pointers[e.pointerId]=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);var ids=Object.keys(pointers);if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);dist0=orbit.d;}});
function endPointer(e){delete pointers[e.pointerId];pinch0=0;}
renderer.domElement.addEventListener('pointerup',endPointer);renderer.domElement.addEventListener('pointercancel',endPointer);
renderer.domElement.addEventListener('pointermove',function(e){if(!pointers[e.pointerId])return;var ids=Object.keys(pointers);
 if(ids.length===1){var p=pointers[e.pointerId],dx=e.clientX-p[0],dy=e.clientY-p[1];pointers[e.pointerId]=[e.clientX,e.clientY];orbit.az-=dx*.006;orbit.el=Math.max(-1.2,Math.min(1.45,orbit.el+dy*.006));orbitT=1;applyOrbit();}
 else if(ids.length===2){pointers[e.pointerId]=[e.clientX,e.clientY];var a=pointers[ids[0]],b=pointers[ids[1]],pd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch0>0&&pd>0){orbit.d=dist0*pinch0/pd;orbitT=1;applyOrbit();}}
});
renderer.domElement.addEventListener('wheel',function(e){e.preventDefault();orbit.d*=Math.exp(e.deltaY*.001);orbitT=1;applyOrbit();},{passive:false});
window.addEventListener('resize',function(){renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);aaTarget.setSize(renderer.domElement.width,renderer.domElement.height);setQuality(512,1,aaEnabled);aaUniforms.resolution.value.set(1/renderer.domElement.width,1/renderer.domElement.height);if(ready)applyOrbit();});
document.addEventListener('visibilitychange',function(){last=performance.now();});
function tick(now){requestAnimationFrame(tick);var elapsed=Math.max(0,now-last),dt=Math.min(.5,elapsed/1000);last=now;if(!ready||document.hidden)return;
 T+=dt;tickOrbit(dt);tickBubbles(T);
 if(Math.abs(depTarget-dep)>.00001)setDeploy(dep+Math.sign(depTarget-dep)*Math.min(Math.abs(depTarget-dep),dt/7.8));
 textures['band-v2-text.png'].offset.x=(((-T*.038)%1)+1)%1;vatLight.intensity=1.0+.2*beat(T);reflection();drawMain();if(window.H53ComposerLiquid)H53ComposerLiquid.afterRender();frames.push(elapsed);if(frames.length>600)frames.shift();}
requestAnimationFrame(tick);
window.__CALORIS={setQuality:setQuality,get ready(){return ready;},get renderer(){return renderer;},get scene(){return scene;},get camera(){return camera;},get state(){return {method:method,T:T,dep:dep,target:depTarget,view:view,orbit:{az:orbit.az,el:orbit.el,d:orbit.d}};},setView:function(n){setView(n,true);},setOrbit:function(az,el,d){orbit={az:az,el:el,d:d};orbitT=1;applyOrbit();},setDeploy:function(d){depTarget=d;setDeploy(d);document.getElementById("dp").textContent=d?"stow":"deploy";document.getElementById("dp").className=d?"btn on":"btn";},resetMetrics:function(){frames.length=0;},metrics:function(){var a=frames.slice().sort(function(x,y){return x-y;});return {startupMs:loadedAt-started,frameMedianMs:a[Math.floor(a.length*.5)],frameP95Ms:a[Math.floor(a.length*.95)],frameCount:a.length,drawCalls:mainCalls,triangles:mainTriangles,allPassDrawCalls:mainCalls+mirrorCalls+(aaEnabled?1:0),allPassTriangles:mainTriangles+mirrorTriangles+(aaEnabled?2:0),depth24:depth24,reflectionSize:[reflectTarget.width,reflectTarget.height],fxaa:aaEnabled,pixelRatio:renderer.getPixelRatio(),resolution:[renderer.domElement.width,renderer.domElement.height],reflectionHDR:reflectHDR,method:method};},audit:function(){var bad=0,vertices=0;meshes.forEach(function(m){['position','normal'].forEach(function(n){var a=m.geometry.attributes[n].array;for(var i=0;i<a.length;i++)if(!Number.isFinite(a[i]))bad++;});vertices+=m.geometry.attributes.position.count;});return {nonFinite:bad,vertices:vertices,objects:meshes.length,three:THREE.REVISION};}};
Promise.all([fetch('lacto-caloris-v2-c13-scene.json').then(function(r){if(!r.ok)throw Error(r.status);return r.json();}),Promise.all(GEO_PARTS.map(function(p){return fetch(p).then(function(r){if(!r.ok)throw Error(r.status);return r.arrayBuffer();});})).then(function(parts){if(parts.length===1)return parts[0];var n=0;parts.forEach(function(b){n+=b.byteLength;});var out=new Uint8Array(n),o=0;parts.forEach(function(b){out.set(new Uint8Array(b),o);o+=b.byteLength;});return out.buffer;})]).then(function(v){data=v[0];var loader=new THREE.TextureLoader(),names=['band-v2-text.png','tex10.png'];return Promise.all(names.map(function(n){return new Promise(function(resolve,reject){loader.load('lacto-caloris-v2-c13-'+n,function(t){t.encoding=THREE.sRGBEncoding;t.anisotropy=4;if(n==='band-v2-text.png'){t.wrapS=THREE.RepeatWrapping;t.offset.x=(((-30.430*.038)%1)+1)%1;}textures[n]=t;resolve();},undefined,reject);});})).then(function(){build(v[1],null);});}).catch(function(e){document.getElementById('loading').textContent='読み込みできませんでした。ページを再読み込みしてください。';console.error(e);});
})();
