import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MATH_O_LANTERN_LEVELS } from '../../data/mathOLanternData';
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
} from 'lucide-react';

/**
 * Fisher-Yates shuffle helper for 4 randomized answer choices.
 * Assigns display letters A, B, C, D to the shuffled order.
 * Validated strictly by option.value === activeStep.increment or option.isCorrect, never by letter or index.
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
 * Structured, step-by-step counting up subtraction experience.
 */
export default function GuidedJourney({ onOpenSandbox, onOpenStory }) {
  // Active level selection (0 is Tutorial 500-36, 1-5 are Challenges)
  const [levelIndex, setLevelIndex] = useState(0);
  const activeLevel = MATH_O_LANTERN_LEVELS[levelIndex] || MATH_O_LANTERN_LEVELS[0];

  // Step state within the level
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = activeLevel.steps[stepIndex] || activeLevel.steps[0];

  // Visual trail progress
  const [currentNumber, setCurrentNumber] = useState(activeLevel.subtrahend);
  const [completedJumps, setCompletedJumps] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // Question interaction state
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleOptions(activeLevel.steps[0]?.options || [])
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  // Auto-advance timer ref
  const autoAdvanceTimerRef = useRef(null);

  // Celebration modal
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Derive milestones list for the trail: [subtrahend, ...step.to]
  const milestones = [
    activeLevel.subtrahend,
    ...activeLevel.steps.map((s) => s.to),
  ];

  // Clear timer helper
  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearAutoAdvanceTimer();
  }, []);

  // Reset to a specific step
  const goToLevelAndStep = useCallback(
    (lvlIdx, sIdx) => {
      clearAutoAdvanceTimer();
      const lvl = MATH_O_LANTERN_LEVELS[lvlIdx] || MATH_O_LANTERN_LEVELS[0];
      const step = lvl.steps[sIdx] || lvl.steps[0];

      setLevelIndex(lvlIdx);
      setStepIndex(sIdx);
      setSelectedOption(null);
      setIsCorrect(null);
      setFeedback('');
      setHintVisible(false);
      setIsCelebrationOpen(false);
      setIsJumping(false);

      if (sIdx === 0) {
        setCurrentNumber(lvl.subtrahend);
        setCompletedJumps([]);
        setTotalCollected(0);
      } else {
        // Reconstruct jumps up to sIdx
        const prevJumps = lvl.steps.slice(0, sIdx).map((s) => ({
          from: s.from,
          to: s.to,
          increment: s.increment,
        }));
        setCompletedJumps(prevJumps);
        setCurrentNumber(step.from);
        setTotalCollected(prevJumps.reduce((sum, j) => sum + j.increment, 0));
      }

      // Randomize option order for every new question
      setShuffledOptions(shuffleOptions(step.options || []));

      if (step.speechText) {
        sounds.speak(step.speechText);
      }
    },
    []
  );

  // Level selector click handler
  const handleSelectLevel = (idx) => {
    sounds.playPop();
    goToLevelAndStep(idx, 0);
  };

  // Reset entire level
  const handleResetLevel = () => {
    sounds.playPop();
    goToLevelAndStep(levelIndex, 0);
  };

  // Option selection
  const handleSelectOption = (opt) => {
    if (isCorrect === true) return; // Already answered correctly

    setSelectedOption(opt.id ?? opt.value);

    // Validate strictly against numerical value and isCorrect flag
    const isAnswerCorrect = opt.value === activeStep.increment && opt.isCorrect;

    if (isAnswerCorrect) {
      clearAutoAdvanceTimer();
      sounds.playSuccess();
      sounds.playLanternJump();
      setIsCorrect(true);
      setFeedback(opt.feedback || 'Brilliant jump! Ghostie hops forward!');

      // Animate jump and lanterns appearing
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

        // Check if destination reached
        if (stepIndex >= activeLevel.steps.length - 1) {
          setTimeout(() => {
            sounds.playSuccess();
            setIsCelebrationOpen(true);
          }, 900);
        } else {
          // Automatic progression to next step after visual comprehension delay
          autoAdvanceTimerRef.current = setTimeout(() => {
            goToLevelAndStep(levelIndex, stepIndex + 1);
          }, 2100);
        }
      }, 500);
    } else {
      sounds.playWrong();
      setIsCorrect(false);
      setHintVisible(true);
      // Gentle hint without punishment, reshuffle options on retry
      setFeedback(
        `${opt.feedback || 'Not quite!'} 💡 Witchy's Hint: ${activeStep.hint}`
      );
    }
  };

  // Manual advance button if child prefers not waiting for auto-advance
  const handleContinue = () => {
    clearAutoAdvanceTimer();
    sounds.playPop();
    if (stepIndex < activeLevel.steps.length - 1) {
      goToLevelAndStep(levelIndex, stepIndex + 1);
    }
  };

  // Advance to next level from celebration
  const handleNextLevelFromCelebration = () => {
    setIsCelebrationOpen(false);
    if (levelIndex < MATH_O_LANTERN_LEVELS.length - 1) {
      goToLevelAndStep(levelIndex + 1, 0);
    }
  };

  // TTS Read-aloud
  const handleSpeakQuestion = () => {
    sounds.speak(activeStep.question || activeStep.speechText);
  };

  return (
    <div className="w-full flex flex-col gap-3 max-w-6xl mx-auto px-2 sm:px-4 py-2">
      {/* 1. LEVEL SELECTOR TABS & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081824]/90 p-2 sm:p-2.5 rounded-2xl border border-teal-500/40 backdrop-blur-md">
        {/* Level Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          {MATH_O_LANTERN_LEVELS.map((lvl, idx) => {
            const isCurrent = idx === levelIndex;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(idx)}
                type="button"
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(255,180,0,0.8)] font-black scale-105'
                    : 'bg-teal-950/60 hover:bg-teal-900 text-teal-200 border border-teal-700/50'
                }`}
              >
                <span>{lvl.isTutorial ? '⭐ Tutorial' : `Challenge ${lvl.levelNumber}`}</span>
                <span className="font-mono text-[11px] opacity-85">
                  ({lvl.minuend}−{lvl.subtrahend})
                </span>
              </button>
            );
          })}
        </div>

        {/* Story & Reset Buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-amber-300 border border-purple-500/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
              title="Read Ghostie's Story"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Ghostie's Story</span>
            </button>
          )}

          <button
            onClick={handleResetLevel}
            type="button"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-600/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Restart this problem from the beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* 2. THE MAGICAL LANTERN TRAIL (MAIN FOCUS) */}
      <LanternTrail
        startNumber={activeLevel.subtrahend}
        targetNumber={activeLevel.minuend}
        currentNumber={currentNumber}
        milestones={milestones}
        completedJumps={completedJumps}
        totalCollected={totalCollected}
        isCompleted={currentNumber === activeLevel.minuend}
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
            <span className="font-mono font-bold text-white">{activeLevel.subtrahend}</span> and jump to friendly benchmarks to reach{' '}
            <span className="font-mono font-bold text-white">{activeLevel.minuend}</span>. Adding all our jumps gives the exact subtraction answer!
          </div>
        </div>

        {/* RIGHT: Question Prompt & 4 Shuffled Options (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0b2434] via-[#071a26] to-[#041018] border-2 border-teal-400/80 rounded-3xl p-3.5 sm:p-5 shadow-xl flex flex-col gap-3">
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-teal-500/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-black font-black text-xs uppercase tracking-wider">
                Step {stepIndex + 1} of {activeLevel.steps.length}
              </span>
              <span className="text-xs font-black text-amber-300">
                Jump from {activeStep.from} ➡️ {activeStep.to}
              </span>
            </div>

            {/* Read question button */}
            <button
              onClick={handleSpeakQuestion}
              type="button"
              className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-amber-300 transition-colors cursor-pointer"
              title="Read question aloud"
              aria-label="Read question aloud"
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

              let btnStyle = 'bg-teal-950/70 hover:bg-teal-900 border-teal-500/40 text-teal-100 hover:border-amber-400';
              if (isRight) {
                btnStyle = 'bg-emerald-900 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-[1.02]';
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

                  {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isWrong && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Educational Feedback Alert with Gentle Hint */}
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

          {/* Continue Next Step Action Button (or wait for auto-advance) */}
          {isCorrect && stepIndex < activeLevel.steps.length - 1 && (
            <button
              onClick={handleContinue}
              type="button"
              className="w-full mt-0.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer animate-popIn"
            >
              <span>Next Jump along the Trail ➡️</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Hint Accordion Toggle */}
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
        minuend={activeLevel.minuend}
        subtrahend={activeLevel.subtrahend}
        diff={activeLevel.diff}
        completedJumps={completedJumps}
        levelTitle={activeLevel.title}
        onNextLevel={handleNextLevelFromCelebration}
        onPlayAgain={handleResetLevel}
        onOpenSandbox={onOpenSandbox}
        hasNextLevel={levelIndex < MATH_O_LANTERN_LEVELS.length - 1}
      />
    </div>
  );
}
