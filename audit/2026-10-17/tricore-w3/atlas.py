from PIL import Image
from pathlib import Path
import json,numpy as np
r=Path('/workspace/tbyd-hiro53.github.io');rows={}
for v in ['main','brain','sanc']:
 a=Image.open(r/f'lacto-tricore-v1-w1-{v}-tank.png').convert('RGB');b=Image.open(r/f'lacto-tricore-v1-w1-{v}-vat.png').convert('RGB');W=max(a.width,b.width)+4;H=a.height+b.height+8
 out=Image.new('RGB',(W,H));out.paste(Image.fromarray(np.pad(np.asarray(a),((2,2),(2,2),(0,0)),mode='edge')),(0,0));out.paste(Image.fromarray(np.pad(np.asarray(b),((2,2),(2,2),(0,0)),mode='edge')),(0,a.height+4));out.save(r/f'lacto-tricore-v1-w3-{v}-lighting.png')
 rows[v]={'tank':[2/W,2/H,a.width/W,a.height/H],'vat':[2/W,(a.height+6)/H,b.width/W,b.height/H]}
(r/'lacto-tricore-v1-w3-lighting.json').write_text(json.dumps(rows,separators=(',',':')))
