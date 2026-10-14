import React from 'react';

/**
 * Living Haunted House Component
 * Represents a place value (Hundreds, Tens, or Ones)
 * with animated eyes, facial expressions, and candy counter.
 */
export default function HauntedHouse({
  type = 'ones', // 'hundreds' | 'tens' | 'ones'
  value = 0,
  candies = 0,
  mood = 'neutral',
  isActive = false,
  isGiving = false,
  isReceiving = false,
  label = '',
}) {
  // Styles and palettes based on place value identity
  const config = {
    hundreds: {
      title: 'Hundreds House',
      shortName: 'HUNDREDS (100s)',
      wallColor: '#2d1b4e',
      roofColor: '#5c2d91',
      accentColor: '#9b51e0',
      glowColor: '#b845ff',
      tagColor: 'bg-purple-900/80 border-purple-400 text-purple-200',
      badgeBg: '#7b2cbf',
    },
    tens: {
      title: 'Tens House',
      shortName: 'TENS (10s)',
      wallColor: '#123b3b',
      roofColor: '#006666',
      accentColor: '#00b4d8',
      glowColor: '#00ffcc',
      tagColor: 'bg-teal-900/80 border-teal-400 text-teal-200',
      badgeBg: '#0077b6',
    },
    ones: {
      title: 'Ones House',
      shortName: 'ONES (1s)',
      wallColor: '#4a2511',
      roofColor: '#c85a17',
      accentColor: '#ff7700',
      glowColor: '#ff9e00',
      tagColor: 'bg-amber-950/80 border-amber-400 text-amber-200',
      badgeBg: '#e85d04',
    },
  }[type];

  // Facial expression eyes & mouth coordinates
  const renderFace = () => {
    switch (mood) {
      case 'worried':
      case 'asking':
        return (
          <g className="house-face animate-pulse">
            {/* Worried slanted eyebrows */}
            <line x1="38" y1="52" x2="52" y2="56" stroke="#ffcc00" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="68" y1="56" x2="82" y2="52" stroke="#ffcc00" strokeWidth="2.8" strokeLinecap="round" />
            {/* Wide anxious glowing eyes */}
            <circle cx="45" cy="64" r="8" fill="#ffdd00" />
            <circle cx="47" cy="62" r="3.5" fill="#110726" />
            <circle cx="75" cy="64" r="8" fill="#ffdd00" />
            <circle cx="73" cy="62" r="3.5" fill="#110726" />
            {/* Wobbly worried mouth */}
            <path d="M48 82 Q60 76 72 82" fill="none" stroke="#ffdd00" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'generous':
      case 'sharing':
      case 'happy':
      case 'celebrating':
        return (
          <g className="house-face">
            {/* Happy curved eyes */}
            <path d="M38 64 Q45 54 52 64" fill="none" stroke="#ffea00" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M68 64 Q75 54 82 64" fill="none" stroke="#ffea00" strokeWidth="3.5" strokeLinecap="round" />
            {/* Warm cheerful open mouth */}
            <path d="M48 76 Q60 92 72 76 Z" fill="#ffea00" stroke="#d4af37" strokeWidth="1.5" />
            {/* Rosy cheeks */}
            <ellipse cx="36" cy="72" rx="4.5" ry="3" fill="#ff5d8f" opacity="0.8" />
            <ellipse cx="84" cy="72" rx="4.5" ry="3" fill="#ff5d8f" opacity="0.8" />
          </g>
        );

      case 'excited':
        return (
          <g className="house-face animate-bounce">
            {/* Sparkly big round eyes */}
            <circle cx="45" cy="62" r="9" fill="#00ffcc" />
            <circle cx="47" cy="60" r="3.5" fill="#110726" />
            <circle cx="44" cy="58" r="1.5" fill="#ffffff" />
            <circle cx="75" cy="62" r="9" fill="#00ffcc" />
            <circle cx="77" cy="60" r="3.5" fill="#110726" />
            <circle cx="74" cy="58" r="1.5" fill="#ffffff" />
            {/* Big "O" gasp of delight */}
            <ellipse cx="60" cy="80" rx="8" ry="10" fill="#00ffcc" />
          </g>
        );

      case 'giving':
        return (
          <g className="house-face">
            {/* Confident smiling eyes */}
            <circle cx="45" cy="62" r="7.5" fill="#ffd000" />
            <circle cx="47" cy="62" r="3" fill="#110726" />
            <circle cx="75" cy="62" r="7.5" fill="#ffd000" />
            <circle cx="77" cy="62" r="3" fill="#110726" />
            <path d="M48 78 Q60 88 72 78" fill="none" stroke="#ffd000" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        );

      default:
        // Neutral / attentive friendly face
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

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        isActive ? 'scale-105 filter drop-shadow-[0_0_18px_rgba(255,180,0,0.45)]' : 'hover:scale-[1.02]'
      }`}
      style={{ minWidth: '150px' }}
    >
      {/* Top Banner Tag */}
      <div
        className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-1.5 border flex items-center gap-1.5 shadow-md"
        style={{
          backgroundColor: '#1b0e2b',
          borderColor: config.accentColor,
          color: config.glowColor,
        }}
      >
        <span>{type === 'hundreds' ? '🏰' : type === 'tens' ? '🗼' : '🎃'}</span>
        <span>{config.shortName}</span>
      </div>

      {/* Main Living House SVG Illustration */}
      <div className="relative w-36 h-48 sm:w-44 sm:h-56">
        <svg
          viewBox="0 0 120 150"
          className="w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Chimney & Puffs */}
          <rect x="84" y="16" width="14" height="28" fill="#1a1226" stroke="#000" strokeWidth="2" />
          <path d="M82 16 H100 V12 H82 Z" fill="#2d1f40" stroke="#000" strokeWidth="1.5" />
          {/* Animated smoke puff */}
          <g className="animate-pulse">
            <circle cx="91" cy="6" r="3.5" fill="#c4b5fd" opacity="0.6" />
            <circle cx="95" cy="-2" r="5" fill="#c4b5fd" opacity="0.4" />
          </g>

          {/* Roof Structure */}
          {type === 'hundreds' ? (
            // Grand Victorian double steep roof
            <g>
              <polygon points="60,18 8,56 112,56" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <polygon points="60,20 18,54 102,54" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
              {/* Bat Weathervane */}
              <path d="M57 18 V10 M54 10 Q60 5 66 10 Q63 14 54 10" fill="none" stroke="#ffd000" strokeWidth="1.8" />
            </g>
          ) : type === 'tens' ? (
            // Tall quirky wizard tower roof
            <g>
              <polygon points="56,12 14,54 106,54" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 12 Q58 32 106 54" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
              {/* Moon finial */}
              <circle cx="56" cy="8" r="4" fill="#00ffcc" />
            </g>
          ) : (
            // Cozy rounded pumpkin cottage roof
            <g>
              <path d="M12 56 Q60 16 108 56 Z" fill={config.roofColor} stroke="#090514" strokeWidth="2.5" />
              <path d="M56 26 Q60 14 64 26" fill="none" stroke="#2b9348" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {/* House Building Body */}
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

          {/* Wooden planks / wall texture */}
          <line x1="18" y1="74" x2="102" y2="74" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="96" x2="102" y2="96" stroke="#000" strokeWidth="1" opacity="0.3" />
          <line x1="18" y1="118" x2="102" y2="118" stroke="#000" strokeWidth="1" opacity="0.3" />

          {/* Living House Face */}
          {renderFace()}

          {/* Glowing Attic / Door Window */}
          <path
            d="M48 106 Q60 98 72 106 V140 H48 Z"
            fill="#120a1f"
            stroke="#000"
            strokeWidth="2"
          />
          <path
            d="M52 110 Q60 104 68 110 V138 H52 Z"
            fill={config.glowColor}
            opacity="0.85"
            filter={`url(#glow-${type})`}
          />
          {/* Window pane crosses */}
          <line x1="60" y1="104" x2="60" y2="138" stroke="#120a1f" strokeWidth="1.8" />
          <line x1="52" y1="122" x2="68" y2="122" stroke="#120a1f" strokeWidth="1.8" />

          {/* Spiderweb in the corner */}
          <path d="M18 54 Q32 54 32 68 M18 61 Q27 61 27 68" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
        </svg>

        {/* Large Prominent Place-Value Digit Circle */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-xl border-3 shadow-lg z-10 transition-transform duration-200"
          style={{
            backgroundColor: config.badgeBg,
            borderColor: '#ffffff',
            color: '#ffffff',
            boxShadow: `0 0 12px ${config.glowColor}`,
          }}
        >
          {value}
        </div>
      </div>

      {/* Candies Vault / Counter Box */}
      <div
        className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg border-2 text-center shadow-md bg-opacity-90 flex flex-col items-center"
        style={{
          backgroundColor: '#160a26',
          borderColor: config.accentColor,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base">🍬</span>
          <span className="font-extrabold text-amber-300 text-sm sm:text-base tracking-wide">
            {candies}
          </span>
          <span className="text-xs text-purple-300 font-medium">candies</span>
        </div>
        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
          {label}
        </div>
      </div>

      {/* Visual Indicator of Giving or Receiving */}
      {isGiving && (
        <div className="absolute -top-6 bg-amber-400 text-black font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg animate-bounce">
          Giving 🍬
        </div>
      )}
      {isReceiving && (
        <div className="absolute -top-6 bg-emerald-400 text-black font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg animate-bounce">
          Received! ✨
        </div>
      )}
    </div>
  );
}
