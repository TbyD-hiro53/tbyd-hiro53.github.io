(function(){
 var T=THREE,m=__H53M,r=m.renderer,s=m.scene,root=s.children.find(o=>o.type==='Group'),dynamic=[],statics=[];
 var face=EO.parts.face.M,animated=Object.keys(face).filter(k=>/disp_|leak_/.test(k)).map(k=>face[k]);
 root.children[3].traverse(o=>{if(o.isMesh||o.isPoints||o.isSprite)dynamic.push(o)});
 root.traverse(o=>{if(!o.isMesh||dynamic.includes(o))return;
   if(o.userData.h53log==='disc'||animated.includes(o.material))dynamic.push(o);else statics.push(o);
 });
 var saved=statics.map(o=>[o,o.material,o.visible,o.renderOrder]);
 var oldVisibility=dynamic.map(o=>o.visible),cube,quad;
 window.Pilot={
  capture:function(size){
   var outsideVisible=root.children[4].visible;root.children[4].visible=true;dynamic.forEach(o=>o.visible=false);
   cube=new T.WebGLCubeRenderTarget(size,{encoding:T.sRGBEncoding,generateMipmaps:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
   var cam=new T.CubeCamera(.05,420,cube);cam.position.copy(m.camera.position);cam.update(r,s);
   dynamic.forEach((o,i)=>o.visible=oldVisibility[i]);root.children[4].visible=outsideVisible;return true;
  },
  image:function(i){var n=cube.width,bytes=new Uint8Array(n*n*4);r.readRenderTargetPixels(cube,0,0,n,n,bytes,i);
   var c=document.createElement('canvas');c.width=c.height=n;c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(bytes),n,n),0,0);return c.toDataURL('image/png').split(',')[1];},
  mode:function(on){
   if(quad){s.remove(quad);quad.geometry.dispose();quad.material.dispose();quad=null;}
   saved.forEach(v=>{var o=v[0];o.material=v[1];o.visible=v[2];o.renderOrder=v[3];});
   if(!on)return;
   saved.forEach(v=>{var o=v[0];function depth(mat){return new T.MeshBasicMaterial({colorWrite:false,depthWrite:true,side:mat.side,alphaTest:mat.alphaTest,map:mat.alphaTest?mat.map:null,alphaMap:mat.alphaMap});}
    var original=Array.isArray(v[1])?v[1]:[v[1]];
    if(original.every(mat=>mat.transparent&&!mat.depthWrite)){o.visible=false;return;}
    o.material=Array.isArray(v[1])?v[1].map(depth):depth(v[1]);o.renderOrder=-100;
   });
   quad=new T.Mesh(new T.PlaneGeometry(2,2),new T.RawShaderMaterial({
     uniforms:{pano:{value:cube.texture},invProjection:{value:m.camera.projectionMatrixInverse},cameraWorld:{value:m.camera.matrixWorld}},
     vertexShader:'precision highp float;attribute vec3 position;varying vec2 vUv;void main(){vUv=position.xy;gl_Position=vec4(position,1.);}',
     fragmentShader:'precision highp float;varying vec2 vUv;uniform samplerCube pano;uniform mat4 invProjection;uniform mat4 cameraWorld;void main(){vec4 a=invProjection*vec4(vUv,1.,1.);vec3 ray=mat3(cameraWorld)*normalize(a.xyz/a.w);gl_FragColor=textureCube(pano,ray);}',
     depthTest:false,depthWrite:false}));quad.frustumCulled=false;quad.renderOrder=-1000;s.add(quad);
  },
  bench:function(n){r.render(s,m.camera);r.getContext().finish();var start=performance.now();for(var i=0;i<n;i++)r.render(s,m.camera);r.getContext().finish();return {ms:(performance.now()-start)/n,calls:r.info.render.calls,triangles:r.info.render.triangles};}
 };
})();
