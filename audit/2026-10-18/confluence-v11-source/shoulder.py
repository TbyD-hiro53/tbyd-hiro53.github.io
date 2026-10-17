import bpy,math
import numpy as np
from pathlib import Path
D=Path('/tmp/confluence-v11');bpy.ops.wm.open_mainfile(filepath=str(D/'landscape-roots.blend'));s=bpy.context.scene
quads=[];normals={};material=None
def key(p):return tuple(np.round(p[:2]*10000).astype(int))
for ob in list(s.objects):
 if ob.type!='MESH' or not ob.name.startswith('shore mineral'):continue
 m=ob.data;v=np.empty(len(m.vertices)*3,np.float32);m.vertices.foreach_get('co',v);v=v.reshape(-1,3);f=np.empty(len(m.loops),np.int32);m.loops.foreach_get('vertex_index',f);f=f.reshape(-1,3);z=v[f,2]
 hi=np.isclose(z,.57,atol=1e-5);lo=np.isclose(z,.275,atol=1e-5);mask=np.all(hi|lo,axis=1)&np.any(hi,axis=1)&np.any(lo,axis=1);chosen=np.flatnonzero(mask)
 if not len(chosen):continue
 assert len(chosen)%2==0 and np.all(chosen[1::2]==chosen[::2]+1)
 material=m.materials[0]
 for i in range(0,len(chosen),2):
  q=np.unique(v[f[chosen[i:i+2]]].reshape(-1,3),axis=0);top=q[np.isclose(q[:,2],.57,atol=1e-5)];bottom=q[np.isclose(q[:,2],.275,atol=1e-5)];assert len(top)==len(bottom)==2
  for a in top:
   b=bottom[np.linalg.norm(bottom[:,:2]-a[:2],axis=1).argmin()];n=b[:2]-a[:2];n/=np.linalg.norm(n);normals[key(a)]=normals.get(key(a),np.zeros(2))+n
  quads.append(top.copy())
 keep=~mask;idx=f[keep];used,new=np.unique(idx,return_inverse=True);mesh=bpy.data.meshes.new(ob.name+' without hard shoulder');mesh.from_pydata(v[used].tolist(),[],new.reshape(-1,3).tolist());mesh.update();mesh.materials.append(material);mesh.polygons.foreach_set('use_smooth',np.ones(len(idx),bool))
 uv=np.empty(len(m.loops)*2,np.float32);m.uv_layers.active.data.foreach_get('uv',uv);mesh.uv_layers.new().data.foreach_set('uv',uv.reshape(-1,3,2)[keep].ravel());ns=np.empty(len(m.corner_normals)*3,np.float32);m.corner_normals.foreach_get('vector',ns);mesh.normals_split_custom_set(ns.reshape(-1,3,3)[keep].reshape(-1,3).tolist());ob.data=mesh
 print('REMOVED SHOULDER',len(chosen),'triangles',flush=True)
verts=[];faces=[];lookup={}
def vertex(top,t,height):
 n=normals[key(top)];n=n/np.linalg.norm(n);x,y=top[:2]+n*1.35*t;z=height+.008*math.sin(x*1.7+math.sin(y*.8))*math.sin(y*1.2)*math.sin(math.pi*t);p=(float(x),float(y),float(z));k=tuple(round(a,5) for a in p)
 if k not in lookup:lookup[k]=len(verts);verts.append(p)
 return lookup[k]
for a,b in quads:
 left=[vertex(a,t,h) for t,h in zip([0,.25,.5,.75,1],[.57,.55,.43,.29,.22])];right=[vertex(b,t,h) for t,h in zip([0,.25,.5,.75,1],[.57,.55,.43,.29,.22])]
 for i in range(4):
  for tri in [(left[i],right[i],right[i+1]),(left[i],right[i+1],left[i+1])]:
   aa,bb,cc=[np.array(verts[j]) for j in tri]
   faces.append(tri if np.cross(bb-aa,cc-aa)[2]>0 else tuple(reversed(tri)))
mesh=bpy.data.meshes.new('continuous sunk road shoulder');mesh.from_pydata(verts,[],faces);mesh.update();mesh.polygons.foreach_set('use_smooth',np.ones(len(faces),bool));mesh.materials.append(material);mesh.uv_layers.new().data.foreach_set('uv',np.array([[verts[j][0]*.32,-verts[j][1]*.32] for f in faces for j in f],np.float32).ravel());ob=bpy.data.objects.new(mesh.name,mesh);s.collection.objects.link(ob)
bpy.ops.wm.save_as_mainfile(filepath=str(D/'landscape-refined.blend'));print('SHOULDER DONE',len(quads),flush=True)
