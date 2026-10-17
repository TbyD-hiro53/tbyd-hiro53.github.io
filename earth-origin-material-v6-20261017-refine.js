/* Earth Origin Material v6 — additional joinery and a layered forest floor.
   Added after original lightmap assignment; original baked vertex order is preserved. */
(function () {
  'use strict';
  window.EORefine = function (root, scene, renderer) {
    var T = THREE, EO = window.EO, outside = root.children[4];
    var joinery = new T.Group(); joinery.name = 'v6-joinery'; root.add(joinery);
    var porcelain = new T.MeshStandardMaterial({color:0xc6bfc4,roughness:.64,metalness:.08,fog:false});
    var gasket = new T.MeshStandardMaterial({color:0x55585d,roughness:.86,fog:false});
    var alloy = new T.MeshStandardMaterial({color:0x92999c,roughness:.42,metalness:.48,fog:false});
    function rounded(w,h,d,r){
      r=Math.min(r,w/2-.0001,h/2-.0001,d/2-.0001);
      var s=new T.Shape(),x=-w/2+r,y=-h/2+r,ww=w-2*r,hh=h-2*r;
      s.moveTo(x,y);s.lineTo(x+ww,y);s.lineTo(x+ww,y+hh);s.lineTo(x,y+hh);s.closePath();
      var g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1,curveSegments:4});
      g.translate(0,0,-d/2+r);return g;
    }
    function block(name,p,size,mat,r,key){
      var m=new T.Mesh(rounded(size[0],size[1],size[2],r||.004),mat);
      m.position.fromArray(p);m.name=name;if(key)m.userData.h53log=key;joinery.add(m);return m;
    }
    function rod(name,a,b,r,mat,key){
      var va=new T.Vector3().fromArray(a),vb=new T.Vector3().fromArray(b),d=vb.clone().sub(va);
      var m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),16),mat);m.position.copy(va.add(vb).multiplyScalar(.5));
      m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.name=name;if(key)m.userData.h53log=key;joinery.add(m);return m;
    }
    // Continuous walking surfaces through the wall thickness, 3 mm raised sill finish prevents coplanar overlap with the original reveal.
    block('records-threshold',[-1,-.032,-1],[.36,.07,1.10],porcelain,.005);
    block('astronomical-threshold',[0,-.032,12.16],[1.12,.07,.42],porcelain,.005);
    block('aperture-threshold',[1,-.032,-7.2],[.34,.07,1.20],porcelain,.005,'aperture');
    // Thin integral sleeves close the exposed wall/lining joints; no overlapping coplanar faces.
    [-1.57,-.43].forEach(function(z){block('record-jamb-sleeve',[-1,1.025,z],[.30,2.05,.026],alloy,.004);});
    block('record-lintel-sleeve',[-1,2.065,-1],[.30,.03,1.16],alloy,.004);
    [-7.815,-6.585].forEach(function(z){block('aperture-jamb-sleeve',[1,1.025,z],[.30,2.05,.024],alloy,.003,'aperture');});
    block('aperture-lintel-sleeve',[1,2.065,-7.2],[.30,.03,1.25],alloy,.003,'aperture');
    // The desk is fixed to a continuous rear cleat. Side bearers meet the front apron and legs.
    block('desk-wall-cleat-cover',[-6.515,.65,-1],[.07,.09,2.18],alloy,.006,'terminal');
    [-1.90,-.10].forEach(function(z){
      block('desk-wall-anchor',[-6.50,.596,z],[.09,.15,.11],porcelain,.009,'terminal');
      block('desk-foot-pad',[-5.99,.009,z],[.061,.018,.061],gasket,.004,'terminal');
      rod('desk-anchor-pin',[-6.448,.60,z],[-6.439,.60,z],.012,alloy,'terminal');
    });
    // Handrail fixing escutcheons follow the existing instanced sections, at their returned ends.
    root.children[2].traverse(function(o){
      if(!o.isInstancedMesh||!o.userData.h53zs)return;
      var mat=new T.Matrix4(),v=new T.Vector3();
      for(var i=0;i<o.count;i++){
        o.getMatrixAt(i,mat);v.setFromMatrixPosition(mat);v.applyMatrix4(o.matrixWorld);
        var box=new T.Box3().setFromBufferAttribute(o.geometry.attributes.position);
        var side=(box.min.x+box.max.x)/2>0?1:-1;
        [-.80,.80].forEach(function(end){
          rod('handrail-rosette',[side*.832,1.05,v.z+end],[side*.844,1.05,v.z+end],.031,alloy,'handrail');
        });
      }
    });
    // Replace three intersecting chamfer bars with one continuous U-frame.
    // Run after lightmap assignment: the old vertex/UV registry is never reordered.
    var frameCount=0;
    root.children[0].traverse(function(o){
      if(!o.isMesh||!o.geometry||!o.geometry.attributes.position)return;
      var box=new T.Box3().setFromObject(o),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
      var axis=size.x<.055&&size.z>1.30&&size.z<1.48?'x':size.z<.055&&size.x>1.30&&size.x<1.48?'z':null;
      if(!axis||size.y<2.13||size.y>2.19)return;
      var width=(axis==='x'?size.z:size.x)-.24,h=2.05,outer=width/2+.12,inner=width/2;
      var sh=new T.Shape();sh.moveTo(-outer+.008,.008);sh.lineTo(-outer+.008,h+.112);sh.lineTo(outer-.008,h+.112);sh.lineTo(outer-.008,.008);sh.lineTo(inner+.008,.008);sh.lineTo(inner+.008,h-.008);sh.lineTo(-inner-.008,h-.008);sh.lineTo(-inner-.008,.008);sh.closePath();
      var g=new T.ExtrudeGeometry(sh,{depth:.034,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:4,steps:1});g.translate(0,0,-.017);
      if(axis==='x')g.rotateY(Math.PI/2);
      var fm=new T.MeshStandardMaterial({color:0xb69ca9,roughness:.58,metalness:.06,envMapIntensity:.40,fog:false});
      var m=new T.Mesh(g,fm);m.onBeforeRender=function(){var env=o.material.envMap;if(env&&fm.envMap!==env){fm.envMap=env;fm.needsUpdate=true;}};m.position.set(center.x,0,center.z);m.name='continuous-rounded-opening-frame';m.userData.h53log=o.userData.h53log;
      o.visible=false;joinery.add(m);frameCount++;
    });
    // Cross bearers meet all four chair legs, with small replaceable contact pads.
    root.children[2].children.filter(function(o){return o.userData.h53log==='chair';}).forEach(function(chair){
      chair.updateMatrixWorld(true);
      function world(p){return new T.Vector3().fromArray(p).applyMatrix4(chair.matrixWorld).toArray();}
      [-.195,.195].forEach(function(z){rod('chair-cross-bearer',world([-.195,.349,z]),world([.195,.349,z]),.012,porcelain,'chair');
        [-.195,.195].forEach(function(x){var pad=block('chair-contact-pad',world([x,.004,z]),[.043,.008,.043],gasket,.003,'chair');pad.rotation.y=chair.rotation.y;});
      });
    });
    root.userData.v6Frames=frameCount;
    // Exterior light is isolated to layer 1. Original baked interior illumination stays intact.
    outside.traverse(function(o){if(o.isMesh)o.layers.enable(1);});
    var skyFill=new T.HemisphereLight(0xd7eee6,0x293d36,.70);skyFill.layers.set(1);scene.add(skyFill);
    var cloudFill=new T.DirectionalLight(0xe1ece5,.42);cloudFill.position.set(18,32,-2);cloudFill.layers.set(1);scene.add(cloudFill);
    scene.fog.color.setHex(0xc4d1cd);scene.fog.density=.020;
    EO.parts.outside.M.ground.color.setHex(0x98aaa0);
    EO.parts.outside.M.trunkNear.emissiveIntensity=.19;
    EO.parts.outside.M.branch.emissiveIntensity=.12;
    EO.parts.outside.M.leaves.emissiveIntensity=.10;
    EO.parts.outside.M.rock.color.setHex(0x7e9083);
    var seed=105317;
    function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    // A continuous litter/moss layer supports the larger plants instead of leaving bare grey soil.
    var soil=document.createElement('canvas');soil.width=soil.height=1024;var sc=soil.getContext('2d');
    sc.fillStyle='#4a574b';sc.fillRect(0,0,1024,1024);
    for(var si=0;si<38000;si++){
      var sx=random()*1024,sy=random()*1024,tone=55+random()*48;
      sc.fillStyle='rgb('+Math.round(tone*.91)+','+Math.round(tone*1.12)+','+Math.round(tone*.92)+')';
      sc.beginPath();sc.ellipse(sx,sy,.5+random()*4,.4+random()*1.4,random()*6.28,0,6.29);sc.fill();
    }
    var moss=new T.CanvasTexture(soil);moss.wrapS=moss.wrapT=T.RepeatWrapping;moss.repeat.set(1,1);
    moss.encoding=T.sRGBEncoding;moss.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    EO.parts.outside.M.ground.map=moss;EO.parts.outside.M.ground.color.setHex(0xd0d7cc);
    // One frond atlas: each leaflet grows from a visible rachis. Curved cards avoid flat cross-shaped tufts.
    var c=document.createElement('canvas');c.width=256;c.height=512;var ctx=c.getContext('2d');
    ctx.lineCap='round';ctx.strokeStyle='#6a8873';ctx.lineWidth=2.8;
    ctx.beginPath();ctx.moveTo(128,510);ctx.quadraticCurveTo(116,250,130,14);ctx.stroke();
    for(var j=0;j<26;j++){
      var t=j/26,cy=482-t*450,span=94*Math.pow(Math.sin(Math.PI*(t*.88+.08)),.75);
      [-1,1].forEach(function(sign){
        var x=128+sign*span*(.85+.15*random()),y=cy-20-18*random();
        var grad=ctx.createLinearGradient(128,cy,x,y);grad.addColorStop(0,'#35584c');grad.addColorStop(.6,'#648c70');grad.addColorStop(1,'#9ab394');
        ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(128,cy);ctx.quadraticCurveTo(128+sign*span*.45,cy-26,x,y);
        ctx.quadraticCurveTo(128+sign*span*.63,cy+7,128,cy+4);ctx.fill();
        ctx.strokeStyle='rgba(173,189,146,.34)';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(128,cy+1);ctx.lineTo(x,y);ctx.stroke();
      });
    }
    var texture=new T.CanvasTexture(c);texture.encoding=T.sRGBEncoding;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    var fm=new T.MeshStandardMaterial({map:texture,alphaTest:.30,side:T.DoubleSide,roughness:1,emissive:0x254338,emissiveIntensity:.20});
    var fg=new T.PlaneGeometry(.54,1,1,5),pa=fg.attributes.position;
    for(var k=0;k<pa.count;k++){
      var u=pa.getY(k)+.5;pa.setY(k,Math.sin(u*1.5)*.75);pa.setZ(k,u*u*.75);
    }
    fg.computeVertexNormals();
    var plants=[];
    for(var n=0;n<2600;n++){
      var x=1.8+random()*37,z=-29+random()*43;
      var roadZ=-7.2+(x-12.85)*.73;
      if(Math.abs(z-roadZ)<1.20|| (x<3&&Math.abs(z+7.2)<.9))continue;
      var patch=.5+.5*Math.sin(x*.71+Math.sin(z*.38))*Math.cos(z*.57);
      plants.push([x,EO.parts.outside.terrainY(x,z)-.018,z,.20+random()*.68*patch,random()*6.283]);
    }
    var fern=new T.InstancedMesh(fg,fm,plants.length*7),dummy=new T.Object3D(),color=new T.Color();
    fern.name='fern-understorey';fern.userData.h53log='forest';fern.frustumCulled=false;fern.layers.enable(1);
    plants.forEach(function(p,i){for(var f=0;f<7;f++){
      dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set(0,p[4]+f*2.39996,0);var s=p[3]*(.75+random()*.30);
      dummy.scale.set(s,s,s);dummy.updateMatrix();fern.setMatrixAt(i*7+f,dummy.matrix);
      var a=.70+random()*.28;fern.setColorAt(i*7+f,color.setRGB(a*.93,a,a*.96));
    }});
    outside.add(fern);
    root.userData.v5={fernClumps:plants.length,joineryParts:joinery.children.length};
  };
})();
