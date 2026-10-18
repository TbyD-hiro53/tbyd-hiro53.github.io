/* Confluence: opt-in water recordings with view-relative perspective. */
(function () {
  'use strict';
  function boot() {
  var menu = document.getElementById('menu'), menuButton = document.getElementById('more');
  if (!menu || !menuButton) return;
  var en = false;
  try { en = localStorage.getItem('h53lang') === 'en'; } catch (_) {}
  function text(ja, english) { return en ? english : ja; }
  var style = document.createElement('style');
  style.textContent = '#h53-audio-controls{position:fixed;right:calc(16px + env(safe-area-inset-right));top:calc(14px + env(safe-area-inset-top));z-index:7;display:flex;gap:8px;align-items:center}#h53-audio-controls #more{position:static}#h53-audio-toggle{width:44px;min-width:44px;height:44px;min-height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;line-height:1}#h53-audio-toggle svg{width:22px;height:22px;display:block;pointer-events:none}#h53-audio-toggle[aria-busy=true]{opacity:.65}.h53-audio-row,.h53-audio-credits,.h53-audio-status{grid-column:1/-1;min-width:0;margin:0;padding:8px 12px;font:12px/1.7 system-ui;color:inherit;background:transparent}.h53-audio-row{display:flex;align-items:center;gap:12px;min-height:44px}.h53-audio-row input{min-width:0;flex:1;width:120px}.h53-audio-credits{max-width:290px;overflow-wrap:anywhere}.h53-audio-credits summary{min-height:44px;cursor:pointer}.h53-audio-credits a{color:inherit}.h53-audio-status:empty{display:none}body:has(#menu:not([hidden])) #hint,body:has(#menu:not([hidden])) #ui{visibility:hidden}body:has(#menu:not([hidden])) #ui button{pointer-events:none}#menu.h53-panel-tr{max-height:calc(100dvh - 84px - var(--h53-copy-clear, 40px) - env(safe-area-inset-top))}';
  document.head.appendChild(style);
  var group = menuButton.parentElement, button = document.createElement('button');
  group.id = 'h53-audio-controls';
  button.id = 'h53-audio-toggle'; button.type = 'button'; button.className = 'glass pill chrome';
  button.dataset.h53Liquid = 'control'; button.dataset.h53AudioControl = '';
  menuButton.before(button);
  if (window.__h53Liquid) {
    window.__h53Liquid.ui.register(button, {kind: 'control'});
    window.__h53Liquid.requestFrame();
  }
  function followMenu() { group.hidden = document.body.classList.contains('immersive'); }
  new MutationObserver(followMenu).observe(menuButton, {attributes: true, attributeFilter: ['hidden']});
  new MutationObserver(followMenu).observe(document.body, {attributes:true, attributeFilter:['class']});
  followMenu();
  var row = document.createElement('label'), range = document.createElement('input');
  row.className = 'h53-audio-row'; row.appendChild(document.createTextNode(text('音量', 'Volume')));
  range.type = 'range'; range.min = 0; range.max = 100; range.value = 55;
  range.setAttribute('aria-label', text('水音の音量', 'Water volume'));
  row.appendChild(range); menu.appendChild(row);
  var credits = document.createElement('details'); credits.className = 'h53-audio-credits';
  var summary = document.createElement('summary'); summary.textContent = text('音源', 'Sound credits'); credits.appendChild(summary);
  function credit(label, url) {
    var a = document.createElement('a'); a.textContent = label; a.href = url;
    a.target = '_blank'; a.rel = 'noopener'; credits.append(a, document.createElement('br'));
  }
  credit('Ambiance_River_Flow_Medium_Loop_Stereo — Nox_Sound · Freesound', 'https://freesound.org/people/Nox_Sound/sounds/479322/');
  credit('Water, small stream — peridactyloptrix · Freesound', 'https://freesound.org/people/peridactyloptrix/sounds/197705/');
  credit('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/');
  credits.appendChild(document.createTextNode(text('流水の録音を抜粋し、帯域・音量・ピーク・継ぎ目を調整。視点と見回す向きに合わせて混合しています。音源にはCC0が適用されます。', 'Water recordings excerpted; EQ, level, peaks and loops edited. Mixed for viewpoint and looking direction. Source audio is CC0.')));
  menu.appendChild(credits);
  var status = document.createElement('span'); status.className = 'h53-audio-status'; status.setAttribute('role', 'status'); menu.appendChild(status);

  var context = null, layers = [], loading = null, enabled = false, away = false;
  var volume = .55, timer = 0, serial = 0, error = null, channel = null;
  var tabId = Math.random().toString(36), targets = null;
  function scene() {
    var qa = window.__confluenceUIQA;
    if (!qa || !qa.engine.loaded) return null;
    var state = qa.state();
    return {running: state.running && !qa.engine.staticMode && document.getElementById('error').hidden, time: state.seconds,
      view: state.current, yaw: state.yaw, eye: qa.engine.eyes[state.current]};
  }
  function mix(s) {
    // Broad basin and nearer flow: artistic perspective, not an acoustic simulation.
    var settings = [
      {river:.40, rill:.58, riverCutoff:2600, rillCutoff:3600, anchor:[0,-2.5]},
      {river:.72, rill:.28, riverCutoff:4200, rillCutoff:2800, anchor:[-12,-18]},
      {river:.40, rill:.82, riverCutoff:3500, rillCutoff:6400, anchor:[16,6]}
    ][s.view];
    var bearing = Math.atan2(settings.anchor[0]-s.eye[0], -(settings.anchor[1]-s.eye[2]));
    var side = Math.sin(bearing-s.yaw*Math.PI/180), swell=1+.035*Math.sin(s.time*.19);
    return {river:settings.river*swell, rill:settings.rill*swell,
      riverCutoff:settings.riverCutoff, rillCutoff:settings.rillCutoff,
      riverPan:side*.25, rillPan:side*.7};
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
        layers = ['river', 'rill'].map(function (name) {
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
          var response = await fetch('confluence-audio-v1-20261018-' + layer.name + '.mp3');
          if (!response.ok) throw Error('Audio ' + response.status);
          var decoded = await context.decodeAudioData(await response.arrayBuffer());
          // Remove cyclic encoding guards; loop boundaries are inside the MP3 stream.
          var start = Math.round(.1*decoded.sampleRate), count = Math.round(17*decoded.sampleRate);
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
  controls(); button.addEventListener('click', activate);
  range.addEventListener('input', function () { volume = Number(range.value) / 100; update(); });
  document.addEventListener('click', function (e) { if (e.target.closest('#motion,#still,.spot,#reset')) queueMicrotask(update); });
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
        loaded: layers.length === 2 && layers.every(function (l) { return !!l.buffer; }), volume: volume,
        decodedBytes: layers.reduce(function (sum, l) { return sum + (l.buffer ? l.buffer.length * l.buffer.numberOfChannels * 4 : 0); }, 0),
        scene: scene(), targets: targets, error: error, source: 'confluence', revision: 'audio-v1'};
    }
  };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
