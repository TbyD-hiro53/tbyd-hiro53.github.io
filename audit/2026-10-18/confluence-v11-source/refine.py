"""Solid near-root junctions, retaining far roots and leaf-bearing twigs."""
import bpy,bmesh,json,gc,math
import numpy as np
from pathlib import Path
D=Path('/tmp/confluence-v11');bpy.ops.wm.open_mainfile(filepath=str(D/'landscape.blend'));s=bpy.context.scene
data=json.loads((D/'scene.json').read_text());anchors=np.array([[(p['min'][0]+p['max'][0])/2,-(p['min'][2]+p['max'][2])/2] for p in data['parts'] if p['name']=='bank trunk']);del data;gc.collect()
eyes=np.array([[-1.65,-1.3],[-7.6,8.5],[11,-15]])
near=np.linalg.norm(anchors[:,None,:]-eyes[None,:,:],axis=2).min(axis=1)<32
groups={}
def mesh_object(name,v,faces,material):
 m=bpy.data.meshes.new(name);m.from_pydata(v.tolist(),[],faces.tolist());m.update();m.polygons.foreach_set('use_smooth',np.ones(len(faces),bool));m.materials.append(material);o=bpy.data.objects.new(name,m);s.collection.objects.link(o);return o
for name in ['water worn roots','silver blue root ridges']:
 ob=bpy.data.objects[name];m=ob.data;v=np.empty(len(m.vertices)*3,np.float32);m.vertices.foreach_get('co',v);v=v.reshape(-1,3);faces=np.empty(len(m.loops),np.int32);m.loops.foreach_get('vertex_index',faces);faces=faces.reshape(-1,3)
 _,first,inv=np.unique(np.round(v*100000).astype(np.int64),axis=0,return_index=True,return_inverse=True);unique=v[first];tri=inv[faces];parent=np.arange(len(unique))
 def find(a):
  while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
  return a
 for a,b,c in tri:
  ra=find(a)
  for other in [b,c]:
   rb=find(other)
   if ra!=rb:parent[rb]=ra
 labels=np.array([find(i) for i in range(len(unique))]);_,component=np.unique(labels,return_inverse=True);face_components=component[tri[:,0]];n=component.max()+1
 lo=np.full((n,3),np.inf);hi=np.full((n,3),-np.inf);np.minimum.at(lo,component,unique);np.maximum.at(hi,component,unique);counts=np.bincount(component);center=(lo+hi)/2
 distances=np.linalg.norm(center[:,None,:2]-anchors[None,:,:],axis=2);assignment=distances.argmin(axis=1);selected=near[assignment]&(distances.min(axis=1)<6)&~((counts<180)&(lo[:,2]>.8))
 for group in np.unique(assignment[selected]):
  take=selected[face_components]&(assignment[face_components]==group);idx=tri[take];used,new=np.unique(idx,return_inverse=True);groups.setdefault(int(group),[]).append((unique[used],new.reshape(-1,3)))
 keep=~selected[face_components];idx=faces[keep];used,new=np.unique(idx,return_inverse=True);rest=mesh_object(name+' preserved',v[used],new.reshape(-1,3),m.materials[0])
 if m.uv_layers:
  uv=np.empty(len(m.loops)*2,np.float32);m.uv_layers.active.data.foreach_get('uv',uv);rest.data.uv_layers.new().data.foreach_set('uv',uv.reshape(-1,3,2)[keep].ravel())
 normals=np.empty(len(m.corner_normals)*3,np.float32);m.corner_normals.foreach_get('vector',normals);rest.data.normals_split_custom_set(normals.reshape(-1,3,3)[keep].reshape(-1,3).tolist());ob.hide_render=True
 print(name,'components',n,'selected',int(selected.sum()),flush=True)
mat=bpy.data.materials.new('continuous weathered blue roots');mat.use_nodes=True;n=mat.node_tree.nodes;l=mat.node_tree.links;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(.13,.17,.18,1);p.inputs['Roughness'].default_value=.9;p.inputs['Metallic'].default_value=.015
coord=n.new('ShaderNodeNewGeometry');scale=n.new('ShaderNodeVectorMath');scale.operation='MULTIPLY';scale.inputs[1].default_value=(6,6,.35);l.new(coord.outputs['Position'],scale.inputs[0]);noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=8;noise.inputs['Detail'].default_value=3;l.new(scale.outputs[0],noise.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.22;bump.inputs['Distance'].default_value=.015;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal'])
for number,parts in sorted(groups.items()):
 vv=[];ff=[];offset=0
 for v,f in parts:vv.append(v);ff.append(f+offset);offset+=len(v)
 ob=mesh_object('fused root collar '+str(number),np.concatenate(vv),np.concatenate(ff),mat);bm=bmesh.new();bm.from_mesh(ob.data);boundary=[e for e in bm.edges if e.is_boundary]
 if boundary:bmesh.ops.holes_fill(bm,edges=boundary,sides=0)
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(ob.data);bm.free();bpy.context.view_layer.objects.active=ob;ob.select_set(True)
 mod=ob.modifiers.new('solid root intersections','REMESH');mod.mode='VOXEL';mod.voxel_size=.03 if np.linalg.norm(anchors[number]-eyes,axis=1).min()<15 else .045;mod.adaptivity=.08;mod.use_smooth_shade=True;mod.use_remove_disconnected=False
 bpy.ops.object.modifier_apply(modifier=mod.name)
 smooth=ob.modifiers.new('soft natural junctions','SMOOTH');smooth.factor=.35;smooth.iterations=3;bpy.ops.object.modifier_apply(modifier=smooth.name);ob.select_set(False)
 print('FUSED',number,len(ob.data.polygons),flush=True)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'landscape-roots.blend'));print('ROOTS DONE',flush=True)
