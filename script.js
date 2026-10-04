const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('pwnmishr18@gmail.com');
    copyButton.textContent = 'Copied!'; copyStatus.textContent = 'Email copied to clipboard.';
    setTimeout(() => { copyButton.textContent = 'Copy email'; copyStatus.textContent = ''; }, 3000);
  } catch { copyStatus.textContent = 'Select the email address to copy it, or click it to write to me.'; }
});
document.getElementById('year').textContent = new Date().getFullYear();
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});
const photographs = [
 {image:'assets/awadh.webp', title:'Awadh unveiled', description:'Lucknow after dark. Finding a city’s identity in its architecture.', alt:'Rumi Darwaza in Lucknow illuminated at night', url:'https://www.pawandesignfolio.com/_files/ugd/b1cbab_531f020b515e4aceb4c9fe52be8057b9.pdf'},
 {image:'assets/varnh.webp', title:'Varnh', description:'A studio photography project exploring colour, identity, and the experience of being seen.', alt:'Layered studio portraits of two people against a dark background', url:'https://www.pawandesignfolio.com/_files/ugd/b1cbab_0e2ed360a41c430d84a723d06a13ef90.pdf'},
 {image:'assets/flowers.webp', title:'The Phool mandi', description:'Colour, texture, and everyday life in the flower market.', alt:'Flowers and bundled cloth in a local flower market', url:'https://www.pawandesignfolio.com/_files/ugd/b1cbab_c29d342fe44e45e38d9faf791bffe648.pdf'}
];
const dialog = document.getElementById('photo-dialog');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photographs.length) % photographs.length;
  const item = photographs[photoIndex];
  document.getElementById('expanded-photo').src = item.image;
  document.getElementById('expanded-photo').alt = item.alt;
  document.getElementById('photo-dialog-title').textContent = item.title;
  document.getElementById('photo-description').textContent = item.description;
  document.getElementById('photo-project').href = item.url;
  document.getElementById('photo-position').textContent = `0${photoIndex + 1} / 03`;
}
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  showPhoto(Number(button.dataset.photo)); dialog.showModal();
}));
document.getElementById('close-photo').addEventListener('click', () => dialog.close());
document.getElementById('previous-photo').addEventListener('click', () => showPhoto(photoIndex - 1));
document.getElementById('next-photo').addEventListener('click', () => showPhoto(photoIndex + 1));
dialog.addEventListener('keydown', event => {
 if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
 if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
});
dialog.addEventListener('click', event => {
 if (event.target === dialog) {
   const box = dialog.getBoundingClientRect();
   if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
 }
});

// Progressive motion enhancement. Content remains visible without JavaScript or motion support.
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const chapterNav = document.querySelector('.chapter-nav');
  const banners = [...document.querySelectorAll('.case-cover')];
  const chapters = [...document.querySelectorAll('.case-chapter')];
  const sections = ['work','about','play','contact'].map(id => document.getElementById(id));
  const headerLinks = [...document.querySelectorAll('.header nav a')];
  const chapterLinks = [...chapterNav.querySelectorAll('a')];
  const prints = [...document.querySelectorAll('.photo-print')];
  const portrait = document.querySelector('.portrait-card');
  const artifact = document.querySelector('.contact-mark');
  const progress = document.createElement('div');
  progress.className = 'page-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let frame = 0;
  let entranceObserver;
  const seen = new WeakSet();
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const supportsAnimation = typeof Element.prototype.animate === 'function';
  function animate(element, keyframes, options = {}) {
    if (!element || reduced.matches || !supportsAnimation) return;
    element.animate(keyframes, {duration:700, easing:'cubic-bezier(.22,1,.36,1)', ...options});
  }
  function setActive(links, id) {
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  function update() {
    frame = 0;
    const height = window.innerHeight;
    const pageY = window.scrollY;
    const maxY = root.scrollHeight - height;
    progress.style.transform = `scaleX(${maxY > 0 ? clamp(pageY / maxY, 0, 1) : 0})`;
    header.classList.toggle('is-scrolled', pageY > 24);
    const threshold = header.offsetHeight + Math.min(height * .23, 190);
    let activeSection = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) activeSection = section.id; });
    setActive(headerLinks, activeSection);
    let activeChapter = '';
    chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top <= threshold + chapterNav.offsetHeight) activeChapter = chapter.id; });
    setActive(chapterLinks, activeChapter);
    if (reduced.matches) return;
    banners.forEach(banner => {
      const box = banner.getBoundingClientRect();
      if (box.bottom < -80 || box.top > height + 80) return;
      const reveal = clamp((height - box.top) / (height * .7), 0, 1);
      const center = clamp((box.top + box.height * .5 - height * .5) / height, -1, 1);
      const distance = window.innerWidth <= 700 ? 11 : 25;
      banner.style.setProperty('--banner-scale', (0.965 + reveal * .035).toFixed(4));
      banner.style.setProperty('--media-y', `${(center * distance).toFixed(2)}px`);
      banner.style.setProperty('--copy-y', `${(center * -distance * .24).toFixed(2)}px`);
      banner.style.setProperty('--screen-turn', `${(center * 3).toFixed(2)}deg`);
    });
    prints.forEach((print, i) => {
      const box = print.getBoundingClientRect();
      if (box.bottom < 0 || box.top > height) return;
      const center = clamp((box.top + box.height / 2 - height / 2) / height,-1,1);
      print.style.setProperty('--photo-y', `${(center * (i === 1 ? -16 : 12)).toFixed(2)}px`);
    });
    if (artifact) {
      const box = artifact.getBoundingClientRect();
      if (box.bottom > 0 && box.top < height) artifact.style.setProperty('--artifact-turn', `${clamp((height - box.top) / height,0,1) * 10 - 5}deg`);
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function measure() {
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
    root.style.setProperty('--chapter-height', `${chapterNav.offsetHeight + 14}px`);
    schedule();
  }
  function enter(element, index = 0) {
    if (seen.has(element)) return;
    seen.add(element);
    animate(element, [{opacity:0, transform:'translateY(30px)'},{opacity:1, transform:'translateY(0)'}], {duration:850,delay:index * 60,fill:'backwards'});
  }
  function configureMotion() {
    entranceObserver?.disconnect();
    root.classList.toggle('motion-ready', !reduced.matches);
    if (reduced.matches) {
      document.getAnimations().forEach(animation => animation.cancel());
      portrait.style.removeProperty('--portrait-rx'); portrait.style.removeProperty('--portrait-ry');
      portrait.style.removeProperty('--portrait-x'); portrait.style.removeProperty('--portrait-y');
      schedule(); return;
    }
    if ('IntersectionObserver' in window) {
      entranceObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          enter(entry.target);
          entranceObserver.unobserve(entry.target);
        });
      }, {threshold:.12,rootMargin:'0px 0px -25px 0px'});
      document.querySelectorAll('.gallery-opening,.case-detail,.recognition-line,.work-directory,.about-studio-top,.about-statement,.perspective,.story-heading,.story-illustration,.story-chapter,.story-postscript,.play-heading,.play-intro,.play-bottom,.contact-prelude,.contact-title,.contact-invitation').forEach(element => entranceObserver.observe(element));
    }
    schedule();
  }
  portrait.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches) return;
    const box = portrait.getBoundingClientRect();
    const x = clamp((event.clientX - box.left) / box.width - .5,-.5,.5);
    const y = clamp((event.clientY - box.top) / box.height - .5,-.5,.5);
    portrait.style.setProperty('--portrait-rx', `${-y * 9}deg`);
    portrait.style.setProperty('--portrait-ry', `${x * 11}deg`);
    portrait.style.setProperty('--portrait-x', `${x * 5}px`);
    portrait.style.setProperty('--portrait-y', `${y * 5}px`);
  });
  portrait.addEventListener('pointerleave', () => {
    ['--portrait-rx','--portrait-ry','--portrait-x','--portrait-y'].forEach(property => portrait.style.removeProperty(property));
  });
  tabs.forEach(tab => tab.addEventListener('click', () => animate(document.getElementById(tab.getAttribute('aria-controls')), [{opacity:.2,translate:'0 10px'},{opacity:1,translate:'0 0'}], {duration:380})));
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => animate(dialog,[{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:400})));
  const expanded = document.getElementById('expanded-photo');
  expanded.addEventListener('load', () => { if (dialog.open) animate(expanded,[{opacity:.25},{opacity:1}],{duration:260}); });
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => root.classList.add('photo-open')));
  dialog.addEventListener('close', () => { root.classList.remove('photo-open'); schedule(); });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('load',measure,{once:true});
  reduced.addEventListener('change',configureMotion);
  if ('ResizeObserver' in window) { const sizeObserver = new ResizeObserver(measure); sizeObserver.observe(header); sizeObserver.observe(chapterNav); }
  measure(); configureMotion();
  function revealHero() {
    if (!reduced.matches && window.scrollY < 40) document.querySelectorAll('.hero-top,.hero-copy h1,.intro,.hero-actions,.hero-art,.hero-bottom').forEach((element,index) => enter(element,index));
  }
  window.addEventListener('pawan:entrance-complete',revealHero,{once:true});
  if (!root.classList.contains('gate-active')) revealHero();
})();
