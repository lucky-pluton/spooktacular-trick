import React from 'react';

/**
 * PoloCounter Component
 * Pure SVG-based ring-shaped mint candy manipulative.
 * Completely self-contained: requires zero external image assets!
 * 
 * Represents 1 One in the Polo place-value system.
 */
export default function PoloCounter({
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  interactive = false,
  selected = false,
  isRemoving = false,
  onClick,
  label,
  className = '',
  numberLabel = null,
}) {
  const sizeMap = {
    xs: { px: 28, text: 8 },
    sm: { px: 38, text: 10 },
    md: { px: 52, text: 12 },
    lg: { px: 68, text: 15 },
    xl: { px: 84, text: 18 },
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      } : undefined}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${selected ? 'ring-4 ring-emerald-400 rounded-full scale-105' : ''} ${
        isRemoving ? 'opacity-0 scale-50 -translate-y-8 pointer-events-none' : 'opacity-100'
      } ${className}`}
      title={label || '1 Polo (1 one)'}
      aria-label={label || '1 Polo'}
    >
      <svg
        width={dim.px}
        height={dim.px}
        viewBox="0 0 100 100"
        className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.35)]"
      >
        <defs>
          {/* Mint White Gradient */}
          <radialGradient id="mintGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f0fdf9" />
            <stop offset="85%" stopColor="#d1fae5" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </radialGradient>

          {/* Candy Inner Bevel Gradient */}
          <linearGradient id="bevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.6" />
          </linearGradient>

          {/* Central Hole Shadow */}
          <radialGradient id="holeDepth" cx="42%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#062e22" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Outer Ring Drop Shadow & Ambient Glow */}
        <circle cx="50" cy="53" r="44" fill="#064e3b" opacity="0.3" />

        {/* Main Mint Outer Body */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="url(#mintGrad)"
          stroke="#10b981"
          strokeWidth="2.5"
        />

        {/* Outer Highlight Ring */}
        <circle
          cx="49"
          cy="48"
          r="41"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Subtle Decorative Grooves on Ring */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#a7f3d0"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.7"
        />

        {/* Embossed Text "POLO" curved or subtle mint ring dots */}
        <g opacity="0.45">
          <circle cx="50" cy="18" r="2" fill="#047857" />
          <circle cx="82" cy="50" r="2" fill="#047857" />
          <circle cx="50" cy="82" r="2" fill="#047857" />
          <circle cx="18" cy="50" r="2" fill="#047857" />
        </g>

        {/* Center Hole Rim Bevel */}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="url(#bevelGrad)"
          strokeWidth="2.5"
        />

        {/* Central Through-Hole (Iconic Polo feature) */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="url(#holeDepth)"
        />

        {/* Inner Hole Crescent Highlight */}
        <path
          d="M 36 44 A 18 18 0 0 1 64 44"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.85"
        />

        {/* Sweet Mint Sparkle Dot */}
        <circle cx="34" cy="30" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="38" cy="27" r="1.5" fill="#ffffff" opacity="0.95" />
      </svg>

      {/* Optional Number / Badge Label */}
      {numberLabel !== null && (
        <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-black shadow-sm">
          {numberLabel}
        </span>
      )}
    </div>
  );
}
