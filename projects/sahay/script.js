const chapters = [...document.querySelectorAll('.chapter')];
const navLinks = [...document.querySelectorAll('.chapter-nav a')];
const researchDetails = [...document.querySelectorAll('.research-detail')];
const researchToggle = document.querySelector('#toggle-research');
const dialog = document.querySelector('dialog');
const enlarged = document.querySelector('#enlarged-image');
const canvas = document.querySelector('.viewer-canvas');
const zoomButton = document.querySelector('#zoom-image');
const imageStatus = document.querySelector('#image-status');
let lastFocus = null;
function resetZoom() {
  canvas.classList.remove('is-zoomed');
  zoomButton.setAttribute('aria-pressed', 'false');
  zoomButton.textContent = 'Zoom in';
  canvas.scrollTo(0, 0);
}
function imageReady() {
  canvas.setAttribute('aria-busy', 'false');
  imageStatus.hidden = true;
  zoomButton.disabled = false;
  canvas.style.setProperty('--image-full-width', `${Math.max(enlarged.naturalWidth, canvas.clientWidth * 1.5)}px`);
}
enlarged.addEventListener('load', imageReady);
enlarged.addEventListener('error', () => {
  canvas.setAttribute('aria-busy', 'false');
  imageStatus.textContent = 'This image could not load. Use “Open original image” to view the source.';
  imageStatus.hidden = false;
  zoomButton.disabled = true;
});
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  lastFocus = button;
  resetZoom();
  canvas.setAttribute('aria-busy', 'true');
  imageStatus.textContent = 'Loading the detailed image…';
  imageStatus.hidden = false;
  zoomButton.disabled = true;
  enlarged.alt = button.dataset.caption;
  enlarged.removeAttribute('height');
  document.querySelector('#image-caption').textContent = button.dataset.caption;
  document.querySelector('#original-image').href = button.dataset.source || button.dataset.image;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  enlarged.src = button.dataset.image;
  if (enlarged.complete && enlarged.naturalWidth) imageReady();
}));
zoomButton.addEventListener('click', () => {
  const zoomed = canvas.classList.toggle('is-zoomed');
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? 'Fit to screen' : 'Zoom in';
});
document.querySelector('#close-image').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  resetZoom();
  lastFocus?.focus({preventScroll:true});
});
let scheduled = false;
let activeId = '';
function updateReadingPosition() {
  scheduled = false;
  const total = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.read-progress').style.width = `${Math.max(0, Math.min(100, total > 0 ? scrollY / total * 100 : 0))}%`;
  let current = 'overview';
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top <= 160) current = chapter.dataset.nav || chapter.id;
    else break;
  }
  if (current === activeId) return;
  activeId = current;
  for (const link of navLinks) {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'location');
      const nav = link.parentElement;
      nav.scrollTo({left: Math.max(0, link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2), behavior:'auto'});
    } else link.removeAttribute('aria-current');
  }
}
function requestReadingUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateReadingPosition); }
}
function updateResearchToggle() {
  const allOpen = researchDetails.every(detail => detail.open);
  researchToggle.textContent = allOpen ? 'Collapse research boards' : 'Expand all research boards';
  researchToggle.setAttribute('aria-expanded', String(allOpen));
  requestReadingUpdate();
}
researchToggle.setAttribute('aria-controls', researchDetails.map(detail => detail.id).join(' '));
researchToggle.addEventListener('click', () => {
  const shouldOpen = !researchDetails.every(detail => detail.open);
  researchDetails.forEach(detail => { detail.open = shouldOpen; });
  updateResearchToggle();
});
researchDetails.forEach(detail => detail.addEventListener('toggle', updateResearchToggle));
let printState;
window.addEventListener('beforeprint', () => {
  printState = researchDetails.map(detail => detail.open);
  researchDetails.forEach(detail => { detail.open = true; });
});
window.addEventListener('afterprint', () => {
  if (printState) researchDetails.forEach((detail, i) => { detail.open = printState[i]; });
  printState = undefined;
  updateResearchToggle();
});
window.addEventListener('scroll', requestReadingUpdate, {passive:true});
window.addEventListener('resize', requestReadingUpdate);
window.addEventListener('load', updateReadingPosition);
if ('ResizeObserver' in window) new ResizeObserver(requestReadingUpdate).observe(document.querySelector('main'));
updateReadingPosition();
