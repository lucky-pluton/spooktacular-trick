import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import FloatingReward from './FloatingReward';

/**
 * HouseCharacter Component
 * A friendly, living haunted house that stands naturally within the connected neighbourhood.
 * 
 * Design Principles:
 * 1. NO CARD BOX OR BORDER CONTAINER. The house is a character in a shared world.
 * 2. Friendly, empathetic expressions (NEVER angry, aggressive, or blaming).
 * 3. Animated thought dots when thinking about a subtraction step.
 * 4. Place-value post with prominent digit badge and candy jar supply.
 * 5. Magical glowing aura when this place value is active.
 */
export default function HouseCharacter({
  type = 'ones', // 'hundreds' | 'tens' | 'ones'
  value = 0,
  candies = 0,
  mood = 'idle', // 'idle' | 'thinking' | 'needs_help' | 'happy' | 'celebrating' | 'giving' | 'receiving'
  label = '',
  isActive = false,
  isThinking = false,
  isGiving = false,
  isReceiving = false,
  speechText = '',
  dialogue = '',
  floatingReward = null,
  onRewardEnd,
  onHouseClick,
}) {
  // Color themes and icons based on place value identity
  const config = {
    hundreds: {
      name: 'Hundreds House',
      shortName: 'HUNDREDS',
      icon: '🏰',
      wallColor: '#2d1b4e',
      roofColor: '#6b32a8',
      accentColor: '#b845ff',
      glowColor: '#b845ff',
      badgeBg: '#7b2cbf',
      signBorder: 'border-purple-400/80',
      signBg: 'bg-purple-950/90 text-purple-200',
      aura: 'drop-shadow-[0_0_24px_rgba(184,69,255,0.7)]',
    },
    tens: {
      name: 'Tens House',
      shortName: 'TENS',
      icon: '🗼',
      wallColor: '#123b3b',
      roofColor: '#008b8b',
      accentColor: '#00ffcc',
      glowColor: '#00ffcc',
      badgeBg: '#0077b6',
      signBorder: 'border-teal-400/80',
      signBg: 'bg-teal-950/90 text-teal-200',
      aura: 'drop-shadow-[0_0_24px_rgba(0,255,204,0.7)]',
    },
    ones: {
      name: 'Ones House',
      shortName: 'ONES',
      icon: '🎃',
      wallColor: '#4a2511',
      roofColor: '#d9651a',
      accentColor: '#ff9e00',
      glowColor: '#ff9e00',
      badgeBg: '#e85d04',
      signBorder: 'border-amber-400/80',
      signBg: 'bg-amber-950/90 text-amber-200',
      aura: 'drop-shadow-[0_0_24px_rgba(255,180,0,0.75)]',
    },
  }[type];

  // Determine active visual expression: friendly, child-appropriate, never angry!
  const effectiveMood = isThinking
    ? 'thinking'
    : isGiving || isReceiving || mood === 'celebrating' || mood === 'happy'
    ? 'happy'
    : mood === 'worried' || mood === 'asking' || mood === 'needs_help' || (candies === 0 && isActive)
    ? 'needs_help'
    : 'idle';

  // Render gentle, friendly facial expressions
  const renderFace = () => {
    switch (effectiveMood) {
      case 'thinking':
        return (
          <g className="house-face animate-pulse">
            {/* Curious, thoughtful eyes looking upward */}
            <circle cx="45" cy="60" r="7.5" fill="#ffdd00" />
            <circle cx="47" cy="57" r="3.5" fill="#110726" />
            <circle cx="49" cy="55" r="1.5" fill="#ffffff" />
            <circle cx="75" cy="60" r="7.5" fill="#ffdd00" />
            <circle cx="77" cy="57" r="3.5" fill="#110726" />
            <circle cx="79" cy="55" r="1.5" fill="#ffffff" />
            {/* Soft wondering 'o' mouth */}
            <ellipse cx="60" cy="78" rx="4.5" ry="5.5" fill="#ffdd00" stroke="#d4af37" strokeWidth="1.2" />
            {/* Rosy cheeks */}
            <ellipse cx="36" cy="68" rx="4.5" ry="3" fill="#ff70a6" opacity="0.65" />
            <ellipse cx="84" cy="68" rx="4.5" ry="3" fill="#ff70a6" opacity="0.65" />
          </g>
        );

      case 'needs_help':
        return (
          <g className="house-face">
            {/* Gentle, apologetic eyes with soft rounded brow (NOT angry slanted lines!) */}
            <path d="M38 54 Q45 52 52 55" fill="none" stroke="#ffdd00" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M68 55 Q75 52 82 54" fill="none" stroke="#ffdd00" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="45" cy="63" r="7.5" fill="#ffdd00" />
            <circle cx="45" cy="63" r="3.5" fill="#110726" />
            <circle cx="43" cy="61" r="1.5" fill="#ffffff" />
            <circle cx="75" cy="63" r="7.5" fill="#ffdd00" />
            <circle cx="75" cy="63" r="3.5" fill="#110726" />
            <circle cx="73" cy="61" r="1.5" fill="#ffffff" />
            {/* Gentle, apologetic mouth (soft sweet curve: "Oh, I'm out of candy!") */}
            <path d="M51 79 Q60 74 69 79" fill="none" stroke="#ffdd00" strokeWidth="2.6" strokeLinecap="round" />
            {/* Cute blushing cheeks */}
            <ellipse cx="36" cy="71" rx="4.5" ry="3" fill="#ff85a1" opacity="0.75" />
            <ellipse cx="84" cy="71" rx="4.5" ry="3" fill="#ff85a1" opacity="0.75" />
          </g>
        );

      case 'happy':
        return (
          <g className="house-face animate-bounce">
            {/* Joyful smiling curved eyes */}
            <path d="M38 62 Q45 51 52 62" fill="none" stroke="#ffea00" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M68 62 Q75 51 82 62" fill="none" stroke="#ffea00" strokeWidth="3.2" strokeLinecap="round" />
            {/* Beaming open happy smile */}
            <path d="M48 74 Q60 88 72 74 Z" fill="#ffea00" stroke="#d4af37" strokeWidth="1.5" />
            {/* Rosy cheerful cheeks */}
            <ellipse cx="36" cy="70" rx="5" ry="3.5" fill="#ff5d8f" opacity="0.85" />
            <ellipse cx="84" cy="70" rx="5" ry="3.5" fill="#ff5d8f" opacity="0.85" />
          </g>
        );

      default: // 'idle' / 'calm'
        return (
          <g className="house-face">
            {/* Friendly calm round eyes */}
            <circle cx="45" cy="62" r="7.5" fill="#ffea00" />
            <circle cx="46" cy="62" r="3.5" fill="#110726" />
            <circle cx="44" cy="60" r="1.5" fill="#ffffff" />
            <circle cx="75" cy="62" r="7.5" fill="#ffea00" />
            <circle cx="76" cy="62" r="3.5" fill="#110726" />
            <circle cx="74" cy="60" r="1.5" fill="#ffffff" />
            {/* Gentle warm friendly smile */}
            <path d="M49 76 Q60 83 71 76" fill="none" stroke="#ffea00" strokeWidth="2.8" strokeLinecap="round" />
            {/* Cheerful cheeks */}
            <ellipse cx="36" cy="69" rx="4" ry="2.5" fill="#ff70a6" opacity="0.6" />
            <ellipse cx="84" cy="69" rx="4" ry="2.5" fill="#ff70a6" opacity="0.6" />
          </g>
        );
    }
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    sounds.speak(speechText || dialogue || `${config.name} has ${candies} candies.`);
  };

  return (
    <div
      onClick={onHouseClick}
      className={`relative flex flex-col items-center justify-end transition-all duration-300 select-none group ${
        isActive ? 'scale-105 z-20' : 'opacity-90 hover:opacity-100 z-10'
      }`}
    >
      {/* Floating Points Reward Animation directly over active house */}
      {isActive && floatingReward && (
        <FloatingReward
          points={floatingReward.points}
          label={floatingReward.label}
          onAnimationEnd={onRewardEnd}
        />
      )}

      {/* THOUGHT DOTS (Floats upward when thinking/asking for help) */}
      {isThinking && (
        <div className="absolute -top-10 sm:-top-14 flex flex-col items-center gap-1.5 animate-bounce z-30 pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-amber-300 border-2 border-white shadow-[0_0_12px_rgba(255,215,0,0.9)] animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
      )}

      {/* Active State / Giving / Receiving Badges */}
      <div className="h-6 flex items-center justify-center mb-1">
        {isActive && isThinking ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(255,180,0,0.85)] animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>Active ➡️</span>
          </span>
        ) : isGiving ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase animate-bounce shadow">
            Giving 🍬
          </span>
        ) : isReceiving ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black text-[10px] uppercase animate-bounce shadow">
            Received ✨
          </span>
        ) : null}
      </div>

      {/* SVG LIVING HAUNTED HOUSE ARCHITECTURE */}
      <div
        className={`relative w-28 sm:w-36 md:w-44 lg:w-48 xl:w-52 h-32 sm:h-40 md:h-48 lg:h-52 transition-all duration-300 ${
          isActive ? config.aura : 'filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]'
        }`}
      >
        <svg
          viewBox="0 0 120 150"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id={`house-glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Chimney & Animated Smoke Puffs */}
          <rect x="84" y="16" width="14" height="28" fill="#1a1226" stroke="#000" strokeWidth="2" />
          <path d="M82 16 H100 V12 H82 Z" fill="#2d1f40" stroke="#000" strokeWidth="1.5" />
          <g className="animate-pulse">
            <circle cx="91" cy="6" r="3.5" fill="#c4b5fd" opacity="0.6" />
            <circle cx="95" cy="-2" r="5" fill="#c4b5fd" opacity="0.4" />
          </g>

          {/* Distinct Roof Structures */}
          {type === 'hundreds' ? (
            <g>
              <polygon points="60,16 6,56 114,56" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <polygon points="60,19 16,54 104,54" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />
              <path d="M57 16 V8 M54 8 Q60 3 66 8 Q63 12 54 8" fill="none" stroke="#ffd000" strokeWidth="2" />
            </g>
          ) : type === 'tens' ? (
            <g>
              <polygon points="56,10 12,54 108,54" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 10 Q58 32 108 54" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
              <circle cx="56" cy="6" r="4.5" fill="#00ffcc" filter={`url(#house-glow-${type})`} />
            </g>
          ) : (
            <g>
              <path d="M10 56 Q60 14 110 56 Z" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 24 Q60 12 64 24" fill="none" stroke="#2b9348" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          )}

          {/* Building Wall Body */}
          <rect
            x="18"
            y="54"
            width="84"
            height="86"
            rx="5"
            fill={config.wallColor}
            stroke="#090514"
            strokeWidth="3"
          />
          <line x1="18" y1="74" x2="102" y2="74" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="96" x2="102" y2="96" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="118" x2="102" y2="118" stroke="#000" strokeWidth="1" opacity="0.3" />

          {/* Living Friendly Facial Expression */}
          {renderFace()}

          {/* Glowing Stained Glass Door Window */}
          <path d="M48 106 Q60 98 72 106 V140 H48 Z" fill="#120a1f" stroke="#000" strokeWidth="2" />
          <path
            d="M52 110 Q60 104 68 110 V138 H52 Z"
            fill={config.glowColor}
            opacity="0.85"
            filter={`url(#house-glow-${type})`}
          />
          <line x1="60" y1="104" x2="60" y2="138" stroke="#120a1f" strokeWidth="1.8" />
          <line x1="52" y1="122" x2="68" y2="122" stroke="#120a1f" strokeWidth="1.8" />
        </svg>
      </div>

      {/* LAWN SIGNPOST / PLACE-VALUE BADGE
          Stands on the shared ground right in front of the house.
      */}
      <div
        className={`w-full max-w-[130px] sm:max-w-[180px] md:max-w-[220px] mt-1 p-1 sm:p-2 rounded-xl sm:rounded-2xl border-2 ${config.signBorder} ${config.signBg} shadow-lg backdrop-blur-md flex items-center justify-between gap-1 sm:gap-2 transition-all`}
      >
        {/* Large Prominent Digit Badge */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <div
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-lg md:text-2xl border-2 border-white shadow-md transition-transform shrink-0"
            style={{
              backgroundColor: config.badgeBg,
              color: '#ffffff',
              boxShadow: `0 0 14px ${config.glowColor}`,
            }}
          >
            {value}
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-300 font-extrabold leading-none truncate">
              {config.shortName}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-white leading-tight truncate">
              {label || `${value} ${type === 'hundreds' ? 'Hundreds' : type === 'tens' ? 'Tens' : 'Ones'}`}
            </span>
          </div>
        </div>

        {/* Candy Bowl Supply Counter */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-black/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl border border-white/10 text-right shrink-0">
          <span className="text-xs sm:text-sm md:text-base">🍬</span>
          <div className="flex flex-col">
            <span className="font-black text-amber-300 text-[11px] sm:text-xs md:text-sm leading-none">
              {candies}
            </span>
            <span className="text-[7px] sm:text-[8px] text-purple-200 font-semibold leading-none hidden sm:inline">
              candies
            </span>
          </div>
        </div>

        {/* Audio Narration Button */}
        <button
          onClick={handleSpeak}
          type="button"
          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors cursor-pointer hidden sm:block shrink-0"
          title={`Listen to ${config.name}`}
          aria-label={`Listen to ${config.name}`}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
