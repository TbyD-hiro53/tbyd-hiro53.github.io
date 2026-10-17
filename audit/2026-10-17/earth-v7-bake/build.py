import os
import bpy, json, math, base64, os, sys
import numpy as np
from pathlib import Path
from mathutils import Vector
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v7'));D.mkdir(parents=True,exist_ok=True);data=json.loads((D/'interior.json').read_text());bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=48;sc.cycles.use_denoising=False;sc.cycles.adaptive_threshold=.05;sc.cycles.adaptive_min_samples=8;sc.cycles.max_bounces=8;sc.cycles.diffuse_bounces=5;sc.cycles.glossy_bounces=4;sc.render.threads_mode='FIXED';sc.render.threads=4
sc.render.film_transparent=True;sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast';sc.view_settings.exposure=0
materials={}
def image_node(n,l,t,label,noncolor=False):
 path=D/(label+'.png');path.write_bytes(base64.b64decode(t['png']));tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(path),check_existing=True)
 if noncolor:tex.image.colorspace_settings.name='Non-Color'
 uv=n.new('ShaderNodeTexCoord');mapping=n.new('ShaderNodeVectorMath');mapping.operation='MULTIPLY';mapping.inputs[1].default_value=(*t['repeat'],1);l.new(uv.outputs['UV'],mapping.inputs[0]);l.new(mapping.outputs[0],tex.inputs[0]);return tex
for ident,m in data['mats'].items():
 mat=bpy.data.materials.new(m['name'] or ident);mat.use_nodes=True;n=mat.node_tree.nodes;l=mat.node_tree.links;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*m['color'],1);p.inputs['Roughness'].default_value=m['roughness'];p.inputs['Metallic'].default_value=m['metalness'];p.inputs['Coat Weight'].default_value=m['coat'];p.inputs['Coat Roughness'].default_value=m['coatRough'];base=None
 if m['map']:
  tex=image_node(n,l,m['map'],ident+'-color');mul=n.new('ShaderNodeMixRGB');mul.blend_type='MULTIPLY';mul.inputs[0].default_value=1;mul.inputs[2].default_value=(*m['color'],1);l.new(tex.outputs['Color'],mul.inputs[1]);base=mul.outputs[0]
 if m['vertexColors']:
  attr=n.new('ShaderNodeVertexColor');attr.layer_name='sourceColor';mul=n.new('ShaderNodeMixRGB');mul.blend_type='MULTIPLY';mul.inputs[0].default_value=1;l.new(attr.outputs['Color'],mul.inputs[1]);mul.inputs[2].default_value=(*m['color'],1)
  if base:l.new(base,mul.inputs[2])
  base=mul.outputs[0]
 if base:l.new(base,p.inputs['Base Color'])
 if m['roughMap']:
  tex=image_node(n,l,m['roughMap'],ident+'-rough',True);mul=n.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=m['roughness'];l.new(tex.outputs['Color'],mul.inputs[0]);l.new(mul.outputs[0],p.inputs['Roughness'])
 if m['normalMap']:
  tex=image_node(n,l,m['normalMap'],ident+'-normal',True);norm=n.new('ShaderNodeNormalMap');norm.inputs['Strength'].default_value=sum(m['normalScale'])/2 if m['normalScale'] else .04;l.new(tex.outputs['Color'],norm.inputs['Color']);l.new(norm.outputs[0],p.inputs['Normal'])
 # Ceiling lenses glow but the calibrated area emitter supplies their indirect light.
 if m['emissiveIntensity']>0:
  p.inputs['Emission Color'].default_value=(*(m['emissive'] or [0,0,0]),1);p.inputs['Emission Strength'].default_value=m['emissiveIntensity']
  if m['emissiveMap']:
   tex=image_node(n,l,m['emissiveMap'],ident+'-emission');l.new(tex.outputs['Color'],p.inputs['Emission Color'])
 materials[ident]=mat
C=np.array([[1,0,0,0],[0,0,-1,0],[0,1,0,0],[0,0,0,1]],dtype=float)
for num,o in enumerate(data['meshes']):
 g=data['geos'][o['geo']];v=np.array(g['position'],dtype=np.float32).reshape(-1,3);idx=np.array(g['index'] if g['index'] is not None else range(len(v)),dtype=np.int32).reshape(-1,3);uv=np.array(g['uv'],dtype=np.float32).reshape(-1,2) if g['uv'] else np.zeros((len(v),2));verts=[];faces=[];uvs=[];normals=[];colors=[];mids=np.zeros(len(idx),dtype=np.int32);allmids=[]
 for group in g['groups']:mids[group['start']//3:(group['start']+group['count'])//3]=group['materialIndex']
 for i,a in enumerate(o['transforms']):
  M=C@np.array(a).reshape(4,4).T;world=v@M[:3,:3].T+M[:3,3];verts.append(world);faces.append(idx+i*len(v));uvs.append(uv[idx].reshape(-1,2));allmids.append(mids)
  ns=np.array(g['normal'],dtype=np.float32).reshape(-1,3) if g['normal'] else np.zeros_like(v);ns=ns@np.linalg.inv(M[:3,:3]);ns/=np.maximum(np.linalg.norm(ns,axis=1)[:,None],1e-8);normals.append(ns[idx].reshape(-1,3))
  co=np.array(g['color'],dtype=np.float32).reshape(-1,3) if g['color'] else np.ones_like(v)
  if o['colors']:co=co*np.array(o['colors'][i*3:i*3+3])
  colors.append(np.c_[co,np.ones(len(co))])
 verts=np.concatenate(verts);faces=np.concatenate(faces);geo=bpy.data.meshes.new(o['name']);geo.from_pydata(verts.tolist(),[],faces.tolist());geo.update();geo.uv_layers.new().data.foreach_set('uv',np.concatenate(uvs).ravel());geo.polygons.foreach_set('use_smooth',np.ones(len(faces),dtype=bool));geo.polygons.foreach_set('material_index',np.concatenate(allmids));geo.normals_split_custom_set(np.concatenate(normals).tolist());geo.color_attributes.new(name='sourceColor',type='FLOAT_COLOR',domain='POINT').data.foreach_set('color',np.concatenate(colors).ravel())
 obj=bpy.data.objects.new(o['name'],geo);sc.collection.objects.link(obj)
 for m in o['materials']:geo.materials.append(materials[m])
 print(num,o['name'],len(faces),flush=True)
world=bpy.data.worlds.new('soft exterior');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.43,.56,.58,1);world.node_tree.nodes['Background'].inputs[1].default_value=.22;sc.world=world
for i,light in enumerate(data['lights']):
 if light['type']!='SpotLight':continue
 ld=bpy.data.lights.new('ceiling-panel-'+str(i),'AREA');ld.energy=28 if light['intensity']<4 else 48;ld.shape='RECTANGLE';ld.size=.85;ld.size_y=.11;ld.color=(1,.93,.97);lo=bpy.data.objects.new(ld.name,ld);sc.collection.objects.link(lo);p=light['position'];lo.location=(p[0],-p[2],p[1]+.055)
# The reference chamber has no ceiling light; only the central display's low constant spill.
ld=bpy.data.lights.new('central-display-spill','AREA');ld.energy=.8;ld.shape='DISK';ld.size=.7;ld.color=(.66,.79,1);lo=bpy.data.objects.new(ld.name,ld);sc.collection.objects.link(lo);lo.location=(0,-15.9,.78);lo.rotation_euler=(math.pi,0,0)
camd=bpy.data.cameras.new('eye');cam=bpy.data.objects.new('eye',camd);sc.collection.objects.link(cam);sc.camera=cam
sc.view_layers[0].use_pass_z=True;sc.use_nodes=True;tree=sc.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);depth=tree.nodes.new('CompositorNodeOutputFile');depth.base_path=str(D);depth.format.file_format='OPEN_EXR';depth.format.color_depth='32';depth.format.color_mode='RGB';depth.file_slots[0].path='pilot-depth-';tree.links.new(rl.outputs['Depth'],depth.inputs[0])
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'interior.blend'))
camd.type='PERSP';camd.lens=28;cam.location=(-3.85,2.05,1.10);ya=-1.20;pi=-.20;direction=Vector((math.sin(ya)*math.cos(pi),-math.cos(ya)*math.cos(pi),math.sin(pi)));cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler();sc.render.resolution_x=1100;sc.render.resolution_y=800;sc.render.resolution_percentage=100;sc.cycles.samples=20;sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGBA';sc.render.filepath=str(D/'pilot.png');bpy.ops.render.render(write_still=True)
