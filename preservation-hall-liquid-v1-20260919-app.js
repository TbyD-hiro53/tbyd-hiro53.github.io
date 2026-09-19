
/* ASSET 18 — 保存棟 / 本体
 *
 * 咲と陽が目覚めた棟。百六十日前後。二人はいない。二人の生活の跡だけがある。
 *
 * 立ち場所は三つ。足は動かない。首だけが回る。
 *   一　架の脇・床の高さ   眼高 0.32。六列三段の架の脇。目を開けた者の目
 *   二　端末の前           眼高 1.55。面と、口と、包を前に
 *   三　戸                 眼高 1.10。座った者の高さ。外を向けば森、振り向けば棟の全長
 *
 * 物に触れると、その物の観測記録が出る。説明ではない。記録である。
 * 拍 〇・七八秒は床の面の明るさの浅い呼吸として出す。音でも揺れでもない。
 * Three.js r128 / 単一 IIFE / 外部リクエスト 0
 */
(function () {
  'use strict';

  var PUMP = 0.78;
  var C_PALE = 0xf2dbe9;

  // ─────────────────────────── 配置（m）。設計書 b3 §2（雛壇）
  var IX = 5.4, IZ = 19.8, HALL_H = 9.6;
  var WALL_W_X = -IX;                        // 端末・口・洗浄・包のある長辺（x=-5.4）
  // 段 k：床 y = 0.42(k-1)、z 範囲 [-15.8+2.96(k-1), -15.8+2.96k]。前庭は z=-19.8…-15.8（y=0）
  var TERM_STEP = 3, TERM_Z = -7.6;          // 端末は段 3（床 y=0.84）、z=-7.6
  var WASH_STEP = 4, WASH_Z = -5.4;          // 洗浄は段 4（床 y=1.26）
  var WASH_HOLE_W = 1.43, WASH_HOLE_H = 2.415;   // アルコーブの開口（部品 C v3 の指定）
  var CORNER = [-IX, 0, -IZ];                // 前庭の左隅（戸のある短辺）

  var renderer, scene, camera, clock, t0 = 0;
  var roots = {}, pickables = [];
  var station = 0;

  // yaw 0 ＝ -z を向く。sin(yaw) が +x
  // 一 は六列三段の開いた架の中（段 3 の床 0.84 ＋ 内槽の底 0.282）。仰向けに目を開けた高さ
  var ST = [
    { key: 'pod', label: '架の脇',
      pos: [4.93, 1.24, -9.70], yaw: 3.1416, pit: 0.12, up: 0.30 },   // 段 3 の床（0.84）＋眼高 0.32。壁ぎわの通路。縁を越えて落ちた者の目
    { key: 'term', label: '端末の前',
      pos: [-4.34, 2.39, -7.60], yaw: -1.5708, pit: -0.10, up: 0.60 },
    { key: 'door', label: '戸',
      pos: [0.0, 1.10, -18.60], yaw: 0.0, pit: 0.02, up: 0.50 }
  ];
  var yaw = ST[0].yaw, pit = ST[0].pit, zoom = 1, pitAdj = 0;
  var eye = ST[0].pos.slice();
  var drag = false, px = 0, py = 0, moved = 0;

  // ─────────────────────────── 記録。説明ではない（設計書 §7）
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

  function tag(obj, key) {
    obj.userData.h53 = key;
    obj.traverse(function (o) { if (o.isMesh) pickables.push(o); });
    roots[key] = obj;
  }
  function tagOnly(obj, key) { obj.userData.h53 = key; }

  // ─────────────────────────── 環境マップ。天井が光る棟の中。上は淡白、下は床の淡白より僅かに暗い
  function makeEnv() {
    var c = document.createElement('canvas'); c.width = 64; c.height = 32;
    var x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 32);
    g.addColorStop(0.00, '#d1c8cd');
    g.addColorStop(0.48, '#ada6ab');
    g.addColorStop(0.55, '#827e82');
    g.addColorStop(1.00, '#67646a');
    x.fillStyle = g; x.fillRect(0, 0, 64, 32);
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var env = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
    return env;
  }

  // 西の長辺に洗浄のへこみの切り欠きを開ける（部品 C の面が縁の外まで回って境目を覆う）
  // 壁 wall-w は PlaneGeometry(ID, HALL_H) を rotation.y=+90° で置いてある。板の局所 +x は world -z
  function cutWashHole(wall, y0) {
    var hz = IZ, hy = HALL_H;
    var sh = new THREE.Shape();
    sh.moveTo(-hz, 0); sh.lineTo(hz, 0); sh.lineTo(hz, hy); sh.lineTo(-hz, hy); sh.closePath();
    var hole = new THREE.Path();
    var z0 = WASH_Z - WASH_HOLE_W / 2, z1 = WASH_Z + WASH_HOLE_W / 2;
    hole.moveTo(-z1, y0); hole.lineTo(-z0, y0);
    hole.lineTo(-z0, y0 + WASH_HOLE_H); hole.lineTo(-z1, y0 + WASH_HOLE_H); hole.closePath();
    sh.holes.push(hole);
    var g = new THREE.ShapeGeometry(sh);
    g.translate(0, -hy / 2, 0);                       // PlaneGeometry と同じ中心へ
    var uv = g.attributes.uv, p = g.attributes.position, i;
    for (i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * hz) + 0.5, (p.getY(i) + hy / 2) / hy);
    uv.needsUpdate = true;
    wall.geometry.dispose();
    wall.geometry = g;
  }

  // ─────────────────────────── 組み立て
  function assemble() {
    var env = makeEnv();

    // F 棟
    H53.hall.setEnv(env);
    var hall = H53.hall.build();
    var HP = H53.hall.parts();
    cutWashHole(HP['wall-w'], H53.hall.stepY(WASH_STEP));
    tag(hall, 'hall');
    tagOnly(HP.floor, 'floor');
    tagOnly(HP.door, 'door');
    tagOnly(HP['root-path'], 'forest'); tagOnly(HP.trunks, 'forest'); tagOnly(HP.disc, 'forest');
    tagOnly(HP.ground, 'forest'); tagOnly(HP.sky, 'forest');
    tagOnly(HP.canopy, 'forest'); tagOnly(HP.undergrowth, 'forest');
    if (HP.backdrop) tagOnly(HP.backdrop, 'forest');
    tagOnly(HP.steps, 'floor');
    scene.add(hall);

    // A 架（world 座標）
    H53.pods.setEnv(env);
    // 段 k の床に置く。枕側（+z）の端を段の奥端から 0.10 手前に。列は x=-4.0…+4.0（ピッチ 1.60）
    var pods = H53.pods.build(function (c, r) {
      var zr = H53.hall.stepZ(r);
      return [-4.0 + 1.6 * (c - 1), H53.hall.stepY(r), zr[1] - 0.10 - 1.12];
    });
    tag(pods, 'podClosed');
    pods.children.forEach(function (o) { if (o.name.indexOf('pod-open') === 0) tagOnly(o, 'podOpen'); });
    scene.add(pods);

    // B 端末。局所：壁 z=0・部屋 +z → world：壁 x=-5.4・部屋 +x。局所 +x は world -z（戸の側）
    H53.term.setEnv(env);
    var term = H53.term.build();
    term.position.set(WALL_W_X, H53.hall.stepY(TERM_STEP), TERM_Z);
    term.rotation.y = Math.PI / 2;
    tag(term, 'terminal');
    scene.add(term);

    // C 口と包。端末と同じ局所系
    H53.ports.setEnv(env);
    var ports = H53.ports.build();
    ports.position.set(WALL_W_X, H53.hall.stepY(TERM_STEP), TERM_Z);
    ports.rotation.y = Math.PI / 2;
    var PP = ports.userData.parts;
    tag(ports, 'port');
    // 洗浄だけは段 4 の床の上。局所 x=-3.0 に作られているので、段 4 の中心 z へ置き直す
    // 局所 +x は world -z（rotation.y=+90° で (x,y,z)→(z,y,-x)）。洗浄の芯は局所 x=-3.0 にある。
    // 目標の world z=-5.4 ＝ 局所 x = TERM_Z - WASH_Z = -2.2 → 差 +0.8
    // アルコーブ。局所原点＝開口の芯（床 y=0・壁面 z=0）。局所 +x は world -z
    PP.wash.position.set(TERM_Z - WASH_Z,
      H53.hall.stepY(WASH_STEP) - H53.hall.stepY(TERM_STEP), 0);
    tagOnly(PP.wash, 'wash');
    var wp = PP.wash.getObjectByName('wash-panel');
    if (wp) tagOnly(wp, 'floorPanel');
    tagOnly(PP.bag1, 'bags'); tagOnly(PP.bag2, 'bags');
    scene.add(ports);

    // D 根と天井（world 座標）
    H53.root.setEnv(env);
    var rl = H53.root.build();
    var RP = rl.userData.parts;
    tag(rl, 'root');
    tagOnly(RP.opening, 'opening'); tagOnly(RP.sky, 'opening');
    tagOnly(RP.dot, 'dot'); tagOnly(RP.dotHalo, 'dot');
    scene.add(rl);

    // E 隅。局所原点＝隅の頂点、+x/+z へ広がる
    H53.corner.setEnv(env);
    var corner = H53.corner.build();
    corner.position.set(CORNER[0], CORNER[1], CORNER[2]);
    tag(corner, 'corner');
    scene.add(corner);

    // Quiet mineral surfaces, satin ceramic pods and softly reflective accessories.
    // Palette constants are authored in sRGB; explicitly decode only the retuned materials.
    function tone(m,hex,rough,env,emit){
      m.color.setHex(hex).convertSRGBToLinear();m.roughness=rough;m.envMapIntensity=env;
      if(m.emissive){m.emissive.copy(m.color);m.emissiveIntensity=emit||0;}
    }
    var HM=H53.hall.M;
    tone(HM.wall,0xbdb3b8,0.88,0.30,0.012);
    tone(HM.ceil,0xc7bec4,0.93,0.22,0.22);
    tone(HM.riser,0xaaa1a8,0.82,0.26,0.010);
    tone(HM.floor,0xaaa2a6,0.84,0.34,0.012);
    tone(HM.door,0xbdb3b8,0.72,0.34,0);
    HM.floor.normalScale.set(0.55,0.55);
    tone(H53.pods.M.body,0xdec7d5,0.34,0.60,0);
    tone(H53.pods.M.lid,0xcebac9,0.46,0.38,0.012);
    tone(H53.pods.M.lidOpen,0xd5c2ce,0.38,0.40,0.008);
    H53.pods.M.lid.clearcoat=0.24;H53.pods.M.lidOpen.clearcoat=0.28;
    H53.pods.M.line.emissiveIntensity=0.025;
    term.traverse(function(o){if(!o.isMesh)return;
      if(o.name==='bezel')tone(o.material,0xbdb3b8,1,0.30,0.012);
      if(o.name==='screen'){o.material.envMapIntensity=0.30;o.material.clearcoat=0.32;}
    });
    var seen=new Set();
    ports.traverse(function(o){if(!o.isMesh)return;var m=o.material;if(seen.has(m))return;seen.add(m);
      if(m.isMeshStandardMaterial){
        if(m.transparent)tone(m,0xcbb4c0,0.45,0.40,0);
        else if(m.normalMap)tone(m,0xbdb3b8,0.62,0.32,0.012);
      }
    });
    rl.traverse(function(o){if(!o.isMesh)return;
      if(o.name==='root')tone(o.material,0xa69a94,0.86,0.30,0);
      if(o.name==='reveal'||o.name==='collar')tone(o.material,0xc7bec4,0.93,0.22,0.22);
    });
    seen.clear();corner.traverse(function(o){if(!o.isMesh)return;var m=o.material;
      if(seen.has(m))return;seen.add(m);
      if(m.isMeshPhysicalMaterial)tone(m,0xd2c0cc,0.31,0.55,0);
      else if(m.isMeshStandardMaterial&&m.roughness>0.7)tone(m,0xb3a5a6,0.90,0.22,0);
    });

  }

  // ─────────────────────────── 場
  function init() {
    var cv = document.getElementById('c');document.getElementById('panel').hidden=true;liquid=new H53LiquidHost({source:cv,surfaces:[{selector:'#back,#views button',kind:'control'},{selector:'#panel',kind:'panel'},{selector:'#px',kind:'control',parent:'#panel'}]});window.__h53Liquid=liquid;liquidMenu=new H53LiquidMenu(liquid,{top:true,hideSelector:'#back,#hud,#views'});
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: !window.matchMedia('(pointer: coarse)').matches });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.80;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(H53.hall.C_SKY);
    scene.fog = new THREE.Fog(H53.hall.C_SKY, 34, 130);
    camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.05, 160);
    camera.__baseFov = 56;

    assemble();

    // 光は天井の面から降る。方向を持たない光を、弱い環境光と、ほぼ真上からの一灯で近似する
    scene.add(new THREE.AmbientLight(0xf4ecf0, 0.30));
    var top = new THREE.DirectionalLight(0xfaf3f6, 0.42);
    top.position.set(1.2, 12.0, -2.0);
    top.target.position.set(0, 0, 0);
    top.castShadow = true;
    top.shadow.mapSize.width = 2048; top.shadow.mapSize.height = 2048;
    top.shadow.camera.near = 2.0; top.shadow.camera.far = 30.0;
    top.shadow.camera.left = -6.2; top.shadow.camera.right = 6.2;
    top.shadow.camera.top = 21.0; top.shadow.camera.bottom = -21.0;
    top.shadow.bias = -0.0003; top.shadow.normalBias = 0.02;
    scene.add(top); scene.add(top.target);
    var side = new THREE.DirectionalLight(0xe8e2e6, 0.10);
    side.position.set(-6.0, 4.0, 6.0);
    scene.add(side);
    // 森の側から戸口へ入る曇りの光
    var outside = new THREE.DirectionalLight(0xdcdadc, 0.16);
    outside.position.set(2.0, 8.0, -40.0);
    outside.target.position.set(0, 1.0, -19.0);
    scene.add(outside); scene.add(outside.target);

    clock = new THREE.Clock();
    bind(cv);
    onResize();
    window.addEventListener('resize', onResize, false);
    goStation(0);
    animate();
  }

  // ─────────────────────────── 触れる
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(cx, cy) {
    var r = renderer.domElement.getBoundingClientRect();
    ndc.x = ((cx - r.left) / r.width) * 2 - 1;
    ndc.y = -((cy - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(pickables, false);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      while (o) {
        if (o.userData && o.userData.h53) return o.userData.h53;
        o = o.parent;
      }
    }
    return null;
  }

  var openKey = null,liquid,liquidMenu,lastPointer=null,closing=false;
  function openPanel(key) {if(liquid.blocked||performance.now()<liquid.blockedUntil)return;
    var d = LOG[key];
    if (!d) return;
    if (openKey === key &&
        document.getElementById('panel').classList.contains('on')) { closePanel(); return; }
    openKey = key;
    document.getElementById('pt').textContent = d.t;
    document.getElementById('pe').textContent = d.en;
    document.getElementById('pj').innerHTML = d.ja;
    document.getElementById('ps').textContent = d.s;
    liquidMenu.open(false);drag=false;bind._d=0;document.getElementById('panel').classList.add('on');liquid.ui.open('#panel',lastPointer||liquidMenu.toggle);lastPointer=null;liquid.lock(document.getElementById('panel'));document.getElementById('px').focus();
    document.getElementById('panel').setAttribute('aria-hidden','false');
  }
  function closePanel(){if(!liquid||!liquid.blocked||closing)return;closing=true;liquid.ui.close('#panel',function(){openKey=null;closing=false;document.getElementById('panel').classList.remove('on');document.getElementById('panel').setAttribute('aria-hidden','true');liquid.unlock();document.getElementById('c').focus();});}

  function goStation(i) {if(liquid&&liquid.blocked)return;
    station = i;
    var s = ST[i];
    eye = s.pos.slice(); yaw = s.yaw;
    pitAdj = pitPad() * s.up; pit = s.pit + pitAdj; zoom = 1;
    for (var k = 0; k < ST.length; k++){var button=document.getElementById('v'+k);button.className=k===i?'on':'';button.setAttribute('aria-pressed',String(k===i));}
    closePanel();
  }

  function bind(cv) {
    function down(x, y) {if(liquid.blocked||performance.now()<liquid.blockedUntil)return; drag = true; px = x; py = y; moved = 0; }
    function move(x, y) {
      if (!drag) return;
      moved += Math.abs(x - px) + Math.abs(y - py);
      yaw -= (x - px) * 0.0042;
      pit += (y - py) * 0.0032;
      pit = Math.max(-1.20, Math.min(1.35, pit));
      px = x; py = y;
    }
    function up(x, y) {
      if (drag && moved < 8) {
        var k = pick(x, y);
        if(k){lastPointer={x:x,y:y};openPanel(k);}
      }
      drag = false;
    }
    cv.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    window.addEventListener('mouseup', function (e) { up(e.clientX, e.clientY); });
    cv.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) down(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    cv.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY);
      else if (e.touches.length === 2) {
        moved += 20;
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                           e.touches[0].clientY - e.touches[1].clientY);
        if (bind._d) zoom = Math.max(0.50, Math.min(1.25, zoom * bind._d / d));
        bind._d = d;
      }
    }, { passive: true });
    cv.addEventListener('touchend', function (e) {
      e.preventDefault();
      bind._d = 0;
      var tch = e.changedTouches && e.changedTouches[0];
      up(tch ? tch.clientX : 0, tch ? tch.clientY : 0);
    }, { passive: false });
    cv.addEventListener('wheel', function (e) {
      zoom = Math.max(0.50, Math.min(1.25, zoom * (1 + e.deltaY * 0.0011)));
      e.preventDefault();
    }, { passive: false });

    for (var k = 0; k < ST.length; k++) {
      (function (i) {
        document.getElementById('v' + i).addEventListener('click', function () { goStation(i); });
      })(k);
    }
    window.addEventListener('keydown',function(e){if(e.key==='Escape')closePanel();});
    var xb = document.getElementById('px');
    xb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation();closePanel(); });
    xb.addEventListener('touchend', function (e) { e.preventDefault(); e.stopPropagation();closePanel(); }, false);
  }

  // 縦持ちで垂直画角が基準（56°）を超えた分の半角
  function pitPad() { return Math.max(0, camera.__baseFov * Math.PI / 360 - 0.4887); }

  function onResize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // 縦持ちは画角を広げるのではなく、水平の画角を保つ（水平半角 tan = 0.3126 を基準）
    camera.__baseFov = Math.min(76, Math.max(42,
      2 * Math.atan(0.3126 / (w / h)) * 180 / Math.PI));
    var prev = pitAdj;
    pitAdj = pitPad() * ST[station].up;
    pit += pitAdj - prev;
    camera.updateProjectionMatrix();
  }

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.1);
    t0 += dt;

    H53.hall.tick(t0);     // 円盤 二・四秒 ／ 床の呼吸 〇・七八秒
    H53.term.tick(t0);     // 二の行 〇・七八秒
    H53.root.tick(t0);     // 開口の空の色

    var f = camera.__baseFov * zoom;
    if (camera.fov !== f) { camera.fov = f; camera.updateProjectionMatrix(); }

    var c = Math.cos(pit);
    camera.position.set(eye[0], eye[1], eye[2]);
    camera.lookAt(eye[0] + Math.sin(yaw) * c,
                  eye[1] + Math.sin(pit),
                  eye[2] - Math.cos(yaw) * c);
    renderer.render(scene, camera);liquid.afterRender(performance.now());
  }

  window.__H53M = {
    get renderer() { return renderer; },
    get scene() { return scene; },
    get camera() { return camera; },
    station: goStation,
    setView: function (y, p, z) { yaw = y; pit = p; zoom = z === undefined ? zoom : z; },
    setEye: function (x, y, z) { eye = [x, y, z]; },
    registerRefinedMesh: function (o, key) { o.userData.h53 = key; pickables.push(o); },
    pickAt: pick,
    open: openPanel,
    keys: function () { return Object.keys(roots); },
    setTime: function (t) { t0 = t; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else { init(); }
})();

