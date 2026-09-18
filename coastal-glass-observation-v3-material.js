/* Coastal Glass UI material — independent THREE r128 helper.
 * Feed the current frame's scene-linear Rec.709 HDR texture, before UI.
 * Draw after the artwork display pass. Do not feed the display framebuffer.
 * Inspired by optical principles, not Apple's proprietary implementation.
 */
(function (root) {
  'use strict';
  const T = root.THREE;
  if (!T) throw new Error('CoastalGlassUIMaterial requires THREE r128.');
  const vertex = 'void main(){gl_Position=vec4(position.xy,0.0,1.0);}';
  const fragment = `
precision highp float;
uniform sampler2D uScene,uAgx;
uniform vec2 uCssSize,uRenderSize;
uniform vec4 uRect;
uniform vec3 uPress;
uniform float uRadius,uPanel,uOpacity,uTransition,uExposure,uNight,uSimplified;

// NaN and infinity fail these comparisons. Negative radiance is clipped.
float clean(float x){return x>=0.0&&x<=1.0e20?min(x,65504.0):0.0;}
vec3 clean3(vec3 x){return vec3(clean(x.r),clean(x.g),clean(x.b));}
vec2 safeUV(vec2 uv){vec2 e=0.5/max(uRenderSize,vec2(1.0));return clamp(uv,e,1.0-e);}
vec3 sceneAt(vec2 uv){return clean3(texture2D(uScene,safeUV(uv)).rgb);}
vec2 cssOffsetUV(vec2 p){return vec2(p.x/uCssSize.x,-p.y/uCssSize.y);}

// Same 33^3 Blender AgX Medium Low Contrast LUT as the artwork final pass.
// LUT contains display sRGB. No later tone mapping / sRGB encoding is applied.
vec3 displayAgx(vec3 radiance){
  vec3 p=clamp((log2(max(radiance*exp2(uExposure),vec3(exp2(-16.0))))+16.0)/32.0,0.0,1.0)*32.0;
  float b0=floor(p.b),b1=min(b0+1.0,32.0);
  vec2 uv0=vec2((p.r+0.5+33.0*b0)/1089.0,(p.g+0.5)/33.0);
  vec2 uv1=vec2((p.r+0.5+33.0*b1)/1089.0,(p.g+0.5)/33.0);
  return mix(texture2D(uAgx,uv0).rgb,texture2D(uAgx,uv1).rgb,fract(p.b));
}
float roundedDistance(vec2 p,vec2 halfSize,float radius){
  vec2 q=abs(p)-max(halfSize-vec2(radius),vec2(0.0));
  return length(max(q,vec2(0.0)))+min(max(q.x,q.y),0.0)-radius;
}
vec2 edgeNormal(vec2 p,vec2 halfSize,float radius){
  vec2 q=abs(p)-max(halfSize-vec2(radius),vec2(0.0));
  vec2 direction=vec2(p.x>=0.0?1.0:-1.0,p.y>=0.0?1.0:-1.0);
  vec2 outside=max(q,vec2(0.0));
  float len=length(outside);
  if(len>0.0001)return direction*outside/len;
  return q.x>q.y?vec2(direction.x,0.0):vec2(0.0,direction.y);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRenderSize;
  vec2 pixel=vec2(uv.x,1.0-uv.y)*uCssSize;
  vec2 halfSize=uRect.zw*0.5,p=pixel-uRect.xy-halfSize;
  float radius=min(uRadius,min(halfSize.x,halfSize.y));
  float d=roundedDistance(p,halfSize,radius);
  float pixelSize=max(uCssSize.x/uRenderSize.x,uCssSize.y/uRenderSize.y);
  float aa=max(0.55,pixelSize*0.8);
  float mask=1.0-smoothstep(-aa,aa,d);
  float shadowD=roundedDistance(p-vec2(0.0,mix(2.0,4.0,uPanel)),halfSize,radius);
  float shadowWidth=mix(5.0,8.0,uPanel);
  float sd=max(shadowD,0.0)/shadowWidth;
  float shadow=exp(-sd*sd)*mix(0.16,0.23,uPanel)*(1.0-mask)*uTransition;
  if(mask<0.001&&shadow<0.001)discard;

  vec3 color;
  if(uSimplified>0.5){
    // Opaque, readable display-space fill. No refraction or source sampling.
    color=mix(vec3(0.105,0.125,0.155),vec3(0.065,0.078,0.105),uNight);
  }else{
    vec2 normal=edgeNormal(p,halfSize,radius);
    float inside=max(-d,0.0);
    float bevelWidth=clamp(radius*0.32,3.5,10.0);
    float bevel=exp(-inside/bevelWidth);
    vec2 pressCenter=(uPress.xy-0.5)*uRect.zw;
    vec2 pressDelta=p-pressCenter;
    float pressRadius=clamp(min(uRect.z,uRect.w)*0.8,24.0,100.0);
    float pressFalloff=exp(-dot(pressDelta,pressDelta)/(pressRadius*pressRadius));
    float press=uPress.z*pressFalloff;
    // Directional lensing is concentrated at the curved rim. No time wave.
    vec2 bend=-normal*bevel*clamp(1.7+radius*0.12,2.0,7.5);
    bend-=pressDelta/max(pressRadius,1.0)*press*3.0;
    bend*=uTransition;
    vec2 sampleUV=uv+cssOffsetUV(bend);
    vec3 radiance=sceneAt(sampleUV);
    if(uPanel>0.001){
      // Fixed, symmetric linear-light scatter keeps text legible on a panel.
      vec2 spread=cssOffsetUV(vec2(4.5,4.5));
      vec3 soft=radiance*0.4;
      soft+=sceneAt(sampleUV+vec2(spread.x,0.0))*0.15;
      soft+=sceneAt(sampleUV-vec2(spread.x,0.0))*0.15;
      soft+=sceneAt(sampleUV+vec2(0.0,spread.y))*0.15;
      soft+=sceneAt(sampleUV-vec2(0.0,spread.y))*0.15;
      radiance=mix(radiance,soft,0.72*uTransition*uPanel);
    }
    color=displayAgx(radiance);
    float brightness=dot(color,vec3(0.2126,0.7152,0.0722));
    float bright=smoothstep(0.20,0.78,brightness);
    float tint=mix(0.065+0.16*bright,0.30+0.24*bright,uPanel);
    tint*=mix(1.0,0.78,uNight)*uTransition;
    color=mix(color,mix(vec3(0.075,0.11,0.16),vec3(0.04,0.06,0.095),uNight),tint);
    float lit=max(dot(normal,vec2(-0.4472136,-0.8944272)),0.0);
    float rim=exp(-abs(d+0.65)/max(0.65,pixelSize))*mask;
    float highlight=(0.045+0.20*lit*lit+0.075*press)*rim;
    float inner=exp(-inside/max(2.0,bevelWidth*0.7))*0.024;
    color+=(highlight+inner+0.022*press)*mix(vec3(0.91,0.96,1.0),vec3(0.47,0.64,0.92),uNight)*uTransition;
  }
  float coverage=mask*uOpacity;
  float alpha=coverage+shadow*uOpacity;
  // Premultiplied display RGB; black shadow is included in alpha only.
  gl_FragColor=vec4(clamp(color,0.0,1.0)*coverage,clamp(alpha,0.0,1.0));
}
`;
  const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
  const unit = (value, fallback) => Math.min(1, Math.max(0, finite(value, fallback)));

  class CoastalGlassUIMaterial {
    constructor(renderer, agxTexture) {
      if (!renderer || !agxTexture) throw new Error('renderer and the artwork AgX LUT are required.');
      this.renderer=renderer;
      this.uniforms={
        uScene:{value:null},uAgx:{value:agxTexture},
        uCssSize:{value:new T.Vector2(1,1)},uRenderSize:{value:new T.Vector2(1,1)},
        uRect:{value:new T.Vector4()},uPress:{value:new T.Vector3(0.5,0.5,0)},
        uRadius:{value:20},uPanel:{value:0},uOpacity:{value:1},uTransition:{value:1},
        uExposure:{value:0},uNight:{value:0},uSimplified:{value:0}
      };
      this.material=new T.ShaderMaterial({
        uniforms:this.uniforms,vertexShader:vertex,fragmentShader:fragment,
        transparent:true,premultipliedAlpha:true,blending:T.CustomBlending,
        blendEquation:T.AddEquation,blendSrc:T.OneFactor,blendDst:T.OneMinusSrcAlphaFactor,
        blendEquationAlpha:T.AddEquation,blendSrcAlpha:T.OneFactor,blendDstAlpha:T.OneMinusSrcAlphaFactor,
        depthTest:false,depthWrite:false,toneMapped:false
      });
      this.geometry=new T.PlaneBufferGeometry(2,2);
      this.scene=new T.Scene();this.camera=new T.Camera();
      this.mesh=new T.Mesh(this.geometry,this.material);this.mesh.frustumCulled=false;
      this.scene.add(this.mesh);
      this.savedViewport=new T.Vector4();this.savedScissor=new T.Vector4();
      this.disposed=false;this.lastDrawCalls=0;
    }

    // Rects are CSS pixels relative to the canvas, with a top-left origin.
    // press.xy is [0,1] within that rect; transition controls optical intensity.
    draw(sourceLinearTexture, exposure, cssWidth, cssHeight, renderWidth, renderHeight, surfaces, night, simplified) {
      this.lastDrawCalls=0;
      if(this.disposed||!surfaces||!surfaces.length||(!sourceLinearTexture&&!simplified))return 0;
      if(!Number.isFinite(cssWidth)||!Number.isFinite(cssHeight)||!Number.isFinite(renderWidth)||!Number.isFinite(renderHeight)||cssWidth<=0||cssHeight<=0||renderWidth<1||renderHeight<1)return 0;
      const r=this.renderer,u=this.uniforms,ratio=r.getPixelRatio();
      u.uScene.value=sourceLinearTexture;u.uExposure.value=Math.max(-16,Math.min(16,finite(exposure,0)));
      u.uCssSize.value.set(cssWidth,cssHeight);u.uRenderSize.value.set(renderWidth,renderHeight);
      u.uNight.value=unit(night===true?1:night,0);u.uSimplified.value=simplified?1:0;
      const target=r.getRenderTarget(),cube=r.getActiveCubeFace(),mip=r.getActiveMipmapLevel();
      r.getViewport(this.savedViewport);r.getScissor(this.savedScissor);
      const scissorTest=r.getScissorTest(),autoClear=r.autoClear;
      const sx=renderWidth/cssWidth,sy=renderHeight/cssHeight;
      try{
        r.setRenderTarget(null);r.setViewport(0,0,renderWidth/ratio,renderHeight/ratio);
        r.setScissorTest(true);r.autoClear=false;
        for(let i=0;i<surfaces.length;i++){
          const s=surfaces[i],rect=s&&s.rect;
          if(!rect||rect.length<4||!Number.isFinite(rect[0])||!Number.isFinite(rect[1])||!Number.isFinite(rect[2])||!Number.isFinite(rect[3])||rect[2]<=0||rect[3]<=0)continue;
          const opacity=unit(s.opacity,1);if(opacity<=0)continue;
          const panel=s.kind==='panel',padding=panel?28:18;
          const left=Math.max(0,Math.floor((rect[0]-padding)*sx));
          const right=Math.min(renderWidth,Math.ceil((rect[0]+rect[2]+padding)*sx));
          const bottom=Math.max(0,Math.floor((cssHeight-rect[1]-rect[3]-padding)*sy));
          const top=Math.min(renderHeight,Math.ceil((cssHeight-rect[1]+padding)*sy));
          if(right<=left||top<=bottom)continue;
          r.setScissor(left/ratio,bottom/ratio,(right-left)/ratio,(top-bottom)/ratio);
          u.uRect.value.set(rect[0],rect[1],rect[2],rect[3]);
          u.uRadius.value=Math.max(0,Math.min(finite(s.radius,20),rect[2]*0.5,rect[3]*0.5));
          const p=s.press;
          u.uPress.value.set(unit(p&&p[0],0.5),unit(p&&p[1],0.5),unit(p&&p[2],0));
          u.uPanel.value=Number.isFinite(s.panelMix)?unit(s.panelMix,panel?1:0):(panel?1:0);u.uOpacity.value=opacity;u.uTransition.value=unit(s.transition,1);
          this.material.uniformsNeedUpdate=true;
          r.render(this.scene,this.camera);this.lastDrawCalls++;
        }
      }finally{
        r.autoClear=autoClear;r.setRenderTarget(target,cube,mip);
        r.setViewport(this.savedViewport);r.setScissor(this.savedScissor);r.setScissorTest(scissorTest);
      }
      return this.lastDrawCalls;
    }

    dispose(){
      if(this.disposed)return;
      this.material.dispose();this.geometry.dispose();this.disposed=true;
      // The source texture, LUT, and renderer belong to the artwork.
    }
  }
  root.CoastalGlassUIMaterial=CoastalGlassUIMaterial;
})(globalThis);
