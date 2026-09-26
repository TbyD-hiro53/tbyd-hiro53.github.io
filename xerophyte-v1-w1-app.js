/* Xerophyte v1 w1（ASSET 28、OBSERVATION）— 砂漠に浮かぶ、cyberwafer の形をした植物の観測。
 * 画は Cycles の一枚を光源ごとに分けた層で、ここで時間の重みを掛けて足し、AgX の表で表示色にする。
 *   地 = mix(澄んだ地, 嵐の地, wStorm)。澄んだ地・嵐の地は、嵐の前は A・As、地面を替えた後は B・Bs
 *   ＋ 維管束（幹の正面の線）× 拍 0.78 s で下から上へ昇る波
 *   ＋ 束（円盤の段と根の光る筋）× 循環 2.4 s で上から下へ下る波
 *   ＋ 花（喉と葯の光）× 拍に合わせたわずかな強まり
 *   光る層も mix(澄んだ時, 嵐の時, wStorm)。霞は光の足し算なので、画素ごとの線形の混ぜは霞の濃さを変えるのと同じ。
 * SANDSTORM（戻せない。作者裁定 2026-09-26）：約三分。
 *   0〜55 s 砂塵が濃くなる → 55〜125 s 最も濃い（84 s に濃い一吹きが画面を覆い、その陰で地面を嵐の後へ替える）→ 125〜175 s 晴れる。
 *   画面を横切る砂の流れは実時間の 2D（値の雑音を風下へ流す）。晴れた後は、砂丘・杭・計測器だけが変わり、個体は同じ。
 * 描画の予約は schedule() の一本だけ（共有 UI の requestFrame もここへ束ねる）。 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const P='xerophyte-v1-w1-';
const BEAT=0.78,CIRC=2.4,STORM_S=180,RISE=[0,55],FALL=[125,175],SWAP=84,VEIL=[76,84,93];
/* 嵐のあいだの観測の記録（u = SANDSTORM からの秒）。この作品のための新しい記述で、正典・原作の引用ではない（作者承認 2026-09-26） */
const LOGS=[[4,'風が向きを変える。砂の移動が始まる。'],[30,'視程二百メートル。杭の列が見えなくなる。'],[62,'視程四十メートル。計測器の記録が途切れる。'],
 [98,'個体の輪郭だけが残る。維管束の光は視認できる。'],[140,'視程が戻る。砂丘の稜線が風下へ移っている。'],[170,'個体の表面に、砂の付着はない。']];
const LOG_SHOW=8;
/* 触れて開く観測記録（新しい記述。作者承認 2026-09-26）。after は嵐の後に差し替える文 */
const panels={
 trunk:{title:'幹',text:'T の形をした幹。高さ九メートル、幅七・九メートル、角は立っている。\n木質で、表は灰緑に風化し、上を向く面には苔が乗る。\n寸法の比は、既知の cyberwafer の T と一致する。前日の記録に、この地点の個体はない。'},
 flower:{title:'花',text:'二輪。花被片六、雄しべ六、雌しべ一。\n観測を始めてから、一度も閉じていない。\n喉の奥と葯が淡い青緑に光り、光は〇・七八秒の拍でわずかに強まる。'},
 discs:{title:'円盤の段',text:'棚のような器官が六段、下へ向かって小さくなる。段の間は下ほど開いている。\n蔓は円盤を貫いて下の段へ流れ落ち、光る筋が二・四秒で段を下る。\n欠けた縁には年輪が出ている。'},
 roots:{title:'根と地面',text:'根は最下段の下で縒り合わさり、一点で終わる。先端は地面から一・四メートル浮いている。\n真下の砂は、周りと同じく乾いている。',
  after:'根の先は、嵐の前と同じ高さにある。\n根の真下を、新しい砂丘の畝が横切った。先端には届いていない。'},
 stakes:{title:'杭と計測器',text:'半径十二メートルの円に杭が二十本、綱は二か所で切れている。\n三脚の計測器が一基、個体に向けて据えられている。',
  after:'杭は風下へ傾き、一本は倒れかけている。綱はさらに切れて、砂に垂れた。\n計測器は脚が埋まり、傾いたまま記録を止めている。'}
};
const TARGETS=[['trunk','幹'],['flower','花'],['discs','円盤の段'],['roots','根と地面'],['stakes','杭と計測器']];
const ID_NAME={1:'trunk',2:'flower',3:'discs',4:'roots',5:'stakes'};

let meta=null,gl=null,prog=null,U={},ids=null,ready=false,raf=0,shown=true,returnFocus=null,lastPointer=null;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,quality='auto',scale=1;
const crop={x:0,y:0,w:1,h:1};
const clock={t:0,running:false,last:null,stormAt:null};
const frameSamples=[];let adaptAt=0,lastReadout=0;
const TEX={};let boundGround='';
document.body.classList.toggle('reduce-ui-motion',reduced);

/* ---------------------------------------------------------------- 共有 UI */
const liquid=new H53LiquidHost({source:$('canvas'),requestFrame:schedule,night:true,surfaces:[{selector:'#back,#storm,#menuToggle,#showUI',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
window.__h53Liquid=liquid;

function error(e){$('error').hidden=false;$('error').textContent='観測地を表示できませんでした。接続を確認して、もう一度お試しください。\n'+(e&&e.message||String(e));$('loadText').textContent='読み込みを完了できませんでした';$('retry').hidden=false;$('loading').hidden=false;}
addEventListener('error',e=>{if(e.target&&e.target.tagName==='SCRIPT')return;error(e.error||e.message);});addEventListener('unhandledrejection',e=>error(e.reason));$('retry').onclick=()=>location.reload();

/* ---------------------------------------------------------------- 時間 */
function advance(now){if(clock.running&&clock.last!==null)clock.t+=Math.min(.1,(now-clock.last)/1000);clock.last=now;}
function play(){clock.running=true;clock.last=null;}
function pause(){clock.running=false;clock.last=null;}
function smooth(a,b,x){const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);}
function evU(){return clock.stormAt===null?-1:clock.t-clock.stormAt;}
function after(){return evU()>=SWAP;}
function done(){return evU()>=STORM_S;}
/* 突風のゆらぎ（決まった周期の和。値の雑音より安く、繰り返しが目立たない） */
function gust(t){return .5+.25*Math.sin(t*1.31)+.15*Math.sin(t*2.73+1.7)+.1*Math.sin(t*5.9+.4);}
function wStorm(){
 const u=evU();if(u<0)return 0;
 const w=smooth(RISE[0],RISE[1],u)*(1-smooth(FALL[0],FALL[1],u));
 return Math.min(1,Math.max(0,w*(1-.14*(1-w*.6)*gust(clock.t))));
}
function veil(){const u=evU();if(u<0)return 0;return .9*(smooth(VEIL[0],VEIL[1],u)*(1-smooth(VEIL[1]+1.5,VEIL[2],u)));}
function wind(){const u=evU();if(u<0)return .08;return .08+.92*smooth(0,30,u)*(1-smooth(150,178,u));}
/* 視程（m）：9 km と 35 m のあいだを濃さで対数に */
function visibility(){const w=wStorm();return Math.exp(Math.log(9000)*(1-w)+Math.log(35)*w);}
function logLine(){const u=evU();if(u<0)return '';for(const [at,text] of LOGS){if(u>=at&&u<at+LOG_SHOW)return text;}return '';}
function amp(){return reduced?.35:1;}

/* ---------------------------------------------------------------- 描画 */
const VS='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
const FS=[
'precision highp float;varying vec2 v;',
'uniform sampler2D tClear,tStorm,tGlowC,tGlowS,tLut;',
'uniform vec2 kBase;uniform vec3 kGC,kGS;uniform vec4 gRect;uniform vec4 gTile;uniform vec2 master;uniform vec4 crop;',
'uniform float wS,veilA,windA,tt,beatPh,circPh,flowerW,ampA,seed;uniform vec4 rows;',
'vec3 dec(vec3 y,float k){y=min(y,vec3(254./255.));vec3 t=y*y;return k*t/(1.-t);}',
'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.)+1024.*max(c,vec3(0.)))/19.,0.,1.)*63.;',
' float b0=floor(p.z),b1=min(b0+1.,63.),f=p.z-b0;',
' vec2 o0=vec2(mod(b0,8.),floor(b0/8.))*64.,o1=vec2(mod(b1,8.),floor(b1/8.))*64.;',
' vec3 c0=texture2D(tLut,(o0+p.xy+.5)/512.).rgb,c1=texture2D(tLut,(o1+p.xy+.5)/512.).rgb;return mix(c0,c1,f);}',
'float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233))+seed)*43758.5453);}',
'float h2(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}',
'float vnoise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);',
' return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y);}',
/* 光る層の瓦：i 番目（0 vein, 1 flow, 2 flower）。q は範囲内の 0..1 */
'vec3 tile(sampler2D t,vec2 q,float i,vec4 tl){vec2 px=q*tl.xy;px.y+=i*(tl.y+tl.z);return texture2D(t,px/vec2(tl.x,tl.w)).rgb;}',
'void main(){vec2 p=crop.xy+v*crop.zw;vec2 uv=p/master;',
' vec3 c=mix(dec(texture2D(tClear,uv).rgb,kBase.x),dec(texture2D(tStorm,uv).rgb,kBase.y),wS);',
' vec2 q=(p-gRect.xy)/gRect.zw;',
' if(q.x>=0.&&q.y>=0.&&q.x<1.&&q.y<1.){',
'  vec4 tlS=vec4(gTile.xy*.5,gTile.z*.5,gTile.w*.5);',
/* 拍：幹の維管束を下から上へ昇る波（h：幹の底 0 → 横棒の下 1） */
'  float h=(rows.x-p.y)/(rows.x-rows.y);float f=beatPh*1.35-.2;',
'  float wv=.5+ampA*1.1*exp(-pow((h-f)/.13,2.));',
/* 循環：最上段から根の先へ下る波（g：最上段 0 → 根の先 1） */
'  float g=(p.y-rows.z)/(rows.w-rows.z);float f2=circPh*1.3-.15;',
'  float wf=.45+ampA*1.0*exp(-pow((g-f2)/.16,2.));',
'  vec3 gc=wv*dec(tile(tGlowC,q,0.,gTile),kGC.x)+wf*dec(tile(tGlowC,q,1.,gTile),kGC.y)+flowerW*dec(tile(tGlowC,q,2.,gTile),kGC.z);',
'  vec3 gs=wv*dec(tile(tGlowS,q,0.,tlS),kGS.x)+wf*dec(tile(tGlowS,q,1.,tlS),kGS.y)+flowerW*dec(tile(tGlowS,q,2.,tlS),kGS.z);',
'  c+=mix(gc,gs,wS);}',
/* 砂の流れ：画面を風下（右）へ横切る筋。濃さは風と砂塵に比例。赤茶の砂の色 */
' if(windA>.01){vec2 sp=vec2(p.x/master.y*3.-tt*1.9*windA,p.y/master.y*22.);',
'  float n=vnoise(sp)*.55+vnoise(sp*vec2(2.3,2.1)+vec2(-tt*.9,0.))*.3+vnoise(sp*vec2(5.1,4.7)+vec2(-tt*2.2,0.))*.15;',
'  float low=smoothstep(.35,1.,p.y/master.y);',
'  float s=smoothstep(.48,.9,n)*windA*(.25+.75*wS)*(.35+.65*low);',
'  vec3 dust=vec3(.42,.19,.075)*(.55+.9*wS);c=mix(c,dust*(.7+.6*n),s*.55);}',
' c=mix(c,vec3(.36,.16,.065),veilA);',
' vec3 o=agx(c)+(hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(o,1.);}'
].join('\n');

function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
function texture(img,unit){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(img.close)img.close();return t;}
function bind(unit,t){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);}
/* 層・表・判定は数値の画像なので、色の変換をかけずに読む（fetch → createImageBitmap。使えない環境だけ <img>） */
function loadImage(src){
 const viaImg=()=>new Promise((ok,ng)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ng(new Error('読み込めませんでした：'+src));i.src=src;});
 if(typeof createImageBitmap!=='function')return viaImg();
 return fetch(src).then(r=>{if(!r.ok)throw new Error('読み込めませんでした：'+src+' '+r.status);return r.blob();})
  .then(b=>createImageBitmap(b,{colorSpaceConversion:'none',premultiplyAlpha:'none'}).catch(()=>viaImg()));
}

async function load(progress){
 const r=await fetch(P+'meta.json');if(!r.ok)throw new Error('meta '+r.status);meta=await r.json();progress(.05);
 const L=meta.layers,files={a:L.base_a.file,b:L.base_b.file,as:L.base_as.file,bs:L.base_bs.file,gc:L.glow_c.file,gs:L.glow_s.file,lut:P+'lut.png',ids:P+'ids.png'};
 const keys=Object.keys(files);let n=0;
 const imgs=await Promise.all(keys.map(k=>loadImage(files[k]).then(i=>{progress(.05+.9*(++n)/keys.length);return i;})));
 const I={};keys.forEach((k,i)=>I[k]=imgs[i]);
 gl=$('canvas').getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl)throw new Error('WebGL を使えません');
 prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 for(const u of ['tClear','tStorm','tGlowC','tGlowS','tLut','kBase','kGC','kGS','gRect','gTile','master','crop','wS','veilA','windA','tt','beatPh','circPh','flowerW','ampA','seed','rows'])U[u]=gl.getUniformLocation(prog,u);
 /* 地は 4 枚。表示に使うのは澄んだ地と嵐の地の 2 枚で、地面を替える時に差し替える */
 TEX.a=texture(I.a,0);TEX.b=texture(I.b,0);TEX.as=texture(I.as,1);TEX.bs=texture(I.bs,1);
 TEX.gc=texture(I.gc,2);TEX.gs=texture(I.gs,3);TEX.lut=texture(I.lut,4);
 gl.uniform1i(U.tClear,0);gl.uniform1i(U.tStorm,1);gl.uniform1i(U.tGlowC,2);gl.uniform1i(U.tGlowS,3);gl.uniform1i(U.tLut,4);
 bind(2,TEX.gc);bind(3,TEX.gs);bind(4,TEX.lut);ground('a');
 gl.uniform3f(U.kGC,...L.glow_c.k);gl.uniform3f(U.kGS,...L.glow_s.k);
 gl.uniform4f(U.gRect,...meta.glowRect);
 gl.uniform4f(U.gTile,L.glow_c.tile[0],L.glow_c.tile[1],L.glow_c.gap,L.glow_c.size[1]);
 gl.uniform2f(U.master,meta.width,meta.height);
 const R=meta.rows;gl.uniform4f(U.rows,R.stem0,R.stem1,R.flow0,R.flow1);
 /* 判定：画素ごとの対象番号（原版の寸法） */
 const cv=document.createElement('canvas');cv.width=I.ids.width;cv.height=I.ids.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(I.ids,0,0);if(I.ids.close)I.ids.close();
 const px=cx.getImageData(0,0,cv.width,cv.height).data;ids=new Uint8Array(cv.width*cv.height);for(let i=0;i<ids.length;i++)ids[i]=px[i*4];
 progress(1);
}
function ground(which){
 if(boundGround===which)return;boundGround=which;
 const L=meta.layers;
 if(which==='a'){bind(0,TEX.a);bind(1,TEX.as);gl.uniform2f(U.kBase,L.base_a.k,L.base_as.k);}
 else{bind(0,TEX.b);bind(1,TEX.bs);gl.uniform2f(U.kBase,L.base_b.k,L.base_bs.k);}
}
function render(){
 const t=clock.t;
 gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
 ground(after()?'b':'a');
 gl.uniform4f(U.crop,crop.x,crop.y,crop.w,crop.h);
 gl.uniform1f(U.wS,wStorm());gl.uniform1f(U.veilA,veil());gl.uniform1f(U.windA,reduced?wind()*.5:wind());gl.uniform1f(U.tt,t);
 gl.uniform1f(U.beatPh,((t%BEAT)+BEAT)%BEAT/BEAT);gl.uniform1f(U.circPh,((t%CIRC)+CIRC)%CIRC/CIRC);
 const ph=((t%BEAT)+BEAT)%BEAT/BEAT;gl.uniform1f(U.flowerW,1+amp()*.22*Math.exp(-6*ph));
 gl.uniform1f(U.ampA,amp());gl.uniform1f(U.seed,(t*7.13)%10);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

/* ---------------------------------------------------------------- 切り出しと大きさ
   原版（横 tan ±0.785・縦 tan −0.185〜+0.739、2944×1734）から、画面の縦横比の最大の矩形を切る。
   横長：横いっぱい、縦は花の上端から杭の列まで。縦長：縦いっぱい、中心を植物へ */
function layout(){
 const vw=innerWidth,vh=innerHeight,W=meta?meta.width:2944,H=meta?meta.height:1734,a=vw/vh;
 if(a>=W/H){crop.w=W;crop.h=W/a;crop.x=0;
  /* 残したい縦の範囲（花の上端の余白から杭の列まで）が入るなら、その中心に。入らなければ上（花）を優先する */
  const pr=meta?meta.plantRows:[140,1560];
  crop.y=crop.h>=pr[1]-pr[0]?(pr[0]+pr[1])/2-crop.h/2:pr[0];crop.y=Math.min(H-crop.h,Math.max(0,crop.y));}
 else{crop.h=H;crop.w=H*a;const c=meta?meta.portraitCx:1510;crop.x=Math.min(W-crop.w,Math.max(0,c-crop.w/2));crop.y=0;}
 const k=vw/crop.w,img=$('preview');img.style.width=(W*k)+'px';img.style.transform='translate('+(-crop.x*k)+'px,'+(-crop.y*k)+'px)';
 if(!gl)return;
 const dpr=Math.min(devicePixelRatio||1,2),q=quality==='low'?.6:quality==='high'?1:scale;
 const cw=Math.max(1,Math.round(Math.min(vw*dpr,crop.w*1.5)*q)),ch=Math.max(1,Math.round(cw*vh/vw));
 const c=$('canvas');if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}
}

/* ---------------------------------------------------------------- 面 */
function menu(open){if(liquid.blocked)return;if(open)liquid.ui.open('#menu',$('menuToggle'));else liquid.ui.close('#menu');$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');if(open)$('pause').focus();schedule();}
function openInfo(title){if(!liquid.blocked){returnFocus=document.activeElement;menu(false);}$('infoTitle').textContent=title;$('infoBody').replaceChildren();liquid.ui.open('#info',lastPointer||$('menuToggle'));lastPointer=null;liquid.lock($('info'));$('closeInfo').focus();schedule();}
function paragraph(text){const p=document.createElement('p');p.textContent=text;$('infoBody').append(p);}
function selectTarget(id){const d=panels[id];if(!d)return;openInfo(d.title);paragraph(done()&&d.after?d.after:d.text);schedule();}
function closeInfo(){liquid.ui.close('#info',()=>{liquid.unlock();if(returnFocus&&returnFocus.isConnected&&!returnFocus.closest('[hidden]'))returnFocus.focus();else $('menuToggle').focus();schedule();});schedule();}
$('closeInfo').onclick=e=>{e.preventDefault();e.stopPropagation();closeInfo();};
$('menuToggle').onclick=()=>menu($('menu').hidden);
$('targets').onclick=()=>{openInfo('観測する対象');const list=document.createElement('ul');list.className='target-list';for(const [id,label] of TARGETS){const li=document.createElement('li'),b=document.createElement('button');b.textContent=label;b.onclick=()=>selectTarget(id);li.append(b);list.append(li);}$('infoBody').append(list);};
$('about').onclick=()=>{openInfo('Xerophyte');/* 本文はページの説明文と同じ（英語表示では h53-chrome が一覧の英語の札に差し替える） */const d=document.querySelector('meta[name="description"]');paragraph(d?d.getAttribute('content'):'');paragraph('h!ro53 / deus ex machina');};
$('settings').onclick=()=>{openInfo('画質・動き');const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=reduced;check.onchange=()=>{reduced=check.checked;document.body.classList.toggle('reduce-ui-motion',reduced);schedule();};label.append(check,document.createTextNode(' 光の波と砂の流れを弱める'));$('infoBody').append(label);const ql=document.createElement('label');ql.textContent='画質';const sel=document.createElement('select');for(const [value,text] of [['auto','自動'],['high','高'],['low','軽量']]){const op=document.createElement('option');op.value=value;op.textContent=text;sel.append(op);}sel.value=quality;sel.onchange=()=>{quality=sel.value;scale=1;layout();schedule();};ql.append(sel);$('infoBody').append(ql);};

/* ---------------------------------------------------------------- 状態 */
let shownLog='';
function visText(){const v=visibility();return v>=1000?'視程 '+(Math.round(v/100)/10)+' km':'視程 '+Math.round(v/5)*5+' m';}
function syncUI(){
 $('storm').disabled=!ready||clock.stormAt!==null;$('storm').setAttribute('aria-pressed',String(clock.stormAt!==null));
 const w=wind();
 $('phase').textContent=!clock.running?'一時停止':visText()+' · 風 '+Math.round(2+16*w)+' m/s'+(done()?' — 個体に変化なし':'');
 $('pause').textContent=clock.running?'一時停止':'再開';$('pause').setAttribute('aria-pressed',String(!clock.running));
 const line=logLine();
 if(line!==shownLog){shownLog=line;const el=$('log');el.classList.remove('on');if(line){el.textContent=line;void el.offsetWidth;el.classList.add('on');}}
}
$('storm').onclick=()=>{if(clock.stormAt!==null)return;clock.stormAt=clock.t;if(!clock.running)play();syncUI();schedule();};
$('pause').onclick=()=>{clock.running?pause():play();syncUI();schedule();};
function showUI(on){shown=on;for(const id of ['masthead','controls','back','menuToggle'])$(id).hidden=!on;$('showUI').hidden=on;menu(false);if(!on){liquid.ui.hide('#info');liquid.unlock();}(on?$('menuToggle'):$('showUI')).focus();schedule();}
$('hideUI').onclick=()=>showUI(false);$('showUI').onclick=()=>showUI(true);
$('fullscreen').onclick=()=>{menu(false);liquid.fullscreen($('fullscreen'),()=>{openInfo('全画面表示');paragraph('この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。');});};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('info').hidden)closeInfo();else if(!$('menu').hidden){menu(false);$('menuToggle').focus();}else showUI(!shown);}if(e.code==='Space'&&!['BUTTON','INPUT','SELECT','A'].includes(document.activeElement.tagName)&&ready){e.preventDefault();$('pause').click();}});

/* ---------------------------------------------------------------- 判定（的は出さない。触れた位置の対象を開く）
   細い対象（花・杭と計測器・根）は指の幅（半径 22 px）の中にあれば、それを優先する */
function pick(clientX,clientY){
 const r=$('canvas').getBoundingClientRect(),W=meta.width,H=meta.height;
 const mx=crop.x+(clientX-r.left)/r.width*crop.w,my=crop.y+(clientY-r.top)/r.height*crop.h;
 const at=(x,y)=>{x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=W||y>=H?0:ids[y*W+x];};
 const hit=at(mx,my);if(hit===2||hit===5||hit===4)return ID_NAME[hit];
 const rad=22*crop.w/r.width,step=Math.max(1,rad/8);let best=0,bd=1e9;
 for(let dy=-rad;dy<=rad;dy+=step)for(let dx=-rad;dx<=rad;dx+=step){const d=dx*dx+dy*dy;if(d>rad*rad)continue;const v=at(mx+dx,my+dy);if((v===2||v===5||v===4)&&d<bd){best=v;bd=d;}}
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
load(n=>{$('loadProgress').value=n*100;$('loadText').textContent='観測地を準備しています · '+Math.round(n*100)+'%';}).then(()=>{
 ready=true;layout();render();liquid.afterRender(performance.now());document.body.classList.add('ready');$('loading').hidden=true;
 for(const id of ['pause','targets'])$(id).disabled=false;play();syncUI();schedule();
 window.__xero={clock,crop,meta:()=>meta,pick,wStorm,veil,wind,visibility,after,done};
}).catch(error);
})();
