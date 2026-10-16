/**
 * Polotastic Mathematical Curriculum and Question Generator
 * 
 * Enforces strict pedagogical boundaries:
 * - Place-value units: 1 Polo (one), 1 Roll (10 ones), 1 Packet (10 rolls / 100 ones), 1 Carton (10 packets / 1000 ones).
 * - Level 1: Single-digit minus single-digit (NO borrowing).
 * - Level 2: Two-digit minus one-digit (minuend ones >= subtrahend, NO borrowing).
 * - Level 3: Two-digit minus one-digit (minuend ones < subtrahend, MUST borrow 1 ten).
 */

// Four standard place-value units
export const POLO_UNITS = {
  ONE: { id: 'one', name: 'Polo', plural: 'Polos', value: 1, label: '1 One' },
  TEN: { id: 'ten', name: 'Roll', plural: 'Rolls', value: 10, label: '1 Ten = 10 Ones' },
  HUNDRED: { id: 'hundred', name: 'Packet', plural: 'Packets', value: 100, label: '1 Hundred = 10 Tens' },
  THOUSAND: { id: 'thousand', name: 'Carton', plural: 'Cartons', value: 1000, label: '1 Thousand = 10 Hundreds' },
};

/**
 * Generates fresh questions for the Polo Dash prerequisite runner.
 * Questions cover all 4 place value units, conversions, and comparisons.
 */
export function generatePoloDashCourse() {
  const allObstacles = [
    {
      id: 'dash_ones_to_roll',
      unitFocus: 'ten',
      question: 'How many loose Polos make 1 roll?',
      promptSpeech: 'How many loose Polos make one roll?',
      helperTip: 'Count 10 ones together to form 1 whole roll!',
      targetValue: 10,
      options: [
        { id: 'opt_1', lane: 0, text: '5 Polos', value: 5, icon: '🍬', isCorrect: false, feedback: '5 is half a roll! You need 10 Polos for 1 roll.' },
        { id: 'opt_2', lane: 1, text: '10 Polos', value: 10, icon: '🍬', isCorrect: true, feedback: 'Spot on! 10 Polos = 1 Roll (One Ten)!' },
        { id: 'opt_3', lane: 2, text: '100 Polos', value: 100, icon: '🍬', isCorrect: false, feedback: '100 Polos makes a whole packet! A roll needs 10.' },
      ],
    },
    {
      id: 'dash_roll_value',
      unitFocus: 'ten',
      question: 'What is 1 roll worth?',
      promptSpeech: 'What is one roll worth?',
      helperTip: 'A roll is a bundle of 10 individual Polos!',
      targetValue: 10,
      options: [
        { id: 'opt_1', lane: 0, text: '10 Ones', value: 10, icon: '🎯', isCorrect: true, feedback: 'Yes! 1 roll = 10 ones = 1 ten!' },
        { id: 'opt_2', lane: 1, text: '1 One', value: 1, icon: '🎯', isCorrect: false, feedback: '1 one is just 1 single Polo. A roll has 10!' },
        { id: 'opt_3', lane: 2, text: '20 Ones', value: 20, icon: '🎯', isCorrect: false, feedback: '20 ones would be 2 rolls!' },
      ],
    },
    {
      id: 'dash_rolls_to_packet',
      unitFocus: 'hundred',
      question: 'How many rolls make 1 packet?',
      promptSpeech: 'How many rolls make one packet?',
      helperTip: 'Ten rolls bundle up to make 1 packet (100)!',
      targetValue: 10,
      options: [
        { id: 'opt_1', lane: 0, text: '2 Rolls', value: 2, icon: '📦', isCorrect: false, feedback: '2 rolls is only 20 Polos. You need 10 rolls to make 100!' },
        { id: 'opt_2', lane: 1, text: '100 Rolls', value: 100, icon: '📦', isCorrect: false, feedback: '100 rolls is 1,000 Polos! 10 rolls make 1 packet.' },
        { id: 'opt_3', lane: 2, text: '10 Rolls', value: 10, icon: '📦', isCorrect: true, feedback: 'Brilliant! 10 rolls × 10 = 100 Polos = 1 Packet!' },
      ],
    },
    {
      id: 'dash_represents_100',
      unitFocus: 'hundred',
      question: 'Which represents 100 Polos?',
      promptSpeech: 'Which represents 100 Polos?',
      helperTip: 'Remember: 1 packet has 10 rolls = 100 ones!',
      targetValue: 100,
      options: [
        { id: 'opt_1', lane: 0, text: '1 Roll', value: 10, icon: '🥖', isCorrect: false, feedback: '1 roll is only 10 Polos!' },
        { id: 'opt_2', lane: 1, text: '1 Packet', value: 100, icon: '📦', isCorrect: true, feedback: 'Fantastic! 1 packet = 10 rolls = 100 Polos!' },
        { id: 'opt_3', lane: 2, text: '1 Carton', value: 1000, icon: '🚚', isCorrect: false, feedback: '1 carton is 1,000 Polos! 1 packet is 100.' },
      ],
    },
    {
      id: 'dash_packets_to_carton',
      unitFocus: 'thousand',
      question: 'How many packets make 1 carton?',
      promptSpeech: 'How many packets make one carton?',
      helperTip: '10 packets of 100 make 1 big carton (1,000)!',
      targetValue: 10,
      options: [
        { id: 'opt_1', lane: 0, text: '10 Packets', value: 10, icon: '🚚', isCorrect: true, feedback: 'Super! 10 packets × 100 = 1,000 Polos = 1 Carton!' },
        { id: 'opt_2', lane: 1, text: '5 Packets', value: 5, icon: '🚚', isCorrect: false, feedback: '5 packets = 500 Polos. You need 10 packets for 1,000!' },
        { id: 'opt_3', lane: 2, text: '20 Packets', value: 20, icon: '🚚', isCorrect: false, feedback: '10 packets is the exact bundle for 1 carton!' },
      ],
    },
    {
      id: 'dash_which_is_greater',
      unitFocus: 'comparison',
      question: 'Which is greater: 1 roll or 9 individual Polos?',
      promptSpeech: 'Which is greater: one roll or 9 individual Polos?',
      helperTip: '1 roll = 10 ones. 10 is greater than 9!',
      targetValue: 10,
      options: [
        { id: 'opt_1', lane: 0, text: '9 Polos (9)', value: 9, icon: '🍬', isCorrect: false, feedback: '9 is less than 10. 1 roll is worth 10!' },
        { id: 'opt_2', lane: 1, text: '1 Roll (10)', value: 10, icon: '🥖', isCorrect: true, feedback: 'Exactly right! 1 roll = 10, and 10 > 9!' },
        { id: 'opt_3', lane: 2, text: 'They are equal', value: 0, icon: '⚖️', isCorrect: false, feedback: '1 roll has 10 Polos, which is 1 more than 9!' },
      ],
    },
    {
      id: 'dash_ones_in_carton',
      unitFocus: 'thousand',
      question: 'How many ones are in 1 carton?',
      promptSpeech: 'How many ones are in one carton?',
      helperTip: '1 carton holds 10 packets × 10 rolls × 10 ones = 1,000!',
      targetValue: 1000,
      options: [
        { id: 'opt_1', lane: 0, text: '100 ones', value: 100, icon: '📦', isCorrect: false, feedback: '100 ones is 1 packet. A carton has 1,000 ones!' },
        { id: 'opt_2', lane: 1, text: '10 ones', value: 10, icon: '🥖', isCorrect: false, feedback: '10 ones is 1 roll. A carton is 1,000 ones!' },
        { id: 'opt_3', lane: 2, text: '1,000 ones', value: 1000, icon: '🚚', isCorrect: true, feedback: 'Magnificent! 1 carton = 1,000 individual Polos!' },
      ],
    },
  ];

  return allObstacles;
}

/**
 * Random integer inclusive: min <= n <= max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Level 1: Single-Digit Subtraction Without Borrowing
 * Minuend: 3 to 9
 * Subtrahend: 1 to (Minuend - 1)
 * Guaranteed: Minuend >= Subtrahend, single digit, no borrowing.
 */
export function generateLevel1Question(excludeKeys = []) {
  const candidates = [];
  for (let m = 4; m <= 9; m++) {
    for (let s = 1; s < m; s++) {
      const key = `${m}-${s}`;
      if (!excludeKeys.includes(key)) {
        candidates.push({ minuend: m, subtrahend: s, diff: m - s, key });
      }
    }
  }

  // Fallback if all keys used
  const pool = candidates.length > 0 ? candidates : [
    { minuend: 8, subtrahend: 3, diff: 5, key: '8-3' },
    { minuend: 9, subtrahend: 4, diff: 5, key: '9-4' },
    { minuend: 7, subtrahend: 2, diff: 5, key: '7-2' },
    { minuend: 6, subtrahend: 1, diff: 5, key: '6-1' },
    { minuend: 7, subtrahend: 3, diff: 4, key: '7-3' },
    { minuend: 8, subtrahend: 5, diff: 3, key: '8-5' },
  ];

  const pick = pool[randomInt(0, pool.length - 1)];

  // Generate 3 clever distractors for child selection
  const distractors = new Set();
  const diff = pick.diff;
  
  if (diff + 1 <= 9) distractors.add(diff + 1);
  if (diff - 1 >= 1) distractors.add(diff - 1);
  if (diff + 2 <= 9) distractors.add(diff + 2);
  distractors.add(pick.subtrahend);
  distractors.delete(diff);

  const distractorArr = Array.from(distractors).slice(0, 3);
  while (distractorArr.length < 3) {
    const r = randomInt(1, 9);
    if (r !== diff && !distractorArr.includes(r)) distractorArr.push(r);
  }

  const choices = [
    { value: diff, isCorrect: true },
    ...distractorArr.map((v) => ({ value: v, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `l1_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 1,
    minuend: pick.minuend,
    subtrahend: pick.subtrahend,
    diff: pick.diff,
    requiresBorrowing: false,
    instruction: `We have ${pick.minuend} Polos. Take away ${pick.subtrahend} Polos into the basket!`,
    speech: `We have ${pick.minuend} Polos. Take away ${pick.subtrahend} Polos into the takeaway basket.`,
    choices,
    // Manipulative representations
    initialPolos: pick.minuend,
    polosToRemove: pick.subtrahend,
    remainingPolos: pick.diff,
  };
}

/**
 * Level 2: Two-Digit Minus One-Digit Without Borrowing
 * Minuend: Tens (2..6) + Ones (2..9) => 22 to 69
 * Subtrahend: 1 to Ones (so ones digit >= subtrahend, ZERO borrowing needed)
 * Difference: (Tens * 10) + (Ones - Subtrahend)
 */
export function generateLevel2Question(excludeKeys = []) {
  const candidates = [];
  for (let t = 2; t <= 5; t++) {
    for (let o = 3; o <= 8; o++) {
      for (let s = 1; s <= Math.min(o, 6); s++) {
        const m = t * 10 + o;
        const key = `${m}-${s}`;
        if (!excludeKeys.includes(key)) {
          candidates.push({ tens: t, ones: o, minuend: m, subtrahend: s, diff: m - s, key });
        }
      }
    }
  }

  const pool = candidates.length > 0 ? candidates : [
    { tens: 2, ones: 4, minuend: 24, subtrahend: 3, diff: 21, key: '24-3' },
    { tens: 3, ones: 5, minuend: 35, subtrahend: 2, diff: 33, key: '35-2' },
    { tens: 4, ones: 8, minuend: 48, subtrahend: 6, diff: 42, key: '48-6' },
    { tens: 5, ones: 7, minuend: 57, subtrahend: 4, diff: 53, key: '57-4' },
    { tens: 3, ones: 6, minuend: 36, subtrahend: 4, diff: 32, key: '36-4' },
  ];

  const pick = pool[randomInt(0, pool.length - 1)];

  // Generate distractors near the correct answer
  const distractors = new Set();
  const diff = pick.diff;
  distractors.add(diff + 1);
  distractors.add(diff - 1);
  distractors.add(diff + 10);
  distractors.add(pick.minuend);
  distractors.delete(diff);

  const distractorArr = Array.from(distractors).slice(0, 3);
  while (distractorArr.length < 3) {
    const r = diff + randomInt(-4, 4);
    if (r > 0 && r !== diff && !distractorArr.includes(r)) distractorArr.push(r);
  }

  const choices = [
    { value: diff, isCorrect: true },
    ...distractorArr.map((v) => ({ value: v, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `l2_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 2,
    tens: pick.tens,
    ones: pick.ones,
    minuend: pick.minuend,
    subtrahend: pick.subtrahend,
    diff: pick.diff,
    requiresBorrowing: false,
    instruction: `We have ${pick.minuend} (${pick.tens} rolls and ${pick.ones} loose Polos). Take away ${pick.subtrahend} loose Polos!`,
    speech: `We have ${pick.minuend}. That is ${pick.tens} rolls and ${pick.ones} loose Polos. Take away ${pick.subtrahend} loose Polos.`,
    tip: `Notice that ${pick.ones} is bigger than ${pick.subtrahend}! We have enough loose Polos, so we don't need to break any rolls.`,
    choices,
    // Manipulative representations
    initialRolls: pick.tens,
    initialLoosePolos: pick.ones,
    looseToRemove: pick.subtrahend,
    remainingRolls: pick.tens,
    remainingLoose: pick.ones - pick.subtrahend,
  };
}

/**
 * Level 3: Two-Digit Minus One-Digit WITH Borrowing
 * Minuend: Tens (2..6) + Ones (0..6)
 * Subtrahend: (Ones + 2) to 9 (guaranteed Ones < Subtrahend => MUST borrow 1 ten)
 * Regrouping:
 *   1 Roll (10) breaks apart into 10 loose Polos.
 *   Rolls decrease by 1: (Tens - 1)
 *   Loose Polos increase by 10: (Ones + 10)
 *   Value stays identical: 10*(Tens - 1) + (Ones + 10) = 10*Tens + Ones.
 */
export function generateLevel3Question(excludeKeys = []) {
  const candidates = [];
  for (let t = 2; t <= 5; t++) {
    for (let o = 1; o <= 5; o++) {
      for (let s = o + 2; s <= 9; s++) {
        const m = t * 10 + o;
        const key = `${m}-${s}`;
        if (!excludeKeys.includes(key)) {
          candidates.push({ tens: t, ones: o, minuend: m, subtrahend: s, diff: m - s, key });
        }
      }
    }
  }

  const pool = candidates.length > 0 ? candidates : [
    { tens: 3, ones: 2, minuend: 32, subtrahend: 7, diff: 25, key: '32-7' },
    { tens: 4, ones: 1, minuend: 41, subtrahend: 6, diff: 35, key: '41-6' },
    { tens: 5, ones: 3, minuend: 53, subtrahend: 8, diff: 45, key: '53-8' },
    { tens: 6, ones: 2, minuend: 62, subtrahend: 9, diff: 53, key: '62-9' },
    { tens: 3, ones: 4, minuend: 34, subtrahend: 8, diff: 26, key: '34-8' },
    { tens: 4, ones: 3, minuend: 43, subtrahend: 7, diff: 36, key: '43-7' },
  ];

  const pick = pool[randomInt(0, pool.length - 1)];

  // Distractors
  const distractors = new Set();
  const diff = pick.diff;
  // Common kid mistake 1: subtract smaller from larger in ones column: (e.g. 32-7 => 30 + (7-2) = 35 or 25)
  const wrongNoBorrow = pick.tens * 10 - (pick.subtrahend - pick.ones);
  if (wrongNoBorrow !== diff && wrongNoBorrow > 0) distractors.add(wrongNoBorrow);
  distractors.add(diff + 10);
  distractors.add(diff - 1);
  distractors.add(diff + 1);
  distractors.delete(diff);

  const distractorArr = Array.from(distractors).slice(0, 3);
  while (distractorArr.length < 3) {
    const r = diff + randomInt(-3, 3);
    if (r > 0 && r !== diff && !distractorArr.includes(r)) distractorArr.push(r);
  }

  const choices = [
    { value: diff, isCorrect: true },
    ...distractorArr.map((v) => ({ value: v, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);

  return {
    id: `l3_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 3,
    tens: pick.tens,
    ones: pick.ones,
    minuend: pick.minuend,
    subtrahend: pick.subtrahend,
    diff: pick.diff,
    requiresBorrowing: true,
    instruction: `We need to take away ${pick.subtrahend} Polos, but only have ${pick.ones} loose Polos! Break 1 roll into 10 loose Polos!`,
    speech: `We need to take away ${pick.subtrahend} Polos, but we only have ${pick.ones} loose Polos. Tap a roll to break it into 10 loose Polos!`,
    choices,
    // Step-by-step regrouping values
    initialRolls: pick.tens,
    initialLoosePolos: pick.ones,
    afterBorrowRolls: pick.tens - 1,
    afterBorrowLoosePolos: pick.ones + 10,
    looseToRemove: pick.subtrahend,
    remainingLoose: (pick.ones + 10) - pick.subtrahend,
    finalRolls: pick.tens - 1,
  };
}

/**
 * Self-validation function verifying mathematical integrity across 100 random problems.
 */
export function validateAllPolotasticGenerators() {
  const errors = [];

  // 1. Validate Level 1 (single-digit, no borrowing, minuend >= subtrahend)
  for (let i = 0; i < 30; i++) {
    const q = generateLevel1Question();
    if (q.minuend < 1 || q.minuend > 9) errors.push(`L1 minuend ${q.minuend} not 1..9`);
    if (q.subtrahend >= q.minuend) errors.push(`L1 subtrahend ${q.subtrahend} >= minuend ${q.minuend}`);
    if (q.minuend - q.subtrahend !== q.diff) errors.push(`L1 math mismatch ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
    if (q.requiresBorrowing) errors.push(`L1 flagged requiresBorrowing`);
  }

  // 2. Validate Level 2 (two-digit minus one-digit, no borrowing, ones >= subtrahend)
  for (let i = 0; i < 30; i++) {
    const q = generateLevel2Question();
    if (q.minuend < 10 || q.minuend > 99) errors.push(`L2 minuend ${q.minuend} not 2 digits`);
    if (q.ones < q.subtrahend) errors.push(`L2 ones ${q.ones} < subtrahend ${q.subtrahend} (accidental borrowing)`);
    if (q.minuend - q.subtrahend !== q.diff) errors.push(`L2 math mismatch ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
  }

  // 3. Validate Level 3 (two-digit minus one-digit WITH borrowing, ones < subtrahend)
  for (let i = 0; i < 40; i++) {
    const q = generateLevel3Question();
    if (q.ones >= q.subtrahend) errors.push(`L3 ones ${q.ones} >= subtrahend ${q.subtrahend} (borrowing missing)`);
    if (q.afterBorrowRolls !== q.tens - 1) errors.push(`L3 afterBorrowRolls incorrect`);
    if (q.afterBorrowLoosePolos !== q.ones + 10) errors.push(`L3 afterBorrowLoosePolos incorrect`);
    if (q.afterBorrowRolls * 10 + q.afterBorrowLoosePolos !== q.minuend) {
      errors.push(`L3 value changed during regrouping!`);
    }
    const finalVal = q.finalRolls * 10 + q.remainingLoose;
    if (finalVal !== q.diff) errors.push(`L3 final remaining mismatch: ${finalVal} !== ${q.diff}`);
  }

  if (errors.length > 0) {
    console.error('Polotastic Generator Validation Failed:', errors);
    return false;
  }
  return true;
}

// Auto-run validation
validateAllPolotasticGenerators();
