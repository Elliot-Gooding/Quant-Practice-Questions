/* ============================================================================
   WINCENT-STYLE INTERVIEW PROBLEMS, SECOND SET
   ----------------------------------------------------------------------------
   Eighteen more opening problems for the mock interview on the Test tab, six at
   each level, each with a follow-up: the same shape as questions-wincent.js,
   which explains the fields. With both sets loaded the mock has twelve problems
   to draw on for every block.

   None repeats a problem from the first set, or from anywhere else in the bank,
   with different numbers. Like the first set these are practice problems in the
   style of the interview, not a record of what Wincent asks.

   Every number here was computed by machine before this file was written:
   exact fractions, exhaustive enumeration or dynamic programming. Four problems
   are argued, not calculated — the two about light switches, the proof that the
   first player in the coin game cannot lose, and the strategy for guessing
   higher or lower from one slip — and for those the argument is the answer.
   ========================================================================== */

QBank.add([

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

]);
