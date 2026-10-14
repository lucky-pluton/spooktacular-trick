import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Copy, Check, RotateCcw, Star, Award, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * GameSummary Component
 * Celebratory Halloween victory screen displayed upon completing all 5 mandatory levels.
 * Displays:
 * - All 5 completed levels with math calculations and checkmarks
 * - Final score and stars
 * - Place-value borrowing recap
 * - "Play Again", "Review Borrowing Trick", and public share buttons
 */
export default function GameSummary({
  score = 100,
  stars = 3,
  completedLevels = [1, 2, 3, 4, 5],
  onPlayAgain,
  onOpenStory,
  onOpenPractice,
}) {
  const [copied, setCopied] = useState(false);

  const levelsSummary = [
    { num: 1, title: 'The Spooky 500 − 53 Trick', expr: '500 − 53', ans: '447', icon: '🎃' },
    { num: 2, title: 'Haunted Tower 400 − 65', expr: '400 − 65', ans: '335', icon: '🏚️' },
    { num: 3, title: 'Midnight Mansion 300 − 28', expr: '300 − 28', ans: '272', icon: '🕸️' },
    { num: 4, title: 'Witch\'s Brew 600 − 84', expr: '600 − 84', ans: '516', icon: '🍬' },
    { num: 5, title: 'Grand Pumpkin 700 − 49', expr: '700 − 49', ans: '651', icon: '🏆' },
  ];

  useEffect(() => {
    // Launch celebratory Halloween confetti shower
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
      }, 350);
    } catch (e) {
      console.warn('Confetti error', e);
    }
  }, []);

  const getShareUrl = () => {
    return 'https://lucky-pluton.github.io/spooktacular-trick/';
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Spooktacular Trick – Halloween Math Game',
      text: 'I just completed all 5 levels of Spooktacular Trick and mastered subtraction across zeros! Try it yourself:',
      url: getShareUrl(),
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
    navigator.clipboard.writeText(getShareUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-4 flex flex-col items-center animate-fadeIn">
      <div className="w-full bg-[#1b0d33] border-4 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(255,140,0,0.45)] backdrop-blur-md text-center relative overflow-hidden">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg mb-3">
          <Award className="w-4 h-4" />
          <span>Grand Halloween Subtraction Master!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Main Victory Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide mb-1">
          All 5 Levels Completed! 🎃
        </h1>
        <p className="text-sm sm:text-base font-bold text-amber-300 mb-4">
          You mastered borrowing across zeros with the living haunted houses!
        </p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 my-2">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                starIdx <= stars
                  ? 'fill-amber-400 text-amber-300 drop-shadow-[0_0_10px_rgba(255,200,0,0.8)] scale-110'
                  : 'fill-gray-700 text-gray-700'
              }`}
            />
          ))}
        </div>
        <div className="text-sm font-extrabold text-purple-200 mb-5">
          Final Score: <span className="text-amber-400 text-xl font-black">{score} Points</span>
        </div>

        {/* All 5 Completed Levels Grid */}
        <div className="w-full bg-[#100620]/90 border-2 border-purple-600/70 rounded-2xl p-3 sm:p-4 mb-5 text-left shadow-inner">
          <div className="text-center font-extrabold text-xs sm:text-sm text-amber-300 uppercase tracking-wider mb-3 border-b border-purple-800/80 pb-1.5 flex items-center justify-center gap-2">
            <span>🏆</span>
            <span>Your 5 Completed Subtraction Challenges</span>
            <span>🌟</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {levelsSummary.map((lvl) => {
              const isDone = completedLevels.includes(lvl.num);
              return (
                <div
                  key={lvl.num}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/70 border border-emerald-500/50 shadow"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lvl.icon}</span>
                    <div>
                      <div className="text-[11px] font-bold text-purple-300">Level {lvl.num}</div>
                      <div className="text-xs sm:text-sm font-black text-white font-mono">
                        {lvl.expr} = <span className="text-emerald-400">{lvl.ans}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Solved ★' : 'Completed'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recap Box: Why the Math Trick Works */}
        <div className="bg-[#100620]/90 border-2 border-purple-600/70 rounded-2xl p-4 text-left mb-6 shadow-inner">
          <div className="text-center font-extrabold text-xs sm:text-sm text-amber-300 uppercase tracking-wider mb-2 border-b border-purple-800/80 pb-1">
            🧠 The Spooktacular Trick Rule of Regrouping
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">1.</span>
              <span>When the <b>Ones House</b> and <b>Tens House</b> have 0 candies, always borrow from the <b>Hundreds House</b> first.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">2.</span>
              <span><b>1 Hundred = 10 Tens (100 candies)</b>. The Hundreds House decreases by 1, and the Tens House gets 10 tens!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0">3.</span>
              <span>The <b>Tens House</b> then gives 1 ten to the Ones House. Now Tens has <b>9 Tens</b>, and Ones has <b>10 Ones</b>!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">4.</span>
              <span>Now subtraction is easy in all 3 columns from right to left: <b>Ones</b>, then <b>Tens</b>, then <b>Hundreds</b>!</span>
            </li>
          </ul>
        </div>

        {/* Social Sharing & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <button
            onClick={handleShare}
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,160,0,0.5)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Game With Friends</span>
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-white font-extrabold text-sm sm:text-base border border-purple-500/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Link Copied! 🎉' : 'Copy Public Link'}</span>
          </button>
        </div>

        {/* Toast confirmation */}
        {copied && (
          <div className="text-xs text-emerald-300 font-bold mb-3 animate-pulse">
            ✓ Public game link copied to your clipboard! Ready to share!
          </div>
        )}

        {/* Navigation Buttons: Play Again, Review Trick Story, Try Practice */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-purple-800/80">
          <button
            onClick={onPlayAgain}
            type="button"
            className="px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onOpenStory}
            type="button"
            className="px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Borrowing Trick (Comic)</span>
          </button>

          <button
            onClick={onOpenPractice}
            type="button"
            className="px-4 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Custom Numbers Sandbox 🧪</span>
          </button>
        </div>
      </div>
    </div>
  );
}
