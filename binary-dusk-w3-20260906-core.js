(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mod=(v,p)=>((v%p)+p)%p;
const smooth=v=>v*v*(3-2*v);
function duskState(seconds){
 const t=Math.max(0,seconds),large=Math.max(40-466*t/180,-620),small=Math.max(360-466*t/180,-530);
 const dusk=Math.pow(clamp((Math.max(large,small)+340)/950,0,1),.85),dark=1-clamp((Math.max(large,small)+200)/600,0,1);
 return {seconds:t,large,small,dusk,dark,fade:smooth(clamp((dark-1/15)/(14/15),0,1)),suns:(large>-200?1:0)+(small>-106?1:0)};
}
class Clock{
 constructor(){this.motionSeconds=0;this.sunsetSeconds=0;this.sunsetStarted=false;this.running=false;this.hidden=false;this.last=null;}
 advance(now){if(this.last!==null&&this.running&&!this.hidden){const dt=Math.max(0,(now-this.last)/1000);this.motionSeconds+=dt;if(this.sunsetStarted)this.sunsetSeconds+=dt;}this.last=now;return this.sunsetSeconds;}
 play(now){this.advance(now);this.running=true;}
 pause(now){this.advance(now);this.running=false;}
 beginSunset(now){this.advance(now);if(this.sunsetStarted)return false;this.sunsetStarted=true;return true;}
 visibility(hidden,now){this.advance(now);this.hidden=hidden;this.last=now;}
}
function makeRoute(points){
 const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(...points[i].map((v,k)=>v-points[i-1][k])));
 const length=distances[distances.length-1];
 function sample(distance){const d=mod(distance,length);let lo=0,hi=distances.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(distances[m]<=d)lo=m;else hi=m;}
  const a=points[lo],b=points[lo+1],f=(d-distances[lo])/(distances[lo+1]-distances[lo]);return {position:a.map((v,k)=>v+(b[k]-v)*f),yaw:Math.atan2(-(b[0]-a[0]),b[1]-a[1]),distance:d};}
 return {length,distances,sample,car:(arc,t)=>sample(arc+t*length/15.6)};
}
function keys(t,times){let i=0;while(i<times.length-2&&t>times[i+1])i++;return {a:i,b:i+1,mix:clamp((t-times[i])/(times[i+1]-times[i]),0,1)};}
function stats(values){if(!values.length)return null;const v=values.slice().sort((a,b)=>a-b);return {count:v.length,mean:v.reduce((a,b)=>a+b,0)/v.length,p50:v[Math.floor(v.length*.5)],p95:v[Math.floor(v.length*.95)],p99:v[Math.floor(v.length*.99)],max:v[v.length-1],over33:v.filter(x=>x>33.34).length,over50:v.filter(x=>x>50).length};}
const api={clamp,mod,smooth,duskState,Clock,makeRoute,keys,stats};root.BinaryDuskCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
