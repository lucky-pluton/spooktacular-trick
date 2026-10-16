import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

/**
 * PipCharacter Component
 * Pip the Polo Penguin & Math Explorer!
 * 100% pure SVG character with expressive animations and speech bubble.
 */
export default function PipCharacter({
  mood = 'happy', // 'happy' | 'cheering' | 'thinking' | 'guiding' | 'waving'
  speechText = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  onSpeak,
  className = '',
}) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeak = () => {
    if (!speechText) return;
    if (isSpeaking) {
      sounds.stopSpeech();
      setIsSpeaking(false);
    } else {
      sounds.playPop();
      setIsSpeaking(true);
      sounds.speak(speechText);
      // approximate reading time fallback
      const duration = Math.max(3000, speechText.split(' ').length * 350);
      setTimeout(() => setIsSpeaking(false), duration);
      if (onSpeak) onSpeak();
    }
  };

  const dims = {
    sm: { width: 70, height: 70 },
    md: { width: 100, height: 100 },
    lg: { width: 130, height: 130 },
  }[size] || { width: 100, height: 100 };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Pip SVG Character */}
      <div
        className="relative shrink-0 select-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        onClick={handleSpeak}
        title="Click to hear Pip talk!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSpeak();
          }
        }}
      >
        <svg
          width={dims.width}
          height={dims.height}
          viewBox="0 0 120 120"
          className="drop-shadow-[0_8px_16px_rgba(16,185,129,0.4)]"
        >
          <defs>
            {/* Body Gradient */}
            <radialGradient id="pipBody" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Belly Gradient */}
            <radialGradient id="pipBelly" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f0fdf9" />
              <stop offset="100%" stopColor="#ccfbf1" />
            </radialGradient>

            {/* Mint Scarf Gradient */}
            <linearGradient id="pipScarf" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Beak / Feet Gradient */}
            <linearGradient id="pipOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Feet */}
          <ellipse cx="45" cy="112" rx="12" ry="6" fill="url(#pipOrange)" />
          <ellipse cx="75" cy="112" rx="12" ry="6" fill="url(#pipOrange)" />

          {/* Main Penguin Body */}
          <ellipse cx="60" cy="65" rx="42" ry="48" fill="url(#pipBody)" />

          {/* Left Wing */}
          {mood === 'cheering' ? (
            <path
              d="M 22 55 Q 8 30 18 20 Q 28 35 28 60 Z"
              fill="url(#pipBody)"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ) : mood === 'waving' ? (
            <path
              d="M 24 55 Q 6 30 16 18 Q 28 32 30 60 Z"
              fill="url(#pipBody)"
              stroke="#0f172a"
              strokeWidth="2"
              className="animate-bounce"
            />
          ) : (
            <ellipse cx="20" cy="68" rx="8" ry="24" transform="rotate(18 20 68)" fill="url(#pipBody)" />
          )}

          {/* Right Wing */}
          {mood === 'cheering' ? (
            <path
              d="M 98 55 Q 112 30 102 20 Q 92 35 92 60 Z"
              fill="url(#pipBody)"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ) : mood === 'guiding' ? (
            <path
              d="M 96 60 Q 118 68 114 78 Q 94 76 92 65 Z"
              fill="url(#pipBody)"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ) : (
            <ellipse cx="100" cy="68" rx="8" ry="24" transform="rotate(-18 100 68)" fill="url(#pipBody)" />
          )}

          {/* White Belly */}
          <ellipse cx="60" cy="72" rx="28" ry="36" fill="url(#pipBelly)" />

          {/* Cheek Blush */}
          <ellipse cx="38" cy="54" rx="6" ry="4" fill="#fda4af" opacity="0.6" />
          <ellipse cx="82" cy="54" rx="6" ry="4" fill="#fda4af" opacity="0.6" />

          {/* Big Sparkly Eyes */}
          {mood === 'thinking' ? (
            <>
              {/* Thinking: looking up-left */}
              <ellipse cx="44" cy="46" rx="8" ry="11" fill="#0f172a" />
              <ellipse cx="76" cy="46" rx="8" ry="11" fill="#0f172a" />
              <circle cx="41" cy="42" r="3.5" fill="#ffffff" />
              <circle cx="73" cy="42" r="3.5" fill="#ffffff" />
            </>
          ) : (
            <>
              <ellipse cx="44" cy="46" rx="8" ry="11" fill="#0f172a" />
              <ellipse cx="76" cy="46" rx="8" ry="11" fill="#0f172a" />
              {/* Eye Catchlights */}
              <circle cx="42" cy="42" r="3.5" fill="#ffffff" />
              <circle cx="46" cy="48" r="1.5" fill="#ffffff" />
              <circle cx="74" cy="42" r="3.5" fill="#ffffff" />
              <circle cx="78" cy="48" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Orange Beak */}
          <polygon points="60,49 50,58 70,58" fill="url(#pipOrange)" stroke="#d97706" strokeWidth="1" />

          {/* Cheerful Beak Smile Bottom */}
          <path d="M 54 58 Q 60 63 66 58 Z" fill="#d97706" />

          {/* Cozy Mint Scarf */}
          <path
            d="M 32 72 Q 60 84 88 72 Q 88 84 60 92 Q 32 84 32 72 Z"
            fill="url(#pipScarf)"
            stroke="#047857"
            strokeWidth="1.5"
          />
          {/* Hanging scarf tail */}
          <path
            d="M 68 82 L 76 104 L 86 100 L 78 80 Z"
            fill="url(#pipScarf)"
            stroke="#047857"
            strokeWidth="1.5"
          />

          {/* Mini Polo Sweet Badge on Scarf */}
          <circle cx="58" cy="80" r="5" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
          <circle cx="58" cy="80" r="2" fill="#064e3b" />
        </svg>

        {/* Small Audio Play Hint Button on Character */}
        {speechText && (
          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-400 text-black shadow-md">
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </span>
        )}
      </div>

      {/* Speech / Hint Bubble */}
      {speechText && (
        <div className="relative flex-1 bg-gradient-to-r from-emerald-950/95 to-[#062e24]/95 border-2 border-emerald-400/80 rounded-2xl p-3 sm:p-4 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.3)] backdrop-blur-sm animate-popIn">
          {/* Arrow pointing to character */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-emerald-400 border-b-8 border-b-transparent" />
          
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-white">
              <span className="font-black text-emerald-300 mr-1.5">Pip:</span>
              {speechText}
            </p>

            <button
              onClick={handleSpeak}
              type="button"
              className="shrink-0 p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors cursor-pointer"
              title="Hear Pip read this instruction"
              aria-label="Listen to voice"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
