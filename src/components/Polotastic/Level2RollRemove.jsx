import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import PoloRoll from './PoloRoll';
import PoloCounter from './PoloCounter';
import PipCharacter from './PipCharacter';
import PoloAnswerInput from './PoloAnswerInput';
import { generateLevel2Question } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * Level2RollRemove Component
 * Level 2 — Roll & Remove
 * Two-Digit Minus One-Digit Without Borrowing.
 * 
 * Direct Typing Upgrade:
 * - Child removes loose ones while observing tens rolls remain intact.
 * - Child types the total answer directly (zero MCQs).
 * - Validated against actual question difference.
 */
export default function Level2RollRemove({
  onComplete,
  onReturnToStages,
  onNextLevel,
}) {
  const [currentProblem, setCurrentProblem] = useState(() => generateLevel2Question());
  const [removedLoose, setRemovedLoose] = useState(0);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, text: string }
  const [solvedInSession, setSolvedInSession] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const TARGET_SOLVED = 4;

  const usedKeys = useRef([]);

  const loadNextQuestion = () => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateLevel2Question(usedKeys.current);
    setCurrentProblem(nextQ);
    setRemovedLoose(0);
    setFeedback(null);
    sounds.playPop();
  };

  const handlePoloClick = (index) => {
    if (feedback?.isCorrect || isLevelFinished) return;
    if (index === removedLoose && removedLoose < currentProblem.subtrahend) {
      sounds.playPop();
      setRemovedLoose((r) => r + 1);
    }
  };

  const handleAnswerSubmit = ({ isCorrect }) => {
    if (isLevelFinished) return;

    if (isCorrect) {
      const newSolved = solvedInSession + 1;
      setSolvedInSession(newSolved);
      setFeedback({
        isCorrect: true,
        text: `Brilliant! ${currentProblem.minuend} − ${currentProblem.subtrahend} = ${currentProblem.diff}! You kept the ${currentProblem.tens} rolls intact and removed ${currentProblem.subtrahend} loose Polos!`,
      });

      if (newSolved >= TARGET_SOLVED) {
        setTimeout(() => {
          sounds.playVictory();
          try {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setIsLevelFinished(true);
          if (onComplete) onComplete();
        }, 1200);
      }
    } else {
      setFeedback({
        isCorrect: false,
        text: `Take a close look: we have ${currentProblem.tens} rolls (${currentProblem.tens * 10}) and ${currentProblem.ones - removedLoose} loose Polos remaining. Add them together!`,
      });
    }
  };

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

        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">
            Level 2: Roll & Remove ({solvedInSession}/{TARGET_SOLVED})
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
          {/* Question Equation Display */}
          <div className="text-center flex flex-col items-center gap-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
              Two-Digit Minus One-Digit Without Borrowing
            </span>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-[#021811] border-2 border-emerald-400/80 shadow-inner">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                {currentProblem.minuend}
              </span>
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">
                −
              </span>
              <span className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                {currentProblem.subtrahend}
              </span>
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                =
              </span>
              <span className="text-2xl sm:text-4xl font-black text-emerald-300 font-mono underline decoration-wavy decoration-emerald-400">
                {feedback?.isCorrect ? currentProblem.diff : '?'}
              </span>
            </div>
          </div>

          {/* Pip Narration & Guidance */}
          <PipCharacter
            mood={feedback?.isCorrect ? 'cheering' : 'guiding'}
            speechText={`We have ${currentProblem.minuend} (${currentProblem.tens} rolls and ${currentProblem.ones} loose Polos). We have plenty of loose Polos, so no rolls need to be broken! Remove ${currentProblem.subtrahend} loose Polos, then type your answer.`}
          />

          {/* Place-Value Concrete Representations (Rolls for Tens, Polos for Ones) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Tens Section: Intact Rolls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col p-4 rounded-3xl bg-[#031d16]/80 border-2 border-emerald-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-emerald-300 uppercase tracking-wider mb-2">
                <span>🥖 Tens: {currentProblem.tens} Rolls ({currentProblem.tens * 10} Polos)</span>
                <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600/50">
                  Intact • No Need to Break
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 p-2 flex-1">
                {Array.from({ length: currentProblem.tens }).map((_, idx) => (
                  <PoloRoll
                    key={idx}
                    rollNumber={idx + 1}
                    size="md"
                    canBreak={false}
                    showBadge={true}
                  />
                ))}
              </div>
            </div>

            {/* Ones Section: Loose Polos & Takeaway (5 cols) */}
            <div className="lg:col-span-5 flex flex-col p-4 rounded-3xl bg-[#0a261d]/80 border-2 border-amber-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
                <span>🍬 Loose Polos ({currentProblem.ones - removedLoose} left)</span>
                <span className="text-amber-400 text-[10px]">Tap to takeaway</span>
              </div>

              {/* Loose Polos on Plate */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 flex-1">
                {Array.from({ length: currentProblem.ones }).map((_, idx) => {
                  const isRemoved = idx < removedLoose;
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePoloClick(idx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        isRemoved ? 'opacity-20 scale-75 pointer-events-none' : 'hover:scale-110 active:scale-95'
                      }`}
                      title={isRemoved ? 'Removed' : 'Tap to take away'}
                    >
                      <PoloCounter size="sm" numberLabel={isRemoved ? '✕' : idx + 1} />
                    </div>
                  );
                })}
              </div>

              {/* Takeaway status & Button */}
              <div className="pt-2 border-t border-amber-800/40 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-amber-200">
                  Taken: {removedLoose} of {currentProblem.subtrahend}
                </span>

                {removedLoose < currentProblem.subtrahend ? (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setRemovedLoose(currentProblem.subtrahend);
                    }}
                    type="button"
                    className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black cursor-pointer shadow"
                  >
                    Take Away {currentProblem.subtrahend}
                  </button>
                ) : (
                  <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Done!</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Place Value Written Representation updates alongside */}
          <div className="p-3 bg-[#031d16] border border-emerald-400/60 rounded-2xl flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold text-emerald-200">
            <span>Tens: {currentProblem.tens} rolls = <strong className="text-white">{currentProblem.tens * 10}</strong></span>
            <span>+</span>
            <span>Ones: {currentProblem.ones} − {removedLoose} = <strong className="text-white">{currentProblem.ones - removedLoose}</strong></span>
            <span>=</span>
            <span>Total Value: <strong className="text-amber-300 text-sm">{currentProblem.tens * 10 + (currentProblem.ones - removedLoose)}</strong></span>
          </div>

          {/* Direct Answer Typing Section (Replaces All Multiple Choice Buttons) */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-emerald-800/50">
            <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">
              Type the answer for {currentProblem.minuend} − {currentProblem.subtrahend}:
            </span>

            <PoloAnswerInput
              key={`l2_input_${currentProblem.key}`}
              targetValue={currentProblem.diff}
              prefix={`${currentProblem.minuend} − ${currentProblem.subtrahend} = `}
              placeholder="___"
              helperTip={`Keep the ${currentProblem.tens} rolls (${currentProblem.tens * 10}) intact! Just subtract the ones: ${currentProblem.ones} − ${currentProblem.subtrahend} = ${currentProblem.ones - currentProblem.subtrahend}. Add them together!`}
              showKeypad={true}
              disabled={feedback?.isCorrect}
              onSubmit={handleAnswerSubmit}
            />
          </div>

          {/* Feedback banner & Next Button */}
          {feedback && feedback.isCorrect && solvedInSession < TARGET_SOLVED && (
            <div className="p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-2 animate-fadeIn bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200">
              <p className="text-white font-black">{feedback.text}</p>
              <button
                onClick={loadNextQuestion}
                type="button"
                className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs cursor-pointer shadow flex items-center gap-1 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Level 2 Complete Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🥖
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Level 2 Mastered!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Roll & Remove Complete!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              You've mastered two-digit subtraction without borrowing! Now prepare for Level 3: when you don't have enough ones, you get to Break a Roll!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-3">
            <button
              onClick={() => {
                sounds.playPop();
                if (onNextLevel) onNextLevel();
                else if (onReturnToStages) onReturnToStages();
              }}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Level 3: Break a Roll!</span>
              <ArrowRight className="w-5 h-5 text-black" />
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
              <span>Practice More Level 2</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
