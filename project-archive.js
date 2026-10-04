(() => {
 const dialog=document.querySelector('.archive-viewer');
 const image=document.getElementById('archive-image');
 const zoom=document.getElementById('archive-zoom');
 let trigger;
 function reset(){dialog.classList.remove('actual');zoom.textContent='Actual size';zoom.setAttribute('aria-pressed','false');}
 document.querySelectorAll('.board-open').forEach(button=>button.addEventListener('click',()=>{
  trigger=button;reset();image.src=button.dataset.image;image.alt=button.querySelector('img').alt;
  document.getElementById('archive-full-image').href=button.dataset.image;
  dialog.showModal();document.body.classList.add('image-open');document.getElementById('archive-close').focus();
 }));
 zoom.addEventListener('click',()=>{const active=dialog.classList.toggle('actual');zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'Fit to view':'Actual size';});
 document.getElementById('archive-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('image-open');reset();trigger?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
})();
