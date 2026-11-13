/* h!ro53 — display recovery. No WebGL probes or changes to the normal render path. */
(function () {
  'use strict';
  var script = document.currentScript, artwork = {};
  try { artwork = JSON.parse(script.getAttribute('data-artwork') || '{}'); } catch (ignore) {}
  var lang = 'ja';
  try { if (localStorage.getItem('h53lang') === 'en') lang = 'en'; } catch (ignore) {}
  var en = lang === 'en', pending = null, shown = false;
  var copy = en ? {
    heading: 'The artwork could not be displayed',
    webgl: 'WebGL drawing could not start in this environment. Check that graphics acceleration is available in your browser, or try another WebGL-capable browser or device. Reloading alone may not resolve this.',
    display: 'The artwork could not finish loading or drawing. You can reload the page, or return to the archive and try again later.',
    still: 'Static preview — the interactive artwork is unavailable.',
    back: 'Back to the archive', reload: 'Reload page', image: 'Open static image',
    imageMissing: 'The preview image is also unavailable. The artwork description is below.'
  } : {
    heading: '作品を表示できませんでした',
    webgl: 'この環境では WebGL による描画を開始できませんでした。ブラウザでグラフィックス処理が利用できるか設定を確認するか、WebGL 対応の別のブラウザや端末でお試しください。再読み込みだけでは解決しない場合があります。',
    display: '作品の読み込み、または描画を完了できませんでした。ページを再読み込みするか、作品一覧に戻り、時間を置いてお試しください。',
    still: '静止画像のプレビューです。作品の操作は現在利用できません。',
    back: '作品一覧へ戻る', reload: 'もう一度読み込む', image: '静止画像を開く',
    imageMissing: 'プレビュー画像も読み込めませんでした。作品の説明を下に表示しています。'
  };
  function make(tag, text, parent) {
    var el = document.createElement(tag);
    if (text) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }
  function show(reason) {
    pending = reason;
    if (!document.body) return;
    if (shown) return;
    shown = true;
    var host = window.__h53Liquid;
    if (host && typeof host.unlock === 'function') {
      host.unlock(); host.blockedUntil = 0;
    }
    var main = make('main');
    main.id = 'h53-display-fallback';
    main.lang = lang;
    main.setAttribute('data-reason', reason === 'webgl' ? 'webgl' : 'display');
    main.setAttribute('aria-labelledby', 'h53-display-title');
    var card = make('div', '', main); card.className = 'h53-display-card';
    make('p', artwork.title || document.title, card).className = 'h53-display-artwork';
    var heading = make('h1', copy.heading, card);
    heading.id = 'h53-display-title'; heading.tabIndex = -1;
    var status = make('p', reason === 'webgl' ? copy.webgl : copy.display, card);
    status.setAttribute('role', 'alert');
    var actions = make('nav', '', card); actions.setAttribute('aria-label', en ? 'Viewing options' : '表示できない時の操作');
    var back = make('a', copy.back, actions);
    back.href = 'index.html' + (location.search.indexOf('skipgc') !== -1 ? '?skipgc' : '');
    var retry = make('button', copy.reload, actions); retry.type = 'button';
    retry.addEventListener('click', function () { location.reload(); });
    var figure = make('figure', '', card);
    var image = make('img', '', figure);
    image.alt = (artwork.title || '') + (en ? ' — static preview' : ' — 静止画像');
    var caption = make('figcaption', copy.still, figure);
    image.addEventListener('error', function () { image.hidden = true; caption.textContent = copy.imageMissing; });
    if (artwork.image) {
      image.src = artwork.image;
      var imageLink = make('a', copy.image, card); imageLink.href = artwork.image;
    } else { image.hidden = true; caption.textContent = copy.imageMissing; }
    make('p', artwork['description_' + lang] || artwork.description_ja || '', card).className = 'h53-display-description';
    make('p', '© 2026 h!ro53 · transcendence by deus ex machina — viewing permitted, reuse prohibited', card).className = 'h53-display-credit';
    main.addEventListener('keydown', function (event) { event.stopPropagation(); });
    main.addEventListener('click', function (event) { event.stopPropagation(); });
    // Hide unusable scene controls rather than leaving an apparently interactive black screen.
    document.documentElement.classList.add('h53-display-failed');
    document.body.appendChild(main);
    heading.focus({ preventScroll: true });
  }
  function ready() {
    // The normal preview is meaningful content in EN, even before an error.
    if (artwork.previewAlt) {
      var preview = document.getElementById('preview');
      if (preview) preview.alt = artwork.previewAlt[lang];
    }
    if (pending) show(pending);
  }
  function reasonFor(error) {
    var message = error && error.message;
    return message === 'Error creating WebGL context.' ||
      message === 'Error creating WebGL context with your selected attributes.' ? 'webgl' : 'display';
  }
  window.H53DisplaySupport = { show: show, reasonFor: reasonFor };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
