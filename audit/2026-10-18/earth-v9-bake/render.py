import os
import bpy,math,json,sys
from pathlib import Path
from mathutils import Vector
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v9'));D.mkdir(parents=True,exist_ok=True);kind=sys.argv[sys.argv.index('--')+1];bpy.ops.wm.open_mainfile(filepath=os.environ.get('EO_INTERIOR_SOURCE','/tmp/earth-v7/interior-final.blend') if kind=='interior' else os.environ.get('EO_FOREST_SOURCE','/tmp/earth-v6/earth-forest-v6-hero-packed.blend'));s=bpy.context.scene
s.cycles.samples=16;s.cycles.adaptive_min_samples=4;s.cycles.adaptive_threshold=.045;s.cycles.use_denoising=False;s.cycles.filter_width=.75
s.render.threads=4;s.render.threads_mode='FIXED';s.render.resolution_x=4096 if kind=='interior' else 3072;s.render.resolution_y=4096;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True
if kind=='interior':s.view_settings.exposure=-.85
else:s.camera.data.angle=math.radians(72)
s.use_nodes=True;tree=s.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);s.view_layers[0].cycles.denoising_store_passes=True;s.view_layers[0].use_pass_z=True;guides=tree.nodes.new('CompositorNodeOutputFile');guides.base_path=str(D);guides.format.file_format='OPEN_EXR';guides.format.color_depth='32';guides.file_slots.clear()
for label in ['Denoising Normal','Denoising Albedo','Depth']:
 guides.file_slots.new(label);tree.links.new(rl.outputs[label],guides.inputs[label])
s.camera.data.dof.use_dof=False
poses=[([0,1.55,-11.2],0,-.02),([-3.85,1.1,-2.05],-1.2,-.2),([0,1.55,14.1],0,-.1),([-.37,1.55,-7.2],math.pi/2,-.09)]
for i in ([0,1,3,2] if kind=='interior' else [4]):
 if (D/f'detail-{i}.png').exists():continue
 if kind=='interior':
  eye,yaw,pit=poses[i];s.camera.data.type='PERSP';s.camera.data.sensor_fit='HORIZONTAL';s.camera.data.angle=math.radians(82);s.camera.location=(eye[0],-eye[2],eye[1]);direction=Vector((math.sin(yaw)*math.cos(pit),-math.cos(yaw)*math.cos(pit),math.sin(pit)));s.camera.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
 s.render.filepath=str(D/f'detail-{i}.png')
 for j,slot in enumerate(guides.file_slots):slot.path=f'detail-{i}-'+['normal','albedo','depth'][j]+'-'
 bpy.ops.render.render(write_still=True);print('FINISHED',i,flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(D/(kind+'-4k.blend')))
