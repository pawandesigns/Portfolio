(() => {
  const root = document.querySelector('[data-vd-browser]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-vd-tab]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const nav = root.querySelector('.vd-nav');
  const pager = root.querySelector('.vd-pager');
  let current = 0;
  nav.setAttribute('role', 'tablist');
  tabs.forEach(tab => tab.setAttribute('role', 'tab'));
  panels.forEach(panel => { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
  function select(index, focus = false, saveLocation = false) {
    current = Math.max(0, Math.min(index, tabs.length - 1));
    if (saveLocation) history.replaceState(null, '', '#' + panels[current].id);
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
      panels[i].hidden = i !== current;
    });
    root.querySelector('[data-vd-count]').textContent = `${String(current + 1).padStart(2, '0')} / 09`;
    root.querySelector('[data-vd-current]').textContent = tabs[current].textContent.replace(/^\d+/, '').trim();
    root.querySelector('[data-vd-prev]').disabled = current === 0;
    root.querySelector('[data-vd-next]').disabled = current === tabs.length - 1;
    if (focus) tabs[current].focus({preventScroll: true});
    const selected = tabs[current];
    if (selected.offsetLeft < nav.scrollLeft || selected.offsetLeft + selected.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollLeft = Math.max(0, selected.offsetLeft - nav.offsetLeft - 12);
    }
    window.dispatchEvent(new Event('resize'));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index, false, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true, true); }
    });
  });
  root.querySelector('[data-vd-prev]').addEventListener('click', () => { select(current - 1, true, true); nav.scrollIntoView({block: 'start'}); });
  root.querySelector('[data-vd-next]').addEventListener('click', () => { select(current + 1, true, true); nav.scrollIntoView({block: 'start'}); });
  function useHash() {
    const legacyCraft = location.hash === '#visual-language';
    const hash = legacyCraft ? '#vd-imagery' : location.hash;
    const match = panels.findIndex(panel => '#' + panel.id === hash);
    if (match >= 0) {
      select(match);
      if (legacyCraft) requestAnimationFrame(() => nav.scrollIntoView({block: 'start'}));
    }
  }
  pager.hidden = false;
  select(0);
  useHash();
  window.addEventListener('hashchange', useHash);
})();
