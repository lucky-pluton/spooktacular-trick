/**
 * Polotastic Persistence & Stage Progression Manager
 * Stores learner progress separately in localStorage so page reloads never lose progress.
 */

const STORAGE_KEY = 'spooktacular_polotastic_progress_v1';

const DEFAULT_PROGRESS = {
  guidebookCompleted: false,
  poloDashCompleted: false,
  level1Completed: false,
  level2Completed: false,
  level3Completed: false,
  polosCollected: 0,
  stars: {
    guidebook: 0,
    poloDash: 0,
    level1: 0,
    level2: 0,
    level3: 0,
  },
};

/**
 * Loads saved Polotastic progress from localStorage
 */
export function getPolotasticProgress() {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

    default:
      return 'locked';
  }
}

/**
 * Stage display metadata
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
    number: 1,
    title: 'Polo Dash',
    subtitle: 'Prerequisite Runner Game',
    description: 'Dash along the minty path, steer through lanes, and demonstrate understanding of all 4 place-value units!',
    icon: '🏃',
    badge: 'Prerequisite 2',
    prereqText: 'Complete The Guidebook to unlock Polo Dash!',
  },
  {
    id: 'level1',
    number: 2,
    title: 'Level 1: Polo Takeaway',
    subtitle: 'Single-Digit Subtraction Without Borrowing',
    description: 'Take away loose Polos into your basket and count what remains!',
    icon: '🍬',
    badge: 'Level 1',
    prereqText: 'Pass Polo Dash obstacle course to unlock Level 1!',
  },
  {
    id: 'level2',
    number: 3,
    title: 'Level 2: Roll & Remove',
    subtitle: 'Two-Digit Minus One-Digit Without Borrowing',
    description: 'Keep your tens rolls safe and subtract from the loose Polos!',
    icon: '🥖',
    badge: 'Level 2',
    prereqText: 'Master Level 1: Polo Takeaway to unlock Level 2!',
  },
  {
    id: 'level3',
    number: 4,
    title: 'Level 3: Break a Roll!',
    subtitle: 'Two-Digit Minus One-Digit With Borrowing',
    description: 'When loose Polos aren’t enough, break a roll to regroup 1 ten into 10 loose Polos!',
    icon: '⚡',
    badge: 'Level 3',
    prereqText: 'Master Level 2: Roll & Remove to unlock Level 3!',
  },
];
