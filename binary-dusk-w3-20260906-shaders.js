(function(root){'use strict';
const common=`
precision highp float;
uniform float uTime,uDusk,uFade,uAltL,uAltS,uWind,uMix;
uniform vec2 uResolution,uRayScale,uUvScale;
vec2 viewUV(vec2 uv){return (uv-.5)*uUvScale+.5;}
uniform vec3 uCameraPosition;
uniform mat4 uCameraWorld,uViewProjection,uShadowMatrix;
uniform sampler2D uDepth,uShadow,uAmbientA,uAmbientB,uSkyA,uSkyB;
uniform vec3 uSunDirection,uSunColor,uSmallDirection,uSmallColor;
uniform float uSunPower,uSmallPower,uShadowEnabled;
uniform vec4 uDiscs[5];
#include <packing>
vec3 fromSRGB(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
vec3 toSRGB(vec3 c){c=max(c,vec3(0.));return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));}
float rayDepth(vec4 d){return exp2(dot(floor(d.rgb*255.+.5),vec3(65536.,256.,1.))/16777215.*14.2877845)-1.;}
vec3 rayAt(vec2 uv){return (uCameraWorld*vec4((uv*2.-1.)*uRayScale,-1.,0.)).xyz;}
vec2 sunMasks(vec2 uv){vec3 ray=rayAt(uv);vec3 p=uCameraPosition+ray*((959.839966-uCameraPosition.y)/ray.y);vec2 source=p.xz/.16;if(source.y<0.)return vec2(0.);return vec2(1.-smoothstep(198.5,200.,length(source-vec2(-190.,uAltL))),1.-smoothstep(104.8,106.,length(source-vec2(190.,uAltS))));}
float shadowAt(vec3 p,vec3 n){
 if(uShadowEnabled<.5)return 1.;vec4 q=uShadowMatrix*vec4(p+n*.12,1.);vec3 v=q.xyz/q.w;
 if(any(lessThan(v,vec3(0.)))||any(greaterThan(v,vec3(1.))))return 1.;
 float a=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){float z=unpackRGBAToDepth(texture2D(uShadow,v.xy+vec2(float(x),float(y))/1024.));a+=step(v.z-.00065,z);}return a/9.;
}
float screenOcclusion(vec3 a,vec3 b){
 for(int i=1;i<5;i++){vec3 p=mix(a,b,float(i)/5.);vec4 q=uViewProjection*vec4(p,1.);vec2 uv=q.xy/q.w*.5+.5;if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.){vec4 dp=texture2D(uDepth,viewUV(uv));if(dp.a>0.&&rayDepth(dp)<q.w-.45)return 0.;}}return 1.;
}
vec3 carrierSpill(vec3 p,vec3 n,vec3 albedo){
 vec3 sum=vec3(0.);for(int i=0;i<5;i++){vec4 disc=uDiscs[i];float dz=disc.z+.7-p.z;vec2 d=p.xy-disc.xy;float rho=length(d);float dr=rho-disc.w;
 if(dz>.05&&dz<18.&&abs(dr)<22.){vec3 source=vec3(disc.xy+normalize(d+vec2(.0001))*disc.w,disc.z+.7);vec3 L=normalize(source-p);float fall=exp(-(dr*dr+dz*dz*.15)/((dz*.8+2.)*(dz*.8+2.)));
 float rot=uTime*6.2831853/2.4*(mod(float(i),2.)<.5?1.:-1.);float segments=.9+.1*cos(8.*(atan(d.y,d.x)-rot));
 sum+=albedo*vec3(.05,1.,.79)*.16*uFade*fall*max(dot(n,L),0.)*segments*screenOcclusion(p+n*.15,source);}}
 return sum;
}
vec3 sunLight(vec3 p,vec3 n,vec3 albedo){float sh=shadowAt(p,n);return albedo/3.14159*(uSunColor*uSunPower*max(dot(n,-uSunDirection),0.)*sh+uSmallColor*uSmallPower*max(dot(n,-uSmallDirection),0.)*sh);}
vec3 windPosition(vec3 p,vec4 group){
 if(uWind<.001)return p;
 if(length(group.xyz)>1.){vec3 d=p-group.xyz;float phase=group.w;float a=(sin(uTime*.91+phase)-sin(phase))*.007*uWind;float cs=cos(a),sn=sin(a);d.yz=mat2(cs,-sn,sn,cs)*d.yz;return group.xyz+d;}
 float phase=p.x*.031+p.y*.019;float a=sin(uTime*.73+phase)-sin(phase);float b=sin(uTime*1.07+phase*1.31)-sin(phase*1.31);return p+vec3(a*.07,b*.045,a*.018)*uWind;
}
`;
const simpleVertex=`varying vec3 vWorld;void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`;
const surfaceFragment=common+`
uniform sampler2D uNormal,uAlbedo,uRoughness;
void main(){
 vec2 uv=viewUV(gl_FragCoord.xy/uResolution);vec4 dp=texture2D(uDepth,uv);if(dp.a<.001)discard;float depth=rayDepth(dp);vec3 p=uCameraPosition+rayAt(uv)*depth;vec4 clip=uViewProjection*vec4(p,1.);gl_FragDepthEXT=clip.z/clip.w*.5+.5;
 vec4 nr=texture2D(uNormal,uv);vec3 n=normalize(nr.rgb*2.-1.);vec3 albedo=texture2D(uAlbedo,uv).rgb;float id=floor(dp.a*255.+.5);
 vec3 base=mix(fromSRGB(texture2D(uAmbientA,uv).rgb),fromSRGB(texture2D(uAmbientB,uv).rgb),uMix);
 float factor=id<1.5?.32:1.;base+=sunLight(p,n,albedo)*factor;
 float rough=texture2D(uRoughness,uv).r;vec3 H=normalize(normalize(uCameraPosition-p)-uSunDirection);float spec=pow(max(dot(n,H),0.),mix(120.,9.,rough))*pow(1.-rough,2.)*.05*uSunPower*shadowAt(p,n);base+=uSunColor*spec*factor;
 base+=carrierSpill(p,n,albedo);
 if(abs(id-4.)<.1){float wave=sin(p.x*3.1+p.y*1.8+uTime*.45)*sin(p.y*5.3-uTime*.24);base*=1.+.022*wave*uWind;}
 gl_FragColor=vec4(toSRGB(base),1.);
}`;
const dynamicVertex=`attribute vec3 color;attribute vec3 anchor;attribute vec4 windGroup;varying vec3 vWorld,vNormal,vColor;varying vec2 vUv;uniform float uTime,uWind,uLeaf,uTwig;
vec3 bend(vec3 p,vec4 group){if(uWind<.001)return p;if(length(group.xyz)>1.){vec3 d=p-group.xyz;float a=(sin(uTime*.91+group.w)-sin(group.w))*.007*uWind;float cs=cos(a),sn=sin(a);d.yz=mat2(cs,-sn,sn,cs)*d.yz;return group.xyz+d;}float phase=p.x*.031+p.y*.019;float a=sin(uTime*.73+phase)-sin(phase),b=sin(uTime*1.07+phase*1.31)-sin(phase*1.31);return p+vec3(a*.07,b*.045,a*.018)*uWind;}
void main(){vec3 p=(modelMatrix*vec4(position,1.)).xyz;vec3 n=normalize(mat3(modelMatrix)*normal);if(uLeaf+uTwig>.5){p=bend(p,windGroup);if(uLeaf>.5){float phase=dot(anchor,vec3(.33,.21,.15));p+=n*(sin(uTime*2.1+phase)-sin(phase))*.014*uv.y*uv.y*uWind;}}vWorld=p;vNormal=n;vColor=color;vUv=uv;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`;
const dynamicFragment=common+`
varying vec3 vWorld,vNormal,vColor;varying vec2 vUv;uniform float uLeaf,uTwig,uEmissive;
void main(){vec3 n=normalize(vNormal)*(gl_FrontFacing?1.:-1.);vec3 a=vColor;if(uTwig>.5)a=vec3(.065,.050,.040);
 if(uEmissive>.5){gl_FragColor=vec4(toSRGB(vec3(.006,.12,.095)*(.4+.56*uFade)),1.);return;}
 float ratio=uDusk/.77285;vec3 ambient=mix(vec3(.016,.025,.043),vec3(.40,.35,.31),ratio);float sky=.55+.45*max(n.z,0.);vec3 c=a*ambient*sky;
 c+=sunLight(vWorld,n,a);c+=carrierSpill(vWorld,n,a);
 if(uLeaf>.5){float vein=1.-.10*exp(-abs(vUv.x-.5)*80.);c*=vein;c+=a*uSunColor*uSunPower*pow(max(dot(n,uSunDirection),0.),2.)*.06;}
 gl_FragColor=vec4(toSRGB(c),1.);}`;
const skyVertex=`varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,.999999,1.);}`;
const skyFragment=common+`
varying vec2 vUv;
void main(){vec2 uv=viewUV(vUv);vec3 c=mix(fromSRGB(texture2D(uSkyA,uv).rgb),fromSRGB(texture2D(uSkyB,uv).rgb),uMix);vec3 ray=rayAt(uv);vec3 p=uCameraPosition+ray*((959.839966-uCameraPosition.y)/ray.y);vec2 source=p.xz/.16;
 if(source.y>=0.){float rL=length(source-vec2(-190.,uAltL)),rS=length(source-vec2(190.,uAltS));vec2 masks=sunMasks(uv);float l=masks.x,s=masks.y;vec3 lc=vec3(.84,.66,.80)*(1.-.10*pow(clamp(rL/200.,0.,1.),2.));vec3 sc=vec3(.67,.93,.85)*(1.-.08*pow(clamp(rS/106.,0.,1.),2.));c=mix(c,lc,l);c=mix(c,sc,s);}
 gl_FragColor=vec4(toSRGB(c),1.);}`;
root.BinaryDuskShaders={common,simpleVertex,surfaceFragment,dynamicVertex,dynamicFragment,skyVertex,skyFragment};
})(globalThis);
