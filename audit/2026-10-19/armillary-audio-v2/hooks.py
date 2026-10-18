from pathlib import Path
import hashlib,json
R=Path('/workspace/tbyd-hiro53.github.io');rows=[]
for version in [1,2]:
 old=R/f'armillary-v{version}-w2-app.js';s=old.read_text();s=s.replace('var query=new URLSearchParams(location.search);', 'var query=new URLSearchParams(location.search);\n// Read-only audio observation: records existing bolt births, without consuming RNG or altering visuals.\nvar audioArcEvents=[],audioArcSequence=0;')
 needle='bt.br=0.5+rnd()*0.8;}'
 assert s.count(needle)==1
 s=s.replace(needle,"bt.br=0.5+rnd()*0.8;audioArcEvents.push({id:++audioArcSequence,time:clock.t,brightness:bt.br,position:bt.lines[0][0].toArray()});if(audioArcEvents.length>64)audioArcEvents.shift();}")
 needle='window.ArmillaryArtwork={report:function()'
 assert needle in s
 hook="""window.ArmillaryArtwork={audioState:function(){
  var h=holoSchedule(clock.t);
  return {sequence:audioArcSequence,arcIntensity:U.arc.value,
    sparks:camera?audioArcEvents.filter(function(e){return clock.t-e.time>=0&&clock.t-e.time<0.35;}).map(function(e){var p=new T.Vector3().fromArray(e.position),distance=p.distanceTo(camera.position),q=p.clone().project(camera);return {id:e.id,time:e.time,brightness:e.brightness,x:q.x,y:q.y,visible:q.z>-1&&q.z<1&&Math.abs(q.x)<1.05&&Math.abs(q.y)<1.05,distance:distance};}):[],
    rings:rings.map(function(r){return {rps:r.angular.length()/TAU,axis:r.angular.clone().normalize().toArray(),quaternion:r.holder.quaternion.toArray()};}),
    hologram:{name:h.cur,previous:h.prev,age:clock.t-h.tIn,cycle:HOLD+SWAP,transition:SWAP}};
},report:function()"""
 s=s.replace(needle,hook)
 name=f'armillary-v{version}-audio-v2-20261019-app.js';(R/name).write_text(s)
 p=R/'preview/20261017'/('armillary.html' if version==1 else 'armillary-v2.html');t=p.read_text().replace(old.name,name).replace('outdoor-audio-v1-20261019.js','armillary-audio-v2-20261019.js');p.write_text(t)
 rows.append({'file':name,'base':old.name,'baseSHA256':hashlib.sha256(old.read_bytes()).hexdigest(),'changes':'Add bounded bolt-birth observation list and read-only audioState; no shader, geometry, RNG, motion schedule or camera changes.'})
(R/'audit/2026-10-19/armillary-audio-v2/app-hooks.json').write_text(json.dumps(rows,indent=2))
