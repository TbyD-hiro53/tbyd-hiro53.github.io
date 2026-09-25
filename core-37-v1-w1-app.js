/* Core No.37 v1 w1 — 第十一保守区画の炉室（原作『遅炉 / THE LATE CORE』）。
 * 画は Cycles の一枚を光源ごとに分けた層で、ここで時間の重みを掛けて足し、AgX の表で表示色にする。
 *   base（天井・壁・非常表示・監視室）＋ s(t)·t127（127 基の槽）＋ s(t − 0.78)·t37（三七号）
 *   ＋ pipe（母管）＋ 応答灯（段ごと、巡回の通過で短く点る。三七号の灯だけ一拍あと）
 * 拍 0.78 s と循環 2.4 s の積で打つ。二つは四十拍（十三巡）ごとに揃い直すので、一拍ずれた三七号は拍ごとの強さが違って見える。
 * ONE YEAR（戻せない。作者裁定 2026-09-25 の案 A）：
 *   0〜58 s 早回し：日付が走り、一日一度の巡回が応答灯の波として通路を奥へ駆け抜ける。三七号の灯だけ毎回一拍（0.78 s）遅れる
 *   60〜90 s 消灯：127 基の光と母管がゆっくり落ち、非常表示の青緑だけが残る。闇の中で三七号だけが打ち続ける
 *   132 s 以後の最初の「四十拍の揃い直し」で、127 基が三七号の拍で一斉に点り直す。全段の応答灯が同時に点る。
 *   以後は 128 基が同じ拍で打ち、巡回の灯も三六号と三七号が同時に点る
 *   状態の欄に原作の記録を日付つきで流す（観測の記録は英語表示でも日本語のまま）
 * 描画の予約は schedule() の一本だけ（共有 UI の requestFrame もここへ束ねる）。 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const P='core-37-v1-w1-';
const BEAT=0.78,CIRC=2.4,YEAR_S=180,DAY0=2290,DAYS=366;
const ROW_Y=Array.from({length:16},(_,k)=>12+7*k),WALK_Y0=22,WALK_V=1.3,PATROL=110;
const TAN4=Math.tan(4*Math.PI/180);
const SWEEP_END=58,SWEEP_P=2.0,SWEEP_V=57,DIM0=60,DIM1=90,RELIGHT_MIN=132,ALIGN=40*BEAT;
/* 日付の節目と記録（u = ONE YEAR からの秒。'R' は点り直しの瞬間）。記録は原作の業務・計測記録の語による */
const LOGS=[[6,2291,'三七号炉、応答偏差、正の〇・七八〇秒。揺れない。'],[16,2293,'三七号の応答灯は、座を離れて一拍あとに点った。'],
 [30,2321,'検拍係、応答間隔、正の〇・二一秒。'],[42,2323,'区画の記録系。押鍵は頂の〇・二三秒あと。'],
 [100,2541,'記入の拍は、頂の〇・七八秒あと。ちょうど。'],[116,2600,'五列目、静か。'],['R',2656,'検拍係の扉応答間隔、正の〇・七八〇秒。揺れ、零。']];
const LOG_SHOW=8;
const panels={
 core37:{title:'三七号炉',text:'五列目の五段。三六号と三八号のあいだの座。\n拍のちょうど一拍あと、正の〇・七八〇秒で応答する。負荷を変えても、槽温を振っても、遅れは揺れない。\n搬入台帳に記載はない。保守記録だけが、着工の九十日前から続いている。'},
 tank:{title:'栄養槽',text:'百二十八基の栄養槽は循環系で結ばれ、二・四秒で一巡する。一日の巡数は三万六千ちょうど。\n槽の培養液は苺乳色。基準色票の二番。\n各炉は〇・七八秒の拍で同期する。拍と巡は、四十拍ごとに揃い直す。'},
 lamp:{title:'応答灯',text:'巡回の通過に応じて、通路に面した炉の応答灯が点る。通路を挟んだ向かいの三六号は、巡回が前を過ぎるときに点る。\n三七号の灯だけは、巡回が座を離れて一拍あとに点る。点った位置に、巡回はもういない。'},
 gate:{title:'検拍門',text:'各炉の拍を捕まえる門。捕捉率は百二十七基が九十九・九七パーセント、三七号だけが一〇〇パーセント。\n遅れ幅が完全に一定なので、門は三七号の応答をすべて、一拍前の呼びかけへの応答として捕捉する。'},
 monitor:{title:'中央監視室',text:'通路の突き当たりにある当直の室。保守班三名の会話は、夜間当直帯にここで記録された。\n椅子は三脚。検拍係、培養係、記録係の席。'}
};
const TARGETS=[['core37','三七号炉'],['tank','栄養槽'],['lamp','応答灯'],['gate','検拍門'],['monitor','中央監視室']];
const ID_NAME={1:'tank',2:'gate',3:'monitor',4:'lamp',5:'core37'};

let meta=null,gl=null,prog=null,U={},ids=null,ready=false,raf=0,shown=true,returnFocus=null,lastPointer=null;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,quality='auto',scale=1;
const crop={x:0,y:0,w:1,h:1};
const clock={t:0,running:false,last:null,yearAt:null,relightAt:null};
const frameSamples=[];let adaptAt=0,lastReadout=0;
document.body.classList.toggle('reduce-ui-motion',reduced);

/* ---------------------------------------------------------------- 共有 UI */
const liquid=new H53LiquidHost({source:$('canvas'),requestFrame:schedule,night:true,surfaces:[{selector:'#back,#year,#menuToggle,#showUI',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
window.__h53Liquid=liquid;

function error(e){$('error').hidden=false;$('error').textContent='炉室を表示できませんでした。接続を確認して、もう一度お試しください。\n'+(e&&e.message||String(e));$('loadText').textContent='読み込みを完了できませんでした';$('retry').hidden=false;$('loading').hidden=false;}
addEventListener('error',e=>{if(e.target&&e.target.tagName==='SCRIPT')return;error(e.error||e.message);});addEventListener('unhandledrejection',e=>error(e.reason));$('retry').onclick=()=>location.reload();

/* ---------------------------------------------------------------- 時間 */
function advance(now){if(clock.running&&clock.last!==null)clock.t+=Math.min(.1,(now-clock.last)/1000);clock.last=now;}
function play(){clock.running=true;clock.last=null;}
function pause(){clock.running=false;clock.last=null;}
function smooth(a,b,x){const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);}
function evU(){return clock.yearAt===null?-1:clock.t-clock.yearAt;}
function relit(){return clock.relightAt!==null&&clock.t>=clock.relightAt;}
function yearProgress(){return clock.yearAt===null?0:relit()?1:Math.min(.999,evU()/(clock.relightAt-clock.yearAt));}
function lag(){return relit()?BEAT:0;}
/* 127 基と母管の明るさの倍率：消灯 → 点り直し（0.08 s で立ち上がる） */
function m127(){const u=evU();if(u<0)return 1;if(relit())return Math.min(1,(clock.t-clock.relightAt)/.08);return 1-smooth(DIM0,DIM1,u);}
function mPipe(){return .15+.85*m127();}
/* 日付：節目の間を直線で走らせる */
function day(){
 const u=evU();if(u<0)return DAY0;if(relit())return DAY0+DAYS;
 const uR=clock.relightAt-clock.yearAt,keys=[[0,DAY0]].concat(LOGS.map(([k,d])=>[k==='R'?uR:k,d]));
 for(let i=1;i<keys.length;i++)if(u<keys[i][0]){const [u0,d0]=keys[i-1],[u1,d1]=keys[i];return Math.round(d0+(d1-d0)*(u-u0)/(u1-u0));}
 return DAY0+DAYS;
}
function logLine(){
 const u=evU();if(u<0)return '';const uR=clock.relightAt-clock.yearAt;
 for(const [k,,text] of LOGS){const at=k==='R'?uR:k;if(u>=at&&u<at+LOG_SHOW)return text;}
 return '';
}
function s(t){
 const ph=((t%BEAT)+BEAT)%BEAT/BEAT,beat=Math.exp(-7*ph),circ=.5+.5*Math.cos(2*Math.PI*t/CIRC);
 const v=.55+.8*beat*(.25+.75*circ);
 return reduced?.78+(v-.78)*.35:v;
}
function flash(dt){return dt<0?0:Math.min(1,dt/.06)*Math.exp(-dt/.55);}

/* ---------------------------------------------------------------- 描画 */
const VS='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
const FS=[
'precision highp float;varying vec2 v;',
'uniform sampler2D tBase,tT127,tPipe,tT37,tRLow,tRSharp,tLut;',
'uniform vec4 kA;uniform vec2 kR;uniform vec4 rect37;uniform vec2 master;uniform vec4 crop;',
'uniform float w127,wPipe,w37,ds;uniform vec2 lowSize,lowTile,sharpSize;uniform float seed;',
'uniform vec4 rLow[17];uniform vec4 rSrc[17];uniform vec2 rAtl[17];uniform int nResp;',
'vec3 dec(vec3 y,float k){y=min(y,vec3(254./255.));vec3 t=y*y;return k*t/(1.-t);}',
'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.)+1024.*max(c,vec3(0.)))/19.,0.,1.)*63.;',
' float b0=floor(p.z),b1=min(b0+1.,63.),f=p.z-b0;',
' vec2 o0=vec2(mod(b0,8.),floor(b0/8.))*64.,o1=vec2(mod(b1,8.),floor(b1/8.))*64.;',
' vec3 c0=texture2D(tLut,(o0+p.xy+.5)/512.).rgb,c1=texture2D(tLut,(o1+p.xy+.5)/512.).rgb;return mix(c0,c1,f);}',
'float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233))+seed)*43758.5453);}',
'void main(){vec2 p=crop.xy+v*crop.zw;vec2 uv=p/master;',
' vec3 c=dec(texture2D(tBase,uv).rgb,kA.x)+w127*dec(texture2D(tT127,uv).rgb,kA.y)+wPipe*dec(texture2D(tPipe,uv).rgb,kA.z);',
' vec2 q=(p-rect37.xy)/rect37.zw;if(q.x>=0.&&q.y>=0.&&q.x<1.&&q.y<1.)c+=w37*dec(texture2D(tT37,q).rgb,kA.w);',
' for(int i=0;i<17;i++){if(i>=nResp)break;float w=rLow[i].z;if(w<.002)continue;',
'  vec4 sr=rSrc[i];vec2 d=p-sr.xy;vec3 r;',
'  if(d.x>=0.&&d.y>=0.&&d.x<sr.z&&d.y<sr.w)r=dec(texture2D(tRSharp,(rAtl[i]+d)/sharpSize).rgb,kR.y);',
'  else r=dec(texture2D(tRLow,(rLow[i].xy+clamp(p/ds,vec2(.5),lowTile-.5))/lowSize).rgb,kR.x);',
'  c+=w*r;}',
' vec3 o=agx(c)+(hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(o,1.);}'
].join('\n');

function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
function texture(img,unit,linear){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);const f=linear?gl.LINEAR:gl.NEAREST;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
/* 層・表・判定は数値の画像なので、色の変換をかけずに読む。fetch → createImageBitmap を先に使い、
   使えない環境だけ <img> に戻す（<img> の読み込みが終わらない環境があった：灰色の PNG、実測） */
function loadImage(src){
 const viaImg=()=>new Promise((ok,ng)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ng(new Error('読み込めませんでした：'+src));i.src=src;});
 if(typeof createImageBitmap!=='function')return viaImg();
 return fetch(src).then(r=>{if(!r.ok)throw new Error('読み込めませんでした：'+src+' '+r.status);return r.blob();})
  .then(b=>createImageBitmap(b,{colorSpaceConversion:'none',premultiplyAlpha:'none'}).catch(()=>viaImg()));
}

async function load(progress){
 const r=await fetch(P+'meta.json');if(!r.ok)throw new Error('meta '+r.status);meta=await r.json();progress(.05);
 const names=['base','t127','pipe','t37','resp-low','resp-sharp','lut','ids'];let n=0;
 const file=k=>{const L=meta.layers[k.replace('-','_')];return L&&L.file?L.file:P+k+'.png';};
 const imgs=await Promise.all(names.map(k=>loadImage(file(k)).then(i=>{progress(.05+.9*(++n)/names.length);return i;})));
 const I={};names.forEach((k,i)=>I[k]=imgs[i]);
 gl=$('canvas').getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl)throw new Error('WebGL を使えません');
 prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 for(const u of ['tBase','tT127','tPipe','tT37','tRLow','tRSharp','tLut','kA','kR','rect37','master','crop','w127','wPipe','w37','ds','lowSize','lowTile','sharpSize','seed','nResp','rLow','rSrc','rAtl'])U[u]=gl.getUniformLocation(prog,u);
 [['base','tBase'],['t127','tT127'],['pipe','tPipe'],['t37','tT37'],['resp-low','tRLow'],['resp-sharp','tRSharp'],['lut','tLut']].forEach(([k,u],i)=>{texture(I[k],i,true);gl.uniform1i(U[u],i);});
 const L=meta.layers;
 gl.uniform4f(U.kA,L.base.k,L.t127.k,L.pipe.k,L.t37.k);gl.uniform2f(U.kR,L.resp_low.k,L.resp_sharp.k);
 gl.uniform4f(U.rect37,...L.t37.rect);gl.uniform2f(U.master,meta.width,meta.height);
 gl.uniform1f(U.ds,L.resp_low.ds);gl.uniform2f(U.lowSize,...L.resp_low.size);gl.uniform2f(U.lowTile,...L.resp_low.tile);gl.uniform2f(U.sharpSize,...L.resp_sharp.size);
 const R=meta.resp,src=new Float32Array(68),atl=new Float32Array(34);
 R.forEach((e,i)=>{src.set(e.src,i*4);atl.set(e.atlas,i*2);});
 gl.uniform4fv(U.rSrc,src);gl.uniform2fv(U.rAtl,atl);gl.uniform1i(U.nResp,R.length);
 /* 判定：画素ごとの対象番号（原版の寸法） */
 const cv=document.createElement('canvas');cv.width=I.ids.width;cv.height=I.ids.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(I.ids,0,0);if(I.ids.close)I.ids.close();
 const px=cx.getImageData(0,0,cv.width,cv.height).data;ids=new Uint8Array(cv.width*cv.height);for(let i=0;i<ids.length;i++)ids[i]=px[i*4];
 progress(1);
}

function respWeights(){
 const R=meta.resp,out=new Float32Array(68),u=evU(),L=lag();
 const rowT=e=>e.name==='resp37'?null:ROW_Y[+e.name.slice(4)-1];
 R.forEach((e,i)=>{
  let w=0;
  if(u>=0&&!relit()){
   /* 早回し：一日一度の巡回が奥へ駆け抜ける（毎秒 57 m、2 s ごと。動きを減らす設定では 4 s ごと） */
   const P=reduced?SWEEP_P*2:SWEEP_P;
   if(u<SWEEP_END){const k=Math.floor(u/P),tau=u-k*P,y=rowT(e);
    const T=y===null?(ROW_Y[4]-24)/SWEEP_V+BEAT:(y-24)/SWEEP_V;
    w=Math.max(flash(tau-T),k>0?flash(tau+P-T):0);}
  }else{
   /* ふだんの巡回（1.3 m/s、110 s ごと）。点り直しの後は 127 基の灯も一拍遅れ、三六号と三七号が同時に点る */
   const base=relit()?clock.t-clock.relightAt+10:clock.t,cyc=((base%PATROL)+PATROL)%PATROL,y=rowT(e);
   const T=y===null?(ROW_Y[4]-WALK_Y0)/WALK_V+BEAT:(y-WALK_Y0)/WALK_V+L;
   w=flash(cyc-T);
   if(relit())w=Math.max(w,flash(clock.t-clock.relightAt));   /* 点り直しの瞬間、全段の灯が同時に点る */
  }
  out[i*4]=e.low[0];out[i*4+1]=e.low[1];out[i*4+2]=w;
 });
 return out;
}
function render(){
 const t=clock.t,L=lag();
 gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
 gl.uniform4f(U.crop,crop.x,crop.y,crop.w,crop.h);
 gl.uniform1f(U.w127,m127()*s(t-L));gl.uniform1f(U.w37,s(t-BEAT));gl.uniform1f(U.wPipe,mPipe()*(.8+.2*Math.cos(2*Math.PI*(t-L)/CIRC)));
 gl.uniform4fv(U.rLow,respWeights());gl.uniform1f(U.seed,(t*7.13)%10);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

/* ---------------------------------------------------------------- 切り出しと大きさ
   原版（横 ±36.87°・縦 ±38.3°）から画面の縦横比の最大の矩形を切る。横長は横いっぱい・縦は光軸の中央、
   縦長は縦いっぱい・中心を右へ 4°（通路の消失点 −10° と三七号 +11° の両方が入る） */
function layout(){
 const vw=innerWidth,vh=innerHeight,W=meta?meta.width:1280,H=meta?meta.height:1348,a=vw/vh;
 if(a>=W/H){crop.w=W;crop.h=W/a;crop.x=0;crop.y=(H-crop.h)/2;}
 else{crop.h=H;crop.w=H*a;const c=(TAN4/.75+1)/2*W;crop.x=Math.min(W-crop.w,Math.max(0,c-crop.w/2));crop.y=0;}
 const k=vw/crop.w,img=$('preview');img.style.width=(W*k)+'px';img.style.transform='translate('+(-crop.x*k)+'px,'+(-crop.y*k)+'px)';
 if(!gl)return;
 const dpr=Math.min(devicePixelRatio||1,2),q=quality==='low'?.6:quality==='high'?1:scale;
 const cw=Math.max(1,Math.round(Math.min(vw*dpr,crop.w*2)*q)),ch=Math.max(1,Math.round(cw*vh/vw));
 const c=$('canvas');if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}
}

/* ---------------------------------------------------------------- 面 */
function menu(open){if(liquid.blocked)return;if(open)liquid.ui.open('#menu',$('menuToggle'));else liquid.ui.close('#menu');$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');if(open)$('pause').focus();schedule();}
function openInfo(title){if(!liquid.blocked){returnFocus=document.activeElement;menu(false);}$('infoTitle').textContent=title;$('infoBody').replaceChildren();liquid.ui.open('#info',lastPointer||$('menuToggle'));lastPointer=null;liquid.lock($('info'));$('closeInfo').focus();schedule();}
function paragraph(text){const p=document.createElement('p');p.textContent=text;$('infoBody').append(p);}
function selectTarget(id){const d=panels[id];if(!d)return;openInfo(d.title);paragraph(d.text);schedule();}
function closeInfo(){liquid.ui.close('#info',()=>{liquid.unlock();if(returnFocus&&returnFocus.isConnected&&!returnFocus.closest('[hidden]'))returnFocus.focus();else $('menuToggle').focus();schedule();});schedule();}
$('closeInfo').onclick=e=>{e.preventDefault();e.stopPropagation();closeInfo();};
$('menuToggle').onclick=()=>menu($('menu').hidden);
$('targets').onclick=()=>{openInfo('観測する対象');const list=document.createElement('ul');list.className='target-list';for(const [id,label] of TARGETS){const li=document.createElement('li'),b=document.createElement('button');b.textContent=label;b.onclick=()=>selectTarget(id);li.append(b);list.append(li);}$('infoBody').append(list);};
$('about').onclick=()=>{openInfo('Core No.37');/* 本文はページの説明文と同じ（英語表示では h53-chrome が一覧の英語の札に差し替える） */const d=document.querySelector('meta[name="description"]');paragraph(d?d.getAttribute('content'):'');paragraph('原作：『遅炉 / THE LATE CORE』\nh!ro53 / deus ex machina');};
$('settings').onclick=()=>{openInfo('画質・動き');const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=reduced;check.onchange=()=>{reduced=check.checked;document.body.classList.toggle('reduce-ui-motion',reduced);schedule();};label.append(check,document.createTextNode(' 拍の明滅を弱める'));$('infoBody').append(label);const ql=document.createElement('label');ql.textContent='画質';const sel=document.createElement('select');for(const [value,text] of [['auto','自動'],['high','高'],['low','軽量']]){const op=document.createElement('option');op.value=value;op.textContent=text;sel.append(op);}sel.value=quality;sel.onchange=()=>{quality=sel.value;scale=1;layout();schedule();};ql.append(sel);$('infoBody').append(ql);};

/* ---------------------------------------------------------------- 状態 */
let shownLog='';
function syncUI(){
 const done=relit()&&clock.t>=clock.relightAt+4;
 $('year').disabled=!ready||clock.yearAt!==null;$('year').setAttribute('aria-pressed',String(clock.yearAt!==null));
 $('phase').textContent=!clock.running?'一時停止':'ZS+0'+day()+'D'+(done?' — 遅れは、続いている':'');
 $('pause').textContent=clock.running?'一時停止':'再開';$('pause').setAttribute('aria-pressed',String(!clock.running));
 const line=logLine();
 if(line!==shownLog){shownLog=line;const el=$('log');el.classList.remove('on');if(line){el.textContent=line;void el.offsetWidth;el.classList.add('on');}}
}
$('year').onclick=()=>{if(clock.yearAt!==null)return;clock.yearAt=clock.t;
 /* 点り直しは 132 s 以後の最初の「四十拍の揃い直し」、三七号の拍の頂き（(t − 0.78) が 31.2 s の倍数） */
 clock.relightAt=BEAT+Math.ceil((clock.t+RELIGHT_MIN-BEAT)/ALIGN)*ALIGN;syncUI();schedule();};
$('pause').onclick=()=>{clock.running?pause():play();syncUI();schedule();};
function showUI(on){shown=on;for(const id of ['masthead','controls','back','menuToggle'])$(id).hidden=!on;$('showUI').hidden=on;menu(false);if(!on){liquid.ui.hide('#info');liquid.unlock();}(on?$('menuToggle'):$('showUI')).focus();schedule();}
$('hideUI').onclick=()=>showUI(false);$('showUI').onclick=()=>showUI(true);
$('fullscreen').onclick=()=>{menu(false);liquid.fullscreen($('fullscreen'),()=>{openInfo('全画面表示');paragraph('この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。');});};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('info').hidden)closeInfo();else if(!$('menu').hidden){menu(false);$('menuToggle').focus();}else showUI(!shown);}if(e.code==='Space'&&!['BUTTON','INPUT','SELECT','A'].includes(document.activeElement.tagName)&&ready){e.preventDefault();$('pause').click();}});

/* ---------------------------------------------------------------- 判定（的は出さない。触れた位置の対象を開く）
   小さい対象（応答灯・監視室）は指の幅（半径 22 px）の中にあれば、それを優先する */
function pick(clientX,clientY){
 const r=$('canvas').getBoundingClientRect(),W=meta.width,H=meta.height;
 const mx=crop.x+(clientX-r.left)/r.width*crop.w,my=crop.y+(clientY-r.top)/r.height*crop.h;
 const at=(x,y)=>{x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=W||y>=H?0:ids[y*W+x];};
 const hit=at(mx,my);if(hit===5||hit===4||hit===3)return ID_NAME[hit];
 const rad=22*crop.w/r.width,step=Math.max(1,rad/8);let best=0,bd=1e9;
 for(let dy=-rad;dy<=rad;dy+=step)for(let dx=-rad;dx<=rad;dx+=step){const d=dx*dx+dy*dy;if(d>rad*rad)continue;const v=at(mx+dx,my+dy);if((v===4||v===3)&&d<bd){best=v;bd=d;}}
 if(best)return ID_NAME[best];
 return ID_NAME[hit]||null;
}
$('canvas').addEventListener('pointerup',e=>{if(!ready||!e.isPrimary||liquid.blocked||performance.now()<liquid.blockedUntil)return;const id=pick(e.clientX,e.clientY);if(id){lastPointer={x:e.clientX,y:e.clientY};selectTarget(id);}});

/* ---------------------------------------------------------------- 一本の描画ループ */
function frame(now){
 raf=0;if(!ready||document.hidden)return;
 const before=clock.t;advance(now);
 if(clock.running&&clock.t>before){frameSamples.push(now);if(frameSamples.length>240)frameSamples.shift();}
 render();liquid.afterRender(performance.now());
 if(now-lastReadout>400){syncUI();lastReadout=now;}
 if(quality==='auto'&&now-adaptAt>5000&&frameSamples.length>120){const d=[];for(let i=1;i<frameSamples.length;i++)d.push(frameSamples[i]-frameSamples[i-1]);d.sort((a,b)=>a-b);const p95=d[Math.floor(d.length*.95)];if(p95>38&&scale>.6){scale=Math.max(.6,scale*.85);layout();}adaptAt=now;}
 if(clock.running||liquid.ui.busy())schedule();
}
function schedule(){if(!raf&&ready&&!document.hidden)raf=requestAnimationFrame(frame);}
addEventListener('resize',()=>{layout();schedule();});if(window.visualViewport)visualViewport.addEventListener('resize',()=>{layout();schedule();});
document.addEventListener('visibilitychange',()=>{clock.last=null;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();});

/* 著作権表記の実測の高さを CSS へ（折返し・セーフエリア・文字の大きさの違いを吸収する） */
(function(){const band=document.querySelector('.h53-copy');if(!band)return;const root=document.documentElement;function put(){const h=Math.ceil(band.getBoundingClientRect().height);if(h>0)root.style.setProperty('--h53-copy-h',h+'px');}put();if(typeof ResizeObserver==='function')new ResizeObserver(put).observe(band);addEventListener('resize',put);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(put);})();

layout();
load(n=>{$('loadProgress').value=n*100;$('loadText').textContent='炉室を準備しています · '+Math.round(n*100)+'%';}).then(()=>{
 ready=true;layout();render();liquid.afterRender(performance.now());document.body.classList.add('ready');$('loading').hidden=true;
 for(const id of ['pause','targets'])$(id).disabled=false;play();syncUI();schedule();
 window.__core37={clock,crop,meta:()=>meta,pick,lag,yearProgress,day,logLine,m127};
}).catch(error);
})();
