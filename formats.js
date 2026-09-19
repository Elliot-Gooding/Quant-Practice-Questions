/* ============================================================================
   TEST FORMATS
   ----------------------------------------------------------------------------
   A test format is pure data. The test runner reads these fields and nothing
   else — no format id appears anywhere in the app logic — so adding a firm is
   adding an object to this file.

     id             unique slug
     name           shown in the format picker
     questionCount  how many questions the paper has
     timeLimitSec   total time for the whole paper
     optionCount    multiple-choice options per question; a question is only
                    eligible for this format if it has exactly this many
     marking        { correct, incorrect, skipped } points
     navigation     'free'   — jump between questions, review screen before submit
                    'linear' — forward only, no going back
     allowFlagging  whether questions can be flagged for review
     categoryWeights  optional { category: count } — how many questions to draw
                    from each category. Must sum to questionCount. Omit it and
                    the paper is drawn from all eligible questions at random.
     note           optional; shown on the start screen
   ========================================================================== */

QFormats.add([

  {
    id: "maven-oa",
    name: "Maven Securities — Online Assessment",
    questionCount: 18,
    timeLimitSec: 30 * 60,
    optionCount: 5,
    marking: { correct: 1, incorrect: -1, skipped: 0 },
    navigation: "free",
    allowFlagging: true,
    note: `18 questions in 30 minutes. A wrong answer costs a mark, a skip costs
      nothing — so only answer when you can beat a 1-in-5 guess. No calculator,
      no paper.`,

    // categoryWeights deliberately omitted. 130 of the 191 questions in the
    // bank sit in the single category "probability", so weighting by category
    // would fail to fill a paper for no useful reason. Add weights once the
    // bank carries finer-grained categories or tags.
  },

  /* ------------------------------------------------------------------------
     The two formats below are ILLUSTRATIVE. They exist to prove the runner is
     data-driven — note that they exercise four options rather than five, no
     negative marking, and linear navigation. The numbers are plausible, not
     researched: correct them against the real assessments before relying on
     them as practice.
     --------------------------------------------------------------------- */

  {
    id: "optiver-style",
    name: "Optiver-style pattern round (illustrative)",
    questionCount: 20,
    timeLimitSec: 20 * 60,
    optionCount: 4,
    marking: { correct: 1, incorrect: 0, skipped: 0 },
    navigation: "free",
    allowFlagging: true,
    note: `No penalty for a wrong answer, so never leave one blank. Illustrative
      numbers — check them against the real assessment.`,
  },

  {
    id: "imc-style",
    name: "IMC-style numerical round (illustrative)",
    questionCount: 15,
    timeLimitSec: 15 * 60,
    optionCount: 5,
    marking: { correct: 1, incorrect: 0, skipped: 0 },
    navigation: "linear",
    allowFlagging: false,
    note: `Forward only — once you move on you cannot come back. Illustrative
      numbers — check them against the real assessment.`,
  },

]);
