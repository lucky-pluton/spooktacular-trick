import React from 'react';

/**
 * GhostieCharacter Component
 * A cute, friendly, curious little ghost who travels the magical lantern trail.
 * 
 * Expressions:
 * - 'curious': Wondering about the next jump
 * - 'happy': Smiling with bright eyes
 * - 'hopping': Mid-air cheerful jump
 * - 'celebrating': Floating with glowing sparkles
 */
export default function GhostieCharacter({
  mood = 'curious',
  lanternCount = 0,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const sizeMap = {
    sm: 'w-12 h-14',
    md: 'w-16 h-20 sm:w-20 sm:h-24',
    lg: 'w-24 h-28 sm:w-28 sm:h-32',
  };

  const isHappy = mood === 'happy' || mood === 'celebrating';
  const isHopping = mood === 'hopping';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label={`Ghostie is ${mood} holding ${lanternCount} lanterns`}
    >
      {/* Floating Gentle Animation wrapper */}
      <div className={`w-full h-full relative ${isHopping ? 'animate-bounce' : 'animate-float'}`}>
        {/* Soft Glowing Aura around Ghostie */}
        <div className="absolute inset-0 bg-teal-300/30 rounded-full filter blur-md -z-10 animate-pulse" />

        {/* SVG Cute Ghost Body */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,255,200,0.45)]"
        >
          <defs>
            <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e0f7fa" />
              <stop offset="100%" stopColor="#b2ebf2" />
            </linearGradient>
            <radialGradient id="ghostGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#80deea" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Ghost Body with flowing bottom ripples */}
          <path
            d="M 20 60
               C 20 22, 80 22, 80 60
               C 80 85, 82 95, 76 102
               C 70 110, 64 98, 58 104
               C 52 110, 48 98, 42 104
               C 36 110, 30 98, 24 102
               C 18 95, 20 85, 20 60 Z"
            fill="url(#ghostGrad)"
            stroke="#4dd0e1"
            strokeWidth="2.5"
          />

          {/* Highlight Shimmer */}
          <ellipse cx="38" cy="38" rx="14" ry="18" fill="url(#ghostGlow)" />

          {/* Cute Little Ghost Arms */}
          <path
            d="M 18 55 Q 8 62 14 70 Q 20 68 22 62"
            fill="#ffffff"
            stroke="#4dd0e1"
            strokeWidth="2"
          />
          <path
            d="M 82 55 Q 92 62 86 70 Q 80 68 78 62"
            fill="#ffffff"
            stroke="#4dd0e1"
            strokeWidth="2"
          />

          {/* Rosy Cheeks */}
          <circle cx="34" cy="58" r="5" fill="#ff80ab" opacity="0.6" />
          <circle cx="66" cy="58" r="5" fill="#ff80ab" opacity="0.6" />

          {/* Friendly Eyes */}
          {isHappy ? (
            // Smiling Arch Eyes
            <g>
              <path
                d="M 32 48 Q 38 42 44 48"
                fill="none"
                stroke="#006064"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 56 48 Q 62 42 68 48"
                fill="none"
                stroke="#006064"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            // Big curious wide eyes
            <g>
              <ellipse cx="38" cy="48" rx="5" ry="7" fill="#006064" />
              <ellipse cx="62" cy="48" rx="5" ry="7" fill="#006064" />
              <circle cx="36" cy="46" r="2" fill="#ffffff" />
              <circle cx="60" cy="46" r="2" fill="#ffffff" />
            </g>
          )}

          {/* Cute Smiling Mouth */}
          <path
            d="M 44 60 Q 50 67 56 60"
            fill="none"
            stroke="#006064"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Little Floating Golden Sparkles */}
          {mood === 'celebrating' && (
            <g className="animate-ping">
              <text x="80" y="30" fontSize="14">✨</text>
              <text x="5" y="40" fontSize="12">⭐</text>
            </g>
          )}
        </svg>

        {/* Small Lantern in Hand */}
        <div
          className="absolute -bottom-1 -right-1 text-lg sm:text-xl filter drop-shadow-[0_0_8px_rgba(255,180,0,0.9)] animate-pulse"
          title={`Carrying ${lanternCount} lanterns`}
        >
          🏮
        </div>
      </div>
    </div>
  );
}
