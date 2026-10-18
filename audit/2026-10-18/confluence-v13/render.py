import bpy,sys,math,bmesh
import numpy as np
from pathlib import Path
from mathutils import Vector
D=Path('/workspace/render-work/confluence-v13');args=sys.argv[sys.argv.index('--')+1:];spot,kind=args[:2];scale=float(args[2]) if len(args)>2 else 1
idx=['gap','under','bank'].index(spot);eye=[[-1.65,2.23,1.3],[-7.6,2.23,-8.5],[11,2.25,15]][idx];yaw,pitch=[(28,-9),(-25,15),(83,-4)][idx];y,p=map(math.radians,(yaw,pitch));prefix=spot+'-'+kind
bpy.ops.wm.open_mainfile(filepath=str(D/'landscape-refined.blend'));s=bpy.context.scene;c=s.camera
s.render.threads=2;s.render.threads_mode='FIXED';s.cycles.samples=20;s.cycles.adaptive_min_samples=4;s.cycles.adaptive_threshold=.035;s.render.film_transparent=True
w,h={'pano':(4096,2048),'detail':(4096,4096),'mirror':(2048,1024)}[kind];w=int(w*scale);h=int(h*scale);s.render.resolution_x=w;s.render.resolution_y=h;s.render.resolution_percentage=100
c.location=(eye[0],-eye[2],eye[1]*(-1 if kind=='mirror' else 1))
f=np.array((math.sin(y)*math.cos(p),math.sin(p),-math.cos(y)*math.cos(p)),np.float32);right=np.array((math.cos(y),0,math.sin(y)),np.float32);up=np.cross(right,f)
if kind=='detail':
 c.data.type='PERSP';c.data.sensor_fit='HORIZONTAL';c.data.angle=math.radians(82);c.rotation_euler=Vector((f[0],-f[2],f[1])).to_track_quat('-Z','Y').to_euler()
else:c.data.type='PANO';c.data.panorama_type='EQUIRECTANGULAR';c.rotation_euler=(math.pi/2,0,0)
if kind=='mirror':
 for ob in list(s.objects):
  if ob.type!='MESH':continue
  bm=bmesh.new();bm.from_mesh(ob.data);bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=(0,0,.001),plane_no=(0,0,1),clear_inner=True,clear_outer=False);bm.to_mesh(ob.data);bm.free();ob.data.update()
# Exact source scene-linear sky, independently sampled for each camera.
sky=np.ones((h,w,4),np.float32);u=(np.arange(w,dtype=np.float32)+.5)/w
A=np.array((-.30,.75,-.60),np.float32);A/=np.linalg.norm(A);B=np.array((-.40,.83,-.57),np.float32);B/=np.linalg.norm(B)
def smooth(a,b,x):
 t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
for j in range(0,h,64):
 v=(np.arange(j,min(h,j+64),dtype=np.float32)+.5)/h
 if kind=='detail':
  q=f[None,None,:]+((u-.5)*2*math.tan(math.radians(41)))[None,:,None]*right+((.5-v)*2*math.tan(math.radians(41)))[:,None,None]*up;q/=np.linalg.norm(q,axis=2)[:,:,None]
 else:
  phi=(u-.5)*2*math.pi;lat=(.5-v)*math.pi;q=np.empty((len(v),w,3),np.float32);q[:,:,0]=np.cos(lat)[:,None]*np.sin(phi)[None,:];q[:,:,1]=np.sin(lat)[:,None];q[:,:,2]=-np.cos(lat)[:,None]*np.cos(phi)[None,:]
 hh=np.maximum(q[:,:,1],0);t=hh**.48;rgb=np.array((.32,.47,.50))*(1-t[:,:,None])+np.array((.055,.15,.23))*t[:,:,None];rgb+=np.exp(-abs(q[:,:,1])*17)[:,:,None]*np.array((.20,.19,.19));rgb+=(1-smooth(.00034,.00040,1-q@A))[:,:,None]*np.array((2,1.5,1.75));rgb+=(1-smooth(.00012,.00016,1-q@B))[:,:,None]*np.array((1.15,1.7,1.65));cloud=np.sin(q[:,:,0]*19+q[:,:,2]*8)*.5+np.sin(q[:,:,2]*24-q[:,:,0]*7)*.22;rgb+=np.array((.018,.025,.029))*cloud[:,:,None]*(1-hh[:,:,None])**3;sky[j:j+len(v),:,:3]=rgb
im=bpy.data.images.new('exact source sky',width=w,height=h,float_buffer=True);im.colorspace_settings.name='Linear Rec.709';im.pixels.foreach_set(np.ascontiguousarray(sky[::-1]).ravel());im.update();del sky
vl=s.view_layers[0];vl.use_pass_diffuse_direct=True;vl.use_pass_diffuse_color=True;vl.use_pass_glossy_direct=True;vl.use_pass_glossy_color=True
tr=s.node_tree;tr.nodes.clear();rl=tr.nodes.new('CompositorNodeRLayers');sk=tr.nodes.new('CompositorNodeImage');sk.image=im;over=tr.nodes.new('CompositorNodeAlphaOver');over.inputs[0].default_value=1;tr.links.new(sk.outputs['Image'],over.inputs[1]);tr.links.new(rl.outputs['Image'],over.inputs[2]);comp=tr.nodes.new('CompositorNodeComposite');tr.links.new(over.outputs[0],comp.inputs[0]);out=tr.nodes.new('CompositorNodeOutputFile');out.base_path=str(D);out.format.file_format='OPEN_EXR';out.format.color_depth='32';out.file_slots.clear()
passes={'image':over.outputs[0],'normal':rl.outputs['Denoising Normal'],'albedo':rl.outputs['Denoising Albedo'],'depth':rl.outputs['Depth']}
mults=[]
for typ in ['Diff','Gloss']:
 m=tr.nodes.new('CompositorNodeMixRGB');m.blend_type='MULTIPLY';m.inputs[0].default_value=1;tr.links.new(rl.outputs[typ+'Dir'],m.inputs[1]);tr.links.new(rl.outputs[typ+'Col'],m.inputs[2]);mults.append(m)
add=tr.nodes.new('CompositorNodeMixRGB');add.blend_type='ADD';add.inputs[0].default_value=1;tr.links.new(mults[0].outputs[0],add.inputs[1]);tr.links.new(mults[1].outputs[0],add.inputs[2]);passes['sun']=add.outputs[0]
for name,socket in passes.items():out.file_slots.new(name);out.file_slots[-1].path=prefix+'-'+name+'-';tr.links.new(socket,out.inputs[name])
# Save a small ACES-independent pilot PNG only for debugging; shipping uses linear EXR.
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.filepath=str(D/(prefix+'-pilot.png'));bpy.ops.render.render(write_still=True)
for name in passes:
 file=D/(prefix+'-'+name+'-0001.exr');im=bpy.data.images.load(str(file),check_existing=False);a=np.empty(w*h*4,np.float32);im.pixels.foreach_get(a);a=a.reshape(h,w,4)[::-1,:,:3].copy();np.save(D/(prefix+'-'+name+'.npy'),a);bpy.data.images.remove(im)
print('RENDERED',prefix,w,h,flush=True)
