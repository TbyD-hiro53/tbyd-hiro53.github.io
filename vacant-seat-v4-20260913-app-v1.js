
/* ASSET 17 — The Vacant Seat v2 / 本体
 *
 * 視点は二つだけである。
 *   一　机の前に立つ    ——  訪う者の位置。会長席を正面から見る
 *   二　椅子の斜め背後  ——  座る者の位置。ただし座る者はいない
 * どちらも自在に回り込める。位置が二つなのは、この室に立ち場所が二つしかないからである。
 *
 * 物に触れると、その物の観測記録が出る。説明ではない。記録である。
 *
 * 拍 〇・七八秒。音でも光でもなく、空気の圧として——画角 ±0.22°・霧 ±3%。物は一つも揺れない。
 * Three.js r128 / 単一 IIFE / 外部リクエスト 0
 */
(function () {
  'use strict';

  var PUMP = 0.78;
  var C_PALE = 0xf2dbe9;
  var EPOCH_MS = Date.UTC(1887, 0, 1, 0, 0, 0);

  var renderer, scene, camera, clock, fog, t0 = 0;
  var roots = {}, pickables = [];
  var station = 0, seeking = false, seekT = 0, seekPaint = 0;

  // 立ち場所は二つ。どちらも足は動かない。動くのは首だけである。
  // 寄り引きは歩くのではなく、目を凝らすこと——画角で行う
  var ST = [
    { key: 'desk', label: '机の前',
      pos: [0, 1.30, 1.25], yaw: 0.0000, pit: -0.1326, up: 1.00 },
    { key: 'chair', label: '椅子の背後',
      pos: [-1.05, 1.62, -2.70], yaw: 2.7038, pit: -0.2885, up: 0.25 }
  ];
  var yaw = ST[0].yaw, pit = ST[0].pit, zoom = 1, pitAdj = 0;
  var eye = ST[0].pos.slice();
  var drag = false, px = 0, py = 0, moved = 0;

  // ─────────────────────────── 記録。説明ではない
  var LOG = {
    chair: {
      t: 'THE CHAIR / 椅子',
      en: 'Aged only in the manner of a chair that has been maintained.',
      ja: '座面に窪みはない。肘掛けに摩耗はない。床に擦れはない。<br>稜の丸みは、触れる場所も触れない場所も等しい。',
      s: '572 × 1241 × 638 mm ／ 座 520 × 506 mm ／ 稜 R8（全部材で同一）'
    },
    board: {
      t: 'THE BOARD / 表示板',
      en: 'Chairman instance: unresolved.',
      ja: '二行しか書かれていない。<br>解決される予定の欄は、どこにもない。',
      s: '507 × 150 mm ／ 窓 456 × 99 mm ／ 走査 一巡 〇・七八秒'
    },
    terminal: {
      t: 'THE TERMINAL / 決裁端末',
      en: 'One item is approved every 0.78 seconds. The first does not move.',
      ja: '承認は流れる。最上段の未決だけが流れない。<br>総件数の欄には、数字の代わりに一語が入っている。継続。',
      s: '管面 302 × 227 mm ／ 一件 〇・七八秒'
    },
    metronome: {
      t: 'THE METRONOME / メトロノーム',
      en: 'Set to seventy-seven. It does not move from it.',
      ja: '毎分七十七は〇・七七九秒。室の拍と同じである。<br>目盛りは動かせない。動かす必要が生じたことがない。',
      s: '120 × 239 mm ／ 目盛り 毎分七十七に固定 ／ 振れ 一四・〇度'
    },
    desk: {
      t: 'THE DESK / 机',
      en: 'Nothing is stored in it. Two things stand upon it.',
      ja: '一塊の削り出し。天板と脚しかない。<br>隠すための板が、一枚もない。',
      s: '1800 × 800 × 720 mm'
    },
    window: {
      t: 'THE WINDOW / 窓',
      en: 'Six lights at an equal remove. Their remove cannot be equal.',
      ja: '空に星はない。地面に相当するものは平らである。',
      s: '1720 × 800 mm'
    },
    room: {
      t: 'THE ROOM / 会長室',
      en: 'There is no sender. There is only the holding.',
      ja: '発生源の欄には該当なしと出る。送り手はいない。<br>保持だけがある。',
      s: '5200 × 6400 × 2800 mm ／ 光源 一（天井・同心四段）'
    }
  };

  function tag(obj, key) {
    obj.userData.h53 = key;
    obj.traverse(function (o) { if (o.isMesh) pickables.push(o); });
    roots[key] = obj;
  }

  // ─────────────────────────── 組み立て
  function assemble() {
    var R = H53.room;
    var env = R.makeEnv();

    R.setEnv(env);
    var room = R.room(); tag(room, 'room'); scene.add(room);
    var desk = R.desk(); tag(desk, 'desk'); scene.add(desk);

    // 窓は室の一部だが、記録は別に持つ
    room.traverse(function (o) {
      if (o.isMesh && o.geometry.type === 'PlaneGeometry' &&
          Math.abs(o.geometry.parameters.width - R.WIN_W) < 0.001) {
        o.userData.h53 = 'window';
        if (o.material) o.material.__g = true;   // 硝子は調律しない。映すのが仕事である
      }
    });

    H53.chair.setEnv(env);
    var chair = H53.chair.build();
    chair.position.set(0, 0, R.CHAIR_Z);
    tag(chair, 'chair'); scene.add(chair);

    H53.board.setEnv(env);
    var board = H53.board.build();
    board.scale.setScalar(0.85);                 // ひとまわり小さく
    board.position.set(0, R.DESK_H, R.BOARD_Z);
    tag(board, 'board'); scene.add(board);

    H53.crt.setEnv(env);
    // 管の原点は前面の中心にある。台座の底が机上へ来るまで持ち上げる
    var crt = H53.crt.build();
    crt.position.set(R.TERM_X, R.DESK_H + 0.234, R.DESK_CZ + 0.044);
    crt.rotation.y = 0.34;                       // 会長席の方を向いている
    tag(crt, 'terminal'); scene.add(crt);

    H53.metro.setEnv(env);
    var met = H53.metro.build();
    met.scale.setScalar(1.15);                   // ひとまわり大きく
    met.position.set(R.METRO_X, R.DESK_H + 0.001495, R.DESK_CZ + 0.04);
    tag(met, 'metronome'); scene.add(met);
    grade();
    H53.finishScene(scene);
  }

  // A shared finish pass; retain each asset's palette and optical role.
  function grade() {
    var seen = new Set(), hsl = {};
    scene.traverse(function(o){
      if(!o.isMesh || !o.material) return;
      (Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){
        if(seen.has(m)) return;seen.add(m);
        if(!m.isMeshStandardMaterial || m.__g || m.transparent) return;
        m.color.getHSL(hsl);
        if(hsl.l>0.52) m.color.setHSL(hsl.h,hsl.s*0.94,0.52+(hsl.l-0.52)*0.48);
        else if(hsl.l<0.13) m.color.setHSL(hsl.h,hsl.s,0.09+hsl.l*0.55);
        if(m.envMapIntensity!==undefined) m.envMapIntensity=Math.min(m.envMapIntensity,1.10);
        // Roughness maps already describe the finish. Leave specular edges intact.
      });
    });
  }

  // ─────────────────────────── 場
  function init() {
    var cv = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.80;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    H53.useRenderer(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010204);
    fog = new THREE.FogExp2(0x0e131a, 0.017);
    scene.fog = fog;
    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.05, 60);
    camera.__baseFov = 42;

    assemble();

    // 光は天井の面から降る。点ではない。影は一方向へ、浅く落ちる
    var R = H53.room;
    var key = new THREE.DirectionalLight(0xf1e7ee, 0.36);
    key.position.set(0.55, 5.60, 0.90);
    key.target.position.set(0, 0, -0.70);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048; key.shadow.mapSize.height = 2048;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 16.0;
    key.shadow.camera.left = -2.8; key.shadow.camera.right = 2.8;
    key.shadow.camera.top = 3.6; key.shadow.camera.bottom = -3.6;
    key.shadow.bias = -0.00008; key.shadow.normalBias = 0.0006;
    scene.add(key); scene.add(key.target);
    // 面光源の代わり。反対側からも同じ高さで当て、影の縁を殺す
    var soft = new THREE.DirectionalLight(0xe4ecf4, 0.16);
    soft.position.set(-1.90, 4.60, -1.60);
    scene.add(soft);
    // 光は天井の器具から出る。器具の位置に落ちる。減衰が室の遠近を作る
    var lamp = new THREE.PointLight(0xf6e7f0, 1.30, 8.0, 1.35);
    lamp.position.set(0, 2.72, 0);
    scene.add(lamp);
    scene.add(new THREE.AmbientLight(0x232a33, 0.30));
    // 画面の色こぼれ。室を照らすためではなく、面が発光している証としてだけ置く
    var lt = new THREE.PointLight(0x00ddc8, 0.30, 0.90, 2.2);
    lt.position.set(R.TERM_X + 0.02, R.DESK_H + 0.20, R.DESK_CZ + 0.10);
    scene.add(lt);
    var lb2 = new THREE.PointLight(C_PALE, 0.24, 0.72, 2.2);
    lb2.position.set(0, R.DESK_H + 0.11, R.BOARD_Z + 0.05);
    scene.add(lb2);

    H53.applyOrigin(scene).then(function(){return H53.applyBlenderRefinement(scene, renderer);}).then(function(){
    clock = new THREE.Clock();
    bind(cv);
    onResize();
    window.addEventListener('resize', onResize, false);
    animate();
    document.getElementById('asset-load').remove();
    }).catch(function(){ document.getElementById('asset-load').textContent='読み込みに失敗しました。ページを再読み込みしてください。'; });
  }

  // ─────────────────────────── 触れる
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

  function pick(cx, cy) {
    if(blocked())return null;
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

  // One owner for reading, transition and scene input. No deferred selections.
  var panelState = 'closed', openKey = null, restoreFocus = null;
  var activePointers = new Map(), pinchDistance = 0, gestureHadMultiple = false;
  var modalPointers = new Set(), closeAnimationDone = false, releaseFrame = 0;
  function blocked() { return panelState !== 'closed'; }
  function resetGesture() { activePointers.clear(); drag=false; moved=0; pinchDistance=0; gestureHadMultiple=false; }
  function lockScene(lock) {
    document.body.classList.toggle('reading',lock);
    ['v0','v1','origin'].forEach(function(id){document.getElementById(id).disabled=lock;});
    ['c','back'].forEach(function(id){var e=document.getElementById(id);e.inert=lock;e.setAttribute('aria-disabled',String(lock));});
    document.getElementById('record-shield').hidden=!lock;
    resetGesture();
  }
  function openPanel(key) {
    if(blocked() || !LOG[key])return;
    var d=LOG[key], p=document.getElementById('panel');
    panelState='open';openKey=key;restoreFocus=document.activeElement;
    lockScene(true);
    document.getElementById('pt').textContent=d.t;
    document.getElementById('pe').textContent=d.en;
    document.getElementById('pj').innerHTML=d.ja;
    document.getElementById('ps').textContent=d.s;
    document.getElementById('record-body').scrollTop=0;
    p.inert=false;p.style.visibility='visible';p.setAttribute('aria-hidden','false');p.classList.add('on');
    document.getElementById('px').focus({preventScroll:true});
    requestAnimationFrame(function(){if(panelState==='open')document.getElementById('px').focus({preventScroll:true});});
  }
  function settleClose() {
    if(panelState!=='closing'||!closeAnimationDone||modalPointers.size)return;
    cancelAnimationFrame(releaseFrame);
    // A rendering turn after the last pointer/click event: never replay that gesture.
    releaseFrame=requestAnimationFrame(function(){
      if(panelState!=='closing'||modalPointers.size)return;
      panelState='closed';openKey=null;lockScene(false);
      var target=restoreFocus;
      if(!target||target===document.body||!target.isConnected||target.disabled)target=document.getElementById('c');
      target.focus({preventScroll:true});restoreFocus=null;
    });
  }
  function closePanel() {
    if(panelState!=='open')return;
    panelState='closing';closeAnimationDone=false;
    var p=document.getElementById('panel');p.classList.remove('on');
    // Keep the dialog and shield active until its CSS transitions actually finish.
    requestAnimationFrame(function(){
      var animations=p.getAnimations?p.getAnimations():[];
      Promise.all(animations.map(function(a){return a.finished.catch(function(){});})).then(function(){
        p.inert=true;p.style.visibility='';p.setAttribute('aria-hidden','true');closeAnimationDone=true;settleClose();
      });
    });
  }

  function goStation(i) {
    if(blocked())return;
    station = i;
    var s = ST[i];
    eye = s.pos.slice(); yaw = s.yaw;
    pitAdj = pitPad() * s.up; pit = s.pit + pitAdj; zoom = 1;
    document.getElementById('v0').className = i === 0 ? 'on' : '';
    document.getElementById('v1').className = i === 1 ? 'on' : '';
    document.getElementById('v0').setAttribute('aria-pressed',String(i===0));
    document.getElementById('v1').setAttribute('aria-pressed',String(i===1));
  }

  function bind(cv) {
    var p=document.getElementById('panel'), xb=document.getElementById('px');
    // Pointer Events are the only scene gesture pipeline; compatibility mouse events are ignored.
    document.addEventListener('pointerdown',function(e){
      if(!blocked())return;modalPointers.add(e.pointerId);
      if(!p.contains(e.target)){if(e.target.setPointerCapture){try{e.target.setPointerCapture(e.pointerId);}catch(ignore){}}e.preventDefault();e.stopImmediatePropagation();}
    },true);
    function modalEnd(e){
      modalPointers.delete(e.pointerId);
      if(blocked()&&!p.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
      settleClose();
    }
    document.addEventListener('pointerup',modalEnd,true);
    document.addEventListener('pointercancel',modalEnd,true);
    document.addEventListener('click',function(e){
      if(blocked()&&!p.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
    },true);
    document.addEventListener('wheel',function(e){
      if(blocked()&&!p.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
    },{capture:true,passive:false});
    document.addEventListener('keydown',function(e){
      if(!blocked())return;
      if(e.key==='Tab'){
        var items=[xb,document.getElementById('record-body')],i=items.indexOf(document.activeElement);
        e.preventDefault();items[(i+(e.shiftKey?-1:1)+items.length)%items.length].focus({preventScroll:true});
      }
      // Escape is deliberately not a second close action.
      if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();}
    },true);
    document.addEventListener('focusin',function(e){if(blocked()&&!p.contains(e.target))xb.focus({preventScroll:true});});
    xb.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();closePanel();});
    p.addEventListener('pointerdown',function(e){e.stopPropagation();});
    p.addEventListener('click',function(e){e.stopPropagation();});
    cv.addEventListener('pointerdown',function(e){
      if(blocked()||e.button!==0)return;
      e.preventDefault();
      cv.focus({preventScroll:true});cv.setPointerCapture(e.pointerId);
      activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(activePointers.size===1){drag=true;moved=0;px=e.clientX;py=e.clientY;gestureHadMultiple=false;}
      else{gestureHadMultiple=true;drag=false;var a=Array.from(activePointers.values());pinchDistance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}
    });
    cv.addEventListener('pointermove',function(e){
      if(blocked()||!activePointers.has(e.pointerId))return;
      activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(activePointers.size===2){
        var a=Array.from(activePointers.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
        if(pinchDistance&&d)zoom=Math.max(.52,Math.min(1.30,zoom*pinchDistance/d));pinchDistance=d;
      }else if(drag&&!gestureHadMultiple){
        moved+=Math.abs(e.clientX-px)+Math.abs(e.clientY-py);
        yaw-=(e.clientX-px)*.0042;pit=Math.max(-.92,Math.min(.72,pit+(e.clientY-py)*.0032));
        px=e.clientX;py=e.clientY;
      }
    });
    cv.addEventListener('pointerup',function(e){
      e.preventDefault();
      var select=!blocked()&&activePointers.has(e.pointerId)&&drag&&!gestureHadMultiple&&moved<8;
      activePointers.delete(e.pointerId);
      if(!activePointers.size)resetGesture();
      if(select){var k=pick(e.clientX,e.clientY);if(k)openPanel(k);}
    });
    cv.addEventListener('pointercancel',resetGesture);
    cv.addEventListener('lostpointercapture',function(e){activePointers.delete(e.pointerId);if(!activePointers.size)resetGesture();});
    window.addEventListener('blur',function(){resetGesture();modalPointers.clear();settleClose();});
    cv.addEventListener('wheel',function(e){if(blocked())return;e.preventDefault();zoom=Math.max(.52,Math.min(1.30,zoom*(1+e.deltaY*.0011)));},{passive:false});
    document.getElementById('v0').addEventListener('click',function(){goStation(0);});
    document.getElementById('v1').addEventListener('click',function(){goStation(1);});
    document.getElementById('origin').addEventListener('click',function(){
      if(blocked()||seeking)return;seeking=true;seekT=0;seekPaint=1;this.className='on';this.setAttribute('aria-pressed','true');
    });
  }

  // 承認済みの縦持ち（垂直56°）を超えた分の半角
  function pitPad() { return Math.max(0, camera.__baseFov * Math.PI / 360 - 0.4887); }

  function onResize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // 縦持ちは画角を広げるのではなく、水平の画角を保つ。
    // 承認された縦持ち（390×664・垂直56°）の水平半角 tan = 0.3126 を基準にする
    camera.__baseFov = Math.min(76, Math.max(42,
      2 * Math.atan(0.3126 / (w / h)) * 180 / Math.PI));
    // 画角が縦へ伸びた分だけ、俯角を戻す。
    // 下端の高さを承認済みの縦持ちに保つ——増えた分は床ではなく天へ回る
    var prev = pitAdj;
    pitAdj = pitPad() * ST[station].up;
    pit += pitAdj - prev;
    camera.updateProjectionMatrix();
  }

  // ─────────────────────────── 拍と時
  function pulses() {
    var extra = seeking ? -Math.floor(seekT * seekT * 620) : 0;
    return Math.floor((Date.now() - EPOCH_MS) / (PUMP * 1000)) + extra;
  }

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.1);
    t0 += dt;

    if (seeking) {
      seekT += dt;
      // 遡る速さは上がり続ける。加算は二乗で伸びるが、原点までは何桁も足りない
      seekPaint += dt;
      if (seekPaint > 0.05) {
        seekPaint = 0;
        H53.crt.seek(-Math.floor(seekT * seekT * 620));
      }
      if (seekT > 62.4) {
        seeking = false; seekT = 0; seekPaint = 0;
        H53.crt.seek(0);
        document.getElementById('origin').className = '';
        document.getElementById('origin').setAttribute('aria-pressed','false');
      }
    }

    if (H53.crt.tick) H53.crt.tick(t0);
    if (H53.board.tick) H53.board.tick(t0);
    if (H53.metro.tick) H53.metro.tick(t0);

    // 拍は器械と決裁にだけ残る。室は揺れない
    var f = camera.__baseFov * zoom;
    if (camera.fov !== f) { camera.fov = f; camera.updateProjectionMatrix(); }

    // 足は動かない。首だけが動く
    var c = Math.cos(pit);
    camera.position.set(eye[0], eye[1], eye[2]);
    camera.lookAt(eye[0] + Math.sin(yaw) * c,
                  eye[1] + Math.sin(pit),
                  eye[2] - Math.cos(yaw) * c);
    renderer.render(scene, camera);
  }

  window.__H53M = {
    get renderer() { return renderer; },
    get scene() { return scene; },
    get camera() { return camera; },
    station: goStation,
    setView: function (y, p, z) { if(blocked())return; yaw = y; pit = p; zoom = z === undefined ? zoom : z; },
    pickAt: pick,
    open: openPanel,
    get reading() {return {state:panelState,key:openKey,station:station,yaw:yaw,pitch:pit,zoom:zoom,time:t0};},
    keys: function () { return Object.keys(roots); },
    setTime: function (t) { t0 = t; },
    beat: function () {}
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else { init(); }
})();

