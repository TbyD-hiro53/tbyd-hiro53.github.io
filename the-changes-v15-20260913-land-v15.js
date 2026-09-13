/* Fixed night land v14. Day structures removed from build, materials, textures, update and source functions.
 * Source ancestor: asset-land-v4.js — ASSET 20『乗換 / The Changes』期1 / 区間 T1「根の惑星の平地」
 * 部品 B『車窓の景色』  空(曇天)・地面・苔・下生え・根の束・遠くの林・円盤・建物の格子・線路
 * Three.js r128 / 単一 IIFE / ES5 / 外部リクエスト 0
 * 契約 CONTRACT-c2.md §1 §2 §5 §6 準拠。列車は動かない。世界のほうが -x へ流れる。
 *
 * v2 からの改訂
 *   一  強い方向光をやめ、空の PMREM を主光源にする（c2 §2）。露出 0.86
 *   二  地表に 苔 / 下生え / 根の束 / 遠くの林 / 円盤搬送系 を入れる（第七作 篇07）
 *   三  進行方向 +x から +z へ 22 度の方位を、書庫（部品 C）のために空ける
 *
 * v3 からの改訂（契約 c3 §5。地表・空・光・流れ・区画は一切触っていない）
 *   一  開口に見込み 0.22 と上枠・下枠・両側の返し。下枠は水平面を持つ
 *   二  開口の奥を黒くしない。室を置き、天井の帯が落ちた明るい線を一本見せる
 *   三  陸屋根にパラペット（立ち上がり 0.28・厚 0.12）。屋根面は 0.05 凹ませる
 *   四  一面に一つ、取っ手のない扉（1.10 × 2.10・見込み 0.18）
 *   五  壁の下端に水切り（引っ込み 0.045・高さ 0.15）と接地の頂点色
 *   六  一棟ずつ形は変えない。同じ形・同じ間隔 21.6 m のまま（篇04）
 */
(function () {
  'use strict';

  var T = window.THREE;

  /* ------------------------------------------------------------------ 共有定数 */
  window.CH = window.CH || {};
  var U = window.CH.U || (window.CH.U = {});
  function def(k, v) { if (U[k] === undefined) U[k] = v; }
  def('V', 27.6923); def('PITCH', 21.6); def('BEAT', 0.78);
  def('DISC', 2.4); def('LOOP', 31.2); def('RAIL_Y', -1.15);

  /* 契約 c2 §2 — c1 の値が残っていても c2 が正。上書きする */
  U.SKY_TOP = [0.494, 0.541, 0.518];   /* #7e8a84  天頂  緑みの灰・暗い   */
  U.SKY_MID = [0.604, 0.639, 0.612];   /* #9aa39c  地平ぎわ いちばん明るい */
  U.SKY_LOW = [0.435, 0.478, 0.455];   /* #6f7a74  地平の下              */
  U.GROUND  = [0.373, 0.353, 0.329];   /* #5f5a54  平らな土              */
  U.MOSS    = [0.306, 0.361, 0.282];   /* #4e5c48  苔・下生え            */
  U.ROOT    = [0.416, 0.380, 0.341];   /* #6a6157  根の樹皮              */
  U.WALL    = [0.725, 0.698, 0.706];   /* #b9b2b4  建物の壁              */
  U.SAP     = [0.184, 0.373, 0.353];   /* #2f5f59  幹の透ける青緑        */
  U.FOG_N   = 90.0;
  U.FOG_F   = 620.0;

  window.CH.parts = window.CH.parts || {};

  /* ------------------------------------------------------------------ 光（c2 §2） */
  var SUN_DIR = [0.10, 0.98, 0.17];    /* 真上から僅かに +x。曇天なので方位は意味を持たない */
  var SUN_COL = 0xd8ded6, SUN_INT = 0.26;
  var AMB_COL = 0xa8b0aa, AMB_INT = 0.08;
  var ENV_INT = 1.05;                  /* 契約 0.85〜1.05 */
  var EXPOSURE = 0.86;

  /* ------------------------------------------------------------------ 地表・格子 */
  var G_Y = U.RAIL_Y;              /* -1.15  地面＝レール頭頂 */
  var PITCH = U.PITCH;             /* 21.6   x 方向の列ピッチ */
  var LOOPCOL = 40;                /* 40 列 ＝ 864.0 m ＝ 31.2 s */

  var BW = 12.0;                   /* 建物 一辺 */
  var BH = 4.4;                    /* 建物 高 */
  var SH = 0.25;                   /* 基礎スラブ 高 */
  var WIN_W = 1.10, WIN_H = 1.10;  /* 窓 */
  var WIN_B = 1.35;                /* 窓 下端（地面から） */
  var WIN_T = WIN_B + WIN_H;       /* 2.45 */
  var WIN_C = [-4.5, -1.5, 1.5, 4.5];
  var REV = 0.22;

  var ROWS_N = [-118.8, -97.2, -75.6, -54.0, -32.4, 32.4, 54.0, 75.6, 97.2, 118.8];
  var ROWS_F = [];
  (function () {
    var i, z;
    for (i = 0; i < 10; i++) { z = 140.4 + i * 21.6; ROWS_F.push(z); ROWS_F.push(-z); }
  })();

  var NEAR_COL = 40;
  var FAR_COL = 80;


  var N_BLK = 26, N_SLB = 10, N_MRK = 4;

  /* 線路 */
  var GAUGE = 1.435, RAIL_W = 0.072, RAIL_H = 0.140;
  var TIE_P = 0.60, TIE_L = 2.40, TIE_W = 0.26, TIE_H = 0.120;
  var COR_HW = 1.70, COR_D = 0.040;
  var TIE_N = 501;

  var GND_HALF = 900.0;

  /* 根の惑星（第七作 篇07） */
  var FIELD_T = 172.8;             /* 苔・下生え・根の束の繰り返し ＝ 8 拍（864 の約数） */
  var FIELD_NT = 4;                /* 繰り返し数 k = -1,0,1,2 */
  var MOSS_HALF = 560.0;           /* 苔の層の広がり（霧が 9 割食う距離） */
  var MOSS_Z0 = 1.95;              /* 軌道の帯は苔にしない（踏み固められている） */
  var GRASS_N = 780;               /* 下生え 1 タイルあたり */
  var SCRUB_N = 400;               /* 灌木   1 タイルあたり */
  var ROOT_BANDS = 4;              /* 根の束 1 タイルあたり ＝ 43.2 m に一本 */
  var FOREST_R = 470.0;            /* 遠くの林の帯 */
  var FOREST_SEG = 192;
  var FOREST_H = 9.0;
  var LIB_AZ = 22.0 * Math.PI / 180;   /* 書庫（部品 C）の方位 +x から +z へ 22 度 */
  var LIB_IN = 8.0 * Math.PI / 180;    /* この幅は林を伏せる */
  var LIB_OUT = 21.0 * Math.PI / 180;  /* この幅から林が立ち上がる */
  var DISC_Z = 172.8;              /* 円盤搬送系の列（線路から 180 m ほど） */
  var DISC_R = 1.10, DISC_P = 21.6, DISC_N = 25;

  /* ------------------------------------------------------------------ 小道具 */
  function wrap(a, m) { return ((a % m) + m) % m; }

  var _seed = 1;
  function rnd() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
  function rseed(s) { _seed = ((s % 233280) + 233280) % 233280; }

  function c3(a) { return new T.Color(a[0], a[1], a[2]); }
  function ch(h) { return new T.Color(h); }

  /* 契約 c2 §2 の色は「そう写ってほしい画素値」である（空は画面へ直に書くので逐語で合う）。
     材質は違う。反射率をそのまま入れると、ACES と露出を通った先で別の値になる。
     そこで逆に解く：目標の画素値 → sRGB 復号 → ACES 逆 → 露出で割る → 基準照度で割る。
     three.js の ACESFilmicToneMapping は color *= exposure / 0.6 を先に掛ける（台帳に追記）。
     基準は上を向いた面。垂直な面は自然にこれより暗く写る（曇天の作法）。 */
  var ACES_K = EXPOSURE / 0.6;
  var I_REF = 0.700;                 /* 上向き面が受ける照度 env+ambient+方向光。実測で合わせた */


  function toLin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function cs3(a) {
    var o = [0, 0, 0], k;
    for (k = 0; k < 3; k++) {
      o[k] = toLin(a[k]);
    }
    return new T.Color(o[0], o[1], o[2]);
  }
  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    if (t < 0) t = 0; if (t > 1) t = 1;
    return t * t * (3 - 2 * t);
  }

  /* 値ノイズ（LCG・多オクターブ）の高さ場 */
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
          f[j * n + i] += amp * ((a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty);
        }
      }
      tot += amp; amp *= 0.5;
    }
    for (k = 0; k < n * n; k++) f[k] /= tot;
    return f;
  }

  function normalTex(n, oct, seed, strength) {
    var f = valueField(n, oct, seed);
    var cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    var cx = cv.getContext('2d'), im = cx.createImageData(n, n), d = im.data;
    var i, j;
    for (j = 0; j < n; j++) {
      for (i = 0; i < n; i++) {
        var xm = (i - 1 + n) % n, xp = (i + 1) % n, ym = (j - 1 + n) % n, yp = (j + 1) % n;
        var gx = (f[ym * n + xp] + 2 * f[j * n + xp] + f[yp * n + xp])
               - (f[ym * n + xm] + 2 * f[j * n + xm] + f[yp * n + xm]);
        var gy = (f[yp * n + xm] + 2 * f[yp * n + i] + f[yp * n + xp])
               - (f[ym * n + xm] + 2 * f[ym * n + i] + f[ym * n + xp]);
        var k = (j * n + i) * 4;
        d[k] = Math.max(0, Math.min(255, Math.round((0.5 + gx * strength) * 255)));
        d[k + 1] = Math.max(0, Math.min(255, Math.round((0.5 + gy * strength) * 255)));
        d[k + 2] = 255; d[k + 3] = 255;
      }
    }
    cx.putImageData(im, 0, 0);
    var tx = new T.CanvasTexture(cv);
    tx.wrapS = tx.wrapT = T.RepeatWrapping;
    tx.anisotropy = 4;
    return tx;
  }

  function roughTex(n, oct, seed, base, amp) {
    var f = valueField(n, oct, seed);
    var cv = document.createElement('canvas'); cv.width = n; cv.height = n;
    var cx = cv.getContext('2d'), im = cx.createImageData(n, n), d = im.data, k;
    for (k = 0; k < n * n; k++) {
      var v = Math.max(0, Math.min(1, base + (f[k] - 0.5) * 2 * amp));
      d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = Math.round(v * 255);
      d[k * 4 + 3] = 255;
    }
    cx.putImageData(im, 0, 0);
    var tx = new T.CanvasTexture(cv);
    tx.wrapS = tx.wrapT = T.RepeatWrapping;
    tx.anisotropy = 4;
    return tx;
  }

  /* 苔の斑：R に細かい斑・G に粗い斑。境を作らないので閾値は使わず連続値のまま */


  /* ------------------------------------------------------------------ 空 */
  /* 到達色は空と霧で同じ一つの関数を使う。継ぎ目が出ない。
     基層は契約 c2 §2 七 の逐語式 mix(SKY_LOW, SKY_TOP, clamp(d.y*1.5+0.42,0,1))。
     そこへ「地平ぎわ いちばん明るい」SKY_MID の帯を重ねる（c2 §2 の三色を全て使う） */
  var SKY_FN = [
    'vec3 h53Sky( vec3 d ){',
    '  float t = clamp( d.y * 1.5 + 0.42, 0.0, 1.0 );',
    '  vec3 c = mix( uH53SkyLow, uH53SkyTop, t );',
    '  float h = exp( - abs( d.y ) * 7.0 );',
    '  c = mix( c, uH53SkyMid, h * 0.85 );',
    '  return c;',
    '}'
  ].join('\n');

  /* 同じ式の JS 版。PMREM 用の等距円筒を描くのに使う */
  function skyJS(dy) {
    var t = dy * 1.5 + 0.42; if (t < 0) t = 0; if (t > 1) t = 1;
    var h = Math.exp(-Math.abs(dy) * 7.0) * 0.85, k, o = [0, 0, 0];
    for (k = 0; k < 3; k++) {
      var c = U.SKY_LOW[k] + (U.SKY_TOP[k] - U.SKY_LOW[k]) * t;
      o[k] = c + (U.SKY_MID[k] - c) * h;
    }
    return o;
  }

  var SKY_VS = [
    'varying vec3 vH53W;',
    'void main(){',
    '  vec4 wp = modelMatrix * vec4( position, 1.0 );',
    '  vH53W = wp.xyz;',
    '  gl_Position = projectionMatrix * viewMatrix * wp;',
    '}'
  ].join('\n');

  var SKY_FS = [
    'precision highp float;',
    'uniform vec3 uH53SkyTop;',
    'uniform vec3 uH53SkyMid;',
    'uniform vec3 uH53SkyLow;',
    'varying vec3 vH53W;',
    SKY_FN,
    'void main(){',
    '  vec3 d = normalize( vH53W - cameraPosition );',
    '  gl_FragColor = vec4( h53Sky( d ), 1.0 );',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ 霧・苔の注入 */
  /* 台帳⑫：宣言と使用が離れないよう、注入は必ずこの一関数だけを通す。
     mode 0 = 色を空へ溶かす ／ 1 = 透明度を落とす ／ 2 = 苔（1 に斑の alpha を足す） */
  var FOG_HEAD_V = 'varying vec3 vH53W;';
  var FOG_HEAD_F0 = [
    'uniform vec3 uH53SkyTop;',
    'uniform vec3 uH53SkyMid;',
    'uniform vec3 uH53SkyLow;',
    'uniform float uH53FogN;',
    'uniform float uH53FogF;',
    'varying vec3 vH53W;',
    SKY_FN
  ].join('\n');
  var MOSS_HEAD_F = [
    'uniform sampler2D uH53Mask;'
  ].join('\n');
  var FOG_BODY_V = [
    'vec4 h53p = vec4( transformed, 1.0 );',
    '#ifdef USE_INSTANCING',
    '  h53p = instanceMatrix * h53p;',
    '#endif',
    'vH53W = ( modelMatrix * h53p ).xyz;'
  ].join('\n');
  var FOG_PRE_F = [
    'vec3 h53d = vH53W - cameraPosition;',
    'float h53z = length( h53d );',
    'float h53f = smoothstep( uH53FogN, uH53FogF, h53z );'
  ].join('\n');
  var FOG_BODY_F = FOG_PRE_F + '\n' +
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, h53Sky( h53d / max( h53z, 1e-4 ) ), h53f );';
  var FOG_ALPHA_F = FOG_PRE_F + '\n' + 'gl_FragColor.a *= ( 1.0 - h53f );';

  /* 苔：土との境を作らない。斑の濃度が連続的に変わるだけ。
     線路から離れるほど濃い（縁は、なかった） */
  var MOSS_BODY_F = [
    'vec2 h53q = vH53W.xz;',
    'float h53m1 = texture2D( uH53Mask, h53q * 0.085 ).r;',
    'float h53m2 = texture2D( uH53Mask, h53q * 0.0170 ).g;',
    'float h53m3 = texture2D( uH53Mask, h53q * 0.0043 ).g;',
    'float h53dz = smoothstep( 2.2, 26.0, abs( vH53W.z ) );',
    'float h53a = clamp( ( h53m1 * 0.42 + h53m2 * 0.62 + h53m3 * 0.50 - 0.40 ) * 2.35, 0.0, 1.0 );',
    'diffuseColor.a *= h53a * h53dz;',
    'diffuseColor.rgb *= ( 0.78 + 0.40 * h53m1 );'
  ].join('\n');

  var fogUniforms = null;
  function fogU() {
    if (!fogUniforms) {
      fogUniforms = {
        uH53SkyTop: { value: c3(U.SKY_TOP) },
        uH53SkyMid: { value: c3(U.SKY_MID) },
        uH53SkyLow: { value: c3(U.SKY_LOW) },
        uH53FogN: { value: U.FOG_N },
        uH53FogF: { value: U.FOG_F }
      };
    }
    return fogUniforms;
  }
  var mossUniform = null;
  function mossU(tex) {
    if (!mossUniform) mossUniform = { uH53Mask: { value: tex } };
    return mossUniform;
  }

  function injectFog(mat, mode, maskTex) {
    var tail = (mode === 0) ? FOG_BODY_F : FOG_ALPHA_F;
    mat.fog = false;
    mat.onBeforeCompile = function (sh) {
      var u = fogU(), k;
      for (k in u) { if (u.hasOwnProperty(k)) sh.uniforms[k] = u[k]; }
      var headF = FOG_HEAD_F0;
      if (mode === 2) {
        var mu = mossU(maskTex);
        for (k in mu) { if (mu.hasOwnProperty(k)) sh.uniforms[k] = mu[k]; }
        headF = FOG_HEAD_F0 + '\n' + MOSS_HEAD_F;
      }
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + FOG_HEAD_V)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + FOG_BODY_V);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\n' + headF)
        .replace('#include <encodings_fragment>', '#include <encodings_fragment>\n{\n' + tail + '\n}');
      if (mode === 2) {
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <color_fragment>', '#include <color_fragment>\n{\n' + MOSS_BODY_F + '\n}');
      }
    };
    mat.customProgramCacheKey = function () { return 'h53fog' + mode; };
    return mat;
  }

  /* ------------------------------------------------------------------ 幾何の道具 */
  function GBuf() { return { p: [], n: [], u: [], c: [], i: [] }; }

  /* 四角形。巻き方向は法線から自動で決める（台帳③） */
  function quad(g, A, B, C, D, N, uv, col) {
    var ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
    var vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
    var cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    var flip = (cx * N[0] + cy * N[1] + cz * N[2]) < 0;
    var P = flip ? [A, D, C, B] : [A, B, C, D];
    var Q = flip ? [uv[0], uv[1], uv[6], uv[7], uv[4], uv[5], uv[2], uv[3]]
                 : [uv[0], uv[1], uv[2], uv[3], uv[4], uv[5], uv[6], uv[7]];
    var base = g.p.length / 3, k;
    for (k = 0; k < 4; k++) {
      g.p.push(P[k][0], P[k][1], P[k][2]);
      g.n.push(N[0], N[1], N[2]);
      g.u.push(Q[k * 2], Q[k * 2 + 1]);
      g.c.push(col[0], col[1], col[2]);
    }
    g.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  /* 頂点ごとに色を持つ四角形。曇天は遮蔽を作らないので、見込みの深さはここへ焼く */


  /* 巻き方向を指定どおりに置く（両面カードのため） */


  function finish(g, wantColor) {
    var geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(g.p, 3));
    geo.setAttribute('normal', new T.Float32BufferAttribute(g.n, 3));
    geo.setAttribute('uv', new T.Float32BufferAttribute(g.u, 2));
    if (wantColor) geo.setAttribute('color', new T.Float32BufferAttribute(g.c, 3));
    geo.setIndex(g.i);
    geo.computeBoundingSphere();
    return geo;
  }

  function boxOpen(g, hx, y0, y1, hz, tile, col) {
    var s = [[hx, 0, 1, 0], [-hx, 0, -1, 0]];
    var i;
    for (i = 0; i < 2; i++) {
      var x = s[i][0], nx = s[i][2];
      quad(g, [x, y0, -hz], [x, y0, hz], [x, y1, hz], [x, y1, -hz],
        [nx, 0, 0], [0, 0, 2 * hz / tile, 0, 2 * hz / tile, (y1 - y0) / tile, 0, (y1 - y0) / tile], col);
    }
    var t = [[hz, 1], [-hz, -1]];
    for (i = 0; i < 2; i++) {
      var z = t[i][0], nz = t[i][1];
      quad(g, [-hx, y0, z], [hx, y0, z], [hx, y1, z], [-hx, y1, z],
        [0, 0, nz], [0, 0, 2 * hx / tile, 0, 2 * hx / tile, (y1 - y0) / tile, 0, (y1 - y0) / tile], col);
    }
    quad(g, [-hx, y1, -hz], [hx, y1, -hz], [hx, y1, hz], [-hx, y1, hz],
      [0, 1, 0], [0, 0, 2 * hx / tile, 0, 2 * hx / tile, 2 * hz / tile, 0, 2 * hz / tile], col);
  }

  /* ------------------------------------------------------------------ 建物 */
  /* 参考 ref4（白い集落）から採ったのは 開口の見込み・パラペットの分節・稜の値差・
     接地の陰 の四つだけである。一棟ずつ形は変えない。
       書 篇04「間隔はどこも同じだった」「窓の位置にあたるところが四つあって、
                どれも同じ高さに、同じ大きさで開いていた」
                「扉には取っ手がなく」「中は暗くなく、天井の帯が点いていた」
     曇天は方向を持たないので遮蔽が出ない。見込みの深さと接地は頂点色へ焼く
     （CONSTRAINTS §3 ①）。汚れ・退色・人の痕跡・彩度は一切足さない。 */
  var WTILE = 2.4;
  var PAR_H = 0.28, PAR_T = 0.12;      /* パラペット 立ち上がり・厚（契約 c3 §5） */
  var ROOF_Y = BH - PAR_H;             /* 4.12 屋根面。総高 4.4 は動かさない */
  var ROOF_DIP = 0.05;                 /* 屋根面の凹み */
  var DRP_H = 0.15, DRP_D = 0.045;     /* 壁下端の水切り 高さ・引っ込み */
  var GRD_H = 0.70;                    /* 接地の頂点色が消える高さ */
  var DOOR_W = 1.10, DOOR_H = 2.10, DOOR_R = 0.18;
  var ROOM = 0.30;                     /* 見込みの奥の室（近景のみ深い） */
  var BAND_H = 0.09;                   /* 天井の帯が奥の壁に落ちる線の太さ */
  var SEAM = 0.003;                    /* 継ぎ目の重ね代。
     割り方の違う帯どうしが同じ線を共有すると T 字接合になり、面が一画素抜けて
     室が透けて見える（実測：窓の頭の高さに 42 px の線）。同じ色どうしを 3 mm
     重ねて塞ぐ。開口は 1.10 に対して 0.006 だけ狭くなるが、26 m で 0.08 画素。 */

  function vc(v) { return [v, v, v]; }
  /* この空は上が明るく下が暗い。上を向く面は壁より明るく写り（実測 173 / 148）、
     下を向く面は地の照り返しだけになる。値は全て実測して決めた（診断 diag-land-v4）。 */
  var CW = vc(1.00);                             /* 壁            実測 148 */
  var C_GRD = vc(0.93);                          /* 壁の足元 */
  var C_DRP = vc(0.86), C_SOF = vc(0.60);        /* 水切りの底・下向き面 */
  var C_JO = vc(0.88), C_JI = vc(0.68);          /* 返し（縦） 外→奥  137→112 */
  var C_HO = vc(0.48), C_HI = vc(0.40);          /* 上枠（下を向く）  開口でいちばん暗い */
  var C_SO = vc(0.74), C_SI = vc(0.62);          /* 下枠（水平面）    上を向く分だけ明るい */
  var C_COP = vc(1.00), C_PIN = vc(0.78);        /* 笠木・パラペット内側 */
  var C_ROF = vc(0.86);                          /* 屋根面 */
  var C_IL = vc(0.26), C_IH = vc(0.54);          /* 室 床際→帯の下   85→103 */
  var C_IB = vc(1.90), C_IT = vc(0.44);          /* 天井の帯の線 190 ・帯より上 */
  var CS = [0.88, 0.87, 0.88];                   /* 基礎スラブ */
  var CB = [0.70, 0.69, 0.70];                   /* 遠景の窓帯 ＝ 中景の面の平均（実測 127 / 148） */

  var FACES = [
    { n: [1, 0, 0], u: [0, 0, -1] },
    { n: [0, 0, 1], u: [1, 0, 0] },
    { n: [-1, 0, 0], u: [0, 0, 1] },
    { n: [0, 0, -1], u: [-1, 0, 0] }
  ];



  /* 開口の u 区間。窓は WIN_C の四つ、扉は面の中央に一つ */
  var DOOR_U = [-DOOR_W / 2, DOOR_W / 2];
  var W_U = (function () {
    var a = [], i;
    for (i = 0; i < WIN_C.length; i++) a.push([WIN_C[i] - WIN_W / 2, WIN_C[i] + WIN_W / 2]);
    return a;
  })();
  var H_DOOR = [DOOR_U];
  var H_WIN = W_U;
  var H_ALL = [W_U[0], W_U[1], DOOR_U, W_U[2], W_U[3]];

  /* holes（u 昇順・重なりなし）を避けて残る u 区間 */


  /* 垂直の帯（y が ya→yb、深さ d 一定） */


  /* 水平の面（y 一定、深さが d0→d1） */


  /* 開口の返し。上枠・下枠は必ず、両側の返しは近景・中景の窓だけ */


  /* 扉の返し。取っ手はない。水切りの中では外面が 0.045 引っ込むので縦を二枚に割る */


  /* 室。四枚は互いの端を越えて張り、角で必ず閉じる（斜めから覗いても抜けない）。
     床際は暗く、窓の上端に天井の帯が落ちた明るい線を一本だけ持つ。 */


  /* 陸屋根。近景は中央を 0.05 凹ませる */


  /* level 2 = 近景（水切り・扉の返し・凹んだ屋根）／ 1 = 中景（上下枠のみ・浅い室） */


  /* 遠景は板のまま（契約 c3 §5）。窓帯の値だけ中景の面の平均に寄せる */






  /* 接地の陰。壁際でいちばん濃く、外へ 0.95 m で消える（CONSTRAINTS §3 ②） */
  var CT_HALF = 7.2, CT_FOOT = 6.0, CT_FADE = 0.95;





  /* ------------------------------------------------------------------ 地面・線路 */
  /* x に極端に長い四角形を浅い角度で見ると深度の補間が壊れ、手前の物の上に細い線が出る。
     長手方向に割ると消える（v2 で実測 938 px → 0）。v3 は x と z の両方向に割る。 */
  var SPLIT_X = 20;
  var MAXQ = 100.0;   /* 一枚の長手はこの値以下（検証で機械的に確かめる） */

  function lerp3(p, q, t) {
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  }
  function bil3(A, B, C, D, s, t) {
    return lerp3(lerp3(A, B, s), lerp3(D, C, s), t);
  }
  function bil2(uv, s, t) {
    var ab = [uv[0] + (uv[2] - uv[0]) * s, uv[1] + (uv[3] - uv[1]) * s];
    var dc = [uv[6] + (uv[4] - uv[6]) * s, uv[7] + (uv[5] - uv[7]) * s];
    return [ab[0] + (dc[0] - ab[0]) * t, ab[1] + (dc[1] - ab[1]) * t];
  }

  /* A→B が第一方向、A→D が第二方向。NU × NV に割って積む */
  function quadS2(g, A, B, C, D, nrm, uv, NU, NV, col) {
    var i, j;
    for (j = 0; j < NV; j++) {
      var t0 = j / NV, t1 = (j + 1) / NV;
      for (i = 0; i < NU; i++) {
        var s0 = i / NU, s1 = (i + 1) / NU;
        var P0 = bil3(A, B, C, D, s0, t0), P1 = bil3(A, B, C, D, s1, t0);
        var P2 = bil3(A, B, C, D, s1, t1), P3 = bil3(A, B, C, D, s0, t1);
        var q0 = bil2(uv, s0, t0), q1 = bil2(uv, s1, t0);
        var q2 = bil2(uv, s1, t1), q3 = bil2(uv, s0, t1);
        quad(g, P0, P1, P2, P3, nrm,
          [q0[0], q0[1], q1[0], q1[1], q2[0], q2[1], q3[0], q3[1]], col);
      }
    }
  }
  /* v2 から引き継ぐ長手分割（a→b と d→c が第一方向）。NV = 1 の quadS2 */
  function quadSX(g, a, b, c, d, nrm, uv, N, cw) {
    quadS2(g, a, b, c, d, nrm, uv, N, 1, cw);
  }

  var GTILE = 3.6;

  function geoGround() {
    var g = GBuf(), H = GND_HALF, y = G_Y, yc = G_Y - COR_D, t = GTILE;
    var NZ = Math.ceil((H - COR_HW) / MAXQ) + 1;    /* 898.3 / 100 → 10 */
    quadS2(g, [-H, y, COR_HW], [H, y, COR_HW], [H, y, H], [-H, y, H],
      [0, 1, 0], [-H / t, COR_HW / t, H / t, COR_HW / t, H / t, H / t, -H / t, H / t], SPLIT_X, NZ, CW);
    quadS2(g, [-H, y, -H], [H, y, -H], [H, y, -COR_HW], [-H, y, -COR_HW],
      [0, 1, 0], [-H / t, -H / t, H / t, -H / t, H / t, -COR_HW / t, -H / t, -COR_HW / t], SPLIT_X, NZ, CW);
    quadS2(g, [-H, yc, -COR_HW], [H, yc, -COR_HW], [H, yc, COR_HW], [-H, yc, COR_HW],
      [0, 1, 0], [-H / t, -COR_HW / t, H / t, -COR_HW / t, H / t, COR_HW / t, -H / t, COR_HW / t], SPLIT_X, 1, CW);
    quadS2(g, [-H, yc, COR_HW], [H, yc, COR_HW], [H, y, COR_HW], [-H, y, COR_HW],
      [0, 0, -1], [-H / t, 0, H / t, 0, H / t, COR_D / t, -H / t, COR_D / t], SPLIT_X, 1, CW);
    quadS2(g, [-H, yc, -COR_HW], [H, yc, -COR_HW], [H, y, -COR_HW], [-H, y, -COR_HW],
      [0, 0, 1], [-H / t, 0, H / t, 0, H / t, COR_D / t, -H / t, COR_D / t], SPLIT_X, 1, CW);
    return finish(g, true);
  }

  /* 苔の層：地面のすぐ上。土との境は作らない（alpha が連続に変わるだけ） */


  function geoRails() {
    var g = GBuf(), H = GND_HALF, s, zc, i;
    for (i = 0; i < 2; i++) {
      zc = (i === 0 ? 1 : -1) * GAUGE / 2;
      s = RAIL_W / 2;
      quadSX(g, [-H, G_Y, zc - s], [H, G_Y, zc - s], [H, G_Y, zc + s], [-H, G_Y, zc + s],
        [0, 1, 0], [-H / 0.6, 0, H / 0.6, 0, H / 0.6, 1, -H / 0.6, 1], SPLIT_X, CW);
      quadSX(g, [-H, G_Y - RAIL_H, zc + s], [H, G_Y - RAIL_H, zc + s], [H, G_Y, zc + s], [-H, G_Y, zc + s],
        [0, 0, 1], [-H / 0.6, 0, H / 0.6, 0, H / 0.6, 1, -H / 0.6, 1], SPLIT_X, CW);
      quadSX(g, [-H, G_Y - RAIL_H, zc - s], [H, G_Y - RAIL_H, zc - s], [H, G_Y, zc - s], [-H, G_Y, zc - s],
        [0, 0, -1], [-H / 0.6, 0, H / 0.6, 0, H / 0.6, 1, -H / 0.6, 1], SPLIT_X, CW);
    }
    return finish(g, true);
  }

  function geoTie() {
    var g = GBuf(), y0 = G_Y - COR_D - 0.10, y1 = G_Y - COR_D + 0.02;
    boxOpen(g, TIE_W / 2, y0, y1, TIE_L / 2, 0.6, CW);
    return finish(g, true);
  }

  /* ------------------------------------------------------------------ 下生え・灌木 */
  /* 草の房のアルファ。白を緑チャンネルで拾う（r128 の alphaMap は .g） */


  /* 灌木：丸い塊。粒を重ねて縁を割る */


  /* 一株 ＝ 直交する二枚 × 表裏。法線は全て真上（曇天なので面の向きで暗くしない） */


  /* ------------------------------------------------------------------ 根の束 */
  /* 「地表を走る根は、あるところで撚りを増し、束になり」— 幅と高さが途中で太る帯。
     線路の下は潜る（軌道は根の上を通らない）ので、軌道の縁で高さ 0 へ落とす。 */


  /* ------------------------------------------------------------------ 遠くの林 */
  /* 「苔は濃くなり、草になり、灌木になり、森になった」の最後の層。
     幾何ではなく面に描いた影絵。書庫（部品 C）の方位では伏せる。 */


  /* 書庫の方位を抜く。0 = 伏せる / 1 = 立てる */




  /* ------------------------------------------------------------------ 円盤搬送系 */
  /* 「軸受は回っていた。二・四秒に一巡。円盤の上には何も載っていなかった。」 */


  /* 軸受と、それを抱く根の襟 */


  /* ------------------------------------------------------------------ 材質 */
  var M = null, TEX = null;

  function makeTex(){return{gnrm:normalTex(256,4,101,2.80),grgh:roughTex(256,3,907,.90,.09),wnrm:normalTex(128,3,313,.55)};}

  function makeMats() {
    if (!TEX) TEX = makeTex();
    var m = {};
    m.ground = injectFog(new T.MeshStandardMaterial({
      color: cs3(U.GROUND), roughness: 0.95, metalness: 0.0,
      normalMap: TEX.gnrm, normalScale: new T.Vector2(0.075, 0.075),
      roughnessMap: TEX.grgh, vertexColors: true, side: T.FrontSide
    }), 0);
    m.rail = injectFog(new T.MeshStandardMaterial({
      color: cs3([0.472, 0.458, 0.462]), roughness: 0.30, metalness: 0.65,
      vertexColors: true, side: T.FrontSide
    }), 0);
    m.tie = injectFog(new T.MeshStandardMaterial({
      color: cs3([0.336, 0.316, 0.296]), roughness: 0.90, metalness: 0.0,
      normalMap: TEX.wnrm, normalScale: new T.Vector2(0.050, 0.050),
      vertexColors: true, side: T.FrontSide
    }), 0);
    m.sky = new T.ShaderMaterial({
      uniforms: {
        uH53SkyTop: fogU().uH53SkyTop,
        uH53SkyMid: fogU().uH53SkyMid,
        uH53SkyLow: fogU().uH53SkyLow
      },
      vertexShader: SKY_VS, fragmentShader: SKY_FS,
      side: T.BackSide, depthWrite: false, depthTest: false, fog: false
    });
    return m;
  }

  var ENV_KEYS = ['ground','rail','tie'];

  function mats() {
    if (!M) M = makeMats();
    var env = (window.CH && window.CH.ENV) ? window.CH.ENV : null;
    var k;
    for (k = 0; k < ENV_KEYS.length; k++) {
      M[ENV_KEYS[k]].envMap = env;
      M[ENV_KEYS[k]].envMapIntensity = ENV_INT;
      M[ENV_KEYS[k]].needsUpdate = true;
    }
    return M;
  }

  /* 空の勾配から等距円筒を描き PMREM へ。これが照明の八割を担う（c2 §2 一） */
  function env(renderer) {
    var w = 128, h = 128, cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var cx = cv.getContext('2d'), j, dy, c, r, g, b;
    for (j = 0; j < h; j++) {
      dy = Math.cos((j + 0.5) / h * Math.PI);        /* +1 天頂 → -1 天底 */
      c = skyJS(dy);
      r = c[0]; g = c[1]; b = c[2];
      if (dy < -0.02) {                              /* 地面からの照り返し */
        var f = Math.min(1, (-dy - 0.02) / 0.34);
        r = r + (U.GROUND[0] - r) * f * 0.40;
        g = g + (U.GROUND[1] - g) * f * 0.40;
        b = b + (U.GROUND[2] - b) * f * 0.40;
      }
      cx.fillStyle = 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')';
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
    return rt.texture;
  }

  /* ------------------------------------------------------------------ 組み立て */
  var S = null;

  function inst(geo, mat, n, log, cast) {
    var im = new T.InstancedMesh(geo, mat, n), i;
    var col = new T.Color(1, 1, 1), z = new T.Matrix4();
    z.makeScale(0, 0, 0);
    for (i = 0; i < n; i++) { im.setColorAt(i, col); im.setMatrixAt(i, z); }
    im.instanceColor.needsUpdate = true;
    im.instanceMatrix.needsUpdate = true;
    im.instanceMatrix.setUsage(T.DynamicDrawUsage);
    im.frustumCulled = false;
    im.castShadow = !!cast;
    im.receiveShadow = false;
    if (log) im.userData.h53log = log;
    return im;
  }

  /* 下生え・灌木を撒く。タイル [0, FIELD_T) を FIELD_NT 回並べる（周期は 172.8 m） */


  function build() {
    var m = mats();
    var root = new T.Group(); root.name = 'land';
    var flow = new T.Group(); flow.name = 'flow';
    var fieldsG = new T.Group(); fieldsG.name = 'fields';

    /* 空 */
    var sky = new T.Mesh(new T.SphereGeometry(1000, 24, 12), m.sky);
    sky.renderOrder = -1000; sky.frustumCulled = false;
    sky.userData.h53log = 'sky';
    root.add(sky);

    /* 地面 */
    var ground = new T.Mesh(geoGround(), m.ground);
    ground.receiveShadow = true; ground.frustumCulled = false;
    ground.userData.h53log = 'ground';
    root.add(ground);

    /* 線路 */
    var track = new T.Group(); track.name = 'track';
    var rails = new T.Mesh(geoRails(), m.rail);
    rails.frustumCulled = false; rails.userData.h53log = 'track';
    track.add(rails);
    var ties = inst(geoTie(), m.tie, TIE_N, 'track', false);
    var mt = new T.Matrix4(), i;
    for (i = 0; i < TIE_N; i++) {
      mt.makeTranslation((i - (TIE_N - 1) / 2) * TIE_P, 0, 0);
      ties.setMatrixAt(i, mt);
    }
    ties.instanceMatrix.needsUpdate = true;
    track.add(ties);
    flow.add(track);

    root.add(flow);

    /* 光（c2 §2）。主光源は空の PMREM。方向光は影を薄く出すためだけの一本 */
    var sv = new T.Vector3(SUN_DIR[0], SUN_DIR[1], SUN_DIR[2]).normalize();
    var sun = new T.DirectionalLight(ch(SUN_COL), SUN_INT);
    sun.position.set(sv.x * 300, sv.y * 300, sv.z * 300);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.012;
    sun.shadow.camera.left = -180; sun.shadow.camera.right = 180;
    sun.shadow.camera.top = 180; sun.shadow.camera.bottom = -180;
    sun.shadow.camera.near = 60; sun.shadow.camera.far = 520;
    sun.shadow.camera.updateProjectionMatrix();
    sun.target.position.set(0, G_Y, 0);
    root.add(sun); root.add(sun.target);
    var amb = new T.AmbientLight(ch(AMB_COL), AMB_INT);
    root.add(amb);

    S={root:root,flow:flow,tex:TEX};
    root.userData.parts={ground:ground,track:track,sky:sky,haze:sky,flow:flow};
    root.userData.SUN = {
      light: sun, dir: sv, color: ch(SUN_COL), intensity: SUN_INT, ambient: amb
    };
    root.userData.h53 = {
      LOOP: U.LOOP, PITCH: PITCH, COLS: LOOPCOL,
      FIELD_T: FIELD_T, EXPOSURE: EXPOSURE, ENV_INT: ENV_INT,
      LIB_AZ: LIB_AZ
    };

    tick(0);
    return root;
  }

  /* ------------------------------------------------------------------ 流れ */
  var _m4 = new T.Matrix4(), _z4 = new T.Matrix4();
  _z4.makeScale(0, 0, 0);

  function tick(t,holdGround){if(!S)return;var s=holdGround?0:U.V*t;S.flow.position.x=-wrap(s,PITCH);var off=wrap(s/GTILE,1);S.tex.gnrm.offset.x=off;S.tex.grgh.offset.x=off;S.root.userData.motion14={held:!!holdGround,groundOffset:off,trackX:S.flow.position.x};}

  /* ------------------------------------------------------------------ API */
  window.CH.parts.land = {
    setNight: function(k) {
      var f = fogU(), q, names = ['Top','Mid','Low'], day = [U.SKY_TOP,U.SKY_MID,U.SKY_LOW], night = [[0.021,0.036,0.044],[0.047,0.065,0.069],[0.028,0.035,0.035]];
      for(q=0;q<3;q++) f['uH53Sky'+names[q]].value.setRGB(day[q][0]*(1-k)+night[q][0]*k,day[q][1]*(1-k)+night[q][1]*k,day[q][2]*(1-k)+night[q][2]*k);
      if(M) for(q=0;q<ENV_KEYS.length;q++) M[ENV_KEYS[q]].envMapIntensity = ENV_INT*(1-0.965*k);
      if(S){S.root.userData.SUN.light.intensity=SUN_INT*(1-0.965*k);S.root.userData.SUN.ambient.intensity=AMB_INT*(1-0.965*k);}
    },
    build: build, tick: tick, mats: mats, env: env, name: 'land',
    wrap:wrap,dims:{GROUND_Y:G_Y,GAUGE:GAUGE,TIE_P:TIE_P}

  };

})();
