import React from 'react';
import { RotateCcw, HelpCircle, Star, Lock } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ProgressBar Component
 * Streamlined, compact header for Spooktacular Trick:
 * 
 * - Level selector pills (Levels 1-5): Locked (🔒), Current (Glowing amber), Completed (✓/★).
 * - Target subtraction equation badge (e.g., 500 − 53 = ?).
 * - Score & stars counter.
 * - Action buttons: Hint, Replay, Restart.
 * - Compact height so the haunted houses occupy almost the entire screen!
 */
export default function ProgressBar({
  currentLevel = 1,
  unlockedLevels = [1],
  completedLevels = [],
  onSelectLevel,
  currentStep = 1,
  totalSteps = 7,
  score = 100,
  stars = 3,
  onResetLevel,
  onRestartGame,
  onShowHint,
  onSwitchMode,
}) {
  const levelConfigs = [
    { num: 1, label: 'L1', math: '500 − 53', icon: '🎃' },
    { num: 2, label: 'L2', math: '400 − 65', icon: '🏚️' },
    { num: 3, label: 'L3', math: '300 − 28', icon: '🕸️' },
    { num: 4, label: 'L4', math: '600 − 84', icon: '🍬' },
    { num: 5, label: 'L5', math: '700 − 49', icon: '🏆' },
  ];

  const currentLevelConfig = levelConfigs.find((l) => l.num === currentLevel) || levelConfigs[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-1 flex items-center justify-between gap-2 flex-wrap">
      {/* Left: Level Progression Pills & Target Math Problem */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Level Badges (1..5) */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-purple-800/60 rounded-2xl p-1 shadow-inner">
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
                className={`relative px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_12px_rgba(255,180,0,0.8)] scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:border-emerald-300 cursor-pointer'
                    : isUnlocked
                    ? 'bg-purple-900/60 border border-purple-600/40 text-purple-200 hover:border-amber-400 cursor-pointer'
                    : 'bg-black/50 border border-white/5 text-gray-500 opacity-50 cursor-not-allowed'
                }`}
                title={
                  isLocked
                    ? `Level ${lvl.num} (${lvl.math}) is locked`
                    : isCompleted
                    ? `Level ${lvl.num}: ${lvl.math} (Completed!) Click to replay`
                    : `Level ${lvl.num}: ${lvl.math}`
                }
              >
                {isCompleted ? (
                  <span>✓</span>
                ) : isLocked ? (
                  <Lock className="w-3 h-3 text-gray-500" />
                ) : (
                  <span>{lvl.icon}</span>
                )}
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Target Math Problem */}
        <div className="hidden sm:flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/50 rounded-xl px-3 py-1 shadow">
          <span className="text-[10px] uppercase font-bold text-purple-300">Target:</span>
          <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider">
            {currentLevelConfig.math} = ?
          </span>
        </div>
      </div>

      {/* Right: Score, Stars, Step Counter & Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Score & Stars Badge */}
        <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-500/50 rounded-xl px-3 py-1 shadow">
          <div className="flex items-center gap-1 text-xs font-black text-amber-400">
            <span>Score:</span>
            <span className="text-white text-sm sm:text-base font-black">{score}</span>
          </div>

          <div className="h-3.5 w-px bg-purple-700/60" />

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-3.5 h-3.5 ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(255,190,0,0.8)]'
                    : 'fill-gray-700 text-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Step in Level */}
          {totalSteps > 1 && (
            <>
              <div className="h-3.5 w-px bg-purple-700/60" />
              <span className="text-[11px] font-bold text-purple-300 hidden md:inline">
                Step <b className="text-amber-300">{currentStep}</b>/{totalSteps}
              </span>
            </>
          )}
        </div>

        {/* Action Buttons: Hint, Replay, Restart */}
        <div className="flex items-center gap-1.5">
          {onShowHint && (
            <button
              onClick={onShowHint}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1 transition-all shadow cursor-pointer active:scale-95"
              title="Show a helpful hint"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hint</span>
            </button>
          )}

          {onResetLevel && (
            <button
              onClick={onResetLevel}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 border border-purple-600/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
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
              className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
              title="Restart from Level 1"
            >
              Restart
            </button>
          )}

          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-teal-950/70 hover:bg-teal-900 text-teal-300 border border-teal-500/50 text-[11px] font-bold transition-all cursor-pointer active:scale-95 hidden sm:flex items-center gap-1"
              title="Switch to Notebook Mode"
            >
              <span>📓 Notebook</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
