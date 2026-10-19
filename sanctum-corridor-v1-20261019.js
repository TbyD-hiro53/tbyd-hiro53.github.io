/* Sanctum corridor v1: author-approved cave room tone, HQ preview-derived. Device stays silent. */
(function () {
  'use strict';
  function boot() {
  var menu = document.getElementById('composerMenuContent'), menuButton = document.getElementById('composerToggle');
  if (!menu || !menuButton || !window.__composerLiquid) { setTimeout(boot, 150); return; }
  if (document.getElementById('h53-audio-toggle')) return;
  var host = window.__composerLiquid.host;
  function requestArtworkFrame(){if(window.SanctumArtwork)window.SanctumArtwork.tune({});}
  host.requestFrame=requestArtworkFrame;host.ui.invalidate=requestArtworkFrame;
  var en = false;
  try { en = localStorage.getItem('h53lang') === 'en'; } catch (_) {}
  function text(ja, english) { return en ? english : ja; }
  var style = document.createElement('style');
  style.textContent = '#h53-audio-controls[hidden]{display:none!important}#h53-audio-controls{display:flex;gap:8px;align-items:center}#h53-audio-toggle{width:44px!important;min-width:44px!important;height:44px;min-height:44px;padding:0!important;display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;line-height:1}#h53-audio-toggle svg{width:22px;height:22px;display:block;pointer-events:none}#h53-audio-toggle[aria-busy=true]{opacity:.65}.h53-audio-row,.h53-audio-credits,.h53-audio-status{display:block;min-width:0;margin:0;padding:8px 12px;font:12px/1.7 system-ui;color:inherit;background:transparent}.h53-audio-row{display:flex;align-items:center;gap:12px;min-height:44px}.h53-audio-row input{min-width:0;flex:1;width:120px}.h53-audio-credits{overflow-wrap:anywhere}.h53-audio-credits summary{min-height:44px;cursor:pointer;pointer-events:auto}.h53-audio-credits a{color:inherit}.h53-audio-status:empty{display:none}';
  document.head.appendChild(style);
  var group = document.createElement('div'), button = document.createElement('button');
  group.id = 'h53-audio-controls'; menuButton.before(group); group.append(button, menuButton);
  button.id = 'h53-audio-toggle'; button.type = 'button';
  button.dataset.h53Liquid = 'control'; button.dataset.h53AudioControl = '';
  host.ui.register(button, {kind:'control'}); host.requestFrame();
  var audioSection = document.createElement('div'); audioSection.className='h53-audio-section';
  var row = document.createElement('label'), range = document.createElement('input');
  row.className = 'h53-audio-row'; row.appendChild(document.createTextNode(text('音量', 'Volume')));
  range.type = 'range'; range.min = 0; range.max = 100; range.value = 55;
  range.setAttribute('aria-label', text('回廊の環境音量', 'Corridor ambience volume'));
  row.appendChild(range); audioSection.appendChild(row);
  var credits = document.createElement('details'); credits.className = 'h53-audio-credits';
  var summary = document.createElement('summary'); summary.textContent = text('音源', 'Sound credits'); credits.appendChild(summary);
  function credit(label, url) {
    var a = document.createElement('a'); a.textContent = label; a.href = url;
    a.target = '_blank'; a.rel = 'noopener'; credits.append(a, document.createElement('br'));
  }
  credit('INT Cave Room tone.wav — deleted_user_2104797 · Freesound', 'https://freesound.org/people/deleted_user_2104797/sounds/164785/');
  credit('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/');
  credits.appendChild(document.createTextNode(text('洞窟のルームトーン。FreesoundのHQ試聴MP3由来の1:10–1:40を使用。音量を下げ、末尾と先頭を2秒重ねて28秒ループに調整。原本WAVではありません。', 'Cave room tone from the Freesound HQ MP3 preview, 1:10–1:40. Gain reduced; a two-second tail/head crossfade makes a 28-second loop. Not the original WAV.')));
  audioSection.appendChild(credits);
  var status = document.createElement('span'); status.className = 'h53-audio-status'; status.setAttribute('role', 'status'); audioSection.appendChild(status);

  function restoreMenuAudio(){
    if(window.__composerLiquid.report().view==='menu' && !audioSection.isConnected)menu.appendChild(audioSection);
  }
  new MutationObserver(restoreMenuAudio).observe(menu,{childList:true}); restoreMenuAudio();

  var context = null, layers = [], loading = null, enabled = false, away = false;
  var volume = .55, timer = 0, serial = 0, error = null, channel = null;
  var tabId = Math.random().toString(36), targets = null;
  var elapsed=0, previous=performance.now(), voiceStarts=0;
  function scene() {
    var art=window.SanctumArtwork, ui=window.SanctumUI;
    if(!art || !ui || !art.report().ready)return null;
    var now=performance.now(), running=ui.report().playing && !document.hidden && !away;
    if(running)elapsed+=Math.min(.5,(now-previous)/1000); previous=now;
    return {running:running,time:elapsed,view:art.report().view};
  }
  function mix(s) { return {room:1,roomPan:0}; }
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
      // Keep room tone on the audio clock, independent of render speed/view changes.
      if (!layer.voice) {
        var source = context.createBufferSource(), fade = context.createGain();
        source.buffer = layer.buffer; source.loop = true;
        fade.gain.value = 0; source.connect(fade); fade.connect(layer.filter);
        source.onended = function () { source.disconnect(); fade.disconnect(); };
        layer.voice = {source: source, fade: fade, sceneTime: s.time, started: now};
        source.start(now, ((s.time % layer.buffer.duration) + layer.buffer.duration) % layer.buffer.duration);voiceStarts++;
        fade.gain.setTargetAtTime(1, now, .4);
      }
      layer.gain.gain.setTargetAtTime(volume * targets[layer.name], now, .45);

      if (layer.pan) layer.pan.pan.setTargetAtTime(targets[layer.name + 'Pan'], now, .14);
    });
  }
  function controls() {
    if (!enabled) button.removeAttribute('aria-busy');
    var label = enabled ? text('音を消す', 'Mute sound') : text('音を入れる', 'Enable sound');
    button.setAttribute('aria-label', label); button.title = label; button.setAttribute('aria-pressed', String(enabled));
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h4l5-4v14l-5-4H3z"/>' + (enabled ? '<path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>' : '<path class="audio-slash" d="M3 3l18 18"/>') + '</svg>';
    host.requestFrame();
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
        layers = ['room'].map(function (name) {
          var filter = context.createGain(), gain = context.createGain();
          gain.gain.value = 0;
          filter.connect(gain);
          var pan = null; // The approved mono space recording remains centered, without object panning.
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
          var response = await fetch('sanctum-corridor-v1-20261019-cave.mp3');
          if (!response.ok) throw Error('Audio ' + response.status);
          var decoded = await context.decodeAudioData(await response.arrayBuffer());
          // Remove cyclic encoding guards; loop boundaries are inside the MP3 stream.
          var start = Math.round(.1*decoded.sampleRate), count = Math.round(28*decoded.sampleRate);
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
  controls(); button.addEventListener('click',function(e){e.stopPropagation();activate();});
  range.addEventListener('input', function () { volume = Number(range.value) / 100; update(); });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-legacy-id],#dp')) queueMicrotask(update); });
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
        loaded: layers.length === 1 && layers.every(function (l) { return !!l.buffer; }), volume: volume,
        decodedBytes: layers.reduce(function (sum, l) { return sum + (l.buffer ? l.buffer.length * l.buffer.numberOfChannels * 4 : 0); }, 0),
        scene: scene(), targets: targets, error: error, source: 'sanctum-corridor', voiceStarts:voiceStarts, revision: 'corridor-v1'};
    }
  };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
