import React, { useState, useCallback } from 'react';
import ConnectedNeighbourhood from './ConnectedNeighbourhood';
import PlaceValueBoard from './PlaceValueBoard';
import TrickOrTreater from './TrickOrTreater';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';
import { Printer, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

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
 * Interactive maths notebook sandbox.
 * 
 * Features:
 * 1. Freely select any of the 5 problems (no locks, no timer/points pressure).
 * 2. Connected neighbourhood with friendly houses and automatic thought cloud questions.
 * 3. Visible classroom vertical subtraction board with strike-through regrouping.
 * 4. Step through calculation at child's own pace (Previous, Next, Replay).
 * 5. Prominent "🖨️ Print Maths Worksheet" button!
 */
export default function NotebookMode({ onOpenStory }) {
  // Problem selection (1 to 5)
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const activeLevel = LEVELS[selectedProblemIndex] || LEVELS[0];

  // Step state within the active problem
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeStep = activeLevel.steps[currentStepIndex] || activeLevel.steps[0];

  // Visual scene state
  const [houses, setHouses] = useState(activeStep.houses);
  const [boardState, setBoardState] = useState(activeStep.boardState);
  const [flyingBag, setFlyingBag] = useState(null);
  const [askingNotice, setAskingNotice] = useState(null);

  // Question interaction state & randomized options
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleOptions(activeLevel.steps[0]?.options || [])
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);

  // Subtraction answers placed on the board for the current problem
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });
  const [collectedCandies, setCollectedCandies] = useState(0);

  // Reset & load a step
  const loadStep = useCallback((probIdx, stepIdx) => {
    const targetProb = LEVELS[probIdx] || LEVELS[0];
    const targetStep = targetProb.steps[stepIdx] || targetProb.steps[0];
    setSelectedProblemIndex(probIdx);
    setCurrentStepIndex(stepIdx);
    setHouses(targetStep.houses);
    setBoardState(targetStep.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setHintVisible(false);
    setFlyingBag(null);
    setAskingNotice(null);

    if (targetStep.options && targetStep.options.length > 0) {
      setShuffledOptions(shuffleOptions(targetStep.options));
      setIsQuestionVisible(true);
    }
  }, []);

  // Update when problem index changes
  const handleSelectProblem = (idx) => {
    sounds.playPop();
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    loadStep(idx, 0);
  };

  // Replay current step
  const handleReplayStep = () => {
    sounds.playPop();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setFlyingBag(null);
    setAskingNotice(null);
    if (activeStep.options) {
      setShuffledOptions(shuffleOptions(activeStep.options));
    }
    setIsQuestionVisible(true);
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  };

  // Restart active problem
  const handleRestartProblem = () => {
    sounds.playPop();
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
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

  // Option selection
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id ?? opt.value ?? opt.text);

    if (opt.isCorrect) {
      setIsCorrect(true);
      sounds.playSuccess();
      setFeedback(opt.feedback || 'Wonderful thinking! Correct regrouping! ⭐');

      // Update subtraction answers and candy collection
      if (activeStep.subtractionCol) {
        const col = activeStep.subtractionCol;
        const val = opt.value ?? parseInt(opt.text, 10);
        setAnswers((prev) => ({
          ...prev,
          [col]: val,
        }));

        if (col === 'O') {
          setCollectedCandies(activeLevel.subtrahend % 10);
        } else if (col === 'T') {
          setCollectedCandies(activeLevel.subtrahend);
        }
      }
    } else {
      setIsCorrect(false);
      sounds.playIncorrect();
      setFeedback(opt.feedback || 'Not quite! Think about place values and try again!');

      // Re-shuffle so child can retry with fresh options
      if (activeStep.options) {
        setShuffledOptions(shuffleOptions(activeStep.options));
      }
    }
  };

  // Continue after correct answer: triggers neighbourhood animation
  const handleContinue = () => {
    setIsQuestionVisible(false);

    if (activeStep.askingAnimation) {
      setAskingNotice(activeStep.askingAnimation.message);
    }

    if (activeStep.bagAnimation) {
      const bag = activeStep.bagAnimation;
      setFlyingBag({
        type: bag.type,
        from: bag.from,
        to: bag.to,
        label: bag.label,
      });
      sounds.playCandyBorrow();

      setTimeout(() => {
        sounds.playBagDrop();
        setFlyingBag(null);
        if (activeStep.housesAfter) {
          setHouses(activeStep.housesAfter);
        }
        if (activeStep.boardState) {
          setBoardState((prev) => ({
            ...prev,
            ...activeStep.boardState,
          }));
        }

        setTimeout(() => {
          if (currentStepIndex < activeLevel.steps.length - 1) {
            loadStep(selectedProblemIndex, currentStepIndex + 1);
          }
        }, 1200);
      }, 1600);
    } else {
      setTimeout(() => {
        if (currentStepIndex < activeLevel.steps.length - 1) {
          loadStep(selectedProblemIndex, currentStepIndex + 1);
        }
      }, 1200);
    }
  };

  const handlePrintWorksheet = () => {
    sounds.playPop();
    window.print();
  };

  const activeHouse = activeStep.activeHouse || 'ones';
  const boardHighlightCol =
    activeStep.subtractionCol ||
    (activeStep.bagAnimation?.from === 'hundreds' && activeStep.bagAnimation?.to === 'tens'
      ? 'HT'
      : activeStep.bagAnimation?.from === 'tens' && activeStep.bagAnimation?.to === 'ones'
      ? 'TO'
      : activeHouse === 'hundreds'
      ? 'H'
      : activeHouse === 'tens'
      ? 'T'
      : 'O');

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-1 flex flex-col gap-2 relative">
      {/* Top Controls: Mode Banner, Problem Picker & Worksheet Print Button */}
      <div className="bg-[#140827]/95 border-2 border-teal-500/60 rounded-3xl p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Notebook Mode Tag & Problem Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300">
                Notebook Mode
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                Maths Sandbox
              </span>
            </div>
          </div>

          {/* 5 Problem Selector Pills */}
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

        {/* Right: Step Stepper, Replay & PRINT WORKSHEET BUTTON */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Step Stepper Navigation */}
          <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              type="button"
              className={`p-1 rounded-lg text-white transition-colors ${
                currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'
              }`}
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-teal-300 px-1">
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
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Replay Step */}
          <button
            onClick={handleReplayStep}
            type="button"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-600/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Replay this step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* PROMINENT PRINT WORKSHEET BUTTON (NOTEBOOK MODE ONLY!) */}
          <button
            onClick={handlePrintWorksheet}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 text-black font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(255,180,0,0.6)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Print printable A4 maths worksheet"
          >
            <Printer className="w-4 h-4" />
            <span>Print Worksheet</span>
          </button>

          {/* Optional Story Comic */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="p-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-amber-300 border border-purple-600/50 text-xs font-bold transition-all cursor-pointer hidden lg:flex items-center"
              title="Read Story Comic"
            >
              <span>📖 Story</span>
            </button>
          )}
        </div>
      </div>

      {/* CONNECTED NEIGHBOURHOOD WITH AUTOMATIC THOUGHT CLOUD */}
      <ConnectedNeighbourhood
        houses={houses}
        activeHouse={activeHouse}
        isQuestionVisible={isQuestionVisible}
        question={activeStep.question}
        speechText={activeStep.speechText}
        dialogue={activeStep.dialogue}
        options={shuffledOptions}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        feedback={feedback}
        onSelectOption={handleSelectOption}
        onContinue={handleContinue}
        hint={activeStep.hint}
        onShowHint={() => setHintVisible((h) => !h)}
        hintVisible={hintVisible}
        stepNumber={currentStepIndex + 1}
        totalSteps={activeLevel.steps.length}
        flyingBag={flyingBag}
        askingNotice={askingNotice}
        isIdleMode={false}
      />

      {/* PERSISTENT WRITTEN SUBTRACTION BOARD & TRICK-OR-TREATERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center my-1">
        <TrickOrTreater
          collectedCandies={collectedCandies}
          targetCandies={activeLevel.subtrahend}
          isCollecting={activeStep.subtractionCol !== undefined}
          isCelebrated={collectedCandies === activeLevel.subtrahend}
        />

        <PlaceValueBoard
          boardState={boardState}
          minuend={activeLevel.minuend}
          subtrahend={activeLevel.subtrahend}
          diff={activeLevel.diff}
          highlightCol={boardHighlightCol}
          showResult={activeStep.subtractionCol === 'H' && isCorrect}
          answers={answers}
          onShowHint={() => setHintVisible((h) => !h)}
          onReplayStep={handleReplayStep}
          onRestartLevel={handleRestartProblem}
        />
      </div>
    </div>
  );
}
