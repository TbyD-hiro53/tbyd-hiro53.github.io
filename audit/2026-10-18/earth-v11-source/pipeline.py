import subprocess,os
from pathlib import Path
D=Path('/tmp/earth-v11');env=dict(os.environ,PYTHONPATH='/tmp/h53-oidn',LD_LIBRARY_PATH='/tmp/h53-oidn/oidn/lib.linux.x64')
for key in ['3-rear','0-rear']:
 if all((Path('/workspace/tbyd-hiro53.github.io')/('earth-origin-material-v11-20261018-forest-'+key+suffix)).exists() for suffix in ['-color.jpg','-depth.png','-small-color.jpg','-small-depth.png']):continue
 with (D/(key+'.log')).open('w') as f:subprocess.run(['blender','-b','-t','4','--python-exit-code','1','--python',str(D/'render-doors.py'),'--',key],stdout=f,stderr=subprocess.STDOUT,check=True)
 subprocess.run(['python',str(D/'package-doors.py'),key],env=env,check=True)
print('DOORS PACKAGED',flush=True)
