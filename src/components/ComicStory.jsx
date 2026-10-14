import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Volume2, Sparkles, Play } from 'lucide-react';
import { COMIC_PAGES } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * ComicStory Component
 * "Learn the Trick" Storybook / Comic viewer mode
 * Allows young learners to read and listen through the entire subtraction trick story
 * without question gates or test anxiety.
 */
export default function ComicStory({ onStartGame }) {
  const [currentPage, setCurrentPage] = useState(0);
  const page = COMIC_PAGES[currentPage];

  const handleNext = () => {
    if (currentPage < COMIC_PAGES.length - 1) {
      sounds.playPop();
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      sounds.playPop();
      setCurrentPage((p) => p - 1);
    }
  };

  const handleSpeak = () => {
    sounds.speak(`${page.title}. ${page.text} ${page.quote}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-4 flex flex-col items-center">
      {/* Comic Book Frame */}
      <div className="w-full bg-[#1b0d33] border-4 border-amber-400/80 rounded-3xl p-5 sm:p-8 shadow-[0_0_40px_rgba(255,140,0,0.35)] relative overflow-hidden backdrop-blur-md">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-800/80 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-wider">
              Storybook: Learn the Trick
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              type="button"
              className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-yellow-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Read this page aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read to Me</span>
            </button>
            <span className="text-xs font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-700">
              Page {currentPage + 1} of {COMIC_PAGES.length}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1">
            {page.title}
          </h2>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-400 mb-4">
            {page.subtitle}
          </div>

          {/* Graphic Art Scene per Page */}
          <div className="w-full max-w-md h-48 sm:h-56 bg-[#100620] border-2 border-purple-600/50 rounded-2xl p-4 flex items-center justify-center my-2 shadow-inner relative overflow-hidden">
            {currentPage === 0 && (
              <div className="flex items-center justify-around w-full">
                <div className="text-center">
                  <div className="text-3xl">🏰</div>
                  <div className="text-[11px] font-bold text-purple-300">Hundreds</div>
                  <div className="text-lg font-black text-amber-300">5</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">🗼</div>
                  <div className="text-[11px] font-bold text-teal-300">Tens</div>
                  <div className="text-lg font-black text-amber-300">0</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">🎃</div>
                  <div className="text-[11px] font-bold text-orange-300">Ones</div>
                  <div className="text-lg font-black text-amber-300">0</div>
                </div>
              </div>
            )}

            {currentPage === 1 && (
              <div className="flex items-center justify-around w-full">
                <div className="text-center">
                  <div className="text-4xl">🎃</div>
                  <div className="text-xs font-bold text-orange-300 mt-1">Empty Bowl: 0</div>
                </div>
                <div className="text-2xl text-purple-400 animate-bounce">➡️</div>
                <div className="text-center">
                  <div className="text-4xl">👻🧙</div>
                  <div className="text-xs font-extrabold text-amber-300 mt-1">Need 53 Candies!</div>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🏰</div>
                  <div className="text-2xl animate-pulse">➡️ 🎒 (100 candies) ➡️</div>
                  <div className="text-3xl">🗼</div>
                </div>
                <div className="mt-3 px-3 py-1 bg-purple-900/80 rounded-full text-xs font-extrabold text-amber-300 border border-amber-500/40">
                  1 Hundred = 10 Tens! (Hundreds becomes 4, Tens becomes 10)
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🗼 (9 tens)</div>
                  <div className="text-2xl animate-pulse">➡️ 🎒 (10 candies) ➡️</div>
                  <div className="text-3xl">🎃 (10 ones)</div>
                </div>
                <div className="mt-3 px-3 py-1 bg-teal-900/80 rounded-full text-xs font-extrabold text-amber-300 border border-teal-500/40">
                  4 Hundreds + 9 Tens + 10 Ones = 500 Candies!
                </div>
              </div>
            )}

            {currentPage === 4 && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-4xl animate-bounce mb-1">🎉 447 🍬</div>
                <div className="text-sm font-extrabold text-emerald-300">
                  500 − 53 = 447 Candies Remaining!
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Ones: 10−3=7 | Tens: 9−5=4 | Hundreds: 4−0=4
                </div>
              </div>
            )}
          </div>

          {/* Story Text */}
          <p className="text-base sm:text-lg text-gray-100 font-medium leading-relaxed my-3 max-w-xl">
            {page.text}
          </p>

          {/* Character Quote Bubble */}
          <div className="bg-black/40 border border-amber-500/40 px-4 py-2 rounded-xl text-xs sm:text-sm text-amber-300 font-semibold italic">
            {page.quote}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-purple-800/80 mt-5">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            type="button"
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Page Dots */}
          <div className="flex items-center gap-1.5">
            {COMIC_PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sounds.playPop();
                  setCurrentPage(i);
                }}
                type="button"
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentPage ? 'bg-amber-400 scale-125' : 'bg-purple-800 hover:bg-purple-600'
                }`}
                aria-label={`Jump to page ${i + 1}`}
              />
            ))}
          </div>

          {currentPage < COMIC_PAGES.length - 1 ? (
            <button
              onClick={handleNext}
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartGame}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg animate-pulse cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Interactive Game!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
