import os
import bpy, json, math, base64, os, sys
import numpy as np
from pathlib import Path
from mathutils import Vector
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v6'));data=json.loads((D/'forest.json').read_text());bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=64;sc.cycles.use_denoising=False;sc.cycles.transparent_max_bounces=16;sc.cycles.max_bounces=6;sc.cycles.diffuse_bounces=3;sc.render.threads_mode='FIXED';sc.render.threads=4
sc.render.resolution_x=3072;sc.render.resolution_y=1536;sc.render.resolution_percentage=100
sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast';sc.view_settings.exposure=.3
materials={}
for ident,m in data['mats'].items():
 mat=bpy.data.materials.new(m['name'] or ident);mat.use_nodes=True;n=mat.node_tree.nodes;l=mat.node_tree.links;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*m['color'],1);p.inputs['Roughness'].default_value=.86
 if m['map']:
  path=D/(ident+'.png');path.write_bytes(base64.b64decode(m['map']));tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(path));uv=n.new('ShaderNodeTexCoord');mapping=n.new('ShaderNodeVectorMath');mapping.operation='MULTIPLY';mapping.inputs[1].default_value=(*(m['repeat'] or [1,1]),1);l.new(uv.outputs['UV'],mapping.inputs[0]);l.new(mapping.outputs[0],tex.inputs[0]);mul=n.new('ShaderNodeMixRGB');mul.blend_type='MULTIPLY';mul.inputs[0].default_value=1;mul.inputs[2].default_value=(*m['color'],1);l.new(tex.outputs['Color'],mul.inputs[1]);l.new(mul.outputs[0],p.inputs['Base Color'])
  if m['alpha']:
   l.new(tex.outputs['Alpha'],p.inputs['Alpha']);p.inputs['Subsurface Weight'].default_value=.08;p.inputs['Subsurface Radius'].default_value=(.035,.06,.02)
 if not m['alpha']:
  noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=28;noise.inputs['Detail'].default_value=4;coord=n.new('ShaderNodeTexCoord');l.new(coord.outputs['Generated'],noise.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.32;bump.inputs['Distance'].default_value=.035;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal'])
 materials[ident]=mat
C=np.array([[1,0,0,0],[0,0,-1,0],[0,1,0,0],[0,0,0,1]],dtype=float)
for num,o in enumerate(data['meshes']):
 g=data['geos'][o['geo']];v=np.array(g['position'],dtype=np.float32).reshape(-1,3);idx=np.array(g['index'] if g['index'] is not None else range(len(v)),dtype=np.int32).reshape(-1,3);uv=np.array(g['uv'],dtype=np.float32).reshape(-1,2) if g['uv'] else np.zeros((len(v),2));verts=[];faces=[];uvs=[];material_indices=[]
 mids=np.zeros(len(idx),dtype=np.int32)
 for group in g['groups']:mids[group['start']//3:(group['start']+group['count'])//3]=group['materialIndex']
 for i,a in enumerate(o['transforms']):
  M=C@np.array(a).reshape(4,4).T;world=v@M[:3,:3].T+M[:3,3];verts.append(world);faces.append(idx+i*len(v));uvs.append(uv[idx].reshape(-1,2));material_indices.append(mids)
 verts=np.concatenate(verts);faces=np.concatenate(faces);uvs=np.concatenate(uvs);geo=bpy.data.meshes.new(o['name'] or 'mesh');geo.from_pydata(verts.tolist(),[],faces.tolist());geo.update();layer=geo.uv_layers.new();layer.data.foreach_set('uv',uvs.ravel());geo.polygons.foreach_set('use_smooth',np.ones(len(faces),dtype=bool));geo.polygons.foreach_set('material_index',np.concatenate(material_indices));obj=bpy.data.objects.new(o['name'] or 'forest',geo);sc.collection.objects.link(obj)
 for m in o['materials']:geo.materials.append(materials[m])
 print('mesh',num,o['name'],len(faces),flush=True)
# Overcast blue-green forest with one broad opening of light, all shadows baked.
world=bpy.data.worlds.new('cloud canopy');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.46,.62,.65,1);world.node_tree.nodes['Background'].inputs[1].default_value=.55;sc.world=world
ld=bpy.data.lights.new('canopy opening','AREA');ld.energy=21000;ld.shape='DISK';ld.size=24;lo=bpy.data.objects.new('canopy opening',ld);sc.collection.objects.link(lo);lo.location=(22,5,32);lo.rotation_euler=(Vector((12,4,0))-lo.location).to_track_quat('-Z','Y').to_euler()
ld=bpy.data.lights.new('sky direction','SUN');ld.energy=1.4;ld.angle=.15;lo=bpy.data.objects.new('sky direction',ld);sc.collection.objects.link(lo);lo.rotation_euler=(.35,-.4,-.7)
# Keep depth unambiguous: fog is composed from the baked distance by package.py.
camd=bpy.data.cameras.new('eye');camd.type='PANO';camd.panorama_type='EQUIRECTANGULAR';cam=bpy.data.objects.new('eye',camd);sc.collection.objects.link(cam);sc.camera=cam;cam.rotation_euler=(math.pi/2,0,0)
sc.view_layers[0].use_pass_z=True;sc.use_nodes=True;tree=sc.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);depth=tree.nodes.new('CompositorNodeOutputFile');depth.base_path=str(D);depth.format.file_format='OPEN_EXR';depth.format.color_depth='32';depth.format.color_mode='RGB';tree.links.new(rl.outputs['Depth'],depth.inputs[0])
bpy.ops.wm.save_as_mainfile(filepath=str(D/'earth-forest-v6.blend'))
for station,eye in [(3,(-.37,1.55,-7.2))]:
 cam.location=(eye[0],-eye[2],eye[1]);sc.render.filepath=str(D/f'forest-{station}.png');sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGB';depth.file_slots[0].path=f'depth-{station}-';bpy.ops.render.render(write_still=True)
 img=bpy.data.images.load(str(D/f'depth-{station}-0001.exr'));a=np.array(img.pixels[:],dtype=np.float32).reshape(sc.render.resolution_y,sc.render.resolution_x,4)[::-1,:,0].copy();np.save(str(D/f'depth-{station}.npy'),a);bpy.data.images.remove(img)
 print('FINISHED',station,flush=True)
