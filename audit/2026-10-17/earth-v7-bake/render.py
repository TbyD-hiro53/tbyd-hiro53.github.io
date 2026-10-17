import os
import bpy,numpy as np,math,sys
from pathlib import Path
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v7'));D.mkdir(parents=True,exist_ok=True);bpy.ops.wm.open_mainfile(filepath=str(D/'interior.blend'));sc=bpy.context.scene
sc.cycles.samples=32;sc.cycles.adaptive_min_samples=4;sc.cycles.adaptive_threshold=.08;sc.cycles.diffuse_bounces=4;sc.cycles.max_bounces=6;sc.cycles.sample_clamp_indirect=4;sc.view_settings.exposure=-.85
sc.render.resolution_x=4096;sc.render.resolution_y=2048;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGBA';sc.render.threads_mode='FIXED';sc.render.threads=4
cam=sc.camera;cam.data.type='PANO';cam.data.panorama_type='EQUIRECTANGULAR';cam.rotation_euler=(math.pi/2,0,0);depth=next(n for n in sc.node_tree.nodes if n.type=='OUTPUT_FILE');depth.base_path=str(D)
eyes=[[0,1.55,-11.2],[-3.85,1.10,-2.05],[0,1.55,14.1],[-.37,1.55,-7.2]]
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['1']
for station in map(int,args):
 eye=eyes[station];cam.location=(eye[0],-eye[2],eye[1]);depth.file_slots[0].path=f'interior-{station}-depth-';sc.render.filepath=str(D/f'interior-{station}.png');bpy.ops.render.render(write_still=True)
 img=bpy.data.images.load(str(D/f'interior-{station}-depth-0001.exr'));a=np.array(img.pixels[:],dtype=np.float32).reshape(sc.render.resolution_y,sc.render.resolution_x,4)[::-1,:,0].copy();np.save(str(D/f'interior-{station}-depth.npy'),a);bpy.data.images.remove(img);print('FINISHED',station,flush=True)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'interior-final.blend'))
