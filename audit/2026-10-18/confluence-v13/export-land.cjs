const fs=require('fs'),T=require('/workspace/tbyd-hiro53.github.io/confluence-v5-20260909-three.min.js'),PI=Math.PI;
const file='/workspace/tbyd-hiro53.github.io/confluence-v12-20261018-engine.js',src=fs.readFileSync(file,'utf8');
const old=src.slice(src.indexOf('Engine.prototype._land='),src.indexOf('Engine.prototype._shore='));
const fixed=old.split('\n').filter(l=>!l.includes("if(label==='continuous land behind record house')")).join('\n');
const call=src.match(/this\._land\(\[\[-650,-80\].*?'continuous land behind record house'\);/)[0];
let out={};for(const [mode,code] of Object.entries({old,fixed})){
 const Engine=function(){};Engine.prototype._part=function(role,mat,g){out[mode]={position:Array.from(g.attributes.position.array),normal:Array.from(g.attributes.normal.array),uv:Array.from(g.attributes.uv.array)};};
 eval(code);const earth=null;const e=new Engine();eval(call.replace('this._land','e._land'));
}
fs.writeFileSync('/workspace/render-work/confluence-v13/land-geometry.json',JSON.stringify(out));console.log(Object.entries(out).map(([k,v])=>[k,v.position.length/9]));
