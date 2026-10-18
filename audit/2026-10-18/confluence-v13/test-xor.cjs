const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),zlib=require('zlib');
const R='/workspace/tbyd-hiro53.github.io',W=4096,H=2048;
global.window=global;global.THREE={DataTexture:class{constructor(data,w,h){this.image={data,width:w,height:h};}}};
vm.runInThisContext(fs.readFileSync(R+'/confluence-v13-20261018-bake.js','utf8'));
(async()=>{
const original=Buffer.alloc(W*H*4);for(let i=0;i<original.length;i++)original[i]=(i*13+(i>>8))&255;
const expected=Buffer.from(original);for(let i=1234;i<1324;i++)expected[i]^=57;
let delta=Buffer.alloc(original.length);for(let i=0;i<original.length;i++)delta[i]=i<4?original[i]:(original[i]-original[i-4])&255;
let xor=Buffer.alloc(original.length);for(let i=0;i<xor.length;i++)xor[i]=original[i]^expected[i];
const old=zlib.gzipSync(Buffer.concat([Buffer.from('H53D'),delta]));const patch=zlib.gzipSync(Buffer.concat([Buffer.from('H53X'),xor]));let requests=[];
global.fetch=async url=>{requests.push(url);return new Response(url.includes('v12')?old:patch)};
const t=await ConfluenceBake.prototype.texture.call({panoGrad:true},0,'pano','color',new AbortController().signal);
if(!Buffer.from(t.image.data).equals(expected))throw Error('XOR round trip differs');
if(requests.length!==2)throw Error('wrong dependency count');console.log('PASS: actual browser decoder reconstructs exact bytes from delta-coded base and XOR correction');
})().catch(e=>{console.error(e);process.exit(1)});
