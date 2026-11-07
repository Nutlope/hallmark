// Themes: the genre filter, the material line for the theme under the pointer, and the full picture in a dialog.
(function () {
  const grid = document.querySelector('[data-th-grid]');
  if (!grid) return;
  const items = [...grid.querySelectorAll('.th')];
  const filter = document.querySelector('[data-th-filter]');
  const more = document.querySelector('[data-th-more]');
  if (more) more.addEventListener('click', () => { grid.classList.add('is-all'); const next = grid.querySelector('.th:nth-child(11) .th__link'); if (next) next.focus(); });

  filter.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filter.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const g = b.dataset.genre;
    items.forEach((li) => { li.hidden = g !== 'all' && li.dataset.genre !== g; });
    if (g !== 'all') grid.classList.add('is-all');
  });

  const dlg = document.querySelector('[data-th-dlg]');
  if (!dlg || !dlg.showModal) return;
  const dName = dlg.querySelector('[data-th-dlg-name]');
  const dMat = dlg.querySelector('[data-th-dlg-mat]');
  const frame = dlg.querySelector('[data-th-dlg-frame]');
  const page = dlg.querySelector('[data-th-dlg-page]');
  // the live page, laid out at 1440 wide and scaled to the frame, scrolls inside the dialog
  const fit = () => {
    const w = frame.clientWidth, h = frame.clientHeight, k = w / 1440;
    page.style.transform = `scale(${k})`;
    page.style.height = `${h / k}px`;
  };
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(frame);
  const dOpen = dlg.querySelector('[data-th-dlg-open]');
  let from, cur;
  const visible = () => [...grid.querySelectorAll('.th:not([hidden]) .th__link')]
    .filter((link) => link.getClientRects().length > 0);
  const fillDlg = (b) => {
    cur = b;
    dName.textContent = b.dataset.name;
    dMat.textContent = b.dataset.mat;
    frame.classList.add('is-loading');
    page.onload = () => frame.classList.remove('is-loading');
    page.src = `themes/${b.dataset.slug}/`;
    page.title = `The page built in the ${b.dataset.name} theme`;
    dOpen.href = `themes/${b.dataset.slug}/`;

  };
  const step = (k) => { const v = visible(); const n = v.indexOf(cur); fillDlg(v[(n + k + v.length) % v.length]); };
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.th__link'); if (!b || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    from = b; fillDlg(b);
    dlg.showModal(); fit();
  });
  dlg.querySelector('[data-th-dlg-prev]').addEventListener('click', () => step(-1));
  dlg.querySelector('[data-th-dlg-next]').addEventListener('click', () => step(1));
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } });
  dlg.querySelector('[data-th-dlg-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { const v = visible(); (v.includes(cur) ? cur : from).focus(); });
})();
