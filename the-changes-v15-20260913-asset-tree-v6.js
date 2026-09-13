/* asset-tree-v3.js — ASSET 20『乗換 / The Changes』期1 / 部品 C『書庫』
 * 廣瀬書庫 分館六六四五。遠景に立つ巨大な木。
 * v2 は「縦の筋が並ぶ構造体」だった。c3 §3（Ryota の明示）により
 * 参考画像 ref/ref1-tree.jpg の「板根を持つ巨大樹」へ骨格から作り直す。
 * 手法は TREE-METHOD.md（骨格 → 皮 → 板根）。
 * Three.js r128 / 単一 IIFE / ES5 / 外部リクエスト 0
 * 契約 CONTRACT-c2.md §2（曇天・空が主光源）／ CONTRACT-c3.md §3
 */
(function () {
  'use strict';

  var T = window.THREE;

  /* ================================================================ 共有 */
  window.CH = window.CH || {};
  var U = window.CH.U = window.CH.U || {};
  function dflt(k, v) { if (U[k] === undefined) U[k] = v; }
  /* 契約 c2 §2 */
  dflt('SKY_TOP', [0.494, 0.541, 0.518]);
  dflt('SKY_MID', [0.604, 0.639, 0.612]);
  dflt('SKY_LOW', [0.435, 0.478, 0.455]);
  dflt('GROUND', [0.373, 0.353, 0.329]);
  dflt('MOSS', [0.306, 0.361, 0.282]);
  dflt('ROOT', [0.416, 0.380, 0.341]);
  dflt('WALL', [0.725, 0.698, 0.706]);
  dflt('SAP', [0.184, 0.373, 0.353]);
  dflt('FOG_N', 90.0); dflt('FOG_F', 620.0);
  dflt('BEAT', 0.78);
  window.CH.parts = window.CH.parts || {};

  /* ================================================================ 公称 */
  var HH = 660.0;            /* 高さ（地平から 16.7° @ 2200 m） */
  var WW = 858.0;  /* v3 の 1255 は樹冠が横に平たすぎた（高さ比 1.9:1）。参考画像の比に寄せて 1.3:1 へ */           /* 幅（樹冠の張り出し。31° @ 2200 m） */
  var DIST = 2200.0;         /* 公称距離 */
  var AZ = 0.384;            /* 方位 rad（+x から +z へ 22°） */

  var CR = WW * 0.5;         /* 樹冠の最大半径 627.5 */
  var R0 = 96.0;             /* 幹の基部半径（板根の上） */
  var RB = 384.0;            /* 板根の先端半径（地面） */
  var YFORK = 0.652 * HH;    /* 幹の上端＝主枝の分岐（c3「高さの 55〜65%」） */
  var YC = 0.600 * HH;       /* 樹冠の中心高さ */
  var YHH = 264.0;           /* 樹冠の縦半径（頂 = YC + YHH = 660） */
  var LEANX = 11.0, LEANZ = -8.0;   /* 幹の傾ぎ（真直にしない） */

  /* ================================================================ 小道具 */
  var _seed = 1;
  function rnd() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
  function rseed(s) { _seed = ((s % 233280) + 233280) % 233280; }
  function rr(a, b) { return a + (b - a) * rnd(); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function ss01(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  var TAU = 6.283185307179586;
  function angd(a) { a = a % TAU; if (a > Math.PI) a -= TAU; if (a < -Math.PI) a += TAU; return a; }

  /* ベクトル（配列 3） */
  function vlen(a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); }
  function vnorm(a) { var l = vlen(a); if (l < 1e-9) return [0, 1, 0]; return [a[0] / l, a[1] / l, a[2] / l]; }
  function vadd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function vsub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function vmul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function vdot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function vcross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function vrotY(a, t) {
    var c = Math.cos(t), s = Math.sin(t);
    return [a[0] * c + a[2] * s, a[1], -a[0] * s + a[2] * c];
  }
  /* 軸まわりの回転（ロドリゲス）。k は単位 */
  function vrot(v, k, a) {
    var c = Math.cos(a), s = Math.sin(a), d = vdot(k, v) * (1 - c), x = vcross(k, v);
    return [v[0] * c + x[0] * s + k[0] * d, v[1] * c + x[1] * s + k[1] * d, v[2] * c + x[2] * s + k[2] * d];
  }
  /* d に直交する枠 */
  function frameOf(d) {
    var up = (Math.abs(d[1]) < 0.94) ? [0, 1, 0] : [1, 0, 0];
    var e1 = vnorm(vcross(up, d));
    var e2 = vcross(d, e1);
    return [e1, e2];
  }
  /* 親の軸 d から分岐角 ang・回り位置 roll の子の向き */
  function childDir(d, ang, roll) {
    var f = frameOf(d), c = Math.cos(ang), s = Math.sin(ang);
    var cr = Math.cos(roll), sr = Math.sin(roll);
    return vnorm([
      d[0] * c + (f[0][0] * cr + f[1][0] * sr) * s,
      d[1] * c + (f[0][1] * cr + f[1][1] * sr) * s,
      d[2] * c + (f[0][2] * cr + f[1][2] * sr) * s
    ]);
  }

  /* sRGB → 線形（材質・頂点色に渡す値は線形） */
  function s2l(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lin3(a) { return [s2l(a[0]), s2l(a[1]), s2l(a[2])]; }
  function c3(a) { return new T.Color(a[0], a[1], a[2]); }
  function cl3(a) { return new T.Color(s2l(a[0]), s2l(a[1]), s2l(a[2])); }
  function mul3(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function mixc(a, b, k) {
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }

  /* 値ノイズ（LCG・多オクターブ） */
  function valueField(n, oct, seed) {
    var f = new Float32Array(n * n), o, amp = 1.0, tot = 0, i, j, k;
    for (o = 0; o < oct; o++) {
      var g = 4 << o; if (g > n) g = n;
      rseed(seed + o * 7919);
      var lat = new Float32Array(g * g);
      for (k = 0; k < g * g; k++) lat[k] = rnd();
      for (j = 0; j < n; j++) {
        var fy = j * g / n, y0 = Math.floor(fy), ty = fy - y0;
        ty = ty * ty * (3 - 2 * ty);
        var y1 = (y0 + 1) % g; y0 = y0 % g;
        for (i = 0; i < n; i++) {
          var fx = i * g / n, x0 = Math.floor(fx), tx = fx - x0;
          tx = tx * tx * (3 - 2 * tx);
          var x1 = (x0 + 1) % g; x0 = x0 % g;
          var a = lat[y0 * g + x0], b = lat[y0 * g + x1];
          var c = lat[y1 * g + x0], d = lat[y1 * g + x1];
          var lo = a + (b - a) * tx, hi = c + (d - c) * tx;
          f[j * n + i] += amp * (lo + (hi - lo) * ty);
        }
      }
      tot += amp; amp *= 0.5;
    }
    for (k = 0; k < n * n; k++) f[k] /= tot;
    return f;
  }
  function normalTex(n, oct, seed, strength, ay) {
    /* ay > 1 で縦（v 方向）に引き伸ばす＝縦に裂けた樹皮の筋 */
    var f = valueField(n, oct, seed);
    var cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    var cx = cv.getContext('2d'), im = cx.createImageData(n, n), d = im.data, i, j;
    var st = ay || 1.0;
    for (j = 0; j < n; j++) {
      for (i = 0; i < n; i++) {
        var xm = (i - 1 + n) % n, xp = (i + 1) % n, ym = (j - 1 + n) % n, yp = (j + 1) % n;
        var gx = (f[ym * n + xp] + 2 * f[j * n + xp] + f[yp * n + xp])
               - (f[ym * n + xm] + 2 * f[j * n + xm] + f[yp * n + xm]);
        var gy = (f[yp * n + xm] + 2 * f[yp * n + i] + f[yp * n + xp])
               - (f[ym * n + xm] + 2 * f[ym * n + i] + f[ym * n + xp]);
        var k = (j * n + i) * 4;
        d[k] = clamp(Math.round((0.5 + gx * strength * st) * 255), 0, 255);
        d[k + 1] = clamp(Math.round((0.5 + gy * strength / st) * 255), 0, 255);
        d[k + 2] = 255; d[k + 3] = 255;
      }
    }
    cx.putImageData(im, 0, 0);
    var tx = new T.CanvasTexture(cv);
    tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.anisotropy = 4;
    return tx;
  }
  function roughTex(n, oct, seed, base, amp) {
    var f = valueField(n, oct, seed);
    var cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    var cx = cv.getContext('2d'), im = cx.createImageData(n, n), d = im.data, k;
    for (k = 0; k < n * n; k++) {
      var v = clamp(Math.round((base + (f[k] - 0.5) * 2 * amp) * 255), 0, 255);
      d[k * 4] = v; d[k * 4 + 1] = v; d[k * 4 + 2] = v; d[k * 4 + 3] = 255;
    }
    cx.putImageData(im, 0, 0);
    var tx = new T.CanvasTexture(cv);
    tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.anisotropy = 4;
    return tx;
  }

  /* ================================================================ 空と溶け
   * 契約 c2 §2 七「霧の到達色は固定しない。その向きの空へ溶かす」
   * 端点（t=0 → SKY_LOW / t=1 → SKY_TOP）は契約のまま、地平（t=0.42）で
   * SKY_MID を通す三点版に拡張してある（v2 からの継続。逸脱として報告済み）。
   */
  var SKY_FN = [
    'vec3 h53Sky( vec3 d ){',
    '  float t = clamp( d.y * 1.5 + 0.42, 0.0, 1.0 );',
    '  vec3 lo = mix( uH53SkyB, uH53SkyM, clamp( t / 0.42, 0.0, 1.0 ) );',
    '  vec3 hi = mix( uH53SkyM, uH53SkyT, clamp( ( t - 0.42 ) / 0.58, 0.0, 1.0 ) );',
    '  return mix( lo, hi, step( 0.42, t ) );',
    '}'
  ].join('\n');

  /* 共有ユニフォーム（空の材質と全注入で同一の実体を使う） */
  var UNI = {
    uH53SkyT: { value: c3(U.SKY_TOP) },
    uH53SkyM: { value: c3(U.SKY_MID) },
    uH53SkyB: { value: c3(U.SKY_LOW) },
    uH53BaseY: { value: 0.0 },      /* 構造体の基部の世界 y（追従で動く） */
    uH53InvH: { value: 1.0 / HH },
    uH53InvD: { value: 1.0 / DIST },
    uH53Dis: { value: 1.0 },        /* 溶けの総量。検証で 0 にして素の輪郭を測る */
    uH53LocalNight: { value: 0 },
    uH53Sap: { value: 0.028 },      /* 幹が透かす量（台帳⑦ 昼は 0.03 以下） */
    uH53SapC: { value: c3(U.SAP) },
    uH53GN: { value: 260.0 },
    uH53GF: { value: 2600.0 }
  };

  var HEAD_V = [
    'varying vec3 vH53W;',
    'varying vec3 vH53N;'
  ].join('\n');
  var BODY_V = [
    'vec4 h53p = vec4( transformed, 1.0 );',
    'vec3 h53n = objectNormal;',
    '#ifdef USE_INSTANCING',
    '  h53p = instanceMatrix * h53p;',
    '  h53n = mat3( instanceMatrix ) * h53n;',
    '#endif',
    'vH53W = ( modelMatrix * h53p ).xyz;',
    'vH53N = normalize( mat3( modelMatrix ) * h53n );'
  ].join('\n');

  /* 構造体の溶け：下ほど濃く／上端だけ僅かに空へ
   * v2 は上を 100% 溶かして樹冠の輪郭を消した。c3「v2 ほど溶かさない」に従い
   * 濃度を 0.72→0.52 に、上端の追い溶けを 1.00→0.45 に落とす。
   * 併せて「幹はかすかに光を透かす」（第七作 篇07）を SAP のごく淡い縁で置く。 */
  var HAZE_HEAD_F = [
    'uniform vec3 uH53SkyT;',
    'uniform vec3 uH53SkyM;',
    'uniform vec3 uH53SkyB;',
    'uniform vec3 uH53SapC;',
    'uniform float uH53BaseY;',
    'uniform float uH53InvH;',
    'uniform float uH53InvD;',
    'uniform float uH53Dis;',
    'uniform float uH53Sap;',
    'varying vec3 vH53W;',
    'varying vec3 vH53N;',
    SKY_FN
  ].join('\n');
  var HAZE_BODY_F = [
    'vec3 h53d = vH53W - cameraPosition;',
    'float h53z = length( h53d );',
    'vec3 h53v = -h53d / max( h53z, 1e-4 );',
    'float h53t = clamp( ( vH53W.y - uH53BaseY ) * uH53InvH, 0.0, 1.0 );',
    'float h53s = 1.0 - abs( dot( normalize( vH53N ), h53v ) );',
    'gl_FragColor.rgb += uH53SapC * ( uH53Sap * pow( h53s, 2.2 ) * ( 0.55 + 0.75 * h53t ) );',
    'float h53p = mix( 0.42, 0.28, clamp( h53t / 0.90, 0.0, 1.0 ) );',
    'float h53a = h53p * clamp( h53z * uH53InvD, 0.0, 1.0 );',
    'float h53u = smoothstep( 0.88, 1.00, h53t ) * 0.45;',
    'float h53f = 1.0 - ( 1.0 - h53a ) * ( 1.0 - h53u );',
    'h53f = clamp( h53f * uH53Dis, 0.0, 1.0 );',
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, h53Sky( h53d / max( h53z, 1e-4 ) ), h53f );'
  ].join('\n');

  /* 地面の溶け：距離だけ（検討ページ用） */
  var GFOG_HEAD_F = [
    'uniform vec3 uH53SkyT;',
    'uniform vec3 uH53SkyM;',
    'uniform vec3 uH53SkyB;',
    'uniform float uH53GN;',
    'uniform float uH53GF;',
    'varying vec3 vH53W;',
    SKY_FN
  ].join('\n');
  var GFOG_BODY_F = [
    'vec3 h53d = vH53W - cameraPosition;',
    'float h53z = length( h53d );',
    'float h53f = smoothstep( uH53GN, uH53GF, h53z );',
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, h53Sky( h53d / max( h53z, 1e-4 ) ), h53f );'
  ].join('\n');

  /* 面（発光板）：インスタンス色を発光にも掛ける */
  var EMI_BODY = [
    '#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )',
    '  totalEmissiveRadiance *= vColor;',
    '#endif'
  ].join('\n');

  function injectHaze(mat, key, emiInstance) {
    mat.fog = false;
    mat.onBeforeCompile = function (sh) {
      var k;
      for (k in UNI) { if (UNI.hasOwnProperty(k)) sh.uniforms[k] = UNI[k]; }
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + HEAD_V)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + BODY_V);
      var fs = sh.fragmentShader
        .replace('#include <common>', '#include <common>\n' + HAZE_HEAD_F)
        .replace('#include <encodings_fragment>', '#include <encodings_fragment>\n{\n' + HAZE_BODY_F + '\n}');
      if (emiInstance) {
        fs = fs.replace('#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n' + EMI_BODY);
      }
      if(key==='h53lib'){fs=fs.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nvec3 bp=vBarkPosition;float broad=cos(bp.x*.105+bp.z*.084+sin(bp.y*.019));float fine=cos(bp.x*.43+bp.z*.31+.8*sin(bp.y*.026));vec3 dg=vec3(.18*broad+.035*fine,.004*sin(bp.y*.019),.14*broad+.026*fine);vec3 vg=mat3(viewMatrix)*dg;normal=normalize(normal-vg+normal*dot(vg,normal));');sh.vertexShader='attribute float h53Spill;varying float vLocalSpill;varying vec3 vBarkPosition;\n'+sh.vertexShader;sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLocalSpill=h53Spill;vBarkPosition=transformed;');fs='varying float vLocalSpill;varying vec3 vBarkPosition;uniform float uH53LocalNight;\n'+fs;fs=fs.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(.29,.56,.46)*vLocalSpill*uH53LocalNight*2.8;');}
      sh.fragmentShader = fs;
    };
    mat.customProgramCacheKey = function () { return key; };
    return mat;
  }
  function injectGFog(mat, key) {
    mat.fog = false;
    mat.onBeforeCompile = function (sh) {
      var k;
      for (k in UNI) { if (UNI.hasOwnProperty(k)) sh.uniforms[k] = UNI[k]; }
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + HEAD_V)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + BODY_V);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\n' + GFOG_HEAD_F)
        .replace('#include <encodings_fragment>', '#include <encodings_fragment>\n{\n' + GFOG_BODY_F + '\n}');
    };
    mat.customProgramCacheKey = function () { return key; };
    return mat;
  }

  /* ================================================================ 幾何の道具 */
  function GB() { return { p: [], n: [], u: [], c: [], i: [] }; }
  function finish(g) {
    var geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(g.p, 3));
    geo.setAttribute('normal', new T.Float32BufferAttribute(g.n, 3));
    geo.setAttribute('uv', new T.Float32BufferAttribute(g.u, 2));
    geo.setAttribute('color', new T.Float32BufferAttribute(g.c, 3));
    geo.setIndex(g.i);
    (function(g){
    /* Orient every triangle after Float32 quantisation, including tiny caps. */
    var pp=g.attributes.position, nn=g.attributes.normal, ix=g.index, ii, aa, bb, cc, ux,uy,uz,vx,vy,vz,nx,ny,nz,dd;
    for(ii=0;ii<ix.count;ii+=3){aa=ix.getX(ii);bb=ix.getX(ii+1);cc=ix.getX(ii+2);
      ux=pp.getX(bb)-pp.getX(aa);uy=pp.getY(bb)-pp.getY(aa);uz=pp.getZ(bb)-pp.getZ(aa);
      vx=pp.getX(cc)-pp.getX(aa);vy=pp.getY(cc)-pp.getY(aa);vz=pp.getZ(cc)-pp.getZ(aa);
      nx=uy*vz-uz*vy;ny=uz*vx-ux*vz;nz=ux*vy-uy*vx;
      dd=nx*(nn.getX(aa)+nn.getX(bb)+nn.getX(cc))+ny*(nn.getY(aa)+nn.getY(bb)+nn.getY(cc))+nz*(nn.getZ(aa)+nn.getZ(bb)+nn.getZ(cc));
      if(dd<0){ix.setX(ii+1,cc);ix.setX(ii+2,bb);}
    }
})(geo);
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    geo.computeBoundingBox();
    return geo;
  }

  /* 掃引：格子の点を作り、法線は隣接差分から出す（尾根の変調も正しく拾う）
   *   pts[i][k] = [x,y,z] ／ cen[i] = その断面の中心（外向き判定に使う）
   *   uv は m 単位 / tile
   */
  function sweepGrid(g, pts, cen, closed, tile, colFn) {
    var NS = pts.length, K = pts[0].length, i, k;
    var NK = closed ? K + 1 : K;
    var base = g.p.length / 3;
    var vs = [0], acc = 0;
    for (i = 1; i < NS; i++) {
      var a = pts[i][0], b = pts[i - 1][0];
      acc += Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]));
      vs.push(acc);
    }
    function P(i2, k2) { return pts[i2][k2 % K]; }
    for (i = 0; i < NS; i++) {
      var us = [0], au = 0;
      for (k = 1; k < NK; k++) {
        var q = P(i, k), r = P(i, k - 1);
        au += Math.sqrt((q[0] - r[0]) * (q[0] - r[0]) + (q[1] - r[1]) * (q[1] - r[1]) + (q[2] - r[2]) * (q[2] - r[2]));
        us.push(au);
      }
      for (k = 0; k < NK; k++) {
        var p = P(i, k);
        var kA, kB;
        if (closed) { kA = (k - 1 + K) % K; kB = (k + 1) % K; }
        else { kA = k > 0 ? k - 1 : k; kB = k < K - 1 ? k + 1 : k; }
        var a1 = pts[i][kA], b1 = pts[i][kB];
        var du = [b1[0] - a1[0], b1[1] - a1[1], b1[2] - a1[2]];
        var iA = i > 0 ? i - 1 : i, iB = i < NS - 1 ? i + 1 : i;
        var a2 = P(iA, k), b2 = P(iB, k);
        var dv = [b2[0] - a2[0], b2[1] - a2[1], b2[2] - a2[2]];
        var nx = dv[1] * du[2] - dv[2] * du[1];
        var ny = dv[2] * du[0] - dv[0] * du[2];
        var nz = dv[0] * du[1] - dv[1] * du[0];
        var L = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (L < 1e-9) { nx = 0; ny = 1; nz = 0; L = 1; }
        nx /= L; ny /= L; nz /= L;
        var cx = cen[i], ox = p[0] - cx[0], oy = p[1] - cx[1], oz = p[2] - cx[2];
        if (nx * ox + ny * oy + nz * oz < 0) { nx = -nx; ny = -ny; nz = -nz; }
        var col = colFn(i, k % K, p);
        g.p.push(p[0], p[1], p[2]);
        g.n.push(nx, ny, nz);
        g.u.push(us[k] / tile, vs[i] / tile);
        g.c.push(col[0], col[1], col[2]);
      }
    }
    var lim = closed ? K : K - 1;
    for (i = 0; i < NS - 1; i++) {
      for (k = 0; k < lim; k++) {
        var i0 = base + i * NK + k, i1 = base + i * NK + k + 1;
        var i2 = base + (i + 1) * NK + k + 1, i3 = base + (i + 1) * NK + k;
        /* 巻き方向を法線に合わせる（台帳③） */
        var A = pts[i][k % K], B = pts[i][(k + 1) % K], C = pts[i + 1][k % K];
        var e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
        var e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
        var gx = e1[1] * e2[2] - e1[2] * e2[1];
        var gy = e1[2] * e2[0] - e1[0] * e2[2];
        var gz = e1[0] * e2[1] - e1[1] * e2[0];
        var vn = base + i * NK + k;
        var nn = [g.n[vn * 3], g.n[vn * 3 + 1], g.n[vn * 3 + 2]];
        if (gx * nn[0] + gy * nn[1] + gz * nn[2] < 0) {
          g.i.push(i0, i3, i2, i0, i2, i1);
        } else {
          g.i.push(i0, i1, i2, i0, i2, i3);
        }
      }
    }
  }

  /* ================================================================ 幹の軸
   * 真直にしない。傾ぎは小さい（430 m で 11 m）が輪郭の生気になる */
  function axisAt(y) {
    var u = clamp(y / HH, 0, 1);
    return [
      LEANX * (Math.sin(2.05 * u + 0.25) - Math.sin(0.25)),
      y,
      LEANZ * (Math.sin(1.55 * u + 0.90) - Math.sin(0.90))
    ];
  }

  /* ================================================================ 板根の割り
   * TREE-METHOD §3「黄金角ではなく、幹の断面の稜に合わせて配る（不等間隔）」
   * この方位はそのまま幹の縦の溝（フルート）の稜になる。 */
  var NB = 9;
  var PHI = [], BUT = [];
  function layoutButtress() {
    rseed(66451);
    PHI = []; BUT = [];
    var i, gaps = [], sum = 0;
    for (i = 0; i < NB; i++) { gaps.push(0.60 + rnd()); sum += gaps[i]; }
    var a = rnd() * TAU;
    for (i = 0; i < NB; i++) { PHI.push(a); a += gaps[i] / sum * TAU; }
    for (i = 0; i < NB; i++) {
      BUT.push({
        phi: PHI[i],
        H: rr(0.175, 0.345) * HH,      /* 幹に取り付く高さ＝画の下三分の一 */
        R: rr(0.52, 1.14) * RB,        /* 地面に届く先端の半径（揃えない） */
        p: rr(1.30, 1.76),             /* 上縁の落ち方（TREE-METHOD §3 べき 1.3〜1.8）*/
        wa: rr(0.070, 0.180) * (rnd() < 0.5 ? -1 : 1),   /* 側面の緩い S 字 */
        wph: rnd() * TAU,
        hw0: rr(0.105, 0.170),         /* 接地での角半幅（広く厚い） */
        hw1: rr(0.042, 0.070),         /* 上端での角半幅（薄い刃） */
        sp: rr(0.70, 0.94),            /* 上縁の曲がり */
        rl: rr(0.07, 0.16)             /* 地表を這う根の長さ比 */
      });
    }
    /* 副稜：主稜のあいだに小さいものを挟む。等間隔に見せないため */
    for (i = 0; i < 7; i++) {
      BUT.push({
        phi: rnd() * TAU,
        H: rr(0.055, 0.165) * HH,
        R: rr(0.30, 0.62) * RB,
        p: rr(1.25, 1.70),
        wa: rr(0.04, 0.12) * (rnd() < 0.5 ? -1 : 1),
        wph: rnd() * TAU,
        hw0: rr(0.085, 0.150),
        hw1: rr(0.040, 0.070),
        sp: rr(0.72, 0.96),
        rl: 0.0
      });
    }
  }

  /* ================================================================ 幹の断面
   * 板根の稜がそのまま上へ続いて縦の溝になる。稜の高さは上へ行くほど消える。 */
  var TW = 0.10;                        /* 幹全体の緩いねじれ rad */
  var SIG = 0.175;                      /* 稜の角幅（NB に合わせる） */
  var RMEAN = 0;
  function ridgeSum(th, y) {
    var s = 0, i, d, tw = TW * (y / HH);
    for (i = 0; i < NB; i++) {
      d = angd(th - (PHI[i] + tw));
      s += Math.exp(-(d * d) / (2 * SIG * SIG));
    }
    return s;
  }
  function fluteA(y) {
    var t = clamp(y / HH, 0, 1);
    return 0.55 * Math.exp(-t / 0.30) + 0.22 * (1 - ss01(0.24, 0.70, t));
  }
  /* 板根の張り出し（高さ y・方位 th における半径の増分）。
   * 幹の断面そのものを星形にする。別の板を貼らないので継ぎ目が生じない。
   * 稜のあいだは緩い凹面の水掻きになり、上へ行くほど溝が深くなる。 */
  function butR(th, y) {
    var best = 0, i, B, q, u, ext, hw, d, ph, v;
    for (i = 0; i < BUT.length; i++) {
      B = BUT[i];
      if (y >= B.H) continue;
      q = y / B.H;
      u = 1 - Math.pow(q, 1 / B.p);                 /* 上縁の曲線を逆に解く */
      ext = (B.R - R0) * Math.pow(u, B.sp);
      if (ext <= 0) continue;
      hw = B.hw1 + (B.hw0 - B.hw1) * Math.pow(1 - q, 0.80);
      ph = B.phi + TW * (y / HH) + B.wa * (Math.sin(2.4 * u + B.wph) - Math.sin(B.wph));
      d = angd(th - ph) / hw;
      v = ext * Math.exp(-0.5 * d * d);
      if (v > best) best = v;                        /* 合算せず最大を採る */
    }
    return best;
  }

  function trunkR(y) {
    var u = clamp(y / YFORK, 0, 1);
    var r = R0 * (1 - 0.37 * Math.pow(u, 1.15));
    /* 肩：分岐の直下で細り、中央の主枝が穴を塞ぐ */
    return r * (1 - 0.52 * ss01(0.90, 1.0, u));
  }
  /* 主枝の取り付き（襟＝branch collar。刺さって見せないための膨らみ） */
  var COLLAR = [];
  function trunkSurf(th, y) {
    var r = trunkR(y) * (1 + fluteA(y) * (ridgeSum(th, y) - RMEAN)) + butR(th, y);
    var i, c, dy, da;
    for (i = 0; i < COLLAR.length; i++) {
      c = COLLAR[i];
      dy = (y - c.y) / (1.7 * c.r);
      if (dy < -2.6 || dy > 2.6) continue;
      da = angd(th - c.az) / 0.62;
      r += 0.55 * c.r * Math.exp(-dy * dy) * Math.exp(-da * da);
    }
    return Math.max(r, 0.42 * trunkR(y));
  }
  function calcRMean() {
    var s = 0, i, n = 720;
    for (i = 0; i < n; i++) s += ridgeSum(i / n * TAU, 0);
    RMEAN = s / n;
  }

  /* ================================================================ 樹冠の包絡
   * TREE-METHOD §1「枝端が入る包絡形を決め、はみ出す枝は切る」
   * 円錐・楕円にしないため、方位で不規則に波打たせる（振幅 ±7%）。 */
  var WOBA = [];
  function layoutEnv() {
    rseed(4471);
    WOBA = [rnd() * TAU, rnd() * TAU, rnd() * TAU, rnd() * TAU];
  }
  function envWob(az) {
    var w = 1.0
      + 0.055 * Math.sin(2 * az + WOBA[0])
      + 0.040 * Math.sin(3 * az + WOBA[1])
      + 0.028 * Math.sin(5 * az + WOBA[2]);
    return w / 1.123;                 /* 最大 1.0 ／ 最小 ≈ 0.78 */
  }
  function outside(p, left) {
    var r = Math.sqrt(p[0] * p[0] + p[2] * p[2]);
    if (p[1] < 0.53 * HH) return true;                    /* 垂れ過ぎを切る */
    /* 幹へ戻る枝を切る。ただし幹から出るまで（left）は適用しない */
    if (left && p[1] < YFORK && r < R0 * 1.24) return true;
    var az = Math.atan2(p[2], p[0]);
    var Rm = CR * 1.14 * envWob(az);   /* 包絡は bbox より大きく取り、正規化を 1 に近づける */
    var yc = YC + 40.0 * Math.sin(3 * az + WOBA[3]);
    var yh = HH - yc;                                     /* 頂は方位に依らず 660 */
    var a = r / Rm, b = (p[1] - yc) / yh;
    return (a * a + Math.pow(Math.abs(b), 2.6) > 1.0);
  }

  /* ================================================================ 骨格
   * TREE-METHOD §1。各セグメントは折れ線の中心線を持ち、
   * 節で「継ぐ子（分岐角 8〜18°）＋横へ開く子（35〜65°）」に分かれる。
   * 回り位置は黄金角 137.5° ずつ。 */
  var SEG = [];
  var NSEG = [0, 16, 12, 8, 6];
  var KSEC = [0, 16, 12, 8, 6];
  var TAPR = [0, 0.80, 0.82, 0.84, 0.87];
  var MAXGEN = 4, RMIN = 2.8;
  var GOLD = 2.399963229728653;

  function growSeg(p0, d0, rs, len, gen, roll, left) {
    var droop = (gen === 1) ? rr(0.34, 0.66) : rr(0.34, 0.78);
    var rise = rr(0.26, 0.52);
    var twist = rr(-0.85, 0.85);
    var wob = 0.018 + 0.012 * gen;
    var swA = rr(0.55, 1.35), swF = rr(0.75, 1.75), swP = rnd() * TAU;
    var swAx = childDir(vnorm(d0), 1.5707963, rnd() * TAU);   /* 軸に直交する回転軸 */
    var NS = NSEG[gen], ds = len / NS, i, s;
    var d = vnorm(d0), pts = [p0.slice(0)], p = p0.slice(0), cut = false;
    for (i = 1; i <= NS; i++) {
      s = i / NS;
      d[1] -= droop / NS;                                  /* 重力屈性 */
      if (s > 0.75) d[1] += rise / NS / 0.25;              /* 光屈性：先端 25% */
      d = vrotY(d, twist / NS);                            /* ねじれ */
      d = vrot(d, swAx, swA * Math.sin(swF * TAU * s + swP) / NS * 3.4);   /* 長波長の S 字 */
      d[0] += (rnd() - 0.5) * wob; d[1] += (rnd() - 0.5) * wob; d[2] += (rnd() - 0.5) * wob;
      d = vnorm(d);
      p = [p[0] + d[0] * ds, p[1] + d[1] * ds, p[2] + d[2] * ds];
      if (!left && Math.sqrt(p[0] * p[0] + p[2] * p[2]) > R0 * 1.42) left = true;
      if (outside(p, left)) { cut = true; break; }
      pts.push(p);
    }
    if (pts.length < 3) return;
    var frac = (pts.length - 1) / NS;
    var re = cut ? rs * (0.32 + 0.52 * frac) : rs * TAPR[gen];
    var sg = { pts: pts, r0: rs, r1: re, gen: gen, dir: d, len: len * frac };
    SEG.push(sg);
    if (cut || gen >= MAXGEN || re < RMIN) { sg.tip = true; return; }

    var nk = (gen <= 2) ? 3 : (rnd() < 0.42 ? 3 : 2);
    var sh = [], sc = (gen <= 1) ? rr(0.56, 0.66) : rr(0.60, 0.70), j, tot = sc;
    sh.push(sc);
    for (j = 1; j < nk; j++) { var v = (1 - sc) / (nk - 1) * rr(0.80, 1.20); sh.push(v); tot += v; }
    for (j = 0; j < nk; j++) sh[j] /= tot;
    var end = pts[pts.length - 1], childStart = SEG.length;
    for (j = 0; j < nk; j++) {
      roll += GOLD;
      var ang = (j === 0) ? rr(0.14, 0.31) : rr(0.61, 1.13);
      var cd = childDir(d, ang, roll);
      var cr = re * Math.pow(sh[j], 1 / 2.2);
      if (cr < RMIN * 0.72) continue;
      var cl = len * ((gen >= 2) ? rr(0.48, 0.64) : rr(0.62, 0.78)) * (j === 0 ? 1.0 : 0.90);
      /* 子の始点は親の表面より内側（親半径の 0.6 倍） */
      var st = [end[0] - cd[0] * 0.28 * re, end[1] - cd[1] * 0.28 * re, end[2] - cd[2] * 0.28 * re];
      growSeg(st, cd, cr, cl, gen + 1, roll + rr(-0.45, 0.45), left);
    }
    if(SEG.length===childStart) sg.tip=true;
  }

  /* 主枝の出発（c3「高さの 55〜65% で太い枝が数本に」＋
     TREE-METHOD「主枝 4〜7 本。幹の上 55〜85% から出る」） */
  var MAIN = [
    { y: 0.548, r: 27.0, el: 0.20, len: 302 },
    { y: 0.572, r: 25.0, el: 0.52, len: 286 },
    { y: 0.592, r: 28.5, el: 0.30, len: 296 },
    { y: 0.610, r: 23.5, el: 0.86, len: 250 },
    { y: 0.626, r: 27.0, el: 0.46, len: 288 },
    { y: 0.640, r: 22.5, el: 1.02, len: 232 },
    { y: 0.652, r: 30.0, el: 1.22, len: 214 },   /* 幹を継ぐ子（軸に近い） */
    { y: 0.652, r: 26.0, el: 0.66, len: 268 },
    { y: 0.652, r: 24.0, el: 0.38, len: 292 }
  ];

  function buildSkeleton() {
    rseed(66453);
    SEG = []; COLLAR = [];
    var i, roll = rnd() * TAU, m, y, az, ax, dir, st;
    for (i = 0; i < MAIN.length; i++) {
      m = MAIN[i];
      y = m.y * HH;
      roll += GOLD;
      az = roll % TAU;
      ax = axisAt(y);
      /* 出発の向き＝外向き＋仰角。幹の表面より内側から出す（襟で隠す） */
      dir = vnorm([Math.cos(az) * Math.cos(m.el), Math.sin(m.el), Math.sin(az) * Math.cos(m.el)]);
      var rin = trunkR(y) * 0.55;
      st = [ax[0] + Math.cos(az) * rin, y, ax[2] + Math.sin(az) * rin];
      COLLAR.push({ y: y, az: az, r: m.r });
      growSeg(st, dir, m.r, m.len, 1, roll + rr(-0.5, 0.5), false);
    }
    fillReach();
  }

  /* 方位 az 方向の到達距離（骨格の点で測る） */
  function reachAt(az) {
    var cx = Math.cos(az), cz = Math.sin(az), mx = 0, i, k, pts, v;
    for (i = 0; i < SEG.length; i++) {
      pts = SEG[i].pts;
      for (k = 0; k < pts.length; k++) {
        v = pts[k][0] * cx + pts[k][2] * cz;
        if (v > mx) mx = v;
      }
    }
    return mx;
  }
  /* 届いていない方位へ主枝を足す。bbox の四方を CR まで満たすため。
     十三本のうち四本が軸方向を向くだけなので、規則としては見えない。 */
  function fillReach() {
    var dirs = [], q0, pass, q, roll = rnd() * TAU;
    for (q0 = 0; q0 < 8; q0++) dirs.push(q0 * Math.PI * 0.25);
    for (pass = 0; pass < 1; pass++) {
      for (q = 0; q < 8; q++) {
        if (reachAt(dirs[q]) >= CR * 0.995) continue;
        var az = dirs[q] + rr(-0.20, 0.20);
        var y = rr(0.552, 0.650) * HH;
        var el = rr(0.16, 0.42);
        var ax = axisAt(y), rin = trunkR(y) * 0.55;
        var dir = vnorm([Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)]);
        var st = [ax[0] + Math.cos(az) * rin, y, ax[2] + Math.sin(az) * rin];
        var rr0 = rr(21.0, 26.0);
        COLLAR.push({ y: y, az: az, r: rr0 });
        roll += GOLD;
        growSeg(st, dir, rr0, rr(288, 320), 1, roll, false);
      }
    }
  }

  /* ================================================================ 色 */
  var C_BARK = lin3([0.416, 0.380, 0.341]);   /* 淡白色に寄った灰褐 */
  var C_RIDG = lin3([0.545, 0.503, 0.458]);   /* 稜（空を受ける） */
  var C_GRV = lin3([0.190, 0.177, 0.159]);    /* 溝（陰） */
  var C_FOOT = lin3([0.132, 0.122, 0.109]);   /* 接地の陰（板根の裾） */
  var C_BRA = lin3([0.407, 0.367, 0.329]);    /* 枝 */
  var C_TIP = lin3([0.365, 0.340, 0.315]);    /* 小枝 */
  var C_TOP = lin3([0.495, 0.457, 0.415]);    /* 板根の上縁 */

  /* ================================================================ 皮を被せる
   * TREE-METHOD §2。平行移動フレーム（parallel transport）で断面リングを掃く。
   * Frenet 枠は曲率 0 の区間でねじれるので使わない。 */
  function ptFrames(pts) {
    var n = pts.length, i, tan = [], F = [];
    for (i = 0; i < n; i++) {
      var a = pts[i > 0 ? i - 1 : i], b = pts[i < n - 1 ? i + 1 : i];
      tan.push(vnorm(vsub(b, a)));
    }
    var f0 = frameOf(tan[0]);
    var u = f0[0], v = f0[1];
    F.push([u, v, tan[0]]);
    for (i = 1; i < n; i++) {
      var t0 = tan[i - 1], t1 = tan[i];
      var ax = vcross(t0, t1), s = vlen(ax);
      if (s > 1e-7) {
        var ang = Math.atan2(s, clamp(vdot(t0, t1), -1, 1));
        ax = vmul(ax, 1 / s);
        u = vnorm(vrot(u, ax, ang));
      }
      v = vnorm(vcross(t1, u));
      u = vnorm(vcross(v, t1));
      F.push([u, v, t1]);
    }
    return F;
  }

  /* 枝の管。断面は真円にしない（多角形の揺れ＋長手のねじれ） */
  function tubeGeo(g, sg, K, colFn) {
    var pts = sg.pts, n = pts.length, F = ptFrames(pts), i, k;
    var P = [], C = [];
    var tw = (rnd() - 0.5) * 2.2, w1 = rr(0.030, 0.055), w2 = rr(0.018, 0.036);
    var p1 = rnd() * TAU, p2 = rnd() * TAU, lob = 3 + Math.floor(rnd() * 3);
    var k1 = rr(0.015, 0.040), k2 = rr(0.012, 0.028);
    var kf1 = rr(2.2, 4.4), kf2 = rr(5.0, 8.5), kp1 = rnd() * TAU, kp2 = rnd() * TAU;
    for (i = 0; i < n; i++) {
      var s = i / (n - 1);
      var r = sg.r0 + (sg.r1 - sg.r0) * s;
      if (sg.tip) r *= (1 - 0.995 * ss01(.62,1,s));     /* 先端は尖って閉じる（管の口を開けない） */
      r *= 1 + 0.50 * Math.exp(-s / 0.14);                 /* 襟：付け根の膨らみ */
      r *= 1 + k1 * Math.sin(kf1 * s * TAU + kp1) + k2 * Math.sin(kf2 * s * TAU + kp2);  /* 節 */
      var ring = [], c = pts[i], f = F[i];
      for (k = 0; k < K; k++) {
        var th = k / K * TAU + tw * s;
        var rr2 = r * (1 + w1 * Math.sin(lob * th + p1) + w2 * Math.sin((lob + 2) * th + p2) + .010*Math.sin(11*th+2.5*s));
        ring.push([
          c[0] + (f[0][0] * Math.cos(th) + f[1][0] * Math.sin(th)) * rr2,
          c[1] + (f[0][1] * Math.cos(th) + f[1][1] * Math.sin(th)) * rr2,
          c[2] + (f[0][2] * Math.cos(th) + f[1][2] * Math.sin(th)) * rr2
        ]);
      }
      P.push(ring); C.push(c);
    }
    sg.skin = P;
    sweepGrid(g, P, C, true, 11.0, colFn);
  }

  function geoBranches(g) {
    rseed(7717);
    var i, sg;
    for (i = 0; i < SEG.length; i++) {
      sg = SEG[i];
      (function (s2) {
        var base = (s2.gen <= 2) ? C_BRA : mixc(C_BRA, C_TIP, (s2.gen - 2) / 2);
        tubeGeo(g, s2, KSEC[s2.gen], function (ii, kk, p) {
          /* 上面は空を受けて明るく、下面は暗い（曇天の唯一の陰影） */
          var up = 0.5 + 0.5 * Math.sin(kk / KSEC[s2.gen] * TAU);
          return mixc(mixc(base, C_GRV, 0.42), C_RIDG, up * 0.42);
        });
      })(sg);
    }
  }

  /* ================================================================ 幹
   * 板根の稜がそのまま縦の溝になる。断面は真円にしない。 */
  function geoTrunk(g) {
    rseed(3313);
    var K = 120, NS = 56, i, k;
    var P = [], C = [];
    for (i = 0; i <= NS; i++) {
      var s = i / NS;
      var y = YFORK * Math.pow(s, 1.62);          /* 板根の帯を密に刻む */
      var c = axisAt(y), ring = [];
      for (k = 0; k < K; k++) {
        var th = k / K * TAU;
        var r = trunkSurf(th, y); r *= 1 + .011*Math.sin(31*th+.9*y/HH)+.006*Math.sin(53*th+2.1*y/HH);
        ring.push([c[0] + Math.cos(th) * r, y, c[2] + Math.sin(th) * r]);
      }
      P.push(ring); C.push(c);
    }
    /* 頂の蓋（中央の主枝が塞ぐが、上から抜けて見えないように） */
    var cTop = axisAt(YFORK * 1.012), capR = trunkR(YFORK) * 0.30, cap = [];
    for (k = 0; k < K; k++) {
      var th2 = k / K * TAU;
      cap.push([cTop[0] + Math.cos(th2) * capR, cTop[1], cTop[2] + Math.sin(th2) * capR]);
    }
    P.push(cap); C.push(cTop);

    sweepGrid(g, P, C, true, 13.0, function (ii, kk, p) {
      var y = p[1], ax = axisAt(y);
      var th = Math.atan2(p[2] - ax[2], p[0] - ax[0]);
      /* 稜か溝か：フルートと板根の張り出しの両方から測る */
      var rg = clamp((ridgeSum(th, y) - RMEAN) / 0.40 + 0.5, 0, 1);
      var bx = butR(th, y), bmax = 0, q;
      for (q = 0; q < BUT.length; q++) { if (BUT[q].R - R0 > bmax) bmax = BUT[q].R - R0; }
      var bf = bmax > 0 ? clamp(bx / (bmax * 0.55), 0, 1) : 0;
      var rid = clamp(rg * rg * (3 - 2 * rg) * 0.55 + bf * 0.65, 0, 1);
      var col = mixc(C_GRV, C_RIDG, rid);
      col = mixc(col, C_BARK, 0.24);
      /* 空の遮り：板根に囲まれた根元は空を見ない。溝ほど暗い */
      var ao = 0.24 + 0.76 * ss01(0.015 * HH, 0.40 * HH, y);
      ao = ao + (1 - ao) * bf * 0.55;              /* 稜は下でも空を受ける */
      col = mixc(C_FOOT, col, ao);
      return col;
    });
  }

  /* ================================================================ 地表の根
   * 板根そのものは幹の断面に織り込んだ（butR）。ここは板根の先から
   * 地表へ這い出して土へ潜る根。接地を作り、裾を地面へ溶かす。
   * 原文「根が編まれて、歩幅の高さに固まっている」（第七作 篇07）。 */
  function geoRoots(g) {
    rseed(1481);
    var b, i, j, NS = 11, K = 7;
    for (b = 0; b < NB; b++) {
      var B = BUT[b], nr = (rnd() < 0.55) ? 2 : 1;
      for (j = 0; j < nr; j++) {
        var az = B.phi + rr(-0.16, 0.16);
        var L = B.R * B.rl * rr(0.80, 1.25);
        var r0 = rr(8.0, 14.0), wan = rr(-0.20, 0.20), wp = rnd() * TAU;
        var pts = [], cen = [], ii;
        for (ii = 0; ii < NS; ii++) {
          var t = ii / (NS - 1);
          var rad = B.R * 0.86 + L * t;
          var a2 = az + wan * Math.sin(2.2 * t + wp);
          /* 地表に沿って伏せる。先へ行くほど細く低く、土へ潜る */
          var yc = 9.0 * (1 - t) + 3.0 - 5.0 * t * t;
          var rr2 = r0 * (1 - 0.72 * Math.pow(t, 0.72));
          var cx = Math.cos(a2) * rad, cz = Math.sin(a2) * rad;
          cen.push([cx, yc, cz]);
          var ring = [], k2;
          for (k2 = 0; k2 < K; k2++) {
            var th = k2 / K * TAU;
            var rw = rr2 * (1 + 0.10 * Math.sin(3 * th + wp));
            ring.push([cx - Math.sin(a2) * Math.cos(th) * rw, yc + Math.sin(th) * rw * 0.94,
                       cz + Math.cos(a2) * Math.cos(th) * rw]);
          }
          pts.push(ring);
        }
        sweepGrid(g, pts, cen, true, 9.0, function (ii2, kk2, p2) {
          var up = 0.5 + 0.5 * Math.sin(kk2 / K * TAU);
          var col = mixc(C_GRV, C_BARK, 0.30 + 0.70 * up);
          return mixc(C_FOOT, col, 0.42 + 0.58 * ss01(-1.0, 9.0, p2[1]));
        });
      }
    }
  }

  /* ================================================================ 面
   * h!ro53 の識別子。縦長の面が幹の溝と枝の上に等間隔で並ぶ。
   * 昼はごく淡い青緑、setNight(1) で点る（書 篇03）。 */
  function panelList() {
    rseed(9091);
    var L = [], i, k, y, th;
    /* 一 幹の溝（板根の上から分岐まで、等間隔） */
    var y0 = 0.135 * HH, y1 = YFORK - 14.0, dy = 19.5;
    for (y = y0; y <= y1; y += dy) {
      for (k = 0; k < NB; k++) {
        th = (PHI[k] + PHI[(k + 1) % NB] + (k === NB - 1 ? TAU : 0)) * 0.5 + TW * (y / HH);
        var ax = axisAt(y), r = trunkSurf(th, y) + 1.6;
        L.push({
          x: ax[0] + Math.cos(th) * r, y: y, z: ax[2] + Math.sin(th) * r,
          nx: Math.cos(th), ny: 0, nz: Math.sin(th),
          ux: 0, uy: 1, uz: 0,
          w: 3.4, h: 14.5, g: rr(0.78, 1.16)
        });
      }
    }
    /* 二 枝の上（等間隔。法線は枝に直交する水平方向＝正面から面として見える） */
    var UP = [0, 1, 0];
    for (i = 0; i < SEG.length; i++) {
      var sg = SEG[i];
      if (sg.gen > 3) continue;
      var pts = sg.pts, n = pts.length, acc = 0, gap = 21.0 + 4.0 * sg.gen;
      for (k = 1; k < n; k++) {
        var seg = vsub(pts[k], pts[k - 1]), sl = vlen(seg);
        acc += sl;
        if (acc < gap) continue;
        acc = 0;
        var t = vnorm(seg);
        var nrm = vcross(t, UP);
        if (vlen(nrm) < 0.12) nrm = vcross(t, [1, 0, 0]);
        nrm = vnorm(nrm);
        var u2 = vnorm(vcross(nrm, t));
        var lng = (Math.abs(u2[1]) >= Math.abs(t[1])) ? u2 : t;
        var rad = sg.r0 + (sg.r1 - sg.r0) * (k / (n - 1));
        var pm = pts[k], skin = sg.skin[k], best = -1e10, sj, dp, surf;
        for(sj=0;sj<skin.length;sj++){dp=vdot(vsub(skin[sj],pm),nrm);if(dp>best){best=dp;surf=skin[sj];}}
        if(surf){nrm=vnorm(vsub(surf,pm));pm=vadd(surf,vmul(nrm,.30));rad=0;}
        L.push({
          x: pm[0] + nrm[0] * (rad * 0.55), y: pm[1] + nrm[1] * (rad * 0.55), z: pm[2] + nrm[2] * (rad * 0.55),
          nx: nrm[0], ny: nrm[1], nz: nrm[2],
          ux: lng[0], uy: lng[1], uz: lng[2],
          w: 2.9, h: 10.5 - 1.5 * sg.gen, g: rr(0.70, 1.10)
        });
      }
    }
    return L;
  }

  /* ================================================================ 材質 */
  var M = null, TEX = null;

  function makeTex() {
    if (TEX) return TEX;
    TEX = {
      barkN: normalTex(512, 6, 4409, 0.75, 4.2),   /* 縦に裂けた樹皮の筋 */
      barkR: roughTex(512, 5, 8821, 0.87, 0.10),
      gndN: normalTex(128, 4, 1213, 0.35, 1.0)
    };
    TEX.barkN.repeat.set(1, 1);
    TEX.barkR.repeat.set(1, 1);
    TEX.gndN.repeat.set(160, 160);
    return TEX;
  }

  function makeMats() {
    var tx = makeTex();
    var m = {};
    m.bark = injectHaze(new T.MeshStandardMaterial({
      color: 0xffffff, vertexColors: true, roughness: 0.78, metalness: 0.0,
      normalMap: null, roughnessMap: null,
      normalScale: new T.Vector2(0.045, 0.045),
      side: T.FrontSide, dithering: true
    }), 'h53lib');
    m.panel = injectHaze(new T.MeshStandardMaterial({
      color: cl3(mul3(U.SAP, 0.34)),
      emissive: cl3(mul3(U.SAP, 1.0)).multiplyScalar(2.40),
      emissiveIntensity: 0.25,
      roughness: 0.52, metalness: 0.0, side: T.FrontSide, dithering: true, polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2
    }), 'h53libp', true);
    /* 検討ページ用 */
    m.sky = new T.ShaderMaterial({
      uniforms: { uH53SkyT: UNI.uH53SkyT, uH53SkyM: UNI.uH53SkyM, uH53SkyB: UNI.uH53SkyB },
      vertexShader: [
        'varying vec3 vH53W;',
        'void main(){',
        '  vec4 wp = modelMatrix * vec4( position, 1.0 );',
        '  vH53W = wp.xyz;',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'precision highp float;',
        'uniform vec3 uH53SkyT;',
        'uniform vec3 uH53SkyM;',
        'uniform vec3 uH53SkyB;',
        'varying vec3 vH53W;',
        SKY_FN,
        'void main(){',
        '  vec3 d = normalize( vH53W - cameraPosition );',
        '  gl_FragColor = vec4( h53Sky( d ), 1.0 );',
        '}'
      ].join('\n'),
      side: T.BackSide, depthWrite: false, fog: false
    });
    m.gnd = injectGFog(new T.MeshStandardMaterial({
      color: cl3(U.GROUND), roughness: 0.98, metalness: 0.0,
      normalMap: tx.gndN, normalScale: new T.Vector2(0.05, 0.05),
      side: T.FrontSide, dithering: true
    }), 'h53libg');
    return m;
  }

  function mats() {
    if (!M) M = makeMats();
    var env2 = (window.CH && window.CH.ENV) ? window.CH.ENV : null;
    var ks = ['bark', 'panel', 'gnd'], k;
    for (k = 0; k < ks.length; k++) {
      M[ks[k]].envMap = env2;
      M[ks[k]].envMapIntensity = (ks[k] === 'panel') ? 0.55 : 0.98;
      M[ks[k]].needsUpdate = true;
    }
    return M;
  }

  /* 空の勾配 → 等距円筒 → PMREM。契約 c2 §2 一 */
  function env(renderer) {
    var w = 256, h = 128, cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var cx = cv.getContext('2d'), j;
    var ST = UNI.uH53SkyT.value, SM = UNI.uH53SkyM.value, SB = UNI.uH53SkyB.value;
    for (j = 0; j < h; j++) {
      var dy = Math.cos((j + 0.5) / h * Math.PI);
      var t = clamp(dy * 1.5 + 0.42, 0, 1);
      var r, g, b, f;
      if (t < 0.42) { f = t / 0.42; r = SB.r + (SM.r - SB.r) * f; g = SB.g + (SM.g - SB.g) * f; b = SB.b + (SM.b - SB.b) * f; }
      else { f = (t - 0.42) / 0.58; r = SM.r + (ST.r - SM.r) * f; g = SM.g + (ST.g - SM.g) * f; b = SM.b + (ST.b - SM.b) * f; }
      if (dy < -0.03) {
        var q = Math.min(1, (-dy - 0.03) / 0.35) * 0.45;
        r += (U.GROUND[0] - r) * q; g += (U.GROUND[1] - g) * q; b += (U.GROUND[2] - b) * q;
      }
      cx.fillStyle = 'rgb(' + Math.round(clamp(r, 0, 1) * 255) + ',' + Math.round(clamp(g, 0, 1) * 255) + ',' + Math.round(clamp(b, 0, 1) * 255) + ')';
      cx.fillRect(0, j, w, 1);
    }
    var tx = new T.CanvasTexture(cv);
    tx.mapping = T.EquirectangularReflectionMapping;
    tx.encoding = T.sRGBEncoding;
    var pm = new T.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var rt = pm.fromEquirectangular(tx);
    pm.dispose(); tx.dispose();
    window.CH.ENV = rt.texture;
    if (M) mats();
    return rt.texture;
  }

  /* ================================================================ 組み立て */
  var S = null;

  function build() {
    var m = mats();
    layoutButtress();
    layoutEnv();
    calcRMean();
    buildSkeleton();

    var gR = GB(); geoRoots(gR);
    var gT = GB(); geoTrunk(gT);
    var gB = GB(); geoBranches(gB);
    var PAN = panelList();

    /* 正規化：bbox を契約値（高 660・幅 1255）へ実測で合わせる。
       幹と板根を歪めないよう、補正は半径 0.25CR → 0.75CR で立ち上げる。
       樹冠の最外点（包絡で切られている＝ r ≈ CR）は係数がそのまま効くので
       bbox は厳密に一致する。 */
    var arrs = [gR.p, gT.p, gB.p], a, i;
    var xp = 1e-6, xn = 1e-6, zp = 1e-6, zn = 1e-6, ymax = -1e9, ymin = 1e9;
    function ext(x, y, z) {
      if (x > xp) xp = x; if (-x > xn) xn = -x;
      if (z > zp) zp = z; if (-z > zn) zn = -z;
      if (y > ymax) ymax = y; if (y < ymin) ymin = y;
    }
    for (a = 0; a < arrs.length; a++) {
      var P = arrs[a];
      for (i = 0; i < P.length; i += 3) ext(P[i], P[i + 1], P[i + 2]);
    }
    var pu = new T.Vector3(), pn = new T.Vector3(), pv = new T.Vector3(), sg2, sg3;
    for (i = 0; i < PAN.length; i++) {
      pn.set(PAN[i].nx, PAN[i].ny, PAN[i].nz).normalize();
      pu.set(PAN[i].ux, PAN[i].uy, PAN[i].uz);
      pv.crossVectors(pu, pn).normalize().multiplyScalar(PAN[i].w * 0.5);
      pu.crossVectors(pn, pv).normalize().multiplyScalar(PAN[i].h * 0.5);
      for (sg2 = -1; sg2 <= 1; sg2 += 2) {
        for (sg3 = -1; sg3 <= 1; sg3 += 2) {
          ext(PAN[i].x + pu.x * sg2 + pv.x * sg3,
              PAN[i].y + pu.y * sg2 + pv.y * sg3,
              PAN[i].z + pu.z * sg2 + pv.z * sg3);
        }
      }
    }
    var RAW = { xp: xp, xn: xn, zp: zp, zn: zn, ymax: ymax, ymin: ymin };
    var fxp = (WW * 0.5) / xp, fxn = (WW * 0.5) / xn;
    var fzp = (WW * 0.5) / zp, fzn = (WW * 0.5) / zn;
    var fy = HH / (ymax - ymin);
    function kOf(x, z) { return ss01(0.25 * CR, 0.75 * CR, Math.sqrt(x * x + z * z)); }
    function sxz(x, z, o) {
      var k = kOf(x, z);
      o[0] = x * (1 + ((x >= 0 ? fxp : fxn) - 1) * k);
      o[1] = z * (1 + ((z >= 0 ? fzp : fzn) - 1) * k);
    }
    var o2 = [0, 0];
    for (a = 0; a < arrs.length; a++) {
      var P2 = arrs[a];
      for (i = 0; i < P2.length; i += 3) {
        sxz(P2[i], P2[i + 2], o2);
        P2[i] = o2[0]; P2[i + 1] = (P2[i + 1] - ymin) * fy; P2[i + 2] = o2[1];
      }
    }
    for (i = 0; i < PAN.length; i++) {
      sxz(PAN[i].x, PAN[i].z, o2);
      PAN[i].x = o2[0]; PAN[i].y = (PAN[i].y - ymin) * fy; PAN[i].z = o2[1];
      PAN[i].h *= fy;
    }

    var baked = window.CH.TREE_SURFACE_V6;
    var roots = new T.Mesh(baked ? baked.geometry() : finish(gR), m.bark);
    var trunk = new T.Mesh(finish(gT), m.bark);
    var branches = new T.Mesh(finish(gB), m.bark);
    roots.name = baked ? 'continuous-library-skin' : 'roots'; trunk.name = 'trunk'; branches.name = 'branches';
    if(baked){trunk.visible=false;branches.visible=false;}
    roots.userData.h53log = 'library'; trunk.userData.h53log = 'library';
    branches.userData.h53log = 'library';
    roots.frustumCulled = false; trunk.frustumCulled = false; branches.frustumCulled = false;

    /* 面 — InstancedMesh。全インスタンスに setColorAt（§1） */
    var pg = new T.PlaneGeometry(1, 1, 1, 1);
    var panels = new T.InstancedMesh(pg, m.panel, PAN.length);
    var mm = new T.Matrix4(), vx = new T.Vector3(), vy = new T.Vector3(), vz = new T.Vector3();
    var col = new T.Color();
    for (i = 0; i < PAN.length; i++) {
      var p = PAN[i];
      vz.set(p.nx, p.ny, p.nz).normalize();
      vy.set(p.ux, p.uy, p.uz);
      vx.crossVectors(vy, vz).normalize();
      vy.crossVectors(vz, vx).normalize();
      vx.multiplyScalar(p.w); vy.multiplyScalar(p.h);
      mm.makeBasis(vx, vy, vz);
      mm.setPosition(p.x, p.y, p.z);
      if(baked && baked.panels[i]) mm.fromArray(baked.panels[i]);
      panels.setMatrixAt(i, mm);
      col.setRGB(p.g, p.g, p.g);
      panels.setColorAt(i, col);
    }
    panels.instanceMatrix.needsUpdate = true;
    if (panels.instanceColor) panels.instanceColor.needsUpdate = true;
    panels.frustumCulled = false;
    panels.name = 'panels';
    panels.userData.h53log = 'library';

    /* 構造体そのもの。原点＝基部の中心・+y 上・幹の軸 +y */
    var pivot = new T.Group();
    pivot.name = 'library';
    pivot.add(roots); pivot.add(trunk); pivot.add(branches); pivot.add(panels);

    /* 追従用の外枠。ホストは root.position.copy(camera.position) するだけでよい */
    var root = new T.Group();
    root.name = 'tree';
    pivot.position.set(DIST * Math.cos(AZ), 0, DIST * Math.sin(AZ));
    root.add(pivot);

    root.userData.FOLLOW = true;
    root.userData.NOMINAL = { dist: DIST, height: HH, width: WW, az: AZ };
    root.userData.OFFSET = { x: pivot.position.x, y: 0, z: pivot.position.z };
    root.userData.parts = { roots: roots, trunk: trunk, branches: branches, panels: panels, pivot: pivot };
    root.userData.h53log = 'library';
    root.userData.h53 = {
      segs: SEG.length, buttress: NB, panels: PAN.length,
      fxp: fxp, fxn: fxn, fzp: fzp, fzn: fzn, fy: fy, raw: RAW,
      gens: (function () {
        var q = [0, 0, 0, 0, 0], j2;
        for (j2 = 0; j2 < SEG.length; j2++) q[SEG[j2].gen]++;
        return q;
      })()
    };

    /* 溶けの基準高さ（追従で動くので描画直前に読む） */
    function syncBase() {
      UNI.uH53BaseY.value = pivot.matrixWorld.elements[13];
    }
    roots.onBeforeRender = syncBase;
    trunk.onBeforeRender = syncBase;
    branches.onBeforeRender = syncBase;
    panels.onBeforeRender = syncBase;

    S = { root: root, pivot: pivot, panels: panels, night: 0.0 };
    setNight(0.0);
    return root;
  }

  /* ================================================================ 夜 */
  var EMI_DAY = 0.115, EMI_NIGHT = 1.00, _beat = 1.0;
  function applyEmi() {
    if (!M) return;
    var k = S ? S.night : 0.0;
    M.panel.emissiveIntensity = (EMI_DAY + (EMI_NIGHT - EMI_DAY) * k) * _beat;
  }
  function setNight(k) {
    k = clamp(k, 0, 1);
    if (S) S.night = k;
    UNI.uH53LocalNight.value=k;
    /* 幹の透け：夜は強くなる（昼は台帳⑦ の 0.03 以下を守る） */
    UNI.uH53Sap.value = 0.028 + 0.085 * k;
    applyEmi();
  }
  /* 溶けの到達色（＝空）。統合側が空を持つならここで揃える */
  function setSky(top, mid, low) {
    UNI.uH53SkyT.value.setRGB(top[0], top[1], top[2]);
    UNI.uH53SkyM.value.setRGB(mid[0], mid[1], mid[2]);
    UNI.uH53SkyB.value.setRGB(low[0], low[1], low[2]);
  }
  function setDissolve(v) { UNI.uH53Dis.value = v; }

  /* ================================================================ 拍 */
  function tick(t) {
    /* 動かすものは無い（原文「風はないのに」＝揺れは描かない）。
       面が拍で僅かに息をするだけ */
    var b = ((t % U.BEAT) + U.BEAT) % U.BEAT / U.BEAT;
    _beat = 1.0 + 0.030 * Math.sin(b * 6.283185307);
    applyEmi();
  }

  /* ================================================================ API */
  window.CH.parts.tree = {
    build: build, tick: tick, mats: mats, setNight: setNight, name: 'tree',
    skeleton: function () { return SEG; },
    env: env, setSky: setSky, setDissolve: setDissolve,
    dims: { H: HH, W: WW, DIST: DIST, AZ: AZ, R0: R0, RB: RB,
      YFORK: YFORK, YC: YC, YHH: YHH, NB: NB, CR: CR }
  };

})();
