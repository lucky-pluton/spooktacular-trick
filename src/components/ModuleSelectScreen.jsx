import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ModuleSelectScreen Component
 * Prompts the learner to choose between the two major educational modules:
 * 
 * 1. Module 1: Trick-or-Think (Place-value borrowing & candy regrouping)
 * 2. Module 2: Math O' Lantern (Counting up jumps & finding distance)
 */
export default function ModuleSelectScreen({
  onSelectModule, // (moduleId: 'trick_or_think' | 'math_o_lantern') => void
  onBackToWelcome,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-select-title"
      className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 animate-fadeIn select-none"
    >
      <div className="bg-[#17082e]/98 border-3 border-purple-500/80 rounded-[40px] p-5 sm:p-8 text-center text-white shadow-[0_0_60px_rgba(184,69,255,0.45)] backdrop-blur-md flex flex-col gap-5 animate-popIn">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/80 border border-purple-400/50 text-amber-300 font-black text-xs uppercase tracking-wider mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Choose Your Learning Adventure</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1 max-w-2xl mx-auto">
          <h2
            id="module-select-title"
            className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300 font-['Creepster',cursive] tracking-wide"
          >
            Two Spooky Ways to Master Subtraction!
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Both modules belong to the same Halloween learning world, but teach subtraction through completely different methods!
          </p>
        </div>

        {/* TWO MODULES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-1 text-left items-stretch">
          
          {/* MODULE 1: TRICK-OR-THINK */}
          <div
            onClick={() => {
              sounds.playSuccess();
              onSelectModule('trick_or_think');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sounds.playSuccess();
                onSelectModule('trick_or_think');
              }
            }}
            className="p-5 sm:p-7 rounded-[32px] bg-gradient-to-br from-purple-950/80 via-[#260c44]/90 to-[#16062a]/95 border-3 border-amber-400/80 hover:border-amber-300 shadow-[0_0_25px_rgba(255,180,0,0.3)] hover:shadow-[0_0_35px_rgba(255,180,0,0.6)] transition-all transform hover:scale-[1.02] active:scale-98 flex flex-col justify-between gap-4 cursor-pointer group"
          >
            {/* Module Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center text-3xl shadow-lg font-black">
                🏰
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Borrowing & Regrouping
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Module 1</span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-300 group-hover:text-amber-200 mt-0.5">
                Trick-or-Think
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-medium italic mt-1 leading-snug">
                "Borrow, regroup, and help the houses share their candies!"
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-1.5 text-xs text-purple-200 font-semibold border-t border-purple-800/60 pt-3">
              <div className="flex items-center gap-2">
                <span>🏮</span>
                <span>Living Hundreds, Tens & Ones haunted houses</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍬</span>
                <span>Base-10 candy sharing and place-value borrowing</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎮</span>
                <span>Game Mode (5 levels) & Notebook Mode with printables</span>
              </div>
            </div>

            {/* Button */}
            <div className="w-full mt-2 py-3 px-4 rounded-2xl bg-amber-400 group-hover:bg-amber-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-2 transition-all">
              <span>Enter Trick-or-Think</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* MODULE 2: MATH O' LANTERN */}
          <div
            onClick={() => {
              sounds.playLanternJump();
              onSelectModule('math_o_lantern');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sounds.playLanternJump();
                onSelectModule('math_o_lantern');
              }
            }}
            className="p-5 sm:p-7 rounded-[32px] bg-gradient-to-br from-teal-950/80 via-[#0a2633]/90 to-[#04141c]/95 border-3 border-teal-400/80 hover:border-teal-300 shadow-[0_0_25px_rgba(0,255,200,0.3)] hover:shadow-[0_0_35px_rgba(0,255,200,0.6)] transition-all transform hover:scale-[1.02] active:scale-98 flex flex-col justify-between gap-4 cursor-pointer group"
          >
            {/* Module Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 text-black flex items-center justify-center text-3xl shadow-lg font-black">
                🏮
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400 text-teal-300 text-[10px] font-black uppercase tracking-wider">
                Counting Up Method
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">Module 2</span>
              <h3 className="text-xl sm:text-2xl font-black text-teal-300 group-hover:text-teal-200 mt-0.5">
                Math O' Lantern
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-medium italic mt-1 leading-snug">
                "Help Ghostie collect lanterns and discover the distance between numbers!"
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-1.5 text-xs text-teal-200 font-semibold border-t border-teal-800/60 pt-3">
              <div className="flex items-center gap-2">
                <span>👻</span>
                <span>Ghostie & Witchy on the magical lantern trail</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>Count up to friendly benchmarks (tens & hundreds)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧪</span>
                <span>Guided Journey (Tutorial + 5 challenges) & Sandbox</span>
              </div>
            </div>

            {/* Button */}
            <div className="w-full mt-2 py-3 px-4 rounded-2xl bg-teal-400 group-hover:bg-teal-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-2 transition-all">
              <span>Enter Math O' Lantern</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
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
            ← Back to Welcome Screen
          </button>
        )}
      </div>
    </div>
  );
}
