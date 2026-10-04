const fs=require('fs'),vm=require('vm'),assert=require('assert');
(async()=>{
 const s=fs.readFileSync('lacto-tricore-v1-w1-app.js','utf8');const a=s.indexOf('async function switchView(id){'),b=s.indexOf('\nfunction render()',a),part=s.slice(a,b);
 async function run(final){
  const pending={};let errors=0;const context={view:'main',viewRequest:0,ready:true,cache:{main:{}},$:()=>({textContent:''}),fetchView(id){return new Promise((resolve,reject)=>{pending[id]={resolve,reject}})},bindView(id){context.view=id},syncUI(){},schedule(){},error(){errors++}};
  vm.createContext(context);vm.runInContext(part,context);
  const old=context.switchView('brain'),last=context.switchView(final);
  if(final==='sanc'){pending.sanc.resolve();await last}
  pending.brain.resolve();await old;await last;
  return {final,view:context.view,latestChoicePreserved:context.view===final,errors};
 }
 const r=[await run('sanc'),await run('main')];
 if(s.includes('function fetchView(id,progress){')){
  let loads=0;const context={cache:{},viewLoads:{},Promise,prepareView(){loads++;return Promise.resolve({})}};vm.createContext(context);
  const a=s.indexOf('function fetchView(id,progress){'),b=s.indexOf('function bindView',a);vm.runInContext(s.slice(a,b),context);
  await Promise.all([context.fetchView('brain',()=>{}),context.fetchView('brain',()=>{})]);
  r.push({inflightLoads:loads,latestChoicePreserved:loads===1,errors:0});
 }
let deleted=0,created=0;
 const layers=Array.from({length:7},(_,i)=>['l'+i]);const meta={layers:{ids:{file:'ids'}}};layers.forEach(([key])=>meta.layers[key]={file:key});
 const cleanup={cache:{},P:'',LAYERS:layers,fetch:async(url)=>url.includes('meta')?{ok:true,json:async()=>meta}:{ok:false,status:500},loadImage:async()=>({close(){}}),texture:()=>({id:++created}),gl:{deleteTexture(){deleted++}},unrle(){throw Error('not reached')}};
 vm.createContext(cleanup);const prepareStart=s.indexOf('async function prepareView(id,progress){'),prepareEnd=s.indexOf('function fetchView',prepareStart);vm.runInContext(s.slice(prepareStart,prepareEnd),cleanup);
 try{await cleanup.prepareView('brain',()=>{})}catch(e){}
 r.push({partialLoadCreated:created,partialLoadDeleted:deleted,latestChoicePreserved:created===7&&deleted===7,errors:0});
 console.log(JSON.stringify(r,null,2));if(process.argv.includes('--assert'))r.forEach(x=>assert(x.latestChoicePreserved));
})();
