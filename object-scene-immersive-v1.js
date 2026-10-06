/* Object immersive v1: source-derived artwork. Three.js r128, IIFE. */
(function(){'use strict';
window.H53ObjectSceneV1=function(renderer){
const PI=Math.PI,TAU=PI*2;
const lerp=THREE.MathUtils.lerp,clamp=THREE.MathUtils.clamp;
const scene=new THREE.Scene();
// ---------- backgrounds ----------
function gradTex(stops){const c=document.createElement('canvas');c.width=8;c.height=256;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,0,256);stops.forEach((s,i)=>gr.addColorStop(i/(stops.length-1),s));
  g.fillStyle=gr;g.fillRect(0,0,8,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}

// procedural "cyberspace": deep gradient + neon perspective grid converging to a horizon
function cyberTex(){
  const W=1280,H=1280,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  // vertical gradient
  const gr=g.createLinearGradient(0,0,0,H);
  gr.addColorStop(0,'#05060d'); gr.addColorStop(0.42,'#0a1430'); gr.addColorStop(0.52,'#102a55');
  gr.addColorStop(0.62,'#081026'); gr.addColorStop(1,'#03040a');
  g.fillStyle=gr; g.fillRect(0,0,W,H);
  const hY=H*0.52, vx=W/2;
  // stars
  for(let i=0;i<140;i++){const x=Math.random()*W,y=Math.random()*hY*0.95,r=Math.random()*1.4;
    g.globalAlpha=0.2+Math.random()*0.6; g.fillStyle='#bfe9ff'; g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();}
  g.globalAlpha=1;
  // horizon glow
  const hg=g.createLinearGradient(0,hY-60,0,hY+60);
  hg.addColorStop(0,'rgba(0,200,255,0)'); hg.addColorStop(0.5,'rgba(40,220,255,0.55)'); hg.addColorStop(1,'rgba(0,200,255,0)');
  g.fillStyle=hg; g.fillRect(0,hY-60,W,120);
  // perspective grid (below horizon)
  g.lineWidth=2;
  // radial lines to vanishing point
  for(let i=-12;i<=12;i++){
    const fx=vx + i*(W/10);
    g.strokeStyle = i%2===0 ? 'rgba(60,230,255,0.55)' : 'rgba(190,80,255,0.4)';
    g.beginPath(); g.moveTo(vx, hY); g.lineTo(fx, H); g.stroke();
  }
  // horizontal lines, spacing increases downward
  for(let i=1;i<=16;i++){
    const t=i/16, y=hY + (H-hY)*(t*t);
    g.strokeStyle='rgba(80,220,255,'+(0.5*(1-t)+0.12)+')';
    g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke();
  }
  // vignette
  const vg=g.createRadialGradient(vx,hY,80,vx,hY,W*0.8);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.55)');
  g.fillStyle=vg; g.fillRect(0,0,W,H);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
}
const BGS=[
  {name:'サイバー', tex:cyberTex()},
  {name:'暗',       tex:gradTex(['#10141c','#0b0e15','#05070b'])},
  {name:'グラデ',   tex:gradTex(['#1a2740','#22324f','#0c1018'])},
];
scene.background=BGS[0].tex;

// ---------- environment for reflections ----------
function makeEnvironment(yaw){
const pmrem=new THREE.PMREMGenerator(renderer);
const wasXR=renderer.xr.enabled;renderer.xr.enabled=false;
try{
  const s=new THREE.Scene();s.rotation.y=yaw;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(60,32,16),
    new THREE.MeshBasicMaterial({map:gradTex(['#9fe8ff','#2a6f9c','#13294a','#0a1730','#040a18']),side:THREE.BackSide}));
  s.add(dome);
  const sun=new THREE.Mesh(new THREE.PlaneGeometry(26,26),new THREE.MeshBasicMaterial({color:0xffffff}));
  sun.position.set(-18,26,12);sun.lookAt(0,0,0);s.add(sun);
  const sun2=new THREE.Mesh(new THREE.PlaneGeometry(18,40),new THREE.MeshBasicMaterial({color:0xeaf3ff}));
  sun2.position.set(22,6,-6);sun2.lookAt(0,0,0);s.add(sun2);
  const target=pmrem.fromScene(s,0,0.1,100);
  s.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});
  return target;
}finally{pmrem.dispose();renderer.xr.enabled=wasXR;}
}
const inlineEnvironment=makeEnvironment(0);scene.environment=inlineEnvironment.texture;
let spatialEnvironment=null;
function orientEnvironment(yaw){
 if(spatialEnvironment){spatialEnvironment.dispose();spatialEnvironment=null;}
 if(yaw===null){scene.environment=inlineEnvironment.texture;return;}
 spatialEnvironment=makeEnvironment(yaw);scene.environment=spatialEnvironment.texture;
}

// ---------- lights ----------
scene.add(new THREE.AmbientLight('#eaf2ff',0.5));
const key=new THREE.DirectionalLight('#fff6e8',1.15);
key.position.set(-7,12,9);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.near=1;key.shadow.camera.far=50;
key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=14;key.shadow.camera.bottom=-10;
key.shadow.bias=-0.0004;scene.add(key);
const fill=new THREE.DirectionalLight('#bcd6ff',0.4);fill.position.set(8,4,-6);scene.add(fill);

// ====== the object ======
const root=new THREE.Group(); scene.add(root);
const spinGroup=new THREE.Group(); root.add(spinGroup); // turntable
const tGroup=new THREE.Group(); spinGroup.add(tGroup);  // only the T floats

// ---------- the 3D "T" (magenta->red gradient caps, dark purple sides) ----------
(function(){
  const cbW=4.0, cbH=0.95, stW=1.3, top=8.2, stemBottom=3.5, D=1.0;
  const sh=new THREE.Shape();
  // T outline (centered x=0). crossbar top, stem down.
  sh.moveTo(-cbW/2, top-cbH);
  sh.lineTo(-cbW/2, top);
  sh.lineTo( cbW/2, top);
  sh.lineTo( cbW/2, top-cbH);
  sh.lineTo( stW/2, top-cbH);
  sh.lineTo( stW/2, stemBottom);
  sh.lineTo(-stW/2, stemBottom);
  sh.lineTo(-stW/2, top-cbH);
  sh.closePath();
  const geo=new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:true,bevelThickness:0.05,bevelSize:0.05,bevelSegments:2,curveSegments:4});
  geo.translate(0,0,-D/2);
  geo.computeBoundingBox();
  const ymin=geo.boundingBox.min.y,ymax=geo.boundingBox.max.y;
  const pos=geo.attributes.position; const col=new Float32Array(pos.count*3);
  const cTop=new THREE.Color('#c742ad'), cBot=new THREE.Color('#c0392b'), tmp=new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const k=(pos.getY(i)-ymin)/(ymax-ymin);
    tmp.copy(cBot).lerp(cTop,k*k*0.9+0.1);
    col[i*3]=tmp.r;col[i*3+1]=tmp.g;col[i*3+2]=tmp.b;
  }
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const capMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.4,metalness:0.0,envMapIntensity:0.7});
  const sideMat=new THREE.MeshStandardMaterial({color:'#5a2a82',roughness:0.5,metalness:0.0,envMapIntensity:0.6});
  const t=new THREE.Mesh(geo,[capMat,sideMat]);
  t.castShadow=true; tGroup.add(t);
})();

// ---------- glass text rings around the stem ----------
function textTex(word,opts){
  opts=opts||{};
  const c=document.createElement('canvas'); c.width=1024; c.height=256; const g=c.getContext('2d');
  g.clearRect(0,0,c.width,c.height);
  g.fillStyle='#ffffff'; g.textAlign='center'; g.textBaseline='middle';
  let fs=opts.size||150; g.font='700 '+fs+'px Arimo, Arial, sans-serif';
  while(g.measureText(word).width>c.width*0.9 && fs>30){fs-=6;g.font='700 '+fs+'px Arimo, Arial, sans-serif';}
  // draw once at center → occupies front of cylinder, transparent elsewhere
  g.fillText(word, c.width/2, c.height/2);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8;
  return t;
}
const rings=[];
function ring(word,y,R,h,color,white){
  const grp=new THREE.Group(); grp.position.y=y; spinGroup.add(grp);
  const mat=new THREE.MeshPhysicalMaterial({
    map:textTex(word,{size:white?170:150}),
    color:color, transparent:true, roughness:white?0.15:0.12, metalness:0.0,
    clearcoat:1.0, clearcoatRoughness:0.08, envMapIntensity:1.0,
    emissive:white?'#222':color, emissiveIntensity:white?0.0:0.12, side:THREE.DoubleSide,
    depthWrite:false
  });
  const cyl=new THREE.Mesh(new THREE.CylinderGeometry(R,R,h,80,1,true),mat); grp.add(cyl);
  // faint depth layer behind
  const back=new THREE.Mesh(new THREE.CylinderGeometry(R-0.07,R-0.07,h,80,1,true),
    new THREE.MeshBasicMaterial({map:mat.map,color:white?'#cfeee0':'#0f5a44',transparent:true,opacity:0.5,side:THREE.DoubleSide,depthWrite:false}));
  grp.add(back);
  rings.push({grp, spin:(rings.length % 2 === 0 ? 1 : -1) * 0.6}); // alternate direction per row
  return grp;
}
ring('transcendence',  6.5, 1.85, 0.95, '#37c79a', false);
ring('by',             5.55, 1.7,  0.8,  '#37c79a', false);
ring('deus ex machina',4.6, 1.95, 0.9,  '#37c79a', false);
ring('hiro53',         3.65, 1.7,  0.95, '#ffffff', true);

// ---------- chrome disc stack: top disc FIXED; 2nd-and-below descend, shrink one slot per loop, vanish ----------
const chromeBody=new THREE.MeshPhysicalMaterial({color:'#0a0b0f',metalness:0.15,roughness:0.06,clearcoat:1.0,clearcoatRoughness:0.04,envMapIntensity:1.3});
const chromeRim =new THREE.MeshStandardMaterial({color:'#cfd3da',metalness:1.0,roughness:0.06,envMapIntensity:1.5});
// slot 0 = fixed top; slots grow smaller & lower; last slot = vanished (r~0)
const slotR=[2.05,1.6,1.22,0.88,0.56,0.30,0.02];
const slotY=[3.0, 2.45,1.8, 1.0, 0.0,-1.05,-2.15];
const M=slotR.length-1;            // 6
const DISC_PERIOD=2.4;             // seconds for one slot-to-slot step
function interpSlot(arr,s){ s=clamp(s,0,M); const i=Math.floor(s); if(i>=M)return arr[M]; return arr[i]+(arr[i+1]-arr[i])*(s-i); }
function makeDisc(){
  const grp=new THREE.Group();
  const body=new THREE.Mesh(new THREE.SphereGeometry(1,56,32),chromeBody); body.castShadow=true; grp.add(body);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1,0.05,12,64),chromeRim); rim.rotation.x=PI/2; grp.add(rim);
  spinGroup.add(grp); return {grp,body,rim};
}
// fixed top disc (always at slot 0)
const topDisc=makeDisc();
topDisc.grp.position.y=slotY[0];
topDisc.body.scale.set(slotR[0],slotR[0]*0.17,slotR[0]); topDisc.rim.scale.set(slotR[0],slotR[0],slotR[0]);
// moving discs m=0..M-1 : disc m travels slot m -> slot m+1 over each loop (m=0 emerges hidden behind the fixed top)
const movers=[]; for(let m=0;m<M;m++) movers.push(makeDisc());

// center the object vertically for framing
root.position.y=-3.4;


const sourceChildren=scene.children.slice();
const world=new THREE.Group(); world.name='Object source scene';
sourceChildren.forEach(o=>world.add(o));scene.add(world);
world.add(key.target);world.add(fill.target);
function pose(t){
  rings.forEach(r=>{r.grp.rotation.y=t*r.spin*0.5;});
  tGroup.position.y=Math.sin(t*0.7)*0.18;
  const p=(t%DISC_PERIOD)/DISC_PERIOD;
  movers.forEach((mv,m)=>{
    const s=m+p,r=interpSlot(slotR,s),y=interpSlot(slotY,s);
    mv.grp.position.y=y;mv.body.scale.set(r,r*0.17,r);mv.rim.scale.set(r,r,r);
    const vis=r>0.04;mv.body.visible=vis;mv.rim.visible=vis;
  });
}
function shadowScale(s){
  const c=key.shadow.camera;c.near=s;c.far=50*s;
  c.left=-12*s;c.right=12*s;c.top=14*s;c.bottom=-10*s;c.updateProjectionMatrix();
}
pose(0);
return {scene:scene,world:world,root:root,rings:rings,movers:movers,tGroup:tGroup,
 backgrounds:BGS,pose:pose,shadowScale:shadowScale,orientEnvironment:orientEnvironment,key:key};
};
})();
