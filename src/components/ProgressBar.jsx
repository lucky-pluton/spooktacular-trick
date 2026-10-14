import React from 'react';
import { RotateCcw, HelpCircle, Star, Lock } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ProgressBar Component
 * Displays the 5 mandatory game levels:
 * 🎃 Level 1 (500−53) → 🏚️ Level 2 (400−65) → 🕸️ Level 3 (300−28) → 🍬 Level 4 (600−84) → 🏆 Level 5 (700−49)
 * Clearly distinguishes Locked (🔒), Current (Glowing amber), and Completed (✓ / ⭐).
 */
export default function ProgressBar({
  currentLevel = 1,
  unlockedLevels = [1],
  completedLevels = [],
  onSelectLevel,
  currentStep = 1,
  totalSteps = 5,
  score = 100,
  stars = 3,
  onResetLevel,
  onRestartGame,
  onShowHint,
}) {
  const levelConfigs = [
    { num: 1, label: 'Level 1', math: '500 − 53', icon: '🎃' },
    { num: 2, label: 'Level 2', math: '400 − 65', icon: '🏚️' },
    { num: 3, label: 'Level 3', math: '300 − 28', icon: '🕸️' },
    { num: 4, label: 'Level 4', math: '600 − 84', icon: '🍬' },
    { num: 5, label: 'Level 5', math: '700 − 49', icon: '🏆' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-2">
      {/* Top Controls Row: Score, Stars, Hints, Replay, Restart */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        {/* Score & Stars */}
        <div className="flex items-center gap-2 sm:gap-3 bg-purple-950/80 border border-purple-500/50 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs sm:text-sm">
            <span>Score:</span>
            <span className="text-white text-base sm:text-lg font-black">{score}</span>
          </div>

          <div className="h-4 w-px bg-purple-700/60" />

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-4 h-4 ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(255,190,0,0.8)]'
                    : 'fill-gray-700 text-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Step in Level Badge */}
          {totalSteps > 1 && (
            <>
              <div className="h-4 w-px bg-purple-700/60" />
              <div className="text-[11px] font-bold text-purple-300">
                Step <span className="text-amber-300">{currentStep}</span>/{totalSteps}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons: Hint, Replay, Restart */}
        <div className="flex items-center gap-2">
          {onShowHint && (
            <button
              onClick={onShowHint}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
              title="Show a helpful hint"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>
          )}

          {onResetLevel && (
            <button
              onClick={onResetLevel}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 border border-purple-600/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Replay this level"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {onRestartGame && (
            <button
              onClick={onRestartGame}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
              title="Restart from Level 1"
            >
              Restart
            </button>
          )}
        </div>
      </div>

      {/* 5-Level Visual Progression Bar */}
      <div className="bg-[#140827]/90 border-2 border-purple-600/40 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md">
        <div className="relative flex items-center justify-between px-2 sm:px-6">
          {/* Background track line */}
          <div className="absolute top-1/2 left-6 right-6 h-1.5 bg-purple-950 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Active progress fill line */}
          <div
            className="absolute top-1/2 left-6 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, ((currentLevel - 1) / 4) * 100))}%`,
              maxWidth: 'calc(100% - 3rem)',
            }}
          />

          {/* Level Nodes */}
          {levelConfigs.map((lvl) => {
            const isCompleted = completedLevels.includes(lvl.num);
            const isCurrent = currentLevel === lvl.num;
            const isUnlocked = unlockedLevels.includes(lvl.num);
            const isLocked = !isUnlocked;

            return (
              <button
                key={lvl.num}
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isUnlocked && onSelectLevel && !isCurrent) {
                    sounds.playPop();
                    onSelectLevel(lvl.num);
                  }
                }}
                className={`relative z-10 flex flex-col items-center group transition-transform ${
                  isUnlocked && !isCurrent ? 'cursor-pointer hover:scale-105' : ''
                } ${isCurrent ? 'scale-110' : ''}`}
                title={
                  isLocked
                    ? `Level ${lvl.num} (${lvl.math}) is locked. Complete previous levels first!`
                    : isCompleted
                    ? `Level ${lvl.num}: ${lvl.math} (Completed!) Click to replay.`
                    : `Level ${lvl.num}: ${lvl.math}`
                }
              >
                {/* Level Circle Node */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 transition-all duration-300 shadow-lg ${
                    isCurrent
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-white text-black ring-4 ring-orange-500/50 shadow-[0_0_18px_rgba(255,160,0,0.9)] animate-pulse'
                      : isCompleted
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-300 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : isUnlocked
                      ? 'bg-purple-900 border-purple-500 text-purple-200 hover:border-amber-400'
                      : 'bg-gray-900/90 border-gray-700 text-gray-500 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xs sm:text-sm">✓</span>
                    </div>
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  ) : (
                    <span className="text-sm sm:text-base">{lvl.icon}</span>
                  )}

                  {/* Tiny Completed Star Badge */}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-amber-400 text-black font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-white shadow">
                      ★
                    </span>
                  )}
                </div>

                {/* Level Label & Calculation Subtitle */}
                <div className="flex flex-col items-center mt-1">
                  <span
                    className={`text-[10px] sm:text-xs font-extrabold tracking-tight ${
                      isCurrent
                        ? 'text-amber-300 drop-shadow'
                        : isCompleted
                        ? 'text-emerald-300'
                        : isUnlocked
                        ? 'text-purple-300'
                        : 'text-gray-500'
                    }`}
                  >
                    {lvl.label}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono font-semibold hidden md:block ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
                    }`}
                  >
                    {lvl.math}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
