/* H53 Liquid Glass optical overlay — THREE-independent WebGL 1 / IIFE.
 * The approved Coastal Glass v3 rim, scatter, press, highlight and tint model.
 * Inputs are current artwork display-sRGB canvas bytes, without any DOM/UI.
 * capture() is synchronous and MUST run while that artwork frame is intact.
 * No animation loop, event semantics, CSS layout or color transform ownership.
 */
(function(root){
  'use strict';
  const VERTEX='attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}';
  const FRAGMENT=`
precision highp float;
uniform sampler2D uScene,uAgx;
uniform vec2 uCssSize,uRenderSize;
uniform vec4 uRect,uSourceRect;
uniform vec2 uSourceSize;
uniform vec3 uBackdrop;
uniform vec3 uPress;
uniform float uRadius,uPanel,uOpacity,uTransition,uExposure,uNight,uSimplified,uSourceMode,uSuppression;

// NaN and infinity fail these comparisons. Negative radiance is clipped.
float clean(float x){return x>=0.0&&x<=1.0e20?min(x,65504.0):0.0;}
vec3 clean3(vec3 x){return vec3(clean(x.r),clean(x.g),clean(x.b));}
vec2 safeUV(vec2 uv){vec2 e=0.5/max(uSourceSize,vec2(1.0));return clamp(uv,e,1.0-e);}
// Mode 0: already display-transformed sRGB bytes. Mode 1: linear HDR + artwork AgX.
vec3 srgbDecode(vec3 c){return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),c));}
vec3 srgbEncode(vec3 c){c=max(c,vec3(0.0));return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(vec3(0.0031308),c));}
vec3 sceneAt(vec2 uv){
  vec2 pixel=vec2(uv.x,1.0-uv.y)*uCssSize;
  vec2 inSource=(pixel-uSourceRect.xy)/max(uSourceRect.zw,vec2(0.0001));
  vec3 c;
  if(inSource.x<0.0||inSource.y<0.0||inSource.x>1.0||inSource.y>1.0)c=uBackdrop;
  else c=clean3(texture2D(uScene,safeUV(vec2(inSource.x,1.0-inSource.y))).rgb);
  return uSourceMode<0.5?srgbDecode(c):c;
}
vec2 cssOffsetUV(vec2 p){return vec2(p.x/uCssSize.x,-p.y/uCssSize.y);}

// Same 33^3 Blender AgX Medium Low Contrast LUT as the artwork final pass.
// LUT contains display sRGB. No later tone mapping / sRGB encoding is applied.
vec3 displayAgx(vec3 radiance){
  if(uSourceMode<0.5)return srgbEncode(radiance);
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
    if(uSuppression>0.0)tint=1.0-(1.0-tint)*(1.0-uSuppression*uPanel);
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
  const finite=(v,f)=>Number.isFinite(v)?v:f;
  const unit=(v,f)=>Math.min(1,Math.max(0,finite(v,f)));
  const names=['uScene','uAgx','uCssSize','uRenderSize','uRect','uPress','uRadius','uPanel','uOpacity','uTransition','uExposure','uNight','uSimplified','uSourceMode','uSourceRect','uSourceSize','uBackdrop','uSuppression'];
  function shader(gl,type,source){
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error('H53 Liquid Glass shader: '+error);}return s;
  }
  class H53LiquidGlassOptics{
    constructor(options){
      options=options||{};
      this.canvas=options.canvas||document.createElement('canvas');
      this.gl=this.canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false});
      if(!this.gl)throw new Error('WebGL is unavailable for the Liquid Glass optical overlay.');
      const gl=this.gl;this.maxPixels=Math.max(65536,finite(options.maxPixels,1250000));
      this.maxDpr=Math.max(0.5,finite(options.maxDpr,2));this.debug=!!options.debug;
      this.program=gl.createProgram();this.vertex=shader(gl,gl.VERTEX_SHADER,VERTEX);this.fragment=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT);
      gl.attachShader(this.program,this.vertex);gl.attachShader(this.program,this.fragment);gl.linkProgram(this.program);
      if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error('H53 Liquid Glass program: '+gl.getProgramInfoLog(this.program));
      this.uniforms={};for(const name of names)this.uniforms[name]=gl.getUniformLocation(this.program,name);
      this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      this.position=gl.getAttribLocation(this.program,'aPosition');this.texture=gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);
      for(const [p,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,p,v);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
      // The display-sRGB branch does not use a LUT, but the sampler has a valid binding.
      this.lut=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.lut);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
      gl.activeTexture(gl.TEXTURE0);this.maxTextureSize=gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this.disposed=false;this.hasFrame=false;this.captureCount=0;this.drawCount=0;this.lastDrawCalls=0;this.sourceWidth=0;this.sourceHeight=0;this.lastCaptureMs=0;this.lastDrawMs=0;this.error=null;
      this.canvas.setAttribute('aria-hidden','true');this.canvas.style.pointerEvents='none';
      this.canvas.style.background='transparent';
      this.onLost=e=>{e.preventDefault();this.hasFrame=false;this.error='WebGL context lost';if(typeof options.onContextLost==='function')options.onContextLost(e);};
      this.onRestored=()=>{this.error='WebGL context restored; recreate compositor';if(typeof options.onContextRestored==='function')options.onContextRestored();};
      this.canvas.addEventListener('webglcontextlost',this.onLost);this.canvas.addEventListener('webglcontextrestored',this.onRestored);
    }
    capture(source){
      if(this.disposed)return false;
      if(source===this.canvas)throw new Error('The optical overlay must never capture itself.');
      if(!source||!source.width||!source.height)return false;
      if(source.width>this.maxTextureSize||source.height>this.maxTextureSize)throw new Error('Artwork canvas exceeds the optical compositor texture limit.');
      const started=performance.now(),gl=this.gl;
      if(gl.isContextLost())return false;
      try{
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
        if(this.debug){const err=gl.getError();if(err!==gl.NO_ERROR)throw new Error('capture WebGL error '+err);}
        this.sourceWidth=source.width;this.sourceHeight=source.height;this.hasFrame=true;this.captureCount++;this.error=null;
        return true;
      }catch(error){this.hasFrame=false;this.error=String(error);throw error;}
      finally{this.lastCaptureMs=performance.now()-started;}
    }
    resize(cssWidth,cssHeight,dpr){
      const scale=Math.min(this.maxDpr,Math.max(0.5,finite(dpr,root.devicePixelRatio||1)),Math.sqrt(this.maxPixels/(cssWidth*cssHeight)));
      const w=Math.max(1,Math.round(cssWidth*scale)),h=Math.max(1,Math.round(cssHeight*scale));
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
      return [w,h];
    }
    draw(surfaces,options){
      options=options||{};const gl=this.gl,u=this.uniforms,started=performance.now();
      this.lastDrawCalls=0;
      if(this.disposed||gl.isContextLost())return 0;
      const cw=finite(options.cssWidth,this.canvas.clientWidth),ch=finite(options.cssHeight,this.canvas.clientHeight);
      if(cw<=0||ch<=0)return 0;
      const size=this.resize(cw,ch,options.dpr),w=size[0],h=size[1],sx=w/cw,sy=h/ch;
      gl.viewport(0,0,w,h);gl.disable(gl.SCISSOR_TEST);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      if((!this.hasFrame&&!options.simplified)||!surfaces||!surfaces.length)return 0;
      gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,2,gl.FLOAT,false,0,0);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.lut);gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(u.uScene,0);gl.uniform1i(u.uAgx,1);gl.uniform1f(u.uSourceMode,0);gl.uniform1f(u.uExposure,0);
      gl.uniform2f(u.uCssSize,cw,ch);gl.uniform2f(u.uRenderSize,w,h);
      const sourceRect=options.sourceRect||[0,0,cw,ch],backdrop=options.backdropColor||[0,0,0];
      if(sourceRect.length<4||!Array.from(sourceRect).every(Number.isFinite)||sourceRect[2]<=0||sourceRect[3]<=0)throw new Error('Invalid sourceRect.');
      gl.uniform4f(u.uSourceRect,sourceRect[0],sourceRect[1],sourceRect[2],sourceRect[3]);
      gl.uniform2f(u.uSourceSize,this.sourceWidth||1,this.sourceHeight||1);
      gl.uniform3f(u.uBackdrop,unit(backdrop[0],0),unit(backdrop[1],0),unit(backdrop[2],0));
      gl.uniform1f(u.uNight,unit(options.night===true?1:options.night,0));gl.uniform1f(u.uSimplified,options.simplified?1:0);
      gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendEquation(gl.FUNC_ADD);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.SCISSOR_TEST);
      for(const s of surfaces){
        const r=s&&s.rect;if(!r||r.length<4||!r.every(Number.isFinite)||r[2]<=0||r[3]<=0)continue;
        const opacity=unit(s.opacity,1);if(opacity<=0)continue;
        const panel=s.kind==='panel',pad=panel?28:18;
        let left=Math.max(0,Math.floor((r[0]-pad)*sx)),right=Math.min(w,Math.ceil((r[0]+r[2]+pad)*sx));
        let bottom=Math.max(0,Math.floor((ch-r[1]-r[3]-pad)*sy)),top=Math.min(h,Math.ceil((ch-r[1]+pad)*sy));
        // Match DOM overflow clipping, including the optical rim and soft shadow.
        // No clipped-away control can leave a painted, untappable ghost surface.
        const clip=s.clipRect;
        if(clip&&clip.length>=4&&Array.from(clip).every(Number.isFinite)){
          if(clip[2]<=0||clip[3]<=0)continue;
          left=Math.max(left,Math.ceil(clip[0]*sx));right=Math.min(right,Math.floor((clip[0]+clip[2])*sx));
          bottom=Math.max(bottom,Math.ceil((ch-clip[1]-clip[3])*sy));top=Math.min(top,Math.floor((ch-clip[1])*sy));
        }
        if(right<=left||top<=bottom)continue;
        gl.scissor(left,bottom,right-left,top-bottom);
        gl.uniform4f(u.uRect,r[0],r[1],r[2],r[3]);gl.uniform1f(u.uRadius,Math.max(0,Math.min(finite(s.radius,20),r[2]/2,r[3]/2)));
        const p=s.press;gl.uniform3f(u.uPress,unit(p&&p[0],0.5),unit(p&&p[1],0.5),unit(p&&p[2],0));
        gl.uniform1f(u.uPanel,unit(s.panelMix,panel?1:0));gl.uniform1f(u.uOpacity,opacity);gl.uniform1f(u.uTransition,unit(s.transition,1));gl.uniform1f(u.uSuppression,Math.min(.8,unit(s.suppression,0)));
        gl.drawArrays(gl.TRIANGLES,0,6);this.lastDrawCalls++;
      }
      gl.disable(gl.SCISSOR_TEST);this.drawCount++;this.lastDrawMs=performance.now()-started;
      return this.lastDrawCalls;
    }
    report(){return {backend:'display-srgb-webgl-overlay',sourceMode:'display-srgb',sourceWidth:this.sourceWidth,sourceHeight:this.sourceHeight,renderWidth:this.canvas.width,renderHeight:this.canvas.height,captures:this.captureCount,draws:this.drawCount,lastDrawCalls:this.lastDrawCalls,lastCaptureMs:this.lastCaptureMs,lastDrawMs:this.lastDrawMs,hasFrame:this.hasFrame,error:this.error};}
    dispose(){
      if(this.disposed)return;const gl=this.gl;
      gl.deleteTexture(this.texture);gl.deleteTexture(this.lut);gl.deleteBuffer(this.buffer);gl.deleteProgram(this.program);gl.deleteShader(this.vertex);gl.deleteShader(this.fragment);
      this.canvas.removeEventListener('webglcontextlost',this.onLost);this.canvas.removeEventListener('webglcontextrestored',this.onRestored);this.disposed=true;this.hasFrame=false;
    }
  }
  root.H53LiquidGlassOptics=H53LiquidGlassOptics;
})(globalThis);
