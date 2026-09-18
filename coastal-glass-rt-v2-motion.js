/* Exact RC1 curve and geometry adapter. The renderer owns materials and animation clock. */
(function (global) {
  'use strict';
  function array(buffer, descriptor) {
    return new (descriptor.type === 'Uint32' ? Uint32Array : Float32Array)(buffer, descriptor.byteOffset, descriptor.length);
  }
  function bezier(a, b, c, d, t) {
    const u = 1 - t; return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d;
  }
  function curveValue(keys, frame) {
    const n = keys.length / 7;
    if (frame <= keys[0]) return keys[1];
    if (frame >= keys[(n-1)*7]) return keys[(n-1)*7+1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (keys[mid*7] <= frame) lo = mid; else hi = mid; }
    const a = lo*7, b = hi*7, mode = keys[a+6];
    if (mode === 0) return keys[a+1];
    if (mode === 1) return keys[a+1] + (keys[b+1]-keys[a+1]) * ((frame-keys[a])/(keys[b]-keys[a]));
    // Source keys are Blender AUTO/BEZIER. Solve x(t), preserving original handles.
    let l = 0, r = 1, t = 0.5;
    for (let i=0;i<25;i++) { t=(l+r)*0.5; if (bezier(keys[a],keys[a+4],keys[b+2],keys[b],t)<frame) l=t; else r=t; }
    return bezier(keys[a+1],keys[a+5],keys[b+3],keys[b+1],(l+r)*0.5);
  }
  function prepare(data, buffer) {
    const objects = data.objects.map(o => ({ source:o, curves:o.curves.map(c => ({...c, values:array(buffer,c.keys)})) }));
    function poseAtFrame(frame) {
      const states = {};
      for (const o of objects) {
        const src=o.source, state={position:src.position.slice(),rotationEulerXYZ:src.rotationEulerXYZ.slice(),scale:src.scale.slice()};
        for (const c of o.curves) state[c.path==='location'?'position':c.path==='rotation_euler'?'rotationEulerXYZ':'scale'][c.component]=curveValue(c.values,frame);
        states[src.name]=state;
      }
      return states;
    }
    function applyPose(meshByName, seconds) {
      const frame=1+(((seconds%16)+16)%16)*24;
      const states=poseAtFrame(frame);
      for (const name of Object.keys(states)) {
        const mesh=meshByName[name]; if(!mesh) continue; const p=states[name];
        mesh.position.fromArray(p.position); mesh.rotation.set(p.rotationEulerXYZ[0],p.rotationEulerXYZ[1],p.rotationEulerXYZ[2],'XYZ'); mesh.scale.fromArray(p.scale);
      }
      return frame;
    }
    return {data,buffer,objects,poseAtFrame,applyPose};
  }
  function makeGeometry(THREE, descriptor, buffer) {
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(array(buffer,descriptor.position),3));
    g.setAttribute('normal',new THREE.BufferAttribute(array(buffer,descriptor.normal),3));
    g.setIndex(new THREE.BufferAttribute(array(buffer,descriptor.index),1));
    g.computeBoundingBox();g.computeBoundingSphere();return g;
  }
  function capRadiusLocal(data, cutZ) {
    const p=data.boundary.discRadialProfileZR;
    if(cutZ<=p[0][0] || cutZ>=p[p.length-1][0]) return 0;
    for(let i=1;i<p.length;i++) if(cutZ<=p[i][0]) {const t=(cutZ-p[i-1][0])/(p[i][0]-p[i-1][0]); return p[i-1][1]*(1-t)+p[i][1]*t;}
    return 0;
  }
  function makeUnitCapGeometry(THREE, sectors=384) {
    const positions=new Float32Array((sectors+1)*3),normals=new Float32Array((sectors+1)*3),indices=new Uint32Array(sectors*3);
    normals[2]=1;
    for(let i=0;i<sectors;i++){const a=2*Math.PI*i/sectors;positions[(i+1)*3]=Math.cos(a);positions[(i+1)*3+1]=Math.sin(a);normals[(i+1)*3+2]=1;indices[i*3]=0;indices[i*3+1]=i+1;indices[i*3+2]=((i+1)%sectors)+1;}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('normal',new THREE.BufferAttribute(normals,3));g.setIndex(new THREE.BufferAttribute(indices,1));return g;
  }
  global.CoastalGlassTransfer={array,curveValue,prepare,makeGeometry,capRadiusLocal,makeUnitCapGeometry};
  if(typeof module!=='undefined'&&module.exports)module.exports=global.CoastalGlassTransfer;
})(typeof window!=='undefined'?window:globalThis);
