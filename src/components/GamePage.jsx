import React, { useState, useEffect } from 'react';
import HauntedHouse from './HauntedHouse';
import TrickOrTreater from './TrickOrTreater';
import CandyBag from './CandyBag';
import DialogueBubble from './DialogueBubble';
import PlaceValueBoard from './PlaceValueBoard';
import ProgressBar from './ProgressBar';
import AnswerPanel from './AnswerPanel';
import GameSummary from './GameSummary';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * GamePage Component
 * Main orchestrator for the 5 mandatory game levels of Spooktacular Trick.
 * Implements:
 * - Two-column responsive desktop layout (60-65% visual learning area on left, 35-40% sticky MCQ on right)
 * - Mandatory sequential 5-level progression (Level 1 unlocked, 2-5 locked until preceding is complete)
 * - Dynamic place-value working and 2-stage animated candy borrowing for every level
 * - Step-by-step educational column subtraction for Ones, Tens, and Hundreds
 * - Level complete state with seamless progression
 * - Celebratory victory screen after Level 5
 */
export default function GamePage({ onOpenStory, onOpenPractice }) {
  // Level progression state
  const [currentLevelNumber, setCurrentLevelNumber] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [isVictory, setIsVictory] = useState(false);

  // Active level data
  const currentLevelIndex = currentLevelNumber - 1;
  const activeLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  // Step state within the active level
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeStep = activeLevel.steps[currentStepIndex] || activeLevel.steps[0];

  // Visual scene state
  const [houses, setHouses] = useState(activeStep.houses);
  const [boardState, setBoardState] = useState(activeStep.boardState);
  const [flyingBag, setFlyingBag] = useState(null);

  // Scoring and assistance
  const [score, setScore] = useState(100);
  const [stars, setStars] = useState(3);
  const [hintVisible, setHintVisible] = useState(false);

  // Question & MCQ interaction state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Column subtraction phase state (within subtraction step)
  const [subtractionStep, setSubtractionStep] = useState(0); // 0: Ones, 1: Tens, 2: Hundreds
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });
  const [collectedCandies, setCollectedCandies] = useState(0);

  // Level complete banner inside right-hand panel
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Sync state whenever level or step changes
  useEffect(() => {
    setHouses(activeStep.houses);
    setBoardState(activeStep.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setHintVisible(false);
    setFlyingBag(null);

    if (activeStep.isSubtractionPhase) {
      setSubtractionStep(0);
      setAnswers({ H: null, T: null, O: null });
      setCollectedCandies(0);
    }

    // Voice narration
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  }, [currentLevelNumber, currentStepIndex]);

  // Handle "Start Level / Start the Trick!" for steps with isStartStep
  const handleStartGame = () => {
    setCurrentStepIndex(1);
  };

  // Handle multiple-choice option selection
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id);

    if (opt.isCorrect) {
      setIsCorrect(true);
      setFeedback(opt.feedback);
      sounds.playSuccess();

      // Trigger animated candy bag borrowing transfer if specified
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
        }, 1800);
      }
    } else {
      setIsCorrect(false);
      setFeedback(opt.feedback);
      sounds.playIncorrect();
      setScore((s) => Math.max(20, s - 10));
      if (stars > 1 && score < 70) {
        setStars(2);
      }
    }
  };

  // Handle column subtraction answer
  const handleAnswerSubtraction = (chosenVal) => {
    const stepData = activeStep.subtractionSteps[subtractionStep];
    setSelectedOption(chosenVal);

    if (chosenVal === stepData.correct) {
      setIsCorrect(true);
      setFeedback(`Correct! ${stepData.explain}`);
      sounds.playSuccess();
      sounds.playBagDrop();

      const subtrahend = activeLevel.subtrahend;
      const onesSub = subtrahend % 10;

      if (subtractionStep === 0) {
        // Ones solved
        setAnswers((a) => ({ ...a, O: stepData.correct }));
        setCollectedCandies(onesSub);
        setHouses((prev) => ({
          ...prev,
          ones: { ...prev.ones, value: stepData.correct, candies: stepData.correct },
        }));
      } else if (subtractionStep === 1) {
        // Tens solved
        setAnswers((a) => ({ ...a, T: stepData.correct }));
        setCollectedCandies(subtrahend);
        setHouses((prev) => ({
          ...prev,
          tens: { ...prev.tens, value: stepData.correct, candies: stepData.correct * 10 },
        }));
      } else if (subtractionStep === 2) {
        // Hundreds solved
        setAnswers((a) => ({ ...a, H: stepData.correct }));
        setHouses((prev) => ({
          ...prev,
          hundreds: { ...prev.hundreds, value: stepData.correct, candies: stepData.correct * 100 },
        }));
      }
    } else {
      setIsCorrect(false);
      setFeedback(`Not quite! Think: what is ${stepData.expr}? Try again!`);
      sounds.playIncorrect();
      setScore((s) => Math.max(20, s - 5));
    }
  };

  // Continue button within a level
  const handleContinue = () => {
    // If in subtraction phase
    if (activeStep.isSubtractionPhase) {
      if (subtractionStep < activeStep.subtractionSteps.length - 1) {
        setSubtractionStep((s) => s + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setFeedback('');
      } else {
        // Completed all subtraction columns for this level!
        finishCurrentLevel();
      }
    } else {
      // Step through next step in level
      if (currentStepIndex < activeLevel.steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        finishCurrentLevel();
      }
    }
  };

  // Mark active level complete
  const finishCurrentLevel = () => {
    sounds.playVictory();
    setIsLevelComplete(true);

    if (!completedLevels.includes(currentLevelNumber)) {
      setCompletedLevels((prev) => [...prev, currentLevelNumber]);
    }

    // Unlock next level if available
    const nextLevelNum = currentLevelNumber + 1;
    if (nextLevelNum <= LEVELS.length && !unlockedLevels.includes(nextLevelNum)) {
      setUnlockedLevels((prev) => [...prev, nextLevelNum]);
    }
  };

  // Advance to next level (or victory screen if level 5)
  const handleNextLevel = () => {
    setIsLevelComplete(false);

    if (currentLevelNumber >= 5) {
      // Final victory!
      setIsVictory(true);
    } else {
      setCurrentLevelNumber((prev) => prev + 1);
      setCurrentStepIndex(0);
    }
  };

  // Switch level from progress bar
  const handleSelectLevel = (levelNum) => {
    if (unlockedLevels.includes(levelNum)) {
      setCurrentLevelNumber(levelNum);
      setCurrentStepIndex(0);
      setIsLevelComplete(false);
    }
  };

  // Replay current level
  const handleResetLevel = () => {
    sounds.playPop();
    setCurrentStepIndex(0);
    setIsLevelComplete(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setFlyingBag(null);
    setSubtractionStep(0);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    setHouses(activeLevel.steps[0].houses);
    setBoardState(activeLevel.steps[0].boardState);
  };

  // Restart whole game from beginning
  const handleRestartGame = () => {
    sounds.playPop();
    setCurrentLevelNumber(1);
    setCurrentStepIndex(0);
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    setIsVictory(false);
    setIsLevelComplete(false);
    setScore(100);
    setStars(3);
    setSubtractionStep(0);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
  };

  // Toggle Hint
  const handleShowHint = () => {
    sounds.playPop();
    setHintVisible((h) => !h);
  };

  // VICTORY SCREEN: Displayed after Level 5 completion
  if (isVictory) {
    return (
      <GameSummary
        score={score}
        stars={stars}
        completedLevels={completedLevels}
        onPlayAgain={handleRestartGame}
        onOpenStory={onOpenStory}
        onOpenPractice={onOpenPractice}
      />
    );
  }

  // Active house highlight checks
  const isHundredsActive =
    (activeLevel.level === 1 && (activeStep.stepId === 1 || activeStep.stepId === 3)) ||
    activeStep.bagAnimation?.from === 'hundreds' ||
    (activeStep.isSubtractionPhase && subtractionStep === 2);

  const isTensActive =
    (activeLevel.level === 1 && (activeStep.stepId === 2 || activeStep.stepId === 3 || activeStep.stepId === 4)) ||
    activeStep.bagAnimation?.from === 'tens' ||
    activeStep.bagAnimation?.to === 'tens' ||
    (activeStep.isSubtractionPhase && subtractionStep === 1);

  const isOnesActive =
    (activeLevel.level === 1 && (activeStep.stepId === 2 || activeStep.stepId === 4)) ||
    activeStep.bagAnimation?.to === 'ones' ||
    (activeStep.isSubtractionPhase && subtractionStep === 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 flex flex-col gap-3 sm:gap-4 relative">
      {/* 5-Level Visual Progression Header */}
      <ProgressBar
        currentLevel={currentLevelNumber}
        unlockedLevels={unlockedLevels}
        completedLevels={completedLevels}
        onSelectLevel={handleSelectLevel}
        currentStep={currentStepIndex + 1}
        totalSteps={activeLevel.steps.length}
        score={score}
        stars={stars}
        onResetLevel={handleResetLevel}
        onRestartGame={handleRestartGame}
        onShowHint={handleShowHint}
      />

      {/* Pop-up Hint Bar if requested */}
      {hintVisible && activeStep.hint && (
        <div className="w-full p-3 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span>{activeStep.hint}</span>
          </div>
          <button
            onClick={() => setHintVisible(false)}
            className="text-xs bg-amber-800/80 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg ml-2 shrink-0 cursor-pointer"
          >
            Got it!
          </button>
        </div>
      )}

      {/* RESPONSIVE TWO-COLUMN GRID:
          LEFT: Visual Learning Area (~60-65% width: lg:col-span-7 xl:col-span-8)
          RIGHT: MCQ / Question Area (~35-40% width: lg:col-span-5 xl:col-span-4, sticky on desktop)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* LEFT COLUMN: VISUAL LEARNING AREA */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
          {/* Spoken Dialogue Bubble */}
          <DialogueBubble
            speaker={activeStep.speaker}
            dialogue={activeStep.dialogue}
            speechText={activeStep.speechText}
            badge={activeLevel.title}
          />

          {/* Main Visual Stage: Living Haunted Houses & Borrowing Arena */}
          <div className="relative w-full bg-[#180a33]/85 border-3 border-purple-600/40 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Night Sky Atmospheric Elements */}
            <div className="absolute top-2 left-6 text-2xl sm:text-3xl select-none animate-pulse">🌕</div>
            <div className="absolute top-6 left-28 text-sm text-purple-300/40 select-none">✨</div>
            <div className="absolute top-4 right-20 text-sm text-purple-300/40 select-none">✨</div>
            <div className="absolute top-3 right-8 text-lg sm:text-xl select-none animate-bounce">🦇</div>

            {/* Flying Candy Bag Animation Layer */}
            {flyingBag && (
              <CandyBag
                type={flyingBag.type}
                from={flyingBag.from}
                to={flyingBag.to}
                label={flyingBag.label}
              />
            )}

            {/* Living Haunted Houses (Hundreds, Tens, Ones) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 justify-items-center items-end max-w-xl mx-auto my-2 z-10 relative">
              <HauntedHouse
                type="hundreds"
                value={houses.hundreds.display}
                candies={houses.hundreds.candies}
                mood={houses.hundreds.mood}
                label={houses.hundreds.label}
                isActive={isHundredsActive}
                isGiving={activeStep.bagAnimation?.from === 'hundreds' && isCorrect}
              />

              <HauntedHouse
                type="tens"
                value={houses.tens.display}
                candies={houses.tens.candies}
                mood={houses.tens.mood}
                label={houses.tens.label}
                isActive={isTensActive}
                isReceiving={activeStep.bagAnimation?.to === 'tens' && isCorrect}
                isGiving={activeStep.bagAnimation?.from === 'tens' && isCorrect}
              />

              <HauntedHouse
                type="ones"
                value={houses.ones.display}
                candies={houses.ones.candies}
                mood={houses.ones.mood}
                label={houses.ones.label}
                isActive={isOnesActive}
                isReceiving={activeStep.bagAnimation?.to === 'ones' && isCorrect}
              />
            </div>

            {/* Cobblestone Street Ground Divider */}
            <div className="w-full h-2.5 bg-gradient-to-r from-amber-700 via-purple-900 to-amber-700 rounded-full my-2.5 border-t border-amber-400/50 shadow" />

            {/* Bottom Learning Stage: Trick-or-Treaters & Formal Math Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center mt-1">
              {/* Trick-or-Treaters with Dynamic Needed Candies */}
              <TrickOrTreater
                collectedCandies={collectedCandies}
                targetCandies={activeLevel.subtrahend}
                isCollecting={subtractionStep > 0}
                isCelebrated={collectedCandies === activeLevel.subtrahend}
              />

              {/* Formal Vertical Subtraction Math Board */}
              <PlaceValueBoard
                boardState={boardState}
                minuend={activeLevel.minuend}
                subtrahend={activeLevel.subtrahend}
                diff={activeLevel.diff}
                highlightCol={
                  activeStep.isSubtractionPhase
                    ? subtractionStep === 0
                      ? 'O'
                      : subtractionStep === 1
                      ? 'T'
                      : 'H'
                    : boardState.highlightCol
                }
                showResult={
                  activeStep.isSubtractionPhase && subtractionStep === 2 && isCorrect
                }
                answers={answers}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MCQ / QUESTION PANEL */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 self-start flex flex-col gap-3">
          <AnswerPanel
            currentLevel={currentLevelNumber}
            totalLevels={LEVELS.length}
            levelTitle={activeLevel.title}
            levelIcon={activeLevel.icon}
            stepTitle={activeStep.title}
            question={activeStep.question}
            options={activeStep.options}
            onSelectOption={handleSelectOption}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            feedback={feedback}
            onContinue={handleContinue}
            onStartGame={handleStartGame}
            isStartStep={activeStep.isStartStep}
            isSubtractionPhase={activeStep.isSubtractionPhase}
            subtractionStep={subtractionStep}
            subtractionData={activeStep.subtractionSteps}
            onAnswerSubtraction={handleAnswerSubtraction}
            isLevelComplete={isLevelComplete}
            levelSummaryData={{
              minuend: activeLevel.minuend,
              subtrahend: activeLevel.subtrahend,
              diff: activeLevel.diff,
              summaryExplanation: `Awesome! You regrouped ${activeLevel.minuend} into ${Math.floor(activeLevel.minuend / 100) - 1} hundreds, 9 tens, and 10 ones, and subtracted ${activeLevel.subtrahend} to get ${activeLevel.diff}!`,
            }}
            onNextLevel={handleNextLevel}
            hint={activeStep.hint}
            onShowHint={handleShowHint}
          />
        </div>
      </div>
    </div>
  );
}
