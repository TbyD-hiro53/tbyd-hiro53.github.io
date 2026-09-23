/* Sanctum v6 — w7（w1→w2 make_w2.py … w5→w6 make_w6.py、w6→w7 make_w7.py：正本 s8 に合わせた室の照度・石の艶・映り込み）. 光学ガラスの環に三条の光を封じ、円形の室の中央に据える。
 * three.js r128 / 作品スクリプトは単一 IIFE / 同一サイトの資産のみ。
 * 室と金物の造形は Blender（sanctum-v6-s5.blend）、照度・環境は s8 から。光条・火花・ガラス・映り込みは実時間。
 *
 * 描画の順
 *   R0/R1  床（y=0）と基壇天面（y=0.32）の鏡像を半解像度で描く
 *   A      室・金物・ガラスの奥の壁・光条・火花 → rtA
 *   B      rtA を写し、手前のガラスを rtA の屈折＋映り込みで重ねる → rtB
 *   C      rtB から光のにじみ（Blender 後段 post_bloom.py と同じ閾値・重み）
 *   D      合成して AgX Medium High Contrast の表（Blender で作成）で表示値へ
 */
(function(){'use strict';
var T=window.THREE,P='sanctum-v6-w1-',P7='sanctum-v6-w7-';   /* 立体・AgX 表は w1、照度と環境は w7（s8 で焼き直し） */
var stage=document.getElementById('stage');
var query=new URLSearchParams(location.search);

/* ---------------------------------------------------------------- 寸法（Blender と同じ。three は y が上） */
var TOR={y:1.08,R:1.10,ro:0.340,ri:0.302,rs:0.200,q:3};
var ROOM={r:5.6,h:4.4,daisR:1.55,daisH:0.32};
var TAU=Math.PI*2;
var ENC_E=1/1024,ENC_M=64;                     // 焼き込み・環境の対数符号化（export_web.py と同じ）
function lin(c){return c.map(function(x){return x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);});}
var STRANDS=[
  {glow:lin([1.00,0.020,0.39]),core:lin([1.00,0.85,0.95])},
  {glow:lin([0.95,0.86,0.91]),core:lin([1.00,1.00,1.00])},
  {glow:lin([0.00,0.87,0.78]),core:lin([0.87,1.00,0.98])}
];
/* 光束：一条ごとに細めの三本が束の断面で横一列に並ぶ（間隔 gap）。三本を淡い気体（haze）が包む。
 * 各本は自分の軸方向へ速く流れる：波数 k の光の粒が speed 周/秒で進み、頭が明るく尾を引く（decay）。
 * 三本は速さと位相を少しずつ違える。包絡 巻き 0.200 と 横ずれ 0.048 → 0.206 + 光 0.030 + 蛇行 0.017 < 内半径 0.302 */
var LANE={gap:0.056,core:{r:0.018,s:13.0},glow:{r:0.040,s:9.0},haze:{r:0.095,s:1.1},
  /* 9 本（3 束 × 3 本）すべて違う速さ（周/秒、時間の進みの半分がさらに掛かる → 実際は 0.36〜0.50 周/秒） */
  speed:[0.80,0.95,0.87, 0.91,0.76,0.99, 0.84,0.93,0.72],k:[7,9,8],decay:5.0,
  /* 揺らぎ：三本は横一列に揃わず、束の中で不規則に揺らぐ。横 ±約 31 mm・縦 ±約 34 mm。
   * 周方向の波数は整数なので一周で途切れない。管の内壁（0.302）から 6 mm 手前で止める */
  wob:{side:0.024,up:0.026},wall:0.296};
/* 時間の進み（1 = 実時間）。光の粒・揺らぎ・環の回転・火花・蛇行すべてに掛かる */
var TIME_SCALE=0.5;
/* 光条の明るさの倍率（w7：正本 s8 の Cycles とガラスなしで同じ窓を測って合わせた） */
var STRAND_GAIN=0.87;
var SPARKS_PER=query.has('lite')?500:1100;

/* ---------------------------------------------------------------- 視点（Blender のカメラ。焦点距離は 36 mm 幅基準） */
function bl(v){return [v[0],v[2],-v[1]];}
var VIEW_DEFS=[
  {key:'room',  name:'全景',  pos:bl([0.00,-5.30,1.65]),tgt:bl([0,0,1.25]),     lens:22,portrait:1.00,lift:0.10},
  {key:'hall',  name:'斜め',  pos:bl([4.20,-3.30,2.45]),tgt:bl([0,0,0.85]),     lens:35,portrait:1.00,lift:0.30},
  {key:'above', name:'真上',  pos:bl([1.20,-1.80,3.90]),tgt:bl([0,0,0.90]),     lens:30,portrait:1.05,lift:0.25},
  {key:'ring',  name:'環',    pos:bl([2.35,-2.55,1.62]),tgt:bl([0.62,-0.62,1.02]),lens:50,portrait:1.20,lift:0.10},
  {key:'saddle',name:'受け',  pos:bl([1.95,-1.55,0.62]),tgt:bl([0.953,-0.55,0.70]),lens:85,portrait:1.25,lift:0.05}
];

/* ---------------------------------------------------------------- 状態 */
var renderer,camera,sceneA,sceneB,sceneBloom,quadCam,views=[],viewIndex=1,ready=false,needsRender=true;
var target=new T.Vector3(),theta=0,phi=1.2,radius=5,lens=35,portraitScale=1;
var pointers={},pinchStart=0,pinchRadius=0,userMoved=false;
var rtA,rtB,rtR0,rtR1,bloomRT=[],size=new T.Vector2(),pr=1;
var U={time:{value:0},clipY:{value:-1e3},beat:{value:0}};
var roomMat,partsMat,backGlassMat,frontGlassMat,copyMat,depthMat,bloomPre,bloomDown,finalMat;
var strandObjs=[],sparkObjs=[],backGlass,frontGlass,roomMesh,partsMesh,plasma;
var mirrorCam=new T.PerspectiveCamera(),texMat0=new T.Matrix4(),texMat1=new T.Matrix4();
var black=null,playing=true,clock={t:0,last:0,rate:1};
var frameHandle=0,pageAway=false,stats={frames:0,ms:[]};
/* 計測表示（?diag）。&off=ui,mirror,glass,strands,bloom で部分を止めて比べる。?diag=gpu は GPU の完了待ちも測る */
var DIAG={on:query.has('diag'),gpu:query.get('diag')==='gpu',off:(query.get('off')||'').split(','),el:null,t0:0,frames:0,gaps:[],cpu:[],ui:[],gpuMs:[],resizes:0,resizeEvents:0,vv:0,
  uiMode:query.get('ui')||'',uiEvery:query.get('ui')==='every4'?4:query.get('ui')==='every2'?2:1,uiN:0,cap:[],draw:[],uiCalls:0};
function diagOff(k){return DIAG.off.indexOf(k)>=0;}
function diagTick(now,gap,cpu,ui,gpu){
  if(!DIAG.on)return;DIAG.frames++;if(gap>0)DIAG.gaps.push(gap);DIAG.cpu.push(cpu);DIAG.ui.push(ui);if(gpu>=0)DIAG.gpuMs.push(gpu);
  if(!DIAG.t0)DIAG.t0=now;if(now-DIAG.t0<1000)return;
  function med(a){if(!a.length)return 0;var b=a.slice().sort(function(x,y){return x-y;});return b[b.length>>1];}
  function p90(a){if(!a.length)return 0;var b=a.slice().sort(function(x,y){return x-y;});return b[Math.floor(b.length*0.9)];}
  if(!DIAG.el){DIAG.el=document.createElement('pre');DIAG.el.style.cssText='position:fixed;left:50%;top:calc(64px + env(safe-area-inset-top));transform:translateX(-50%);z-index:2147483000;margin:0;padding:6px 9px;border-radius:8px;background:#000c;color:#b7fff2;font:10px/1.45 ui-monospace,Menlo,monospace;pointer-events:none;white-space:pre';document.body.appendChild(DIAG.el);}
  var fps=DIAG.frames*1000/(now-DIAG.t0);
  DIAG.el.textContent='fps '+fps.toFixed(1)+'  gap '+med(DIAG.gaps).toFixed(1)+'/'+p90(DIAG.gaps).toFixed(1)+' ms (med/p90)\n'+
    'cpu '+med(DIAG.cpu).toFixed(2)+'  ui '+med(DIAG.ui).toFixed(2)+(DIAG.gpuMs.length?'  gpu '+med(DIAG.gpuMs).toFixed(1):'')+' ms\n'+
    'view '+(views[viewIndex]&&views[viewIndex].key)+'  q '+quality.scale.toFixed(2)+'  buf '+size.x+'x'+size.y+'\n'+
    'resize ev '+DIAG.resizeEvents+' / applied '+DIAG.resizes+'  vv '+DIAG.vv+(DIAG.off[0]?'  off '+DIAG.off.join(','):'')+'\n'+
    'ui cap '+med(DIAG.cap).toFixed(2)+'  draw '+med(DIAG.draw).toFixed(2)+'  calls '+DIAG.uiCalls+(DIAG.uiMode?'  ui='+DIAG.uiMode:'')+'\n'+
    'ih '+innerHeight+'  cv '+renderer.domElement.width+'x'+renderer.domElement.height+'  ov '+diagOverlay();
  DIAG.t0=now;DIAG.frames=0;DIAG.gaps=[];DIAG.cpu=[];DIAG.ui=[];DIAG.gpuMs=[];DIAG.cap=[];DIAG.draw=[];DIAG.uiCalls=0;
}
function diagOverlay(){var c=window.__composerLiquid,o=c&&c.host&&c.host.overlay;return o?(o.width+'x'+o.height+(o.hidden?' hidden':'')):'-';}
function diagUI(){var c=window.__composerLiquid,op=c&&c.host&&c.host.optics;if(!op)return;DIAG.cap.push(op.lastCaptureMs||0);DIAG.draw.push(op.lastDrawMs||0);}
/* 共有 UI を今回呼ぶか（&ui=every2/4 のときだけ間引く。UI が押下・開閉の動きの最中なら毎回） */
function uiDue(){if(DIAG.uiEvery===1)return true;var busy=window.SanctumUI&&window.SanctumUI.busy&&window.SanctumUI.busy();DIAG.uiN=(DIAG.uiN+1)%DIAG.uiEvery;return busy||DIAG.uiN===0;}
if(DIAG.on&&window.visualViewport){visualViewport.addEventListener('resize',function(){DIAG.vv++;});visualViewport.addEventListener('scroll',function(){DIAG.vv++;});}

/* 描画解像度の自動調整：再生中のフレーム間隔を 1 秒ごとに見て、中央値が 34 ms を超えたら 0.8 倍、
 * 18 ms 未満なら 1.12 倍（上限 1）。視点を替えて重くなっても 1〜2 秒で追いつく。
 * iPhone の低電力モード（30 fps = 33 ms 固定）では下げない */
var quality={scale:1,gaps:[],t0:0,last:0};

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function status(msg){var s=document.getElementById('viewer-status');if(s){s.hidden=!msg;if(msg)s.textContent=msg;}}
function fail(msg){var e=document.getElementById('viewer-error'),s=document.getElementById('viewer-status');if(s)s.hidden=true;if(e){e.hidden=false;e.textContent=msg;}document.documentElement.setAttribute('data-error',msg);}

/* ---------------------------------------------------------------- 読み込み */
function fetchBin(url){return fetch(url).then(function(r){if(!r.ok)throw Error(url+' '+r.status);return r.arrayBuffer();});}
function fetchJSON(url){return fetch(url).then(function(r){if(!r.ok)throw Error(url+' '+r.status);return r.json();});}
function loadTex(url,opt){
  return new Promise(function(res,rej){
    new T.TextureLoader().load(url,function(t){
      t.encoding=T.LinearEncoding;t.flipY=opt&&opt.flipY===false?false:true;
      t.generateMipmaps=!!(opt&&opt.mips);t.minFilter=t.generateMipmaps?T.LinearMipmapLinearFilter:T.LinearFilter;t.magFilter=T.LinearFilter;
      if(opt&&opt.wrapS)t.wrapS=opt.wrapS;
      t.anisotropy=opt&&opt.aniso?Math.min(4,renderer.capabilities.getMaxAnisotropy()):1;
      t.needsUpdate=true;res(t);},undefined,function(){rej(Error(url));});
  });
}

/* ---------------------------------------------------------------- GLSL 共通 */
var GL_DECODE='const float ENC_E='+ENC_E.toFixed(8)+';const float ENC_L='+(Math.log2(1+ENC_M/ENC_E)).toFixed(6)+';\n'
 +'vec3 dec(vec3 v){return ENC_E*(exp2(v*ENC_L)-1.0);}\n';
/* 環境：Blender の正距円筒（画像中央 = blender +Y = three −Z、u=0.75 = +X、上端 = +Y） */
var GL_ENV='vec2 envUV(vec3 d){d=normalize(d);return vec2(0.5+atan(d.x,-d.z)/6.2831853,0.5+asin(clamp(d.y,-1.0,1.0))/3.1415927);}\n'
 +'vec3 envAt(sampler2D t,vec3 d,float bias){return dec(texture2D(t,envUV(d),bias).rgb);}\n'
 +'vec3 envLod(sampler2D t,vec3 d,float lod){return dec(texture2DLodEXT(t,envUV(d),lod).rgb);}\n';
var GL_NOISE=[
 'float h31(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}',
 'float vnoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);',
 ' return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),',
 '            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}',
 'float fbm(vec3 p,float g){float a=0.5,s=0.0,n=0.0;for(int i=0;i<4;i++){s+=a*vnoise(p);n+=a;p*=2.02;a*=g;}return s/n;}',
 /* 細い溝：距離 d が幅 w 以下で 1。画素の大きさでぼかしてちらつきを抑える */
 /* 画素が溝より大きいときは、画素に占める溝の割合（w/aa）まで濃さを落とす（斜めから見た面の偽の模様を防ぐ） */
 'float groove(float d,float w){float aa=max(fwidth(d),1e-5);return (1.0-smoothstep(w-aa,w+aa,d))*min(1.0,w/aa);}',
 'float pingpong(float a,float s){return s-abs(mod(a,2.0*s)-s);}'
].join('\n')+'\n';

/* ---------------------------------------------------------------- 室（焼き込み照度 × 石目と目地 ＋ 映り込み） */
function makeRoomMaterial(tex){
  return new T.ShaderMaterial({
    side:T.DoubleSide,extensions:{derivatives:true,shaderTextureLOD:true},
    uniforms:{tLM:{value:tex.lm},tR0:{value:null},tR1:{value:null},mR0:{value:texMat0},mR1:{value:texMat1},
      tEnv:{value:tex.envGlass},tEnvS:{value:tex.envSteel},clipY:U.clipY,uLM:{value:1.0},uRefl:{value:1.0},uDebug:{value:0},uCheap:{value:0},uRingCol:{value:ringColor()},
      /* 艶の強さ（正本 s8 の hero-hall を艶あり・艶なしで描き分けた差に合わせる）。g = [壁の室, 壁の光条, 床の室, 基壇側面] */
      uGloss:{value:new T.Vector4(5.0,2.0,0.5,0.5)},uFloorRing:{value:new T.Vector2(0.7,200.0)},uMirBlur:{value:1.3},uMirRes:{value:new T.Vector2(1,1)}},
    vertexShader:[
      'attribute float role;varying vec2 vUv;varying vec3 vW;varying vec3 vN;varying float vRole;',
      'void main(){vUv=uv;vRole=role;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);',
      ' gl_Position=projectionMatrix*viewMatrix*w;}'
    ].join('\n'),
    fragmentShader:[
      'uniform sampler2D tLM,tR0,tR1,tEnv,tEnvS;uniform mat4 mR0,mR1;uniform float clipY,uLM,uRefl;uniform int uDebug;uniform int uCheap;uniform vec3 uRingCol;uniform vec4 uGloss;uniform vec2 uFloorRing;uniform float uMirBlur;uniform vec2 uMirRes;',
      'varying vec2 vUv;varying vec3 vW;varying vec3 vN;varying float vRole;',
      GL_DECODE,GL_ENV,GL_NOISE,
      'vec3 lin3(vec3 c){return pow(c,vec3(2.2));}',
      /* 光条の束の艶：環の中心線を輪の光源とみなし、反射方向の周り ±0.9 rad を 12 点で取る（金物と同じ近似） */
      'vec3 ringGloss(vec3 R,float n){vec3 s=vec3(0.0);for(int k=0;k<16;k++){float a=float(k)*0.39269908;',
      ' vec3 L=vec3(cos(a)*'+TOR.R.toFixed(3)+','+TOR.y.toFixed(3)+',sin(a)*'+TOR.R.toFixed(3)+')-vW;float d2=max(dot(L,L),0.04);L*=inversesqrt(d2);',
      ' s+=uRingCol*pow(max(dot(R,L),0.0),n)*(n+2.0)/(6.2831853*d2);}return s*0.069*0.39269908/6.2831853;}',
      'vec3 ringSheen(vec3 R,float n){vec3 Q=vW;if(abs(R.y)>0.05){float t=('+TOR.y.toFixed(3)+'-vW.y)/R.y;if(t>0.0)Q=vW+R*t;}float a0=atan(Q.z,Q.x);vec3 s=vec3(0.0);',
      ' for(int k=0;k<12;k++){float a=a0+(float(k)/11.0-0.5)*1.8;vec3 L=vec3(cos(a)*'+TOR.R.toFixed(3)+','+TOR.y.toFixed(3)+',sin(a)*'+TOR.R.toFixed(3)+')-vW;',
      '  float d2=max(dot(L,L),0.04);L*=inversesqrt(d2);s+=uRingCol*pow(max(dot(R,L),0.0),n)*(n+2.0)/(6.2831853*d2);}',
      ' return s*0.069*(1.8/11.0)/6.2831853;}',
      /* 鏡像の標本：粗さに応じた半径 r（画面比）でぼかす。鏡像は縮小段（mip）を持つので、半径に見合う段から 9 点で取る */
      'vec3 mirror(sampler2D t,mat4 m,float rough){vec4 c=m*vec4(vW,1.0);vec2 uv=c.xy/c.w;',
      /* 研磨した石は完全な鏡ではない：面のわずかな波で映り込みが揺れる（数 cm 周期） */
      ' vec3 bw=vec3(vW.x,-vW.z,vW.y);uv+=(vec2(vnoise(bw*9.0),vnoise(bw*9.0+vec3(7.3,1.1,4.2)))-0.5)*0.006;',
      /* 光沢の広がりは粗さの二乗（GGX の α）に比例：床（0.06〜0.20）は大きくぼけ、基壇の本磨き（0.06）はほぼ鏡 */
      ' float r=0.0012+rough*rough*uMirBlur;float lod=max(0.0,log2(r*max(uMirRes.x,uMirRes.y)*0.35));vec2 ry=vec2(r,r*uMirRes.x/uMirRes.y);',
      ' vec3 s=texture2D(t,uv,lod).rgb*0.2;',
      ' s+=texture2D(t,uv+vec2( ry.x,0.0),lod).rgb*0.1;s+=texture2D(t,uv+vec2(-ry.x,0.0),lod).rgb*0.1;',
      ' s+=texture2D(t,uv+vec2(0.0, ry.y),lod).rgb*0.1;s+=texture2D(t,uv+vec2(0.0,-ry.y),lod).rgb*0.1;',
      ' s+=texture2D(t,uv+ry*vec2( 0.7, 0.7),lod).rgb*0.1;s+=texture2D(t,uv+ry*vec2(-0.7,-0.7),lod).rgb*0.1;',
      ' s+=texture2D(t,uv+ry*vec2( 0.7,-0.7),lod).rgb*0.1;s+=texture2D(t,uv+ry*vec2(-0.7, 0.7),lod).rgb*0.1;return s;}',
      /* 粗さのある面の Fresnel（縁の立ち上がりを粗さで鈍らせる） */
      'float fRough(float cosv,float rough){return 0.04+(max(1.0-rough,0.04)-0.04)*pow(1.0-cosv,5.0);}',
      'void main(){',
      ' if(vW.y<clipY)discard;',
      ' vec3 irr=dec(texture2D(tLM,vUv).rgb)*uLM;',
      /* 鏡像の中の室は、石目も映り込みも描かない（平均の色 × 照度） */
      ' if(uCheap==1){int rl=int(vRole+0.5);vec3 a=rl==0?vec3(0.018):rl==1?vec3(0.048):rl==4?vec3(0.0024):vec3(0.004);vec3 cc=a*irr;',
      '  if(rl==1){vec3 Vc=normalize(cameraPosition-vW);vec3 Nc=normalize(vN);if(dot(Nc,Vc)<0.0)Nc=-Nc;cc+=envLod(tEnv,reflect(-Vc,Nc),5.0)*fRough(clamp(dot(Nc,Vc),0.0,1.0),0.42)*uGloss.x;}',
      '  gl_FragColor=vec4(cc,1.0);return;}',
      ' vec3 b=vec3(vW.x,-vW.z,vW.y);',                 /* Blender の座標（石目・目地を Blender と同じ式で） */
      ' vec3 alb;float rough=0.5;float refl=0.0;int role=int(vRole+0.5);',
      ' vec3 V=normalize(cameraPosition-vW);vec3 N=normalize(vN);if(dot(N,V)<0.0)N=-N;',
      ' if(role==0){',                                   /* 床：黒御影の研磨 */
      '  float n=mix(0.53,0.53+0.6*(fbm(b*38.0,0.55)-0.5),1.0-smoothstep(0.25,0.9,fwidth(b.x*38.0)+fwidth(b.y*38.0)));alb=mix(vec3(0.0080,0.0077,0.0086),vec3(0.0330,0.0309,0.0320),smoothstep(0.42,0.70,n));',
      '  float r=length(b.xy);float jc=groove(pingpong(r-2.0,0.6),0.004);',
      '  float ang=atan(b.y,b.x)*24.0/6.2831853;float jr=groove(pingpong(ang,0.5)*6.2831853/24.0*r,0.004);',
      '  float j=max(jc,jr)*step('+(ROOM.daisR+0.05).toFixed(3)+',r);',
      '  alb=mix(alb,vec3(0.012),j);rough=mix(0.06,0.20,vnoise(b*1.6));rough=max(rough,0.7*j);refl=1.0-j*0.8;',
      ' }else if(role==1){',                             /* 壁・付柱：本磨きでない石 */
      '  float n=mix(0.55,0.55+0.38*(fbm(b*14.0,0.62)-0.5),1.0-smoothstep(0.25,0.9,length(fwidth(b*14.0))));alb=mix(vec3(0.0300,0.0280,0.0285),vec3(0.0730,0.0690,0.0690),smoothstep(0.35,0.75,n));',
      '  float ang=atan(b.y,b.x)*30.0/6.2831853;float jv=groove(pingpong(ang,0.5)*6.2831853/30.0*'+ROOM.r.toFixed(2)+',0.004);',
      '  float jh=groove(pingpong(b.z,0.55),0.003);alb*=1.0-0.22*max(jv,jh);rough=0.42;',
      ' }else if(role==2){alb=vec3(0.0050,0.0050,0.0052);',
      ' }else if(role==3){alb=vec3(0.0010);',
      ' }else{',                                         /* 基壇：黒御影の本磨き */
      '  alb=vec3(0.0022,0.0021,0.0025)*(0.8+0.4*fbm(b*30.0,0.5));rough=0.06;',
      '  refl=step(0.9,N.y)*step('+(ROOM.daisH-0.004).toFixed(3)+',vW.y);',
      ' }',
      ' vec3 col=alb*irr;',
      ' float cosv=clamp(dot(N,V),0.0,1.0);float F=0.04+0.96*pow(1.0-cosv,5.0);vec3 R=reflect(-V,N);float Fr=fRough(cosv,rough);',
      ' if(refl>0.0){',
      '  vec3 m=(role==0)?mirror(tR0,mR0,rough):mirror(tR1,mR1,rough);',
      '  col+=m*Fr*refl*uRefl;',
      /* 床：鏡像に入らない広がり（天井の円環灯・壁の明るさ）を、環境を粗さでぼかして足す */
      '  if(role==0)col+=(envLod(tEnv,R,2.0+rough*12.0)*uGloss.z+ringSheen(R,uFloorRing.y)*uFloorRing.x)*Fr*refl;',
      ' }else if(role==4){col+=(envAt(tEnvS,R,1.0)*uGloss.w+ringSheen(R,60.0))*F;}',
      /* 壁と付柱（本磨きでない石、粗さ 0.42）：室の映り込み（環境を大きくぼかす）＋光条の映り込み（輪の光源） */
      ' if(role==1)col+=(envLod(tEnv,R,5.0)*uGloss.x+ringGloss(R,24.0)*uGloss.y)*Fr;',
      ' if(uDebug==1)col=irr*0.2;else if(uDebug==2)col=alb*20.0;else if(uDebug==3)col=N*0.5+0.5;',
      ' gl_FragColor=vec4(col,1.0);}'
    ].join('\n')
  });
}

/* ---------------------------------------------------------------- 金物・当て材・天井の円環灯 */
/* 輪の光源の放射束：三条の芯と気体の発光を、中心線 1 m あたりの量に均して一つの色にする。
 * 倍率（0.069 = 1/(2πR)×単位換算）はシェーダ側。色の比だけをここで決める */
function ringColor(){var c=[0,0,0];STRANDS.forEach(function(s){for(var i=0;i<3;i++)c[i]+=(s.glow[i]*(3*LANE.glow.s*LANE.glow.r*2*0.62*0.6+LANE.haze.s*LANE.haze.r*2*0.6)+s.core[i]*3*LANE.core.s*LANE.core.r*3.0*0.6);});
  return new T.Vector3(c[0],c[1],c[2]).multiplyScalar(6.0);}
function makePartsMaterial(tex){
  return new T.ShaderMaterial({
    uniforms:{tEnv:{value:tex.envSteel},clipY:U.clipY,uRingCol:{value:ringColor()}},
    vertexShader:[
      'attribute float role;varying vec3 vW;varying vec3 vN;varying float vRole;',
      'void main(){vRole=role;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}'
    ].join('\n'),
    fragmentShader:[
      'uniform sampler2D tEnv;uniform float clipY;uniform vec3 uRingCol;varying vec3 vW;varying vec3 vN;varying float vRole;',
      GL_DECODE,GL_ENV,
      /* 光条の束を、管の中心線（半径 1.10・高さ 1.08）の輪の光源として近似する。
       受けは環から 0.35 m と近く、点が粗いと映り込みが縞に割れるので 64 点で取る */
      'vec3 ringP(float a){return vec3(cos(a)*'+TOR.R.toFixed(3)+','+TOR.y.toFixed(3)+',sin(a)*'+TOR.R.toFixed(3)+');}',
      'void ringLight(vec3 N,vec3 R,float n,out vec3 spec,out vec3 diff){spec=vec3(0.0);diff=vec3(0.0);',
      ' vec3 Q=vW;if(abs(R.y)>0.05){float t=('+TOR.y.toFixed(3)+'-vW.y)/R.y;if(t>0.0)Q=vW+R*t;}float a0=atan(Q.z,Q.x);',
      ' for(int k=0;k<24;k++){float a=a0+(float(k)/23.0-0.5)*1.2;vec3 L=ringP(a)-vW;',
      '  float d2=max(dot(L,L),0.04);L*=inversesqrt(d2);spec+=uRingCol*pow(max(dot(R,L),0.0),n)*(n+2.0)/(6.2831853*d2);}',
      ' float an=atan(vW.z,vW.x);',
      ' for(int k=0;k<16;k++){vec3 L=ringP(an+(float(k)/15.0-0.5)*3.2)-vW;float d2=max(dot(L,L),0.04);L*=inversesqrt(d2);diff+=uRingCol*max(dot(N,L),0.0)/d2;}',
      ' spec*=0.069*(1.2/23.0)/6.2831853;diff*=0.069*(3.2/15.0)/6.2831853/3.1415927;}',
      'void main(){if(vW.y<clipY)discard;int role=int(vRole+0.5);',
      ' vec3 V=normalize(cameraPosition-vW);vec3 N=normalize(vN);if(dot(N,V)<0.0)N=-N;',
      ' vec3 R=reflect(-V,N);float c=clamp(dot(N,V),0.0,1.0);vec3 col;vec3 rs,rd;',
      ' if(role==10||role==13){',                       /* ステンレス（ヘアライン / 鏡面） */
      '  vec3 base=vec3(0.34,0.34,0.36);if(role==13)base=vec3(0.30,0.30,0.32);',
      '  vec3 F=base+(1.0-base)*pow(1.0-c,5.0);',
      '  ringLight(N,R,role==13?160.0:14.0,rs,rd);col=(envAt(tEnv,R,role==13?0.5:1.0)*1.6+rs*2.5)*F;',
      ' }else if(role==11){',                           /* PTFE の当て材 */
      '  ringLight(N,R,20.0,rs,rd);float Fp=0.04+0.96*pow(1.0-c,5.0);col=vec3(0.64,0.60,0.56)*(envAt(tEnv,N,7.0)*0.9+rd)+(envAt(tEnv,R,3.0)*0.5+rs)*Fp;',
      ' }else{col=vec3(0.71,0.83,1.0)*9.0;}',          /* 円環灯 */
      ' gl_FragColor=vec4(col,1.0);}'
    ].join('\n')
  });
}

/* ---------------------------------------------------------------- ガラスの環 */
function torusGeometry(r,segU,segV){
  var g=new T.TorusGeometry(TOR.R,r,segV,segU);
  g.rotateX(Math.PI/2);g.translate(0,TOR.y,0);return g;
}
function makeBackGlassMaterial(tex){
  /* 奥の壁：光条の後ろにある面。映り込みだけを薄く重ねる */
  return new T.ShaderMaterial({
    side:T.BackSide,transparent:true,depthWrite:false,blending:T.CustomBlending,
    blendEquation:T.AddEquation,blendSrc:T.OneFactor,blendDst:T.OneMinusSrcAlphaFactor,
    uniforms:{tEnv:{value:tex.envGlass},clipY:U.clipY},
    vertexShader:'varying vec3 vW;varying vec3 vN;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:[
      'uniform sampler2D tEnv;uniform float clipY;varying vec3 vW;varying vec3 vN;',GL_DECODE,GL_ENV,
      'void main(){if(vW.y<clipY)discard;vec3 V=normalize(cameraPosition-vW);vec3 N=-normalize(vN);',
      ' float c=clamp(abs(dot(N,V)),0.0,1.0);float F=0.04+0.96*pow(1.0-c,5.0);',
      ' vec3 env=envAt(tEnv,reflect(-V,N),0.0);',
      ' gl_FragColor=vec4(env*F,F*0.35);}'
    ].join('\n')
  });
}
function makeFrontGlassMaterial(tex){
  /* 手前の壁：rtA を屈折で取り、映り込みを重ねる。
   * 厚い石英の二枚の面（外 0.340 / 内 0.302）を、ずらし量の違う二つの標本で近似する */
  return new T.ShaderMaterial({
    side:T.FrontSide,
    uniforms:{tScene:{value:null},tEnv:{value:tex.envGlass},uRes:{value:new T.Vector2(1,1)},uRefr:{value:0.008},uGl:{value:new T.Vector4(0.40,1.0,1.0,0.90)},uO2:{value:0.5}},
    vertexShader:'varying vec3 vW;varying vec3 vN;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:[
      'uniform sampler2D tScene,tEnv;uniform vec2 uRes;uniform float uRefr;uniform vec4 uGl;uniform float uO2;varying vec3 vW;varying vec3 vN;',GL_DECODE,GL_ENV,
      'void main(){vec3 V=normalize(cameraPosition-vW);vec3 N=normalize(vN);',
      ' float c=clamp(dot(N,V),0.0,1.0);float F=0.035+0.965*pow(1.0-c,5.0);',
      ' vec2 uv=gl_FragCoord.xy/uRes;vec3 nv=normalize((viewMatrix*vec4(N,0.0)).xyz);',
      /* 面の傾きが大きい縁ほど強く曲げる。縁では肉厚の内面を通った二つ目の像を重ねる */
      ' float g=1.0-c;float asp=uRes.y/max(uRes.x,uRes.y)+0.5;',
      /* 肉厚：視線が内壁（0.302）に触れない縁の帯（c < ri/ro 相当の 0.46）はガラスだけを通る。
       * そこでは曲がりが強く、わずかに色と濃さが乗る。内壁の輪郭は細い光の線になる */
      ' float wall=1.0-smoothstep(0.40,0.48,c);float rimLine=exp(-pow((c-0.46)/0.016,2.0));',
      ' vec2 o1=nv.xy*uRefr*g*asp*(1.0+0.9*wall);vec2 o2=nv.xy*uRefr*3.2*g*g*asp*uO2;',
      ' vec3 a;a.r=texture2D(tScene,uv-o1*1.00).r;a.g=texture2D(tScene,uv-o1*1.03).g;a.b=texture2D(tScene,uv-o1*1.06).b;',
      ' vec3 b2=texture2D(tScene,uv-o2).rgb;',
      ' vec3 refr=mix(a,b2,0.5*g*g);',
      ' vec3 env=envAt(tEnv,reflect(-V,N),0.0);',
      ' vec3 inner=texture2D(tScene,uv+nv.xy*uRefr*4.5*g*asp).rgb;',
      ' vec3 tint=mix(vec3(0.985,0.99,0.99),vec3(0.88,0.93,0.92),wall);',
      ' vec3 col=refr*(1.0-F)*tint*uGl.w+env*F*uGl.z+inner*F*uGl.x+rimLine*uGl.y*(env*0.5+inner*0.22+refr*0.10);',
      ' gl_FragColor=vec4(col,1.0);}'
    ].join('\n')
  });
}

/* ---------------------------------------------------------------- 光条（芯・気体二層）と火花 */
var GL_STRAND=[
 'uniform float uTime;uniform float uPh;uniform float uRs;uniform float uSpin;',
 'const float TR='+TOR.R.toFixed(4)+';const float TY='+TOR.y.toFixed(4)+';',
 /* 中心線（Blender strand_pts と同じ式。蛇行は時間でゆっくり泳ぐ） */
 'vec3 center(float u){float a=u*6.2831853+uSpin;float th=3.0*u*6.2831853+uPh;',
 ' float zx=sin(u*12.566371+uPh*1.7+uTime*0.31)*0.012+sin(u*31.415927+uTime*0.53)*0.005;',
 ' float zy=cos(u*18.849556+uPh*1.7+uTime*0.37)*0.011+cos(u*43.982297+uTime*0.61)*0.004;',
 ' float rr=TR+uRs*cos(th)+zx;return vec3(rr*cos(a),TY+uRs*sin(th)+zy,-rr*sin(a));}',
 'vec3 tubeC(vec3 p){vec2 h=normalize(p.xz);return vec3(h.x*TR,TY,h.y*TR);}'
].join('\n')+'\n';
function strandGeometry(nu,nv){
  var n=(nu+1)*(nv+1),aU=new Float32Array(n),aA=new Float32Array(n),pos=new Float32Array(n*3),idx=[],i,j,k=0;
  for(i=0;i<=nu;i++)for(j=0;j<=nv;j++){aU[k]=i/nu;aA[k]=j/nv*TAU;k++;}
  for(i=0;i<nu;i++)for(j=0;j<nv;j++){var a=i*(nv+1)+j,b=a+nv+1;idx.push(a,b,a+1,b,b+1,a+1);}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  g.setAttribute('aU',new T.BufferAttribute(aU,1));g.setAttribute('aA',new T.BufferAttribute(aA,1));g.setIndex(idx);
  g.boundingSphere=new T.Sphere(new T.Vector3(0,TOR.y,0),TOR.R+TOR.ro+0.1);return g;
}
function strandMaterial(s,ph,radius,mode,strength,lane,li,lp,bi){
  return new T.ShaderMaterial({
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.FrontSide,
    uniforms:{uTime:U.time,uPh:{value:ph},uRs:{value:TOR.rs},uSpin:{value:0},uR:{value:radius},uS:{value:strength*STRAND_GAIN},
      uGlow:{value:new T.Vector3().fromArray(s.glow)},uCore:{value:new T.Vector3().fromArray(s.core)},clipY:U.clipY,
      uLane:{value:lane||0},uK:{value:LANE.k[li||0]},uSpd:{value:LANE.speed[(bi||0)*3+(li||0)]*LANE.k[li||0]},uLp:{value:lp||0},
      uLi:{value:li||0},uWob:{value:mode==='haze'?0:1}},
    vertexShader:[
      'attribute float aU;attribute float aA;uniform float uR;uniform float uLane;uniform float uLi;uniform float uWob;',GL_STRAND,
      'varying vec3 vW;varying vec3 vN;varying float vU;',
      'void main(){vec3 C=center(aU);vec3 Tn=normalize(center(aU+0.0015)-center(aU-0.0015));',
      ' vec3 N1=normalize(C-tubeC(C));N1=normalize(N1-Tn*dot(N1,Tn));vec3 N2=cross(Tn,N1);',
      ' vec3 n=cos(aA)*N1+sin(aA)*N2;',
      /* 束の断面で横（N2）に並べ、横と縦（N1）へ不規則に揺らがせる。本ごとに位相と速さを変える */
      ' float u6=aU*6.2831853;',
      ' float ws=sin(u6*5.0+uTime*1.30+uLi*2.1+uPh)*0.55+sin(u6*11.0-uTime*2.30+uLi*4.7)*0.30+sin(u6*3.0+uTime*0.70+uLi*1.3+uPh*0.5)*0.45;',
      ' float wu=cos(u6*4.0-uTime*1.10+uLi*3.3+uPh)*0.55+cos(u6*9.0+uTime*1.90+uLi*5.9)*0.35+cos(u6*2.0-uTime*0.55+uLi*0.8)*0.40;',
      ' vec3 off=N2*(uLane+uWob*'+LANE.wob.side.toFixed(4)+'*ws)+N1*(uWob*'+LANE.wob.up.toFixed(4)+'*wu);',
      /* 素線の中心線が内壁から LANE.wall より外へ出ないように */
      ' vec3 Q=C+off;vec3 tq=tubeC(Q);vec3 dq=Q-tq;float lq=length(dq),mq='+LANE.wall.toFixed(3)+'-uR;if(lq>mq)Q=tq+dq*(mq/lq);',
      ' vU=aU;vN=n;vec3 P=Q+n*uR;vW=P;',
      ' gl_Position=projectionMatrix*viewMatrix*vec4(P,1.0);}'
    ].join('\n'),
    fragmentShader:[
      'uniform float uTime;uniform float uR;uniform float uS;uniform vec3 uGlow;uniform vec3 uCore;uniform float clipY;',
      'uniform float uK;uniform float uSpd;uniform float uLp;',
      'varying vec3 vW;varying vec3 vN;varying float vU;',
      'void main(){if(vW.y<clipY)discard;vec3 V=normalize(cameraPosition-vW);float f=clamp(abs(dot(normalize(vN),V)),0.0,1.0);',
      /* 光の粒：x は粒の中の位置（1 が頭）。+u の向きへ uSpd/uK 周/秒で進む */
      ' float x=fract(uK*vU-uSpd*uTime+uLp);float head=exp(-(1.0-x)*'+LANE.decay.toFixed(2)+');',
      /* 流れる光の粒は芯だけ。光の層は一定（粒の平均の明るさ）、束を包む層は時間で動かさない */
      mode==='haze'
        ?' float I=0.90+0.10*sin(vU*18.849556+uLp*6.2831853);'
        :mode==='gas'
        ?' float I=0.62;'
        :' float I=0.30+1.75*head;',
      mode==='core'
        ?' vec3 col=mix(uGlow,uCore,pow(f,2.5))*uS*pow(f,2.3)*I;'
        :' vec3 col=uGlow*uS*(2.0*uR*f)*I;',
      ' gl_FragColor=vec4(col,1.0);}'
    ].join('\n')
  });
}
function sparkGeometry(count){
  var n=count*2,pos=new Float32Array(n*3),aU=new Float32Array(n),aL=new Float32Array(n),aD=new Float32Array(n*3),aE=new Float32Array(n),aS=new Float32Array(n),i,e,k;
  for(i=0;i<count;i++){
    var u=Math.random(),lf=Math.random(),sp=Math.random(),dx=gauss(),dy=gauss(),dz=gauss(),L=Math.sqrt(dx*dx+dy*dy+dz*dz)||1;
    for(e=0;e<2;e++){k=i*2+e;aU[k]=u;aL[k]=lf;aS[k]=sp;aE[k]=e;aD[k*3]=dx/L;aD[k*3+1]=dy/L;aD[k*3+2]=dz/L;}
  }
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  g.setAttribute('aU',new T.BufferAttribute(aU,1));g.setAttribute('aL',new T.BufferAttribute(aL,1));g.setAttribute('aD',new T.BufferAttribute(aD,3));
  g.setAttribute('aE',new T.BufferAttribute(aE,1));g.setAttribute('aS',new T.BufferAttribute(aS,1));
  g.boundingSphere=new T.Sphere(new T.Vector3(0,TOR.y,0),TOR.R+TOR.ro+0.1);return g;
}
function gauss(){var u=1-Math.random(),v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v);}
function sparkMaterial(s,ph){
  var mix=[0,1,2].map(function(i){return 0.5*s.glow[i]+0.5*s.core[i];});
  return new T.ShaderMaterial({
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    uniforms:{uTime:U.time,uPh:{value:ph},uRs:{value:TOR.rs},uSpin:{value:0},uCol:{value:new T.Vector3().fromArray(mix)},uOff:{value:ph/TAU},clipY:U.clipY},
    vertexShader:[
      'attribute float aU;attribute float aL;attribute vec3 aD;attribute float aE;attribute float aS;uniform float uOff;',GL_STRAND,
      'varying float vA;varying vec3 vW;',
      'void main(){float lp=fract(aL+uTime*0.55);vec3 C=center(aU);',
      ' vec3 tn=normalize(center(aU+0.0015)-C);',
      ' vec3 vel=aD*0.06+tn*0.10;vec3 P=C+aD*0.030+vel*lp;',
      ' vec3 Q=P-normalize(vel+aD*0.2)*(0.002+0.007*aS)*aE;',
      /* 管の内壁（0.302）の内側に留める */
      ' vec3 tc=tubeC(Q);vec3 o=Q-tc;float ol=length(o);if(ol>0.285)Q=tc+o*(0.285/ol);',
      ' float stv=0.5+0.5*sin((aU-uTime/3.0+uOff)*37.699112);',
      ' vA=(1.0-lp)*(0.30+0.70*aS)*(0.45+0.75*stv*stv);vW=Q;',
      ' gl_Position=projectionMatrix*viewMatrix*vec4(Q,1.0);}'
    ].join('\n'),
    fragmentShader:'uniform vec3 uCol;uniform float clipY;varying float vA;varying vec3 vW;void main(){if(vW.y<clipY)discard;gl_FragColor=vec4(uCol*16.0*vA*0.35,1.0);}'
  });
}

/* ---------------------------------------------------------------- 後段（全画面） */
var FS_VERT='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
function fsMat(frag,uniforms,extra){
  var m=new T.ShaderMaterial(Object.assign({uniforms:uniforms,vertexShader:FS_VERT,fragmentShader:frag,depthTest:false,depthWrite:false},extra||{}));
  return m;
}
var quad=null;
function fsDraw(mat,rt){quad.material=mat;renderer.setRenderTarget(rt);renderer.render(sceneBloom,quadCam);}

/* ---------------------------------------------------------------- 目標の生成 */
function makeRT(w,h,opt){
  var mips=!!(opt&&opt.mips);
  var o={type:halfType(),format:T.RGBAFormat,minFilter:mips?T.LinearMipmapLinearFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:!!(opt&&opt.depth),stencilBuffer:false,generateMipmaps:mips};
  var rt;
  if(opt&&opt.msaa&&renderer.capabilities.isWebGL2&&T.WebGLMultisampleRenderTarget){rt=new T.WebGLMultisampleRenderTarget(w,h,o);rt.samples=4;}
  else rt=new T.WebGLRenderTarget(w,h,o);
  return rt;
}
var HALF=null;
function halfType(){
  if(HALF!==null)return HALF;
  var gl=renderer.getContext(),ok=renderer.capabilities.isWebGL2?!!gl.getExtension('EXT_color_buffer_float')||!!gl.getExtension('EXT_color_buffer_half_float'):!!gl.getExtension('OES_texture_half_float')&&!!gl.getExtension('EXT_color_buffer_half_float');
  HALF=ok?T.HalfFloatType:T.UnsignedByteType;return HALF;
}

/* ---------------------------------------------------------------- 組み立て */
function build(doc,bin,tex){
  sceneA=new T.Scene();sceneB=new T.Scene();sceneBloom=new T.Scene();
  quadCam=new T.OrthographicCamera(-1,1,1,-1,0,1);
  quad=new T.Mesh(new T.PlaneGeometry(2,2),null);quad.frustumCulled=false;sceneBloom.add(quad);
  black=new T.DataTexture(new Uint8Array([0,0,0,255]),1,1,T.RGBAFormat);black.needsUpdate=true;

  function geo(g,uv){
    var bg=new T.BufferGeometry();
    function arr(k,n){var a=g[k];return new T.BufferAttribute(new Float32Array(bin,a[0],a[1]),n);}
    bg.setAttribute('position',arr('position',3));bg.setAttribute('normal',arr('normal',3));bg.setAttribute('role',arr('role',1));
    if(uv)bg.setAttribute('uv',arr('uv',2));
    bg.computeBoundingSphere();return bg;
  }
  var roomGeo=geo(doc.groups.room,true),partsGeo=geo(doc.groups.parts,false);
  roomMat=makeRoomMaterial(tex);partsMat=makePartsMaterial(tex);
  roomMesh=new T.Mesh(roomGeo,roomMat);partsMesh=new T.Mesh(partsGeo,partsMat);
  sceneA.add(roomMesh,partsMesh);

  var glassGeo=torusGeometry(TOR.ro,256,72);
  backGlassMat=makeBackGlassMaterial(tex);frontGlassMat=makeFrontGlassMaterial(tex);
  backGlass=new T.Mesh(glassGeo,backGlassMat);backGlass.renderOrder=5;sceneA.add(backGlass);

  plasma=new T.Group();sceneA.add(plasma);
  var geoCore=strandGeometry(720,8),geoGas=strandGeometry(720,10);
  function add(m,order){m.renderOrder=order;m.frustumCulled=false;plasma.add(m);strandObjs.push(m);}
  STRANDS.forEach(function(s,i){
    var ph=i*TAU/3;
    add(new T.Mesh(geoGas,strandMaterial(s,ph,LANE.haze.r,'haze',LANE.haze.s,0,0,0)),9);
    for(var li=0;li<3;li++){
      var lane=(li-1)*LANE.gap,lp=((i*0.37+li*0.61)%1);
      add(new T.Mesh(geoGas,strandMaterial(s,ph,LANE.glow.r,'gas',LANE.glow.s,lane,li,lp,i)),10);
      add(new T.Mesh(geoCore,strandMaterial(s,ph,LANE.core.r,'core',LANE.core.s,lane,li,lp,i)),11);
    }
    var sp=new T.LineSegments(sparkGeometry(SPARKS_PER),sparkMaterial(s,ph));sp.renderOrder=12;sp.frustumCulled=false;plasma.add(sp);sparkObjs.push(sp);
  });

  /* B：rtA の写し → 不透明の深度だけ → 手前のガラス */
  copyMat=fsMat('uniform sampler2D t;varying vec2 vUv;void main(){gl_FragColor=texture2D(t,vUv);}',{t:{value:null}});
  var copyQuad=new T.Mesh(new T.PlaneGeometry(2,2),copyMat);copyQuad.frustumCulled=false;copyQuad.renderOrder=-2;sceneB.add(copyQuad);
  depthMat=new T.MeshBasicMaterial({colorWrite:false});
  var dRoom=new T.Mesh(roomGeo,depthMat),dParts=new T.Mesh(partsGeo,depthMat);dRoom.renderOrder=dParts.renderOrder=-1;
  depthMat.side=T.DoubleSide;sceneB.add(dRoom,dParts);
  frontGlass=new T.Mesh(glassGeo,frontGlassMat);frontGlass.renderOrder=1;sceneB.add(frontGlass);

  /* C/D：にじみと表示変換 */
  bloomPre=fsMat([
    'uniform sampler2D t;uniform vec2 px;varying vec2 vUv;',
    'vec3 pick(vec2 uv){vec3 c=texture2D(t,uv).rgb;float l=dot(c,vec3(0.2126,0.7152,0.0722));return c*clamp((l-1.0)/max(l,1e-4),0.0,1.0);}',
    'void main(){vec3 s=pick(vUv+px*vec2(-0.5,-0.5))+pick(vUv+px*vec2(0.5,-0.5))+pick(vUv+px*vec2(-0.5,0.5))+pick(vUv+px*vec2(0.5,0.5));gl_FragColor=vec4(s*0.25,1.0);}'
  ].join('\n'),{t:{value:null},px:{value:new T.Vector2()}});
  bloomDown=fsMat([
    'uniform sampler2D t;uniform vec2 px;varying vec2 vUv;',
    'void main(){vec3 s=texture2D(t,vUv).rgb*0.25;',
    ' s+=(texture2D(t,vUv+px*vec2(-1,-1)).rgb+texture2D(t,vUv+px*vec2(1,-1)).rgb+texture2D(t,vUv+px*vec2(-1,1)).rgb+texture2D(t,vUv+px*vec2(1,1)).rgb)*0.125;',
    ' s+=(texture2D(t,vUv+px*vec2(-2,0)).rgb+texture2D(t,vUv+px*vec2(2,0)).rgb+texture2D(t,vUv+px*vec2(0,-2)).rgb+texture2D(t,vUv+px*vec2(0,2)).rgb)*0.0625;',
    ' gl_FragColor=vec4(s,1.0);}'
  ].join('\n'),{t:{value:null},px:{value:new T.Vector2()}});
  finalMat=fsMat([
    'uniform sampler2D t,b1,b2,b3,b4,b5,b6,lut;uniform float uBloom,uExpo,uTime;varying vec2 vUv;',
    'vec3 slice(vec2 rg,float b){vec2 tile=vec2(mod(b,8.0),floor(b/8.0));return texture2D(lut,(tile*64.0+rg+0.5)/512.0).rgb;}',
    'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.0)+1024.0*max(c,vec3(0.0)))/19.0,0.0,1.0)*63.0;',
    ' float b=floor(p.b);return mix(slice(p.rg,b),slice(p.rg,min(63.0,b+1.0)),p.b-b);}',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uTime)*43758.5453);}',
    /* レンズ：画面の周辺ほどごく弱い色ずれ（赤は外へ、青は内へ）と減光 */
    'void main(){vec2 dc=vUv-0.5;float r2=dot(dc,dc);vec3 c;',
    ' c.r=texture2D(t,vUv+dc*0.0035).r;c.g=texture2D(t,vUv).g;c.b=texture2D(t,vUv-dc*0.0035).b;',
    ' vec3 bl=texture2D(b1,vUv).rgb*0.9+texture2D(b2,vUv).rgb*1.0+texture2D(b3,vUv).rgb*1.0+texture2D(b4,vUv).rgb*0.9+texture2D(b5,vUv).rgb*0.8+texture2D(b6,vUv).rgb*0.7;',
    ' c=(c+uBloom*bl)*uExpo*mix(1.0,0.78,smoothstep(0.10,0.60,r2*2.0));vec3 d=agx(c);d+=(hash(gl_FragCoord.xy)-0.5)*1.6/255.0;gl_FragColor=vec4(d,1.0);}'
  ].join('\n'),{t:{value:null},b1:{value:null},b2:{value:null},b3:{value:null},b4:{value:null},b5:{value:null},b6:{value:null},lut:{value:tex.lut},
    uBloom:{value:0.07},uExpo:{value:1.0},uTime:{value:0}});

  views=VIEW_DEFS.map(function(v){
    var p=new T.Vector3().fromArray(v.pos),t=new T.Vector3().fromArray(v.tgt),o=p.clone().sub(t),r=o.length();
    return {key:v.key,name:v.name,target:t,radius:r,theta:Math.atan2(o.x,o.z),phi:Math.acos(clamp(o.y/r,-1,1)),lens:v.lens,portrait:v.portrait,lift:v.lift};
  });
}

/* ---------------------------------------------------------------- 大きさ */
var lastSizeKey='';
function resize(){
  var w=Math.max(1,innerWidth),h=Math.max(1,innerHeight),phone=Math.min(screen.width||w,screen.height||h)<=600;
  var dpr=Math.min(window.devicePixelRatio||1,query.has('lite')?1:1.5)*quality.scale;
  var cap=query.has('lite')?0.7e6:phone?1.0e6:2.6e6;if(w*h*dpr*dpr>cap)dpr=Math.sqrt(cap/(w*h));
  /* 大きさも倍率も変わっていなければ何もしない（setSize は同じ値でも canvas を作り直す） */
  var key=w+'x'+h+'@'+dpr.toFixed(4);if(key===lastSizeKey&&rtA)return false;lastSizeKey=key;DIAG.resizes++;
  pr=dpr;renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);
  renderer.domElement.style.width=w+'px';renderer.domElement.style.height=h+'px';
  renderer.getDrawingBufferSize(size);
  var W=size.x,H=size.y;
  if(!rtA){rtA=makeRT(W,H,{depth:true,msaa:true});rtB=makeRT(W,H,{depth:true,msaa:true});
    rtR0=makeRT(1,1,{depth:true,mips:true});rtR1=makeRT(1,1,{depth:true,mips:true});
    for(var i=0;i<7;i++)bloomRT.push(makeRT(1,1,{}));}
  var RW=Math.max(1,Math.round(W*0.5)),RH=Math.max(1,Math.round(H*0.5));
  rtA.setSize(W,H);rtB.setSize(W,H);rtR0.setSize(RW,RH);rtR1.setSize(RW,RH);
  for(var k=0;k<7;k++)bloomRT[k].setSize(Math.max(1,W>>(k+1)),Math.max(1,H>>(k+1)));
  frontGlassMat.uniforms.uRes.value.set(W,H);roomMat.uniforms.uMirRes.value.set(RW,RH);
  camera.aspect=w/h;applyLens();needsRender=true;return true;
}
function applyLens(){
  var a=Math.max(0.05,camera.aspect),hf=2*Math.atan(18/lens),ref=16/9;
  var tv=Math.tan(hf/2)/Math.min(a,ref);                 /* 16:9 より横長なら縦を基準に固定 */
  var cap=Math.tan(39*Math.PI/180);tv=Math.min(tv,cap);   /* 縦長でも縦の画角は 78° まで（歪みの上限）。残りは距離で補う */
  camera.fov=2*Math.atan(tv)*180/Math.PI;camera.updateProjectionMatrix();
}

/* ---------------------------------------------------------------- カメラ */
function portraitK(){var a=camera.aspect;return a>=1?1:1+(views[viewIndex].portrait-1)*clamp((1-a)/0.54,0,1);}
function updateCamera(){
  var sp=Math.sin(phi),cp=Math.cos(phi),r=radius*portraitScale;
  camera.position.set(target.x+r*sp*Math.sin(theta),target.y+r*cp,target.z+r*sp*Math.cos(theta));
  constrain();camera.lookAt(target);camera.updateMatrixWorld(true);requestFrame();
}
function constrain(){
  var p=camera.position;p.y=clamp(p.y,0.12,ROOM.h-0.18);
  var h=Math.hypot(p.x,p.z),lim=ROOM.r-0.30;
  if(h>lim){p.x*=lim/h;p.z*=lim/h;h=lim;}
  /* 基壇の中に入らない */
  if(p.y<ROOM.daisH+0.10&&h<ROOM.daisR+0.08){var k=(ROOM.daisR+0.08)/Math.max(h,1e-6);p.x*=k;p.z*=k;h=ROOM.daisR+0.08;}
  /* ガラスの環の中に入らない（管の中心線から 0.44 m 以上） */
  var dh=h-TOR.R,dy=p.y-TOR.y,d=Math.hypot(dh,dy),m=TOR.ro+0.10;
  if(d<m){var s=m/Math.max(d,1e-6),nh=TOR.R+dh*s,ny=TOR.y+dy*s;if(d<1e-6){nh=TOR.R+m;ny=TOR.y;}
    var hh=Math.max(nh,1e-4)/Math.max(h,1e-4);p.x*=hh;p.z*=hh;p.y=ny;}
}
function setView(i){
  i=Number(i);if(!views[i])return;viewIndex=i;var v=views[i];
  target.copy(v.target);theta=v.theta;phi=v.phi;radius=v.radius;lens=v.lens;portraitScale=portraitK();
  if(camera.aspect<1)target.y-=v.lift*clamp((1-camera.aspect)/0.54,0,1);
  applyLens();updateCamera();userMoved=false;
  if(window.SanctumUI&&window.SanctumUI.sync)window.SanctumUI.sync();
}
function zoom(f){radius=clamp(radius*f,0.35,9.0);updateCamera();}
function reset(){setView(viewIndex);}
function controls(){
  var el=renderer.domElement;el.tabIndex=0;el.setAttribute('aria-label','作品。ドラッグで回転、ホイールや二本指で拡大縮小。矢印キーでも操作できます。');
  el.addEventListener('pointerdown',function(e){
    if(!ready||e.button>0)return;el.focus({preventScroll:true});el.setPointerCapture(e.pointerId);pointers[e.pointerId]={x:e.clientX,y:e.clientY};
    var ids=Object.keys(pointers);if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]];pinchStart=Math.hypot(a.x-b.x,a.y-b.y);pinchRadius=radius;}
  });
  el.addEventListener('pointermove',function(e){
    var pt=pointers[e.pointerId];if(!pt||!ready)return;var ids=Object.keys(pointers),dx=e.clientX-pt.x,dy=e.clientY-pt.y;pt.x=e.clientX;pt.y=e.clientY;
    if(ids.length===1&&(dx||dy)){theta-=dx*0.004;phi=clamp(phi-dy*0.004,0.08,Math.PI-0.25);userMoved=true;updateCamera();}
    else if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinchStart>0){radius=clamp(pinchRadius*pinchStart/Math.max(d,1),0.35,9.0);userMoved=true;updateCamera();}}
  });
  function up(e){delete pointers[e.pointerId];if(Object.keys(pointers).length<2)pinchStart=0;}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);
  el.addEventListener('wheel',function(e){if(!ready)return;e.preventDefault();var dl=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);zoom(Math.exp(clamp(dl,-800,800)*0.0012));userMoved=true;},{passive:false});
  window.addEventListener('blur',function(){pointers={};pinchStart=0;});
  window.addEventListener('keydown',function(e){
    if(!ready||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||(window.SanctumUI&&window.SanctumUI.isEventOwned(e)))return;
    var tag=e.target&&e.target.tagName;if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA'||tag==='BUTTON'||tag==='A'||(e.target&&e.target.isContentEditable))return;
    var k=e.key,handled=true;
    if(k>='1'&&k<='5')setView(+k-1);else if(k==='r'||k==='R'||k==='Home')reset();
    else if(k==='+'||k==='=')zoom(0.88);else if(k==='-'||k==='_')zoom(1/0.88);
    else if(k==='ArrowLeft'||k==='ArrowRight'){theta+=k==='ArrowLeft'?0.06:-0.06;updateCamera();}
    else if(k==='ArrowUp'||k==='ArrowDown'){phi=clamp(phi+(k==='ArrowUp'?-0.06:0.06),0.08,Math.PI-0.25);updateCamera();}
    else if(k===' ')setPlaying(!playing);
    else handled=false;if(handled)e.preventDefault();
  });
}

/* ---------------------------------------------------------------- 鏡像 */
function mirrorFrom(h,texMat,rt){
  var src=camera;
  mirrorCam.fov=src.fov;mirrorCam.aspect=src.aspect;mirrorCam.near=src.near;mirrorCam.far=src.far;mirrorCam.updateProjectionMatrix();
  var p=src.position;mirrorCam.position.set(p.x,2*h-p.y,p.z);
  var dir=new T.Vector3(0,0,-1).applyQuaternion(src.quaternion);dir.y=-dir.y;
  var up=new T.Vector3(0,1,0).applyQuaternion(src.quaternion);up.y=-up.y;
  mirrorCam.up.copy(up);mirrorCam.lookAt(mirrorCam.position.clone().add(dir));mirrorCam.updateMatrixWorld(true);
  texMat.set(0.5,0,0,0.5, 0,0.5,0,0.5, 0,0,0.5,0.5, 0,0,0,1);
  texMat.multiply(mirrorCam.projectionMatrix);texMat.multiply(mirrorCam.matrixWorldInverse);
  U.clipY.value=h+0.002;backGlass.visible=false;roomMat.uniforms.uCheap.value=1;
  roomMat.uniforms.tR0.value=black;roomMat.uniforms.tR1.value=black;
  renderer.setRenderTarget(rt);renderer.setClearColor(0x000000,1);renderer.clear();renderer.render(sceneA,mirrorCam);
  U.clipY.value=-1e3;backGlass.visible=true;roomMat.uniforms.uCheap.value=0;
}

/* ---------------------------------------------------------------- 一枚 */
/* 検分用：段ごとの GPU 時間（EXT_disjoint_timer_query_webgl2 がある環境だけ） */
var PROF=null;
function pb(name){if(!PROF)return;var q=PROF.gl.createQuery();PROF.gl.beginQuery(PROF.ext.TIME_ELAPSED_EXT,q);PROF.cur={name:name,q:q};}
function pe(){if(!PROF||!PROF.cur)return;PROF.gl.endQuery(PROF.ext.TIME_ELAPSED_EXT);PROF.pending.push(PROF.cur);PROF.cur=null;}
function render(){
  camera.near=0.02;camera.far=40;camera.updateProjectionMatrix();
  if(!diagOff('mirror')){pb('mirror-floor');mirrorFrom(0.0,texMat0,rtR0);pe();
  pb('mirror-dais');mirrorFrom(ROOM.daisH,texMat1,rtR1);pe();}
  plasma.visible=!diagOff('strands');frontGlass.visible=backGlass.visible=!diagOff('glass');
  roomMat.uniforms.tR0.value=rtR0.texture;roomMat.uniforms.tR1.value=rtR1.texture;
  pb('A-scene');renderer.setRenderTarget(rtA);renderer.setClearColor(0x000000,1);renderer.clear();renderer.render(sceneA,camera);pe();
  copyMat.uniforms.t.value=rtA.texture;frontGlassMat.uniforms.tScene.value=rtA.texture;
  pb('B-glass');renderer.setRenderTarget(rtB);renderer.clear();renderer.render(sceneB,camera);pe();
  pb('bloom+final');
  /* にじみ */
  bloomPre.uniforms.t.value=rtB.texture;bloomPre.uniforms.px.value.set(1/size.x,1/size.y);fsDraw(bloomPre,bloomRT[0]);
  for(var i=1;i<(diagOff('bloom')?1:7);i++){bloomDown.uniforms.t.value=bloomRT[i-1].texture;bloomDown.uniforms.px.value.set(1/bloomRT[i-1].width,1/bloomRT[i-1].height);fsDraw(bloomDown,bloomRT[i]);}
  var f=finalMat.uniforms;f.t.value=rtB.texture;f.b1.value=bloomRT[1].texture;f.b2.value=bloomRT[2].texture;f.b3.value=bloomRT[3].texture;
  f.b4.value=bloomRT[4].texture;f.b5.value=bloomRT[5].texture;f.b6.value=bloomRT[6].texture;f.uTime.value=(clock.t%17);
  fsDraw(finalMat,null);pe();
}

/* ---------------------------------------------------------------- 時間 */
function setPlaying(v){playing=!!v;clock.last=performance.now();needsRender=true;requestFrame();if(window.SanctumUI)window.SanctumUI.sync();}
/* 非表示の間はブラウザが RAF を止めるので、ここでは document.hidden を見ない */
/* 予約は常に 1 本だけ。frame() の途中で呼ばれても、予約が既にあれば重ねない */
function requestFrame(){needsRender=true;if(!frameHandle&&!pageAway)frameHandle=requestAnimationFrame(frame);}
function frame(now){
  frameHandle=0;if(pageAway)return;
  var gap=now-(clock.last||now),dt=Math.min(0.1,Math.max(0,gap/1000));clock.last=now;
  if(playing&&ready&&gap>0&&gap<1000){quality.gaps.push(gap);
    if(!quality.t0)quality.t0=now;
    if(now-quality.t0>1000&&quality.gaps.length>=4){
      var g=quality.gaps.slice().sort(function(a,b){return a-b;})[quality.gaps.length>>1],old=quality.scale;
      if(g>34&&quality.scale>0.45&&now-quality.last>700)quality.scale=Math.max(0.45,quality.scale*0.8);
      else if(g<18&&quality.scale<1&&now-quality.last>3000)quality.scale=Math.min(1,quality.scale*1.12);
      if(quality.scale!==old){quality.last=now;resize();}
      quality.gaps=[];quality.t0=now;}}
  if(playing&&ready){clock.t+=dt*TIME_SCALE;needsRender=true;}
  if(needsRender&&ready){
    U.time.value=clock.t;
    var spin=clock.t*0.04;plasma.children.forEach(function(o){o.material.uniforms.uSpin.value=spin;});
    var t0=performance.now();render();var t1=performance.now(),gms=-1;
    if(DIAG.gpu){renderer.getContext().finish();gms=performance.now()-t1;}
    stats.frames++;stats.ms.push(t1-t0);if(stats.ms.length>60)stats.ms.shift();
    needsRender=false;
    if(DIAG.uiMode==='sync')renderer.getContext().finish();
    var t2=performance.now(),called=false;if(window.SanctumUI&&!diagOff('ui')&&uiDue()){window.SanctumUI.afterRender(now);called=true;}
    var t3=performance.now();if(called&&DIAG.on){DIAG.uiCalls++;diagUI();}
    diagTick(now,gap,t1-t0,t3-t2,gms);
  }
  /* 途中で requestFrame() が予約を取っていたら、ここでは取らない（w4 まではここで二重に取り、ループが増殖していた） */
  if((playing||needsRender)&&!frameHandle&&!pageAway)frameHandle=requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange',function(){if(!document.hidden){clock.last=performance.now();requestFrame();}});
window.addEventListener('pagehide',function(){pageAway=true;});
window.addEventListener('pageshow',function(){pageAway=false;clock.last=performance.now();requestFrame();});

/* ---------------------------------------------------------------- 起動 */
function init(){
  status('作品を読み込んでいます…');
  try{renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:query.has('shot')});}
  catch(e){fail('WebGL を初期化できませんでした。Safari や Chrome の最新版で開き直してください。');return;}
  renderer.outputEncoding=T.LinearEncoding;renderer.toneMapping=T.NoToneMapping;renderer.autoClear=false;
  renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();},false);
  renderer.domElement.addEventListener('webglcontextrestored',function(){location.reload();},false);
  stage.appendChild(renderer.domElement);
  camera=new T.PerspectiveCamera(40,innerWidth/innerHeight,0.02,40);
  Promise.all([
    fetchJSON(P+'geo.json'),fetchBin(P+'geo.bin'),
    loadTex(P7+'lm.png',{mips:true}),loadTex(P7+'env-glass.png',{mips:true,wrapS:T.RepeatWrapping}),loadTex(P7+'env-steel.png',{mips:true,wrapS:T.RepeatWrapping}),
    loadTex(P+'agx-lut.png',{flipY:false})
  ]).then(function(r){
    var doc=r[0],bin=r[1];if(bin.byteLength!==doc.bytes)throw Error('geo.bin size mismatch');
    build(doc,bin,{lm:r[2],envGlass:r[3],envSteel:r[4],lut:r[5]});
    resize();
    var want=query.get('view');var vi=views.findIndex(function(v){return v.key===want;});
    setView(vi>=0?vi:1);controls();ready=true;
    /* 画面の向き・大きさが変わったら、利用者が動かしていなければ視点を取り直す（縦横で注視点と距離が違う） */
    addEventListener('resize',function(){DIAG.resizeEvents++;if(!resize())return;if(!userMoved)setView(viewIndex);else{portraitScale=portraitK();updateCamera();}});
    render();status('');
    if(query.has('still'))playing=false;
    if(window.SanctumUI)window.SanctumUI.mount({canvas:renderer.domElement,views:function(){return views;},getViewIndex:function(){return viewIndex;},
      setView:setView,reset:reset,zoom:zoom,getPlaying:function(){return playing;},setPlaying:setPlaying,requestFrame:requestFrame,onLayout:function(){needsRender=true;}});
    requestFrame();
  }).catch(function(e){fail('作品を読み込めませんでした。'+(e&&e.message||e));});
}
window.SanctumArtwork={report:function(){var ms=stats.ms.slice().sort(function(a,b){return a-b;});
  return {ready:ready,view:views[viewIndex]&&views[viewIndex].key,frames:stats.frames,quality:quality.scale,cpuMsMedian:ms[ms.length>>1]||0,size:[size.x,size.y],pixelRatio:pr,
    webgl2:renderer&&renderer.capabilities.isWebGL2,half:HALF===T.HalfFloatType,calls:renderer&&renderer.info.render.calls,camera:camera&&camera.position.toArray()};},
  setView:function(k){var i=views.findIndex(function(v){return v.key===k;});if(i>=0)setView(i);},
  setTime:function(t){clock.t=t;needsRender=true;requestFrame();},setPlaying:setPlaying,
  /* 検分用：GPU 時間を n 枚ぶん測って段ごとの中央値（ms）を返す。vis で部品の表示を切り替えられる */
  profile:function(n,vis){var gl=renderer.getContext(),ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');if(!ext)return Promise.resolve('no timer ext');
    vis=vis||{};roomMesh.visible=vis.room!==false;partsMesh.visible=vis.parts!==false;plasma.visible=vis.plasma!==false;
    PROF={gl:gl,ext:ext,pending:[],cur:null};for(var i=0;i<(n||20);i++)render();var list=PROF.pending;PROF=null;
    roomMesh.visible=partsMesh.visible=plasma.visible=true;
    return new Promise(function(res){function poll(){var done=list.every(function(e){return gl.getQueryParameter(e.q,gl.QUERY_RESULT_AVAILABLE);});
      if(!done)return setTimeout(poll,20);var by={};list.forEach(function(e){(by[e.name]=by[e.name]||[]).push(gl.getQueryParameter(e.q,gl.QUERY_RESULT)/1e6);gl.deleteQuery(e.q);});
      var out={},tot=0;Object.keys(by).forEach(function(k){var a=by[k].sort(function(x,y){return x-y;});out[k]=+a[a.length>>1].toFixed(2);tot+=out[k];});out.total=+tot.toFixed(2);res(out);}poll();});},
  linear:function(wins){render();var w=size.x,h=size.y,px=new Float32Array(w*h*4);
    var fl=new T.WebGLRenderTarget(w,h,{type:T.FloatType,format:T.RGBAFormat,minFilter:T.NearestFilter,magFilter:T.NearestFilter,depthBuffer:false});
    copyMat.uniforms.t.value=rtB.texture;fsDraw(copyMat,fl);renderer.readRenderTargetPixels(fl,0,0,w,h,px);fl.dispose();
    if(wins==='raw')return {w:w,h:h,px:px};
    return wins.map(function(r){var y0=Math.floor((1-r[1])*h),y1=Math.floor((1-r[0])*h),x0=Math.floor(r[2]*w),x1=Math.floor(r[3]*w),s=0,n=0;
      for(var y=y0;y<y1;y++)for(var x=x0;x<x1;x++){var i=(y*w+x)*4;s+=0.2126*px[i]+0.7152*px[i+1]+0.0722*px[i+2];n++;}return +(s/n).toFixed(5);});},
  /* 検分用：描画ループの一歩を、時刻 t（ms）で直接回す */
  step:function(t){frame(t);},
  /* 検分用：その場で一枚描く（RAF を待たない） */
  renderNow:function(){U.time.value=clock.t;var spin=clock.t*0.04;plasma.children.forEach(function(o){o.material.uniforms.uSpin.value=spin;});render();},
  /* 検分用：任意の位置と注視点（three 座標）から見る */
  look:function(pos,tgt,mm){var p=new T.Vector3().fromArray(pos);target.fromArray(tgt);var o=p.sub(target);radius=o.length();
    theta=Math.atan2(o.x,o.z);phi=Math.acos(clamp(o.y/radius,-1,1));if(mm)lens=mm;portraitScale=1;applyLens();updateCamera();userMoved=true;},
  tune:function(o){if(o.bloom!=null)finalMat.uniforms.uBloom.value=o.bloom;if(o.expo!=null)finalMat.uniforms.uExpo.value=o.expo;
    if(o.lm!=null)roomMat.uniforms.uLM.value=o.lm;if(o.gloss)roomMat.uniforms.uGloss.value.fromArray(o.gloss);if(o.mirBlur!=null)roomMat.uniforms.uMirBlur.value=o.mirBlur;if(o.gl)frontGlassMat.uniforms.uGl.value.fromArray(o.gl);if(o.o2!=null)frontGlassMat.uniforms.uO2.value=o.o2;if(o.floorRing)roomMat.uniforms.uFloorRing.value.fromArray(o.floorRing);if(o.refl!=null)roomMat.uniforms.uRefl.value=o.refl;if(o.refr!=null)frontGlassMat.uniforms.uRefr.value=o.refr;if(o.debug!=null)roomMat.uniforms.uDebug.value=o.debug;needsRender=true;requestFrame();}};
init();
})();
