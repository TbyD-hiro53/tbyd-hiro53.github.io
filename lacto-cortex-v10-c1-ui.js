/* Cortex を、公開中 lacto-caloris v2 と同じ共有UI構成へ接続する差し替えアダプタ。
 * 公開版の共有ファイル（h53-liquid-*, composer-liquid-v2, h53-direct-controls, h53-dismiss）と
 * 作品本体 lacto-cortex-v10a.js は一切変更しない。
 * 作品側が持つ在来操作（#sw/#reset/#spin/#zoom/#view-select）を composer-liquid-v2 が拾う、
 * caloris と同じ経路にするための接続だけを行う。 */
(function(root){
  'use strict';
  var api=null,mounted=false,layoutSignature='',zoomValue=50,dockObserver=null;
  var ZOOM_PER_STEP=0.978; /* 遠近スライダは相対操作。公開 caloris の絶対値対応とは異なる */

  function byId(id){return document.getElementById(id);}
  function requestFrame(){if(api&&typeof api.requestFrame==='function')api.requestFrame();}
  function composer(){return root.__composerLiquid||null;}
  function views(){return api?api.views():[];}

  function ensureMeta(attribute,name,content){
    if(!content)return;
    var node=document.head.querySelector('meta['+attribute+'="'+name+'"]');
    if(!node){node=document.createElement('meta');node.setAttribute(attribute,name);document.head.appendChild(node);}
    node.setAttribute('content',content);
  }

  /* 承認済みUI文面をそのまま配る。公開ページでは HTML の meta と .obs が担う役割 */
  function publishCopy(){
    var copy=root.LactoCortexUICopy;
    if(!copy)throw Error('Approved Cortex UI copy is missing');
    var parts=String(copy.about).split('\n\n');
    ensureMeta('property','og:image:alt',copy.title);
    ensureMeta('name','description',parts[0]);
    /* caloris と同じく .obs は伏せたまま置き、composer の「作品について」が読み取る */
    var obs=document.querySelector('.obs');
    if(obs&&parts.length>1)obs.textContent=parts.slice(1).join('\n\n');
  }

  function syncLegacy(){
    var spin=byId('spin');
    if(spin&&api){
      var playing=!!api.getPlaying();
      spin.textContent=playing?'motion':'paused';
      spin.classList.toggle('on',playing);
    }
    var label=byId('current-view');
    if(label&&api){var list=views(),i=api.getViewIndex();if(list[i])label.textContent=list[i].name;}
  }

  function wireLegacy(){
    var sw=byId('sw'),reset=byId('reset'),spin=byId('spin'),zoom=byId('zoom');
    if(!sw||!reset||!spin||!zoom)throw Error('Legacy artwork controls are missing');
    /* composer-liquid-v2 は onclick 属性値を呼ぶので、addEventListener ではなく onclick に置く */
    sw.onclick=function(){var n=views().length;if(n)api.setView((api.getViewIndex()+1)%n);syncLegacy();requestFrame();};
    reset.onclick=function(){api.reset();syncLegacy();requestFrame();};
    spin.onclick=function(){api.setPlaying(!api.getPlaying());syncLegacy();requestFrame();};
    zoomValue=Number(zoom.value);
    zoom.addEventListener('input',function(){
      var next=Number(zoom.value);
      if(!Number.isFinite(next))return;
      var delta=next-zoomValue;zoomValue=next;
      if(delta)api.zoom(Math.pow(ZOOM_PER_STEP,delta));
      requestFrame();
    });
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

  /* 面の開閉は一時的なので、作品のカメラを動かす対象に入れない */
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

  /* 画布ができてから公開版 composer を読み込む。composer 自身は起動時に #app canvas を要求する */
  function loadComposer(){
    var node=document.createElement('script');
    node.src='composer-liquid-v2-20260919.js';
    node.addEventListener('load',function(){watchDock();notifyLayout();requestFrame();setTimeout(function(){watchDock();notifyLayout();},400);});
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
      return {adapter:'caloris-v2-20260922',mounted:mounted,views:mounted?views().length:0,
        playing:mounted?!!api.getPlaying():null,zoomSlider:zoomValue,ownedRAF:false,
        occupancy:getOccupancy(),composer:c?c.report():null};
    }
  };
})(window);
