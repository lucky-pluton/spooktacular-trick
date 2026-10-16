import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import PoloCounter from './PoloCounter';
import PipCharacter from './PipCharacter';
import { generateLevel1Question } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * Level1Takeaway Component
 * Level 1 — Polo Takeaway
 * Single-Digit Subtraction Without Borrowing.
 */
export default function Level1Takeaway({
  onComplete,
  onReturnToStages,
  onNextLevel,
}) {
  const [currentProblem, setCurrentProblem] = useState(() => generateLevel1Question());
  const [removedCount, setRemovedCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, text: string }
  const [solvedInSession, setSolvedInSession] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const TARGET_SOLVED = 4;

  const usedKeys = React.useRef([]);

  // Reset per question
  const loadNextQuestion = () => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateLevel1Question(usedKeys.current);
    setCurrentProblem(nextQ);
    setRemovedCount(0);
    setSelectedAnswer(null);
    setFeedback(null);
    sounds.playPop();
  };

  const handlePoloClick = () => {
    if (feedback !== null || isLevelFinished) return;
    // Allow clicking loose Polos to take them away up to the required subtrahend
    if (removedCount < currentProblem.subtrahend) {
      sounds.playPop();
      setRemovedCount((c) => c + 1);
    }
  };

  const handleAnswerSubmit = (value) => {
    if (feedback !== null || isLevelFinished) return;
    setSelectedAnswer(value);

    if (value === currentProblem.diff) {
      sounds.playSuccess();
      const newSolved = solvedInSession + 1;
      setSolvedInSession(newSolved);
      setFeedback({
        isCorrect: true,
        text: `Super! ${currentProblem.minuend} − ${currentProblem.subtrahend} = ${currentProblem.diff}! Exactly ${currentProblem.diff} Polos remain!`,
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
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: `Let's count together! You had ${currentProblem.minuend} Polos and took away ${currentProblem.subtrahend}. Count the remaining Polos on the plate!`,
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

        {/* Progress tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">
            Level 1: Polo Takeaway ({solvedInSession}/{TARGET_SOLVED})
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
              Single-Digit Subtraction Without Borrowing
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
            speechText={`We started with ${currentProblem.minuend} Polos. Take away ${currentProblem.subtrahend} Polos into the takeaway basket! Then count how many remain.`}
            size="sm"
          />

          {/* Interactive Playground: Plate vs Takeaway Basket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            {/* Left: The Plate with Remaining Polos */}
            <div className="flex flex-col items-center justify-between p-4 rounded-3xl bg-[#031d16]/80 border-2 border-emerald-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-emerald-300 uppercase tracking-wider mb-2">
                <span>🍽️ Plate ({currentProblem.minuend - removedCount} left)</span>
                <span className="text-emerald-400/80">Tap Polo to remove</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 p-2">
                {Array.from({ length: currentProblem.minuend }).map((_, idx) => {
                  const isRemoved = idx < removedCount;
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePoloClick(idx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        isRemoved ? 'opacity-20 scale-75 pointer-events-none' : 'hover:scale-110 active:scale-95'
                      }`}
                    >
                      <PoloCounter size="md" numberLabel={isRemoved ? '✕' : idx + 1} />
                    </div>
                  );
                })}
              </div>

              <span className="text-[11px] font-bold text-emerald-200 mt-2">
                Plate has {currentProblem.minuend - removedCount} Polo{currentProblem.minuend - removedCount === 1 ? '' : 's'} remaining
              </span>
            </div>

            {/* Right: The Takeaway Basket */}
            <div className="flex flex-col items-center justify-between p-4 rounded-3xl bg-[#0a261d]/80 border-2 border-amber-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
                <span>🧺 Takeaway Basket ({removedCount} of {currentProblem.subtrahend} taken)</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[70px] p-2">
                {removedCount === 0 ? (
                  <span className="text-xs text-amber-300/60 italic font-medium">
                    Basket is empty! Tap Polos on the plate to remove them here.
                  </span>
                ) : (
                  Array.from({ length: removedCount }).map((_, idx) => (
                    <div key={idx} className="animate-popIn">
                      <PoloCounter size="sm" numberLabel={`-${idx + 1}`} />
                    </div>
                  ))
                )}
              </div>

              {/* Quick Auto Takeaway Button */}
              {removedCount < currentProblem.subtrahend ? (
                <button
                  onClick={() => {
                    sounds.playPop();
                    setRemovedCount(currentProblem.subtrahend);
                  }}
                  type="button"
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all cursor-pointer shadow"
                >
                  Take Away {currentProblem.subtrahend - removedCount} More Automatically
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>All {currentProblem.subtrahend} Polos taken away!</span>
                </span>
              )}
            </div>
          </div>

          {/* Answer Selection Keypad */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-emerald-800/50">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              How many Polos are left on the plate?
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentProblem.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSubmit(choice.value)}
                  disabled={feedback?.isCorrect}
                  type="button"
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 font-mono font-black text-xl sm:text-2xl shadow transition-all cursor-pointer flex items-center justify-center ${
                    selectedAnswer === choice.value
                      ? choice.isCorrect
                        ? 'bg-emerald-400 border-emerald-300 text-black scale-110 shadow-[0_0_20px_rgba(16,185,129,0.9)]'
                        : 'bg-red-900 border-red-400 text-white animate-shake'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-600/70 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {choice.value}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-1.5 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200'
                : 'bg-amber-500/25 border-2 border-amber-400 text-amber-200'
            }`}>
              <p>{feedback.text}</p>
              {feedback.isCorrect && solvedInSession < TARGET_SOLVED && (
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
        /* Level 1 Complete Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🍬
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Level 1 Mastered!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Polo Takeaway Complete!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              You've successfully solved single-digit subtraction without borrowing! You are now ready for two-digit numbers with rolls!
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
              <span>Unlock Level 2: Roll & Remove</span>
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
              <span>Practice More Level 1</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
