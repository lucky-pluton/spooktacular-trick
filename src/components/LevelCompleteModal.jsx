import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Award,
  BookOpen,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * LevelCompleteModal Component
 * Celebratory modal popup displayed when a child completes all mathematical operations for a level.
 * Features:
 * - Levels 1 to 4: Level complete congratulations, math equation, point breakdown, stars, Continue button.
 * - Level 5: Grand Spooktacular Math Wizard victory modal with confetti, all 5 levels summary, final score, share.
 * - Accessible focus and dismiss handling (clicking backdrop does NOT accidentally skip an unfinished level).
 */
export default function LevelCompleteModal({
  isOpen = false,
  levelNumber = 1,
  totalLevels = 5,
  minuend = 500,
  subtrahend = 53,
  diff = 447,
  levelPoints = 550,
  totalScore = 550,
  stars = 3,
  noHintBonus = true,
  onContinue,
  onReview,
  onPlayAgain,
  onOpenStory,
  onReturnToMenu,
  completedLevels = [1],
}) {
  const [copied, setCopied] = useState(false);
  const isFinalVictory = levelNumber >= 5;

  const allLevelsSummary = [
    { num: 1, expr: '500 − 53', ans: '447', icon: '🎃' },
    { num: 2, expr: '400 − 65', ans: '335', icon: '🏚️' },
    { num: 3, expr: '300 − 28', ans: '272', icon: '🕸️' },
    { num: 4, expr: '600 − 84', ans: '516', icon: '🍬' },
    { num: 5, expr: '700 − 49', ans: '651', icon: '🏆' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (isFinalVictory) {
        sounds.playVictory();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff7700', '#ffd000', '#9b51e0', '#00ffcc', '#ffffff'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 60,
              angle: 60,
              spread: 60,
              origin: { x: 0 },
              colors: ['#ff7700', '#ffd000', '#9b51e0'],
            });
            confetti({
              particleCount: 60,
              angle: 120,
              spread: 60,
              origin: { x: 1 },
              colors: ['#00ffcc', '#ffd000', '#ffffff'],
            });
          }, 300);
        } catch (e) {
          console.warn('Confetti error', e);
        }
      } else {
        sounds.playSuccess();
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ff7700', '#ffd000', '#00ffcc'],
          });
        } catch (e) {
          console.warn('Confetti error', e);
        }
      }
    }
  }, [isOpen, isFinalVictory]);

  if (!isOpen) return null;

  const handleShare = async () => {
    const url = 'https://lucky-pluton.github.io/spooktacular-trick/';
    const shareData = {
      title: 'Spooktacular Trick – Halloween Math Game',
      text: `I just mastered borrowing across zeros in Spooktacular Trick! Solved all 5 levels with ${totalScore} points!`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('https://lucky-pluton.github.io/spooktacular-trick/').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg sm:max-w-xl bg-[#1b0a36] border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(255,140,0,0.5)] text-center overflow-hidden animate-popIn">
        {/* Decorative Top Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-amber-400/30 to-transparent blur-xl pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg mb-2">
          {isFinalVictory ? <Award className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          <span>{isFinalVictory ? 'Grand Finale Champion!' : `Level ${levelNumber} of ${totalLevels} Complete!`}</span>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide mb-1">
          {isFinalVictory ? "🏆 YOU'RE A SPOOKTACULAR MATH WIZARD! 🏆" : `🎃 LEVEL ${levelNumber} COMPLETE! 🎃`}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-300 mb-4">
          {isFinalVictory
            ? 'You solved all 5 subtraction problems across zeros with living haunted houses!'
            : 'You mastered the spooky borrowing trick!'}
        </p>

        {/* Completed Calculation Card */}
        <div className="bg-[#100620]/90 border-2 border-purple-500/60 rounded-2xl p-3 sm:p-4 mb-4 shadow-inner">
          <div className="text-xs text-purple-300 font-bold uppercase mb-1">
            Solved Subtraction Problem:
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
            {minuend} − {subtrahend} = <span className="text-emerald-400">{diff}</span>
          </div>
          <div className="text-[11px] sm:text-xs text-gray-300 mt-1">
            {Math.floor(minuend / 100)} Hundreds regrouped into {Math.floor(minuend / 100) - 1} Hundreds, 9 Tens, and 10 Ones!
          </div>
        </div>

        {/* Level 5 Grand Summary of All 5 Levels */}
        {isFinalVictory && (
          <div className="bg-[#0f0420]/90 border border-emerald-500/50 rounded-2xl p-3 mb-4 text-left">
            <div className="text-center font-extrabold text-xs text-amber-300 uppercase tracking-wider mb-2">
              🌟 All 5 Subtraction Challenges Solved:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {allLevelsSummary.map((lvl) => {
                const isDone = completedLevels.includes(lvl.num);
                return (
                  <div
                    key={lvl.num}
                    className="flex items-center justify-between p-2 rounded-xl bg-purple-950/70 border border-purple-700/60 font-mono"
                  >
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <span>{lvl.icon}</span>
                      <span>{lvl.expr}</span>
                    </span>
                    <span className="text-emerald-400 font-black">= {lvl.ans} {isDone ? '✓' : '★'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stars and Score Rewards Section */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Level Points Breakdown */}
          <div className="bg-purple-950/80 border border-purple-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-purple-300 uppercase font-bold">Points This Level</span>
            <span className="text-lg sm:text-xl font-black text-amber-300">+{levelPoints}</span>
            <div className="text-[9px] text-gray-400 font-medium">
              (+200 Level Bonus{noHintBonus ? ' + 50 No-Hint' : ''})
            </div>
          </div>

          {/* Total Game Score */}
          <div className="bg-purple-950/80 border border-purple-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-purple-300 uppercase font-bold">Total Score</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">{totalScore}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-3.5 h-3.5 ${
                    starIdx <= stars
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-700 text-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isFinalVictory ? (
          /* Victory Actions */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleShare}
                type="button"
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,160,0,0.5)] transition-transform hover:scale-102 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Victory Link</span>
              </button>

              <button
                onClick={handleCopy}
                type="button"
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-sm border border-purple-500/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 border-t border-purple-800/80">
              <button
                onClick={onPlayAgain}
                type="button"
                className="py-2.5 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>

              <button
                onClick={onOpenStory}
                type="button"
                className="py-2.5 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Review Story Comic</span>
              </button>

              {onReturnToMenu && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onReturnToMenu();
                  }}
                  type="button"
                  className="py-2.5 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🏠 Main Menu</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal Level Complete Actions */
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => {
                sounds.playPop();
                onContinue();
              }}
              type="button"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:shadow-[0_0_35px_rgba(16,185,129,0.9)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Level {levelNumber + 1}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onReview();
              }}
              type="button"
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-purple-900/70 hover:bg-purple-800 text-purple-200 border border-purple-600/60 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              title="Review the borrowing steps for this problem"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review This Trick</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
