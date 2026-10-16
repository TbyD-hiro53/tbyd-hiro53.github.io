/* v7: coherent support paths and quiet, integrated architecture.
 * Original window/exterior, three instruments, displays and mechanisms retained.
 * Applied after the original geometry receives its UV transfer; old meshes hidden. */
(function(){'use strict';
H53.applySpeculativeRoom=function(scene,renderer,roots){
 var T=THREE,env=roots.desk.children[0].material.envMap;
 function physical(name,color,metal,rough){var m=new T.MeshPhysicalMaterial({color:color,metalness:metal,roughness:rough,clearcoat:.28,clearcoatRoughness:.3,envMap:env,envMapIntensity:.8});m.name='v7 '+name;return m;}
 var dark=physical('graphite ceramic',0x262a31,.32,.38),chrome=physical('satin titanium',0x929ba4,.85,.31),pale=physical('porcelain',0xcac2c5,.12,.37),floor=physical('honed mineral floor',0x22262d,.32,.36),wall=physical('enclosure',0x242833,.25,.42),black=physical('recess',0x080b0e,.12,.65);
 var white=physical('concealed diffuser',0xdad6d6,.05,.6);white.emissive.set(0xf2e4e9);white.emissiveIntensity=.65;
 var pools={},added=0,assemblyParts=[];
 function add(role,mat,g,pos,rot,scale,label){var o=new T.Object3D();if(pos)o.position.fromArray(pos);if(rot)o.rotation.set(rot[0],rot[1],rot[2]);if(scale)o.scale.fromArray(scale);o.updateMatrix();g.applyMatrix4(o.matrix);g.computeBoundingBox();assemblyParts.push({name:label||role+'-'+assemblyParts.length,role:role,min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray()});var key=role+'|'+mat.name;if(!pools[key])pools[key]={role:role,mat:mat,geometries:[]};pools[key].geometries.push(g);}
 // Rounded 2D outlines are inset by the bevel allowance: dimensions refer to
 // the finished envelope, never to a profile that grows after beveling.
 function outline(w,h,r){var s=new T.Shape(),x=w/2,y=h/2;r=Math.min(r,x*.9,y*.9);s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);s.closePath();return s;}
 function extrude(shape,d,b){var g=new T.ExtrudeGeometry(shape,{depth:d-2*b,bevelEnabled:b>0,bevelSegments:4,steps:1,bevelThickness:b,bevelSize:b,curveSegments:10});g.translate(0,0,-d/2+b);return g;}
 function softBox(w,h,d){var b=Math.min(.0015,w*.12,h*.12,d*.18);return extrude(outline(w-2*b,h-2*b,b*2),d,b);}
 function box(role,mat,size,pos,rot,label){add(role,mat,softBox(size[0],size[1],size[2]),pos,rot,null,label);}
 function plate(role,mat,w,d,h,pos,cut,label){var b=Math.min(.003,h*.18),W=w-2*b,D=d-2*b,c=Math.min(cut||.1,W*.25,D*.25),pts=[[-W/2+c,-D/2],[W/2-c,-D/2],[W/2,-D/2+c],[W/2,D/2-c],[W/2-c,D/2],[-W/2+c,D/2],[-W/2,D/2-c],[-W/2,-D/2+c]],p=new T.Shape();pts.forEach(function(v,i){if(i)p.lineTo(v[0],v[1]);else p.moveTo(v[0],v[1]);});p.closePath();add(role,mat,extrude(p,h,b),pos,[-Math.PI/2,0,0],null,label);}
 function upright(role,mat,w,h,d,pos,cut,label){var key=role+'|'+mat.name,n=pools[key]?pools[key].geometries.length:0;plate(role,mat,w,h,d,[0,0,0],cut,label);var g=pools[key].geometries[n];g.rotateX(Math.PI/2);g.translate(pos[0],pos[1],pos[2]);g.computeBoundingBox();assemblyParts[assemblyParts.length-1].min=g.boundingBox.min.toArray();assemblyParts[assemblyParts.length-1].max=g.boundingBox.max.toArray();}
 function frame(role,mat,w,h,iw,ih,d,pos,label){var b=Math.min(.0015,d*.18,(w-iw)*.10,(h-ih)*.10),p=outline(w-2*b,h-2*b,.015);p.holes.push(new T.Path(outline(iw+2*b,ih+2*b,.008).getPoints(10).reverse()));add(role,mat,extrude(p,d,b),pos,null,null,label);}
 function beam(role,mat,a,b,w,d,label){var av=new T.Vector3().fromArray(a),bv=new T.Vector3().fromArray(b),v=bv.clone().sub(av),g=softBox(w,v.length(),d);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.normalize())));g.translate((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);add(role,mat,g,null,null,null,label);}
 function hideChildren(root){root.traverse(function(o){if(o.isMesh)o.visible=false;});}
 // Refine a curved skin while retaining the hard/soft normal split on its rim.
 function subdivide(g){var src=g.index?g.toNonIndexed():g,out=new T.BufferGeometry();Object.keys(src.attributes).forEach(function(key){var a=src.attributes[key],dst=[],d=a.itemSize;for(var i=0;i<a.count;i+=3){var vs=[0,1,2].map(function(j){return Array.from(a.array.slice((i+j)*d,(i+j+1)*d));}),ab=vs[0].map(function(v,k){return (v+vs[1][k])/2;}),bc=vs[1].map(function(v,k){return (v+vs[2][k])/2;}),ca=vs[2].map(function(v,k){return (v+vs[0][k])/2;});[vs[0],ab,ca,ab,vs[1],bc,ca,bc,vs[2],ab,bc,ca].forEach(function(v){dst.push.apply(dst,v);});}out.setAttribute(key,new T.Float32BufferAttribute(dst,d));});return out;}
 // Remove old office seams, frames, door hardware and lamp. Keep the actual
 // window glass and origin exterior. Material arrays are handled explicitly.
 roots.room.traverse(function(o){if(!o.isMesh)return;var mats=Array.isArray(o.material)?o.material:[o.material],names=mats.map(function(m){return m.name||'';});
  if(names.some(function(n){return /^room\.(dark|desk|trim|lampFrame)/.test(n);})||mats.some(function(m){return m.emissiveIntensity>.5&&!(m.name||'').startsWith('room.');}))o.visible=false;
  if(names.some(function(n){return /^room.wall/.test(n);})&&o.position.z>3.2)o.visible=false;
  function finish(m){var n=m.name||'';if(/^room.wall/.test(n))return wall;if(/^room.floor/.test(n))return floor;if(/^room.ceil/.test(n))return dark;return m;}
  o.material=Array.isArray(o.material)?o.material.map(finish):finish(o.material);
 });
 hideChildren(roots.desk);hideChildren(roots.chair);
 // Continuous desk load path. A thinner crossbeam gives 616 mm underside
 // clearance; the 720 mm top and all instrument feet stay at their datum.
 plate('desk',dark,1.88,.86,.052,[0,.694,-.35],.14,'desk-top');
 plate('desk',chrome,1.82,.81,.012,[0,.662,-.35],.12,'desk-edge');
 plate('desk',dark,1.65,.66,.040,[0,.636,-.35],.10,'desk-crossbeam');
 plate('desk',dark,.61,.48,.566,[0,.333,-.24],.075,'desk-pier');
 plate('desk',chrome,.79,.64,.038,[0,.031,-.24],.11,'desk-base');
 plate('desk',black,.72,.57,.012,[0,.006,-.24],.10,'desk-pad');
 // Bring the seat 200 mm closer to the desk and lower its top to 475 mm.
 // Both fixed observation stations remain unchanged.
 roots.chair.position.z=H53.room.CHAIR_Z+.20;
 plate('chair',black,.58,.65,.012,[0,.006,-.05],.11,'chair-pad');
 plate('chair',chrome,.62,.69,.035,[0,.0295,-.05],.12,'chair-base');
 plate('chair',dark,.24,.29,.275,[0,.1845,-.08],.055,'chair-pedestal');
 plate('chair',chrome,.42,.46,.027,[0,.3355,-.035],.07,'chair-saddle');
 plate('chair',dark,.62,.61,.084,[0,.391,0],.10,'chair-pan');
 plate('chair',pale,.54,.52,.042,[0,.454,.025],.095,'chair-seat');
 function recline(y){var t=Math.max(0,Math.min(1,(y-.405)/.92));return -.245-.145*(t*t*(3-2*t));}
 function reclineSlope(y){var t=Math.max(0,Math.min(1,(y-.405)/.92));return -.145*6*t*(1-t)/.92;}
 var skin=new T.Shape();skin.moveTo(-.275,.405);skin.bezierCurveTo(-.284,.64,-.275,.83,-.240,1.08);skin.bezierCurveTo(-.225,1.23,-.205,1.31,-.17,1.32);skin.quadraticCurveTo(0,1.34,.17,1.32);skin.bezierCurveTo(.205,1.31,.225,1.23,.240,1.08);skin.bezierCurveTo(.275,.83,.284,.64,.275,.405);skin.closePath();
 var shell=subdivide(subdivide(extrude(skin,.056,.005))),p=shell.attributes.position,n=shell.attributes.normal;
 for(var k=0;k<p.count;k++){var y=p.getY(k);p.setZ(k,p.getZ(k)+recline(y));var nn=new T.Vector3(n.getX(k),n.getY(k)-reclineSlope(y)*n.getZ(k),n.getZ(k)).normalize();n.setXYZ(k,nn.x,nn.y,nn.z);}
 add('chair',pale,shell,null,null,null,'chair-back-shell');
 // Backbone and three saddles attach behind the skin; none cross the sitting face.
 beam('chair',dark,[0,.365,-.29],[0,1.285,-.445],.10,.07,'chair-spine');
 for(var j=0;j<3;j++){var y=.61+j*.29,z=recline(y)-.039;box('chair',chrome,[.38-j*.025,.032,.024],[0,y,z],null,'chair-back-mount-'+j);beam('chair',dark,[0,y,-.29-(y-.365)*(.155/.92)],[0,y,z],.06,.026,'chair-back-spacer-'+j);}
 for(var side=-1;side<=1;side+=2){
  for(var q=0;q<2;q++){var z=q?-.20:.10;beam('chair',dark,[side*.245,.39,z],[side*.32,.645,z],.045,.065,'chair-arm-strut-'+side+'-'+q);box('chair',chrome,[.064,.048,.085],[side*.245,.401,z],null,'chair-arm-socket-'+side+'-'+q);}
  plate('chair',dark,.10,.43,.045,[side*.32,.6675,-.02],.025,'chair-arm-'+side);
  plate('chair',pale,.085,.38,.012,[side*.32,.696,-.02],.018,'chair-arm-pad-'+side);
 }
 // Window: continuous corner geometry, an 83 mm reveal and a gasket that
 // overlaps the original glass. The six external lights are unchanged.
 frame('window',dark,2.10,1.14,1.72,.80,.075,[0,1.72,-3.1975],'window-reveal');
 frame('window',chrome,2.12,1.16,1.76,.84,.030,[0,1.72,-3.16],'window-flange');
 frame('window',black,1.77,.85,1.70,.78,.010,[0,1.72,-3.224],'window-gasket');
 // The diffuser is inside a finite slot under the head, attached to its reveal.
 box('window',black,[1.59,.014,.022],[0,2.124,-3.178],null,'window-light-channel');
 box('window',white,[1.56,.004,.012],[0,2.115,-3.178],null,'window-diffuser');
 // Real wall opening: retain a 140 mm wall around the framed, closed door.
 // Left/right walls meet the lintel; no opaque full wall behind the leaf.
 box('room',wall,[1.31,2.80,.14],[-2.085,1.40,3.27],null,'door-wall-left');
 box('room',wall,[3.11,2.80,.14],[1.185,1.40,3.27],null,'door-wall-right');
 box('room',wall,[1.06,.57,.14],[-.90,2.515,3.27],null,'door-lintel');
 frame('room',dark,1.16,2.236,1.014,2.202,.15,[-.90,1.118,3.235],'door-jamb');
 frame('room',chrome,1.16,2.236,1.044,2.212,.018,[-.90,1.118,3.155],'door-casing');
 frame('room',black,1.038,2.226,.982,2.174,.012,[-.90,1.118,3.196],'door-seal');
 // Through-pocket in the leaf, with a recessed back plate and integral pull.
 var leaf=outline(.996,2.188,.014),pocket=outline(.068,.250,.012),hp=new T.Path(pocket.getPoints(12).map(function(v){return new T.Vector2(v.x+.34,v.y-.078);}).reverse());leaf.holes.push(hp);
 add('room',dark,extrude(leaf,.042,.001),[-.90,1.118,3.172],null,null,'door-leaf');
 box('room',black,[.078,.260,.004],[-.56,1.04,3.191],null,'door-pocket-back');
 // Pull bridges the recess; its ends are embedded in the leaf at both ends.
 box('room',chrome,[.010,.266,.014],[-.538,1.04,3.154],null,'door-pull');
 box('room',chrome,[1.04,.009,.15],[-.90,.0045,3.18],null,'door-threshold');
 // Three recessed hinges connect the leaf edge and jamb; only their knuckles show.
 for(j=0;j<3;j++){var hy=.33+j*.78;box('room',chrome,[.034,.065,.008],[-1.408,hy,3.164],null,'hinge-plate-'+j);add('room',chrome,new T.CylinderGeometry(.009,.009,.070,24),[-1.407,hy,3.155],null,null,'hinge-pin-'+j);}
 // Integral coves with a supported diffuser; butt joints stop at the end walls.
 for(side=-1;side<=1;side+=2){
  box('room',dark,[.075,.09,6.40],[side*2.5625,.045,0],null,'skirting-'+side);
  box('room',dark,[.16,.109,6.40],[side*2.52,2.7455,0],null,'cove-upper-'+side);
  box('room',dark,[.16,.039,6.40],[side*2.52,2.6595,0],null,'cove-lower-'+side);
  box('room',dark,[.152,.012,6.40],[side*2.524,2.685,0],null,'cove-slot-back-'+side);
  box('room',white,[.008,.012,5.92],[side*2.444,2.685,0],null,'cove-diffuser-'+side);
  for(var i=0;i<4;i++)box('room',wall,[.018,2.55,1.594],[side*2.591,1.365,-2.4+i*1.6],null,'wall-panel-'+side+'-'+i);
 }
 plate('room',dark,1.60,2.10,.065,[0,2.7675,-.45],.25,'ceiling-housing');
 plate('room',chrome,1.48,1.98,.018,[0,2.726,-.45],.23,'ceiling-flange');
 plate('room',white,1.37,1.87,.012,[0,2.711,-.45],.21,'ceiling-diffuser');
 // Refinish the actual instrument cases, including multi-material shells.
 // Clone to retain normal/AO/lightmap details, optical coatings and shader hooks.
 var refinished=new Map();
 function caseFinish(m){var n=m.name||'';if(!/^(crt|board|metro)\.(case|trim)/.test(n))return m;if(refinished.has(m))return refinished.get(m);
  var q=m.clone();q.onBeforeCompile=function(shader,renderer){m.onBeforeCompile(shader,renderer);if(/\.case/.test(n))shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=0.28+0.30*roughnessFactor;');};q.customProgramCacheKey=function(){return m.customProgramCacheKey()+'-v7-bounded-satin';};
  q.color.set(/\.trim/.test(n)?0x9aa3ab:0x4b4c53);q.metalness=/\.trim/.test(n)?.82:.48;q.roughness=/\.trim/.test(n)?.30:1.0;q.envMapIntensity=.75;q.name=n+'.v7';refinished.set(m,q);return q;
 }
 ['terminal','board','metronome'].forEach(function(role){roots[role].traverse(function(o){if(!o.isMesh)return;o.material=Array.isArray(o.material)?o.material.map(caseFinish):caseFinish(o.material);});});
 // Merge decoration per object/material so the redesign does not add hundreds of draw calls.
 Object.keys(pools).forEach(function(k){var pool=pools[k],count=0,src=[];pool.geometries.forEach(function(g){var q=g.index?g.toNonIndexed():g;src.push(q);count+=q.attributes.position.count;});var out=new T.BufferGeometry();['position','normal','uv'].forEach(function(key){var dim=key==='uv'?2:3,arr=new Float32Array(count*dim),at=0;src.forEach(function(g){var a=g.attributes[key];if(a)arr.set(a.array,at);at+=g.attributes.position.count*dim;});out.setAttribute(key,new T.BufferAttribute(arr,dim));});out.computeBoundingSphere();var m=new T.Mesh(out,pool.mat);m.name='v7-'+pool.role+'-'+added++;m.castShadow=pool.role!=='room';m.receiveShadow=true;m.userData.h53=pool.role;roots[pool.role==='window'?'room':pool.role].add(m);src.forEach(function(g){g.dispose();});pool.geometries.forEach(function(g){g.dispose();});});
 // Existing screen spill and overhead light remain; the extra magenta and
 // turquoise room spotlights from v5 are intentionally absent.
 scene.updateMatrixWorld(true);H53.captureRoom(scene,renderer);
 scene.userData.artAdaptation={revision:'v7',mergedDecorationMeshes:added,instrumentsRetained:['terminal','board','metronome'],windowOpening:[1.72,.8],deskTop:.72,assemblyParts:assemblyParts};
};
})();
