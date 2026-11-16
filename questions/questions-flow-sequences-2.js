/* ============================================================================
   QUESTION BANK — NUMBER SEQUENCES, SECOND SET (FLOW TRADERS STYLE)
   ----------------------------------------------------------------------------
   18 more worked series for the Practice tab, to go with the thirty in
   questions-flow-sequences.js. Each uses a rule that appears neither there nor
   among the rule families behind the generated paper on the Test tab, so these
   are the less usual ideas: rules that work on digits, on positions, or on
   more than one earlier term.

   Each series was generated from its rule by machine, the answer is the rule's
   next term, and each was checked against the simple readings (steady
   differences, a steady ratio, sum of the last two, two interleaved series) to
   make sure none of them gives a different answer.
   ========================================================================== */

QBank.add([

  {
    id: "seq-three-in-a-row-product",
    category: "sequences",
    difficulty: 2,
    time: 75,
    source: "Flow Traders OA",
    question: `What comes next?$$6,\\quad 24,\\quad 60,\\quad 120,\\quad 210,\\quad ?$$`,
    options: [`$300$`, `$330$`, `$336$`, `$360$`],
    answer: 2,
    hint: `Factorise the terms.`,
    solution: `$1 \\times 2 \\times 3,\\ 2 \\times 3 \\times 4,\\ \\dots,\\ 5 \\times 6 \\times 7$: each term is three consecutive whole numbers multiplied together, so next is $6 \\times 7 \\times 8 = 336$. Without spotting that: the differences are $18, 36, 60, 90$, and their differences $18, 24, 30$ go up by 6, so the next difference is $90 + 36 = 126$.`,
  },

  {
    id: "seq-multiply-the-digits",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$77,\\quad 49,\\quad 36,\\quad 18,\\quad ?$$`,
    options: [`$6$`, `$8$`, `$9$`, `$12$`],
    answer: 1,
    hint: `Look at the digits of each term, not at the gaps between terms.`,
    solution: `Multiply the digits of each term to get the next: $7 \\times 7 = 49$, $4 \\times 9 = 36$, $3 \\times 6 = 18$, and $1 \\times 8 = 8$.`,
  },

  {
    id: "seq-square-the-digits",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$19,\\quad 82,\\quad 68,\\quad 100,\\quad ?$$`,
    options: [`$1$`, `$10$`, `$36$`, `$118$`],
    answer: 0,
    hint: `Square each digit.`,
    solution: `Add up the squares of the digits: $1 + 81 = 82$, $64 + 4 = 68$, $36 + 64 = 100$, and then $1 + 0 + 0 = 1$. A term that suddenly collapses is a sign the rule works on digits.`,
  },

  {
    id: "seq-difference-of-two",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$50,\\quad 31,\\quad 19,\\quad 12,\\quad 7,\\quad ?$$`,
    options: [`$2$`, `$3$`, `$4$`, `$5$`],
    answer: 3,
    hint: `Subtract each term from the one before it.`,
    solution: `Each term is the difference of the two before it: $50 - 31 = 19$, $31 - 19 = 12$, $19 - 12 = 7$, and $12 - 7 = 5$. It is a sum-of-the-last-two sequence read backwards.`,
  },

  {
    id: "seq-squares-backwards",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$1,\\quad 4,\\quad 9,\\quad 61,\\quad 52,\\quad 63,\\quad ?$$`,
    options: [`$46$`, `$49$`, `$74$`, `$94$`],
    answer: 3,
    hint: `Read each term from right to left.`,
    solution: `These are the squares $1, 4, 9, 16, 25, 36$ with their digits reversed. Next is 49 reversed: $94$.`,
  },

  {
    id: "seq-fraction-top-from-bottom",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$\\tfrac{1}{2},\\quad \\tfrac{2}{3},\\quad \\tfrac{3}{5},\\quad \\tfrac{5}{8},\\quad ?$$`,
    options: [`$\\tfrac{8}{13}$`, `$\\tfrac{13}{21}$`, `$\\tfrac{7}{11}$`, `$\\tfrac{8}{11}$`],
    answer: 0,
    hint: `Where does each new top come from? And each new bottom?`,
    solution: `Each top is the previous bottom, and each bottom is the previous top plus the previous bottom: $\\tfrac{5}{8}$ becomes $\\tfrac{8}{5 + 8} = \\tfrac{8}{13}$.`,
  },

  {
    id: "seq-times-position-plus-one",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$1,\\quad 2,\\quad 5,\\quad 16,\\quad 65,\\quad ?$$`,
    options: [`$261$`, `$321$`, `$324$`, `$326$`],
    answer: 3,
    hint: `Compare each term with a multiple of the one before it.`,
    solution: `Multiply by $1, 2, 3, 4$ in turn, adding 1 each time: $1 \\times 1 + 1 = 2$, $2 \\times 2 + 1 = 5$, $5 \\times 3 + 1 = 16$, $16 \\times 4 + 1 = 65$. Next is $65 \\times 5 + 1 = 326$.`,
  },

  {
    id: "seq-squares-and-cubes",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$1,\\quad 8,\\quad 9,\\quad 64,\\quad 25,\\quad 216,\\quad ?$$`,
    options: [`$36$`, `$49$`, `$81$`, `$343$`],
    answer: 1,
    hint: `Odd positions and even positions behave differently, but both depend on the position number.`,
    solution: `The $n$th term is $n^2$ when $n$ is odd and $n^3$ when $n$ is even: $1^2, 2^3, 3^2, 4^3, 5^2, 6^3$. The seventh is $7^2 = 49$.`,
  },

  {
    id: "seq-sum-then-product",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$1,\\quad 2,\\quad 3,\\quad 6,\\quad 9,\\quad 54,\\quad ?$$`,
    options: [`$60$`, `$63$`, `$108$`, `$486$`],
    answer: 1,
    hint: `Each term comes from the two before it, but not always in the same way.`,
    solution: `Add, then multiply, in turn: $1 + 2 = 3$, $2 \\times 3 = 6$, $3 + 6 = 9$, $6 \\times 9 = 54$. An addition is due: $9 + 54 = 63$.`,
  },

  {
    id: "seq-add-three-back",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$1,\\quad 2,\\quad 3,\\quad 4,\\quad 6,\\quad 9,\\quad 13,\\quad ?$$`,
    options: [`$17$`, `$18$`, `$19$`, `$22$`],
    answer: 2,
    hint: `Write down the differences, then look back at the sequence itself.`,
    solution: `The differences are $1, 1, 1, 2, 3, 4$: the sequence itself, running three places behind. So each term is the one before it plus the one three before it: $13 + 6 = 19$.`,
  },

  {
    id: "seq-add-the-last-digit",
    category: "sequences",
    difficulty: 3,
    time: 75,
    source: "Flow Traders OA",
    question: `What comes next?$$7,\\quad 14,\\quad 18,\\quad 26,\\quad 32,\\quad 34,\\quad ?$$`,
    options: [`$36$`, `$38$`, `$40$`, `$41$`],
    answer: 1,
    hint: `The gaps are $7, 4, 8, 6, 2$. Where have you just seen those numbers?`,
    solution: `Add to each term its own last digit: $7 + 7 = 14$, $14 + 4 = 18$, $18 + 8 = 26$, $26 + 6 = 32$, $32 + 2 = 34$, and then $34 + 4 = 38$.`,
  },

  {
    id: "seq-fractions-hidden-step",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$\\tfrac{1}{3},\\quad \\tfrac{1}{2},\\quad \\tfrac{2}{3},\\quad \\tfrac{5}{6},\\quad ?$$`,
    options: [`$\\tfrac{6}{7}$`, `$\\tfrac{11}{12}$`, `$1$`, `$\\tfrac{7}{6}$`],
    answer: 2,
    hint: `Write them all over the same bottom.`,
    solution: `In sixths these are $\\tfrac{2}{6}, \\tfrac{3}{6}, \\tfrac{4}{6}, \\tfrac{5}{6}$: a plain sequence going up by $\\tfrac{1}{6}$, disguised by cancelling. Next is $\\tfrac{6}{6} = 1$.`,
  },

  {
    id: "seq-sixty-over-position",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$60,\\quad 30,\\quad 20,\\quad 15,\\quad 12,\\quad ?$$`,
    options: [`$8$`, `$9$`, `$10$`, `$11$`],
    answer: 2,
    hint: `Multiply each term by its position in the sequence.`,
    solution: `These are $60 \\div 1,\\ 60 \\div 2,\\ 60 \\div 3,\\ 60 \\div 4,\\ 60 \\div 5$, so next is $60 \\div 6 = 10$. Seen as ratios, the steps are $\\times\\tfrac{1}{2}, \\times\\tfrac{2}{3}, \\times\\tfrac{3}{4}, \\times\\tfrac{4}{5}$, then $\\times\\tfrac{5}{6}$.`,
  },

  {
    id: "seq-neighbouring-primes-added",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$5,\\quad 8,\\quad 12,\\quad 18,\\quad 24,\\quad ?$$`,
    options: [`$28$`, `$30$`, `$32$`, `$36$`],
    answer: 1,
    hint: `Each term is the sum of two neighbours in a well-known list.`,
    solution: `$2 + 3,\\ 3 + 5,\\ 5 + 7,\\ 7 + 11,\\ 11 + 13$: each term adds two consecutive primes. Next is $13 + 17 = 30$.`,
  },

  {
    id: "seq-three-step-cycle",
    category: "sequences",
    difficulty: 1,
    time: 45,
    source: "Flow Traders OA",
    question: `What comes next?$$4,\\quad 5,\\quad 7,\\quad 10,\\quad 11,\\quad 13,\\quad 16,\\quad ?$$`,
    options: [`$17$`, `$18$`, `$19$`, `$20$`],
    answer: 0,
    hint: `Write down the gaps.`,
    solution: `The gaps run $1, 2, 3, 1, 2, 3$ and then begin again with 1: $16 + 1 = 17$. A repeating cycle has to be seen twice before you can trust it, which is why this series is a long one.`,
  },

  {
    id: "seq-average-of-two",
    category: "sequences",
    difficulty: 2,
    time: 60,
    source: "Flow Traders OA",
    question: `What comes next?$$0,\\quad 16,\\quad 8,\\quad 12,\\quad 10,\\quad ?$$`,
    options: [`$11$`, `$12$`, `$13$`, `$14$`],
    answer: 0,
    hint: `The terms are closing in on something. Where does each one sit between the two before it?`,
    solution: `Each term is the average of the two before it: $\\tfrac{12 + 10}{2} = 11$. Seen as gaps: $+16, -8, +4, -2$, halving and changing sign each time, so the next gap is $+1$.`,
  },

  {
    id: "seq-position-and-its-square",
    category: "sequences",
    difficulty: 3,
    time: 90,
    source: "Flow Traders OA",
    question: `What comes next?$$11,\\quad 24,\\quad 39,\\quad 416,\\quad 525,\\quad ?$$`,
    options: [`$536$`, `$630$`, `$634$`, `$636$`],
    answer: 3,
    hint: `The jump from 39 to 416 is too big for any arithmetic. Split each term in two.`,
    solution: `Each term is a position number with its square written straight after it: $1|1,\\ 2|4,\\ 3|9,\\ 4|16,\\ 5|25$. Next is $6|36$, written $636$.`,
  },

  {
    id: "seq-gaps-times-minus-two",
    category: "sequences",
    difficulty: 3,
    time: 75,
    source: "Flow Traders OA",
    question: `What comes next?$$10,\\quad 11,\\quad 9,\\quad 13,\\quad 5,\\quad ?$$`,
    options: [`$-11$`, `$13$`, `$21$`, `$37$`],
    answer: 2,
    hint: `Write down the gaps, with their signs.`,
    solution: `The gaps are $+1, -2, +4, -8$: each is $-2$ times the one before. The next gap is $+16$, giving $5 + 16 = 21$.`,
  },

]);
