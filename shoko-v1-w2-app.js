/* © 2026 h!ro53 / transcendence by deus ex machina. All rights reserved. Viewing permitted; reuse prohibited.
   書庫 SHOKO v1 w2 — one bundle of the SHOKO experience and three.js r186 (author-approved exception, 2026-09-27). */
var __shokoScript=(document.currentScript&&document.currentScript.src)||location.href;
(()=>{var Np=Object.defineProperty;var tt=(i,e,t)=>()=>{if(t)throw t[0];try{return i&&(e=i(i=0)),e}catch(n){throw t=[n],n}};var nd=(i,e)=>{for(var t in e)Np(i,t,{get:e[t],enumerable:!0})};function Pp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Lp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bh(){let i=Ar("canvas");return i.style.display="block",i}function xs(...i){let e="THREE."+i.shift();Rr?Rr("log",e,...i):console.log(e,...i)}function Mh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ae(...i){i=Mh(i);let e="THREE."+i.shift();if(Rr)Rr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=Mh(i);let e="THREE."+i.shift();if(Rr)Rr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Vi(...i){let e=i.join(" ");e in sd||(sd[e]=!0,Ae(...i))}function Th(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Cn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[i&255]+jt[i>>8&255]+jt[i>>16&255]+jt[i>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Mc(i,e){return(i%e+e)%e}function Fp(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Dp(i,e,t){return i!==e?(t-i)/(e-i):0}function gs(i,e,t){return(1-t)*i+t*e}function Up(i,e,t,n){return gs(i,e,1-Math.exp(-t*n))}function kp(i,e=1){return e-Math.abs(Mc(i,e*2)-e)}function Op(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Bp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Vp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function zp(i,e){return i+Math.random()*(e-i)}function Gp(i){return i*(.5-Math.random())}function Hp(i){i!==void 0&&(ad=i);let e=ad+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wp(i){return i*ms}function Xp(i){return i*Hi}function qp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Yp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function $p(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Zp(i,e,t,n,r){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),h=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*u,l*h,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*u,o*c);break;default:Ae("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function En(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Kp(){let i={enabled:!0,workingColorSpace:sn,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===st&&(r.r=ni(r.r),r.g=ni(r.g),r.b=ni(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(r.r=br(r.r),r.g=br(r.g),r.b=br(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ht?_s:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Vi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Vi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[sn]:{primaries:e,whitePoint:n,transfer:_s,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xt},outputColorSpaceConfig:{drawingBufferColorSpace:xt}},[xt]:{primaries:e,whitePoint:n,transfer:st,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xt}}}),i}function ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function vl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ha.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ae("Texture: Unable to serialize Texture."),{})}function Ml(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function Nl(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){ki.fromArray(i,s);let o=r.x*Math.abs(ki.x)+r.y*Math.abs(ki.y)+r.z*Math.abs(ki.z),l=e.dot(ki),c=t.dot(ki),u=n.dot(ki);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}function hm(i,e,t,n,r,s,a,o){let l;if(e.side===an?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===Lt,o),l===null)return null;Ma.copy(o),Ma.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ma);return c<t.near||c>t.far?null:{distance:c,point:Ma.clone(),object:i}}function Ta(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,ya),i.getVertexPosition(l,va),i.getVertexPosition(c,Sa);let u=hm(i,e,t,n,ya,va,Sa,vd);if(u){let h=new U;Mi.getBarycoord(vd,ya,va,Sa,h),r&&(u.uv=Mi.getInterpolatedAttribute(r,o,l,c,h,new Xe)),s&&(u.uv1=Mi.getInterpolatedAttribute(s,o,l,c,h,new Xe)),a&&(u.normal=Mi.getInterpolatedAttribute(a,o,l,c,h,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new U,materialIndex:0};Mi.getNormal(ya,va,Sa,d.normal),u.face=d,u.barycoord=h}return u}function Ca(i,e,t,n,r,s,a){let o=i.geometry.attributes.position;if(Xa.fromBufferAttribute(o,r),qa.fromBufferAttribute(o,s),t.distanceSqToSegment(Xa,qa,Bl,Cd)>n)return;Bl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Bl);if(!(c<e.near||c>e.far))return{distance:c,point:Cd.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}function Ld(i,e,t,n,r,s,a){let o=Yl.distanceSqToPoint(i);if(o<t){let l=new U;Yl.closestPointToPoint(i,l),l.applyMatrix4(n);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function Qi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];if(Fd(r))r.isRenderTargetTexture?(Ae("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(Fd(r[0])){let s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function en(i){let e={};for(let t=0;t<i.length;t++){let n=Qi(i[t]);for(let r in n)e[r]=n[r]}return e}function Fd(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function _m(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function wc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}function bi(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Ua(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function vm(i){function e(r,s){return i[r]-i[s]}let t=i.length,n=new Array(t);for(let r=0;r!==t;++r)n[r]=r;return n.sort(e),n}function Dd(i,e,t){let n=i.length,r=new i.constructor(n);for(let s=0,a=0;a!==n;++s){let o=t[s]*e;for(let l=0;l!==e;++l)r[a++]=i[o+l]}return r}function Sm(i,e,t,n){let r=1,s=i[0];for(;s!==void 0&&s[n]===void 0;)s=i[r++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=i[r++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=i[r++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=i[r++];while(s!==void 0)}function Rh(i,e,t,n,r){let s=1-i;return s*s*s*e+3*s*s*i*t+3*s*i*i*n+i*i*i*r}function bm(i,e,t,n,r){let s=1-i;return 3*s*s*(t-e)+6*s*i*(n-t)+3*i*i*(r-n)}function Mm(i,e,t,n,r){let s=(i-e)/(r-e);for(let a=0;a<8;a++){let o=Rh(s,e,t,n,r)-i;if(Math.abs(o)<1e-10)break;let l=bm(s,e,t,n,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}function Ud(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}function Tm(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return oi;case"vector":case"vector2":case"vector3":case"vector4":return ci;case"color":return Ns;case"quaternion":return Gn;case"bool":case"boolean":return ai;case"string":return li}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function wm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Tm(i.type);if(i.times===void 0){let n=[],r=[];Sm(i.keys,n,r,"value"),i.times=n,i.values=r}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),Ua(i.settings)&&(t.settings={inTangents:bi(i.settings.inTangents,Float32Array),outTangents:bi(i.settings.outTangents,Float32Array)}),t}function kd(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function Rc(i,e,t,n){let r=Fm(n);switch(t){case xc:return i*e;case Ai:return i*e/r.components*r.byteLength;case po:return i*e/r.components*r.byteLength;case Ri:return i*e*2/r.components*r.byteLength;case mo:return i*e*2/r.components*r.byteLength;case yc:return i*e*3/r.components*r.byteLength;case $t:return i*e*4/r.components*r.byteLength;case go:return i*e*4/r.components*r.byteLength;case Bs:case Vs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zs:case Gs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xo:case vo:return Math.max(i,16)*Math.max(e,8)/4;case _o:case yo:return Math.max(i,8)*Math.max(e,8)/2;case So:case bo:case To:case wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Mo:case Hs:case Eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ao:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ro:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Co:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Io:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Po:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Lo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Do:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Uo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ko:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Oo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Bo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Vo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case zo:case Go:case Ho:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Wo:case Xo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ws:case qo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fm(i){switch(i){case Qt:case pc:return{byteLength:1,components:1};case qr:case mc:case Yt:return{byteLength:2,components:1};case ho:case fo:return{byteLength:2,components:4};case Pn:case uo:case qt:return{byteLength:4,components:1};case gc:case _c:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}var Gd,ec,Hd,ks,Wd,Hr,Lt,an,bt,Xn,Wr,tc,nc,ic,Xd,Zi,qd,Yd,$d,Zd,Kd,jd,Jd,Qd,rc,sc,eh,th,nh,ih,rh,sh,ah,oh,lh,ka,Mr,Oa,Tr,Ba,Va,za,Ga,ac,ch,uh,mn,oc,lc,cc,uc,Ki,dc,hc,Gl,dh,fc,wi,ji,oo,lo,Os,In,Vt,wr,yt,co,Ji,lt,Xr,on,Qt,pc,mc,qr,uo,Pn,qt,Yt,ho,fo,Yr,gc,_c,xc,yc,$t,On,Ei,Ai,po,Ri,mo,go,Bs,Vs,zs,Gs,_o,xo,yo,vo,So,bo,Mo,To,wo,Hs,Eo,Ao,Ro,Co,Io,No,Po,Lo,Fo,Do,Uo,ko,Oo,Bo,Vo,zo,Go,Ho,Wo,Xo,Ws,qo,zi,Gi,Fa,Hl,Wl,Xl,ql,hh,vc,Xs,$r,fh,Yo,ph,Ht,xt,sn,_s,st,Da,mh,gh,_h,xh,$o,yh,vh,Zo,Sh,Sc,bc,An,Er,sd,Rr,wh,Bn,jt,ad,ms,Hi,Tc,Cc,Xe,ln,Ic,U,xl,od,Nc,ze,yl,ld,cd,Ye,lr,Ha,jp,Cr,Jp,Sl,Pt,Pc,Je,Wa,Gt,ys,Ir,ao,Pe,cr,bn,Qp,em,_i,ca,hn,ud,dd,ii,vs,tm,hd,ur,Kn,ua,os,nm,im,fd,pd,md,gd,rm,dr,bl,vt,Rn,sm,Nr,Eh,xi,da,Ne,Jt,Wi,Mn,jn,Tl,Jn,hr,fr,_d,wl,El,Al,Rl,Cl,Il,Mi,pn,Qn,Tn,ha,pr,mr,gr,yi,vi,Ui,ls,fa,pa,ki,It,ma,am,Ft,Ss,bs,zt,om,cs,Pl,cn,lm,_n,Ll,_r,fn,us,Bt,Dt,Pr,rn,Lr,Fl,cm,um,wn,dm,un,ei,Dl,ga,_a,Xi,Nn,xd,Oi,xa,yd,ya,va,Sa,Ul,ba,vd,Ma,Et,ds,Sd,bd,fm,Md,wa,kl,Td,Ol,Ms,Fr,Vn,wd,pm,Ts,ri,xr,Ed,Ea,Ad,mm,hs,fs,ws,Bi,gm,Aa,Dr,Ur,Xa,qa,Rd,ps,Ra,Bl,Cd,qi,Id,Nd,Es,As,kr,Pd,Yl,Ia,Na,Rs,Cs,Ti,Ya,Is,Or,si,Ah,xm,ym,Xt,$a,Yi,At,Za,Ka,zn,ja,Ja,Qa,eo,dn,ai,Ns,oi,to,Gn,li,ci,Br,kn,no,Ch,Hn,ti,$l,Vr,yr,io,Ps,zr,Vl,Od,Bd,Gr,Pa,La,Un,Ls,Si,Vd,zd,Nt,Zl,Fs,Kl,$i,Wn,jl,Ds,ui,zl,Us,vr,Sr,ro,so,Ec,Em,Ac,Am,Rm,Cm,Im,Nm,Pm,Lm,Jl,ht,Cv,Lc,Ql,Fc=tt(()=>{Gd=0,ec=1,Hd=2,ks=1,Wd=2,Hr=3,Lt=0,an=1,bt=2,Xn=0,Wr=1,tc=2,nc=3,ic=4,Xd=5,Zi=100,qd=101,Yd=102,$d=103,Zd=104,Kd=200,jd=201,Jd=202,Qd=203,rc=204,sc=205,eh=206,th=207,nh=208,ih=209,rh=210,sh=211,ah=212,oh=213,lh=214,ka=0,Mr=1,Oa=2,Tr=3,Ba=4,Va=5,za=6,Ga=7,ac=0,ch=1,uh=2,mn=0,oc=1,lc=2,cc=3,uc=4,Ki=5,dc=6,hc=7,Gl="attached",dh="detached",fc=300,wi=301,ji=302,oo=303,lo=304,Os=306,In=1e3,Vt=1001,wr=1002,yt=1003,co=1004,Ji=1005,lt=1006,Xr=1007,on=1008,Qt=1009,pc=1010,mc=1011,qr=1012,uo=1013,Pn=1014,qt=1015,Yt=1016,ho=1017,fo=1018,Yr=1020,gc=35902,_c=35899,xc=1021,yc=1022,$t=1023,On=1026,Ei=1027,Ai=1028,po=1029,Ri=1030,mo=1031,go=1033,Bs=33776,Vs=33777,zs=33778,Gs=33779,_o=35840,xo=35841,yo=35842,vo=35843,So=36196,bo=37492,Mo=37496,To=37488,wo=37489,Hs=37490,Eo=37491,Ao=37808,Ro=37809,Co=37810,Io=37811,No=37812,Po=37813,Lo=37814,Fo=37815,Do=37816,Uo=37817,ko=37818,Oo=37819,Bo=37820,Vo=37821,zo=36492,Go=36494,Ho=36495,Wo=36283,Xo=36284,Ws=36285,qo=36286,zi=2300,Gi=2301,Fa=2302,Hl=2303,Wl=2400,Xl=2401,ql=2402,hh=2500,vc=0,Xs=1,$r=2,fh=3200,Yo=0,ph=1,Ht="",xt="srgb",sn="srgb-linear",_s="linear",st="srgb",Da=7680,mh=519,gh=512,_h=513,xh=514,$o=515,yh=516,vh=517,Zo=518,Sh=519,Sc=35044,bc="300 es",An=2e3,Er=2001;sd={},Rr=null;wh={[ka]:Mr,[Oa]:za,[Ba]:Ga,[Tr]:Va,[Mr]:ka,[za]:Oa,[Ga]:Ba,[Va]:Tr},Bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}},jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ad=1234567,ms=Math.PI/180,Hi=180/Math.PI;Tc={DEG2RAD:ms,RAD2DEG:Hi,generateUUID:Cn,clamp:Ke,euclideanModulo:Mc,mapLinear:Fp,inverseLerp:Dp,lerp:gs,damp:Up,pingpong:kp,smoothstep:Op,smootherstep:Bp,randInt:Vp,randFloat:zp,randFloatSpread:Gp,seededRandom:Hp,degToRad:Wp,radToDeg:Xp,isPowerOfTwo:qp,ceilPowerOfTwo:Yp,floorPowerOfTwo:$p,setQuaternionFromProperEuler:Zp,normalize:ot,denormalize:En},Cc=class Cc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Cc.prototype.isVector2=!0;Xe=Cc,ln=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],h=n[r+3],d=s[a+0],f=s[a+1],g=s[a+2],_=s[a+3];if(h!==_||l!==d||c!==f||u!==g){let m=l*d+c*f+u*g+h*_;m<0&&(d=-d,f=-f,g=-g,_=-_,m=-m);let p=1-o;if(m<.9995){let M=Math.acos(m),R=Math.sin(M);p=Math.sin(p*M)/R,o=Math.sin(o*M)/R,l=l*p+d*o,c=c*p+f*o,u=u*p+g*o,h=h*p+_*o}else{l=l*p+d*o,c=c*p+f*o,u=u*p+g*o,h=h*p+_*o;let M=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=M,c*=M,u*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,s,a){let o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],h=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return e[t]=o*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-o*f,e[t+2]=c*g+u*f+o*d-l*h,e[t+3]=u*g-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),h=o(s/2),d=l(n/2),f=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:Ae("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(n>o&&n>h){let f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>h){let f=2*Math.sqrt(1+o-n-h);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ic=class Ic{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(od.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(od.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),h=2*(s*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return xl.copy(this).projectOnVector(e),this.sub(xl)}reflect(e){return this.sub(xl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ic.prototype.isVector3=!0;U=Ic,xl=new U,od=new ln,Nc=class Nc{constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=r[0],m=r[3],p=r[6],M=r[1],R=r[4],S=r[7],v=r[2],T=r[5],w=r[8];return s[0]=a*_+o*M+l*v,s[3]=a*m+o*R+l*T,s[6]=a*p+o*S+l*w,s[1]=c*_+u*M+h*v,s[4]=c*m+u*R+h*T,s[7]=c*p+u*S+h*w,s[2]=d*_+f*M+g*v,s[5]=d*m+f*R+g*T,s[8]=d*p+f*S+g*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*s,f=c*s-a*l,g=t*h+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(r*c-u*n)*_,e[2]=(o*n-r*a)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Vi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(yl.makeScale(e,t)),this}rotate(e){return Vi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(yl.makeRotation(-e)),this}translate(e,t){return Vi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(yl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Nc.prototype.isMatrix3=!0;ze=Nc,yl=new ze,ld=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cd=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ye=Kp();Ha=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{lr===void 0&&(lr=Ar("canvas")),lr.width=e.width,lr.height=e.height;let r=lr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=lr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ar("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ni(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ni(t[n]/255)*255):t[n]=ni(t[n]);return{data:t,width:e.width,height:e.height}}else return Ae("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},jp=0,Cr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=Cn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(vl(r[a].image)):s.push(vl(r[a]))}else s=vl(r);n.url=s}return t||(e.images[this.uuid]=n),n}};Jp=0,Sl=new U,Pt=class i extends Bn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Vt,r=Vt,s=lt,a=on,o=$t,l=Qt,c=i.DEFAULT_ANISOTROPY,u=Ht){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=Cn(),this.name="",this.source=new Cr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Sl).x}get height(){return this.source.getSize(Sl).y}get depth(){return this.source.getSize(Sl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ae(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ae(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case In:e.x=e.x-Math.floor(e.x);break;case Vt:e.x=e.x<0?0:1;break;case wr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case In:e.y=e.y-Math.floor(e.y);break;case Vt:e.y=e.y<0?0:1;break;case wr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=fc;Pt.DEFAULT_ANISOTROPY=1;Pc=class Pc{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let R=(c+1)/2,S=(f+1)/2,v=(p+1)/2,T=(u+d)/4,w=(h+_)/4,y=(g+m)/4;return R>S&&R>v?R<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(R),r=T/n,s=w/n):S>v?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=T/r,s=y/r):v<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(v),n=w/s,r=y/s),this.set(n,r,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(h-_)/M,this.z=(d-u)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Pc.prototype.isVector4=!0;Je=Pc,Wa=class extends Bn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:lt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:n.depth},s=new Pt(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:lt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Cr(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gt=class extends Wa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ys=class extends Pt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=Vt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Ir=class extends Pt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=Vt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},ao=class ao{constructor(e,t,n,r,s,a,o,l,c,u,h,d,f,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,h,d,f,g,_,m)}set(e,t,n,r,s,a,o,l,c,u,h,d,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ao().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/cr.setFromMatrixColumn(e,0).length(),s=1/cr.setFromMatrixColumn(e,1).length(),a=1/cr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=a*u,f=a*h,g=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d+_*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-g,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d-_*o,t[4]=-a*h,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*u,f=a*h,g=o*u,_=o*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){let d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Qp,e,em)}lookAt(e,t,n){let r=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),_i.crossVectors(n,hn),_i.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),_i.crossVectors(n,hn)),_i.normalize(),ca.crossVectors(hn,_i),r[0]=_i.x,r[4]=ca.x,r[8]=hn.x,r[1]=_i.y,r[5]=ca.y,r[9]=hn.y,r[2]=_i.z,r[6]=ca.z,r[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],M=n[3],R=n[7],S=n[11],v=n[15],T=r[0],w=r[4],y=r[8],E=r[12],C=r[1],D=r[5],O=r[9],G=r[13],N=r[2],H=r[6],J=r[10],Y=r[14],re=r[3],q=r[7],te=r[11],ie=r[15];return s[0]=a*T+o*C+l*N+c*re,s[4]=a*w+o*D+l*H+c*q,s[8]=a*y+o*O+l*J+c*te,s[12]=a*E+o*G+l*Y+c*ie,s[1]=u*T+h*C+d*N+f*re,s[5]=u*w+h*D+d*H+f*q,s[9]=u*y+h*O+d*J+f*te,s[13]=u*E+h*G+d*Y+f*ie,s[2]=g*T+_*C+m*N+p*re,s[6]=g*w+_*D+m*H+p*q,s[10]=g*y+_*O+m*J+p*te,s[14]=g*E+_*G+m*Y+p*ie,s[3]=M*T+R*C+S*N+v*re,s[7]=M*w+R*D+S*H+v*q,s[11]=M*y+R*O+S*J+v*te,s[15]=M*E+R*G+S*Y+v*ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],M=l*f-c*d,R=o*f-c*h,S=o*d-l*h,v=a*f-c*u,T=a*d-l*u,w=a*h-o*u;return t*(_*M-m*R+p*S)-n*(g*M-m*v+p*T)+r*(g*R-_*v+p*w)-s*(g*S-_*T+m*w)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+r*(s*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],M=t*o-n*a,R=t*l-r*a,S=t*c-s*a,v=n*l-r*o,T=n*c-s*o,w=r*c-s*l,y=u*_-h*g,E=u*m-d*g,C=u*p-f*g,D=h*m-d*_,O=h*p-f*_,G=d*p-f*m,N=M*G-R*O+S*D+v*C-T*E+w*y;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/N;return e[0]=(o*G-l*O+c*D)*H,e[1]=(r*O-n*G-s*D)*H,e[2]=(_*w-m*T+p*v)*H,e[3]=(d*T-h*w-f*v)*H,e[4]=(l*C-a*G-c*E)*H,e[5]=(t*G-r*C+s*E)*H,e[6]=(m*S-g*w-p*R)*H,e[7]=(u*w-d*S+f*R)*H,e[8]=(a*O-o*C+c*y)*H,e[9]=(n*C-t*O-s*y)*H,e[10]=(g*T-_*S+p*M)*H,e[11]=(h*S-u*T-f*M)*H,e[12]=(o*E-a*D-l*y)*H,e[13]=(t*D-n*E+r*y)*H,e[14]=(_*R-g*v-m*M)*H,e[15]=(u*v-h*R+d*M)*H,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,d=s*c,f=s*u,g=s*h,_=a*u,m=a*h,p=o*h,M=l*c,R=l*u,S=l*h,v=n.x,T=n.y,w=n.z;return r[0]=(1-(_+p))*v,r[1]=(f+S)*v,r[2]=(g-R)*v,r[3]=0,r[4]=(f-S)*T,r[5]=(1-(d+p))*T,r[6]=(m+M)*T,r[7]=0,r[8]=(g+R)*w,r[9]=(m-M)*w,r[10]=(1-(d+_))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=cr.set(r[0],r[1],r[2]).length(),o=cr.set(r[4],r[5],r[6]).length(),l=cr.set(r[8],r[9],r[10]).length();s<0&&(a=-a),bn.copy(this);let c=1/a,u=1/o,h=1/l;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=h,bn.elements[9]*=h,bn.elements[10]*=h,t.setFromRotationMatrix(bn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=An,l=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===An)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Er)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=An,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===An)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Er)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ao.prototype.isMatrix4=!0;Pe=ao,cr=new U,bn=new Pe,Qp=new U(0,0,0),em=new U(1,1,1),_i=new U,ca=new U,hn=new U,ud=new Pe,dd=new ln,ii=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ae("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ud.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ud,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return dd.setFromEuler(this),this.setFromQuaternion(dd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ii.DEFAULT_ORDER="XYZ";vs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},tm=0,hd=new U,ur=new ln,Kn=new Pe,ua=new U,os=new U,nm=new U,im=new ln,fd=new U(1,0,0),pd=new U(0,1,0),md=new U(0,0,1),gd={type:"added"},rm={type:"removed"},dr={type:"childadded",child:null},bl={type:"childremoved",child:null},vt=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=Cn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new ii,n=new ln,r=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Pe},normalMatrix:{value:new ze}}),this.matrix=new Pe,this.matrixWorld=new Pe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.multiply(ur),this}rotateOnWorldAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.premultiply(ur),this}rotateX(e){return this.rotateOnAxis(fd,e)}rotateY(e){return this.rotateOnAxis(pd,e)}rotateZ(e){return this.rotateOnAxis(md,e)}translateOnAxis(e,t){return hd.copy(e).applyQuaternion(this.quaternion),this.position.add(hd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fd,e)}translateY(e){return this.translateOnAxis(pd,e)}translateZ(e){return this.translateOnAxis(md,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ua.copy(e):ua.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(os,ua,this.up):Kn.lookAt(ua,os,this.up),this.quaternion.setFromRotationMatrix(Kn),r&&(Kn.extractRotation(r.matrixWorld),ur.setFromRotationMatrix(Kn),this.quaternion.premultiply(ur.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gd),dr.child=e,this.dispatchEvent(dr),dr.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rm),bl.child=e,this.dispatchEvent(bl),bl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gd),dr.child=e,this.dispatchEvent(dr),dr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,nm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,im,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};vt.DEFAULT_UP=new U(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Rn=class extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},sm={type:"move"},Nr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sm)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Rn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xi={h:0,s:0,l:0},da={h:0,s:0,l:0};Ne=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Ye.workingColorSpace){if(e=Mc(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ml(a,s,e+1/3),this.g=Ml(a,s,e),this.b=Ml(a,s,e-1/3)}return Ye.colorSpaceToWorking(this,r),this}setStyle(e,t=xt){function n(s){s!==void 0&&parseFloat(s)<1&&Ae("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ae("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ae("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){let n=Eh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ae("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ni(e.r),this.g=ni(e.g),this.b=ni(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return Ye.workingToColorSpace(Jt.copy(this),e),Math.round(Ke(Jt.r*255,0,255))*65536+Math.round(Ke(Jt.g*255,0,255))*256+Math.round(Ke(Jt.b*255,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Jt.copy(this),t);let n=Jt.r,r=Jt.g,s=Jt.b,a=Math.max(n,r,s),o=Math.min(n,r,s),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-n)/h+2;break;case s:l=(n-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=xt){Ye.workingToColorSpace(Jt.copy(this),e);let t=Jt.r,n=Jt.g,r=Jt.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(xi),this.setHSL(xi.h+e,xi.s+t,xi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(xi),e.getHSL(da);let n=gs(xi.h,da.h,t),r=gs(xi.s,da.s,t),s=gs(xi.l,da.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Jt=new Ne;Ne.NAMES=Eh;Wi=class extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ii,this.environmentIntensity=1,this.environmentRotation=new ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Mn=new U,jn=new U,Tl=new U,Jn=new U,hr=new U,fr=new U,_d=new U,wl=new U,El=new U,Al=new U,Rl=new Je,Cl=new Je,Il=new Je,Mi=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Mn.subVectors(e,t),r.cross(Mn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Mn.subVectors(r,t),jn.subVectors(n,t),Tl.subVectors(e,t);let a=Mn.dot(Mn),o=Mn.dot(jn),l=Mn.dot(Tl),c=jn.dot(jn),u=jn.dot(Tl),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*l-o*u)*d,g=(a*u-o*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Jn)===null?!1:Jn.x>=0&&Jn.y>=0&&Jn.x+Jn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,Jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Jn.x),l.addScaledVector(a,Jn.y),l.addScaledVector(o,Jn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Rl.setScalar(0),Cl.setScalar(0),Il.setScalar(0),Rl.fromBufferAttribute(e,t),Cl.fromBufferAttribute(e,n),Il.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Rl,s.x),a.addScaledVector(Cl,s.y),a.addScaledVector(Il,s.z),a}static isFrontFacing(e,t,n,r){return Mn.subVectors(n,t),jn.subVectors(e,t),Mn.cross(jn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),Mn.cross(jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,a,o;hr.subVectors(r,n),fr.subVectors(s,n),wl.subVectors(e,n);let l=hr.dot(wl),c=fr.dot(wl);if(l<=0&&c<=0)return t.copy(n);El.subVectors(e,r);let u=hr.dot(El),h=fr.dot(El);if(u>=0&&h<=u)return t.copy(r);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(hr,a);Al.subVectors(e,s);let f=hr.dot(Al),g=fr.dot(Al);if(g>=0&&f<=g)return t.copy(s);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(fr,o);let m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return _d.subVectors(s,r),o=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(_d,o);let p=1/(m+_+d);return a=_*p,o=d*p,t.copy(n).addScaledVector(hr,a).addScaledVector(fr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},pn=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Tn):Tn.fromBufferAttribute(s,a),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ha.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ha.copy(n.boundingBox)),ha.applyMatrix4(e.matrixWorld),this.union(ha)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ls),fa.subVectors(this.max,ls),pr.subVectors(e.a,ls),mr.subVectors(e.b,ls),gr.subVectors(e.c,ls),yi.subVectors(mr,pr),vi.subVectors(gr,mr),Ui.subVectors(pr,gr);let t=[0,-yi.z,yi.y,0,-vi.z,vi.y,0,-Ui.z,Ui.y,yi.z,0,-yi.x,vi.z,0,-vi.x,Ui.z,0,-Ui.x,-yi.y,yi.x,0,-vi.y,vi.x,0,-Ui.y,Ui.x,0];return!Nl(t,pr,mr,gr,fa)||(t=[1,0,0,0,1,0,0,0,1],!Nl(t,pr,mr,gr,fa))?!1:(pa.crossVectors(yi,vi),t=[pa.x,pa.y,pa.z],Nl(t,pr,mr,gr,fa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qn=[new U,new U,new U,new U,new U,new U,new U,new U],Tn=new U,ha=new pn,pr=new U,mr=new U,gr=new U,yi=new U,vi=new U,Ui=new U,ls=new U,fa=new U,pa=new U,ki=new U;It=new U,ma=new Xe,am=0,Ft=class extends Bn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:am++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sc,this.updateRanges=[],this.gpuType=qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ma.fromBufferAttribute(this,t),ma.applyMatrix3(e),this.setXY(t,ma.x,ma.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=En(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=En(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=En(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=En(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),r=ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),r=ot(r,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},Ss=class extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}},bs=class extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}},zt=class extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}},om=new pn,cs=new U,Pl=new U,cn=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):om.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;cs.subVectors(e,this.center);let t=cs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(cs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(cs.copy(e.center).add(Pl)),this.expandByPoint(cs.copy(e.center).sub(Pl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},lm=0,_n=new Pe,Ll=new vt,_r=new U,fn=new pn,us=new pn,Bt=new U,Dt=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Cn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pp(e)?bs:Ss)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new ze().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return Ll.lookAt(e),Ll.updateMatrix(),this.applyMatrix4(Ll.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_r).negate(),this.translate(_r.x,_r.y,_r.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new zt(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ae("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];fn.setFromBufferAttribute(s),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];us.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(fn.min,us.min),fn.expandByPoint(Bt),Bt.addVectors(fn.max,us.max),fn.expandByPoint(Bt)):(fn.expandByPoint(us.min),fn.expandByPoint(us.max))}fn.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Bt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Bt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Bt.fromBufferAttribute(o,c),l&&(_r.fromBufferAttribute(e,c),Bt.add(_r)),r=Math.max(r,n.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ft(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new U,l[y]=new U;let c=new U,u=new U,h=new U,d=new Xe,f=new Xe,g=new Xe,_=new U,m=new U;function p(y,E,C){c.fromBufferAttribute(n,y),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,C),d.fromBufferAttribute(s,y),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,C),u.sub(c),h.sub(c),f.sub(d),g.sub(d);let D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(D),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(D),o[y].add(_),o[E].add(_),o[C].add(_),l[y].add(m),l[E].add(m),l[C].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let y=0,E=M.length;y<E;++y){let C=M[y],D=C.start,O=C.count;for(let G=D,N=D+O;G<N;G+=3)p(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let R=new U,S=new U,v=new U,T=new U;function w(y){v.fromBufferAttribute(r,y),T.copy(v);let E=o[y];R.copy(E),R.sub(v.multiplyScalar(v.dot(E))).normalize(),S.crossVectors(T,E);let D=S.dot(l[y])<0?-1:1;a.setXYZW(y,R.x,R.y,R.z,D)}for(let y=0,E=M.length;y<E;++y){let C=M[y],D=C.start,O=C.count;for(let G=D,N=D+O;G<N;G+=3)w(e.getX(G+0)),w(e.getX(G+1)),w(e.getX(G+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let r=new U,s=new U,a=new U,o=new U,l=new U,c=new U,u=new U,h=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u),f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new Ft(d,u,h)}if(this.index===null)return Ae("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let o in r){let l=r[o],c=e(l,n);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Pr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sc,this.updateRanges=[],this.version=0,this.uuid=Cn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},rn=new U,Lr=class i{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=En(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=En(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=En(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=En(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),r=ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),r=ot(r,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){xs("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Ft(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xs("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Fl=new U,cm=new U,um=new ze,wn=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Fl.subVectors(n,t).cross(cm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Fl),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||um.getNormalMatrix(e),r=this.coplanarPoint(Fl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},dm=0,un=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=Cn(),this.name="",this.type="Material",this.blending=Wr,this.side=Lt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rc,this.blendDst=sc,this.blendEquation=Zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Tr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Da,this.stencilZFail=Da,this.stencilZPass=Da,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ae(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ae(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(t){let s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new wn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Xe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Xe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ei=new U,Dl=new U,ga=new U,_a=new U,Xi=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Dl.copy(e).add(t).multiplyScalar(.5),ga.copy(t).sub(e).normalize(),_a.copy(this.origin).sub(Dl);let s=e.distanceTo(t)*.5,a=-this.direction.dot(ga),o=_a.dot(this.direction),l=-_a.dot(ga),c=_a.lengthSq(),u=Math.abs(1-a*a),h,d,f,g;if(u>0)if(h=a*l-o,d=a*o-l,g=s*u,h>=0)if(d>=-g)if(d<=g){let _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Dl).addScaledVector(ga,d),f}intersectSphere(e,t){if(e.radius<0)return null;ei.subVectors(e.center,this.origin);let n=ei.dot(this.direction),r=ei.dot(ei)-n*n,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,r,s){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,h=e.x-a.x,d=e.y-a.y,f=e.z-a.z,g=t.x-a.x,_=t.y-a.y,m=t.z-a.z,p=n.x-a.x,M=n.y-a.y,R=n.z-a.z,S=Math.abs(l),v=Math.abs(c),T=Math.abs(u),w,y,E,C,D,O,G,N,H,J,Y,re;if(S>=v&&S>=T?(E=l,O=h,H=g,re=p,l>=0?(w=c,y=u,C=d,D=f,G=_,N=m,J=M,Y=R):(w=u,y=c,C=f,D=d,G=m,N=_,J=R,Y=M)):v>=T?(E=c,O=d,H=_,re=M,c>=0?(w=u,y=l,C=f,D=h,G=m,N=g,J=R,Y=p):(w=l,y=u,C=h,D=f,G=g,N=m,J=p,Y=R)):(E=u,O=f,H=m,re=R,u>=0?(w=l,y=c,C=h,D=d,G=g,N=_,J=p,Y=M):(w=c,y=l,C=d,D=h,G=_,N=g,J=M,Y=p)),E===0)return null;let q=w/E,te=y/E,ie=1/E,Z=C-q*O,ne=D-te*O,Le=G-q*H,Me=N-te*H,ke=J-q*re,W=Y-te*re,j=ke*Me-W*Le,xe=Z*W-ne*ke,we=Le*ne-Me*Z;if(r){if(j<0||xe<0||we<0)return null}else if((j<0||xe<0||we<0)&&(j>0||xe>0||we>0))return null;let le=j+xe+we;if(le===0)return null;let Ue=ie*(j*O+xe*H+we*re);return(le>0?Ue<0:Ue>0)?null:this.at(Ue/le,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Nn=class extends un{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},xd=new Pe,Oi=new Xi,xa=new cn,yd=new U,ya=new U,va=new U,Sa=new U,Ul=new U,ba=new U,vd=new U,Ma=new U,Et=class extends vt{constructor(e=new Dt,t=new Nn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){ba.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=o[l],h=s[l];u!==0&&(Ul.fromBufferAttribute(h,e),a?ba.addScaledVector(Ul,u):ba.addScaledVector(Ul.sub(t),u))}t.add(ba)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xa.copy(n.boundingSphere),xa.applyMatrix4(s),Oi.copy(e.ray).recast(e.near),!(xa.containsPoint(Oi.origin)===!1&&(Oi.intersectSphere(xa,yd)===null||Oi.origin.distanceToSquared(yd)>(e.far-e.near)**2))&&(xd.copy(s).invert(),Oi.copy(e.ray).applyMatrix4(xd),!(n.boundingBox!==null&&Oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Oi)))}_computeIntersections(e,t,n){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),R=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,v=R;S<v;S+=3){let T=o.getX(S),w=o.getX(S+1),y=o.getX(S+2);r=Ta(this,p,e,n,c,u,h,T,w,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let M=o.getX(m),R=o.getX(m+1),S=o.getX(m+2);r=Ta(this,a,e,n,c,u,h,M,R,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),R=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,v=R;S<v;S+=3){let T=S,w=S+1,y=S+2;r=Ta(this,p,e,n,c,u,h,T,w,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let M=m,R=m+1,S=m+2;r=Ta(this,a,e,n,c,u,h,M,R,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};ds=new Je,Sd=new Je,bd=new Je,fm=new Je,Md=new Pe,wa=new U,kl=new cn,Td=new Pe,Ol=new Xi,Ms=class extends Et{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Gl,this.bindMatrix=new Pe,this.bindMatrixInverse=new Pe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new pn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wa),this.boundingBox.expandByPoint(wa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new cn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wa),this.boundingSphere.expandByPoint(wa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),kl.copy(this.boundingSphere),kl.applyMatrix4(r),e.ray.intersectsSphere(kl)!==!1&&(Td.copy(r).invert(),Ol.copy(e.ray).applyMatrix4(Td),!(this.boundingBox!==null&&Ol.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ol)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Je,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Gl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===dh?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ae("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Sd.fromBufferAttribute(r.attributes.skinIndex,e),bd.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(ds.copy(t),t.set(0,0,0,0)):(ds.set(...t,1),t.set(0,0,0)),ds.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let a=bd.getComponent(s);if(a!==0){let o=Sd.getComponent(s);Md.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(fm.copy(ds).applyMatrix4(Md),a)}}return t.isVector4&&(t.w=ds.w),t.applyMatrix4(this.bindMatrixInverse)}},Fr=class extends vt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Vn=class extends Pt{constructor(e=null,t=1,n=1,r,s,a,o,l,c=yt,u=yt,h,d){super(null,a,o,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},wd=new Pe,pm=new Pe,Ts=class i{constructor(e=[],t=[]){this.uuid=Cn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ae("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new Pe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Pe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,a=e.length;s<a;s++){let o=e[s]?e[s].matrixWorld:pm;wd.multiplyMatrices(o,t[s]),wd.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Vn(t,e,e,$t,qt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let s=e.bones[n],a=t[s];a===void 0&&(Ae("Skeleton: No bone found with UUID:",s),a=new Fr),this.bones.push(a),this.boneInverses.push(new Pe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,s=t.length;r<s;r++){let a=t[r];e.bones.push(a.uuid);let o=n[r];e.boneInverses.push(o.toArray())}return e}},ri=class extends Ft{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xr=new Pe,Ed=new Pe,Ea=[],Ad=new pn,mm=new Pe,hs=new Et,fs=new cn,ws=class extends Et{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ri(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,mm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xr),Ad.copy(e.boundingBox).applyMatrix4(xr),this.boundingBox.union(Ad)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new cn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xr),fs.copy(e.boundingSphere).applyMatrix4(xr),this.boundingSphere.union(fs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=r[a+o]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(hs.geometry=this.geometry,hs.material=this.material,hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fs.copy(this.boundingSphere),fs.applyMatrix4(n),e.ray.intersectsSphere(fs)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,xr),Ed.multiplyMatrices(n,xr),hs.matrixWorld=Ed,hs.raycast(e,Ea);for(let a=0,o=Ea.length;a<o;a++){let l=Ea[a];l.instanceId=s,l.object=this,t.push(l)}Ea.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ri(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Vn(new Float32Array(r*this.count),r,this.count,Ai,qt));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bi=new cn,gm=new Xe(.5,.5),Aa=new U,Dr=class{constructor(e=new wn,t=new wn,n=new wn,r=new wn,s=new wn,a=new wn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=An,n=!1){let r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],M=s[12],R=s[13],S=s[14],v=s[15];if(r[0].setComponents(c-a,f-u,p-g,v-M).normalize(),r[1].setComponents(c+a,f+u,p+g,v+M).normalize(),r[2].setComponents(c+o,f+h,p+_,v+R).normalize(),r[3].setComponents(c-o,f-h,p-_,v-R).normalize(),n)r[4].setComponents(l,d,m,S).normalize(),r[5].setComponents(c-l,f-d,p-m,v-S).normalize();else if(r[4].setComponents(c-l,f-d,p-m,v-S).normalize(),t===An)r[5].setComponents(c+l,f+d,p+m,v+S).normalize();else if(t===Er)r[5].setComponents(l,d,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bi)}intersectsSprite(e){Bi.center.set(0,0,0);let t=gm.distanceTo(e.center);return Bi.radius=.7071067811865476+t,Bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Aa.x=r.normal.x>0?e.max.x:e.min.x,Aa.y=r.normal.y>0?e.max.y:e.min.y,Aa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Aa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ur=class extends un{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Xa=new U,qa=new U,Rd=new Pe,ps=new Xi,Ra=new cn,Bl=new U,Cd=new U,qi=class extends vt{constructor(e=new Dt,t=new Ur){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)Xa.fromBufferAttribute(t,r-1),qa.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=Xa.distanceTo(qa);e.setAttribute("lineDistance",new zt(n,1))}else Ae("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ra.copy(n.boundingSphere),Ra.applyMatrix4(r),Ra.radius+=s,e.ray.intersectsSphere(Ra)===!1)return;Rd.copy(r).invert(),ps.copy(e.ray).applyMatrix4(Rd);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){let p=u.getX(_),M=u.getX(_+1),R=Ca(this,e,ps,l,p,M,_);R&&t.push(R)}if(this.isLineLoop){let _=u.getX(g-1),m=u.getX(f),p=Ca(this,e,ps,l,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){let p=Ca(this,e,ps,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Ca(this,e,ps,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};Id=new U,Nd=new U,Es=class extends qi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Id.fromBufferAttribute(t,r),Nd.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Id.distanceTo(Nd);e.setAttribute("lineDistance",new zt(n,1))}else Ae("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},As=class extends qi{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},kr=class extends un{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Pd=new Pe,Yl=new Xi,Ia=new cn,Na=new U,Rs=class extends vt{constructor(e=new Dt,t=new kr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ia.copy(n.boundingSphere),Ia.applyMatrix4(r),Ia.radius+=s,e.ray.intersectsSphere(Ia)===!1)return;Pd.copy(r).invert(),Yl.copy(e.ray).applyMatrix4(Pd);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);Na.fromBufferAttribute(h,m),Ld(Na,m,l,r,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let g=d,_=f;g<_;g++)Na.fromBufferAttribute(h,g),Ld(Na,g,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};Cs=class extends Pt{constructor(e=[],t=wi,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ti=class extends Pt{constructor(e,t,n=Pn,r,s,a,o=yt,l=yt,c,u=On,h=1){if(u!==On&&u!==Ei)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ya=class extends Ti{constructor(e,t=Pn,n=wi,r,s,a=yt,o=yt,l,c=On){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Is=class extends Pt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Or=class i extends Dt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],u=[],h=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new zt(c,3)),this.setAttribute("normal",new zt(u,3)),this.setAttribute("uv",new zt(h,2));function g(_,m,p,M,R,S,v,T,w,y,E){let C=S/w,D=v/y,O=S/2,G=v/2,N=T/2,H=w+1,J=y+1,Y=0,re=0,q=new U;for(let te=0;te<J;te++){let ie=te*D-G;for(let Z=0;Z<H;Z++){let ne=Z*C-O;q[_]=ne*M,q[m]=ie*R,q[p]=N,c.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[p]=T>0?1:-1,u.push(q.x,q.y,q.z),h.push(Z/w),h.push(1-te/y),Y+=1}}for(let te=0;te<y;te++)for(let ie=0;ie<w;ie++){let Z=d+ie+H*te,ne=d+ie+H*(te+1),Le=d+(ie+1)+H*(te+1),Me=d+(ie+1)+H*te;l.push(Z,ne,Me),l.push(ne,Le,Me),re+=6}o.addGroup(f,re,E),f+=re,d+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},si=class i extends Dt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,h=e/o,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let M=p*d-a;for(let R=0;R<c;R++){let S=R*h-s;g.push(S,-M,0),_.push(0,0,1),m.push(R/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){let R=M+c*p,S=M+c*(p+1),v=M+1+c*(p+1),T=M+1+c*p;f.push(R,S,T),f.push(S,v,T)}this.setIndex(f),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(_,3)),this.setAttribute("uv",new zt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};Ah={clone:Qi,merge:en},xm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ym=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xt=class extends un{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xm,this.fragmentShader=ym,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=_m(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new Ne().setHex(r.value);break;case"v2":this.uniforms[n].value=new Xe().fromArray(r.value);break;case"v3":this.uniforms[n].value=new U().fromArray(r.value);break;case"v4":this.uniforms[n].value=new Je().fromArray(r.value);break;case"m3":this.uniforms[n].value=new ze().fromArray(r.value);break;case"m4":this.uniforms[n].value=new Pe().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},$a=class extends Xt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Yi=class extends un{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Yo,this.normalScale=new Xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},At=class extends Yi{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Za=class extends un{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ka=class extends un{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};zn=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<r)){for(let o=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=t[++n],e<r)break e}a=t.length;break t}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ja=class extends zn{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wl,endingEnd:Wl}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Xl:s=e,o=2*t-n;break;case ql:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Xl:a=e,l=2*n-t;break;case ql:a=1,l=n+r[1]-r[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(r-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,M=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,R=(-1-f)*m+(1.5+f)*_+.5*g,S=f*m-f*_;for(let v=0;v!==o;++v)s[v]=p*a[u+v]+M*a[c+v]+R*a[l+v]+S*a[h+v];return s}},Ja=class extends zn{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(r-t),h=1-u;for(let d=0;d!==o;++d)s[d]=a[c+d]*h+a[l+d]*u;return s}},Qa=class extends zn{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},eo=class extends zn{interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,h=this.outTangents;if(!u||!h){let g=(n-t)/(r-t),_=1-g;for(let m=0;m!==o;++m)s[m]=a[c+m]*_+a[l+m]*g;return s}let d=o*2,f=e-1;for(let g=0;g!==o;++g){let _=a[c+g],m=a[l+g],p=f*d+g*2,M=h[p],R=h[p+1],S=e*d+g*2,v=u[S],T=u[S+1],w=Mm(n,t,M,v,r);s[g]=Rh(w,_,R,T,m)}return s}};dn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=bi(t,this.TimeBufferType),this.values=bi(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bi(e.times,Array),values:bi(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r),Ua(e.settings)&&(n.settings={inTangents:bi(e.settings.inTangents,Array),outTangents:bi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new eo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case zi:t=this.InterpolantFactoryMethodDiscrete;break;case Gi:t=this.InterpolantFactoryMethodLinear;break;case Fa:t=this.InterpolantFactoryMethodSmooth;break;case Hl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ae("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zi;case this.InterpolantFactoryMethodLinear:return Gi;case this.InterpolantFactoryMethodSmooth:return Fa;case this.InterpolantFactoryMethodBezier:return Hl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Ua(this.settings)&&(Ud(this.settings.inTangents,e),Ud(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Be("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Be("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&Lp(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){Be("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Fa,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(r)l=!0;else{let h=o*n,d=h-n,f=h+n;for(let g=0;g!==n;++g){let _=t[h+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ua(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};dn.prototype.ValueTypeName="";dn.prototype.TimeBufferType=Float32Array;dn.prototype.ValueBufferType=Float32Array;dn.prototype.DefaultInterpolation=Gi;ai=class extends dn{constructor(e,t,n){super(e,t,n)}};ai.prototype.ValueTypeName="bool";ai.prototype.ValueBufferType=Array;ai.prototype.DefaultInterpolation=zi;ai.prototype.InterpolantFactoryMethodLinear=void 0;ai.prototype.InterpolantFactoryMethodSmooth=void 0;Ns=class extends dn{constructor(e,t,n,r){super(e,t,n,r)}};Ns.prototype.ValueTypeName="color";oi=class extends dn{constructor(e,t,n,r){super(e,t,n,r)}};oi.prototype.ValueTypeName="number";to=class extends zn{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(r-t),c=e*o;for(let u=c+o;c!==u;c+=4)ln.slerpFlat(s,0,a,c-o,a,c,l);return s}},Gn=class extends dn{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new to(this.times,this.values,this.getValueSize(),e)}};Gn.prototype.ValueTypeName="quaternion";Gn.prototype.InterpolantFactoryMethodSmooth=void 0;li=class extends dn{constructor(e,t,n){super(e,t,n)}};li.prototype.ValueTypeName="string";li.prototype.ValueBufferType=Array;li.prototype.DefaultInterpolation=zi;li.prototype.InterpolantFactoryMethodLinear=void 0;li.prototype.InterpolantFactoryMethodSmooth=void 0;ci=class extends dn{constructor(e,t,n,r){super(e,t,n,r)}};ci.prototype.ValueTypeName="vector";Br=class{constructor(e="",t=-1,n=[],r=hh){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=Cn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(wm(n[a]).scale(r));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(dn.toJSON(n[s]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let u=vm(l);l=Dd(l,1,u),c=Dd(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new oi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let r=e;n=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<n.length;r++)if(n[r].name===t)return n[r];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=r[h];d||(r[h]=d=[]),d.push(c)}}let a=[];for(let o in r)a.push(this.CreateFromMorphTargetSequence(o,r[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};kn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(kd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!kd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};no=class{constructor(e,t,n){let r=this,s=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Ch=new no,Hn=class{constructor(e){this.manager=e!==void 0?e:Ch,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Hn.DEFAULT_MATERIAL_NAME="__DEFAULT";ti={},$l=class extends Error{constructor(e,t){super(e),this.response=t}},Vr=class extends Hn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=kn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(ti[e]!==void 0){ti[e].push({onLoad:t,onProgress:n,onError:r});return}ti[e]=[],ti[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ae("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=ti[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0,_=0,m=new ReadableStream({start(p){M();function M(){h.read().then(({done:R,value:S})=>{if(R)p.close();else{_+=S.byteLength;let v=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let T=0,w=u.length;T<w;T++){let y=u[T];y.onProgress&&y.onProgress(v)}p.enqueue(S),M()}},R=>{p.error(R)})}}});return new Response(m)}else throw new $l(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{kn.add(`file:${e}`,c);let u=ti[e];delete ti[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=ti[e];if(u===void 0)throw this.manager.itemError(e),c;delete ti[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},yr=new WeakMap,io=class extends Hn{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=kn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let h=yr.get(a);h===void 0&&(h=[],yr.set(a,h)),h.push({onLoad:t,onError:r})}return a}let o=Ar("img");function l(){u(),t&&t(this);let h=yr.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}yr.delete(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),kn.remove(`image:${e}`);let d=yr.get(this)||[];for(let f=0;f<d.length;f++){let g=d[f];g.onError&&g.onError(h)}yr.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),kn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}},Ps=class extends Hn{constructor(e){super(e)}load(e,t,n,r){let s=new Pt,a=new io(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}},zr=class extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Vl=new Pe,Od=new U,Bd=new U,Gr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xe(512,512),this.mapType=Qt,this.map=null,this.mapPass=null,this.matrix=new Pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dr,this._frameExtents=new Xe(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Od.setFromMatrixPosition(e.matrixWorld),t.position.copy(Od),Bd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Bd),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Vl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,a=r?r.z/s.x:1,o=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===Er||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pa=new U,La=new ln,Un=new U,Ls=class extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pe,this.projectionMatrix=new Pe,this.projectionMatrixInverse=new Pe,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pa,La,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pa,La,Un.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Pa,La,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pa,La,Un.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Si=new U,Vd=new Xe,zd=new Xe,Nt=class extends Ls{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Hi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hi*2*Math.atan(Math.tan(ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Si.x,Si.y).multiplyScalar(-e/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-e/Si.z)}getViewSize(e,t){return this.getViewBounds(e,Vd,zd),t.subVectors(zd,Vd)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ms*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Zl=class extends Gr{constructor(){super(new Nt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Hi*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Fs=class extends zr{constructor(e,t,n=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Zl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Kl=class extends Gr{constructor(){super(new Nt(90,1,.5,500)),this.isPointLightShadow=!0}},$i=class extends zr{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Kl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Wn=class extends Ls{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},jl=class extends Gr{constructor(){super(new Wn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ds=class extends zr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new jl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ui=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},zl=new WeakMap,Us=class extends Hn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ae("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ae("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=kn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{zl.has(a)===!0?(r&&r(zl.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return kn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),zl.set(l,c),kn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});kn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},vr=-90,Sr=1,ro=class extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Nt(vr,Sr,e,t);r.layers=this.layers,this.add(r);let s=new Nt(vr,Sr,e,t);s.layers=this.layers,this.add(s);let a=new Nt(vr,Sr,e,t);a.layers=this.layers,this.add(a);let o=new Nt(vr,Sr,e,t);o.layers=this.layers,this.add(o);let l=new Nt(vr,Sr,e,t);l.layers=this.layers,this.add(l);let c=new Nt(vr,Sr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===An)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Er)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},so=class extends Nt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ec="\\[\\]\\.:\\/",Em=new RegExp("["+Ec+"]","g"),Ac="[^"+Ec+"]",Am="[^"+Ec.replace("\\.","")+"]",Rm=/((?:WC+[\/:])*)/.source.replace("WC",Ac),Cm=/(WCOD+)?/.source.replace("WCOD",Am),Im=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ac),Nm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ac),Pm=new RegExp("^"+Rm+Cm+Im+Nm+"$"),Lm=["material","materials","bones","map"],Jl=class{constructor(e,t,n){let r=n||ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ht=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Em,"")}static parseTrackName(e){let t=Pm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Lm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ae("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[r];if(a===void 0){let c=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ht.Composite=Jl;ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ht.prototype.GetterByBindingType=[ht.prototype._getValue_direct,ht.prototype._getValue_array,ht.prototype._getValue_arrayElement,ht.prototype._getValue_toArray];ht.prototype.SetterByBindingTypeAndVersioning=[[ht.prototype._setValue_direct,ht.prototype._setValue_direct_setNeedsUpdate,ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_array,ht.prototype._setValue_array_setNeedsUpdate,ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_arrayElement,ht.prototype._setValue_arrayElement_setNeedsUpdate,ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_fromArray,ht.prototype._setValue_fromArray_setNeedsUpdate,ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];Cv=new Float32Array(1),Lc=class Lc{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}};Lc.prototype.isMatrix2=!0;Ql=Lc;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ae("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});function jh(){let i=null,e=!1,t=null,n=null;function r(s,a){n=i.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function km(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){let g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){let _=h[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}function y_(i,e,t,n,r,s){let a=new Ne(0),o=r===!0?0:1,l,c,u=null,h=0,d=null;function f(M){let R=M.isScene===!0?M.background:null;if(R&&R.isTexture){let S=M.backgroundBlurriness>0;R=e.get(R,S)}return R}function g(M){let R=!1,S=f(M);S===null?m(a,o):S&&S.isColor&&(m(S,1),R=!0);let v=i.xr.getEnvironmentBlendMode();v==="additive"?t.buffers.color.setClear(0,0,0,1,s):v==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||R)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(M,R){let S=f(R);S&&(S.isCubeTexture||S.mapping===Os)?(c===void 0&&(c=new Et(new Or(1,1,1),new Xt({name:"BackgroundCubeMaterial",uniforms:Qi(Mt.backgroundCube.uniforms),vertexShader:Mt.backgroundCube.vertexShader,fragmentShader:Mt.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(v,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(x_.makeRotationFromEuler(R.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Jh),c.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,(u!==S||h!==S.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=S,h=S.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new Et(new si(2,2),new Xt({name:"BackgroundMaterial",uniforms:Qi(Mt.background.uniforms),vertexShader:Mt.background.vertexShader,fragmentShader:Mt.background.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||h!==S.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,h=S.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,R){M.getRGB(Ko,wc(i)),t.buffers.color.setClear(Ko.r,Ko.g,Ko.b,R,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,R=1){a.set(M),o=R,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:_,dispose:p}}function v_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null),s=r,a=!1;function o(D,O,G,N,H){let J=!1,Y=h(D,N,G,O);s!==Y&&(s=Y,c(s.object)),J=f(D,N,G,H),J&&g(D,N,G,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(J||a)&&(a=!1,S(D,O,G,N),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(D){return i.bindVertexArray(D)}function u(D){return i.deleteVertexArray(D)}function h(D,O,G,N){let H=N.wireframe===!0,J=n[O.id];J===void 0&&(J={},n[O.id]=J);let Y=D.isInstancedMesh===!0?D.id:0,re=J[Y];re===void 0&&(re={},J[Y]=re);let q=re[G.id];q===void 0&&(q={},re[G.id]=q);let te=q[H];return te===void 0&&(te=d(l()),q[H]=te),te}function d(D){let O=[],G=[],N=[];for(let H=0;H<t;H++)O[H]=0,G[H]=0,N[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:G,attributeDivisors:N,object:D,attributes:{},index:null}}function f(D,O,G,N){let H=s.attributes,J=O.attributes,Y=0,re=G.getAttributes();for(let q in re)if(re[q].location>=0){let ie=H[q],Z=J[q];if(Z===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(Z=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(Z=D.instanceColor)),ie===void 0||ie.attribute!==Z||Z&&ie.data!==Z.data)return!0;Y++}return s.attributesNum!==Y||s.index!==N}function g(D,O,G,N){let H={},J=O.attributes,Y=0,re=G.getAttributes();for(let q in re)if(re[q].location>=0){let ie=J[q];ie===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(ie=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(ie=D.instanceColor));let Z={};Z.attribute=ie,ie&&ie.data&&(Z.data=ie.data),H[q]=Z,Y++}s.attributes=H,s.attributesNum=Y,s.index=N}function _(){let D=s.newAttributes;for(let O=0,G=D.length;O<G;O++)D[O]=0}function m(D){p(D,0)}function p(D,O){let G=s.newAttributes,N=s.enabledAttributes,H=s.attributeDivisors;G[D]=1,N[D]===0&&(i.enableVertexAttribArray(D),N[D]=1),H[D]!==O&&(i.vertexAttribDivisor(D,O),H[D]=O)}function M(){let D=s.newAttributes,O=s.enabledAttributes;for(let G=0,N=O.length;G<N;G++)O[G]!==D[G]&&(i.disableVertexAttribArray(G),O[G]=0)}function R(D,O,G,N,H,J,Y){Y===!0?i.vertexAttribIPointer(D,O,G,H,J):i.vertexAttribPointer(D,O,G,N,H,J)}function S(D,O,G,N){_();let H=N.attributes,J=G.getAttributes(),Y=O.defaultAttributeValues;for(let re in J){let q=J[re];if(q.location>=0){let te=H[re];if(te===void 0&&(re==="instanceMatrix"&&D.instanceMatrix&&(te=D.instanceMatrix),re==="instanceColor"&&D.instanceColor&&(te=D.instanceColor)),te!==void 0){let ie=te.normalized,Z=te.itemSize,ne=e.get(te);if(ne===void 0)continue;let Le=ne.buffer,Me=ne.type,ke=ne.bytesPerElement,W=Me===i.INT||Me===i.UNSIGNED_INT||te.gpuType===uo;if(te.isInterleavedBufferAttribute){let j=te.data,xe=j.stride,we=te.offset;if(j.isInstancedInterleavedBuffer){for(let le=0;le<q.locationSize;le++)p(q.location+le,j.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let le=0;le<q.locationSize;le++)m(q.location+le);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let le=0;le<q.locationSize;le++)R(q.location+le,Z/q.locationSize,Me,ie,xe*ke,(we+Z/q.locationSize*le)*ke,W)}else{if(te.isInstancedBufferAttribute){for(let j=0;j<q.locationSize;j++)p(q.location+j,te.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let j=0;j<q.locationSize;j++)m(q.location+j);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let j=0;j<q.locationSize;j++)R(q.location+j,Z/q.locationSize,Me,ie,Z*ke,Z/q.locationSize*j*ke,W)}}else if(Y!==void 0){let ie=Y[re];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(q.location,ie);break;case 3:i.vertexAttrib3fv(q.location,ie);break;case 4:i.vertexAttrib4fv(q.location,ie);break;default:i.vertexAttrib1fv(q.location,ie)}}}}M()}function v(){E();for(let D in n){let O=n[D];for(let G in O){let N=O[G];for(let H in N){let J=N[H];for(let Y in J)u(J[Y].object),delete J[Y];delete N[H]}}delete n[D]}}function T(D){if(n[D.id]===void 0)return;let O=n[D.id];for(let G in O){let N=O[G];for(let H in N){let J=N[H];for(let Y in J)u(J[Y].object),delete J[Y];delete N[H]}}delete n[D.id]}function w(D){for(let O in n){let G=n[O];for(let N in G){let H=G[N];if(H[D.id]===void 0)continue;let J=H[D.id];for(let Y in J)u(J[Y].object),delete J[Y];delete H[D.id]}}}function y(D){for(let O in n){let G=n[O],N=D.isInstancedMesh===!0?D.id:0,H=G[N];if(H!==void 0){for(let J in H){let Y=H[J];for(let re in Y)u(Y[re].object),delete Y[re];delete H[J]}delete G[N],Object.keys(G).length===0&&delete n[O]}}}function E(){C(),a=!0,s!==r&&(s=r,c(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:v,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function S_(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];t.update(d,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function b_(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==$t&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let y=w===Yt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==Qt&&w!==qt&&!y&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ae("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ae("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:R,maxFragmentUniforms:S,maxSamples:v,samples:T}}function M_(i){let e=this,t=null,n=0,r=!1,s=!1,a=new wn,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||r;return r=d,n=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let M=s?0:n,R=M*4,S=p.clippingState||null;l.value=S,S=u(g,d,R,f);for(let v=0;v!==R;++v)S[v]=t[v];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let R=0,S=f;R!==_;++R,S+=4)a.copy(h[R]).applyMatrix4(M,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function R_(i){let e=[],t=[],n=i,r=i-Kr+1+T_;for(let s=0;s<r;s++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],h=6,d=6,f=3,g=new Float32Array(f*d*h),_=new Float32Array(f*d*h);for(let p=0;p<h;p++){let M=p%3*2/3-1,R=p>2?0:-1,S=[M,R,0,M+2/3,R,0,M+2/3,R+1,0,M,R,0,M+2/3,R+1,0,M,R+1,0];g.set(S,f*d*p);for(let v=0;v<d;v++){let T=u[v*2]*2-1,w=u[v*2+1]*2-1;p===0?er.set(1,w,T):p===1?er.set(-T,1,-w):p===2?er.set(-T,w,1):p===3?er.set(-1,w,-T):p===4?er.set(-T,-1,w):er.set(T,w,-1),er.toArray(_,(p*d+v)*f)}}let m=new Dt;m.setAttribute("position",new Ft(g,f)),m.setAttribute("outputDirection",new Ft(_,f)),t.push(new Et(m,null)),n>Kr&&n--}return{lodMeshes:t,sizeLods:e}}function Nh(i,e,t){let n=new Gt(i,e,t);return n.texture.mapping=Os,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function C_(i,e,t){return new Xt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:E_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:tl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function I_(i,e,t){return new Xt({name:"SphericalGaussianBlur",defines:{SAMPLES:w_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:tl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ph(){return new Xt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Lh(){return new Xt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function tl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function N_(i){let e=new WeakMap,t=new WeakMap,n=null;function r(d,f=!1){return d==null?null:f?a(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===oo||f===lo)if(e.has(d)){let g=e.get(d).texture;return o(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let _=new Qo(g.height);return _.fromEquirectangularTexture(i,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,g=f===oo||f===lo,_=f===wi||f===ji;if(g||_){let m=t.get(d),p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Jo(i)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let M=d.image;return g&&M&&M.height>0||_&&M&&l(M)?(n===null&&(n=new Jo(i)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function o(d,f){return f===oo?d.mapping=wi:f===lo&&(d.mapping=ji),d}function l(d){let f=0,g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function c(d){let f=d.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(d){let f=d.target;f.removeEventListener("dispose",u);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:h}}function P_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&Vi("WebGLRenderer: "+n+" extension not supported."),r}}}function L_(i,e,t,n){let r={},s=new WeakMap;function a(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete r[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,g=h.attributes.position,_=0;if(g===void 0)return;if(f!==null){let M=f.array;_=f.version;for(let R=0,S=M.length;R<S;R+=3){let v=M[R+0],T=M[R+1],w=M[R+2];d.push(v,T,T,w,w,v)}}else{let M=g.array;_=g.version;for(let R=0,S=M.length/3-1;R<S;R+=3){let v=R+0,T=R+1,w=R+2;d.push(v,T,T,w,w,v)}}let m=new(g.count>=65535?bs:Ss)(d,1);m.version=_;let p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){let d=s.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function F_(i,e,t){let n;function r(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,d){i.drawElements(n,d,s,h*a),t.update(d,n,1)}function c(h,d,f){f!==0&&(i.drawElementsInstanced(n,d,s,h*a,f),t.update(d,n,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,h,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];t.update(_,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function D_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function U_(i,e,t){let n=new WeakMap,r=new Je;function s(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(o);if(d===void 0||d.count!==h){let E=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],R=0;f===!0&&(R=1),g===!0&&(R=2),_===!0&&(R=3);let S=o.attributes.position.count*R,v=1;S>e.maxTextureSize&&(v=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let T=new Float32Array(S*v*4*h),w=new ys(T,S,v,h);w.type=qt,w.needsUpdate=!0;let y=R*4;for(let C=0;C<h;C++){let D=m[C],O=p[C],G=M[C],N=S*v*4*C;for(let H=0;H<D.count;H++){let J=H*y;f===!0&&(r.fromBufferAttribute(D,H),T[N+J+0]=r.x,T[N+J+1]=r.y,T[N+J+2]=r.z,T[N+J+3]=0),g===!0&&(r.fromBufferAttribute(O,H),T[N+J+4]=r.x,T[N+J+5]=r.y,T[N+J+6]=r.z,T[N+J+7]=0),_===!0&&(r.fromBufferAttribute(G,H),T[N+J+8]=r.x,T[N+J+9]=r.y,T[N+J+10]=r.z,T[N+J+11]=G.itemSize===4?r.w:1)}}d={count:h,texture:w,size:new Xe(S,v)},n.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function k_(i,e,t,n,r){let s=new WeakMap;function a(c){let u=r.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==u&&(e.update(d),s.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return d}function o(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}function B_(i,e,t,n,r,s){let a=new Gt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Dt;c.setAttribute("position",new zt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new zt([0,2,0,0,2,0],2));let u=new $a({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Et(c,u),d=new Wn(-1,1,1,-1,0,1),f=null,g=null,_=!1,m,p=null,M=[],R=!1;this.setSize=function(S,v){a.setSize(S,v),o!==null&&o.setSize(S,v),l!==null&&l.setSize(S,v);for(let T=0;T<M.length;T++){let w=M[T];w.setSize&&w.setSize(S,v)}},this.setEffects=function(S){M=S,R=M.length>0&&M[0].isRenderPass===!0;let v=a.width,T=a.height;M.length>0&&o===null&&(o=new Gt(v,T,{type:Yt,depthBuffer:!1,stencilBuffer:!1}),l=new Gt(v,T,{type:Yt,depthBuffer:!1,stencilBuffer:!1}));for(let w=0;w<M.length;w++){let y=M[w];y.setSize&&y.setSize(v,T)}},this.begin=function(S,v){if(_||S.toneMapping===mn&&M.length===0)return!1;if(p=v,v!==null){let T=v.width,w=v.height;(a.width!==T||a.height!==w)&&this.setSize(T,w)}return R===!1&&S.setRenderTarget(a),m=S.toneMapping,S.toneMapping=mn,!0},this.hasRenderPass=function(){return R},this.end=function(S,v){S.toneMapping=m,_=!0;let T=a,w=o;for(let y=0;y<M.length;y++){let E=M[y];E.enabled!==!1&&(E.render(S,w,T,v),E.needsSwap!==!1&&(T=w,w=w===o?l:o))}if(f!==S.outputColorSpace||g!==S.toneMapping){f=S.outputColorSpace,g=S.toneMapping,u.defines={},Ye.getTransfer(f)===st&&(u.defines.SRGB_TRANSFER="");let y=O_[g];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,S.setRenderTarget(p),S.render(h,d),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}function Qr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=Fh[r];if(s===void 0&&(s=new Float32Array(r),Fh[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function nl(i,e){let t=Dh[e];t===void 0&&(t=new Int32Array(e),Dh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function V_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function z_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2fv(this.addr,e),kt(t,e)}}function G_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;i.uniform3fv(this.addr,e),kt(t,e)}}function H_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4fv(this.addr,e),kt(t,e)}}function W_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(Ut(t,n))return;Oh.set(n),i.uniformMatrix2fv(this.addr,!1,Oh),kt(t,n)}}function X_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(Ut(t,n))return;kh.set(n),i.uniformMatrix3fv(this.addr,!1,kh),kt(t,n)}}function q_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(Ut(t,n))return;Uh.set(n),i.uniformMatrix4fv(this.addr,!1,Uh),kt(t,n)}}function Y_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2iv(this.addr,e),kt(t,e)}}function Z_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3iv(this.addr,e),kt(t,e)}}function K_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4iv(this.addr,e),kt(t,e)}}function j_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function J_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2uiv(this.addr,e),kt(t,e)}}function Q_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3uiv(this.addr,e),kt(t,e)}}function ex(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4uiv(this.addr,e),kt(t,e)}}function tx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(zc.compareFunction=t.isReversedDepthBuffer()?Zo:$o,s=zc):s=Qh,t.setTexture2D(e||s,r)}function nx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||tf,r)}function ix(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||nf,r)}function rx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||ef,r)}function sx(i){switch(i){case 5126:return V_;case 35664:return z_;case 35665:return G_;case 35666:return H_;case 35674:return W_;case 35675:return X_;case 35676:return q_;case 5124:case 35670:return Y_;case 35667:case 35671:return $_;case 35668:case 35672:return Z_;case 35669:case 35673:return K_;case 5125:return j_;case 36294:return J_;case 36295:return Q_;case 36296:return ex;case 35678:case 36198:case 36298:case 36306:case 35682:return tx;case 35679:case 36299:case 36307:return nx;case 35680:case 36300:case 36308:case 36293:return ix;case 36289:case 36303:case 36311:case 36292:return rx}}function ax(i,e){i.uniform1fv(this.addr,e)}function ox(i,e){let t=Qr(e,this.size,2);i.uniform2fv(this.addr,t)}function lx(i,e){let t=Qr(e,this.size,3);i.uniform3fv(this.addr,t)}function cx(i,e){let t=Qr(e,this.size,4);i.uniform4fv(this.addr,t)}function ux(i,e){let t=Qr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dx(i,e){let t=Qr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hx(i,e){let t=Qr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function fx(i,e){i.uniform1iv(this.addr,e)}function px(i,e){i.uniform2iv(this.addr,e)}function mx(i,e){i.uniform3iv(this.addr,e)}function gx(i,e){i.uniform4iv(this.addr,e)}function _x(i,e){i.uniform1uiv(this.addr,e)}function xx(i,e){i.uniform2uiv(this.addr,e)}function yx(i,e){i.uniform3uiv(this.addr,e)}function vx(i,e){i.uniform4uiv(this.addr,e)}function Sx(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Ut(n,s)||(i.uniform1iv(this.addr,s),kt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=zc:a=Qh;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function bx(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Ut(n,s)||(i.uniform1iv(this.addr,s),kt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||tf,s[a])}function Mx(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Ut(n,s)||(i.uniform1iv(this.addr,s),kt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||nf,s[a])}function Tx(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Ut(n,s)||(i.uniform1iv(this.addr,s),kt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||ef,s[a])}function wx(i){switch(i){case 5126:return ax;case 35664:return ox;case 35665:return lx;case 35666:return cx;case 35674:return ux;case 35675:return dx;case 35676:return hx;case 5124:case 35670:return fx;case 35667:case 35671:return px;case 35668:case 35672:return mx;case 35669:case 35673:return gx;case 5125:return _x;case 36294:return xx;case 36295:return yx;case 36296:return vx;case 35678:case 36198:case 36298:case 36306:case 35682:return Sx;case 35679:case 36299:case 36307:return bx;case 35680:case 36300:case 36308:case 36293:return Mx;case 36289:case 36303:case 36311:case 36292:return Tx}}function Bh(i,e){i.seq.push(e),i.map[e.id]=e}function Ex(i,e,t){let n=i.name,r=n.length;for(Bc.lastIndex=0;;){let s=Bc.exec(n),a=Bc.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Bh(t,c===void 0?new Gc(o,i,e):new Hc(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new Wc(o),Bh(t,h)),t=h}}}function Vh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function Cx(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Ix(i){Ye._getMatrix(zh,Ye.workingColorSpace,i);let e=`mat3( ${zh.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case _s:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Ae("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Gh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Cx(i.getShaderSource(e),o)}else return s}function Nx(i,e){let t=Ix(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Lx(i,e){let t=Px[e];return t===void 0?(Ae("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Fx(){Ye.getLuminanceCoefficients(jo);let i=jo.x.toFixed(4),e=jo.y.toFixed(4),t=jo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($s).join(`
`)}function Ux(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function kx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),a=s.name,o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function $s(i){return i!==""}function Hh(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Xc(i){return i.replace(Ox,Vx)}function Vx(i,e){let t=Ve[e];if(t===void 0){let n=Bx.get(e);if(n!==void 0)t=Ve[n],Ae('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Xc(t)}function Xh(i){return i.replace(zx,Gx)}function Gx(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function qh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Wx(i){return Hx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function qx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Xx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function $x(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Yx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function Kx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Zx[i.combine]||"ENVMAP_BLENDING_NONE"}function jx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Jx(i,e,t,n){let r=i.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Wx(t),c=qx(t),u=$x(t),h=Kx(t),d=jx(t),f=Dx(t),g=Ux(s),_=r.createProgram(),m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),p.length>0&&(p+=`
`)):(m=[qh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($s).join(`
`),p=[qh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mn?"#define TONE_MAPPING":"",t.toneMapping!==mn?Ve.tonemapping_pars_fragment:"",t.toneMapping!==mn?Lx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Nx("linearToOutputTexel",t.outputColorSpace),Fx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($s).join(`
`)),a=Xc(a),a=Hh(a,t),a=Wh(a,t),o=Xc(o),o=Hh(o,t),o=Wh(o,t),a=Xh(a),o=Xh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===bc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let R=M+m+a,S=M+p+o,v=Vh(r,r.VERTEX_SHADER,R),T=Vh(r,r.FRAGMENT_SHADER,S);r.attachShader(_,v),r.attachShader(_,T),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function w(D){if(i.debug.checkShaderErrors){let O=r.getProgramInfoLog(_)||"",G=r.getShaderInfoLog(v)||"",N=r.getShaderInfoLog(T)||"",H=O.trim(),J=G.trim(),Y=N.trim(),re=!0,q=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(re=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,v,T);else{let te=Gh(r,v,"vertex"),ie=Gh(r,T,"fragment");Be("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+te+`
`+ie)}else H!==""?Ae("WebGLProgram: Program Info Log:",H):(J===""||Y==="")&&(q=!1);q&&(D.diagnostics={runnable:re,programLog:H,vertexShader:{log:J,prefix:m},fragmentShader:{log:Y,prefix:p}})}r.deleteShader(v),r.deleteShader(T),y=new jr(r,_),E=kx(r,_)}let y;this.getUniforms=function(){return y===void 0&&w(this),y};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=r.getProgramParameter(_,Ax)),C},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Rx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=v,this.fragmentShader=T,this}function ey(i){return i===Ri||i===Hs||i===Ws}function ty(i,e,t,n,r,s){let a=new vs,o=new qc,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,E,C,D,O,G){let N=D.fog,H=O.geometry,J=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,Y=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,re=e.get(y.envMap||J,Y),q=re&&re.mapping===Os?re.image.height:null,te=f[y.type];y.precision!==null&&(d=n.getMaxPrecision(y.precision),d!==y.precision&&Ae("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let ie=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Z=ie!==void 0?ie.length:0,ne=0;H.morphAttributes.position!==void 0&&(ne=1),H.morphAttributes.normal!==void 0&&(ne=2),H.morphAttributes.color!==void 0&&(ne=3);let Le,Me,ke,W;if(te){let ft=Mt[te];Le=ft.vertexShader,Me=ft.fragmentShader}else{Le=y.vertexShader,Me=y.fragmentShader;let ft=o.getVertexShaderStage(y),it=o.getFragmentShaderStage(y);o.update(y,ft,it),ke=ft.id,W=it.id}let j=i.getRenderTarget(),xe=i.state.buffers.depth.getReversed(),we=O.isInstancedMesh===!0,le=O.isBatchedMesh===!0,Ue=!!y.map,nt=!!y.matcap,Oe=!!re,Ge=!!y.aoMap,Qe=!!y.lightMap,We=!!y.bumpMap&&y.wireframe===!1,ct=!!y.normalMap,Tt=!!y.displacementMap,Zt=!!y.emissiveMap,gt=!!y.metalnessMap,St=!!y.roughnessMap,F=y.anisotropy>0,Ot=y.clearcoat>0,et=y.dispersion>0,A=y.retroreflectivity>0,x=y.iridescence>0,k=y.sheen>0,I=y.transmission>0,z=F&&!!y.anisotropyMap,ae=Ot&&!!y.clearcoatMap,oe=Ot&&!!y.clearcoatNormalMap,K=Ot&&!!y.clearcoatRoughnessMap,ee=x&&!!y.iridescenceMap,ce=x&&!!y.iridescenceThicknessMap,Re=k&&!!y.sheenColorMap,fe=k&&!!y.sheenRoughnessMap,ue=!!y.specularMap,Ce=!!y.specularColorMap,De=!!y.specularIntensityMap,He=I&&!!y.transmissionMap,L=I&&!!y.thicknessMap,de=!!y.gradientMap,Q=!!y.alphaMap,he=y.alphaTest>0,_e=!!y.alphaHash,se=!!y.extensions,Ie=mn;y.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ie=i.toneMapping);let Te={shaderID:te,shaderType:y.type,shaderName:y.name,vertexShader:Le,fragmentShader:Me,defines:y.defines,customVertexShaderID:ke,customFragmentShaderID:W,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:le,batchingColor:le&&O._colorsTexture!==null,instancing:we,instancingColor:we&&O.instanceColor!==null,instancingMorph:we&&O.morphTexture!==null,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Ue,matcap:nt,envMap:Oe,envMapMode:Oe&&re.mapping,envMapCubeUVHeight:q,aoMap:Ge,lightMap:Qe,bumpMap:We,normalMap:ct,displacementMap:Tt,emissiveMap:Zt,normalMapObjectSpace:ct&&y.normalMapType===ph,normalMapTangentSpace:ct&&y.normalMapType===Yo,packedNormalMap:ct&&y.normalMapType===Yo&&ey(y.normalMap.format),metalnessMap:gt,roughnessMap:St,anisotropy:F,anisotropyMap:z,clearcoat:Ot,clearcoatMap:ae,clearcoatNormalMap:oe,clearcoatRoughnessMap:K,dispersion:et,retroreflection:A,iridescence:x,iridescenceMap:ee,iridescenceThicknessMap:ce,sheen:k,sheenColorMap:Re,sheenRoughnessMap:fe,specularMap:ue,specularColorMap:Ce,specularIntensityMap:De,transmission:I,transmissionMap:He,thicknessMap:L,gradientMap:de,opaque:y.transparent===!1&&y.blending===Wr&&y.alphaToCoverage===!1,alphaMap:Q,alphaTest:he,alphaHash:_e,combine:y.combine,mapUv:Ue&&g(y.map.channel),aoMapUv:Ge&&g(y.aoMap.channel),lightMapUv:Qe&&g(y.lightMap.channel),bumpMapUv:We&&g(y.bumpMap.channel),normalMapUv:ct&&g(y.normalMap.channel),displacementMapUv:Tt&&g(y.displacementMap.channel),emissiveMapUv:Zt&&g(y.emissiveMap.channel),metalnessMapUv:gt&&g(y.metalnessMap.channel),roughnessMapUv:St&&g(y.roughnessMap.channel),anisotropyMapUv:z&&g(y.anisotropyMap.channel),clearcoatMapUv:ae&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:oe&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:fe&&g(y.sheenRoughnessMap.channel),specularMapUv:ue&&g(y.specularMap.channel),specularColorMapUv:Ce&&g(y.specularColorMap.channel),specularIntensityMapUv:De&&g(y.specularIntensityMap.channel),transmissionMapUv:He&&g(y.transmissionMap.channel),thicknessMapUv:L&&g(y.thicknessMap.channel),alphaMapUv:Q&&g(y.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ct||F),vertexNormals:!!H.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!H.attributes.uv&&(Ue||Q),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||H.attributes.normal===void 0&&ct===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:xe,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:ne,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ie,decodeVideoTexture:Ue&&y.map.isVideoTexture===!0&&Ye.getTransfer(y.map.colorSpace)===st,decodeVideoTextureEmissive:Zt&&y.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(y.emissiveMap.colorSpace)===st,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===bt,flipSided:y.side===an,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:se&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&y.extensions.multiDraw===!0||le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function m(y){let E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(let C in y.defines)E.push(C),E.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(p(E,y),M(E,y),E.push(i.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function p(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numSunLights),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numSunLightShadows),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function M(y,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function R(y){let E=f[y.type],C;if(E){let D=Mt[E];C=Ah.clone(D.uniforms)}else C=y.uniforms;return C}function S(y,E){let C=u.get(E);return C!==void 0?++C.usedTimes:(C=new Jx(i,E,y,r),c.push(C),u.set(E,C)),C}function v(y){if(--y.usedTimes===0){let E=c.indexOf(y);c[E]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function T(y){o.remove(y)}function w(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:R,acquireProgram:S,releaseProgram:v,releaseShaderCache:T,programs:c,dispose:w}}function ny(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function iy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Yh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function $h(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,_,m,p){let M=i[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:p},i[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=g,M.materialVariant=a(d),M.groupOrder=_,M.renderOrder=d.renderOrder,M.z=m,M.group=p),e++,M}function l(d,f,g,_,m,p,M){M.reversedDepth===!0&&(m=-m);let R=o(d,f,g,_,m,p);g.transmission>0?n.push(R):g.transparent===!0?r.push(R):t.push(R)}function c(d,f,g,_,m,p){let M=o(d,f,g,_,m,p);g.transmission>0?n.unshift(M):g.transparent===!0?r.unshift(M):t.unshift(M)}function u(d,f){t.length>1&&t.sort(d||iy),n.length>1&&n.sort(f||Yh),r.length>1&&r.sort(f||Yh)}function h(){for(let d=e,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:h,sort:u}}function ry(){let i=new WeakMap;function e(n,r){let s=i.get(n),a;return s===void 0?(a=new $h,i.set(n,[a])):r>=s.length?(a=new $h,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function sy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new U,color:new Ne};break;case"SpotLight":t={position:new U,direction:new U,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function ay(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function ly(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function cy(i){let e=new sy,t=ay(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let r=new U,s=new Pe,a=new Pe;function o(c){let u=0,h=0,d=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,M=0,R=0,S=0,v=0,T=0,w=0,y=0,E=0,C=0;c.sort(ly);for(let O=0,G=c.length;O<G;O++){let N=c[O],H=N.color,J=N.intensity,Y=N.distance,re=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Ri?re=N.shadow.map.texture:re=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=H.r*J,h+=H.g*J,d+=H.b*J;else if(N.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(N.sh.coefficients[q],J);C++}else if(N.isSunLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let te=N.shadow,ie=t.get(N);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize.copy(te.mapSize).multiply(te.getFrameExtents()),n.sunShadow[g]=ie,n.sunShadowMap[g]=re;let Z=te.getViewportCount();for(let ne=0;ne<Z;ne++)n.sunShadowMatrix[_+ne]=te.getMatrix(ne),n.sunShadowCascade[_+ne]=te._cascadeData[ne];_+=Z,g++}n.sun[f]=q,f++}else if(N.isDirectionalLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let te=N.shadow,ie=t.get(N);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,n.directionalShadow[m]=ie,n.directionalShadowMap[m]=re,n.directionalShadowMatrix[m]=N.shadow.matrix,v++}n.directional[m]=q,m++}else if(N.isSpotLight){let q=e.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(H).multiplyScalar(J),q.distance=Y,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,n.spot[M]=q;let te=N.shadow;if(N.map&&(n.spotLightMap[y]=N.map,y++,te.updateMatrices(N),N.castShadow&&E++),n.spotLightMatrix[M]=te.matrix,N.castShadow){let ie=t.get(N);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,n.spotShadow[M]=ie,n.spotShadowMap[M]=re,w++}M++}else if(N.isRectAreaLight){let q=e.get(N);q.color.copy(H).multiplyScalar(J),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),n.rectArea[R]=q,R++}else if(N.isPointLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){let te=N.shadow,ie=t.get(N);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,ie.shadowCameraNear=te.camera.near,ie.shadowCameraFar=te.camera.far,n.pointShadow[p]=ie,n.pointShadowMap[p]=re,n.pointShadowMatrix[p]=N.shadow.matrix,T++}n.point[p]=q,p++}else if(N.isHemisphereLight){let q=e.get(N);q.skyColor.copy(N.color).multiplyScalar(J),q.groundColor.copy(N.groundColor).multiplyScalar(J),n.hemi[S]=q,S++}}R>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let D=n.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==R||D.hemiLength!==S||D.numSunShadows!==g||D.numDirectionalShadows!==v||D.numPointShadows!==T||D.numSpotShadows!==w||D.numSpotMaps!==y||D.numLightProbes!==C)&&(n.sun.length=f,n.directional.length=m,n.spot.length=M,n.rectArea.length=R,n.point.length=p,n.hemi.length=S,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.directionalShadowMatrix.length=v,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=w,n.spotShadowMap.length=w,n.spotLightMatrix.length=w+y-E,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=M,D.rectAreaLength=R,D.hemiLength=S,D.numSunShadows=g,D.numDirectionalShadows=v,D.numPointShadows=T,D.numSpotShadows=w,D.numSpotMaps=y,D.numLightProbes=C,n.version=oy++)}function l(c,u){let h=0,d=0,f=0,g=0,_=0,m=0,p=u.matrixWorldInverse;for(let M=0,R=c.length;M<R;M++){let S=c[M];if(S.isSunLight){let v=n.sun[h];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(p),h++}else if(S.isDirectionalLight){let v=n.directional[d];v.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(p),d++}else if(S.isSpotLight){let v=n.spot[g];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(p),g++}else if(S.isRectAreaLight){let v=n.rectArea[_];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),a.identity(),s.copy(S.matrixWorld),s.premultiply(p),a.extractRotation(s),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){let v=n.point[f];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){let v=n.hemi[m];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function Zh(i){let e=new cy(i),t=[],n=[],r=[];function s(d){h.camera=d,t.length=0,n.length=0,r.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){r.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function uy(i){let e=new WeakMap;function t(r,s=0){let a=e.get(r),o;return a===void 0?(o=new Zh(i),e.set(r,[o])):s>=a.length?(o=new Zh(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function my(i,e,t){let n=new Dr,r=new Xe,s=new Xe,a=new Je,o=new Za,l=new Ka,c={},u=t.maxTextureSize,h={[Lt]:an,[an]:Lt,[bt]:bt},d=new Xt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:dy,fragmentShader:hy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new Dt;g.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Et(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ks;let p=this.type;this.render=function(T,w,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Wd&&(Ae("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ks);let E=i.getRenderTarget(),C=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Xn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let G=p!==this.type;G&&w.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(H=>H.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,H=T.length;N<H;N++){let J=T[N],Y=J.shadow;if(Y===void 0){Ae("WebGLShadowMap:",J,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);let re=Y.getFrameExtents();r.multiply(re),s.copy(Y.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/re.x),r.x=s.x*re.x,Y.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/re.y),r.y=s.y*re.y,Y.mapSize.y=s.y));let q=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=q,Y.map===null||G===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Hr){if(J.isPointLight){Ae("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Gt(r.x,r.y,{format:Ri,type:Yt,minFilter:lt,magFilter:lt,generateMipmaps:!1}),Y.map.texture.name=J.name+".shadowMap",Y.map.depthTexture=new Ti(r.x,r.y,qt),Y.map.depthTexture.name=J.name+".shadowMapDepth",Y.map.depthTexture.format=On,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=yt,Y.map.depthTexture.magFilter=yt}else J.isPointLight?(Y.map=new Qo(r.x),Y.map.depthTexture=new Ya(r.x,Pn)):(Y.map=new Gt(r.x,r.y),Y.map.depthTexture=new Ti(r.x,r.y,Pn)),Y.map.depthTexture.name=J.name+".shadowMap",Y.map.depthTexture.format=On,this.type===ks?(Y.map.depthTexture.compareFunction=q?Zo:$o,Y.map.depthTexture.minFilter=lt,Y.map.depthTexture.magFilter=lt):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=yt,Y.map.depthTexture.magFilter=yt);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==r.x||Y.map.height!==r.y)&&Y.map.setSize(r.x,r.y);let te=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();J.isPointLight!==!0&&Y.updateMatrices(J,y);for(let ie=0;ie<te;ie++){let Z=Y.getCamera(ie);if(J.isPointLight){let ne=Y.camera,Le=Y.matrix,Me=J.distance||ne.far;Me!==ne.far&&(ne.far=Me,ne.updateProjectionMatrix()),Ys.setFromMatrixPosition(J.matrixWorld),ne.position.copy(Ys),Vc.copy(ne.position),Vc.add(fy[ie]),ne.up.copy(py[ie]),ne.lookAt(Vc),ne.updateMatrixWorld(),Le.makeTranslation(-Ys.x,-Ys.y,-Ys.z),Kh.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Kh,ne.coordinateSystem,ne.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,ie),i.clear();else{ie===0&&(i.setRenderTarget(Y.map),i.clear());let ne=Y.getViewport(ie);a.set(s.x*ne.x,s.y*ne.y,s.x*ne.z,s.y*ne.w),O.viewport(a)}n=Y.getFrustum(ie),S(w,y,Z,J,this.type)}Y.isPointLightShadow!==!0&&this.type===Hr&&M(Y,y),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(E,C,D)};function M(T,w){let y=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Gt(r.x,r.y,{format:Ri,type:Yt}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(w,null,y,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(w,null,y,f,_,null)}function R(T,w,y,E){let C=null,D=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)C=D;else if(C=y.isPointLight===!0?l:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let O=C.uuid,G=w.uuid,N=c[O];N===void 0&&(N={},c[O]=N);let H=N[G];H===void 0&&(H=C.clone(),N[G]=H,w.addEventListener("dispose",v)),C=H}if(C.visible=w.visible,C.wireframe=w.wireframe,E===Hr?C.side=w.shadowSide!==null?w.shadowSide:w.side:C.side=w.shadowSide!==null?w.shadowSide:h[w.side],C.alphaMap=w.alphaMap,C.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,C.map=w.map,C.clipShadows=w.clipShadows,C.clippingPlanes=w.clippingPlanes,C.clipIntersection=w.clipIntersection,C.displacementMap=w.displacementMap,C.displacementScale=w.displacementScale,C.displacementBias=w.displacementBias,C.wireframeLinewidth=w.wireframeLinewidth,C.linewidth=w.linewidth,y.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let O=i.properties.get(C);O.light=y}return C}function S(T,w,y,E,C){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===Hr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);let G=e.update(T),N=T.material;if(Array.isArray(N)){let H=G.groups;for(let J=0,Y=H.length;J<Y;J++){let re=H[J],q=N[re.materialIndex];if(q&&q.visible){let te=R(T,q,E,C);T.onBeforeShadow(i,T,w,y,G,te,re),i.renderBufferDirect(y,null,G,te,T,re),T.onAfterShadow(i,T,w,y,G,te,re)}}}else if(N.visible){let H=R(T,N,E,C);T.onBeforeShadow(i,T,w,y,G,H,null),i.renderBufferDirect(y,null,G,H,T,null),T.onAfterShadow(i,T,w,y,G,H,null)}}let O=T.children;for(let G=0,N=O.length;G<N;G++)S(O[G],w,y,E,C)}function v(T){T.target.removeEventListener("dispose",v);for(let y in c){let E=c[y],C=T.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function gy(i,e){function t(){let L=!1,de=new Je,Q=null,he=new Je(0,0,0,0);return{setMask:function(_e){Q!==_e&&!L&&(i.colorMask(_e,_e,_e,_e),Q=_e)},setLocked:function(_e){L=_e},setClear:function(_e,se,Ie,Te,ft){ft===!0&&(_e*=Te,se*=Te,Ie*=Te),de.set(_e,se,Ie,Te),he.equals(de)===!1&&(i.clearColor(_e,se,Ie,Te),he.copy(de))},reset:function(){L=!1,Q=null,he.set(-1,0,0,0)}}}function n(){let L=!1,de=!1,Q=null,he=null,_e=null;return{setReversed:function(se){if(de!==se){let Ie=e.get("EXT_clip_control");se?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),de=se;let Te=_e;_e=null,this.setClear(Te)}},getReversed:function(){return de},setTest:function(se){se?j(i.DEPTH_TEST):xe(i.DEPTH_TEST)},setMask:function(se){Q!==se&&!L&&(i.depthMask(se),Q=se)},setFunc:function(se){if(de&&(se=wh[se]),he!==se){switch(se){case ka:i.depthFunc(i.NEVER);break;case Mr:i.depthFunc(i.ALWAYS);break;case Oa:i.depthFunc(i.LESS);break;case Tr:i.depthFunc(i.LEQUAL);break;case Ba:i.depthFunc(i.EQUAL);break;case Va:i.depthFunc(i.GEQUAL);break;case za:i.depthFunc(i.GREATER);break;case Ga:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}he=se}},setLocked:function(se){L=se},setClear:function(se){_e!==se&&(_e=se,de&&(se=1-se),i.clearDepth(se))},reset:function(){L=!1,Q=null,he=null,_e=null,de=!1}}}function r(){let L=!1,de=null,Q=null,he=null,_e=null,se=null,Ie=null,Te=null,ft=null;return{setTest:function(it){L||(it?j(i.STENCIL_TEST):xe(i.STENCIL_TEST))},setMask:function(it){de!==it&&!L&&(i.stencilMask(it),de=it)},setFunc:function(it,Sn,Fn){(Q!==it||he!==Sn||_e!==Fn)&&(i.stencilFunc(it,Sn,Fn),Q=it,he=Sn,_e=Fn)},setOp:function(it,Sn,Fn){(se!==it||Ie!==Sn||Te!==Fn)&&(i.stencilOp(it,Sn,Fn),se=it,Ie=Sn,Te=Fn)},setLocked:function(it){L=it},setClear:function(it){ft!==it&&(i.clearStencil(it),ft=it)},reset:function(){L=!1,de=null,Q=null,he=null,_e=null,se=null,Ie=null,Te=null,ft=null}}}let s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap,u={},h={},d={},f=new WeakMap,g=[],_=null,m=!1,p=null,M=null,R=null,S=null,v=null,T=null,w=null,y=new Ne(0,0,0),E=0,C=!1,D=null,O=null,G=null,N=null,H=null,J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,re=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(q)[1]),Y=re>=1):q.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Y=re>=2);let te=null,ie={},Z=i.getParameter(i.SCISSOR_BOX),ne=i.getParameter(i.VIEWPORT),Le=new Je().fromArray(Z),Me=new Je().fromArray(ne);function ke(L,de,Q,he){let _e=new Uint8Array(4),se=i.createTexture();i.bindTexture(L,se),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ie=0;Ie<Q;Ie++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,he,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(de+Ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return se}let W={};W[i.TEXTURE_2D]=ke(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=ke(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=ke(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=ke(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(Tr),We(!1),ct(ec),j(i.CULL_FACE),Ge(Xn);function j(L){u[L]!==!0&&(i.enable(L),u[L]=!0)}function xe(L){u[L]!==!1&&(i.disable(L),u[L]=!1)}function we(L,de){return d[L]!==de?(i.bindFramebuffer(L,de),d[L]=de,L===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=de),L===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=de),!0):!1}function le(L,de){let Q=g,he=!1;if(L){Q=f.get(de),Q===void 0&&(Q=[],f.set(de,Q));let _e=L.textures;if(Q.length!==_e.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let se=0,Ie=_e.length;se<Ie;se++)Q[se]=i.COLOR_ATTACHMENT0+se;Q.length=_e.length,he=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,he=!0);he&&i.drawBuffers(Q)}function Ue(L){return _!==L?(i.useProgram(L),_=L,!0):!1}let nt={[Zi]:i.FUNC_ADD,[qd]:i.FUNC_SUBTRACT,[Yd]:i.FUNC_REVERSE_SUBTRACT};nt[$d]=i.MIN,nt[Zd]=i.MAX;let Oe={[Kd]:i.ZERO,[jd]:i.ONE,[Jd]:i.SRC_COLOR,[rc]:i.SRC_ALPHA,[rh]:i.SRC_ALPHA_SATURATE,[nh]:i.DST_COLOR,[eh]:i.DST_ALPHA,[Qd]:i.ONE_MINUS_SRC_COLOR,[sc]:i.ONE_MINUS_SRC_ALPHA,[ih]:i.ONE_MINUS_DST_COLOR,[th]:i.ONE_MINUS_DST_ALPHA,[sh]:i.CONSTANT_COLOR,[ah]:i.ONE_MINUS_CONSTANT_COLOR,[oh]:i.CONSTANT_ALPHA,[lh]:i.ONE_MINUS_CONSTANT_ALPHA};function Ge(L,de,Q,he,_e,se,Ie,Te,ft,it){if(L===Xn){m===!0&&(xe(i.BLEND),m=!1);return}if(m===!1&&(j(i.BLEND),m=!0),L!==Xd){if(L!==p||it!==C){if((M!==Zi||v!==Zi)&&(i.blendEquation(i.FUNC_ADD),M=Zi,v=Zi),it)switch(L){case Wr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tc:i.blendFunc(i.ONE,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ic:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",L);break}else switch(L){case Wr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case tc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nc:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ic:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",L);break}R=null,S=null,T=null,w=null,y.set(0,0,0),E=0,p=L,C=it}return}_e=_e||de,se=se||Q,Ie=Ie||he,(de!==M||_e!==v)&&(i.blendEquationSeparate(nt[de],nt[_e]),M=de,v=_e),(Q!==R||he!==S||se!==T||Ie!==w)&&(i.blendFuncSeparate(Oe[Q],Oe[he],Oe[se],Oe[Ie]),R=Q,S=he,T=se,w=Ie),(Te.equals(y)===!1||ft!==E)&&(i.blendColor(Te.r,Te.g,Te.b,ft),y.copy(Te),E=ft),p=L,C=!1}function Qe(L,de){L.side===bt?xe(i.CULL_FACE):j(i.CULL_FACE);let Q=L.side===an;de&&(Q=!Q),We(Q),L.blending===Wr&&L.transparent===!1?Ge(Xn):Ge(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);let he=L.stencilWrite;o.setTest(he),he&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Zt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):xe(i.SAMPLE_ALPHA_TO_COVERAGE)}function We(L){D!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),D=L)}function ct(L){L!==Gd?(j(i.CULL_FACE),L!==O&&(L===ec?i.cullFace(i.BACK):L===Hd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xe(i.CULL_FACE),O=L}function Tt(L){L!==G&&(Y&&i.lineWidth(L),G=L)}function Zt(L,de,Q){L?(j(i.POLYGON_OFFSET_FILL),(N!==de||H!==Q)&&(N=de,H=Q,a.getReversed()&&(de=-de),i.polygonOffset(de,Q))):xe(i.POLYGON_OFFSET_FILL)}function gt(L){L?j(i.SCISSOR_TEST):xe(i.SCISSOR_TEST)}function St(L){L===void 0&&(L=i.TEXTURE0+J-1),te!==L&&(i.activeTexture(L),te=L)}function F(L,de,Q){Q===void 0&&(te===null?Q=i.TEXTURE0+J-1:Q=te);let he=ie[Q];he===void 0&&(he={type:void 0,texture:void 0},ie[Q]=he),(he.type!==L||he.texture!==de)&&(te!==Q&&(i.activeTexture(Q),te=Q),i.bindTexture(L,de||W[L]),he.type=L,he.texture=de)}function Ot(){let L=ie[te];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function et(){try{i.compressedTexImage2D(...arguments)}catch(L){Be("WebGLState:",L)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(L){Be("WebGLState:",L)}}function x(){try{i.texSubImage2D(...arguments)}catch(L){Be("WebGLState:",L)}}function k(){try{i.texSubImage3D(...arguments)}catch(L){Be("WebGLState:",L)}}function I(){try{i.compressedTexSubImage2D(...arguments)}catch(L){Be("WebGLState:",L)}}function z(){try{i.compressedTexSubImage3D(...arguments)}catch(L){Be("WebGLState:",L)}}function ae(){try{i.texStorage2D(...arguments)}catch(L){Be("WebGLState:",L)}}function oe(){try{i.texStorage3D(...arguments)}catch(L){Be("WebGLState:",L)}}function K(){try{i.texImage2D(...arguments)}catch(L){Be("WebGLState:",L)}}function ee(){try{i.texImage3D(...arguments)}catch(L){Be("WebGLState:",L)}}function ce(L){return h[L]!==void 0?h[L]:i.getParameter(L)}function Re(L,de){h[L]!==de&&(i.pixelStorei(L,de),h[L]=de)}function fe(L){Le.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Le.copy(L))}function ue(L){Me.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Me.copy(L))}function Ce(L,de){let Q=c.get(de);Q===void 0&&(Q=new WeakMap,c.set(de,Q));let he=Q.get(L);he===void 0&&(he=i.getUniformBlockIndex(de,L.name),Q.set(L,he))}function De(L,de){let he=c.get(de).get(L);l.get(de)!==he&&(i.uniformBlockBinding(de,he,L.__bindingPointIndex),l.set(de,he))}function He(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},h={},te=null,ie={},d={},f=new WeakMap,g=[],_=null,m=!1,p=null,M=null,R=null,S=null,v=null,T=null,w=null,y=new Ne(0,0,0),E=0,C=!1,D=null,O=null,G=null,N=null,H=null,Le.set(0,0,i.canvas.width,i.canvas.height),Me.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:j,disable:xe,bindFramebuffer:we,drawBuffers:le,useProgram:Ue,setBlending:Ge,setMaterial:Qe,setFlipSided:We,setCullFace:ct,setLineWidth:Tt,setPolygonOffset:Zt,setScissorTest:gt,activeTexture:St,bindTexture:F,unbindTexture:Ot,compressedTexImage2D:et,compressedTexImage3D:A,texImage2D:K,texImage3D:ee,pixelStorei:Re,getParameter:ce,updateUBOMapping:Ce,uniformBlockBinding:De,texStorage2D:ae,texStorage3D:oe,texSubImage2D:x,texSubImage3D:k,compressedTexSubImage2D:I,compressedTexSubImage3D:z,scissor:fe,viewport:ue,reset:He}}function _y(i,e,t,n,r,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xe,u=new WeakMap,h=new Set,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,x){return g?new OffscreenCanvas(A,x):Ar("canvas")}function m(A,x,k){let I=1,z=et(A);if((z.width>k||z.height>k)&&(I=k/Math.max(z.width,z.height)),I<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let ae=Math.floor(I*z.width),oe=Math.floor(I*z.height);d===void 0&&(d=_(ae,oe));let K=x?_(ae,oe):d;return K.width=ae,K.height=oe,K.getContext("2d").drawImage(A,0,0,ae,oe),Ae("WebGLRenderer: Texture has been resized from ("+z.width+"x"+z.height+") to ("+ae+"x"+oe+")."),K}else return"data"in A&&Ae("WebGLRenderer: Image in DataTexture is too big ("+z.width+"x"+z.height+")."),A;return A}function p(A){return A.generateMipmaps}function M(A){i.generateMipmap(A)}function R(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(A,x,k,I,z,ae=!1){if(A!==null){if(i[A]!==void 0)return i[A];Ae("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let oe;I&&(oe=e.get("EXT_texture_norm16"),oe||Ae("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===i.RED&&(k===i.FLOAT&&(K=i.R32F),k===i.HALF_FLOAT&&(K=i.R16F),k===i.UNSIGNED_BYTE&&(K=i.R8),k===i.UNSIGNED_SHORT&&oe&&(K=oe.R16_EXT),k===i.SHORT&&oe&&(K=oe.R16_SNORM_EXT)),x===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.R8UI),k===i.UNSIGNED_SHORT&&(K=i.R16UI),k===i.UNSIGNED_INT&&(K=i.R32UI),k===i.BYTE&&(K=i.R8I),k===i.SHORT&&(K=i.R16I),k===i.INT&&(K=i.R32I)),x===i.RG&&(k===i.FLOAT&&(K=i.RG32F),k===i.HALF_FLOAT&&(K=i.RG16F),k===i.UNSIGNED_BYTE&&(K=i.RG8),k===i.UNSIGNED_SHORT&&oe&&(K=oe.RG16_EXT),k===i.SHORT&&oe&&(K=oe.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RG8UI),k===i.UNSIGNED_SHORT&&(K=i.RG16UI),k===i.UNSIGNED_INT&&(K=i.RG32UI),k===i.BYTE&&(K=i.RG8I),k===i.SHORT&&(K=i.RG16I),k===i.INT&&(K=i.RG32I)),x===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGB8UI),k===i.UNSIGNED_SHORT&&(K=i.RGB16UI),k===i.UNSIGNED_INT&&(K=i.RGB32UI),k===i.BYTE&&(K=i.RGB8I),k===i.SHORT&&(K=i.RGB16I),k===i.INT&&(K=i.RGB32I)),x===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),k===i.UNSIGNED_INT&&(K=i.RGBA32UI),k===i.BYTE&&(K=i.RGBA8I),k===i.SHORT&&(K=i.RGBA16I),k===i.INT&&(K=i.RGBA32I)),x===i.RGB&&(k===i.UNSIGNED_SHORT&&oe&&(K=oe.RGB16_EXT),k===i.SHORT&&oe&&(K=oe.RGB16_SNORM_EXT),k===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),x===i.RGBA){let ee=ae?_s:Ye.getTransfer(z);k===i.FLOAT&&(K=i.RGBA32F),k===i.HALF_FLOAT&&(K=i.RGBA16F),k===i.UNSIGNED_BYTE&&(K=ee===st?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT&&oe&&(K=oe.RGBA16_EXT),k===i.SHORT&&oe&&(K=oe.RGBA16_SNORM_EXT),k===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function v(A,x){let k;return A?x===null||x===Pn||x===Yr?k=i.DEPTH24_STENCIL8:x===qt?k=i.DEPTH32F_STENCIL8:x===qr&&(k=i.DEPTH24_STENCIL8,Ae("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Pn||x===Yr?k=i.DEPTH_COMPONENT24:x===qt?k=i.DEPTH_COMPONENT32F:x===qr&&(k=i.DEPTH_COMPONENT16),k}function T(A,x){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==yt&&A.minFilter!==lt?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function w(A){let x=A.target;x.removeEventListener("dispose",w),E(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&h.delete(x)}function y(A){let x=A.target;x.removeEventListener("dispose",y),D(x)}function E(A){let x=n.get(A);if(x.__webglInit===void 0)return;let k=A.source,I=f.get(k);if(I){let z=I[x.__cacheKey];z.usedTimes--,z.usedTimes===0&&C(A),Object.keys(I).length===0&&f.delete(k)}n.remove(A)}function C(A){let x=n.get(A);i.deleteTexture(x.__webglTexture);let k=A.source,I=f.get(k);delete I[x.__cacheKey],a.memory.textures--}function D(A){let x=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let I=0;I<6;I++){if(Array.isArray(x.__webglFramebuffer[I]))for(let z=0;z<x.__webglFramebuffer[I].length;z++)i.deleteFramebuffer(x.__webglFramebuffer[I][z]);else i.deleteFramebuffer(x.__webglFramebuffer[I]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[I])}else{if(Array.isArray(x.__webglFramebuffer))for(let I=0;I<x.__webglFramebuffer.length;I++)i.deleteFramebuffer(x.__webglFramebuffer[I]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let I=0;I<x.__webglColorRenderbuffer.length;I++)x.__webglColorRenderbuffer[I]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[I]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let k=A.textures;for(let I=0,z=k.length;I<z;I++){let ae=n.get(k[I]);ae.__webglTexture&&(i.deleteTexture(ae.__webglTexture),a.memory.textures--),n.remove(k[I])}n.remove(A)}let O=0;function G(){O=0}function N(){return O}function H(A){O=A}function J(){let A=O;return A>=r.maxTextures&&Ae("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+r.maxTextures),O+=1,A}function Y(A){let x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function re(A,x){let k=n.get(A);if(A.isVideoTexture&&F(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){let I=A.image;if(I===null)Ae("WebGLRenderer: Texture marked for update but no image data found.");else if(I.complete===!1)Ae("WebGLRenderer: Texture marked for update but image is incomplete");else{xe(k,A,x);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+x)}function q(A,x){let k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){xe(k,A,x);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+x)}function te(A,x){let k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){xe(k,A,x);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+x)}function ie(A,x){let k=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&k.__version!==A.version){we(k,A,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+x)}let Z={[In]:i.REPEAT,[Vt]:i.CLAMP_TO_EDGE,[wr]:i.MIRRORED_REPEAT},ne={[yt]:i.NEAREST,[co]:i.NEAREST_MIPMAP_NEAREST,[Ji]:i.NEAREST_MIPMAP_LINEAR,[lt]:i.LINEAR,[Xr]:i.LINEAR_MIPMAP_NEAREST,[on]:i.LINEAR_MIPMAP_LINEAR},Le={[gh]:i.NEVER,[Sh]:i.ALWAYS,[_h]:i.LESS,[$o]:i.LEQUAL,[xh]:i.EQUAL,[Zo]:i.GEQUAL,[yh]:i.GREATER,[vh]:i.NOTEQUAL};function Me(A,x){if(x.type===qt&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===lt||x.magFilter===Xr||x.magFilter===Ji||x.magFilter===on||x.minFilter===lt||x.minFilter===Xr||x.minFilter===Ji||x.minFilter===on)&&Ae("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Z[x.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Z[x.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Z[x.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ne[x.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ne[x.minFilter]),x.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Le[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===yt||x.minFilter!==Ji&&x.minFilter!==on||x.type===qt&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ke(A,x){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",w));let I=x.source,z=f.get(I);z===void 0&&(z={},f.set(I,z));let ae=Y(x);if(ae!==A.__cacheKey){z[ae]===void 0&&(z[ae]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),z[ae].usedTimes++;let oe=z[A.__cacheKey];oe!==void 0&&(z[A.__cacheKey].usedTimes--,oe.usedTimes===0&&C(x)),A.__cacheKey=ae,A.__webglTexture=z[ae].texture}return k}function W(A,x,k){return Math.floor(Math.floor(A/k)/x)}function j(A,x,k,I){let ae=A.updateRanges;if(ae.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,k,I,x.data);else{ae.sort((Re,fe)=>Re.start-fe.start);let oe=0;for(let Re=1;Re<ae.length;Re++){let fe=ae[oe],ue=ae[Re],Ce=fe.start+fe.count,De=W(ue.start,x.width,4),He=W(fe.start,x.width,4);ue.start<=Ce+1&&De===He&&W(ue.start+ue.count-1,x.width,4)===De?fe.count=Math.max(fe.count,ue.start+ue.count-fe.start):(++oe,ae[oe]=ue)}ae.length=oe+1;let K=t.getParameter(i.UNPACK_ROW_LENGTH),ee=t.getParameter(i.UNPACK_SKIP_PIXELS),ce=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Re=0,fe=ae.length;Re<fe;Re++){let ue=ae[Re],Ce=Math.floor(ue.start/4),De=Math.ceil(ue.count/4),He=Ce%x.width,L=Math.floor(Ce/x.width),de=De,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,He),t.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,He,L,de,Q,k,I,x.data)}A.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,K),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(i.UNPACK_SKIP_ROWS,ce)}}function xe(A,x,k){let I=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(I=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(I=i.TEXTURE_3D);let z=ke(A,x),ae=x.source;t.bindTexture(I,A.__webglTexture,i.TEXTURE0+k);let oe=n.get(ae);if(ae.version!==oe.__version||z===!0){if(t.activeTexture(i.TEXTURE0+k),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let Q=Ye.getPrimaries(Ye.workingColorSpace),he=x.colorSpace===Ht?null:Ye.getPrimaries(x.colorSpace),_e=x.colorSpace===Ht||Q===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let ee=m(x.image,!1,r.maxTextureSize);ee=Ot(x,ee);let ce=s.convert(x.format,x.colorSpace),Re=s.convert(x.type),fe=S(x.internalFormat,ce,Re,x.normalized,x.colorSpace,x.isVideoTexture);Me(I,x);let ue,Ce=x.mipmaps,De=x.isVideoTexture!==!0,He=oe.__version===void 0||z===!0,L=ae.dataReady,de=T(x,ee);if(x.isDepthTexture)fe=v(x.format===Ei,x.type),He&&(De?t.texStorage2D(i.TEXTURE_2D,1,fe,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,fe,ee.width,ee.height,0,ce,Re,null));else if(x.isDataTexture)if(Ce.length>0){De&&He&&t.texStorage2D(i.TEXTURE_2D,de,fe,Ce[0].width,Ce[0].height);for(let Q=0,he=Ce.length;Q<he;Q++)ue=Ce[Q],De?L&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ue.width,ue.height,ce,Re,ue.data):t.texImage2D(i.TEXTURE_2D,Q,fe,ue.width,ue.height,0,ce,Re,ue.data);x.generateMipmaps=!1}else De?(He&&t.texStorage2D(i.TEXTURE_2D,de,fe,ee.width,ee.height),L&&j(x,ee,ce,Re)):t.texImage2D(i.TEXTURE_2D,0,fe,ee.width,ee.height,0,ce,Re,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&He&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,fe,Ce[0].width,Ce[0].height,ee.depth);for(let Q=0,he=Ce.length;Q<he;Q++)if(ue=Ce[Q],x.format!==$t)if(ce!==null)if(De){if(L)if(x.layerUpdates.size>0){let _e=Rc(ue.width,ue.height,x.format,x.type);for(let se of x.layerUpdates){let Ie=ue.data.subarray(se*_e/ue.data.BYTES_PER_ELEMENT,(se+1)*_e/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,se,ue.width,ue.height,1,ce,Ie)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,ee.depth,ce,ue.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,fe,ue.width,ue.height,ee.depth,0,ue.data,0,0);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?L&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,ee.depth,ce,Re,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,fe,ue.width,ue.height,ee.depth,0,ce,Re,ue.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{De&&He&&t.texStorage2D(i.TEXTURE_2D,de,fe,Ce[0].width,Ce[0].height);for(let Q=0,he=Ce.length;Q<he;Q++)ue=Ce[Q],x.format!==$t?ce!==null?De?L&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,ue.width,ue.height,ce,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,fe,ue.width,ue.height,0,ue.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?L&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ue.width,ue.height,ce,Re,ue.data):t.texImage2D(i.TEXTURE_2D,Q,fe,ue.width,ue.height,0,ce,Re,ue.data)}else if(x.isDataArrayTexture)if(De){if(He&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,fe,ee.width,ee.height,ee.depth),L)if(x.layerUpdates.size>0){let Q=Rc(ee.width,ee.height,x.format,x.type);for(let he of x.layerUpdates){let _e=ee.data.subarray(he*Q/ee.data.BYTES_PER_ELEMENT,(he+1)*Q/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,ee.width,ee.height,1,ce,Re,_e)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ce,Re,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,fe,ee.width,ee.height,ee.depth,0,ce,Re,ee.data);else if(x.isData3DTexture)De?(He&&t.texStorage3D(i.TEXTURE_3D,de,fe,ee.width,ee.height,ee.depth),L&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ce,Re,ee.data)):t.texImage3D(i.TEXTURE_3D,0,fe,ee.width,ee.height,ee.depth,0,ce,Re,ee.data);else if(x.isFramebufferTexture){if(He)if(De)t.texStorage2D(i.TEXTURE_2D,de,fe,ee.width,ee.height);else{let Q=ee.width,he=ee.height;for(let _e=0;_e<de;_e++)t.texImage2D(i.TEXTURE_2D,_e,fe,Q,he,0,ce,Re,null),Q>>=1,he>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),ee.parentNode!==Q){Q.appendChild(ee),h.add(x),Q.onpaint=he=>{let _e=he.changedElements;for(let se of h)_e.includes(se.image)&&(se.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ee);else{let _e=i.RGBA,se=i.RGBA,Ie=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,_e,se,Ie,ee)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(De&&He){let Q=et(Ce[0]);t.texStorage2D(i.TEXTURE_2D,de,fe,Q.width,Q.height)}for(let Q=0,he=Ce.length;Q<he;Q++)ue=Ce[Q],De?L&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ce,Re,ue):t.texImage2D(i.TEXTURE_2D,Q,fe,ce,Re,ue);x.generateMipmaps=!1}else if(De){if(He){let Q=et(ee);t.texStorage2D(i.TEXTURE_2D,de,fe,Q.width,Q.height)}L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Re,ee)}else t.texImage2D(i.TEXTURE_2D,0,fe,ce,Re,ee);p(x)&&M(I),oe.__version=ae.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function we(A,x,k){if(x.image.length!==6)return;let I=ke(A,x),z=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+k);let ae=n.get(z);if(z.version!==ae.__version||I===!0){t.activeTexture(i.TEXTURE0+k);let oe=Ye.getPrimaries(Ye.workingColorSpace),K=x.colorSpace===Ht?null:Ye.getPrimaries(x.colorSpace),ee=x.colorSpace===Ht||oe===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let ce=x.isCompressedTexture||x.image[0].isCompressedTexture,Re=x.image[0]&&x.image[0].isDataTexture,fe=[];for(let se=0;se<6;se++)!ce&&!Re?fe[se]=m(x.image[se],!0,r.maxCubemapSize):fe[se]=Re?x.image[se].image:x.image[se],fe[se]=Ot(x,fe[se]);let ue=fe[0],Ce=s.convert(x.format,x.colorSpace),De=s.convert(x.type),He=S(x.internalFormat,Ce,De,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,de=ae.__version===void 0||I===!0,Q=z.dataReady,he=T(x,ue);Me(i.TEXTURE_CUBE_MAP,x);let _e;if(ce){L&&de&&t.texStorage2D(i.TEXTURE_CUBE_MAP,he,He,ue.width,ue.height);for(let se=0;se<6;se++){_e=fe[se].mipmaps;for(let Ie=0;Ie<_e.length;Ie++){let Te=_e[Ie];x.format!==$t?Ce!==null?L?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Ce,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,He,Te.width,Te.height,0,Te.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Ce,De,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,He,Te.width,Te.height,0,Ce,De,Te.data)}}}else{if(_e=x.mipmaps,L&&de){_e.length>0&&he++;let se=et(fe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,he,He,se.width,se.height)}for(let se=0;se<6;se++)if(Re){L?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,fe[se].width,fe[se].height,Ce,De,fe[se].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,He,fe[se].width,fe[se].height,0,Ce,De,fe[se].data);for(let Ie=0;Ie<_e.length;Ie++){let ft=_e[Ie].image[se].image;L?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,ft.width,ft.height,Ce,De,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,He,ft.width,ft.height,0,Ce,De,ft.data)}}else{L?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Ce,De,fe[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,He,Ce,De,fe[se]);for(let Ie=0;Ie<_e.length;Ie++){let Te=_e[Ie];L?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,Ce,De,Te.image[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,He,Ce,De,Te.image[se])}}}p(x)&&M(i.TEXTURE_CUBE_MAP),ae.__version=z.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function le(A,x,k,I,z,ae){let oe=s.convert(k.format,k.colorSpace),K=s.convert(k.type),ee=S(k.internalFormat,oe,K,k.normalized,k.colorSpace),ce=n.get(x),Re=n.get(k);if(Re.__renderTarget=x,!ce.__hasExternalTextures){let fe=Math.max(1,x.width>>ae),ue=Math.max(1,x.height>>ae);z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?t.texImage3D(z,ae,ee,fe,ue,x.depth,0,oe,K,null):t.texImage2D(z,ae,ee,fe,ue,0,oe,K,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,I,z,Re.__webglTexture,0,gt(x)):(z===i.TEXTURE_2D||z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,I,z,Re.__webglTexture,ae),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(A,x,k){if(i.bindRenderbuffer(i.RENDERBUFFER,A),x.depthBuffer){let I=x.depthTexture,z=I&&I.isDepthTexture?I.type:null,ae=v(x.stencilBuffer,z),oe=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;St(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(x),ae,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(x),ae,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ae,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,A)}else{let I=x.textures;for(let z=0;z<I.length;z++){let ae=I[z],oe=s.convert(ae.format,ae.colorSpace),K=s.convert(ae.type),ee=S(ae.internalFormat,oe,K,ae.normalized,ae.colorSpace);St(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(x),ee,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(x),ee,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ee,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function nt(A,x,k){let I=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let z=n.get(x.depthTexture);if(z.__renderTarget=x,(!z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),I){if(z.__webglInit===void 0&&(z.__webglInit=!0,x.depthTexture.addEventListener("dispose",w)),z.__webglTexture===void 0){z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Me(i.TEXTURE_CUBE_MAP,x.depthTexture);let ce=s.convert(x.depthTexture.format),Re=s.convert(x.depthTexture.type),fe;x.depthTexture.format===On?fe=i.DEPTH_COMPONENT24:x.depthTexture.format===Ei&&(fe=i.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,fe,x.width,x.height,0,ce,Re,null)}}else re(x.depthTexture,0);let ae=z.__webglTexture,oe=gt(x),K=I?i.TEXTURE_CUBE_MAP_POSITIVE_X+k:i.TEXTURE_2D,ee=x.depthTexture.format===Ei?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===On)St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,K,ae,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,ee,K,ae,0);else if(x.depthTexture.format===Ei)St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,K,ae,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,ee,K,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Oe(A){let x=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){let I=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),I){let z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,I.removeEventListener("dispose",z)};I.addEventListener("dispose",z),x.__depthDisposeCallback=z}x.__boundDepthTexture=I}if(A.depthTexture&&!x.__autoAllocateDepthBuffer)if(k)for(let I=0;I<6;I++)nt(x.__webglFramebuffer[I],A,I);else{let I=A.texture.mipmaps;I&&I.length>0?nt(x.__webglFramebuffer[0],A,0):nt(x.__webglFramebuffer,A,0)}else if(k){x.__webglDepthbuffer=[];for(let I=0;I<6;I++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[I]),x.__webglDepthbuffer[I]===void 0)x.__webglDepthbuffer[I]=i.createRenderbuffer(),Ue(x.__webglDepthbuffer[I],A,!1);else{let z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=x.__webglDepthbuffer[I];i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,ae)}}else{let I=A.texture.mipmaps;if(I&&I.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ue(x.__webglDepthbuffer,A,!1);else{let z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,ae)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(A,x,k){let I=n.get(A);x!==void 0&&le(I.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Oe(A)}function Qe(A){let x=A.texture,k=n.get(A),I=n.get(x);A.addEventListener("dispose",y);let z=A.textures,ae=A.isWebGLCubeRenderTarget===!0,oe=z.length>1;if(oe||(I.__webglTexture===void 0&&(I.__webglTexture=i.createTexture()),I.__version=x.version,a.memory.textures++),ae){k.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[K]=[];for(let ee=0;ee<x.mipmaps.length;ee++)k.__webglFramebuffer[K][ee]=i.createFramebuffer()}else k.__webglFramebuffer[K]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)k.__webglFramebuffer[K]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(oe)for(let K=0,ee=z.length;K<ee;K++){let ce=n.get(z[K]);ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&St(A)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let K=0;K<z.length;K++){let ee=z[K];k.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[K]);let ce=s.convert(ee.format,ee.colorSpace),Re=s.convert(ee.type),fe=S(ee.internalFormat,ce,Re,ee.normalized,ee.colorSpace,A.isXRRenderTarget===!0),ue=gt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,fe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,k.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ue(k.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ae){t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture),Me(i.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)le(k.__webglFramebuffer[K][ee],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ee);else le(k.__webglFramebuffer[K],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);p(x)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let K=0,ee=z.length;K<ee;K++){let ce=z[K],Re=n.get(ce),fe=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(fe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,Re.__webglTexture),Me(fe,ce),le(k.__webglFramebuffer,A,ce,i.COLOR_ATTACHMENT0+K,fe,0),p(ce)&&M(fe)}t.unbindTexture()}else{let K=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(K=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(K,I.__webglTexture),Me(K,x),x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)le(k.__webglFramebuffer[ee],A,x,i.COLOR_ATTACHMENT0,K,ee);else le(k.__webglFramebuffer,A,x,i.COLOR_ATTACHMENT0,K,0);p(x)&&M(K),t.unbindTexture()}A.depthBuffer&&Oe(A)}function We(A){let x=A.textures;for(let k=0,I=x.length;k<I;k++){let z=x[k];if(p(z)){let ae=R(A),oe=n.get(z).__webglTexture;t.bindTexture(ae,oe),M(ae),t.unbindTexture()}}}let ct=[],Tt=[];function Zt(A){if(A.samples>0){if(St(A)===!1){let x=A.textures,k=A.width,I=A.height,z=i.COLOR_BUFFER_BIT,ae=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=n.get(A),K=x.length>1;if(K)for(let ce=0;ce<x.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);let ee=A.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let ce=0;ce<x.length;ce++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(z|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(z|=i.STENCIL_BUFFER_BIT)),K){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,oe.__webglColorRenderbuffer[ce]);let Re=n.get(x[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Re,0)}i.blitFramebuffer(0,0,k,I,0,0,k,I,z,i.NEAREST),l===!0&&(ct.length=0,Tt.length=0,ct.push(i.COLOR_ATTACHMENT0+ce),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(ct.push(ae),Tt.push(ae),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let ce=0;ce<x.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,oe.__webglColorRenderbuffer[ce]);let Re=n.get(x[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,Re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){let x=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function gt(A){return Math.min(r.maxSamples,A.samples)}function St(A){let x=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function F(A){let x=a.render.frame;u.get(A)!==x&&(u.set(A,x),A.update())}function Ot(A,x){let k=A.colorSpace,I=A.format,z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==sn&&k!==Ht&&(Ye.getTransfer(k)===st?(I!==$t||z!==Qt)&&Ae("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",k)),x}function et(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=G,this.getTextureUnits=N,this.setTextureUnits=H,this.setTexture2D=re,this.setTexture2DArray=q,this.setTexture3D=te,this.setTextureCube=ie,this.rebindTextures=Ge,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=le,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function xy(i,e){function t(n,r=Ht){let s,a=Ye.getTransfer(r);if(n===Qt)return i.UNSIGNED_BYTE;if(n===ho)return i.UNSIGNED_SHORT_4_4_4_4;if(n===fo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_c)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===pc)return i.BYTE;if(n===mc)return i.SHORT;if(n===qr)return i.UNSIGNED_SHORT;if(n===uo)return i.INT;if(n===Pn)return i.UNSIGNED_INT;if(n===qt)return i.FLOAT;if(n===Yt)return i.HALF_FLOAT;if(n===xc)return i.ALPHA;if(n===yc)return i.RGB;if(n===$t)return i.RGBA;if(n===On)return i.DEPTH_COMPONENT;if(n===Ei)return i.DEPTH_STENCIL;if(n===Ai)return i.RED;if(n===po)return i.RED_INTEGER;if(n===Ri)return i.RG;if(n===mo)return i.RG_INTEGER;if(n===go)return i.RGBA_INTEGER;if(n===Bs||n===Vs||n===zs||n===Gs)if(a===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Bs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Bs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_o||n===xo||n===yo||n===vo)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===_o)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===yo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===So||n===bo||n===Mo||n===To||n===wo||n===Hs||n===Eo)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===So||n===bo)return a===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Mo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===To)return s.COMPRESSED_R11_EAC;if(n===wo)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Hs)return s.COMPRESSED_RG11_EAC;if(n===Eo)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ao||n===Ro||n===Co||n===Io||n===No||n===Po||n===Lo||n===Fo||n===Do||n===Uo||n===ko||n===Oo||n===Bo||n===Vo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ao)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ro)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Co)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Io)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===No)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Po)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Lo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Do)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Uo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ko)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Oo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Bo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===zo||n===Go||n===Ho)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===zo)return a===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Go)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ho)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Wo||n===Xo||n===Ws||n===qo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Wo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Xo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ws)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===qo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Yr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function by(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,wc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,M,R,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,M,R):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===an&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===an&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),R=M.envMap,S=M.envMapRotation;R&&(m.envMap.value=R,m.envMapRotation.value.setFromMatrix4(Sy.makeRotationFromEuler(S)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(rf),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,R){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=R*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===an&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function My(i,e,t,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,v){let T=v.program;n.uniformBlockBinding(S,T)}function c(S,v){let T=r[S.id];T===void 0&&(m(S),T=u(S),r[S.id]=T,S.addEventListener("dispose",M));let w=v.program;n.updateUBOMapping(S,w);let y=e.render.frame;s[S.id]!==y&&(d(S),s[S.id]=y)}function u(S){let v=h();S.__bindingPointIndex=v;let T=i.createBuffer(),w=S.__size,y=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,w,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,T),T}function h(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let v=r[S.id],T=S.uniforms,w=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let y=0,E=T.length;y<E;y++){let C=T[y];if(Array.isArray(C))for(let D=0,O=C.length;D<O;D++)f(C[D],y,D,w);else f(C,y,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,v,T,w){if(_(S,v,T,w)===!0){let y=S.__offset,E=S.value;if(Array.isArray(E)){let C=0;for(let D=0;D<E.length;D++){let O=E[D],G=p(O);g(O,S.__data,C),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(C+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,S.__data)}}function g(S,v,T){typeof S=="number"||typeof S=="boolean"?v[0]=S:S.isMatrix3?(v[0]=S.elements[0],v[1]=S.elements[1],v[2]=S.elements[2],v[3]=0,v[4]=S.elements[3],v[5]=S.elements[4],v[6]=S.elements[5],v[7]=0,v[8]=S.elements[6],v[9]=S.elements[7],v[10]=S.elements[8],v[11]=0):ArrayBuffer.isView(S)?v.set(new S.constructor(S.buffer,S.byteOffset,v.length)):S.toArray(v,T)}function _(S,v,T,w){let y=S.value,E=v+"_"+T;if(w[E]===void 0)return typeof y=="number"||typeof y=="boolean"?w[E]=y:ArrayBuffer.isView(y)?w[E]=y.slice():w[E]=y.clone(),!0;{let C=w[E];if(typeof y=="number"||typeof y=="boolean"){if(C!==y)return w[E]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(C.equals(y)===!1)return C.copy(y),!0}}return!1}function m(S){let v=S.uniforms,T=0,w=16;for(let E=0,C=v.length;E<C;E++){let D=Array.isArray(v[E])?v[E]:[v[E]];for(let O=0,G=D.length;O<G;O++){let N=D[O],H=Array.isArray(N.value)?N.value:[N.value];for(let J=0,Y=H.length;J<Y;J++){let re=H[J],q=p(re),te=T%w,ie=te%q.boundary,Z=te+ie;T+=ie,Z!==0&&w-Z<q.storage&&(T+=w-Z),N.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=T,T+=q.storage}}}let y=T%w;return y>0&&(T+=w-y),S.__size=T,S.__cache={},this}function p(S){let v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?Ae("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(v.boundary=16,v.storage=S.byteLength):Ae("WebGLRenderer: Unsupported uniform value type.",S),v}function M(S){let v=S.target;v.removeEventListener("dispose",M);let T=a.indexOf(v.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function R(){for(let S in r)i.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:l,update:c,dispose:R}}function wy(){return qn===null&&(qn=new Vn(Ty,16,16,Ri,Yt),qn.name="DFG_LUT",qn.minFilter=lt,qn.magFilter=lt,qn.wrapS=Vt,qn.wrapT=Vt,qn.generateMipmaps=!1,qn.needsUpdate=!0),qn}var Om,Bm,Vm,zm,Gm,Hm,Wm,Xm,qm,Ym,$m,Zm,Km,jm,Jm,Qm,e0,t0,n0,i0,r0,s0,a0,o0,l0,c0,u0,d0,h0,f0,p0,m0,g0,_0,x0,y0,v0,S0,b0,M0,T0,w0,E0,A0,R0,C0,I0,N0,P0,L0,F0,D0,U0,k0,O0,B0,V0,z0,G0,H0,W0,X0,q0,Y0,$0,Z0,K0,j0,J0,Q0,eg,tg,ng,ig,rg,sg,ag,og,lg,cg,ug,dg,hg,fg,pg,mg,gg,_g,xg,yg,vg,Sg,bg,Mg,Tg,wg,Eg,Ag,Rg,Cg,Ig,Ng,Pg,Lg,Fg,Dg,Ug,kg,Og,Bg,Vg,zg,Gg,Hg,Wg,Xg,qg,Yg,$g,Zg,Kg,jg,Jg,Qg,e_,t_,n_,i_,r_,s_,a_,o_,l_,c_,u_,d_,h_,f_,p_,m_,g_,__,Ve,pe,Mt,Ko,x_,Jh,Kr,T_,w_,E_,qs,Ih,Dc,Uc,kc,Oc,A_,er,Jo,Qo,O_,Qh,zc,ef,tf,nf,Fh,Dh,Uh,kh,Oh,Gc,Hc,Wc,Bc,jr,Ax,Rx,zh,Px,jo,Ox,Bx,zx,Hx,Xx,Yx,Zx,Qx,qc,Yc,oy,dy,hy,fy,py,Kh,Ys,Vc,yy,vy,$c,Zc,Sy,rf,Ty,qn,el,Wt=tt(()=>{Fc();Fc();Om=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Vm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Xm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ym=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$m=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Km=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,jm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Jm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,e0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,t0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,n0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,i0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,r0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,s0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,a0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,o0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,l0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,c0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,u0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,d0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,h0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,f0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,p0="gl_FragColor = linearToOutputTexel( gl_FragColor );",m0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,g0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,_0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,x0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,y0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,v0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,S0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,b0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,M0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,T0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,w0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,E0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,A0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,R0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,C0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,I0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,N0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,P0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,L0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,F0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,D0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,U0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,k0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,O0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,B0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,V0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,z0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,G0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,H0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,W0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,X0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,q0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Z0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,K0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,j0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,J0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Q0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,tg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ng=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ig=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ag=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,og=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,lg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ug=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,pg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_g=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Sg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Tg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Eg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ag=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ig=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ng=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Lg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Bg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Xg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,qg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Yg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Qg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,i_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,s_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,a_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,c_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,f_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,g_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,__=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Om,alphahash_pars_fragment:Bm,alphamap_fragment:Vm,alphamap_pars_fragment:zm,alphatest_fragment:Gm,alphatest_pars_fragment:Hm,aomap_fragment:Wm,aomap_pars_fragment:Xm,batching_pars_vertex:qm,batching_vertex:Ym,begin_vertex:$m,beginnormal_vertex:Zm,bsdfs:Km,iridescence_fragment:jm,bumpmap_pars_fragment:Jm,clipping_planes_fragment:Qm,clipping_planes_pars_fragment:e0,clipping_planes_pars_vertex:t0,clipping_planes_vertex:n0,color_fragment:i0,color_pars_fragment:r0,color_pars_vertex:s0,color_vertex:a0,common:o0,cube_uv_reflection_fragment:l0,defaultnormal_vertex:c0,displacementmap_pars_vertex:u0,displacementmap_vertex:d0,emissivemap_fragment:h0,emissivemap_pars_fragment:f0,colorspace_fragment:p0,colorspace_pars_fragment:m0,envmap_fragment:g0,envmap_common_pars_fragment:_0,envmap_pars_fragment:x0,envmap_pars_vertex:y0,envmap_physical_pars_fragment:I0,envmap_vertex:v0,fog_vertex:S0,fog_pars_vertex:b0,fog_fragment:M0,fog_pars_fragment:T0,gradientmap_pars_fragment:w0,lightmap_pars_fragment:E0,lights_lambert_fragment:A0,lights_lambert_pars_fragment:R0,lights_pars_begin:C0,lights_toon_fragment:N0,lights_toon_pars_fragment:P0,lights_phong_fragment:L0,lights_phong_pars_fragment:F0,lights_physical_fragment:D0,lights_physical_pars_fragment:U0,lights_fragment_begin:k0,lights_fragment_maps:O0,lights_fragment_end:B0,lightprobes_pars_fragment:V0,logdepthbuf_fragment:z0,logdepthbuf_pars_fragment:G0,logdepthbuf_pars_vertex:H0,logdepthbuf_vertex:W0,map_fragment:X0,map_pars_fragment:q0,map_particle_fragment:Y0,map_particle_pars_fragment:$0,metalnessmap_fragment:Z0,metalnessmap_pars_fragment:K0,morphinstance_vertex:j0,morphcolor_vertex:J0,morphnormal_vertex:Q0,morphtarget_pars_vertex:eg,morphtarget_vertex:tg,normal_fragment_begin:ng,normal_fragment_maps:ig,normal_pars_fragment:rg,normal_pars_vertex:sg,normal_vertex:ag,normalmap_pars_fragment:og,clearcoat_normal_fragment_begin:lg,clearcoat_normal_fragment_maps:cg,clearcoat_pars_fragment:ug,iridescence_pars_fragment:dg,opaque_fragment:hg,packing:fg,premultiplied_alpha_fragment:pg,project_vertex:mg,dithering_fragment:gg,dithering_pars_fragment:_g,roughnessmap_fragment:xg,roughnessmap_pars_fragment:yg,shadowmap_pars_fragment:vg,shadowmap_pars_vertex:Sg,shadowmap_vertex:bg,shadowmask_pars_fragment:Mg,skinbase_vertex:Tg,skinning_pars_vertex:wg,skinning_vertex:Eg,skinnormal_vertex:Ag,specularmap_fragment:Rg,specularmap_pars_fragment:Cg,tonemapping_fragment:Ig,tonemapping_pars_fragment:Ng,transmission_fragment:Pg,transmission_pars_fragment:Lg,uv_pars_fragment:Fg,uv_pars_vertex:Dg,uv_vertex:Ug,worldpos_vertex:kg,background_vert:Og,background_frag:Bg,backgroundCube_vert:Vg,backgroundCube_frag:zg,cube_vert:Gg,cube_frag:Hg,depth_vert:Wg,depth_frag:Xg,distance_vert:qg,distance_frag:Yg,equirect_vert:$g,equirect_frag:Zg,linedashed_vert:Kg,linedashed_frag:jg,meshbasic_vert:Jg,meshbasic_frag:Qg,meshlambert_vert:e_,meshlambert_frag:t_,meshmatcap_vert:n_,meshmatcap_frag:i_,meshnormal_vert:r_,meshnormal_frag:s_,meshphong_vert:a_,meshphong_frag:o_,meshphysical_vert:l_,meshphysical_frag:c_,meshtoon_vert:u_,meshtoon_frag:d_,points_vert:h_,points_frag:f_,shadow_vert:p_,shadow_frag:m_,sprite_vert:g_,sprite_frag:__},pe={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},Mt={basic:{uniforms:en([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:en([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:en([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:en([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:en([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:en([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:en([pe.points,pe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:en([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:en([pe.common,pe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:en([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:en([pe.sprite,pe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:en([pe.common,pe.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:en([pe.lights,pe.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Mt.physical={uniforms:en([Mt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};Ko={r:0,b:0,g:0},x_=new Pe,Jh=new ze;Jh.set(-1,0,0,0,1,0,0,0,1);Kr=4,T_=6,w_=20,E_=256,qs=new Wn,Ih=new Ne,Dc=null,Uc=0,kc=0,Oc=!1,A_=new U,er=new U,Jo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){let{size:a=256,position:o=A_}=s;Dc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dc,Uc,kc),this._renderer.xr.enabled=Oc,e.scissorTest=!1,Zr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wi||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:lt,minFilter:lt,generateMipmaps:!1,type:Yt,format:$t,colorSpace:sn,depthBuffer:!1},r=Nh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nh(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=R_(s)),this._blurMaterial=I_(s,e,t),this._ggxMaterial=C_(s,e,t)}return r}_compileMaterial(e){let t=new Et(new Dt,e);this._renderer.compile(t,qs)}_sceneToCubeUV(e,t,n,r,s){let l=new Nt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Ih),h.toneMapping=mn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Et(new Or,new Nn({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,p=!1,M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(Ih),p=!0);for(let R=0;R<6;R++){let S=R%3;S===0?(l.up.set(0,c[R],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[R],s.y,s.z)):S===1?(l.up.set(0,0,c[R]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[R],s.z)):(l.up.set(0,c[R],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[R]));let v=this._cubeSize;Zr(r,S*v,R>2?v:0,v,v),h.setRenderTarget(r),p&&h.render(_,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===wi||e.mapping===ji;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ph());let s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let o=s.uniforms;o.envMap.value=e;let l=this._cubeSize;Zr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,qs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=c*1.25,f=h*d,{_lodMax:g}=this,_=this._sizeLods[n],m=3*_*(n>g-Kr?n-g+Kr:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,Zr(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(o,qs),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,Zr(e,m,p,3*_,2*_),r.setRenderTarget(e),r.render(o,qs)}_blur(e,t,n,r){let s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,r,s){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[r],h=3*u*(r>this._lodMax-Kr?r-this._lodMax+Kr:0),d=4*(this._cubeSize-u);Zr(t,h,d,3*u,2*u),a.setRenderTarget(t),a.render(l,qs)}};Qo=class extends Gt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Cs(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Or(5,5,5),s=new Xt({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:an,blending:Xn});s.uniforms.tEquirect.value=t;let a=new Et(r,s),o=t.minFilter;return t.minFilter===on&&(t.minFilter=lt),new ro(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}};O_={[oc]:"LINEAR_TONE_MAPPING",[lc]:"REINHARD_TONE_MAPPING",[cc]:"CINEON_TONE_MAPPING",[uc]:"ACES_FILMIC_TONE_MAPPING",[dc]:"AGX_TONE_MAPPING",[hc]:"NEUTRAL_TONE_MAPPING",[Ki]:"CUSTOM_TONE_MAPPING"};Qh=new Pt,zc=new Ti(1,1),ef=new ys,tf=new Ir,nf=new Cs,Fh=[],Dh=[],Uh=new Float32Array(16),kh=new Float32Array(9),Oh=new Float32Array(4);Gc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sx(t.type)}},Hc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wx(t.type)}},Wc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],n)}}},Bc=/(\w+)(\])?(\[|\.)?/g;jr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ex(o,l,this)}let r=[],s=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&n.push(a)}return n}};Ax=37297,Rx=0;zh=new ze;Px={[oc]:"Linear",[lc]:"Reinhard",[cc]:"Cineon",[uc]:"ACESFilmic",[dc]:"AgX",[hc]:"Neutral",[Ki]:"Custom"};jo=new U;Ox=/^[ \t]*#include +<([\w\d./]+)>/gm;Bx=new Map;zx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;Hx={[ks]:"SHADOWMAP_TYPE_PCF",[Hr]:"SHADOWMAP_TYPE_VSM"};Xx={[wi]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE_UV"};Yx={[ji]:"ENVMAP_MODE_REFRACTION"};Zx={[ac]:"ENVMAP_BLENDING_MULTIPLY",[ch]:"ENVMAP_BLENDING_MIX",[uh]:"ENVMAP_BLENDING_ADD"};Qx=0,qc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Yc(e),t.set(e,n)),n}},Yc=class{constructor(e){this.id=Qx++,this.code=e,this.usedTimes=0}};oy=0;dy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,fy=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],py=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Kh=new Pe,Ys=new U,Vc=new U;yy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$c=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Is(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Xt({vertexShader:yy,fragmentShader:vy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Zc=class extends Bn{constructor(e,t){super();let n=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new $c,p={},M=t.getContextAttributes(),R=null,S=null,v=[],T=[],w=new Xe,y=null,E=null,C=new Nt;C.viewport=new Je;let D=new Nt;D.viewport=new Je;let O=[C,D],G=new so,N=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let j=v[W];return j===void 0&&(j=new Nr,v[W]=j),j.getTargetRaySpace()},this.getControllerGrip=function(W){let j=v[W];return j===void 0&&(j=new Nr,v[W]=j),j.getGripSpace()},this.getHand=function(W){let j=v[W];return j===void 0&&(j=new Nr,v[W]=j),j.getHandSpace()};function J(W){let j=T.indexOf(W.inputSource);if(j===-1)return;let xe=v[j];xe!==void 0&&(xe.update(W.inputSource,W.frame,c||a),xe.dispatchEvent({type:W.type,data:W.inputSource}))}function Y(){r.removeEventListener("select",J),r.removeEventListener("selectstart",J),r.removeEventListener("selectend",J),r.removeEventListener("squeeze",J),r.removeEventListener("squeezestart",J),r.removeEventListener("squeezeend",J),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",re);for(let W=0;W<v.length;W++){let j=T[W];j!==null&&(T[W]=null,v[W].disconnect(j))}N=null,H=null,m.reset();for(let W in p)delete p[W];if(e.setRenderTarget(R),f=null,d=null,h=null,r=null,S=null,ke.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(w.width,w.height,!1),E!==null){let W=E.camera;W.fov=E.fov,W.zoom=E.zoom,W.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,n.isPresenting===!0&&Ae("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&Ae("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(R=e.getRenderTarget(),r.addEventListener("select",J),r.addEventListener("selectstart",J),r.addEventListener("selectend",J),r.addEventListener("squeeze",J),r.addEventListener("squeezestart",J),r.addEventListener("squeezeend",J),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",re),M.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(w),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,we=null,le=null;M.depth&&(le=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=M.stencil?Ei:On,we=M.stencil?Yr:Pn);let Ue={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Ue),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new Gt(d.textureWidth,d.textureHeight,{format:$t,type:Qt,depthTexture:new Ti(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let xe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,xe),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Gt(f.framebufferWidth,f.framebufferHeight,{format:$t,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ke.setContext(r),ke.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function re(W){for(let j=0;j<W.removed.length;j++){let xe=W.removed[j],we=T.indexOf(xe);we>=0&&(T[we]=null,v[we].disconnect(xe))}for(let j=0;j<W.added.length;j++){let xe=W.added[j],we=T.indexOf(xe);if(we===-1){for(let Ue=0;Ue<v.length;Ue++)if(Ue>=T.length){T.push(xe),we=Ue;break}else if(T[Ue]===null){T[Ue]=xe,we=Ue;break}if(we===-1)break}let le=v[we];le&&le.connect(xe)}}let q=new U,te=new U;function ie(W,j,xe){q.setFromMatrixPosition(j.matrixWorld),te.setFromMatrixPosition(xe.matrixWorld);let we=q.distanceTo(te),le=j.projectionMatrix.elements,Ue=xe.projectionMatrix.elements,nt=le[14]/(le[10]-1),Oe=le[14]/(le[10]+1),Ge=(le[9]+1)/le[5],Qe=(le[9]-1)/le[5],We=(le[8]-1)/le[0],ct=(Ue[8]+1)/Ue[0],Tt=nt*We,Zt=nt*ct,gt=we/(-We+ct),St=gt*-We;if(j.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(St),W.translateZ(gt),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),le[10]===-1)W.projectionMatrix.copy(j.projectionMatrix),W.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let F=nt+gt,Ot=Oe+gt,et=Tt-St,A=Zt+(we-St),x=Ge*Oe/Ot*F,k=Qe*Oe/Ot*F;W.projectionMatrix.makePerspective(et,A,x,k,F,Ot),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function Z(W,j){j===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(j.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let j=W.near,xe=W.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(xe=m.depthFar)),G.near=D.near=C.near=j,G.far=D.far=C.far=xe,(N!==G.near||H!==G.far)&&(r.updateRenderState({depthNear:G.near,depthFar:G.far}),N=G.near,H=G.far),G.layers.mask=W.layers.mask|6,C.layers.mask=G.layers.mask&-5,D.layers.mask=G.layers.mask&-3;let we=W.parent,le=G.cameras;Z(G,we);for(let Ue=0;Ue<le.length;Ue++)Z(le[Ue],we);le.length===2?ie(G,C,D):G.projectionMatrix.copy(C.projectionMatrix),E===null&&W.isPerspectiveCamera&&(E={camera:W,fov:W.fov,zoom:W.zoom}),ne(W,G,we)};function ne(W,j,xe){xe===null?W.matrix.copy(j.matrixWorld):(W.matrix.copy(xe.matrixWorld),W.matrix.invert(),W.matrix.multiply(j.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(j.projectionMatrix),W.projectionMatrixInverse.copy(j.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Hi*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(W){l=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function(W){return p[W]};let Le=null;function Me(W,j){if(u=j.getViewerPose(c||a),g=j,u!==null){let xe=u.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let we=!1;xe.length!==G.cameras.length&&(G.cameras.length=0,we=!0);for(let Oe=0;Oe<xe.length;Oe++){let Ge=xe[Oe],Qe=null;if(f!==null)Qe=f.getViewport(Ge);else{let ct=h.getViewSubImage(d,Ge);Qe=ct.viewport,Oe===0&&(e.setRenderTargetTextures(S,ct.colorTexture,ct.depthStencilTexture),e.setRenderTarget(S))}let We=O[Oe];We===void 0&&(We=new Nt,We.layers.enable(Oe),We.viewport=new Je,O[Oe]=We),We.matrix.fromArray(Ge.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ge.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),Oe===0&&(G.matrix.copy(We.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),we===!0&&G.cameras.push(We)}let le=r.enabledFeatures;if(le&&le.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let Oe=h.getDepthInformation(xe[0]);Oe&&Oe.isValid&&Oe.texture&&m.init(Oe,r.renderState)}if(le&&le.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let Oe=0;Oe<xe.length;Oe++){let Ge=xe[Oe].camera;if(Ge){let Qe=p[Ge];Qe||(Qe=new Is,p[Ge]=Qe);let We=h.getCameraImage(Ge);Qe.sourceTexture=We}}}}for(let xe=0;xe<v.length;xe++){let we=T[xe],le=v[xe];we!==null&&le!==void 0&&le.update(we,j,c||a)}Le&&Le(W,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}let ke=new jh;ke.setAnimationLoop(Me),this.setAnimationLoop=function(W){Le=W},this.dispose=function(){}}},Sy=new Pe,rf=new ze;rf.set(-1,0,0,0,1,0,0,0,1);Ty=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),qn=null;el=class{constructor(e={}){let{canvas:t=bh(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Qt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let _=f,m=new Set([go,mo,po]),p=new Set([Qt,Pn,qr,Yr,ho,fo]),M=new Uint32Array(4),R=new Int32Array(4),S=new U,v=null,T=null,w=[],y=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,D=!1,O=null,G=null,N=null,H=null;this._outputColorSpace=xt;let J=0,Y=0,re=null,q=-1,te=null,ie=new Je,Z=new Je,ne=null,Le=new Ne(0),Me=0,ke=t.width,W=t.height,j=1,xe=null,we=null,le=new Je(0,0,ke,W),Ue=new Je(0,0,ke,W),nt=!1,Oe=new Dr,Ge=!1,Qe=!1,We=new Pe,ct=new U,Tt=new Je,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},gt=!1;function St(){return re===null?j:1}let F=n;function Ot(b,P){return t.getContext(b,P)}let et,A,x,k,I,z,ae,oe,K,ee,ce,Re,fe,ue,Ce,De,He,L,de,Q,he,_e,se;try{let b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",ft,!1),t.addEventListener("webglcontextrestored",it,!1),t.addEventListener("webglcontextcreationerror",Sn,!1),F===null){let P="webgl2";if(F=Ot(P,b),F===null)throw Ot(P)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(b){throw t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Sn,!1),Be("WebGLRenderer: "+b.message),b}function Ie(){et=new P_(F),et.init(),he=new xy(F,et),A=new b_(F,et,e,he),x=new gy(F,et),A.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),G=F.createFramebuffer(),N=F.createFramebuffer(),H=F.createFramebuffer(),k=new D_(F),I=new ny,z=new _y(F,et,x,I,A,he,k),ae=new N_(C),oe=new km(F),_e=new v_(F,oe),K=new L_(F,oe,k,_e),ee=new k_(F,K,oe,_e,k),L=new U_(F,A,z),Ce=new M_(I),ce=new ty(C,ae,et,A,_e,Ce),Re=new by(C,I),fe=new ry,ue=new uy(et),He=new y_(C,ae,x,ee,g,l),De=new my(C,ee,A),se=new My(F,k,A,x),de=new S_(F,et,k),Q=new F_(F,et,k),k.programs=ce.programs,C.capabilities=A,C.extensions=et,C.properties=I,C.renderLists=fe,C.shadowMap=De,C.state=x,C.info=k}_!==Qt&&(E=new B_(_,t.width,t.height,o,r,s));let Te=new Zc(C,F);this.xr=Te,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let b=et.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=et.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(b){b!==void 0&&(j=b,this.setSize(ke,W,!1))},this.getSize=function(b){return b.set(ke,W)},this.setSize=function(b,P,X=!0){if(Te.isPresenting){Ae("WebGLRenderer: Can't change size while VR device is presenting.");return}ke=b,W=P,t.width=Math.floor(b*j),t.height=Math.floor(P*j),X===!0&&(t.style.width=b+"px",t.style.height=P+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,b,P)},this.getDrawingBufferSize=function(b){return b.set(ke*j,W*j).floor()},this.setDrawingBufferSize=function(b,P,X){ke=b,W=P,j=X,t.width=Math.floor(b*X),t.height=Math.floor(P*X),this.setViewport(0,0,b,P)},this.setEffects=function(b){if(_===Qt){Be("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let P=0;P<b.length;P++)if(b[P].isOutputPass===!0){Ae("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ie)},this.getViewport=function(b){return b.copy(le)},this.setViewport=function(b,P,X,B){b.isVector4?le.set(b.x,b.y,b.z,b.w):le.set(b,P,X,B),x.viewport(ie.copy(le).multiplyScalar(j).round())},this.getScissor=function(b){return b.copy(Ue)},this.setScissor=function(b,P,X,B){b.isVector4?Ue.set(b.x,b.y,b.z,b.w):Ue.set(b,P,X,B),x.scissor(Z.copy(Ue).multiplyScalar(j).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(b){x.setScissorTest(nt=b)},this.setOpaqueSort=function(b){xe=b},this.setTransparentSort=function(b){we=b},this.getClearColor=function(b){return b.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor(...arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha(...arguments)},this.clear=function(b=!0,P=!0,X=!0){let B=0;if(b){let V=!1;if(re!==null){let ge=re.texture.format;V=m.has(ge)}if(V){let ge=re.texture.type,ve=p.has(ge),me=He.getClearColor(),Se=He.getClearAlpha(),Ee=me.r,qe=me.g,Ze=me.b;ve?(M[0]=Ee,M[1]=qe,M[2]=Ze,M[3]=Se,F.clearBufferuiv(F.COLOR,0,M)):(R[0]=Ee,R[1]=qe,R[2]=Ze,R[3]=Se,F.clearBufferiv(F.COLOR,0,R))}else B|=F.COLOR_BUFFER_BIT}P&&(B|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(B|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&F.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),O=b},this.dispose=function(){t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Sn,!1),He.dispose(),fe.dispose(),ue.dispose(),I.dispose(),ae.dispose(),ee.dispose(),_e.dispose(),se.dispose(),ce.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Yu),Te.removeEventListener("sessionend",$u),Di.stop()};function ft(b){b.preventDefault(),xs("WebGLRenderer: Context Lost."),D=!0}function it(){xs("WebGLRenderer: Context Restored."),D=!1;let b=k.autoReset,P=De.enabled,X=De.autoUpdate,B=De.needsUpdate,V=De.type;Ie(),k.autoReset=b,De.enabled=P,De.autoUpdate=X,De.needsUpdate=B,De.type=V}function Sn(b){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Fn(b){let P=b.target;P.removeEventListener("dispose",Fn),Tp(P)}function Tp(b){wp(b),I.remove(b)}function wp(b){let P=I.get(b).programs;P!==void 0&&(P.forEach(function(X){ce.releaseProgram(X)}),b.isShaderMaterial&&ce.releaseShaderCache(b))}this.renderBufferDirect=function(b,P,X,B,V,ge){P===null&&(P=Zt);let ve=V.isMesh&&V.matrixWorld.determinantAffine()<0,me=Rp(b,P,X,B,V);x.setMaterial(B,ve);let Se=X.index,Ee=1;if(B.wireframe===!0){if(Se=K.getWireframeAttribute(X),Se===void 0)return;Ee=2}let qe=X.drawRange,Ze=X.attributes.position,be=qe.start*Ee,rt=(qe.start+qe.count)*Ee;ge!==null&&(be=Math.max(be,ge.start*Ee),rt=Math.min(rt,(ge.start+ge.count)*Ee)),Se!==null?(be=Math.max(be,0),rt=Math.min(rt,Se.count)):Ze!=null&&(be=Math.max(be,0),rt=Math.min(rt,Ze.count));let Ct=rt-be;if(Ct<0||Ct===1/0)return;_e.setup(V,B,me,X,Se);let _t,dt=de;if(Se!==null&&(_t=oe.get(Se),dt=Q,dt.setIndex(_t)),V.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*St()),dt.setMode(F.LINES)):dt.setMode(F.TRIANGLES);else if(V.isLine){let Kt=B.linewidth;Kt===void 0&&(Kt=1),x.setLineWidth(Kt*St()),V.isLineSegments?dt.setMode(F.LINES):V.isLineLoop?dt.setMode(F.LINE_LOOP):dt.setMode(F.LINE_STRIP)}else V.isPoints?dt.setMode(F.POINTS):V.isSprite&&dt.setMode(F.TRIANGLES);if(V.isBatchedMesh)if(et.get("WEBGL_multi_draw"))dt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let Kt=V._multiDrawStarts,ye=V._multiDrawCounts,nn=V._multiDrawCount,je=Se?oe.get(Se).bytesPerElement:1,gn=I.get(B).currentProgram.getUniforms();for(let Dn=0;Dn<nn;Dn++)gn.setValue(F,"_gl_DrawID",Dn),dt.render(Kt[Dn]/je,ye[Dn])}else if(V.isInstancedMesh)dt.renderInstances(be,Ct,V.count);else if(X.isInstancedBufferGeometry){let Kt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,ye=Math.min(X.instanceCount,Kt);dt.renderInstances(be,Ct,ye)}else dt.render(be,Ct)};function qu(b,P,X,B){O!==null&&b.isNodeMaterial&&O.setObject(B,b),Ge===!0&&Ce.setState(b,X,!1),b.transparent===!0&&b.side===bt&&b.forceSinglePass===!1?(b.side=an,b.needsUpdate=!0,oa(b,P,B),b.side=Lt,b.needsUpdate=!0,oa(b,P,B),b.side=bt):oa(b,P,B)}this.compile=function(b,P,X=null){X===null&&(X=b),O!==null&&O.renderStart(b,P,X),T=ue.get(X),T.init(P),y.push(T),X.traverseVisible(function(V){V.isLight&&V.layers.test(P.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),b!==X&&b.traverseVisible(function(V){V.isLight&&V.layers.test(P.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),O!==null&&O.updateLights(T.state.lightsArray),Qe=this.localClippingEnabled,Ge=Ce.init(this.clippingPlanes,Qe),Ge===!0&&Ce.setGlobalState(this.clippingPlanes,P),O!==null&&De.render(T.state.shadowsArray,X,P);let B=new Set;return b.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let ge=V.material;if(ge)if(Array.isArray(ge))for(let ve=0;ve<ge.length;ve++){let me=ge[ve];qu(me,X,P,V),B.add(me)}else qu(ge,X,P,V),B.add(ge)}),T=y.pop(),O!==null&&O.renderEnd(),B},this.compileAsync=function(b,P,X=null){let B=this.compile(b,P,X);return new Promise(V=>{function ge(){if(B.forEach(function(ve){let Se=I.get(ve).currentProgram;(Se===void 0||Se.isReady())&&B.delete(ve)}),B.size===0){V(b);return}setTimeout(ge,10)}et.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let pl=null;function Ep(b){pl&&pl(b)}function Yu(){Di.stop()}function $u(){Di.start()}let Di=new jh;Di.setAnimationLoop(Ep),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(b){pl=b,Te.setAnimationLoop(b),b===null?Di.stop():Di.start()},Te.addEventListener("sessionstart",Yu),Te.addEventListener("sessionend",$u),this.render=function(b,P){if(P!==void 0&&P.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;O!==null&&O.renderStart(b,P);let X=Te.enabled===!0&&Te.isPresenting===!0,B=E!==null&&(re===null||X)&&E.begin(C,re);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(P),P=Te.getCamera()),b.isScene===!0&&b.onBeforeRender(C,b,P,re),T=ue.get(b,y.length),T.init(P),T.state.textureUnits=z.getTextureUnits(),y.push(T),We.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),Oe.setFromProjectionMatrix(We,An,P.reversedDepth),Qe=this.localClippingEnabled,Ge=Ce.init(this.clippingPlanes,Qe),v=fe.get(b,w.length),v.init(),w.push(v),Te.enabled===!0&&Te.isPresenting===!0){let ve=C.xr.getDepthSensingMesh();ve!==null&&ml(ve,P,-1/0,C.sortObjects)}ml(b,P,0,C.sortObjects),v.finish(),O!==null&&O.updateLights(T.state.lightsArray),C.sortObjects===!0&&v.sort(xe,we),gt=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,gt&&He.addToRenderList(v,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ge===!0&&Ce.beginShadows();let V=T.state.shadowsArray;if(De.render(V,b,P),Ge===!0&&Ce.endShadows(),(B&&E.hasRenderPass())===!1){let ve=v.opaque,me=v.transmissive;if(T.setupLights(),P.isArrayCamera){let Se=P.cameras;if(me.length>0)for(let Ee=0,qe=Se.length;Ee<qe;Ee++){let Ze=Se[Ee];Ku(ve,me,b,Ze)}gt&&He.render(b);for(let Ee=0,qe=Se.length;Ee<qe;Ee++){let Ze=Se[Ee];Zu(v,b,Ze,Ze.viewport)}}else me.length>0&&Ku(ve,me,b,P),gt&&He.render(b),Zu(v,b,P)}re!==null&&Y===0&&(z.updateMultisampleRenderTarget(re),z.updateRenderTargetMipmap(re)),B&&E.end(C),b.isScene===!0&&b.onAfterRender(C,b,P),_e.resetDefaultState(),q=-1,te=null,y.pop(),y.length>0?(T=y[y.length-1],z.setTextureUnits(T.state.textureUnits),Ge===!0&&Ce.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?v=w[w.length-1]:v=null,O!==null&&O.renderEnd()};function ml(b,P,X,B){if(b.visible===!1)return;if(b.layers.test(P.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(P);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(Oe)){B&&Tt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(We);let ve=ee.update(b),me=b.material;me.visible&&v.push(b,ve,me,X,Tt.z,null,P)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(Oe))){let ve=ee.update(b),me=b.material;if(B&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Tt.copy(b.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Tt.copy(ve.boundingSphere.center)),Tt.applyMatrix4(b.matrixWorld).applyMatrix4(We)),Array.isArray(me)){let Se=ve.groups;for(let Ee=0,qe=Se.length;Ee<qe;Ee++){let Ze=Se[Ee],be=me[Ze.materialIndex];be&&be.visible&&v.push(b,ve,be,X,Tt.z,Ze,P)}}else me.visible&&v.push(b,ve,me,X,Tt.z,null,P)}}let ge=b.children;for(let ve=0,me=ge.length;ve<me;ve++)ml(ge[ve],P,X,B)}function Zu(b,P,X,B){let{opaque:V,transmissive:ge,transparent:ve}=b;T.setupLightsView(X),Ge===!0&&Ce.setGlobalState(C.clippingPlanes,X),B&&x.viewport(ie.copy(B)),V.length>0&&aa(V,P,X),ge.length>0&&aa(ge,P,X),ve.length>0&&aa(ve,P,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Ku(b,P,X,B){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[B.id]===void 0){let be=et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[B.id]=new Gt(1,1,{generateMipmaps:!0,type:be?Yt:Qt,minFilter:on,samples:Math.max(4,A.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}let ge=T.state.transmissionRenderTarget[B.id],ve=B.viewport||ie;ge.setSize(ve.z*C.transmissionResolutionScale,ve.w*C.transmissionResolutionScale);let me=C.getRenderTarget(),Se=C.getActiveCubeFace(),Ee=C.getActiveMipmapLevel();C.setRenderTarget(ge),C.getClearColor(Le),Me=C.getClearAlpha(),Me<1&&C.setClearColor(16777215,.5),C.clear(),gt&&He.render(X);let qe=C.toneMapping;C.toneMapping=mn;let Ze=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),T.setupLightsView(B),Ge===!0&&Ce.setGlobalState(C.clippingPlanes,B),aa(b,X,B),z.updateMultisampleRenderTarget(ge),z.updateRenderTargetMipmap(ge),et.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let rt=0,Ct=P.length;rt<Ct;rt++){let _t=P[rt],{object:dt,geometry:Kt,material:ye,group:nn}=_t;if(ye.side===bt&&dt.layers.test(B.layers)){let je=ye.side;ye.side=an,ye.needsUpdate=!0,ju(dt,X,B,Kt,ye,nn),ye.side=je,ye.needsUpdate=!0,be=!0}}be===!0&&(z.updateMultisampleRenderTarget(ge),z.updateRenderTargetMipmap(ge))}C.setRenderTarget(me,Se,Ee),C.setClearColor(Le,Me),Ze!==void 0&&(B.viewport=Ze),C.toneMapping=qe}function aa(b,P,X){let B=P.isScene===!0?P.overrideMaterial:null;for(let V=0,ge=b.length;V<ge;V++){let ve=b[V],{object:me,geometry:Se,group:Ee}=ve,qe=ve.material;qe.allowOverride===!0&&B!==null&&(qe=B),me.layers.test(X.layers)&&ju(me,P,X,Se,qe,Ee)}}function ju(b,P,X,B,V,ge){O!==null&&V.isNodeMaterial&&O.setObject(b,V),b.onBeforeRender(C,P,X,B,V,ge),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(C,P,X,B,b,ge),V.transparent===!0&&V.side===bt&&V.forceSinglePass===!1?(V.side=an,V.needsUpdate=!0,C.renderBufferDirect(X,P,B,V,b,ge),V.side=Lt,V.needsUpdate=!0,C.renderBufferDirect(X,P,B,V,b,ge),V.side=bt):C.renderBufferDirect(X,P,B,V,b,ge),b.onAfterRender(C,P,X,B,V,ge)}function oa(b,P,X){P.isScene!==!0&&(P=Zt);let B=I.get(b),V=T.state.lights,ge=T.state.shadowsArray,ve=V.state.version,me=ce.getParameters(b,V.state,ge,P,X,T.state.lightProbeGridArray),Se=ce.getProgramCacheKey(me),Ee=B.programs;B.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?P.environment:null,B.fog=P.fog;let qe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;B.envMap=ae.get(b.envMap||B.environment,qe),B.envMapRotation=B.environment!==null&&b.envMap===null?P.environmentRotation:b.envMapRotation,Ee===void 0&&(b.addEventListener("dispose",Fn),Ee=new Map,B.programs=Ee);let Ze=Ee.get(Se);if(Ze!==void 0){if(B.currentProgram===Ze&&B.lightsStateVersion===ve)return Qu(b,me),Ze}else me.uniforms=ce.getUniforms(b),O!==null&&b.isNodeMaterial&&O.build(b,X,me),b.onBeforeCompile(me,C),Ze=ce.acquireProgram(me,Se),Ee.set(Se,Ze),B.uniforms=me.uniforms;let be=B.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(be.clippingPlanes=Ce.uniform),Qu(b,me),B.needsLights=Ip(b),B.lightsStateVersion=ve,B.needsLights&&(be.ambientLightColor.value=V.state.ambient,be.lightProbe.value=V.state.probe,be.sunLights.value=V.state.sun,be.sunLightShadows.value=V.state.sunShadow,be.directionalLights.value=V.state.directional,be.directionalLightShadows.value=V.state.directionalShadow,be.spotLights.value=V.state.spot,be.spotLightShadows.value=V.state.spotShadow,be.rectAreaLights.value=V.state.rectArea,be.ltc_1.value=V.state.rectAreaLTC1,be.ltc_2.value=V.state.rectAreaLTC2,be.pointLights.value=V.state.point,be.pointLightShadows.value=V.state.pointShadow,be.hemisphereLights.value=V.state.hemi,be.sunShadowMatrix.value=V.state.sunShadowMatrix,be.sunShadowCascade.value=V.state.sunShadowCascade,be.directionalShadowMatrix.value=V.state.directionalShadowMatrix,be.spotLightMatrix.value=V.state.spotLightMatrix,be.spotLightMap.value=V.state.spotLightMap,be.pointShadowMatrix.value=V.state.pointShadowMatrix),B.lightProbeGrid=T.state.lightProbeGridArray.length>0,B.currentProgram=Ze,B.uniformsList=null,Ze}function Ju(b){if(b.uniformsList===null){let P=b.currentProgram.getUniforms();b.uniformsList=jr.seqWithValue(P.seq,b.uniforms)}return b.uniformsList}function Qu(b,P){let X=I.get(b);X.outputColorSpace=P.outputColorSpace,X.batching=P.batching,X.batchingColor=P.batchingColor,X.instancing=P.instancing,X.instancingColor=P.instancingColor,X.instancingMorph=P.instancingMorph,X.skinning=P.skinning,X.morphTargets=P.morphTargets,X.morphNormals=P.morphNormals,X.morphColors=P.morphColors,X.morphTargetsCount=P.morphTargetsCount,X.numClippingPlanes=P.numClippingPlanes,X.numIntersection=P.numClipIntersection,X.vertexAlphas=P.vertexAlphas,X.vertexTangents=P.vertexTangents,X.toneMapping=P.toneMapping}function Ap(b,P){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;S.setFromMatrixPosition(P.matrixWorld);for(let X=0,B=b.length;X<B;X++){let V=b[X];if(V.texture!==null&&V.boundingBox.containsPoint(S))return V}return null}function Rp(b,P,X,B,V){P.isScene!==!0&&(P=Zt),z.resetTextureUnits();let ge=P.fog,ve=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?P.environment:null,me=re===null?C.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Ye.workingColorSpace,Se=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ee=ae.get(B.envMap||ve,Se),qe=B.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ze=!!X.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),be=!!X.morphAttributes.position,rt=!!X.morphAttributes.normal,Ct=!!X.morphAttributes.color,_t=mn;B.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(_t=C.toneMapping);let dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Kt=dt!==void 0?dt.length:0,ye=I.get(B),nn=T.state.lights;if(Ge===!0&&(Qe===!0||b!==te)){let pt=b===te&&B.id===q;Ce.setState(B,b,pt)}let je=!1;B.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==nn.state.version||ye.outputColorSpace!==me||V.isBatchedMesh&&ye.batching===!1||!V.isBatchedMesh&&ye.batching===!0||V.isBatchedMesh&&ye.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&ye.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&ye.instancing===!1||!V.isInstancedMesh&&ye.instancing===!0||V.isSkinnedMesh&&ye.skinning===!1||!V.isSkinnedMesh&&ye.skinning===!0||V.isInstancedMesh&&ye.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ye.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ye.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ye.instancingMorph===!1&&V.morphTexture!==null||ye.envMap!==Ee||B.fog===!0&&ye.fog!==ge||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Ce.numPlanes||ye.numIntersection!==Ce.numIntersection)||ye.vertexAlphas!==qe||ye.vertexTangents!==Ze||ye.morphTargets!==be||ye.morphNormals!==rt||ye.morphColors!==Ct||ye.toneMapping!==_t||ye.morphTargetsCount!==Kt||!!ye.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,ye.__version=B.version);let gn=ye.currentProgram;je===!0&&(gn=oa(B,P,V),O&&B.isNodeMaterial&&O.onUpdateProgram(B,gn,ye));let Dn=!1,pi=!1,ar=!1,ut=gn.getUniforms(),wt=ye.uniforms;if(x.useProgram(gn.program)&&(Dn=!0,pi=!0,ar=!0),B.id!==q&&(q=B.id,pi=!0),ye.needsLights){let pt=Ap(T.state.lightProbeGridArray,V);ye.lightProbeGrid!==pt&&(ye.lightProbeGrid=pt,pi=!0)}if(Dn||te!==b){x.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ut.setValue(F,"projectionMatrix",b.projectionMatrix),ut.setValue(F,"viewMatrix",b.matrixWorldInverse);let gi=ut.map.cameraPosition;gi!==void 0&&gi.setValue(F,ct.setFromMatrixPosition(b.matrixWorld)),A.logarithmicDepthBuffer&&ut.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ut.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),te!==b&&(te=b,pi=!0,ar=!0)}if(ye.needsLights&&(nn.state.sunShadowMap.length>0&&ut.setValue(F,"sunShadowMap",nn.state.sunShadowMap,z),nn.state.directionalShadowMap.length>0&&ut.setValue(F,"directionalShadowMap",nn.state.directionalShadowMap,z),nn.state.spotShadowMap.length>0&&ut.setValue(F,"spotShadowMap",nn.state.spotShadowMap,z),nn.state.pointShadowMap.length>0&&ut.setValue(F,"pointShadowMap",nn.state.pointShadowMap,z)),V.isSkinnedMesh){ut.setOptional(F,V,"bindMatrix"),ut.setOptional(F,V,"bindMatrixInverse");let pt=V.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),ut.setValue(F,"boneTexture",pt.boneTexture,z))}V.isBatchedMesh&&(ut.setOptional(F,V,"batchingTexture"),ut.setValue(F,"batchingTexture",V._matricesTexture,z),ut.setOptional(F,V,"batchingIdTexture"),ut.setValue(F,"batchingIdTexture",V._indirectTexture,z),ut.setOptional(F,V,"batchingColorTexture"),V._colorsTexture!==null&&ut.setValue(F,"batchingColorTexture",V._colorsTexture,z));let mi=X.morphAttributes;if((mi.position!==void 0||mi.normal!==void 0||mi.color!==void 0)&&L.update(V,X,gn),(pi||ye.receiveShadow!==V.receiveShadow)&&(ye.receiveShadow=V.receiveShadow,ut.setValue(F,"receiveShadow",V.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&P.environment!==null&&(wt.envMapIntensity.value=P.environmentIntensity),wt.dfgLUT!==void 0&&(wt.dfgLUT.value=wy()),pi){if(ut.setValue(F,"toneMappingExposure",C.toneMappingExposure),ye.needsLights&&Cp(wt,ar),ge&&B.fog===!0&&Re.refreshFogUniforms(wt,ge),Re.refreshMaterialUniforms(wt,B,j,W,T.state.transmissionRenderTarget[b.id]),ye.needsLights&&ye.lightProbeGrid){let pt=ye.lightProbeGrid;wt.probesSH.value=pt.texture,wt.probesMin.value.copy(pt.boundingBox.min),wt.probesMax.value.copy(pt.boundingBox.max),wt.probesResolution.value.copy(pt.resolution)}jr.upload(F,Ju(ye),wt,z)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(jr.upload(F,Ju(ye),wt,z),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ut.setValue(F,"center",V.center),ut.setValue(F,"modelViewMatrix",V.modelViewMatrix),ut.setValue(F,"normalMatrix",V.normalMatrix),ut.setValue(F,"modelMatrix",V.matrixWorld),B.uniformsGroups!==void 0){let pt=B.uniformsGroups;for(let gi=0,or=pt.length;gi<or;gi++){let td=pt[gi];se.update(td,gn),se.bind(td,gn)}}return gn}function Cp(b,P){b.ambientLightColor.needsUpdate=P,b.lightProbe.needsUpdate=P,b.sunLights.needsUpdate=P,b.sunLightShadows.needsUpdate=P,b.directionalLights.needsUpdate=P,b.directionalLightShadows.needsUpdate=P,b.pointLights.needsUpdate=P,b.pointLightShadows.needsUpdate=P,b.spotLights.needsUpdate=P,b.spotLightShadows.needsUpdate=P,b.rectAreaLights.needsUpdate=P,b.hemisphereLights.needsUpdate=P}function Ip(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return re},this.setRenderTargetTextures=function(b,P,X){let B=I.get(b);B.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),I.get(b.texture).__webglTexture=P,I.get(b.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:X,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,P){let X=I.get(b);X.__webglFramebuffer=P,X.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(b,P=0,X=0){re=b,J=P,Y=X;let B=null,V=!1,ge=!1;if(b){let me=I.get(b);if(me.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(F.FRAMEBUFFER,me.__webglFramebuffer),ie.copy(b.viewport),Z.copy(b.scissor),ne=b.scissorTest,x.viewport(ie),x.scissor(Z),x.setScissorTest(ne),q=-1;return}else if(me.__webglFramebuffer===void 0)z.setupRenderTarget(b);else if(me.__hasExternalTextures)z.rebindTextures(b,I.get(b.texture).__webglTexture,I.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let qe=b.depthTexture;if(me.__boundDepthTexture!==qe){if(qe!==null&&I.has(qe)&&(b.width!==qe.image.width||b.height!==qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(b)}}let Se=b.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(ge=!0);let Ee=I.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ee[P])?B=Ee[P][X]:B=Ee[P],V=!0):b.samples>0&&z.useMultisampledRTT(b)===!1?B=I.get(b).__webglMultisampledFramebuffer:Array.isArray(Ee)?B=Ee[X]:B=Ee,ie.copy(b.viewport),Z.copy(b.scissor),ne=b.scissorTest}else ie.copy(le).multiplyScalar(j).floor(),Z.copy(Ue).multiplyScalar(j).floor(),ne=nt;if(X!==0&&(B=G),x.bindFramebuffer(F.FRAMEBUFFER,B)&&x.drawBuffers(b,B),x.viewport(ie),x.scissor(Z),x.setScissorTest(ne),V){let me=I.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+P,me.__webglTexture,X)}else if(ge){let me=P;for(let Se=0;Se<b.textures.length;Se++){let Ee=I.get(b.textures[Se]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Se,Ee.__webglTexture,X,me)}}else if(b!==null&&X!==0){let me=I.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,me.__webglTexture,X)}q=-1};function ed(b){let P=I.get(b);return(P.__readFormat!==b.format||P.__readType!==b.type)&&(P.__readFormat=b.format,P.__readType=b.type,P.__formatReadable=A.textureFormatReadable(b.format),P.__typeReadable=A.textureTypeReadable(b.type)),P}this.readRenderTargetPixels=function(b,P,X,B,V,ge,ve,me=0){if(!(b&&b.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=I.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(Se=Se[ve]),Se){x.bindFramebuffer(F.FRAMEBUFFER,Se);try{let Ee=b.textures[me],qe=Ee.format,Ze=Ee.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+me);let be=ed(Ee);if(be.__formatReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(be.__typeReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=b.width-B&&X>=0&&X<=b.height-V&&F.readPixels(P,X,B,V,he.convert(qe),he.convert(Ze),ge)}finally{let Ee=re!==null?I.get(re).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(b,P,X,B,V,ge,ve,me=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=I.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(Se=Se[ve]),Se)if(P>=0&&P<=b.width-B&&X>=0&&X<=b.height-V){x.bindFramebuffer(F.FRAMEBUFFER,Se);let Ee=b.textures[me],qe=Ee.format,Ze=Ee.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+me);let be=ed(Ee);if(be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let rt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,rt),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),F.readPixels(P,X,B,V,he.convert(qe),he.convert(Ze),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Ct=re!==null?I.get(re).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,Ct);let _t=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Th(F,_t,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,rt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(rt),F.deleteSync(_t),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,P=null,X=0){let B=Math.pow(2,-X),V=Math.floor(b.image.width*B),ge=Math.floor(b.image.height*B),ve=P!==null?P.x:0,me=P!==null?P.y:0;z.setTexture2D(b,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,ve,me,V,ge),x.unbindTexture()},this.copyTextureToTexture=function(b,P,X=null,B=null,V=0,ge=0){let ve,me,Se,Ee,qe,Ze,be,rt,Ct,_t=b.isCompressedTexture?b.mipmaps[ge]:b.image;if(X!==null)ve=X.max.x-X.min.x,me=X.max.y-X.min.y,Se=X.isBox3?X.max.z-X.min.z:1,Ee=X.min.x,qe=X.min.y,Ze=X.isBox3?X.min.z:0;else{let wt=Math.pow(2,-V);ve=Math.floor(_t.width*wt),me=Math.floor(_t.height*wt),b.isDataArrayTexture?Se=_t.depth:b.isData3DTexture?Se=Math.floor(_t.depth*wt):Se=1,Ee=0,qe=0,Ze=0}B!==null?(be=B.x,rt=B.y,Ct=B.z):(be=0,rt=0,Ct=0);let dt=he.convert(P.format),Kt=he.convert(P.type),ye;P.isData3DTexture?(z.setTexture3D(P,0),ye=F.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(z.setTexture2DArray(P,0),ye=F.TEXTURE_2D_ARRAY):(z.setTexture2D(P,0),ye=F.TEXTURE_2D),x.activeTexture(F.TEXTURE0),x.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,P.flipY),x.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),x.pixelStorei(F.UNPACK_ALIGNMENT,P.unpackAlignment);let nn=x.getParameter(F.UNPACK_ROW_LENGTH),je=x.getParameter(F.UNPACK_IMAGE_HEIGHT),gn=x.getParameter(F.UNPACK_SKIP_PIXELS),Dn=x.getParameter(F.UNPACK_SKIP_ROWS),pi=x.getParameter(F.UNPACK_SKIP_IMAGES);x.pixelStorei(F.UNPACK_ROW_LENGTH,_t.width),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_t.height),x.pixelStorei(F.UNPACK_SKIP_PIXELS,Ee),x.pixelStorei(F.UNPACK_SKIP_ROWS,qe),x.pixelStorei(F.UNPACK_SKIP_IMAGES,Ze);let ar=b.isDataArrayTexture||b.isData3DTexture,ut=P.isDataArrayTexture||P.isData3DTexture;if(b.isDepthTexture){let wt=I.get(b),mi=I.get(P),pt=I.get(wt.__renderTarget),gi=I.get(mi.__renderTarget);x.bindFramebuffer(F.READ_FRAMEBUFFER,pt.__webglFramebuffer),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,gi.__webglFramebuffer);for(let or=0;or<Se;or++)ar&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,I.get(b).__webglTexture,V,Ze+or),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,I.get(P).__webglTexture,ge,Ct+or)),F.blitFramebuffer(Ee,qe,ve,me,be,rt,ve,me,F.DEPTH_BUFFER_BIT,F.NEAREST);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(V!==0||b.isRenderTargetTexture||I.has(b)){let wt=I.get(b),mi=I.get(P);x.bindFramebuffer(F.READ_FRAMEBUFFER,N),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,H);for(let pt=0;pt<Se;pt++)ar?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,wt.__webglTexture,V,Ze+pt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,wt.__webglTexture,V),ut?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,mi.__webglTexture,ge,Ct+pt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,mi.__webglTexture,ge),V!==0?F.blitFramebuffer(Ee,qe,ve,me,be,rt,ve,me,F.COLOR_BUFFER_BIT,F.NEAREST):ut?F.copyTexSubImage3D(ye,ge,be,rt,Ct+pt,Ee,qe,ve,me):F.copyTexSubImage2D(ye,ge,be,rt,Ee,qe,ve,me);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ut?b.isDataTexture||b.isData3DTexture?F.texSubImage3D(ye,ge,be,rt,Ct,ve,me,Se,dt,Kt,_t.data):P.isCompressedArrayTexture?F.compressedTexSubImage3D(ye,ge,be,rt,Ct,ve,me,Se,dt,_t.data):F.texSubImage3D(ye,ge,be,rt,Ct,ve,me,Se,dt,Kt,_t):b.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,be,rt,ve,me,dt,Kt,_t.data):b.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,be,rt,_t.width,_t.height,dt,_t.data):F.texSubImage2D(F.TEXTURE_2D,ge,be,rt,ve,me,dt,Kt,_t);x.pixelStorei(F.UNPACK_ROW_LENGTH,nn),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,je),x.pixelStorei(F.UNPACK_SKIP_PIXELS,gn),x.pixelStorei(F.UNPACK_SKIP_ROWS,Dn),x.pixelStorei(F.UNPACK_SKIP_IMAGES,pi),ge===0&&P.generateMipmaps&&F.generateMipmap(ye),x.unbindTexture()},this.initRenderTarget=function(b){I.get(b).__webglFramebuffer===void 0&&z.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?z.setTextureCube(b,0):b.isData3DTexture?z.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?z.setTexture2DArray(b,0):z.setTexture2D(b,0),x.unbindTexture()},this.resetState=function(){J=0,Y=0,re=null,x.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}});function es(i={},e=Ey){if(!i||typeof i!="object"||Array.isArray(i))throw TypeError("05 quality object required");let t={...e,...i};for(let[n,r]of Object.entries({longEdge:[640,960,1280],shadowMapSize:[128,256,512],samplesPerLamp:[1,4]}))if(!r.includes(t[n]))throw RangeError(`05 ${n}: supported values ${r.join(", ")}`);return Object.freeze({longEdge:t.longEdge,shadowMapSize:t.shadowMapSize,samplesPerLamp:t.samplesPerLamp})}function sf(i,e){if(!["landscape","portrait"].includes(i))throw RangeError("05 orientation");let t=e.longEdge,n=t*9/16;return i==="landscape"?{width:t,height:n}:{width:n,height:t}}var Ey,Kc=tt(()=>{Ey=Object.freeze({longEdge:1280,shadowMapSize:512,samplesPerLamp:4})});function af(i){if(!i?.fenceSync||!i.clientWaitSync||!i.deleteSync||!i.flush)throw Error("05 live frame gate requires WebGL2 sync");let e=null,t=0,n=0;return{get pending(){return e!==null},get status(){return{pending:e!==null,submitted:t,completed:n,maxFramesInFlight:1}},submit(){if(e)throw Error("05 frame already in flight");if(e=i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE,0),!e)throw Error("05 GPU fence allocation failed");t++,i.flush()},poll(){if(!e)return!0;let r=i.clientWaitSync(e,0,0);if(r===i.TIMEOUT_EXPIRED)return!1;if(r!==i.ALREADY_SIGNALED&&r!==i.CONDITION_SATISFIED)throw Error("05 GPU fence wait failed");return i.deleteSync(e),e=null,n++,!0},dispose(){e&&(i.deleteSync(e),e=null)}}}var of=tt(()=>{});function lf(i={}){if(typeof i.loadInputs!="function"||typeof i.connect!="function")throw TypeError("05 hybrid lifecycle needs loadInputs and connect");let e=i.fps??30,t=i.raf??(s=>requestAnimationFrame(s)),n=i.cancel??(s=>cancelAnimationFrame(s)),r=i.now??(()=>performance.now());return async function({container:a,signal:o,sceneId:l,orientation:c="landscape",onStatus:u=()=>{},onFrame:h,quality:d}={}){if(!a?.appendChild||!["landscape","portrait"].includes(c))throw TypeError("05 container/orientation required");if(o?.aborted)throw il();let f=es(d),g,_,m=!1,p=null,M=!0,R=!1,S=!1,v=!1,T=!0,w=!1,y=0,E=r(),C=-1/0,D=0,O=-1,G=[],N,H=null,J=c,Y=f,re=i.document??a.ownerDocument??globalThis.document,q=new AbortController,te=[],ie=[],Z={count:0,lastMessage:null},ne=re.createElement("canvas");ne.style.cssText="display:block;width:100%;height:100%;object-fit:contain",ne.setAttribute("aria-label","\u66F8\u5EAB 05 \u4E0B\u5C64"),a.appendChild(ne);let Le,Me,ke=new Promise((I,z)=>{Le=I,Me=z});ke.catch(()=>{});let W=()=>T&&re.hidden!==!0,j=()=>y+(w?(r()-E)/1e3:0),xe=I=>{try{I()}catch(z){ie.push(String(z))}},we=I=>{m?xe(I):te.push(I)},le=()=>{if(m||q.signal.aborted)throw il()};function Ue(I,z){u({phase:I,sceneId:l,quality:f,limits:g?.status,...z?{message:String(z),error:z}:{}})}function nt(){let I=r();w&&(y+=(I-E)/1e3),E=I,w=!m&&R&&v&&W(),!H&&(!W()||!w&&!M)&&(p!==null&&n(p),p=null),Oe()}function Oe(){!m&&g&&_&&p===null&&(H||W()&&(M||w))&&(p=t(St))}function Ge(){if(O>=D)return Promise.resolve();let I=D,z=new Promise((ae,oe)=>G.push({target:I,resolve:ae,reject:oe}));return z.catch(()=>{}),z}function Qe(I){for(let z of G.splice(0))z.reject(I)}function We(){if(!m){y=j(),w=!1,v=!1,m=!0,q.abort(),p!==null&&n(p),p=null,o?.removeEventListener("abort",We),re.removeEventListener?.("visibilitychange",nt),ne.removeEventListener("webglcontextlost",Tt);for(let I of te.reverse())xe(I);ne.remove(),Qe(il()),S||(S=!0,Me(il()))}}function ct(I){if(!m)try{Ue("error",I)}catch(z){Z.count++,Z.lastMessage=String(z)}finally{S||(S=!0,Me(I)),Qe(I),We()}}function Tt(I){I?.preventDefault(),ct(Error("05 WebGL context lost"))}function Zt(I){if(typeof h=="function")try{h(ne)}catch(oe){Z.count++,Z.lastMessage=String(oe)}le();let z=!R,ae=I===D;ae&&(z||I>O)&&(R=!0,Ue("ready"),le()),O=I;for(let oe=G.length-1;oe>=0;oe--)G[oe].target<=O&&G.splice(oe,1)[0].resolve();z&&ae&&(S=!0,Le(),nt())}function gt(){J!==c&&(g.setOrientation(c),J=c),Y!==f&&(g.setQuality(f)&&(_.shadowMap.needsUpdate=!0),Y=f),_.setSize(g.size.width,g.size.height,!1)}function St(){if(p=null,!(m||!g||!_)){try{if(_.getContext().isContextLost())throw Error("05 WebGL context lost");if(H){if(N.poll()){let z=H;H=null,Zt(z.revision)}Oe();return}if(!W())return;let I=r();if(M||w&&I-C>=1e3/e-2){let z=D;if(M&&gt(),g.update(j()),g.render(_),le(),_.getContext().isContextLost())throw Error("05 WebGL context lost");N.submit(),H={revision:z},C=I,M=D!==z}}catch(I){ct(I);return}Oe()}}function F(I){if(typeof I!="boolean")throw TypeError("05 playing boolean");m||(y=j(),w=!1,v=I,E=r(),nt())}function Ot(I){if(typeof I!="boolean")throw TypeError("05 visible boolean");m||(y=j(),w=!1,T=I,E=r(),nt())}function et(){m||(D++,M=!0,Oe())}async function A(I){if(!["landscape","portrait"].includes(I))throw RangeError("05 orientation");return le(),c===I||g?.prepareOrientation&&(await g.prepareOrientation(I),le(),c===I)||(c=I,D++,M=!0,Oe()),Ge()}async function x(I){le();let z=es(I,f);return JSON.stringify(z)===JSON.stringify(f)||(f=z,D++,M=!0,Oe()),Ge()}o?.addEventListener("abort",We,{once:!0}),re.addEventListener?.("visibilitychange",nt),ne.addEventListener("webglcontextlost",Tt);let k={ready:ke,dispose:We,setOrientation:A,setPlaying:F,setVisible:Ot,resize:x,get status(){return{ready:R,playing:w,requestedPlaying:v,visible:W(),seconds:j(),orientation:c,quality:f,frameGate:N?.status,disposed:m,cleanupErrors:[...ie],callbackErrors:{...Z},limits:g?.status}}};try{Ue("loading"),le();let I=await i.loadInputs({signal:q.signal,own:we,fetch:i.fetch});le();let z=await i.connect({...I,orientation:c,quality:f,signal:q.signal,invalidate:et});return we(()=>z.dispose()),g=z,le(),_=(i.createRenderer??(ae=>new el(ae)))({canvas:ne,antialias:!0,alpha:!1,preserveDrawingBuffer:!0}),we(()=>{_.renderLists?.dispose(),_.dispose(),_.forceContextLoss?.()}),le(),N=(i.createFrameGate??af)(_.getContext()),we(()=>N.dispose()),_.setPixelRatio(1),_.setSize(g.size.width,g.size.height,!1),_.outputColorSpace=xt,_.toneMapping=Ki,_.toneMappingExposure=2**I.data.scene.view_settings.exposure,_.shadowMap.enabled=!1,_.debug&&(_.debug.checkShaderErrors=!0,_.debug.onShaderError=(ae,oe,K,ee)=>{throw Error(ae.getProgramInfoLog(oe)+" "+ae.getShaderInfoLog(K)+" "+ae.getShaderInfoLog(ee))}),Oe(),k}catch(I){throw ct(I),I}}}var il,cf=tt(()=>{Wt();Kc();of();il=()=>new DOMException("05 realtime disposed or aborted","AbortError")});function jc(i,e){if(e===vc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===$r||e===Xs){let t=i.getIndex();if(t===null){let s=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)s.push(o);i.setIndex(s),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,r=[];if(e===$r)for(let s=1;s<=n;s++)r.push(t.getX(0)),r.push(t.getX(s)),r.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(r.push(t.getX(s)),r.push(t.getX(s+1)),r.push(t.getX(s+2))):(r.push(t.getX(s+2)),r.push(t.getX(s+1)),r.push(t.getX(s)));return r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(r),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var uf=tt(()=>{Wt()});function df(i){let e=new Map,t=new Map,n=i.clone();return hf(i,n,function(r,s){e.set(s,r),t.set(r,s)}),n.traverse(function(r){if(!r.isSkinnedMesh)return;let s=r,a=e.get(r),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function hf(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)hf(i.children[n],e.children[n],t)}var ff=tt(()=>{Wt()});function Ay(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Rt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function Iy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Yi({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Lt})),i.DefaultMaterial}function nr(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Yn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ny(i,e,t){let n=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(r=!0),h.COLOR_0!==void 0&&(s=!0),n&&r&&s)break}if(!n&&!r&&!s)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;a.push(d)}if(r){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;o.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(i.morphAttributes.position=u),r&&(i.morphAttributes.normal=h),s&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function Py(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,r=t.length;n<r;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Ly(i){let e,t=i.extensions&&i.extensions[$e.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+eu(t.attributes):e=i.indices+":"+eu(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,r=i.targets.length;n<r;n++)e+=":"+eu(i.targets[n]);return e}function eu(i){let e="",t=Object.keys(i).sort();for(let n=0,r=t.length;n<r;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Tu(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Fy(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function Uy(i,e,t){let n=e.attributes,r=new pn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(r.set(new U(l[0],l[1],l[2]),new U(c[0],c[1],c[2])),o.normalized){let u=Tu(ts[o.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new U,l=new U;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){let _=Tu(ts[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(o)}i.boundingBox=r;let a=new cn;r.getCenter(a.center),a.radius=r.min.distanceTo(r.max)/2,i.boundingSphere=a}function _f(i,e,t){let n=e.attributes,r=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=Mu[a]||a.toLowerCase();o in i.attributes||r.push(s(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});r.push(a)}return Ye.workingColorSpace!==sn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ye.workingColorSpace}" not supported.`),Yn(i,e),Uy(i,e,t),Promise.all(r).then(function(){return e.targets!==void 0?Ny(i,e.targets,t):i})}var rl,$e,tu,nu,iu,ru,su,au,ou,lu,cu,uu,du,hu,fu,pu,mu,gu,sl,_u,xf,Zs,pf,xu,yu,vu,Su,al,Ry,bu,xn,ts,mf,gf,Jc,Mu,Ci,Cy,Qc,Dy,wu,yf=tt(()=>{Wt();uf();ff();rl=class extends Hn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new ru(t)}),this.register(function(t){return new su(t)}),this.register(function(t){return new pu(t)}),this.register(function(t){return new mu(t)}),this.register(function(t){return new gu(t)}),this.register(function(t){return new ou(t)}),this.register(function(t){return new lu(t)}),this.register(function(t){return new cu(t)}),this.register(function(t){return new uu(t)}),this.register(function(t){return new iu(t)}),this.register(function(t){return new du(t)}),this.register(function(t){return new au(t)}),this.register(function(t){return new fu(t)}),this.register(function(t){return new hu(t)}),this.register(function(t){return new tu(t)}),this.register(function(t){return new sl(t,$e.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new sl(t,$e.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new _u(t)})}load(e,t,n,r){let s=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=ui.extractUrlBase(e);a=ui.resolveURL(c,this.path)}else a=ui.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Vr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(u){t(u),s.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let s,a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===xf){try{a[$e.KHR_BINARY_GLTF]=new xu(e)}catch(h){r&&r(h);return}s=JSON.parse(a[$e.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new wu(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case $e.KHR_MATERIALS_UNLIT:a[h]=new nu;break;case $e.KHR_DRACO_MESH_COMPRESSION:a[h]=new yu(s,this.dracoLoader);break;case $e.KHR_TEXTURE_TRANSFORM:a[h]=new vu;break;case $e.KHR_MESH_QUANTIZATION:a[h]=new Su;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,s){n.parse(e,t,r,s)})}};$e={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},tu=class{constructor(e){this.parser=e,this.name=$e.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,r=t.cache.get(n);if(r)return r;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new Ne(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],sn);let h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ds(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new $i(u),c.distance=h;break;case"spot":c=new Fs(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Yn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(n,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},nu=class{constructor(){this.name=$e.KHR_MATERIALS_UNLIT}getMaterialType(){return Nn}extendParams(e,t,n){let r=[];e.color=new Ne(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],sn),e.opacity=a[3]}s.baseColorTexture!==void 0&&r.push(n.assignTexture(e,"map",s.baseColorTexture,xt))}return Promise.all(r)}},iu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},ru=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Xe(s,s)}return Promise.all(r)}},su=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},au=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(r)}},ou=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SHEEN}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],sn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,xt)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(r)}},lu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(r)}},cu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_VOLUME}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(s[0],s[1],s[2],sn),Promise.all(r)}},uu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IOR}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},du=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(s[0],s[1],s[2],sn),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,xt)),Promise.all(r)}},hu=class{constructor(e){this.parser=e,this.name=$e.EXT_MATERIALS_BUMP}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(r)}},fu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?At:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(r)}},pu=class{constructor(e){this.parser=e,this.name=$e.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let s=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}},mu=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=r.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},gu=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=r.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},sl=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let r=n.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let l=r.byteOffset||0,c=r.byteLength||0,u=r.count,h=r.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,d,r.mode,r.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(f),u,h,d,r.mode,r.filter),f})})}else return null}},_u=class{constructor(e){this.name=$e.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let c of r.primitives)if(c.mode!==xn.TRIANGLES&&c.mode!==xn.TRIANGLE_STRIP&&c.mode!==xn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let g of h){let _=new Pe,m=new U,p=new ln,M=new U(1,1,1),R=new ws(g.geometry,g.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,v),l.SCALE&&M.fromBufferAttribute(l.SCALE,v),R.setMatrixAt(v,_.compose(m,p,M));let S=null;for(let v in l)if(v==="_COLOR_0"){let T=l[v];R.instanceColor=new ri(T.array,T.itemSize,T.normalized)}else if(v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"){if(S===null){let w=R.geometry;S=new Dt,S.name=w.name;for(let y in w.attributes)S.setAttribute(y,w.attributes[y]);for(let y in w.morphAttributes)S.morphAttributes[y]=w.morphAttributes[y];w.index!==null&&S.setIndex(w.index),S.morphTargetsRelative=w.morphTargetsRelative;for(let y of w.groups)S.addGroup(y.start,y.count,y.materialIndex);w.boundingBox!==null&&(S.boundingBox=w.boundingBox.clone()),w.boundingSphere!==null&&(S.boundingSphere=w.boundingSphere.clone()),S.drawRange.start=w.drawRange.start,S.drawRange.count=w.drawRange.count,S.userData=Object.assign({},w.userData),R.geometry=S}let T=l[v];S.setAttribute(v,new ri(T.array,T.itemSize,T.normalized))}vt.prototype.copy.call(R,g),this.parser.assignFinalMaterial(R),f.push(R)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},xf="glTF",Zs=12,pf={JSON:1313821514,BIN:5130562},xu=class{constructor(e){this.name=$e.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Zs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==xf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let r=this.header.length-Zs,s=new DataView(e,Zs),a=0;for(;a<r;){let o=s.getUint32(a,!0);a+=4;let l=s.getUint32(a,!0);if(a+=4,l===pf.JSON){let c=new Uint8Array(e,Zs+a,o);this.content=n.decode(c)}else if(l===pf.BIN){let c=Zs+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},yu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=$e.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let u in a){let h=Mu[u]||u.toLowerCase();o[h]=a[u]}for(let u in e.attributes){let h=Mu[u]||u.toLowerCase();if(a[u]!==void 0){let d=n.accessors[e.attributes[u]],f=ts[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){r.decodeDracoFile(u,function(f){for(let g in f.attributes){let _=f.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}h(f)},o,c,sn,d)})})}},vu=class{constructor(){this.name=$e.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),r=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*r,e.offset.x,-e.repeat.x*r,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Su=class{constructor(){this.name=$e.KHR_MESH_QUANTIZATION}},al=class extends zn{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let a=0;a!==r;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=r-t,h=(n-t)/u,d=h*h,f=d*h,g=e*c,_=g-c,m=-2*f+3*d,p=f-d,M=1-m,R=p-d+h;for(let S=0;S!==o;S++){let v=a[_+S+o],T=a[_+S+l]*u,w=a[g+S+o],y=a[g+S]*u;s[S]=M*v+R*T+m*w+p*y}return s}},Ry=new ln,bu=class extends al{interpolate_(e,t,n,r){let s=super.interpolate_(e,t,n,r);return Ry.fromArray(s).normalize().toArray(s),s}},xn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},ts={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},mf={9728:yt,9729:lt,9984:co,9985:Xr,9986:Ji,9987:on},gf={33071:Vt,33648:wr,10497:In},Jc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Mu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ci={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Cy={CUBICSPLINE:void 0,LINEAR:Gi,STEP:zi},Qc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};Dy=new Pe,wu=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Ay,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);r=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&r<17||s&&a<98?this.textureLoader=new Ps(this.options.manager):this.textureLoader=new Us(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][r.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:r.asset,parser:n,userData:{}};return nr(s,o,r),Yn(o,r),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){let a=t[r].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let r=0,s=e.length;r<s;r++){let a=e[r];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),s=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,u]of a.children.entries())s(u,o.children[c])};return s(n,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let s=e(t[r]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,r=this.cache.get(n);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[$e.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(s,a){n.load(ui.resolveURL(t.uri,r.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let r=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+r)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let a=Jc[r.type],o=ts[r.componentType],l=r.normalized===!0,c=new o(r.count*a);return Promise.resolve(new Ft(c,a,l))}let s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(a){let o=a[0],l=Jc[r.type],c=ts[r.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=r.byteOffset||0,f=r.bufferView!==void 0?n.bufferViews[r.bufferView].byteStride:void 0,g=r.normalized===!0,_,m;if(f&&f!==h){let p=Math.floor(d/f),M="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+p+":"+r.count,R=t.cache.get(M);R||(_=new c(o,p*f,r.count*f/u),R=new Pr(_,f/u),t.cache.add(M,R)),m=new Lr(R,l,d%f/u,g)}else o===null?_=new c(r.count*l):_=new c(o,d,r.count*l),m=new Ft(_,l,g);if(r.sparse!==void 0){let p=Jc.SCALAR,M=ts[r.sparse.indices.componentType],R=r.sparse.indices.byteOffset||0,S=r.sparse.values.byteOffset||0,v=new M(a[1],R,r.sparse.count*p),T=new c(a[2],S,r.sparse.count*l);o!==null&&(m=new Ft(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let w=0,y=v.length;w<y;w++){let E=v[w];if(m.setX(E,T[w*l]),l>=2&&m.setY(E,T[w*l+1]),l>=3&&m.setZ(E,T[w*l+2]),l>=4&&m.setW(E,T[w*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){let r=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);let d=(s.samplers||{})[a.sampler]||{};return u.magFilter=mf[d.magFilter]||lt,u.minFilter=mf[d.minFilter]||on,u.wrapS=gf[d.wrapS]||In,u.wrapT=gf[d.wrapT]||In,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==yt&&u.minFilter!==lt,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let a=r.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){let m=new Pt(_);m.needsUpdate=!0,d(m)}),t.load(ui.resolveURL(h,s.path),g,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),Yn(h,a),h.userData.mimeType=a.mimeType||Fy(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,r){let s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[$e.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[$e.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=s.associations.get(a);a=s.extensions[$e.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new kr,un.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Ur,un.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(r||s||a){let o="ClonedMaterial:"+n.uuid+":";r&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Yi}loadMaterial(e){let t=this,n=this.json,r=this.extensions,s=n.materials[e],a,o={},l=s.extensions||{},c=[];if(l[$e.KHR_MATERIALS_UNLIT]){let h=r[$e.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,s,t))}else{let h=s.pbrMetallicRoughness||{};if(o.color=new Ne(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],sn),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,xt)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=bt);let u=s.alphaMode||Qc.OPAQUE;if(u===Qc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Qc.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Nn&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Xe(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;o.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&a!==Nn&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Nn){let h=s.emissiveFactor;o.emissive=new Ne().setRGB(h[0],h[1],h[2],sn)}return s.emissiveTexture!==void 0&&a!==Nn&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,xt)),Promise.all(c).then(function(){let h=new a(o);return s.name&&(h.name=s.name),Yn(h,s),t.associations.set(h,{materials:e}),s.extensions&&nr(r,h,s),h})}createUniqueName(e){let t=ht.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function s(o){return n[$e.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return _f(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],u=Ly(c),h=r[u];if(h)a.push(h.promise);else{let d;c.extensions&&c.extensions[$e.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=_f(new Dt,c,t),c.mode===xn.TRIANGLE_STRIP?d=d.then(f=>jc(f,Xs)):c.mode===xn.TRIANGLE_FAN&&(d=d.then(f=>jc(f,$r))),r[u]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let u=a[l].material===void 0?Iy(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,g=u.length;f<g;f++){let _=u[f],m=a[f],p,M=c[f];if(m.mode===xn.TRIANGLES||m.mode===xn.TRIANGLE_STRIP||m.mode===xn.TRIANGLE_FAN||m.mode===void 0){let R=s.isSkinnedMesh===!0,S=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");R&&S===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=R&&S?new Ms(_,M):new Et(_,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===xn.LINES)p=new Es(_,M);else if(m.mode===xn.LINE_STRIP)p=new qi(_,M);else if(m.mode===xn.LINE_LOOP)p=new As(_,M);else if(m.mode===xn.POINTS)p=new Rs(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Py(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Yn(p,s),m.extensions&&nr(r,p,m),t.assignFinalMaterial(p),h.push(p)}for(let f=0,g=h.length;f<g;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&nr(r,h[0],s),h[0];let d=new Rn;s.extensions&&nr(r,d,s),t.associations.set(d,{meshes:e});for(let f=0,g=h.length;f<g;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Nt(Tc.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type==="orthographic"&&(t=new Wn(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Yn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let r=0,s=t.joints.length;r<s;r++)n.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(r){let s=r.pop(),a=r,o=[],l=[];for(let c=0,u=a.length;c<u;c++){let h=a[c];if(h){o.push(h);let d=new Pe;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ts(o,l)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,d=r.channels.length;h<d;h++){let f=r.channels[h],g=r.samplers[f.sampler],_=f.target,m=_.node,p=r.parameters!==void 0?r.parameters[g.input]:g.input,M=r.parameters!==void 0?r.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",M)),c.push(g),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],g=h[2],_=h[3],m=h[4],p=[];for(let R=0,S=d.length;R<S;R++){let v=d[R],T=f[R],w=g[R],y=_[R],E=m[R];if(v===void 0)continue;v.updateMatrix&&v.updateMatrix();let C=n._createAnimationTracks(v,T,w,y,E);if(C)for(let D=0;D<C.length;D++)p.push(C[D])}let M=new Br(s,void 0,p);return Yn(M,r),M})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency("mesh",r.mesh).then(function(s){let a=n._getNodeRef(n.meshCache,r.mesh,s);return r.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=r.weights.length;l<c;l++)o.morphTargetInfluences[l]=r.weights[l]}),a})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=r.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));let l=r.skin===void 0?Promise.resolve(null):n.getDependency("skin",r.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Dy)});for(let f=0,g=h.length;f<g;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,g=h[0];u.pivot=new U().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],a=s.name?r.createUniqueName(s.name):"",o=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(s.isBone===!0?u=new Fr:c.length>1?u=new Rn:c.length===1?u=c[0]:u=new vt,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=a),Yn(u,s),s.extensions&&nr(n,u,s),s.matrix!==void 0){let h=new Pe;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!r.associations.has(u))r.associations.set(u,{});else if(s.mesh!==void 0&&r.meshCache.refs[s.mesh]>1){let h=r.associations.get(u);r.associations.set(u,{...h})}return r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,s=new Rn;n.name&&(s.name=r.createUniqueName(n.name)),Yn(s,n),n.extensions&&nr(t,s,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(r.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++){let d=l[u];d.parent!==null?s.add(df(d)):s.add(d)}let c=u=>{let h=new Map;for(let[d,f]of r.associations)(d instanceof un||d instanceof Pt)&&h.set(d,f);return u.traverse(d=>{let f=r.associations.get(d);f!=null&&h.set(d,f)}),h};return r.associations=c(s),s})}_createAnimationTracks(e,t,n,r,s){let a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ci[s.path]===Ci.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let u;switch(Ci[s.path]){case Ci.weights:u=oi;break;case Ci.rotation:u=Gn;break;case Ci.translation:case Ci.scale:u=ci;break;default:n.itemSize===1?u=oi:u=ci;break}let h=r.interpolation!==void 0?Cy[r.interpolation]:Gi,d=this._getArrayFromAccessor(n);for(let f=0,g=l.length;f<g;f++){let _=new u(l[f]+"."+Ci[s.path],t.array,d,h);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Tu(t.constructor),r=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)r[s]=t[s]*n;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let r=this instanceof Gn?bu:al;return new r(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});async function Sf({signal:i,own:e,fetch:t=globalThis.fetch}){let n=()=>{if(i.aborted)throw new DOMException("05 load aborted","AbortError")},r=async(T,w="json")=>{let y=await t(T,{signal:i});if(!y.ok)throw Error("05 input "+T+": "+y.status);let E=await y[w]();return n(),E},s=async(T,w="json")=>{if(typeof DecompressionStream!="function")return r(T,w);let y=await t(String(T)+".gzb",{signal:i});if(!y.ok)return r(T,w);let E=new Uint8Array(await y.arrayBuffer());if(n(),E[0]===31&&E[1]===139&&(E=new Uint8Array(await new Response(new Blob([E]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())),n(),w==="arrayBuffer")return E.buffer.slice(E.byteOffset,E.byteOffset+E.byteLength);let C=new TextDecoder().decode(E);return w==="text"?C:JSON.parse(C)},[a,o,l,c,u,h,d,f,g,_,m]=await Promise.all([s(di.dynamic+"dynamic-reference.json"),s(di.dynamic+"scene-reference.json"),s(di.dynamic+"dynamic-material-uv-mapping.json"),r(Ks("reference/dynamic-material-inputs.json")),r(Ks("reference/water-object-coordinate.json")),r(Ks("reference/preview-motion-reference.json")),r(Ks("reference/generated-covers.json"),"text"),s(Ks("reference/generated-covers.f32"),"arrayBuffer"),s(di.hybrid+"lights-compact.json"),r(di.hybrid+"views.json"),s(di.hybrid+"look-agx-mhc-srgb-65.rgb8","arrayBuffer")]);if(g.source_sha256!==a.source_sha256||o.source_sha256!==a.source_sha256)throw Error("05 hybrid source mismatch");let p={dynamic:a,scene:o,dynamicMapping:l,dynamicInputs:c,water:u,motion:h,generatedManifest:d,generatedBuffer:f,lights:g,views:_,lut:m},M=await s(di.dynamic+"05-lower-C-dynamic.glb","arrayBuffer"),R=await new rl().parseAsync(M,di.dynamic);n();let S=new Set,v=new Set;return R.scene.traverse(T=>{if(T.isMesh){S.add(T.geometry);for(let w of Array.isArray(T.material)?T.material:[T.material])v.add(w)}}),e(()=>{for(let T of[...S,...v])T.dispose()}),{data:p,dynamicGltf:R,loadView:T=>Oy({orientation:T,views:_,get:r,check:n,own:e})}}async function bf(i){return new Uint8Array(await new Response(new Blob([i]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())}function Mf(i,e){if(i.length!==2*e)throw Error("05 transport size");let t=new Uint16Array(e);for(let n=0;n<e;n++)t[n]=i[n]|i[e+n]<<8;return t}async function ky(i,e,t,n){let r=Mf(await bf(i),t*n),s=new Float32Array(t*n),a=1/e.zFar,o=1/e.zNear;for(let l=0;l<n;l++){let c=0;for(let u=0,h=l*t;u<t;u++,h++)c=c+r[h]&65535,s[h]=c?1/(a+(c-1)/65534*(o-a)):0}return s}async function Oy({orientation:i,views:e,get:t,check:n,own:r}){let s=e.views?.[i];if(!s)throw Error(`05 ${i} clean plate not produced yet`);let a=di.hybrid+s.directory+"-",o=await t(a+"view.json");if(o.orientation!==i)throw Error("05 plate orientation mismatch");let l=vf?o.depth.transport:null,[c,u]=await Promise.all([t(a+o.colour.file,"blob"),t(a+(l?l.file:o.depth.file),"arrayBuffer")]);if(l&&u.byteLength!==l.bytes)throw Error("05 plate depth transport bytes");let h=l?await ky(u,l,o.width,o.height):new Float32Array(u);if(n(),h.length!==o.width*o.height)throw Error("05 plate depth bytes");let d=await createImageBitmap(c,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"});n(),r(()=>d.close());let f=null;if(s.reflection){let g=await t(a+s.reflection.file);if(g.orientation!==i)throw Error("05 reflection orientation mismatch");let _=vf?g.transport:null,m=await t(a+(_?_.file:g.file),"arrayBuffer");if(m.byteLength!==(_?_.bytes:g.bytes))throw Error("05 reflection bytes");let p=_?Mf(await bf(m),g.bytes/2):new Uint16Array(m);n(),f={info:g,data:p}}return{view:o,bitmap:d,depth:h,reflection:f}}var di,Ks,vf,Tf=tt(()=>{yf();di=Object.freeze({dynamic:new URL("./shoko-v1-w1-05-dyn-",__shokoScript).href,hybrid:new URL("./shoko-v1-w1-05-hyb-",__shokoScript).href}),Ks=i=>new URL("./shoko-v1-w1-05-ref-"+i.replace("reference/",""),__shokoScript);vf=typeof DecompressionStream=="function"});function Ef(i){if(i.schema!=="05-compact-lights-v2"||!i.lights.length)throw Error("05 hybrid light contract v2 required");return i.lights.map(e=>{let t=e.properties,n=i.node_trees[e.node_tree],r=n.nodes.find(c=>c.type==="ShaderNodeEmission");if(!["POINT","AREA"].includes(e.type)||!t.normalize||t.use_temperature||t.use_custom_distance||!r||n.nodes.length!==2||n.links.length!==1)throw Error("05 unsupported original light "+e.name);if(e.type==="AREA"&&(t.shape!=="DISK"||Math.abs(t.spread-Math.PI)>1e-6))throw Error("05 original DISK required");let s=By.clone().multiply(new Pe().set(...e.matrix_world)),a=new U().setFromMatrixPosition(s),o=new U().setFromMatrixColumn(s,2).normalize(),l=e.color.map((c,u)=>c*wf(r,"Color")[u]*wf(r,"Strength")*2**t.exposure);return{name:e.name,type:e.type,position:a,backward:o,color:l,intensity:e.energy/(e.type==="POINT"?4*Math.PI:Math.PI),power:e.energy,source:e}})}var By,wf,Af=tt(()=>{Wt();By=new Pe().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1),wf=(i,e)=>{let t=i.inputs.find(n=>n.name===e);if(!t||t.linked)throw Error("05 light constant missing: "+e);return t.default_value}});var hi,ns=tt(()=>{hi=`
uint sbRot(uint x, uint k) { return (x << k) | (x >> (32u-k)); }
uint sbFinal(uint a, uint b, uint c) {
 c^=b; c-=sbRot(b,14u); a^=c; a-=sbRot(c,11u);
 b^=a; b-=sbRot(a,25u); c^=b; c-=sbRot(b,16u);
 a^=c; a-=sbRot(c,4u); b^=a; b-=sbRot(a,14u); c^=b; c-=sbRot(b,24u); return c;
}
uint sbHash2(uint x,uint y) { uint s=0xdeadbeefu+8u+13u; return sbFinal(s+x,s+y,s); }
uint sbHash3(ivec3 v) { uint s=0xdeadbeefu+12u+13u; return sbFinal(s+uint(v.x),s+uint(v.y),s+uint(v.z)); }
float sbHashFloat2(float x,float y) { return float(sbHash2(floatBitsToUint(x),floatBitsToUint(y)))*(1.0/4294967295.0); }
vec3 sbOffset(float seed) { return 100.0+100.0*vec3(sbHashFloat2(seed,0.0),sbHashFloat2(seed,1.0),sbHashFloat2(seed,2.0)); }
float sbGrad(uint h,vec3 p) {
 h &= 15u; float u=h<8u?p.x:p.y; float v=h<4u?p.y:((h==12u||h==14u)?p.x:p.z);
 return ((h&1u)!=0u?-u:u)+((h&2u)!=0u?-v:v);
}
float sbFade(float t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float sbSignedNoise(vec3 p) {
 // C/C++ fmod preserves sign (GLSL mod does not). Preserve Cycles' large-coordinate correction.
 vec3 correction=0.5*step(vec3(1000000.0),abs(p));
 p=p-trunc(p/100000.0)*100000.0+correction;
 ivec3 k=ivec3(floor(p)); vec3 f=p-floor(p); vec3 t=vec3(sbFade(f.x),sbFade(f.y),sbFade(f.z));
 float a=sbGrad(sbHash3(k),f),b=sbGrad(sbHash3(k+ivec3(1,0,0)),f-vec3(1,0,0));
 float c=sbGrad(sbHash3(k+ivec3(0,1,0)),f-vec3(0,1,0)),d=sbGrad(sbHash3(k+ivec3(1,1,0)),f-vec3(1,1,0));
 float e=sbGrad(sbHash3(k+ivec3(0,0,1)),f-vec3(0,0,1)),g=sbGrad(sbHash3(k+ivec3(1,0,1)),f-vec3(1,0,1));
 float h=sbGrad(sbHash3(k+ivec3(0,1,1)),f-vec3(0,1,1)),i=sbGrad(sbHash3(k+ivec3(1,1,1)),f-vec3(1,1,1));
 return 0.982*((1.0-t.z)*((1.0-t.y)*(a*(1.0-t.x)+b*t.x)+t.y*(c*(1.0-t.x)+d*t.x))
              +t.z*((1.0-t.y)*(e*(1.0-t.x)+g*t.x)+t.y*(h*(1.0-t.x)+i*t.x)));
}
float sbFbm(vec3 p,float detail,float roughness,float lacunarity) {
 float fs=1.0,amp=1.0,maxamp=0.0,sum=0.0; detail=clamp(detail,0.0,15.0); roughness=max(roughness,0.0);
 for(int i=0;i<16;i++) { if(i>int(detail))break; sum+=sbSignedNoise(fs*p)*amp; maxamp+=amp; amp*=roughness; fs*=lacunarity; }
 float base=0.5*sum/maxamp+0.5,rmd=detail-floor(detail);
 if(rmd!=0.0) { float sum2=sum+sbSignedNoise(fs*p)*amp; return mix(base,0.5*sum2/(maxamp+amp)+0.5,rmd); }
 return base;
}
vec3 sbNoiseColor(vec3 p,float detail,float roughness,float lacunarity) {
 return vec3(sbFbm(p,detail,roughness,lacunarity),sbFbm(p+sbOffset(3.0),detail,roughness,lacunarity),sbFbm(p+sbOffset(4.0),detail,roughness,lacunarity));
}
`});function tn(i,e,t){if(i.split(e).length!==2)throw Error(`Shader contract changed: ${e}`);return i.replace(e,t)}function Eu(i,e){if(e.properties.color_mode!=="RGB"||!["EASE","LINEAR"].includes(e.properties.interpolation))throw Error("Unsupported ramp mode");let t=e.elements,n=`vec3 ${i}(float x) {
`;for(let r=1;r<t.length;r++){let s=`clamp((x-${at(t[r-1].position)})/${at(t[r].position-t[r-1].position)},0.0,1.0)`;e.properties.interpolation==="EASE"&&(s=`smoothstep(0.0,1.0,${s})`),n+=`if(x<=${at(t[r].position)})return mix(${js(t[r-1].color)},${js(t[r].color)},${s});
`}return n+`return ${js(t.at(-1).color)}; }
`}var at,js,Fe,is,Js=tt(()=>{Wt();ns();at=i=>{if(!Number.isFinite(i))throw Error("Non-finite shader constant");return Number(i).toPrecision(10).replace(/e\+/,"e")},js=i=>`vec3(${i.slice(0,3).map(at).join(",")})`,Fe=(i,e)=>{let t=i.inputs.find(n=>n.identifier===e||n.name===e);if(!t||t.linked)throw Error(`${i.name}.${e}: expected saved constant`);return t.default_value};is=`
vec3 sbBump(vec3 N,vec3 dx,vec3 dy,float hc,float hx,float hy,float width,float strength,float distance) {
 vec3 Rx=cross(dy,N),Ry=cross(N,dx);float det=dot(dx,Rx);
 vec3 grad=(hx-hc)*Rx+(hy-hc)*Ry;
 vec3 outN=width*abs(det)*N-distance*sign(det)*grad;
 if(dot(outN,outN)==0.0)return N;
 return normalize(mix(N,normalize(outN),max(strength,0.0)));
}
`});var Rf,Cf=tt(()=>{Rf={"Binding cover 02":{nodes:[{name:"Principled BSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!1,default_value:[.5699999928474426,.5400000214576721,.4300000071525574,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.6800000071525574},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"Material Output",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}}],links:[{from_node:"Principled BSDF",from_socket:"BSDF",from_index:0,to_node:"Material Output",to_socket:"Surface",to_index:0}]},"Binding cover 01":{nodes:[{name:"Principled BSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!1,default_value:[.3799999952316284,.36000001430511475,.28999999165534973,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.6800000071525574},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"Material Output",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}}],links:[{from_node:"Principled BSDF",from_socket:"BSDF",from_index:0,to_node:"Material Output",to_socket:"Surface",to_index:0}]},"Dark warm rail metal":{nodes:[{name:"Principled BSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!1,default_value:[.057999998331069946,.061000000685453415,.057999998331069946,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:.699999988079071},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.3100000023841858},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"Material Output",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}}],links:[{from_node:"Principled BSDF",from_socket:"BSDF",from_index:0,to_node:"Material Output",to_socket:"Surface",to_index:0}]},"V3 Binding cover 2":{nodes:[{name:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!1,default_value:[.6800000071525574,.6600000262260437,.5899999737739563,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.7300000190734863},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.2199999988079071},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"\u30DE\u30C6\u30EA\u30A2\u30EB\u51FA\u529B",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}},{name:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:240},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:2},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"\u30D0\u30F3\u30D7",type:"ShaderNodeBump",inputs:[{index:0,name:"Strength",identifier:"Strength",type:"NodeSocketFloatFactor",linked:!1,default_value:.30000001192092896},{index:1,name:"Distance",identifier:"Distance",type:"NodeSocketFloat",linked:!1,default_value:.000699999975040555},{index:2,name:"Filter Width",identifier:"Filter Width",type:"NodeSocketFloatPixel",linked:!1,default_value:.10000000149011612},{index:3,name:"Height",identifier:"Height",type:"NodeSocketFloat",linked:!0,default_value:1},{index:4,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]}],properties:{invert:!1}}],links:[{from_node:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",from_socket:"BSDF",from_index:0,to_node:"\u30DE\u30C6\u30EA\u30A2\u30EB\u51FA\u529B",to_socket:"Surface",to_index:0},{from_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",from_socket:"Fac",from_index:0,to_node:"\u30D0\u30F3\u30D7",to_socket:"Height",to_index:3},{from_node:"\u30D0\u30F3\u30D7",from_socket:"Normal",from_index:0,to_node:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",to_socket:"Normal",to_index:6}]},"V11 sewn paper 0":{nodes:[{name:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!0,default_value:[.7099999785423279,.6600000262260437,.5299999713897705,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.8299999833106995},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.1599999964237213},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"\u30DE\u30C6\u30EA\u30A2\u30EB\u51FA\u529B",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}},{name:"\u30C6\u30AF\u30B9\u30C1\u30E3\u5EA7\u6A19",type:"ShaderNodeTexCoord",inputs:[],properties:{from_instancer:!1}},{name:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:1},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:2},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97",type:"ShaderNodeVectorMath",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"Vector",identifier:"Vector_001",type:"NodeSocketVector",linked:!1,default_value:[4100,4,13]},{index:2,name:"Vector",identifier:"Vector_002",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:1}],properties:{operation:"MULTIPLY"}},{name:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3.001",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:1},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:2},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97.001",type:"ShaderNodeVectorMath",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"Vector",identifier:"Vector_001",type:"NodeSocketVector",linked:!1,default_value:[160,12,10]},{index:2,name:"Vector",identifier:"Vector_002",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:1}],properties:{operation:"MULTIPLY"}},{name:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7",type:"ShaderNodeValToRGB",inputs:[{index:0,name:"Factor",identifier:"Fac",type:"NodeSocketFloatFactor",linked:!0,default_value:.5}],properties:{},color_ramp:{properties:{interpolation:"LINEAR",hue_interpolation:"NEAR",color_mode:"RGB"},elements:[{position:.2199999988079071,color:[.47939199209213257,.4540799856185913,.39007997512817383,1]},{position:.4300000071525574,color:[.749049961566925,.7095000147819519,.609499990940094,1]},{position:.7300000190734863,color:[.8389359712600708,.7946400046348572,.6826399564743042,1]}]}},{name:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7.001",type:"ShaderNodeValToRGB",inputs:[{index:0,name:"Factor",identifier:"Fac",type:"NodeSocketFloatFactor",linked:!0,default_value:.5}],properties:{},color_ramp:{properties:{interpolation:"LINEAR",hue_interpolation:"NEAR",color_mode:"RGB"},elements:[{position:.10000000149011612,color:[.7701500058174133,.7310000061988831,.6669999957084656,1]},{position:.8999999761581421,color:[.8700000047683716,.8500000238418579,.8199999928474426,1]}]}},{name:"\u30DF\u30C3\u30AF\u30B9 (\u65E7)",type:"ShaderNodeMixRGB",inputs:[{index:0,name:"Factor",identifier:"Fac",type:"NodeSocketFloatFactor",linked:!1,default_value:.2800000011920929},{index:1,name:"Color1",identifier:"Color1",type:"NodeSocketColor",linked:!0,default_value:[.5,.5,.5,1]},{index:2,name:"Color2",identifier:"Color2",type:"NodeSocketColor",linked:!0,default_value:[.5,.5,.5,1]}],properties:{blend_type:"MULTIPLY",use_alpha:!1,use_clamp:!1}},{name:"\u30D0\u30F3\u30D7",type:"ShaderNodeBump",inputs:[{index:0,name:"Strength",identifier:"Strength",type:"NodeSocketFloatFactor",linked:!1,default_value:.2800000011920929},{index:1,name:"Distance",identifier:"Distance",type:"NodeSocketFloat",linked:!1,default_value:.00011999999696854502},{index:2,name:"Filter Width",identifier:"Filter Width",type:"NodeSocketFloatPixel",linked:!1,default_value:.10000000149011612},{index:3,name:"Height",identifier:"Height",type:"NodeSocketFloat",linked:!0,default_value:1},{index:4,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]}],properties:{invert:!1}}],links:[{from_node:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",from_socket:"BSDF",from_index:0,to_node:"\u30DE\u30C6\u30EA\u30A2\u30EB\u51FA\u529B",to_socket:"Surface",to_index:0},{from_node:"\u30C6\u30AF\u30B9\u30C1\u30E3\u5EA7\u6A19",from_socket:"Object",from_index:3,to_node:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97",to_socket:"Vector",to_index:0},{from_node:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97",from_socket:"Vector",from_index:0,to_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",to_socket:"Vector",to_index:0},{from_node:"\u30C6\u30AF\u30B9\u30C1\u30E3\u5EA7\u6A19",from_socket:"Object",from_index:3,to_node:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97.001",to_socket:"Vector",to_index:0},{from_node:"\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97.001",from_socket:"Vector",from_index:0,to_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3.001",to_socket:"Vector",to_index:0},{from_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",from_socket:"Fac",from_index:0,to_node:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7",to_socket:"Fac",to_index:0},{from_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3.001",from_socket:"Fac",from_index:0,to_node:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7.001",to_socket:"Fac",to_index:0},{from_node:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7",from_socket:"Color",from_index:0,to_node:"\u30DF\u30C3\u30AF\u30B9 (\u65E7)",to_socket:"Color1",to_index:1},{from_node:"\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7.001",from_socket:"Color",from_index:0,to_node:"\u30DF\u30C3\u30AF\u30B9 (\u65E7)",to_socket:"Color2",to_index:2},{from_node:"\u30DF\u30C3\u30AF\u30B9 (\u65E7)",from_socket:"Color",from_index:0,to_node:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",to_socket:"Base Color",to_index:0},{from_node:"\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",from_socket:"Fac",from_index:0,to_node:"\u30D0\u30F3\u30D7",to_socket:"Height",to_index:3},{from_node:"\u30D0\u30F3\u30D7",from_socket:"Normal",from_index:0,to_node:"\u30D7\u30EA\u30F3\u30B7\u30D7\u30EBBSDF",to_socket:"Normal",to_index:6}]}}});function Ii(i,e,t){if(i.schema!=="05-web-model-motion-v1"||i.unit!=="dynamic"||!Vy.includes(e))throw Error("05 dynamic source required");let n=i.materials[e],r=i.node_trees[n?.node_tree],s=Rf[e];if(!r||r.nodes.length!==s.nodes.length||JSON.stringify(r.links)!==JSON.stringify(s.links))throw Error("Dynamic source topology mismatch");let a=new Map(r.nodes.map(c=>[c.name,c]));for(let c of s.nodes){let u=a.get(c.name);if(!u||u.type!==c.type||u.properties.mute||JSON.stringify(u.inputs)!==JSON.stringify(c.inputs))throw Error("Dynamic source node/input mismatch");for(let[h,d]of Object.entries(c.properties))if(u.properties[h]!==d)throw Error("Dynamic source setting mismatch");for(let h of["color_ramp","texture_mapping"])if(JSON.stringify(u[h])!==JSON.stringify(c[h]))throw Error("Dynamic source ramp/mapping mismatch")}if(t?.source_sha256!==i.source_sha256||t.frame!==i.frame||t.build_hash!=="9e2066aef7ef"||!t.source_preserved)throw Error("Missing dynamic input authority");let o=t.materials?.[e];if(!o||o.material_animation_data!==null||o.node_tree_animation_data!==null)throw Error("Missing/animated material authority");let l=r.nodes.find(c=>c.type==="ShaderNodeBsdfPrincipled");for(let c of["Transmission Weight","Subsurface Weight","Coat Weight","Sheen Weight","Emission Strength","Thin Film Thickness","Diffuse Roughness","Anisotropic"])if(Fe(l,c)!==0)throw Error("Unsupported active "+c);if(Fe(l,"Alpha")!==1||Fe(l,"Thin Wall"))throw Error("Unsupported dynamic transparency");return{source:n,tree:r,bsdf:l,n:c=>a.get(c),authority:o}}function Ru(i,e,t){if(!e?.isMeshStandardMaterial||e.name!==t||e.side!==(i.source.properties.use_backface_culling?Lt:bt)||e.flatShading)throw Error("Original dynamic face/material required");let n=new At({roughness:Fe(i.bsdf,"Roughness"),metalness:Fe(i.bsdf,"Metallic"),ior:Fe(i.bsdf,"IOR"),specularIntensity:2*Fe(i.bsdf,"Specular IOR Level"),opacity:1,transparent:!1,side:e.side,flatShading:e.flatShading});return n.color.setRGB(...Fe(i.bsdf,"Base Color").slice(0,3)),n.specularColor.setRGB(...Fe(i.bsdf,"Specular Tint").slice(0,3)),n.name=t,n}function Gy({reference:i,name:e,inputs:t,sourceMaterial:n}){if(!Au.includes(e))throw Error("Expected constant dynamic material");let r=Ii(i,e,t),s=Ru(r,n,e);return s.userData.shokoFidelity={scene:"05_lower",stage:"dynamic-constant-v1",sourceMaterial:e,source_sha256:i.source_sha256},{material:s,limitations:zy,dispose(){s.dispose()}}}function ol({gltf:i,reference:e,mapping:t,inputs:n,names:r=Au,create:s=Gy}){if(!r.length||new Set(r).size!==r.length)throw Error("Unique selected names required");let a=If.get(i.scene)??new Set;if(r.some(_=>a.has(_)))throw Error("Dynamic material already installed");for(let _ of r)Ii(e,_,n);let o=t.primitive_material_mapping.filter(_=>r.includes(_.source_material_name));if(r.some(_=>!o.some(m=>m.source_material_name===_)))throw Error("Missing selected dynamic slots");let l=new Map(o.map(_=>[`${_.gltf_node}:${_.gltf_mesh}:${_.gltf_primitive}`,_]));if(l.size!==o.length)throw Error("Duplicate dynamic mapping");let c=new Map(e.objects.map(_=>[_.name,_])),u=new Set,h=[];if(i.scene.traverse(_=>{if(!_.isMesh)return;let m=i.parser.associations.get(_),p=_,M;for(;p&&p!==i.scene&&(M=i.parser.associations.get(p)?.nodes,M===void 0);)p=p.parent;let R=`${M}:${m?.meshes}:${m?.primitives}`,S=l.get(R);if(!S)return;let v=c.get(S.object),T=i.parser.json.meshes[m.meshes].primitives[m.primitives];if(u.has(R)||!v||i.parser.json.nodes[M]?.extras?.shokoSourceName!==S.object||T.material!==S.gltf_material_index||S.object_override_lost||!S.source_material_slots.length||S.source_material_slots.some(w=>v.materials[w]!==S.source_material_name))throw Error("Dynamic source slot mismatch");if(Array.isArray(_.material)||_.isSkinnedMesh||_.isInstancedMesh||_.morphTargetInfluences?.length||!_.geometry.attributes.position||!_.geometry.attributes.normal)throw Error("Unsupported dynamic primitive");u.add(R),h.push({object:_,row:S,source:v,before:_.material})}),h.length!==o.length)throw Error("Incomplete dynamic coverage");let d=new Map,f=[];try{for(let _ of h){let m=s.perObject?_.object:_.before,p=d.get(m);p||(p=s({reference:e,inputs:n,name:_.row.source_material_name,sourceMaterial:_.before,sourceObject:_.source,object:_.object}),d.set(m,p),p.material.onBeforeCompile({uniforms:{},vertexShader:Mt.physical.vertexShader,fragmentShader:Mt.physical.fragmentShader})),f.push({..._,after:p.material})}}catch(_){for(let m of d.values())m.dispose();throw _}for(let _ of f)_.object.material=_.after;for(let _ of r)a.add(_);If.set(i.scene,a);let g=!1;return{updates:f,adapters:d,status:{names:r,changed:f.length,materialsCreated:d.size,gpuVerified:!1},limitations:[...new Set([...d.values()].flatMap(_=>_.limitations))],dispose(){if(!g){for(let _ of f)_.object.material===_.after&&(_.object.material=_.before);for(let _ of d.values())_.dispose();for(let _ of r)a.delete(_);g=!0}}}}var Au,Vy,If,zy,Qs=tt(()=>{Wt();Js();Cf();Au=["Binding cover 02","Binding cover 01","Dark warm rail metal"],Vy=[...Au,"V3 Binding cover 2","V11 sewn paper 0"],If=new WeakMap;zy=["CPU GLTFLoader/shader construction only; GLSL, pixels and actual PC/iPhone performance unverified.","Three Physical approximates source Cycles Principled; renderer lighting/color management remain separate."]});function Hy({reference:i,inputs:e,sourceMaterial:t}){let n=Ii(i,ea,e),r=n.authority.object_coordinate;if(r?.node!=="\u30C6\u30AF\u30B9\u30C1\u30E3\u5EA7\u6A19"||r.type!=="ShaderNodeTexCoord"||r.object!==null||r.from_instancer!==!1)throw Error("Missing/unsupported dynamic paper Object coordinate");let{source:s,tree:a,n:o,bsdf:l}=n,c=o("\u30D0\u30F3\u30D7"),u=o("\u30DF\u30C3\u30AF\u30B9 (\u65E7)"),h=m=>js(Fe(o(m),"Vector_001")),d=(m,p)=>{let M=o(m);return`sbFbm(${p}*${at(Fe(M,"Scale"))},${at(Fe(M,"Detail"))},${at(Fe(M,"Roughness"))},${at(Fe(M,"Lacunarity"))})`},f=at(Fe(c,"Filter Width")),g=hi+is+Eu("slPaperColor",o("\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7").color_ramp)+Eu("slPaperTint",o("\u30AB\u30E9\u30FC\u30E9\u30F3\u30D7.001").color_ramp)+`
varying vec3 slPaperObject;
float slPaperHeight(vec3 p){return ${d("\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3",`(p*${h("\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97")})`)};}
`;if(t.name!==ea||t.side!==(s.properties.use_backface_culling?Lt:bt)||t.flatShading)throw Error("Dynamic paper source material/face mismatch");let _=new At({color:16777215,roughness:Fe(l,"Roughness"),metalness:0,opacity:1,transparent:!1,ior:Fe(l,"IOR"),specularIntensity:2*Fe(l,"Specular IOR Level"),side:s.properties.use_backface_culling?Lt:bt});_.specularColor.setRGB(...Fe(l,"Specular Tint").slice(0,3)),_.name=ea,_.onBeforeCompile=m=>{m.vertexShader=tn(m.vertexShader,"#include <common>",`#include <common>
varying vec3 slPaperObject;`),m.vertexShader=tn(m.vertexShader,"#include <project_vertex>",`slPaperObject=vec3(transformed.x,-transformed.z,transformed.y);
#include <project_vertex>`),m.fragmentShader=tn(m.fragmentShader,"#include <common>",`#include <common>
`+g),m.fragmentShader=tn(m.fragmentShader,"#include <map_fragment>",`
float slPaperH=slPaperHeight(slPaperObject);
diffuseColor.rgb=slPaperColor(slPaperH)*mix(vec3(1.0),slPaperTint(${d("\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3.001",`(slPaperObject*${h("\u30D9\u30AF\u30C8\u30EB\u6F14\u7B97.001")})`)}),${at(Fe(u,"Fac"))});
`),m.fragmentShader=tn(m.fragmentShader,"#include <normal_fragment_maps>",`
float slPaperHx=slPaperHeight(slPaperObject+${f}*dFdx(slPaperObject));
float slPaperHy=slPaperHeight(slPaperObject+${f}*dFdy(slPaperObject));
normal=sbBump(normal,dFdx(-vViewPosition),dFdy(-vViewPosition),slPaperH,slPaperHx,slPaperHy,${f},${at(Fe(c,"Strength"))},${at(Fe(c,"Distance")*(c.properties.invert?-1:1))});
`)},_.customProgramCacheKey=()=>`shoko-05-dynamic-paper-v1:${JSON.stringify(a)}`,_.userData.shokoFidelity={stage:"05-dynamic-paper-v1",source_sha256:i.source_sha256,sourceMaterial:ea,coordinates:"Source object-local before instanceMatrix; [x,-z,y] axis inverse once"};try{_.onBeforeCompile({uniforms:{},vertexShader:Mt.physical.vertexShader,fragmentShader:Mt.physical.fragmentShader})}catch(m){throw _.dispose(),m}return{material:_,limitations:["Own object-local coordinates follow original cargo motion; no world/Generated substitution.","Three Physical and raster derivative Bump approximate Cycles; GLSL/pixels/performance unverified."],dispose(){_.dispose()}}}var ea,Nf,Pf=tt(()=>{Wt();ns();Js();Qs();ea="V11 sewn paper 0";Nf=i=>ol({...i,names:[ea],create:Hy})});function Xy(i){let e=i.length,t=e+9+63>>6<<6,n=new Uint8Array(t);n.set(i),n[e]=128;let r=e*8,s=new DataView(n.buffer);s.setUint32(t-8,Math.floor(r/2**32)),s.setUint32(t-4,r>>>0);let a=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),o=new Uint32Array(64),l=(c,u)=>c>>>u|c<<32-u;for(let c=0;c<t;c+=64){for(let M=0;M<16;M++)o[M]=s.getUint32(c+M*4);for(let M=16;M<64;M++){let R=o[M-15],S=o[M-2];o[M]=o[M-16]+(l(R,7)^l(R,18)^R>>>3)+o[M-7]+(l(S,17)^l(S,19)^S>>>10)>>>0}let[u,h,d,f,g,_,m,p]=a;for(let M=0;M<64;M++){let R=p+(l(g,6)^l(g,11)^l(g,25))+(g&_^~g&m)+Wy[M]+o[M]>>>0,S=(l(u,2)^l(u,13)^l(u,22))+(u&h^u&d^h&d)>>>0;p=m,m=_,_=g,g=f+R>>>0,f=d,d=h,h=u,u=R+S>>>0}a[0]+=u,a[1]+=h,a[2]+=d,a[3]+=f,a[4]+=g,a[5]+=_,a[6]+=m,a[7]+=p}return[...a].map(c=>c.toString(16).padStart(8,"0")).join("")}async function Cu(i){let e=i instanceof Uint8Array?i:new Uint8Array(i.buffer??i,i.byteOffset??0,i.byteLength);return globalThis.crypto?.subtle?.digest?[...new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256",e))].map(t=>t.toString(16).padStart(2,"0")).join(""):Xy(e)}var Wy,Iu=tt(()=>{Wy=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298])});var ir,Lf=tt(()=>{ir={schema:"05-generated-cover-one-v1",source_sha256:"94f952d3a1fb5f58a9429fae6661f00442ec44167f2749d9856c16f8d3ea365c",build_hash:"9e2066aef7ef",frame:1,object:"V3 transported complete binding 0 cover",gltf_node:4,gltf_mesh:4,gltf_primitive:0,material:"V3 Binding cover 2",candidate_sha256:"01d594555b25247413c99d3f2754d7cb7e1a3901ef133a58576f5ae14e927389",generated_sha256:"0f32c6556b3d9682afcc40941794b5ec2c94f4159ff245d19718e9c362ab989a",geometry:{position:{sha256:"27200d7da8010f8961a5e0941345104eb52ecabdbfd7cf5edaf332c8a776b49f",count:256,itemSize:3,arrayType:"Float32Array"},normal:{sha256:"d4d2823bb5c64d5874e05db85f56d4fe1938e8d29df53ae115d64c3cf4d30cb8",count:256,itemSize:3,arrayType:"Float32Array"},uv:{sha256:"d2ea46974b63e7b1c75fbe3424a1f6ae03ec0340ebc33d27521848bceb792c57",count:256,itemSize:2,arrayType:"Float32Array"},index:{sha256:"f60bffe3247e2dcbc74d688d54c6c6fa3fe4115a4d310acad519d129c761ec8b",count:564,itemSize:1,arrayType:"Uint16Array"}},vertex_count:256,triangle_count:188,run_sha256:"724b89b4a44952c108fc0ec6ccb731a03fe117e02f2e8f4e6d5c2867221944f1",native_attribute_dump:!1,gpu_verified:!1,author_accepted:!1}});function Ff(i,e,t){let n=Ii(i,ir.material,e),r=n.n("\u30CE\u30A4\u30BA\u30C6\u30AF\u30B9\u30C1\u30E3"),s=n.n("\u30D0\u30F3\u30D7"),a=Ru(n,t,ir.material),o=at(Fe(s,"Filter Width")),l=hi+is+`
varying vec3 slCoverGenerated;
float slCoverHeight(vec3 p){return sbFbm(p*${at(Fe(r,"Scale"))},${at(Fe(r,"Detail"))},${at(Fe(r,"Roughness"))},${at(Fe(r,"Lacunarity"))});}
`;a.onBeforeCompile=c=>{c.vertexShader=tn(c.vertexShader,"#include <common>",`#include <common>
attribute vec3 ${Ni};
varying vec3 slCoverGenerated;`),c.vertexShader=tn(c.vertexShader,"#include <project_vertex>",`slCoverGenerated=${Ni};
#include <project_vertex>`),c.fragmentShader=tn(c.fragmentShader,"#include <common>",`#include <common>
`+l),c.fragmentShader=tn(c.fragmentShader,"#include <normal_fragment_maps>",`
float slCoverH=slCoverHeight(slCoverGenerated);
float slCoverHx=slCoverHeight(slCoverGenerated+${o}*dFdx(slCoverGenerated));
float slCoverHy=slCoverHeight(slCoverGenerated+${o}*dFdy(slCoverGenerated));
normal=sbBump(normal,dFdx(-vViewPosition),dFdy(-vViewPosition),slCoverH,slCoverHx,slCoverHy,${o},${at(Fe(s,"Strength"))},${at(Fe(s,"Distance")*(s.properties.invert?-1:1))});
`)},a.customProgramCacheKey=()=>`05-generated-cover-one-v1:${JSON.stringify(n.tree)}`,a.userData.shokoFidelity={stage:"05-generated-cover-one-v1",source_sha256:ir.source_sha256,sourceMaterial:ir.material,object:ir.object,candidate_sha256:ir.candidate_sha256,nativeAttributeDump:!1,gpuVerified:!1};try{a.onBeforeCompile({uniforms:{},vertexShader:Mt.physical.vertexShader,fragmentShader:Mt.physical.fragmentShader})}catch(c){throw a.dispose(),c}return a}var Ni,Df=tt(()=>{Iu();Wt();ns();Js();Qs();Lf();Ni="slCapturedGenerated"});var $n,Uf=tt(()=>{$n={schema:"05-generated-covers-all-v1",manifest_sha256:"d692486be3d8ad49273b9c6b8f84faa26aa37748e14cfdf24734f8d7f56a9395",binary_sha256:"6bd26eeb19d79570d18de5dc10b5d18b9ca93b17b65e9e3e2ae7cfb251dce3ce",source_sha256:"94f952d3a1fb5f58a9429fae6661f00442ec44167f2749d9856c16f8d3ea365c",total:55,binary_bytes:181104}});async function na(i){return Cu(i)}function Of(i){return new Uint8Array(i.array.buffer,i.array.byteOffset,i.array.byteLength)}function Bf(i){for(let e of Object.keys(i.attributes))e!==Ni&&i.deleteAttribute(e);i.setIndex(null),i.morphAttributes={},i.dispose()}async function Vf({gltf:i,reference:e,mapping:t,inputs:n,generatedManifest:r,generatedBuffer:s,existingCover:a=null}){if(ll.has(i.scene))throw Error("Generated covers already installed or installing");ll.add(i.scene);let o=[],l=[],c=null,u=!1,h=!1;try{let f=Ii(e,ta,n);if(e.source_sha256!==$n.source_sha256||e.frame!==1||typeof r!="string"||!(s instanceof ArrayBuffer)||s.byteLength!==$n.binary_bytes)throw Error("Generated package authority missing");if(await na(new TextEncoder().encode(r))!==$n.manifest_sha256)throw Error("Generated manifest checksum mismatch");let g=JSON.parse(r),_=s.slice(0);if(await na(_)!==$n.binary_sha256)throw Error("Generated buffer checksum mismatch");if(g.schema!==$n.schema||g.objects.length!==55||g.source_sha256!==e.source_sha256||g.build_hash!==n.build_hash||g.frame!==1)throw Error("Generated package contract mismatch");let m=new Map(e.objects.map(v=>[v.name,v])),p=t.primitive_material_mapping.filter(v=>v.source_material_name===ta);if(p.length!==55||new Set(p.map(v=>v.object)).size!==55)throw Error("Expected all 55 source slots");let M=new Map,R=new Set;for(let v of g.objects){let T=p.find(w=>w.object===v.object);if(!T||JSON.stringify(T)!==JSON.stringify(v.mapping)||M.has(v.object))throw Error("Generated source mapping mismatch");M.set(v.object,{record:v,row:T})}let S=new Map([...M.values()].map(v=>[`${v.row.gltf_node}:${v.row.gltf_mesh}:${v.row.gltf_primitive}`,v]));if(S.size!==55)throw Error("Duplicate Generated primitive mapping");if(i.scene.traverse(v=>{if(!v.isMesh)return;let T=i.parser.associations.get(v),w=v,y;for(;w&&w!==i.scene&&(y=i.parser.associations.get(w)?.nodes,y===void 0);)w=w.parent;let E=S.get(`${y}:${T?.meshes}:${T?.primitives}`);if(!E)return;let{record:C,row:D}=E,O=m.get(C.object),G=v.geometry,N=v.material;if(R.has(C.object)||!O||i.parser.json.nodes[y]?.extras?.shokoSourceName!==C.object||i.parser.json.meshes[T.meshes].primitives[T.primitives].material!==D.gltf_material_index||D.object_override_lost||JSON.stringify(D.source_material_slots)!=="[0]"||JSON.stringify(O.materials)!==JSON.stringify([ta])||JSON.stringify(O.material_links)!=='["DATA"]')throw Error("Generated node/mesh/primitive/slot mismatch");let H=C.object===kf&&a!==null;if(Array.isArray(N)||!N.isMeshStandardMaterial||N.name!==ta||N.flatShading||N.side!==(f.source.properties.use_backface_culling?Lt:bt)||v.isSkinnedMesh||v.isInstancedMesh||v.morphTargetInfluences?.length||Object.keys(G.morphAttributes).length)throw Error("Unsupported Generated source primitive");if(H){if(a.object!==v||a.geometry!==G||a.material!==N||a.status.sourceObject!==kf||!G.attributes[Ni]||N.userData.shokoFidelity?.candidate_sha256!==C.candidate_sha256)throw Error("Existing cover ownership mismatch")}else if(G.attributes[Ni])throw Error("Generated primitive already has an owner");R.add(C.object),l.push({object:v,row:D,record:C,source:O,beforeGeometry:G,beforeMaterial:N,useExisting:H})}),l.length!==55||R.size!==55||a&&!l.some(v=>v.useExisting))throw Error("Incomplete Generated coverage");for(let v of l){await Promise.all(Object.entries(v.record.geometry).map(async([w,y])=>{let E=w==="index"?v.beforeGeometry.index:v.beforeGeometry.attributes[w];if(!E||E.isInterleavedBufferAttribute||E.normalized||E.count!==y.count||E.itemSize!==y.itemSize||E.array.constructor.name!==y.arrayType||await na(Of(E))!==y.sha256)throw Error("Generated geometry checksum mismatch: "+v.record.object+"/"+w)}));let T=new Float32Array(_,v.record.offset,v.record.vertex_count*3);if(T.byteLength!==v.record.byteLength||await na(new Uint8Array(_,v.record.offset,v.record.byteLength))!==v.record.generated_sha256)throw Error("Generated per-object payload mismatch");if(v.useExisting){let w=v.beforeGeometry.attributes[Ni];if(w.itemSize!==3||w.count!==v.record.vertex_count||await na(Of(w))!==v.record.generated_sha256)throw Error("Existing cover Generated mismatch")}v.values=T}for(let v of l){if(v.object.geometry!==v.beforeGeometry||v.object.material!==v.beforeMaterial)throw Error("Generated primitive changed during preflight");if(v.useExisting){v.geometry=v.beforeGeometry;continue}let T=new Dt;o.push(T),v.geometry=T,T.name=v.beforeGeometry.name;for(let[w,y]of Object.entries(v.beforeGeometry.attributes))T.setAttribute(w,y);T.setIndex(v.beforeGeometry.index),T.setAttribute(Ni,new zt(v.values,3)),T.groups=v.beforeGeometry.groups.map(w=>({...w})),T.setDrawRange(v.beforeGeometry.drawRange.start,v.beforeGeometry.drawRange.count),T.boundingBox=v.beforeGeometry.boundingBox?.clone()??null,T.boundingSphere=v.beforeGeometry.boundingSphere?.clone()??null}a?c=a.material:(c=Ff(e,n,l[0].beforeMaterial),u=!0);for(let v of l)v.object.geometry=v.geometry,v.object.material=c,delete v.values;c.userData.shokoFidelity={stage:"05-generated-covers-all-v1",source_sha256:$n.source_sha256,sourceMaterial:ta,objects:l.map(v=>v.record.object),manifest_sha256:$n.manifest_sha256,nativeAttributeDump:!1,gpuVerified:!1},h=a!==null}catch(f){for(let g of o)Bf(g);throw u&&c.dispose(),ll.delete(i.scene),f}let d=!1;return{updates:l,material:c,status:{changed:55,sharedMaterials:1,newMaterials:u?1:0,adoptedCover0:h,newGeometries:o.length,newGeneratedBytes:$n.binary_bytes-(h?3072:0),totalGeneratedBytes:$n.binary_bytes,gpuVerified:!1,authorAccepted:!1},limitations:["Saved actual Cycles input-derived values; not native attribute dumps or author acceptance.","CPU coverage/motion/ownership verified; GLSL, pixels and PC/iPhone performance remain unverified.","Original Noise/Bump source equations retained; Three Physical and raster derivative Bump approximate Cycles."],dispose(){if(!d){for(let f of l)f.useExisting||(f.object.geometry===f.geometry&&(f.object.geometry=f.beforeGeometry),f.object.material===c&&(f.object.material=f.beforeMaterial));for(let f of o)Bf(f);h?a.dispose():c.dispose(),ll.delete(i.scene),d=!0}}}}var ta,kf,ll,zf=tt(()=>{Wt();Qs();Df();Uf();Iu();ta="V3 Binding cover 2",kf="V3 transported complete binding 0 cover",ll=new WeakSet});function qy(i,e){if(typeof i!="number"||!Number.isFinite(i))throw new TypeError(`${e} must be a finite number`);return i}function Gf(i){let e=1+24*qy(i,"seconds");if(!Number.isFinite(e))throw new RangeError("Time exceeds finite frame range");return e}function Yy(i,e){return(i%e+e)%e}function Hf(i){let e=Gf(i),t=Nu.map(({index:s,name:a,yAtZero:o})=>({index:s,name:a,location:[0,cl.minY+Yy(o-cl.minY+cl.speed*i,cl.pathLength),0]})),n=$y(i),r=ra.map(s=>({layer:s.layer,node:s.phaseNode,path:`nodes["${s.phaseNode}"].inputs[1].default_value`,index:0,phaseOffset:i*(2*Math.PI*s.cyclesPer12Seconds/12)}));return{seconds:i,frame:e,rigs:t,water:{shapeKeyWeights:n,materialPhases:r}}}function $y(i){return Gf(i),Object.fromEntries(ia.map(e=>{let t=i*(2*Math.PI*e.numerator/12);return[e.name,e.temporalFunction==="cos"?Math.cos(t):-Math.sin(t)]}))}var rr,I1,cl,Nu,ia,N1,ra,ul=tt(()=>{rr=i=>(i&&typeof i=="object"&&(Object.values(i).forEach(rr),Object.freeze(i)),i),I1=rr({fps:24,firstFrame:1,lastAuthoredFrame:288,boundaryFrame:289,referenceSeconds:12}),cl=rr({speed:.8,direction:[0,1,0],minY:-24,maxYExclusive:81.6,pathLength:105.6,spacing:4.8,rigCount:22,identityPeriodSeconds:132,referenceSetRepeatSeconds:12,slotsAdvancedAt12Seconds:2}),Nu=rr(Array.from({length:22},(i,e)=>({index:e,name:`Cargo ${String(e).padStart(2,"0")} / individual upper-girder carrier`,yAtZero:-22+4.8*e}))),ia=rr([7,11,19,23].flatMap((i,e)=>[{name:`wave ${e} sin`,numerator:i,temporalFunction:"cos"},{name:`wave ${e} cos`,numerator:i,temporalFunction:"-sin"}])),N1=rr([1.350000023841858,0,0,-.33250001072883606,0,1,0,0,0,0,1,0,0,0,0,1]),ra=rr([{layer:0,phaseNode:"Math.001",spatialK:.3490658402442932,cyclesPer12Seconds:1,noiseScale:6.5,bumpStrength:.44999998807907104,bumpDistance:.03999999910593033},{layer:1,phaseNode:"Math.005",spatialK:.4363323152065277,cyclesPer12Seconds:2,noiseScale:17,bumpStrength:.44999998807907104,bumpDistance:.019999999552965164},{layer:2,phaseNode:"Math.009",spatialK:.5235987901687622,cyclesPer12Seconds:3,noiseScale:39,bumpStrength:.44999998807907104,bumpDistance:.00800000037997961}])});var Pi,Wf=tt(()=>{Pi={source_sha256:"94f952d3a1fb5f58a9429fae6661f00442ec44167f2749d9856c16f8d3ea365c",nodes:[{name:"Principled BSDF",type:"ShaderNodeBsdfPrincipled",inputs:[{index:0,name:"Base Color",identifier:"Base Color",type:"NodeSocketColor",linked:!1,default_value:[.008999999612569809,.02500000037252903,.023000000044703484,1]},{index:1,name:"Metallic",identifier:"Metallic",type:"NodeSocketFloatFactor",linked:!1,default_value:.20000000298023224},{index:2,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.17000000178813934},{index:3,name:"IOR",identifier:"IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3329999446868896},{index:4,name:"Alpha",identifier:"Alpha",type:"NodeSocketFloatFactor",linked:!1,default_value:1},{index:5,name:"Thin Wall",identifier:"Thin Wall",type:"NodeSocketBool",linked:!1,default_value:!1},{index:6,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:7,name:"Weight",identifier:"Weight",type:"NodeSocketFloat",linked:!1,default_value:0},{index:8,name:"Diffuse Roughness",identifier:"Diffuse Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:9,name:"Subsurface Weight",identifier:"Subsurface Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:10,name:"Subsurface Radius",identifier:"Subsurface Radius",type:"NodeSocketVector",linked:!1,default_value:[1,.20000000298023224,.10000000149011612]},{index:11,name:"Subsurface Scale",identifier:"Subsurface Scale",type:"NodeSocketFloatDistance",linked:!1,default_value:.004999999888241291},{index:12,name:"Subsurface IOR",identifier:"Subsurface IOR",type:"NodeSocketFloatFactor",linked:!1,default_value:1.399999976158142},{index:13,name:"Subsurface Anisotropy",identifier:"Subsurface Anisotropy",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:14,name:"Specular IOR Level",identifier:"Specular IOR Level",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:15,name:"Specular Tint",identifier:"Specular Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:16,name:"Anisotropic",identifier:"Anisotropic",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:17,name:"Anisotropic Rotation",identifier:"Anisotropic Rotation",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:18,name:"Tangent",identifier:"Tangent",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:19,name:"Transmission Weight",identifier:"Transmission Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:.2800000011920929},{index:20,name:"Coat Weight",identifier:"Coat Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:21,name:"Coat Roughness",identifier:"Coat Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.029999999329447746},{index:22,name:"Coat IOR",identifier:"Coat IOR",type:"NodeSocketFloat",linked:!1,default_value:1.5},{index:23,name:"Coat Tint",identifier:"Coat Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:24,name:"Coat Normal",identifier:"Coat Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:25,name:"Sheen Weight",identifier:"Sheen Weight",type:"NodeSocketFloatFactor",linked:!1,default_value:0},{index:26,name:"Sheen Roughness",identifier:"Sheen Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.5},{index:27,name:"Sheen Tint",identifier:"Sheen Tint",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:28,name:"Emission Color",identifier:"Emission Color",type:"NodeSocketColor",linked:!1,default_value:[1,1,1,1]},{index:29,name:"Emission Strength",identifier:"Emission Strength",type:"NodeSocketFloat",linked:!1,default_value:0},{index:30,name:"Thin Film Thickness",identifier:"Thin Film Thickness",type:"NodeSocketFloatWavelength",linked:!1,default_value:0},{index:31,name:"Thin Film IOR",identifier:"Thin Film IOR",type:"NodeSocketFloat",linked:!1,default_value:1.3300000429153442}],properties:{}},{name:"Material Output",type:"ShaderNodeOutputMaterial",inputs:[{index:0,name:"Surface",identifier:"Surface",type:"NodeSocketShader",linked:!0},{index:1,name:"Volume",identifier:"Volume",type:"NodeSocketShader",linked:!1},{index:2,name:"Displacement",identifier:"Displacement",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]},{index:3,name:"Thickness",identifier:"Thickness",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{is_active_output:!0,target:"ALL"}},{name:"Texture Coordinate",type:"ShaderNodeTexCoord",inputs:[],properties:{from_instancer:!1}},{name:"Separate XYZ",type:"ShaderNodeSeparateXYZ",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]}],properties:{}},{name:"Math",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.3490658402442932},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"MULTIPLY",use_clamp:!1}},{name:"Math.001",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SUBTRACT",use_clamp:!1}},{name:"Math.002",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SINE",use_clamp:!1}},{name:"Math.003",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"COSINE",use_clamp:!1}},{name:"Combine XYZ",type:"ShaderNodeCombineXYZ",inputs:[{index:0,name:"X",identifier:"X",type:"NodeSocketFloat",linked:!0,default_value:0},{index:1,name:"Y",identifier:"Y",type:"NodeSocketFloat",linked:!0,default_value:0},{index:2,name:"Z",identifier:"Z",type:"NodeSocketFloat",linked:!0,default_value:0}],properties:{}},{name:"Noise Texture",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:6.5},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:3.700000047683716},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.75},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"Bump",type:"ShaderNodeBump",inputs:[{index:0,name:"Strength",identifier:"Strength",type:"NodeSocketFloatFactor",linked:!1,default_value:.44999998807907104},{index:1,name:"Distance",identifier:"Distance",type:"NodeSocketFloat",linked:!1,default_value:.03999999910593033},{index:2,name:"Filter Width",identifier:"Filter Width",type:"NodeSocketFloatPixel",linked:!1,default_value:.10000000149011612},{index:3,name:"Height",identifier:"Height",type:"NodeSocketFloat",linked:!0,default_value:1},{index:4,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!1,default_value:[0,0,0]}],properties:{invert:!1}},{name:"Math.004",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.4363323152065277},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"MULTIPLY",use_clamp:!1}},{name:"Math.005",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SUBTRACT",use_clamp:!1}},{name:"Math.006",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SINE",use_clamp:!1}},{name:"Math.007",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"COSINE",use_clamp:!1}},{name:"Combine XYZ.001",type:"ShaderNodeCombineXYZ",inputs:[{index:0,name:"X",identifier:"X",type:"NodeSocketFloat",linked:!0,default_value:0},{index:1,name:"Y",identifier:"Y",type:"NodeSocketFloat",linked:!0,default_value:0},{index:2,name:"Z",identifier:"Z",type:"NodeSocketFloat",linked:!0,default_value:0}],properties:{}},{name:"Noise Texture.001",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:17},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:3.700000047683716},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.75},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"Bump.001",type:"ShaderNodeBump",inputs:[{index:0,name:"Strength",identifier:"Strength",type:"NodeSocketFloatFactor",linked:!1,default_value:.44999998807907104},{index:1,name:"Distance",identifier:"Distance",type:"NodeSocketFloat",linked:!1,default_value:.019999999552965164},{index:2,name:"Filter Width",identifier:"Filter Width",type:"NodeSocketFloatPixel",linked:!1,default_value:.10000000149011612},{index:3,name:"Height",identifier:"Height",type:"NodeSocketFloat",linked:!0,default_value:1},{index:4,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]}],properties:{invert:!1}},{name:"Math.008",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5235987901687622},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"MULTIPLY",use_clamp:!1}},{name:"Math.009",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SUBTRACT",use_clamp:!1}},{name:"Math.010",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"SINE",use_clamp:!1}},{name:"Math.011",type:"ShaderNodeMath",inputs:[{index:0,name:"Value",identifier:"Value",type:"NodeSocketFloat",linked:!0,default_value:.5},{index:1,name:"Value",identifier:"Value_001",type:"NodeSocketFloat",linked:!1,default_value:.5},{index:2,name:"Value",identifier:"Value_002",type:"NodeSocketFloat",linked:!1,default_value:.5}],properties:{operation:"COSINE",use_clamp:!1}},{name:"Combine XYZ.002",type:"ShaderNodeCombineXYZ",inputs:[{index:0,name:"X",identifier:"X",type:"NodeSocketFloat",linked:!0,default_value:0},{index:1,name:"Y",identifier:"Y",type:"NodeSocketFloat",linked:!0,default_value:0},{index:2,name:"Z",identifier:"Z",type:"NodeSocketFloat",linked:!0,default_value:0}],properties:{}},{name:"Noise Texture.002",type:"ShaderNodeTexNoise",inputs:[{index:0,name:"Vector",identifier:"Vector",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]},{index:1,name:"W",identifier:"W",type:"NodeSocketFloat",linked:!1,default_value:0},{index:2,name:"Scale",identifier:"Scale",type:"NodeSocketFloat",linked:!1,default_value:39},{index:3,name:"Detail",identifier:"Detail",type:"NodeSocketFloat",linked:!1,default_value:3.700000047683716},{index:4,name:"Roughness",identifier:"Roughness",type:"NodeSocketFloatFactor",linked:!1,default_value:.75},{index:5,name:"Lacunarity",identifier:"Lacunarity",type:"NodeSocketFloat",linked:!1,default_value:2},{index:6,name:"Offset",identifier:"Offset",type:"NodeSocketFloat",linked:!1,default_value:0},{index:7,name:"Gain",identifier:"Gain",type:"NodeSocketFloat",linked:!1,default_value:1},{index:8,name:"Distortion",identifier:"Distortion",type:"NodeSocketFloat",linked:!1,default_value:0}],properties:{noise_dimensions:"3D",noise_type:"FBM",normalize:!0},texture_mapping:{vector_type:"POINT",translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1],min:[0,0,0],max:[1,1,1],use_min:!1,use_max:!1,mapping_x:"X",mapping_y:"Y",mapping_z:"Z",mapping:"FLAT"}},{name:"Bump.002",type:"ShaderNodeBump",inputs:[{index:0,name:"Strength",identifier:"Strength",type:"NodeSocketFloatFactor",linked:!1,default_value:.44999998807907104},{index:1,name:"Distance",identifier:"Distance",type:"NodeSocketFloat",linked:!1,default_value:.00800000037997961},{index:2,name:"Filter Width",identifier:"Filter Width",type:"NodeSocketFloatPixel",linked:!1,default_value:.10000000149011612},{index:3,name:"Height",identifier:"Height",type:"NodeSocketFloat",linked:!0,default_value:1},{index:4,name:"Normal",identifier:"Normal",type:"NodeSocketVector",linked:!0,default_value:[0,0,0]}],properties:{invert:!1}}],links:[{from_node:"Principled BSDF",from_socket:"BSDF",from_index:0,to_node:"Material Output",to_socket:"Surface",to_index:0},{from_node:"Texture Coordinate",from_socket:"Object",from_index:3,to_node:"Separate XYZ",to_socket:"Vector",to_index:0},{from_node:"Separate XYZ",from_socket:"Y",from_index:1,to_node:"Math",to_socket:"Value",to_index:0},{from_node:"Math",from_socket:"Value",from_index:0,to_node:"Math.001",to_socket:"Value",to_index:0},{from_node:"Math.001",from_socket:"Value",from_index:0,to_node:"Math.002",to_socket:"Value",to_index:0},{from_node:"Math.001",from_socket:"Value",from_index:0,to_node:"Math.003",to_socket:"Value",to_index:0},{from_node:"Separate XYZ",from_socket:"X",from_index:0,to_node:"Combine XYZ",to_socket:"X",to_index:0},{from_node:"Math.002",from_socket:"Value",from_index:0,to_node:"Combine XYZ",to_socket:"Y",to_index:1},{from_node:"Math.003",from_socket:"Value",from_index:0,to_node:"Combine XYZ",to_socket:"Z",to_index:2},{from_node:"Combine XYZ",from_socket:"Vector",from_index:0,to_node:"Noise Texture",to_socket:"Vector",to_index:0},{from_node:"Noise Texture",from_socket:"Fac",from_index:0,to_node:"Bump",to_socket:"Height",to_index:3},{from_node:"Separate XYZ",from_socket:"Y",from_index:1,to_node:"Math.004",to_socket:"Value",to_index:0},{from_node:"Math.004",from_socket:"Value",from_index:0,to_node:"Math.005",to_socket:"Value",to_index:0},{from_node:"Math.005",from_socket:"Value",from_index:0,to_node:"Math.006",to_socket:"Value",to_index:0},{from_node:"Math.005",from_socket:"Value",from_index:0,to_node:"Math.007",to_socket:"Value",to_index:0},{from_node:"Separate XYZ",from_socket:"X",from_index:0,to_node:"Combine XYZ.001",to_socket:"X",to_index:0},{from_node:"Math.006",from_socket:"Value",from_index:0,to_node:"Combine XYZ.001",to_socket:"Y",to_index:1},{from_node:"Math.007",from_socket:"Value",from_index:0,to_node:"Combine XYZ.001",to_socket:"Z",to_index:2},{from_node:"Combine XYZ.001",from_socket:"Vector",from_index:0,to_node:"Noise Texture.001",to_socket:"Vector",to_index:0},{from_node:"Noise Texture.001",from_socket:"Fac",from_index:0,to_node:"Bump.001",to_socket:"Height",to_index:3},{from_node:"Bump",from_socket:"Normal",from_index:0,to_node:"Bump.001",to_socket:"Normal",to_index:4},{from_node:"Separate XYZ",from_socket:"Y",from_index:1,to_node:"Math.008",to_socket:"Value",to_index:0},{from_node:"Math.008",from_socket:"Value",from_index:0,to_node:"Math.009",to_socket:"Value",to_index:0},{from_node:"Math.009",from_socket:"Value",from_index:0,to_node:"Math.010",to_socket:"Value",to_index:0},{from_node:"Math.009",from_socket:"Value",from_index:0,to_node:"Math.011",to_socket:"Value",to_index:0},{from_node:"Separate XYZ",from_socket:"X",from_index:0,to_node:"Combine XYZ.002",to_socket:"X",to_index:0},{from_node:"Math.010",from_socket:"Value",from_index:0,to_node:"Combine XYZ.002",to_socket:"Y",to_index:1},{from_node:"Math.011",from_socket:"Value",from_index:0,to_node:"Combine XYZ.002",to_socket:"Z",to_index:2},{from_node:"Combine XYZ.002",from_socket:"Vector",from_index:0,to_node:"Noise Texture.002",to_socket:"Vector",to_index:0},{from_node:"Noise Texture.002",from_socket:"Fac",from_index:0,to_node:"Bump.002",to_socket:"Height",to_index:3},{from_node:"Bump.001",from_socket:"Normal",from_index:0,to_node:"Bump.002",to_socket:"Normal",to_index:4},{from_node:"Bump.002",from_socket:"Normal",from_index:0,to_node:"Principled BSDF",to_socket:"Normal",to_index:6}],drivers:[{path:'nodes["Math.001"].inputs[1].default_value',index:0,expression:"(frame-1)/24*2*pi*1/12",driver_type:"SCRIPTED",valid:!0,variables:[]},{path:'nodes["Math.005"].inputs[1].default_value',index:0,expression:"(frame-1)/24*2*pi*2/12",driver_type:"SCRIPTED",valid:!0,variables:[]},{path:'nodes["Math.009"].inputs[1].default_value',index:0,expression:"(frame-1)/24*2*pi*3/12",driver_type:"SCRIPTED",valid:!0,variables:[]}]}});function qf(i,e,t){if(i.schema!=="05-web-model-motion-v1"||i.unit!=="dynamic"||i.source_sha256!==Pi.source_sha256)throw Error("Original 05 dynamic water required");let n=i.materials[Li],r=i.node_trees[n?.node_tree];if(!r||r.nodes.length!==25||r.links.length!==32||JSON.stringify(r.links)!==JSON.stringify(Pi.links))throw Error("Water topology changed");let s=new Map(r.nodes.map(u=>[u.name,u]));for(let u of Pi.nodes){let h=s.get(u.name);if(!h||h.type!==u.type||h.properties.mute||JSON.stringify(h.inputs)!==JSON.stringify(u.inputs))throw Error("Water source node/input mismatch");for(let[d,f]of Object.entries(u.properties))if(h.properties[d]!==f)throw Error("Water node setting changed");if(JSON.stringify(h.texture_mapping)!==JSON.stringify(u.texture_mapping))throw Error("Water hidden mapping changed")}let a=e?.record;if(e?.source_sha256!==i.source_sha256||e.frame!==1||e.build_hash!=="9e2066aef7ef"||!e.source_preserved||a?.material!==Li||a.node!=="Texture Coordinate"||a.type!=="ShaderNodeTexCoord"||a.object!==null||a.from_instancer!==!1)throw Error("Missing/unsupported water Object-coordinate authority");if(t?.source!==i.source_blend||!t.source_stat_unchanged||t.fps!==24||t.fps_base!==1||t.material?.name!==Li||JSON.stringify(t.material.drivers)!==JSON.stringify(Pi.drivers))throw Error("Water driver authority mismatch");let o=u=>s.get(u),l=o("Principled BSDF"),c=ra.map((u,h)=>{let d=h?".00"+h:"",f=o("Noise Texture"+d),g=o("Bump"+d),_=o(h?"Math.00"+4*h:"Math");if(u.spatialK!==Fe(_,"Value_001")||u.noiseScale!==Fe(f,"Scale")||u.bumpStrength!==Fe(g,"Strength")||u.bumpDistance!==Fe(g,"Distance")||Pi.drivers[h].path!==`nodes["${u.phaseNode}"].inputs[1].default_value`||Pi.drivers[h].expression!==`(frame-1)/24*2*pi*${h+1}/12`)throw Error("Existing motion/source layer disagreement");return{...u,noise:f,bump:g}});return{source:n,tree:r,bsdf:l,layers:c}}function Zy({reference:i,coordinateInputs:e,motionReference:t,sourceMaterial:n}){let r=qf(i,e,t),s=r.bsdf;if(!n?.isMeshStandardMaterial||n.name!==Li||n.side!==(r.source.properties.use_backface_culling?Lt:bt)||n.flatShading)throw Error("Original water face/material required");let a=new At({roughness:Fe(s,"Roughness"),metalness:Fe(s,"Metallic"),ior:Fe(s,"IOR"),specularIntensity:2*Fe(s,"Specular IOR Level"),transmission:Fe(s,"Transmission Weight"),opacity:Fe(s,"Alpha"),transparent:!1,side:n.side,flatShading:n.flatShading});a.name=Li,a.color.setRGB(...Fe(s,"Base Color").slice(0,3)),a.specularColor.setRGB(...Fe(s,"Specular Tint").slice(0,3));let o={value:new U(0,0,0)},l=[0,0,0],c=!1,u=r.layers.map((f,g)=>`float slWaterHeight${g}(vec3 p){float theta=${at(f.spatialK)}*p.y-slWaterPhases[${g}];return sbFbm(vec3(p.x,sin(theta),cos(theta))*${at(Fe(f.noise,"Scale"))},${at(Fe(f.noise,"Detail"))},${at(Fe(f.noise,"Roughness"))},${at(Fe(f.noise,"Lacunarity"))});}`).join(`
`),h=r.layers.map((f,g)=>{let _=at(Fe(f.bump,"Filter Width"));return`
float slWaterH${g}=slWaterHeight${g}(slWaterObject);
float slWaterHx${g}=slWaterHeight${g}(slWaterObject+${_}*dFdx(slWaterObject));
float slWaterHy${g}=slWaterHeight${g}(slWaterObject+${_}*dFdy(slWaterObject));
normal=sbBump(normal,slWaterDxP,slWaterDyP,slWaterH${g},slWaterHx${g},slWaterHy${g},${_},${at(Fe(f.bump,"Strength"))},${at(Fe(f.bump,"Distance")*(f.bump.properties.invert?-1:1))});`}).join(`
`);a.onBeforeCompile=f=>{f.vertexShader=tn(f.vertexShader,"#include <common>",`#include <common>
varying vec3 slWaterObject;`),f.vertexShader=tn(f.vertexShader,"#include <project_vertex>",`slWaterObject=vec3(transformed.x,-transformed.z,transformed.y);
#include <project_vertex>`),f.fragmentShader=tn(f.fragmentShader,"#include <common>",`#include <common>
varying vec3 slWaterObject;uniform vec3 slWaterPhases;
`+hi+is+u),f.fragmentShader=tn(f.fragmentShader,"#include <normal_fragment_maps>",`vec3 slWaterDxP=dFdx(-vViewPosition),slWaterDyP=dFdy(-vViewPosition);
`+h),f.uniforms.slWaterPhases=o},a.customProgramCacheKey=()=>`shoko-05-water-v1:${JSON.stringify(r.tree)}`,a.userData.shokoFidelity={scene:"05_lower",stage:"water-surface-v1",source_sha256:i.source_sha256,sourceMaterial:Li,requirements:Lu};let d=["CPU source/uniform/loader checks only; GLSL, pixels, optics and PC/iPhone performance unverified.","Three Physical vs Cycles Principled and raster derivative sequential Bump are approximations.","Existing GLB morph normals remain linear combinations; no recomputed exact post-morph normals.",Lu.physicalTransportLimit];try{a.onBeforeCompile({uniforms:{},vertexShader:Mt.physical.vertexShader,fragmentShader:Mt.physical.fragmentShader})}catch(f){throw a.dispose(),f}return{material:a,requirements:Lu,limitations:d,get phases(){return l.slice()},updatePhases(f){if(c)throw Error("Water material disposed");if(!Array.isArray(f)||f.length!==3)throw Error("Three source water phases required");let g=f.map((_,m)=>{let p=r.layers[m];if(_.layer!==m||_.node!==p.phaseNode||_.path!==Pi.drivers[m].path||_.index!==0||typeof _.phaseOffset!="number"||!Number.isFinite(_.phaseOffset))throw Error("Invalid water phase identity/value");return _.phaseOffset});o.value.set(...g),l.splice(0,3,...g)},dispose(){c||(a.dispose(),c=!0)}}}function Yf({gltf:i,reference:e,mapping:t,coordinateInputs:n,motionReference:r}){if(qf(e,n,r),Pu.has(i.scene))throw Error("Water already installed");let s=t.primitive_material_mapping.filter(g=>g.source_material_name===Li);if(s.length!==1||s[0].object!==Xf)throw Error("Expected original water primitive");let a=s[0],o=e.objects.find(g=>g.name===a.object),l;i.scene.traverse(g=>{let _=i.parser.associations.get(g);if(g.isMesh&&_?.meshes===a.gltf_mesh&&_?.primitives===a.gltf_primitive){if(l)throw Error("Duplicate water mesh");l=g}});let c=l,u;for(;c&&c!==i.scene&&(u=i.parser.associations.get(c)?.nodes,u===void 0);)c=c.parent;if(!l||u!==a.gltf_node||i.parser.json.nodes[u]?.extras?.shokoSourceName!==Xf||a.object_override_lost||i.parser.json.meshes[a.gltf_mesh].primitives[a.gltf_primitive].material!==a.gltf_material_index||!o||!a.source_material_slots.length||a.source_material_slots.some(g=>o.materials[g]!==Li)||!l.geometry.morphTargetsRelative||l.morphTargetInfluences?.length!==8)throw Error("Water source slot/morph mismatch");let h=l.material,d=Zy({reference:e,coordinateInputs:n,motionReference:r,sourceMaterial:h});l.material=d.material,Pu.add(i.scene);let f=!1;return{...d,object:l,get phases(){return d.phases},status:{changed:1,sourceNodes:25,sourceLinks:32,materialPhaseLayers:3,originalMorphTargets:8,transportPending:!0,gpuVerified:!1},dispose(){f||(l.material===d.material&&(l.material=h),d.dispose(),Pu.delete(i.scene),f=!0)}}}var Li,Xf,Pu,Lu,$f=tt(()=>{Wt();ns();Js();ul();Wf();Li="Dark moving water",Xf="Irregular directional water",Pu=new WeakSet;Lu={sourceThinWall:!1,alpha:1,transmissionIsNotAlpha:!0,transportPending:!0,missing:["Scene and original World reflected radiance, including offscreen geometry.","Source-aware refracted scene radiance and water path/exit geometry for Thin Wall false."],physicalTransportLimit:"Three screen-space transmission and its default zero thickness are provisional; zero thickness is not an authored water depth or faithful Thin Wall false implementation. No environment substitute is supplied."}});function Kf({gltf:i,reference:e,onMaterialPhases:t=null}){if(e?.schema!=="05-web-model-motion-v1"||e.unit!=="dynamic")throw new TypeError("Expected the dynamic-reference.json supplied with this GLB");if(t!==null&&typeof t!="function")throw new TypeError("Invalid phase callback");let n=new Map(e.objects.map(u=>[u.name,u])),r=new Map;i.scene.traverse(u=>{let h=i.parser.associations.get(u)?.nodes;if(h===void 0)return;let d=i.parser.json.nodes[h]?.extras?.shokoSourceName;if(d){if(r.has(d))throw new Error(`Duplicate source node: ${d}`);r.set(d,u)}});let s=u=>{let h=r.get(u);if(!h||!n.has(u))throw new Error(`Missing source node: ${u}`);return h};for(let u of e.objects){let h=s(u.name);if(u.parent&&h.parent!==s(u.parent))throw new Error(`Parent mismatch: ${u.name}`);let f=(u.parent?new Pe().set(...n.get(u.parent).matrix_world):new Pe).invert().multiply(new Pe().set(...u.matrix_world)),g=Zf.clone().multiply(f).multiply(Ky);if(h.updateMatrix(),!Jy(h.matrix,g))throw new Error(`Axis/local transform mismatch: ${u.name}`)}let a=Nu.map(({name:u})=>{let h=s(u);if(n.get(u).parent)throw new Error(`Unexpected parent on rig ${u}`);return{name:u,object:h,original:h.position.clone()}}),o=s(jy),l=[];if(o.traverse(u=>{if(!u.isMesh)return;let h=u.morphTargetDictionary;if(!h||ia.some(d=>!Number.isInteger(h[d.name])))throw new Error("Missing named water morph");if(!u.geometry.morphTargetsRelative||u.geometry.morphAttributes.position?.length!==8)throw new Error("Water must retain eight relative position targets");l.push({mesh:u,indices:ia.map(d=>h[d.name]),original:u.morphTargetInfluences.slice()})}),!l.length)throw new Error("Water primitive not found");let c=!1;return{status:Object.freeze({rigCount:a.length,waterPrimitives:l.length,coordinateConversion:"Source +Y to glTF -Z once; GLB already contains C * local * inverse(C)",parentInverse:"Already folded into exported local transforms; preserved source matrices in JSON",morphWeights:"Eight names; signed and unclamped",materialShader:"Not implemented; callback supplies authored phases"}),update(u){if(c)throw new Error("Motion adapter disposed");let h=Hf(u);h.rigs.forEach((d,f)=>{let[g,_,m]=d.location;a[f].object.position.set(g,m,-_),a[f].object.updateMatrix()});for(let{mesh:d,indices:f}of l)ia.forEach((g,_)=>{d.morphTargetInfluences[f[_]]=h.water.shapeKeyWeights[g.name]});return i.scene.updateMatrixWorld(!0),t?.(h.water.materialPhases),h},dispose(){if(!c){for(let{object:u,original:h}of a)u.position.copy(h),u.updateMatrix();for(let{mesh:u,original:h}of l)u.morphTargetInfluences.splice(0,h.length,...h);i.scene.updateMatrixWorld(!0),c=!0}}}}var Zf,Ky,jy,Jy,jf=tt(()=>{Wt();ul();Zf=new Pe().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1),Ky=Zf.clone().invert(),jy="Irregular directional water",Jy=(i,e)=>i.elements.every((t,n)=>Math.abs(t-e.elements[n])<2e-5)});function Qf(i){let e=Jf.size,t=new Uint8Array(i);if(t.length!==e*e*e*3)throw Error("05 look LUT size");let n=new Uint8Array(e*e*e*4);for(let s=0,a=0;s<t.length;s+=3,a+=4)n[a]=t[s],n[a+1]=t[s+1],n[a+2]=t[s+2],n[a+3]=255;let r=new Ir(n,e,e,e);return r.format=$t,r.type=Qt,r.colorSpace=Ht,r.minFilter=r.magFilter=lt,r.wrapS=r.wrapT=r.wrapR=Vt,r.generateMipmaps=!1,r.unpackAlignment=1,r.needsUpdate=!0,r}function ev(){let{size:i,min:e,max:t}=Jf,n=r=>r.toFixed(7);return`uniform sampler3D shokoLookLut;
vec3 shokoSRGBDecode( vec3 c ) { return mix( c / 12.92, pow( ( c + 0.055 ) / 1.055, vec3( 2.4 ) ), step( vec3( 0.04045 ), c ) ); }
vec3 CustomToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	vec3 s = clamp( ( log2( max( color, vec3( exp2( ${n(e)} ) ) ) ) - ( ${n(e)} ) ) / ${n(t-e)}, 0.0, 1.0 );
	vec3 display = texture( shokoLookLut, ( s * ${n(i-1)} + 0.5 ) / ${n(i)} ).rgb;
	return shokoSRGBDecode( display );
}`}function ep({roots:i,lut:e}){let t="vec3 CustomToneMapping( vec3 color ) { return color; }",n=Ve.tonemapping_pars_fragment,r=Qy(n,t,ev());Ve.tonemapping_pars_fragment=r;let s={value:e},a=[],o=new Set;for(let c of i)c.traverse(u=>{if(u.isMesh)for(let h of Array.isArray(u.material)?u.material:[u.material]){if(o.has(h)||h.toneMapped===!1)continue;o.add(h);let d=h.onBeforeCompile,f=h.customProgramCacheKey,g=function(m,p){d.call(this,m,p),m.uniforms.shokoLookLut=s},_=function(){return f.call(this)+"|05-source-look-agx-mhc-65-v1"};h.onBeforeCompile=g,h.customProgramCacheKey=_,h.needsUpdate=!0,a.push({material:h,before:d,beforeKey:f,hook:g,key:_})}});let l=!1;return{materials:a.length,chunk:r,dispose(){if(!l){l=!0,Ve.tonemapping_pars_fragment===r&&(Ve.tonemapping_pars_fragment=n);for(let c of a)c.material.onBeforeCompile===c.hook&&(c.material.onBeforeCompile=c.before),c.material.customProgramCacheKey===c.key&&(c.material.customProgramCacheKey=c.beforeKey),c.material.needsUpdate=!0}}}}var Jf,Qy,tp=tt(()=>{Wt();Jf=Object.freeze({size:65,min:-12.47393,max:12.5260688117,layout:"uint8 RGB, index=((b*65+g)*65+r)*3, display sRGB-encoded"}),Qy=(i,e,t)=>{if(i.split(e).length!==2)throw Error("05 look shader contract changed");return i.replace(e,t)}});function np({bitmap:i,depth:e,width:t,height:n}){if(!(e instanceof Float32Array)||e.length!==t*n)throw Error("05 plate depth size");if(i.width!==t||i.height!==n)throw Error("05 plate colour size");let r=new Pt(i);r.colorSpace=xt,r.flipY=!1,r.generateMipmaps=!1,r.minFilter=r.magFilter=lt,r.needsUpdate=!0;let s=new Vn(e,t,n,Ai,qt);return s.minFilter=s.magFilter=yt,s.colorSpace=Ht,s.needsUpdate=!0,{colour:r,depth:s,dispose(){r.dispose(),s.dispose()}}}function ip({world:i}={}){let e=new Xt({name:"05 clean plate",vertexShader:tv,fragmentShader:nv,uniforms:{plateColour:{value:null},plateDepth:{value:null},projectionZ:{value:new Xe},worldLinear:{value:new Ne(0,0,0)},sceneLinearPass:{value:0}},depthTest:!0,depthFunc:Mr,depthWrite:!0,toneMapped:!1}),t=new Et(new si(2,2),e);return t.name="05 clean plate",t.frustumCulled=!1,t.renderOrder=-1e9,t.onBeforeRender=n=>{let r=n.getRenderTarget()!==null?1:0;e.uniforms.sceneLinearPass.value!==r&&(e.uniforms.sceneLinearPass.value=r,e.uniformsNeedUpdate=!0)},i&&e.uniforms.worldLinear.value.setRGB(...i),{mesh:t,setView({textures:n,projection:r}){e.uniforms.plateColour.value=n.colour,e.uniforms.plateDepth.value=n.depth,e.uniforms.projectionZ.value.set(r.elements[10],r.elements[14])},dispose(){t.geometry.dispose(),e.dispose()}}}var tv,nv,rp=tt(()=>{Wt();tv=`varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }`,nv=`uniform sampler2D plateColour;
uniform sampler2D plateDepth;
uniform vec2 projectionZ;
uniform vec3 worldLinear;
uniform float sceneLinearPass;
varying vec2 vUv;
void main() {
	float z = texture2D( plateDepth, vUv ).r;
	// z = 0 marks "no static surface": far plane, so any dynamic surface wins.
	float ndc = z > 0.0 ? ( projectionZ.x * -z + projectionZ.y ) / z : 1.0;
	gl_FragDepth = clamp( ndc * 0.5 + 0.5, 0.0, 1.0 );
	vec3 plate = texture2D( plateColour, vUv ).rgb;
	// Water transmission renders into a scene-linear target. Under the water there is no static
	// surface in the source: Cycles sees the constant World there, so the refraction does too.
	// Elsewhere that pass still reads display light (approximation limited to water edges).
	if ( sceneLinearPass > 0.5 && z <= 0.0 ) plate = worldLinear;
	gl_FragColor = vec4( plate, 1.0 );
	#include <colorspace_fragment>
}`});function sv(i){let e=(i.match(sp)||[]).length;if(e!==3)throw Error("05 water height contract changed: "+e);return i.replace(sp,"vec3 shokoQ=$1;return sbFbm(shokoQ,shokoBandDetail(shokoQ,$2,$4),$3,$4);")}function ap({info:i,data:e}){let{width:t,height:n}=i.rect;if(!(e instanceof Uint16Array)||e.length!==t*n*4)throw Error("05 reflection size");let r=new Vn(e,t,n,$t,Yt);return r.colorSpace=Ht,r.flipY=!1,r.minFilter=on,r.magFilter=lt,r.wrapS=r.wrapT=Vt,r.generateMipmaps=!0,r.needsUpdate=!0,r}function op(i,{world:e=[0,0,0]}={}){let t={shokoRefl:{value:null},shokoReflRect:{value:new Je(0,0,1,1)},shokoReflOn:{value:0},shokoBandOn:{value:1},shokoWorld:{value:new Ne(0,0,0)}};t.shokoWorld.value.setRGB(...e);let n=i.onBeforeCompile,r=i.customProgramCacheKey,s=function(l,c){n.call(this,l,c),Object.assign(l.uniforms,t),l.fragmentShader=Fu(l.fragmentShader,"#include <common>",`#include <common>
uniform sampler2D shokoRefl;uniform vec4 shokoReflRect;uniform float shokoReflOn;uniform vec3 shokoWorld;
`+rv),l.fragmentShader=sv(l.fragmentShader),l.fragmentShader=Fu(l.fragmentShader,"#include <lights_physical_fragment>",`#include <lights_physical_fragment>
`+iv),l.fragmentShader=Fu(l.fragmentShader,"#include <lights_fragment_maps>",`#include <lights_fragment_maps>
`+av)},a=function(){return r.call(this)+"|05-water-static-reflection-v4-below"};i.onBeforeCompile=s,i.customProgramCacheKey=a,i.needsUpdate=!0;let o=!1;return{uniforms:t,set(l){t.shokoRefl.value=l?.texture??null,t.shokoReflOn.value=l?1:0,l&&t.shokoReflRect.value.set(...l.info.rectUV)},dispose(){o||(o=!0,i.onBeforeCompile===s&&(i.onBeforeCompile=n),i.customProgramCacheKey===a&&(i.customProgramCacheKey=r),i.needsUpdate=!0)}}}var Fu,iv,rv,sp,av,lp=tt(()=>{Wt();Fu=(i,e,t)=>{if(i.split(e).length!==2)throw Error("05 water reflection shader contract changed");return i.replace(e,t)},iv=`{
	vec3 shokoDNx = dFdx( normal ), shokoDNy = dFdy( normal );
	float shokoVariance = 0.25 * ( dot( shokoDNx, shokoDNx ) + dot( shokoDNy, shokoDNy ) );
	float shokoKernel2 = min( 2.0 * shokoVariance, 0.18 );
	material.roughness = sqrt( clamp( material.roughness * material.roughness + shokoKernel2, 0.0, 1.0 ) );
}`,rv=`uniform float shokoBandOn;
float shokoBandDetail( vec3 q, float detail, float lacunarity ) {
	if ( shokoBandOn < 0.5 ) return detail;
	float fw = max( length( dFdx( q ) ), length( dFdy( q ) ) );
	return clamp( log2( 0.5 / max( fw, 1e-6 ) ) / log2( lacunarity ), 0.0, detail );
}`,sp=/return sbFbm\((vec3\(p\.x,sin\(theta\),cos\(theta\)\)\*[^,]+),([^,]+),([^,]+),([^)]+)\);/g;av=`#if defined( RE_IndirectSpecular )
if ( shokoReflOn > 0.5 ) {
	vec3 shokoN0 = normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz );
	vec3 shokoR = reflect( - geometryViewDir, normal );
	vec3 shokoD = shokoR - 2.0 * dot( shokoR, shokoN0 ) * shokoN0;
	vec4 shokoClip = projectionMatrix * vec4( shokoD, 0.0 );
	vec4 shokoFlat = projectionMatrix * vec4( - geometryViewDir, 0.0 );
	vec2 shokoUV = shokoClip.w > 1e-4 ? shokoClip.xy / shokoClip.w * 0.5 + 0.5 : shokoFlat.xy / shokoFlat.w * 0.5 + 0.5;
	vec2 shokoFlatUV = shokoFlat.xy / shokoFlat.w * 0.5 + 0.5;
	vec4 shokoS = texture2D( shokoRefl, clamp( ( shokoUV - shokoReflRect.xy ) / shokoReflRect.zw, 0.0, 1.0 ) );
	// Both samples outside any branch: mip selection needs derivatives from uniform control flow.
	vec4 shokoF = texture2D( shokoRefl, clamp( ( shokoFlatUV - shokoReflRect.xy ) / shokoReflRect.zw, 0.0, 1.0 ) );
	if ( shokoS.a < 0.5 ) shokoS = shokoF;
	// A wave-tilted normal can send the reflected ray below the water plane: it then meets the water
	// or the void under it (source World), never the bright walls of the flat-mirror image.
	float shokoAbove = smoothstep( - 0.02, 0.02, dot( shokoR, shokoN0 ) );
	if ( shokoS.a >= 0.5 ) radiance += mix( shokoWorld, shokoS.rgb, shokoAbove );
}
#endif`});function hp(i,{geometry:e,noise:t}){e.computeBoundingBox();let n=e.boundingBox,r=n.min.x-.05,s=n.max.x-n.min.x+.1,a=[],o={},l=!1,c=!1,u=i.onBeforeCompile,h=i.customProgramCacheKey;function d(g,_){if(u.call(this,g,_),!l)return;Object.assign(g.uniforms,o);let m=g.fragmentShader;m=lv(m,"#include <common>",`#include <common>
uniform sampler2D slWaterTex0,slWaterTex1,slWaterTex2;
`);for(let p=0;p<3;p++){let M=ra[p].spatialK,R=new RegExp(`float slWaterHeight${p}\\(vec3 p\\)\\{[^}]*\\}`);if(!R.test(m))throw Error("05 water height "+p+" contract changed");m=m.replace(R,`float slWaterHeight${p}(vec3 p){vec2 uv=vec2((p.x-(${r.toFixed(5)}))/${s.toFixed(5)},${(M/(2*Math.PI)).toFixed(8)}*p.y-fract(slWaterPhases[${p}]/6.28318530718));return textureGrad(slWaterTex${p},uv,${up.toFixed(3)}*dFdx(uv),${up.toFixed(3)}*dFdy(uv)).r;}`)}g.fragmentShader=m}i.onBeforeCompile=d,i.customProgramCacheKey=function(){return h.call(this)+(l?"|05-water-baked":"")};function f(g){if(l||c)return;let _=g.getContext();if(!g.extensions.has("EXT_color_buffer_float")&&!g.extensions.has("EXT_color_buffer_half_float")){c=!0;return}let m=new Wn(-1,1,1,-1,0,1),p=new Wi,M=new Et(new si(2,2));p.add(M);let R=g.getRenderTarget(),S=g.toneMapping;g.toneMapping=mn;try{for(let v=0;v<3;v++){let[T,w]=dp[v],y=t[v],E=new Gt(T,w,{type:ov?qt:Yt,format:Ai,depthBuffer:!1,generateMipmaps:!0,minFilter:on,magFilter:lt,wrapS:Vt,wrapT:In});E.texture.colorSpace=Ht,M.material=new Xt({vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`precision highp float;varying vec2 vUv;
${hi}
void main(){float x=(${r.toFixed(5)})+vUv.x*${s.toFixed(5)};float th=vUv.y*6.28318530718;
     gl_FragColor=vec4(sbFbm(vec3(x,sin(th),cos(th))*${y.scale.toFixed(6)},${y.detail.toFixed(6)},${y.roughness.toFixed(6)},${y.lacunarity.toFixed(6)}),0.,0.,1.);}`,depthTest:!1,depthWrite:!1}),g.setRenderTarget(E),g.render(p,m),M.material.dispose(),a.push(E),o["slWaterTex"+v]={value:E.texture}}l=!0,i.needsUpdate=!0}catch{for(let T of a)T.dispose();a.length=0,c=!0}finally{g.setRenderTarget(R),g.toneMapping=S,M.geometry.dispose()}}return{bake:f,get status(){return{baked:l,failed:c,sizes:dp,xRange:[r,r+s]}},dispose(){for(let g of a)g.dispose();i.onBeforeCompile===d&&(i.onBeforeCompile=u),i.customProgramCacheKey=h,i.needsUpdate=!0}}}var Du,cp,ov,up,dp,lv,fp=tt(()=>{Wt();ns();ul();Du=new URLSearchParams(globalThis.location?.search??""),cp=+(Du.get("bakeK")??1),ov=Du.get("bakeT")==="float",up=+(Du.get("bakeG")??.1),dp=[[1024,1024],[1024,1024],[2048,2048]].map(([i,e])=>[i*cp,e*cp]),lv=(i,e,t)=>{if(i.split(e).length!==2)throw Error("05 water bake contract changed");return i.replace(e,t)}});function uv(i){let e=new Nt,t=i.camera;return e.name="05 fixed appreciation camera",e.matrixAutoUpdate=!1,e.matrix.copy(cv.clone().multiply(new Pe().set(...t.matrix_world))),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),{camera:e,set(n){let r=t.orientations[n];if(!r)throw Error("05 orientation");return e.near=r.clip_start,e.far=r.clip_end,e.aspect=r.width/r.height,e.projectionMatrix.set(...r.projection_matrix),e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),r}}}function dv({scene:i,roots:e,reference:t,camera:n}){let r=Ef(t),s=[],a=[],o={value:r.map(()=>new Je)};for(let m of r){let p=new $i(new Ne().setRGB(...m.color),m.intensity,0,2);p.position.copy(m.position),p.name=m.name,p.castShadow=!1,i.add(p),s.push(p)}let l="getPointLightInfo( pointLight, geometryPosition, directLight );",c=Uu(Ve.lights_fragment_begin,l,l+`
 directLight.color *= mix(1.0,max(dot(directLight.direction,lowerEmitter[ i ].xyz),0.0),lowerEmitter[ i ].w);`),u="#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )",h=c.indexOf(u),d=c.indexOf("#pragma unroll_loop_end",h);if(h<0||d<0)throw Error("05 hybrid light loop contract changed");let f=c.slice(0,h)+c.slice(h,d+23).replace("#pragma unroll_loop_start","").replace("#pragma unroll_loop_end","")+c.slice(d+23),g=new Set;for(let m of e)m.traverse(p=>{if(p.isMesh)for(let M of Array.isArray(p.material)?p.material:[p.material]){if(g.has(M))continue;g.add(M);let R=M.onBeforeCompile,S=M.customProgramCacheKey,v=function(w,y){R.call(this,w,y),w.uniforms.lowerEmitter=o,w.fragmentShader=Uu(w.fragmentShader,"#include <lights_pars_begin>",`uniform vec4 lowerEmitter[${r.length}];
${Ve.lights_pars_begin}`),w.fragmentShader=Uu(w.fragmentShader,"#include <lights_fragment_begin>",f)},T=function(){return S.call(this)+"|05-hybrid-lights"+r.length+"-centre-loop-v3"};M.onBeforeCompile=v,M.customProgramCacheKey=T,M.needsUpdate=!0,a.push({material:M,before:R,beforeKey:S,hook:v,key:T})}});let _=!1;return{descriptors:r,updateCamera(){n.updateMatrixWorld(!0),r.forEach((m,p)=>{let M=m.backward.clone().transformDirection(n.matrixWorldInverse);o.value[p].set(M.x,M.y,M.z,m.type==="AREA"?1:0)})},dispose(){if(!_){_=!0;for(let m of s)i.remove(m);for(let m of a)m.material.onBeforeCompile===m.hook&&(m.material.onBeforeCompile=m.before),m.material.customProgramCacheKey===m.key&&(m.material.customProgramCacheKey=m.beforeKey),m.material.needsUpdate=!0}}}}async function pp({data:i,dynamicGltf:e,loadView:t,orientation:n="landscape",quality:r,signal:s,invalidate:a=()=>{}}){let o=[],l=new Wi,c=uv(i.scene),u=new Map,h=es(r),d=!1,f=null,g=!1,_=null,m=null,p=null,M=v=>(o.push(v),v),R=()=>{if(s?.aborted)throw new DOMException("05 hybrid aborted","AbortError")};function S(){if(!d){d=!0;for(let v of o.toReversed())v.dispose();for(let v of u.values())Promise.resolve(v).then(T=>T.textures?.dispose(),()=>{});l.remove(e.scene)}}try{let ie=function(Z){let ne=u.get(Z);if(!ne||ne instanceof Promise)throw Error("05 plate not prepared: "+Z);c.set(Z),E.updateCamera(),N.setView({textures:ne.textures,projection:c.camera.projectionMatrix}),H.set(ne.reflection),f=Z},v=new Map(i.dynamic.objects.map(Z=>[Z.name,Z]));e.scene.traverse(Z=>{if(Z.isLight){Z.visible=!1;return}if(!Z.isMesh)return;let ne=Z,Le;for(;ne&&ne!==e.scene&&(Le=e.parser.associations.get(ne)?.nodes,Le===void 0);)ne=ne.parent;if(!v.get(e.parser.json.nodes[Le]?.extras?.shokoSourceName))throw Error("05 source mesh missing");Z.castShadow=!1,Z.receiveShadow=!1}),l.add(e.scene),e.scene.updateMatrixWorld(!0);let T={gltf:e,reference:i.dynamic,mapping:i.dynamicMapping,inputs:i.dynamicInputs};M(ol(T)),M(Nf(T)),M(await Vf({...T,generatedManifest:i.generatedManifest,generatedBuffer:i.generatedBuffer})),R();let w=M(Yf({...T,coordinateInputs:i.water,motionReference:i.motion})),y=M(Kf({gltf:e,reference:i.dynamic,onMaterialPhases:w.updatePhases}));y.update(0),c.set(n);let E=M(dv({scene:l,roots:[e.scene],reference:i.lights,camera:c.camera}));E.updateCamera();{let Z=new URLSearchParams(globalThis.location?.search??""),ne=+(Z.get("wr05")??8),Le=Z.get("wr05")==="off",Me=w.material,ke=Me.onBeforeCompile,W=Me.customProgramCacheKey;Le||(Me.onBeforeCompile=function(j,xe){ke.call(this,j,xe);let we=j.fragmentShader,le="#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )",Ue=we.indexOf(le),nt="pointLight = pointLights[ i ];",Oe=we.indexOf(nt,Ue),Ge=Oe<0?-1:Oe+nt.length;if(Ue<0||Oe<0||we.slice(Ue,Ge).includes("#pragma unroll_loop_start"))throw Error("05 water light loop contract changed");let Qe=we.slice(Ue,Ge).replace(nt,nt+`
		if(lowerEmitter[ i ].w==0.0&&length(pointLight.position-geometryPosition)>${ne.toFixed(2)})continue;`);j.fragmentShader=we.slice(0,Ue)+Qe+we.slice(Ge)},Me.customProgramCacheKey=function(){return W.call(this)+"|05-water-light-loop-"+ne},Me.needsUpdate=!0)}if(new URLSearchParams(globalThis.location?.search??"").get("bump05")==="deriv"){let Z=w.material,ne=Z.onBeforeCompile,Le=Z.customProgramCacheKey;Z.onBeforeCompile=function(Me,ke){ne.call(this,Me,ke);let W=/float slWaterH([xy])(\d)=slWaterHeight\2\(slWaterObject\+([^*]+)\*dFd[xy]\(slWaterObject\)\);/g,j=0;if(Me.fragmentShader=Me.fragmentShader.replace(W,(xe,we,le,Ue)=>(j++,`float slWaterH${we}${le}=slWaterH${le}+${Ue}*dFd${we}(slWaterH${le});`)),j!==6)throw Error("05 water bump contract changed")},Z.customProgramCacheKey=function(){return Le.call(this)+"|05-water-bump-derivative"},Z.needsUpdate=!0}let C=Qf(i.lut);M({dispose:()=>C.dispose()}),M(ep({roots:[e.scene],lut:C}));let D=i.scene.node_trees[i.scene.world.node_tree].nodes.find(Z=>Z.type==="ShaderNodeBackground"),O=Z=>D.inputs.find(ne=>ne.name===Z).default_value,G=O("Color").slice(0,3).map(Z=>Z*O("Strength")),N=M(ip({world:G})),H=M(op(w.material,{world:G})),J=i.dynamic.node_trees[i.dynamic.materials["Dark moving water"].node_tree],Y=(Z,ne)=>J.nodes.find(Le=>Le.name===Z).inputs.find(Le=>Le.name===ne).default_value,q=new URLSearchParams(globalThis.location?.search??"").get("bake05")!=="off"?M(hp(w.material,{geometry:w.object.geometry,noise:["Noise Texture","Noise Texture.001","Noise Texture.002"].map(Z=>({scale:Y(Z,"Scale"),detail:Y(Z,"Detail"),roughness:Y(Z,"Roughness"),lacunarity:Y(Z,"Lacunarity")}))})):null;l.add(N.mesh),M({dispose:()=>l.remove(N.mesh)});async function te(Z){if(!u.has(Z)){let Le=t(Z).then(Me=>{let ke=np({bitmap:Me.bitmap,depth:Me.depth,width:Me.view.width,height:Me.view.height}),W=Me.reflection?{info:Me.reflection.info,texture:ap(Me.reflection)}:null;return{...Me,reflection:W,textures:{...ke,dispose(){ke.dispose(),W?.texture.dispose()}}}});u.set(Z,Le),Le.catch(()=>u.delete(Z))}let ne=await u.get(Z);return R(),u.set(Z,ne),ne}ie((await te(n),n)),R();{let Z=new URLSearchParams(globalThis.location?.search??"").get("debug05");if(Z!==null){if(globalThis.__shoko05={scene:l,water:w,lights:E,plate:N,dynamic:e.scene},Z.includes("notrans")&&e.scene.traverse(ne=>{if(ne.isMesh)for(let Le of[].concat(ne.material))Le.transmission>0&&(Le.transmission=0,Le.needsUpdate=!0)}),Z.includes("nonoise")){let ne=w.material,Le=ne.onBeforeCompile,Me=ne.customProgramCacheKey;ne.onBeforeCompile=function(ke,W){Le.call(this,ke,W),ke.fragmentShader=ke.fragmentShader.replace(/(float slWaterHeight\d\(vec3 p\)\{)/g,"$1return 0.0;")},ne.customProgramCacheKey=function(){return Me.call(this)+"|nonoise"},ne.needsUpdate=!0}Z.includes("noreflect")&&(w.material.userData.shokoNoReflect=!0),Z.includes("nolights")&&l.traverse(ne=>{ne.isPointLight&&(ne.visible=!1)}),Z.includes("nocargo")&&e.scene.traverse(ne=>{ne.isMesh&&!(ne.material?.transmission>0)&&!/water/i.test(ne.name)&&(ne.visible=!1)}),Z.includes("nowater")&&e.scene.traverse(ne=>{ne.isMesh&&(/water/i.test(ne.name)||ne.material?.transmission>0)&&(ne.visible=!1)})}}return{scene:l,camera:c.camera,motion:y,water:w,prepareOrientation:te,get size(){return sf(f,h)},get quality(){return h},get status(){return{hybrid:!0,dynamicReady:g,compileMs:p,waterBake:q?.status??null,orientation:f,waterReflection:!!u.get(f)?.reflection,plate:u.get(f)?.view?.files,quality:h,network:"dynamic GLB + dynamic references + one plate JPEG/depth per shown orientation; no static GLB or original textures",limitations:["Dynamic casters/receivers of shadow not connected (step C).","Water refraction sees the source World under the water (no static bed exists); bank edges read display light.","Water reflects saved static radiance (step B) when present; live cargo reflection not yet drawn.","Dynamic GI/World irradiance not connected (step C).","Look = baked OCIO LUT of AgX Medium High Contrast; Three AgX not used."]}},setQuality(Z){return h=es(Z,h),!1},setOrientation(Z){ie(Z)},update(Z){y.update(Z)},render(Z){if(Z.toneMapping=Ki,Z.toneMappingExposure=2**i.scene.view_settings.exposure,Z.shadowMap.enabled=!1,m)throw m;if(q?.bake(Z),!g&&!_)if(typeof Z.compileAsync!="function")g=!0;else{let ne=performance.now();e.scene.visible=!0;let Le=Z.compileAsync(l,c.camera),Me=Z.getRenderTarget(),ke=new Gt(4,4,{type:Yt}),W;try{Z.setRenderTarget(ke),W=Z.compileAsync(l,c.camera)}finally{Z.setRenderTarget(Me)}_=Promise.all([Le,W]).then(()=>{ke.dispose(),p=performance.now()-ne,!d&&(g=!0,a())},j=>{ke.dispose(),m=j,a()})}e.scene.visible=g,Z.render(l,c.camera)},dispose:S}}catch(v){throw S(),v}}var cv,Uu,mp=tt(()=>{Wt();Af();Qs();Pf();zf();$f();jf();Kc();tp();rp();lp();fp();cv=new Pe().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1),Uu=(i,e,t)=>{if(i.split(e).length!==2)throw Error("05 hybrid light shader contract changed");return i.replace(e,t)}});var _p={};nd(_p,{makeHybridMount:()=>gp,mountPreview:()=>pv});function gp(i={}){return lf({...i,loadInputs:i.loadInputs??Sf,connect:i.connect??pp})}var hv,fv,pv,xp=tt(()=>{cf();Tf();mp();hv=()=>{try{return matchMedia("(pointer: coarse)").matches||Math.max(screen.width,screen.height)<=1024}catch{return!1}},fv=gp(),pv=i=>fv({...i,quality:i?.quality&&Object.keys(i.quality).length?i.quality:hv()?{longEdge:960}:void 0})});var yp={};nd(yp,{mountPreview:()=>mv});function mv({container:i,sceneId:e,orientation:t="landscape",quality:n={},signal:r,onStatus:s=()=>{},onFrame:a=()=>{}}){let o=new Image;o.alt="\u66F8\u5EAB\u306E\u56FA\u5B9A\u3057\u305F\u60C5\u666F",o.decoding="async",o.style.cssText="display:block;width:100%;height:100%;object-fit:contain";let l=!1,c=0,u=null,h=null,d=null,f=fetch(new URL("./shoko-v1-w1-jpeg-manifest.json",__shokoScript),{signal:r}).then(p=>{if(!p.ok)throw new Error("JPEG manifest unavailable");return p.json()}),g=()=>{u?.abort()};r?.addEventListener("abort",g,{once:!0});async function _(){let p=++c;if(g(),u=new AbortController,l||r?.aborted)return;let M=u.signal;try{let R=await f;if(l||p!==c||r?.aborted)return;let S=R.scenes[e]?.[t];if(!S)throw new Error("JPEG view unavailable");let v=[...S.variants].sort((O,G)=>O.longEdge-G.longEdge),T=v.find(O=>O.longEdge>=(n.jpegLongEdge||1920))??v.at(-1);if(d===T.url)return;s({phase:"loading"});let w=await fetch(new URL(T.url,__shokoScript),{signal:M});if(!w.ok)throw new Error("JPEG unavailable");let y=await w.blob();if(l||p!==c||r?.aborted)return;let E=URL.createObjectURL(y),C=new Image;C.decoding="async",C.src=E;try{await C.decode()}catch(O){throw URL.revokeObjectURL(E),O}if(l||p!==c||r?.aborted){URL.revokeObjectURL(E);return}let D=h;if(h=E,d=T.url,o.src=E,o.width=T.width,o.height=T.height,o.dataset.asset=T.url,o.dataset.bytes=String(T.bytes),o.dataset.nativeSize=S.native_size.join("x"),await o.decode(),l||p!==c||r?.aborted)return;i.replaceChildren(o),D&&URL.revokeObjectURL(D),a(o),s({phase:"ready"})}catch(R){if(l||p!==c||r?.aborted||M.aborted)return;throw s({phase:"error",message:R.message}),R}}return{ready:_(),async setOrientation(p){p!==t&&(t=p,await _())},async resize(p){n=p,await _()},setVisible(){},setPlaying(){},dispose(){l=!0,++c,g(),r?.removeEventListener("abort",g),o.remove(),o.removeAttribute("src"),h&&URL.revokeObjectURL(h),h=null}}}var vp=tt(()=>{});var gl=[{id:"01",name:"\u5916\u89B3",module:"/modules/01-02/realtime-entry.mjs",version:"forest-B",animated:!1},{id:"02",name:"\u53D7\u5165",module:"/modules/01-02/realtime-entry.mjs",version:"forest-B-world",animated:!1},{id:"03",name:"\u5C45\u5BA4",module:"/modules/03/realtime-entry.mjs",version:"S1-uvA",animated:!1},{id:"04",name:"\u95B2\u89A7\u5C64",module:"/modules/04/realtime-entry.mjs",version:"H1",animated:!1},{id:"05",name:"\u4E0B\u5C64",module:"/modules/05/realtime-entry.mjs",version:"model-motion",animated:!0},{id:"06",name:"\u5916\u5149\u5C64",module:"/modules/06/realtime-entry.mjs",version:"forest-F",available:!1,animated:!1},{id:"07",name:"\u679D",module:"/modules/07/realtime-entry.mjs",version:"D2",animated:!1}];for(let i of gl){let e=["01","02","03","04","06","07"].includes(i.id),t=i.id==="05";i.available=e||t,e&&(i.module="./jpeg-entry.mjs",i.presentation="jpeg",i.animated=!1),t&&(i.module="/modules/05/hybrid-dynamic-entry.mjs",i.presentation="hybrid",i.version="nave-006",i.animated=!0)}var _l={"01":{alt:"\u8336\u8272\u3044\u5E79\u306E\u539A\u3044\u7E26\u306E\u88C2\u3051\u76EE\u304B\u3089\u3001\u767D\u3044\u6728\u808C\u306E\u901A\u308A\u629C\u3051\u90E8\u5206\u3092\u7D4C\u3066\u53D7\u5165\u3078\u7D9A\u304F\u3002",topics:[{title:"\u5165\u53E3",body:"\u5272\u308C\u76EE\u304C\u305D\u306E\u307E\u307E\u7E26\u306B\u958B\u3044\u3066\u5165\u53E3\u306B\u306A\u3063\u3066\u3044\u308B\u3002\u5207\u3063\u3066\u4F5C\u3063\u305F\u53E3\u3067\u306F\u306A\u3044\u3002\u9AD8\u3055\u306F\u4EBA\u306E\u500D\u307B\u3069\u3067\u3001\u958B\u3044\u305F\u4E2D\u3060\u3051\u304C\u660E\u308B\u3044\u3002\u540C\u3058\u5F62\u306E\u5165\u53E3\u304C\u3001\u540C\u3058\u9593\u9694\u3067\u5E79\u306E\u307E\u308F\u308A\u306B\u4E26\u3076\u3002",source:"\u7BC708\uFF081501\u30FB1513\u20131531\u884C\uFF09"},{title:"\u958B\u304D\u306E\u4E0A",body:"\u5916\u76AE\u306F\u958B\u304D\u306E\u4E0A\u3067\u9014\u5207\u308C\u306A\u3044\u3002\u5272\u308C\u76EE\u3092\u307E\u305F\u3044\u3067\u3001\u305D\u306E\u307E\u307E\u4E0A\u3078\u4F38\u3073\u3066\u3044\u304F\u3002",source:"\u7BC708\uFF081591\u884C\uFF09"},{title:"\u5965\u306E\u767D",body:"\u958B\u304D\u306E\u5411\u3053\u3046\u306B\u6DE1\u3044\u767D\u306E\u9762\u304C\u7D9A\u304F\u3002\u5E8A\u306F\u5E73\u3089\u3067\u3001\u5929\u4E95\u306F\u898B\u3048\u306A\u3044\u3002\u5965\u3067\u5C11\u3057\u6697\u304F\u306A\u308A\u3001\u66F2\u304C\u3063\u3066\u5148\u304C\u96A0\u308C\u308B\u3002",source:"\u7BC708\uFF081505\u30FB1575\u884C\uFF09"},{title:"\u5965\u306E\u53D7\u5165\u9762",body:"\u767D\u3044\u5E8A\u306E\u5965\u306B\u3001\u8170\u306E\u9AD8\u3055\u306E\u9762\u304C\u4E00\u3064\u7ACB\u3063\u3066\u3044\u308B\u3002\u8FD1\u3065\u304F\u3068\u3001\u9762\u306B\u300C\u53D7\u5165\u300D\u306E\u884C\u304C\u51FA\u308B\u3002",source:"\u7BC708\u30FB09\uFF081618\u20131624\u884C\uFF09"},{title:"\u5916\u76AE",body:"\u7D30\u304B\u3044\u5272\u308C\u76EE\u304C\u7E26\u306B\u8D70\u308A\u3001\u9014\u4E2D\u3067\u5206\u304B\u308C\u3001\u5148\u3067\u307E\u305F\u5408\u308F\u3055\u308B\u3002\u8FD1\u304F\u3067\u898B\u308B\u3068\u3001\u8584\u3044\u5C64\u304C\u91CD\u306A\u3063\u3066\u3067\u304D\u3066\u3044\u308B\u3002\u58C1\u306F\u3086\u308B\u304F\u66F2\u304C\u308A\u3001\u6CBF\u3063\u3066\u6B69\u304F\u3068\u6765\u305F\u5834\u6240\u304C\u898B\u3048\u306A\u304F\u306A\u308B\u3002",source:"\u7BC708\uFF081443\u20131445\u30FB1489\u20131491\u884C\uFF09"},{title:"\u624B\u3056\u308F\u308A",body:"\u624B\u3092\u5F53\u3066\u3066\u3082\u3001\u51B7\u305F\u304F\u3082\u6E29\u304B\u304F\u3082\u306A\u3044\u3002\u6307\u306E\u6E29\u5EA6\u306E\u8DE1\u304C\u5C11\u3057\u6B8B\u3063\u3066\u6D88\u3048\u308B\u3002\u58C1\u306E\u4E2D\u3092\u4F55\u304B\u304C\u4E0A\u4E0B\u306B\u901A\u308B\u97F3\u304C\u3059\u308B\u304C\u3001\u9593\u9694\u306F\u63C3\u308F\u305A\u3001\u3068\u304D\u3069\u304D\u9577\u304F\u7A7A\u304F\u3002",source:"\u7BC708\uFF081451\u30FB1469\u20131483\u884C\uFF09"},{title:"\u6839",body:"\u7E26\u306E\u7B4B\u3092\u6301\u3064\u6839\u304C\u3001\u4E0A\u3078\u306D\u3058\u308C\u306A\u304C\u3089\u4F38\u3073\u3066\u3044\u308B\u3002\u4E00\u672C\u306E\u592A\u3055\u306B\u3082\u3001\u4EBA\u306E\u80CC\u306F\u5C4A\u304B\u306A\u3044\u3002",source:"\u7BC707\u30FB08\uFF081273\u30FB1281\u30FB1447\u884C\uFF09"},{title:"\u6839\u306E\u91CD\u306A\u308A",body:"\u6839\u306F\u5E79\u3088\u308A\u4F4E\u3044\u3068\u3053\u308D\u3067\u6298\u308A\u91CD\u306A\u308A\u3001\u56DB\u65B9\u3078\u5E83\u304C\u3063\u3066\u3044\u304F\u3002",source:"\u7BC708\u30FB22\uFF081443\u884C\u30FB3457\u884C\uFF09"},{title:"\u6839\u306E\u3042\u3044\u3060\u306E\u9053",body:"\u9053\u306F\u5927\u304D\u306A\u6839\u306E\u3042\u3044\u3060\u3092\u901A\u308B\u3002\u982D\u4E0A\u3067\u6839\u304C\u8FD1\u3065\u304D\u3001\u4EA4\u5DEE\u305B\u305A\u306B\u96E2\u308C\u305F\u3068\u3053\u308D\u304B\u3089\u5149\u304C\u843D\u3061\u3066\u3001\u9053\u306E\u771F\u3093\u4E2D\u3060\u3051\u304C\u660E\u308B\u3044\u3002",source:"\u7BC707\u30FB08\uFF081297\u30FB1419\u20131421\u884C\uFF09"}]},"02":{alt:"\u5916\u306E\u958B\u53E3\u3068\u3001\u767D\u3044\u7A7A\u9593\u306E\u5965\u306B\u3042\u308B\u53D7\u5165\u9762\u3002",topics:[{title:"\u53D7\u5165\u9762",body:"\u8170\u306E\u9AD8\u3055\u306B\u3001\u677F\u306E\u3088\u3046\u306A\u9762\u304C\u7ACB\u3064\u3002\u8FD1\u3065\u304F\u3068\u300C\u53D7\u5165\u300D\u306E\u884C\u304C\u51FA\u308B\u3002",source:"\u7BC709\uFF081620\u20131624\u884C\uFF09"},{title:"\u7AAA\u307F",body:"\u9762\u306E\u4E0B\u306E\u307B\u3046\u306B\u3001\u6307\u306E\u5E45\u3088\u308A\u5C11\u3057\u5E83\u3044\u7AAA\u307F\u304C\u3042\u308B\u3002\u624B\u3092\u7F6E\u304F\u3068\u3053\u308D\u3067\u3001\u53D7\u7406\u3055\u308C\u308B\u3068\u9762\u306E\u884C\u304C\u5909\u308F\u308B\u3002",source:"\u7BC709\uFF081628\u884C\uFF09"},{title:"\u7968\u306E\u53E3",body:"\u9762\u306E\u6A2A\u304C\u5C0F\u3055\u304F\u958B\u304D\u3001\u7D19\u306E\u7968\u304C\u4E00\u679A\u51FA\u3066\u304F\u308B\u3002\u638C\u3088\u308A\u5C0F\u3055\u304F\u3001\u9762\u3068\u540C\u3058\u6DE1\u3044\u767D\u3002\u8584\u3044\u306E\u306B\u900F\u3051\u305A\u3001\u6298\u308B\u3068\u6298\u308A\u76EE\u304C\u623B\u3089\u306A\u3044\u3002",source:"\u7BC709\u30FB10\uFF081634\u20131654\u30FB2040\u884C\uFF09"},{title:"\u6607\u964D",body:"\u8272\u306E\u9055\u3046\u5E8A\u306E\u5148\u3067\u3001\u58C1\u304C\u7E26\u306B\u5272\u308C\u3066\u3044\u308B\u3002\u524D\u306B\u7ACB\u3064\u3068\u958B\u304D\u3001\u4E2D\u306F\u72ED\u3044\u3002\u6DE1\u3044\u767D\u306E\u58C1\u306B\u3001\u884C\u304D\u5148\u304C\u4E00\u884C\u3060\u3051\u51FA\u308B\u3002",source:"\u7BC709\u30FB10\uFF081715\u20131717\u30FB2068\u20132074\u884C\uFF09"},{title:"\u8272\u306E\u9055\u3046\u5E8A",body:"\u5965\u306E\u4E00\u304B\u6240\u3060\u3051\u3001\u540C\u3058\u767D\u306A\u306E\u306B\u3001\u5149\u306E\u5F53\u305F\u308A\u65B9\u304C\u9055\u3063\u3066\u898B\u3048\u308B\u3002",source:"\u7BC709\u30FB23\uFF081618\u30FB3584\u884C\uFF09"},{title:"\u767D\u3044\u5E8A",body:"\u6DE1\u3044\u767D\u306E\u5E8A\u306B\u306F\u7D99\u304E\u76EE\u304C\u306A\u3044\u3002\u5916\u304B\u3089\u898B\u305F\u3088\u308A\u5E83\u304F\u3001\u8E0F\u3080\u3068\u601D\u3063\u305F\u307B\u3069\u786C\u304F\u306A\u3044\u3002",source:"\u7BC709\uFF081606\u20131608\u30FB1772\u884C\uFF09"},{title:"\u58C1\u3068\u5E8A\u306E\u5883",body:"\u58C1\u3082\u5E8A\u3068\u540C\u3058\u8272\u3092\u3057\u3066\u3044\u308B\u3002\u5883\u306F\u3086\u308B\u304F\u66F2\u304C\u308A\u3001\u3069\u3053\u304B\u3089\u304C\u58C1\u306A\u306E\u304B\u3001\u76EE\u3067\u306F\u6C7A\u3081\u3089\u308C\u306A\u3044\u3002",source:"\u7BC709\uFF081608\u884C\uFF09"},{title:"\u5929\u4E95\u306E\u660E\u308B\u3055",body:"\u9AD8\u3044\u3068\u3053\u308D\u304C\u660E\u308B\u3044\u304C\u3001\u5149\u3063\u3066\u3044\u308B\u9762\u306F\u898B\u3048\u306A\u3044\u3002\u660E\u308B\u3055\u3060\u3051\u304C\u3042\u308B\u3002",source:"\u7BC709\uFF081608\u884C\uFF09"},{title:"\u9759\u3051\u3055",body:"\u5916\u76AE\u306E\u4E2D\u3067\u805E\u3053\u3048\u305F\u3001\u58C1\u306E\u4E2D\u3092\u901A\u308B\u97F3\u306F\u3001\u3053\u3053\u3067\u306F\u805E\u3053\u3048\u306A\u3044\u3002\u81EA\u5206\u306E\u8DB3\u97F3\u3060\u3051\u304C\u8FD4\u3063\u3066\u304F\u308B\u3002",source:"\u7BC709\uFF081610\u20131612\u884C\uFF09"},{title:"\u5916\u3078\u306E\u5272\u308C\u76EE",body:"\u5165\u3063\u3066\u304D\u305F\u5272\u308C\u76EE\u306F\u3001\u5185\u5074\u304B\u3089\u898B\u308B\u3068\u5916\u306E\u660E\u308B\u3055\u3067\u305D\u308C\u3068\u5206\u304B\u308B\u3002\u5149\u306F\u6B63\u9762\u304B\u3089\u6765\u308B\u3002",source:"\u7BC708\u30FB27\uFF081501\u30FB4337\u20134345\u884C\uFF09"}]},"03":{alt:"\u7B49\u5BF8\u306E\u4E8C\u53F0\u3068\u3001\u4E2D\u592E\u306E\u7A7A\u5E8A\u3002\u305D\u306E\u5965\u306B\u5353\u3068\u901A\u8DEF\u3002",topics:[{title:"\u4E8C\u53F0",body:"\u5DE6\u53F3\u306E\u58C1\u304E\u308F\u306B\u53F0\u304C\u4E00\u3064\u305A\u3064\u3042\u308B\u3002\u9AD8\u3055\u3082\u9577\u3055\u3082\u3001\u58C1\u304B\u3089\u306E\u96E2\u308C\u65B9\u3082\u540C\u3058\u3002",source:"\u7BC711\uFF082097\u20132099\u884C\uFF09"},{title:"\u6577\u7269",body:"\u53F0\u306E\u4E0A\u306B\u8584\u3044\u3082\u306E\u304C\u6577\u3044\u3066\u3042\u308B\u3002\u62BC\u3059\u3068\u5C11\u3057\u6C88\u307F\u3001\u96E2\u3059\u3068\u623B\u308B\u3002",source:"\u7BC711\uFF082099\u884C\uFF09"},{title:"\u53F0\u306E\u4E0B",body:"\u53F0\u306E\u4E0B\u306B\u306F\u7A7A\u3044\u305F\u3068\u3053\u308D\u304C\u3042\u308A\u3001\u6301\u3061\u7269\u3092\u5165\u308C\u3066\u304A\u3051\u308B\u3002",source:"\u7BC711\u30FB13\uFF082152\u30FB2496\u884C\uFF09"},{title:"\u5353",body:"\u5965\u306E\u58C1\u306E\u4E0B\u306B\u5353\u304C\u4E00\u3064\u3042\u308B\u3002\u624B\u3092\u5F53\u3066\u308B\u3068\u9762\u306B\u884C\u304C\u51FA\u3066\u3001\u7D66\u990A\u3084\u6574\u5BB9\u306E\u6B04\u3092\u958B\u3051\u308B\u3002",source:"\u7BC711\uFF082097\u30FB2188\u20132195\u884C\uFF09"},{title:"\u5353\u4E0A\u306E\u7D19",body:"\u5353\u306E\u4E0A\u306B\u7D19\u304C\u4E8C\u679A\u3042\u308B\u3002\u638C\u3088\u308A\u5927\u304D\u304F\u3001\u7968\u3088\u308A\u8584\u3044\u3002\u7D66\u6C34\u3001\u7D66\u990A\u3001\u6D17\u6D44\u3001\u6392\u6CC4\u3001\u88AB\u670D\u3001\u6574\u5BB9\u3068\u3001\u5BA4\u306E\u6C7A\u307E\u308A\u304C\u66F8\u3044\u3066\u3042\u308B\u3002\u6301\u3063\u305F\u3068\u3053\u308D\u306F\u66C7\u308A\u3001\u606F\u3092\u5439\u3044\u3066\u3082\u6D88\u3048\u306A\u3044\u3002",source:"\u7BC711\uFF082113\u20132140\u884C\uFF09"},{title:"\u7D66\u990A\u306E\u53E3",body:"\u5353\u306E\u4E0B\u304C\u958B\u304F\u3068\u3001\u54C1\u7269\u304C\u305D\u3053\u306B\u7F6E\u3044\u3066\u3042\u308B\u3002\u4E0A\u304B\u3089\u843D\u3061\u3066\u304F\u308B\u306E\u3067\u306F\u306A\u3044\u3002",source:"\u7BC711\uFF082211\u884C\uFF09"},{title:"\u7A7A\u3044\u305F\u5E8A",body:"\u53F0\u3068\u53F0\u306E\u771F\u3093\u4E2D\u306B\u306F\u4F55\u3082\u306A\u3044\u3002\u4E8C\u4EBA\u304C\u4E26\u3093\u3067\u5BDD\u3089\u308C\u308B\u3060\u3051\u306E\u5E45\u304C\u3001\u4F7F\u308F\u308C\u306A\u3044\u307E\u307E\u6B8B\u3063\u3066\u3044\u308B\u3002\u5E8A\u306F\u5ECA\u3068\u540C\u3058\u6DE1\u3044\u767D\u3067\u3001\u7D99\u304E\u76EE\u304C\u306A\u3044\u3002",source:"\u7BC711\uFF082097\u30FB2107\u30FB2310\u884C\uFF09"},{title:"\u5965\u306E\u4ED5\u5207\u308A",body:"\u5965\u306B\u6238\u306F\u306A\u304F\u3001\u58C1\u304C\u4E00\u679A\u3001\u9014\u4E2D\u307E\u3067\u7ACB\u3063\u3066\u3044\u308B\u3002\u56DE\u308A\u8FBC\u3080\u3068\u5BA4\u304B\u3089\u306F\u898B\u3048\u306A\u304F\u306A\u308A\u3001\u5E8A\u306E\u6E9D\u3068\u6C34\u306E\u51FA\u308B\u3068\u3053\u308D\u304C\u3042\u308B\u3002\u96A3\u306B\u3082\u3046\u4E00\u679A\u3001\u58C1\u304C\u7ACB\u3064\u3002",source:"\u7BC711\uFF082156\u20132158\u884C\uFF09"},{title:"\u5929\u4E95\u306E\u660E\u308B\u3055",body:"\u5149\u308B\u9762\u306F\u898B\u3048\u306A\u3044\u3002\u591C\u306F\u7AEF\u304B\u3089\u6697\u304F\u306A\u308A\u3001\u771F\u3063\u6697\u306B\u306A\u308B\u524D\u306B\u6B62\u307E\u3063\u3066\u3001\u5ECA\u304B\u3089\u6765\u308B\u7D30\u3044\u5149\u3060\u3051\u304C\u6B8B\u308B\u3002\u671D\u306F\u6C7A\u307E\u3063\u305F\u901F\u3055\u3067\u3001\u307E\u305F\u660E\u308B\u304F\u306A\u308B\u3002",source:"\u7BC711\u30FB12\uFF082276\u20132278\u30FB2323\u884C\uFF09"}]},"04":{alt:"\u4EBA\u306E\u5C3A\u5EA6\u306E\u67B6\u304C\u3001\u9AD8\u304F\u7ACB\u3061\u4E0A\u304C\u308B\u767D\u6728\u306E\u5185\u5074\u3078\u91CD\u306A\u308B\u3002",topics:[{title:"\u67B6",body:"\u4EBA\u306E\u80CC\u3088\u308A\u9AD8\u304F\u3001\u5965\u884C\u304D\u306E\u3042\u308B\u67B6\u304C\u3001\u7B49\u9593\u9694\u306B\u7D9A\u3044\u3066\u3044\u308B\u3002",source:"\u7BC712\uFF082331\u884C\uFF09"},{title:"\u4E26\u3073\u306E\u7D42\u308F\u308A",body:"\u67B6\u306E\u4E26\u3073\u306F\u5965\u3078\u7D9A\u304D\u3001\u7D42\u308F\u308A\u306F\u6697\u3055\u306E\u4E2D\u306B\u5165\u3063\u3066\u3001\u3053\u3053\u304B\u3089\u306F\u898B\u3048\u306A\u3044\u3002",source:"\u7BC712\uFF082331\u884C\uFF09"},{title:"\u67B6\u306E\u7AEF\u306E\u9762",body:"\u67B6\u306E\u7AEF\u306B\u3001\u53D7\u5165\u9762\u3068\u540C\u3058\u677F\u306E\u3088\u3046\u306A\u9762\u304C\u7ACB\u3064\u3002\u80CC\u306B\u89E6\u308C\u308B\u3068\u70B9\u304D\u3001\u6307\u3092\u96E2\u3059\u3068\u6D88\u3048\u308B\u3002",source:"\u7BC712\u30FB13\uFF082345\u30FB2508\u884C\uFF09"},{title:"\u68DA\u3068\u7DB4\u3058",body:"\u67B6\u306B\u306F\u68DA\u304C\u901A\u308A\u3001\u539A\u3055\u3082\u80CC\u306E\u9AD8\u3055\u3082\u63C3\u308F\u306A\u3044\u7DB4\u3058\u304C\u3001\u9806\u306B\u4E26\u3079\u3066\u7F6E\u3044\u3066\u3042\u308B\u3002",source:"\u7BC712\uFF082339\u884C\uFF09"},{title:"\u8868\u7D19",body:"\u8868\u7D19\u306B\u306F\u3001\u65E5\u4ED8\u306E\u9023\u756A\u3068\u533A\u5206\u306E\u8A9E\u304C\u4E26\u3076\u3002",source:"\u7BC712\uFF082355\u884C\uFF09"},{title:"\u7DB4\u3058\u306E\u91CD\u3055",body:"\u7968\u3084\u5BA4\u306E\u7D19\u3088\u308A\u305A\u3063\u3068\u91CD\u304F\u3001\u4E21\u624B\u3067\u6301\u3063\u3066\u8AAD\u3080\u3002",source:"\u7BC712\uFF082353\u884C\uFF09"},{title:"\u7D19",body:"\u7D19\u306F\u5BA4\u306E\u3082\u306E\u3088\u308A\u539A\u304F\u3001\u7AEF\u304C\u786C\u3044\u3002\u3081\u304F\u3063\u305F\u9801\u3060\u3051\u7AEF\u304C\u67D4\u3089\u304B\u304F\u306A\u308A\u3001\u8272\u304C\u5909\u308F\u308B\u3002\u6307\u3092\u5F53\u3066\u305F\u80CC\u306F\u66C7\u308A\u3001\u305D\u306E\u66C7\u308A\u306F\u6D88\u3048\u306A\u3044\u3002",source:"\u7BC712\u30FB13\uFF082359\u20132391\u30FB2463\u884C\uFF09"},{title:"\u80CC\u306E\u9023\u756A",body:"\u68DA\u306F\u65E5\u4ED8\u306E\u9023\u756A\u306E\u9806\u306B\u4E26\u3076\u3002\u4E00\u65E5\u5206\u3060\u3051\u53F7\u304C\u629C\u3051\u3066\u3044\u308B\u304C\u3001\u9699\u9593\u306F\u8A70\u3081\u3066\u3042\u308A\u3001\u68DA\u306F\u7A7A\u3044\u3066\u3044\u306A\u3044\u3002",source:"\u7BC713\uFF082502\u30FB2541\u20132545\u884C\uFF09"},{title:"\u67B6\u306E\u3042\u3044\u3060",body:"\u67B6\u306E\u3042\u3044\u3060\u306B\u3082\u6DE1\u3044\u767D\u306E\u5E8A\u304C\u7D9A\u304F\u3002\u91CD\u3044\u7DB4\u3058\u306F\u5E8A\u306B\u5EA7\u3063\u3066\u8AAD\u3080\u3002\u3081\u304F\u308B\u97F3\u304C\u67B6\u306E\u3042\u3044\u3060\u306B\u6B8B\u3063\u3066\u6D88\u3048\u3001\u307B\u304B\u306B\u306F\u4F55\u306E\u97F3\u3082\u3057\u306A\u3044\u3002",source:"\u7BC712\uFF082329\u30FB2359\u20132361\u884C\uFF09"},{title:"\u4E0A\u306E\u6697\u3055",body:"\u5929\u4E95\u306F\u9AD8\u3044\u3002\u4E0A\u306E\u307B\u3046\u306F\u6697\u304F\u3001\u3069\u3053\u307E\u3067\u7D9A\u304F\u306E\u304B\u898B\u3048\u306A\u3044\u3002",source:"\u7BC712\uFF082329\u884C\uFF09"},{title:"\u660E\u308B\u3055",body:"\u660E\u308B\u3055\u306B\u306F\u51FA\u3069\u3053\u308D\u304C\u306A\u304F\u3001\u5F71\u304C\u3067\u304D\u306A\u3044\u3002\u6765\u305F\u65E5\u304B\u3089\u4E00\u5EA6\u3082\u52D5\u304B\u306A\u3044\u3002",source:"\u7BC713\u30FB22\uFF082498\u30FB3441\u884C\uFF09"}]},"05":{alt:"\u4E7E\u3044\u305F\u901A\u8DEF\u3001\u6C34\u8DEF\u3001\u305D\u306E\u4E0A\u3092\u5965\u3078\u4F38\u3073\u308B\u642C\u9001\u6841\u3002",topics:[{title:"\u6841",body:"\u6C34\u8DEF\u306E\u4E0A\u306B\u6841\u304C\u6E21\u3055\u308C\u3001\u540C\u3058\u9AD8\u3055\u3067\u5965\u307E\u3067\u7D9A\u304F\u3002\u6841\u306E\u4E0A\u306F\u6697\u3055\u3078\u629C\u3051\u3066\u3044\u308B\u3002",source:"\u7BC715\uFF082802\u884C\uFF09"},{title:"\u904B\u3070\u308C\u308B\u3082\u306E",body:"\u56DB\u89D2\u3044\u3082\u306E\u304C\u7B49\u9593\u9694\u306B\u3001\u540C\u3058\u901F\u3055\u3067\u3001\u6C34\u3068\u540C\u3058\u5411\u304D\u3078\u904B\u3070\u308C\u3066\u3044\u304F\u3002\u8FD1\u304F\u306E\u3082\u306E\u306F\u7DB4\u3058\u306E\u5F62\u3001\u9060\u304F\u306E\u3082\u306E\u306F\u5BB9\u5668\u306E\u5F62\u3092\u3057\u3066\u3044\u308B\u3002\u5E95\u306B\u306F\u3001\u95B2\u89A7\u5C64\u306E\u80CC\u3068\u540C\u3058\u632F\u308A\u65B9\u306E\u9023\u756A\u304C\u3042\u308B\u3002",source:"\u7BC715\uFF082802\u20132816\u884C\uFF09"},{title:"\u6C34\u8DEF",body:"\u9053\u3088\u308A\u5E83\u3044\u6C34\u8DEF\u3002\u6C34\u306F\u9ED2\u304F\u898B\u3048\u3001\u70B9\u306E\u4E0B\u3060\u3051\u304C\u9752\u7DD1\u3092\u8FD4\u3059\u3002\u305D\u306E\u8272\u306F\u6D41\u308C\u3068\u3068\u3082\u306B\u4F38\u3073\u3066\u3001\u307E\u305F\u5D29\u308C\u308B\u3002",source:"\u7BC715\uFF082798\u884C\uFF09"},{title:"\u6D41\u308C",body:"\u6D41\u308C\u306F\u901F\u304F\u3001\u624B\u3092\u5165\u308C\u308C\u3070\u6301\u3063\u3066\u3044\u304B\u308C\u308B\u3002\u884C\u3063\u305F\u304D\u308A\u623B\u3089\u305A\u3001\u884C\u304D\u5148\u306E\u8868\u793A\u306F\u306A\u3044\u3002\u6C34\u306E\u97F3\u306F\u5E8A\u3092\u4F1D\u3063\u3066\u4F4E\u304F\u97FF\u304F\u3002",source:"\u7BC715\u30FB16\uFF082796\u20132800\u30FB2845\u884C\uFF09"},{title:"\u9752\u7DD1\u306E\u70B9",body:"\u5C0F\u3055\u306A\u9752\u7DD1\u306E\u5149\u304C\u3001\u4F4E\u3044\u3068\u3053\u308D\u3067\u5E8A\u306B\u6CBF\u3063\u3066\u5217\u3092\u4F5C\u308B\u3002\u5217\u306F\u5965\u3067\u6298\u308C\u3001\u6697\u3055\u306B\u96A0\u308C\u308B\u3002\u660E\u304B\u308A\u3088\u308A\u5148\u306B\u3001\u305D\u306E\u51FA\u3069\u3053\u308D\u304C\u76EE\u306B\u5165\u308B\u3002",source:"\u7BC715\uFF082788\u884C\uFF09"},{title:"\u4E7E\u3044\u305F\u5E8A",body:"\u6C34\u8DEF\u306E\u8107\u306E\u5E8A\u306F\u786C\u304F\u3001\u4E7E\u3044\u3066\u3044\u308B\u3002\u4E0A\u306E\u5C64\u3088\u308A\u6E7F\u3063\u305F\u7A7A\u6C17\u304C\u6D41\u308C\u3066\u3044\u308B\u3002",source:"\u7BC715\uFF082786\u30FB2796\u884C\uFF09"},{title:"\u67B6\u306E\u4E26\u3073",body:"\u4E0A\u306E\u5C64\u3068\u540C\u3058\u5F62\u306E\u67B6\u304C\u3001\u540C\u3058\u9593\u9694\u3067\u4E26\u3076\u3002\u80CC\u306E\u756A\u53F7\u306F\u3001\u8FD1\u3065\u3051\u3070\u8AAD\u3081\u308B\u3002",source:"\u7BC715\u30FB16\uFF082834\u30FB2843\u20132845\u884C\uFF09"},{title:"\u4E0A\u306E\u6697\u3055",body:"\u70B9\u306E\u5149\u306F\u4F4E\u3044\u3068\u3053\u308D\u3067\u5C3D\u304D\u3001\u4E0A\u306F\u898B\u3048\u306A\u3044\u3002\u305D\u306E\u4E0A\u306B\u3001\u67B6\u306E\u5C64\u3068\u53F0\u306E\u5C64\u304C\u7A4D\u307F\u91CD\u306A\u3063\u3066\u3044\u308B\u3002",source:"\u7BC715\uFF082796\u30FB2802\u884C\uFF09"},{title:"\u5965\u306E\u6697\u3055",body:"\u6D41\u308C\u306E\u5411\u304D\u306B\u5E8A\u306F\u4E0B\u3063\u3066\u3044\u304F\u3002\u5965\u3078\u884C\u304F\u307B\u3069\u70B9\u306E\u9593\u9694\u304C\u5E83\u304C\u308A\u3001\u3042\u3044\u3060\u306B\u6697\u3055\u304C\u631F\u307E\u308B\u3002",source:"\u7BC721\uFF083280\u30FB3286\u884C\uFF09"}]},"06":{alt:"\u767D\u3044\u6728\u808C\u306E\u958B\u53E3\u304B\u3089\u3001\u5730\u5E73\u3078\u7D9A\u304F\u68EE\u3068\u7DDA\u8DEF\u3001\u642C\u9001\u5186\u76E4\u3092\u898B\u308B\u3002",topics:[{title:"\u5272\u308C\u76EE",body:"\u5916\u76AE\u306E\u5165\u53E3\u3068\u540C\u3058\u5F62\u306E\u5272\u308C\u76EE\u304C\u3001\u7E26\u306B\u958B\u3044\u3066\u3044\u308B\u3002\u5E45\u306F\u80A9\u3088\u308A\u5E83\u304F\u3001\u4E0A\u3078\u7D9A\u304D\u3001\u3069\u3053\u307E\u3067\u958B\u3044\u3066\u3044\u308B\u306E\u304B\u5206\u304B\u3089\u306A\u3044\u3002\u7E01\u306B\u7ACB\u3063\u3066\u3082\u7A7A\u6C17\u306F\u52D5\u304B\u305A\u3001\u5916\u306E\u660E\u308B\u3055\u3060\u3051\u304C\u5165\u3063\u3066\u304F\u308B\u3002",source:"\u7BC722\uFF083449\u30FB3473\u884C\uFF09"},{title:"\u6A2A\u304B\u3089\u306E\u5149",body:"\u6607\u964D\u304C\u6B62\u307E\u308B\u524D\u304B\u3089\u3001\u660E\u308B\u3055\u304C\u5909\u308F\u308B\u3002\u3053\u3053\u3067\u306F\u5149\u304C\u6A2A\u304B\u3089\u6765\u308B\u3002",source:"\u7BC722\uFF083437\u20133439\u884C\uFF09"},{title:"\u659C\u3081\u306E\u5F71",body:"\u5E8A\u306B\u5F71\u304C\u659C\u3081\u306B\u4F38\u3073\u308B\u3002\u5206\u9928\u306E\u4E2D\u3067\u5F71\u304C\u51FA\u308B\u306E\u306F\u3001\u3053\u306E\u5C64\u3060\u3051\u3060\u3002",source:"\u7BC722\uFF083441\u20133447\u884C\uFF09"},{title:"\u4F4E\u3044\u5EFA\u7269",body:"\u9060\u304F\u306E\u5E73\u3089\u306A\u571F\u306B\u3001\u4F4E\u3044\u5EFA\u7269\u304C\u540C\u3058\u9593\u9694\u3067\u3001\u898B\u3048\u308B\u304B\u304E\u308A\u4E26\u3076\u3002\u9060\u3044\u3082\u306E\u307B\u3069\u8584\u304F\u3001\u660E\u308B\u3055\u306E\u4E2D\u3067\u5207\u308C\u308B\u3002",source:"\u7BC722\uFF083455\u884C\uFF09"},{title:"\u4E00\u672C\u306E\u7DDA",body:"\u5EFA\u7269\u306E\u3042\u3044\u3060\u3092\u3001\u4E00\u672C\u306E\u7DDA\u304C\u6765\u305F\u307B\u3046\u3078\u307E\u3063\u3059\u3050\u4F38\u3073\u3066\u3044\u308B\u3002\u3069\u308C\u304C\u964D\u308A\u305F\u99C5\u306A\u306E\u304B\u306F\u3001\u3053\u3053\u304B\u3089\u306F\u898B\u5206\u3051\u3089\u308C\u306A\u3044\u3002",source:"\u7BC722\u30FB26\uFF083455\u30FB4048\u884C\uFF09"},{title:"\u958B\u304D\u306E\u5916",body:"\u679D\u8449\u304C\u91CD\u306A\u308A\u3001\u5730\u5E73\u307E\u3067\u68EE\u304C\u7D9A\u304F\u3002\u305D\u306E\u5148\u306B\u3001\u6D77\u306E\u7DDA\u304C\u660E\u308B\u304F\u5149\u308B\u3002",source:"\u4F5C\u8005\u306E\u69CB\u6210\uFF082026-09-23\u30FB09-26\uFF1A\u539F\u5178\u306E\u5916\u666F\u3092Binary Dusk\u306E\u68EE\u30FB\u7DDA\u8DEF\u30FB\u642C\u9001\u5186\u76E4\u3078\u5909\u66F4\u3001\u6D77\u5CB8\u7DDA\u3092\u8FFD\u52A0\uFF09"},{title:"\u5149\u306E\u5F53\u305F\u308B\u67B6",body:"\u95B2\u89A7\u5C64\u3068\u540C\u3058\u5F62\u306E\u67B6\u304C\u3001\u540C\u3058\u9593\u9694\u3067\u5965\u3078\u7D9A\u304F\u3002\u5272\u308C\u76EE\u306B\u8FD1\u3044\u5217\u307B\u3069\u80CC\u306E\u8272\u304C\u6FC3\u304F\u3001\u5965\u3078\u884C\u304F\u307B\u3069\u767D\u3044\u3002\u305D\u306E\u3042\u3044\u3060\u306F\u9014\u5207\u308C\u305A\u306B\u79FB\u308A\u5909\u308F\u308B\u3002\u5149\u306E\u7E01\u304C\u67B6\u306E\u4E0A\u3092\u52D5\u304F\u3068\u3001\u767D\u3044\u3068\u3053\u308D\u304C\u5C11\u3057\u305A\u3064\u72ED\u304F\u306A\u308B\u3002",source:"\u7BC722\uFF083475\u20133481\u30FB3561\u884C\uFF09"},{title:"\u8AAD\u307E\u308C\u306A\u3044\u7DB4\u3058",body:"\u5272\u308C\u76EE\u306B\u8FD1\u3044\u7DB4\u3058\u306F\u8EFD\u304F\u3001\u7AEF\u304C\u67D4\u3089\u304B\u3044\u3002\u4E0B\u306E\u53E4\u3044\u5C64\u3068\u540C\u3058\u624B\u3056\u308F\u308A\u3067\u3001\u80CC\u306B\u66C7\u308A\u306F\u306A\u3044\u3002",source:"\u7BC722\uFF083487\u884C\uFF09"},{title:"\u52D5\u304F\u3082\u306E\u306E\u306A\u3044\u5965",body:"\u3042\u308B\u9AD8\u3055\u304B\u3089\u642C\u9001\u306E\u97F3\u304C\u6D88\u3048\u3001\u3053\u306E\u5C64\u306B\u306F\u52D5\u304F\u3082\u306E\u304C\u306A\u3044\u3002",source:"\u7BC722\uFF083433\u20133435\u884C\uFF09"},{title:"\u7A93\u8FBA\u306E\u53F0",body:"\u58C1\u306B\u636E\u3048\u4ED8\u3051\u305F\u53F0\u3068\u3001\u305D\u306E\u524D\u306B\u7F6E\u3044\u305F\u6905\u5B50\u3002\u53D7\u5165\u9762\u3068\u540C\u3058\u767D\u6728\u3067\u3001\u5E8A\u304B\u3089\u7ACB\u3061\u4E0A\u304C\u308B\u3002\u53F0\u306E\u305D\u3070\u306E\u5C0F\u3055\u306A\u958B\u304D\u304B\u3089\u3001\u624B\u3082\u3068\u306B\u5149\u304C\u5165\u308B\u3002",source:"\u4F5C\u8005\u306E\u69CB\u6210\uFF082026-09-26\uFF1A\u95B2\u89A7\u7528\u306E\u53F0\u3068\u6905\u5B50\u3001\u63A1\u5149\u306E\u7A93\uFF09"}]},"07":{alt:"\u4F4E\u304F\u7D30\u9577\u3044\u679D\u306E\u5185\u5074\u3002\u67B6\u306F\u5965\u3078\u5411\u304B\u3063\u3066\u6E1B\u3063\u3066\u3044\u304F\u3002",topics:[{title:"\u4F4E\u3044\u5929\u4E95",body:"\u679D\u306E\u5185\u5074\u306F\u7D30\u9577\u304F\u3001\u5929\u4E95\u306F\u624B\u3092\u4F38\u3070\u305B\u3070\u5C4A\u304F\u307B\u3069\u4F4E\u3044\u3002\u5E45\u306F\u67B6\u4E8C\u5217\u5206\u3067\u3001\u305D\u306E\u4E8C\u5217\u304C\u307E\u3063\u3059\u3050\u5965\u3078\u7D9A\u304F\u3002",source:"\u7BC724\uFF083736\u884C\uFF09"},{title:"\u5149\u306E\u958B\u304D",body:"\u7247\u5074\u306E\u58C1\u306E\u9AD8\u3044\u3068\u3053\u308D\u306B\u3001\u7D30\u3044\u958B\u304D\u304C\u7B49\u9593\u9694\u306B\u4E26\u3076\u3002\u305D\u3053\u304B\u3089\u5149\u304C\u659C\u3081\u306B\u843D\u3061\u308B\u3002",source:"\u7BC724\uFF083738\u884C\uFF09"},{title:"\u5E8A\u306E\u5E2F",body:"\u5E8A\u306B\u660E\u308B\u3044\u5E2F\u304C\u7B49\u9593\u9694\u306B\u4E26\u3076\u3002\u5E45\u3082\u89D2\u5EA6\u3082\u540C\u3058\u3067\u3001\u5F71\u306F\u5E2F\u306E\u4E2D\u3067\u3060\u3051\u4F38\u3073\u308B\u3002\u5E2F\u306F\u5916\u306E\u5149\u306B\u3064\u308C\u3066\u3086\u3063\u304F\u308A\u305A\u308C\u3001\u679D\u306E\u5148\u306E\u307B\u3046\u3078\u5BC4\u3063\u3066\u3044\u304F\u3002",source:"\u7BC724\u30FB25\uFF083738\u30FB3742\u30FB3812\u884C\uFF09"},{title:"\u80CC\u306E\u8272",body:"\u3053\u3053\u306E\u7DB4\u3058\u306E\u80CC\u306F\u3001\u5916\u5074\u307B\u3069\u767D\u304F\u306A\u3044\u3002\u305D\u308C\u3067\u3082\u5916\u5149\u5C64\u306E\u80CC\u3088\u308A\u6FC3\u3044\u3002",source:"\u7BC724\uFF083746\u884C\uFF09"},{title:"\u67B6",body:"\u679D\u306E\u4E2D\u306B\u3082\u67B6\u304C\u3042\u308B\u3002\u95B2\u89A7\u5C64\u3068\u540C\u3058\u5F62\u306E\u67B6\u304C\u3001\u4E8C\u5217\u4E26\u3093\u3067\u5965\u3078\u7D9A\u304F\u3002",source:"\u7BC724\uFF083736\u884C\uFF09"},{title:"\u6E1B\u308B\u7DB4\u3058",body:"\u5965\u3078\u884C\u304F\u307B\u3069\u7DB4\u3058\u304C\u6E1B\u308B\u3002\u4E8C\u5217\u304C\u4E00\u5217\u306B\u306A\u308A\u3001\u4E0B\u306E\u6BB5\u304C\u7A7A\u3044\u3066\u3001\u4E0A\u306E\u6BB5\u3060\u3051\u304C\u6B8B\u308B\u3002",source:"\u7BC724\u30FB25\uFF083746\u30FB3981\u884C\uFF09"},{title:"\u4E09\u518A",body:"\u7DB4\u3058\u306E\u6B8B\u308B\u3044\u3061\u3070\u3093\u5965\u306E\u68DA\u306B\u3001\u4E09\u518A\u304C\u8F09\u3063\u3066\u3044\u308B\u3002\u5916\u5074\u306E\u4E00\u518A\u307B\u3069\u5B57\u304C\u8584\u304F\u3001\u7AEF\u307B\u3069\u767D\u3044\u3002\u89D2\u5EA6\u3092\u3064\u3051\u3066\u898B\u308B\u3068\u3001\u5B57\u306E\u3042\u3063\u305F\u5834\u6240\u304C\u6D45\u304F\u51F9\u3093\u3067\u3044\u308B\u3002",source:"\u7BC724\uFF083748\u20133752\u884C\uFF09"},{title:"\u7D30\u304F\u306A\u308B\u5148",body:"\u5965\u3078\u884C\u304F\u307B\u3069\u5E45\u304C\u72ED\u307E\u308A\u3001\u5929\u4E95\u3082\u4E0B\u304C\u308B\u3002\u305D\u306E\u5148\u306F\u67B6\u3082\u5165\u3089\u306A\u3044\u7D30\u3055\u306B\u306A\u308A\u3001\u5149\u306E\u958B\u304D\u3082\u5C3D\u304D\u3066\u3001\u7D42\u308F\u308A\u306F\u6697\u3055\u306E\u4E2D\u3067\u898B\u3048\u306A\u3044\u3002\u5965\u304B\u3089\u7A7A\u6C17\u304C\u3086\u3063\u304F\u308A\u6D41\u308C\u3066\u304F\u308B\u3002",source:"\u7BC724\u30FB25\uFF083736\u30FB3886\u20133896\u884C\uFF09"}]}};var la=[{id:"exterior",name:"\u5916\u76AE",items:[{id:"entrance",landscape:[.49,.08,.13,.78],portrait:[.47,.17,.29,.56]},{id:"above",landscape:[.49,0,.12,.07],portrait:[.48,0,.22,.15]},{id:"inside",landscape:[.555,.18,.05,.45],portrait:[.6,.3,.13,.3]},{id:"intake",landscape:[.553,.72,.03,.08],portrait:[.6,.64,.06,.09]},{id:"bark",landscape:[.34,.05,.14,.65],portrait:[.2,.18,.25,.45]},{id:"touch",landscape:[.63,.05,.12,.55],portrait:[.77,.15,.23,.5]},{id:"root",landscape:[0,.12,.33,.73],portrait:[0,.3,.19,.6]},{id:"fold",landscape:[.76,.38,.24,.35],portrait:[0,.88,.18,.12]},{id:"path",landscape:[.36,.87,.62,.13],portrait:[.2,.78,.78,.21]}]},{id:"intake",name:"\u53D7\u5165",items:[{id:"intake",landscape:[.39,.6,.09,.32],portrait:[.27,.56,.18,.23]},{id:"hollow",landscape:[.395,.655,.075,.03],portrait:[.275,.6,.16,.03]},{id:"slip",landscape:[.466,.605,.022,.06],portrait:[.44,.57,.035,.05]},{id:"lift",landscape:[.59,.41,.08,.34],portrait:[.68,.43,.16,.23]},{id:"mark",landscape:[.57,.74,.14,.06],portrait:[.62,.655,.25,.05]},{id:"floor",landscape:[.3,.82,.4,.18],portrait:[.3,.78,.65,.22]},{id:"edge",landscape:[.72,.7,.28,.12],portrait:[.86,.62,.14,.06]},{id:"ceiling",landscape:[.45,0,.4,.2],portrait:[.35,0,.6,.15]},{id:"wall",landscape:[.78,.22,.22,.42],portrait:[.4,.2,.3,.35]},{id:"outside",landscape:[.27,.02,.1,.68],portrait:[0,.05,.22,.6]}]},{id:"room",name:"\u5C45\u5BA4",items:[{id:"beds",landscape:[.615,.4,.26,.26],portrait:[.74,.43,.26,.18]},{id:"mat",landscape:[.34,.46,.09,.25],portrait:[.15,.47,.2,.18]},{id:"under",landscape:[.64,.6,.22,.06],portrait:[.75,.6,.24,.05]},{id:"table",landscape:[.39,.35,.145,.14],portrait:[.27,.405,.3,.085]},{id:"papers",landscape:[.415,.335,.09,.03],portrait:[.32,.39,.18,.025]},{id:"hatch",landscape:[.405,.4,.115,.08],portrait:[.29,.44,.25,.045]},{id:"floor",landscape:[.55,.62,.25,.25],portrait:[.35,.62,.4,.3]},{id:"partition",landscape:[.575,.05,.13,.37],portrait:[.65,.21,.27,.24]},{id:"light",landscape:[.3,0,.45,.06],portrait:[.1,0,.8,.16]}]},{id:"reading",name:"\u95B2\u89A7\u5C64",items:[{id:"shelves",landscape:[.62,.45,.38,.55],portrait:[.62,.53,.38,.3]},{id:"end",landscape:[.47,.66,.06,.1],portrait:[.44,.6,.1,.08]},{id:"panel",landscape:[.73,.45,.05,.53],portrait:[.755,.54,.035,.28]},{id:"bindings",landscape:[.09,0,.29,.95],portrait:[0,.17,.25,.8]},{id:"covers",landscape:[.15,.01,.14,.33],portrait:[0,.18,.18,.28]},{id:"weight",landscape:[.095,.56,.19,.4],portrait:[0,.53,.12,.27]},{id:"paper",landscape:[.3,.56,.06,.07],portrait:[.09,.545,.11,.04]},{id:"serial",landscape:[.4,.4,.07,.5],portrait:[.25,.4,.18,.55]},{id:"floor",landscape:[.45,.76,.16,.24],portrait:[.35,.72,.4,.28]},{id:"height",landscape:[.38,0,.2,.55],portrait:[.25,0,.4,.5]},{id:"light",landscape:[.6,0,.4,.4],portrait:[.65,0,.35,.45]}]},{id:"lower",name:"\u4E0B\u5C64",items:[{id:"girder",landscape:[.55,.28,.45,.25],portrait:[.47,.35,.53,.17]},{id:"cargo",landscape:[.68,.12,.12,.13],portrait:[.55,.37,.25,.09]},{id:"water",landscape:[.55,.78,.45,.22],portrait:[.55,.7,.45,.3]},{id:"flow",landscape:[.46,.6,.15,.18],portrait:[.4,.56,.3,.14]},{id:"lights",landscape:[.44,.58,.06,.34],portrait:[.35,.58,.1,.3]},{id:"walkway",landscape:[.1,.72,.34,.28],portrait:[0,.65,.35,.35]},{id:"shelves",landscape:[0,0,.3,.7],portrait:[0,0,.13,.6]},{id:"above",landscape:[.43,0,.25,.22],portrait:[.35,0,.55,.25]},{id:"far",landscape:[.43,.25,.13,.35],portrait:[.35,.33,.27,.22]}]},{id:"daylight",name:"\u5916\u5149\u5C64",items:[{id:"opening",landscape:[.38,0,.09,1],portrait:[.33,0,.1,.6]},{id:"light",landscape:[.47,.05,.08,.5],portrait:[.4,.05,.18,.45]},{id:"shadow",landscape:[.55,.6,.45,.4],portrait:[.3,.6,.7,.4]},{id:"town",landscape:[.13,.66,.3,.21],portrait:[0,.6,.3,.13]},{id:"line",landscape:[.28,.635,.15,.04],portrait:[.08,.585,.22,.03]},{id:"forest",landscape:[0,.29,.43,.33],portrait:[0,.36,.38,.22]},{id:"shelves",landscape:[.7,0,.3,.5],portrait:[.9,.25,.1,.18]},{id:"bindings",landscape:[.84,.1,.16,.38],portrait:[.94,.3,.06,.12]},{id:"quiet",landscape:[.55,.1,.15,.3],portrait:[.6,.25,.3,.15]},{id:"desk",landscape:[.53,.3,.09,.2],portrait:[.57,.37,.17,.14]}]},{id:"branch",name:"\u679D\u306E\u5185\u90E8",items:[{id:"ceiling",landscape:[.25,0,.5,.22],portrait:[.2,0,.6,.3]},{id:"openings",landscape:[.24,.02,.16,.3],portrait:[0,.2,.3,.2]},{id:"bands",landscape:[.48,.44,.12,.37],portrait:[.44,.46,.28,.24]},{id:"spines",landscape:[.65,.25,.35,.75],portrait:[.8,.33,.2,.55]},{id:"shelves",landscape:[0,.4,.27,.6],portrait:[0,.42,.12,.28]},{id:"fewer",landscape:[.27,.34,.15,.45],portrait:[.13,.4,.19,.22]},{id:"three",landscape:[.4,.315,.035,.04],portrait:[.305,.38,.045,.025]},{id:"far",landscape:[.43,.24,.11,.18],portrait:[.34,.33,.24,.14]}]}];function id(i=document.body){let e=document.createElement("canvas"),t=e.getContext("2d"),n=null,r=null,s=0,a=!1;e.getBoundingClientRect=()=>n?.getBoundingClientRect()??{left:0,top:0,width:0,height:0};function o(){!a&&!document.hidden&&!s&&(s=requestAnimationFrame(l))}function l(d){s=0,!(a||document.hidden)&&(n?r?.afterRender(d):r?.ui.read(d),i.dataset.uiMode=r?.failed?"fallback":r?.ui.result.simplified?"simple":r?.ui.opticsReady?"ready":"simple",r&&(i.dataset.uiFrames=String(r.frames),i.dataset.uiCaptures=String(r.optics?.captureCount??0)),r?.ui.busy()&&o())}try{r=new window.H53LiquidHost({root:i,source:()=>n?e:null,requestFrame:o,surfaces:[{selector:"#scenes button,#back,#menuToggle,#showUI,#retry",kind:"control"},{selector:"#menu",kind:"panel",anchor:"#menuToggle"},{selector:"#info",kind:"panel",anchor:"#menuToggle"},{selector:"#closeInfo",kind:"control",parent:"#info"}],maxPixels:6e5,maxDpr:1.5,backdropColor:[20/255,23/255,19/255]})}catch{i.classList.add("h53-liquid-host","h53-liquid-simple"),i.dataset.uiMode="fallback"}function c(){n=null,r&&(r.overlay.hidden=!0,r.ui.setOpticsReady(!1)),o()}function u(d){if(a||!d?.isConnected)return;let f=d.videoWidth||d.naturalWidth||d.width,g=d.videoHeight||d.naturalHeight||d.height;if(!f||!g)return;let _=Math.min(1,Math.sqrt(6e5/(f*g))),m=Math.round(f*_),p=Math.round(g*_);try{(e.width!==m||e.height!==p)&&(e.width=m,e.height=p),t.clearRect(0,0,m,p),t.drawImage(d,0,0,m,p),n=d,r?.afterRender(performance.now()),o()}catch(M){r?.fallback(M),i.dataset.uiMode="fallback"}}let h=()=>{document.hidden?(cancelAnimationFrame(s),s=0):o()};return document.addEventListener("visibilitychange",h),{capture:u,clear:c,request:o,open(d,f){r?(r.ui.open(d,f),r.lock(d)):(d.hidden=!1,d.setAttribute("aria-modal","true")),o()},close(d,f){r?r.ui.close(d,()=>{r.unlock(),f?.(),o()}):(d.hidden=!0,d.removeAttribute("aria-modal"),f?.()),o()},hide(d){r?(r.ui.hide(d),r.blocked===d&&r.unlock()):(d.hidden=!0,d.removeAttribute("aria-modal")),o()},fullscreen(d,f){r?r.fullscreen(d,f):f?.()},dispose(){if(!a){if(a=!0,cancelAnimationFrame(s),document.removeEventListener("visibilitychange",h),r){for(let d of["pointerdown","pointermove","pointerup","mousedown","mouseup","click","touchstart","touchmove","touchend","wheel"])document.removeEventListener(d,r.onGuard,!0);document.removeEventListener("keydown",r.onKey,!0),r.onFullscreen&&(document.removeEventListener("fullscreenchange",r.onFullscreen),document.removeEventListener("webkitfullscreenchange",r.onFullscreen)),r.ui.dispose(),r.optics?.dispose(),r.overlay.remove()}n=null,e.width=e.height=1}}}}function rd({mount:i,onState:e=()=>{},onFrame:t=()=>{}}){let n=Promise.resolve(),r=0,s,a=null,o="landscape",l={},c=!1,u=!0,h=()=>new DOMException("Scene selection changed","AbortError");async function d(){a&&(await a.dispose(),a=null)}function f(p,M){return new Promise((R,S)=>{let v=()=>{M.removeEventListener("abort",v),S(h())};M.addEventListener("abort",v,{once:!0}),M.aborted&&v(),Promise.resolve(p).then(T=>{M.removeEventListener("abort",v),R(T)},T=>{M.removeEventListener("abort",v),S(T)})})}function g(p,M={}){let R=++r;s?.abort(),s=new AbortController;let S=s.signal;o=M.orientation??o,l=M.quality??l;let v=()=>R===r&&!S.aborted,T=w=>{v()&&e(w)};return T({phase:"loading"}),n=n.catch(()=>{}).then(async()=>{try{if(await d(),!v())return;let w;if(a=await i(p,{signal:S,orientation:o,quality:l,onStatus(E){E.phase==="error"&&(w=new Error(E.message||"Scene unavailable")),T(E)},onFrame(E){v()&&t(E,a?.status)}}),!v()){await d();return}a.setVisible?.(u),a.setPlaying?.(!1);let y=await f(a.ready,S);if(w||y?.phase==="error")throw w??new Error(y.message||"Scene unavailable");if(!v()||(await a.setOrientation(o),!v()))return;a.setVisible?.(u),a.setPlaying?.(c&&u)}catch(w){try{await d()}catch(y){T({phase:"error",message:y.message});return}v()&&T({phase:"error",message:w.message})}}),n}function _(p){if(p===o)return n;o=p;let M=r;return n=n.catch(()=>{}).then(async()=>{if(!(M!==r||!a))try{await a.setOrientation(o)}catch(R){M===r&&e({phase:"error",message:R.message})}}),n}function m(p){l=p;let M=r;return n=n.catch(()=>{}).then(async()=>{if(!(M!==r||!a?.resize))try{await a.resize(l)}catch(R){M===r&&e({phase:"error",message:R.message})}}),n}return{select:g,setOrientation:_,resize:m,setPlaying(p){c=!!p,a?.setPlaying?.(c&&u)},setVisible(p){u=!!p,a?.setVisible?.(u),a?.setPlaying?.(c&&u)},async dispose(){++r,s?.abort(),await n.catch(()=>{}),await d()}}}var $=Object.fromEntries(["app","stage","frame","live","hotspots","navigation","scenes","scene-current","loading","failure","failureText","retry","motionNote","menu","menuToggle","closeMenu","pause","targets","about","fullscreen","hideUI","showUI","menuStatus","info","infoTitle","infoBody","closeInfo","back"].map(i=>[i,document.getElementById(i)])),ku=gl.map((i,e)=>({...i,id:la[e].id,number:i.id,name:la[e].name,alt:_l[i.id].alt,hotspots:la[e].items.map((t,n)=>({...t,..._l[i.id].topics[n]}))})),gv=matchMedia("(orientation: portrait)"),Ou=matchMedia("(prefers-reduced-motion: reduce)"),mt,Zn="",Bu=0,fi=!1,Ln=null,yn="closed",Gu=null,rs=0,hl=0,Sp=!1,ss=!Ou.matches,bp="",Vu=0,_v=ku.map(i=>{let e=document.createElement("button");return e.className="pill",e.type="button",e.textContent=i.name,e.dataset.scene=i.id,e.disabled=i.available===!1,e.onclick=()=>as(i.id,{history:"push"}),$.scenes.append(e),e}),vn=id();function zu(){return gv.matches?"portrait":"landscape"}var Fi=rd({async mount(i,e){if(i.available===!1)throw new Error("SCENE_PENDING");let t=await(i.presentation==="hybrid"?Promise.resolve().then(()=>(xp(),_p)):Promise.resolve().then(()=>(vp(),yp)));return e.signal.throwIfAborted(),t.mountPreview({...e,sceneId:i.number,container:$.live})},onFrame(i,e){$.app.dataset.renderSource=mt?.presentation==="jpeg"?"jpeg":"live-3d",$.app.dataset.frameCount=String(Number($.app.dataset.frameCount||0)+1),$.app.dataset.renderSize=(i.naturalWidth||i.width)+"x"+(i.naturalHeight||i.height),$.app.dataset.lastFrameMs=String(performance.now()),e?.seconds!==void 0&&($.app.dataset.sceneSeconds=String(e.seconds)),e?.limits?.staticCache&&($.app.dataset.staticBuilds=String(e.limits.staticCache.builds),$.app.dataset.cachedFrames=String(e.limits.staticCache.frames)),e?.frameGate&&($.app.dataset.frameGate=JSON.stringify(e.frameGate)),$.app.dataset.frameCount==="1"&&($.app.dataset.firstFrameElapsedMs=String(performance.now()-Number($.app.dataset.startedAt))),vn.capture(i)},onState(i){mt&&($.stage.dataset.phase=i.phase,$.stage.dataset.updatedAt=String(Date.now()),i.completed!==void 0&&($.stage.dataset.completed=String(i.completed)),i.total!==void 0&&($.stage.dataset.total=String(i.total)),$.stage.dataset.detail=i.message||"",i.phase==="loading"?(fi=!1,$.app.dataset.ready="false",$.targets.disabled=!0,$.hotspots.inert=!0,$.loading.hidden=!1,$.failure.hidden=!0,$.stage.setAttribute("aria-busy","true")):i.phase==="ready"?(fi=!0,$.app.dataset.ready="true",$.frame.classList.add("ready"),$.loading.hidden=!0,$.failure.hidden=!0,$.targets.disabled=!1,$.stage.setAttribute("aria-busy","false"),$.hotspots.childElementCount!==mt.hotspots.length?xv():Wu(),$.hotspots.inert=yn!=="closed",sa()):i.phase==="error"&&(fi=!1,$.app.dataset.ready="false",$.targets.disabled=!0,$.hotspots.inert=!0,$.loading.hidden=!0,$.failure.hidden=!1,$.stage.setAttribute("aria-busy","false"),$.failureText.textContent=i.message==="SCENE_PENDING"?mt.name+"\u306F\u6E96\u5099\u4E2D\u3067\u3059\u3002\u4ED6\u306E\u666F\u3092\u3054\u89A7\u304F\u3060\u3055\u3044\u3002":mt.name+"\u3092\u8868\u793A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u5225\u306E\u666F\u3092\u958B\u304F\u304B\u3001\u3082\u3046\u4E00\u5EA6\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",$.retry.hidden=i.message==="SCENE_PENDING",$.stage.dataset.error=i.message||"Scene unavailable"))}});function Mp(){return{longEdge:Math.min(innerWidth,innerHeight)<600?960:1280,shadowMapSize:512,samplesPerLamp:mt?.number==="03"?16:4,...mt?.presentation==="jpeg"?{jpegLongEdge:Math.ceil(Math.max(innerWidth,innerHeight)*Math.min(devicePixelRatio,2))}:{}}}function Hu(){$.pause.textContent=ss?"Pause":"Play",$.pause.setAttribute("aria-pressed",String(!ss))}function sa(){Fi.setVisible(!document.hidden),Fi.setPlaying(fi&&!!mt?.animated&&ss&&Ln!==$.info&&yn!=="closing")}function dl(){if(!mt)return;let i=$.stage.getBoundingClientRect(),e=Zn==="portrait"?288:512,t=Zn==="portrait"?512:288,n=Math.min(i.width/e,i.height/t);$.frame.style.width=e*n+"px",$.frame.style.height=t*n+"px",document.documentElement.style.setProperty("--nav-height",Math.ceil($.navigation.getBoundingClientRect().height)+"px"),Wu(),vn.request()}function Wu(){let i=$.frame.getBoundingClientRect(),e=$.scenes.getBoundingClientRect();for(let t of $.hotspots.children){let n=mt.hotspots.find(d=>d.id===t.dataset.targetId),r=n[Zn],s=Math.max(44,r[2]*i.width),a=Math.max(44,r[3]*i.height),o=Math.min(i.width-s/2,Math.max(s/2,(r[0]+r[2]/2)*i.width)),l=Math.min(i.height-a/2,Math.max(a/2,(r[1]+r[3]/2)*i.height)),c=i.left+o-s/2,u=i.left+o+s/2,h=e.top-i.top-8;if(u>e.left-4&&c<e.right+4&&l+a/2>h){let d=Math.min(l-a/2,h-44);a=Math.max(44,h-d),l=d+a/2}Object.assign(t.style,{left:o+"px",top:l+"px",width:s+"px",height:a+"px",zIndex:String(1+Math.round(1e7/(s*a)))})}}function xv(){$.hotspots.replaceChildren();let i=Bu;mt.hotspots.forEach(e=>{let t=document.createElement("button");t.type="button",t.className="hotspot",t.dataset.targetId=e.id,t.setAttribute("aria-label",e.title+"\u306E\u6587\u7AE0\u3092\u958B\u304F"),t.setAttribute("aria-haspopup","dialog"),t.onclick=()=>{i===Bu&&fi&&vv(e,t)},$.hotspots.append(t)}),Wu()}function Xu(i){$.hotspots.inert=i||!fi,$.navigation.inert=i,$.back.inert=i,$.menuToggle.inert=i,$.showUI.inert=i,document.body.classList.toggle("reading",i)}function yv(){++rs,Ln&&vn.hide(Ln),Ln=null,yn="closed",Gu=null,Xu(!1),$.menuToggle.setAttribute("aria-expanded","false"),$.hotspots.querySelectorAll(".selected").forEach(i=>i.classList.remove("selected"))}function fl(i,e){if(yn!=="closed"||performance.now()<hl)return;Ln=i,yn="open",Gu=e,Xu(!0);let t=++rs;i===$.info&&Fi.setPlaying(!1),i===$.menu&&$.menuToggle.setAttribute("aria-expanded","true"),vn.open(i,e),requestAnimationFrame(()=>{t===rs&&(i===$.menu?$.closeMenu:$.closeInfo).focus({preventScroll:!0})})}function sr(i){if(yn!=="open")return;yn="closing";let e=++rs,t=Ln,n=Gu;vn.close(t,()=>{e===rs&&(Ln=null,$.menuToggle.setAttribute("aria-expanded","false"),$.hotspots.querySelectorAll(".selected").forEach(r=>r.classList.remove("selected")),hl=performance.now()+220,setTimeout(()=>{e===rs&&(yn="closed",Xu(!1),i?i():n?.isConnected&&!n.closest("[hidden]")?n.focus({preventScroll:!0}):$.menuToggle.focus({preventScroll:!0}),sa())},225))})}function vv(i,e){yn!=="closed"||performance.now()<hl||($.infoTitle.textContent=i.title,$.infoBody.textContent=i.body,$.infoBody.scrollTop=0,$.info.dataset.scene=mt.id,$.info.dataset.target=i.id,e.classList.add("selected"),fl($.info,e))}function Sv(){sr(()=>{$.infoTitle.textContent="\u5BFE\u8C61\u4E00\u89A7",$.infoBody.replaceChildren(),delete $.info.dataset.target;let i=document.createElement("div");i.className="target-list";for(let e of mt.hotspots){let t=document.createElement("button");t.type="button",t.textContent=e.title,t.onclick=()=>{$.infoTitle.textContent=e.title,$.infoBody.textContent=e.body,$.infoBody.scrollTop=0,$.info.dataset.target=e.id,$.closeInfo.focus({preventScroll:!0}),vn.request()},i.append(t)}$.infoBody.append(i),fl($.info,$.menuToggle)})}function bv(){sr(()=>{delete $.info.dataset.target,$.infoTitle.textContent="\u66F8\u5EAB / SHOKO",$.infoBody.textContent=`h!ro53 / deus ex machina

\u4E03\u3064\u306E\u56FA\u5B9A\u3057\u305F\u60C5\u666F\u3092\u5DE1\u308B\u3002
\u753B\u9762\u4E0B\u3067\u5834\u6240\u3092\u9078\u3073\u3001\u5BFE\u8C61\u306B\u89E6\u308C\u3066\u6587\u7AE0\u3092\u8AAD\u3080\u3002`,fl($.info,$.menuToggle)})}function as(i,{force:e=!1,history:t="replace"}={}){if(!e&&(yn!=="closed"||performance.now()<hl))return;let n=ku.find(s=>s.id===i||s.number===i)||ku[0];if(!e&&n===mt&&fi)return;++Bu,fi=!1,yv(),Fi.setPlaying(!1),vn.clear(),mt=n,Zn=zu(),$.app.dataset.scene=mt.id,$.app.dataset.orientation=Zn,$.app.dataset.ready="false",$.app.dataset.startedAt=String(performance.now()),$.app.dataset.frameCount="0",delete $.app.dataset.firstFrameElapsedMs,delete $.app.dataset.renderSize,delete $.app.dataset.renderSource,delete $.stage.dataset.error,$.frame.classList.remove("ready"),$.hotspots.replaceChildren(),$.stage.setAttribute("aria-busy","true"),$.loading.hidden=!1,$.failure.hidden=!0,$.retry.hidden=!1,$.pause.hidden=!mt.animated,$.targets.disabled=!0,Hu(),_v.forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.scene===mt.id))),$["scene-current"].textContent=mt.number+" / 07\u3000"+mt.name,dl();let r=Mp();bp=JSON.stringify(r),Fi.setVisible(!document.hidden),Fi.select(mt,{orientation:Zn,quality:r}),location.hash!=="#"+mt.id&&history[t==="push"?"pushState":"replaceState"](null,"","#"+mt.id)}$.menuToggle.onclick=()=>fl($.menu,$.menuToggle);$.closeMenu.onclick=()=>sr();$.closeInfo.onclick=()=>sr();$.targets.onclick=Sv;$.about.onclick=bv;$.retry.onclick=()=>as(mt.id,{force:!0});$.pause.onclick=()=>{ss=!ss,Hu(),sa(),sr()};$.fullscreen.onclick=()=>vn.fullscreen($.fullscreen,()=>{$.menuStatus.hidden=!1,$.menuStatus.textContent="\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F\u3001\u4F5C\u54C1\u3068\u64CD\u4F5CUI\u3092\u542B\u3080\u5168\u753B\u9762\u8868\u793A\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",vn.request()});$.hideUI.onclick=()=>sr(()=>{Sp=!0,document.body.classList.add("ui-hidden"),$.showUI.hidden=!1,$.showUI.focus(),vn.request()});$.showUI.onclick=()=>{Sp=!1,document.body.classList.remove("ui-hidden"),$.showUI.hidden=!0,$.menuToggle.focus(),vn.request()};document.addEventListener("keydown",i=>{if(yn!=="closed"){if(i.key==="Escape")i.preventDefault(),sr();else if(i.key==="Tab"&&!i.defaultPrevented&&(i.preventDefault(),Ln)){let e=[...Ln.querySelectorAll('button,a,[tabindex="0"]')].filter(n=>!n.disabled&&!n.closest("[hidden]")),t=e.indexOf(document.activeElement);e[i.shiftKey?t<=0?e.length-1:t-1:(t+1)%e.length]?.focus()}}});for(let i of["pointerdown","pointerup","click","touchstart","touchmove","wheel"])document.addEventListener(i,e=>{yn!=="closed"&&(!Ln||!Ln.contains(e.target))&&(e.preventDefault(),e.stopImmediatePropagation())},{capture:!0,passive:!1});window.addEventListener("resize",()=>{clearTimeout(Vu),dl(),Vu=setTimeout(()=>{if(!mt)return;let i=Mp();if(JSON.stringify(i)!==bp){as(mt.id,{force:!0});return}zu()!==Zn&&(Zn=zu(),$.app.dataset.orientation=Zn,fi=!1,$.hotspots.replaceChildren(),dl(),Fi.setOrientation(Zn))},180)});new ResizeObserver(()=>dl()).observe($.navigation);window.addEventListener("hashchange",()=>as(location.hash.slice(1),{force:!0}));document.addEventListener("visibilitychange",sa);window.addEventListener("pagehide",()=>{clearTimeout(Vu),vn.clear(),Fi.dispose()});window.addEventListener("pageshow",i=>{i.persisted&&as(location.hash.slice(1),{force:!0})});Ou.addEventListener("change",()=>{Ou.matches&&(ss=!1,Hu(),sa())});as(location.hash.slice(1),{force:!0});})();
