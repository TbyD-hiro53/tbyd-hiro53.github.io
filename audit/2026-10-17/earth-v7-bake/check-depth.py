import bpy,numpy as np,math,json,os
from mathutils import Vector
from pathlib import Path
D=Path(os.environ.get('EO_BAKE_DIR','/tmp/earth-v7'));bpy.ops.wm.open_mainfile(filepath=str(D/'interior.blend'));sc=bpy.context.scene;dg=bpy.context.evaluated_depsgraph_get();rows=[]
eyes=[[0,1.55,-11.2],[-3.85,1.10,-2.05],[0,1.55,14.1],[-.37,1.55,-7.2]]
for station in range(4):
 if not (D/f'interior-{station}-depth.npy').exists():continue
 a=np.load(D/f'interior-{station}-depth.npy');h,w=a.shape;e=eyes[station];eye=Vector((e[0],-e[2],e[1]))
 for v in [.1,.25,.4,.55,.7,.85]:
  for u in [.1,.25,.4,.55,.7,.85]:
   x=int(u*w);y=int(v*h);phi=((x+.5)/w-.5)*2*math.pi;lat=(.5-(y+.5)/h)*math.pi;ray=Vector((math.sin(phi)*math.cos(lat),math.cos(phi)*math.cos(lat),math.sin(lat)));hit,loc,n,face,obj,mat=sc.ray_cast(dg,eye,ray)
   if hit:
    radial=(loc-eye).length;actual=float(a[y,x]);rows.append({'station':station,'pixel':[x,y],'object':obj.name,'radial':radial,'baked':actual,'error':abs(actual-radial)})
print(json.dumps({'count':len(rows),'maxError':max(r['error'] for r in rows)}),flush=True);(D/'depth-check.json').write_text(json.dumps(rows,indent=2));assert max(r['error'] for r in rows)<.025
