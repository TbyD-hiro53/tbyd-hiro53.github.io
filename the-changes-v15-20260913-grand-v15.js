/* v12 grand station: resolved structural terminations; selected S7 structure, S2 folds, S8 facilities.
   Production source. Author-authorized scene recomposition, not a novel revision. */
(function(){'use strict';var CH=window.CH,T=window.THREE,PI=Math.PI,B=CH.ENV8.base;
var Batch=B.Batch,palette=B.palette,box=B.box,boxGeo=B.boxGeo,railLine=B.railLine,pathRail=B.pathRail,contact=B.contact,view=B.view,localLight=B.localLight,screen=B.screen,createPart=B.createPart,material=B.material,heightBands=B.heightBands,lineBox=B.lineBox;
function wrap(a,m){return((a%m)+m)%m;}
function throughPath(u,z,y){var radius=180-z,t=0,x=u;if(u<-176){t=(-176-u)/radius;x=-176-radius*Math.sin(t);z+=radius*(1-Math.cos(t));}else if(u>516){t=(u-516)/radius;x=516+radius*Math.sin(t);z+=radius*(1-Math.cos(t));}return new T.Vector3(x,y,z);}
function throughPose(u,z,y){var a=throughPath(u-6,z,y),c=throughPath(u+6,z,y),v=c.clone().sub(a);return{point:a.add(c).multiplyScalar(.5),yaw:-Math.atan2(v.z,v.x)};}

function floor(b,p,x,y,z,w,d){box(b,p.reveal,x,y-.275,z,w,.55,d,0);for(var xx=-w/2;xx<w/2-.001;xx+=2.4){var tw=Math.min(2.4,w/2-xx);box(b,p.floor,x+xx+tw/2,y-.0325,z,tw-.0025,.065,d-.007,0);}box(b,p.edge,x,y-.04,z-d/2+.09,w,.08,.18,.006);box(b,p.edge,x,y-.04,z+d/2-.09,w,.08,.18,.006);}
/* Same filled envelope twice: 230 x 150 x 80 mm, a compressed sealed rim,
   a flattened lower bearing patch and one matching unopened tear-start notch. */
function filledPouch(){
 var nx=32,nz=24,pos=[],idx=[],side,i,j,u,v,x,z,dome,innerU,innerV,notch,y;
 for(side=0;side<2;side++)for(j=0;j<=nz;j++)for(i=0;i<=nx;i++){
  u=i/nx*2-1;v=j/nz*2-1;
  x=.115*u*Math.sqrt(1-.20*v*v);z=.075*v*Math.sqrt(1-.20*u*u);
  notch=Math.max(0,1-Math.abs(u-.6875)/.0625)*Math.max(0,(-v-.80)/.20);
  z+=.004*notch;
  innerU=Math.min(1,Math.abs(u)/.94);innerV=Math.min(1,Math.abs(v)/.94);
  dome=Math.pow(Math.max(0,(1-innerU*innerU)*(1-innerV*innerV)),.65);
  y=side===0?.0246+.0554*dome:Math.max(0,.0234-.026*dome);
  pos.push(x,y,z);
 }
 var count=(nx+1)*(nz+1);
 for(side=0;side<2;side++)for(j=0;j<nz;j++)for(i=0;i<nx;i++){var a=side*count+j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;if(side===0)idx.push(a,c,b,b,c,d);else idx.push(a,b,c,b,d,c);}
 for(i=0;i<nx;i++){var a=i,b=i+1;idx.push(a,b,count+a,b,count+b,count+a);a=nz*(nx+1)+i;b=a+1;idx.push(a,count+a,b,b,count+a,count+b);}
 for(j=0;j<nz;j++){var a=j*(nx+1),b=a+nx+1;idx.push(a,count+a,b,b,count+a,count+b);a+=nx;b+=nx;idx.push(a,b,count+a,b,count+b,count+a);}
 var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function foldedPouch(layer){var p=[],ix=[],nx=12,nz=10,i,j,side,x,z,y,yy=1.153+layer*.0019;for(side=0;side<2;side++)for(j=0;j<=nz;j++)for(i=0;i<=nx;i++){x=(i/nx-.5)*.148;z=(j/nz-.5)*.109;var edge=Math.sin(Math.PI*i/nx),crease=.0008*Math.exp(-Math.pow((z+.046)/.009,2)),sag=-.004*(layer/40)*Math.exp(-Math.pow(x/.018,2)),ripple=.00035*Math.sin(x*65+.25*layer)*Math.sin(Math.PI*j/nz);y=yy+sag+crease+ripple+(side===0?.0013:0);p.push(x,y,z);}var count=(nx+1)*(nz+1);for(side=0;side<2;side++)for(j=0;j<nz;j++)for(i=0;i<nx;i++){var a=side*count+j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;if(side===0)ix.push(a,c,b,b,c,d);else ix.push(a,b,c,b,d,c);}for(i=0;i<nx;i++){var a=i,b=i+1;ix.push(a,b,count+a,b,count+b,count+a);a=nz*(nx+1)+i;b=a+1;ix.push(a,count+a,b,b,count+a,count+b);}for(j=0;j<nz;j++){var a=j*(nx+1),b=a+nx+1;ix.push(a,count+a,b,b,count+a,count+b);a+=nx;b+=nx;ix.push(a,b,count+a,b,count+b,count+a);}var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;}

CH.parts.grand=createPart('大きい駅',CH.CUTS14.grand,{background:0x18212c,fog:[125,280],ambient:.24,key:.4,fill:.15},function(root,d){
 var p=palette(),b=new Batch(root),x,z,i,j;p.wall.userData.cast=true;d.columnWidth=3.8;d.columnHeight=42;d.routeBranches=98;d.mapEnd=['〇〇〇二','〇〇〇一'];
 floor(b,p,-33.5,1.15,6.5,117,9.4);floor(b,p,70.5,1.15,6.7,91,9.0);floor(b,p,-31,1.15,-5.5,122,7.4);floor(b,p,12,7.65,-19.225,208,5.95);floor(b,p,12,-5.35,20.9,208,6.2);
 railLine(b,p,-176,516,0,0,false);railLine(b,p,-176,516,-11,0,false);railLine(b,p,-176,516,16,-6.5,false);railLine(b,p,-176,516,-24,6.5,false);
 /* v8 clearance: gain altitude within the open central corridor before
    crossing the other platforms/active tracks. Descending plan passes between
    column bays, not through their feet. These dimensions are art engineering. */
 function smooth01(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
 function branchPoint(xx){var zz=-4.5*smooth01((xx-35)/85),yy=6.5*smooth01((xx-120)/145);if(xx>265)zz=-4.5-19.5*smooth01((xx-265)/195);return [xx,yy,zz];}

 function branchRail(pts){var norms=[],ii,ss,side;for(ii=0;ii<pts.length;ii++){var prev=pts[Math.max(0,ii-1)],next=pts[Math.min(pts.length-1,ii+1)],dx=next[0]-prev[0],dz=next[2]-prev[2],ll=Math.sqrt(dx*dx+dz*dz);norms.push([-dz/ll,dx/ll]);}for(ii=1;ii<pts.length;ii++){var a=pts[ii-1],c=pts[ii],na=norms[ii-1],nc=norms[ii];if(a[0]>=93)lineBox(b,p.bed,[a[0],a[1]-.24,a[2]],[c[0],c[1]-.24,c[2]],3.08,.29);for(side=-1;side<=1;side+=2){var aa=[a[0]+side*.7175*na[0],a[1],a[2]+side*.7175*na[1]],cc=[c[0]+side*.7175*nc[0],c[1],c[2]+side*.7175*nc[1]];lineBox(b,p.rail,aa,cc,.072,.035);aa=[aa[0],aa[1]-.08,aa[2]];cc=[cc[0],cc[1]-.08,cc[2]];lineBox(b,p.web,aa,cc,.023,.12);}var dl=Math.sqrt(Math.pow(c[0]-a[0],2)+Math.pow(c[1]-a[1],2)+Math.pow(c[2]-a[2],2)),steps=Math.ceil(dl/.68),yaw=-Math.atan2(c[2]-a[2],c[0]-a[0]);for(ss=0;ss<steps;ss++){var f=ss/steps;box(b,p.reveal,a[0]+(c[0]-a[0])*f,a[1]+(c[1]-a[1])*f-.18,a[2]+(c[2]-a[2])*f,.20,.09,2.12,0,yaw);}}}
 var up=[];for(i=0;i<=425;i++)up.push(branchPoint(35+i));branchRail(up);
 // A widening common support bed through the diverging switch area. No coincident top overlays.
 for(x=35;x<93;x++){var aa=branchPoint(x),cc=branchPoint(x+1),leftA=aa[2]-1.54,leftC=cc[2]-1.54,pp=[x,-.095,-1.54,x+1,-.095,-1.54,x+1,-.095,leftC,x,-.095,leftA],gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pp,3));for(var pk=0;pk<12;pk+=3)pp.push(pp[pk],-.385,pp[pk+2]);gg.setAttribute('position',new T.Float32BufferAttribute(pp,3));gg.setIndex([0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]);var ng=gg.toNonIndexed();gg.dispose();ng.computeVertexNormals();b.add(ng,p.bed,0,0,0);}
 for(x=55;x<=445;x+=26){var bp=branchPoint(x);if(Math.abs(bp[2]+11)<3.0)continue;var top=bp[1]-.90;box(b,p.reveal,x,(top-7.575)/2,bp[2],.8,top+7.575,1.5,.015);}
 for(i=1;i<up.length;i++)lineBox(b,p.reveal,[up[i-1][0],up[i-1][1]-.64,up[i-1][2]],[up[i][0],up[i][1]-.64,up[i][2]],1.5,.52);
 d.branchPoints=up;d.branchDesign={source:'v11 single gentle rising branch; old descending S-turn omitted',diverge:[35,120],rise:[120,265],merge:[265,460],riseMetres:6.5,planOffset:24,bogieHalfSpacing:6,carLength:20,trackGauge:1.435};
 /* Four-sided 3.8 m columns: the vertex gradient is broad reflected-light loss, no black painted stripe. */
 for(x=-118;x<=480;x+=26)for(j=0;j<3;j++){z=[-32,7,34][j];
  var cg=heightBands(boxGeo(3.8,49.5,3.8,.06),[4.75,9.75,14.75,18.75,21.75,23.75]);var colBatch=b;if(x===12&&z===7){d.heroColumn=new T.Group();root.add(d.heroColumn);colBatch=new Batch(d.heroColumn);}colBatch.add(cg,p.wall,x,17.25,z,0,0,0,function(vx,vy,vz){var base=.98-.68*Math.max(0,Math.min(1,(vy+7.5)/49.5)),u=Math.max(0,Math.min(1,(vy-22)/20)),fade=u*u*(3-2*u);return base*(1-.70*fade);});if(colBatch!==b)colBatch.finish('grand-one-great-column');box(b,p.reveal,x,-7.18,z,4.02,.80,4.02,.025);if(x<150)contact(b,p,x,z===7?1.151:-7.573,z,4.10,4.10);for(var seat=0;seat<3;seat++){var sy=[-.42,6.08,-6.92][seat];box(b,p.reveal,x,sy,z,3.96,.075,3.96,.008);}
 }
 /* Load paths beneath the decks: deep cross girders meet the great columns. */
 for(x=-118;x<=480;x+=26){box(b,p.reveal,x,-.94,1,1.05,1.1,68,.018);box(b,p.reveal,x,5.56,-22.85,1.0,1.1,18.3,.018);box(b,p.reveal,x,2.31,-14.15,.90,5.40,.90,.014);box(b,p.reveal,x,-7.44,20.5,1.0,1.1,27,.018);}
 box(b,p.bed,170,-7.80,1.5,700,.45,91.5,0);
 var outer=boxGeo(700,49.575,.5,.005);b.add(outer,p.reveal,170,17.2125,-44,0,0,0,function(vx,vy,vz){return .7-.48*Math.min(1,Math.max(0,vy)/41);});
 var outer2=boxGeo(700,49.575,.5,.005);b.add(outer2,p.reveal,170,17.2125,47,0,0,0,function(vx,vy,vz){return .7-.48*Math.min(1,Math.max(0,vy)/41);});
 /* Ceiling and crossing bands at high level, retained physical depth at every crossing. */
 box(b,p.dark,170,42.4,1.5,700,.8,91.5,0);
 for(x=-156;x<=494;x+=26){box(b,p.reveal,x,35.5,0,1.1,.75,94,.018);box(b,p.light,x,35.10,0,.13,.025,92,.004);}
 /* Fixtures at platform scale allow proximity/scale to coexist. */
 for(x=-78;x<81;x+=12){var fy=Math.abs(x+8)<3?5.03:4.1;box(b,p.edge,x,fy,10.9,1.5,.055,.23,.008);box(b,p.light,x,fy-.036,10.82,1.46,.025,.17,.004);}
 
 addTerminations(root,d,p,b,branchPoint);
 b.finish('S7 branched rails and forty-two metre columns');for(x=-48;x<55;x+=24)localLight(root,0xbdcec4,1.25,x,4,10.5,24);
 var tr1=null,tr2=null;if(CH.VEHICLE&&CH.VEHICLE.createTrain){tr1=CH.VEHICLE.createTrain({cars:2});tr1.position.set(-170,0,-11);root.add(tr1);tr2=CH.VEHICLE.createTrain({cars:2});tr2.position.set(150,6.5,-24);root.add(tr2);}
 function collectTrain(tr,z,y){if(!tr)return null;var list=[];for(var k=0;k<tr.children.length;k++){var child=tr.children[k];list.push({object:child,x:child.position.x,y:child.position.y,z:child.position.z});}tr.position.set(0,0,0);return{root:tr,z:z,y:y,children:list};}
 var trainStates=[collectTrain(tr1,-11,0),collectTrain(tr2,-24,6.5)];
 function placeTrain(st,u){if(!st)return;for(var k=0;k<st.children.length;k++){var q=st.children[k],pose=throughPose(u+q.x,st.z,st.y);q.object.position.set(pose.point.x,pose.point.y+q.y,pose.point.z+q.z);q.object.rotation.y=pose.yaw;}}
 d.tick=function(t){placeTrain(trainStates[0],wrap(t*19.6+365,1070)-365);placeTrain(trainStates[1],705-wrap(t*25.1+660,1070));};d.trains=[tr1,tr2];d.trainTravelArc=[-365,705];d.trainStates=trainStates;d.throughPath=throughPath;d.throughPose=throughPose;d.placeTrain=placeTrain;d.tick(0);
 var sb=new Batch(root);for(x=-92;x<=116;x+=26){
 box(sb,p.reveal,x,.105,x<25?6.6:6.7,1.05,.99,x<25?9:8.8,.014);if(x<=30)box(sb,p.reveal,x,.105,-5.625,1.05,.99,6.55,.014);
 box(sb,p.reveal,x,6.605,-19,1,.99,5.3,.014);box(sb,p.reveal,x,-6.395,21,1,.99,5.8,.014);
 }sb.finish('S7 v8 platform webs meet cross girders');d.supportsV8={deckBottoms:[.6,7.1,-5.9],girderTops:[-.39,6.11,-6.89]};
  addWing(root,d,p);
});
function addTerminations(root,d,p,b,branchPoint){
 var x,z,i,j,datum=-7.575,roof=42,ends=[-176,516],tracks=[{z:-24,y:6.5},{z:-11,y:0},{z:0,y:0},{z:16,y:-6.5}];
 var ledger=[];
 function member(id,c,size,mat){box(b,mat||p.reveal,c[0],c[1],c[2],size[0],size[1],size[2],.008);ledger.push({id:id,centre:c,size:size});}
 // Closed portal wall sections connect the foundation, flank walls and roof.
 // Each through line has its own 5.2 m by 4.9 m clear opening; none is a painted hole.
 for(i=0;i<ends.length;i++){
  x=ends[i];var previous=-44.25;
  for(j=0;j<tracks.length;j++){
   var tr=tracks[j],lo=tr.z-2.6,hi=tr.z+2.6,low=tr.y-.5,high=tr.y+4.4;
   if(lo>previous)member('portal-pier-'+i+'-'+j,[x,(roof+datum)/2,(previous+lo)/2],[1.1,roof-datum,lo-previous]);
   if(low>datum)member('portal-sill-'+i+'-'+j,[x,(datum+low)/2,tr.z],[1.1,low-datum,5.2]);
   member('portal-lintel-'+i+'-'+j,[x,(high+roof)/2,tr.z],[1.1,roof-high,5.2]);
   // A real curved lined passage turns away from the hall. Its radius is shared
   // by rail geometry, sleepers, walls and each car's bogie-chord orientation.
   var endAngle=1.27,radius=180-tr.z,segments=115,dir=i===0?-1:1;
   function offsetPoint(u,side){var pt=throughPath(u,tr.z,tr.y),pa=throughPath(u-.01,tr.z,tr.y),pc=throughPath(u+.01,tr.z,tr.y),vx=pc.x-pa.x,vz=pc.z-pa.z,ll=Math.sqrt(vx*vx+vz*vz);return[pt.x-side*vz/ll,pt.y,pt.z+side*vx/ll];}
   function arcSolid(profile,side,vertical,mat){var pos=[],idx=[],count=profile.length,k,h;for(k=0;k<=segments;k++){var u=x+dir*radius*endAngle*k/segments;for(h=0;h<count;h++){var pp=offsetPoint(u,side+profile[h][0]);pos.push(pp[0],tr.y+vertical+profile[h][1],pp[2]);}}for(k=0;k<segments;k++)for(h=0;h<count;h++){var aa=k*count+h,bb=k*count+(h+1)%count,cc=(k+1)*count+h,dd=(k+1)*count+(h+1)%count;idx.push(aa,cc,bb,bb,cc,dd);}for(h=1;h<count-1;h++){idx.push(0,h,h+1);var base=segments*count;idx.push(base,base+h+1,base+h);}var geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(dir<0)for(var f=0;f<idx.length;f+=3){var swap=idx[f+1];idx[f+1]=idx[f+2];idx[f+2]=swap;}geo.setIndex(idx);var flat=geo.toNonIndexed();geo.dispose();flat.computeVertexNormals();b.add(flat,mat,0,0,0);}
   function arcBox(width,height,side,vertical,mat){arcSolid([[-width/2,-height/2],[width/2,-height/2],[width/2,height/2],[-width/2,height/2]],side,vertical,mat);}
   for(var side=-1;side<=1;side+=2){arcBox(.46,5.3,side*2.82,1.95,p.reveal);arcSolid([[-.024,0],[.024,0],[.035,-.006],[.035,-.026],[.022,-.038],[-.022,-.038],[-.035,-.026],[-.035,-.006]],side*.7175,0,p.rail);arcBox(.021,.12,side*.7175,-.084,p.web);arcBox(.15,.022,side*.7175,-.146,p.web);}
   arcBox(6.08,.6,0,4.7,p.reveal);arcBox(6.08,.42,0,-.59,p.reveal);arcBox(3.05,.29,0,-.24,p.bed);
   for(var seg=0;seg<segments*3;seg++){var us=x+dir*radius*endAngle*(seg+.5)/(segments*3),pose=throughPose(us,tr.z,tr.y);box(b,p.reveal,pose.point.x,tr.y-.171,pose.point.z,.2,.09,2.1,0,pose.yaw);}
   var endU=x+dir*radius*endAngle,ep=throughPose(endU,tr.z,tr.y);box(b,p.reveal,ep.point.x,tr.y+1.95,ep.point.z,1,5.3,6.08,.008,ep.yaw);
   ledger.push({id:'curved-tunnel-'+i+'-'+j,centre:[x,tr.y,tr.z],size:[radius*endAngle,5.3,6.08],arcRadius:radius,endAngle:endAngle,segments:segments,modelEndArc:endU});
   previous=hi;
  }
  member('portal-side-return-'+i,[x,(roof+datum)/2,(previous+47.25)/2],[1.1,roof-datum,47.25-previous]);
 }
 // Longitudinal high-level girders carry the crossing lighting beams onto the great columns.
 for(i=0;i<3;i++){z=[-32,7,34][i];member('roof-longitudinal-girder-'+i,[170,36.2,z],[694,.8,1.1]);}
 // Visible bearings make each embedded beam end legible from the hall.
 // The corbels overlap both the full-depth structural wall and the carried girder.
 for(i=0;i<2;i++)for(j=0;j<3;j++){z=[-32,7,34][j];member('roof-end-bearing-'+i+'-'+j,[i===0?-174.85:514.85,35.35,z],[1.85,1.25,1.95]);}
 for(x=-156;x<=494;x+=26)for(i=0;i<2;i++){z=i===0?-43.10:46.10;member('cross-beam-wall-bearing-'+x+'-'+i,[x,34.63,z],[1.95,1.1,1.85]);}
 // Slender luminaires are fixtures on grounded uprights, not floating bars.
 for(x=-78;x<81;x+=12){var fy=Math.abs(x+8)<3?5.03:4.1;member('fixture-stem-'+x,[x,(1.15+fy)/2,11.04],[.08,fy-1.15,.09],p.edge);member('fixture-base-'+x,[x,1.19,11.04],[.24,.08,.25],p.edge);}
 // Track beds meet continuous deck beams, bearing onto the great-column cross girders.
 var lineDecks=[{z:0,y:0},{z:-11,y:0},{z:-24,y:6.5},{z:16,y:-6.5}];
 for(i=0;i<lineDecks.length;i++){var ld=lineDecks[i];member('through-track-deck-'+i,[170,ld.y-.63,ld.z],[692,.5,2.65]);}
 // Continuous under-platform stringers terminate flush at substantial closed fascias.
 var decks=[{a:-92,c:116,y:1.15,zs:[2.72,10.6]},{a:-92,c:30,y:1.15,zs:[-8.5,-2.5]},{a:-92,c:116,y:7.65,zs:[-21.55,-16.9]},{a:-92,c:116,y:-5.35,zs:[18.4,23.4]}];
 for(i=0;i<decks.length;i++){var dk=decks[i];for(j=0;j<dk.zs.length;j++)member('deck-stringer-'+i+'-'+j,[(dk.a+dk.c)/2,dk.y-1.015,dk.zs[j]],[dk.c-dk.a,.93,.3]);}
 // Branch piers skipped over the lower line are replaced by a spanning portal, above its roof envelope.
 for(x=55;x<=445;x+=26){var bp=branchPoint(x);if(Math.abs(bp[2]+11)>=3)continue;var cy=bp[1]-1.10;member('branch-crossing-girder-'+x,[x,cy,-11],[.82,.42,8.4]);for(z=-15;z<=-7;z+=8)member('branch-crossing-leg-'+x,[x,(cy-.21+datum)/2,z],[.8,cy-.21-datum,.8]);}
 d.terminationMembers=ledger;d.terminationDesign={hallEnds:ends,curvedTunnelRadii:[204,191,180,164],curvedTunnelAngle:1.27,tunnelEndArcByTrack:[[-435.08,775.08],[-418.57,758.57],[-404.6,744.6],[-384.28,724.28]],trainTravelArc:[-365,705],clearPortalWidth:5.2,clearPortalHeight:4.9,roofTieLevel:36.2,note:'C structural completion. Curved tracks and per-car motion continue behind real tunnel walls before temporal wrapping; no claimed narrative route terminus.'};
}
function addWing(root,d,p){
 var b=new Batch(root),i,x,z,targets=[],struct=[];
 function solid(name,mat,c,size,r){box(b,mat,c[0],c[1],c[2],size[0],size[1],size[2],r||0);struct.push({name:name,min:c.map(function(v,j){return v-size[j]/2;}),max:c.map(function(v,j){return v+size[j]/2;})});}
 function target(id,label,g,text,anchor,radius){g.name='grand-'+id;g.userData.descriptionId=id;targets.push({id:id,label:label,object:g,text:text,anchor:anchor,radius:radius||.3});}
 function group(){var g=new T.Group();root.add(g);return g;}
 // A coherent low wing grows from the rear edge of the monumental platform.
 box(b,p.reveal,-6,.78,17.1,52,.56,11.8,0);
 function wingPave(x0,x1,z0,z1){box(b,p.floor,(x0+x1)/2,1.1125,(z0+z1)/2,x1-x0,.075,z1-z0,0);}
 wingPave(-32,-31.36,11.2,23);wingPave(-31.10,20,11.2,23);wingPave(-31.36,-31.10,11.2,14.18);wingPave(-31.36,-31.10,22.62,23);
 solid('wing-rear-wall',p.wall,[-6,3.35,23],[52,4.4,.4],.014);
 solid('wing-west-wall',p.wall,[-32,3.35,17.1],[.4,4.4,11.8],.014);
 solid('wing-east-wall',p.wall,[20,3.35,17.1],[.4,4.4,11.8],.014);
 solid('wing-roof',p.wall,[-6,5.76,17.1],[52.4,.42,12.2],.018);
 solid('wing-ceiling',p.reveal,[-6,5.525,17.1],[52,.05,11.8],0);
 for(x=-32;x<=20;x+=13){solid('wing-roof-support',p.reveal,[x,3.3,11.5],[.38,4.3,.42],.008);solid('wing-roof-rib',p.reveal,[x,5.35,17.1],[.4,.30,11.4],.008);}
 // Bearing webs and foundation piers avoid the lower through line at z16.
 for(x=-31;x<=20;x+=13){solid('wing-floor-crossbeam',p.reveal,[x,.22,17.1],[.7,.76,11.8],.01);for(z=11.8;z<=23;z+=10.5)solid('wing-foundation',p.reveal,[x,-3.8625,z],[.8,7.425,.8],.012);}
 for(x=26;x<116;x+=4)box(b,p.rail,x,1.65,2.3,.055,1,.055,.006);box(b,p.rail,70.5,2.17,2.3,91,.06,.06,.008);
 // Fittings close the wall/floor junction without decorative clutter.
 box(b,p.reveal,-6,1.23,22.765,51.6,.16,.07,.004);
 box(b,p.reveal,-31.765,1.23,17.1,.07,.16,11.4,.004);
 for(x=-27;x<19;x+=9){box(b,p.reveal,x,5.09,22.72,5.8,.22,.32,.012);box(b,p.light,x,5.01,22.54,5.66,.06,.12,.004);localLight(root,0xd4d7cb,1.05,x,4.85,20.6,16);}
 // Two flights turn in a generous landing; no lift game or quest buttons.
 floor(b,p,-53.5,1.15,17.1,17,11.8);floor(b,p,-38.5,1.15,13.1,13,3.8);
 var n=19,rise=6.5/38,run=.3;
 for(i=0;i<n;i++){
  var y1=1.15+(i+1)*rise,y2=4.4+(i+1)*rise;
  box(b,p.floor,-58+(i+.5)*run,y1-.085,15.6,run,.17,2.4,.002);
  box(b,p.edge,-58+i*run+.022,y1-.014,15.6,.044,.028,2.4,.004);
  box(b,p.floor,-52.3-(i+.5)*run,y2-.085,20,run,.17,2.4,.002);
  box(b,p.edge,-52.3-i*run-.022,y2-.014,20,.044,.028,2.4,.004);
 }
 floor(b,p,-51.3,4.4,17.8,2,6.8);
 for(z=14.45;z<17;z+=2.3)lineBox(b,p.reveal,[-58,1.03,z],[-52.3,4.28,z],.14,.24);
 for(z=18.85;z<22;z+=2.3)lineBox(b,p.reveal,[-52.3,4.28,z],[-58,7.53,z],.14,.24);
 floor(b,p,-60,7.65,1.5,4,41);
 for(i=0;i<3;i++){z=[-18,3,22][i];solid('bridge-pier',p.reveal,[-60,-.2375,z],[.48,14.675,.48],.012);}
 for(x=-61;x<=-46;x+=15)for(z=12;z<=22;z+=10)solid('stair-foundation',p.reveal,[x,-3.4875,z],[.55,8.175,.55],.01);
 solid('stair-mid-pier',p.reveal,[-51.3,2.43,17.8],[.48,3.42,.48],.008);
 for(i=0;i<=6;i++){
  var sx=-58+i*.95,sy=1.15+(i*3+1)*rise;
  for(z=14.43;z<=16.78;z+=2.34)box(b,p.rail,sx,sy+.53,z,.045,1.06,.045,.007);
  for(z=18.83;z<=21.18;z+=2.34)box(b,p.rail,sx,7.65-i*3.1666666667*rise+.53,z,.045,1.06,.045,.007);
 }
 for(z=14.43;z<=16.78;z+=2.34)lineBox(b,p.rail,[-58,2.38105263158,z],[-52.3,5.46,z],.055,.055);
 for(z=18.83;z<=21.18;z+=2.34)lineBox(b,p.rail,[-52.3,5.46,z],[-58,8.71,z],.055,.055);
 for(z=-17;z<=21;z+=2){box(b,p.rail,-61.93,8.18,z,.045,1.06,.045,.005);if(z<17)box(b,p.rail,-58.07,8.18,z,.045,1.06,.045,.005);}
 box(b,p.rail,-61.93,8.71,1.5,.055,.055,40.8,.008);box(b,p.rail,-58.07,8.71,-1.5,.055,.055,34.8,.008);
 // v12: return all exposed handrail ends into a post or adjoining rail.
 function guard(a,c,y){lineBox(b,p.rail,[a[0],y+1.06,a[1]],[c[0],y+1.06,c[1]],.055,.055);var len=Math.sqrt(Math.pow(c[0]-a[0],2)+Math.pow(c[1]-a[1],2)),n=Math.ceil(len/1.5);for(var k=0;k<=n;k++){var t=k/n;box(b,p.rail,a[0]+(c[0]-a[0])*t,y+.53,a[1]+(c[1]-a[1])*t,.045,1.06,.045,.005);}}
 guard([-50.37,14.43],[-50.37,21.17],4.4);guard([-52.3,14.43],[-50.37,14.43],4.4);guard([-52.3,21.17],[-50.37,21.17],4.4);guard([-52.3,16.77],[-52.3,18.83],4.4);
 guard([-61.93,21.90],[-58.07,21.90],7.65);guard([-58.07,15.87],[-58.07,18.67],7.65);
 // Rail at the diverging platform ends in corner returns, not an unsupported overhang.
 guard([25.05,2.3],[25.05,3.1],1.15);guard([115.95,2.3],[115.95,11.13],1.15);
 // Safe closed deck ends; preserve the active boarding edges and bridge connection.
 guard([-91.93,1.87],[-91.93,11.13],1.15);guard([-91.93,-9.13],[-91.93,-1.87],1.15);guard([29.93,-9.13],[29.93,-1.87],1.15);
 guard([-91.93,-22.13],[-91.93,-16.32],7.65);guard([115.93,-22.13],[115.93,-16.32],7.65);
 guard([-91.93,17.87],[-91.93,23.93],-5.35);guard([115.93,17.87],[115.93,23.93],-5.35);
 guard([-91.8,11.13],[-62.07,11.13],1.15);guard([20.22,11.13],[115.93,11.13],1.15);
 // Bridge's 21 m bays have continuous longitudinal girders joining its piers.
 for(x=-61.7;x<=-58.3;x+=3.4)solid('bridge-longitudinal-girder',p.reveal,[x,6.74,1.5],[.26,.74,41],.01);
 for(i=0;i<3;i++){z=[-18,3,22][i];solid('bridge-pier-cap',p.reveal,[-60,6.55,z],[4,.34,.6],.008);}
 b.finish('grand-structural-wing-and-two-flight-stair');
 // The large map is physically fixed to the back wall of the waiting room.
 var mapG=group(),mb=new Batch(mapG);screen(mapG,mb,p,-8,3.54,22.775,7.4,2.85,[],PI,true);mb.finish('grand-map-recess');
 target('map','路線図',mapG,'細い線が幾重にも分かれ、分館の名が横へ続いている。表示面の下端には、指が触れる幅の硬い縁がある。',[-8,3.54,22.74],.4);
 // Waiting seats: matte woven pads, lower steel supports, quiet use creases.
 var cloth=material(0x547d73,.95,0,'cloth');cloth.userData.surface='cloth';cloth.envMapIntensity=.13;cloth.normalMap=null;
 var cv=document.createElement('canvas');cv.width=cv.height=256;var cx=cv.getContext('2d');cx.fillStyle='#aaa';cx.fillRect(0,0,256,256);for(i=0;i<256;i++){cx.fillStyle=i%4===0?'#5d5d5d':i%2?'#b5b5b5':'#909090';cx.fillRect(i,0,1,256);cx.fillStyle=i%4===0?'rgba(25,25,25,.32)':'rgba(235,235,235,.1)';cx.fillRect(0,i,256,1);}var tx=new T.CanvasTexture(cv);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(5,5);cloth.bumpMap=tx;cloth.bumpScale=.0014;cloth.map=null;cloth.roughnessMap=null;
 var seats=group(),sb=new Batch(seats);
 for(x=-17;x<=-1;x+=8){
  box(sb,p.reveal,x,1.37,18.5,3.6,.25,.83,.025);for(i=-1;i<=1;i+=2){box(sb,p.rail,x+i*1.4,1.245,18.5,.12,.19,.59,.012);}
  for(i=0;i<3;i++){var sx=x+(i-1)*1.12;var geo=boxGeo(1.09,.20,.76,.06),pa=geo.attributes.position;for(var k=0;k<pa.count;k++){var gx=pa.getX(k),gy=pa.getY(k),gz=pa.getZ(k);if(gy>.05)pa.setY(k,gy-.019*Math.exp(-Math.pow(gx/.31,2)-Math.pow((gz+.03)/.25,2)));}geo.computeVertexNormals();sb.add(geo,cloth,sx,1.59,18.42);box(sb,cloth,sx,1.98,18.81,1.09,.71,.20,.045);box(sb,p.reveal,sx,1.98,18.96,1.09,.74,.075,.015);}
 }
 sb.finish('grand-waiting-woven-seats');target('waiting','腰掛け',seats,'腰掛けの三つの座面を、青緑の布が覆っている。中央がわずかに沈み、背の下に浅い折れが残っている。',[-9,1.8,18.5],.3);
 // Supply recess: side/bottom/back are distinct surfaces, two finite packages.
 var supply=group(),sp=new Batch(supply);
 box(sp,p.wall,11,2.50,22.48,5.1,2.70,.5,.018);box(sp,p.reveal,11,2.02,22.19,2.08,.64,.15,.012);
 box(sp,p.dark,11,2.045,22.10,1.8,.43,.025,.005);box(sp,p.rail,11,1.82,21.91,1.90,.05,.42,.006);
 box(sp,p.edge,10.055,2.04,21.96,.055,.48,.30,.004);box(sp,p.edge,11.945,2.04,21.96,.055,.48,.30,.004);box(sp,p.edge,11,2.28,21.96,1.94,.045,.30,.004);
 var pkg=material(0xc6c4b3,.86,0,'paper');pkg.userData.surface='paper';pkg.normalMap=null;pkg.roughnessMap=null;pkg.map=null;pkg.envMapIntensity=.16;sp.add(filledPouch(),pkg,10.7,1.845,21.85);sp.add(filledPouch(),pkg,11.1,1.845,21.85);
 screen(supply,sp,p,11,3.03,22.198,2.75,.54,['給養　可'],PI,false);sp.finish('grand-supply-recess');
 target('supply','給養口',supply,'壁のくぼみに、同じ大きさの包が二つ載っている。中央は膨らみ、薄く合わされた縁の同じ位置に、小さな切欠きがある。',[11,2.09,21.9],.32);
 // Washing room: doorway thick return, low control, slotted spout and actual drain trough.
 var wash=group(),wb=new Batch(wash);
 box(wb,p.wall,-21,3.35,18.9,.32,4.4,8.2,.01);box(wb,p.wall,-27,5.03,13,10,.50,.4,.012);box(wb,p.wall,-31.4,3.1,13,1.2,3.9,.4,.012);box(wb,p.wall,-22.7,3.1,13,3.4,3.9,.4,.012);
 box(wb,p.reveal,-31.715,1.21,18.3,.06,.12,10,.004);
 // Raised wash paving connects by a 1:40 feather into the common floor, channel left real and open.
 
 
 box(wb,p.reveal,-31.23,1.077,18.4,.22,.034,8.36,.002);
 box(wb,p.rail,-31.355,1.11,18.4,.03,.08,8.4,.003);box(wb,p.rail,-31.105,1.11,18.4,.03,.08,8.4,.003);
 for(z=14.2;z<=22.6;z+=8.4)box(wb,p.rail,-31.23,1.11,z,.26,.08,.03,.003);
 box(wb,p.reveal,-31.65,2.0,18.3,.15,1.35,2.3,.01);screen(wash,wb,p,-31.555,1.75,18.3,.86,.27,['給水　可'],PI/2,false);
 box(wb,p.dark,-31.546,2.31,18.3,.02,.025,.16,.002);box(wb,p.rail,-31.493,2.29,18.3,.11,.019,.20,.004);
 // Broad shallow receiver belongs to the wall and drains directly into the one floor channel.
 box(wb,p.reveal,-31.4,1.31,18.3,.38,.12,.68,.028);box(wb,p.rail,-31.4,1.36,18.3,.34,.02,.62,.015);box(wb,p.rail,-31.4,1.39,17.995,.34,.04,.02,.003);box(wb,p.rail,-31.4,1.39,18.605,.34,.04,.02,.003);box(wb,p.rail,-31.56,1.39,18.3,.02,.04,.59,.003);box(wb,p.rail,-31.24,1.38,18.3,.02,.02,.56,.003);box(wb,p.dark,-31.235,1.37,18.3,.024,.015,.05,.001);
 wb.finish('grand-wash-opening-low-panel-and-drain');wash.name='grand-wash';/* Kept as a measured reflection contributor; no narrative target in adopted cuts. */
 // One small 41-layer trace at the column foot, preserved in natural size.
 var bundle=group(),pb=new Batch(bundle);for(i=0;i<41;i++)pb.add(foldedPouch(i),p.paper,14.12,0,8.55);
 pb.finish('grand-forty-one-folded-empty-pouches');target('bundle','柱の根もとの束',bundle,'薄い空包が畳まれ、柱の根もとに重ねてある。揃った縁の間に細い陰が入り、上の一枚だけが少し沈んでいる。',[14.12,1.20,8.55],.24);
 // Targets for the great structure and moving line are actual visible meshes.
 // Restrict the structural target to the actual far-row column in the fixed frame.
 // The station root keeps its identity; no transparent proxy or new shape is created.
 targets.push({id:'structure',label:'大きな柱',object:root,text:'柱の四つの面が、上の暗がりまで続いている。床の縁と橋の厚みが、その足もとで小さく見える。',anchor:[38,15,-32],radius:.5,hitRegion:[36.08,-7.5,-33.92,39.92,42,-30.08]});
 if(d.trains[0])target('trainLower','下の列車',d.trains[0],'下の線を列車が通る。車体の側面がホームの縁に沿って流れ、窓と扉の継ぎ目が順に過ぎる。',undefined,.4);
 if(d.trains[1])target('train','上を通る列車',d.trains[1],'上の線を列車が通る。窓の反射が梁の向こうへ移り、車端の細い継ぎ目が続いていく。',undefined,.4);
 CH.parts.grand.targets=targets;
 d.stationSection={rail:[-6.5,0,6.5],floor:[-5.35,1.15,7.65],carFloorAboveRail:1.15,carRoofAboveRail:3.77,carWidth:3.5,carMeasuredWidth:3.5268,platformHorizontalGap:.05,platformActualGap:.0366,wingFloor:1.15,wingCeiling:5.55,wingUnderside:.50,lowerTrainRoof:-2.73,bridgeFloor:7.65,bridgeBottom:7.10,bridgeGirderBottom:6.37,bridgeMainTrainRoofClearance:2.60};
 d.stairs={flights:2,risersPerFlight:19,totalRise:6.5,riser:rise,tread:.3,width:2.4,midLanding:[2,6.8],midLevel:4.4,topLevel:7.65,minHeadroom:5.22};
 d.wingBounds=[[-32,1.15,11.2],[20,5.97,23.2]];d.structuralBounds=struct;d.sourceSelection=['S7 skeleton and two-car trains','S2 folded pouches','S8 supply and enclosure vocabulary'];d.staticNoTrainBranch=true;d.branchPlatformRetreat={x:[25,116],frontZ:2.2,guardrailZ:2.3,reason:'20m-car rear swing at diverging turnout'};
}

}());
