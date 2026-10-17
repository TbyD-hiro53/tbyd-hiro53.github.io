/* Fixed-eye Cycles radiance/depth. Water, discs and touch waves stay live. */
(function(){'use strict';
var T=THREE,base='confluence-v12-20261018-',names=['gap','under','bank'];
function Bake(engine){
 this.engine=engine;this.active=false;this.maps=null;this.serial=0;this.pending=null;this.error=null;
 this.enabled=new URLSearchParams(location.search).get('render')!=='live'&&typeof DecompressionStream!=='undefined'&&engine.renderer.capabilities.maxTextureSize>=4096&&(engine.renderer.capabilities.isWebGL2||engine.renderer.extensions.has('EXT_frag_depth'));
 this.panoGrad=engine.renderer.capabilities.isWebGL2||(engine.renderer.extensions.has('EXT_shader_texture_lod')&&engine.renderer.extensions.has('OES_standard_derivatives'));
 this.staticMeshes=engine.scene.children.filter(function(o){return o.isMesh&&o!==engine.water;});
 var u=this.uniforms={panoColor:{value:null},panoDepth:{value:null},detailColor:{value:null},detailDepth:{value:null},inverseProjection:{value:new T.Matrix4()},cameraWorld:{value:new T.Matrix4()},projection:{value:new T.Matrix4()},view:{value:new T.Matrix4()},eye:{value:new T.Vector3()},detailForward:{value:new T.Vector3()},detailRight:{value:new T.Vector3()},detailUp:{value:new T.Vector3()},useDetail:{value:0},confluenceTime:engine.waterUniforms.confluenceTime};
 this.material=new T.ShaderMaterial({uniforms:u,depthWrite:true,depthTest:true,extensions:{fragDepth:true,derivatives:true,shaderTextureLOD:true},defines:this.panoGrad?{PANO_GRAD:1}:{},vertexShader:'varying vec2 screenUV;void main(){screenUV=position.xy;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 precision highp float;
 varying vec2 screenUV;uniform sampler2D panoColor,panoDepth,detailColor,detailDepth;
 uniform mat4 inverseProjection,cameraWorld,projection,view;uniform vec3 eye,detailForward,detailRight,detailUp;uniform float useDetail;
 ${engine.bakeShader()}
 vec3 radiance(vec4 c){return c.rgb*c.a*16.;}
 vec4 panoramaColor(vec2 uv){
 #ifdef PANO_GRAD
  vec2 dx=dFdx(uv),dy=dFdy(uv);
  // Longitude is periodic: its discontinuity must not select the coarsest mip.
  dx.x-=floor(dx.x+.5);dy.x-=floor(dy.x+.5);
  return texture2DGradEXT(panoColor,uv,dx,dy);
 #else
  return texture2D(panoColor,uv);
 #endif
 }
 vec3 sourceSky(vec3 d){
 float h=max(0.,d.y);vec3 c=mix(vec3(.32,.47,.50),vec3(.055,.15,.23),pow(h,.48));c+=exp(-abs(d.y)*17.)*vec3(.20,.19,.19);
 float sa=1.-smoothstep(.00034,.00040,1.-dot(d,normalize(vec3(-.30,.75,-.60))));float sb=1.-smoothstep(.00012,.00016,1.-dot(d,normalize(vec3(-.40,.83,-.57))));c+=sa*vec3(2.,1.5,1.75)+sb*vec3(1.15,1.7,1.65);
 float cloud=sin(d.x*19.+d.z*8.)*.5+sin(d.z*24.-d.x*7.)*.22;return c+vec3(.018,.025,.029)*cloud*pow(1.-h,3.);
 }
 float distanceAt(vec4 d){return exp2((d.r*255.*256.+d.g*255.)/65535.*log2(2049.))-1.;}
 void main(){
  vec4 p=inverseProjection*vec4(screenUV,1.,1.);vec3 ray=normalize((cameraWorld*vec4(p.xyz/p.w,0.)).xyz);
  vec2 uv=vec2(.5+atan(ray.x,-ray.z)/6.28318530718,.5-asin(clamp(ray.y,-1.,1.))/3.14159265359);
  vec4 dep=texture2D(panoDepth,uv);vec3 color=radiance(panoramaColor(uv));
  float forward=dot(ray,detailForward);vec2 duv=.5+.5*vec2(dot(ray,detailRight),-dot(ray,detailUp))/(max(forward,.0001)*.8692867378);
  float edge=min(min(duv.x,duv.y),min(1.-duv.x,1.-duv.y));float blend=useDetail*step(.001,forward)*smoothstep(0.,.025,edge);
  if(blend>0.){color=mix(color,radiance(texture2D(detailColor,duv)),blend);if(blend>.5)dep=texture2D(detailDepth,duv);}
  float dist=distanceAt(dep);if(dist>=2000.)color=sourceSky(ray);vec3 world=eye+ray*dist;float shade=dist<2000.?discShade(world):1.;color*=1.-dep.b*(1.-shade);
  vec4 clip=projection*view*vec4(world,1.);float z=clip.z/clip.w*.5+.5;
  gl_FragDepthEXT=dist<2000.?clamp(z,0.,.999998):.999999;
  gl_FragColor=vec4(color,1.);
  #include <tonemapping_fragment>
  #include <encodings_fragment>
 }`});
 this.quad=new T.Mesh(new T.PlaneGeometry(2,2),this.material);this.quad.frustumCulled=false;this.quad.renderOrder=-1000;this.quad.visible=false;engine.scene.add(this.quad);
 var self=this;this.quad.onBeforeRender=function(r,s,c){var mirror=c===engine.mirrorCamera,m=self.maps;if(!m)return;var a=mirror?m.mirror:m.pano;u.panoColor.value=a.color;u.panoDepth.value=a.depth;u.detailColor.value=m.detail.color;u.detailDepth.value=m.detail.depth;u.useDetail.value=mirror?0:1;u.eye.value.copy(c.position);u.inverseProjection.value.copy(c.projectionMatrixInverse);u.cameraWorld.value.copy(c.matrixWorld);u.projection.value.copy(c.projectionMatrix);u.view.value.copy(c.matrixWorldInverse);self.material.uniformsNeedUpdate=true;};
}
Bake.prototype.release=function(m){if(!m)return;Object.keys(m).forEach(function(k){m[k].color.dispose();m[k].depth.dispose();});};
Bake.prototype.live=function(){this.active=false;this.quad.visible=false;this.staticMeshes.forEach(function(m){m.visible=true;});};
Bake.prototype.texture=async function(spot,kind,label,signal){
 var sizes={pano:[4096,2048],detail:[4096,4096],mirror:[2048,1024]},size=sizes[kind],response=await fetch(base+names[spot]+'-'+kind+'-'+label+'.bin.gz',{signal:signal});if(!response.ok)throw Error('Landscape '+response.status);
 var bytes=new Uint8Array(await response.arrayBuffer());if(bytes[0]===31&&bytes[1]===139)bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 if(signal.aborted)throw new DOMException('Aborted','AbortError');
 // Lossless pixel-delta packing; reconstruct the exact original RGBA bytes.
 if(bytes.length===size[0]*size[1]*4+4&&bytes[0]===72&&bytes[1]===53&&bytes[2]===51&&bytes[3]===68){bytes=bytes.subarray(4);for(var i=4;i<bytes.length;i++)bytes[i]=(bytes[i]+bytes[i-4])&255;}
 if(bytes.length!==size[0]*size[1]*4)throw Error('Landscape dimensions');
 var t=new T.DataTexture(bytes,size[0],size[1],T.RGBAFormat,T.UnsignedByteType);t.flipY=false;t.encoding=T.LinearEncoding;t.magFilter=label==='color'?T.LinearFilter:T.NearestFilter;var mip=label==='color'&&(kind==='detail'||this.panoGrad);t.minFilter=label==='color'?(mip?T.LinearMipmapLinearFilter:T.LinearFilter):T.NearestFilter;t.generateMipmaps=mip;t.wrapS=kind==='detail'?T.ClampToEdgeWrapping:T.RepeatWrapping;t.wrapT=T.ClampToEdgeWrapping;t.needsUpdate=true;
 // GPU owns this immutable map after upload; context restoration reloads the page.
 t.onUpdate=function(){t.image.data=null;t.onUpdate=null;};return t;
};
Bake.prototype.load=async function(index,progress){
 var self=this,e=this.engine,serial=++this.serial;if(this.controller)this.controller.abort();this.controller=new AbortController();var signal=this.controller.signal;if(this.pending)this.release(this.pending.maps);this.pending=null;this.error=null;this.live();this.release(this.maps);this.maps=null;e.index=index;e.loaded=true;progress('poster');
 if(!this.enabled){progress('ready');return true;}
 var collected=[];
 try{
  var items=await Promise.allSettled(['pano','detail','mirror'].flatMap(function(kind){return ['color','depth'].map(async function(label){var t=await self.texture(index,kind,label,signal);collected.push(t);return {kind:kind,label:label,texture:t};});}));
  if(serial!==this.serial){collected.forEach(function(t){t.dispose();});return false;}
  var failed=items.find(function(x){return x.status==='rejected';});if(failed)throw failed.reason;
  var maps={pano:{},detail:{},mirror:{}};items.forEach(function(x){maps[x.value.kind][x.value.label]=x.value.texture;});this.pending={maps:maps,index:index,progress:progress};this.afterFrame();if(e.requestFrame)e.requestFrame();return true;
 }catch(error){collected.forEach(function(t){t.dispose();});if(serial!==this.serial)return false;this.error=String(error);console.warn('Confluence landscape uses live fallback:',error.message);progress('ready');return false;}
};
Bake.prototype.afterFrame=function(){
 var p=this.pending,e=this.engine;if(!p||!e.sun.shadow.map)return;this.pending=null;this.maps=p.maps;this.active=true;this.quad.visible=true;this.staticMeshes.forEach(function(m){m.visible=false;m.geometry.dispose();});
 var angles=[[28,-9],[-25,15],[83,-4]][p.index],y=angles[0]*Math.PI/180,q=angles[1]*Math.PI/180,u=this.uniforms;
 u.detailForward.value.set(Math.sin(y)*Math.cos(q),Math.sin(q),-Math.cos(y)*Math.cos(q));u.detailRight.value.set(Math.cos(y),0,Math.sin(y));u.detailUp.value.crossVectors(u.detailRight.value,u.detailForward.value);
 p.progress('ready');if(e.requestFrame)e.requestFrame();
};
Bake.prototype.report=function(){return {enabled:this.enabled,active:this.active,view:this.engine.index,error:this.error,gpuBytes:this.active?((4096*2048+4096*4096+2048*1024)*4*(1+4/3)):0};};
Bake.prototype.dispose=function(){if(this.controller)this.controller.abort();this.release(this.maps);if(this.pending)this.release(this.pending.maps);this.material.dispose();this.quad.geometry.dispose();};
window.ConfluenceBake=Bake;
})();
