'use strict';
const sections = [
  ['Entry',4,'The first impression, account introduction, and terms.'],
  ['SUZUKI ID',3,'Corporate identity pages are external surfaces, reproduced as part of the real journey.'],
  ['Setup',2,'Permissions and profile creation prepare the first-use experience.'],
  ['Personality',7,'An invitation, five questions, and a personality result.'],
  ['Map',6,'Nationwide and street-level maps, pin detail, post detail, and pick-up views.'],
  ['Discover',4,'Filters, list results, map results, and the record reached from discovery.'],
  ['Create a record',5,'Choose a starting point, select a photo or location, and complete a record.'],
  ['Account & support',4,'My page, support, frequently asked questions, and feature introduction.'],
  ['System states',2,'An empty saved collection and a connection error.'],
  ['Proposed',5,'These five frames are currently labelled as proposed in Figma. The handoff notes that some may be evidenced in source recordings; their status needs reconciliation.']
];
const tabs = document.querySelector('.gallery-tabs');
const galleryImage = document.querySelector('#gallery-img');
const galleryOpen = document.querySelector('#gallery-open');
function chooseSection(index, focus = false) {
  const [name,count,description] = sections[index];
  const number = String(index+1).padStart(2,'0');
  [...tabs.children].forEach((button,i) => { button.setAttribute('aria-selected', String(i===index)); button.tabIndex = i===index ? 0 : -1; });
  document.querySelector('#gallery-title').textContent = `${number} / ${name}`;
  document.querySelector('#gallery-count').textContent = `${count} screens`;
  document.querySelector('#gallery-description').textContent = description;
  galleryImage.src = `assets/screens-${number}.webp`;
  galleryImage.alt = `${name}: ${count} reconstructed JimJam screens. ${description}`;
  galleryOpen.dataset.image = galleryImage.getAttribute('src');
  galleryOpen.dataset.caption = `${name} — ${count} screens. ${description}`;
  galleryOpen.setAttribute('aria-label', `Enlarge ${name} screens`);
  document.querySelector('#gallery-panel').setAttribute('aria-labelledby',`gallery-tab-${index}`);
  if (focus) tabs.children[index].focus();
}
sections.forEach(([name],index) => {
  const button = document.createElement('button');
  button.type='button'; button.setAttribute('role','tab'); button.id=`gallery-tab-${index}`;
  button.setAttribute('aria-controls','gallery-panel');
  button.textContent=name; button.addEventListener('click',()=>chooseSection(index));
  button.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight') next=(index+1)%sections.length;
    else if(event.key==='ArrowLeft') next=(index-1+sections.length)%sections.length;
    else if(event.key==='Home') next=0;
    else if(event.key==='End') next=sections.length-1;
    if(next!==undefined){event.preventDefault();chooseSection(next,true);}
  });
  tabs.append(button);
});
chooseSection(0);
const dialog=document.querySelector('#image-dialog');
const dialogImage=document.querySelector('#dialog-image');
const zoom=document.querySelector('#zoom-toggle');
const imageWrap=document.querySelector('.dialog-image-wrap');
let imageTrigger=null;
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
  imageTrigger=button;
  dialogImage.src=button.dataset.image;
  dialogImage.alt=button.dataset.caption || button.querySelector('img')?.alt || 'Enlarged project image';
  document.querySelector('#dialog-caption').textContent=dialogImage.alt;
  imageWrap.classList.remove('actual');zoom.setAttribute('aria-pressed','false');zoom.textContent='Actual size';
  dialog.showModal();document.body.classList.add('dialog-open');
  document.querySelector('#dialog-close').focus();
}));
document.querySelector('#dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');imageTrigger?.focus({preventScroll:true});});
zoom.addEventListener('click',()=>{const actual=imageWrap.classList.toggle('actual');zoom.setAttribute('aria-pressed',String(actual));zoom.textContent=actual?'Fit image':'Actual size';});
const chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
const chapterElements=chapterLinks.map(a=>document.querySelector(a.getAttribute('href')));
let scrollTick=false;
function updateChapter(){scrollTick=false;const offset=window.innerWidth<=760?150:190;let active=0;chapterElements.forEach((el,i)=>{if(el.getBoundingClientRect().top<=offset)active=i;});chapterLinks.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateChapter);}},{passive:true});
window.addEventListener('resize',updateChapter);updateChapter();
