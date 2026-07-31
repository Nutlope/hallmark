// Shared internals for the hallmark variants bridge (start.mjs, serve.mjs,
// await.mjs). Zero dependencies. Thin fs/http helpers, the run-dir layout,
// the request-queue naming, and the three embedded UI payloads: the picker
// page, the chip.js overlay, and the static compare page.
//
// Not a CLI. Imported by the other three scripts.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";

// ---------------------------------------------------------------------------
// small helpers

export const nowIso = () => new Date().toISOString();

export function readSafe(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return null; }
}

export function atomicWrite(file, content) {
  const tmp = file + ".tmp-" + process.pid;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

export function readJsonSafe(file) {
  const raw = readSafe(file);
  if (raw == null) return { json: null, error: "missing" };
  try { return { json: JSON.parse(raw), error: null }; }
  catch {
    // One brief retry: we may have caught a writer mid-rename.
    try { return { json: JSON.parse(fs.readFileSync(file, "utf8")), error: null }; }
    catch (e2) { return { json: null, error: String(e2).slice(0, 120) }; }
  }
}

export function statMtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch { return null; }
}

/** --flag value pairs; a flag followed by another flag (or nothing) is true. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const next = argv[i + 1];
    out[argv[i].slice(2)] = next == null || next.startsWith("--") ? true : argv[++i];
  }
  return out;
}

export function escapeAttr(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------------------
// run layout: .hallmark/variants/<run-id>/ inside the user project.
// server.json is a per-project singleton, one level up from the run dir.

export function runPaths(runDir) {
  const RUN = path.resolve(String(runDir));
  const REQ = path.join(RUN, "requests");
  return {
    RUN,
    RUN_ID: path.basename(RUN),
    REQ,
    REQ_DONE: path.join(REQ, "done"),
    MANIFEST: path.join(RUN, "manifest.json"),
    SERVER_JSON: path.join(path.dirname(RUN), "server.json"),
    LOG: path.join(RUN, "server.log"),
  };
}

export function defaultManifest(runId) {
  return { run: runId, mode: "greenfield", brief: "", devServer: null, directions: [], picked: null };
}

/** Next zero-padded queue id, scanning requests/ AND requests/done/. */
export function nextRequestId(P) {
  let max = 0;
  for (const dir of [P.REQ, P.REQ_DONE]) {
    let files = [];
    try { files = fs.readdirSync(dir); } catch { /* not created yet */ }
    for (const f of files) {
      const m = f.match(/^(\d+)-/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return String(max + 1).padStart(4, "0");
}

export const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

// ---------------------------------------------------------------------------
// loopback http (start.mjs identity checks, await.mjs --stop)

export function httpGetJson(port, pathname, timeoutMs = 900) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: pathname, timeout: timeoutMs }, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => { try { resolve(JSON.parse(buf)); } catch { resolve(null); } });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

export function httpPostJson(port, pathname, body = {}, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request(
      { host: "127.0.0.1", port, path: pathname, method: "POST", timeout: timeoutMs,
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => { try { resolve(JSON.parse(buf)); } catch { resolve({ ok: (res.statusCode ?? 500) < 300 }); } });
      },
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
    req.end(data);
  });
}

// ---------------------------------------------------------------------------
// The corner dock: ONE control surface for every place a variants run is
// driven from. A compact glass bar pinned to the BOTTOM-RIGHT corner of the
// viewport - the direction itself stays full-bleed, nothing wraps or frames
// the page - with an expandable tray above it for meta and secondary actions.
// Used by the picker's single view, the chip a generated page embeds, the
// scoped-injection overlay, and the static compare page. chip/inject mount it
// inside a shadow root so the page's own CSS cannot restyle it.
//
// HM_DOCK_LIB is a self-contained ES5 factory each surface embeds:
//   var dock = HmDock({ onGrid, onNav, onJump, onPick, chatPick, onRiff,
//                       onGraft, keys, hint, onDismiss });
//   dock.mount();                      // or append dock.host yourself
//   dock.setState({ n, total, title, meta, list });  // list: [{n,ready,title}]
//   dock.note("picker offline ...");   // terminal: swaps the bar for a note
//   dock.flash("riff queued");         // transient: borrows the title slot

const HM_DOCK_CSS =
  '.hm-dock{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#e8e6e1;-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;text-align:left}' +
  '.hm-glass{background:rgba(16,16,19,.88);-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);border:1px solid rgba(255,255,255,.09);border-radius:14px;box-shadow:0 18px 44px -18px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.05)}' +
  '.hm-bar{display:flex;align-items:center;gap:1px;padding:4px}' +
  '.hm-btn{appearance:none;-webkit-appearance:none;border:0;background:none;color:#c6c4bd;font:500 12px/1 ui-sans-serif,system-ui,sans-serif;cursor:pointer;padding:8px 9px;border-radius:10px;letter-spacing:.01em;display:inline-flex;align-items:center;gap:8px}' +
  '.hm-btn:hover{background:rgba(255,255,255,.1);color:#fff}' +
  '.hm-btn:focus-visible{outline:2px solid #9db8e8;outline-offset:-1px}' +
  '.hm-num{display:flex;gap:1px;padding:0 1px}' +
  '.hm-num .hm-btn{min-width:24px;justify-content:center;font-variant-numeric:tabular-nums;color:#929088;padding:8px 4px}' +
  '.hm-num .hm-btn[aria-current="true"]{background:#e8e6e1;color:#131316;font-weight:650}' +
  '.hm-num .hm-btn.hm-gen{opacity:.35;cursor:default}' +
  '.hm-title{max-width:15ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:650;letter-spacing:.14em;text-transform:uppercase;color:#a5a29a;padding:0 10px}' +
  '.hm-sep{width:1px;height:15px;background:rgba(255,255,255,.1);margin:0 4px;flex:none}' +
  '.hm-pick{background:#e8e6e1;color:#131316;font-weight:650;padding:8px 13px;margin-left:2px}' +
  '.hm-pick:hover{background:#fff;color:#000}' +
  '.hm-chat{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11px;color:#e8e6e1;background:rgba(255,255,255,.08);padding:8px 11px}' +
  '.hm-chat:hover{background:rgba(255,255,255,.15)}' +
  '.hm-note{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11px;color:#a5a29a;padding:4px 10px;white-space:nowrap}' +
  '.hm-tray{display:none;flex-direction:column;min-width:224px;padding:4px}' +
  '.hm-tray.on{display:flex}' +
  '.hm-tray .hm-btn{justify-content:space-between;width:100%;padding:9px 11px}' +
  '.hm-k{font-size:10px;color:#75736c;letter-spacing:.06em;font-variant-numeric:tabular-nums}' +
  '.hm-meta{padding:9px 11px 8px;font-size:10.5px;line-height:1.55;color:#929088;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:3px}' +
  '.hm-meta b{display:block;color:#e8e6e1;font-size:11px;letter-spacing:.02em;margin-bottom:2px;font-weight:650}' +
  '.hm-hint{padding:8px 11px 6px;font-size:10px;color:#6f6d66;letter-spacing:.04em;border-top:1px solid rgba(255,255,255,.08);margin-top:3px;line-height:1.6}' +
  '@media (max-width:640px){.hm-dock{right:10px;bottom:10px}.hm-title{display:none}.hm-title+.hm-sep{display:none}}' +
  '@media (prefers-reduced-motion:no-preference){.hm-dock{animation:hm-in .24s cubic-bezier(.2,.7,.2,1) both}@keyframes hm-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.hm-num .hm-btn.hm-gen{animation:hm-pulse 1.6s ease-in-out infinite}@keyframes hm-pulse{50%{opacity:.6}}}';

export const HM_DOCK_LIB =
  'var HM_DOCK_CSS=' + JSON.stringify(HM_DOCK_CSS) + ';\n' +
  'function HmDock(o){\n' +
  'o=o||{};\n' +
  'var reduce=false;try{reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}\n' +
  'var host=document.createElement("div");host.setAttribute("data-hallmark-dock","");\n' +
  'var root=host.attachShadow?host.attachShadow({mode:"open"}):host;\n' +
  'var css=document.createElement("style");css.textContent=HM_DOCK_CSS;root.appendChild(css);\n' +
  'var dock=document.createElement("div");dock.className="hm-dock";if(reduce)dock.style.animation="none";root.appendChild(dock);\n' +
  'var tray=document.createElement("div");tray.className="hm-tray hm-glass";dock.appendChild(tray);\n' +
  'var bar=document.createElement("div");bar.className="hm-bar hm-glass";dock.appendChild(bar);\n' +
  'function el(tag,cls,parent){var x=document.createElement(tag);if(cls)x.className=cls;if(parent)parent.appendChild(x);return x}\n' +
  'function btn(parent,html,title,fn,cls){var b=el("button","hm-btn"+(cls?" "+cls:""),parent);b.type="button";b.innerHTML=html;if(title)b.title=title;if(fn)b.addEventListener("click",fn);return b}\n' +
  'function sep(){el("span","hm-sep",bar)}\n' +
  'var GRID_SVG=\'<svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="5" height="5" rx="1"/><rect x="6" y="0" width="5" height="5" rx="1"/><rect x="0" y="6" width="5" height="5" rx="1"/><rect x="6" y="6" width="5" height="5" rx="1"/></svg>\';\n' +
  'if(o.onGrid){btn(bar,GRID_SVG,"back to the grid (Esc)",o.onGrid);sep()}\n' +
  'var nums=null;\n' +
  'if(o.onNav){btn(bar,"\\u2039","previous (ArrowLeft)",function(){o.onNav(-1)});nums=el("span","hm-num",bar);btn(bar,"\\u203a","next (ArrowRight)",function(){o.onNav(1)});sep()}\n' +
  'var ttl=el("span","hm-title",bar);\n' +
  'var pickB=null,chatB=null;\n' +
  'if(o.onPick){sep();pickB=btn(bar,"Pick",(o.keys?"keep this direction (P)":"keep this direction"),o.onPick,"hm-pick")}\n' +
  'if(o.chatPick){sep();chatB=btn(bar,"pick ?","copy, then paste in your chat",function(){var t=chatB.getAttribute("data-say")||"";var done=function(){api.flash("copied \\u2713 paste in chat")};try{navigator.clipboard.writeText(t).then(done,function(){api.flash("reply in chat: "+t)})}catch(e){api.flash("reply in chat: "+t)}},"hm-chat")}\n' +
  'var hasTray=!!(o.onRiff||o.onGraft||o.hint);\n' +
  'var moreB=null;\n' +
  'if(hasTray){moreB=btn(bar,"\\u22ef","more",function(){api.trayToggle()});moreB.setAttribute("aria-expanded","false")}\n' +
  'if(o.onDismiss)btn(bar,"\\u00d7","dismiss",o.onDismiss);\n' +
  'var meta=null;\n' +
  'if(hasTray){meta=el("div","hm-meta",tray);\n' +
  'if(o.onRiff){var rb=btn(tray,"Riff \\u00b7 deal one more","",o.onRiff);if(o.keys)el("span","hm-k",rb).textContent="R"}\n' +
  'if(o.onGraft){var gb=btn(tray,"Graft \\u00b7 borrow a section","",o.onGraft);if(o.keys)el("span","hm-k",gb).textContent="G"}\n' +
  'if(o.hint){el("div","hm-hint",tray).textContent=o.hint}}\n' +
  'var last={n:1,total:1,title:"",meta:"",list:null},flashT=null;\n' +
  'var api={host:host,\n' +
  'mount:function(){(document.body||document.documentElement).appendChild(host)},\n' +
  'remove:function(){host.remove()},\n' +
  'trayToggle:function(force){var on=tray.classList.toggle("on",force);if(moreB)moreB.setAttribute("aria-expanded",String(on))},\n' +
  'pickLabel:function(t){if(pickB)pickB.textContent=t},\n' +
  'note:function(t){bar.innerHTML="";el("span","hm-note",bar).textContent=t;tray.classList.remove("on")},\n' +
  'flash:function(t){clearTimeout(flashT);ttl.textContent=t;ttl.style.maxWidth="34ch";flashT=setTimeout(function(){api.setState(last)},2600)},\n' +
  'setState:function(s){last=s;clearTimeout(flashT);\n' +
  'var list=s.list;if(!list){list=[];for(var i=1;i<=(s.total||1);i++)list.push({n:i,ready:true})}\n' +
  'if(nums){nums.innerHTML="";list.forEach(function(d){\n' +
  'var b=btn(nums,String(d.n),d.ready?("direction "+d.n+(d.title?" \\u00b7 "+d.title:"")):"still building...",function(){if(d.ready&&o.onJump)o.onJump(d.n)});\n' +
  'if(d.n===s.n)b.setAttribute("aria-current","true");\n' +
  'if(!d.ready)b.classList.add("hm-gen")})}\n' +
  'ttl.style.maxWidth="";ttl.textContent=s.title||("Direction "+s.n);\n' +
  'if(chatB){chatB.textContent="pick "+s.n;chatB.setAttribute("data-say","pick "+s.n)}\n' +
  'if(meta){meta.innerHTML="";var b2=el("b","",meta);b2.textContent=s.title||("Direction "+s.n);\n' +
  'if(s.meta){var m2=el("span","",meta);m2.textContent=s.meta}}\n' +
  '}};\n' +
  'return api}\n';

// ---------------------------------------------------------------------------
// chip.js: the corner dock a generated variant route embeds via
//   <script src="http://127.0.0.1:<port>/chip.js" data-direction="2" data-of="3"
//           data-mode="routes" data-base="http://localhost:3000/hallmark-v"
//           data-title="The console"></script>
// Greenfield: data-mode="greenfield", data-base="http://127.0.0.1:<port>/frame/"
// (greenfield hrefs get a trailing slash; routes hrefs do not). data-title is
// optional. On mount the chip asks /api/state for the live direction list, so
// titles, meta, and a riff's direction 4 appear even when the embedded
// data-of has gone stale; the data attributes are the offline fallback. The
// chip skips rendering when the page is inside an iframe (the picker frames
// these pages and carries its own dock).

export function buildChipJs() {
  return '(function(){\n' +
    '"use strict";\n' +
    'if(window.self!==window.top)return;\n' +
    'var s=document.currentScript;if(!s)return;\n' +
    'var origin;try{origin=new URL(s.src).origin}catch(e){return}\n' +
    'var n=parseInt(s.getAttribute("data-direction")||"1",10);\n' +
    'var total=parseInt(s.getAttribute("data-of")||"3",10);\n' +
    'var mode=s.getAttribute("data-mode")||"greenfield";\n' +
    'var base=s.getAttribute("data-base")||"";\n' +
    'var title=s.getAttribute("data-title")||"";\n' +
    'var meta="",list=null;\n' +
    HM_DOCK_LIB +
    'function urlFor(k){return base+k+(mode==="greenfield"?"/":"")}\n' +
    'function jump(k){if(k!==n)location.href=urlFor(k)}\n' +
    'function nav(d){var k=n+d;if(k<1)k=total;if(k>total)k=1;jump(k)}\n' +
    'function post(body,done){fetch(origin+"/api/pick",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error("bad status");done()}).catch(function(){dock.note("picker offline \\u00b7 tell your agent: pick "+n)})}\n' +
    'var dock=HmDock({\n' +
    'onNav:nav,onJump:jump,\n' +
    'onPick:function(){post({action:"pick",choice:n},function(){dock.pickLabel("Picked \\u2713");dock.flash("back to your chat")})},\n' +
    'onRiff:function(){var steer=window.prompt("Optional steer for the new direction (leave blank for a free riff):","");if(steer===null)return;post({action:"riff",choice:n,steer:steer.trim()},function(){dock.flash("riff queued \\u2713")})},\n' +
    'onGraft:function(){var ans=window.prompt("Take which section from which direction? e.g. \\u2018pricing from 3\\u2019","");if(ans===null)return;ans=ans.trim();if(!ans)return;var m=ans.match(/^(.*?)\\s+from\\s+(\\d+)$/i);if(!m){dock.flash("could not parse \\u00b7 try: pricing from 3");return}var section=m[1].trim(),from=parseInt(m[2],10);if(!section||!from){dock.flash("could not parse \\u00b7 try: pricing from 3");return}post({action:"graft",choice:n,from:from,section:section},function(){dock.flash("graft queued \\u2713")})},\n' +
    'hint:"\\u2039 \\u203a arrow keys flip between directions",\n' +
    'onDismiss:function(){document.removeEventListener("keydown",onKey,true);dock.remove()}\n' +
    '});\n' +
    'function sync(){dock.setState({n:n,total:total,title:title,meta:meta,list:list})}\n' +
    'function refresh(){fetch(origin+"/api/state").then(function(r){return r.json()}).then(function(j){\n' +
    'var ds=(j&&j.manifest&&j.manifest.directions)||[];if(!ds.length)return;\n' +
    'ds=ds.slice().sort(function(a,b){return a.n-b.n});\n' +
    'total=Math.max(total,ds.length);\n' +
    'list=ds.map(function(d){return{n:d.n,ready:!d.status||d.status==="ready",title:d.title||""}});\n' +
    'for(var i=0;i<ds.length;i++)if(ds[i].n===n){title=ds[i].title||title;\n' +
    'meta=[ds[i].macrostructure,ds[i].theme,ds[i].nav,ds[i].footer].filter(Boolean).join(" \\u00b7 ")+(ds[i].axes?"  \\u00b7  "+ds[i].axes:"")}\n' +
    'sync()}).catch(function(){})}\n' +
    'function onKey(e){var el=document.activeElement;if(el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;if(e.key==="ArrowLeft"){e.preventDefault();nav(-1)}else if(e.key==="ArrowRight"){e.preventDefault();nav(1)}}\n' +
    'document.addEventListener("keydown",onKey,true);\n' +
    'function mount(){dock.mount();sync();refresh()}\n' +
    'if(document.body)mount();else document.addEventListener("DOMContentLoaded",mount);\n' +
    '})();\n';
}

// ---------------------------------------------------------------------------
// inject.js: the scoped-preview overlay served at /inject/<n>.js. The user
// drops <script src="http://127.0.0.1:<port>/inject/2.js"></script> into their
// own running dev app (Vite/Astro/SvelteKit) - or the agent injects it - and it
// mounts a fixed full-viewport iframe of the direction's route ON TOP of the
// app, plus the same corner dock (flip / jump / pick / riff / graft / dismiss).
// PREVIEW ONLY: it paints the variant over the app, it never edits the app's
// source. It no-ops off localhost, guards arrows against focused inputs, sits
// at max z-index, and is fully dismissible (x, Esc). Actions post to the
// helper origin; /api/state refreshes titles and totals on every flip. The
// iframe points at <appOrigin>/hallmark-v<n> (the routes-mode recipe).

export function buildInjectJs(n, total, port) {
  const origin = "http://127.0.0.1:" + port;
  return '(function(){\n' +
    '"use strict";\n' +
    'var h=location.hostname;\n' +
    'if(h!=="localhost"&&h!=="127.0.0.1"&&h!=="[::1]")return;\n' +
    'if(window.__hallmarkInject)return;window.__hallmarkInject=true;\n' +
    'var n=' + Number(n) + ',total=' + Number(total) + ',origin="' + origin + '";\n' +
    'var routeBase=location.origin+"/hallmark-v";\n' +
    'var title="",meta="",list=null;\n' +
    HM_DOCK_LIB +
    'var wrap=document.createElement("div");\n' +
    'wrap.setAttribute("data-hallmark-inject","");\n' +
    'wrap.style.cssText="position:fixed;inset:0;z-index:2147483646;background:#0b0b0d;";\n' +
    'var frame=document.createElement("iframe");\n' +
    'frame.setAttribute("title","hallmark variant preview");\n' +
    'frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff;";\n' +
    'wrap.appendChild(frame);\n' +
    'function urlFor(k){return routeBase+k}\n' +
    'function load(){frame.src=urlFor(n)}\n' +
    'function jump(k){if(k===n)return;n=k;load();sync();refresh()}\n' +
    'function nav(d){var k=n+d;if(k<1)k=total;if(k>total)k=1;jump(k)}\n' +
    'function dismiss(){wrap.remove();dock.remove();document.removeEventListener("keydown",onKey,true)}\n' +
    'function post(body,done){fetch(origin+"/api/pick",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error("bad status");done()}).catch(function(){dock.note("picker offline \\u00b7 tell your agent: pick "+n)})}\n' +
    'var dock=HmDock({\n' +
    'onNav:nav,onJump:jump,\n' +
    'onPick:function(){post({action:"pick",choice:n},function(){dock.pickLabel("Picked \\u2713");dock.flash("back to your chat")})},\n' +
    'onRiff:function(){var steer=window.prompt("Optional steer for the new direction (leave blank for a free riff):","");if(steer===null)return;post({action:"riff",choice:n,steer:steer.trim()},function(){dock.flash("riff queued \\u2713")})},\n' +
    'onGraft:function(){var ans=window.prompt("Take which section from which direction? e.g. \\u2018pricing from 3\\u2019","");if(ans===null)return;ans=ans.trim();if(!ans)return;var m=ans.match(/^(.*?)\\s+from\\s+(\\d+)$/i);if(!m){dock.flash("could not parse \\u00b7 try: pricing from 3");return}var section=m[1].trim(),from=parseInt(m[2],10);if(!section||!from){dock.flash("could not parse \\u00b7 try: pricing from 3");return}post({action:"graft",choice:n,from:from,section:section},function(){dock.flash("graft queued \\u2713")})},\n' +
    'hint:"\\u2039 \\u203a arrow keys flip \\u00b7 Esc closes the preview",\n' +
    'onDismiss:dismiss\n' +
    '});\n' +
    'function sync(){dock.setState({n:n,total:total,title:title,meta:meta,list:list})}\n' +
    'function refresh(){fetch(origin+"/api/state").then(function(r){return r.json()}).then(function(j){\n' +
    'var ds=(j&&j.manifest&&j.manifest.directions)||[];if(!ds.length)return;\n' +
    'ds=ds.slice().sort(function(a,b){return a.n-b.n});\n' +
    'total=Math.max(total,ds.length);\n' +
    'list=ds.map(function(d){return{n:d.n,ready:!d.status||d.status==="ready",title:d.title||""}});\n' +
    'title="";meta="";\n' +
    'for(var i=0;i<ds.length;i++)if(ds[i].n===n){title=ds[i].title||"";\n' +
    'meta=[ds[i].macrostructure,ds[i].theme,ds[i].nav,ds[i].footer].filter(Boolean).join(" \\u00b7 ")+(ds[i].axes?"  \\u00b7  "+ds[i].axes:"")}\n' +
    'sync()}).catch(function(){})}\n' +
    'function onKey(e){var el=document.activeElement;if(el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;if(e.key==="ArrowLeft"){e.preventDefault();nav(-1)}else if(e.key==="ArrowRight"){e.preventDefault();nav(1)}else if(e.key==="Escape"){e.preventDefault();dismiss()}}\n' +
    'document.addEventListener("keydown",onKey,true);\n' +
    'function mount(){var root=document.body||document.documentElement;root.appendChild(wrap);dock.mount();load();sync();refresh()}\n' +
    'if(document.body)mount();else document.addEventListener("DOMContentLoaded",mount);\n' +
    '})();\n';
}

// ---------------------------------------------------------------------------
// shared shell CSS for the two host pages (dark neutral, system-ui, no
// external fonts, fully self-contained)

const SHELL_CSS = [
  ':root{--bg:#141416;--card:#1d1d21;--line:#2c2c31;--fg:#e9e7e2;--mut:#8f8d86;--acc:#6ea8fe;--ok:#3ecf8e;--bad:#e2705e;--mono:ui-monospace,"SF Mono",Menlo,monospace;--tw:408px;--th:255px;--scale:0.31875}',
  '*{box-sizing:border-box;margin:0}',
  'body{background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}',
  'header{display:flex;align-items:baseline;gap:12px;padding:16px 24px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}',
  'header b{font-size:15px;letter-spacing:.01em}',
  'header span{font-family:var(--mono);font-size:11px;color:var(--mut)}',
  '#note{margin-left:auto}#note.ok{color:var(--ok)}#note.bad{color:var(--bad)}',
  'button{font:inherit;color:inherit;cursor:pointer}',
].join("\n");

// ---------------------------------------------------------------------------
// picker page (served at /). A static shell: it polls /api/state every 2s and
// renders the manifest's directions, so agent-side manifest edits (a riff's
// 4th direction, status flips, the pick landing) appear without a reload.
// Grid of thumbnails -> click or 1..9 for single view. Single view is the
// direction FULL-BLEED (a live iframe filling the viewport); every control
// lives in the bottom-right corner dock: grid glyph, pager with number jump,
// title, Pick, and a tray with meta / Riff / Graft / key hints.

export function buildPickerPage() {
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>hallmark · pick a direction</title>\n' +
    '<style>\n' + SHELL_CSS + '\n' +
    '.grid{display:grid;grid-template-columns:repeat(auto-fill,var(--tw));justify-content:center;gap:26px 22px;padding:26px 24px 60px}\n' +
    '.card{background:none;border:0;padding:0;text-align:left}\n' +
    '.thumb{width:var(--tw);height:var(--th);overflow:hidden;position:relative;border:1px solid var(--line);border-radius:10px;background:#fff}\n' +
    '.card:hover .thumb,.card:focus-visible .thumb{border-color:var(--acc)}\n' +
    '.thumb iframe{width:1280px;height:800px;border:0;transform:scale(var(--scale));transform-origin:top left;pointer-events:none}\n' +
    '.thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top left}\n' +
    '.thumb .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--card);color:var(--mut);font-family:var(--mono);font-size:12px}\n' +
    '.meta{display:flex;flex-direction:column;gap:3px;padding:10px 2px 0}\n' +
    '.meta .t{font-weight:650;font-size:14px}.meta .t i{font-style:normal;color:var(--mut);font-family:var(--mono);font-size:12px;margin-right:8px}\n' +
    '.meta .m{font-family:var(--mono);font-size:11px;color:var(--mut)}\n' +
    '.empty{padding:80px 24px;text-align:center;color:var(--mut);font-family:var(--mono);font-size:13px}\n' +
    '#single{position:fixed;inset:0;background:var(--bg);display:none;z-index:10}#single.on{display:block}\n' +
    '#sframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}\n' +
    '</style>\n</head>\n<body>\n' +
    '<header><b>hallmark variants</b><span id="run"></span><span id="note"></span></header>\n' +
    '<main class="grid" id="grid"></main>\n' +
    '<div class="empty" id="empty" hidden>waiting for directions... the agent is still writing them (this page refreshes itself)</div>\n' +
    '<div id="single">\n<iframe id="sframe" title="direction preview"></iframe>\n</div>\n' +
    '<script>\n(function(){\n' +
    HM_DOCK_LIB +
    'var st=null,lastJson="",view="grid",dirs=[],picked=null;\n' +
    'function $(id){return document.getElementById(id)}\n' +
    'function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}\n' +
    'function note(msg,cls){var n=$("note");n.textContent=msg||"";n.className=cls||""}\n' +
    'function metaOf(d){return [d.macrostructure,d.theme,d.nav,d.footer].filter(Boolean).join(" · ")}\n' +
    'function isReady(d){return !d.status||d.status==="ready"}\n' +
    'var dock=HmDock({\n' +
    'onGrid:function(){closeSingle()},\n' +
    'onNav:function(d){cycle(d)},\n' +
    'onJump:function(n){openDir(n)},\n' +
    'onPick:function(){pick()},\n' +
    'onRiff:function(){riff()},\n' +
    'onGraft:function(){graft()},\n' +
    'keys:true,\n' +
    'hint:"arrows flip · 1-9 jump · P pick · R riff · G graft · Esc grid"\n' +
    '});\n' +
    '$("single").appendChild(dock.host);\n' +
    'function poll(){fetch("/api/state").then(function(r){return r.json()}).then(function(j){\n' +
    '  var s=JSON.stringify(j.manifest);if(s===lastJson)return;lastJson=s;st=j;\n' +
    '  dirs=((j.manifest&&j.manifest.directions)||[]).slice().sort(function(a,b){return a.n-b.n});\n' +
    '  picked=j.manifest?j.manifest.picked:null;render();\n' +
    '}).catch(function(){note("server offline","bad")})}\n' +
    'function render(){\n' +
    '  var bust=Date.now();\n' +
    '  $("run").textContent=st.run+" · "+((st.manifest&&st.manifest.mode)||"");\n' +
    '  if(picked)note("picked: direction "+picked+" ✓ - back to your chat","ok");else note("");\n' +
    '  var g=$("grid");g.innerHTML="";$("empty").hidden=dirs.length>0;\n' +
    '  dirs.forEach(function(d){\n' +
    '    var ready=isReady(d);\n' +
    '    var inner;\n' +
    '    if(!ready)inner=\'<div class="ph">building...</div>\';\n' +
    '    else if(d.thumb===true)inner=\'<img loading="lazy" alt="" src="/thumb/\'+d.n+\'.png?\'+bust+\'">\';\n' +
    '    else inner=\'<iframe loading="lazy" scrolling="no" tabindex="-1" src="\'+esc(d.url)+\'"></iframe>\';\n' +
    '    var b=document.createElement("button");b.className="card";\n' +
    '    b.innerHTML=\'<div class="thumb">\'+inner+\'</div>\'+\n' +
    '      \'<div class="meta"><span class="t"><i>\'+d.n+\'</i>\'+esc(d.title||("Direction "+d.n))+(picked===d.n?" ✓":"")+\'</span><span class="m">\'+esc(metaOf(d))+\'</span>\'+(d.axes?\'<span class="m">\'+esc(d.axes)+\'</span>\':"")+\'</div>\';\n' +
    '    b.addEventListener("click",function(){openDir(d.n)});g.appendChild(b);\n' +
    '  });\n' +
    '  if(view!=="grid")syncSingle();\n' +
    '}\n' +
    'function dirByN(n){for(var i=0;i<dirs.length;i++)if(dirs[i].n===n)return dirs[i];return null}\n' +
    'function openDir(n){var d=dirByN(n);if(!d||!isReady(d))return;view=n;$("single").classList.add("on");syncSingle()}\n' +
    'function closeSingle(){view="grid";$("single").classList.remove("on")}\n' +
    'function cycle(step){var ready=dirs.filter(isReady);if(!ready.length)return;\n' +
    '  var idx=0;for(var i=0;i<ready.length;i++)if(ready[i].n===view)idx=i;\n' +
    '  idx=(idx+step+ready.length)%ready.length;view=ready[idx].n;syncSingle()}\n' +
    'function syncSingle(){var d=dirByN(view);if(!d||!isReady(d)){closeSingle();return}\n' +
    '  dock.setState({n:d.n,total:dirs.length,title:d.title||"",meta:metaOf(d)+(d.axes?"  ·  "+d.axes:""),\n' +
    '    list:dirs.map(function(x){return{n:x.n,ready:isReady(x),title:x.title||""}})});\n' +
    '  var f=$("sframe");if(f.getAttribute("data-src")!==d.url){f.setAttribute("data-src",d.url);f.src=d.url}\n' +
    '  dock.pickLabel(picked===d.n?"Picked ✓":"Pick");\n' +
    '}\n' +
    'function api(body,done,ok){fetch("/api/pick",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})\n' +
    '  .then(function(r){if(!r.ok)throw new Error("bad status");note(ok,"ok");if(done)done()})\n' +
    '  .catch(function(){note("request failed - is the server up?","bad");dock.flash("request failed")})}\n' +
    'function pick(){if(view==="grid")return;api({action:"pick",choice:view},function(){dock.pickLabel("Picked ✓");dock.flash("back to your chat")},"picked: direction "+view+" ✓ - back to your chat")}\n' +
    'function riff(){var steer=window.prompt("Optional steer for the new direction (leave blank for a free riff):","");if(steer===null)return;\n' +
    '  var body={action:"riff",steer:steer.trim()};if(view!=="grid")body.choice=view;\n' +
    '  api(body,function(){dock.flash("riff queued ✓")},"riff queued ✓ - a new direction will appear here")}\n' +
    'function graft(){if(view==="grid")return;\n' +
    '  var ans=window.prompt("Take which section from which direction? e.g. \\u2018pricing from 3\\u2019","");\n' +
    '  if(ans===null)return;ans=ans.trim();if(!ans)return;\n' +
    '  var m=ans.match(/^(.*?)\\s+from\\s+(\\d+)$/i);\n' +
    '  if(!m){note("could not parse - try \\u2018pricing from 3\\u2019","bad");dock.flash("try: pricing from 3");return}\n' +
    '  var section=m[1].trim(),from=parseInt(m[2],10);\n' +
    '  if(!section||!from){note("could not parse - try \\u2018pricing from 3\\u2019","bad");dock.flash("try: pricing from 3");return}\n' +
    '  api({action:"graft",choice:view,from:from,section:section},function(){dock.flash("graft queued ✓")},"graft queued ✓ - \'"+section+"\' from "+from+" into "+view)}\n' +
    'document.addEventListener("keydown",function(e){\n' +
    '  var el=document.activeElement;if(el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;\n' +
    '  var k=parseInt(e.key,10);\n' +
    '  if(view==="grid"){if(k>=1&&k<=dirs.length)openDir(dirs[k-1].n);return}\n' +
    '  if(e.key==="Escape")closeSingle();\n' +
    '  else if(e.key==="ArrowLeft")cycle(-1);\n' +
    '  else if(e.key==="ArrowRight")cycle(1);\n' +
    '  else if(e.key==="p"||e.key==="P")pick();\n' +
    '  else if(e.key==="r"||e.key==="R")riff();\n' +
    '  else if(e.key==="g"||e.key==="G")graft();\n' +
    '  else if(k>=1&&k<=dirs.length)openDir(dirs[k-1].n);\n' +
    '});\n' +
    'setInterval(poll,2000);poll();\n' +
    '})();\n</script>\n</body>\n</html>\n';
}

// ---------------------------------------------------------------------------
// static compare page (start.mjs --static): no server, srcdoc-inlined docs of
// the greenfield directions shown FULL-BLEED one at a time, keys 1..N and
// arrows flip, and the corner dock carries the honest channel: a "pick N"
// chip that copies the reply to paste in chat (no Pick button that pretends
// to work). items: [{ n, title, meta, doc }]

export function buildComparePage({ runId, brief, items }) {
  const frames = items.map((t, i) =>
    '<iframe id="f' + i + '" title="' + escapeAttr(t.title) + '" sandbox="allow-scripts" srcdoc="' + escapeAttr(t.doc) + '"></iframe>').join("\n");
  const meta = JSON.stringify(items.map((t) => ({ n: t.n, title: t.title, meta: t.meta })));
  const runLine = runId + (brief ? " · " + String(brief).slice(0, 60) : "");
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>hallmark · compare · ' + escapeAttr(runId) + '</title>\n' +
    '<style>\n' +
    '*{box-sizing:border-box;margin:0}\n' +
    'html,body{height:100%;background:#141416}\n' +
    'iframe{position:fixed;inset:0;width:100%;height:100%;border:0;background:#fff;display:none}\n' +
    'iframe.on{display:block}\n' +
    '</style>\n</head>\n<body>\n' +
    frames + '\n' +
    '<script>\n(function(){\n' +
    HM_DOCK_LIB +
    'var items=' + meta + ',cur=0;\n' +
    'var runLine=' + JSON.stringify(runLine) + ';\n' +
    'function idxOfN(n){for(var i=0;i<items.length;i++)if(items[i].n===n)return i;return -1}\n' +
    'var dock=HmDock({\n' +
    'onNav:function(d){show(cur+d)},\n' +
    'onJump:function(n){var i=idxOfN(n);if(i>=0)show(i)},\n' +
    'chatPick:true,\n' +
    'hint:"no server · your chat is the channel: reply \\u2018pick N\\u2019 (or riff / graft) · "+runLine\n' +
    '});\n' +
    'function show(i){cur=(i%items.length+items.length)%items.length;\n' +
    '  for(var k=0;k<items.length;k++)document.getElementById("f"+k).classList.toggle("on",k===cur);\n' +
    '  var it=items[cur];\n' +
    '  dock.setState({n:it.n,total:items.length,title:it.title,meta:it.meta,\n' +
    '    list:items.map(function(x){return{n:x.n,ready:true,title:x.title}})});\n' +
    '}\n' +
    'document.addEventListener("keydown",function(e){\n' +
    '  var el=document.activeElement;if(el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;\n' +
    '  if(e.key==="ArrowLeft")show(cur-1);else if(e.key==="ArrowRight")show(cur+1);\n' +
    '  else{var k=parseInt(e.key,10);if(k>=1){var i=idxOfN(k);if(i>=0)show(i)}}});\n' +
    'dock.mount();show(0);\n' +
    '})();\n</script>\n</body>\n</html>\n';
}
