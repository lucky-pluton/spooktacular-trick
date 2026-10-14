import React, { useState, useEffect, useCallback } from 'react';
import HauntedHouse from './HauntedHouse';
import QuestionModal from './QuestionModal';
import TrickOrTreater from './TrickOrTreater';
import CandyBag from './CandyBag';
import PlaceValueBoard from './PlaceValueBoard';
import ProgressBar from './ProgressBar';
import LevelCompleteModal from './LevelCompleteModal';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * Fisher-Yates shuffle helper for 4 answer choices.
 * Assigns display letters A, B, C, D based on the randomized order.
 * Ensures the correct answer does not always appear at letter A.
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
 * GamePage Component
 * Full-Screen Haunted Houses Scene + Centered Question Popup Modal:
 * 
 * 1. Full-Screen Haunted Houses:
 *    Occupies almost the entire viewport with 3 large, living haunted houses (Hundreds, Tens, Ones).
 *    Clean Halloween atmosphere, dark background, subtle spooky details.
 *    No permanently visible question panels crowding the houses.
 * 2. Centered Question Popup Modal:
 *    Multiple-choice question appears in a centered popup overlay that dims the scene behind it.
 *    Houses remain clearly visible behind the modal.
 *    4 large, tap-friendly answer choices labelled A, B, C, D (randomized).
 * 3. Connected Actions & Animations:
 *    After answering correctly, the popup closes to showcase the borrowing animation in the houses.
 *    Flying candy bags, living facial expressions, and persistent written subtraction board update in sync.
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

  // Active question interaction state & randomized options
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleOptions(LEVELS[0]?.steps?.[0]?.options || [])
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Modals state: Question Modal (centered popup) & Level Complete Modal
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(true);
  const [isLevelCompleteModalOpen, setIsLevelCompleteModalOpen] = useState(false);

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

  // Unique key for the current question
  const currentQuestionKey = `lvl${currentLevelNumber}_step${activeStep.stepId}`;

  // Helper to cleanly transition between steps and levels
  const goToStep = useCallback((levelNum, stepIdx) => {
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

    // Shuffle options so correct answer is randomly distributed across A, B, C, D
    if (targetStep.options && targetStep.options.length > 0) {
      setShuffledOptions(shuffleOptions(targetStep.options));
      setIsQuestionModalOpen(true);
    }
  }, []);

  // Speak character speech whenever question changes
  useEffect(() => {
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  }, [currentQuestionKey, activeStep.speechText]);

  // Handle option selection inside the centered QuestionModal
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id ?? opt.value ?? opt.text);
    const attempts = questionAttempts[currentQuestionKey] || 0;

    // Validate against stable identifier / isCorrect, NEVER array index or displayed letter
    if (opt.isCorrect) {
      setIsCorrect(true);
      sounds.playSuccess();

      // Check if points were already awarded for this question to prevent duplicate awards
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

      // Re-shuffle options on retry so answer positions shift dynamically
      if (activeStep.options) {
        setShuffledOptions(shuffleOptions(activeStep.options));
      }
    }
  };

  // Continue after correct answer: Close modal and trigger house/board animations
  const handleModalContinue = () => {
    // 1. Close the popup modal so player can see the action in the houses!
    setIsQuestionModalOpen(false);

    // 2. Handle asking animation between houses
    if (activeStep.askingAnimation) {
      setAskingNotice(activeStep.askingAnimation.message);
    }

    // 3. Handle animated candy bag transfer if defined for this step
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

        // After bag drop and visual changes settle, advance to next step or complete level
        setTimeout(() => {
          advanceStep();
        }, 1200);
      }, 1600);
    } else {
      // No bag animation: give player a brief moment to see updated digits/results, then advance
      setTimeout(() => {
        advanceStep();
      }, 1300);
    }
  };

  // Helper to advance to next step or finish level
  const advanceStep = () => {
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
    setIsLevelCompleteModalOpen(true);
  };

  // Advance to next level from the completion modal
  const handleLevelCompleteModalContinue = () => {
    setIsLevelCompleteModalOpen(false);
    if (currentLevelNumber < 5) {
      setUsedHintThisLevel(false);
      setLevelPointsEarned(0);
      setAnswers({ H: null, T: null, O: null });
      setCollectedCandies(0);
      goToStep(currentLevelNumber + 1, 0);
    }
  };

  // Review current level from the completion modal
  const handleLevelCompleteModalReview = () => {
    setIsLevelCompleteModalOpen(false);
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
    if (activeStep.options) {
      setShuffledOptions(shuffleOptions(activeStep.options));
    }
    setIsQuestionModalOpen(true);
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  };

  // Switch level from progress bar (only unlocked levels)
  const handleSelectLevel = (lvlNum) => {
    if (unlockedLevels.includes(lvlNum) && lvlNum !== currentLevelNumber) {
      sounds.playPop();
      setIsLevelCompleteModalOpen(false);
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
    setIsLevelCompleteModalOpen(false);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
    goToStep(currentLevelNumber, 0);
  };

  // Restart entire game from Level 1
  const handleRestartGame = () => {
    sounds.playPop();
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    setIsLevelCompleteModalOpen(false);
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-1 sm:py-2 flex flex-col gap-2 relative min-h-[86vh] justify-between">
      {/* Compact Top Navigation & Progress Header */}
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
        <div className="w-full max-w-2xl mx-auto p-2.5 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn z-30">
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

      {/* FULL-SCREEN HAUNTED HOUSES SCENE
          The primary focus: occupies almost the entire viewport, clean, spacious, and uncluttered.
      */}
      <div className="relative w-full flex-1 bg-[#140827]/95 border-2 border-purple-700/50 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between my-1">
        {/* Atmospheric Sky Elements */}
        <div className="absolute top-2 left-6 text-2xl sm:text-3xl select-none animate-pulse">🌕</div>
        <div className="absolute top-5 left-28 text-sm text-purple-300/40 select-none">✨</div>
        <div className="absolute top-4 right-24 text-sm text-purple-300/40 select-none">✨</div>
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

        {/* THREE LARGE HAUNTED HOUSES: THE MAIN ATTRACTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 items-stretch justify-items-center max-w-6xl mx-auto w-full z-10 relative flex-1">
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
            dialogue={isHundredsActive ? activeStep.dialogue : (activeStep.inactiveThoughts?.hundreds || "Hundreds House protects 500 candies in grand vault.")}
            speechText={isHundredsActive ? activeStep.speechText : activeStep.inactiveThoughts?.hundreds}
            inactiveThought={activeStep.inactiveThoughts?.hundreds}
            askingNotice={askingNotice && activeStep.askingAnimation?.to === 'hundreds' ? askingNotice : null}
            floatingReward={isHundredsActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
            onOpenQuestionModal={() => setIsQuestionModalOpen(true)}
            hasUnansweredQuestion={isHundredsActive && isCorrect !== true}
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
            floatingReward={isTensActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
            onOpenQuestionModal={() => setIsQuestionModalOpen(true)}
            hasUnansweredQuestion={isTensActive && isCorrect !== true}
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
            floatingReward={isOnesActive ? floatingReward : null}
            onRewardEnd={() => setFloatingReward(null)}
            onOpenQuestionModal={() => setIsQuestionModalOpen(true)}
            hasUnansweredQuestion={isOnesActive && isCorrect !== true}
          />
        </div>

        {/* Cobblestone Street Ground Divider */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-700 via-purple-900 to-amber-700 rounded-full my-2 border-t border-amber-400/40 shadow shrink-0" />

        {/* PERSISTENT WRITTEN SUBTRACTION BOARD & TRICK-OR-TREATERS
            Directly below the houses, showing the classroom borrowing algorithm in real time.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center shrink-0">
          {/* Trick-or-Treaters with Candy Goal */}
          <TrickOrTreater
            collectedCandies={collectedCandies}
            targetCandies={activeLevel.subtrahend}
            isCollecting={activeStep.subtractionCol !== undefined}
            isCelebrated={collectedCandies === activeLevel.subtrahend}
          />

          {/* Persistent Written Subtraction Board */}
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

      {/* CENTERED QUESTION POPUP MODAL
          Dims the scene slightly behind it while keeping the houses visible.
          Displays the 4 randomized answer choices labelled A, B, C, D.
      */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        activeHouse={activeHouse}
        question={activeStep.question}
        speechText={activeStep.speechText}
        dialogue={activeStep.dialogue}
        options={shuffledOptions}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        feedback={feedback}
        onSelectOption={handleSelectOption}
        onContinue={handleModalContinue}
        hint={activeStep.hint}
        onShowHint={handleShowHint}
        hintVisible={hintVisible}
        levelNumber={currentLevelNumber}
        stepNumber={currentStepIndex + 1}
        totalSteps={activeLevel.steps.length}
      />

      {/* CELEBRATORY LEVEL COMPLETION & GRAND WIZARD MODAL */}
      <LevelCompleteModal
        isOpen={isLevelCompleteModalOpen}
        levelNumber={currentLevelNumber}
        totalLevels={LEVELS.length}
        minuend={activeLevel.minuend}
        subtrahend={activeLevel.subtrahend}
        diff={activeLevel.diff}
        levelPoints={levelPointsEarned}
        totalScore={totalScore}
        stars={stars}
        noHintBonus={!usedHintThisLevel}
        onContinue={handleLevelCompleteModalContinue}
        onReview={handleLevelCompleteModalReview}
        onPlayAgain={handleRestartGame}
        onOpenStory={onOpenStory}
        onOpenPractice={onOpenPractice}
        completedLevels={completedLevels}
      />
    </div>
  );
}
