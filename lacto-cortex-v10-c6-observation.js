/* Cortex observation copy describes visible parts and existing canon only.
 * No per-frame picking, extra renderer, or new artwork clock. */
(function(root){'use strict';
var entries={
 tank:{ja:['上部タンク','淡桃色の液を収めた上部タンク。ガラス越しに液面と気泡が見える。ここから三本の管が培養槽へ下りている。'],en:['Upper reservoir','The upper reservoir holds pale pink liquid. Its surface and bubbles are visible through the glass. Three tubes descend from here to the culture vessel.']},
 feed:{ja:['三本の給養管','上部タンクから皮質へつながる三本の管。管を下る膨らみが送液の脈動を示す。間隔は0.78秒で、心拍ではなく送液機の周期。'],en:['Three feeding tubes','Three tubes connect the upper reservoir to the cortex. Swells moving down them show the pumping pulse: a 0.78-second interval, the pump cycle rather than a heartbeat.']},
 brain:{ja:['皮質','培養槽の中央に置かれた乳脳。表面の細かな凹凸と、周囲の液や光の重なりを近くから観測できる。三本の管から養われる、配列作品の基本単位。'],en:['Cortex','The milk-brain sits at the center of the culture vessel. Observe its fine surface folds and the surrounding layers of liquid and light. Fed through three tubes, it forms the basic unit of the array works.']},
 culture:{ja:['培養槽','透明な円筒の内側に皮質と培養液を収める。曲面を通して見ると、皮質の輪郭や背後の金属の映り込みが変化する。'],en:['Culture vessel','A transparent cylinder encloses the cortex and culture liquid. The curved glass changes the outline of the cortex and the reflections of metal behind it.']},
 controls:{ja:['制御部','下部の金属筐体には表示面と灯が並ぶ。制御部の灯は不規則に明滅するが、誰かに向けた合図ではない。'],en:['Control housing','Displays and lights line the lower metal housing. The control lights flicker irregularly, but they are not signals addressed to anyone.']},
 cables:{ja:['電源ケーブルと接続盤','三本の極太ケーブルが床を這い、炉の背面と壁の接続盤を結ぶ。電力がどこから来るのかは、この部屋の記録には無い。'],en:['Power cables and connection panel','Three thick cables cross the floor between the back of the reactor and the wall connection panel. This room’s records do not say where the power comes from.']},
 turntable:{ja:['円形の回転台','炉を載せる円形の基台。縁や床下の機構まで形が続いている。視点を下げると金属の段差と床への映り込みを観測できる。'],en:['Circular turntable','The reactor stands on a circular base, with structures continuing around its rim and beneath the floor. A low viewpoint reveals the stepped metal and its reflections on the floor.']},
 chamber:{ja:['電波暗室','内径42 mの室に炉が一基だけ据えられている。壁面の突起、天井の輪、床を横切るケーブルが、その大きさを示している。'],en:['Anechoic chamber','A single reactor stands inside a chamber with an inner diameter of 42 m. Wall wedges, the ceiling ring and cables crossing the floor reveal its scale.']}
};
function classify(source,role,point){
 if(/^(brain|brain_pons)$/.test(role))return 'brain';
 if(/^(feed_tube|feed_column|milk_drop|nozzle|crown_puff)$/.test(role)&&source!=='c5-ped-label')return 'feed';
 if(/power-cable|wall-port|reactor-port|wall-penetration|service-|^c11-|^c5-ped/.test(source))return 'cables';
 if(/turntable|^s3-tt-/.test(source))return 'turntable';
 if(/^room_/.test(role))return 'chamber';
 if(role==='milk'||/^mesh(185|186|187|188|189|191|192|193|194|196)$/.test(source))return 'tank';
 if(role==='culture_liquid'||/^mesh(97|98|99|100|101|102|103|104|105|106|107)$/.test(source))return 'culture';
 if(/^(harness_gray|harness_silver|collar|fitting)$/.test(role))return 'culture';
 if(/^(housing_|lcd|fan|led_)/.test(role)||/^rack-/.test(source))return 'controls';
 // Visible machine trim belongs to its surrounding assembly, not to a hidden target.
 if(point&&point.y>1.05)return 'tank';
 if(point&&point.y>-.82&&point.y<1.05)return 'culture';
 return null;
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
root.LactoCortexObservation={entries:entries,classify:classify,mount:mount};
})(window);
