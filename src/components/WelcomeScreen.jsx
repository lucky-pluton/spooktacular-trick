import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * WelcomeScreen Component
 * Minimal, focused, and child-friendly landing page for Spooktacular Trick.
 *
 * Keeps ONLY:
 * - App name: Spooktacular Trick
 * - Tagline: "A little spooky. A lot of mathematical fun!"
 * - Introduction: "Discover clever subtraction tricks, solve playful challenges, and become a maths master!"
 * - One prominent primary button: "Start Playing"
 * - Subtle Halloween-inspired decorative element: friendly ghost, pumpkin, and twinkling stars.
 */
export default function WelcomeScreen({ onStart }) {
  const handleStart = () => {
    sounds.playSuccess();
    if (onStart) onStart();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center text-center animate-fadeIn">
      {/* Central Welcoming Card with Generous Whitespace */}
      <div className="relative w-full bg-[#17092e]/90 border-2 border-purple-500/40 rounded-[36px] sm:rounded-[48px] px-6 py-8 sm:px-12 sm:py-14 text-white shadow-[0_0_60px_rgba(168,85,247,0.22)] backdrop-blur-md flex flex-col items-center">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Halloween-inspired Illustration (Friendly Ghost, Pumpkin, Stars) */}
        <div className="mb-4 sm:mb-6">
          <svg
            viewBox="0 0 280 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-48 sm:w-60 md:w-68 h-auto mx-auto select-none drop-shadow-[0_10px_25px_rgba(255,160,0,0.25)]"
            aria-hidden="true"
            role="img"
          >
            <defs>
              <linearGradient id="pumpkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="pumpkinCarve" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="ghostBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f5f3ff" />
                <stop offset="100%" stopColor="#ddd6fe" />
              </linearGradient>
            </defs>

            {/* Soft warm background aura */}
            <circle cx="140" cy="100" r="70" fill="#f59e0b" fillOpacity="0.08" filter="blur(20px)" />

            {/* Star 1 - Top Left */}
            <g className="animate-pulse" style={{ animationDuration: '3s' }}>
              <path d="M 45 40 Q 55 40 55 30 Q 55 40 65 40 Q 55 40 55 50 Q 55 40 45 40 Z" fill="#fde047" />
              <circle cx="55" cy="40" r="1.5" fill="#ffffff" />
            </g>

            {/* Star 2 - Top Right */}
            <g className="animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>
              <path d="M 225 35 Q 233 35 233 27 Q 233 35 241 35 Q 233 35 233 43 Q 233 35 225 35 Z" fill="#fde047" />
              <circle cx="233" cy="35" r="1.2" fill="#ffffff" />
            </g>

            {/* Star 3 - Mid Right Small */}
            <g className="animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>
              <path d="M 252 85 Q 256 85 256 81 Q 256 85 260 85 Q 256 85 256 89 Q 256 85 252 85 Z" fill="#fef08a" opacity="0.85" />
            </g>

            {/* Friendly Ghost Group with gentle float */}
            <g className="animate-float">
              {/* Ghost Shadow */}
              <ellipse cx="98" cy="155" rx="26" ry="6" fill="#000000" fillOpacity="0.25" filter="blur(3px)" />

              {/* Ghost Body */}
              <path
                d="M 68 85 C 68 50, 128 50, 128 85 C 128 105, 132 135, 122 142 C 114 148, 108 138, 98 143 C 88 138, 82 148, 74 142 C 64 135, 68 105, 68 85 Z"
                fill="url(#ghostBodyGrad)"
                stroke="#c4b5fd"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Ghost Left Waving Arm */}
              <path
                d="M 69 90 C 52 82, 50 68, 56 64 C 62 60, 68 76, 73 84"
                fill="url(#ghostBodyGrad)"
                stroke="#c4b5fd"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Ghost Right Arm */}
              <path
                d="M 125 94 C 138 98, 142 106, 137 112 C 132 116, 124 104, 122 100"
                fill="url(#ghostBodyGrad)"
                stroke="#c4b5fd"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Ghost Friendly Eyes */}
              <ellipse cx="88" cy="80" rx="4" ry="5.5" fill="#1e1b4b" />
              <circle cx="86.5" cy="78" r="1.5" fill="#ffffff" />
              <ellipse cx="108" cy="80" rx="4" ry="5.5" fill="#1e1b4b" />
              <circle cx="106.5" cy="78" r="1.5" fill="#ffffff" />

              {/* Ghost Rosy Cheeks */}
              <ellipse cx="81" cy="87" rx="4" ry="2" fill="#f472b6" fillOpacity="0.55" />
              <ellipse cx="115" cy="87" rx="4" ry="2" fill="#f472b6" fillOpacity="0.55" />

              {/* Ghost Happy Open Mouth */}
              <path
                d="M 94 88 Q 98 96 102 88 Q 98 90 94 88 Z"
                fill="#1e1b4b"
              />
            </g>

            {/* Smiling Pumpkin Group */}
            <g transform="translate(140, 75)">
              {/* Pumpkin Shadow */}
              <ellipse cx="44" cy="80" rx="40" ry="7" fill="#000000" fillOpacity="0.3" filter="blur(3px)" />

              {/* Stem */}
              <path
                d="M 43 20 C 42 12, 47 4, 55 2 C 54 8, 49 14, 47 22 Z"
                fill="#4d7c0f"
                stroke="#365314"
                strokeWidth="1"
              />

              {/* Back Ribs */}
              <ellipse cx="22" cy="48" rx="18" ry="26" fill="#ea580c" />
              <ellipse cx="66" cy="48" rx="18" ry="26" fill="#ea580c" />

              {/* Middle Ribs */}
              <ellipse cx="32" cy="49" rx="19" ry="28" fill="#f97316" />
              <ellipse cx="56" cy="49" rx="19" ry="28" fill="#f97316" />

              {/* Center Rib */}
              <ellipse cx="44" cy="50" rx="18" ry="29" fill="url(#pumpkinGrad)" stroke="#c2410c" strokeWidth="1" />

              {/* Carved Smiling Eyes */}
              <polygon points="31,42 37,34 39,42" fill="url(#pumpkinCarve)" stroke="#b45309" strokeWidth="0.5" />
              <polygon points="57,42 51,34 49,42" fill="url(#pumpkinCarve)" stroke="#b45309" strokeWidth="0.5" />

              {/* Carved Little Nose */}
              <polygon points="44,45 42,49 46,49" fill="url(#pumpkinCarve)" />

              {/* Carved Happy Smile with little teeth */}
              <path
                d="M 28 54 Q 44 72 60 54 C 57 58, 54 58, 52 55 C 50 58, 47 58, 45 55 C 43 58, 40 58, 38 55 C 35 58, 31 57, 28 54 Z"
                fill="url(#pumpkinCarve)"
                stroke="#b45309"
                strokeWidth="0.75"
              />
            </g>
          </svg>
        </div>

        {/* 1. App Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 font-['Creepster',cursive] tracking-wider leading-tight drop-shadow-md">
          Spooktacular Trick
        </h1>

        {/* 2. Short Tagline */}
        <p className="text-lg sm:text-2xl md:text-3xl text-amber-300 font-black tracking-wide mt-2 sm:mt-3">
          A little spooky. A lot of mathematical fun!
        </p>

        {/* 3. One Brief Introduction */}
        <p className="text-sm sm:text-base md:text-lg text-purple-100 font-medium leading-relaxed max-w-xl mx-auto mt-3 sm:mt-4 text-balance">
          Discover clever subtraction tricks, solve playful challenges, and become a maths master!
        </p>

        {/* 4. One Prominent Primary Button */}
        <div className="mt-8 sm:mt-10 w-full flex justify-center">
          <button
            id="start-playing-button"
            onClick={handleStart}
            type="button"
            className="w-full sm:w-auto min-w-[240px] px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-black font-black text-lg sm:text-2xl shadow-[0_0_35px_rgba(255,180,0,0.65)] hover:shadow-[0_0_50px_rgba(255,180,0,0.9)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3.5 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            aria-label="Start Playing"
          >
            <span>Start Playing</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.75]" />
          </button>
        </div>
      </div>
    </div>
  );
}
