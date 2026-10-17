/* Shared world-direction Moon/stars and single-scattering beacon functions.
   Camera-depth and light-space depth are both used; no translucent cone mesh. */
(function(root){'use strict';
root.CoastalGlassNightGLSL=`
uniform sampler2D uBeaconShadow;
uniform vec2 uBeaconAtlasSize;
uniform float uBeaconFaceSize,uBeaconTileSize;
uniform vec3 uBeaconOrigin,uBeaconShadowOrigin,uBeaconAxis,uBeaconIntensity;
uniform float uMoonRadius,uBeaconOuter,uBeaconInner,uBeaconRange,uExtinction,uScattering,uPhaseG;
float nightHash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float nightNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(nightHash(i),nightHash(i+vec2(1.,0.)),f.x),mix(nightHash(i+vec2(0.,1.)),nightHash(i+vec2(1.,1.)),f.x),f.y);}
vec3 stars(vec3 ray){
 if(uNight<.5||ray.z<.025)return vec3(0.);
 vec2 cells=envUV(ray)*vec2(1024.,512.),cell=floor(cells);float seed=nightHash(cell);
 if(seed<.9985)return vec3(0.);
 vec2 center=vec2(.3+.4*nightHash(cell+1.7),.3+.4*nightHash(cell+9.3));
 float width=max(.14,min(.6,length(fwidth(cells))*.55));
 float point=exp(-dot(fract(cells)-center,fract(cells)-center)/(width*width))*.0196/(width*width);
 float altitude=smoothstep(.025,.22,ray.z),moonDistance=acos(clamp(dot(ray,uSun),-1.,1.));
 float brightness=.16+.24*pow(nightHash(cell+13.8),3.);
 return vec3(.87,.92,1.)*brightness*point*altitude*smoothstep(.035,.18,moonDistance);
}
vec3 moonDisc(vec3 ray){
 if(uNight<.5)return vec3(0.);
 float angle=acos(clamp(dot(ray,uSun),-1.,1.));
 float pixel=1./max(uResolution.x*uFocal,300.);
 float edge=1.-smoothstep(uMoonRadius-pixel*.55,uMoonRadius+pixel*.55,angle);
 if(edge<=0.)return vec3(0.);
 vec3 right=normalize(cross(uSun,vec3(0.,0.,1.))),up=normalize(cross(right,uSun));
 vec2 p=vec2(dot(ray,right),dot(ray,up))/sin(uMoonRadius);
 float limb=sqrt(max(0.,1.-dot(p,p)));
 // Quiet albedo structure, not a claim to reproduce a particular lunar atlas.
 float maria=exp(-dot(p-vec2(-.30,.12),p-vec2(-.30,.12))*7.)*.22
            +exp(-dot(p-vec2(.28,.37),p-vec2(.28,.37))*18.)*.14;
 float albedo=.81-maria+.065*nightNoise(p*7.)+.018*nightNoise(p*23.);
 return uSunRadiance*edge*albedo*(.86+.14*limb);
}
vec3 beaconFace(vec3 d){
 vec3 a=abs(d);float face;vec2 st;
 if(a.x>=a.y&&a.x>=a.z){if(d.x>=0.){face=0.;st=vec2(-d.y,d.z)/a.x;}else{face=1.;st=vec2(d.y,d.z)/a.x;}}
 else if(a.y>=a.z){if(d.y>=0.){face=2.;st=vec2(d.x,d.z)/a.y;}else{face=3.;st=vec2(-d.x,d.z)/a.y;}}
 else{if(d.z>=0.){face=4.;st=vec2(d.x,d.y)/a.z;}else{face=5.;st=vec2(d.x,-d.y)/a.z;}}
 return vec3(st*.5+.5,face);
}
float beaconShadowDepth(vec2 uv){vec3 b=floor(texture2D(uBeaconShadow,uv).rgb*255.+.5);return dot(b,vec3(65536.,256.,1.))/16777215.*uBeaconRange;}
float beaconVisibility(vec3 p){
 vec3 delta=p-uBeaconShadowOrigin;float d=length(delta)-.004;if(d<=0.)return 1.;
 vec3 f=beaconFace(delta);vec2 tile=vec2(mod(f.z,3.),floor(f.z/3.));
 vec2 pixel=tile*uBeaconTileSize+vec2(1.)+f.xy*uBeaconFaceSize;float sum=0.;
 sum+=step(d,beaconShadowDepth((pixel+vec2(-.5,-.5))/uBeaconAtlasSize));
 sum+=step(d,beaconShadowDepth((pixel+vec2(.5,-.5))/uBeaconAtlasSize));
 sum+=step(d,beaconShadowDepth((pixel+vec2(-.5,.5))/uBeaconAtlasSize));
 sum+=step(d,beaconShadowDepth((pixel+vec2(.5,.5))/uBeaconAtlasSize));return sum*.25;
}
float beaconCone(vec3 p){vec3 delta=p-uBeaconOrigin;float d=length(delta);if(d<.015)return 0.;return smoothstep(uBeaconOuter,uBeaconInner,dot(delta/d,uBeaconAxis));}
vec3 beaconIrradiance(vec3 p){
 if(uNight<.5)return vec3(0.);float cone=beaconCone(p);if(cone<=0.)return vec3(0.);
 float d=length(p-uBeaconOrigin);if(d>uBeaconRange)return vec3(0.);
 return uBeaconIntensity*cone*beaconVisibility(p)*exp(-uExtinction*d)/max(d*d,.01);
}
bool beamInterval(vec3 ro,vec3 rd,float surfaceDistance,out float lo,out float hi){
 vec3 o=ro-uBeaconOrigin;float oa=dot(o,uBeaconAxis),da=dot(rd,uBeaconAxis),c2=uBeaconOuter*uBeaconOuter;
 lo=0.;hi=min(surfaceDistance,500.);
 if(abs(da)<.00001){if(oa<=0.||oa>=uBeaconRange)return false;}
 else{float a=-oa/da,b=(uBeaconRange-oa)/da;lo=max(lo,min(a,b));hi=min(hi,max(a,b));}
 if(hi<=lo)return false;
 float a=c2-da*da,b=2.*(c2*dot(o,rd)-oa*da),c=c2*dot(o,o)-oa*oa;
 if(abs(a)<.000001){if(abs(b)>.000001){float t=-c/b;if(b>0.)hi=min(hi,t);else lo=max(lo,t);}else if(c>0.)return false;}
 else{float disc=b*b-4.*a*c;if(disc<0.){if(a>0.)return false;}else{float root=sqrt(disc),t0=(-b-root)/(2.*a),t1=(-b+root)/(2.*a);float first=min(t0,t1),last=max(t0,t1);if(a>0.){lo=max(lo,first);hi=min(hi,last);}else{if(a*lo*lo+b*lo+c>0.)lo=max(lo,last);else if(a*hi*hi+b*hi+c>0.)hi=min(hi,first);}}}
 return hi>lo;
}
vec3 beaconVolume(vec3 ray,float surfaceDistance){
 if(uNight<.5)return vec3(0.);float lo,hi;if(!beamInterval(uCamera,ray,surfaceDistance,lo,hi))return vec3(0.);
 float ds=(hi-lo)/32.;vec3 sum=vec3(0.);
 for(int i=0;i<32;i++){float t=lo+(float(i)+.5)*ds;vec3 p=uCamera+ray*t;if(p.z< -1.52)continue;
   vec3 incoming=normalize(p-uBeaconOrigin);float cosine=dot(incoming,-ray),g=uPhaseG;
   float phase=(1.-g*g)/(4.*PI*pow(max(.05,1.+g*g-2.*g*cosine),1.5));
   float distanceFromLamp=length(p-uBeaconOrigin),fade=1.-smoothstep(180.,uBeaconRange,distanceFromLamp);
   sum+=beaconIrradiance(p)*uScattering*phase*exp(-uExtinction*t)*fade*ds;
 }
 return sum;
}
`;

// CPU queries use the same raw bytes, padded face convention, bias and four taps.
root.CoastalBeacon={
 face(d){const a=[Math.abs(d.x),Math.abs(d.y),Math.abs(d.z)];let f,u,v;
 if(a[0]>=a[1]&&a[0]>=a[2]){f=d.x>=0?0:1;u=(d.x>=0?-d.y:d.y)/a[0];v=d.z/a[0];}
 else if(a[1]>=a[2]){f=d.y>=0?2:3;u=(d.y>=0?d.x:-d.x)/a[1];v=d.z/a[1];}
 else{f=d.z>=0?4:5;u=d.x/a[2];v=(d.z>=0?d.y:-d.y)/a[2];}return [f,u*.5+.5,v*.5+.5];},
 update(w,seconds){const c=w.night.beacon,r=c.rotation,a=(r.initialAzimuthDegrees+360*(seconds/r.periodSeconds%1))*Math.PI/180,e=r.elevationDegrees*Math.PI/180,u=w.u;
 u.uBeaconAxis.value.set(Math.sin(a)*Math.cos(e),Math.cos(a)*Math.cos(e),Math.sin(e));
 u.uBeaconOrigin.value.copy(u.uBeaconShadowOrigin.value).addScaledVector(u.uBeaconAxis.value,c.exitDistanceFromSource);},
 visibility(w,p){const d=p.clone().sub(w.u.uBeaconShadowOrigin.value),dist=d.length()-.004;if(dist<=0)return 1;
 const [f,u,v]=this.face(d),m=w.night.beacon.shadow,im=w.beaconShadow.image,b=im.data,x=(f%3)*m.tileSize+1+u*m.resolution,y=Math.floor(f/3)*m.tileSize+1+v*m.resolution;let sum=0;
 for(const dy of [-.5,.5])for(const dx of [-.5,.5]){const k=(Math.floor(y+dy)*im.width+Math.floor(x+dx))*4,z=(b[k]*65536+b[k+1]*256+b[k+2])/16777215*m.rangeMetres;sum+=dist<=z?1:0;}return sum*.25;}
};
})(globalThis);
