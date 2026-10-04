(() => {
 'use strict';
 const catalog=window.FLOWER_IMAGE_CATALOG, $=id=>document.getElementById(id), key='flower100-image-draft-v1';
 const allowed=new Set(catalog.images.map(i=>i.path));
 function clean(raw){const result={version:1,pages:{}};for(const page of catalog.pages){for(const slot of page.slots){const v=raw?.pages?.[page.id]?.[slot.key];if(v&&allowed.has(v.src)){(result.pages[page.id]??={})[slot.key]={src:v.src,x:Number.isFinite(v.x)?Math.max(0,Math.min(100,v.x)):50,y:Number.isFinite(v.y)?Math.max(0,Math.min(100,v.y)):50};}}}return result;}
 let settings=clean(window.FLOWER_IMAGE_SETTINGS), stored=false;
 try{const draft=localStorage.getItem(key);if(draft){settings=clean(JSON.parse(draft));stored=true;}}catch{}
 let directory=null,ready=false;
 const page=()=>catalog.pages.find(p=>p.id===$('page').value), slot=()=>page().slots.find(s=>s.key===$('slot').value);
 const choice=()=>settings.pages[page().id]?.[slot().key];
 const message=text=>$('status').textContent=text;
 function remember(){try{localStorage.setItem(key,JSON.stringify(settings));message('下書きを保存しました。サイトに反映するには、下の保存ボタンを使ってください。');}catch{message('このブラウザでは下書きを保存できません。設定ファイルを保存してください。');}}
 function preview(focus=true){if(ready)$('preview').contentWindow.postMessage({type:'flower-image-preview',settings,focus:focus?slot().key:null},location.origin==='null'?'*':location.origin);}
 function renderSelection(){const selected=choice();$('selection').textContent=selected?`選択中：${selected.src.split('/').pop()}`:`元の画像：${slot().default.split('/').pop()||'写真なし'}`;for(const axis of ['x','y']){$(axis).value=selected?.[axis]??50;$(axis+'-value').textContent=$(axis).value+'%';}renderPhotos();preview();}
 function renderPhotos(){const group=$('group').value,term=$('search').value.trim().toLowerCase(),src=choice()?.src??slot().default;const images=catalog.images.filter(i=>(!group||i.group===group)&&i.label.toLowerCase().includes(term));$('count').textContent=`${images.length}枚 — クリックして選択`;$('photos').replaceChildren();for(const item of images){const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed',String(item.path===src));button.title=item.groupLabel+' / '+item.label;const image=document.createElement('img');image.src=item.thumb;image.alt=item.groupLabel+' '+item.label;image.loading='lazy';const label=document.createElement('span');label.textContent=item.label;button.append(image,label);button.addEventListener('click',()=>{(settings.pages[page().id]??={})[slot().key]={src:item.path,x:50,y:50};remember();renderSelection();});$('photos').append(button);}}
 function changePage(){const previous=$('slot').value;$('slot').replaceChildren(...page().slots.map(s=>new Option(s.label,s.key)));if(page().slots.some(s=>s.key===previous))$('slot').value=previous;$('group').value=page().group;ready=false;$('preview').src=page().id+'?image-preview=1';renderSelection();}
 $('page').append(...catalog.pages.map(p=>new Option(p.label,p.id)));
 $('group').append(new Option('すべての写真',''));for(const [group,label] of new Map(catalog.images.map(i=>[i.group,i.groupLabel])))$('group').append(new Option(label,group));
 $('page').addEventListener('change',changePage);$('slot').addEventListener('change',renderSelection);$('group').addEventListener('change',renderPhotos);$('search').addEventListener('input',renderPhotos);
 for(const axis of ['x','y'])$(axis).addEventListener('input',()=>{let v=choice();if(!v){if(!slot().default){message('先に写真を選んでください。');return;}v={src:slot().default,x:50,y:50};(settings.pages[page().id]??={})[slot().key]=v;}v[axis]=Number($(axis).value);$(axis+'-value').textContent=v[axis]+'%';remember();preview(false);});
 $('reset').addEventListener('click',()=>{if(settings.pages[page().id])delete settings.pages[page().id][slot().key];remember();renderSelection();});
 $('discard').addEventListener('click',()=>{if(!confirm('すべての下書きを取り消して、現在のサイトの設定に戻しますか？'))return;settings=clean(window.FLOWER_IMAGE_SETTINGS);remember();renderSelection();});
 window.addEventListener('message',event=>{if(event.source===$('preview').contentWindow&&event.origin===location.origin&&event.data?.type==='flower-image-ready'){ready=true;preview();}});
 const serialize=()=> 'window.FLOWER_IMAGE_SETTINGS = '+JSON.stringify(clean(settings),null,2)+';\n';
 $('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([serialize()],{type:'text/javascript;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='image-settings.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('設定ファイルをダウンロードしました。サイトの data/image-settings.js を置き換えてから、コミット・Pushしてください。');});
 const supported=typeof window.showDirectoryPicker==='function'&&window.isSecureContext;
 $('save').disabled=!supported;$('support').textContent=supported?'保存時は、index.html・records・data がある flower100-archive フォルダを選んでください。':'直接保存が使えない場合は「設定ファイルをダウンロード」を使ってください。公開後の編集画面をChromeで開くと、フォルダへ直接保存できます。';
 $('save').addEventListener('click',async()=>{try{if(!directory)directory=await window.showDirectoryPicker({id:'flower100-archive',mode:'readwrite'});await directory.getFileHandle('index.html');await directory.getDirectoryHandle('records');const data=await directory.getDirectoryHandle('data');await data.getFileHandle('image-catalog.js');const handle=await data.getFileHandle('image-settings.js');const writable=await handle.createWritable();await writable.write(serialize());await writable.close();window.FLOWER_IMAGE_SETTINGS=clean(settings);message('サイトのフォルダに保存しました。VS Codeで data/image-settings.js をコミット・Pushすると公開ページに反映されます。');}catch(error){directory=null;if(error.name!=='AbortError')message('保存できませんでした。flower100-archive フォルダを選び直すか、設定ファイルをダウンロードしてください。');}});
 changePage();message(stored?'前回の下書きを読み込みました。':'ページと変更する場所を選び、写真をクリックしてください。');
})();
