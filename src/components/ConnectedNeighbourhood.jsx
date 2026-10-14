import React from 'react';
import HouseCharacter from './HouseCharacter';
import CandyBag from './CandyBag';

/**
 * ConnectedNeighbourhood Component
 * Renders the three haunted houses as one continuous, warm Halloween neighbourhood
 * on a shared landscape with a winding cobblestone street, moonlit sky, and lanterns.
 * 
 * Houses stand side-by-side on the street:
 * - Hundreds House (Left: Victorian Castle)
 * - Tens House (Center: Wizard Tower)
 * - Ones House (Right: Pumpkin Cottage)
 */
export default function ConnectedNeighbourhood({
  houses, // { hundreds: {...}, tens: {...}, ones: {...} }
  activeHouse = 'ones', // 'hundreds' | 'tens' | 'ones'
  isQuestionVisible = true,
  isCorrect = null,
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
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d031c] via-[#1a0733] to-[#240b44] border-2 border-purple-700/60 shadow-[0_0_50px_rgba(120,40,200,0.35)] p-2 sm:p-4 md:p-6 flex flex-col justify-between backdrop-blur-md">
      {/* 1. ATMOSPHERIC NIGHT SKY LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Luminous Full Moon */}
        <div className="absolute top-2 left-4 sm:left-8 text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_0_20px_rgba(255,230,120,0.85)] animate-pulse">
          🌕
        </div>
        {/* Twinkling Stars */}
        <div className="absolute top-4 left-24 sm:left-32 text-xs text-amber-200/50 animate-ping">✨</div>
        <div className="absolute top-8 left-1/3 text-xs text-purple-300/40">✨</div>
        <div className="absolute top-3 right-1/4 text-xs text-amber-200/50">✨</div>
        <div className="absolute top-6 right-20 text-xs text-purple-300/40 animate-pulse">✨</div>
        <div className="absolute top-2 right-4 sm:right-8 text-lg sm:text-xl md:text-2xl animate-bounce">🦇</div>
        <div className="absolute top-10 left-12 text-xs opacity-60">🦇</div>

        {/* Gentle Rolling Hills Silhouette */}
        <svg
          viewBox="0 0 1000 160"
          className="absolute bottom-10 left-0 right-0 w-full h-20 sm:h-28 md:h-32 opacity-40"
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
        <div className="relative z-30 max-w-md mx-auto my-1 p-2 rounded-2xl bg-amber-400 text-black font-black text-xs sm:text-sm text-center shadow-[0_0_20px_rgba(255,180,0,0.8)] animate-bounce flex items-center justify-center gap-1.5">
          <span>🎃</span>
          <span>{askingNotice}</span>
          <span>✨</span>
        </div>
      )}

      {/* 4. THE THREE LIVING HOUSES IN ONE CONTINUOUS NEIGHBOURHOOD
          Stands side-by-side directly on the shared cobblestone street.
      */}
      <div className="relative z-20 w-full grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 items-end justify-items-center max-w-5xl mx-auto my-1">
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

      {/* 5. SHARED CONTINUOUS COBBLESTONE STREET & GROUND
          Visually binds the houses together into a single warm community.
      */}
      <div className="relative z-10 w-full mt-1.5 sm:mt-2">
        {/* Street curb & stone texture */}
        <div className="w-full h-3.5 sm:h-5 bg-gradient-to-r from-amber-900 via-purple-950 to-amber-900 rounded-full border-t-2 border-b-2 border-amber-400/60 shadow-lg flex items-center justify-around px-3 sm:px-4">
          <div className="w-6 sm:w-8 h-1 bg-amber-400/40 rounded-full" />
          <div className="w-8 sm:w-12 h-1 bg-purple-400/40 rounded-full" />
          <div className="w-6 sm:w-8 h-1 bg-teal-400/40 rounded-full" />
          <div className="w-10 sm:w-14 h-1 bg-amber-400/40 rounded-full" />
          <div className="w-8 sm:w-10 h-1 bg-purple-400/40 rounded-full" />
        </div>

        {/* Street details: Street lanterns & decorative pumpkins */}
        <div className="flex items-center justify-between px-3 sm:px-6 pt-1 text-xs select-none">
          <span className="flex items-center gap-1 text-amber-300">
            <span>🏮</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 hidden xs:inline">100s</span>
          </span>
          <span className="flex items-center gap-1 text-teal-300">
            <span>🎃</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-purple-300">Candy Lane</span>
            <span>🎃</span>
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 hidden xs:inline">1s</span>
            <span>🏮</span>
          </span>
        </div>
      </div>
    </div>
  );
}
