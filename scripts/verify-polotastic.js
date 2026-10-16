import {
  POLO_UNITS,
  generatePoloDashCourse,
  generateLevel1Question,
  generateLevel2Question,
  generateLevel3Question,
  validateAllPolotasticGenerators,
} from '../src/data/polotasticQuestions.js';

console.log('--- Starting Polotastic Math & Curriculum Verification ---');

// 1. Verify Place Value Units
console.log('1. Checking Place-Value Units...');
if (
  POLO_UNITS.ONE.value !== 1 ||
  POLO_UNITS.TEN.value !== 10 ||
  POLO_UNITS.HUNDRED.value !== 100 ||
  POLO_UNITS.THOUSAND.value !== 1000
) {
  throw new Error('Place-value unit values do not match standard base-10 values!');
}
console.log('   ✓ Place-value units confirmed: 1 Polo = 1, 1 Roll = 10, 1 Packet = 100, 1 Carton = 1,000.');

// 2. Run built-in generator validation
console.log('2. Running comprehensive self-validation across 100 sample problems...');
const isValid = validateAllPolotasticGenerators();
if (!isValid) {
  throw new Error('Generator self-validation failed!');
}
console.log('   ✓ Generator self-validation passed 100%.');

// 3. Deep test Level 1 (Single-digit, no borrowing)
console.log('3. Testing Level 1 (Single-Digit Subtraction Without Borrowing)...');
for (let i = 0; i < 150; i++) {
  const q = generateLevel1Question();
  if (q.minuend < 1 || q.minuend > 9) {
    throw new Error(`Level 1 minuend out of range: ${q.minuend}`);
  }
  if (q.subtrahend < 1 || q.subtrahend >= q.minuend) {
    throw new Error(`Level 1 subtrahend invalid: ${q.subtrahend} for minuend ${q.minuend}`);
  }
  if (q.minuend - q.subtrahend !== q.diff) {
    throw new Error(`Level 1 math error: ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
  }
  if (q.requiresBorrowing !== false) {
    throw new Error('Level 1 question improperly flagged requiresBorrowing!');
  }
}
console.log('   ✓ 150 Level 1 questions verified (0 borrowing, 100% mathematically sound).');

// 4. Deep test Level 2 (Two-digit minus one-digit without borrowing)
console.log('4. Testing Level 2 (Two-Digit Minus One-Digit Without Borrowing)...');
for (let i = 0; i < 150; i++) {
  const q = generateLevel2Question();
  if (q.minuend < 10 || q.minuend > 99) {
    throw new Error(`Level 2 minuend not 2 digits: ${q.minuend}`);
  }
  if (q.ones < q.subtrahend) {
    throw new Error(`Level 2 ones (${q.ones}) < subtrahend (${q.subtrahend}) - requires borrowing!`);
  }
  if (q.minuend - q.subtrahend !== q.diff) {
    throw new Error(`Level 2 math error: ${q.minuend} - ${q.subtrahend} !== ${q.diff}`);
  }
  if (q.remainingRolls !== q.tens) {
    throw new Error('Level 2 rolls changed when they should stay intact!');
  }
}
console.log('   ✓ 150 Level 2 questions verified (tens rolls intact, 0 borrowing, 100% accurate).');

// 5. Deep test Level 3 (Two-digit minus one-digit WITH borrowing)
console.log('5. Testing Level 3 (Two-Digit Minus One-Digit With Borrowing)...');
for (let i = 0; i < 150; i++) {
  const q = generateLevel3Question();
  if (q.ones >= q.subtrahend) {
    throw new Error(`Level 3 ones (${q.ones}) >= subtrahend (${q.subtrahend}) - borrowing not required!`);
  }
  if (q.afterBorrowRolls !== q.tens - 1) {
    throw new Error('Level 3 afterBorrowRolls not decremented by 1 ten!');
  }
  if (q.afterBorrowLoosePolos !== q.ones + 10) {
    throw new Error('Level 3 afterBorrowLoosePolos not incremented by 10 ones!');
  }
  // Check conservation of value
  const regroupedVal = q.afterBorrowRolls * 10 + q.afterBorrowLoosePolos;
  if (regroupedVal !== q.minuend) {
    throw new Error(`Regrouped value ${regroupedVal} changed from original minuend ${q.minuend}!`);
  }
  const finalVal = q.finalRolls * 10 + q.remainingLoose;
  if (finalVal !== q.diff) {
    throw new Error(`Final result ${finalVal} does not equal difference ${q.diff}!`);
  }
}
console.log('   ✓ 150 Level 3 questions verified (borrowing physically decomposes 1 ten to 10 ones with total value strictly preserved).');

// 6. Test Polo Dash Course
console.log('6. Testing Polo Dash Course Structure...');
const course = generatePoloDashCourse();
if (course.length < 5) {
  throw new Error(`Polo Dash course length too short: ${course.length}`);
}
course.forEach((obs, idx) => {
  const correctOpts = obs.options.filter((o) => o.isCorrect);
  if (correctOpts.length !== 1) {
    throw new Error(`Obstacle #${idx} does not have exactly 1 correct answer!`);
  }
  if (obs.options.length !== 3) {
    throw new Error(`Obstacle #${idx} must have 3 lanes/options.`);
  }
});
console.log(`   ✓ Polo Dash course has ${course.length} valid obstacle checkpoints with 3-lane options.`);

console.log('\n🎉 ALL POLOTASTIC VERIFICATION CHECKS PASSED SUCCESSFULLY! 🎉\n');
