import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import FloatingReward from './FloatingReward';

/**
 * Living Haunted House Component
 * Clean, full-screen living character and mathematical place-value house.
 * 
 * Features:
 * 1. Prominent place-value header with large digit badge & candy vault counter.
 * 2. Large, expressive living haunted house SVG illustration with animated faces.
 * 3. Character speech bubble with read-aloud voice narration.
 * 4. Active house visual emphasis: glowing border, "Active Place" badge, and "Answer Question" button.
 * 5. Giving / receiving animated states during borrowing transfers.
 * 6. Floating rewards for correct answers.
 */
export default function HauntedHouse({
  type = 'ones', // 'hundreds' | 'tens' | 'ones'
  value = 0,
  candies = 0,
  mood = 'neutral',
  label = '',
  isActive = false,
  isGiving = false,
  isReceiving = false,
  dialogue = '',
  speechText = '',
  inactiveThought = '',
  askingNotice = null,
  floatingReward = null,
  onRewardEnd,
  onOpenQuestionModal, // Opens the centered question popup
  hasUnansweredQuestion = false,
}) {
  // Styles and palettes based on place value identity
  const config = {
    hundreds: {
      title: 'Hundreds House',
      shortName: 'HUNDREDS (100s)',
      icon: '🏰',
      wallColor: '#2d1b4e',
      roofColor: '#5c2d91',
      accentColor: '#9b51e0',
      glowColor: '#b845ff',
      tagColor: 'bg-purple-950/90 border-purple-400 text-purple-200',
      badgeBg: '#7b2cbf',
      ringClass: 'ring-4 ring-purple-400 shadow-[0_0_35px_rgba(184,69,255,0.7)]',
      bgActive: 'bg-[#220d3f]/95 border-purple-400',
      bgInactive: 'bg-[#15072b]/85 border-purple-800/60',
      openBtnClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(184,69,255,0.6)]',
    },
    tens: {
      title: 'Tens House',
      shortName: 'TENS (10s)',
      icon: '🗼',
      wallColor: '#123b3b',
      roofColor: '#006666',
      accentColor: '#00b4d8',
      glowColor: '#00ffcc',
      tagColor: 'bg-teal-950/90 border-teal-400 text-teal-200',
      badgeBg: '#0077b6',
      ringClass: 'ring-4 ring-teal-400 shadow-[0_0_35px_rgba(0,255,204,0.7)]',
      bgActive: 'bg-[#0f2c38]/95 border-teal-400',
      bgInactive: 'bg-[#0a1a24]/85 border-teal-800/60',
      openBtnClass: 'bg-teal-600 hover:bg-teal-500 text-black shadow-[0_0_15px_rgba(0,255,204,0.6)]',
    },
    ones: {
      title: 'Ones House',
      shortName: 'ONES (1s)',
      icon: '🎃',
      wallColor: '#4a2511',
      roofColor: '#c85a17',
      accentColor: '#ff7700',
      glowColor: '#ff9e00',
      tagColor: 'bg-amber-950/90 border-amber-400 text-amber-200',
      badgeBg: '#e85d04',
      ringClass: 'ring-4 ring-amber-400 shadow-[0_0_35px_rgba(255,180,0,0.8)]',
      bgActive: 'bg-[#351609]/95 border-amber-400',
      bgInactive: 'bg-[#1e0d05]/85 border-amber-800/60',
      openBtnClass: 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(255,180,0,0.6)]',
    },
  }[type];

  // Facial expression eyes & mouth coordinates
  const renderFace = () => {
    switch (mood) {
      case 'worried':
      case 'asking':
        return (
          <g className="house-face animate-pulse">
            <line x1="38" y1="52" x2="52" y2="56" stroke="#ffcc00" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="68" y1="56" x2="82" y2="52" stroke="#ffcc00" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="45" cy="64" r="8" fill="#ffdd00" />
            <circle cx="47" cy="62" r="3.5" fill="#110726" />
            <circle cx="75" cy="64" r="8" fill="#ffdd00" />
            <circle cx="73" cy="62" r="3.5" fill="#110726" />
            <path d="M48 82 Q60 76 72 82" fill="none" stroke="#ffdd00" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'generous':
      case 'sharing':
      case 'happy':
      case 'celebrating':
        return (
          <g className="house-face">
            <path d="M38 64 Q45 54 52 64" fill="none" stroke="#ffea00" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M68 64 Q75 54 82 64" fill="none" stroke="#ffea00" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M48 76 Q60 92 72 76 Z" fill="#ffea00" stroke="#d4af37" strokeWidth="1.5" />
            <ellipse cx="36" cy="72" rx="4.5" ry="3" fill="#ff5d8f" opacity="0.8" />
            <ellipse cx="84" cy="72" rx="4.5" ry="3" fill="#ff5d8f" opacity="0.8" />
          </g>
        );

      case 'excited':
        return (
          <g className="house-face animate-bounce">
            <circle cx="45" cy="62" r="9" fill="#00ffcc" />
            <circle cx="47" cy="60" r="3.5" fill="#110726" />
            <circle cx="44" cy="58" r="1.5" fill="#ffffff" />
            <circle cx="75" cy="62" r="9" fill="#00ffcc" />
            <circle cx="77" cy="60" r="3.5" fill="#110726" />
            <circle cx="74" cy="58" r="1.5" fill="#ffffff" />
            <ellipse cx="60" cy="80" rx="8" ry="10" fill="#00ffcc" />
          </g>
        );

      case 'giving':
        return (
          <g className="house-face">
            <circle cx="45" cy="62" r="7.5" fill="#ffd000" />
            <circle cx="47" cy="62" r="3" fill="#110726" />
            <circle cx="75" cy="62" r="7.5" fill="#ffd000" />
            <circle cx="77" cy="62" r="3" fill="#110726" />
            <path d="M48 78 Q60 88 72 78" fill="none" stroke="#ffd000" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        );

      default:
        return (
          <g className="house-face">
            <circle cx="45" cy="63" r="7" fill="#ffea00" />
            <circle cx="46" cy="63" r="3" fill="#110726" />
            <circle cx="75" cy="63" r="7" fill="#ffea00" />
            <circle cx="76" cy="63" r="3" fill="#110726" />
            <path d="M50 78 Q60 84 70 78" fill="none" stroke="#ffea00" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        );
    }
  };

  const handleSpeak = (textToSpeak) => {
    sounds.speak(textToSpeak || speechText || dialogue || inactiveThought);
  };

  const displayText = isActive ? (dialogue || speechText) : (inactiveThought || dialogue);

  return (
    <div
      className={`relative w-full rounded-3xl p-3 sm:p-4 border-3 flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
        isActive
          ? `${config.bgActive} ${config.ringClass} scale-[1.02] z-20`
          : isGiving || isReceiving
          ? `${config.bgActive} ring-3 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] z-15`
          : `${config.bgInactive} opacity-85 hover:opacity-100 z-10`
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

      {/* Top Status Header: Name Tag & Action Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        {/* Place-value Name Tag */}
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase border flex items-center gap-1.5 shadow ${
            isActive ? 'bg-amber-400 text-black border-white shadow-[0_0_12px_rgba(255,180,0,0.8)]' : config.tagColor
          }`}
        >
          <span>{config.icon}</span>
          <span>{config.shortName}</span>
        </div>

        {/* Active / Giving / Receiving State Badges */}
        {isActive ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-[11px] uppercase tracking-wider animate-pulse shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Place</span>
          </span>
        ) : isGiving ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[10px] uppercase animate-bounce shadow">
            Giving 🍬
          </span>
        ) : isReceiving ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400 text-black font-extrabold text-[10px] uppercase animate-bounce shadow">
            Received ✨
          </span>
        ) : null}
      </div>

      {/* Digit Badge & Candy Counter Bar */}
      <div className="flex items-center justify-between gap-2 bg-black/40 border border-white/10 rounded-2xl px-3 py-2 mb-2 shadow-inner">
        {/* Large Prominent Place-Value Digit */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl border-2 shadow-lg transition-transform duration-200"
            style={{
              backgroundColor: config.badgeBg,
              borderColor: '#ffffff',
              color: '#ffffff',
              boxShadow: `0 0 14px ${config.glowColor}`,
            }}
          >
            {value}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">
              Digit
            </span>
            <span className="text-xs sm:text-sm font-black text-white leading-tight">
              {label || `${value} ${type === 'hundreds' ? 'Hundreds' : type === 'tens' ? 'Tens' : 'Ones'}`}
            </span>
          </div>
        </div>

        {/* Candy Bowl / Vault Counter */}
        <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-right">
          <span className="text-lg sm:text-xl">🍬</span>
          <div className="flex flex-col">
            <span className="font-black text-amber-300 text-sm sm:text-base leading-none">
              {candies}
            </span>
            <span className="text-[9px] text-purple-300 font-semibold leading-none">
              candies
            </span>
          </div>
        </div>
      </div>

      {/* Large Haunted House Character Artwork */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 flex items-center justify-center my-1">
        <svg
          viewBox="0 0 120 150"
          className="w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
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

          {/* Roof Structures */}
          {type === 'hundreds' ? (
            <g>
              <polygon points="60,18 8,56 112,56" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <polygon points="60,20 18,54 102,54" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
              <path d="M57 18 V10 M54 10 Q60 5 66 10 Q63 14 54 10" fill="none" stroke="#ffd000" strokeWidth="1.8" />
            </g>
          ) : type === 'tens' ? (
            <g>
              <polygon points="56,12 14,54 106,54" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 12 Q58 32 106 54" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
              <circle cx="56" cy="8" r="4" fill="#00ffcc" />
            </g>
          ) : (
            <g>
              <path d="M12 56 Q60 16 108 56 Z" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 26 Q60 14 64 26" fill="none" stroke="#2b9348" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {/* Building Body */}
          <rect
            x="18"
            y="54"
            width="84"
            height="86"
            rx="4"
            fill={config.wallColor}
            stroke="#090514"
            strokeWidth="3"
          />
          <line x1="18" y1="74" x2="102" y2="74" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="96" x2="102" y2="96" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="118" x2="102" y2="118" stroke="#000" strokeWidth="1" opacity="0.3" />

          {/* Living Facial Expression */}
          {renderFace()}

          {/* Glowing Door Window */}
          <path d="M48 106 Q60 98 72 106 V140 H48 Z" fill="#120a1f" stroke="#000" strokeWidth="2" />
          <path
            d="M52 110 Q60 104 68 110 V138 H52 Z"
            fill={config.glowColor}
            opacity="0.85"
            filter={`url(#glow-${type})`}
          />
          <line x1="60" y1="104" x2="60" y2="138" stroke="#120a1f" strokeWidth="1.8" />
          <line x1="52" y1="122" x2="68" y2="122" stroke="#120a1f" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Asking Animation Notice (e.g. Ones asks Tens, Tens asks Hundreds) */}
      {askingNotice && (
        <div className="my-1.5 p-2 rounded-xl bg-amber-400 text-black font-black text-xs text-center shadow-lg animate-bounce">
          {askingNotice}
        </div>
      )}

      {/* Character Speech Bubble */}
      <div className="bg-black/45 border border-white/10 rounded-2xl p-2.5 shadow-sm text-left flex flex-col justify-between min-h-[64px] my-1">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 mb-1">
          <span className="text-[10px] font-black uppercase text-purple-300">
            {type === 'hundreds' ? 'Grand Victorian' : type === 'tens' ? 'Wizard Tower' : 'Pumpkin Cottage'}
          </span>
          <button
            onClick={() => handleSpeak(displayText)}
            type="button"
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors cursor-pointer"
            title="Listen to character"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-200 font-medium leading-relaxed italic line-clamp-3">
          "{displayText}"
        </p>
      </div>

      {/* Action Area: Answer Question Button if this house has active turn */}
      {isActive && onOpenQuestionModal && (
        <button
          onClick={onOpenQuestionModal}
          type="button"
          className={`w-full mt-2 py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer ${config.openBtnClass}`}
        >
          <span>{hasUnansweredQuestion ? 'Answer Question 🎃' : 'View Question 📝'}</span>
        </button>
      )}

      {!isActive && (
        <div className="w-full mt-2 pt-1 text-center text-[10px] text-gray-400 font-medium truncate">
          {type === 'hundreds' && 'Preserving 100s in vault'}
          {type === 'tens' && 'Bridging 100s and 1s'}
          {type === 'ones' && 'Giving 1s to trick-or-treaters'}
        </div>
      )}
    </div>
  );
}
