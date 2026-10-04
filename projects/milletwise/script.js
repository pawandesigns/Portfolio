const steps={swap:{label:'A FAMILIAR START',title:'One swap.\nA clear next step.',copy:'The swap screen connects a grain to an existing meal. Suggested recipes help translate curiosity into something the user can cook.',note:'Design intent: reduce the effort of deciding where to begin.',alt:'MilletWise swap detail concept'},recipe:{label:'PREPARATION, MADE VISIBLE',title:'A familiar dish.\nAn unfamiliar grain.',copy:'Recipe details bring ingredients, servings, and preparation together. Familiar dishes give the user a practical context for trying a different grain.',note:'Design intent: answer practical questions before cooking starts.',alt:'MilletWise barnyard khichdi recipe detail concept'},cook:{label:'SUPPORT IN THE MOMENT',title:'Less reading.\nMore cooking.',copy:'Cooking mode focuses on the current step, a timer, and the ingredients needed now. A contextual tip helps the cook adapt to a grain they may not know.',note:'Design intent: reduce the need to remember or repeatedly scan instructions.',alt:'MilletWise step-by-step cooking mode concept'}};
let selected='swap';const tabs=[...document.querySelectorAll('[role=tab][data-step]')],img=document.querySelector('#flow-image'),panel=document.querySelector('#screen-panel');
function select(step,focus=false){selected=step;const s=steps[step];tabs.forEach(t=>{const active=t.dataset.step===step;t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;if(active&&focus)t.focus()});panel.setAttribute('aria-labelledby','tab-'+step);document.querySelector('#step-label').textContent=s.label;document.querySelector('#step-title').innerText=s.title;document.querySelector('#step-copy').textContent=s.copy;document.querySelector('#step-note').textContent=s.note;img.src='assets/'+step+'.webp';img.alt=s.alt;img.width=390;img.height={swap:1229,recipe:1981,cook:844}[step];document.querySelector('.screen-scroll').scrollTop=0}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t.dataset.step));t.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();select(tabs[n].dataset.step,true)}})});
const dialog=document.querySelector('#image-dialog');
const dialogImage=document.querySelector('#dialog-image');
const imageStatus=document.querySelector('#image-status');
const retryImage=document.querySelector('#retry-image');
let imageOpener=null;
function imageState(message,failed=false){
  imageStatus.textContent=message;imageStatus.hidden=!message;
  retryImage.hidden=!failed;
  dialogImage.hidden=Boolean(message);
  document.querySelector('#zoom-dialog').disabled=Boolean(message);
  dialog.setAttribute('aria-busy',message&&!failed?'true':'false');
}
dialogImage.addEventListener('load',()=>{dialogImage.width=dialogImage.naturalWidth;dialogImage.height=dialogImage.naturalHeight;imageState('');});
dialogImage.addEventListener('error',()=>imageState('This image could not load. Try again.',true));
function show(src,title,crop){
  imageOpener=document.activeElement;
  const visual=document.querySelector('#dialog-visual');
  visual.className=crop?'artifact-window':'';visual.setAttribute('style',crop||'');
  document.querySelector('#dialog-title').textContent=title;
  dialogImage.alt=title;dialogImage.loading='eager';
  imageState('Loading image…');dialogImage.src=src;
  dialog.showModal();dialog.scrollTop=0;dialog.scrollLeft=0;
  if(dialogImage.complete&&dialogImage.naturalWidth)imageState('');
}
retryImage.addEventListener('click',()=>{const source=dialogImage.getAttribute('src');imageState('Loading image…');dialogImage.removeAttribute('src');dialogImage.src=source;});
document.querySelectorAll('.image-open').forEach(button=>button.addEventListener('click',()=>show(button.dataset.image,button.dataset.title,button.dataset.crop)));
document.querySelector('#expand-screen').addEventListener('click',()=>show(img.getAttribute('src'),steps[selected].alt));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{if(imageOpener?.isConnected)imageOpener.focus({preventScroll:true});});
const chapters=[...document.querySelectorAll('.chapter-nav a')];
const chapterTargets=chapters.map(link=>document.querySelector(link.hash));
const progressBar=document.querySelector('.progress');
let progressQueued=false;
function progress(){
  progressQueued=false;
  const available=document.documentElement.scrollHeight-innerHeight;
  const percentage=available>0?scrollY/available*100:0;
  let current=0;
  // Read geometry together before updating styles.
  chapterTargets.forEach((section,i)=>{if(section&&section.getBoundingClientRect().top<170)current=i;});
  progressBar.style.width=percentage+'%';
  chapters.forEach((link,i)=>{const active=i===current;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
function queueProgress(){if(!progressQueued){progressQueued=true;requestAnimationFrame(progress);}}
addEventListener('scroll',queueProgress,{passive:true});
addEventListener('resize',queueProgress);
progress();
const zoomButton=document.querySelector('#zoom-dialog');zoomButton.addEventListener('click',()=>{const zoomed=dialog.classList.toggle('zoomed');zoomButton.textContent=zoomed?'Fit to view':'Zoom in';zoomButton.setAttribute('aria-pressed',zoomed)});dialog.addEventListener('close',()=>{dialog.classList.remove('zoomed');zoomButton.textContent='Zoom in';zoomButton.setAttribute('aria-pressed','false')});
