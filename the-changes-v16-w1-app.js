/* 車窓 / THE CARRIAGE WINDOW（旧題 乗換 / THE CHANGES）v16 w1 — 夜の車窓（原作『書 / THE WRITTEN』篇01・03・05〜07）。
 * 視点は一つ（向かい合わせの座席の通路側から、斜め前の窓）。
 * 車内と遠い光は Cycles の一枚を光源ごとに分けた層で、ここで時間の重みを掛けて足し、AgX の表で表示色にする。
 *   天井の帯（芯・外側）＋座席のあいだの光＋扉の上の面（「終点まで」と数字 八〜一、最後は「次停車　終点」）＋遠い光（夜空・にじみを含む）
 *   ＋駅の灯（車の前後 6 区画。明るさだけを持ち、色は車内の灯の色味から戻す）
 * 窓の中の近いもの（地面・通過する駅のホーム・柱・屋根）は、カメラの光線と平面の交点をここで解いて描く。
 *   窓の透過の地図（Cycles）を重みにする。流れのぶれは、柱の周期的な箱を区間で積分して正確に出す。
 * 時間（戻らない）：終点まで 八から始まり、31.2 s（40 拍）ごとに駅を一つ過ぎて一つ減る。最後の駅を過ぎると「次停車　終点」になり、駅は来なくなる。
 *   この作品では乗り換えがない（作者裁定 2026-09-26）。題・説明・表示に「乗換」の文言を使わない。
 *   三つ目の駅のあと、篇03 の順で灯が落ちる：天井の帯が端から細くなり、座席のあいだの光が消え、扉の上の行だけが残って少し下がり、止まる。
 *   目が慣れる分だけ露出が上がり、遠い光が窓いっぱいに立つ。
 * 描画の予約は schedule() の一本だけ（共有 UI の requestFrame もここへ束ねる）。 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const P='the-changes-v16-w1-';
const BEAT=0.78,CYCLE=40*BEAT;                    /* 31.2 s：駅から駅まで */
const V=20;                                       /* 走る速さ m/s（作者判断） */
const ST_LEN=170,ST_FIRST=CYCLE/2,ST_N=8;          /* ホームの長さ、最初の駅の中央を過ぎる時刻、駅の数（終点まで 八 → 次停車 終点） */
const NUMS='八七六五四三二一';
const NIGHT_AT=ST_FIRST+2*CYCLE+ST_LEN/2/V+6;      /* 三つ目の駅を出て 6 s 後に灯が落ち始める */
/* 観測の一行（原作の文）。t は旅の秒 */
const LOGS=[[3,'近いものは流れ、遠いものは動かない。'],
 [ST_FIRST-2,'柱が一本ずつ流れていき、面の光が後ろへ抜けていく。'],
 [NIGHT_AT,'壊れたのではなく、順に暗くなっていった。'],
 [NIGHT_AT+11,'最後に、扉の上の行だけが残る。'],
 ['END','外の光は、まだ同じところにあった。'],['END+18','あれだけは、駅をいくつ過ぎても同じところにあった。']];
const LOG_SHOW=8;
const panels={
 far:{title:'遠い光',text:'遠く、低い位置に、面のような光が重なっている。重なった隙間が黒い。\n縦に長い筋が並び、筋は下のほうで太く、上へ行くにつれて細くなり、途中から数が増えていく。上の端は、窓の枠に切られて見えない。\n列車は走っているのに、筋の並びは窓の枠に対して同じ幅のまま動かない。近いものなら、走れば横へ流れる。流れないなら、遠い。'},
 panel:{title:'扉の上の面',text:'扉の上に、行が一つ出ている。\n＞ 当該列車　終点まで\n後ろの数は、駅を過ぎるたびに一つ減る。一の次は、行が替わる。\n＞ 当該列車　次停車　終点'},
 window:{title:'窓',text:'暗い窓に、車内が映る。灯が落ちると映り込みは消えて、外だけが残る。\n地面の色は、窓の下で流れて消えていく。'},
 seat:{title:'座席',text:'向かい合わせの座席。誰も乗っていない。\n布は薄く、肘の当たるところがこすれて色が抜けている。'},
 bag:{title:'袋',text:'向かいの席に、袋が一つ置いてある。\n工具。布。水の容器と、端末が二つ。包の空を畳んで束ねたもの。合わない補装が二組と、掌に収まる小さなもの。\n九つある。'}
};
const TARGETS=[['far','遠い光'],['panel','扉の上の面'],['window','窓'],['seat','座席'],['bag','袋']];
const ID_NAME={1:'seat',2:'window',3:'panel',4:'bag',5:'far'};

const DBG=new URLSearchParams(location.search).get('dbg');
let meta=null,gl=null,prog=null,U={},ids=null,ready=false,raf=0,shown=true,returnFocus=null,lastPointer=null;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,quality='auto',scale=1;
const crop={x:0,y:0,w:1,h:1};
const clock={t:0,running:false,last:null};
const frameSamples=[];let adaptAt=0,lastReadout=0;
document.body.classList.toggle('reduce-ui-motion',reduced);

/* ---------------------------------------------------------------- 共有 UI */
const liquid=new H53LiquidHost({source:$('canvas'),requestFrame:schedule,night:true,surfaces:[{selector:'#back,#pause,#menuToggle,#showUI',kind:'control'},{selector:'#menu',kind:'panel',anchor:'#menuToggle'},{selector:'#info',kind:'panel',anchor:'#menuToggle'},{selector:'#closeInfo',kind:'control',parent:'#info'}]});
window.__h53Liquid=liquid;

function error(e){$('error').hidden=false;$('error').textContent='車内を表示できませんでした。接続を確認して、もう一度お試しください。\n'+(e&&e.message||String(e));$('loadText').textContent='読み込みを完了できませんでした';$('retry').hidden=false;$('loading').hidden=false;}
addEventListener('error',e=>{if(e.target&&e.target.tagName==='SCRIPT')return;error(e.error||e.message);});addEventListener('unhandledrejection',e=>error(e.reason));$('retry').onclick=()=>location.reload();

/* ---------------------------------------------------------------- 時間 */
function advance(now){if(clock.running&&clock.last!==null)clock.t+=Math.min(.1,(now-clock.last)/1000);clock.last=now;}
function play(){clock.running=true;clock.last=null;}
function pause(){clock.running=false;clock.last=null;}
function sm(a,b,x){const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);}
const stCenter=k=>ST_FIRST+k*CYCLE;                             /* k = 0..7 */
const stP0=k=>V*stCenter(k)-ST_LEN/2;                           /* 旅の距離で測ったホームの始まり */
const END_T=stCenter(ST_N-1)+(ST_LEN/2+14)/V;                   /* 最後の駅を出る時刻 */
/* 過ぎた駅の数（面の数字）。車の後ろの端（−12 m）がホームの終わりを抜けたとき一つ減る */
function passed(t){let n=0;for(let k=0;k<ST_N;k++)if(V*t-12>stP0(k)+ST_LEN)n++;return n;}
/* いま窓の横にある駅（旅の距離 s で、ホームに最も近いもの） */
function nearStation(t){const s=V*t;let best=0,bd=1e9;for(let k=0;k<ST_N;k++){const d=Math.abs(s-(stP0(k)+ST_LEN/2));if(d<bd){bd=d;best=k;}}return best;}
/* 灯の重み（篇03 の順）。u は夜が始まってからの秒 */
function lights(t){
 const u=t-NIGHT_AT;
 return {outer:1-sm(0,4,u),core:1-sm(3.5,8,u),seat:1-sm(8.5,10,u),panel:1-.45*sm(10,13.5,u),ev:(meta?meta.night_ev:2.3)*sm(6,17,u)};
}
function logLine(t){
 for(const [k,text] of LOGS){const at=typeof k==='number'?k:k==='END'?END_T+2:END_T+20;if(t>=at&&t<at+LOG_SHOW)return text;}
 return '';
}

/* ---------------------------------------------------------------- 描画 */
const VS='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
const FS=[
'precision highp float;varying vec2 v;',
'uniform sampler2D tCore,tOuter,tSeat,tFar,tPanel,tStA,tStB,tMask,tLut,tNoise;',
'uniform vec4 kA;uniform vec3 kSA,kSB;uniform float kP,tmax;uniform vec2 master,panelSize;uniform vec4 crop;',
'uniform float wCore,wOuter,wSeat,expo,seed;uniform vec3 wSA,wSB;',
'uniform vec4 pSrc[11];uniform vec2 pAtl[11];uniform float pW[11];',
'uniform vec3 eye;uniform mat3 rot;uniform vec2 tanXY;',
'uniform float S,blurL,dist,spill,hw,dbgFar,dbgOcc;',
'vec3 dec(vec3 y,float k){y=min(y,vec3(254./255.));vec3 t=y*y;return k*t/(1.-t);}',
'float dec1(float y,float k){y=min(y,254./255.);float t=y*y;return k*t/(1.-t);}',
'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.)+1024.*max(c,vec3(0.)))/19.,0.,1.)*63.;',
' float b0=floor(p.z),b1=min(b0+1.,63.),f=p.z-b0;',
' vec2 o0=vec2(mod(b0,8.),floor(b0/8.))*64.,o1=vec2(mod(b1,8.),floor(b1/8.))*64.;',
' vec3 c0=texture2D(tLut,(o0+p.xy+.5)/512.).rgb,c1=texture2D(tLut,(o1+p.xy+.5)/512.).rgb;return mix(c0,c1,f);}',
'float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233))+seed)*43758.5453);}',
/* 周期 per・幅 w の箱（0..w で 1）を [u−a, u+a] で平均した値。流れのぶれを正確に出す */
'float pcum(float x,float per,float w){float n=floor(x/per);return n*w+clamp(x-n*per,0.,w);}',
'float boxav(float u,float a,float per,float w){a=max(a,1e-3);return (pcum(u+a,per,w)-pcum(u-a,per,w))/(2.*a);}',
'float span(float u,float a,float u0,float u1){a=max(a,1e-3);return clamp((min(u+a,u1)-max(u-a,u0))/(2.*a),0.,1.);}',
'float nz(vec2 q){return texture2D(tNoise,q).r;}',
/* 地面（平らな土）：流れの向き（Y）にぶれた模様。遠いほど暗く */
'vec3 ground(vec3 h,float T){float g=0.;for(int i=0;i<6;i++){float f=float(i)/5.-.5;vec2 q=vec2(h.x,h.y+S+f*blurL);g+=nz(q*.23)*.45+nz(q*1.9)*.35+nz(q*vec2(6.,1.5))*.20;}g/=6.;',
' float alb=.05+.10*g;float d=length(h.xy-eye.xy);',
/* 照らすもの：灯のある間は窓の光が土に落ちる（窓の間隔 1.9 m で少し揺れる）。遠い光は灯に関わらず、薄い青緑で土を照らす */
' vec3 lit=vec3(.55,.80,.78)*.065+vec3(1.,.93,.84)*spill*.055*smoothstep(1.9,3.2,h.x)*(1.-smoothstep(5.,8.,h.x))*(.8+.2*cos(6.2832*h.y/1.9));',
' return alb*lit*exp(-d/60.);}',
/* 駅（厚みのある立体。L = ホームの長さ、u = 車の座標 y + S はホームの始まりから測った位置）：
   ホーム 厚さ 0.55 m のコンクリートの塊（上面が床、線路側の縁の面、両端の面）／屋根 厚さ 0.8 m の板（下面に灯具、前の鼻先と両端の面）／
   奥の壁 厚さ 0.5 m／柱 0.6 m 角を 13 m ごと（正面と側面。正面に面、篇01「柱の一本に面が付いていた」）。
   灯はホームの上だけを照らす（外から近づくと、明るい箱として見える）。
   流れのぶれは、露光のあいだの 4 点で駅全体を追い、平均する（端もぶれる）。W1 初版の薄い面だけの駅は、差し掛かるときの端がペラペラに見えた（作者の指摘 2026-09-26） */
'const float LEN='+ST_LEN.toFixed(1)+',PER=13.,PW=.6,PO=3.;',
'vec2 boxT(vec3 ro,vec3 rd,vec3 b0,vec3 b1,out vec3 nrm){vec3 inv=1./rd;vec3 t0=(b0-ro)*inv,t1=(b1-ro)*inv;vec3 mn=min(t0,t1),mx=max(t0,t1);',
' float tn=max(max(mn.x,mn.y),mn.z),tf=min(min(mx.x,mx.y),mx.z);',
' nrm=tn==mn.x?vec3(-sign(rd.x),0.,0.):tn==mn.y?vec3(0.,-sign(rd.y),0.):vec3(0.,0.,-sign(rd.z));return vec2(tn,tf);}',
'float inside(float u){return smoothstep(-1.5,.5,u)*(1.-smoothstep(LEN-.5,LEN+1.5,u));}',
'float lampU(float u){float m=mod(u-1.,6.5);return smoothstep(0.,.15,m)*(1.-smoothstep(2.05,2.2,m))*inside(u);}',
'float Eat(vec3 h,float xe){float pool=.55+.45*cos(6.2832*(h.y-2.1)/6.5);return (.25+.9*exp(-pow(h.x-(xe+1.1),2.)/6.))*mix(1.,pool,.6)*inside(h.y);}',
'vec4 trace(vec3 o,vec3 d,float s){',
' float xe=hw+.26,xp=xe+3.2,xb=xe+7.,zf=-.02,zr=4.1,zg=-.57,xr0=xe+.15;',
' vec3 ro=vec3(o.x,o.y+s,o.z),rd=vec3(d.x,abs(d.y)<1e-5?1e-5:d.y,abs(d.z)<1e-5?1e-5:d.z);',
' float best=1e9;int id=-1;vec3 n=vec3(0.),nn;vec2 t;',
' t=boxT(ro,rd,vec3(xe,0.,zg),vec3(xb+.5,LEN,zf),nn);if(t.x<t.y&&t.x>0.&&t.x<best){best=t.x;n=nn;id=0;}',
' t=boxT(ro,rd,vec3(xr0,-2.,zr),vec3(xb+.5,LEN+2.,zr+.8),nn);if(t.x<t.y&&t.x>0.&&t.x<best){best=t.x;n=nn;id=1;}',
' t=boxT(ro,rd,vec3(xb,0.,zf),vec3(xb+.5,LEN,zr),nn);if(t.x<t.y&&t.x>0.&&t.x<best){best=t.x;n=nn;id=2;}',
/* 柱：正面（X xp）で当たるか、柱と柱のあいだから入って側面で当たるか */
' float tp0=(xp-ro.x)/rd.x,tp1=(xp+PW-ro.x)/rd.x;',
' if(tp0>0.&&tp0<best){float u0=ro.y+rd.y*tp0,z0=ro.z+rd.z*tp0;float m=mod(u0-PO,PER);',
'  if(m<PW&&u0>PO-1.&&u0<LEN&&z0>zf&&z0<zr){best=tp0;n=vec3(-1.,0.,0.);id=3;}',
'  else{float ue=rd.y>0.?u0+(PER-m):u0-(m-PW);float te=tp0+(ue-u0)/rd.y;float ze=ro.z+rd.z*te;',
'   if(te>tp0&&te<tp1&&te<best&&ue>PO-1.&&ue<LEN&&ze>zf&&ze<zr){best=te;n=vec3(0.,-sign(rd.y),0.);id=4;}}}',
' if(id<0)return vec4(0.);',
' vec3 h=ro+rd*best;float E=Eat(h,xe);vec3 W=vec3(1.,.96,.9);vec3 c;',
' if(id==0){if(n.z>.5){float g=nz(vec2(h.x*.7,h.y*.35))*.6+nz(vec2(h.x,h.y)*2.3)*.4;float edge=1.-smoothstep(.40,.46,h.x-xe);',
'   float alb=mix(.11+.07*g,.38,edge);vec3 r=vec3(rd.x,rd.y,-rd.z);float tt=(zr-.05-h.z)/max(r.z,1e-3);vec3 q=h+r*tt;',
'   c=W*alb*E+.12*W*7.*smoothstep(.2,.05,abs(q.x-(xe+1.1)))*lampU(q.y);}',
'  else{float g=nz(vec2(h.y,h.z)*.8);c=W*(.07+.03*g)*(.12+.25*E);}}',
' else if(id==1){if(n.z<-.5){c=vec3(.025,.025,.028)+W*7.*smoothstep(.16,.04,abs(h.x-(xe+1.1)))*lampU(h.y);}',
'  else{float band=n.x<-.5?smoothstep(4.35,4.4,h.z)*(1.-smoothstep(4.5,4.55,h.z)):0.;c=vec3(.045,.046,.05)*(.15+.2*E)+vec3(.8,.9,.92)*.18*band*inside(h.y);}}',
' else if(id==2){float band=smoothstep(2.3,2.35,h.z)*(1.-smoothstep(2.55,2.6,h.z));c=vec3(.07,.07,.075)*E+vec3(.9,.95,.97)*.25*band*inside(h.y)+vec3(.05)*(.1)*(1.-inside(h.y));}',
' else{float up=(.55+.5*exp(-pow(h.z-3.,2.)/4.))*max(E,.08);',
'  if(id==3){float m=mod(h.y-PO,PER);float pan=step(.08,m)*step(m,.52)*step(1.2,h.z)*step(h.z,2.3);c=vec3(.46,.45,.43)*up+vec3(.9,.97,.97)*4.*pan*inside(h.y);}',
'  else c=vec3(.30,.29,.28)*up*.7;}',
' return vec4(c*.8,1.);}',
'vec3 station(vec3 o,vec3 d,out float cov){cov=0.;if(d.x<=0.)return vec3(0.);vec3 acc=vec3(0.);',
' float j=hash(gl_FragCoord.xy*.37);',
' for(int k=0;k<6;k++){vec4 r=trace(o,d,S+blurL*((float(k)+j)/6.-.5));acc+=r.rgb;cov+=r.a;}',   /* 画素ごとに少しずらす（4 点では端が 4 重の段になった） */
' cov/=6.;return acc/6.;}',
'void main(){vec2 p=crop.xy+v*crop.zw;vec2 uv=p/master;',
' vec3 core=dec(texture2D(tCore,uv).rgb,kA.x),outer=dec(texture2D(tOuter,uv).rgb,kA.y),seat=dec(texture2D(tSeat,uv).rgb,kA.z),far=dec(texture2D(tFar,uv).rgb,kA.w);',
' float m=texture2D(tMask,uv).r;float Tn=m*m;',
' vec3 c=wCore*core+wOuter*outer+wSeat*seat;',
/* 扉の上の面：行と数字の切り出し（小さい矩形の中だけ） */
' for(int i=0;i<11;i++){float w=pW[i];if(w<.002)continue;vec4 sr=pSrc[i];vec2 d=p-sr.xy;',
'  if(d.x>=0.&&d.y>=0.&&d.x<sr.z&&d.y<sr.w)c+=w*dec(texture2D(tPanel,(pAtl[i]+d)/panelSize).rgb,kP);}',
/* 駅の灯：明るさ × 車内の面の色味。窓の外の分は窓の中の駅が受け持つので除く */
' vec3 sa=texture2D(tStA,uv).rgb,sb=texture2D(tStB,uv).rgb;',
' float sl=wSA.x*dec1(sa.r,kSA.x)+wSA.y*dec1(sa.g,kSA.y)+wSA.z*dec1(sa.b,kSA.z)+wSB.x*dec1(sb.r,kSB.x)+wSB.y*dec1(sb.g,kSB.y)+wSB.z*dec1(sb.b,kSB.z);',
' vec3 ref=core+outer+seat;float rl=dot(ref,vec3(.2126,.7152,.0722));vec3 chroma=rl>1e-5?ref/rl:vec3(1.);chroma=clamp(chroma,0.,3.);',
' c+=sl*chroma*vec3(1.,.95,.88)*(1.-Tn);',
/* 窓の中：駅、なければ地面。駅は遠い光を隠す */
' vec3 wc=vec3(0.);float occ=0.;',
' if(Tn>.004){vec2 tt=vec2((p.x/master.x*2.-1.)*tanXY.x,(1.-p.y/master.y*2.)*tanXY.y);vec3 d=normalize(rot*vec3(tt,-1.));',
'  float cov;vec3 sc=station(eye,d,cov);occ=cov;',
'  vec3 gc=vec3(0.);if(d.z<0.){vec3 h=eye+d*((-.55-eye.z)/d.z);if(h.x>hw)gc=ground(h,Tn);}',
'  wc=(sc+gc*(1.-cov))*Tn*tmax;}',
/* 駅が覆う所では、窓を通る遠い光を残さず消す（透過の地図 T を掛けると 1 に届かず、約 15 % が残って夜に見えた） */
' c+=dbgFar*far*(1.-occ)+wc;if(dbgOcc>.5){gl_FragColor=vec4(vec3(occ),1.);return;}',
' vec3 o=agx(c*expo)+(hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(o,1.);}'
].join('\n');

function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
function texture(img,unit,opt){opt=opt||{};const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
 if(opt.data)gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,opt.size,opt.size,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,opt.data);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
 const f=opt.nearest?gl.NEAREST:gl.LINEAR;
 if(opt.repeat){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);}
 else{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
 return t;}
/* 層・表・判定は数値の画像なので、色の変換をかけずに読む（fetch → createImageBitmap。使えない環境だけ <img>） */
function loadImage(src){
 const viaImg=()=>new Promise((ok,ng)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ng(new Error('読み込めませんでした：'+src));i.src=src;});
 if(typeof createImageBitmap!=='function')return viaImg();
 return fetch(src).then(r=>{if(!r.ok)throw new Error('読み込めませんでした：'+src+' '+r.status);return r.blob();})
  .then(b=>createImageBitmap(b,{colorSpaceConversion:'none',premultiplyAlpha:'none'}).catch(()=>viaImg()));
}
/* 地面と床の模様：繰り返す値ノイズ（256²、数オクターブ）。起動時に作る（読み込みなし） */
function noiseTex(){
 const N=256,out=new Uint8Array(N*N),acc=new Float32Array(N*N);let seed=53;const rnd=()=>(seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
 let amp=1,tot=0;
 for(const cell of [32,16,8,4]){const g=N/cell,G=new Float32Array(g*g);for(let i=0;i<G.length;i++)G[i]=rnd();
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const fx=x/cell,fy=y/cell,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
   const a=G[(y0%g)*g+x0%g],b=G[(y0%g)*g+(x0+1)%g],c=G[((y0+1)%g)*g+x0%g],d=G[((y0+1)%g)*g+(x0+1)%g];
   acc[y*N+x]+=amp*((a*(1-sx)+b*sx)*(1-sy)+(c*(1-sx)+d*sx)*sy);}
  tot+=amp;amp*=.55;}
 for(let i=0;i<out.length;i++)out[i]=Math.max(0,Math.min(255,Math.round(acc[i]/tot*255)));
 return {data:out,size:N};
}
/* カメラの回転（Blender の rotation_euler = (90° + 仰角, 0, −向き)、XYZ 順）→ 列優先の mat3 */
function camRot(yaw,pitch){
 const ax=(90+pitch)*Math.PI/180,az=-yaw*Math.PI/180,cx=Math.cos(ax),sx=Math.sin(ax),cz=Math.cos(az),sz=Math.sin(az);
 /* R = Rz · Rx */
 const R=[[cz,-sz*cx,sz*sx],[sz,cz*cx,-cz*sx],[0,sx,cx]];
 return new Float32Array([R[0][0],R[1][0],R[2][0],R[0][1],R[1][1],R[2][1],R[0][2],R[1][2],R[2][2]]);
}

async function load(progress){
 const r=await fetch(P+'meta.json');if(!r.ok)throw new Error('meta '+r.status);meta=await r.json();progress(.04);
 const L=meta.layers,names=['core','outer','seat','far','panel','st-a','st-b','mask','lut','ids'];let n=0;
 const file=k=>k==='lut'?P+'lut.png':k==='ids'?meta.ids_file:L[k].file;
 const imgs=await Promise.all(names.map(k=>loadImage(file(k)).then(i=>{progress(.04+.92*(++n)/names.length);return i;})));
 const I={};names.forEach((k,i)=>I[k]=imgs[i]);
 gl=$('canvas').getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl)throw new Error('WebGL を使えません');
 if(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)<10)throw new Error('この端末の WebGL はテクスチャを 10 枚同時に使えません');
 prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 for(const u of ['dbgFar','dbgOcc','tCore','tOuter','tSeat','tFar','tPanel','tStA','tStB','tMask','tLut','tNoise','kA','kSA','kSB','kP','tmax','master','panelSize','crop','wCore','wOuter','wSeat','expo','seed','wSA','wSB','pSrc','pAtl','pW','eye','rot','tanXY','S','blurL','dist','spill','hw'])U[u]=gl.getUniformLocation(prog,u);
 [['core','tCore'],['outer','tOuter'],['seat','tSeat'],['far','tFar'],['panel','tPanel',{nearest:false}],['st-a','tStA'],['st-b','tStB'],['mask','tMask'],['lut','tLut']].forEach(([k,u,o],i)=>{texture(I[k],i,o);gl.uniform1i(U[u],i);});
 texture(null,9,Object.assign({repeat:true},noiseTex()));gl.uniform1i(U.tNoise,9);
 gl.uniform4f(U.kA,L.core.k,L.outer.k,L.seat.k,L.far.k);gl.uniform3f(U.kSA,...L['st-a'].k);gl.uniform3f(U.kSB,...L['st-b'].k);
 gl.uniform1f(U.kP,L.panel.k);gl.uniform1f(U.tmax,L.mask.tmax);gl.uniform2f(U.master,meta.width,meta.height);gl.uniform2f(U.panelSize,...L.panel.size);
 const pn=['panel','n8','n7','n6','n5','n4','n3','n2','n1','pend','pglow'],src=new Float32Array(44),atl=new Float32Array(22);
 pn.forEach((k,i)=>{src.set(meta.panel[k].src,i*4);atl.set(meta.panel[k].atlas,i*2);});
 gl.uniform4fv(U.pSrc,src);gl.uniform2fv(U.pAtl,atl);
 gl.uniform3f(U.eye,...meta.eye);gl.uniformMatrix3fv(U.rot,false,camRot(meta.yaw,meta.pitch));gl.uniform2f(U.tanXY,meta.tan_x,meta.tan_y);gl.uniform1f(U.hw,meta.hw+meta.reveal);
 /* 判定：画素ごとの対象番号（原版の寸法） */
 const cv=document.createElement('canvas');cv.width=I.ids.width;cv.height=I.ids.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(I.ids,0,0);if(I.ids.close)I.ids.close();
 const px=cx.getImageData(0,0,cv.width,cv.height).data;ids=new Uint8Array(cv.width*cv.height);for(let i=0;i<ids.length;i++)ids[i]=px[i*4];
 progress(1);
}

/* 駅の灯の区画の重み：区画の中心（車の座標 y）がホームの上にある分。端は 3 m でぼかす。柱の面の光で少し揺れる */
function stationWeights(t){
 const s=V*t,k=nearStation(t),u0=s-stP0(k),out=new Float32Array(6);
 const ys=meta.station_y;for(let i=0;i<6;i++){const yc=(ys[5-i]+ys[6-i])/2,u=yc+u0;
  const w=sm(-3,3,u)*(1-sm(ST_LEN-3,ST_LEN+3,u));
  const fl=reduced?1:.9+.1*Math.cos(2*Math.PI*u/13);out[i]=w*fl;}
 return out;
}
function render(){
 const t=clock.t,Lw=lights(t),n=passed(t);
 gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
 gl.uniform4f(U.crop,crop.x,crop.y,crop.w,crop.h);
 gl.uniform1f(U.wCore,Lw.core);gl.uniform1f(U.wOuter,Lw.outer);gl.uniform1f(U.wSeat,Lw.seat);gl.uniform1f(U.expo,Math.pow(2,Lw.ev));
 /* 面：地の光（pglow）はいつも。行「終点まで」といまの数字、最後の駅を過ぎたら「次停車　終点」（pend）。切り替わりは 0.12 s */
 const pw=new Float32Array(11);pw[10]=Lw.panel;
 const tSwitch=k=>stP0(k)+ST_LEN+12;   /* 旅の距離で、k 番目の駅を抜ける所 */
 const since=n>0?(V*t-tSwitch(n-1))/V:1,f=Math.min(1,since/.12);
 const show=m=>{if(m<ST_N){pw[0]+=1;pw[1+m]+=1;}else pw[9]+=1;};   /* m = 過ぎた駅の数 */
 const wA=new Float32Array(11);
 if(n>0&&f<1){show(n-1);for(let i=0;i<10;i++){wA[i]=pw[i]*(1-f);pw[i]=0;}show(n);for(let i=0;i<10;i++)pw[i]=pw[i]*f+wA[i];}else show(n);
 for(let i=0;i<10;i++)pw[i]*=Lw.panel;
 gl.uniform1fv(U.pW,pw);
 const sw=stationWeights(t);gl.uniform3f(U.wSA,sw[0],sw[1],sw[2]);gl.uniform3f(U.wSB,sw[3],sw[4],sw[5]);
 const k=nearStation(t);gl.uniform1f(U.S,V*t-stP0(k));
 /* 流れのぶれ：1/50 s の露光のあいだに進む距離（動きを減らす設定では 1/25 s） */
 gl.uniform1f(U.blurL,V*(reduced?1/25:1/50));gl.uniform1f(U.dist,V*t);gl.uniform1f(U.spill,Math.max(Lw.core,Lw.outer));
 gl.uniform1f(U.seed,(t*7.13)%10);
 /* 確認用：?dbg=nofar で遠い光の層を消す、?dbg=occ で駅が遠い光を隠す割合を白黒で出す */
 gl.uniform1f(U.dbgFar,DBG==='nofar'?0:1);gl.uniform1f(U.dbgOcc,DBG==='occ'?1:0);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

/* ---------------------------------------------------------------- 切り出しと大きさ
   原版（横 ±37°・縦 ±41.7°）から画面の縦横比の最大の矩形を切る。横長は横いっぱい・縦は光軸の中央、
   縦長は縦いっぱい・中心を窓へ寄せる（原版の正接で縦画面の範囲の中央） */
function layout(){
 const vw=innerWidth,vh=innerHeight,W=meta?meta.width:1800,H=meta?meta.height:2130,a=vw/vh;
 if(a>=W/H){crop.w=W;crop.h=W/a;crop.x=0;crop.y=(H-crop.h)/2;}
 else{crop.h=H;crop.w=H*a;const tc=meta?(meta.port.x[0]+meta.port.x[1])/2:.289,tx=meta?meta.tan_x:.7536,c=(tc/tx+1)/2*W;crop.x=Math.min(W-crop.w,Math.max(0,c-crop.w/2));crop.y=0;}
 const k=vw/crop.w,img=$('preview');img.style.width=(W*k)+'px';img.style.transform='translate('+(-crop.x*k)+'px,'+(-crop.y*k)+'px)';
 if(!gl)return;
 const dpr=Math.min(devicePixelRatio||1,2),q=quality==='low'?.6:quality==='high'?1:scale;
 const cw=Math.max(1,Math.round(Math.min(vw*dpr,crop.w*1.5)*q)),ch=Math.max(1,Math.round(cw*vh/vw));
 const c=$('canvas');if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}
}

/* ---------------------------------------------------------------- 面 */
function menu(open){if(liquid.blocked)return;if(open)liquid.ui.open('#menu',$('menuToggle'));else liquid.ui.close('#menu');$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'補助メニューを閉じる':'補助メニューを開く');if(open)$('restart').focus();schedule();}
function openInfo(title){if(!liquid.blocked){returnFocus=document.activeElement;menu(false);}$('infoTitle').textContent=title;$('infoBody').replaceChildren();liquid.ui.open('#info',lastPointer||$('menuToggle'));lastPointer=null;liquid.lock($('info'));$('closeInfo').focus();schedule();}
function paragraph(text){const p=document.createElement('p');p.textContent=text;$('infoBody').append(p);}
function selectTarget(id){const d=panels[id];if(!d)return;openInfo(d.title);paragraph(d.text);schedule();}
function closeInfo(){liquid.ui.close('#info',()=>{liquid.unlock();if(returnFocus&&returnFocus.isConnected&&!returnFocus.closest('[hidden]'))returnFocus.focus();else $('menuToggle').focus();schedule();});schedule();}
$('closeInfo').onclick=e=>{e.preventDefault();e.stopPropagation();closeInfo();};
$('menuToggle').onclick=()=>menu($('menu').hidden);
$('targets').onclick=()=>{openInfo('観測する対象');const list=document.createElement('ul');list.className='target-list';for(const [id,label] of TARGETS){const li=document.createElement('li'),b=document.createElement('button');b.textContent=label;b.onclick=()=>selectTarget(id);li.append(b);list.append(li);}$('infoBody').append(list);};
$('about').onclick=()=>{openInfo('車窓 / THE CARRIAGE WINDOW');const d=document.querySelector('meta[name="description"]');paragraph(d?d.getAttribute('content'):'');paragraph('原作：『書 / THE WRITTEN』篇03・05〜07\nh!ro53 / deus ex machina');};
$('settings').onclick=()=>{openInfo('画質・動き');const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=reduced;check.onchange=()=>{reduced=check.checked;document.body.classList.toggle('reduce-ui-motion',reduced);schedule();};label.append(check,document.createTextNode(' 流れと柱の明滅を弱める'));$('infoBody').append(label);const ql=document.createElement('label');ql.textContent='画質';const sel=document.createElement('select');for(const [value,text] of [['auto','自動'],['high','高'],['low','軽量']]){const op=document.createElement('option');op.value=value;op.textContent=text;sel.append(op);}sel.value=quality;sel.onchange=()=>{quality=sel.value;scale=1;layout();schedule();};ql.append(sel);$('infoBody').append(ql);};
$('restart').onclick=()=>{menu(false);clock.t=0;play();syncUI();schedule();};

/* ---------------------------------------------------------------- 状態 */
let shownLog='';
function syncUI(){
 const t=clock.t,n=passed(t);
 $('phase').textContent=!clock.running?'一時停止':n<ST_N?'終点まで　'+NUMS[n]:'次停車　終点';
 $('pause').textContent=clock.running?'一時停止':'再開';$('pause').setAttribute('aria-pressed',String(!clock.running));
 const line=logLine(t);
 if(line!==shownLog){shownLog=line;const el=$('log');el.classList.remove('on');if(line){el.textContent=line;void el.offsetWidth;el.classList.add('on');}}
}
$('pause').onclick=()=>{clock.running?pause():play();syncUI();schedule();};
function showUI(on){shown=on;for(const id of ['masthead','controls','back','menuToggle'])$(id).hidden=!on;$('showUI').hidden=on;menu(false);if(!on){liquid.ui.hide('#info');liquid.unlock();}(on?$('menuToggle'):$('showUI')).focus();schedule();}
$('hideUI').onclick=()=>showUI(false);$('showUI').onclick=()=>showUI(true);
$('fullscreen').onclick=()=>{menu(false);liquid.fullscreen($('fullscreen'),()=>{openInfo('全画面表示');paragraph('この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。');});};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('info').hidden)closeInfo();else if(!$('menu').hidden){menu(false);$('menuToggle').focus();}else showUI(!shown);}if(e.code==='Space'&&!['BUTTON','INPUT','SELECT','A'].includes(document.activeElement.tagName)&&ready){e.preventDefault();$('pause').click();}});

/* ---------------------------------------------------------------- 判定（的は出さない。触れた位置の対象を開く）
   小さい対象（扉の上の面・袋）は指の幅（半径 22 px）の中にあれば、それを優先する */
function pick(clientX,clientY){
 const r=$('canvas').getBoundingClientRect(),W=meta.width,H=meta.height;
 const mx=crop.x+(clientX-r.left)/r.width*crop.w,my=crop.y+(clientY-r.top)/r.height*crop.h;
 const at=(x,y)=>{x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=W||y>=H?0:ids[y*W+x];};
 const hit=at(mx,my);if(hit===3||hit===4)return ID_NAME[hit];
 const rad=22*crop.w/r.width,step=Math.max(1,rad/8);let best=0,bd=1e9;
 for(let dy=-rad;dy<=rad;dy+=step)for(let dx=-rad;dx<=rad;dx+=step){const d=dx*dx+dy*dy;if(d>rad*rad)continue;const v=at(mx+dx,my+dy);if((v===3||v===4)&&d<bd){best=v;bd=d;}}
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

/* 著作権表記の実測の高さを CSS へ */
(function(){const band=document.querySelector('.h53-copy');if(!band)return;const root=document.documentElement;function put(){const h=Math.ceil(band.getBoundingClientRect().height);if(h>0)root.style.setProperty('--h53-copy-h',h+'px');}put();if(typeof ResizeObserver==='function')new ResizeObserver(put).observe(band);addEventListener('resize',put);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(put);})();

layout();
load(n=>{$('loadProgress').value=n*100;$('loadText').textContent='車内を準備しています · '+Math.round(n*100)+'%';}).then(()=>{
 const q=new URLSearchParams(location.search);if(q.has('t'))clock.t=+q.get('t')||0;   /* 確認用：?t=秒 で旅の途中から、?still で止めて */
 ready=true;layout();render();liquid.afterRender(performance.now());document.body.classList.add('ready');$('loading').hidden=true;
 for(const id of ['pause','targets','restart'])$(id).disabled=false;
 if(q.has('still'))pause();else play();syncUI();schedule();
 window.__changes={clock,crop,meta:()=>meta,pick,passed,lights,stationWeights,render,END_T,NIGHT_AT};
}).catch(error);
})();
