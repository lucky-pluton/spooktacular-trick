import React, { useState, useEffect, useRef } from 'react';
import HauntedHouse from './HauntedHouse';
import TrickOrTreater from './TrickOrTreater';
import CandyBag from './CandyBag';
import DialogueBubble from './DialogueBubble';
import PlaceValueBoard from './PlaceValueBoard';
import ProgressBar from './ProgressBar';
import ContextualQuestion from './ContextualQuestion';
import LevelCompleteModal from './LevelCompleteModal';
import { LEVELS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * GamePage Component
 * Orchestrates the Spooktacular Trick Halloween place-value subtraction adventure.
 * Key features:
 * 1. Contextual Questions: Question card appears adjacent to the active house, transfer, or board column.
 * 2. Visual mathematical updates: Houses and PlaceValueBoard update together when candies transfer.
 * 3. Rewarding Points System: +100 first attempt, +50 retry, +200 level bonus, +50 no-hint bonus, +500 wizard bonus.
 * 4. Engaging Level Completion Popups: Celebratory modals between levels and Grand Wizard finale.
 * 5. 5 Mandatory sequential levels with lock/unlock progression.
 */
export default function GamePage({ onOpenStory, onOpenPractice }) {
  // Level progression
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

  // Scoring and Reward Points System
  const [totalScore, setTotalScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [stars, setStars] = useState(3);
  const [levelPointsEarned, setLevelPointsEarned] = useState(0);
  const [floatingReward, setFloatingReward] = useState(null);
  const [usedHintThisLevel, setUsedHintThisLevel] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // Tracking question attempts to prevent duplicate points
  // questionId -> number of attempts (0 = first try, >0 = retry)
  const [questionAttempts, setQuestionAttempts] = useState({});
  const [awardedQuestionKeys, setAwardedQuestionKeys] = useState([]);

  // Subtraction answers placed on the board for the current level
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });
  const [collectedCandies, setCollectedCandies] = useState(0);

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Level Complete Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref for auto-scrolling to contextual questions on mobile
  const questionCardRef = useRef(null);

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

  // Helper to cleanly transition between steps/levels without state lag
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
  };

  // Speak dialogue and scroll on mobile when step changes
  useEffect(() => {
    if (activeStep.speechText) {
      sounds.speak(activeStep.speechText);
    }
    if (questionCardRef.current && typeof window !== 'undefined' && window.innerWidth < 768) {
      questionCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeStep.speechText, activeStep.stepId]);

  // Handle Start Level for Intro steps
  const handleStartGame = () => {
    goToStep(currentLevelNumber, 1);
  };

  // Unique key for the current question
  const currentQuestionKey = `lvl${currentLevelNumber}_step${activeStep.stepId}`;

  // Handle multiple-choice option selection
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id ?? opt.value);
    const attempts = questionAttempts[currentQuestionKey] || 0;

    if (opt.isCorrect) {
      setIsCorrect(true);
      sounds.playSuccess();

      // Check if points were already awarded for this question to prevent duplicate rewards
      const alreadyAwarded = awardedQuestionKeys.includes(currentQuestionKey);
      let awardedPts = 0;

      if (!alreadyAwarded) {
        awardedPts = attempts === 0 ? 100 : 50;
        setAwardedQuestionKeys((prev) => [...prev, currentQuestionKey]);
        setTotalScore((s) => s + awardedPts);
        setLevelPointsEarned((p) => p + awardedPts);

        // Trigger floating reward popup
        setFloatingReward({
          points: awardedPts,
          label: attempts === 0 ? 'First Try! 🍬' : 'Learned from Clues! ⭐',
        });
      }

      // Friendly feedback with points notification
      const pointsText = awardedPts > 0 ? ` +${awardedPts} points!` : '';
      setFeedback(opt.feedback ? `${opt.feedback}${pointsText}` : `Correct!${pointsText}`);

      // Handle animated candy bag borrowing transfer if defined for this step
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
            // Regrouped digits become visible on the board
            setBoardState((prev) => ({
              ...prev,
              ...activeStep.boardState,
            }));
          }
        }, 1700);
      }

      // Update subtraction answer if this is a column subtraction step
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

  // Continue to the next step or open level complete modal
  const handleContinue = () => {
    if (currentStepIndex < activeLevel.steps.length - 1) {
      goToStep(currentLevelNumber, currentStepIndex + 1);
    } else {
      // All steps of this level completed! Trigger celebratory modal!
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

    // Show level completion popup
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
    goToStep(currentLevelNumber, activeLevel.isStoryTutorial ? 1 : 0);
  };

  // Switch level from progress bar
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

  // Replay current level from progress bar
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

  // Determine active highlight for houses based on contextual anchor
  const isHundredsActive =
    activeStep.targetAnchor === 'hundreds_house' ||
    activeStep.targetAnchor === 'hundreds_to_tens' ||
    activeStep.targetAnchor === 'board_hundreds';

  const isTensActive =
    activeStep.targetAnchor === 'tens_house' ||
    activeStep.targetAnchor === 'hundreds_to_tens' ||
    activeStep.targetAnchor === 'tens_to_ones' ||
    activeStep.targetAnchor === 'board_tens';

  const isOnesActive =
    activeStep.targetAnchor === 'ones_house' ||
    activeStep.targetAnchor === 'tens_to_ones' ||
    activeStep.targetAnchor === 'board_ones';

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 flex flex-col gap-3 relative">
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

      {/* Spoken Character Dialogue Bubble */}
      <DialogueBubble
        speaker={activeStep.speaker}
        dialogue={activeStep.dialogue}
        speechText={activeStep.speechText}
        badge={activeLevel.title}
      />

      {/* MAIN VISUAL STAGE: Living Haunted Houses & Candies */}
      <div className="relative w-full bg-[#180a33]/90 border-3 border-purple-600/50 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden">
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

        {/* Three Living Haunted Houses */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 justify-items-center items-end max-w-2xl mx-auto my-1 z-10 relative">
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

        {/* Cobblestone Street Ground Line */}
        <div className="w-full h-2.5 bg-gradient-to-r from-amber-700 via-purple-900 to-amber-700 rounded-full my-2.5 border-t border-amber-400/50 shadow" />

        {/* Math Board & Trick-or-Treaters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center mt-1">
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
            highlightCol={
              activeStep.subtractionCol || boardState.highlightCol || null
            }
            showResult={
              activeStep.subtractionCol === 'H' && isCorrect
            }
            answers={answers}
          />
        </div>
      </div>

      {/* CONTEXTUAL QUESTION SECTION:
          Appears immediately connected to the active operation/house/column
      */}
      <div ref={questionCardRef} className="w-full mt-1">
        <ContextualQuestion
          targetAnchor={activeStep.targetAnchor || 'ones_house'}
          anchorTitle={activeStep.anchorTitle}
          question={activeStep.question}
          options={activeStep.options || []}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          feedback={feedback}
          onSelectOption={handleSelectOption}
          onContinue={handleContinue}
          isStartStep={activeStep.isStartStep}
          onStartGame={handleStartGame}
          hint={activeStep.hint}
          onShowHint={handleShowHint}
          floatingReward={floatingReward}
          onRewardEnd={() => setFloatingReward(null)}
        />
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
