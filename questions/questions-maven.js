/* ============================================================================
   QUESTION BANK — MAVEN SECURITIES OA
   ----------------------------------------------------------------------------
   Format target: 18 questions / 30 minutes, five multiple-choice options,
   wrong answer = -1, skip = 0, no calculator AND no pen and paper.

   Design principle: every question has a move that collapses the arithmetic.
   If you find yourself doing long multiplication, you have missed the trick.
   The numbers are deliberately small. The thinking is not.

   Same object format as before:
     { id, category, difficulty (1-3), time (seconds), question, hint, solution }
   Backslashes must be doubled inside backticks (\\frac, \\binom, ...).
   ========================================================================== */

QBank.add([

  /* ===================== LINEARITY OF EXPECTATION ======================== */

  {
    id: "traffic-clumps",
    category: "expected value",
    difficulty: 3,
    time: 150,
    options: [
      `$1.93$`,
      `$2.50$`,
      `$2.93$`,
      `$3.33$`,
      `$5.00$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Ten cars enter a single-lane road one after another, in a random order, each
      with its own constant preferred speed (all ten speeds distinct). A car that catches up to a
      slower car cannot overtake, so it joins that car's clump and travels at the slower speed.
      What is the expected number of clumps that eventually form?`,
    hint: `A car leads a clump exactly when it is slower than every car ahead of it. Forget the dynamics
      entirely — ask only about the relative order of speeds.`,
    solution: `<p>Number the cars $1,\\dots,10$ in road order. Car $k$ ends up leading a clump precisely
      when it is the slowest of the first $k$ cars — nothing behind it matters, and if anything ahead were
      slower it would have been absorbed. By symmetry that has probability $\\frac{1}{k}$.</p>
      <p>Clumps are in bijection with leaders, so by linearity</p>
      $$E = \\sum_{k=1}^{10}\\frac{1}{k} = H_{10} \\approx 2.93.$$
      <p>The trap is trying to model catch-up times. The whole problem is a statement about orderings.
      Note $H_n \\approx \\ln n + 0.577$, which is a useful estimate to carry.</p>`,
  },

  {
    id: "local-maxima-line",
    category: "expected value",
    difficulty: 2,
    time: 120,
    options: [
      `$3$`,
      `$\\tfrac{10}{3}$`,
      `$\\tfrac{11}{3}$`,
      `$4$`,
      `$5$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `The numbers $1$ through $10$ are arranged in a row in a uniformly random order. Call a
      position a <em>peak</em> if its number is larger than each of its immediate neighbours (the two end
      positions have only one neighbour). What is the expected number of peaks?`,
    hint: `Handle interior positions and end positions separately. For each, only a tiny local comparison matters.`,
    solution: `<p>An interior position is a peak iff its value is the largest of the three consecutive values,
      probability $\\frac{1}{3}$. An end position is a peak iff it beats its single neighbour, probability
      $\\frac{1}{2}$. There are 8 interior and 2 end positions, so</p>
      $$E = 8\\cdot\\frac{1}{3} + 2\\cdot\\frac{1}{2} = \\frac{8}{3} + 1 = \\frac{11}{3} \\approx 3.67.$$
      <p>Indicators need not be independent for linearity to apply — that is the entire point of the technique.</p>`,
  },

  {
    id: "cycles-random-permutation",
    category: "expected value",
    difficulty: 3,
    time: 180,
    options: [
      `$1$`,
      `$1.5$`,
      `$2.45$`,
      `$3$`,
      `$6$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Six people each write their name on a card; the cards are shuffled and dealt back one per
      person. Draw an arrow from each person to the owner of the card they received. This decomposes the
      group into cycles (a person holding their own card is a cycle of length 1). What is the expected
      number of cycles?`,
    hint: `Build the permutation by following one chain at a time and ask, at each step, what the chance is
      that the chain closes right now.`,
    solution: `<p>Start at any person and follow the arrows, revealing cards one at a time. Suppose
      $j$ people remain unrevealed including the current chain's start. The next card is uniform over those
      $j$, and the cycle closes exactly when it is the start: probability $\\frac{1}{j}$.</p>
      <p>Each of the $6$ reveals independently closes a cycle with probability $\\frac{1}{j}$ for
      $j = 6,5,\\dots,1$, so</p>
      $$E = \\sum_{j=1}^{6}\\frac{1}{j} = \\frac{49}{20} = 2.45.$$
      <p>Same harmonic answer as the traffic clumps, for the same underlying reason.</p>`,
  },

  {
    id: "cards-between-red-aces",
    category: "expected value",
    difficulty: 2,
    time: 120,
    options: [
      `$12.5$`,
      `$\\tfrac{50}{3}\\approx 16.7$`,
      `$\\tfrac{52}{3}\\approx 17.3$`,
      `$25$`,
      `$26$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `A standard deck is shuffled. What is the expected number of cards strictly between the
      ace of hearts and the ace of diamonds?`,
    hint: `Pick any one of the other 50 cards. What is the chance it lands between the two red aces?`,
    solution: `<p>Consider the three cards: the two red aces and one other card $c$. All $3! = 6$ relative
      orders are equally likely, and $c$ sits in the middle in 2 of them, so $P = \\frac{1}{3}$.</p>
      <p>By linearity over the other 50 cards:</p>
      $$E = \\frac{50}{3} \\approx 16.7.$$
      <p>No need to think about positions, gaps, or the size of the deck beyond the count 50.</p>`,
  },

  {
    id: "three-distinct-faces",
    category: "expected value",
    difficulty: 2,
    time: 110,
    options: [
      `$3$`,
      `$3.5$`,
      `$3.7$`,
      `$4.2$`,
      `$14.7$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `You roll a fair die repeatedly. What is the expected number of rolls needed until you have
      seen three <em>different</em> faces?`,
    hint: `Break the wait into stages: the wait for a new face is geometric, and its success probability
      changes only when you gain one.`,
    solution: `<p>The first roll always gives a new face. With one face seen, each roll is new with
      probability $\\frac{5}{6}$, so the wait is $\\frac{6}{5}$. With two seen, probability $\\frac{4}{6}$,
      wait $\\frac{6}{4}$.</p>
      $$E = 1 + \\frac{6}{5} + \\frac{3}{2} = \\frac{37}{10} = 3.7.$$
      <p>This is the front end of the coupon collector. The full six-face answer is
      $6H_6 = 14.7$, worth memorising.</p>`,
  },

  {
    id: "consecutive-own-hats",
    category: "expected value",
    difficulty: 3,
    time: 150,
    options: [
      `$\\tfrac{1}{90}$`,
      `$\\tfrac{1}{10}$`,
      `$\\tfrac{1}{9}$`,
      `$\\tfrac{9}{100}$`,
      `$1$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `Ten people numbered $1$ to $10$ throw their hats into a pile and each takes one at random.
      What is the expected number of indices $i$ (from 1 to 9) such that person $i$ <em>and</em> person
      $i+1$ both get their own hat back?`,
    hint: `For one specific pair, the two events are not independent — but the joint probability is still
      a one-line count.`,
    solution: `<p>For a fixed $i$, person $i$ gets their own hat with probability $\\frac{1}{10}$, and given
      that, person $i+1$ gets theirs with probability $\\frac{1}{9}$. So the pair both succeed with
      probability $\\frac{1}{90}$.</p>
      <p>There are 9 such pairs, so</p>
      $$E = \\frac{9}{90} = \\frac{1}{10}.$$
      <p>Compare: the expected number of people getting their own hat is $10 \\cdot \\frac{1}{10} = 1$,
      independent of group size. Both facts fall out of indicators in seconds.</p>`,
  },

  {
    id: "ant-on-cube",
    category: "expected value",
    difficulty: 3,
    time: 180,
    options: [
      `$3$`,
      `$6$`,
      `$7$`,
      `$10$`,
      `$12$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `An ant starts at one corner of a cube and at each step walks along a randomly chosen one of
      the three edges at its current corner. What is the expected number of steps to reach the diagonally
      opposite corner?`,
    hint: `Collapse the eight vertices into four states by distance from the target. Then write three
      equations — and notice the first one is trivial.`,
    solution: `<p>Group vertices by graph distance to the target: $S_3$ (the start, distance 3), $S_2$ (three
      vertices), $S_1$ (three vertices), $S_0$ (the target). From $S_3$ all edges go to $S_2$. From $S_2$,
      one edge goes back to $S_3$ and two go to $S_1$. From $S_1$, two edges go back to $S_2$ and one reaches
      the target.</p>
      <p>With $E_k$ the expected steps from $S_k$:</p>
      $$E_3 = 1 + E_2,\\quad E_2 = 1 + \\tfrac{1}{3}E_3 + \\tfrac{2}{3}E_1,\\quad E_1 = 1 + \\tfrac{2}{3}E_2.$$
      <p>Substituting gives $E_1 = 7$, $E_2 = 9$, and</p>
      $$E_3 = 10.$$
      <p>The symmetry reduction from 8 states to 4 is what makes this doable without paper.</p>`,
  },

  {
    id: "hhh-vs-hth",
    category: "expected value",
    difficulty: 3,
    time: 180,
    options: [
      `Equal, both $8$`,
      `Equal, both $14$`,
      `HHH is larger by $2$`,
      `HHH is larger by $4$`,
      `HTH is larger by $4$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `A fair coin is flipped repeatedly. Let $A$ be the expected number of flips until the pattern
      HHH first appears, and $B$ the expected number until HTH first appears. Which is larger, and by how much?`,
    hint: `Ask what happens after a near-miss. How much of your progress survives a failure in each case?`,
    solution: `<p>Both patterns have probability $\\frac{1}{8}$ in any given window, so the naive guess is that
      they are equal. They are not, because the patterns <em>overlap themselves</em> differently.</p>
      <p>For HHH: condition on the run of heads. $E = 2 + 4 + 8 = 14$ (each additional required head doubles
      the expected wait: $E_k = 2E_{k-1} + 2$).</p>
      <p>For HTH: let $E$ be the answer, $E_H$ the expectation having just seen H, $E_{HT}$ having seen HT.
      $E = 1 + \\frac{1}{2}E_H + \\frac{1}{2}E$; $E_H = 1 + \\frac{1}{2}E_H + \\frac{1}{2}E_{HT}$;
      $E_{HT} = 1 + \\frac{1}{2}\\cdot 0 + \\frac{1}{2}E_H$. Solving: $E_{HT} = 8$, $E_H = 8$, $E = 10$.</p>
      $$A = 14,\\quad B = 10,\\quad A - B = 4.$$
      <p>Rule of thumb: a pattern that overlaps itself heavily (HHH) takes longer, because a failure
      destroys more progress. HHT is fastest at 8.</p>`,
  },

  {
    id: "uniform-sum-exceeds-one",
    category: "expected value",
    difficulty: 3,
    time: 150,
    options: [
      `$2$`,
      `$2.5$`,
      `$e \\approx 2.718$`,
      `$3$`,
      `$\\pi \\approx 3.14$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `You draw numbers independently and uniformly from $[0,1]$, adding them up, and stop as soon
      as the running total exceeds 1. What is the expected number of draws?`,
    hint: `$P(\\text{more than } n \\text{ draws needed})$ is the probability that $n$ uniforms sum to
      at most 1 — a volume you can name.`,
    solution: `<p>You need more than $n$ draws exactly when $X_1 + \\dots + X_n \\le 1$. That region is a
      simplex of volume $\\frac{1}{n!}$.</p>
      <p>Using $E[N] = \\sum_{n \\ge 0} P(N > n)$:</p>
      $$E[N] = \\sum_{n=0}^{\\infty}\\frac{1}{n!} = e \\approx 2.718.$$
      <p>One of the few places $e$ appears with no exponential in sight. If a multiple-choice option is
      $2.718$, it is almost certainly the answer.</p>`,
  },

  {
    id: "boxes-exactly-one-ball",
    category: "expected value",
    difficulty: 2,
    time: 120,
    options: [
      `$1$`,
      `$1.64$`,
      `$2.048$`,
      `$2.5$`,
      `$5$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Five balls are thrown independently into five boxes, each ball landing in a uniformly random
      box. What is the expected number of boxes containing exactly one ball?`,
    hint: `Fix a box. The count of balls in it is binomial — you only need one term.`,
    solution: `<p>A fixed box holds exactly one ball with probability
      $\\binom{5}{1}\\left(\\frac{1}{5}\\right)\\left(\\frac{4}{5}\\right)^4 = \\left(\\frac{4}{5}\\right)^4$.</p>
      <p>Multiply by 5 boxes:</p>
      $$E = 5\\left(\\frac{4}{5}\\right)^4 = \\frac{5 \\cdot 256}{625} = \\frac{256}{125} = 2.048.$$
      <p>The factor of 5 from the boxes cancels against one factor from the binomial — spotting that keeps
      the arithmetic to $4^4 = 256$ over $5^3 = 125$.</p>`,
  },

  {
    id: "stick-triangle",
    category: "expected value",
    difficulty: 3,
    time: 150,
    options: [
      `$\\tfrac{1}{8}$`,
      `$\\tfrac{1}{6}$`,
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{1}{2}$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `A stick of length 1 is broken at two independent uniformly random points. What is the
      probability the three resulting pieces can form a triangle?`,
    hint: `The triangle fails exactly when one piece exceeds $\\frac{1}{2}$. Can two pieces both exceed a half?`,
    solution: `<p>A triangle exists iff no piece is longer than $\\frac{1}{2}$. At most one piece can exceed
      $\\frac{1}{2}$, so the three failure events are disjoint.</p>
      <p>Let the cut points be $X, Y$ uniform on $[0,1]$. The left piece exceeds $\\frac12$ with probability
      $P(\\min(X,Y) > \\tfrac12) = \\frac{1}{4}$; likewise the right piece; and the middle piece exceeds
      $\\frac12$ with probability $\\frac14$ as well (the two points fall on opposite sides of the midpoint
      and more than $\\frac12$ apart). Total failure $= \\frac{3}{4}$, so</p>
      $$P = 1 - \\frac{3}{4} = \\frac{1}{4}.$$
      <p>Disjointness is what turns this from an area integral into three symmetric quarters.</p>`,
  },

  {
    id: "meeting-in-an-hour",
    category: "expected value",
    difficulty: 2,
    time: 130,
    options: [
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{7}{16}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{9}{16}$`,
      `$\\tfrac{15}{16}$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `Two traders each arrive at a bar at an independent uniformly random time between 6pm and 7pm.
      Each waits exactly 15 minutes for the other and then leaves. What is the probability they meet?`,
    hint: `Draw the unit square of arrival times. The meeting region is a band around the diagonal — so
      compute its complement, which is two triangles.`,
    solution: `<p>With arrival times $X, Y$ uniform on $[0,1]$ (hours), they meet iff $|X - Y| \\le \\frac14$.
      The complement is two right triangles, each with legs $\\frac{3}{4}$, total area
      $2 \\cdot \\frac{1}{2}\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$.</p>
      $$P = 1 - \\frac{9}{16} = \\frac{7}{16} \\approx 0.44.$$
      <p>General form for a wait of $w$ in a window of 1: $P = 1 - (1-w)^2$.</p>`,
  },

  {
    id: "three-points-semicircle",
    category: "expected value",
    difficulty: 3,
    time: 150,
    options: [
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{5}{8}$`,
      `$\\tfrac{3}{4}$`,
      `$\\tfrac{7}{8}$`,
      `$1$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Three points are chosen independently and uniformly on the circumference of a circle. What is
      the probability that all three lie within some common semicircle?`,
    hint: `For each point, consider the event that the other two both lie in the semicircle starting at it
      and running clockwise. Can two such events happen at once?`,
    solution: `<p>For point $i$, let $A_i$ be the event that both other points lie in the clockwise semicircle
      beginning at $i$. If all three lie in a common semicircle, exactly one point is the "first" one
      clockwise, so exactly one $A_i$ occurs — the events are disjoint and cover the success case.</p>
      <p>Each has probability $\\left(\\frac{1}{2}\\right)^2 = \\frac14$, so</p>
      $$P = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}.$$
      <p>For $n$ points the same argument gives $n/2^{n-1}$.</p>`,
  },

  /* ============================ COMBINATORICS ============================= */

  {
    id: "digit-sum-nine",
    category: "combinatorics",
    difficulty: 2,
    time: 120,
    options: [
      `$120$`,
      `$165$`,
      `$220$`,
      `$286$`,
      `$715$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `How many four-digit numbers (1000 to 9999) have digits summing to exactly 9?`,
    hint: `Stars and bars — but the leading digit must be at least 1, and you should check whether the
      "no digit above 9" constraint can even bite.`,
    solution: `<p>Write the number as $a+b+c+d = 9$ with $a \\ge 1$ and all digits $\\le 9$. Substituting
      $a' = a - 1$ gives $a' + b + c + d = 8$ with all parts $\\ge 0$. Since the total is only 8, no digit
      can exceed 9 anyway, so the upper bound never binds.</p>
      $$N = \\binom{8+3}{3} = \\binom{11}{3} = 165.$$
      <p>Checking that the upper constraint is inactive is the step most people skip — with a target of, say,
      20 instead of 9, inclusion–exclusion would be needed.</p>`,
  },

  {
    id: "nonadjacent-subsets",
    category: "combinatorics",
    difficulty: 3,
    time: 150,
    options: [
      `$55$`,
      `$89$`,
      `$144$`,
      `$233$`,
      `$512$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `How many subsets of $\\{1, 2, \\dots, 10\\}$ contain no two consecutive integers? (Count the
      empty set.)`,
    hint: `Let $f(n)$ be the answer for $\\{1,\\dots,n\\}$ and condition on whether $n$ is in the subset.`,
    solution: `<p>If $n$ is excluded, the rest is any valid subset of $\\{1,\\dots,n-1\\}$: $f(n-1)$ ways.
      If $n$ is included, $n-1$ must be excluded: $f(n-2)$ ways. So $f(n) = f(n-1) + f(n-2)$, with
      $f(0)=1, f(1)=2$ — the Fibonacci numbers.</p>
      <p>$1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144$, so</p>
      $$f(10) = 144.$$
      <p>Equivalently $\\sum_k \\binom{11-k}{k}$. The same count answers "how many binary strings of length
      10 avoid 11".</p>`,
  },

  {
    id: "nondecreasing-five-digits",
    category: "combinatorics",
    difficulty: 2,
    time: 130,
    options: [
      `$0.00252$`,
      `$0.0084$`,
      `$0.02002$`,
      `$0.0417$`,
      `$0.12$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Five digits are chosen independently and uniformly from $0$–$9$ and written in a row. What is
      the probability they come out in non-decreasing order?`,
    hint: `A non-decreasing sequence is determined by how many of each digit you use — a multiset, not an
      ordering.`,
    solution: `<p>Each multiset of 5 digits from 10 options corresponds to exactly one non-decreasing
      arrangement, so the favourable count is</p>
      $$\\binom{10 + 5 - 1}{5} = \\binom{14}{5} = 2002,$$
      <p>out of $10^5$ total. So $P = \\frac{2002}{100000} \\approx 2\\%$.</p>
      <p>Note the contrast with <em>strictly</em> increasing, which would be $\\binom{10}{5} = 252$. Confusing
      the two is the standard error.</p>`,
  },

  {
    id: "triangles-perimeter-twelve",
    category: "combinatorics",
    difficulty: 2,
    time: 120,
    options: [
      `$2$`,
      `$3$`,
      `$4$`,
      `$6$`,
      `$12$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `How many triangles are there with integer side lengths and perimeter exactly 12? (Congruent
      triangles count once.)`,
    hint: `Order the sides $a \\le b \\le c$. The triangle inequality plus the perimeter forces $c$ into a
      very narrow range.`,
    solution: `<p>With $a \\le b \\le c$ and $a+b+c = 12$: we need $c < a + b = 12 - c$, so $c < 6$, i.e.
      $c \\le 5$. Also $c \\ge 4$ since $3c \\ge 12$.</p>
      <p>$c = 4$: $a+b = 8$ with $a \\le b \\le 4$ gives $(4,4)$.<br>
      $c = 5$: $a+b = 7$ with $b \\le 5$ gives $(2,5)$ and $(3,4)$.</p>
      $$\\text{Total} = 3: \\quad (4,4,4),\\ (2,5,5),\\ (3,4,5).$$
      <p>Bounding the largest side first turns an open search into three cases.</p>`,
  },

  {
    id: "distinct-dice-products",
    category: "combinatorics",
    difficulty: 2,
    time: 120,
    options: [
      `$15$`,
      `$18$`,
      `$21$`,
      `$24$`,
      `$36$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `Two fair six-sided dice are rolled and the two numbers multiplied. How many distinct values
      can the product take?`,
    hint: `Count all 21 unordered pairs, then find the collisions — there are fewer than you would guess.`,
    solution: `<p>There are $\\binom{6}{2} + 6 = 21$ unordered pairs. The collisions are:
      $1\\cdot4 = 2\\cdot2 = 4$; $1\\cdot6 = 2\\cdot3 = 6$; $2\\cdot6 = 3\\cdot4 = 12$.</p>
      <p>Three collisions, each merging two pairs into one value, so $21 - 3 = 18$ distinct products:</p>
      $$\\{1,2,3,4,5,6,8,9,10,12,15,16,18,20,24,25,30,36\\}.$$
      <p>Listing the products is slower and more error-prone than counting pairs and subtracting duplicates.</p>`,
  },

  {
    id: "squares-on-chessboard",
    category: "combinatorics",
    difficulty: 2,
    time: 110,
    options: [
      `$64$`,
      `$100$`,
      `$204$`,
      `$296$`,
      `$1296$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `How many squares of any size are there on a standard $8 \\times 8$ chessboard? (Squares must
      align with the grid.)`,
    hint: `A $k \\times k$ square is determined by the position of its top-left corner.`,
    solution: `<p>A $k \\times k$ square has $(9-k)$ choices horizontally and $(9-k)$ vertically, so there are
      $(9-k)^2$ of them.</p>
      $$N = \\sum_{k=1}^{8}(9-k)^2 = 1^2 + 2^2 + \\dots + 8^2 = \\frac{8 \\cdot 9 \\cdot 17}{6} = 204.$$
      <p>Worth having $\\sum k^2 = \\frac{n(n+1)(2n+1)}{6}$ automatic. (Rectangles, by contrast, are
      $\\binom{9}{2}^2 = 1296$.)</p>`,
  },

  {
    id: "balls-into-boxes-nonempty",
    category: "combinatorics",
    difficulty: 1,
    time: 90,
    options: [
      `$27$`,
      `$36$`,
      `$45$`,
      `$66$`,
      `$120$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `In how many ways can 10 identical balls be placed into 3 distinguishable boxes so that no box
      is empty?`,
    hint: `Put one ball in each box first, then distribute what is left freely.`,
    solution: `<p>Place one ball in each box, leaving 7 to distribute with no restriction. Stars and bars:</p>
      $$\\binom{7 + 2}{2} = \\binom{9}{2} = 36.$$
      <p>Equivalently, choose 2 of the 9 gaps between 10 lined-up balls.</p>`,
  },

  {
    id: "galileo-nine-vs-ten",
    category: "combinatorics",
    difficulty: 3,
    time: 150,
    options: [
      `Equal, both $\\tfrac{25}{216}$`,
      `$9$, by $\\tfrac{27}{216}$ to $\\tfrac{25}{216}$`,
      `$9$, by $\\tfrac{26}{216}$ to $\\tfrac{25}{216}$`,
      `$10$, by $\\tfrac{27}{216}$ to $\\tfrac{25}{216}$`,
      `$10$, by $\\tfrac{30}{216}$ to $\\tfrac{25}{216}$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `Three fair dice are rolled. Both 9 and 10 can be written as a sum of three values from 1–6 in
      exactly six different ways (as unordered collections). Yet one total is strictly more likely. Which,
      and what are the two probabilities?`,
    hint: `Unordered collections are not equally likely. A collection with a repeated value has fewer
      orderings than one with three distinct values.`,
    solution: `<p>Count ordered outcomes. For 9: $(1,2,6), (1,3,5), (1,4,4), (2,2,5), (2,3,4), (3,3,3)$ give
      $6+6+3+3+6+1 = 25$. For 10: $(1,3,6), (1,4,5), (2,2,6), (2,3,5), (2,4,4), (3,3,4)$ give
      $6+6+3+6+3+3 = 27$.</p>
      $$P(9) = \\frac{25}{216}, \\qquad P(10) = \\frac{27}{216} = \\frac{1}{8}.$$
      <p>This is Galileo's problem, and the error it exposes — treating unordered outcomes as equiprobable —
      is the single most common way to get a dice question wrong under time pressure.</p>`,
  },

  {
    id: "pizza-cuts",
    category: "combinatorics",
    difficulty: 2,
    time: 130,
    options: [
      `$12$`,
      `$16$`,
      `$22$`,
      `$32$`,
      `$64$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `What is the maximum number of pieces a circular pizza can be divided into using 6 straight
      cuts? (Pieces need not be equal and you may not move pieces between cuts.)`,
    hint: `Each new cut adds one piece for every existing cut it crosses, plus one.`,
    solution: `<p>The $n$-th cut can cross the previous $n-1$ cuts at $n-1$ distinct interior points, splitting
      the new cut into $n$ segments; each segment divides one existing region in two. So cut $n$ adds $n$
      pieces.</p>
      $$P(6) = 1 + (1+2+3+4+5+6) = 1 + 21 = 22.$$
      <p>General formula $1 + \\frac{n(n+1)}{2}$. The instinct to answer $2^n$ is wrong past $n=3$ because
      cuts in a plane cannot all be mutually independent.</p>`,
  },

  {
    id: "divisor-square",
    category: "combinatorics",
    difficulty: 3,
    time: 140,
    options: [
      `$\\tfrac{1}{10}$`,
      `$\\tfrac{1}{6}$`,
      `$\\tfrac{1}{5}$`,
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{1}{3}$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `A divisor of 720 is chosen uniformly at random. What is the probability it is a perfect square?`,
    hint: `Factorise, then note that a divisor is a square exactly when every exponent in it is even.`,
    solution: `<p>$720 = 2^4 \\cdot 3^2 \\cdot 5$. A divisor is $2^a 3^b 5^c$ with $a \\le 4, b \\le 2, c \\le 1$,
      so there are $5 \\cdot 3 \\cdot 2 = 30$ divisors.</p>
      <p>It is a square iff $a \\in \\{0,2,4\\}$, $b \\in \\{0,2\\}$, $c = 0$: that is $3 \\cdot 2 \\cdot 1 = 6$.</p>
      $$P = \\frac{6}{30} = \\frac{1}{5}.$$`,
  },

  {
    id: "div-three-or-five-not-fifteen",
    category: "combinatorics",
    difficulty: 2,
    time: 120,
    options: [
      `$0.267$`,
      `$0.401$`,
      `$0.467$`,
      `$0.533$`,
      `$0.600$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `An integer is chosen uniformly from 1 to 1000. What is the probability it is divisible by 3 or
      by 5, but <em>not</em> by 15?`,
    hint: `Inclusion–exclusion gives "3 or 5". Then remove the multiples of 15 — but notice they were already
      counted once, not twice.`,
    solution: `<p>Multiples of 3: 333. Of 5: 200. Of 15: 66.</p>
      <p>"3 or 5" $= 333 + 200 - 66 = 467$. Of those, 66 are multiples of 15, so</p>
      $$N = 467 - 66 = 401, \\qquad P = 0.401.$$
      <p>Equivalently $(333 - 66) + (200 - 66) = 267 + 134 = 401$: the exclusive-or count subtracts the
      overlap twice from the raw sum.</p>`,
  },

  {
    id: "binary-no-two-ones",
    category: "combinatorics",
    difficulty: 2,
    time: 120,
    options: [
      `$\\tfrac{55}{256}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{201}{256}$`,
      `$\\tfrac{7}{8}$`,
      `$\\tfrac{247}{256}$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `A random 8-bit string is generated with each bit independently 0 or 1 with probability
      $\\frac12$. What is the probability it contains at least one occurrence of two consecutive 1s?`,
    hint: `Count the complement with the same recursion as the non-adjacent subsets problem.`,
    solution: `<p>Strings of length $n$ with no "11" satisfy $f(n) = f(n-1) + f(n-2)$ (append 0 to any, or
      append 01 to any), with $f(1) = 2, f(2) = 3$: $2,3,5,8,13,21,34,55$. So $f(8) = 55$.</p>
      $$P = 1 - \\frac{55}{256} = \\frac{201}{256} \\approx 0.785.$$
      <p>Fibonacci showing up in a coin-flip question is a reliable signal that the underlying structure is
      "no two adjacent".</p>`,
  },

  /* ========================= CONDITIONAL PROBABILITY ====================== */

  {
    id: "boy-born-tuesday",
    category: "conditional",
    difficulty: 3,
    time: 200,
    options: [
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{13}{27}$`,
      `$\\tfrac{14}{27}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{7}{13}$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `A family has two children. You are told that at least one of them is a boy born on a Tuesday.
      Assuming boys and girls are equally likely and birth days are uniform and independent, what is the
      probability both children are boys?`,
    hint: `Enumerate the sample space as (sex, day) pairs for each child — 14 options each — and count
      carefully. The overlap is where the surprise lives.`,
    solution: `<p>Each child is one of $2 \\times 7 = 14$ equally likely types, so $196$ ordered pairs.</p>
      <p>Pairs with at least one boy-born-Tuesday: by inclusion–exclusion, $14 + 14 - 1 = 27$.</p>
      <p>Of these, pairs where both are boys: the other child is any of 14 boy-types... more carefully,
      $7 + 7 - 1 = 13$ (other child is a boy on any day, either ordering, minus the double-counted
      both-Tuesday-boys case).</p>
      $$P = \\frac{13}{27} \\approx 0.48.$$
      <p>With no day information the answer is $\\frac13$; with "the elder is a boy" it is $\\frac12$. The
      apparently irrelevant "Tuesday" moves the answer because it changes how much the two children's
      descriptions can overlap. Conditioning on <em>how</em> you learned something matters.</p>`,
  },

  {
    id: "first-six-all-even",
    category: "conditional",
    difficulty: 3,
    time: 180,
    options: [
      `$1$`,
      `$\\tfrac{3}{2}$`,
      `$2$`,
      `$3$`,
      `$6$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You roll a fair die repeatedly until you get a 6. You are then told that every roll in the
      sequence was an even number. What is the expected number of rolls?`,
    hint: `Do not assume the rolls become uniform on $\\{2,4,6\\}$ with the same stopping rule — the
      conditioning also reweights <em>how long</em> the sequence was.`,
    solution: `<p>Let $N$ be the stopping roll. $P(N = n, \\text{all even}) = \\left(\\frac{2}{6}\\right)^{n-1}
      \\cdot \\frac{1}{6} = \\left(\\frac13\\right)^{n-1}\\frac16$ (each earlier roll must be 2 or 4).</p>
      <p>Summing: $P(\\text{all even}) = \\frac{1/6}{1 - 1/3} = \\frac14$.</p>
      <p>And $\\sum n \\left(\\frac13\\right)^{n-1}\\frac16 = \\frac16 \\cdot \\frac{1}{(2/3)^2}
      = \\frac16 \\cdot \\frac94 = \\frac38$. So</p>
      $$E[N \\mid \\text{all even}] = \\frac{3/8}{1/4} = \\frac{3}{2}.$$
      <p>The tempting answer is 3 (treating it as a geometric with success $\\frac13$). That is wrong because
      long sequences are far less likely to be all even, so the conditioning pulls the answer down.</p>`,
  },

  {
    id: "monty-four-doors",
    category: "conditional",
    difficulty: 2,
    time: 140,
    options: [
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{3}{8}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{3}{4}$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `There are four doors, one hiding a prize. You pick a door. The host, who knows where the prize
      is, opens one of the other three doors to reveal no prize. You may now switch to either of the two
      remaining unopened doors. If you switch, what is your probability of winning?`,
    hint: `Your original door's probability is frozen by the rules of the game. The rest has to go somewhere,
      split between two doors.`,
    solution: `<p>Your initial door holds the prize with probability $\\frac14$, and the host's action cannot
      change that — he always opens a losing door regardless.</p>
      <p>So the remaining $\\frac34$ is shared equally between the two other unopened doors:</p>
      $$P(\\text{win by switching}) = \\frac{3}{8}.$$
      <p>Better than $\\frac14$, so switch — but not the $\\frac34$ that a careless "switching is always
      better" reflex suggests.</p>`,
  },

  {
    id: "same-cycle-one-two",
    category: "conditional",
    difficulty: 3,
    time: 170,
    options: [
      `$\\tfrac{1}{n}$`,
      `$\\tfrac{2}{n}$`,
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{1}{2}$`,
      `It depends on $n$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `A uniformly random permutation of $\\{1, 2, \\dots, n\\}$ is written in cycle form. What is the
      probability that 1 and 2 lie in the same cycle? (Your answer should be a number, valid for every
      $n \\ge 2$.)`,
    hint: `Trace the cycle containing 1 step by step. At each step there is one particular element that would
      close the cycle, and one that would capture 2.`,
    solution: `<p>Follow the cycle from 1. At any point, suppose $k$ elements remain unvisited, including 2.
      The next element is uniform among them. The cycle closes now with probability $\\frac{1}{k}$ (hitting
      1 again — treat 1 as one of the $k$ candidates), and hits 2 with probability $\\frac{1}{k}$.</p>
      <p>At every step the two events are equally likely, so by symmetry the cycle is equally likely to close
      before reaching 2 as to reach 2 first:</p>
      $$P = \\frac{1}{2}, \\quad \\text{independent of } n.$$
      <p>Verified by brute force for small $n$. Answers that turn out not to depend on $n$ almost always have
      a symmetry argument behind them — look for it rather than computing.</p>`,
  },

  {
    id: "plane-seat-ninety-nine",
    category: "conditional",
    difficulty: 3,
    time: 200,
    options: [
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{2}{3}$`,
      `$\\tfrac{3}{4}$`,
      `$\\tfrac{98}{99}$`,
      `$\\tfrac{99}{100}$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `100 passengers board a full 100-seat plane. The first passenger has lost their boarding pass
      and sits in a uniformly random seat. Every subsequent passenger takes their own seat if free, and
      otherwise takes a uniformly random free seat. What is the probability that the <em>99th</em> passenger
      gets their own seat?`,
    hint: `At every moment, the only "contested" seats are seat 1 and the seats of passengers still to board.
      When a displaced passenger chooses, ask which of the relevant seats they might take.`,
    solution: `<p>The key invariant: whenever someone chooses at random, the choice that matters is between
      seat 1 (which ends the chaos) and the seats of the remaining passengers. By symmetry these are equally
      likely at each such moment.</p>
      <p>When passenger 99 boards, the only seats that can still be free are seat 1, seat 99 and seat 100 —
      and among the relevant ones, seat 99 is unavailable only if it was taken earlier. The standard result is
      that passenger $k$ gets their own seat with probability $\\frac{n-k+1}{n-k+2}$.</p>
      <p>With $n = 100, k = 99$:</p>
      $$P = \\frac{2}{3}.$$
      <p>Confirmed by simulation. For $k = 100$ this gives $\\frac12$, the famous answer; for $k=2$ it gives
      $\\frac{99}{100}$. The whole family falls out of one symmetry.</p>`,
  },

  {
    id: "both-even-given-one-even",
    category: "conditional",
    difficulty: 1,
    time: 90,
    options: [
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{3}{8}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{2}{3}$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `Two fair dice are rolled. Given that at least one shows an even number, what is the probability
      that both are even?`,
    hint: `Count the complement of "at least one even" first — it is a clean square.`,
    solution: `<p>"No even" means both odd: $3 \\times 3 = 9$ outcomes. So "at least one even" has
      $36 - 9 = 27$ outcomes. "Both even" has $3 \\times 3 = 9$.</p>
      $$P = \\frac{9}{27} = \\frac{1}{3}.$$
      <p>Note this is not $\\frac12$: conditioning on "at least one" always favours the mixed cases, because
      there are two ways to be mixed.</p>`,
  },

  {
    id: "three-prisoners",
    category: "conditional",
    difficulty: 3,
    time: 180,
    options: [
      `$\\tfrac{1}{4}$`,
      `$\\tfrac{1}{3}$`,
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{2}{3}$`,
      `$\\tfrac{3}{4}$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `Three prisoners A, B and C are told that exactly one of them will be released, chosen
      uniformly at random. Prisoner A asks the guard to name one of B or C who will <em>not</em> be released.
      The guard, who knows the outcome and picks uniformly at random when both B and C qualify, says "B".
      What is now the probability that A is released?`,
    hint: `The guard was always going to be able to name someone. Ask what the guard's answer tells you that
      you did not already know.`,
    solution: `<p>A's chance is $\\frac13$ before the question, and the guard can always name a non-released
      prisoner among B and C, so the <em>fact</em> of an answer carries no information about A.</p>
      <p>Formally: $P(\\text{guard says B} \\mid A) = \\frac12$, $P(\\text{guard says B} \\mid B) = 0$,
      $P(\\text{guard says B} \\mid C) = 1$. So</p>
      $$P(A \\mid \\text{says B}) = \\frac{\\frac13 \\cdot \\frac12}{\\frac13\\cdot\\frac12 + 0 + \\frac13 \\cdot 1}
      = \\frac{1/6}{1/2} = \\frac{1}{3}.$$
      <p>A stays at $\\frac13$; C jumps to $\\frac23$. Identical structure to Monty Hall, which is why the
      answer feels wrong.</p>`,
  },

  {
    id: "red-card-call",
    category: "conditional",
    difficulty: 3,
    time: 200,
    options: [
      `$\\tfrac{1}{2}$`,
      `$\\tfrac{25}{51}$`,
      `$\\tfrac{26}{51}$`,
      `$\\tfrac{2}{3}$`,
      `Close to $1$ with optimal play`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `A standard 52-card deck (26 red, 26 black) is shuffled and dealt face up one card at a time.
      At any point before a card is dealt you may say "stop" — you then win if the <em>next</em> card is red.
      You must call stop at some point (if you reach the last card you are forced to take it). What is the
      probability of winning under the best possible strategy?`,
    hint: `Compare the strategy "stop immediately" with any other. Think about what the last card of the deck
      has to do with the first.`,
    solution: `<p>The answer is $\\frac{1}{2}$, and no strategy beats it.</p>
      <p>Argument: consider any strategy. Instead of taking the next card, imagine taking the <em>bottom</em>
      card of the deck at the moment you stop. Since the deck is shuffled uniformly, the bottom card is equally
      likely to be red as the next card, whatever information you have seen — the cards you have observed tell
      you nothing that distinguishes the next card from the bottom one. But the bottom card's colour is fixed
      from the start and is red with probability $\\frac{1}{2}$.</p>
      $$P = \\frac{1}{2}.$$
      <p>This is a martingale/optional-stopping argument in disguise: the proportion of red cards remaining is
      a martingale, so no stopping rule improves your expectation. Highly relevant to trading — it is exactly
      the statement that you cannot time a fair game.</p>`,
  },

  /* ============================ LOGIC & PUZZLES =========================== */

  {
    id: "hundred-bulbs",
    category: "logic",
    difficulty: 2,
    time: 140,
    options: [
      `$1$`,
      `$10$`,
      `$25$`,
      `$50$`,
      `$51$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `100 light bulbs numbered 1 to 100 start switched off. Person 1 toggles every bulb; person 2
      toggles every 2nd bulb; person 3 every 3rd; and so on through person 100. How many bulbs are on at
      the end?`,
    hint: `Bulb $n$ is toggled once per divisor of $n$. When is the number of divisors odd?`,
    solution: `<p>Bulb $n$ is toggled once for each divisor of $n$, and ends up on iff it has an odd number of
      divisors. Divisors pair up as $d \\leftrightarrow n/d$, so the count is odd exactly when some $d$ pairs
      with itself, i.e. $n$ is a perfect square.</p>
      $$\\text{Squares} \\le 100: 1, 4, 9, \\dots, 100 \\Rightarrow 10 \\text{ bulbs on}.$$`,
  },

  {
    id: "burning-ropes",
    category: "logic",
    difficulty: 2,
    time: 130,
    options: [
      `Light rope A at both ends and B at one end; when A is consumed (30 min) light B's other end`,
      `Light A at one end, then B at one end when A finishes, and cut B in half`,
      `Light both ropes at both ends at the same time`,
      `Light A at both ends, then relight it at both ends a second time`,
      `It cannot be done without a third rope`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `You have two ropes and a lighter. Each rope burns through in exactly 60 minutes, but burns at
      an uneven and unknown rate along its length. How do you measure exactly 45 minutes?`,
    hint: `Lighting a rope at both ends halves its remaining time regardless of how unevenly it burns.`,
    solution: `<p>Light rope A at both ends and rope B at one end simultaneously. Rope A is consumed in
      exactly 30 minutes (the two flames meet somewhere, having together traversed the whole rope).</p>
      <p>At that moment, rope B has 30 minutes of burn left. Light rope B's other end now: its remaining
      burn halves to 15 minutes.</p>
      $$30 + 15 = 45 \\text{ minutes}.$$
      <p>The insight is that "both ends" converts an unknown rate profile into an exact halving.</p>`,
  },

  {
    id: "twenty-five-horses",
    category: "logic",
    difficulty: 3,
    time: 240,
    options: [
      `$6$`,
      `$7$`,
      `$8$`,
      `$10$`,
      `$11$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You have 25 horses and a track that races exactly 5 at a time. You have no timer — each race
      gives only the finishing order of those 5. What is the minimum number of races needed to identify the
      fastest three horses?`,
    hint: `After 5 races and a race of the winners, most horses are eliminated by transitivity. Count how many
      can still possibly be in the top three.`,
    solution: `<p>Races 1–5: split into five groups of 5 and race each. Race 6: race the five group winners.
      Call that order $A > B > C > D > E$ (by group).</p>
      <p>The overall fastest is $A_1$. For the other two places, eliminate anything with three or more horses
      known to be faster: groups $D$ and $E$ are out entirely; $C$ keeps only $C_1$; $B$ keeps $B_1, B_2$;
      $A$ keeps $A_2, A_3$.</p>
      <p>That leaves exactly 5 candidates — $A_2, A_3, B_1, B_2, C_1$ — for 2nd and 3rd. Race 7 settles them.</p>
      $$\\textbf{7 races}.$$
      <p>The elegance is that the survivor count lands on exactly 5, the track capacity.</p>`,
  },

  {
    id: "two-eggs-hundred-floors",
    category: "logic",
    difficulty: 3,
    time: 240,
    options: [
      `$7$`,
      `$10$`,
      `$14$`,
      `$20$`,
      `$50$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `You have two identical eggs and a 100-storey building. An egg breaks if dropped from floor $N$
      or above, and survives below it; $N$ is unknown. A broken egg cannot be reused. What is the minimum
      number of drops that guarantees finding $N$ in the worst case?`,
    hint: `Once the first egg breaks, the second must be tested one floor at a time. So each drop of the first
      egg should shrink the remaining linear search by exactly the number of drops you have used up.`,
    solution: `<p>Suppose the strategy uses $k$ drops in the worst case. Drop the first egg from floor $k$:
      if it breaks you have $k-1$ drops to linearly search floors $1$ to $k-1$. If it survives, go up $k-1$
      floors, then $k-2$, and so on — each time the remaining linear budget has shrunk by one.</p>
      <p>The highest floor reachable is $k + (k-1) + \\dots + 1 = \\frac{k(k+1)}{2}$, which must be at
      least 100:</p>
      $$\\frac{k(k+1)}{2} \\ge 100 \\Rightarrow k = 14 \\quad (14 \\cdot 15/2 = 105).$$
      <p>So drop first from floor 14, then 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100. The balanced-worst-case
      idea generalises to $m$ eggs.</p>`,
  },

  {
    id: "thousand-bottles-ten-testers",
    category: "logic",
    difficulty: 3,
    time: 200,
    options: [
      `$8$`,
      `$10$`,
      `$32$`,
      `$100$`,
      `$500$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You have 1000 bottles of wine, exactly one of which is poisoned. The poison takes 24 hours to
      show any effect, and you have only 24 hours. What is the minimum number of test subjects needed to
      identify the poisoned bottle with certainty?`,
    hint: `Each subject ends up either ill or not — one bit. How many bottles can $k$ bits distinguish?`,
    solution: `<p>With $k$ subjects, the outcome is a $k$-bit pattern of who falls ill, giving $2^k$
      distinguishable results. You need $2^k \\ge 1000$, so $k = 10$.</p>
      <p>Construction: number the bottles $0$ to $999$ in binary. Subject $i$ drinks from every bottle whose
      $i$-th bit is 1. The pattern of illness reads off the bottle number directly.</p>
      $$\\textbf{10 subjects}.$$
      <p>The information-theoretic bound and the construction match, which is what makes the answer tight.</p>`,
  },

  {
    id: "nine-balls-two-weighings",
    category: "logic",
    difficulty: 2,
    time: 140,
    options: [
      `$2$`,
      `$3$`,
      `$4$`,
      `$5$`,
      `$8$`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `You have 9 visually identical balls; one is slightly heavier. Using a balance scale (which
      only reports left-heavier, right-heavier, or equal), what is the minimum number of weighings that
      guarantees finding the heavy ball?`,
    hint: `A balance has three outcomes, not two. What does that say about how much you can learn per weighing?`,
    solution: `<p>Each weighing has 3 outcomes, so $w$ weighings distinguish at most $3^w$ cases. With 9
      candidates, $3^2 = 9$ suffices, so 2 is the lower bound — and it is achievable.</p>
      <p>Split into three groups of 3. Weigh group 1 against group 2: if they balance the heavy ball is in
      group 3, otherwise it is in the heavier pan. Repeat within that group of 3.</p>
      $$\\textbf{2 weighings}.$$
      <p>The generalisation: with $3^w$ balls you need $w$ weighings. Reaching for binary search here is the
      error — the balance gives you base 3.</p>`,
  },

  {
    id: "ten-bags-one-weighing",
    category: "logic",
    difficulty: 3,
    time: 180,
    options: [
      `Take 1 coin from bag 1, 2 from bag 2, ..., 10 from bag 10; the excess over 550 g is the bag number`,
      `Take one coin from every bag and weigh them together`,
      `Take ten coins from every bag and weigh them together`,
      `Weigh five bags against the other five`,
      `It cannot be done in a single weighing`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `You have 10 bags of coins. Every coin weighs 10g except in one bag, where every coin weighs
      11g. You have a digital scale that gives an exact weight reading, but you may use it only <em>once</em>.
      How do you identify the heavy bag?`,
    hint: `You need the reading to encode <em>which</em> bag, so take a different number of coins from each.`,
    solution: `<p>Take 1 coin from bag 1, 2 from bag 2, ..., 10 from bag 10 — that is 55 coins. If all were
      10g they would weigh 550g.</p>
      <p>Each coin from the heavy bag adds 1g, so the excess over 550g equals the bag number:</p>
      $$\\text{bag} = (\\text{reading}) - 550.$$
      <p>Contrast with the balance-scale puzzle: a scale giving a real number can carry far more information
      per use than a three-way comparison, and the trick is designing the encoding.</p>`,
  },

  {
    id: "bridge-crossing",
    category: "logic",
    difficulty: 3,
    time: 200,
    options: [
      `$15$`,
      `$16$`,
      `$17$`,
      `$19$`,
      `$21$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Four people must cross a bridge at night. They have one torch, the bridge holds at most two
      people at a time, and anyone crossing must carry the torch. They walk at different speeds, needing
      1, 2, 5 and 10 minutes respectively; a pair moves at the slower person's pace. What is the minimum
      total time?`,
    hint: `The obvious strategy is to let the fastest person ferry everyone. Try instead to make the two
      slowest cross together.`,
    solution: `<p>Fastest-ferries gives $2 + 1 + 5 + 1 + 10 = 19$. Better: pair the two slow walkers so their
      times overlap.</p>
      <p>1 and 2 cross (2). 1 returns (1). 5 and 10 cross together (10). 2 returns (2). 1 and 2 cross (2).</p>
      $$2 + 1 + 10 + 2 + 2 = 17 \\text{ minutes}.$$
      <p>The principle: never let a slow walker's time be spent alongside a fast one. Wasting the 10 on a
      crossing that also "uses up" the 5 is the whole gain.</p>`,
  },

  {
    id: "three-children-ages",
    category: "logic",
    difficulty: 3,
    time: 220,
    options: [
      `$1, 4, 9$`,
      `$1, 6, 6$`,
      `$2, 2, 9$`,
      `$2, 3, 6$`,
      `$3, 3, 4$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `A census taker asks a woman the ages of her three children (all integers). She says the product
      is 36 and the sum equals the number on the house next door. He looks at the house, thinks, and says he
      needs more information. She replies "the eldest plays piano". He then knows the ages. What are they?`,
    hint: `The fact that the sum was insufficient tells you the sum must be ambiguous. Find the only sum
      shared by two different triples.`,
    solution: `<p>Triples with product 36 and their sums: $(1,1,36)=38$, $(1,2,18)=21$, $(1,3,12)=16$,
      $(1,4,9)=14$, $(1,6,6)=13$, $(2,2,9)=13$, $(2,3,6)=11$, $(3,3,4)=10$.</p>
      <p>Only the sum 13 is achieved twice, so the house number must be 13 — otherwise he would have known.
      "The eldest" implies a unique oldest child, which rules out $(1,6,6)$.</p>
      $$\\textbf{2, 2 and 9}.$$
      <p>The information is carried by the census taker's <em>failure</em> to answer — a pattern worth
      recognising, since it recurs in market contexts as inference from someone declining to trade.</p>`,
  },

  {
    id: "josephus-ten",
    category: "logic",
    difficulty: 3,
    time: 180,
    options: [
      `$1$`,
      `$3$`,
      `$5$`,
      `$7$`,
      `$9$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `Ten people stand in a circle numbered 1 to 10. Starting the count at person 1, every second
      person is eliminated (so 2 goes first, then 4, 6, 8, 10, then 3, ...) continuing around until one
      remains. Which position survives?`,
    hint: `After one full pass, the problem reduces to the same problem with half as many people — track
      where the count resumes.`,
    solution: `<p>After eliminating 2,4,6,8,10, the survivors are 1,3,5,7,9 and the count resumes at 1, with 3
      next to die. Then 7, then 1, then 9 — leaving 5.</p>
      <p>General rule: write $n = 2^m + \\ell$ with $0 \\le \\ell < 2^m$; the survivor is $2\\ell + 1$. Here
      $10 = 8 + 2$, so the survivor is $2(2)+1 = 5$.</p>
      $$\\textbf{Position 5}.$$
      <p>Quick check: powers of 2 always leave position 1 alive.</p>`,
  },

  {
    id: "clock-overlaps",
    category: "logic",
    difficulty: 2,
    time: 140,
    options: [
      `$10$`,
      `$11$`,
      `$12$`,
      `$22$`,
      `$24$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `In a 12-hour period, how many times do the hour and minute hands of an analogue clock overlap
      exactly?`,
    hint: `Work in relative angular speed. How many full laps does the minute hand gain on the hour hand?`,
    solution: `<p>The minute hand completes 12 laps in 12 hours; the hour hand completes 1. The minute hand
      therefore gains exactly 11 laps on the hour hand, and they overlap once per lap gained.</p>
      $$\\textbf{11 overlaps}$$
      <p>(counting 12:00 once). They occur every $\\frac{12}{11}$ hours $\\approx$ 65.45 minutes — which is why
      the "overlap at 1:05, 2:10, ..." guess drifts and why there is no overlap in the 11 o'clock hour.</p>`,
  },

  {
    id: "hats-in-a-line-parity",
    category: "logic",
    difficulty: 3,
    time: 220,
    options: [
      `$50$`,
      `$75$`,
      `$99$`,
      `$99.5$`,
      `$100$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `100 prisoners stand in a line, each wearing a red or blue hat. Each can see all the hats in
      front of them but not their own or those behind. Starting from the back, each must say "red" or "blue";
      they are freed if correct. They may agree a strategy in advance but cannot communicate afterwards.
      How many can be guaranteed to survive?`,
    hint: `The person at the back can see 99 hats and will be sacrificed. What single bit should they
      broadcast to make everyone else's hat deducible?`,
    solution: `<p>Strategy: the rearmost prisoner counts the red hats they can see and says "red" if that
      count is odd, "blue" if even. They have a $\\frac12$ chance personally.</p>
      <p>Prisoner 99 now knows the parity of reds among prisoners 1–99, and can see prisoners 1–98, so deduces
      their own hat exactly. Prisoner 98 hears 99's answer, updates the parity, and deduces theirs. And so on
      down the line.</p>
      $$\\textbf{99 guaranteed}, \\text{ plus the last with probability } \\tfrac12.$$
      <p>One bit of parity is enough to carry 99 bits of information because everyone shares the visible
      context. Expected survivors: 99.5.</p>`,
  },

  {
    id: "twelve-coins-bound",
    category: "logic",
    difficulty: 3,
    time: 180,
    options: [
      `$2$`,
      `$3$`,
      `$4$`,
      `$5$`,
      `$6$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You have 12 coins, exactly one of which is counterfeit — it may be either heavier or lighter,
      and you do not know which. Using a balance scale, what is the minimum number of weighings that could
      possibly suffice to identify the fake <em>and</em> say whether it is heavy or light? Justify the bound
      before attempting a construction.`,
    hint: `Count the number of distinct answers you must be able to produce, and compare against the number
      of distinguishable weighing outcomes.`,
    solution: `<p>There are $12 \\times 2 = 24$ possible answers (which coin, and heavy or light). Each
      weighing has 3 outcomes, so $w$ weighings distinguish at most $3^w$ cases.</p>
      <p>$3^2 = 9 < 24 \\le 27 = 3^3$, so at least 3 weighings are needed — and 3 is achievable with a careful
      design (weigh 4 against 4, then branch).</p>
      $$\\textbf{3 weighings}.$$
      <p>Note how tight this is: 24 of the 27 outcomes are used. With 13 coins (26 cases) it still fits, but
      you lose the ability to also determine heavy-vs-light for the last coin.</p>`,
  },

  /* ============================= NUMBER THEORY ============================ */

  {
    id: "last-digit-power",
    category: "number theory",
    difficulty: 1,
    time: 80,
    options: [
      `$1$`,
      `$3$`,
      `$5$`,
      `$7$`,
      `$9$`,
    ],
    answer: 4,
    source: "Maven OA",
    question: `What is the last digit of $7^{2026}$?`,
    hint: `Powers of 7 cycle in their last digit with a short period.`,
    solution: `<p>Last digits of $7^n$: $7, 9, 3, 1, 7, 9, 3, 1, \\dots$ — period 4.</p>
      <p>$2026 = 4 \\cdot 506 + 2$, so it matches $7^2$:</p>
      $$\\text{last digit} = 9.$$
      <p>Every digit's power cycle divides 4, so reducing the exponent mod 4 is always the move.</p>`,
  },

  {
    id: "two-power-mod-seven",
    category: "number theory",
    difficulty: 2,
    time: 90,
    options: [
      `$1$`,
      `$2$`,
      `$3$`,
      `$4$`,
      `$6$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `What is the remainder when $2^{2026}$ is divided by 7?`,
    hint: `Find the smallest power of 2 that is 1 mod 7.`,
    solution: `<p>$2^1 = 2, 2^2 = 4, 2^3 = 8 \\equiv 1 \\pmod 7$ — period 3.</p>
      <p>$2026 = 3 \\cdot 675 + 1$, so $2^{2026} \\equiv 2^1$:</p>
      $$\\text{remainder} = 2.$$`,
  },

  {
    id: "last-two-digits-eleven",
    category: "number theory",
    difficulty: 3,
    time: 140,
    options: [
      `$01$`,
      `$11$`,
      `$21$`,
      `$61$`,
      `$81$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `What are the last two digits of $11^{2026}$?`,
    hint: `Expand $(10+1)^n$ and notice how few terms survive mod 100.`,
    solution: `<p>By the binomial theorem, $(1+10)^n = 1 + 10n + \\binom{n}{2}100 + \\dots$, and every term
      from the third onward is divisible by 100. So</p>
      $$11^n \\equiv 1 + 10n \\pmod{100}.$$
      <p>With $n = 2026$: $10n = 20260 \\equiv 60 \\pmod{100}$, giving $61$.</p>
      $$\\textbf{61}.$$
      <p>The same trick handles $101^n \\pmod{10000}$, $9^n = (10-1)^n$, and similar.</p>`,
  },

  {
    id: "trailing-zeros-factorial",
    category: "number theory",
    difficulty: 2,
    time: 110,
    options: [
      `$16$`,
      `$20$`,
      `$21$`,
      `$24$`,
      `$25$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `How many zeros does $100!$ end in?`,
    hint: `Zeros come from factors of 10 = 2 × 5, and fives are scarcer than twos. Do not forget 25, 50, 75
      and 100 contribute twice.`,
    solution: `<p>Count factors of 5 via Legendre's formula:</p>
      $$\\left\\lfloor \\frac{100}{5} \\right\\rfloor + \\left\\lfloor \\frac{100}{25} \\right\\rfloor
      = 20 + 4 = 24.$$
      <p>Twos are far more plentiful, so 24 is the binding count.</p>
      $$\\textbf{24 zeros}.$$
      <p>The classic error is answering 20 by forgetting the squares of 5.</p>`,
  },

  {
    id: "power-of-three-in-factorial",
    category: "number theory",
    difficulty: 2,
    time: 120,
    options: [
      `$33$`,
      `$44$`,
      `$48$`,
      `$49$`,
      `$50$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `What is the largest power of 3 that divides $100!$?`,
    hint: `Same method as counting trailing zeros, but the tower goes further because 3 is small.`,
    solution: `<p>$$\\left\\lfloor \\frac{100}{3}\\right\\rfloor + \\left\\lfloor \\frac{100}{9}\\right\\rfloor
      + \\left\\lfloor \\frac{100}{27}\\right\\rfloor + \\left\\lfloor \\frac{100}{81}\\right\\rfloor
      = 33 + 11 + 3 + 1 = 48.$$</p>
      <p>So $3^{48} \\parallel 100!$.</p>`,
  },

  {
    id: "gcd-mersenne",
    category: "number theory",
    difficulty: 3,
    time: 160,
    options: [
      `$1$`,
      `$7$`,
      `$15$`,
      `$63$`,
      `$4095$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `What is $\\gcd(2^{30} - 1,\\ 2^{18} - 1)$?`,
    hint: `There is a clean identity: the gcd of two numbers of this shape is another number of the same shape.`,
    solution: `<p>The identity is</p>
      $$\\gcd(2^a - 1, 2^b - 1) = 2^{\\gcd(a,b)} - 1.$$
      <p>Here $\\gcd(30, 18) = 6$, so the answer is $2^6 - 1 = 63$.</p>
      <p>It follows from the Euclidean algorithm applied in the exponent: $2^a - 1 \\equiv 2^{a \\bmod b} - 1
      \\pmod{2^b - 1}$. Without the identity you would be factoring ten-digit numbers in your head.</p>`,
  },

  {
    id: "sum-factorials-last-digit",
    category: "number theory",
    difficulty: 2,
    time: 110,
    options: [
      `$0$`,
      `$1$`,
      `$3$`,
      `$5$`,
      `$7$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `What is the last digit of $1! + 2! + 3! + \\dots + 100!$?`,
    hint: `Almost every term contributes nothing. Find where the contributions stop.`,
    solution: `<p>From $5!$ onwards every factorial contains both 2 and 5, hence ends in 0. So only the first
      four terms matter:</p>
      $$1 + 2 + 6 + 24 = 33 \\Rightarrow \\text{last digit } 3.$$
      <p>The "100" in the question is a red herring — recognising that instantly is the point.</p>`,
  },

  {
    id: "frobenius-five-seven",
    category: "number theory",
    difficulty: 3,
    time: 170,
    options: [
      `$11$`,
      `$18$`,
      `$22$`,
      `$23$`,
      `$35$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `A shop sells items only in packs of 5 and packs of 7. What is the largest number of items that
      <em>cannot</em> be bought exactly?`,
    hint: `Once you can make 5 consecutive values, you can make everything above by adding 5s. Find the first
      such run.`,
    solution: `<p>Achievable values: $5, 7, 10, 12, 14, 15, 17, 19, 20, 21, 22, 24, 25, 26, 27, 28, \\dots$</p>
      <p>From 24 onward there is a run of five consecutive achievable values (24, 25, 26, 27, 28), so
      everything $\\ge 24$ works. Checking 23: it would need $5a + 7b = 23$, but $b = 0,1,2,3$ give
      $23, 16, 9, 2$ — none divisible by 5.</p>
      $$\\textbf{23}.$$
      <p>The Chicken McNugget formula for coprime $m, n$ is $mn - m - n = 35 - 5 - 7 = 23$. Worth knowing
      cold, along with the count of unreachable values, $\\frac{(m-1)(n-1)}{2} = 12$.</p>`,
  },

  /* ======================= MARKET MAKING & TRADING EV ===================== */

  {
    id: "adverse-selection-quote",
    category: "market making",
    difficulty: 3,
    time: 200,
    options: [
      `$+\\tfrac{2}{5}$`,
      `$0$`,
      `$-\\tfrac{1}{5}$`,
      `$-\\tfrac{2}{5}$`,
      `$-1$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `A security's true value $V$ is uniform on $\\{8, 9, 10, 11, 12\\}$. You must quote a two-way
      market before learning $V$. You quote 9 bid / 11 ask, in size 1. Your counterparty knows $V$ exactly and
      trades with you only when it profits them (buying at your ask when $V > 11$, selling at your bid when
      $V < 9$). What is your expected profit?`,
    hint: `You only trade in the cases where you lose. Enumerate the five values and ask what happens in each.`,
    solution: `<p>Go through the values:</p>
      <ul>
        <li>$V = 8$: they sell to you at 9. You lose 1.</li>
        <li>$V = 9, 10, 11$: no profitable trade for them, so no trade. You make 0.</li>
        <li>$V = 12$: they buy from you at 11. You lose 1.</li>
      </ul>
      $$E[\\text{profit}] = \\frac15(-1) + \\frac35(0) + \\frac15(-1) = -\\frac{2}{5}.$$
      <p>The lesson generalises: against a perfectly informed counterparty, <em>every</em> finite quote loses
      money, because you only ever trade when you are wrong. Real market making is profitable only because
      most flow is uninformed — which is why adverse selection, not fair value, is the central problem.</p>`,
  },

  {
    id: "overround-arbitrage",
    category: "market making",
    difficulty: 2,
    time: 150,
    options: [
      `Consistent; no arbitrage available`,
      `Consistent; the book carries a $4.5\\%$ overround`,
      `Inconsistent; lock in about $4.8\\%$`,
      `Inconsistent; lock in about $4.5\\%$`,
      `Inconsistent; lock in about $9.5\\%$`,
    ],
    answer: 2,
    source: "Maven OA",
    question: `A two-outcome event is quoted at decimal odds of 2.0 on outcome A and 2.2 on outcome B (decimal
      odds $d$ means a £1 stake returns £$d$ in total if it wins). Are these quotes internally consistent?
      If not, what riskless return can you lock in?`,
    hint: `Convert each price into an implied probability and add them up. A consistent book sums to at
      least 1.`,
    solution: `<p>Implied probabilities are $\\frac{1}{d}$:</p>
      $$\\frac{1}{2.0} + \\frac{1}{2.2} = 0.5 + 0.4545 = 0.9545 < 1.$$
      <p>The book sums to less than 1, so the quotes are inconsistent — no probability distribution prices
      both. Stake in proportion to implied probabilities: bet 0.5 on A and 0.4545 on B for a total outlay of
      0.9545, and receive exactly 1 whichever wins.</p>
      $$\\text{Riskless return} = \\frac{1}{0.9545} - 1 \\approx 4.8\\%.$$
      <p>A sum above 1 is the normal case (the overround, the bookmaker's edge); below 1 is arbitrage. This is
      the two-outcome case of the consistency check that a full state-price LP performs across many markets
      at once.</p>`,
  },

  {
    id: "dice-market-make",
    category: "market making",
    difficulty: 2,
    time: 140,
    options: [
      `Buy; fair value $\\tfrac{10}{3} \\approx 3.33$`,
      `Buy; fair value $3.50$`,
      `Sell; fair value $3.00$`,
      `Sell; fair value $4.00$`,
      `Pass; fair value is exactly $3.20$`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `A contract pays out, in pounds, the value shown on a single roll of a fair die — except that
      if a 1 is rolled, the contract pays nothing instead. Someone offers to sell you this contract for
      £3.20. Should you buy, sell, or pass?`,
    hint: `Compute the fair value first, and only then compare. Be careful to replace the 1 with 0, not to
      drop it from the sample space.`,
    solution: `<p>Payoffs are $0, 2, 3, 4, 5, 6$, each with probability $\\frac16$:</p>
      $$E = \\frac{0 + 2 + 3 + 4 + 5 + 6}{6} = \\frac{20}{6} = 3.33.$$
      <p>Fair value £3.33 exceeds the £3.20 offer, so <strong>buy</strong>, with an edge of about 13p.</p>
      <p>The standard error is computing $\\frac{2+3+4+5+6}{5} = 4$ — dropping the 1 outcome entirely instead
      of assigning it a zero payoff. Watch for this whenever a question voids an outcome rather than
      excluding it.</p>`,
  },

  {
    id: "kelly-even-money",
    category: "market making",
    difficulty: 3,
    time: 170,
    options: [
      `$10\\%$`,
      `$20\\%$`,
      `$36\\%$`,
      `$60\\%$`,
      `$100\\%$`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You can repeatedly bet on a coin that comes up heads with probability 0.6, at even money, and
      you may stake any fraction of your bankroll. What fraction maximises the long-run growth rate of your
      wealth?`,
    hint: `Maximise the expected <em>logarithm</em> of wealth, not expected wealth — and ask yourself why.`,
    solution: `<p>Maximising expected wealth would say "bet everything", which ruins you with probability 1
      over time. The growth-optimal criterion maximises $E[\\log(\\text{wealth})]$:</p>
      $$g(f) = 0.6\\log(1+f) + 0.4\\log(1-f).$$
      <p>Setting $g'(f) = 0$: $\\frac{0.6}{1+f} = \\frac{0.4}{1-f}$, giving $0.6 - 0.6f = 0.4 + 0.4f$, so
      $f = 0.2$.</p>
      $$\\textbf{20\\% of bankroll}.$$
      <p>The general Kelly fraction for even money is $f = 2p - 1$, the edge itself. The deeper point is that
      geometric and arithmetic means diverge under compounding, so sizing is a separate problem from finding
      an edge.</p>`,
  },

  {
    id: "negative-marking-threshold",
    category: "market making",
    difficulty: 2,
    time: 150,
    options: [
      `$0$`,
      `$1$`,
      `$2$`,
      `$3$`,
      `$4$`,
    ],
    answer: 3,
    source: "Maven OA",
    question: `A test has five answer options per question. A correct answer scores $+1$, a wrong answer
      $-1$, and a skipped question scores $0$. How many options must you be able to eliminate with certainty
      before guessing becomes worthwhile?`,
    hint: `Compute the expected value of a uniform guess among the remaining options, and find where it
      crosses zero.`,
    solution: `<p>If you can eliminate $k$ options, you guess uniformly among $5-k$, so</p>
      $$E = \\frac{1}{5-k}(+1) + \\frac{4-k}{5-k}(-1) = \\frac{1 - (4-k)}{5-k} = \\frac{k-3}{5-k}.$$
      <p>Evaluating: $k=0 \\Rightarrow -0.6$; $k=1 \\Rightarrow -0.5$; $k=2 \\Rightarrow -\\frac13$;
      $k=3 \\Rightarrow 0$; $k=4 \\Rightarrow +1$.</p>
      <p>So guessing breaks even at <strong>3 eliminated</strong> (a coin flip between two survivors) and is
      strictly profitable only at 4 — which is to say, only when you actually know the answer.</p>
      <p>Practical reading: a blind guess costs 0.6 marks in expectation. Narrowing to two options is free but
      gains nothing, so the real decision is whether to spend time, not whether to gamble. On an 18-question
      paper, three blind guesses cost nearly two marks.</p>`,
  },

  {
    id: "random-walk-with-cost",
    category: "market making",
    difficulty: 3,
    time: 220,
    options: [
      `Stop immediately; the game is worth $0$`,
      `Stop the first time the position is positive`,
      `Stop once the position exceeds $c$`,
      `Never stop; the walk is recurrent so it returns arbitrarily high`,
      `Stop at position $1/c$`,
    ],
    answer: 0,
    source: "Maven OA",
    question: `A symmetric random walk starts at 0 and moves $\\pm 1$ with equal probability each step. You
      may stop at any time and collect your current position, minus a cost of $c > 0$ per step taken. What is
      the optimal stopping strategy, and what does that tell you about the value of the game?`,
    hint: `Ask what a single extra step is worth on its own, ignoring everything else.`,
    solution: `<p>The walk itself is a martingale: any additional step changes your expected position by
      exactly 0. But it costs $c > 0$.</p>
      <p>So every step has strictly negative expected value, $-c$, regardless of where you currently are or
      what has happened so far. The optimal strategy is therefore to <strong>stop immediately</strong>, at
      time 0, collecting 0.</p>
      $$\\text{Value of the game} = 0.$$
      <p>The trap is thinking that being down tempts you to keep going ("wait to recover") — that is the
      martingale fallacy. With no drift, the past is irrelevant and the only thing that accumulates is cost.
      This is the cleanest statement of why trading a zero-edge strategy with transaction costs loses money
      with certainty.</p>`,
  },

  {
    id: "informed-flow-widening",
    category: "market making",
    difficulty: 3,
    time: 200,
    options: [
      `Any $u > 0$ works, given a wide enough spread`,
      `No spread rescues it: widening also drives away the uninformed flow you profit from`,
      `Viability requires $u > \\tfrac{1}{2}$ regardless of $L$`,
      `Viability depends only on $L$, not on $u$`,
      `Widening the spread always raises expected profit per trade`,
    ],
    answer: 1,
    source: "Maven OA",
    question: `You quote a two-way market in size 1. A fraction $u$ of your counterparties are uninformed
      (equally likely to buy or sell regardless of value), and the remaining $1-u$ are perfectly informed. On
      an informed trade you lose an average of $L$; on an uninformed trade you earn half your spread, $s/2$.
      Below what value of $u$ is there no spread that makes the business viable?`,
    hint: `Write expected profit per trade as a function of $s$, remembering that widening the spread changes
      both terms — but does it change them in the same direction?`,
    solution: `<p>Expected profit per trade is</p>
      $$E = u \\cdot \\frac{s}{2} - (1-u) L.$$
      <p>Widening $s$ increases the first term without bound, so at first glance any $u > 0$ is viable. The
      catch is that $L$ is not independent of $s$: an informed trader only lifts your offer when the true
      value is beyond it, so a wider spread also means informed trades happen less often but are no less
      adverse — and, critically, uninformed volume falls as $s$ widens.</p>
      <p>Modelling uninformed arrivals as proportional to $1/s$, the first term becomes constant in $s$ and
      the trade-off bites: viability then requires $u$ above a threshold determined by the ratio of
      uninformed volume sensitivity to $L$.</p>
      <p>The examinable point is qualitative and worth being able to state in an interview: <strong>you cannot
      widen your way out of adverse selection</strong>, because the spread that protects you from informed
      flow also drives away the uninformed flow you profit from. Real defences are inventory limits, quote
      fading on signals, and size asymmetry.</p>`,
  },

]);