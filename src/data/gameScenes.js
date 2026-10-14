// Game scenes and educational dialogue data for "Spooktacular Trick"

export const INITIAL_PROBLEM = {
  minuend: 500,
  subtrahend: 53,
  difference: 447,
  digits: {
    hundreds: 5,
    tens: 0,
    ones: 0,
  },
  subDigits: {
    hundreds: 0,
    tens: 5,
    ones: 3,
  },
};

export const SCENES = [
  {
    id: 1,
    title: "Enter the Haunted Street",
    badge: "Scene 1 of 5",
    speaker: "narrator",
    dialogue: "Welcome to Spooky Street! Three living haunted houses hold 500 candies in total: 5 Hundreds, 0 Tens, and 0 Ones. Two trick-or-treaters arrive needing 53 candies (5 tens and 3 ones). Can you help them perform the spectacular borrowing trick?",
    speechText: "Welcome to Spooky Street! Three living haunted houses hold 500 candies in total. Two trick-or-treaters need 53 candies. Let's start the trick!",
    houses: {
      hundreds: { value: 5, display: "5", candies: 500, mood: "proud", label: "5 Hundreds" },
      tens: { value: 0, display: "0", candies: 0, mood: "neutral", label: "0 Tens" },
      ones: { value: 0, display: "0", candies: 0, mood: "neutral", label: "0 Ones" },
    },
    boardState: {
      step: 'initial',
      H: { orig: '5', top: null, sub: '0', ans: null },
      T: { orig: '0', top: null, sub: '5', ans: null },
      O: { orig: '0', top: null, sub: '3', ans: null },
    },
    hint: "Click 'Start the Trick!' to begin our Halloween subtraction adventure!",
  },
  {
    id: 2,
    title: "The Ones House Needs Help",
    badge: "Scene 2 of 5",
    speaker: "ones",
    dialogue: "“Trick or treat! The kids need 3 candies from me, but my bowl is completely empty (0 candies)! Where should I look to borrow candies?”",
    speechText: "The kids need 3 candies from me, but I have 0! Where should I borrow candies?",
    houses: {
      hundreds: { value: 5, display: "5", candies: 500, mood: "watchful", label: "5 Hundreds" },
      tens: { value: 0, display: "0", candies: 0, mood: "nervous", label: "0 Tens" },
      ones: { value: 0, display: "0", candies: 0, mood: "worried", label: "0 Ones" },
    },
    boardState: {
      step: 'need_ones',
      highlightCol: 'O',
      H: { orig: '5', top: null, sub: '0', ans: null },
      T: { orig: '0', top: null, sub: '5', ans: null },
      O: { orig: '0', top: null, sub: '3', ans: null, needHelp: true },
    },
    question: "Where should the Ones House knock to borrow candies?",
    options: [
      {
        id: 'A',
        text: "Knock on its next-door neighbor: the Tens House! 🚪",
        isCorrect: true,
        feedback: "Spot on! In place-value math, you always ask your immediate neighbor to the left first!",
      },
      {
        id: 'B',
        text: "Skip the Tens House and take from the Hundreds House directly 🏃",
        isCorrect: false,
        feedback: "Not quite! You must always borrow from your immediate neighbor to the left (the Tens place) step by step.",
      },
      {
        id: 'C',
        text: "Give up and close the door 👻",
        isCorrect: false,
        feedback: "No way! Math has a magical trick called regrouping. We never give up!",
      },
    ],
    hint: "Look right next door to the left! Place values always borrow from their immediate neighbor.",
  },
  {
    id: 3,
    title: "The Tens House Asks the Hundreds House",
    badge: "Scene 3 of 5",
    speaker: "tens",
    dialogue: "“Oh dear, I have 0 tens too! But my neighbor, the kind Hundreds House, has 5 hundreds (500 candies)! Let's ask the Hundreds House for 1 hundred!”",
    speechText: "I have 0 tens too! But the Hundreds House has 5 hundreds. Let's borrow 1 hundred!",
    houses: {
      hundreds: { value: 5, display: "5", candies: 500, mood: "generous", label: "5 Hundreds" },
      tens: { value: 0, display: "0", candies: 0, mood: "asking", label: "0 Tens" },
      ones: { value: 0, display: "0", candies: 0, mood: "waiting", label: "0 Ones" },
    },
    bagAnimation: {
      type: "100",
      from: "hundreds",
      to: "tens",
      label: "100 Candies (1 Hundred = 10 Tens)",
    },
    housesAfter: {
      hundreds: { value: 4, display: "4", candies: 400, mood: "happy", label: "4 Hundreds" },
      tens: { value: 10, display: "10", candies: 100, mood: "excited", label: "10 Tens" },
      ones: { value: 0, display: "0", candies: 0, mood: "cheering", label: "0 Ones" },
    },
    boardState: {
      step: 'borrow_hundred',
      highlightCol: 'H',
      H: { orig: '5', crossed: true, top: '4', sub: '0', ans: null },
      T: { orig: '0', crossed: true, top: '10', sub: '5', ans: null },
      O: { orig: '0', top: null, sub: '3', ans: null },
    },
    question: "How many tens did the Hundreds House give to the Tens House?",
    options: [
      {
        id: 'A',
        text: "1 Hundred = 10 Tens (100 candies!) 🍬",
        isCorrect: true,
        feedback: "Brilliant! 1 hundred equals 10 tens. So the Hundreds house becomes 4, and the Tens house now has 10 tens!",
      },
      {
        id: 'B',
        text: "Only 1 single candy 🍭",
        isCorrect: false,
        feedback: "Remember: The Hundreds house gives 1 whole hundred, which is 10 tens (100 candies)!",
      },
      {
        id: 'C',
        text: "50 candies 🍫",
        isCorrect: false,
        feedback: "In our base-10 number system, each place value regrouping gives exactly 10 of the next smaller place value!",
      },
    ],
    hint: "1 Hundred is always equal to 10 Tens! (10 × 10 = 100)",
  },
  {
    id: 4,
    title: "Pass One Ten to the Ones House",
    badge: "Scene 4 of 5",
    speaker: "tens",
    dialogue: "“Now I have 10 tens (100 candies)! I can finally help the Ones House. I'll give 1 ten (10 candies) to the Ones House!”",
    speechText: "Now I have 10 tens! I can give 1 ten to the Ones House. That leaves me with 9 tens, and the Ones House gets 10 candies!",
    houses: {
      hundreds: { value: 4, display: "4", candies: 400, mood: "happy", label: "4 Hundreds" },
      tens: { value: 10, display: "10", candies: 100, mood: "sharing", label: "10 Tens" },
      ones: { value: 0, display: "0", candies: 0, mood: "eager", label: "0 Ones" },
    },
    bagAnimation: {
      type: "10",
      from: "tens",
      to: "ones",
      label: "10 Candies (1 Ten = 10 Ones)",
    },
    housesAfter: {
      hundreds: { value: 4, display: "4", candies: 400, mood: "proud", label: "4 Hundreds" },
      tens: { value: 9, display: "9", candies: 90, mood: "happy", label: "9 Tens" },
      ones: { value: 10, display: "10", candies: 10, mood: "celebrating", label: "10 Ones" },
    },
    boardState: {
      step: 'borrow_ten',
      highlightCol: 'T',
      H: { orig: '5', crossed: true, top: '4', sub: '0', ans: null },
      T: { orig: '0', crossed: true, mid: '10', top: '9', sub: '5', ans: null },
      O: { orig: '0', crossed: true, top: '10', sub: '3', ans: null },
    },
    question: "When the Tens House (10 tens) gives 1 ten to the Ones House, how many tens are left in the Tens House?",
    options: [
      {
        id: 'A',
        text: "9 tens (90 candies remaining) 🎯",
        isCorrect: true,
        feedback: "Exactly! 10 tens minus 1 ten leaves 9 tens! And the Ones House now has 10 ones!",
      },
      {
        id: 'B',
        text: "10 tens (nothing changed) 🤔",
        isCorrect: false,
        feedback: "It gave 1 ten away, so 10 − 1 = 9 tens!",
      },
      {
        id: 'C',
        text: "0 tens (all gone) 😮",
        isCorrect: false,
        feedback: "It only gave 1 ten away! It keeps the other 9 tens.",
      },
    ],
    hint: "Think: 10 tens minus 1 ten = ? tens left!",
  },
  {
    id: 5,
    title: "Trick or Treat! The Subtraction",
    badge: "Scene 5 of 5",
    speaker: "trick_or_treaters",
    dialogue: "“All three houses are ready! Let's subtract each column from right to left: Ones, Tens, then Hundreds!”",
    speechText: "All houses are ready! Now let's subtract the candies for each house!",
    houses: {
      hundreds: { value: 4, display: "4", candies: 400, mood: "giving", label: "4 Hundreds" },
      tens: { value: 9, display: "9", candies: 90, mood: "giving", label: "9 Tens" },
      ones: { value: 10, display: "10", candies: 10, mood: "giving", label: "10 Ones" },
    },
    boardState: {
      step: 'subtracting',
      H: { orig: '5', crossed: true, top: '4', sub: '0', ans: '4' },
      T: { orig: '0', crossed: true, mid: '10', top: '9', sub: '5', ans: '4' },
      O: { orig: '0', crossed: true, top: '10', sub: '3', ans: '7' },
    },
    subtractionSteps: [
      {
        place: "Ones",
        expr: "10 − 3",
        correct: 7,
        explain: "The Ones house gives 3 of its 10 candies. 10 − 3 = 7 candies left!",
        options: [7, 6, 8, 5],
      },
      {
        place: "Tens",
        expr: "9 − 5",
        correct: 4,
        explain: "The Tens house gives 5 of its 9 tens. 9 − 5 = 4 tens left!",
        options: [4, 5, 3, 2],
      },
      {
        place: "Hundreds",
        expr: "4 − 0",
        correct: 4,
        explain: "The Hundreds house gives 0 hundreds. 4 − 0 = 4 hundreds left!",
        options: [4, 5, 0, 3],
      },
    ],
    finalAnswer: 447,
    hint: "Subtract each column starting from the Ones place on the right, then Tens, then Hundreds!",
  },
];

// Comic story pages for "Learn the Trick" mode
export const COMIC_PAGES = [
  {
    page: 1,
    title: "The Three Haunted Houses",
    subtitle: "Meet Hundreds, Tens, and Ones!",
    illustration: "houses_intro",
    text: "On a foggy Halloween night, three living haunted houses stood along Spooky Lane. Together they held 500 candies: 5 hundreds, 0 tens, and 0 ones.",
    quote: "“Happy Halloween! We are ready for trick-or-treaters!”",
  },
  {
    page: 2,
    title: "The Hungry Trick-or-Treaters",
    subtitle: "53 Candies Needed!",
    illustration: "trick_or_treaters_arrive",
    text: "Two children in ghost and witch costumes arrived at the Ones House. They needed 53 candies: 5 tens and 3 single ones! But the Ones House had zero candies to give.",
    quote: "“Oh dear! My bowl is empty. I must ask my neighbor the Tens House!”",
  },
  {
    page: 3,
    title: "The Chain of Borrowing",
    subtitle: "Hundreds House to the Rescue!",
    illustration: "hundreds_give_tens",
    text: "The Tens House had zero candies too! But the kind Hundreds House had 5 hundreds. The Hundreds House gave 1 hundred (100 candies) to the Tens House. Since 1 hundred = 10 tens, the Hundreds House became 4, and the Tens House had 10 tens!",
    quote: "“Take 1 hundred! That is 10 whole tens for you!”",
  },
  {
    page: 4,
    title: "Passing the Ten to Ones",
    subtitle: "Regrouping Complete!",
    illustration: "tens_give_ones",
    text: "Now the Tens House had 10 tens. It generously passed 1 ten (10 candies) over to the Ones House. Now the Tens House had 9 tens left, and the Ones House had 10 ones! Notice: 400 + 90 + 10 = 500 candies. Not a single candy was lost!",
    quote: "“Here is 1 ten (10 candies) for the Ones House! Now we all have candies!”",
  },
  {
    page: 5,
    title: "Trick or Treat! The Subtraction",
    subtitle: "500 − 53 = 447!",
    illustration: "celebration",
    text: "Now the children collected their candy: 10 − 3 = 7 ones, 9 − 5 = 4 tens, and 4 − 0 = 4 hundreds! The houses have 447 candies remaining. The trick was a spooktacular success!",
    quote: "“447 candies left! That was a spooktacular subtraction trick!”",
  },
];

// Additional Practice Problems for Sandbox Mode
export const PRACTICE_PROBLEMS = [
  { minuend: 500, subtrahend: 53, diff: 447 },
  { minuend: 400, subtrahend: 65, diff: 335 },
  { minuend: 300, subtrahend: 28, diff: 272 },
  { minuend: 600, subtrahend: 84, diff: 516 },
  { minuend: 700, subtrahend: 49, diff: 651 },
];
