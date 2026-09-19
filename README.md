# Quant practice

A practice tool for quant trading interview questions. Static files, no build
step, no dependencies. Open `index.html` in a browser — `file://` is fine.

Four tabs:

| | |
|---|---|
| **Practice** | one question at a time, at random, in order, or only what you got wrong |
| **Test** | a timed mock paper under a firm's assessment format |
| **Stats** | what your history adds up to, plus export/import/reset |
| **Bank** | the health of the question bank and what still needs writing |

KaTeX is loaded from a CDN. Offline, maths falls back to raw `$...$` text and
the footer says so; nothing else is affected.

## Adding questions

Put a file in `questions/`, have it call `QBank.add([...])`, and add one
`<script>` tag to `index.html` next to the others. That is the whole procedure.
There is no auto-discovery — `file://` blocks `fetch()`, so a script tag is the
only way to load a local file without a build step or a server.

```js
QBank.add([
  {
    id: "unique-slug",        // required, unique across every bank file
    category: "probability",  // required; new categories appear in the filter
    difficulty: 2,            // 1 easy, 2 medium, 3 hard
    time: 120,                // target seconds; the practice timer warns past it
    question: `text`,         // required; HTML, with LaTeX in $x$ or $$x$$
    hint: `text`,
    solution: `text`,

    // All optional. With options + answer the question becomes multiple
    // choice and can appear in a test; without them it stays free-response
    // and is silently skipped by test mode.
    options: [`a`, `b`, `c`, `d`, `e`],
    answer: 2,                // 0-based index into options
    tags: ["bayes", "symmetry"],
    source: "Maven OA",
  },
]);
```

Use backticks so you can write multi-line text and quotes freely, and **double
every backslash** inside them: `\\frac`, `\\binom`, `\\sqrt`.

Option order in source does not matter — the app shuffles options every time a
question is shown, so repetition teaches the answer rather than its position.
Writing them in ascending order keeps the file readable.

## Test formats

A format is data, in `formats.js`. Nothing in the app knows which firm it is
running, so adding one is adding an object:

```js
{
  id: "maven-oa",
  name: "Maven Securities — Online Assessment",
  questionCount: 18,
  timeLimitSec: 30 * 60,
  optionCount: 5,                                    // eligibility is by this alone
  marking: { correct: 1, incorrect: -1, skipped: 0 },
  navigation: "free",                                // or "linear", forward only
  allowFlagging: true,
  categoryWeights: { probability: 10, logic: 8 },    // optional; must sum to questionCount
  note: `Shown on the start screen.`,
}
```

A question is eligible for a format when it has exactly `optionCount` options
and an in-range `answer`. Where there are not enough, the start screen offers a
shortened paper with the time scaled pro rata.

The Optiver and IMC formats that ship are **illustrative** — plausible numbers,
not researched. Correct them before relying on them.

## Validating

```
node validate.js                # all issues
node validate.js --errors-only
node validate.js --json
```

Exits non-zero on any error, so it can go straight into a pre-commit hook. It
reports duplicate ids, missing required fields, out-of-range answers, option
counts that match no format, unbalanced `$` delimiters, and any `questions/*.js`
with no `<script>` tag in `index.html`. It finishes with counts by category and
difficulty and how close each format is to a full paper.

The Bank tab runs the identical checks in the browser — both read
`validate-core.js`, so they cannot drift apart.

## Keyboard

| key | |
|---|---|
| `n` | next question |
| `p` `←` `→` | previous / move (sequential practice, free-navigation tests) |
| `1`–`8` | choose an option |
| `0` `Backspace` | clear the answer (test mode) |
| `h` `s` | hint / solution |
| `g` `m` | self-grade a free-response question: got it / missed it |
| `f` | flag for review (test mode) |
| `r` | review screen, or submit on a linear paper |
| `b` | back to the paper from the review screen |

## What gets recorded

An attempt is recorded when you answer a multiple-choice question, self-grade,
or read the solution. Pressing next without doing any of those records nothing,
so browsing the bank does not fill review mode with questions you never tried.

Free-response questions cannot be graded by the app, so `g`/`m` is how anything
becomes right or wrong. Reading a solution without self-grading is recorded as
*ungraded*: it counts as seen but never as right or wrong.

Review mode serves anything whose **most recent** attempt was wrong, was
skipped, or went over the target time — so fixing a question retires it.

## Your data

Everything lives in this browser's `localStorage`, for this folder, and nowhere
else. Moving the folder, clearing site data or switching browser loses it.
Export from the Stats tab now and again. Import merges by default rather than
replacing.

A test paper in progress lives in memory only: navigating away asks first, but
reloading the page loses it.

## Files

```
index.html           shell: styles, tab bar, script tags
bank.js              QBank + QFormats registries, and the question schema
formats.js           the test formats
store.js             attempt history, stats, export/import
validate-core.js     the validation rules, shared by the CLI and the Bank tab
validate.js          node CLI over those rules
app.js               routing, keyboard, shared helpers
view-practice.js     ┐
view-test.js         │ one file per tab; each registers itself with QApp
view-stats.js        │
view-bank.js         ┘
questions/           the bank, one file per batch
tests.html           open it in a browser; it runs ~90 self checks and says
                     what failed. Uses a separate storage key, so it cannot
                     touch real practice history.
```
