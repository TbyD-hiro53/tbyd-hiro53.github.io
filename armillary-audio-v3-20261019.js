/* Armillary audio preview v3: retained outside air, recorded rotation/hologram Foley and actual electrical arcing synchronized to visible arcs. */
(function () {
  'use strict';
  function boot() {
  var binary = location.pathname.indexOf('binary-dusk') >= 0;
  var work = binary ? 'binary-dusk' : location.pathname.indexOf('armillary-v2')>=0 ? 'armillary-v2' : 'armillary';
  var menu = document.getElementById(binary ? 'menu' : 'composerMenu'), menuButton = document.getElementById(binary ? 'menuToggle' : 'composerToggle');
  if (!menu || !menuButton) { setTimeout(boot, 200); return; }
  var host = binary ? window.__h53Liquid : window.__composerLiquid && window.__composerLiquid.host;
  // Composer's default host has no scene scheduler. Reuse the artwork's existing
  // deduplicated render request when UI changes while motion is paused. An empty
  // tune call changes no visual parameter and does not advance the scene clock.
  if (!binary && host && window.ArmillaryArtwork) {
    function requestArtworkFrame() { window.ArmillaryArtwork.tune({}); }
    host.requestFrame = requestArtworkFrame;
    host.ui.invalidate = requestArtworkFrame;
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', requestArtworkFrame);
      window.visualViewport.addEventListener('scroll', requestArtworkFrame);
    }
  }
  var en = false;
  try { en = localStorage.getItem('h53lang') === 'en'; } catch (_) {}
  function text(ja, english) { return en ? english : ja; }
  var style = document.createElement('style');
  style.textContent = '#h53-audio-controls[hidden]{display:none!important}#h53-audio-controls{pointer-events:auto;position:fixed;right:calc(16px + env(safe-area-inset-right));top:calc(14px + env(safe-area-inset-top));z-index:40;display:flex;gap:8px;align-items:center}#h53-audio-controls #menuToggle,#h53-audio-controls #composerToggle{position:static!important;inset:auto!important;margin:0!important;transform:none!important}#h53-audio-toggle{width:44px;min-width:44px;height:44px;min-height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;line-height:1}#h53-audio-toggle svg{width:22px;height:22px;display:block;pointer-events:none}#h53-audio-toggle[aria-busy=true]{opacity:.65}.h53-audio-row,.h53-audio-credits,.h53-audio-status{grid-column:1/-1;min-width:0;margin:0;padding:8px 12px;font:12px/1.7 system-ui;color:inherit;background:transparent}.h53-audio-row{display:flex;align-items:center;gap:12px;min-height:44px}.h53-audio-row input{min-width:0;flex:1;width:120px}.h53-audio-credits{max-width:290px;overflow-wrap:anywhere}.h53-audio-credits summary{min-height:44px;cursor:pointer}.h53-audio-credits a{color:inherit}.h53-audio-status:empty{display:none}@media(max-width:620px){body[data-h53-chrome=binary-dusk] #masthead{top:calc(70px + env(safe-area-inset-top))!important;right:16px!important}}.h53-outdoor-audio-settings{flex-shrink:0;min-width:0}body:has(#menu:not([hidden])) #controls{visibility:hidden;pointer-events:none}#menu.h53-panel-tr{max-height:calc(100dvh - 84px - var(--h53-copy-clear, 40px) - env(safe-area-inset-top))}';
  document.head.appendChild(style);
  var group = binary ? menuButton.parentElement : document.createElement('div'), button = document.createElement('button');
  if (!binary) { menuButton.before(group); group.appendChild(menuButton); }
  group.id = 'h53-audio-controls';
  button.id = 'h53-audio-toggle'; button.type = 'button'; button.className = 'glass pill chrome';
  button.dataset.h53Liquid = 'control'; button.dataset.h53AudioControl = '';
  menuButton.before(button);
  if (host) {
    host.ui.register(button, {kind: 'control'});
    host.requestFrame();
  }
  function followMenu() { var anchor=binary && document.getElementById('controls'); group.hidden = menuButton.hidden || !!(anchor && anchor.hidden) || document.body.classList.contains('immersive'); }
  new MutationObserver(followMenu).observe(menuButton, {attributes: true, attributeFilter: ['hidden']});
  new MutationObserver(followMenu).observe(document.body, {attributes:true, attributeFilter:['class']});
  if (binary) new MutationObserver(followMenu).observe(document.getElementById('controls'), {attributes:true,attributeFilter:['hidden']});
  followMenu();
  var settings = document.createElement('div'); settings.className='h53-outdoor-audio-settings';
  var container=binary?menu:document.getElementById('composerMenuContent');
  container.appendChild(settings);
  if (!binary) new MutationObserver(function(){if(window.__composerLiquid.report().view==='menu'&&!container.contains(settings))container.appendChild(settings);}).observe(container,{childList:true});
  var row = document.createElement('label'), range = document.createElement('input');
  row.className = 'h53-audio-row'; row.appendChild(document.createTextNode(text('音量', 'Volume')));
  range.type = 'range'; range.min = 0; range.max = 100; range.value = 55;
  range.setAttribute('aria-label', text('音量', 'Sound volume'));
  row.appendChild(range); settings.appendChild(row);
  var credits = document.createElement('details'); credits.className = 'h53-audio-credits';
  var summary = document.createElement('summary'); summary.textContent = text('音源', 'Sound credits'); credits.appendChild(summary);
  function credit(label, url) {
    var a = document.createElement('a'); a.textContent = label; a.href = url;
    a.target = '_blank'; a.rel = 'noopener'; credits.append(a, document.createElement('br'));
  }
  credit('Wind in the grass — waweee · Freesound', 'https://freesound.org/people/waweee/sounds/517995/');
  credit('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/');
  credits.appendChild(document.createTextNode(text('山の草を通る風の録音。録音を抜粋し、帯域・音量・ピーク・継ぎ目を調整。', 'Recorded mountain grass wind; excerpt, with EQ, gain, peaks and loop edited.')));
  credits.appendChild(document.createElement('br'));
  credit('Near the ocean.wav — Kyster · Freesound', 'https://freesound.org/people/Kyster/sounds/165580/');
  credit('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/');
  credits.appendChild(document.createTextNode(text('海岸の砂丘付近の風を、遠い外気として少量混合。抜粋・帯域・音量・ピーク・ループを調整。', 'Wind near coastal dunes, mixed quietly as distant air; excerpt, EQ, level, peaks and loop edited.')));
  credits.appendChild(document.createElement('br'));
  credit('ConveyorLoop.wav — oldestmillennial · Freesound', 'https://freesound.org/people/oldestmillennial/sounds/538210/');
  credit('CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/');
  credit('Camera lens servo — humanoide9000 · Freesound', 'https://freesound.org/people/humanoide9000/sounds/336556/');
  credit('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/');
  credits.appendChild(document.createTextNode(text('実録の機械音を加工し、回転と内部の像に合わせています。抜粋・音程・逆再生・帯域・音量・ループを調整。', 'Recorded mechanical Foley edited for rotation and the internal image: excerpts, pitch, reversal, EQ, level and loops adjusted.')));
  credits.appendChild(document.createElement('br'));
  credit('Electric Sparks, Railway, A.wav — InspectorJ (www.jshaw.co.uk) · Freesound', 'https://freesound.org/people/InspectorJ/sounds/412313/');
  credit('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/');
  credits.appendChild(document.createTextNode(text('鉄道の接点で起きた放電の実録。短い連続した火花の部分を抜粋し、帯域・音量・立ち上がりを調整しています。', 'Recorded electrical arcing at railway contacts, excerpted into brief crackling clusters with EQ, level and edge fades.')));
  settings.appendChild(credits);
  var status = document.createElement('span'); status.className = 'h53-audio-status'; status.setAttribute('role', 'status'); settings.appendChild(status);

  var context = null, layers = [], loading = null, enabled = false, away = false;
  var volume = .55, timer = 0, serial = 0, error = null, channel = null;
  var tabId = Math.random().toString(36), targets = null;
  var sparkVoices=[], sparksPlayed=0, lastSparkSequence=null, lastSparkTime=-100, lastSparkEnd=-100, lastSpark=null, previousSceneTime=null;
  var bufferCache={}, effectState=null;
  var definitions={grass:['outdoor-audio-v1-20261019-grass.mp3',29],coast:['outdoor-audio-v1-20261019-coast.mp3',59],rotation:['device-audio-v2-20261019-rumble.mp3',24],hologram:['armillary-audio-v2-20261019-hologram.mp3',14],spark1:['armillary-audio-v3-20261019-spark1.mp3',0.43],spark2:['armillary-audio-v3-20261019-spark2.mp3',0.5],spark3:['armillary-audio-v3-20261019-spark3.mp3',0.45]};
  var airTime=0, lastAirTime=performance.now();
  function scene() {
    if (!binary) {
      if (!window.ArmillaryArtwork || !window.ArmillaryUI) return null;
      var state=window.ArmillaryArtwork.report(), ui=window.ArmillaryUI.report();
      if (!state.ready) return null;
      effectState=window.ArmillaryArtwork.audioState();
      return {running:ui.playing, time:state.time, view:state.view, effects:effectState};
    }
    var pause=document.getElementById('pause'), loading=document.getElementById('loading'), problem=document.getElementById('error');
    var now=performance.now(), running=!!pause && !pause.disabled && pause.getAttribute('aria-pressed')!=='true' && loading.hidden && problem.hidden;
    if (running && !document.hidden && !away) airTime+=Math.min((now-lastAirTime)/1000,.3);
    lastAirTime=now;
    return {running:running,time:airTime,view:innerHeight>innerWidth?'portrait':'landscape'};
  }
  function mix(s) {
    var near={wide:.68,mid:.58,rings:.48,core:.40,rim:.75}[s.view]||.55;
    var coast={wide:.12,mid:.08,rings:.055,core:.035,rim:.14}[s.view]||.08;
    var m={grass:near*(1+.045*Math.sin(s.time*.12)),coast:coast,grassCutoff:6000,coastCutoff:1900,grassPan:0,coastPan:0};
    var closeness={wide:.35,mid:.68,rings:1,core:.8,rim:.56}[s.view]||.5;
    s.effects.rings.forEach(function(r,i){
      var speed=Math.max(0,Math.min(1,r.rps/1.3));
      m['rotation'+i]=closeness*(.045+.12*speed);
      m['rotation'+i+'Rate']=.72+speed*.55;
      m['rotation'+i+'Cutoff']=350+speed*430;
      m['rotation'+i+'Pan']=Math.max(-.35,Math.min(.35,r.axis[0]*.22+[-.10,.08,-.04,.12][i]));
    });
    var h=s.effects.hologram,transition=Math.max(0,1-h.age/h.transition);
    m.hologram=({wide:.20,mid:.40,rings:.48,core:.78,rim:.24}[s.view]||.3)*(1+.12*transition);
    m.hologramRate={brain:.87,metronome:1,wafer:1.13}[h.name]||1;
    m.hologramCutoff=({brain:1800,metronome:2300,wafer:2900}[h.name]||2200)+transition*350;
    m.hologramPan=.06*Math.sin(s.time*.14);return m;
  }
  function stopSparks() {
    if (!context) return;
    sparkVoices.forEach(function(v){v.gain.gain.cancelScheduledValues(context.currentTime);v.gain.gain.setTargetAtTime(0,context.currentTime,.01);try{v.source.stop(context.currentTime+.05);}catch(_){}});
    sparkVoices=[];lastSparkSequence=null;lastSparkEnd=-100;
  }
  function sparks(s) {
    var e=s.effects;
    if(lastSparkSequence===null){lastSparkSequence=e.sequence;return;}
    var candidates=e.sparks.filter(function(x){return x.id>lastSparkSequence&&x.visible&&x.brightness>.88&&s.time-x.time<.26;});
    lastSparkSequence=e.sequence;
    if(!candidates.length||s.time-lastSparkTime<.32||sparkVoices.length>=1||context.currentTime<lastSparkEnd+.075)return;
    candidates.sort(function(a,b){return b.brightness-a.brightness;});var event=candidates[0];
    var record=bufferCache['spark'+(event.id%3+1)];if(!record||!record.buffer)return;
    var source=context.createBufferSource(),gain=context.createGain(),pan=context.createStereoPanner?context.createStereoPanner():null;
    source.buffer=record.buffer;gain.gain.value=volume*.85*event.brightness/(1+event.distance*.065);
    source.connect(gain);if(pan){pan.pan.value=Math.max(-.8,Math.min(.8,event.x*.7));gain.connect(pan);pan.connect(context.destination);}else gain.connect(context.destination);
    var v={source:source,gain:gain,pan:pan};sparkVoices.push(v);
    source.onended=function(){source.disconnect();gain.disconnect();if(pan)pan.disconnect();var i=sparkVoices.indexOf(v);if(i>=0)sparkVoices.splice(i,1);};
    source.start();lastSparkTime=s.time;lastSparkEnd=context.currentTime+source.buffer.duration;sparksPlayed++;lastSpark={id:event.id,visualTime:event.time,audioSceneTime:s.time,latency:s.time-event.time,pan:pan?pan.pan.value:0};
  }
  function stopLayer(layer) {
    if (!layer.voice) return;
    var voice = layer.voice; layer.voice = null;
    var now = context.currentTime;
    voice.fade.gain.cancelScheduledValues(now);
    voice.fade.gain.setTargetAtTime(0, now, .025);
    try { voice.source.stop(now + .15); } catch (_) {}
  }
  function stop() { layers.forEach(stopLayer); stopSparks(); }
  function clearTimer() { clearInterval(timer); timer = 0; }
  function update() {
    var s = scene();
    if (s) targets = mix(s);
    if (!context || !enabled || away || document.hidden || !s || !s.running || context.state !== 'running') { stop(); return; }
    var now = context.currentTime;
    if(previousSceneTime!==null&&(s.time<previousSceneTime||s.time-previousSceneTime>1)){stopSparks();lastSparkTime=s.time;}
    previousSceneTime=s.time;
    layers.forEach(function (layer) {
      if (!layer.buffer) return;
      // Re-align after a scene-time discontinuity without restarting on every frame.
      if (layer.voice && Math.abs(layer.voice.sceneTime + now - layer.voice.started - s.time) > 1.5) stopLayer(layer);
      if (!layer.voice) {
        var source = context.createBufferSource(), fade = context.createGain();
        source.buffer = layer.buffer; source.loop = true;source.playbackRate.value=targets[layer.name+'Rate']||1;
        fade.gain.value = 0; source.connect(fade); fade.connect(layer.filter);
        source.onended = function () { source.disconnect(); fade.disconnect(); };
        layer.voice = {source: source, fade: fade, sceneTime: s.time, started: now};
        source.start(now, (((s.time+(layer.offset||0)) % layer.buffer.duration) + layer.buffer.duration) % layer.buffer.duration);
        fade.gain.setTargetAtTime(1, now, .06);
      }
      layer.voice.source.playbackRate.setTargetAtTime(targets[layer.name+'Rate']||1,now,.35);
      layer.gain.gain.setTargetAtTime(volume * targets[layer.name], now, .45);
      layer.filter.frequency.setTargetAtTime(targets[layer.name + 'Cutoff'], now, .45);
      if (layer.pan) layer.pan.pan.setTargetAtTime(targets[layer.name + 'Pan'], now, .14);
    });
    sparks(s);
  }
  function controls() {
    if (!enabled) button.removeAttribute('aria-busy');
    var label = enabled ? text('音を消す', 'Mute sound') : text('音を入れる', 'Enable sound');
    button.setAttribute('aria-label', label); button.title = label; button.setAttribute('aria-pressed', String(enabled));
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h4l5-4v14l-5-4H3z"/>' + (enabled ? '<path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>' : '<path class="audio-slash" d="M3 3l18 18"/>') + '</svg>';
    if (host) host.requestFrame();
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
        layers = ['grass', 'coast','rotation0','rotation1','rotation2','rotation3','hologram'].map(function (name) {
          var filter = context.createBiquadFilter(), gain = context.createGain();
          filter.type = 'lowpass'; filter.Q.value = .5; gain.gain.value = 0;
          filter.connect(gain);
          var pan = context.createStereoPanner ? context.createStereoPanner() : null;
          if (pan) { gain.connect(pan); pan.connect(context.destination); } else gain.connect(context.destination);
          return {name: name, key:name.indexOf('rotation')===0?'rotation':name,offset:name.indexOf('rotation')===0?Number(name.slice(-1))*5.37:0,filter: filter, gain: gain, pan: pan, buffer: null, voice: null};
        });
      }
      await context.resume();
      if (ticket !== serial || !enabled) return;
      if (!layers.every(function (layer) { return !!layer.buffer; })) {
        button.setAttribute('aria-busy', 'true'); status.textContent = text('音を準備しています', 'Loading sound');
        if (!loading) loading = Promise.all(Object.keys(definitions).map(async function(key){
          if(bufferCache[key]&&bufferCache[key].buffer)return;
          var d=definitions[key],response=await fetch(d[0]);if(!response.ok)throw Error('Audio '+response.status);
          var decoded=await context.decodeAudioData(await response.arrayBuffer()),start=Math.round(.1*decoded.sampleRate),count=Math.round(d[1]*decoded.sampleRate);
          if(decoded.length<start+count)throw Error('Audio length');
          var buffer=context.createBuffer(decoded.numberOfChannels,count,decoded.sampleRate);
          for(var ch=0;ch<decoded.numberOfChannels;ch++)buffer.copyToChannel(decoded.getChannelData(ch).subarray(start,start+count),ch);
          bufferCache[key]={buffer:buffer};
        })).then(function(){layers.forEach(function(l){l.buffer=bufferCache[l.key].buffer;});}).finally(function(){loading=null;});
        await loading;
      }
      if (ticket !== serial || !enabled) return;
      button.removeAttribute('aria-busy'); status.textContent = '';
      if (!timer && !away && !document.hidden) timer = setInterval(update, 60);
      update();
    } catch (e) { if (ticket === serial) fail(e); }
  }
  controls(); button.addEventListener('click', function(e){e.stopPropagation(); activate();});
  range.addEventListener('input', function () { volume = Number(range.value) / 100; update(); });
  document.addEventListener('click', function (e) { if (e.target.closest('#pause,[data-legacy-id],#sunset')) queueMicrotask(update); });
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
        if (enabled && !away && !document.hidden) { if (!timer) timer = setInterval(update, 60); update(); }
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
        loaded: layers.length === 7 && layers.every(function (l) { return !!l.buffer; }), volume: volume,
        decodedBytes:Object.keys(bufferCache).reduce(function(sum,key){var b=bufferCache[key].buffer;return sum+b.length*b.numberOfChannels*4;},0),sparksPlayed:sparksPlayed,activeSparks:sparkVoices.length,lastSpark:lastSpark,
        scene: scene(), targets: targets, error: error, source: work, revision: 'armillary-audio-v3'};
    }
  };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
