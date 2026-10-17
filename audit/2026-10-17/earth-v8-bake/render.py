import os
import bpy,math,json,os
from pathlib import Path
from mathutils import Vector
D=Path(os.environ.get('EO_DETAIL_DIR','/tmp/earth-v8'));D.mkdir(parents=True,exist_ok=True);bpy.ops.wm.open_mainfile(filepath=os.environ.get('EO_INTERIOR_SOURCE','/tmp/earth-v7/interior-final.blend'));s=bpy.context.scene
s.cycles.samples=48;s.cycles.adaptive_min_samples=8;s.cycles.adaptive_threshold=.045;s.cycles.use_denoising=False
s.render.threads=4;s.render.threads_mode='FIXED';s.render.resolution_x=2048;s.render.resolution_y=2048;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True;s.view_settings.exposure=-.85
s.use_nodes=True;tree=s.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);s.view_layers[0].cycles.denoising_store_passes=True;guides=tree.nodes.new('CompositorNodeOutputFile');guides.base_path=str(D);guides.format.file_format='OPEN_EXR';guides.format.color_depth='32';guides.file_slots.clear();
for label in ['Denoising Normal','Denoising Albedo']:
 slot=guides.file_slots.new(label);tree.links.new(rl.outputs[label],guides.inputs[label])
s.camera.data.type='PERSP';s.camera.data.sensor_fit='HORIZONTAL';s.camera.data.angle=math.radians(82);s.camera.data.dof.use_dof=False
poses=[([0,1.55,-11.2],0,-.02),([-3.85,1.1,-2.05],-1.2,-.2),([0,1.55,14.1],0,-.1),([-.37,1.55,-7.2],math.pi/2,-.09)]
meta=[{'eye':p[0],'yaw':p[1],'pitch':p[2],'fov':82,'width':2048} for p in poses]
(D/'details.json').write_text(json.dumps(meta))
for i,(eye,yaw,pit) in enumerate(poses):
 if (D/f'detail-{i}.png').exists():continue
 s.camera.location=(eye[0],-eye[2],eye[1]);direction=Vector((math.sin(yaw)*math.cos(pit),-math.cos(yaw)*math.cos(pit),math.sin(pit)));s.camera.rotation_euler=direction.to_track_quat('-Z','Y').to_euler();s.render.filepath=str(D/f'detail-{i}.png');
 for j,slot in enumerate(guides.file_slots):slot.path=f'detail-{i}-'+['normal','albedo'][j]+'-';
 bpy.ops.render.render(write_still=True);print('FINISHED',i,flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(D/'interior-detail.blend'))
