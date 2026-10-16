/**
 * Polotastic Persistence & Stage Progression Manager
 * Stores learner progress separately in localStorage so page reloads never lose progress.
 * Supports complete 9-Level curriculum plus Guidebook and Polo Dash prerequisites.
 */

const STORAGE_KEY = 'spooktacular_polotastic_progress_v2';
const LEGACY_STORAGE_KEY = 'spooktacular_polotastic_progress_v1';

const DEFAULT_PROGRESS = {
  mode: 'play', // 'play' | 'notebook'
  guidebookCompleted: false,
  poloDashCompleted: false,
  level1Completed: false,
  level2Completed: false,
  level3Completed: false,
  level4Completed: false,
  level5Completed: false,
  level6Completed: false,
  level7Completed: false,
  level8Completed: false,
  level9Completed: false,
  polosCollected: 0,
  stars: {
    guidebook: 0,
    poloDash: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0,
  },
};

/**
 * Loads saved Polotastic progress from localStorage (with backward compatibility)
 */
export function getPolotasticProgress() {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy storage
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      stars: {
        ...DEFAULT_PROGRESS.stars,
        ...(parsed.stars || {}),
      },
    };
  } catch (err) {
    console.warn('Failed to load Polotastic progress from storage:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Saves updated Polotastic progress to localStorage
 */
export function savePolotasticProgress(updates) {
  if (typeof window === 'undefined') return updates;
  try {
    const current = getPolotasticProgress();
    const merged = {
      ...current,
      ...updates,
      stars: {
        ...current.stars,
        ...(updates.stars || {}),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.warn('Failed to save Polotastic progress to storage:', err);
    return updates;
  }
}

/**
 * Resets Polotastic progress back to initial locked state
 */
export function resetPolotasticProgress() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear Polotastic progress:', err);
    }
  }
  return { ...DEFAULT_PROGRESS };
}

/**
 * Determines stage status: 'locked' | 'available' | 'completed'
 */
export function getStageStatus(stageId, progress) {
  const p = progress || getPolotasticProgress();

  switch (stageId) {
    case 'guidebook':
      return p.guidebookCompleted ? 'completed' : 'available';

    case 'polo_dash':
      if (p.poloDashCompleted) return 'completed';
      return p.guidebookCompleted ? 'available' : 'locked';

    case 'level1':
      if (p.level1Completed) return 'completed';
      return p.poloDashCompleted ? 'available' : 'locked';

    case 'level2':
      if (p.level2Completed) return 'completed';
      return p.level1Completed ? 'available' : 'locked';

    case 'level3':
      if (p.level3Completed) return 'completed';
      return p.level2Completed ? 'available' : 'locked';

    case 'level4':
      if (p.level4Completed) return 'completed';
      return p.level3Completed ? 'available' : 'locked';

    case 'level5':
      if (p.level5Completed) return 'completed';
      return p.level4Completed ? 'available' : 'locked';

    case 'level6':
      if (p.level6Completed) return 'completed';
      return p.level5Completed ? 'available' : 'locked';

    case 'level7':
      if (p.level7Completed) return 'completed';
      return p.level6Completed ? 'available' : 'locked';

    case 'level8':
      if (p.level8Completed) return 'completed';
      return p.level7Completed ? 'available' : 'locked';

    case 'level9':
      if (p.level9Completed) return 'completed';
      return p.level8Completed ? 'available' : 'locked';

    default:
      return 'locked';
  }
}

/**
 * Complete 9-Stage Display Metadata
 */
export const POLOTASTIC_STAGES = [
  {
    id: 'guidebook',
    number: 0,
    title: 'The Guidebook',
    subtitle: 'Learn the Polo Place-Value System',
    description: 'Discover how 10 Polos make 1 roll, 10 rolls make 1 packet, and 10 packets make 1 carton!',
    icon: '📖',
    badge: 'Prerequisite 1',
    prereqText: 'Available right away to all explorers!',
  },
  {
    id: 'polo_dash',
    number: 0.5,
    title: 'Polo Dash',
    subtitle: 'Prerequisite Runner Game',
    description: 'Dash along the minty path, steer through lanes, and type answers at obstacle gates to prove place-value mastery!',
    icon: '🏃',
    badge: 'Prerequisite 2',
    prereqText: 'Complete The Guidebook to unlock Polo Dash!',
  },
  {
    id: 'level1',
    number: 1,
    title: 'Level 1: Polo Takeaway',
    subtitle: 'Single-Digit Subtraction Without Borrowing',
    description: 'One-digit subtraction without borrowing. Examples: 8 − 3, 9 − 4.',
    icon: '🍬',
    badge: 'Level 1',
    prereqText: 'Pass Polo Dash obstacle course to unlock Level 1!',
  },
  {
    id: 'level2',
    number: 2,
    title: 'Level 2: Roll & Remove',
    subtitle: 'Two-Digit Minus One-Digit Without Borrowing',
    description: 'Two-digit minus one-digit without borrowing. Examples: 24 − 3, 48 − 6.',
    icon: '🥖',
    badge: 'Level 2',
    prereqText: 'Master Level 1: Polo Takeaway to unlock Level 2!',
  },
  {
    id: 'level3',
    number: 3,
    title: 'Level 3: Break a Roll',
    subtitle: 'Two-Digit Minus One-Digit With Borrowing',
    description: 'Two-digit minus one-digit, requiring borrowing from tens. Examples: 32 − 7, 41 − 6.',
    icon: '⚡',
    badge: 'Level 3',
    prereqText: 'Master Level 2: Roll & Remove to unlock Level 3!',
  },
  {
    id: 'level4',
    number: 4,
    title: 'Level 4: Two-Digit Takeaway',
    subtitle: 'Two-Digit Minus Two-Digit (With & Without Borrowing)',
    description: 'Two-digit minus two-digit with place-value columns. Examples: 54 − 21, 52 − 27, 32 − 17.',
    icon: '🎯',
    badge: 'Level 4',
    prereqText: 'Master Level 3: Break a Roll to unlock Level 4!',
  },
  {
    id: 'level5',
    number: 5,
    title: 'Level 5: Packet Breaker',
    subtitle: 'Three-Digit Subtraction (Hundreds & Tens Borrowing)',
    description: 'Three-digit subtraction with borrowing from hundreds to tens or tens to ones. Examples: 324 − 157, 462 − 184.',
    icon: '📦',
    badge: 'Level 5',
    prereqText: 'Master Level 4: Two-Digit Takeaway to unlock Level 5!',
  },
  {
    id: 'level6',
    number: 6,
    title: 'Level 6: The Empty Tens Challenge',
    subtitle: 'Borrowing Across Zero in Tens or Ones',
    description: 'Three-digit subtraction with zero in the tens or ones column, requiring multi-step borrowing. Examples: 500 − 36, 702 − 158.',
    icon: '🌀',
    badge: 'Level 6',
    prereqText: 'Master Level 5: Packet Breaker to unlock Level 6!',
  },
  {
    id: 'level7',
    number: 7,
    title: 'Level 7: Carton Breaker',
    subtitle: 'Four-Digit Minus Three-Digit Subtraction',
    description: 'Four-digit minus three-digit subtraction with borrowing across place values. Examples: 1,234 − 567, 2,345 − 678.',
    icon: '🚚',
    badge: 'Level 7',
    prereqText: 'Master Level 6: The Empty Tens Challenge to unlock Level 7!',
  },
  {
    id: 'level8',
    number: 8,
    title: 'Level 8: Thousand-Level Mastery',
    subtitle: 'Four-Digit Subtraction Across Multiple Zeros',
    description: 'Four-digit subtraction with borrowing across zeros and multiple place values. Examples: 4,000 − 1,256, 5,032 − 2,768.',
    icon: '👑',
    badge: 'Level 8',
    prereqText: 'Master Level 7: Carton Breaker to unlock Level 8!',
  },
  {
    id: 'level9',
    number: 9,
    title: 'Level 9: Polotastic Grand Challenge',
    subtitle: 'Mixed Four-Digit Subtraction Mastery',
    description: 'Mixed four-digit subtraction, including multiple borrowing patterns and zero-containing numbers.',
    icon: '🏆',
    badge: 'Level 9',
    prereqText: 'Master Level 8: Thousand-Level Mastery to unlock Grand Challenge!',
  },
];
