const fs=require('fs'),vm=require('vm'),assert=require('assert');
const files=['confluence-liquid-v3-20260923-viewer.js','confluence-v2-20260909-viewer.js','confluence-v3-20260909-viewer.js','confluence-v4-20260909-viewer.js'];
(async()=>{
 const out=[];
 for(const file of files){
  const s=fs.readFileSync(file,'utf8'),start=s.indexOf('function change(i){'),end=s.indexOf('\nfunction reset()',start),part=s.slice(start,end);
  const elements={},pending=[];let errors=0,draws=0;
  const el=id=>elements[id]||(elements[id]={hidden:true,disabled:false,textContent:'',classList:{remove(){},add(){}},setAttribute(){}});
  const context={current:0,requested:0,token:0,liquid:{blocked:false},document:{getElementById:el,querySelectorAll:()=>[]},spots:[{name:'A',file:'bank'},{name:'B',file:'under'},{name:'C',file:'gap'}],closePanel(){},setMenu(){},reset(){},motionLabels(){},requestDraw(){draws++},fail(){errors++},console:{error(){}},history:{replaceState(){}},location:{pathname:'/test',search:''},status:el('status'),error:el('error'),last:0,engine:{loadSpot(i,cb){let reject,resolve;const p=new Promise((res,rej)=>{reject=rej;resolve=res});pending.push({i,cb,reject,resolve});return p}}};
  vm.createContext(context);vm.runInContext(part+'\nchange(0);change(2);',context);
  pending[1].cb('poster');pending[1].cb('ready');pending[1].resolve(true);
  pending[0].reject(new Error('Earlier poster failed after latest spot succeeded'));
  await new Promise(r=>setImmediate(r));
  const result={file,staleErrorIgnored:errors===0,latestCurrent:context.current===2};
  // Also check that an outdated progress event cannot rewrite the chosen view.
  pending[0].cb('poster');result.staleProgressIgnored=context.current===2;
  out.push(result);
 }
 console.log(JSON.stringify(out,null,2));
 if(process.argv.includes('--assert'))for(const r of out)assert(r.staleErrorIgnored&&r.latestCurrent&&r.staleProgressIgnored,r.file);
})();
