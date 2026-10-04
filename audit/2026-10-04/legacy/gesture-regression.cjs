// Runs the unchanged application handlers extracted from their checked-in source.
// DOM events and timers are deterministic stubs: this is source execution, not a Safari/device test.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const rows = [];
const root = require('path').resolve(__dirname, '../../..');
function source(file) { return fs.readFileSync(root + '/' + file, 'utf8'); }
function cut(s, a, b) { return s.slice(s.indexOf(a), s.indexOf(b, s.indexOf(a))); }
function target() { return { handlers: {}, addEventListener(k, f) { (this.handlers[k] ||= []).push(f); }, setPointerCapture() {} }; }
function fire(el, type, extra = {}) { for (const fn of el.handlers[type] || []) fn({ type, ...extra }); }
function context(extra = {}) {
 const window = target(), document = target(); document.hidden = false;
 const ctx = { window, document, performance: { now: () => 100 }, Math, console, ...extra };
 ctx.addEventListener = window.addEventListener.bind(window);
 vm.createContext(ctx); return ctx;
}
function check(name, fn) { fn(); rows.push({ name, pass: true, method: 'Node VM executing extracted source handlers with synthetic events' }); }
for (const [file, start, stop, drag, pinch] of [
 ['object.html', 'let drag=false', '// ---------- UI ----------', 'drag', 'pinch'],
 ['cellwafer.html', 'var camAz =', 'var conv =', 'dragging', 'pinch0']
]) {
 const dom = target(), ctx = context({ renderer: { domElement: dom }, THREE: { Vector3: function() {} }, clamp: (x, a, b) => Math.max(a, Math.min(b, x)) });
 if(file === 'object.html') vm.runInContext('let theta=0,phi=1,radius=17;', ctx);
 vm.runInContext(cut(source(file), start, stop), ctx);
 const finger = (x,y) => ({clientX:x,clientY:y});
 check(file + ': cancelled touch and blur release drag/pinch', () => {
  fire(dom, 'touchstart', { touches: [finger(30,40)] });
  const cancelTarget = file === 'object.html' ? ctx.window : dom;
  fire(cancelTarget, 'touchcancel');
  assert.equal(vm.runInContext(drag,ctx), false); assert.equal(vm.runInContext(pinch,ctx),0);
  fire(dom, 'touchstart', { touches: [finger(30,40)] }); fire(ctx.window,'blur');
  assert.equal(vm.runInContext(drag,ctx),false);
 });
 check(file + ': pinch to single finger resumes from remaining position', () => {
  fire(dom,'touchstart',{touches:[finger(30,40),finger(100,40)]});
  fire(file === 'object.html' ? ctx.window : dom,'touchend',{touches:[finger(100,40)]});
  assert.equal(vm.runInContext(drag,ctx),true);
  assert.equal(vm.runInContext(file === 'object.html' ? 'lx' : 'lastX',ctx),100);
 });
 check(file + ': hidden document clears gesture', () => {
  ctx.document.hidden=true;fire(ctx.document,'visibilitychange');assert.equal(vm.runInContext(drag,ctx),false);
 });
}
{
 const dom=target(),ctx=context({renderer:{domElement:dom},clockTime:0,pumpBeat:()=>ctx.pumps++,pumps:0,MIN_DIST:8,MAX_DIST:26});
 vm.runInContext('var yaw=0,pitch=0,yawVel=0,pitchVel=0,dist=17,lastInteract=0;',ctx);
 vm.runInContext(cut(source('cyberwafer.html'),'var pointers = {};',"renderer.domElement.addEventListener('wheel'"),ctx);
 const down=(id,x,y)=>fire(dom,'pointerdown',{pointerId:id,clientX:x,clientY:y});
 const move=(id,x,y)=>fire(dom,'pointermove',{pointerId:id,clientX:x,clientY:y});
 check('cyberwafer: cancel never triggers heartbeat and release is idempotent',()=>{
  down(1,10,10);fire(dom,'pointercancel',{pointerId:1});fire(dom,'lostpointercapture',{pointerId:1});
  assert.equal(ctx.pumps,0);assert.equal(vm.runInContext('pCount',ctx),0);
 });
 check('cyberwafer: normal pointerup retains heartbeat',()=>{
  down(1,10,10);fire(dom,'pointerup',{pointerId:1});assert.equal(ctx.pumps,1);
 });
 check('cyberwafer: two to one finger has no rotation jump',()=>{
  down(1,10,10);down(2,100,10);move(2,120,10);fire(dom,'pointerup',{pointerId:1});
  const yaw=vm.runInContext('yaw',ctx);move(2,121,10);
  assert.ok(Math.abs(vm.runInContext('yaw',ctx)-yaw+.0052)<1e-10);
  fire(dom,'pointerup',{pointerId:2});assert.equal(ctx.pumps,1);
 });
 check('cyberwafer: coincident pinch remains finite and blur resets state',()=>{
  down(1,10,10);down(2,20,10);move(2,10,10);assert.ok(Number.isFinite(vm.runInContext('dist',ctx)));
  fire(ctx.window,'blur');assert.equal(vm.runInContext('pCount',ctx),0);
 });
}
{
 const dom=target(),ctx=context({renderer:{domElement:dom},orbit:{az:0,el:0,d:17},applyOrbit:()=>{}});
 vm.runInContext(cut(source('lacto-caloris-v2-c15-app.js'),'var pointers={},pinch0=0,dist0=0;',"renderer.domElement.addEventListener('wheel'"),ctx);
 check('lacto caloris: capture loss and blur clear pointer state',()=>{
  fire(dom,'pointerdown',{pointerId:1,clientX:10,clientY:10});fire(dom,'lostpointercapture',{pointerId:1});
  assert.equal(vm.runInContext('Object.keys(pointers).length',ctx),0);
  fire(dom,'pointerdown',{pointerId:1,clientX:10,clientY:10});fire(ctx.window,'blur');
  assert.equal(vm.runInContext('Object.keys(pointers).length',ctx),0);
 });
}
{
 let queued=0,canceled=0;
 const ctx=context({last:0,ready:false,resetPointers(){},requestAnimationFrame:()=>++queued,cancelAnimationFrame:()=>canceled++});
 vm.runInContext(cut(source('lacto-caloris-v2-c15-app.js'),'var frameHandle=0,pageAway=false;','window.__CALORIS='),ctx);
 check('lacto caloris: hidden/pagehide cancel single RAF; pageshow resumes once',()=>{
  assert.equal(ctx.frameHandle,1);
  ctx.document.hidden=true;fire(ctx.document,'visibilitychange');assert.equal(ctx.frameHandle,0);
  vm.runInContext('tick(100);',ctx);assert.equal(queued,1);
  ctx.document.hidden=false;fire(ctx.document,'visibilitychange');assert.equal(ctx.frameHandle,2);
  fire(ctx.window,'pagehide');assert.equal(ctx.frameHandle,0);
  fire(ctx.window,'pageshow');assert.equal(ctx.frameHandle,3);
  vm.runInContext('schedule();',ctx);assert.equal(queued,3);assert.equal(canceled,2);
 });
}
{
 const s=source('earth-origin-material-liquid-v1-20260919-app.js'), cv=target();
 let timer=0, canceled=0, frames=0, delta=.016;
 const ctx=context({cv,drag:true,moved:0,artworkRAF:0,artworkTime:3,pageAway:false,
  clock:{stop(){delta=0;},start(){delta=.016;},getDelta(){return delta;}},
  requestAnimationFrame:()=>++timer,cancelAnimationFrame:()=>canceled++,cancelPending:()=>{},
  onResize(){},EO:{U:{uT:{value:0},uPump:{value:0}},parts:{}},PUMP:.78,look(){},
  renderer:{render(){frames++;}},scene:{},camera:{},liquid:{afterRender(){}},
 });
 vm.runInContext(cut(s,'    function resetGesture(){drag=false;moved=15;}',"    cv.addEventListener('mousedown'"),ctx);
 vm.runInContext(cut(s,'  function animate() {','  window.__H53M ='),ctx);
 check('earth origin: touchcancel releases drag without tap',()=>{
  fire(cv,'touchcancel');assert.equal(ctx.drag,false);assert.equal(ctx.moved,15);
 });
 check('earth origin: hidden and pagehide stop rendering; pageshow resumes once without time jump',()=>{
  vm.runInContext('scheduleArtwork();animate();',ctx);const before=ctx.artworkTime;
  ctx.document.hidden=true;fire(ctx.document,'visibilitychange');vm.runInContext('animate();',ctx);
  assert.equal(frames,1);assert.equal(ctx.artworkRAF,0);
  ctx.document.hidden=false;fire(ctx.document,'visibilitychange');vm.runInContext('animate();',ctx);
  assert.ok(Math.abs(ctx.artworkTime-before-.016)<1e-10);assert.equal(frames,2);
  fire(ctx.window,'pagehide');vm.runInContext('animate();',ctx);assert.equal(frames,2);
  fire(ctx.window,'pageshow');const queued=ctx.artworkRAF;vm.runInContext('scheduleArtwork();',ctx);
  assert.equal(ctx.artworkRAF,queued);vm.runInContext('animate();',ctx);assert.equal(frames,3);assert.ok(canceled>=2);
 });
}
fs.writeFileSync(__dirname+'/gesture-regression.json',JSON.stringify({timestamp:new Date().toISOString(),tests:rows},null,2));
console.log(JSON.stringify(rows,null,2));
