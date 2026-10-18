/* The Confluence v12 — the end of the white floor.
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
 float above=step(p.y,c.y);float h=max(0.,c.y-p.y);
 vec2 q=p.xz+vec2(-.30,-.60)/.75*h-c.xz;
 float r=length(q);float a=atan(q.y,q.x)+confluenceTime*0.2237601605;
 float softness=max(.06+h*.007, fwidth(r)*1.15);
 float core=1.-smoothstep(10.-softness,10.+softness,r);
 float rim=smoothstep(11.62-softness,11.62+softness,r)*(1.-smoothstep(12.06-softness,12.06+softness,r));
 float sector=abs(sin(a*18.));
 float aa=max(.045,fwidth(sector));
 float rib=1.-smoothstep(.18-aa,.18+aa,sector);
 rib=mix(rib,.115,smoothstep(.5,1.4,fwidth(a)*18.));
 float ribs=rib*smoothstep(10.-softness,10.+softness,r)*(1.-smoothstep(11.7-softness,11.7+softness,r));
 return above*max(core,max(rim,ribs));
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
 this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;
 this.reflectionType=(this.renderer.capabilities.isWebGL2&&this.renderer.extensions.has("EXT_color_buffer_float"))||this.renderer.extensions.has("EXT_color_buffer_half_float")?T.HalfFloatType:T.UnsignedByteType;this.scene=new T.Scene();this.scene.fog=new T.FogExp2(0xb9cccd,.0035);this.camera=new T.PerspectiveCamera(60,1,.08,2600);this.mirrorCamera=new T.PerspectiveCamera();
 this.quality='auto';this.staticMode=false;this.loaded=false;this.commonReady=false;this.width=0;this.height=0;this.index=0;this.serial=0;this.pickables=[];this.discs=[];this.events=[];this.eventCount=0;this.memory=new T.Vector4(0,0,0,0);this.lastTime=0;this.lastImpulse=-100;this.ray=new T.Raycaster();this.frameStats={frames:0,milliseconds:0};this.scene.name='The end of the white floor';
 this.eyes=[[-1.65,2.23,1.3],[-7.6,2.23,-8.5],[11,2.25,15]];
 this.pools={};this.materials=[];this.parts=[];this._build();this.bake=new ConfluenceBake(this);
}
Engine.prototype._material=function(name,color,rough,metal){
 var m=new T.MeshStandardMaterial({color:color,roughness:rough,metalness:metal||0,envMapIntensity:.6});m.name=name;m.extensions={derivatives:true};
 m.onBeforeCompile=function(s){s.uniforms.confluenceTime=sharedTime;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cWorld;varying vec3 cLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\ncWorld=(modelMatrix*vec4(position,1.)).xyz;cLocal=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 cWorld;varying vec3 cLocal;\n'+shadeGLSL).replace('#include <color_fragment>',`#include <color_fragment>
 float grain=fract(sin(dot(floor(cWorld*380.),vec3(13.13,71.37,29.17)))*43758.5453);
 diffuseColor.rgb*=.986+.022*mix(.5,grain,1.-smoothstep(.5,2.,length(fwidth(cWorld*380.))));
 float tide=(1.-smoothstep(.18,.68+.055*sin(cWorld.x*31.+cWorld.z*17.),cWorld.y))*.18;
 diffuseColor.rgb*=1.-tide;
 `).replace('#include <output_fragment>','outgoingLight*=discShade(cWorld);\nfloat corner=min(abs(cWorld.x+3.80),abs(cWorld.x-3.80));float contact=exp(-corner*4.)*exp(-abs(cWorld.y-.6)*3.)*step(-2.1,cWorld.z)*step(cWorld.z,8.5);outgoingLight*=1.-.22*contact;\n#include <output_fragment>');};
 if(name.indexOf('disc')===0){var base=m.onBeforeCompile;m.onBeforeCompile=function(s){base(s);s.fragmentShader=s.fragmentShader.replace('diffuseColor.rgb*=.986+.022*mix(.5,grain,1.-smoothstep(.5,2.,length(fwidth(cWorld*380.))));', 'diffuseColor.rgb*=.96+.018*sin(length(cLocal.xz)*125.)*(1.-smoothstep(.5,2.,fwidth(length(cLocal.xz)*125.)))+.022*mix(.5,grain,1.-smoothstep(.5,2.,length(fwidth(cWorld*380.))));');};}if(name==='shore mineral'){var shoreBase=m.onBeforeCompile;m.onBeforeCompile=function(s){shoreBase(s);s.fragmentShader=s.fragmentShader.replace('diffuseColor.rgb*=.986+.022*mix(.5,grain,1.-smoothstep(.5,2.,length(fwidth(cWorld*380.))));',`float strata=sin(cWorld.x*.19+sin(cWorld.z*.27))*sin(cWorld.z*.21)+.35*sin(cWorld.x*1.7+cWorld.z*.9);
 diffuseColor.rgb*=.91+.065*strata+.018*mix(.5,grain,1.-smoothstep(.5,2.,length(fwidth(cWorld*380.))));`);};}this.materials.push(m);return m;
};
Engine.prototype._part=function(role,mat,g,pos,rot,label){var transform=new T.Object3D();if(pos)transform.position.fromArray(pos);if(rot)transform.rotation.set(rot[0],rot[1],rot[2]);transform.updateMatrix();g.applyMatrix4(transform.matrix);g.computeBoundingBox();this.parts.push({name:label||role,role:role,min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray()});var key=role+'|'+mat.name;if(!this.pools[key])this.pools[key]={role:role,mat:mat,gs:[]};this.pools[key].gs.push(g);};
Engine.prototype._box=function(role,mat,size,pos,rot,label){this._part(role,mat,rounded(size[0],size[1],size[2]),pos,rot,label);};
Engine.prototype._build=function(){
 var self=this,scene=this.scene;var pathMat=this._material('exterior approach',0x849b9d,.95,0);
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
 // Visible panel joints and continuous door reveals carry the scale.
 for(var n=0;n<5;n++){
  this._box(9,edge,[.012,3.54,.016],[-3.97,2.42,-.9+n*2.15],null,'outer western panel joint');
  this._box(9,edge,[.016,3.54,.012],[-3.2+n*1.6,2.42,8.58],null,'rear panel joint');
 }
 this._box(9,dark,[2.04,.025,.04],[0,.615,8.39],null,'door sill reveal');
 this._box(9,dark,[.025,2.95,.04],[-1.01,2.1,8.39],null,'door west reveal');
 this._box(9,dark,[.025,2.95,.04],[1.01,2.1,8.39],null,'door east reveal');

 // The room stands at a shore. Its open end spans the mouth of a real
 // inlet; the road and the land behind it continue beyond the building.
 this._shore(floor,edge,white);
 Object.keys(this.pools).forEach(function(k){var p=self.pools[k],m=new T.Mesh(merged(p.gs),p.mat);m.userData.record=p.role;m.castShadow=!p.mat.alphaTest;m.receiveShadow=true;scene.add(m);self.pickables.push(m);});this.pools={};
 // The core and continuous rim are connected by 36 physical ribs. Analytic
 // moving shadows use this same core/rim/rib layout, at the same angular speed.
 var profile=[[0,-.68],[2.7,-.68],[3.0,-.57],[7.9,-.57],[7.94,-.52],[8.01,-.52],[8.06,-.57],[8.9,-.57],[9.78,-.52],[10,-.36],[10,.40],[9.83,.55],[9.55,.55],[9.39,.40],[9.39,-.23],[0,-.23]];
 var shell=new T.LatheGeometry(profile.map(function(p){return new T.Vector2(p[0],p[1]);}),192);
 var rim=new T.LatheGeometry([[11.62,-.45],[11.98,-.45],[12.06,-.35],[12.06,.35],[11.98,.45],[11.62,.45],[11.62,-.45]].map(function(p){return new T.Vector2(p[0],p[1]);}),192);
 var ribs=[];for(var k=0;k<36;k++){var g=rounded(1.85,.34,.15,.018);g.translate(10.8,-.1,0);g.rotateY(k*2*PI/36);ribs.push(g);}var ribGeo=merged(ribs);
 discPositions.forEach(function(pos,i){var group=new T.Group();group.position.fromArray(pos);[shell,rim,ribGeo].forEach(function(g,k){var mesh=new T.Mesh(g,k===2?discInner:discMat);mesh.userData.record=2;group.add(mesh);self.pickables.push(mesh);});scene.add(group);self.discs.push(group);});
 var ambient=new T.HemisphereLight(0xdaecee,0x405358,.57);scene.add(ambient);
 var sun=new T.DirectionalLight(0xfff4ed,2.4);sun.position.copy(lightDir).multiplyScalar(55);sun.target.position.set(0,0,0);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:.5,far:150});sun.shadow.bias=-.00008;sun.shadow.normalBias=.012;sun.shadow.radius=2.5;scene.add(sun);scene.add(sun.target);this.sun=sun;
 var fill=new T.PointLight(0xc5dce0,.35,16,2);fill.position.set(0,3.7,3.5);scene.add(fill);
 this._sky();this._water();
};
// Smooth shore contours are extruded down through the water, so neither
// the visible bank nor its reflection is an infinitely thin floating sheet.
Engine.prototype._land=function(points,role,mat,height,label){
 var shape=new T.Shape(),len=points.length;
 var last=points[len-1],first=points[0];shape.moveTo((last[0]+first[0])/2,-(last[1]+first[1])/2);
 for(var i=0;i<len;i++){var a=points[i],b=points[(i+1)%len];shape.quadraticCurveTo(a[0],-a[1],(a[0]+b[0])/2,-(a[1]+b[1])/2);}
 shape.closePath();
 var g=new T.ExtrudeGeometry(shape,{depth:height+2,bevelEnabled:true,bevelThickness:.18,bevelSize:.22,bevelSegments:3,curveSegments:6,steps:1});
 g.rotateX(-PI/2);g.translate(0,-2,0);
 var a=g.attributes.position;for(var k=0;k<a.count;k++){var x=a.getX(k),y=a.getY(k),z=a.getZ(k);if(y>0.)a.setY(k,y+.038*Math.sin(x*.31+Math.sin(z*.26))+.019*Math.sin(z*.67+x*.47));}g.computeVertexNormals();
 this._part(role,mat,g,null,null,label);
};
Engine.prototype._shore=function(floor,edge,white){
 var earth=this._material('shore mineral',0x304445,.92,.01),root=this._material('water worn roots',0x263a3b,.83,.025);
 // Mipmapped multiscale mineral texture: avoids both a blank plastic bank and
 // the screen-space moire of unfiltered procedural high-frequency noise.
 var tile=document.createElement('canvas');tile.width=tile.height=256;var ctx=tile.getContext('2d'),pixels=ctx.createImageData(256,256);
 function hash(x,y){var v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);}
 function noise(x,y,period){var ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);function h(a,b){return hash((a+period)%period,(b+period)%period);}return (h(ix,iy)*(1-u)+h(ix+1,iy)*u)*(1-v)+(h(ix,iy+1)*(1-u)+h(ix+1,iy+1)*u)*v;}
 for(var yy=0;yy<256;yy++)for(var xx=0;xx<256;xx++){var n=.5*noise(xx/32,yy/32,8)+.28*noise(xx/8,yy/8,32)+.15*noise(xx/2,yy/2,128)+.07*hash(xx,yy),c=110+30*n,k=(yy*256+xx)*4;pixels.data[k]=c;pixels.data[k+1]=c;pixels.data[k+2]=c;pixels.data[k+3]=255;}ctx.putImageData(pixels,0,0);
 var texture=new T.CanvasTexture(tile);texture.encoding=T.sRGBEncoding;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(.32,.32);texture.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());
 earth.color.setHex(0x91a7a5);earth.map=texture;earth.bumpMap=texture;earth.bumpScale=.015;
 var rootTexture=texture.clone();rootTexture.needsUpdate=true;rootTexture.repeat.set(3,1);root.color.setHex(0x627a7a);root.map=rootTexture;root.bumpMap=rootTexture;root.bumpScale=.018;

 this._land([[-650,-80],[-180,-65],[-80,-37],[-38,-25],[-21,-19],[-18,-18],[-16,-10],[-13,-9],[-11,-16],[-8,-13],[-5,-5],[-3,-1],[-3,3],[0,5],[6,5],[14,9],[26,14],[50,16],[85,11],[170,10],[650,10],[650,650],[-650,650]],8,earth,.27,'continuous land behind record house');
 this._land([[3,-1],[8,-3],[15,-8],[30,-18],[60,-38],[110,-60],[650,-85],[650,3],[170,3],[85,4],[50,9],[26,7],[17,2],[9,-1]],1,earth,.26,'right inlet peninsula');
 // Low distant shores bound the broad basin without turning it into an ocean.
 this._land([[-650,-82],[-185,-70],[-157,-109],[-191,-170],[-220,-230],[-205,-312],[-232,-385],[-650,-440]],7,earth,1.0,'western shore');
 this._land([[-650,-600],[650,-600],[650,-350],[330,-375],[175,-358],[40,-397],[-90,-371],[-235,-385],[-650,-440]],7,earth,.45,'faint opposite shore');
 this._land([[650,3],[140,-59],[175,-90],[190,-150],[220,-240],[195,-330],[330,-375],[650,-350]],7,earth,.5,'eastern shore');
 // One closed road outline, including the entrance spur. No overlapping road tiles.
 var pathMat=this._material('continuous worn stone path',0x8da3a3,.9,.015);pathMat.map=texture;pathMat.bumpMap=texture;pathMat.bumpScale=.009;
 var road=new T.CatmullRomCurve3([[-6,.6,-12],[-6,.6,-8.5],[-6,.6,6],[-5.7,.6,10.8],[-3,.6,12.3],[0,.6,12.3],[7.5,.6,12.3],[10.5,.6,14],[11.8,.6,17.5],[20,.6,20],[34,.6,22],[52,.6,23],[83,.6,18],[130,.6,17],[240,.6,19],[430,.6,27],[640,.6,42]].map(function(v){return new T.Vector3().fromArray(v);}));
 var centers=road.getSpacedPoints(1000),outer=[],inner=[];
 function roadWidth(p){return p.x<-4?3.8:2.8;}
 for(var j=0;j<centers.length;j++){var c=centers[j],before=centers[Math.max(0,j-1)],after=centers[Math.min(centers.length-1,j+1)],dx=after.x-before.x,dz=after.z-before.z,len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len,w=roadWidth(c)/2;outer.push([c.x+nx*w,c.z+nz*w]);inner.push([c.x-nx*w,c.z-nz*w]);}
 // Replace the inner edge at the doorway by the spur's three exposed edges.
 var entry=false,done=false,innerWithDoor=[];
 inner.forEach(function(p){if(!done&&p[0]>-1.25&&p[0]<1.25&&p[1]>10&&p[1]<13){if(!entry){innerWithDoor.push([-1.25,p[1]],[-1.25,8.57],[1.25,8.57]);entry=true;}return;}if(entry&&!done){innerWithDoor.push([1.25,p[1]]);done=true;}innerWithDoor.push(p);});
 var contour=outer.concat(innerWithDoor.slice().reverse()),shape=new T.Shape();shape.moveTo(contour[0][0],-contour[0][1]);contour.slice(1).forEach(function(p){shape.lineTo(p[0],-p[1]);});shape.closePath();
 var roadGeometry=new T.ExtrudeGeometry(shape,{depth:.30,bevelEnabled:true,bevelThickness:.016,bevelSize:.016,bevelSegments:2,steps:1});roadGeometry.rotateX(-PI/2);roadGeometry.translate(0,.284,0);this._part(8,pathMat,roadGeometry,null,null,'continuous path and entrance spur');
 // A narrow graded shoulder binds the path to the mineral ground, not a painted edge line.
 function shoulder(points,sign){var pos=[],uv=[];for(var i=0;i<points.length-1;i++){var a=points[i],b=points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);if(l<.0001)continue;var nx=-dz/l*sign,nz=dx/l*sign,fall=.72;var q=[[a[0],.57,a[1]],[b[0],.57,b[1]],[b[0]+nx*fall,.275,b[1]+nz*fall],[a[0]+nx*fall,.275,a[1]+nz*fall]];(sign>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]).forEach(function(k){pos.push.apply(pos,q[k]);uv.push(q[k][0]*.32,q[k][2]*.32);});}var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();self._part(8,earth,g,null,null,'graded road shoulder');}
 var self=this;shoulder(outer,1);shoulder(innerWithDoor,-1);
 this.roadQA={outline:contour,samples:centers.map(function(p){return [p.x,p.z];}),top:.6,entrance:[0,.6,8.57]};
 // Roots grip both the exposed bank and the submerged margin. Their branching
 // retain still water at the bank; the walking ground has no isolated openings.
 var self=this;
 function branch(points,radius,label){var curve=new T.CatmullRomCurve3(points.map(function(p){return new T.Vector3().fromArray(p);})),g=new T.TubeGeometry(curve,24,1,7,false),a=g.attributes.position;
  for(var i=0;i<=24;i++){var center=curve.getPointAt(i/24),r=radius*(1.-.82*i/24);for(var k=0;k<=7;k++){var n=i*8+k,v=new T.Vector3().fromBufferAttribute(a,n).sub(center).multiplyScalar(r).add(center);a.setXYZ(n,v.x,v.y,v.z);}}g.computeVertexNormals();self._part(3,root,g,null,null,label);}
 [[-14,-8,1],[-20,-17,.8],[-31,-22,1.2],[18,-9,.7],[28,-17,.9]].forEach(function(o,n){var x=o[0],z=o[1],scale=o[2];
  for(var k=0;k<6;k++){var dx=((k-2.5)*.58+.28*Math.sin(k*3.7+n))*scale,zz=z-3.0-(k%3)*.85;branch([[x,.38,z+2],[x+dx*.4,.75,z+.3],[x+dx,.30,z-1],[x+dx*1.35,-.22,zz],[x+dx*1.65,-.8,zz-1]],.25*scale,'bank root '+n+'/'+k);
   if(k%2===0)branch([[x+dx*.4,.62,z+.3],[x+dx+1.0,.25,z-.7],[x+dx+1.8,-.12,z-1.7]],.12*scale,'root branch');}
 });
 // One incomplete wall held by the roots, rather than a new intact building.
 this._box(4,edge,[3.1,.30,.65],[-14,.45,-7.6],[0,-.18,0],'ruin footing');
 this._box(4,white,[1.2,2.15,.26],[-14.8,1.65,-7.6],[0,-.18,0],'remaining wall tall');
 this._box(4,white,[1.0,1.46,.26],[-13.72,1.30,-7.79],[0,-.18,0],'remaining wall low');
 branch([[-15,.4,-6.9],[-15.2,1.05,-7.5],[-14.7,1.3,-7.8],[-14.1,.35,-8.1],[-13.7,-.3,-12.4]],.24,'root embracing wall');

 // 『白』篇15/27: exposed roots, still pockets, one remaining wall, roots fading into mist.
 // Shapes and dimensions are an adaptation, not additional narrative facts.
 var bark=this._material('silver blue root ridges',0x93aaa9,.9,.015);
 bark.map=rootTexture;bark.bumpMap=rootTexture;bark.bumpScale=.038;
 var barkBase=bark.onBeforeCompile;bark.onBeforeCompile=function(s){barkBase(s);s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat barkLines=sin(cWorld.y*9.+sin(cWorld.x*3.)+sin(cWorld.z*2.));diffuseColor.rgb*=.93+.07*barkLines;');};
 function limb(points,radius,label,segments,material){
  var curve=new T.CatmullRomCurve3(points.map(function(p){return new T.Vector3().fromArray(p);})),steps=segments||24,sides=12,g=new T.TubeGeometry(curve,steps,1,sides,false),a=g.attributes.position;
  for(var i=0;i<=steps;i++){var center=curve.getPointAt(i/steps),r=radius*(.012+.988*Math.pow(1-i/steps,.85));for(var k=0;k<=sides;k++){var n=i*(sides+1)+k,v=new T.Vector3().fromBufferAttribute(a,n).sub(center),flute=1+.12*Math.sin(k*PI*2/sides*3+i*.4);v.multiplyScalar(r*flute).add(center);a.setXYZ(n,v.x,v.y,v.z);}}g.computeVertexNormals();self._part(3,material||bark,g,null,null,label);
 }
 var leafCanvas=document.createElement('canvas');leafCanvas.width=512;leafCanvas.height=512;var lc=leafCanvas.getContext('2d');
 lc.strokeStyle='#657e82';lc.lineWidth=2;
 for(var n=0;n<20;n++){var ang=n*2.399,rr=40+120*hash(n,17),cx=256+Math.cos(ang)*rr,cy=245+Math.sin(ang)*rr*.75;lc.beginPath();lc.moveTo(256,480);lc.quadraticCurveTo(245,290,cx,cy);lc.stroke();for(var k=0;k<24;k++){var th=k*2.399+n,r=8+45*Math.sqrt(hash(k,n+1)),lx=cx+Math.cos(th)*r,ly=cy+Math.sin(th)*r;lc.save();lc.translate(lx,ly);lc.rotate(th);lc.fillStyle=['#6f898d','#8da4a7','#a6b9ba','#5c777d'][k%4];lc.beginPath();lc.ellipse(0,0,7+5*hash(k,n),3.5,0,0,PI*2);lc.fill();lc.restore();}}
 var leaves=new T.CanvasTexture(leafCanvas);leaves.encoding=T.sRGBEncoding;leaves.anisotropy=4;var foliage=new T.MeshStandardMaterial({map:leaves,alphaTest:.4,side:T.DoubleSide,roughness:1,color:0xb4c4c5});foliage.alphaToCoverage=true;foliage.name='baked blue grey foliage';this.materials.push(foliage);
 function rootFan(x,z,size,angle,seed){
  function pt(u,y,v){return [x+size*(u*Math.cos(angle)+v*Math.sin(angle)),.24+y*size,z+size*(-u*Math.sin(angle)+v*Math.cos(angle))];}
  // Unequal buttresses sink into soil and water; no detached floating strands.
  for(var k=0;k<7;k++){
   var fan=(k-3)*.51+.18*Math.sin(seed+k*1.7),reach=2.2+.7*Math.sin(k*2.2+seed),h=1.0+.5*Math.sin(seed*.7+k);
   limb([pt(0,.65,-.8),pt(fan*.4,h*.35,.0),pt(fan,.18,1.1),pt(fan*1.4,-.05,reach),pt(fan*1.55,-.38,reach+.6)],.28*size,'exposed root fan',18);
   if(k%2===0)limb([pt(fan*.4,h*.30,.1),pt(fan*.8,.17,1.1),pt(fan*1.5+.65,-.07,reach*.9)],.12*size,'fine root fork',12,root);
  }
  limb([pt(0,-.12,-1.5),pt(.05,.5,-.9),pt(-.4,.7,-.4),pt(-.9,.3,.4),pt(-1.5,-.2,1.9)],.30*size,'weathered root crown',24);

  if(seed%2<1.4){
   var crown=4.0+.7*Math.sin(seed*1.3),trunkPoints=[pt(0,-.03,-1.5),pt(.15,1.2,-1.1),pt(-.3,2.6,-.7),pt(-.15,crown,-.3)];
   limb(trunkPoints,.38*size,'bank trunk',28);
   var trunkCurve=new T.CatmullRomCurve3(trunkPoints.map(function(p){return new T.Vector3().fromArray(p);}));
   for(var b=0;b<6;b++){
    var t=.38+b*.085,base=trunkCurve.getPoint(t),theta=angle+seed*.7+b*2.399,reach=size*(.75+.35*Math.sin(seed+b)),rise=size*(.45+.12*b),tip=base.clone().add(new T.Vector3(Math.cos(theta)*reach,rise,Math.sin(theta)*reach));
    var mid=base.clone().lerp(tip,.6);mid.y+=size*.15;
    limb([base.toArray(),mid.toArray(),tip.toArray()],.075*size,'joined bank branch',18);
    var fork=mid.clone().add(new T.Vector3(Math.cos(theta+.8)*size*.48,size*.33,Math.sin(theta+.8)*size*.48));
    limb([mid.toArray(),fork.toArray()],.026*size,'joined bank twig',10);
    // The baked spray's stem lands on the branch tip; its centre is half a card above it.
    for(var f=0;f<2;f++)self._part(3,foliage,new T.PlaneGeometry(1.65*size,1.1*size),tip.clone().add(new T.Vector3(0,.52*size,0)).toArray(),[0,theta+f*PI/2,0],'attached baked bank foliage');
   }
  }
 }
 // Both banks and the land behind the viewer have depth, rather than one flat sheet.
 [[18,12,1.25,.3],[28,15,1.55,.55],[41,17,1.8,.8],[57,18,2.0,1.1],[78,13,2.2,1.25],[99,12,2.35,1.5],
 [17,24,1.3,3.4],[29,28,1.65,3.5],[47,32,1.9,3.7],[70,34,2.3,3.5],[101,29,2.4,3.6],
 [20,-4,1.0,-.7],[34,-12,1.5,-.7],[52,-21,1.8,-.8],[80,-37,2,-.8],
 [-18,-5,1.2,1.0],[-25,-14,1.5,1.2],[-36,-19,1.7,1.3],[-50,-25,2,1.1],[-70,-32,2.2,1.1],
 [-17,11,1.3,3.3],[-27,18,1.7,3.4],[-47,31,2.1,3.4]].forEach(function(p,n){rootFan(p[0],p[1],p[2],p[3],n*.71);});
 // Landward groves continue behind the viewer. Clear the house, paths and open water.
 for(var ring=0;ring<3;ring++)for(var n=0;n<18;n++){
  var angle=(n/17)*PI,rr=24+ring*29+9*hash(n,ring+47),x=11+Math.cos(angle)*rr,z=28+Math.sin(angle)*rr;
  if(x>5&&z<33)continue;
  rootFan(x,z,1.05+ring*.32+hash(n,ring+11)*.55,angle+PI,ring*17+n*.77);
 }
 // The existing wall remains singular. Its base is obscured by interwoven roots.
 for(var n=0;n<8;n++){var x=-16+n*.44;limb([[x,.18,-6.6],[x+.25,.6+.22*Math.sin(n),-7.25],[x+.35,.85+.25*Math.sin(n*2),-7.7],[x+.60,.15,-8.4],[x+.9,-.4,-10]],.10+.07*(n%3),'wall root seam',14);}
 // Low eroded terraces and root ridges interrupt the featureless foreground.
 var stone=this._material('shore eroded silt',0x788f91,.98,0);stone.map=texture;
 for(var n=0;n<90;n++){
  var x=15+n*1.42,z=29+4.5*Math.sin(n*.73)+2.3*Math.sin(n*2.4),g=new T.SphereGeometry(1,12,6);g.scale(1.5+1.2*hash(n,9),.10+.09*hash(n,8),.8+.9*hash(n,7));g.rotateY(n*1.7);self._part(8,stone,g,[x,.30,z],null,'settled silt relief');
 }
 // Low humps meet the mineral ground at zero height and fade toward the road.
 var landGeo=new T.PlaneGeometry(260,160,100,64);landGeo.rotateX(-PI/2);landGeo.translate(0,0,108);
 var lp=landGeo.attributes.position;
 for(var i=0;i<lp.count;i++){
  var x=lp.getX(i),z=lp.getZ(i),edge=Math.min((130-Math.abs(x))/12,(z-28)/14,(188-z)/14),fade=Math.max(0,Math.min(1,edge));
  var hill=(.5+.5*Math.sin(x*.075+Math.sin(z*.08)))*(.5+.5*Math.cos(z*.11-x*.022));
  lp.setY(i,.276+fade*(.18+hill*1.55));
 }
 landGeo.computeVertexNormals();self._part(8,earth,landGeo,null,null,'continuous landward relief');
 // Distant roots use a baked alpha silhouette, generated once. Mipmaps filter fine twigs.
 // Three staggered banks stay visible in the water mirror; no screen-space backdrop.
 var atlas=document.createElement('canvas');atlas.width=1024;atlas.height=256;var a=atlas.getContext('2d');
 a.strokeStyle='#708d91';a.lineCap='round';
 for(var n=0;n<44;n++){var x=n*24-8,h=20+120*hash(n,7);a.lineWidth=3+4*hash(n,9);a.beginPath();a.moveTo(x,256);a.bezierCurveTo(x-12,230,x+16,256-h,x+3,240-h);a.stroke();for(var k=0;k<4;k++){var y=245-h*(.3+k*.16),dx=(k%2?1:-1)*(12+14*hash(n,k));a.lineWidth=2;a.beginPath();a.moveTo(x+3,y+10);a.quadraticCurveTo(x+dx*.5,y-8,x+dx,y-12);a.stroke();}}

 var at=new T.CanvasTexture(atlas);at.encoding=T.sRGBEncoding;at.anisotropy=4;
 var farMat=new T.MeshStandardMaterial({map:at,color:0xc2d1d0,alphaTest:.35,side:T.DoubleSide,roughness:1,depthWrite:true});farMat.name='baked distant roots';this.materials.push(farMat);
 [[-140,-82,110,10,.7],[-173,-145,100,10,.2],[165,-93,120,11,-.7],[205,-212,130,9,-.3],[-38,-365,200,8,0],[112,-371,170,7,0],[-100,155,130,12,0],[30,174,145,13,0],[158,140,130,11,.4],[-148,57,95,10,1.2]].forEach(function(p){var g=new T.PlaneGeometry(p[2],p[3]);self._part(7,farMat,g,[p[0],p[3]/2-.3,p[1]],[0,p[4],0],'distant root silhouettes');});

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
 this.waterUniforms={seconds:sharedTime,reflection:{value:null},reflectionMatrix:{value:new T.Matrix4()},reflectionTexel:{value:new T.Vector2()},landShadowMap:{value:null},landShadowMatrix:{value:new T.Matrix4()},eye:{value:new T.Vector3()},touches:{value:events},memory:{value:this.memory},confluenceTime:sharedTime};
 var vs=`varying vec3 wPoint;varying vec4 mirrorPoint;uniform mat4 reflectionMatrix;
 void main(){vec4 wp=modelMatrix*vec4(position,1.);wPoint=wp.xyz;mirrorPoint=reflectionMatrix*wp;gl_Position=projectionMatrix*viewMatrix*wp;}`;
 var fs=`precision highp float;
 varying vec3 wPoint;varying vec4 mirrorPoint;uniform sampler2D reflection;uniform mat4 reflectionMatrix;uniform vec2 reflectionTexel;uniform float seconds;uniform vec3 eye;uniform vec4 touches[8];uniform vec4 memory;
 ${shadeGLSL}
 #include <packing>
 uniform sampler2D landShadowMap;uniform mat4 landShadowMatrix;
 float shoreShade(vec3 world){
 vec4 s=landShadowMatrix*vec4(world+vec3(0.,.012,0.),1.);vec3 p=s.xyz/s.w;
 if(p.x<.002||p.x>.998||p.y<.002||p.y>.998||p.z<0.||p.z>1.)return 1.;
 float sum=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){float depth=unpackRGBAToDepth(texture2D(landShadowMap,p.xy+vec2(float(x),float(y))*2.5/2048.));sum+=step(p.z-.00008,depth);}
 return .50+.50*sum/9.;
 }
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
 float footprint;
 float band(float k){return 1.-smoothstep(.6,2.4,k*footprint);}
 // Flow coordinates follow the inlet centerline. Time translates a coordinate;
 // it never multiplies spatially varying velocity, so derivatives stay bounded.
 float inletZ(float x){return 6.+5.*exp(-pow((x-48.)/24.,2.));}
 vec4 currentWeights(vec2 p){
 float a=exp(-p.x*p.x*.065)*smoothstep(-24.,-2.,p.y);
 float b=exp(-pow(p.y-inletZ(p.x),2.)*.075)*smoothstep(-7.,9.,p.x);
 float c=exp(-pow(p.y+70.,2.)*.08)*(1.-smoothstep(-75.,-45.,p.x));
 float d=exp(-pow(p.x+10.,2.)*.08)*(1.-smoothstep(-240.,-210.,p.y));
 return vec4(a,b,c,d);
 }
 float runningWater(vec2 q){
 // Irregular broad folds and fine elongated glints, all travelling downstream.
 float bend=.32*sin(q.x*.73)+.18*sin(q.x*1.31+1.2);
 float coarse=noise(vec2(q.x*.68,q.y*1.7+bend));
 float fine=noise(vec2(q.x*1.35,q.y*4.5+bend));
 return band(2.)*.047*(coarse-.5)+band(5.)*.016*(fine-.5);
 }
 float currentHeight(vec2 p,vec4 w){
 float t=seconds;
 float h=0.;
 if(w.x>.001)h+=w.x*runningWater(vec2(p.y+t*.48,p.x));
 if(w.y>.001)h+=w.y*runningWater(vec2(p.x+t*.68,p.y-inletZ(p.x)));
 h+=w.z*band(3.)*.014*sin(p.x*1.5-t*.675);
 h+=w.w*band(3.)*.014*sin(p.y*1.5-t*.63);
 return h/max(1.,dot(w,vec4(1.)));
 }
 float currentGlint(vec2 p){
 vec4 w=currentWeights(p);float t=seconds;
 // Broken, low-contrast surface traces make transport visible without foam stripes.
 vec2 q=vec2(p.x+t*.68,p.y-inletZ(p.x));
 float n=noise(vec2(q.x*.9,q.y*3.1+.2*sin(q.x*.8)));
 float trace=smoothstep(.58,.82,n)*(0.35+.65*noise(vec2(q.x*2.2,q.y*.6)));
 vec2 f=vec2(p.y+t*.48,p.x);
 float floorTrace=smoothstep(.61,.84,noise(vec2(f.x*.9,f.y*3.1)));
 return band(4.)*(w.y*trace+w.x*floorTrace)/max(1.,w.x+w.y);
 }
 float wave(vec2 p){
 float t=seconds;vec4 weights=currentWeights(p);float channel=clamp(dot(weights,vec4(1.)),0.,1.);
 vec2 flow=p+vec2(.09*sin(p.y*.8-t),0.);
 float warp=sin(p.x*.31+p.y*.23+t*.19)*.65+sin(p.y*.57-t*.21)*.4;
 float h=band(2.3)*(.022*sin(dot(flow,vec2(.8,1.9))-t*1.7+warp)+.018*sin(dot(flow,vec2(-2.1,.7))+t*1.4+warp*.5));
 h+=band(6.7)*.007*sin(dot(flow,vec2(5.7,3.4))-t*2.3)+band(12.8)*.004*sin(dot(flow,vec2(-8.2,9.7))+t*2.6);
 h+=band(3.)*.022*noise(flow*2.1+vec2(t*.3,-t*.2))+band(12.)*.004*noise(flow*8.7+vec2(-t*.27,t*.11));
 h*=1.-.78*channel;
 h+=currentHeight(p,weights)*2.;
 for(int i=0;i<8;i++){vec4 e=touches[i];if(e.w<.001)continue;float age=max(0.,t-e.z);vec2 delta=p-e.xy;
 vec4 carried=currentWeights(e.xy);
 vec2 drift=vec2(.68*carried.y-.45*carried.z,.48*carried.x-.42*carried.w)/max(1.,dot(carried,vec4(1.)));
 // Use the event origin's velocity, not a varying field times global elapsed time.
 delta+=age*drift;float r=length(delta);
 float front=r-age*1.25;
 float envelope=exp(-front*front/(.32+age*.16))*exp(-age*.14)*e.w;
 float disorder=smoothstep(1.8,9.,age)*(.8*sin(p.x*1.8+t)+.55*sin(p.y*2.4-t*.8));
 h+=band(9.)*.055*envelope*sin(front*9.+disorder)/sqrt(1.+r);
 }
 // The identifiable rings disperse into low-amplitude ambient modes. The
 // accumulated contribution stays bounded and remains after an event expires.
 h+=memory.x*.009*sin(dot(p,vec2(.61,1.17))-t*1.12+memory.z);
 h+=memory.y*.008*sin(dot(p,vec2(-1.13,.79))+t*.89+memory.w);
 float quietBay=exp(-dot((p-vec2(-14.,-12.))/3.,(p-vec2(-14.,-12.))/3.));return h*(1.-.8*quietBay);
 }
 void main(){vec2 p=wPoint.xz;footprint=max(length(dFdx(p)),length(dFdy(p)));float d=length(eye-wPoint);float e=mix(.035,.22,smoothstep(15.,130.,d));float h=wave(p);
 vec2 slope=vec2(wave(p+vec2(e,0.))-h,wave(p+vec2(0.,e))-h)/e;
 slope*=mix(1.,.12,smoothstep(30.,220.,d));
 vec3 n=normalize(vec3(-slope.x,1.,-slope.y)),v=normalize(eye-wPoint);
 // Distort in the water plane and reproject: world X/Z are not screen X/Y.
 vec4 displaced=reflectionMatrix*vec4(wPoint+vec3(n.x,0.,n.z)*min(5.,1.+d*.12),1.);
 vec2 uv=displaced.xy/displaced.w*.5+.5;
 vec2 safeUV=clamp(uv,vec2(.003),vec2(.997));
 vec2 blur=reflectionTexel*mix(.65,1.5,smoothstep(12.,180.,d));
 vec3 reflectCol=texture2D(reflection,safeUV).rgb*.40;
 reflectCol+=(texture2D(reflection,clamp(safeUV+vec2(blur.x,0.),.003,.997)).rgb+texture2D(reflection,clamp(safeUV-vec2(blur.x,0.),.003,.997)).rgb+texture2D(reflection,clamp(safeUV+vec2(0.,blur.y),.003,.997)).rgb+texture2D(reflection,clamp(safeUV-vec2(0.,blur.y),.003,.997)).rgb)*.15;
 float inFrame=smoothstep(0.,.018,min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y)));
 reflectCol=mix(vec3(.32,.47,.50),reflectCol,inFrame);
 float fresnel=.035+.965*pow(1.-max(0.,dot(n,v)),5.);
 float flow=exp(-p.x*p.x*.09)*smoothstep(-18.,0.,p.y);
 vec3 body=mix(vec3(.012,.055,.065),vec3(.028,.105,.11),.5+.5*sin(p.y*.06));
 body+=vec3(.035,.055,.052)*flow;
 float shade=discShade(wPoint)*shoreShade(wPoint);
 vec3 c=mix(body*shade,reflectCol,.20+.80*fresnel);
 float transported=currentGlint(p)*(1.-smoothstep(35.,95.,d));
 c+=vec3(.060,.080,.078)*transported*shade;
 vec3 l=normalize(vec3(-.30,.75,-.60));vec3 halfV=normalize(l+v);
 float spec=pow(max(0.,dot(n,halfV)),190.);c+=vec3(.95,.80,.85)*spec*.55*shade;

 float pulse=1.+.008*sin(seconds*8.0553658);c*=pulse;
 float fog=1.-exp(-d*.0019);c=mix(c,vec3(.50,.64,.66),fog);
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
 }`;
 var g=new T.PlaneGeometry(3000,3000);g.rotateX(-PI/2);this.water=new T.Mesh(g,new T.ShaderMaterial({extensions:{derivatives:true},uniforms:this.waterUniforms,vertexShader:vs,fragmentShader:fs}));this.water.position.y=0;this.water.userData.record=0;this.scene.add(this.water);this.pickables.push(this.water);
};
Engine.prototype.loadCommon=function(){this.commonReady=true;return Promise.resolve();};
Engine.prototype.bakeShader=function(){return shadeGLSL;};
Engine.prototype.loadSpot=function(i,progress){return this.bake.load(i,progress);};
Engine.prototype.resize=function(w,h){var cap=this.quality==='high'?2:this.quality==='low'?.85:(this.bake.active?2:1.35),budget=this.quality==='high'?(this.bake.active?8000000:2200000):this.quality==='low'?450000:(this.bake.active?6000000:1050000),scale=Math.min(devicePixelRatio||1,cap,Math.sqrt(budget/(w*h))),width=Math.max(1,Math.round(w*scale)),height=Math.max(1,Math.round(h*scale));if(width===this.width&&height===this.height)return;this.width=width;this.height=height;this.renderer.setSize(width,height,false);if(this.mirrorTarget)this.mirrorTarget.dispose();var factor=this.quality==='low'?.4:.6;this.mirrorTarget=new T.WebGLRenderTarget(Math.max(128,Math.round(width*factor)),Math.max(128,Math.round(height*factor)),{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,type:this.reflectionType});this.waterUniforms.reflection.value=this.mirrorTarget.texture;this.waterUniforms.reflectionTexel.value.set(1/this.mirrorTarget.width,1/this.mirrorTarget.height);};
Engine.prototype.draw=function(yaw,pitch,fov,time){
 var start=performance.now();sharedTime.value=time;this.lastTime=time;var c=this.camera;c.aspect=this.width/this.height;c.fov=c.aspect<1?Math.min(78,fov+13):fov;c.updateProjectionMatrix();c.position.fromArray(this.eyes[this.index]);var ya=yaw*PI/180,pi=pitch*PI/180,dir=new T.Vector3(Math.sin(ya)*Math.cos(pi),Math.sin(pi),-Math.cos(ya)*Math.cos(pi));c.up.set(0,1,0);c.lookAt(c.position.clone().add(dir));c.updateMatrixWorld();this.discs.forEach(function(d){d.rotation.y=time*2*PI/28.08;});
 var m=this.mirrorCamera;m.copy(c);m.fov=2*Math.atan(Math.tan(c.fov*PI/360)*1.15)*180/PI;m.updateProjectionMatrix();m.position.y=-c.position.y;m.up.set(0,-1,0);m.lookAt(m.position.clone().add(new T.Vector3(dir.x,-dir.y,dir.z)));m.updateMatrixWorld();
 // Clip geometry below the reflecting surface in the mirrored camera.
 var plane=new T.Plane(new T.Vector3(0,1,0),0).applyMatrix4(m.matrixWorldInverse),clip=new T.Vector4(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant),q=new T.Vector4(),p=m.projectionMatrix.elements;
 q.x=(Math.sign(clip.x)+p[8])/p[0];q.y=(Math.sign(clip.y)+p[9])/p[5];q.z=-1;q.w=(1+p[10])/p[14];clip.multiplyScalar(2/clip.dot(q));p[2]=clip.x;p[6]=clip.y;p[10]=clip.z+1;p[14]=clip.w;
 this.waterUniforms.reflectionMatrix.value.multiplyMatrices(m.projectionMatrix,m.matrixWorldInverse);this.waterUniforms.eye.value.copy(c.position);
 this.water.visible=false;this.renderer.toneMapping=T.NoToneMapping;this.renderer.setRenderTarget(this.mirrorTarget);this.renderer.render(this.scene,m);this.waterUniforms.landShadowMap.value=this.sun.shadow.map.texture;this.waterUniforms.landShadowMatrix.value.copy(this.sun.shadow.matrix);this.renderer.toneMapping=T.ACESFilmicToneMapping;this.water.visible=true;this.renderer.setRenderTarget(null);this.renderer.render(this.scene,c);this.frameStats.frames++;this.frameStats.milliseconds+=performance.now()-start;this.bake.afterFrame();
};
Engine.prototype.pick=function(clientX,clientY){var b=this.renderer.domElement.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((clientX-b.left)/b.width*2-1,1-(clientY-b.top)/b.height*2),this.camera);this.scene.updateMatrixWorld(true);var hits=this.ray.intersectObjects(this.pickables,false);for(var i=0;i<hits.length;i++){var h=hits[i],m=h.object.material;if(m.alphaTest&&m.map&&h.uv&&m.map.image&&m.map.image.getContext){var c=m.map.image;if(!c._alphaPixels)c._alphaPixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;var u=Math.max(0,Math.min(c.width-1,Math.floor(h.uv.x*c.width))),v=Math.max(0,Math.min(c.height-1,Math.floor((1-h.uv.y)*c.height)));if(c._alphaPixels[(v*c.width+u)*4+3]/255<m.alphaTest)continue;}return {key:h.object.userData.record,point:h.point.toArray(),distance:h.distance,water:h.object===this.water};}return null;};
Engine.prototype.disturb=function(point,time){if(time-this.lastImpulse<.12)return false;this.lastImpulse=time;var i=this.eventCount++%8;this.events.push({point:point.slice(),time:time});if(this.events.length>128)this.events.splice(0,120);this.waterUniforms.touches.value[i].set(point[0],point[2],time,1);
 this.memory.x=1.-(1.-this.memory.x)*.88;this.memory.y=1.-(1.-this.memory.y)*.90;this.memory.z=(this.memory.z+point[0]*.17+.31)%(2*PI);this.memory.w=(this.memory.w+point[2]*.11+.47)%(2*PI);return true;};
Engine.prototype.report=function(){return {ready:this.loaded,revision:'current-v1',bake:this.bake.report(),view:this.index,time:this.lastTime,impulses:this.eventCount,memory:this.memory.toArray(),size:[this.width,this.height],drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,frameStats:this.frameStats};};
Engine.prototype.dispose=function(){this.bake.dispose();var geometries=new Set(),materials=new Set();this.scene.traverse(function(o){if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(function(g){g.dispose();});materials.forEach(function(m){m.dispose();});if(this.environment)this.environment.dispose();if(this.mirrorTarget)this.mirrorTarget.dispose();this.renderer.dispose();};
window.ConfluenceEngine=Engine;
})();
