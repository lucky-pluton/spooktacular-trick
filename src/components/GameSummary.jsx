import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Copy, Check, RotateCcw, Star, Award, BookOpen, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * GameSummary Component
 * Celebration screen displayed upon completing the 5th scene.
 * Triggers confetti, reviews key mathematical concepts, and provides sharing tools.
 */
export default function GameSummary({
  score = 100,
  stars = 3,
  onPlayAgain,
  onOpenStory,
  onOpenPractice,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory Halloween confetti
    sounds.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff7700', '#ffd000', '#9b51e0', '#00ffcc', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff7700', '#ffd000', '#9b51e0'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00ffcc', '#ffd000', '#ffffff'],
        });
      }, 350);
    } catch (e) {
      console.warn('Confetti error', e);
    }
  }, []);

  const getShareUrl = () => {
    return window.location.href;
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Spooktacular Trick – Halloween Math Game',
      text: 'I just solved 500 − 53 = 447 with living haunted houses and candy regrouping! Try it yourself:',
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
    <div className="w-full max-w-2xl mx-auto px-3 py-6 flex flex-col items-center animate-fade-in">
      <div className="w-full bg-[#1b0d33] border-4 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(255,140,0,0.45)] backdrop-blur-md text-center relative overflow-hidden">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg mb-3">
          <Award className="w-4 h-4" />
          <span>Spooktacular Master!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Main Victory Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide mb-1">
          Trick or Treat Success! 🎃
        </h1>
        <div className="text-base sm:text-lg font-bold text-amber-300 mb-4">
          500 − 53 = <span className="text-white text-xl sm:text-2xl font-black">447</span>
        </div>

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
          Final Score: <span className="text-amber-400 text-lg">{score} Points</span>
        </div>

        {/* Recap Box: Why the Math Trick Works */}
        <div className="bg-[#100620] border-2 border-purple-600/70 rounded-2xl p-4 sm:p-5 text-left mb-6 shadow-inner">
          <div className="text-center font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-wider mb-2 border-b border-purple-800/80 pb-1">
            🧠 Why the Trick Works (Place Value Recap)
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">1.</span>
              <span>The <b>Ones House</b> needed candies, but had 0. It asked the <b>Tens House</b>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">2.</span>
              <span>The <b>Tens House</b> had 0, so it borrowed <b>1 Hundred (100 candies)</b> from the Hundreds House. 1 Hundred = 10 Tens!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold shrink-0">3.</span>
              <span>The <b>Tens House</b> gave <b>1 Ten (10 candies)</b> to the Ones House. Now it has <b>9 Tens</b> left!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">4.</span>
              <span><b>500 became 4 Hundreds, 9 Tens, and 10 Ones</b>. (400 + 90 + 10 = 500 candies — total never changed!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold shrink-0">5.</span>
              <span>Subtraction is easy: 10−3 = <b>7</b>, 9−5 = <b>4</b>, 4−0 = <b>4</b>. Answer: <b>447</b>!</span>
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
            <span>{copied ? 'Link Copied! 🎉' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Toast confirmation */}
        {copied && (
          <div className="text-xs text-emerald-300 font-bold mb-3 animate-pulse">
            ✓ Public game link copied to your clipboard! Ready to paste and share!
          </div>
        )}

        {/* Other Modes Navigation */}
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
            <span>Read Comic Story</span>
          </button>

          <button
            onClick={onOpenPractice}
            type="button"
            className="px-4 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Try Other Numbers 🧪</span>
          </button>
        </div>
      </div>
    </div>
  );
}
