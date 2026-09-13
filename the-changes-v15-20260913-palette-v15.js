/* THE CHANGES v14: material-specific palette. ES5 / Three r128.
   Call after QUALITY.configure and before its bake/probe pass. The approved
   tree, land and root environment are deliberately outside this module. */
(function () {
  'use strict';
  var T=window.THREE,CH=window.CH,PI=Math.PI,liveByRoot={};
  var P={
    sea:{wall:0xc9c3b5,floor:0xb2b1a6,edge:0xc3bdad,reveal:0x827b70,
      dry:0x927c63,soil:0x625c48,wet:0x3e4645,root:0x6b6355,
      cloth:0xa6a08d,bag:0x666b58},
    grand:{column:0x707e8b,girder:0x61717e,wall:0xcac9bd,
      floor:0x8c8e87,edge:0xb9b8aa,ceiling:0x435362,bed:0x363933,
      cloth:0x28585b},
    carriage:{shell:0x727f87,ceiling:0x616e78,floor:0x343d42,
      cloth:0x376d76,worn:0x668c8e,pipe:0x43656a,frame:0xaab4bb}
  };
  function linear(hex){return new T.Color(hex).convertSRGBToLinear();}
  function lum(c){return .2126*c.r+.7152*c.g+.0722*c.b;}
  function ancestor(o,name){while(o){if(o.name===name)return true;o=o.parent;}return false;}
  function inTrain(o){while(o){if(o.userData&&o.userData.h53log==='train'&&o.userData.dims&&o.userData.dims.cars)return true;o=o.parent;}return false;}
  function emitting(m){return m.emissive&&(m.emissive.r+m.emissive.g+m.emissive.b)>.02;}
  function finish(m,role,color,rough,metal,env){
    m.color.copy(linear(color));m.roughness=rough;m.metalness=metal;
    m.envMapIntensity=env;m.userData.palette14Role=role;
    m.userData.palette14Env=env;m.needsUpdate=true;
  }
  /* Identical roles still share one material. Custom shader hooks must survive
     the split between the great columns and the mineral wall of the low wing. */
  function own(o,role,cache){
    var old=o.material,k=old.uuid+'|'+role,m=cache[k];
    if(!m){m=old.clone();m.onBeforeCompile=old.onBeforeCompile;
      m.customProgramCacheKey=old.customProgramCacheKey;cache[k]=m;}
    o.material=m;return m;
  }
  function seaGround(o){
    var g=o.geometry,p=g.attributes.position,c=g.attributes.color;
    if(!c)return;var dry=linear(P.sea.dry),soil=linear(P.sea.soil),wet=linear(P.sea.wet),cc=new T.Color();
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    for(var i=0;i<p.count;i++){
      var x=p.getX(i),z=p.getZ(i),shore=3.4*Math.sin(x*.024)+.65*Math.sin(x*.071)+6.8*Math.exp(-Math.pow((x-48)/31,2))-3.1*Math.exp(-Math.pow((x+28)/24,2));
      var swale=-13.5-.075*x+3.5*Math.sin(x*.036);
      var inland=clamp((25-z)/24,0,1)*clamp(.28+.72*Math.exp(-Math.pow((z-swale)/15,2)),0,1);
      var damp=clamp((z-86-shore)/12,0,1);
      /* Broad soil colour follows the same continuous surface, with a smaller
         middle scale. It does not add objects or paint fictitious paths. */
      var variation=.98+.095*Math.sin(x*.028+z*.017)*Math.sin(z*.041-x*.019)+.055*Math.sin(x*.17+z*.11)*Math.cos(z*.23-x*.08);
      cc.copy(dry).lerp(soil,inland*.75).lerp(wet,damp).multiplyScalar(variation);
      c.setXYZ(i,cc.r,cc.g,cc.b);
    }
    c.needsUpdate=true;o.material.roughness=.97;o.material.envMapIntensity=.065;
    o.material.userData.palette14Role='warm dry soil to dark damp band';
  }
  function seaSky(o){
    var c=document.createElement('canvas');c.width=512;c.height=256;
    var ctx=c.getContext('2d'),gr=ctx.createLinearGradient(0,0,0,256);
    gr.addColorStop(0,'#808e97');gr.addColorStop(.46,'#b0b5b5');
    gr.addColorStop(.56,'#b0b5b5');gr.addColorStop(1,'#808b8d');
    ctx.fillStyle=gr;ctx.fillRect(0,0,512,256);
    var im=ctx.getImageData(0,0,512,256),x,y,k;
    for(y=0;y<256;y++)for(x=0;x<512;x++){
      k=(y*512+x)*4;var lon=x/512*PI*2,lat=y/256*PI;
      var cloud=.045*Math.sin(lon*3+.9*Math.sin(lat*4))*Math.sin(lat)+.027*Math.cos(lon*7-lat*3)*Math.sin(lat)*Math.sin(lat);
      im.data[k]*=1+cloud;im.data[k+1]*=1+cloud;im.data[k+2]*=1+cloud;
    }
    ctx.putImageData(im,0,0);var old=o.material.map,tx=new T.CanvasTexture(c);
    tx.encoding=T.sRGBEncoding;o.material.map=tx;o.material.needsUpdate=true;
    if(old)old.dispose();o.material.userData.palette14Role='cool neutral overcast';
  }
  function water(m){
    var old=m.onBeforeCompile,oldKey=m.customProgramCacheKey;
    m.onBeforeCompile=function(sh){
      old.call(this,sh);
      var from='vec3 waterSky=mix(vec3(.20,.225,.214),vec3(.66,.70,.674),farWater);';
      var to='vec3 waterSky=mix(vec3(.105,.157,.174),vec3(.66,.69,.70),farWater);';
      sh.fragmentShader=sh.fragmentShader.replace(from,to);
      sh.fragmentShader=sh.fragmentShader.replace(
        'outgoingLight=mix(vec3(.055,.065,.061),waterSky+vec3(facets*.10),fresnel*.80+.20)+reflectedLight.indirectSpecular*.22;',
        /* Grey water body stays neutral. Blue/green lives in reflected troughs,
           not as a claim that the novel's water is intrinsically blue-green. */
        'vec3 waterBody=vec3(.048,.052,.053); vec3 coolTrough=vec3(.014,.049,.054); float trough=clamp(-facets*2.6,0.,.52)*(1.-farWater); vec3 waterReflection=mix(waterSky,coolTrough,trough); outgoingLight=mix(waterBody,waterReflection+vec3(facets*.085),fresnel*.78+.22)+reflectedLight.indirectSpecular*.16;');
    };
    m.customProgramCacheKey=function(){return oldKey.call(this)+'-material-water-v14';};
    finish(m,'grey water with deep cool reflection',0x6b7375,.24,0,.40);
    m.fog=false;m.userData.palette14Water=true;
  }
  function sea(o,cache){
    if(o.name==='broad overcast sky'){seaSky(o);return;}
    var m=o.material,s=m.userData.surface||'',v=lum(m.color);
    if(m.userData.v8Ground){seaGround(o);return;}
    if(!m.isMeshStandardMaterial)return;
    if(m.userData.shoreWater){if(!m.userData.palette14Water)water(m);return;}
    if(s==='dry-short-grass'){
      /* Canon's short pale dry leaves retain their vertex variation. */
      m.color.copy(linear(0xf2e7c8));m.roughness=.98;m.envMapIntensity=.045;
      m.userData.palette14Role='pale dry coastal leaves';return;
    }
    if(s==='wall'||s==='incised-wall')finish(m,'warm mineral exterior and interior',P.sea.wall,.80,0,.24);
    else if(s==='floor'){
      if(v<.27)finish(m,'recessed floor joint',0x898473,.94,0,.06);
      else if(v>.49)finish(m,'honed mineral edge',P.sea.edge,.52,0,.36);
      else finish(m,'continuous mineral floor',P.sea.floor,.72,0,.20);
    }
    else if(s==='paint')finish(m,'mineral reveals and foundation',P.sea.reveal,.82,0,.17);
    else if(s==='soil')finish(m,'dark rail support bed',0x4d4942,.97,0,.07);
    else if(s==='root')finish(m,'dry exposed coastal root',P.sea.root,.96,0,.08);
    else if(s==='fracture')finish(m,'broken mineral core',0xa8a091,.96,0,.07);
    else if(s==='metal'){
      if(o.parent&&o.parent.name==='sea11 belongings')finish(m,'worn hard belongings',0x94918a,.53,.35,.42);
      else if(v>.3)finish(m,'rail head',0x939ca1,.29,.67,.64);
      else finish(m,'rail web and fastener',0x4d5355,.54,.50,.28);
    }
    else if(s==='paper')finish(m,'folded dry envelopes',0xc3bbab,.89,0,.12);
    else if(s==='folded-cloth')finish(m,'folded soft cloth',P.sea.cloth,.97,0,.07);
    else if(s==='woven-bag')finish(m,'worn woven bag',P.sea.bag,.98,0,.055);
    else if(s==='crack')finish(m,'existing hairline floor split',0x5b584d,.98,0,.025);
    /* Low connected face is a story object. Preserve its light and wording. */
  }
  function carMaterial(o,inside){
    var m=o.material,n=o.name,C=P.carriage;
    if(!m.isMeshStandardMaterial)return false;
    if(n==='shell'||/^doorPanel/.test(n))finish(m,inside?'dark satin interior skin':'light train shell',inside?C.shell:0xc9cbd0,inside?.46:.34,0,inside?.15:.52);
    else if(n==='ceiling')finish(m,inside?'quiet dark ceiling':'passing train ceiling',inside?C.ceiling:0xa9afb1,.76,0,inside?.09:.25);
    else if(n==='floor')finish(m,'rubber floor',inside?C.floor:0x495052,.84,0,inside?.065:.12);
    else if(n==='seat-cloth')finish(m,'deep blue-green woven seat',C.cloth,.99,0,inside?.14:.16);
    else if(n==='seat-worn')finish(m,'pale abraded seat fibres',C.worn,.97,0,inside?.12:.14);
    else if(n==='seat-pipe')finish(m,'soft seat piping',C.pipe,.96,0,inside?.11:.12);
    else if(n==='window-assembly'||n==='seat-frame'||n==='rack')finish(m,'brushed metallic frame',inside?C.frame:0xaeb8bd,inside?.40:.33,inside?.42:.47,inside?.18:.64);
    else if(n==='glass'){
      finish(m,'clear window with oblique reflection',0xd0d9dd,.065,0,inside?.30:.52);
      m.opacity=inside?.14:.16;
    }
    else return false;
    return true;
  }
  function grand(o,cache){
    var original=o.material,s=original.userData.surface||'',v=lum(original.color),m,n=o.name;
    if(!original.isMeshStandardMaterial)return;
    if(inTrain(o)){
      if(carMaterial(o,false))return;
      if(/^vehicle-/.test(n)){
        if(n==='vehicle-rubber')finish(original,'flexible train bellows',0x262e32,.97,0,.11);
        else if(n==='vehicle-dark')finish(original,'train underframe',0x38444d,.68,.27,.24);
        else if(n==='vehicle-tread')finish(original,'rolling wheel tread',0x9ba5a9,.25,.80,.74);
        else finish(original,'formed vehicle metal',n==='vehicle-rim'?0xb1bbc0:0x71818b,.34,.61,.60);
      }
      return;
    }
    if(emitting(original)){
      /* Existing warm-white bands; no new lights or emission cadence. */
      if(!original.emissiveMap){m=own(o,'warm-white-luminaire',cache);finish(m,'warm white luminaire',0xe0d3b9,.62,0,.12);m.emissive.copy(linear(0xffe9c6));}
      else{original.roughness=.62;original.envMapIntensity=.095;original.userData.palette14Role='legible lit information surface';}
      return;
    }
    var structure=n==='grand-one-great-column'||n==='S7 branched rails and forty-two metre columns';
    if(s==='wall'){
      m=own(o,structure?'main-column':'light-wall',cache);
      finish(m,structure?'blue-black monumental mineral column':'pale mineral facility wall',structure?P.grand.column:P.grand.wall,structure?.66:.79,0,structure?.42:.23);
    }
    else if(s==='paint'){
      var ceiling=structure&&v<.18;m=own(o,ceiling?'dark-ceiling':structure?'hall-girder':'wing-reveal',cache);
      finish(m,ceiling?'high dark ceiling':structure?'blue-black hall girders':'matte dark wing supports and ceiling',ceiling?P.grand.ceiling:structure?P.grand.girder:0x46515d,ceiling?.86:structure?.71:.80,0,ceiling?.18:structure?.35:.17);
    }
    else if(s==='floor'){
      m=own(o,v>.4?'honed-edge':'mineral-floor',cache);
      finish(m,v>.4?'honed platform edge':'quiet mineral platform',v>.4?P.grand.edge:P.grand.floor,v>.4?.48:.73,0,v>.4?.39:.22);
    }
    else if(s==='soil')finish(original,'closed dark rail support',P.grand.bed,.98,0,.055);
    else if(s==='metal')finish(original,v>.3?'polished rail head':'dark rail web',v>.3?0x9aa4aa:0x414b52,v>.3?.26:.59,v>.3?.70:.48,v>.3?.65:.25);
    else if(s==='cloth')finish(original,'deep blue-green waiting cloth',P.grand.cloth,.99,0,.11);
    else if(s==='paper')finish(original,'uncoloured folded or filled envelopes',0xc7c2b3,.90,0,.13);
  }
  function apply(root,place){
    if(root.userData.palette14Applied)return;
    var p=place.charAt(0)==='t'?'carriage':place,cache={},seen={},live=[];
    root.traverse(function(o){
      if(o.isPointLight&&p==='grand')o.color.copy(linear(0xffedd8));
      if(!o.isMesh||!o.material||Array.isArray(o.material))return;
      if(p==='sea')sea(o,cache);
      else if(p==='grand')grand(o,cache);
      else if(p==='carriage'&&ancestor(o,'journey-car'))carMaterial(o,true);
      var m=o.material;
      if(p==='carriage'&&ancestor(o,'journey-car')&&m.userData.palette14Role&&!seen[m.uuid]){seen[m.uuid]=true;live.push(m);}
    });
    liveByRoot[root.uuid]=live;root.userData.palette14Applied=true;
  }
  function tick(root){
    var list=liveByRoot[root.uuid]||[];
    for(var i=0;i<list.length;i++)list[i].envMapIntensity=list[i].userData.palette14Env;
  }
  CH.PALETTE14={apply:apply,tick:tick,colors:P,revision:'material-roles-2-visual-review'};
})();
