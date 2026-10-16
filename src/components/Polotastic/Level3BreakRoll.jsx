import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import PoloRoll from './PoloRoll';
import PoloCounter from './PoloCounter';
import PipCharacter from './PipCharacter';
import PoloAnswerInput from './PoloAnswerInput';
import { generateLevel3Question } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * Level3BreakRoll Component
 * Level 3 — Break a Roll!
 * Two-Digit Minus One-Digit WITH Borrowing.
 * 
 * Direct Typing & Multi-Step Validation:
 * Step 1: Child taps roll to break it into 10 loose Polos.
 *         Child types number of loose Polos available before subtraction (e.g., 12).
 * Step 2: Child takes away subtrahend Polos.
 *         Child types number of loose Polos remaining (e.g., 5).
 * Step 3: Child combines remaining rolls and loose Polos, then types the complete answer (e.g., 25).
 * Zero MCQs anywhere in Level 3.
 */
export default function Level3BreakRoll({
  onComplete,
  onReturnToStages,
}) {
  const [currentProblem, setCurrentProblem] = useState(() => generateLevel3Question());
  
  // Stages within a problem:
  // 'initial' -> child must break a roll
  // 'step1_typed' -> child types loose Polos after break (e.g. 12)
  // 'ready_takeaway' -> child removes loose Polos into basket
  // 'step2_typed' -> child types remaining loose Polos (e.g. 5)
  // 'step3_typed' -> child types final total (e.g. 25)
  // 'solved' -> question complete
  const [borrowStep, setBorrowStep] = useState('initial');
  const [removedLoose, setRemovedLoose] = useState(0);
  const [solvedInSession, setSolvedInSession] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const TARGET_SOLVED = 4;

  const usedKeys = useRef([]);

  const loadNextQuestion = () => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateLevel3Question(usedKeys.current);
    setCurrentProblem(nextQ);
    setBorrowStep('initial');
    setRemovedLoose(0);
    sounds.playPop();
  };

  // Step 0: Child taps roll to break it into 10 loose Polos
  const handleBreakRoll = () => {
    if (borrowStep !== 'initial') return;
    sounds.playPop();
    setBorrowStep('step1_typed');
  };

  // Step 1: Submit count of loose Polos available after breaking roll
  const handleStep1Submit = ({ isCorrect }) => {
    if (isCorrect) {
      setBorrowStep('ready_takeaway');
    }
  };

  // Child removes loose Polos
  const handleRemovePolo = (idx) => {
    if (borrowStep !== 'ready_takeaway') return;
    if (idx === removedLoose && removedLoose < currentProblem.subtrahend) {
      sounds.playPop();
      const nextRemoved = removedLoose + 1;
      setRemovedLoose(nextRemoved);
      if (nextRemoved === currentProblem.subtrahend) {
        setBorrowStep('step2_typed');
      }
    }
  };

  const handleTakeAwayAll = () => {
    if (borrowStep !== 'ready_takeaway') return;
    sounds.playPop();
    setRemovedLoose(currentProblem.subtrahend);
    setBorrowStep('step2_typed');
  };

  // Step 2: Submit count of remaining loose Polos
  const handleStep2Submit = ({ isCorrect }) => {
    if (isCorrect) {
      setBorrowStep('step3_typed');
    }
  };

  // Step 3: Submit final answer
  const handleStep3Submit = ({ isCorrect }) => {
    if (isCorrect) {
      setBorrowStep('solved');
      const newSolved = solvedInSession + 1;
      setSolvedInSession(newSolved);

      if (newSolved >= TARGET_SOLVED) {
        setTimeout(() => {
          sounds.playVictory();
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setIsLevelFinished(true);
          if (onComplete) onComplete();
        }, 1200);
      }
    }
  };

  const hasBrokenRoll = borrowStep !== 'initial';

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
                {currentProblem.minuend} − {currentProblem.subtrahend} = {borrowStep === 'solved' ? currentProblem.diff : '?'}
              </h2>
              <span className="text-xs text-emerald-300/80">
                We need to remove {currentProblem.subtrahend} Polos, but only have {currentProblem.ones} loose Polos!
              </span>
            </div>

            {/* Standard Vertical Algorithm Layout with Dynamic Regrouping Marks */}
            <div className="bg-[#021811] border-2 border-emerald-400/80 rounded-2xl p-3 px-5 font-mono shadow-inner flex flex-col items-end">
              <div className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider mb-1">
                Vertical Algorithm
              </div>
              
              {/* Regrouping row (crossed out digits) */}
              <div className="flex items-center gap-3 text-xs font-bold text-amber-300 mb-0.5">
                {hasBrokenRoll ? (
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

              {/* Minuend row with strikethroughs */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-white">
                <span className={`w-4 text-center ${hasBrokenRoll ? 'line-through text-gray-500' : ''}`}>
                  {currentProblem.tens}
                </span>
                <span className={`w-4 text-center ${hasBrokenRoll ? 'line-through text-gray-500' : ''}`}>
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
                  {borrowStep === 'solved' ? currentProblem.finalRolls : '?'}
                </span>
                <span className="w-4 text-center">
                  {borrowStep === 'step3_typed' || borrowStep === 'solved'
                    ? currentProblem.remainingLoose
                    : '?'}
                </span>
              </div>
            </div>
          </div>

          {/* Pip Character Instructions per Sub-step */}
          <PipCharacter
            mood={borrowStep === 'initial' ? 'thinking' : borrowStep === 'solved' ? 'cheering' : 'guiding'}
            speechText={
              borrowStep === 'initial'
                ? `We need to take away ${currentProblem.subtrahend} Polos, but we only have ${currentProblem.ones} loose Polos! Tap a roll to break it into 10 loose Polos!`
                : borrowStep === 'step1_typed'
                ? `Awesome! 1 roll just broke apart into 10 loose Polos! How many loose Polos do we have on the plate now? Type your answer below!`
                : borrowStep === 'ready_takeaway'
                ? `Now we have plenty of loose Polos! Take away ${currentProblem.subtrahend} loose Polos into the basket.`
                : borrowStep === 'step2_typed'
                ? `You took away ${currentProblem.subtrahend} Polos! How many loose Polos are left on the plate now? Type your count below!`
                : borrowStep === 'step3_typed'
                ? `Almost there! Combine the ${currentProblem.tens - 1} rolls (${(currentProblem.tens - 1) * 10}) and ${currentProblem.remainingLoose} loose Polos. What is ${currentProblem.minuend} − ${currentProblem.subtrahend}?`
                : `Magnificent! You completed every step of borrowing: ${currentProblem.minuend} − ${currentProblem.subtrahend} = ${currentProblem.diff}!`
            }
          />

          {/* Interactive Place-Value Manipulatives */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Tens Section: Rolls (6 cols) */}
            <div className="lg:col-span-6 flex flex-col p-4 rounded-3xl bg-[#031d16]/80 border-2 border-emerald-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-emerald-300 uppercase tracking-wider mb-2">
                <span>🥖 Tens: {hasBrokenRoll ? currentProblem.tens - 1 : currentProblem.tens} Rolls Left</span>
                {borrowStep === 'initial' && (
                  <span className="text-amber-300 text-[10px] bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400 animate-pulse">
                    Tap a Roll to Break!
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 p-2 flex-1">
                {Array.from({ length: currentProblem.tens }).map((_, idx) => {
                  const isBrokenRoll = hasBrokenRoll && idx === currentProblem.tens - 1;
                  return (
                    <div
                      key={idx}
                      onClick={idx === currentProblem.tens - 1 && borrowStep === 'initial' ? handleBreakRoll : undefined}
                      className={`transition-all duration-500 ${
                        isBrokenRoll
                          ? 'opacity-20 scale-75 pointer-events-none'
                          : borrowStep === 'initial' && idx === currentProblem.tens - 1
                          ? 'cursor-pointer hover:scale-110 ring-2 ring-amber-400 rounded-2xl animate-pulse'
                          : ''
                      }`}
                      title={borrowStep === 'initial' && idx === currentProblem.tens - 1 ? 'Click to Break Roll into 10 loose Polos!' : ''}
                    >
                      <PoloRoll
                        rollNumber={idx + 1}
                        size="md"
                        canBreak={borrowStep === 'initial' && idx === currentProblem.tens - 1}
                        showBadge={true}
                      />
                    </div>
                  );
                })}
              </div>

              {borrowStep === 'initial' && (
                <button
                  onClick={handleBreakRoll}
                  type="button"
                  className="mt-2 w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Tap Here to Break 1 Roll into 10 Polos</span>
                </button>
              )}
            </div>

            {/* Ones Section: Loose Polos & Takeaway (6 cols) */}
            <div className="lg:col-span-6 flex flex-col p-4 rounded-3xl bg-[#0a261d]/80 border-2 border-amber-500/50 shadow-inner min-h-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
                <span>
                  🍬 Loose Polos ({hasBrokenRoll ? (currentProblem.ones + 10) - removedLoose : currentProblem.ones} on plate)
                </span>
                {hasBrokenRoll && (
                  <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    +10 Added from Roll
                  </span>
                )}
              </div>

              {/* Loose Polos on Plate */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 flex-1">
                {Array.from({ length: hasBrokenRoll ? currentProblem.ones + 10 : currentProblem.ones }).map((_, idx) => {
                  const isRemoved = idx < removedLoose;
                  const isFromBorrow = idx >= currentProblem.ones;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleRemovePolo(idx)}
                      className={`transition-all duration-300 ${
                        isRemoved
                          ? 'opacity-20 scale-75 pointer-events-none'
                          : borrowStep === 'ready_takeaway'
                          ? 'cursor-pointer hover:scale-110 active:scale-95'
                          : ''
                      } ${isFromBorrow ? 'animate-popIn' : ''}`}
                      title={borrowStep === 'ready_takeaway' ? 'Tap to takeaway' : ''}
                    >
                      <PoloCounter
                        size="sm"
                        numberLabel={isRemoved ? '✕' : idx + 1}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Takeaway Controls when ready */}
              {borrowStep === 'ready_takeaway' && (
                <div className="pt-2 border-t border-amber-800/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-amber-200">
                    Removed: {removedLoose} of {currentProblem.subtrahend}
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
          </div>

          {/* Value Equality Guarantee Banner */}
          <div className="p-2.5 bg-[#031d16] border border-emerald-400/60 rounded-2xl text-center text-xs text-emerald-200 font-mono">
            {!hasBrokenRoll ? (
              <span>Initial Value: {currentProblem.tens} tens + {currentProblem.ones} ones = <strong className="text-white">{currentProblem.minuend}</strong></span>
            ) : (
              <span>Regrouped Value: {currentProblem.tens - 1} tens ({(currentProblem.tens - 1) * 10}) + {currentProblem.ones + 10} ones = <strong className="text-white">{currentProblem.minuend}</strong> (Mathematical value NEVER changes!)</span>
            )}
          </div>

          {/* Direct Typing Multi-Step Section (Zero MCQs) */}
          <div className="flex flex-col items-center gap-3 pt-3 border-t border-emerald-800/50">
            {borrowStep === 'initial' && (
              <div className="text-center p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-200 text-xs sm:text-sm font-bold">
                👉 Tap the glowing roll above to break it into 10 loose Polos first!
              </div>
            )}

            {borrowStep === 'step1_typed' && (
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider text-center">
                  Step 1: After breaking 1 roll into 10 Polos, how many loose Polos are on the plate now?
                </span>
                <PoloAnswerInput
                  key={`l3_s1_${currentProblem.key}`}
                  targetValue={currentProblem.step1Target}
                  prefix="Available Loose Polos = "
                  suffix="Polos"
                  placeholder="___"
                  helperTip={currentProblem.step1Helper}
                  showKeypad={true}
                  onSubmit={handleStep1Submit}
                />
              </div>
            )}

            {borrowStep === 'ready_takeaway' && (
              <div className="text-center p-3 rounded-2xl bg-amber-950/70 border border-amber-400 text-amber-200 text-xs sm:text-sm font-bold">
                👉 Now click loose Polos or tap &quot;Take Away All {currentProblem.subtrahend}&quot; to remove them into the basket!
              </div>
            )}

            {borrowStep === 'step2_typed' && (
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider text-center">
                  Step 2: You removed {currentProblem.subtrahend} Polos. How many loose Polos are left on the plate?
                </span>
                <PoloAnswerInput
                  key={`l3_s2_${currentProblem.key}`}
                  targetValue={currentProblem.step2Target}
                  prefix={`${currentProblem.ones + 10} − ${currentProblem.subtrahend} = `}
                  suffix="loose Polos"
                  placeholder="___"
                  helperTip={currentProblem.step2Helper}
                  showKeypad={true}
                  onSubmit={handleStep2Submit}
                />
              </div>
            )}

            {borrowStep === 'step3_typed' && (
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider text-center">
                  Step 3: Combine {currentProblem.tens - 1} rolls ({ (currentProblem.tens - 1) * 10 }) and {currentProblem.remainingLoose} loose Polos. What is {currentProblem.minuend} − {currentProblem.subtrahend}?
                </span>
                <PoloAnswerInput
                  key={`l3_s3_${currentProblem.key}`}
                  targetValue={currentProblem.step3Target}
                  prefix={`${currentProblem.minuend} − ${currentProblem.subtrahend} = `}
                  suffix="total"
                  placeholder="___"
                  helperTip={currentProblem.step3Helper}
                  showKeypad={true}
                  onSubmit={handleStep3Submit}
                />
              </div>
            )}

            {borrowStep === 'solved' && solvedInSession < TARGET_SOLVED && (
              <div className="p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-2 animate-fadeIn bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 w-full max-w-md">
                <p className="text-white font-black">
                  🎉 Fantastic! {currentProblem.minuend} − {currentProblem.subtrahend} = {currentProblem.diff}! You mastered borrowing with typed verification!
                </p>
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
        </div>
      ) : (
        /* Level 3 Complete Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🏆
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Full Curriculum Completed!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Polotastic Master!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              Congratulations! You have completed the Guidebook, Polo Dash, and all three levels of subtraction with typed mathematical verification!
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
              <span>Return to Stage Hub</span>
              <Sparkles className="w-5 h-5 text-black" />
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
              <span>Practice More Borrowing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
