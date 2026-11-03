// With and without: the same prompt built by the same model, the two whole pages one over the other.
// Drag the divider (or move it with the arrow keys); the frame stays put while the page scrolls and both pages read through.
// The divider sweeps once when the frame arrives, then it is the visitor's.
(function () {
  const stage = document.querySelector('[data-cmp]');
  if (!stage) return;
  const D = JSON.parse(document.querySelector('[data-cmp-data]').textContent);
  const scroller = stage.querySelector('[data-cmp-scroll]');
  const handle = stage.querySelector('[data-cmp-handle]');
  const bare = stage.querySelector('[data-cmp-bare]');
  const hm = stage.querySelector('[data-cmp-hm]');
  const fBare = stage.querySelector('[data-f-bare]');
  const fHm = stage.querySelector('[data-f-hm]');
  const reduce = HM.reduce;
  const space = stage.querySelector('[data-cmp-space]');
  // both pages scroll together and arrive at their ends together: the frame never shows past either page
  let pair = D[0];
  // no scroll of its own: the frame holds still while the page scrolls past it, and that scroll reads both
  // pages from top to bottom, so the wheel never gets caught inside the frame
  const pin = document.querySelector('[data-cmp-pin]');
  let travel = 0;
  const fit = () => {
    const W = stage.clientWidth, H = stage.clientHeight;
    stage.style.setProperty('--fh', H + 'px');
    space.style.height = H + 'px';
    const over = Math.max(W * pair.bareH / 1440, W * pair.hmH / 1440) - H;
    travel = Math.round(Math.min(Math.max(over * 0.55, innerHeight * 0.6), innerHeight * 1.6));
    pin.style.height = H + travel + 'px';
    stage.style.top = Math.max(84, (innerHeight - H) / 2 + 24) + 'px';
    move();
  };
  const move = () => {
    const W = stage.clientWidth, H = stage.clientHeight;
    const r = pin.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const p = travel > 0 ? Math.min(1, Math.max(0, (top - r.top) / travel)) : 0;
    bare.style.transform = `translateY(${(-p * Math.max(0, W * pair.bareH / 1440 - H)).toFixed(1)}px)`;
    hm.style.transform = `translateY(${(-p * Math.max(0, W * pair.hmH / 1440 - H)).toFixed(1)}px)`;
  };
  addEventListener('scroll', () => requestAnimationFrame(move), { passive: true });
  addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
  fit();

  let at = 50, touched = false, sweep = 0;
  const set = (v) => {
    at = Math.max(0, Math.min(100, v));
    stage.style.setProperty('--at', at + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(at)));
    handle.setAttribute('aria-valuetext', `${Math.round(at)} percent shows the page without Hallmark`);
  };
  const mine = () => { touched = true; cancelAnimationFrame(sweep); };
  const fromX = (x) => { const r = stage.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };

  let drag = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.pointerType === 'touch' && !e.target.closest('[data-cmp-handle]'))) return;
    e.preventDefault(); mine(); drag = true; stage.classList.add('is-drag');
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    fromX(e.clientX);
  });
  stage.addEventListener('pointermove', (e) => { if (drag) fromX(e.clientX); });
  const end = () => { drag = false; stage.classList.remove('is-drag'); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 2; const k = e.key; let v = null;
    if (k === 'ArrowLeft' || k === 'ArrowDown') v = at - step;
    else if (k === 'ArrowRight' || k === 'ArrowUp') v = at + step;
    else if (k === 'Home') v = 0; else if (k === 'End') v = 100;
    if (v !== null) { e.preventDefault(); mine(); set(v); }
  });

  // one quick sweep, right then left then home: about a second
  const runSweep = () => {
    if (touched || reduce.matches) return;
    const keys = [[0, 50], [360, 74], [800, 30], [1100, 50]];
    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const t0 = performance.now();
    const tick = (now) => {
      if (touched) return;
      const t = now - t0;
      let k = 1; while (k < keys.length - 1 && t > keys[k][0]) k++;
      const [ta, va] = keys[k - 1], [tb, vb] = keys[k];
      set(va + (vb - va) * ease(Math.min(1, Math.max(0, (t - ta) / (tb - ta)))));
      if (t < keys[keys.length - 1][0]) sweep = requestAnimationFrame(tick);
    };
    sweep = requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(runSweep, 150); } }, { threshold: 0.55 });
    io.observe(stage);
  }

  const say = (n) => `${n} ${n === 1 ? 'issue' : 'issues'}`;
  // every pair is fetched ahead, so a tab never swaps to a page still on its way (a failed fetch retries once)
  const ready = {};
  const fetchPair = (p) => ready[p.id] || (ready[p.id] = Promise.all(['bare', 'hallmark'].map((k) => new Promise((res) => {
    const im = new Image(); let tries = 0;
    const go = () => { im.src = `assets/cmp/${p.id}-${k}-full.webp${tries ? '?r=' + tries : ''}`; };
    im.onload = () => res(im.src); im.onerror = () => (tries++ < 1 ? setTimeout(go, 400) : res(null)); go();
  }))));
  const warm = () => D.forEach(fetchPair);
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 }); else setTimeout(warm, 1500);
  let selection = 0;
  HM.tabs(document.querySelector('[data-cmp-tabs]'), (n) => {
    const generation = ++selection;
    const p = D[n];
    const swap = (srcs) => {
      if (generation !== selection) return;
      bare.src = srcs[0] || `assets/cmp/${p.id}-bare-full.webp`; bare.height = p.bareH;
      hm.src = srcs[1] || `assets/cmp/${p.id}-hallmark-full.webp`; hm.height = p.hmH;
      bare.alt = `Without Hallmark: the whole ${p.label.toLowerCase()} page Opus 5.5 on low effort built from the prompt alone.`;
      hm.alt = `With Hallmark: the whole ${p.label.toLowerCase()} page Opus 5.5 on low effort built from the same prompt.`;
      fBare.textContent = say(p.bare); fHm.textContent = say(p.hm);
      pair = p; fit();
    };
    if (reduce.matches) { stage.classList.remove('is-swap'); fetchPair(p).then(swap); return; }
    stage.classList.add('is-swap');
    Promise.all([fetchPair(p), new Promise((r) => setTimeout(r, 180))]).then(([srcs]) => {
      if (generation !== selection) return;
      swap(srcs);
      Promise.all([bare, hm].map((im) => (im.decode ? im.decode().catch(() => {}) : null))).then(() => { if (generation === selection) stage.classList.remove('is-swap'); });
    });
  });
})();
