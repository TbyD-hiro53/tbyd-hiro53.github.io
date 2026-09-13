/* THE CHANGES · adopted night carriage, fixed compositions.
   Host owns time, camera, renderer, inputs and environment lifetime. ES5/r128. */
(function () {
  'use strict';
  var T=window.THREE,CH=window.CH=window.CH||{}, root=null,car,land,tree,segment='t3',start=null,lastT=0;
  var lastLine='',cachedEnv=null,treeMaterials=null,libraryBounce=null,librarySide=null,rootView=false,outside=null,railCircle=null;
  var NIGHT=[[.021,.036,.044],[.047,.065,.069],[.028,.035,.035]];
  function stateAt(t){return {segment:'t3',seconds:t,night:1,bandFraction:0,seatLightFraction:0,rowFraction:.38,lineText:'＞ 当該列車',groundOffset:rootView?0:((CH.U.V*t%CH.U.PITCH)+CH.U.PITCH)%CH.U.PITCH,treeDistance:1000};}
  function build(){
    if(root)return root;
    root=new T.Group();root.name='journey-v6';
    car=CH.parts.car.prototype();car.name='journey-car';car.userData.parts.stub.visible=false;car.traverse(function(o){if(o.isMesh&&(o.name==='shell'||o.name==='ceiling')){o.castShadow=true;o.material.shadowSide=T.DoubleSide;}});
    land=CH.parts.land.build();tree=CH.parts.tree.build();
    var sun=land.userData.SUN.light;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;sun.shadow.camera.near=.1;sun.shadow.camera.far=160;sun.shadow.bias=-.0001;sun.shadow.normalBias=.012;
    root.add(land);root.add(tree);root.add(car);
    libraryBounce=new T.DirectionalLight(0x73988f,0);libraryBounce.position.set(-450,600,-850);libraryBounce.name='distant-library-reflection';root.add(libraryBounce);librarySide=new T.DirectionalLight(0x73988f,0);librarySide.position.set(1000,160,400);librarySide.name='library-side-reflection';root.add(librarySide);
    var windowBounce=new T.PointLight(0xa8c9bd,.48,5,2);windowBounce.position.set(3.3,1.65,1.4);windowBounce.name='local window return onto cloth';root.add(windowBounce);
    outside=new T.Group();outside.name="tree-world-in-carriage-coordinates";outside.visible=false;root.add(outside);railCircle=CH.ORBIT15.build();outside.add(railCircle);root.userData.parts={car:car,land:land,tree:tree,outside:outside};
    setSegment(segment);return root;
  }
  function setSegment(id){
    if(id!=='t3')throw new Error('Only the adopted night carriage is distributed');segment='t3';start=null;rootView=false;if(!root)return;lastLine='';
    var dist=1000,pivot=tree.userData.parts.pivot,az=CH.parts.tree.dims.AZ;
    pivot.position.set(dist*Math.cos(az),-1.15,dist*Math.sin(az));
    tree.userData.NOMINAL.dist=dist;
    apply(stateAt(0,id));
  }
  function viewChanged(id,t){rootView=id==='roots';if(!root)return;var pivot=tree.userData.parts.pivot;outside.visible=rootView;if(rootView){outside.add(tree);outside.add(libraryBounce);outside.add(librarySide);outside.add(libraryBounce.target);outside.add(librarySide.target);pivot.position.set(0,-1.15,0);}else{if(tree.parent!==root)root.add(tree);if(libraryBounce.parent!==root)root.add(libraryBounce);if(librarySide.parent!==root)root.add(librarySide);root.add(libraryBounce.target);root.add(librarySide.target);var az=CH.parts.tree.dims.AZ;pivot.position.set(1000*Math.cos(az),-1.15,1000*Math.sin(az));}land.userData.parts.ground.visible=!rootView;land.userData.parts.flow.visible=!rootView;apply(stateAt(lastT));}
  function apply(st){
    if(lastLine!==st.lineText){CH.parts.car.setLine(st.lineText);lastLine=st.lineText;}
    CH.parts.car.setNight(1);CH.parts.land.setNight(1);CH.parts.tree.setNight(1);
    CH.parts.tree.setSky(NIGHT[0],NIGHT[1],NIGHT[2]);CH.parts.tree.setDissolve(.55);
    if(treeMaterials){treeMaterials.bark.envMapIntensity=.42;treeMaterials.panel.envMapIntensity=.15;treeMaterials.bark.emissive.setHex(0x142723);treeMaterials.bark.emissiveIntensity=.015;}
    if(librarySide)librarySide.intensity=rootView?.25:.16;
    if(libraryBounce)libraryBounce.intensity=rootView?.40:.25;
    // T2 exterior is night from the outset; the carriage lights fall afterwards.
  }
  function tick(t){
    if(!root)return;if(start===null)start=t;
    lastT=Math.max(0,t);var st=stateAt(lastT);if(rootView){outside.position.set(0,0,CH.ORBIT15.bodyRadius);outside.rotation.y=CH.ORBIT15.angle(lastT);st.orbitAngle=outside.rotation.y;st.orbitPeriod=CH.ORBIT15.period;var sun=land.userData.SUN;sun.light.position.copy(sun.dir).multiplyScalar(300).applyAxisAngle(new T.Vector3(0,1,0),outside.rotation.y);}
    CH.parts.land.tick(lastT,rootView);CH.parts.tree.tick(lastT);CH.parts.car.tick(lastT);apply(st);
    if(rootView){st.timeDesign='continuous circular viewing route';st.treePosition=tree.userData.parts.pivot.position.toArray();st.treeDistance=CH.ORBIT15.radius;}
    root.userData.state=st;
  }
  function mats(){CH.parts.car.mats();CH.parts.land.mats();treeMaterials=CH.parts.tree.mats();if(root)apply(stateAt(lastT));}
  CH.parts.journey={name:'journey',build:build,tick:tick,mats:mats,setSegment:setSegment,stateAt:stateAt,viewChanged:viewChanged,
    lighting:function(key){return{ownLights:true,ambient:0,key:0,fill:0,exposure:.86,background:0x071012};},
    env:function(renderer,id){if(!cachedEnv)cachedEnv=CH.parts.land.env(renderer);return cachedEnv;},
    dims:{carLength:20,width:3.5,clearWidth:3.3,clearHeight:2.42,floor:0,railhead:-1.15,treeHeight:660,treeWidth:858,speed:27.6923,loop:31.2},
    getSegment:function(){return segment;}};
})();
