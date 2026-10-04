/* Lacto-Tricore v1 w1（ASSET 30）— 三核の生命加速装置（lacto シリーズの装置）。制作中の呼び名は life accelerator（w4 まで）。
 * 画は Cycles の一枚（L7 原版、視点ごと）を光源ごとに分けた層で、ここで時間の重みを掛けて足し、AgX（Medium High Contrast）の表で表示色にする。
 *   base（部屋・輪郭光・三色の帯）＋ tank（光る苺乳タンク、循環 2.4 s でゆるく呼吸）＋ vat（脳の槽、拍 0.78 s）
 *   ＋ sanctum（三連の Sanctum の光束。2 拍周期で強く明滅：作者裁定 2026-09-27）
 *   ＋ brain（脳だけを照らす濃い薔薇色の灯。8 拍周期で重みを振り、脳の色の濃度が濃淡する：同）＋ flow（加速区間の苺乳）
 * 視点は三つ（全景・脳・加速）。アップの素材は初めて選んだときに読む（同）。
 * w3：物に触れると観測記録が開く（作者裁定 2026-09-27）。的は出さない。判定は視点ごとの番号の地図（単純な立体を原版へ投影）。
 *   脳の視点を、核間の神経束が見える左前からの見下ろしに変えた（同）。
 * w4 UI 規則（作者指摘 2026-09-27「UI の規則が破られ、liquid glass ではなくなっている」）：視点の釦を共有 UI の液体ガラスに登録し、
 *   下部の操作欄（著作権表記の上）へ戻した。
 * w4：加速器の支え（三本のレールと C 字の抱き金具）と、段ごとに細る管・絞り継手・螺旋線（作者指摘 2026-09-27）。記録の文案も合わせた。
 * 加速：flow の管の画素には位相（管に沿った位置 ÷ その段の脈の間隔、段をまたいで連続）が書いてある。
 *   脈 2.4·u⁴ + 0.04（u = fract(位相 − t / 0.78)）を拍ごとに一つ送る。下の段ほど間隔が広い＝速い。
 *   原版の flow はこの脈の平均の明るさで描いてあるので、管の画素は脈 ÷ 平均を掛ける。管の外（ガラス・環への照り返し）は平均のまま。
 * 描画の予約は schedule() の一本だけ（共有 UI の requestFrame もここへ束ねる）。 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const P='lacto-tricore-v1-w1-';
const BEAT=0.78,CIRC=2.4,SANC_P=2*BEAT,BRAIN_P=8*BEAT;
const VIEWS=[['main','全景'],['brain','脳'],['sanc','加速']];
/* 観測記録（下書き。作者の設定と、この作品の造形の判断だけで書く。脳の来歴・意識・演算の中身は書かない） */
const panels={
 tank:{title:'苺乳タンク',text:'装置の上半分を占める縦の槽。容量はおよそ八十五立方メートル。\n中の苺乳そのものが淡く光り、その光は二・四秒の循環でわずかに揺れる。\n槽の底から一本の降下管が、加速器を経て生体槽へ降りる。'},
 accel:{title:'流速加速装置',text:'光学ガラスの環を三段、降下管に沿って積む。Sanctum と同型の環を小さくして流用している。\n環は、降下管を囲む三本の黒いレールから出た腕の、C 字の抱き金具に外側から抱えられる。\n管は各段の環の穴を貫く。環の中を三条の光束が巡り、二拍ごとに強く明滅する。'},
 pipe:{title:'加速区間',text:'降下管のうち環を貫く区間はガラスで、流れが見える。管の外には細い螺旋線が巻かれる。\n段の境目の絞り継手で、管は下の段ほど細くなる。内径の半径は十六、十三、十センチ。\n脈は〇・七八秒の拍ごとに一つ送られる。拍の間隔は変わらない。下の段ほど、脈と脈の間が開く。流れが速くなっている。'},
 vat:{title:'生体槽',text:'三つの脳を収めた円筒の槽。淡い苺乳色の培養液で満たされる。\n上蓋の内側に環状の灯。脳は細い支えの上に載り、液の中に浮いて見える。'},
 brains:{title:'三つの脳',text:'培養で大きく育った脳が三つ。長さはおよそ五十センチ。\n色は八拍ごとに濃くなり、また淡くなる。\n三つとも、同じ加速された苺乳を受けている。'},
 links:{title:'核間の神経束',text:'三つの脳は、互いに神経の束で結ばれている。\n束は七本ほどの繊維がより合わさり、薄い鞘に包まれる。根元で太く、中ほどで細る。\nどの脳も孤立していない。'},
 perfusion:{title:'灌流の接続',text:'各脳の延髄の先へ、ステンレスのカニューレが五センチ差し込まれている。\n差し込み口はシリコンの袖で封じ、締め輪で留める。六角の継手から先は透明な管。\n加速された苺乳は、ここから脳へ入る。'},
 base:{title:'基部',text:'槽の下の黒い基部。三色の帯と点検灯が巡り、環文字が刻まれる。\ntranscendence by deus ex machina。\n基部から太い三本の束が床を這い、闇の奥へ延びる。'}
};
const TARGETS=[['tank','苺乳タンク'],['accel','流速加速装置'],['pipe','加速区間'],['vat','生体槽'],['brains','三つの脳'],['links','核間の神経束'],['perfusion','灌流の接続'],['base','基部']];
const SMALL=new Set(['pipe','links','perfusion']);   /* 細い物は、指の幅（半径 22 px）の中にあれば優先する */

let meta=null,gl=null,prog=null,U={},ready=false,raf=0,shown=true,returnFocus=null,lastPointer=null,view='main',lut=null,ids=null;const cache={},viewLoads={};let viewRequest=0;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,quality='auto',scale=1;
const crop={x:0,y:0,w:1,h:1};
const clock={t:0,running:false,last:null};
const frameSamples=[];let adaptAt=0,lastReadout=0;
document.body.classList.toggle('reduce-ui-motion',reduced);

/* ---------------------------------------------------------------- 共有 UI */
const liquid=new H53LiquidHost({source:$('canvas'),requestFrame:schedule,night:true,surfaces:[{selector:'#back,#menuToggle,#showUI,#views button',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
window.__h53Liquid=liquid;

function error(e){$('error').hidden=false;$('error').textContent='装置を表示できませんでした。接続を確認して、もう一度お試しください。\n'+(e&&e.message||String(e));$('loadText').textContent='読み込みを完了できませんでした';$('retry').hidden=false;$('loading').hidden=false;}
$('retry').onclick=()=>location.reload();
function advance(now){if(clock.running&&clock.last!==null)clock.t+=Math.min(.1,(now-clock.last)/1000);clock.last=now;}
function play(){clock.running=true;clock.last=null;}
function pause(){clock.running=false;clock.last=null;}
/* 拍：頂きで 1、時定数 0.22 s で減る */
function beat(t){const u=((t%BEAT)+BEAT)%BEAT;return Math.exp(-u/.22);}

/* ---------------------------------------------------------------- 描画 */
const VS='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
const FS=[
'precision highp float;varying vec2 v;',
'uniform sampler2D tBase,tTank,tVat,tBrain,tSanc,tFlow,tPhase,tLut;',
'uniform vec4 kA;uniform vec2 kB;uniform vec2 master;uniform vec4 crop;',
'uniform vec4 rBase,rTank,rVat,rBrain,rSanc,rFlow;',
'uniform float wTank,wVat,wBrain,wSanc,wSpill,pulseAmp;uniform float flowT;uniform float phaseMax,pulseMean;uniform float seed;',
'vec3 dec(vec3 y,float k){y=min(y,vec3(254./255.));vec3 t=y*y;return k*t/(1.-t);}',
'vec3 layer(sampler2D s,vec4 r,vec2 p,float k){vec2 q=(p-r.xy)/r.zw;if(q.x<0.||q.y<0.||q.x>=1.||q.y>=1.)return vec3(0.);return dec(texture2D(s,q).rgb,k);}',
'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.)+1024.*max(c,vec3(0.)))/19.,0.,1.)*63.;',
' float b0=floor(p.z),b1=min(b0+1.,63.),f=p.z-b0;',
' vec2 o0=vec2(mod(b0,8.),floor(b0/8.))*64.,o1=vec2(mod(b1,8.),floor(b1/8.))*64.;',
' vec3 c0=texture2D(tLut,(o0+p.xy+.5)/512.).rgb,c1=texture2D(tLut,(o1+p.xy+.5)/512.).rgb;return mix(c0,c1,f);}',
'float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233))+seed)*43758.5453);}',
'void main(){vec2 p=crop.xy+v*crop.zw;',
' vec3 c=layer(tBase,rBase,p,kA.x)+wTank*layer(tTank,rTank,p,kA.y)+wVat*layer(tVat,rVat,p,kA.z)+wBrain*layer(tBrain,rBrain,p,kA.w)+wSanc*layer(tSanc,rSanc,p,kB.x);',
' vec2 q=(p-rFlow.xy)/rFlow.zw;',
' if(q.x>=0.&&q.y>=0.&&q.x<1.&&q.y<1.){vec3 f=dec(texture2D(tFlow,q).rgb,kB.y);',
'  vec3 ph=texture2D(tPhase,q).rgb;float phase=(ph.r*255.*256.+ph.g*255.)/65535.*phaseMax;',
'  float u=fract(phase-flowT);float pulse=(2.4*u*u*u*u+.04)/pulseMean;pulse=mix(1.,pulse,pulseAmp);',
'  c+=f*mix(wSpill,pulse,ph.b);}',
' vec3 o=agx(c)+(hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(o,1.);}'
].join('\n');

function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
function texture(img,unit,linear){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);const f=linear?gl.LINEAR:gl.NEAREST;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
/* 層・表・位相は数値の画像なので、色の変換をかけずに読む（fetch → createImageBitmap。使えない環境だけ <img>） */
function loadImage(src){
 const viaImg=()=>new Promise((ok,ng)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ng(new Error('読み込めませんでした：'+src));i.src=src;});
 if(typeof createImageBitmap!=='function')return viaImg();
 return fetch(src).then(r=>{if(!r.ok)throw new Error('読み込めませんでした：'+src+' '+r.status);return r.blob();})
  .then(b=>createImageBitmap(b,{colorSpaceConversion:'none',premultiplyAlpha:'none'}).catch(()=>viaImg()));
}

const LAYERS=[['base','tBase','rBase',true],['tank','tTank','rTank',true],['vat','tVat','rVat',true],['brain','tBrain','rBrain',true],['sanctum','tSanc','rSanc',true],['flow','tFlow','rFlow',true],['phase','tPhase',null,false]];
function unrle(buf,n){
 const b=new Uint8Array(buf),a=new Uint8Array(n);let o=0;
 for(let i=0;i+2<b.length;i+=3){const L=b[i+1]|(b[i+2]<<8);a.fill(b[i],o,o+L);o+=L;}
 if(o!==n)throw new Error('判定の地図が不完全です');
 return a;
}
/* 視点ごとの素材（層 7 枚と meta）を読む。一度読んだ視点は手元に残す */
async function prepareView(id,progress){
 if(cache[id])return cache[id];
 const pre=P+id+'-';const r=await fetch(pre+'meta.json');if(!r.ok)throw new Error('meta '+r.status);const m=await r.json();progress(.05);
 let n=0;const imgs=await Promise.all(LAYERS.map(([k])=>loadImage(m.layers[k].file).then(i=>{progress(.05+.9*(++n)/LAYERS.length);return i;})));
 const tex=LAYERS.map(([k,u,rr,lin],i)=>{const tx=texture(imgs[i],i,lin);if(imgs[i].close)imgs[i].close();return tx;});
 /* 判定：画素ごとの対象番号（原版の寸法）。(番号 u8, 長さ u16 LE) の列。画像にしないのは、Safari（Mac・iOS）が
    灰色の PNG を 2D キャンバスで読むときに色を変換し、番号が隣の物へずれるため（Core No.37 w2 の実測 2026-09-27） */
 try{
 const ri=await fetch(m.layers.ids.file);if(!ri.ok)throw new Error('読み込めませんでした：'+m.layers.ids.file+' '+ri.status);
 const map=unrle(await ri.arrayBuffer(),m.width*m.height);
 return cache[id]={meta:m,tex,ids:map};
 }catch(e){for(const t of tex)gl.deleteTexture(t);throw e;}
}
function fetchView(id,progress){
 if(cache[id])return Promise.resolve(cache[id]);
 if(viewLoads[id])return viewLoads[id];
 const pending=prepareView(id,progress);viewLoads[id]=pending;
 return pending.finally(()=>{delete viewLoads[id];});
}
function bindView(id){
 const v=cache[id];meta=v.meta;view=id;ids=v.ids;
 LAYERS.forEach(([k,u,rr],i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,v.tex[i]);gl.uniform1i(U[u],i);if(rr)gl.uniform4f(U[rr],...meta.layers[k].rect);});
 gl.activeTexture(gl.TEXTURE7);gl.bindTexture(gl.TEXTURE_2D,lut);gl.uniform1i(U.tLut,7);
 const L=meta.layers;
 gl.uniform4f(U.kA,L.base.k,L.tank.k,L.vat.k,L.brain.k);gl.uniform2f(U.kB,L.sanctum.k,L.flow.k);
 gl.uniform2f(U.master,meta.width,meta.height);gl.uniform1f(U.phaseMax,meta.phase_max);gl.uniform1f(U.pulseMean,meta.pulse_mean);
 $('preview').src=P+id+'-preview.jpg';
 for(const b of document.querySelectorAll('#views button'))b.setAttribute('aria-pressed',String(b.dataset.view===id));
 layout();
}
async function load(progress){
 gl=$('canvas').getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl)throw new Error('WebGL を使えません');
 prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 for(const u of ['tBase','tTank','tVat','tBrain','tSanc','tFlow','tPhase','tLut','kA','kB','master','crop','rBase','rTank','rVat','rBrain','rSanc','rFlow','wTank','wVat','wBrain','wSanc','wSpill','pulseAmp','flowT','phaseMax','pulseMean','seed'])U[u]=gl.getUniformLocation(prog,u);
 const li=await loadImage(P+'lut.png');lut=texture(li,7,true);if(li.close)li.close();
 await fetchView('main',progress);bindView('main');
 progress(1);
}
async function switchView(id){
 if(!ready)return;
 const revision=++viewRequest;
 // Selecting the visible view also cancels an earlier pending choice.
 if(id===view){syncUI();schedule();return;}
 if(!cache[id]){$('phase').textContent='読み込み中…';try{await fetchView(id,()=>{});}catch(e){if(revision===viewRequest)error(e);return;}}
 if(revision!==viewRequest)return;
 bindView(id);syncUI();schedule();
}

function render(){
 const t=clock.t,b=beat(t),m=reduced?.35:1;
 /* Sanctum：2 拍周期で強く明滅（頂きで 1.87 倍、谷で 0.12 倍。毎秒 0.64 回で光過敏の目安 3 回未満）。脳：8 拍周期で濃淡 */
 const s=.5+.5*Math.cos(2*Math.PI*t/SANC_P),d=.5-.5*Math.cos(2*Math.PI*t/BRAIN_P);
 gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
 gl.uniform4f(U.crop,crop.x,crop.y,crop.w,crop.h);
 gl.uniform1f(U.wTank,1+.04*m*Math.sin(2*Math.PI*t/CIRC));
 /* 脳の濃淡：濃い側で薔薇色の灯を 2.2 倍に上げ、中性の光（槽の層）を 0.8 倍へ下げる。灯を足すだけでは明るくなるだけで濃くならなかった */
 gl.uniform1f(U.wVat,(.96+.08*m*b)*(1.05-.25*d));
 gl.uniform1f(U.wBrain,2.2*d);
 gl.uniform1f(U.wSanc,reduced?.6+.5*s:.12+1.75*s*s);
 gl.uniform1f(U.wSpill,.9+.2*m*b);
 gl.uniform1f(U.pulseAmp,m);
 gl.uniform1f(U.flowT,t/BEAT);
 gl.uniform1f(U.seed,(t*7.13)%10);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

/* ---------------------------------------------------------------- 切り出しと大きさ
   原版から画面の縦横比の最大の矩形を切る。縦長は縦いっぱい・横は中央。
   横長は横いっぱい・縦は全景で下端に寄せ（脳からタンクまで入る）、アップでは中央 */
function layout(){
 const vw=innerWidth,vh=innerHeight,W=meta?meta.width:2771,H=meta?meta.height:1800,a=vw/vh;
 const ay=meta&&meta.crop?meta.crop.landscape_anchor_y:1;
 if(a>=W/H){crop.w=W;crop.h=W/a;crop.x=0;crop.y=(H-crop.h)*ay;}
 else{crop.h=H;crop.w=H*a;crop.x=(W-crop.w)/2;crop.y=0;}
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
for(const [id,label] of VIEWS){const b=document.createElement('button');b.className='pill';b.textContent=label;b.dataset.view=id;b.setAttribute('aria-pressed',String(id==='main'));b.disabled=true;b.onclick=()=>switchView(id);$('views').append(b);}
$('about').onclick=()=>{openInfo('Lacto-Tricore v1');/* 本文はページの説明文と同じ（英語表示では h53-chrome が一覧の英語の札に差し替える） */const d=document.querySelector('meta[name="description"]');paragraph(d?d.getAttribute('content'):'');paragraph('Brain form: “Brain, Female” (Human Reference Atlas / NIH 3D 3DPX-020959), CC BY 4.0, modified.\nh!ro53 / deus ex machina');};
$('settings').onclick=()=>{openInfo('画質・動き');const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=reduced;check.onchange=()=>{reduced=check.checked;document.body.classList.toggle('reduce-ui-motion',reduced);schedule();};label.append(check,document.createTextNode(' 脈と拍の明滅を弱める'));$('infoBody').append(label);const ql=document.createElement('label');ql.textContent='画質';const sel=document.createElement('select');for(const [value,text] of [['auto','自動'],['high','高'],['low','軽量']]){const op=document.createElement('option');op.value=value;op.textContent=text;sel.append(op);}sel.value=quality;sel.onchange=()=>{quality=sel.value;scale=1;layout();schedule();};ql.append(sel);$('infoBody').append(ql);};
function syncUI(){$('pause').textContent=clock.running?'一時停止':'再開';$('pause').setAttribute('aria-pressed',String(!clock.running));$('phase').textContent=clock.running?'':'一時停止';}
$('pause').onclick=()=>{clock.running?pause():play();syncUI();schedule();};
function showUI(on){shown=on;for(const id of ['masthead','controls','back','menuToggle','views']){const el=$(id);if(el)el.hidden=!on;}$('showUI').hidden=on;menu(false);if(!on){liquid.ui.hide('#info');liquid.unlock();}(on?$('menuToggle'):$('showUI')).focus();schedule();}
$('hideUI').onclick=()=>showUI(false);$('showUI').onclick=()=>showUI(true);
$('fullscreen').onclick=()=>{menu(false);liquid.fullscreen($('fullscreen'),()=>{openInfo('全画面表示');paragraph('この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。');});};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('info').hidden)closeInfo();else if(!$('menu').hidden){menu(false);$('menuToggle').focus();}else showUI(!shown);}if(e.code==='Space'&&!['BUTTON','INPUT','SELECT','A'].includes(document.activeElement.tagName)&&ready){e.preventDefault();$('pause').click();}});

/* ---------------------------------------------------------------- 判定（的は出さない。触れた位置の対象を開く） */
function pick(clientX,clientY){
 const r=$('canvas').getBoundingClientRect(),W=meta.width,H=meta.height,N=meta.ids;
 const mx=crop.x+(clientX-r.left)/r.width*crop.w,my=crop.y+(clientY-r.top)/r.height*crop.h;
 const at=(x,y)=>{x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=W||y>=H?0:ids[y*W+x];};
 const hit=N[at(mx,my)];if(hit&&SMALL.has(hit))return hit;
 const rad=22*crop.w/r.width,step=Math.max(1,rad/8);let best=null,bd=1e9;
 for(let dy=-rad;dy<=rad;dy+=step)for(let dx=-rad;dx<=rad;dx+=step){const d=dx*dx+dy*dy;if(d>rad*rad)continue;const v=N[at(mx+dx,my+dy)];if(v&&SMALL.has(v)&&d<bd){best=v;bd=d;}}
 return best||hit||null;
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

/* 著作権表記の実測の高さを CSS へ */
(function(){const band=document.querySelector('.h53-copy');if(!band)return;const root=document.documentElement;function put(){const h=Math.ceil(band.getBoundingClientRect().height);if(h>0)root.style.setProperty('--h53-copy-h',h+'px');}put();if(typeof ResizeObserver==='function')new ResizeObserver(put).observe(band);addEventListener('resize',put);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(put);})();

addEventListener('error',e=>{if(!ready)error(e.error||e.message);});addEventListener('unhandledrejection',e=>{if(!ready)error(e.reason);});
layout();
load(n=>{$('loadProgress').value=n*100;$('loadText').textContent='装置を準備しています · '+Math.round(n*100)+'%';}).then(()=>{
 ready=true;layout();render();liquid.afterRender(performance.now());document.body.classList.add('ready');$('loading').hidden=true;
 $('pause').disabled=false;$('targets').disabled=false;for(const b of document.querySelectorAll('#views button'))b.disabled=false;play();syncUI();schedule();
 window.__lactoTricore=window.__lifeAccel={clock,crop,meta:()=>meta,render,switchView,view:()=>view,pick};
}).catch(error);
})();
