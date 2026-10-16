import React from 'react';
import { Sparkles, ArrowRight, Dices, Compass, Unlock } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

/**
 * MathOLanternCelebration Component
 * Celebratory modal displayed when Ghostie reaches the target destination.
 * 
 * Re-emphasizes the core mathematical truth:
 * The total lanterns collected from jumps equal the distance (difference) between the two numbers!
 * Highlights prerequisite progression and unlocking of subsequent challenges.
 */
export default function MathOLanternCelebration({
  isOpen = false,
  minuend = 500,
  subtrahend = 36,
  diff = 464,
  completedJumps = [],
  levelTitle = '',
  onNextLevel,
  onPlayAgain,
  onOpenSandbox,
  hasNextLevel = true,
  justUnlockedLevel = null,
}) {
  if (!isOpen) return null;

  const totalCollected = completedJumps.reduce((s, j) => s + j.increment, 0);

  // Stepping chain: e.g. [36, 40, 100, 500]
  const journeyMilestones = [
    subtrahend,
    ...completedJumps.map((j) => j.to),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0f2938] via-[#091e2b] to-[#040e16] border-3 border-amber-400 rounded-[36px] p-5 sm:p-8 text-center text-white shadow-[0_0_60px_rgba(255,180,0,0.5)] flex flex-col items-center gap-3.5 animate-popIn">
        {/* Trophy / Lantern Header Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
          🏆
        </div>

        {/* Celebration Title */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-teal-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{levelTitle || 'Trail Complete!'}</span>
          </span>
          <h2
            id="celebration-title"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-emerald-300 font-['Creepster',cursive] tracking-wide"
          >
            Ghostie made it! 🏮
          </h2>
          <p className="text-sm sm:text-base text-gray-200 font-semibold">
            You collected <span className="text-amber-300 font-black text-lg sm:text-xl">{totalCollected}</span> lanterns!
          </p>
        </div>

        {/* Prerequisite Unlock Banner */}
        {justUnlockedLevel !== null && (
          <div className="w-full bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-400 text-emerald-200 p-2.5 sm:p-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-popIn">
            <Unlock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              🎉 Prerequisite Completed! Challenge {justUnlockedLevel} Unlocked!
            </span>
          </div>
        )}

        {/* The Mathematical Journey Map */}
        <div className="w-full bg-black/50 border-2 border-teal-500/50 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 text-left shadow-inner">
          {/* Completed Journey Chain */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-300">
              Completed Journey:
            </span>
            <div className="flex items-center gap-2 flex-wrap font-mono font-black text-xs sm:text-sm text-white bg-teal-950/80 p-2 rounded-xl border border-teal-500/40">
              {journeyMilestones.map((milestone, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-amber-400 font-sans">→</span>}
                  <span
                    className={`px-2 py-0.5 rounded-lg ${
                      idx === 0
                        ? 'bg-teal-800 text-teal-100'
                        : idx === journeyMilestones.length - 1
                        ? 'bg-amber-400 text-black'
                        : 'bg-teal-900 text-teal-200'
                    }`}
                  >
                    {milestone}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Final Calculation Equation */}
          <div className="pt-2 border-t border-teal-500/30 flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-300">
              Final Calculation:
            </span>
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400/80 text-emerald-200 font-mono text-sm sm:text-base font-black text-center shadow">
              {minuend} − {subtrahend} = {completedJumps.map((j) => j.increment).join(' + ')} ={' '}
              <span className="text-white underline decoration-amber-400 font-black">
                {totalCollected}
              </span>{' '}
              {totalCollected === diff ? '✨' : `(Goal: ${diff})`}
            </div>
          </div>
        </div>

        {/* Core Lesson Conclusion */}
        <div className="bg-purple-950/80 border border-purple-500/50 rounded-xl p-3 text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-md text-left flex items-start gap-2">
          <span className="text-base sm:text-lg">💡</span>
          <span>
            <strong className="text-amber-300">Conclusion:</strong> The total lanterns collected ({totalCollected}) are the distance between the target ({minuend}) and starting number ({subtrahend})!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-1">
          {hasNextLevel && onNextLevel && (
            <button
              onClick={() => {
                sounds.playPop();
                onNextLevel();
              }}
              type="button"
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-sm shadow-[0_0_20px_rgba(255,180,0,0.6)] flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Play Next Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {onPlayAgain && (
            <button
              onClick={() => {
                sounds.playPop();
                onPlayAgain();
              }}
              type="button"
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 border-2 border-purple-500/60 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
              title="Play this level again with a new randomized question"
            >
              <Dices className="w-4 h-4" />
              <span>🎲 New Question</span>
            </button>
          )}

          {onOpenSandbox && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenSandbox();
              }}
              type="button"
              className="w-full sm:w-auto py-3 px-3.5 rounded-2xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 border-2 border-teal-400/60 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Sandbox</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
