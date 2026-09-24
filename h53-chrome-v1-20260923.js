/* 作品ページの共通の操作表記をそろえる（2026-09-23）。
 *
 * ① 一覧へ戻る釦は左上に「戻る」、補助の開閉釦は右上に「メニュー」。
 *    作品ごとに「← index」「← registry」「•••」と揺れていたものを一つにする。
 * ② 作品の操作釦は、意味の取れる英語にする（SW → Next view など）。言語設定に関わらない。
 *    立ち場所・場面の名（机の前・海の駅 など）は作品の地の文なので、言語設定に従う。
 * ③ トップで EN を選んだ閲覧者には、表記と「作品について」の本文を英語で出す。
 *    本文はトップの英語の札（h53-chrome-copy-en）をそのまま使い、新しい英文は書かない。
 *    対象に触れて開く観測記録は英語の原本が無いので、日本語のまま。
 *
 * 作品スクリプトには触らない。文字と置き場所を差し替えるだけで、釦の働き・開閉の状態・
 * 焦点の扱いは各作品のまま。どの作品も釦の文字を読んで状態を決めていないことは確認済み。
 * このファイルは各作品の他の defer script より先に置く（説明文の差し替えを間に合わせるため）。 */
(function(){'use strict';
var slug=location.pathname.split('/').pop().replace('.html','')||'index';
var lang='ja';try{if(localStorage.getItem('h53lang')==='en')lang='en';}catch(e){}
var en=lang==='en';
function merge(){var o={};for(var i=0;i<arguments.length;i++){var m=arguments[i];if(m)for(var k in m)o[k]=m[k];}return o;}

/* ② 操作釦。言語に関わらず英語にする */
var CONTROLS={
 '*':{'SW':'Next view','TOUR':'Tour','ERA':'Era','視点リセット':'Reset view','next shot':'Next shot','deploy':'Deploy','stow':'Stow','遠 ⟷ 近':'Far ⟷ Near','origin':'Origin','視線を戻す':'Reset view'},
 'armillary':{'全景':'Overview','中景':'Middle','環':'Rings','核':'Core','縁':'Rim','motion':'Pause','paused':'Resume'},
 'armillary-v2':{'全景':'Overview','中景':'Middle','レンズ':'Lenses','核':'Core','縁':'Rim','motion':'Pause','paused':'Resume'},
 'sanctum':{'全景':'Overview','斜め':'Oblique','真上':'From above','環':'Ring','受け':'Cradle','motion':'Pause','paused':'Resume'},
 'lacto-cortex':{'タンク':'Tank','脳':'Brain','下部':'Lower','電源盤':'Power panel','回転台':'Turntable','motion':'Pause','paused':'Resume'},
 /* 四つ目の視点は機械の背後（z −3.3）の接続盤を映している。説明文の語に合わせる */
 'lacto-caloris':{'brain':'Brain','turntable':'Turntable','radiator':'Radiator','pedestal':'Connector panel'},
 'cortex-pylon':{'視点':'Next view','リセット':'Reset view','自動回転':'Auto-rotate'},
 'object':{'背景: サイバー':'Background: Cyber','背景: 暗':'Background: Dark','背景: グラデ':'Background: Gradient'},
 /* 釦は「収束」と「CONVERGE」を重ねた札。共有の操作列はその字を連ねて写すので、漢字の側を空にする */
 'cellwafer':{'CONVERGE':'Converge','収束':''},
 'coastal-glass':{'沈み途中':'Sunset','夜間':'Night'}
};
/* 立ち場所・場面の名。英語は正典の英語の札にある語 */
var PLACES={
 'vacant-seat':{'机の前':'Before the desk','椅子の背後':'Behind the chair'},
 'preservation-hall':{'架の脇':'Beside a pod','端末の前':'Before the terminal','戸':'The door'},
 'confluence':{'岸の道':'Shore path','円盤の真下':'Beneath a disc','床の切れ目':'Gap in the floor'},
 /* 視点の名は正典の英語の札（station by the sea / lines above and below / looking towards an immense tree）と、
    各場面の叙述（低い建物と長い廊下、壁の刻み、包の載った給養口）に合わせて付けた */
 'the-changes':{'海の駅':'Station by the sea','大きい駅':'Great station','車内':'Carriage',
  '旧い建物':'The old building','元の部屋':'The former room','隣の刻み':'The next recess',
  '上下の線':'Lines above and below','待合':'Waiting room','給養口':'Feed hatch',
  '樹を望む席':'Seat facing the tree','根のそば':'Beside the roots'},
 /* 四つの立ち場所は漢数字の札。英語表示では算用数字にする（名は正典の英語の札にあるが、釦は番号のまま） */
 'earth-origin-material':{'一':'1','二':'2','三':'3','四':'4'}
};
/* 視点の名（メニューの状態欄・巡回の字幕に出る）。英語表示のときだけ替える。短い語でも作品固有の語なので場所を問わない */
var VIEWS_A={'タンク&ネオン':'Tank & neon','ネオン':'Neon','冷却ファン':'Cooling fan','回転LCD':'Rotating LCD','正対':'Head-on','脳核':'Brain core','脳核一周':'Brain core orbit','送電網':'Power grid'};
var VIEWS={
 'cortex-pylon':{'上部梁':'Upper beam','全景':'Overview','文字リング':'Text ring','炉心':'Core','見上げ':'Looking up'},
 'lacto-empyrean':merge(VIEWS_A,{'ラック滑走':'Rack glide','低空滑走':'Low glide','単体':'Single unit','回廊':'Corridor','大聖堂':'Cathedral'}),
 'lacto-mandala':merge(VIEWS_A,{'供給ライン':'Supply line','供給網':'Supply network','円環軸':'Ring axis','参道低空':'Low over the approach','外周回廊':'Outer corridor','曼荼羅':'Mandala','直径縦断':'Across the diameter'}),
 'armillary':{'全景':'Overview','中景':'Middle','環':'Rings','核':'Core','縁':'Rim'},
 'armillary-v2':{'全景':'Overview','中景':'Middle','レンズ':'Lenses','核':'Core','縁':'Rim'},
 'sanctum':{'全景':'Overview','斜め':'Oblique','真上':'From above','環':'Ring','受け':'Cradle'}
};
/* ③ 共通の表記 */
var UI={
 '戻る':'Back','作品一覧へ戻る':'Back to the archive','入口へ戻る':'Back to the archive','registry':'Back to the archive',
 'メニュー':'Menu','閉じる':'Close','補助メニュー':'Menu','補助メニューを開く':'Open menu','補助メニューを閉じる':'Close menu','その他の操作':'Menu',
 '作品について':'About this work','メニューへ戻る':'Back to menu','作品の操作':'Work controls',
 '全画面':'Fullscreen','全画面表示':'Fullscreen','全画面を解除':'Exit fullscreen',
 'UIを隠す':'Hide UI','UIを表示':'Show UI','操作を表示':'Show controls','操作表示を隠す':'Hide controls',
 '作品単独ページを開く':'Open the work on its own','作品を単独で開く':'Open the work on its own',
 'この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。':'Fullscreen is not available in this browser. Even when the work is opened on its own, the system or browser bars may remain.',
 'このブラウザでは作品コンテナを全画面化できない。通常表示で鑑賞できる。OS・ブラウザの操作欄は、この作品から非表示にできない。':'This browser cannot show the work fullscreen. It can be viewed as it is. The system and browser bars cannot be hidden from within the work.',
 '目次':'Contents','目次を閉じる':'Close contents',
 '再開':'Resume','一時停止':'Pause','動きを止める':'Pause motion','動きを再生':'Play motion','動きを再開する':'Resume motion',
 '動く風景へ':'Moving view','静止画で見る':'View as a still',
 '画質・動き':'Quality & motion','画質':'Quality','自動':'Auto','高':'High','軽量':'Light','風と水面の細かな動きを減らす':'Reduce fine motion of wind and water',
 '観測する対象':'Objects to observe','立ち場所':'Places to stand','場面':'Scene','場所':'Scene','視点':'View','遠近':'Distance',
 '夕景':'Evening','日没':'Sunset','残照':'Afterglow','夕闇':'Twilight',
 '決裁履歴を遡る':'Seek back through the approvals','ページの先頭へ':'Back to top',
 '作品情報':'About this work','作品説明':'About this work','全画面にする':'Fullscreen','全画面を終了':'Exit fullscreen','全画面表示です':'In fullscreen','通常表示です':'In normal view',
 'このブラウザは、作品と操作UIを含む全画面表示に対応していません。':'This browser does not support fullscreen for the work and its controls.',
 'この環境では全画面表示を開始できませんでした。':'Fullscreen could not be started here.',
 'この表示枠では全画面表示が許可されていません。':'Fullscreen is not permitted in this frame.',
 'この表示環境では全画面表示が許可されませんでした。':'Fullscreen was not permitted here.',
 'アプリ内で開いている場合は、Safariなどの通常ブラウザでも確認できます。全画面への対応はブラウザによって異なります。':'If this is open inside an app, try a regular browser such as Safari. Fullscreen support differs between browsers.',
 '全画面表示がブラウザに拒否されました。単独ページでお試しください。':'The browser refused fullscreen. Please try the work on its own page.',
 '全画面表示を開始できませんでした。単独ページでお試しください。':'Fullscreen could not be started. Please try the work on its own page.',
 'TAP — 会長召喚':'TAP — summon the Chairman','TAP — 走査印字':'TAP — fire it again','TAP — 滴下増幅':'TAP — amplify the drip',
 '浮遊ガラス物体の観測記録':'Observation log of a floating glass-like object',
 '対象一覧':'Objects',
 'ドラッグで見渡す · 対象に触れて記録を読む':'Drag to look around · touch a thing to read its record',
 'ドラッグ・矢印キーで見渡す':'Drag or use the arrow keys to look around','対象に触れて記録を読む':'Touch a thing to read its record',
 '1–3：移動　Space：一時停止':'1–3: move   Space: pause','R：視線を戻す　H：操作表示':'R: reset view   H: controls',
 '読みかけの位置があります':'You have a saved reading position','続きから':'Continue','最初から':'From the start'
};
/* 記号だけの釦に、読み上げ用の名を与える（小説の読書帯） */
var NAMED={szDn:['文字を小さく','Smaller text'],szUp:['文字を大きく','Larger text'],upBtn:['ページの先頭へ','Back to top']};
/* 読み込み中の表示など、後ろに進み具合が付くもの（前方一致） */
var UI_PREFIX=[
 ['作品を読み込んでいます','Loading the work'],['素材と光を読み込んでいます','Loading materials and light'],
 ['景観を準備しています','Preparing the view'],['風景を整えています','Preparing the view'],
 ['空間を開いています','Opening the space'],['空間を準備しています','Preparing the space'],
 ['画面の向きを調整しています','Adjusting to the screen orientation']
];

var controls=merge(CONTROLS['*'],CONTROLS[slug]);
var ui=en?merge(UI,PLACES[slug]):{};
var views=en?(VIEWS[slug]||{}):{};

var BACK_ID=/^(back|composerBack|legacyThreeBack)$/;
var MENU_ID=/^(menuToggle|h53-menu-toggle|more)$/;
function isBack(a){
 if(a.tagName!=='A')return false;
 var h=a.getAttribute('href')||'';
 return BACK_ID.test(a.id)||/^(\.\/)?index\.html(\?[^#]*)?(#.*)?$/.test(h)||h==='/'||h==='./';
}
function isMenu(b){return b.tagName==='BUTTON'&&(MENU_ID.test(b.id)||/^(•••|⋯|\.\.\.)$/.test((b.textContent||'').trim()));}

/* 釦・札の中の文字だけを見る（地の文は触らない） */
var CONTROL_SEL='button,a,label,option,summary,[role="button"],[role="tab"]';
function swap(node,map){
 var t=node.nodeValue,k=t.trim();if(!k)return;
 if(Object.prototype.hasOwnProperty.call(map,k)){var v=map[k];if(v!==k)node.nodeValue=t.replace(k,v);return true;}
}
function textIn(el,fn){
 var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n,list=[];
 while((n=w.nextNode()))list.push(n);
 for(var i=0;i<list.length;i++)fn(list[i]);
}
function relabelText(n){
 var p=n.parentElement;if(!p||p.closest('script,style,noscript'))return;
 var inControl=!!p.closest(CONTROL_SEL);
 if(inControl&&swap(n,controls))return;
 if(!en)return;
 if(swap(n,views))return;
 /* 三字以下の語（高・戸・視点 など）は地の文にも現れうるので、釦・見出し・状態表示の中だけで替える */
 var k0=n.nodeValue.trim();
 if(k0.length>3||inControl||p.closest('h1,h2,h3,h4,legend,[role="status"],[aria-live]')){if(swap(n,ui))return;}
 var k=n.nodeValue.trim();
 for(var i=0;i<UI_PREFIX.length;i++)if(k.indexOf(UI_PREFIX[i][0])===0){n.nodeValue=n.nodeValue.replace(UI_PREFIX[i][0],UI_PREFIX[i][1]);return;}
 about(n);
}
function relabelAttrs(el){
 if(!en)return;
 ['aria-label','title'].forEach(function(a){var v=el.getAttribute(a);if(v&&Object.prototype.hasOwnProperty.call(ui,v))el.setAttribute(a,ui[v]);});
}
/* Code Rain 三作と白地の図像二作（svg）は、戻る・メニューが下の隅にあった。
   釦の見た目はその置き場（#crLiquidControls／#svgLiquidControls）に書かれているので、
   移し替えずに置き場の中で上の隅へ上げる。上端の題字はその分だけ下げる（css() 参照）。
   それ以外で左上／右上に無い作品だけ、隅の置き場へ移す。
   すでに上端の帯（composer・legacy・liquid-menu 等）に並んでいるものは動かさない
   （帯は flex で左右に振り分けているので、片方だけ抜くと並びが崩れる） */
var MOVE={
 'chrome-liturgy':{tr:'menuToggle'},'coastal-glass':{tr:'menuToggle'},'binary-dusk':{tr:'menuToggle'},'confluence':{tr:'more'}
}[slug]||{};
var corners={};
function corner(side){
 if(!corners[side]){var c=document.createElement('div');c.className='h53-corner h53-corner-'+side;document.body.appendChild(c);corners[side]=c;}
 return corners[side];
}
function place(){
 ['tl','tr'].forEach(function(side){
  var el=MOVE[side]&&document.getElementById(MOVE[side]);
  if(!el||el.parentElement===corners[side])return;
  /* 作品側が釦を元の帯へ戻し続けるなら、奪い合わずに諦める */
  var n=(+el.dataset.h53Moved||0)+1;if(n>3)return;el.dataset.h53Moved=n;
  corner(side).appendChild(el);
  /* 開く面を、その釦の下へ */
  var id=el.getAttribute('aria-controls'),panel=id&&document.getElementById(id);
  if(side==='tr'&&panel)panel.classList.add('h53-panel-tr');
 });
}
function unify(el){
 var nm=NAMED[el.id];if(nm&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',nm[en?1:0]);
 if(isBack(el)){
  el.classList.add('h53-back');
  var label=en?'Back':'戻る';
  /* 矢印や英字の札を一語にする。子要素を持つ札は「←」＋ index/registry の形のときだけ */
  var cur=el.textContent.trim();
  if(cur!==label&&(el.children.length===0||/^[←\s]*(index|registry)$/i.test(cur)))el.textContent=label;
  el.setAttribute('aria-label',en?'Back to the archive':'作品一覧へ戻る');
 }else if(isMenu(el)){
  el.classList.add('h53-menu-btn');
  var m=en?'Menu':'メニュー';
  if(el.children.length===0&&el.textContent.trim()!==m)el.textContent=m;
 }
}
function pass(root){
 if(root.nodeType===3){relabelText(root);return;}
 if(root.nodeType!==1)return;
 if(root.matches('a,button'))unify(root);
 relabelAttrs(root);
 var els=root.querySelectorAll('a,button,[aria-label],[title]');
 for(var i=0;i<els.length;i++){unify(els[i]);relabelAttrs(els[i]);}
 textIn(root,relabelText);
}

/* ③ 「作品について」の本文。英語の札に差し替える */
var copy=(window.H53_CHROME_EN||{})[slug],jaDesc='';
var descMeta=document.querySelector('meta[name="description"]');
if(descMeta)jaDesc=descMeta.getAttribute('content')||'';
function enAbout(){if(!copy)return '';var s=copy.desc;if(copy.frag)s+='\n\n'+(copy.phase?copy.phase+'\n':'')+copy.frag;return s;}
/* 作品独自の説明面で、ページの説明文とは別の日本語を出す作品。値は英語の札から作る */
var ABOUT={
 'coastal-glass':{'世界各地に突如出現したcyberwafer。世間には、その正体が分からない浮遊ガラス物体として認識されている。本作は、その一体と周辺環境を記録した観測ログである。':function(){return copy.desc.replace(/^Observation log of a floating glass-like object\s*/,'');}},
 'binary-dusk':{'巨大樹の枝から、二つの日と地上を観測する。日が沈んだ後も、列車と円盤は運動を続ける。':function(){return copy.desc;},'SUNSETで日没を開始。三分で小さい日が沈み、その後は夕闇が続く。':function(){return '';}}
}[slug]||{};
function about(n){
 if(!copy)return;
 var k=n.nodeValue.trim();if(!k||k.length<=30)return;
 if(Object.prototype.hasOwnProperty.call(ABOUT,k)){n.nodeValue=ABOUT[k]();return;}
 /* 作品独自の説明面が、元の日本語の説明文をそのまま出したとき */
 if(jaDesc&&(k===jaDesc||k.indexOf(jaDesc)===0))n.nodeValue=enAbout();
}
if(en&&copy){
 /* 共有の説明面（composer・legacy・svg・code-rain）は meta description と .hint/.obs を読む。
    それらが読まれる前に英語へ入れ替えておく */
 if(descMeta)descMeta.setAttribute('content',copy.desc);
 var hint=document.querySelector('.hint'),obs=document.querySelector('.obs');
 if(hint)hint.textContent='';
 if(obs)obs.textContent=copy.frag?(copy.phase?copy.phase+'\n':'')+copy.frag:'';
}

function css(){
 var s=document.createElement('style');s.id='h53-chrome-css';
 s.textContent=[
  /* 戻る＝左上、メニュー＝右上の置き場。中の釦は元の見た目のまま、位置だけを隅に固定する */
  '.h53-corner{position:fixed;top:calc(14px + env(safe-area-inset-top));z-index:40;display:flex;pointer-events:none}',
  '.h53-corner-tl{left:calc(16px + env(safe-area-inset-left))}',
  '.h53-corner-tr{right:calc(16px + env(safe-area-inset-right))}',
  '.h53-corner>*{position:relative!important;inset:auto!important;transform:none!important;margin:0!important;pointer-events:auto}',
  '.h53-panel-tr{position:fixed!important;top:calc(70px + env(safe-area-inset-top))!important;right:calc(16px + env(safe-area-inset-right))!important;bottom:auto!important;left:auto!important;transform:none!important;max-height:calc(100dvh - 96px - env(safe-area-inset-top) - env(safe-area-inset-bottom));overflow:auto}',
  /* 戻る・メニューの字は全作品で同じ大きさにする（作品ごとに 11px の等幅〜16px と揺れていた） */
  'a.h53-back,button.h53-menu-btn,#composerToggle,#legacyThreeToggle{min-height:44px;white-space:nowrap;display:inline-flex!important;align-items:center;justify-content:center;padding:0 16px!important;font:500 13px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue","Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif!important;letter-spacing:.04em!important;text-transform:none!important;text-decoration:none!important}',
  '#crLiquidControls #back,#svgLiquidControls #back,#crLiquidControls #menuToggle,#crLiquidControls #showUI,#svgLiquidControls #menuToggle,#svgLiquidControls #showUI{top:calc(14px + env(safe-area-inset-top))!important;bottom:auto!important}',
  '#crLiquidControls #menu,#svgLiquidControls #menu{top:calc(70px + env(safe-area-inset-top))!important;bottom:auto!important;left:auto!important;right:calc(16px + env(safe-area-inset-right))!important;transform:none!important}',
  'body.code-rain-liquid #hudTL,body.code-rain-liquid #hudTR{top:calc(68px + env(safe-area-inset-top))!important}',
  'button.h53-menu-btn{width:auto!important;min-width:44px}',
  /* Confluence：狭い画面では題字が右上に寄る。右上のメニューと重ならないよう、その下へ下げる */
  '@media(max-width:620px){body[data-h53-chrome=confluence] #hint{top:calc(68px + env(safe-area-inset-top))!important;left:16px!important;right:16px!important}}',
  /* 著作権表記：作品ごとに 8〜9px で読めなかった。色の控えめさはそのまま、字だけ 10px にそろえる。
     下の操作列は表記の上端を実測して避ける（h53-direct-controls）ので、高さが増えても重ならない */
  '.h53-copy,#cr,#copyright,body[data-h53-chrome=chrome-liturgy]>footer{font-size:10px!important;letter-spacing:.02em!important}',
  /* Chrome Liturgy：521px 以上と横向きでは題字が右上に並ぶ。右上へ移したメニューの下へ一段下げる */
  '@media(min-width:521px),(max-height:500px){body[data-h53-chrome=chrome-liturgy] header #title{margin-top:52px}}',
  /* 横向き（高さ 520px 以下）の重なり。Caloris は視点の釦を上に置くので作品名は左下のまま、
     The Changes は右上の案内をメニューの手前で折り返す */
  '@media(max-height:520px) and (orientation:landscape){body[data-h53-chrome=lacto-caloris] .composer-title{top:auto!important;right:auto!important;left:calc(22px + env(safe-area-inset-left))!important;bottom:calc(var(--h53-copy-clear,30px) + 4px)!important;max-width:40%}',
  'body[data-h53-chrome=the-changes] #hud{right:calc(112px + env(safe-area-inset-right))!important;max-width:none!important}}',
  /* Caloris：作品名は左下。著作権表記（10px・狭い画面で二行）の上端を実測した値の上に置く */
  'body[data-h53-chrome=lacto-caloris] .composer-title{bottom:calc(var(--h53-copy-clear,32px) + 2px)!important}',
  /* Cellwafer：漢字と英字を重ねた札を、英語の一語にする */
  'body[data-h53-chrome=cellwafer] #cvBtn .jp{display:none}',
  'body[data-h53-chrome=cellwafer] #cvBtn .en{font-size:13px;letter-spacing:.08em}',
  /* The Changes：段の名。英語表示のとき */
  'body[data-h53-lang=en][data-h53-work=the-changes] #views::before{content:"View"!important}',
  'body[data-h53-lang=en][data-h53-work=the-changes] #scenes::before{content:"Scene"!important}'
 ].join('\n');
 document.head.appendChild(s);
}

/* Code Rain 三作：左下の観測記録（#hudBL）・中央の案内（#hint）が著作権表記と同じ高さに固定されていて、
   狭い画面では三つが重なっていた。表記の上端を測り、その上に置く。記録と案内が横に重なるときだけ案内を一段上げる */
function stackCodeRain(){
 if(slug.indexOf('code-rain')!==0)return;
 var copy=document.querySelector('.h53-copy'),hud=document.getElementById('hudBL'),hint=document.getElementById('hint');
 function shown(e){return e&&!e.hidden&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0;}
 /* 値が変わるときだけ書く（書いた変更で監視が再び呼ぶので、同じ値の書き直しで循環させない） */
 function set(e,v){if(e&&e.style.bottom!==v)e.style.bottom=v;}
 function lay(){
  var base=shown(copy)?Math.ceil(innerHeight-copy.getBoundingClientRect().top)+6:34,up=base;
  if(shown(hud))set(hud,base+'px');
  if(!hint)return;
  if(shown(hud)&&shown(hint)){
   /* 案内の字の幅は、いまの位置に関係なく横方向だけで判定できる */
   var a=hud.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(hint);var t=r.getBoundingClientRect();
   if(t.left<a.right+8&&t.right>a.left)up=base+Math.ceil(a.height)+6;
  }
  set(hint,up+'px');
 }
 lay();addEventListener('resize',lay);
 if(window.ResizeObserver){var ro=new ResizeObserver(lay);[copy,hud,hint].forEach(function(e){if(e)ro.observe(e);});}
 /* 案内と記録は作品側が後から出し入れする。出入りのたびに測り直す */
 [hud,hint].forEach(function(e){if(e)new MutationObserver(lay).observe(e,{attributes:true,childList:true,characterData:true,subtree:true});});
}
function start(){
 document.body.setAttribute('data-h53-chrome',slug);
 document.body.setAttribute('data-h53-lang',lang);
 css();pass(document.body);place();stackCodeRain();
 new MutationObserver(function(list){
  place();
  for(var i=0;i<list.length;i++){
   var m=list[i];
   if(m.type==='characterData')relabelText(m.target);
   else if(m.type==='attributes'){relabelAttrs(m.target);if(m.attributeName==='href'||m.attributeName==='id')unify(m.target);}
   else for(var j=0;j<m.addedNodes.length;j++)pass(m.addedNodes[j]);
  }
 }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','href','id']});
}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
window.__h53Chrome={lang:lang,slug:slug};
})();
