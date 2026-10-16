/* The Confluence v6 — the end of the white floor.
 * Three r128 / same-origin / IIFE. Geometry, mirrored water, bounded wave memory.
 * New visual adaptation: dimensions and touch interaction are not novel canon. */
(function(){'use strict';
var T=THREE,PI=Math.PI;
var lightDir=new T.Vector3(-.30,.75,-.60).normalize();
var discPositions=[[-12,12,-13],[34,12,-80],[-64,12,-110],[94,12,-170],[-108,12,-225],[26,12,-290]];
var sharedTime={value:0};
var shadeGLSL=`
uniform float confluenceTime;
float discCover(vec3 p,vec3 c){
 float h=c.y-p.y;if(h<=0.)return 0.;
 vec2 q=p.xz+vec2(-.30,-.60)/.75*h-c.xz;
 float r=length(q);if(r>12.2)return 0.;float a=atan(q.y,q.x)+confluenceTime*0.2237601605;
 float core=1.-smoothstep(9.93,10.05,r);
 float rim=smoothstep(11.54,11.64,r)*(1.-smoothstep(12.02,12.10,r));
 float sector=abs(sin(a*18.));
 float ribs=(1.-smoothstep(.14,.23,sector))*smoothstep(9.9,10.04,r)*(1.-smoothstep(11.65,11.73,r));
 return max(core,max(rim,ribs));
}
float discShade(vec3 p){return 1.-.43*max(max(max(discCover(p,vec3(-12.,12.,-13.)),discCover(p,vec3(34.,12.,-80.))),max(discCover(p,vec3(-64.,12.,-110.)),discCover(p,vec3(94.,12.,-170.)))),max(discCover(p,vec3(-108.,12.,-225.)),discCover(p,vec3(26.,12.,-290.))));}
`;
function rounded(w,h,d,r){
 r=Math.min(r||.018,w*.12,h*.12,d*.12);var x=w/2-r,y=h/2-r,s=new T.Shape();
 s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);
 var g=new T.ExtrudeGeometry(s,{depth:d-2*r,steps:1,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,curveSegments:4});g.translate(0,0,-d/2+r);return g;
}
function merged(gs){var a=[],n=[],uv=[];gs.forEach(function(g){var b=g.index?g.toNonIndexed():g;['position','normal','uv'].forEach(function(k,i){var dst=[a,n,uv][i],v=b.attributes[k];for(var j=0;j<v.array.length;j++)dst.push(v.array[j]);});if(b!==g)b.dispose();g.dispose();});var out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(a,3));out.setAttribute('normal',new T.Float32BufferAttribute(n,3));out.setAttribute('uv',new T.Float32BufferAttribute(uv,2));out.computeBoundingSphere();return out;}
function Engine(canvas){
 this.renderer=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(1);this.renderer.outputEncoding=T.sRGBEncoding;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.89;
 this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;
 this.reflectionType=(this.renderer.capabilities.isWebGL2&&this.renderer.extensions.has("EXT_color_buffer_float"))||this.renderer.extensions.has("EXT_color_buffer_half_float")?T.HalfFloatType:T.UnsignedByteType;this.scene=new T.Scene();this.scene.fog=new T.FogExp2(0xb9cccd,.0015);this.camera=new T.PerspectiveCamera(60,1,.08,2600);this.mirrorCamera=new T.PerspectiveCamera();
 this.quality='auto';this.staticMode=false;this.loaded=false;this.commonReady=false;this.width=0;this.height=0;this.index=0;this.serial=0;this.pickables=[];this.discs=[];this.events=[];this.eventCount=0;this.memory=new T.Vector4(0,0,0,0);this.lastTime=0;this.lastImpulse=-100;this.ray=new T.Raycaster();this.frameStats={frames:0,milliseconds:0};this.scene.name='The end of the white floor';
 this.eyes=[[-3.2,2.23,1.7],[-7.6,2.23,-8.5],[11,2.25,15]];
 this.pools={};this.materials=[];this.parts=[];this._build();
}
Engine.prototype._material=function(name,color,rough,metal){
 var m=new T.MeshStandardMaterial({color:color,roughness:rough,metalness:metal||0,envMapIntensity:.6});m.name=name;
 m.onBeforeCompile=function(s){s.uniforms.confluenceTime=sharedTime;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cWorld;varying vec3 cLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\ncWorld=(modelMatrix*vec4(position,1.)).xyz;cLocal=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 cWorld;varying vec3 cLocal;\n'+shadeGLSL).replace('#include <color_fragment>',`#include <color_fragment>
 float grain=fract(sin(dot(floor(cWorld*380.),vec3(13.13,71.37,29.17)))*43758.5453);
 diffuseColor.rgb*=.975+.045*grain;
 float tide=(1.-smoothstep(.18,.68+.055*sin(cWorld.x*31.+cWorld.z*17.),cWorld.y))*.18;
 diffuseColor.rgb*=1.-tide;
 `).replace('#include <output_fragment>','outgoingLight*=discShade(cWorld);\nfloat corner=min(abs(cWorld.x+3.80),abs(cWorld.x-3.80));float contact=exp(-corner*4.)*exp(-abs(cWorld.y-.6)*3.)*step(-2.1,cWorld.z)*step(cWorld.z,8.5);outgoingLight*=1.-.22*contact;\n#include <output_fragment>');};
 if(name.indexOf('disc')===0){var base=m.onBeforeCompile;m.onBeforeCompile=function(s){base(s);s.fragmentShader=s.fragmentShader.replace('diffuseColor.rgb*=.975+.045*grain;', 'diffuseColor.rgb*=.96+.018*sin(length(cLocal.xz)*125.)+.022*grain;');};}this.materials.push(m);return m;
};
Engine.prototype._part=function(role,mat,g,pos,rot,label){var transform=new T.Object3D();if(pos)transform.position.fromArray(pos);if(rot)transform.rotation.set(rot[0],rot[1],rot[2]);transform.updateMatrix();g.applyMatrix4(transform.matrix);g.computeBoundingBox();this.parts.push({name:label||role,role:role,min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray()});var key=role+'|'+mat.name;if(!this.pools[key])this.pools[key]={role:role,mat:mat,gs:[]};this.pools[key].gs.push(g);};
Engine.prototype._box=function(role,mat,size,pos,rot,label){this._part(role,mat,rounded(size[0],size[1],size[2]),pos,rot,label);};
Engine.prototype._build=function(){
 var self=this,scene=this.scene;
 var white=this._material('porcelain mineral',0xe5e4dd,.52,.035),floor=this._material('honed white stone',0xcfd3ce,.35,.08),edge=this._material('cut stone edge',0xbcc7c3,.64,.02),metal=this._material('brushed palladium',0x9caeaf,.3,.8),dark=this._material('inset seams',0x263b40,.6,.12),discMat=this._material('disc satin shell',0x9faeae,.28,.72),discInner=this._material('disc inner well',0x50686c,.48,.6);
 // A single room. Floor slabs meet over a continuous plinth; the open water edge
 // is an actual edge, not a dark rectangle painted on an enclosing wall.
 this._box(11,edge,[8.3,.20,10.8],[0,.44,3.25],null,'continuous floor plinth');
 for(var x=0;x<4;x++)for(var z=0;z<6;z++)this._box(11,floor,[1.891,.116,1.691],[-2.85+x*1.9,.54,-1.15+z*1.7],null,'floor slab '+x+'/'+z);
 this._box(9,white,[.34,3.64,10.4],[-3.97,2.42,3.1],null,'west load wall');
 for(var px of [-3.85,3.85])for(var pz of [-1.8,3.3,8.3])this._box(9,edge,[.55,3.34,.55],[px,-1.33,pz],null,'submerged foundation pier');
 // Eastern wall terminates before the edge, as in the text.
 this._box(9,white,[.34,3.64,7.0],[3.97,2.42,4.8],null,'east partial wall');
 this._box(9,white,[2.9,3.64,.34],[-2.52,2.42,8.4],null,'rear wall left');
 this._box(9,white,[2.9,3.64,.34],[2.52,2.42,8.4],null,'rear wall right');
 this._box(9,white,[2.14,.7,.34],[0,3.89,8.4],null,'door lintel');
 this._box(9,metal,[2.0,2.91,.10],[0,2.055,8.46],null,'closed sliding door');
 this._box(9,dark,[.012,2.87,.012],[0,2.055,8.397],null,'door meeting line');
 // Roof seats on walls and cantilevers 3.6 m past the floor.
 this._box(9,white,[8.3,.38,14.0],[0,4.43,1.5],null,'roof slab');
 this._box(9,metal,[8.2,.055,.12],[0,4.235,-5.45],null,'roof drip edge');
 for(var i=0;i<11;i++)this._box(9,edge,[.018,.012,13.8],[-3.65+i*.73,4.233,1.5],null,'soffit joint');
 // Finely spaced dry joints, not brightly coloured decorative strips.
 for(var j=0;j<4;j++){
  this._box(9,edge,[.014,3.54,.012],[-3.792,2.42,-.8+j*2.5],[0,PI/2,0],'west vertical joint');
  if(j>0)this._box(9,edge,[.014,3.54,.012],[3.792,2.42,-.8+j*2.5],[0,PI/2,0],'east vertical joint');
 }
 // Inquiry surface: standing height, a recessed hand rest and supported housing.
 this._box(10,white,[.54,.91,.50],[-2.35,1.055,4.65],null,'inquiry pedestal');
 this._box(10,metal,[1.25,.11,.70],[-2.35,1.565,4.65],null,'inquiry desk casing');
 this._box(10,dark,[.83,.012,.40],[-2.48,1.626,4.58],null,'inquiry inset face');
 this._box(10,white,[.23,.016,.18],[-1.90,1.626,4.77],null,'hand rest recessed center');
 this._box(10,metal,[.27,.032,.035],[-1.90,1.634,4.66],null,'hand rest upper rim');
 this._box(10,metal,[.27,.032,.035],[-1.90,1.634,4.88],null,'hand rest lower rim');
 var textCanvas=document.createElement('canvas');textCanvas.width=1024;textCanvas.height=512;var ctx=textCanvas.getContext('2d');ctx.fillStyle='#142527';ctx.fillRect(0,0,1024,512);ctx.fillStyle='#c9d8cc';ctx.font='28px monospace';ctx.fillText('総和　当該帯　一件',70,150);ctx.fillStyle='#829a92';ctx.font='21px monospace';ctx.fillText('繰り入れ　実施　四七〇二　含む',70,225);ctx.fillRect(70,300,860,1);
 var txt=new T.CanvasTexture(textCanvas);txt.encoding=T.sRGBEncoding;var display=new T.Mesh(new T.PlaneGeometry(.78,.36),new T.MeshBasicMaterial({map:txt}));display.rotation.x=-PI/2;display.position.set(-2.48,1.635,4.58);display.userData.record=10;scene.add(display);this.pickables.push(display);
 // A continuous route from the rear door to the underside station.
 this._box(8,edge,[3.8,.42,25.0],[-6,.27,.7],null,'shore path foundation');
 this._box(8,floor,[3.8,.12,25.0],[-6,.54,.7],null,'shore path');
 this._box(8,edge,[19.0,.42,4.2],[1.6,.27,12.3],null,'rear crossing foundation');
 this._box(8,floor,[19.0,.12,4.2],[1.6,.54,12.3],null,'rear crossing');
 this._box(8,edge,[3.0,.42,8.0],[11,.27,14.2],null,'eastern approach foundation');
 this._box(8,floor,[3.0,.12,8.0],[11,.54,14.2],null,'eastern approach');
 // Visible panel joints and continuous door reveals carry the scale.
 for(var n=0;n<5;n++){
  this._box(9,edge,[.012,3.54,.016],[-3.97,2.42,-.9+n*2.15],null,'outer western panel joint');
  this._box(9,edge,[.016,3.54,.012],[-3.2+n*1.6,2.42,8.58],null,'rear panel joint');
 }
 this._box(9,dark,[2.04,.025,.04],[0,.615,8.39],null,'door sill reveal');
 this._box(9,dark,[.025,2.95,.04],[-1.01,2.1,8.39],null,'door west reveal');
 this._box(9,dark,[.025,2.95,.04],[1.01,2.1,8.39],null,'door east reveal');
 this._box(8,edge,[2.5,.42,2.5],[0,.27,9.35],null,'door approach foundation');
 this._box(8,floor,[2.5,.12,2.5],[0,.54,9.35],null,'door approach');
 // Four actual open channels, the nearest passing below the room.
 for(var side of [-1,1]){
  this._box(1,edge,[70,.5,.35],[95,-.10,-45+side*3.2],null,'east inlet bank');
  this._box(1,edge,[70,.5,.35],[-110,-.10,-70+side*3.2],null,'west inlet bank');
  this._box(1,edge,[.35,.5,80],[-10+side*3.2,-.10,-280],null,'north inlet bank');
 }
 // Flow channels feed from beneath the floor, kept open between foundations.
 this._box(1,edge,[.30,.75,22.0],[-2.9,-.35,8.8],null,'channel left bank');this._box(1,edge,[.30,.75,22.0],[2.9,-.35,8.8],null,'channel right bank');
 Object.keys(this.pools).forEach(function(k){var p=self.pools[k],m=new T.Mesh(merged(p.gs),p.mat);m.userData.record=p.role;m.castShadow=true;m.receiveShadow=true;scene.add(m);self.pickables.push(m);});this.pools={};
 // The core and continuous rim are connected by 36 physical ribs. Analytic
 // moving shadows use this same core/rim/rib layout, at the same angular speed.
 var profile=[[0,-.68],[2.7,-.68],[3.0,-.57],[7.9,-.57],[7.94,-.52],[8.01,-.52],[8.06,-.57],[8.9,-.57],[9.78,-.52],[10,-.36],[10,.40],[9.83,.55],[9.55,.55],[9.39,.40],[9.39,-.23],[0,-.23]];
 var shell=new T.LatheGeometry(profile.map(function(p){return new T.Vector2(p[0],p[1]);}),192);
 var rim=new T.LatheGeometry([[11.62,-.45],[11.98,-.45],[12.06,-.35],[12.06,.35],[11.98,.45],[11.62,.45],[11.62,-.45]].map(function(p){return new T.Vector2(p[0],p[1]);}),192);
 var ribs=[];for(var k=0;k<36;k++){var g=rounded(1.85,.34,.15,.018);g.translate(10.8,-.1,0);g.rotateY(k*2*PI/36);ribs.push(g);}var ribGeo=merged(ribs);
 discPositions.forEach(function(pos,i){var group=new T.Group();group.position.fromArray(pos);[shell,rim,ribGeo].forEach(function(g,k){var mesh=new T.Mesh(g,k===2?discInner:discMat);mesh.userData.record=2;group.add(mesh);self.pickables.push(mesh);});scene.add(group);self.discs.push(group);});
 var ambient=new T.HemisphereLight(0xdaecee,0x405358,.57);scene.add(ambient);
 var sun=new T.DirectionalLight(0xfff4ed,2.4);sun.position.copy(lightDir).multiplyScalar(55);sun.target.position.set(0,0,0);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:.5,far:150});sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;scene.add(sun);scene.add(sun.target);
 var fill=new T.PointLight(0xc5dce0,.35,16,2);fill.position.set(0,3.7,3.5);scene.add(fill);
 this._sky();this._water();
};
Engine.prototype._sky=function(){
 var self=this,skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{},vertexShader:'varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
 varying vec3 vDirection;
 void main(){vec3 d=normalize(vDirection);float h=max(0.,d.y);
 vec3 c=mix(vec3(.32,.47,.50),vec3(.055,.15,.23),pow(h,.48));
 float haze=exp(-abs(d.y)*17.);c+=haze*vec3(.20,.19,.19);
 vec3 a=normalize(vec3(-.30,.75,-.60)),b=normalize(vec3(-.40,.83,-.57));
 float sa=1.-smoothstep(.00034,.00040,1.-dot(d,a));float sb=1.-smoothstep(.00012,.00016,1.-dot(d,b));
 c+=sa*vec3(2.0,1.5,1.75)+sb*vec3(1.15,1.7,1.65);
 float cloud=sin(d.x*19.+d.z*8.)*.5+sin(d.z*24.-d.x*7.)*.22;
 c+=vec3(.018,.025,.029)*cloud*pow(1.-h,3.);
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
 }`});
 this.sky=new T.Mesh(new T.SphereGeometry(1800,32,16),skyMat);this.sky.frustumCulled=false;this.scene.add(this.sky);
 // Generate an environment map from precisely the same sky used by the scene.
 var envScene=new T.Scene();envScene.add(this.sky.clone());var pmrem=new T.PMREMGenerator(this.renderer);this.environment=pmrem.fromScene(envScene,.06,.1,2200);this.scene.environment=this.environment.texture;pmrem.dispose();
};
Engine.prototype._water=function(){
 var events=[];for(var i=0;i<8;i++)events.push(new T.Vector4(0,0,-1000,0));
 this.waterUniforms={seconds:sharedTime,reflection:{value:null},reflectionMatrix:{value:new T.Matrix4()},eye:{value:new T.Vector3()},touches:{value:events},memory:{value:this.memory},confluenceTime:sharedTime};
 var vs=`varying vec3 wPoint;varying vec4 mirrorPoint;uniform mat4 reflectionMatrix;
 void main(){vec4 wp=modelMatrix*vec4(position,1.);wPoint=wp.xyz;mirrorPoint=reflectionMatrix*wp;gl_Position=projectionMatrix*viewMatrix*wp;}`;
 var fs=`precision highp float;
 varying vec3 wPoint;varying vec4 mirrorPoint;uniform sampler2D reflection;uniform float seconds;uniform vec3 eye;uniform vec4 touches[8];uniform vec4 memory;
 ${shadeGLSL}
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
 float wave(vec2 p){
 float t=seconds;float a=exp(-p.x*p.x*.09)*smoothstep(-17.,-1.,p.y);
 float b=exp(-pow(p.y+45.,2.)*.08)*smoothstep(35.,60.,p.x);
 float c=exp(-pow(p.y+70.,2.)*.08)*(1.-smoothstep(-75.,-45.,p.x));
 float d=exp(-pow(p.x+10.,2.)*.08)*(1.-smoothstep(-240.,-210.,p.y));
 float channel=max(max(a,b),max(c,d));
 vec2 flow=p+vec2(.09*sin(p.y*.8-t)+(b-c)*t*.75,(a-d)*t*.75);
 float warp=sin(p.x*.31+p.y*.23+t*.19)*.65+sin(p.y*.57-t*.21)*.4;
 float h=.028*sin(dot(flow,vec2(.8,1.9))-t*1.7+warp)+.018*sin(dot(flow,vec2(-2.1,.7))+t*1.4+warp*.5);
 h+=.007*sin(dot(flow,vec2(5.7,3.4))-t*2.3)+.004*sin(dot(flow,vec2(-8.2,9.7))+t*2.6);
 h+=.011*channel*sin(flow.y*7.+sin(flow.x*5.+t)*.6);
 h+=.032*noise(flow*2.1+vec2(t*.3,-t*.2))+.008*noise(flow*8.7+vec2(-t*.27,t*.11));
 for(int i=0;i<8;i++){vec4 e=touches[i];if(e.w<.001)continue;float age=max(0.,t-e.z);vec2 delta=p-e.xy;
 delta.y+=age*.22*exp(-e.x*e.x*.04);float r=length(delta);
 float front=r-age*1.25;
 float envelope=exp(-front*front/(.32+age*.16))*exp(-age*.14)*e.w;
 float disorder=smoothstep(1.8,9.,age)*(.8*sin(p.x*1.8+t)+.55*sin(p.y*2.4-t*.8));
 h+=.055*envelope*sin(front*9.+disorder)/sqrt(1.+r);
 }
 // The identifiable rings disperse into low-amplitude ambient modes. The
 // accumulated contribution stays bounded and remains after an event expires.
 h+=memory.x*.009*sin(dot(p,vec2(.61,1.17))-t*1.12+memory.z);
 h+=memory.y*.008*sin(dot(p,vec2(-1.13,.79))+t*.89+memory.w);
 return h;
 }
 void main(){vec2 p=wPoint.xz;float d=length(eye-wPoint);float e=mix(.035,.22,smoothstep(15.,130.,d));float h=wave(p);
 vec2 slope=vec2(wave(p+vec2(e,0.))-h,wave(p+vec2(0.,e))-h)/e;
 slope*=mix(1.,.12,smoothstep(30.,220.,d));
 vec3 n=normalize(vec3(-slope.x,1.,-slope.y)),v=normalize(eye-wPoint);
 vec2 uv=mirrorPoint.xy/mirrorPoint.w*.5+.5;
 uv+=n.xz*.024*min(1.,30./max(1.,d));
 uv=clamp(uv,vec2(.002),vec2(.998));vec3 reflectCol=texture2D(reflection,uv).rgb;
 float fresnel=.035+.965*pow(1.-max(0.,dot(n,v)),5.);
 float flow=exp(-p.x*p.x*.09)*smoothstep(-18.,0.,p.y);
 vec3 body=mix(vec3(.012,.055,.065),vec3(.028,.105,.11),.5+.5*sin(p.y*.06));
 body+=vec3(.035,.055,.052)*flow;
 vec3 c=mix(body,reflectCol,.20+.80*fresnel);
 vec3 l=normalize(vec3(-.30,.75,-.60));vec3 halfV=normalize(l+v);
 float spec=pow(max(0.,dot(n,halfV)),190.);c+=vec3(.95,.80,.85)*spec*.55;
 c*=discShade(wPoint);
 float pulse=1.+.008*sin(seconds*8.0553658);c*=pulse;
 float fog=1.-exp(-d*.0019);c=mix(c,vec3(.50,.64,.66),fog);
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
 }`;
 var g=new T.PlaneGeometry(3000,3000);g.rotateX(-PI/2);this.water=new T.Mesh(g,new T.ShaderMaterial({uniforms:this.waterUniforms,vertexShader:vs,fragmentShader:fs}));this.water.position.y=0;this.water.userData.record=0;this.scene.add(this.water);this.pickables.push(this.water);
};
Engine.prototype.loadCommon=function(){this.commonReady=true;return Promise.resolve();};
Engine.prototype.loadSpot=function(i,progress){this.index=i;this.loaded=true;progress('poster');progress('ready');return Promise.resolve(true);};
Engine.prototype.resize=function(w,h){var cap=this.quality==='high'?2:this.quality==='low'?.85:1.35,budget=this.quality==='high'?2200000:this.quality==='low'?450000:1050000,scale=Math.min(devicePixelRatio||1,cap,Math.sqrt(budget/(w*h))),width=Math.max(1,Math.round(w*scale)),height=Math.max(1,Math.round(h*scale));if(width===this.width&&height===this.height)return;this.width=width;this.height=height;this.renderer.setSize(width,height,false);if(this.mirrorTarget)this.mirrorTarget.dispose();var factor=this.quality==='low'?.4:.6;this.mirrorTarget=new T.WebGLRenderTarget(Math.max(128,Math.round(width*factor)),Math.max(128,Math.round(height*factor)),{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,type:this.reflectionType});this.waterUniforms.reflection.value=this.mirrorTarget.texture;};
Engine.prototype.draw=function(yaw,pitch,fov,time){
 var start=performance.now();sharedTime.value=time;this.lastTime=time;var c=this.camera;c.aspect=this.width/this.height;c.fov=c.aspect<1?Math.min(78,fov+13):fov;c.updateProjectionMatrix();c.position.fromArray(this.eyes[this.index]);var ya=(yaw+(this.index===0&&c.aspect>1?10:0))*PI/180,pi=pitch*PI/180,dir=new T.Vector3(Math.sin(ya)*Math.cos(pi),Math.sin(pi),-Math.cos(ya)*Math.cos(pi));c.up.set(0,1,0);c.lookAt(c.position.clone().add(dir));c.updateMatrixWorld();this.discs.forEach(function(d){d.rotation.y=time*2*PI/28.08;});
 var m=this.mirrorCamera;m.copy(c);m.position.y=-c.position.y;m.up.set(0,-1,0);m.lookAt(m.position.clone().add(new T.Vector3(dir.x,-dir.y,dir.z)));m.updateMatrixWorld();
 // Clip geometry below the reflecting surface in the mirrored camera.
 var plane=new T.Plane(new T.Vector3(0,1,0),0).applyMatrix4(m.matrixWorldInverse),clip=new T.Vector4(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant),q=new T.Vector4(),p=m.projectionMatrix.elements;
 q.x=(Math.sign(clip.x)+p[8])/p[0];q.y=(Math.sign(clip.y)+p[9])/p[5];q.z=-1;q.w=(1+p[10])/p[14];clip.multiplyScalar(2/clip.dot(q));p[2]=clip.x;p[6]=clip.y;p[10]=clip.z+1;p[14]=clip.w;
 this.waterUniforms.reflectionMatrix.value.multiplyMatrices(m.projectionMatrix,m.matrixWorldInverse);this.waterUniforms.eye.value.copy(c.position);
 this.water.visible=false;this.renderer.toneMapping=T.NoToneMapping;this.renderer.setRenderTarget(this.mirrorTarget);this.renderer.render(this.scene,m);this.renderer.toneMapping=T.ACESFilmicToneMapping;this.water.visible=true;this.renderer.setRenderTarget(null);this.renderer.render(this.scene,c);this.frameStats.frames++;this.frameStats.milliseconds+=performance.now()-start;
};
Engine.prototype.pick=function(clientX,clientY){var b=this.renderer.domElement.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((clientX-b.left)/b.width*2-1,1-(clientY-b.top)/b.height*2),this.camera);this.scene.updateMatrixWorld(true);var hits=this.ray.intersectObjects(this.pickables,false);if(!hits.length)return null;var h=hits[0];return {key:h.object.userData.record,point:h.point.toArray(),distance:h.distance,water:h.object===this.water};};
Engine.prototype.disturb=function(point,time){if(time-this.lastImpulse<.12)return false;this.lastImpulse=time;var i=this.eventCount++%8;this.events.push({point:point.slice(),time:time});if(this.events.length>128)this.events.splice(0,120);this.waterUniforms.touches.value[i].set(point[0],point[2],time,1);
 this.memory.x=1.-(1.-this.memory.x)*.88;this.memory.y=1.-(1.-this.memory.y)*.90;this.memory.z=(this.memory.z+point[0]*.17+.31)%(2*PI);this.memory.w=(this.memory.w+point[2]*.11+.47)%(2*PI);return true;};
Engine.prototype.report=function(){return {ready:this.loaded,revision:'v6',view:this.index,time:this.lastTime,impulses:this.eventCount,memory:this.memory.toArray(),size:[this.width,this.height],drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,frameStats:this.frameStats};};
Engine.prototype.dispose=function(){var geometries=new Set(),materials=new Set();this.scene.traverse(function(o){if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(function(g){g.dispose();});materials.forEach(function(m){m.dispose();});if(this.environment)this.environment.dispose();if(this.mirrorTarget)this.mirrorTarget.dispose();this.renderer.dispose();};
window.ConfluenceEngine=Engine;
})();
