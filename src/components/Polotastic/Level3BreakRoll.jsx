import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import PoloCounter from './PoloCounter';
import PoloRoll from './PoloRoll';
import PipCharacter from './PipCharacter';
import { generateLevel3Question } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * Level3BreakRoll Component
 * Level 3 — Break a Roll!
 * Two-Digit Minus One-Digit With Borrowing / Regrouping.
 */
export default function Level3BreakRoll({
  onComplete,
  onReturnToStages,
}) {
  const [currentProblem, setCurrentProblem] = useState(() => generateLevel3Question());
  // Step in borrowing:
  // 'initial' (need to break a roll)
  // 'broken' (roll is broken into 10 loose Polos, now have 12 loose Polos, ready to takeaway)
  // 'taken' (subtrahend loose Polos removed, ready to enter final answer)
  const [borrowStep, setBorrowStep] = useState('initial');
  const [removedLoose, setRemovedLoose] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [solvedInSession, setSolvedInSession] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const TARGET_SOLVED = 4;

  const usedKeys = React.useRef([]);

  const loadNextQuestion = () => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateLevel3Question(usedKeys.current);
    setCurrentProblem(nextQ);
    setBorrowStep('initial');
    setRemovedLoose(0);
    setSelectedAnswer(null);
    setFeedback(null);
    sounds.playPop();
  };

  // Step 1: Child clicks on a roll to break it into 10 loose Polos
  const handleBreakRoll = () => {
    if (borrowStep !== 'initial') return;
    sounds.playCandyBorrow();
    setBorrowStep('broken');
    setFeedback({
      isCorrect: true,
      text: `CRACK! One roll broke into 10 loose Polos! We now have ${currentProblem.tens - 1} rolls and ${currentProblem.ones + 10} loose Polos. Total value is still ${currentProblem.minuend}!`,
    });
  };

  // Step 2: Child removes loose Polos into basket
  const handlePoloClick = () => {
    if (borrowStep === 'initial') {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: `We only have ${currentProblem.ones} loose Polos, but we need to take away ${currentProblem.subtrahend}! Tap a roll above to BREAK it into 10 loose Polos first!`,
      });
      return;
    }

    if (removedLoose < currentProblem.subtrahend) {
      sounds.playPop();
      const nextCount = removedLoose + 1;
      setRemovedLoose(nextCount);
      if (nextCount === currentProblem.subtrahend) {
        setBorrowStep('taken');
      }
    }
  };

  const handleTakeAwayAll = () => {
    if (borrowStep === 'initial') {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: `Not enough loose Polos yet! Tap a roll to BREAK it into 10 loose Polos first!`,
      });
      return;
    }
    sounds.playPop();
    setRemovedLoose(currentProblem.subtrahend);
    setBorrowStep('taken');
  };

  // Step 3: Child enters final answer
  const handleAnswerSubmit = (value) => {
    if (feedback?.isCorrect && selectedAnswer === currentProblem.diff) return;
    setSelectedAnswer(value);

    if (value === currentProblem.diff) {
      sounds.playSuccess();
      const newSolved = solvedInSession + 1;
      setSolvedInSession(newSolved);
      setFeedback({
        isCorrect: true,
        text: `Magnificent! ${currentProblem.minuend} − ${currentProblem.subtrahend} = ${currentProblem.diff}! You mastered borrowing through place-value regrouping!`,
      });

      if (newSolved >= TARGET_SOLVED) {
        setTimeout(() => {
          sounds.playVictory();
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setIsLevelFinished(true);
          if (onComplete) {
            onComplete();
          }
        }, 1200);
      }
    } else {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: `Check the remaining pieces: We have ${currentProblem.finalRolls} rolls (${currentProblem.finalRolls * 10}) and ${currentProblem.remainingLoose} loose Polos. Combine them to get the final answer!`,
      });
    }
  };

  // Visual counts
  const currentRollsCount = borrowStep === 'initial' ? currentProblem.tens : currentProblem.tens - 1;
  const currentTotalLoose = borrowStep === 'initial' ? currentProblem.ones : currentProblem.ones + 10;
  const visibleLooseRemaining = currentTotalLoose - removedLoose;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 animate-fadeIn select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 bg-[#09221b]/90 border border-emerald-500/50 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => {
            sounds.playPop();
            if (onReturnToStages) onReturnToStages();
          }}
          type="button"
          className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Stage Hub</span>
        </button>

        {/* Progress tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
            Level 3: Break a Roll! ({solvedInSession}/{TARGET_SOLVED})
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: TARGET_SOLVED }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < solvedInSession
                    ? 'bg-emerald-400'
                    : i === solvedInSession
                    ? 'bg-amber-400 ring-2 ring-amber-300 animate-pulse'
                    : 'bg-emerald-950 border border-emerald-800'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={loadNextQuestion}
          type="button"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
          title="Try a different question"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">New Question</span>
        </button>
      </div>

      {!isLevelFinished ? (
        <div className="relative bg-[#061e17]/95 border-3 border-emerald-400/80 rounded-[36px] p-4 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-md flex flex-col gap-4">
          {/* Header & Subtraction Layout Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-800/50 pb-3">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                Two-Digit Minus One-Digit With Borrowing
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentProblem.minuend} − {currentProblem.subtrahend} = {feedback?.isCorrect ? currentProblem.diff : '?'}
              </h2>
              <span className="text-xs text-emerald-300/80">
                We need to remove {currentProblem.subtrahend} Polos, but only have {currentProblem.ones} loose Polos!
              </span>
            </div>

            {/* Standard Vertical Algorithm Layout with Regrouping Marks */}
            <div className="bg-[#021811] border-2 border-emerald-400/80 rounded-2xl p-3 px-5 font-mono shadow-inner flex flex-col items-end">
              <div className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider mb-1">
                Vertical Algorithm
              </div>
              
              {/* Regrouping row (crossed out digits) */}
              <div className="flex items-center gap-3 text-xs font-bold text-amber-300 mb-0.5">
                {borrowStep !== 'initial' ? (
                  <>
                    <span className="w-4 text-center text-amber-400 animate-popIn">{currentProblem.tens - 1}</span>
                    <span className="w-4 text-center text-amber-400 animate-popIn">{currentProblem.ones + 10}</span>
                  </>
                ) : (
                  <>
                    <span className="w-4 text-center opacity-0">-</span>
                    <span className="w-4 text-center opacity-0">-</span>
                  </>
                )}
              </div>

              {/* Minuend row with optional strikethroughs */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-white">
                <span className={`w-4 text-center ${borrowStep !== 'initial' ? 'line-through text-gray-500' : ''}`}>
                  {currentProblem.tens}
                </span>
                <span className={`w-4 text-center ${borrowStep !== 'initial' ? 'line-through text-gray-500' : ''}`}>
                  {currentProblem.ones}
                </span>
              </div>

              {/* Subtrahend row */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-amber-300 border-b-2 border-white pb-0.5">
                <span className="w-4 text-center text-emerald-400">−</span>
                <span className="w-4 text-center">{currentProblem.subtrahend}</span>
              </div>

              {/* Difference row */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-emerald-300 pt-0.5">
                <span className="w-4 text-center">
                  {feedback?.isCorrect ? currentProblem.finalRolls : borrowStep !== 'initial' ? currentProblem.tens - 1 : '?'}
                </span>
                <span className="w-4 text-center">
                  {feedback?.isCorrect ? currentProblem.remainingLoose : borrowStep === 'taken' ? currentProblem.remainingLoose : '?'}
                </span>
              </div>
            </div>
          </div>

          {/* Pip Character Instructions */}
          <PipCharacter
            mood={borrowStep === 'initial' ? 'thinking' : feedback?.isCorrect ? 'cheering' : 'guiding'}
            speechText={
              borrowStep === 'initial'
                ? `Uh oh! We only have ${currentProblem.ones} loose Polos, which is not enough to take away ${currentProblem.subtrahend}! Click on one of the rolls below to BREAK IT into 10 loose Polos!`
                : borrowStep === 'broken'
                ? `Fantastic! That roll became 10 loose Polos. Now we have ${currentProblem.ones + 10} loose Polos! Take away ${currentProblem.subtrahend} Polos into the basket.`
                : `Great! ${currentProblem.finalRolls} rolls and ${currentProblem.remainingLoose} loose Polos remain. Enter the final answer below!`
            }
            size="sm"
          />

          {/* Step 1: Breaking a Roll */}
          <div className="p-4 rounded-3xl bg-[#031d16]/80 border-2 border-emerald-500/50 shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between w-full text-xs font-black text-emerald-300 uppercase tracking-wider">
              <span>🥖 Tens Rolls ({currentRollsCount} Whole Rolls)</span>
              {borrowStep === 'initial' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase animate-bounce">
                  ⚡ Click a roll to break it!
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">
                  ✓ 1 Roll regrouped into 10 loose Polos
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 p-2">
              {Array.from({ length: currentRollsCount }).map((_, idx) => (
                <PoloRoll
                  key={idx}
                  rollNumber={idx + 1}
                  size="md"
                  canBreak={borrowStep === 'initial'}
                  onBreakRoll={handleBreakRoll}
                  showBadge={true}
                />
              ))}

              {borrowStep !== 'initial' && (
                <div className="p-2 rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-950/40 text-[11px] text-emerald-300 text-center font-bold flex items-center gap-1.5 animate-fadeIn">
                  <span>💥</span>
                  <span>1 roll became 10 loose Polos!</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Loose Polos & Takeaway */}
          <div className="p-4 rounded-3xl bg-[#0a261d]/80 border-2 border-amber-500/50 shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between w-full text-xs font-black text-amber-300 uppercase tracking-wider">
              <span>
                🍬 Loose Polos ({visibleLooseRemaining} left)
              </span>
              <span className="text-[10px] text-amber-400">
                {borrowStep === 'initial'
                  ? 'Need to break roll first'
                  : `Taken ${removedLoose} of ${currentProblem.subtrahend}`}
              </span>
            </div>

            {/* Loose Polos Grid */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 min-h-[90px]">
              {Array.from({ length: currentTotalLoose }).map((_, idx) => {
                const isRemoved = idx < removedLoose;
                return (
                  <div
                    key={idx}
                    onClick={() => handlePoloClick(idx)}
                    className={`transition-all duration-300 cursor-pointer ${
                      isRemoved
                        ? 'opacity-20 scale-75 pointer-events-none'
                        : 'hover:scale-110 active:scale-95'
                    }`}
                  >
                    <PoloCounter size="sm" numberLabel={isRemoved ? '✕' : idx + 1} />
                  </div>
                );
              })}
            </div>

            {/* Quick Action Buttons for Step 2 */}
            {borrowStep !== 'initial' && (
              <div className="pt-2 border-t border-amber-800/40 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-amber-200">
                  {removedLoose < currentProblem.subtrahend
                    ? `Click loose Polos or takeaway all ${currentProblem.subtrahend} at once`
                    : `✓ ${currentProblem.subtrahend} Polos removed into basket!`}
                </span>

                {removedLoose < currentProblem.subtrahend && (
                  <button
                    onClick={handleTakeAwayAll}
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black cursor-pointer shadow"
                  >
                    Take Away All {currentProblem.subtrahend}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Value Equality Guarantee Banner */}
          <div className="p-2.5 bg-[#031d16] border border-emerald-400/60 rounded-2xl text-center text-xs text-emerald-200 font-mono">
            {borrowStep === 'initial' ? (
              <span>Initial: {currentProblem.tens} tens + {currentProblem.ones} ones = <strong className="text-white">{currentProblem.minuend}</strong></span>
            ) : (
              <span>Regrouped: {currentProblem.tens - 1} tens ({(currentProblem.tens - 1) * 10}) + {currentProblem.ones + 10} ones = <strong className="text-white">{currentProblem.minuend}</strong> (Value NEVER changes!)</span>
            )}
          </div>

          {/* Answer Selection Keypad */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-emerald-800/50">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              {borrowStep !== 'taken'
                ? 'Break the roll and remove the Polos first!'
                : `What is the final answer for ${currentProblem.minuend} − ${currentProblem.subtrahend}?`}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentProblem.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSubmit(choice.value)}
                  disabled={borrowStep !== 'taken' || (feedback?.isCorrect && selectedAnswer === choice.value)}
                  type="button"
                  className={`w-16 h-14 sm:w-20 sm:h-16 rounded-2xl border-2 font-mono font-black text-xl sm:text-2xl shadow transition-all flex items-center justify-center ${
                    borrowStep !== 'taken'
                      ? 'opacity-30 border-gray-700 bg-gray-950 text-gray-500 cursor-not-allowed'
                      : selectedAnswer === choice.value
                      ? choice.isCorrect
                        ? 'bg-emerald-400 border-emerald-300 text-black scale-110 shadow-[0_0_20px_rgba(16,185,129,0.9)] cursor-pointer'
                        : 'bg-red-900 border-red-400 text-white animate-shake cursor-pointer'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-600/70 text-white hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
                >
                  {choice.value}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-1.5 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200'
                : 'bg-amber-500/25 border-2 border-amber-400 text-amber-200'
            }`}>
              <p>{feedback.text}</p>
              {feedback.isCorrect && selectedAnswer === currentProblem.diff && solvedInSession < TARGET_SOLVED && (
                <button
                  onClick={loadNextQuestion}
                  type="button"
                  className="mt-1 px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs cursor-pointer shadow flex items-center gap-1"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Level 3 Complete Screen (Grand Victory for Polotastic Subtraction!) */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.6)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-emerald-400 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,180,0,0.9)] border-3 border-white animate-bounce">
            👑
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Grand Polotastic Master!</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Break a Roll Completed!
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 max-w-lg mx-auto mt-1 leading-relaxed">
              Incredible achievement! You have mastered place-value regrouping and borrowing! You understand that 1 ten decomposes into 10 ones without ever changing the overall mathematical value.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-3">
            <button
              onClick={() => {
                sounds.playPop();
                if (onReturnToStages) onReturnToStages();
              }}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-black" />
              <span>Return to Polotastic Hub</span>
            </button>

            <button
              onClick={() => {
                setSolvedInSession(0);
                setIsLevelFinished(false);
                loadNextQuestion();
              }}
              type="button"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500/60 text-emerald-200 font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Play More Level 3 Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
