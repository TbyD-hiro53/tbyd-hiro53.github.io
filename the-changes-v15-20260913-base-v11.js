/* The Changes / v11 shared architectural primitives, selected from v6.
   All dimensions not expressly quoted by CANON are production decisions. */
(function () {
'use strict';
var CH=window.CH=window.CH||{}; CH.parts=CH.parts||{};
var T=window.THREE, PI=Math.PI, seed=681, allMaterials=[], texCache={};
function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
function wrap(a,m){return((a%m)+m)%m;}
function texture(kind){
 if(texCache[kind])return texCache[kind];
 var c=document.createElement('canvas'),x,d,i,j,n,v,s,k;
 c.width=c.height=512;x=c.getContext('2d');d=x.createImageData(512,512);seed=kind==='floor'?165:kind==='wall'?832:1939;
 for(j=0;j<512;j++)for(i=0;i<512;i++){
  k=(j*512+i)*4;n=rnd()-.5;
  if(kind==='normal'){v=127.5+n*15;d.data[k]=v;d.data[k+1]=127.5+(rnd()-.5)*15;d.data[k+2]=255;}
  else {s=kind==='soil'?10:kind==='floor'?5:3;v=kind==='rough'?218+n*32:244+n*s+Math.sin(i*.023)*Math.sin(j*.017)*2;d.data[k]=d.data[k+1]=d.data[k+2]=v;}
  d.data[k+3]=255;
 }
 x.putImageData(d,0,0);var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;t.encoding=kind==='normal'||kind==='rough'?T.LinearEncoding:T.sRGBEncoding;texCache[kind]=t;return t;
}
function material(col,rough,metal,kind,emit){
 var m=new T.MeshStandardMaterial({color:col,roughness:rough,metalness:metal||0,map:texture(kind||'wall'),normalMap:texture('normal'),normalScale:new T.Vector2(kind==='soil'?.28:kind==='floor'?.12:.055,kind==='soil'?.28:kind==='floor'?.12:.055),roughnessMap:texture('rough'),envMap:CH.ENV||null,envMapIntensity:metal?.65:.27,vertexColors:true});
 if(emit){m.emissive.set(col);m.emissiveIntensity=emit;}
 m.userData.surface=metal?'metal':(kind||'paint');allMaterials.push(m);return m;
}
function basic(col){var m=new T.MeshBasicMaterial({color:col,vertexColors:true});allMaterials.push(m);return m;}
function palette(){var p={wall:material(0xc6bdc0,.79,0,'wall'),floor:material(0x717d76,.58,0,'floor'),edge:material(0xbfc2ba,.4,0,'floor'),reveal:material(0x757f79,.7),bed:material(0x454a46,.94,0,'soil'),rail:material(0x8b9692,.29,.62),web:material(0x555f5c,.55,.45),soil:material(0x665d52,.96,0,'soil'),joint:material(0x727770,.88),dark:material(0x202e2d,.64),light:material(0xccd8cc,.42,0,'wall',.5),teal:material(0x55958b,.43,0,'wall',.32),paper:material(0xc5c2b7,.57),cord:material(0x6a8279,.72)};p.floor.color.convertSRGBToLinear();p.soil.color.convertSRGBToLinear();p.reveal.color.convertSRGBToLinear();p.bed.color.convertSRGBToLinear();p.web.color.convertSRGBToLinear();p.paper.userData.surface='paper';p.wall.color.convertSRGBToLinear();p.edge.color.convertSRGBToLinear();p.paper.color.convertSRGBToLinear();p.joint.color.copy(p.floor.color).multiplyScalar(.96);p.joint.polygonOffset=false;p.joint.polygonOffsetFactor=1;p.joint.polygonOffsetUnits=1;p.joint.userData.surface='floor';return p;}
function Batch(group){this.group=group;this.by={};}
Batch.prototype.add=function(g,m,x,y,z,rx,ry,rz,shade){
 var geo=g.index?g.toNonIndexed():g.clone(),mat=new T.Matrix4(),q=new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0));mat.compose(new T.Vector3(x||0,y||0,z||0),q,new T.Vector3(1,1,1));geo.applyMatrix4(mat);
 var p=geo.attributes.position,n=geo.attributes.normal,b=this.by[m.id],a,i,ny,vx,vy,vz,c;
 if(!b)b=this.by[m.id]={m:m,p:[],n:[],uv:[],c:[]};
 for(i=0;i<p.count;i++){
  vx=p.getX(i);vy=p.getY(i);vz=p.getZ(i);b.p.push(vx,vy,vz);b.n.push(n.getX(i),n.getY(i),n.getZ(i));
  if(Math.abs(n.getY(i))>.6)b.uv.push(vx*.72,vz*.72);else if(Math.abs(n.getZ(i))>.6)b.uv.push(vx*.72,vy*.72);else b.uv.push(vz*.72,vy*.72);
  c=shade?shade(vx,vy,vz):m.userData.shade?m.userData.shade(vx,vy,vz):1;b.c.push(c,c,c);
 }geo.dispose();g.dispose();
};
Batch.prototype.finish=function(label){var k,b,g,m;for(k in this.by){b=this.by[k];g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));g.setAttribute('color',new T.Float32BufferAttribute(b.c,3));var pa=g.attributes.position,na=g.attributes.normal,ix=[],ii,ax,ay,az,bx,by,bz,cx,cy,cz,dot;
 for(ii=0;ii<pa.count;ii+=3){ax=pa.getX(ii+1)-pa.getX(ii);ay=pa.getY(ii+1)-pa.getY(ii);az=pa.getZ(ii+1)-pa.getZ(ii);bx=pa.getX(ii+2)-pa.getX(ii);by=pa.getY(ii+2)-pa.getY(ii);bz=pa.getZ(ii+2)-pa.getZ(ii);cx=ay*bz-az*by;cy=az*bx-ax*bz;cz=ax*by-ay*bx;if(cx*cx+cy*cy+cz*cz<1e-18)continue;dot=cx*(na.getX(ii)+na.getX(ii+1)+na.getX(ii+2))+cy*(na.getY(ii)+na.getY(ii+1)+na.getY(ii+2))+cz*(na.getZ(ii)+na.getZ(ii+1)+na.getZ(ii+2));if(dot<0)ix.push(ii,ii+2,ii+1);else ix.push(ii,ii+1,ii+2);}g.setIndex(ix);g.computeBoundingSphere();m=new T.Mesh(g,b.m);m.name=label||'architectural surfaces';m.userData.h53log=m.name;m.receiveShadow=true;m.castShadow=!!b.m.userData.cast;this.group.add(m);}this.by={};};
function boxGeo(w,h,d,r){
 r=Math.min(r||0,w*.22,h*.22,d*.22);if(r<.001)return new T.BoxGeometry(w,h,d,Math.max(1,Math.ceil(w/9)),1,Math.max(1,Math.ceil(d/9)));
 var s=new T.Shape(),a=w/2-r,b=h/2-r;s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.closePath();var g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:3,steps:1,curveSegments:1});g.translate(0,0,-d/2+r);return g;
}
/* Split only the existing outer shell at height bands; never add internal horizontal caps. */
function heightBands(source,cuts){
 var g=source.index?source.toNonIndexed():source,p=g.attributes.position,n=g.attributes.normal,outP=[],outN=[],bounds=[-Infinity].concat(cuts,[Infinity]),i,j,k,poly;
 function clip(poly,level,above){var out=[],a,c,ia,ic,t,v,h;for(var q=0;q<poly.length;q++){a=poly[q];c=poly[(q+1)%poly.length];ia=above?a[1]>=level:a[1]<=level;ic=above?c[1]>=level:c[1]<=level;if(ia)out.push(a);if(ia!==ic){t=(level-a[1])/(c[1]-a[1]);v=[];for(h=0;h<6;h++)v.push(a[h]+(c[h]-a[h])*t);v[1]=level;out.push(v);}}return out;}
 function emit(v){outP.push(v[0],v[1],v[2]);var len=Math.sqrt(v[3]*v[3]+v[4]*v[4]+v[5]*v[5]);outN.push(v[3]/len,v[4]/len,v[5]/len);}
 for(i=0;i<p.count;i+=3){var tri=[];for(j=0;j<3;j++)tri.push([p.getX(i+j),p.getY(i+j),p.getZ(i+j),n.getX(i+j),n.getY(i+j),n.getZ(i+j)]);for(j=0;j<bounds.length-1;j++){poly=tri;if(isFinite(bounds[j]))poly=clip(poly,bounds[j],true);if(poly.length&&isFinite(bounds[j+1]))poly=clip(poly,bounds[j+1],false);for(k=1;k+1<poly.length;k++){emit(poly[0]);emit(poly[k]);emit(poly[k+1]);}}}
 if(g!==source)g.dispose();source.dispose();var result=new T.BufferGeometry();result.setAttribute('position',new T.Float32BufferAttribute(outP,3));result.setAttribute('normal',new T.Float32BufferAttribute(outN,3));return result;
}
function box(b,m,x,y,z,w,h,d,r,ry){var g=m.userData.shade&&h<.12?new T.BoxGeometry(w,h,d,Math.max(1,Math.ceil(w/1.5)),1,Math.max(1,Math.ceil(d/1.5))):boxGeo(w,h,d,r);b.add(g,m,x,y,z,0,ry||0,0);}
function cylinder(b,m,x,y,z,r,h,shade){b.add(new T.CylinderGeometry(r,r,h,24,4),m,x,y,z,0,0,0,shade);}
function railHead(length){var s=new T.Shape();s.moveTo(-.024,0);s.lineTo(.024,0);s.lineTo(.035,-.006);s.lineTo(.035,-.026);s.lineTo(.022,-.038);s.lineTo(-.022,-.038);s.lineTo(-.035,-.026);s.lineTo(-.035,-.006);s.closePath();var g=new T.ExtrudeGeometry(s,{depth:length,bevelEnabled:false,steps:1,curveSegments:1});g.rotateY(PI/2);g.translate(-length/2,0,0);return g;}
function lineBox(b,m,a,c,width,height){var d=new T.Vector3(c[0]-a[0],c[1]-a[1],c[2]-a[2]),mid=new T.Vector3(a[0],a[1],a[2]).addScaledVector(d,.5),g=(width===.072?railHead(d.length()):boxGeo(d.length(),height,width,0)),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(1,0,0),d.normalize());g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(q));b.add(g,m,mid.x,mid.y,mid.z);}
function floor(b,p,x,y,z,w,d){
 box(b,p.reveal,x,y-.19,z,w-.008,.25,d-.008,0);box(b,p.reveal,x,y-.36,z,w-.035,.17,d-.035,0);
 /* Each 2.4 m floor segment has a real 2.5 mm open joint over its darker supporting slab. */
 var i,tw;for(i=-w/2;i<w/2-.001;i+=2.4){tw=Math.min(2.4,w/2-i);if(i>-w/2+.001)box(b,p.joint,x+i,y-.0005,z,.0025,.001,d-.01,0);box(b,p.floor,x+i+tw/2,y-.0325,z,tw-.0025,.065,d-.007,0);}
 box(b,p.edge,x,y-.015,z-d/2+.10,w,.065,.2,.012);box(b,p.edge,x,y-.015,z+d/2-.10,w,.065,.2,.012);
}
function railLine(b,p,x0,x1,z,y,glow){
 var x,sgn;for(x=x0;x<x1;x+=6){
  var len=Math.min(6,x1-x);
  box(b,p.bed,x+len/2,y-.24,z,len,.29,3.05,0);
  for(sgn=-1;sgn<=1;sgn+=2){box(b,p.web,x+len/2,y-.084,z+sgn*.7175,len,.12,.021,0);b.add(railHead(len),p.rail,x+len/2,y,z+sgn*.7175);box(b,p.web,x+len/2,y-.146,z+sgn*.7175,len,.022,.15,0);if(glow)box(b,p.teal,x+len/2,y+.006,z+sgn*.77,len,.012,.028,.003);}
 }
 for(x=x0+.35;x<x1;x+=.65){box(b,p.reveal,x,y-.171,z,.2,.09,2.1,Math.abs(x)<12?.006:0);for(sgn=-1;sgn<=1;sgn+=2){box(b,p.web,x,y-.116,z+sgn*.84,.095,.032,.07,Math.abs(x)<12?.004:0);box(b,p.rail,x,y-.091,z+sgn*.84,.04,.018,.052,Math.abs(x)<12?.004:0);}}
}
function pathRail(b,p,pts,bedStart){var i,s,a,c,side;for(i=1;i<pts.length;i++){a=pts[i-1];c=pts[i];if(!bedStart||a[0]>=bedStart-.01)lineBox(b,p.bed,[a[0],a[1]-.26,a[2]],[c[0],c[1]-.26,c[2]],3.08,.25);for(side=-1;side<=1;side+=2){lineBox(b,p.web,[a[0],a[1]-.08,a[2]+side*.7175],[c[0],c[1]-.08,c[2]+side*.7175],.023,.12);lineBox(b,p.rail,[a[0],a[1],a[2]+side*.7175],[c[0],c[1],c[2]+side*.7175],.072,.035);}var dist=new T.Vector3(c[0]-a[0],c[1]-a[1],c[2]-a[2]).length(),steps=Math.ceil(dist/.68);for(s=0;s<steps;s++){var f=s/steps;box(b,p.reveal,a[0]+(c[0]-a[0])*f,a[1]+(c[1]-a[1])*f-.18,a[2]+(c[2]-a[2])*f,.20,.09,2.12,a[0]<55?.004:0);}}}
function panelTexture(lines,w,h,bigMap){
 var c=document.createElement('canvas');c.width=w||1024;c.height=h||512;var x=c.getContext('2d'),i,fs;x.fillStyle='#142a28';x.fillRect(0,0,c.width,c.height);
 if(bigMap){
  x.strokeStyle='#73a99b';x.lineWidth=1.5;
  x.beginPath();x.moveTo(60,245);x.lineTo(1394,245);x.stroke();
  for(i=0;i<98;i++){var xx=60+i*13.75,yy=350+(i%4)*49;x.beginPath();x.moveTo(xx,245);x.lineTo(xx,yy);x.lineTo(xx+6,yy+16);x.stroke();}
  x.fillStyle='#c4dad0';x.font='500 56px sans-serif';x.fillText('廣瀬書庫',60,94);x.font='500 28px sans-serif';x.fillText('分館六六四五',60,187);
  x.lineWidth=1.5;x.beginPath();x.moveTo(1380,430);x.lineTo(1380,577);x.lineTo(1175,577);x.moveTo(1394,495);x.lineTo(1394,677);x.lineTo(1175,677);x.stroke();
  x.font='500 46px sans-serif';x.fillText('分館〇〇〇二',970,628);x.fillText('分館〇〇〇一',970,729);
 }else for(i=0;i<lines.length;i++){fs=Math.min(54,Math.floor(c.height/(lines.length+1)*.54));x.font='500 '+fs+'px system-ui, sans-serif';while(fs>8&&x.measureText(lines[i]).width>c.width*.88){fs--;x.font='500 '+fs+'px system-ui, sans-serif';}x.fillStyle='#b9d4c9';x.fillText(lines[i],c.width*.06,c.height*(i+1)/(lines.length+1)+fs*.32);}
 var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t;
}
function screen(group,b,p,x,y,z,w,h,lines,ry,bigMap){
 box(b,p.reveal,x,y,z,w+.014,h+.014,.038,.003,ry);var map=panelTexture(lines,bigMap?1536:1024,bigMap?768:384,bigMap),m=new T.MeshStandardMaterial({map:map,roughness:.45,metalness:.08,emissive:0xffffff,emissiveMap:map,emissiveIntensity:.32,envMap:CH.ENV||null,envMapIntensity:.2});allMaterials.push(m);var g=new T.PlaneGeometry(w,h),mesh=new T.Mesh(g,m);mesh.position.set(x+Math.sin(ry||0)*.022,y,z+Math.cos(ry||0)*.022);mesh.rotation.y=ry||0;mesh.name=bigMap?'ninety eight fine route branches':'recessed information surface';group.add(mesh);
}
var contactMap=null,contactMat=null;
function contact(b,p,x,y,z,w,d){
 if(!contactMap){var c=document.createElement('canvas');c.width=c.height=128;var cx=c.getContext('2d'),im=cx.createImageData(128,128),i,j,k,a;for(j=0;j<128;j++)for(i=0;i<128;i++){k=(j*128+i)*4;a=Math.min(i,j,127-i,127-j)/18;im.data[k+3]=Math.round(Math.min(1,Math.max(0,a))*145);}cx.putImageData(im,0,0);contactMap=new T.CanvasTexture(c);contactMat=new T.MeshBasicMaterial({map:contactMap,transparent:true,opacity:.27,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});}
 var g=new T.PlaneGeometry(w+.22,d+.22);g.rotateX(-PI/2);var m=new T.Mesh(g,contactMat);m.position.set(x,y+.002,z);m.name='baked soft contact gradient';b.group.add(m);
}
function localLight(root,col,power,x,y,z,radius){var l=new T.PointLight(col,power,radius,2);l.position.set(x,y,z);root.add(l);return l;}

function sky(root){var c=document.createElement('canvas');c.width=512;c.height=256;var cx=c.getContext('2d'),gr=cx.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#7e8a84');gr.addColorStop(.46,'#a9b4ac');gr.addColorStop(.56,'#a9b4ac');gr.addColorStop(1,'#78857e');cx.fillStyle=gr;cx.fillRect(0,0,512,256);var im=cx.getImageData(0,0,512,256),xx,yy,kk;for(yy=0;yy<256;yy++)for(xx=0;xx<512;xx++){kk=(yy*512+xx)*4;var lon=xx/512*PI*2,lat=yy/256*PI,cloud=.045*Math.sin(lon*3+.9*Math.sin(lat*4))*Math.sin(lat)+.027*Math.cos(lon*7-lat*3)*Math.sin(lat)*Math.sin(lat),lift=1+cloud;im.data[kk]*=lift;im.data[kk+1]*=lift;im.data[kk+2]*=lift;}cx.putImageData(im,0,0);var tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;var m=new T.MeshBasicMaterial({map:tx,side:T.BackSide,depthWrite:false,fog:false,toneMapped:false});var o=new T.Mesh(new T.SphereGeometry(1400,32,16),m);o.name='broad overcast sky';o.renderOrder=-2;root.add(o);}
function smoothCoincident(g){var p=g.attributes.position,n=g.attributes.normal,sums={},keys=[],i,key,v;for(i=0;i<p.count;i++){key=Math.round(p.getX(i)*100000)+','+Math.round(p.getY(i)*100000)+','+Math.round(p.getZ(i)*100000);keys.push(key);if(!sums[key])sums[key]=new T.Vector3();sums[key].add(new T.Vector3(n.getX(i),n.getY(i),n.getZ(i)));}for(i=0;i<p.count;i++){v=sums[keys[i]].clone().normalize();n.setXYZ(i,v.x,v.y,v.z);}return g;}
function foldedPouch(layer){var p=[],ix=[],nx=12,nz=10,i,j,side,x,z,y,yy=1.153+layer*.0019;for(side=0;side<2;side++)for(j=0;j<=nz;j++)for(i=0;i<=nx;i++){x=(i/nx-.5)*.148;z=(j/nz-.5)*.109;var edge=Math.sin(Math.PI*i/nx),crease=.0008*Math.exp(-Math.pow((z+.046)/.009,2)),sag=-.004*(layer/40)*Math.exp(-Math.pow(x/.018,2)),ripple=.00035*Math.sin(x*65+.25*layer)*Math.sin(Math.PI*j/nz);y=yy+sag+crease+ripple+(side===0?.0013:0);p.push(x,y,z);}var count=(nx+1)*(nz+1);for(side=0;side<2;side++)for(j=0;j<nz;j++)for(i=0;i<nx;i++){var a=side*count+j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;if(side===0)ix.push(a,c,b,b,c,d);else ix.push(a,b,c,b,d,c);}for(i=0;i<nx;i++){var a=i,b=i+1;ix.push(a,b,count+a,b,count+b,count+a);a=nz*(nx+1)+i;b=a+1;ix.push(a,count+a,b,b,count+a,count+b);}for(j=0;j<nz;j++){var a=j*(nx+1),b=a+nx+1;ix.push(a,count+a,b,b,count+a,count+b);a+=nx;b+=nx;ix.push(a,b,count+a,b,count+b,count+a);}var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;}
function fracture(b,p,x,z){var arr=[],heights=[1.74,1.79,1.7,1.82],corners=[[-.21,-.21],[.21,-.21],[.21,.21],[-.21,.21]],i,j,a,c,mid=1.75;for(i=0;i<4;i++){j=(i+1)%4;a=corners[i];c=corners[j];arr.push(a[0],1.63,a[1],c[0],1.63,c[1],c[0],heights[j],c[1],a[0],1.63,a[1],c[0],heights[j],c[1],a[0],heights[i],a[1]);}for(var ri=0;ri<arr.length;ri+=9){for(var rj=0;rj<3;rj++){var rt=arr[ri+3+rj];arr[ri+3+rj]=arr[ri+6+rj];arr[ri+6+rj]=rt;}}var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));g.computeVertexNormals();b.add(g,p.wall,x,0,z);arr=[];for(i=0;i<4;i++){j=(i+1)%4;a=corners[i];c=corners[j];arr.push(0,mid,0,c[0],heights[j],c[1],a[0],heights[i],a[1]);}g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));g.computeVertexNormals();b.add(g,p.fracture||p.reveal,x,0,z);}
function fallenFracture(b,p){
 var full=[[-.21,-.21],[-.05,-.21],[.09,-.21],[.21,-.21],[.21,-.04],[.21,.085],[.21,.21],[.065,.21],[-.105,.21],[-.21,.21],[-.21,.035],[-.21,-.11]],chip=[[-.202,-.205],[-.05,-.209],[.09,-.194],[.203,-.20],[.204,-.04],[.191,.085],[.206,.205],[.065,.202],[-.105,.207],[-.207,.20],[-.193,.035],[-.205,-.11]],ends=[-1.43,-1.384,-1.401,-1.365,-1.427,-1.388,-1.44,-1.397,-1.42,-1.382,-1.408,-1.39],arr=[],i,j,k,a,c;
 function tri(a,b,c){arr.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);}
 for(i=0;i<12;i++){j=(i+1)%12;a=[-1.315,full[i][0],full[i][1]];c=[-1.315,full[j][0],full[j][1]];var fa=[1.415,full[i][0],full[i][1]],fc=[1.415,full[j][0],full[j][1]],ba=[ends[i],chip[i][0],chip[i][1]],bc=[ends[j],chip[j][0],chip[j][1]];tri(a,fc,fa);tri(a,c,fc);tri(ba,c,a);tri(ba,bc,c);tri([1.415,0,0],fa,fc);}
 var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));g.computeVertexNormals();b.add(g,p.wall,12.15,.832,4.82,0,.34,0);arr=[];
 var cp=[],ci=[],N=24,u,v,uu,vv;
 function edgePoint(start,reverse,t){var q=t*3,seg=Math.min(2,Math.floor(q)),f=q-seg,ia=(start+(reverse?-seg:seg)+12)%12,ib=(ia+(reverse?-1:1)+12)%12;return [ends[ia]*(1-f)+ends[ib]*f,chip[ia][0]*(1-f)+chip[ib][0]*f,chip[ia][1]*(1-f)+chip[ib][1]*f];}
 var c00=edgePoint(0,false,0),c10=edgePoint(0,false,1),c01=edgePoint(9,true,0),c11=edgePoint(9,true,1);
 for(vv=0;vv<=N;vv++)for(uu=0;uu<=N;uu++){u=uu/N;v=vv/N;var bottom=edgePoint(0,false,u),top=edgePoint(9,true,u),left=edgePoint(0,true,v),right=edgePoint(3,false,v),pt=[];for(k=0;k<3;k++)pt[k]=(1-v)*bottom[k]+v*top[k]+(1-u)*left[k]+u*right[k]-((1-u)*(1-v)*c00[k]+u*(1-v)*c10[k]+(1-u)*v*c01[k]+u*v*c11[k]);pt[0]+=.010*Math.sin(pt[1]*19+pt[2]*9)*Math.sin(PI*u)*Math.sin(PI*v);cp.push(pt[0],pt[1],pt[2]);}
 for(vv=0;vv<N;vv++)for(uu=0;uu<N;uu++){var ca=vv*(N+1)+uu,cb=ca+1,cc=ca+N+1,cd=cc+1;ci.push(ca,cc,cb,cb,cc,cd);}g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(cp,3));g.setIndex(ci);g.computeVertexNormals();b.add(g,p.fracture,12.15,.832,4.82,0,.34,0);

 seed=992;for(k=0;k<17;k++){var gg=new T.SphereGeometry(.002+rnd()*.004,6,4,0,PI*2,0,PI/2);gg.rotateZ(PI/2);gg.translate(-1.4,(rnd()-.5)*.29,(rnd()-.5)*.29);b.add(gg,p.fracture,12.15,.832,4.82,0,.34,0);}
 contact(b,p,12.15,.621,4.82,2.84,.42);b.group.children[b.group.children.length-1].rotation.y=.34;
}
function createPart(name,views,lighting,maker){var root=null,data={},own=[];return{name:name,views:views,lighting:lighting,dims:data,build:function(){if(root)return root;root=new T.Group();root.name=name;maker(root,data);root.updateMatrixWorld(true);return root;},tick:function(t){if(data.tick)data.tick(t);},mats:function(){var i;for(i=0;i<allMaterials.length;i++)if('envMap'in allMaterials[i]){if(allMaterials[i].envMap!==(CH.ENV||null)){allMaterials[i].envMap=CH.ENV||null;allMaterials[i].needsUpdate=true;}}},interact:function(id,t){if(data.interact)return data.interact(id,t);},actions:[]};}
function view(id,label,eye,target,fov,wide){return{id:id,label:label,eye:eye,target:target,fov:fov||65,wideFov:wide||46};}
var day={background:0xa9b4ac,fog:[150,620],ambient:.42,key:.26,fill:.18};
/* S0: the shore is beyond fine ground and a low rise, never underneath the platform. */
CH.ENV8=CH.ENV8||{};CH.ENV8.base={Batch:Batch,palette:palette,box:box,boxGeo:boxGeo,floor:floor,railLine:railLine,pathRail:pathRail,contact:contact,view:view,sky:sky,localLight:localLight,screen:screen,createPart:createPart,material:material,basic:basic,fracture:fracture,fallenFracture:fallenFracture,heightBands:heightBands,lineBox:lineBox};
}());
