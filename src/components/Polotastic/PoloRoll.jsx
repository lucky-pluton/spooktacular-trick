import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * PoloRoll Component
 * Represents 1 Roll = 10 Polos = 1 Ten.
 * 
 * In Level 3 (or Guidebook demo), clicking an active roll allows the learner
 * to break it apart into 10 individual loose Polos!
 */
export default function PoloRoll({
  rollNumber = 1,
  canBreak = false,
  isBroken = false,
  onBreakRoll,
  size = 'md', // 'sm' | 'md' | 'lg'
  showBadge = true,
  className = '',
}) {
  return (
    <div
      onClick={canBreak && !isBroken ? onBreakRoll : undefined}
      role={canBreak && !isBroken ? 'button' : undefined}
      tabIndex={canBreak && !isBroken ? 0 : undefined}
      onKeyDown={canBreak && !isBroken ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onBreakRoll) onBreakRoll();
        }
      } : undefined}
      className={`relative inline-flex flex-col items-center gap-1.5 transition-all duration-300 ${
        canBreak && !isBroken
          ? 'cursor-pointer hover:scale-105 active:scale-95 group'
          : ''
      } ${isBroken ? 'opacity-30 scale-90 blur-[1px]' : 'opacity-100'} ${className}`}
      title={canBreak ? 'Click to BREAK this Roll into 10 loose Polos!' : '1 Roll = 10 Polos = 1 Ten'}
      aria-label={`Roll ${rollNumber}, 10 Polos`}
    >
      {/* "Break Me!" Pulse Hint Tag when break is available */}
      {canBreak && !isBroken && (
        <span className="absolute -top-3.5 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-black text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(255,190,0,0.8)] animate-bounce flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Tap to Break!</span>
        </span>
      )}

      {/* Main SVG Roll Render */}
      <div className="relative">
        <svg
          width={size === 'sm' ? 130 : size === 'lg' ? 190 : 160}
          height={size === 'sm' ? 44 : size === 'lg' ? 62 : 52}
          viewBox="0 0 160 52"
          className="drop-shadow-[0_6px_14px_rgba(13,217,158,0.35)]"
        >
          <defs>
            {/* Shiny Foil Wrapper Gradient */}
            <linearGradient id="foilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="18%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* End Cap Ring Gradient */}
            <radialGradient id="capGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
          </defs>

          {/* Roll Cylinder Body with Rounded Ends */}
          <rect
            x="8"
            y="6"
            width="144"
            height="38"
            rx="19"
            fill="url(#foilGrad)"
            stroke="#059669"
            strokeWidth="2"
          />

          {/* Highlight Specular Strip along Cylinder */}
          <line
            x1="22"
            y1="12"
            x2="138"
            y2="12"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* 10 Distinct Segments / Ridges representing the 10 Polos inside */}
          {[22, 35, 48, 61, 74, 87, 100, 113, 126, 138].map((x, idx) => (
            <g key={idx}>
              <line
                x1={x}
                y1="6"
                x2={x}
                y2="44"
                stroke="#065f46"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <line
                x1={x + 1.2}
                y1="6"
                x2={x + 1.2}
                y2="44"
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0.75"
              />
            </g>
          ))}

          {/* Wrapper Branding Ribbon */}
          <rect
            x="50"
            y="11"
            width="60"
            height="28"
            rx="6"
            fill="#064e3b"
            stroke="#34d399"
            strokeWidth="1.2"
            opacity="0.9"
          />

          <text
            x="80"
            y="26"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="900"
            letterSpacing="2"
            className="font-black"
          >
            POLO
          </text>
          <text
            x="80"
            y="35"
            textAnchor="middle"
            fill="#a7f3d0"
            fontSize="7"
            fontWeight="700"
          >
            10 MINTS • 1 TEN
          </text>

          {/* Left End Polo Rim */}
          <ellipse
            cx="17"
            cy="25"
            rx="9"
            ry="18"
            fill="url(#capGrad)"
            stroke="#059669"
            strokeWidth="1.5"
          />
          {/* Hole indicator on end cap */}
          <ellipse
            cx="17"
            cy="25"
            rx="3.5"
            ry="7"
            fill="#062e22"
          />
        </svg>

        {/* Breakdown effect overlay if broken */}
        {isBroken && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-black/80 text-amber-300 text-xs font-black uppercase">
              Broken into 10 Polos!
            </span>
          </div>
        )}
      </div>

      {/* Value Badge below Roll */}
      {showBadge && (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[11px] font-bold shadow-sm">
          <span>🥖</span>
          <span>1 Roll = 10 Polos</span>
        </div>
      )}
    </div>
  );
}
