from pathlib import Path
import subprocess,os,sys,time
D=Path('/tmp/confluence-v11');env=dict(os.environ,PYTHONPATH='/tmp/h53-oidn',LD_LIBRARY_PATH='/tmp/h53-oidn/oidn/lib.linux.x64')
for spot in sys.argv[1:]:
 for kind in ['pano','detail','mirror']:
  prefix=spot+'-'+kind
  if (D/(prefix+'-packaged.json')).exists():continue
  if not (D/(prefix+'-sun.npy')).exists():
   with open(D/(prefix+'.log'),'w') as log:subprocess.run(['blender','-b','-t','3','--python',str(D/'render.py'),'--',spot,kind],stdout=log,stderr=subprocess.STDOUT,check=True)
  assert (D/(prefix+'-sun.npy')).exists(),prefix
  subprocess.run(['python',str(D/'package.py'),prefix],env=env,check=True)
 print('COMPLETE',spot,flush=True)
