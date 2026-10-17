/* Cycles spherical color projected onto one merged, unlit indoor shell.
 * Exact geometry supplies depth at display rims and openings; light is fully baked. */
(function(){'use strict';
 window.EOInteriorBake=function(root,scene,renderer){
  var T=THREE,partition=EOStaticPartition(root),saved=partition.statics.concat(partition.decals).map(function(o){return [o,o.visible];});
  var eyes=[[0,1.55,-11.2],[-3.85,1.10,-2.05],[0,1.55,14.1],[-.37,1.55,-7.2]],loader=new T.TextureLoader(),texture=null,serial=0,current=-1,pending=-1,failed={},enabled=true;
  var size=(Math.min(innerWidth,innerHeight)<700||renderer.capabilities.maxTextureSize<4096)?2048:4096;
  root.updateMatrixWorld(true);
  var inverseRoot=root.matrixWorld.clone().invert(),positions=[],point=new T.Vector3(),instance=new T.Matrix4(),transform=new T.Matrix4();
  partition.statics.forEach(function(o){
   var parent=o;while(parent&&parent!==root){if(!parent.visible)return;parent=parent.parent;}
   var g=o.geometry,a=g.attributes.position,index=g.index,count=index?index.count:a.count;
   for(var k=0;k<(o.isInstancedMesh?o.count:1);k++){
    transform.multiplyMatrices(inverseRoot,o.matrixWorld);if(o.isInstancedMesh){o.getMatrixAt(k,instance);transform.multiply(instance);}
    for(var j=0;j<count;j++){point.fromBufferAttribute(a,index?index.getX(j):j).applyMatrix4(transform);positions.push(point.x,point.y,point.z);}
   }
  });
  var geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeBoundingSphere();
  var uniforms={colorMap:{value:null},eye:{value:new T.Vector3()}};
  var mat=new T.ShaderMaterial({uniforms:uniforms,side:T.DoubleSide,depthTest:true,depthWrite:true,
   vertexShader:'varying vec3 world;void main(){world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`precision highp float;varying vec3 world;uniform sampler2D colorMap;uniform vec3 eye;
    void main(){vec3 ray=normalize(world-eye);vec2 uv=vec2(.5+atan(ray.x,-ray.z)/6.28318530718,.5+asin(clamp(ray.y,-1.,1.))/3.14159265359);gl_FragColor=vec4(texture2D(colorMap,uv).rgb,1.);}`
  });
  var shell=new T.Mesh(geometry,mat);shell.name='baked-static-interior';shell.renderOrder=-900;shell.visible=false;shell.raycast=function(){};root.add(shell);
  function restore(){saved.forEach(function(p){p[0].visible=p[1];});shell.visible=false;}
  function dispose(){if(texture)texture.dispose();texture=null;uniforms.colorMap.value=null;current=-1;}
  function load(station){dispose();var token=++serial;pending=station;
   loader.load('earth-origin-material-v7-20261017-interior-'+station+'-'+size+'-color.jpg',function(t){
    if(token!==serial){t.dispose();return;}
    t.generateMipmaps=false;t.minFilter=t.magFilter=T.LinearFilter;t.wrapS=T.RepeatWrapping;texture=t;uniforms.colorMap.value=t;current=station;pending=-1;
   },undefined,function(){if(token===serial){failed[station]=true;pending=-1;restore();}});
  }
  window.__EOInterior={update:function(station,camera){
   var eye=eyes[station],matches=eye&&camera.position.distanceTo(new T.Vector3().fromArray(eye))<.002;
   if(!enabled||!matches||failed[station]){restore();return;}
   if(current!==station){restore();if(pending!==station)load(station);return;}
   saved.forEach(function(p){p[0].visible=false;});shell.visible=true;uniforms.eye.value.copy(camera.position);
  },setEnabled:function(v){enabled=v;if(!v)restore();},report:function(){return {current:current,pending:pending,active:shell.visible,failed:Object.keys(failed),width:size,staticObjects:saved.length,dynamicObjects:partition.dynamic.length,depthTriangles:geometry.attributes.position.count/3,geometryBytes:geometry.attributes.position.array.byteLength,decodedBytes:texture?texture.image.width*texture.image.height*4:0};}};
 };
})();
