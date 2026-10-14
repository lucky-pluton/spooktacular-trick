import React, { useState, useCallback } from 'react';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';
import {
  Printer,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

/**
 * Fisher-Yates shuffle helper for 4 answer choices.
 * Assigns display letters A, B, C, D based on the randomized order.
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
 * NotebookMode Component
 * Dedicated Interactive Maths Notebook & Sandbox Workspace.
 * 
 * Distinct Identity:
 * - NO haunted houses (houses are exclusive to Game Mode!).
 * - Authentic classroom notebook workspace on ruled graph/grid paper.
 * - Clear vertical place-value subtraction columns (Hundreds, Tens, Ones).
 * - Step-by-step regrouping strike-throughs and replacement pencil annotations.
 * - Base-10 block physical exchange visualizer (Flats, Rods, Units).
 * - Interactive guided clue sticky-notes with 4 randomized answer stamps.
 * - Free exploration between all 5 problems with no locks or score pressure.
 * - Prominent "🖨️ Print Maths Worksheet" button generating clean A4 worksheets.
 */
export default function NotebookMode({ onOpenStory }) {
  // Problem selection (1 to 5)
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const activeLevel = LEVELS[selectedProblemIndex] || LEVELS[0];

  // Step state within the active problem
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeStep = activeLevel.steps[currentStepIndex] || activeLevel.steps[0];

  // Calculation board state for the current step
  const [boardState, setBoardState] = useState(activeStep.boardState);

  // Question interaction state & randomized options
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleOptions(activeLevel.steps[0]?.options || [])
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  // Subtraction answers written into the difference row for the current problem
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });

  // Reset & load a step
  const loadStep = useCallback((probIdx, stepIdx) => {
    const targetProb = LEVELS[probIdx] || LEVELS[0];
    const targetStep = targetProb.steps[stepIdx] || targetProb.steps[0];
    setSelectedProblemIndex(probIdx);
    setCurrentStepIndex(stepIdx);
    setBoardState(targetStep.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setHintVisible(false);

    if (targetStep.options && targetStep.options.length > 0) {
      setShuffledOptions(shuffleOptions(targetStep.options));
    }
  }, []);

  // Update when problem index changes
  const handleSelectProblem = (idx) => {
    sounds.playPop();
    setAnswers({ H: null, T: null, O: null });
    loadStep(idx, 0);
  };

  // Replay current step
  const handleReplayStep = () => {
    sounds.playPop();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    if (activeStep.options) {
      setShuffledOptions(shuffleOptions(activeStep.options));
    }
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  };

  // Restart active problem
  const handleRestartProblem = () => {
    sounds.playPop();
    setAnswers({ H: null, T: null, O: null });
    loadStep(selectedProblemIndex, 0);
  };

  // Step Forward / Backward
  const handleNextStep = () => {
    if (currentStepIndex < activeLevel.steps.length - 1) {
      sounds.playPop();
      loadStep(selectedProblemIndex, currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      sounds.playPop();
      loadStep(selectedProblemIndex, currentStepIndex - 1);
    }
  };

  // Option selection inside the notebook guide note
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id ?? opt.value ?? opt.text);

    if (opt.isCorrect) {
      setIsCorrect(true);
      sounds.playSuccess();
      setFeedback(opt.feedback || 'Wonderful thinking! Correct regrouping! ⭐');

      // Update written answer on the vertical board if this step completes a column
      if (activeStep.subtractionCol) {
        const col = activeStep.subtractionCol;
        const val = opt.value ?? parseInt(opt.text, 10);
        setAnswers((prev) => ({
          ...prev,
          [col]: val,
        }));
      }
    } else {
      setIsCorrect(false);
      sounds.playIncorrect();
      setFeedback(opt.feedback || 'Not quite! Review the place-value columns and try again!');

      // Re-shuffle so child can retry with fresh option positions
      if (activeStep.options) {
        setShuffledOptions(shuffleOptions(activeStep.options));
      }
    }
  };

  // Advance to next step after answering or clicking continue
  const handleContinueNextStep = () => {
    if (currentStepIndex < activeLevel.steps.length - 1) {
      sounds.playPop();
      loadStep(selectedProblemIndex, currentStepIndex + 1);
    }
  };

  // Trigger browser print for the A4 worksheet
  const handlePrintWorksheet = () => {
    sounds.playPop();
    window.print();
  };

  // Speak the question text aloud
  const handleSpeakQuestion = () => {
    sounds.speak(activeStep.question || activeStep.speechText || activeStep.dialogue);
  };

  // Determine active column highlight on vertical board
  const activeCol =
    activeStep.subtractionCol ||
    (activeStep.bagAnimation?.from === 'hundreds' && activeStep.bagAnimation?.to === 'tens'
      ? 'HT'
      : activeStep.bagAnimation?.from === 'tens' && activeStep.bagAnimation?.to === 'ones'
      ? 'TO'
      : activeStep.activeHouse === 'hundreds'
      ? 'H'
      : activeStep.activeHouse === 'tens'
      ? 'T'
      : 'O');

  // Decomposition values for minuend and subtrahend
  const minuendH = Math.floor(activeLevel.minuend / 100);
  const subtrahendT = Math.floor((activeLevel.subtrahend % 100) / 10);
  const subtrahendO = activeLevel.subtrahend % 10;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-1 sm:py-2 flex flex-col gap-3">
      {/* 1. TOP NOTEBOOK TOOLBAR: 5 Problem Tabs, Stepper, Print Worksheet */}
      <div className="w-full bg-[#160a2b]/95 border-2 border-teal-500/60 rounded-2xl p-2.5 sm:p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Problem Selector: 5 Ruled Workbook Tabs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-xl bg-teal-400 text-black flex items-center justify-center font-black text-base shadow">
              📓
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300">
                Maths Notebook
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                Interactive Workspace
              </span>
            </div>
          </div>

          {/* 5 Problem Selector Tabs (No locks, explore freely) */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {LEVELS.map((lvl, idx) => (
              <button
                key={lvl.level}
                onClick={() => handleSelectProblem(idx)}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  idx === selectedProblemIndex
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-black shadow-[0_0_12px_rgba(0,255,204,0.7)] scale-105'
                    : 'bg-teal-950/70 border border-teal-700/60 text-teal-200 hover:border-teal-400'
                }`}
                title={`Explore ${lvl.minuend} − ${lvl.subtrahend}`}
              >
                <span>{lvl.minuend} − {lvl.subtrahend}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Navigation & PRINT WORKSHEET BUTTON */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Step Stepper Navigation */}
          <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-xl border border-teal-500/40">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              type="button"
              className={`p-1 rounded-lg text-white transition-colors ${
                currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'
              }`}
              title="Previous step"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-teal-300 px-1 font-mono">
              Step {currentStepIndex + 1}/{activeLevel.steps.length}
            </span>
            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === activeLevel.steps.length - 1}
              type="button"
              className={`p-1 rounded-lg text-white transition-colors ${
                currentStepIndex === activeLevel.steps.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-white/20 cursor-pointer'
              }`}
              title="Next step"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Replay Current Step */}
          <button
            onClick={handleReplayStep}
            type="button"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Replay this step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* Restart Problem */}
          <button
            onClick={handleRestartProblem}
            type="button"
            className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-gray-900/70 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 text-xs font-bold transition-all cursor-pointer"
            title="Restart problem from Step 1"
          >
            Reset
          </button>

          {/* PROMINENT PRINT WORKSHEET BUTTON (NOTEBOOK EXCLUSIVE!) */}
          <button
            onClick={handlePrintWorksheet}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 text-black font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(255,180,0,0.6)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Print printable A4 classroom maths worksheet"
          >
            <Printer className="w-4 h-4" />
            <span>Print Worksheet</span>
          </button>

          {/* Story Comic Button */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-amber-300 border border-purple-600/50 text-xs font-bold transition-all cursor-pointer hidden lg:flex items-center gap-1"
              title="Read Story Comic"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comic</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. THE AUTHENTIC OPEN MATHS NOTEBOOK (GRID PAPER WORKSPACE) */}
      <div className="relative w-full bg-[#fdfbf7] text-[#1e293b] rounded-3xl border-4 border-[#2d1b4e] shadow-[0_15px_45px_rgba(0,0,0,0.5)] overflow-hidden p-4 sm:p-7 font-['Fredoka',sans-serif]">
        {/* Notebook Spiral Spine / Binder Rings on the Left Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-6 sm:w-8 bg-gradient-to-r from-[#e2d9cc] to-[#f4eee6] border-r border-[#d5cbbe] flex flex-col justify-around py-4 items-center z-10 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3e2723] shadow-inner border border-black/40 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-[#1b0a33]/60" />
            </div>
          ))}
        </div>

        {/* Red Notebook Margin Rule */}
        <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-0.5 bg-red-400/70 pointer-events-none" />

        {/* Graph Paper Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Notebook Content Layout: Vertical Subtraction Grid (Left) + Interactive Working Guide (Right) */}
        <div className="relative z-10 pl-10 sm:pl-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: THE CLASSROOM VERTICAL SUBTRACTION GRID (7 cols on large screens) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Notebook Page Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <span className="font-black text-sm sm:text-base text-purple-950 uppercase tracking-wide">
                  Classroom Subtraction with Regrouping
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-md">
                Problem: {activeLevel.minuend} − {activeLevel.subtrahend}
              </span>
            </div>

            {/* CLASSROOM PLACE-VALUE SUBTRACTION TABLE */}
            <div className="bg-white/90 border-2 border-slate-300 rounded-2xl p-4 sm:p-6 shadow-sm">
              <table className="w-full max-w-md mx-auto text-center font-mono select-none">
                {/* Column Place Value Labels */}
                <thead>
                  <tr className="text-xs sm:text-sm font-black text-slate-500 border-b border-slate-200">
                    <th className="w-12 py-1 text-slate-400 font-sans font-bold text-[11px]"></th>
                    <th
                      className={`py-1.5 px-3 rounded-t-lg transition-colors ${
                        activeCol === 'H' || activeCol === 'HT'
                          ? 'bg-purple-100 text-purple-900 font-extrabold ring-2 ring-purple-400'
                          : 'text-slate-600'
                      }`}
                    >
                      H (Hundreds)
                    </th>
                    <th
                      className={`py-1.5 px-3 rounded-t-lg transition-colors ${
                        activeCol === 'T' || activeCol === 'HT' || activeCol === 'TO'
                          ? 'bg-teal-100 text-teal-900 font-extrabold ring-2 ring-teal-400'
                          : 'text-slate-600'
                      }`}
                    >
                      T (Tens)
                    </th>
                    <th
                      className={`py-1.5 px-3 rounded-t-lg transition-colors ${
                        activeCol === 'O' || activeCol === 'TO'
                          ? 'bg-amber-100 text-amber-900 font-extrabold ring-2 ring-amber-400'
                          : 'text-slate-600'
                      }`}
                    >
                      O (Ones)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Row 1: Borrowing / Regrouping Pencil Annotations Row */}
                  <tr className="h-10 text-base sm:text-lg font-black text-blue-600">
                    <td className="text-[10px] font-sans font-bold text-slate-400 text-right pr-2">
                      Regroup:
                    </td>

                    {/* Hundreds Regrouping */}
                    <td className="relative px-2">
                      {boardState.crossedH && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-500 text-sm font-black shadow-sm animate-popIn">
                          {boardState.regroupH}
                        </span>
                      )}
                    </td>

                    {/* Tens Regrouping */}
                    <td className="relative px-2">
                      {boardState.crossedT && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-500 text-sm font-black shadow-sm animate-popIn">
                          {boardState.regroupT}
                        </span>
                      )}
                    </td>

                    {/* Ones Regrouping */}
                    <td className="relative px-2">
                      {boardState.regroupO && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-500 text-xs sm:text-sm font-black shadow-sm animate-popIn">
                          {boardState.regroupO}
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Row 2: Minuend Row (Original Top Number with strike-throughs) */}
                  <tr className="h-12 text-2xl sm:text-3xl font-black text-slate-900">
                    <td className="text-sm font-bold text-slate-400 text-right pr-2"></td>

                    {/* Hundreds Minuend */}
                    <td className="px-2">
                      {boardState.crossedH ? (
                        <span className="relative inline-block text-slate-400">
                          {minuendH}
                          <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-600 rotate-[-25deg]" />
                        </span>
                      ) : (
                        <span>{minuendH}</span>
                      )}
                    </td>

                    {/* Tens Minuend */}
                    <td className="px-2">
                      {boardState.crossedT ? (
                        <span className="relative inline-block text-slate-400">
                          0
                          <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-600 rotate-[-25deg]" />
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                    </td>

                    {/* Ones Minuend */}
                    <td className="px-2">
                      {boardState.regroupO ? (
                        <span className="relative inline-block text-slate-400">
                          0
                          <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-600 rotate-[-25deg]" />
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                  </tr>

                  {/* Row 3: Subtrahend Row (Bottom Number being subtracted) */}
                  <tr className="h-12 text-2xl sm:text-3xl font-black text-slate-800 border-b-4 border-slate-900">
                    <td className="text-xl font-black text-red-600 text-right pr-2">
                      −
                    </td>
                    <td className="px-2 text-slate-300 font-normal">0</td>
                    <td className="px-2">{subtrahendT}</td>
                    <td className="px-2">{subtrahendO}</td>
                  </tr>

                  {/* Row 4: Difference / Result Row */}
                  <tr className="h-14 text-2xl sm:text-3xl font-black text-emerald-700">
                    <td className="text-[10px] font-sans font-bold text-slate-400 text-right pr-2">
                      Result:
                    </td>

                    {/* Hundreds Result */}
                    <td className="px-2">
                      {answers.H !== null ? (
                        <span className="text-purple-700 animate-popIn font-black">
                          {answers.H}
                        </span>
                      ) : currentStepIndex >= 5 ? (
                        <span className="text-purple-700 font-black">
                          {Math.floor(activeLevel.diff / 100)}
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 inline-block" />
                      )}
                    </td>

                    {/* Tens Result */}
                    <td className="px-2">
                      {answers.T !== null ? (
                        <span className="text-teal-700 animate-popIn font-black">
                          {answers.T}
                        </span>
                      ) : currentStepIndex >= 4 ? (
                        <span className="text-teal-700 font-black">
                          {Math.floor((activeLevel.diff % 100) / 10)}
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 inline-block" />
                      )}
                    </td>

                    {/* Ones Result */}
                    <td className="px-2">
                      {answers.O !== null ? (
                        <span className="text-amber-700 animate-popIn font-black">
                          {answers.O}
                        </span>
                      ) : currentStepIndex >= 3 ? (
                        <span className="text-amber-700 font-black">
                          {activeLevel.diff % 10}
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 inline-block" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Solved Equation Banner when problem is completed */}
              {answers.H !== null && answers.T !== null && answers.O !== null && (
                <div className="mt-3 py-2 px-4 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-sm text-center shadow animate-popIn">
                  🎉 Problem Solved! {activeLevel.minuend} − {activeLevel.subtrahend} = {activeLevel.diff}
                </div>
              )}
            </div>

            {/* BASE-10 TACTILE REGROUPING VISUALIZER (Blocks on Desk) */}
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-black text-amber-950">
                <span className="flex items-center gap-1.5">
                  <span>🧱</span>
                  <span>Base-10 Regrouping Rule:</span>
                </span>
                <span className="font-mono text-[11px] text-amber-800 font-bold">
                  1 Hundred = 10 Tens • 1 Ten = 10 Ones
                </span>
              </div>

              {/* Three Place-Value Visual Trays */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Hundreds Tray */}
                <div className="bg-white/80 p-2 rounded-xl border border-purple-200 flex flex-col items-center">
                  <span className="font-black text-purple-900 text-[11px]">Hundreds (100s)</span>
                  <div className="flex flex-wrap gap-1 justify-center my-1">
                    {[...Array(boardState.crossedH ? minuendH - 1 : minuendH)].map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 bg-purple-500 rounded border border-purple-700 text-[8px] font-black text-white flex items-center justify-center shadow-xs"
                      >
                        100
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">
                    {boardState.crossedH ? minuendH - 1 : minuendH} Hundreds
                  </span>
                </div>

                {/* Tens Tray */}
                <div className="bg-white/80 p-2 rounded-xl border border-teal-200 flex flex-col items-center">
                  <span className="font-black text-teal-900 text-[11px]">Tens (10s)</span>
                  <div className="flex flex-wrap gap-1 justify-center my-1">
                    {[...Array(boardState.regroupT ? boardState.regroupT : boardState.crossedT ? 10 : 0)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-6 bg-teal-500 rounded-sm border border-teal-700 shadow-xs"
                        title="1 Ten"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">
                    {boardState.regroupT ? boardState.regroupT : boardState.crossedT ? 10 : 0} Tens
                  </span>
                </div>

                {/* Ones Tray */}
                <div className="bg-white/80 p-2 rounded-xl border border-amber-200 flex flex-col items-center">
                  <span className="font-black text-amber-900 text-[11px]">Ones (1s)</span>
                  <div className="flex flex-wrap gap-1 justify-center my-1 max-w-[80px]">
                    {[...Array(boardState.regroupO ? 10 : 0)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 bg-amber-400 rounded-xs border border-amber-600 shadow-xs"
                        title="1 Unit"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">
                    {boardState.regroupO ? 10 : 0} Ones
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE NOTEBOOK CLUE NOTE & MULTIPLE-CHOICE QUESTIONS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Sticky Working Note Card */}
            <div className="relative bg-[#fffde7] border-3 border-[#fbc02d] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col gap-3 transform rotate-[0.5deg]">
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-lg">
                📌
              </div>

              {/* Note Header */}
              <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <span>Step {currentStepIndex + 1}:</span>
                  <span>Working Clue</span>
                </span>
                <button
                  onClick={handleSpeakQuestion}
                  type="button"
                  className="p-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 text-xs transition-colors cursor-pointer"
                  title="Read question aloud"
                  aria-label="Read question aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step Question / Prompt */}
              <div className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                {activeStep.question}
              </div>

              {/* Dialogue / Explanation */}
              {activeStep.dialogue && (
                <div className="text-xs text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/80 font-medium leading-relaxed">
                  💡 {activeStep.dialogue}
                </div>
              )}

              {/* 4 RANDOMIZED ANSWER STAMPS (A, B, C, D) */}
              {shuffledOptions && shuffledOptions.length > 0 && (
                <div className="flex flex-col gap-2 my-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Choose the next step:
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {shuffledOptions.map((opt) => {
                      const isSelected = selectedOption === (opt.id ?? opt.value ?? opt.text);

                      let btnStyle = 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-300 shadow-xs';
                      if (isSelected) {
                        if (isCorrect === true) {
                          btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black shadow-md';
                        } else if (isCorrect === false) {
                          btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-950 font-black shadow-xs';
                        }
                      }

                      return (
                        <button
                          key={opt.id ?? opt.displayLetter}
                          onClick={() => handleSelectOption(opt)}
                          type="button"
                          className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-98 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-950 font-black text-xs flex items-center justify-center shrink-0 border border-amber-400">
                              {opt.displayLetter}
                            </span>
                            <span className="font-bold leading-tight">{opt.text}</span>
                          </div>

                          {isSelected && isCorrect === true && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isSelected && isCorrect === false && (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                      : 'bg-rose-100 text-rose-900 border border-rose-400'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              {/* Action: Next Step Button after Answering */}
              {isCorrect && currentStepIndex < activeLevel.steps.length - 1 && (
                <button
                  onClick={handleContinueNextStep}
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98 cursor-pointer mt-1"
                >
                  <span>Write Next Step in Notebook ✏️</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Hint Accordion */}
              {activeStep.hint && (
                <div className="border-t border-amber-200 pt-2 flex flex-col gap-1">
                  <button
                    onClick={() => setHintVisible((h) => !h)}
                    type="button"
                    className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>{hintVisible ? 'Hide Teacher Clue' : 'Need a Clue?'}</span>
                  </button>
                  {hintVisible && (
                    <p className="text-xs text-slate-700 bg-white/80 p-2 rounded-lg border border-amber-300 font-sans leading-relaxed">
                      💡 {activeStep.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
