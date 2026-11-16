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

   Three more optional fields decide WHERE a paper's questions come from and
   how strictly it is sat:

     categories     allow-list: draw only from these categories
     excludeCategories  block-list: draw from anything but these
     generator      id of a generator (see gen-arithmetic.js). The paper is made
                    fresh every sitting and the bank is not used at all.
     mustAnswer     true — one question at a time, no skipping and no going
                    back: choosing an option is final and moves straight on.
                    Needs navigation: 'linear'. Questions never reached score
                    marking.skipped.

   An INTERVIEW format is a different kind of sitting — spoken-style problems
   with no options, which you mark yourself — and has its own shape:

     interview      { blocks: [{ level, minutes }, ...] }. One opening problem
                    of that level is drawn for each block, with its follow-up.
                    A block whose opening problem you do not solve ends the
                    interview. `minutes` is a guide shown beside the block, not
                    a limit; timeLimitSec is the only clock that stops you.
                    questionCount, optionCount, marking and navigation are not
                    used and can be left out.
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

    // The Flow-style drill categories are 4-option today, so this is a guard
    // rather than a filter: it keeps a Maven paper a Maven paper if they ever
    // gain a fifth option.
    excludeCategories: ["mental arithmetic", "sequences"],

    // categoryWeights deliberately omitted. 130 of the 191 questions in the
    // bank sit in the single category "probability", so weighting by category
    // would fail to fill a paper for no useful reason. Add weights once the
    // bank carries finer-grained categories or tags.
  },

  /* ------------------------------------------------------------------------
     FLOW TRADERS — numerical test (trading roles). Two separate papers.

     Researched November 2026. Flow's own graduate page says only that the
     numerical test "evaluates mental math and sequences". The numbers below
     are the ones published by Trading Interview, which hosts the assessment:

       maths      60 questions in 6 minutes, multiple choice, one at a time,
                  no skipping and no going back. +1 right, -1 wrong, 0 for
                  anything not reached. Integers, decimals and fractions.
       sequences  26 questions in 25 minutes, multiple choice, free
                  navigation. +1 right, -1 wrong, 0 skipped. Number series:
                  find the rule, give the next term.

     NOT confirmed by the host, so treat as best available:
       - four options per question. Two third-party prep sites say four for the
         maths test; nobody states it for sequences, where four is an assumption.
       - no pass mark is published. Reports range from about 60% to 70% of the
         points; one candidate reported advancing on 55 right out of 60.
       - older and regional versions exist: 75 in 10 minutes (typed answers,
         Flow's own old test page), 75 or 80 in 8. If your invitation states a
         different length, change questionCount and timeLimitSec to match.
     --------------------------------------------------------------------- */

  {
    id: "flow-math",
    name: "Flow Traders maths test — 60 in 6",
    questionCount: 60,
    timeLimitSec: 6 * 60,
    optionCount: 4,
    marking: { correct: 1, incorrect: -1, skipped: 0 },
    navigation: "linear",
    mustAnswer: true,
    allowFlagging: false,
    generator: "arithmetic-sprint",
    note: `60 sums in 6 minutes — six seconds each. One at a time: picking an
      option is final and moves you on, and you cannot skip. A wrong answer
      costs a mark; a sum you never reach costs nothing, so a sure answer
      slowly beats a guess quickly. No calculator. Finishing all 60 is not
      expected. Four options is the reported count, not a confirmed one.`,
  },

  {
    id: "flow-sequences",
    name: "Flow Traders sequences test — 26 in 25",
    questionCount: 26,
    timeLimitSec: 25 * 60,
    optionCount: 4,
    marking: { correct: 1, incorrect: -1, skipped: 0 },
    navigation: "free",
    allowFlagging: true,
    generator: "number-series",
    note: `26 number series in 25 minutes: find the rule, pick the next term.
      Free navigation, so bank the quick ones and come back. A wrong answer
      costs a mark and a skip costs nothing — leave it blank unless you have
      found a rule that fits every term. Pen and paper are allowed, a
      calculator is not. Easier series come first here; the real order is not
      published. Four options is an assumption; the host does not say.`,
  },

  /* ------------------------------------------------------------------------
     WINCENT — first quant interview. Researched November 2026.

     From the invitation Wincent sends, and its own careers pages:
       - 45 minutes online with one of the quant team, on problems "slightly
         more complex" than the online test.
       - three blocks of progressively harder questions. You reach the next
         block only by correctly solving the question(s) of the one before, so
         the interview lasts anywhere from 10 to 45 minutes.
       - they are watching how you work with clues, your approach, and how you
         react; reasoning aloud counts for more than a fast answer.
       - topics: probability, expected value, combinatorics, logic puzzles,
         mental maths. Candidates report problems read aloud over a video call.

     NOT published, so the numbers below are judgements:
       - how many questions a block has. Here: one problem and one follow-up.
       - whether the follow-up gates the next block. Here only the opening
         problem does.
       - how long a block lasts. 10 / 15 / 20 minutes is a guide that adds up
         to 45; only the 45-minute clock stops you.
       - whether a problem solved only after clues still counts. Here it does,
         and the clues you took are recorded.
     --------------------------------------------------------------------- */

  {
    id: "wincent-interview",
    name: "Wincent quant interview — three gated blocks",
    timeLimitSec: 45 * 60,
    interview: {
      blocks: [
        { level: 1, minutes: 10 },
        { level: 2, minutes: 15 },
        { level: 3, minutes: 20 },
      ],
    },
    note: `Three blocks, each harder than the last: one problem, then a follow-up
      that changes it. Talk your reasoning through out loud, as you would to
      the interviewer, and ask for a clue when you are stuck rather than
      sitting in silence — how you use clues is part of what they watch. You
      mark yourself against the answer. Miss a block's opening problem and the
      interview ends there, as the real one would.`,
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
    // Still unresearched, so still empty: without this the four-option Flow
    // drill questions would quietly fill it and make it look ready.
    excludeCategories: ["mental arithmetic", "sequences"],
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
    excludeCategories: ["mental arithmetic", "sequences"],
    note: `Forward only — once you move on you cannot come back. Illustrative
      numbers — check them against the real assessment.`,
  },

]);
