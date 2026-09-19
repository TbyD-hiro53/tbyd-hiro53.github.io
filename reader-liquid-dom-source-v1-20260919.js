/* Live DOM backdrop adapter. Mirrors visible document glyph positions/boxes into
 * an offscreen canvas for optical sampling; the real reading DOM is untouched.
 * This is a bounded typography/box approximation, not a browser screenshot API. */
(function(root){'use strict';
var EXCLUDE='#bar,#h53idx,#toc,#mark,#tocBtn,.lang,.h53-liquid-overlay,#readerShow,script,style';
function overlaps(r,w,h){return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<h&&r.left<w;}
function visible(n){var s=getComputedStyle(n);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0;}
function colorVisible(c){return c&&c!=='transparent'&&c!=='rgba(0, 0, 0, 0)';}
function LiveDOMSource(content,onDirty){
 this.root=content;this.onDirty=onDirty||function(){};this.canvas=document.createElement('canvas');this.context=this.canvas.getContext('2d',{alpha:false});this.canvas.getBoundingClientRect=function(){return {left:0,top:0,width:innerWidth,height:innerHeight,right:innerWidth,bottom:innerHeight};};
 this.range=document.createRange();this.svgImages=new WeakMap();this.frames=0;this.lastMs=0;this.lastGlyphs=0;this.textNodes=[];this.elements=[];this.scan();
}
LiveDOMSource.prototype.scan=function(){
 this.elements=Array.from(this.root.querySelectorAll('*')).filter(function(n){return !n.closest(EXCLUDE)&&(!n.closest('svg')||n.tagName.toLowerCase()==='svg');});
 var walker=document.createTreeWalker(this.root,NodeFilter.SHOW_TEXT),node;this.textNodes=[];while(node=walker.nextNode())if(node.nodeValue.trim()&&!node.parentElement.closest(EXCLUDE+',svg'))this.textNodes.push(node);
};
LiveDOMSource.prototype.rasterize=function(){
 var start=performance.now(),w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(1250000/(w*h))),cw=Math.round(w*dpr),ch=Math.round(h*dpr),c=this.canvas,ctx=this.context;
 if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.fillStyle=getComputedStyle(document.body).backgroundColor;ctx.fillRect(0,0,w,h);
 // Existing pages share the fine horizontal document scanline, fixed to document position.
 if(getComputedStyle(document.body).backgroundImage.indexOf('repeating-linear-gradient')>=0){ctx.fillStyle='rgba(255,255,255,.022)';for(var y=-(scrollY%3);y<h;y+=3)ctx.fillRect(0,y,w,1);}
 for(var n of this.elements){var r=n.getBoundingClientRect();if(!overlaps(r,w,h)||!visible(n))continue;var s=getComputedStyle(n),opacity=Number(s.opacity);ctx.globalAlpha=Number.isFinite(opacity)?opacity:1;
  if(colorVisible(s.backgroundColor)){ctx.fillStyle=s.backgroundColor;ctx.fillRect(r.left,r.top,r.width,r.height);}
  var borders=[['Top',r.left,r.top,r.width,parseFloat(s.borderTopWidth)],['Bottom',r.left,r.bottom-parseFloat(s.borderBottomWidth),r.width,parseFloat(s.borderBottomWidth)],['Left',r.left,r.top,parseFloat(s.borderLeftWidth),r.height],['Right',r.right-parseFloat(s.borderRightWidth),r.top,parseFloat(s.borderRightWidth),r.height]];
  for(var b of borders)if(b[3]>0&&b[4]>0&&colorVisible(s['border'+b[0]+'Color'])){ctx.fillStyle=s['border'+b[0]+'Color'];ctx.fillRect(b[1],b[2],b[3],b[4]);}
  if(n.tagName==='IMG'&&n.complete&&n.naturalWidth){try{var ar=n.naturalWidth/n.naturalHeight,box=r.width/r.height,sx=0,sy=0,sw=n.naturalWidth,sh=n.naturalHeight;if(s.objectFit==='cover'){if(ar>box){sw=sh*box;sx=(n.naturalWidth-sw)/2;}else{sh=sw/box;sy=(n.naturalHeight-sh)/2;}}ctx.drawImage(n,sx,sy,sw,sh,r.left,r.top,r.width,r.height);}catch(e){}}
  if(n.tagName.toLowerCase()==='svg'){var image=this.svgImages.get(n);if(!image){image=new Image();this.svgImages.set(n,image);image.onload=this.onDirty;image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(n));}if(image.complete&&image.naturalWidth)try{ctx.drawImage(image,r.left,r.top,r.width,r.height);}catch(e){}}
 }
 ctx.globalAlpha=1;var glyphs=0;
 for(var text of this.textNodes){var parent=text.parentElement;if(!parent||!visible(parent))continue;this.range.selectNodeContents(text);var all=this.range.getBoundingClientRect();if(!overlaps(all,w,h))continue;
  var cs=getComputedStyle(parent),font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;ctx.font=font;ctx.fillStyle=cs.color;ctx.textBaseline='alphabetic';ctx.globalAlpha=Number(cs.opacity)||1;var chars=Array.from(text.nodeValue),offset=0;
  for(var character of chars){var count=character.length;this.range.setStart(text,offset);this.range.setEnd(text,offset+count);offset+=count;if(/\s/.test(character))continue;var box=this.range.getBoundingClientRect();if(!overlaps(box,w,h))continue;var value=cs.textTransform==='uppercase'?character.toUpperCase():character;var metrics=ctx.measureText(value),ascent=metrics.fontBoundingBoxAscent||parseFloat(cs.fontSize)*.84;ctx.fillText(value,box.left,box.top+ascent);glyphs++;}
 }
 ctx.globalAlpha=1;this.frames++;this.lastGlyphs=glyphs;this.lastMs=performance.now()-start;return c;
};
LiveDOMSource.prototype.report=function(){return {kind:'live DOM Range typography/box mirror',fixedImage:false,frames:this.frames,glyphs:this.lastGlyphs,rasterMs:this.lastMs,width:this.canvas.width,height:this.canvas.height};};
root.H53LiveDOMSource=LiveDOMSource;
})(window);
