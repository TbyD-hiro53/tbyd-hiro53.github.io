/* Interior audio previews: approved recordings, gesture-only playback and scene-aware distance. */
(function () {
  'use strict';
  function boot() {
  var work = location.pathname.split('/').pop().replace('.html','');
  var shoko = work === 'shoko', earth = work === 'earth-origin-material';
  var menu = document.getElementById(shoko ? 'menu' : 'h53-menu-panel'), menuButton = document.getElementById(shoko ? 'menuToggle' : 'h53-menu-toggle');
  var names = shoko ? ['room','river','rill','conveyor'] : ['room','wind'];
  var durations = {room:29,wind:29,river:17,rill:17,conveyor:17};
  var displayError = false;
  addEventListener('h53-display-error', function(){displayError=true;});
  if (!menu || !menuButton) return;
  var en = false;
  try { en = localStorage.getItem('h53lang') === 'en'; } catch (_) {}
  function text(ja, english) { return en ? english : ja; }
  var style = document.createElement('style');
  style.textContent = '#h53-audio-toggle{position:fixed;z-index:7;width:44px;min-width:44px;height:44px;min-height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center;line-height:1;border-radius:999px}#h53-audio-toggle svg{width:22px;height:22px;display:block;pointer-events:none}#h53-audio-toggle[aria-busy=true]{opacity:.65}.h53-audio-row,.h53-audio-credits,.h53-audio-status{grid-column:1/-1;min-width:0;margin:0;padding:8px 12px;font:12px/1.7 system-ui;color:inherit;background:transparent}.h53-audio-row{display:flex;align-items:center;gap:12px;min-height:44px}.h53-audio-row input{min-width:0;flex:1;width:110px}.h53-audio-credits{overflow-wrap:anywhere}.h53-audio-credits summary{min-height:44px;cursor:pointer}.h53-audio-credits a{color:inherit}.h53-audio-status:empty{display:none}#h53-audio-toggle[hidden]{display:none!important}body:has(#h53-menu-panel:not([hidden])) #hud,body:has(#menu:not([hidden])) #hud,body:has(#menu:not([hidden])) #navigation{visibility:hidden}#app #menu{max-height:calc(100dvh - 100px - var(--h53-copy-h,40px) - env(safe-area-inset-top) - env(safe-area-inset-bottom))}';
  document.head.appendChild(style);
  var button = document.createElement('button');
  button.id = 'h53-audio-toggle'; button.type = 'button'; button.className = shoko ? 'pill' : 'h53-menu-pill';
  button.dataset.h53Liquid = 'control'; button.dataset.h53AudioControl = '';
  menuButton.before(button);
  if (window.__h53Liquid) {
    window.__h53Liquid.ui.register(button, {kind: 'control'});
    window.__h53Liquid.requestFrame();
  }
  function followMenu() {
    var r = menuButton.getBoundingClientRect();
    button.style.top = r.top + 'px'; button.style.right = (innerWidth-r.left+8) + 'px'; button.style.bottom='auto';
    button.hidden = menuButton.hidden || getComputedStyle(menuButton).visibility === 'hidden' || !r.width;
    button.inert = menuButton.inert;
  }
  new MutationObserver(followMenu).observe(menuButton, {attributes:true,attributeFilter:['hidden','inert','style','class']});
  new MutationObserver(followMenu).observe(document.body,{attributes:true,attributeFilter:['class']});
  if (window.ResizeObserver) new ResizeObserver(followMenu).observe(menuButton);
  addEventListener('resize',followMenu); followMenu();
  ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend'].forEach(function(type){button.addEventListener(type,function(e){e.stopPropagation();});});
  var row = document.createElement('label'), range = document.createElement('input');
  row.className = 'h53-audio-row'; row.appendChild(document.createTextNode(text('音量', 'Volume')));
  range.type = 'range'; range.min = 0; range.max = 100; range.value = 55;
  range.setAttribute('aria-label', text('環境音の音量', 'Ambient sound volume'));
  row.appendChild(range); menu.appendChild(row);
  var credits = document.createElement('details'); credits.className = 'h53-audio-credits';
  var summary = document.createElement('summary'); summary.tabIndex = 0; summary.textContent = text('音源', 'Sound credits'); credits.appendChild(summary);
  function credit(label, url) {
    var a = document.createElement('a'); a.textContent = label; a.href = url;
    a.target = '_blank'; a.rel = 'noopener'; credits.append(a, document.createElement('br'));
  }
  credit('Room tone, large convention hall — kyles · Freesound', 'https://freesound.org/people/kyles/sounds/451614/');
  if (!shoko) credit('Wind in the grass — waweee · Freesound', 'https://freesound.org/people/waweee/sounds/517995/');
  if (shoko) {
    credit('Ambiance_River_Flow_Medium_Loop_Stereo — Nox_Sound · Freesound', 'https://freesound.org/people/Nox_Sound/sounds/479322/');
    credit('Water, small stream — peridactyloptrix · Freesound', 'https://freesound.org/people/peridactyloptrix/sounds/197705/');
  }
  credit('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/');
  credits.appendChild(document.createTextNode(text('上記の録音はCC0。録音を抜粋し、帯域・音量・ピーク・継ぎ目を調整。場所に合わせて距離感を変えています。', 'The recordings above are CC0. Recordings excerpted and edited for EQ, level, peaks and loops; mixed for each viewpoint.')));
  if (shoko) {
    credits.appendChild(document.createElement('br'));
    credit('ConveyorLoop.wav — oldestmillennial · Freesound', 'https://freesound.org/people/oldestmillennial/sounds/538210/');
    credit('CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/');
    credits.appendChild(document.createTextNode(text('チェーン等を用いたフォーリー。抜粋・帯域・音量・ループを調整。下層でだけ、水路と小さく重ねています。', 'Conveyor foley made with chain and other props. Excerpt, EQ, level and loop edited; mixed quietly with the water only on the lower floor.')));
  }
  menu.appendChild(credits);
  credits.addEventListener('toggle', function(){if(window.__h53Liquid)window.__h53Liquid.requestFrame();});
  var status = document.createElement('span'); status.className = 'h53-audio-status'; status.setAttribute('role', 'status'); menu.appendChild(status);

  var context = null, layers = [], loading = null, enabled = false, away = false;
  var volume = .55, timer = 0, serial = 0, error = null, channel = null;
  var tabId = Math.random().toString(36), targets = null;
  var sceneSeconds = 0, lastSceneTick = performance.now();
  function scene() {
    var now=performance.now(), dt=Math.min(.25,(now-lastSceneTick)/1000);lastSceneTick=now;
    var view, running, ready;
    if (earth) {
      var m=window.__H53M; if(!m)return null;
      view=m.stationIndex;ready=window.__EO_READY;running=!m.paused;
    } else if (shoko) {
      var app=document.getElementById('app'), pause=document.getElementById('pause');
      view=app.dataset.scene;ready=app.dataset.ready==='true';
      running=(pause.hidden || pause.getAttribute('aria-pressed')!=='true') && document.getElementById('info').hidden;
    } else {
      var qa=window.__H53V7;if(!qa)return null;
      var selected=document.querySelector('#views button[aria-pressed=true]');
      view=selected ? Number(selected.id.slice(1)) : 0;
      var key=['pod','term','door','corner','hall'][view];
      ready=qa.views[key] && qa.views[key].ready;running=true;
    }
    running=!!(ready && running && !displayError);
    if(running && !document.hidden)sceneSeconds+=dt;
    return {running:running,ready:!!ready,time:sceneSeconds,view:view};
  }
  function mix(s) {
    var v=s.view, room, wind=0, river=0,rill=0,conveyor=0,windCutoff=1600;
    if(earth){room=[.50,.45,.10,.25][v];wind=[.15,.03,.008,.65][v];windCutoff=[2400,1300,700,5200][v];}
    else if(shoko){room={exterior:0,intake:.36,room:.38,reading:.40,lower:.24,daylight:.20,branch:.27}[v] || 0;if(v==='lower'){river=.23;rill=.33;conveyor=.10;}}
    else {room=[.65,.55,.28,.48,.42][v];wind=[.035,.025,.75,.07,.18][v];windCutoff=[1500,1200,5500,1800,2200][v];}
    return {room:room,wind:wind,river:river,rill:rill,conveyor:conveyor,
      roomCutoff:earth&&v===2?900:2400,windCutoff:windCutoff,riverCutoff:2400,rillCutoff:4200,conveyorCutoff:1600,
      roomPan:0,windPan:0,riverPan:.12,rillPan:.28,conveyorPan:-.2};
  }
  function stopLayer(layer) {
    if (!layer.voice) return;
    var voice = layer.voice; layer.voice = null;
    var now = context.currentTime;
    voice.fade.gain.cancelScheduledValues(now);
    voice.fade.gain.setTargetAtTime(0, now, .025);
    try { voice.source.stop(now + .15); } catch (_) {}
  }
  function stop() { layers.forEach(stopLayer); }
  function clearTimer() { clearInterval(timer); timer = 0; }
  function update() {
    var s = scene();
    if (s) targets = mix(s);
    if (!context || !enabled || away || document.hidden || !s || !s.running || context.state !== 'running') { stop(); return; }
    var now = context.currentTime;
    layers.forEach(function (layer) {
      if (!layer.buffer) return;
      // Re-align after a scene-time discontinuity without restarting on every frame.
      if (layer.voice && Math.abs(layer.voice.sceneTime + now - layer.voice.started - s.time) > 1.5) stopLayer(layer);
      if (!layer.voice) {
        var source = context.createBufferSource(), fade = context.createGain();
        source.buffer = layer.buffer; source.loop = true;
        fade.gain.value = 0; source.connect(fade); fade.connect(layer.filter);
        source.onended = function () { source.disconnect(); fade.disconnect(); };
        layer.voice = {source: source, fade: fade, sceneTime: s.time, started: now};
        source.start(now, ((s.time % layer.buffer.duration) + layer.buffer.duration) % layer.buffer.duration);
        fade.gain.setTargetAtTime(1, now, .06);
      }
      layer.gain.gain.setTargetAtTime(volume * targets[layer.name], now, .45);
      layer.filter.frequency.setTargetAtTime(targets[layer.name + 'Cutoff'], now, .45);
      if (layer.pan) layer.pan.pan.setTargetAtTime(targets[layer.name + 'Pan'], now, .14);
    });
  }
  function controls() {
    if (!enabled) button.removeAttribute('aria-busy');
    var label = enabled ? text('音を消す', 'Mute sound') : text('音を入れる', 'Enable sound');
    button.setAttribute('aria-label', label); button.title = label; button.setAttribute('aria-pressed', String(enabled));
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h4l5-4v14l-5-4H3z"/>' + (enabled ? '<path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>' : '<path class="audio-slash" d="M3 3l18 18"/>') + '</svg>';
    if (window.__h53Liquid) window.__h53Liquid.requestFrame();
  }
  function claim() { if (channel) channel.postMessage({type: 'claim', id: tabId}); }
  function fail(e) {
    error = String(e); enabled = false; ++serial; clearTimer(); stop(); controls();
    status.textContent = text('音を再生できませんでした。スピーカーボタンで再度お試しください。', 'Sound could not be played. Use the speaker button to retry.');
  }
  async function activate() {
    var ticket = ++serial; enabled = !enabled; error = null; status.textContent = ''; controls();
    if (!enabled) { clearTimer(); stop(); return; }
    claim();
    try {
      if (!context) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) throw Error('Web Audio unavailable');
        context = new AC();
        layers = names.map(function (name) {
          var filter = context.createBiquadFilter(), gain = context.createGain();
          filter.type = 'lowpass'; filter.Q.value = .5; gain.gain.value = 0;
          filter.connect(gain);
          var pan = context.createStereoPanner ? context.createStereoPanner() : null;
          if (pan) { gain.connect(pan); pan.connect(context.destination); } else gain.connect(context.destination);
          return {name: name, filter: filter, gain: gain, pan: pan, buffer: null, voice: null};
        });
      }
      await context.resume();
      if (ticket !== serial || !enabled) return;
      if (!layers.every(function (layer) { return !!layer.buffer; })) {
        button.setAttribute('aria-busy', 'true'); status.textContent = text('音を準備しています', 'Loading sound');
        if (!loading) loading = Promise.all(layers.map(async function (layer) {
          if (layer.buffer) return;
          var response = await fetch((layer.name==='river'||layer.name==='rill' ? 'confluence-audio-v1-20261018-' : 'interiors-audio-v1-20261019-') + layer.name + '.mp3');
          if (!response.ok) throw Error('Audio ' + response.status);
          var decoded = await context.decodeAudioData(await response.arrayBuffer());
          // Remove cyclic encoding guards; loop boundaries are inside the MP3 stream.
          var start = Math.round(.1*decoded.sampleRate), count = Math.round(durations[layer.name]*decoded.sampleRate);
          if (decoded.length < start + count) throw Error('Audio length');
          layer.buffer = context.createBuffer(decoded.numberOfChannels, count, decoded.sampleRate);
          for (var ch=0; ch<decoded.numberOfChannels; ch++) layer.buffer.copyToChannel(decoded.getChannelData(ch).subarray(start,start+count),ch);
        })).finally(function () { loading = null; });
        await loading;
      }
      if (ticket !== serial || !enabled) return;
      button.removeAttribute('aria-busy'); status.textContent = '';
      if (!timer && !away && !document.hidden) timer = setInterval(update, 120);
      update();
    } catch (e) { if (ticket === serial) fail(e); }
  }
  controls(); button.addEventListener('click', function(e){e.stopPropagation();activate();});
  range.addEventListener('input', function () { volume = Number(range.value) / 100; update(); });
  document.addEventListener('click', function (e) { if (e.target.closest('#eo-pause,#pause,#views button,#stbar button,#scenes button')) queueMicrotask(update); });
  document.addEventListener('keydown', function (e) { if (e.code === 'Space') queueMicrotask(update); });
  try {
    channel = new BroadcastChannel('h53-audition-audio');
    channel.onmessage = function (e) {
      if (e.data && e.data.type === 'claim' && e.data.id !== tabId) {
        enabled = false; ++serial; clearTimer(); stop(); status.textContent = ''; controls();
      }
    };
  } catch (_) {}
  function visibility() {
    if (!context || context.state === 'closed') return;
    if (document.hidden || away) {
      clearTimer(); stop(); context.suspend().catch(function () {});
    } else if (enabled) {
      claim();
      context.resume().then(function () {
        if (enabled && !away && !document.hidden) { if (!timer) timer = setInterval(update, 120); update(); }
      }).catch(fail);
    }
  }
  document.addEventListener('visibilitychange', visibility);
  addEventListener('pagehide', function (e) {
    away = true; visibility();
    if (!e.persisted) { ++serial; if (channel) channel.close(); if (context) context.close().catch(function () {}); }
  });
  addEventListener('pageshow', function () { away = false; visibility(); });
  window.__h53Audio = {
    sync: update,
    report: function () {
      return {enabled: enabled, playing: layers.some(function (l) { return !!l.voice; }), context: context && context.state,
        loopSeconds: layers.map(function (l) { return l.buffer ? l.buffer.duration : 0; }),
        loaded: layers.length === names.length && layers.every(function (l) { return !!l.buffer; }), volume: volume,
        decodedBytes: layers.reduce(function (sum, l) { return sum + (l.buffer ? l.buffer.length * l.buffer.numberOfChannels * 4 : 0); }, 0),
        scene: scene(), targets: targets, error: error, source: work, revision: 'interiors-audio-v1'};
    }
  };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
