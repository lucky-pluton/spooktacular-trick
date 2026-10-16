/**
 * Math O' Lantern Educational Data & Problem Generator
 * Teaches subtraction through counting up, number jumps, and reaching friendly benchmark numbers.
 * 
 * Ghostie starts at the subtrahend (smaller number) and travels forward to the minuend (destination).
 * The accumulated lantern jumps equal the exact difference!
 * 
 * Includes:
 * 1. Explicit prerequisite rules for challenge progression.
 * 2. Runtime dynamic problem generation with random numbers for tutorial and all challenges.
 * 3. Dynamic jump calculation, pedagogical distractor choices, and feedback.
 * 4. Recent history tracking to avoid duplicate questions.
 */

/**
 * Explicit Prerequisite Rules for Math O' Lantern Challenges
 * Every challenge after the starting challenge is gated by an explicit prerequisite.
 */
export const PREREQUISITE_RULES = [
  {
    levelNumber: 0,
    id: 'tutorial',
    title: 'Tutorial',
    prerequisiteLevel: null,
    prerequisiteTitle: null,
    description: 'Learn the counting-up method with Ghostie & Witchy',
  },
  {
    levelNumber: 1,
    id: 'challenge_1',
    title: 'Challenge 1',
    prerequisiteLevel: null, // Challenge 1 is available from the beginning to a new learner!
    prerequisiteTitle: null,
    description: 'Gentle starter trail to friendly hundreds (e.g. 400 or 500)',
  },
  {
    levelNumber: 2,
    id: 'challenge_2',
    title: 'Challenge 2',
    prerequisiteLevel: 1, // Requires successful completion of Challenge 1
    prerequisiteTitle: 'Challenge 1',
    description: 'Explore jumping through friendly tens and hundreds to 300-500',
  },
  {
    levelNumber: 3,
    id: 'challenge_3',
    title: 'Challenge 3',
    prerequisiteLevel: 2, // Requires successful completion of Challenge 2
    prerequisiteTitle: 'Challenge 2',
    description: 'Sharpen your precision jumps with tricky ones digits',
  },
  {
    levelNumber: 4,
    id: 'challenge_4',
    title: 'Challenge 4',
    prerequisiteLevel: 3, // Requires successful completion of Challenge 3
    prerequisiteTitle: 'Challenge 3',
    description: 'Hop through higher tens to reach 500, 600, and 700',
  },
  {
    levelNumber: 5,
    id: 'challenge_5',
    title: 'Challenge 5',
    prerequisiteLevel: 4, // Requires successful completion of Challenge 4
    prerequisiteTitle: 'Challenge 4',
    description: 'The Grand Trailblazer Finale with big jumps up to 800',
  },
];

/**
 * Checks whether a given level is currently unlocked based on completed levels.
 * Level 0 (Tutorial) and Level 1 (Challenge 1) are always unlocked.
 * Higher challenges require completion of their explicit prerequisite.
 */
export function isLevelUnlocked(levelNumber, completedLevels = []) {
  if (levelNumber === 0 || levelNumber === 1) return true;
  const rule = PREREQUISITE_RULES.find((r) => r.levelNumber === levelNumber);
  if (!rule || rule.prerequisiteLevel === null) return true;
  return completedLevels.includes(rule.prerequisiteLevel);
}

/**
 * Returns a child-friendly explanation when a child clicks a locked challenge.
 */
export function getPrerequisiteNotice(levelNumber) {
  const rule = PREREQUISITE_RULES.find((r) => r.levelNumber === levelNumber);
  if (!rule || rule.prerequisiteLevel === null) return null;
  const reqTitle = rule.prerequisiteTitle || `Challenge ${rule.prerequisiteLevel}`;
  return `🔒 Challenge ${levelNumber} is locked! Complete ${reqTitle} to unlock this lantern adventure! 🎃`;
}

const COMPLETED_LEVELS_STORAGE_KEY = 'spooktacular_math_o_lantern_completed_levels';
const LEGACY_UNLOCKED_STORAGE_KEY = 'spooktacular_math_o_lantern_unlocked_level';

/**
 * Loads saved completed levels from localStorage, maintaining backward compatibility.
 */
export function getSavedCompletedLevels() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(COMPLETED_LEVELS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(Number);
    }
    // Backward compatibility with previous unlocked_level scalar
    const legacy = localStorage.getItem(LEGACY_UNLOCKED_STORAGE_KEY);
    if (legacy !== null) {
      const lvl = parseInt(legacy, 10);
      const res = [];
      for (let i = 0; i < lvl; i++) res.push(i);
      return res;
    }
  } catch {
    // LocalStorage error fallback
  }
  return [];
}

/**
 * Saves a completed level, adds to completed set, and updates legacy unlocked level.
 */
export function saveCompletedLevel(levelNumber) {
  if (typeof window === 'undefined' || !window.localStorage) return [levelNumber];
  try {
    const current = getSavedCompletedLevels();
    if (!current.includes(levelNumber)) {
      const updated = [...current, levelNumber];
      localStorage.setItem(COMPLETED_LEVELS_STORAGE_KEY, JSON.stringify(updated));
      const highestUnlocked = Math.max(1, ...updated.map((n) => n + 1));
      localStorage.setItem(LEGACY_UNLOCKED_STORAGE_KEY, String(highestUnlocked));
      return updated;
    }
    return current;
  } catch {
    return [levelNumber];
  }
}

/**
 * Resets all saved progress.
 */
export function resetAllProgress() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(COMPLETED_LEVELS_STORAGE_KEY);
    localStorage.removeItem(LEGACY_UNLOCKED_STORAGE_KEY);
  } catch {
    // Ignored
  }
}

/**
 * In-memory sliding window history of recent problems to guarantee freshness
 */
const recentQuestionKeys = [];

function recordQuestion(key) {
  recentQuestionKeys.push(key);
  if (recentQuestionKeys.length > 25) {
    recentQuestionKeys.shift();
  }
}

/**
 * Generates a mathematically valid, randomized problem for Tutorial or Challenges.
 * 
 * Counting-Up Method:
 * Step 1: Subtrahend -> Next Ten (ones jump: inc1 = nextTen - subtrahend)
 * Step 2: Next Ten -> 100 (tens jump: inc2 = 100 - nextTen)
 * Step 3: 100 -> Minuend (hundreds jump: inc3 = minuend - 100)
 * 
 * Verifies that:
 * inc1 + inc2 + inc3 === minuend - subtrahend === diff
 * 
 * @param {number} levelNumber - 0 for tutorial, 1-5 for challenges
 * @param {string|number|null} lastKeyOrSubtrahend - Avoid immediate repeat
 * @returns {object} Complete problem configuration with dynamic steps, options, and feedback
 */
export function generateMathOLanternProblem(levelNumber = 0, lastKeyOrSubtrahend = null) {
  const isTutorial = levelNumber === 0;

  let minuendOptions = [];
  let subtrahendCandidates = [];

  if (isTutorial) {
    // Tutorial: offers fresh problems every time (e.g. 500 − 36, 400 − 65, 600 − 47, 300 − 28)
    minuendOptions = [500, 400, 600, 300];
    subtrahendCandidates = [23, 27, 34, 36, 42, 45, 47, 53, 56, 62, 65, 68, 71, 74];
  } else if (levelNumber === 1) {
    minuendOptions = [500, 400];
    subtrahendCandidates = [21, 27, 29, 33, 37, 44, 47, 53, 58, 64, 72, 77];
  } else if (levelNumber === 2) {
    minuendOptions = [400, 300, 500];
    subtrahendCandidates = [25, 32, 35, 43, 49, 55, 65, 71, 75, 82, 85];
  } else if (levelNumber === 3) {
    minuendOptions = [300, 500, 600];
    subtrahendCandidates = [18, 22, 28, 35, 39, 41, 46, 52, 63, 67, 75, 79];
  } else if (levelNumber === 4) {
    minuendOptions = [600, 500, 700];
    subtrahendCandidates = [26, 34, 48, 54, 61, 68, 73, 81, 84, 88, 92];
  } else {
    minuendOptions = [700, 600, 800];
    subtrahendCandidates = [27, 39, 43, 49, 57, 66, 74, 83, 86, 91, 94];
  }

  // Pick minuend and subtrahend avoiding recent questions
  let chosenMinuend = minuendOptions[Math.floor(Math.random() * minuendOptions.length)];
  let validSubtrahends = subtrahendCandidates.filter(
    (s) => s !== lastKeyOrSubtrahend && !recentQuestionKeys.includes(`${chosenMinuend}-${s}`)
  );

  if (validSubtrahends.length === 0) {
    // If all candidates in current minuend were recently served, pick from other minuends or all candidates
    validSubtrahends = subtrahendCandidates.filter((s) => s !== lastKeyOrSubtrahend);
    if (validSubtrahends.length === 0) validSubtrahends = subtrahendCandidates;
  }

  const chosenSubtrahend =
    validSubtrahends[Math.floor(Math.random() * validSubtrahends.length)];

  // Record this pair to prevent duplicate questions within the session
  recordQuestion(`${chosenMinuend}-${chosenSubtrahend}`);

  const minuend = chosenMinuend;
  const subtrahend = chosenSubtrahend;
  const diff = minuend - subtrahend;
  const nextTen = Math.ceil(subtrahend / 10) * 10;

  // Step 1: Subtrahend -> Next Ten (e.g. 36 -> 40, inc1 = 4)
  const inc1 = nextTen - subtrahend;
  const onesDigit = subtrahend % 10;

  const step1Opts = [];
  const addedVals1 = new Set();

  step1Opts.push({
    id: `s1_${inc1}`,
    value: inc1,
    text: `+${inc1} lantern${inc1 === 1 ? '' : 's'}`,
    isCorrect: true,
    feedback: `Brilliant! ${subtrahend} + ${inc1} = ${nextTen}! Ghostie hops forward to ${nextTen}!`,
  });
  addedVals1.add(inc1);

  const potentialD1 = [
    onesDigit !== inc1 ? onesDigit : (inc1 + 1 <= 9 ? inc1 + 1 : inc1 - 1),
    inc1 + 10,
    inc1 > 1 ? inc1 - 1 : inc1 + 2,
    inc1 + 5,
    inc1 < 8 ? inc1 + 2 : (inc1 - 2 > 0 ? inc1 - 2 : inc1 + 3),
  ];

  for (const v of potentialD1) {
    if (v > 0 && !addedVals1.has(v) && step1Opts.length < 4) {
      addedVals1.add(v);
      const isPast = subtrahend + v > nextTen;
      step1Opts.push({
        id: `s1_${v}`,
        value: v,
        text: `+${v} lanterns`,
        isCorrect: false,
        feedback: isPast
          ? `${subtrahend} + ${v} = ${subtrahend + v}, which passes ${nextTen}! We just need ${inc1} to reach ${nextTen}.`
          : `${subtrahend} + ${v} = ${subtrahend + v}. Needs ${inc1 - v} more to reach ${nextTen}! ${inc1} makes the ten.`,
      });
    }
  }

  // Step 2: Next Ten -> 100 (e.g. 40 -> 100, inc2 = 60)
  const inc2 = 100 - nextTen;
  const step2Opts = [];
  const addedVals2 = new Set();

  step2Opts.push({
    id: `s2_${inc2}`,
    value: inc2,
    text: `+${inc2} lanterns`,
    isCorrect: true,
    feedback: `Spectacular! ${nextTen} + ${inc2} = 100! Ghostie glides smoothly to the 100 mark!`,
  });
  addedVals2.add(inc2);

  const potentialD2 = [
    inc2 - 10 > 0 ? inc2 - 10 : inc2 + 20,
    inc2 + 10 < 100 ? inc2 + 10 : inc2 - 20,
    nextTen !== inc2 ? nextTen : (inc2 > 30 ? inc2 - 20 : inc2 + 30),
    inc2 + 20 < 100 ? inc2 + 20 : (inc2 - 30 > 0 ? inc2 - 30 : 50),
    inc2 - 20 > 0 ? inc2 - 20 : 40,
  ];

  for (const v of potentialD2) {
    if (v > 0 && !addedVals2.has(v) && step2Opts.length < 4) {
      addedVals2.add(v);
      const sum = nextTen + v;
      step2Opts.push({
        id: `s2_${v}`,
        value: v,
        text: `+${v} lanterns`,
        isCorrect: false,
        feedback:
          sum > 100
            ? `${nextTen} + ${v} = ${sum}, passing 100! ${nextTen / 10} tens + ${inc2 / 10} tens = 10 tens (100).`
            : `${nextTen} + ${v} = ${sum}. Needs more tens to reach 100! You need ${inc2}.`,
      });
    }
  }

  // Step 3: 100 -> Minuend (e.g. 100 -> 500, inc3 = 400)
  const inc3 = minuend - 100;
  const step3Opts = [];
  const addedVals3 = new Set();

  step3Opts.push({
    id: `s3_${inc3}`,
    value: inc3,
    text: `+${inc3} lanterns`,
    isCorrect: true,
    feedback: `Hooray! 100 + ${inc3} = ${minuend}! Ghostie reached the destination and collected ${diff} lanterns!`,
  });
  addedVals3.add(inc3);

  const potentialD3 = [
    inc3 - 100 > 0 ? inc3 - 100 : inc3 + 100,
    minuend,
    inc3 + 100,
    inc3 - 50 > 0 ? inc3 - 50 : inc3 + 200,
    inc3 + 50,
  ];

  for (const v of potentialD3) {
    if (v > 0 && !addedVals3.has(v) && step3Opts.length < 4) {
      addedVals3.add(v);
      step3Opts.push({
        id: `s3_${v}`,
        value: v,
        text: `+${v} lanterns`,
        isCorrect: false,
        feedback:
          v === minuend
            ? `100 + ${v} = ${100 + v}, which is too far! From 100 to ${minuend} is ${inc3}.`
            : `100 + ${v} = ${100 + v}. You need ${inc3 / 100} full hundreds (${inc3}) to reach ${minuend}!`,
      });
    }
  }

  return {
    id: levelNumber,
    levelNumber,
    isTutorial,
    minuend,
    subtrahend,
    diff,
    title: isTutorial
      ? `Tutorial: ${minuend} − ${subtrahend} with Ghostie & Witchy`
      : `Challenge ${levelNumber}: ${minuend} − ${subtrahend}`,
    storyTitle: isTutorial
      ? `The Magical ${minuend} − ${subtrahend} Lantern Journey`
      : `Ghostie's ${minuend} − ${subtrahend} Trail`,
    storyIntro: isTutorial
      ? `Ghostie has ${subtrahend} lanterns but dreams of having ${minuend}. Witchy explains that instead of counting every lantern one by one, Ghostie can travel to friendly numbers and collect lanterns in groups. Can you help Ghostie reach ${minuend}?`
      : `Ghostie starts at ${subtrahend} lanterns. Jump through friendly benchmarks to reach ${minuend}!`,
    steps: [
      {
        stepId: 1,
        from: subtrahend,
        to: nextTen,
        increment: inc1,
        targetDescription: isTutorial
          ? `the next friendly ten (${nextTen})`
          : `the next multiple of ten (${nextTen})`,
        witchAdvice: isTutorial
          ? `Let's first reach the nearest friendly ten! ${subtrahend} is super close to ${nextTen}.`
          : `${subtrahend} is close to ${nextTen}! How many ones make the ten?`,
        question: `Ghostie has ${subtrahend} lanterns. How many more are needed to reach ${nextTen}?`,
        speechText: `Ghostie has ${subtrahend} lanterns. How many more are needed to reach ${nextTen}?`,
        options: step1Opts,
        hint: `Think about the distance from ${subtrahend} to ${nextTen}. Count up: ${subtrahend + 1}... That is ${inc1} lantern${inc1 === 1 ? '' : 's'}!`,
      },
      {
        stepId: 2,
        from: nextTen,
        to: 100,
        increment: inc2,
        targetDescription: `the friendly hundred (100)`,
        witchAdvice: `From ${nextTen}, let's jump to the friendly hundred! How many tens make 100?`,
        question: `Ghostie has reached ${nextTen}. How many more lanterns are needed to reach 100?`,
        speechText: `Ghostie has reached ${nextTen}. How many more lanterns are needed to reach 100?`,
        options: step2Opts,
        hint: `Think about the distance from ${nextTen} to 100. ${nextTen / 10} tens + ${inc2 / 10} tens = 10 tens (100). That's ${inc2} lanterns!`,
      },
      {
        stepId: 3,
        from: 100,
        to: minuend,
        increment: inc3,
        targetDescription: `the grand destination (${minuend})`,
        witchAdvice: `Now for the grand final jump! From 100 all the way to ${minuend} lanterns!`,
        question: `Ghostie has reached 100. How many more lanterns are needed to reach ${minuend}?`,
        speechText: `Ghostie has reached 100. How many more lanterns are needed to reach ${minuend}?`,
        options: step3Opts,
        hint: `Think about the distance from 100 to ${minuend}. ${minuend / 100} hundreds minus 1 hundred is ${inc3 / 100} hundreds. That is ${inc3} lanterns!`,
      },
    ],
  };
}

/**
 * Returns a full set of 6 fresh, randomized levels (Tutorial + Challenges 1 to 5)
 */
export function getFreshMathOLanternLevels() {
  return [0, 1, 2, 3, 4, 5].map((idx) => generateMathOLanternProblem(idx));
}

/**
 * Default preset levels for initial rendering and reference
 */
export const MATH_O_LANTERN_LEVELS = [
  generateMathOLanternProblem(0),
  generateMathOLanternProblem(1),
  generateMathOLanternProblem(2),
  generateMathOLanternProblem(3),
  generateMathOLanternProblem(4),
  generateMathOLanternProblem(5),
];

/**
 * Self-validation helper that confirms mathematical integrity of all levels:
 * sum(steps.increment) === minuend - subtrahend === diff
 */
export function validateAllLevels() {
  for (let lvl = 0; lvl <= 5; lvl++) {
    const gen = generateMathOLanternProblem(lvl);
    const sumIncrements = gen.steps.reduce((sum, s) => sum + s.increment, 0);
    const expectedDiff = gen.minuend - gen.subtrahend;
    if (sumIncrements !== expectedDiff || sumIncrements !== gen.diff) {
      console.error(
        `Math error in generated level ${lvl}: sum=${sumIncrements}, expected=${expectedDiff}, diff=${gen.diff}`
      );
    }
  }
}

// Auto-run validation
validateAllLevels();
