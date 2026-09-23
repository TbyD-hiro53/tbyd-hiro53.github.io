/* h53-diag v1（2026-09-23）：URL に ?diag を付けたときだけ動く計測表示。付けなければ何もしない。
 * 作品の見た目・動作には触れない（計測のために WebGL と requestAnimationFrame の呼び出しを数えるだけ）。
 * 作品の script より前に、defer なしで読み込む（getContext を先に包むため）。
 *
 *   fps / gap   画面更新の回数と、最大の間隔（2 秒ごと）
 *   js          1 フレームあたりの requestAnimationFrame 処理時間（作品の描画命令＋共有 UI の取り込み）
 *   gpu         1 秒に 1 回、処理の直後に gl.finish() で待った時間（GPU の仕事の目安）
 *   draws       1 フレームあたりの描画命令の数（全 canvas の合計）
 *   cap         共有 UI が canvas を取り込んだ回数/フレームと、その時間
 *   dpr / win / vv   端末の画素比、窓の大きさ、ページ自体の拡大率（ピンチでページごと拡大されていれば 1 より大きい）
 *   cv          WebGL canvas の実画素
 *   mut / rs / vvev  DOM の変更、resize、visualViewport のイベントの毎秒の回数 */
(function(){
  'use strict';
  if(!/[?&]diag(=|&|$)/.test(location.search))return;
  var ctxs=[],draws=0,caps=0,capMs=0,jsMs=0,gpuMs=-1,frames=0,worst=0,last=0,muts=0,rs=0,vvev=0,gpuDue=false,box=null;
  var getContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type){
    var c=getContext.apply(this,arguments);
    if(c&&/webgl/i.test(String(type))&&ctxs.indexOf(c)<0)ctxs.push(c);
    return c;
  };
  function wrap(P){
    if(!P)return;
    ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced'].forEach(function(n){
      var f=P[n];if(typeof f!=='function')return;
      P[n]=function(){draws++;if(!this.__h53diag){this.__h53diag=1;if(ctxs.indexOf(this)<0)ctxs.push(this);}return f.apply(this,arguments);};
    });
    ['texImage2D','texSubImage2D'].forEach(function(n){
      var f=P[n];if(typeof f!=='function')return;
      P[n]=function(){
        if(!(arguments[arguments.length-1] instanceof HTMLCanvasElement))return f.apply(this,arguments);
        var a=performance.now(),r=f.apply(this,arguments);capMs+=performance.now()-a;caps++;return r;
      };
    });
  }
  wrap(window.WebGLRenderingContext&&WebGLRenderingContext.prototype);
  wrap(window.WebGL2RenderingContext&&WebGL2RenderingContext.prototype);

  var raf=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=function(cb){
    return raf(function(t){
      var a=performance.now();
      try{cb(t);}finally{jsMs+=performance.now()-a;}
    });
  };

  function finishAll(){
    var a=performance.now();
    for(var i=0;i<ctxs.length;i++){try{if(!ctxs[i].isContextLost())ctxs[i].finish();}catch(e){}}
    return performance.now()-a;
  }
  function f1(x){return (Math.round(x*10)/10).toFixed(1);}
  var t0=performance.now(),gpuAt=t0;
  function loop(now){
    raf(loop);
    if(last){var g=now-last;if(g>worst)worst=g;}
    last=now;frames++;
    if(gpuDue){gpuDue=false;gpuMs=finishAll();}
    if(now-gpuAt>1000){gpuAt=now;gpuDue=true;}
    var dt=now-t0;
    if(dt<2000||!box)return;
    var vv=window.visualViewport,n=Math.max(1,frames),s=dt/1000,cv=[];
    for(var i=0;i<ctxs.length;i++){var c=ctxs[i].canvas;if(c&&c.width)cv.push(c.width+'x'+c.height);}
    box.textContent=
      'fps '+Math.round(frames/s)+'  gap '+Math.round(worst)+'ms\n'+
      'js '+f1(jsMs/n)+'ms/f  gpu '+(gpuMs<0?'-':f1(gpuMs)+'ms')+'\n'+
      'draws '+Math.round(draws/n)+'/f  cap '+f1(caps/n)+'/f '+f1(capMs/n)+'ms\n'+
      'dpr '+(window.devicePixelRatio||1)+'  win '+innerWidth+'x'+innerHeight+'\n'+
      'vv '+(vv?vv.scale.toFixed(2)+' '+Math.round(vv.width)+'x'+Math.round(vv.height)+' @'+Math.round(vv.offsetLeft)+','+Math.round(vv.offsetTop):'-')+'\n'+
      'cv '+cv.join(' ')+'\n'+
      'mut '+Math.round(muts/s)+'/s  rs '+Math.round(rs/s)+'/s  vvev '+Math.round(vvev/s)+'/s';
    t0=now;frames=0;worst=0;draws=0;caps=0;capMs=0;jsMs=0;muts=0;rs=0;vvev=0;
  }
  raf(loop);
  addEventListener('resize',function(){rs++;});
  if(window.visualViewport){visualViewport.addEventListener('resize',function(){vvev++;});visualViewport.addEventListener('scroll',function(){vvev++;});}
  function mount(){
    box=document.createElement('pre');box.id='h53-diag';box.setAttribute('aria-hidden','true');
    box.style.cssText='position:fixed;left:6px;top:calc(env(safe-area-inset-top) + 64px);z-index:2147483647;margin:0;padding:5px 7px;'+
      'font:10px/1.35 ui-monospace,Menlo,monospace;color:#bff;background:rgba(0,0,0,.62);border-radius:6px;pointer-events:none;white-space:pre';
    box.textContent='diag …';
    document.body.appendChild(box);
    new MutationObserver(function(list){
      for(var i=0;i<list.length;i++){if(!box.contains(list[i].target))muts++;}
    }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});
  }
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
})();
