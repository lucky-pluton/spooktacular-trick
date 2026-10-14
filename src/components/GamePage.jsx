import React, { useState, useEffect } from 'react';
import HauntedHouse from './HauntedHouse';
import TrickOrTreater from './TrickOrTreater';
import CandyBag from './CandyBag';
import DialogueBubble from './DialogueBubble';
import PlaceValueBoard from './PlaceValueBoard';
import ProgressBar from './ProgressBar';
import AnswerPanel from './AnswerPanel';
import GameSummary from './GameSummary';
import { SCENES } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * GamePage Component
 * Main state orchestrator for the 5 interactive scenes of Spooktacular Trick.
 */
export default function GamePage({ onOpenStory, onOpenPractice }) {
  // Game progression state
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const [score, setScore] = useState(100);
  const [stars, setStars] = useState(3);
  const [hintVisible, setHintVisible] = useState(false);

  // Question & Interaction state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Scene 5 Subtraction step state
  const [subtractionStep, setSubtractionStep] = useState(0); // 0: Ones, 1: Tens, 2: Hundreds
  const [answers, setAnswers] = useState({ H: null, T: null, O: null });

  // Candies collected by trick-or-treaters
  const [collectedCandies, setCollectedCandies] = useState(0);

  // Flying candy bag animation state
  const [flyingBag, setFlyingBag] = useState(null);

  // Scene configuration
  const currentScene = SCENES.find((s) => s.id === currentSceneId) || SCENES[0];
  const [houses, setHouses] = useState(currentScene.houses);
  const [boardState, setBoardState] = useState(currentScene.boardState);

  // Sync scene state when scene ID changes
  useEffect(() => {
    setHouses(currentScene.houses);
    setBoardState(currentScene.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setHintVisible(false);

    // Speak dialogue when scene loads
    if (currentScene.speechText) {
      sounds.speak(currentScene.speechText);
    }
  }, [currentSceneId]);

  // Handle Start Game from Scene 1
  const handleStartGame = () => {
    setCurrentSceneId(2);
  };

  // Handle Option Selection for Scenes 2, 3, 4
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id);

    if (opt.isCorrect) {
      setIsCorrect(true);
      setFeedback(opt.feedback);
      sounds.playSuccess();

      // Trigger scene specific transformation animation
      if (currentSceneId === 3) {
        // Hundreds give 100 to Tens
        setFlyingBag({
          type: '100',
          from: 'hundreds',
          to: 'tens',
          label: '100 Candies',
        });
        sounds.playCandyBorrow();

        setTimeout(() => {
          sounds.playBagDrop();
          setFlyingBag(null);
          setHouses(currentScene.housesAfter);
          setBoardState({
            ...currentScene.boardState,
            H: { orig: '5', crossed: true, top: '4', sub: '0', ans: null },
            T: { orig: '0', crossed: true, top: '10', sub: '5', ans: null },
          });
        }, 1800);
      } else if (currentSceneId === 4) {
        // Tens give 10 to Ones
        setFlyingBag({
          type: '10',
          from: 'tens',
          to: 'ones',
          label: '10 Candies',
        });
        sounds.playCandyBorrow();

        setTimeout(() => {
          sounds.playBagDrop();
          setFlyingBag(null);
          setHouses(currentScene.housesAfter);
          setBoardState({
            ...currentScene.boardState,
            H: { orig: '5', crossed: true, top: '4', sub: '0', ans: null },
            T: { orig: '0', crossed: true, mid: '10', top: '9', sub: '5', ans: null },
            O: { orig: '0', crossed: true, top: '10', sub: '3', ans: null },
          });
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

  // Handle Answer in Scene 5 (Subtraction columns)
  const handleAnswerSubtraction = (chosenVal) => {
    const stepData = currentScene.subtractionSteps[subtractionStep];
    setSelectedOption(chosenVal);

    if (chosenVal === stepData.correct) {
      setIsCorrect(true);
      setFeedback(`Correct! ${stepData.explain}`);
      sounds.playSuccess();
      sounds.playBagDrop();

      if (subtractionStep === 0) {
        // Ones solved (10 - 3 = 7)
        setAnswers((a) => ({ ...a, O: 7 }));
        setCollectedCandies(3);
        setHouses((prev) => ({
          ...prev,
          ones: { ...prev.ones, value: 7, candies: 7 },
        }));
      } else if (subtractionStep === 1) {
        // Tens solved (9 - 5 = 4)
        setAnswers((a) => ({ ...a, T: 4 }));
        setCollectedCandies(53);
        setHouses((prev) => ({
          ...prev,
          tens: { ...prev.tens, value: 4, candies: 40 },
        }));
      } else if (subtractionStep === 2) {
        // Hundreds solved (4 - 0 = 4)
        setAnswers((a) => ({ ...a, H: 4 }));
        setHouses((prev) => ({
          ...prev,
          hundreds: { ...prev.hundreds, value: 4, candies: 400 },
        }));
      }
    } else {
      setIsCorrect(false);
      setFeedback(`Not quite! Think: what is ${stepData.expr}? Try again!`);
      sounds.playIncorrect();
      setScore((s) => Math.max(20, s - 5));
    }
  };

  // Continue to next scene or next subtraction step
  const handleContinue = () => {
    if (currentSceneId === 5) {
      if (subtractionStep < 2) {
        setSubtractionStep((s) => s + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setFeedback('');
      } else {
        // Completed all steps! Go to victory summary screen (Scene 6)
        setCurrentSceneId(6);
      }
    } else {
      setCurrentSceneId((prev) => prev + 1);
    }
  };

  // Replay current scene
  const handleResetScene = () => {
    sounds.playPop();
    setHouses(currentScene.houses);
    setBoardState(currentScene.boardState);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback('');
    setFlyingBag(null);
    if (currentSceneId === 5) {
      setSubtractionStep(0);
      setAnswers({ H: null, T: null, O: null });
      setCollectedCandies(0);
    }
  };

  // Restart whole game
  const handleRestartGame = () => {
    sounds.playPop();
    setCurrentSceneId(1);
    setScore(100);
    setStars(3);
    setSubtractionStep(0);
    setAnswers({ H: null, T: null, O: null });
    setCollectedCandies(0);
  };

  // Toggle Hint Popover
  const handleShowHint = () => {
    sounds.playPop();
    setHintVisible((h) => !h);
  };

  // Render Completed Summary Screen
  if (currentSceneId === 6) {
    return (
      <GameSummary
        score={score}
        stars={stars}
        onPlayAgain={handleRestartGame}
        onOpenStory={onOpenStory}
        onOpenPractice={onOpenPractice}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 relative">
      {/* Top Scene Progress & Controls */}
      <ProgressBar
        currentScene={currentSceneId}
        totalScenes={5}
        score={score}
        stars={stars}
        onResetScene={handleResetScene}
        onRestartGame={handleRestartGame}
        onShowHint={handleShowHint}
      />

      {/* Hint Alert */}
      {hintVisible && currentScene.hint && (
        <div className="w-full max-w-xl mx-auto p-3 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span>{currentScene.hint}</span>
          </div>
          <button
            onClick={() => setHintVisible(false)}
            className="text-xs bg-amber-800/80 hover:bg-amber-700 text-white px-2 py-1 rounded-lg ml-2 shrink-0"
          >
            Got it!
          </button>
        </div>
      )}

      {/* Spoken Character Dialogue */}
      <DialogueBubble
        speaker={currentScene.speaker}
        dialogue={currentScene.dialogue}
        speechText={currentScene.speechText}
        badge={currentScene.badge}
      />

      {/* Main Street Stage: Haunted Houses & Math Board */}
      <div className="relative w-full bg-[#180a33]/70 border-3 border-purple-600/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Night Sky Background Elements */}
        <div className="absolute top-2 left-6 text-3xl select-none animate-pulse">🌕</div>
        <div className="absolute top-8 left-28 text-base text-purple-300/40 select-none">✨</div>
        <div className="absolute top-4 right-20 text-base text-purple-300/40 select-none">✨</div>
        <div className="absolute top-3 right-8 text-xl select-none animate-bounce">🦇</div>

        {/* Flying Candy Bag Animation Layer */}
        {flyingBag && (
          <CandyBag
            type={flyingBag.type}
            from={flyingBag.from}
            to={flyingBag.to}
            label={flyingBag.label}
          />
        )}

        {/* Center Stage: Three Living Haunted Houses */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center items-end max-w-2xl mx-auto my-2 z-10 relative">
          <HauntedHouse
            type="hundreds"
            value={houses.hundreds.display}
            candies={houses.hundreds.candies}
            mood={houses.hundreds.mood}
            label={houses.hundreds.label}
            isActive={currentSceneId === 3}
            isGiving={currentSceneId === 3 && isCorrect}
          />

          <HauntedHouse
            type="tens"
            value={houses.tens.display}
            candies={houses.tens.candies}
            mood={houses.tens.mood}
            label={houses.tens.label}
            isActive={currentSceneId === 2 || currentSceneId === 4}
            isReceiving={currentSceneId === 3 && isCorrect}
            isGiving={currentSceneId === 4 && isCorrect}
          />

          <HauntedHouse
            type="ones"
            value={houses.ones.display}
            candies={houses.ones.candies}
            mood={houses.ones.mood}
            label={houses.ones.label}
            isActive={currentSceneId === 2}
            isReceiving={currentSceneId === 4 && isCorrect}
          />
        </div>

        {/* Street Ground Line with Cobblestones & Pumpkins */}
        <div className="w-full h-3 bg-gradient-to-r from-amber-700 via-purple-900 to-amber-700 rounded-full my-3 border-t border-amber-400/50 shadow" />

        {/* Bottom Stage Split: Trick-or-Treaters & Formal Math Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center mt-2">
          {/* Left: Trick-or-Treaters with Candy Goal */}
          <TrickOrTreater
            collectedCandies={collectedCandies}
            targetCandies={53}
            isCollecting={subtractionStep > 0}
            isCelebrated={collectedCandies === 53}
          />

          {/* Right: Place-Value Formal Math Board */}
          <PlaceValueBoard
            boardState={boardState}
            highlightCol={
              currentSceneId === 5
                ? subtractionStep === 0
                  ? 'O'
                  : subtractionStep === 1
                  ? 'T'
                  : 'H'
                : currentScene.boardState.highlightCol
            }
            showResult={currentSceneId === 5 && subtractionStep === 2 && isCorrect}
            answers={answers}
          />
        </div>
      </div>

      {/* Bottom Interactive Decision / Question Panel */}
      <AnswerPanel
        sceneId={currentSceneId}
        question={currentScene.question}
        options={currentScene.options}
        onSelectOption={handleSelectOption}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        feedback={feedback}
        onContinue={handleContinue}
        onStartGame={handleStartGame}
        subtractionStep={subtractionStep}
        subtractionData={currentScene.subtractionSteps}
        onAnswerSubtraction={handleAnswerSubtraction}
      />
    </div>
  );
}
