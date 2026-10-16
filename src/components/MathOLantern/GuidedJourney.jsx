import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateMathOLanternProblem,
  isLevelUnlocked,
  getPrerequisiteNotice,
  getSavedCompletedLevels,
  saveCompletedLevel,
  resetAllProgress,
} from '../../data/mathOLanternData';
import LanternTrail from './LanternTrail';
import WitchyCharacter from './WitchyCharacter';
import MathOLanternCelebration from './MathOLanternCelebration';
import { sounds } from '../../audio/soundEffects';
import {
  Volume2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Lock,
  Dices,
} from 'lucide-react';

/**
 * Fisher-Yates shuffle helper for multiple-choice options.
 * Assigns display letters A, B, C, D to the shuffled order.
 * Validated strictly by option.value === activeStep.increment && option.isCorrect.
 */
function shuffleOptions(options) {
  if (!options || options.length === 0) return [];
  const copy = [...options];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const letters = ['A', 'B', 'C', 'D'];
  return copy.map((opt, idx) => ({
    ...opt,
    displayLetter: letters[idx] || `${idx + 1}`,
  }));
}

/**
 * GuidedJourney Component
 * Structured step-by-step counting-up subtraction experience with Ghostie & Witchy.
 * 
 * Features:
 * - Dynamic runtime question generation for Tutorial and all Challenges
 * - Meaningful prerequisite-based challenge progression
 * - Strict gating against bypassing locked challenges
 * - Animated Lantern Trail, pedagogical distractors & feedback
 * - Warm, gentle teacher voice narration
 */
export default function GuidedJourney({ onOpenSandbox, onOpenStory }) {
  // Prerequisite progression state: list of completed level IDs (e.g. [0, 1])
  const [completedLevels, setCompletedLevels] = useState(() => getSavedCompletedLevels());

  // Active level index (0 = Tutorial, 1 = Challenge 1, ..., 5 = Challenge 5)
  const [levelIndex, setLevelIndex] = useState(0);

  // Dynamic active problem with runtime-generated numbers
  const [currentProblem, setCurrentProblem] = useState(() =>
    generateMathOLanternProblem(0)
  );

  // Step state within the level
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = currentProblem.steps[stepIndex] || currentProblem.steps[0];

  // Visual trail progress
  const [currentNumber, setCurrentNumber] = useState(currentProblem.subtrahend);
  const [completedJumps, setCompletedJumps] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // Question interaction state
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleOptions(currentProblem.steps[0]?.options || [])
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  // Friendly prerequisite lock notice banner
  const [lockNotice, setLockNotice] = useState(null);

  // Just-unlocked notification flag for celebration modal
  const [justUnlockedLevel, setJustUnlockedLevel] = useState(null);

  // Auto-advance timer ref
  const autoAdvanceTimerRef = useRef(null);

  // Celebration modal state
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Milestones list along the trail: [subtrahend, ...step.to]
  const milestones = [
    currentProblem.subtrahend,
    ...currentProblem.steps.map((s) => s.to),
  ];

  // Helper to clear pending advance timer
  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearAutoAdvanceTimer();
  }, []);

  /**
   * Navigate to a level and step with optional re-randomization
   */
  const goToLevelAndStep = useCallback(
    (lvlIdx, sIdx, forceNewQuestion = false) => {
      clearAutoAdvanceTimer();
      setLockNotice(null);

      // Enforce strict prerequisite progression check
      if (!isLevelUnlocked(lvlIdx, completedLevels)) {
        sounds.playIncorrect();
        const notice = getPrerequisiteNotice(lvlIdx);
        setLockNotice(notice);
        setTimeout(() => setLockNotice(null), 5500);
        return;
      }

      // Generate a fresh randomized problem if switching level, requesting new question, or starting
      let problem = currentProblem;
      if (lvlIdx !== levelIndex || forceNewQuestion || !problem) {
        problem = generateMathOLanternProblem(lvlIdx, problem?.subtrahend);
        setCurrentProblem(problem);
      }

      const step = problem.steps[sIdx] || problem.steps[0];

      setLevelIndex(lvlIdx);
      setStepIndex(sIdx);
      setSelectedOption(null);
      setIsCorrect(null);
      setFeedback('');
      setHintVisible(false);
      setIsCelebrationOpen(false);
      setIsJumping(false);

      if (sIdx === 0) {
        setCurrentNumber(problem.subtrahend);
        setCompletedJumps([]);
        setTotalCollected(0);
      } else {
        // Reconstruct jumps up to current step
        const prevJumps = problem.steps.slice(0, sIdx).map((s) => ({
          from: s.from,
          to: s.to,
          increment: s.increment,
        }));
        setCompletedJumps(prevJumps);
        setCurrentNumber(step.from);
        setTotalCollected(prevJumps.reduce((sum, j) => sum + j.increment, 0));
      }

      // Shuffle options for the step
      setShuffledOptions(shuffleOptions(step.options || []));

      if (step.speechText) {
        sounds.speak(step.speechText);
      }
    },
    [completedLevels, levelIndex, currentProblem]
  );

  // Level selector click handler - generates fresh question when clicking an unlocked level
  const handleSelectLevel = (idx) => {
    if (!isLevelUnlocked(idx, completedLevels)) {
      sounds.playIncorrect();
      const notice = getPrerequisiteNotice(idx);
      setLockNotice(notice);
      setTimeout(() => setLockNotice(null), 5500);
      return;
    }
    sounds.playPop();
    goToLevelAndStep(idx, 0, true);
  };

  // Dedicated "New Question" button handler
  const handleNewQuestion = () => {
    sounds.playPop();
    goToLevelAndStep(levelIndex, 0, true);
  };

  // Restart current tutorial/challenge
  const handleResetLevel = () => {
    sounds.playPop();
    // For Tutorial, generate fresh problem on restart as per requirement 3
    if (levelIndex === 0) {
      goToLevelAndStep(0, 0, true);
    } else {
      // In challenge, restart current problem from step 1
      goToLevelAndStep(levelIndex, 0, false);
    }
  };

  // Reset all progression (for testing or starting over)
  const handleResetAllProgress = () => {
    sounds.playPop();
    resetAllProgress();
    setCompletedLevels([]);
    goToLevelAndStep(0, 0, true);
  };

  // Option selection handler
  const handleSelectOption = (opt) => {
    if (isCorrect === true) return; // Prevent duplicate clicks

    setSelectedOption(opt.id ?? opt.value);

    // Validate strictly against numerical increment value and isCorrect flag
    const isAnswerCorrect = opt.value === activeStep.increment && opt.isCorrect;

    if (isAnswerCorrect) {
      clearAutoAdvanceTimer();
      sounds.playSuccess();
      sounds.playLanternJump();
      setIsCorrect(true);
      setFeedback(opt.feedback || 'Brilliant jump! Ghostie hops forward!');

      // Animate jump along the trail
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        setCurrentNumber(activeStep.to);
        setCompletedJumps((prev) => [
          ...prev,
          {
            from: activeStep.from,
            to: activeStep.to,
            increment: activeStep.increment,
          },
        ]);
        setTotalCollected((prev) => prev + activeStep.increment);

        // Check if destination is reached
        if (stepIndex >= currentProblem.steps.length - 1) {
          // Record completion in prerequisite state
          const updated = saveCompletedLevel(levelIndex);
          setCompletedLevels(updated);

          const nextLevelIdx = levelIndex + 1;
          if (nextLevelIdx <= 5 && !completedLevels.includes(levelIndex)) {
            setJustUnlockedLevel(nextLevelIdx);
          } else {
            setJustUnlockedLevel(null);
          }

          setTimeout(() => {
            sounds.playSuccess();
            setIsCelebrationOpen(true);
          }, 900);
        } else {
          // Automatic progression to next step after visual comprehension pause
          autoAdvanceTimerRef.current = setTimeout(() => {
            goToLevelAndStep(levelIndex, stepIndex + 1, false);
          }, 2100);
        }
      }, 500);
    } else {
      sounds.playIncorrect();
      setIsCorrect(false);
      setHintVisible(true);
      setFeedback(
        `${opt.feedback || 'Not quite!'} 💡 Witchy's Hint: ${activeStep.hint}`
      );
    }
  };

  // Manual advance button
  const handleContinue = () => {
    clearAutoAdvanceTimer();
    sounds.playPop();
    if (stepIndex < currentProblem.steps.length - 1) {
      goToLevelAndStep(levelIndex, stepIndex + 1, false);
    }
  };

  // Advance to next level from celebration
  const handleNextLevelFromCelebration = () => {
    setIsCelebrationOpen(false);
    if (levelIndex < 5) {
      goToLevelAndStep(levelIndex + 1, 0, true);
    }
  };

  // Play again with a fresh randomized question
  const handlePlayAgain = () => {
    setIsCelebrationOpen(false);
    goToLevelAndStep(levelIndex, 0, true);
  };

  // Read question aloud with child-friendly female teacher voice
  const handleSpeakQuestion = () => {
    sounds.speak(activeStep.question || activeStep.speechText);
  };

  return (
    <div className="w-full flex flex-col gap-3 max-w-6xl mx-auto px-2 sm:px-4 py-2">
      {/* 1. LEVEL SELECTOR TABS & PREREQUISITE PROGRESSION */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081824]/90 p-2 sm:p-2.5 rounded-2xl border border-teal-500/40 backdrop-blur-md">
          {/* Level Tabs with Explicit Prerequisite Locking */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
            {[0, 1, 2, 3, 4, 5].map((lvlNum) => {
              const isUnlocked = isLevelUnlocked(lvlNum, completedLevels);
              const isCurrent = lvlNum === levelIndex;
              const isCompleted = completedLevels.includes(lvlNum);

              const label =
                lvlNum === 0 ? '⭐ Tutorial' : `Challenge ${lvlNum}`;

              let tabClass =
                'bg-black/50 hover:bg-gray-900/80 text-gray-400 border border-gray-700/40 opacity-75';
              if (isCurrent) {
                tabClass =
                  'bg-amber-400 text-black shadow-[0_0_15px_rgba(255,180,0,0.8)] font-black scale-105';
              } else if (isCompleted) {
                tabClass =
                  'bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-emerald-500/60';
              } else if (isUnlocked) {
                tabClass =
                  'bg-teal-950/60 hover:bg-teal-900 text-teal-200 border border-teal-700/50';
              }

              return (
                <button
                  key={lvlNum}
                  onClick={() => handleSelectLevel(lvlNum)}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${tabClass}`}
                  title={
                    isUnlocked
                      ? isCompleted
                        ? `${label} (Completed! Click for a fresh new question)`
                        : `${label} (Unlocked! Click to play)`
                      : `🔒 Locked! Complete Challenge ${lvlNum - 1} first to unlock!`
                  }
                >
                  {!isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : isCompleted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  ) : null}

                  <span>{label}</span>

                  {isCurrent && (
                    <span className="font-mono text-[11px] opacity-90">
                      ({currentProblem.minuend}−{currentProblem.subtrahend})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons: New Question, Story, Restart */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* New Question Button (Always generates a fresh randomized problem!) */}
            <button
              onClick={handleNewQuestion}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,180,0,0.6)] transform hover:scale-105 active:scale-95"
              title="Generate a fresh, brand new question for this level!"
            >
              <Dices className="w-3.5 h-3.5 text-black" />
              <span>🎲 New Question</span>
            </button>

            {onOpenStory && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenStory();
                }}
                type="button"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-amber-300 border border-purple-500/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                title="Read Ghostie's Story"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Ghostie's Story</span>
              </button>
            )}

            <button
              onClick={handleResetLevel}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-600/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title={levelIndex === 0 ? "Generate a fresh tutorial problem" : "Restart this problem from the beginning"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>

            {completedLevels.length > 0 && (
              <button
                onClick={handleResetAllProgress}
                type="button"
                className="p-1.5 px-2 py-1 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700/50 text-[10px] font-bold transition-all cursor-pointer"
                title="Reset challenge locks back to starting state"
              >
                Reset Locks
              </button>
            )}
          </div>
        </div>

        {/* Friendly Lock Notification Banner (shown if child clicks a locked challenge) */}
        {lockNotice && (
          <div className="w-full bg-gradient-to-r from-amber-950 via-purple-950 to-amber-950 border-2 border-amber-400 text-amber-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-between gap-2 shadow-[0_0_20px_rgba(255,180,0,0.4)] animate-fadeIn">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lockNotice}</span>
            </div>
            <button
              onClick={() => setLockNotice(null)}
              className="text-amber-400 hover:text-white font-black text-sm px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. THE MAGICAL LANTERN TRAIL */}
      <LanternTrail
        startNumber={currentProblem.subtrahend}
        targetNumber={currentProblem.minuend}
        currentNumber={currentNumber}
        milestones={milestones}
        completedJumps={completedJumps}
        totalCollected={totalCollected}
        isCompleted={currentNumber === currentProblem.minuend}
        isJumping={isJumping}
      />

      {/* 3. WITCHY'S GUIDANCE & INTERACTIVE QUESTION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT: Witchy Character & Dialogue (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <WitchyCharacter
            speechText={activeStep.speechText}
            dialogue={activeStep.witchAdvice}
            targetDescription={activeStep.targetDescription}
            onSpeak={() => sounds.speak(activeStep.witchAdvice || activeStep.speechText)}
          />

          {/* Quick Learning Note */}
          <div className="bg-[#051724]/85 border border-teal-500/30 rounded-2xl p-2.5 text-xs text-teal-200 leading-relaxed font-medium">
            <span className="font-bold text-amber-300">💡 Counting-Up Method:</span> We begin at{' '}
            <span className="font-mono font-bold text-white">{currentProblem.subtrahend}</span> and jump to friendly benchmarks to reach{' '}
            <span className="font-mono font-bold text-white">{currentProblem.minuend}</span>. Adding all our jumps gives the exact subtraction answer!
          </div>
        </div>

        {/* RIGHT: Question Prompt & 4 Shuffled Options (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0b2434] via-[#071a26] to-[#041018] border-2 border-teal-400/80 rounded-3xl p-3.5 sm:p-5 shadow-xl flex flex-col gap-3">
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-teal-500/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-black font-black text-xs uppercase tracking-wider">
                Step {stepIndex + 1} of {currentProblem.steps.length}
              </span>
              <span className="text-xs font-black text-amber-300">
                Jump from {activeStep.from} ➡️ {activeStep.to}
              </span>
            </div>

            {/* Read question aloud button with child-friendly teacher voice */}
            <button
              onClick={handleSpeakQuestion}
              type="button"
              className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-amber-300 transition-colors cursor-pointer"
              title="Read question aloud in child-friendly teacher voice"
              aria-label="Read question aloud in child-friendly teacher voice"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Question Prompt */}
          <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug">
            {activeStep.question}
          </h3>

          {/* 4 SHUFFLED MULTIPLE-CHOICE BUTTONS (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
            {shuffledOptions.map((opt) => {
              const optId = opt.id ?? opt.value;
              const isSelected = selectedOption === optId;
              const isRight = isSelected && isCorrect === true;
              const isWrong = isSelected && isCorrect === false;

              let btnStyle =
                'bg-teal-950/70 hover:bg-teal-900 border-teal-500/40 text-teal-100 hover:border-amber-400';
              if (isRight) {
                btnStyle =
                  'bg-emerald-900 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-[1.02]';
              } else if (isWrong) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={optId}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isCorrect === true}
                  type="button"
                  className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition-all border-2 flex items-center justify-between gap-2.5 cursor-pointer shadow-md transform hover:scale-[1.01] active:scale-98 text-left ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border-2 shadow-inner transition-colors ${
                        isRight
                          ? 'bg-emerald-400 text-black border-white'
                          : isWrong
                          ? 'bg-rose-500 text-white border-white'
                          : 'bg-teal-800 text-teal-100 border-teal-400'
                      }`}
                    >
                      {opt.displayLetter}
                    </span>
                    <span className="font-extrabold truncate sm:whitespace-normal">
                      {opt.text}
                    </span>
                  </div>

                  {isRight && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isWrong && (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Feedback Alert */}
          {feedback && (
            <div
              className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold border-2 flex items-start gap-2.5 transition-all text-left animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(255,180,0,0.25)]'
              }`}
            >
              {isCorrect ? (
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{feedback}</span>
            </div>
          )}

          {/* Continue Next Step Action Button */}
          {isCorrect && stepIndex < currentProblem.steps.length - 1 && (
            <button
              onClick={handleContinue}
              type="button"
              className="w-full mt-0.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer animate-popIn"
            >
              <span>Next Jump along the Trail ➡️</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Hint Toggle */}
          {activeStep.hint && !hintVisible && (
            <div className="border-t border-teal-500/30 pt-1.5 flex flex-col gap-1">
              <button
                onClick={() => setHintVisible(true)}
                type="button"
                className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1 cursor-pointer self-start"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Need a Hint?</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. CELEBRATION MODAL ON DESTINATION REACHED */}
      <MathOLanternCelebration
        isOpen={isCelebrationOpen}
        minuend={currentProblem.minuend}
        subtrahend={currentProblem.subtrahend}
        diff={currentProblem.diff}
        completedJumps={completedJumps}
        levelTitle={currentProblem.title}
        onNextLevel={handleNextLevelFromCelebration}
        onPlayAgain={handlePlayAgain}
        onOpenSandbox={onOpenSandbox}
        hasNextLevel={levelIndex < 5}
        justUnlockedLevel={justUnlockedLevel}
        levelIndex={levelIndex}
      />
    </div>
  );
}
