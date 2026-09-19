/* ============================================================================
   APP SHELL
   ----------------------------------------------------------------------------
   Tabs, hash routing, the shared keyboard handler, and the few helpers every
   view needs. Views register themselves:

     QApp.register({
       name:    "practice",          // also the #hash
       title:   "Practice",          // tab label
       wide:    false,               // widen the page for tables and grids
       mount(root) {},               // render into <main>
       unmount() {},                 // stop timers, drop listeners
       onKey(e) {},                  // return true if the key was handled
       canLeave() {},                // return a confirm message to block a switch
     });

   To add questions, edit a file in questions/, not this file.
   ========================================================================== */

const QApp = (function () {

  const views = [];
  let active = null;
  let started = false;

  const root = () => document.getElementById("view");

  function register(view) {
    views.push(view);
    if (started) renderTabs();
  }

  function find(name) {
    return views.filter(v => v.name === name)[0] || null;
  }

  /* ---- Routing ------------------------------------------------------------ */

  function currentHash() {
    return (location.hash || "").replace(/^#/, "");
  }

  function go(name, opts) {
    const view = find(name) || views[0];
    if (!view) return;
    if (active === view && !(opts && opts.force)) return;

    // A view can refuse to be left — a test in progress, for instance.
    if (active && active !== view && typeof active.canLeave === "function") {
      const message = active.canLeave();
      if (message && !window.confirm(message)) {
        // Put the hash back without re-entering the router.
        suppressHashChange = true;
        location.hash = "#" + active.name;
        return;
      }
    }

    if (active && typeof active.unmount === "function") active.unmount();

    active = view;
    document.body.classList.toggle("wide", !!view.wide);
    setStatus("");
    root().innerHTML = "";
    renderTabs();
    view.mount(root());

    if (currentHash() !== view.name) {
      suppressHashChange = true;
      location.hash = "#" + view.name;
    }
  }

  /* Re-render the current view in place, e.g. after a filter change. */
  function refresh() {
    if (!active) return;
    if (typeof active.unmount === "function") active.unmount();
    setStatus("");
    root().innerHTML = "";
    active.mount(root());
  }

  let suppressHashChange = false;

  function onHashChange() {
    if (suppressHashChange) { suppressHashChange = false; return; }
    go(currentHash() || views[0].name);
  }

  function renderTabs() {
    const tabs = document.getElementById("tabs");
    if (!tabs) return;
    tabs.innerHTML = views.map(v =>
      `<a href="#${v.name}"${active === v ? ' aria-current="page"' : ""}>${v.title}</a>`
    ).join("");
  }

  /* ---- Keyboard ------------------------------------------------------------ */

  /* One listener for the whole app; the active view gets first refusal. Keys are
     ignored while a form control has focus so that typing in a filter box does
     not fire shortcuts. */
  function onKeyDown(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
    if (active && typeof active.onKey === "function" && active.onKey(e)) e.preventDefault();
  }

  /* ---- Shared helpers ------------------------------------------------------ */

  const DIFFICULTY_NAMES = { 1: "easy", 2: "medium", 3: "hard" };

  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function fmtMs(ms) {
    return ms === null || ms === undefined ? "—" : fmtClock(ms / 1000);
  }

  function pct(x) {
    return x === null || x === undefined ? "—" : Math.round(x * 100) + "%";
  }

  /* KaTeX is the one external dependency. If the CDN is unreachable the maths
     stays as raw $...$ text, which is readable, and the footer says so. */
  function katexReady() {
    return typeof window.renderMathInElement === "function";
  }

  function renderMath(node) {
    if (!node || !katexReady()) return;
    try {
      window.renderMathInElement(node, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$",  right: "$",  display: false },
        ],
        throwOnError: false,
      });
    } catch (e) {
      /* A malformed expression should never take the page down. */
    }
  }

  function setStatus(html) {
    const bits = [];
    if (html) bits.push(html);
    if (!QStore.persistent)
      bits.push('<span class="warnc">Progress is not being saved — this browser is blocking local storage.</span>');
    if (!katexReady())
      bits.push("Maths is showing as raw $...$: the KaTeX CDN did not load.");
    document.getElementById("status").innerHTML = bits.join("<br>");
  }

  function difficultyName(d) {
    return DIFFICULTY_NAMES[d] || (d ? String(d) : "");
  }

  /* Metadata line above a question: category, difficulty, tags, source. */
  function metaLine(q, right) {
    const bits = [q.category];
    if (q.difficulty) bits.push(difficultyName(q.difficulty));
    if (q.source) bits.push(q.source);
    const tags = Array.isArray(q.tags) && q.tags.length
      ? ` <span class="tags">${q.tags.join(" · ")}</span>` : "";
    return `<div class="meta"><span>${bits.join(" · ")}${tags}</span>` +
      `<span id="timer" class="timer">${right || ""}</span></div>`;
  }

  /* Fisher-Yates, optionally seeded so a test paper can be rebuilt exactly as
     it was sat. */
  function shuffle(array, seed) {
    const a = array.slice();
    const rand = seed === undefined ? Math.random : mulberry32(seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }

  /* ---- Boot ---------------------------------------------------------------- */

  function start() {
    started = true;
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("keydown", onKeyDown);
    // KaTeX is loaded with defer, so it has not run yet at the point this
    // inline call is made. Wait for DOMContentLoaded, which fires after
    // deferred scripts, or the first question's maths renders as raw text.
    const boot = () => go(currentHash() || (views[0] && views[0].name));
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }

  return {
    register, go, refresh, start, setStatus,
    fmtClock, fmtMs, pct, renderMath, katexReady,
    difficultyName, metaLine, shuffle, mulberry32, escapeHtml,
    DIFFICULTY_NAMES,
    views: () => views,
  };
})();
