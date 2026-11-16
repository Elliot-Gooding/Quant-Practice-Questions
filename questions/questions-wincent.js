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

]);
