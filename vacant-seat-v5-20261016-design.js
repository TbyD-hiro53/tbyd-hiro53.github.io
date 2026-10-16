/* Art adaptation authorized by the artist. The three instruments retain their
   geometry, displays, timing and picking. The enclosure/furniture are sculptural. */
(function(){'use strict';
H53.applySpeculativeRoom=function(scene,renderer,roots){
 var T=THREE,env=roots.desk.children[0].material.envMap;
 function physical(name,color,metal,rough){var m=new T.MeshPhysicalMaterial({color:color,metalness:metal,roughness:rough,clearcoat:1,clearcoatRoughness:.13,envMap:env,envMapIntensity:1.15});m.name='v5 '+name;return m;}
 var dark=physical('obsidian',0x171d2a,.72,.22),chrome=physical('polished alloy',0xb9c8d4,.94,.20),pale=physical('pale ceramic',0xf2dbe9,.24,.25),floor=physical('black mirror floor',0x151b25,.78,.26);
 function emitter(name,color,power){var m=physical(name,color,.35,.29);m.emissive.set(color);m.emissiveIntensity=power;return m;}
 var pink=emitter('magenta aperture',0xff05a8,1.1),teal=emitter('turquoise aperture',0x00ddc8,1.2),white=emitter('pale aperture',0xf2dbe9,.95);
 var pools={},added=0;
 function add(role,mat,g,pos,rot,scale){var o=new T.Object3D();if(pos)o.position.fromArray(pos);if(rot)o.rotation.set(rot[0],rot[1],rot[2]);if(scale)o.scale.fromArray(scale);o.updateMatrix();g.applyMatrix4(o.matrix);var key=role+'|'+mat.name;if(!pools[key])pools[key]={role:role,mat:mat,geometries:[]};pools[key].geometries.push(g);}
 function box(role,mat,size,pos,rot){add(role,mat,new T.BoxGeometry(size[0],size[1],size[2]),pos,rot);}
 // Chamfered solid with real thickness and softened edges, horizontal in X/Z.
 function plate(role,mat,w,d,h,pos,cut){var c=Math.min(cut||.1,w*.25,d*.25),pts=[[-w/2+c,-d/2],[w/2-c,-d/2],[w/2,-d/2+c],[w/2,d/2-c],[w/2-c,d/2],[-w/2+c,d/2],[-w/2,d/2-c],[-w/2,-d/2+c]],s=new T.Shape();pts.forEach(function(p,i){if(i)s.lineTo(p[0],p[1]);else s.moveTo(p[0],p[1]);});s.closePath();var b=Math.min(.009,h*.18);var g=new T.ExtrudeGeometry(s,{depth:h-2*b,bevelEnabled:true,bevelSegments:3,steps:1,bevelThickness:b,bevelSize:b,curveSegments:1});g.translate(0,0,-h/2+b);add(role,mat,g,pos,[-Math.PI/2,0,0]);}
 function line(role,mat,points,r){var curve=new T.CatmullRomCurve3(points.map(function(p){return new T.Vector3().fromArray(p);}),false,'centripetal');add(role,mat,new T.TubeGeometry(curve,Math.max(20,points.length*8),r,8,false));}
 function arc(role,mat,c,rx,ry,r,a,b){var pts=[];for(var i=0;i<=40;i++){var q=a+(b-a)*i/40;pts.push([c[0]+rx*Math.cos(q),c[1]+ry*Math.sin(q),c[2]]);}line(role,mat,pts,r);}
 function hideChildren(root){root.traverse(function(o){if(o.isMesh)o.visible=false;});}
 // Keep the exterior opening and its six directions. Retire masonry seams and the office ceiling fitting.
 roots.room.traverse(function(o){if(!o.isMesh)return;var m=o.material,n=m.name||'';
  if(n.indexOf('room.wall')===0){o.material=physical('enclosure',0x151a26,.6,.31);}
  if(n.indexOf('room.floor')===0)o.material=floor;
  if(n.indexOf('room.ceil')===0)o.material=dark;
  if(n.indexOf('room.dark')===0||n.indexOf('room.lampFrame')===0||(m.emissiveIntensity>.5&&n.indexOf('room.')!==0))o.visible=false;
 });
 hideChildren(roots.desk);hideChildren(roots.chair);
 // Desk: a suspended lens, a separate lower chassis and a narrow central support.
 plate('desk',dark,1.88,.86,.052,[0,.694,-.35],.18);
 plate('desk',chrome,1.82,.82,.025,[0,.652,-.35],.15);
 plate('desk',dark,1.67,.73,.085,[0,.567,-.35],.16);
 plate('desk',pink,1.62,.68,.012,[0,.614,-.35],.16);
 plate('desk',dark,.56,.46,.42,[0,.27,-.48],.13);
 plate('desk',chrome,.74,.59,.04,[0,.055,-.48],.16);
 for(var s=-1;s<=1;s+=2){
  line('desk',chrome,[[s*.15,.12,-.48],[s*.38,.31,-.49],[s*.69,.53,-.49]],.022);
  for(var i=0;i<9;i++)box('desk',dark,[.025,.055,.54],[s*(.40+i*.048),.571,-.35]);
  box('desk',teal,[.29,.006,.008],[s*.62,.724,-.018]);
 }
 // Empty seat: a ceramic segmented shell in a skeletal, non-office frame.
 var cz=H53.room.CHAIR_Z;
 // Added chair geometry is local to the retained chair root.
 plate('chair',dark,.65,.64,.09,[0,.455,0],.13);
 plate('chair',pale,.53,.51,.035,[0,.517,.035],.09);
 plate('chair',chrome,.62,.56,.035,[0,.374,0],.14);
 plate('chair',dark,.40,.41,.24,[0,.20,-.08],.10);
 for(var j=0;j<9;j++){
  var y=.60+j*.104,w=.51-.17*Math.pow(j/8,1.8),z=-.23-.12*j/8;
  plate('chair',j===8?chrome:pale,w,.065,.077,[0,y,z],.02);
  box('chair',dark,[w-.04,.025,.045],[0,y-.046,z]);
 }
 for(s=-1;s<=1;s+=2){
  line('chair',chrome,[[s*.21,.38,.22],[s*.34,.58,.12],[s*.35,.86,-.22],[s*.28,1.31,-.37],[s*.14,1.57,-.36]],.024);
  line('chair',teal,[[s*.23,.62,-.30],[s*.27,.96,-.33],[s*.20,1.33,-.40],[s*.12,1.48,-.40]],.006);
  plate('chair',dark,.095,.40,.045,[s*.33,.735,.03],.035);
  box('chair',pink,[.006,.01,.28],[s*.367,.76,.035]);
 }
 // A succession of displaced apertures frames absence, without enclosing the window.
 arc('room',chrome,[0,1.10,-3.02],1.17,1.20,.032,Math.PI*.08,Math.PI*.92);
 arc('room',pink,[0,1.10,-3.04],1.10,1.14,.010,Math.PI*.10,Math.PI*.90);
 arc('room',dark,[0,1.10,-3.13],1.33,1.30,.055,Math.PI*.04,Math.PI*.96);
 for(s=-1;s<=1;s+=2){
  line('room',chrome,[[s*.70,.06,-2.12],[s*.98,.45,-2.44],[s*1.18,1.08,-2.63]],.035);
  for(i=0;i<6;i++){
   var z=-2.65+i*.89;
   line('room',dark,[[s*2.37,.02,z],[s*2.36,1.78,z],[s*2.04,2.49,z-.09],[s*.99,2.73,z-.17]],.065);
   line('room',i%2?white:teal,[[s*2.30,.16,z+.02],[s*2.29,1.75,z+.02],[s*1.98,2.43,z-.07]],.009);
   // Narrow fins articulate the wall between the structural ribs.
   for(j=0;j<4;j++)box('room',chrome,[.035,1.91,.016],[s*2.53,1.15,z+.11+j*.13]);
  }
 }
 // Ceiling aperture replaces the four square office panels.
 for(i=0;i<3;i++){
  var g=new T.TorusGeometry(.81+i*.12,.019,10,96);add('room',i===1?white:chrome,g,[0,2.66-i*.022,-.60],[Math.PI/2,0,0],[1,1.4,1]);
 }
 // Floor marks are finite inlaid arcs, not a grid or added text.
 for(i=0;i<4;i++){
  var rr=1.03+i*.26,g2=new T.TorusGeometry(rr,i===0?.008:.0035,6,120,Math.PI*1.62);
  add('room',i===0?teal:chrome,g2,[0,.009,-.95],[-Math.PI/2,0,.60],[1,1.28,1]);
 }
 // Refinish only opaque instrument housings. Their screen textures and mechanisms remain untouched.
 ['terminal','board','metronome'].forEach(function(role){roots[role].traverse(function(o){if(!o.isMesh||Array.isArray(o.material))return;var m=o.material,n=m.name||'';
  if(/^(crt|board|metro)\.case/.test(n)){o.material=physical(role+' black alloy housing',0x25303c,.80,.18);}
  else if(/^(crt|board|metro)\.trim/.test(n)){o.material=chrome;}
 });});
 // Structural side fins around the terminal; its curved face and pedestal stay clear.
 for(s=-1;s<=1;s+=2){
  for(i=0;i<5;i++)box('terminal',i===2?teal:chrome,[.006,.20,.035],[s*(.20+i*.008),0,-.10-i*.019],[0,0,s*.1]);
  box('board',s<0?pink:teal,[.006,.085,.006],[s*.278,.088,.023]);
 }
 // Merge decoration per object/material so the redesign does not add hundreds of draw calls.
 Object.keys(pools).forEach(function(k){var pool=pools[k],count=0,src=[];pool.geometries.forEach(function(g){var q=g.index?g.toNonIndexed():g;src.push(q);count+=q.attributes.position.count;});var out=new T.BufferGeometry();['position','normal','uv'].forEach(function(key){var dim=key==='uv'?2:3,arr=new Float32Array(count*dim),at=0;src.forEach(function(g){var a=g.attributes[key];if(a)arr.set(a.array,at);at+=g.attributes.position.count*dim;});out.setAttribute(key,new T.BufferAttribute(arr,dim));});out.computeBoundingSphere();var m=new T.Mesh(out,pool.mat);m.name='v5-'+pool.role+'-'+added++;m.castShadow=pool.role!=='room';m.receiveShadow=true;m.userData.h53=pool.role;roots[pool.role].add(m);src.forEach(function(g){g.dispose();});pool.geometries.forEach(function(g){g.dispose();});});
 // The new emitters have restrained physical spill; the central objects stay readable.
 var lp=new T.PointLight(0xff05a8,.45,4,2);lp.position.set(0,.55,-.35);scene.add(lp);
 var lt=new T.PointLight(0x00ddc8,.58,5,2);lt.position.set(0,1.65,-2.25);scene.add(lt);
 scene.updateMatrixWorld(true);H53.captureRoom(scene,renderer);
 scene.userData.artAdaptation={revision:'v5',mergedDecorationMeshes:added,instrumentsRetained:['terminal','board','metronome']};
};
})();
