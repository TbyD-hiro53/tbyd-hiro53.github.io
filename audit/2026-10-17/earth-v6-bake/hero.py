import os
import bpy,numpy as np,math
from pathlib import Path
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v6'));bpy.ops.wm.open_mainfile(filepath=str(D/'earth-forest-v6.blend'));sc=bpy.context.scene
sc.cycles.use_denoising=False;sc.cycles.samples=48;sc.render.resolution_x=1536;sc.render.resolution_y=2048;sc.render.threads_mode='FIXED';sc.render.threads=4
cam=sc.camera;cam.data.type='PERSP';cam.data.sensor_fit='HORIZONTAL';cam.data.angle=math.radians(96);cam.location=(-.37,7.2,1.55);cam.rotation_euler=(math.pi/2,0,-math.pi/2)
depth=next(n for n in sc.node_tree.nodes if n.type=='OUTPUT_FILE');depth.file_slots[0].path='hero-depth-';sc.render.filepath=str(D/'hero.png');sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGB'
bpy.ops.render.render(write_still=True)
img=bpy.data.images.load(str(D/'hero-depth-0001.exr'));a=np.array(img.pixels[:],dtype=np.float32).reshape(sc.render.resolution_y,sc.render.resolution_x,4)[::-1,:,0].copy();np.save(str(D/'hero-depth.npy'),a);bpy.data.images.remove(img)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'earth-forest-v6-hero-packed.blend'));print('HERO DONE',flush=True)
