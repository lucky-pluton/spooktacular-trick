import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

/**
 * WitchyCharacter Component
 * A friendly, encouraging Halloween witch who guides Ghostie along the lantern trail.
 * 
 * Features:
 * - Friendly SVG Witch illustration with hat, starry robe, and magical wand.
 * - Dialogue speech bubble with TTS voice button.
 */
export default function WitchyCharacter({
  speechText = '',
  dialogue = '',
  targetDescription = '',
  onSpeak,
  className = '',
}) {
  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak();
    } else {
      sounds.speak(dialogue || speechText);
    }
  };

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Friendly Witch SVG Avatar */}
      <div className="relative w-14 h-16 sm:w-16 sm:h-20 shrink-0">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full filter blur-md -z-10 animate-pulse" />

        <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(180,70,255,0.5)]">
          <defs>
            <linearGradient id="witchHat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a154b" />
              <stop offset="100%" stopColor="#1a0033" />
            </linearGradient>
            <linearGradient id="witchFace" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffeedb" />
              <stop offset="100%" stopColor="#f8d7b8" />
            </linearGradient>
          </defs>

          {/* Hair */}
          <path
            d="M 24 60 Q 18 85 30 100 Q 36 75 32 60"
            fill="#ff9800"
          />
          <path
            d="M 76 60 Q 82 85 70 100 Q 64 75 68 60"
            fill="#ff9800"
          />

          {/* Face */}
          <circle cx="50" cy="65" r="22" fill="url(#witchFace)" />

          {/* Rosy Cheeks */}
          <circle cx="36" cy="72" r="4.5" fill="#ff4081" opacity="0.45" />
          <circle cx="64" cy="72" r="4.5" fill="#ff4081" opacity="0.45" />

          {/* Eyes with sparkle */}
          <ellipse cx="40" cy="64" rx="3.5" ry="5" fill="#2e1065" />
          <ellipse cx="60" cy="64" rx="3.5" ry="5" fill="#2e1065" />
          <circle cx="39" cy="62" r="1.5" fill="#ffffff" />
          <circle cx="59" cy="62" r="1.5" fill="#ffffff" />

          {/* Warm Smile */}
          <path
            d="M 43 75 Q 50 82 57 75"
            fill="none"
            stroke="#2e1065"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pointy Witch Hat Brim */}
          <ellipse cx="50" cy="50" rx="44" ry="10" fill="url(#witchHat)" stroke="#ffd54f" strokeWidth="1.5" />

          {/* Pointy Hat Cone with slight crook */}
          <path
            d="M 26 48
               Q 44 20 62 8
               Q 54 28 74 48 Z"
            fill="url(#witchHat)"
            stroke="#ffd54f"
            strokeWidth="1.2"
          />

          {/* Hat Ribbon & Gold Buckle */}
          <path
            d="M 28 47 Q 50 43 72 47 L 71 42 Q 50 38 29 42 Z"
            fill="#ffb300"
          />
          <rect x="45" y="40" width="10" height="8" rx="2" fill="#ffd54f" stroke="#e65100" strokeWidth="1.5" />
          <rect x="47" y="42" width="6" height="4" rx="1" fill="#4a154b" />

          {/* Star at the tip of the hat */}
          <text x="64" y="12" fontSize="12">⭐</text>

          {/* Star Wand */}
          <line x1="82" y1="80" x2="94" y2="45" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
          <text x="88" y="45" fontSize="14">✨</text>
        </svg>
      </div>

      {/* Witchy's Guidance Bubble */}
      <div className="flex-1 bg-gradient-to-r from-purple-950/90 via-[#250d40]/90 to-purple-950/90 border-2 border-purple-400/80 rounded-2xl p-2.5 sm:p-3 text-white shadow-[0_0_20px_rgba(180,70,255,0.3)] backdrop-blur-md flex flex-col gap-1">
        <div className="flex items-center justify-between border-b border-purple-400/30 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Witchy's Guide</span>
            </span>
            {targetDescription && (
              <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/50 hidden sm:inline">
                Target: {targetDescription}
              </span>
            )}
          </div>

          {/* TTS Read-Aloud Button */}
          <button
            onClick={handleSpeak}
            type="button"
            className="p-1 rounded-lg bg-purple-800/80 hover:bg-purple-700 text-amber-300 transition-colors cursor-pointer"
            title="Read advice aloud"
            aria-label="Read advice aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed italic">
          "{dialogue || speechText}"
        </p>
      </div>
    </div>
  );
}
