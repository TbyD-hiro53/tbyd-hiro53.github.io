/* Cortex を、公開中 lacto-caloris v2 と同じ共有UI構成へ接続する差し替えアダプタ。
 * 公開版の共有ファイル（h53-liquid-*, composer-liquid-v2, h53-direct-controls, h53-dismiss）は無改変。
 * c2：視点ごとに釦を置く（caloris と同じ方式）。composer が dock に写す id は
 * sw / reset / spin / tour / era / dp / fr の 7 つに固定なので、そこへ割り当てる。 */
(function(root){
  'use strict';
  var api=null,mounted=false,layoutSignature='',dockObserver=null;

  /* 並びは composer の id 順（sw → reset → spin → tour → era → dp）がそのまま dock の並び */
  var VIEW_BUTTONS=[
    {id:'sw',    key:'c-tank',      label:'タンク'},
    {id:'reset', key:'c-brain',     label:'脳'},
    {id:'spin',  key:'c-lower',     label:'下部'},
    {id:'tour',  key:'c-panel',     label:'電源盤'},
    {id:'era',   key:'c-turntable', label:'回転台'}
  ];
  var MOTION_ID='dp';

  function byId(id){return document.getElementById(id);}
  function requestFrame(){if(api&&typeof api.requestFrame==='function')api.requestFrame();}
  function composer(){return root.__composerLiquid||null;}
  function views(){return api?api.views():[];}
  function indexOfKey(key){
    var list=views(),i;
    for(i=0;i<list.length;i++)if(list[i].key===key)return i;
    return -1;
  }

  function ensureMeta(attribute,name,content){
    if(!content)return;
    var node=document.head.querySelector('meta['+attribute+'="'+name+'"]');
    if(!node){node=document.createElement('meta');node.setAttribute(attribute,name);document.head.appendChild(node);}
    node.setAttribute('content',content);
  }

  function publishCopy(){
    var copy=root.LactoCortexUICopy;
    if(!copy)throw Error('Approved Cortex UI copy is missing');
    var parts=String(copy.about).split('\n\n');
    ensureMeta('property','og:image:alt',copy.title);
    ensureMeta('name','description',parts[0]);
    var obs=document.querySelector('.obs');
    if(obs&&parts.length>1&&!obs.textContent.trim())obs.textContent=parts.slice(1).join('\n\n');
  }

  function syncLegacy(){
    if(!api)return;
    var now=api.getViewIndex(),i,b;
    for(i=0;i<VIEW_BUTTONS.length;i++){
      b=byId(VIEW_BUTTONS[i].id);
      if(b)b.classList.toggle('on',indexOfKey(VIEW_BUTTONS[i].key)===now);
    }
    var m=byId(MOTION_ID);
    if(m){var playing=!!api.getPlaying();m.textContent=playing?'motion':'paused';m.classList.toggle('on',playing);}
    var label=byId('current-view'),list=views();
    if(label&&list[now])label.textContent=list[now].name;
  }

  function wireLegacy(){
    var i,b,missing=[];
    VIEW_BUTTONS.forEach(function(v){
      b=byId(v.id);
      if(!b){missing.push(v.id);return;}
      if(indexOfKey(v.key)<0){missing.push(v.key);return;}
      b.textContent=v.label;
      /* composer-liquid-v2 は onclick 属性値を呼ぶので addEventListener ではなく onclick に置く */
      b.onclick=(function(key){return function(){
        var n=indexOfKey(key);if(n>=0)api.setView(n);syncLegacy();requestFrame();};})(v.key);
    });
    b=byId(MOTION_ID);
    if(!b)missing.push(MOTION_ID);
    else b.onclick=function(){api.setPlaying(!api.getPlaying());syncLegacy();requestFrame();};
    if(missing.length)throw Error('Cortex controls missing: '+missing.join(','));
    /* 拡大縮小は作品面で直接（ホイール・二本指）。釦もスライダも置かない。
       行き過ぎは作品側の constrain() が床・壁・機械・盤で止める。 */
    syncLegacy();
  }

  function shownRect(node){
    if(!node||node.hidden||node.closest('[hidden]')||!node.getClientRects().length)return null;
    var r=node.getBoundingClientRect();
    return {id:node.id||node.className,x:r.left,y:r.top,width:r.width,height:r.height};
  }

  function getOccupancy(){
    var probe=byId('cortexSafeArea');
    if(!mounted||!probe)return {ready:false,viewport:[innerWidth,innerHeight],persistent:[],transient:[],safeArea:{top:0,right:0,bottom:0,left:0}};
    var s=getComputedStyle(probe),safe={top:parseFloat(s.paddingTop)||0,right:parseFloat(s.paddingRight)||0,bottom:parseFloat(s.paddingBottom)||0,left:parseFloat(s.paddingLeft)||0};
    var persistent=[byId('composerBack'),byId('composerToggle'),document.querySelector('.composer-title'),byId('composerShow'),byId('composerPrimary')];
    return {ready:true,viewport:[innerWidth,innerHeight],safeArea:safe,
      persistent:persistent.map(shownRect).filter(Boolean),
      transient:[byId('composerMenu')].map(shownRect).filter(Boolean)};
  }

  function notifyLayout(){
    if(!mounted)return;
    var geometry=getOccupancy();
    var signature=JSON.stringify({viewport:geometry.viewport,safeArea:geometry.safeArea,persistent:geometry.persistent});
    if(signature===layoutSignature)return;
    layoutSignature=signature;
    if(api&&typeof api.onLayout==='function')api.onLayout(geometry);
    requestFrame();
  }

  function watchDock(){
    var dock=byId('composerPrimary');
    if(!dock||dockObserver||typeof ResizeObserver!=='function')return;
    dockObserver=new ResizeObserver(notifyLayout);
    dockObserver.observe(dock);
  }

  /* 画布ができてから公開版 composer を読み込む（composer は起動時に #app canvas を要求する） */
  function loadComposer(){
    var node=document.createElement('script');
    node.src='composer-liquid-v2-20260919.js';
    node.addEventListener('load',function(){watchDock();notifyLayout();requestFrame();setTimeout(function(){watchDock();notifyLayout();syncLegacy();},400);});
    node.addEventListener('error',function(){document.documentElement.dataset.uiError='共有UIの composer を読み込めませんでした。';});
    document.body.appendChild(node);
  }

  function mount(options){
    if(mounted)return root.LactoCortexUI;
    ['views','getViewIndex','setView','reset','zoom','getPlaying','setPlaying','requestFrame'].forEach(function(k){
      if(!options||typeof options[k]!=='function')throw Error('Cortex UI API missing '+k);
    });
    if(!options.canvas)throw Error('Cortex UI requires the final artwork canvas');
    api=options;
    publishCopy();
    wireLegacy();
    mounted=true;
    loadComposer();
    root.addEventListener('resize',notifyLayout);
    root.addEventListener('orientationchange',notifyLayout);
    document.addEventListener('fullscreenchange',notifyLayout);
    document.addEventListener('webkitfullscreenchange',notifyLayout);
    if(root.visualViewport){root.visualViewport.addEventListener('resize',notifyLayout);root.visualViewport.addEventListener('scroll',notifyLayout);}
    notifyLayout();
    return root.LactoCortexUI;
  }

  function busy(){var c=composer();return !!(c&&c.host&&c.host.ui&&typeof c.host.ui.busy==='function'&&c.host.ui.busy());}

  function afterRender(now){
    if(!mounted||document.hidden)return;
    syncLegacy();
    if(root.H53ComposerLiquid)root.H53ComposerLiquid.afterRender(now);
    if(busy())requestFrame();
  }

  function isEventOwned(event){
    if(!mounted||!event||!event.target)return false;
    var shell=document.querySelector('.composer-shell');
    var c=composer();
    if(c&&c.host&&c.host.blocked)return true;
    return !!(shell&&shell.contains(event.target));
  }

  root.LactoCortexUI={
    mount:mount,sync:syncLegacy,afterRender:afterRender,busy:busy,
    getOccupancy:getOccupancy,isEventOwned:isEventOwned,
    report:function(){
      var c=composer();
      return {adapter:'caloris-v2-c3-20260922',mounted:mounted,views:mounted?views().length:0,
        viewButtons:VIEW_BUTTONS.map(function(v){return {id:v.id,key:v.key,index:mounted?indexOfKey(v.key):-1};}),
        playing:mounted?!!api.getPlaying():null,ownedRAF:false,
        occupancy:getOccupancy(),composer:c?c.report():null};
    }
  };
})(window);
