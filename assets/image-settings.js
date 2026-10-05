(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const path = decodeURIComponent(location.pathname.slice(root.pathname.length));
  const catalog = window.FLOWER_IMAGE_CATALOG;
  const page = catalog.pages.find(p => p.id === path);
  if (!page) return;
  const allowed = new Set(catalog.images.map(i => i.path));
  const originals = new Map();
  for (const slot of page.slots) {
    const node = document.querySelector(slot.selector);
    if (node) {const note = slot.key === 'kit' ? document.querySelector('.kit-note') : null; originals.set(slot.key, {node, style: node.getAttribute('style'), html: node.innerHTML, note, noteHTML: note?.innerHTML, role:node.getAttribute('role'), label:node.getAttribute('aria-label')});}
  }
  function apply(settings, focus) {
    for (const slot of page.slots) {
      const original = originals.get(slot.key);
      if (!original) continue;
      const {node} = original;
      if (original.style === null) node.removeAttribute('style'); else node.setAttribute('style', original.style);
      if (slot.key === 'kit') {node.innerHTML = original.html; if(original.note)original.note.innerHTML=original.noteHTML; for(const [attr,value] of [['role',original.role],['aria-label',original.label]]){if(value===null)node.removeAttribute(attr);else node.setAttribute(attr,value);}}
      const choice = settings?.pages?.[page.id]?.[slot.key];
      if (choice && allowed.has(choice.src)) {
        const x = Number.isFinite(choice.x) ? Math.max(0, Math.min(100, choice.x)) : 50;
        const y = Number.isFinite(choice.y) ? Math.max(0, Math.min(100, choice.y)) : 50;
        const url = new URL(choice.src, root).href;
        const overlays = {hero:'linear-gradient(rgba(0,0,0,.10),rgba(0,0,0,.82)),',top:'linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.90)),',archive:'linear-gradient(rgba(0,0,0,.68),rgba(0,0,0,.93)),',none:''};
        node.style.backgroundImage = (overlays[slot.overlay] || '') + 'url("' + url + '")';
        node.style.backgroundSize = 'cover';
        node.style.backgroundPosition = `${x}% ${y}%`;
        if (slot.key === 'kit') { node.replaceChildren(); node.setAttribute('role','img'); node.setAttribute('aria-label','選択した装備写真'); if(!slot.default&&original.note)original.note.textContent='この日の記録道具。'; }
      }
      if (focus === slot.key) node.scrollIntoView?.({block: slot.key === 'background' ? 'start' : 'center', behavior:'instant'});
    }
    if (new URLSearchParams(location.search).has('image-preview') && window.parent !== window) addPickButtons();
  }
  function addPickButtons() {
    document.querySelectorAll('[data-image-pick]').forEach(button => button.remove());
    for(const slot of page.slots){
      const node=originals.get(slot.key)?.node;if(!node)continue;
      const button=document.createElement('button');button.type='button';button.dataset.imagePick=slot.key;
      button.textContent=slot.key==='background'?'このページの背景を変更':'この画像を変更';
      button.style.cssText='position:absolute;top:12px;right:12px;z-index:1100;padding:10px 14px;background:#d9b765;color:#17180f;border:2px solid #17180f;border-radius:6px;font:14px system-ui;cursor:pointer;letter-spacing:normal;';
      if(slot.key==='background'){button.style.position='fixed';document.body.append(button);}else{if(getComputedStyle(node).position==='static')node.style.position='relative';node.append(button);}
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();window.parent.postMessage({type:'flower-image-pick',slot:slot.key},location.origin==='null'?'*':location.origin);});
    }
  }
  apply(window.FLOWER_IMAGE_SETTINGS);
  if (new URLSearchParams(location.search).has('image-preview') && window.parent !== window) {
    window.addEventListener('message', event => {
      if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'flower-image-preview') return;
      apply(event.data.settings, event.data.focus);
    });
    window.parent.postMessage({type:'flower-image-ready'}, location.origin === 'null' ? '*' : location.origin);
  }
})();
