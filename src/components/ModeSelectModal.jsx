import React from 'react';
import { BookOpen, Star, Sparkles, Printer, ArrowRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ModeSelectModal Component
 * Prompts the child to choose their preferred learning mode:
 * 
 * Option A — Game Mode:
 * "Play through levels, help the houses, and earn rewards!"
 * (Level progression, points, animations, and achievements)
 * 
 * Option B — Notebook Mode:
 * "Explore subtraction at your own pace, like working in your maths notebook!"
 * (Interactive maths notebook / sandbox, no points pressure, print worksheet)
 */
export default function ModeSelectModal({ isOpen = true, onSelectMode, onBackToWelcome }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mode-select-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-[#1b0a33]/98 border-3 border-purple-500/80 rounded-[36px] p-5 sm:p-8 text-center text-white shadow-[0_0_50px_rgba(184,69,255,0.45)] flex flex-col gap-4 animate-popIn">
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/50 text-amber-300 font-black text-xs uppercase tracking-wider mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Module 1: Trick-or-Think</span>
        </div>

        {/* Modal Heading */}
        <h2
          id="mode-select-title"
          className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-300 font-['Creepster',cursive] tracking-wide"
        >
          Choose Your Trick-or-Think Mode
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-md mx-auto -mt-2">
          Borrow, regroup, and help the houses share their candies! Select Game Mode or Notebook Mode:
        </p>

        {/* Two Equal Learning Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 text-left">
          {/* OPTION A: GAME MODE */}
          <button
            onClick={() => {
              sounds.playSuccess();
              onSelectMode('game');
            }}
            type="button"
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-900/70 via-[#260e47] to-[#17062e] border-3 border-amber-400/80 hover:border-amber-300 shadow-[0_0_20px_rgba(255,180,0,0.3)] hover:shadow-[0_0_30px_rgba(255,180,0,0.6)] transition-all transform hover:scale-[1.03] active:scale-98 flex flex-col justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-2xl shadow font-black">
                🎮
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase">
                5 Levels
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 group-hover:text-amber-200">
                Option A — Game Mode
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed mt-1">
                Play through levels, help the houses, and earn rewards!
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-1 text-[11px] text-purple-200 font-semibold border-t border-purple-800/60 pt-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Earn points, candies, and 3-star ratings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Progressive 5-level adventure with celebration</span>
              </div>
            </div>

            <div className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-400 group-hover:bg-amber-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-1.5">
              <span>Play Game Mode</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* OPTION B: NOTEBOOK MODE */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectMode('notebook');
            }}
            type="button"
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-950/70 via-[#0e2733] to-[#07161e] border-3 border-teal-400/80 hover:border-teal-300 shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.6)] transition-all transform hover:scale-[1.03] active:scale-98 flex flex-col justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-teal-400 text-black flex items-center justify-center text-2xl shadow font-black">
                📝
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400 text-teal-300 text-[10px] font-black uppercase">
                Math Sandbox
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-teal-300 group-hover:text-teal-200">
                Option B — Notebook Mode
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed mt-1">
                Explore subtraction at your own pace, like working in your maths notebook!
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-1 text-[11px] text-teal-200 font-semibold border-t border-teal-800/60 pt-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                <span>Jump freely between all 5 subtraction problems</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Includes printer-friendly A4 maths worksheet</span>
              </div>
            </div>

            <div className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-400 group-hover:bg-teal-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-1.5">
              <span>Open Notebook Mode</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Back Link */}
        {onBackToWelcome && (
          <button
            onClick={() => {
              sounds.playPop();
              onBackToWelcome();
            }}
            type="button"
            className="text-xs text-purple-300 hover:text-amber-300 transition-colors underline cursor-pointer mt-1 self-center"
          >
            ← Back to Module Selection
          </button>
        )}
      </div>
    </div>
  );
}
