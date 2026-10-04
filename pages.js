// Shared, progressively enhanced behaviour for About and Play.
const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.header');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
function measureHeader() { root.style.setProperty('--header-height', `${header.offsetHeight}px`); }
let scrollFrame = 0;
function refreshHeader() { scrollFrame = 0; header.classList.toggle('is-scrolled', window.scrollY > 24); }
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(refreshHeader); }, {passive:true});
window.addEventListener('resize', measureHeader, {passive:true});
window.addEventListener('load', measureHeader, {once:true});
if ('ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
measureHeader(); refreshHeader();
const copyButton = document.getElementById('copy-email');
copyButton?.addEventListener('click', async () => {
 const status = document.getElementById('copy-status');
 try { await navigator.clipboard.writeText('pwnmishr18@gmail.com'); copyButton.textContent = 'Copied!'; status.textContent = 'Email copied to clipboard.'; setTimeout(() => { copyButton.textContent = 'Copy email'; status.textContent = ''; },3000); }
 catch { status.textContent = 'Select the email address to copy it, or click it to write to me.'; }
});
function entrance(el) {
 if (!reduced.matches && typeof el.animate === 'function') el.animate([{opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
}
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
 tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !active; });
 entrance(document.getElementById(tab.getAttribute('aria-controls')));
}
tabs.forEach((tab,i) => {
 tab.addEventListener('click', () => selectTab(tab));
 tab.addEventListener('keydown', event => {
  let next;
  if (['ArrowDown','ArrowRight'].includes(event.key)) next = (i+1)%tabs.length;
  if (['ArrowUp','ArrowLeft'].includes(event.key)) next = (i+tabs.length-1)%tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length-1;
  if (next !== undefined) {event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}
 });
});
const tiles = [...document.querySelectorAll('.play-tile')];
const filters = [...document.querySelectorAll('[data-filter]')];
const grid = document.querySelector('.play-collection-grid');
filters.forEach(button => button.addEventListener('click', () => {
 const kind = button.dataset.filter;
 filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 tiles.forEach(tile => {tile.hidden = kind !== 'all' && tile.dataset.kind !== kind;});
 grid.classList.toggle('is-filtered', kind !== 'all');
 const count = tiles.filter(tile => !tile.hidden).length;
 document.getElementById('filter-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'} to explore`;
 entrance(grid);
}));
const dialog = document.getElementById('play-dialog');
let currentTile = null;
let opener = null;
function showTile(tile) {
 currentTile = tile;
 const visible = tiles.filter(item => !item.hidden);
 const image = tile.querySelector('img');
 const expanded = document.getElementById('play-expanded');
 expanded.src = image.getAttribute('src'); expanded.alt = image.alt;
 document.getElementById('play-dialog-title').textContent = tile.dataset.title;
 document.getElementById('play-dialog-description').textContent = tile.dataset.description;
 document.getElementById('play-project').href = tile.dataset.url;
 document.getElementById('play-position').textContent = `${String(visible.indexOf(tile)+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
}
function stepTile(delta) {
 const visible = tiles.filter(tile => !tile.hidden);
 if (!visible.length) return;
 showTile(visible[(visible.indexOf(currentTile)+delta+visible.length)%visible.length]);
}
tiles.forEach(tile => tile.querySelector('.play-preview').addEventListener('click', event => {
 opener = event.currentTarget; showTile(tile); dialog.showModal(); root.classList.add('photo-open'); entrance(dialog);
}));
if (dialog) {
 document.getElementById('close-play').addEventListener('click', () => dialog.close());
 document.getElementById('previous-play').addEventListener('click', () => stepTile(-1));
 document.getElementById('next-play').addEventListener('click', () => stepTile(1));
 dialog.addEventListener('keydown', event => {if(event.key==='ArrowLeft'){event.preventDefault();stepTile(-1);}if(event.key==='ArrowRight'){event.preventDefault();stepTile(1);}});
 dialog.addEventListener('click', event => {if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
 dialog.addEventListener('close', () => {root.classList.remove('photo-open');opener?.focus();});
}
let observer;
function configureMotion() {
 observer?.disconnect();
 if (reduced.matches) {document.getAnimations?.().forEach(animation => animation.cancel());return;}
 if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entrance(entry.target);observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.about-context,.subsection-heading,.perspective,.story-heading,.story-illustration,.page-next,.play-tile,.contact-title').forEach(el => observer.observe(el));
 }
}
reduced.addEventListener('change',configureMotion);configureMotion();
