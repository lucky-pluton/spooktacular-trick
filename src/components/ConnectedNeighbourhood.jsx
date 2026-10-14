import React from 'react';
import HouseCharacter from './HouseCharacter';
import ThoughtCloudBubble from './ThoughtCloudBubble';
import CandyBag from './CandyBag';

/**
 * ConnectedNeighbourhood Component
 * Renders the three haunted houses as one continuous, warm Halloween neighbourhood
 * on a shared landscape with a winding cobblestone street, moonlit sky, and interactive
 * cloud-shaped thought bubbles.
 * 
 * Design Philosophy:
 * - NO SEPARATE BOXED CARDS around each house.
 * - The three houses live together on the same street.
 * - Questions appear inside an automatic thought cloud bubble near the house needing help.
 */
export default function ConnectedNeighbourhood({
  houses, // { hundreds: {...}, tens: {...}, ones: {...} }
  activeHouse = 'ones', // 'hundreds' | 'tens' | 'ones'
  isQuestionVisible = false,
  question = '',
  speechText = '',
  dialogue = '',
  options = [],
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onSelectOption,
  onContinue,
  hint = '',
  onShowHint,
  hintVisible = false,
  stepNumber = 1,
  totalSteps = 7,
  flyingBag = null, // { type, from, to, label }
  askingNotice = null,
  floatingReward = null,
  onRewardEnd,
  isIdleMode = false, // When in welcome exploration
}) {
  const isHundredsActive = !isIdleMode && activeHouse === 'hundreds';
  const isTensActive = !isIdleMode && activeHouse === 'tens';
  const isOnesActive = !isIdleMode && activeHouse === 'ones';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d031c] via-[#1a0733] to-[#240b44] border-2 border-purple-700/60 shadow-[0_0_50px_rgba(120,40,200,0.35)] p-3 sm:p-6 flex flex-col justify-between my-2 backdrop-blur-md">
      {/* 1. ATMOSPHERIC NIGHT SKY LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Luminous Full Moon */}
        <div className="absolute top-3 left-6 sm:left-10 text-3xl sm:text-4xl filter drop-shadow-[0_0_20px_rgba(255,230,120,0.85)] animate-pulse">
          🌕
        </div>
        {/* Twinkling Stars */}
        <div className="absolute top-5 left-32 text-xs text-amber-200/50 animate-ping">✨</div>
        <div className="absolute top-10 left-1/3 text-xs text-purple-300/40">✨</div>
        <div className="absolute top-4 right-1/4 text-xs text-amber-200/50">✨</div>
        <div className="absolute top-8 right-24 text-xs text-purple-300/40 animate-pulse">✨</div>
        <div className="absolute top-3 right-8 text-xl sm:text-2xl animate-bounce">🦇</div>
        <div className="absolute top-14 left-16 text-sm opacity-60">🦇</div>

        {/* Gentle Rolling Hills Silhouette */}
        <svg
          viewBox="0 0 1000 160"
          className="absolute bottom-12 left-0 right-0 w-full h-24 sm:h-32 opacity-40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 160 Q 250 80 500 120 T 1000 100 L 1000 160 Z"
            fill="#120424"
          />
        </svg>
      </div>

      {/* 2. FLYING CANDY BAG ANIMATION LAYER */}
      {flyingBag && (
        <CandyBag
          type={flyingBag.type}
          from={flyingBag.from}
          to={flyingBag.to}
          label={flyingBag.label}
        />
      )}

      {/* 3. ASKING DIALOGUE NOTIFICATION BANNER */}
      {askingNotice && (
        <div className="relative z-30 max-w-md mx-auto my-1.5 p-2.5 rounded-2xl bg-amber-400 text-black font-black text-xs sm:text-sm text-center shadow-[0_0_20px_rgba(255,180,0,0.8)] animate-bounce flex items-center justify-center gap-2">
          <span>🎃</span>
          <span>{askingNotice}</span>
          <span>✨</span>
        </div>
      )}

      {/* 4. CLOUD-SHAPED SPEECH / THOUGHT BUBBLE
          Automatically appears near the house that encountered a question!
      */}
      {isQuestionVisible && (
        <div className="relative z-30 w-full max-w-xl mx-auto mb-3">
          <ThoughtCloudBubble
            isVisible={isQuestionVisible}
            activeHouse={activeHouse}
            question={question}
            speechText={speechText}
            dialogue={dialogue}
            options={options}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            feedback={feedback}
            onSelectOption={onSelectOption}
            onContinue={onContinue}
            hint={hint}
            onShowHint={onShowHint}
            hintVisible={hintVisible}
            stepNumber={stepNumber}
            totalSteps={totalSteps}
          />
        </div>
      )}

      {/* 5. THE THREE LIVING HOUSES IN ONE CONTINUOUS NEIGHBOURHOOD
          Stands side-by-side directly on the shared cobblestone street.
      */}
      <div className="relative z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-end justify-items-center max-w-5xl mx-auto my-2">
        {/* Hundreds House (Left: Victorian Castle) */}
        <HouseCharacter
          type="hundreds"
          value={houses.hundreds.value ?? houses.hundreds.display}
          candies={houses.hundreds.candies}
          mood={isIdleMode ? 'idle' : houses.hundreds.mood}
          label={houses.hundreds.label}
          isActive={isHundredsActive}
          isThinking={isHundredsActive && isQuestionVisible && isCorrect !== true}
          isGiving={flyingBag?.from === 'hundreds' && isCorrect}
          isReceiving={flyingBag?.to === 'hundreds' && isCorrect}
          speechText={houses.hundreds.speechText}
          dialogue={houses.hundreds.dialogue}
          floatingReward={isHundredsActive ? floatingReward : null}
          onRewardEnd={onRewardEnd}
        />

        {/* Tens House (Center: Wizard Tower) */}
        <HouseCharacter
          type="tens"
          value={houses.tens.value ?? houses.tens.display}
          candies={houses.tens.candies}
          mood={isIdleMode ? 'idle' : houses.tens.mood}
          label={houses.tens.label}
          isActive={isTensActive}
          isThinking={isTensActive && isQuestionVisible && isCorrect !== true}
          isGiving={flyingBag?.from === 'tens' && isCorrect}
          isReceiving={flyingBag?.to === 'tens' && isCorrect}
          speechText={houses.tens.speechText}
          dialogue={houses.tens.dialogue}
          floatingReward={isTensActive ? floatingReward : null}
          onRewardEnd={onRewardEnd}
        />

        {/* Ones House (Right: Pumpkin Cottage) */}
        <HouseCharacter
          type="ones"
          value={houses.ones.value ?? houses.ones.display}
          candies={houses.ones.candies}
          mood={isIdleMode ? 'idle' : houses.ones.mood}
          label={houses.ones.label}
          isActive={isOnesActive}
          isThinking={isOnesActive && isQuestionVisible && isCorrect !== true}
          isGiving={flyingBag?.from === 'ones' && isCorrect}
          isReceiving={flyingBag?.to === 'ones' && isCorrect}
          speechText={houses.ones.speechText}
          dialogue={houses.ones.dialogue}
          floatingReward={isOnesActive ? floatingReward : null}
          onRewardEnd={onRewardEnd}
        />
      </div>

      {/* 6. SHARED CONTINUOUS COBBLESTONE STREET & GROUND
          Visually binds the houses together into a single warm community.
      */}
      <div className="relative z-10 w-full mt-2">
        {/* Street curb & stone texture */}
        <div className="w-full h-4 sm:h-5 bg-gradient-to-r from-amber-900 via-purple-950 to-amber-900 rounded-full border-t-2 border-b-2 border-amber-400/60 shadow-lg flex items-center justify-around px-4">
          <div className="w-8 h-1 bg-amber-400/40 rounded-full" />
          <div className="w-12 h-1 bg-purple-400/40 rounded-full" />
          <div className="w-8 h-1 bg-teal-400/40 rounded-full" />
          <div className="w-14 h-1 bg-amber-400/40 rounded-full" />
          <div className="w-10 h-1 bg-purple-400/40 rounded-full" />
        </div>

        {/* Street details: Street lanterns & decorative pumpkins */}
        <div className="flex items-center justify-between px-6 pt-1 text-xs select-none">
          <span className="flex items-center gap-1 text-amber-300">
            <span>🏮</span>
            <span className="text-[10px] font-bold text-gray-400 hidden sm:inline">West End (100s)</span>
          </span>
          <span className="flex items-center gap-1 text-teal-300">
            <span>🎃</span>
            <span className="text-[10px] font-bold text-purple-300 hidden sm:inline">Candy Lane</span>
            <span>🎃</span>
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="text-[10px] font-bold text-gray-400 hidden sm:inline">East End (1s)</span>
            <span>🏮</span>
          </span>
        </div>
      </div>
    </div>
  );
}
