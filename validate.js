#!/usr/bin/env node
/* ============================================================================
   BANK VALIDATOR  —  node validate.js

   Loads bank.js, formats.js and every questions/*.js the way the browser does,
   runs the rules in validate-core.js, prints a report and exits non-zero if
   anything is an error. Suitable for a pre-commit hook.

     node validate.js                all issues
     node validate.js --errors-only  skip warnings
     node validate.js --json         machine-readable

   The rules live in validate-core.js, which the app loads too, so the CLI and
   the in-app Bank view can never disagree.
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const QUESTIONS_DIR = path.join(ROOT, "questions");

const args = process.argv.slice(2);
const ERRORS_ONLY = args.includes("--errors-only");
const AS_JSON = args.includes("--json");

/* Colour only when writing to a terminal, so piping stays clean. */
const tty = process.stdout.isTTY && !AS_JSON;
const c = {
  red: s => (tty ? "\x1b[31m" + s + "\x1b[0m" : s),
  yellow: s => (tty ? "\x1b[33m" + s + "\x1b[0m" : s),
  green: s => (tty ? "\x1b[32m" + s + "\x1b[0m" : s),
  dim: s => (tty ? "\x1b[2m" + s + "\x1b[0m" : s),
  bold: s => (tty ? "\x1b[1m" + s + "\x1b[0m" : s),
};

function die(message) {
  console.error(c.red("validate: " + message));
  process.exit(2);
}

/* ---- Collect the files in the same order the browser loads them ----------- */

function bankFiles() {
  if (!fs.existsSync(QUESTIONS_DIR)) die("no questions/ directory next to validate.js");
  return fs.readdirSync(QUESTIONS_DIR)
    .filter(f => f.endsWith(".js"))
    .sort()
    .map(f => path.join(QUESTIONS_DIR, f));
}

const files = [
  path.join(ROOT, "bank.js"),
  path.join(ROOT, "validate-core.js"),
  path.join(ROOT, "formats.js"),
  path.join(ROOT, "gen-arithmetic.js"),
  path.join(ROOT, "gen-sequences.js"),
  ...bankFiles(),
];

for (const f of files) if (!fs.existsSync(f)) die("missing " + path.relative(ROOT, f));

/* Syntax-check each file on its own first: a SyntaxError in the combined source
   reports a meaningless line number, and one bad file should name itself. */
const sources = [];
let syntaxFailed = false;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  try {
    new vm.Script(src, { filename: file });
  } catch (e) {
    syntaxFailed = true;
    console.error(c.red("SyntaxError in " + path.relative(ROOT, file)) + "\n  " + e.message);
  }
  sources.push(src);
}
if (syntaxFailed) process.exit(1);

/* Then run them as one script. Separate <script> tags share a global lexical
   scope in the browser; separate vm scripts do not, so they are concatenated
   to reproduce it — top-level `const QBank` has to be visible to the bank
   files that call it. */
const sandbox = { console };
let registries;
try {
  registries = vm.runInNewContext(
    sources.join("\n;\n") + "\n;({ QBank: QBank, QFormats: QFormats, QValidate: QValidate, QGenerators: QGenerators });",
    sandbox,
    { filename: "bank+questions" }
  );
} catch (e) {
  die("failed to load the bank: " + e.message);
}

const { QBank, QFormats, QValidate, QGenerators } = registries;

/* ---- Validate -------------------------------------------------------------- */

const questions = QBank.all();
const formats = QFormats.all();

const result = QValidate.validate({
  questions,
  formats,
  problems: QBank.problems().concat(QFormats.problems(), QGenerators.problems()),
  // Every generated format: 50 whole papers made and re-marked from scratch.
  generators: QGenerators.all(),
  generatorPapers: 50,
});

const errors = result.issues.filter(i => i.severity === QValidate.ERROR);
const warnings = result.issues.filter(i => i.severity === QValidate.WARN);

/* A bank file that exists but has no <script> tag is silently absent from the
   app — an easy and invisible mistake given tags are added by hand. */
const unreferenced = [];
const indexPath = path.join(ROOT, "index.html");
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, "utf8");
  for (const f of bankFiles()) {
    const rel = "questions/" + path.basename(f);
    if (!html.includes(rel)) unreferenced.push(rel);
  }
}

/* ---- Report ---------------------------------------------------------------- */

if (AS_JSON) {
  console.log(JSON.stringify({ ...result, unreferenced }, null, 2));
  process.exit(errors.length ? 1 : 0);
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function padLeft(s, n) {
  s = String(s);
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

function printIssues(label, list, colour) {
  if (!list.length) return;
  console.log("\n" + colour(label + " (" + list.length + ")"));
  const idWidth = Math.min(34, Math.max(...list.map(i => i.id.length)) + 2);
  const fieldWidth = Math.max(...list.map(i => i.field.length)) + 2;
  for (const i of list)
    console.log("  " + pad(i.id, idWidth) + c.dim(pad(i.field, fieldWidth)) + i.message);
}

console.log(c.bold("\nQuant practice — bank validation"));
console.log(c.dim(files.length - 5 + " bank file(s), " + questions.length + " questions, " +
  formats.length + " test format(s)"));

printIssues("ERRORS", errors, c.red);
if (!ERRORS_ONLY) printIssues("WARNINGS", warnings, c.yellow);

if (unreferenced.length) {
  console.log("\n" + c.yellow("NOT LOADED BY index.html (" + unreferenced.length + ")"));
  for (const f of unreferenced)
    console.log("  " + f + c.dim("  — add a <script> tag or the app will not see it"));
}

const s = result.summary;

console.log(c.bold("\nBy category"));
console.log(c.dim("  " + pad("category", 22) + padLeft("total", 7) + padLeft("with options", 14)));
for (const [cat, n] of Object.entries(s.byCategory).sort((a, b) => b[1].total - a[1].total))
  console.log("  " + pad(cat, 22) + padLeft(n.total, 7) + padLeft(n.mc, 14));
console.log("  " + pad("", 22) + padLeft(s.total, 7) + padLeft(s.multipleChoice, 14));

console.log(c.bold("\nBy difficulty"));
console.log("  " + ["1 easy", "2 medium", "3 hard"]
  .map((label, i) => pad(label + " " + s.byDifficulty[i + 1], 14)).join("") +
  (s.byDifficulty.unset ? c.yellow("unset " + s.byDifficulty.unset) : ""));

const tagNames = Object.keys(s.tags);
console.log(c.bold("\nTags"));
console.log("  " + (tagNames.length
  ? tagNames.sort().map(t => t + " " + s.tags[t]).join("   ")
  : c.dim("none yet — add a tags: [...] array to any question")));

console.log(c.bold("\nTest eligibility"));
for (const e of s.eligibility) {
  const ok = e.shortBy === 0;
  console.log("  " + pad(e.id, 16) + pad(e.generated ? "generated" : e.eligible + " / " + e.questionCount, 12) +
    (ok ? c.green("ready") : c.yellow(e.shortBy + " short")));
}

if (s.generated && s.generated.length) {
  console.log(c.bold("\nGenerated papers, re-marked"));
  for (const g of s.generated)
    console.log("  " + pad(g.format, 16) + pad(g.sampled + " questions", 18) +
      (g.failures ? c.red(g.failures + " wrong") : c.green("all correct")));
}

console.log("");
if (errors.length) {
  console.log(c.red("FAILED — " + errors.length + " error(s), " + warnings.length + " warning(s)\n"));
  process.exit(1);
}
console.log(c.green("OK") + c.dim(" — 0 errors, " + warnings.length + " warning(s)") + "\n");
process.exit(0);
