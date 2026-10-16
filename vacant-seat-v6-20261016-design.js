/* v6: coherent support paths and quiet, integrated architecture.
 * Original window/exterior, three instruments, displays and mechanisms retained.
 * Applied after the original geometry receives its UV transfer; old meshes hidden. */
(function(){'use strict';
H53.applySpeculativeRoom=function(scene,renderer,roots){
 var T=THREE,env=roots.desk.children[0].material.envMap;
 function physical(name,color,metal,rough){var m=new T.MeshPhysicalMaterial({color:color,metalness:metal,roughness:rough,clearcoat:.28,clearcoatRoughness:.3,envMap:env,envMapIntensity:.8});m.name='v6 '+name;return m;}
 var dark=physical('graphite ceramic',0x262a31,.32,.38),chrome=physical('satin titanium',0x929ba4,.85,.31),pale=physical('porcelain',0xcac2c5,.12,.37),floor=physical('honed mineral floor',0x22262d,.32,.36),wall=physical('enclosure',0x242833,.25,.42),black=physical('recess',0x080b0e,.12,.65);
 var white=physical('concealed diffuser',0xdad6d6,.05,.6);white.emissive.set(0xf2e4e9);white.emissiveIntensity=.65;
 var pools={},added=0;
 function add(role,mat,g,pos,rot,scale){var o=new T.Object3D();if(pos)o.position.fromArray(pos);if(rot)o.rotation.set(rot[0],rot[1],rot[2]);if(scale)o.scale.fromArray(scale);o.updateMatrix();g.applyMatrix4(o.matrix);var key=role+'|'+mat.name;if(!pools[key])pools[key]={role:role,mat:mat,geometries:[]};pools[key].geometries.push(g);}
 function box(role,mat,size,pos,rot){add(role,mat,new T.BoxGeometry(size[0],size[1],size[2]),pos,rot);}
 // Chamfered solid with real thickness and softened edges, horizontal in X/Z.
 function plate(role,mat,w,d,h,pos,cut){var c=Math.min(cut||.1,w*.25,d*.25),pts=[[-w/2+c,-d/2],[w/2-c,-d/2],[w/2,-d/2+c],[w/2,d/2-c],[w/2-c,d/2],[-w/2+c,d/2],[-w/2,d/2-c],[-w/2,-d/2+c]],s=new T.Shape();pts.forEach(function(p,i){if(i)s.lineTo(p[0],p[1]);else s.moveTo(p[0],p[1]);});s.closePath();var b=Math.min(.009,h*.18);var g=new T.ExtrudeGeometry(s,{depth:h-2*b,bevelEnabled:true,bevelSegments:3,steps:1,bevelThickness:b,bevelSize:b,curveSegments:1});g.translate(0,0,-h/2+b);add(role,mat,g,pos,[-Math.PI/2,0,0]);}
 function hideChildren(root){root.traverse(function(o){if(o.isMesh)o.visible=false;});}
 // Bounded solids, with caps and bevels. Each part has a physical parent/support.
 function beam(role,mat,a,b,w,d){var av=new T.Vector3().fromArray(a),bv=new T.Vector3().fromArray(b),v=bv.clone().sub(av),g=new T.BoxGeometry(w,v.length(),d);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.normalize())));g.translate((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);add(role,mat,g);}
 function upright(role,mat,w,h,d,pos,cut){var key=role+'|'+mat.name,n=pools[key]?pools[key].geometries.length:0;plate(role,mat,w,h,d,[0,0,0],cut);var g=pools[key].geometries[n];g.rotateX(Math.PI/2);g.translate(pos[0],pos[1],pos[2]);}
 // Remove old office seams, frames, door hardware and lamp. Keep the actual
 // window glass and origin exterior. Material arrays are handled explicitly.
 roots.room.traverse(function(o){if(!o.isMesh)return;var mats=Array.isArray(o.material)?o.material:[o.material],names=mats.map(function(m){return m.name||'';});
  if(names.some(function(n){return /^room\.(dark|desk|trim|lampFrame)/.test(n);})||mats.some(function(m){return m.emissiveIntensity>.5&&!(m.name||'').startsWith('room.');}))o.visible=false;
  function finish(m){var n=m.name||'';if(/^room.wall/.test(n))return wall;if(/^room.floor/.test(n))return floor;if(/^room.ceil/.test(n))return dark;return m;}
  o.material=Array.isArray(o.material)?o.material.map(finish):finish(o.material);
 });
 hideChildren(roots.desk);hideChildren(roots.chair);
 // Desk: continuous capped top, a concealed crossbeam and one broad solid pier.
 // Top remains exactly 720 mm, matching all three original instrument feet.
 plate('desk',dark,1.88,.86,.052,[0,.694,-.35],.14);
 plate('desk',chrome,1.82,.81,.012,[0,.662,-.35],.12);
 plate('desk',dark,1.65,.66,.092,[0,.610,-.35],.10);
 plate('desk',dark,.61,.48,.514,[0,.307,-.24],.075);
 plate('desk',chrome,.79,.64,.038,[0,.031,-.24],.11);
 plate('desk',black,.72,.57,.012,[0,.006,-.24],.10);
 // A service joint in the pier has a real surrounding case, not luminous trim.
 box('desk',black,[.006,.35,.002],[.19,.31,.001]);
 // Chair: a floor-bearing base, pedestal, seat pan, load-bearing back shell.
 plate('chair',black,.58,.65,.012,[0,.006,-.05],.11);
 plate('chair',chrome,.62,.69,.035,[0,.0295,-.05],.12);
 plate('chair',dark,.24,.29,.345,[0,.2195,-.08],.055);
 plate('chair',chrome,.42,.46,.027,[0,.4055,-.035],.07);
 plate('chair',dark,.62,.61,.084,[0,.461,0],.10);
 plate('chair',pale,.54,.52,.042,[0,.524,.025],.095);
 // Closed back shell: varying width and recline, with finite front/back faces.
 function backShell(){var rows=[[.475,.29,-.245],[.61,.28,-.255],[.82,.275,-.29],[1.04,.255,-.335],[1.29,.215,-.38],[1.39,.17,-.39]],verts=[],idx=[];
  rows.forEach(function(r){var y=r[0],w=r[1],z=r[2];verts.push(-w,y,z+.035,w,y,z+.035,w,y,z-.035,-w,y,z-.035);});
  for(var i=0;i<rows.length-1;i++)for(var j=0;j<4;j++){var a=i*4+j,b=i*4+(j+1)%4,c=b+4,d=a+4;idx.push(a,b,d,b,c,d);}
  idx.push(0,3,1,1,3,2);var a=(rows.length-1)*4;idx.push(a,a+1,a+3,a+1,a+2,a+3);
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(idx);g.computeVertexNormals();add('chair',pale,g);
 }
 backShell();
 // Rear spine is joined to the pan; transverse saddle plates carry the shell.
 beam('chair',dark,[0,.435,-.275],[0,1.345,-.435],.10,.095);
 for(var j=0;j<3;j++){var y=.68+j*.29,z=-.27-j*.052;upright('chair',chrome,.40-j*.035,.034,.055,[0,y,z-.052],.01);}
 for(var s=-1;s<=1;s+=2){
  beam('chair',dark,[s*.245,.455,.12],[s*.32,.715,.10],.045,.08);
  beam('chair',dark,[s*.245,.475,-.21],[s*.32,.715,-.20],.045,.08);
  plate('chair',dark,.10,.43,.045,[s*.32,.7375,-.02],.035);
  plate('chair',pale,.085,.38,.012,[s*.32,.766,-.02],.025);
 }
 // Deep window reveal meets the unchanged 1720 x 800 opening and glass.
 // No central mullion, freestanding halo or uncovered tube ends.
 for(s=-1;s<=1;s+=2){
  box('window',dark,[.115,.80,.20],[s*.9175,1.72,-3.135]);
  box('window',chrome,[.012,.80,.195],[s*.866,1.72,-3.135]);
 }
 box('window',dark,[1.95,.12,.20],[0,2.18,-3.135]);
 box('window',dark,[1.95,.12,.20],[0,1.26,-3.135]);
 box('window',chrome,[1.72,.012,.195],[0,2.114,-3.135]);
 box('window',chrome,[1.72,.012,.195],[0,1.326,-3.135]);
 // Wall-mounted outer surround; finite reveal between it and the inner frame.
 for(s=-1;s<=1;s+=2)upright('window',chrome,.15,1.18,.06,[s*1.015,1.72,-3.17],.018);
 box('window',chrome,[1.88,.11,.06],[0,2.255,-3.17]);
 box('window',chrome,[1.88,.11,.06],[0,1.185,-3.17]);
 box('window',white,[1.61,.008,.018],[0,2.113,-3.05]);
 // Closed door with a recessed leaf, continuous seals, a fixed jamb and a
 // shallow pull pocket assembled around an actual void (not a painted handle).
 upright('room',black,1.12,2.30,.055,[-.90,1.15,3.172],.025);
 upright('room',dark,.998,2.19,.042,[-.90,1.112,3.133],.022);
 for(s=-1;s<=1;s+=2)box('room',chrome,[.028,2.25,.067],[-.90+s*.546,1.125,3.14]);
 box('room',chrome,[1.12,.028,.067],[-.90,2.264,3.14]);
 box('room',chrome,[1.06,.009,.15],[-.90,.0045,3.12]);
 // A deliberately offset service seam and inset pull; both terminate in case.
 box('room',black,[.008,2.05,.003],[-1.16,1.10,3.1105]);
 upright('room',black,.070,.255,.010,[-.56,1.04,3.105],.014);
 for(s=-1;s<=1;s+=2)box('room',chrome,[.008,.255,.027],[-.56+s*.035,1.04,3.093]);
 box('room',chrome,[.078,.008,.027],[-.56,1.1715,3.093]);
 box('room',chrome,[.078,.008,.027],[-.56,.9085,3.093]);
 // Architectural joints run from the skirting to an attached ceiling cove.
 // Broad panels and satin seams replace repeated illuminated ribs.
 for(s=-1;s<=1;s+=2){
  box('room',dark,[.075,.09,6.40],[s*2.5625,.045,0]);
  box('room',dark,[.16,.16,6.40],[s*2.52,2.72,0]);
  box('room',white,[.012,.012,5.92],[s*2.435,2.685,0]);
  for(var i=0;i<4;i++)box('room',black,[.004,2.55,.008],[s*2.598,1.365,-2.4+i*1.6]);
 }
 // Ceiling luminaire is an opaque attached enclosure, with its diffuser
 // recessed below the flange. No unsupported rings in the room.
 plate('room',dark,1.60,2.10,.065,[0,2.7675,-.45],.25);
 plate('room',chrome,1.48,1.98,.018,[0,2.726,-.45],.23);
 plate('room',white,1.37,1.87,.012,[0,2.711,-.45],.21);
 // Refinish the actual instrument cases, including multi-material shells.
 // Clone to retain normal/AO/lightmap details, optical coatings and shader hooks.
 var refinished=new Map();
 function caseFinish(m){var n=m.name||'';if(!/^(crt|board|metro)\.(case|trim)/.test(n))return m;if(refinished.has(m))return refinished.get(m);
  var q=m.clone();q.onBeforeCompile=m.onBeforeCompile;q.customProgramCacheKey=m.customProgramCacheKey;
  q.color.set(/\.trim/.test(n)?0x9aa3ab:0x4b4c53);q.metalness=/\.trim/.test(n)?.82:.48;q.roughness=/\.trim/.test(n)?.30:.36;q.envMapIntensity=.75;q.name=n+'.v6';refinished.set(m,q);return q;
 }
 ['terminal','board','metronome'].forEach(function(role){roots[role].traverse(function(o){if(!o.isMesh)return;o.material=Array.isArray(o.material)?o.material.map(caseFinish):caseFinish(o.material);});});
 // Merge decoration per object/material so the redesign does not add hundreds of draw calls.
 Object.keys(pools).forEach(function(k){var pool=pools[k],count=0,src=[];pool.geometries.forEach(function(g){var q=g.index?g.toNonIndexed():g;src.push(q);count+=q.attributes.position.count;});var out=new T.BufferGeometry();['position','normal','uv'].forEach(function(key){var dim=key==='uv'?2:3,arr=new Float32Array(count*dim),at=0;src.forEach(function(g){var a=g.attributes[key];if(a)arr.set(a.array,at);at+=g.attributes.position.count*dim;});out.setAttribute(key,new T.BufferAttribute(arr,dim));});out.computeBoundingSphere();var m=new T.Mesh(out,pool.mat);m.name='v6-'+pool.role+'-'+added++;m.castShadow=pool.role!=='room';m.receiveShadow=true;m.userData.h53=pool.role;roots[pool.role==='window'?'room':pool.role].add(m);src.forEach(function(g){g.dispose();});pool.geometries.forEach(function(g){g.dispose();});});
 // Existing screen spill and overhead light remain; the extra magenta and
 // turquoise room spotlights from v5 are intentionally absent.
 scene.updateMatrixWorld(true);H53.captureRoom(scene,renderer);
 scene.userData.artAdaptation={revision:'v6',mergedDecorationMeshes:added,instrumentsRetained:['terminal','board','metronome'],windowOpening:[1.72,.8],deskTop:.72};
};
})();
