const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const D='/workspace/render-work/confluence-v13',R='/workspace/tbyd-hiro53.github.io',base=process.argv[2]||'http://127.0.0.1:8060/';
const nativeFetch=global.fetch;global.fetch=(path,options)=>nativeFetch(new URL(path,base),options);
global.window=global;global.THREE={DataTexture:class {constructor(data,w,h){this.image={data,width:w,height:h}}}};
vm.runInThisContext(fs.readFileSync(R+'/confluence-v13-20261018-bake.js','utf8'));
(async()=>{let results=[];for(let [index,spot] of ['gap','under','bank'].entries())for(let kind of ['pano','detail','mirror'])for(let label of ['color','depth']){
 const prefix=spot+'-'+kind+'-'+label,record=JSON.parse(fs.readFileSync(D+'/'+prefix+'-codec.json'));
 const map=await ConfluenceBake.prototype.texture.call({panoGrad:true},index,kind,label,new AbortController().signal);
 const sha=crypto.createHash('sha256').update(map.image.data).digest('hex');if(sha!==record.decodedSHA256)throw Error(prefix+' decoded bytes differ');results.push({prefix,codec:record.codec,bytes:record.bytes,decodedSHA256:sha});
 }fs.writeFileSync(D+'/codec-results.json',JSON.stringify(results,null,2));console.log('PASS',results.length,'runtime textures match original RGBA bytes');})().catch(e=>{console.error(e);process.exitCode=1});
