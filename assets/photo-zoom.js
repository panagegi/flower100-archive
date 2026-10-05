(() => {
 'use strict';
 const box=document.getElementById('lightbox');if(!box)return;
 box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','写真の拡大表示');
 const image=box.querySelector('img'),close=box.querySelector('.lightbox-close');
 const stage=document.createElement('div');stage.className='zoom-stage';image.parentNode.insertBefore(stage,image);stage.append(image);
 const toolbar=document.createElement('div');toolbar.className='zoom-toolbar';
 toolbar.innerHTML='<button type="button" data-zoom="out" aria-label="写真を縮小">−</button><output aria-live="polite">100%</output><button type="button" data-zoom="in" aria-label="写真を拡大">＋</button><button type="button" data-zoom="reset">全体を見る</button>';
 box.insertBefore(toolbar,stage);const help=document.createElement('p');help.className='zoom-help';help.textContent='＋で拡大・ドラッグで移動 ／ タッチでは2本指で拡大';box.append(help);
 let scale=1,x=0,y=0,baseW=0,baseH=0,lastFocus=null,oldOverflow='',moved=false,pinched=false;
 const pointers=new Map(), output=toolbar.querySelector('output');
 function draw(){const maxX=Math.max(0,(baseW*scale-stage.clientWidth)/2),maxY=Math.max(0,(baseH*scale-stage.clientHeight)/2);x=Math.max(-maxX,Math.min(maxX,x));y=Math.max(-maxY,Math.min(maxY,y));image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;output.value=Math.round(scale*100)+'%';output.textContent=output.value;toolbar.querySelector('[data-zoom="out"]').disabled=scale<=1;toolbar.querySelector('[data-zoom="in"]').disabled=scale>=4;stage.classList.toggle('zoomed',scale>1);}
 function fit(){if(!image.naturalWidth)return;const ratio=Math.min(stage.clientWidth*.96/image.naturalWidth,stage.clientHeight*.96/image.naturalHeight,1);baseW=image.naturalWidth*ratio;baseH=image.naturalHeight*ratio;image.style.width=baseW+'px';image.style.height=baseH+'px';draw();}
 function zoom(next,cx=stage.clientWidth/2,cy=stage.clientHeight/2){next=Math.max(1,Math.min(4,next));const ratio=next/scale; x=(cx-stage.clientWidth/2)*(1-ratio)+x*ratio;y=(cy-stage.clientHeight/2)*(1-ratio)+y*ratio;scale=next;draw();}
 function reset(){scale=1;x=y=0;draw();}
 function dismiss(){box.classList.remove('active');image.removeAttribute('src');pointers.clear();document.body.style.overflow=oldOverflow;lastFocus?.focus();}
 document.querySelectorAll('.gallery button').forEach(button=>button.addEventListener('click',()=>{const source=button.querySelector('img');lastFocus=button;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';reset();image.src=source.dataset.full||source.src;image.alt=source.alt;box.classList.add('active');fit();close.focus();}));
 image.addEventListener('load',fit);window.addEventListener('resize',fit);close.addEventListener('click',dismiss);
 box.addEventListener('click',event=>{if(event.target===box)dismiss();});
 toolbar.addEventListener('click',event=>{const action=event.target.dataset.zoom;if(action==='reset')reset();else if(action)zoom(scale*(action==='in'?1.5:1/1.5));});
 stage.addEventListener('wheel',event=>{event.preventDefault();const r=stage.getBoundingClientRect();zoom(scale*Math.exp(-event.deltaY*.002),event.clientX-r.left,event.clientY-r.top);},{passive:false});
 const geometry=()=>{const a=[...pointers.values()];return{distance:Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),cx:(a[0].x+a[1].x)/2,cy:(a[0].y+a[1].y)/2};};
 stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;if(!pointers.size){moved=false;pinched=false;}pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});stage.setPointerCapture(event.pointerId);if(pointers.size>1)pinched=true;});
 stage.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId))return;const previous=pointers.get(event.pointerId),before=pointers.size===2?geometry():null;const dx=event.clientX-previous.x,dy=event.clientY-previous.y;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(Math.abs(dx)+Math.abs(dy)>2)moved=true;if(pointers.size===2){const after=geometry(),r=stage.getBoundingClientRect();if(before.distance>0)zoom(scale*after.distance/before.distance,after.cx-r.left,after.cy-r.top);x+=after.cx-before.cx;y+=after.cy-before.cy;draw();}else if(scale>1){x+=dx;y+=dy;draw();}});
 function release(event){if(!pointers.has(event.pointerId))return;const tap=!moved&&!pinched&&pointers.size===1&&event.type==='pointerup';pointers.delete(event.pointerId);if(tap&&event.target===image){const r=stage.getBoundingClientRect();zoom(scale===1?2:1,event.clientX-r.left,event.clientY-r.top);}}
 stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',event=>pointers.delete(event.pointerId));image.draggable=false;
 document.addEventListener('keydown',event=>{if(!box.classList.contains('active'))return;if(event.key==='Escape')dismiss();else if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();if(event.key==='0')reset();else if(event.key==='+'||event.key==='=')zoom(scale*1.5);else if(event.key==='-')zoom(scale/1.5);else{x+=event.key==='ArrowLeft'?60:event.key==='ArrowRight'?-60:0;y+=event.key==='ArrowUp'?60:event.key==='ArrowDown'?-60:0;draw();}}else if(event.key==='Tab'){const buttons=[...box.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
})();
