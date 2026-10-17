/* Cycles color + radial-depth views, one fixed eye at a time.
 * Original forest meshes remain available to ray picking. The aperture additionally
 * uses a perspective bake; its extra pixels are spent on the visible opening. */
(function(){'use strict';
window.EOForestBake=function(root,scene,renderer){
 if(!renderer.capabilities.isWebGL2&&!renderer.extensions.get('EXT_frag_depth'))return;
 var T=THREE,outside=root.children[4],loader=new T.TextureLoader(),saved=[],eyes={0:[0,1.55,-11.2],2:[0,1.55,14.1],3:[-.37,1.55,-7.2]},current=-1,pending=-1,serial=0,failed={},textures=[],enabled=true;
 outside.traverse(function(o){if(o.isMesh&&o.userData.h53log!=='disc')saved.push([o,o.visible]);});
 var uniforms={colorMap:{value:null},depthMap:{value:null},heroColor:{value:null},heroDepth:{value:null},useHero:{value:0},inverseProjection:{value:new T.Matrix4()},cameraWorld:{value:new T.Matrix4()},clip:{value:new T.Vector2(.05,420)}};
 var mat=new T.ShaderMaterial({uniforms:uniforms,extensions:{fragDepth:true},depthWrite:true,depthTest:true,
 vertexShader:'varying vec2 screen;void main(){screen=position.xy;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`precision highp float;
 varying vec2 screen;uniform sampler2D colorMap,depthMap,heroColor,heroDepth;
 uniform float useHero;uniform mat4 inverseProjection,cameraWorld;uniform vec2 clip;
 float decode(vec3 c){return (c.r*65280.+c.g*255.)/65535.*512.;}
 void main(){
  vec4 p=inverseProjection*vec4(screen,1.,1.);vec3 local=normalize(p.xyz/p.w),ray=mat3(cameraWorld)*local;
  vec2 uv=vec2(.5+atan(ray.x,-ray.z)/6.28318530718,.5+asin(clamp(ray.y,-1.,1.))/3.14159265359);
  float distance=decode(texture2D(depthMap,uv).rgb);vec3 color=texture2D(colorMap,uv).rgb;
  if(useHero>.5&&ray.x>0.){
   vec2 h=.5+.5*vec2(ray.z,ray.y)/ray.x/vec2(1.110612515,1.480816687);
   if(h.x>0.&&h.x<1.&&h.y>0.&&h.y<1.){
    float edge=min(min(h.x,1.-h.x),min(h.y,1.-h.y));float blend=smoothstep(0.,.025,edge);
    color=mix(color,texture2D(heroColor,h).rgb,blend);
    if(edge>.0125)distance=decode(texture2D(heroDepth,h).rgb);
   }
  }
  float z=local.z*distance;float ndc=(clip.y+clip.x)/(clip.y-clip.x)+2.*clip.y*clip.x/((clip.y-clip.x)*min(-.001,z));
  gl_FragDepthEXT=min(.999999,ndc*.5+.5);gl_FragColor=vec4(color,1.);
 }`
 });
 var quad=new T.Mesh(new T.PlaneGeometry(2,2),mat);quad.name='baked-forest-color-and-depth';quad.frustumCulled=false;quad.renderOrder=-1000;quad.visible=false;quad.raycast=function(){};outside.add(quad);
 function restore(){saved.forEach(function(p){p[0].visible=p[1];});quad.visible=false;}
 function dispose(){textures.forEach(function(t){t.dispose();});textures=[];current=-1;}
 function load(station){dispose();var token=++serial;pending=station;
  var keys=[station+'-color.jpg',station+'-depth.png'];if(station===3)keys.push('hero-color.jpg','hero-depth.png');
  Promise.allSettled(keys.map(function(file,i){return new Promise(function(ok,no){loader.load('earth-origin-material-v6-20261017-forest-'+file,function(t){t.generateMipmaps=false;t.minFilter=t.magFilter=i%2?T.NearestFilter:T.LinearFilter;t.wrapS=i<2?T.RepeatWrapping:T.ClampToEdgeWrapping;ok(t);},undefined,no);});})).then(function(results){
   var ts=results.filter(function(r){return r.status==='fulfilled';}).map(function(r){return r.value;});
   if(results.some(function(r){return r.status==='rejected';})||token!==serial){ts.forEach(function(t){t.dispose();});if(token===serial){failed[station]=true;pending=-1;restore();}return;}
   dispose();textures=ts;uniforms.colorMap.value=ts[0];uniforms.depthMap.value=ts[1];uniforms.heroColor.value=ts[2]||ts[0];uniforms.heroDepth.value=ts[3]||ts[1];uniforms.useHero.value=station===3?1:0;current=station;pending=-1;
  });
 }
 window.__EOForest={update:function(station,camera){
  var eye=eyes[station],matches=eye&&camera.position.distanceTo(new T.Vector3().fromArray(eye))<.002;
  if(!enabled||!matches||failed[station]){restore();return;}
  if(current!==station){restore();if(pending!==station)load(station);return;}
  saved.forEach(function(p){p[0].visible=false;});quad.visible=true;
  uniforms.inverseProjection.value.copy(camera.projectionMatrixInverse);uniforms.cameraWorld.value.copy(camera.matrixWorld);uniforms.clip.value.set(camera.near,camera.far);
 },setEnabled:function(v){enabled=v;if(!v)restore();},report:function(){return {current:current,pending:pending,failed:Object.keys(failed),active:quad.visible,decodedBytes:textures.reduce(function(n,t){return n+t.image.width*t.image.height*4;},0),hiddenDrawObjects:saved.length};}};
};
})();
