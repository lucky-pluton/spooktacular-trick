import React from 'react';
import { RotateCcw, HelpCircle, Star } from 'lucide-react';

/**
 * ProgressBar Component
 * Shows progress through the 5 scenes, player score/stars, and quick scene controls.
 */
export default function ProgressBar({
  currentScene = 1,
  totalScenes = 5,
  score = 0,
  stars = 3,
  onResetScene,
  onRestartGame,
  onShowHint,
}) {
  const steps = [
    { num: 1, label: 'Street', icon: '🦇' },
    { num: 2, label: 'Ones', icon: '🎃' },
    { num: 3, label: 'Hundreds', icon: '🏰' },
    { num: 4, label: 'Tens', icon: '🗼' },
    { num: 5, label: 'Trick or Treat!', icon: '🍬' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-3">
      {/* Top Controls Row: Score, Stars, Hints, Reset */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        {/* Score & Stars */}
        <div className="flex items-center gap-2 sm:gap-3 bg-purple-950/70 border border-purple-500/40 rounded-xl px-3 py-1.5 shadow">
          <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs sm:text-sm">
            <span>Score:</span>
            <span className="text-white text-base sm:text-lg">{score}</span>
          </div>

          <div className="h-4 w-px bg-purple-700/60" />

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-4 h-4 ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-700 text-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons: Hint, Replay, Restart */}
        <div className="flex items-center gap-2">
          {onShowHint && (
            <button
              onClick={onShowHint}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              title="Show a helpful hint"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>
          )}

          {onResetScene && (
            <button
              onClick={onResetScene}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-600/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Replay this scene"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {onRestartGame && (
            <button
              onClick={onRestartGame}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-bold transition-all"
              title="Start from beginning"
            >
              Restart
            </button>
          )}
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-purple-900/60 -translate-y-1/2 z-0" />
        {/* Active progress fill line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 via-teal-400 to-amber-400 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentScene - 1) / (totalScenes - 1)) * 100}%` }}
        />

        {/* Step Nodes */}
        {steps.map((s) => {
          const isDone = s.num < currentScene;
          const isCurrent = s.num === currentScene;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all duration-300 shadow-md ${
                  isCurrent
                    ? 'bg-amber-400 border-white text-black scale-110 shadow-[0_0_12px_rgba(255,180,0,0.8)]'
                    : isDone
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-purple-950 border-purple-800 text-gray-400'
                }`}
              >
                <span>{s.icon}</span>
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 font-bold tracking-tight hidden sm:block ${
                  isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-300' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
