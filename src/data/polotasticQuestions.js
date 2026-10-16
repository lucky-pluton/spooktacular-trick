/**
 * Polotastic Mathematical Curriculum and Question Generator
 * Complete 9-Level Progression Through Four-Digit Subtraction
 * 
 * Place-Value Units:
 * - 1 Polo = 1 One
 * - 1 Roll = 10 Polos = 1 Ten
 * - 1 Packet = 10 Rolls = 1 Hundred (100 Ones)
 * - 1 Carton = 10 Packets = 1 Thousand (1,000 Ones)
 * 
 * Levels:
 * 1. Polo Takeaway: 1-digit minus 1-digit, no borrowing (e.g. 8 - 3, 9 - 4)
 * 2. Roll & Remove: 2-digit minus 1-digit, no borrowing (e.g. 24 - 3, 48 - 6)
 * 3. Break a Roll: 2-digit minus 1-digit with borrowing from tens (e.g. 32 - 7, 41 - 6)
 * 4. Two-Digit Takeaway: 2-digit minus 2-digit with & without borrowing (e.g. 54 - 21, 52 - 27, 32 - 17)
 * 5. Packet Breaker: 3-digit minus 2/3-digit with borrowing from hundreds or tens (e.g. 324 - 157, 462 - 184)
 * 6. The Empty Tens Challenge: 3-digit with zero in tens/ones, cascading borrowing (e.g. 500 - 36, 702 - 158)
 * 7. Carton Breaker: 4-digit minus 3-digit with borrowing across place values (e.g. 1,234 - 567, 2,345 - 678)
 * 8. Thousand-Level Mastery: 4-digit subtraction with borrowing across zeros (e.g. 4,000 - 1,256, 5,032 - 2,768)
 * 9. Polotastic Grand Challenge: Mixed 4-digit subtraction combining multiple borrowing patterns
 */

export const POLO_UNITS = {
  ONE: { id: 'ones', name: 'Polo', plural: 'Polos', value: 1, label: '1 One', icon: '🍬', colHeader: 'O' },
  TEN: { id: 'tens', name: 'Roll', plural: 'Rolls', value: 10, label: '1 Ten = 10 Ones', icon: '🥖', colHeader: 'T' },
  HUNDRED: { id: 'hundreds', name: 'Packet', plural: 'Packets', value: 100, label: '1 Hundred = 10 Tens', icon: '📦', colHeader: 'H' },
  THOUSAND: { id: 'thousands', name: 'Carton', plural: 'Cartons', value: 1000, label: '1 Thousand = 10 Hundreds', icon: '🚚', colHeader: 'Th' },
};

export const PLACE_COLUMNS = ['ones', 'tens', 'hundreds', 'thousands'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Computes column digits and step-by-step borrowing cascades for any valid problem.
 * Ensures strict conservation of mathematical value across intermediate exchanges.
 */
export function analyzeSubtractionProblem(minuend, subtrahend, numDigits = null) {
  if (minuend < subtrahend) {
    throw new Error(`Minuend (${minuend}) must be >= Subtrahend (${subtrahend})`);
  }

  const diff = minuend - subtrahend;
  const digitsCount = numDigits || Math.max(minuend.toString().length, subtrahend.toString().length, 1);

  // Column representations (right to left: ones, tens, hundreds, thousands)
  const columns = [];
  let tempM = minuend;
  let tempS = subtrahend;

  for (let i = 0; i < digitsCount; i++) {
    const colKey = PLACE_COLUMNS[i];
    const unit = POLO_UNITS[colKey.toUpperCase().replace(/S$/, '')] || POLO_UNITS.ONE;
    const mDigit = tempM % 10;
    const sDigit = tempS % 10;
    columns.push({
      id: colKey,
      index: i,
      name: colKey.charAt(0).toUpperCase() + colKey.slice(1),
      unitName: unit.name,
      pluralName: unit.plural,
      unitValue: unit.value,
      icon: unit.icon,
      header: unit.colHeader,
      mDigit,
      sDigit,
      diffDigit: (mDigit - sDigit + 10) % 10,
    });
    tempM = Math.floor(tempM / 10);
    tempS = Math.floor(tempS / 10);
  }

  // Precompute full borrowing simulation right-to-left
  // Working digits track the active containers in each column
  const workingDigits = columns.map((c) => c.mDigit);
  const intermediateSteps = [];
  let anyBorrowRequired = false;

  for (let col = 0; col < digitsCount; col++) {
    const sVal = columns[col].sDigit;

    if (workingDigits[col] < sVal) {
      anyBorrowRequired = true;
      // Need to borrow! Find the next non-empty column to the left
      let donorCol = col + 1;
      while (donorCol < digitsCount && workingDigits[donorCol] === 0) {
        donorCol++;
      }

      if (donorCol >= digitsCount) {
        throw new Error(`Cannot borrow: no non-empty column left for column ${col}`);
      }

      // Step-by-step cascading exchange from donorCol down to col
      for (let c = donorCol; c > col; c--) {
        const fromCol = c;
        const toCol = c - 1;
        const beforeDigits = [...workingDigits];
        workingDigits[fromCol] -= 1;
        workingDigits[toCol] += 10;

        intermediateSteps.push({
          type: 'exchange',
          targetCol: col,
          targetColId: columns[col].id,
          fromCol,
          toCol,
          fromColId: columns[fromCol].id,
          toColId: columns[toCol].id,
          fromColName: columns[fromCol].name,
          toColName: columns[toCol].name,
          fromUnit: columns[fromCol].unitName,
          toUnit: columns[toCol].unitName,
          beforeDigits,
          afterDigits: [...workingDigits],
          description: `Exchange 1 ${columns[fromCol].unitName} from ${columns[fromCol].name} into 10 ${columns[toCol].pluralName} in ${columns[toCol].name}.`,
        });
      }
    }

    // Now workingDigits[col] >= sVal, perform column subtraction
    const rem = workingDigits[col] - sVal;
    const colDiff = rem;
    intermediateSteps.push({
      type: 'subtract',
      col,
      colId: columns[col].id,
      colName: columns[col].name,
      available: workingDigits[col],
      subtracting: sVal,
      remaining: colDiff,
      workingDigits: [...workingDigits],
      prompt: `In the ${columns[col].name} column, subtract ${sVal} from ${workingDigits[col]}.`,
      description: `In the ${columns[col].name} column: subtract ${sVal} from ${workingDigits[col]}. How many ${columns[col].pluralName} remain?`,
      workedSolution: `In the ${columns[col].name} column: ${workingDigits[col]} − ${sVal} = ${colDiff}.`,
    });
    workingDigits[col] = rem;
  }

  return {
    minuend,
    subtrahend,
    diff,
    numDigits: digitsCount,
    columns,
    requiresBorrowing: anyBorrowRequired,
    intermediateSteps,
  };
}

/**
 * Prerequisite Runner Course Generator
 */
export function generatePoloDashCourse() {
  return [
    {
      id: 'dash_ones_to_roll',
      unitFocus: 'ten',
      obstacleIcon: '🥖',
      question: 'How many loose Polos make 1 roll?',
      promptSpeech: 'How many loose Polos make one roll?',
      equationPrompt: '1 roll = ___ loose Polos',
      helperTip: 'Count how many loose ones fit into 1 standard roll bundle!',
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
      helperTip: 'Remember place value: 1 ten roll equals how many loose ones?',
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
      helperTip: 'Count how many tens rolls are packed together into 1 hundred packet.',
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
      helperTip: '1 packet contains 10 rolls of 10. Count by tens up to one hundred!',
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
      helperTip: 'Count how many hundred packets fit into 1 delivery carton.',
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
      helperTip: 'Compare the values: 1 roll has 10 Polos, while 9 loose Polos is only 9.',
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
      helperTip: '1 carton holds 10 packets of 100 Polos. Count by hundreds up to a carton!',
      targetValue: 1000,
      acceptableAnswers: [1000, '1000', '1,000'],
      unitSuffix: 'ones',
    },
  ];
}

// ==========================================
// LEVEL 1: Polo Takeaway (1-digit, no borrow)
// ==========================================
export function generateLevel1Question(excludeKeys = []) {
  const candidates = [];
  for (let m = 4; m <= 9; m++) {
    for (let s = 1; s < m; s++) {
      const key = `${m}-${s}`;
      if (!excludeKeys.includes(key)) {
        candidates.push({ m, s, key });
      }
    }
  }
  const pick = candidates.length > 0 ? candidates[randomInt(0, candidates.length - 1)] : { m: 8, s: 3, key: '8-3' };
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 1);

  return {
    ...analysis,
    id: `l1_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 1,
    title: 'Level 1: Polo Takeaway',
    targetValue: analysis.diff,
    instruction: `We have ${pick.m} Polos. Take away ${pick.s} Polos into the basket, then type how many remain!`,
    speech: `We have ${pick.m} Polos. Take away ${pick.s} Polos into the takeaway basket, then type how many remain.`,
    helperTip: `Count the Polos left on the plate! You had ${pick.m} and removed ${pick.s}.`,
    initialPolos: pick.m,
    polosToRemove: pick.s,
    remainingPolos: analysis.diff,
  };
}

// ==========================================
// LEVEL 2: Roll & Remove (2-digit - 1-digit, no borrow)
// ==========================================
export function generateLevel2Question(excludeKeys = []) {
  const candidates = [];
  for (let t = 2; t <= 5; t++) {
    for (let o = 3; o <= 8; o++) {
      for (let s = 1; s <= Math.min(o, 6); s++) {
        const m = t * 10 + o;
        const key = `${m}-${s}`;
        if (!excludeKeys.includes(key)) {
          candidates.push({ t, o, m, s, key });
        }
      }
    }
  }
  const pick = candidates.length > 0 ? candidates[randomInt(0, candidates.length - 1)] : { t: 2, o: 4, m: 24, s: 3, key: '24-3' };
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 2);

  return {
    ...analysis,
    id: `l2_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 2,
    title: 'Level 2: Roll & Remove',
    tens: pick.t,
    ones: pick.o,
    targetValue: analysis.diff,
    instruction: `We have ${pick.m} (${pick.t} rolls and ${pick.o} loose Polos). Take away ${pick.s} loose Polos, then type the remaining total!`,
    speech: `We have ${pick.m}. That is ${pick.t} rolls and ${pick.o} loose Polos. Take away ${pick.s} loose Polos, then type the total left.`,
    helperTip: `Keep the ${pick.t} rolls intact and focus on the ones: subtract ${pick.s} loose Polos from ${pick.o} loose Polos.`,
    initialRolls: pick.t,
    initialLoosePolos: pick.o,
    looseToRemove: pick.s,
    remainingRolls: pick.t,
    remainingLoose: pick.o - pick.s,
  };
}

// ==========================================
// LEVEL 3: Break a Roll (2-digit - 1-digit with borrow)
// ==========================================
export function generateLevel3Question(excludeKeys = []) {
  const candidates = [];
  for (let t = 2; t <= 5; t++) {
    for (let o = 1; o <= 5; o++) {
      for (let s = o + 2; s <= 9; s++) {
        const m = t * 10 + o;
        const key = `${m}-${s}`;
        if (!excludeKeys.includes(key)) {
          candidates.push({ t, o, m, s, key });
        }
      }
    }
  }
  const pick = candidates.length > 0 ? candidates[randomInt(0, candidates.length - 1)] : { t: 3, o: 2, m: 32, s: 7, key: '32-7' };
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 2);

  return {
    ...analysis,
    id: `l3_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 3,
    title: 'Level 3: Break a Roll!',
    tens: pick.t,
    ones: pick.o,
    targetValue: analysis.diff,
    instruction: `We need to take away ${pick.s} Polos, but only have ${pick.o} loose Polos! Tap a roll to break it into 10 loose Polos.`,
    speech: `We need to take away ${pick.s} Polos, but we only have ${pick.o} loose Polos. Tap a roll to break it into 10 loose Polos!`,
    step1Target: pick.o + 10,
    step1Helper: `Add 10 loose Polos from the broken roll to your starting ${pick.o} ones. How many loose Polos do you have now?`,
    step2Target: (pick.o + 10) - pick.s,
    step2Helper: `Take away ${pick.s} from the loose Polos. Count how many loose Polos are left.`,
    step3Target: analysis.diff,
    step3Helper: `Combine the remaining ${pick.t - 1} rolls with the remaining loose Polos to find the total!`,
    initialRolls: pick.t,
    initialLoosePolos: pick.o,
    afterBorrowRolls: pick.t - 1,
    afterBorrowLoosePolos: pick.o + 10,
    looseToRemove: pick.s,
    remainingLoose: (pick.o + 10) - pick.s,
    finalRolls: pick.t - 1,
  };
}

// ==========================================
// LEVEL 4: Two-Digit Takeaway (2-digit - 2-digit, with and without borrow)
// ==========================================
export function generateLevel4Question(excludeKeys = []) {
  const candidates = [];
  // Mix of questions with borrowing and without borrowing
  for (let mt = 3; mt <= 7; mt++) {
    for (let mo = 1; mo <= 8; mo++) {
      for (let st = 1; st < mt; st++) {
        for (let so = 1; so <= 9; so++) {
          const m = mt * 10 + mo;
          const s = st * 10 + so;
          if (m > s && m - s >= 10) {
            const key = `${m}-${s}`;
            if (!excludeKeys.includes(key)) {
              candidates.push({ m, s, key, hasBorrow: mo < so });
            }
          }
        }
      }
    }
  }

  // Ensure healthy balance of borrowing questions
  const pool = candidates.length > 0 ? candidates : [
    { m: 52, s: 27, key: '52-27', hasBorrow: true },
    { m: 32, s: 17, key: '32-17', hasBorrow: true },
    { m: 54, s: 21, key: '54-21', hasBorrow: false },
    { m: 63, s: 28, key: '63-28', hasBorrow: true },
    { m: 47, s: 23, key: '47-23', hasBorrow: false },
  ];

  const pick = pool[randomInt(0, pool.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 2);

  return {
    ...analysis,
    id: `l4_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 4,
    title: 'Level 4: Two-Digit Takeaway',
    targetValue: analysis.diff,
    instruction: `Subtract ${pick.s} from ${pick.m}. Check the ones column first: do you need to break a roll?`,
    speech: `Subtract ${pick.s} from ${pick.m}. Solve column by column, starting with the ones!`,
    helperTip: pick.hasBorrow
      ? `The ones column needs borrowing: exchange 1 roll for 10 loose Polos before subtracting!`
      : `You have enough loose Polos in the ones column, so no borrowing is needed!`,
  };
}

// ==========================================
// LEVEL 5: Packet Breaker (3-digit with borrowing from hundreds or tens)
// ==========================================
export function generateLevel5Question(excludeKeys = []) {
  const candidates = [
    { m: 324, s: 157, key: '324-157' },
    { m: 462, s: 184, key: '462-184' },
    { m: 531, s: 268, key: '531-268' },
    { m: 425, s: 168, key: '425-168' },
    { m: 652, s: 285, key: '652-285' },
    { m: 381, s: 194, key: '381-194' },
    { m: 512, s: 247, key: '512-247' },
    { m: 436, s: 179, key: '436-179' },
  ];

  // Also dynamically generate 3-digit problems requiring borrowing from hundreds to tens
  for (let h = 3; h <= 6; h++) {
    for (let t = 1; t <= 4; t++) {
      for (let o = 2; o <= 6; o++) {
        const sh = randomInt(1, h - 1);
        const st = randomInt(t + 2, 8);
        const so = randomInt(o + 2, 9);
        const m = h * 100 + t * 10 + o;
        const s = sh * 100 + st * 10 + so;
        const key = `${m}-${s}`;
        if (!excludeKeys.includes(key)) {
          candidates.push({ m, s, key });
        }
      }
    }
  }

  const pick = candidates[randomInt(0, candidates.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 3);

  return {
    ...analysis,
    id: `l5_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 5,
    title: 'Level 5: Packet Breaker',
    targetValue: analysis.diff,
    instruction: `Subtract ${pick.s} from ${pick.m}. Break Packets into Rolls and Rolls into Polos when needed!`,
    speech: `Subtract ${pick.s} from ${pick.m}. Remember: 1 Packet exchanges for 10 Rolls!`,
    helperTip: `Whenever a column is short, exchange 1 container from the next column to the left! 1 Packet = 10 Rolls, and 1 Roll = 10 Polos.`,
  };
}

// ==========================================
// LEVEL 6: The Empty Tens Challenge (3-digit with zero in tens/ones, cascading borrow)
// ==========================================
export function generateLevel6Question(excludeKeys = []) {
  const candidates = [
    { m: 500, s: 36, key: '500-36' },
    { m: 702, s: 158, key: '702-158' },
    { m: 600, s: 147, key: '600-147' },
    { m: 805, s: 239, key: '805-239' },
    { m: 400, s: 165, key: '400-165' },
    { m: 901, s: 348, key: '901-348' },
    { m: 700, s: 254, key: '700-254' },
    { m: 504, s: 178, key: '504-178' },
  ];

  // Dynamic zero-minuend generator
  for (let h = 4; h <= 8; h++) {
    const m = h * 100; // e.g. 400, 500, 600
    const s = randomInt(2, 6) * 10 + randomInt(3, 9); // e.g. 36, 47, 58
    const key = `${m}-${s}`;
    if (!excludeKeys.includes(key)) {
      candidates.push({ m, s, key });
    }
  }

  const pick = candidates[randomInt(0, candidates.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 3);

  return {
    ...analysis,
    id: `l6_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 6,
    title: 'Level 6: The Empty Tens Challenge',
    targetValue: analysis.diff,
    instruction: `Subtract ${pick.s} from ${pick.m}. Since the tens column has 0, borrow from the hundreds packet first!`,
    speech: `Subtract ${pick.s} from ${pick.m}. When tens has zero, borrow from the hundreds first to make 10 tens!`,
    helperTip: `For ${pick.m} − ${pick.s}: First exchange 1 Packet (100) into 10 Rolls (tens). Then exchange 1 Roll into 10 loose Polos!`,
  };
}

// ==========================================
// LEVEL 7: Carton Breaker (4-digit minus 3-digit with borrowing across place values)
// ==========================================
export function generateLevel7Question(excludeKeys = []) {
  const candidates = [
    { m: 1234, s: 567, key: '1234-567' },
    { m: 2345, s: 678, key: '2345-678' },
    { m: 1423, s: 785, key: '1423-785' },
    { m: 2154, s: 689, key: '2154-689' },
    { m: 3241, s: 856, key: '3241-856' },
    { m: 1532, s: 748, key: '1532-748' },
    { m: 2415, s: 837, key: '2415-837' },
  ];

  // Dynamic 4-digit minus 3-digit generator
  for (let th = 1; th <= 3; th++) {
    const h = randomInt(1, 4);
    const t = randomInt(1, 5);
    const o = randomInt(1, 5);
    const m = th * 1000 + h * 100 + t * 10 + o;
    const s = randomInt(5, 8) * 100 + randomInt(6, 9) * 10 + randomInt(6, 9);
    const key = `${m}-${s}`;
    if (!excludeKeys.includes(key)) {
      candidates.push({ m, s, key });
    }
  }

  const pick = candidates[randomInt(0, candidates.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 4);

  return {
    ...analysis,
    id: `l7_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 7,
    title: 'Level 7: Carton Breaker',
    targetValue: analysis.diff,
    instruction: `Subtract ${pick.s} from ${pick.m}. Break Cartons into Packets (1,000 → 10 Hundreds) to borrow across all four columns!`,
    speech: `Subtract ${pick.s} from ${pick.m}. 1 Carton equals 10 Packets. You can borrow across all four place values!`,
    helperTip: `Work from right to left: Ones, Tens, Hundreds, Thousands. Exchange 1 Carton for 10 Packets when hundreds run short!`,
  };
}

// ==========================================
// LEVEL 8: Thousand-Level Mastery (4-digit with zeros and multi-step cascade)
// ==========================================
export function generateLevel8Question(excludeKeys = []) {
  const candidates = [
    { m: 4000, s: 1256, key: '4000-1256' },
    { m: 5032, s: 2768, key: '5032-2768' },
    { m: 3000, s: 1475, key: '3000-1475' },
    { m: 6005, s: 2438, key: '6005-2438' },
    { m: 5000, s: 2364, key: '5000-2364' },
    { m: 7040, s: 3582, key: '7040-3582' },
    { m: 8000, s: 3429, key: '8000-3429' },
  ];

  // Dynamic thousand zeros generator
  for (let th = 3; th <= 7; th++) {
    const m = th * 1000; // e.g. 3000, 4000, 5000
    const s = randomInt(1, th - 1) * 1000 + randomInt(2, 6) * 100 + randomInt(3, 8) * 10 + randomInt(4, 9);
    const key = `${m}-${s}`;
    if (!excludeKeys.includes(key)) {
      candidates.push({ m, s, key });
    }
  }

  const pick = candidates[randomInt(0, candidates.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 4);

  return {
    ...analysis,
    id: `l8_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 8,
    title: 'Level 8: Thousand-Level Mastery',
    targetValue: analysis.diff,
    instruction: `Subtract ${pick.s} from ${pick.m}. Cascade your borrowing all the way from Thousands down through Hundreds and Tens to Ones!`,
    speech: `Subtract ${pick.s} from ${pick.m}. Watch the cascade: 1 Carton becomes 10 Packets, 1 Packet becomes 10 Rolls, and 1 Roll becomes 10 Polos!`,
    helperTip: `For ${pick.m}: Thousands exchanges to Hundreds (10), then Hundreds exchanges to Tens (9 left in hundreds, 10 in tens), then Tens exchanges to Ones (9 left in tens, 10 in ones)!`,
  };
}

// ==========================================
// LEVEL 9: Polotastic Grand Challenge (Mixed complex 4-digit subtraction)
// ==========================================
export function generateLevel9Question(excludeKeys = []) {
  const candidates = [
    { m: 5032, s: 2768, key: '5032-2768' },
    { m: 6241, s: 3589, key: '6241-3589' },
    { m: 7104, s: 2836, key: '7104-2836' },
    { m: 4000, s: 1256, key: '4000-1256' },
    { m: 8325, s: 4578, key: '8325-4578' },
    { m: 9020, s: 4683, key: '9020-4683' },
    { m: 5123, s: 3679, key: '5123-3679' },
    { m: 6000, s: 2845, key: '6000-2845' },
    { m: 7450, s: 3874, key: '7450-3874' },
    { m: 3412, s: 1675, key: '3412-1675' },
    { m: 8050, s: 4382, key: '8050-4382' },
    { m: 4205, s: 1839, key: '4205-1839' },
    { m: 6314, s: 2587, key: '6314-2587' },
    { m: 5002, s: 1674, key: '5002-1674' },
  ];

  // Dynamic generator for 4-digit mixed problems
  for (let attempt = 0; attempt < 25; attempt++) {
    const thM = randomInt(3, 9);
    const thS = randomInt(1, thM - 1);
    const pattern = randomInt(1, 3);
    let m, s;
    if (pattern === 1) {
      // Zero in tens or hundreds
      const hasZeroInTens = Math.random() < 0.5;
      const hM = hasZeroInTens ? randomInt(1, 8) : 0;
      const tM = hasZeroInTens ? 0 : randomInt(1, 8);
      const oM = randomInt(1, 5);
      m = thM * 1000 + hM * 100 + tM * 10 + oM;
      s = thS * 1000 + randomInt(hM + 1, 9) * 100 + randomInt(5, 9) * 10 + randomInt(6, 9);
    } else if (pattern === 2) {
      // Pure thousand zero: e.g. 5000 - 2478
      m = thM * 1000;
      s = thS * 1000 + randomInt(2, 8) * 100 + randomInt(3, 8) * 10 + randomInt(4, 9);
    } else {
      // Multi-column borrow without zero: e.g. 6241 - 3589
      m = thM * 1000 + randomInt(1, 4) * 100 + randomInt(1, 4) * 10 + randomInt(1, 4);
      s = thS * 1000 + randomInt(5, 9) * 100 + randomInt(5, 9) * 10 + randomInt(5, 9);
    }

    if (m > s) {
      const key = `${m}-${s}`;
      if (!excludeKeys.includes(key)) {
        candidates.push({ m, s, key });
      }
    }
  }

  const pick = candidates[randomInt(0, candidates.length - 1)];
  const analysis = analyzeSubtractionProblem(pick.m, pick.s, 4);

  return {
    ...analysis,
    id: `l9_${pick.key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: pick.key,
    level: 9,
    title: 'Level 9: Polotastic Grand Challenge',
    targetValue: analysis.diff,
    instruction: `Grand Challenge: Subtract ${pick.s} from ${pick.m}. Combine everything you know about Polo place-value borrowing!`,
    speech: `Polotastic Grand Challenge! Solve ${pick.m} minus ${pick.s} by typing each step accurately.`,
    helperTip: `Break down the problem column-by-column from Ones to Thousands. If a column is empty or doesn't have enough containers, borrow from the next column with available containers!`,
  };
}

/**
 * Universal Level Question Dispatcher
 */
export function generateQuestionForLevel(levelNumber, excludeKeys = []) {
  switch (levelNumber) {
    case 1:
      return generateLevel1Question(excludeKeys);
    case 2:
      return generateLevel2Question(excludeKeys);
    case 3:
      return generateLevel3Question(excludeKeys);
    case 4:
      return generateLevel4Question(excludeKeys);
    case 5:
      return generateLevel5Question(excludeKeys);
    case 6:
      return generateLevel6Question(excludeKeys);
    case 7:
      return generateLevel7Question(excludeKeys);
    case 8:
      return generateLevel8Question(excludeKeys);
    case 9:
    default:
      return generateLevel9Question(excludeKeys);
  }
}

/**
 * Self-validation verifying mathematical integrity across all 9 levels and zero-borrowing cascades.
 */
export function validateAllPolotasticGenerators() {
  const errors = [];

  // Validate each level from 1 through 9 with 20 randomized tests each
  for (let lvl = 1; lvl <= 9; lvl++) {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestionForLevel(lvl);
      if (q.minuend < q.subtrahend) {
        errors.push(`Level ${lvl}: minuend ${q.minuend} < subtrahend ${q.subtrahend}`);
      }
      if (q.minuend - q.subtrahend !== q.diff) {
        errors.push(`Level ${lvl}: math mismatch ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
      }
      if (q.targetValue !== q.diff) {
        errors.push(`Level ${lvl}: targetValue ${q.targetValue} !== diff ${q.diff}`);
      }

      // Check that intermediate steps correctly conserve total value
      for (const step of q.intermediateSteps) {
        if (step.type === 'exchange') {
          const beforeSum = step.beforeDigits.reduce((acc, d, idx) => acc + d * Math.pow(10, idx), 0);
          const afterSum = step.afterDigits.reduce((acc, d, idx) => acc + d * Math.pow(10, idx), 0);
          if (beforeSum !== afterSum) {
            errors.push(`Level ${lvl} exchange broke value conservation: ${beforeSum} !== ${afterSum}`);
          }
        }
      }
    }
  }

  // Validate Polo Dash course
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
