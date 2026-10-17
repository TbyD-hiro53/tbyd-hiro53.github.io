/* v11: directional entrance details for stations 1 and 4.
 * v7: reuse Cycles color + radial-depth views; release forest textures in the records room.
 * Original forest meshes remain available to ray picking. The aperture additionally
 * uses a perspective bake; its extra pixels are spent on the visible opening. */
(function(){'use strict';
window.EOForestBake=function(root,scene,renderer){
 if(!renderer.capabilities.isWebGL2&&!renderer.extensions.get('EXT_frag_depth'))return;
 var T=THREE,outside=root.children[4],loader=new T.TextureLoader(),saved=[],eyes={0:[0,1.55,-11.2],2:[0,1.55,14.1],3:[-.37,1.55,-7.2]},current=-1,pending=-1,serial=0,failed={},textures=[],enabled=true;
 outside.traverse(function(o){if(o.isMesh&&o.userData.h53log!=='disc')saved.push([o,o.visible]);});
 var uniforms={colorMap:{value:null},depthMap:{value:null},heroColor:{value:null},heroDepth:{value:null},useHero:{value:0},rearColor:{value:null},rearDepth:{value:null},useRear:{value:0},heroForward:{value:new T.Vector3(1,0,0)},heroRight:{value:new T.Vector3(0,0,1)},heroUp:{value:new T.Vector3(0,1,0)},rearUp:{value:new T.Vector3()},rearForward:{value:new T.Vector3(.076855,0,-.997042)},rearRight:{value:new T.Vector3(.997042,0,.076855)},rearTan:{value:new T.Vector2(.324919696,.324919696)},heroTan:{value:renderer.capabilities.maxTextureSize>=4096?new T.Vector2(.726542528,.968723371):new T.Vector2(1.110612515,1.480816687)},inverseProjection:{value:new T.Matrix4()},cameraWorld:{value:new T.Matrix4()},clip:{value:new T.Vector2(.05,420)}};
 var mat=new T.ShaderMaterial({uniforms:uniforms,extensions:{fragDepth:true},depthWrite:true,depthTest:true,
 vertexShader:'varying vec2 screen;void main(){screen=position.xy;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`precision highp float;
 varying vec2 screen;uniform sampler2D colorMap,depthMap,heroColor,heroDepth,rearColor,rearDepth;
 uniform float useHero,useRear;uniform vec2 heroTan,rearTan;uniform vec3 heroForward,heroRight,heroUp,rearForward,rearRight,rearUp;uniform mat4 inverseProjection,cameraWorld;uniform vec2 clip;
 float decode(vec3 c){return (c.r*65280.+c.g*255.)/65535.*512.;}
 void main(){
  vec4 p=inverseProjection*vec4(screen,1.,1.);vec3 local=normalize(p.xyz/p.w),ray=mat3(cameraWorld)*local;
  vec2 uv=vec2(.5+atan(ray.x,-ray.z)/6.28318530718,.5+asin(clamp(ray.y,-1.,1.))/3.14159265359);
  float distance=decode(texture2D(depthMap,uv).rgb);vec3 color=texture2D(colorMap,uv).rgb;
  float facing=dot(ray,heroForward);
  if(useHero>.5&&facing>0.){
   vec2 h=.5+.5*vec2(dot(ray,heroRight),dot(ray,heroUp))/facing/heroTan;
   if(h.x>0.&&h.x<1.&&h.y>0.&&h.y<1.){
    float edge=min(min(h.x,1.-h.x),min(h.y,1.-h.y));float blend=smoothstep(0.,.025,edge);
    color=mix(color,texture2D(heroColor,h).rgb,blend);
    if(edge>.0125)distance=decode(texture2D(heroDepth,h).rgb);
   }
  }
  float rearFacing=dot(ray,rearForward);
  if(useRear>.5&&rearFacing>0.){
   vec2 h=.5+.5*vec2(dot(ray,rearRight),dot(ray,rearUp))/rearFacing/rearTan;
   if(h.x>0.&&h.x<1.&&h.y>0.&&h.y<1.){
    float edge=min(min(h.x,1.-h.x),min(h.y,1.-h.y));
    color=mix(color,texture2D(rearColor,h).rgb,smoothstep(0.,.025,edge));
    if(edge>.0125)distance=decode(texture2D(rearDepth,h).rgb);
   }
  }
  float z=local.z*distance;float ndc=(clip.y+clip.x)/(clip.y-clip.x)+2.*clip.y*clip.x/((clip.y-clip.x)*min(-.001,z));
  gl_FragDepthEXT=min(.999999,ndc*.5+.5);gl_FragColor=vec4(color,1.);
 }`
 });
 var quad=new T.Mesh(new T.PlaneGeometry(2,2),mat);quad.name='baked-forest-color-and-depth';quad.frustumCulled=false;quad.renderOrder=-1000;quad.visible=false;quad.raycast=function(){};outside.add(quad);
 function restore(){saved.forEach(function(p){p[0].visible=p[1];});quad.visible=false;}
 function dispose(){textures.forEach(function(t){t.dispose();});textures=[];uniforms.colorMap.value=uniforms.depthMap.value=uniforms.heroColor.value=uniforms.heroDepth.value=uniforms.rearColor.value=uniforms.rearDepth.value=null;uniforms.useHero.value=uniforms.useRear.value=0;current=-1;}
 function load(station){dispose();var token=++serial;pending=station;
  var keys=[station+'-color.jpg',station+'-depth.png'];if(station===3)keys.push('hero-color.jpg','hero-depth.png','3-rear-color.jpg','3-rear-depth.png');if(station===0)keys.push('0-rear-color.jpg','0-rear-depth.png');
  Promise.allSettled(keys.map(function(file,i){return new Promise(function(ok,no){loader.load((file.indexOf('-rear-')>0?'earth-origin-material-v11-20261018-forest-':file.indexOf('hero-')===0&&renderer.capabilities.maxTextureSize>=4096?'earth-origin-material-v9-20261018-forest-':file==='hero-color.jpg'?'earth-origin-material-v8-20261017-forest-':'earth-origin-material-v6-20261017-forest-')+(file.indexOf('-rear-')>0&&renderer.capabilities.maxTextureSize<4096?file.replace('-rear-','-rear-small-'):file),function(t){t.generateMipmaps=i>=2&&i%2===0&&renderer.capabilities.isWebGL2;t.magFilter=i%2?T.NearestFilter:T.LinearFilter;t.minFilter=t.generateMipmaps?T.LinearMipmapLinearFilter:t.magFilter;t.wrapS=i<2?T.RepeatWrapping:T.ClampToEdgeWrapping;ok(t);},undefined,no);});})).then(function(results){
   var ts=results.filter(function(r){return r.status==='fulfilled';}).map(function(r){return r.value;});
   if(results.some(function(r){return r.status==='rejected';})||token!==serial){ts.forEach(function(t){t.dispose();});if(token===serial){failed[station]=true;pending=-1;restore();}return;}
   dispose();textures=ts;uniforms.colorMap.value=ts[0];uniforms.depthMap.value=ts[1];uniforms.heroColor.value=ts[2]||ts[0];uniforms.heroDepth.value=ts[3]||ts[1];uniforms.useHero.value=station===3||station===0?1:0;
   uniforms.rearColor.value=ts[4]||ts[0];uniforms.rearDepth.value=ts[5]||ts[1];uniforms.useRear.value=station===3?1:0;
   var heroTan=station===0?Math.tan(82*Math.PI/360):renderer.capabilities.maxTextureSize>=4096?.726542528:1.110612515;
   uniforms.heroTan.value.set(heroTan,heroTan*4/3);uniforms.heroForward.value.set(station===0?0:1,0,station===0?-1:0);uniforms.heroRight.value.set(station===0?1:0,0,station===0?0:1);
   if(station===0)uniforms.heroForward.value.set(0,Math.sin(-Math.PI/12),-Math.cos(Math.PI/12));
   uniforms.heroUp.value.crossVectors(uniforms.heroRight.value,uniforms.heroForward.value);
   var rearYaw=Math.atan2(.37,-4.8),rearPitch=-Math.PI/30;
   uniforms.rearForward.value.set(Math.sin(rearYaw)*Math.cos(rearPitch),Math.sin(rearPitch),Math.cos(rearYaw)*Math.cos(rearPitch));uniforms.rearRight.value.set(-Math.cos(rearYaw),0,Math.sin(rearYaw));uniforms.rearUp.value.crossVectors(uniforms.rearRight.value,uniforms.rearForward.value);
   current=station;pending=-1;
  });
 }
 window.__EOForest={update:function(station,camera){
  if(station===1){if(current>=0||pending>=0){serial++;pending=-1;dispose();}restore();return;}
  if(!outside.visible){if(current!==station&&(current>=0||pending>=0)){serial++;pending=-1;dispose();}restore();return;}
  var eye=eyes[station],matches=eye&&camera.position.distanceTo(new T.Vector3().fromArray(eye))<.002;
  if(!enabled||!matches||failed[station]){restore();return;}
  if(current!==station){restore();if(pending!==station)load(station);return;}
  saved.forEach(function(p){p[0].visible=false;});quad.visible=true;
  uniforms.inverseProjection.value.copy(camera.projectionMatrixInverse);uniforms.cameraWorld.value.copy(camera.matrixWorld);uniforms.clip.value.set(camera.near,camera.far);
 },setEnabled:function(v){enabled=v;if(!v)restore();},report:function(){return {revision:"v11",rearSize:textures[4]?[textures[4].image.width,textures[4].image.height]:null,heroSize:textures[2]?[textures[2].image.width,textures[2].image.height]:null,current:current,pending:pending,failed:Object.keys(failed),active:quad.visible,gpuImageBytes:Math.round(textures.reduce(function(n,t){return n+t.image.width*t.image.height*4*(t.generateMipmaps?4/3:1);},0)),decodedBytes:textures.reduce(function(n,t){return n+t.image.width*t.image.height*4;},0),hiddenDrawObjects:saved.length};}};
};
})();
