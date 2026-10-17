/* One classification for the browser compositor and the offline bake exporter. */
(function(){'use strict';
 window.EOStaticPartition=function(root){
  var face=EO.parts.face.M,dynamicMaterials=new Set(),statics=[],dynamic=[],decals=[];
  Object.keys(face).forEach(function(k){if(k.indexOf('disp_')===0||k.indexOf('leak_')===0||k==='cover')dynamicMaterials.add(face[k]);});
  root.children.forEach(function(group,part){
   if(part===4)return; // Forest has its own color/depth bake; its disc stays live.
   group.traverse(function(o){
    if((!o.isMesh&&!o.isPoints&&!o.isSprite)||o.name==='baked-static-interior')return;
    var ms=Array.isArray(o.material)?o.material:[o.material];
    if(part===3||o.isPoints||o.isSprite||ms.some(function(m){return dynamicMaterials.has(m);})){dynamic.push(o);return;}
    if(ms.some(function(m){return m.transparent&&!m.depthWrite;})){decals.push(o);return;}
    statics.push(o);
   });
  });
  return {statics:statics,dynamic:dynamic,decals:decals};
 };
})();
