/* Cycles spherical color projected onto one merged, unlit indoor shell.
 * Exact geometry supplies depth at display rims and openings; light is fully baked. */
(function(){'use strict';
 window.EOInteriorBake=function(root,scene,renderer){
  var T=THREE,partition=EOStaticPartition(root),saved=partition.statics.concat(partition.decals).map(function(o){return [o,o.visible];});
  var eyes=[[0,1.55,-11.2],[-3.85,1.10,-2.05],[0,1.55,14.1],[-.37,1.55,-7.2]],loader=new T.TextureLoader(),texture=null,detail=null,serial=0,current=-1,pending=-1,failed={},enabled=true;
  var size=renderer.capabilities.maxTextureSize<4096?2048:4096;
  var poses=[[0,-.02],[-1.2,-.2],[0,-.1],[Math.PI/2,-.09]];
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
  var uniforms={colorMap:{value:null},detailMap:{value:null},useDetail:{value:0},forward:{value:new T.Vector3()},right:{value:new T.Vector3()},up:{value:new T.Vector3()},eye:{value:new T.Vector3()}};
  var mat=new T.ShaderMaterial({uniforms:uniforms,side:T.DoubleSide,depthTest:true,depthWrite:true,
   vertexShader:'varying vec3 world;void main(){world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`precision highp float;varying vec3 world;uniform sampler2D colorMap,detailMap;uniform float useDetail;uniform vec3 eye,forward,right,up;
    void main(){vec3 ray=normalize(world-eye);vec2 uv=vec2(.5+atan(ray.x,-ray.z)/6.28318530718,.5+asin(clamp(ray.y,-1.,1.))/3.14159265359);vec3 color=texture2D(colorMap,uv).rgb;float z=dot(ray,forward);
     if(useDetail>.5&&z>0.){vec2 d=.5+.5*vec2(dot(ray,right),dot(ray,up))/z/.8692867378;
      if(d.x>0.&&d.x<1.&&d.y>0.&&d.y<1.){float edge=min(min(d.x,1.-d.x),min(d.y,1.-d.y));color=mix(color,texture2D(detailMap,d).rgb,smoothstep(0.,.035,edge));}}
     gl_FragColor=vec4(color,1.);}`
  });
  var shell=new T.Mesh(geometry,mat);shell.name='baked-static-interior';shell.renderOrder=-900;shell.visible=false;shell.raycast=function(){};root.add(shell);
  function restore(){saved.forEach(function(p){p[0].visible=p[1];});shell.visible=false;}
  function dispose(){if(texture)texture.dispose();if(detail)detail.dispose();texture=detail=null;uniforms.colorMap.value=uniforms.detailMap.value=null;uniforms.useDetail.value=0;current=-1;}
  function load(station){dispose();var token=++serial;pending=station;
   var urls=['earth-origin-material-v7-20261017-interior-'+station+'-'+size+'-color.jpg',(size===4096?'earth-origin-material-v9-20261018-interior-':'earth-origin-material-v8-20261017-interior-')+station+'-detail.jpg'];
   Promise.allSettled(urls.map(function(url){return new Promise(function(ok,no){loader.load(url,ok,undefined,no);});})).then(function(results){
    if(token!==serial){results.forEach(function(r){if(r.status==='fulfilled')r.value.dispose();});return;}
    pending=-1;
    if(results[0].status!=='fulfilled'){if(results[1].status==='fulfilled')results[1].value.dispose();failed[station]=true;restore();return;}
    texture=results[0].value;texture.generateMipmaps=false;texture.minFilter=texture.magFilter=T.LinearFilter;texture.wrapS=T.RepeatWrapping;uniforms.colorMap.value=texture;
    detail=results[1].status==='fulfilled'?results[1].value:null;
    if(detail){detail.generateMipmaps=true;detail.minFilter=T.LinearMipmapLinearFilter;detail.magFilter=T.LinearFilter;uniforms.detailMap.value=detail;uniforms.useDetail.value=1;}
    else{uniforms.detailMap.value=texture;uniforms.useDetail.value=0;}
    var y=poses[station][0],p=poses[station][1];uniforms.forward.value.set(Math.sin(y)*Math.cos(p),Math.sin(p),Math.cos(y)*Math.cos(p));uniforms.right.value.set(-Math.cos(y),0,Math.sin(y));uniforms.up.value.crossVectors(uniforms.right.value,uniforms.forward.value);current=station;
   });
  }
  window.__EOInterior={update:function(station,camera){
   var eye=eyes[station],matches=eye&&camera.position.distanceTo(new T.Vector3().fromArray(eye))<.002;
   if(!enabled||!matches||failed[station]){restore();return;}
   if(current!==station){restore();if(pending!==station)load(station);return;}
   saved.forEach(function(p){p[0].visible=false;});shell.visible=true;uniforms.eye.value.copy(camera.position);
  },setEnabled:function(v){enabled=v;if(!v)restore();},report:function(){return {revision:"v9",current:current,pending:pending,active:shell.visible,failed:Object.keys(failed),width:size,detailWidth:detail?detail.image.width:0,detailActive:!!detail,staticObjects:saved.length,dynamicObjects:partition.dynamic.length,depthTriangles:geometry.attributes.position.count/3,geometryBytes:geometry.attributes.position.array.byteLength,gpuImageBytes:Math.round((texture?texture.image.width*texture.image.height*4:0)+(detail?detail.image.width*detail.image.height*4*4/3:0)),decodedBytes:(texture?texture.image.width*texture.image.height*4:0)+(detail?detail.image.width*detail.image.height*4:0)};}};
 };
})();
