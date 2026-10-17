/* A small, real-time 2D position-based particle fluid in the pipe's material
 * coordinates. Pressure constraints, confinement and velocity mixing are solved
 * on CPU. Overlapping GPU particle kernels reconstruct a continuous density field.
 * The baked phase/occlusion map projects it through all three narrowing sections.
 * This is a constrained flow model, not a 3D free-surface Navier–Stokes solver. */
(function(){'use strict';
window.H53TubeFluid=function(gl){
 const NX=12,NY=112,N=NX*NY,H=.28,H2=H*H,REST=2.45,DT=1/60,W=128,HT=1024;
 const x=new Float32Array(N),y=new Float32Array(N),vx=new Float32Array(N),vy=new Float32Array(N),ox=new Float32Array(N),oy=new Float32Array(N),lambda=new Float32Array(N),dx=new Float32Array(N),dy=new Float32Array(N),vertices=new Float32Array(N*4);
 const CX=8,CY=58,head=new Int32Array(CX*CY),next=new Int32Array(N);let time=0,accumulator=0,steps=0,last=-1,drawn=false;
 function reset(t){time=t;accumulator=0;for(let i=0;i<N;i++){let a=i%NX,b=(i/NX)|0;x[i]=-1+(a+.5)*2/NX+.012*Math.sin(i*7.13);y[i]=(b+.5)*16/NY;vx[i]=0;vy[i]=1/.78;}last=t;}
 function grid(){head.fill(-1);for(let i=0;i<N;i++){let gx=Math.max(0,Math.min(CX-1,Math.floor((x[i]+1)/H))),gy=Math.min(CY-1,Math.floor(y[i]/H)),c=gy*CX+gx;next[i]=head[c];head[c]=i;}}
 function neighbours(i,fn){const gx=Math.floor((x[i]+1)/H),gy=Math.floor(y[i]/H);for(let cy=Math.max(0,gy-1);cy<=Math.min(CY-1,gy+1);cy++)for(let cx=Math.max(0,gx-1);cx<=Math.min(CX-1,gx+1);cx++)for(let j=head[cy*CX+cx];j>=0;j=next[j]){const a=x[i]-x[j],b=y[i]-y[j],r=a*a+b*b;if(r<H2)fn(j,a,b,r);}}
 function step(){time+=DT;steps++;
  for(let i=0;i<N;i++){
   ox[i]=x[i];oy[i]=y[i];const u=x[i],z=y[i],target=(1/.78)*(1.09-.20*u*u)*(1+.07*Math.cos(2*Math.PI*(z-time/.78)));
   // Pump pressure drives a continuous column; a weak secondary circulation
   // breaks the regular particle lattice without turning milk into separate beads.
   vx[i]+=(.46*Math.sin(z*2.8-time*2.1)*(1-u*u)-vx[i]*3.2)*DT;
   vy[i]+=(target-vy[i])*4*DT;
   x[i]+=vx[i]*DT;y[i]+=vy[i]*DT;
   if(y[i]>=16){y[i]-=16;oy[i]-=16;}x[i]=Math.max(-.96,Math.min(.96,x[i]));
  }
  for(let iteration=0;iteration<2;iteration++){
   grid();
   for(let i=0;i<N;i++){let rho=0,gx=0,gy=0,gg=0;
    neighbours(i,(j,a,b,r)=>{const q=1-r/H2;rho+=q*q*q;if(i===j)return;const k=-6*q*q/H2/REST,ax=k*a,ay=k*b;gx+=ax;gy+=ay;gg+=ax*ax+ay*ay;});
    lambda[i]=-Math.max(0,rho/REST-1)/(gg+gx*gx+gy*gy+45);
   }
   for(let i=0;i<N;i++){let a=0,b=0;neighbours(i,(j,xx,yy,r)=>{if(j===i)return;const q=1-r/H2,k=(lambda[i]+lambda[j])*(-6*q*q/H2/REST);a+=k*xx;b+=k*yy;});dx[i]=a;dy[i]=b;}
   for(let i=0;i<N;i++){x[i]=Math.max(-.96,Math.min(.96,x[i]+dx[i]));y[i]=Math.max(0,Math.min(15.9999,y[i]+dy[i]));}
  }
  for(let i=0;i<N;i++){vx[i]=(x[i]-ox[i])/DT;vy[i]=Math.max(.2,Math.min(2.8,(y[i]-oy[i])/DT));}
  grid();for(let i=0;i<N;i++){let ax=0,ay=0,n=0;neighbours(i,(j,a,b,r)=>{const q=1-r/H2;ax+=(vx[j]-vx[i])*q;ay+=(vy[j]-vy[i])*q;n+=q;});dx[i]=ax/Math.max(1,n);dy[i]=ay/Math.max(1,n);}
  for(let i=0;i<N;i++){vx[i]+=.10*dx[i];vy[i]+=.10*dy[i];}
 }
 function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 const program=gl.createProgram();gl.attachShader(program,sh(gl.VERTEX_SHADER,'attribute vec4 p;varying float dye;varying float bubble;void main(){gl_Position=vec4(p.x,p.y/8.-1.,0.,1.);gl_PointSize=36.;dye=p.z;bubble=p.w;}'));gl.attachShader(program,sh(gl.FRAGMENT_SHADER,'precision mediump float;varying float dye;varying float bubble;void main(){vec2 q=gl_PointCoord*2.-1.;float r=dot(q,q);if(r>1.)discard;float k=pow(1.-r,3.)*.24;float b=bubble*pow(max(0.,1.-r*5.),2.);gl_FragColor=vec4(k,k*dye,b,k);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 const attr=gl.getAttribLocation(program,'p'),buffer=gl.createBuffer(),texture=gl.createTexture(),fbo=gl.createFramebuffer();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,W,HT,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Fluid framebuffer incomplete');gl.bindFramebuffer(gl.FRAMEBUFFER,null);reset(0);
 function update(t){if(drawn&&t===last)return;if(t<last||t-last>.5)reset(t);accumulator+=Math.max(0,t-last);last=t;let count=0;while(accumulator>=DT&&count++<10){step();accumulator-=DT;}
  for(let i=0;i<N;i++){vertices[4*i]=x[i];vertices[4*i+1]=y[i];const a=i%NX,b=(i/NX)|0;vertices[4*i+2]=.5+.42*Math.sin(a*.58+Math.sin(b*.14)*2)*Math.sin(b*.31+a*.2);vertices[4*i+3]=i%113===37?.75:0;}
  gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,W,HT);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,4,gl.FLOAT,false,0,0);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.drawArrays(gl.POINTS,0,N);gl.disable(gl.BLEND);gl.disableVertexAttribArray(attr);gl.bindFramebuffer(gl.FRAMEBUFFER,null);drawn=true;
 }
 return {texture,update,report:()=>({particles:N,steps,time,field:[W,HT],model:'2D position-based fluid',finite:x.every(Number.isFinite)&&y.every(Number.isFinite),minX:Math.min(...x),maxX:Math.max(...x),meanDownVelocity:vy.reduce((a,b)=>a+b,0)/N})};
};
})();
