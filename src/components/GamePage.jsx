import React, { useState, useEffect, useCallback } from 'react';
import ConnectedNeighbourhood from './ConnectedNeighbourhood';
import TrickOrTreater from './TrickOrTreater';
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
 * Connected Haunted-House Neighbourhood + Automatic Cloud-Shaped Thought Bubbles:
 * 
 * 1. One Connected Neighbourhood:
 *    Houses live side-by-side on a continuous street without separate card borders.
 * 2. Automatic Cloud-Shaped Thought Bubble Questions:
 *    Appears automatically when the active house encounters a question — no separate button click needed!
 * 3. 4 Randomized Answer Choices (A, B, C, D):
 *    Shuffled on load and on retry; validated by stable isCorrect / id, never array index.
 * 4. Visible Written Subtraction Board:
 *    Shows standard vertical borrowing algorithm (strike-through and regrouped digits) in real time.
 * 5. 5 Compulsory Sequential Levels:
 *    500−53=447, 400−65=335, 300−28=272, 600−84=516, 700−49=651.
 * 6. Points & Celebratory Level Completion Modals.
 */
export default function GamePage({ onOpenStory, onOpenPractice, onSwitchMode }) {
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
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);

  // Level Complete Modal
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
      setIsQuestionVisible(true);
    }
  }, []);

  // Speak character speech whenever question changes
  useEffect(() => {
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
  }, [currentQuestionKey, activeStep.speechText]);

  // Handle option selection inside the ThoughtCloudBubble
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

  // Finish current level and award level bonuses
  const completeActiveLevel = useCallback(() => {
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
  }, [completedLevels, currentLevelNumber, unlockedLevels, awardedQuestionKeys, usedHintThisLevel]);

  // Helper to advance to next step or finish level
  const advanceStep = useCallback(() => {
    if (currentStepIndex < activeLevel.steps.length - 1) {
      goToStep(currentLevelNumber, currentStepIndex + 1);
    } else {
      completeActiveLevel();
    }
  }, [currentStepIndex, activeLevel.steps.length, currentLevelNumber, goToStep, completeActiveLevel]);

  // Continue after correct answer: Close thought bubble and trigger neighbourhood animation
  const handleContinue = () => {
    // 1. Close thought cloud so child can clearly see the action between houses
    setIsQuestionVisible(false);

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
      // No bag animation: brief pause then advance
      setTimeout(() => {
        advanceStep();
      }, 1100);
    }
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
    setIsQuestionVisible(true);
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
        onSwitchMode={onSwitchMode}
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

      {/* ONE CONNECTED HAUNTED-HOUSE NEIGHBOURHOOD
          The houses live together on a shared cobblestone street.
          Questions appear automatically in cloud-shaped speech bubbles near the active house!
      */}
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
        onShowHint={handleShowHint}
        hintVisible={hintVisible}
        stepNumber={currentStepIndex + 1}
        totalSteps={activeLevel.steps.length}
        flyingBag={flyingBag}
        askingNotice={askingNotice}
        floatingReward={floatingReward}
        onRewardEnd={() => setFloatingReward(null)}
        isIdleMode={false}
      />

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
