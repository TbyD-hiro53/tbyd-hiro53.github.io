import bpy,json,bmesh
from pathlib import Path
from mathutils import Vector
D=Path('/workspace/render-work/confluence-v13');bpy.ops.wm.open_mainfile(filepath='/workspace/render-work/confluence-v12/landscape-refined.blend');g=json.load(open(D/'land-geometry.json'))
def coords(p):return [(p[i],-p[i+2],p[i+1]) for i in range(0,len(p),3)]
def key(v):return tuple(round(x,4) for x in v)
def tri(v):return tuple(sorted(key(p) for p in v))
old=coords(g['old']['position']);keys={tri(old[i:i+3]) for i in range(0,len(old),3)};ob=bpy.data.objects['shore mineral'];bm=bmesh.new();bm.from_mesh(ob.data);selected=[f for f in bm.faces if tri([ob.matrix_world@v.co for v in f.verts]) in keys]
print('old triangles',len(keys),'matched',len(selected),flush=True);assert len(selected)==len(keys),(len(selected),len(keys))
bmesh.ops.delete(bm,geom=selected,context='FACES');bm.to_mesh(ob.data);bm.free();ob.data.update()
ps=coords(g['fixed']['position']);me=bpy.data.meshes.new('continuous land - sealed vegetation openings');me.from_pydata(ps,[],[(i,i+1,i+2) for i in range(0,len(ps),3)]);me.update();new=bpy.data.objects.new(me.name,me);bpy.context.scene.collection.objects.link(new);me.materials.append(bpy.data.materials['shore mineral']);uv=me.uv_layers.new(name='UVMap');uvs=g['fixed']['uv']
for p in me.polygons:
 for loop in p.loop_indices:
  i=me.loops[loop].vertex_index;uv.data[loop].uv=(uvs[i*2],uvs[i*2+1])
# Source land normals are flat per face, consistent with the imported original.
for p in me.polygons:p.use_smooth=False
# Verify every former opening is supported at terrain height, not at water level.
from mathutils.bvhtree import BVHTree
bpy.context.view_layer.update();tree=BVHTree.FromObject(new,bpy.context.evaluated_depsgraph_get());checks=[]
for x,z,rx,rz in [[19,14,1.35,.7],[29,18.1,1.8,.8],[43,18.1,2.,1.],[66,16.1,2.2,1.1],[-21,-11,1.4,.9]]:
 for dx,dz in [(0,0),(.5,0),(-.5,0),(0,.5),(0,-.5)]:
  loc,n,i,dist=tree.ray_cast(Vector((x+dx*rx,-z-dz*rz,10)),Vector((0,0,-1)));assert loc and .35<loc.z<.55,(x,z,loc);checks.append(list(loc))
(D/'geometry-checks.json').write_text(json.dumps({'oldTrianglesRemoved':len(selected),'closedSurfaceSamples':checks},indent=2));bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(D/'landscape-refined.blend'));print('CLOSED ALL FIVE OPENINGS',flush=True)
