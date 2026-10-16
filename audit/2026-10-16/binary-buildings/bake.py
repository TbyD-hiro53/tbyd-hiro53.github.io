import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector,Quaternion
ROOT=Path(__file__).resolve().parents[3];OUT=Path(__file__).resolve().parent;data=json.loads((ROOT/'binary-dusk-w3-20260906-scene.json').read_text());rows=json.loads((OUT/'buildings.json').read_text())
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False;scene.cycles.max_bounces=3;scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='Standard';scene.view_settings.look='None';scene.view_settings.exposure=0;scene.view_settings.gamma=1
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.32,.32,.32,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65

def mat(name,color,emission=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.67
 if emission:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission
 return m
wall=mat('pale clean unmarked wall',(.72,.70,.68));inside=mat('empty interior',(.40,.38,.36));door=mat('handleless door',(.62,.60,.58));strip=mat('ceiling band',(.8,.8,.77),.8)

def box(name,center,scale,material,parent=None,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=center);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 if bevel:
  m=o.modifiers.new('fine formed edge','BEVEL');m.width=bevel;m.segments=2;o.modifiers.new('weighted corner normals','WEIGHTED_NORMAL')
 if parent:o.parent=parent
 return o
# A single repeated module: four equal openings, handleless door, two empty rooms, ceiling band.
# All dimensions below are visual reconstruction, not dimensions stated by the novel.
module=bpy.data.objects.new('canon residential module',None);scene.collection.objects.link(module)
W,D,H=12,8,2.6;t=.18
parts=[]
def add(n,c,d,m=wall,b=.035):parts.append(box(n,c,d,m,module,b))
add('floor',(0,0,.07),(W,D,.14),inside)
add('roof',(0,0,H-.09),(W,D,.18))
add('rear wall',(0,D/2-t/2,H/2),(W,t,H))
add('left wall',(-W/2+t/2,0,H/2),(t,D,H))
# Front wall segments around four equal open windows. No invented glazing or labels.
window_centers=[-4.5,-1.5,1.5,4.5];window_w=1.65;bottom=.85;top=1.95
add('front sill wall',(0,-D/2+t/2,bottom/2),(W,t,bottom))
add('front lintel',(0,-D/2+t/2,(top+H)/2),(W,t,H-top))
last=-W/2
for k,x in enumerate(window_centers):
 lo=x-window_w/2
 if lo>last:add('window pier '+str(k),((last+lo)/2,-D/2+t/2,(bottom+top)/2),(lo-last,t,top-bottom))
 add('opening sill '+str(k),(x,-D/2+.06,bottom),(window_w+.12,.42,.1))
 last=x+window_w/2
add('last window pier',((last+W/2)/2,-D/2+t/2,(bottom+top)/2),(W/2-last,t,top-bottom))
# Right-hand door in the same place on every module; no handle.
for cy,dy in [(-2.35,3.3),(2.35,3.3)]:add('entry side wall',(W/2-t/2,cy,H/2),(t,dy,H))
add('entry head',(W/2-t/2,0,2.35),(t,1.4,.5))
add('flush handleless door',(W/2-.11,0,1.05),(.08,1.3,2.1),door,.02)
# The back room is separated by a partition with a walking opening.
for x,dx in [(-3.5,5),(3.5,5)]:add('room partition',(x,0,H/2),(dx,t,H),inside)
for y in [-2,2]:add('lit ceiling band',(0,y,H-.2),(9,.16,.04),strip,0)
# Duplicate module geometry into the existing visible building locations. Original roof silhouettes remain the compositing mask.
for i,row in enumerate(rows):
 parent=bpy.data.objects.new('residence %02d'%i,None);scene.collection.objects.link(parent);parent.location=(*row['center'],.12)
 angle=row['angle'];f=Vector((math.sin(angle),-math.cos(angle)));to_camera=Vector((-4-row['center'][0],30-row['center'][1]))
 if f.dot(to_camera)<0:angle+=math.pi
 parent.rotation_euler.z=angle
 large=row['z']>2;w,d=(11.6,8.9) if large else (6.6,4.5);height=2.44 if large else 1.48
 parent.scale=(w/W,d/D,height/H)
 for part in parts:
  o=part.copy();o.data=part.data;scene.collection.objects.link(o);o.parent=parent
# Original template is only used for a close-up reference render at the end.
for part in parts:part.hide_render=True
sun_data=bpy.data.lights.new('neutral grazing soft light','SUN');sun_data.energy=1.4;sun_data.angle=.12;sun=bpy.data.objects.new('neutral grazing soft light',sun_data);scene.collection.objects.link(sun);sun.rotation_euler=(.55,-.3,-.4)
cam_data=bpy.data.cameras.new('fixed artwork bake camera');cam=bpy.data.objects.new('fixed artwork bake camera',cam_data);scene.collection.objects.link(cam);scene.camera=cam
for name in ['landscape','portrait']:
 v=data['views'][name];c=v['camera'];w,h=v['surface']['width'],v['surface']['height'];cam.location=c['position'];cam.rotation_mode='QUATERNION';cam.rotation_quaternion=Quaternion(c['quaternion']);cam.data.type='PERSP';cam.data.sensor_fit='VERTICAL';cam.data.sensor_height=36;cam.data.lens=36/(2*math.tan(math.radians(c['verticalFov'])/2));cam.data.clip_end=20000
 scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.resolution_percentage=100;scene.render.filepath=str(OUT/(name+'-buildings.png'));bpy.ops.render.render(write_still=True)
print('BAKES_COMPLETE',flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'binary-dusk-w4-buildings.blend'))
