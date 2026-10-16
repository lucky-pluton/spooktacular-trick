import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Printer, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestionForLevel } from '../../data/polotasticQuestions';
import { POLOTASTIC_LEVELS } from './polotasticStorage';
import { sounds } from '../../audio/soundEffects';

/**
 * PolotasticNotebook Component
 * 
 * Authentic School Maths Copybook Workspace:
 * - Squared graph paper background with vertical red margin
 * - Columns aligned: Thousands (Th), Hundreds (H), Tens (T), Ones (O)
 * - Regrouping annotations row above digits with strikethroughs and pencil marks
 * - Step-by-step intermediate regrouping for borrowing across zero (e.g. 500 − 36, 4,000 − 1,256)
 * - Direct digit typing below subtraction line (zero MCQs)
 * - Explicit worked solution toggle (answers hidden until requested or earned)
 * - Single authoritative level configuration (Levels 1-9 without duplication)
 * - Printable worksheet option
 */
export default function PolotasticNotebook({
  initialLevel = 4,
  unlockedLevels = [1, 2, 3, 4],
  onReturnToHub,
}) {
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [currentProblem, setCurrentProblem] = useState(() => generateQuestionForLevel(initialLevel));

  // Step-by-step simulation states
  // We step through the precomputed intermediateSteps:
  // stepIndex points to current step in currentProblem.intermediateSteps
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Column working digits: initialized from minuend digits
  const [workingDigits, setWorkingDigits] = useState(() => currentProblem.columns.map((c) => c.mDigit));

  // Regrouping history for visual annotations: { [colIndex]: [array of past values] }
  const [annotations, setAnnotations] = useState({});

  // Solved difference digits: { [colIndex]: digit }
  const [answers, setAnswers] = useState({});

  // Input value for active step
  const [typedInput, setTypedInput] = useState('');
  const [inputError, setInputError] = useState(null);
  const [isProblemComplete, setIsProblemComplete] = useState(false);
  const [problemsSolved, setProblemsSolved] = useState(0);

  // Explicit Worked Solution visibility state (hidden by default)
  const [showWorkedSolution, setShowWorkedSolution] = useState(false);

  // Printable worksheet modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  const usedKeys = useRef([]);

  const loadNewProblem = (level = selectedLevel) => {
    usedKeys.current.push(currentProblem.key);
    const nextQ = generateQuestionForLevel(level, usedKeys.current);
    setCurrentProblem(nextQ);
    setCurrentStepIdx(0);
    setWorkingDigits(nextQ.columns.map((c) => c.mDigit));
    setAnnotations({});
    setAnswers({});
    setTypedInput('');
    setInputError(null);
    setIsProblemComplete(false);
    setShowWorkedSolution(false);
    sounds.playPop();
  };

  const handleLevelChange = (lvl) => {
    setSelectedLevel(lvl);
    loadNewProblem(lvl);
  };

  const handlePreviousLevel = () => {
    if (selectedLevel > 1) {
      const prevLvl = selectedLevel - 1;
      if (unlockedLevels.includes(prevLvl)) {
        handleLevelChange(prevLvl);
      }
    }
  };

  const handleNextLevel = () => {
    if (selectedLevel < 9) {
      const nextLvl = selectedLevel + 1;
      if (unlockedLevels.includes(nextLvl)) {
        handleLevelChange(nextLvl);
      }
    }
  };

  const currentStep = currentProblem.intermediateSteps[currentStepIdx];

  // Submit typed input for current step
  const handleStepSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentStep || isProblemComplete) return;

    const trimmed = typedInput.trim();
    if (trimmed === '') {
      sounds.playIncorrect();
      setInputError('Please write your answer in the box first!');
      return;
    }

    if (currentStep.type === 'exchange') {
      // Step expects the child to calculate the new unbundled value in toCol
      const expectedValue = currentStep.afterDigits[currentStep.toCol];
      const parsedNum = Number(trimmed);

      if (parsedNum === expectedValue) {
        sounds.playSuccess();
        setInputError(null);
        setTypedInput('');

        // Apply exchange to working digits and annotations
        const nextDigits = [...workingDigits];
        const prevFrom = nextDigits[currentStep.fromCol];
        const prevTo = nextDigits[currentStep.toCol];
        nextDigits[currentStep.fromCol] -= 1;
        nextDigits[currentStep.toCol] += 10;
        setWorkingDigits(nextDigits);

        setAnnotations((prev) => ({
          ...prev,
          [currentStep.fromCol]: [...(prev[currentStep.fromCol] || [prevFrom]), nextDigits[currentStep.fromCol]],
          [currentStep.toCol]: [...(prev[currentStep.toCol] || [prevTo]), nextDigits[currentStep.toCol]],
        }));

        advanceStep(currentStepIdx + 1);
      } else {
        sounds.playIncorrect();
        setInputError(`Remember: 1 ${currentStep.fromUnit} exchanges for 10 ${currentStep.toUnit}s! Add 10 to the ${currentStep.beforeDigits[currentStep.toCol]} ${currentStep.toUnit}s in this column.`);
      }
    } else if (currentStep.type === 'subtract') {
      const expectedDiff = currentStep.remaining;
      const parsedNum = Number(trimmed);

      if (parsedNum === expectedDiff) {
        sounds.playSuccess();
        setInputError(null);
        setTypedInput('');

        // Record answered digit in difference row
        setAnswers((prev) => ({
          ...prev,
          [currentStep.col]: expectedDiff,
        }));

        advanceStep(currentStepIdx + 1);
      } else {
        sounds.playIncorrect();
        setInputError(`In the ${currentProblem.columns[currentStep.col]?.name || ''} column, subtract ${currentStep.subtracting} from ${currentStep.available}. Take your time and recount!`);
      }
    }
  };

  const advanceStep = (nextIdx) => {
    if (nextIdx < currentProblem.intermediateSteps.length) {
      setCurrentStepIdx(nextIdx);
    } else {
      // Completed all steps!
      sounds.playVictory();
      setIsProblemComplete(true);
      setProblemsSolved((p) => p + 1);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  // Helper for printable worksheet generation
  const worksheetProblems = Array.from({ length: 6 }).map((_, i) =>
    generateQuestionForLevel(selectedLevel, [`ws_${i}`])
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 flex flex-col gap-4 animate-fadeIn select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-2 bg-[#0d2822]/90 border border-emerald-500/50 rounded-2xl p-3 shadow-md flex-wrap">
        <button
          onClick={() => {
            sounds.playPop();
            if (onReturnToHub) onReturnToHub();
          }}
          type="button"
          className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Polotastic Hub</span>
        </button>

        {/* Level Navigation & Distinct Level Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={handlePreviousLevel}
            disabled={selectedLevel <= 1 || !unlockedLevels.includes(selectedLevel - 1)}
            type="button"
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            title="Go to preceding distinct level"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Previous Level</span>
          </button>

          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider hidden sm:inline">
              Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-200 text-xs font-bold cursor-pointer outline-none"
            >
              {POLOTASTIC_LEVELS.map((lvl) => {
                const isUnlocked = unlockedLevels.includes(lvl.levelNumber);
                return (
                  <option key={lvl.id} value={lvl.levelNumber} disabled={!isUnlocked}>
                    {lvl.title} {isUnlocked ? '' : '(Locked)'}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleNextLevel}
            disabled={selectedLevel >= 9 || !unlockedLevels.includes(selectedLevel + 1)}
            type="button"
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            title="Go to next distinct level"
          >
            <span className="hidden md:inline">Next Level</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons: Solution Reveal, Print Worksheet & New Question */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWorkedSolution((prev) => !prev)}
            type="button"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
              showWorkedSolution
                ? 'bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                : 'bg-emerald-900/60 hover:bg-emerald-800 border-emerald-500/40 text-emerald-200'
            }`}
            title="Reveal complete step-by-step worked solution"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{showWorkedSolution ? 'Hide Solution' : 'Worked Solution'}</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Generate printable school worksheet"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Print Worksheet</span>
          </button>

          <button
            onClick={() => loadNewProblem()}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Next Problem</span>
          </button>
        </div>
      </div>

      {/* THE SCHOOL MATHS NOTEBOOK (Squared graph copybook styling) */}
      <div className="relative w-full rounded-[36px] bg-[#fbfbf8] text-[#1c2420] shadow-[0_15px_50px_rgba(0,0,0,0.5)] border-4 border-[#3d5a4d] overflow-hidden p-6 sm:p-10 font-['Fredoka',sans-serif]">
        {/* Squared Grid Background Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,#94a3b8_0,#94a3b8_1px,transparent_1px,transparent_32px),repeating-linear-gradient(90deg,#94a3b8_0,#94a3b8_1px,transparent_1px,transparent_32px)]" />

        {/* Red Vertical Margin Line on the Left */}
        <div className="absolute inset-y-0 left-12 sm:left-20 w-0.5 bg-red-400/80 pointer-events-none" />

        {/* Notebook Header Info (Date, Subject, Title) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#1c2420]/20 pb-3 mb-6 pl-10 sm:pl-16">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-mono">
              Classwork • Mathematics Notebook
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a382c] tracking-tight">
              Vertical Subtraction with Place-Value Regrouping
            </h2>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-4 text-xs font-mono font-bold text-gray-600">
            <span>Date: Today</span>
            <span>Solved: {problemsSolved}</span>
          </div>
        </div>

        {/* Vertical Subtraction Working Copy Layout */}
        <div className="relative z-10 pl-10 sm:pl-16 flex flex-col items-center justify-center py-4">
          <div className="bg-white/90 border-2 border-dashed border-[#2a5544]/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center max-w-md w-full">
            
            {/* Table of Columns */}
            <div className="flex flex-col items-end font-mono">
              {/* Row 1: Column Headings (Thousands, Hundreds, Tens, Ones) */}
              <div className="flex items-center gap-5 sm:gap-7 border-b border-gray-300 pb-1 mb-1">
                {[...currentProblem.columns].reverse().map((col) => (
                  <div key={col.id} className="w-8 sm:w-10 text-center flex flex-col items-center">
                    <span className="text-xs font-black text-emerald-800 uppercase">{col.header}</span>
                    <span className="text-[10px] text-gray-500 font-sans">{col.unitName}</span>
                  </div>
                ))}
              </div>

              {/* Row 2: Regrouping Annotations (Crossed-out values & replacement pencil annotations) */}
              <div className="flex items-center gap-5 sm:gap-7 min-h-[30px] mb-1">
                {[...currentProblem.columns].reverse().map((col) => {
                  const ann = annotations[col.index];
                  const latestVal = ann && ann.length > 1 ? ann[ann.length - 1] : null;
                  return (
                    <div key={col.id} className="w-8 sm:w-10 text-center">
                      {latestVal !== null ? (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-400 font-bold text-sm sm:text-base animate-popIn">
                          {latestVal}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Minuend row with strikethroughs */}
              <div className="flex items-center gap-5 sm:gap-7 text-2xl sm:text-4xl font-black text-gray-900">
                {[...currentProblem.columns].reverse().map((col) => {
                  const ann = annotations[col.index];
                  const isCrossed = ann && ann.length > 1;
                  return (
                    <div
                      key={col.id}
                      className={`w-8 sm:w-10 text-center relative ${
                        isCrossed ? 'text-gray-400 line-through decoration-red-500 decoration-3' : ''
                      }`}
                    >
                      {col.mDigit}
                    </div>
                  );
                })}
              </div>

              {/* Row 4: Subtrahend row */}
              <div className="flex items-center gap-5 sm:gap-7 text-2xl sm:text-4xl font-black text-gray-900 border-b-4 border-gray-900 pb-1.5 w-full justify-end">
                <span className="text-xl sm:text-2xl text-emerald-700 font-bold -mr-3">−</span>
                {[...currentProblem.columns].reverse().map((col) => (
                  <div key={col.id} className="w-8 sm:w-10 text-center">
                    {col.sDigit}
                  </div>
                ))}
              </div>

              {/* Row 5: Difference Answer Row */}
              <div className="flex items-center gap-5 sm:gap-7 text-2xl sm:text-4xl font-black text-emerald-900 pt-2 border-b-2 border-double border-gray-400 pb-1 w-full justify-end">
                {[...currentProblem.columns].reverse().map((col) => {
                  const answeredDigit = answers[col.index];
                  const isColActive = currentStep && currentStep.type === 'subtract' && currentStep.col === col.index;
                  return (
                    <div
                      key={col.id}
                      className={`w-8 sm:w-10 text-center rounded-lg min-h-[44px] flex items-center justify-center ${
                        isColActive
                          ? 'ring-2 ring-blue-500 bg-blue-50/80 animate-pulse'
                          : ''
                      }`}
                    >
                      {answeredDigit !== undefined ? (
                        <span className="text-blue-900 font-black animate-popIn">{answeredDigit}</span>
                      ) : (
                        <span className="text-gray-300 font-light">.</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Prompt & Direct Answer Typing Box */}
            {!isProblemComplete && currentStep ? (
              <form onSubmit={handleStepSubmit} className="w-full mt-6 flex flex-col items-center gap-3 border-t border-gray-200 pt-4">
                <div className="text-center">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block mb-0.5">
                    Step {currentStepIdx + 1} of {currentProblem.intermediateSteps.length}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-800">
                    {currentStep.description}
                  </p>
                </div>

                {/* Direct Typing Input for the current step */}
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={typedInput}
                    onChange={(e) => {
                      setTypedInput(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder={currentStep.type === 'exchange' ? 'Regrouped value...' : 'Difference digit...'}
                    className="flex-1 py-2 px-3 rounded-xl border-2 border-emerald-700 text-center font-mono font-black text-xl text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm transition-all shadow cursor-pointer"
                  >
                    Enter
                  </button>
                </div>

                {/* Error / Hint feedback */}
                {inputError && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-400 text-amber-900 text-xs font-semibold text-center flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{inputError}</span>
                  </div>
                )}
              </form>
            ) : (
              /* Completed Problem Celebration inside Notebook */
              <div className="w-full mt-6 pt-4 border-t border-gray-200 text-center flex flex-col items-center gap-2 animate-popIn">
                <span className="text-2xl">🎉</span>
                <span className="text-lg font-black text-emerald-900">
                  {currentProblem.minuend.toLocaleString()} − {currentProblem.subtrahend.toLocaleString()} = {currentProblem.diff.toLocaleString()}
                </span>
                <p className="text-xs text-gray-600">
                  Calculation completed with verified regrouping working!
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                  <button
                    onClick={() => loadNewProblem()}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Another</span>
                  </button>
                  {selectedLevel < 9 && unlockedLevels.includes(selectedLevel + 1) && (
                    <button
                      onClick={handleNextLevel}
                      type="button"
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next Level ({selectedLevel + 1})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explicitly Requested Worked Solution Panel */}
        {showWorkedSolution && (
          <div className="relative z-10 pl-10 sm:pl-16 mt-4 max-w-xl mx-auto animate-fadeIn">
            <div className="p-4 rounded-2xl bg-amber-50/95 border-2 border-amber-400 text-amber-950 text-xs font-mono shadow-md">
              <div className="flex items-center justify-between font-black text-sm uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1.5 mb-2">
                <span>📖 Worked Solution (Step-by-Step)</span>
                <span className="text-[10px] text-amber-700 font-sans">Full Mathematical Working</span>
              </div>
              <p className="font-bold text-gray-800 mb-2">
                Problem: {currentProblem.minuend.toLocaleString()} − {currentProblem.subtrahend.toLocaleString()} = <strong className="text-emerald-800 text-sm">{currentProblem.diff.toLocaleString()}</strong>
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-gray-700">
                {currentProblem.intermediateSteps.map((st, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-amber-100/70 border border-amber-200">
                    <strong className="text-amber-900">Step {idx + 1}:</strong>{' '}
                    <span>{st.workedSolution || st.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2 border-t border-amber-300 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowWorkedSolution(false)}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-[11px] cursor-pointer shadow"
                >
                  Hide Solution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE WORKSHEET MODAL */}
      {showPrintModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-black text-emerald-900 font-mono">
                  Polotastic Printable Maths Worksheet
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  Level {selectedLevel}: {currentProblem.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  type="button"
                  className="px-3 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Problems Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4">
              {worksheetProblems.map((prob, i) => (
                <div key={i} className="p-4 border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-end font-mono">
                  <span className="text-[10px] font-bold text-gray-400 self-start mb-1">Problem #{i + 1}</span>
                  
                  {/* Space for kid regrouping annotations */}
                  <div className="h-6 w-full border-b border-gray-200 mb-1" />

                  {/* Minuend */}
                  <span className="text-xl font-black tracking-widest">{prob.minuend.toLocaleString()}</span>

                  {/* Subtrahend */}
                  <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-1 w-full justify-end">
                    <span className="text-sm font-bold">−</span>
                    <span className="text-xl font-black tracking-widest">{prob.subtrahend.toLocaleString()}</span>
                  </div>

                  {/* Answer blank space */}
                  <div className="h-9 w-full border-b border-gray-400 mt-1" />
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 text-center border-t pt-2">
              Spooktacular Trick • Polotastic Mathematics Learning Module • Place-Value Subtraction
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
