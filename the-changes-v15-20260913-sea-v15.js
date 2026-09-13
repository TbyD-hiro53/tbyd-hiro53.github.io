/* Sea v12 canonical old building. Selection: Unwritten ch28 end / before ch29 packing. See source-v12/sea-canon.md. */
(function(){'use strict';
var CH=window.CH,T=window.THREE,B=CH.ENV8.base,PI=Math.PI;
var view=B.view,box=B.box,palette=B.palette,Batch=B.Batch;
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function hump(x,z,cx,cz,rx,rz,h){return h*Math.exp(-Math.pow((x-cx)/rx,2)-Math.pow((z-cz)/rz,2));}

function shoreOffset(x){return 3.4*Math.sin(x*.024)+.65*Math.sin(x*.071)+6.8*Math.exp(-Math.pow((x-48)/31,2))-3.1*Math.exp(-Math.pow((x+28)/24,2));}
function incomingZ(x){return x>=-138?0:-.0014*Math.pow(x+138,2);}
function rawHeightAt(x,z){
 var shoreShift=shoreOffset(x),u=clamp((z-87-shoreShift)/12,0,1);
 var crest=57+2.2*Math.sin(x*.019),y=-.12+(2.55+.28*Math.cos(x*.029))*Math.exp(-Math.pow((z-crest)/10.5,2))-.32*u*u*(3-2*u);
 y+=hump(x,z,61,-29,39,20,4.1)+hump(x,z,123,-49,53,30,9.8)+hump(x,z,-87,-65,57,31,11.8)+hump(x,z,-40,-32,28,18,3.2)+hump(x,z,205,-35,69,26,7.7);
 /* A shallow, curving inland swale gathers vegetation. Its floor remains dry, not a new stream. */
 var swale=-13.5-.075*x+3.5*Math.sin(x*.036);y-=.44*Math.exp(-Math.pow((z-swale)/4.6,2))*Math.exp(-Math.pow(x/140,2));
 y+=.24*Math.exp(-Math.pow((z-swale-6.2)/3.8,2))*Math.exp(-Math.pow(x/140,2));
 y+=hump(x,z,118,44,18,13,4.5)+hump(x,z,-15,-23,22,9,.8);
 var land=clamp((28-z)/18,0,1),near=1-Math.exp(-Math.pow((x-8)/20,2)-Math.pow((z-6)/14,2));
 y+=land*near*(.09*Math.sin(x*.27+z*.14)*Math.sin(z*.31)+.035*Math.sin(x*.73-z*.42));
 y+=.016*Math.sin(x*.35+z*.27)*Math.cos(x*.19-z*.33)+.003*Math.sin(x*1.31+z*.89);
 y+=hump(x,z,-200,-16,72,32,4.8)+hump(x,z,-367,-77,73,51,6.4);
 if(x<-138&&x>-470){var railDistance=Math.abs(z-incomingZ(x))/Math.sqrt(1+Math.pow(.0028*(x+138),2)),cut=1-clamp((railDistance-3.8)/.6,0,1);y=y*(1-cut)-.59*cut;}
 /* Keep the rail formation separate from yielding ground; ground envelopes slab bases. */
 if(x>=-138 && x<20 && Math.abs(z)<2.35)y=y*(1-clamp((2.35-Math.abs(z))/.7,0,1))-.46*clamp((2.35-Math.abs(z))/.7,0,1);
 return y;
}
/* Coastal geography is continuous; a graded building seat and path have 0.85 m earth. */
function distanceSegment(x,z,a,c){var dx=c[0]-a[0],dz=c[1]-a[1],u=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);return Math.sqrt(Math.pow(x-a[0]-dx*u,2)+Math.pow(z-a[1]-dz*u,2));}
var routePoints=[[19.4,5],[35,8],[49,12.5],[64.2,12.5]];
function routeDistance(x,z){var d=1e9;for(var i=1;i<routePoints.length;i++)d=Math.min(d,distanceSegment(x,z,routePoints[i-1],routePoints[i]));return d;}
function heightAt(x,z){var y=rawHeightAt(x,z),dist=Math.max(Math.abs(x-84)-20.4,Math.abs(z-18)-7.5),w=1-clamp(dist/6,0,1),path=1-clamp((routeDistance(x,z)-1.0)/2.2,0,1);w=w*w*(3-2*w);y=y*(1-w)+.90*w;var py=.75+.15*clamp((x-20)/44,0,1);y=y*(1-path)+py*path;if(x>-18.05&&x<18.05&&z>1.8&&z<7.05)y=Math.min(y,.55);return y;}
function groundMaterial(){
 var c=document.createElement('canvas');c.width=c.height=512;var cx=c.getContext('2d'),im=cx.createImageData(512,512),rough=cx.createImageData(512,512),i,j,k,v,n;
 for(j=0;j<512;j++)for(i=0;i<512;i++){k=(j*512+i)*4;n=Math.sin(i*71.31+j*37.91)*43758.543;n=n-Math.floor(n);v=Math.sin(i*.097+Math.sin(j*.038)*1.4)*Math.sin(j*.079);im.data[k]=128+(n-.5)*14+v*3;im.data[k+1]=128+(Math.sin(i*13.71+j*59.13)*.5)*13;im.data[k+2]=255;im.data[k+3]=255;rough.data[k]=rough.data[k+1]=rough.data[k+2]=228+(n-.5)*14+v*6;rough.data[k+3]=255;}
 cx.putImageData(im,0,0);var normal=new T.CanvasTexture(c),rc=document.createElement('canvas');rc.width=rc.height=512;rc.getContext('2d').putImageData(rough,0,0);var rt=new T.CanvasTexture(rc);normal.wrapS=normal.wrapT=rt.wrapS=rt.wrapT=T.RepeatWrapping;normal.anisotropy=rt.anisotropy=4;
 var m=new T.MeshStandardMaterial({color:0xffffff,roughness:.94,metalness:0,normalMap:normal,normalScale:new T.Vector2(.2,.2),roughnessMap:rt,vertexColors:true,envMap:CH.ENV||null,envMapIntensity:.12});m.userData.v8Ground=true;return m;
}
function terrain(root){
 var xs=[],zs=[],i,j,x,z,p=[],uv=[],co=[],ix=[];
 for(i=-500;i<=360;i+=8)xs.push(i);for(i=-35;i<=180;i+=.7)xs.push(i);for(i=-260;i<=125;i+=6)zs.push(i);for(i=-35;i<83;i+=.7)zs.push(i);for(i=83;i<=125;i+=.45)zs.push(i);
 for(i=-440;i<=-138;i+=2)xs.push(i);for(i=-130;i<=-34;i+=2)zs.push(i);xs.push(-74);zs.push(5);
 xs.sort(function(a,b){return a-b;});zs.sort(function(a,b){return a-b;});xs=xs.filter(function(a,i){return !i||a-xs[i-1]>.02;});zs=zs.filter(function(a,i){return !i||a-zs[i-1]>.02;});
 var dry=new T.Color(0x96988a).convertSRGBToLinear(),wet=new T.Color(0x484d45).convertSRGBToLinear(),soil=new T.Color(0x858b79).convertSRGBToLinear(),cc=new T.Color();
 for(j=0;j<zs.length;j++)for(i=0;i<xs.length;i++){x=xs[i];z=zs[j];var y=heightAt(x,z);p.push(x,y,z);uv.push(x/1.8,z/1.8);var swale=-13.5-.075*x+3.5*Math.sin(x*.036),land=clamp((25-z)/24,0,1)*clamp(.28+.72*Math.exp(-Math.pow((z-swale)/15,2)),0,1),damp=clamp((z-86-shoreOffset(x))/12,0,1),variation=.975+.035*Math.sin(x*.17+z*.11)*Math.cos(z*.23-x*.08);cc.copy(dry).lerp(soil,land*.75).lerp(wet,damp).multiplyScalar(variation);co.push(cc.r,cc.g,cc.b);if(i<xs.length-1&&j<zs.length-1){var a=j*xs.length+i;ix.push(a,a+xs.length,a+1,a+1,a+xs.length,a+xs.length+1);}}
 var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(new Float32Array(p.length),3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(co,3));g.setIndex(ix);g.computeVertexNormals();var mesh=new T.Mesh(g,groundMaterial());mesh.name='sea11 terrain continuous inland rise shoreline';mesh.receiveShadow=true;root.add(mesh);
}
function roundedPlan(w,d,r){var s=new T.Shape(),x=w/2,z=d/2;s.moveTo(-x+r,-z);s.lineTo(x-r,-z);s.quadraticCurveTo(x,-z,x,-z+r);s.lineTo(x,z-r);s.quadraticCurveTo(x,z,x-r,z);s.lineTo(-x+r,z);s.quadraticCurveTo(-x,z,-x,z-r);s.lineTo(-x,-z+r);s.quadraticCurveTo(-x,-z,-x+r,-z);s.closePath();return s;}
function planSolid(shape,h){var g=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,curveSegments:10,steps:1});g.rotateX(PI/2);g.translate(0,h,0);return g;}
function shellTaper(g,y0,h){var a=g.attributes.position,i,yy,f;for(i=0;i<a.count;i++){yy=a.getY(i)+y0;f=1-.040*clamp(yy/h,0,1);a.setX(i,a.getX(i)*f);a.setZ(i,a.getZ(i)*f);}g.computeVertexNormals();return g;}
/* Local ch03 vegetation: short, pale, dry blades; clusters biased to hard inland substrate. */
function coastalUnderstory(root){var pos=[],col=[],uv=[],idx=[],seed=17039;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;}
 var fields=[[27,1,13,5,300],[43,22,14,7,600],[59,31,18,8,950],[86,36,27,7,1200],[112,20,10,10,700],[142,39,19,10,1000],[-34,-7,28,9,800],[-73,8,19,7,550],[47,-18,32,10,900]];
 fields.forEach(function(f){for(var n=0;n<f[4];n++){var a=rnd()*PI*2,rr=Math.sqrt(rnd()),x=f[0]+Math.cos(a)*f[2]*rr,z=f[1]+Math.sin(a)*f[3]*rr;if(routeDistance(x,z)<1.2||(x>63&&x<105&&z>10&&z<26)||(Math.abs(z)<7.5&&x<20&&x>-145))continue;var density=.51+.29*Math.sin(x*.27+z*.43)*Math.sin(x*.11-z*.31);if(rnd()>density)continue;var y=heightAt(x,z)-.012;for(var l=0;l<5;l++){var ang=rnd()*PI*2,L=.11+rnd()*.24,W=.009+rnd()*.019,H=.06+rnd()*.16,base=pos.length/3,c=new T.Color(0xa2ab86).convertSRGBToLinear();c.multiplyScalar(.8+rnd()*.3);for(var k=0;k<=5;k++){var t=k/5,along=L*t,yy=y+H*Math.sin(t*PI*.84),ww=W*Math.sin(t*PI);for(var side=-1;side<=1;side++){pos.push(x+Math.cos(ang)*along+Math.sin(ang)*ww*side,yy+(side===0?.006:0)*Math.sin(t*PI),z+Math.sin(ang)*along-Math.cos(ang)*ww*side);col.push(c.r,c.g,c.b);uv.push(t,side*.5+.5);}}for(k=0;k<5;k++){var q=base+k*3;idx.push(q,q+3,q+1,q+1,q+3,q+4,q+1,q+4,q+2,q+2,q+4,q+5);}}}});
 var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();var m=new T.MeshStandardMaterial({color:0xffffff,roughness:.97,vertexColors:true,side:T.DoubleSide,envMapIntensity:.08});m.userData.surface='dry-short-grass';var o=new T.Mesh(g,m);o.name='sea12 dry short inland colonies';o.castShadow=o.receiveShadow=true;root.add(o);
 /* A few flattened, tapering buried roots are B global-world interpretation, never on bare beach. */
 var rm=B.material(0x777d69,.96,0,'root');[[54,30,6],[109,28,5]].forEach(function(f){for(var branch=0;branch<3;branch++){var pp=[],ii=[],N=18,S=10;for(var j=0;j<=N;j++){var t=j/N,x=f[0]+t*f[2],z=f[1]+Math.sin(t*2.2)*(branch-1)*1.35,y=heightAt(x,z)-.11+.12*Math.sin(t*PI),rad=(.27*(1-t)+.025)*(branch? .65:1);for(var k=0;k<S;k++){var a=k/S*PI*2;pp.push(x,y+Math.sin(a)*rad*.50,z+Math.cos(a)*rad);}if(j<N)for(k=0;k<S;k++){var a0=j*S+k,b0=j*S+(k+1)%S;ii.push(a0,a0+S,b0,b0,a0+S,b0+S);}}var end0=pp.length/3;pp.push(f[0],heightAt(f[0],f[1])-.11,f[1]);var end1=pp.length/3;pp.push(pp[N*S*3],pp[N*S*3+1],pp[N*S*3+2]);for(k=0;k<S;k++){ii.push(end0,(k+1)%S,k);ii.push(end1,N*S+k,N*S+(k+1)%S);}var gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pp,3));gg.setIndex(ii);gg.computeVertexNormals();var rr=new T.Mesh(gg,rm);rr.name='sea12 embedded flattened root';rr.castShadow=rr.receiveShadow=true;root.add(rr);}});
}
function sea(root,p,d){var water=B.material(0x8e9f9b,.32,.04,'floor');water.userData.shoreWater=true;water.userData.shoreWaterV8=true;water.userData.shoreWaterV9=true;var wc=document.createElement('canvas');wc.width=wc.height=512;var wx=wc.getContext('2d'),wd=wx.createImageData(512,512),i,j,k;
 for(j=0;j<512;j++)for(i=0;i<512;i++){k=(j*512+i)*4;var u=i/512*PI*2,v=j/512*PI*2;wd.data[k]=128+19*Math.sin(u*4+v+Math.sin(v*2)*1.1)+9*Math.sin(v*5-u*2)+5*Math.cos(u*9+v*6);wd.data[k+1]=128+16*Math.cos(v*3-u*2)+8*Math.cos(u*6+v*5)+4*Math.sin(u*11-v*8);wd.data[k+2]=255;wd.data[k+3]=255;}wx.putImageData(wd,0,0);water.normalMap=new T.CanvasTexture(wc);water.normalMap.wrapS=water.normalMap.wrapT=T.RepeatWrapping;water.normalMap.anisotropy=4;water.normalScale.set(.035,.02);water.envMapIntensity=.65;
 /* Half-metre coastal sampling avoids the polygonal intersection of a 4.25 m water grid with the shore. */
 var xs=[],zs=[],pp=[],uv=[],idx=[],xx,zz,yy,row,col;
 for(xx=-340;xx<-50;xx+=4)xs.push(xx);for(xx=-50;xx<=140;xx+=.5)xs.push(xx);for(xx=144;xx<=340;xx+=4)xs.push(xx);
 for(zz=86;zz<=135;zz+=.5)zs.push(zz);for(zz=137.5;zz<=330;zz+=2.5)zs.push(zz);zs.push(330);
 for(row=0;row<zs.length;row++)for(col=0;col<xs.length;col++){xx=xs[col];zz=zs[row];yy=(.035*Math.sin(xx*.12+zz*.17)+.022*Math.sin(zz*.14-xx*.09))*clamp((330-zz)/24,0,1);pp.push(xx,yy,zz);uv.push(xx,zz);if(col<xs.length-1&&row<zs.length-1){var n=row*xs.length+col;idx.push(n,n+xs.length,n+1,n+1,n+xs.length,n+xs.length+1);}}
 var wg=new T.BufferGeometry();wg.setAttribute('position',new T.Float32BufferAttribute(pp,3));wg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));wg.setIndex(idx);wg.computeVertexNormals();var nearSea=new T.Mesh(wg,water);nearSea.position.y=-.22;nearSea.name='sea11 coastal water';root.add(nearSea);
 var wf=new T.PlaneGeometry(2000,1800,40,40);wf.rotateX(-PI/2);var fp=wf.attributes.position,fu=wf.attributes.uv;for(i=0;i<fp.count;i++)fu.setXY(i,fp.getX(i),fp.getZ(i)+1230);var farSea=new T.Mesh(wf,water);farSea.position.set(0,-.22,1230);farSea.name='sea11 distant white sea';root.add(farSea);
 /* Keep indexed sea grids to avoid tripling coastal vertex memory. UVs include final world placement. */
 root.traverse(function(o){if(!o.isMesh||o.material!==water)return;var p=o.geometry.attributes.position,u=o.geometry.attributes.uv;for(var i=0;i<p.count;i++)u.setXY(i,p.getX(i)+o.position.x,p.getZ(i)+o.position.z);u.needsUpdate=true;});
 d.tick=function(t){water.normalMap.offset.set((t%24)/24,(t%24)/12);};}
var targets=[],door=null;
function target(root,id,label,text,anchor,make,radius){var g=new T.Group();g.name='sea11 '+id;g.userData.narrativeId=id;root.add(g);make(g);targets.push({id:id,label:label,text:text,anchor:anchor,object:g,radius:radius||.22});return g;}
function optical(root,id,anchor,make,radius){var g=new T.Group();g.name='sea11 '+id;root.add(g);make(g);return g;}
function batch(g,fn){var b=new Batch(g);fn(b);b.finish(g.name||'sea11 static');return g;}
function solid(g,m,x,y,z,w,h,d,r,name){var b=new Batch(g);box(b,m,x,y,z,w,h,d,r||.01);b.finish(name||g.name);}
/* Real-scale woven cloth; matte fibres are separate from polished ceramic and mineral shell. */
function textile(color,name,repeat){
 var c=document.createElement('canvas'),n=document.createElement('canvas'),r=document.createElement('canvas');c.width=c.height=n.width=n.height=r.width=r.height=256;var a=c.getContext('2d').createImageData(256,256),na=n.getContext('2d').createImageData(256,256),ra=r.getContext('2d').createImageData(256,256),i,j,k,u,v,warp,weft,over,val;
 for(j=0;j<256;j++)for(i=0;i<256;i++){k=(j*256+i)*4;u=(i%8)/8;v=(j%8)/8;warp=Math.pow(Math.sin(PI*u),.55);weft=Math.pow(Math.sin(PI*v),.55);over=((Math.floor(i/8)+Math.floor(j/8))%2)===0;val=220+24*(over?warp:weft)+4*Math.sin(i*.63+j*.37);a.data[k]=a.data[k+1]=a.data[k+2]=val;a.data[k+3]=255;na.data[k]=127+14*Math.cos(2*PI*u)*(over?1:.3);na.data[k+1]=127+14*Math.cos(2*PI*v)*(over?.3:1);na.data[k+2]=255;na.data[k+3]=255;ra.data[k]=ra.data[k+1]=ra.data[k+2]=233+15*(over?warp:weft);ra.data[k+3]=255;}
 c.getContext('2d').putImageData(a,0,0);n.getContext('2d').putImageData(na,0,0);r.getContext('2d').putImageData(ra,0,0);var map=new T.CanvasTexture(c),nm=new T.CanvasTexture(n),rm=new T.CanvasTexture(r);[map,nm,rm].forEach(function(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat,repeat);t.anisotropy=8;});map.encoding=T.sRGBEncoding;
 var m=new T.MeshStandardMaterial({color:color,roughness:.94,metalness:0,map:map,normalMap:nm,normalScale:new T.Vector2(.11,.11),roughnessMap:rm,envMap:CH.ENV||null,envMapIntensity:.10,vertexColors:true});m.color.convertSRGBToLinear();m.userData.surface=name;m.userData.cast=true;return m;
}
function softBox(w,h,d,r,sag){
 var g=new T.BoxGeometry(w,h,d,24,10,28),p=g.attributes.position,i,x,y,z,qx,qy,qz,dx,dy,dz,l;
 for(i=0;i<p.count;i++){x=p.getX(i);y=p.getY(i);z=p.getZ(i);qx=clamp(x,-w/2+r,w/2-r);qy=clamp(y,-h/2+r,h/2-r);qz=clamp(z,-d/2+r,d/2-r);dx=x-qx;dy=y-qy;dz=z-qz;l=Math.sqrt(dx*dx+dy*dy+dz*dz)||1;x=qx+r*dx/l;y=qy+r*dy/l;z=qz+r*dz/l;
  if(y>0)y-=sag*Math.exp(-Math.pow(x/(w*.33),2)-Math.pow(z/(d*.34),2))*(y/(h/2));
  y+=.004*Math.sin(z*20+x*8)*Math.pow(Math.abs(x)/(w/2),4)*(y>0?1:0);p.setXYZ(i,x,y,z);}
 g.computeVertexNormals();var normal=g.attributes.normal,sum={},keys=[],key,v;for(i=0;i<p.count;i++){key=Math.round(p.getX(i)*1e6)+','+Math.round(p.getY(i)*1e6)+','+Math.round(p.getZ(i)*1e6);keys.push(key);if(!sum[key])sum[key]=new T.Vector3();sum[key].add(new T.Vector3(normal.getX(i),normal.getY(i),normal.getZ(i)));}for(i=0;i<p.count;i++){v=sum[keys[i]].normalize();normal.setXYZ(i,v.x,v.y,v.z);}return g;
}
function cloth(g,m,cx,y,cz,w,d,drape){var p=[],uv=[],ix=[],nx=30,nz=34,i,j,x,z,yy;
 for(j=0;j<=nz;j++)for(i=0;i<=nx;i++){x=(i/nx-.5)*w;z=(j/nz-.5)*d;yy=y+.002*Math.sin(x*29+z*8)+.0015*Math.sin(z*37-x*11);if(drape)yy-=drape*Math.pow(clamp((Math.abs(x)-w*.44)/(w*.06),0,1),1.4);p.push(cx+x,yy,cz+z);uv.push(x*.72,z*.72);if(i<nx&&j<nz){var a=j*(nx+1)+i;ix.push(a,a+nx+1,a+1,a+1,a+nx+1,a+nx+2);}}
 var geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();var mat=m.clone();mat.side=T.DoubleSide;mat.vertexColors=false;var mesh=new T.Mesh(geo,mat);mesh.name=g.name+' woven drape';mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);}
function vessel(b,m,x,y,z){var pts=[[0,0],[.09,0],[.115,.04],[.13,.20],[.10,.28],[.05,.32],[.045,.41],[.035,.415],[.034,.34],[.071,.29],[.106,.2],[.095,.06],[0,.024]].map(function(q){return new T.Vector2(q[0],q[1]);});b.add(new T.LatheGeometry(pts,40),m,x,y,z);}
function wallOpening(b,m,x,z,w,base,top,opening,angle,thick){var sh=new T.Shape(),q=opening;sh.moveTo(-w/2,base);if(q&&q[1]===base){/* U-contour closes jamb soles; a hole touching the outer boundary left eight naked edges. */sh.lineTo(q[0],base);sh.lineTo(q[0],q[3]);sh.lineTo(q[2],q[3]);sh.lineTo(q[2],base);}sh.lineTo(w/2,base);sh.lineTo(w/2,top);sh.lineTo(-w/2,top);sh.closePath();if(q&&q[1]!==base){var h=new T.Path();h.moveTo(q[0],q[1]);h.lineTo(q[0],q[3]);h.lineTo(q[2],q[3]);h.lineTo(q[2],q[1]);h.closePath();sh.holes.push(h);}var geo=new T.ExtrudeGeometry(sh,{depth:thick,bevelEnabled:false,curveSegments:1});geo.translate(0,0,-thick/2);b.add(geo,m,x,0,z,0,angle||0,0);}
/* Carving belongs to the actual 480 mm outer wall; no overlay mesh can cast a rectangular shadow. */
function incised(root,p,id,label,text,x,y,z,w,h,draw,wallX,wallWidth){target(root,id,label,text,[x,y,24.72],function(g){var c=document.createElement('canvas');c.width=1024;c.height=768;var ctx=c.getContext('2d');ctx.fillStyle='#c5c5c5';ctx.fillRect(0,0,1024,768);ctx.strokeStyle='#8f8f8f';ctx.fillStyle='#929292';ctx.lineCap='round';draw(ctx);var t=new T.CanvasTexture(c),m=p.wall.clone();m.vertexColors=true;m.bumpMap=t;m.bumpScale=.024;m.userData.surface='incised-wall';var rect=new T.Vector4(x-w/2,y-h/2,w,h);
 m.onBeforeCompile=function(sh){sh.uniforms.seaIncisionRect={value:rect};sh.vertexShader='varying vec3 vSeaIncisionWorld; varying vec2 vSeaIncisionUv; uniform vec4 seaIncisionRect;\n'+sh.vertexShader;sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSeaIncisionWorld=(modelMatrix*vec4(transformed,1.0)).xyz; vSeaIncisionUv=vec2((seaIncisionRect.x+seaIncisionRect.z-vSeaIncisionWorld.x)/seaIncisionRect.z,(vSeaIncisionWorld.y-seaIncisionRect.y)/seaIncisionRect.w);');
 sh.fragmentShader='varying vec3 vSeaIncisionWorld; varying vec2 vSeaIncisionUv;\nfloat seaIncisionGate(){return step(0.,vSeaIncisionUv.x)*step(vSeaIncisionUv.x,1.)*step(0.,vSeaIncisionUv.y)*step(vSeaIncisionUv.y,1.)*(1.-step(.025,abs(vSeaIncisionWorld.z-24.76)));}\n'+sh.fragmentShader;
 sh.fragmentShader=sh.fragmentShader.replace('#include <bumpmap_pars_fragment>',T.ShaderChunk.bumpmap_pars_fragment.replace(/\bvUv\b/g,'vSeaIncisionUv'));
 var normalChunk=T.ShaderChunk.normal_fragment_maps.replace('normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd(), faceDirection );','normal = mix(normal,perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection),seaIncisionGate());');
 sh.fragmentShader=sh.fragmentShader.replace('#include <normal_fragment_maps>',normalChunk+'\n#if defined(USE_BUMPMAP) && (defined(TANGENTSPACE_NORMALMAP) || defined(OBJECTSPACE_NORMALMAP))\nnormal=mix(normal,perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection),seaIncisionGate());\n#endif');
 sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n#ifdef USE_BUMPMAP\nfloat seaGroove=clamp((.77255-texture2D(bumpMap,vSeaIncisionUv).r)*9.,0.,1.)*seaIncisionGate(); diffuseColor.rgb*=1.-.24*seaGroove;\n#endif');};m.customProgramCacheKey=function(){return 'sea12-real-wall-incision-v3';};
 /* World-metre UVs and white vertex colors come from Batch, exactly as on adjoining wall spans. */
 var bb=new Batch(g);box(bb,m,wallX,2.85,25,wallWidth,3.5,.48,0);bb.finish('sea12 actual incised back wall '+id);
 },.32);targets[targets.length-1].hitRegion=[x-w/2,y-h/2,24.74,x+w/2,y+h/2,24.78];}
function oldBuilding(root,p,d){var shell=new T.Group();shell.name='sea12 long old building';shell.userData.staticBake=true;root.add(shell);var b=new Batch(shell),F=1.10,H=4.60,left=64,right=104,front=11,back=25,step=40/7,centers=[];
 /* Continuous footing + slab: all walls sit on this body; joints are construction decisions C. */
 box(b,p.reveal,84,.52,18,40.4,1.0,14.4,.06);box(b,p.floor,84,1.025,18,40.2,.15,14.2,.04);
 box(b,p.wall,84,2.85,11,40,3.5,.48,.08);/* Two inscribed room spans are built as targetable real walls below; all joins are flush, no bevel seams. */
 box(b,p.wall,(64+(64+4*step))/2,2.85,25,4*step,3.5,.48,0);box(b,p.wall,(64+6*step+104)/2,2.85,25,step,3.5,.48,0);
 wallOpening(b,p.wall,64,18,13.52,F,H,[[4.55,F,6.15,3.70]][0],PI/2,.48);
 box(b,p.wall,104,2.85,18,.48,3.5,13.52,.05);
 /* Seven rooms, doors face a 2.1 m corridor. Full return walls close every partition end. */
 for(var i=0;i<7;i++){var cx=left+(i+.5)*step;centers.push(cx);wallOpening(b,p.wall,cx,13.65,step,F,H,[-.65,F,.65,3.35],0,.30);if(i>0)box(b,p.wall,left+i*step,2.85,19.3,.30,3.5,11.1,.025);
  /* Thin full-height walls have closed top/end faces. Room 5 loses a bounded piece of roof. */
  if(i!==4)box(b,p.wall,cx,4.75,19.45,step,.30,11.1,.025);
  else {box(b,p.wall,cx-1.93,4.75,19.45,1.83,.30,11.1,.025);box(b,p.wall,cx+1.72,4.75,19.45,2.26,.30,11.1,.025);box(b,p.wall,cx-.18,4.75,15.75,1.63,.30,3.7,.025);box(b,p.wall,cx-.18,4.75,23.68,1.63,.30,2.64,.025);
   /* Roof loss remains; no floor block is specified for this room at the selected time. */
  }
  if(i===0||i===2||i===5){/* Solid hinge and open leaf, 1.18 m clear aperture retained. */var hinge=new T.Group();hinge.name='sea12 room '+(i+1)+' hinged door';hinge.position.set(cx-.59,F,13.83);hinge.rotation.y=-PI/2;root.add(hinge);solid(hinge,p.edge,.59,1.10,0,1.18,2.20,.07,.025);solid(hinge,p.reveal,1.03,1.02,-.056,.08,.12,.04,.016);[.35,1.8].forEach(function(y){solid(hinge,p.reveal,0,y,0,.10,.16,.13,.016);});}
 }
 /* Corridor roof absent only x73..77. Light enters an actual hole with 300 mm returns. */
 box(b,p.wall,68.5,4.75,12.2,9,.30,2.40,.025);box(b,p.wall,90.5,4.75,12.2,27,.30,2.40,.025);
 /* Roof edge bands are bounded volumes. Rounded external edges carry mineral continuity. */
 /* Main entry frame: leaf stays 1.42 × 2.48 m. Jamb/header fill the rough opening;
    inward stop lips overlap the closed leaf in elevation without entering its outward swing. */
 box(b,p.reveal,64,2.35,13.38,.48,2.50,.14,.004);
 box(b,p.reveal,64,3.65,12.65,.48,.10,1.60,.004);
 box(b,p.edge,64.106,2.3275,13.295,.228,2.455,.07,.003);
 box(b,p.edge,64.106,3.595,12.59,.228,.08,1.48,.003);
 box(b,p.edge,64.106,2.3275,11.87,.228,2.455,.08,.003);
 b.finish('sea12 continuous walls floor and roof');
 var entry=new T.Group();entry.name='sea12 main entrance hinged door';entry.position.set(63.94,F,11.87);entry.rotation.y=PI;root.add(entry);solid(entry,p.edge,.71,1.24,0,1.42,2.48,.075,.028);solid(entry,p.reveal,1.20,1.10,-.06,.07,.15,.035,.012);d.houseDoor={type:'hinged',pivot:[63.94,F,11.87],angle:PI,width:1.42,leafHeight:2.48,roughOpening:1.6,clearOpening:1.46,clearHeight:2.50,frameStopX:[63.992,64.22]};
 /* Graded entry is only 0.2 m above hard ground; broad threshold + two small risers. */
 var st=new Batch(root);box(st,p.reveal,63.65,.995,12.55,.52,.21,1.82,.01);box(st,p.reveal,63.22,.945,12.55,.34,.11,1.82,.01);st.finish('sea12 entry threshold into earth');
 targets.push({id:'house',label:'旧い建物',object:shell,anchor:[64,3.3,12.55],radius:.3,text:'低い建物の中を、長い廊下が通っている。戸のある室とない室が並び、抜けた天井から落ちる光で、床の硬さが見える。'});
 var origin=centers[4],copy=centers[5],waterX=centers[2];
 incised(root,p,'name','壁の字','平らな壁に「幽」の字だけが浅く残っている。線の始まりと終わりは丸く、上にあった四段の刻みは、もう見分けられない。',origin+.55,2.15,24.751,2.0,1.6,function(c){c.font='440px serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#aaaaaa';c.fillText('幽',512,485);},origin,step);
 incised(root,p,'records','隣室の刻み','壁に写された刻みには欠けた並びがある。その下の二本は、左が長く、右は下の途中で終わっている。あいだの短い線は、彫られていない。',copy+.25,2.22,24.751,2.8,1.8,function(c){/* Missing first row and incomplete remnants; count is deliberately not a calendar reconstruction. */c.lineWidth=4;for(var row=0;row<3;row++)for(var j=0;j<27;j++){if((row===0&&j<13)||(j>11&&j<16&&row===1)||j%9===8)continue;var xx=65+j*33,yy=86+row*94;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+1,yy+29+(j%3)*9);c.stroke();}c.lineWidth=8;c.beginPath();c.moveTo(400,430);c.lineTo(400,706);c.stroke();c.lineWidth=7;c.beginPath();c.moveTo(607,430);c.lineTo(607,597);c.stroke();c.strokeStyle='#acacac';c.lineWidth=5;c.beginPath();c.moveTo(607,596);c.lineTo(607,649);c.stroke();},copy,step);
 /* Physical hairline floor splits in unregistered room, not repaired original room. */
 target(root,'floor','隣室の床','床の細い割れ目を避けて、二人が横になれる余白が残る。ここには面がなく、天井は落ちずに残っている。',[copy,1.105,20.3],function(g){var b=new Batch(g),cm=B.material(0x6d7268,.97,0,'crack');[[copy-1.5,18.4,.003,2.8],[copy+.8,21.7,.005,2.2]].forEach(function(q){box(b,cm,q[0],1.101,q[1],q[2],.002,q[3],0);});b.finish('sea12 existing hairline floor cracks');},.35);
 target(root,'face','薄く点いた面','壁の低い位置で、面が薄く点いている。接続はあると返した面は、同じ明るさを保っている。',[origin-2.61,1.90,21.7],function(g){var bb=new Batch(g),m=B.material(0x95a399,.7,0,'light',.16);m.normalMap=null;box(bb,p.edge,origin-2.71,1.90,21.7,.06,.63,1.05,.016);box(bb,m,origin-2.671,1.90,21.7,.018,.57,.98,.008);bb.finish('sea12 low blank connected panel');},.24);
 optical(root,'still-plate',[centers[3],1.90,24.48],function(g){batch(g,function(bb){box(bb,p.reveal,centers[3],1.90,24.70,.47,.40,.14,.02);box(bb,p.edge,centers[3],1.90,24.615,.40,.32,.035,.012);});},.22);
 optical(root,'food',[103.63,1.65,12.43],function(g){var bb=new Batch(g);box(bb,p.reveal,103.71,1.57,12.38,.14,.50,.83,.03);box(bb,p.web,103.61,1.56,12.38,.07,.31,.61,.01);box(bb,p.edge,103.53,1.34,12.38,.32,.06,.66,.015);box(bb,p.edge,103.575,1.87,12.38,.09,.11,.75,.018);bb.finish('sea12 single ration mouth low corridor end');},.23);
 floorBelongings(root,p,copy,d);d.house={center:[84,18],outside:[40,14],floor:F,ceiling:H,rooms:7,roomCenters:centers,originalRoom:5,copiedRoom:6,waterRoom:3,otherWaterRooms:[1,7],emptyMouthRoom:2,stillPlateRoom:4,corridor:[64,104,11.24,13.5],originalRoofHole:[origin-1.015,origin+.59,17.6,22.36],waterTemperature:37};
}
function floorBelongings(root,p,x,d){var clothMat=textile(0xa5a893,'folded-cloth',16),bagMat=textile(0x747b68,'woven-bag',18),metal=B.material(0x979b92,.6,.15,'worn-hard-object');
 target(root,'belongings','床際の荷物','袋の口に、飲み終えた包が畳んで差してある。布と工具、水の容器、二つの端末が床際にまとまり、使われた補装が二組、その脇に置かれている。',[x-1.55,1.35,22.3],function(g){batch(g,function(b){b.add(softBox(.62,.29,.45,.08,.05),bagMat,x-1.85,1.245,22.6);for(var k=0;k<7;k++)box(b,p.paper,x-1.62+k*.012,1.38+k*.01,22.61,.145,.008,.13,.003);
 for(k=0;k<3;k++)b.add(softBox(.42,.029,.32,.01,.002),clothMat,x-1.79,1.1145+k*.029,21.94);
 box(b,metal,x-1.48,1.113,21.35,.21,.026,.055,.01);box(b,metal,x-1.24,1.113,21.45,.19,.026,.04,.008);
 for(k=0;k<2;k++){box(b,p.edge,x-1.38+k*.31,1.125,22.95,.22,.05,.33,.026);box(b,p.web,x-1.38+k*.31,1.155,22.95,.18,.006,.27,.012);}
 vessel(b,metal,x-1.99,1.10,21.31);/* Water container is on floor, not a kitchen shelf. */
 box(b,p.paper,x-1.73,1.1135,22.15,.13,.027,.067,.009);box(b,metal,x-1.96,1.24,22.67,.13,.04,.09,.025);
 /* Paired concave shell pieces, with worn thin edges. No joints claimed beyond visible prosthesis role. */
 for(k=0;k<4;k++){var sh=new T.Shape();sh.absarc(0,0,.14,-PI*.40,PI*.40,false);sh.absarc(0,0,.11,PI*.40,-PI*.40,true);sh.closePath();var geo=new T.ExtrudeGeometry(sh,{depth:.43,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,steps:1});geo.rotateX(PI/2);geo.rotateZ(PI/2);geo.computeBoundingBox();var py=1.1-geo.boundingBox.min.y;b.add(geo,metal,x-1.52+(k%2)*.53,py,20.35+Math.floor(k/2)*.6);if(!d.prostheticParts)d.prostheticParts=[];d.prostheticParts.push({pair:Math.floor(k/2)+1,minY:py+geo.boundingBox.min.y,maxY:py+geo.boundingBox.max.y,x:x-1.52+(k%2)*.53,length:geo.boundingBox.max.x-geo.boundingBox.min.x});}
 });},.35);
 d.furnitureBoxes=[];d.belongings={room:6,bounds:[x-2.20,x-.72,19.85,23.20],floor:1.1,foldedPacketCountDisplayed:7,exactTotalUnspecified:true};
}
function solitaryColumn(root,p,id,x,z,text){var y=heightAt(x,z);target(root,id,id==='empty-pillar'?'出なかった柱':'遠いほうの柱',text,[x,y+.93,z-.24],function(g){batch(g,function(b){box(b,p.reveal,x,y-.17,z,.62,.4,.62,.03);box(b,p.wall,x,y+2,z,.42,4,.42,.02);box(b,p.edge,x,y+4.02,z,.44,.06,.44,.016);box(b,p.reveal,x,y+.80,z-.235,.34,.30,.13,.025);box(b,p.web,x,y+.77,z-.315,.25,.09,.05,.006);box(b,p.edge,x,y+.685,z-.29,.28,.04,.19,.007);});},.25);}
/* The incoming line bends through a supported cutting and beneath an earth-backed covered reach.
 This is C continuity beyond the station, not a new narrative destination. */
/* Fixed hero exposes the top edge: tile and edge-cap meet at z=2.0/6.8,
   instead of sharing a coplanar 0.2 m strip. Same support section and material IDs. */
function stationFloor(b,p,x,y,z,w,d){box(b,p.reveal,x,y-.19,z,w-.008,.25,d-.008,0);box(b,p.reveal,x,y-.36,z,w-.035,.17,d-.035,0);for(var i=-w/2;i<w/2-.001;i+=2.4){var tw=Math.min(2.4,w/2-i);if(i>-w/2+.001)box(b,p.joint,x+i,y-.0005,z,.0025,.001,d-.4,0);box(b,p.floor,x+i+tw/2,y-.0325,z,tw-.0025,.065,d-.4,0);}box(b,p.edge,x,y-.0325,z-d/2+.10,w,.065,.2,.012);box(b,p.edge,x,y-.0325,z+d/2-.10,w,.065,.2,.012);}
var part=B.createPart('海の駅',CH.CUTS14.sea,{background:0xb0b5b5,fog:[190,680],ambient:.24,key:.68,fill:.12,exposure:.93},function(root,d){var p=palette(),b=new Batch(root),i;targets.length=0;root.userData.environmentV11=true;p.wall.color.setHex(0xc5c6b8).convertSRGBToLinear();p.wall.roughness=.84;p.wall.userData.cast=true;p.reveal.color.setHex(0x939d8c).convertSRGBToLinear();p.floor.color.setHex(0xb3b5a5).convertSRGBToLinear();p.floor.roughness=.79;p.edge.color.setHex(0xbfc4b7).convertSRGBToLinear();p.paper.color.setHex(0xc9c8b4).convertSRGBToLinear();p.fracture=B.material(0x989b8c,.95,0,'fracture');
 d.platformHeight=1.15;d.railTop=0;d.boardingGap=.05;d.columns=4;d.brokenColumns=1;d.terrainHeightAt=heightAt;d.environmentRevision=12;d.walkway={width:2,points:routePoints,groundRoute:true};
 B.sky(root);terrain(root);stationFloor(b,p,0,1.15,4.4,36,5.2);box(b,p.reveal,0,.15,4.4,35.96,1.3,5.16,.005);B.railLine(b,p,-138,19,0,0,false);/* Closed terminal slab reaches earth beyond x19, with visible terminal rail caps from source rail geometry. */box(b,p.reveal,19.2,-.31,0,.42,.55,2.62,.025);
 box(b,p.reveal,18.24,.75,5,.48,.40,1.8,.014);box(b,p.reveal,18.72,.675,5,.48,.25,1.8,.014);box(b,p.reveal,19.15,.625,5,.38,.15,1.8,.014);b.finish('sea12 platform rail and ground steps');
 var columns=new T.Group();columns.name='sea12 four station columns';columns.position.y=.53;root.add(columns);var cb=new Batch(columns);[-10,-3,4,11].forEach(function(x,i){B.contact(cb,p,x,.623,4,.69,.69);box(cb,p.edge,x,.67,4,.61,.11,.61,.014);if(i<3){box(cb,p.wall,x,2.67,4,.42,4,.42,.016);box(cb,p.edge,x,4.7,4,.44,.07,.44,.01);}else{box(cb,p.wall,x,1.145,4,.42,.98,.42,.014);B.fracture(cb,p,x,4);B.fallenFracture(cb,p);}});cb.finish('sea12 station four columns with one deliberate fracture');targets.push({id:'columns',label:'四本の柱',object:columns,anchor:[11,1.9,4],radius:.25,text:'低いホームに柱が四本立っている。一本は折れ、落ちた先は床に残ったままだ。海へ着いたときも、駅へ戻るときも、この形は変わらない。'});
 oldBuilding(root,p,d);coastalUnderstory(root);sea(root,p,d);solitaryColumn(root,p,'distant-pillar',163,74,'海に沿って歩いた先に、折れていない柱が一本ある。この口から一つの包が落ち、二人はその場で半分ずつ飲んだ。ここには屋根も水の口もない。');
 targets.push({id:'ground',label:'硬い地面と短い草',object:root.getObjectByName('sea12 dry short inland colonies'),anchor:[59,heightAt(59,31)+.13,31],radius:.25,text:'水から離れるにつれて細かいものが薄くなり、足の下が硬くなる。丈の短い、薄い色の草が、硬い地面にまばらなまとまりを作っている。'});targets.push({id:'sea',label:'灰白の海',object:root.getObjectByName('sea11 coastal water'),anchor:[151,-.22,106],radius:.4,text:'低い盛り上がりの向こうで、水が来ては返る。近くの灰色は、遠くの白いところへ続いている。'});
});part.targets=targets;CH.parts.sea=part;
})();
