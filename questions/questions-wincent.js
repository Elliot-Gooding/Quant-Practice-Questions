/* ============================================================================
   WINCENT-STYLE INTERVIEW PROBLEMS
   ----------------------------------------------------------------------------
   Written for the Wincent 45-minute quant interview: spoken, free-response
   problems in three levels of difficulty. They are practice problems in the
   style of that interview, not a record of what Wincent asks. Two are modelled
   on problems candidates have reported: "hat-of-banknotes" and
   "dice-past-a-hundred".

   Each problem is a pair. The first question of the pair carries

     interview: { level, followUp, twist }

   and is what the mock interview on the Test tab draws for the block of that
   level. `followUp` is the id of the second question, asked once the first is
   solved; `twist` is how the interviewer would put it in the room. The second
   question restates the set-up in full, so in Practice both stand alone.

   Two further fields, used by the mock and ignored elsewhere:

     hints        clues in the order an interviewer would give them. `hint`
                  repeats the first, which is all Practice shows.
     shortAnswer  the bare answer, for marking yourself before the full solution.

   The file is in three sets of eighteen problems and a fourth of six, with the
   levels evenly represented, so the mock has twenty problems to draw on for
   every block. A few
   are argued, not calculated — logic puzzles such as the light switches, the
   sand timers and the tigers, and proofs such as the coin game and the safe
   with ten locks — and for those the argument is the answer.

   No options, so none of these can be drawn into a multiple-choice paper. All
   carry the tag "interview", which is how to pick them out in Practice.

   Every number here was computed by machine before this file was written:
   exact fractions, exhaustive enumeration or dynamic programming, with a
   simulation as a second check where the answer is not a fraction.
   ========================================================================== */

QBank.add([

  /* ---- Level 1 -------------------------------------------------------------- */

  {
    id: "one-look-in-three-boxes",
    category: "expected value",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three closed boxes hold £0, £50 and £100, in a random order, and you will be
      allowed to keep one box. Before you choose you may pay to open one box and look inside; you
      can then take that box or either of the others. What is the most you should pay for the look?`,
    hint: `Start with what the game is worth if you do not look at all.`,
    hints: [
      `Start with what the game is worth if you do not look at all.`,
      `Split on what you see — £100, £0 or £50. In each case, which box do you take, and what is it worth on average?`,
      `After seeing £0 the other two boxes average £75. After seeing £50 they average £50, the same as keeping it.`,
    ],
    shortAnswer: `£25. With one look the game is worth £75; without, £50.`,
    solution: `<p>With no look you take a box blind: £50 on average.</p>
      <p>With a look there are three equally likely sights. See £100: take it. See £0: take either
      other box, worth $\\frac{50 + 100}{2} = 75$. See £50: keeping it and switching are both worth £50.</p>
      <p>So the game is worth $\\frac{100 + 75 + 50}{3} = 75$, and the look is worth $75 - 50 =$ <b>£25</b>.
      Notice the look only helps when it shows you an extreme.</p>`,
    interview: {
      level: 1,
      followUp: "thirty-pounds-a-look",
      twist: `Now every look costs £30, and after the first you may buy a second. One look on its own
      is only worth £25 — so do you buy the first one?`,
    },
  },
  {
    id: "thirty-pounds-a-look",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three closed boxes hold £0, £50 and £100 in a random order, and you will keep one.
      Before choosing you may pay £30 to open a box and look inside, and after that you may pay
      another £30 to open a second. What should you do, and how much is the game worth to you?`,
    hint: `A single look is worth only £25, less than its price. What else does the first look buy you now?`,
    hints: [
      `A single look is worth only £25, less than its price. What else does the first look buy you now?`,
      `Work out what a second look would add after seeing £0, and after seeing £50.`,
      `After £0 a second look adds £25, so you skip it. After £50 it adds £50 — it tells you exactly where the £100 is — so you buy it.`,
    ],
    shortAnswer: `Buy the first look, and buy a second only if the first shows £50. Worth £51.67 ($\\frac{155}{3}$), against £50 for never looking.`,
    solution: `<p>Work backwards from the first sight.</p>
      <p><b>£100:</b> take it. <b>£0:</b> the other two average £75; a second look would find the
      £100 for certain, a gain of £25 for a £30 fee, so do not buy it. <b>£50:</b> the other two
      are £0 and £100; a second look finds the £100 for certain, a gain of £50 for £30, so buy it
      and end with $100 - 30 = 70$.</p>
      <p>Before the first fee the three cases are worth 100, 75 and 70, so the game is worth
      $\\frac{100 + 75 + 70}{3} - 30 = \\frac{155}{3} \\approx$ <b>£51.67</b>. That beats the £50 for
      not looking, so the first look is worth buying even though, as a one-off, it costs more than
      it returns: part of what you are paying for is the option on the second.</p>`,
  },

  {
    id: "red-pairs-black-pairs",
    category: "logic",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A shuffled standard deck is dealt into 26 pairs. Every pair of two red cards goes
      to me, every pair of two black cards goes to you, and mixed pairs are thrown away. If you
      finish with more pairs than I do, I pay you £10; otherwise you pay me £1. How much is this
      game worth to you?`,
    hint: `Try a tiny deck first: two red cards and two black.`,
    hints: [
      `Try a tiny deck first: two red cards and two black.`,
      `Every red card is either in a red pair or in a mixed pair. Count the red cards that way, then the black cards.`,
      `The mixed pairs use up exactly as many red cards as black ones.`,
    ],
    shortAnswer: `Minus £1. We always finish with the same number of pairs, so you pay £1 every time.`,
    solution: `<p>Say there are $m$ mixed pairs, $r$ red pairs and $b$ black pairs. Counting red
      cards, $26 = 2r + m$; counting black cards, $26 = 2b + m$. So $r = b$ on every deal.</p>
      <p>You can never finish ahead, so you lose £1 with certainty: the game is worth <b>−£1</b>.
      The £10 is a distraction.</p>`,
    interview: {
      level: 1,
      followUp: "twenty-red-fourteen-black",
      twist: `Now the pack has 20 red and 14 black cards, dealt into 17 pairs. What can you say about
      how many more pairs I get than you?`,
    },
  },
  {
    id: "twenty-red-fourteen-black",
    category: "logic",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A pack of 34 cards, 20 red and 14 black, is shuffled and dealt into 17 pairs. Let
      $R$ be the number of pairs made of two red cards and $B$ the number made of two black cards.
      What is the expected value of $R - B$, and what is its variance?`,
    hint: `Write the number of red cards in terms of $R$ and the number of mixed pairs $M$.`,
    hints: [
      `Write the number of red cards in terms of $R$ and the number of mixed pairs $M$.`,
      `$20 = 2R + M$ and $14 = 2B + M$. Subtract.`,
    ],
    shortAnswer: `Always exactly 3 more red pairs than black pairs: $R - B = 3$ on every deal, so its expected value is 3 and its variance is 0.`,
    solution: `<p>Each red card is in a red pair or a mixed pair, so $20 = 2R + M$; likewise
      $14 = 2B + M$. Subtracting, $2(R - B) = 6$.</p>
      <p>So $R - B = 3$ however the cards fall: expected value <b>3</b>, variance <b>0</b>. Nothing
      about it is random.</p>`,
  },

  {
    id: "name-your-number",
    category: "expected value",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I am about to roll a fair die. First you name a whole number $g$. If the roll is
      at least $g$ you win £$g$; if it is lower you win nothing. Which number should you name, and
      what is the game worth?`,
    hint: `For a given $g$, what is your chance of winning?`,
    hints: [
      `For a given $g$, what is your chance of winning?`,
      `Your expected winnings are $g \\times \\frac{7 - g}{6}$. Try each $g$.`,
    ],
    shortAnswer: `Name 3 or 4 — either is worth £2.`,
    solution: `<p>The roll is at least $g$ with probability $\\frac{7 - g}{6}$, so naming $g$ is
      worth $\\frac{g(7 - g)}{6}$.</p>
      <p>For $g = 1, \\dots, 6$ that is $1,\\ \\frac{5}{3},\\ 2,\\ 2,\\ \\frac{5}{3},\\ 1$. The best is
      <b>3 or 4, worth £2</b>: a bigger prize and a better chance pull in opposite directions, and
      the product peaks in the middle.</p>`,
    interview: {
      level: 1,
      followUp: "name-your-total",
      twist: `Now I roll two dice, and you win £$g$ if their total is at least $g$. What do you name?`,
    },
  },
  {
    id: "name-your-total",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I am about to roll two fair dice. First you name a whole number $g$; if the total
      is at least $g$ you win £$g$, otherwise nothing. Which number should you name, and what is
      the game worth?`,
    hint: `You need $P(\\text{total} \\ge g)$. Count down from the top: one way to make 12, two ways to make 11, and so on.`,
    hints: [
      `You need $P(\\text{total} \\ge g)$. Count down from the top: one way to make 12, two ways to make 11, and so on.`,
      `Compare $g = 5, 6, 7$, where the chances are $\\frac{30}{36}$, $\\frac{26}{36}$ and $\\frac{21}{36}$.`,
    ],
    shortAnswer: `Name 6: worth £4.33 ($\\frac{13}{3}$). Naming 5 gives £4.17 and naming 7 gives £4.08.`,
    solution: `<p>Naming $g$ is worth $g \\times P(\\text{total} \\ge g)$. The candidates are near
      the middle:</p>
      <p>$g = 5$: $5 \\times \\frac{30}{36} = \\frac{25}{6} \\approx 4.17$<br>
      $g = 6$: $6 \\times \\frac{26}{36} = \\frac{13}{3} \\approx 4.33$<br>
      $g = 7$: $7 \\times \\frac{21}{36} = \\frac{49}{12} \\approx 4.08$</p>
      <p>So name <b>6</b>, worth about <b>£4.33</b>. It is one below the most likely total: going
      from 6 to 7 gives up 5 of your 26 winning rolls for a prize only one-sixth bigger.</p>`,
  },

  {
    id: "larger-die-is-a-five",
    category: "conditional",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I roll two fair dice where you cannot see them and tell you, truthfully, that the
      larger of the two numbers is a 5 (if both dice show the same number, that number counts as
      the larger). What is the expected total of the two dice?`,
    hint: `List the ordered outcomes in which the highest number showing is 5.`,
    hints: [
      `List the ordered outcomes in which the highest number showing is 5.`,
      `There are nine: a 5 with a 1, 2, 3 or 4, in either order, and double 5.`,
    ],
    shortAnswer: `$\\frac{70}{9} \\approx 7.78$.`,
    solution: `<p>Nine of the 36 ordered outcomes have 5 as the highest number: $(5, x)$ and
      $(x, 5)$ for $x = 1, 2, 3, 4$, and $(5, 5)$.</p>
      <p>Their totals add to $2 \\times (6 + 7 + 8 + 9) + 10 = 70$, so the expected total is
      $\\frac{70}{9} \\approx$ <b>7.78</b>. The other die is not a uniform 1 to 5: a 5 has only one
      way to appear and each lower number has two.</p>`,
    interview: {
      level: 1,
      followUp: "at-least-one-five",
      twist: `Suppose I had said only that at least one of the dice shows a 5. Is the expected total
      higher or lower than before — and what is it?`,
    },
  },
  {
    id: "at-least-one-five",
    category: "conditional",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I roll two fair dice where you cannot see them and tell you, truthfully, that at
      least one of them shows a 5. What is the expected total of the two dice?`,
    hint: `Count the ordered outcomes that contain a 5. The other die can be anything, including a 6.`,
    hints: [
      `Count the ordered outcomes that contain a 5. The other die can be anything, including a 6.`,
      `There are eleven: ten with exactly one 5, and double 5.`,
    ],
    shortAnswer: `$\\frac{92}{11} \\approx 8.36$ — higher than the $\\frac{70}{9} \\approx 7.78$ you get when told the larger die is a 5.`,
    solution: `<p>Eleven ordered outcomes contain a 5: $(5, x)$ and $(x, 5)$ for
      $x = 1, 2, 3, 4, 6$, and $(5, 5)$.</p>
      <p>Their totals add to $2 \\times (6 + 7 + 8 + 9 + 11) + 10 = 92$, so the expected total is
      $\\frac{92}{11} \\approx$ <b>8.36</b>. That is higher than if you had been told the larger die
      is a 5 ($\\frac{70}{9} \\approx 7.78$), because this statement leaves room for a 6.</p>`,
  },

  {
    id: "ann-beats-cat",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Ann, Ben and Cat each independently draw a random number between 0 and 1. You are
      told that Ann's number is bigger than Cat's. What is the probability that Ann's number is
      also bigger than Ben's?`,
    hint: `No integrals are needed. Which of the three holds the largest number? Each is equally likely.`,
    hints: [
      `No integrals are needed. Which of the three holds the largest number? Each is equally likely.`,
      `$P(\\text{Ann beats Ben} \\mid \\text{Ann beats Cat}) = \\dfrac{P(\\text{Ann has the largest})}{P(\\text{Ann beats Cat})}$.`,
    ],
    shortAnswer: `$\\frac{2}{3}$.`,
    solution: `<p>Ann beats both Ben and Cat exactly when she holds the largest of the three
      numbers, which by symmetry has probability $\\frac{1}{3}$. She beats Cat with probability
      $\\frac{1}{2}$.</p>
      <p>So the answer is $\\frac{1/3}{1/2} =$ <b>$\\frac{2}{3}$</b>. Learning that Ann has already
      beaten someone makes it more likely that her number is a high one.</p>`,
    interview: {
      level: 1,
      followUp: "ben-beats-cat",
      twist: `Now you are told instead that Ben's number is bigger than Cat's. What is the probability
      that Ann's is bigger than Ben's?`,
    },
  },
  {
    id: "ben-beats-cat",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Ann, Ben and Cat each independently draw a random number between 0 and 1. You are
      told that Ben's number is bigger than Cat's. What is the probability that Ann's number is
      bigger than Ben's?`,
    hint: `The three numbers can come in six orders, all equally likely.`,
    hints: [
      `The three numbers can come in six orders, all equally likely.`,
      `Three of the six orders have Ben above Cat. In how many of those is Ann above Ben?`,
    ],
    shortAnswer: `$\\frac{1}{3}$.`,
    solution: `<p>Of the six equally likely orders, three have Ben above Cat: Ann–Ben–Cat,
      Ben–Ann–Cat and Ben–Cat–Ann (largest first). Ann is above Ben in only the first.</p>
      <p>So the probability is <b>$\\frac{1}{3}$</b>, down from the $\\frac{1}{2}$ you would give
      with no information: Ben has already beaten someone, so his number is likely to be high and
      he is harder to beat.</p>`,
  },

  {
    id: "chocolate-bar-breaks",
    category: "logic",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A chocolate bar is a $6 \\times 8$ rectangle of 48 squares. A break takes one piece
      and snaps it in two along a straight line between squares. What is the smallest number of
      breaks that separates the bar into its 48 squares?`,
    hint: `Try a $2 \\times 2$ bar. Does the order of the breaks change how many you need?`,
    hints: [
      `Try a $2 \\times 2$ bar. Does the order of the breaks change how many you need?`,
      `How does the number of pieces change each time you make a break?`,
    ],
    shortAnswer: `47. Every break adds exactly one piece, so every way of doing it takes the same number.`,
    solution: `<p>Each break turns one piece into two, so it raises the number of pieces by exactly
      one. You start with 1 piece and need 48.</p>
      <p>That takes <b>47</b> breaks — no more and no fewer, whatever order you choose.</p>`,
    interview: {
      level: 1,
      followUp: "chocolate-breaking-game",
      twist: `Two players now take turns making one break each, on any piece they like. A player who
      has no break left to make loses. Would you rather go first or second?`,
    },
  },
  {
    id: "chocolate-breaking-game",
    category: "logic",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two players share a $6 \\times 8$ chocolate bar of 48 squares. They take turns: on
      your turn you take any one piece and snap it in two along a straight line between squares.
      A player who has no break left to make loses. Would you rather move first or second, and
      what is the winning strategy?`,
    hint: `How many breaks does the whole game last?`,
    hints: [
      `How many breaks does the whole game last?`,
      `Each break turns one piece into two, and the game ends when there are 48 single squares.`,
    ],
    shortAnswer: `Move first. The game lasts exactly 47 breaks whatever anyone does, so the first player always makes the last one — no strategy is needed.`,
    solution: `<p>Every break adds one piece, and the game ends at 48 pieces, so it lasts exactly
      47 breaks however it is played.</p>
      <p>47 is odd, so the first player makes breaks 1, 3, …, 47 and the second player is the one
      left with nothing to break. <b>Move first</b>; there is no strategy to find, because no
      choice changes the length of the game.</p>`,
  },

  /* ---- Level 2 -------------------------------------------------------------- */

  {
    id: "hat-of-banknotes",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A hat holds 111 banknotes: one hundred £1 notes, ten £10 notes and a single £100
      note. I draw them out one at a time, at random, and show you each one. At any moment before
      a draw you can say “stop”, and the next note out of the hat is yours; if you never speak you
      get the last note. What is your best strategy, and what is the most you should pay to play?`,
    hint: `Shrink it: try a hat with two notes, then three. Can waiting ever help?`,
    hints: [
      `Shrink it: try a hat with two notes, then three. Can waiting ever help?`,
      `Suppose you say stop with some notes still in the hat. Compare being given the next note with being given the very last note in the hat.`,
      `The next note and the last note are each equally likely to be any of the notes left. So whenever you stop, you may as well have waited for the last note.`,
    ],
    shortAnswer: `No strategy beats any other. The game is worth £300 ÷ 111 ≈ £2.70 ($\\frac{100}{37}$).`,
    solution: `<p>Suppose you say stop with $k$ notes left. The next note out is equally likely
      to be any of those $k$ — and so is the note that would have come out last. So stopping now
      has the same expected value as never speaking and taking the last note. That is true at
      every moment and after any history, so every strategy is worth the same as “take the last
      note”.</p>
      <p>The last note is equally likely to be any of the 111, so the game is worth
      $\\frac{100 \\times 1 + 10 \\times 10 + 100}{111} = \\frac{300}{111} \\approx$ <b>£2.70</b>.
      Watching the notes go by tells you what is left, but never which of them comes next.</p>`,
    interview: {
      level: 2,
      followUp: "the-hundred-comes-late",
      twist: `Before we start, I let something slip: the £100 note will not be among the first 50
      notes drawn. What is the game worth now, and when should you say stop?`,
    },
  },
  {
    id: "the-hundred-comes-late",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A hat holds 111 banknotes: one hundred £1 notes, ten £10 notes and a single £100
      note. They are drawn out one at a time at random and shown to you; at any moment before a
      draw you can say “stop” and the next note drawn is yours. You have been told, truthfully,
      that the £100 note is not among the first 50 drawn. When should you say stop, and what is
      the game worth?`,
    hint: `Split the game in two: the first 50 draws, and everything after.`,
    hints: [
      `Split the game in two: the first 50 draws, and everything after.`,
      `After 50 draws there are 61 notes left with the £100 among them, and every strategy from there is worth the same as taking the last note.`,
      `The last note is the £100 with probability $\\frac{1}{61}$; otherwise it is a random one of the 110 small notes, worth $\\frac{200}{110}$ on average.`,
    ],
    shortAnswer: `Let the first 50 notes go, then stop whenever you like. Worth $\\frac{2300}{671} \\approx$ £3.43.`,
    solution: `<p>Stopping during the first 50 draws can only win a small note, so wait. Once 50
      notes have gone, 61 remain, the £100 is among them, and nothing more is known about the
      order: the next note and the last note are equally likely to be any of the 61. So from then
      on every strategy is worth the same as taking the last note.</p>
      <p>The last note is the £100 with probability $\\frac{1}{61}$. Otherwise it is equally likely
      to be any of the 110 small notes, which average $\\frac{100 + 100}{110} = \\frac{20}{11}$. So
      the game is worth $\\frac{1}{61} \\times 100 + \\frac{60}{61} \\times \\frac{20}{11} =
      \\frac{2300}{671} \\approx$ <b>£3.43</b>.</p>
      <p>Waiting is strictly better than any early stop: the most an early note can be worth on
      average is about £2.48 (if the first 49 were all £1 notes), while waiting is never worth
      less than $\\frac{100 + 60}{61} \\approx$ £2.62.</p>`,
  },

  {
    id: "two-red-two-blue-chips",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A bag holds two red chips and two blue chips. You draw chips one at a time without
      putting them back: each red chip wins you £1 and each blue chip loses you £1. You can stop
      whenever you like, including before the first draw. How much is the game worth, and how do
      you play it?`,
    hint: `If you draw all four chips you finish level, so all the value is in choosing when to stop.`,
    hints: [
      `If you draw all four chips you finish level, so all the value is in choosing when to stop.`,
      `Work backwards. What is the bag worth with one red and one blue left? With two red and one blue? With one red and two blue?`,
      `One red and one blue is worth 50p (draw, and stop if it is red). Two red and one blue is worth £1.33. One red and two blue is worth nothing.`,
    ],
    shortAnswer: `£$\\frac{2}{3}$, about 67p. Draw, stop as soon as you are ahead, and otherwise keep going to the end.`,
    solution: `<p>Write $V(r, b)$ for the value of a bag with $r$ red and $b$ blue, on top of
      whatever you have already won. You can always stop, so $V \\ge 0$.</p>
      <p>$V(1, 1) = \\frac{1}{2}(1) + \\frac{1}{2}(-1 + 1) = \\frac{1}{2}$.<br>
      $V(2, 1) = \\frac{2}{3}\\left(1 + \\frac{1}{2}\\right) + \\frac{1}{3}(-1 + 2) = \\frac{4}{3}$.<br>
      $V(1, 2)$: drawing gives $\\frac{1}{3}(1) + \\frac{2}{3}\\left(-1 + \\frac{1}{2}\\right) = 0$, so it is worth 0.<br>
      $V(2, 2) = \\frac{1}{2}(1 + 0) + \\frac{1}{2}\\left(-1 + \\frac{4}{3}\\right) =$ <b>$\\frac{2}{3}$</b>.</p>
      <p>In play: draw. A red first chip puts you £1 up with a bag worth nothing more, so stop.
      A blue first chip leaves a bag stacked in your favour, so keep drawing until you are ahead
      or the bag is empty.</p>`,
    interview: {
      level: 2,
      followUp: "two-red-three-blue-chips",
      twist: `I now add a third blue chip, so the bag has two red and three blue — more losers than
      winners. If it costs nothing to play, would you still play?`,
    },
  },
  {
    id: "two-red-three-blue-chips",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A bag holds two red chips and three blue chips. You draw chips one at a time
      without replacement: each red wins you £1, each blue loses you £1, and you can stop whenever
      you like. The bag is stacked against you. Is the game worth anything — and if so, how much?`,
    hint: `Drawing everything loses £1, so you need a plan that stops early when things go well.`,
    hints: [
      `Drawing everything loses £1, so you need a plan that stops early when things go well.`,
      `After a red first chip, stop. After a blue first chip you are £1 down holding a bag of two red and two blue — what is that bag worth?`,
      `A bag of two red and two blue is worth £$\\frac{2}{3}$ if you stop well.`,
    ],
    shortAnswer: `Yes: 20p ($\\frac{1}{5}$). Stop if the first chip is red. If it is blue, keep drawing until you are back level or the bag is empty.`,
    solution: `<p>Draw once. With probability $\\frac{2}{5}$ it is red: you are £1 up, and the bag
      left behind (one red, three blue) is worth nothing, so stop.</p>
      <p>With probability $\\frac{3}{5}$ it is blue: you are £1 down holding two red and two blue.
      That bag is worth $\\frac{2}{3}$ with good stopping, so you play on and expect to finish at
      $-1 + \\frac{2}{3} = -\\frac{1}{3}$.</p>
      <p>Overall $\\frac{2}{5}(1) + \\frac{3}{5}\\left(-\\frac{1}{3}\\right) =$ <b>$\\frac{1}{5}$</b>, or
      20p. The bag loses £1 if you empty it, but the right to walk away is worth £1.20.</p>`,
  },

  {
    id: "level-with-alternating-serve",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and an opponent are level in a deciding game, and the first to get two points
      ahead wins. The serve alternates every point. You win 60% of the points on your own serve
      but only 30% on your opponent's, and you are serving first. What is your probability of
      winning?`,
    hint: `Take the points two at a time: one on your serve, one on theirs.`,
    hints: [
      `Take the points two at a time: one on your serve, one on theirs.`,
      `After a pair of points you have won both, lost both, or you are level again — and then the game simply restarts.`,
      `Win both: $0.6 \\times 0.3 = 0.18$. Lose both: $0.4 \\times 0.7 = 0.28$.`,
    ],
    shortAnswer: `$\\frac{9}{23} \\approx 0.39$.`,
    solution: `<p>From level, nobody can win after one point, so look at the next two together —
      one on each serve. You win both with probability $0.6 \\times 0.3 = 0.18$ and lose both with
      probability $0.4 \\times 0.7 = 0.28$. Otherwise the pair is split, you are level again with
      you to serve, and the game starts afresh.</p>
      <p>So you win with probability $\\frac{0.18}{0.18 + 0.28} = \\frac{9}{23} \\approx$ <b>0.39</b>.</p>`,
    interview: {
      level: 2,
      followUp: "who-serves-first",
      twist: `Your opponent wins the toss instead and serves first. Does your chance go up or down?`,
    },
  },
  {
    id: "who-serves-first",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two players are level, and the first to get two points ahead wins; the serve
      alternates every point. You win 60% of the points on your own serve and 30% on your
      opponent's. By how much does your probability of winning change if your opponent serves
      first rather than you?`,
    hint: `Group the points into pairs, starting from level. What does each pair contain?`,
    hints: [
      `Group the points into pairs, starting from level. What does each pair contain?`,
      `Winning both points of a pair has probability $0.3 \\times 0.6$ — the same product, in the other order.`,
    ],
    shortAnswer: `Not at all: it is $\\frac{9}{23}$ whoever serves first.`,
    solution: `<p>From level the game can only end after an even number of points, so take them
      in pairs. Whoever serves first, each pair contains one point on your serve and one on
      theirs.</p>
      <p>You win both with probability $0.6 \\times 0.3 = 0.18$ and lose both with probability
      $0.4 \\times 0.7 = 0.28$, in either order, and a split pair restarts the game. So your chance
      is $\\frac{0.18}{0.46} = \\frac{9}{23}$ either way: <b>no change</b>.</p>`,
  },

  {
    id: "higher-or-lower-for-six-pounds",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I pick a whole number from 1 to 100 at random, each equally likely. You guess, and
      after each guess I tell you whether my number is higher, lower, or that you have it. Every
      guess costs you £1, and when you hit the number I pay you £6. Should you play?`,
    hint: `If you halve the range each time, how many numbers can you hit with your first guess? With your second? Your third?`,
    hints: [
      `If you halve the range each time, how many numbers can you hit with your first guess? With your second? Your third?`,
      `One number takes one guess, 2 take two, 4 take three, 8 take four, 16 take five and 32 take six. That is 63 numbers; the other 37 take seven.`,
      `Average the number of guesses over all 100 numbers and compare it with 6.`,
    ],
    shortAnswer: `Yes. Halving takes 5.8 guesses on average, so you make 20p a game.`,
    solution: `<p>Halve the range every time. Your first guess is right for 1 number, your second
      for 2, then 4, 8, 16 and 32 — 63 numbers found within six guesses — and the remaining 37
      take a seventh.</p>
      <p>Average guesses: $\\frac{1 + 4 + 12 + 32 + 80 + 192 + 259}{100} = \\frac{580}{100} = 5.8$.
      You are paid £6, so you make <b>20p a game</b> on average. No guessing order does better
      than halving. It is still a loss 37% of the time, when the seventh guess costs you £1 overall.</p>`,
    interview: {
      level: 2,
      followUp: "higher-or-lower-odd-number",
      twist: `Before you start I tell you that my number is odd. How much is that piece of
      information worth to you?`,
    },
  },
  {
    id: "higher-or-lower-odd-number",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I pick an odd number from 1 to 99 at random — 50 possibilities, each equally
      likely. You guess, and after each guess I say higher, lower or correct. Each guess costs £1
      and I pay £6 when you hit it. What is your expected profit?`,
    hint: `Only 50 candidates remain. Redo the halving count.`,
    hints: [
      `Only 50 candidates remain. Redo the halving count.`,
      `1, 2, 4, 8 and 16 numbers take one to five guesses — 31 in all — and the other 19 take six.`,
    ],
    shortAnswer: `£1.14 a game: 4.86 guesses on average. (Against 20p for the full 1-to-100 game, so knowing the number is odd is worth 94p.)`,
    solution: `<p>Halving 50 candidates: 1, 2, 4, 8 and 16 of them are found on guesses one to
      five (31 numbers), and the remaining 19 on the sixth.</p>
      <p>Average guesses: $\\frac{1 + 4 + 12 + 32 + 80 + 114}{50} = \\frac{243}{50} = 4.86$, so the
      expected profit is $6 - 4.86 =$ <b>£1.14</b>.</p>
      <p>The same game over all of 1 to 100 takes 5.8 guesses and makes 20p, so being told the
      number is odd is worth 94p — just under one guess, as you would expect from halving the
      candidates.</p>`,
  },

  {
    id: "a-pound-to-roll-again",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a fair die and may take its value in pounds. If you do not like it you
      can pay £1 to roll again, as many times as you want; you are paid your last roll, less what
      you spent on rerolls. What is the game worth, and when do you stop?`,
    hint: `Call the game's value $V$ just before a roll. Paying for a reroll puts you back in exactly that position, £1 poorer.`,
    hints: [
      `Call the game's value $V$ just before a roll. Paying for a reroll puts you back in exactly that position, £1 poorer.`,
      `So you keep a roll when it beats $V - 1$. Guess which rolls you keep, write an equation for $V$, then check the guess.`,
      `If you keep 4, 5 and 6: $V = \\frac{4 + 5 + 6}{6} + \\frac{1}{2}(V - 1)$.`,
    ],
    shortAnswer: `£4. Keep a 4, 5 or 6 and reroll a 1 or 2; with a 3 it makes no difference.`,
    solution: `<p>Let $V$ be the value just before a roll. Rerolling is worth $V - 1$, so you keep
      a roll $x$ when $x > V - 1$, and $V = \\frac{1}{6}\\sum_x \\max(x,\\ V - 1)$.</p>
      <p>Guess that you keep 4, 5 and 6: $V = \\frac{15}{6} + \\frac{1}{2}(V - 1)$, giving $V = 4$.
      Check: rerolling is then worth 3, so you do keep 4 and above and reroll 1 and 2, and a 3 is
      a toss-up. The guess is consistent.</p>
      <p>The game is worth <b>£4</b> — 50p more than a single roll.</p>`,
    interview: {
      level: 2,
      followUp: "holding-out-for-a-six",
      twist: `How cheap would a reroll have to be before you would hold out for a 6, refusing even a 5?`,
    },
  },
  {
    id: "holding-out-for-a-six",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a fair die and may take its value in pounds, or pay a fee to roll again,
      as often as you like. How small must the fee be for it to be right to keep rolling until you
      get a 6, refusing even a 5?`,
    hint: `If you will only ever accept a 6, how many more rolls do you expect to need?`,
    hints: [
      `If you will only ever accept a 6, how many more rolls do you expect to need?`,
      `Holding a 5, carrying on gains you exactly £1 in the end and costs six fees on average.`,
    ],
    shortAnswer: `Less than one-sixth of a pound, about 17p.`,
    solution: `<p>Suppose you are holding a 5 and decide to go on until a 6 appears. That takes 6
      more rolls on average, so it costs six fees and gains exactly £1.</p>
      <p>It is worth doing only if six fees come to less than £1: the fee must be below
      <b>$\\frac{1}{6}$ of a pound, about 17p</b>. (Check with the value equation: accepting only
      a 6 gives $V = 6 - 5c$, and refusing a 5 needs $V - c > 5$, that is $c < \\frac{1}{6}$.)</p>`,
  },

  {
    id: "unbeaten-in-a-round-robin",
    category: "combinatorics",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Five teams play a round robin: every team plays every other team once, there are
      no draws, and each match is a fair coin flip. What is the probability that some team wins
      all of its matches?`,
    hint: `What is the chance that one named team wins all four of its matches?`,
    hints: [
      `What is the chance that one named team wins all four of its matches?`,
      `Can two different teams both finish unbeaten?`,
    ],
    shortAnswer: `$\\frac{5}{16}$.`,
    solution: `<p>A named team wins all four of its matches with probability
      $\\left(\\frac{1}{2}\\right)^4 = \\frac{1}{16}$.</p>
      <p>Two teams cannot both be unbeaten, because they played each other. So the five events
      cannot overlap and their probabilities simply add: $5 \\times \\frac{1}{16} =$
      <b>$\\frac{5}{16}$</b>.</p>`,
    interview: {
      level: 2,
      followUp: "unbeaten-and-winless",
      twist: `And what is the probability that the final table has both a team that won everything
      and a team that lost everything?`,
    },
  },
  {
    id: "unbeaten-and-winless",
    category: "combinatorics",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Five teams play a round robin with no draws, every match a fair coin flip. What is
      the probability that one team wins all of its matches and another team loses all of its
      matches?`,
    hint: `Fix which team is unbeaten and which is winless. How many different matches does that pin down?`,
    hints: [
      `Fix which team is unbeaten and which is winless. How many different matches does that pin down?`,
      `Seven, not eight: the match between those two teams appears in both lists.`,
      `There are $5 \\times 4$ ways to choose the two teams, and no two of those outcomes can happen together.`,
    ],
    shortAnswer: `$\\frac{5}{32}$.`,
    solution: `<p>Choose the unbeaten team and the winless team: $5 \\times 4 = 20$ ways. Their
      results fix $4 + 4 - 1 = 7$ matches, since the match between the two of them is counted
      twice. Each such outcome has probability $\\left(\\frac{1}{2}\\right)^7$.</p>
      <p>There can be at most one unbeaten team and at most one winless team, so the 20 cases
      cannot overlap: $\\frac{20}{128} =$ <b>$\\frac{5}{32}$</b>.</p>`,
  },

  /* ---- Level 3 -------------------------------------------------------------- */

  {
    id: "dice-past-a-hundred",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a fair die again and again, adding up the rolls, and stop the first time
      the running total is greater than 100. Estimate the expected value of the total you stop on.`,
    hint: `You stop on one of 101 to 106, and they are not equally likely. Why is 101 the most likely?`,
    hints: [
      `You stop on one of 101 to 106, and they are not equally likely. Why is 101 the most likely?`,
      `Far from the start, what is the chance that the running total ever lands on one particular number? The average roll is 3.5.`,
      `Each total just below 100 is visited with probability about $\\frac{2}{7}$. To finish on $100 + j$ you must visit one of the totals from $94 + j$ to 100 and then roll exactly the right number.`,
    ],
    shortAnswer: `About 102.67, that is $100 + \\frac{8}{3}$.`,
    solution: `<p>The running total moves up by 3.5 a roll on average, so far from the start it
      lands on any particular number with probability about $\\frac{1}{3.5} = \\frac{2}{7}$.</p>
      <p>To stop on $100 + j$ you must visit one of the $7 - j$ totals from $94 + j$ to 100 and
      then roll the one number that takes you there: probability about
      $(7 - j) \\times \\frac{2}{7} \\times \\frac{1}{6} = \\frac{7 - j}{21}$. So 101 to 106 have
      probabilities $\\frac{6}{21}, \\frac{5}{21}, \\dots, \\frac{1}{21}$.</p>
      <p>The expected overshoot is $\\frac{1 \\cdot 6 + 2 \\cdot 5 + 3 \\cdot 4 + 4 \\cdot 3 + 5 \\cdot 2 + 6 \\cdot 1}{21}
      = \\frac{56}{21} = \\frac{8}{3}$, so the expected final total is about <b>102.67</b>. (The
      exact figure agrees with $100 + \\frac{8}{3}$ to more than eight decimal places.)</p>`,
    interview: {
      level: 3,
      followUp: "rolls-to-pass-a-hundred",
      twist: `And roughly how many rolls does it take, on average?`,
    },
  },
  {
    id: "rolls-to-pass-a-hundred",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a fair die repeatedly, adding up the rolls, and stop the first time the
      running total exceeds 100. Estimate the expected number of rolls.`,
    hint: `The total you stop on is not 100 — you always overshoot. By how much, on average?`,
    hints: [
      `The total you stop on is not 100 — you always overshoot. By how much, on average?`,
      `Expected final total = 3.5 × expected number of rolls.`,
      `The expected final total is about $100 + \\frac{8}{3}$.`,
    ],
    shortAnswer: `About 29.3 rolls ($\\frac{88}{3}$): the expected final total, about 102.67, divided by 3.5.`,
    solution: `<p>Each roll adds 3.5 on average, and whether you roll again depends only on the
      rolls so far, so (Wald's identity) expected final total = 3.5 × expected number of rolls.</p>
      <p>The final total is not 100 but about $100 + \\frac{8}{3}$: you stop on 101, …, 106 with
      probabilities close to $\\frac{6}{21}, \\frac{5}{21}, \\dots, \\frac{1}{21}$, because each total
      just below 100 is visited with probability about $\\frac{2}{7}$.</p>
      <p>So the expected number of rolls is about $\\frac{102.67}{3.5} = \\frac{88}{3} \\approx$
      <b>29.3</b>. The quick answer $\\frac{100}{3.5} \\approx 28.6$ is too low because it ignores
      the overshoot.</p>`,
  },

  {
    id: "nine-different-handshakes",
    category: "logic",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A host and his wife invite four other couples to dinner. Some people shake hands;
      nobody shakes hands with their own partner, or with the same person twice. Afterwards the
      host asks the other nine people how many hands they shook, and gets nine different answers.
      How many hands did the host's wife shake?`,
    hint: `What is the largest number of hands one person could have shaken? So what must the nine answers be?`,
    hints: [
      `What is the largest number of hands one person could have shaken? So what must the nine answers be?`,
      `Somebody shook 8 hands — everyone except their own partner. What does that tell you about the person who shook none?`,
      `The 8 and the 0 are a couple. Set them aside, take one handshake off everybody else, and the same puzzle comes back with one couple fewer.`,
    ],
    shortAnswer: `4.`,
    solution: `<p>Nobody shakes their own hand or their partner's, so the most anyone can shake
      is 8. Nine different answers must therefore be 0, 1, …, 8.</p>
      <p>The person who shook 8 shook everyone outside their own couple, so every one of those
      people shook at least one hand. The person who shook 0 can only be the 8's partner.</p>
      <p>Set that couple aside. Everyone else shook the 8's hand and not the 0's, so taking one off
      each count leaves the same puzzle with answers 0 to 6: the 7 and the 1 are a couple, then
      the 6 and the 2, then the 5 and the 3. The one answer left without a partner among the
      guests is 4, and it belongs to the host's wife: <b>4</b>.</p>`,
    interview: {
      level: 3,
      followUp: "the-hosts-own-handshakes",
      twist: `And how many hands did the host himself shake?`,
    },
  },
  {
    id: "the-hosts-own-handshakes",
    category: "logic",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A host and his wife invite four other couples to dinner. Nobody shakes hands with
      their own partner, or with the same person twice. The host asks the other nine people how
      many hands they shook and gets nine different answers. How many hands did the host himself
      shake?`,
    hint: `The nine answers are 0 to 8, and they pair off into couples: 8 with 0, 7 with 1, 6 with 2, 5 with 3. The host's wife is the 4.`,
    hints: [
      `The nine answers are 0 to 8, and they pair off into couples: 8 with 0, 7 with 1, 6 with 2, 5 with 3. The host's wife is the 4.`,
      `In each of the four other couples, which partner shook the host's hand?`,
      `The 8 shook everyone outside their own couple, the host included; their partner shook nobody. Peel that couple off and repeat.`,
    ],
    shortAnswer: `4 — the same as his wife. In each of the other four couples exactly one partner shook his hand.`,
    solution: `<p>The answers must be 0 to 8, and the standard peeling argument pairs them into
      couples: 8 with 0, 7 with 1, 6 with 2 and 5 with 3, leaving 4 for the host's wife.</p>
      <p>Now follow the host through the same argument. The 8 shook everyone outside their couple,
      including the host; the 0 shook nobody. The 7 shook everyone except their partner and the 0,
      so again the host; the 1 shook only the 8. In the same way the 6 and the 5 shook the host's
      hand and the 2 and the 3 did not.</p>
      <p>His wife cannot shake his hand, so the host shook exactly <b>4</b>.</p>`,
  },

  {
    id: "three-way-duel",
    category: "probability",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three people fight a three-way duel, taking one shot each in the order A, B, C, A, …
      until only one is left. A hits what he aims at one time in three, B two times in three, and
      C never misses. You are A, and on your turn you may shoot at either opponent or
      deliberately fire into the air. Assume B and C will each aim at the better shot of their
      remaining opponents. What should you do with your first shot, and what is your chance of
      surviving?`,
    hint: `Start with the two-person duels. If you face B alone and it is your shot, what is your chance?`,
    hints: [
      `Start with the two-person duels. If you face B alone and it is your shot, what is your chance?`,
      `Compare three first shots. Hitting C leaves you facing B with B to shoot. Hitting B leaves you facing C with C to shoot. Missing leaves B and C to deal with each other, and you get the first shot at whoever is left.`,
      `Against B alone with you to shoot, you win $\\frac{3}{7}$ of the time. Against C alone you get exactly one shot.`,
    ],
    shortAnswer: `Fire into the air. You survive with probability $\\frac{25}{63} \\approx 0.40$, against $\\frac{59}{189} \\approx 0.31$ for aiming at C and $\\frac{50}{189} \\approx 0.26$ for aiming at B.`,
    solution: `<p><b>Two-person duels.</b> Against B with you to shoot, your chance $a$ satisfies
      $a = \\frac{1}{3} + \\frac{2}{3} \\cdot \\frac{1}{3} \\cdot a$, so $a = \\frac{3}{7}$. With B to
      shoot first it is $\\frac{1}{3} \\cdot \\frac{3}{7} = \\frac{1}{7}$. Against C you win only if
      it is your shot and you hit: $\\frac{1}{3}$.</p>
      <p><b>Miss on purpose.</b> B shoots at C. If B hits ($\\frac{2}{3}$) you face B with the first
      shot: $\\frac{3}{7}$. If B misses, C shoots B and you have one shot at C: $\\frac{1}{3}$.
      Total $\\frac{2}{3} \\cdot \\frac{3}{7} + \\frac{1}{3} \\cdot \\frac{1}{3} = \\frac{25}{63}$.</p>
      <p><b>Aim at C.</b> A hit ($\\frac{1}{3}$) leaves B shooting first at you, worth
      $\\frac{1}{7}$; a miss is the case above. Total $\\frac{1}{3} \\cdot \\frac{1}{7} + \\frac{2}{3} \\cdot \\frac{25}{63} = \\frac{59}{189}$.</p>
      <p><b>Aim at B.</b> A hit means C shoots you next; a miss is the case above. Total
      $\\frac{2}{3} \\cdot \\frac{25}{63} = \\frac{50}{189}$.</p>
      <p>So <b>fire into the air</b>, for $\\frac{25}{63} \\approx 0.40$. Hitting either opponent
      only makes you the next target of the other, with them shooting first.</p>`,
    interview: {
      level: 3,
      followUp: "who-survives-the-three-way-duel",
      twist: `If you do fire into the air, which of the three is most likely to be the survivor —
      and which is least likely?`,
    },
  },
  {
    id: "who-survives-the-three-way-duel",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three people fight a three-way duel, taking one shot each in the order A, B, C, A, …
      until only one is left. A hits one time in three, B two times in three, and C never misses.
      A opens by deliberately firing into the air; after that everyone aims at the better shot of
      their remaining opponents. What is each person's probability of being the survivor?`,
    hint: `After A's wasted shot, B fires at C. Split on whether B hits.`,
    hints: [
      `After A's wasted shot, B fires at C. Split on whether B hits.`,
      `If B hits, it is a duel between A and B with A to shoot, which A wins $\\frac{3}{7}$ of the time. If B misses, C shoots B and A has exactly one shot at C.`,
    ],
    shortAnswer: `A $\\frac{25}{63} \\approx 0.40$, B $\\frac{8}{21} \\approx 0.38$, C $\\frac{2}{9} \\approx 0.22$. The worst shot is the most likely survivor and the perfect shot the least.`,
    solution: `<p>B fires at C. <b>B hits</b> ($\\frac{2}{3}$): A and B fight on with A to shoot.
      A's chance $a$ satisfies $a = \\frac{1}{3} + \\frac{2}{3} \\cdot \\frac{1}{3} \\cdot a$, so A wins
      $\\frac{3}{7}$ and B wins $\\frac{4}{7}$. <b>B misses</b> ($\\frac{1}{3}$): C shoots B, then A
      has one shot at C, hitting with probability $\\frac{1}{3}$; otherwise C shoots A.</p>
      <p>A: $\\frac{2}{3} \\cdot \\frac{3}{7} + \\frac{1}{3} \\cdot \\frac{1}{3} = \\frac{25}{63}$.<br>
      B: $\\frac{2}{3} \\cdot \\frac{4}{7} = \\frac{8}{21}$.<br>
      C: $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$.</p>
      <p>These add to 1. The order is <b>A, then B, then C</b>: being the least dangerous means
      nobody shoots at you until the other two have settled their own fight.</p>`,
  },

  {
    id: "sure-thing-with-four-cards",
    category: "market making",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Four cards, two red and two black, are shuffled and turned over one at a time.
      You start with £1. Before each card you may bet any part of your money, at even odds, on
      the colour of the next card — or bet nothing. You see every card as it is turned. What is
      the largest amount you can be certain of finishing with?`,
    hint: `When only one colour is left you know what is coming, so you bet everything and double up on each card.`,
    hints: [
      `When only one colour is left you know what is coming, so you bet everything and double up on each card.`,
      `Work backwards. With one red and one black left, what can you guarantee? Then with two of one colour and one of the other.`,
      `With two red and one black left, bet a fraction $f$ of your money on red, and choose $f$ so that you finish with the same amount whichever card comes.`,
    ],
    shortAnswer: `£$\\frac{8}{3}$, about £2.67 — and with the right bets you finish with exactly that, whatever the order.`,
    solution: `<p>Let $G(r, b)$ be the multiple of your money you can guarantee with $r$ red and
      $b$ black cards to come.</p>
      <p>One colour left: every card is known, so $G(1, 0) = 2$ and $G(2, 0) = 4$.<br>
      $G(1, 1)$: any bet could lose, so bet nothing, then double on the last card: $2$.<br>
      $G(2, 1)$: bet a fraction $f$ on red. Red leaves $(1 + f) \\times G(1, 1) = 2(1 + f)$; black
      leaves $(1 - f) \\times G(2, 0) = 4(1 - f)$. These are equal at $f = \\frac{1}{3}$, giving
      $\\frac{8}{3}$.<br>
      $G(2, 2)$: by symmetry bet nothing on the first card, which leaves $G(2, 1) = \\frac{8}{3}$.</p>
      <p>So you can lock in <b>£$\\frac{8}{3}$</b>. In general the guarantee is
      $2^{n} / \\binom{n}{r}$ for $n$ cards of which $r$ are red.</p>`,
    interview: {
      level: 3,
      followUp: "sure-thing-with-a-full-deck",
      twist: `Now a full deck: 26 red and 26 black. Roughly how much can you guarantee from £1 — is
      it nearer £2, £9 or £50?`,
    },
  },
  {
    id: "sure-thing-with-a-full-deck",
    category: "market making",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A standard deck of 26 red and 26 black cards is turned over one card at a time.
      You start with £1, and before each card you may bet any part of your money, at even odds, on
      the colour of the next card. You see every card. Roughly how much can you be certain of
      finishing with: nearer £2, £9 or £50?`,
    hint: `There are $\\binom{52}{26}$ possible orders of colours. Imagine splitting your £1 equally between them, and betting each share all-in, card by card, on its own order.`,
    hints: [
      `There are $\\binom{52}{26}$ possible orders of colours. Imagine splitting your £1 equally between them, and betting each share all-in, card by card, on its own order.`,
      `The one share that is right all the way doubles 52 times. Every other share is lost somewhere along the way.`,
      `$\\binom{52}{26} \\approx \\dfrac{2^{52}}{\\sqrt{26\\pi}}$.`,
    ],
    shortAnswer: `About £9.08, which is $2^{52} / \\binom{52}{26}$.`,
    solution: `<p>Split the £1 into $\\binom{52}{26}$ equal shares, one for each possible order of
      colours, and have each share bet everything on its own order, card by card. Exactly one
      share is right throughout and doubles 52 times; the rest are lost. Added together, these
      shares are a single legal bet before each card, and the result does not depend on the order
      at all.</p>
      <p>You finish with $\\dfrac{2^{52}}{\\binom{52}{26}}$. Since
      $\\binom{52}{26} \\approx \\dfrac{2^{52}}{\\sqrt{26\\pi}}$, that is about $\\sqrt{26\\pi} \\approx 9$;
      the exact value is about <b>£9.08</b>.</p>
      <p>No strategy guarantees more. Over all $2^{52}$ red-and-black sequences, impossible ones
      included, even-money bets average out to the £1 you started with — so you cannot hold more
      than $2^{52} / \\binom{52}{26}$ on every one of the $\\binom{52}{26}$ sequences that can
      actually happen.</p>`,
  },

  {
    id: "paid-the-fraction-of-heads",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You flip a fair coin as many times as you like — at least once — and stop whenever
      you choose. You are then paid £100 times the fraction of your flips that were heads. A
      ticket to play costs £70. Do you buy it?`,
    hint: `If the first flip is a head you can stop with the full £100. What can you do after a tail?`,
    hints: [
      `If the first flip is a head you can stop with the full £100. What can you do after a tail?`,
      `After a tail, keep flipping. How sure are you that heads will eventually catch up with tails?`,
      `For a fair coin, heads minus tails returns to zero with probability 1. So after a first tail you can always get back to a fraction of one half.`,
    ],
    shortAnswer: `Yes. Stopping on a first head, and otherwise waiting for heads to catch up, is already worth £75; the best possible play is worth about £79.`,
    solution: `<p>A simple plan: if the first flip is a head, stop with £100. If it is a tail,
      keep flipping until heads and tails are equal — for a fair coin that happens with probability
      1 — and stop with £50.</p>
      <p>That plan is worth $\\frac{1}{2} \\times 100 + \\frac{1}{2} \\times 50 = 75$, which already
      beats the £70 ticket: <b>buy it</b>.</p>
      <p>You can do a little better, since after catching up you may carry on and hope to get
      ahead. The exact value of the game has no known closed form; numerically it is about £79.3.</p>`,
    interview: {
      level: 3,
      followUp: "fraction-of-heads-in-three-flips",
      twist: `Suppose I cap you at three flips in total. What is the game worth now?`,
    },
  },
  {
    id: "fraction-of-heads-in-three-flips",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You flip a fair coin up to three times — at least once — and may stop after any
      flip. You are paid £100 times the fraction of your flips that were heads. With best play,
      what is the game worth?`,
    hint: `Work backwards from the third flip, where there are no choices left.`,
    hints: [
      `Work backwards from the third flip, where there are no choices left.`,
      `After a first head, stop: nothing beats 100%. After a first tail you have nothing to lose by flipping again.`,
      `After tail then head you hold one half, and a third flip gives $\\frac{2}{3}$ or $\\frac{1}{3}$ — no better on average. After two tails the best you can still get is $\\frac{1}{3}$.`,
    ],
    shortAnswer: `£66.67, two-thirds of £100.`,
    solution: `<p>Work in fractions of £100. A first head: stop, worth 1.</p>
      <p>A first tail: you hold 0, so flip again. Tail–head holds $\\frac{1}{2}$, and a third flip
      would give $\\frac{2}{3}$ or $\\frac{1}{3}$, which is $\\frac{1}{2}$ on average, so it is worth
      $\\frac{1}{2}$ either way. Tail–tail holds 0, and a third flip gives $\\frac{1}{3}$ or 0:
      worth $\\frac{1}{6}$. So a first tail is worth $\\frac{1}{2}\\left(\\frac{1}{2} + \\frac{1}{6}\\right) = \\frac{1}{3}$.</p>
      <p>The game is worth $\\frac{1}{2}(1) + \\frac{1}{2}\\left(\\frac{1}{3}\\right) = \\frac{2}{3}$,
      or <b>£66.67</b> — less than the £75 you can lock in when the number of flips is unlimited.</p>`,
  },

  {
    id: "redraw-duel",
    category: "probability",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and an opponent each privately draw a random number between 0 and 1. Each of
      you, without seeing what the other has or does, may throw your number away and draw a fresh
      one, which you must then keep. The higher final number wins. If your opponent plays as well
      as possible, below what value should you redraw?`,
    hint: `Suppose both of you redraw below the same threshold $t$. Holding exactly $t$, you should be indifferent between keeping it and redrawing.`,
    hints: [
      `Suppose both of you redraw below the same threshold $t$. Holding exactly $t$, you should be indifferent between keeping it and redrawing.`,
      `If you keep $t$, you win only when your opponent's final number is below $t$: they must have drawn below $t$ twice, probability $t^2$.`,
      `If you redraw, average over your new number $u$ the chance that the opponent's final number is below $u$. That chance is $tu$ for $u < t$ and $tu + (u - t)$ for $u > t$.`,
    ],
    shortAnswer: `Redraw below $\\frac{\\sqrt{5} - 1}{2} \\approx 0.618$.`,
    solution: `<p>Look for a threshold $t$ that is a best reply to itself. Your opponent's final
      number is below $u$ with probability $F(u) = tu$ when $u < t$ (they redrew and landed below
      $u$), and $F(u) = tu + (u - t)$ when $u > t$ (or they kept a first draw between $t$ and $u$).</p>
      <p>Keeping $x$ wins with probability $F(x)$, which rises with $x$; redrawing wins with a
      fixed probability $\\int_0^1 F(u)\\,du = \\frac{t}{2} + \\frac{(1 - t)^2}{2}$. So you redraw
      below the point where the two are equal, and at $x = t$ that means
      $t^2 = \\frac{t}{2} + \\frac{(1 - t)^2}{2}$.</p>
      <p>This simplifies to $t^2 + t - 1 = 0$, so $t = \\frac{\\sqrt{5} - 1}{2} \\approx$ <b>0.618</b>
      — higher than the 0.5 you might guess, because an opponent who can redraw holds a better
      number than a single random draw.</p>`,
    interview: {
      level: 3,
      followUp: "opponent-never-redraws",
      twist: `It turns out your opponent never redraws — they always keep their first number. What
      is your best threshold now, and how often do you win?`,
    },
  },
  {
    id: "opponent-never-redraws",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and an opponent each privately draw a random number between 0 and 1, and the
      higher final number wins. You may throw your number away and draw a fresh one, which you
      must keep; your opponent never redraws. Below what value should you redraw, and what is your
      probability of winning?`,
    hint: `Holding $x$ against a single random number, your chance of winning is $x$.`,
    hints: [
      `Holding $x$ against a single random number, your chance of winning is $x$.`,
      `A fresh number wins half the time. So when is keeping $x$ better?`,
    ],
    shortAnswer: `Redraw below $\\frac{1}{2}$; you win $\\frac{5}{8}$ of the time.`,
    solution: `<p>Keeping $x$ wins with probability $x$; a fresh draw wins with probability
      $\\frac{1}{2}$. So redraw exactly when $x < \\frac{1}{2}$.</p>
      <p>You win with probability $\\int_{1/2}^{1} x\\,dx + \\frac{1}{2} \\times \\frac{1}{2}
      = \\frac{3}{8} + \\frac{1}{4} =$ <b>$\\frac{5}{8}$</b>: the right to one redraw is worth an
      extra eighth.</p>`,
  },

  /* ==== SECOND SET ======================================================== */

  /* ---- Level 1 -------------------------------------------------------------- */

  {
    id: "two-rolls-one-number",
    category: "expected value",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a die twice to build a two-digit number. After the first roll you must
      decide whether it is the tens digit or the units digit; the second roll then fills the other
      place. You want the number to be as large as possible on average. How do you play, and what
      is the expected value?`,
    hint: `Fix the first roll $r$. What is the number worth, on average, if $r$ goes in the tens place? And in the units place?`,
    hints: [
      `Fix the first roll $r$. What is the number worth, on average, if $r$ goes in the tens place? And in the units place?`,
      `Tens: $10r + 3.5$. Units: $35 + r$.`,
    ],
    shortAnswer: `Put a 4, 5 or 6 in the tens place and a 1, 2 or 3 in the units place. Expected value 45.25.`,
    solution: `<p>Say the first roll is $r$. In the tens place the number averages $10r + 3.5$;
      in the units place it averages $35 + r$. Tens is better when $9r > 31.5$, that is for
      $r = 4, 5, 6$.</p>
      <p>So the six first rolls are worth $36, 37, 38$ (units) and $43.5, 53.5, 63.5$ (tens), which
      average $\\frac{271.5}{6} =$ <b>45.25</b>.</p>`,
    interview: {
      level: 1,
      followUp: "three-rolls-one-number",
      twist: `Now three rolls and a three-digit number, each roll placed as soon as you see it.
      Where do you put a first roll of 3? And what is the game worth?`,
    },
  },
  {
    id: "three-rolls-one-number",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a die three times to build a three-digit number. Each roll must be put
      into one of the empty places — hundreds, tens or units — before the next roll. Playing to
      make the number as large as possible on average, where should the first roll go, and what is
      the game worth?`,
    hint: `Once one place is filled you are in a two-place game. Work out what each of the three possible two-place games is worth.`,
    hints: [
      `Once one place is filled you are in a two-place game. Work out what each of the three possible two-place games is worth.`,
      `Hundreds and tens left: 452.5. Hundreds and units left: 427.75. Tens and units left: 45.25.`,
      `For a first roll $r$, compare $100r + 45.25$, $10r + 427.75$ and $r + 452.5$.`,
    ],
    shortAnswer: `A first roll of 1 or 2 goes in the units, 3 or 4 in the tens, 5 or 6 in the hundreds. The game is worth 504.`,
    solution: `<p>With two places left you put a 4, 5 or 6 in the bigger place. That makes
      tens-and-units worth 45.25, hundreds-and-tens worth ten times that, 452.5, and
      hundreds-and-units worth 427.75.</p>
      <p>A first roll $r$ is then worth $100r + 45.25$ in the hundreds, $10r + 427.75$ in the tens
      or $r + 452.5$ in the units. The best choices are units for 1 and 2 (453.5, 454.5), tens for
      3 and 4 (457.75, 467.75) and hundreds for 5 and 6 (545.25, 645.25).</p>
      <p>Those six values average $\\frac{3024}{6} =$ <b>504</b>. The middle rolls go in the middle
      place: a 3 is too small to spend the hundreds on and too big to throw away in the units.</p>`,
  },

  {
    id: "ten-metres-behind-the-line",
    category: "logic",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Ann beats Bob by 10 metres in a 100-metre race. They race again, this time with Ann
      starting 10 metres behind the start line and Bob on it. Both run at the same steady speeds as
      before. Who wins, and by how much?`,
    hint: `How far does Bob run in the time it takes Ann to run 100 metres? What does that make the ratio of their speeds?`,
    hints: [
      `How far does Bob run in the time it takes Ann to run 100 metres? What does that make the ratio of their speeds?`,
      `Ann now has 110 metres to run. In the time she takes, Bob covers 90% of that.`,
    ],
    shortAnswer: `Ann wins again, by 1 metre.`,
    solution: `<p>In the first race Bob had run 90 metres when Ann finished, so he runs at 90% of
      her speed.</p>
      <p>In the second race Ann runs 110 metres. In that time Bob covers $0.9 \\times 110 = 99$
      metres, so he is still <b>1 metre short</b> when she finishes. It is not a dead heat: they
      draw level 10 metres from the finish, and the faster runner wins from there.</p>`,
    interview: {
      level: 1,
      followUp: "start-for-a-dead-heat",
      twist: `How far behind the line would Ann have to start for a dead heat?`,
    },
  },
  {
    id: "start-for-a-dead-heat",
    category: "logic",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Ann beats Bob by 10 metres in a 100-metre race, both running at steady speeds. In
      a rematch over the same course Bob starts on the line. How far behind the line must Ann
      start for the two to finish exactly level?`,
    hint: `Bob needs the time it takes him to run 100 metres. How far does Ann run in that time?`,
    hints: [
      `Bob needs the time it takes him to run 100 metres. How far does Ann run in that time?`,
      `Ann covers $\\frac{10}{9}$ of whatever Bob covers.`,
    ],
    shortAnswer: `$\\frac{100}{9} \\approx 11.1$ metres.`,
    solution: `<p>Bob runs 90 metres while Ann runs 100, so Ann covers $\\frac{10}{9}$ of Bob's
      distance in any given time.</p>
      <p>While Bob runs his 100 metres Ann runs $\\frac{1000}{9} \\approx 111.1$ metres, so she must
      start $\\frac{100}{9} \\approx$ <b>11.1 metres</b> back. Giving her the 10 metres she won by is
      not quite enough of a handicap.</p>`,
  },

  {
    id: "two-urns-twenty-balls",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have 10 white balls, 10 black balls and two urns. You must put every ball in
      an urn, however you like, leaving neither urn empty. An urn is then chosen at random and a
      ball drawn at random from it. How do you arrange the balls to make a white ball as likely as
      possible, and what is that probability?`,
    hint: `An urn with nothing in it but white gives white for certain, however few balls it holds.`,
    hints: [
      `An urn with nothing in it but white gives white for certain, however few balls it holds.`,
      `Put a single white ball in one urn. What does the other urn give you?`,
    ],
    shortAnswer: `One white ball alone in one urn and everything else in the other: $\\frac{14}{19} \\approx 0.74$.`,
    solution: `<p>Put one white ball on its own in the first urn, and the other 9 white and 10
      black in the second. The first urn gives white for certain; the second gives white with
      probability $\\frac{9}{19}$.</p>
      <p>Overall $\\frac{1}{2} \\times 1 + \\frac{1}{2} \\times \\frac{9}{19} =$ <b>$\\frac{14}{19}$</b>,
      about 0.74. No arrangement does better: half your chance is already certain, and the other
      urn is as white as the remaining balls allow.</p>`,
    interview: {
      level: 1,
      followUp: "three-urns-twenty-balls",
      twist: `Now there is a third urn, and the same 20 balls. What is the best you can do?`,
    },
  },
  {
    id: "three-urns-twenty-balls",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have 10 white balls, 10 black balls and three urns. Every ball must go in an
      urn and no urn may be left empty. An urn is chosen at random and a ball drawn at random from
      it. What is the largest probability of drawing a white ball that you can arrange?`,
    hint: `A single white ball in an urn makes that urn certain. Can you do that more than once?`,
    hints: [
      `A single white ball in an urn makes that urn certain. Can you do that more than once?`,
      `Two urns hold one white ball each. The third holds 8 white and 10 black.`,
    ],
    shortAnswer: `$\\frac{22}{27} \\approx 0.81$: one white ball alone in each of two urns, and the rest in the third.`,
    solution: `<p>Make two urns certain by putting a single white ball in each. The third urn then
      holds 8 white and 10 black, and gives white with probability $\\frac{8}{18} = \\frac{4}{9}$.</p>
      <p>Overall $\\frac{1}{3}\\left(1 + 1 + \\frac{4}{9}\\right) =$ <b>$\\frac{22}{27}$</b>, about
      0.81.</p>`,
  },

  {
    id: "two-friends-two-teams",
    category: "combinatorics",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Six people, two of whom are friends, are split at random into two teams of three.
      What is the probability that the two friends are on the same team?`,
    hint: `Put one friend in a team. How many places are left, and how many of them are in that same team?`,
    hints: [
      `Put one friend in a team. How many places are left, and how many of them are in that same team?`,
    ],
    shortAnswer: `$\\frac{2}{5}$.`,
    solution: `<p>Seat the first friend anywhere. Five places remain, and two of them are in the
      first friend's team.</p>
      <p>So the second friend joins them with probability <b>$\\frac{2}{5}$</b> — less than a
      half, because the first friend has already used up one of the places in their own team.</p>`,
    interview: {
      level: 1,
      followUp: "three-friends-two-teams",
      twist: `Suppose three of the six are friends. What is the chance that all three land on the
      same team?`,
    },
  },
  {
    id: "three-friends-two-teams",
    category: "combinatorics",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Six people, three of whom are friends, are split at random into two teams of
      three. What is the probability that all three friends are on the same team?`,
    hint: `Place the friends one at a time.`,
    hints: [
      `Place the friends one at a time.`,
      `The second friend joins the first with probability $\\frac{2}{5}$. After that, one place is left in their team out of the four remaining.`,
    ],
    shortAnswer: `$\\frac{1}{10}$.`,
    solution: `<p>The second friend joins the first with probability $\\frac{2}{5}$. The third then
      needs the single remaining place in that team, out of four places left: $\\frac{1}{4}$.</p>
      <p>$\\frac{2}{5} \\times \\frac{1}{4} =$ <b>$\\frac{1}{10}$</b>. As a count: there are 10 ways to
      split six people into two teams of three, and exactly one has the three friends as a team.</p>`,
  },

  {
    id: "four-shoes-no-pair",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A cupboard holds five different pairs of shoes, ten shoes in all. You take four
      shoes at random. What is the probability that no two of them make a pair?`,
    hint: `Take the shoes one at a time. After the first, how many of the remaining nine are safe?`,
    hints: [
      `Take the shoes one at a time. After the first, how many of the remaining nine are safe?`,
      `The chances are $\\frac{8}{9}$, then $\\frac{6}{8}$, then $\\frac{4}{7}$.`,
    ],
    shortAnswer: `$\\frac{8}{21} \\approx 0.38$.`,
    solution: `<p>The first shoe is free. The second must avoid its partner: 8 of the 9 left. The
      third must avoid two partners: 6 of 8. The fourth must avoid three: 4 of 7.</p>
      <p>$\\frac{8}{9} \\times \\frac{6}{8} \\times \\frac{4}{7} =$ <b>$\\frac{8}{21}$</b>, about 0.38.
      As a count: choose which four pairs are represented and one shoe from each,
      $5 \\times 2^4 = 80$, out of $\\binom{10}{4} = 210$ hands.</p>`,
    interview: {
      level: 1,
      followUp: "pairs-among-four-shoes",
      twist: `On average, how many complete pairs are among your four shoes?`,
    },
  },
  {
    id: "pairs-among-four-shoes",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A cupboard holds five different pairs of shoes. You take four shoes at random.
      What is the expected number of complete pairs among the four?`,
    hint: `Do not work out the whole distribution. Take one particular pair: how likely is it that both of its shoes are in your hand?`,
    hints: [
      `Do not work out the whole distribution. Take one particular pair: how likely is it that both of its shoes are in your hand?`,
      `Or count from the hand: four shoes contain 6 pairs of shoes, and any two given shoes match with probability $\\frac{1}{9}$.`,
    ],
    shortAnswer: `$\\frac{2}{3}$.`,
    solution: `<p>Your four shoes contain $\\binom{4}{2} = 6$ different twosomes. Any two shoes
      taken from the cupboard are a matching pair with probability $\\frac{1}{9}$, since a shoe has
      one partner among the other nine.</p>
      <p>Expected values add even when the events overlap, so the answer is
      $6 \\times \\frac{1}{9} =$ <b>$\\frac{2}{3}$</b>.</p>`,
  },

  {
    id: "three-switches-one-visit",
    category: "logic",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Outside a windowless room are three switches. Exactly one of them works the single
      old-fashioned light bulb inside; the door is shut and no light shows from outside. You may
      set the switches however you like, for as long as you like, but you may go into the room
      only once. How do you find out which switch works the bulb?`,
    hint: `Looking at the bulb gives two outcomes, and you need three. What else can a bulb tell you?`,
    hints: [
      `Looking at the bulb gives two outcomes, and you need three. What else can a bulb tell you?`,
      `A bulb that has been on for a while is hot.`,
    ],
    shortAnswer: `Switch the first on for a few minutes, switch it off, switch the second on and go in. Lit: the second. Dark but warm: the first. Dark and cold: the third.`,
    solution: `<p>Turn the first switch on and wait a few minutes. Turn it off, turn the second
      on, and go straight in.</p>
      <p>If the bulb is lit, the second switch works it. If it is dark but warm, it was on a moment
      ago: the first. If it is dark and cold, it was never on: <b>the third</b>. Sight alone gives
      two answers; touch supplies the third.</p>`,
    interview: {
      level: 1,
      followUp: "four-switches-one-visit",
      twist: `Same room, but now there are four switches. Can it still be done in one visit?`,
    },
  },
  {
    id: "four-switches-one-visit",
    category: "logic",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Outside a windowless room are four switches, exactly one of which works the single
      old-fashioned light bulb inside. You may set the switches however you like, for as long as
      you like, but may go into the room only once. How can you tell which switch works the bulb?`,
    hint: `With three switches you used three states of the bulb: lit, dark and warm, dark and cold. Is there a fourth?`,
    hints: [
      `With three switches you used three states of the bulb: lit, dark and warm, dark and cold. Is there a fourth?`,
      `A bulb can be lit and still cold, if it has only just come on.`,
    ],
    shortAnswer: `Yes. Switch the first two on for a few minutes, then switch the second off and the third on, and go straight in. Lit and hot: the first. Lit but cold: the third. Dark but warm: the second. Dark and cold: the fourth.`,
    solution: `<p>A bulb has four distinguishable states: lit and hot, lit but cold, dark but
      warm, dark and cold. Arrange for each switch to produce a different one.</p>
      <p>Turn the first and second switches on and wait a few minutes. Then turn the second off,
      turn the third on, and go straight in. Lit and hot means the first switch; lit but still cold
      means the third, only just turned on; dark but warm means the second; dark and cold means
      <b>the fourth</b>, never touched.</p>`,
  },

  /* ---- Level 2 -------------------------------------------------------------- */

  {
    id: "one-test-flip",
    category: "conditional",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two coins look identical. One lands heads 60% of the time and the other 40%, and
      you do not know which is which. You will choose one coin and flip it once, winning £1 if it
      lands heads. Before that you are allowed one free test flip of either coin. How do you use
      it, and what is your chance of winning?`,
    hint: `Test either coin. If it shows heads, how likely is it to be the 60% coin?`,
    hints: [
      `Test either coin. If it shows heads, how likely is it to be the 60% coin?`,
      `After a head the tested coin is the good one with probability 0.6. Bet on it, and work out the chance that it lands heads again.`,
    ],
    shortAnswer: `Test either coin; bet on it if it shows heads, and on the other coin if it shows tails. You win 52% of the time.`,
    solution: `<p>Test one coin. If it lands heads, the chance it is the 60% coin is
      $\\frac{0.5 \\times 0.6}{0.5} = 0.6$. Betting on it wins with probability
      $0.6 \\times 0.6 + 0.4 \\times 0.4 = 0.52$.</p>
      <p>If it lands tails, the other coin is the good one with probability 0.6, and betting on
      that wins 0.52 in the same way. So the answer is <b>52%</b> either way: one flip moves you
      from 50–50 to 60–40 on which coin is which, and that is worth two points.</p>`,
    interview: {
      level: 2,
      followUp: "second-test-flip",
      twist: `I offer you a second free test flip, of whichever coin you like. How much does it add
      to your chance?`,
    },
  },
  {
    id: "second-test-flip",
    category: "conditional",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two coins look identical: one lands heads 60% of the time, the other 40%, and you
      do not know which is which. You may make two free test flips, each of whichever coin you
      choose, and then pick one coin to flip for a £1 prize if it lands heads. With one test flip
      your chance of winning is 52%. What is it with two?`,
    hint: `Try testing the same coin twice. What do you believe after two heads? After a head and a tail?`,
    hints: [
      `Try testing the same coin twice. What do you believe after two heads? After a head and a tail?`,
      `Two tests that disagree leave you back at 50–50. Two that agree make you surer than one test would. Average the two cases.`,
    ],
    shortAnswer: `Still 52%: the second test adds nothing. (A third does: three tests give 52.96%.)`,
    solution: `<p>Test the same coin twice. With probability $0.5 \\times 0.36 + 0.5 \\times 0.16
      = 0.26$ it shows two heads; it is then the good coin with probability $\\frac{9}{13}$, and
      betting on it wins $\\frac{9}{13} \\times 0.6 + \\frac{4}{13} \\times 0.4 = \\frac{7}{13}$. Two
      tails, also 0.26, is the mirror image. With probability 0.48 the tests disagree and you are
      back to a coin toss.</p>
      <p>$0.52 \\times \\frac{7}{13} + 0.48 \\times \\frac{1}{2} = 0.28 + 0.24 =$ <b>0.52</b>, exactly
      as with one test. Testing each coin once, or choosing the second test after seeing the first,
      does no better. An even number of votes can tie, and the ties cancel what the agreements
      gain; a third test breaks them and lifts the chance to 52.96%.</p>`,
  },

  {
    id: "eight-sided-duel",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and I each roll a fair eight-sided die, hidden from the other; the higher
      number wins the pot and a tie splits it. You alone may look at your roll and, if you wish,
      roll again once — but then you must keep the second roll. What is your best strategy, and
      what share of the pot do you expect?`,
    hint: `Suppose you end up holding the number $v$. What share of the pot do you expect?`,
    hints: [
      `Suppose you end up holding the number $v$. What share of the pot do you expect?`,
      `It is $\\frac{2v - 1}{16}$, which goes up in equal steps with $v$. So you simply want your final number to be as large as possible on average.`,
    ],
    shortAnswer: `Roll again on a 4 or lower. You expect $\\frac{5}{8}$ of the pot.`,
    solution: `<p>Holding $v$, you beat $v - 1$ of my eight numbers and tie with one, so you
      expect $\\frac{v - 1}{8} + \\frac{1}{16} = \\frac{2v - 1}{16}$ of the pot. That is a straight
      line in $v$, so the best plan is the one that maximises your average final number.</p>
      <p>A fresh roll averages 4.5, so keep 5 to 8 and reroll 1 to 4. Your final number averages
      $\\frac{5 + 6 + 7 + 8}{8} + \\frac{1}{2} \\times 4.5 = 5.5$, and your share is
      $\\frac{2 \\times 5.5 - 1}{16} =$ <b>$\\frac{5}{8}$</b>.</p>`,
    interview: {
      level: 2,
      followUp: "eight-sided-duel-face-up",
      twist: `Now suppose my roll is face up, so you can see it before deciding whether to roll
      again. What share do you expect?`,
    },
  },
  {
    id: "eight-sided-duel-face-up",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and I each roll a fair eight-sided die; the higher number wins the pot and a
      tie splits it. Both rolls are face up. You may then roll again once, in which case your
      second roll stands. What share of the pot do you expect?`,
    hint: `If you are ahead, keep. If you are behind, you have nothing to lose by rolling. The only real decision is a tie.`,
    hints: [
      `If you are ahead, keep. If you are behind, you have nothing to lose by rolling. The only real decision is a tie.`,
      `Rolling again against my number $u$ is worth $\\frac{17 - 2u}{16}$ of the pot. Compare that with the half you hold when tied.`,
    ],
    shortAnswer: `$\\frac{167}{256} \\approx 0.65$. Roll again whenever you are behind, and when tied on 4 or lower.`,
    solution: `<p>Rolling again against my $u$ wins on $8 - u$ numbers and ties on one, worth
      $\\frac{8 - u}{8} + \\frac{1}{16} = \\frac{17 - 2u}{16}$. Ahead, you keep (worth 1). Behind, you
      roll. Tied, you hold a half, and rolling is better when $17 - 2u > 8$: on a tie at 4 or
      lower.</p>
      <p>Add up over the 64 equally likely pairs of rolls. Ahead, 28 pairs: 28. Tied at 1 to 4:
      $\\frac{15 + 13 + 11 + 9}{16} = 3$. Tied at 5 to 8: $4 \\times \\frac{1}{2} = 2$. Behind:
      $\\frac{1 \\cdot 13 + 2 \\cdot 11 + 3 \\cdot 9 + 4 \\cdot 7 + 5 \\cdot 5 + 6 \\cdot 3 + 7 \\cdot 1}{16} = \\frac{140}{16} = 8.75$.</p>
      <p>Total $\\frac{41.75}{64} =$ <b>$\\frac{167}{256}$</b>, about 0.65 — a little more than the
      $\\frac{5}{8}$ you get when my roll is hidden.</p>`,
  },

  {
    id: "coins-in-a-row",
    category: "logic",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Six coins of various values are laid in a row, face up. You and an opponent take
      turns, and on each turn a player takes one coin from either end of the row. You move first.
      Show that, whatever the values, you can always collect at least as much as your opponent.`,
    hint: `Number the coins 1 to 6. You can take coin 1 or coin 6. Which positions are then at the two ends for your opponent?`,
    hints: [
      `Number the coins 1 to 6. You can take coin 1 or coin 6. Which positions are then at the two ends for your opponent?`,
      `If you take coin 1, both ends (2 and 6) are even-numbered. Whichever your opponent takes, an odd-numbered coin is uncovered for you.`,
    ],
    shortAnswer: `Add up the coins in positions 1, 3, 5 and those in positions 2, 4, 6. You can take every coin of whichever set is worth more, because after each of your picks both ends of the row belong to the other set.`,
    solution: `<p>Number the positions 1 to 6 and compare the total of the odd positions with the
      total of the even ones. Suppose the odd set is worth at least as much. Take coin 1. Both ends
      are now even-numbered, so your opponent must take an even coin, and doing so uncovers an odd
      one. Take it, and the ends are both even again.</p>
      <p>Carrying on, you collect coins 1, 3 and 5 and your opponent is left with 2, 4 and 6. If
      the even set is the richer one, start with coin 6 and do the same. Either way you get the
      better of the two sets, so <b>at least half the money</b>. (This needs an even number of
      coins.)</p>`,
    interview: {
      level: 2,
      followUp: "coins-in-a-row-best-play",
      twist: `The row is 5, 3, 7, 10, 1, 4. That plan guarantees you 17 of the 30. Can you do
      better?`,
    },
  },
  {
    id: "coins-in-a-row-best-play",
    category: "logic",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Six coins worth 5, 3, 7, 10, 1 and 4 lie in a row, in that order. Two players take
      turns removing one coin from either end, and both play as well as possible. How much does
      the first player collect?`,
    hint: `Taking the even-numbered positions (3, 10 and 4) guarantees 17. To beat that you need to get the 10 more cheaply.`,
    hints: [
      `Taking the even-numbered positions (3, 10 and 4) guarantees 17. To beat that you need to get the 10 more cheaply.`,
      `Try opening with the 5. Whichever end your opponent takes next, look at who ends up able to reach the 10.`,
    ],
    shortAnswer: `18 of the 30. Open with the 5, not the 4.`,
    solution: `<p>Opening with the 4 and collecting positions 2, 4 and 6 gives $3 + 10 + 4 = 17$.
      Opening with the 5 does better.</p>
      <p>After the 5, the row is 3, 7, 10, 1, 4. Your opponent's best reply is the 4, leaving
      3, 7, 10, 1. You take the 3. Now the row is 7, 10, 1, and whichever end they take uncovers
      the 10 for you. You finish with $5 + 3 + 10 =$ <b>18</b> to their 12. (If they reply with
      the 3 instead of the 4, they do worse still and end on 11.)</p>
      <p>The odd-and-even plan is a guarantee, not the best line: it only ever promises half.</p>`,
  },

  {
    id: "mark-on-a-stick",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A stick one metre long has a mark a quarter of the way along it. The stick is
      snapped at a point chosen uniformly at random. What is the expected length of the piece that
      carries the mark?`,
    hint: `Split on which side of the mark the break falls.`,
    hints: [
      `Split on which side of the mark the break falls.`,
      `If the break is at distance $u$ from the near end, beyond the mark, the marked piece has length $u$. If it is before the mark, the marked piece has length $1 - u$.`,
    ],
    shortAnswer: `$\\frac{11}{16}$ of a metre, about 69 cm.`,
    solution: `<p>Measure from the end nearer the mark, and let the break be at $u$. If
      $u > \\frac{1}{4}$ the marked piece is the one of length $u$; if $u < \\frac{1}{4}$ it is the
      one of length $1 - u$.</p>
      <p>$\\int_{1/4}^{1} u\\,du + \\int_{0}^{1/4} (1 - u)\\,du = \\frac{15}{32} + \\frac{7}{32} =$
      <b>$\\frac{11}{16}$</b>. It is more than half a metre because a fixed point is more likely to
      sit in the longer piece.</p>`,
    interview: {
      level: 2,
      followUp: "best-place-for-the-mark",
      twist: `Where would you put the mark to make that expected length as large as possible, and
      how large is it then?`,
    },
  },
  {
    id: "best-place-for-the-mark",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A one-metre stick will be snapped at a uniformly random point. Beforehand you may
      put a mark anywhere on it. Where should the mark go to make the expected length of the piece
      carrying it as large as possible, and what is that expected length?`,
    hint: `With the mark at distance $a$ from one end, the expected length works out as $\\frac{1}{2} + a - a^2$.`,
    hints: [
      `With the mark at distance $a$ from one end, the expected length works out as $\\frac{1}{2} + a - a^2$.`,
      `Or with no algebra: where can you put a mark so that it is always in the longer piece?`,
    ],
    shortAnswer: `In the middle. The marked piece is then 75 cm long on average.`,
    solution: `<p>A mark in the middle is always in the longer piece, and nothing can beat the
      longer piece. The longer piece of a stick snapped at random is uniform between
      $\\frac{1}{2}$ and 1, so it averages <b>$\\frac{3}{4}$</b> of a metre.</p>
      <p>In general, a mark at distance $a$ from one end gives $\\frac{1}{2} + a - a^2$, which is
      largest at $a = \\frac{1}{2}$.</p>`,
  },

  {
    id: "one-pound-into-eight",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have £1 and need £8. You can bet any amount you hold, as often as you like, at
      even money on the flip of a fair coin. What is the largest probability of reaching £8 that
      any way of betting can give you?`,
    hint: `Every bet is fair. What does that tell you about your expected wealth at the end, however you bet?`,
    hints: [
      `Every bet is fair. What does that tell you about your expected wealth at the end, however you bet?`,
      `Suppose you finish with £8 with probability $p$ and with nothing otherwise. Then your expected final wealth is $8p$.`,
    ],
    shortAnswer: `$\\frac{1}{8}$. Staking everything three times running achieves it.`,
    solution: `<p>Each bet is fair, so however you choose your stakes your expected wealth stays
      at £1. If you reach £8 with probability $p$, your expected final wealth is at least $8p$,
      so $p \\le \\frac{1}{8}$.</p>
      <p>Staking everything three times, £1 to £2 to £4 to £8, succeeds with probability
      $\\left(\\frac{1}{2}\\right)^3 =$ <b>$\\frac{1}{8}$</b>, so the bound is reached. With a fair
      coin, cleverness in sizing the bets buys nothing.</p>`,
    interview: {
      level: 2,
      followUp: "one-pound-into-eight-with-an-edge",
      twist: `Now the coin lands your way 60% of the time. Is staking everything three times still
      the best you can do?`,
    },
  },
  {
    id: "one-pound-into-eight-with-an-edge",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have £1 and need £8. You can bet any amount you hold, as often as you like, at
      even money on a coin that lands your way 60% of the time. Staking everything three times in
      a row reaches £8 with probability 0.216. Roughly how high can a better way of betting push
      that probability?`,
    hint: `With the odds in your favour you want as many bets as possible, not as few.`,
    hints: [
      `With the odds in your favour you want as many bets as possible, not as few.`,
      `Betting a small fixed stake $s$ each time, the chance of going broke from £1 is about $\\left(\\frac{2}{3}\\right)^{1/s}$.`,
    ],
    shortAnswer: `As close to 1 as you like. Betting 10p at a time already gets there about 98% of the time, and smaller stakes do better still.`,
    solution: `<p>With an edge, every bet has positive expected value, so you want many small
      bets: the average wins out and the risk of ruin shrinks.</p>
      <p>For a fixed stake, the gambler's-ruin formula gives the chance of reaching £8 before £0
      as $\\frac{1 - (2/3)^{k}}{1 - (2/3)^{n}}$, where you hold $k$ stakes and need $n$. Betting £1
      at a time ($k = 1$, $n = 8$) gives about 0.35, already better than the 0.216 from going
      all-in. Betting 10p at a time ($k = 10$, $n = 80$) gives about <b>0.98</b>, and as the stake
      shrinks the probability tends to 1.</p>
      <p>The lesson is the opposite of the fair-coin case: bold play is right when the game is
      against you or fair, and timid play when it is in your favour.</p>`,
  },

  {
    id: "three-dice-on-your-number",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You stake £1 on a number from 1 to 6, and three dice are rolled. If your number
      shows on one, two or three of the dice you get your stake back plus £1, £2 or £3. If it does
      not show at all you lose the stake. What is your expected profit per game?`,
    hint: `Work out the chance that your number shows on none, one, two or all three of the dice.`,
    hints: [
      `Work out the chance that your number shows on none, one, two or all three of the dice.`,
      `Out of 216 equally likely rolls, your number shows on no dice in 125, on one in 75, on two in 15 and on all three in 1.`,
    ],
    shortAnswer: `A loss of $\\frac{17}{216}$ of a pound: about 8p a game.`,
    solution: `<p>Of the $6^3 = 216$ rolls, $5^3 = 125$ miss your number entirely,
      $3 \\times 25 = 75$ show it once, $3 \\times 5 = 15$ show it twice and 1 shows it three
      times.</p>
      <p>Expected profit: $\\frac{-125 + 75 + 2 \\times 15 + 3 \\times 1}{216} = -\\frac{17}{216}$,
      a loss of about <b>8p</b>. Three dice and six numbers sounds like an even chance, but your
      number appears at all in only 91 rolls out of 216, and the bigger payouts do not make up
      the difference.</p>`,
    interview: {
      level: 2,
      followUp: "fair-payout-for-a-triple",
      twist: `The house offers to pay more when your number shows on all three dice. What would
      that payout have to be for the game to be fair?`,
    },
  },
  {
    id: "fair-payout-for-a-triple",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You stake £1 on a number from 1 to 6 and three dice are rolled. Your number on
      exactly one die wins £1, and on exactly two wins £2, with your stake returned; if it shows
      on none you lose the stake. How much must the game pay, on top of returning your stake, when
      your number shows on all three dice, for the game to be exactly fair?`,
    hint: `Only one roll in 216 is a triple of your number. How far short is the game without it?`,
    hints: [
      `Only one roll in 216 is a triple of your number. How far short is the game without it?`,
      `Leaving the triple aside, the other 215 rolls add up to $-125 + 75 + 30 = -20$.`,
    ],
    shortAnswer: `£20.`,
    solution: `<p>Over the 216 equally likely rolls, the misses cost 125, the singles win 75 and
      the doubles win $15 \\times 2 = 30$: a total of $-20$ before the triple is counted.</p>
      <p>The one triple has to make up all of that, so it must pay <b>£20</b>.</p>`,
  },

  /* ---- Level 3 -------------------------------------------------------------- */

  {
    id: "paid-one-over-the-flips",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You flip a fair coin until the first head appears. If that takes $N$ flips you
      are paid £$\\frac{1}{N}$: £1 for a head first time, 50p if it takes two flips, and so on.
      Estimate the value of the game to the nearest penny.`,
    hint: `Write the expected value as a sum and add up the first few terms.`,
    hints: [
      `Write the expected value as a sum and add up the first few terms.`,
      `$\\frac{1}{2} + \\frac{1}{8} + \\frac{1}{24} + \\frac{1}{64} + \\frac{1}{160} + \\dots$ The terms shrink quickly.`,
      `Exactly: $\\sum \\frac{x^n}{n} = -\\ln(1 - x)$, with $x = \\frac{1}{2}$.`,
    ],
    shortAnswer: `About 69p. Exactly, it is $\\ln 2 \\approx 0.693$.`,
    solution: `<p>The first head comes on flip $n$ with probability $\\frac{1}{2^n}$, so the game
      is worth $\\sum \\frac{1}{n \\, 2^n} = \\frac{1}{2} + \\frac{1}{8} + \\frac{1}{24} + \\frac{1}{64}
      + \\frac{1}{160} + \\dots$</p>
      <p>Five terms give 0.689, and what remains is less than the last term, so the answer is
      about <b>69p</b>. Exactly: $\\sum \\frac{x^n}{n} = -\\ln(1 - x)$, which at $x = \\frac{1}{2}$ is
      $\\ln 2 \\approx 0.693$.</p>`,
    interview: {
      level: 3,
      followUp: "paid-the-flips-squared",
      twist: `Now I pay you £$N^2$ instead. What is that game worth?`,
    },
  },
  {
    id: "paid-the-flips-squared",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You flip a fair coin until the first head appears, and if that takes $N$ flips you
      are paid £$N^2$. What is the game worth?`,
    hint: `You know the average of $N$. What is its variance?`,
    hints: [
      `You know the average of $N$. What is its variance?`,
      `For the number of tries up to a first success of probability $p$, the mean is $\\frac{1}{p}$ and the variance is $\\frac{1 - p}{p^2}$.`,
    ],
    shortAnswer: `£6.`,
    solution: `<p>$N$ has mean $\\frac{1}{p} = 2$ and variance $\\frac{1 - p}{p^2} = 2$. Since
      $E[N^2]$ is the variance plus the square of the mean, it is $2 + 4 =$ <b>6</b>.</p>
      <p>Or by first-step reasoning: with probability $\\frac{1}{2}$ you stop at $N = 1$, and
      otherwise you are back at the start with one flip already spent, so
      $E[N^2] = \\frac{1}{2} + \\frac{1}{2}\\,E[(N + 1)^2] = \\frac{1}{2} + \\frac{1}{2}\\left(E[N^2] + 4 + 1\\right)$,
      which gives 6.</p>`,
  },

  {
    id: "jumping-along-ten-squares",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A counter starts on square 0 of a row of squares numbered 0 to 10. On each move it
      jumps to one of the squares ahead of it, each equally likely: from square 0 it lands on any
      of 1 to 10, from square 7 on any of 8, 9 or 10. What is the expected number of moves it
      takes to reach square 10?`,
    hint: `Try a short row first: squares 0 to 1, then 0 to 2, then 0 to 3.`,
    hints: [
      `Try a short row first: squares 0 to 1, then 0 to 2, then 0 to 3.`,
      `The number of moves is the number of squares the counter lands on. For each square, ask how likely it is to be landed on at all.`,
      `The counter lands on square 9 with probability $\\frac{1}{2}$, on square 8 with probability $\\frac{1}{3}$, and so on down.`,
    ],
    shortAnswer: `$1 + \\frac{1}{2} + \\frac{1}{3} + \\dots + \\frac{1}{10} \\approx 2.93$.`,
    solution: `<p>Each move lands on a new square, so the number of moves is the number of
      squares from 1 to 10 that the counter lands on, and its expected value is the sum of the
      chances of landing on each.</p>
      <p>Take square $k$ and watch for the first time the counter lands anywhere from $k$ to 10.
      It has just jumped from below $k$, so those $11 - k$ squares were all equally likely: it
      lands on square $k$ with probability $\\frac{1}{11 - k}$.</p>
      <p>Adding over $k = 1, \\dots, 10$ gives $\\frac{1}{10} + \\frac{1}{9} + \\dots + \\frac{1}{2} + 1
      = \\frac{7381}{2520} \\approx$ <b>2.93</b>. Ten squares, but fewer than three moves.</p>`,
    interview: {
      level: 3,
      followUp: "landing-on-square-five",
      twist: `What is the probability that the counter lands on square 5 along the way?`,
    },
  },
  {
    id: "landing-on-square-five",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A counter starts on square 0 of a row of squares numbered 0 to 10. On each move it
      jumps to one of the squares ahead of it, each equally likely, until it reaches square 10.
      What is the probability that it lands on square 5 at some point?`,
    hint: `Watch for the first moment the counter lands anywhere from square 5 to square 10.`,
    hints: [
      `Watch for the first moment the counter lands anywhere from square 5 to square 10.`,
      `At that moment it has just jumped from below square 5, and every square ahead of it was equally likely.`,
    ],
    shortAnswer: `$\\frac{1}{6}$.`,
    solution: `<p>Sooner or later the counter makes a jump that takes it from below square 5 to
      one of the squares 5, 6, 7, 8, 9, 10. From wherever it jumped, all the squares ahead were
      equally likely, so in particular these six were.</p>
      <p>It lands on square 5 exactly when that jump picks 5: probability <b>$\\frac{1}{6}$</b>.
      Where it had been before makes no difference.</p>`,
  },

  {
    id: "point-before-a-seven",
    category: "probability",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `In a dice game you roll two dice. A total of 7 or 11 on the first roll wins at
      once, and 2, 3 or 12 loses at once. Any other total becomes your “point”: you keep rolling
      until you roll the point again, and win, or roll a 7, and lose. What is the probability
      that you win?`,
    hint: `On the first roll there are 8 ways in 36 to win at once. Then take the points in pairs: 4 and 10, 5 and 9, 6 and 8.`,
    hints: [
      `On the first roll there are 8 ways in 36 to win at once. Then take the points in pairs: 4 and 10, 5 and 9, 6 and 8.`,
      `Once a point is set, only the point and 7 matter. With a point of 4 there are 3 ways to roll it against 6 ways to roll a 7, so you win $\\frac{3}{9}$ of the time.`,
      `A point of 5 or 9 wins $\\frac{4}{10}$; a point of 6 or 8 wins $\\frac{5}{11}$.`,
    ],
    shortAnswer: `$\\frac{244}{495} \\approx 0.493$, just under a half.`,
    solution: `<p>First roll: 7 or 11 comes up in $6 + 2 = 8$ of 36 ways, a win of
      $\\frac{2}{9}$ straight away.</p>
      <p>With a point set, ignore every roll that is neither the point nor a 7. A point of 4 (3
      ways) wins with probability $\\frac{3}{3 + 6}$; a point of 5 (4 ways) with
      $\\frac{4}{4 + 6}$; a point of 6 (5 ways) with $\\frac{5}{5 + 6}$; and 10, 9, 8 mirror them.
      So the points contribute
      $2\\left(\\frac{3}{36} \\cdot \\frac{3}{9} + \\frac{4}{36} \\cdot \\frac{4}{10} + \\frac{5}{36} \\cdot \\frac{5}{11}\\right)
      = 2\\left(\\frac{1}{36} + \\frac{2}{45} + \\frac{25}{396}\\right)$.</p>
      <p>Altogether $\\frac{2}{9} + \\frac{134}{495} =$ <b>$\\frac{244}{495}$</b>, about 0.493: very
      nearly fair, and slightly against you.</p>`,
    interview: {
      level: 3,
      followUp: "won-on-the-first-roll",
      twist: `You hear that a player won. What is the probability that they won on the very first
      roll?`,
    },
  },
  {
    id: "won-on-the-first-roll",
    category: "conditional",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `In a dice game you roll two dice. A total of 7 or 11 on the first roll wins at
      once, and 2, 3 or 12 loses at once. Any other total becomes your “point”, and you roll until
      you get the point again (a win) or a 7 (a loss). The overall chance of winning is
      $\\frac{244}{495}$. Given that a player won, what is the probability that they won on the
      first roll?`,
    hint: `This is a conditional probability: wins on the first roll as a share of all wins.`,
    hints: [
      `This is a conditional probability: wins on the first roll as a share of all wins.`,
      `A first-roll win has probability $\\frac{8}{36} = \\frac{2}{9}$.`,
    ],
    shortAnswer: `$\\frac{55}{122} \\approx 0.45$.`,
    solution: `<p>A first-roll win (7 or 11) has probability $\\frac{8}{36} = \\frac{2}{9}$, and
      every such game is a win.</p>
      <p>So the share of wins that came on the first roll is
      $\\frac{2/9}{244/495} = \\frac{2}{9} \\times \\frac{495}{244} = \\frac{110}{244} =$
      <b>$\\frac{55}{122}$</b>, about 0.45. Slightly more than half of all wins are made the long
      way, through a point.</p>`,
  },

  {
    id: "higher-or-lower-than-the-other",
    category: "logic",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `I write two different numbers on two slips of paper — any real numbers I like.
      You pick a slip at random and read it, and must then say whether the number on the other
      slip is higher or lower. Is there a strategy that is right more than half the time,
      whatever I wrote?`,
    hint: `A fixed rule such as “say higher if my number is negative” is certainly right whenever my two numbers are on opposite sides of zero. What goes wrong the rest of the time?`,
    hints: [
      `A fixed rule such as “say higher if my number is negative” is certainly right whenever my two numbers are on opposite sides of zero. What goes wrong the rest of the time?`,
      `Choose the dividing line at random, afresh each time, so that it has some chance of falling between my two numbers wherever they are.`,
    ],
    shortAnswer: `Yes. Draw a random number $T$ of your own from a distribution that can land anywhere (a normal, say), and say “higher” exactly when the slip you read is below $T$. If $T$ falls between my two numbers you are certainly right; otherwise you are right half the time.`,
    solution: `<p>Before looking, draw a threshold $T$ from any distribution that puts some
      probability on every interval, such as a normal. Say “the other is higher” if the number you
      read is below $T$, and “lower” if it is above.</p>
      <p>If $T$ lands below both my numbers you always say “lower”, and are right exactly when you
      happened to pick the larger slip: half the time. The same goes if $T$ lands above both. But
      if $T$ lands between them you are right whichever slip you picked.</p>
      <p>So you are right with probability $\\frac{1}{2} + \\frac{1}{2}\\,P(T \\text{ lands between})$,
      which is <b>more than a half</b> for any two different numbers — though by how much depends
      on my numbers, and I can make it as little as I please.</p>`,
    interview: {
      level: 3,
      followUp: "higher-or-lower-two-uniforms",
      twist: `Now suppose you know that my two numbers were drawn independently and uniformly
      between 0 and 1. What is your best rule, and how often is it right?`,
    },
  },
  {
    id: "higher-or-lower-two-uniforms",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two numbers are drawn independently and uniformly between 0 and 1. You are shown
      one of them and must say whether the other is higher or lower. What is the best rule, and
      how often is it right?`,
    hint: `If the number you see is $x$, the other one is higher with probability $1 - x$.`,
    hints: [
      `If the number you see is $x$, the other one is higher with probability $1 - x$.`,
      `So the best guess is right with probability $\\max(x,\\ 1 - x)$. Average that over $x$.`,
    ],
    shortAnswer: `Say “higher” if the number you see is below $\\frac{1}{2}$ and “lower” if it is above. Right $\\frac{3}{4}$ of the time.`,
    solution: `<p>Seeing $x$, the other number is higher with probability $1 - x$ and lower with
      probability $x$. Guess whichever is more likely: “higher” when $x < \\frac{1}{2}$.</p>
      <p>You are then right with probability $\\max(x, 1 - x)$, which is uniform between
      $\\frac{1}{2}$ and 1 and so averages <b>$\\frac{3}{4}$</b>.</p>`,
  },

  {
    id: "three-couples-in-a-row",
    category: "combinatorics",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three couples sit down in a row of six seats in a random order. What is the
      probability that nobody is sitting next to their own partner?`,
    hint: `Count the arrangements in which at least one couple sits together, and correct for the overlaps.`,
    hints: [
      `Count the arrangements in which at least one couple sits together, and correct for the overlaps.`,
      `Glue a couple into a single block. A given couple sits together in $2 \\times 5!$ arrangements; two given couples in $2^2 \\times 4!$; all three in $2^3 \\times 3!$.`,
      `$720 - 3 \\times 240 + 3 \\times 96 - 48$.`,
    ],
    shortAnswer: `$\\frac{1}{3}$.`,
    solution: `<p>There are $6! = 720$ arrangements. Treating a couple as a block that can face
      either way, a given couple is together in $2 \\times 5! = 240$ of them, two given couples in
      $4 \\times 4! = 96$, and all three in $8 \\times 3! = 48$.</p>
      <p>By inclusion and exclusion the number with no couple together is
      $720 - 3 \\times 240 + 3 \\times 96 - 48 = 240$, so the probability is
      $\\frac{240}{720} =$ <b>$\\frac{1}{3}$</b>.</p>`,
    interview: {
      level: 3,
      followUp: "three-couples-round-a-table",
      twist: `And if the six sit round a circular table instead?`,
    },
  },
  {
    id: "three-couples-round-a-table",
    category: "combinatorics",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three couples sit down at a round table with six seats, in a random order. What is
      the probability that nobody is sitting next to their own partner?`,
    hint: `Fix one person's seat to take out the rotations: that leaves $5! = 120$ arrangements.`,
    hints: [
      `Fix one person's seat to take out the rotations: that leaves $5! = 120$ arrangements.`,
      `Glue couples into blocks as you would for a row: $2 \\times 4!$ for one given couple, $2^2 \\times 3!$ for two, $2^3 \\times 2!$ for all three.`,
    ],
    shortAnswer: `$\\frac{4}{15} \\approx 0.27$.`,
    solution: `<p>Fix one person's seat, leaving $5! = 120$ arrangements. With a couple glued
      into a block there are five things round the table: a given couple is together in
      $2 \\times 4! = 48$ arrangements, two given couples in $4 \\times 3! = 24$, and all three in
      $8 \\times 2! = 16$.</p>
      <p>$120 - 3 \\times 48 + 3 \\times 24 - 16 = 32$, so the probability is
      $\\frac{32}{120} =$ <b>$\\frac{4}{15}$</b>, about 0.27. It is lower than the $\\frac{1}{3}$ for
      a row because a round table has no end seats: everyone has two neighbours.</p>`,
  },

  {
    id: "three-hats-guess-or-pass",
    category: "logic",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three players each have a red or a blue hat put on their head, decided by
      independent fair coin flips. Each sees the other two hats but not their own. At the same
      moment, each must either guess the colour of their own hat or pass. The team wins if at
      least one player guesses and nobody guesses wrongly. They may agree a plan beforehand but
      cannot communicate afterwards. How often can they win?`,
    hint: `One player guessing while the other two pass wins half the time. To beat that, the wrong guesses have to be made to pile up in the same deals.`,
    hints: [
      `One player guessing while the other two pass wins half the time. To beat that, the wrong guesses have to be made to pile up in the same deals.`,
      `Six of the eight possible deals have two hats of one colour and one of the other. What does the odd one out see?`,
    ],
    shortAnswer: `$\\frac{3}{4}$. Anyone who sees two hats of the same colour guesses the other colour; anyone who sees one of each passes. The team loses only when all three hats match.`,
    solution: `<p>The plan: if you see two hats of the same colour, guess the opposite colour; if
      you see one of each, pass.</p>
      <p>In the six deals with a two-to-one split, the odd one out sees two matching hats and
      guesses correctly, while the other two each see one of each colour and pass: a win. In the
      two deals where all three hats match, all three players guess, and all three are wrong.</p>
      <p>So the team wins <b>$\\frac{3}{4}$</b> of the time. Each player's guesses are still right
      only half the time; the plan arranges for the wrong guesses to be wasted together.</p>`,
    interview: {
      level: 3,
      followUp: "three-hats-no-better-plan",
      twist: `Could a cleverer plan beat three-quarters?`,
    },
  },
  {
    id: "three-hats-no-better-plan",
    category: "logic",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three players each wear a red or blue hat chosen by a fair coin flip, see the
      others' hats but not their own, and at the same moment either guess their own colour or
      pass. The team wins if somebody guesses and nobody guesses wrongly. One plan is known to win
      $\\frac{3}{4}$ of the time. Show that no plan can do better.`,
    hint: `Fix one player and what they can see. If their plan says to guess, how often is that guess right?`,
    hints: [
      `Fix one player and what they can see. If their plan says to guess, how often is that guess right?`,
      `Over all eight deals, the team makes as many wrong guesses as right ones. How many wrong guesses can a single deal hold?`,
    ],
    shortAnswer: `No plan can. Each player's guesses are right in exactly as many deals as they are wrong, so across the team right and wrong guesses balance. A winning deal needs at least one right guess, and a losing deal can hold at most three wrong ones, so there is at least one losing deal for every three winning ones.`,
    solution: `<p>Take one player and one thing they might see. Two of the eight deals look like
      that to them, differing only in their own hat. If their plan says to guess, the guess is
      right in one of the two and wrong in the other. So for every player, right guesses and
      wrong guesses occur in equal numbers of deals.</p>
      <p>Across the whole team, then, the total number of right guesses over the eight deals
      equals the total number of wrong ones. Every winning deal contains at least one right guess
      and no wrong ones. A losing deal contains at most three wrong guesses.</p>
      <p>So if $W$ deals are won and $L$ are lost, $W \\le 3L$, and with $W + L = 8$ that means
      $W \\le 6$: <b>three-quarters is the most any plan can win</b>.</p>`,
  },

  /* ==== THIRD SET ========================================================= */

  /* ---- Level 1 -------------------------------------------------------------- */

  {
    id: "sum-or-product",
    category: "expected value",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two dice are about to be rolled. You will be paid, in pounds, either their sum or
      their product, and you must say which before the roll. Which do you choose, and what is it
      worth?`,
    hint: `The two dice are independent. What is the expected value of a product of two independent numbers?`,
    hints: [
      `The two dice are independent. What is the expected value of a product of two independent numbers?`,
    ],
    shortAnswer: `The product: £12.25, against £7 for the sum.`,
    solution: `<p>The sum averages $3.5 + 3.5 = 7$. The dice are independent, so the product
      averages $3.5 \\times 3.5 = 12.25$.</p>
      <p>Take <b>the product, worth £12.25</b>.</p>`,
    interview: {
      level: 1,
      followUp: "sum-or-product-after-the-roll",
      twist: `Now you may choose after seeing the dice. How much more is the game worth?`,
    },
  },
  {
    id: "sum-or-product-after-the-roll",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two dice are rolled and you are paid, in pounds, whichever is larger: their sum or
      their product. What is the game worth?`,
    hint: `The product alone is worth £12.25. For which rolls is the sum the bigger of the two?`,
    hints: [
      `The product alone is worth £12.25. For which rolls is the sum the bigger of the two?`,
      `Only when a 1 is showing, and then by exactly 1. That is 11 of the 36 rolls.`,
    ],
    shortAnswer: `$\\frac{113}{9} \\approx$ £12.56 — about 31p more than always taking the product.`,
    solution: `<p>With numbers $a$ and $b$, the sum beats the product only if one of them is a 1:
      then the sum is $b + 1$ and the product $b$, a gain of exactly 1. (At double 2 the two are
      equal.) Eleven of the 36 rolls contain a 1.</p>
      <p>So the game is worth the product's $12.25$ plus $\\frac{11}{36}$:
      $\\frac{441 + 11}{36} = \\frac{113}{9} \\approx$ <b>£12.56</b>.</p>`,
  },

  {
    id: "jury-with-a-coin",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A three-person jury decides by majority. Two of its members each reach the right
      verdict with probability 0.8, independently; the third flips a coin. A one-person jury is a
      single juror who is right with probability 0.8. Which jury is more likely to reach the
      right verdict?`,
    hint: `The coin only matters when the two serious jurors disagree.`,
    hints: [
      `The coin only matters when the two serious jurors disagree.`,
      `Both right: 0.64. They disagree: 0.32, and then the coin sides with the right one half the time.`,
    ],
    shortAnswer: `Neither. Both are right 80% of the time.`,
    solution: `<p>If the two serious jurors agree, the coin is outvoted. They are both right with
      probability $0.8^2 = 0.64$. They disagree with probability $2 \\times 0.8 \\times 0.2 = 0.32$,
      and then the coin picks the right side half the time: $0.16$.</p>
      <p>$0.64 + 0.16 = 0.8$, <b>exactly the same</b> as the single juror. That is true whatever
      the jurors' accuracy $p$: $p^2 + p(1 - p) = p$.</p>`,
    interview: {
      level: 1,
      followUp: "three-serious-jurors",
      twist: `The coin-flipper is replaced by a third juror as good as the other two. How often is
      the jury right now?`,
    },
  },
  {
    id: "three-serious-jurors",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A three-person jury decides by majority, and each member independently reaches the
      right verdict with probability 0.8. How often is the jury right?`,
    hint: `The jury is right when all three are right, or exactly two are.`,
    hints: [
      `The jury is right when all three are right, or exactly two are.`,
      `All three: $0.8^3$. Exactly two: three ways, each $0.8 \\times 0.8 \\times 0.2$.`,
    ],
    shortAnswer: `89.6% of the time.`,
    solution: `<p>All three right: $0.8^3 = 0.512$. Exactly two right: $3 \\times 0.8^2 \\times 0.2
      = 0.384$.</p>
      <p>$0.512 + 0.384 =$ <b>0.896</b>. Three independent 80% jurors beat one, where a jury of two
      plus a coin-flipper only matched it.</p>`,
  },

  {
    id: "fair-choice-from-a-biased-coin",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have one coin, and it is biased: it lands heads with some fixed probability
      that you do not know. How can you use it to make a fair 50–50 choice? And if the coin in
      fact lands heads one time in three, how many flips does your method take on average?`,
    hint: `A single flip is biased. Is there a pair of outcomes from two flips that must be equally likely, whatever the bias?`,
    hints: [
      `A single flip is biased. Is there a pair of outcomes from two flips that must be equally likely, whatever the bias?`,
      `Head-then-tail and tail-then-head each have probability $p(1 - p)$.`,
    ],
    shortAnswer: `Flip twice. Head–tail means one choice, tail–head the other, and two the same means start again. With a one-in-three coin that takes 4.5 flips on average.`,
    solution: `<p>Flip the coin twice. Head-then-tail has probability $p(1 - p)$ and
      tail-then-head has probability $(1 - p)p$: the same, whatever $p$ is. So let those two
      outcomes stand for the two choices, and if both flips match, throw them away and repeat.</p>
      <p>With $p = \\frac{1}{3}$ a pair settles it with probability $2 \\times \\frac{1}{3} \\times
      \\frac{2}{3} = \\frac{4}{9}$, so you need $\\frac{9}{4}$ pairs on average:
      <b>4.5 flips</b>.</p>`,
    interview: {
      level: 1,
      followUp: "one-third-from-a-fair-coin",
      twist: `Now the reverse. You have a fair coin and want something that happens with probability
      exactly one-third. How, and how many flips does it take on average?`,
    },
  },
  {
    id: "one-third-from-a-fair-coin",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Using only a fair coin, describe a way to produce an event that has probability
      exactly $\\frac{1}{3}$, and find the average number of flips your method uses.`,
    hint: `Find three equally likely outcomes and call one of them yes.`,
    hints: [
      `Find three equally likely outcomes and call one of them yes.`,
      `Two flips give four equally likely outcomes. Throw one of them away.`,
    ],
    shortAnswer: `Flip twice: two heads means yes, one of each means no, two tails means start again. That is yes $\\frac{1}{3}$ of the time and takes $\\frac{8}{3}$ flips on average. (A sharper method needs only 2.)`,
    solution: `<p>Flip twice. Call two heads “yes”, head–tail and tail–head “no”, and on two
      tails start again. The three outcomes you keep are equally likely, so yes has probability
      <b>$\\frac{1}{3}$</b>. A pair is kept with probability $\\frac{3}{4}$, so you need
      $\\frac{4}{3}$ pairs on average: $\\frac{8}{3}$ flips.</p>
      <p>A sharper method: flip until the first head, and say yes if it came on an even-numbered
      flip. That has probability $\\frac{1}{4} + \\frac{1}{16} + \\frac{1}{64} + \\dots = \\frac{1}{3}$
      and takes only 2 flips on average. Either answer is right; what matters is that the event
      has probability exactly one-third and you can say how long it takes.</p>`,
  },

  {
    id: "cars-in-twenty-minutes",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `On a quiet road the chance of seeing at least one car in any 20-minute spell is
      $\\frac{609}{625}$. Traffic is equally likely at all times, and what happens in one spell
      tells you nothing about another. What is the chance of seeing at least one car in 5
      minutes?`,
    hint: `Work with the chance of seeing no car at all.`,
    hints: [
      `Work with the chance of seeing no car at all.`,
      `No car in 20 minutes means no car in each of four separate 5-minute spells, and $1 - \\frac{609}{625} = \\frac{16}{625}$.`,
    ],
    shortAnswer: `$\\frac{3}{5}$.`,
    solution: `<p>The chance of no car in 20 minutes is $1 - \\frac{609}{625} = \\frac{16}{625}$.
      Twenty minutes is four independent 5-minute spells, so if $q$ is the chance of no car in 5
      minutes, $q^4 = \\frac{16}{625}$ and $q = \\frac{2}{5}$.</p>
      <p>The chance of at least one car in 5 minutes is $1 - \\frac{2}{5} =$
      <b>$\\frac{3}{5}$</b>.</p>`,
    interview: {
      level: 1,
      followUp: "cars-in-ten-minutes",
      twist: `And in 10 minutes?`,
    },
  },
  {
    id: "cars-in-ten-minutes",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `On a quiet road the chance of seeing at least one car in any 20-minute spell is
      $\\frac{609}{625}$, with traffic equally likely at all times and separate spells independent.
      What is the chance of seeing at least one car in 10 minutes?`,
    hint: `No car in 20 minutes means no car in each of two separate 10-minute spells.`,
    hints: [
      `No car in 20 minutes means no car in each of two separate 10-minute spells.`,
      `$\\frac{16}{625}$ is the square of the chance of no car in 10 minutes.`,
    ],
    shortAnswer: `$\\frac{21}{25}$.`,
    solution: `<p>No car in 20 minutes has probability $\\frac{16}{625}$, which is the square of
      the chance of no car in 10 minutes. That chance is therefore $\\frac{4}{25}$.</p>
      <p>So at least one car in 10 minutes has probability $1 - \\frac{4}{25} =$
      <b>$\\frac{21}{25}$</b>.</p>`,
  },

  {
    id: "nine-minutes-from-two-timers",
    category: "logic",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have two sand timers: one runs for 4 minutes and the other for 7. How can you
      time exactly 9 minutes?`,
    hint: `Start both together. Which moments can you mark, as one or the other runs out?`,
    hints: [
      `Start both together. Which moments can you mark, as one or the other runs out?`,
      `Turn each timer over when it runs out. At 8 minutes the 7-minute timer has been running for exactly one minute since you turned it. What if you turn it back?`,
    ],
    shortAnswer: `Start both. Turn the 4 over when it runs out, at 4 minutes, and the 7 over when it runs out, at 7. When the 4 runs out again, at 8, turn the 7 back over: it has one minute of sand to give back, and runs out at 9.`,
    solution: `<p>Start both timers. At 4 minutes the small one runs out: turn it over. At 7 the
      large one runs out: turn it over.</p>
      <p>At 8 the small one runs out for the second time. The large one has been running for one
      minute since it was turned, so one minute's worth of sand lies in its lower half. Turn it
      back over and that sand runs through in one minute, finishing at <b>9 minutes</b>.</p>`,
    interview: {
      level: 1,
      followUp: "ten-minutes-from-two-timers",
      twist: `And exactly 10 minutes, with the same two timers?`,
    },
  },
  {
    id: "ten-minutes-from-two-timers",
    category: "logic",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You have two sand timers: one runs for 4 minutes and the other for 7. How can you
      time exactly 10 minutes?`,
    hint: `10 is 7 and 3. Where can you find 3 minutes?`,
    hints: [
      `10 is 7 and 3. Where can you find 3 minutes?`,
      `Start both and turn the 4 over when it runs out. When the 7 runs out, how long has the 4 been running?`,
    ],
    shortAnswer: `Start both and turn the 4 over at 4 minutes. When the 7 runs out, turn the 4 over again: it has been running for 3 minutes, gives those 3 minutes back, and runs out at 10.`,
    solution: `<p>Start both timers and turn the small one over when it runs out at 4 minutes.
      When the large one runs out at 7, the small one has been running for 3 minutes, so 3
      minutes' worth of sand lies in its lower half.</p>
      <p>Turn the small one over at that moment. The 3 minutes of sand run back through and it
      empties at <b>10 minutes</b>.</p>`,
  },

  {
    id: "sock-drawer-even-chance",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A drawer holds red socks and blue socks, at least one of each. If you pull out two
      at random, the chance that they match is exactly one half. What is the smallest number of
      socks the drawer could hold?`,
    hint: `Try the small cases: two socks, then three, then four.`,
    hints: [
      `Try the small cases: two socks, then three, then four.`,
      `With three of one colour and one of the other, how many of the six possible pairs match?`,
    ],
    shortAnswer: `Four: three of one colour and one of the other.`,
    solution: `<p>One of each: the pair never matches. Two and one: one matching pair out of
      three. Two and two: two matching pairs out of six. Three and one: the three socks of one
      colour make $\\binom{3}{2} = 3$ matching pairs out of $\\binom{4}{2} = 6$.</p>
      <p>So the smallest drawer has <b>four socks</b>, split three and one.</p>`,
    interview: {
      level: 1,
      followUp: "next-sock-drawer",
      twist: `What is the next size of drawer for which the chance is exactly one half?`,
    },
  },
  {
    id: "next-sock-drawer",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A drawer holds red and blue socks, and two pulled out at random match with
      probability exactly one half. Three of one colour and one of the other is the smallest such
      drawer. What is the next smallest?`,
    hint: `With $r$ red and $b$ blue, there are $rb$ mixed pairs. They must be half of all $\\binom{r + b}{2}$ pairs.`,
    hints: [
      `With $r$ red and $b$ blue, there are $rb$ mixed pairs. They must be half of all $\\binom{r + b}{2}$ pairs.`,
      `That condition simplifies to $(r - b)^2 = r + b$, so the total number of socks is a perfect square.`,
    ],
    shortAnswer: `Nine socks: six of one colour and three of the other. (Then sixteen, as ten and six: the total is always a perfect square.)`,
    solution: `<p>Half the pairs must be mixed: $rb = \\frac{1}{2}\\binom{r + b}{2}$, that is
      $4rb = (r + b)(r + b - 1)$, which rearranges to $(r - b)^2 = r + b$. So the total is a
      perfect square, and the two colours differ by its square root.</p>
      <p>A total of 4 gives 3 and 1. A total of 9 gives <b>6 and 3</b>: $15 + 3 = 18$ matching
      pairs out of 36. After that comes 16, as 10 and 6.</p>`,
  },

  /* ---- Level 2 -------------------------------------------------------------- */

  {
    id: "two-wins-in-a-row",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `To win a prize you must win two games in a row out of three, played alternately
      against a strong opponent and a weak one. You beat the strong one 40% of the time and the
      weak one 80%. You may choose the order: strong–weak–strong or weak–strong–weak. Which do
      you choose, and what is your chance of the prize?`,
    hint: `Whichever order you pick, there is one game you cannot afford to lose.`,
    hints: [
      `Whichever order you pick, there is one game you cannot afford to lose.`,
      `You must win the middle game, and at least one of the other two.`,
    ],
    shortAnswer: `Strong–weak–strong: 51.2%, against 38.4% the other way round.`,
    solution: `<p>Two wins in a row out of three always include the middle game. So you need the
      middle game and at least one of the outer two.</p>
      <p>Strong–weak–strong: $0.8 \\times (1 - 0.6^2) = 0.8 \\times 0.64 =$ <b>0.512</b>.<br>
      Weak–strong–weak: $0.4 \\times (1 - 0.2^2) = 0.4 \\times 0.96 = 0.384$.</p>
      <p>Play the strong opponent twice. It means more hard games, but the one game you must win
      is the easy one, and you get two attempts at the hard one.</p>`,
    interview: {
      level: 2,
      followUp: "any-two-of-three-games",
      twist: `The rule changes: you now need to win any two of the three games, not two in a row.
      Does your choice change?`,
    },
  },
  {
    id: "any-two-of-three-games",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You play three games, alternately against a strong opponent whom you beat 40% of
      the time and a weak one whom you beat 80% of the time, and win a prize if you win at least
      two of the three. You may choose the order: strong–weak–strong or weak–strong–weak. Which
      do you choose, and what is your chance?`,
    hint: `No game is special any more. You simply want as many easy games as possible.`,
    hints: [
      `No game is special any more. You simply want as many easy games as possible.`,
      `Weak–strong–weak: add up the chances of winning all three, and of each way of winning exactly two.`,
    ],
    shortAnswer: `Weak–strong–weak: 76.8%, against 54.4% the other way round.`,
    solution: `<p>With no need for the wins to be consecutive, you want to meet the weak opponent
      twice.</p>
      <p>Weak–strong–weak: win both weak games, $0.8^2 = 0.64$; or win exactly one weak game and
      the strong one, $2 \\times 0.8 \\times 0.2 \\times 0.4 = 0.128$. Total <b>0.768</b>.<br>
      Strong–weak–strong: both strong games, $0.4^2 = 0.16$; or exactly one strong game and the
      weak one, $2 \\times 0.4 \\times 0.6 \\times 0.8 = 0.384$. Total $0.544$.</p>`,
  },

  {
    id: "last-ball-in-the-bag",
    category: "logic",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A bag holds 20 blue balls and 13 red ones, and you have a pile of spare balls
      beside it. You repeatedly take two balls out of the bag at random. If they are the same
      colour you put one blue ball into the bag; if they are different you put one red ball in.
      Each step leaves the bag one ball smaller. What colour is the last ball?`,
    hint: `There are three kinds of step: two reds, two blues, one of each. Follow the number of red balls through each.`,
    hints: [
      `There are three kinds of step: two reds, two blues, one of each. Follow the number of red balls through each.`,
      `The number of red balls in the bag either stays the same or goes down by two.`,
    ],
    shortAnswer: `Red, for certain.`,
    solution: `<p>Two reds out, a blue in: the bag loses two reds. Two blues out, a blue in: the
      reds are untouched. One of each out, a red in: the reds are untouched again.</p>
      <p>So the number of red balls only ever changes by two, and it starts odd, at 13. It can
      never reach zero, so when one ball is left it is <b>red</b> — whatever the luck of the
      draws.</p>`,
    interview: {
      level: 2,
      followUp: "last-ball-rule-reversed",
      twist: `Swap the rule: two of the same colour puts a red ball in, two different puts a blue
      ball in. Same starting bag. What can you say about the last ball now?`,
    },
  },
  {
    id: "last-ball-rule-reversed",
    category: "logic",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A bag holds 20 blue balls and 13 red ones. You repeatedly take out two balls at
      random: if they are the same colour you put one red ball into the bag from a spare pile, and
      if they are different you put one blue ball in. What colour is the last ball left?`,
    hint: `This time follow the number of blue balls through each of the three kinds of step.`,
    hints: [
      `This time follow the number of blue balls through each of the three kinds of step.`,
      `Two blues out removes two blues. One of each out, a blue in: no change. Two reds out: no change.`,
    ],
    shortAnswer: `Red again — this time because the number of blue balls stays even.`,
    solution: `<p>Two blues out, a red in: the bag loses two blues. Two reds out, a red in: the
      blues are untouched. One of each out, a blue in: the blues are untouched.</p>
      <p>The number of blue balls changes only by two and starts even, at 20, so it is never 1. A
      single remaining ball therefore cannot be blue: it is <b>red</b>. Here the red count is no
      help — it goes up and down by one — and the thing that never changes is the blue count's
      parity.</p>`,
  },

  {
    id: "an-ace-for-every-player",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A standard deck is dealt out to four players, thirteen cards each. What is the
      probability that every player has exactly one ace?`,
    hint: `Place the aces one at a time. The first can go anywhere; where can the second go?`,
    hints: [
      `Place the aces one at a time. The first can go anywhere; where can the second go?`,
      `After the first ace, 51 places remain and 39 of them are in other hands. Then 26 of 50, then 13 of 49.`,
    ],
    shortAnswer: `$\\frac{2197}{20825} \\approx 0.105$, a little over 10%.`,
    solution: `<p>Think of the 52 places in the deal and drop the aces into them one by one. The
      first ace can go anywhere. The second must avoid that player's hand: 39 of the remaining 51
      places. The third must avoid two hands: 26 of 50. The fourth: 13 of 49.</p>
      <p>$\\frac{39}{51} \\times \\frac{26}{50} \\times \\frac{13}{49} = \\frac{2197}{20825} \\approx$
      <b>0.105</b>.</p>`,
    interview: {
      level: 2,
      followUp: "all-four-aces-in-one-hand",
      twist: `And the chance that one player holds all four aces?`,
    },
  },
  {
    id: "all-four-aces-in-one-hand",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A standard deck is dealt out to four players, thirteen cards each. What is the
      probability that one of the players holds all four aces?`,
    hint: `Place the first ace anywhere. The other three must land in the same hand.`,
    hints: [
      `Place the first ace anywhere. The other three must land in the same hand.`,
      `12 of the remaining 51 places, then 11 of 50, then 10 of 49.`,
    ],
    shortAnswer: `$\\frac{44}{4165} \\approx 0.011$, about 1 deal in 95.`,
    solution: `<p>Wherever the first ace lands, its hand has 12 other places out of the 51
      remaining. The second ace must take one of them, then the third one of 11 out of 50, then
      the fourth one of 10 out of 49.</p>
      <p>$\\frac{12}{51} \\times \\frac{11}{50} \\times \\frac{10}{49} = \\frac{44}{4165} \\approx$
      <b>0.011</b>. There is no need to multiply by four: the first ace has already chosen the
      player.</p>`,
  },

  {
    id: "three-dice-make-a-triangle",
    category: "combinatorics",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three dice are rolled. What is the probability that the three numbers could be the
      side lengths of a triangle — a real one, with some area?`,
    hint: `Count the failures: rolls where the largest number is at least the sum of the other two.`,
    hints: [
      `Count the failures: rolls where the largest number is at least the sum of the other two.`,
      `Sort the failures by their largest number. With largest 2 the only failure is 1, 1, 2. With largest 3: 1, 1, 3 and 1, 2, 3.`,
      `Counting orders, the failures number 3, 9, 18, 30 and 45 for a largest number of 2, 3, 4, 5 and 6.`,
    ],
    shortAnswer: `$\\frac{37}{72} \\approx 0.51$.`,
    solution: `<p>Three lengths make a triangle when the largest is less than the sum of the
      other two. It is easier to count the rolls that fail.</p>
      <p>With largest number 2 the failing sets are $\\{1, 1, 2\\}$: 3 orders. Largest 3:
      $\\{1, 1, 3\\}, \\{1, 2, 3\\}$: $3 + 6 = 9$. Largest 4: four sets, 18 orders. Largest 5: six
      sets, 30 orders. Largest 6: nine sets, 45 orders. Total $3 + 9 + 18 + 30 + 45 = 105$.</p>
      <p>So $216 - 105 = 111$ rolls work, and the probability is $\\frac{111}{216} =$
      <b>$\\frac{37}{72}$</b>, just over a half.</p>`,
    interview: {
      level: 2,
      followUp: "three-dice-right-angle",
      twist: `And the probability that they could be the sides of a right-angled triangle?`,
    },
  },
  {
    id: "three-dice-right-angle",
    category: "combinatorics",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three dice are rolled. What is the probability that the three numbers could be the
      side lengths of a right-angled triangle?`,
    hint: `Which sets of whole numbers from 1 to 6 satisfy $a^2 + b^2 = c^2$?`,
    hints: [
      `Which sets of whole numbers from 1 to 6 satisfy $a^2 + b^2 = c^2$?`,
      `Only 3, 4, 5. In how many orders can the dice show it?`,
    ],
    shortAnswer: `$\\frac{1}{36}$.`,
    solution: `<p>The squares available are 1, 4, 9, 16, 25, 36, and the only two that add up to
      a third are $9 + 16 = 25$. So the dice must show 3, 4 and 5.</p>
      <p>That can happen in $3! = 6$ orders out of 216: <b>$\\frac{1}{36}$</b>.</p>`,
  },

  {
    id: "hundred-tigers-one-sheep",
    category: "logic",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A hundred tigers and one sheep are put on an island with nothing else to eat. Any
      tiger may eat the sheep, but a tiger that does so turns into a sheep itself, and can then be
      eaten in turn. Every tiger is perfectly logical, would like to eat, but values its own
      survival above a meal. Is the sheep eaten?`,
    hint: `Start with one tiger, then two, then three.`,
    hints: [
      `Start with one tiger, then two, then three.`,
      `With two tigers, whichever eats becomes a sheep on an island with one tiger.`,
    ],
    shortAnswer: `No. With an even number of tigers nobody dares to eat; with an odd number one tiger eats and is then safe.`,
    solution: `<p>One tiger: it eats, and nothing is left to threaten it. Two tigers: whichever
      eats becomes a sheep facing a single tiger, and would be eaten, so neither does. Three
      tigers: one can eat safely, because that leaves two tigers and a sheep, where nobody eats.</p>
      <p>The pattern alternates: the sheep is eaten exactly when the number of tigers is odd,
      because eating is safe exactly when it leaves an even number behind. A hundred is even, so
      <b>the sheep is not eaten</b>.</p>`,
    interview: {
      level: 2,
      followUp: "one-more-tiger",
      twist: `A hundred-and-first tiger swims over to the island. What happens now?`,
    },
  },
  {
    id: "one-more-tiger",
    category: "logic",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A hundred and one tigers and one sheep are on an island with nothing else to eat.
      A tiger that eats the sheep turns into a sheep itself and can be eaten in turn. Every tiger
      is perfectly logical, would like to eat, but values survival above a meal. What happens?`,
    hint: `Work up from one tiger: when is it safe to eat?`,
    hints: [
      `Work up from one tiger: when is it safe to eat?`,
      `Eating is safe when it leaves an even number of tigers behind.`,
    ],
    shortAnswer: `One tiger eats the sheep at once and becomes a sheep. That leaves 100 tigers and one sheep, and nobody eats again.`,
    solution: `<p>With one tiger the sheep is eaten; with two it is not, because the eater would
      become prey; with three it is, because the eater is left among two tigers who dare not
      touch it. The sheep is eaten exactly when the number of tigers is odd.</p>
      <p>With 101, <b>one tiger eats</b> — whichever gets there first — and turns into a sheep.
      The island then holds 100 tigers and a sheep, an even number, and it stays that way.</p>`,
  },

  {
    id: "one-six-two-sixes-three-sixes",
    category: "probability",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Which is most likely: at least one six when 6 dice are rolled, at least two sixes
      when 12 are rolled, or at least three sixes when 18 are rolled?`,
    hint: `In each case you are asking for the average number of sixes or more. So averages will not separate them; you have to calculate.`,
    hints: [
      `In each case you are asking for the average number of sixes or more. So averages will not separate them; you have to calculate.`,
      `The first is $1 - \\left(\\frac{5}{6}\\right)^6$. The second is $1 - \\left(\\frac{5}{6}\\right)^{12} - 12 \\times \\frac{1}{6} \\times \\left(\\frac{5}{6}\\right)^{11}$.`,
      `$\\left(\\frac{5}{6}\\right)^6 \\approx 0.335$.`,
    ],
    shortAnswer: `At least one six with 6 dice: about 0.665, against 0.619 for two in 12 and 0.597 for three in 18.`,
    solution: `<p>One six in 6 dice: $1 - \\left(\\frac{5}{6}\\right)^6 \\approx 1 - 0.335 = 0.665$.</p>
      <p>Two in 12: take away the chances of none and of exactly one.
      $\\left(\\frac{5}{6}\\right)^{12} \\approx 0.112$ and $12 \\times \\frac{1}{6} \\times
      \\left(\\frac{5}{6}\\right)^{11} \\approx 0.269$, leaving $0.619$. Three in 18 works out at
      $0.597$.</p>
      <p>So <b>one six in 6 dice</b> is the most likely. Each asks for the average or better, and
      with few dice the count of sixes is lopsided: it cannot fall far below its average but can
      go well above, which pushes “average or better” past a half.</p>`,
    interview: {
      level: 2,
      followUp: "the-average-number-of-sixes-or-more",
      twist: `Carry the pattern on: at least $n$ sixes when $6n$ dice are rolled. What does the
      probability tend to as $n$ grows?`,
    },
  },
  {
    id: "the-average-number-of-sixes-or-more",
    category: "probability",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll $6n$ dice and ask for at least $n$ sixes — the average number, or more.
      For $n = 1$ the probability is about 0.665. What does it tend to as $n$ becomes large, and
      why?`,
    hint: `For large $n$, what shape does the distribution of the number of sixes take?`,
    hints: [
      `For large $n$, what shape does the distribution of the number of sixes take?`,
      `It becomes symmetric about its average, which is $n$.`,
    ],
    shortAnswer: `One half. With many dice the number of sixes is spread symmetrically about its average, so “the average or more” becomes an even chance. It comes down towards a half from above: 0.665, 0.619, 0.597, …`,
    solution: `<p>The number of sixes has average $n$, and for large $n$ its distribution is close
      to a normal curve centred there. Half of a symmetric curve lies at or above its centre, so
      the probability tends to <b>$\\frac{1}{2}$</b>.</p>
      <p>It approaches from above — 0.665, 0.619, 0.597 and so on — because for small $n$ the
      count is skewed, with its bulk sitting at or just above the average and a long thin tail
      beyond.</p>`,
  },

  /* ---- Level 3 -------------------------------------------------------------- */

  {
    id: "best-place-in-the-birthday-queue",
    category: "probability",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A cinema gives a free ticket to the first person in its queue whose birthday is
      the same as that of someone ahead of them. Birthdays are equally likely to be any of 365
      days. Which place in the queue gives you the best chance of the free ticket?`,
    hint: `To win in place $n$, the $n - 1$ people ahead of you must all have different birthdays, and yours must match one of them.`,
    hints: [
      `To win in place $n$, the $n - 1$ people ahead of you must all have different birthdays, and yours must match one of them.`,
      `Compare place $n + 1$ with place $n$. The ratio of the two chances is $\\frac{366 - n}{365} \\times \\frac{n}{n - 1}$.`,
      `That ratio is above 1 exactly while $n^2 - n < 365$.`,
    ],
    shortAnswer: `20th. Your chance there is about 3.2%.`,
    solution: `<p>In place $n$ you win if the $n - 1$ people ahead all differ and you match one of
      them: $P(n) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdots \\frac{367 - n}{365} \\times
      \\frac{n - 1}{365}$.</p>
      <p>Moving back one place multiplies this by $\\frac{366 - n}{365} \\times \\frac{n}{n - 1}$.
      That is more than 1 when $(366 - n)\\,n > 365\\,(n - 1)$, which simplifies to
      $n^2 - n < 365$. It holds up to $n = 19$ (342) and fails at $n = 20$ (380).</p>
      <p>So the chance rises as far as place 20 and falls after it: stand <b>20th</b>, where it
      is about 3.2%.</p>`,
    interview: {
      level: 3,
      followUp: "best-place-in-the-birth-month-queue",
      twist: `Suppose the offer were for a shared birth month instead, with twelve equally likely
      months. Where would you stand?`,
    },
  },
  {
    id: "best-place-in-the-birth-month-queue",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A cinema gives a free ticket to the first person in its queue who was born in the
      same month as someone ahead of them. The twelve months are equally likely. Which place in
      the queue gives the best chance of the free ticket?`,
    hint: `In place $n$ you need the $n - 1$ people ahead to have different months and yours to match one. Compare place $n + 1$ with place $n$.`,
    hints: [
      `In place $n$ you need the $n - 1$ people ahead to have different months and yours to match one. Compare place $n + 1$ with place $n$.`,
      `The ratio is $\\frac{13 - n}{12} \\times \\frac{n}{n - 1}$, which is above 1 while $n^2 - n < 12$.`,
    ],
    shortAnswer: `Fourth or fifth: the two are exactly equal, at $\\frac{55}{288} \\approx 19\\%$.`,
    solution: `<p>Moving from place $n$ to place $n + 1$ multiplies your chance by
      $\\frac{13 - n}{12} \\times \\frac{n}{n - 1}$, which is above 1 while $n^2 - n < 12$ and
      exactly 1 when $n^2 - n = 12$, that is at $n = 4$.</p>
      <p>So the chance rises to place 4, is the same in place 5, and falls after that:
      <b>fourth or fifth</b>, each with probability $\\frac{12 \\cdot 11 \\cdot 10}{12^3} \\times
      \\frac{3}{12} = \\frac{55}{288} \\approx 0.19$.</p>`,
  },

  {
    id: "red-sweets-run-out-first",
    category: "probability",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A jar holds 10 red, 20 blue and 30 green sweets, and you take them out one at a
      time at random. What is the probability that the red sweets are the first colour to run out
      — that when the last red is taken, at least one blue and at least one green are still in
      the jar?`,
    hint: `Think about the very last sweet out of the jar, and then about which of the other two colours finishes later.`,
    hints: [
      `Think about the very last sweet out of the jar, and then about which of the other two colours finishes later.`,
      `Red runs out first if the last sweet of all is green and the blues outlast the reds, or the last of all is blue and the greens outlast the reds.`,
      `The last sweet is green with probability $\\frac{30}{60}$. Leaving the greens aside, the last of the red and blue sweets is blue with probability $\\frac{20}{30}$.`,
    ],
    shortAnswer: `$\\frac{7}{12}$.`,
    solution: `<p>Look at it from the end. The colour that runs out last is the colour of the
      final sweet. Red runs out first in two ways.</p>
      <p>The final sweet is green, probability $\\frac{30}{60}$, and among the red and blue sweets
      alone the last one is blue, probability $\\frac{20}{30}$: together $\\frac{1}{3}$.<br>
      Or the final sweet is blue, probability $\\frac{20}{60}$, and among the red and green sweets
      the last is green, probability $\\frac{30}{40}$: together $\\frac{1}{4}$.</p>
      <p>$\\frac{1}{3} + \\frac{1}{4} =$ <b>$\\frac{7}{12}$</b>. The two steps multiply because where
      the greens fall says nothing about the order of the reds and blues among themselves.</p>`,
    interview: {
      level: 3,
      followUp: "sweets-left-when-the-reds-run-out",
      twist: `When the last red sweet comes out, how many sweets do you expect to be left in the
      jar?`,
    },
  },
  {
    id: "sweets-left-when-the-reds-run-out",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A jar holds 10 red, 20 blue and 30 green sweets, taken out one at a time at
      random. At the moment the last red sweet is taken, how many sweets do you expect to be left
      in the jar?`,
    hint: `Take one particular blue or green sweet. What is the chance that it is still in the jar when the last red comes out?`,
    hints: [
      `Take one particular blue or green sweet. What is the chance that it is still in the jar when the last red comes out?`,
      `Among that sweet and the ten reds, it has to be the last of the eleven.`,
    ],
    shortAnswer: `$\\frac{50}{11} \\approx 4.5$.`,
    solution: `<p>A given blue or green sweet is still in the jar exactly when it comes out after
      all ten reds. Among those eleven sweets every order is equally likely, so it is last with
      probability $\\frac{1}{11}$.</p>
      <p>There are 50 sweets that are not red, and expected values add:
      $50 \\times \\frac{1}{11} =$ <b>$\\frac{50}{11}$</b>, about 4.5.</p>`,
  },

  {
    id: "five-scientists-one-safe",
    category: "combinatorics",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Five scientists keep their work in a safe with several locks. They want any three
      of them to be able to open it together, but no two of them. A lock may have any number of
      keys. What is the smallest number of locks they need, and how many keys must each scientist
      carry?`,
    hint: `Take any two scientists. There must be at least one lock that neither of them can open.`,
    hints: [
      `Take any two scientists. There must be at least one lock that neither of them can open.`,
      `Can two different pairs be stopped by the same lock? Think about what happens when those two pairs get together.`,
    ],
    shortAnswer: `10 locks, and 6 keys each.`,
    solution: `<p>Every pair of scientists must be stopped by some lock that neither can open.
      Two different pairs cannot share that lock: together they are at least three people, who
      must be able to open everything. So there is a separate lock for each pair, at least
      $\\binom{5}{2} = 10$.</p>
      <p>Ten is enough: make one lock for each pair and give its key to the other three. Any three
      scientists include someone outside each pair, so they open every lock; any two are stopped
      by their own lock.</p>
      <p>Each scientist holds the keys for the pairs they are not in: $\\binom{4}{2} = 6$. So
      <b>10 locks and 6 keys each</b>.</p>`,
    interview: {
      level: 3,
      followUp: "eleven-pirates-one-chest",
      twist: `Eleven pirates want the same for their treasure chest: any six can open it, but no
      five. How many locks, and how many keys each?`,
    },
  },
  {
    id: "eleven-pirates-one-chest",
    category: "combinatorics",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Eleven pirates lock their treasure in a chest with several locks, arranged so
      that any six of them can open it together but no five can. What is the smallest number of
      locks, and how many keys does each pirate carry?`,
    hint: `Every group of five must be stopped by a lock none of them can open, and no two groups of five can share that lock.`,
    hints: [
      `Every group of five must be stopped by a lock none of them can open, and no two groups of five can share that lock.`,
      `One lock for each group of five, with keys for the other six pirates.`,
    ],
    shortAnswer: `462 locks, and 252 keys each.`,
    solution: `<p>Each group of five pirates needs a lock that none of the five can open. Two
      different groups of five together contain at least six pirates, who must open everything, so
      no lock can serve two groups. That makes $\\binom{11}{5} =$ <b>462 locks</b>, each with keys
      held by the six pirates outside its group.</p>
      <p>A pirate holds a key for every group of five that leaves them out:
      $\\binom{10}{5} =$ <b>252 keys</b>.</p>`,
  },

  {
    id: "hedging-a-best-of-five",
    category: "market making",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two teams play a best-of-five series. You want to back one of them so that you
      finish exactly £100 up if it wins the series and exactly £100 down if it loses. But you can
      only bet on single games, one at a time, at even money, choosing each stake as you go. How
      much do you bet on the first game?`,
    hint: `Work backwards from two games all, where the last game decides everything and you must be level going into it.`,
    hints: [
      `Work backwards from two games all, where the last game decides everything and you must be level going into it.`,
      `Write down what you need to be holding at each score. At any score it is the average of the two scores that can follow, and your stake is half the gap between them.`,
      `At 2–2 you hold nothing and stake £100. At 2–1 up you must hold £50 and stake £50. At 2–0 up you must hold £75.`,
    ],
    shortAnswer: `£37.50.`,
    solution: `<p>Let $N$ be what you must be holding at each score. At the end $N$ is $+100$ or
      $-100$. Before that, a stake $s$ must take you from $N$ to the right amount either way, so
      $N$ is the average of the two amounts that can follow and $s$ is half their difference.</p>
      <p>At 2–2: $N = 0$, stake 100. At 2–1: $N = \\frac{100 + 0}{2} = 50$. At 2–0:
      $N = \\frac{100 + 50}{2} = 75$. At 1–1: $N = 0$ by symmetry. At 1–0:
      $N = \\frac{75 + 0}{2} = 37.5$, and at 0–1 it is $-37.5$.</p>
      <p>So the first stake is $\\frac{37.5 - (-37.5)}{2} =$ <b>£37.50</b>. You are rebuilding a
      bet on the whole series out of bets on its games.</p>`,
    interview: {
      level: 3,
      followUp: "hedging-a-best-of-seven",
      twist: `And for a best-of-seven series?`,
    },
  },
  {
    id: "hedging-a-best-of-seven",
    category: "market making",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Two teams play a best-of-seven series. You want to finish exactly £100 up if your
      team wins the series and exactly £100 down if it loses, but you can only bet on single
      games, one at a time, at even money. How much do you bet on the first game?`,
    hint: `What you must hold at any score is £100 times (the chance of winning the series from there minus the chance of losing it), treating every game as a coin flip.`,
    hints: [
      `What you must hold at any score is £100 times (the chance of winning the series from there minus the chance of losing it), treating every game as a coin flip.`,
      `After winning the first game, a team wins a best-of-seven between equals with probability $\\frac{42}{64}$.`,
    ],
    shortAnswer: `£31.25.`,
    solution: `<p>Work backwards as for a shorter series: what you must hold at any score is the
      average of what you must hold after a win and after a loss. That makes it
      $100 \\times (2p - 1)$, where $p$ is the chance of winning the series from that score if
      every game were a coin flip.</p>
      <p>One game up, a team needs 3 more wins before 4 losses: $p = \\frac{42}{64}$, so you must
      hold $100 \\times \\frac{20}{64} = 31.25$. One game down you must hold $-31.25$. The first
      stake is half the gap: <b>£31.25</b>.</p>
      <p>In general the first stake is £100 times the chance that the remaining games would split
      evenly: $\\binom{6}{3} / 2^6 = \\frac{20}{64}$ here, and $\\binom{4}{2} / 2^4 = \\frac{6}{16}$,
      or £37.50, for a best of five.</p>`,
  },

  {
    id: "shorter-piece-over-longer",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A stick is snapped at a uniformly random point. What is the expected value of the
      ratio of the shorter piece to the longer piece?`,
    hint: `Call the shorter piece $x$. It is uniform between 0 and $\\frac{1}{2}$, and the ratio is $\\frac{x}{1 - x}$.`,
    hints: [
      `Call the shorter piece $x$. It is uniform between 0 and $\\frac{1}{2}$, and the ratio is $\\frac{x}{1 - x}$.`,
      `$\\frac{x}{1 - x} = \\frac{1}{1 - x} - 1$, which is easy to integrate.`,
    ],
    shortAnswer: `$2\\ln 2 - 1 \\approx 0.39$.`,
    solution: `<p>The shorter piece $x$ is uniform on $\\left[0, \\frac{1}{2}\\right]$, with density
      2, and the ratio is $\\frac{x}{1 - x} = \\frac{1}{1 - x} - 1$.</p>
      <p>$E = 2\\int_0^{1/2} \\left(\\frac{1}{1 - x} - 1\\right) dx = 2\\left(\\ln 2 - \\frac{1}{2}\\right)
      = 2\\ln 2 - 1 \\approx$ <b>0.39</b>.</p>
      <p>This is not the ratio of the two average lengths, $\\frac{1/4}{3/4} = \\frac{1}{3}$: the
      average of a ratio is not the ratio of the averages.</p>`,
    interview: {
      level: 3,
      followUp: "longer-piece-over-shorter",
      twist: `And the other way up: the expected ratio of the longer piece to the shorter?`,
    },
  },
  {
    id: "longer-piece-over-shorter",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A stick is snapped at a uniformly random point. What is the expected value of the
      ratio of the longer piece to the shorter piece?`,
    hint: `Write the integral down before you try to evaluate it.`,
    hints: [
      `Write the integral down before you try to evaluate it.`,
      `With the shorter piece $x$ uniform on $\\left[0, \\frac{1}{2}\\right]$, the ratio is $\\frac{1 - x}{x}$. How does that behave near $x = 0$?`,
    ],
    shortAnswer: `It is infinite. Breaks very near an end give huge ratios often enough that the average does not exist.`,
    solution: `<p>With the shorter piece $x$ uniform on $\\left[0, \\frac{1}{2}\\right]$, the ratio is
      $\\frac{1 - x}{x}$, and its expected value is $2\\int_0^{1/2} \\frac{1 - x}{x}\\,dx$.</p>
      <p>Near $x = 0$ the integrand behaves like $\\frac{1}{x}$, whose integral grows without limit
      (like $\\ln\\frac{1}{x}$). So the expected value is <b>infinite</b>.</p>
      <p>The typical ratio is modest — the median is 3 — but one break in a thousand lands within
      a two-thousandth of an end and gives a ratio above 1999, and such breaks carry the average
      away. The shorter-to-longer ratio, by contrast, is at most 1 and averages
      $2\\ln 2 - 1 \\approx 0.39$.</p>`,
  },

  {
    id: "token-round-a-pentagon",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A token sits on one corner of a pentagon. At each step it moves to one of the two
      neighbouring corners, with equal probability. What is the expected number of steps until it
      has visited all five corners?`,
    hint: `The corners visited so far always form an unbroken arc, and just after reaching a new corner the token is at one end of it.`,
    hints: [
      `The corners visited so far always form an unbroken arc, and just after reaching a new corner the token is at one end of it.`,
      `A fair walk that starts $a$ steps from one barrier and $b$ from another takes $a \\times b$ steps on average to reach one of them.`,
      `With $k$ corners visited and the token at an end, a new corner is 1 step one way and $k$ steps the other. So the answer is $1 + 2 + 3 + 4$.`,
    ],
    shortAnswer: `10 steps.`,
    solution: `<p>The visited corners form an arc. Just after a new corner is reached, the token
      is at one end of an arc of $k$ corners: an unvisited corner is 1 step away in one direction
      and $k$ steps away in the other.</p>
      <p>A fair walk that starts $a$ steps from one barrier and $b$ from another reaches a barrier
      after $a \\times b$ steps on average. So getting from $k$ visited corners to $k + 1$ takes
      $1 \\times k$ steps.</p>
      <p>Adding up for $k = 1, 2, 3, 4$: $1 + 2 + 3 + 4 =$ <b>10 steps</b>.</p>`,
    interview: {
      level: 3,
      followUp: "pentagon-to-a-far-corner",
      twist: `How long, on average, until it first reaches one particular corner that is not next to
      where it started?`,
    },
  },
  {
    id: "pentagon-to-a-far-corner",
    category: "expected value",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `A token sits on one corner of a pentagon and at each step moves to one of the two
      neighbouring corners with equal probability. Pick one of the two corners that are not next
      to its starting point. What is the expected number of steps until the token first reaches
      it?`,
    hint: `Cut the pentagon open at the target corner. The token is now on a line with the target at both ends.`,
    hints: [
      `Cut the pentagon open at the target corner. The token is now on a line with the target at both ends.`,
      `It starts 2 steps from one end and 3 from the other. A fair walk reaches an end after the product of the two distances, on average.`,
    ],
    shortAnswer: `6 steps.`,
    solution: `<p>Going one way round, the target is 2 steps away; going the other way it is 3.
      Cut the pentagon at the target and lay it flat: the token is on a line, 2 steps from one end
      and 3 from the other, and it stops when it reaches either.</p>
      <p>A fair walk starting $a$ from one end and $b$ from the other takes $a \\times b$ steps on
      average, so the answer is $2 \\times 3 =$ <b>6 steps</b>. (A neighbouring corner would take
      $1 \\times 4 = 4$.)</p>`,
  },

  /* ==== FOURTH SET ======================================================== */

  /* ---- Level 1 -------------------------------------------------------------- */

  {
    id: "higher-or-lower-three-cards",
    category: "expected value",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three cards numbered 1, 2 and 3 are shuffled and the top one is turned over.
      Before each of the other two is turned, you say whether it will be higher or lower than the
      card before it, and you win £1 each time you are right. Playing as well as possible, how
      much do you expect to win?`,
    hint: `The second guess costs you nothing: once two cards have been seen, you know the third.`,
    hints: [
      `The second guess costs you nothing: once two cards have been seen, you know the third.`,
      `The first guess is certain unless the first card is the 2.`,
    ],
    shortAnswer: `$\\frac{11}{6} \\approx$ £1.83.`,
    solution: `<p>The last guess is always right: with two cards showing you know the third.</p>
      <p>The first guess is certain if the first card is a 1 or a 3, which happens two times in
      three, and a coin toss if it is the 2. So it is right with probability
      $\\frac{2}{3} + \\frac{1}{3} \\times \\frac{1}{2} = \\frac{5}{6}$.</p>
      <p>Expected winnings: $\\frac{5}{6} + 1 = \\frac{11}{6} \\approx$ <b>£1.83</b>.</p>`,
    interview: {
      level: 1,
      followUp: "higher-or-lower-four-cards",
      twist: `And with four cards, numbered 1 to 4, and three guesses?`,
    },
  },
  {
    id: "higher-or-lower-four-cards",
    category: "expected value",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Four cards numbered 1 to 4 are shuffled and the top one is turned over. Before each
      of the other three is turned, you say whether it will be higher or lower than the card
      before it, and you win £1 each time you are right. Playing as well as possible, how much do
      you expect to win?`,
    hint: `The last guess is certain. The first is certain if the first card is a 1 or a 4, and right two times in three otherwise.`,
    hints: [
      `The last guess is certain. The first is certain if the first card is a 1 or a 4, and right two times in three otherwise.`,
      `For the middle guess, look at the second card and the two still face down. You are certain exactly when the second card is the smallest or the largest of those three.`,
    ],
    shortAnswer: `$\\frac{8}{3} \\approx$ £2.67.`,
    solution: `<p><b>Last guess:</b> three cards are showing, so you know the fourth: 1.</p>
      <p><b>First guess:</b> a 1 or a 4 makes it certain; a 2 or a 3 leaves two cards on one side
      and one on the other, so you are right $\\frac{2}{3}$ of the time. That averages
      $\\frac{1}{2} + \\frac{1}{2} \\times \\frac{2}{3} = \\frac{5}{6}$.</p>
      <p><b>Middle guess:</b> take the second card and the two still hidden. The second card is
      equally likely to be the lowest, middle or highest of these three. Lowest or highest, you
      are certain; middle, it is a coin toss. That is
      $\\frac{2}{3} + \\frac{1}{3} \\times \\frac{1}{2} = \\frac{5}{6}$.</p>
      <p>Total: $\\frac{5}{6} + \\frac{5}{6} + 1 = \\frac{8}{3} \\approx$ <b>£2.67</b>.</p>`,
  },

  {
    id: "odd-or-even-two-cards",
    category: "probability",
    difficulty: 1,
    time: 300,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Five cards are numbered 1 to 5, and two are drawn at random. I will take a bet,
      at even money, on whether the two numbers add up to an odd or an even total. Which do you
      back, and what is the bet worth to you per £1 staked?`,
    hint: `An odd total needs one odd card and one even card.`,
    hints: [
      `An odd total needs one odd card and one even card.`,
      `There are three odd cards and two even ones: $3 \\times 2 = 6$ mixed pairs out of the 10 possible.`,
    ],
    shortAnswer: `Odd. It comes up $\\frac{3}{5}$ of the time, so the bet is worth 20p per £1.`,
    solution: `<p>The total is odd exactly when one card is odd and the other even. With three
      odd cards and two even there are $3 \\times 2 = 6$ such pairs, out of
      $\\binom{5}{2} = 10$.</p>
      <p>So back <b>odd</b>, at $\\frac{3}{5}$. At even money that is worth
      $\\frac{3}{5} - \\frac{2}{5} = \\frac{1}{5}$: 20p for every £1 staked.</p>`,
    interview: {
      level: 1,
      followUp: "odd-or-even-with-replacement",
      twist: `Now the first card is put back and the pack reshuffled before the second is drawn.
      Which way do you bet?`,
    },
  },
  {
    id: "odd-or-even-with-replacement",
    category: "probability",
    difficulty: 1,
    time: 240,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Five cards are numbered 1 to 5. One is drawn, noted and put back, the pack is
      shuffled, and a second is drawn. At even money, would you back the two numbers adding up to
      an odd total or an even one, and what is the bet worth per £1 staked?`,
    hint: `The two draws are now independent. An odd total is odd-then-even or even-then-odd.`,
    hints: [
      `The two draws are now independent. An odd total is odd-then-even or even-then-odd.`,
      `$2 \\times \\frac{3}{5} \\times \\frac{2}{5} = \\frac{12}{25}$.`,
    ],
    shortAnswer: `Even. It comes up $\\frac{13}{25}$ of the time, an edge of 4p per £1.`,
    solution: `<p>Each draw is odd with probability $\\frac{3}{5}$ and even with probability
      $\\frac{2}{5}$, independently. An odd total needs one of each:
      $2 \\times \\frac{3}{5} \\times \\frac{2}{5} = \\frac{12}{25}$.</p>
      <p>So the total is even with probability $\\frac{13}{25}$: back <b>even</b>, for an edge of
      $\\frac{13}{25} - \\frac{12}{25} = \\frac{1}{25}$, or 4p per £1. Putting the card back makes
      a matching pair possible, and two of the same parity always make an even total.</p>`,
  },

  /* ---- Level 2 -------------------------------------------------------------- */

  {
    id: "chameleons",
    category: "logic",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `An island has 13 red, 15 green and 17 blue chameleons. Whenever two of different
      colours meet, both change to the third colour. Nothing else changes their colour. Can all
      45 ever be the same colour?`,
    hint: `Follow what one meeting does to the three counts: two go down by one, the third goes up by two.`,
    hints: [
      `Follow what one meeting does to the three counts: two go down by one, the third goes up by two.`,
      `Look at the counts' remainders on division by 3. What does a meeting do to all three remainders?`,
    ],
    shortAnswer: `No. The three counts start with different remainders on division by 3, and every meeting keeps them different, but a single colour would need two counts of zero.`,
    solution: `<p>A meeting lowers two of the counts by 1 and raises the third by 2. On division
      by 3, going up by 2 is the same as going down by 1, so every meeting shifts all three
      remainders by the same amount.</p>
      <p>The counts 13, 15 and 17 leave remainders 1, 0 and 2: all different. Shifting all three
      together keeps them all different, for ever.</p>
      <p>If every chameleon were one colour, two of the counts would be 0, with the same remainder.
      That can never happen: <b>no</b>.</p>`,
    interview: {
      level: 2,
      followUp: "chameleons-one-more-green",
      twist: `One more green chameleon arrives, making 13 red, 16 green and 17 blue. Can they all
      become the same colour now?`,
    },
  },
  {
    id: "chameleons-one-more-green",
    category: "logic",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `An island has 13 red, 16 green and 17 blue chameleons. Whenever two of different
      colours meet, both change to the third colour. Can all 46 end up the same colour? If so,
      how?`,
    hint: `A meeting shifts the remainders of all three counts, on division by 3, by the same amount. Which two counts start with the same remainder?`,
    hints: [
      `A meeting shifts the remainders of all three counts, on division by 3, by the same amount. Which two counts start with the same remainder?`,
      `Red and green differ by 3. One meeting between a green and a blue makes them equal.`,
    ],
    shortAnswer: `Yes: all blue. One green meets one blue, leaving 15 red, 15 green and 16 blue; then each red meets a green.`,
    solution: `<p>For two colours to vanish, their two counts must reach 0 together, so they must
      have the same remainder on division by 3, and a meeting never changes whether they do. Here
      13 and 16 both leave remainder 1, so red and green can vanish together.</p>
      <p>Let one green meet one blue: both turn red, giving 15 red, 15 green, 16 blue. Now pair
      off the 15 reds with the 15 greens; every pair turns blue. All 46 are <b>blue</b>.</p>`,
  },

  {
    id: "big-with-three-dice",
    category: "expected value",
    difficulty: 2,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three dice are rolled. You bet £1 at even money on “big”: a total of 11 or more.
      But there is a house rule: if all three dice show the same number, you lose whatever the
      total. What is your expected profit per game?`,
    hint: `Forget the house rule for a moment. How likely is a total of 11 or more? Try replacing every die $x$ by $7 - x$.`,
    hints: [
      `Forget the house rule for a moment. How likely is a total of 11 or more? Try replacing every die $x$ by $7 - x$.`,
      `Totals of 3 to 10 and 11 to 18 are mirror images: 108 rolls each. Now take the triples away from your half.`,
    ],
    shortAnswer: `A loss of $\\frac{1}{36}$ of a pound, about 2.8p a game.`,
    solution: `<p>Replace each die $x$ by $7 - x$ and a total of $t$ becomes $21 - t$, so totals of
      10 or less and 11 or more are equally likely: 108 rolls each out of 216.</p>
      <p>Three of the six triples (4-4-4, 5-5-5, 6-6-6) lie in your half and now lose. So you win
      on 105 rolls and lose on 111.</p>
      <p>Expected profit: $\\frac{105 - 111}{216} = -\\frac{1}{36}$, a loss of about <b>2.8p</b> a
      game. The whole of the house's edge is those three triples.</p>`,
    interview: {
      level: 2,
      followUp: "thirty-to-one-on-a-triple",
      twist: `The same table pays 30 to 1 on “any triple”. Is that a better or a worse bet than
      big?`,
    },
  },
  {
    id: "thirty-to-one-on-a-triple",
    category: "expected value",
    difficulty: 2,
    time: 360,
    tags: ["interview"],
    source: "Wincent interview",
    question: `Three dice are rolled. A bet on “any triple” wins when all three dice show the
      same number, and pays 30 to 1. What is the expected profit on a £1 stake, and what payout
      would make the bet fair?`,
    hint: `How many of the 216 rolls are triples?`,
    hints: [
      `How many of the 216 rolls are triples?`,
      `Six rolls win £30 each; the other 210 lose £1 each.`,
    ],
    shortAnswer: `A loss of $\\frac{5}{36}$ of a pound, about 14p per £1 — five times worse than betting on big. A fair payout would be 35 to 1.`,
    solution: `<p>Six of the 216 rolls are triples. They win £30 each, and the other 210 rolls lose
      £1 each.</p>
      <p>Expected profit: $\\frac{6 \\times 30 - 210}{216} = -\\frac{30}{216} = -\\frac{5}{36}$, a
      loss of about <b>14p</b> per £1. A fair bet would pay $\\frac{210}{6} = 35$ to 1.</p>
      <p>Long odds hide a large edge: the even-money bet on a big total, which loses on triples,
      costs only $\\frac{1}{36}$ per £1.</p>`,
  },

  /* ---- Level 3 -------------------------------------------------------------- */

  {
    id: "bluffing-with-a-queen",
    category: "market making",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and an opponent each put £1 into a pot. You are dealt an ace or a queen, each
      with probability one half, and only you see it. Your opponent holds a king, and you both
      know that. You may check, in which case the cards are shown and the higher card takes the
      pot. Or you may bet £2, after which your opponent either folds, giving you the pot, or
      calls with £2, and the higher card takes everything. You bet every time you hold the ace.
      How often should you bet with the queen, and how often should your opponent call?`,
    hint: `If you never bluff, your opponent never calls. If you always bluff, they always call. At the right frequency in between, they gain nothing by choosing either way.`,
    hints: [
      `If you never bluff, your opponent never calls. If you always bluff, they always call. At the right frequency in between, they gain nothing by choosing either way.`,
      `Make your opponent indifferent. When you bet, calling wins them £3 against a queen and loses £3 against an ace, while folding loses the £1 they put in.`,
      `They are indifferent when one bet in three is a bluff. And you are indifferent with a queen when checking (−£1) is as good as betting (+£1 if they fold, −£3 if they call).`,
    ],
    shortAnswer: `Bet with half your queens; your opponent should call half the time. The game is then worth 50p a hand to you.`,
    solution: `<p><b>Your bluffs.</b> Facing a bet, your opponent loses £1 by folding. Calling
      wins £3 against a queen and loses £3 against an ace. If a share $x$ of your bets are
      queens, calling is worth $3x - 3(1 - x)$, which equals $-1$ when $x = \\frac{1}{3}$. You
      bet every ace, so one bluff for every two aces means betting <b>half</b> your queens.</p>
      <p><b>Their calls.</b> With a queen, checking loses £1. Betting wins £1 if they fold and
      loses £3 if they call: $1 - 4c$ if they call a share $c$ of the time. That equals $-1$
      when $c =$ <b>$\\frac{1}{2}$</b>.</p>
      <p><b>The value.</b> Your aces win $\\frac{1}{2} \\times 3 + \\frac{1}{2} \\times 1 = 2$ and your
      queens lose 1 either way, so you make $\\frac{1}{2}(2) - \\frac{1}{2}(1) =$ 50p a hand. With
      no betting allowed the game would be worth nothing: the bet, and the bluffs that make it
      credible, are the whole of your edge.</p>`,
    interview: {
      level: 3,
      followUp: "bluffing-with-a-bigger-bet",
      twist: `Suppose the bet is £4 instead of £2. Do you bluff more or less often, and does your
      opponent call more or less?`,
    },
  },
  {
    id: "bluffing-with-a-bigger-bet",
    category: "market making",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You and an opponent each put £1 into a pot. You hold an ace or a queen, equally
      likely, seen only by you; your opponent holds a king and you both know it. You may check
      (cards shown, higher card takes the pot) or bet £4, after which your opponent folds or
      calls with £4. You bet every ace. How often should you bet with the queen, how often
      should your opponent call, and what is the game worth to you?`,
    hint: `Calling now wins your opponent £5 against a queen and loses £5 against an ace; folding still loses £1.`,
    hints: [
      `Calling now wins your opponent £5 against a queen and loses £5 against an ace; folding still loses £1.`,
      `They are indifferent when two bets in five are bluffs. You are indifferent with a queen when $1 - 6c = -1$.`,
    ],
    shortAnswer: `Bluff more: two queens in three. Your opponent calls less: one time in three. The game is worth 67p a hand to you.`,
    solution: `<p>Calling is worth $5x - 5(1 - x)$ to your opponent when a share $x$ of your bets
      are bluffs, and folding is worth $-1$. These are equal at $x = \\frac{2}{5}$: two bluffs for
      every three aces, so bet <b>two-thirds</b> of your queens.</p>
      <p>With a queen, betting is worth $1 - 6c$ against a calling share $c$, and checking is
      worth $-1$: equal at $c =$ <b>$\\frac{1}{3}$</b>.</p>
      <p>Your aces then win $\\frac{1}{3} \\times 5 + \\frac{2}{3} \\times 1 = \\frac{7}{3}$, and the
      game is worth $\\frac{1}{2} \\times \\frac{7}{3} - \\frac{1}{2} = \\frac{2}{3}$: about
      <b>67p</b> a hand, up from 50p with a £2 bet. A bigger bet lets you bluff more often,
      because your opponent has to be right more often to make calling pay.</p>`,
  },

  {
    id: "a-repeat-loses-everything",
    category: "expected value",
    difficulty: 3,
    time: 720,
    tags: ["interview"],
    source: "Wincent interview",
    question: `You roll a die as many times as you like, adding up the rolls, and may stop
      whenever you choose and take the total in pounds. But if any roll shows a number you have
      already rolled, you get nothing. How should you play, and what is the game worth?`,
    hint: `With $k$ different numbers already rolled, another roll loses everything with probability $\\frac{k}{6}$. Start from the end: would you ever roll a fourth time?`,
    hints: [
      `With $k$ different numbers already rolled, another roll loses everything with probability $\\frac{k}{6}$. Start from the end: would you ever roll a fourth time?`,
      `After three numbers a further roll loses half the time, so it would have to at least double your total. It cannot.`,
      `After two numbers totalling $s$, the four unseen numbers add up to $21 - s$, so one more roll is worth $\\frac{4s + (21 - s)}{6} = \\frac{s}{2} + 3.5$.`,
    ],
    shortAnswer: `Always roll twice. Roll a third time only if your total is 6 or less (at 7 it makes no difference). Never roll a fourth time. The game is worth $\\frac{223}{36} \\approx$ £6.19.`,
    solution: `<p><b>A fourth roll?</b> With three numbers totalling $s$, the three unseen numbers
      add up to $21 - s$, and one more roll is worth $\\frac{3s + (21 - s)}{6} = \\frac{s}{3} + 3.5$.
      That beats $s$ only if $s < 5.25$, and three different numbers total at least 6. So never.</p>
      <p><b>A third roll?</b> With two numbers totalling $s$, one more roll is worth
      $\\frac{4s + (21 - s)}{6} = \\frac{s}{2} + 3.5$, which beats $s$ when $s < 7$. Roll again on
      6 or less; 7 is a toss-up.</p>
      <p><b>A second roll?</b> Always: even holding a 6, rolling on is worth 7.5.</p>
      <p>Averaging over the first two rolls, with this plan, gives $\\frac{223}{36} \\approx$
      <b>£6.19</b>.</p>`,
    interview: {
      level: 3,
      followUp: "losing-the-lot",
      twist: `Playing that way, how often do you walk away with nothing?`,
    },
  },
  {
    id: "losing-the-lot",
    category: "probability",
    difficulty: 3,
    time: 480,
    tags: ["interview"],
    source: "Wincent interview",
    question: `In a dice game you add up your rolls and may stop at any time, but a roll that
      repeats an earlier number loses everything. You play like this: always roll twice; roll a
      third time only if the first two rolls are different and total 6 or less; never roll a
      fourth time. What is the probability that you finish with nothing?`,
    hint: `You can lose on the second roll or on the third.`,
    hints: [
      `You can lose on the second roll or on the third.`,
      `The second roll repeats the first with probability $\\frac{1}{6}$. A third roll happens after 12 of the 36 possible first two rolls, and then repeats with probability $\\frac{2}{6}$.`,
    ],
    shortAnswer: `$\\frac{5}{18} \\approx 0.28$.`,
    solution: `<p>The second roll repeats the first with probability $\\frac{1}{6}$.</p>
      <p>You roll a third time when the first two are different and total 6 or less. The unordered
      pairs are 1–2, 1–3, 1–4, 1–5, 2–3 and 2–4: 12 of the 36 ordered rolls. The third roll then
      repeats one of the two numbers with probability $\\frac{2}{6}$.</p>
      <p>$\\frac{1}{6} + \\frac{12}{36} \\times \\frac{2}{6} = \\frac{1}{6} + \\frac{1}{9} =$
      <b>$\\frac{5}{18}$</b>, about 0.28.</p>`,
  },

]);
