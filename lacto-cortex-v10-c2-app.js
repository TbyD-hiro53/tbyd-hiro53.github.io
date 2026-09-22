/* Adopted room remake r3: animation c and current shared UI candidate. Three r128; one artwork IIFE; same-site assets. */
(function(){'use strict';
var T=window.THREE,P='lacto-cortex-v10-c1-',PG='lacto-cortex-v10-c2-'   /* P 変わっていない資産 ／ PG この版で替わった資産 */,stage=document.getElementById('stage');
var query=new URLSearchParams(location.search),review=query.has('review'),mask=query.get('mask')==='1',bench=query.has('bench');
var renderer,scene,camera,doc=null,buffer=null,views=[],viewIndex=0,ready=false,needsRender=true;
var target=new T.Vector3(0,-0.2,0),theta=0,phi=1.25,radius=10,lensFov=null,pointers={},pinchStart=0,pinchRadius=0,dragging=null;
var groups=[],instanced=[],stats={},tex={},envMap=null,baked=[],ringLights=[];
// 環文字の輪の鏡面用の点光源（位置は geo の fanring の外接箱、色は fanring の発光色）。強さは窓 phone/floor・mac/floor-F・rack の実測で決めた
var RING_N=12,RING_R=0.66,RING_Y=-1.96,RING_DISTANCE=6,RING_COLOR=0x9ff4ff,RING_INTENSITY=0.27;
// v9 の建屋（artwork unit 0.20 m を実 m へ）
var FLOOR_Y=-2.3,ROOM_R=10.4,WALL_TOP=2.3,ROOF_H=5.2,SERVICE_Z=-8.0;
var BUILDING_KEYS=['concrete','checker','tread','wall','floor','ceiling','fixture','cove','dome-band','power-cable','opening','connector-bolt','floor-cable'];
var BUILDING_MATS=['concrete','checker','tread','cove diffuser','ceiling'];
// s6a の仮の色（b2 の対象と、焼いていない面だけに使う）
var PROVISIONAL={checkerplate:'#2c3136',concrete:'#5d5b58',tag:'#f2dbe9'};
var METAL={chrome:1,silver:1,collar:1,fitting:1,strut:1,harness_gray:1,harness_silver:1,fanblade:1,structural_steel:1,darkmetal:1,lid_drum:1,tread:1,neon_board:1};
// b1: ライトマップを持つ面の材質（色は線形。Blender の基本色、テクスチャはその平均）。
// lm = ライトマップの強さの倍率、env = 映り込みの倍率。値は窓の実測で合わせた（report-s6b1.md）
var B1={exposure:1,lm:1,env:1,lmSpec:0,ring:1,roles:{
  concrete:{color:[.112,.1131,.1067],metalness:0,roughness:.92,lm:1,env:1},
  checkerplate:{color:[.0753,.0964,.1156],metalness:.88,roughness:.4,lm:1,env:1},
  tread:{color:[.13,.16,.19],metalness:1,roughness:.3,lm:1,env:1,normalScale:1},
  rubber:{color:[.016,.018,.021],metalness:0,roughness:.46,lm:1,env:1},
  structural_steel:{color:[.16,.19,.22],metalness:1,roughness:.3,lm:1,env:1},
  silver:{color:[.52,.56,.62],metalness:1,roughness:.38,lm:1,env:1},
  lid_drum:{color:[.045,.05,.065],metalness:1,roughness:.33,lm:1,env:1},
  darkmetal:{color:[.024,.027,.038],metalness:1,roughness:.44,lm:1,env:1},
  neon_board:{color:[.024,.027,.038],metalness:1,roughness:.8,lm:1,env:1},
  turquoise:{color:[0,.723,.578],metalness:1,roughness:.16,lm:1,env:1},
  strut:{color:[.44,.47,.53],metalness:1,roughness:.28,lm:1,env:1}
}};
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function response(url,type){return fetch(url).then(function(r){if(!r.ok)throw Error('Missing asset: '+url);return type==='json'?r.json():r.arrayBuffer();});}
function parts(base,n){
  var list=[],i;for(i=0;i<n;i++)list.push(response(base+'-part'+i+'.bin','bin'));
  return Promise.all(list).then(function(bufs){
    var total=0,k;for(k=0;k<bufs.length;k++)total+=bufs[k].byteLength;
    var out=new Uint8Array(total),at=0;
    for(k=0;k<bufs.length;k++){out.set(new Uint8Array(bufs[k]),at);at+=bufs[k].byteLength;}
    return out.buffer;
  });
}
function partsTexture(base,n,encoding,type){
  return parts(base,n).then(function(buf){
    var url=URL.createObjectURL(new Blob([buf],{type:type}));
    return texture(url,encoding).then(function(t){URL.revokeObjectURL(url);return t;},
                                      function(e){URL.revokeObjectURL(url);throw e;});
  });
}
function texture(url,encoding){return new Promise(function(resolve,reject){new T.TextureLoader().load(url,function(t){t.encoding=encoding;resolve(t);},undefined,function(){reject(Error('Missing asset: '+url));});});}
// 置換は必ず 1 件（件数が違えば止める）
function rep1(text,a,b){var n=text.split(a).length-1;if(n!==1)throw Error('rep1: expected 1 match, got '+n+' for '+a.slice(0,48));return text.split(a).join(b);}
function isBuilding(name,material){var n=(name||'').toLowerCase(),m=(material||'').toLowerCase(),i;for(i=0;i<BUILDING_KEYS.length;i++)if(n.indexOf(BUILDING_KEYS[i])>=0)return true;for(i=0;i<BUILDING_MATS.length;i++)if(m.indexOf(BUILDING_MATS[i])>=0)return true;return false;}
var ARR={float32:Float32Array,int8:Int8Array,uint8:Uint8Array,uint16:Uint16Array,uint32:Uint32Array};
function view(spec,count){return new ARR[spec.type](buffer,spec.offset,count);}
function uvFloat(spec,n,out,offset){
  var src=view(spec,n*2),r=spec.range,su=r[2]-r[0],sv=r[3]-r[1],i;
  for(i=0;i<n;i++){out[(offset+i)*2]=r[0]+src[i*2]/65535*su;out[(offset+i)*2+1]=r[1]+src[i*2+1]/65535*sv;}
}

// Inserted inside the existing single IIFE. Scope is determined from the reviewed mesh table.
var B2_ASSIGN={"ceiling-fixture":"b1-preserve","ceiling-fixture.001":"b1-preserve","ceiling-fixture.002":"b1-preserve","ceiling-fixture.003":"b1-preserve","ceiling-light":"b1-preserve","ceiling-light.001":"b1-preserve","ceiling-light.002":"b1-preserve","ceiling-light.003":"b1-preserve","checker-plate-floor":"b1-preserve","circular-concrete-wall":"b1-preserve","concrete-dome":"b1-preserve","connector-bolt":"b1-preserve","connector-bolt.001":"b1-preserve","connector-bolt.002":"b1-preserve","connector-bolt.003":"b1-preserve","connector-bolt.004":"b1-preserve","connector-bolt.005":"b1-preserve","connector-bolt.006":"b1-preserve","connector-bolt.007":"b1-preserve","connector-bolt.008":"b1-preserve","connector-bolt.009":"b1-preserve","connector-bolt.010":"b1-preserve","connector-bolt.011":"b1-preserve","connector-bolt.012":"b1-preserve","connector-bolt.013":"b1-preserve","connector-bolt.014":"b1-preserve","connector-bolt.015":"b1-preserve","connector-bolt.016":"b1-preserve","connector-bolt.017":"b1-preserve","connector-bolt.018":"b1-preserve","connector-bolt.019":"b1-preserve","connector-bolt.020":"b1-preserve","connector-bolt.021":"b1-preserve","connector-bolt.022":"b1-preserve","connector-bolt.023":"b1-preserve","connector-bolt.024":"b1-preserve","connector-bolt.025":"b1-preserve","connector-bolt.026":"b1-preserve","connector-bolt.027":"b1-preserve","connector-bolt.028":"b1-preserve","connector-bolt.029":"b1-preserve","connector-bolt.030":"b1-preserve","connector-bolt.031":"b1-preserve","connector-bolt.032":"b1-preserve","connector-bolt.033":"b1-preserve","connector-bolt.034":"b1-preserve","connector-bolt.035":"b1-preserve","connector-bolt.036":"b1-preserve","connector-bolt.037":"b1-preserve","connector-bolt.038":"b1-preserve","connector-bolt.039":"b1-preserve","connector-bolt.040":"b1-preserve","connector-bolt.041":"b1-preserve","connector-bolt.042":"b1-preserve","connector-bolt.043":"b1-preserve","connector-bolt.044":"b1-preserve","connector-bolt.045":"b1-preserve","cove-diffuser-00":"b1-preserve","cove-diffuser-01":"b1-preserve","cove-diffuser-02":"b1-preserve","cove-diffuser-03":"b1-preserve","cove-diffuser-04":"b1-preserve","cove-diffuser-05":"b1-preserve","cove-diffuser-06":"b1-preserve","cove-diffuser-07":"b1-preserve","cove-diffuser-08":"b1-preserve","cove-diffuser-09":"b1-preserve","cove-diffuser-10":"b1-preserve","cove-diffuser-11":"b1-preserve","culture-liquid":"b3-defer","dome-band-diffuser-00":"b1-preserve","dome-band-diffuser-01":"b1-preserve","dome-band-diffuser-02":"b1-preserve","dome-band-diffuser-03":"b1-preserve","dome-band-diffuser-04":"b1-preserve","dome-band-diffuser-05":"b1-preserve","dome-band-diffuser-06":"b1-preserve","dome-band-diffuser-07":"b1-preserve","fixture-anchor":"b1-preserve","fixture-anchor.001":"b1-preserve","fixture-anchor.002":"b1-preserve","fixture-anchor.003":"b1-preserve","fixture-anchor.004":"b1-preserve","fixture-anchor.005":"b1-preserve","fixture-anchor.006":"b1-preserve","fixture-anchor.007":"b1-preserve","mesh10":"b2-change","mesh100":"b2-change","mesh101":"b2-change","mesh102":"b2-change","mesh103":"b2-change","mesh104":"b2-change","mesh105":"b1-preserve","mesh106":"b1-preserve","mesh107":"b1-preserve","mesh109":"b3-defer","mesh11":"b2-change","mesh110":"b3-defer","mesh111":"b3-defer","mesh112":"b3-defer","mesh113":"b3-defer","mesh114":"b3-defer","mesh115":"b3-defer","mesh116":"b3-defer","mesh117":"b3-defer","mesh118":"b3-defer","mesh119":"b3-defer","mesh12":"b2-change","mesh120":"b3-defer","mesh121":"b3-defer","mesh122":"b3-defer","mesh123":"b3-defer","mesh124":"b3-defer","mesh125":"b3-defer","mesh126":"b3-defer","mesh127":"b3-defer","mesh128":"b3-defer","mesh129":"b3-defer","mesh13":"b2-change","mesh130":"b3-defer","mesh131":"b3-defer","mesh132":"b3-defer","mesh133":"b3-defer","mesh134":"b3-defer","mesh135":"b3-defer","mesh136":"b3-defer","mesh137":"b3-defer","mesh138":"b3-defer","mesh139":"b3-defer","mesh14":"b2-change","mesh140":"b3-defer","mesh141":"b3-defer","mesh142":"b3-defer","mesh143":"b3-defer","mesh144":"b3-defer","mesh145":"b3-defer","mesh146":"b3-defer","mesh147":"b3-defer","mesh148":"b3-defer","mesh149":"b3-defer","mesh15":"b2-change","mesh150":"b3-defer","mesh151":"b3-defer","mesh152":"b3-defer","mesh153":"b3-defer","mesh154":"b3-defer","mesh155":"b3-defer","mesh156":"b3-defer","mesh157":"b3-defer","mesh158":"b3-defer","mesh159":"b3-defer","mesh16":"b2-change","mesh160":"b3-defer","mesh161":"b3-defer","mesh162":"b3-defer","mesh163":"b2-change","mesh164":"b2-change","mesh165":"b2-change","mesh166":"b2-change","mesh167":"b2-change","mesh17":"b2-change","mesh170":"b2-change","mesh171":"b2-change","mesh172":"b2-change","mesh173":"b2-change","mesh174":"b2-change","mesh175":"b2-change","mesh176":"b3-defer","mesh177":"b3-defer","mesh178":"b3-defer","mesh179":"b3-defer","mesh18":"b2-change","mesh180":"b3-defer","mesh181":"b3-defer","mesh185":"b3-defer","mesh186":"b3-defer","mesh187":"b3-defer","mesh188":"b2-change","mesh189":"b2-change","mesh19":"b2-change","mesh191":"b2-change","mesh192":"b3-defer","mesh193":"b2-change","mesh194":"b2-change","mesh196":"b2-change","mesh198":"b2-change","mesh199":"b2-change","mesh20":"b2-change","mesh200":"b2-change","mesh201":"b2-change","mesh202":"b2-change","mesh203":"b2-change","mesh204":"b2-change","mesh205":"b2-change","mesh206":"b2-change","mesh207":"b2-change","mesh208":"b2-change","mesh209":"b2-change","mesh21":"b2-change","mesh210":"b2-change","mesh211":"b2-change","mesh212":"b2-change","mesh213":"b2-change","mesh22":"b2-change","mesh23":"b2-change","mesh24":"b2-change","mesh25":"b2-change","mesh26":"b2-change","mesh27":"b2-change","mesh28":"b2-change","mesh285":"b2-change","mesh286":"b2-change","mesh287":"b2-change","mesh288":"b2-change","mesh289":"b2-change","mesh29":"b2-change","mesh290":"b2-change","mesh291":"b2-change","mesh292":"b2-change","mesh293":"b2-change","mesh294":"b2-change","mesh295":"b2-change","mesh296":"b2-change","mesh297":"b2-change","mesh298":"b2-change","mesh299":"b2-change","mesh30":"b2-change","mesh300":"b2-change","mesh301":"b2-change","mesh302":"b2-change","mesh31":"b2-change","mesh32":"b2-change","mesh33":"b2-change","mesh336":"b2-change","mesh337":"b2-change","mesh338":"b2-change","mesh339":"b2-change","mesh34":"b2-change","mesh340":"b2-change","mesh341":"b2-change","mesh342":"b2-change","mesh343":"b2-change","mesh344":"b2-change","mesh345":"b2-change","mesh346":"b2-change","mesh347":"b2-change","mesh348":"b2-change","mesh349":"b2-change","mesh35":"b2-change","mesh350":"b2-change","mesh351":"b2-change","mesh352":"b2-change","mesh353":"b2-change","mesh36":"b2-change","mesh37":"b2-change","mesh38":"b2-change","mesh387":"b2-change","mesh388":"b2-change","mesh389":"b2-change","mesh39":"b2-change","mesh390":"b2-change","mesh391":"b2-change","mesh392":"b2-change","mesh393":"b2-change","mesh394":"b2-change","mesh395":"b2-change","mesh396":"b2-change","mesh397":"b2-change","mesh398":"b2-change","mesh399":"b2-change","mesh40":"b2-change","mesh400":"b2-change","mesh401":"b2-change","mesh402":"b2-change","mesh403":"b2-change","mesh404":"b2-change","mesh41":"b2-change","mesh42":"b2-change","mesh43":"b2-change","mesh44":"b2-change","mesh45":"b2-change","mesh46":"b2-change","mesh47":"b2-change","mesh48":"b2-change","mesh49":"b2-change","mesh50":"b2-change","mesh51":"b2-change","mesh52":"b2-change","mesh53":"b2-change","mesh54":"b2-change","mesh55":"b2-change","mesh56":"b2-change","mesh57":"b2-change","mesh60":"b2-change","mesh61":"b2-change","mesh62":"b2-change","mesh63":"b2-change","mesh64":"b2-change","mesh65":"b2-change","mesh66":"b2-change","mesh67":"b2-change","mesh68":"b2-change","mesh69":"b2-change","mesh7":"b2-change","mesh70":"b2-change","mesh71":"b2-change","mesh72":"b2-change","mesh73":"b2-change","mesh74":"b2-change","mesh75":"b2-change","mesh76":"b2-change","mesh77":"b2-change","mesh78":"b2-change","mesh79":"b2-change","mesh8":"b2-change","mesh80":"b2-change","mesh81":"b2-change","mesh82":"b2-change","mesh83":"b2-change","mesh84":"b2-change","mesh85":"b2-change","mesh86":"b2-change","mesh87":"b2-change","mesh88":"b2-change","mesh89":"b2-change","mesh9":"b2-change","mesh90":"b2-change","mesh91":"b2-change","mesh92":"b2-change","mesh93":"b2-change","mesh94":"b2-change","mesh95":"b2-change","mesh96":"b2-change","mesh97":"b3-defer","mesh98":"b3-defer","mesh99":"b2-change","opening-liner":"b1-preserve","opening-liner.001":"b1-preserve","opening-liner.002":"b1-preserve","opening-liner.003":"b1-preserve","power-cable-0":"b1-preserve","power-cable-1":"b1-preserve","power-cable-2":"b1-preserve","rack-lower-shell":"b2-change","rack-open-rear-shell":"b2-change","rack-upper-shell":"b2-change","reactor-port-0-boot-rib":"b2-change","reactor-port-0-boot-rib.001":"b2-change","reactor-port-0-boot-rib.002":"b2-change","reactor-port-0-boot-rib.003":"b2-change","reactor-port-0-boot-rib.004":"b2-change","reactor-port-0-boot-seal":"b2-change","reactor-port-0-coupling":"b2-change","reactor-port-0-flange":"b2-change","reactor-port-0-seal":"b2-change","reactor-port-0-strain-relief":"b2-change","reactor-port-1-boot-rib":"b2-change","reactor-port-1-boot-rib.001":"b2-change","reactor-port-1-boot-rib.002":"b2-change","reactor-port-1-boot-rib.003":"b2-change","reactor-port-1-boot-rib.004":"b2-change","reactor-port-1-boot-seal":"b2-change","reactor-port-1-coupling":"b2-change","reactor-port-1-flange":"b2-change","reactor-port-1-seal":"b2-change","reactor-port-1-strain-relief":"b2-change","reactor-port-2-boot-rib":"b2-change","reactor-port-2-boot-rib.001":"b2-change","reactor-port-2-boot-rib.002":"b2-change","reactor-port-2-boot-rib.003":"b2-change","reactor-port-2-boot-rib.004":"b2-change","reactor-port-2-boot-seal":"b2-change","reactor-port-2-coupling":"b2-change","reactor-port-2-flange":"b2-change","reactor-port-2-seal":"b2-change","reactor-port-2-strain-relief":"b2-change","reactor-service-backplane":"b2-change","s5-neon-conduit":"b2-change","s5-neon-post-L":"b2-change","s5-neon-post-R":"b2-change","s5-nozzle-gland-0":"b2-change","s5-nozzle-gland-1":"b2-change","s5-nozzle-gland-2":"b2-change","s5-tag-hook-arm":"b2-change","s5-tag-hook-base":"b2-change","s5-tag-hook-eye":"b2-change","s5-tag-string-tie":"b2-change","s5r2-neon-board":"b1-preserve","s5r2-neon-clevis-pin-L":"b2-change","s5r2-neon-clevis-pin-R":"b2-change","s5r2-neon-clevis-plate-La":"b2-change","s5r2-neon-clevis-plate-Lb":"b2-change","s5r2-neon-clevis-plate-Ra":"b2-change","s5r2-neon-clevis-plate-Rb":"b2-change","s5r2-neon-clevis-yoke-L":"b2-change","s5r2-neon-clevis-yoke-R":"b2-change","s5r2-neon-mount-pad-L":"b2-change","s5r2-neon-mount-pad-R":"b2-change","service-backplane-mount":"b2-change","service-backplane-mount.001":"b2-change","service-bulkhead-with-opening":"b1-preserve","service-lower-return":"b2-change","service-upper-return":"b2-change","tank-milk":"b3-defer","wall-penetration-plate":"b1-preserve","wall-port-0-boot-rib":"b1-preserve","wall-port-0-boot-rib.001":"b1-preserve","wall-port-0-boot-rib.002":"b1-preserve","wall-port-0-boot-rib.003":"b1-preserve","wall-port-0-boot-rib.004":"b1-preserve","wall-port-0-boot-seal":"b1-preserve","wall-port-0-coupling":"b1-preserve","wall-port-0-flange":"b1-preserve","wall-port-0-seal":"b1-preserve","wall-port-0-strain-relief":"b1-preserve","wall-port-1-boot-rib":"b1-preserve","wall-port-1-boot-rib.001":"b1-preserve","wall-port-1-boot-rib.002":"b1-preserve","wall-port-1-boot-rib.003":"b1-preserve","wall-port-1-boot-rib.004":"b1-preserve","wall-port-1-boot-seal":"b1-preserve","wall-port-1-coupling":"b1-preserve","wall-port-1-flange":"b1-preserve","wall-port-1-seal":"b1-preserve","wall-port-1-strain-relief":"b1-preserve","wall-port-2-boot-rib":"b1-preserve","wall-port-2-boot-rib.001":"b1-preserve","wall-port-2-boot-rib.002":"b1-preserve","wall-port-2-boot-rib.003":"b1-preserve","wall-port-2-boot-rib.004":"b1-preserve","wall-port-2-boot-seal":"b1-preserve","wall-port-2-coupling":"b1-preserve","wall-port-2-flange":"b1-preserve","wall-port-2-seal":"b1-preserve","wall-port-2-strain-relief":"b1-preserve","inst168-base":"b2-change","inst169-base":"b2-change","inst190-base":"b2-change","inst195-base":"b2-change","inst58-base":"b2-change","inst59-base":"b2-change","raised-steel-treads-base":"b1-preserve","points108-bubble":"b3-defer","points197-bubble":"b3-defer"};
var B2={"roles":{"chrome":{"color":[0.78,0.8,0.83],"metalness":1,"roughness":0.11},"silver":{"color":[0.52,0.56,0.62],"metalness":1,"roughness":0.26},"turquoise":{"color":[0,0.723055,0.57758],"metalness":1,"roughness":0.35},"darkmetal":{"color":[0.032,0.034,0.037],"metalness":1,"roughness":0.24},"lid_drum":{"color":[0.045,0.05,0.065],"metalness":1,"roughness":0.33},"structural_steel":{"color":[0.16,0.19,0.22],"metalness":1,"roughness":0.3},"strut":{"color":[0.44,0.47,0.53],"metalness":1,"roughness":0.28},"collar":{"color":[0.6,0.62,0.66],"metalness":1,"roughness":0.1},"fitting":{"color":[0.64,0.66,0.7],"metalness":1,"roughness":0.07},"fanblade":{"color":[0.59,0.62,0.68],"metalness":1,"roughness":0.22},"rubber":{"color":[0.016,0.018,0.021],"metalness":0,"roughness":0.46},"gasket":{"color":[0.02,0.019,0.028],"metalness":0,"roughness":0.62},"darkseal":{"color":[0.004,0.005,0.005],"metalness":0,"roughness":0.74},"string":{"color":[0.58,0.54,0.48],"metalness":0,"roughness":0.72}},"display":{"mesh198":"neon","mesh61":"ringUpper","mesh62":"ringLower","mesh55":"lcd","mesh212":"tag"},"neon":{"core":0.8,"glow":0.8,"gamma":0.82},"displays":{"ringUpper":{"base":6,"text":6},"ringLower":{"base":6,"text":6},"lcd":{"base":5.5,"text":5.5}},"led":{"led_magenta":1.05,"led_pink":1.05,"led_turquoise":1.05},"tag":[0.25,0.045,0.1]};
function b2Scope(d){return B2_ASSIGN[d.name]||'b1-preserve';}
function b2Key(d){return b2Scope(d)==='b2-change'?(B2.display[d.name]||d.role):'keep';}
function linearHex(h){return new T.Color(h).convertSRGBToLinear();}
function b2Polish(m){
  var prior=m.onBeforeCompile,cache=m.customProgramCacheKey;
  m.onBeforeCompile=function(s){
    if(prior)prior(s);
    s.vertexShader=rep1(s.vertexShader,'#include <common>','#include <common>\nvarying vec3 vB2Polish;');
    s.vertexShader=rep1(s.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\nvB2Polish=position;');
    s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nvarying vec3 vB2Polish;');
    s.fragmentShader=rep1(s.fragmentShader,'#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+0.015*sin(vB2Polish.y*900.0),0.04,1.0);');
  };
  m.customProgramCacheKey=function(){return (cache?cache.call(m):'standard')+'-b2-polish';};
}
function b2Metal(role){
  var p=B2.roles[role]||{color:[.2,.2,.2],metalness:0,roughness:.6};
  var m=new T.MeshStandardMaterial({color:new T.Color(p.color[0],p.color[1],p.color[2]),metalness:p.metalness,roughness:p.roughness,envMap:envMap,envMapIntensity:doc.b1.env.intensity});
  // Unbaked external metals use PMREM plus the retained b1 direct specular lights; no added building illumination.
  m.onBeforeCompile=function(s){
    if(p.metalness===1)s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directDiffuse=vec3(0.0);');
  };
  m.customProgramCacheKey=function(){return 'b2-exterior-'+(p.metalness===1?'metal':'dielectric');};
  if(p.metalness===1)b2Polish(m);
  return m;
}
function b2Material(d,lm){
  var role=d.role,kind=B2.display[d.name],m;
  if(kind==='neon'){
    m=new T.MeshStandardMaterial({color:0,metalness:0,roughness:1,emissive:linearHex('#ff3550'),emissiveIntensity:1,map:tex.neon,transparent:true,depthWrite:false,side:T.DoubleSide});
    m.onBeforeCompile=function(s){
      s.uniforms.b2NeonCore={value:B2.neon.core};s.uniforms.b2NeonGlow={value:B2.neon.glow};s.uniforms.b2NeonGamma={value:B2.neon.gamma};
      s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform float b2NeonCore;\nuniform float b2NeonGlow;\nuniform float b2NeonGamma;');
      s.fragmentShader=rep1(s.fragmentShader,'#include <emissivemap_fragment>',
        'float b2A=texture2D(map,vUv).a; float b2C=clamp((b2A-0.86)/0.08,0.0,1.0); float b2H=clamp((b2A-0.97)/0.01,0.0,1.0); float b2G=pow(clamp((b2A-0.10)/0.80,0.0,1.0),b2NeonGamma); diffuseColor.a=max(b2C,b2G); float b2E=b2C*b2NeonCore*(1.0+0.6*b2H)+b2G*(1.0-b2C)*b2NeonGlow; totalEmissiveRadiance*=b2E/max(diffuseColor.a,0.001);');
    };
    m.customProgramCacheKey=function(){return 'b2-neon-alpha-fixed-red';};
  }else if(kind==='ringUpper'||kind==='ringLower'||kind==='lcd'){
    var map=tex[kind],cfg=B2.displays[kind];
    m=new T.MeshStandardMaterial({color:0,metalness:0,roughness:1,emissive:0xffffff,emissiveIntensity:1,emissiveMap:map});
    m.onBeforeCompile=function(s){
      s.uniforms.b2DisplayBase={value:cfg.base};s.uniforms.b2DisplayText={value:cfg.text};
      s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform float b2DisplayBase;\nuniform float b2DisplayText;');
      s.fragmentShader=rep1(s.fragmentShader,'#include <emissivemap_fragment>',
        'vec4 b2DT=texture2D(emissiveMap,vUv); vec3 b2DL=emissiveMapTexelToLinear(b2DT).rgb; float b2DMax=max(max(b2DL.r,b2DL.g),b2DL.b); totalEmissiveRadiance*=b2DL*mix(b2DisplayBase,b2DisplayText,smoothstep(0.012,0.045,b2DMax));');
    };
    m.customProgramCacheKey=function(){return 'b2-textured-display';};
  }else if(kind==='tag'){
    m=new T.MeshStandardMaterial({map:tex.tag,color:0xffffff,metalness:0,roughness:.72,envMap:envMap,envMapIntensity:1,side:T.FrontSide,alphaTest:.01});
    m.onBeforeCompile=function(s){s.uniforms.b2TagIrradiance={value:new T.Vector3(B2.tag[0],B2.tag[1],B2.tag[2])};s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform vec3 b2TagIrradiance;');s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directDiffuse*=b2TagIrradiance;reflectedLight.indirectDiffuse*=b2TagIrradiance;');};
    m.customProgramCacheKey=function(){return 'b2-tag-received-light';};
  }else if(role==='led_magenta'||role==='led_pink'||role==='led_turquoise'){
    m=new T.MeshStandardMaterial({color:0,emissive:linearHex(role==='led_turquoise'?'#00ddc8':'#ff05a8'),emissiveIntensity:B2.led[role],metalness:0,roughness:.9});
  }else if(role==='nozzle'){
    m=new T.MeshStandardMaterial({color:linearHex('#f2dbe9'),emissive:linearHex('#ff05a8'),emissiveIntensity:1.4,metalness:0,roughness:.09,envMap:envMap});
  }else if(lm){
    m=bakedMaterial(role,d.lightmap,d.lightmapClass,false,'b2');
    if(m.metalness===1)b2Polish(m);
  }else m=b2Metal(role);
  if(kind==='neon'||kind==='ringUpper'||kind==='ringLower'||kind==='lcd'||role==='led_magenta'||role==='led_pink'||role==='led_turquoise'){
    var emissionPrior=m.onBeforeCompile;
    m.onBeforeCompile=function(s){if(emissionPrior)emissionPrior(s);s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directDiffuse=vec3(0.0);reflectedLight.directSpecular=vec3(0.0);reflectedLight.indirectDiffuse=vec3(0.0);reflectedLight.indirectSpecular=vec3(0.0);');};
  }
  m.name='v10b2 '+(kind||role);m.userData.b2={role:role,kind:kind||role,scope:'b2-change'};
  return m;
}

var B3_OPTICS="// Source liquid smooth normals, not an invented spherical surface.\n// The geometry stays the source finite cylinder + 4.5 mm meniscus.\nfloat b3OpticalVisibility;\n// Reproduce the adopted Cycles material's enabled valid-specular-normal guard.\n// Both source materials have cycles.use_bump_map_correction == true (actual blend audit).\n// Source implementation reference, Blender v5.2.1:\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/closure/bsdf_util.h\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/svm/closure.h\n// Independently expressed closed-form solution of the reflected-ray hemisphere constraint.\n// Ng and Ns MUST face the incident side; wi points from the surface toward the incident ray origin.\n// For an incoming direction d (pointing toward the surface), use wi = -d.\n// This changes the shader normal used by the closure only; never alter source normal buffers.\nvec3 r3SpecularNormalCorrection(vec3 Ng, vec3 wi, vec3 Ns) {\n  Ng = normalize(Ng);\n  wi = normalize(wi);\n  Ns = normalize(Ns);\n  float incidentZ = dot(wi, Ng);\n  // The caller is responsible for geometric face orientation. Guard numerical tangency.\n  if (incidentZ < 0.0) return Ns;\n  float minimumReflectionZ = min(0.9 * incidentZ, 0.01);\n  vec3 reflected = 2.0 * dot(Ns, wi) * Ns - wi;\n  if (dot(Ng, reflected) >= minimumReflectionZ) return Ns;\n  vec3 tangent = Ns - dot(Ns, Ng) * Ng;\n  float tangentLength = length(tangent);\n  if (tangentLength < 1e-8) return Ng;\n  tangent /= tangentLength;\n  float incidentX = dot(wi, tangent);\n  float power = incidentX * incidentX + incidentZ * incidentZ;\n  if (power < 1e-12) return Ng;\n  float twiceSum = 2.0 * (power + incidentZ * minimumReflectionZ);\n  float constantTerm = (minimumReflectionZ + incidentZ) * (minimumReflectionZ + incidentZ);\n  float root = sqrt(max(0.0, twiceSum * twiceSum - 4.0 * power * constantTerm));\n  float cosineSquared = 0.25 * (twiceSum + (incidentX < 0.0 ? root : -root)) / power;\n  cosineSquared = clamp(cosineSquared, 0.0, 1.0);\n  return normalize(tangent * sqrt(max(0.0, 1.0 - cosineSquared)) + Ng * sqrt(cosineSquared));\n}\n// Derived from adopted source corner shading normals; this is not a geometric surface normal.\nvec2 r3LiquidTopPair(float r){\n if(r<=0.175927499876)return mix(vec2(0.0,1.0),vec2(-1.19653220974e-08,1.0),clamp((r-0.0)/0.175927499876,0.0,1.0));\n if(r<=0.311643003771)return mix(vec2(-1.19653220974e-08,1.0),vec2(-1.91094921357e-05,0.999999999817),clamp((r-0.175927499876)/0.135715503894,0.0,1.0));\n if(r<=0.402120000607)return mix(vec2(-1.91094921357e-05,0.999999999817),vec2(-0.00123855751976,0.999999232987),clamp((r-0.311643003771)/0.0904769968361,0.0,1.0));\n if(r<=0.452384999229)return mix(vec2(-0.00123855751976,0.999999232987),vec2(-0.0112984816027,0.999936170119),clamp((r-0.402120000607)/0.0502649986221,0.0,1.0));\n if(r<=0.472649997516)return mix(vec2(-0.0112984816027,0.999936170119),vec2(-0.0377228849513,0.999288238673),clamp((r-0.452384999229)/0.0202649982871,0.0,1.0));\n if(r<=0.482649998953)return mix(vec2(-0.0377228849513,0.999288238673),vec2(-0.0775712765488,0.996986808866),clamp((r-0.472649997516)/0.0100000014372,0.0,1.0));\n if(r<=0.489650000138)return mix(vec2(-0.0775712765488,0.996986808866),vec2(-0.125612540328,0.992079376719),clamp((r-0.482649998953)/0.00700000118446,0.0,1.0));\n if(r<=0.494649997704)return mix(vec2(-0.125612540328,0.992079376719),vec2(-0.178747510423,0.983894977889),clamp((r-0.489650000138)/0.00499999756625,0.0,1.0));\n if(r<=0.498649999553)return mix(vec2(-0.178747510423,0.983894977889),vec2(-0.238043368847,0.971254526138),clamp((r-0.494649997704)/0.00400000184928,0.0,1.0));\n if(r<=0.502650002828)return mix(vec2(-0.238043368847,0.971254526138),vec2(0.612237444549,0.790673960294),clamp((r-0.498649999553)/0.00400000327484,0.0,1.0));\n return vec2(0.612237444549,0.790673960294);\n}\nvec2 r3LiquidBottomPair(float r){\n if(r<=0.502650002828)return mix(vec2(0.0,-1.0),vec2(0.712541063597,-0.701630410321),clamp((r-0.0)/0.502650002828,0.0,1.0));\n return vec2(0.712541063597,-0.701630410321);\n}\nfloat r3LiquidTopHeight(float r){\n if(r<=0.175927499876)return mix(0.620000004768,0.620000004768,clamp((r-0.0)/0.175927499876,0.0,1.0));\n if(r<=0.311643003771)return mix(0.620000004768,0.620000004768,clamp((r-0.175927499876)/0.135715503894,0.0,1.0));\n if(r<=0.402120000607)return mix(0.620000004768,0.620003402233,clamp((r-0.311643003771)/0.0904769968361,0.0,1.0));\n if(r<=0.452384999229)return mix(0.620003402233,0.620124161243,clamp((r-0.402120000607)/0.0502649986221,0.0,1.0));\n if(r<=0.472649997516)return mix(0.620124161243,0.620527923107,clamp((r-0.452384999229)/0.0202649982871,0.0,1.0));\n if(r<=0.482649998953)return mix(0.620527923107,0.621078431606,clamp((r-0.472649997516)/0.0100000014372,0.0,1.0));\n if(r<=0.489650000138)return mix(0.621078431606,0.621778011322,clamp((r-0.482649998953)/0.00700000118446,0.0,1.0));\n if(r<=0.494649997704)return mix(0.621778011322,0.622541248798,clamp((r-0.489650000138)/0.00499999756625,0.0,1.0));\n if(r<=0.498649999553)return mix(0.622541248798,0.62338167429,clamp((r-0.494649997704)/0.00400000184928,0.0,1.0));\n if(r<=0.502650002828)return mix(0.62338167429,0.624499976635,clamp((r-0.498649999553)/0.00400000327484,0.0,1.0));\n return 0.624499976635;\n}\nvec3 r3LiquidSideNormal(vec3 p){\n float t=clamp((p.y-(-0.839500010014))/1.46399998665,0.0,1.0);\n vec2 ny=mix(vec2(0.712541063597,-0.701630410321),vec2(0.612237444549,0.790673960294),t);\n vec2 radial=p.xz/max(length(p.xz),0.00000001);\n return normalize(vec3(radial.x*ny.x,ny.y,radial.y*ny.x));\n}\n// surface: 0 side, +1 top meniscus, -1 bottom disk. Decide from intersected geometry.\nvec3 r3LiquidSourceNormal(vec3 p,int surface){\n if(surface==0)return r3LiquidSideNormal(p);\n float r=length(p.xz),sector=6.283185307179586/128.0;\n float delta=mod(atan(p.z,p.x),sector)-sector*0.5;\n float effectiveR=r*cos(delta)/cos(sector*0.5);\n vec2 ny=surface>0?r3LiquidTopPair(effectiveR):r3LiquidBottomPair(effectiveR);\n return normalize(vec3(p.x/max(r,0.00000001)*ny.x,ny.y,p.z/max(r,0.00000001)*ny.x));\n}\n\n// Exact compact interpolation of the source's128-segment triangle pattern.\n// Mean ring corner normals differ from original per-azimuth values by <0.00042deg in sampled triangles.\nvoid r3LiquidSector(vec3 p,out vec2 a,out vec2 b,out vec2 ab){\n float step=6.283185307179586/128.0;\n float angle=floor(atan(p.z,p.x)/step)*step;\n a=vec2(cos(angle),sin(angle));b=vec2(cos(angle+step),sin(angle+step));\n float det=sin(step);\n ab=vec2(p.x*b.y-p.z*b.x,a.x*p.z-a.y*p.x)/det;\n}\nvec3 r3LiquidRawNormal(vec2 radial,vec2 pair){return vec3(radial.x*pair.x,pair.y,radial.y*pair.x);}\nvec3 r3LiquidCapBand(vec2 ab,vec2 a,vec2 b,float ri,float ro,vec2 ni,vec2 no){\n vec3 A=r3LiquidRawNormal(a,ni),B=r3LiquidRawNormal(b,ni),C=r3LiquidRawNormal(a,no),D=r3LiquidRawNormal(b,no);\n if(ri<0.00000001){float wc=ab.x/ro,wd=ab.y/ro;return vec3(0.0,ni.y,0.0)*(1.0-wc-wd)+C*wc+D*wd;}\n if(ab.x/ro+ab.y/ri<=1.0){float wb=ab.y/ri,wc=(ab.x-ri*(1.0-wb))/(ro-ri);return A*(1.0-wb-wc)+B*wb+C*wc;}\n float wc=ab.x/ro,wd=(ab.y-ri*(1.0-wc))/(ro-ri);return B*(1.0-wc-wd)+D*wd+C*wc;\n}\nvec3 r3LiquidSideNormalExact(vec3 p){\n vec2 a,b,ab;r3LiquidSector(p,a,b,ab);\n float u=clamp(ab.y/max(ab.x+ab.y,0.00000001),0.0,1.0);\n float t=clamp((p.y-(-0.839500010014))/1.46399998665,0.0,1.0);\n vec2 lo=vec2(0.712541063597,-0.701630410321),hi=vec2(0.612237444549,0.790673960294);\n vec3 A=r3LiquidRawNormal(a,lo),B=r3LiquidRawNormal(b,lo),C=r3LiquidRawNormal(a,hi),D=r3LiquidRawNormal(b,hi);\n return normalize(t<=u?A*(1.0-u)+B*(u-t)+D*t:A*(1.0-t)+D*u+C*(t-u));\n}\nvec3 r3LiquidSourceNormalExact(vec3 p,int surface){\n if(surface==0)return r3LiquidSideNormalExact(p);\n vec2 a,b,ab;r3LiquidSector(p,a,b,ab);\n float r=ab.x+ab.y;\n if(surface<0)return normalize(r3LiquidCapBand(ab,a,b,0.0,0.502650002828,vec2(0.0,-1.0),vec2(0.712541063597,-0.701630410321)));\n if(r<=0.175927499876)return normalize(r3LiquidCapBand(ab,a,b,0.0,0.175927499876,vec2(0.0,1.0),vec2(-1.19653220974e-08,1.0)));\n if(r<=0.311643003771)return normalize(r3LiquidCapBand(ab,a,b,0.175927499876,0.311643003771,vec2(-1.19653220974e-08,1.0),vec2(-1.91094921357e-05,0.999999999817)));\n if(r<=0.402120000607)return normalize(r3LiquidCapBand(ab,a,b,0.311643003771,0.402120000607,vec2(-1.91094921357e-05,0.999999999817),vec2(-0.00123855751976,0.999999232987)));\n if(r<=0.452384999229)return normalize(r3LiquidCapBand(ab,a,b,0.402120000607,0.452384999229,vec2(-0.00123855751976,0.999999232987),vec2(-0.0112984816027,0.999936170119)));\n if(r<=0.472649997516)return normalize(r3LiquidCapBand(ab,a,b,0.452384999229,0.472649997516,vec2(-0.0112984816027,0.999936170119),vec2(-0.0377228849513,0.999288238673)));\n if(r<=0.482649998953)return normalize(r3LiquidCapBand(ab,a,b,0.472649997516,0.482649998953,vec2(-0.0377228849513,0.999288238673),vec2(-0.0775712765488,0.996986808866)));\n if(r<=0.489650000138)return normalize(r3LiquidCapBand(ab,a,b,0.482649998953,0.489650000138,vec2(-0.0775712765488,0.996986808866),vec2(-0.125612540328,0.992079376719)));\n if(r<=0.494649997704)return normalize(r3LiquidCapBand(ab,a,b,0.489650000138,0.494649997704,vec2(-0.125612540328,0.992079376719),vec2(-0.178747510423,0.983894977889)));\n if(r<=0.498649999553)return normalize(r3LiquidCapBand(ab,a,b,0.494649997704,0.498649999553,vec2(-0.178747510423,0.983894977889),vec2(-0.238043368847,0.971254526138)));\n return normalize(r3LiquidCapBand(ab,a,b,0.498649999553,0.502650002828,vec2(-0.238043368847,0.971254526138),vec2(0.612237444549,0.790673960294)));\n}\n\nvec3 r3LiquidCapNormal(vec3 p,bool top){return r3LiquidSourceNormalExact(p,top?1:-1); }\n\nvec3 r3LiquidGeometricSideNormal(vec3 p){float step=6.28318530718/128.0,a=(floor(atan(p.z,p.x)/step)+.5)*step;return vec3(cos(a),0.0,sin(a));}\n// Source near-side intersection sequence: outer98 \u2192 liquid \u2192 inward-facing inner97.\n// Cap routes remain separately handled because the two glass cylinders have no caps.\nbool r3NearCylinder(vec3 o,vec3 d,float r,out vec3 hit){\n float a=dot(d.xz,d.xz),b=dot(o.xz,d.xz),c=dot(o.xz,o.xz)-r*r;\n float discriminant=b*b-a*c;if(a<.000001||discriminant<0.0)return false;\n float t=(-b-sqrt(discriminant))/a;if(t<-.00001)return false;hit=o+d*max(t,0.0);return true;\n}\nbool r3Stack(float angle,float y,vec3 eye,out vec3 q,out vec3 direction){\n vec3 outer=vec3(.510*sin(angle),y,.510*cos(angle));\n vec3 n=normalize(vec3(outer.x,0.0,outer.z));\n direction=refract(normalize(outer-eye),r3SpecularNormalCorrection(r3LiquidGeometricSideNormal(outer),normalize(eye-outer),n),1.0/1.46);\n vec3 liquid;if(!r3NearCylinder(outer,direction,.50265,liquid))return false;\n if(liquid.y<-.8395||liquid.y>.6245)return false;\n direction=refract(direction,r3SpecularNormalCorrection(r3LiquidGeometricSideNormal(liquid),-direction,r3LiquidSideNormal(liquid)),1.0/1.336);\n if(!r3NearCylinder(liquid,direction,.50235,q))return false;\n if(q.y<-.840||q.y>.680)return false;\n direction=refract(direction,r3SpecularNormalCorrection(r3LiquidGeometricSideNormal(q),-direction,normalize(vec3(q.x,0.0,q.z))),1.46);\n return dot(direction,direction)>.5;\n}\nvec2 r3SnellResidual(float angle,float y,vec3 p,vec3 eye){\n vec3 q,d;if(!r3Stack(angle,y,eye,q,d))return vec2(10.0);\n vec3 miss=normalize(p-q)-d,azimuth=vec3(cos(angle),0.0,-sin(angle));\n return vec2(dot(miss,azimuth),miss.y);\n}\nfloat b3OpticalEnergy(vec3 s,vec3 p,vec3 eye){return length(s-eye)+1.336*length(s-p);}\nvec3 b3OpticalExit(vec3 p,vec3 eye){\n const float R=.510,eta=1.336,top=.6245,bottom=-.8395;\n b3OpticalVisibility=1.0;\n if(length(p.xz)>=.50265-.000001||p.y>=top-.000001||p.y<=bottom+.000001)return p;\n float er=length(eye.xz);if(er<R&&eye.y>bottom&&eye.y<top)return p;\n b3OpticalVisibility=0.0;vec3 best=p;float bestEnergy=1.0e20;\n if(er>R+.000001){\n  vec3 d=p-eye;float a=dot(d.xz,d.xz),b=dot(eye.xz,d.xz),c=er*er-R*R;\n  float along=(-b-sqrt(max(0.0,b*b-a*c)))/max(a,.0000001);vec3 initial=eye+d*along;\n  float eyeAngle=atan(eye.x,eye.z),limit=acos(clamp(R/er,0.0,1.0))-.000001;\n  float delta=atan(sin(atan(initial.x,initial.z)-eyeAngle),cos(atan(initial.x,initial.z)-eyeAngle));\n  float angle=eyeAngle+clamp(delta,-limit,limit),y=clamp(initial.y,bottom+.000002,top-.000002);\n  for(int iteration=0;iteration<14;iteration++){\n   vec2 f=r3SnellResidual(angle,y,p,eye);float e=.0002;\n   vec2 jx=(r3SnellResidual(angle+e/R,y,p,eye)-f)/e;\n   vec2 jy=(r3SnellResidual(angle,y+e,p,eye)-f)/e;\n   float determinant=jx.x*jy.y-jy.x*jx.y;\n   vec2 step=abs(determinant)>.0000001?vec2(jy.y*f.x-jy.x*f.y,-jx.y*f.x+jx.x*f.y)/determinant:vec2(0.0);\n   step*=min(1.0,.14/max(max(abs(step.x),abs(step.y)),.0000001));\n   float acceptedAngle=angle,acceptedY=y,energy=dot(f,f),scale=1.0;\n   for(int trial=0;trial<4;trial++){\n    float aa=eyeAngle+clamp(angle-step.x*scale/R-eyeAngle,-limit,limit),yy=clamp(y-step.y*scale,bottom+.000002,top-.000002);\n    vec2 ff=r3SnellResidual(aa,yy,p,eye);float ee=dot(ff,ff);\n    if(ee<energy){energy=ee;acceptedAngle=aa;acceptedY=yy;}scale*=.5;\n   }\n   angle=acceptedAngle;y=acceptedY;\n  }\n  vec3 s=vec3(R*sin(angle),y,R*cos(angle)),q,outgoing;bool stackValid=r3Stack(angle,y,eye,q,outgoing);\n  float residual=length(r3SnellResidual(angle,y,p,eye));\n  bool valid=stackValid&&residual<.003&&dot(outgoing,normalize(p-q))>.999&&y>bottom+.000003&&y<top-.000003;\n  best=s;bestEnergy=b3OpticalEnergy(s,p,eye);b3OpticalVisibility=valid?1.0:0.0;\n }\n // Caps: exact planar refraction away from the source's narrow meniscus; singular caustics are not multiple images.\n for(int cap=0;cap<2;cap++){\n  float plane=cap==0?.620:bottom,signY=cap==0?1.0:-1.0;\n  if(signY*(eye.y-plane)>.000001){\n   vec2 horizontal=eye.xz-p.xz;float distanceXZ=length(horizontal),airY=abs(eye.y-plane),liquidY=abs(p.y-plane),lo=0.0,hi=distanceXZ;\n   for(int k=0;k<24;k++){float x=(lo+hi)*.5;float derivative=eta*x/sqrt(x*x+liquidY*liquidY)-(distanceXZ-x)/sqrt((distanceXZ-x)*(distanceXZ-x)+airY*airY);if(derivative<0.0)lo=x;else hi=x;}\n   float x=(lo+hi)*.5;vec2 exitXZ=p.xz+horizontal*(x/max(distanceXZ,.0000001));vec3 s=vec3(exitXZ.x,plane,exitXZ.y);\n   float energy=b3OpticalEnergy(s,p,eye);if(length(exitXZ)<.50265&&(b3OpticalVisibility<.5||energy<bestEnergy)){best=s;bestEnergy=energy;b3OpticalVisibility=1.0;}\n  }\n }\n return best;\n}\n";
// s6b3: physical-world material approximation, limited to the 70 deferred entries.
var B3={medium:{ior:1.336,scatter:1,absorption:.10,radiance:[.46,.115,.23],refraction:1},brain:{irradiance:[1,1,1],emission:.10},milk:{irradiance:[1,1,1]},glass:{ior:1.46,roughness:.015},passes:[]};
var b3Aperture=null,b3Env=null;
var b3CompositeRT=null,b3CopyScene=null,b3CopyCamera=null,b3FinalScene=null;
var b3RT=null,b3Surfaces=[],b3Shaders=[],b3Rendering=false;
function b3Common(s){
 s.vertexShader=rep1(s.vertexShader,'#include <common>','#include <common>\nvarying vec3 vB3World;');
 s.vertexShader=rep1(s.vertexShader,'#include <project_vertex>','#include <project_vertex>\nvec4 b3P=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nb3P=instanceMatrix*b3P;\n#endif\nvB3World=(modelMatrix*b3P).xyz;');
 s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nvarying vec3 vB3World;');
}
function b3OpticalProjection(m){
 var before=m.onBeforeCompile,cache=m.customProgramCacheKey;
 m.onBeforeCompile=function(sh){before(sh);sh.uniforms.r3OpticalCapture=r3OpticalCapture;sh.vertexShader=rep1(sh.vertexShader,'#include <common>','#include <common>\nvarying float vB3OpticalVisibility;varying float r3OpticalTravel;uniform float r3OpticalCapture;\n'+B3_OPTICS);
 sh.vertexShader=rep1(sh.vertexShader,'#include <project_vertex>','#include <project_vertex>\nvec4 b3Point=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nb3Point=instanceMatrix*b3Point;\n#endif\nvec3 b3ObjectWorld=(modelMatrix*b3Point).xyz;vec3 b3Exit=b3ObjectWorld;vB3OpticalVisibility=1.0;if(r3OpticalCapture<.5){b3Exit=b3OpticalExit(b3ObjectWorld,cameraPosition);vB3OpticalVisibility=b3OpticalVisibility;}r3OpticalTravel=length(b3ObjectWorld-b3Exit);vec4 b3Clip=projectionMatrix*viewMatrix*vec4(b3Exit,1.0);if(b3Clip.w>0.0)gl_Position.xy=b3Clip.xy/b3Clip.w*gl_Position.w;');sh.fragmentShader=rep1(sh.fragmentShader,'#include <common>','#include <common>\nvarying float vB3OpticalVisibility;varying float r3OpticalTravel;');sh.fragmentShader=rep1(sh.fragmentShader,'#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(vB3OpticalVisibility<0.01)discard;');if(!m.transparent)sh.fragmentShader=rep1(sh.fragmentShader,'#include <premultiplied_alpha_fragment>','#include <premultiplied_alpha_fragment>\ngl_FragColor.a=-(1.0+r3OpticalTravel);');};
 m.customProgramCacheKey=function(){return cache.call(m)+'-fermat-cylinder';};
}
function b3Irradiance(m,rgb,brain){
 m.onBeforeCompile=function(s){b3Common(s);s.uniforms.b3Irradiance={value:new T.Vector3(rgb[0],rgb[1],rgb[2])};
 s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform vec3 b3Irradiance;');
 s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directDiffuse*=b3Irradiance;reflectedLight.indirectDiffuse*=b3Irradiance;'+(brain?'\nfloat b3Wrap=0.035*pow(1.0-abs(dot(normal,geometry.viewDir)),2.0);reflectedLight.indirectDiffuse+=diffuseColor.rgb*b3Irradiance*b3Wrap;':''));
 if(brain){
 s.vertexShader=rep1(s.vertexShader,'#include <common>','#include <common>\nattribute float b3Aperture;varying float vB3Aperture;attribute vec3 r3BrainReceived;varying vec3 vR3BrainReceived;');
 s.vertexShader=rep1(s.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\nvB3Aperture=b3Aperture;vR3BrainReceived=r3BrainReceived;');
 s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nvarying float vB3Aperture;varying vec3 vR3BrainReceived;');
 s.fragmentShader=rep1(s.fragmentShader,'#include <emissivemap_fragment>','#include <emissivemap_fragment>');
 s.fragmentShader=rep1(s.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );','float r3AO=mix(.30,1.0,sqrt(clamp(vB3Aperture,0.0,1.0)));outgoingLight=vR3BrainReceived+reflectedLight.directSpecular+reflectedLight.indirectSpecular+totalEmissiveRadiance;gl_FragColor=vec4(outgoingLight,diffuseColor.a);');
 s.fragmentShader=rep1(s.fragmentShader,'#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+0.006*vec3(sin(vB3World.y*830.0),sin(vB3World.z*790.0),sin(vB3World.x*910.0)));');

 }
 };m.customProgramCacheKey=function(){return 'b3-local-irradiance-'+(brain?'brain':'milk');};
}
var R3_TANK_VOLUME="// Positive, energy-preserving source-panorama quadrature.\nvoid r3TankIncidentBin(int i,out vec3 direction,out vec3 radiance,out float weight){\n if(i==0){direction=vec3(-0.525731112119,-0.850650808352,0.0);radiance=vec3(0.731383174266,0.118568906139,0.268270243222);weight=0.0833272379819;}\n else if(i==1){direction=vec3(0.0,-0.525731112119,-0.850650808352);radiance=vec3(0.653970501489,0.0726065075128,0.110372375395);weight=0.0832602256278;}\n else if(i==2){direction=vec3(-0.850650808352,0.0,-0.525731112119);radiance=vec3(0.406717496256,0.0775474477974,0.128039917593);weight=0.0834125363903;}\n else if(i==3){direction=vec3(-0.525731112119,0.850650808352,0.0);radiance=vec3(0.761652482475,0.312290605855,0.352571275702);weight=0.0833272379819;}\n else if(i==4){direction=vec3(0.0,-0.525731112119,0.850650808352);radiance=vec3(0.0772444983803,0.036782578009,0.0479738369712);weight=0.0832602256278;}\n else if(i==5){direction=vec3(0.850650808352,0.0,-0.525731112119);radiance=vec3(0.418994441765,0.0809640926513,0.13669059002);weight=0.0834125363903;}\n else if(i==6){direction=vec3(0.525731112119,-0.850650808352,0.0);radiance=vec3(0.749677886435,0.122028593556,0.275725578255);weight=0.0833272379819;}\n else if(i==7){direction=vec3(0.0,0.525731112119,-0.850650808352);radiance=vec3(0.107355083617,0.0647418195187,0.0769802813555);weight=0.0832602256278;}\n else if(i==8){direction=vec3(-0.850650808352,0.0,0.525731112119);radiance=vec3(2.50843760616,0.23596393332,0.369813611732);weight=0.0834125363903;}\n else if(i==9){direction=vec3(0.525731112119,0.850650808352,0.0);radiance=vec3(1.13689522112,0.345828845619,0.407820064825);weight=0.0833272379819;}\n else if(i==10){direction=vec3(0.0,0.525731112119,0.850650808352);radiance=vec3(12.6635121731,0.946235964368,1.46561169489);weight=0.0832602256278;}\n else if(i==11){direction=vec3(0.850650808352,0.0,0.525731112119);radiance=vec3(2.51703351472,0.235347372011,0.37041277569);weight=0.0834125363903;}\n else{direction=vec3(0,1,0);radiance=vec3(0);weight=0.0;}\n}\n// Source-derived tank transport trial. World geometry, fill plane and textures stay fixed.\n// Geometry bounds measured from export. Meniscus rises up to3.5mm above the flat plane;\n// its silhouette/normals remain the authored mesh, while this internal path bound is flat.\nfloat r3TankExit(vec3 p,vec3 d){\n vec2 q=p.yz-vec2(1.42,0.0);\n float a=dot(d.yz,d.yz),b=dot(q,d.yz),c=dot(q,q)-.3041*.3041;\n float radial=a>1e-8?(-b+sqrt(max(0.0,b*b-a*c)))/a:100.0;\n float side=d.x>1e-7?(.576-p.x)/d.x:(d.x< -1e-7?(-.576-p.x)/d.x:100.0);\n float top=d.y>1e-7?(1.59794033-p.y)/d.y:100.0;\n return max(0.0,min(radial,min(side,top)));\n}\nfloat r3TankPhase(float cosine){\n // HG g=.88, source value. Incoming-light propagation and outgoing-camera\n // direction both reverse the two vectors used here, leaving their dot unchanged.\n return .2256/(12.566370614*pow(max(.0144,1.7744-1.76*clamp(cosine,-1.0,1.0)),1.5));\n}\nfloat r3TankFresnel(float cosine,float eta){\n float c=clamp(cosine,0.0,1.0),ct2=1.0-eta*eta*(1.0-c*c);\n if(ct2<=0.0)return 1.0;\n float ct=sqrt(ct2),rs=(eta*c-ct)/max(eta*c+ct,1e-6),rp=(eta*ct-c)/max(eta*ct+c,1e-6);\n return clamp(.5*(rs*rs+rp*rp),0.0,1.0);\n}\nvec3 r3TankVolume(vec3 entry,vec3 ray,float lengthInMilk,vec3 sigmaS,vec3 sigmaT){\n // Source emission integrates once. Incident radiance is sampled directionally\n // below and attenuated from the actual boundary to each volume sample.\n vec3 emission=.30*vec3(1.0,.672443151,.854992628);\n vec3 sigmaReducedS=(1.0-.88)*sigmaS,sigmaTransport=sigmaT-sigmaS+sigmaReducedS;\n vec3 integrated=vec3(0.0);\n vec3 basisX=normalize(cross(abs(ray.y)<.95?vec3(0,1,0):vec3(1,0,0),ray));\n vec3 basisY=cross(ray,basisX);\n float stepLength=lengthInMilk/8.0;\n for(int pi=0;pi<8;pi++){\n  float travel=(float(pi)+.5)*stepLength;vec3 p=entry+ray*travel;\n  vec3 direct=vec3(0.0);\n  // Local homogeneous source-function closure with positive boundary quadrature.\n  // J=J_boundary+S*(1-escape), S=(sigma_s_prime*J+emission)/sigma_tr.\n  // Solve this linear feedback algebraically. It accounts for redistributed light\n  // rather than treating every reduced scattering event as absorption.\n  vec3 indirect=vec3(0.0),escape=vec3(0.0);\n  for(int ei=0;ei<12;ei++){\n   vec3 wi,incident;float weight;r3TankIncidentBin(ei,wi,incident,weight);\n   if(r3TankUseLocal<.5)incident=textureCubeUV(r3TankIncidentMap,wi,1.0).rgb;\n   vec3 attenuation=exp(-sigmaTransport*r3TankExit(p,wi));\n   indirect+=incident*attenuation*weight;escape+=attenuation*weight;\n  }\n  vec3 sourceFunction=(sigmaReducedS*indirect+emission)/max(sigmaTransport-sigmaReducedS+sigmaReducedS*escape,vec3(1e-7));\n  integrated+=exp(-sigmaTransport*travel)*sigmaTransport*sourceFunction*stepLength;\n  // Original540W rectangular emitter1.72x.30m.8 stratified area samples;\n  // dA cancels emitter area in L_e=power/(pi*area). No point-light softening.\n  for(int ax=0;ax<4;ax++)for(int ay=0;ay<2;ay++){\n   vec3 lamp=vec3(((float(ax)+.5)/4.0-.5)*1.72,1.758+((float(ay)+.5)/2.0-.5)*.30,.38);\n   vec3 delta=lamp-p;float dist2=max(dot(delta,delta),1e-8);vec3 wi=delta*inversesqrt(dist2);\n   float lightCos=max(0.0,dot(vec3(0,0,-1),-wi));\n   float incomingPath=r3TankExit(p,wi);\n   vec3 incident=vec3(1.0,.035601314,.080219820)*(540.0/(3.141592654*8.0))*lightCos/dist2;\n   direct+=incident*exp(-sigmaT*incomingPath)*r3TankPhase(dot(wi,ray));\n  }\n  // Actual four source point lights. Intervening opaque geometry shadows and\n  // refracted emitter-to-scatter paths are not solved by this analytic trial.\n  for(int li=0;li<4;li++){\n   vec3 lamp=li==0?vec3(.32,.33,.34):(li==1?vec3(-.26,-.23,-.30):(li==2?vec3(0,-2.3,0):vec3(0,.73,0)));\n   vec3 colour=li==0?vec3(1,.760524511,.854992628):(li==1?vec3(1,.266355604,.479320168):(li==2?vec3(0,.723055124,.577580452):vec3(1,.001517635,.391572475)));\n   float power=li==0?18.0:(li==1?6.0:(li==2?16.0:26.0));\n   vec3 delta=lamp-p;float dist2=max(dot(delta,delta),.0001);vec3 wi=normalize(delta);\n   direct+=colour*(power/(12.566370614*dist2))*exp(-sigmaT*r3TankExit(p,wi))*r3TankPhase(dot(wi,ray));\n  }\n  integrated+=exp(-sigmaT*travel)*sigmaS*direct*stepLength;\n }\n return integrated;\n}\n";
var R3_TANK_DOME="// Reproduce the adopted Cycles material's enabled valid-specular-normal guard.\n// Both source materials have cycles.use_bump_map_correction == true (actual blend audit).\n// Source implementation reference, Blender v5.2.1:\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/closure/bsdf_util.h\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/svm/closure.h\n// Independently expressed closed-form solution of the reflected-ray hemisphere constraint.\n// Ng and Ns MUST face the incident side; wi points from the surface toward the incident ray origin.\n// For an incoming direction d (pointing toward the surface), use wi = -d.\n// This changes the shader normal used by the closure only; never alter source normal buffers.\nvec3 r3SpecularNormalCorrection(vec3 Ng, vec3 wi, vec3 Ns) {\n  Ng = normalize(Ng);\n  wi = normalize(wi);\n  Ns = normalize(Ns);\n  float incidentZ = dot(wi, Ng);\n  // The caller is responsible for geometric face orientation. Guard numerical tangency.\n  if (incidentZ < 0.0) return Ns;\n  float minimumReflectionZ = min(0.9 * incidentZ, 0.01);\n  vec3 reflected = 2.0 * dot(Ns, wi) * Ns - wi;\n  if (dot(Ng, reflected) >= minimumReflectionZ) return Ns;\n  vec3 tangent = Ns - dot(Ns, Ng) * Ng;\n  float tangentLength = length(tangent);\n  if (tangentLength < 1e-8) return Ng;\n  tangent /= tangentLength;\n  float incidentX = dot(wi, tangent);\n  float power = incidentX * incidentX + incidentZ * incidentZ;\n  if (power < 1e-12) return Ng;\n  float twiceSum = 2.0 * (power + incidentZ * minimumReflectionZ);\n  float constantTerm = (minimumReflectionZ + incidentZ) * (minimumReflectionZ + incidentZ);\n  float root = sqrt(max(0.0, twiceSum * twiceSum - 4.0 * power * constantTerm));\n  float cosineSquared = 0.25 * (twiceSum + (incidentX < 0.0 ? root : -root)) / power;\n  cosineSquared = clamp(cosineSquared, 0.0, 1.0);\n  return normalize(tangent * sqrt(max(0.0, 1.0 - cosineSquared)) + Ng * sqrt(cosineSquared));\n}\n// Positive, energy-preserving source-panorama quadrature.\nvoid r3TankIncidentBin(int i,out vec3 direction,out vec3 radiance,out float weight){\n if(i==0){direction=vec3(-0.525731112119,-0.850650808352,0.0);radiance=vec3(0.731383174266,0.118568906139,0.268270243222);weight=0.0833272379819;}\n else if(i==1){direction=vec3(0.0,-0.525731112119,-0.850650808352);radiance=vec3(0.653970501489,0.0726065075128,0.110372375395);weight=0.0832602256278;}\n else if(i==2){direction=vec3(-0.850650808352,0.0,-0.525731112119);radiance=vec3(0.406717496256,0.0775474477974,0.128039917593);weight=0.0834125363903;}\n else if(i==3){direction=vec3(-0.525731112119,0.850650808352,0.0);radiance=vec3(0.761652482475,0.312290605855,0.352571275702);weight=0.0833272379819;}\n else if(i==4){direction=vec3(0.0,-0.525731112119,0.850650808352);radiance=vec3(0.0772444983803,0.036782578009,0.0479738369712);weight=0.0832602256278;}\n else if(i==5){direction=vec3(0.850650808352,0.0,-0.525731112119);radiance=vec3(0.418994441765,0.0809640926513,0.13669059002);weight=0.0834125363903;}\n else if(i==6){direction=vec3(0.525731112119,-0.850650808352,0.0);radiance=vec3(0.749677886435,0.122028593556,0.275725578255);weight=0.0833272379819;}\n else if(i==7){direction=vec3(0.0,0.525731112119,-0.850650808352);radiance=vec3(0.107355083617,0.0647418195187,0.0769802813555);weight=0.0832602256278;}\n else if(i==8){direction=vec3(-0.850650808352,0.0,0.525731112119);radiance=vec3(2.50843760616,0.23596393332,0.369813611732);weight=0.0834125363903;}\n else if(i==9){direction=vec3(0.525731112119,0.850650808352,0.0);radiance=vec3(1.13689522112,0.345828845619,0.407820064825);weight=0.0833272379819;}\n else if(i==10){direction=vec3(0.0,0.525731112119,0.850650808352);radiance=vec3(12.6635121731,0.946235964368,1.46561169489);weight=0.0832602256278;}\n else if(i==11){direction=vec3(0.850650808352,0.0,0.525731112119);radiance=vec3(2.51703351472,0.235347372011,0.37041277569);weight=0.0834125363903;}\n else{direction=vec3(0,1,0);radiance=vec3(0);weight=0.0;}\n}\n// Source-derived tank transport trial. World geometry, fill plane and textures stay fixed.\n// Geometry bounds measured from export. Meniscus rises up to3.5mm above the flat plane;\n// its silhouette/normals remain the authored mesh, while this internal path bound is flat.\nfloat r3TankExit(vec3 p,vec3 d){\n vec2 q=p.yz-vec2(1.42,0.0);\n float a=dot(d.yz,d.yz),b=dot(q,d.yz),c=dot(q,q)-.3041*.3041;\n float radial=a>1e-8?(-b+sqrt(max(0.0,b*b-a*c)))/a:100.0;\n float side=d.x>1e-7?(.576-p.x)/d.x:(d.x< -1e-7?(-.576-p.x)/d.x:100.0);\n float top=d.y>1e-7?(1.59794033-p.y)/d.y:100.0;\n return max(0.0,min(radial,min(side,top)));\n}\nfloat r3TankPhase(float cosine){\n // HG g=.88, source value. Incoming-light propagation and outgoing-camera\n // direction both reverse the two vectors used here, leaving their dot unchanged.\n return .2256/(12.566370614*pow(max(.0144,1.7744-1.76*clamp(cosine,-1.0,1.0)),1.5));\n}\nfloat r3TankFresnel(float cosine,float eta){\n float c=clamp(cosine,0.0,1.0),ct2=1.0-eta*eta*(1.0-c*c);\n if(ct2<=0.0)return 1.0;\n float ct=sqrt(ct2),rs=(eta*c-ct)/max(eta*c+ct,1e-6),rp=(eta*ct-c)/max(eta*ct+c,1e-6);\n return clamp(.5*(rs*rs+rp*rp),0.0,1.0);\n}\nvec3 r3TankVolume(vec3 entry,vec3 ray,float lengthInMilk,vec3 sigmaS,vec3 sigmaT){\n // Source emission integrates once. Incident radiance is sampled directionally\n // below and attenuated from the actual boundary to each volume sample.\n vec3 emission=.30*vec3(1.0,.672443151,.854992628);\n vec3 sigmaReducedS=(1.0-.88)*sigmaS,sigmaTransport=sigmaT-sigmaS+sigmaReducedS;\n vec3 integrated=vec3(0.0);\n vec3 basisX=normalize(cross(abs(ray.y)<.95?vec3(0,1,0):vec3(1,0,0),ray));\n vec3 basisY=cross(ray,basisX);\n float stepLength=lengthInMilk/8.0;\n for(int pi=0;pi<8;pi++){\n  float travel=(float(pi)+.5)*stepLength;vec3 p=entry+ray*travel;\n  vec3 direct=vec3(0.0);\n  // Local homogeneous source-function closure with positive boundary quadrature.\n  // J=J_boundary+S*(1-escape), S=(sigma_s_prime*J+emission)/sigma_tr.\n  // Solve this linear feedback algebraically. It accounts for redistributed light\n  // rather than treating every reduced scattering event as absorption.\n  vec3 indirect=vec3(0.0),escape=vec3(0.0);\n  for(int ei=0;ei<12;ei++){\n   vec3 wi,incident;float weight;r3TankIncidentBin(ei,wi,incident,weight);\n   if(r3TankUseLocal<.5)incident=textureCubeUV(r3TankIncidentMap,wi,1.0).rgb;\n   vec3 attenuation=exp(-sigmaTransport*r3TankExit(p,wi));\n   indirect+=incident*attenuation*weight;escape+=attenuation*weight;\n  }\n  vec3 sourceFunction=(sigmaReducedS*indirect+emission)/max(sigmaTransport-sigmaReducedS+sigmaReducedS*escape,vec3(1e-7));\n  integrated+=exp(-sigmaTransport*travel)*sigmaTransport*sourceFunction*stepLength;\n  // Original540W rectangular emitter1.72x.30m.8 stratified area samples;\n  // dA cancels emitter area in L_e=power/(pi*area). No point-light softening.\n  for(int ax=0;ax<4;ax++)for(int ay=0;ay<2;ay++){\n   vec3 lamp=vec3(((float(ax)+.5)/4.0-.5)*1.72,1.758+((float(ay)+.5)/2.0-.5)*.30,.38);\n   vec3 delta=lamp-p;float dist2=max(dot(delta,delta),1e-8);vec3 wi=delta*inversesqrt(dist2);\n   float lightCos=max(0.0,dot(vec3(0,0,-1),-wi));\n   float incomingPath=r3TankExit(p,wi);\n   vec3 incident=vec3(1.0,.035601314,.080219820)*(540.0/(3.141592654*8.0))*lightCos/dist2;\n   direct+=incident*exp(-sigmaT*incomingPath)*r3TankPhase(dot(wi,ray));\n  }\n  // Actual four source point lights. Intervening opaque geometry shadows and\n  // refracted emitter-to-scatter paths are not solved by this analytic trial.\n  for(int li=0;li<4;li++){\n   vec3 lamp=li==0?vec3(.32,.33,.34):(li==1?vec3(-.26,-.23,-.30):(li==2?vec3(0,-2.3,0):vec3(0,.73,0)));\n   vec3 colour=li==0?vec3(1,.760524511,.854992628):(li==1?vec3(1,.266355604,.479320168):(li==2?vec3(0,.723055124,.577580452):vec3(1,.001517635,.391572475)));\n   float power=li==0?18.0:(li==1?6.0:(li==2?16.0:26.0));\n   vec3 delta=lamp-p;float dist2=max(dot(delta,delta),.0001);vec3 wi=normalize(delta);\n   direct+=colour*(power/(12.566370614*dist2))*exp(-sigmaT*r3TankExit(p,wi))*r3TankPhase(dot(wi,ray));\n  }\n  integrated+=exp(-sigmaT*travel)*sigmaS*direct*stepLength;\n }\n return integrated;\n}\n// Finite source dome shell: near outer/inner boundaries, then far inner/outer.\n// Source milk radiance is sampled only when the reflected/transmitted ray actually\n// intersects authored milk bounds. Exterior rays use the new room panorama.\nfloat r3DomeF(float ci,float eta){ci=clamp(ci,0.0,1.0);float q=1.0-eta*eta*(1.0-ci*ci);if(q<=0.0)return 1.0;float ct=sqrt(q),rs=(eta*ci-ct)/max(eta*ci+ct,1e-6),rp=(eta*ct-ci)/max(eta*ct+ci,1e-6);return .5*(rs*rs+rp*rp);}\nfloat r3DomeSphere(vec3 p,vec3 d,vec3 c,float r){vec3 q=p-c;float b=dot(q,d),v=b*b-dot(q,q)+r*r;if(v<0.0)return -1.0;float a=-b-sqrt(v),z=-b+sqrt(v);return a>.00001?a:(z>.00001?z:-1.0);}\nfloat r3DomeMilkHit(vec3 p,vec3 d){\n float nearest=1e5;vec2 q=p.yz-vec2(1.42,0.0);float a=dot(d.yz,d.yz),b=dot(q,d.yz),c=dot(q,q)-.3041*.3041,disc=b*b-a*c;\n for(int i=0;i<5;i++){\n  float t=-1.0;\n  if(i<2&&a>1e-9&&disc>=0.0)t=(-b+(i==0?-1.0:1.0)*sqrt(disc))/a;\n  if(i==2&&abs(d.x)>1e-9)t=(-.576-p.x)/d.x;\n  if(i==3&&abs(d.x)>1e-9)t=(.576-p.x)/d.x;\n  if(i==4&&abs(d.y)>1e-9)t=(1.59794033-p.y)/d.y;\n  vec3 hit=p+d*t;\n  if(t>.00002&&t<nearest&&abs(hit.x)<=.57601&&hit.y<=1.59795&&length(hit.yz-vec2(1.42,0.0))<=.30411)nearest=t;\n }\n return nearest;\n}\nvec3 r3DomeRoomRough(vec3 p,vec3 d,float roughness){\n float a=max(dot(d.xz,d.xz),1e-8),b=dot(p.xz,d.xz),c=dot(p.xz,p.xz)-400.0;\n float t=(-b+sqrt(max(0.0,b*b-a*c)))/a;\n float cap=d.y>1e-8?(24.7-p.y)/d.y:(d.y< -1e-8?(-2.3-p.y)/d.y:1e5);\n if(cap>0.0)t=min(t,cap);\n return textureCubeUV(envMap,normalize(p+d*t-vec3(0,-.2,0)),roughness).rgb;\n}\n// Existing source mesh189 / mesh194, finite solid x-axis chrome cylinders.\n// This is a ray proxy for existing geometry, never additional scene geometry.\n// Source bounds: x[-.642,-.606] / [.606,.642], yz centre(1.42,0), radius .1705.\n// Circular proxy omits authored polygonal faceting and the chrome roughness noise.\nfloat r3DomeMetalHit(vec3 p,vec3 d,out vec3 normal){\n float nearest=1e5;normal=vec3(1.0,0.0,0.0);\n vec2 q=p.yz-vec2(1.42,0.0);float a=dot(d.yz,d.yz),b=dot(q,d.yz),c=dot(q,q)-.1705*.1705,disc=b*b-a*c;\n for(int body=0;body<2;body++){\n  float lo=body==0?-.642:.606,hi=body==0?-.606:.642;\n  for(int face=0;face<4;face++){\n   float t=-1.0;\n   if(face<2&&a>1e-10&&disc>=0.0)t=(-b+(face==0?-1.0:1.0)*sqrt(disc))/a;\n   if(face==2&&abs(d.x)>1e-10)t=(lo-p.x)/d.x;\n   if(face==3&&abs(d.x)>1e-10)t=(hi-p.x)/d.x;\n   if(t>.00002&&t<nearest){\n    vec3 h=p+d*t;vec2 radial=h.yz-vec2(1.42,0.0);\n    if(h.x>=lo-.00001&&h.x<=hi+.00001&&dot(radial,radial)<=.17051*.17051){\n     nearest=t;\n     if(face>=2)normal=vec3(face==2?-1.0:1.0,0.0,0.0);\n     else normal=vec3(0.0,radial/max(length(radial),.00000001));\n    }\n   }\n  }\n }\n return nearest;\n}\nvec3 r3DomeRoom(vec3 p,vec3 d){return r3DomeRoomRough(p,d,.015);}\nvec3 r3DomeMilkOrRoom(vec3 p,vec3 d,vec3 centre){\n if(dot(d,d)<.01)return vec3(0.0);\n float t=r3DomeMilkHit(p,d);\n vec3 metalN;float metalT=r3DomeMetalHit(p,d,metalN);\n if(metalT<1e4&&metalT<t){\n  // Existing Web chrome roughness .11 is a deliberate approximation of source\n  // noise(.025..085), not a change to original material or source geometry.\n  return vec3(.78,.80,.83)*r3DomeRoomRough(p+d*metalT,reflect(d,metalN),.11);\n }\n if(t<1e4){\n  vec3 hit=p+d*t,n;\n  if(abs(abs(hit.x)-.576)<.0001)n=vec3(sign(hit.x),0,0);\n  else if(abs(hit.y-1.59794033)<.0001)n=vec3(0,1,0);\n  else{\n   // Source flat body:120 arc panels between the authored meniscus endpoints.\n   float theta=atan(hit.z,hit.y-1.42),theta0=acos((1.60144031-1.42)/.3041);\n   float step=(6.28318530718-2.0*theta0)/120.0;\n   float face=sign(theta)*(theta0+(floor((abs(theta)-theta0)/step)+.5)*step);\n   n=vec3(0,cos(face),sin(face));\n  }\n  if(dot(n,d)>0.0)n=-n;\n  vec3 milkRay=refract(d,n,1.0/1.35),start=hit+milkRay*.00002;\n  float path=r3TankExit(start,milkRay),f=r3TankFresnel(max(0.0,dot(-d,n)),1.0/1.35);\n  vec3 sigmaS=14.0*vec3(1.0,.791297913,.863157213),sigmaA=.8*(vec3(1)-vec3(.686685324,.434153646,1)),sigmaT=sigmaS+sigmaA;\n  vec3 volume=r3TankVolume(start,milkRay,path,sigmaS,sigmaT);\n  vec3 through=r3DomeRoom(start+milkRay*path,milkRay)*exp(-sigmaT*path);\n  return (through+volume)*(1.0-f)+r3DomeRoom(hit,reflect(d,n))*f;\n }\n return r3DomeRoom(p,d);\n}\nvec3 r3DomeAir(vec3 p,vec3 d,vec3 centre){\n vec3 metalN;float metalT=r3DomeMetalHit(p,d,metalN);\n float milkT=r3DomeMilkHit(p,d),farT=r3DomeSphere(p+d*.00002,d,centre,.3038);\n vec3 farP=p+d*(farT+.00002);\n // Dome glass exists only on its authored half sphere. A ray through its open\n // equatorial plane is not allowed to strike an invented opposite hemisphere.\n bool inHemisphere=sign(centre.x)*(farP.x-centre.x)>=-.00002;\n if(farT<0.0||!inHemisphere||min(milkT,metalT)<farT)return r3DomeMilkOrRoom(p,d,centre);\n vec3 normal=-normalize(farP-centre);\n float f=r3DomeF(max(0.0,dot(-d,normal)),1.0/1.46);\n vec3 insideReflection=r3DomeMilkOrRoom(farP,reflect(d,normal),centre);\n vec3 glassRay=refract(d,normal,1.0/1.46);\n float outerT=r3DomeSphere(farP+glassRay*.00002,glassRay,centre,.31);\n if(outerT<0.0)return f*insideReflection;\n vec3 outerP=farP+glassRay*(outerT+.00002),outerNormal=-normalize(outerP-centre);\n float outerF=r3DomeF(max(0.0,dot(-glassRay,outerNormal)),1.46);\n vec3 outgoing=refract(glassRay,outerNormal,1.46);\n return f*insideReflection+(1.0-f)*(1.0-outerF)*r3DomeMilkOrRoom(outerP,outgoing,centre);\n}\nvec3 r3DomeTransport(vec3 p,vec3 incident,vec3 sourceN,vec3 geometricN,vec3 centre){\n vec3 radial=normalize(p-centre);if(dot(sourceN,radial)<0.0)discard;\n vec3 n=r3SpecularNormalCorrection(geometricN,-incident,sourceN);\n float firstF=r3DomeF(max(0.0,dot(-incident,n)),1.0/1.46);\n vec3 reflected=r3DomeMilkOrRoom(p,reflect(incident,n),centre);\n vec3 glassRay=refract(incident,n,1.0/1.46),transmitted=vec3(0.0);\n float innerT=r3DomeSphere(p+glassRay*.00002,glassRay,centre,.3038);\n if(innerT>0.0){\n  vec3 innerP=p+glassRay*(innerT+.00002),innerN=normalize(innerP-centre);\n  float innerF=r3DomeF(max(0.0,dot(-glassRay,innerN)),1.46);\n  vec3 airRay=refract(glassRay,innerN,1.46);\n  if(dot(airRay,airRay)>.01)transmitted+=(1.0-innerF)*r3DomeAir(innerP,airRay,centre);\n  vec3 bounce=reflect(glassRay,innerN);float exitT=r3DomeSphere(innerP+bounce*.00002,bounce,centre,.31);\n  if(exitT>0.0){vec3 exitP=innerP+bounce*(exitT+.00002),exitN=-normalize(exitP-centre);vec3 exitRay=refract(bounce,exitN,1.46);float exitF=r3DomeF(max(0.0,dot(-bounce,exitN)),1.46);if(dot(exitRay,exitRay)>.01)transmitted+=innerF*(1.0-exitF)*r3DomeMilkOrRoom(exitP,exitRay,centre);}\n }else{\n  // No crossing of the inner sphere: continue through actual solid rim to outer exit.\n  float t=r3DomeSphere(p+glassRay*.00002,glassRay,centre,.31);\n  if(t>0.0){vec3 ep=p+glassRay*(t+.00002),en=-normalize(ep-centre);float f=r3DomeF(max(0.0,dot(-glassRay,en)),1.46);transmitted=(1.0-f)*r3DomeMilkOrRoom(ep,refract(glassRay,en,1.46),centre);}\n }\n return firstF*reflected+(1.0-firstF)*transmitted;\n}\n";
function r3TankDomeMaterial(m,d){
 if(d.name!=='mesh187'&&d.name!=='mesh192')return;
 var before=m.onBeforeCompile,cache=m.customProgramCacheKey;
 m.onBeforeCompile=function(sh){
  before(sh);
  sh.uniforms.r3TankCompositeDepth={value:b3CompositeRT.depthTexture};sh.uniforms.r3TankIncidentMap={value:R3.tankEnv};sh.uniforms.r3TankUseLocal={value:1};
  sh.uniforms.b3InvProjection={value:camera.projectionMatrixInverse.clone()};sh.uniforms.b3Projection={value:camera.projectionMatrix.clone()};sh.uniforms.b3View={value:camera.matrixWorldInverse.clone()};sh.uniforms.b3Medium={value:new T.Vector3()};
  sh.uniforms.r3DomeCentre={value:new T.Vector3(d.name==='mesh187'?-.6:.6,1.42,0)};
  sh.fragmentShader=rep1(sh.fragmentShader,'#include <common>','#include <common>\nuniform sampler2D r3TankIncidentMap;uniform float r3TankUseLocal;uniform sampler2D r3TankCompositeDepth;uniform mat4 b3InvProjection;uniform mat4 b3Projection;uniform mat4 b3View;uniform vec3 b3Medium;uniform vec3 r3DomeCentre;\n');
  sh.fragmentShader=rep1(sh.fragmentShader,'#include <lights_physical_pars_fragment>','#include <lights_physical_pars_fragment>\n'+R3_TANK_DOME);
  sh.fragmentShader=rep1(sh.fragmentShader,`float glassF=.035+.965*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);
vec3 background=texture2D(b3Composite,gl_FragCoord.xy/b3Resolution).rgb;
outgoingLight=background*(1.0-glassF)+outgoingLight;
gl_FragColor=vec4(outgoingLight,1.0);`,`vec3 r3DomeI=normalize(vB3World-cameraPosition),r3DomeNs=normalize(inverseTransformDirection(normal,viewMatrix));
vec3 r3DomeNg=normalize(cross(dFdx(vB3World),dFdy(vB3World)));if(dot(r3DomeNg,-r3DomeI)<0.0)r3DomeNg=-r3DomeNg;
outgoingLight=r3DomeTransport(vB3World,r3DomeI,r3DomeNs,r3DomeNg,r3DomeCentre)+reflectedLight.directSpecular;
gl_FragColor=vec4(outgoingLight,1.0);`);
 };
 m.customProgramCacheKey=function(){return cache.call(m)+'-r3-tank-actual-volume-v3-metal-rayproxy';};
}

function b3Material(d){
 var role=d.role,m;
 if(role==='glass'){
  m=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.015,metalness:0,envMap:(d.name==='mesh97'||d.name==='mesh98')?b3Env:envMap,envMapIntensity:1,transparent:true,opacity:1,depthWrite:false,side:T.FrontSide});m.reflectivity=Math.sqrt(Math.pow((1.46-1)/(1.46+1),2)/.16);
  m.onBeforeCompile=function(sh){b3Common(sh);sh.uniforms.b3Composite={value:b3CompositeRT.texture};sh.uniforms.b3Resolution={value:new T.Vector2(b3CompositeRT.width,b3CompositeRT.height)};b3Shaders.push(sh);
   sh.fragmentShader=rep1(sh.fragmentShader,'#include <common>','#include <common>\nuniform sampler2D b3Composite;uniform vec2 b3Resolution;');
   sh.fragmentShader=rep1(sh.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directDiffuse=vec3(0.0);reflectedLight.indirectDiffuse=vec3(0.0);');
   sh.fragmentShader=rep1(sh.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`float glassF=.035+.965*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);
vec3 background=texture2D(b3Composite,gl_FragCoord.xy/b3Resolution).rgb;
outgoingLight=background*(1.0-glassF)+outgoingLight;
gl_FragColor=vec4(outgoingLight,1.0);`);
  };
  m.customProgramCacheKey=function(){return 'b3-glass-linear-composite';};
 }else if(d.name==='culture-liquid'){
  m=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.0525,metalness:0,reflectivity:Math.sqrt(.0207/.16),envMap:b3Env,envMapIntensity:1,transparent:true,opacity:1,depthWrite:false,side:T.FrontSide});
  m.onBeforeCompile=function(s){b3Common(s);s.fragmentShader=rep1(s.fragmentShader,'#include <normal_fragment_maps>','#include <normal_fragment_maps>\nvec3 r3Wi=normalize(cameraPosition-vB3World),r3Ng=normalize(cross(dFdx(vB3World),dFdy(vB3World)));if(dot(r3Ng,r3Wi)<0.0)r3Ng=-r3Ng;vec3 r3Ns=normalize(inverseTransformDirection(normal,viewMatrix));normal=normalize((viewMatrix*vec4(r3SpecularNormalCorrection(r3Ng,r3Wi,r3Ns),0.0)).xyz);');s.uniforms.b3Background={value:b3RT.texture};s.uniforms.b3Depth={value:b3RT.depthTexture};s.uniforms.b3Resolution={value:new T.Vector2(b3RT.width,b3RT.height)};s.uniforms.b3InvProjection={value:camera.projectionMatrixInverse.clone()};s.uniforms.b3Projection={value:camera.projectionMatrix.clone()};s.uniforms.b3View={value:camera.matrixWorldInverse.clone()};s.uniforms.b3Medium={value:new T.Vector3(.46,.115,.23)};s.uniforms.r3RoomEnv={value:envMap};r3BaseUniforms(s);s.uniforms.r3VatVisibility={value:R3.vatVisibility};s.uniforms.r3UseVolumeShadow={value:query.has('review')&&query.has('no-vat-shadow')?0:1};s.uniforms.r3VatComponents={value:new T.Vector4(r3VatDiagnostic==='no-internal'?0:1,r3VatDiagnostic==='no-liquid-spec'?0:1,r3VatDiagnostic==='no-scatter'?0:1,r3VatDiagnostic==='no-far'?0:1)};b3Shaders.push(s);
  s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform sampler2D b3Background;uniform sampler2D b3Depth;uniform vec2 b3Resolution;uniform mat4 b3InvProjection;uniform mat4 b3Projection;uniform mat4 b3View;uniform vec3 b3Medium;uniform sampler2D r3RoomEnv;\n'+"// Reproduce the adopted Cycles material's enabled valid-specular-normal guard.\n// Both source materials have cycles.use_bump_map_correction == true (actual blend audit).\n// Source implementation reference, Blender v5.2.1:\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/closure/bsdf_util.h\n// https://raw.githubusercontent.com/blender/blender/v5.2.1/intern/cycles/kernel/svm/closure.h\n// Independently expressed closed-form solution of the reflected-ray hemisphere constraint.\n// Ng and Ns MUST face the incident side; wi points from the surface toward the incident ray origin.\n// For an incoming direction d (pointing toward the surface), use wi = -d.\n// This changes the shader normal used by the closure only; never alter source normal buffers.\nvec3 r3SpecularNormalCorrection(vec3 Ng, vec3 wi, vec3 Ns) {\n  Ng = normalize(Ng);\n  wi = normalize(wi);\n  Ns = normalize(Ns);\n  float incidentZ = dot(wi, Ng);\n  // The caller is responsible for geometric face orientation. Guard numerical tangency.\n  if (incidentZ < 0.0) return Ns;\n  float minimumReflectionZ = min(0.9 * incidentZ, 0.01);\n  vec3 reflected = 2.0 * dot(Ns, wi) * Ns - wi;\n  if (dot(Ng, reflected) >= minimumReflectionZ) return Ns;\n  vec3 tangent = Ns - dot(Ns, Ng) * Ng;\n  float tangentLength = length(tangent);\n  if (tangentLength < 1e-8) return Ng;\n  tangent /= tangentLength;\n  float incidentX = dot(wi, tangent);\n  float power = incidentX * incidentX + incidentZ * incidentZ;\n  if (power < 1e-12) return Ng;\n  float twiceSum = 2.0 * (power + incidentZ * minimumReflectionZ);\n  float constantTerm = (minimumReflectionZ + incidentZ) * (minimumReflectionZ + incidentZ);\n  float root = sqrt(max(0.0, twiceSum * twiceSum - 4.0 * power * constantTerm));\n  float cosineSquared = 0.25 * (twiceSum + (incidentX < 0.0 ? root : -root)) / power;\n  cosineSquared = clamp(cosineSquared, 0.0, 1.0);\n  return normalize(tangent * sqrt(max(0.0, 1.0 - cosineSquared)) + Ng * sqrt(cosineSquared));\n}\n// Derived from adopted source corner shading normals; this is not a geometric surface normal.\nvec2 r3LiquidTopPair(float r){\n if(r<=0.175927499876)return mix(vec2(0.0,1.0),vec2(-1.19653220974e-08,1.0),clamp((r-0.0)/0.175927499876,0.0,1.0));\n if(r<=0.311643003771)return mix(vec2(-1.19653220974e-08,1.0),vec2(-1.91094921357e-05,0.999999999817),clamp((r-0.175927499876)/0.135715503894,0.0,1.0));\n if(r<=0.402120000607)return mix(vec2(-1.91094921357e-05,0.999999999817),vec2(-0.00123855751976,0.999999232987),clamp((r-0.311643003771)/0.0904769968361,0.0,1.0));\n if(r<=0.452384999229)return mix(vec2(-0.00123855751976,0.999999232987),vec2(-0.0112984816027,0.999936170119),clamp((r-0.402120000607)/0.0502649986221,0.0,1.0));\n if(r<=0.472649997516)return mix(vec2(-0.0112984816027,0.999936170119),vec2(-0.0377228849513,0.999288238673),clamp((r-0.452384999229)/0.0202649982871,0.0,1.0));\n if(r<=0.482649998953)return mix(vec2(-0.0377228849513,0.999288238673),vec2(-0.0775712765488,0.996986808866),clamp((r-0.472649997516)/0.0100000014372,0.0,1.0));\n if(r<=0.489650000138)return mix(vec2(-0.0775712765488,0.996986808866),vec2(-0.125612540328,0.992079376719),clamp((r-0.482649998953)/0.00700000118446,0.0,1.0));\n if(r<=0.494649997704)return mix(vec2(-0.125612540328,0.992079376719),vec2(-0.178747510423,0.983894977889),clamp((r-0.489650000138)/0.00499999756625,0.0,1.0));\n if(r<=0.498649999553)return mix(vec2(-0.178747510423,0.983894977889),vec2(-0.238043368847,0.971254526138),clamp((r-0.494649997704)/0.00400000184928,0.0,1.0));\n if(r<=0.502650002828)return mix(vec2(-0.238043368847,0.971254526138),vec2(0.612237444549,0.790673960294),clamp((r-0.498649999553)/0.00400000327484,0.0,1.0));\n return vec2(0.612237444549,0.790673960294);\n}\nvec2 r3LiquidBottomPair(float r){\n if(r<=0.502650002828)return mix(vec2(0.0,-1.0),vec2(0.712541063597,-0.701630410321),clamp((r-0.0)/0.502650002828,0.0,1.0));\n return vec2(0.712541063597,-0.701630410321);\n}\nfloat r3LiquidTopHeight(float r){\n if(r<=0.175927499876)return mix(0.620000004768,0.620000004768,clamp((r-0.0)/0.175927499876,0.0,1.0));\n if(r<=0.311643003771)return mix(0.620000004768,0.620000004768,clamp((r-0.175927499876)/0.135715503894,0.0,1.0));\n if(r<=0.402120000607)return mix(0.620000004768,0.620003402233,clamp((r-0.311643003771)/0.0904769968361,0.0,1.0));\n if(r<=0.452384999229)return mix(0.620003402233,0.620124161243,clamp((r-0.402120000607)/0.0502649986221,0.0,1.0));\n if(r<=0.472649997516)return mix(0.620124161243,0.620527923107,clamp((r-0.452384999229)/0.0202649982871,0.0,1.0));\n if(r<=0.482649998953)return mix(0.620527923107,0.621078431606,clamp((r-0.472649997516)/0.0100000014372,0.0,1.0));\n if(r<=0.489650000138)return mix(0.621078431606,0.621778011322,clamp((r-0.482649998953)/0.00700000118446,0.0,1.0));\n if(r<=0.494649997704)return mix(0.621778011322,0.622541248798,clamp((r-0.489650000138)/0.00499999756625,0.0,1.0));\n if(r<=0.498649999553)return mix(0.622541248798,0.62338167429,clamp((r-0.494649997704)/0.00400000184928,0.0,1.0));\n if(r<=0.502650002828)return mix(0.62338167429,0.624499976635,clamp((r-0.498649999553)/0.00400000327484,0.0,1.0));\n return 0.624499976635;\n}\nvec3 r3LiquidSideNormal(vec3 p){\n float t=clamp((p.y-(-0.839500010014))/1.46399998665,0.0,1.0);\n vec2 ny=mix(vec2(0.712541063597,-0.701630410321),vec2(0.612237444549,0.790673960294),t);\n vec2 radial=p.xz/max(length(p.xz),0.00000001);\n return normalize(vec3(radial.x*ny.x,ny.y,radial.y*ny.x));\n}\n// surface: 0 side, +1 top meniscus, -1 bottom disk. Decide from intersected geometry.\nvec3 r3LiquidSourceNormal(vec3 p,int surface){\n if(surface==0)return r3LiquidSideNormal(p);\n float r=length(p.xz),sector=6.283185307179586/128.0;\n float delta=mod(atan(p.z,p.x),sector)-sector*0.5;\n float effectiveR=r*cos(delta)/cos(sector*0.5);\n vec2 ny=surface>0?r3LiquidTopPair(effectiveR):r3LiquidBottomPair(effectiveR);\n return normalize(vec3(p.x/max(r,0.00000001)*ny.x,ny.y,p.z/max(r,0.00000001)*ny.x));\n}\n\n// Exact compact interpolation of the source's128-segment triangle pattern.\n// Mean ring corner normals differ from original per-azimuth values by <0.00042deg in sampled triangles.\nvoid r3LiquidSector(vec3 p,out vec2 a,out vec2 b,out vec2 ab){\n float step=6.283185307179586/128.0;\n float angle=floor(atan(p.z,p.x)/step)*step;\n a=vec2(cos(angle),sin(angle));b=vec2(cos(angle+step),sin(angle+step));\n float det=sin(step);\n ab=vec2(p.x*b.y-p.z*b.x,a.x*p.z-a.y*p.x)/det;\n}\nvec3 r3LiquidRawNormal(vec2 radial,vec2 pair){return vec3(radial.x*pair.x,pair.y,radial.y*pair.x);}\nvec3 r3LiquidCapBand(vec2 ab,vec2 a,vec2 b,float ri,float ro,vec2 ni,vec2 no){\n vec3 A=r3LiquidRawNormal(a,ni),B=r3LiquidRawNormal(b,ni),C=r3LiquidRawNormal(a,no),D=r3LiquidRawNormal(b,no);\n if(ri<0.00000001){float wc=ab.x/ro,wd=ab.y/ro;return vec3(0.0,ni.y,0.0)*(1.0-wc-wd)+C*wc+D*wd;}\n if(ab.x/ro+ab.y/ri<=1.0){float wb=ab.y/ri,wc=(ab.x-ri*(1.0-wb))/(ro-ri);return A*(1.0-wb-wc)+B*wb+C*wc;}\n float wc=ab.x/ro,wd=(ab.y-ri*(1.0-wc))/(ro-ri);return B*(1.0-wc-wd)+D*wd+C*wc;\n}\nvec3 r3LiquidSideNormalExact(vec3 p){\n vec2 a,b,ab;r3LiquidSector(p,a,b,ab);\n float u=clamp(ab.y/max(ab.x+ab.y,0.00000001),0.0,1.0);\n float t=clamp((p.y-(-0.839500010014))/1.46399998665,0.0,1.0);\n vec2 lo=vec2(0.712541063597,-0.701630410321),hi=vec2(0.612237444549,0.790673960294);\n vec3 A=r3LiquidRawNormal(a,lo),B=r3LiquidRawNormal(b,lo),C=r3LiquidRawNormal(a,hi),D=r3LiquidRawNormal(b,hi);\n return normalize(t<=u?A*(1.0-u)+B*(u-t)+D*t:A*(1.0-t)+D*u+C*(t-u));\n}\nvec3 r3LiquidSourceNormalExact(vec3 p,int surface){\n if(surface==0)return r3LiquidSideNormalExact(p);\n vec2 a,b,ab;r3LiquidSector(p,a,b,ab);\n float r=ab.x+ab.y;\n if(surface<0)return normalize(r3LiquidCapBand(ab,a,b,0.0,0.502650002828,vec2(0.0,-1.0),vec2(0.712541063597,-0.701630410321)));\n if(r<=0.175927499876)return normalize(r3LiquidCapBand(ab,a,b,0.0,0.175927499876,vec2(0.0,1.0),vec2(-1.19653220974e-08,1.0)));\n if(r<=0.311643003771)return normalize(r3LiquidCapBand(ab,a,b,0.175927499876,0.311643003771,vec2(-1.19653220974e-08,1.0),vec2(-1.91094921357e-05,0.999999999817)));\n if(r<=0.402120000607)return normalize(r3LiquidCapBand(ab,a,b,0.311643003771,0.402120000607,vec2(-1.91094921357e-05,0.999999999817),vec2(-0.00123855751976,0.999999232987)));\n if(r<=0.452384999229)return normalize(r3LiquidCapBand(ab,a,b,0.402120000607,0.452384999229,vec2(-0.00123855751976,0.999999232987),vec2(-0.0112984816027,0.999936170119)));\n if(r<=0.472649997516)return normalize(r3LiquidCapBand(ab,a,b,0.452384999229,0.472649997516,vec2(-0.0112984816027,0.999936170119),vec2(-0.0377228849513,0.999288238673)));\n if(r<=0.482649998953)return normalize(r3LiquidCapBand(ab,a,b,0.472649997516,0.482649998953,vec2(-0.0377228849513,0.999288238673),vec2(-0.0775712765488,0.996986808866)));\n if(r<=0.489650000138)return normalize(r3LiquidCapBand(ab,a,b,0.482649998953,0.489650000138,vec2(-0.0775712765488,0.996986808866),vec2(-0.125612540328,0.992079376719)));\n if(r<=0.494649997704)return normalize(r3LiquidCapBand(ab,a,b,0.489650000138,0.494649997704,vec2(-0.125612540328,0.992079376719),vec2(-0.178747510423,0.983894977889)));\n if(r<=0.498649999553)return normalize(r3LiquidCapBand(ab,a,b,0.494649997704,0.498649999553,vec2(-0.178747510423,0.983894977889),vec2(-0.238043368847,0.971254526138)));\n return normalize(r3LiquidCapBand(ab,a,b,0.498649999553,0.502650002828,vec2(-0.238043368847,0.971254526138),vec2(0.612237444549,0.790673960294)));\n}\n\nvec3 r3LiquidCapNormal(vec3 p,bool top){return r3LiquidSourceNormalExact(p,top?1:-1); }\n\nvec3 r3LiquidGeometricSideNormal(vec3 p){float step=6.28318530718/128.0,a=(floor(atan(p.z,p.x)/step)+.5)*step;return vec3(cos(a),0.0,sin(a));}\n");
  s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform vec4 r3VatComponents;');
  s.fragmentShader=rep1(s.fragmentShader,'#include <envmap_physical_pars_fragment>','#include <envmap_physical_pars_fragment>\n'+"uniform sampler2D r3BaseImage;\nuniform sampler2D r3BaseDepth;\nuniform mat4 r3BaseMatrix;\nuniform mat4 r3BaseInverse;\nvec3 r3BaseRadiance(vec3 p,vec3 incoming){\n vec4 q=r3BaseMatrix*vec4(p,1.0);vec2 uv=q.xy/q.w;\n if(q.w<=0.0||any(lessThan(uv,vec2(0.0)))||any(greaterThan(uv,vec2(1.0))))return vec3(0.0);\n float depth=texture2D(r3BaseDepth,uv).r;vec4 hit=r3BaseInverse*vec4(uv*2.0-1.0,depth*2.0-1.0,1.0);\n float travel=depth<.99999?min(2.0,length(hit.xyz/hit.w-p)):1.4;\n vec3 reflected=texture2D(r3BaseImage,uv).rgb*exp(-vec3(.887923121,.745300052,.837264353)*travel);\n // Analytic disk-specular trial is retained in diagnostics only: it produced\n // a closed white patch absent from the adopted reference. Full rough thin-layer\n // transport of this near emitter remains unresolved; no fake replacement fill.\n return reflected;\n}\n// Position-aware boundary transport. Interior and exterior radiance are separate.\n// Liquid/inner-glass/outer-glass keep the adopted overlapping source ordering.\nuniform sampler2D r3VatVisibility;\nuniform float r3UseVolumeShadow;\nvec4 r3VolumeLampVisibility(vec3 p){\n vec3 cell=clamp((p-vec3(-.50265,-.8395,-.50265))/vec3(1.0053,1.464,1.0053),0.0,1.0)*vec3(31.0,47.0,31.0);\n float z0=floor(cell.z),z1=min(z0+1.0,31.0);\n vec4 a=texture2D(r3VatVisibility,vec2((cell.x+.5+z0*32.0)/1024.0,(cell.y+.5)/48.0));\n vec4 b=texture2D(r3VatVisibility,vec2((cell.x+.5+z1*32.0)/1024.0,(cell.y+.5)/48.0));\n return mix(vec4(1.0),mix(a,b,fract(cell.z)),r3UseVolumeShadow);\n}\nfloat r3InterfaceFresnel(float cosine,float eta){\n float k=1.0-eta*eta*(1.0-cosine*cosine);if(k<=0.0)return 1.0;\n float ct=sqrt(k),rs=(eta*cosine-ct)/max(.000001,eta*cosine+ct),rp=(eta*ct-cosine)/max(.000001,eta*ct+cosine);\n return clamp(.5*(rs*rs+rp*rp),0.0,1.0);\n}\nfloat r3LocalCapHit(vec3 p,vec3 d,out vec3 hit){\n float nearest=1e5;hit=p;\n for(int k=0;k<2;k++){\n  float y=k==0?.646:-.806;\n  float t=abs(d.y)>.000001?(y-p.y)/d.y:-1.0;vec3 q=p+d*t;\n  if(t>.0002&&t<nearest&&length(q.xz)<.518&&(k==1||length(q.xz)>.03293)){nearest=t;hit=q;}\n }\n return nearest;\n}\nfloat r3LiquidNext(vec3 o,vec3 d,out vec3 p,out int cap){\n float a=max(dot(d.xz,d.xz),.0000001),b=dot(o.xz,d.xz),c=dot(o.xz,o.xz)-.50265*.50265;\n float t=max(.0001,(-b+sqrt(max(0.0,b*b-a*c)))/a);cap=0;\n float tc=d.y>.000001?(.6245-o.y)/d.y:(d.y<-.000001?(-.8395-o.y)/d.y:1e5);\n if(tc>.00001&&tc<t){t=tc;cap=d.y>0.0?1:-1;}p=o+d*t;return t;\n}\nvoid r3LeaveLiquid(vec3 p,vec3 d,int cap,out vec3 air,out vec3 bounce,out float fresnel){\n vec3 radial=normalize(vec3(p.x,0.0,p.z));\n vec3 ng=cap==0?r3LiquidGeometricSideNormal(p):vec3(0.0,float(cap),0.0);\n vec3 ns=cap==0?r3LiquidSideNormal(p):r3LiquidCapNormal(p,cap>0);\n // An inside ray reaches inward-facing inner97 before the overlapping liquid surface.\n vec3 incident=cap==0?refract(d,-radial,1.0/1.46):d;\n ns=-r3SpecularNormalCorrection(-ng,-incident,-ns);\n fresnel=r3InterfaceFresnel(abs(dot(incident,ns)),1.336);\n air=refract(incident,-ns,1.336);\n vec3 reflected=reflect(incident,ns);\n bounce=cap==0?refract(reflected,radial,1.46):reflected;\n // A return blocked by TIR in the overlapping thin shell cannot be replaced by\n // an invented inward ray. Unresolved thin-shell multiple paths contribute zero.\n if(dot(bounce,bounce)<.001)bounce=vec3(0.0);\n if(cap==0&&dot(air,air)>.001)air=refract(air,-radial,1.46);\n}\nvec3 r3OutsideRadiance(vec3 p,vec3 d,float roughness){\n if(dot(d,d)<.01)return vec3(0.0);d=normalize(d);\n // Source lid and base are close occluders. Finite cap proxies retain world parallax;\n // the old centre probe must never be treated as infinitely distant exterior scenery.\n vec3 nearP;float nearT=r3LocalCapHit(p,d,nearP);\n if(nearT<1e4)return nearP.y<0.0?r3BaseRadiance(nearP,d)*vec3(.78,.80,.83):textureCubeUV(envMap,normalize(nearP-vec3(0.0,.30,0.0)),roughness).rgb;\n float a=max(dot(d.xz,d.xz),.000001),b=dot(p.xz,d.xz),c=dot(p.xz,p.xz)-400.0;\n float t=(-b+sqrt(max(0.0,b*b-a*c)))/a;\n float cap=d.y>.000001?(24.7-p.y)/d.y:(d.y<-.000001?(-2.3-p.y)/d.y:1e5);if(cap>0.0)t=min(t,cap);\n return textureCubeUV(r3RoomEnv,normalize(p+d*t-vec3(0.0,-.2,0.0)),roughness).rgb;\n}\n");
  s.fragmentShader=rep1(s.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`vec2 b3UV=gl_FragCoord.xy/b3Resolution;
vec3 b3I=normalize(vB3World-cameraPosition);vec3 b3N=normalize(inverseTransformDirection(normal,viewMatrix));
vec3 r3Radial=normalize(vec3(vB3World.x,0.0,vB3World.z));bool r3SideEntry=abs(r3Ng.y)<.5&&vB3World.y<.62449&&vB3World.y>-.83949;vec3 b3R=refract(b3I,b3N,1.0/1.336);if(r3SideEntry){vec3 ng=r3LiquidGeometricSideNormal(vB3World),throughGlass=refract(b3I,r3SpecularNormalCorrection(ng,-b3I,r3Radial),1.0/1.46);vec3 sourceN=r3LiquidSideNormal(vB3World);vec3 throughLiquid=refract(throughGlass,r3SpecularNormalCorrection(ng,-throughGlass,sourceN),1.0/1.336);vec3 throughInner=refract(throughLiquid,r3SpecularNormalCorrection(ng,-throughLiquid,r3Radial),1.46);if(dot(throughInner,throughInner)>.1)b3R=throughInner;}float b3A=max(dot(b3R.xz,b3R.xz),0.00001);float b3B=dot(vB3World.xz,b3R.xz);float b3C=dot(vB3World.xz,vB3World.xz)-0.50265*0.50265;
float b3Length=max(0.0,(-b3B+sqrt(max(0.0,b3B*b3B-b3A*b3C)))/b3A);
float b3Cap=b3R.y>0.00001?(0.6245-vB3World.y)/b3R.y:(b3R.y< -0.00001?(-0.840-vB3World.y)/b3R.y:100.0);b3Length=clamp(min(b3Length,max(0.0,b3Cap)),0.0,1.77);
float b3Z=texture2D(b3Depth,b3UV).r;vec4 b3Behind=b3InvProjection*vec4(b3UV*2.0-1.0,b3Z*2.0-1.0,1.0);b3Behind/=b3Behind.w;
float b3Travel=clamp((-b3Behind.z+ (b3View*vec4(vB3World,1.0)).z)/max(0.15,-(b3View*vec4(b3I,0.0)).z),0.0,b3Length);
vec4 r3BackgroundSample=texture2D(b3Background,b3UV);if(r3BackgroundSample.a<-.99)b3Travel=clamp(-r3BackgroundSample.a-1.0,0.0,b3Length);vec3 b3Back=r3BackgroundSample.rgb;vec3 b3Absorb=exp(-vec3(.06,.18,.11)*b3Travel);float b3Transmit=exp(-1.0*b3Travel);
// Four-point line integral of adopted source liquid single scattering.
// Point positions/energies/colours are source values. The local HDR lobe approximates
// emissive-surface and multiple-scatter illumination, without phantom ring point lights.
vec3 sigmaS=vec3(.887923121,.708375752,.814846575);
vec3 sigmaA=.1*(vec3(1.0)-vec3(1.0,.630757153,.775822222));
vec3 sigmaT=sigmaS+sigmaA;
vec3 r3Scatter=vec3(0.0);
for(int vi=0;vi<4;vi++){
 float path=b3Travel*(float(vi)+.5)/4.0;
 vec3 sampleP=vB3World+b3R*path,incident=vec3(0.0);
 for(int li=0;li<3;li++){
  vec3 lamp=li==0?vec3(.32,.33,.34):(li==1?vec3(-.26,-.23,-.30):vec3(0.0,.73,0.0));
  vec3 color=li==0?vec3(1.0,.760524511,.854992628):(li==1?vec3(1.0,.266355604,.479320168):vec3(1.0,.001517635,.391572475));
  float power=li==0?18.0:(li==1?6.0:26.0),radius=li==0?.12:(li==1?.12:.16);
  vec3 delta=lamp-sampleP;float dist2=dot(delta,delta),cosine=clamp(dot(delta/max(sqrt(dist2),.000001),b3R),-1.0,1.0);
  float phase=.2256/(12.566370614*pow(max(.0144,1.7744-1.76*cosine),1.5));
  vec4 visibility=r3VolumeLampVisibility(sampleP);float visible=li==0?visibility.x:(li==1?visibility.y:visibility.z);vec3 sourceExit;int sourceCap;float lampDistance=sqrt(dist2);float sourcePath=lampDistance<.000001?0.0:min(lampDistance,r3LiquidNext(sampleP,delta/max(lampDistance,.000001),sourceExit,sourceCap));incident+=color*(power/(12.566370614*max(dist2,radius*radius)))*phase*visible*exp(-sigmaT*sourcePath);
 }
 // Adopted vat-core DISK: 19 W, diameter .56 m, downward emission. Four
 // equal-area quadrature samples, source-side Beer plus source-geometry shadow.
 for(int ai=0;ai<4;ai++){
  vec3 lamp=vec3(ai==0?.1979899:(ai==2?-.1979899:0.0),-.716,ai==1?.1979899:(ai==3?-.1979899:0.0));
  vec3 delta=lamp-sampleP;float dist2=max(dot(delta,delta),.0001);vec3 wi=delta/sqrt(dist2);
  float cosine=clamp(dot(wi,b3R),-1.0,1.0),phase=.2256/(12.566370614*pow(max(.0144,1.7744-1.76*cosine),1.5));
  vec3 sourceExit;int sourceCap;float sourcePath=min(sqrt(dist2),r3LiquidNext(sampleP,wi,sourceExit,sourceCap));
  incident+=vec3(1.0,.001517635,.391572475)*(19.0/(3.141592654*4.0))*max(0.0,wi.y)/dist2*phase*exp(-sigmaT*sourcePath)*r3VolumeLampVisibility(sampleP).a;
 }
 vec3 indirect=textureCubeUV(envMap,b3R,.80).rgb;
 r3Scatter+=exp(-sigmaT*path)*sigmaS*(incident+indirect)*(b3Travel/4.0);
}
vec3 b3Radiance=vec3(0.0);
${query.has('review')&&query.get('vat-transport')==='before'?"float b3Fresnel=.0207+.9793*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);\nvec3 exitP=vB3World+b3R*b3Length;vec3 exitN=r3LiquidSideNormal(exitP);\nif(abs(exitP.y-.6245)<.002)exitN=r3LiquidCapNormal(exitP,true);else if(abs(exitP.y+.840)<.002)exitN=r3LiquidCapNormal(exitP,false);\nvec3 r3ExitNg=r3LiquidGeometricSideNormal(exitP);if(abs(exitP.y-.6245)<.002)r3ExitNg=vec3(0.0,1.0,0.0);else if(abs(exitP.y+.840)<.002)r3ExitNg=vec3(0.0,-1.0,0.0);exitN=-r3SpecularNormalCorrection(-r3ExitNg,-b3R,-exitN);float exitCos=abs(dot(b3R,exitN));float exitCritical=1.0-1.336*1.336*(1.0-exitCos*exitCos);float exitCt=sqrt(max(0.0,exitCritical));float rs=(1.336*exitCos-exitCt)/max(.00001,1.336*exitCos+exitCt),rp=(1.336*exitCt-exitCos)/max(.00001,1.336*exitCt+exitCos);float exitF=exitCritical<=0.0?1.0:clamp(.5*(rs*rs+rp*rp),0.0,1.0);\nvec3 bounce=reflect(b3R,exitN);float ba=max(dot(bounce.xz,bounce.xz),.00001),bb=dot(exitP.xz,bounce.xz),bc=dot(exitP.xz,exitP.xz)-.50265*.50265;float bl=max(.002,(-bb+sqrt(max(0.0,bb*bb-ba*bc)))/ba);\nfloat cap=bounce.y>0.0001?(.660-exitP.y)/bounce.y:(bounce.y< -.0001?(-.840-exitP.y)/bounce.y:10.0);if(cap>.001)bl=min(bl,cap);\nvec3 probeDirection=normalize(exitP+bounce*bl-vec3(0.0,.30,0.0));vec3 returnLight=textureCubeUV(envMap,probeDirection,.035).rgb;\nfloat rearVisibility=smoothstep(b3Length-.05,b3Length+.01,b3Travel);\nvec3 internalReflection=returnLight*exitF*rearVisibility*exp(-1.1*(b3Length+bl));\nvec3 airRay=refract(b3R,-exitN,1.336),farRadiance=vec3(0.0);\nif(exitCritical>0.0){\n float aa=max(dot(airRay.xz,airRay.xz),.000001),ab=dot(exitP.xz,airRay.xz),ac=dot(exitP.xz,exitP.xz)-400.0;\n float travel=(-ab+sqrt(max(0.0,ab*ab-aa*ac)))/aa;\n float yHit=airRay.y>.00001?(24.7-exitP.y)/airRay.y:(airRay.y<-.00001?(-2.3-exitP.y)/airRay.y:1000.0);if(yHit>0.0)travel=min(travel,yHit);\n vec3 farPoint=exitP+airRay*travel;farRadiance=textureCubeUV(r3RoomEnv,normalize(farPoint-vec3(0.0,-.2,0.0)),.05).rgb*(1.0-exitF);\n}\nb3Back=mix(b3Back,farRadiance,rearVisibility*r3VatComponents.w);\n":"float b3Fresnel=.0207+.9793*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);\nvec3 primaryCap;float primaryCapT=r3LocalCapHit(vB3World,b3R,primaryCap);\nvec3 exitP=vB3World+b3R*b3Length;int exitCap=abs(exitP.y-.6245)<.002?1:(abs(exitP.y+.840)<.002?-1:0);\nvec3 airRay,bounce;float exitF;r3LeaveLiquid(exitP,b3R,exitCap,airRay,bounce,exitF);\nfloat rearVisibility=smoothstep(b3Length-.05,b3Length+.01,b3Travel);\nvec3 farRadiance=r3OutsideRadiance(exitP,airRay,.0525)*(1.0-exitF);\n// Each return path must intersect and refract out of a second boundary. The previous\n// implementation sampled an interior panorama as if it lay on the liquid boundary.\nvec3 internalReflection=vec3(0.0),rayP=exitP,rayD=bounce,weight=vec3(exitF);\nfloat totalPath=b3Length;\nfor(int ri=0;ri<2;ri++){\n if(dot(rayD,rayD)<.001)break;\n vec3 nextP;int nextCap;float segment=r3LiquidNext(rayP+rayD*.0001,rayD,nextP,nextCap);\n vec3 opaqueP;float opaqueT=r3LocalCapHit(rayP,rayD,opaqueP);\n if(opaqueT<segment){vec3 capLight=opaqueP.y<0.0?r3BaseRadiance(opaqueP,rayD)*vec3(.78,.80,.83):textureCubeUV(envMap,normalize(opaqueP-vec3(0.0,.30,0.0)),.0525).rgb;internalReflection+=weight*exp(-sigmaT*(totalPath+opaqueT))*capLight;break;}\n vec3 nextAir,nextBounce;float nextF;r3LeaveLiquid(nextP,rayD,nextCap,nextAir,nextBounce,nextF);\n totalPath+=segment;\n internalReflection+=weight*(1.0-nextF)*exp(-sigmaT*totalPath)*r3OutsideRadiance(nextP,nextAir,.0525);\n weight*=nextF;rayP=nextP;rayD=nextBounce;\n}\ninternalReflection*=rearVisibility*(1.0-b3Fresnel);\nif(primaryCapT<b3Length){farRadiance=primaryCap.y<0.0?r3BaseRadiance(primaryCap,b3R)*vec3(.78,.80,.83):textureCubeUV(envMap,normalize(primaryCap-vec3(0.0,.30,0.0)),.0525).rgb;internalReflection=vec3(0.0);}\nb3Back=mix(b3Back,farRadiance,rearVisibility*r3VatComponents.w);\nvec3 frontIncoming=b3I,frontN=b3N;\nif(r3SideEntry){vec3 ng=r3LiquidGeometricSideNormal(vB3World);frontIncoming=refract(b3I,r3SpecularNormalCorrection(ng,-b3I,r3Radial),1.0/1.46);frontN=r3SpecularNormalCorrection(ng,-frontIncoming,r3LiquidSideNormal(vB3World));}\nvec3 frontReflection=reflect(frontIncoming,frontN);if(r3SideEntry)frontReflection=refract(frontReflection,-r3Radial,1.46);\nvec3 r3ExteriorSpecular=r3OutsideRadiance(vB3World,frontReflection,.0525)*b3Fresnel;\n"}b3Radiance=b3Back*exp(-sigmaT*b3Travel)+r3Scatter*r3VatComponents.z;
outgoingLight=b3Radiance*(1.0-b3Fresnel)+internalReflection*r3VatComponents.x+(reflectedLight.directSpecular+${query.has('review')&&query.get('vat-transport')==='before'?'reflectedLight.indirectSpecular':'r3ExteriorSpecular'})*r3VatComponents.y;
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`);
  };m.customProgramCacheKey=function(){return 'b3-cylindrical-medium-hdr-refraction';};
 }else if(role==='brain'||role==='brain_pons'){
  m=new T.MeshPhysicalMaterial({color:role==='brain'?0xffffff:linearHex('#d99bae'),vertexColors:role==='brain',metalness:0,roughness:.34,clearcoat:.38,clearcoatRoughness:.12,emissive:new T.Color(.386429429,.064803265,.144128472),emissiveIntensity:.10,envMap:b3Env,envMapIntensity:1});b3Irradiance(m,B3.brain.irradiance,true);
 }else if(role==='harness_gray'||role==='harness_silver'||role==='collar'||role==='fitting'){
  var p=role==='harness_gray'?{c:[.37,.47,.46],r:.38}:role==='harness_silver'?{c:[.60,.63,.69],r:.29}:B2.roles[role];
  m=new T.MeshStandardMaterial({color:new T.Color(...(p.c||p.color)),roughness:p.r||p.roughness,metalness:1,envMap:b3Env,envMapIntensity:.65});b2Polish(m);var prior=m.onBeforeCompile;m.onBeforeCompile=function(sh){prior(sh);sh.fragmentShader=rep1(sh.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nreflectedLight.directSpecular*=vec3(.20,.14,.18);reflectedLight.indirectSpecular*=vec3(.65,.48,.58);');};
 }else if(d.name==='tank-milk'){
  // Original white, smooth, fully transmitting interface. Volume is composed below;
  // no opaque Lambert milk tint or additional clearcoat is substituted for it.
  m=new T.MeshPhysicalMaterial({color:0xffffff,roughness:0,metalness:0,clearcoat:0,envMap:envMap,envMapIntensity:1,transparent:true,depthWrite:true});
  m.reflectivity=Math.sqrt(Math.pow((1.35-1)/(1.35+1),2)/.16);
  m.onBeforeCompile=function(sh){
   b3Common(sh);sh.uniforms.r3TankIncidentMap={value:R3.tankEnv||envMap};sh.uniforms.r3TankUseLocal={value:R3.tankEnv?1:0};
   sh.uniforms.b3Background={value:b3RT.texture};sh.uniforms.b3Depth={value:b3RT.depthTexture};
   sh.uniforms.b3Resolution={value:new T.Vector2(b3RT.width,b3RT.height)};
   sh.uniforms.b3InvProjection={value:camera.projectionMatrixInverse.clone()};sh.uniforms.b3Projection={value:camera.projectionMatrix.clone()};sh.uniforms.b3View={value:camera.matrixWorldInverse.clone()};sh.uniforms.b3Medium={value:new T.Vector3()};b3Shaders.push(sh);
   sh.fragmentShader=rep1(sh.fragmentShader,'#include <common>','#include <common>\nuniform float r3TankUseLocal;uniform sampler2D r3TankIncidentMap;uniform sampler2D b3Background;uniform sampler2D b3Depth;uniform vec2 b3Resolution;uniform mat4 b3InvProjection;uniform mat4 b3Projection;uniform mat4 b3View;uniform vec3 b3Medium;\n');
   sh.fragmentShader=rep1(sh.fragmentShader,'#include <lights_physical_pars_fragment>','#include <lights_physical_pars_fragment>\n'+R3_TANK_VOLUME);
   sh.fragmentShader=rep1(sh.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`
vec3 viewRay=normalize(vB3World-cameraPosition),surfaceN=normalize(inverseTransformDirection(normal,viewMatrix));
if(dot(surfaceN,viewRay)>0.0)surfaceN=-surfaceN;
vec3 milkRay=refract(viewRay,surfaceN,1.0/1.35);
if(dot(milkRay,milkRay)<.1)milkRay=viewRay;
vec3 start=vB3World+milkRay*.00001;
float path=r3TankExit(start,milkRay);
vec2 screenUV=gl_FragCoord.xy/b3Resolution;
// Existing opaque scene is the background. Limit local milk path if it is occluded.
float backgroundDepth=texture2D(b3Depth,screenUV).r;
vec4 viewBackground=b3InvProjection*vec4(screenUV*2.0-1.0,backgroundDepth*2.0-1.0,1.0);viewBackground/=viewBackground.w;
float visiblePath=max(0.0,(-viewBackground.z+(b3View*vec4(vB3World,1.0)).z)/max(.05,-(b3View*vec4(milkRay,0.0)).z));
path=min(path,visiblePath);
vec3 sigmaS=14.0*vec3(1.0,.791297913,.863157213);
vec3 sigmaA=.8*(vec3(1.0)-vec3(.686685324,.434153646,1.0)),sigmaT=sigmaS+sigmaA;
vec3 through=texture2D(b3Background,screenUV).rgb*exp(-sigmaT*path);
vec3 volume=r3TankVolume(start,milkRay,path,sigmaS,sigmaT);
float entryF=r3TankFresnel(max(0.0,dot(-viewRay,surfaceN)),1.0/1.35);
outgoingLight=(through+volume)*(1.0-entryF)+reflectedLight.directSpecular+reflectedLight.indirectSpecular;
gl_FragColor=vec4(outgoingLight,1.0);
`);
  };
  m.customProgramCacheKey=function(){return 'r3-tank-source-transport-trial-v4';}; }else if(role==='bubble'){
  m=new T.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.025,reflectivity:Math.sqrt(.0207/.16),envMap:b3Env,envMapIntensity:1,transparent:true,depthWrite:false});
  m.onBeforeCompile=function(s){s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\nfloat b3Eta=1.0/1.336;float b3F0=pow((1.0-b3Eta)/(1.0+b3Eta),2.0);float b3F=b3F0+(1.0-b3F0)*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);diffuseColor.a=clamp(b3F,0.015,0.65);reflectedLight.directDiffuse=vec3(0.0);reflectedLight.indirectDiffuse=vec3(0.0);reflectedLight.directSpecular/=max(diffuseColor.a,.015);reflectedLight.indirectSpecular/=max(diffuseColor.a,.015);');};m.customProgramCacheKey=function(){return 'b3-relative-air-interface';};
 }else if(role==='feed_column'||role==='crown_puff'){
  m=new T.MeshStandardMaterial({color:0,emissive:linearHex('#f2b4df'),emissiveIntensity:role==='feed_column'?.55:.9,roughness:1,transparent:true,depthWrite:false,opacity:.12});
  m.onBeforeCompile=function(s){s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\ndiffuseColor.a*=pow(abs(dot(normal,geometry.viewDir)),1.5);reflectedLight.directDiffuse=vec3(0.0);reflectedLight.indirectDiffuse=vec3(0.0);reflectedLight.directSpecular=vec3(0.0);reflectedLight.indirectSpecular=vec3(0.0);');};m.customProgramCacheKey=function(){return 'b3-feed-volume-proxy';};
 }else{
  m=new T.MeshPhysicalMaterial({color:linearHex('#f2dbe9'),roughness:.12,metalness:0,clearcoat:1,clearcoatRoughness:.06,emissive:linearHex('#f2dbe9'),emissiveIntensity:.6,envMap:b3Env,envMapIntensity:1,transparent:true,depthWrite:true});b3Irradiance(m,[1,1,1],false);
  var dropBefore=m.onBeforeCompile,dropRadius=d.name==='mesh178'?.032:d.name==='mesh179'?.014490574:.0000032;
  m.onBeforeCompile=function(sh){dropBefore(sh);sh.vertexShader=rep1(sh.vertexShader,'#include <common>','#include <common>\nattribute float r3DropRadius;varying float vR3DropRadius;');sh.vertexShader=rep1(sh.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\nvR3DropRadius=r3DropRadius;');sh.fragmentShader=rep1(sh.fragmentShader,'#include <common>','#include <common>\nvarying float vR3DropRadius;');sh.fragmentShader=rep1(sh.fragmentShader,'#include <emissivemap_fragment>',`#include <emissivemap_fragment>
float dropPath=2.0*vR3DropRadius*abs(dot(normal,normalize(vViewPosition)));float dropTransport=exp(-88.8*dropPath);float dropScatter=1.0-exp(-84.0*dropPath);diffuseColor.a=.10+.90*dropScatter;totalEmissiveRadiance=emissive*(1.8/.6)*(1.0-dropTransport)/88.8;
`);};
 }
 if(role==='brain'||role==='brain_pons'||role==='harness_gray'||role==='harness_silver'||role==='collar'||role==='fitting'||role==='bubble'||role==='feed_column'||role==='crown_puff'||/^mesh17[6789]$|^mesh18[01]$/.test(d.name))b3OpticalProjection(m);
 // A single tiny sphere is translated as a rigid projected image around its
 // source centre. It cannot acquire per-vertex folds from the nonlinear solver.
 if(d.name==='points108-bubble'){
  var r3BubbleBefore=m.onBeforeCompile,r3BubbleKey=m.customProgramCacheKey;
  m.onBeforeCompile=function(sh){r3BubbleBefore(sh);sh.vertexShader=rep1(sh.vertexShader,"vec3 b3ObjectWorld=(modelMatrix*b3Point).xyz;vec3 b3Exit=b3ObjectWorld;vB3OpticalVisibility=1.0;if(r3OpticalCapture<.5){b3Exit=b3OpticalExit(b3ObjectWorld,cameraPosition);vB3OpticalVisibility=b3OpticalVisibility;}r3OpticalTravel=length(b3ObjectWorld-b3Exit);vec4 b3Clip=projectionMatrix*viewMatrix*vec4(b3Exit,1.0);if(b3Clip.w>0.0)gl_Position.xy=b3Clip.xy/b3Clip.w*gl_Position.w;","// points108: Snell centre, rigid image translation of authored micro-sphere.\nvec4 r3BubbleOrigin=vec4(0.0,0.0,0.0,1.0);\n#ifdef USE_INSTANCING\nr3BubbleOrigin=instanceMatrix*r3BubbleOrigin;\n#endif\nvec3 r3BubbleCentre=(modelMatrix*r3BubbleOrigin).xyz;\nvB3OpticalVisibility=1.0;r3OpticalTravel=0.0;\nif(r3OpticalCapture<.5){\n vec3 r3BubbleExit=b3OpticalExit(r3BubbleCentre,cameraPosition);\n float r3BubbleValid=b3OpticalVisibility;\n vec4 r3BubbleSourceClip=projectionMatrix*viewMatrix*vec4(r3BubbleCentre,1.0);\n vec4 r3BubbleExitClip=projectionMatrix*viewMatrix*vec4(r3BubbleExit,1.0);\n vB3OpticalVisibility=0.0;\n if(r3BubbleValid>.5&&r3BubbleSourceClip.w>.00001&&r3BubbleExitClip.w>.00001){\n  vec2 r3BubbleShift=r3BubbleExitClip.xy/r3BubbleExitClip.w-r3BubbleSourceClip.xy/r3BubbleSourceClip.w;\n  gl_Position.xy+=r3BubbleShift*gl_Position.w;\n  r3OpticalTravel=length(r3BubbleCentre-r3BubbleExit);\n  vB3OpticalVisibility=1.0;\n }\n}");};
  m.customProgramCacheKey=function(){return r3BubbleKey.call(m)+'-r3-bubble-centre-rigid-v1';};
  m.userData.r3BubbleProjection={method:'source-centre Snell, rigid NDC translation',scope:'points108-bubble',sourceRadiusMetres:.0105,sourceInstances:54,failedCentre:'whole-instance optical visibility0',limitations:'Source projected shape/size retained; local lens magnification and anisotropy are approximated as identity.'};
 }
 var b3Cache=m.customProgramCacheKey;m.customProgramCacheKey=function(){return b3Cache.call(m)+'-role-'+role;};
 if(role==='glass'&&(d.name==='mesh97'||d.name==='mesh98')&&r3VatDiagnostic==='no-glass')m.envMapIntensity=0;
 r3TankDomeMaterial(m,d);
 if(d.name==='points197-bubble')m.envMap=R3.tankEnv;
 m.name='v10b3 '+d.name+' '+role;m.userData.b3={source:d.name,role:role,scope:'b3-change'};return m;
}
function b3InitPipeline(){
 if(mask)return;
 if(!renderer.capabilities.isWebGL2||!renderer.getContext().getExtension('EXT_color_buffer_float'))throw Error('s6b3 requires WebGL2 EXT_color_buffer_float for linear HDR refraction');
 function makeTarget(name){var rt=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,format:T.RGBAFormat,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,stencilBuffer:false});rt.texture.name=name;rt.texture.encoding=T.LinearEncoding;rt.texture.generateMipmaps=false;rt.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);return rt;}
 r3InitFloor();r3InitBase();b3RT=makeTarget('b3-linear-background');b3CompositeRT=makeTarget('b3-linear-medium');
 b3CopyScene=new T.Scene();b3CopyCamera=new T.Camera();
 var copyMaterial=new T.ShaderMaterial({uniforms:{image:{value:b3RT.texture},depth:{value:b3RT.depthTexture}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',fragmentShader:'uniform sampler2D image;uniform sampler2D depth;varying vec2 vUv;void main(){gl_FragColor=texture2D(image,vUv);gl_FragDepth=texture2D(depth,vUv).r;}',depthTest:true,depthWrite:true,depthFunc:T.AlwaysDepth,toneMapped:false});
 b3CopyScene.add(new T.Mesh(new T.PlaneBufferGeometry(2,2),copyMaterial));
 b3FinalScene=new T.Scene();
 var finalMaterial=new T.ShaderMaterial({uniforms:{image:{value:b3CompositeRT.texture},depth:{value:b3CompositeRT.depthTexture},r3DisplayLUT:{value:R3.displayLUT}},vertexShader:copyMaterial.vertexShader,fragmentShader:'uniform sampler2D image;uniform sampler2D depth;varying vec2 vUv;void main(){gl_FragColor=texture2D(image,vUv);gl_FragDepth=texture2D(depth,vUv).r;\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}',depthTest:true,depthWrite:true,depthFunc:T.AlwaysDepth,toneMapped:true});
 b3FinalScene.add(new T.Mesh(b3CopyScene.children[0].geometry,finalMaterial));
 var raw=renderer.render.bind(renderer);renderer.info.autoReset=false;
 renderer.render=function(s,c){
  if(b3Rendering||s!==scene||c!==camera)return raw(s,c);
  b3Rendering=true;var previous=renderer.getRenderTarget(),tone=renderer.toneMapping,encoding=renderer.outputEncoding,clear=renderer.autoClear,size=renderer.getDrawingBufferSize(new T.Vector2()),meshes=[],visibility=[];
  scene.traverse(function(o){if(o.isMesh){meshes.push(o);visibility.push(o.visible);}});
  function restore(){meshes.forEach(function(o,i){o.visible=visibility[i];});}
  function uniforms(){b3Shaders.forEach(function(sh){var u=sh.uniforms;u.b3Resolution.value.copy(size);if(u.b3InvProjection){u.b3InvProjection.value.copy(c.projectionMatrixInverse);u.b3Projection.value.copy(c.projectionMatrix);u.b3View.value.copy(c.matrixWorldInverse);u.b3Medium.value.fromArray(B3.medium.radiance);}});}
  try{
   renderer.info.reset();if(b3RT.width!==size.x||b3RT.height!==size.y){b3RT.setSize(size.x,size.y);b3CompositeRT.setSize(size.x,size.y);}
   r3RenderBase(raw,s,c,meshes,visibility,size);var basePass={name:"local-vat-base",calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};r3RenderFloor(raw,s,c,meshes,visibility,size);var floorPass={name:'local-planar-floor',calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
   b3Surfaces.forEach(function(o){o.visible=false;});renderer.setRenderTarget(b3RT);renderer.toneMapping=T.NoToneMapping;renderer.outputEncoding=T.LinearEncoding;raw(s,c);
   var first={name:'linear-background',calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
   uniforms();renderer.setRenderTarget(b3CompositeRT);raw(b3CopyScene,b3CopyCamera);
   meshes.forEach(function(o,i){o.visible=!!(visibility[i]&&o.material.userData.b3&&(o.material.userData.b3.source==='culture-liquid'||o.material.userData.b3.source==='tank-milk'));});renderer.autoClear=false;raw(s,c);renderer.autoClear=clear;
   var second={name:'copy-and-linear-medium',calls:renderer.info.render.calls-first.calls,triangles:renderer.info.render.triangles-first.triangles};
   restore();renderer.setRenderTarget(previous);renderer.toneMapping=tone;renderer.outputEncoding=encoding;uniforms();raw(b3FinalScene,b3CopyCamera);
   meshes.forEach(function(o,i){o.visible=visibility[i]&&o.userData.role==='glass';});renderer.autoClear=false;raw(s,c);renderer.autoClear=clear;
   B3.passes=[basePass,{name:floorPass.name,calls:floorPass.calls-basePass.calls,triangles:floorPass.triangles-basePass.triangles},{name:first.name,calls:first.calls-floorPass.calls,triangles:first.triangles-floorPass.triangles},second,{name:'final-AgX-sRGB',calls:renderer.info.render.calls-first.calls-second.calls,triangles:renderer.info.render.triangles-first.triangles-second.triangles}];
  }finally{restore();renderer.setRenderTarget(previous);renderer.toneMapping=tone;renderer.outputEncoding=encoding;renderer.autoClear=clear;b3Rendering=false;}
  if(!previous&&window.LactoCortexUI)window.LactoCortexUI.afterRender(performance.now());
 };
}

function material(role,building){
  var r=doc.roles[role]||{color:'#808080'},m;
  if(mask){m=new T.MeshBasicMaterial({color:building?0x000000:0xffffff});m.toneMapped=false;return m;}
  if(r.emissive){m=new T.MeshStandardMaterial({color:0x050505,emissive:new T.Color(r.emissive),emissiveIntensity:1,roughness:.9,metalness:0});}
  // b1: コーブ・ドーム帯・天井のディフューザは 1 枚の面。Blender の発光は両面から見えるので両面にする
  if(role==='cove_diffuser'||role==='ceiling_light')m.side=T.DoubleSide;
  else{m=new T.MeshStandardMaterial({color:new T.Color(PROVISIONAL[role]||r.color),roughness:METAL[role]?.42:.62,metalness:METAL[role]?.35:0});}
  if(r.transparent){m.transparent=true;m.opacity=role==='glass'?.25:r.opacity;m.depthWrite=false;}
  if(role==='brain')m.vertexColors=true;
  m.onBeforeCompile=function(s){
    if(!BEGIN_NO_POINTS)BEGIN_NO_POINTS=rep1(T.ShaderChunk.lights_fragment_begin,'#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )','#if 0 /* v10b1: 発光体の鏡面用の点光源は仮材質に効かせない */');
    s.fragmentShader=rep1(s.fragmentShader,'#include <lights_fragment_begin>',BEGIN_NO_POINTS);
  };
  m.customProgramCacheKey=function(){return 'v10b1-provisional';};
  m.name='v10a '+role;
  return m;
}
// 焼いた面: 拡散はライトマップだけ（直接光・環境光・環境マップの拡散は捨てる）。鏡面は環境マップ＋焼いた光の映り込み
// （ライトマップの放射照度 E を一様な周囲の輝度 E/π とみなして、環境の鏡面 BRDF（Fresnel・粗さ込み）に通す。倍率 lmSpec）
var MAPS_SPECULAR_ONLY=null,BEGIN_POINTS_ONLY=null,BEGIN_NO_POINTS=null;
function bakedShader(m,floorLm){
  m.onBeforeCompile=function(s){
    if(!MAPS_SPECULAR_ONLY)MAPS_SPECULAR_ONLY=rep1(T.ShaderChunk.lights_fragment_maps,'iblIrradiance += getLightProbeIndirectIrradiance( geometry, maxMipLevel );','');
    s.vertexShader=rep1(s.vertexShader,'#include <common>','#include <common>\nattribute float r3LmGain;varying float vR3LmGain;');s.vertexShader=rep1(s.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\nvR3LmGain=r3LmGain;');s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nvarying float vR3LmGain;');
    s.uniforms.b1LmSpec=m.userData.b1LmSpec;
    s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform float b1LmSpec;');
    s.fragmentShader=rep1(s.fragmentShader,'#include <lights_fragment_maps>','irradiance = vec3( 0.0 );\n'+rep1(MAPS_SPECULAR_ONLY,'* lightMapIntensity;','* lightMapIntensity * vR3LmGain;')+'\n\tradiance += b1LmSpec * lightMapIrradiance * RECIPROCAL_PI;');
    if(!BEGIN_POINTS_ONLY)BEGIN_POINTS_ONLY=rep1(T.ShaderChunk.lights_fragment_begin,'#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )','#if 0 /* v10b1: s6a の平行光は焼いた面に効かせない */');
    s.fragmentShader=rep1(s.fragmentShader,'#include <lights_fragment_begin>',BEGIN_POINTS_ONLY);
    s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\n\treflectedLight.directDiffuse = vec3( 0.0 );');
    if(floorLm){
      // トレッド（インスタンス）: 床のライトマップを世界座標で引く。u = (x + 10.4) / 41.6, v = (10.4 - z) / 41.6
      s.vertexShader=rep1(s.vertexShader,'#include <uv2_vertex>','#include <uv2_vertex>\n\tvec4 b1LmWorld = modelMatrix * instanceMatrix * vec4( position, 1.0 );\n\tvUv2 = vec2( ( b1LmWorld.x + 10.4 ) / 41.6, ( 10.4 - b1LmWorld.z ) / 41.6 );');
      // 箱の上面の突起の輪郭（法線マップの A）
      s.fragmentShader=rep1(s.fragmentShader,'#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n\tif ( texture2D( normalMap, vUv ).a < 0.5 ) discard;');
    }
  };
  m.customProgramCacheKey=function(){return floorLm?'v10b1-baked-tread':'v10b1-baked';};
}
function bakedMaterial(role,atlas,cls,floorLm,scope){
  var p=(scope==='b2'?B2.roles[role]:B1.roles[role])||{color:[.2,.2,.2],metalness:0,roughness:.6,lm:1,env:1};
  var m=new T.MeshStandardMaterial({color:new T.Color(p.color[0],p.color[1],p.color[2]),roughness:p.roughness,metalness:p.metalness});
  m.lightMap=tex[atlas];m.envMap=envMap;
  if(floorLm){m.normalMap=tex.treadN;}
  m.name='v10b1 '+role+' '+atlas+':'+cls;m.userData.b1={role:role,atlas:atlas,cls:cls,floorLm:floorLm,scope:scope||'b1'};m.userData.b1LmSpec={value:0};
  bakedShader(m,floorLm);baked.push(m);applyMaterial(m);
  return m;
}
function applyMaterial(m){
  var b=m.userData.b1,p=(b.scope==='b2'?B2.roles[b.role]:B1.roles[b.role])||{color:[.2,.2,.2],metalness:0,roughness:.6,lm:1,env:1};
  m.color.setRGB(p.color[0],p.color[1],p.color[2]);m.metalness=p.metalness;m.roughness=p.roughness;
  m.lightMapIntensity=Math.PI*(p.lm==null?1:p.lm)*B1.lm;
  m.envMapIntensity=doc.b1.env.intensity*(p.env==null?1:p.env)*B1.env;
  m.userData.b1LmSpec.value=(p.lmSpec==null?1:p.lmSpec)*B1.lmSpec;
  if(b.floorLm){var ns=p.normalScale==null?1:p.normalScale;m.normalScale.set(ns,ns);}
}
function applyTune(){for(var i=0;i<baked.length;i++)applyMaterial(baked[i]);applyRing();renderer.toneMappingExposure=B1.exposure;needsRender=true;}
function geometry(d){
  var g=new T.BufferGeometry(),n=d.vertices;
  g.setAttribute('position',new T.BufferAttribute(view(d.position,n*3),3));
  g.setAttribute('normal',new T.BufferAttribute(view(d.normal,n*3),3,true));
  if(d.uv){var uv=new Float32Array(n*2);uvFloat(d.uv,n,uv,0);g.setAttribute('uv',new T.BufferAttribute(uv,2));}
  g.setIndex(new T.BufferAttribute(view(d.index,d.index.count),1));
  return g;
}
// 同じ役割（と同じライトマップの段）のメッシュを 1 つにまとめる。頂点色は落とさない（色の無いメッシュは白で埋める）
function merge(list,withUv2){
  var nv=0,ni=0,hasColor=false,hasUv=false,i,k;
  for(i=0;i<list.length;i++){nv+=list[i].vertices;ni+=list[i].index.count;if(list[i].color)hasColor=true;if(list[i].uv)hasUv=true;}
  var pos=new Float32Array(nv*3),nor=new Int8Array(nv*3),col=hasColor?new Uint8Array(nv*3):null,uv2=withUv2?new Float32Array(nv*2):null,uv=hasUv?new Float32Array(nv*2):null,idx=nv>65535?new Uint32Array(ni):new Uint16Array(ni),vo=0,io=0;
  for(i=0;i<list.length;i++){
    var d=list[i];
    pos.set(view(d.position,d.vertices*3),vo*3);nor.set(view(d.normal,d.vertices*3),vo*3);
    if(col){if(d.color)col.set(view(d.color,d.vertices*3),vo*3);else col.fill(255,vo*3,(vo+d.vertices)*3);}
    if(uv2)uvFloat(d.uv2,d.vertices,uv2,vo);
    if(uv&&d.uv)uvFloat(d.uv,d.vertices,uv,vo);
    var src=view(d.index,d.index.count);for(k=0;k<src.length;k++)idx[io+k]=src[k]+vo;
    vo+=d.vertices;io+=d.index.count;
  }
  var g=new T.BufferGeometry();
  g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('normal',new T.BufferAttribute(nor,3,true));
  if(col)g.setAttribute('color',new T.BufferAttribute(col,3,true));
  if(uv2)g.setAttribute('uv2',new T.BufferAttribute(uv2,2));
  if(uv)g.setAttribute('uv',new T.BufferAttribute(uv,2));
  if(withUv2){var gain=new Float32Array(nv),at=0;list.forEach(function(d){var k=doc.b1.lightmaps[d.lightmap].class_intensity[d.lightmapClass];if(!isFinite(k))throw Error('LM exposure missing: '+d.name);gain.fill(k,at,at+d.vertices);at+=d.vertices;});g.setAttribute('r3LmGain',new T.BufferAttribute(gain,1));}
  g.setIndex(new T.BufferAttribute(idx,1));g.computeBoundingSphere();
  return g;
}
function lit(d){return !!(d.lightmap&&!cUnbakedNames[d.name]&&!(doc.roles[d.role]||{}).emissive);}
// r3: source roles stay explicit; linked housing lights are view dependent LTC.
var r3VatDiagnostic=query.has('review')?(query.get('vat-diag')||'all'):'all';
var R3={housingIntensity:[8.21,5.95],areaLights:[],displayLUT:null,frameTimes:[],loadStart:performance.now()};
var R3_ROLE={
 housing_panels:{color:[.068478170,.262250658,.198069320],metalness:1,roughness:.33,lm:1,env:1},
 housing_shells:{color:[.068478170,.262250658,.198069320],metalness:1,roughness:.38,lm:1,env:1},
 room_floor:{color:[.02,.0204,.0216],metalness:.0,roughness:.30,lm:1,env:1},
 room_shell:{color:[.008,.008,.009],metalness:0,roughness:.9,lm:1,env:1},
 room_wedge:{color:[.0672,.07,.0749],metalness:0,roughness:.96,lm:1,env:1},
 room_hardware:{color:[.42,.44,.47],metalness:1,roughness:.36,lm:1,env:1},
 room_ring_body:{color:[.03,.032,.036],metalness:0,roughness:.5,lm:1,env:1},
 room_logo:{color:[.004,.004,.005],metalness:0,roughness:.42,lm:1,env:1}
};
B2.tag=[1,1,1];
B2.led={led_turquoise:70,led_pink:90,led_magenta:200};
Object.keys(R3_ROLE).forEach(function(k){B1.roles[k]=R3_ROLE[k];B2.roles[k]=R3_ROLE[k];});
function r3WrapMaterial(m,housing){
 var before=m.onBeforeCompile,cache=m.customProgramCacheKey,sourceCacheKey=cache.call(m);
 m.onBeforeCompile=function(s){
  if(before)before(s);
  if(!housing){
   var token='#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )';
   if(s.fragmentShader.indexOf('#include <lights_fragment_begin>')>=0)s.fragmentShader=rep1(s.fragmentShader,'#include <lights_fragment_begin>',T.ShaderChunk.lights_fragment_begin);
   if(s.fragmentShader.indexOf(token)>=0)s.fragmentShader=rep1(s.fragmentShader,token,'#if 0 /* r3 housing receiver link: other parts excluded */');
  }
  s.uniforms.r3DisplayLUT={value:R3.displayLUT};
 };
 m.customProgramCacheKey=function(){return sourceCacheKey+'-r3-link-'+(housing?'housing':'other')+'-'+m.userData.r3.role;};
 return m;
}
function r3Material(d,lm,building){
 var m,housing=d.role==='housing_panels'||d.role==='housing_shells';
 if(mask)return material(d.role,building);
 if(R3_ROLE[d.role]){
  m=lm?bakedMaterial(d.role,d.lightmap,d.lightmapClass,false):b2Metal(d.role);
  if(housing){
   var prior=m.onBeforeCompile;
   m.onBeforeCompile=function(s){prior(s);b3Common(s);
    s.fragmentShader=rep1(s.fragmentShader,'#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nfloat brushed=.45*sin(vB3World.y*16.0+sin(vB3World.x*19.0))+.35*sin(vB3World.z*29.0+sin(vB3World.y*17.0))+.2*sin(vB3World.y*830.0);roughnessFactor=clamp(roughnessFactor+.022*brushed,'+(d.role==='housing_panels'?'.28,.38':'.33,.43')+');');
   };
   m.emissive.setRGB(0,0,0);m.emissiveIntensity=0;
  }
  if(d.name==='n08-frame_building'){m.envMap=R3.logoEnv;m.envMapIntensity=1;}
  if(d.role==='room_shell')m.side=T.DoubleSide;
  if(d.role==='room_floor')r3FloorMaterial(m);
  if(d.role==='room_logo'){
   m.emissive.setRGB(1,1,1);m.emissiveIntensity=.22;m.emissiveMap=tex.logo;
  }
 }else if(d.role==='room_ring_emission'){
  m=new T.MeshStandardMaterial({color:0,emissive:new T.Color(.806952,.854993,.887923),emissiveIntensity:2.72,roughness:1,side:T.DoubleSide});
 }else if(b2Scope(d)==='b3-defer')m=b3Material(d);
 else if(b2Scope(d)==='b2-change')m=b2Material(d,lm);
 else m=lm?bakedMaterial(d.role,d.lightmap,d.lightmapClass,false):b2Metal(d.role);
 m.userData.r3={source:d.name,role:d.role,housingReceiver:housing};
 r3LedRevision(m,d);
 if(d.name==='mesh101')r3BaseMaterial(m);
 return r3WrapMaterial(m,housing);
}
function r3HDR(data,width,height,name,pm){
 if(data.byteLength!==width*height*8)throw Error(name+': HDR size mismatch');
 var t=new T.DataTexture(new Uint16Array(data),width,height,T.RGBAFormat,T.HalfFloatType);
 t.name=name;t.encoding=T.LinearEncoding;t.flipY=false;t.minFilter=t.magFilter=T.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;
 var rt=pm.fromEquirectangular(t);t.dispose();return rt.texture;
}
function r3Fail(e){
 ready=false;console.error(e);document.documentElement.dataset.error=String(e&&e.message||e);
 var s=document.getElementById('viewer-error');if(s){s.hidden=false;s.textContent='表示できませんでした：'+String(e&&e.message||e)+'。ページを再読み込みしてください。';s.setAttribute('role','alert');}
}

function r3DisplayTransform(data){
 if(!data.image||data.image.width!==512||data.image.height!==512)throw Error('AgX LUT size mismatch');
 var t=data;t.name='AgX High Contrast encoded-sRGB numeric table';t.type=T.UnsignedByteType;t.format=T.RGBAFormat;
 t.encoding=T.LinearEncoding;t.flipY=false;t.minFilter=t.magFilter=T.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;R3.displayLUT=t;
 T.ShaderChunk.tonemapping_pars_fragment=rep1(T.ShaderChunk.tonemapping_pars_fragment,'vec3 CustomToneMapping( vec3 color ) { return color; }',`uniform sampler2D r3DisplayLUT;
vec3 r3LutSlice(vec2 rg,float b){vec2 tile=vec2(mod(b,8.0),floor(b/8.0));return texture2D(r3DisplayLUT,(tile*64.0+rg+.5)/512.0).rgb;}
vec3 CustomToneMapping(vec3 color){
 vec3 p=clamp(log2(vec3(1.0)+1024.0*max(color*toneMappingExposure,vec3(0.0)))/19.0,0.0,1.0)*63.0;
 float b=floor(p.b);vec3 display=mix(r3LutSlice(p.rg,b),r3LutSlice(p.rg,min(63.0,b+1.0)),p.b-b);
 return mix(display/12.92,pow((display+.055)/1.055,vec3(2.4)),step(vec3(.04045),display));
}`);
 renderer.toneMapping=T.CustomToneMapping;
}

// One bounded local planar reflection pass. No added floor geometry.
var r3FloorRT=null,r3FloorCamera=null,r3FloorMatrix=new T.Matrix4(),r3FloorShaders=[];
function r3InitFloor(){
 r3FloorRT=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,format:T.RGBAFormat,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,stencilBuffer:false});
 r3FloorRT.texture.encoding=T.LinearEncoding;r3FloorRT.texture.generateMipmaps=false;r3FloorCamera=new T.PerspectiveCamera();
}
function r3FloorMaterial(m){
 var before=m.onBeforeCompile,cache=m.customProgramCacheKey;
 m.envMapIntensity=0;
 m.onBeforeCompile=function(s){before(s);b3Common(s);
  s.uniforms.r3FloorImage={value:r3FloorRT.texture};s.uniforms.r3FloorMatrix={value:r3FloorMatrix};s.uniforms.r3FloorTexel={value:new T.Vector2(1/r3FloorRT.width,1/r3FloorRT.height)};
  r3FloorShaders.push(s);
  s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform sampler2D r3FloorImage;uniform mat4 r3FloorMatrix;uniform vec2 r3FloorTexel;');
  s.fragmentShader=rep1(s.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`vec4 projected=r3FloorMatrix*vec4(vB3World,1.0);vec2 floorUv=projected.xy/projected.w;
vec3 localReflection=vec3(0.0);
if(projected.w>0.0&&all(greaterThanEqual(floorUv,vec2(0.0)))&&all(lessThanEqual(floorUv,vec2(1.0)))){
 vec2 blur=r3FloorTexel*(1.0+2.0*clamp(length(vB3World.xz)/12.0,0.0,1.0));
 localReflection=texture2D(r3FloorImage,floorUv).rgb*.40;
 localReflection+=(texture2D(r3FloorImage,floorUv+vec2(blur.x,0.0)).rgb+texture2D(r3FloorImage,floorUv-vec2(blur.x,0.0)).rgb+texture2D(r3FloorImage,floorUv+vec2(0.0,blur.y)).rgb+texture2D(r3FloorImage,floorUv-vec2(0.0,blur.y)).rgb)*.15;
}
float floorF=.07+.93*pow(1.0-abs(dot(normal,geometry.viewDir)),5.0);
outgoingLight=reflectedLight.indirectDiffuse+localReflection*floorF;
gl_FragColor=vec4(outgoingLight,diffuseColor.a);`);
 };
 m.customProgramCacheKey=function(){return cache.call(m)+'-r3-floor-planar';};
}
function r3RenderFloor(raw,s,c,meshes,visibility,size){
 var scale=Math.min(1,768/Math.max(size.x,size.y)),w=Math.max(1,Math.round(size.x*scale)),h=Math.max(1,Math.round(size.y*scale));
 if(r3FloorRT.width!==w||r3FloorRT.height!==h)r3FloorRT.setSize(w,h);
 c.updateMatrixWorld();var eye=c.position.clone(),look=new T.Vector3(0,0,-1).applyQuaternion(c.quaternion).add(eye),up=new T.Vector3(0,1,0).applyQuaternion(c.quaternion);
 eye.y=2*FLOOR_Y-eye.y;look.y=2*FLOOR_Y-look.y;up.y=-up.y;
 r3FloorCamera.position.copy(eye);r3FloorCamera.up.copy(up);r3FloorCamera.lookAt(look);r3FloorCamera.near=c.near;r3FloorCamera.far=c.far;r3FloorCamera.projectionMatrix.copy(c.projectionMatrix);r3FloorCamera.projectionMatrixInverse.copy(c.projectionMatrixInverse);r3FloorCamera.updateMatrixWorld();
 r3FloorMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(r3FloorCamera.projectionMatrix).multiply(r3FloorCamera.matrixWorldInverse);
 r3FloorShaders.forEach(function(sh){sh.uniforms.r3FloorTexel.value.set(1/w,1/h);});
 meshes.forEach(function(o,i){o.visible=visibility[i]&&o.userData.role!=='room_floor'&&b3Surfaces.indexOf(o)<0;});
 renderer.setRenderTarget(r3FloorRT);renderer.toneMapping=T.NoToneMapping;renderer.outputEncoding=T.LinearEncoding;raw(s,r3FloorCamera);
 meshes.forEach(function(o,i){o.visible=visibility[i];});
}

// Generated from actual unchanged source LED geometry by prepare_r3_led_revision.py.
var R3_LED_SOURCE=[[0.5199999809265137,-1.090000033378601,0.0,0.032000064849853516,0.0,0.08007954941589326,0.0639679891497723],[0.5199999809265137,-1.3100000023841858,0.0,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702],[0.5199999809265137,-1.3539999723434448,0.0,0.017549945661181253,0.03312018453068388,5.0264349767593596e-05,0.01296895264348922],[0.5199999809265137,-1.3980000615119934,0.0,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702],[0.36769554018974304,-1.090000033378601,0.36769554018974304,0.032000064849853516,0.0,0.08007953768025045,0.06396797977527559],[0.36769552528858185,-1.3100000023841858,0.36769552528858185,0.017549937002257144,0.0,0.018625870815527187,0.014878449128688985],[0.36769552528858185,-1.3539999723434448,0.36769552528858185,0.017549957380016093,0.03312016267915765,5.026431660495356e-05,0.012968944087033002],[0.36769552528858185,-1.3980000615119934,0.36769552528858185,0.017549937002257144,0.0,0.018625870815527187,0.014878449128688985],[0.0,-1.090000033378601,0.5199999809265137,0.032000064849853516,0.0,0.08007954941589328,0.06396798914977231],[0.0,-1.3100000023841858,0.5199999809265137,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702],[0.0,-1.3539999723434448,0.5199999809265137,0.017549945661181253,0.03312018453068388,5.0264349767593596e-05,0.01296895264348922],[0.0,-1.3980000615119934,0.5199999809265137,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702],[-0.36769554018974304,-1.090000033378601,0.36769554018974304,0.032000064849853516,0.0,0.08007953768025045,0.06396797977527559],[-0.36769552528858185,-1.3100000023841858,0.36769552528858185,0.017549937002257144,0.0,0.018625870815527187,0.014878449128688985],[-0.36769552528858185,-1.3539999723434448,0.36769552528858185,0.017549957380016093,0.03312016267915765,5.026431660495356e-05,0.012968944087033002],[-0.36769552528858185,-1.3980000615119934,0.36769552528858185,0.017549937002257144,0.0,0.018625870815527187,0.014878449128688985],[-0.5199999809265137,-1.090000033378601,0.0,0.032000064849853516,0.0,0.08007954941589326,0.0639679891497723],[-0.5199999809265137,-1.3100000023841858,0.0,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702],[-0.5199999809265137,-1.3539999723434448,0.0,0.017549945661181253,0.03312018453068388,5.0264349767593596e-05,0.01296895264348922],[-0.5199999809265137,-1.3980000615119934,0.0,0.0175499252834087,0.0,0.018625883104295863,0.014878458945025702]];

var R3_LED_GLSL="// Source-derived bay LED local reflection. No screen-space bloom or diffuse fill.\n// The point/sphere proxy is deliberately bounded to immediate machine neighbours.\nif(vB3World.y>-1.53 && vB3World.y<-.95){\n for(int r3Li=0;r3Li<20;r3Li++){\n  vec3 ledDelta=r3LedPositionRadius[r3Li].xyz-vB3World;\n  float ledD2=dot(ledDelta,ledDelta);\n  float ledNear=1.0-smoothstep(.06,.12,sqrt(max(ledD2,0.0)));\n  if(ledNear>0.0 && ledD2>1e-12){\n   IncidentLight ledLight;\n   ledLight.direction=(viewMatrix*vec4(ledDelta*inversesqrt(ledD2),0.0)).xyz;\n   float ledR=r3LedPositionRadius[r3Li].w;\n   ledLight.color=r3LedIntensity[r3Li]*r3LedGain*ledNear/max(ledD2,ledR*ledR);\n   ledLight.visible=true;\n   float ledNdotL=saturate(dot(geometry.normal,ledLight.direction));\n   reflectedLight.directSpecular+=ledNdotL*ledLight.color*BRDF_Specular_GGX(ledLight,geometry.viewDir,geometry.normal,material.specularColor,material.specularRoughness);\n  }\n }\n}\n";
// Insert after r3-materials.fragment.js, inside its IIFE, with data + shader constant.
// Call r3LedRevision(m,d) immediately before r3WrapMaterial(m,housing).
// Source emission, geometry, LUT, housing colour, existing linked lights are unchanged.
var R3_LED={gain:1,positions:R3_LED_SOURCE.map(function(v){return new T.Vector4(v[0],v[1],v[2],v[3]);}),intensity:R3_LED_SOURCE.map(function(v){return new T.Vector3(v[4],v[5],v[6]);})};
function r3LedRevision(m,d){
 if(!/^(housing_panels|housing_shells|chrome|turquoise)$/.test(d.role))return m;
 var before=m.onBeforeCompile,sourceKey=m.customProgramCacheKey();
 m.onBeforeCompile=function(s){
  if(before)before(s);
  if(s.vertexShader.indexOf('varying vec3 vB3World;')<0)b3Common(s);
  s.uniforms.r3LedPositionRadius={value:R3_LED.positions};
  s.uniforms.r3LedIntensity={value:R3_LED.intensity};
  s.uniforms.r3LedGain={value:R3_LED.gain};
  s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\nuniform vec4 r3LedPositionRadius[20];\nuniform vec3 r3LedIntensity[20];\nuniform float r3LedGain;');
  // aomap happens after all bakedShader diffuse resets, before outgoingLight assembly.
  s.fragmentShader=rep1(s.fragmentShader,'#include <aomap_fragment>','#include <aomap_fragment>\n'+R3_LED_GLSL);
 };
 m.customProgramCacheKey=function(){return sourceKey+'-r3-local-led-v1-'+d.role;};
 m.userData.r3LocalLED={sourceCount:20,gain:R3_LED.gain,component:'directSpecular',distanceLimitMetres:.12};
 return m;
}

var R3_BASE_GLSL="uniform sampler2D r3BaseImage;\nuniform sampler2D r3BaseDepth;\nuniform mat4 r3BaseMatrix;\nuniform mat4 r3BaseInverse;\nvec3 r3BaseRadiance(vec3 p,vec3 incoming){\n vec4 q=r3BaseMatrix*vec4(p,1.0);vec2 uv=q.xy/q.w;\n if(q.w<=0.0||any(lessThan(uv,vec2(0.0)))||any(greaterThan(uv,vec2(1.0))))return vec3(0.0);\n float depth=texture2D(r3BaseDepth,uv).r;vec4 hit=r3BaseInverse*vec4(uv*2.0-1.0,depth*2.0-1.0,1.0);\n float travel=depth<.99999?min(2.0,length(hit.xyz/hit.w-p)):1.4;\n vec3 reflected=texture2D(r3BaseImage,uv).rgb*exp(-vec3(.887923121,.745300052,.837264353)*travel);\n // Analytic disk-specular trial is retained in diagnostics only: it produced\n // a closed white patch absent from the adopted reference. Full rough thin-layer\n // transport of this near emitter remains unresolved; no fake replacement fill.\n return reflected;\n}\n";
// Live reflection of source vat interiors in the original flat lower chrome cap.
var r3BaseRT=null,r3BaseCamera=null,r3BaseMatrix=new T.Matrix4(),r3BaseInverse=new T.Matrix4(),r3OpticalCapture={value:0};
function r3InitBase(){
 r3BaseRT=new T.WebGLRenderTarget(768,768,{type:T.HalfFloatType,format:T.RGBAFormat,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,stencilBuffer:false});
 r3BaseRT.texture.name='source-vat-base-reflection';r3BaseRT.texture.encoding=T.LinearEncoding;r3BaseRT.texture.generateMipmaps=false;r3BaseRT.depthTexture=new T.DepthTexture(768,768,T.UnsignedIntType);r3BaseCamera=new T.PerspectiveCamera();
}
function r3BaseUniforms(s){
 s.uniforms.r3BaseImage={value:r3BaseRT.texture};s.uniforms.r3BaseDepth={value:r3BaseRT.depthTexture};s.uniforms.r3BaseMatrix={value:r3BaseMatrix};s.uniforms.r3BaseInverse={value:r3BaseInverse};
}
function r3BaseMaterial(m){
 var before=m.onBeforeCompile,cache=m.customProgramCacheKey;m.onBeforeCompile=function(s){before(s);if(s.vertexShader.indexOf('varying vec3 vB3World;')<0)b3Common(s);r3BaseUniforms(s);
 s.fragmentShader=rep1(s.fragmentShader,'#include <common>','#include <common>\n'+R3_BASE_GLSL);
 s.fragmentShader=rep1(s.fragmentShader,'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`if(abs(vB3World.y+.806)<.0001){outgoingLight=reflectedLight.directSpecular+r3BaseRadiance(vB3World,normalize(vB3World-cameraPosition))*material.specularColor;}gl_FragColor=vec4(outgoingLight,diffuseColor.a);`);
 };m.customProgramCacheKey=function(){return cache.call(m)+'-r3-live-vat-base';};
}
function r3RenderBase(raw,s,c,meshes,visibility,size){
 var scale=Math.min(1,768/Math.max(size.x,size.y)),w=Math.max(1,Math.round(size.x*scale)),h=Math.max(1,Math.round(size.y*scale));if(r3BaseRT.width!==w||r3BaseRT.height!==h)r3BaseRT.setSize(w,h);
 c.updateMatrixWorld();var eye=c.position.clone(),look=new T.Vector3(0,0,-1).applyQuaternion(c.quaternion).add(eye),up=new T.Vector3(0,1,0).applyQuaternion(c.quaternion);eye.y=-1.612-eye.y;look.y=-1.612-look.y;up.y=-up.y;
 r3BaseCamera.position.copy(eye);r3BaseCamera.up.copy(up);r3BaseCamera.lookAt(look);r3BaseCamera.near=c.near;r3BaseCamera.far=c.far;r3BaseCamera.projectionMatrix.copy(c.projectionMatrix);r3BaseCamera.projectionMatrixInverse.copy(c.projectionMatrixInverse);r3BaseCamera.updateMatrixWorld();
 r3BaseMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(r3BaseCamera.projectionMatrix).multiply(r3BaseCamera.matrixWorldInverse);
 r3BaseInverse.multiplyMatrices(r3BaseCamera.matrixWorld,r3BaseCamera.projectionMatrixInverse);
 meshes.forEach(function(o,i){o.visible=visibility[i]&&(/^(brain|brain_pons|harness_gray|harness_silver|collar|fitting|milk_drop|feed_column|crown_puff|led_magenta)$/.test(o.userData.role)||(o.userData.sources||[]).indexOf('mesh99')>=0);});
 r3OpticalCapture.value=1;try{renderer.setRenderTarget(r3BaseRT);renderer.toneMapping=T.NoToneMapping;renderer.outputEncoding=T.LinearEncoding;raw(s,r3BaseCamera);}finally{r3OpticalCapture.value=0;meshes.forEach(function(o,i){o.visible=visibility[i];});}
}

function build(){
  var byKey={},keys=[],i;
  for(i=0;i<doc.meshes.length;i++){
    var d=doc.meshes[i],b=!!d.building,key=d.role+'|'+(b?'b':'m')+'|'+(lit(d)?d.lightmap+':vertex':'-')+'|'+b2Scope(d)+'|'+b2Key(d)+(b2Scope(d)==='b3-defer'&&d.role==='glass'?'|'+d.name:'')+(d.name==='mesh99'?'|mesh99':'')+(d.name==='mesh101'?'|mesh101':'')+(d.name==='n08-frame_building'?'|logo-frame':'')+cBatchKey(d);
    if(!byKey[key]){byKey[key]=[];keys.push(key);}byKey[key].push(d);
  }
  keys.sort();
  for(i=0;i<keys.length;i++){
    var parts=keys[i].split('|'),building=parts[1]==='b',lm=parts[2]!=='-',al=lm?parts[2].split(':'):null;
    var first=byKey[keys[i]][0],g=merge(byKey[keys[i]],lm),mat=r3Material(first,lm,building),mesh=new T.Mesh(g,mat);
    mesh.name='v10b1/'+keys[i];mesh.userData={role:parts[0],building:building,lightmap:lm?parts[2]:null,sources:byKey[keys[i]].map(function(x){return x.name;})};
    if(mask&&building)mesh.visible=false;
    if(first.role==='brain'||first.role==='brain_pons'){var aoParts=byKey[keys[i]],ao=new Float32Array(g.attributes.position.count),aoOffset=0,aoMap={mesh110:[0,18674],mesh111:[74696,5694],mesh112:[97472,1187]};aoParts.forEach(function(d){var v=aoMap[d.name];if(!v||v[1]!==d.vertices)throw Error('AO vertex alignment');ao.set(new Float32Array(b3Aperture,v[0],v[1]),aoOffset);aoOffset+=v[1];});g.setAttribute('b3Aperture',new T.BufferAttribute(ao,1));var received=new Float32Array(g.attributes.position.count*3),receivedOffset=0,receivedMap={mesh110:[0,18674],mesh111:[224088,5694],mesh112:[292416,1187]};aoParts.forEach(function(d){var v=receivedMap[d.name];if(!v||v[1]!==d.vertices)throw Error('Brain received vertex alignment');received.set(new Float32Array(R3.brainReceived,v[0],v[1]*3),receivedOffset);receivedOffset+=v[1]*3;});g.setAttribute('r3BrainReceived',new T.BufferAttribute(received,3));}
    if(first.role==='milk_drop'){var dr=new Float32Array(g.attributes.position.count),dri=0;byKey[keys[i]].forEach(function(dd){var rr=(dd.bbox[1][0]-dd.bbox[0][0])*.5;dr.fill(rr,dri,dri+dd.vertices);dri+=dd.vertices;});g.setAttribute('r3DropRadius',new T.BufferAttribute(dr,1));}
    if(b2Scope(first)==='b3-defer'){mesh.userData.b3=true;if(first.role==='glass'||(first.name==='culture-liquid'||first.name==='tank-milk')){b3Surfaces.push(mesh);mesh.renderOrder=first.role==='glass'?20:10;}}
    cRegister(mesh,byKey[keys[i]]);scene.add(mesh);groups.push(mesh);
  }
  var white=new T.Color(1,1,1),m4=new T.Matrix4(),j;
  doc.instances.forEach(function(d){
    var building=!!d.building,tread=false;
    var mesh=new T.InstancedMesh(geometry(d.geometry),r3Material(d,false,building),d.count),mats=view(d.matrices,d.count*16);
    for(j=0;j<d.count;j++){m4.fromArray(mats,j*16);mesh.setMatrixAt(j,m4);mesh.setColorAt(j,white);}
    mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    mesh.name='v10b1/instances/'+d.name;mesh.userData={role:d.role,building:building,lightmap:tread?'building floor (world xz)':null};
    if(mask&&building)mesh.visible=false;
    scene.add(mesh);instanced.push(mesh);
  });
  var q=new T.Quaternion(),s=new T.Vector3(),p=new T.Vector3();
  doc.points.forEach(function(d){
    var mesh=new T.InstancedMesh(geometry(d.geometry),r3Material(d,false,false),d.count),pos=view(d.positions,d.count*3);
    s.set(d.scale,d.scale,d.scale);
    for(j=0;j<d.count;j++){p.set(pos[j*3],pos[j*3+1],pos[j*3+2]);m4.compose(p,q,s);mesh.setMatrixAt(j,m4);mesh.setColorAt(j,white);}
    mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    mesh.name='v10b1/points/'+d.name;mesh.userData={role:d.role,building:false,cSource:d};cPoints[d.name]=mesh;
    scene.add(mesh);instanced.push(mesh);
  });
}
// s6a の仮の光（ライトマップを持たない b2 の対象だけに効く。焼いた面ではシェーダで直接光を捨てる）
var R3_SOURCE_LIGHTS=[{"object":"brain-key","type":"POINT","energy":18.0,"color_linear":[1.0,0.7605245113372803,0.8549926280975342],"position_three_m":[0.3199999928474426,0.33000001311302185,0.3400000035762787],"three_light_object_quaternion_xyzw":[-0.7071067690849304,0.0,0.0,0.7071067690849304]},{"object":"brain-rim","type":"POINT","energy":6.0,"color_linear":[1.0,0.26635560393333435,0.4793201684951782],"position_three_m":[-0.25999999046325684,-0.23000000417232513,-0.30000001192092896],"three_light_object_quaternion_xyzw":[-0.7071067690849304,0.0,0.0,0.7071067690849304]},{"object":"fan-under","type":"POINT","energy":16.0,"color_linear":[0.0,0.7230551242828369,0.577580451965332],"position_three_m":[0.0,-2.299999952316284,0.0],"three_light_object_quaternion_xyzw":[-0.7071067690849304,0.0,0.0,0.7071067690849304]},{"object":"lid-led-inner","type":"POINT","energy":26.0,"color_linear":[1.0,0.0015176349552348256,0.3915724754333496],"position_three_m":[0.0,0.7300000190734863,0.0],"three_light_object_quaternion_xyzw":[-0.7071067690849304,0.0,0.0,0.7071067690849304]},{"object":"neon-spill","type":"AREA","energy":540.0,"color_linear":[1.0,0.03560131415724754,0.0802198201417923],"position_three_m":[0.0,1.7580000162124634,0.3799999952316284],"three_light_object_quaternion_xyzw":[2.1855694143368964e-08,0.0,0.0,1.0],"width":1.7200000286102295,"height":0.30000001192092896},{"object":"r3-housing-key","type":"AREA","energy":32.0,"color_linear":[1.0,1.0,1.0],"position_three_m":[1.5,-0.949999988079071,2.4000000953674316],"three_light_object_quaternion_xyzw":[-0.05073291063308716,0.2752982974052429,0.01455001626163721,0.9599090218544006],"width":2.5999999046325684,"height":1.5},{"object":"r3-housing-side","type":"AREA","energy":15.0,"color_linear":[1.0,1.0,1.0],"position_three_m":[-2.299999952316284,-1.0,1.0],"three_light_object_quaternion_xyzw":[-0.041526537388563156,-0.547627329826355,-0.027226660400629044,0.8352476358413696],"width":1.399999976158142,"height":1.7999999523162842},{"object":"vat-core","type":"AREA","energy":19.0,"color_linear":[1.0,0.0015176349552348256,0.3915724754333496],"position_three_m":[0.0,-0.7160000205039978,0.0],"three_light_object_quaternion_xyzw":[-0.7071067690849304,0.0,0.0,0.7071067690849304],"width":0.5600000023841858,"height":0.25}];
function lights(){
 if(mask)return;
 T.RectAreaLightUniformsLib.init();
 R3_SOURCE_LIGHTS.forEach(function(d){
  var housing=d.object.indexOf('r3-housing-')===0,l;
  if(housing){
   l=new T.RectAreaLight(new T.Color().fromArray(d.color_linear),d.energy/(Math.PI*d.width*d.height),d.width,d.height);
   l.quaternion.fromArray(d.three_light_object_quaternion_xyzw);R3.areaLights.push(l);
  }else if(d.type==='POINT'){
   l=new T.PointLight(new T.Color().fromArray(d.color_linear),d.energy/(4*Math.PI),d.object==='fan-under'?1.8:2.0,2);
  }else return; // diffuse spill is in new LM; nonvisible area geometry is not inserted.
  l.name=d.object;l.position.fromArray(d.position_three_m);scene.add(l);
 });
}
function applyRing(){}

// 視点: v9 の 8 か所（実 m）＋ 8K の 2 台（Blender の位置・回転・焦点距離）
/* Insert inside the existing single viewer IIFE, replacing makeViews through controls.
   Existing bindings: T, doc, views, viewIndex, camera, renderer, target, theta, phi,
   radius, lensFov, pointers, pinchStart, pinchRadius, ready, needsRender, query, clamp.
   Merge r3-cameras.json.blender into doc.cameras.blender before makeViews(). */
var r3FirstSelection=true,r3AutoDefault=true,r3LastPortrait=innerHeight>innerWidth,r3ControlsBound=false;
// Normal browsing has responsive hero fit; ?review preserves all source camera poses.
var r3HeroFitActive=false,r3HeroFitPointsCache=null,r3LastHeroFit=null;
var R3_BOUNDS={floor:-2.18,ceiling:21.8,radius:18.1,machineRadius:.8,machineTop:2.15};
function r3Message(text,error){
  var box=document.getElementById(error?'viewer-error':'viewer-status');
  if(box){box.textContent=text;box.hidden=!text;}
}
function r3SyncUI(){
  var select=document.getElementById('view-select'),label=document.getElementById('current-view');
  if(select)select.value=String(viewIndex);
  if(label&&views[viewIndex])label.textContent=views[viewIndex].name;
  if(window.LactoCortexUI)window.LactoCortexUI.sync();
}
function r3DefaultView(){return innerHeight>innerWidth?9:8;}
function r3ReviewCameraMode(){return query.has('review');}
function r3HeroFitPoints(){
  if(r3HeroFitPointsCache)return r3HeroFitPointsCache;
  var points=[],names=[];
  // Source-space central apparatus: all complete machine parts within its 2.5m footprint.
  // Long service hoses/room walls are not the hero envelope. Neon and four feet are included.
  (doc.meshes||[]).forEach(function(m){
    if(m.building||!m.bbox)return;
    var b=m.bbox;if(b[0][0]<-1.25||b[1][0]>1.25||b[0][2]<-1.25||b[1][2]>1.25)return;
    names.push(m.name);
    for(var x=0;x<2;x++)for(var y=0;y<2;y++)for(var z=0;z<2;z++)points.push(new T.Vector3(b[x][0],b[y][1],b[z][2]));
  });
  if(!points.length)throw Error('主役の表示範囲を確認できませんでした。');
  r3HeroFitPointsCache={points:points,names:names};return r3HeroFitPointsCache;
}
function r3FitHero(){
  if(r3ReviewCameraMode())return;
  var source=r3HeroFitPoints(),p=camera.projectionMatrix.elements;
  // Reserve the actual persistent common-UI rectangles and safe-area insets.
  // Opening a transient menu does not change this envelope or the camera.
  var occupancy=window.LactoCortexUI?window.LactoCortexUI.getOccupancy():null;
  var top=12,bottom=12,left=12,right=12,w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
  if(occupancy&&occupancy.ready){
    var safe=occupancy.safeArea;top+=safe.top;bottom+=safe.bottom;left+=safe.left;right+=safe.right;
    occupancy.persistent.forEach(function(r){if(r.y+r.height<h*.5)top=Math.max(top,r.y+r.height+10);else bottom=Math.max(bottom,h-r.y+10);});
  }
  var marginX=Math.max(.05,left/w,right/w),marginY=Math.max(.03,top/h,bottom/h);
  var mx=Math.max(.08,1-2*marginX)-Math.abs(p[8]),my=Math.max(.08,1-2*marginY)-Math.abs(p[9]),back=0;
  camera.updateMatrixWorld(true);
  source.points.forEach(function(point){
    var v=point.clone().applyMatrix4(camera.matrixWorldInverse);
    back=Math.max(back,v.z+Math.abs(p[0]*v.x)/Math.max(mx,.05),v.z+Math.abs(p[5]*v.y)/Math.max(my,.05),v.z+camera.near+.01);
  });
  var requestedBack=back,fitScale=1;
  if(back>0){
    var direction=new T.Vector3();camera.getWorldDirection(direction);direction.multiplyScalar(-1);
    var eye=camera.position,a=direction.x*direction.x+direction.z*direction.z,b=eye.x*direction.x+eye.z*direction.z,c=eye.x*eye.x+eye.z*eye.z-R3_BOUNDS.radius*R3_BOUNDS.radius;
    var limit=a>1e-10?(-b+Math.sqrt(Math.max(0,b*b-a*c)))/a:Infinity;
    if(direction.y>1e-10)limit=Math.min(limit,(R3_BOUNDS.ceiling-eye.y)/direction.y);
    else if(direction.y< -1e-10)limit=Math.min(limit,(R3_BOUNDS.floor-eye.y)/direction.y);
    back=Math.min(back,Math.max(0,limit-.00001));camera.position.addScaledVector(direction,back);
    r3PolarFromCamera();camera.updateMatrixWorld(true);
    // An explicit portrait hero in a wide window can reach the room boundary.
    // Widen its normal-view lens only as needed; review cameras never use this path.
    source.points.forEach(function(point){var v=point.clone().applyMatrix4(camera.matrixWorldInverse);fitScale=Math.min(fitScale,mx*(-v.z)/Math.max(Math.abs(p[0]*v.x),1e-8),my*(-v.z)/Math.max(Math.abs(p[5]*v.y),1e-8));});
    if(fitScale<1){lensFov.fitScale=fitScale;r3Projection();}
  }
  r3LastHeroFit={mode:'normal-browsing',retreat_m:back,requested_retreat_m:requestedBack,projection_scale:fitScale,margin_x:marginX,margin_y:marginY,ui_occupancy:occupancy,source_objects:source.names.slice(),viewport:[innerWidth,innerHeight]};
  needsRender=true;
}
function makeViews(){
  views.length=0;r3FirstSelection=true;r3HeroFitPointsCache=null;r3HeroFitActive=false;
  (doc.cameras.v9_views||[]).forEach(function(v,i){
    views.push({kind:'orbit',key:'legacy-'+(i+1),name:v.name,target:v.target_m.slice(),theta:v.theta,phi:v.phi,radius:v.radius_m});
  });
  if(views.length!==8)throw Error('旧視点8件の対応が一致しません。');
  var cameras=doc.cameras.blender||{},ordered=['8k-mac','8k-phone','room-wide','housing','logo-close'];
  Object.keys(cameras).forEach(function(k){if(ordered.indexOf(k)<0)ordered.push(k);});
  var labels={'8k-mac':'主役 横','8k-phone':'主役 縦','room-wide':'室内 全景','housing':'演算筐体','logo-close':'壁面ロゴ'};
  ordered.forEach(function(k){
    var c=cameras[k];if(!c){if(k==='8k-mac'||k==='8k-phone')throw Error('主役カメラがありません。');return;}
    views.push({kind:'blender',key:k,name:c.name||labels[k]||k,position:c.position.slice(),quaternion:c.quaternion_xyzw.slice(),lens:c.lens_mm,sensor:c.sensor_width_mm,sensorHeight:c.sensor_height_mm||24,sensorFit:c.sensor_fit||'HORIZONTAL',clip:(c.clip||[.02,400]).slice(),referenceResolution:(c.resolution||[1600,1000]).slice(),projection:c.projection_matrix_column_major?c.projection_matrix_column_major.slice():null,orbitTarget:c.orbit_target_m?c.orbit_target_m.slice():null,reference:c.reference_id||null});
  });
  /* c2：視点ごとに釦を置くための軌道視点。位置は target + r·(sinφ·sinθ, cosφ, sinφ·cosθ) */
  [{key:'c-tank',      name:'タンク', target:[0,1.44,0],     theta:0.14, phi:1.30, radius:3.10, portrait:2.60},
   {key:'c-brain',     name:'脳',     target:[0,-0.06,0],    theta:0.45, phi:1.30, radius:2.10, portrait:1.80},
   {key:'c-lower',     name:'下部',   target:[0,-1.55,0],    theta:0.55, phi:1.32, radius:4.60, portrait:4.80},
   {key:'c-panel',     name:'電源盤', target:[0,-1.72,-5.00],theta:0.55, phi:1.28, radius:4.00, portrait:3.20},
   {key:'c-turntable', name:'回転台', target:[0,-2.15,0],    theta:0.35, phi:1.02, radius:5.60, portrait:6.20}
  ].forEach(function(v){
    views.push({kind:'orbit',key:v.key,name:v.name,target:v.target.slice(),theta:v.theta,phi:v.phi,
                radius:v.radius,radiusPortrait:v.portrait});
  });
  var select=document.getElementById('view-select');
  if(select){select.textContent='';views.forEach(function(v,i){var o=document.createElement('option');o.value=String(i);o.textContent=(i+1)+' · '+v.name;select.appendChild(o);});select.disabled=false;}
  document.querySelectorAll('[data-viewer-action]').forEach(function(b){b.disabled=false;});
  r3Message('',false);r3Message('',true);
  document.documentElement.setAttribute('data-ready','1');
}
function fov(){
  var aspect=Math.max(.05,camera.aspect||1);
  if(lensFov){
    if(lensFov.projection){var p=lensFov.projection;return 2*Math.atan(1/((lensFov.sensorFit==='VERTICAL'?p[5]:p[0]*aspect)*(lensFov.fitScale||1)))*180/Math.PI;}
    var span=lensFov.sensorFit==='VERTICAL'?lensFov.sensorHeight:lensFov.sensor/aspect;
    return 2*Math.atan(span/(2*lensFov.lens))*180/Math.PI;
  }
  return Math.min(76,Math.max(42,2*Math.atan(.3126/aspect)*180/Math.PI));
}
function r3Projection(){
  camera.fov=fov();camera.updateProjectionMatrix();
  if(lensFov&&lensFov.projection){
    var p=lensFov.projection.slice(),a=camera.aspect,ar=lensFov.referenceAspect;
    if(Math.abs(a-ar)>1e-7){
      if(lensFov.sensorFit==='VERTICAL'){p[0]=p[5]/a;p[8]*=ar/a;}
      else{p[5]=p[0]*a;p[9]*=a/ar;}
    }
    p[0]*=lensFov.fitScale||1;p[5]*=lensFov.fitScale||1;
    camera.projectionMatrix.fromArray(p);camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
}
function r3PolarFromCamera(){
  var off=camera.position.clone().sub(target);radius=Math.max(.05,off.length());phi=Math.acos(clamp(off.y/radius,-1,1));theta=Math.atan2(off.x,off.z);
}
function constrain(){
  var p=camera.position,b=R3_BOUNDS;p.y=clamp(p.y,b.floor,b.ceiling);
  var h=Math.hypot(p.x,p.z);
  if(h>b.radius){p.x*=b.radius/h;p.z*=b.radius/h;h=b.radius;}
  if(p.y<b.machineTop&&h<b.machineRadius){
    if(h>1e-8){p.x*=b.machineRadius/h;p.z*=b.machineRadius/h;}
    else{p.x=Math.sin(theta)*b.machineRadius;p.z=Math.cos(theta)*b.machineRadius;}
  }
}
function updateCamera(){
  var sp=Math.sin(phi),cp=Math.cos(phi);
  camera.position.set(target.x+radius*sp*Math.sin(theta),target.y+radius*cp,target.z+radius*sp*Math.cos(theta));
  constrain();camera.lookAt(target);r3PolarFromCamera();r3Projection();camera.updateMatrixWorld(true);needsRender=true;
}
function setView(i,automatic){
  if(!views.length)return;
  if(r3FirstSelection){
    r3FirstSelection=false;
    var preset=query.get('preset'),wanted=-1;
    if(preset){var aliases={room:'room-wide',logo:'logo-close',machine:innerHeight>innerWidth?'8k-phone':'8k-mac'};preset=aliases[preset]||preset;wanted=views.findIndex(function(v){return v.key===preset||v.reference===preset;});}
    if(wanted>=0){i=wanted;r3AutoDefault=false;}
    else if(query.has('view')){var q=Number(query.get('view'));i=Number.isFinite(q)&&q>=1&&q<=views.length?Math.floor(q)-1:r3DefaultView();r3AutoDefault=false;}
    else{i=r3DefaultView();r3AutoDefault=true;}
  }else if(!automatic)r3AutoDefault=false;
  i=Number(i);if(!Number.isInteger(i)||!views[i])return;
  var v=views[i];viewIndex=i;
  if(camera.clearViewOffset)camera.clearViewOffset();
  if(v.kind==='orbit'){
    lensFov=null;camera.near=.02;camera.far=400;target.set(v.target[0],v.target[1],v.target[2]);theta=v.theta;phi=v.phi;radius=(v.radiusPortrait&&innerHeight>innerWidth)?v.radiusPortrait:v.radius;updateCamera();
  }else{
    lensFov={lens:v.lens,sensor:v.sensor,sensorHeight:v.sensorHeight,sensorFit:v.sensorFit,projection:v.projection,referenceAspect:v.referenceResolution[0]/v.referenceResolution[1]};
    camera.near=v.clip[0];camera.far=v.clip[1];camera.position.fromArray(v.position);camera.quaternion.fromArray(v.quaternion);camera.updateMatrixWorld(true);
    var direction=new T.Vector3();camera.getWorldDirection(direction);
    var anchor=v.orbitTarget?new T.Vector3().fromArray(v.orbitTarget):v.key==='housing'?new T.Vector3(0,-1.26,0):v.key==='room-wide'?new T.Vector3(0,9,0):v.key==='logo-close'?new T.Vector3(17.56,9.7,-10.61):new T.Vector3(0,0,0);
    var distance=Math.max(.35,anchor.sub(camera.position).dot(direction));
    target.copy(camera.position).addScaledVector(direction,distance);r3PolarFromCamera();r3Projection();needsRender=true;
  }
  r3HeroFitActive=!r3ReviewCameraMode()&&(v.key==='8k-mac'||v.key==='8k-phone');
  if(r3HeroFitActive)r3FitHero();
  r3LastPortrait=innerHeight>innerWidth;r3SyncUI();
}
function resize(){
  var w=Math.max(1,innerWidth),h=Math.max(1,innerHeight),portrait=h>w;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(w,h);camera.aspect=w/h;
  if(views.length&&r3HeroFitActive)setView(r3AutoDefault?r3DefaultView():viewIndex,true);
  else if(views.length&&r3AutoDefault&&portrait!==r3LastPortrait)setView(r3DefaultView(),true);
  else r3Projection();
  r3LastPortrait=portrait;needsRender=true;
}
function r3Reset(){r3AutoDefault=true;setView(r3DefaultView(),true);}
function r3Zoom(factor){if(!ready)return;r3AutoDefault=false;r3HeroFitActive=false;radius=clamp(radius*factor,.05,45);updateCamera();}
function controls(){
  if(r3ControlsBound)return;r3ControlsBound=true;var el=renderer.domElement;el.tabIndex=0;el.setAttribute('aria-label','作品。ドラッグで回転、ホイールや二本指で拡大縮小。矢印キーでも操作できます。');
  el.addEventListener('pointerdown',function(e){
    if(!ready||e.button>0)return;el.focus({preventScroll:true});el.setPointerCapture(e.pointerId);pointers[e.pointerId]={x:e.clientX,y:e.clientY};r3AutoDefault=false;r3HeroFitActive=false;
    var ids=Object.keys(pointers);if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]];pinchStart=Math.hypot(a.x-b.x,a.y-b.y);pinchRadius=radius;}
  });
  el.addEventListener('pointermove',function(e){
    var pt=pointers[e.pointerId];if(!pt||!ready)return;var ids=Object.keys(pointers),dx=e.clientX-pt.x,dy=e.clientY-pt.y;pt.x=e.clientX;pt.y=e.clientY;
    if(ids.length===1&&(dx||dy)){theta-=dx*.004;phi=clamp(phi-dy*.004,.025,Math.PI-.025);updateCamera();}
    else if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinchStart>0){radius=clamp(pinchRadius*pinchStart/Math.max(d,1),.05,45);updateCamera();}}
  });
  function up(e){delete pointers[e.pointerId];if(Object.keys(pointers).length<2)pinchStart=0;}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);
  el.addEventListener('wheel',function(e){if(!ready)return;e.preventDefault();var delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);r3Zoom(Math.exp(clamp(delta,-800,800)*.0012));},{passive:false});
  window.addEventListener('blur',function(){pointers={};pinchStart=0;});
  window.addEventListener('keydown',function(e){
    if(!ready||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||(window.LactoCortexUI&&window.LactoCortexUI.isEventOwned(e)))return;var tag=e.target&&e.target.tagName;if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA'||tag==='BUTTON'||tag==='A'||(e.target&&e.target.isContentEditable))return;
    var k=e.key,handled=true;
    if(k>='1'&&k<='9')setView(+k-1);else if(k==='0')setView(9);else if(k==='r'||k==='R'||k==='Home')r3Reset();
    else if(k==='+'||k==='=')r3Zoom(.88);else if(k==='-'||k==='_')r3Zoom(1/.88);
    else if(k==='ArrowLeft'||k==='ArrowRight'){r3AutoDefault=false;r3HeroFitActive=false;theta+=k==='ArrowLeft'?.06:-.06;updateCamera();}
    else if(k==='ArrowUp'||k==='ArrowDown'){r3AutoDefault=false;r3HeroFitActive=false;phi=clamp(phi+(k==='ArrowUp'?-.06:.06),.025,Math.PI-.025);updateCamera();}
    else if(k===' '){cSetPlaying(!cClock.playing());}
    else handled=false;if(handled)e.preventDefault();
  });
  var select=document.getElementById('view-select');if(select)select.addEventListener('change',function(){setView(+select.value);});
  document.querySelectorAll('[data-viewer-action]').forEach(function(button){button.addEventListener('click',function(){var action=button.getAttribute('data-viewer-action');if(action==='reset')r3Reset();else if(action==='in')r3Zoom(.8);else if(action==='out')r3Zoom(1.25);});});
  if(query.get('ui')==='0')document.documentElement.classList.add('viewer-ui-hidden');
}

// One absolute artwork clock. Wall-clock gaps are excluded explicitly on suspension.
function createCortexClock(options){
  options=options||{};
  var elapsed=Number.isFinite(options.time)?Math.max(0,options.time):0;
  var playing=options.playing!==false,suspended=true,anchor=0;
  function time(now){return elapsed+(playing&&!suspended?Math.max(0,now-anchor)*.001:0);}
  function commit(now){elapsed=time(now);anchor=now;}
  return {
    time:time,
    playing:function(){return playing;},
    suspended:function(){return suspended;},
    setPlaying:function(value,now){commit(now);playing=!!value;},
    suspend:function(now){commit(now);suspended=true;},
    resume:function(now){if(suspended){anchor=now;suspended=false;}},
    seek:function(value,now){if(!Number.isFinite(value)||value<0)throw Error('Invalid artwork time');elapsed=value;anchor=now;}
  };
}

var cBySource=Object.create(null),cPoints=Object.create(null),cMotion=null,cMotionSignals=null;
var cSeed=Number(query.get('seed')||53)>>>0,cMotionEnabled=query.get('motion')!=='off';
var cClock=createCortexClock({time:Number(query.get('time')||0),playing:!review&&!query.has('static')});
var cFrameHandle=0,cPageAway=false,cFrames=0,cLastFrameMs=0,cFrameCosts=[];
var cDynamicNames=Object.create(null),cUnbakedNames=Object.create(null);
[55,61,62,109,110,111,112,113,114,170,172,174,176,177,178,179,180,181,198,211,212,213].forEach(function(n){cDynamicNames['mesh'+n]=true;});
for(var cFan=68;cFan<=85;cFan++){cDynamicNames['mesh'+cFan]=true;if(cFan%2)cUnbakedNames['mesh'+cFan]=true;}
cUnbakedNames.mesh213=true;
function cBatchKey(d){return cDynamicNames[d.name]?'|motion:'+d.name:'';}
function cRegister(mesh,list){
  list.forEach(function(d){cBySource[d.name]=mesh;});
  if(list.length===1)mesh.userData.cSource=list[0];
  if(list[0].role==='milk_drop'){
    var scale={value:1},m=mesh.material,before=m.onBeforeCompile,key=m.customProgramCacheKey;
    mesh.userData.cDropScale=scale;
    m.onBeforeCompile=function(sh){before(sh);sh.uniforms.cDropScale=scale;sh.vertexShader=rep1(sh.vertexShader,'attribute float r3DropRadius;','attribute float r3DropRadius;uniform float cDropScale;');sh.vertexShader=rep1(sh.vertexShader,'vR3DropRadius=r3DropRadius;','vR3DropRadius=r3DropRadius*cDropScale;');};
    m.customProgramCacheKey=function(){return key.call(m)+'-c-world-drop-radius';};
  }
}
function cSetPlaying(value){cClock.setPlaying(value,performance.now());needsRender=true;if(window.LactoCortexUI)window.LactoCortexUI.sync();}
function cRequestFrame(){needsRender=true;}
function cLayoutChanged(){if(ready&&(r3HeroFitActive||(views[viewIndex]&&views[viewIndex].radiusPortrait)))setView(r3AutoDefault?r3DefaultView():viewIndex,true);needsRender=true;}

/* 給養チューブの脈動と、制御部ライトの明滅。時刻は作品の唯一の時計から受け取る。
   脈動は管の全長を流れる液の膨らみ（DNA の PUMP_PERIOD に同期）。
   明滅は光源ごとに種を変えた階段乱数で、そろわないようにしてある。 */
var C_FEED={period:0.78,amp:0.010,waves:1.15,floorMix:0.35,ledRate:6.0,tubeDim:0.42,tubeEnv:0.55};
var C_LED_V={"mesh10":21,"mesh11":24,"mesh12":24,"mesh13":24,"mesh16":21,"mesh17":24,"mesh18":24,"mesh19":24,"mesh22":21,"mesh23":24,"mesh24":24,"mesh25":24,"mesh28":21,"mesh29":24,"mesh30":24,"mesh31":24,"mesh34":21,"mesh35":24,"mesh36":24,"mesh37":24};
var cFeedU={t:{value:0},amp:{value:C_FEED.amp},wav:{value:C_FEED.waves},flo:{value:C_FEED.floorMix},lt:{value:0},lr:{value:C_FEED.ledRate}};
function cFeedBatch(src){
  var hit=null;
  scene.traverse(function(o){
    if(hit||!o.isMesh||!o.userData||!o.userData.sources)return;
    if(o.userData.sources.indexOf(src)>=0)hit=o;
  });
  return hit;
}
function cFeedInit(){
  var tube=cFeedBatch('c-feed-tube-0'),pipe=cFeedBatch('mesh172');
  if(tube&&!tube.userData.cPulse){
    if(pipe&&pipe.material){                      /* 上の立ち下がり管と同じ桃色へ揃える */
      var mm=pipe.material.clone();
      mm.color.multiplyScalar(C_FEED.tubeDim);    /* 主役の脳に勝たない明るさまで落とす */
      if(mm.envMapIntensity!==undefined)mm.envMapIntensity*=C_FEED.tubeEnv;
      tube.material=mm;
    }
    var m=tube.material,prior=m.onBeforeCompile;
    m.onBeforeCompile=function(sh){
      if(prior)prior(sh);
      sh.uniforms.uTime=cFeedU.t;sh.uniforms.uAmp=cFeedU.amp;sh.uniforms.uWav=cFeedU.wav;sh.uniforms.uFlo=cFeedU.flo;
      sh.vertexShader='uniform float uTime;uniform float uAmp;uniform float uWav;uniform float uFlo;\n'+
        rep1(sh.vertexShader,'#include <begin_vertex>',
          '#include <begin_vertex>\n'+
          'float cS = uv.x;\n'+
          'float cPh = uv.y;\n'+
          'float cW = 0.5 + 0.5*cos(6.2831853*(uTime + cPh - cS*uWav));\n'+
          'float cSw = uFlo + (1.0-uFlo)*cW;\n'+
          'float cEnv = smoothstep(0.0,0.10,cS)*smoothstep(1.0,0.90,cS);\n'+
          'transformed += normal * (uAmp * cSw * cEnv);');
    };
    m.customProgramCacheKey=function(){return 'c-feed-pulse-v2';};
    m.needsUpdate=true;tube.userData.cPulse=true;
  }
  scene.traverse(function(o){
    if(!o.isMesh||!o.userData||!o.userData.sources||o.userData.cLed)return;
    var src=o.userData.sources,i;
    for(i=0;i<src.length;i++)if(!C_LED_V[src[i]])return;      /* 制御部の灯だけ */
    var total=o.geometry.attributes.position.count,id=new Float32Array(total),at=0;
    for(i=0;i<src.length;i++){var c=C_LED_V[src[i]];if(at+c>total)return;id.fill(i+1,at,at+c);at+=c;}
    if(at!==total)return;
    o.geometry.setAttribute('cLedId',new T.BufferAttribute(id,1));
    var m2=o.material,prior2=m2.onBeforeCompile;
    m2.onBeforeCompile=function(sh){
      if(prior2)prior2(sh);
      sh.uniforms.uLt=cFeedU.lt;sh.uniforms.uLr=cFeedU.lr;
      sh.vertexShader='attribute float cLedId;varying float vLedId;\n'+
        rep1(sh.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\n  vLedId = cLedId;');
      sh.fragmentShader='uniform float uLt;uniform float uLr;varying float vLedId;\n'+
        'float cH(float a){return fract(sin(a*12.9898)*43758.5453);}\n'+
        rep1(sh.fragmentShader,'#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n'+
          'float cStep = floor(uLt*uLr + cH(vLedId)*13.0);\n'+
          'float cRnd = cH(vLedId*7.3 + cStep*1.7);\n'+
          'float cNext = cH(vLedId*7.3 + (cStep+1.0)*1.7);\n'+
          'float cFrac = fract(uLt*uLr + cH(vLedId)*13.0);\n'+
          'float cMix = mix(cRnd,cNext,smoothstep(0.55,1.0,cFrac));\n'+
          'float cSlow = 0.70 + 0.30*sin(uLt*1.9 + vLedId*2.7);\n'+
          'float cOff = step(cMix,0.16);\n'+
          'float cLev = mix(0.30 + 1.25*cMix, 0.06, cOff) * cSlow;\n'+
          'totalEmissiveRadiance *= cLev;');
    };
    m2.customProgramCacheKey=function(){return 'c-led-flicker-'+o.id;};
    m2.needsUpdate=true;o.userData.cLed=true;
  });
}
function cFeedTick(t){cFeedU.t.value=t/C_FEED.period;cFeedU.lt.value=t;}
function cPrepare(){
  if(typeof createCortexMotion!=='function')throw Error('Cortex motion implementation missing');
  cMotion=createCortexMotion(T,{bySource:cBySource,vatBubbles:cPoints['points108-bubble'],tankBubbles:cPoints['points197-bubble'],doc:doc,setSignals:function(s){cMotionSignals=s;if(typeof cApplyOpticalSignals==='function')cApplyOpticalSignals(s);}}, {seed:cSeed});
  if(typeof cInitOptics==='function')cInitOptics({bySource:cBySource,scene:scene,doc:doc});
  cFeedInit();
  if(cMotionEnabled)cMotion.apply(cClock.time(performance.now()));
  window.LactoCortexUI.mount({canvas:renderer.domElement,views:function(){return views;},getViewIndex:function(){return viewIndex;},setView:setView,reset:r3Reset,zoom:r3Zoom,getPlaying:cClock.playing,setPlaying:cSetPlaying,requestFrame:cRequestFrame,onLayout:cLayoutChanged});
  if(!document.hidden&&!cPageAway)cClock.resume(performance.now());
}
function cSuspend(){cClock.suspend(performance.now());if(cFrameHandle){cancelAnimationFrame(cFrameHandle);cFrameHandle=0;}pointers={};pinchStart=0;}
function cResume(){if(document.hidden||cPageAway)return;if(ready)cClock.resume(performance.now());needsRender=true;if(!cFrameHandle)cFrameHandle=requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',function(){if(document.hidden)cSuspend();else cResume();});
window.addEventListener('pagehide',function(){cPageAway=true;cSuspend();});
window.addEventListener('pageshow',function(){cPageAway=false;cResume();});
function cReport(){
  return {playing:cClock.playing(),suspended:cClock.suspended(),time:cClock.time(performance.now()),seed:cSeed,motionEnabled:cMotionEnabled,frames:cFrames,lastFrameMs:cLastFrameMs,frameCostsMs:cFrameCosts.slice(),state:cMotion?cMotion.state(cClock.time(performance.now())):null,ui:window.LactoCortexUI?window.LactoCortexUI.report():null,fit:r3LastHeroFit};
}

/* cortex c: authored geometry stays immutable; time is supplied by the one host clock.
 * CPU-only preparation. See doc/animation/motion-api.md and motion-map.json.
 * Insert inside the product IIFE; no DOM, RAF, renderer, network or GPU ownership.
 */
var CORTEX_MOTION_SPEC = {
  version:'cortex-c-absolute-time-v1', defaultSeed:20260919, pumpPeriod:.78,
  fanNames:['mesh68','mesh69','mesh70','mesh71','mesh72','mesh73','mesh74','mesh75','mesh76','mesh77','mesh78','mesh79','mesh80','mesh81','mesh82','mesh83','mesh84','mesh85'],
  brainNames:['mesh110','mesh111','mesh112','mesh113','mesh114'],
  tagNames:['mesh211','mesh212','mesh213'], dropNames:['mesh176','mesh177','mesh178','mesh179','mesh180','mesh181'],
  fanPivot:[0,-1.96,0], brainPivot:[0,-.07,0], tagPivot:[-.5806930661201477,.8854999542236328,.3335359990596771],
  fanSpeed:2.6, lcdSpeed:-.14*Math.PI*2, ringSpeeds:[-.06*Math.PI*2,.06*Math.PI*2],
  brainPulseScale:.005, brainBobMetres:.001, brainYawRadians:.006,
  dropRadius:.032, dropSwell:.42, dropFall:.5, dropAbsorb:.12,
  vat:{radius:.50265,bottom:-.78,top:.62-.0105-.002,bubbleRadius:.0105},
  tank:{radius:.3041,centreY:1.42,halfLength:.576,flatLevel:1.59794033,bubbleRadius:.0075,margin:.002}
};
function createCortexMotion(T,api,opts){
  'use strict';
  opts=opts||{};api=api||{};
  var spec=CORTEX_MOTION_SPEC,TAU=Math.PI*2,seed=(opts.seed==null?spec.defaultSeed:opts.seed)>>>0;
  var by=api.bySource||{},rest=[],restSet=[],strict=opts.strict!==false;
  var tmpMatrix=new T.Matrix4(),tmpQuaternion=new T.Quaternion(),tmpEuler=new T.Euler(),tmpPosition=new T.Vector3(),tmpScale=new T.Vector3(),axisY=new T.Vector3(0,1,0);
  function get(name){var o=by[name];if(!o&&strict)throw Error('Cortex motion missing source '+name);return o;}
  function save(o){if(!o)return;if(restSet.indexOf(o)>=0)return;if(o.matrixAutoUpdate)o.updateMatrix();restSet.push(o);rest.push({o:o,matrix:o.matrix.clone(),matrixAutoUpdate:o.matrixAutoUpdate,visible:o.visible,dropScale:o.userData.cDropScale?o.userData.cDropScale.value:null});}
  function objects(names){var out=[];for(var i=0;i<names.length;i++){var o=get(names[i]);if(o&&out.indexOf(o)<0){out.push(o);save(o);}}return out;}
  var fans=objects(spec.fanNames),brain=objects(spec.brainNames),tag=objects(spec.tagNames),lcd=objects(['mesh55']),ring0=objects(['mesh61']),ring1=objects(['mesh62']),drops=objects(spec.dropNames);
  function bbox(name){var o=get(name),d=o&&o.userData.cSource;if(!d||!d.bbox)throw Error('Cortex motion requires cSource.bbox '+name);return d.bbox;}
  var dropRest=[];
  for(var i=0;i<spec.dropNames.length;i++){
    var name=spec.dropNames[i],b=bbox(name),c=[(b[0][0]+b[1][0])*.5,(b[0][1]+b[1][1])*.5,(b[0][2]+b[1][2])*.5],r=(b[1][0]-b[0][0])*.5;
    if(!(r>0))throw Error('Nonpositive source drop radius '+name);
    dropRest.push({name:name,object:get(name),centre:c,radius:r});
  }
  var nozzleTip=bbox('mesh172')[0][1],fitBox=bbox('mesh113'),fitTop=fitBox[1][1];
  function rng(){seed=(seed+0x6D2B79F5)>>>0;var q=seed;q=Math.imul(q^(q>>>15),q|1);q^=q+Math.imul(q^(q>>>7),q|61);return ((q^(q>>>14))>>>0)/4294967296;}
  function prepareBubbles(mesh,count,kind){
    if(!mesh){if(strict)throw Error('Missing '+kind+' bubbles');return null;}
    if(mesh.count!==count)throw Error(kind+' bubble count changed');
    var original=new Float32Array(mesh.instanceMatrix.array),seeds=[];
    for(var j=0;j<count;j++){
      var off=j*16,x=original[off+12],y=original[off+13],z=original[off+14];
      if(kind==='vat'){
        var radial=Math.sqrt(x*x+z*z)/(.9+.1*Math.sin(j));
        if(radial+spec.vat.bubbleRadius>=spec.vat.radius)throw Error('Vat radial envelope outside source liquid');
        seeds.push({r:radial,a:Math.atan2(z,x),s:.4+rng()*.8,p:Math.min(1-1e-10,Math.max(0,(y-spec.vat.bottom)/(spec.vat.top-spec.vat.bottom)))});
      }else{
        var tk=spec.tank,low=tk.centreY-tk.radius+.02,high=tk.flatLevel-tk.bubbleRadius-tk.margin,eff=tk.radius-tk.bubbleRadius-tk.margin;
        var coeff=z/Math.sqrt(Math.max(1e-12,eff*eff-(y-tk.centreY)*(y-tk.centreY)));
        if(Math.abs(coeff)>1)throw Error('Tank source bubble outside inset section');
        seeds.push({x:x-.009*Math.sin(j),z:coeff,s:.5+rng()*.9,p:Math.min(1-1e-10,Math.max(0,(y-low)/(high-low)))});
      }
    }
    return {mesh:mesh,original:original,seeds:seeds};
  }
  var vb=prepareBubbles(api.vatBubbles,54,'vat'),tb=prepareBubbles(api.tankBubbles,26,'tank');
  function fract(v){return v-Math.floor(v);}
  function modulo(v,n){return v-Math.floor(v/n)*n;}
  function pumpBeat(t){var p=modulo(t,spec.pumpPeriod)/spec.pumpPeriod;return Math.exp(-p*6)+.45*Math.exp(-Math.pow((p-.30)/.10,2));}
  // Exact legacy deterministic integer-time hashes. No RNG calls or mutable state.
  function neonFlicker(t){var b=Math.floor(t*12),h=fract(Math.sin(b*91.73)*4137.13),base=h<.05?0:(h<.12?.32:1),buzz=.85+.15*Math.sin(t*72),db=fract(Math.sin(Math.floor(t*3)*57.31)*2113.7)<.09?.45+.55*Math.abs(Math.sin(t*48)):1;return Math.max(0,Math.min(1,base*buzz*db));}
  function frame(){return {time:0,pumpBeat:0,pumpPhase:0,fanAngle:0,lcdAngle:0,ringAngles:new Float64Array(2),brainScale:1,brainTranslateY:0,brainYaw:0,brainMatrix:new T.Matrix4(),tagX:0,tagZ:0,tagMatrix:new T.Matrix4(),dropPosition:new Float64Array(18),dropRadius:new Float32Array(6),dropScale:new Float32Array(6),dropVisible:[false,false,false,false,false,false],dropStage:['idle','idle','idle','idle','idle','idle'],vatPositions:new Float32Array(162),tankPositions:new Float32Array(78),splashPulse:0,brainKeyGain:1,vatCoreGain:1,neonSpillGain:1,nozzleGain:1,brainEmissionGain:1,columnGain:1,crownPuffGain:1,hologramOpacity:1,localLEDGain:1};}
  function around(m,p,q,s,dy){tmpScale.set(s,s,s);tmpPosition.set(0,0,0);m.compose(tmpPosition,q,tmpScale);var e=m.elements; e[12]=p[0]-(e[0]*p[0]+e[4]*p[1]+e[8]*p[2]);e[13]=p[1]+dy-(e[1]*p[0]+e[5]*p[1]+e[9]*p[2]);e[14]=p[2]-(e[2]*p[0]+e[6]*p[1]+e[10]*p[2]);return m;}
  function evaluate(t,f){
    if(!Number.isFinite(t)||t<0)throw Error('Cortex motion time must be finite seconds >=0');
    var pb=pumpBeat(t),nf=neonFlicker(t);f.time=t;f.pumpBeat=pb;f.pumpPhase=modulo(t,.78)/.78;
    f.fanAngle=modulo(t*spec.fanSpeed,TAU);f.lcdAngle=modulo(t*spec.lcdSpeed,TAU);f.ringAngles[0]=modulo(t*spec.ringSpeeds[0],TAU);f.ringAngles[1]=modulo(t*spec.ringSpeeds[1],TAU);
    f.brainScale=1+spec.brainPulseScale*pb;f.brainTranslateY=spec.brainBobMetres*Math.sin(t*.6);f.brainYaw=spec.brainYawRadians*Math.sin(t*.3);
    tmpQuaternion.setFromAxisAngle(axisY,f.brainYaw);around(f.brainMatrix,spec.brainPivot,tmpQuaternion,f.brainScale,f.brainTranslateY);
    f.tagX=.06*Math.sin(t*.9+.5);f.tagZ=.14*Math.sin(t*1.2);tmpEuler.set(f.tagX,0,f.tagZ,'XYZ');tmpQuaternion.setFromEuler(tmpEuler);around(f.tagMatrix,spec.tagPivot,tmpQuaternion,1,0);
    f.brainKeyGain=(.55+.12*pb)/.67;f.vatCoreGain=(.32+.3*pb)/.62;f.neonSpillGain=(.12+.75*nf)/.87;f.nozzleGain=(.06+.05*pb)/.11;f.brainEmissionGain=(.018+.014*pb)/.032;f.columnGain=(.012+.02*pb)/.032;f.crownPuffGain=(.015+.055*Math.max(0,pb-.3))/.0535;f.hologramOpacity=nf;f.localLEDGain=1;f.splashPulse=0;
    var landingY=spec.brainPivot[1]+(fitTop-spec.brainPivot[1])*f.brainScale+f.brainTranslateY;
    var releaseY=nozzleTip-spec.dropRadius,cycle=6*spec.pumpPeriod;
    for(var j=0;j<6;j++){
      var tt=modulo(t-j*spec.pumpPeriod,cycle),radius=0,y=nozzleTip,stage='idle';
      if(tt<spec.dropSwell){radius=spec.dropRadius*(.4+.6*tt/spec.dropSwell);y=nozzleTip-radius;stage='swell';}
      else if(tt<spec.dropSwell+spec.dropFall){var fall=(tt-spec.dropSwell)/spec.dropFall;radius=spec.dropRadius;y=releaseY+(landingY+radius-releaseY)*fall*fall;stage='fall';}
      else if(tt<spec.dropSwell+spec.dropFall+spec.dropAbsorb){var k=(tt-spec.dropSwell-spec.dropFall)/spec.dropAbsorb,e=k*k*(3-2*k);radius=spec.dropRadius*(1-e);y=landingY+radius;stage='absorb';}
      var since=tt-spec.dropSwell-spec.dropFall;if(since>=0)f.splashPulse=Math.max(f.splashPulse,.22*Math.exp(-9.75*since));
      f.dropPosition[j*3]=0;f.dropPosition[j*3+1]=y;f.dropPosition[j*3+2]=0;f.dropRadius[j]=radius;f.dropScale[j]=radius/dropRest[j].radius;f.dropVisible[j]=radius>1e-7;f.dropStage[j]=stage;
    }
    if(vb)for(j=0;j<54;j++){var s=vb.seeds[j],yy=fract(t*s.s*.3+s.p),rr=s.r*(.9+.1*Math.sin(t*.5+j)),ang=s.a+t*.3*s.s;f.vatPositions[j*3]=Math.cos(ang)*rr;f.vatPositions[j*3+1]=spec.vat.bottom+yy*(spec.vat.top-spec.vat.bottom);f.vatPositions[j*3+2]=Math.sin(ang)*rr;}
    if(tb)for(j=0;j<26;j++){var s=tb.seeds[j],tk=spec.tank,eff=tk.radius-tk.bubbleRadius-tk.margin,low=tk.centreY-tk.radius+.02,high=tk.flatLevel-tk.bubbleRadius-tk.margin,yy=low+fract(t*s.s*.35+s.p)*(high-low),zz=s.z*Math.sqrt(Math.max(0,eff*eff-(yy-tk.centreY)*(yy-tk.centreY)));f.tankPositions[j*3]=s.x+.009*Math.sin(t*.3+j);f.tankPositions[j*3+1]=yy;f.tankPositions[j*3+2]=zz;}
    return f;
  }
  var current=frame(),rotationMatrix=new T.Matrix4(),dropMatrix=new T.Matrix4();
  function setObjects(list,m){for(var k=0;k<list.length;k++){var o=list[k],idx=restSet.indexOf(o);o.matrix.copy(m).multiply(rest[idx].matrix);o.matrixAutoUpdate=false;o.matrixWorldNeedsUpdate=true;}}
  function rotate(list,pivot,a){tmpQuaternion.setFromAxisAngle(axisY,a);around(rotationMatrix,pivot,tmpQuaternion,1,0);setObjects(list,rotationMatrix);}
  function moveBubbles(b,positions){if(!b)return;var arr=b.mesh.instanceMatrix.array;for(var k=0;k<b.mesh.count;k++){arr[k*16+12]=positions[k*3];arr[k*16+13]=positions[k*3+1];arr[k*16+14]=positions[k*3+2];}b.mesh.instanceMatrix.needsUpdate=true;b.mesh.matrixWorldNeedsUpdate=true;}
  function apply(t){
    var f=evaluate(t,current);rotate(fans,spec.fanPivot,f.fanAngle);rotate(lcd,[0,0,0],f.lcdAngle);rotate(ring0,[0,0,0],f.ringAngles[0]);rotate(ring1,[0,0,0],f.ringAngles[1]);setObjects(brain,f.brainMatrix);setObjects(tag,f.tagMatrix);
    for(var j=0;j<6;j++){var d=dropRest[j],o=d.object;if(!o)continue;var sc=Math.max(f.dropScale[j],1e-10),e=dropMatrix.elements;dropMatrix.makeScale(sc,sc,sc);e[12]=f.dropPosition[j*3]-sc*d.centre[0];e[13]=f.dropPosition[j*3+1]-sc*d.centre[1];e[14]=f.dropPosition[j*3+2]-sc*d.centre[2];setObjects([o],dropMatrix);o.visible=f.dropVisible[j];if(o.userData.cDropScale)o.userData.cDropScale.value=sc;}
    moveBubbles(vb,f.vatPositions);moveBubbles(tb,f.tankPositions);if(api.setSignals)api.setSignals(f);return f;
  }
  function reset(){
    for(var j=0;j<rest.length;j++){var r=rest[j];r.o.matrix.copy(r.matrix);r.o.matrixAutoUpdate=r.matrixAutoUpdate;r.o.visible=r.visible;r.o.matrixWorldNeedsUpdate=true;if(r.o.userData.cDropScale)r.o.userData.cDropScale.value=r.dropScale==null?1:r.dropScale;}
    [vb,tb].forEach(function(b){if(b){b.mesh.instanceMatrix.array.set(b.original);b.mesh.instanceMatrix.needsUpdate=true;}});
    var f=current;f.time=0;f.brainMatrix.identity();f.brainScale=1;f.brainTranslateY=0;f.brainYaw=0;
    f.brainKeyGain=f.vatCoreGain=f.neonSpillGain=f.nozzleGain=f.brainEmissionGain=f.columnGain=f.crownPuffGain=f.hologramOpacity=f.localLEDGain=1;f.splashPulse=0;
    for(j=0;j<6;j++){f.dropScale[j]=1;f.dropRadius[j]=dropRest[j].radius;}
    if(api.setSignals)api.setSignals(f);return f;
  }
  return {apply:apply,reset:reset,state:function(t){return evaluate(t,frame());},spec:spec,seed:(opts.seed==null?spec.defaultSeed:opts.seed)>>>0,source:{nozzleTip:nozzleTip,fittingTop:fitTop,dropRest:dropRest.map(function(d){return {name:d.name,centre:d.centre.slice(),radius:d.radius};}),vatSeeds:vb?vb.seeds:null,tankSeeds:tb?tb.seeds:null},dispose:reset};
}

// c optics: one shared source-energy state for all passes, no extra RAF/targets/assets.
// Called by the integration owner's cPrepare / absolute-time motion callback.
var cOpticsState={ready:false,latest:null,attached:[],materials:Object.create(null),lights:Object.create(null),materialEntries:[],lightEntries:[],
  pointGain:{value:new T.Vector4(1,1,1,1)},coreGain:{value:1},neonGain:{value:1},hologram:{value:1}};
function cOpticsReplace(text,oldText,newText,label){
  var n=text.split(oldText).length-1;if(n!==1)throw Error('c optics '+label+': expected 1 match, found '+n);
  return text.replace(oldText,newText);
}
function cOpticsUniforms(sh){
  sh.uniforms.cOpticsPointGain=cOpticsState.pointGain;
  sh.uniforms.cOpticsCoreGain=cOpticsState.coreGain;
  sh.uniforms.cOpticsNeonGain=cOpticsState.neonGain;
  sh.uniforms.cOpticsHologram=cOpticsState.hologram;
  sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'#include <common>','#include <common>\nuniform vec4 cOpticsPointGain;uniform float cOpticsCoreGain;uniform float cOpticsNeonGain;uniform float cOpticsHologram;','shared uniforms');
}
var C_OPTICS_BRAIN_GLSL=`
varying vec3 vCOpticsRestPosition;
varying vec3 vCOpticsRestNormal;
varying vec3 vCOpticsCurrentNormalWorld;
// Scene-linear Lambert estimate of the four actual source point lights. The
// adopted received bake includes SSS/indirect/shadows and cannot be decomposed
// exactly after baking. Only a bounded source-point-attributable part responds.
vec3 cOpticsPointDiffuse(vec3 p,vec3 n,vec4 gain){
 vec3 sum=vec3(0.0);
 for(int ci=0;ci<4;ci++){
  vec3 lp=ci==0?vec3(.32,.33,.34):(ci==1?vec3(-.26,-.23,-.30):(ci==2?vec3(0,-2.3,0):vec3(0,.73,0)));
  vec3 lc=ci==0?vec3(1,.760524511,.854992628):(ci==1?vec3(1,.266355604,.479320168):(ci==2?vec3(0,.723055124,.577580452):vec3(1,.001517635,.391572475)));
  float energy=ci==0?18.0:(ci==1?6.0:(ci==2?16.0:26.0));
  float g=ci==0?gain.x:(ci==1?gain.y:(ci==2?gain.z:gain.w));
  float radius=ci==3?.16:.12;vec3 delta=lp-p;float d2=dot(delta,delta);
  vec3 wi=delta*inversesqrt(max(d2,1e-12));
  sum+=lc*(energy*g/(39.4784176044*max(d2,radius*radius)))*max(0.0,dot(n,wi));
 }
 return sum;
}
vec3 cOpticsReceived(vec3 referenceRGB,vec3 albedo,vec3 currentPosition,vec3 currentNormal){
 vec3 referenceDirect=cOpticsPointDiffuse(vCOpticsRestPosition,normalize(vCOpticsRestNormal),vec4(1.0))*albedo;
 vec3 currentDirect=cOpticsPointDiffuse(currentPosition,currentNormal,cOpticsPointGain)*albedo;
 // Weight is <=1 and removes no more than the reference bake contains. Rest
 // matrices + unit gains give referenceRGB identically. Albedo is used only in
 // estimating the changed direct term, never multiplied into the whole bake.
 vec3 weight=clamp(referenceRGB/max(referenceDirect,vec3(1e-6)),0.0,1.0)*step(vec3(1e-6),referenceDirect);
 return max(vec3(0.0),referenceRGB+weight*(currentDirect-referenceDirect));
}
`;
function cOpticsAttach(mesh,sourceName){
  if(!mesh||!mesh.material)return;
  var m=mesh.material;if(m.userData.cOpticsAttached)return;
  var brain=/^mesh11[012]$/.test(sourceName),vat=sourceName==='culture-liquid',tank=sourceName==='tank-milk'||sourceName==='mesh187'||sourceName==='mesh192',neon=sourceName==='mesh198';
  if(!brain&&!vat&&!tank&&!neon)return;
  var before=m.onBeforeCompile,key=m.customProgramCacheKey;
  m.onBeforeCompile=function(sh){
    before(sh);
    if(brain){
      sh.vertexShader=cOpticsReplace(sh.vertexShader,'#include <common>','#include <common>\nvarying vec3 vCOpticsRestPosition;varying vec3 vCOpticsRestNormal;varying vec3 vCOpticsCurrentNormalWorld;','brain varying declarations');
      sh.vertexShader=cOpticsReplace(sh.vertexShader,'#include <begin_vertex>','#include <begin_vertex>\nvCOpticsRestPosition=position;vCOpticsRestNormal=normal;vCOpticsCurrentNormalWorld=(modelMatrix*vec4(normal,0.0)).xyz;','brain rest-space contract');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'#include <common>','#include <common>\n'+C_OPTICS_BRAIN_GLSL,'brain response functions');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'outgoingLight=vR3BrainReceived+reflectedLight.directSpecular+reflectedLight.indirectSpecular+totalEmissiveRadiance;',
        'vec3 cCurrentN=normalize(vCOpticsCurrentNormalWorld);outgoingLight=cOpticsReceived(vR3BrainReceived,diffuseColor.rgb,vB3World,cCurrentN)+reflectedLight.directSpecular+reflectedLight.indirectSpecular+totalEmissiveRadiance;','brain bounded local response');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'vec3(sin(vB3World.y*830.0),sin(vB3World.z*790.0),sin(vB3World.x*910.0))','vec3(sin(vCOpticsRestPosition.y*830.0),sin(vCOpticsRestPosition.z*790.0),sin(vCOpticsRestPosition.x*910.0))','brain microdetail anchor');
    }
    if(vat){
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'float power=li==0?18.0:(li==1?6.0:26.0),radius=',
        'float power=li==0?18.0*cOpticsPointGain.x:(li==1?6.0*cOpticsPointGain.y:26.0*cOpticsPointGain.w),radius=','vat point energy');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'(19.0/(3.141592654*4.0))','(19.0*cOpticsCoreGain/(3.141592654*4.0))','vat disk energy');
    }
    if(tank){
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'(540.0/(3.141592654*8.0))','(540.0*cOpticsNeonGain/(3.141592654*8.0))','tank area energy');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'float power=li==0?18.0:(li==1?6.0:(li==2?16.0:26.0));',
        'float power=li==0?18.0*cOpticsPointGain.x:(li==1?6.0*cOpticsPointGain.y:(li==2?16.0*cOpticsPointGain.z:26.0*cOpticsPointGain.w));','tank point energy');
    }
    if(neon){
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'diffuseColor.a=max(b2C,b2G);','diffuseColor.a=max(b2C,b2G)*cOpticsHologram;','neon opacity');
      sh.fragmentShader=cOpticsReplace(sh.fragmentShader,'totalEmissiveRadiance*=b2E/max(diffuseColor.a,0.001);','totalEmissiveRadiance*=b2E/max(max(b2C,b2G),0.001);','neon avoids opacity cancellation');
    }
    // Insert last at the common anchor so these declarations precede every
    // helper inserted at the same anchor, including cOpticsReceived above.
    cOpticsUniforms(sh);
  };
  m.customProgramCacheKey=function(){return key.call(m)+'-c-source-optics-'+sourceName;};
  m.userData.cOpticsAttached={source:sourceName,brainResponse:brain?'bounded reference-point diffuse delta; fixed SSS/occlusion residual':null};
  m.needsUpdate=true;cOpticsState.attached.push(sourceName);
}
function cInitOptics(options){
  if(cOpticsState.ready)throw Error('c optics init called twice');
  var bySource=options.bySource,scene=options.scene;
  ['mesh110','mesh111','mesh112','culture-liquid','tank-milk','mesh187','mesh192','mesh198'].forEach(function(n){
    if(!bySource[n])throw Error('c optics missing source '+n);cOpticsAttach(bySource[n],n);
  });
  var roles={mesh110:'brainEmissionGain',mesh111:'brainEmissionGain',mesh112:'brainEmissionGain',mesh109:'columnGain',mesh114:'crownPuffGain',mesh170:'nozzleGain',mesh172:'nozzleGain',mesh174:'nozzleGain'};
  Object.keys(roles).forEach(function(n){var o=bySource[n];if(!o)throw Error('c optics missing animated material '+n);var prop=(n==='mesh109'||n==='mesh114')?'opacity':'emissiveIntensity';cOpticsState.materials[n]={material:o.material,property:prop,base:o.material[prop],signal:roles[n]};cOpticsState.materialEntries.push(cOpticsState.materials[n]);});
  var brainKey=scene.getObjectByName('brain-key');if(!brainKey||!Number.isFinite(brainKey.intensity))throw Error('c optics missing brain-key');
  cOpticsState.lights.brainKey={light:brainKey,base:brainKey.intensity,signal:'brainKeyGain'};cOpticsState.lightEntries.push(cOpticsState.lights.brainKey);
  cOpticsState.ready=true;
  if(cOpticsState.latest)cApplyOpticalSignals(cOpticsState.latest);
}
function cOpticsSignal(s,key){var x=s[key];if(!Number.isFinite(x)||x<0)throw Error('Invalid c optics signal '+key);return x;}
function cApplyOpticalSignals(s){
  cOpticsState.latest=s;if(!cOpticsState.ready)return;
  var key=cOpticsSignal(s,'brainKeyGain'),core=cOpticsSignal(s,'vatCoreGain'),neon=cOpticsSignal(s,'neonSpillGain'),holo=cOpticsSignal(s,'hologramOpacity');
  if(holo>1)throw Error('Invalid hologram opacity');
  cOpticsState.pointGain.value.set(key,1,1,1);cOpticsState.coreGain.value=core;cOpticsState.neonGain.value=neon;cOpticsState.hologram.value=holo;
  // Update source objects once, before the multipass render. Do not advance time
  // or update signals from an onBeforeRender callback (it runs once per pass).
  for(var i=0;i<cOpticsState.materialEntries.length;i++){var e=cOpticsState.materialEntries[i];e.material[e.property]=e.base*cOpticsSignal(s,e.signal);}
  for(var j=0;j<cOpticsState.lightEntries.length;j++){var l=cOpticsState.lightEntries[j];l.light.intensity=l.base*cOpticsSignal(s,l.signal);}
}
function cOpticsReport(){
 return {ready:cOpticsState.ready,attached:cOpticsState.attached.slice(),pointGain:cOpticsState.pointGain.value.toArray(),coreGain:cOpticsState.coreGain.value,neonGain:cOpticsState.neonGain.value,hologramOpacity:cOpticsState.hologram.value,
  referenceResponse:'Rest matrices and source unit gains preserve received RGB; moving light/direct component correction only',
  fixedApproximation:'brain baked SSS/indirect and32x48x32 visibility; HDR indirect field. No whole-mask warp or whole-probe pulse.',
  gpuVerified:false};
}

function frame(now){
  cFrameHandle=0;if(document.hidden||cPageAway)return;
  cFrameHandle=requestAnimationFrame(frame);
  if(!ready)return;
  if(cClock.playing()||needsRender||bench||(window.LactoCortexUI&&window.LactoCortexUI.busy())){
    var start=performance.now();
    if(cMotion&&cMotionEnabled)cMotion.apply(cClock.time(now));
    cFeedTick(cClock.time(now));
    needsRender=false;renderer.render(scene,camera);
    cLastFrameMs=performance.now()-start;cFrames++;cFrameCosts.push(cLastFrameMs);if(cFrameCosts.length>120)cFrameCosts.shift();
    stats.calls=renderer.info.render.calls;stats.triangles=renderer.info.render.triangles;
    if(window.LactoCortexUI&&window.LactoCortexUI.afterRender)window.LactoCortexUI.afterRender(now);
  }
}
function nanSweep(){
  var bad=0,checked=0,i,a;
  scene.traverse(function(o){
    if(o.geometry&&o.geometry.attributes){['position','uv','uv2'].forEach(function(k){var at=o.geometry.attributes[k];if(!at)return;a=at.array;for(i=0;i<a.length;i++){if(!isFinite(a[i]))bad++;}checked+=a.length;});}
    if(o.isInstancedMesh){a=o.instanceMatrix.array;for(i=0;i<a.length;i++){if(!isFinite(a[i]))bad++;}checked+=a.length;}
  });
  return {nonFinite:bad,checked:checked};
}
function readPixels(){
  var gl=renderer.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,px=new Uint8Array(w*h*4);
  renderer.render(scene,camera);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,px);return {w:w,h:h,px:px};
}
function maskBox(){
  var r=readPixels(),w=r.w,h=r.h,px=r.px,x0=w,x1=-1,y0=h,y1=-1,x,y;
  for(y=0;y<h;y++)for(x=0;x<w;x++){if(px[(y*w+x)*4]>127){if(x<x0)x0=x;if(x>x1)x1=x;var yy=h-1-y;if(yy<y0)y0=yy;if(yy>y1)y1=yy;}}
  return {width:w,height:h,left:x0/w,right:(x1+1)/w,top:y0/h,bottom:(y1+1)/h};
}
// 窓の平均（sRGB 0..1 の平均 → HSV）。box は base（1440×900 / 390×844）の画素座標
function windows(list,base){
  var r=readPixels(),sx=r.w/base[0],sy=r.h/base[1];
  return list.map(function(b){
    var x0=Math.round(b[1]*sx),x1=Math.round(b[2]*sx),y0=Math.round(b[3]*sy),y1=Math.round(b[4]*sy),R=0,G=0,B=0,n=0,x,y,k;
    for(y=y0;y<y1;y++)for(x=x0;x<x1;x++){k=((r.h-1-y)*r.w+x)*4;R+=r.px[k];G+=r.px[k+1];B+=r.px[k+2];n++;}
    R/=n*255;G/=n*255;B/=n*255;var mx=Math.max(R,G,B),mn=Math.min(R,G,B),d=mx-mn,hh=0;
    if(d>1e-12){if(mx===R)hh=(60*((G-B)/d)+360)%360;else if(mx===G)hh=60*((B-R)/d)+120;else hh=60*((R-G)/d)+240;}
    return {name:b[0],hue:+hh.toFixed(1),sat:+(mx>0?d/mx:0).toFixed(3),value:+mx.toFixed(4)};
  });
}
function init(){
  renderer=new T.WebGLRenderer({antialias:false,preserveDrawingBuffer:review});
  renderer.physicallyCorrectLights=true;renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=B1.exposure;
  renderer.setClearColor(mask?0x000000:0x0b0a0d,1);
  stage.appendChild(renderer.domElement);
  scene=new T.Scene();camera=new T.PerspectiveCamera(42,innerWidth/Math.max(1,innerHeight),.05,60);
  resize();controls();cResume();
  Promise.all([response(PG+'geo.json','json'),parts(PG+'geo',4),
    partsTexture(P+'lm-building',4,T.sRGBEncoding,'image/png'),texture(P+'lm-machine.png',T.sRGBEncoding),response(P+'r3-environment.bin','bin'),response(P+'r3-lighting.json','json'),
    texture(P+'s6b2-tex-neon.png',T.sRGBEncoding),texture(P+'s6b2-tex-ring-u.png',T.sRGBEncoding),texture(P+'s6b2-tex-ring-l.png',T.sRGBEncoding),texture(P+'s6b2-tex-lcd.png',T.sRGBEncoding),texture(P+'s6b2-tex-tag.png',T.sRGBEncoding),response(P+'s6b3-aperture.bin','bin'),response(P+'r3-vat-probe.bin','bin'),texture(P+'r3-room-logo.png',T.sRGBEncoding),texture(P+'r3-agx-lut.png',T.LinearEncoding),response(P+'r3-cameras.json','json'),response(P+'r3-logo-probe.bin','bin'),texture(P+'r3-vat-visibility.png',T.LinearEncoding),response(P+'r3-brain-received.bin','bin'),response(P+'r3-tank-probe.bin','bin')]).then(function(data){
    doc=data[0];Object.assign(doc.cameras.blender,data[15].blender);buffer=data[1];b3Aperture=data[11];if(b3Aperture.byteLength!==102220)throw Error('Brain aperture size mismatch');
    if(buffer.byteLength!==doc.binBytes)throw Error('Geometry size mismatch');
    tex.building=data[2];tex.machine=data[3];tex.logo=data[13];
    ['neon','ringUpper','ringLower','lcd','tag'].forEach(function(k,i){var t=data[i+6];tex[k]=t;t.name='source-'+k;t.flipY=true;t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.minFilter=t.magFilter=T.LinearFilter;t.generateMipmaps=false;});
    var pm=new T.PMREMGenerator(renderer),meta=data[5];
    envMap=r3HDR(data[4],meta.environment.width,meta.environment.height,'r3 environment',pm);
    r3DisplayTransform(data[14]);b3Env=r3HDR(data[12],meta.vat.width,meta.vat.height,'r3 vat',pm);R3.logoEnv=r3HDR(data[16],512,256,'r3 logo-local',pm);R3.tankEnv=r3HDR(data[data.length-1],512,256,'r3 tank-local',pm);pm.dispose();R3.brainReceived=data[18];if(R3.brainReceived.byteLength!==306660)throw Error('Brain received-light size mismatch');R3.vatVisibility=data[17];R3.vatVisibility.name='source-geometry-volume-visibility';R3.vatVisibility.flipY=false;R3.vatVisibility.generateMipmaps=false;R3.vatVisibility.minFilter=R3.vatVisibility.magFilter=T.LinearFilter;R3.vatVisibility.needsUpdate=true;
    if(query.has('normal-before')){var old=doc.diagnostic_meshes[0];doc.meshes=doc.meshes.map(function(d){return d.name==='mesh99'?Object.assign({},d,old,{name:'mesh99'}):d;});}
    b3InitPipeline();build();lights();makeViews();
    var start=parseInt(query.get('view')||'1',10);setView(isFinite(start)?clamp(start,1,10)-1:0);
    ready=true;cPrepare();needsRender=true;document.documentElement.dataset.ready='1';R3.loadedMs=performance.now()-R3.loadStart;var status=document.getElementById('viewer-status');if(status)status.hidden=true;
    if(review||query.has('audit')){
      window.__v10a={
        animation:cReport,
        setPlaying:cSetPlaying,
        seek:function(t){cClock.seek(t,performance.now());if(cMotion&&cMotionEnabled)cMotion.apply(t);needsRender=true;return cReport();},
        audit:{R3:R3,scene:scene,camera:camera,doc:doc,buffer:buffer,geometry:geometry,renderer:renderer,textures:tex,B2:B2,B3:B3,b3RT:b3RT,b3CompositeRT:b3CompositeRT,r3FloorRT:r3FloorRT,r3BaseRT:r3BaseRT,renderFrame:function(){renderer.render(scene,camera);},groups:groups,instanced:instanced},
        views:views.map(function(v){return v.name;}),
        setView:function(i){setView(i);renderer.render(scene,camera);stats.calls=renderer.info.render.calls;stats.triangles=renderer.info.render.triangles;return {view:i,fov:camera.fov,position:camera.position.toArray()};},
        stats:function(){renderer.render(scene,camera);return {calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs.length,groups:groups.length,instanced:instanced.length,baked:baked.length,pixelRatio:renderer.getPixelRatio(),size:[innerWidth,innerHeight]};},
        nanSweep:nanSweep,maskBox:maskBox,windows:windows,
        tune:function(o){if(o){['exposure','lm','env','lmSpec','ring'].forEach(function(k){if(o[k]!=null)B1[k]=o[k];});if(o.roles)Object.keys(o.roles).forEach(function(r){var s=o.roles[r];B1.roles[r]=B1.roles[r]||{color:[.2,.2,.2],metalness:0,roughness:.6,lm:1,env:1};Object.keys(s).forEach(function(k){B1.roles[r][k]=s[k];});});}applyTune();renderer.render(scene,camera);return JSON.parse(JSON.stringify(B1));},
        capture:function(){renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');}
      };
      document.documentElement.setAttribute('data-ready','1');
    }
  }).catch(r3Fail);
  window.addEventListener('resize',resize);
  renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();r3Fail('WebGLの描画が中断されました');});
}
try{init();}catch(e){r3Fail(e);}
}());
