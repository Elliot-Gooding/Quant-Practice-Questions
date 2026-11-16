/* ============================================================================
   STATS VIEW
   ----------------------------------------------------------------------------
   What the attempt history adds up to, plus the export/import/reset controls.

   Deliberately no charting library and no new palette. Every figure is a table
   row carrying its own number, with a single-hue proportion bar beside it as a
   secondary read — so nothing here depends on colour alone, and the page stays
   in the app's existing navy and serif.

   The one chart is the score-per-sitting line for each paper: a single series,
   drawn in SVG by hand, whose every point is also a row of the Test history
   table further down. Beside it sits a table of the last few sittings broken
   down by kind of question, which is where "what is costing me marks" shows.
   ========================================================================== */

QApp.register((function () {

  let root = null;

  function mount(node) {
    root = node;
    render();
  }

  function unmount() {
    root = null;
  }

  /* ---- Small pieces ---------------------------------------------------------- */

  function bar(fraction, label) {
    const pct = fraction === null || fraction === undefined
      ? 0 : Math.max(0, Math.min(1, fraction)) * 100;
    return `<span class="bar" title="${label || ""}"><i style="width:${pct.toFixed(1)}%"></i></span>`;
  }

  function accuracyCell(b) {
    if (!b.graded) return `<td class="num subtle">—</td><td class="barcell"></td>`;
    return `<td class="num">${QApp.pct(b.accuracy)}</td>` +
      `<td class="barcell">${bar(b.accuracy, b.correct + " of " + b.graded + " graded")}</td>`;
  }

  function groupTable(heading, buckets, labelOf) {
    const keys = Object.keys(buckets);
    if (!keys.length) return "";
    const rows = keys.map(key => {
      const b = buckets[key];
      return `<tr>
        <td>${labelOf ? labelOf(key) : key}</td>
        <td class="num subtle">${b.attempted} / ${b.total}</td>
        ${accuracyCell(b)}
      </tr>`;
    }).join("");
    return `<h2>${heading}</h2>
      <table>
        <thead><tr>
          <th>${heading.toLowerCase()}</th>
          <th class="num">attempted</th>
          <th class="num">accuracy</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  /* ---- Papers over time --------------------------------------------------------- */

  const RECENT = 5;          // "lately" means the last five sittings of a paper
  const PLOTTED = 40;        // at most this many sittings on the line
  const ENOUGH = 5;          // answers needed before a kind is named weakest or slowest

  /* What a stored paper item counts as. Papers sat before kinds were recorded
     fall back to the question's category. */
  function kindOf(item) {
    if (item.kind) return item.kind;
    const q = QBank.get(item.qid);
    return q ? q.category : "(unknown)";
  }

  /* Sittings grouped by paper, oldest first inside a group, the paper sat most
     recently first. */
  function byPaper(tests) {
    const groups = new Map();
    for (const t of tests.slice().sort((a, b) => a.startedAt - b.startedAt)) {
      if (!groups.has(t.formatId)) groups.set(t.formatId, []);
      groups.get(t.formatId).push(t);
    }
    return [...groups.values()].sort((a, b) => b[b.length - 1].startedAt - a[a.length - 1].startedAt);
  }

  function tally(sittings) {
    const kinds = new Map();
    for (const t of sittings) for (const item of t.items || []) {
      if (item.outcome !== "correct" && item.outcome !== "wrong") continue;
      const kind = kindOf(item);
      const g = kinds.get(kind) || { n: 0, correct: 0, ms: 0 };
      g.n++;
      if (item.outcome === "correct") g.correct++;
      g.ms += item.timeMs || 0;
      kinds.set(kind, g);
    }
    return kinds;
  }

  const blankWord = t => {
    const f = QFormats.get(t.formatId) || {};
    return f.mustAnswer || f.interview || t.interview ? "not reached" : "skipped";
  };
  const one = x => (Math.round(x * 10) / 10).toFixed(1);
  /* Time per answer: tenths of a second for a sprint, minutes for an interview problem. */
  const per = sec => sec >= 120 ? QApp.fmtClock(sec) : one(sec) + "s";

  /* Round axis steps: 1, 2, 5, 10, 20, 50 ... at most five ticks. */
  function ticksFor(lo, hi) {
    const raw = (hi - lo) / 4 || 1;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 5, 10].map(m => m * pow).filter(s => s >= raw)[0];
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
    return out;
  }

  /* The score line for one paper. Raw marks when every sitting was out of the
     same total; otherwise (shortened papers) the percentage of the marks. */
  function scoreChart(sittings) {
    const shown = sittings.slice(-PLOTTED);
    const offset = sittings.length - shown.length;
    const sameMax = shown.every(t => t.max === shown[0].max);
    const value = t => sameMax ? t.score : (t.max ? 100 * t.score / t.max : 0);
    const top = sameMax ? shown[0].max : 100;
    const values = shown.map(value);
    const step = ticksFor(0, top)[1] || top;
    const low = Math.min(0, Math.floor(Math.min(...values) / step) * step);

    const W = 640, H = 190, L = 40, Rm = 60, T = 14, B = 28;
    const x = i => shown.length === 1 ? (L + W - Rm) / 2 : L + i * (W - L - Rm) / (shown.length - 1);
    const y = v => T + (top - v) * (H - T - B) / (top - low);
    const pt = (v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1);

    const grid = ticksFor(low, top).map(v => `
      <line class="${v === 0 && low < 0 ? "zero" : "grid"}" x1="${L}" x2="${W - Rm}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/>
      <text class="tick" x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v}${sameMax ? "" : "%"}</text>`).join("");

    const dots = shown.length > 30 ? [shown.length - 1] : shown.map((t, i) => i);
    const marks = dots.map(i => `<circle class="dot" data-i="${i}" cx="${x(i).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="4"/>`).join("");
    const hits = shown.map((t, i) => {
      const when = new Date(t.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      const tip = `${t.counts.correct} right, ${t.counts.wrong} wrong, ${t.counts.skipped} ${blankWord(t)}`;
      return `<circle class="hit" tabindex="0" data-i="${i}" data-score="${t.score} / ${t.max}"
        data-when="Sitting ${offset + i + 1} &middot; ${QApp.escapeHtml(when)}" data-detail="${tip}"
        data-x="${(100 * x(i) / W).toFixed(2)}" data-y="${(100 * y(values[i]) / H).toFixed(2)}"
        cx="${x(i).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="13"/>`;
    }).join("");

    const last = shown.length - 1;
    const endLabel = sameMax ? String(shown[last].score) : Math.round(values[last]) + "%";
    return `
      <div class="chart">
        <svg viewBox="0 0 ${W} ${H}" role="img"
             aria-label="Score at each sitting, ${shown.length} sittings, latest ${shown[last].score} out of ${shown[last].max}. Every value is in the Test history table below.">
          ${grid}
          ${shown.length > 1 ? `<polyline class="line" points="${values.map(pt).join(" ")}"/>` : ""}
          ${marks}
          <text class="endlabel" x="${(x(last) + 10).toFixed(1)}" y="${(y(values[last]) + 4).toFixed(1)}">${endLabel}</text>
          <text class="tick" x="${L}" y="${H - 8}">sitting ${offset + 1}</text>
          ${shown.length > 1 ? `<text class="tick" x="${W - Rm}" y="${H - 8}" text-anchor="end">sitting ${offset + shown.length}</text>` : ""}
          ${hits}
        </svg>
        <div class="tip" hidden></div>
      </div>`;
  }

  /* Accuracy and pace by kind of question: the last few sittings beside the
     whole history, so a kind that is getting better (or worse) shows. */
  function kindTable(sittings) {
    const recent = tally(sittings.slice(-RECENT)), all = tally(sittings);
    if (all.size < 2) return "";
    const rows = [...all.keys()].sort((a, b) => a.localeCompare(b)).map(kind => {
      const r = recent.get(kind), a = all.get(kind);
      return `<tr>
        <td>${QApp.escapeHtml(kind)}</td>
        <td class="num subtle">${r ? r.n : 0}</td>
        ${r ? `<td class="num">${QApp.pct(r.correct / r.n)}</td>
               <td class="barcell">${bar(r.correct / r.n, r.correct + " of " + r.n + " right")}</td>
               <td class="num">${per(r.ms / r.n / 1000)}</td>`
            : `<td class="num subtle">—</td><td class="barcell"></td><td class="num subtle">—</td>`}
        <td class="num subtle">${QApp.pct(a.correct / a.n)}</td>
        <td class="num subtle">${per(a.ms / a.n / 1000)}</td>
      </tr>`;
    }).join("");

    const judged = [...recent.entries()].filter(([, g]) => g.n >= ENOUGH);
    let callout = "";
    if (judged.length >= 2) {
      const weakest = judged.slice().sort((a, b) => a[1].correct / a[1].n - b[1].correct / b[1].n)[0];
      const slowest = judged.slice().sort((a, b) => b[1].ms / b[1].n - a[1].ms / a[1].n)[0];
      callout = `<p class="subtle">Lately the least accurate kind is <b>${QApp.escapeHtml(weakest[0])}</b>
        (${QApp.pct(weakest[1].correct / weakest[1].n)}) and the slowest is <b>${QApp.escapeHtml(slowest[0])}</b>
        (${per(slowest[1].ms / slowest[1].n / 1000)} an answer). Only kinds with at least ${ENOUGH} recent answers are compared.</p>`;
    }
    const span = Math.min(RECENT, sittings.length);
    return `
      <table class="kinds">
        <thead><tr>
          <th>kind</th>
          <th class="num">answered</th><th class="num">accuracy</th><th></th><th class="num">time</th>
          <th class="num">all-time</th><th class="num">time</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="subtle">Answered, accuracy and time are for the last ${span === 1 ? "sitting" : span + " sittings"};
        the two right-hand columns are every sitting. Time is the average per answer.</p>
      ${callout}`;
  }

  function paperPanel(sittings) {
    const latest = sittings[sittings.length - 1];
    const recent = sittings.slice(-RECENT);
    const sameMax = sittings.every(t => t.max === latest.max);
    const share = t => t.max ? t.score / t.max : 0;
    const best = sittings.reduce((b, t) => share(t) > share(b) ? t : b, sittings[0]);
    const mean = recent.reduce((s, t) => s + (sameMax ? t.score : 100 * share(t)), 0) / recent.length;
    return `
      <div class="panel paper" data-paper="${QApp.escapeHtml(latest.formatId)}">
        <h2>${QApp.escapeHtml(latest.formatName || latest.formatId)}</h2>
        <p class="subtle">
          ${sittings.length} sitting${sittings.length === 1 ? "" : "s"} &middot;
          latest <b>${latest.score} / ${latest.max}</b> &middot;
          best <b>${best.score} / ${best.max}</b>${recent.length > 1
            ? ` &middot; average of the last ${recent.length} <b>${one(mean)}${sameMax ? "" : "%"}</b>` : ""}
        </p>
        ${latest.interview ? `<p class="subtle">The score is parts solved out of ${latest.max}: an opening
          problem and a follow-up in each of ${latest.interview.blocks} blocks. The latest sitting cleared
          ${latest.interview.cleared} of ${latest.interview.blocks} blocks.</p>` : ""}
        ${scoreChart(sittings)}
        ${sittings.length === 1 ? `<p class="subtle">One sitting so far. The line appears from the second.</p>` : ""}
        ${kindTable(sittings)}
      </div>`;
  }

  /* One tooltip per chart, shown on hover and on keyboard focus alike. */
  function wireCharts() {
    for (const chart of root.querySelectorAll(".chart")) {
      const tip = chart.querySelector(".tip");
      const show = hit => {
        tip.textContent = "";
        const strong = document.createElement("b");
        strong.textContent = hit.dataset.score;
        const when = document.createElement("span");
        when.textContent = hit.dataset.when.replace(/&middot;/g, "\u00b7");
        const detail = document.createElement("span");
        detail.textContent = hit.dataset.detail;
        tip.append(strong, when, detail);
        tip.style.left = hit.dataset.x + "%";
        tip.style.top = hit.dataset.y + "%";
        tip.classList.toggle("flip", Number(hit.dataset.x) > 70);
        tip.hidden = false;
        for (const dot of chart.querySelectorAll(".dot")) dot.classList.toggle("on", dot.dataset.i === hit.dataset.i);
      };
      const hide = () => {
        tip.hidden = true;
        for (const dot of chart.querySelectorAll(".dot")) dot.classList.remove("on");
      };
      for (const hit of chart.querySelectorAll(".hit")) {
        hit.addEventListener("pointerenter", () => show(hit));
        hit.addEventListener("focus", () => show(hit));
        hit.addEventListener("pointerleave", hide);
        hit.addEventListener("blur", hide);
      }
    }
  }

  /* ---- Render ------------------------------------------------------------------ */

  function render() {
    if (!root) return;
    const questions = QBank.all();
    const s = QStore.overallStats(questions);
    const tests = QStore.tests().slice().sort((a, b) => b.startedAt - a.startedAt);

    const graded = QStore.attempts().filter(a => a.outcome === "correct" || a.outcome === "wrong");
    const overallAccuracy = graded.length
      ? graded.filter(a => a.outcome === "correct").length / graded.length : null;

    root.innerHTML = `
      <div class="panel">
        <h2>${s.attempted} of ${s.bankSize} questions attempted</h2>
        ${bar(s.bankSize ? s.attempted / s.bankSize : 0, s.attempted + " of " + s.bankSize)}
        <p class="subtle">
          ${s.totalAttempts} attempt${s.totalAttempts === 1 ? "" : "s"} recorded &middot;
          ${overallAccuracy === null ? "nothing graded yet" : QApp.pct(overallAccuracy) + " accuracy overall"} &middot;
          ${s.reviewCount} question${s.reviewCount === 1 ? "" : "s"} due for review
        </p>
      </div>

      <div class="panel">
        ${groupTable("Category", s.byCategory)}
        ${groupTable("Difficulty", s.byDifficulty, k => QApp.difficultyName(Number(k)) || k)}
      </div>

      <div class="panel">
        <h2>Most reliably wrong</h2>
        ${s.weakest.length ? `
          <table>
            <thead><tr>
              <th>question</th><th>category</th>
              <th class="num">right</th><th class="num">accuracy</th>
            </tr></thead>
            <tbody>${s.weakest.slice(0, 10).map(({ q, s: st }) => `
              <tr>
                <td>${q.id}</td>
                <td class="subtle">${q.category}</td>
                <td class="num subtle">${st.correct} / ${st.graded}</td>
                <td class="num bad">${QApp.pct(st.accuracy)}</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">Nothing yet. Questions appear here once you have got one wrong.</p>`}

        <h2>Slowest against their target</h2>
        ${s.slowest.length ? `
          <table>
            <thead><tr>
              <th>question</th><th>category</th>
              <th class="num">median</th><th class="num">target</th><th class="num">ratio</th>
            </tr></thead>
            <tbody>${s.slowest.slice(0, 10).map(({ q, s: st }) => `
              <tr>
                <td>${q.id}</td>
                <td class="subtle">${q.category}</td>
                <td class="num">${QApp.fmtMs(st.medianTimeMs)}</td>
                <td class="num subtle">${QApp.fmtMs(st.targetMs)}</td>
                <td class="num warnc">${st.timeRatio.toFixed(1)}&times;</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">Nothing yet. Questions appear here once you go over a target time.</p>`}
      </div>

      ${byPaper(tests).map(paperPanel).join("")}

      <div class="panel">
        <h2>Test history</h2>
        ${tests.length ? `
          <table>
            <thead><tr>
              <th>when</th><th>format</th><th class="num">score</th>
              <th class="num">right</th><th class="num">wrong</th><th class="num">skipped</th>
            </tr></thead>
            <tbody>${tests.map(t => `
              <tr>
                <td class="subtle">${new Date(t.startedAt).toLocaleString()}</td>
                <td>${t.formatName || t.formatId}${t.autoSubmitted ? ' <span class="warnc">· time expired</span>' : ""}</td>
                <td class="num">${t.score} / ${t.max}</td>
                <td class="num good">${t.counts.correct}</td>
                <td class="num bad">${t.counts.wrong}</td>
                <td class="num subtle">${t.counts.skipped}</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">No tests sat yet.</p>`}
      </div>

      <div class="panel">
        <h2>Your data</h2>
        <p class="subtle">
          Everything above lives in this browser's local storage for this folder, and
          nowhere else. Moving the folder, clearing site data or switching browser
          loses it. Export now and again.
        </p>
        ${!QStore.persistent ? `<div class="banner"><b>Nothing is being saved.</b>
          This browser is blocking local storage, so this session will not be remembered.</div>` : ""}
        <nav class="actions">
          <button id="export" class="primary">Export JSON</button>
          <button id="import-btn">Import JSON</button>
          <input type="file" id="import-file" accept="application/json,.json" hidden>
          <button id="reset" class="danger right">Erase all progress</button>
        </nav>
        <p class="subtle" id="data-message"></p>
      </div>`;

    wireDataControls();
    wireCharts();
    QApp.setStatus("");
  }

  /* ---- Export / import / reset ---------------------------------------------------- */

  function message(text, className) {
    const node = root.querySelector("#data-message");
    node.className = "subtle " + (className || "");
    node.textContent = text;
  }

  function wireDataControls() {
    root.querySelector("#export").addEventListener("click", () => {
      const stamp = new Date().toISOString().slice(0, 10);
      const blob = new Blob([QStore.exportJSON()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quant-practice-" + stamp + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      message("Exported " + QStore.attempts().length + " attempts.", "good");
    });

    const file = root.querySelector("#import-file");
    root.querySelector("#import-btn").addEventListener("click", () => file.click());

    file.addEventListener("change", () => {
      const chosen = file.files && file.files[0];
      if (!chosen) return;
      const reader = new FileReader();
      reader.onload = () => {
        // Merging by default: importing a backup should not silently discard
        // whatever has been practised since it was taken.
        const result = QStore.importJSON(String(reader.result), { merge: true });
        if (!result.ok) { message(result.error, "bad"); return; }
        render();
        message("Imported " + result.added + " new attempts" +
          (result.skipped ? ", skipped " + result.skipped + " already held." : "."), "good");
      };
      reader.onerror = () => message("Could not read that file.", "bad");
      reader.readAsText(chosen);
      file.value = "";
    });

    root.querySelector("#reset").addEventListener("click", () => {
      const n = QStore.attempts().length;
      if (!n) { message("There is nothing stored to erase.", ""); return; }
      if (!window.confirm(
        "Erase all " + n + " recorded attempts and every test result?\n\n" +
        "This cannot be undone. Export first if you might want them back.")) return;
      QStore.reset();
      render();
      message("Erased.", "");
    });
  }

  return { name: "stats", title: "Stats", wide: true, mount, unmount };
})());
