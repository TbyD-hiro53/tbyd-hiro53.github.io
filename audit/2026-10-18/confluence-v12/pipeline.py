from pathlib import Path
import subprocess,os,sys,fcntl,numpy as np
D=Path('/tmp/confluence-v12');env=dict(os.environ,PYTHONPATH='/workspace/.h53-tools/oidn',LD_LIBRARY_PATH='/workspace/.h53-tools/oidn/oidn/lib.linux.x64')
for request in sys.argv[1:]:
 spot,*selected=request.split(':')
 for kind in (selected or ['pano','detail','mirror']):
  prefix=spot+'-'+kind;expected={'pano':(2048,4096,3),'detail':(4096,4096,3),'mirror':(1024,2048,3)}[kind]
  def ready():
   try:return all(np.load(D/(prefix+'-'+name+'.npy'),mmap_mode='r').shape==expected for name in ['image','normal','albedo','depth','sun'])
   except (OSError,ValueError):return False
  with open(D/(prefix+'.lock'),'w') as lock:
   fcntl.flock(lock,fcntl.LOCK_EX)
   if (D/(prefix+'-packaged.json')).exists():continue
   if not ready():
    with open(D/(prefix+'.log'),'w') as log:subprocess.run(['blender','-b','-t','2','--python',str(D/'render.py'),'--',spot,kind],stdout=log,stderr=subprocess.STDOUT,check=True)
   assert ready(),prefix+' incomplete render passes'
   subprocess.run(['python',str(D/'package.py'),prefix],env=env,check=True)
 print('COMPLETE',spot,flush=True)
