/* Observation copy: CANON ASSET 14 and visible structures. Tap-only picking. */
(function(root){'use strict';
var entries={"brain": {"ja": ["培養脳", "中央帯の培養脳が、18段72基の演算トレイを統率する。ガラスの内側には大脳・小脳・橋が収まり、液と光を通して淡い桃色の表面が見える。"], "en": ["Cultured brain", "The brain in the central band marshals seventy-two computing trays across eighteen levels. Cerebrum, cerebellum and pons sit behind the glass, their pale pink surfaces seen through liquid and light."]}, "culture": {"ja": ["培養槽と給養", "透明な槽は培養脳と液を収める。槽の周囲には給養のための配管とポンプが接続されている。液の中では小さな気泡が上がり続ける。"], "en": ["Culture vessel and feeding", "The transparent vessel holds the cultured brain and liquid. Feeding pipes and pumps connect around it. Small bubbles rise through the liquid."]}, "radiator": {"ja": ["30枚の放熱板", "大気のない場所では、熱は輻射でしか捨てられない。頂部の30枚の薄板は、負荷に応じて螺旋状に開く。操作を閉じて「stow / deploy」で、薄板が筒へ戻る動きも観測できる。"], "en": ["Thirty radiator plates", "In a vacuum, heat can be shed only by radiation. Thirty thin plates at the crown open into a helix as the load demands. Close this panel and use stow / deploy to watch them fold back into the drum."]}, "compute": {"ja": ["18段の演算面", "前面240度に、18段72基の演算トレイが並ぶ。三色の小さな灯はほとんど点灯し、ときどき個別に消える。中央の帯は、その盤を数え続けている。"], "en": ["Eighteen computing levels", "Seventy-two computing trays line eighteen levels across the front 240 degrees. Small lights in three colours remain mostly lit, occasionally going dark individually. The central band keeps counting the boards."]}, "service": {"ja": ["背面の接続区画", "背面120度には、電力・冷媒・神経幹の区画がある。六条の神経幹は隔壁を通り、背面のカートリッジから全18段へ分岐する。表の演算面と、裏の接続がひとつの筐体をつくる。"], "en": ["Rear service sector", "The rear 120 degrees contain power, coolant and nerve trunks. Six nerve trunks pass through bulkheads and branch from the rear cartridges to all eighteen levels. Computing faces and rear connections share one housing."]}, "band": {"ja": ["数え続ける帯", "中央の帯では、脳が七十二の盤を数え続けている。数えることが仕事なのか、数え終わることが仕事なのかは、仕様書のどこにも書かれていない。"], "en": ["The counting band", "In the central band the brain goes on counting seventy-two boards. Whether the work is the counting, or the having counted, is written nowhere in the specification."]}, "base": {"ja": ["回転台と基台", "装置は円形の回転台の上に据えられている。足元には筐体を支える段差や接続部がある。視点を下げると、縁と床の映り込みが重なって見える。"], "en": ["Turntable and base", "The engine stands on a circular turntable. Stepped supports and connections sit at its foot. Lower the viewpoint to see the rim overlap with its reflection in the floor."]}, "chamber": {"ja": ["電波暗室", "内径42 mの電波暗室に、装置が一基だけ置かれている。壁のくさび状の吸収体と、機械から離れて広がる床が、その大きさを示している。"], "en": ["Anechoic chamber", "One engine stands in an anechoic chamber forty-two metres across. Wedge-shaped absorbers and the floor spreading away from the machine reveal its scale."]}};
function classify(source,role){
 if(role==='brain')return 'brain';
 if(/^(glass|liquid|bubble|milk_resin|perfusion_outlet|insulating_collar)$/.test(role)||/vat-|perfusion|culture/.test(source))return 'culture';
 if(/^fin_/.test(role)||/fin[0-9]/.test(source))return 'radiator';
 if(role==='band')return 'band';
 if(/^(floor|chamber_shell|wedge|frame_building)$/.test(role))return 'chamber';
 if(role==='turntable'||/base|pedestal/.test(source))return 'base';
 if(/^(tri_|module_strip|pcb|comp|plate|blade|bulkhead)/.test(role))return 'compute';
 if(/^(coolant|power_strap|nerve|smoked_glass)/.test(role)||/nerve|cdu|pump|power|rear|c8-/.test(source))return 'service';
 return 'service';
}
var mounted=false;
function mount(api,composer){
 if(mounted)return;mounted=true;
 var canvas=api.canvas,active=new Set(),tap=null;
 canvas.setAttribute('aria-label','作品。ドラッグで回転、ホイールや二本指で拡大縮小。部位をタップして観測。Enterキーで観測一覧。');
 canvas.addEventListener('pointerdown',function(e){
  if(e.button!==0||composer.host.blocked)return;
  active.add(e.pointerId);
  if(active.size!==1){tap=null;return;}
  tap={id:e.pointerId,x:e.clientX,y:e.clientY,start:performance.now()};
 });
 canvas.addEventListener('pointermove',function(e){if(tap&&tap.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>7)tap=null;});
 canvas.addEventListener('pointerup',function(e){
  var t=tap;tap=null;active.delete(e.pointerId);
  if(!t||t.id!==e.pointerId||active.size||performance.now()-t.start>650||Math.hypot(e.clientX-t.x,e.clientY-t.y)>7||composer.host.blocked)return;
  var key=api.pick(e.clientX,e.clientY);if(key)composer.observe(key,{x:e.clientX,y:e.clientY},canvas);
 });
 function cancel(e){active.delete(e.pointerId);tap=null;}
 canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
 canvas.addEventListener('wheel',function(){tap=null;},{passive:true});
 root.addEventListener('blur',function(){active.clear();tap=null;});
 document.addEventListener('visibilitychange',function(){if(document.hidden){active.clear();tap=null;}});
 canvas.addEventListener('keydown',function(e){if(e.key==='Enter'&&!composer.host.blocked){e.preventDefault();e.stopPropagation();composer.observations(canvas,canvas);}});
}
root.LactoCalorisObservation={entries:entries,classify:classify,mount:mount};
})(window);
