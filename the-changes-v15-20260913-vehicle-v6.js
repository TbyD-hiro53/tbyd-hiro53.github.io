/* THE CHANGES · v6 vehicle factory. Metres; +x forward; railhead y=0.
   Uses the actual car interior shell, not a contradictory exterior proxy.
   No timers, listeners, requests, or scene ownership. Three r128 / ES5. */
(function () {
  'use strict';
  var T = window.THREE, CH = window.CH = window.CH || {}, mats = [], templates = {};
  var trainMaterials = {}, materials = null;
  function material(name, color, roughness, metalness) {
    var m = new T.MeshStandardMaterial({color: color, roughness: roughness, metalness: metalness});
    m.name = 'vehicle-' + name; m.envMap = CH.ENV || null; m.envMapIntensity = 0.85; mats.push(m); return m;
  }
  function getMaterials() {
    if (!materials) materials = {
      steel: material('formed-steel', 0x777d7b, 0.33, 0.55),
      dark: material('underframe', 0x343d3e, 0.65, 0.20),
      tread: material('wheel-tread', 0x929a99, 0.26, 0.75),
      rubber: material('bellows', 0x343a3b, 0.88, 0),
      rim: material('edge', 0xbbbcb7, 0.27, 0.38)
    }; return materials;
  }
  function Builder() { this.buffers = {}; }
  Builder.prototype.add = function (geo, key, x, y, z, rx, ry, rz) {
    var g = geo.index ? geo.toNonIndexed() : geo.clone();
    var mm = new T.Matrix4(), q = new T.Quaternion();
    q.setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0));
    mm.compose(new T.Vector3(x || 0,y || 0,z || 0),q,new T.Vector3(1,1,1));g.applyMatrix4(mm);
    var b = this.buffers[key] || (this.buffers[key] = {p:[],n:[],u:[]});
    var p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv,i;
    for(i=0;i<p.count;i++){b.p.push(p.getX(i),p.getY(i),p.getZ(i));b.n.push(n.getX(i),n.getY(i),n.getZ(i));b.u.push(u?u.getX(i):0,u?u.getY(i):0);}
    g.dispose();geo.dispose();
  };
  Builder.prototype.box = function (key, x,y,z,w,h,d) { this.add(new T.BoxGeometry(w,h,d),key,x,y,z); };
  Builder.prototype.cyl = function (key,x,y,z,r,len,axis,seg) {
    this.add(new T.CylinderGeometry(r,r,len,seg||32,1,false),key,x,y,z,axis==='z'?Math.PI/2:0,0,axis==='x'?Math.PI/2:0);
  };
  Builder.prototype.finish = function () {
    var group=new T.Group(),M=getMaterials(),k,b,g,mesh;
    for(k in this.buffers){b=this.buffers[k];g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.u,2));g.computeBoundingSphere();mesh=new T.Mesh(g,M[k]);mesh.name='vehicle-'+k;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}return group;
  };
  function mechanics() {
    if(templates.mechanics)return templates.mechanics;
    var b=new Builder(),i,j,s,xc;
    // Two bogies, four axles; tread radius and centre both .415 => railhead y=0.
    for(i=-1;i<=1;i+=2){
      xc=i*6;
      for(s=-1;s<=1;s+=2){
        b.box('dark',xc,.53,s*.89,2.54,.18,.14);
        b.box('steel',xc,.63,s*.89,.62,.13,.18);
        for(j=-1;j<=1;j+=2){
          b.box('steel',xc+j*.9,.415,s*.91,.24,.24,.22);
          b.cyl('dark',xc+j*.9,.64,s*.91,.072,.22,'y',20);
          b.cyl('steel',xc+j*.9,.415,s*.938,.064,.045,'z',20);
          b.cyl('tread',xc+j*.9,.415,s*.719,.415,.092,'z',48);
          b.cyl('dark',xc+j*.9,.415,s*.691,.431,.026,'z',48);
          b.cyl('steel',xc+j*.9,.415,s*.774,.19,.018,'z',32);
        }
      }
      for(j=-1;j<=1;j+=2)b.cyl('steel',xc+j*.9,.415,0,.065,1.83,'z',24);
      b.box('dark',xc,.66,0,.24,.18,1.70);
      b.box('steel',xc,.77,0,.7,.17,.7);
    }
    // Underframe seams and enclosed equipment; no invented exposed plumbing.
    b.box('dark',0,.66,0,7.2,.30,1.65);
    b.box('steel',0,.49,0,7.18,.015,1.61);
    for(i=-3;i<=3;i++)b.box('steel',i*1.05,.65,.834,.025,.27,.016);
    for(s=-1;s<=1;s+=2){b.box('rim',0,.86,s*1.746,19.8,.020,.009);b.box('steel',0,.79,s*1.54,19.25,.14,.08);}
    templates.mechanics=b.finish();return templates.mechanics;
  }
  function bellows() {
    if(templates.bellows)return templates.bellows;
    var b=new Builder(),i,x;
    for(i=0;i<9;i++){x=-.24+i*.06;b.box('rubber',x,2.16,-.55,.036,2.10,.052);b.box('rubber',x,2.16,.55,.036,2.10,.052);b.box('rubber',x,3.19,0,.036,.058,1.15);}
    b.box('dark',0,1.16,0,.60,.10,1.03);
    b.cyl('dark',0,.78,0,.07,.72,'x',24);b.box('steel',0,.78,0,.16,.17,.22);
    templates.bellows=b.finish();return templates.bellows;
  }
  function mappedMaterial(m) {
    if(!trainMaterials[m.uuid]){
      var c=m.clone(); c.name='passing-'+(m.name||m.type);c.envMap=CH.ENV||null;
      c.aoMap=null;c.lightMap=null;delete c.userData.packedSurface;c.envMapIntensity=m.userData.finish==='cloth'?.23:m.userData.finish==='metal'?.55:.45;
      if(m.emissiveMap&&!m.map)c.emissiveIntensity=m.color.r>.25?.10:.38;
      // Freeze the local route panel. A running-car scene must not mutate
      // the textures of independently cached passing trains afterwards.
      if(m.map&&m.map===m.emissiveMap&&m.map.image&&m.map.image.width===1024){
        var cv=document.createElement('canvas');cv.width=m.map.image.width;cv.height=m.map.image.height;
        cv.getContext('2d').drawImage(m.map.image,0,0);var tex=new T.CanvasTexture(cv);tex.encoding=T.sRGBEncoding;tex.anisotropy=8;
        c.map=tex;c.emissiveMap=tex;c.emissiveIntensity=.72;
      }
      if(c.name.indexOf('glass')>=0)c.opacity=.19;
      trainMaterials[m.uuid]=c;mats.push(c);
    } return trainMaterials[m.uuid];
  }
  function createTrain(options) {
    options=options||{};var count=Math.max(1,Math.min(6,options.cars||3)), g=new T.Group(), i,c;
    if(!CH.parts||!CH.parts.car||!CH.parts.car.prototype)throw new Error('Load asset-car-v6.js before vehicle-v6.js');
    var proto=CH.parts.car.prototype();
    for(i=0;i<count;i++){
      c=proto.clone(true);c.name='car-'+i;c.position.set((i-(count-1)/2)*20.6,1.15,0);
      c.traverse(function(o){if(o.isLight||o.name==='stub')o.visible=false;if(o.isMesh){o.material=mappedMaterial(o.material);o.castShadow=o.name==='shell'||o.name.indexOf('doorPanel')===0;o.receiveShadow=true;if(o.isInstancedMesh){o.geometry.boundingSphere=new T.Sphere(new T.Vector3(0,1.2,0),10.2);o.frustumCulled=true;}}});
      g.add(c);
      var mech=mechanics().clone(true);mech.position.x=c.position.x;g.add(mech);
      if(i<count-1){var joint=bellows().clone(true);joint.position.x=c.position.x+10.3;g.add(joint);}
    }
    g.name='train-v6';g.userData.dims={cars:count,length:count*20+(count-1)*.6,width:3.5,clearWidth:3.3,floor:1.15,roof:3.77,wheelRadius:.415,railGauge:1.435};
    g.userData.h53log='train';return g;
  }
  function applyMats(){var e=CH.ENV||null,i;for(i=0;i<mats.length;i++){if(mats[i].envMap!==e){mats[i].envMap=e;mats[i].needsUpdate=true;}}return mats;}
  CH.VEHICLE={createTrain:createTrain,mats:applyMats,dims:{carLength:20,gap:.6,width:3.5,clearWidth:3.3,clearHeight:2.42,floor:1.15,roof:3.77,gauge:1.435}};
})();
