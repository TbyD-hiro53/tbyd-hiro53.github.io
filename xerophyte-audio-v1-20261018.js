/* Xerophyte: opt-in wind / sand layers driven by the existing artwork clock. */
(function () {
  'use strict';
  var menu = document.getElementById('menu'), menuButton = document.getElementById('menuToggle');
  if (!menu || !menuButton) return;
  var en = false;
  try { en = localStorage.getItem('h53lang') === 'en'; } catch (_) {}
  function text(ja, english) { return en ? english : ja; }
  var style = document.createElement('style');
  style.textContent = '#h53-audio-controls{position:fixed;right:calc(16px + env(safe-area-inset-right));top:calc(14px + env(safe-area-inset-top));z-index:7;display:flex;gap:8px;align-items:center}#h53-audio-controls #menuToggle{position:static}#h53-audio-toggle{width:44px;min-width:44px;height:44px;min-height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;line-height:1}#h53-audio-toggle svg{width:22px;height:22px;display:block;pointer-events:none}#h53-audio-toggle[aria-busy=true]{opacity:.65}.h53-audio-row,.h53-audio-credits,.h53-audio-status{grid-column:1/-1;min-width:0;margin:0;padding:8px 12px;font:12px/1.7 var(--sans);color:inherit;background:transparent}.h53-audio-row{display:flex;align-items:center;gap:12px;min-height:44px}.h53-audio-row input{min-width:0;flex:1;width:120px}.h53-audio-credits{max-width:290px;overflow-wrap:anywhere}.h53-audio-credits summary{min-height:44px;cursor:pointer}.h53-audio-credits a{color:inherit}.h53-audio-status:empty{display:none}body:has(#menu:not([hidden])) #masthead,body:has(#menu:not([hidden])) #controls{visibility:hidden}body:has(#menu:not([hidden])) #controls button{pointer-events:none}#menu{max-height:calc(100dvh - 84px - var(--h53-copy-h) - env(safe-area-inset-top))}';
  document.head.appendChild(style);
  var group = document.createElement('div'), button = document.createElement('button');
  group.id = 'h53-audio-controls';
  button.id = 'h53-audio-toggle'; button.type = 'button'; button.className = 'pill';
  button.dataset.h53Liquid = 'control'; button.dataset.h53AudioControl = '';
  menuButton.before(group); group.append(button, menuButton);
  if (window.__h53Liquid) {
    window.__h53Liquid.ui.register(button, {kind: 'control'});
    window.__h53Liquid.requestFrame();
  }
  function followMenu() { group.hidden = menuButton.hidden; }
  new MutationObserver(followMenu).observe(menuButton, {attributes: true, attributeFilter: ['hidden']});
  followMenu();
  var row = document.createElement('label'), range = document.createElement('input');
  row.className = 'h53-audio-row'; row.appendChild(document.createTextNode(text('音量', 'Volume')));
  range.type = 'range'; range.min = 0; range.max = 100; range.value = 55;
  range.setAttribute('aria-label', text('風と砂の音量', 'Wind and sand volume'));
  row.appendChild(range); menu.appendChild(row);
  var credits = document.createElement('details'); credits.className = 'h53-audio-credits';
  var summary = document.createElement('summary'); summary.textContent = text('音源', 'Sound credits'); credits.appendChild(summary);
  function credit(label, url) {
    var a = document.createElement('a'); a.textContent = label; a.href = url;
    a.target = '_blank'; a.rel = 'noopener'; credits.append(a, document.createElement('br'));
  }
  credit('Sand blown by the wind — Lonofi / Mathias Rossignol · Freesound', 'https://freesound.org/people/Lonofi/sounds/446950/');
  credit('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/');
  credits.appendChild(document.createTextNode(text('合成による砂の音。抜粋・帯域・音量・ループを編集。', 'Designed synthetic sand sound. Excerpt, EQ, level and loop edited.')));
  credits.appendChild(document.createElement('br'));
  credit('Desert sand - Dune atmosphere — Vrymaa · Freesound · CC0', 'https://freesound.org/people/Vrymaa/sounds/825860/');
  credit('Strong Wind Recorded with Soundfield Microphone Manchester2 — keirofinch · Freesound · CC0', 'https://freesound.org/people/keirofinch/sounds/376534/');
  credit('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/');
  credits.appendChild(document.createTextNode(text('砂と風の録音を抜粋し、帯域・音量・継ぎ目を調整。音源には各ライセンスが適用されます。', 'Sand and wind recordings excerpted; EQ, levels and loops edited. Source audio retains its respective licenses.')));
  menu.appendChild(credits);
  var status = document.createElement('span'); status.className = 'h53-audio-status'; status.setAttribute('role', 'status'); menu.appendChild(status);

  var context = null, layers = [], loading = null, enabled = false, away = false;
  var volume = .55, timer = 0, serial = 0, error = null, channel = null;
  var tabId = Math.random().toString(36), targets = null;
  function scene() {
    var x = window.__xero;
    return x ? {running: x.clock.running, time: x.clock.t,
      stormTime: x.clock.stormAt === null ? -1 : x.clock.t - x.clock.stormAt,
      wind: x.wind(), sand: x.wStorm(), veil: x.veil(), gust: x.gust(x.clock.t)} : null;
  }
  function mix(s) {
    // Wind arrives before visible sand. Broad gusts use the renderer's own phase.
    var gust = Math.max(0, Math.min(1, s.gust));
    var wind = Math.max(0, Math.min(1, (s.wind - .08) / .92));
    return {
      wind: .1 + .95 * wind * (.55 + .45 * gust) + .03 * s.veil,
      sand: Math.pow(s.sand, 1.2) * (.72 + .55 * gust) + .32 * s.veil,
      windCutoff: 400 + 200 * wind,
      sandCutoff: 5200 + 2400 * s.sand
    };
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
      layer.gain.gain.setTargetAtTime(volume * targets[layer.name], now, .18);
      layer.filter.frequency.setTargetAtTime(targets[layer.name + 'Cutoff'], now, .3);
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
        layers = ['wind', 'sand'].map(function (name) {
          var filter = context.createBiquadFilter(), gain = context.createGain();
          filter.type = 'lowpass'; filter.Q.value = .5; gain.gain.value = 0;
          filter.connect(gain); gain.connect(context.destination);
          return {name: name, filter: filter, gain: gain, buffer: null, voice: null};
        });
      }
      await context.resume();
      if (ticket !== serial || !enabled) return;
      if (!layers.every(function (layer) { return !!layer.buffer; })) {
        button.setAttribute('aria-busy', 'true'); status.textContent = text('音を準備しています', 'Loading sound');
        if (!loading) loading = Promise.all(layers.map(async function (layer) {
          if (layer.buffer) return;
          var response = await fetch('xerophyte-audio-v1-20261018-' + layer.name + '.mp3');
          if (!response.ok) throw Error('Audio ' + response.status);
          layer.buffer = await context.decodeAudioData(await response.arrayBuffer());
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
  document.addEventListener('click', function (e) { if (e.target.closest('#pause,#storm')) queueMicrotask(update); });
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
        loaded: layers.length === 2 && layers.every(function (l) { return !!l.buffer; }), volume: volume,
        decodedBytes: layers.reduce(function (sum, l) { return sum + (l.buffer ? l.buffer.length * l.buffer.numberOfChannels * 4 : 0); }, 0),
        scene: scene(), targets: targets, error: error, source: 'xerophyte', revision: 'audio-v1'};
    }
  };
})();
