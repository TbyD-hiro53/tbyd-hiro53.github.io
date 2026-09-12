/* Window exterior exported from the revised packed Blender scene. r128, same-site assets. */
(function(){'use strict';
H53.applyOrigin=function(scene){return fetch('vacant-seat-v4-20260913-origin-scene-v3.json').then(function(r){if(!r.ok)throw Error('Origin source unavailable');return r.json();}).then(function(d){
 var removed=[];scene.traverse(function(o){if(/^room-0(2[2-9])$/.test(o.name))removed.push(o);});
 removed.forEach(function(o){o.parent.remove(o);o.geometry.dispose();});
 // No finite backdrop: far-depth sky directions ignore camera translation.
 var dirs=d.points.map(function(p){return new THREE.Vector3().fromArray(p.direction);});
 var sky=new THREE.Mesh(new THREE.SphereGeometry(1,16,8),new THREE.ShaderMaterial({
 uniforms:{directions:{value:dirs},pointColor:{value:new THREE.Color().fromArray(d.points[0].radiance)},pointRadius:{value:d.points[0].radius},backgroundColor:{value:new THREE.Color().fromArray(d.backgroundLinear)}},
 vertexShader:'varying vec3 vDirection;void main(){vDirection=position;vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.0);gl_Position=p.xyww;}',
 fragmentShader:'uniform vec3 directions[6];uniform vec3 pointColor;uniform float pointRadius;uniform vec3 backgroundColor;varying vec3 vDirection;void main(){vec3 dir=normalize(vDirection);float light=0.0;for(int i=0;i<6;i++){float angle=length(cross(dir,directions[i]));float w=max(fwidth(angle),0.00015);light+=step(0.0,dot(dir,directions[i]))*(1.0-smoothstep(0.00035-w,pointRadius+w,angle));}gl_FragColor=vec4(backgroundColor+pointColor*light,1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}',
 side:THREE.BackSide,depthWrite:false,depthTest:true,fog:false,extensions:{derivatives:true}}));
 sky.name='origin-directional-darkness';sky.frustumCulled=false;sky.renderOrder=-100;sky.userData.h53='window';scene.add(sky);
 var g=new THREE.BufferGeometry(),idx=[];d.ground.faces.forEach(function(f){idx.push(f[0],f[1],f[2],f[0],f[2],f[3]);});
 g.setAttribute('position',new THREE.Float32BufferAttribute([].concat.apply([],d.ground.positions),3));g.setAttribute('color',new THREE.Float32BufferAttribute([].concat.apply([],d.ground.radiance),3));g.setIndex(idx);g.computeVertexNormals();
 var ground=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,fog:false,side:THREE.DoubleSide}));ground.name='origin-flat-ground';scene.add(ground);
 scene.traverse(function(o){if(!o.isMesh)return;var m=o.material;if(!m||!(m.name==='room.glass'||m.name==='room.glass.edge'))return;
 // Dielectric reflection is retained; remove the opaque dark diffuse layer.
 m.color.set(0x000000);m.opacity=1;m.depthWrite=false;m.envMapIntensity=.45;m.metalness=0;
 m.onBeforeCompile=function(shader){shader.fragmentShader=shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
 'float glassF=.035+(.965)*pow(1.0-clamp(dot(normal,geometry.viewDir),0.0,1.0),5.0); diffuseColor.a=glassF; outgoingLight/=max(glassF,0.001);\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );');};
 m.customProgramCacheKey=function(){return 'origin-dielectric-v3';};m.needsUpdate=true;
 });
 scene.userData.originRevision={source:d.source,removed:removed.length,points:6,groundVertices:d.ground.positions.length};
 return d;
});};
})();
