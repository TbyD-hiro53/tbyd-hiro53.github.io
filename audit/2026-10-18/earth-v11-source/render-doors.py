import sys,os
if sys.argv[-1]=="0-side":sys.exit(0)
import bpy,math,sys,json,numpy as np
from pathlib import Path
from mathutils import Vector
D=Path(os.environ.get('H53_EARTH_OUTPUT','/tmp/earth-v11'));D.mkdir(exist_ok=True)
# Three.js eyes/yaws, independent perspectives covering the two exterior apertures.
poses={'0-rear':([0,1.55,-11.2],math.pi,82,3072,4096),'0-side':([0,1.55,-11.2],math.atan2(1,4),36,2048,2048),'3-rear':([-.37,1.55,-7.2],math.atan2(.37,-4.8),36,2048,2048)}
key=sys.argv[-1];eye,yaw,fov,w,h=poses[key]
bpy.ops.wm.open_mainfile(filepath=os.environ.get('H53_EARTH_SOURCE','/tmp/earth-v9/forest-4k.blend'));s=bpy.context.scene
s.cycles.samples=16;s.cycles.adaptive_min_samples=4;s.cycles.adaptive_threshold=.035;s.cycles.use_denoising=False;s.cycles.filter_width=.75
s.render.threads=4;s.render.threads_mode='FIXED';s.render.resolution_x=w;s.render.resolution_y=h;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True
cam=s.camera;cam.data.type='PERSP';cam.data.sensor_fit='HORIZONTAL';cam.data.angle=math.radians(fov);cam.data.dof.use_dof=False
cam.location=(eye[0],-eye[2],eye[1]);pitch=math.radians(-15 if key=='0-rear' else -6);direction=Vector((math.sin(yaw)*math.cos(pitch),-math.cos(yaw)*math.cos(pitch),math.sin(pitch)));cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
s.use_nodes=True;tree=s.node_tree;tree.nodes.clear();rl=tree.nodes.new('CompositorNodeRLayers');comp=tree.nodes.new('CompositorNodeComposite');tree.links.new(rl.outputs['Image'],comp.inputs[0]);s.view_layers[0].cycles.denoising_store_passes=True;s.view_layers[0].use_pass_z=True;guides=tree.nodes.new('CompositorNodeOutputFile');guides.base_path=str(D);guides.format.file_format='OPEN_EXR';guides.format.color_depth='32';guides.file_slots.clear()
for label,name in [('Denoising Normal','normal'),('Denoising Albedo','albedo'),('Depth','depth')]:
 guides.file_slots.new(label);tree.links.new(rl.outputs[label],guides.inputs[label]);guides.file_slots[-1].path=key+'-'+name+'-'
s.render.filepath=str(D/(key+'.png'));bpy.ops.render.render(write_still=True)
for name in ['normal','albedo','depth']:
 im=bpy.data.images.load(str(D/(key+'-'+name+'-0001.exr')));buf=np.empty(w*h*4,dtype=np.float32);im.pixels.foreach_get(buf);np.save(D/(key+'-'+name+'.npy'),buf.reshape(h,w,4)[::-1,:,:3]);bpy.data.images.remove(im)
(D/(key+'.json')).write_text(json.dumps({'eye':eye,'yaw':yaw,'pitch':pitch,'fov':fov,'width':w,'height':h,'samples':16}))
print('FINISHED',key,flush=True)
