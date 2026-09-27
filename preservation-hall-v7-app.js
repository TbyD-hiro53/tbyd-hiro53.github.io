/* ASSET 18 — 保存棟 v7（2026-09-27）
 *
 * 咲と陽が目覚めた棟。百六十日前後。二人はいない。二人の生活の跡だけがある。
 * 視点は五つ。どれも固定の一枚。架の脇・端末の前・戸・隅・棟。
 * 画は Cycles の一枚を光ごとの層に分けたもの。ここで時間の重みを掛けて足し、AgX（Medium High Contrast）の表で表示色にする。
 *   base（天井の面の光・戸口の外の光・架の層・端末の画面）＋ w(t)·floor（床の面の呼吸、拍 〇・七八秒）＋ tint(t)·sky（開口の空の色）
 * 動くもの：床の呼吸（0.78 s）／端末の二の行（拍ごとに書き換わる。原版の 30 通りの画面を差し替える）／開口の空の色（240 s）／
 *           戸の外の高い葉の擦れ（2.4 s ごと）／天井の点（青緑。画面上で正確に #00ddc8）
 * 物に触れると、その物の観測記録が出る。説明ではない。記録である。
 * 描画の予約は一本（共有 UI の requestFrame もここへ束ねる）。外部リクエスト 0。
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var P = 'preservation-hall-v7-';
  var BEAT = 0.78, SKY_DAY = 240, LEAF_PERIOD = 2.4;
  var ORDER = ['pod', 'term', 'door', 'corner', 'hall'];          // 釦 v0…v4
  var FLOOR_W0 = 0.021, FLOOR_W1 = 0.048;                          // 床の発光の層の重み（呼吸の底と頂）
  var SKY_A = [0xe6, 0xe2, 0xe4], SKY_B = [0xcb, 0xc7, 0xca];      // 開口の空：灰白 ↔ わずかに暗い灰（Web v5 と同じ）
  var TURQ = [0x00 / 255, 0xdd / 255, 0xc8 / 255];
  var SMALL = { dot: 1, floorPanel: 1, port: 1, bags: 1, terminal: 1 };   // 指の幅の中にあれば優先する小さい物

  var LOG = {
    podOpen: {
      t: 'THE OPEN UNIT / 架（開）',
      en: 'The lid withdrew. Nothing has been written on it since.',
      ja: '蓋は退いたまま戻らない。内側の曇りは、指で書いた字を下から消す。<br>底の液の跡は、縁のところで白く乾いている。',
      s: '2240 × 920 × 640 mm ／ 内槽 深さ 340 ／ 蓋 78° ／ 刻み なし'
    },
    podClosed: {
      t: 'THE CLOSED UNITS / 架（閉）',
      en: 'Seventy remain closed. The colour can be seen; the outline cannot.',
      ja: '内側は曇っている。うすい桃色の層が、形にならずにある。<br>区画ごとの符号の刻みは読める。開放後に刻みを付す様式はない。',
      s: '七十基 ／ 六列 × 十二段 ／ 給養系 未接続 ／ 計測系 未接続'
    },
    terminal: {
      t: 'THE FACE / 端末',
      en: 'Every submission was accepted. None was received.',
      ja: '差し戻しは零件。受け取る側の欄が、ない。<br>基準 〇・七八。二の行だけが、拍ごとに書き換わる。',
      s: '面 420 × 600 mm ／ 中心高さ 1300 ／ 更新 〇・七八秒'
    },
    port: {
      t: 'THE TWO OPENINGS / 口',
      en: 'Two a day, at body temperature. Neither is anyone’s.',
      ja: '包の口と、水の口。押すと出て、離すと止まる。<br>標準は、この棟の二件を入れずに算出されている。',
      s: '包の口 260 × 120 ／ 水の口 100 × 100 ／ 高さ 300'
    },
    floorPanel: {
      t: 'THE FLOOR SECTION / 床の一区画',
      en: 'It opens when pressed and closes after a while.',
      ja: '包の口と同じ様式。窪みの床にあり、目地の輪郭だけが残る。<br>落ちたものは、目地へ引かれてなくなる。',
      s: '500 × 500 mm ／ 窪みの床の中'
    },
    wash: {
      t: 'THE RECESS / 洗浄',
      en: 'Water at the temperature of the body. No partition. No basin.',
      ja: '壁の一区画が、他より少しへこんでいる。そこに立つと上から水が落ちる。<br>落ちたものは床の目地へ引かれて、なくなる。',
      s: '開口 1400 × 2400 ／ 奥行 900 ／ 仕切り なし ／ 戸 なし'
    },
    bags: {
      t: 'THE TWO PACKETS / 包',
      en: 'Two, at the wall. One carries a mark made with a nail.',
      ja: '手に取ると体温より少しあたたかい。端を裂くと中は液で、匂いも味もない。<br>片方の端にだけ、爪の小さな凹みがある。',
      s: '160 × 50 × 100 mm ／ 二包 ／ 配給 日次'
    },
    root: {
      t: 'THE ROOT / 根',
      en: 'It did not break in. It is part of the surface.',
      ja: '壁の途中から入って、天井へ抜けている。<br>割って入っているのではない。面の一部である。',
      s: '径 600 mm ／ 壁 x=+5.4・高さ 5200 から天井 9600 へ'
    },
    opening: {
      t: 'THE OPENING / 天井の開口',
      en: 'The light has no direction. The sky beyond is overcast.',
      ja: '面そのものが光る天井に、一箇所だけ外がある。<br>開口から落ちる光は、いつもと同じ速さで色を変える。',
      s: '2400 × 1600 mm ／ 曇天'
    },
    dot: {
      t: 'THE POINT / 点',
      en: 'It does not blink. It does not go out.',
      ja: '視野の端に青緑の点がひとつ。明滅も消えもしない。<br>光が弱くなっても、はじめと同じ強さで点っている。',
      s: '径 12 mm ／ 天井 ／ 六列三段の架の上'
    },
    door: {
      t: 'THE DOOR / 戸',
      en: 'Unlocked from the first day. Open since the twenty-ninth.',
      ja: '押したら開いた。鍵はなく、閉じてもいない。<br>その日から閉めていない。開放の期間、二百十日。',
      s: '920 × 2100 mm ／ 外へ 96° で止まっている'
    },
    corner: {
      t: 'THE CORNER / 隅',
      en: 'Six shells that fit no one. Hair that was cut with one of them.',
      ja: '合わない補装が六つ。切った髪を、その横に小さく置いた。<br>百の包の山は、三日前に尽きている。',
      s: '補装 380 × 130/110 mm ／ 六つ ／ 髪 径 140'
    },
    forest: {
      t: 'THE FOREST / 森',
      en: 'The trunks let light through. The colour is near turquoise, and is not turquoise.',
      ja: '戸から根の道までが二十歩ほど。道の先は見えるところまでで百八十歩。<br>幹の列の奥で、円いものがゆっくり一巡している。何も載っていない。',
      s: '根の道 幅 1400 ／ 円盤 一巡 二・四秒'
    },
    floor: {
      t: 'THE FLOOR / 床',
      en: 'The temperature of the body. Something regular comes through it.',
      ja: '冷たくなかった。<br>浅い。押しては返す。速い。〇・七八。',
      s: '11.0 × 40.0 m ／ 目地 900 ピッチ ／ 拍 〇・七八秒'
    },
    hall: {
      t: 'THE HALL / 棟',
      en: 'Pale, without seam or stain. The light comes from the surface itself.',
      ja: '三百歩あれば、部屋の端まで行ける。段は十二。奥へ向かって上がる。<br>壁ごしに、もっと遅いものが一巡してはまた来る。二・四。',
      s: '11.0 × 40.0 × 9.6 m ／ 十二段 ／ 保存架 七十二 ／ 開放 二'
    }
  };

  var meta = null, gl = null, prog = null, U = {}, lut = null, ready = false, raf = 0;
  var views = {}, cur = null, want = 'pod', station = 0;
  var clock = { t: 0, last: null };
  var crop = { x: 0, y: 0, w: 1, h: 1 };
  var screenState = 0, screenBeat = -1, seed = 53;

  // ─────────────────────────── 共有 UI（旧版と同じ面）
  var cv = $('c');
  $('panel').hidden = true;
  var liquid = new H53LiquidHost({ source: cv, requestFrame: schedule, surfaces: [{ selector: '#back,#views button', kind: 'control' }, { selector: '#panel', kind: 'panel' }, { selector: '#px', kind: 'control', parent: '#panel' }] });
  window.__h53Liquid = liquid;
  var liquidMenu = new H53LiquidMenu(liquid, { top: true, hideSelector: '#back,#hud,#views' });

  function fail(e) { window.dispatchEvent(new CustomEvent('h53-display-error', { detail: (e && e.message) || String(e) })); }

  // ─────────────────────────── 読み込み（数値の画像なので色の変換をかけない）
  function loadImage(src) {
    var viaImg = function () { return new Promise(function (ok, ng) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ng(new Error('読み込めませんでした：' + src)); }; i.src = src; }); };
    if (typeof createImageBitmap !== 'function') return viaImg();
    return fetch(src).then(function (r) { if (!r.ok) throw new Error('読み込めませんでした：' + src + ' ' + r.status); return r.blob(); })
      .then(function (b) { return createImageBitmap(b, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' }).catch(viaImg); });
  }
  function tex(img, linear) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    var f = linear ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  var BLACK = null;
  function black() { if (!BLACK) { BLACK = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, BLACK); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0])); } return BLACK; }

  // ─────────────────────────── 合成
  var VS = 'attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
  var FS = [
    'precision highp float;varying vec2 v;',
    'uniform sampler2D tBase,tFloor,tSky,tScreen,tLeaf,tLut;',
    'uniform vec3 k;uniform vec2 master;uniform vec4 crop;uniform float wFloor;uniform vec3 skyTint;uniform float expo;',
    'uniform vec4 scrRect;uniform vec2 scrTile;uniform vec2 scrAtlas;uniform float scrOn;',
    'uniform float leafOn,leafT,leafAmp;uniform vec3 dotP;uniform float seed;',
    'vec3 dec(vec3 y,float kk){y=min(y,vec3(254./255.));vec3 t=y*y;return kk*t/(1.-t);}',
    'vec3 agx(vec3 c){vec3 p=clamp(log2(vec3(1.)+1024.*max(c,vec3(0.)))/19.,0.,1.)*63.;',
    ' float b0=floor(p.z),b1=min(b0+1.,63.),f=p.z-b0;',
    ' vec2 o0=vec2(mod(b0,8.),floor(b0/8.))*64.,o1=vec2(mod(b1,8.),floor(b1/8.))*64.;',
    ' vec3 c0=texture2D(tLut,(o0+p.xy+.5)/512.).rgb,c1=texture2D(tLut,(o1+p.xy+.5)/512.).rgb;return mix(c0,c1,f);}',
    'float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233))+seed)*43758.5453);}',
    'void main(){vec2 p=crop.xy+v*crop.zw;vec2 uv=p/master;',
    // 戸の外の高い葉の擦れ：一定の間隔で来る。立ち上がり速く、ゆっくり収まる。葉の範囲だけ、絵を一画素ほどずらす
    ' if(leafOn>.5){float m=texture2D(tLeaf,uv).r;float ph=fract(leafT/' + LEAF_PERIOD.toFixed(2) + ');float g=smoothstep(0.,.1,ph)*exp(-3.2*ph);',
    '  vec2 w=vec2(sin(leafT*2.3+uv.y*190.+uv.x*70.),cos(leafT*1.9+uv.x*160.-uv.y*40.));uv+=w*leafAmp/master*m*(.25+.75*g);}',
    ' vec3 c=dec(texture2D(tBase,uv).rgb,k.x);',
    // 端末の二の行：画面の範囲は、いまの状態の瓦で置き換える
    ' vec2 q=(p-scrRect.xy)/scrRect.zw;if(scrOn>.5&&q.x>=0.&&q.y>=0.&&q.x<1.&&q.y<1.)c=dec(texture2D(tScreen,(scrTile+q*scrRect.zw)/scrAtlas).rgb,k.x);',
    ' c+=wFloor*dec(texture2D(tFloor,uv).rgb,k.y)+skyTint*dec(texture2D(tSky,uv).rgb,k.z);',
    // 周辺のわずかな減光（写真の減光。画面の四隅で 1 割弱）
    ' vec2 sc=v*2.-1.;sc.x*=crop.z/crop.w;float r2=dot(sc,sc)/(1.+crop.z*crop.z/(crop.w*crop.w));c*=1.-.09*smoothstep(.15,1.,r2);',
    ' vec3 o=agx(c*expo);',
    // 天井の点：画面上で正確に #00ddc8。半径は実寸（dot.z、原版の画素）と画面の一画素の大きい方
    ' if(dotP.z>0.){float d=length(p-dotP.xy);float r=dotP.z;o=mix(o,vec3(' + TURQ.map(function (x) { return x.toFixed(4); }).join(',') + '),max(1.-smoothstep(r*.6,r,d),.35*(1.-smoothstep(r,r*4.,d))));}',
    ' o+=(hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(o,1.);}'
  ].join('\n');

  function shader(type, src) { var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; }

  function setupGL() {
    gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL を使えません');
    prog = gl.createProgram(); gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var a = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    ['tBase', 'tFloor', 'tSky', 'tScreen', 'tLeaf', 'tLut', 'k', 'master', 'crop', 'wFloor', 'skyTint', 'expo', 'scrRect', 'scrTile', 'scrAtlas', 'scrOn', 'leafOn', 'leafT', 'leafAmp', 'dotP', 'seed'].forEach(function (u) { U[u] = gl.getUniformLocation(prog, u); });
    ['tBase', 'tFloor', 'tSky', 'tScreen', 'tLeaf', 'tLut'].forEach(function (u, i) { gl.uniform1i(U[u], i); });
    gl.uniform1f(U.expo, Math.pow(2, meta.exposure));
  }

  // 視点の画（初めて開くときに読む。先読みはしない）
  function loadView(key) {
    if (views[key]) return views[key].promise;
    var m = meta.views[key], V = { key: key, m: m };
    var files = [m.layers.base.file, m.layers.floor.file, m.layers.sky.file, m.ids].concat(m.screenAtlas ? [m.screenAtlas.file] : []).concat(m.leaf ? [m.leaf] : []);
    V.promise = Promise.all(files.map(function (f) { return loadImage(f); })).then(function (im) {
      V.base = tex(im[0], true); V.floor = tex(im[1], true); V.sky = tex(im[2], true);
      var c = document.createElement('canvas'); c.width = im[3].width; c.height = im[3].height;
      var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im[3], 0, 0);
      var px = x.getImageData(0, 0, c.width, c.height).data; V.ids = new Uint8Array(c.width * c.height);
      for (var i = 0; i < V.ids.length; i++) V.ids[i] = px[i * 4];
      var n = 4;
      if (m.screenAtlas) V.screen = tex(im[n++], false);
      if (m.leaf) V.leaf = tex(im[n++], true);
      im.forEach(function (b) { if (b.close) b.close(); });
      V.ready = true; return V;
    });
    views[key] = V; return V.promise;
  }

  function bindView(V) {
    var m = V.m, L = m.layers;
    [[V.base, 0], [V.floor, 1], [V.sky, 2], [V.screen || black(), 3], [V.leaf || black(), 4], [lut, 5]].forEach(function (e) { gl.activeTexture(gl.TEXTURE0 + e[1]); gl.bindTexture(gl.TEXTURE_2D, e[0]); });
    gl.uniform3f(U.k, L.base.k, L.floor.k, L.sky.k);
    gl.uniform2f(U.master, m.width, m.height);
    var s = m.screenAtlas;
    gl.uniform1f(U.scrOn, s ? 1 : 0);
    if (s) { gl.uniform4f(U.scrRect, s.rect[0], s.rect[1], s.rect[2], s.rect[3]); gl.uniform2f(U.scrAtlas, s.cols * s.rect[2], Math.ceil(s.n / s.cols) * s.rect[3]); }
    gl.uniform1f(U.leafOn, V.leaf ? 1 : 0); gl.uniform1f(U.leafAmp, 0.9);
  }

  // ─────────────────────────── 時間の重み
  function floorW(t) {                       // 押しては返す：立ち上がり速く（0.08 拍）、戻りは遅い（Web v5 と同じ形）
    var p = (t % BEAT) / BEAT, k = p < 0.08 ? p / 0.08 : Math.exp(-(p - 0.08) * 4.35);
    return FLOOR_W0 + (FLOOR_W1 - FLOOR_W0) * k;
  }
  function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function skyTint(t) {                      // 240 s で灰白 ↔ わずかに暗い灰。原版の空の面の色（灰白）を 1 とした比
    var k = 0.5 - 0.5 * Math.cos(Math.PI * 2 * t / SKY_DAY);
    return [0, 1, 2].map(function (i) { var a = lin(SKY_A[i]), b = lin(SKY_B[i]); return (a + (b - a) * k) / a; });
  }
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  function render() {
    if (!cur || !cur.ready) return;
    var t = clock.t, m = cur.m;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform4f(U.crop, crop.x, crop.y, crop.w, crop.h);
    gl.uniform1f(U.wFloor, floorW(t));
    var s = skyTint(t); gl.uniform3f(U.skyTint, s[0], s[1], s[2]);
    if (m.screenAtlas) {                       // 二の行：拍ごとに 30 通りのどれかへ（原版の書き換えと同じ範囲）
      var b = Math.floor(t / BEAT);
      if (b !== screenBeat) { screenBeat = b; screenState = b <= 0 ? 0 : 1 + Math.floor(rnd() * 30); }
      var sa = m.screenAtlas; gl.uniform2f(U.scrTile, (screenState % sa.cols) * sa.rect[2], Math.floor(screenState / sa.cols) * sa.rect[3]);
    }
    gl.uniform1f(U.leafT, t);
    if (m.dot) { var onePx = crop.w / gl.drawingBufferWidth; gl.uniform3f(U.dotP, m.dot[0], m.dot[1], Math.max(0.9 * onePx, 0.6)); } else gl.uniform3f(U.dotP, 0, 0, 0);
    gl.uniform1f(U.seed, (t * 7.13) % 10);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ─────────────────────────── 切り出し：正方形の原版から画面の縦横比の最大の矩形。横長は中央、縦長は視点ごとの中心へ
  function layout() {
    var vw = innerWidth, vh = innerHeight, a = vw / vh, key = cur ? cur.key : want, m = meta ? meta.views[key] : null;
    var W = m ? m.width : 1, H = m ? m.height : 1;
    if (a >= W / H) { crop.w = W; crop.h = W / a; crop.x = 0; crop.y = (H - crop.h) / 2; }
    else { crop.h = H; crop.w = H * a; var c = (m ? m.portraitCx : 0.5) * W; crop.x = Math.min(W - crop.w, Math.max(0, c - crop.w / 2)); crop.y = 0; }
    var pv = $('preview');
    if (pv && m) { var k = vw / crop.w; pv.style.width = (W * k) + 'px'; pv.style.transform = 'translate(' + (-crop.x * k) + 'px,' + (-crop.y * k) + 'px)'; }
    if (!gl) return;
    var dpr = Math.min(devicePixelRatio || 1, 2), cw = Math.max(1, Math.round(Math.min(vw * dpr, crop.w * 1.5))), ch = Math.max(1, Math.round(cw * vh / vw));
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
  }

  // ─────────────────────────── 触れる（的は出さない。触れた位置の物を開く）
  function pick(clientX, clientY) {
    if (!cur || !cur.ready) return null;
    var r = cv.getBoundingClientRect(), W = cur.m.width, H = cur.m.height, keys = meta.keys, ids = cur.ids;
    var mx = crop.x + (clientX - r.left) / r.width * crop.w, my = crop.y + (clientY - r.top) / r.height * crop.h;
    var at = function (x, y) { x = Math.floor(x); y = Math.floor(y); return x < 0 || y < 0 || x >= W || y >= H ? 0 : ids[y * W + x]; };
    var hit = keys[at(mx, my)];
    if (SMALL[hit]) return hit;
    // 点：画素より小さいので、指の幅の中にあれば点
    var rad = 22 * crop.w / r.width;
    if (cur.m.dot && Math.hypot(mx - cur.m.dot[0], my - cur.m.dot[1]) < rad) return 'dot';
    var step = Math.max(1, rad / 8), best = null, bd = 1e9;
    for (var dy = -rad; dy <= rad; dy += step) for (var dx = -rad; dx <= rad; dx += step) {
      var d = dx * dx + dy * dy; if (d > rad * rad) continue;
      var kk = keys[at(mx + dx, my + dy)]; if (SMALL[kk] && d < bd) { best = kk; bd = d; }
    }
    if (best) return best;
    return hit && hit !== 'none' ? hit : null;
  }

  var openKey = null, lastPointer = null, closing = false;
  function openPanel(key) {
    if (liquid.blocked || performance.now() < liquid.blockedUntil) return;
    var d = LOG[key]; if (!d) return;
    if (openKey === key && $('panel').classList.contains('on')) { closePanel(); return; }
    openKey = key;
    $('pt').textContent = d.t; $('pe').textContent = d.en; $('pj').innerHTML = d.ja; $('ps').textContent = d.s;
    liquidMenu.open(false); $('panel').classList.add('on'); liquid.ui.open('#panel', lastPointer || liquidMenu.toggle); lastPointer = null;
    liquid.lock($('panel')); $('px').focus(); $('panel').setAttribute('aria-hidden', 'false'); schedule();
  }
  function closePanel() {
    if (!liquid || !liquid.blocked || closing) return; closing = true;
    liquid.ui.close('#panel', function () { openKey = null; closing = false; $('panel').classList.remove('on'); $('panel').setAttribute('aria-hidden', 'true'); liquid.unlock(); cv.focus(); schedule(); });
    schedule();
  }

  function goStation(i) {
    if (liquid && liquid.blocked) return;
    station = i; want = ORDER[i];
    for (var k = 0; k < ORDER.length; k++) { var b = $('v' + k); b.className = k === i ? 'on' : ''; b.setAttribute('aria-pressed', String(k === i)); }
    closePanel();
    var m = meta.views[want], pv = $('preview');
    if (!views[want] || !views[want].ready) { pv.src = m.preview; pv.hidden = false; }
    layout();
    loadView(want).then(function (V) { if (V.key !== want) return; cur = V; bindView(V); layout(); pv.hidden = true; schedule(); }).catch(fail);
  }

  function bind() {
    var down = null;
    cv.addEventListener('pointerdown', function (e) { if (e.isPrimary) down = { x: e.clientX, y: e.clientY }; });
    cv.addEventListener('pointerup', function (e) {
      if (!e.isPrimary || !down || liquid.blocked || performance.now() < liquid.blockedUntil) { down = null; return; }
      var moved = Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y); down = null;
      if (moved > 10) return;
      var key = pick(e.clientX, e.clientY);
      if (key) { lastPointer = { x: e.clientX, y: e.clientY }; openPanel(key); }
    });
    for (var k = 0; k < ORDER.length; k++) (function (i) { $('v' + i).addEventListener('click', function () { goStation(i); }); })(k);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
    var xb = $('px');
    xb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); closePanel(); });
    xb.addEventListener('touchend', function (e) { e.preventDefault(); e.stopPropagation(); closePanel(); }, false);
    addEventListener('resize', function () { layout(); schedule(); });
    if (window.visualViewport) visualViewport.addEventListener('resize', function () { layout(); schedule(); });
    document.addEventListener('visibilitychange', function () { clock.last = null; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule(); });
  }

  // ─────────────────────────── 一本の描画ループ（床の呼吸があるので止まらない。非表示のあいだだけ止める）
  function frame(now) {
    raf = 0; if (!ready || document.hidden) return;
    if (clock.last !== null) clock.t += Math.min(0.1, (now - clock.last) / 1000); clock.last = now;
    render(); liquid.afterRender(performance.now());
    schedule();
  }
  function schedule() { if (!raf && ready && !document.hidden) raf = requestAnimationFrame(frame); }

  function start() {
    fetch(P + 'meta.json').then(function (r) { if (!r.ok) throw new Error('meta ' + r.status); return r.json(); }).then(function (m) {
      meta = m; setupGL(); bind();
      return loadImage(meta.lut).then(function (im) { lut = tex(im, true); if (im.close) im.close(); });
    }).then(function () {
      ready = true; goStation(0); schedule();
      window.__H53V7 = { clock: clock, crop: crop, pick: pick, station: goStation, views: views, meta: function () { return meta; }, setTime: function (t) { clock.t = t; }, open: openPanel, render: render };
    }).catch(fail);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
