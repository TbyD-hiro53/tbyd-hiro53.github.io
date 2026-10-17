import os
import bpy,numpy as np,math
from pathlib import Path
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v6'));bpy.ops.wm.open_mainfile(filepath=str(D/'earth-forest-v6.blend'));sc=bpy.context.scene
sc.cycles.use_denoising=False;sc.cycles.samples=40;sc.render.resolution_x=2048;sc.render.resolution_y=1024;sc.render.threads_mode='FIXED';sc.render.threads=4
cam=sc.camera;depth=next(n for n in sc.node_tree.nodes if n.type=='OUTPUT_FILE')
for station,eye in [(0,(0,1.55,-11.2)),(2,(0,1.55,14.1))]:
 cam.location=(eye[0],-eye[2],eye[1]);sc.render.filepath=str(D/f'forest-{station}.png');sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGB';depth.file_slots[0].path=f'depth-{station}-';bpy.ops.render.render(write_still=True)
 img=bpy.data.images.load(str(D/f'depth-{station}-0001.exr'));a=np.array(img.pixels[:],dtype=np.float32).reshape(sc.render.resolution_y,sc.render.resolution_x,4)[::-1,:,0].copy();np.save(str(D/f'depth-{station}.npy'),a);bpy.data.images.remove(img);print('FINISHED',station,flush=True)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'earth-forest-v6-packed.blend'))
