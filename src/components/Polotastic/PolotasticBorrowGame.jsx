import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import PipCharacter from './PipCharacter';
import PoloAnswerInput from './PoloAnswerInput';
import PoloRoll from './PoloRoll';
import PoloPacket from './PoloPacket';
import PoloCarton from './PoloCarton';
import PoloCounter from './PoloCounter';
import { generateQuestionForLevel } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * PolotasticBorrowGame Component
 * 
 * Generic Right-to-Left Place-Value Borrowing Game Engine.
 * Supports any subtraction problem from 2-digit to 4-digit,
 * including multi-step cascades across zero (e.g. 500 − 36, 4,000 − 1,256).
 */
export default function PolotasticBorrowGame({
  levelNumber = 4,
  onComplete,
  onReturnToStages,
  onNextLevel,
}) {
  const [currentProblem, setCurrentProblem] = useState(() => generateQuestionForLevel(levelNumber));
  
  // Working state of containers in each column: [onesCount, tensCount, hundredsCount, thousandsCount]
  const [columnCounts, setColumnCounts] = useState(() => currentProblem.columns.map((c) => c.mDigit));
  
  // Active column being solved: 0 = ones, 1 = tens, 2 = hundreds, 3 = thousands
  const [activeColIndex, setActiveColIndex] = useState(0);
  
  // Step within active column: 'check_borrow' | 'ready_subtract' | 'type_result' | 'col_done'
  const [colSubStep, setColSubStep] = useState('check_borrow');
  
  // Stored differences for completed columns: { 0: diffDigit, 1: diffDigit, ... }
  const [solvedColDigits, setSolvedColDigits] = useState({});
  
  // History of regrouped digits for vertical annotations: { [colIndex]: [array of past values] }
  const [regroupAnnotations, setRegroupAnnotations] = useState({});

  // Amount subtracted in active column
  const [removedInCol, setRemovedInCol] = useState(0);

  const [solvedInSession, setSolvedInSession] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const TARGET_SOLVED = 3;

  const usedKeys = useRef([]);

  const loadNextProblem = () => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateQuestionForLevel(levelNumber, usedKeys.current);
    setCurrentProblem(nextQ);
    setColumnCounts(nextQ.columns.map((c) => c.mDigit));
    setActiveColIndex(0);
    setColSubStep('check_borrow');
    setSolvedColDigits({});
    setRegroupAnnotations({});
    setRemovedInCol(0);
    sounds.playPop();
  };

  const activeCol = currentProblem.columns[activeColIndex];
  const activeAvailable = columnCounts[activeColIndex] ?? 0;
  const activeSubtrahend = activeCol ? activeCol.sDigit : 0;
  const needsBorrow = activeAvailable < activeSubtrahend;

  // Find which column to borrow from: find the nearest column to the left with count > 0
  const findDonorCol = () => {
    for (let c = activeColIndex + 1; c < currentProblem.numDigits; c++) {
      if (columnCounts[c] > 0) return c;
    }
    return -1;
  };

  const donorColIndex = findDonorCol();

  // Execute an exchange step: unbundle 1 container from donorCol into 10 in (donorCol - 1)
  const handlePerformExchange = (fromCol) => {
    if (fromCol <= activeColIndex || columnCounts[fromCol] <= 0) return;
    sounds.playPop();

    const nextCounts = [...columnCounts];
    const prevFromVal = nextCounts[fromCol];
    const prevToVal = nextCounts[fromCol - 1];

    nextCounts[fromCol] -= 1;
    nextCounts[fromCol - 1] += 10;

    // Track annotations for the vertical algorithm
    setRegroupAnnotations((prev) => {
      const fromAnn = prev[fromCol] || [prevFromVal];
      const toAnn = prev[fromCol - 1] || [prevToVal];
      return {
        ...prev,
        [fromCol]: [...fromAnn, nextCounts[fromCol]],
        [fromCol - 1]: [...toAnn, nextCounts[fromCol - 1]],
      };
    });

    setColumnCounts(nextCounts);

    // If we just unbundled directly into active column and it now has enough, ready to subtract!
    if (fromCol - 1 === activeColIndex && nextCounts[activeColIndex] >= activeSubtrahend) {
      setColSubStep('ready_subtract');
    }
  };

  // Handle removing objects in active column
  const handleRemoveInCol = () => {
    sounds.playPop();
    setRemovedInCol(activeSubtrahend);
    setColSubStep('type_result');
  };

  // Submit typed answer for active column
  const handleColAnswerSubmit = ({ isCorrect }) => {
    if (!isCorrect) return;

    sounds.playSuccess();
    const remainingInCol = activeAvailable - activeSubtrahend;
    
    // Save column result
    const updatedSolved = {
      ...solvedColDigits,
      [activeColIndex]: remainingInCol,
    };
    setSolvedColDigits(updatedSolved);

    // Advance to next column to the left!
    if (activeColIndex + 1 < currentProblem.numDigits) {
      setTimeout(() => {
        const nextCol = activeColIndex + 1;
        setActiveColIndex(nextCol);
        setColSubStep('check_borrow');
        setRemovedInCol(0);
      }, 700);
    } else {
      // All columns solved! Problem completed!
      setTimeout(() => {
        const nextSolved = solvedInSession + 1;
        setSolvedInSession(nextSolved);

        if (nextSolved >= TARGET_SOLVED) {
          sounds.playVictory();
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setIsLevelFinished(true);
          if (onComplete) onComplete();
        }
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 animate-fadeIn select-none">
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
            {currentProblem.title} ({solvedInSession}/{TARGET_SOLVED})
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
          onClick={loadNextProblem}
          type="button"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
          title="Try a different question"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">New Problem</span>
        </button>
      </div>

      {!isLevelFinished ? (
        <div className="relative bg-[#061e17]/95 border-3 border-emerald-400/80 rounded-[36px] p-4 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-md flex flex-col gap-4">
          {/* Header & Subtraction Equation Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-800/50 pb-3">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                {currentProblem.title} • Right-to-Left Place-Value Working
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {currentProblem.minuend.toLocaleString()} − {currentProblem.subtrahend.toLocaleString()} = {
                  Object.keys(solvedColDigits).length === currentProblem.numDigits
                    ? currentProblem.diff.toLocaleString()
                    : '?'
                }
              </h2>
              <span className="text-xs text-emerald-300/80">
                Solving column: <strong className="text-amber-300 uppercase">{activeCol?.name}</strong> (Units: {activeCol?.unitName})
              </span>
            </div>

            {/* Standard Vertical Subtraction Display with Dynamic Crossed-out Regrouping */}
            <div className="bg-[#021811] border-2 border-emerald-400/80 rounded-2xl p-3 px-5 font-mono shadow-inner flex flex-col items-end">
              <div className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider mb-1">
                Vertical Algorithm
              </div>

              {/* Column Place Value Headers (Th, H, T, O) */}
              <div className="flex items-center gap-3 text-xs font-black text-emerald-400/80 mb-0.5 border-b border-emerald-800/60 pb-0.5">
                {[...currentProblem.columns].reverse().map((col) => (
                  <span key={col.id} className="w-5 text-center">
                    {col.header}
                  </span>
                ))}
              </div>

              {/* Regrouping row (annotated replacements above original digits) */}
              <div className="flex items-center gap-3 text-xs font-bold text-amber-300 mb-0.5">
                {[...currentProblem.columns].reverse().map((col) => {
                  const ann = regroupAnnotations[col.index];
                  const latestAnn = ann && ann.length > 1 ? ann[ann.length - 1] : null;
                  return (
                    <span key={col.id} className="w-5 text-center">
                      {latestAnn !== null ? (
                        <span className="text-amber-400 font-black animate-popIn">{latestAnn}</span>
                      ) : (
                        <span className="opacity-0">-</span>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Minuend row with strikethroughs */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-white">
                {[...currentProblem.columns].reverse().map((col) => {
                  const ann = regroupAnnotations[col.index];
                  const hasBeenCrossed = ann && ann.length > 1;
                  return (
                    <span
                      key={col.id}
                      className={`w-5 text-center transition-all ${
                        hasBeenCrossed ? 'line-through text-gray-500' : ''
                      } ${col.index === activeColIndex ? 'text-amber-300' : ''}`}
                    >
                      {col.mDigit}
                    </span>
                  );
                })}
              </div>

              {/* Subtrahend row */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-amber-300 border-b-2 border-white pb-0.5">
                <span className="text-emerald-400 font-bold -mr-2">−</span>
                {[...currentProblem.columns].reverse().map((col) => (
                  <span key={col.id} className="w-5 text-center">
                    {col.sDigit}
                  </span>
                ))}
              </div>

              {/* Difference row */}
              <div className="flex items-center gap-3 text-lg sm:text-xl font-black text-emerald-300 pt-0.5">
                {[...currentProblem.columns].reverse().map((col) => {
                  const digit = solvedColDigits[col.index];
                  return (
                    <span key={col.id} className="w-5 text-center font-mono">
                      {digit !== undefined ? (
                        <span className="animate-popIn text-emerald-300">{digit}</span>
                      ) : (
                        <span className="text-emerald-800">?</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pip Character Dynamic Guidance */}
          <PipCharacter
            mood={needsBorrow ? 'thinking' : 'guiding'}
            speechText={
              needsBorrow
                ? `In the ${activeCol.name} column, we need to take away ${activeSubtrahend} ${activeCol.pluralName}, but only have ${activeAvailable}! We must borrow from the next column!`
                : colSubStep === 'ready_subtract' || colSubStep === 'check_borrow'
                ? `We have ${activeAvailable} ${activeCol.pluralName} in the ${activeCol.name} column. Take away ${activeSubtrahend} into your basket!`
                : `How many ${activeCol.pluralName} remain in the ${activeCol.name} column? Type your answer below!`
            }
          />

          {/* Place-Value Columns Bucket Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...currentProblem.columns].reverse().map((col) => {
              const count = columnCounts[col.index];
              const isColActive = col.index === activeColIndex;
              const isColSolved = solvedColDigits[col.index] !== undefined;
              const canExchangeFromHere = needsBorrow && col.index === donorColIndex && count > 0;

              return (
                <div
                  key={col.id}
                  className={`p-3.5 rounded-3xl border-2 flex flex-col justify-between transition-all min-h-[190px] ${
                    isColActive
                      ? 'bg-[#031d16] border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/50'
                      : isColSolved
                      ? 'bg-[#042017]/80 border-emerald-500/50 opacity-90'
                      : 'bg-[#02140e]/60 border-emerald-900/60 opacity-60'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-emerald-800/40 pb-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{col.icon}</span>
                      <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                        {col.name} ({col.header})
                      </span>
                    </div>
                    {isColSolved ? (
                      <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    ) : isColActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase animate-pulse">
                        Active
                      </span>
                    ) : null}
                  </div>

                  {/* Visual Containers Display */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 py-2 flex-1">
                    {count === 0 ? (
                      <span className="text-xs text-emerald-500/40 italic font-semibold">
                        Empty (0 {col.pluralName})
                      </span>
                    ) : col.id === 'thousands' ? (
                      Array.from({ length: Math.min(count, 6) }).map((_, i) => (
                        <div key={i} className="animate-popIn">
                          <PoloCarton showContents={false} />
                        </div>
                      ))
                    ) : col.id === 'hundreds' ? (
                      Array.from({ length: Math.min(count, 6) }).map((_, i) => (
                        <div key={i} className="animate-popIn">
                          <PoloPacket showContents={false} />
                        </div>
                      ))
                    ) : col.id === 'tens' ? (
                      Array.from({ length: Math.min(count, 6) }).map((_, i) => (
                        <div key={i} className="animate-popIn">
                          <PoloRoll size="sm" showBadge={false} />
                        </div>
                      ))
                    ) : (
                      Array.from({ length: Math.min(count, 12) }).map((_, i) => (
                        <div key={i} className="animate-popIn">
                          <PoloCounter size="sm" numberLabel={i + 1} />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Summary & Borrow Trigger */}
                  <div className="pt-2 border-t border-emerald-800/40 flex flex-col gap-1.5 text-center">
                    <span className="text-xs font-bold text-white font-mono">
                      Available: <strong className="text-amber-300">{count}</strong> {col.pluralName}
                    </span>

                    {/* If this column can donate to resolve borrowing */}
                    {canExchangeFromHere && (
                      <button
                        onClick={() => handlePerformExchange(col.index)}
                        type="button"
                        className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-[11px] shadow-md transition-all transform hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Break 1 {col.unitName} → 10 {currentProblem.columns[col.index - 1]?.pluralName}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Column Subtraction & Direct Typing Controls */}
          <div className="bg-[#031d16] border-2 border-emerald-400/80 rounded-2xl p-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Step: {activeCol.name} Column Subtraction</span>
            </div>

            {/* Instruction Banner */}
            {needsBorrow ? (
              <div className="text-center p-3 rounded-2xl bg-amber-950/80 border border-amber-400 text-amber-200 text-xs sm:text-sm font-bold flex flex-col items-center gap-1">
                <span>⚠️ Not enough {activeCol.pluralName}! We need to take away {activeSubtrahend}, but only have {activeAvailable}.</span>
                {donorColIndex !== -1 ? (
                  <span className="text-emerald-300 font-black">
                    👉 Click &quot;Break 1 {currentProblem.columns[donorColIndex]?.unitName}&quot; in the {currentProblem.columns[donorColIndex]?.name} column above to exchange!
                  </span>
                ) : (
                  <span className="text-amber-300">Exchanging containers...</span>
                )}
              </div>
            ) : removedInCol < activeSubtrahend ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-emerald-200 text-center">
                  We have {activeAvailable} {activeCol.pluralName} and need to subtract {activeSubtrahend} {activeCol.pluralName}.
                </span>
                <button
                  onClick={handleRemoveInCol}
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-sm shadow transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Take Away {activeSubtrahend} {activeCol.pluralName}</span>
                  <Check className="w-4 h-4 text-black" />
                </button>
              </div>
            ) : (
              /* Typed Answer Entry for Column */
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider text-center">
                  Type the remaining digit for the {activeCol.name} column:
                </span>
                <PoloAnswerInput
                  key={`col_${currentProblem.key}_${activeColIndex}`}
                  targetValue={activeAvailable - activeSubtrahend}
                  prefix={`${activeAvailable} − ${activeSubtrahend} = `}
                  suffix={activeCol.pluralName}
                  placeholder="___"
                  helperTip={`In the ${activeCol.name} column, subtract ${activeSubtrahend} from ${activeAvailable}. How many ${activeCol.pluralName} remain?`}
                  showKeypad={true}
                  onSubmit={handleColAnswerSubmit}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Level Completed Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🏆
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Level Mastered!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              {currentProblem.title} Complete!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              Superb work! You solved all place-value borrowing steps and typed every single column result accurately!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-3">
            {onNextLevel && levelNumber < 9 ? (
              <button
                onClick={() => {
                  sounds.playPop();
                  onNextLevel();
                }}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Unlock Level {levelNumber + 1}</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playPop();
                  if (onReturnToStages) onReturnToStages();
                }}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Return to Stage Hub</span>
                <Sparkles className="w-5 h-5 text-black" />
              </button>
            )}

            <button
              onClick={() => {
                setSolvedInSession(0);
                setIsLevelFinished(false);
                loadNextProblem();
              }}
              type="button"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500/60 text-emerald-200 font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Practice More Problems</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
