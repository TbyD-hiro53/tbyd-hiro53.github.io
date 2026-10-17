"""Import the approved v10 landscape for a Cycles hybrid comparison.
No water or rotating discs are baked into the static scene.
"""
import bpy,json,math,base64,gc
import numpy as np
from pathlib import Path
from mathutils import Vector
D=Path('/tmp/confluence-v11');data=json.loads((D/'scene.json').read_text())
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=20;s.cycles.adaptive_min_samples=4;s.cycles.adaptive_threshold=.035;s.cycles.use_denoising=False;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.cycles.glossy_bounces=3;s.cycles.transparent_max_bounces=12;s.cycles.filter_width=.8
s.render.threads_mode='FIXED';s.render.threads=4;s.render.film_transparent=False
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
materials={}
def img(nodes,links,t,label):
 path=D/(label+'.png');path.write_bytes(base64.b64decode(t['png']));im=bpy.data.images.load(str(path));tex=nodes.new('ShaderNodeTexImage');tex.image=im
 coord=nodes.new('ShaderNodeTexCoord');mul=nodes.new('ShaderNodeVectorMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=(*t['repeat'],1);links.new(coord.outputs['UV'],mul.inputs[0]);links.new(mul.outputs[0],tex.inputs[0]);return tex
for ident,m in data['mats'].items():
 mat=bpy.data.materials.new(m['name'] or 'inquiry display');mat.use_nodes=True;n=mat.node_tree.nodes;l=mat.node_tree.links;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*m['color'],1);p.inputs['Roughness'].default_value=m['roughness'];p.inputs['Metallic'].default_value=m['metalness'];base=None
 if m['map']:
  tex=img(n,l,m['map'],ident);mix=n.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=(*m['color'],1);l.new(tex.outputs['Color'],mix.inputs[1]);base=mix.outputs[0]
  if m['alphaTest']:
   test=n.new('ShaderNodeMath');test.operation='GREATER_THAN';test.inputs[1].default_value=m['alphaTest'];l.new(tex.outputs['Alpha'],test.inputs[0]);l.new(test.outputs[0],p.inputs['Alpha'])
 if base:l.new(base,p.inputs['Base Color'])
 # Real surface response: mineral pores, weathered root grain, and softened
 # manufactured edges. Scale is in metres, not repeating screen-space noise.
 if not m['alphaTest']:
  coord=n.new('ShaderNodeNewGeometry');noise=n.new('ShaderNodeTexNoise');l.new(coord.outputs['Position'],noise.inputs['Vector']);noise.inputs['Scale'].default_value=35;noise.inputs['Detail'].default_value=3
  bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.22;bump.inputs['Distance'].default_value=.006;l.new(noise.outputs['Fac'],bump.inputs['Height'])
  name=m['name']
  if 'root' in name:
   scale=n.new('ShaderNodeVectorMath');scale.operation='MULTIPLY';scale.inputs[1].default_value=(5,5,.35);l.new(coord.outputs['Position'],scale.inputs[0]);l.new(scale.outputs[0],noise.inputs['Vector']);noise.inputs['Scale'].default_value=8;bump.inputs['Distance'].default_value=.018
  elif 'shore' in name:
   bump.inputs['Distance'].default_value=.012
  elif 'stone' in name or 'mineral' in name or 'palladium' in name:
   bevel=n.new('ShaderNodeBevel');bevel.inputs['Radius'].default_value=.006;bevel.samples=3;l.new(bevel.outputs['Normal'],bump.inputs['Normal'])
  l.new(bump.outputs['Normal'],p.inputs['Normal'])
  if 'shore' in name or 'root' in name or 'path' in name:
   macro=n.new('ShaderNodeTexNoise');l.new(coord.outputs['Position'],macro.inputs['Vector']);macro.inputs['Scale'].default_value=.7;macro.inputs['Detail'].default_value=3
   ramp=n.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.15;ramp.color_ramp.elements[0].color=(.76,.81,.82,1);ramp.color_ramp.elements[1].position=.85;ramp.color_ramp.elements[1].color=(1.05,1.05,1.04,1);l.new(macro.outputs['Fac'],ramp.inputs[0]);mul=n.new('ShaderNodeMixRGB');mul.blend_type='MULTIPLY';mul.inputs[0].default_value=1;mul.inputs[1].default_value=(*m['color'],1)
   if base:l.new(base,mul.inputs[1])
   l.new(ramp.outputs['Color'],mul.inputs[2]);l.new(mul.outputs[0],p.inputs['Base Color'])
 materials[ident]=mat
C=np.array([[1,0,0,0],[0,0,-1,0],[0,1,0,0],[0,0,0,1]],float)
for i,o in enumerate(data['meshes']):
 g=data['geos'][o['geo']];v=np.array(g['position'],np.float32).reshape(-1,3);idx=np.array(g['index'] if g['index'] is not None else np.arange(len(v)),np.int32).reshape(-1,3);M=C@np.array(o['matrix']).reshape(4,4).T;v=v@M[:3,:3].T+M[:3,3]
 geo=bpy.data.meshes.new(o['name']);geo.from_pydata(v.tolist(),[],idx.tolist());geo.update()
 if g['uv']:
  uv=np.array(g['uv'],np.float32).reshape(-1,2);geo.uv_layers.new().data.foreach_set('uv',uv[idx].ravel())
 geo.polygons.foreach_set('use_smooth',np.ones(len(idx),bool))
 if g['normal']:
  ns=np.array(g['normal'],np.float32).reshape(-1,3)@np.linalg.inv(M[:3,:3]);ns/=np.maximum(np.linalg.norm(ns,axis=1)[:,None],1e-8);geo.normals_split_custom_set(ns[idx].reshape(-1,3).tolist())
 for material in o['materials']:geo.materials.append(materials[material])
 ob=bpy.data.objects.new(o['name'],geo);s.collection.objects.link(ob);ob['record']=o['role'];print(i,o['name'],len(idx),flush=True)
del data;gc.collect()
world=bpy.data.worlds.new('blue diffuse sky');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.32,.47,.50,1);world.node_tree.nodes['Background'].inputs[1].default_value=.65;s.world=world
sun=bpy.data.lights.new('daylight','SUN');sun.energy=3.2;sun.color=(1,.94,.91);sun.angle=.055;ob=bpy.data.objects.new('daylight',sun);s.collection.objects.link(ob);ob.rotation_euler=Vector((.30,-.60,-.75)).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.objects.new('fixed eye',bpy.data.cameras.new('fixed eye'));s.collection.objects.link(cam);s.camera=cam;cam.data.clip_start=.05;cam.data.clip_end=2600
s.view_layers[0].use_pass_z=True;s.view_layers[0].cycles.denoising_store_passes=True
s.use_nodes=True;tree=s.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);out=tree.nodes.new('CompositorNodeOutputFile');out.base_path=str(D);out.format.file_format='OPEN_EXR';out.format.color_depth='32';out.file_slots.clear()
for name in ['Image','Denoising Normal','Denoising Albedo','Depth']:
 out.file_slots.new(name);tree.links.new(rl.outputs[name],out.inputs[name])
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'landscape.blend'))
print('BUILT',flush=True)
