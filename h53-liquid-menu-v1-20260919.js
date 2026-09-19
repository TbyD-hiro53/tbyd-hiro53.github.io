/* Compact supplementary menu for works without an existing menu. */
(function(root){'use strict';
function H53LiquidMenu(host,options){
  options=options||{};const rootEl=host.root,make=(tag,id,text)=>{const e=document.createElement(tag);e.id=id;if(text)e.textContent=text;return e;};
  const toggle=make('button','h53-menu-toggle','•••'),panel=make('aside','h53-menu-panel'),restore=make('button','h53-ui-restore','操作を表示');
  toggle.type='button';toggle.setAttribute('aria-label','補助メニューを開く');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',panel.id);
  panel.className='h53-liquid-menu';panel.setAttribute('aria-label','補助メニュー');panel.hidden=true;restore.hidden=true;
  for(const e of [toggle,restore]){e.dataset.h53Liquid='control';e.className='h53-menu-pill';}
  panel.dataset.h53Liquid='panel';panel.dataset.h53LiquidAnchor='#'+toggle.id;
  if(options.top)rootEl.classList.add('h53-menu-at-top');
  let shown=true;
  function open(on){if(host.blocked)return;if(on)host.ui.open(panel,toggle);else host.ui.close(panel);toggle.setAttribute('aria-expanded',String(on));host.requestFrame();}
  for(const entry of options.actions||[]){const row=make('button',entry.id||'',entry.label);row.type='button';row.onclick=e=>entry.run(e,row,()=>open(false));panel.appendChild(row);}
  const full=make('button','h53-menu-fullscreen','全画面');full.onclick=()=>{open(false);host.fullscreen(full,()=>{const note=panel.querySelector('.h53-fullscreen-note')||make('p','','この環境ではブラウザ全画面を利用できない。作品を単独で開いても、OSやブラウザの操作欄が残る場合がある。');note.className='h53-fullscreen-note';if(!note.parentNode){const link=make('a','','作品を単独で開く');link.href=location.pathname+(location.search.includes('skipgc')?'?skipgc':'');link.target='_blank';link.rel='noopener';note.append(document.createElement('br'),link);panel.append(note);}open(true);});};
  const hide=make('button','h53-menu-hide','操作表示を隠す');panel.append(full,hide);rootEl.append(toggle,panel,restore);
  const prior=new Map();function visibility(on){if(host.blocked)return;shown=on;host.ui.hide(panel);toggle.setAttribute('aria-expanded','false');for(const e of rootEl.querySelectorAll(options.hideSelector||'#back,#hud,#title,#views,#origin')){if(!on){prior.set(e,e.hidden);e.hidden=true;}else if(prior.has(e)){e.hidden=prior.get(e);prior.delete(e);}}toggle.hidden=!on;restore.hidden=on;(on?toggle:restore).focus();host.requestFrame();}
  toggle.onclick=()=>open(panel.hidden);hide.onclick=()=>visibility(false);restore.onclick=()=>visibility(true);
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();open(false);toggle.focus();}});
  for(const e of [toggle,panel,restore])for(const type of ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click'])e.addEventListener(type,x=>x.stopPropagation());
  host.ui.discover();this.toggle=toggle;this.panel=panel;this.restore=restore;this.open=open;this.show=visibility;this.shown=()=>shown;
}
root.H53LiquidMenu=H53LiquidMenu;
})(window);
