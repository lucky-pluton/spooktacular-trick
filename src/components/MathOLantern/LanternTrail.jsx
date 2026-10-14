import React from 'react';
import GhostieCharacter from './GhostieCharacter';
import { Sparkles } from 'lucide-react';

/**
 * LanternTrail Component
 * Visualizes subtraction as counting forward along a magical lantern trail.
 * 
 * Elements:
 * 1. Horizontal glowing number trail with milestone markers.
 * 2. Animated curved jump arcs showing increments (+4, +60, +400).
 * 3. Ghostie positioned at the current milestone with smooth transitions.
 * 4. Animated lanterns joining the collection when Ghostie hops.
 * 5. Dynamic live number sentence updating after each jump.
 */
export default function LanternTrail({
  startNumber = 36,
  targetNumber = 500,
  currentNumber = 36,
  milestones = [36, 40, 100, 500],
  completedJumps = [], // [{ from, to, increment }]
  totalCollected = 0,
  isCompleted = false,
  isJumping = false,
  className = '',
}) {
  // Calculate relative percentage position for each milestone along the trail (from 8% to 92%)
  const getMilestonePercent = (num) => {
    const min = startNumber;
    const max = targetNumber;
    if (max === min) return 50;

    // Use a perceptual non-linear scale so that small initial jumps (e.g. 36 to 40)
    // still have generous visible space to show Ghostie and the arc clearly!
    const idx = milestones.indexOf(num);
    if (idx !== -1 && milestones.length > 1) {
      // Distribute milestones evenly along the path with padding
      return 10 + (idx / (milestones.length - 1)) * 80;
    }
    // Fallback linear
    const ratio = Math.max(0, Math.min(1, (num - min) / (max - min)));
    return 10 + ratio * 80;
  };

  const ghostiePercent = getMilestonePercent(currentNumber);

  // SVG dimensions for numerical viewBox mapping
  const svgWidth = 1000;
  const svgHeight = 180;
  const groundY = 140;

  return (
    <div
      className={`relative w-full rounded-3xl bg-gradient-to-b from-[#0a1826] via-[#102a3a] to-[#07131e] border-2 border-teal-500/70 shadow-[0_0_40px_rgba(0,255,200,0.25)] p-3 sm:p-5 overflow-hidden select-none text-white flex flex-col justify-between ${className}`}
      aria-label="The Magical Lantern Trail"
    >
      {/* 1. ATMOSPHERIC NIGHT SKY BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft Moon */}
        <div className="absolute top-2 left-6 text-3xl opacity-80 filter drop-shadow-[0_0_12px_rgba(255,240,150,0.8)]">
          🌕
        </div>
        {/* Twinkling stars */}
        <div className="absolute top-3 left-1/4 text-xs text-teal-200/40 animate-ping">✨</div>
        <div className="absolute top-6 left-1/2 text-xs text-amber-200/50">✨</div>
        <div className="absolute top-4 right-1/4 text-xs text-teal-200/40 animate-pulse">✨</div>
        <div className="absolute top-2 right-8 text-xl opacity-60 animate-bounce">🦇</div>
        {/* Enchanted trees / hills silhouette */}
        <svg
          viewBox="0 0 1000 120"
          className="absolute bottom-4 left-0 right-0 w-full h-16 sm:h-20 opacity-20 pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 120 Q 200 40 400 70 T 800 60 T 1000 80 L 1000 120 Z"
            fill="#020810"
          />
        </svg>
      </div>

      {/* 2. TOP METRICS DASHBOARD: START, TARGET, & ACCUMULATED LANTERNS */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-500/30 pb-2 z-10">
        {/* Start & Destination Pill */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <span className="px-2.5 py-1 rounded-xl bg-teal-950/80 border border-teal-400/50 text-teal-200 flex items-center gap-1.5 shadow-sm">
            <span>🏁 Start:</span>
            <span className="font-mono text-amber-300 font-black">{startNumber}</span>
          </span>

          <span className="text-gray-400 font-bold">➡️</span>

          <span className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-400/50 text-purple-200 flex items-center gap-1.5 shadow-sm">
            <span>🏰 Target:</span>
            <span className="font-mono text-amber-300 font-black">{targetNumber}</span>
          </span>
        </div>

        {/* Current Total Position Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-bold bg-teal-900/60 px-2.5 py-1 rounded-xl border border-teal-500/40">
          <span className="text-gray-300">Ghostie is at:</span>
          <span className="font-mono font-black text-white text-sm bg-black/40 px-2 py-0.5 rounded-lg border border-teal-400/60">
            {currentNumber}
          </span>
        </div>

        {/* Accumulated Lantern Counter */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400/80 text-amber-200 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,180,0,0.3)]">
            <span className={`text-base sm:text-lg ${isJumping ? 'animate-spin' : 'animate-bounce'}`}>🏮</span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase tracking-wider text-amber-300 font-extrabold">Lanterns Collected</span>
              <span className="font-mono text-sm sm:text-base text-white">{totalCollected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE NUMBER TRAIL WORKSPACE */}
      <div className="relative w-full h-44 sm:h-52 my-2 flex items-center">
        {/* The Cobblestone Trail Road */}
        <div className="absolute left-[5%] right-[5%] bottom-10 h-3 sm:h-4 bg-gradient-to-r from-teal-950 via-emerald-950 to-teal-950 rounded-full border-t-2 border-b-2 border-teal-400/70 shadow-lg" />
        
        {/* Glow Track under the Trail */}
        <div className="absolute left-[5%] right-[5%] bottom-10 h-3 bg-teal-400/20 filter blur-sm pointer-events-none" />

        {/* JUMP ARCS (SVG OVERLAY WITH STANDARDS-COMPLIANT NUMERICAL COORDINATES) */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffb300" />
              <stop offset="50%" stopColor="#00e676" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Completed Jumps as glowing curved arcs with labels */}
          {completedJumps.map((jump, i) => {
            const x1Pct = getMilestonePercent(jump.from);
            const x2Pct = getMilestonePercent(jump.to);

            const x1 = (x1Pct / 100) * svgWidth;
            const x2 = (x2Pct / 100) * svgWidth;
            const arcDistance = Math.abs(x2 - x1);
            const height = Math.min(80, Math.max(40, arcDistance * 0.35));
            const midX = (x1 + x2) / 2;
            const midY = groundY - height;

            return (
              <g key={`jump-${i}-${jump.from}-${jump.to}`} className="animate-fadeIn">
                {/* Arc Path */}
                <path
                  d={`M ${x1} ${groundY} Q ${midX} ${midY} ${x2} ${groundY}`}
                  fill="none"
                  stroke="url(#arcGlow)"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                  filter="url(#glowFilter)"
                  className="animate-pulse"
                />

                {/* Arrowhead at landing */}
                <circle cx={x2} cy={groundY} r="4" fill="#00e676" stroke="#ffffff" strokeWidth="1.5" />

                {/* Jump Badge (+X Lanterns) */}
                <foreignObject
                  x={midX - 45}
                  y={midY - 22}
                  width="90"
                  height="34"
                  className="overflow-visible"
                >
                  <div className="flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-black text-[11px] sm:text-xs shadow-[0_0_12px_rgba(0,255,180,0.8)] border border-white flex items-center gap-1 scale-105 animate-popIn">
                      <span>+{jump.increment}</span>
                      <span>🏮</span>
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* MILESTONE MARKERS (JACK-O'-LANTERNS & STONE POSTS) */}
        {milestones.map((num, idx) => {
          const isReached = num <= currentNumber;
          const isTarget = num === targetNumber;
          const isStart = num === startNumber;
          const xPct = getMilestonePercent(num);

          return (
            <div
              key={`mile-${num}`}
              style={{ left: `${xPct}%` }}
              className="absolute bottom-4 transform -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-500"
            >
              {/* Lantern on the milestone */}
              <div
                className={`text-xl sm:text-2xl transition-all duration-300 ${
                  isReached
                    ? 'filter drop-shadow-[0_0_10px_rgba(255,180,0,0.9)] scale-110'
                    : 'opacity-40 grayscale'
                }`}
              >
                {isTarget ? '🎃' : isStart ? '🏮' : '🕯️'}
              </div>

              {/* Milestone Post Marker */}
              <div
                className={`px-2 py-0.5 rounded-xl border-2 font-mono text-xs sm:text-sm font-black transition-all shadow-md ${
                  isReached
                    ? isTarget
                      ? 'bg-amber-400 text-black border-white shadow-[0_0_15px_rgba(255,180,0,0.8)]'
                      : 'bg-teal-400 text-black border-white shadow-[0_0_12px_rgba(0,255,200,0.7)]'
                    : 'bg-slate-900/90 text-gray-400 border-slate-700'
                }`}
              >
                {num}
              </div>

              {/* Milestone Label */}
              <span className="text-[9px] font-bold text-gray-300 mt-0.5 uppercase tracking-tight hidden sm:block">
                {isStart ? 'Start' : isTarget ? 'Goal' : `Step ${idx}`}
              </span>
            </div>
          );
        })}

        {/* GHOSTIE FLOATING CHARACTER AT CURRENT POSITION */}
        <div
          style={{
            left: `${ghostiePercent}%`,
            transition: 'left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="absolute bottom-16 sm:bottom-20 transform -translate-x-1/2 z-30 pointer-events-none"
        >
          <GhostieCharacter
            mood={isCompleted ? 'celebrating' : isJumping ? 'hopping' : 'curious'}
            lanternCount={totalCollected}
            size="md"
          />

          {/* Animated 4 Lanterns Appearing / Joining Collection Effect */}
          {isJumping && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 animate-bounce pointer-events-none">
              <span className="text-xl animate-pulse">🏮</span>
              <span className="text-xl animate-pulse delay-75">🏮</span>
              <span className="text-xl animate-pulse delay-150">🏮</span>
              <span className="text-xl animate-pulse delay-200">🏮</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. COMPACT NUMBER SENTENCE STRIP THAT UPDATES AFTER EACH STEP */}
      <div className="mt-1 p-2 sm:p-2.5 rounded-2xl bg-black/50 border border-teal-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 z-10 text-xs sm:text-sm">
        {/* Dynamic Number Sentence */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="text-gray-400 font-bold">Number Sentence:</span>
          {completedJumps.length === 0 ? (
            <span className="text-teal-300 italic">Ghostie is ready! Choose a jump to start collecting lanterns.</span>
          ) : completedJumps.length === 1 ? (
            /* After jump 1: e.g. 4 (or +4 lanterns) */
            <div className="flex items-center gap-1.5 font-mono font-black text-amber-300 text-sm sm:text-base">
              <span className="px-2 py-0.5 rounded-lg bg-teal-900/80 border border-teal-400/60 text-teal-200">
                +{completedJumps[0].increment}
              </span>
              <span className="text-xs text-gray-300 font-sans font-medium">({completedJumps[0].increment} lanterns collected so far)</span>
            </div>
          ) : (
            /* After jump 2+: e.g. 4 + 60 = 64, or 4 + 60 + 400 = 464 */
            <div className="flex items-center gap-1.5 font-mono font-black text-amber-300 text-sm sm:text-base flex-wrap">
              {completedJumps.map((j, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-gray-400">+</span>}
                  <span className="px-1.5 py-0.5 rounded-lg bg-teal-900/80 border border-teal-400/40 text-teal-200">
                    {j.increment}
                  </span>
                </span>
              ))}
              <span className="text-gray-400">=</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-black shadow font-black">
                {totalCollected}
              </span>
            </div>
          )}
        </div>

        {/* Subtraction Connection when Destination Reached */}
        {isCompleted && (
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-xl border border-emerald-400 shadow animate-popIn">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {targetNumber} − {startNumber} = {totalCollected} (Distance = {totalCollected} lanterns!)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
