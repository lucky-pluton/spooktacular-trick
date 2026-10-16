/**
 * Polotastic Mathematical Curriculum and Question Generator
 * 
 * Enforces strict pedagogical boundaries:
 * - Place-value units: 1 Polo (one), 1 Roll (10 ones), 1 Packet (10 rolls / 100 ones), 1 Carton (10 packets / 1000 ones).
 * - Direct Answer Typing: ALL multiple-choice questions (options/choices) are removed in favor of direct typing.
 * - Level 1: Single-digit minus single-digit (NO borrowing).
 * - Level 2: Two-digit minus one-digit (minuend ones >= subtrahend, NO borrowing).
 * - Level 3: Two-digit minus one-digit (minuend ones < subtrahend, MUST borrow 1 ten with multi-step typed verification).
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
 * Every obstacle requires direct answer typing (no multiple-choice lanes).
 */
export function generatePoloDashCourse() {
  const allObstacles = [
    {
      id: 'dash_ones_to_roll',
      unitFocus: 'ten',
      obstacleIcon: '🥖',
      question: 'How many loose Polos make 1 roll?',
      promptSpeech: 'How many loose Polos make one roll?',
      equationPrompt: '1 roll = ___ loose Polos',
      helperTip: 'Count 10 ones together to form 1 whole roll! 1 roll = 10 Polos.',
      targetValue: 10,
      acceptableAnswers: [10, '10'],
      unitSuffix: 'Polos',
    },
    {
      id: 'dash_roll_value',
      unitFocus: 'ten',
      obstacleIcon: '🎯',
      question: 'What is 1 roll worth in ones?',
      promptSpeech: 'What is one roll worth in ones?',
      equationPrompt: '1 roll = ___ ones',
      helperTip: 'A roll is a single bundle of 10 individual Polos. 1 roll = 10 ones!',
      targetValue: 10,
      acceptableAnswers: [10, '10'],
      unitSuffix: 'ones',
    },
    {
      id: 'dash_rolls_to_packet',
      unitFocus: 'hundred',
      obstacleIcon: '📦',
      question: 'How many rolls make 1 packet?',
      promptSpeech: 'How many rolls make one packet?',
      equationPrompt: '1 packet = ___ rolls',
      helperTip: 'Ten rolls of 10 bundle up to make 1 packet of 100! 1 packet = 10 rolls.',
      targetValue: 10,
      acceptableAnswers: [10, '10'],
      unitSuffix: 'rolls',
    },
    {
      id: 'dash_ones_in_packet',
      unitFocus: 'hundred',
      obstacleIcon: '🍬',
      question: 'How many ones are in 1 packet?',
      promptSpeech: 'How many ones are in one packet?',
      equationPrompt: '1 packet = ___ loose Polos',
      helperTip: '1 packet contains 10 rolls of 10. 10 × 10 = 100 loose Polos!',
      targetValue: 100,
      acceptableAnswers: [100, '100'],
      unitSuffix: 'Polos',
    },
    {
      id: 'dash_packets_to_carton',
      unitFocus: 'thousand',
      obstacleIcon: '🚚',
      question: 'How many packets make 1 carton?',
      promptSpeech: 'How many packets make one carton?',
      equationPrompt: '1 carton = ___ packets',
      helperTip: 'Ten packets of 100 make 1 big carton of 1,000! 1 carton = 10 packets.',
      targetValue: 10,
      acceptableAnswers: [10, '10'],
      unitSuffix: 'packets',
    },
    {
      id: 'dash_which_is_greater',
      unitFocus: 'comparison',
      obstacleIcon: '⚖️',
      question: 'Which is greater: 1 roll (10) or 9 individual Polos (9)? Type the greater value:',
      promptSpeech: 'Which is greater: 1 roll or 9 individual Polos? Type the greater value.',
      equationPrompt: 'Greater value = ___',
      helperTip: '1 roll is worth 10 ones. Since 10 > 9, type 10!',
      targetValue: 10,
      acceptableAnswers: [10, '10'],
      unitSuffix: '',
    },
    {
      id: 'dash_ones_in_carton',
      unitFocus: 'thousand',
      obstacleIcon: '🚚',
      question: 'How many ones are in 1 carton?',
      promptSpeech: 'How many ones are in one carton?',
      equationPrompt: '1 carton = ___ ones',
      helperTip: '1 carton holds 10 packets × 10 rolls × 10 ones = 1,000 ones!',
      targetValue: 1000,
      acceptableAnswers: [1000, '1000', '1,000'],
      unitSuffix: 'ones',
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
 * Minuend: 4 to 9
 * Subtrahend: 1 to (Minuend - 1)
 * Guaranteed: Minuend >= Subtrahend, single digit, no borrowing.
 * Direct typing: child types remaining Polos after takeaway.
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

  return {
    id: `l1_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 1,
    minuend: pick.minuend,
    subtrahend: pick.subtrahend,
    diff: pick.diff,
    targetValue: pick.diff,
    requiresBorrowing: false,
    instruction: `We have ${pick.minuend} Polos. Take away ${pick.subtrahend} Polos into the basket, then type how many remain!`,
    speech: `We have ${pick.minuend} Polos. Take away ${pick.subtrahend} Polos into the takeaway basket, then type how many remain.`,
    helperTip: `Count the Polos left on the plate! You had ${pick.minuend} and removed ${pick.subtrahend}.`,
    // Manipulative representations
    initialPolos: pick.minuend,
    polosToRemove: pick.subtrahend,
    remainingPolos: pick.diff,
  };
}

/**
 * Level 2: Two-Digit Minus One-Digit Without Borrowing
 * Minuend: Tens (2..5) + Ones (3..8) => 23 to 58
 * Subtrahend: 1 to Math.min(Ones, 6) (guarantees ones >= subtrahend, ZERO borrowing)
 * Difference: (Tens * 10) + (Ones - Subtrahend)
 * Direct typing: child types remaining total after removing loose ones.
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

  return {
    id: `l2_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 2,
    tens: pick.tens,
    ones: pick.ones,
    minuend: pick.minuend,
    subtrahend: pick.subtrahend,
    diff: pick.diff,
    targetValue: pick.diff,
    requiresBorrowing: false,
    instruction: `We have ${pick.minuend} (${pick.tens} rolls and ${pick.ones} loose Polos). Take away ${pick.subtrahend} loose Polos, then type the remaining total!`,
    speech: `We have ${pick.minuend}. That is ${pick.tens} rolls and ${pick.ones} loose Polos. Take away ${pick.subtrahend} loose Polos, then type the total left.`,
    helperTip: `Keep the ${pick.tens} rolls (${pick.tens * 10}) intact! Just subtract the ones: ${pick.ones} − ${pick.subtrahend} = ${pick.ones - pick.subtrahend}. Add them together: ${pick.tens * 10 + (pick.ones - pick.subtrahend)}!`,
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
 * Minuend: Tens (2..5) + Ones (1..5)
 * Subtrahend: (Ones + 2) to 9 (guaranteed Ones < Subtrahend => MUST borrow 1 ten)
 * Multi-Step Typed Validation:
 *   Step 1: Child breaks 1 roll, then types loose Polos available: (ones + 10).
 *   Step 2: Child removes subtrahend loose Polos, then types remaining loose Polos: (ones + 10) - subtrahend.
 *   Step 3: Child types final complete answer: diff.
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
    instruction: `We need to take away ${pick.subtrahend} Polos, but only have ${pick.ones} loose Polos! Tap a roll to break it into 10 loose Polos.`,
    speech: `We need to take away ${pick.subtrahend} Polos, but we only have ${pick.ones} loose Polos. Tap a roll to break it into 10 loose Polos!`,
    // Step targets for typed validation
    step1Target: pick.ones + 10, // Loose Polos after breaking roll
    step1Helper: `We started with ${pick.ones} loose Polos and broke 1 roll into 10 more Polos. ${pick.ones} + 10 = ${pick.ones + 10}!`,
    step2Target: (pick.ones + 10) - pick.subtrahend, // Loose Polos remaining after takeaway
    step2Helper: `Take away ${pick.subtrahend} loose Polos from ${pick.ones + 10}. ${pick.ones + 10} − ${pick.subtrahend} = ${(pick.ones + 10) - pick.subtrahend}!`,
    step3Target: pick.diff, // Final answer
    step3Helper: `Combine ${pick.tens - 1} rolls (${(pick.tens - 1) * 10}) and ${(pick.ones + 10) - pick.subtrahend} loose Polos. ${(pick.tens - 1) * 10} + ${(pick.ones + 10) - pick.subtrahend} = ${pick.diff}!`,
    // Manipulative representations
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
 * Self-validation function verifying mathematical integrity across random problems.
 */
export function validateAllPolotasticGenerators() {
  const errors = [];

  // 1. Validate Level 1 (single-digit, no borrowing, minuend >= subtrahend)
  for (let i = 0; i < 30; i++) {
    const q = generateLevel1Question();
    if (q.minuend < 1 || q.minuend > 9) errors.push(`L1 minuend ${q.minuend} not 1..9`);
    if (q.subtrahend >= q.minuend) errors.push(`L1 subtrahend ${q.subtrahend} >= minuend ${q.minuend}`);
    if (q.minuend - q.subtrahend !== q.diff) errors.push(`L1 math mismatch ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
    if (q.targetValue !== q.diff) errors.push(`L1 targetValue mismatch`);
    if (q.requiresBorrowing) errors.push(`L1 flagged requiresBorrowing`);
  }

  // 2. Validate Level 2 (two-digit minus one-digit, no borrowing, ones >= subtrahend)
  for (let i = 0; i < 30; i++) {
    const q = generateLevel2Question();
    if (q.minuend < 10 || q.minuend > 99) errors.push(`L2 minuend ${q.minuend} not 2 digits`);
    if (q.ones < q.subtrahend) errors.push(`L2 ones ${q.ones} < subtrahend ${q.subtrahend} (accidental borrowing)`);
    if (q.minuend - q.subtrahend !== q.diff) errors.push(`L2 math mismatch ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
    if (q.targetValue !== q.diff) errors.push(`L2 targetValue mismatch`);
  }

  // 3. Validate Level 3 (two-digit minus one-digit WITH borrowing, multi-step targets)
  for (let i = 0; i < 40; i++) {
    const q = generateLevel3Question();
    if (q.ones >= q.subtrahend) errors.push(`L3 ones ${q.ones} >= subtrahend ${q.subtrahend} (borrowing missing)`);
    if (q.afterBorrowRolls !== q.tens - 1) errors.push(`L3 afterBorrowRolls incorrect`);
    if (q.afterBorrowLoosePolos !== q.ones + 10) errors.push(`L3 afterBorrowLoosePolos incorrect`);
    if (q.step1Target !== q.ones + 10) errors.push(`L3 step1Target incorrect`);
    if (q.step2Target !== (q.ones + 10) - q.subtrahend) errors.push(`L3 step2Target incorrect`);
    if (q.step3Target !== q.diff) errors.push(`L3 step3Target incorrect`);
    if (q.afterBorrowRolls * 10 + q.afterBorrowLoosePolos !== q.minuend) {
      errors.push(`L3 value changed during regrouping!`);
    }
    const finalVal = q.finalRolls * 10 + q.remainingLoose;
    if (finalVal !== q.diff) errors.push(`L3 final remaining mismatch: ${finalVal} !== ${q.diff}`);
  }

  // 4. Validate Polo Dash course (direct typing questions)
  const dashCourse = generatePoloDashCourse();
  if (dashCourse.length < 5) errors.push(`Polo Dash course has fewer than 5 obstacles`);
  for (const obs of dashCourse) {
    if (!obs.targetValue) errors.push(`Polo Dash obstacle ${obs.id} missing targetValue`);
    if (!obs.equationPrompt) errors.push(`Polo Dash obstacle ${obs.id} missing equationPrompt`);
  }

  if (errors.length > 0) {
    console.error('Polotastic Generator Validation Failed:', errors);
    return false;
  }
  return true;
}

// Auto-run validation
validateAllPolotasticGenerators();
