import bpy,json,math,random
from mathutils import Vector
from pathlib import Path
D=Path('/tmp/confluence-v12');bpy.ops.wm.open_mainfile(filepath='/tmp/confluence-v11/landscape-refined.blend');s=bpy.context.scene
parts=json.load(open('/tmp/confluence-v11/scene.json'))['parts'];cards=[x for x in parts if x['name']=='attached baked bank foliage'];trunks=[x for x in parts if x['name']=='bank trunk'];bpy.data.objects['baked blue grey foliage'].hide_render=True
# The land's dark pockets receive real-time water at runtime.
# Replace the old crown geometry, preserving the low shore-root network.
import bmesh, numpy as np
roots=[];centers=[];treebases=[]
for p in trunks:
 lo,hi=p['min'],p['max'];height=hi[1]-lo[1]
 # The trunk's authored centreline is asymmetric; its foot is at the rear of its bounds.
 treebases.append((Vector(((lo[0]+hi[0])/2,-(lo[2]+hi[2])/2,.25)),height-.25))
for ob in list(s.objects):
 if ob.type=='MESH' and ob.name.startswith(('silver blue root ridges','fused root collar','water worn roots')):ob.hide_render=True
print('replace trees',len(treebases),flush=True)
verts=[];faces=[];materials=[];twigv=[];twigf=[]
def tube(points,r):
 start=len(twigv);n=12 if r>.04 else 7
 for i,p in enumerate(points):
  tangent=(points[min(i+1,len(points)-1)]-points[max(0,i-1)]).normalized();u=tangent.cross(Vector((0,0,1)))
  if u.length<.01:u=tangent.cross(Vector((0,1,0)))
  u.normalize();v=tangent.cross(u).normalized();rad=r*(1-.91*i/(len(points)-1))
  for k in range(n):twigv.append(tuple(p+rad*(1+.055*math.sin(k*6*math.pi/n+i*.37))*(u*math.cos(k*2*math.pi/n)+v*math.sin(k*2*math.pi/n))))
 for i in range(len(points)-1):
  for k in range(n):a=start+i*n+k;b=start+i*n+(k+1)%n;twigf.append((a,b,b+n,a+n))
 twigf.append(tuple(start+k for k in reversed(range(n))));twigf.append(tuple(start+(len(points)-1)*n+k for k in range(n)))
def leaf(base,direction,length,width,roll,mat):
 d=direction.normalized();side=d.cross(Vector((0,0,1)))
 if side.length<.01:side=d.cross(Vector((0,1,0)))
 side.normalize();up=side.cross(d).normalized();side2=side*math.cos(roll)+up*math.sin(roll);up2=side2.cross(d).normalized();start=len(verts)
 # Curved lanceolate blade; centre keel and curled edges retain a physical silhouette.
 for j in range(9):
  t=j/8;bulge=math.sin(math.pi*t)**.8;center=base+d*length*t+up2*length*(.13*math.sin(math.pi*t)-.12*t*t)
  for k in [-1,0,1]:verts.append(tuple(center+side2*k*width*bulge+up2*width*.17*abs(k)*bulge))
 for j in range(8):
  for k in range(2):a=start+j*3+k;faces.append((a,a+1,a+4,a+3));materials.append(mat)
# Uneven trunks and recursive branch junctions, with sprays rooted on actual tips.
for tree,(base,height) in enumerate(treebases):
 rng=random.Random(819+tree*43);family=tree%3;scale=height/5;angle=rng.uniform(0,math.tau);lean=Vector((math.cos(angle),math.sin(angle),0));side=Vector((-lean.y,lean.x,0));ps=[]
 for j in range(17):
  t=j/16;ps.append(base+Vector((0,0,height*t))+lean*(.18*height*t*t)+side*(.08*height*math.sin(t*4.1)*t))
 tube(ps,.32*scale)
 for rootIndex in range(rng.randrange(4,8)):
  ang=angle+rootIndex*2.399+rng.uniform(-.4,.4);rd=Vector((math.cos(ang),math.sin(ang),0));reach=scale*rng.uniform(1.5,2.8);rp=[]
  for j in range(11):
   t=j/10;rp.append(base+rd*reach*t+Vector((0,0,.35*scale*math.sin(math.pi*t)-.50*t)))
  tube(rp,.19*scale*rng.uniform(.7,1.2))
 roots.append((ps[-1],scale*.75));centers.append(base)
 for k in range(9+family):
  t=.26+k/(8+family)*.67;origin=ps[min(15,int(t*16))];ang=k*2.399+rng.uniform(-.45,.45)+angle;direction=Vector((math.cos(ang),math.sin(ang),0));reach=scale*rng.uniform(.8,1.5)*(1.35-t);rise=scale*rng.uniform(.25,.9)*[1.0,.55,1.25][family];reach*=[1.,1.3,.75][family];bp=[origin+direction*(reach*j/8)+Vector((0,0,rise*(j/8)**.8-.12*scale*(j/8)**2)) for j in range(9)];tube(bp,.055*scale*(1.2-t))
  for fork in range(3):
   origin2=bp[4+fork];a=ang+(fork-1)*.65;d=Vector((math.cos(a),math.sin(a),0));end=origin2+d*scale*rng.uniform(.35,.6)+Vector((0,0,scale*(.25 if family!=2 else -.1)));fp=[origin2.lerp(end,j/6)+Vector((0,0,.08*scale*math.sin(j/6*math.pi))) for j in range(7)];tube(fp,.012*scale);roots.append((end,scale));centers.append(base)
# Curved fine sprays and individual blades; silhouettes vary by growth pattern.
for idx,(root,scale) in enumerate(roots):
 rng=random.Random(871+idx*31);family=(idx//27)%3;theta=math.atan2(root.y-centers[idx].y,root.x-centers[idx].x)
 for b in range([5,6,5][family]):
  ang=theta+rng.uniform(-1.1,1.1);reach=rng.uniform(.25,.65)*scale;rise=rng.uniform(.10,.35)*scale;d=Vector((math.cos(ang),math.sin(ang),0));side=Vector((-d.y,d.x,0));ps=[]
  for j in range(11):
   t=j/10;ps.append(root+d*reach*t+Vector((0,0,rise*t-(.3 if family==2 else .08)*scale*t*t)))
  tube(ps,.005*scale)
  for j in range(2,11):
   for k in range(2 if family==1 else 1):
    sign=(-1 if j%2 else 1) if family!=1 else (-1 if k==0 else 1);base=ps[j];direction=(d*.5+side*sign*.8+Vector((0,0,rng.uniform(-.3,.3)))).normalized();length=rng.uniform(.10,.19)*scale;width=length*[.20,.11,.29][family];petiole=direction*.018*scale;tube([base,base+petiole],.0015*scale);leaf(base+petiole,direction,length,width,rng.uniform(-.6,.6),family*3+rng.randrange(3))
# Retain the canon's single remnant wall bound by roots, with closed tapered tubes.
wall=[[-15,.4,-6.9],[-15.2,1.05,-7.5],[-14.7,1.3,-7.8],[-14.1,.35,-8.1],[-13.7,-.3,-12.4]]
def wallroot(points,r):
 ps=[Vector((x,-z,y)) for x,y,z in points];smooth=[]
 for i in range(len(ps)-1):
  a,b=ps[max(i-1,0)],ps[i];c,d=ps[i+1],ps[min(i+2,len(ps)-1)]
  for j in range(8):
   t=j/8;smooth.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
 smooth.append(ps[-1]);tube(smooth,r)
wallroot(wall,.24)
for n in range(8):
 x=-16+n*.44;wallroot([[x,.18,-6.6],[x+.25,.6+.22*math.sin(n),-7.25],[x+.35,.85+.25*math.sin(n*2),-7.7],[x+.60,.15,-8.4],[x+.9,-.4,-10]],.10+.07*(n%3))
print('sprays',len(roots),'leaves',len(faces)//16,flush=True)
leafmats=[]
for fam in range(3):
 for tone in range(3):
  m=bpy.data.materials.new('living blue grey leaf '+str(fam)+'/'+str(tone));m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;p=n.get('Principled BSDF');shade=[.7,.9,1.08][tone];p.inputs['Base Color'].default_value=(.115*shade,.195*shade,.20*shade,1);p.inputs['Roughness'].default_value=.6;p.inputs['Subsurface Weight'].default_value=.09
  geo=n.new('ShaderNodeNewGeometry');noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=180;noise.inputs['Detail'].default_value=2;l.new(geo.outputs['Position'],noise.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.001;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal']);leafmats.append(m)
def mesh(name,v,f,mats,indices=None):
 me=bpy.data.meshes.new(name);me.from_pydata(v,[],f);me.update();ob=bpy.data.objects.new(name,me);s.collection.objects.link(ob)
 for m in mats:me.materials.append(m)
 for i,p in enumerate(me.polygons):p.use_smooth=True;p.material_index=indices[i] if indices else 0
 return ob
mesh('attached curved leaves - three growth patterns',verts,faces,leafmats,materials);bark=bpy.data.materials.get('continuous weathered blue roots');mesh('tapered living branchlets and petioles',twigv,twigf,[bark])
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'landscape-refined.blend'));print('VEGETATION READY',flush=True)
