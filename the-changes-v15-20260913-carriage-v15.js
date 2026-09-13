/* One carriage, two fixed compositions. Preserved approved tree and vehicle assets. */
(function(){'use strict';var CH=window.CH,T=THREE,j=CH.parts.journey,root=null,current='tree',lastTime=0,list=[],dict=CH.NARRATIVES11&&CH.NARRATIVES11.carriage||{};
var views=CH.CUTS14.carriage;
function key(id){return 't3';}
function add(id,obj,fallback){if(!obj)return;var d=dict[id]||{};list.push({id:'carriage.'+id,label:d.label||fallback[0],text:d.text||fallback[1],object:obj,radius:.20});}
function build(){if(root)return root;root=j.build();if(CH.parts.rootEnvironmentV12)CH.parts.rootEnvironmentV12.build(root);j.setSegment('t3');var parts=root.userData.parts,car=parts.car;var seats=[];car.traverse(function(o){if(o.isMesh&&(o.name==='seat-cloth'||o.name==='seat-worn'||o.name==='seat-frame'))seats.push(o);});/* Keep object parenting unchanged: each seat is a separately selectable part. */
for(var i=0;i<seats.length;i++)add('seat',seats[i],['座席','青緑の布が座面を包んでいる。端の織り目が、触れる場所で薄くなっている。']);
car.traverse(function(o){if(o.isMesh&&o.name==='window-assembly')add('window',o,['窓','窓枠の縁に淡い光が残っている。']);});add('tree',parts.tree,['巨大樹','太い根から幹が立ち上がり、枝の間に光る面が並んでいる。']);return root;}
function change(id,t){current=id;lastTime=t||0;j.viewChanged(id==='roots'?'roots':'window',lastTime);}
CH.parts.carriage={name:'車内',views:views,build:build,tick:function(t){j.tick(t);if(CH.parts.rootEnvironmentV12)CH.parts.rootEnvironmentV12.tick(t,current);lastTime=t;},viewChanged:change,qualityKey:key,lighting:j.lighting,env:j.env,mats:j.mats,dims:j.dims,targets:function(){return list.concat(CH.parts.rootEnvironmentV12?CH.parts.rootEnvironmentV12.targets():[]);}};
})();
