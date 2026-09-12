
/* ASSET 17 — The Vacant Seat v2 / 部品 A〜E を束ねた層
 * 各部品の造形と材質は部品検討のものをそのまま用いる。
 * 環境マップだけは室のものを注入し、五つが同じ光の下に立つようにする。
 */
var H53 = (function () {
  'use strict';
  var renderer = null;
  var finishSeed=7753;
  function finishRandom(){finishSeed=(Math.imul(finishSeed,1664525)+1013904223)>>>0;return finishSeed/4294967296;}
  function useRenderer(r) { renderer = r; }

  // UV seam vertices stay separate; their normals describe one continuous surface.
  function smoothPeriodicSeam(g, rows) {
    var p=g.attributes.position,n=g.attributes.normal;
    rows.forEach(function(row){
      var a=row[0],b=row[row.length-1];
      if(Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b))>0.00001)return;
      var x=n.getX(a)+n.getX(b),y=n.getY(a)+n.getY(b),z=n.getZ(a)+n.getZ(b),L=Math.hypot(x,y,z);
      if(L>0.00001){n.setXYZ(a,x/L,y/L,z/L);n.setXYZ(b,x/L,y/L,z/L);}
    });
  }


  // First detail edition. All fields are authored deterministic procedural textures.
  // Packed channels are independent: R=height, G=roughness variation, B=colour variation.
  // Dimensions passed to detailFinish are metres per repeat, including the asset scale.
  var finishTextures = {};
  function finishTexture(kind) {
    if(finishTextures[kind])return finishTextures[kind];
    var N=512, data=new Uint8Array(N*N*4), seed=kind.length*7717;
    function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    var line=[];for(var i=0;i<N;i++)line.push(rnd());
    var grids={};[8,16,32,64].forEach(function(k){var a=[];for(var i=0;i<k*k;i++)a.push(rnd());grids[k]=a;});
    function noise(x,y,k){var X=x/N*k,Y=y/N*k,ix=Math.floor(X),iy=Math.floor(Y),fx=X-ix,fy=Y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);var a=grids[k];function at(i,j){return a[((j+k)%k)*k+(i+k)%k];}return (at(ix,iy)*(1-fx)+at(ix+1,iy)*fx)*(1-fy)+(at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx)*fy-.5;}
    for(var y=0;y<N;y++)for(var x=0;x<N;x++){
      var p=(y*N+x)*4, n=rnd()-.5, n2=rnd()-.5,h=.5,r=.5,c=.5;
      if(kind==='metal'){
        // Longitudinal machining, varied fine striae, no scratches or wear.
        h=.5+.08*(line[x]-.5)+.015*n;
        r=.5+.12*(line[(x+37)%N]-.5)+.06*n2;
        c=.5+.045*n2;
      }else if(kind==='cloth'){
        // 0.5mm warp/weft at a 64mm tile; slightly flattened cross-over yarns.
        var a=2*Math.PI*x/4,b=2*Math.PI*y/4;
        var over=((Math.floor(x/4)+Math.floor(y/4))%2)?1:-1;
        h=.5+.18*(Math.cos(a)+Math.cos(b))+.08*over*(Math.cos(a)-Math.cos(b));
        r=.5+.10*Math.sin(a+.8)*Math.sin(b+.3)+.10*n2;
        c=.5+.045*Math.cos(a+.2)+.035*Math.cos(b+.4)+.025*n;
      }else if(kind==='concrete'){
        var coarse=noise(x,y,8),aggregate=noise(x,y,64);
        h=.5+.13*coarse+.22*aggregate+.10*n;
        r=.5+.20*noise(x+71,y+29,16)+.12*n2;
        c=.5+.035*coarse+.02*n2;
      }else{
        h=.5+.12*n;
        r=.5+.12*n2;
        c=.5+.02*(rnd()-.5);
      }
      data[p]=Math.round(255*Math.max(0,Math.min(1,h)));
      data[p+1]=Math.round(255*Math.max(0,Math.min(1,r)));
      data[p+2]=Math.round(255*Math.max(0,Math.min(1,c)));
      data[p+3]=255;
    }
    var tex=new THREE.DataTexture(data,N,N,THREE.RGBAFormat);
    tex.name='authored-'+kind+'-height-roughness-colour';
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps=true;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    tex.needsUpdate=true;finishTextures[kind]=tex;return tex;
  }
  function detailFinish(m,kind,scale,height){
    var tex=finishTexture(kind);
    m.userData.finish={kind:kind,metresPerRepeat:scale,heightMetres:height,texture:tex.name};
    // Existing UVs and inscriptions remain untouched. Triplanar local metric fields avoid stretching.
    m.onBeforeCompile=function(s){
      s.uniforms.finishMap={value:tex};s.uniforms.finishScale={value:scale};s.uniforms.finishHeight={value:height};
      s.vertexShader=s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vFinishP;\nvarying vec3 vFinishN;');
      s.vertexShader=s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFinishP=position*vec3(length(modelMatrix[0].xyz),length(modelMatrix[1].xyz),length(modelMatrix[2].xyz));\nvFinishN=normal;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vFinishP;\nvarying vec3 vFinishN;\nuniform sampler2D finishMap;\nuniform float finishScale;\nuniform float finishHeight;\nvec3 finishPerturb(vec3 p, vec3 n, vec2 d){vec3 sx=dFdx(p),sy=dFdy(p);vec3 r1=cross(sy,n),r2=cross(n,sx);float det=dot(sx,r1);return normalize(abs(det)*n-sign(det)*(d.x*r1+d.y*r2));}');
      s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nvec3 finishW=pow(abs(normalize(vFinishN)),vec3(8.));finishW/=max(dot(finishW,vec3(1.)),.00001);\nvec3 finishP=vFinishP/finishScale;\nvec3 finishData=texture2D(finishMap,finishP.zy).rgb*finishW.x+texture2D(finishMap,finishP.xz).rgb*finishW.y+texture2D(finishMap,finishP.xy).rgb*finishW.z;\ndiffuseColor.rgb*=1.+(finishData.b-.5)*.32;');
      s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(finishData.g-.5)*.24,.065,1.);');
      s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nfloat finishH=finishData.r*finishHeight;\nnormal=finishPerturb(-vViewPosition,normal,vec2(dFdx(finishH),dFdy(finishH)));');
    };
    m.customProgramCacheKey=function(){return 'h53-metric-finish-v1';};
    m.extensions={derivatives:true};
  }
  function capSample(t){return .5-.5*Math.cos(Math.PI*t);}
  function filletBox(w,h,d,r){
    var half=[w/2,h/2,d/2],pos=[],normal=[],uv=[],idx=[],steps=3;
    r=Math.min(r,Math.min(w,h,d)*.45);
    function cuts(hh){var a=[];for(var j=0;j<=steps;j++)a.push(-hh+r*(1-Math.cos(j/steps*Math.PI/2)));for(var j=0;j<=steps;j++)a.push(hh-r+r*Math.sin(j/steps*Math.PI/2));return a;}
    for(var axis=0;axis<3;axis++)for(var sign=-1;sign<=1;sign+=2){
      var u=(axis+1)%3,v=(axis+2)%3,U=cuts(half[u]),V=cuts(half[v]),start=pos.length/3;
      for(var j=0;j<V.length;j++)for(var i=0;i<U.length;i++){
        var q=[0,0,0];q[axis]=sign*half[axis];q[u]=U[i];q[v]=V[j];
        var c=q.map(function(x,k){return Math.max(-half[k]+r,Math.min(half[k]-r,x));});
        var n=q.map(function(x,k){return x-c[k];}),l=Math.hypot(n[0],n[1],n[2]);
        for(var k=0;k<3;k++){n[k]/=l;pos.push(c[k]+n[k]*r);normal.push(n[k]);}
        uv.push(i/(U.length-1),j/(V.length-1));
      }
      for(var j=0;j<V.length-1;j++)for(var i=0;i<U.length-1;i++){
        var A=start+j*U.length+i,B=A+1,C=A+U.length,D=C+1;
        if(sign>0)idx.push(A,B,D,A,D,C);else idx.push(A,D,B,A,C,D);
      }
    }
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normal,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g;
  }
  function filletCylinder(rt,rb,h,seg){
    var r=Math.min(h*.18,Math.min(rt,rb)*.07,.0014),pts=[new THREE.Vector2(0,-h/2),new THREE.Vector2(rb-r,-h/2)];
    for(var i=1;i<=4;i++){var t=i/4*Math.PI/2;pts.push(new THREE.Vector2(rb-r+r*Math.sin(t),-h/2+r-r*Math.cos(t)));}
    pts.push(new THREE.Vector2(rt,h/2-r));
    for(var i=1;i<=4;i++){var t=i/4*Math.PI/2;pts.push(new THREE.Vector2(rt-r+r*Math.cos(t),h/2-r+r*Math.sin(t)));}
    pts.push(new THREE.Vector2(0,h/2));
    return new THREE.LatheGeometry(pts,Math.max(24,seg||32));
  }
  function samplePathEnds(P,s,r){
    var total=s[s.length-1],wanted=s.slice();
    for(var j=1;j<9;j++){var x=r*(1-Math.cos(j/9*Math.PI/2));wanted.push(x,total-x);}
    wanted.sort(function(a,b){return a-b;});
    var out=[],prev=-1;
    wanted.forEach(function(x){if(x-prev<1e-7)return;prev=x;var k=1;while(k<s.length-1&&s[k]<x)k++;var t=(x-s[k-1])/Math.max(1e-9,s[k]-s[k-1]);out.push([P[k-1][0]+(P[k][0]-P[k-1][0])*t,P[k-1][1]+(P[k][1]-P[k-1][1])*t]);});
    return out;
  }
  function glassRim(front,depth,mat){
    // Boundary edges only, front optical surface is unchanged.
    var p=front.attributes.position,idx=front.index.array,edges=new Map();
    function add(a,b){var k=Math.min(a,b)+','+Math.max(a,b);if(edges.has(k))edges.delete(k);else edges.set(k,[a,b]);}
    for(var i=0;i<idx.length;i+=3){add(idx[i],idx[i+1]);add(idx[i+1],idx[i+2]);add(idx[i+2],idx[i]);}
    var pos=[];edges.forEach(function(e){var a=e[0],b=e[1],A=[p.getX(a),p.getY(a),p.getZ(a)],B=[p.getX(b),p.getY(b),p.getZ(b)],C=[A[0],A[1],A[2]-depth],D=[B[0],B[1],B[2]-depth];pos.push.apply(pos,A.concat(B,D,A,D,C));});
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();
    var m=mat.clone();m.name=mat.name+'.edge';m.side=THREE.DoubleSide;m.opacity=Math.min(1,mat.opacity+.12);m.depthWrite=false;
    var mesh=new THREE.Mesh(g,m);mesh.name='glass-thickness-edge';return mesh;
  }
  function finishScene(scene){
    var serial={};
    scene.traverse(function(o){
      if(!o.isMesh)return;
      var group=o;while(group.parent&&group.parent!==scene)group=group.parent;
      var key=group.userData.h53||'room';serial[key]=(serial[key]||0)+1;
      if(!o.name)o.name=key+'-'+String(serial[key]).padStart(3,'0');
      // Drop zero-area pole triangles while retaining the original material groups.
      var g=o.geometry,p=g.attributes.position;
      if(!g.index)return;
      var old=g.index.array,groups=g.groups.length?g.groups.slice():[{start:0,count:old.length,materialIndex:0}],indices=[],newGroups=[];
      groups.forEach(function(gr){var start=indices.length;for(var i=gr.start;i<gr.start+gr.count;i+=3){
        var a=old[i],b=old[i+1],c=old[i+2],ab=new THREE.Vector3().fromBufferAttribute(p,b).sub(new THREE.Vector3().fromBufferAttribute(p,a)),ac=new THREE.Vector3().fromBufferAttribute(p,c).sub(new THREE.Vector3().fromBufferAttribute(p,a));
        if(ab.cross(ac).lengthSq()>1e-23)indices.push(a,b,c);
      }newGroups.push({start:start,count:indices.length-start,materialIndex:gr.materialIndex});});
      g.setIndex(indices);g.clearGroups();newGroups.forEach(function(gr){g.addGroup(gr.start,gr.count,gr.materialIndex);});
      // Pocket-boundary duplicates outside the opening are unused. Remove them, including zero normals.
      var remap=new Map(),used=[];indices.forEach(function(i){if(!remap.has(i)){remap.set(i,used.length);used.push(i);}});
      Object.keys(g.attributes).forEach(function(key){var oldA=g.attributes[key],a=new oldA.array.constructor(used.length*oldA.itemSize);used.forEach(function(i,j){for(var k=0;k<oldA.itemSize;k++)a[j*oldA.itemSize+k]=oldA.array[i*oldA.itemSize+k];});g.setAttribute(key,new THREE.BufferAttribute(a,oldA.itemSize,oldA.normalized));});
      g.setIndex(indices.map(function(i){return remap.get(i);}));
    });
  }
  function contactFinish(scene){
    // Contact AO derives from the real support footprints; it is not a dirt texture.
    scene.updateMatrixWorld(true);
    var roots={};scene.children.forEach(function(o){if(o.userData.h53)roots[o.userData.h53]=o;});
    function contact(receiver,objects,y,w,d,cx,cz){
      var canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
      var ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,1024,1024);
      objects.forEach(function(o){var b=new THREE.Box3().setFromObject(o);if(Math.abs(b.min.y-y)>.006)return;
        var x=(b.min.x-cx+w/2)/w*1024,z=(1-(b.max.z-cz+d/2)/d)*1024,bw=(b.max.x-b.min.x)/w*1024,bh=(b.max.z-b.min.z)/d*1024;
        ctx.save();ctx.filter='blur('+Math.max(1,.012/w*1024)+'px)';ctx.fillStyle='#919191';ctx.fillRect(x,z,bw,bh);ctx.restore();
      });
      var uv=[],p=receiver.geometry.attributes.position;for(var i=0;i<p.count;i++){var v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(receiver.matrixWorld);uv.push((v.x-cx+w/2)/w,(v.z-cz+d/2)/d);}
      receiver.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(uv,2));
      var original=receiver.material,m=original.clone();m.name=original.name+'.contact';if(original.userData.finish){var f=original.userData.finish;detailFinish(m,f.kind,f.metresPerRepeat,f.heightMetres);}
      m.aoMap=new THREE.CanvasTexture(canvas);m.aoMap.name='derived-support-occlusion';m.aoMapIntensity=.75;receiver.material=m;
    }
    if(roots.room&&roots.desk&&roots.chair){
      contact(roots.room.children[0],roots.desk.children.slice(3).concat(roots.chair.children.filter(function(o){return o.isMesh&&new THREE.Box3().setFromObject(o).max.y<.01;})),0,5.2,6.4,0,0);
      var feet=[];['board','terminal','metronome'].forEach(function(k){roots[k].traverse(function(o){if(o.isMesh)feet.push(o);});});
      contact(roots.desk.children[0],feet,.72,1.8,.8,0,-.35);
    }
  }
  function captureRoom(scene,renderer){
    // Blender UV2 irradiance and AO replace the old planar contact maps.
    // Bake one shared static probe from actual enclosure, furniture and installed lights.
    // The small devices are excluded from their own reflection probe to avoid self-reflection.
    var hidden=[];scene.children.forEach(function(o){if(['terminal','board','metronome'].indexOf(o.userData.h53)>=0){hidden.push(o);o.visible=false;}});
    var rt=new THREE.WebGLCubeRenderTarget(128,{generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter,encoding:THREE.sRGBEncoding});
    var cube=new THREE.CubeCamera(.03,30,rt);cube.position.set(0,1.08,-.55);
    cube.update(renderer,scene);
    var pm=new THREE.PMREMGenerator(renderer),result=pm.fromCubemap(rt.texture),seen=new Set();
    hidden.forEach(function(o){o.visible=true;});
    scene.traverse(function(o){if(!o.isMesh)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(seen.has(m)||!m.envMap)return;seen.add(m);m.envMap=result.texture;m.needsUpdate=true;});});
    scene.userData.detailProbe={position:[0,1.08,-.55],resolution:128,static:true};
    pm.dispose();rt.dispose();
  }

  var P_METRO = (function () {


  var PUMP = 0.78;
  var C_MAG = 0xff05a8, C_PALE = 0xf2dbe9, C_TURQ = 0x00ddc8;

  // ─────────────────────────── 寸法（m）
  var H = 0.208;                       // 全高
  var BW = 0.104 / 2, TW = 0.046 / 2;  // 半幅（下・上）
  var BD = 0.062 / 2, TD = 0.030 / 2;  // 半奥行（下・上）
  var WALL = 0.0055;                   // 肉厚
  var NEXP = 6.2;                      // 断面の指数。大きいほど直線に寄る
  var SEG = 132, LEV = 204;             // 周・高さの分割

  var ROD_L = 0.092, ROD_W = 0.0025, ROD_T = 0.0015;
  var PIVOT_Y = 0.050;
  var S_BOT = 0.062, S_TOP = 0.122;    // 目盛りの帯。軸から 12〜72 mm
  var W_HX = 0.0058, T_HX = 0.0066;    // 錘・環の半幅
  var BPM_SET = 77, SWING = 0.2443;    // 振れ角（rad）＝14.0度
  var TRI = 0.42;                      // 三角波の混合比。端の溜めを削る

  // 開口は、振子が振れきるまでに掃く扇そのもの。案内でも、制限でもない
  var AP_CLEAR = 0.0021;               // 縁との隙
  var AY0 = 0, AY1 = 0;                // 開口の上下（振子の寸法から決まる）
  var AP_R0 = 0.0092, AP_R1 = 0.0200;  // 下端・上端を閉じる丸み

  var scene, camera, clock, pendulum, t0 = 0;
  var beating = true;

  function bpmY(b) {
    var t = (Math.log(b) - Math.log(40)) / (Math.log(208) - Math.log(40));
    return S_TOP - t * (S_TOP - S_BOT);
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // 頂は切り落とさず、丸めて閉じる
  function capScale(y) {
    var t = y / H;
    if (t < 0.945) return 1;
    var u = Math.min(1, (t - 0.945) / 0.055);
    return Math.sqrt(Math.max(0, 1 - u * u));  // 頂は浅く落とすだけ
  }
  function halfW(y) { return lerp(BW, TW, y / H) * capScale(y); }
  function halfD(y) { return lerp(BD, TD, y / H) * capScale(y); }

  // 開口。軸から測った扇。縁は直線、上下は丸く閉じる。
  // 幅は「振子の断面 ÷ cos(振れ角)」だけ足せば足りる——これが振れを縛らない最小の開口である。
  // 錘の環が届く高さまでは環の幅、その上は針の幅へ落とす
  function apRaw(y) {
    var TN = Math.tan(SWING), CS = Math.cos(SWING);
    var Ct = T_HX / CS + AP_CLEAR;                 // 環を通す
    var Cr = (ROD_W / 2) / CS + AP_CLEAR;          // 針だけになれば細くてよい
    var yA = PIVOT_Y + ((S_TOP - PIVOT_Y) + 0.0061) * CS;
    var yB = PIVOT_Y + (ROD_L - 0.004) - 0.0040;
    var s = (y - yA) / (yB - yA);
    s = s < 0 ? 0 : s > 1 ? 1 : s;
    s = s * s * (3 - 2 * s);
    return (y - PIVOT_Y) * TN + Ct + (Cr - Ct) * s;
  }
  function initAperture() {
    AY0 = PIVOT_Y - 0.0094;
    AY1 = PIVOT_Y + (ROD_L - 0.004) + 0.0120;
  }
  function apHalfW(y) {
    if (!AY1) initAperture();
    if (y <= AY0 || y >= AY1) return 0;
    var v = apRaw(y), cA = 1, cB = 1;
    if (y < AY0 + AP_R0) { var a = (AY0 + AP_R0 - y) / AP_R0; cA = Math.sqrt(Math.max(0, 1 - a * a)); }
    if (y > AY1 - AP_R1) { var b = (y - (AY1 - AP_R1)) / AP_R1; cB = Math.sqrt(Math.max(0, 1 - b * b)); }
    return v * Math.min(cA, cB);
  }

  // 開口の奥の面。どの高さでも同じ z に立てる
  var IZ = 0;
  function initIZ() {
    initAperture();
    IZ = lerp(BD, TD, AY1 / H) * capScale(AY1) - WALL;
  }

  function sq(w, d, t) {
    var c = Math.cos(t), s = Math.sin(t), e = 2 / NEXP;
    return [
      (c < 0 ? -1 : 1) * w * Math.pow(Math.abs(c), e),
      (s < 0 ? -1 : 1) * d * Math.pow(Math.abs(s), e)
    ];
  }

  // ─────────────────────────── 筐体
  // 周の割り方。開口があるときは、その縁にきっちり頂点を落とす
  var K_SEG = Math.round(SEG * 0.22), L_SEG = Math.round(SEG * 0.30);
  var M_SEG = SEG - K_SEG - L_SEG;
  function ringTs(w, aw) {
    var ts = [], i;
    var t1 = aw <= 0.0002 ? Math.PI / 2
           : Math.acos(Math.pow(Math.min(0.9995, aw / w), NEXP / 2));
    for (i = 0; i < K_SEG; i++) ts.push(t1 * i / K_SEG);
    for (i = 0; i <= L_SEG; i++) ts.push(t1 + (Math.PI - 2 * t1) * i / L_SEG);
    for (i = 1; i < M_SEG; i++) ts.push((Math.PI - t1) + (Math.PI + t1) * i / M_SEG);
    ts.push(Math.PI * 2);
    return ts;
  }

  function shell() {
    initIZ();
    var pos = [], uv = [], idx = [];
    var rings = [];

    for (var j = 0; j <= LEV; j++) {
      var y = H * capSample(j / LEV);
      var w = halfW(y), d = halfD(y);
      var aw = apHalfW(y);
      if (aw < 0.0002) aw = 0;                    // 端は開けない。潰れた帯は面を汚す
      if (aw > w - 0.004) aw = Math.max(0, w - 0.004);
      var iz = IZ;                                       // 奥は垂直。針が埋まらない
      var ts = ringTs(w, Math.max(aw, 0.0002));   // 潰れた帯は面を壊す。下限を置く
      var row = [];
      for (var i = 0; i <= SEG; i++) {
        var p = sq(w, d, ts[i]);
        var x = p[0], z = p[1];
        // 開口の内側（縁の二点は外周に残す）。
        // 端では幅とともに底も浅くなる。掘り抜きではなく、彫り込みである
        if (aw > 0.0002 && i > K_SEG && i < K_SEG + L_SEG) {
          var bl = Math.min(1, aw / 0.0090);
          z = z + (iz - z) * bl * bl * (3 - 2 * bl);
        }
        row.push([x, y, z]);
      }
      rings.push(row);
    }

    function push(p, u, v) { pos.push(p[0], p[1], p[2]); uv.push(u, v); return pos.length / 3 - 1; }
    // 格子の頂点は一度だけ積む。隣の面と分け合うので法線が平均され、面がつながる
    var vid = [], vidB = [];
    var EL = K_SEG, ER = K_SEG + L_SEG;      // 開口の左右の縁
    for (var jv = 0; jv <= LEV; jv++) {
      vid[jv] = []; vidB[jv] = {};
      for (var iv = 0; iv <= SEG; iv++) vid[jv][iv] = push(rings[jv][iv], iv / SEG, capSample(jv / LEV));
      // 縁は内壁の側にもう一つ持たせる。ここで法線が割れ、稜が立つ
      vidB[jv][EL] = push(rings[jv][EL], EL / SEG, capSample(jv / LEV));
      vidB[jv][ER] = push(rings[jv][ER], ER / SEG, capSample(jv / LEV));
    }
    function vB(j, i) { return (i === EL || i === ER) ? vidB[j][i] : vid[j][i]; }
    var outer = [], bore = [];
    for (var j2 = 0; j2 < LEV; j2++) {
      var yMid = H * capSample((j2 + 0.5) / LEV);
      var inAp = apHalfW(yMid) >= 0.0002;
      for (var i2 = 0; i2 < SEG; i2++) {
        var isB = inAp && i2 >= EL && i2 < ER;
        var A, B, C, D;
        if (isB) {
          A = vB(j2, i2); B = vB(j2, i2 + 1); C = vB(j2 + 1, i2 + 1); D = vB(j2 + 1, i2);
          bore.push(A, D, C, A, C, B);
        } else {
          A = vid[j2][i2]; B = vid[j2][i2 + 1]; C = vid[j2 + 1][i2 + 1]; D = vid[j2 + 1][i2];
          outer.push(A, D, C, A, C, B);
        }
      }
    }
    // 底
    var cen = push([0, 0, 0], 0.5, 0.5);
    for (var i3 = 0; i3 < SEG; i3++) outer.push(cen, vid[0][i3], vid[0][i3 + 1]);

    idx = outer.concat(bore);
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.addGroup(0, outer.length, 0);
    g.addGroup(outer.length, bore.length, 1);
    g.computeVertexNormals();
    smoothPeriodicSeam(g, vid);
    return g;
  }

  // ─────────────────────────── 目盛り
  // 開口が扇に開いたので、目盛りもその縁に沿う。両縁から内へ向いて刻む
  var SC_HX = 0.031, PPM = 12800;      // 板の半幅／m あたりの画素
  function scaleTexture() {
    initAperture();
    var W = Math.round(SC_HX * 2 * PPM), Hh = Math.round((AY1 - AY0) * PPM);
    var c = document.createElement('canvas');
    c.width = W; c.height = Hh;
    var g = c.getContext('2d');
    g.clearRect(0, 0, W, Hh);
    function px(x) { return W / 2 + x * PPM; }
    function py(y) { return (AY1 - y) * PPM; }

    var marks = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80,
                 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 144,
                 152, 160, 168, 176, 184, 192, 200, 208];
    var named = { 40: 1, 60: 1, 80: 1, 100: 1, 120: 1, 144: 1, 176: 1, 208: 1 };
    g.textBaseline = 'middle';
    g.lineCap = 'butt';

    // 右の縁に刻み、左の野に数字を置く。扇は下ほど狭いので、数字は左から読ませる
    function rule(y, len, col, w, ink, txt, size) {
      var e = apHalfW(y) - 0.0013;
      if (e <= 0.0035) return;
      g.strokeStyle = col; g.lineWidth = w;
      g.beginPath();
      g.moveTo(px(e - len), py(y)); g.lineTo(px(e), py(y));
      g.moveTo(px(-e), py(y)); g.lineTo(px(-e + len * 0.46), py(y));
      g.stroke();
      if (!txt) return;
      g.font = '600 ' + Math.round(size * PPM) + 'px "DejaVu Sans Mono", Menlo, monospace';
      var x0 = -e + len * 0.46 + 0.0015;
      if (x0 + g.measureText(txt).width / PPM > e - len - 0.0010) return;
      g.fillStyle = ink; g.textAlign = 'left';
      g.fillText(txt, px(x0), py(y));
    }

    var y77 = bpmY(77);
    for (var i = 0; i < marks.length; i++) {
      var b = marks[i], lng = named[b] ? 1 : 0;
      if (lng && Math.abs(bpmY(b) - y77) < 0.0055) lng = 2;   // 七十七に譲る
      rule(bpmY(b), lng ? 0.0080 : 0.0045,
           lng ? 'rgba(244,248,252,0.98)' : 'rgba(214,222,232,0.50)',
           lng ? 3.4 : 2.2,
           'rgba(246,250,254,0.92)', lng === 1 ? String(b) : null, 0.0038);
    }
    // 七十七。ここに留められている
    rule(bpmY(77), 0.0098, '#ff05a8', 4.2, '#ff05a8', '77', 0.0042);

    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  function markTexture() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 96;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(120,104,116,0.62)';
    g.font = '500 40px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('h!ro53', c.width / 2, 34);
    g.fillStyle = 'rgba(120,104,116,0.34)';
    g.font = '500 21px "DejaVu Sans Mono", Menlo, monospace';
    g.fillText('77 / MIN', c.width / 2, 70);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  var M = {}, ENV = null, ETCH_CANVAS = null;

  // 側面の腐食。06 の規則で組んだ意味を持たない字形と、円盤の弧
  function etchTexture() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 1024;
    var g = c.getContext('2d');
    g.fillStyle = '#5a5a5a';                 // 地の粗さ。削り出しの面
    g.fillRect(0, 0, c.width, c.height);
    // 縦のヘアライン
    g.globalAlpha = 0.16;
    for (var h = 0; h < 300; h++) {
      g.strokeStyle = (h % 2 ? '#8a8a8a' : '#4a4a4a');
      g.lineWidth = 1;
      var hx = finishRandom() * c.width;
      g.beginPath(); g.moveTo(hx, 0); g.lineTo(hx, c.height); g.stroke();
    }
    g.globalAlpha = 1;

    var LINE = 'rgba(226,226,226,0.95)';     // 腐食した側は光を散らす
    function panel(u0, u1) {
      var x0 = u0 * c.width, x1 = u1 * c.width, w = x1 - x0, cx = (x0 + x1) / 2;
      var vTop = c.height * (1 - 0.74), vBot = c.height * (1 - 0.30);
      g.save();
      g.strokeStyle = LINE; g.fillStyle = LINE;
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.lineWidth = Math.max(1.6, w * 0.011);
      var cols = [-0.26, -0.09, 0.09, 0.26], k, x, y;
      for (k = 0; k < cols.length; k++) {
        x = cx + cols[k] * w;
        var a = vTop + (k % 2 ? w * 0.10 : 0), b = vBot - (k === 1 ? w * 0.16 : 0);
        g.beginPath(); g.moveTo(x, a); g.lineTo(x, b); g.stroke();
        g.beginPath(); g.arc(x, a, w * 0.016, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(x, b, w * 0.016, 0, Math.PI * 2); g.fill();
      }
      // 交差はジャンクションで受ける
      var rows = [0.24, 0.52, 0.78];
      for (k = 0; k < rows.length; k++) {
        y = vTop + (vBot - vTop) * rows[k];
        var lx = cx + cols[k % 2 ? 0 : 1] * w, rx = cx + cols[k % 2 ? 3 : 2] * w;
        g.beginPath(); g.moveTo(lx, y); g.lineTo(rx, y); g.stroke();
        g.beginPath(); g.arc((lx + rx) / 2, y, w * 0.019, 0, Math.PI * 2); g.fill();
      }
      // 円盤の弧。基壇の記号
      g.lineWidth = Math.max(1, w * 0.006);
      for (k = 0; k < 3; k++) {
        g.beginPath();
        g.arc(cx, vBot + w * 0.30, w * (0.16 + k * 0.075), Math.PI * 1.12, Math.PI * 1.88);
        g.stroke();
      }
      g.restore();
    }
    panel(0.030, 0.185);      // 右の面
    panel(0.590, 0.745);      // 左の面
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    ETCH_CANVAS = c;
    return t;
  }

  // 同じ figure を、色の側にもごく薄く落とす
  function etchTint() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 1024;
    var g = c.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.09;
    g.drawImage(ETCH_CANVAS, 0, 0);
    g.globalAlpha = 1;
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  function buildEnv() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    var g = c.getContext('2d');
    var sky = g.createLinearGradient(0, 0, 0, c.height);
    sky.addColorStop(0.00, '#8e96a6');
    sky.addColorStop(0.30, '#4a5462');
    sky.addColorStop(0.50, '#0b1016');
    sky.addColorStop(1.00, '#030507');
    g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
    var k = g.createRadialGradient(146, 46, 4, 146, 46, 104);
    k.addColorStop(0, 'rgba(255,248,252,1)');
    k.addColorStop(1, 'rgba(255,248,252,0)');
    g.fillStyle = k; g.fillRect(20, 0, 260, 170);
    var f = g.createRadialGradient(396, 80, 4, 396, 80, 78);
    f.addColorStop(0, 'rgba(190,238,232,0.42)');
    f.addColorStop(1, 'rgba(124,244,230,0)');
    g.fillStyle = f; g.fillRect(312, 12, 170, 140);
    var r = g.createRadialGradient(266, 126, 4, 266, 126, 60);
    r.addColorStop(0, 'rgba(255,88,190,0.60)');
    r.addColorStop(1, 'rgba(255,88,190,0)');
    g.fillStyle = r; g.fillRect(200, 70, 130, 116);
    g.fillStyle = 'rgba(158,166,178,0.09)';
    g.fillRect(0, 170, c.width, 22);
    g.fillStyle = 'rgba(226,232,240,0.30)';       // 地平。反射に一本の締まりを出す
    g.fillRect(0, 126, c.width, 3);
    g.fillStyle = 'rgba(255,255,255,0.10)';
    g.fillRect(0, 96, c.width, 6);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var t = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return t;
  }

  function mats() {
    M.case = new THREE.MeshStandardMaterial({
      color: 0xecd8e5, roughness: 1.0, roughnessMap: etchTexture(), map: etchTint(),
      metalness: 0.76, envMap: ENV, envMapIntensity: 1.05
    });
    M.inner = new THREE.MeshStandardMaterial({
      color: 0x252c34, roughness: 0.50, metalness: 0.40,
      envMap: ENV, envMapIntensity: 0.68, side: THREE.DoubleSide
    });
    M.trim = new THREE.MeshStandardMaterial({
      color: 0xdde2e9, roughness: 0.17, metalness: 0.95,
      envMap: ENV, envMapIntensity: 1.5
    });
    M.pend = new THREE.MeshStandardMaterial({
      color: C_TURQ, roughness: 0.30, metalness: 0.62,
      envMap: ENV, envMapIntensity: 1.0,
      emissive: C_TURQ, emissiveIntensity: 0.10
    });
    M.mag = new THREE.MeshStandardMaterial({
      color: C_MAG, roughness: 0.24, metalness: 0.52, envMap: ENV, envMapIntensity: 0.95
    });
    M.case.name = "metro.case";
    detailFinish(M.case, "metal", 0.1, 4.5e-05);
    M.inner.name = "metro.inner";
    detailFinish(M.inner, "satin", 0.08, 2e-05);
    M.trim.name = "metro.trim";
    detailFinish(M.trim, "metal", 0.08, 1.6e-05);
    M.pend.name = "metro.pend";
    detailFinish(M.pend, "metal", 0.06, 2e-05);
    M.mag.name = "metro.mag";
    detailFinish(M.mag, "satin", 0.06, 2e-05);

  }

  function box(w, h, d, m, x, y, z) {
    var o = new THREE.Mesh(filletBox(w, h, d, Math.min(w,h,d)*0.14), m);
    o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true;
    return o;
  }

  // ─────────────────────────── 組み立て
  function build() {
    var g = new THREE.Group();

    var sh = new THREE.Mesh(shell(), [M.case, M.inner]);
    sh.castShadow = true; sh.receiveShadow = true;
    g.add(sh);

    // 目盛り。内側の面に焼き付いている。貼り物ではない
    var zc = IZ + 0.0007;
    var scMap = scaleTexture();
    var sc = new THREE.Mesh(
      new THREE.PlaneGeometry(SC_HX * 2, AY1 - AY0),
      new THREE.MeshStandardMaterial({
        map: scMap, transparent: true, roughness: 0.55, metalness: 0.20,
        envMap: ENV, envMapIntensity: 0.4,
        emissive: 0xffffff, emissiveMap: scMap, emissiveIntensity: 0.42
      }));
    sc.position.set(0, (AY0 + AY1) / 2, zc);
    g.add(sc);

    // 振子。軸から上へ。拍で振れる
    pendulum = new THREE.Group();
    pendulum.position.set(0, PIVOT_Y, IZ + 0.0042);
    // 振子は針も錘も同じ青緑。一本の金属である
    var rod = box(ROD_W, ROD_L, ROD_T, M.pend, 0, ROD_L / 2 - 0.004, 0);
    pendulum.add(rod);
    var wy = bpmY(BPM_SET) - PIVOT_Y;
    pendulum.add(box(W_HX * 2, 0.0084, 0.0048, M.pend, 0, wy, 0));
    pendulum.add(box(T_HX * 2, 0.0012, 0.0062, M.trim, 0, wy + 0.0055, 0));
    pendulum.add(box(T_HX * 2, 0.0012, 0.0062, M.trim, 0, wy - 0.0055, 0));
    var pv = new THREE.Mesh(filletCylinder(0.0032, 0.0032, 0.0088, 32), M.trim);
    pv.rotation.x = Math.PI / 2;
    pendulum.add(pv);
    var pin = new THREE.Mesh(filletCylinder(0.0009, 0.0009, 0.0100, 24), M.mag);
    pin.rotation.x = Math.PI / 2;
    pendulum.add(pin);
    g.add(pendulum);

    // 銘。刻んであるだけで、板は貼られていない
    var my = 0.0175;
    var mk = new THREE.Mesh(
      new THREE.PlaneGeometry(0.0300, 0.0056),
      new THREE.MeshStandardMaterial({
        map: markTexture(), transparent: true, roughness: 0.30, metalness: 0.40,
        envMap: ENV, envMapIntensity: 0.55, emissiveIntensity: 0.18,
        emissive: 0xd6dce4
      }));
    mk.position.set(0, my, halfD(my) + 0.0004);
    mk.rotation.x = -Math.atan2(BD - TD, H);
    g.add(mk);

    // 巻きの鍵。右
    var ky = 0.078, kx = halfW(ky);
    var ks = new THREE.Mesh(filletCylinder(0.0050, 0.0056, 0.0040, 24), M.trim);
    ks.rotation.z = Math.PI / 2;
    ks.position.set(kx + 0.0018, ky, 0.0035);
    g.add(ks);
    var shaft = new THREE.Mesh(filletCylinder(0.0015, 0.0015, 0.0058, 12), M.trim);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(kx + 0.0056, ky, 0.0035);
    g.add(shaft);
    g.add(box(0.0026, 0.0132, 0.0032, M.trim, kx + 0.0077, ky + 0.0046, 0.0035));
    g.add(box(0.0024, 0.0026, 0.0030, M.mag, kx + 0.0078, ky + 0.0100, 0.0035));

    // 脚。触れる面はここだけ
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (s) {
      var f = new THREE.Mesh(filletCylinder(0.0040, 0.0036, 0.0018, 18), M.trim);
      f.position.set(s[0] * (BW - 0.015), -0.0004, s[1] * (BD - 0.013));
      g.add(f);
    });

    return g;
  }


    function setEnv(e) { ENV = e; mats(); }
    return { setEnv: setEnv, build: build,
      tick: function (t) {
        if (!pendulum) return;
        var ph = (t % (PUMP * 2)) / (PUMP * 2) * Math.PI * 2;
        var s = Math.sin(ph);
        if (s > 1) s = 1; else if (s < -1) s = -1;
        pendulum.rotation.z = SWING * ((1 - TRI) * s + TRI * (2 / Math.PI) * Math.asin(s));
      } };
  })();

  var P_CRT = (function () {


  var PUMP = 0.78;
  var C_MAG = 0xff05a8, C_PALE = 0xf2dbe9, C_TURQ = 0x00ddc8;
  var CSS_MAG = '#ff05a8', CSS_PALE = '#f2dbe9', CSS_TURQ = '#00ddc8';
  var EPOCH_MS = Date.UTC(1887, 0, 1, 0, 0, 0);

  // ─────────────────────────── 寸法（m）14型
  var FW = 0.372 / 2, FH = 0.344 / 2;        // 前面の半寸
  var BWD = 0.198 / 2, BHT = 0.186 / 2;      // 背面の半寸
  var DEPTH = 0.384;                          // 前面から背面まで
  var SCR_W = 0.302 / 2, SCR_H = 0.2265 / 2; // 表示領域の半寸（4:3）
  var SCR_CY = 0.0235;                        // 画面の中心は上寄り（下の額が広い）
  var CURV = 0.90;                            // 管面の曲率半径
  var BEZ_N = 10.5;                            // 管と額の内側で共通の輪郭の指数
  var NEXP = 5.4;                             // 断面。角にだけR
  var SEG = 108, LEV = 72;

  var STAND_H = 0.022, STAND_R = 0.090, STEM_H = 0.040;
  var VIEW_ROWS = 13;

  var scene, camera, clock, t0 = 0;
  var screenCanvas, screenTex, lastRow = -1;

  function lerp(a, b, t) { return a + (b - a) * t; }
  // 遡行の変位。ORIGIN のあいだだけ負になる。先頭には届かない
  var SEEK = 0;
  function pulseCount() { return Math.floor((Date.now() - EPOCH_MS) / (PUMP * 1000)) + SEEK; }
  function setSeek(n) { SEEK = n; lastRow = -1; }
  function groupDigits(n) {
    var s = String(n), o = '', c = 0, i;
    for (i = s.length - 1; i >= 0; i--) { o = s.charAt(i) + o; c++; if (c % 3 === 0 && i > 0) o = ' ' + o; }
    return o;
  }

  // ─────────────────────────── 乱数（骨格バグ台帳 ①）
  var _seed = 77053;
  function rnd() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
  function rseed(s) { _seed = ((s % 233280) + 233280) % 233280; }

  // ─────────────────────────── 構造文字
  function drawGlyph(ctx, x, y, size, col, lw, sd) {
    rseed(sd);
    var g = size / 6, hs = [], vs = [], i, n, r, c0, c1;
    n = 2 + Math.floor(rnd() * 3);
    for (i = 0; i < n; i++) { r = 1 + Math.floor(rnd() * 5); c0 = Math.floor(rnd() * 3); c1 = 3 + Math.floor(rnd() * 3); hs.push([r, c0, c1]); }
    n = 1 + Math.floor(rnd() * 3);
    for (i = 0; i < n; i++) { c0 = 1 + Math.floor(rnd() * 5); r = Math.floor(rnd() * 3); c1 = 3 + Math.floor(rnd() * 3); vs.push([c0, r, c1]); }
    ctx.save();
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var ends = [];
    for (i = 0; i < hs.length; i++) {
      var a = hs[i];
      ctx.beginPath(); ctx.moveTo(x + a[1] * g, y + a[0] * g); ctx.lineTo(x + a[2] * g, y + a[0] * g); ctx.stroke();
      ends.push([x + a[1] * g, y + a[0] * g], [x + a[2] * g, y + a[0] * g]);
    }
    for (i = 0; i < vs.length; i++) {
      var b = vs[i];
      ctx.beginPath(); ctx.moveTo(x + b[0] * g, y + b[1] * g); ctx.lineTo(x + b[0] * g, y + b[2] * g); ctx.stroke();
      ends.push([x + b[0] * g, y + b[1] * g], [x + b[0] * g, y + b[2] * g]);
    }
    for (i = 0; i < ends.length; i++) { ctx.beginPath(); ctx.arc(ends[i][0], ends[i][1], lw * 0.8, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function glyphRun(ctx, x, y, size, count, col, lw, sd) {
    for (var i = 0; i < count; i++) drawGlyph(ctx, x + i * size * 1.2, y, size, col, lw, sd + i * 7717);
  }

  // ─────────────────────────── 管面
  function paintScreen(row) {
    var c = screenCanvas, g = c.getContext('2d'), W = c.width, Hh = c.height;
    g.fillStyle = '#040807';
    g.fillRect(0, 0, W, Hh);

    var pad = 38, y = 46;
    // 見出し
    g.textBaseline = 'middle';
    g.fillStyle = CSS_TURQ; g.globalAlpha = 0.66;
    g.font = '500 26px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
    g.textAlign = 'left'; g.fillText('決裁一覧', pad, y);
    g.font = '500 22px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'right'; g.fillText('HB-078', W - pad, y);
    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(0,221,200,0.28)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(pad, y + 20); g.lineTo(W - pad, y + 20); g.stroke();

    // 未決。最上段で流れない
    y = 96;
    g.fillStyle = CSS_MAG;
    g.font = '600 30px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
    g.textAlign = 'left'; g.fillText('未決', pad, y);
    glyphRun(g, pad + 92, y - 17, 33, 5, 'rgba(242,219,233,0.62)', 1.9, 40311);
    // 遡行中は欄名を差し替え、数字を明滅させる。
    // 遡る速さは変えない——先頭に届かないことが主題だからである
    var bk = SEEK < 0 ? Math.floor(Date.now() / 190) % 2 : -1;
    g.fillStyle = bk === 1 ? 'rgba(255,5,168,0.88)' : 'rgba(242,219,233,0.42)';
    g.font = '500 21px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
    g.fillText(bk < 0 ? '所要' : '遡行', pad, y + 40);
    g.fillStyle = bk === 0 ? 'rgba(255,5,168,0.32)' : CSS_MAG;
    g.font = '600 32px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'right'; g.fillText(groupDigits(pulseCount()), W - pad, y + 41);
    g.strokeStyle = bk === 1 ? 'rgba(255,5,168,0.74)' : 'rgba(255,5,168,0.30)';
    g.beginPath(); g.moveTo(pad, y + 66); g.lineTo(W - pad, y + 66); g.stroke();

    // 承認。一件ごとに一行ずつ送る
    var rowH = 19, top = 168;
    rseed(551027 + (row % 997) * 13);
    for (var i = 0; i < VIEW_ROWS; i++) {
      var yy = top + i * rowH;
      var fade = i === 0 ? 0.42 : (i > VIEW_ROWS - 3 ? 0.30 : 0.80);
      g.globalAlpha = fade;
      g.fillStyle = CSS_TURQ;
      g.textAlign = 'left';
      g.font = '500 16px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
      g.fillText('承認', pad, yy);
      g.globalAlpha = fade * 0.42;
      glyphRun(g, pad + 58, yy - 8, 16, 4, 'rgba(242,219,233,0.9)', 1.1, 90001 + (row + i) * 331);
      g.globalAlpha = fade * 0.52;
      g.fillStyle = CSS_TURQ;
      g.textAlign = 'right';
      g.font = '500 15px "DejaVu Sans Mono", Menlo, monospace';
      g.fillText('0.78', W - pad, yy);
      g.globalAlpha = fade * 0.16;
      g.fillStyle = CSS_PALE;
      g.fillRect(pad, yy + 8, W - pad * 2, 1);
    }
    g.globalAlpha = 1;

    // 総件数
    g.strokeStyle = 'rgba(242,219,233,0.24)';
    g.beginPath(); g.moveTo(pad, Hh - 60); g.lineTo(W - pad, Hh - 60); g.stroke();
    g.fillStyle = 'rgba(242,219,233,0.44)';
    g.font = '500 22px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
    g.textAlign = 'left'; g.fillText('総件数', pad, Hh - 34);
    g.fillStyle = CSS_PALE;
    g.font = '500 26px "Hiragino Sans", "Noto Sans CJK JP", sans-serif';
    g.textAlign = 'right'; g.fillText('継続', W - pad, Hh - 34);

    // 走査線
    g.fillStyle = 'rgba(0,0,0,0.42)';
    for (var sy = 0; sy < Hh; sy += 4) g.fillRect(0, sy, W, 2);
    g.fillStyle = 'rgba(0,0,0,0.16)';                    // 管の縦の粗さ
    for (var sx = 0; sx < W; sx += 3) g.fillRect(sx, 0, 1, Hh);
    // 隅の落ち
    var vg = g.createRadialGradient(W / 2, Hh / 2, Hh * 0.30, W / 2, Hh / 2, Hh * 0.86);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.46)');
    g.fillStyle = vg; g.fillRect(0, 0, W, Hh);

    if (screenTex) screenTex.needsUpdate = true;
  }

  // ─────────────────────────── 管面の形（横だけ湾曲する）
  // 矩形の格子を、額の内側と同じ曲線（指数 BEZ_N）へ写す。
  // UV にも同じ写像をかける。そうしないと角へ向かって絵が縮み、文字が歪む。
  // 結果として絵の四隅は落ちるが、面上ではどこでも等倍で並ぶ
  function screenGeometry(hw, hh, r, seg) {
    var pos = [], uv = [], idx = [], i, j;
    for (j = 0; j <= seg; j++) {
      var v = j / seg, ny = v * 2 - 1;
      for (i = 0; i <= seg; i++) {
        var u = i / seg, nx = u * 2 - 1;
        var ax = Math.abs(nx), ay = Math.abs(ny);
        var d = Math.pow(Math.pow(ax, BEZ_N) + Math.pow(ay, BEZ_N), 1 / BEZ_N);
        var m = Math.max(ax, ay);
        var k = d > 1e-6 ? m / d : 1;
        var xx = nx * k * hw, yy = ny * k * hh;
        var z = r - Math.sqrt(Math.max(0, r * r - xx * xx));   // 円筒面
        pos.push(xx, yy, -z);
        uv.push(nx * k * 0.5 + 0.5, ny * k * 0.5 + 0.5);
      }
    }
    for (j = 0; j < seg; j++) {
      for (i = 0; i < seg; i++) {
        var a = j * (seg + 1) + i, b = a + 1, c = a + seg + 1, d = c + 1;
        idx.push(a, b, d, a, d, c);
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  // 管の胴。前面の矩形から後方の首へ絞る漏斗
  function funnelGeometry(hw, hh, r, zEnd, rEnd, seg, lev) {
    var pos = [], uv = [], idx = [], i, j;
    for (j = 0; j <= lev; j++) {
      var t = j / lev;
      var k = Math.pow(t, 0.72);                       // 前半で早く絞る
      for (i = 0; i <= seg; i++) {
        var a = i / seg * Math.PI * 2;
        // 前面は角の丸い矩形、後方は円。段階的に混ぜる
        var e = 2 / lerp(4.6, 2.0, k);
        var cc = Math.cos(a), ss = Math.sin(a);
        var rx = lerp(hw, rEnd, k), ry = lerp(hh, rEnd, k);
        var x = (cc < 0 ? -1 : 1) * rx * Math.pow(Math.abs(cc), e);
        var y = (ss < 0 ? -1 : 1) * ry * Math.pow(Math.abs(ss), e);
        var z0 = -(r - Math.sqrt(Math.max(0, r * r - x * x)));
        pos.push(x, y, lerp(z0, zEnd, k));
        uv.push(i / seg, t);
      }
    }
    for (j = 0; j < lev; j++) {
      for (i = 0; i < seg; i++) {
        var A = j * (seg + 1) + i, B = A + 1, C = A + seg + 1, D = C + 1;
        idx.push(A, C, D, A, D, B);
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  // ─────────────────────────── 筐体
  function sq(w, h, t) {
    var c = Math.cos(t), s = Math.sin(t), e = 2 / NEXP;
    return [(c < 0 ? -1 : 1) * w * Math.pow(Math.abs(c), e),
            (s < 0 ? -1 : 1) * h * Math.pow(Math.abs(s), e)];
  }
  // 奥行きに沿った断面の縮み。前面近くは太く、後半で絞る
  function shrink(t) {
    if (t < 0.20) return 0;                        // 前は箱のまま
    var u = (t - 0.20) / 0.80;
    return Math.pow(u, 1.35) * (u * u * (3 - 2 * u) * 0.5 + 0.5);
  }
  function halfW(t) { return lerp(FW, BWD, shrink(t)); }
  function halfH(t) { return lerp(FH, BHT, shrink(t)); }

  function shell() {
    var pos = [], uv = [], idx = [], rings = [], j, i;
    for (j = 0; j <= LEV; j++) {
      var t = j / LEV, z = -DEPTH * t;
      var w = halfW(t), h = halfH(t), row = [];
      for (i = 0; i <= SEG; i++) {
        var a = (i % SEG) / SEG * Math.PI * 2;
        var p = sq(w, h, a);
        row.push([p[0], p[1] + SCR_CY * (1 - shrink(t)) * 0, z]);
      }
      rings.push(row);
    }
    function push(p, u, v) { pos.push(p[0], p[1], p[2]); uv.push(u, v); return pos.length / 3 - 1; }
    var vid = [];
    for (j = 0; j <= LEV; j++) {
      vid[j] = [];
      for (i = 0; i <= SEG; i++) vid[j][i] = push(rings[j][i], i / SEG, j / LEV);
    }
    for (j = 0; j < LEV; j++) {
      for (i = 0; i < SEG; i++) {
        var A = vid[j][i], B = vid[j][i + 1], C = vid[j + 1][i + 1], D = vid[j + 1][i];
        idx.push(A, D, C, A, C, B);
      }
    }
    // 背面の蓋
    var cen = push([0, 0, -DEPTH], 0.5, 0.5);
    var cap=[];for(i=0;i<=SEG;i++){var v=rings[LEV][i];cap.push(push(v, .5+v[0]/(2*BWD), .5+v[1]/(2*BHT)));}
    for (i = 0; i < SEG; i++) idx.push(cen, cap[i + 1], cap[i]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    smoothPeriodicSeam(g, vid);
    return g;
  }

  // 前面の額。管の周りを塞ぐ一枚（外形は筐体の断面、内側は表示領域）
  function bezel() {
    // Multi-ring rolled front and screen rebate; same outside and aperture envelopes.
    var pos=[],uv=[],idx=[],rings=[],n=SEG;
    var profile=[[0,0],[.025,.0010],[.08,.0012],[.82,0],[.94,-.0005],[1,0]];
    for(var j=0;j<profile.length;j++){
      var row=[],t=profile[j][0];
      for(var i=0;i<=n;i++){
        var a=(i%n)/n*Math.PI*2,p=sq(FW,FH,a),cc=Math.cos(a),ss=Math.sin(a),e=2/BEZ_N;
        var q=[Math.sign(cc)*(SCR_W+.0042)*Math.pow(Math.abs(cc),e),Math.sign(ss)*(SCR_H+.0042)*Math.pow(Math.abs(ss),e)];
        var iz=-(CURV-Math.sqrt(Math.max(0,CURV*CURV-q[0]*q[0])))-.0016;
        var x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]+SCR_CY-p[1])*t;
        pos.push(x,y,.0006*(1-t)+iz*t+profile[j][1]);uv.push(.5+x,.5+y);row.push(pos.length/3-1);
      }rings.push(row);
    }
    for(var j=0;j<rings.length-1;j++)for(var i=0;i<n;i++){
      var a=rings[j][i],b=rings[j][i+1],c=rings[j+1][i],d=rings[j+1][i+1];idx.push(a,d,c,a,b,d);
    }
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();smoothPeriodicSeam(g,rings);return g;
  }

  // ─────────────────────────── 材質
  var M = {}, ENV = null, ETCH = null;

  function etchTexture() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 1024;
    var g = c.getContext('2d');
    g.fillStyle = '#5a5a5a'; g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.14;
    for (var h = 0; h < 260; h++) {
      g.strokeStyle = (h % 2 ? '#8c8c8c' : '#484848');
      g.lineWidth = 1;
      var hx = finishRandom() * c.width;
      g.beginPath(); g.moveTo(hx, 0); g.lineTo(hx, c.height); g.stroke();
    }
    g.globalAlpha = 1;
    var LINE = 'rgba(224,224,224,0.90)';
    function panel(u0, u1, v0, v1) {
      var x0 = u0 * c.width, x1 = u1 * c.width, w = x1 - x0, cx = (x0 + x1) / 2;
      var yTop = (1 - v1) * c.height, yBot = (1 - v0) * c.height;
      g.save();
      g.strokeStyle = LINE; g.fillStyle = LINE;
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.lineWidth = Math.max(1.4, w * 0.009);
      var cols = [-0.24, -0.08, 0.08, 0.24], k, x, y;
      for (k = 0; k < cols.length; k++) {
        x = cx + cols[k] * w;
        var a = yTop + (k % 2 ? w * 0.09 : 0), b = yBot - (k === 1 ? w * 0.14 : 0);
        g.beginPath(); g.moveTo(x, a); g.lineTo(x, b); g.stroke();
        g.beginPath(); g.arc(x, a, w * 0.014, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(x, b, w * 0.014, 0, Math.PI * 2); g.fill();
      }
      var rows = [0.28, 0.60];
      for (k = 0; k < rows.length; k++) {
        y = yTop + (yBot - yTop) * rows[k];
        var lx = cx + cols[k ? 0 : 1] * w, rx = cx + cols[k ? 3 : 2] * w;
        g.beginPath(); g.moveTo(lx, y); g.lineTo(rx, y); g.stroke();
        g.beginPath(); g.arc((lx + rx) / 2, y, w * 0.017, 0, Math.PI * 2); g.fill();
      }
      g.lineWidth = Math.max(1, w * 0.006);
      for (k = 0; k < 3; k++) {
        g.beginPath();
        g.arc(cx, yBot + w * 0.24, w * (0.13 + k * 0.062), Math.PI * 1.14, Math.PI * 1.86);
        g.stroke();
      }
      g.restore();
    }
    panel(0.015, 0.150, 0.30, 0.78);       // 右の面
    panel(0.520, 0.655, 0.30, 0.78);       // 左の面
    // 背面の通気。細い条を等間隔で
    g.strokeStyle = 'rgba(238,238,238,0.95)';
    g.lineWidth = 3;
    for (var s = 0; s < 16; s++) {
      var yy = c.height * 0.16 + s * 9;
      g.beginPath(); g.moveTo(c.width * 0.285, yy); g.lineTo(c.width * 0.395, yy); g.stroke();
      g.beginPath(); g.moveTo(c.width * 0.790, yy); g.lineTo(c.width * 0.900, yy); g.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    return t;
  }

  function buildEnv() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    var g = c.getContext('2d');
    var sky = g.createLinearGradient(0, 0, 0, c.height);
    sky.addColorStop(0.00, '#8e96a6');
    sky.addColorStop(0.30, '#4a5462');
    sky.addColorStop(0.50, '#0b1016');
    sky.addColorStop(1.00, '#030507');
    g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
    var k = g.createRadialGradient(146, 46, 4, 146, 46, 104);
    k.addColorStop(0, 'rgba(255,248,252,1)'); k.addColorStop(1, 'rgba(255,248,252,0)');
    g.fillStyle = k; g.fillRect(20, 0, 260, 170);
    var f = g.createRadialGradient(396, 80, 4, 396, 80, 78);
    f.addColorStop(0, 'rgba(190,238,232,0.42)'); f.addColorStop(1, 'rgba(190,238,232,0)');
    g.fillStyle = f; g.fillRect(312, 12, 170, 140);
    var r = g.createRadialGradient(266, 126, 4, 266, 126, 60);
    r.addColorStop(0, 'rgba(255,92,190,0.60)'); r.addColorStop(1, 'rgba(255,92,190,0)');
    g.fillStyle = r; g.fillRect(200, 70, 130, 116);
    g.fillStyle = 'rgba(226,232,240,0.30)'; g.fillRect(0, 126, c.width, 3);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 96, c.width, 6);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var t = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return t;
  }

  function mats() {
    ETCH = etchTexture();
    M.case = new THREE.MeshStandardMaterial({
      color: 0xecd8e5, roughness: 1.0, roughnessMap: ETCH,
      metalness: 0.76, envMap: ENV, envMapIntensity: 1.05
    });
    M.bezel = new THREE.MeshStandardMaterial({
      color: 0xe4cfdd, roughness: 0.34, metalness: 0.70,
      envMap: ENV, envMapIntensity: 0.95
    });
    M.glass = new THREE.MeshStandardMaterial({
      color: 0x0a0e0d, roughness: 0.075, metalness: 0.0,
      envMap: ENV, envMapIntensity: 0.75,
      transparent: true, opacity: 0.24, depthWrite: false
    });
    M.trim = new THREE.MeshStandardMaterial({
      color: 0xd2d8df, roughness: 0.19, metalness: 0.94,
      envMap: ENV, envMapIntensity: 1.4
    });
    M.mag = new THREE.MeshStandardMaterial({
      color: C_MAG, roughness: 0.26, metalness: 0.40,
      emissive: C_MAG, emissiveIntensity: 0.85
    });
    M.dark = new THREE.MeshStandardMaterial({ color: 0x14181c, roughness: 0.78, metalness: 0.16 });
    M.tube = new THREE.MeshStandardMaterial({
      color: 0x10141a, roughness: 0.52, metalness: 0.34,
      envMap: ENV, envMapIntensity: 0.35, side: THREE.DoubleSide
    });
    M.case.name = "crt.case";
    detailFinish(M.case, "metal", 0.1, 4.5e-05);
    M.bezel.name = "crt.bezel";
    detailFinish(M.bezel, "satin", 0.1, 2.5e-05);
    M.glass.name = "crt.glass";
    M.trim.name = "crt.trim";
    detailFinish(M.trim, "metal", 0.08, 1.6e-05);
    M.mag.name = "crt.mag";
    M.dark.name = "crt.dark";
    detailFinish(M.dark, "satin", 0.1, 3e-05);
    M.tube.name = "crt.tube";
    detailFinish(M.tube, "satin", 0.12, 2.5e-05);

  }

  function box(w, h, d, m, x, y, z) {
    var o = new THREE.Mesh(filletBox(w, h, d, Math.min(w,h,d)*0.14), m);
    o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true;
    return o;
  }

  // ─────────────────────────── 組み立て
  function build() {
    var g = new THREE.Group();

    var sh = new THREE.Mesh(shell(), M.case);
    sh.castShadow = true; sh.receiveShadow = true;
    g.add(sh);

    var bz = new THREE.Mesh(bezel(), M.bezel);
    bz.castShadow = true;
    g.add(bz);

    // 管の面
    screenCanvas = document.createElement('canvas');
    screenCanvas.width = 640; screenCanvas.height = 480;
    paintScreen(0);
    screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.encoding = THREE.sRGBEncoding;
    screenTex.anisotropy = 8;
    var scr = new THREE.Mesh(screenGeometry(SCR_W, SCR_H, CURV, 64),
      new THREE.MeshBasicMaterial({ map: screenTex }));
    scr.position.set(0, SCR_CY, -0.0016);
    g.add(scr);

    // 管の胴。ここが無いと背面から中が抜ける
    var fn = new THREE.Mesh(
      funnelGeometry(SCR_W + 0.0030, SCR_H + 0.0030, CURV, -DEPTH + 0.052, 0.030, 40, 12),
      M.tube);
    fn.position.set(0, SCR_CY, -0.0014);
    fn.castShadow = true;
    g.add(fn);

    // 前面の硝子。映り込みだけを持つ
    var gl = new THREE.Mesh(screenGeometry(SCR_W + 0.0022, SCR_H + 0.0022, CURV, 64), M.glass);
    gl.position.set(0, SCR_CY, 0.0012);
    g.add(gl);
    var glassEdge = glassRim(gl.geometry, 0.0028, M.glass);
    glassEdge.position.copy(gl.position); g.add(glassEdge);

    // 額の下。灯は面へ埋める（座ぐりの底に置く）
    var lampX = -FW + 0.034, lampY = -FH + 0.028;
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.0056, 0.0080, 40), M.dark);
    ring.position.set(lampX, lampY, -0.0003);
    g.add(ring);
    var lamp = new THREE.Mesh(new THREE.CircleGeometry(0.0056, 40), M.mag);
    lamp.position.set(lampX, lampY, -0.0014);
    g.add(lamp);

    // 銘。読める大きさに
    var plq = new THREE.Mesh(new THREE.PlaneGeometry(0.094, 0.0166),
      new THREE.MeshStandardMaterial({ map: markTexture(), transparent: true, roughness: 0.30, metalness: 0.40, envMap: ENV, envMapIntensity: 0.6 }));
    plq.position.set(0.062, -FH + 0.028, 0.0014);
    g.add(plq);

    // 台。柱を介して受ける。筐体とは触れない
    var sz = -DEPTH * 0.32;      // 重心の真下（前面から123mm）。実測で出した位置
    var st = new THREE.Mesh(filletCylinder(STAND_R, STAND_R * 1.05, STAND_H, 72), M.case);
    st.position.set(0, -FH - STEM_H - STAND_H / 2, sz);
    st.castShadow = true; st.receiveShadow = true;
    g.add(st);
    var stTop = new THREE.Mesh(filletCylinder(STAND_R * 0.62, STAND_R * 0.62, 0.0022, 56), M.trim);
    stTop.position.set(0, -FH - STEM_H + 0.0011, sz);
    g.add(stTop);
    // 柱
    var stem = new THREE.Mesh(filletCylinder(0.0182, 0.0230, STEM_H, 48), M.trim);
    stem.position.set(0, -FH - STEM_H / 2, sz);
    stem.castShadow = true;
    g.add(stem);
    // 筐体側の受け
    var seat = new THREE.Mesh(filletCylinder(0.0300, 0.0248, 0.0060, 48), M.case);
    seat.position.set(0, -FH + 0.0026, sz);
    seat.castShadow = true;
    g.add(seat);

    // 背面の口金と束線
    var neck = new THREE.Mesh(filletCylinder(0.020, 0.024, 0.030, 28), M.dark);
    neck.rotation.x = Math.PI / 2;
    neck.position.set(0, 0, -DEPTH - 0.010);
    g.add(neck);
    // 束線は引かない。この室では、送電の経路がどこにも見えていない

    return g;
  }

  function markTexture() {
    var c = document.createElement('canvas');
    c.width = 640; c.height = 116;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(112,96,108,0.78)';
    g.font = '600 58px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('h!ro53', c.width / 2, 42);
    g.fillStyle = 'rgba(112,96,108,0.46)';
    g.font = '500 26px "DejaVu Sans Mono", Menlo, monospace';
    g.fillText('HB-078 · TERMINAL', c.width / 2, 88);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }


    function setEnv(e) { ENV = e; mats(); }
    return { setEnv: setEnv, build: build, seek: setSeek,
      tick: function (t) { var r = Math.floor(t / PUMP) + SEEK;
        if (r !== lastRow) { paintScreen(r); lastRow = r; } } };
  })();

  var P_BOARD = (function () {


  var PUMP = 0.78;
  var C_MAG = 0xff05a8, C_PALE = 0xf2dbe9, C_TURQ = 0x00ddc8;
  var CSS_PALE = '#f2dbe9';

  // ─────────────────────────── 寸法（m）机上に置いた姿勢で測る
  var HT = 0.176;                      // 全高
  var HWID = 0.596 / 2;                // 半幅
  var LEAN = 12 * Math.PI / 180;       // 前面の後傾
  var TAN_F = Math.tan(LEAN);
  var TAN_B = Math.tan(2.9 * Math.PI / 180);
  var ZF0 = 0.0245, ZB0 = -0.0275;     // 底での前面・背面
  var NEXP = 7.4;                      // 断面の指数。角は丸いが辺は直線
  var SEG = 144, LEV = 176;

  // 窓。前面から 4.2 mm 沈める
  var WY0 = 0.030, WY1 = 0.146;
  var WYC = (WY0 + WY1) / 2, WHY = (WY1 - WY0) / 2;
  var WHX = 0.536 / 2;
  var WR = 0.020, WN = 4.0;            // 隅の丸みと、その指数（squircle）
  var POCKET = 0.0058;

  var scene, camera, clock, t0 = 0;
  var scanTex = null, root = null;
  var beating = true;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function zFront(y) { return ZF0 - y * TAN_F; }
  function zBack(y) { return ZB0 - y * TAN_B; }

  // 頂と底を丸めて閉じる。底は机に着くので浅く
  function capTop(y) {
    var t = y / HT;
    if (t < 0.958) return 1;
    var u = Math.min(1, (t - 0.958) / 0.042);
    return Math.sqrt(Math.max(0, 1 - u * u));
  }
  function capBot(y) {
    if (y > 0.0034) return 1;
    var u = (0.0034 - y) / 0.0034;
    return Math.sqrt(Math.max(0, 1 - u * u));
  }
  function csAt(y) { return capTop(y) * capBot(y); }
  function halfW(y) { return HWID * csAt(y); }
  function halfD(y) { return (zFront(y) - zBack(y)) / 2 * csAt(y); }
  function zMid(y) { return (zFront(y) + zBack(y)) / 2; }

  // 窓の輪郭。角丸長方形——隅だけ squircle で受ける
  function winHalfW(y) {
    var dy = Math.abs(y - WYC);
    if (dy >= WHY) return 0;
    if (dy <= WHY - WR) return WHX;
    var u = (dy - (WHY - WR)) / WR;
    return WHX - WR + WR * Math.pow(Math.max(0, 1 - Math.pow(u, WN)), 1 / WN);
  }

  // 窓の深さ。縁は面取りで立ち上がる。段差を一行で落とさない
  function pocketAt(y) {
    var dy = Math.abs(y - WYC);
    if (dy >= WHY) return 0;
    var s = Math.min(1, (WHY - dy) / 0.0030);
    return POCKET * s * s * (3 - 2 * s);
  }

  function sq(w, d, t) {
    var c = Math.cos(t), s = Math.sin(t), e = 2 / NEXP;
    return [
      (c < 0 ? -1 : 1) * w * Math.pow(Math.abs(c), e),
      (s < 0 ? -1 : 1) * d * Math.pow(Math.abs(s), e)
    ];
  }

  // ─────────────────────────── 筐体：一塊の削り出し
  var L_SEG = 60, K_SEG = 16, N_SEG = 16;
  var B_SEG = SEG - L_SEG - K_SEG - N_SEG;    // 背面。窓の幅に関わらず一定
  function ringTs(w, aw) {
    var ts = [], i;
    var t1 = aw <= 0.0002 ? Math.PI / 2
           : Math.acos(Math.pow(Math.min(0.9995, aw / w), NEXP / 2));
    for (i = 0; i < K_SEG; i++) ts.push(t1 * i / K_SEG);                       // 右の肩
    for (i = 0; i <= L_SEG; i++) ts.push(t1 + (Math.PI - 2 * t1) * i / L_SEG); // 窓
    for (i = 1; i <= N_SEG; i++) ts.push((Math.PI - t1) + t1 * i / N_SEG);     // 左の肩
    for (i = 1; i <= B_SEG; i++) ts.push(Math.PI + Math.PI * i / B_SEG);       // 背面
    return ts;
  }

  function shell() {
    // Closed, manufactured wedge with a continuous rounded screen rebate.
    // The current 596 x 176mm envelope, lean, pocket, and separate back engraving are retained.
    var pos=[],uv=[],caseIdx=[],innerIdx=[],rings=[];
    function contour(hw,hh,rad,zOffset,back){
      var row=[],centres=[[1,1],[-1,1],[-1,-1],[1,-1]];
      for(var k=0;k<4;k++)for(var j=0;j<=12;j++){
        var a=(k+j/12)*Math.PI/2,x=centres[k][0]*(hw-rad)+rad*Math.cos(a),y=HT/2+centres[k][1]*(hh-rad)+rad*Math.sin(a);
        row.push(pos.length/3);pos.push(x,y,(back?zBack(y):zFront(y))+zOffset);uv.push(.5+x/(HWID*2),y/HT);
      }
      rings.push(row);return row;
    }
    contour(HWID-.0012,HT/2-.0012,.006,0,true);
    contour(HWID,HT/2,.0072,.0012,true);
    contour(HWID,HT/2,.0072,-.0012,false);
    contour(HWID-.0012,HT/2-.0012,.006,0,false);
    contour(WHX+.0012,WHY+.0012,WR+.0012,0,false);
    contour(WHX,WHY,WR,-.0008,false);
    contour(WHX-.001,WHY-.001,WR-.001,-POCKET+.001,false);
    contour(WHX-.002,WHY-.002,WR-.002,-POCKET,false);
    var n=rings[0].length;
    for(var j=0;j<rings.length-1;j++)for(var i=0;i<n;i++){
      var ni=(i+1)%n,a=rings[j][i],b=rings[j][ni],c=rings[j+1][i],d=rings[j+1][ni],dest=j>=5?innerIdx:caseIdx;
      dest.push(a,b,d,a,d,c);
    }
    var back=pos.length/3;pos.push(0,HT/2,zBack(HT/2));uv.push(.5,.5);
    var floor=pos.length/3;pos.push(0,HT/2,zFront(HT/2)-POCKET);uv.push(.5,.5);
    for(var i=0;i<n;i++){caseIdx.push(back,rings[0][(i+1)%n],rings[0][i]);innerIdx.push(floor,rings[7][i],rings[7][(i+1)%n]);}
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(caseIdx.concat(innerIdx));g.addGroup(0,caseIdx.length,0);g.addGroup(caseIdx.length,innerIdx.length,1);g.computeVertexNormals();
    var nn=g.attributes.normal,frontN=new THREE.Vector3(0,TAN_F,1).normalize(),backN=new THREE.Vector3(0,-TAN_B,-1).normalize();
    [3,4,7].forEach(function(k){rings[k].forEach(function(i){nn.setXYZ(i,frontN.x,frontN.y,frontN.z);});});
    rings[0].forEach(function(i){nn.setXYZ(i,backN.x,backN.y,backN.z);});
    nn.setXYZ(back,backN.x,backN.y,backN.z);nn.setXYZ(floor,frontN.x,frontN.y,frontN.z);return g;
  }

  // ─────────────────────────── 表示面
  // 光るのは字画だけである。地は光らない
  var PW = 2048, PH = 444;
  function panelTexture() {
    var c = document.createElement('canvas');
    c.width = PW; c.height = PH;
    var g = c.getContext('2d');
    g.fillStyle = '#04060a';
    g.fillRect(0, 0, PW, PH);

    var L = 96, R = PW - 96, MEA = R - L;

    // 一行目。二十九字を測りいっぱいに割り付ける
    var EN = 'CHAIRMAN INSTANCE: UNRESOLVED';
    var adv = MEA / (EN.length - 1 + 0.62);
    var size = Math.round(adv / 0.665);
    g.font = '600 ' + size + 'px "DejaVu Sans Mono", "SF Mono", Menlo, monospace';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    // 燐光。管面ではないが、字画の外に光がわずかに滲む
    g.shadowColor = 'rgba(242,219,233,0.55)';
    g.shadowBlur = 26;
    g.fillStyle = 'rgba(238,214,229,0.80)';
    var i;
    for (i = 0; i < EN.length; i++) g.fillText(EN.charAt(i), L + i * adv, 148);

    // 界線。測りの幅を示すためだけの一本
    g.shadowBlur = 0;
    g.strokeStyle = 'rgba(242,219,233,0.24)';
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(L, 236); g.lineTo(R, 236); g.stroke();
    g.shadowColor = 'rgba(242,219,233,0.50)';
    g.shadowBlur = 24;

    // 二行目。和文は左に寄せ、右は空けたままにする
    var JA = '会長　実体：未解決';
    var jsz = 76, jadv = 96;
    g.font = '500 ' + jsz + 'px "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif';
    g.fillStyle = 'rgba(234,209,225,0.74)';
    for (i = 0; i < JA.length; i++) g.fillText(JA.charAt(i), L + i * jadv, 340);
    g.shadowBlur = 0;

    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  // 走査の地。明滅ではない。一拍で一巡する
  function scanTexture() {
    var c = document.createElement('canvas');
    c.width = 4; c.height = 64;
    var g = c.getContext('2d');
    g.clearRect(0, 0, 4, 64);
    for (var y = 0; y < 64; y += 4) {
      g.fillStyle = 'rgba(242,219,233,0.050)';
      g.fillRect(0, y, 4, 2);
    }
    var grad = g.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0.00, 'rgba(242,219,233,0.000)');
    grad.addColorStop(0.46, 'rgba(242,219,233,0.000)');
    grad.addColorStop(0.50, 'rgba(242,219,233,0.038)');
    grad.addColorStop(0.54, 'rgba(242,219,233,0.000)');
    grad.addColorStop(1.00, 'rgba(242,219,233,0.000)');
    g.fillStyle = grad; g.fillRect(0, 0, 4, 64);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 74);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  // ─────────────────────────── 背面の彫り。h!ro53 の図形だけを置く
  function backTexture() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 384;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    var INK = 'rgba(222,230,240,0.72)';
    g.strokeStyle = INK; g.fillStyle = INK;
    g.lineCap = 'round'; g.lineJoin = 'round';

    // 06 の規則で組む。線幅・ノード径・角の R を語のなかで統一する
    var cx = c.width / 2, cy = 176, W = 470;
    g.lineWidth = 5;
    var cols = [-0.30, -0.10, 0.10, 0.30], k, x, y;
    for (k = 0; k < cols.length; k++) {
      x = cx + cols[k] * W;
      var a = cy - 96 + (k % 2 ? 26 : 0), b = cy + 96 - (k === 1 ? 34 : 0);
      g.beginPath(); g.moveTo(x, a); g.lineTo(x, b); g.stroke();
      g.beginPath(); g.arc(x, a, 8, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x, b, 8, 0, Math.PI * 2); g.fill();
    }
    var rows = [0.24, 0.54, 0.80];
    for (k = 0; k < rows.length; k++) {
      y = cy - 96 + 192 * rows[k];
      var lx = cx + cols[k % 2 ? 0 : 1] * W, rx = cx + cols[k % 2 ? 3 : 2] * W;
      g.beginPath(); g.moveTo(lx, y); g.lineTo(rx, y); g.stroke();
      g.beginPath(); g.arc((lx + rx) / 2, y, 10, 0, Math.PI * 2); g.fill();
    }
    // 基壇の弧
    g.lineWidth = 2.6;
    for (k = 0; k < 3; k++) {
      g.beginPath();
      g.arc(cx, cy + 138, 74 + k * 34, Math.PI * 1.14, Math.PI * 1.86);
      g.stroke();
    }
    // 銘。前面には置かない
    g.fillStyle = 'rgba(222,230,240,0.60)';
    g.font = '600 36px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('h!ro53', cx, 306);
    // 端子。彫り込みとして図に含める。部品を貼らない
    g.strokeStyle = 'rgba(200,210,222,0.50)';
    g.lineWidth = 3;
    g.strokeRect(cx - 62, 344, 124, 26);
    g.fillStyle = 'rgba(150,160,172,0.34)';
    g.fillRect(cx - 56, 350, 112, 14);

    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  // ─────────────────────────── 材質
  var M = {}, ENV = null, ETCH_CANVAS = null;

  function etchTexture() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = '#6e6e6e';
    g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.15;
    for (var h = 0; h < 340; h++) {
      g.strokeStyle = (h % 2 ? '#8c8c8c' : '#4a4a4a');
      g.lineWidth = 1;
      var hx = finishRandom() * c.width;
      g.beginPath(); g.moveTo(hx, 0); g.lineTo(hx, c.height); g.stroke();
    }
    g.globalAlpha = 1;
    ETCH_CANVAS = c;
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    return t;
  }
  function etchTint() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.08;
    g.drawImage(ETCH_CANVAS, 0, 0);
    g.globalAlpha = 1;
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  function buildEnv() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    var g = c.getContext('2d');
    var sky = g.createLinearGradient(0, 0, 0, c.height);
    sky.addColorStop(0.00, '#8e96a6');
    sky.addColorStop(0.30, '#4a5462');
    sky.addColorStop(0.50, '#0b1016');
    sky.addColorStop(1.00, '#030507');
    g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
    var k = g.createRadialGradient(146, 46, 4, 146, 46, 104);
    k.addColorStop(0, 'rgba(255,248,252,1)');
    k.addColorStop(1, 'rgba(255,248,252,0)');
    g.fillStyle = k; g.fillRect(20, 0, 260, 170);
    var f = g.createRadialGradient(396, 80, 4, 396, 80, 78);
    f.addColorStop(0, 'rgba(190,238,232,0.40)');
    f.addColorStop(1, 'rgba(124,244,230,0)');
    g.fillStyle = f; g.fillRect(312, 12, 170, 140);
    var r = g.createRadialGradient(266, 126, 4, 266, 126, 60);
    r.addColorStop(0, 'rgba(255,88,190,0.26)');
    r.addColorStop(1, 'rgba(255,88,190,0)');
    g.fillStyle = r; g.fillRect(200, 70, 130, 116);
    g.fillStyle = 'rgba(226,232,240,0.28)';
    g.fillRect(0, 126, c.width, 3);
    g.fillStyle = 'rgba(255,255,255,0.10)';
    g.fillRect(0, 96, c.width, 6);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var t = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return t;
  }

  function mats() {
    M.case = new THREE.MeshStandardMaterial({
      color: 0xd9c4d2, roughness: 1.0, roughnessMap: etchTexture(), map: etchTint(),
      metalness: 0.82, envMap: ENV, envMapIntensity: 0.96
    });
    M.inner = new THREE.MeshStandardMaterial({
      color: 0x2b323b, roughness: 0.33, metalness: 0.80,
      envMap: ENV, envMapIntensity: 0.90, side: THREE.DoubleSide
    });
    M.foot = new THREE.MeshStandardMaterial({
      color: 0x14171b, roughness: 0.86, metalness: 0.10,
      envMap: ENV, envMapIntensity: 0.20
    });
    M.trim = new THREE.MeshStandardMaterial({
      color: 0xdde2e9, roughness: 0.18, metalness: 0.95,
      envMap: ENV, envMapIntensity: 1.4
    });
    M.case.name = "board.case";
    detailFinish(M.case, "metal", 0.1, 4.5e-05);
    M.inner.name = "board.inner";
    detailFinish(M.inner, "metal", 0.1, 2e-05);
    M.foot.name = "board.foot";
    detailFinish(M.foot, "rubber", 0.08, 4e-05);
    M.trim.name = "board.trim";
    detailFinish(M.trim, "metal", 0.08, 1.6e-05);

  }

  function box(w, h, d, m, x, y, z) {
    var o = new THREE.Mesh(filletBox(w, h, d, Math.min(w,h,d)*0.14), m);
    o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true;
    return o;
  }

  // ─────────────────────────── 組み立て
  function build() {
    var g = new THREE.Group();

    var sh = new THREE.Mesh(shell(), [M.case, M.inner]);
    sh.castShadow = true; sh.receiveShadow = true;
    g.add(sh);

    // 表示面。窓の底より 0.4 mm 手前に浮かす
    var pz = ZF0 - POCKET + 0.0004;
    var panelH = (WY1 - WY0 - 0.0074) / Math.cos(LEAN);
    var panel = new THREE.Mesh(
      new THREE.PlaneGeometry(WHX * 2 - 0.0074, panelH),
      new THREE.MeshBasicMaterial({ map: panelTexture() }));
    panel.rotation.x = -LEAN;
    panel.position.set(0, WYC, pz - WYC * TAN_F);
    g.add(panel);

    // 走査。字の上を一拍で一巡する。明滅はしない
    scanTex = scanTexture();
    var scan = new THREE.Mesh(
      new THREE.PlaneGeometry(WHX * 2 - 0.0074, panelH),
      new THREE.MeshBasicMaterial({
        map: scanTex, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending
      }));
    scan.rotation.x = -LEAN;
    scan.position.set(0, WYC, pz - WYC * TAN_F + 0.0006);
    g.add(scan);

    // 背面の彫り
    var byc = 0.088;
    var back = new THREE.Mesh(
      new THREE.PlaneGeometry(0.404, 0.152),
      new THREE.MeshStandardMaterial({
        map: backTexture(), transparent: true, roughness: 0.34, metalness: 0.55,
        envMap: ENV, envMapIntensity: 0.6
      }));
    back.rotation.set(-Math.atan(TAN_B), Math.PI, 0);   // 背面の傾きに合わせる
    back.position.set(0, byc, zBack(byc) - 0.0006);
    g.add(back);

    // 底の脚。机に触れるのはここだけである
    var fz = zMid(0);
    g.add(box(HWID * 2 - 0.052, 0.0022, 0.020, M.foot, 0, 0.0011, fz + 0.0125));
    g.add(box(HWID * 2 - 0.052, 0.0022, 0.020, M.foot, 0, 0.0011, fz - 0.0125));

    return g;
  }


    function setEnv(e) { ENV = e; mats(); }
    return { setEnv: setEnv, build: build,
      tick: function (t) { if (scanTex) scanTex.offset.y = -((t % PUMP) / PUMP); } };
  })();

  var P_CHAIR = (function () {


  var C_PALE = 0xf2dbe9;

  // ─────────────────────────── 寸法（m）
  var SEAT_H = 0.475;                  // 座面の高さ
  var BACK_TOP = 1.241;                // 座上 754 mm
  var FILLET = 0.008;                  // 全部材で等しい稜の丸み。これが「保守」の跡である
  var NEXP = 6.0;

  var BACK_LEAN = 0.105;               // 6.0 度

  var scene, camera, clock, t0 = 0;

  // ─────────────────────────── 素形
  function sqPt(w, d, t, n) {
    var c = Math.cos(t), s = Math.sin(t), e = 2 / n;
    return [(c < 0 ? -1 : 1) * w * Math.pow(Math.abs(c), e),
            (s < 0 ? -1 : 1) * d * Math.pow(Math.abs(s), e)];
  }

  // 稜が一様に落ちた箱。上下に絞りを与えられる。crown で天面を膨らませる
  function roundedBox(o) {
    var wb = o.wb, wt = o.wt === undefined ? o.wb : o.wt;
    var db = o.db, dt = o.dt === undefined ? o.db : o.dt;
    var h = o.h, r = o.r === undefined ? FILLET : o.r;
    var n = o.n === undefined ? NEXP : o.n;
    var crown = o.crown || 0;
    var SEG = o.seg || 56, LEV = o.lev || 34;
    var pos = [], uv = [], idx = [], i, j, rings = [];

    for (j = 0; j <= LEV; j++) {
      var v = j / LEV, y = -h / 2 + h * v;
      var dEdge = h / 2 - Math.abs(y);
      var off = 0;
      if (dEdge < r) {
        var u = r - dEdge;
        off = r - Math.sqrt(Math.max(0, r * r - u * u));
      }
      var hw = Math.max(1e-4, (wb + (wt - wb) * v) / 2 - off);
      var hd = Math.max(1e-4, (db + (dt - db) * v) / 2 - off);
      var row = [];
      for (i = 0; i <= SEG; i++) {
        var p = sqPt(hw, hd, Math.PI * 2 * i / SEG, n);
        var yy = y;
        if (crown && y > 0) {
          var nx = p[0] / (wb / 2), nz = p[1] / (db / 2);
          yy += crown * (y / (h / 2)) * Math.max(0, 1 - nx * nx) * Math.max(0, 1 - nz * nz);
        }
        row.push([p[0], yy, p[1]]);
      }
      rings.push(row);
    }
    function push(p, a, b) { pos.push(p[0], p[1], p[2]); uv.push(a, b); return pos.length / 3 - 1; }
    var vid = [];
    for (j = 0; j <= LEV; j++) {
      vid[j] = [];
      for (i = 0; i <= SEG; i++) vid[j][i] = push(rings[j][i], i / SEG, j / LEV);
    }
    for (j = 0; j < LEV; j++) {
      for (i = 0; i < SEG; i++) {
        var A = vid[j][i], B = vid[j][i + 1], C = vid[j + 1][i + 1], D = vid[j + 1][i];
        idx.push(A, D, C, A, C, B);
      }
    }
    var cb = push([0, -h / 2, 0], 0.5, 0.5);
    for (i = 0; i < SEG; i++) idx.push(cb, vid[0][i], vid[0][i + 1]);
    var ct = push([0, h / 2 + crown, 0], 0.5, 0.5);
    for (i = 0; i < SEG; i++) idx.push(ct, vid[LEV][i + 1], vid[LEV][i]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    smoothPeriodicSeam(g, vid);
    return g;
  }

  // 平面（y–z）上の経路に沿って断面を送る。肘掛けはこれ一本で作る
  function catmull(pts, m) {
    var out = [], i, k;
    function at(a) { return pts[Math.max(0, Math.min(pts.length - 1, a))]; }
    for (i = 0; i < pts.length - 1; i++) {
      var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      for (k = 0; k < m; k++) {
        var t = k / m, t2 = t * t, t3 = t2 * t, c = [0, 0];
        for (var a = 0; a < 2; a++) {
          c[a] = 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t +
                 (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 +
                 (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3);
        }
        out.push(c);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function ofFn(v) { return typeof v === 'function' ? v : function () { return v; }; }

  // 経路を法線方向へずらす。詰め物は殻と同じ曲線に乗る
  function offsetPath(path, d) {
    var out = [], i;
    for (i = 0; i < path.length; i++) {
      var a = Math.max(0, i - 1), b = Math.min(path.length - 1, i + 1);
      var ty = path[b][0] - path[a][0], tz = path[b][1] - path[a][1];
      var L = Math.hypot(ty, tz) || 1;
      out.push([path[i][0] + d * (-tz / L), path[i][1] + d * (ty / L)]);
    }
    return out;
  }

  // 弧長 [m] で経路を切り出す。b が負なら終端からの戻り量
  function subPath(path, a, b) {
    var P = catmull(path, 12), s = [0], i;
    for (i = 1; i < P.length; i++) {
      s.push(s[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    }
    var tot = s[s.length - 1];
    if (b < 0) b = tot + b;
    a = Math.max(0, a); b = Math.min(tot, b);
    function at(v) {
      for (var k = 1; k < P.length; k++) {
        if (s[k] >= v) {
          var f = (v - s[k - 1]) / Math.max(1e-9, s[k] - s[k - 1]);
          return [P[k - 1][0] + (P[k][0] - P[k - 1][0]) * f,
                  P[k - 1][1] + (P[k][1] - P[k - 1][1]) * f];
        }
      }
      return P[P.length - 1];
    }
    var out = [at(a)];
    for (i = 0; i < P.length; i++) if (s[i] > a && s[i] < b) out.push(P[i]);
    out.push(at(b));
    return out;
  }

  function sweepPlanar(path, hw0, hd0, r, n, seg) {
    var P = catmull(path, path.length > 40 ? 1 : 14), i, j;   // 密な列は再細分しない
    if (path.length > 40) P = path.slice();
    var hwF = ofFn(hw0), hdF = ofFn(hd0);
    // 弧長
    var s = [0];
    for (i = 1; i < P.length; i++) {
      s.push(s[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    }
    var total = s[s.length - 1];
    P = samplePathEnds(P, s, r); s=[0];
    for(i=1;i<P.length;i++)s.push(s[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
    var pos = [], uv = [], idx = [], rings = [];
    for (j = 0; j < P.length; j++) {
      var a = Math.max(0, j - 1), b = Math.min(P.length - 1, j + 1);
      var ty = P[b][0] - P[a][0], tz = P[b][1] - P[a][1];
      var L = Math.hypot(ty, tz) || 1;
      var ny = -tz / L, nz = ty / L;                  // 経路の法線
      var dEdge = Math.min(s[j], total - s[j]);
      var off = 0;
      if (dEdge < r) {
        var u = r - dEdge;
        off = r - Math.sqrt(Math.max(0, r * r - u * u));
      }
      var q = s[j] / total;
      var aw = Math.max(1e-4, hwF(q) - off), ad = Math.max(1e-4, hdF(q) - off);
      var row = [];
      for (i = 0; i <= seg; i++) {
        var p = sqPt(aw, ad, Math.PI * 2 * i / seg, n);
        row.push([p[0], P[j][0] + p[1] * ny, P[j][1] + p[1] * nz]);
      }
      rings.push(row);
    }
    function push(p, a2, b2) { pos.push(p[0], p[1], p[2]); uv.push(a2, b2); return pos.length / 3 - 1; }
    var vid = [];
    for (j = 0; j < rings.length; j++) {
      vid[j] = [];
      for (i = 0; i <= seg; i++) vid[j][i] = push(rings[j][i], i / seg, j / (rings.length - 1));
    }
    for (j = 0; j < rings.length - 1; j++) {
      for (i = 0; i < seg; i++) {
        var A = vid[j][i], B = vid[j][i + 1], C = vid[j + 1][i + 1], D = vid[j + 1][i];
        idx.push(A, D, C, A, C, B);
      }
    }
    var c0 = push([0, P[0][0], P[0][1]], 0.5, 0.5);
    for (i = 0; i < seg; i++) idx.push(c0, vid[0][i], vid[0][i + 1]);
    var last = rings.length - 1;
    var c1 = push([0, P[last][0], P[last][1]], 0.5, 0.5);
    for (i = 0; i < seg; i++) idx.push(c1, vid[last][i + 1], vid[last][i]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    smoothPeriodicSeam(g, vid);
    return g;
  }

  // ─────────────────────────── 背面の彫り
  function backTexture() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 768;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    var INK = 'rgba(206,216,228,0.60)';
    g.strokeStyle = INK; g.fillStyle = INK;
    g.lineCap = 'round'; g.lineJoin = 'round';
    var cx = c.width / 2, cy = 336, W = 300;
    g.lineWidth = 4;
    var cols = [-0.30, -0.10, 0.10, 0.30], k, x, y;
    for (k = 0; k < cols.length; k++) {
      x = cx + cols[k] * W;
      var a = cy - 150 + (k % 2 ? 42 : 0), b = cy + 150 - (k === 1 ? 54 : 0);
      g.beginPath(); g.moveTo(x, a); g.lineTo(x, b); g.stroke();
      g.beginPath(); g.arc(x, a, 7, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x, b, 7, 0, Math.PI * 2); g.fill();
    }
    var rows = [0.22, 0.52, 0.80];
    for (k = 0; k < rows.length; k++) {
      y = cy - 150 + 300 * rows[k];
      var lx = cx + cols[k % 2 ? 0 : 1] * W, rx = cx + cols[k % 2 ? 3 : 2] * W;
      g.beginPath(); g.moveTo(lx, y); g.lineTo(rx, y); g.stroke();
      g.beginPath(); g.arc((lx + rx) / 2, y, 9, 0, Math.PI * 2); g.fill();
    }
    g.lineWidth = 2.2;
    for (k = 0; k < 3; k++) {
      g.beginPath();
      g.arc(cx, cy + 218, 52 + k * 26, Math.PI * 1.14, Math.PI * 1.86);
      g.stroke();
    }
    g.fillStyle = 'rgba(206,216,228,0.46)';
    g.font = '600 26px "DejaVu Sans Mono", Menlo, monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('h!ro53', cx, cy + 268);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  // ─────────────────────────── 材質
  var M = {}, ENV = null, ETCH = null;

  function grainTexture() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = '#6a6a6a'; g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.13;
    for (var h = 0; h < 260; h++) {
      g.strokeStyle = (h % 2 ? '#8e8e8e' : '#4c4c4c');
      g.lineWidth = 1;
      var hx = finishRandom() * c.width;
      g.beginPath(); g.moveTo(hx, 0); g.lineTo(hx, c.height); g.stroke();
    }
    g.globalAlpha = 1;
    ETCH = c;
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }

  // 織り。詰め物の面。艶を一様に散らす
  function weaveTexture() {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#b4b4b4'; g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.12;
    for (var i = 0; i < c.width; i += 4) {
      g.fillStyle = (i / 4) % 2 ? '#d2d2d2' : '#909090';
      g.fillRect(i, 0, 2, c.height);
      g.fillRect(0, i, c.width, 2);
    }
    g.globalAlpha = 1;
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(9, 9);
    t.anisotropy = 8;
    return t;
  }

  function buildEnv() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    var g = c.getContext('2d');
    var sky = g.createLinearGradient(0, 0, 0, c.height);
    sky.addColorStop(0.00, '#8e96a6');
    sky.addColorStop(0.30, '#4a5462');
    sky.addColorStop(0.50, '#0b1016');
    sky.addColorStop(1.00, '#030507');
    g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
    var k = g.createRadialGradient(146, 46, 4, 146, 46, 104);
    k.addColorStop(0, 'rgba(255,248,252,1)');
    k.addColorStop(1, 'rgba(255,248,252,0)');
    g.fillStyle = k; g.fillRect(20, 0, 260, 170);
    var f = g.createRadialGradient(396, 80, 4, 396, 80, 78);
    f.addColorStop(0, 'rgba(190,238,232,0.36)');
    f.addColorStop(1, 'rgba(124,244,230,0)');
    g.fillStyle = f; g.fillRect(312, 12, 170, 140);
    var r = g.createRadialGradient(266, 126, 4, 266, 126, 60);
    r.addColorStop(0, 'rgba(255,88,190,0.24)');
    r.addColorStop(1, 'rgba(255,88,190,0)');
    g.fillStyle = r; g.fillRect(200, 70, 130, 116);
    g.fillStyle = 'rgba(226,232,240,0.26)'; g.fillRect(0, 126, c.width, 3);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 96, c.width, 6);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var t = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return t;
  }

  function mats() {
    // 枠は暗く、詰め物は明るく。逆にすると椅子が額縁に見える
    M.frame = new THREE.MeshStandardMaterial({
      color: 0x2b3038, roughness: 1.0, roughnessMap: grainTexture(),
      metalness: 0.86, envMap: ENV, envMapIntensity: 1.00
    });
    M.pad = new THREE.MeshStandardMaterial({
      color: 0xcfc0cb, roughness: 0.86,
      metalness: 0.04, envMap: ENV, envMapIntensity: 0.26
    });
    M.foot = new THREE.MeshStandardMaterial({
      color: 0x101317, roughness: 0.82, metalness: 0.12,
      envMap: ENV, envMapIntensity: 0.16
    });
    M.frame.name = "chair.frame";
    detailFinish(M.frame, "metal", 0.1, 3.5e-05);
    M.pad.name = "chair.pad";
    detailFinish(M.pad, "cloth", 0.064, 0.00018);
    M.foot.name = "chair.foot";
    detailFinish(M.foot, "rubber", 0.08, 5e-05);

  }

  function mesh(geo, mat, x, y, z) {
    var o = new THREE.Mesh(geo, mat);
    o.position.set(x || 0, y || 0, z || 0);
    o.castShadow = true; o.receiveShadow = true;
    return o;
  }

  // ─────────────────────────── 組み立て
  // 殻は一枚である。背の頂から下り、曲がって、座になる。継ぎ目はない
  // 座は 520 × 504 mm。ほぼ正方形である
  var SHELL = [[1.241, -0.386], [1.100, -0.371], [0.950, -0.355], [0.800, -0.339],
               [0.660, -0.325], [0.560, -0.314], [0.490, -0.298], [0.4485, -0.264],
               [0.4440, -0.200], [0.4440, -0.090], [0.4440, 0.020], [0.4448, 0.120],
               [0.4490, 0.196], [0.4620, 0.242]];
  var S_BEND = 0.836;                   // 曲がりの弧長。詰め物はここで分かれる
  // 座は平らである。使われた座面は沈む。沈んでいないことが、この椅子の履歴である
  // 殻は背の頂で薄く、座で厚い。荷を受ける側が厚いのは道理である
  function shellHD(q) {
    var s = Math.min(1, Math.max(0, (q - 0.22) / 0.38));
    return 0.0085 + 0.0105 * s * s * (3 - 2 * s);
  }
  function shellHW(q) {                 // 背の頂だけ細める
    var s = Math.min(1, q / 0.24);
    return 0.236 + 0.024 * s * s * (3 - 2 * s);
  }

  function build() {
    var g = new THREE.Group(), s;

    // 殻
    var shell = new THREE.Mesh(
      sweepPlanar(SHELL, shellHW, shellHD, 0.009, 6.4, 64), M.frame);
    shell.castShadow = true; shell.receiveShadow = true;
    g.add(shell);

    // 詰め物。殻と同じ曲線に乗る。背と座で二枚に割れている
    function padHD(q) { var e = Math.min(q, 1 - q); return 0.017 * Math.min(1, e / 0.022); }
    // 上端・前端は殻より内側で止める。面一にすると縁が痩せて見える
    var backPad = new THREE.Mesh(sweepPlanar(
      subPath(offsetPath(SHELL, -0.020), 0.032, S_BEND - 0.003), 0.222, padHD, 0.015, 4.8, 44), M.pad);
    backPad.castShadow = true; backPad.receiveShadow = true;
    g.add(backPad);
    var seatPad = new THREE.Mesh(sweepPlanar(
      subPath(offsetPath(SHELL, -0.026), S_BEND + 0.003, -0.030), 0.232, padHD, 0.015, 4.8, 44), M.pad);
    seatPad.castShadow = true; seatPad.receiveShadow = true;
    g.add(seatPad);

    // 背の彫り。前面には何も置かない
    var by = 0.900, bz = -0.3497 - 0.0140;
    var etch = new THREE.Mesh(new THREE.PlaneGeometry(0.290, 0.430),
      new THREE.MeshStandardMaterial({
        map: backTexture(), transparent: true, roughness: 0.34, metalness: 0.62,
        envMap: ENV, envMapIntensity: 0.55
      }));
    etch.rotation.set(-BACK_LEAN, Math.PI, 0);
    etch.position.set(0, by, bz);
    g.add(etch);

    // 肘掛け。殻の側から生えて、宙で終わる。前脚では支えない
    var arm = [[0.606, -0.319], [0.660, -0.281], [0.700, -0.206], [0.716, -0.100],
               [0.720, 0.012], [0.720, 0.120], [0.722, 0.192]];
    for (s = -1; s <= 1; s += 2) {
      var a = new THREE.Mesh(sweepPlanar(arm, 0.024, 0.017, 0.014, 5.4, 40), M.frame);
      a.position.x = s * 0.262;
      a.castShadow = true; a.receiveShadow = true;
      g.add(a);
    }

    // 脚。殻の裏へ直に立つ。回らない。キャスターもない
    // 後脚は背の傾きをそのまま床まで下ろす。背・曲がり・脚が一本の線になる
    var PADH = 0.0030, TOPY = 0.4315;
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (q) {
      var rear = q[1] < 0;
      var zt = rear ? -0.256 : 0.190;
      var zb = rear ? zt - (TOPY - PADH) * Math.tan(BACK_LEAN) : zt;
      var LH = Math.hypot(TOPY - PADH, zb - zt);
      var lg = mesh(roundedBox({
        wb: 0.034, wt: 0.054, db: 0.034, dt: 0.054, h: LH, r: FILLET, n: 6.2, lev: 30
      }), M.frame, q[0] * 0.226, (PADH + TOPY) / 2, (zb + zt) / 2);
      if (rear) {lg.rotation.x = BACK_LEAN; lg.updateMatrix();
        var inv=lg.matrix.clone().invert(),pp=lg.geometry.attributes.position;
        for(var vi=0;vi<pp.count;vi++){var vv=new THREE.Vector3().fromBufferAttribute(pp,vi).applyMatrix4(lg.matrix);if(vv.y<PADH){vv.y=PADH;vv.applyMatrix4(inv);pp.setXYZ(vi,vv.x,vv.y,vv.z);}}
        pp.needsUpdate=true; lg.geometry.computeVertexNormals();
      }
      g.add(lg);
      // 接地。床に擦れはない
      g.add(mesh(roundedBox({ wb: 0.031, db: 0.031, h: PADH, r: 0.0012, n: 6.0, seg: 40, lev: 8 }),
        M.foot, q[0] * 0.226, PADH / 2, zb));
    });

    return g;
  }


    function setEnv(e) { ENV = e; mats(); }
    return { setEnv: setEnv, build: build, tick: null };
  })();

  var P_ROOM = (function () {


  var C_MAG = 0xff05a8, C_PALE = 0xf2dbe9, C_TURQ = 0x00ddc8;

  // ─────────────────────────── 寸法（m）
  var ROOM_W = 5.20, ROOM_D = 6.40, ROOM_H = 2.80;
  var HX = ROOM_W / 2, HZ = ROOM_D / 2;
  var WALL_T = 0.14;                          // 壁の見付き厚

  var WIN_W = 1.72, WIN_H = 0.80, WIN_Y0 = 1.32;
  var WIN_Y1 = WIN_Y0 + WIN_H;

  var DESK_W = 1.80, DESK_D = 0.80, DESK_H = 0.72, DESK_T = 0.042;
  var DESK_CZ = -0.35;
  var CHAIR_Z = -1.60;
  var BOARD_Z = -0.24, TERM_X = -0.420, METRO_X = 0.500;

  var FILLET = 0.006, NEXP = 7.0;

  // 正典の視点。眼高 1.30 m・俯角 7.6 度・画角 42 度
  var CAM_POS = [0, 1.30, 1.25], CAM_LOOK = [0, 0.98, -1.15];

  var scene, camera, clock, t0 = 0;
  var free = false, fYaw = 0.00, fPit = 0.10, fDist = 4.6;
  var ghost = [];

  // ─────────────────────────── 素形
  function sqPt(w, d, t, n) {
    var c = Math.cos(t), s = Math.sin(t), e = 2 / n;
    return [(c < 0 ? -1 : 1) * w * Math.pow(Math.abs(c), e),
            (s < 0 ? -1 : 1) * d * Math.pow(Math.abs(s), e)];
  }

  // 稜が一様に落ちた箱
  function roundedBox(w, h, d, r, n, seg, lev) {
    r = Math.min(r === undefined ? FILLET : r, Math.min(w,h,d) * 0.49);
    var half = [w/2,h/2,d/2], pos=[], normal=[], uv=[], idx=[];
    function cuts(h) {
      var a=[], steps=Math.min(w,h,d)<0.025?3:6;
      for(var j=0;j<=steps;j++) a.push(-h+r*(1-Math.cos(j/steps*Math.PI/2)));
      for(var j=0;j<=steps;j++) a.push(h-r+r*Math.sin(j/steps*Math.PI/2));
      return a;
    }
    for(var axis=0;axis<3;axis++) for(var sign=-1;sign<=1;sign+=2){
      var u=(axis+1)%3,v=(axis+2)%3,U=cuts(half[u]),V=cuts(half[v]),start=pos.length/3;
      for(var j=0;j<V.length;j++) for(var i=0;i<U.length;i++){
        var q=[0,0,0];q[axis]=sign*half[axis];q[u]=U[i];q[v]=V[j];
        var c=q.map(function(x,k){return Math.max(-half[k]+r,Math.min(half[k]-r,x));});
        var N=q.map(function(x,k){return x-c[k];}),L=Math.hypot(N[0],N[1],N[2]);
        for(var k=0;k<3;k++){N[k]/=L;pos.push(c[k]+N[k]*r);normal.push(N[k]);}
        uv.push((q[u]/half[u]+1)/2,(q[v]/half[v]+1)/2);
      }
      for(var j=0;j<V.length-1;j++) for(var i=0;i<U.length-1;i++){
        var A=start+j*U.length+i,B=A+1,C=A+U.length,D=C+1;
        if(sign>0)idx.push(A,B,D,A,D,C);else idx.push(A,D,B,A,C,D);
      }
    }
    var g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('normal',new THREE.Float32BufferAttribute(normal,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g;
  }

  // ─────────────────────────── 材質
  var M = {}, ENV = null;

  function concreteTexture(shade) {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = shade; g.fillRect(0, 0, c.width, c.height);
    // 打ち放しの粒。汚しではない。面の均質さを崩さない程度
    var d = g.getImageData(0, 0, c.width, c.height), a = d.data, i;
    var _s = 20260829;
    function rnd() { _s = (_s * 9301 + 49297) % 233280; return _s / 233280; }
    for (i = 0; i < a.length; i += 4) {
      var v = (rnd() - 0.5) * 6;
      a[i] += v; a[i + 1] += v; a[i + 2] += v;
    }
    g.putImageData(d, 0, 0);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    t.anisotropy = 8;
    return t;
  }

  function buildEnv() {
    // 室内には空がない。反射させるのは机上の二つの光だけである
    var c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    var g = c.getContext('2d');
    // 上は光る天井、下は暗い床。金属が映すのはこの二層だけである
    var sky = g.createLinearGradient(0, 0, 0, c.height);
    sky.addColorStop(0.00, '#9a919c');
    sky.addColorStop(0.26, '#6a646e');
    sky.addColorStop(0.46, '#2d3238');
    sky.addColorStop(0.54, '#20252b');
    sky.addColorStop(1.00, '#0a0d10');
    g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
    var b = g.createRadialGradient(150, 78, 2, 150, 78, 26);
    b.addColorStop(0, 'rgba(0,221,200,0.30)');
    b.addColorStop(1, 'rgba(0,221,200,0)');
    g.fillStyle = b; g.fillRect(120, 50, 62, 56);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var t = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return t;
  }

  function mats() {
    M.wall = new THREE.MeshStandardMaterial({
      color: 0x2e323a, roughness: 0.94, metalness: 0.0,
      map: concreteTexture('#6a6f76')
    });
    // 床も無地の板ではない。粒を与えないと、灰色の空白に見える
    var fl = concreteTexture('#a9a2a6');
    fl.repeat.set(9, 11);
    M.floor = new THREE.MeshStandardMaterial({
      color: 0x97818e, roughness: 0.57, metalness: 0.08, map: fl,
      envMap: ENV, envMapIntensity: 0.50
    });
    M.floor.__g = true;
    // 天井と床は苺乳の色。うっすらとした桃。光るのは器具だけである
    var cl = concreteTexture('#b3a8ae');
    cl.repeat.set(7, 9);
    M.ceil = new THREE.MeshStandardMaterial({
      color: 0xb2919f, roughness: 0.98, metalness: 0.0, map: cl,
      emissive: 0x8d6f7d, emissiveMap: cl, emissiveIntensity: 0.075
    });
    M.ceil.__g = true;
    // 器具の枠。削り出しの縁
    M.lampFrame = new THREE.MeshStandardMaterial({
      color: 0xcfc0c9, roughness: 0.44, metalness: 0.34,
      envMap: ENV, envMapIntensity: 0.7,
      emissive: 0xf2dbe9, emissiveIntensity: 0.10
    });
    M.lampFrame.__g = true;
    // 机。光を受けるための面。艶を張りすぎると室が明るくなる
    M.desk = new THREE.MeshStandardMaterial({
      color: 0x2e333a, roughness: 0.34, metalness: 0.72,
      envMap: ENV, envMapIntensity: 0.85
    });
    M.trim = new THREE.MeshStandardMaterial({
      color: 0x9aa3ad, roughness: 0.22, metalness: 0.94,
      envMap: ENV, envMapIntensity: 1.1
    });
    M.dark = new THREE.MeshStandardMaterial({
      color: 0x14171b, roughness: 0.70, metalness: 0.14,
      envMap: ENV, envMapIntensity: 0.20
    });
    // 硝子。外は原点の暗さ。室内がうすく映る
    M.glass = new THREE.MeshStandardMaterial({
      color: 0x080b0e, roughness: 0.07, metalness: 0.0,
      envMap: ENV, envMapIntensity: 0.20,
      transparent: true, opacity: 0.82
    });
    M.void = new THREE.MeshBasicMaterial({ color: 0x010204 });
    M.ghost = new THREE.MeshStandardMaterial({
      color: 0x2a2f36, roughness: 0.66, metalness: 0.30,
      envMap: ENV, envMapIntensity: 0.35,
      transparent: true, opacity: 0.26, depthWrite: false
    });
    M.wall.name = "room.wall";
    detailFinish(M.wall, "concrete", 0.5, 0.00032);
    M.floor.name = "room.floor";
    detailFinish(M.floor, "concrete", 0.5, 0.00013);
    M.ceil.name = "room.ceil";
    detailFinish(M.ceil, "concrete", 0.5, 0.0002);
    M.lampFrame.name = "room.lampFrame";
    detailFinish(M.lampFrame, "satin", 0.12, 2.5e-05);
    M.desk.name = "room.desk";
    detailFinish(M.desk, "metal", 0.12, 4e-05);
    M.trim.name = "room.trim";
    detailFinish(M.trim, "metal", 0.08, 2e-05);
    M.dark.name = "room.dark";
    detailFinish(M.dark, "satin", 0.1, 3.5e-05);
    M.glass.name = "room.glass";
    M.void.name = "room.void";
    M.ghost.name = "room.ghost";

  }

  function put(geo, mat, x, y, z) {
    var o = new THREE.Mesh(geo, mat);
    o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true;
    return o;
  }
  function slab(w, h, d, mat, x, y, z, r) {
    return put(roundedBox(w, h, d, r === undefined ? FILLET : r), mat, x, y, z);
  }

  // ─────────────────────────── 部屋
  function buildRoom() {
    var g = new THREE.Group(), s;

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), M.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    g.add(floor);
    var ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), M.ceil);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = ROOM_H;
    g.add(ceil);

    // 側壁と背後の壁。厚みのある板として立てる
    for (s = -1; s <= 1; s += 2) {
      var w = slab(WALL_T, ROOM_H, ROOM_D, M.wall, s * (HX + WALL_T / 2), ROOM_H / 2, 0, 0.010);
      g.add(w);
    }
    g.add(slab(ROOM_W + WALL_T * 2, ROOM_H, WALL_T, M.wall, 0, ROOM_H / 2, HZ + WALL_T / 2, 0.010));

    // 窓のある壁。開口の四周を板で組む
    var sideW = (ROOM_W - WIN_W) / 2;
    g.add(slab(ROOM_W, WIN_Y0, WALL_T, M.wall, 0, WIN_Y0 / 2, -(HZ + WALL_T / 2), 0.010));
    g.add(slab(ROOM_W, ROOM_H - WIN_Y1, WALL_T, M.wall, 0, (ROOM_H + WIN_Y1) / 2, -(HZ + WALL_T / 2), 0.010));
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(sideW, WIN_H, WALL_T, M.wall,
        s * (WIN_W / 2 + sideW / 2), (WIN_Y0 + WIN_Y1) / 2, -(HZ + WALL_T / 2), 0.010));
    }

    // 目地。壁は一枚板ではない。窓のある壁の割りに合わせて側壁にも通す
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(0.010, 0.008, ROOM_D - 0.02, M.dark, s * (HX - 0.004), WIN_Y0, 0, 0.002));
      g.add(slab(0.010, 0.008, ROOM_D - 0.02, M.dark, s * (HX - 0.004), WIN_Y1, 0, 0.002));
    }
    g.add(slab(ROOM_W - 0.02, 0.008, 0.010, M.dark, 0, WIN_Y0, HZ - 0.004, 0.002));
    g.add(slab(ROOM_W - 0.02, 0.008, 0.010, M.dark, 0, WIN_Y1, HZ - 0.004, 0.002));

    // 竪の目地。壁の割りが縦横で揃う
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(0.010, ROOM_H - 0.02, 0.010, M.dark, s * 1.30, ROOM_H / 2, -(HZ - 0.004), 0.002));
    }

    // 幅木。室の稜を一本締める
    g.add(slab(ROOM_W, 0.070, 0.016, M.dark, 0, 0.035, -HZ + 0.008, 0.003));
    g.add(slab(ROOM_W, 0.070, 0.016, M.dark, 0, 0.035, HZ - 0.008, 0.003));
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(0.016, 0.070, ROOM_D, M.dark, s * (HX - 0.008), 0.035, 0, 0.003));
    }

    // 窓。外は原点の暗さ
    var wy = (WIN_Y0 + WIN_Y1) / 2;
    var voidPlane = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W + 0.4, WIN_H + 0.4), M.void);
    voidPlane.position.set(0, wy, -(HZ + WALL_T + 0.02));
    g.add(voidPlane);

    // 六つの光。遠さの等しくないはずのものが、等しく見える
    var six = [[-0.72, 0.30], [-0.40, -0.16], [-0.06, 0.22], [0.24, -0.28], [0.52, 0.10], [0.78, -0.06]];
    var sixMap = dotTexture();
    for (var k = 0; k < six.length; k++) {
      var d = new THREE.Mesh(new THREE.PlaneGeometry(0.086, 0.086),
        new THREE.MeshBasicMaterial({ map: sixMap, transparent: true, depthWrite: false,
          blending: THREE.AdditiveBlending }));
      d.position.set(six[k][0] * (WIN_W / 2), wy + six[k][1] * (WIN_H / 2), -(HZ + WALL_T + 0.015));
      g.add(d);
    }
    // 地面に相当するもの。平らである
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W + 0.4, 0.0035),
      new THREE.MeshBasicMaterial({ color: 0x1c2830 }));
    ground.position.set(0, wy - WIN_H * 0.34, -(HZ + WALL_T + 0.016));
    g.add(ground);

    // 硝子。室内がうすく映る
    var glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), M.glass);
    glass.position.set(0, wy, -(HZ + 0.028));
    g.add(glass);
    var edge = glassRim(glass.geometry, 0.006, M.glass);
    edge.position.copy(glass.position); edge.userData.h53="window"; g.add(edge);

    // v4: real frame/reveal separation. Keep the outer outline and metal finish.
    // 5 mm proud of the wall; 2 mm inward lap covers each reveal without coplanar faces.
    // Uprights meet the rails at their inner edges; no overlapping front faces at corners.
    var ft = 0.030, lap = 0.002, frameZ = -(HZ + 0.030);
    g.add(slab(WIN_W + ft * 2, ft + lap, 0.070, M.trim, 0, WIN_Y1 + (ft - lap) / 2, frameZ, 0.004));
    g.add(slab(WIN_W + ft * 2, ft + lap, 0.070, M.trim, 0, WIN_Y0 - (ft - lap) / 2, frameZ, 0.004));
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(ft + lap, WIN_H - lap * 2, 0.070, M.trim, s * (WIN_W / 2 + (ft - lap) / 2), wy, frameZ, 0.004));
    }
    g.add(slab(0.020, WIN_H - lap * 2, 0.058, M.trim, 0, wy, -(HZ + 0.030), 0.003));

    // 天井の灯り。器具はこれ一つだけである。
    // 同心の段が中心へ向かって沈み、沈むほど明るくなる（基壇の記号を裏返した形）
    g.add(slab(1.760, 0.022, 1.760, M.lampFrame, 0, ROOM_H - 0.009, 0, 0.008));
    var LAMP = [[0.836, 0.020, 0.62], [0.612, 0.034, 1.05],
                [0.386, 0.048, 1.70], [0.166, 0.062, 2.60]];
    for (var q = 0; q < LAMP.length; q++) {
      var L = LAMP[q];
      var lm = new THREE.MeshStandardMaterial({
        color: 0x191c20, roughness: 1.0, metalness: 0.0,
        emissive: 0xf2dbe9, emissiveIntensity: L[2]
      });
      lm.__g = true;
      var lp = new THREE.Mesh(roundedBox(L[0] * 2, 0.011, L[0] * 2, 0.004, 7.0, 52, 6), lm);
      lp.position.set(0, ROOM_H - L[1], 0);
      g.add(lp);
    }

    // Door leaf, reveal and independent jambs; no second slab over the leaf.
    g.add(slab(0.888, 2.088, 0.028, M.dark, -0.90, 1.050, HZ - 0.020, 0.004));
    for (s=-1;s<=1;s+=2)
      g.add(slab(0.024, 2.140, 0.044, M.desk, -0.90+s*0.464, 1.070, HZ-0.040, 0.003));
    g.add(slab(0.952, 0.024, 0.044, M.desk, -0.90, 2.128, HZ-0.040, 0.003));
    // Pull handle has two mounting posts and a clear grip behind its bar.
    for(var hy=0;hy<2;hy++)
      g.add(slab(0.020,0.020,0.042,M.trim,-0.552,0.920+hy*0.160,HZ-0.052,0.004));
    g.add(slab(0.020,0.196,0.020,M.trim,-0.552,1.000,HZ-0.080,0.006));

    // 囲いは影を落とさない。受けるだけである。
    // 壁と天井が互いへ落とすと、床に説明のつかない帯が出る
    g.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
    return g;
  }

  function dotTexture() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0.00, 'rgba(236,244,252,1)');
    r.addColorStop(0.12, 'rgba(214,232,246,0.85)');
    r.addColorStop(0.42, 'rgba(150,196,226,0.20)');
    r.addColorStop(1.00, 'rgba(120,180,220,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  // ─────────────────────────── 机。一塊として読ませる
  function buildDesk() {
    var g = new THREE.Group(), s;
    var topY = DESK_H - DESK_T / 2;

    g.add(slab(DESK_W, DESK_T, DESK_D, M.desk, 0, topY, DESK_CZ, 0.009));

    // 側板。端から 0.13 内へ寄せる。天板が浮いて見える
    var sx = DESK_W / 2 - 0.130;
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(0.026, DESK_H - DESK_T - 0.008, DESK_D - 0.090, M.desk,
        s * sx, (DESK_H - DESK_T + 0.008) / 2, DESK_CZ, 0.005));
    }
    // 幕板も前面板も置かない。机は天板と脚だけである。隠すものがない
    // 接地。四隅の座金
    for (s = -1; s <= 1; s += 2) {
      g.add(slab(0.032, 0.008, DESK_D - 0.140, M.dark, s * sx, 0.004, DESK_CZ, 0.002));
    }
    // 前縁の削り線は置かない。支えのない棒に見える
    return g;
  }

  // ─────────────────────────── 仮置き。寸法を測るためだけの塊
  function buildGhosts() {
    var g = new THREE.Group();
    function gh(w, h, d, x, y, z) {
      var o = new THREE.LineSegments(
        new THREE.EdgesGeometry(filletBox(w, h, d, Math.min(w,h,d)*0.14)),
        new THREE.LineBasicMaterial({ color: 0x3f8c94, transparent: true, opacity: 0.80 }));
      o.position.set(x, y, z);
      ghost.push(o);
      g.add(o);
      return o;
    }
    // 椅子（背 1.241 / 座 0.487 / 幅 0.572 / 奥 0.638）
    gh(0.572, 0.040, 0.506, 0, 0.487, CHAIR_Z + 0.06);
    var b = gh(0.520, 0.754, 0.030, 0, 0.487 + 0.377, CHAIR_Z - 0.12);
    b.rotation.x = -0.105;
    // 表示板（0.596 × 0.176 × 0.052）
    gh(0.596, 0.176, 0.052, 0, DESK_H + 0.088, BOARD_Z);
    // 決裁端末（ブラウン管 0.372 × 0.344 × 0.384）
    gh(0.372, 0.344, 0.384, TERM_X, DESK_H + 0.190, DESK_CZ - 0.06);
    // メトロノーム（0.104 × 0.208 × 0.062）
    gh(0.104, 0.208, 0.062, METRO_X, DESK_H + 0.104, DESK_CZ + 0.04);
    return g;
  }


    function setEnv(e) { ENV = e; mats(); }
    return { setEnv: setEnv, makeEnv: buildEnv,
      room: buildRoom, desk: buildDesk, tick: null,
      WIN_W: WIN_W, DESK_H: DESK_H, DESK_CZ: DESK_CZ, CHAIR_Z: CHAIR_Z,
      BOARD_Z: BOARD_Z, TERM_X: TERM_X, METRO_X: METRO_X };
  })();

  return { useRenderer: useRenderer, finishScene: finishScene, captureRoom: captureRoom, metro: P_METRO, crt: P_CRT,
           board: P_BOARD, chair: P_CHAIR, room: P_ROOM };
})();

