import React, { useState, useEffect } from 'react';
import HauntedHouse from './HauntedHouse';
import TrickOrTreater from './TrickOrTreater';
import CandyBag from './CandyBag';
import PlaceValueBoard from './PlaceValueBoard';
import ProgressBar from './ProgressBar';
import LevelCompleteModal from './LevelCompleteModal';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * GamePage Component
 * Redesigned as an Interactive Subtraction Workspace & Maths Notebook:
 * 
 * 1. Questions INSIDE the Haunted Houses:
 *    Hundreds, Tens, and Ones houses are living characters and active workspaces.
 *    Questions appear directly inside the house whose place value is being operated on.
 * 2. Working Maths Notebook:
 *    Layout features three houses side-by-side above, with the persistent written subtraction
 *    board directly below, updating in place like classroom notebook paper.
 * 3. Step-by-Step Borrowing & Calculation:
 *    Shows crossed-out original digits with regrouped values written above.
 *    Result row updates column-by-column (_ _ 7 -> _ 4 7 -> 4 4 7).
 * 4. 5 Compulsory Sequential Levels:
 *    500−53=447, 400−65=335, 300−28=272, 600−84=516, 700−49=651.
 * 5. Points & Celebratory Level Completion Modals.
 */
export default function GamePage({ onOpenStory, onOpenPractice }) {
  // Level progression (5 compulsory sequential levels)
  const [currentLevelNumber, setCurrentLevelNumber] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [completedLevels, setCompletedLevels] = useState([]);

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
  const [askingNotice, setAskingNotice] = useState(null);

  // Scoring and Reward Points System
  const [totalScore, setTotalScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [stars, setStars] = useState(3);
  const [levelPointsEarned, setLevelPointsEarned] = useState(0);
  const [floatingReward, setFloatingReward] = useState(null);
  const [usedHintThisLevel, setUsedHintThisLevel] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // Tracking question attempts to prevent duplicate points
  const [questionAttempts, setQuestionAttempts] = useState({});
  const [awardedQuestionKeys, setAwardedQuestionKeys] = useState([]);

  // Subtraction answers placed on the board for the current level
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });
  const [collectedCandies, setCollectedCandies] = useState(0);

  // Active question interaction state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Celebratory Level Complete Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Smooth counting animation for display score
  useEffect(() => {
    if (displayScore === totalScore) return;
    const diff = totalScore - displayScore;
    const step = Math.ceil(Math.abs(diff) / 8);
    const timer = setTimeout(() => {
      setDisplayScore((prev) => {
        if (diff > 0) return Math.min(totalScore, prev + step);
        return Math.max(totalScore, prev - step);
      });
    }, 25);
    return () => clearTimeout(timer);
  }, [totalScore, displayScore]);

  // Helper to cleanly transition between steps and levels
  const goToStep = (levelNum, stepIdx) => {
    const targetLevel = LEVELS[levelNum - 1] || LEVELS[0];
    const targetStep = targetLevel.steps[stepIdx] || targetLevel.steps[0];
    setCurrentLevelNumber(levelNum);
    setCurrentStepIndex(stepIdx);
    setHouses(targetStep.houses);
    setBoardState(targetStep.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setHintVisible(false);
    setFlyingBag(null);
    setAskingNotice(null);
  };

  // Speak character speech whenever step changes
  useEffect(() => {
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  }, [activeStep.speechText, activeStep.stepId]);

  // Unique key for the current question
  const currentQuestionKey = `lvl${currentLevelNumber}_step${activeStep.stepId}`;

  // Handle multiple-choice selection inside the active house
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id ?? opt.value);
    const attempts = questionAttempts[currentQuestionKey] || 0;

    if (opt.isCorrect) {
      setIsCorrect(true);
      sounds.playSuccess();

      // Check if points were already awarded for this question to prevent duplicates
      const alreadyAwarded = awardedQuestionKeys.includes(currentQuestionKey);
      let awardedPts = 0;

      if (!alreadyAwarded) {
        awardedPts = attempts === 0 ? 100 : 50;
        setAwardedQuestionKeys((prev) => [...prev, currentQuestionKey]);
        setTotalScore((s) => s + awardedPts);
        setLevelPointsEarned((p) => p + awardedPts);

        // Trigger floating reward popup on the active house
        setFloatingReward({
          points: awardedPts,
          label: attempts === 0 ? 'First Try! 🍬' : 'Learned from Clues! ⭐',
        });
      }

      // Friendly feedback with points notification
      const pointsText = awardedPts > 0 ? ` +${awardedPts} points!` : '';
      setFeedback(opt.feedback ? `${opt.feedback}${pointsText}` : `Correct!${pointsText}`);

      // Handle asking animation between houses (e.g. Ones asks Tens, Tens asks Hundreds)
      if (activeStep.askingAnimation) {
        setAskingNotice(activeStep.askingAnimation.message);
      }

      // Handle animated candy bag transfer if defined for this step
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
        }, 1600);
      }

      // Update subtraction answers and trick-or-treater candy collection
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
      // Incorrect answer: NEVER deduct points! Encourage retry!
      setIsCorrect(false);
      sounds.playIncorrect();
      setQuestionAttempts((prev) => ({
        ...prev,
        [currentQuestionKey]: attempts + 1,
      }));
      setFeedback(opt.feedback || 'Not quite! Think about place values and try again!');
    }
  };

  // Continue to the next step or complete level
  const handleContinue = () => {
    if (currentStepIndex < activeLevel.steps.length - 1) {
      goToStep(currentLevelNumber, currentStepIndex + 1);
    } else {
      completeActiveLevel();
    }
  };

  // Finish current level and award level bonuses
  const completeActiveLevel = () => {
    sounds.playVictory();

    // Mark completed
    if (!completedLevels.includes(currentLevelNumber)) {
      setCompletedLevels((prev) => [...prev, currentLevelNumber]);
    }

    // Unlock next level
    const nextLvl = currentLevelNumber + 1;
    if (nextLvl <= LEVELS.length && !unlockedLevels.includes(nextLvl)) {
      setUnlockedLevels((prev) => [...prev, nextLvl]);
    }

    // Award level bonuses once
    const levelBonusKey = `level_bonus_${currentLevelNumber}`;
    if (!awardedQuestionKeys.includes(levelBonusKey)) {
      let bonusTotal = 200; // Level completion bonus
      if (!usedHintThisLevel) {
        bonusTotal += 50; // No-hint bonus
      }
      if (currentLevelNumber === 5) {
        bonusTotal += 500; // Grand Wizard 5-level bonus
      }

      setAwardedQuestionKeys((prev) => [...prev, levelBonusKey]);
      setTotalScore((s) => s + bonusTotal);
      setLevelPointsEarned((p) => p + bonusTotal);
    }

    // Show level completion celebratory modal
    setIsModalOpen(true);
  };

  // Advance to next level from the modal
  const handleModalContinue = () => {
    setIsModalOpen(false);
    if (currentLevelNumber < 5) {
      setUsedHintThisLevel(false);
      setLevelPointsEarned(0);
      setAnswers({ H: null, T: null, O: null });
      setCollectedCandies(0);
      goToStep(currentLevelNumber + 1, 0);
    }
  };

  // Review current level from the modal
  const handleModalReview = () => {
    setIsModalOpen(false);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    goToStep(currentLevelNumber, 0);
  };

  // Replay current step
  const handleReplayStep = () => {
    sounds.playPop();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setFlyingBag(null);
    setAskingNotice(null);
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  };

  // Switch level from progress bar (only unlocked levels)
  const handleSelectLevel = (lvlNum) => {
    if (unlockedLevels.includes(lvlNum) && lvlNum !== currentLevelNumber) {
      sounds.playPop();
      setIsModalOpen(false);
      setUsedHintThisLevel(false);
      setLevelPointsEarned(0);
      setAnswers({ H: null, T: null, O: null });
      setCollectedCandies(0);
      goToStep(lvlNum, 0);
    }
  };

  // Reset current level
  const handleResetLevel = () => {
    sounds.playPop();
    setIsModalOpen(false);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    goToStep(currentLevelNumber, 0);
  };

  // Restart entire game from Level 1
  const handleRestartGame = () => {
    sounds.playPop();
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    setIsModalOpen(false);
    setTotalScore(0);
    setDisplayScore(0);
    setStars(3);
    setLevelPointsEarned(0);
    setUsedHintThisLevel(false);
    setQuestionAttempts({});
    setAwardedQuestionKeys([]);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    goToStep(1, 0);
  };

  // Toggle Hint
  const handleShowHint = () => {
    sounds.playPop();
    setHintVisible((h) => !h);
    setUsedHintThisLevel(true);
  };

  // Determine active house
  const activeHouse = activeStep.activeHouse || 'ones';
  const isHundredsActive = activeHouse === 'hundreds';
  const isTensActive = activeHouse === 'tens';
  const isOnesActive = activeHouse === 'ones';

  // Highlight column on the subtraction board to visually connect with the active house
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
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 flex flex-col gap-3 relative">
      {/* 5-Level Visual Progression Header with Animated Score */}
      <ProgressBar
        currentLevel={currentLevelNumber}
        unlockedLevels={unlockedLevels}
        completedLevels={completedLevels}
        onSelectLevel={handleSelectLevel}
        currentStep={currentStepIndex + 1}
        totalSteps={activeLevel.steps.length}
        score={displayScore}
        stars={stars}
        onResetLevel={handleResetLevel}
        onRestartGame={handleRestartGame}
        onShowHint={handleShowHint}
      />

      {/* Pop-up Hint Bar if requested */}
      {hintVisible && activeStep.hint && (
        <div className="w-full max-w-2xl mx-auto p-3 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
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

      {/* MAIN PLAY SCREEN: Interactive Haunted Houses Workspace */}
      <div className="relative w-full bg-[#16092e]/90 border-3 border-purple-600/50 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Atmospheric Sky Elements */}
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

        {/* THREE LIVING HAUNTED HOUSES: THE INTERACTIVE WORKSPACE
            Questions appear directly inside the house box whose place value is active.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-start justify-items-center max-w-5xl mx-auto my-2 z-10 relative">
          {/* Hundreds House */}
          <HauntedHouse
            type="hundreds"
            value={houses.hundreds.value ?? houses.hundreds.display}
            candies={houses.hundreds.candies}
            mood={houses.hundreds.mood}
            label={houses.hundreds.label}
            isActive={isHundredsActive}
            isGiving={activeStep.bagAnimation?.from === 'hundreds' && isCorrect}
            isReceiving={activeStep.bagAnimation?.to === 'hundreds' && isCorrect}
            dialogue={isHundredsActive ? activeStep.dialogue : (activeStep.inactiveThoughts?.hundreds || "Hundreds House keeps 500 candies safe in vault.")}
            speechText={isHundredsActive ? activeStep.speechText : activeStep.inactiveThoughts?.hundreds}
            inactiveThought={activeStep.inactiveThoughts?.hundreds}
            askingNotice={askingNotice && activeStep.askingAnimation?.to === 'hundreds' ? askingNotice : null}
            // In-house Question props
            question={isHundredsActive ? activeStep.question : ''}
            options={isHundredsActive ? activeStep.options : []}
            selectedOption={isHundredsActive ? selectedOption : null}
            isCorrect={isHundredsActive ? isCorrect : null}
            feedback={isHundredsActive ? feedback : ''}
            onSelectOption={isHundredsActive ? handleSelectOption : undefined}
            onContinue={isHundredsActive ? handleContinue : undefined}
            hint={isHundredsActive ? activeStep.hint : ''}
            onShowHint={isHundredsActive ? handleShowHint : undefined}
            floatingReward={isHundredsActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
          />

          {/* Tens House */}
          <HauntedHouse
            type="tens"
            value={houses.tens.value ?? houses.tens.display}
            candies={houses.tens.candies}
            mood={houses.tens.mood}
            label={houses.tens.label}
            isActive={isTensActive}
            isGiving={activeStep.bagAnimation?.from === 'tens' && isCorrect}
            isReceiving={activeStep.bagAnimation?.to === 'tens' && isCorrect}
            dialogue={isTensActive ? activeStep.dialogue : (activeStep.inactiveThoughts?.tens || "Tens House connects Hundreds and Ones.")}
            speechText={isTensActive ? activeStep.speechText : activeStep.inactiveThoughts?.tens}
            inactiveThought={activeStep.inactiveThoughts?.tens}
            askingNotice={askingNotice && activeStep.askingAnimation?.to === 'tens' ? askingNotice : null}
            // In-house Question props
            question={isTensActive ? activeStep.question : ''}
            options={isTensActive ? activeStep.options : []}
            selectedOption={isTensActive ? selectedOption : null}
            isCorrect={isTensActive ? isCorrect : null}
            feedback={isTensActive ? feedback : ''}
            onSelectOption={isTensActive ? handleSelectOption : undefined}
            onContinue={isTensActive ? handleContinue : undefined}
            hint={isTensActive ? activeStep.hint : ''}
            onShowHint={isTensActive ? handleShowHint : undefined}
            floatingReward={isTensActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
          />

          {/* Ones House */}
          <HauntedHouse
            type="ones"
            value={houses.ones.value ?? houses.ones.display}
            candies={houses.ones.candies}
            mood={houses.ones.mood}
            label={houses.ones.label}
            isActive={isOnesActive}
            isGiving={activeStep.bagAnimation?.from === 'ones' && isCorrect}
            isReceiving={activeStep.bagAnimation?.to === 'ones' && isCorrect}
            dialogue={isOnesActive ? activeStep.dialogue : (activeStep.inactiveThoughts?.ones || "Ones House gives single candies to trick-or-treaters.")}
            speechText={isOnesActive ? activeStep.speechText : activeStep.inactiveThoughts?.ones}
            inactiveThought={activeStep.inactiveThoughts?.ones}
            askingNotice={askingNotice && activeStep.askingAnimation?.to === 'ones' ? askingNotice : null}
            // In-house Question props
            question={isOnesActive ? activeStep.question : ''}
            options={isOnesActive ? activeStep.options : []}
            selectedOption={isOnesActive ? selectedOption : null}
            isCorrect={isOnesActive ? isCorrect : null}
            feedback={isOnesActive ? feedback : ''}
            onSelectOption={isOnesActive ? handleSelectOption : undefined}
            onContinue={isOnesActive ? handleContinue : undefined}
            hint={isOnesActive ? activeStep.hint : ''}
            onShowHint={isOnesActive ? handleShowHint : undefined}
            floatingReward={isOnesActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
          />
        </div>

        {/* Cobblestone Street Ground Divider */}
        <div className="w-full h-2.5 bg-gradient-to-r from-amber-700 via-purple-900 to-amber-700 rounded-full my-3 border-t border-amber-400/50 shadow" />

        {/* WRITTEN SUBTRACTION BOARD & TRICK-OR-TREATERS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center mt-2">
          {/* Trick-or-Treaters with Candy Goal */}
          <TrickOrTreater
            collectedCandies={collectedCandies}
            targetCandies={activeLevel.subtrahend}
            isCollecting={activeStep.subtractionCol !== undefined}
            isCelebrated={collectedCandies === activeLevel.subtrahend}
          />

          {/* Place-Value Vertical Math Board */}
          <PlaceValueBoard
            boardState={boardState}
            minuend={activeLevel.minuend}
            subtrahend={activeLevel.subtrahend}
            diff={activeLevel.diff}
            highlightCol={boardHighlightCol}
            showResult={activeStep.subtractionCol === 'H' && isCorrect}
            answers={answers}
            onShowHint={handleShowHint}
            onReplayStep={handleReplayStep}
            onRestartLevel={handleResetLevel}
          />
        </div>
      </div>

      {/* Celebratory Level Completion & Grand Wizard Modal */}
      <LevelCompleteModal
        isOpen={isModalOpen}
        levelNumber={currentLevelNumber}
        totalLevels={LEVELS.length}
        minuend={activeLevel.minuend}
        subtrahend={activeLevel.subtrahend}
        diff={activeLevel.diff}
        levelPoints={levelPointsEarned}
        totalScore={totalScore}
        stars={stars}
        noHintBonus={!usedHintThisLevel}
        onContinue={handleModalContinue}
        onReview={handleModalReview}
        onPlayAgain={handleRestartGame}
        onOpenStory={onOpenStory}
        onOpenPractice={onOpenPractice}
        completedLevels={completedLevels}
      />
    </div>
  );
}
