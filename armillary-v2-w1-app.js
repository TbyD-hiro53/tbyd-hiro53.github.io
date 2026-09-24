/* The Armillary — レンズ版（v2 w1）。外洋の孤島の山頂、黄昏。地面から 0.5 m 浮かぶ球電の殻の中で、着色ガラスの曲面レンズ四枚
 * （環のあった四つの仮想球殻に一枚ずつ、各辺 1.33 rad の球面三角形、厚み 30 mm・隙間 20 mm）が、向きも速さも不規則に回る。中心の黒いもやから、コードレインのホログラム（脳核・会長室のメトロノーム・Cyberwafer）が
 * 順に浮かび上がる。
 * three.js r128 / 作品スクリプトは単一 IIFE / 同一サイトの資産のみ。
 * 地面・岩・空は Blender（build_g6.py → export_web.py）から。照らされ方は頂点に焼き込み。環・殻・放電・もや・文字は実時間。
 *
 * 描画の順（一つの HDR 目標 rtA、MSAA）
 *   空 → 海 → 地面・岩 → 軸受けのピン → 黒いもや → 文字 → 環（ガラスの色を掛ける → 映り込みと縁の光を足す）→ 放電 → 殻
 *   → 光のにじみ（Blender 後段 post_bloom.py と同じ閾値・重み）→ AgX Medium High Contrast の表で表示値へ
 */
(function(){'use strict';
var T=window.THREE,P='armillary-v2-w1-';
var stage=document.getElementById('stage');
var query=new URLSearchParams(location.search);

/* ---------------------------------------------------------------- 寸法（Blender と同じ。three は y が上） */
var RS=3.2,LIFT=0.5,CZ=RS+LIFT,TAU=Math.PI*2;   /* 殻は地面に接せず 0.5 m 浮かぶ */
var ENC_E=1/1024,ENC_M=64;
function lin(h){var c=[1,3,5].map(function(i){return parseInt(h.substr(i,2),16)/255;});return c.map(function(x){return x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);});}
var TEAL=lin('#00ddc8'),PINK=lin('#ff05a8'),WHITE=lin('#f2dbe9'),GREY=lin('#525761');
/* レンズ：環のあった四つの仮想球殻に一枚ずつ。球殻（外面 半径 r・内面 r − T の同心球面）を中心を通る三つの平面で切った
 * 球面三角形（辺は大円の弧、各辺 SIDE rad）。仮想球殻どうしの隙間 GAP → どの向きに回っても互いに当たらない（作者指示 2026-09-24） */
var LENS_T=0.090,LENS_GAP=0.020,LENS_SIDE=1.3309;   /* 厚みは 30 mm から 3 倍に */   /* 各辺 1 rad から面積（立体角）を倍に：0.496 → 0.991 sr（作者指示 2026-09-24） */
/* ガラスは Coastal Glass のウエハーに倣ってよく透ける：色は厚みを通る吸収で出し（正面は淡く縁で濃い）、自分ではほとんど光らない */
var RINGS=[{col:TEAL,glow:0.9,abs:5.0},{col:PINK,glow:0.9,abs:5.0},{col:WHITE,glow:0.55,abs:1.2},{col:GREY,glow:0.35,abs:4.0}];
RINGS.forEach(function(rd,k){rd.r=2.70-k*(LENS_T+LENS_GAP);});
/* 回転：環ごとに独立。角速度のベクトルの三成分それぞれが、周期の揃わない四つの正弦の和 → 回転軸の向きも速さも
 * 絶えず不規則に変わる（毎秒 0.2〜1 回転ほど）。向きは角速度を積分して求める */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var SPIN=RINGS.map(function(rd,k){var R=mulberry(5301+k*977),c=[];
  for(var i=0;i<3;i++){var f=[],p=[],a=[];for(var j=0;j<4;j++){f.push(0.05+R()*0.9);p.push(R()*TAU);a.push((j===0?3.2:1.6/(j))*(0.6+0.8*R()));}c.push({f:f,p:p,a:a});}
  return {c:c,q0:new T.Quaternion().setFromEuler(new T.Euler(R()*TAU,R()*TAU,R()*TAU))};});
/* ホログラム：一つを HOLD 秒見せ、雨が洗うように入れ替える */
var HOLO_ORDER=['brain','metronome','wafer'],HOLD=11.0,SWAP=3.0;
var HOLO_COL={brain:PINK,metronome:WHITE,wafer:TEAL};

/* ---------------------------------------------------------------- 視点（Blender のカメラ。焦点距離は 36 mm 幅基準） */
function bl(v){return [v[0],v[2],-v[1]];}
var VIEW_DEFS=[
  {key:'wide', name:'全景',pos:bl([15.5,-10.5,3.0]),tgt:bl([0,0,3.6]),lens:28,portrait:1.35,lift:0.0},
  {key:'mid',  name:'中景',pos:bl([6.8,-4.6,4.3]), tgt:bl([0,0,3.55]),lens:30,portrait:1.30,lift:0.0},
  {key:'rings',name:'レンズ',pos:bl([3.9,-2.3,4.1]), tgt:bl([0,0,3.7]), lens:34,portrait:1.15,lift:0.0},
  {key:'core', name:'核',  pos:bl([2.2,4.1,4.4]),  tgt:bl([0,0,3.7]), lens:40,portrait:1.15,lift:0.0},
  {key:'rim',  name:'縁',  pos:bl([5.4,-2.0,0.45]),tgt:bl([0,0,2.5]), lens:20,portrait:1.10,lift:0.0}
];

/* ---------------------------------------------------------------- 状態 */
var renderer,camera,scene,sceneBloom,quadCam,quad,views=[],viewIndex=1,ready=false,needsRender=true;
var target=new T.Vector3(),theta=0,phi=1.2,radius=8,lens=32,portraitScale=1;
var pointers={},pinchStart=0,pinchRadius=0,userMoved=false;
var rtA,bloomRT=[],size=new T.Vector2(),pr=1;
var U={time:{value:0},arc:{value:0}};
var BG={value:null},RES={value:new T.Vector2(1,1)},rtBg=null,sceneB=null,copyMat=null;
var SHELL_K={value:2.0};
var PATCH_ALB=null,PATCH_NRM=null,PATCH_SIZE=32;
var rings=[],ringRoot,holo={},pend=null,arcs=null,haze,shell,finalMat,bloomPre,bloomDown;
var playing=true,clock={t:0,last:0};
var frameHandle=0,pageAway=false,stats={frames:0,ms:[]};
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
      t.generateMipmaps=!!(opt&&opt.mips);t.minFilter=t.generateMipmaps?T.LinearMipmapLinearFilter:(opt&&opt.nearest?T.NearestFilter:T.LinearFilter);
      t.magFilter=opt&&opt.nearest?T.NearestFilter:T.LinearFilter;
      if(opt&&opt.wrapS)t.wrapS=opt.wrapS;
      t.needsUpdate=true;res(t);},undefined,function(){rej(Error(url));});
  });
}

/* ---------------------------------------------------------------- GLSL 共通 */
var GL_DECODE='const float ENC_E='+ENC_E.toFixed(8)+';const float ENC_L='+(Math.log2(1+ENC_M/ENC_E)).toFixed(6)+';\n'
 +'vec3 dec(vec3 v){return ENC_E*(exp2(v*ENC_L)-1.0);}\n';
/* 空：Blender の正距円筒（画像中央 = blender +Y = three −Z、u=0.75 = +X、上端 = +Y） */
var GL_ENV='vec2 envUV(vec3 d){d=normalize(d);return vec2(0.5+atan(d.x,-d.z)/6.2831853,0.5+asin(clamp(d.y,-1.0,1.0))/3.1415927);}\n'
 +'vec3 envLod(sampler2D t,vec3 d,float lod){return dec(texture2DLodEXT(t,envUV(d),lod).rgb);}\n';
var GL_NOISE=[
 'float h31(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}',
 'float vnoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);',
 ' return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),',
 '            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}',
 'float fbm(vec3 p){float a=0.5,s=0.0,n=0.0;for(int i=0;i<4;i++){s+=a*vnoise(p);n+=a;p*=2.03;a*=0.5;}return s/n;}'
].join('\n')+'\n';
var SKY_TEX=null;

/* ---------------------------------------------------------------- 空・海 */
function makeSky(){
  var m=new T.ShaderMaterial({depthWrite:false,depthTest:false,
    uniforms:{tSky:{value:SKY_TEX},uInvPV:{value:new T.Matrix4()},uCam:{value:new T.Vector3()}},
    extensions:{shaderTextureLOD:true},
    vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=vec4(position.xy,0.9999,1.0);}',
    fragmentShader:['uniform sampler2D tSky;uniform mat4 uInvPV;uniform vec3 uCam;varying vec2 vP;',GL_DECODE,GL_ENV,
      'void main(){vec4 w=uInvPV*vec4(vP,-1.0,1.0);vec3 d=normalize(w.xyz/w.w-uCam);gl_FragColor=vec4(envLod(tSky,d,0.0),1.0);}'].join('\n')});
  var q=new T.Mesh(new T.PlaneGeometry(2,2),m);q.frustumCulled=false;q.renderOrder=-10;return q;
}
/* 海：遠い地面と海面が奥行きを競ってちらつくので、海は幾何を持たせず、画素ごとに視線と海面（y = −330）の交点で描く。
 * 地面・岩は海面より下を捨てる → 海岸線は地面の形だけで決まる */
var SEA_Y=-330.0;
function makeSea(){
  var m=new T.ShaderMaterial({depthWrite:false,depthTest:false,
    uniforms:{tSky:{value:SKY_TEX},uTime:U.time,uInvPV:{value:new T.Matrix4()},uCam:{value:new T.Vector3()}},extensions:{shaderTextureLOD:true},
    vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=vec4(position.xy,0.9999,1.0);}',
    fragmentShader:['uniform sampler2D tSky;uniform float uTime;uniform mat4 uInvPV;uniform vec3 uCam;varying vec2 vP;',GL_DECODE,GL_ENV,GL_NOISE,
      'void main(){vec4 w=uInvPV*vec4(vP,-1.0,1.0);vec3 d=normalize(w.xyz/w.w-uCam);if(d.y>-1e-5)discard;',
      ' float t=('+(-330).toFixed(1)+'-uCam.y)/d.y;vec3 P=uCam+d*t;vec3 V=-d;vec2 q=P.xz*0.02;',
      /* 波：遠いほど細かい起伏は画素に埋もれるので弱める */
      ' float fade=1.0/(1.0+t*0.0006);',
      ' vec3 n=vec3((vnoise(vec3(q,uTime*0.05))-0.5)*0.22*fade,1.0,(vnoise(vec3(q*1.7+7.1,uTime*0.06))-0.5)*0.22*fade);n=normalize(n);',
      ' float c=clamp(dot(n,V),0.0,1.0);float F=0.02+0.98*pow(1.0-c,5.0);vec3 R=reflect(-V,n);R.y=abs(R.y);',
      ' vec3 col=vec3(0.0006,0.0023,0.0035)*0.3+envLod(tSky,R,1.0)*F;gl_FragColor=vec4(col,1.0);}'].join('\n')});
  var o=new T.Mesh(new T.PlaneGeometry(2,2),m);o.renderOrder=-9;o.frustumCulled=false;return o;
}

/* ---------------------------------------------------------------- 地面・岩（焼き込みの光 × 石の色 ＋ 放電と縁の赤熱） */
function makeGroundMaterial(role){
  return new T.ShaderMaterial({
    uniforms:{uArc:U.arc,uTime:U.time,tSky:{value:SKY_TEX},uShellK:SHELL_K,tAlb:{value:PATCH_ALB},tNrm:{value:PATCH_NRM}},extensions:{derivatives:true,shaderTextureLOD:true},
    vertexShader:['attribute vec4 bake;varying vec3 vW;varying vec3 vN;varying vec4 vB;',
      'void main(){vB=bake;vN=normalize(normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}'].join('\n'),
    fragmentShader:['uniform float uArc;uniform float uTime;uniform float uShellK;uniform sampler2D tSky,tAlb,tNrm;varying vec3 vW;varying vec3 vN;varying vec4 vB;',GL_DECODE,GL_ENV,GL_NOISE,
      'void main(){if(vW.y<'+SEA_Y.toFixed(1)+')discard;',
      /* MSAA の標本が三角形の外にあると、補間した値が 0〜1 をはみ出す。対数符号化を戻す前に必ず抑える */
      ' vec4 bk=clamp(vB,0.0,1.0);vec3 irr=dec(bk.rgb);vec3 b=vec3(vW.x,-vW.z,vW.y);float sc=bk.a;',
      /* 法線が打ち消し合う境目（間引いた岩の裏表）で長さ 0 になり、正規化が壊れて光の点になるのを防ぐ */
      ' float ln=length(vN);vec3 Ng=ln>1e-3?vN/ln:vec3(0.0,1.0,0.0);vec3 N=Ng;',
      role===0
        /* 外：土・枯れ草・岩の斑（Blender の山頂の地面と同じ反射率、細かさが画素より小さくなったら平均へ） */
        ?' float k=1.0-smoothstep(0.25,0.9,length(fwidth(b*0.9)));float g=mix(0.5,fbm(b*0.9),k),rk=mix(0.5,fbm(b*0.32+7.0),k);'
         +' vec3 alb=mix(vec3(0.055,0.047,0.038),vec3(0.088,0.090,0.047),smoothstep(0.46,0.6,g));alb=mix(alb,vec3(0.064,0.061,0.057),smoothstep(0.5,0.58,rk));'
         +' alb=mix(alb,vec3(0.006,0.006,0.007),sc);'
         /* 山頂 32 m 四方：Blender で焼いた色と凹凸（法線、Blender の物体座標） */
         +' vec2 puv=vec2(vW.x,-vW.z)/'+PATCH_SIZE.toFixed(1)+'+0.5;float pw=1.0-smoothstep(0.40,0.49,max(abs(puv.x-0.5),abs(puv.y-0.5)));'
         +' if(pw>0.0){vec3 pa=pow(texture2D(tAlb,puv).rgb,vec3(2.2));vec3 pn=texture2D(tNrm,puv).rgb*2.0-1.0;pn=normalize(vec3(pn.x,pn.z,-pn.y));'
         +'  alb=mix(alb,pa,pw);N=normalize(mix(Ng,pn,pw));}'
        :' vec3 alb=vec3(0.068,0.064,0.060)*(0.8+0.4*vnoise(b*7.0));',
      /* 焼き込みの光は滑らかな面の向きで焼いてある。細かな凹凸の分だけ、空の見え方で明るさを揺らす */
      ' vec3 col=alb*irr*(0.55+0.45*max(N.y,0.0))/(0.55+0.45*max(Ng.y,0.05));',
      /* 石の艶（粗さ 0.85）：ぼけた空の映り込み。縁の焼けは艶が強い（粗さ 0.25） */
      ' vec3 V=normalize(cameraPosition-vW);float cv=clamp(dot(N,V),0.0,1.0);float rg=mix(0.85,0.25,sc);',
      ' float Fr=0.04+(max(1.0-rg,0.04)-0.04)*pow(1.0-cv,5.0);vec3 R=reflect(-V,N);R.y=max(R.y,0.02);',
      ' col+=envLod(tSky,R,mix(6.5,3.0,sc))*Fr;',
      /* 殻（球電）の光：球面の光源として、殻の表面からの距離で弱まる。稲妻の明滅で揺らぐ（uArc）。
       * 殻の中（抉れた窪み）は光源に近すぎて強さが跳ねるので、近さに上限を設け、窪みの内側は弱める */
      ' vec3 L=vec3(0.0,'+CZ.toFixed(2)+',0.0)-vW;float dl=length(L);float ds=max(dl-'+(RS*0.8).toFixed(2)+',0.9);float inb=mix(0.25,1.0,smoothstep('+(RS*0.85).toFixed(2)+','+(RS*1.02).toFixed(2)+',dl));',
      /* 殻の光そのものは焼き込み済み（Blender の shell_glow 2500 W）。ここでは稲妻の明滅の分だけ足す */
      ' col+=alb*vec3(0.62,0.80,1.0)*(uShellK*uArc)*inb*max(dot(N,L/dl),0.0)/(ds*ds);',
      /* 縁の赤熱（冷えかけ、ゆっくり息をする） */
      ' col+=vec3(1.0,0.12,0.013)*1.4*pow(sc,3.0)*(0.85+0.15*sin(uTime*1.3+b.x*2.0));',
      ' gl_FragColor=vec4(col,1.0);}'].join('\n')});
}

/* ---------------------------------------------------------------- 殻（球電） */
function makeShell(){
  var g=new T.SphereGeometry(RS,160,80);g.translate(0,CZ,0);
  var m=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
    uniforms:{uTime:U.time,uArc:U.arc},
    vertexShader:'varying vec3 vW;varying vec3 vN;void main(){vN=normalize(normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:['uniform float uTime;uniform float uArc;varying vec3 vW;varying vec3 vN;',GL_NOISE,
      'void main(){vec3 V=normalize(cameraPosition-vW);float d=clamp(abs(dot(normalize(vN),V)),0.0,1.0);',
      /* Blender の Layer Weight（Facing、ぼかし 0.35）→ 1 − |cos|^0.7 */
      ' float f=clamp(1.0-pow(d,0.7),0.0,1.0);vec3 o=vW-vec3(0.0,'+CZ.toFixed(2)+',0.0);vec3 b=vec3(o.x,-o.z,o.y);',
      ' float nz=fbm(b*4.0+vec3(0.0,0.0,uTime*0.35));',
      ' float s=pow(f,4.5)*(0.55+0.9*nz)*2.2*(0.8+0.5*uArc)+0.004;',
      ' gl_FragColor=vec4(vec3(0.62,0.80,1.0)*s,1.0);}'].join('\n')});
  var o=new T.Mesh(g,m);o.renderOrder=40;return o;
}

/* ---------------------------------------------------------------- 山頂の高さ（Blender の ground_z を 12.5 cm 刻みで。外は滑らかな近似） */
var HGT=null;
function groundY(x,z){
  var by=-z;
  if(HGT){var n=HGT.n,S=HGT.size,u=(x/S+0.5)*(n-1),v=(by/S+0.5)*(n-1);
    if(u>=0&&v>=0&&u<=n-1&&v<=n-1){var i=Math.min(Math.floor(u),n-2),j=Math.min(Math.floor(v),n-2),fu=u-i,fv=v-j,M=HGT.mm;
      return ((M[j*n+i]*(1-fu)+M[j*n+i+1]*fu)*(1-fv)+(M[(j+1)*n+i]*(1-fu)+M[(j+1)*n+i+1]*fu)*fv)/1000;}}
  var r=Math.hypot(x,z);return -0.0025*Math.min(r,14)*Math.min(r,14);
}

/* ---------------------------------------------------------------- 放電の筋（殻の表面を這う稲妻・縁から地面へ） */
function makeArcs(){
  var MAXP=2400;
  var g=new T.BufferGeometry();
  var pos=new Float32Array(MAXP*2*3),nxt=new Float32Array(MAXP*2*3),side=new Float32Array(MAXP*2),inten=new Float32Array(MAXP*2),idx=new Uint32Array(MAXP*6);
  g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('aNext',new T.BufferAttribute(nxt,3));
  g.setAttribute('aSide',new T.BufferAttribute(side,1));g.setAttribute('aI',new T.BufferAttribute(inten,1));g.setIndex(new T.BufferAttribute(idx,1));
  var m=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
    uniforms:{uRes:{value:new T.Vector2(1,1)},uPx:{value:1}},
    vertexShader:['attribute vec3 aNext;attribute float aSide;attribute float aI;uniform vec2 uRes;uniform float uPx;varying float vI;varying float vS;',
      'void main(){vec4 a=projectionMatrix*viewMatrix*vec4(position,1.0);vec4 b=projectionMatrix*viewMatrix*vec4(aNext,1.0);',
      ' vec2 sa=a.xy/a.w*uRes,sb=b.xy/b.w*uRes;vec2 d=normalize(sb-sa+1e-5);vec2 n=vec2(-d.y,d.x);',
      /* 太さは画面上 1.6 px（実寸 3.5 mm より細くならない） */
      ' float w=max(1.6*uPx,0.0035*uRes.y*projectionMatrix[1][1]/a.w);',
      ' a.xy+=n*aSide*w/uRes*a.w;vI=aI;vS=aSide;gl_Position=a;}'].join('\n'),
    fragmentShader:'varying float vI;varying float vS;void main(){float c=1.0-vS*vS;gl_FragColor=vec4(vec3(0.72,0.86,1.0)*vI*(0.35+0.65*c),1.0);}'});
  var o=new T.Mesh(g,m);o.frustumCulled=false;o.renderOrder=38;
  var R=RS*1.004,C=new T.Vector3(0,CZ,0);
  var bolts=[];   /* {pts:[Vector3], life, age, br} */
  function rnd(){return Math.random();}
  function gauss(){return Math.sqrt(-2*Math.log(1-rnd()))*Math.cos(TAU*rnd());}
  function walk(p,n,step,jit){
    var pts=[p.clone()],q=p.clone(),nr=q.clone().sub(C).normalize();
    var d=new T.Vector3(gauss(),gauss(),gauss());d.sub(nr.clone().multiplyScalar(d.dot(nr))).normalize();var d0=d.clone();
    for(var k=0;k<n;k++){
      d=d0.clone().add(new T.Vector3(gauss(),gauss(),gauss()).multiplyScalar(jit));
      nr=q.clone().sub(C).normalize();d.sub(nr.clone().multiplyScalar(d.dot(nr))).normalize();
      q.add(d.multiplyScalar(step));q.sub(C).setLength(R).add(C);
      if(q.y<0.0)break;pts.push(q.clone());
    }
    return pts;
  }
  function spawn(){
    var v=new T.Vector3(gauss(),Math.abs(gauss())*0.8-0.1,gauss()).normalize();
    var p=C.clone().add(v.multiplyScalar(R));
    var main=walk(p,14+Math.floor(rnd()*20),0.11,0.55),list=[main];
    var nb=Math.floor(rnd()*4);
    for(var b=0;b<nb&&main.length>3;b++){list.push(walk(main[1+Math.floor(rnd()*(main.length-1))],4+Math.floor(rnd()*7),0.08,0.7));}
    return list;
  }
  function spawnGround(){
    /* 殻の下側（真下から 0.55 rad 以内）から 0.5 m の隙間を渡って地面へ落ち、地面を少し這う */
    var th=rnd()*0.55,a=rnd()*TAU,st=Math.sin(th);
    var p0=new T.Vector3(st*Math.cos(a)*R,CZ-Math.cos(th)*R,-st*Math.sin(a)*R);
    var rh=Math.hypot(p0.x,p0.z)+0.1+rnd()*0.5,a2=a+gauss()*0.25;
    var p1=new T.Vector3(rh*Math.cos(a2),0,-rh*Math.sin(a2));p1.y=groundY(p1.x,p1.z)+0.01;
    var n=7+Math.floor(rnd()*5),pts=[],k;
    for(k=0;k<=n;k++){var p=p0.clone().lerp(p1,k/n);if(k>0&&k<n)p.add(new T.Vector3(gauss()*0.05,gauss()*0.02,gauss()*0.05));pts.push(p);}
    var q=p1.clone(),m=3+Math.floor(rnd()*6);
    for(k=0;k<m;k++){q.add(new T.Vector3(Math.cos(a2)*0.08+gauss()*0.05,0,-Math.sin(a2)*0.08+gauss()*0.05));q.y=groundY(q.x,q.z)+0.01;pts.push(q.clone());}
    return [pts];
  }
  for(var i=0;i<10;i++)bolts.push({lines:spawn(),life:0.15+rnd()*0.6,age:rnd()*0.5,br:0.6+rnd()*0.6,ground:false,rest:0});
  for(i=0;i<4;i++)bolts.push({lines:spawnGround(),life:0.1+rnd()*0.4,age:rnd()*0.3,br:0.5+rnd()*0.6,ground:true,rest:0});
  var acc=0;
  function update(dt){
    acc+=dt;var flick=0,n=0;
    bolts.forEach(function(bt){
      bt.age+=dt;
      /* 光り終えたら少し休み（0〜0.9 秒）、別の場所に走り直す */
      if(bt.age>bt.life+bt.rest){bt.lines=bt.ground?spawnGround():spawn();bt.age=0;bt.life=(bt.ground?0.08:0.12)+rnd()*(bt.ground?0.35:0.7);bt.rest=rnd()*0.9;bt.br=0.5+rnd()*0.8;}
    });
    var vi=0,ii=0,pc=0;
    for(var b=0;b<bolts.length;b++){
      var bt=bolts[b],x=bt.age/bt.life,env=x>1?0:Math.min(1,x*12)*(1-Math.pow(x,3)),fl=0.65+0.35*Math.sin(clock.t*83+b*7.1);
      if(env<=0)continue;
      var I=26*bt.br*env*fl;flick+=env*bt.br;
      for(var l=0;l<bt.lines.length;l++){
        var pts=bt.lines[l],Ii=I*(l?0.6:1);
        if(pts.length<2)continue;
        if(pc+pts.length>MAXP)break;
        for(var k=0;k<pts.length;k++){
          var p=pts[k],q=pts[Math.min(k+1,pts.length-1)];if(k===pts.length-1){q=p.clone().add(p.clone().sub(pts[k-1]));}
          for(var s=0;s<2;s++){var j=(pc+k)*2+s;pos[j*3]=p.x;pos[j*3+1]=p.y;pos[j*3+2]=p.z;nxt[j*3]=q.x;nxt[j*3+1]=q.y;nxt[j*3+2]=q.z;side[j]=s?1:-1;inten[j]=Ii;}
          if(k<pts.length-1){var a0=(pc+k)*2;idx[ii++]=a0;idx[ii++]=a0+1;idx[ii++]=a0+2;idx[ii++]=a0+1;idx[ii++]=a0+3;idx[ii++]=a0+2;}
        }
        pc+=pts.length;
      }
    }
    g.setDrawRange(0,ii);
    ['position','aNext','aSide','aI'].forEach(function(k){g.attributes[k].needsUpdate=true;});g.index.needsUpdate=true;
    U.arc.value=clamp(flick/bolts.length*2.2,0,1.5);
  }
  update(0);
  return {obj:o,update:update,mat:m};
}

/* ---------------------------------------------------------------- レンズ（球殻の球面三角形） */
function lensGeometry(r,t,side,n){
  var ca=Math.sqrt((Math.cos(side)+0.5)/1.5),sa=Math.sqrt(1-ca*ca),D=[],pos=[],nor=[],idx=[],i,j,s_;
  for(i=0;i<3;i++){var p=i*TAU/3;D.push(new T.Vector3(sa*Math.cos(p),ca,-sa*Math.sin(p)));}
  function dir(i,j){return new T.Vector3().addScaledVector(D[0],i).addScaledVector(D[1],j).addScaledVector(D[2],n-i-j).normalize();}
  function id(i,j){return i*(n+1)-i*(i-1)/2+j;}
  /* 外面（法線は外向き）と内面（中心向き）。三角形の並びは表が外を向くように。
   * 反対側（中心について点対称）にもう一枚：位置と法線を反転し、三角形の並びも裏返す（作者指示 2026-09-24） */
  for(var pr=0;pr<2;pr++){var sgp=pr?-1:1;if(pr){for(i=0;i<3;i++)D[i].negate();}var fi=idx.length;
  for(s_=0;s_<2;s_++){var rad=s_?r-t:r,sg=s_?-1:1,base=pos.length/3;
    for(i=0;i<=n;i++)for(j=0;j<=n-i;j++){var d=dir(i,j);pos.push(d.x*rad,d.y*rad,d.z*rad);nor.push(d.x*sg,d.y*sg,d.z*sg);}
    for(i=0;i<n;i++)for(j=0;j<n-i;j++){var a=base+id(i,j),b=base+id(i+1,j),c=base+id(i,j+1);
      if(s_)idx.push(a,c,b);else idx.push(a,b,c);
      if(j<n-i-1){var e=base+id(i+1,j+1);if(s_)idx.push(b,c,e);else idx.push(b,e,c);}}}
  /* 三つの切り口：中心を通る平面。面ごとに頂点を分けて平らな法線に */
  var loop=[];for(i=0;i<n;i++)loop.push([i,0]);for(i=0;i<n;i++)loop.push([n-i,i]);for(i=0;i<n;i++)loop.push([0,n-i]);
  for(var k=0;k<loop.length;k++){
    var L1=loop[(k+1)%loop.length],A=dir(loop[k][0],loop[k][1]),B=dir(L1[0],L1[1]);
    var nw=new T.Vector3().crossVectors(A,B).normalize().multiplyScalar(-sgp),base2=pos.length/3;   /* 反対側の一枚では外向きが逆 */
    [[A,r],[A,r-t],[B,r],[B,r-t]].forEach(function(q){pos.push(q[0].x*q[1],q[0].y*q[1],q[0].z*q[1]);nor.push(nw.x,nw.y,nw.z);});
    idx.push(base2,base2+1,base2+2,base2+2,base2+1,base2+3);
  }
  if(pr){for(k=fi;k<idx.length;k+=3){var tmp=idx[k+1];idx[k+1]=idx[k+2];idx[k+2]=tmp;}}
  }
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setIndex(idx);
  g.computeBoundingSphere();return g;
}
function makeRings(){
  ringRoot=new T.Object3D();ringRoot.position.set(0,CZ,0);
  RINGS.forEach(function(rd,k){
    var g=lensGeometry(rd.r,LENS_T,LENS_SIDE,48);
    var col=new T.Vector3().fromArray(rd.col);
    /* 1）透過：背後の光に（1 − 反射）× 厚みの分の吸収を掛ける */
    var VS='varying vec3 vW;varying vec3 vN;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
    var GL_T=['uniform vec3 uCol;uniform float uAbs;',
      'vec3 trans(float c){float path='+(LENS_T*0.5).toFixed(3)+'/max(c,0.12);return exp(-uAbs*path*(vec3(1.0)-uCol))*(1.0-(0.04+0.96*pow(1.0-c,5.0)));}'].join('\n');
    var mTint=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
      blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.ZeroFactor,blendDst:T.SrcColorFactor,
      uniforms:{uCol:{value:col},uAbs:{value:rd.abs}},vertexShader:VS,
      fragmentShader:[GL_T,'varying vec3 vW;varying vec3 vN;',
        'void main(){vec3 V=normalize(cameraPosition-vW);float c=clamp(abs(dot(normalize(vN),V)),0.0,1.0);gl_FragColor=vec4(trans(c),1.0);}'].join('\n')});
    /* 2）反射と屈折：空の映り込み（Fresnel）、背景をずらして取った差し分（屈折）、縁だけのごく弱い自色 */
    var mAdd=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,
      uniforms:{uCol:{value:col},uAbs:{value:rd.abs},uGlow:{value:rd.glow},tSky:{value:SKY_TEX},tBg:BG,uRes:RES},extensions:{shaderTextureLOD:true},vertexShader:VS,
      fragmentShader:[GL_T,'uniform float uGlow;uniform sampler2D tSky,tBg;uniform vec2 uRes;varying vec3 vW;varying vec3 vN;',GL_DECODE,GL_ENV,
        'void main(){vec3 V=normalize(cameraPosition-vW);vec3 N=normalize(vN);if(dot(N,V)<0.0)N=-N;float c=clamp(dot(N,V),0.0,1.0);',
        ' float F=0.04+0.96*pow(1.0-c,5.0);float edge=pow(1.0-c,3.0);',
        /* 屈折：厚み 3 cm の薄い殻なので像のずれはわずか。手前の面だけ（裏の面や重なりで二重に引かれて暗い残像になるのを防ぐ） */
        ' vec2 uv=gl_FragCoord.xy/uRes;vec3 nv=normalize((viewMatrix*vec4(N,0.0)).xyz);vec2 o=nv.xy*0.008*(1.0-c);',
        ' vec3 refr=gl_FrontFacing?(texture2D(tBg,uv-o).rgb-texture2D(tBg,uv).rgb)*trans(c):vec3(0.0);',
        /* 殻の内側の光も映る（青白い球面の平均） */
        ' vec3 col=(envLod(tSky,reflect(-V,N),0.0)+vec3(0.05,0.065,0.09))*F+refr+uCol*uGlow*(0.04+0.9*edge)*0.5;',
        ' gl_FragColor=vec4(col,1.0);}'].join('\n')});
    var holder=new T.Object3D();ringRoot.add(holder);
    var m1=new T.Mesh(g,mTint),m2=new T.Mesh(g,mAdd);m1.renderOrder=30+k*2;m2.renderOrder=31+k*2;
    holder.add(m1,m2);holder.quaternion.copy(SPIN[k].q0);
    rings.push({holder:holder,spin:SPIN[k],q:SPIN[k].q0.clone(),t:0});
  });
  return ringRoot;
}
function omega(sp,t,out){
  for(var i=0;i<3;i++){var c=sp.c[i],v=0;for(var j=0;j<4;j++)v+=c.a[j]*Math.sin(c.f[j]*t+c.p[j]);out.setComponent(i,v);}
  return out;
}
var _w=new T.Vector3(),_dq=new T.Quaternion();
/* 向き：角速度（世界の枠）を 1/120 秒刻みで積分する。時刻が戻ったら最初から。大きく飛んだら 120 秒前から */
function updateRings(t){
  for(var k=0;k<rings.length;k++){
    var r=rings[k];
    if(t<r.t-1e-6||t-r.t>120){r.q.copy(r.spin.q0);r.t=Math.max(0,t-120);}
    while(r.t<t-1e-9){
      var h=Math.min(1/120,t-r.t);omega(r.spin,r.t+h/2,_w);var ang=_w.length()*h;
      if(ang>1e-9){_dq.setFromAxisAngle(_w.normalize(),ang);r.q.premultiply(_dq).normalize();}
      r.t+=h;
    }
    r.holder.quaternion.copy(r.q);
  }
}

/* ---------------------------------------------------------------- 黒いもや（3D ノイズを光線で辿る） */
function noise3D(N){
  var data=new Uint8Array(N*N*N),lat={};
  function hash(x,y,z,p){x=((x%p)+p)%p;y=((y%p)+p)%p;z=((z%p)+p)%p;var h=(x*374761393+y*668265263+z*1440662683+p*97)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;}
  var oct=[8,16,32],amp=[0.55,0.3,0.15];
  for(var z=0;z<N;z++)for(var y=0;y<N;y++)for(var x=0;x<N;x++){
    var s=0;
    for(var o=0;o<3;o++){
      var p=oct[o],fx=x*p/N,fy=y*p/N,fz=z*p/N,ix=Math.floor(fx),iy=Math.floor(fy),iz=Math.floor(fz),tx=fx-ix,ty=fy-iy,tz=fz-iz;
      tx=tx*tx*(3-2*tx);ty=ty*ty*(3-2*ty);tz=tz*tz*(3-2*tz);
      function L(a,b,c){return hash(ix+a,iy+b,iz+c,p);}
      var v=((L(0,0,0)*(1-tx)+L(1,0,0)*tx)*(1-ty)+(L(0,1,0)*(1-tx)+L(1,1,0)*tx)*ty)*(1-tz)+((L(0,0,1)*(1-tx)+L(1,0,1)*tx)*(1-ty)+(L(0,1,1)*(1-tx)+L(1,1,1)*tx)*ty)*tz;
      s+=amp[o]*v;
    }
    data[(z*N+y)*N+x]=Math.round(s*255);
  }
  var t=new T.DataTexture3D(data,N,N,N);t.format=T.RedFormat;t.type=T.UnsignedByteType;t.minFilter=t.magFilter=T.LinearFilter;
  t.wrapS=t.wrapT=t.wrapR=T.RepeatWrapping;t.unpackAlignment=1;t.needsUpdate=true;return t;
}
function makeHaze(){
  var R=1.3,g=new T.SphereGeometry(R,40,20);g.translate(0,CZ,0);
  var m=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.FrontSide,
    blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.OneFactor,blendDst:T.SrcAlphaFactor,
    uniforms:{tN:{value:noise3D(64)},uTime:U.time},
    vertexShader:'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:['precision highp sampler3D;uniform sampler3D tN;uniform float uTime;varying vec3 vW;',
      'const vec3 C=vec3(0.0,'+CZ.toFixed(2)+',0.0);const float R='+R.toFixed(2)+';',
      'float dens(vec3 p){vec3 o=p-C;float r=length(o);',
      /* Blender：ノイズ（拡大 2.1）を閾 0.47〜0.62 で切り、半径 0.35〜1.15 で薄める、× 14 */
      ' vec3 q=o/3.8+vec3(uTime*0.012,uTime*0.02,-uTime*0.009);float n=texture(tN,q).r*0.72+texture(tN,q*2.7+0.37).r*0.28;',
      ' return smoothstep(0.47,0.62,n)*clamp((1.15-r)/0.8,0.0,1.0)*14.0;}',
      'void main(){vec3 ro=cameraPosition,rd=normalize(vW-cameraPosition);vec3 oc=ro-C;float b=dot(oc,rd),c=dot(oc,oc)-R*R,h=b*b-c;if(h<0.0)discard;',
      ' h=sqrt(h);float t0=max(-b-h,0.0),t1=-b+h;float dt=(t1-t0)/22.0,Tr=1.0;vec3 E=vec3(0.0);',
      ' float j=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);',
      ' for(int i=0;i<22;i++){vec3 p=ro+rd*(t0+(float(i)+j)*dt);float d=dens(p);float a=exp(-d*dt);',
      /* ごく暗い散乱と、Blender の 0.12 の淡い自発光（桃・白・青緑） */
      '  vec3 ec=mix(vec3(1.0,0.02,0.39),vec3(0.0,0.72,0.58),smoothstep(0.35,0.65,texture(tN,(p-C)/7.0).r));',
      /* Blender は発光 0.12 × 密度、吸収 14 × 密度 → 不透明 1 あたりの発光は 0.12 / 14 */
      '  E+=Tr*(1.0-a)*(vec3(0.0035,0.0033,0.004)+ec*0.0086);Tr*=a;}',
      ' gl_FragColor=vec4(E,Tr);}'].join('\n')});
  var o=new T.Mesh(g,m);o.renderOrder=20;return o;
}

/* ---------------------------------------------------------------- コードレインのホログラム */
/* 升（CELL × ROW）に文字の板を置く。形の升は、雨の頭が通った後に灯り、入れ替えのときは次の頭が通ると消える。
 * 雨の列は形の升がある列だけに降り、頭は白く、尾は形の色で薄れていく。文字は時々書き換わる */
function makeHolo(doc,bin,glyphs){
  var CELL=doc.cell,ROW=doc.row,out={};
  var common={uTime:U.time,tG:{value:glyphs},uCell:{value:new T.Vector2(CELL,ROW)}};
  var VS_HEAD=['attribute vec3 aCell;attribute vec4 aInfo;uniform float uTime;uniform vec2 uCell;uniform float uIn;uniform float uOut;uniform vec3 uCol;uniform vec3 uCam0;',
    'varying vec2 vUv;varying vec3 vC;varying float vA;',
    'float hh(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}'].join('\n');
  function billboard(){return [
    ' vec3 right=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);vec3 up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);',
    ' vec3 wp=W+right*position.x*uCell.x*0.84+up*position.y*uCell.y*0.84;',
    ' float gi=floor(hh(vec3(aCell.xz,aCell.y*0.37)+floor(uTime*(1.5+3.0*hh(aCell.zyx)))*vec3(1.3,2.1,0.7))*256.0);',
    ' vUv=(vec2(mod(gi,16.0),15.0-floor(gi/16.0))+(position.xy+0.5))/16.0;',
    ' gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);'].join('\n');}
  var FS=['uniform sampler2D tG;varying vec2 vUv;varying vec3 vC;varying float vA;',
    'void main(){if(vA<0.004)discard;float g=texture2D(tG,vUv).r;if(g<0.5)discard;gl_FragColor=vec4(vC*vA,1.0);}'].join('\n');
  /* 列ごとの雨：速さ（行/秒）と位相は列の位置から。頭は形の上端 top から下端 bottom−4 へ落ちて繰り返す（形の上には降らせない） */
  var RAIN=['float spd(vec2 c){return 7.0+8.0*hh(vec3(c,3.7));}',
    'float headRow(vec2 c,float top,float bot,float t){float L=top-bot+5.0;return top-floor(mod(t*spd(c)+hh(vec3(c,9.1))*L,L));}'].join('\n');
  HOLO_ORDER.forEach(function(name){
    var sd=doc.shapes[name];
    var cell=new Int16Array(bin,sd.cells[0],sd.cells[1]),lum=new Uint8Array(bin,sd.lum[0],sd.lum[1]),n=sd.count;
    /* 列ごとに、形のある区間（途中で 3 行より長く途切れたら別の区間）を求める。雨は区間の中だけに降る */
    var cols={},i,key;
    for(i=0;i<n;i++){key=cell[i*3]+','+cell[i*3+2];(cols[key]=cols[key]||[]).push(i);}
    var runTop=new Float32Array(n),runBot=new Float32Array(n),runs=[];
    Object.keys(cols).forEach(function(k){
      var ids=cols[k].sort(function(a,b){return cell[b*3+1]-cell[a*3+1];}),st=0;
      for(var j=1;j<=ids.length;j++){
        if(j===ids.length||cell[ids[j-1]*3+1]-cell[ids[j]*3+1]>3){
          var top=cell[ids[st]*3+1],bot=cell[ids[j-1]*3+1];
          for(var q=st;q<j;q++){runTop[ids[q]]=top;runBot[ids[q]]=bot;}
          runs.push([cell[ids[st]*3],cell[ids[st]*3+2],top,bot]);st=j;}
      }
    });
    /* 形の升 */
    var aC=new Float32Array(n*3),aI=new Float32Array(n*4);
    for(i=0;i<n;i++){aC[i*3]=cell[i*3];aC[i*3+1]=cell[i*3+1];aC[i*3+2]=cell[i*3+2];aI[i*4]=lum[i]/255;aI[i*4+1]=runTop[i];aI[i*4+2]=runBot[i];aI[i*4+3]=0;}
    /* 雨の尾：区間ごとに SLOT 枚（0 が頭）。尾の長さは区間の長さまで */
    var SLOT=14,m=runs.length*SLOT,rC=new Float32Array(m*3),rI=new Float32Array(m*4);
    runs.forEach(function(r,j){var h=r[2]-r[3]+1;for(var s=0;s<SLOT;s++){var q=j*SLOT+s;rC[q*3]=r[0];rC[q*3+1]=0;rC[q*3+2]=r[1];rI[q*4]=s;rI[q*4+1]=r[2];rI[q*4+2]=r[3];rI[q*4+3]=Math.min(h+1,3+Math.floor(Math.random()*13));}});
    var col=new T.Vector3().fromArray(HOLO_COL[name]);
    function inst(C,I,count,vsBody,order){
      var g=new T.InstancedBufferGeometry();var base=new T.PlaneGeometry(1,1);
      g.setIndex(base.index);g.setAttribute('position',base.getAttribute('position'));
      g.setAttribute('aCell',new T.InstancedBufferAttribute(C,3));g.setAttribute('aInfo',new T.InstancedBufferAttribute(I,4));
      g.instanceCount=count;
      var mat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        uniforms:Object.assign({uIn:{value:-1e4},uOut:{value:1e9},uCol:{value:col},uCam0:{value:new T.Vector3()}},common),
        vertexShader:[VS_HEAD,RAIN,'void main(){',vsBody,billboard(),'}'].join('\n'),fragmentShader:FS});
      var o=new T.Mesh(g,mat);o.frustumCulled=false;o.renderOrder=order;o.visible=false;return o;
    }
    /* 形：通った頭の数で灯り、入れ替え後に次の頭が通ると消える */
    var vsShape=[
      ' vec2 c=aCell.xz;float top=aInfo.y,bot=aInfo.z,row=aCell.y;float dy=top-row;',
      ' float on=step(dy,(uTime-uIn)*spd(c))*(1.0-step(dy,(uTime-uOut)*spd(c)));',
      ' vec3 W=vec3(c.x*uCell.x,'+CZ.toFixed(3)+'+row*uCell.y,c.y*uCell.x);',
      ' vA=on*aInfo.x*(0.8+0.2*hh(aCell+floor(uTime*6.0)))*10.0;vC=uCol;'].join('\n');
    /* 尾：頭の位置から上へ SLOT 行。形が出ている間と、消えるまでの一巡だけ降る */
    var vsRain=[
      ' vec2 c=aCell.xz;float top=aInfo.y,bot=aInfo.z,s=aInfo.x,len=aInfo.w;float h=headRow(c,top,bot,uTime);float row=h+s;',
      ' float live=step(uIn,uTime)*(1.0-step(uOut+(top-bot+5.0)/spd(c),uTime));',
      ' float k=s/len;float a=s<0.5?1.6:(s<len?0.55*pow(1.0-k,1.5)+0.03:0.0);',
      ' vec3 W=vec3(c.x*uCell.x,'+CZ.toFixed(3)+'+row*uCell.y,c.y*uCell.x);',
      ' vA=live*a*10.0*(row<=top&&row>=bot-1.0?1.0:0.0);vC=s<0.5?vec3(0.95,0.9,0.95):uCol;'].join('\n');
    out[name]={shape:inst(aC,aI,n,vsShape,24),rain:inst(rC,rI,m,vsRain,25)};
  });
  /* メトロノームの振子：77 拍/分で振れる。振れた点を升に揃える */
  var pd=doc.pendulum,pp=new Float32Array(bin,pd.points[0],pd.points[1]),np=pd.count;
  var pC=new Float32Array(np*3),pI=new Float32Array(np*4);for(var i=0;i<np*3;i++)pC[i]=pp[i];for(i=0;i<np;i++){pI[i*4]=1;}
  var g=new T.InstancedBufferGeometry();var base=new T.PlaneGeometry(1,1);g.setIndex(base.index);g.setAttribute('position',base.getAttribute('position'));
  g.setAttribute('aCell',new T.InstancedBufferAttribute(pC,3));g.setAttribute('aInfo',new T.InstancedBufferAttribute(pI,4));g.instanceCount=np;
  var pm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    uniforms:Object.assign({uIn:{value:-1e4},uOut:{value:1e9},uCol:{value:new T.Vector3().fromArray(TEAL)},uCam0:{value:new T.Vector3()},
      uPivot:{value:new T.Vector3().fromArray(pd.pivot)},uW:{value:Math.PI*pd.bpm/60},uSw:{value:pd.swing_deg*Math.PI/180}},common),
    vertexShader:[VS_HEAD,RAIN,'uniform vec3 uPivot;uniform float uW;uniform float uSw;','void main(){',
      ' float an=uSw*sin(uTime*uW);float ca=cos(an),sa=sin(an);vec3 p=aCell;vec3 q=vec3(p.x*ca-p.y*sa,p.x*sa+p.y*ca,p.z);',
      ' vec3 W=uPivot+q;W.x=floor(W.x/uCell.x+0.5)*uCell.x;W.z=floor(W.z/uCell.x+0.5)*uCell.x;W.y='+CZ.toFixed(3)+'+floor((W.y-'+CZ.toFixed(3)+')/uCell.y+0.5)*uCell.y;',
      ' float on=step(uIn+1.2,uTime)*(1.0-step(uOut+0.4,uTime));vA=on*0.8*10.0;vC=uCol;',
      billboard(),'}'].join('\n'),fragmentShader:FS});
  pend=new T.Mesh(g,pm);pend.frustumCulled=false;pend.renderOrder=26;pend.visible=false;
  return out;
}
/* 入れ替えの予定：時刻 t にどれが出ていて、いつ入り、いつ出るか */
function holoSchedule(t){
  var cyc=HOLD+SWAP,i=Math.floor(t/cyc),n=HOLO_ORDER.length;
  var cur=((i%n)+n)%n,t0=i*cyc;
  return {cur:HOLO_ORDER[cur],prev:HOLO_ORDER[(cur+n-1)%n],tIn:t0,tOutPrev:t0,tOutCur:t0+cyc};
}
function updateHolo(t){
  var s=holoSchedule(t);
  HOLO_ORDER.forEach(function(name){
    var h=holo[name],on=name===s.cur,prev=name===s.prev&&s.tIn>0&&t-s.tIn<SWAP+4.0;
    [h.shape,h.rain].forEach(function(o){
      o.visible=on||prev;
      o.material.uniforms.uIn.value=on?s.tIn:s.tIn-(HOLD+SWAP);
      o.material.uniforms.uOut.value=on?s.tOutCur:s.tOutPrev;
    });
  });
  pend.visible=s.cur==='metronome'||(s.prev==='metronome'&&s.tIn>0&&t-s.tIn<SWAP);
  pend.material.uniforms.uIn.value=s.cur==='metronome'?s.tIn:s.tIn-(HOLD+SWAP);
  pend.material.uniforms.uOut.value=s.cur==='metronome'?s.tOutCur:s.tOutPrev;
}

/* ---------------------------------------------------------------- 後段（全画面） */
var FS_VERT='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
function fsMat(frag,uniforms){return new T.ShaderMaterial({uniforms:uniforms,vertexShader:FS_VERT,fragmentShader:frag,depthTest:false,depthWrite:false});}
function fsDraw(mat,rt){quad.material=mat;renderer.setRenderTarget(rt);renderer.render(sceneBloom,quadCam);}
var HALF=null;
function halfType(){
  if(HALF!==null)return HALF;
  var gl=renderer.getContext(),ok=renderer.capabilities.isWebGL2?!!gl.getExtension('EXT_color_buffer_float')||!!gl.getExtension('EXT_color_buffer_half_float'):!!gl.getExtension('OES_texture_half_float')&&!!gl.getExtension('EXT_color_buffer_half_float');
  HALF=ok?T.HalfFloatType:T.UnsignedByteType;return HALF;
}
function makeRT(w,h,opt){
  var o={type:halfType(),format:T.RGBAFormat,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:!!(opt&&opt.depth),stencilBuffer:false,generateMipmaps:false};
  var rt;if(opt&&opt.msaa&&renderer.capabilities.isWebGL2&&T.WebGLMultisampleRenderTarget){rt=new T.WebGLMultisampleRenderTarget(w,h,o);rt.samples=4;}else rt=new T.WebGLRenderTarget(w,h,o);
  return rt;
}
function makePost(lut){
  sceneBloom=new T.Scene();quadCam=new T.OrthographicCamera(-1,1,1,-1,0,1);
  quad=new T.Mesh(new T.PlaneGeometry(2,2),null);quad.frustumCulled=false;sceneBloom.add(quad);
  bloomPre=fsMat(['uniform sampler2D t;uniform vec2 px;varying vec2 vUv;',
    'vec3 pick(vec2 uv){vec3 c=texture2D(t,uv).rgb;if(any(isnan(c))||any(isinf(c)))c=vec3(0.0);float l=dot(c,vec3(0.2126,0.7152,0.0722));return c*clamp((l-1.0)/max(l,1e-4),0.0,1.0);}',
    'void main(){vec3 s=pick(vUv+px*vec2(-0.5,-0.5))+pick(vUv+px*vec2(0.5,-0.5))+pick(vUv+px*vec2(-0.5,0.5))+pick(vUv+px*vec2(0.5,0.5));gl_FragColor=vec4(s*0.25,1.0);}'].join('\n'),
    {t:{value:null},px:{value:new T.Vector2()}});
  bloomDown=fsMat(['uniform sampler2D t;uniform vec2 px;varying vec2 vUv;',
    'void main(){vec3 s=texture2D(t,vUv).rgb*0.25;',
    ' s+=(texture2D(t,vUv+px*vec2(-1,-1)).rgb+texture2D(t,vUv+px*vec2(1,-1)).rgb+texture2D(t,vUv+px*vec2(-1,1)).rgb+texture2D(t,vUv+px*vec2(1,1)).rgb)*0.125;',
    ' s+=(texture2D(t,vUv+px*vec2(-2,0)).rgb+texture2D(t,vUv+px*vec2(2,0)).rgb+texture2D(t,vUv+px*vec2(0,-2)).rgb+texture2D(t,vUv+px*vec2(0,2)).rgb)*0.0625;',
    ' gl_FragColor=vec4(s,1.0);}'].join('\n'),{t:{value:null},px:{value:new T.Vector2()}});
  finalMat=fsMat(['uniform sampler2D t,b1,b2,b3,b4,b5,b6,lut;uniform float uBloom,uExpo,uTime;varying vec2 vUv;',
    'vec3 slice(vec2 rg,float b){vec2 tile=vec2(mod(b,8.0),floor(b/8.0));return texture2D(lut,(tile*64.0+rg+0.5)/512.0).rgb;}',
    'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.0)+1024.0*max(c,vec3(0.0)))/19.0,0.0,1.0)*63.0;',
    ' float b=floor(p.b);return mix(slice(p.rg,b),slice(p.rg,min(63.0,b+1.0)),p.b-b);}',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uTime)*43758.5453);}',
    'void main(){vec3 c=texture2D(t,vUv).rgb;if(any(isnan(c))||any(isinf(c)))c=vec3(0.0);',
    ' vec3 bl=texture2D(b1,vUv).rgb*0.9+texture2D(b2,vUv).rgb*1.0+texture2D(b3,vUv).rgb*1.0+texture2D(b4,vUv).rgb*0.9+texture2D(b5,vUv).rgb*0.8+texture2D(b6,vUv).rgb*0.7;',
    ' c=(c+uBloom*bl)*uExpo;vec3 d=agx(c);d+=(hash(gl_FragCoord.xy)-0.5)*1.6/255.0;gl_FragColor=vec4(d,1.0);}'].join('\n'),
    {t:{value:null},b1:{value:null},b2:{value:null},b3:{value:null},b4:{value:null},b5:{value:null},b6:{value:null},lut:{value:lut},uBloom:{value:0.07},uExpo:{value:1.0},uTime:{value:0}});
}

/* ---------------------------------------------------------------- 組み立て */
var skyQuad,sea;
function build(geoDoc,geoBin,holoDoc,holoBin,tex){
  HGT=geoDoc.height||null;SKY_TEX=tex.sky;PATCH_ALB=tex.palb;PATCH_NRM=tex.pnrm;PATCH_SIZE=(geoDoc.patch&&geoDoc.patch.size)||32;
  scene=new T.Scene();
  skyQuad=makeSky();scene.add(skyQuad);
  sea=makeSea();scene.add(sea);
  /* 地面・岩：塊ごとに 位置 int16（原点 origin・刻み step → mesh.position / mesh.scale）、添字 uint16 */
  function addGroup(parts,role){
    var mat=makeGroundMaterial(role);
    parts.forEach(function(gd){
      var g=new T.BufferGeometry();
      g.setAttribute('position',new T.BufferAttribute(new Int16Array(geoBin,gd.position[0],gd.position[1]),4));
      g.setAttribute('normal',new T.BufferAttribute(new Int8Array(geoBin,gd.normal[0],gd.normal[1]),4,true));
      g.setAttribute('bake',new T.BufferAttribute(new Uint8Array(geoBin,gd.color[0],gd.color[1]),4,true));
      g.setIndex(new T.BufferAttribute(new Uint16Array(geoBin,gd.index[0],gd.index[1]),1));
      g.computeBoundingSphere();
      var m=new T.Mesh(g,mat);m.position.fromArray(gd.origin);m.scale.setScalar(gd.step);scene.add(m);
    });
  }
  addGroup(geoDoc.groups.ground,0);addGroup(geoDoc.groups.rocks,1);
  sceneB=new T.Scene();sceneB.add(makeRings());
  haze=makeHaze();scene.add(haze);
  holo=makeHolo(holoDoc,holoBin,tex.glyphs);
  HOLO_ORDER.forEach(function(k){scene.add(holo[k].shape,holo[k].rain);});scene.add(pend);
  arcs=makeArcs();sceneB.add(arcs.obj);
  shell=makeShell();sceneB.add(shell);
  makePost(tex.lut);
  copyMat=fsMat('uniform sampler2D t;varying vec2 vUv;void main(){gl_FragColor=texture2D(t,vUv);}',{t:{value:null}});
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
  var key=w+'x'+h+'@'+dpr.toFixed(4);if(key===lastSizeKey&&rtA)return false;lastSizeKey=key;
  pr=dpr;renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);
  renderer.domElement.style.width=w+'px';renderer.domElement.style.height=h+'px';
  renderer.getDrawingBufferSize(size);
  var W=size.x,H=size.y;
  if(!rtA){rtA=makeRT(W,H,{depth:true,msaa:true});rtBg=makeRT(W,H,{});BG.value=rtBg.texture;for(var i=0;i<7;i++)bloomRT.push(makeRT(1,1,{}));}
  rtA.setSize(W,H);rtBg.setSize(W,H);RES.value.set(W,H);
  for(var k=0;k<7;k++)bloomRT[k].setSize(Math.max(1,W>>(k+1)),Math.max(1,H>>(k+1)));
  arcs.mat.uniforms.uRes.value.set(W/2,H/2);arcs.mat.uniforms.uPx.value=dpr;
  camera.aspect=w/h;applyLens();needsRender=true;return true;
}
function applyLens(){
  var a=Math.max(0.05,camera.aspect),hf=2*Math.atan(18/lens),ref=16/9;
  var tv=Math.tan(hf/2)/Math.min(a,ref);
  var cap=Math.tan(39*Math.PI/180);tv=Math.min(tv,cap);
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
  var p=camera.position,c=new T.Vector3(0,CZ,0),d=p.distanceTo(c),m=RS+0.3;
  if(d<m){p.sub(c).setLength(m).add(c);}
  var h=Math.hypot(p.x,p.z);if(h>60){p.x*=60/h;p.z*=60/h;}
  p.y=clamp(p.y,h<16?0.35:-3,40);
}
function setView(i){
  i=Number(i);if(!views[i])return;viewIndex=i;var v=views[i];
  target.copy(v.target);theta=v.theta;phi=v.phi;radius=v.radius;lens=v.lens;portraitScale=portraitK();
  applyLens();updateCamera();userMoved=false;
  if(window.ArmillaryUI&&window.ArmillaryUI.sync)window.ArmillaryUI.sync();
}
function zoom(f){radius=clamp(radius*f,3.0,45.0);updateCamera();}
function reset(){setView(viewIndex);}
function controls(){
  var el=renderer.domElement;el.tabIndex=0;el.setAttribute('aria-label','作品。ドラッグで回転、ホイールや二本指で拡大縮小。矢印キーでも操作できます。');
  el.addEventListener('pointerdown',function(e){
    if(!ready||e.button>0)return;el.focus({preventScroll:true});el.setPointerCapture(e.pointerId);pointers[e.pointerId]={x:e.clientX,y:e.clientY};
    var ids=Object.keys(pointers);if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]];pinchStart=Math.hypot(a.x-b.x,a.y-b.y);pinchRadius=radius;}
  });
  el.addEventListener('pointermove',function(e){
    var pt=pointers[e.pointerId];if(!pt||!ready)return;var ids=Object.keys(pointers),dx=e.clientX-pt.x,dy=e.clientY-pt.y;pt.x=e.clientX;pt.y=e.clientY;
    if(ids.length===1&&(dx||dy)){theta-=dx*0.004;phi=clamp(phi-dy*0.004,0.15,Math.PI*0.62);userMoved=true;updateCamera();}
    else if(ids.length===2){var a=pointers[ids[0]],b=pointers[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinchStart>0){radius=clamp(pinchRadius*pinchStart/Math.max(d,1),3.0,45.0);userMoved=true;updateCamera();}}
  });
  function up(e){delete pointers[e.pointerId];if(Object.keys(pointers).length<2)pinchStart=0;}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);
  el.addEventListener('wheel',function(e){if(!ready)return;e.preventDefault();var dl=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);zoom(Math.exp(clamp(dl,-800,800)*0.0012));userMoved=true;},{passive:false});
  window.addEventListener('blur',function(){pointers={};pinchStart=0;});
  window.addEventListener('keydown',function(e){
    if(!ready||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||(window.ArmillaryUI&&window.ArmillaryUI.isEventOwned(e)))return;
    var tag=e.target&&e.target.tagName;if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA'||tag==='BUTTON'||tag==='A'||(e.target&&e.target.isContentEditable))return;
    var k=e.key,handled=true;
    if(k>='1'&&k<='5')setView(+k-1);else if(k==='r'||k==='R'||k==='Home')reset();
    else if(k==='+'||k==='=')zoom(0.88);else if(k==='-'||k==='_')zoom(1/0.88);
    else if(k==='ArrowLeft'||k==='ArrowRight'){theta+=k==='ArrowLeft'?0.06:-0.06;updateCamera();}
    else if(k==='ArrowUp'||k==='ArrowDown'){phi=clamp(phi+(k==='ArrowUp'?-0.06:0.06),0.15,Math.PI*0.62);updateCamera();}
    else if(k===' ')setPlaying(!playing);
    else handled=false;if(handled)e.preventDefault();
  });
}

/* ---------------------------------------------------------------- 一枚 */
var invPV=new T.Matrix4();
function render(){
  camera.near=0.1;camera.far=40000;camera.updateProjectionMatrix();
  invPV.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).invert();
  skyQuad.material.uniforms.uInvPV.value.copy(invPV);skyQuad.material.uniforms.uCam.value.copy(camera.position);
  sea.material.uniforms.uInvPV.value.copy(invPV);sea.material.uniforms.uCam.value.copy(camera.position);
  /* 一段目：環・放電・殻の後ろにあるもの → 写しを取る → 二段目：環（写しを屈折して覗く）・放電・殻 */
  renderer.setRenderTarget(rtA);renderer.setClearColor(0x000000,1);renderer.clear();renderer.render(scene,camera);
  copyMat.uniforms.t.value=rtA.texture;fsDraw(copyMat,rtBg);
  renderer.setRenderTarget(rtA);renderer.render(sceneB,camera);
  bloomPre.uniforms.t.value=rtA.texture;bloomPre.uniforms.px.value.set(1/size.x,1/size.y);fsDraw(bloomPre,bloomRT[0]);
  for(var i=1;i<7;i++){bloomDown.uniforms.t.value=bloomRT[i-1].texture;bloomDown.uniforms.px.value.set(1/bloomRT[i-1].width,1/bloomRT[i-1].height);fsDraw(bloomDown,bloomRT[i]);}
  var f=finalMat.uniforms;f.t.value=rtA.texture;f.b1.value=bloomRT[1].texture;f.b2.value=bloomRT[2].texture;f.b3.value=bloomRT[3].texture;
  f.b4.value=bloomRT[4].texture;f.b5.value=bloomRT[5].texture;f.b6.value=bloomRT[6].texture;f.uTime.value=(clock.t%17);
  fsDraw(finalMat,null);
}
function advance(t,dt){
  U.time.value=t;updateRings(t);updateHolo(t);arcs.update(dt);
}

/* ---------------------------------------------------------------- 時間（描画の予約は常に 1 本だけ） */
function setPlaying(v){playing=!!v;clock.last=performance.now();needsRender=true;requestFrame();if(window.ArmillaryUI)window.ArmillaryUI.sync();}
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
  if(playing&&ready){clock.t+=dt;needsRender=true;}
  if(needsRender&&ready){
    advance(clock.t,playing?dt:0);
    var t0=performance.now();render();stats.frames++;stats.ms.push(performance.now()-t0);if(stats.ms.length>60)stats.ms.shift();
    needsRender=false;
    if(window.ArmillaryUI)window.ArmillaryUI.afterRender(now);
  }
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
  if(!renderer.capabilities.isWebGL2){fail('この作品は WebGL 2 が必要です。Safari や Chrome の最新版で開き直してください。');return;}
  renderer.outputEncoding=T.LinearEncoding;renderer.toneMapping=T.NoToneMapping;renderer.autoClear=false;
  renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();},false);
  renderer.domElement.addEventListener('webglcontextrestored',function(){location.reload();},false);
  stage.appendChild(renderer.domElement);
  camera=new T.PerspectiveCamera(40,innerWidth/innerHeight,0.05,90000);
  Promise.all([
    fetchJSON(P+'geo.json'),fetchBin(P+'geo.bin'),fetchJSON(P+'holo.json'),fetchBin(P+'holo.bin'),
    loadTex(P+'sky.png',{mips:true,wrapS:T.RepeatWrapping}),loadTex(P+'glyphs.png',{nearest:true}),loadTex(P+'agx-lut.png',{flipY:false}),
    loadTex(P+'patch-albedo.jpg',{mips:true}),loadTex(P+'patch-normal.jpg',{mips:true})
  ]).then(function(r){
    if(r[1].byteLength!==r[0].bytes)throw Error('geo.bin size mismatch');
    if(r[3].byteLength!==r[2].bytes)throw Error('holo.bin size mismatch');
    build(r[0],r[1],r[2],r[3],{sky:r[4],glyphs:r[5],lut:r[6],palb:r[7],pnrm:r[8]});
    resize();
    var want=query.get('view');var vi=views.findIndex(function(v){return v.key===want;});
    setView(vi>=0?vi:0);controls();ready=true;
    addEventListener('resize',function(){if(!resize())return;if(!userMoved)setView(viewIndex);else{portraitScale=portraitK();updateCamera();}});
    if(query.has('time'))clock.t=+query.get('time')||0;
    advance(clock.t,0);render();status('');
    if(query.has('still'))playing=false;
    if(window.ArmillaryUI)window.ArmillaryUI.mount({canvas:renderer.domElement,views:function(){return views;},getViewIndex:function(){return viewIndex;},
      setView:setView,reset:reset,zoom:zoom,getPlaying:function(){return playing;},setPlaying:setPlaying,requestFrame:requestFrame,onLayout:function(){needsRender=true;}});
    requestFrame();
  }).catch(function(e){fail('作品を読み込めませんでした。'+(e&&e.message||e));});
}
window.ArmillaryArtwork={report:function(){var ms=stats.ms.slice().sort(function(a,b){return a-b;});
  return {ready:ready,view:views[viewIndex]&&views[viewIndex].key,frames:stats.frames,quality:quality.scale,cpuMsMedian:ms[ms.length>>1]||0,size:[size.x,size.y],pixelRatio:pr,
    calls:renderer&&renderer.info.render.calls,camera:camera&&camera.position.toArray(),time:clock.t,holo:holoSchedule(clock.t).cur};},
  setView:function(k){var i=views.findIndex(function(v){return v.key===k;});if(i>=0)setView(i);},
  setTime:function(t){clock.t=t;needsRender=true;requestFrame();},setPlaying:setPlaying,
  step:function(t){frame(t);},
  /* 検分用：時刻 t（秒）で一枚描く（RAF を待たない） */
  renderNow:function(t,dt){if(t!=null)clock.t=t;advance(clock.t,dt==null?0.016:dt);render();},
  look:function(pos,tgt,mm){var p=new T.Vector3().fromArray(pos);target.fromArray(tgt);var o=p.sub(target);radius=o.length();
    theta=Math.atan2(o.x,o.z);phi=Math.acos(clamp(o.y/radius,-1,1));if(mm)lens=mm;portraitScale=1;applyLens();updateCamera();userMoved=true;},
  parts:function(o){var m={sky:skyQuad,sea:sea,haze:haze,shell:shell,arcs:arcs&&arcs.obj,rings:ringRoot};Object.keys(o).forEach(function(k){if(m[k])m[k].visible=!!o[k];});
    if(o.holo!=null){HOLO_ORDER.forEach(function(k){holo[k].shape.material.visible=holo[k].rain.material.visible=!!o.holo;});pend.material.visible=!!o.holo;}
    scene.children.forEach(function(c){if(c.isMesh&&c.geometry&&c.geometry.attributes.bake&&o.ground!=null)c.visible=!!o.ground;});},
  _debug:function(){return {arcs:arcs,scene:scene,camera:camera,holo:holo,rings:rings};},
  /* 検分用：rtA（表示変換の前、線形）を丸ごと読む */
  linear:function(){render();var w=size.x,h=size.y,px=new Float32Array(w*h*4);
    var fl=new T.WebGLRenderTarget(w,h,{type:T.FloatType,format:T.RGBAFormat,minFilter:T.NearestFilter,magFilter:T.NearestFilter,depthBuffer:false});
    var cm=fsMat('uniform sampler2D t;varying vec2 vUv;void main(){gl_FragColor=texture2D(t,vUv);}',{t:{value:rtA.texture}});fsDraw(cm,fl);
    renderer.readRenderTargetPixels(fl,0,0,w,h,px);fl.dispose();return {w:w,h:h,px:px};},
  tune:function(o){if(o.shellK!=null)SHELL_K.value=o.shellK;if(o.bloom!=null)finalMat.uniforms.uBloom.value=o.bloom;if(o.expo!=null)finalMat.uniforms.uExpo.value=o.expo;needsRender=true;requestFrame();}};
init();
})();
